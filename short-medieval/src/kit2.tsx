/**
 * kit2: cámara cinematográfica + transiciones + reacciones.
 * - CamPro: keyframes con easing por tramo (cut / smooth / snap = crash zoom / whip = barrido con motion blur),
 *   empuje lento continuo (drift), dutch angle, sacudidas, "impact frames" y parallax real por capas (Depth).
 * - Reaction: líneas de enfoque estilo anime + signo de exclamación para sorpresa/asombro.
 * - NarratedVideo2: igual que NarratedVideo pero con transiciones entre escenas y subtítulos con palabras clave resaltadas.
 */
import React, { createContext, useContext } from "react";
import { AbsoluteFill, Audio, Easing, interpolate, random, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { INK } from "./Characters";
import { FPS, LEAD, makeTiming } from "./kit";
import type { VozData, Word } from "./kit";
import { H, W } from "./Scenery";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

/* ------------------------------------------------------------------ camera */
export type Ease = "cut" | "smooth" | "snap" | "whip";
/** t: frame, s: zoom, x/y: focus offset from screen centre (world px), r: roll (deg), drift: zoom-per-second push-in */
export type Move = { t: number; s: number; x: number; y: number; r?: number; ease?: Ease; dur?: number; drift?: number };
type CamState = { s: number; x: number; y: number; r: number };

const segP = (f: number, m: Move) => {
  const d = f - m.t;
  switch (m.ease ?? "smooth") {
    case "cut":
      return 1;
    case "snap":
      return spring({ frame: d, fps: FPS, config: { damping: 11, stiffness: 230, mass: 0.7 } });
    case "whip":
      return interpolate(d, [0, m.dur ?? 7], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
    default:
      return interpolate(d, [0, m.dur ?? 16], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  }
};

export const camAt = (moves: Move[], f: number, free = false): CamState => {
  const target = (m: Move, fr: number): CamState => ({ s: m.s * (1 + ((m.drift ?? 0.025) * Math.max(0, fr - m.t)) / FPS), x: m.x, y: m.y, r: m.r ?? 0 });
  let from = target(moves[0], moves[0].t);
  let cur = from;
  for (let i = 0; i < moves.length; i++) {
    const m = moves[i];
    if (f < m.t) break;
    const next = moves[i + 1];
    const evalAt = (fr: number) => {
      const p = i === 0 ? 1 : segP(fr, m);
      const tg = target(m, fr);
      return { s: from.s + (tg.s - from.s) * p, x: from.x + (tg.x - from.x) * p, y: from.y + (tg.y - from.y) * p, r: from.r + (tg.r - from.r) * p };
    };
    if (!next || f < next.t) {
      cur = evalAt(f);
      break;
    }
    from = evalAt(next.t);
    cur = from;
  }
  if (free) return cur;
  // keep the frame inside the world
  const mx = ((cur.s - 1) * W) / (2 * cur.s);
  const my = ((cur.s - 1) * H) / (2 * cur.s);
  return { ...cur, x: Math.max(-mx - 60, Math.min(mx + 60, cur.x)), y: Math.max(-my - 60, Math.min(my + 60, cur.y)) };
};

const CamCtx = createContext<CamState>({ s: 1, x: 0, y: 0, r: 0 });

export const CamPro: React.FC<{ moves: Move[]; children: React.ReactNode; shake?: number[]; impact?: number[]; handheld?: number; blur?: boolean; free?: boolean }> = ({
  moves,
  children,
  shake = [],
  impact = [],
  handheld = 1,
  blur = false,
  free = false,
}) => {
  const f = useCurrentFrame();
  const c = camAt(moves, f, free);
  const p = camAt(moves, f - 1, free);
  let sx = 0;
  let sy = 0;
  let sr = 0;
  for (const s of shake) {
    const d = f - s;
    if (d >= 0 && d < 16) {
      const a = Math.pow(1 - d / 16, 2) * 30;
      sx += Math.sin(d * 2.9 + s) * a;
      sy += Math.cos(d * 3.7 + s) * a;
      sr += Math.sin(d * 2.1) * a * 0.04;
    }
  }
  sx += (Math.sin(f / 37) * 6 + Math.sin(f / 15.3) * 2.5) * handheld;
  sy += (Math.cos(f / 43) * 5 + Math.sin(f / 21.7) * 2) * handheld;
  const rot = c.r + sr + Math.sin(f / 61) * 0.35 * handheld;
  // motion blur from camera velocity (directional SVG blur)
  const vx = Math.abs((c.x - p.x) * c.s);
  const vy = Math.abs((c.y - p.y) * c.s);
  const vz = Math.abs(Math.log(c.s / p.s)) * 900;
  const bx = blur ? Math.min(16, vx * 0.1 + vz * 0.06) : 0;
  const by = blur ? Math.min(16, vy * 0.1 + vz * 0.06) : 0;
  const isImpact = impact.some((t) => f >= t && f < t + 2);
  const mb = Math.min(7, Math.max(bx, by) * 0.45);
  const filters = [mb > 1.2 ? `blur(${mb.toFixed(1)}px)` : "", isImpact ? "grayscale(1) contrast(4) invert(1)" : ""].filter(Boolean).join(" ");
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: filters || undefined }}>
        <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px) rotate(${rot}deg) scale(${c.s * 1.02}) translate(${-c.x}px, ${-c.y}px)`, transformOrigin: "50% 50%" }}>
          <CamCtx.Provider value={c}>{children}</CamCtx.Provider>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Parallax layer: d<1 = far (moves less), d>1 = foreground (moves more) */
export const Depth: React.FC<{ d: number; children: React.ReactNode; blur?: number; z?: number }> = ({ d, children, blur, z }) => {
  const c = useContext(CamCtx);
  const sd = 1 + (c.s - 1) * d;
  const k = sd / c.s;
  const tx = W / 2 + c.x - k * (W / 2 + d * c.x);
  const ty = H / 2 + c.y - k * (H / 2 + d * c.y);
  return (
    <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) scale(${k})`, transformOrigin: "0 0", filter: blur && sd < 1.6 ? `blur(${blur}px)` : undefined, zIndex: z, pointerEvents: "none" }}>
      {children}
    </AbsoluteFill>
  );
};

/** Crash-zoom helper: returns moves for a reaction close-up (snap in, slight roll) */
export const react = (t: number, x: number, y: number, s = 2.3, r = -3): Move => ({ t, s, x, y, r, ease: "snap", drift: 0.06 });

/* ------------------------------------------------------------------ reaction overlay */
export const Reaction: React.FC<{ at: number; mark?: string; color?: string; x?: number; y?: number; dur?: number }> = ({ at, mark = "!", color = "#ffd23f", x = 540, y = 760, dur = 26 }) => {
  const f = useCurrentFrame();
  const d = f - at;
  if (d < 0 || d > dur) return null;
  const o = interpolate(d, [0, 2, dur - 8, dur], [0, 1, 1, 0], clamp);
  const s = spring({ frame: d, fps: FPS, config: { damping: 8, stiffness: 220 } });
  return (
    <AbsoluteFill style={{ zIndex: 9400, pointerEvents: "none", opacity: o }}>
      <svg width={W} height={H}>
        {Array.from({ length: 48 }).map((_, i) => {
          const a = (i / 48) * Math.PI * 2 + random(`ra${i}`) * 0.1;
          const r0 = 520 + random(`rr${i}-${Math.floor(d / 2)}`) * 260;
          const w = 6 + random(`rw${i}`) * 16;
          const cx = 540;
          const cy = 960;
          const x1 = cx + Math.cos(a) * r0;
          const y1 = cy + Math.sin(a) * r0 * 1.5;
          const x2 = cx + Math.cos(a) * 1500;
          const y2 = cy + Math.sin(a) * 2200;
          const px = -Math.sin(a) * w;
          const py = Math.cos(a) * w;
          return <polygon key={i} points={`${x1},${y1} ${x2 + px},${y2 + py} ${x2 - px},${y2 - py}`} fill={i % 3 ? "white" : INK} opacity={0.8} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${s}) rotate(${Math.sin(d / 2) * 6}deg)`, fontFamily: "Montserrat", fontWeight: 800, fontSize: 220, color, WebkitTextStroke: `20px ${INK}`, paintOrder: "stroke fill", textShadow: "8px 12px 0 rgba(0,0,0,0.4)" }}>{mark}</div>
    </AbsoluteFill>
  );
};

/** Comic onomatopoeia burst */
export const Pow: React.FC<{ at: number; text: string; x: number; y: number; color?: string; rot?: number; size?: number; dur?: number }> = ({ at, text, x, y, color = "#ffd23f", rot = -8, size = 150, dur = 24 }) => {
  const f = useCurrentFrame();
  const d = f - at;
  if (d < 0 || d > dur) return null;
  const s = spring({ frame: d, fps: FPS, config: { damping: 7, stiffness: 260 } });
  const o = interpolate(d, [dur - 6, dur], [1, 0], clamp);
  const pts = Array.from({ length: 22 }).map((_, i) => {
    const a = (i / 22) * Math.PI * 2;
    const r = i % 2 ? 150 : 250 + random(`pw${i}`) * 50;
    return `${Math.cos(a) * r * 1.5},${Math.sin(a) * r}`;
  });
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${s}) rotate(${rot}deg)`, zIndex: 9300, opacity: o }}>
      <svg width={900} height={600} viewBox="-450 -300 900 600" style={{ position: "absolute", left: -450, top: -300, overflow: "visible" }}>
        <polygon points={pts.join(" ")} fill={color} stroke={INK} strokeWidth="14" strokeLinejoin="round" />
      </svg>
      <div style={{ position: "relative", fontFamily: "Montserrat", fontWeight: 800, fontSize: size, color: "white", WebkitTextStroke: `16px ${INK}`, paintOrder: "stroke fill", whiteSpace: "nowrap", transform: "translate(-50%, -50%)" }}>{text}</div>
    </div>
  );
};

/** Slow-motion label + letterbox bars */
export const SlowMo: React.FC<{ from: number; to: number; label?: string }> = ({ from, to, label = "CÁMARA LENTA ×1000" }) => {
  const f = useCurrentFrame();
  if (f < from || f > to) return null;
  const p = interpolate(f, [from, from + 6, to - 6, to], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ zIndex: 9200, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 190 * p, background: "black" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 190 * p, background: "black" }} />
      <div style={{ position: "absolute", top: 210, left: 60, opacity: p, fontFamily: "Oswald", fontWeight: 700, fontSize: 50, color: "#ff5a5a", letterSpacing: 3 }}>
        <span style={{ display: "inline-block", width: 26, height: 26, borderRadius: 13, background: "#ff3b3b", marginRight: 14, opacity: Math.floor(f / 8) % 2 ? 1 : 0.2 }} />
        {label}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ captions + video wrapper */
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

export const Captions2: React.FC<{ words: Word[]; hi?: string[]; color?: string }> = ({ words, hi = [], color = "#ffd23f" }) => {
  const f = useCurrentFrame();
  const t = (f - LEAD) / FPS;
  let cur = -1;
  for (let i = 0; i < words.length; i++) if (t >= words[i].s - 0.02) cur = i;
  if (cur < 0) return null;
  const w = words[cur];
  if (t > w.e + 0.5) return null;
  const local = f - (LEAD + w.s * FPS);
  const isHi = hi.includes(norm(w.w));
  const sc = spring({ frame: local, fps: FPS, config: { damping: 10, stiffness: 260 } }) * (isHi ? 1.18 : 1);
  return (
    <div style={{ position: "absolute", top: 1290, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 9999 }}>
      <div style={{ transform: `scale(${0.75 + 0.25 * sc}) rotate(${isHi ? -3 : 0}deg)`, fontFamily: "Montserrat", fontWeight: 800, fontSize: 100, color: isHi ? color : "white", WebkitTextStroke: `16px ${INK}`, paintOrder: "stroke fill", textShadow: "4px 8px 0 rgba(0,0,0,0.55)", whiteSpace: "nowrap" }}>{w.w}</div>
    </div>
  );
};

/** transitions between scenes: bubbles (underwater) or iris (microscope lens) */
const Transitions: React.FC<{ cuts: number[]; kind: "bubbles" | "iris"; color: string }> = ({ cuts, kind, color }) => {
  const f = useCurrentFrame();
  const c = cuts.find((b) => Math.abs(f - b) <= 8);
  if (c === undefined) return null;
  const d = f - c;
  const cov = 1 - Math.abs(d) / 9; // 0..1..0
  if (kind === "iris") {
    const r = (1 - Easing.inOut(Easing.cubic)(cov)) * 1250;
    return (
      <AbsoluteFill style={{ zIndex: 9900, pointerEvents: "none" }}>
        <svg width={W} height={H}>
          <defs>
            <mask id="irism">
              <rect width={W} height={H} fill="white" />
              <circle cx={540} cy={960} r={r} fill="black" />
            </mask>
          </defs>
          <rect width={W} height={H} fill="#0a0f0a" mask="url(#irism)" />
          <circle cx={540} cy={960} r={r} fill="none" stroke={color} strokeWidth="18" />
          <circle cx={540} cy={960} r={r + 30} fill="none" stroke={INK} strokeWidth="24" />
        </svg>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ zIndex: 9900, pointerEvents: "none" }}>
      <svg width={W} height={H}>
        {Array.from({ length: 26 }).map((_, i) => {
          const x = random(`tb${i}`) * W;
          const y0 = random(`ty${i}`) * H;
          const y = y0 - d * (20 + random(`tv${i}`) * 25);
          const r = Math.max(0, Easing.out(Easing.cubic)(cov) * (260 + random(`tr${i}`) * 220) - (d > 0 ? 0 : 0));
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={r} fill={color} stroke={INK} strokeWidth="10" />
              <ellipse cx={x - r * 0.35} cy={y - r * 0.4} rx={r * 0.25} ry={r * 0.13} fill="white" opacity="0.8" />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

const ProgressBar2: React.FC<{ total: number; color: string }> = ({ total, color }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 14, background: "rgba(0,0,0,0.35)", zIndex: 9999 }}>
      <div style={{ width: `${(f / total) * 100}%`, height: "100%", background: color, boxShadow: `0 0 12px ${color}` }} />
    </div>
  );
};

export const NarratedVideo2: React.FC<{
  voz: VozData;
  order: string[];
  tail?: Record<string, number>;
  scenes: Record<string, React.FC>;
  folder: string;
  music: string;
  musicVol?: number;
  progress?: string;
  hi?: string[];
  hiColor?: string;
  transition?: "bubbles" | "iris";
  transColor?: string;
}> = ({ voz, order, tail = {}, scenes, folder, music, musicVol = 0.14, progress = "#ffd23f", hi = [], hiColor, transition = "bubbles", transColor = "#bfe9ff" }) => {
  const { frames, starts, total } = makeTiming(voz, order, tail);
  const cuts = order.slice(1).map((id) => starts[id]);
  return (
    <AbsoluteFill style={{ background: "#111" }}>
      {order.map((id) => {
        const S = scenes[id];
        return (
          <Sequence key={id} from={starts[id]} durationInFrames={frames(id)} name={id}>
            <AbsoluteFill>
              <S />
              <Captions2 words={voz[id].words} hi={hi.map(norm)} color={hiColor} />
            </AbsoluteFill>
            <Sequence from={LEAD} layout="none">
              <Audio src={staticFile(`${folder}/${id}.wav`)} volume={1} />
            </Sequence>
          </Sequence>
        );
      })}
      <Transitions cuts={cuts} kind={transition} color={transColor} />
      {cuts.map((c) => (
        <Sequence key={c} from={c - 6} layout="none">
          <Audio src={staticFile("sfx/whoosh.wav")} volume={0.18} />
        </Sequence>
      ))}
      <ProgressBar2 total={total} color={progress} />
      <Audio src={staticFile(music)} loop volume={(fr) => interpolate(fr, [0, 20, total - 40, total], [0, musicVol, musicVol, 0], clamp)} />
    </AbsoluteFill>
  );
};
