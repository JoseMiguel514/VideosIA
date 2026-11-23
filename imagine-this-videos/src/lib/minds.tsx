import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame } from "remotion";
import { FONT, FPS, INK, W, H } from "./scene";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Pensamiento: nube punteada turquesa con texto en cursiva; aparece en `at` y opcionalmente desaparece en `out` */
export const Thought: React.FC<{ at: number; out?: number; x: number; y: number; text: React.ReactNode; size?: number; color?: string; maxW?: number; tail?: "left" | "right" | "none"; dark?: boolean }> = ({
  at,
  out,
  x,
  y,
  text,
  size = 34,
  color = "#7ff0ff",
  maxW = 560,
  tail = "left",
  dark = true,
}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = spring({ frame: f - at, fps: FPS, config: { damping: 12, mass: 0.5 } });
  const o = out !== undefined ? interpolate(f, [out, out + 10], [1, 0], clamp) : 1;
  if (o <= 0) return null;
  const bob = Math.sin((f + at) / 18) * 5;
  return (
    <div style={{ position: "absolute", left: x, top: y + bob, transform: `translate(-50%,-100%) scale(${0.6 + 0.4 * s})`, opacity: Math.min(1, s * 2) * o, transformOrigin: "50% 100%" }}>
      <div
        style={{
          maxWidth: maxW,
          width: "max-content",
          padding: "16px 26px",
          borderRadius: 40,
          border: `4px dashed ${color}`,
          background: dark ? "rgba(10,14,40,.78)" : "rgba(255,255,255,.9)",
          color: dark ? "#e8fdff" : INK,
          fontFamily: FONT,
          fontWeight: 600,
          fontStyle: "italic",
          fontSize: size,
          lineHeight: 1.2,
          textAlign: "center",
          boxShadow: `0 0 24px ${color}55`,
        }}
      >
        {text}
      </div>
      {tail !== "none" && (
        <>
          <div style={{ position: "absolute", left: tail === "left" ? "30%" : "65%", bottom: -22, width: 18, height: 18, borderRadius: "50%", border: `3px dashed ${color}`, background: dark ? "rgba(10,14,40,.78)" : "#fff" }} />
          <div style={{ position: "absolute", left: tail === "left" ? "26%" : "70%", bottom: -42, width: 10, height: 10, borderRadius: "50%", border: `3px dashed ${color}`, background: dark ? "rgba(10,14,40,.78)" : "#fff" }} />
        </>
      )}
    </div>
  );
};

/** Diálogo hablado: burbuja blanca sólida */
export const Speech: React.FC<{ at: number; out?: number; x: number; y: number; text: React.ReactNode; size?: number }> = ({ at, out, x, y, text, size = 36 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = spring({ frame: f - at, fps: FPS, config: { damping: 12, mass: 0.5 } });
  const o = out !== undefined ? interpolate(f, [out, out + 10], [1, 0], clamp) : 1;
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-100%) scale(${0.6 + 0.4 * s})`, opacity: Math.min(1, s * 2) * o, transformOrigin: "50% 100%" }}>
      <div style={{ width: "max-content", maxWidth: 560, padding: "14px 26px", borderRadius: 24, background: "#fff", border: `5px solid ${INK}`, color: INK, fontFamily: FONT, fontWeight: 700, fontSize: size, boxShadow: "0 8px 0 rgba(0,0,0,.3)", textAlign: "center" }}>{text}</div>
      <div style={{ position: "absolute", left: "40%", bottom: -20, width: 0, height: 0, borderLeft: "14px solid transparent", borderRight: "14px solid transparent", borderTop: `22px solid ${INK}` }} />
    </div>
  );
};

/** ondas mentales que salen de un punto */
export const MindWaves: React.FC<{ x: number; y: number; color?: string; n?: number; speed?: number; size?: number }> = ({ x, y, color = "#7ff0ff", n = 3, speed = 1, size = 220 }) => {
  const f = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
      {Array.from({ length: n }).map((_, i) => {
        const p = ((f * speed) / 60 + i / n) % 1;
        return <circle key={i} cx={x} cy={y} r={30 + p * size} fill="none" stroke={color} strokeWidth={4} opacity={(1 - p) * 0.6} strokeDasharray="10 8" />;
      })}
    </svg>
  );
};

/** fragmentos de pensamiento que flotan (ruido mental) */
export const ThoughtNoise: React.FC<{ words: string[]; at?: number; density?: number; seed?: string; opacity?: number; area?: [number, number, number, number] }> = ({
  words,
  at = 0,
  density = 1,
  seed = "tn",
  opacity = 0.7,
  area = [80, 80, W - 80, H - 300],
}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {words.map((w, i) => {
        const t = (f - at) * density - i * 9;
        if (t < 0) return null;
        const life = (t % 120) / 120;
        const x = area[0] + random(`${seed}x${i}`) * (area[2] - area[0]);
        const y = area[1] + random(`${seed}y${i}`) * (area[3] - area[1]) - life * 40;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", fontFamily: FONT, fontWeight: 600, fontStyle: "italic", fontSize: 26 + random(`${seed}s${i}`) * 14, color: "#bff8ff", opacity: Math.sin(life * Math.PI) * opacity, whiteSpace: "nowrap", textShadow: "0 0 12px rgba(127,240,255,.6)" }}>
            {w}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** multitud ligera: cabezas + hombros (barato de renderizar) */
export const Crowd: React.FC<{ rows: number; perRow: number; y0: number; dy: number; scale0?: number; seed?: string; bounce?: number; colors?: string[] }> = ({
  rows,
  perRow,
  y0,
  dy,
  scale0 = 0.6,
  seed = "cr",
  bounce = 0,
  colors = ["#e2453a", "#f2c14e", "#6c8cff", "#3ee08a", "#ff7ab6", "#8e5ad0", "#f39c12", "#16a085"],
}) => {
  const f = useCurrentFrame();
  const items: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    const sc = scale0 + (r / Math.max(1, rows - 1)) * (1 - scale0);
    for (let i = 0; i < perRow; i++) {
      const x = ((i + (r % 2) * 0.5) / perRow) * (W + 100) - 50;
      const y = y0 + r * dy - Math.abs(Math.sin(f / 6 + i + r)) * bounce * sc;
      const c = colors[Math.floor(random(`${seed}${r}-${i}`) * colors.length)];
      items.push(
        <g key={`${r}-${i}`} transform={`translate(${x} ${y}) scale(${sc})`}>
          <path d="M-46 80 q0 -50 46 -54 q46 4 46 54z" fill={c} stroke={INK} strokeWidth={4} />
          <circle cx={0} cy={0} r={34} fill={["#2b2d3a", "#3b3f55", "#474b63"][(i + r) % 3]} stroke={INK} strokeWidth={4} />
          <circle cx={-10} cy={-4} r={5} fill="#fff" />
          <circle cx={10} cy={-4} r={5} fill="#fff" />
        </g>,
      );
    }
  }
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      {items}
    </svg>
  );
};

/** perro de caricatura */
export const Dog: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = useCurrentFrame();
  const wag = Math.sin(f / 3) * 20;
  return (
    <svg width={400} height={300} viewBox="0 0 400 300" style={{ position: "absolute", left: x - 200 * s, top: y - 300 * s, width: 400 * s, height: 300 * s }}>
      <path d={`M300 150 q40 -30 ${50 + wag * 0.3} ${-60 + wag}`} stroke="#c98a4a" strokeWidth={18} fill="none" strokeLinecap="round" />
      <ellipse cx={220} cy={180} rx={110} ry={60} fill="#e0a060" stroke={INK} strokeWidth={6} />
      {[140, 180, 260, 300].map((lx) => (
        <rect key={lx} x={lx - 12} y={210} width={24} height={70} rx={10} fill="#e0a060" stroke={INK} strokeWidth={5} />
      ))}
      <circle cx={110} cy={120} r={70} fill="#e0a060" stroke={INK} strokeWidth={6} />
      <path d="M60 80 q-30 40 0 90 q20 -10 20 -60z M160 80 q30 40 0 90 q-20 -10 -20 -60z" fill="#a8683a" stroke={INK} strokeWidth={5} />
      <circle cx={88} cy={110} r={10} fill={INK} />
      <circle cx={132} cy={110} r={10} fill={INK} />
      <ellipse cx={110} cy={145} rx={16} ry={11} fill={INK} />
      <path d="M110 156 q0 26 22 26" stroke={INK} strokeWidth={5} fill="none" />
      <path d={`M122 172 q8 ${22 + Math.sin(f / 4) * 4} 18 0`} fill="#ff7a8a" stroke={INK} strokeWidth={3} />
    </svg>
  );
};

/** teléfono con chat */
export const Phone: React.FC<{ x: number; y: number; msgs: { t: number; me?: boolean; text: string }[] }> = ({ x, y, msgs }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 420, height: 800, borderRadius: 56, background: "#111", border: `8px solid ${INK}`, padding: 22, boxSizing: "border-box" }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 38, background: "#eef2f7", overflow: "hidden", padding: "60px 18px 18px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 14 }}>
        {msgs
          .filter((m) => f > m.t)
          .map((m, i) => (
            <div key={i} style={{ alignSelf: m.me ? "flex-end" : "flex-start", maxWidth: "80%", background: m.me ? "#22c3b6" : "#fff", color: m.me ? "#fff" : INK, fontFamily: FONT, fontWeight: 600, fontSize: 28, padding: "12px 18px", borderRadius: 22, boxShadow: "0 3px 0 rgba(0,0,0,.12)", transform: `scale(${spring({ frame: f - m.t, fps: FPS, config: { damping: 14 } })})` }}>
              {m.text}
            </div>
          ))}
      </div>
    </div>
  );
};

/** escáner de resonancia magnética */
export const Scanner: React.FC<{ x: number; y: number; on?: number }> = ({ x, y, on = 0 }) => (
  <svg width={900} height={500} style={{ position: "absolute", left: x - 450, top: y - 400 }}>
    <rect x={60} y={340} width={780} height={60} rx={20} fill="#e9eef2" stroke={INK} strokeWidth={6} />
    <rect x={360} y={40} width={360} height={360} rx={160} fill="#f4f7f9" stroke={INK} strokeWidth={8} />
    <circle cx={540} cy={220} r={120} fill="#1a2a36" stroke={INK} strokeWidth={6} />
    <circle cx={540} cy={220} r={120} fill="none" stroke="#5ff0c8" strokeWidth={6} opacity={on} strokeDasharray="20 12" />
    <rect x={180} y={300} width={460} height={40} rx={18} fill="#cfe0e6" stroke={INK} strokeWidth={5} />
  </svg>
);
