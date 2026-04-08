import { useEffect, useRef, useState } from "react";

interface PDFPageViewerProps {
  url: string;
  page: number;
  className?: string;
  width?: number;
}

let pdfJsLoaded = false;
let pdfJsLoading = false;
const pdfJsCallbacks: Array<() => void> = [];

function loadPdfJs(callback: () => void) {
  if (pdfJsLoaded) {
    callback();
    return;
  }
  pdfJsCallbacks.push(callback);
  if (pdfJsLoading) return;
  pdfJsLoading = true;
  const script = document.createElement("script");
  script.src =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
  script.onload = () => {
    (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    pdfJsLoaded = true;
    pdfJsLoading = false;
    pdfJsCallbacks.forEach(cb => cb());
    pdfJsCallbacks.length = 0;
  };
  document.head.appendChild(script);
}

export function PDFPageViewer({
  url,
  page,
  className = "",
  width = 600,
}: PDFPageViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    function renderPage() {
      const pdfjsLib = (window as any).pdfjsLib;
      if (!pdfjsLib || !canvasRef.current) return;
      setStatus("loading");
      pdfjsLib
        .getDocument({
          url,
          cMapUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/",
          cMapPacked: true,
        })
        .promise.then((pdf: any) => {
          if (cancelled) return;
          return pdf.getPage(Math.min(page, pdf.numPages));
        })
        .then((pdfPage: any) => {
          if (cancelled || !canvasRef.current) return;
          const viewport = pdfPage.getViewport({ scale: 1 });
          const scale = width / viewport.width;
          const scaledViewport = pdfPage.getViewport({ scale });
          const canvas = canvasRef.current;
          canvas.width = scaledViewport.width;
          canvas.height = scaledViewport.height;
          const ctx = canvas.getContext("2d");
          return pdfPage.render({
            canvasContext: ctx,
            viewport: scaledViewport,
          }).promise;
        })
        .then(() => {
          if (!cancelled) setStatus("ready");
        })
        .catch((err: any) => {
          if (!cancelled) {
            setErrorMsg(err?.message || "Error");
            setStatus("error");
          }
        });
    }
    loadPdfJs(renderPage);
    return () => {
      cancelled = true;
    };
  }, [url, page, width]);

  return (
    <div className={`relative bg-black ${className}`}>
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="text-xs text-white/60">Cargando imagen...</span>
          </div>
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center justify-center h-40 text-xs text-red-400 px-4 text-center">
          ⚠️ {errorMsg}
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-auto"
        style={{ display: status === "error" ? "none" : "block" }}
      />
    </div>
  );
}

export default PDFPageViewer;
