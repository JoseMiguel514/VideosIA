import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { Flame } from "./Characters";

export const W = 1080;
export const H = 1920;
export const GROUND = 1640;

export const Sky: React.FC<{ mode: "dusk" | "night" | "day" }> = ({ mode }) => {
  const f = useCurrentFrame();
  const g = {
    dusk: "linear-gradient(#2b1a45 0%, #8a3b4a 38%, #f08a4b 62%, #ffc979 78%)",
    night: "linear-gradient(#060a1e 0%, #14204a 50%, #2d2b55 80%)",
    day: "linear-gradient(#5aa0d8 0%, #a7d3ee 60%, #f6e2b0 85%)",
  }[mode];
  return (
    <AbsoluteFill style={{ background: g }}>
      {mode === "night" &&
        Array.from({ length: 70 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: random(`sx${i}`) * W,
              top: random(`sy${i}`) * 1100,
              width: 4,
              height: 4,
              borderRadius: 2,
              background: "white",
              opacity: 0.4 + 0.6 * Math.abs(Math.sin(f / 15 + i)),
            }}
          />
        ))}
      {mode === "night" ? (
        <div style={{ position: "absolute", left: 720, top: 640, width: 170, height: 170, borderRadius: "50%", background: "#fdf3c8", boxShadow: "0 0 120px 40px rgba(253,243,200,0.35)" }} />
      ) : (
        <div style={{ position: "absolute", left: 380, top: 820, width: 320, height: 320, borderRadius: "50%", background: mode === "dusk" ? "#ffe0a0" : "#fff6cf", boxShadow: "0 0 160px 60px rgba(255,200,120,0.45)" }} />
      )}
    </AbsoluteFill>
  );
};

/** City walls of Troy with towers and gate. y = top of wall */
export const Walls: React.FC<{ y?: number; night?: boolean; gateOpen?: number; scale?: number }> = ({
  y = 1050,
  night = false,
  gateOpen = 0,
  scale = 1,
}) => {
  const stone = night ? "#4a4a6a" : "#c9a77a";
  const stoneDark = night ? "#2d2d48" : "#8f6f4a";
  const wallH = GROUND - y;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0, transform: `scale(${scale})`, transformOrigin: `50% ${GROUND}px` }}>
      <rect x="-200" y={y} width={W + 400} height={wallH} fill={stone} />
      {Array.from({ length: 12 }).map((_, r) =>
        Array.from({ length: 16 }).map((__, c) => (
          <rect key={`${r}-${c}`} x={-200 + c * 95 + (r % 2) * 47} y={y + r * 48} width="95" height="48" fill="none" stroke={stoneDark} strokeWidth="3" opacity="0.6" />
        )),
      )}
      {Array.from({ length: 20 }).map((_, i) => (
        <rect key={i} x={-200 + i * 80} y={y - 40} width="50" height="42" fill={stone} stroke={stoneDark} strokeWidth="3" />
      ))}
      {[80, 1000].map((x) => (
        <g key={x}>
          <rect x={x - 90} y={y - 180} width="180" height={wallH + 180} fill={stone} stroke={stoneDark} strokeWidth="4" />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={x - 90 + i * 48} y={y - 220} width="36" height="42" fill={stone} stroke={stoneDark} strokeWidth="3" />
          ))}
          <rect x={x - 14} y={y - 120} width="28" height="50" rx="14" fill="#1a1208" />
        </g>
      ))}
      {/* gate */}
      <path d={`M400 ${GROUND} L400 ${y + 150} Q540 ${y + 40} 680 ${y + 150} L680 ${GROUND} Z`} fill="#20140a" />
      <g>
        <rect x={400 - gateOpen * 130} y={y + 150} width="140" height={GROUND - y - 150} fill="#6b4423" stroke="#2a160b" strokeWidth="5" />
        <rect x={540 + gateOpen * 130} y={y + 150} width="140" height={GROUND - y - 150} fill="#6b4423" stroke="#2a160b" strokeWidth="5" />
      </g>
      <path d={`M380 ${GROUND} L380 ${y + 150} Q540 ${y + 10} 700 ${y + 150} L700 ${GROUND}`} fill="none" stroke={stoneDark} strokeWidth="14" />
    </svg>
  );
};

export const Ground: React.FC<{ color?: string; color2?: string }> = ({ color = "#b5824a", color2 = "#6a4423" }) => (
  <div style={{ position: "absolute", left: 0, top: GROUND, width: W, height: H - GROUND, background: `linear-gradient(${color}, ${color2})` }} />
);

export const Sea: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      <rect x="0" y="1180" width={W} height="470" fill="#2e6c8a" />
      {Array.from({ length: 8 }).map((_, i) => (
        <path key={i} d={`M${-100 + ((i * 160 + f * 2) % 1300)} ${1230 + (i % 4) * 90} q30 -14 60 0 t60 0`} stroke="#9fd3e8" strokeWidth="5" fill="none" opacity="0.6" />
      ))}
      {[120, 330, 560, 820].map((x, i) => (
        <g key={x} transform={`translate(${x} ${1320 + (i % 2) * 90 + Math.sin(f / 15 + i) * 6}) scale(${0.8 + (i % 2) * 0.25})`}>
          <path d="M-90 0 L90 0 L65 40 L-65 40 Z" fill="#2a160b" />
          <path d="M-90 0 Q-110 -30 -100 -40" stroke="#2a160b" strokeWidth="10" fill="none" />
          <line x1="0" y1="0" x2="0" y2="-150" stroke="#3b2414" strokeWidth="8" />
          <path d="M5 -145 Q60 -90 5 -25 Z" fill="#f3ead6" stroke="#2a160b" strokeWidth="4" />
          <path d="M-5 -145 Q-55 -90 -5 -25 Z" fill="#e9dcc0" stroke="#2a160b" strokeWidth="4" />
        </g>
      ))}
    </svg>
  );
};

export const Columns: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(#3a2414, #6b3f20 60%, #3a2414)" }}>
    <svg width={W} height={H}>
      {[60, 380, 700, 1020].map((x) => (
        <g key={x}>
          <rect x={x - 70} y="300" width="140" height="40" fill="#e8dcc4" stroke="#8a7a5a" strokeWidth="4" />
          <rect x={x - 55} y="340" width="110" height="1300" fill="#d8ccb2" />
          {[-35, -12, 12, 35].map((d) => (
            <line key={d} x1={x + d} y1="340" x2={x + d} y2="1640" stroke="#b0a284" strokeWidth="5" />
          ))}
        </g>
      ))}
      <rect x="0" y="260" width={W} height="45" fill="#e8dcc4" stroke="#8a7a5a" strokeWidth="4" />
    </svg>
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 60%, rgba(255,190,100,0.35), rgba(0,0,0,0.55) 75%)" }} />
  </AbsoluteFill>
);

export const Pyre: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <circle cx="0" cy="-120" r="230" fill="rgba(255,140,40,0.25)" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={-150 + (i % 2) * 20} y={-30 * i} width="300" height="28" rx="6" fill="#5a3212" stroke="#2a160b" strokeWidth="4" />
      ))}
      <Flame x={-80} y={-150} size={2.2} seed={1} />
      <Flame x={0} y={-190} size={3} seed={2} />
      <Flame x={80} y={-150} size={2.2} seed={3} />
    </g>
  </svg>
);

export const Embers: React.FC<{ count?: number }> = ({ count = 30 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => {
        const speed = 1.5 + random(`es${i}`) * 3;
        const size = 4 + random(`ez${i}`) * 7;
        const y = H + 40 - ((f * speed + random(`eo${i}`) * 2000) % 2100);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: random(`ex${i}`) * W + Math.sin((f + i * 20) / 20) * 25,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: i % 3 ? "#ffb347" : "#ff5a2a",
              boxShadow: `0 0 ${size * 3}px #ff9a3a`,
              opacity: 0.8,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.6) 100%)", pointerEvents: "none" }} />
);
