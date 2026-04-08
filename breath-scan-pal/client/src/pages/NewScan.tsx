import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, MicOff, Upload, Loader2, ChevronRight, Wind } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "../lib/trpc";
import { cn } from "../lib/utils";

type Step = "record" | "review" | "analyzing";

function toBase64(blob: Blob): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res((reader.result as string).split(",")[1]);
    reader.onerror = rej;
    reader.readAsDataURL(blob);
  });
}

export function NewScan() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("record");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [duration, setDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const createScan = trpc.scan.create.useMutation();
  const analyzeScan = trpc.scan.analyze.useMutation();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];
      mr.ondataavailable = e => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setIsRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
    } catch {
      toast.error("Microphone access denied");
    }
  }, []);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setStep("review");
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    if (step === "record") setStep("review");
  };

  const handleAnalyze = async () => {
    if (!audioBlob && !imageFile) {
      toast.error("Please record audio or upload an image first");
      return;
    }
    setStep("analyzing");

    try {
      let audioBase64: string | undefined;
      let imageBase64: string | undefined;

      if (audioBlob) {
        audioBase64 = await toBase64(audioBlob);
      }
      if (imageFile) {
        imageBase64 = await toBase64(imageFile);
      }

      const { scanId } = await createScan.mutateAsync({
        audioBase64,
        imageBase64,
        durationSeconds: duration || undefined,
        notes: notes.trim() || undefined,
      });

      await analyzeScan.mutateAsync({ scanId });
      toast.success("Scan analyzed successfully");
      navigate(`/scan/${scanId}`);
    } catch (err) {
      toast.error("Analysis failed. Please try again.");
      setStep("review");
    }
  };

  const formatDuration = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">New Scan</h1>
        <p className="text-gray-400 mt-1">
          Record your breathing or upload a chest scan image for AI analysis
        </p>
      </div>

      {step === "analyzing" ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 animate-spin" />
            <Wind className="absolute inset-0 m-auto w-6 h-6 text-cyan-400" />
          </div>
          <p className="text-white font-semibold">
            Analyzing your breath scan…
          </p>
          <p className="text-gray-400 text-sm text-center">
            Our AI is examining your respiratory patterns. This may take a
            moment.
          </p>
        </div>
      ) : (
        <>
          {/* Audio Recording */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-white">Audio Recording</h2>
            <p className="text-sm text-gray-400">
              Record 30–60 seconds of normal breathing for best results.
            </p>

            <div className="flex flex-col items-center gap-4 py-4">
              {isRecording ? (
                <>
                  <div className="flex gap-1 items-end h-8">
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-cyan-400 rounded-full animate-pulse"
                        style={{
                          height: `${20 + Math.sin(i * 1.5) * 12}px`,
                          animationDelay: `${i * 80}ms`,
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-cyan-400 font-mono text-lg">
                    {formatDuration(duration)}
                  </p>
                  <button
                    onClick={stopRecording}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    <MicOff className="w-4 h-4" />
                    Stop Recording
                  </button>
                </>
              ) : audioUrl ? (
                <>
                  <audio controls src={audioUrl} className="w-full" />
                  <p className="text-gray-400 text-sm">
                    Duration: {formatDuration(duration)}
                  </p>
                  <button
                    onClick={startRecording}
                    className="text-sm text-gray-400 hover:text-white underline"
                  >
                    Record again
                  </button>
                </>
              ) : (
                <button
                  onClick={startRecording}
                  className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  <Mic className="w-4 h-4" />
                  Start Recording
                </button>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-white">
              Chest Scan Image{" "}
              <span className="text-gray-500 font-normal text-sm">
                (optional)
              </span>
            </h2>
            <p className="text-sm text-gray-400">
              Upload a chest X-ray or other respiratory scan for visual
              analysis.
            </p>

            {imagePreview ? (
              <div className="space-y-3">
                <img
                  src={imagePreview}
                  alt="Scan preview"
                  className="w-full rounded-lg max-h-56 object-contain bg-gray-800"
                />
                <button
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="text-sm text-gray-400 hover:text-white underline"
                >
                  Remove image
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-cyan-500/50 transition-colors">
                <Upload className="w-8 h-8 text-gray-600" />
                <span className="text-sm text-gray-400">
                  Click to upload JPEG, PNG, or DICOM
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>

          {/* Notes */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
            <h2 className="font-semibold text-white">
              Notes{" "}
              <span className="text-gray-500 font-normal text-sm">
                (optional)
              </span>
            </h2>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Describe any symptoms, relevant history, or context…"
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          {/* Analyze button */}
          <button
            onClick={handleAnalyze}
            disabled={!audioBlob && !imageFile}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-colors",
              audioBlob || imageFile
                ? "bg-cyan-500 hover:bg-cyan-400 text-gray-950"
                : "bg-gray-800 text-gray-600 cursor-not-allowed"
            )}
          >
            Analyze Scan
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
}
