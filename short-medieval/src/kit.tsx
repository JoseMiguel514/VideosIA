import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { INK, Toon } from "./Characters";
import type { Expr, Pose } from "./Characters";
import { Banner, GothicWindow, H, Room, W, WallTorch } from "./Scenery";

loadOswald("normal", { weights: ["700"] });
loadMontserrat("normal", { weights: ["800"] });

export const FPS = 30;
export const LEAD = 3;
export type Word = { w: string; s: number; e: number };
export type VozData = Record<string, { dur: number; words: Word[] }>;

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

/** Timing helpers for a narrated video: scene lengths follow the narration */
export const makeTiming = (voz: VozData, order: string[], tail: Record<string, number> = {}) => {
  const frames = (id: string) => Math.ceil(voz[id].dur * FPS) + LEAD + 3 + (tail[id] ?? 0);
  const starts: Record<string, number> = {};
  let a = 0;
  for (const id of order) {
    starts[id] = a;
    a += frames(id);
  }
  const wf = (id: string, word: string, nth = 0) => {
    const hits = voz[id].words.filter((w) => norm(w.w) === norm(word));
    const w = hits[nth] ?? hits[0];
    if (!w) throw new Error(`word ${word} not in ${id}`);
    return LEAD + Math.round(w.s * FPS);
  };
  return { frames, starts, total: a, wf };
};

export const Captions: React.FC<{ words: Word[] }> = ({ words }) => {
  const f = useCurrentFrame();
  const t = (f - LEAD) / FPS;
  let cur = -1;
  for (let i = 0; i < words.length; i++) if (t >= words[i].s - 0.02) cur = i;
  if (cur < 0) return null;
  const w = words[cur];
  if (t > w.e + 0.5) return null;
  const local = f - (LEAD + w.s * FPS);
  const sc = interpolate(local, [0, 3], [0.88, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top: 1300, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 9999 }}>
      <div style={{ transform: `scale(${sc})`, fontFamily: "Montserrat", fontWeight: 800, fontSize: 96, color: "white", WebkitTextStroke: `16px ${INK}`, paintOrder: "stroke fill", textShadow: "4px 7px 0 rgba(0,0,0,0.55)", whiteSpace: "nowrap" }}>{w.w}</div>
    </div>
  );
};

/** Plays a narrated video: one Sequence per scene + voice + music */
export const NarratedVideo: React.FC<{ voz: VozData; order: string[]; tail?: Record<string, number>; scenes: Record<string, React.FC>; folder: string; music?: string; musicVol?: number; progress?: string }> = ({
  voz,
  order,
  tail = {},
  scenes,
  folder,
  music = "musica.wav",
  musicVol = 0.16,
  progress,
}) => {
  const { frames, starts, total } = makeTiming(voz, order, tail);
  return (
    <AbsoluteFill style={{ background: "#111" }}>
      {order.map((id) => {
        const S = scenes[id];
        return (
          <Sequence key={id} from={starts[id]} durationInFrames={frames(id)} name={id}>
            <AbsoluteFill>
              <S />
              <Captions words={voz[id].words} />
            </AbsoluteFill>
            <Sequence from={LEAD} layout="none">
              <Audio src={staticFile(`${folder}/${id}.wav`)} volume={1} />
            </Sequence>
          </Sequence>
        );
      })}
      {progress && <ProgressBar total={total} color={progress} />}
      <Audio src={staticFile(music)} loop volume={(fr) => interpolate(fr, [0, 20, total - 40, total], [0, musicVol, musicVol, 0], { extrapolateRight: "clamp" })} />
    </AbsoluteFill>
  );
};

/** thin retention progress bar at the bottom */
const ProgressBar: React.FC<{ total: number; color: string }> = ({ total, color }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 14, background: "rgba(0,0,0,0.35)", zIndex: 9999 }}>
      <div style={{ width: `${(f / total) * 100}%`, height: "100%", background: color, boxShadow: `0 0 12px ${color}` }} />
    </div>
  );
};

export const At: React.FC<{ x: number; y: number; children: React.ReactNode; at?: number; z?: number; from?: "pop" | "left" | "right" | "drop" | "none"; exitAt?: number }> = ({
  x,
  y,
  children,
  at = 0,
  z,
  from = "pop",
  exitAt,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at) return null;
  const cfg = { damping: 11, stiffness: 150 };
  const s = spring({ frame: f - at, fps, config: cfg });
  const v = s - spring({ frame: f - at - 1, fps, config: cfg }); // velocity -> squash & stretch
  const sq = Math.max(-0.25, Math.min(0.25, v * 2.2));
  let tf = "";
  if (from === "pop") tf = `scale(${s * (1 - sq)}, ${s * (1 + sq)})`;
  const hop = -Math.abs(Math.sin((1 - s) * Math.PI * 4)) * 70 * (1 - s);
  if (from === "left") tf = `translateX(${(1 - s) * -900}px) translateY(${hop}px) rotate(${(1 - s) * 12}deg) scale(${1 + sq * 0.5}, ${1 - sq * 0.5})`;
  if (from === "right") tf = `translateX(${(1 - s) * 900}px) translateY(${hop}px) rotate(${(1 - s) * -12}deg) scale(${1 + sq * 0.5}, ${1 - sq * 0.5})`;
  if (from === "drop") tf = `translateY(${(1 - s) * -1400}px)`;
  let op = 1;
  if (exitAt !== undefined) {
    const e = interpolate(f, [exitAt, exitAt + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    tf += ` scale(${1 - e})`;
    op = 1 - e;
  }
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -100%)", zIndex: z ?? Math.round(y), opacity: op }}>
      <div style={{ transform: tf, transformOrigin: "50% 100%" }}>{children}</div>
    </div>
  );
};

export type Key = [number, number, number, number]; // frame, scale, x, y (focus point offset)
export const Cam: React.FC<{ keys: Key[]; children: React.ReactNode; shakeAt?: number[] }> = ({ keys, children, shakeAt = [] }) => {
  const f = useCurrentFrame();
  const fr = keys.map((k) => k[0]);
  const opt = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: Easing.inOut(Easing.cubic) };
  const sc = keys.length > 1 ? interpolate(f, fr, keys.map((k) => k[1]), opt) : keys[0][1];
  const x = keys.length > 1 ? interpolate(f, fr, keys.map((k) => k[2]), opt) : keys[0][2];
  const y = keys.length > 1 ? interpolate(f, fr, keys.map((k) => k[3]), opt) : keys[0][3];
  const mx = ((sc - 1) * W) / (2 * sc);
  const my = ((sc - 1) * H) / (2 * sc);
  const cx = Math.max(-mx, Math.min(mx, x));
  const cy = Math.max(-my, Math.min(my, y));
  let sx = 0;
  let sy = 0;
  for (const s of shakeAt) {
    const d = f - s;
    if (d >= 0 && d < 12) {
      const a = (1 - d / 12) * 22;
      sx += Math.sin(d * 2.7) * a;
      sy += Math.cos(d * 3.3) * a;
    }
  }
  // intro punch
  const punch = 1;
  // handheld drift
  sx += Math.sin(f / 37) * 7 + Math.sin(f / 17) * 3;
  sy += Math.cos(f / 41) * 6 + Math.sin(f / 23) * 2.5;
  const rot = Math.sin(f / 53) * 0.4;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px) rotate(${rot}deg) scale(${sc * punch * 1.015}) translate(${-cx}px, ${-cy}px)`, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Sfx: React.FC<{ at: number; src: string; vol?: number }> = ({ at, src, vol = 0.6 }) => (
  <Sequence from={Math.max(0, at)} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={vol} />
  </Sequence>
);

/** Build camera keys from shots: [start, scaleFrom, scaleTo, focusX, focusY]. Hard cuts between shots. */
export type Shot = [number, number, number, number, number];
export const shots = (list: Shot[], end: number): Key[] => {
  const keys: Key[] = [];
  list.forEach(([s, a, b, x, y], i) => {
    const e = i + 1 < list.length ? list[i + 1][0] - 1 : end;
    if (e - s > 14) {
      keys.push([s, a * 1.045, x, y]);
      keys.push([s + 9, a + ((b - a) * 9) / (e - s), x, y]);
    } else keys.push([s, a, x, y]);
    keys.push([e - s > 14 ? e : Math.max(s + 1, e), b, x, y]);
  });
  return keys;
};

/* ---------- captions: reference style (white, one word, punctuation kept) ---------- */
export const BG: React.FC<{ children: React.ReactNode; blur?: number }> = ({ children, blur = 2.5 }) => <AbsoluteFill style={{ filter: `blur(${blur}px)` }}>{children}</AbsoluteFill>;
export const Grade: React.FC<{ tint?: string; vig?: number }> = ({ tint, vig = 0.62 }) => (
  <>
    {tint && <AbsoluteFill style={{ background: tint, mixBlendMode: "multiply", zIndex: 9990 }} />}
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 60% at 50% 45%, rgba(0,0,0,0) 45%, rgba(5,8,15,${vig}) 100%)`, zIndex: 9991 }} />
  </>
);

/** pose switch with blend: before `at` -> a, after -> b (eased over 8 frames) */
export const sw8 = (f: number, at: number, a: Pose, b: Pose) => (f < at ? { pose: a } : { pose: b, prevPose: a, poseT: (f - at) / 8 });

/* ---------- shared sets ---------- */
export const Court: React.FC = () => (
  <BG>
    <Room wall="#9fd6c8" side="#5f9f90" floorA="#eef7f3" floorB="#3d8e7c" trim="#2f6f62">
      <GothicWindow x={440} y={330} w={200} h={360} />
      <Banner x={235} y={330} color="#2f4f8f" />
      <Banner x={715} y={330} color="#a3202c" />
      <WallTorch x={300} y={760} />
      <WallTorch x={780} y={760} />
    </Room>
  </BG>
);
export const Bench: React.FC<{ x?: number; y?: number; w?: number }> = ({ x = 540, y = 1540, w = 800 }) => {
  const h = w * 0.5;
  return (
    <svg width={w} height={h} viewBox="0 0 620 310" style={{ position: "absolute", left: x - w / 2, top: y - h, zIndex: y }}>
      <defs>
        <linearGradient id="wood" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#a0663a" />
          <stop offset="1" stopColor="#5e3519" />
        </linearGradient>
      </defs>
      <rect x="10" y="40" width="600" height="265" fill="url(#wood)" stroke={INK} strokeWidth="10" rx="8" />
      <rect x="0" y="20" width="620" height="44" fill="#b77a48" stroke={INK} strokeWidth="10" rx="8" />
      <rect x="10" y="28" width="600" height="8" fill="#e0a877" opacity="0.6" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={45 + i * 185} y="95" width="160" height="175" fill="rgba(0,0,0,0.15)" stroke={INK} strokeWidth="6" rx="6" />
      ))}
      <circle cx="310" cy="182" r="52" fill="#e6bd55" stroke={INK} strokeWidth="8" />
      <path d="M310 148 l0 68 M286 168 q24 -38 48 0 M291 196 l38 0" stroke="#8f1c24" strokeWidth="9" fill="none" strokeLinecap="round" />
    </svg>
  );
};
export const JUDGE = { x: 540, y: 1330, h: 900 };
export const judgeHead = JUDGE.y - 0.732 * JUDGE.h - 960; // focus y for judge's face
export const Judge: React.FC<{ expr?: Expr; talking?: boolean; pose?: Pose; prevPose?: Pose; poseT?: number }> = ({ expr = "neutral", talking = false, pose = "idle", prevPose, poseT }) => (
  <At x={JUDGE.x} y={JUDGE.y} z={1000} from="none">
    <Toon hair="judge" hairColor="#b3242f" beard="#8f8a86" outfit="#a3202c" outfit2="#f4efe6" robe expr={expr} talking={talking} pose={pose} prevPose={prevPose} poseT={poseT} prop={pose === "gavel" ? "gavel" : "none"} height={JUDGE.h} seed={2} />
  </At>
);
export const headY = (feet: number, h: number) => feet - 0.732 * h - 960;
export const pigHeadY = (feet: number, h: number) => feet - (380 / 600) * h - 960;

export const Bars: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 9, stiffness: 180 } });
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - s) * -1900}px)`, zIndex: 5000 }}>
      <defs>
        <linearGradient id="bar" x1="0" x2="1">
          <stop offset="0" stopColor="#9aa3ad" />
          <stop offset="0.4" stopColor="#5d636e" />
          <stop offset="1" stopColor="#2c3038" />
        </linearGradient>
      </defs>
      <rect x="0" y="560" width={W} height="40" fill="url(#bar)" stroke={INK} strokeWidth="8" />
      <rect x="0" y="1700" width={W} height="40" fill="url(#bar)" stroke={INK} strokeWidth="8" />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={30 + i * 125} y="300" width="36" height="1600" fill="url(#bar)" stroke={INK} strokeWidth="8" />
      ))}
    </svg>
  );
};

/** Back of a head (crowd in foreground, like the reference's over-the-shoulder shots) */
export const BackHead: React.FC<{ x: number; y: number; r: number; hair: string; seed?: number }> = ({ x, y, r, hair, seed = 0 }) => {
  const f = useCurrentFrame();
  const b = Math.sin(f / 10 + seed) * 6;
  return (
    <svg width={r * 2.4} height={r * 3} viewBox="0 0 240 300" style={{ position: "absolute", left: x - r * 1.2, top: y - r * 1.2 + b, zIndex: 8000 + seed, overflow: "visible" }}>
      <defs>
        <radialGradient id={`bh${seed}`} cx="35%" cy="30%" r="75%">
          <stop offset="0.5" stopColor="#ffffff" />
          <stop offset="1" stopColor="#b9c2cf" />
        </radialGradient>
      </defs>
      <rect x="70" y="170" width="100" height="160" rx="50" fill="#4a3a5a" stroke={INK} strokeWidth="8" />
      <circle cx="120" cy="110" r="100" fill="url(#bh${seed})" stroke={INK} strokeWidth="8" />
      <path d="M22 100 Q30 0 120 8 Q210 0 218 100 Q170 70 120 72 Q70 70 22 100 Z" fill={hair} stroke={INK} strokeWidth="8" />
    </svg>
  );
};

/* ---------- scenes ---------- */
