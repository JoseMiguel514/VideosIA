import React from "react";

/* Íconos SVG originales (sin logos ni arte de terceros) */

export const Controller: React.FC<{ size?: number; color?: string; glow?: number }> = ({
  size = 360,
  color = "#39ff88",
  glow = 0,
}) => (
  <svg width={size} height={size * 0.66} viewBox="0 0 300 200" style={{ filter: `drop-shadow(0 0 ${glow}px ${color})`, overflow: "visible" }}>
    <path
      d="M70 40 H230 C275 40 295 90 298 140 C300 180 270 195 250 180 L215 150 H85 L50 180 C30 195 0 180 2 140 C5 90 25 40 70 40 Z"
      fill="#16102a"
      stroke={color}
      strokeWidth={10}
      strokeLinejoin="round"
    />
    <rect x={62} y={88} width={56} height={18} rx={4} fill={color} />
    <rect x={81} y={69} width={18} height={56} rx={4} fill={color} />
    <circle cx={222} cy={76} r={11} fill="#ff2e88" />
    <circle cx={246} cy={100} r={11} fill="#ffd23f" />
    <circle cx={198} cy={100} r={11} fill="#4dc3ff" />
    <circle cx={222} cy={124} r={11} fill={color} />
    <circle cx={125} cy={140} r={16} fill="none" stroke={color} strokeWidth={6} />
    <circle cx={175} cy={140} r={16} fill="none" stroke={color} strokeWidth={6} />
  </svg>
);

export const Clapper: React.FC<{ size?: number; color?: string; open?: number }> = ({ size = 320, color = "#ffffff", open = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
    <rect x={20} y={80} width={160} height={110} rx={10} fill="#16102a" stroke={color} strokeWidth={8} />
    <line x1={20} y1={115} x2={180} y2={115} stroke={color} strokeWidth={5} />
    <g transform={`rotate(${-open} 20 78)`}>
      <rect x={20} y={48} width={160} height={30} rx={4} fill="#16102a" stroke={color} strokeWidth={8} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${40 + i * 38} 52 L${62 + i * 38} 52 L${50 + i * 38} 74 L${28 + i * 38} 74 Z`} fill={color} />
      ))}
    </g>
  </svg>
);

export const Crown: React.FC<{ size?: number }> = ({ size = 160 }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 100 70" style={{ filter: "drop-shadow(0 0 18px #ffd23f)" }}>
    <path d="M5 60 L12 15 L32 38 L50 5 L68 38 L88 15 L95 60 Z" fill="#ffd23f" stroke="#7a4b00" strokeWidth={4} strokeLinejoin="round" />
    <circle cx={50} cy={46} r={6} fill="#ff2e88" />
  </svg>
);

export const Calendar: React.FC<{ day: string; month: string; size?: number }> = ({ day, month, size = 300 }) => (
  <div style={{ width: size, borderRadius: 32, overflow: "hidden", boxShadow: "0 20px 60px rgba(255,46,136,0.45)", border: "6px solid #fff" }}>
    <div style={{ background: "#ff2e88", color: "white", fontSize: size * 0.2, textAlign: "center", padding: "10px 0", letterSpacing: 6 }}>{month}</div>
    <div style={{ background: "white", color: "#0b0614", fontSize: size * 0.5, textAlign: "center", lineHeight: 1.15 }}>{day}</div>
  </div>
);

export const Stopwatch: React.FC<{ size?: number; angle: number; color?: string }> = ({ size = 420, angle, color = "#39ff88" }) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 200 230" style={{ filter: `drop-shadow(0 0 30px ${color}88)` }}>
    <rect x={85} y={4} width={30} height={22} rx={5} fill={color} />
    <rect x={160} y={36} width={22} height={14} rx={4} fill={color} transform="rotate(40 171 43)" />
    <circle cx={100} cy={128} r={92} fill="#16102a" stroke={color} strokeWidth={10} />
    {Array.from({ length: 12 }).map((_, i) => (
      <line
        key={i}
        x1={100}
        y1={46}
        x2={100}
        y2={i % 3 === 0 ? 64 : 56}
        stroke="white"
        strokeWidth={i % 3 === 0 ? 6 : 3}
        transform={`rotate(${i * 30} 100 128)`}
      />
    ))}
    <line x1={100} y1={128} x2={100} y2={58} stroke="#ff2e88" strokeWidth={7} strokeLinecap="round" transform={`rotate(${angle} 100 128)`} />
    <circle cx={100} cy={128} r={10} fill="#ff2e88" />
  </svg>
);

export const GameBox: React.FC<{ w?: number; fill?: number }> = ({ w = 90, fill = 1 }) => (
  <svg width={w} height={w * 1.28} viewBox="0 0 90 115">
    <defs>
      <clipPath id={`clip-${fill}`}>
        <rect x={0} y={0} width={90 * fill} height={115} />
      </clipPath>
    </defs>
    <rect x={3} y={3} width={84} height={109} rx={8} fill="none" stroke="#39ff8855" strokeWidth={4} />
    <g clipPath={`url(#clip-${fill})`}>
      <rect x={3} y={3} width={84} height={109} rx={8} fill="#39ff88" />
      <rect x={3} y={3} width={84} height={22} rx={8} fill="#ff2e88" />
      <rect x={18} y={48} width={54} height={40} rx={6} fill="#0b0614" />
      <text x={45} y={77} fontSize={24} textAnchor="middle" fill="#39ff88" fontWeight={900}>VI</text>
    </g>
  </svg>
);

export const Warning: React.FC<{ size?: number }> = ({ size = 260 }) => (
  <svg width={size} height={size * 0.9} viewBox="0 0 100 90" style={{ filter: "drop-shadow(0 0 25px #ffd23f)" }}>
    <path d="M50 5 L96 85 H4 Z" fill="#ffd23f" stroke="#0b0614" strokeWidth={5} strokeLinejoin="round" />
    <rect x={45} y={30} width={10} height={32} rx={4} fill="#0b0614" />
    <circle cx={50} cy={72} r={6} fill="#0b0614" />
  </svg>
);

export const Bill: React.FC<{ w?: number }> = ({ w = 150 }) => (
  <svg width={w} height={w * 0.48} viewBox="0 0 150 72">
    <rect x={2} y={2} width={146} height={68} rx={6} fill="#2fd170" stroke="#0e6b36" strokeWidth={4} />
    <rect x={12} y={12} width={126} height={48} rx={4} fill="none" stroke="#0e6b36" strokeWidth={3} />
    <circle cx={75} cy={36} r={18} fill="#0e6b36" />
    <text x={75} y={46} fontSize={28} textAnchor="middle" fill="#2fd170" fontWeight={900}>$</text>
  </svg>
);
