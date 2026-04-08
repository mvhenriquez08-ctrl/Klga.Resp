import React, { useEffect, useRef } from 'react';
import { ArrhythmiaData } from '@/lib/arrhythmiaData';

interface ECGChartProps {
  arrhythmia: ArrhythmiaData;
  isPlaying: boolean;
}

export const ECGChart: React.FC<ECGChartProps> = ({ arrhythmia, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Cuadrícula ECG estándar: 1 mm = gridSize px
    const gridSize = 20; 
    const centerY = height / 2;

    // ESCALA CLÍNICA: 10 mm/mV → 10mm * 20px/mm = 200px/mV
    const mmPerMv = 10;
    const pxPerMv = gridSize * mmPerMv;

    // VELOCIDAD: 25 mm/s
    const paperSpeed = 25; 
    const secondsPerPixel = 1 / (paperSpeed * gridSize);

    const drawGrid = () => {
      // Fondo papel ECG
      ctx.fillStyle = '#fdf6f0';
      ctx.fillRect(0, 0, width, height);

      // Grid mayor (5mm = 100px) — líneas rosas oscuras
      ctx.strokeStyle = '#f0b8b8';
      ctx.lineWidth = 1;
      for (let x = 0; x <= width; x += gridSize * 5) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += gridSize * 5) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Grid menor (1mm = 20px) — líneas rosas claras
      ctx.strokeStyle = '#fad4d4';
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Línea isoelectrónica central
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
        // Calcular el instante de tiempo real asociado a este pixel:
        const time = startTime + px * secondsPerPixel;

        // Obtener el voltaje en mV
        const valueMV = arrhythmia.waveformGenerator(time);

        // Convertir mV a píxeles
        const y = centerY - (valueMV * pxPerMv);

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
        // Avance de tiempo realista (60fps aprox)
        // 0.016s por frame = 1 segundo real por segundo de reloj
        timeRef.current += 0.016;
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
  }, [arrhythmia, isPlaying]);

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        width={1200}
        height={400}
        className="w-full h-full"
      />
    </div>
  );
};
