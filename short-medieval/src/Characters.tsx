import React, { useId } from "react";
import { Easing, interpolate, random, useCurrentFrame } from "remotion";

export const INK = "#16121c";

export type Expr = "neutral" | "happy" | "surprised" | "angry" | "smug" | "worried";

/* ---------- shared face parts (reference style: small solid ovals, thick curved brows) ---------- */
export const Eyes: React.FC<{ cx: number; cy: number; gap: number; size: number; expr: Expr; f: number; seed: number; look?: number; lid?: string }> = ({
  cx,
  cy,
  gap,
  size,
  expr,
  f,
  seed,
  look = 0,
  lid = "#f4f6f8",
}) => {
  const blink = (f + seed * 37) % 101 < 4 ? 0.1 : 1;
  const big = expr === "surprised" ? 1.25 : 1;
  const rx = size * 0.8 * big;
  const ry = size * 1.05 * big * blink;
  const browY = cy - size * (expr === "surprised" ? 2.9 : expr === "worried" ? 2.4 : 2.1);
  const brow = (s: -1 | 1) => {
    const x = cx + s * gap;
    // inner end (toward nose) / outer end heights
    let inner = 0;
    let outer = 0;
    let arch = -size * 0.5;
    if (expr === "angry") {
      inner = size * 0.9;
      outer = -size * 0.3;
      arch = 0;
    }
    if (expr === "worried") {
      inner = -size * 0.8;
      outer = size * 0.4;
      arch = -size * 0.2;
    }
    if (expr === "smug") {
      inner = s === 1 ? -size * 0.6 : size * 0.3;
      outer = s === 1 ? size * 0.2 : 0;
      arch = -size * 0.4;
    }
    const xi = x - s * size * 1.2;
    const xo = x + s * size * 1.3;
    return <path d={`M${xi} ${browY + inner} Q${x} ${browY + arch + (inner + outer) / 2} ${xo} ${browY + outer}`} stroke={INK} strokeWidth={size * 0.55} fill="none" strokeLinecap="round" />;
  };
  return (
    <g>
      {[-1, 1].map((s) => (
        <g key={s}>
          <ellipse cx={cx + s * gap + look} cy={cy} rx={rx} ry={Math.max(ry, 1.5)} fill={INK} />
          {expr === "smug" && blink > 0.5 && (
            <>
              <rect x={cx + s * gap + look - rx - 2} y={cy - ry - 2} width={rx * 2 + 4} height={ry * 0.95} fill={lid} />
              <line x1={cx + s * gap + look - rx - 4} x2={cx + s * gap + look + rx + 4} y1={cy - ry * 0.08} y2={cy - ry * 0.08} stroke={INK} strokeWidth={size * 0.35} strokeLinecap="round" />
            </>
          )}
          {brow(s as -1 | 1)}
        </g>
      ))}
    </g>
  );
};

export const Mouth: React.FC<{ cx: number; cy: number; w: number; expr: Expr; talking: boolean; f: number }> = ({ cx, cy, w, expr, talking, f }) => {
  const open = talking ? Math.abs(Math.sin(f * 0.62) * Math.sin(f * 0.23 + 1)) : 0;
  const x = cx + w * 0.15; // slightly off-center like the reference
  if (expr === "surprised" || expr === "worried" || open > 0.3) {
    const h = expr === "surprised" ? w * 0.55 : expr === "worried" && open < 0.3 ? w * 0.3 : w * 0.18 + open * w * 0.4;
    const rx = expr === "surprised" ? w * 0.36 : w * 0.3;
    return (
      <g>
        <ellipse cx={x} cy={cy + h * 0.3} rx={rx} ry={h * 0.55} fill="#3a1620" stroke={INK} strokeWidth={w * 0.12} />
        <ellipse cx={x} cy={cy + h * 0.55} rx={rx * 0.55} ry={h * 0.18} fill="#e06b86" />
      </g>
    );
  }
  if (expr === "angry") return <path d={`M${x - w / 2} ${cy + 6} Q${x} ${cy - 8} ${x + w / 2} ${cy + 6}`} stroke={INK} strokeWidth={w * 0.15} fill="none" strokeLinecap="round" />;
  if (expr === "smug") return <path d={`M${x - w / 2} ${cy + 2} Q${x} ${cy + w * 0.25} ${x + w / 2} ${cy - w * 0.12}`} stroke={INK} strokeWidth={w * 0.15} fill="none" strokeLinecap="round" />;
  const curve = expr === "happy" ? w * 0.45 : w * 0.2;
  return <path d={`M${x - w / 2} ${cy} Q${x} ${cy + curve} ${x + w / 2} ${cy - 2}`} stroke={INK} strokeWidth={w * 0.15} fill={expr === "happy" ? "#3a1620" : "none"} strokeLinecap="round" />;
};

const shade = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k)))));
  return `rgb(${c.join(",")})`;
};

/* ---------- humans ---------- */
export type ToonProps = {
  hair?: "bowl" | "spiky" | "hood" | "helmet" | "judge" | "lawyer" | "bald" | "kerchief" | "curly" | "long" | "ponytail" | "buzz" | "plague" | "astro" | "fedora" | "kepi" | "beret";
  mustache?: string | null;
  stubble?: boolean;
  lashes?: boolean;
  hairColor?: string;
  outfit?: string; // vest / tunic
  outfit2?: string; // shirt strip
  robe?: boolean;
  beard?: string | null;
  expr?: Expr;
  talking?: boolean;
  pose?: Pose;
  prop?: "spear" | "gavel" | "scroll" | "pitchfork" | "none";
  seed?: number;
  height?: number;
  flip?: boolean;
  look?: number;
  prevPose?: Pose;
  poseT?: number; // 0..1 blend from prevPose to pose
  walking?: boolean;
};
export type Pose = "idle" | "point" | "up" | "gavel" | "hips" | "shrug" | "hold" | "fight" | "salute";

/** Smooth wandering eye direction (eye darts) */
export const gazeAt = (f: number, seed: number, amp: number) => {
  const seg = Math.floor(f / 42);
  const tgt = (k: number) => (random(`gaze${seed}-${k}`) - 0.5) * 2 * amp;
  const t = interpolate(f - seg * 42, [0, 5], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  return tgt(seg - 1) + (tgt(seg) - tgt(seg - 1)) * t;
};

/** Reference-style toon: big white round head, capsule body, stick limbs with ball hands. viewBox 400x820, feet ~805. */
export const Toon: React.FC<ToonProps> = ({
  hair = "bowl",
  hairColor = "#d8692a",
  outfit = "#d9a82a",
  outfit2 = "#f2f2ee",
  robe = false,
  beard = null,
  expr = "neutral",
  talking = false,
  pose = "idle",
  prop = "none",
  seed = 0,
  height = 800,
  flip = false,
  look = 0,
  prevPose,
  poseT = 1,
  walking = false,
  stubble = false,
  lashes = false,
  mustache = null,
}) => {
  const uid = useId().replace(/:/g, "");
  const f = useCurrentFrame() + seed * 13;
  const tk = talking ? 1 : 0;
  // walk cycle / idle weight shift
  const step = walking ? Math.sin(f / 3.2) : 0;
  const bob = walking ? -Math.abs(step) * 16 : Math.sin(f / 11) * 5 + tk * Math.abs(Math.sin(f / 4.5)) * -5;
  const sway = Math.sin(f / 21) * 2.6 + Math.sin(f / 9) * 0.6 + tk * Math.sin(f / 13) * 1.5 + (walking ? step * 3 : 0);
  const headY = 205 + bob * 0.4;
  // head tilt + nod (lags behind the body for overlapping action)
  const tilt = Math.sin((f - 6) / 21) * -3.2 + Math.sin(f / 31) * 2 + tk * Math.sin(f / 7) * 3.5;
  const nod = tk * Math.sin(f / 4.3) * 5;
  const breathe = 1 + Math.sin(f / 13) * 0.022;
  const gaze = look + gazeAt(f, seed, 9);
  const sw = 10;
  const gavelSwing = -125 + Math.max(0, Math.sin(f / 5)) * 75;
  const gest = (k: number) => tk * (Math.sin(f / (5 + k) + k) * 16 + Math.sin(f / 11 + k * 2) * 8);
  const armsFor = (p: Pose): [number, number] =>
    (({
      idle: [12 + Math.sin(f / 12) * 4 + gest(1) * 1.4, -12 - Math.sin(f / 12 + 1) * 4 - gest(2) * 2],
      point: [12 + Math.sin(f / 12) * 4 + gest(1), -88 + Math.sin(f / 7) * 6 + gest(3) * 0.6],
      up: [155 + Math.sin(f / 3) * 12, -155 - Math.sin(f / 3 + 0.8) * 12],
      gavel: [14 + Math.sin(f / 12) * 4, gavelSwing],
      hips: [35 + Math.sin(f / 15) * 3, -35 - gest(2) * 2.2 - Math.sin(f / 15) * 3],
      shrug: [75 + Math.sin(f / 8) * 9, -75 - Math.sin(f / 8) * 9],
      hold: [12 + gest(1), -60 + Math.sin(f / 9) * 6 + gest(2) * 0.5],
      fight: [118 + Math.sin(f / 5) * 8, -95 - Math.max(0, Math.sin(f / 4)) * 45],
      salute: [12 + Math.sin(f / 12) * 3, -160 + Math.sin(f / 10) * 3],
    }) as Record<Pose, [number, number]>)[p];
  const cur = armsFor(pose);
  const prev = prevPose ? armsFor(prevPose) : cur;
  const bt = Easing.out(Easing.back(1.6))(Math.max(0, Math.min(1, poseT)));
  const la = prev[0] + (cur[0] - prev[0]) * bt;
  const ra = prev[1] + (cur[1] - prev[1]) * bt;
  const shL = { x: 132, y: 410 + bob };
  const shR = { x: 268, y: 410 + bob };
  const armLen = 200;
  const hand = (sh: { x: number; y: number }, ang: number) => {
    const r = (ang * Math.PI) / 180;
    return { x: sh.x - Math.sin(r) * armLen, y: sh.y + Math.cos(r) * armLen };
  };
  const hL = hand(shL, la);
  const hR = hand(shR, ra);
  const bodyTop = 330 + bob;
  const bodyBot = robe ? 760 : 630;
  const legSw = walking ? step * 26 : Math.sin(f / 21) * 6;
  const hairD = shade(hairColor, -0.25);
  const hairL = shade(hairColor, 0.35);
  const lid = "#eef2f6";

  const Arm: React.FC<{ s: { x: number; y: number }; h: { x: number; y: number }; side: number }> = ({ s, h, side }) => {
    const mx = (s.x + h.x) / 2 + side * 18;
    const my = (s.y + h.y) / 2 + 10;
    return (
      <g>
        <path d={`M${s.x} ${s.y} Q${mx} ${my} ${h.x} ${h.y}`} stroke={INK} strokeWidth={11} fill="none" strokeLinecap="round" />
        <circle cx={h.x} cy={h.y} r="20" fill={`url(#hand${uid})`} stroke={INK} strokeWidth="3" />
      </g>
    );
  };

  return (
    <svg width={(height * 400) / 820} height={height} viewBox="0 0 400 820" style={{ overflow: "visible", transform: flip ? "scaleX(-1)" : undefined }}>
      <defs>
        <radialGradient id={`head${uid}`} cx="40%" cy="35%" r="70%">
          <stop offset="0.55" stopColor="#ffffff" />
          <stop offset="0.85" stopColor="#e4e9f0" />
          <stop offset="1" stopColor="#c3cbd8" />
        </radialGradient>
        <linearGradient id={`body${uid}`} x1="0" x2="1">
          <stop offset="0" stopColor={shade(outfit, 0.15)} />
          <stop offset="0.6" stopColor={outfit} />
          <stop offset="1" stopColor={shade(outfit, -0.35)} />
        </linearGradient>
        <linearGradient id={`hair${uid}`} x1="0" x2="0.4" y1="0" y2="1">
          <stop offset="0" stopColor={hairL} />
          <stop offset="0.5" stopColor={hairColor} />
          <stop offset="1" stopColor={hairD} />
        </linearGradient>
        <radialGradient id={`hand${uid}`} cx="35%" cy="30%" r="70%">
          <stop offset="0" stopColor="#6a5560" />
          <stop offset="0.5" stopColor="#2e2329" />
          <stop offset="1" stopColor="#120d11" />
        </radialGradient>
        <linearGradient id={`metal${uid}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#eef2f6" />
          <stop offset="0.5" stopColor="#aab4c0" />
          <stop offset="1" stopColor="#6c7684" />
        </linearGradient>
      </defs>
      <ellipse cx="200" cy="808" rx="110" ry="14" fill="rgba(0,0,0,0.3)" />
      {prop === "spear" && (
        <g transform={`translate(${hR.x - 200} ${bob})`}>
          <line x1="200" y1="60" x2="200" y2="805" stroke={INK} strokeWidth="16" strokeLinecap="round" />
          <line x1="200" y1="60" x2="200" y2="805" stroke="#8a5a32" strokeWidth="8" />
          <path d="M200 -40 L224 70 L200 58 L176 70 Z" fill={`url(#metal${uid})`} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        </g>
      )}
      {prop === "pitchfork" && (
        <g transform={`translate(${hR.x - 200} ${bob})`}>
          <line x1="200" y1="160" x2="200" y2="805" stroke={INK} strokeWidth="15" />
          <line x1="200" y1="160" x2="200" y2="805" stroke="#a57441" strokeWidth="8" />
          <path d="M160 70 L160 150 Q200 180 240 150 L240 70 M200 60 L200 170" stroke={INK} strokeWidth={10} fill="none" strokeLinecap="round" />
        </g>
      )}
      {/* legs: very thin, slightly bent, no feet */}
      <g>
        <path d={`M178 ${bodyBot - 20} Q${168 + legSw} 720 ${170 - legSw} 805 l-14 2`} stroke={INK} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M222 ${bodyBot - 20} Q${236 - legSw} 720 ${228 + legSw} 805 l14 2`} stroke={INK} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M222 ${bodyBot - 20} Q${236 - legSw} 720 ${228 + legSw} 805`} stroke="#5d6072" strokeWidth={3.5} fill="none" strokeLinecap="round" />
      </g>
      <g transform={`rotate(${sway} 200 805)`}>
        {/* back arm */}
        <Arm s={shL} h={{ x: hL.x, y: hL.y + bob }} side={-1} />
        {/* capsule body (breathing) */}
        <g transform={`translate(200 ${bodyBot}) scale(${2 - breathe} ${breathe}) translate(-200 ${-bodyBot})`}>
          <rect x="118" y={bodyTop} width="164" height={bodyBot - bodyTop} rx="80" fill={`url(#body${uid})`} stroke={INK} strokeWidth={sw} />
        </g>
        {/* shirt strip + vest edges */}
        <path d={`M178 ${bodyTop + 6} L178 ${bodyBot - 8} Q200 ${bodyBot - 4} 222 ${bodyBot - 8} L222 ${bodyTop + 6} Z`} fill={outfit2} />
        <line x1="178" y1={bodyTop + 8} x2="178" y2={bodyBot - 10} stroke={INK} strokeWidth="4" opacity="0.8" />
        <line x1="222" y1={bodyTop + 8} x2="222" y2={bodyBot - 10} stroke={INK} strokeWidth="4" opacity="0.8" />
        {/* stitching */}
        <path d={`M135 ${bodyBot - 48} Q200 ${bodyBot - 36} 265 ${bodyBot - 48}`} stroke={shade(outfit, 0.5)} strokeWidth="3.5" strokeDasharray="12 9" fill="none" opacity="0.9" />
        {!robe && <rect x="232" y={bodyTop + 110} width="34" height="30" rx="5" fill={shade(outfit, 0.45)} stroke={INK} strokeWidth="3" opacity="0.9" />}
        {robe && (
          <>
            <path d={`M170 ${bodyTop + 4} L200 ${bodyTop + 70} L230 ${bodyTop + 4}`} fill="#fbfbf8" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
            <path d={`M118 ${bodyTop + 160} Q200 ${bodyTop + 180} 282 ${bodyTop + 160}`} stroke={shade(outfit, -0.4)} strokeWidth="14" fill="none" />
          </>
        )}
        {/* front arm */}
        <Arm s={shR} h={{ x: hR.x, y: hR.y + bob }} side={1} />
        {prop === "gavel" && (
          <g transform={`translate(${hR.x} ${hR.y + bob}) rotate(${ra + 180})`}>
            <rect x="-6" y="-100" width="12" height="100" fill="#8a5a2b" stroke={INK} strokeWidth="4" />
            <rect x="-40" y="-138" width="80" height="42" rx="9" fill="#9b5f32" stroke={INK} strokeWidth="6" />
            <rect x="-34" y="-132" width="30" height="10" rx="4" fill="#d79a62" opacity="0.8" />
          </g>
        )}
        {prop === "scroll" && (
          <g transform={`translate(${hR.x - 10} ${hR.y + bob - 30}) rotate(-8)`}>
            <rect x="-10" y="-70" width="90" height="120" fill="#f1e2bd" stroke={INK} strokeWidth="6" />
            <rect x="-18" y="-82" width="106" height="20" rx="10" fill="#dcc185" stroke={INK} strokeWidth="5" />
            <rect x="-18" y="40" width="106" height="20" rx="10" fill="#dcc185" stroke={INK} strokeWidth="5" />
            {[0, 1, 2, 3].map((i) => (
              <line key={i} x1="5" x2={65 - (i % 2) * 15} y1={-45 + i * 22} y2={-45 + i * 22} stroke="#9b7b4a" strokeWidth="5" />
            ))}
          </g>
        )}
        {/* head */}
        <g transform={`translate(0 ${nod}) rotate(${tilt} 200 ${headY + 150})`}>
          {hair === "long" && (
            <path d={`M48 ${headY - 10} Q40 ${headY - 175} 200 ${headY - 172} Q360 ${headY - 175} 352 ${headY - 10} Q${372 + Math.sin(f / 9) * 6} ${headY + 140} ${352 + Math.sin(f / 9) * 10} ${headY + 255} Q200 ${headY + 230} ${48 + Math.sin(f / 9 + 1) * 10} ${headY + 255} Q${28 + Math.sin(f / 9 + 1) * 6} ${headY + 140} 48 ${headY - 10} Z`} fill={`url(#hair${uid})`} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
          )}
          {hair === "ponytail" && (
            <g transform={`rotate(${Math.sin(f / 8) * 9 + sway * 2} 300 ${headY - 110})`}>
              <path d={`M290 ${headY - 120} Q400 ${headY - 120} 395 ${headY + 20} Q390 ${headY + 150} 335 ${headY + 210} Q360 ${headY + 90} 320 ${headY - 20} Z`} fill={`url(#hair${uid})`} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
              <path d={`M350 ${headY - 70} Q380 ${headY + 20} 355 ${headY + 140}`} stroke={hairL} strokeWidth="6" fill="none" strokeLinecap="round" />
            </g>
          )}
          {hair === "hood" && <path d={`M40 ${headY + 40} Q30 ${headY - 190} 200 ${headY - 195} Q370 ${headY - 190} 360 ${headY + 40} L370 ${headY + 210} L30 ${headY + 210} Z`} fill={`url(#hair${uid})`} stroke={INK} strokeWidth={sw} />}
          {hair === "curly" &&
            Array.from({ length: 9 }).map((_, i) => {
              const a = Math.PI * (1.02 + (i / 8) * 0.96);
              return <circle key={i} cx={200 + Math.cos(a) * 145} cy={headY + 5 + Math.sin(a) * 140} r="44" fill={`url(#hair${uid})`} stroke={INK} strokeWidth={sw} />;
            })}
          <ellipse cx="200" cy={headY} rx="152" ry="148" fill={`url(#head${uid})`} stroke={INK} strokeWidth={sw + 2} />
          {/* subtle rim light */}
          <path d={`M88 ${headY + 70} Q120 ${headY + 125} 185 ${headY + 138}`} stroke="white" strokeWidth="5" fill="none" opacity="0.7" strokeLinecap="round" />
          {beard && (
            <path
              d={`M70 ${headY + 20} Q78 ${headY + 170} 200 ${headY + 182} Q322 ${headY + 170} 330 ${headY + 20} Q300 ${headY + 100} 200 ${headY + 104} Q100 ${headY + 100} 70 ${headY + 20} Z`}
              fill={beard}
              stroke={INK}
              strokeWidth={sw}
            />
          )}
          {stubble && <path d={`M80 ${headY + 40} Q90 ${headY + 140} 200 ${headY + 148} Q310 ${headY + 140} 320 ${headY + 40} Q300 ${headY + 100} 200 ${headY + 104} Q100 ${headY + 100} 80 ${headY + 40} Z`} fill="#4a3a36" opacity="0.28" />}
          {hair !== "plague" && <Eyes cx={200 + gaze * 0.6} cy={headY + 15} gap={50} size={17} expr={expr} f={f} seed={seed} lid={lid} />}
          {lashes && hair !== "plague" && [-1, 1].map((s2) => (
            <path key={s2} d={`M${200 + gaze * 0.6 + s2 * 62} ${headY + 2} l${s2 * 12} -10 M${200 + gaze * 0.6 + s2 * 64} ${headY + 10} l${s2 * 14} -4`} stroke={INK} strokeWidth="5" strokeLinecap="round" />
          ))}
          {hair !== "plague" && <Mouth cx={200 + gaze * 0.5} cy={headY + (beard ? 82 : 78)} w={44} expr={expr} talking={talking} f={f} />}
          {mustache && (
            <path d={`M${200 + gaze * 0.5} ${headY + 62} Q${170 + gaze * 0.5} ${headY + 45} ${132 + gaze * 0.5} ${headY + 70} Q${150 + gaze * 0.5} ${headY + 58} ${200 + gaze * 0.5} ${headY + 72} Q${250 + gaze * 0.5} ${headY + 58} ${268 + gaze * 0.5} ${headY + 70} Q${230 + gaze * 0.5} ${headY + 45} ${200 + gaze * 0.5} ${headY + 62} Z`} fill={mustache} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
          )}
          {hair === "long" && (
            <g>
              <path d={`M50 ${headY - 5} Q40 ${headY - 175} 200 ${headY - 172} Q345 ${headY - 172} 352 ${headY - 20} Q300 ${headY - 120} 190 ${headY - 110} Q120 ${headY - 70} 50 ${headY - 5} Z`} fill={`url(#hair${uid})`} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
              <path d={`M110 ${headY - 120} Q170 ${headY - 160} 260 ${headY - 150}`} stroke={hairL} strokeWidth="7" fill="none" strokeLinecap="round" />
            </g>
          )}
          {hair === "ponytail" && (
            <g>
              <path d={`M52 ${headY - 10} Q40 ${headY - 178} 200 ${headY - 175} Q360 ${headY - 178} 348 ${headY - 10} Q330 ${headY - 95} 290 ${headY - 110} Q200 ${headY - 135} 110 ${headY - 105} Q65 ${headY - 85} 52 ${headY - 10} Z`} fill={`url(#hair${uid})`} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
              <path d={`M200 ${headY - 172} L190 ${headY - 125}`} stroke={hairD} strokeWidth="5" />
              <path d={`M100 ${headY - 110} Q150 ${headY - 160} 230 ${headY - 160}`} stroke={hairL} strokeWidth="7" fill="none" strokeLinecap="round" />
              <circle cx="58" cy={headY + 70} r="11" fill="#e6bd55" stroke={INK} strokeWidth="4" />
              <circle cx="342" cy={headY + 70} r="11" fill="#e6bd55" stroke={INK} strokeWidth="4" />
            </g>
          )}
          {hair === "buzz" && (
            <g>
              <path d={`M56 ${headY - 30} Q50 ${headY - 165} 200 ${headY - 162} Q350 ${headY - 165} 344 ${headY - 30} Q330 ${headY - 85} 300 ${headY - 92} Q200 ${headY - 112} 100 ${headY - 92} Q70 ${headY - 85} 56 ${headY - 30} Z`} fill={`url(#hair${uid})`} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
              {Array.from({ length: 14 }).map((_, i) => (
                <circle key={i} cx={95 + (i % 7) * 35 + (i > 6 ? 17 : 0)} cy={headY - 125 + (i > 6 ? 22 : 0) + Math.abs(3 - (i % 7)) * 6} r="3.5" fill={hairD} />
              ))}
            </g>
          )}
          {hair === "plague" && (
            <g>
              {/* leather mask covering face */}
              <ellipse cx="200" cy={headY + 10} rx="150" ry="140" fill="#2b2420" stroke={INK} strokeWidth={sw} />
              <path d={`M90 ${headY - 40} Q200 ${headY - 60} 310 ${headY - 40}`} stroke="#4a3d34" strokeWidth="8" fill="none" />
              {/* glass eyes */}
              {[-1, 1].map((s2) => (
                <g key={s2}>
                  <circle cx={200 + s2 * 58} cy={headY + 5} r="32" fill="#b98b3a" stroke={INK} strokeWidth="9" />
                  <circle cx={200 + s2 * 58} cy={headY + 5} r="20" fill="#f3d27a" opacity={0.75 + 0.25 * Math.sin(f / 7)} />
                  <circle cx={200 + s2 * 58 - 8} cy={headY - 4} r="6" fill="white" />
                </g>
              ))}
              {/* beak */}
              <path d={`M150 ${headY + 45} Q200 ${headY + 30} 250 ${headY + 45} Q320 ${headY + 140} ${355 + Math.sin(f / 10) * 3} ${headY + 255} Q270 ${headY + 170} 200 ${headY + 150} Q160 ${headY + 120} 150 ${headY + 45} Z`} fill="#e9dcc0" stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
              <path d={`M215 ${headY + 70} Q280 ${headY + 140} 330 ${headY + 225}`} stroke="#b9a785" strokeWidth="6" fill="none" />
              <circle cx="222" cy={headY + 82} r="5" fill={INK} />
              {/* wide-brim hat */}
              <ellipse cx="200" cy={headY - 105} rx="215" ry="40" fill="#1c1a1f" stroke={INK} strokeWidth={sw} />
              <path d={`M90 ${headY - 110} L105 ${headY - 255} Q200 ${headY - 275} 295 ${headY - 255} L310 ${headY - 110} Z`} fill="#1c1a1f" stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
              <rect x="95" y={headY - 150} width="210" height="22" fill="#4a3d34" />
              <path d={`M120 ${headY - 230} L130 ${headY - 150}`} stroke="#3a363f" strokeWidth="8" strokeLinecap="round" />
            </g>
          )}
          {hair === "astro" && (
            <g>
              <circle cx="200" cy={headY} r="185" fill="rgba(180,220,255,0.15)" stroke={INK} strokeWidth={sw + 2} />
              <path d={`M75 ${headY - 70} Q110 ${headY - 150} 190 ${headY - 168}`} stroke="white" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.85" />
              <circle cx="300" cy={headY - 110} r="10" fill="white" opacity="0.8" />
              <rect x="70" y={headY + 150} width="260" height="46" rx="20" fill="#d9dee6" stroke={INK} strokeWidth={sw} />
            </g>
          )}
          {hair === "bald" && (
            <g stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round">
              <path d={`M150 ${headY - 135} q30 -25 60 -5`} />
              <path d={`M165 ${headY - 120} q30 -25 60 -5`} />
            </g>
          )}
          {hair === "spiky" && (
            <g>
              {[-2, -1, 0, 1, 2].map((i) => {
                const bx = 200 + i * 55;
                const by = headY - 110 + Math.abs(i) * 22;
                return (
                  <g key={i}>
                    <path d={`M${bx - 55} ${by + 30} Q${bx - 40} ${by - 120} ${bx + 70} ${by - 150 + Math.abs(i) * 25} Q${bx + 10} ${by - 70} ${bx + 55} ${by + 25} Z`} fill={`url(#hair${uid})`} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
                    <path d={`M${bx - 30} ${by - 10} Q${bx - 10} ${by - 80} ${bx + 40} ${by - 110 + Math.abs(i) * 20}`} stroke={hairL} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.9" />
                  </g>
                );
              })}
            </g>
          )}
          {hair === "bowl" && (
            <g>
              <path
                d={`M46 ${headY + 5} Q30 ${headY - 175} 200 ${headY - 172} Q370 ${headY - 175} 354 ${headY + 5} L325 ${headY - 40} L300 ${headY - 10} L275 ${headY - 50} L245 ${headY - 20} L220 ${headY - 55} L190 ${headY - 25} L160 ${headY - 55} L130 ${headY - 20} L105 ${headY - 50} L78 ${headY - 15} Z`}
                fill={`url(#hair${uid})`}
                stroke={INK}
                strokeWidth={sw}
                strokeLinejoin="round"
              />
              <path d={`M90 ${headY - 90} Q140 ${headY - 150} 230 ${headY - 150}`} stroke={hairL} strokeWidth="7" fill="none" strokeLinecap="round" />
              {[0, 1, 2, 3, 4].map((i) => (
                <circle key={i} cx={110 + i * 45} cy={headY - 70 - (i % 2) * 25} r="4" fill={hairD} />
              ))}
            </g>
          )}
          {hair === "curly" && <path d={`M90 ${headY - 95} Q200 ${headY - 160} 310 ${headY - 95}`} stroke={hairL} strokeWidth="8" fill="none" strokeLinecap="round" />}
          {hair === "kerchief" && (
            <g>
              <path d={`M42 ${headY - 5} Q42 ${headY - 185} 200 ${headY - 182} Q358 ${headY - 185} 358 ${headY - 5} Q200 ${headY - 95} 42 ${headY - 5} Z`} fill={`url(#hair${uid})`} stroke={INK} strokeWidth={sw} />
              {[0, 1, 2, 3, 4].map((i) => (
                <circle key={i} cx={95 + i * 52} cy={headY - 115 + (i % 2) * 28} r="9" fill="white" opacity="0.85" />
              ))}
              <path d={`M330 ${headY - 40} l45 25 l-10 -45 Z`} fill={`url(#hair${uid})`} stroke={INK} strokeWidth="7" strokeLinejoin="round" />
            </g>
          )}
          {hair === "hood" && <path d={`M52 ${headY + 20} Q55 ${headY - 175} 200 ${headY - 178} Q345 ${headY - 175} 348 ${headY + 20}`} fill="none" stroke={INK} strokeWidth={sw} />}
          {hair === "helmet" && (
            <g>
              <path d={`M20 ${headY - 35} Q200 ${headY - 5} 380 ${headY - 35} L350 ${headY - 75} Q200 ${headY - 60} 50 ${headY - 75} Z`} fill={`url(#metal${uid})`} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
              <path d={`M65 ${headY - 70} Q65 ${headY - 225} 200 ${headY - 225} Q335 ${headY - 225} 335 ${headY - 70} Z`} fill={`url(#metal${uid})`} stroke={INK} strokeWidth={sw} />
              <path d={`M115 ${headY - 150} Q140 ${headY - 195} 195 ${headY - 205}`} stroke="white" strokeWidth={9} fill="none" strokeLinecap="round" opacity="0.9" />
              <line x1="200" y1={headY - 225} x2="200" y2={headY - 70} stroke={INK} strokeWidth="5" opacity="0.5" />
            </g>
          )}
          {hair === "judge" && (
            <g>
              <path d={`M58 ${headY - 75} L88 ${headY - 290} Q200 ${headY - 320} 312 ${headY - 290} L342 ${headY - 75} Q200 ${headY - 105} 58 ${headY - 75} Z`} fill={`url(#hair${uid})`} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
              <path d={`M110 ${headY - 120} L128 ${headY - 270}`} stroke={hairL} strokeWidth="8" strokeLinecap="round" opacity="0.8" />
              <path d={`M52 ${headY - 80} Q200 ${headY - 118} 348 ${headY - 80}`} stroke={INK} strokeWidth={30} fill="none" />
              <path d={`M52 ${headY - 80} Q200 ${headY - 118} 348 ${headY - 80}`} stroke="#e6bd55" strokeWidth={20} fill="none" />
              <circle cx="200" cy={headY - 312} r="18" fill="#e6bd55" stroke={INK} strokeWidth={6} />
            </g>
          )}
          {hair === "fedora" && (
            <g>
              <path d={`M60 ${headY - 40} Q55 ${headY - 120} 200 ${headY - 125} Q345 ${headY - 120} 340 ${headY - 40} Q200 ${headY - 75} 60 ${headY - 40} Z`} fill="#3a2a22" stroke={INK} strokeWidth={sw} />
              <ellipse cx="200" cy={headY - 95} rx="200" ry="38" fill={`url(#hair${uid})`} stroke={INK} strokeWidth={sw} />
              <path d={`M85 ${headY - 100} L100 ${headY - 225} Q150 ${headY - 250} 200 ${headY - 215} Q250 ${headY - 250} 300 ${headY - 225} L315 ${headY - 100} Z`} fill={`url(#hair${uid})`} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
              <rect x="88" y={headY - 145} width="224" height="30" fill={hairD} stroke={INK} strokeWidth="5" />
              <path d={`M120 ${headY - 200} L130 ${headY - 150}`} stroke={hairL} strokeWidth="8" strokeLinecap="round" opacity="0.8" />
            </g>
          )}
          {hair === "kepi" && (
            <g>
              <path d={`M75 ${headY - 70} L90 ${headY - 230} Q200 ${headY - 250} 310 ${headY - 230} L325 ${headY - 70} Z`} fill={`url(#hair${uid})`} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
              <rect x="78" y={headY - 120} width="244" height="40" fill="#b3121f" stroke={INK} strokeWidth="6" />
              <path d={`M80 ${headY - 72} Q60 ${headY - 20} 200 ${headY - 25} Q340 ${headY - 20} 320 ${headY - 72} Z`} fill="#141418" stroke={INK} strokeWidth={sw} />
              <circle cx="200" cy={headY - 165} r="22" fill="#e6bd55" stroke={INK} strokeWidth="6" />
            </g>
          )}
          {hair === "beret" && (
            <g>
              <path d={`M50 ${headY - 70} Q40 ${headY - 210} 210 ${headY - 205} Q370 ${headY - 200} 350 ${headY - 80} Q200 ${headY - 120} 50 ${headY - 70} Z`} fill={`url(#hair${uid})`} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
              <path d={`M200 ${headY - 205} l8 -30`} stroke={INK} strokeWidth="10" strokeLinecap="round" />
            </g>
          )}
          {hair === "lawyer" && (
            <g>
              <path d={`M62 ${headY - 85} Q200 ${headY - 140} 338 ${headY - 85} L325 ${headY - 200} L75 ${headY - 200} Z`} fill={`url(#hair${uid})`} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
              <path d={`M75 ${headY - 200} Q200 ${headY - 255} 325 ${headY - 200}`} fill={`url(#hair${uid})`} stroke={INK} strokeWidth={sw} />
              <path d={`M100 ${headY - 110} L105 ${headY - 190}`} stroke={hairL} strokeWidth="7" strokeLinecap="round" />
              <circle cx="200" cy={headY - 240} r="16" fill="#b8323a" stroke={INK} strokeWidth={5} />
            </g>
          )}
        </g>
      </g>
    </svg>
  );
};

export type PigProps = {
  expr?: Expr;
  height?: number;
  flip?: boolean;
  seed?: number;
  jacket?: number;
  pants?: number;
  gloves?: number;
  chained?: boolean;
  talking?: boolean;
  walking?: boolean;
};

/** Upright cartoon pig, viewBox 400x600 (feet at 580). */
export const Pig: React.FC<PigProps> = ({ expr = "neutral", height = 600, flip = false, seed = 0, jacket = 0, pants = 0, gloves = 0, chained = false, talking = false, walking = false }) => {
  const f = useCurrentFrame() + seed * 11;
  const step = walking ? Math.sin(f / 3) : 0;
  const bob = walking ? -Math.abs(step) * 18 : Math.sin(f / 9) * 6;
  const sway = Math.sin(f / 17) * 3 + (walking ? step * 4 : 0) + (expr === "worried" ? Math.sin(f * 1.7) * 0.8 : 0);
  const tilt = Math.sin((f - 5) / 17) * -4 + Math.sin(f / 29) * 2.5 + (talking ? Math.sin(f / 6) * 3 : 0);
  const ear = Math.sin(f / 5) * 4 + (walking ? step * 8 : 0);
  const sniff = (f % 70) < 12 ? 1 + Math.abs(Math.sin(f * 1.6)) * 0.08 : 1;
  const breathe = 1 + Math.sin(f / 10) * 0.03;
  const gaze = gazeAt(f, seed + 50, 8);
  const pink = "#ffb3c1";
  const pinkD = "#f48aa0";
  const tail = Math.sin(f / 4) * 10;
  const uid = useId().replace(/:/g, "");
  return (
    <svg width={(height * 400) / 600} height={height} viewBox="0 0 400 600" style={{ overflow: "visible", transform: flip ? "scaleX(-1)" : undefined }}>
      <defs>
        <radialGradient id={`pg${uid}`} cx="40%" cy="35%" r="70%">
          <stop offset="0.5" stopColor="#ffc4cf" />
          <stop offset="0.85" stopColor="#f59fb2" />
          <stop offset="1" stopColor="#d97d93" />
        </radialGradient>
      </defs>
      <ellipse cx="200" cy="585" rx="120" ry="14" fill="rgba(0,0,0,0.28)" />
      {/* tail */}
      <path d={`M300 430 q30 ${-20 + tail} 20 -40 q-15 -15 -20 5 q-5 20 15 15`} stroke={INK} strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d={`M300 430 q30 ${-20 + tail} 20 -40 q-15 -15 -20 5 q-5 20 15 15`} stroke={pinkD} strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* legs */}
      {[150, 250].map((x, i) => (
        <g key={x} transform={`translate(0 ${walking ? Math.min(0, (i ? -step : step) * 22) : 0})`}>
          <rect x={x - 26} y="470" width="52" height="105" rx="20" fill={pants > 0.5 ? "#6b4a2f" : pink} stroke={INK} strokeWidth="9" />
          <rect x={x - 26} y="545" width="52" height="34" rx="10" fill="#5b3b3b" stroke={INK} strokeWidth="8" />
          <line x1={x} y1="552" x2={x} y2="579" stroke={INK} strokeWidth="6" />
          {chained && i === 0 && <ellipse cx={x} cy="540" rx="34" ry="12" fill="none" stroke="#9aa3ad" strokeWidth="9" />}
        </g>
      ))}
      <g transform={`translate(0 ${bob * 0.5}) rotate(${sway} 200 560)`}>
        {/* body */}
        <ellipse cx="200" cy="420" rx={125 * (2 - breathe)} ry={110 * breathe} fill={`url(#pg${uid})`} stroke={INK} strokeWidth="10" />
        <ellipse cx="200" cy="445" rx="70" ry="60" fill="#ffd0da" />
        {/* pants (bottom of body) */}
        {pants > 0 && (
          <g opacity={Math.min(1, pants * 2)} transform={`translate(0 ${(1 - pants) * -200})`}>
            <path d="M80 440 Q200 470 320 440 Q325 500 280 525 L120 525 Q75 500 80 440 Z" fill="#6b4a2f" stroke={INK} strokeWidth="9" />
            <rect x="85" y="432" width="230" height="22" rx="8" fill="#3d2a1a" stroke={INK} strokeWidth="6" />
          </g>
        )}
        {/* jacket */}
        {jacket > 0 && (
          <g opacity={Math.min(1, jacket * 2)} transform={`translate(0 ${(1 - jacket) * -260})`}>
            <path d="M85 360 Q200 300 315 360 L320 440 Q200 460 80 440 Z" fill="#2f4f8f" stroke={INK} strokeWidth="9" />
            <path d="M200 320 L200 450" stroke="#203868" strokeWidth="10" />
            <path d="M140 330 L200 390 L260 330" fill="#f4ecd8" stroke={INK} strokeWidth="7" strokeLinejoin="round" />
            {[0, 1, 2].map((i) => (
              <circle key={i} cx="215" cy={385 + i * 22} r="7" fill="#f2c14e" stroke={INK} strokeWidth="3" />
            ))}
          </g>
        )}
        {/* arms */}
        {[-1, 1].map((s) => (
          <g key={s}>
            <path d={`M${200 + s * 110} 380 Q${200 + s * 165} ${420 + Math.sin(f / 6 + s) * 14} ${200 + s * 150 + (walking ? step * s * 25 : Math.sin(f / 9 + s) * 8)} ${470 - (talking ? Math.abs(Math.sin(f / 5 + s)) * 30 : 0)}`} stroke={INK} strokeWidth="44" fill="none" strokeLinecap="round" />
            <path d={`M${200 + s * 110} 380 Q${200 + s * 165} ${420 + Math.sin(f / 6 + s) * 14} ${200 + s * 150 + (walking ? step * s * 25 : Math.sin(f / 9 + s) * 8)} ${470 - (talking ? Math.abs(Math.sin(f / 5 + s)) * 30 : 0)}`} stroke={jacket > 0.5 ? "#2f4f8f" : pink} strokeWidth="28" fill="none" strokeLinecap="round" />
            <circle cx={200 + s * 150 + (walking ? step * s * 25 : Math.sin(f / 9 + s) * 8)} cy={475 - (talking ? Math.abs(Math.sin(f / 5 + s)) * 30 : 0)} r="22" fill={gloves > 0.5 ? "#f4f0e6" : "#5b3b3b"} stroke={INK} strokeWidth="8" transform={gloves > 0 && gloves <= 0.5 ? `scale(${1 + gloves})` : undefined} />
          </g>
        ))}
        {/* head */}
        <g transform={`translate(0 ${bob * 0.3}) rotate(${tilt} 200 320)`}>
          <g transform={`rotate(${-ear} 110 130)`}>
            <path d="M75 160 L60 40 L150 110 Z" fill={pink} stroke={INK} strokeWidth="10" strokeLinejoin="round" />
            <path d="M82 140 L72 70 L130 112 Z" fill={pinkD} />
          </g>
          <g transform={`rotate(${ear * 0.8} 290 130)`}>
            <path d="M325 160 L340 40 L250 110 Z" fill={pink} stroke={INK} strokeWidth="10" strokeLinejoin="round" />
            <path d="M318 140 L328 70 L270 112 Z" fill={pinkD} />
          </g>
          <ellipse cx="200" cy="200" rx="140" ry="125" fill={`url(#pg${uid})`} stroke={INK} strokeWidth="11" />
          <Eyes cx={200 + gaze} cy={158} gap={58} size={15} expr={expr} f={f} seed={seed + 3} lid="#ffc4cf" />
          {/* snout */}
          <g transform={`translate(${200 + gaze * 0.5} 230) scale(${sniff} ${2 - sniff}) translate(-200 -230)`}>
            <ellipse cx="200" cy="230" rx="55" ry="38" fill={pinkD} stroke={INK} strokeWidth="9" />
            <ellipse cx="182" cy="230" rx="9" ry="15" fill={INK} />
            <ellipse cx="218" cy="230" rx="9" ry="15" fill={INK} />
          </g>
          <Mouth cx={200} cy={283} w={44} expr={expr} talking={talking} f={f} />
        </g>
      </g>
    </svg>
  );
};

/** Rat, viewBox 300x300, sits at y=290 */
export const Rat: React.FC<{ height?: number; flip?: boolean; seed?: number; expr?: Expr; nibble?: boolean; run?: boolean }> = ({
  height = 220,
  flip = false,
  seed = 0,
  expr = "neutral",
  nibble = false,
  run = false,
}) => {
  const f = useCurrentFrame() + seed * 7;
  const hop = run ? Math.abs(Math.sin(f / 2.5)) * -18 : nibble ? Math.sin(f / 2) * 3 : Math.sin(f / 10) * 2;
  const gray = "#a7a3b5";
  return (
    <svg width={height} height={height} viewBox="0 0 300 300" style={{ overflow: "visible", transform: flip ? "scaleX(-1)" : undefined }}>
      <ellipse cx="150" cy="292" rx="100" ry="10" fill="rgba(0,0,0,0.25)" />
      <g transform={`translate(0 ${hop}) rotate(${run ? Math.sin(f / 2.5) * 6 : Math.sin(f / 13) * 4} 150 290) translate(150 290) scale(${run ? 1 + Math.cos(f / 1.25) * 0.06 : 1 + Math.sin(f / 8) * 0.03} ${run ? 1 - Math.cos(f / 1.25) * 0.06 : 1 - Math.sin(f / 8) * 0.03}) translate(-150 -290)`}>
        <path d={`M235 240 Q300 ${250 + Math.sin(f / 5) * 20} 290 170`} stroke={INK} strokeWidth="14" fill="none" strokeLinecap="round" />
        <path d={`M235 240 Q300 ${250 + Math.sin(f / 5) * 20} 290 170`} stroke="#f0a4b4" strokeWidth="6" fill="none" strokeLinecap="round" />
        <ellipse cx="165" cy="225" rx="85" ry="65" fill={gray} stroke={INK} strokeWidth="9" />
        <ellipse cx="160" cy="240" rx="45" ry="35" fill="#d7d3e2" />
        <ellipse cx="120" cy="285" rx="22" ry="10" fill="#f0a4b4" stroke={INK} strokeWidth="6" />
        <ellipse cx="200" cy="285" rx="22" ry="10" fill="#f0a4b4" stroke={INK} strokeWidth="6" />
        <circle cx="80" cy="75" r="40" fill={gray} stroke={INK} strokeWidth="9" />
        <circle cx="80" cy="75" r="22" fill="#f0a4b4" />
        <circle cx="185" cy="70" r="40" fill={gray} stroke={INK} strokeWidth="9" />
        <circle cx="185" cy="70" r="22" fill="#f0a4b4" />
        <ellipse cx="130" cy="140" rx="85" ry="72" fill={gray} stroke={INK} strokeWidth="9" />
        <Eyes cx={130} cy={125} gap={32} size={11} expr={expr} f={f} seed={seed} lid="#a7a3b5" />
        <circle cx="130" cy="172" r="13" fill="#e2607a" stroke={INK} strokeWidth="5" />
        {nibble && <rect x="115" y={186 + Math.abs(Math.sin(f / 1.5)) * 5} width="30" height="16" rx="3" fill="white" stroke={INK} strokeWidth="4" />}
        {[-1, 1].map((s) => (
          <g key={s} stroke={INK} strokeWidth="4" strokeLinecap="round">
            <line x1={130 + s * 20} y1="170" x2={130 + s * 85} y2="158" />
            <line x1={130 + s * 20} y1="176" x2={130 + s * 85} y2="182" />
          </g>
        ))}
      </g>
    </svg>
  );
};

/** Menacing cat, viewBox 360x420 */
export const Cat: React.FC<{ height?: number; flip?: boolean; seed?: number; color?: string; stripes?: string }> = ({
  height = 420,
  flip = false,
  seed = 0,
  color = "#f39c3d",
  stripes = "#c96a1a",
}) => {
  const f = useCurrentFrame() + seed * 9;
  const crouch = Math.sin(f / 6) * 6;
  const lean = Math.sin(f / 14) * 4;
  return (
    <svg width={(height * 360) / 420} height={height} viewBox="0 0 360 420" style={{ overflow: "visible", transform: flip ? "scaleX(-1)" : undefined }}>
      <ellipse cx="180" cy="410" rx="130" ry="12" fill="rgba(0,0,0,0.3)" />
      <path d={`M290 330 Q370 ${280 + Math.sin(f / 4) * 30} 330 ${170 + Math.sin(f / 5) * 20}`} stroke={INK} strokeWidth="34" fill="none" strokeLinecap="round" />
      <path d={`M290 330 Q370 ${280 + Math.sin(f / 4) * 30} 330 ${170 + Math.sin(f / 5) * 20}`} stroke={color} strokeWidth="18" fill="none" strokeLinecap="round" />
      <g transform={`translate(0 ${crouch}) rotate(${lean} 180 405)`}>
        <ellipse cx="200" cy="320" rx="120" ry="85" fill={color} stroke={INK} strokeWidth="10" />
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${190 + i * 40} 240 q10 30 0 60`} stroke={stripes} strokeWidth="12" fill="none" strokeLinecap="round" />
        ))}
        <ellipse cx="120" cy="395" rx="34" ry="18" fill={color} stroke={INK} strokeWidth="8" />
        <ellipse cx="240" cy="395" rx="34" ry="18" fill={color} stroke={INK} strokeWidth="8" />
        <path d="M45 120 L60 10 L130 80 Z" fill={color} stroke={INK} strokeWidth="10" strokeLinejoin="round" />
        <path d="M255 120 L240 10 L170 80 Z" fill={color} stroke={INK} strokeWidth="10" strokeLinejoin="round" />
        <ellipse cx="150" cy="170" rx="125" ry="105" fill={color} stroke={INK} strokeWidth="10" />
        <path d="M150 70 l0 35 M120 75 l5 30 M180 75 l-5 30" stroke={stripes} strokeWidth="10" strokeLinecap="round" />
        {/* glowing angry eyes */}
        {[-1, 1].map((s) => (
          <g key={s}>
            <path d={`M${150 + s * 75} 150 Q${150 + s * 45} 125 ${150 + s * 20} 158 Q${150 + s * 45} 185 ${150 + s * 75} 150 Z`} fill="#d8ff4a" stroke={INK} strokeWidth="6" />
            <ellipse cx={150 + s * 45} cy="157" rx="5" ry="15" fill={INK} />
            <line x1={150 + s * 80} y1={118} x2={150 + s * 22} y2={135} stroke={INK} strokeWidth="10" strokeLinecap="round" />
          </g>
        ))}
        <path d="M140 195 L160 195 L150 207 Z" fill="#e2607a" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M110 225 Q130 240 150 222 Q170 240 190 225" stroke={INK} strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M122 230 l6 18 l6 -16 M166 230 l6 18 l6 -16" fill="white" stroke={INK} strokeWidth="4" />
        {[-1, 1].map((s) => (
          <g key={s} stroke={INK} strokeWidth="5" strokeLinecap="round">
            <line x1={150 + s * 40} y1="205" x2={150 + s * 125} y2="190" />
            <line x1={150 + s * 40} y1="215" x2={150 + s * 125} y2="225" />
          </g>
        ))}
      </g>
    </svg>
  );
};

/** Baby in a cradle (no harm shown) viewBox 300x220 */
export const Cradle: React.FC<{ height?: number; cry?: boolean }> = ({ height = 220, cry = false }) => {
  const f = useCurrentFrame();
  const rock = Math.sin(f / 10) * 4;
  return (
    <svg width={(height * 300) / 220} height={height} viewBox="0 0 300 220" style={{ overflow: "visible" }}>
      <g transform={`rotate(${rock} 150 200)`}>
        <path d="M30 200 Q150 240 270 200" stroke={INK} strokeWidth="10" fill="none" />
        <path d="M40 90 L260 90 L240 195 L60 195 Z" fill="#b5793f" stroke={INK} strokeWidth="9" strokeLinejoin="round" />
        <path d="M40 90 Q40 20 110 30 L110 90 Z" fill="#a0652f" stroke={INK} strokeWidth="9" />
        <circle cx="160" cy="80" r="42" fill="#fff3df" stroke={INK} strokeWidth="8" />
        <path d="M120 70 Q160 20 200 70" fill="#f7d7e0" stroke={INK} strokeWidth="7" />
        {cry ? (
          <>
            <path d="M140 85 l10 5 M170 90 l10 -5" stroke={INK} strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="160" cy="104" rx="10" ry="8" fill="#5a1a22" />
            <path d={`M135 92 q-5 ${15 + (f % 10)} 0 25`} stroke="#6cc3ff" strokeWidth="6" fill="none" />
          </>
        ) : (
          <>
            <path d="M140 85 q7 6 14 0 M168 85 q7 6 14 0" stroke={INK} strokeWidth="5" fill="none" />
          </>
        )}
        <rect x="80" y="110" width="160" height="60" rx="20" fill="#9fd0e6" stroke={INK} strokeWidth="7" />
      </g>
    </svg>
  );
};
