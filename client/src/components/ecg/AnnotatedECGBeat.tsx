import React, { useEffect, useRef } from 'react';

interface AnnotatedECGBeatProps {
  showAnnotations?: boolean;
  showValues?: boolean;
  highlightComponent?: string;
}

export const AnnotatedECGBeat: React.FC<AnnotatedECGBeatProps> = ({
  showAnnotations = true,
  showValues = true,
  highlightComponent
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const gridSize = 20;
    const centerY = height / 2;

    // Generar latido normal mejorado
    const generateNormalBeat = (x: number): number => {
      const phase = x / width; // 0 a 1
      let value = 0;

      // Onda P (0 a 0.1)
      if (phase < 0.1) {
        const p = phase / 0.1;
        value = 0.4 * Math.sin(p * Math.PI);
      }
      // Segmento PR (0.1 a 0.2)
      else if (phase < 0.2) {
        value = 0;
      }
      // Onda Q (0.2 a 0.25)
      else if (phase < 0.25) {
        const q = (phase - 0.2) / 0.05;
        value = -0.3 * Math.sin(q * Math.PI);
      }
      // Onda R (0.25 a 0.32)
      else if (phase < 0.32) {
        const r = (phase - 0.25) / 0.07;
        value = 2.0 * Math.sin(r * Math.PI);
      }
      // Onda S (0.32 a 0.38)
      else if (phase < 0.38) {
        const s = (phase - 0.32) / 0.06;
        value = -0.6 * Math.sin(s * Math.PI);
      }
      // Segmento ST (0.38 a 0.45)
      else if (phase < 0.45) {
        value = 0.05 * Math.sin((phase - 0.38) * Math.PI / 0.07);
      }
      // Onda T (0.45 a 0.65)
      else if (phase < 0.65) {
        const t = (phase - 0.45) / 0.2;
        value = 0.8 * Math.sin(t * Math.PI);
      }
      // Línea base (0.65 a 1)
      else {
        value = 0;
      }

      return value;
    };

    const drawGrid = () => {
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, width, height);

      // Grid mayor (5mm)
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 2;
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

      // Grid menor (1mm)
      ctx.strokeStyle = '#f5f5f5';
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
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const drawWaveform = () => {
      ctx.strokeStyle = '#e74c3c';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();

      for (let x = 0; x < width; x++) {
        const value = generateNormalBeat(x);
        const y = centerY - (value * gridSize * 8);

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    };

    const drawAnnotations = () => {
      if (!showAnnotations) return;

      const annotations = [
        { phase: 0.05, label: 'P', color: '#3498db', yOffset: -60 },
        { phase: 0.275, label: 'QRS', color: '#e74c3c', yOffset: -80 },
        { phase: 0.55, label: 'T', color: '#2ecc71', yOffset: -60 },
        { phase: 0.15, label: 'PR', color: '#9b59b6', yOffset: 40 },
        { phase: 0.415, label: 'ST', color: '#f39c12', yOffset: 40 },
      ];

      annotations.forEach((ann) => {
        const x = ann.phase * width;
        const value = generateNormalBeat(x);
        const y = centerY - (value * gridSize * 8);

        // Línea de anotación
        ctx.strokeStyle = ann.color;
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + ann.yOffset);
        ctx.stroke();
        ctx.setLineDash([]);

        // Círculo en el punto
        ctx.fillStyle = ann.color;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Etiqueta
        ctx.fillStyle = ann.color;
        ctx.font = 'bold 16px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(ann.label, x, y + ann.yOffset + 18);
      });
    };

    const drawValues = () => {
      if (!showValues) return;

      const values = [
        { label: 'Intervalo PR: 160 ms', y: 30 },
        { label: 'Ancho QRS: 80 ms', y: 55 },
        { label: 'Intervalo QT: 400 ms', y: 80 },
        { label: 'Frecuencia: 72 bpm', y: 105 },
      ];

      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(10, 10, 280, 110);

      ctx.fillStyle = '#fff';
      ctx.font = '13px Inter, sans-serif';
      ctx.textAlign = 'left';

      values.forEach((val) => {
        ctx.fillText(val.label, 20, val.y);
      });
    };

    drawGrid();
    drawWaveform();
    drawAnnotations();
    drawValues();
  }, [showAnnotations, showValues, highlightComponent]);

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        width={1000}
        height={400}
        className="w-full h-full"
      />
    </div>
  );
};
