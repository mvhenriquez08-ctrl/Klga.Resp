import React from "react";

interface ECGTracingProps {
  arrhythmiaId: string;
  className?: string;
  width?: number;
  height?: number;
  showGrid?: boolean;
}

type PathFn = (width: number, height: number) => string;

const ECG_PATHS: Record<string, PathFn> = {
  "normal-sinus": (w, h) => {
    const cy = h * 0.6;
    let d = `M 0,${cy}`;
    for (let bx = 0; bx + 80 < w; bx += 110) {
      d += ` l 8,0 c 3,-6 8,-6 12,0 l 5,0 l 2,3 l 3,-27 l 3,5 l 2,0 l 5,0 c 3,-9 10,-9 16,0 l 54,0`;
    }
    return d;
  },
  "sinus-tachycardia": (w, h) => {
    const cy = h * 0.6;
    let d = `M 0,${cy}`;
    for (let bx = 0; bx + 60 < w; bx += 70) {
      d += ` l 5,0 c 3,-6 7,-6 11,0 l 3,0 l 2,3 l 3,-26 l 3,5 l 2,0 l 3,0 c 3,-8 9,-8 13,0 l 25,0`;
    }
    return d;
  },
  "sinus-bradycardia": (w, h) => {
    const cy = h * 0.6;
    let d = `M 0,${cy}`;
    for (let bx = 0; bx + 60 < w; bx += 155) {
      d += ` l 10,0 c 4,-7 10,-7 14,0 l 16,0 l 2,3 l 3,-27 l 3,5 l 2,0 l 5,0 c 4,-9 12,-9 18,0 l 82,0`;
    }
    return d;
  },
  "atrial-fibrillation": (w, h) => {
    const cy = h * 0.6;
    let d = `M 0,${cy}`;
    for (let x = 0; x < w; x += 3) {
      const jitter = Math.sin(x * 1.7) * 2.5 + Math.sin(x * 3.1) * 1.5;
      d += ` L ${x},${cy + jitter}`;
    }
    const qrsPos = [40, 105, 160, 240, 310, 390, 460, 540, 620, 700, 770, 840];
    for (const bx of qrsPos) {
      if (bx + 12 > w) break;
      d += ` M ${bx},${cy} l 2,3 l 3,-26 l 3,5 l 2,0 M ${bx + 10},${cy}`;
    }
    return d;
  },
  "atrial-flutter": (w, h) => {
    const cy = h * 0.6;
    let d = `M 0,${cy}`;
    for (let x = 0; x < w - 10; x += 20) {
      d += ` L ${x + 10},${cy - 10} L ${x + 20},${cy}`;
    }
    const qrsPos = [
      0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440, 480, 520, 560,
      600, 640, 680, 720, 760, 800,
    ];
    for (const bx of qrsPos.filter((_, i) => i % 2 === 0)) {
      if (bx + 12 > w) break;
      d += ` M ${bx},${cy} l 2,3 l 3,-28 l 3,6 l 2,0 M ${bx + 10},${cy}`;
    }
    return d;
  },
  svt: (w, h) => {
    const cy = h * 0.6;
    let d = `M 0,${cy}`;
    for (let bx = 0; bx + 50 < w; bx += 50) {
      d += ` l 4,0 l 2,3 l 3,-28 l 3,5 l 2,0 l 3,0 c 3,-9 9,-9 14,0 l 19,0`;
    }
    return d;
  },
  "ventricular-tachycardia": (w, h) => {
    const cy = h * 0.6;
    let d = `M 0,${cy}`;
    for (let bx = 0; bx + 70 < w; bx += 65) {
      d += ` l 2,0 l 4,-6 l 6,-28 l 6,36 l 5,-4 l 5,0 c 4,12 12,12 18,0 l 19,0`;
    }
    return d;
  },
  "ventricular-fibrillation": (w, h) => {
    const cy = h * 0.6;
    let d = `M 0,${cy}`;
    const amps = [
      18, -22, 14, -28, 8, -15, 25, -10, 20, -18, 12, -24, 16, -8, 22, -16, 10,
      -20, 14, -12, 26, -18, 8, -22, 16,
    ];
    for (let i = 0; i < amps.length; i++) {
      const x = (i / amps.length) * w;
      const nextX = ((i + 1) / amps.length) * w;
      const amp = amps[i];
      const nextAmp = amps[i + 1] || 0;
      d += ` C ${x + (nextX - x) * 0.3},${cy + amp} ${nextX - (nextX - x) * 0.3},${cy + nextAmp * 0.5} ${nextX},${cy + nextAmp}`;
    }
    return d;
  },
  torsades: (w, h) => {
    const cy = h * 0.6;
    let d = `M 0,${cy}`;
    for (let g = 0; g < 8; g++) {
      const baseAmp = Math.sin((g / 8) * Math.PI) * 22 + 5;
      for (let i = 0; i < 3; i++) {
        const sign = (g + i) % 2 === 0 ? -1 : 1;
        d += ` l 2,0 l 3,${sign * baseAmp * 0.4} l 4,${sign * -baseAmp} l 4,${sign * baseAmp * 0.6} l 2,0`;
      }
    }
    return d;
  },
  pvc: (w, h) => {
    const cy = h * 0.6;
    let d = `M 0,${cy}`;
    d += ` l 8,0 c 3,-6 8,-6 12,0 l 5,0 l 2,3 l 3,-26 l 3,5 l 2,0 l 4,0 c 3,-8 10,-8 14,0 l 14,0`;
    d += ` l 8,0 c 3,-6 8,-6 12,0 l 5,0 l 2,3 l 3,-26 l 3,5 l 2,0 l 4,0 c 3,-8 10,-8 14,0 l 10,0`;
    d += ` l 2,0 l 5,-12 l 8,-24 l 8,32 l 6,-6 l 4,0 c 4,14 12,14 18,0 l 5,0 l 20,0`;
    d += ` l 8,0 c 3,-6 8,-6 12,0 l 5,0 l 2,3 l 3,-26 l 3,5 l 2,0 l 4,0 c 3,-8 10,-8 14,0 l 14,0`;
    d += ` l 8,0 c 3,-6 8,-6 12,0 l 5,0 l 2,3 l 3,-26 l 3,5 l 2,0 l 4,0 c 3,-8 10,-8 14,0 l 14,0`;
    return d;
  },
  junctional: (w, h) => {
    const cy = h * 0.6;
    let d = `M 0,${cy}`;
    for (let bx = 0; bx + 80 < w; bx += 90) {
      d += ` l 10,0 l 2,3 l 3,-26 l 3,5 l 2,0 l 4,0 c 2,6 6,6 10,0 l 5,0 c 3,-8 10,-8 14,0 l 37,0`;
    }
    return d;
  },
  "first-degree-avb": (w, h) => {
    const cy = h * 0.6;
    let d = `M 0,${cy}`;
    for (let bx = 0; bx + 100 < w; bx += 115) {
      d += ` l 6,0 c 3,-7 8,-7 12,0 l 18,0 l 2,3 l 3,-26 l 3,5 l 2,0 l 5,0 c 3,-9 10,-9 16,0 l 48,0`;
    }
    return d;
  },
  "second-degree-type1": (w, h) => {
    const cy = h * 0.6;
    let d = `M 0,${cy}`;
    const prLengths = [6, 10, 15, 22];
    for (let cycle = 0; cycle < 3; cycle++) {
      for (let i = 0; i < prLengths.length; i++) {
        d += ` l 6,0 c 3,-7 8,-7 12,0 l ${prLengths[i]},0`;
        if (i < prLengths.length - 1) {
          d += ` l 2,3 l 3,-26 l 3,5 l 2,0 l 5,0 c 3,-9 10,-9 14,0 l 20,0`;
        } else {
          d += ` l 35,0`;
        }
      }
    }
    return d;
  },
  "second-degree-type2": (w, h) => {
    const cy = h * 0.6;
    let d = `M 0,${cy}`;
    const pattern = [
      true,
      true,
      false,
      true,
      true,
      false,
      true,
      false,
      true,
      true,
    ];
    for (const conducts of pattern) {
      d += ` l 6,0 c 3,-7 8,-7 12,0 l 10,0`;
      if (conducts) {
        d += ` l 2,3 l 3,-26 l 3,5 l 2,0 l 5,0 c 3,-9 10,-9 14,0 l 10,0`;
      } else {
        d += ` l 42,0`;
      }
    }
    return d;
  },
  "third-degree-avb": (w, h) => {
    const cy = h * 0.6;
    let d = `M 0,${cy}`;
    const pWaves = [
      10, 50, 90, 130, 170, 210, 250, 290, 330, 370, 410, 450, 490, 530, 570,
      610, 650, 690, 730, 770, 810, 850,
    ];
    const qrsEscape = [50, 150, 250, 350, 450, 550, 650, 750, 850];
    for (const px of pWaves) {
      if (px + 12 > w) break;
      d += ` M ${px},${cy} c 3,-6 8,-6 12,0 M ${px + 12},${cy}`;
    }
    for (const bx of qrsEscape) {
      if (bx + 18 > w) break;
      d += ` M ${bx},${cy} l 4,-8 l 8,-22 l 8,30 l 5,-5 l 2,0 M ${bx + 27},${cy}`;
    }
    return d;
  },
  wpw: (w, h) => {
    const cy = h * 0.6;
    let d = `M 0,${cy}`;
    for (let bx = 0; bx + 80 < w; bx += 100) {
      d += ` l 6,0 c 3,-7 8,-7 12,0 l 4,0 l 6,-12 l 4,-18 l 5,28 l 6,-4 l 4,0 l 4,0 c 4,-12 12,-12 18,0 l 40,0`;
    }
    return d;
  },
  brugada: (w, h) => {
    const cy = h * 0.6;
    let d = `M 0,${cy}`;
    for (let bx = 0; bx + 100 < w; bx += 120) {
      d += ` l 8,0 c 3,-7 8,-7 12,0 l 6,0 l 2,2 l 4,-26 l 2,0 c 8,-6 14,4 20,8 l 4,0 c 3,10 8,10 12,0 l 50,0`;
    }
    return d;
  },
  "long-qt": (w, h) => {
    const cy = h * 0.6;
    let d = `M 0,${cy}`;
    for (let bx = 0; bx + 120 < w; bx += 140) {
      d += ` l 8,0 c 3,-7 8,-7 12,0 l 8,0 l 2,3 l 3,-26 l 3,5 l 2,0 l 30,0 c 5,-11 15,-11 22,0 l 50,0`;
    }
    return d;
  },
  asystole: (w, h) => {
    const cy = h * 0.6;
    let d = `M 0,${cy}`;
    for (let x = 0; x < w; x += 4) {
      d += ` L ${x + 4},${cy + Math.sin(x * 0.8) * 0.8}`;
    }
    return d;
  },
  pacemaker: (w, h) => {
    const cy = h * 0.6;
    let d = `M 0,${cy}`;
    for (let bx = 0; bx + 80 < w; bx += 95) {
      d += ` l 12,0`;
      d += ` M ${bx + 12},${cy + 14} L ${bx + 12},${cy - 14} M ${bx + 12},${cy}`;
      d += ` l 2,0 l 4,-8 l 7,-22 l 8,30 l 5,-4 l 3,0 l 4,0 c 4,14 12,14 18,0 l 28,0`;
    }
    return d;
  },
};

function ECGGrid({ width, height }: { width: number; height: number }) {
  return (
    <g>
      {Array.from({ length: Math.ceil(width / 10) + 1 }, (_, i) => (
        <line
          key={`vs${i}`}
          x1={i * 10}
          y1={0}
          x2={i * 10}
          y2={height}
          stroke="#f0a0a0"
          strokeWidth="0.3"
          opacity="0.5"
        />
      ))}
      {Array.from({ length: Math.ceil(height / 10) + 1 }, (_, i) => (
        <line
          key={`hs${i}`}
          x1={0}
          y1={i * 10}
          x2={width}
          y2={i * 10}
          stroke="#f0a0a0"
          strokeWidth="0.3"
          opacity="0.5"
        />
      ))}
      {Array.from({ length: Math.ceil(width / 50) + 1 }, (_, i) => (
        <line
          key={`vb${i}`}
          x1={i * 50}
          y1={0}
          x2={i * 50}
          y2={height}
          stroke="#e07070"
          strokeWidth="0.7"
          opacity="0.6"
        />
      ))}
      {Array.from({ length: Math.ceil(height / 50) + 1 }, (_, i) => (
        <line
          key={`hb${i}`}
          x1={0}
          y1={i * 50}
          x2={width}
          y2={i * 50}
          stroke="#e07070"
          strokeWidth="0.7"
          opacity="0.6"
        />
      ))}
    </g>
  );
}

export function ECGTracing({
  arrhythmiaId,
  className = "",
  width = 880,
  height = 160,
  showGrid = true,
}: ECGTracingProps) {
  const pathFn = ECG_PATHS[arrhythmiaId];
  const pathData = pathFn
    ? pathFn(width, height)
    : `M 0,${height * 0.6} L ${width},${height * 0.6}`;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="100%"
      className={className}
      style={{ background: "#fff8f8", display: "block" }}
      aria-label={`ECG: ${arrhythmiaId}`}
    >
      {showGrid && <ECGGrid width={width} height={height} />}
      <line
        x1={0}
        y1={height * 0.6}
        x2={width}
        y2={height * 0.6}
        stroke="#ddd"
        strokeWidth="0.5"
      />
      <path
        d={pathData}
        fill="none"
        stroke="#111"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ECGTracing;
