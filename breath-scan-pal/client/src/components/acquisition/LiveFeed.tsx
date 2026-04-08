import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  VideoOff,
  Camera,
  Circle,
  Square,
  Pause,
  AlertTriangle,
  Wifi,
  WifiOff,
  Monitor,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { uploadAndSign } from "@/lib/storage";

interface Props {
  onFrameCapture: (imageUrl: string) => void;
}

export default function LiveFeed({ onFrameCapture }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Connect to video source
  const connectSource = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(mediaStream);
      setIsConnected(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      toast({ title: "Fuente de video conectada" });
    } catch (err) {
      toast({
        title: "No se pudo conectar",
        description:
          "Verifica que hay una cámara o capturadora disponible y permite el acceso.",
        variant: "destructive",
      });
    }
  };

  const disconnect = () => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
    }
    setStream(null);
    setIsConnected(false);
    setIsFrozen(false);
    stopRecording();
  };

  // Freeze / unfreeze
  const toggleFreeze = () => {
    if (!videoRef.current) return;
    if (isFrozen) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
    setIsFrozen(!isFrozen);
  };

  // Capture frame
  const captureFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      async blob => {
        if (!blob) return;
        const fileName = `live-${Date.now()}.jpg`;
        try {
          const { signedUrl } = await uploadAndSign(
            "ultrasound-images",
            fileName,
            blob
          );
          onFrameCapture(signedUrl);
          toast({ title: "Frame capturado" });
        } catch {
          toast({ title: "Error al capturar", variant: "destructive" });
        }
      },
      "image/jpeg",
      0.95
    );
  }, [onFrameCapture]);

  // Record clip
  const startRecording = () => {
    if (!stream) return;
    chunksRef.current = [];
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    recorder.ondataavailable = e => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const fileName = `clip-${Date.now()}.webm`;
      const { error } = await supabase.storage
        .from("ultrasound-images")
        .upload(fileName, blob);
      if (error) {
        toast({ title: "Error al guardar clip", variant: "destructive" });
        return;
      }
      toast({ title: "Clip guardado", description: `${recordingTime}s` });
    };
    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stream]);

  return (
    <div className="space-y-3">
      {!isConnected ? (
        <div className="border-2 border-dashed rounded-lg p-8 text-center bg-muted/30 space-y-4">
          <Monitor className="h-12 w-12 mx-auto text-muted-foreground/40" />
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Conexión en tiempo real
            </p>
            <p className="text-xs text-muted-foreground/60 mb-4">
              Conecta una cámara, capturadora de video (HDMI/USB) o ecógrafo
              portátil compatible
            </p>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <Button onClick={connectSource}>
              <Wifi className="h-4 w-4 mr-2" /> Conectar fuente de video
            </Button>
            <p className="text-[10px] text-muted-foreground max-w-sm">
              Compatible con cámaras web, capturadoras USB/HDMI y ecógrafos
              portátiles con salida de video. La integración directa por API
              depende del fabricante del equipo.
            </p>
          </div>
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="relative bg-black">
            <video
              ref={videoRef}
              className="w-full max-h-[400px] object-contain"
              muted
              playsInline
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Status indicators */}
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge className="bg-green-600 text-white text-[10px]">
                <Wifi className="h-3 w-3 mr-1" /> EN VIVO
              </Badge>
              {isFrozen && (
                <Badge variant="secondary" className="text-[10px]">
                  <Pause className="h-3 w-3 mr-1" /> CONGELADO
                </Badge>
              )}
              {isRecording && (
                <Badge className="bg-red-600 text-white text-[10px] animate-pulse">
                  <Circle className="h-3 w-3 mr-1 fill-current" /> REC{" "}
                  {recordingTime}s
                </Badge>
              )}
            </div>
          </div>

          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={toggleFreeze}
                >
                  {isFrozen ? (
                    <Video className="h-3.5 w-3.5 mr-1" />
                  ) : (
                    <Pause className="h-3.5 w-3.5 mr-1" />
                  )}
                  {isFrozen ? "Reanudar" : "Congelar"}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={captureFrame}
                >
                  <Camera className="h-3.5 w-3.5 mr-1" /> Capturar
                </Button>
                {!isRecording ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={startRecording}
                  >
                    <Circle className="h-3.5 w-3.5 mr-1 text-red-500" /> Grabar
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={stopRecording}
                  >
                    <Square className="h-3.5 w-3.5 mr-1" /> Detener (
                    {recordingTime}s)
                  </Button>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={disconnect}
              >
                <WifiOff className="h-3.5 w-3.5 mr-1" /> Desconectar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-200">
        <p className="text-[10px] text-amber-800 flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          <span>
            La conexión en vivo depende del hardware disponible. Ecógrafos con
            salida HDMI/USB pueden conectarse mediante una capturadora de video.
            La integración directa por API estará disponible según
            compatibilidad del fabricante.
          </span>
        </p>
      </div>
    </div>
  );
}
