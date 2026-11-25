import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ease } from "../kit";
import { bodyFont, C } from "../kit";
import { CharDef, Expr, HandMode, Pose, POSES, Stick } from "../stick/Stick";
import { Burst, CamK, Chapter, GOLD, Grain, Hud, ICE, Layer, Pill, Progress, Punch, RED, SpeedLines, Tag, Vig } from "../stick/Hud";
import { Emote, EmoteKind, PClipboard, PCup, PFlowers, PLaser, PMirror, PPhone, PPopper, PRemote, PTablet, PTube, Spot, Bubble } from "../stick/props";
import { FPS, LEAD, Timing } from "./timing";

/* ------------------------------------------------------------------ *
 * Scene description types. A "W" is either a word in the narration
 * (string, optionally "word#2" for the 2nd occurrence) or a frame number.
 * ------------------------------------------------------------------ */
export type W = string | number;
export type Act =
  | "idle"
  | "point"
  | "pointL"
  | "pointUp"
  | "pointUpL"
  | "think"
  | "scratch"
  | "wave"
  | "cross"
  | "shrug"
  | "hips"
  | "brace"
  | "nails"
  | "cover"
  | "yawn"
  | "cheer"
  | "phone"
  | "hold"
  | "clap"
  | "rub"
  | "grip"
  | "talk"
  | "headHands"
  | "facepalm"
  | "reach";
export type ItemKey = "cup" | "phone" | "mirror" | "remote" | "laser" | "tablet" | "clipboard" | "flowers" | "tube" | "popper" | null;

export type Who = {
  c: CharDef;
  x: number | [W, number][];
  y?: number;
  s?: number;
  sit?: boolean;
  look?: number;
  lookY?: number;
  expr?: [W, Expr][];
  act?: [W, Act][];
  item?: [W, ItemKey][];
  talk?: [W, W][]; // talking windows
  age?: number;
  front?: React.ReactNode; // drawn in front of this character (seat, desk...)
  behind?: React.ReactNode;
  noEmote?: boolean;
  laserTo?: [number, number]; // world target for laser beam
};

export type Ov =
  | { t: "punch"; w: W; text: string; color?: string; y?: number; x?: number; size?: number; end?: W; sub?: string }
  | { t: "pill"; w: W; text: string; x: number; y: number; color?: string; end?: W; struck?: W; size?: number; world?: boolean }
  | { t: "tag"; w: W; text: string; x: number; y: number; color?: string; end?: W; size?: number; world?: boolean }
  | { t: "hud"; w: W; label: string; value: string; color?: string; x?: number; y?: number; wd?: number }
  | { t: "spot"; w: W; end: W; who?: number; x?: number; y?: number; r?: number }
  | { t: "emote"; w: W; who?: number; x?: number; y?: number; kind: EmoteKind; end?: W; s?: number }
  | { t: "bubble"; w: W; who: number; text: string; end?: W }
  | { t: "burst"; w: W; x: number; y: number; color?: string }
  | { t: "speed"; w: W; color?: string }
  | { t: "flash"; w: W; color?: string };

export type Spec = {
  env: (f: number, A: (w: W) => number) => React.ReactNode;
  who?: Who[];
  ov?: Ov[];
  /** screen-space widgets (HUDs, charts) */
  ui?: (f: number, A: (w: W) => number) => React.ReactNode;
  /** world-space props drawn between env and characters */
  props?: (f: number, A: (w: W) => number) => React.ReactNode;
  /** close-ups: [when, who index, hold frames?] */
  close?: [W, number, number?][];
  /** punch-ins on a world point: [when, x, y, zoom, hold?] */
  zoom?: [W, number, number, number, number?][];
  hits?: W[];
  start?: "in" | "out" | "pan" | "still";
  chapter?: [string, string];
  sfx?: [W, string, number?][];
  autoClose?: boolean;
};

/* ---------- helpers ---------- */
const smoothStep = (f: number, a: number, d: number) => interpolate(f, [a, a + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
export const mkA = (tm: Timing, id: string) => (w: W): number => {
  if (typeof w === "number") return w;
  const [word, n] = w.split("#");
  return tm.at(id, word, n ? Number(n) - 1 : 0);
};
const headW = (x: number, y: number, s: number, sit?: boolean): [number, number] => [x, y + (sit ? -419 : -504) * s];

type ActP = { pose: Pose; rR?: { x: number; y: number; w: number }; rL?: { x: number; y: number; w: number }; hR?: HandMode; hL?: HandMode; front?: boolean; lean?: number; dy?: number; trem?: number; lookY?: number };
const actParams = (a: Act, f: number, sit?: boolean): ActP => {
  const hy = sit ? 85 : 0; // seated: head is lower
  const wig = (amp: number, sp: number) => Math.sin(f / sp) * amp;
  switch (a) {
    case "point":
      return { pose: POSES.point, hR: "point" };
    case "pointL":
      return { pose: POSES.pointL, hL: "point" };
    case "pointUp":
      return { pose: POSES.pointUp, hR: "point" };
    case "pointUpL":
      return { pose: POSES.pointUpL, hL: "point" };
    case "think":
      return { pose: POSES.idle, rR: { x: 18, y: -440 + hy, w: 1 }, rL: { x: -10, y: -330 + hy, w: 1 }, hR: "fist", front: true, lookY: -0.4 };
    case "scratch":
      return { pose: POSES.idle, rR: { x: 85 + wig(6, 2), y: -560 + hy + wig(4, 1.7), w: 1 }, hR: "relaxed" };
    case "wave":
      return { pose: { l: POSES.idle.l, r: [130, 30 + wig(25, 3)] }, hR: "open" };
    case "cross":
      return { pose: POSES.cross };
    case "shrug":
      return { pose: POSES.shrug, hR: "open", hL: "open" };
    case "hips":
      return { pose: POSES.hips };
    case "brace":
      return { pose: POSES.idle, rR: { x: 70, y: -570 + hy, w: 1 }, rL: { x: -70, y: -570 + hy, w: 1 }, lean: 22, dy: 30, front: true, trem: 0.3 };
    case "headHands":
      return { pose: POSES.idle, rR: { x: 80, y: -540 + hy, w: 1 }, rL: { x: -80, y: -540 + hy, w: 1 }, hR: "open", hL: "open", front: true, trem: 0.4 };
    case "nails":
      return { pose: POSES.idle, rR: { x: 6 + wig(3, 1.4), y: -438 + hy, w: 1 }, rL: { x: -10, y: -330 + hy, w: 1 }, hR: "fist", front: true, trem: 0.4 };
    case "cover":
      return { pose: POSES.idle, rR: { x: 16, y: -455 + hy, w: 1 }, rL: { x: -16, y: -450 + hy, w: 1 }, hR: "open", hL: "open", front: true };
    case "rub":
      return { pose: POSES.idle, rR: { x: 26 + wig(5, 1.6), y: -505 + hy, w: 1 }, rL: { x: -26 - wig(5, 1.6), y: -505 + hy, w: 1 }, hR: "fist", hL: "fist", front: true };
    case "facepalm":
      return { pose: POSES.idle, rR: { x: 10, y: -520 + hy, w: 1 }, hR: "open", front: true, lookY: 0.5 };
    case "yawn":
      return { pose: POSES.idle, rR: { x: 100, y: -640 + hy, w: 1 }, rL: { x: -100, y: -640 + hy, w: 1 }, hR: "fist", hL: "fist", lean: wig(3, 8) };
    case "cheer":
      return { pose: POSES.idle, rR: { x: 120, y: -650 + hy + wig(14, 3), w: 1 }, rL: { x: -120, y: -650 + hy - wig(14, 3), w: 1 }, hR: "fist", hL: "fist" };
    case "phone":
      return { pose: POSES.idle, rR: { x: 50, y: -420 + hy, w: 1 }, rL: { x: -10, y: -380 + hy, w: 1 }, lookY: 0.6 };
    case "hold":
      return { pose: POSES.idle, rR: { x: 70, y: -420 + hy, w: 1 } };
    case "clap":
      return { pose: { l: [20, -130 + wig(25, 3)], r: [20, -130 + wig(25, 3)] }, hR: "open", hL: "open" };
    case "grip":
      return { pose: POSES.idle, rR: { x: 95, y: -190 + hy * 0.3, w: 1 }, rL: { x: -95, y: -190 + hy * 0.3, w: 1 }, hR: "fist", hL: "fist", trem: 0.5 };
    case "reach":
      return { pose: POSES.idle, rR: { x: 180, y: -380 + hy, w: 1 }, hR: "open" };
    case "talk":
    case "idle":
    default:
      return { pose: POSES.idle };
  }
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const mixR = (a: ActP["rR"], b: ActP["rR"], t: number) => {
  if (!a && !b) return undefined;
  const A = a ?? { x: b!.x, y: b!.y, w: 0 };
  const B = b ?? { x: a!.x, y: a!.y, w: 0 };
  return { x: mix(A.x, B.x, t), y: mix(A.y, B.y, t), w: mix(A.w, B.w, t) };
};
function timeline<T>(f: number, keys: [number, T][], d = 10): { prev: T; cur: T; t: number; since: number } {
  const ks = [...keys].sort((a, b) => a[0] - b[0]);
  let prev = ks[0][1];
  let cur = ks[0][1];
  let since = -999;
  for (let i = 1; i < ks.length; i++) {
    if (f >= ks[i][0]) {
      prev = cur;
      cur = ks[i][1];
      since = ks[i][0];
    }
  }
  return { prev, cur, t: smoothStep(f, since, d), since };
}
const ITEMS: Record<Exclude<ItemKey, null>, (w: Who, laser?: [number, number]) => React.ReactNode> = {
  cup: () => <PCup />,
  phone: () => <PPhone />,
  mirror: () => <PMirror rot={-15} />,
  remote: () => <PRemote />,
  laser: (_w, b) => <PLaser bx={b?.[0] ?? 160} by={b?.[1] ?? -120} />,
  tablet: () => <PTablet />,
  clipboard: () => <PClipboard />,
  flowers: () => <PFlowers />,
  tube: () => <PTube />,
  popper: () => <PPopper />,
};
const AUTO_EMOTE: Partial<Record<Expr, EmoteKind>> = { surprised: "!", worried: "sweat", confused: "?", sad: "dots", angry: "anger" };
const AUTO_ACT_EMOTE: Partial<Record<Act, EmoteKind>> = { think: "think", scratch: "?", nails: "sweat", headHands: "sweat", cheer: "spark", brace: "sweat" };
const EMOTE_SFX: Partial<Record<EmoteKind, [string, number]>> = { "!": ["surprise", 0.3], sweat: ["gulp", 0.35], "?": ["think", 0.3], think: ["think", 0.3], spark: ["sparkle", 0.25], dots: ["regret", 0.18], anger: ["pop", 0.25], idea: ["idea", 0.3] };

/* ------------------------------------------------------------------ *
 * Derived data (positions, emotes, close-ups, sfx) — shared by the
 * renderer and the sound-cue collector so they always agree.
 * ------------------------------------------------------------------ */
const xAt = (w: Who, f: number, A: (w: W) => number) => {
  if (typeof w.x === "number") return { x: w.x, walking: false };
  const keys = w.x.map(([k, v]) => [A(k), v] as [number, number]).sort((a, b) => a[0] - b[0]);
  if (keys.length === 1) return { x: keys[0][1], walking: false };
  let x = keys[0][1];
  let walking = false;
  for (let i = 0; i < keys.length - 1; i++) {
    const [f0, x0] = keys[i];
    const [f1, x1] = keys[i + 1];
    if (f >= f0 && f <= f1) {
      x = interpolate(f, [f0, f1], [x0, x1]);
      walking = x0 !== x1;
    } else if (f > f1) x = x1;
  }
  return { x, walking };
};
type Derived = { emotes: { who: number; kind: EmoteKind; start: number; end: number }[]; closes: [number, number, number][]; sfx: [number, string, number][] };
export const derive = (spec: Spec, A: (w: W) => number, dur: number): Derived => {
  const emotes: Derived["emotes"] = [];
  const sfx: Derived["sfx"] = [];
  const closes: [number, number, number][] = (spec.close ?? []).map(([w, i, h]) => [A(w), i, h ?? 70]);
  (spec.who ?? []).forEach((wh, i) => {
    if (wh.noEmote) return;
    const ek = (wh.expr ?? []).map(([w, e]) => [A(w), e] as [number, Expr]).sort((a, b) => a[0] - b[0]);
    ek.forEach(([fr, e], k) => {
      const kind = AUTO_EMOTE[e];
      if (!kind || fr <= 2) return;
      const end = k + 1 < ek.length ? ek[k + 1][0] - 4 : Math.min(dur - 10, fr + 75);
      emotes.push({ who: i, kind, start: fr, end });
      if (e === "surprised" && spec.autoClose !== false) closes.push([fr, i, 60]);
    });
    const ak = (wh.act ?? []).map(([w, a]) => [A(w), a] as [number, Act]).sort((a, b) => a[0] - b[0]);
    ak.forEach(([fr, a], k) => {
      const kind = AUTO_ACT_EMOTE[a];
      if (!kind) return;
      const end = k + 1 < ak.length ? ak[k + 1][0] - 4 : Math.min(dur - 10, fr + 75);
      emotes.push({ who: i, kind, start: fr + 4, end });
      if (a === "think" && spec.autoClose !== false) closes.push([fr, i, 60]);
    });
    // footsteps while walking
    if (typeof wh.x !== "number") {
      const keys = wh.x.map(([k, v]) => [A(k), v] as [number, number]).sort((a, b) => a[0] - b[0]);
      for (let k = 0; k < keys.length - 1; k++) if (keys[k][1] !== keys[k + 1][1]) for (let fr = keys[k][0]; fr < keys[k + 1][0]; fr += 12) sfx.push([fr, "step", 0.2]);
    }
  });
  for (const ov of spec.ov ?? []) {
    if (ov.t === "emote") emotes.push({ who: ov.who ?? -1, kind: ov.kind, start: A(ov.w), end: ov.end !== undefined ? A(ov.end) : A(ov.w) + 75 });
    if (ov.t === "punch") sfx.push([A(ov.w), "boom", 0.22]);
    if (ov.t === "pill" || ov.t === "tag") sfx.push([A(ov.w), "pop", 0.18]);
    if (ov.t === "flash") sfx.push([A(ov.w), "sting", 0.25]);
  }
  for (const e of emotes) {
    const s = EMOTE_SFX[e.kind];
    if (s) sfx.push([e.start, s[0], s[1]]);
  }
  for (const [w, s, v] of spec.sfx ?? []) sfx.push([A(w), s, v ?? 0.35]);
  closes.sort((a, b) => a[0] - b[0]);
  // de-duplicate close-ups that start too close together
  const cl: [number, number, number][] = [];
  for (const c of closes) if (!cl.length || c[0] - cl[cl.length - 1][0] > 45) cl.push(c);
  return { emotes, closes: cl, sfx };
};

/* ------------------------------------------------------------------ *
 * Scene renderer
 * ------------------------------------------------------------------ */
export const StoryScene: React.FC<{ spec: Spec; A: (w: W) => number; dur: number; index: number }> = ({ spec, A, dur, index }) => {
  const f = useCurrentFrame();
  const who = spec.who ?? [];
  const d = derive(spec, A, dur);
  const pos = who.map((w) => xAt(w, f, A));
  const heads = who.map((w, i) => headW(pos[i].x, w.y ?? 900, w.s ?? 1, w.sit));

  /* camera keys: establishing move + close-ups + zooms */
  const st = spec.start ?? (["in", "out", "pan", "in"] as const)[index % 4];
  const base: [number, number, number, number][] =
    st === "in"
      ? [
          [0, 1.0, 960, 540],
          [dur, 1.08, 960, 520],
        ]
      : st === "out"
        ? [
            [0, 1.18, 960, 500],
            [dur, 1.0, 960, 540],
          ]
        : st === "pan"
          ? [
              [0, 1.12, 860, 520],
              [dur, 1.12, 1060, 520],
            ]
          : [
              [0, 1.0, 960, 540],
              [dur, 1.0, 960, 540],
            ];
  const baseAt = (fr: number) => {
    const t = Math.max(0, Math.min(1, fr / dur));
    return [mix(base[0][1], base[1][1], t), mix(base[0][2], base[1][2], t), mix(base[0][3], base[1][3], t)] as const;
  };
  type CK = [number, number, number, number] | [number, number, number, number, "p"];
  const keys: CK[] = [[0, ...baseAt(0)]];
  const events: { at: number; hold: number; z: number; x: number; y: number }[] = [];
  for (const [fr, i, h] of d.closes) {
    if (!heads[i]) continue;
    const [hx, hy] = headW(xAt(who[i], fr, A).x, who[i].y ?? 900, who[i].s ?? 1, who[i].sit);
    events.push({ at: fr, hold: h, z: 2.1 / Math.max(0.7, who[i].s ?? 1) * 1, x: hx, y: hy + 60 * (who[i].s ?? 1) });
  }
  for (const [w, x, y, z, h] of spec.zoom ?? []) events.push({ at: A(w), hold: h ?? 70, z, x, y });
  events.sort((a, b) => a.at - b.at);
  let last = 0;
  for (const e of events) {
    if (e.at < last + 8) continue;
    const zz = Math.min(2.4, e.z);
    keys.push([Math.max(last + 1, e.at - 2), ...baseAt(e.at - 2)]);
    keys.push([e.at + 6, zz, e.x, e.y, "p"]);
    keys.push([e.at + 6 + e.hold, zz, e.x, e.y]);
    keys.push([e.at + 6 + e.hold + 14, ...baseAt(e.at + e.hold + 20)]);
    last = e.at + 6 + e.hold + 14;
  }
  keys.push([Math.max(last + 1, dur), ...baseAt(dur)]);
  const hits = [...(spec.hits ?? []).map(A), ...(spec.ov ?? []).filter((o) => o.t === "punch").map((o) => A(o.w))];

  const emoteNodes = d.emotes.map((e, k) => {
    const [hx, hy] = e.who >= 0 && heads[e.who] ? headW(xAt(who[e.who], f, A).x, who[e.who].y ?? 900, who[e.who].s ?? 1, who[e.who].sit) : [960, 300];
    const s = e.who >= 0 ? who[e.who].s ?? 1 : 1;
    const side = e.who >= 0 && hx > 1400 ? -1 : 1;
    return <Emote key={k} kind={e.kind} x={hx + side * 110 * s} y={hy - 140 * s} start={e.start} end={e.end} s={Math.max(0.6, Math.min(1, s))} />;
  });

  const ovWorld = (spec.ov ?? []).map((o, k) => {
    switch (o.t) {
      case "spot": {
        const p = o.who !== undefined ? heads[o.who] : [o.x ?? 960, o.y ?? 540];
        return <Spot key={k} keys={[[A(o.w), p[0], p[1], o.r ?? 170]]} start={A(o.w)} end={A(o.end)} />;
      }
      case "bubble": {
        const [hx, hy] = heads[o.who];
        const right = hx < 1300;
        return <Bubble key={k} text={o.text} x={hx + (right ? 40 : -40)} y={hy - 110} start={A(o.w)} end={o.end !== undefined ? A(o.end) : undefined} tail={right ? "left" : "right"} />;
      }
      case "pill":
        return o.world ? <Pill key={k} text={o.text} start={A(o.w)} end={o.end !== undefined ? A(o.end) : undefined} struck={o.struck !== undefined ? A(o.struck) : undefined} x={o.x} y={o.y} color={o.color} size={o.size} /> : null;
      case "tag":
        return o.world ? <Tag key={k} text={o.text} start={A(o.w)} end={o.end !== undefined ? A(o.end) : undefined} x={o.x} y={o.y} color={o.color} size={o.size} /> : null;
      default:
        return null;
    }
  });
  const ovScreen = (spec.ov ?? []).map((o, k) => {
    switch (o.t) {
      case "punch":
        return <Punch key={k} text={o.text} start={A(o.w)} end={o.end !== undefined ? A(o.end) : undefined} x={o.x} y={o.y ?? 860} size={o.size ?? 96} color={o.color ?? "#f6efdf"} sub={o.sub} />;
      case "pill":
        return o.world ? null : <Pill key={k} text={o.text} start={A(o.w)} end={o.end !== undefined ? A(o.end) : undefined} struck={o.struck !== undefined ? A(o.struck) : undefined} x={o.x} y={o.y} color={o.color} size={o.size} />;
      case "tag":
        return o.world ? null : <Tag key={k} text={o.text} start={A(o.w)} end={o.end !== undefined ? A(o.end) : undefined} x={o.x} y={o.y} color={o.color} size={o.size} />;
      case "hud":
        return <Hud key={k} label={o.label} value={o.value} start={A(o.w)} color={o.color} x={o.x} y={o.y} w={o.wd} />;
      case "burst":
        return <Burst key={k} start={A(o.w)} x={o.x} y={o.y} color={o.color} />;
      case "speed":
        return <SpeedLines key={k} start={A(o.w)} color={o.color} />;
      case "flash":
        return <div key={k} style={{ position: "absolute", inset: 0, background: o.color ?? RED, opacity: interpolate(f - A(o.w), [0, 3, 18], [0, 0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }} />;
      default:
        return null;
    }
  });

  return (
    <>
      <CamK keys={keys} hits={hits}>
        {spec.env(f, A)}
        {spec.props && <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{spec.props(f, A)}</svg>}
        <Layer>
          {who.map((w, i) => {
            const { x, walking } = pos[i];
            const acts = (w.act ?? [[0, "idle"]]).map(([k, v]) => [A(k), v] as [number, Act]);
            if (!acts.some(([k]) => k <= 0)) acts.unshift([0, "idle"]);
            const tl = timeline(f, acts, 10);
            const P0 = actParams(tl.prev, f, w.sit);
            const P1 = actParams(tl.cur, f, w.sit);
            const t = tl.t;
            const pose: Pose = { l: [mix(P0.pose.l[0], P1.pose.l[0], t), mix(P0.pose.l[1], P1.pose.l[1], t)], r: [mix(P0.pose.r[0], P1.pose.r[0], t), mix(P0.pose.r[1], P1.pose.r[1], t)] };
            const exprs = (w.expr ?? [[0, "neutral"]]).map(([k, v]) => [A(k), v] as [number, Expr]);
            if (!exprs.some(([k]) => k <= 0)) exprs.unshift([0, exprs[0]?.[1] ?? "neutral"]);
            const ex = timeline(f, exprs, 1).cur;
            const items = (w.item ?? []).map(([k, v]) => [A(k), v] as [number, ItemKey]);
            const it = items.length ? timeline(f, [[-1, null as ItemKey], ...items], 1).cur : null;
            const talking = (w.talk ?? []).some(([a, b]) => f >= A(a) && f < A(b));
            const pops = [...exprs.map(([k]) => k).filter((k) => k > 2), ...acts.map(([k]) => k).filter((k) => k > 2)];
            const s = w.s ?? 1;
            const y = w.y ?? 900;
            const handW: [number, number] | undefined = w.laserTo ? [x + (P1.rR?.x ?? 120) * s, y + (P1.rR?.y ?? -430) * s] : undefined;
            const beam: [number, number] | undefined = w.laserTo && handW ? [(w.laserTo[0] - handW[0]) / s, (w.laserTo[1] - handW[1]) / s] : undefined;
            const itemNode = it ? ITEMS[it](w, beam) : undefined;
            return (
              <g key={i}>
                {w.behind}
                <Stick
                  c={w.c}
                  x={x}
                  y={y}
                  s={s}
                  f={f + i * 13}
                  sit={w.sit}
                  walk={walking ? f / 3.6 : undefined}
                  expr={ex}
                  pose={pose}
                  look={w.look ?? (x > 960 ? -0.4 : 0.4)}
                  lookY={(w.lookY ?? 0) + mix(P0.lookY ?? 0, P1.lookY ?? 0, t)}
                  reachR={mixR(P0.rR, P1.rR, t) ?? (it ? { x: 70, y: -420 + (w.sit ? 85 : 0), w: 1 } : undefined)}
                  reachL={mixR(P0.rL, P1.rL, t)}
                  handR={t > 0.5 ? P1.hR : P0.hR}
                  handL={t > 0.5 ? P1.hL : P0.hL}
                  handsFront={t > 0.5 ? P1.front : P0.front}
                  lean={mix(P0.lean ?? 0, P1.lean ?? 0, t)}
                  dy={mix(P0.dy ?? 0, P1.dy ?? 0, t)}
                  tremble={mix(P0.trem ?? 0, P1.trem ?? 0, t)}
                  sweat={ex === "worried"}
                  talk={talking ? 0.45 : tl.cur === "talk" ? 0.45 : 0}
                  pops={pops}
                  seed={i * 3}
                  age={w.age}
                  itemR={itemNode}
                />
                {w.front}
              </g>
            );
          })}
          {emoteNodes}
        </Layer>
        {ovWorld}
      </CamK>
      {spec.ui && spec.ui(f, A)}
      {ovScreen}
      {spec.chapter && <Chapter n={spec.chapter[0]} title={spec.chapter[1]} />}
      <Vig />
    </>
  );
};

/* ------------------------------------------------------------------ *
 * Captions + full video
 * ------------------------------------------------------------------ */
const Captions: React.FC<{ tm: Timing; id: string }> = ({ tm, id }) => {
  const f = useCurrentFrame();
  const ts = tm.wordTimes(id);
  const chunks: (typeof ts)[] = [];
  let cur: typeof ts = [];
  ts.forEach((t, i) => {
    cur.push(t);
    const next = ts[i + 1];
    if (cur.length >= 6 || !next || next.sentence !== t.sentence || (/[,:]$/.test(t.w) && cur.length >= 3)) {
      chunks.push(cur);
      cur = [];
    }
  });
  const chunk = chunks.find((c) => f < c[c.length - 1].end + 6);
  if (!chunk || f < chunk[0].start - 4) return null;
  return (
    <div style={{ position: "absolute", bottom: 70, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "rgba(0,0,0,0.55)", padding: "10px 30px", borderRadius: 14, fontFamily: bodyFont, fontWeight: 800, fontSize: 54, color: C.white, display: "flex", gap: 20 }}>
        {chunk.map((t, i) => {
          const active = f >= t.start - 1 && f < t.end + 1;
          return (
            <span key={i} style={{ color: active ? C.ice : C.white, transform: `scale(${active ? 1.04 : 1})`, display: "inline-block" }}>
              {t.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const Sfx: React.FC<{ from: number; src: string; volume?: number }> = ({ from, src, volume = 0.5 }) => (
  <Sequence from={Math.max(0, from)} durationInFrames={90} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
  </Sequence>
);

export const StoryVideo: React.FC<{ tm: Timing; specs: Record<string, Spec>; voiceDir: string; endTitle: string }> = ({ tm, specs, voiceDir, endTitle }) => {
  const lastId = tm.ORDER[tm.ORDER.length - 1];
  return (
    <AbsoluteFill style={{ background: "#050b18" }}>
      {tm.ORDER.map((id, idx) => {
        const dur = tm.sceneFrames(id);
        const A = mkA(tm, id);
        const spec = specs[id];
        const d = derive(spec, A, dur);
        return (
          <Sequence key={id} from={tm.STARTS[id]} durationInFrames={dur}>
            <SceneShell dur={dur} last={id === lastId} voiceEnd={tm.voiceEnd(id)} endTitle={endTitle}>
              <StoryScene spec={spec} A={A} dur={dur} index={idx} />
              <Captions tm={tm} id={id} />
            </SceneShell>
            <Sequence from={LEAD} layout="none">
              <Audio src={staticFile(`${voiceDir}/${id}.wav`)} />
            </Sequence>
            {d.sfx.map(([fr, s, v], k) => (
              <Sfx key={k} from={fr} src={s} volume={v} />
            ))}
            {idx > 0 && <Sfx from={0} src="whoosh" volume={0.18} />}
          </Sequence>
        );
      })}
      <Audio src={staticFile("musica.mp3")} loop volume={(fr) => interpolate(fr, [0, 30, tm.TOTAL - 60, tm.TOTAL], [0, 0.13, 0.13, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      <Grain />
      <Progress segs={tm.ORDER.map(tm.sceneFrames)} total={tm.TOTAL} />
    </AbsoluteFill>
  );
};

const SceneShell: React.FC<{ dur: number; last: boolean; voiceEnd: number; endTitle: string; children: React.ReactNode }> = ({ dur, last, voiceEnd, endTitle, children }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 10, dur - 8, dur], [0, 1, 1, last ? 1 : 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const endFade = last ? ease(f, voiceEnd + 10, voiceEnd + 40) : 0;
  return (
    <AbsoluteFill style={{ opacity: op }}>
      {children}
      {last && (
        <>
          <div style={{ position: "absolute", inset: 0, background: "black", opacity: endFade }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: ease(f, voiceEnd + 30, voiceEnd + 50) }}>
            <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 96, color: GOLD, textShadow: "0 0 40px rgba(255,194,61,0.5)" }}>{endTitle}</div>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};
export { FPS, ICE, GOLD, RED };
