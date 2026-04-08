import React from "react";
import { motion } from "framer-motion";

interface AnatomicalLungsProps {
  volumePercentage: number; // 0 to 100
  recruitmentPercentage: number; // 0 to 100
  className?: string;
}

/**
 * AnatomicalLungs
 * A high-fidelity SVG component representing the respiratory system.
 * Animates expansion based on volume and color based on recruitment.
 */
export const AnatomicalLungs: React.FC<AnatomicalLungsProps> = ({
  volumePercentage,
  recruitmentPercentage,
  className = "",
}) => {
  // Map recruitment to color (from collapsed purple-ish to healthy pink/red)
  // Low recruitment: #4a1d96 (Deep Indigo)
  // High recruitment: #fb7185 (Rose/Pink)
  const lungColor = `hsl(${260 - recruitmentPercentage * 0.8}, ${40 + recruitmentPercentage * 0.3}%, ${30 + recruitmentPercentage * 0.2}%)`;

  // Scale factor for animation (subtle expansion)
  const scale = 1 + (volumePercentage / 100) * 0.15;

  return (
    <div
      className={`relative flex flex-col items-center justify-center ${className}`}
    >
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full drop-shadow-2xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Trachea & Bronchi Background */}
        <path
          d="M185 40 H215 V120 L270 180 M215 120 L130 180"
          stroke="#e2e8f0"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right Lung (Viewer's Left) */}
        <motion.path
          d="M180 130 C130 110, 70 140, 70 230 C70 320, 130 350, 180 340 C190 338, 195 330, 200 320 L200 140 C195 135, 190 130, 180 130 Z"
          fill={lungColor}
          stroke="#ffffff"
          strokeWidth="2"
          animate={{ scale, x: -(volumePercentage * 0.1) }}
          style={{ originX: "200px", originY: "240px" }}
        />

        {/* Left Lung (Viewer's Right) */}
        <motion.path
          d="M220 130 C270 110, 330 140, 330 230 C330 320, 270 350, 220 340 C210 338, 205 330, 200 320 L200 140 C205 135, 210 130, 220 130 Z"
          fill={lungColor}
          stroke="#ffffff"
          strokeWidth="2"
          animate={{ scale, x: volumePercentage * 0.1 }}
          style={{ originX: "200px", originY: "240px" }}
        />

        {/* Trachea & Bronchi */}
        <path
          d="M190 45 H210 V115 L260 170 M210 115 L140 170"
          stroke={lungColor}
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Diaphragm */}
        <motion.path
          d="M80 370 Q200 340 320 370"
          stroke="#94a3b8"
          strokeWidth="4"
          strokeLinecap="round"
          animate={{ y: volumePercentage * 0.2 }}
        />
      </svg>

      {/* Label Overlay */}
      <div className="absolute bottom-4 flex gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
          Pulmón Derecho
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
          Pulmón Izquierdo
        </div>
      </div>
    </div>
  );
};
