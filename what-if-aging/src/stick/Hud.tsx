import React from "react";
import { Easing as _E, interpolate, random as _rnd, useCurrentFrame } from "remotion";
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

/* ===================== Camera & FX ===================== */

type CamKey = [number, number, number, number] | [number, number, number, number, "p"];
const _smooth = _E.bezier(0.45, 0, 0.25, 1);
const _punch = _E.bezier(0.16, 1, 0.3, 1);

/** Keyframed camera: [frame, zoom, focusX, focusY, "p"?] — "p" = punchy ease into that key. Plus impact shake and handheld drift. */
export const CamK: React.FC<{ keys: CamKey[]; hits?: number[]; drift?: number; children: React.ReactNode; tilt?: [number, number][] }> = ({
  keys,
  hits = [],
  drift = 1,
  children,
  tilt = [],
}) => {
  const f = useCurrentFrame();
  const ks = [...keys].sort((a, b) => a[0] - b[0]);
  let z = ks[0][1];
  let cx = ks[0][2];
  let cy = ks[0][3];
  for (let i = 0; i < ks.length - 1; i++) {
    const a = ks[i];
    const b = ks[i + 1];
    if (f >= a[0] && f <= b[0]) {
      const e = b[4] === "p" ? _punch : _smooth;
      const t = interpolate(f, [a[0], b[0]], [0, 1], { easing: e, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      z = a[1] + (b[1] - a[1]) * t;
      cx = a[2] + (b[2] - a[2]) * t;
      cy = a[3] + (b[3] - a[3]) * t;
    } else if (f > b[0]) {
      z = b[1];
      cx = b[2];
      cy = b[3];
    }
  }
  let sx = Math.sin(f / 47) * 4 * drift + Math.sin(f / 23) * 1.5 * drift;
  let sy = Math.cos(f / 53) * 3 * drift;
  for (const h of hits) {
    const t = f - h;
    if (t >= 0 && t < 16) {
      const k = (1 - t / 16) ** 2 * 18;
      sx += Math.sin(t * 2.9 + h) * k;
      sy += Math.cos(t * 3.7 + h) * k;
    }
  }
  let rot = 0;
  if (tilt.length) {
    const ts = [...tilt].sort((a, b) => a[0] - b[0]);
    rot = ts[0][1];
    for (let i = 0; i < ts.length - 1; i++) {
      if (f >= ts[i][0]) rot = interpolate(f, [ts[i][0], ts[i + 1][0]], [ts[i][1], ts[i + 1][1]], { easing: _smooth, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    }
  }
  const tx = 960 - cx * z + sx;
  const ty = 540 - cy * z + sy;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${z}) rotate(${rot}deg)` }}>{children}</div>
    </div>
  );
};

/** Radial speed lines for punch-in moments. */
export const SpeedLines: React.FC<{ start: number; len?: number; color?: string }> = ({ start, len = 14, color = "#ffffff" }) => {
  const f = useCurrentFrame();
  const t = f - start;
  if (t < 0 || t > len) return null;
  const o = 1 - t / len;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {new Array(40).fill(0).map((_, i) => {
        const a = (i / 40) * Math.PI * 2 + _rnd("sl" + i) * 0.1;
        const r0 = 520 + _rnd("slr" + i) * 200 - t * 10;
        return <line key={i} x1={960 + Math.cos(a) * r0} y1={540 + Math.sin(a) * r0} x2={960 + Math.cos(a) * 1300} y2={540 + Math.sin(a) * 1300} stroke={color} strokeWidth={3 + _rnd("slw" + i) * 5} opacity={o * 0.35} />;
      })}
    </svg>
  );
};

/** Sparkle burst particles. */
export const Burst: React.FC<{ start: number; x: number; y: number; color?: string; n?: number; spread?: number }> = ({ start, x, y, color = GOLD, n = 26, spread = 260 }) => {
  const f = useCurrentFrame();
  const t = f - start;
  if (t < 0 || t > 40) return null;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {new Array(n).fill(0).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + _rnd("ba" + i);
        const d = (spread * (0.5 + _rnd("bd" + i) * 0.5)) * (1 - Math.exp(-t / 7));
        const s = (1 - t / 40) * (6 + _rnd("bs" + i) * 8);
        const px = x + Math.cos(a) * d;
        const py = y + Math.sin(a) * d + t * t * 0.05;
        return <path key={i} d={`M ${px} ${py - s} L ${px + s * 0.3} ${py - s * 0.3} L ${px + s} ${py} L ${px + s * 0.3} ${py + s * 0.3} L ${px} ${py + s} L ${px - s * 0.3} ${py + s * 0.3} L ${px - s} ${py} L ${px - s * 0.3} ${py - s * 0.3} Z`} fill={i % 3 ? color : "#fff"} />;
      })}
    </svg>
  );
};

/** Hand-drawn style highlight ring that draws itself. */
export const Ring: React.FC<{ start: number; x: number; y: number; rx: number; ry: number; color?: string; end?: number }> = ({ start, x, y, rx, ry, color = RED, end }) => {
  const f = useCurrentFrame();
  if (f < start || (end !== undefined && f > end)) return null;
  const p = ease(f, start, start + 14);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="none" stroke={color} strokeWidth={8} pathLength={1} strokeDasharray={`${p} 1`} strokeLinecap="round" transform={`rotate(-4 ${x} ${y})`} />
    </svg>
  );
};

/** Animated arrow pointing at a target. */
export const Arrow: React.FC<{ start: number; x: number; y: number; dir?: number; color?: string; end?: number }> = ({ start, x, y, dir = 0, color = GOLD, end }) => {
  const f = useCurrentFrame();
  if (f < start || (end !== undefined && f > end)) return null;
  const bob = Math.sin(f / 5) * 10;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(${x} ${y}) rotate(${dir}) translate(${bob} 0) scale(${pop(f, start)})`}>
        <path d="M -120 -14 L -40 -14 L -40 -40 L 0 0 L -40 40 L -40 14 L -120 14 Z" fill={color} stroke="#16120f" strokeWidth={5} />
      </g>
    </svg>
  );
};

/** Chapter card that slides in from the left (top-left corner). */
export const Chapter: React.FC<{ n: string; title: string; start?: number; len?: number }> = ({ n, title, start = 4, len = 75 }) => {
  const f = useCurrentFrame();
  const t = f - start;
  if (t < 0 || t > len + 12) return null;
  const inP = ease(f, start, start + 12);
  const outP = ease(f, start + len, start + len + 12);
  return (
    <div style={{ position: "absolute", left: 50, top: 50, transform: `translateX(${(-1 + inP) * 600 - outP * 600}px)`, display: "flex", alignItems: "stretch", fontFamily: hudFont, fontWeight: 900 }}>
      <div style={{ background: GOLD, color: "#16120f", padding: "6px 18px", fontSize: 30, display: "flex", alignItems: "center" }}>{n}</div>
      <div style={{ background: "rgba(14,12,12,0.9)", color: "#f6efdf", padding: "6px 24px", fontSize: 30, letterSpacing: 2 }}>{title}</div>
    </div>
  );
};

/** Film grain + light leak overlay (global). */
export const Grain: React.FC = () => {
  const f = useCurrentFrame();
  const seed = f % 8;
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: 0.06, mixBlendMode: "overlay", pointerEvents: "none" }}>
        <filter id={`gr${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} />
        </filter>
        <rect width={1920} height={1080} filter={`url(#gr${seed})`} />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          mixBlendMode: "screen",
          opacity: 0.12 + 0.06 * Math.sin(f / 70),
          background: `radial-gradient(circle at ${10 + 15 * Math.sin(f / 120)}% ${20 + 10 * Math.cos(f / 90)}%, rgba(255,160,80,0.55), transparent 40%)`,
        }}
      />
    </>
  );
};

/** Segmented progress bar (like the reference frame): one segment per scene. */
export const Progress: React.FC<{ segs: number[]; total: number }> = ({ segs, total }) => {
  const f = useCurrentFrame();
  let acc = 0;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, bottom: 22, height: 8, display: "flex", gap: 6 }}>
      {segs.map((d, i) => {
        const s = acc;
        acc += d;
        const p = Math.max(0, Math.min(1, (f - s) / d));
        return (
          <div key={i} style={{ flex: d / total, background: "rgba(140,150,170,0.45)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: `${p * 100}%`, height: "100%", background: i % 2 ? "#ff2d55" : "#ff1744", boxShadow: "0 0 8px #ff2d55" }} />
          </div>
        );
      })}
    </div>
  );
};

/** Big punch text with glow and shake-in. */
export const Punch: React.FC<{ text: string; start: number; x?: number; y?: number; size?: number; color?: string; end?: number; sub?: string }> = ({
  text,
  start,
  x = 960,
  y = 470,
  size = 150,
  color = "#f6efdf",
  end,
  sub,
}) => {
  const f = useCurrentFrame();
  if (f < start || (end !== undefined && f > end + 8)) return null;
  const p = pop(f, start, 8);
  const out = end !== undefined ? 1 - ease(f, end, end + 8) : 1;
  const jit = f - start < 8 ? Math.sin(f * 3) * 6 * (1 - (f - start) / 8) : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) translate(${jit}px,0) scale(${0.6 + 0.4 * p + (1 - p) * 0.8})`, opacity: out * Math.min(1, p * 2), textAlign: "center", whiteSpace: "nowrap" }}>
      <div style={{ fontFamily: hudFont, fontWeight: 900, fontSize: size, lineHeight: 1, color, textShadow: `0 0 40px ${color}99, 0 8px 0 #000, 0 0 2px #000` }}>{text}</div>
      {sub && <div style={{ fontFamily: hudFont, fontWeight: 900, fontSize: size * 0.3, color: "#f6efdf", textShadow: "0 4px 0 #000" }}>{sub}</div>}
    </div>
  );
};
