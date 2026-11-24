import React from "react";
import { Easing, interpolate, random, spring, useCurrentFrame } from "remotion";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { FPS, H, W } from "./timing";

export const { fontFamily: headFont } = loadBebas("normal", { weights: ["400"], subsets: ["latin"] });
export const { fontFamily: bodyFont } = loadInter("normal", { weights: ["600", "800", "900"], subsets: ["latin"] });

export const C = {
  bg0: "#050b18",
  bg1: "#0c1d3a",
  ice: "#62e6ff",
  gold: "#ffc861",
  red: "#ff4d5e",
  green: "#7dff9b",
  white: "#f2f6ff",
  dim: "#7f8db0",
};

/** 0→1 eased progress between frames a and b. */
export const ease = (f: number, a: number, b: number, e = Easing.out(Easing.cubic)) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });

export const pop = (f: number, start: number, damping = 12) =>
  spring({ frame: f - start, fps: FPS, config: { damping, mass: 0.6 } });

/** Ambient backdrop: deep gradient + drifting dust particles. */
export const Backdrop: React.FC<{ tint?: string; seed?: string }> = ({ tint = C.bg1, seed = "bg" }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 40%, ${tint} 0%, ${C.bg0} 75%)` }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {new Array(60).fill(0).map((_, i) => {
          const x = (random(seed + "x" + i) * W + f * (0.2 + random(seed + "v" + i) * 0.6)) % W;
          const y = (random(seed + "y" + i) * H - f * (0.15 + random(seed + "u" + i) * 0.4) + H * 10) % H;
          const r = 1 + random(seed + "r" + i) * 2.5;
          const o = 0.15 + 0.35 * Math.abs(Math.sin(f / 40 + i));
          return <circle key={i} cx={x} cy={y} r={r} fill={C.ice} opacity={o} />;
        })}
      </svg>
    </div>
  );
};

export const Vignette: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.75) 100%)",
      pointerEvents: "none",
    }}
  />
);

/** Big cinematic headline. */
export const Headline: React.FC<{
  text: string;
  start: number;
  y?: number;
  size?: number;
  color?: string;
  glow?: string;
}> = ({ text, start, y = 120, size = 120, color = C.white, glow }) => {
  const f = useCurrentFrame();
  const p = pop(f, start, 14);
  if (f < start) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: headFont,
        fontSize: size,
        letterSpacing: 4,
        color,
        opacity: Math.min(1, p * 1.5),
        transform: `translateY(${(1 - p) * 40}px) scale(${0.9 + 0.1 * p})`,
        textShadow: glow ? `0 0 30px ${glow}, 0 0 60px ${glow}` : "0 6px 20px rgba(0,0,0,0.6)",
      }}
    >
      {text}
    </div>
  );
};

/** Rounded label chip. */
export const Chip: React.FC<{
  text: string;
  start: number;
  x: number;
  y: number;
  color?: string;
  size?: number;
  struck?: number; // frame to strike through
  width?: number;
}> = ({ text, start, x, y, color = C.ice, size = 44, struck, width }) => {
  const f = useCurrentFrame();
  const p = pop(f, start);
  const s = struck !== undefined ? ease(f, struck, struck + 10) : 0;
  if (f < start) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        transform: `translate(-50%, -50%) scale(${p})`,
        padding: "14px 34px",
        borderRadius: 18,
        border: `3px solid ${color}`,
        background: "rgba(5,11,24,0.75)",
        boxShadow: `0 0 24px ${color}55`,
        fontFamily: bodyFont,
        fontWeight: 800,
        fontSize: size,
        color: C.white,
        textAlign: "center",
        whiteSpace: "nowrap",
        opacity: 1 - s * 0.5,
      }}
    >
      {text}
      {s > 0 && (
        <div
          style={{
            position: "absolute",
            left: "6%",
            top: "50%",
            height: 8,
            width: `${88 * s}%`,
            background: C.red,
            borderRadius: 4,
            transform: "rotate(-4deg)",
          }}
        />
      )}
    </div>
  );
};

/** Pause icon overlay used for the "frozen time" motif. */
export const PauseIcon: React.FC<{ start: number; x?: number; y?: number; size?: number }> = ({
  start,
  x = W / 2,
  y = 420,
  size = 220,
}) => {
  const f = useCurrentFrame();
  if (f < start) return null;
  const p = pop(f, start, 10);
  const glow = 0.6 + 0.4 * Math.sin(f / 8);
  return (
    <svg width={size} height={size} style={{ position: "absolute", left: x - size / 2, top: y - size / 2, transform: `scale(${p})` }}>
      <circle cx={size / 2} cy={size / 2} r={size / 2 - 8} fill="rgba(98,230,255,0.08)" stroke={C.ice} strokeWidth={6} opacity={glow} />
      <rect x={size * 0.33} y={size * 0.28} width={size * 0.11} height={size * 0.44} rx={8} fill={C.ice} />
      <rect x={size * 0.56} y={size * 0.28} width={size * 0.11} height={size * 0.44} rx={8} fill={C.ice} />
    </svg>
  );
};

/** Simple person silhouette. */
export const Person: React.FC<{
  x: number;
  y: number;
  s?: number;
  hair?: string;
  body?: string;
  hunch?: number;
  outline?: string;
}> = ({ x, y, s = 1, hair = "#3a2a1c", body = "#2b3f66", hunch = 0, outline }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <g transform={`rotate(${hunch * 8}, 0, 60)`}>
      <rect x={-55} y={40} width={110} height={170} rx={50} fill={body} stroke={outline} strokeWidth={outline ? 6 : 0} />
      <circle cx={0} cy={0} r={42} fill="#e8c4a0" stroke={outline} strokeWidth={outline ? 6 : 0} />
      <path d="M -44 -6 Q -44 -50 0 -50 Q 44 -50 44 -6 Q 30 -30 0 -30 Q -30 -30 -44 -6 Z" fill={hair} />
    </g>
  </g>
);

export const Glow: React.FC<{ id: string; color: string; std?: number }> = ({ id, color, std = 8 }) => (
  <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation={std} result="b" />
    <feFlood floodColor={color} result="c" />
    <feComposite in="c" in2="b" operator="in" result="g" />
    <feMerge>
      <feMergeNode in="g" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>
);
