import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { loadFont as loadNunito } from "@remotion/google-fonts/Nunito";
import { ease, pop } from "../kit";
import { RimFilter } from "./Stick";

export const { fontFamily: hudFont } = loadNunito("normal", { weights: ["800", "900"], subsets: ["latin"] });

export const CREAM = "#f0d29a";
export const GOLD = "#ffc23d";
export const ICE = "#7fe6ff";
export const RED = "#e8343f";

/** Top-right status panel, styled after the reference ("ENGINES STOP IN 8:23"). */
export const Hud: React.FC<{ label: string; value: string; start?: number; color?: string; x?: number; y?: number; w?: number }> = ({
  label,
  value,
  start = 0,
  color = GOLD,
  x = 1500,
  y = 50,
  w = 380,
}) => {
  const f = useCurrentFrame();
  if (f < start) return null;
  const p = ease(f, start, start + 12);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        padding: "14px 0 10px",
        borderRadius: 16,
        background: "rgba(14,12,12,0.88)",
        border: "2px solid rgba(255,255,255,0.08)",
        textAlign: "center",
        opacity: p,
        transform: `translateY(${(1 - p) * -20}px)`,
      }}
    >
      <div style={{ fontFamily: hudFont, fontWeight: 900, fontSize: 26, letterSpacing: 4, color: "#e9e2d4" }}>{label}</div>
      <div style={{ fontFamily: hudFont, fontWeight: 900, fontSize: value.length > 10 ? 48 : value.length > 7 ? 58 : 70, lineHeight: 1.05, whiteSpace: "nowrap", color, textShadow: `0 0 18px ${color}99` }}>{value}</div>
    </div>
  );
};

/** Dark pill with cream outline (like the "23B" seat badge). */
export const Pill: React.FC<{ text: string; start: number; x: number; y: number; size?: number; color?: string; struck?: number; end?: number }> = ({
  text,
  start,
  x,
  y,
  size = 46,
  color = CREAM,
  struck,
  end,
}) => {
  const f = useCurrentFrame();
  if (f < start || (end !== undefined && f > end + 8)) return null;
  const p = pop(f, start);
  const out = end !== undefined ? 1 - ease(f, end, end + 8) : 1;
  const s = struck !== undefined ? ease(f, struck, struck + 10) : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%,-50%) scale(${p})`,
        opacity: out * (1 - s * 0.45),
        padding: "6px 30px 8px",
        borderRadius: 999,
        background: "#16120f",
        border: `4px solid ${color}`,
        fontFamily: hudFont,
        fontWeight: 900,
        fontSize: size,
        color: "#f6efdf",
        whiteSpace: "nowrap",
      }}
    >
      {text}
      {s > 0 && <div style={{ position: "absolute", left: "8%", top: "48%", height: 7, width: `${84 * s}%`, background: RED, borderRadius: 4, transform: "rotate(-5deg)" }} />}
    </div>
  );
};

/** Red warning label (like "DO NOT TOUCH"). */
export const Tag: React.FC<{ text: string; start: number; x: number; y: number; size?: number; color?: string; end?: number }> = ({
  text,
  start,
  x,
  y,
  size = 44,
  color = RED,
  end,
}) => {
  const f = useCurrentFrame();
  if (f < start || (end !== undefined && f > end + 8)) return null;
  const out = end !== undefined ? 1 - ease(f, end, end + 8) : 1;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%,-50%) scale(${pop(f, start)})`,
        opacity: out,
        padding: "2px 18px 4px",
        borderRadius: 8,
        background: color,
        border: "3px solid rgba(255,255,255,0.25)",
        fontFamily: hudFont,
        fontWeight: 900,
        fontSize: size,
        color: "white",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

/** Gold trophy with a label plate (like "RIGHT AGAIN"). */
export const Trophy: React.FC<{ label: string; start: number; x: number; y: number }> = ({ label, start, x, y }) => {
  const f = useCurrentFrame();
  if (f < start) return null;
  const p = pop(f, start, 9);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${p})`, textAlign: "center" }}>
      <svg width={220} height={200} style={{ filter: `drop-shadow(0 0 ${20 + 8 * Math.sin(f / 6)}px rgba(255,194,61,0.7))` }}>
        <path d="M 50 20 L 170 20 L 160 100 Q 110 140 60 100 Z" fill={GOLD} />
        <path d="M 50 35 Q 10 35 15 70 Q 22 100 62 100" stroke={GOLD} strokeWidth={14} fill="none" />
        <path d="M 170 35 Q 210 35 205 70 Q 198 100 158 100" stroke={GOLD} strokeWidth={14} fill="none" />
        <rect x={98} y={118} width={24} height={40} fill="#d99a1f" />
        <rect x={70} y={156} width={80} height={22} rx={4} fill="#d99a1f" />
        <path d="M 72 30 L 86 30 L 80 95 L 70 90 Z" fill="#fff" opacity={0.4} />
      </svg>
      <div style={{ marginTop: -6, display: "inline-block", padding: "4px 26px", background: GOLD, border: "4px solid #16120f", borderRadius: 8, fontFamily: hudFont, fontWeight: 900, fontSize: 40, color: "#16120f" }}>
        {label}
      </div>
    </div>
  );
};

/** SVG layer for characters (with the cream rim filter defined). */
export const Layer: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, ...style }}>
    <defs>
      <RimFilter />
      <RimFilter id="rimIce" color={ICE} />
    </defs>
    {children}
  </svg>
);

/** Slow controlled camera move: zoom + pan over the scene. */
export const Cam: React.FC<{ dur: number; z?: [number, number]; ox?: number; oy?: number; px?: [number, number]; children: React.ReactNode }> = ({
  dur,
  z = [1, 1.06],
  ox = 960,
  oy = 540,
  px = [0, 0],
  children,
}) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const e = t * t * (3 - 2 * t);
  const zz = z[0] + (z[1] - z[0]) * e;
  const pp = px[0] + (px[1] - px[0]) * e;
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateX(${pp}px) scale(${zz})`, transformOrigin: `${ox}px ${oy}px` }}>{children}</div>
  );
};

/** Freeze flash + icy vignette. */
export const Frost: React.FC<{ start: number }> = ({ start }) => {
  const f = useCurrentFrame();
  if (f < start) return null;
  const p = ease(f, start, start + 12);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "rgba(127,230,255,0.12)", opacity: p, mixBlendMode: "screen" }} />
      <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 ${220 * p}px rgba(127,230,255,0.5)` }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "white",
          opacity: interpolate(f, [start, start + 3, start + 12], [0, 0.45, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      />
    </>
  );
};

export const Vig: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.7) 100%)" }} />
);
