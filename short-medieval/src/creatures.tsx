/**
 * Personajes detallados con animación fluida:
 *  - Mantis: camarón mantis (side view) con mazas que golpean con anticipación → golpe → rebote → recogida,
 *    ojos en pedúnculos que miran por separado, antenas con inercia, pleópodos en ola, respiración.
 *  - Tardigrade: oso de agua con ciclo de caminar por ondas, transformación a "bolita" (tun), expresiones, casco espacial.
 * Ambos aceptan `time` para poder deformar el tiempo (cámara lenta).
 */
import React, { useId } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { INK } from "./Characters";

export type CExpr = "neutral" | "happy" | "angry" | "surprised" | "worried" | "smug" | "sleep" | "awe";
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** cartoon eye with blink, look direction, expression and glint */
export const BigEye: React.FC<{ cx: number; cy: number; rx: number; ry: number; t: number; seed?: number; expr?: CExpr; lookX?: number; lookY?: number; iris?: string; band?: boolean; brow?: number }> = ({
  cx,
  cy,
  rx,
  ry,
  t,
  seed = 0,
  expr = "neutral",
  lookX = 0,
  lookY = 0,
  iris = "#2e7d5b",
  band = false,
  brow = 1,
}) => {
  const ph = (t + seed * 37) % 110;
  const blink = expr === "sleep" ? 1 : ph < 6 ? Math.sin((ph / 6) * Math.PI) : 0;
  const big = expr === "surprised" || expr === "awe" ? 1.22 : 1;
  const open = Math.max(0.06, 1 - blink) * (expr === "smug" ? 0.62 : expr === "angry" ? 0.78 : 1);
  const prx = rx * (expr === "surprised" ? 0.32 : 0.46);
  const px = cx + lookX * rx * 0.42;
  const py = cy + lookY * ry * 0.35 + (expr === "smug" ? ry * 0.15 : 0);
  const id = useId().replace(/:/g, "");
  if (expr === "happy" && blink < 0.5) {
    return <path d={`M${cx - rx} ${cy + ry * 0.15} Q${cx} ${cy - ry * 1.1} ${cx + rx} ${cy + ry * 0.15}`} stroke={INK} strokeWidth={Math.max(6, rx * 0.22)} fill="none" strokeLinecap="round" />;
  }
  return (
    <g transform={`translate(${cx} ${cy}) scale(${big}) translate(${-cx} ${-cy})`}>
      <defs>
        <clipPath id={`ec${id}`}>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry * open} />
        </clipPath>
        <radialGradient id={`ew${id}`} cx="40%" cy="35%" r="70%">
          <stop offset="0.6" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d6dde8" />
        </radialGradient>
      </defs>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry * open} fill={`url(#ew${id})`} />
      <g clipPath={`url(#ec${id})`}>
        {band && <rect x={cx - rx} y={cy - ry * 0.16} width={rx * 2} height={ry * 0.32} fill="#7fd6c4" opacity="0.55" />}
        <circle cx={px} cy={py} r={prx} fill={iris} />
        <circle cx={px} cy={py} r={prx * 0.55} fill={INK} />
        <circle cx={px - prx * 0.35} cy={py - prx * 0.4} r={prx * 0.32} fill="white" />
        <circle cx={px + prx * 0.35} cy={py + prx * 0.3} r={prx * 0.12} fill="white" opacity="0.8" />
      </g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry * open} fill="none" stroke={INK} strokeWidth={Math.max(5, rx * 0.14)} />
      {brow > 0 && expr === "angry" && <path d={`M${cx - rx * 1.05} ${cy - ry * 1.05} L${cx + rx * 0.9} ${cy - ry * 0.55}`} stroke={INK} strokeWidth={rx * 0.28} strokeLinecap="round" />}
      {brow > 0 && expr === "worried" && <path d={`M${cx - rx * 0.9} ${cy - ry * 0.75} Q${cx} ${cy - ry * 1.35} ${cx + rx * 0.95} ${cy - ry * 1.15}`} stroke={INK} strokeWidth={rx * 0.22} strokeLinecap="round" fill="none" />}
      {brow > 0 && (expr === "surprised" || expr === "awe") && <path d={`M${cx - rx * 0.8} ${cy - ry * 1.35} Q${cx} ${cy - ry * 1.75} ${cx + rx * 0.8} ${cy - ry * 1.35}`} stroke={INK} strokeWidth={rx * 0.2} strokeLinecap="round" fill="none" />}
    </g>
  );
};

/* =====================================================================
   MANTIS SHRIMP
   ===================================================================== */

/** strike curve: -0.35 windup → 1 full extension → back to 0 (folded) */
export const strikeExt = (t: number, strikes: number[]) => {
  let e = 0;
  for (const s of strikes) {
    const d = t - s;
    if (d < -9 || d > 22) continue;
    if (d < -2) e = Math.min(e, interpolate(d, [-9, -2], [0, -0.38], { ...clamp, easing: Easing.out(Easing.quad) }));
    else if (d < 0) e = interpolate(d, [-2, 0], [-0.38, 1.12], clamp);
    else if (d < 3) e = interpolate(d, [0, 3], [1.12, 0.96], clamp);
    else if (d < 7) e = 0.96 + Math.sin(d * 1.6) * 0.04 * (7 - d);
    else e = interpolate(d, [7, 22], [0.96, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  }
  return e;
};

export const Mantis: React.FC<{
  height?: number;
  time?: number;
  strikes?: number[];
  expr?: CExpr;
  lookX?: number;
  lookY?: number;
  eyeSplit?: boolean;
  flip?: boolean;
  seed?: number;
  glowEyes?: number;
  swim?: boolean;
}> = ({ height = 420, time, strikes = [], expr = "neutral", lookX = 0.4, lookY = 0, eyeSplit = false, flip = false, seed = 0, glowEyes = 0, swim = false }) => {
  const fr = useCurrentFrame();
  const t = (time ?? fr) + seed * 13;
  const id = useId().replace(/:/g, "");
  const ext = strikeExt(time ?? fr, strikes);
  const recoil = Math.max(0, ext) * -14 + Math.min(0, ext) * -20;
  const breathe = 1 + Math.sin(t / 14) * 0.015;
  const bob = Math.sin(t / 11) * (swim ? 12 : 4);
  const W0 = 780;
  const H0 = 440;
  const segs = Array.from({ length: 6 }).map((_, i) => {
    const x = 150 + i * 50;
    const wave = Math.sin(t / 9 - i * 0.55) * (swim ? 9 : 3.5);
    return { x, y: 262 - i * 6 + wave, rx: 44 + i * 2, ry: 50 + i * 3 };
  });
  // raptorial appendage (smasher) angles
  const a1 = lerp(122, 8, Math.max(-0.4, ext)) + (ext < 0 ? -ext * 30 : 0); // shoulder (deg, 90 = straight down)
  const a2 = lerp(-158, -8, Math.max(0, ext)) + (ext < 0 ? ext * 10 : 0); // elbow relative
  const sh = { x: 560, y: 300 };
  const L1 = 105;
  const L2 = 118;
  const r1 = (a1 * Math.PI) / 180;
  const el = { x: sh.x + Math.cos(r1) * L1 * 1, y: sh.y + Math.sin(r1) * L1 };
  const r2 = r1 + (a2 * Math.PI) / 180;
  const club = { x: el.x + Math.cos(r2) * L2, y: el.y + Math.sin(r2) * L2 };
  const eyeA = eyeSplit ? Math.sin(t / 7) * 0.9 : lookX;
  const eyeB = eyeSplit ? Math.cos(t / 9) * 0.9 : lookX;
  const eyeAy = eyeSplit ? Math.cos(t / 6) * 0.7 : lookY;
  const eyeBy = eyeSplit ? Math.sin(t / 8) * 0.7 : lookY;
  const stalkSway = Math.sin(t / 10) * 4 + (expr === "surprised" || expr === "awe" ? -6 : 0);
  const legsC = "#e8572f";
  return (
    <svg width={(height * W0) / H0} height={height} viewBox={`0 0 ${W0} ${H0}`} style={{ overflow: "visible", transform: flip ? "scaleX(-1)" : undefined }}>
      <defs>
        <linearGradient id={`mb${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#7be07a" />
          <stop offset="0.55" stopColor="#2fae6a" />
          <stop offset="1" stopColor="#17775a" />
        </linearGradient>
        <linearGradient id={`mt${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#1e88e5" />
          <stop offset="1" stopColor="#36c2c9" />
        </linearGradient>
        <linearGradient id={`mc${id}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#ff8fb3" />
          <stop offset="0.5" stopColor="#ef3f6f" />
          <stop offset="1" stopColor="#a31545" />
        </linearGradient>
        <radialGradient id={`me${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff6a0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ff4fd8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="380" cy="425" rx={300 - bob} ry="16" fill="rgba(0,0,0,0.25)" />
      <g transform={`translate(${recoil} ${bob}) translate(380 400) scale(${breathe} ${2 - breathe}) translate(-380 -400)`}>
        {/* far-side walking legs */}
        {[0, 1, 2].map((i) => (
          <path key={`fl${i}`} d={`M${470 + i * 28} 300 q${-6 + Math.sin(t / 5 + i) * 6} 50 ${-18} 100`} stroke="#b33e22" strokeWidth="9" fill="none" strokeLinecap="round" />
        ))}
        {/* tail fan */}
        <g transform={`rotate(${Math.sin(t / 9) * 5 + (swim ? Math.sin(t / 3) * 10 : 0)} 140 270)`}>
          {[-1, 0, 1].map((k) => (
            <path key={k} d={`M140 ${266 + k * 6} Q${70} ${250 + k * 50} ${30} ${262 + k * 62} Q${80} ${285 + k * 30} 140 ${276 + k * 6} Z`} fill={`url(#mt${id})`} stroke={INK} strokeWidth="7" strokeLinejoin="round" />
          ))}
          {[0, 1, 2].map((k) => (
            <circle key={k} cx={58 + k * 4} cy={222 + k * 58} r="9" fill="#ffd23f" stroke={INK} strokeWidth="4" />
          ))}
        </g>
        {/* swimmerets (metachronal wave) */}
        {segs.slice(0, 5).map((s, i) => {
          const a = Math.sin(t / (swim ? 2 : 3.2) - i * 0.9) * 22;
          return (
            <g key={`p${i}`} transform={`rotate(${a} ${s.x} ${s.y + s.ry - 6})`}>
              <path d={`M${s.x} ${s.y + s.ry - 8} q-8 32 -2 52`} stroke="#ff9a62" strokeWidth="10" fill="none" strokeLinecap="round" />
              <path d={`M${s.x - 4} ${s.y + s.ry + 20} l-14 10 M${s.x - 3} ${s.y + s.ry + 32} l-14 10`} stroke="#ff9a62" strokeWidth="5" strokeLinecap="round" />
            </g>
          );
        })}
        {/* abdomen segments (back to front) */}
        {segs.map((s, i) => (
          <g key={`s${i}`}>
            <ellipse cx={s.x} cy={s.y} rx={s.rx} ry={s.ry} fill={`url(#mb${id})`} stroke={INK} strokeWidth="8" />
            <path d={`M${s.x - s.rx * 0.55} ${s.y - s.ry * 0.72} Q${s.x} ${s.y - s.ry * 1.02} ${s.x + s.rx * 0.55} ${s.y - s.ry * 0.72}`} stroke="#c9ff9a" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.85" />
            <path d={`M${s.x - s.rx * 0.8} ${s.y + s.ry * 0.45} Q${s.x} ${s.y + s.ry * 0.8} ${s.x + s.rx * 0.8} ${s.y + s.ry * 0.45}`} stroke="#0f5a45" strokeWidth="5" fill="none" opacity="0.6" />
            <circle cx={s.x - 8} cy={s.y - 4} r="6" fill="#0f5a45" opacity="0.55" />
            <circle cx={s.x + 14} cy={s.y + 12} r="4" fill="#ffe27a" opacity="0.8" />
          </g>
        ))}
        {/* carapace */}
        <path d="M410 190 Q480 150 570 175 Q620 195 615 250 Q610 310 540 322 Q450 330 410 300 Q385 250 410 190 Z" fill={`url(#mb${id})`} stroke={INK} strokeWidth="9" strokeLinejoin="round" />
        <path d="M430 195 Q500 168 575 190" stroke="#d7ffb0" strokeWidth="9" fill="none" strokeLinecap="round" />
        {/* leopard spots */}
        {[
          [450, 230, 11],
          [490, 215, 8],
          [520, 250, 12],
          [470, 275, 9],
          [560, 225, 7],
          [545, 285, 8],
        ].map(([x, y, r], i) => (
          <g key={`sp${i}`}>
            <circle cx={x} cy={y} r={r} fill="#0f5a45" opacity="0.75" />
            <circle cx={x} cy={y} r={r * 0.45} fill="#ffe27a" />
          </g>
        ))}
        {/* walking legs (near side) */}
        {[0, 1, 2].map((i) => {
          const k = Math.sin(t / 5 + i * 1.3) * 8;
          return <path key={`nl${i}`} d={`M${455 + i * 32} 312 q${k} 44 ${-16 + k} 96`} stroke={INK} strokeWidth="14" fill="none" strokeLinecap="round" />;
        })}
        {[0, 1, 2].map((i) => {
          const k = Math.sin(t / 5 + i * 1.3) * 8;
          return <path key={`nlc${i}`} d={`M${455 + i * 32} 312 q${k} 44 ${-16 + k} 96`} stroke={legsC} strokeWidth="7" fill="none" strokeLinecap="round" />;
        })}
        {/* antennae: long whips with follow-through + paddle scales */}
        {[0, 1, 2].map((i) => {
          const lag = Math.sin((t - 6 - i * 4) / 8 + i) * 30;
          return <path key={`an${i}`} d={`M612 ${190 + i * 6} Q${690 + i * 15} ${110 - i * 20 + lag * 0.4} ${770 + i * 10} ${80 + i * 50 + lag}`} stroke={INK} strokeWidth={5 - i} fill="none" strokeLinecap="round" />;
        })}
        {[-1, 1].map((k) => (
          <g key={`sc${k}`} transform={`rotate(${Math.sin(t / 3 + k) * 14 - 25 + k * 12} 612 214)`}>
            <path d="M612 214 Q690 180 735 200 Q700 232 612 222 Z" fill="#ff7a2f" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
            <path d="M640 210 L720 200" stroke="#ffd23f" strokeWidth="4" opacity="0.8" />
          </g>
        ))}
        {/* eye stalks + eyes */}
        {[
          { bx: 585, by: 182, ex: 572, ey: 92, lx: eyeA, ly: eyeAy, s: 0 },
          { bx: 602, by: 186, ex: 640, ey: 104, lx: eyeB, ly: eyeBy, s: 1 },
        ].map((e) => {
          const ex = e.ex + stalkSway * (e.s ? 1.2 : 0.8);
          const ey = e.ey + Math.cos(t / 12 + e.s) * 3;
          return (
            <g key={`e${e.s}`}>
              <path d={`M${e.bx} ${e.by} Q${(e.bx + ex) / 2 + 6} ${(e.by + ey) / 2} ${ex} ${ey + 20}`} stroke={INK} strokeWidth="20" fill="none" strokeLinecap="round" />
              <path d={`M${e.bx} ${e.by} Q${(e.bx + ex) / 2 + 6} ${(e.by + ey) / 2} ${ex} ${ey + 20}`} stroke="#3cc07a" strokeWidth="10" fill="none" strokeLinecap="round" />
              {glowEyes > 0 && <circle cx={ex} cy={ey} r={70 + Math.sin(t / 3) * 6} fill={`url(#me${id})`} opacity={glowEyes} />}
              <BigEye cx={ex} cy={ey} rx={36} ry={42} t={t} seed={e.s * 3 + seed} expr={expr} lookX={e.lx} lookY={e.ly} band brow={1} iris="#6b3fa0" />
            </g>
          );
        })}
        {/* mouth */}
        {expr === "surprised" || expr === "awe" ? (
          <ellipse cx="596" cy="262" rx="13" ry="17" fill="#5a1f2e" stroke={INK} strokeWidth="5" />
        ) : (
          <path d={expr === "happy" || expr === "smug" ? "M582 258 q16 14 30 -2" : expr === "worried" ? "M582 266 q15 -10 30 2" : "M584 262 l26 0"} stroke={INK} strokeWidth="6" fill="none" strokeLinecap="round" />
        )}
        {/* raptorial smasher (near side) */}
        <g>
          <path d={`M${sh.x} ${sh.y} L${el.x} ${el.y}`} stroke={INK} strokeWidth="40" strokeLinecap="round" />
          <path d={`M${sh.x} ${sh.y} L${el.x} ${el.y}`} stroke={`url(#mc${id})`} strokeWidth="26" strokeLinecap="round" />
          <path d={`M${el.x} ${el.y} L${club.x} ${club.y}`} stroke={INK} strokeWidth="46" strokeLinecap="round" />
          <path d={`M${el.x} ${el.y} L${club.x} ${club.y}`} stroke={`url(#mc${id})`} strokeWidth="32" strokeLinecap="round" />
          <path d={`M${el.x} ${el.y} L${lerp(el.x, club.x, 0.7)} ${lerp(el.y, club.y, 0.7)}`} stroke="#ffc2d6" strokeWidth="8" strokeLinecap="round" opacity="0.8" />
          {/* the club (dactyl heel) */}
          <circle cx={club.x} cy={club.y} r="34" fill={`url(#mc${id})`} stroke={INK} strokeWidth="9" />
          <circle cx={club.x - 10} cy={club.y - 12} r="10" fill="white" opacity="0.7" />
          {ext > 0.9 && (
            <g stroke="white" strokeWidth="6" strokeLinecap="round" opacity={interpolate(ext, [0.9, 1.1], [0, 1], clamp)}>
              {[-1, 0, 1].map((k) => (
                <line key={k} x1={club.x - 120} y1={club.y + k * 22} x2={club.x - 50} y2={club.y + k * 22} />
              ))}
            </g>
          )}
        </g>
      </g>
    </svg>
  );
};
/** world position of the club tip for a Mantis placed with At(x, y) feet-anchored */
export const mantisClub = (x: number, y: number, h: number, ext = 1) => {
  const k = h / 440;
  const w = (h * 780) / 440;
  const a1 = (lerp(122, 8, ext) * Math.PI) / 180;
  const a2 = a1 + (lerp(-158, -8, ext) * Math.PI) / 180;
  const ex = 560 + Math.cos(a1) * 105;
  const ey = 300 + Math.sin(a1) * 105;
  return { x: x - w / 2 + (ex + Math.cos(a2) * 118) * k, y: y - h + (ey + Math.sin(a2) * 118) * k };
};
export const mantisEyes = (x: number, y: number, h: number) => {
  const k = h / 440;
  const w = (h * 780) / 440;
  return { x: x - w / 2 + 606 * k, y: y - h + 100 * k };
};

/* =====================================================================
   TARDIGRADE (water bear)
   ===================================================================== */
export const Tardigrade: React.FC<{
  height?: number;
  time?: number;
  tun?: number;
  expr?: CExpr;
  walk?: boolean;
  helmet?: boolean;
  flip?: boolean;
  seed?: number;
  lookX?: number;
  cold?: number;
  hot?: number;
  wave?: boolean;
  baby?: boolean;
}> = ({ height = 360, time, tun = 0, expr = "happy", walk = false, helmet = false, flip = false, seed = 0, lookX = 0.3, cold = 0, hot = 0, wave = false, baby = false }) => {
  const fr = useCurrentFrame();
  const t = (time ?? fr) + seed * 17;
  const id = useId().replace(/:/g, "");
  const W0 = 640;
  const H0 = 380;
  const tu = Easing.inOut(Easing.cubic)(Math.max(0, Math.min(1, tun)));
  const bob = walk ? -Math.abs(Math.sin(t / 4)) * 8 : Math.sin(t / 12) * 3;
  const breathe = 1 + Math.sin(t / 13) * 0.025 * (1 - tu);
  const shiver = cold > 0.3 ? Math.sin(t * 2.3) * 3 * cold : 0;
  const body = baby ? "#ffe1cf" : "#f6c9a8";
  const bodyD = "#d99877";
  const tint = cold > 0 ? `rgba(120,190,255,${cold * 0.45})` : hot > 0 ? `rgba(255,90,60,${hot * 0.4})` : "none";
  const bx0 = 110;
  const sx = lerp(1, 0.58, tu);
  const sy = lerp(1, 0.92, tu);
  const legs = [175, 275, 375, 465];
  const legLen = 62 * (1 - tu);
  return (
    <svg width={(height * W0) / H0} height={height} viewBox={`0 0 ${W0} ${H0}`} style={{ overflow: "visible", transform: flip ? "scaleX(-1)" : undefined }}>
      <defs>
        <radialGradient id={`tb${id}`} cx="45%" cy="30%" r="75%">
          <stop offset="0" stopColor="#fff1e4" />
          <stop offset="0.55" stopColor={body} />
          <stop offset="1" stopColor={bodyD} />
        </radialGradient>
        <radialGradient id={`th${id}`} cx="35%" cy="25%" r="80%">
          <stop offset="0" stopColor="white" stopOpacity="0.55" />
          <stop offset="0.6" stopColor="#bfe9ff" stopOpacity="0.15" />
          <stop offset="1" stopColor="#7fc8ff" stopOpacity="0.35" />
        </radialGradient>
      </defs>
      <ellipse cx="320" cy="368" rx={lerp(240, 140, tu)} ry="14" fill="rgba(0,0,0,0.25)" />
      <g transform={`translate(${shiver} ${bob}) translate(320 350) scale(${sx * breathe} ${sy * (2 - breathe)}) translate(-320 -350)`}>
        {/* far legs */}
        {legs.map((x, i) => {
          const ph = t / 4 + i * 1.7 + Math.PI;
          const sw = walk ? Math.sin(ph) * 16 : Math.sin(t / 15 + i) * 4;
          const lift = walk ? Math.max(0, Math.cos(ph)) * 12 : 0;
          return (
            <g key={`fl${i}`} transform={`rotate(${sw} ${x + 18} 275)`} opacity={1 - tu}>
              <path d={`M${x + 18} 270 L${x + 22} ${270 + legLen - lift}`} stroke={INK} strokeWidth="44" strokeLinecap="round" />
              <path d={`M${x + 18} 270 L${x + 22} ${270 + legLen - lift}`} stroke={bodyD} strokeWidth="30" strokeLinecap="round" />
            </g>
          );
        })}
        {/* body */}
        <path
          d={`M${bx0} 250 Q${bx0 - 30} 150 ${bx0 + 60} 118 Q180 92 230 112 Q280 88 330 108 Q380 86 430 110 Q500 100 535 150 Q575 200 548 268 Q520 320 430 318 Q320 330 210 318 Q${bx0 + 10} 320 ${bx0} 250 Z`}
          fill={`url(#tb${id})`}
          stroke={INK}
          strokeWidth="10"
          strokeLinejoin="round"
        />
        {/* segment folds */}
        {[205, 300, 395].map((x, i) => (
          <path key={`f${i}`} d={`M${x + 8} 106 Q${x - 18} 210 ${x + 6} 318`} stroke={bodyD} strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.8" />
        ))}
        {tu > 0.2 &&
          Array.from({ length: 9 }).map((_, i) => (
            <path key={`w${i}`} d={`M${150 + i * 45} ${130 + (i % 2) * 12} q-14 90 4 175`} stroke={bodyD} strokeWidth="5" fill="none" opacity={tu * 0.9} />
          ))}
        {/* skin bumps */}
        {Array.from({ length: 26 }).map((_, i) => (
          <circle key={`b${i}`} cx={150 + ((i * 53) % 370)} cy={140 + ((i * 37) % 150)} r={3 + (i % 3)} fill="white" opacity="0.35" />
        ))}
        <path d="M160 140 Q260 105 360 120" stroke="white" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.55" />
        {/* near legs with claws */}
        {legs.map((x, i) => {
          const ph = t / 4 + i * 1.7;
          const sw = walk ? Math.sin(ph) * 18 : wave && i === 3 ? -40 + Math.sin(t / 3) * 25 : Math.sin(t / 13 + i) * 5;
          const lift = walk ? Math.max(0, Math.cos(ph)) * 14 : 0;
          const end = 290 + legLen - lift;
          return (
            <g key={`nl${i}`} transform={`rotate(${sw} ${x} 290)`} opacity={1 - tu * 0.95}>
              <path d={`M${x} 280 L${x - 2} ${end}`} stroke={INK} strokeWidth="50" strokeLinecap="round" />
              <path d={`M${x} 280 L${x - 2} ${end}`} stroke={body} strokeWidth="36" strokeLinecap="round" />
              <path d={`M${x - 8} 286 L${x - 10} ${end - 6}`} stroke="white" strokeWidth="6" strokeLinecap="round" opacity="0.5" />
              {[-12, -4, 4, 12].map((c) => (
                <path key={c} d={`M${x + c - 2} ${end + 18} q${c * 0.4} 12 ${c * 0.9 + 4} 14`} stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />
              ))}
            </g>
          );
        })}
        {/* face */}
        <g transform={`translate(${tu * -40} 0)`}>
          {/* snout tube */}
          <g transform={`translate(${expr === "surprised" || expr === "awe" ? 6 : 0} 0)`}>
            <path d="M548 214 Q585 210 590 232 Q585 254 548 250 Z" fill={`url(#tb${id})`} stroke={INK} strokeWidth="8" strokeLinejoin="round" />
            <ellipse cx="588" cy="232" rx={expr === "surprised" || expr === "awe" ? 10 : 6} ry={expr === "surprised" || expr === "awe" ? 15 : 9} fill="#7a3040" stroke={INK} strokeWidth="5" />
          </g>
          <ellipse cx="500" cy="232" rx="20" ry="10" fill="#ff8fa3" opacity={0.55 + hot * 0.3} />
          {tu < 0.7 ? (
            <>
              <BigEye cx={492} cy={186} rx={20} ry={23} t={t} seed={seed} expr={expr} lookX={lookX} iris="#3a2a5a" />
              <BigEye cx={540} cy={180} rx={16} ry={19} t={t} seed={seed + 1} expr={expr} lookX={lookX} iris="#3a2a5a" />
            </>
          ) : (
            <path d="M478 190 q14 10 28 0 M526 184 q12 8 24 0" stroke={INK} strokeWidth="6" fill="none" strokeLinecap="round" />
          )}
        </g>
        {tint !== "none" && <ellipse cx="335" cy="215" rx="240" ry="120" fill={tint} />}
        {hot > 0.3 &&
          [0, 1, 2].map((i) => {
            const y = 120 + ((t * 3 + i * 40) % 120);
            return <path key={`sw${i}`} d={`M${560 + i * 18} ${y} q8 14 0 22 q-8 -8 0 -22`} fill="#7fd6ff" stroke={INK} strokeWidth="3" />;
          })}
      </g>
      {helmet && (
        <g>
          <circle cx="330" cy="215" r="250" fill={`url(#th${id})`} stroke={INK} strokeWidth="10" />
          <path d="M160 120 Q230 40 330 30" stroke="white" strokeWidth="16" fill="none" strokeLinecap="round" opacity="0.8" />
          <rect x="190" y="440" width="280" height="40" rx="18" fill="#d9dee6" stroke={INK} strokeWidth="8" transform="translate(0 -20)" />
        </g>
      )}
    </svg>
  );
};
export const tardiFace = (x: number, y: number, h: number) => {
  const k = h / 380;
  const w = (h * 640) / 380;
  return { x: x - w / 2 + 515 * k, y: y - h + 200 * k };
};

/* =====================================================================
   small props
   ===================================================================== */
export const Snail: React.FC<{ size?: number; crack?: number; t?: number }> = ({ size = 260, crack = 0, t = 0 }) => {
  const pieces = crack > 0.5;
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 300 240" style={{ overflow: "visible" }}>
      <path d="M20 215 Q120 190 260 210 Q290 220 280 232 L30 232 Z" fill="#cfa77a" stroke={INK} strokeWidth="7" />
      <circle cx="262" cy="170" r="9" fill={INK} />
      {!pieces ? (
        <g>
          <circle cx="140" cy="120" r="95" fill="#f0b45a" stroke={INK} strokeWidth="9" />
          <path d="M140 120 m0 -70 a70 70 0 1 1 -1 0 m1 20 a50 50 0 1 0 1 0 m-1 20 a30 30 0 1 1 -1 0" stroke="#b5702a" strokeWidth="9" fill="none" />
          {crack > 0 && (
            <path d={`M140 30 l-12 40 l20 20 l-25 35 l18 30`} stroke={INK} strokeWidth="6" fill="none" strokeDasharray="300" strokeDashoffset={300 * (1 - crack * 2)} />
          )}
        </g>
      ) : (
        Array.from({ length: 7 }).map((_, i) => {
          const a = (i / 7) * Math.PI * 2;
          const d = (crack - 0.5) * 2 * 260;
          return <polygon key={i} points="0,-34 30,-10 18,28 -22,24 -30,-8" fill="#f0b45a" stroke={INK} strokeWidth="7" transform={`translate(${140 + Math.cos(a) * d} ${120 + Math.sin(a) * d - d * 0.4 + d * d * 0.004}) rotate(${a * 57 + t * 12})`} />;
        })
      )}
    </svg>
  );
};

export const Bullet: React.FC<{ w?: number }> = ({ w = 300 }) => (
  <svg width={w} height={w * 0.3} viewBox="0 0 300 90" style={{ overflow: "visible" }}>
    {[0, 1, 2, 3].map((i) => (
      <line key={i} x1={-260 + i * 30} y1={20 + i * 17} x2={-30} y2={20 + i * 17} stroke="white" strokeWidth="8" strokeLinecap="round" opacity={0.7 - i * 0.1} />
    ))}
    <path d="M0 15 L170 15 Q290 45 170 75 L0 75 Z" fill="#e0a83a" stroke={INK} strokeWidth="8" strokeLinejoin="round" />
    <rect x="0" y="15" width="90" height="60" fill="#c9862a" stroke={INK} strokeWidth="8" />
    <path d="M100 25 L200 25" stroke="white" strokeWidth="7" strokeLinecap="round" opacity="0.7" />
  </svg>
);
