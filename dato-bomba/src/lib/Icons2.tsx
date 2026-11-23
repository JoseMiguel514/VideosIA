import React from "react";

/* Más íconos SVG originales para los nuevos videos */

/** cuadro estilizado de castaños en flor (ilustración propia, no reproduce la obra) */
export const Painting: React.FC<{ size?: number; sway?: number }> = ({ size = 520, sway = 0 }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 250 200" style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.6))" }}>
    <rect x={0} y={0} width={250} height={200} rx={6} fill="#c8962e" />
    <rect x={8} y={8} width={234} height={184} rx={3} fill="#8a5a12" />
    <rect x={16} y={16} width={218} height={168} fill="#7fb3e0" />
    {/* cielo con pinceladas */}
    {Array.from({ length: 14 }).map((_, i) => (
      <path key={i} d={`M${20 + (i % 7) * 31} ${28 + Math.floor(i / 7) * 22} q8 -6 16 0 t16 0`} stroke="#b9d9f2" strokeWidth={3} fill="none" />
    ))}
    {/* suelo */}
    <rect x={16} y={140} width={218} height={44} fill="#4f8a3a" />
    {Array.from({ length: 10 }).map((_, i) => (
      <path key={i} d={`M${22 + i * 22} 178 l6 -16 l6 16`} stroke="#8cc05a" strokeWidth={3} fill="none" />
    ))}
    {/* camino */}
    <path d="M110 184 L130 140 L142 140 L150 184 Z" fill="#d9b779" />
    {/* árboles */}
    {[
      [60, 0],
      [190, 1],
    ].map(([x, k]) => (
      <g key={x} transform={`rotate(${sway * (k ? -1 : 1)} ${x} 150)`}>
        <rect x={x - 6} y={95} width={12} height={55} fill="#5a3a1a" />
        <circle cx={x} cy={80} r={42} fill="#2f6b2a" />
        <circle cx={x - 26} cy={95} r={26} fill="#3c7f33" />
        <circle cx={x + 26} cy={92} r={28} fill="#3c7f33" />
        {Array.from({ length: 12 }).map((_, i) => (
          <ellipse key={i} cx={x - 34 + ((i * 23) % 68)} cy={52 + ((i * 17) % 55)} rx={4} ry={7} fill={i % 3 ? "#fff6e6" : "#ffd1dc"} />
        ))}
      </g>
    ))}
  </svg>
);

export const Gavel: React.FC<{ size?: number; angle?: number }> = ({ size = 260, angle = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", filter: "drop-shadow(0 0 18px #ffd23f88)" }}>
    <g transform={`rotate(${angle} 70 70)`}>
      <rect x={30} y={12} width={22} height={44} rx={4} fill="#ffd23f" transform="rotate(-45 41 34)" stroke="#7a4b00" strokeWidth={3} />
      <rect x={44} y={40} width={50} height={9} rx={4} fill="#c8962e" transform="rotate(45 44 44)" />
    </g>
    <rect x={10} y={84} width={50} height={12} rx={4} fill="#c8962e" />
  </svg>
);

export const Submarine: React.FC<{ size?: number; color?: string }> = ({ size = 700, color = "#4dc3ff" }) => (
  <svg width={size} height={size * 0.36} viewBox="0 0 300 108" style={{ filter: `drop-shadow(0 0 25px ${color}88)`, overflow: "visible" }}>
    <path d="M30 60 C30 40 60 34 100 34 H230 C270 34 292 48 292 60 C292 72 270 86 230 86 H100 C60 86 30 80 30 60 Z" fill="#16233a" stroke={color} strokeWidth={6} />
    <path d="M130 34 L140 10 H190 L198 34 Z" fill="#16233a" stroke={color} strokeWidth={6} strokeLinejoin="round" />
    <line x1={168} y1={10} x2={168} y2={-10} stroke={color} strokeWidth={5} />
    <path d="M30 60 L6 40 L10 60 L6 80 Z" fill={color} />
    {[0, 1, 2, 3, 4].map((i) => (
      <circle key={i} cx={120 + i * 30} cy={60} r={7} fill="#ffd23f" opacity={0.9} />
    ))}
  </svg>
);

export const Bubbles: React.FC<{ frame: number; n?: number; w?: number; h?: number }> = ({ frame, n = 14, w = 1080, h = 1100 }) => (
  <>
    {Array.from({ length: n }).map((_, i) => {
      const x = (i * 137) % w;
      const sp = 3 + (i % 5);
      const y = h - ((frame * sp + i * 97) % h);
      const r = 8 + (i % 4) * 6;
      return <div key={i} style={{ position: "absolute", left: x + Math.sin(frame / 8 + i) * 12, top: y, width: r * 2, height: r * 2, borderRadius: "50%", border: "3px solid #9fdcff", opacity: 0.5 }} />;
    })}
  </>
);

export const Sun: React.FC<{ size?: number; crossed?: number }> = ({ size = 220, crossed = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", filter: "drop-shadow(0 0 25px #ffd23f)" }}>
    {Array.from({ length: 12 }).map((_, i) => (
      <line key={i} x1={50} y1={6} x2={50} y2={18} stroke="#ffd23f" strokeWidth={6} strokeLinecap="round" transform={`rotate(${i * 30} 50 50)`} />
    ))}
    <circle cx={50} cy={50} r={24} fill="#ffd23f" />
    <line x1={10} y1={90} x2={10 + 80 * crossed} y2={90 - 80 * crossed} stroke="#ff2e88" strokeWidth={10} strokeLinecap="round" />
  </svg>
);

export const Can: React.FC<{ w?: number }> = ({ w = 80 }) => (
  <svg width={w} height={w * 1.2} viewBox="0 0 50 60">
    <rect x={4} y={6} width={42} height={50} rx={6} fill="#9aa7b8" />
    <rect x={4} y={18} width={42} height={24} fill="#ff2e88" />
    <ellipse cx={25} cy={7} rx={21} ry={5} fill="#c9d3df" />
    <text x={25} y={35} fontSize={12} textAnchor="middle" fill="white" fontWeight={900}>
      FOOD
    </text>
  </svg>
);

export const Lock: React.FC<{ size?: number }> = ({ size = 150 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: "drop-shadow(0 0 20px #ff2e88)" }}>
    <path d="M28 46 V32 a22 22 0 0 1 44 0 V46" fill="none" stroke="#ff2e88" strokeWidth={10} />
    <rect x={18} y={44} width={64} height={48} rx={10} fill="#ff2e88" />
    <circle cx={50} cy={64} r={7} fill="#0b0614" />
    <rect x={47} y={66} width={6} height={14} rx={2} fill="#0b0614" />
  </svg>
);

export const Wrench: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: "drop-shadow(0 0 20px #ff2e88)" }}>
    <path d="M70 10 a20 20 0 0 0 -22 27 L12 73 a8 8 0 0 0 11 11 L59 48 a20 20 0 0 0 27 -22 l-12 12 -10 -2 -2 -10 z" fill="#ff2e88" stroke="#0b0614" strokeWidth={3} />
  </svg>
);

/** pantalla de transmisión en vivo genérica */
export const LiveScreen: React.FC<{ size?: number; frame: number }> = ({ size = 520, frame }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 200 140" style={{ filter: "drop-shadow(0 0 30px #ff2e8866)" }}>
    <rect x={4} y={4} width={192} height={112} rx={10} fill="#16102a" stroke="#ffffff" strokeWidth={6} />
    <rect x={70} y={116} width={60} height={10} fill="#ffffff" />
    <rect x={50} y={126} width={100} height={8} rx={4} fill="#ffffff" />
    <path d="M85 40 L125 60 L85 80 Z" fill="#39ff88" />
    <rect x={14} y={14} width={44} height={18} rx={4} fill="#ff2e88" opacity={Math.floor(frame / 12) % 2 ? 1 : 0.6} />
    <text x={36} y={28} fontSize={13} textAnchor="middle" fill="white" fontWeight={900}>
      LIVE
    </text>
  </svg>
);

export const Eye: React.FC<{ size?: number }> = ({ size = 110 }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 100 60">
    <path d="M4 30 Q50 -12 96 30 Q50 72 4 30 Z" fill="white" />
    <circle cx={50} cy={30} r={16} fill="#39ff88" />
    <circle cx={50} cy={30} r={7} fill="#0b0614" />
  </svg>
);

export const Hourglass: React.FC<{ size?: number; t: number }> = ({ size = 260, t }) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 100 140" style={{ filter: "drop-shadow(0 0 25px #ffd23f88)" }}>
    <rect x={10} y={4} width={80} height={10} rx={4} fill="#c8962e" />
    <rect x={10} y={126} width={80} height={10} rx={4} fill="#c8962e" />
    <path d="M20 14 H80 C80 50 54 60 54 70 C54 80 80 90 80 126 H20 C20 90 46 80 46 70 C46 60 20 50 20 14 Z" fill="#ffffff22" stroke="white" strokeWidth={4} />
    <path d={`M${26 + 20 * t} ${20 + 40 * t} H${74 - 20 * t} L50 66 Z`} fill="#ffd23f" />
    <path d={`M28 120 H72 L${50 + 22 * (1 - t)} ${120 - 40 * t} L${50 - 22 * (1 - t)} ${120 - 40 * t} Z`} fill="#ffd23f" />
    <line x1={50} y1={66} x2={50} y2={120} stroke="#ffd23f" strokeWidth={2} />
  </svg>
);
