import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ease, pop } from "../kit";
import { hudFont } from "./Hud";

/* ---------- Hand-held props (origin = grip point in the hand) ---------- */
const O = "#0b0a0c";

export const PMirror: React.FC<{ rot?: number }> = ({ rot = -10 }) => (
  <g transform={`rotate(${rot})`}>
    <rect x={-6} y={-10} width={12} height={60} rx={5} fill="#c9b48a" stroke={O} strokeWidth={3} />
    <ellipse cx={0} cy={-50} rx={36} ry={46} fill="#9fd3e6" stroke="#c9b48a" strokeWidth={8} />
    <ellipse cx={-10} cy={-62} rx={7} ry={14} fill="#fff" opacity={0.5} />
  </g>
);

export const PRemote: React.FC<{ press?: number }> = ({ press = 0 }) => (
  <g transform="rotate(-80)">
    <rect x={-14} y={-50} width={28} height={70} rx={8} fill="#2a2f38" stroke={O} strokeWidth={3} />
    <circle cx={0} cy={-34} r={7} fill={press > 0 ? "#7fe6ff" : "#e8343f"} />
    {press > 0 && <circle cx={0} cy={-34} r={7 + press * 16} fill="none" stroke="#7fe6ff" strokeWidth={3} opacity={1 - press} />}
  </g>
);

/** Laser pointer; beam drawn toward (bx, by) given in hand-local coords. */
export const PLaser: React.FC<{ bx?: number; by?: number; on?: boolean }> = ({ bx = 0, by = 0, on = true }) => {
  const f = useCurrentFrame();
  return (
    <g>
      {on && (
        <>
          <line x1={0} y1={0} x2={bx} y2={by} stroke="#ff2d3d" strokeWidth={3} opacity={0.75} />
          <circle cx={bx} cy={by} r={9 + Math.sin(f / 2) * 2} fill="#ff2d3d" opacity={0.9} />
          <circle cx={bx} cy={by} r={20} fill="#ff2d3d" opacity={0.25} />
        </>
      )}
      <rect x={-8} y={-8} width={44} height={16} rx={6} fill="#c9ced6" stroke={O} strokeWidth={3} transform={`rotate(${(Math.atan2(by, bx) * 180) / Math.PI})`} />
    </g>
  );
};

export const PTablet: React.FC<{ glow?: string }> = ({ glow = "#4fe3ff" }) => (
  <g transform="rotate(-8)">
    <rect x={-46} y={-70} width={92} height={120} rx={10} fill="#16181d" stroke={O} strokeWidth={4} />
    <rect x={-38} y={-62} width={76} height={100} rx={4} fill={glow} opacity={0.5} />
    <rect x={-30} y={-52} width={50} height={6} fill="#fff" opacity={0.7} />
    <rect x={-30} y={-40} width={36} height={6} fill="#fff" opacity={0.5} />
  </g>
);

export const PClipboard: React.FC<{ flip?: number }> = ({ flip = 0 }) => (
  <g transform="rotate(-6)">
    <rect x={-44} y={-90} width={88} height={116} rx={6} fill="#b98a52" stroke={O} strokeWidth={4} />
    <rect x={-36} y={-80} width={72} height={98} fill="#f4efe4" />
    {[0, 1, 2, 3, 4].map((i) => (
      <rect key={i} x={-28} y={-66 + i * 16} width={i % 2 ? 40 : 56} height={5} fill="#7f8db0" />
    ))}
    {flip > 0 && <path d={`M -36 -80 L 36 -80 L 36 ${-80 + 98 * flip} L -36 ${-80 + 98 * flip * 0.8} Z`} fill="#e9e2d4" stroke={O} strokeWidth={2} />}
    <rect x={-16} y={-96} width={32} height={14} rx={4} fill="#8a8f9a" stroke={O} strokeWidth={3} />
  </g>
);

export const PCup: React.FC<{ color?: string }> = ({ color = "#e9e2d4" }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <path d="M -22 -50 L 22 -50 L 18 8 L -18 8 Z" fill={color} stroke={O} strokeWidth={4} />
      <path d="M 22 -36 q 18 4 14 18 q -4 10 -16 8" fill="none" stroke={O} strokeWidth={4} />
      {[0, 1].map((i) => (
        <path key={i} d={`M ${-8 + i * 14} ${-58 - ((f * 0.7 + i * 12) % 30)} q 8 -10 0 -20`} stroke="#fff" strokeWidth={3} fill="none" opacity={0.4} />
      ))}
    </g>
  );
};

export const PFlowers: React.FC = () => (
  <g transform="rotate(-10)">
    <path d="M 0 20 L 0 -70" stroke="#3a7a3a" strokeWidth={6} />
    <path d="M 0 -20 L -18 -60 M 0 -30 L 18 -70" stroke="#3a7a3a" strokeWidth={5} />
    {[
      [0, -78],
      [-20, -66],
      [20, -76],
    ].map(([x, y], i) => (
      <g key={i}>
        {[0, 1, 2, 3, 4].map((k) => (
          <circle key={k} cx={x + Math.cos(k * 1.26) * 9} cy={y + Math.sin(k * 1.26) * 9} r={7} fill={["#ff6f9a", "#ffd166", "#b18cff"][i]} />
        ))}
        <circle cx={x} cy={y} r={5} fill="#fff3c4" />
      </g>
    ))}
    <path d="M -16 -6 L 16 -6 L 8 24 L -8 24 Z" fill="#f2e6c8" stroke={O} strokeWidth={3} />
  </g>
);

export const PPhone: React.FC<{ lit?: boolean }> = ({ lit = true }) => (
  <g transform="rotate(-12)">
    <rect x={-22} y={-60} width={44} height={84} rx={8} fill="#16181d" stroke={O} strokeWidth={3} />
    <rect x={-17} y={-52} width={34} height={66} rx={3} fill={lit ? "#e62117" : "#333"} />
    <path d="M -6 -28 L 8 -19 L -6 -10 Z" fill="#fff" />
  </g>
);

export const PTube: React.FC<{ color?: string }> = ({ color = "#7dff9b" }) => {
  const f = useCurrentFrame();
  return (
    <g transform="rotate(12)">
      <rect x={-12} y={-90} width={24} height={100} rx={12} fill="rgba(220,240,255,0.25)" stroke="#cfe6ff" strokeWidth={4} />
      <rect x={-9} y={-40} width={18} height={47} rx={9} fill={color} opacity={0.85} />
      {[0, 1].map((i) => (
        <circle key={i} cx={Math.sin(f / 5 + i) * 4} cy={-10 - ((f * 1.5 + i * 20) % 36)} r={3} fill="#fff" opacity={0.7} />
      ))}
    </g>
  );
};

export const PPopper: React.FC = () => (
  <g transform="rotate(-35)">
    <path d="M -14 10 L 14 10 L 26 -70 L -26 -70 Z" fill="#ff6f8f" stroke={O} strokeWidth={4} />
    <path d="M -20 -30 L 20 -40 M -18 -10 L 18 -20" stroke="#ffd166" strokeWidth={6} />
  </g>
);

/* ---------- Emotion markers (manga-style) ---------- */
export type EmoteKind = "!" | "?" | "sweat" | "anger" | "idea" | "think" | "heart" | "spark" | "dots" | "shock";

/** Emotion marker above a point (world coords); pops in at `start`, out at `end`. */
export const Emote: React.FC<{ kind: EmoteKind; x: number; y: number; start: number; end?: number; s?: number }> = ({ kind, x, y, start, end, s = 1 }) => {
  const f = useCurrentFrame();
  if (f < start || (end !== undefined && f > end + 8)) return null;
  const t = f - start;
  const p = pop(f, start, 9);
  const out = end !== undefined ? 1 - ease(f, end, end + 8) : 1;
  const wob = Math.sin(t / 4) * 6;
  let el: React.ReactNode = null;
  switch (kind) {
    case "!":
      el = (
        <g>
          {[-50, -20, 20, 50].map((a, i) => (
            <line key={i} x1={Math.sin((a * Math.PI) / 180) * 70} y1={-Math.cos((a * Math.PI) / 180) * 70} x2={Math.sin((a * Math.PI) / 180) * 100} y2={-Math.cos((a * Math.PI) / 180) * 100} stroke="#ffc23d" strokeWidth={8} strokeLinecap="round" />
          ))}
          <text x={0} y={30} textAnchor="middle" fontFamily={hudFont} fontWeight={900} fontSize={110} fill="#ffc23d" stroke={O} strokeWidth={6} paintOrder="stroke">
            !
          </text>
        </g>
      );
      break;
    case "shock":
      el = (
        <g>
          {new Array(8).fill(0).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return <line key={i} x1={Math.cos(a) * 60} y1={Math.sin(a) * 60} x2={Math.cos(a) * (95 + Math.sin(t + i) * 8)} y2={Math.sin(a) * (95 + Math.sin(t + i) * 8)} stroke="#fff" strokeWidth={6} strokeLinecap="round" />;
          })}
        </g>
      );
      break;
    case "?":
      el = (
        <text x={0} y={30} textAnchor="middle" fontFamily={hudFont} fontWeight={900} fontSize={110} fill="#7fe6ff" stroke={O} strokeWidth={6} paintOrder="stroke" transform={`rotate(${wob})`}>
          ?
        </text>
      );
      break;
    case "sweat":
      el = (
        <g>
          {[0, 1, 2].map((i) => {
            const yy = ((t * 2 + i * 12) % 40) - 20;
            return <path key={i} d={`M ${-30 + i * 30} ${yy} q -14 22 0 28 q 14 -6 0 -28 Z`} fill="#7cc8ff" stroke={O} strokeWidth={3} opacity={1 - ((t * 2 + i * 12) % 40) / 50} />;
          })}
        </g>
      );
      break;
    case "anger":
      el = (
        <g stroke="#e8343f" strokeWidth={9} strokeLinecap="round" fill="none" transform={`scale(${1 + 0.1 * Math.sin(t / 2)})`}>
          <path d="M -30 -10 Q -10 -10 -10 -30" />
          <path d="M 30 -10 Q 10 -10 10 -30" />
          <path d="M -30 10 Q -10 10 -10 30" />
          <path d="M 30 10 Q 10 10 10 30" />
        </g>
      );
      break;
    case "idea":
      el = (
        <g>
          {new Array(8).fill(0).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return <line key={i} x1={Math.cos(a) * 58} y1={-20 + Math.sin(a) * 58} x2={Math.cos(a) * 78} y2={-20 + Math.sin(a) * 78} stroke="#ffe680" strokeWidth={6} strokeLinecap="round" opacity={0.5 + 0.5 * Math.sin(t / 3)} />;
          })}
          <circle cx={0} cy={-20} r={38} fill="#ffe680" stroke={O} strokeWidth={5} />
          <rect x={-16} y={14} width={32} height={22} rx={4} fill="#9aa3b0" stroke={O} strokeWidth={4} />
        </g>
      );
      break;
    case "think":
      el = (
        <g>
          <circle cx={-50} cy={70} r={8} fill="#f6efdf" stroke={O} strokeWidth={3} opacity={t > 0 ? 1 : 0} />
          <circle cx={-30} cy={40} r={13} fill="#f6efdf" stroke={O} strokeWidth={3} opacity={t > 4 ? 1 : 0} />
          {t > 8 && (
            <g transform={`scale(${pop(f, start + 8)})`}>
              <ellipse cx={30} cy={-20} rx={80} ry={52} fill="#f6efdf" stroke={O} strokeWidth={4} />
              {[0, 1, 2].map((i) => (
                <circle key={i} cx={6 + i * 24} cy={-20} r={8} fill="#16120f" opacity={(Math.floor(t / 8) % 4) > i ? 1 : 0.2} />
              ))}
            </g>
          )}
        </g>
      );
      break;
    case "dots":
      el = (
        <g>
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={-30 + i * 30} cy={Math.sin(t / 4 + i) * 6} r={10} fill="#f6efdf" stroke={O} strokeWidth={3} opacity={(Math.floor(t / 8) % 4) > i ? 1 : 0.2} />
          ))}
        </g>
      );
      break;
    case "heart":
      el = <path d="M 0 30 C -60 -10 -40 -60 0 -30 C 40 -60 60 -10 0 30 Z" fill="#ff4d6d" stroke={O} strokeWidth={5} transform={`scale(${1 + 0.08 * Math.sin(t / 3)})`} />;
      break;
    case "spark":
      el = (
        <g>
          {[
            [-40, -10, 1],
            [30, -40, 0.7],
            [40, 20, 0.5],
          ].map(([sx, sy, k], i) => (
            <path key={i} transform={`translate(${sx} ${sy}) scale(${k * (0.8 + 0.3 * Math.sin(t / 3 + i))})`} d="M 0 -30 L 8 -8 L 30 0 L 8 8 L 0 30 L -8 8 L -30 0 L -8 -8 Z" fill="#ffe680" stroke={O} strokeWidth={3} />
          ))}
        </g>
      );
      break;
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s * p})`} opacity={out}>
      {el}
    </g>
  );
};

/* ---------- Focus spotlight ---------- */
type SpotKey = [number, number, number, number]; // frame, x, y, radius (world coords)
/** Darkens everything except a soft circle; animates between keys; fades in/out. */
export const Spot: React.FC<{ keys: SpotKey[]; start: number; end: number; dark?: number }> = ({ keys, start, end, dark = 0.72 }) => {
  const f = useCurrentFrame();
  if (f < start || f > end + 12) return null;
  const ks = [...keys].sort((a, b) => a[0] - b[0]);
  const v = (idx: 1 | 2 | 3) =>
    ks.length === 1
      ? ks[0][idx]
      : interpolate(
          f,
          ks.map((k) => k[0]),
          ks.map((k) => k[idx]),
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
  const o = ease(f, start, start + 10) * (1 - ease(f, end, end + 12));
  const r = v(3) * (1 + 0.6 * (1 - ease(f, start, start + 14)));
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity: o,
        background: `radial-gradient(circle at ${v(1)}px ${v(2)}px, rgba(0,0,0,0) ${r}px, rgba(0,0,0,${dark * 0.6}) ${r + 50}px, rgba(0,0,0,${dark}) ${r + 160}px)`,
      }}
    />
  );
};

/** Comic speech bubble attached to a point. */
export const Bubble: React.FC<{ text: string; x: number; y: number; start: number; end?: number; size?: number; tail?: "left" | "right" }> = ({ text, x, y, start, end, size = 40, tail = "left" }) => {
  const f = useCurrentFrame();
  if (f < start || (end !== undefined && f > end + 8)) return null;
  const out = end !== undefined ? 1 - ease(f, end, end + 8) : 1;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(${tail === "left" ? "0" : "-100%"}, -100%) scale(${pop(f, start)})`, transformOrigin: tail === "left" ? "0 100%" : "100% 100%", opacity: out }}>
      <div style={{ background: "#f6efdf", border: "5px solid #16120f", borderRadius: 26, padding: "10px 26px", fontFamily: hudFont, fontWeight: 900, fontSize: size, color: "#16120f", whiteSpace: "nowrap" }}>{text}</div>
      <svg width={60} height={36} style={{ position: "absolute", [tail === "left" ? "left" : "right"]: 24, bottom: -30 }}>
        <path d={tail === "left" ? "M 4 0 L 40 0 L 6 32 Z" : "M 56 0 L 20 0 L 54 32 Z"} fill="#f6efdf" stroke="#16120f" strokeWidth={5} />
        <rect x={0} y={-6} width={60} height={9} fill="#f6efdf" />
      </svg>
    </div>
  );
};
