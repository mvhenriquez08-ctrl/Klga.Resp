import React, { useEffect, useRef } from 'react';
import { ArrhythmiaData } from '@/lib/arrhythmiaData';

interface ECGChartSyncProps {
  arrhythmia: ArrhythmiaData;
  isPlaying: boolean;
  sharedTime?: number;
  onTimeUpdate?: (time: number) => void;
  title?: string;
  height?: number;
  pixelsPerMm?: number;
}

export const ECGChartSync: React.FC<ECGChartSyncProps> = ({
  arrhythmia,
  isPlaying,
  sharedTime = 0,
  onTimeUpdate,
  title,
  height: customHeight,
  pixelsPerMm
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) return;

    // Configuración de la gráfica: 20 px = 1 mm
    const width = canvas.width;
    const height = customHeight || canvas.height;
    const gridSize = 20;
    const centerY = height / 2;

    // ESCALA CLÍNICA: 10 mm/mV → 200 px/mV
    const mmPerMv = 10;
    const pxPerMv = pixelsPerMm ? (pixelsPerMm * mmPerMv) : (gridSize * mmPerMv);

    // VELOCIDAD: 25 mm/s
    const paperSpeed = 25;
    const secondsPerPixel = 1 / (paperSpeed * gridSize);

    const drawGrid = () => {
      ctx.fillStyle = '#fdf6f0';
      ctx.fillRect(0, 0, width, height);

      // Grid mayor (5mm = 100px)
      ctx.strokeStyle = '#f0b8b8';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += gridSize * 5) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize * 5) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Grid menor (1mm = 20px)
      ctx.strokeStyle = '#fad4d4';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Línea central (isoelectrónica)
      ctx.strokeStyle = '#c0a0a0';
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const drawWaveform = (startTime: number) => {
      ctx.strokeStyle = '#c0392b';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();

      for (let px = 0; px < width; px++) {
        // Calcular el tiempo real para este píxel
        const time = startTime + px * secondsPerPixel;
        const value = arrhythmia.waveformGenerator(time);
        const y = centerY - (value * pxPerMv);

        if (px === 0) {
          ctx.moveTo(px, y);
        } else {
          ctx.lineTo(px, y);
        }
      }
      ctx.stroke();
    };

    const animate = () => {
      if (isPlaying) {
        timeRef.current += 0.016;
        if (onTimeUpdate) {
          onTimeUpdate(timeRef.current);
        }
      } else if (sharedTime !== undefined) {
        timeRef.current = sharedTime;
      }

      drawGrid();
      drawWaveform(timeRef.current);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [arrhythmia, isPlaying, sharedTime, onTimeUpdate]);

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
      {title && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2">
          <h3 className="font-semibold text-sm">{title}</h3>
          <p className="text-xs text-blue-100">{arrhythmia.name}</p>
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={600}
        height={300}
        className="w-full flex-1"
      />
    </div>
  );
};
