import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Camera,
  Upload,
  Film,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { uploadAndSign } from "@/lib/storage";

interface Props {
  onFrameCapture: (imageUrl: string) => void;
  onVideoLoaded: (url: string) => void;
}

export default function VideoAnalysis({
  onFrameCapture,
  onVideoLoaded,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isVideo && !isImage) {
      toast({
        title: "Formato no soportado",
        description: "Usa video (MP4, AVI, MOV) o imagen (JPG, PNG)",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { signedUrl } = await uploadAndSign(
        "ultrasound-images",
        fileName,
        file
      );

      if (isImage) {
        onFrameCapture(signedUrl);
        toast({ title: "Imagen cargada", description: "Lista para análisis" });
      } else {
        setVideoUrl(signedUrl);
        onVideoLoaded(signedUrl);
        toast({ title: "Video cargado" });
      }
    } catch (err) {
      toast({
        title: "Error al subir",
        description: String(err),
        variant: "destructive",
      });
    }
    setIsUploading(false);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const stepFrame = (direction: number) => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    setIsPlaying(false);
    // ~30fps → 1 frame ≈ 0.033s
    videoRef.current.currentTime = Math.max(
      0,
      videoRef.current.currentTime + direction * 0.033
    );
  };

  const skipSeconds = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(
      0,
      Math.min(duration, videoRef.current.currentTime + seconds)
    );
  };

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
        const fileName = `frame-${Date.now()}.jpg`;
        try {
          const { signedUrl } = await uploadAndSign(
            "ultrasound-images",
            fileName,
            blob
          );
          onFrameCapture(signedUrl);
          toast({
            title: "Frame capturado",
            description: `t=${video.currentTime.toFixed(2)}s`,
          });
        } catch {
          toast({ title: "Error al capturar", variant: "destructive" });
        }
      },
      "image/jpeg",
      0.95
    );
  }, [onFrameCapture]);

  const changeSpeed = () => {
    const speeds = [0.25, 0.5, 1, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const newRate = speeds[nextIdx];
    setPlaybackRate(newRate);
    if (videoRef.current) videoRef.current.playbackRate = newRate;
  };

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-3">
      {/* Upload area or video player */}
      {!videoUrl ? (
        <div
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors bg-muted/30"
          onClick={() => fileInputRef.current?.click()}
        >
          <Film className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Cargar video o imagen ecográfica
          </p>
          <p className="text-xs text-muted-foreground/60">
            MP4, AVI, MOV, JPG, PNG — máx 50MB
          </p>
          {isUploading && (
            <p className="text-xs text-primary mt-2 animate-pulse">
              Subiendo archivo...
            </p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*,image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="relative bg-black">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full max-h-[400px] object-contain"
              onTimeUpdate={() =>
                setCurrentTime(videoRef.current?.currentTime || 0)
              }
              onLoadedMetadata={() =>
                setDuration(videoRef.current?.duration || 0)
              }
              onEnded={() => setIsPlaying(false)}
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <CardContent className="p-3 space-y-2">
            {/* Timeline */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 1}
                step={0.01}
                value={currentTime}
                onChange={e => {
                  const t = parseFloat(e.target.value);
                  if (videoRef.current) videoRef.current.currentTime = t;
                  setCurrentTime(t);
                }}
                className="flex-1 h-1.5 accent-primary"
              />
              <span>{formatTime(duration)}</span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => skipSeconds(-5)}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => stepFrame(-1)}
                  title="Frame anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  className="h-9 w-9"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => stepFrame(1)}
                  title="Frame siguiente"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => skipSeconds(5)}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={changeSpeed}
                >
                  {playbackRate}x
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={captureFrame}
                >
                  <Camera className="h-3.5 w-3.5 mr-1" /> Capturar frame
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => {
                    setVideoUrl(null);
                    setIsPlaying(false);
                  }}
                >
                  <Upload className="h-3.5 w-3.5 mr-1" /> Otro archivo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
