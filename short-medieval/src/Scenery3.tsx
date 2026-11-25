import React from "react";
import { AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame } from "remotion";
import { Eyes, INK, Mouth } from "./Characters";
import type { Expr, Pose } from "./Characters";
import { H, W } from "./Scenery";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

/* =====================================================================
   SHARED OVERLAYS
   ===================================================================== */

/** Big hook title at the top of the first seconds (stops the scroll) */
export const HookTitle: React.FC<{ lines: string[]; hi?: number; at?: number; until?: number; color?: string; top?: number }> = ({ lines, hi = 1, at = 0, until = 99999, color = "#ffd23f", top = 170 }) => {
  const f = useCurrentFrame();
  if (f < at || f > until + 8) return null;
  const out = interpolate(f, [until, until + 8], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, zIndex: 9800, opacity: out }}>
      {lines.map((l, i) => {
        const s = spring({ frame: f - at - i * 5, fps: 30, config: { damping: 9, stiffness: 170 } });
        const wob = Math.sin((f + i * 9) / 7) * 1.5;
        return (
          <div
            key={i}
            style={{
              transform: `scale(${s}) rotate(${(i % 2 ? 2 : -2) + wob}deg)`,
              fontFamily: "Montserrat",
              fontWeight: 800,
              fontSize: i === hi ? Math.min(112, 1350 / l.length) : Math.min(78, 1150 / l.length),
              lineHeight: 1.05,
              color: i === hi ? INK : "white",
              background: i === hi ? color : "transparent",
              padding: i === hi ? "6px 30px 12px" : 0,
              borderRadius: 18,
              border: i === hi ? `9px solid ${INK}` : undefined,
              WebkitTextStroke: i === hi ? undefined : `14px ${INK}`,
              paintOrder: "stroke fill",
              boxShadow: i === hi ? "0 12px 0 rgba(0,0,0,0.35)" : undefined,
              textShadow: i === hi ? undefined : "4px 7px 0 rgba(0,0,0,0.5)",
              whiteSpace: "nowrap",
            }}
          >
            {l}
          </div>
        );
      })}
    </div>
  );
};

/** Pop-in label card */
export const Tag: React.FC<{ text: string; x: number; y: number; at: number; color?: string; size?: number; rot?: number; until?: number }> = ({ text, x, y, at, color = "#ffcf4a", size = 70, rot = -3, until }) => {
  const f = useCurrentFrame();
  if (f < at || (until !== undefined && f > until)) return null;
  const s = spring({ frame: f - at, fps: 30, config: { damping: 10 } });
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${s}) rotate(${rot}deg)`, zIndex: 6000, fontFamily: "Oswald", fontWeight: 700, fontSize: size, color: INK, background: color, border: `8px solid ${INK}`, borderRadius: 16, padding: "4px 26px", boxShadow: "0 10px 0 rgba(0,0,0,0.35)", whiteSpace: "nowrap" }}>
      {text}
    </div>
  );
};

/** Big counting number */
export const BigCount: React.FC<{ x: number; y: number; at: number; from: number; to: number; dur: number; suffix?: string; prefix?: string; size?: number; color?: string }> = ({
  x,
  y,
  at,
  from,
  to,
  dur,
  suffix = "",
  prefix = "",
  size = 170,
  color = "white",
}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const v = interpolate(f, [at, at + dur], [from, to], { ...clamp, easing: Easing.out(Easing.cubic) });
  const s = spring({ frame: f - at, fps: 30, config: { damping: 9 } });
  const done = f > at + dur ? 1 + 0.06 * Math.sin((f - at - dur) / 3) * Math.exp(-(f - at - dur) / 10) : 1;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${s * done})`, zIndex: 6500, fontFamily: "Montserrat", fontWeight: 800, fontSize: size, color, WebkitTextStroke: `18px ${INK}`, paintOrder: "stroke fill", textShadow: "6px 10px 0 rgba(0,0,0,0.45)", whiteSpace: "nowrap" }}>
      {prefix}
      {Math.round(v).toLocaleString("es-ES")}
      {suffix}
    </div>
  );
};

/** Full-screen flash */
export const Flash: React.FC<{ at: number; color?: string; dur?: number }> = ({ at, color = "white", dur = 10 }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at, at + 1, at + dur], [0, 1, 0], clamp);
  if (o <= 0) return null;
  return <AbsoluteFill style={{ background: color, opacity: o, zIndex: 9700 }} />;
};

/** Expanding shock rings */
export const Shock: React.FC<{ x: number; y: number; at: number; color?: string; n?: number; max?: number }> = ({ x, y, at, color = "#ffffff", n = 3, max = 900 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, zIndex: 5500, pointerEvents: "none" }}>
      {Array.from({ length: n }).map((_, i) => {
        const t = (f - at - i * 4) / 22;
        if (t < 0 || t > 1) return null;
        const r = Easing.out(Easing.cubic)(t) * max;
        return <circle key={i} cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth={30 * (1 - t) + 4} opacity={1 - t} />;
      })}
    </svg>
  );
};

/** Radial light burst (sun-like) */
export const Burst: React.FC<{ x: number; y: number; at: number; until?: number; r?: number; color?: string }> = ({ x, y, at, until = 99999, r = 420, color = "#fff3a0" }) => {
  const f = useCurrentFrame();
  if (f < at || f > until) return null;
  const s = spring({ frame: f - at, fps: 30, config: { damping: 8, stiffness: 160 } });
  const out = interpolate(f, [until - 8, until], [1, 0], clamp);
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, zIndex: 5400, pointerEvents: "none", opacity: out }}>
      <defs>
        <radialGradient id="burstg">
          <stop offset="0" stopColor="white" />
          <stop offset="0.35" stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={`translate(${x} ${y}) rotate(${f * 1.5}) scale(${s})`}>
        {Array.from({ length: 16 }).map((_, i) => (
          <polygon key={i} points={`0,0 ${Math.cos((i / 16) * Math.PI * 2 - 0.08) * r * 1.6},${Math.sin((i / 16) * Math.PI * 2 - 0.08) * r * 1.6} ${Math.cos((i / 16) * Math.PI * 2 + 0.08) * r * 1.6},${Math.sin((i / 16) * Math.PI * 2 + 0.08) * r * 1.6}`} fill={color} opacity={0.35} />
        ))}
        <circle r={r} fill="url(#burstg)" />
      </g>
    </svg>
  );
};

/** Thermometer with label */
export const Thermo: React.FC<{ at: number; x: number; y: number; to: number; max?: number; dur?: number; scale?: number }> = ({ at, x, y, to, max = 5500, dur = 30, scale = 1 }) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [at, at + dur], [20, to], { ...clamp, easing: Easing.out(Easing.cubic) });
  const p = Math.max(0.03, v / max);
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 6000, transform: `scale(${scale})`, transformOrigin: "50% 0" }}>
      <svg width={200} height={760} viewBox="0 0 200 760">
        <rect x="70" y="20" width="60" height="620" rx="30" fill="#f4f6f8" stroke={INK} strokeWidth="10" />
        <rect x="84" y={40 + 590 * (1 - p)} width="32" height={590 * p} rx="16" fill="#e8322a" />
        <circle cx="100" cy="680" r="70" fill="#e8322a" stroke={INK} strokeWidth="10" />
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1="130" x2="160" y1={80 + i * 130} y2={80 + i * 130} stroke={INK} strokeWidth="6" />
        ))}
      </svg>
      <div style={{ position: "absolute", left: -110, top: -110, width: 420, textAlign: "center", fontFamily: "Oswald", fontWeight: 700, fontSize: 96, color: "white", WebkitTextStroke: `12px ${INK}`, paintOrder: "stroke fill" }}>
        {Math.round(v).toLocaleString("es-ES")}°C
      </div>
    </div>
  );
};

/* =====================================================================
   VIDEO 1 — PISTOL SHRIMP
   ===================================================================== */

const SH = { body: "#ff7a4d", dark: "#d9482a", light: "#ffb08a", claw: "#ff8e5e", tip: "#ffe0c8" };

const Claw: React.FC<{ open: number; s: number; f: number }> = ({ open, s, f }) => {
  if (s <= 0.01) return null;
  const ang = -open * 38;
  return (
    <g transform={`scale(${s})`}>
      <path d="M-10 0 Q30 -14 70 -6 L70 18 Q30 24 -10 14 Z" fill={SH.claw} stroke={INK} strokeWidth="8" strokeLinejoin="round" />
      {/* propodus (big palm) */}
      <ellipse cx="150" cy="0" rx="98" ry="56" fill={SH.claw} stroke={INK} strokeWidth="9" />
      <ellipse cx="135" cy="-18" rx="55" ry="20" fill={SH.light} opacity="0.7" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={110 + i * 32} cy={22} r="6" fill={SH.dark} opacity="0.7" />
      ))}
      {/* fixed finger */}
      <path d="M225 18 Q285 30 318 8 Q290 46 225 44 Z" fill={SH.tip} stroke={INK} strokeWidth="8" strokeLinejoin="round" />
      {/* dactyl (moving finger) */}
      <g transform={`rotate(${ang} 222 -22)`}>
        <path d="M215 -38 Q290 -48 326 2 Q282 -8 222 -2 Z" fill={SH.tip} stroke={INK} strokeWidth="8" strokeLinejoin="round" />
      </g>
      {f < 0 && <circle r="1" />}
    </g>
  );
};

/** Pistol shrimp, side view facing right. viewBox 640x360, sits at y≈335 */
export const Shrimp: React.FC<{ height?: number; open?: number; big?: number; small?: number; expr?: Expr; flip?: boolean; seed?: number; swim?: boolean }> = ({
  height = 360,
  open = 0,
  big = 1,
  small = 0.38,
  expr = "neutral",
  flip = false,
  seed = 0,
  swim = false,
}) => {
  const f = useCurrentFrame() + seed * 11;
  const bob = Math.sin(f / 9) * (swim ? 10 : 4);
  const tailW = Math.sin(f / (swim ? 3 : 8)) * (swim ? 12 : 5);
  const segs = [
    [118, 225, 44, 46],
    [168, 208, 50, 52],
    [222, 196, 54, 56],
    [276, 190, 56, 58],
  ];
  return (
    <svg width={(height * 640) / 360} height={height} viewBox="0 0 640 360" style={{ overflow: "visible", transform: flip ? "scaleX(-1)" : undefined }}>
      <ellipse cx="300" cy="345" rx="230" ry="16" fill="rgba(0,0,0,0.25)" />
      <g transform={`translate(0 ${bob})`}>
        {/* antennae */}
        {[0, 1].map((i) => (
          <path key={i} d={`M440 135 Q${520 + i * 20} ${40 - i * 30 + Math.sin(f / 7 + i) * 18} ${620 + i * 10} ${60 + i * 40 + Math.sin(f / 5 + i) * 25}`} stroke={INK} strokeWidth="6" fill="none" strokeLinecap="round" />
        ))}
        {/* walking legs */}
        {[0, 1, 2, 3].map((i) => {
          const x = 290 + i * 34;
          const k = Math.sin(f / (swim ? 2.5 : 6) + i) * 10;
          return <path key={i} d={`M${x} 235 l${-10 + k} 48 l${-14} 30`} stroke={INK} strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />;
        })}
        {/* tail fan */}
        <g transform={`rotate(${tailW} 100 225)`}>
          <path d="M100 215 L22 170 Q8 225 22 285 L100 240 Z" fill={SH.body} stroke={INK} strokeWidth="8" strokeLinejoin="round" />
          <path d="M100 222 L40 200 M100 232 L40 260" stroke={SH.dark} strokeWidth="6" />
        </g>
        {/* abdomen */}
        {segs.map(([x, y, rx, ry], i) => (
          <g key={i}>
            <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={SH.body} stroke={INK} strokeWidth="8" />
            <path d={`M${x - rx * 0.5} ${y - ry * 0.7} Q${x} ${y - ry * 0.95} ${x + rx * 0.5} ${y - ry * 0.7}`} stroke={SH.light} strokeWidth="7" fill="none" strokeLinecap="round" />
          </g>
        ))}
        {/* small claw (behind) */}
        <g transform="translate(395 262) rotate(8)">
          <Claw open={0} s={small} f={f} />
        </g>
        {/* carapace */}
        <ellipse cx="360" cy="185" rx="105" ry="78" fill={SH.body} stroke={INK} strokeWidth="9" />
        <path d="M290 140 Q360 105 440 140" stroke={SH.light} strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M300 230 Q360 245 430 222" stroke={SH.dark} strokeWidth="7" fill="none" />
        {/* eye hood + face */}
        <ellipse cx="420" cy="150" rx="62" ry="52" fill={SH.light} stroke={INK} strokeWidth="8" />
        <Eyes cx={420} cy={146} gap={24} size={11} expr={expr} f={f} seed={seed} lid={SH.light} />
        <Mouth cx={432} cy={185} w={22} expr={expr} talking={false} f={f} />
        {/* big claw (front) */}
        <g transform="translate(410 215) rotate(-4)">
          <Claw open={open} s={big} f={f} />
        </g>
      </g>
    </svg>
  );
};

/** Simple cartoon fish facing right, viewBox 320x220 */
export const Fish: React.FC<{ height?: number; color?: string; stunned?: boolean; flip?: boolean; seed?: number }> = ({ height = 200, color = "#ffd23f", stunned = false, flip = false, seed = 0 }) => {
  const f = useCurrentFrame() + seed * 17;
  const wig = Math.sin(f / (stunned ? 20 : 4)) * (stunned ? 3 : 10);
  const rot = stunned ? 170 + Math.sin(f / 15) * 6 : Math.sin(f / 10) * 5;
  return (
    <svg width={(height * 320) / 220} height={height} viewBox="0 0 320 220" style={{ overflow: "visible", transform: flip ? "scaleX(-1)" : undefined }}>
      <g transform={`rotate(${rot} 160 110)`}>
        <path d={`M70 110 L10 ${55 + wig} L22 110 L10 ${165 + wig} Z`} fill={color} stroke={INK} strokeWidth="8" strokeLinejoin="round" />
        <ellipse cx="170" cy="110" rx="115" ry="78" fill={color} stroke={INK} strokeWidth="9" />
        <path d="M120 40 Q170 0 220 38" fill={color} stroke={INK} strokeWidth="7" />
        {[0, 1].map((i) => (
          <path key={i} d={`M${130 + i * 40} 50 Q${150 + i * 40} 110 ${130 + i * 40} 170`} stroke="rgba(0,0,0,0.18)" strokeWidth="14" fill="none" />
        ))}
        {stunned ? (
          <g stroke={INK} strokeWidth="8" strokeLinecap="round">
            <path d="M220 75 l26 26 M246 75 l-26 26" />
          </g>
        ) : (
          <g>
            <circle cx="232" cy="88" r="22" fill="white" stroke={INK} strokeWidth="6" />
            <circle cx="238" cy="90" r="10" fill={INK} />
          </g>
        )}
        <path d={stunned ? "M255 140 q12 10 24 0" : "M255 135 q14 12 28 -2"} stroke={INK} strokeWidth="7" fill="none" strokeLinecap="round" />
      </g>
      {stunned &&
        [0, 1, 2].map((i) => {
          const a = f / 6 + (i * Math.PI * 2) / 3;
          const sx = 170 + Math.cos(a) * 80;
          const sy = -10 + Math.sin(a) * 20;
          const pts = Array.from({ length: 10 }).map((__, k) => { const rr = k % 2 ? 9 : 22; const aa = (k / 10) * Math.PI * 2 - Math.PI / 2; return `${sx + Math.cos(aa) * rr},${sy + Math.sin(aa) * rr}`; }).join(" ");
          return <polygon key={i} points={pts} fill="#ffd23f" stroke={INK} strokeWidth="4" strokeLinejoin="round" />;
        })}
    </svg>
  );
};

/** Crab, viewBox 300x220 */
export const Crab: React.FC<{ height?: number; stunned?: boolean; seed?: number }> = ({ height = 200, stunned = false, seed = 0 }) => {
  const f = useCurrentFrame() + seed * 5;
  const sc = stunned ? 0 : Math.sin(f / 4) * 12;
  return (
    <svg width={(height * 300) / 220} height={height} viewBox="0 0 300 220" style={{ overflow: "visible", transform: stunned ? "rotate(180deg)" : undefined }}>
      {[-1, 1].map((s) => (
        <g key={s}>
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${150 + s * 60} ${150 + i * 10} l${s * 50} ${20 + i * 6} l${s * 10} 30`} stroke={INK} strokeWidth="8" fill="none" strokeLinecap="round" />
          ))}
          <g transform={`rotate(${s * sc} ${150 + s * 80} 110)`}>
            <path d={`M${150 + s * 80} 120 Q${150 + s * 120} 70 ${150 + s * 115} 40`} stroke={INK} strokeWidth="10" fill="none" />
            <ellipse cx={150 + s * 118} cy="35" rx="30" ry="26" fill="#e8442a" stroke={INK} strokeWidth="7" />
            <path d={`M${150 + s * 118} 10 l${s * 14} 22`} stroke={INK} strokeWidth="6" />
          </g>
        </g>
      ))}
      <ellipse cx="150" cy="140" rx="95" ry="60" fill="#e8442a" stroke={INK} strokeWidth="9" />
      {[-1, 1].map((s) => (
        <g key={s}>
          <line x1={150 + s * 25} y1="90" x2={150 + s * 30} y2="55" stroke={INK} strokeWidth="7" />
          <circle cx={150 + s * 30} cy="50" r="15" fill="white" stroke={INK} strokeWidth="5" />
          {stunned ? <path d={`M${150 + s * 30 - 8} 42 l16 16 M${150 + s * 30 + 8} 42 l-16 16`} stroke={INK} strokeWidth="5" /> : <circle cx={150 + s * 30} cy="52" r="6" fill={INK} />}
        </g>
      ))}
      <path d="M130 165 q20 12 40 0" stroke={INK} strokeWidth="6" fill="none" />
    </svg>
  );
};

/** Coral reef background */
export const Reef: React.FC<{ children?: React.ReactNode; dark?: number }> = ({ children, dark = 0 }) => {
  const f = useCurrentFrame();
  const weeds = [80, 230, 760, 900, 1010];
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="reefw" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#4fc3e8" />
          <stop offset="0.55" stopColor="#1677b3" />
          <stop offset="1" stopColor="#0a3d6b" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#reefw)" />
      {Array.from({ length: 7 }).map((_, i) => (
        <polygon key={i} points={`${60 + i * 160},0 ${130 + i * 160},0 ${40 + i * 160 + Math.sin(f / 22 + i) * 50},1500 ${-50 + i * 160},1500`} fill="white" opacity={0.05 + 0.02 * Math.sin(f / 15 + i)} />
      ))}
      {/* distant rocks */}
      <path d="M0 1250 Q150 1120 300 1230 Q420 1140 560 1240 Q720 1110 880 1230 Q980 1170 1080 1220 L1080 1500 L0 1500 Z" fill="#0f5a8a" opacity="0.7" />
      {/* sand */}
      <path d="M0 1420 Q270 1380 540 1420 Q810 1460 1080 1410 L1080 1920 L0 1920 Z" fill="#f1d9a0" stroke={INK} strokeWidth="8" />
      {Array.from({ length: 40 }).map((_, i) => (
        <circle key={i} cx={random(`sd${i}`) * W} cy={1460 + random(`sy${i}`) * 440} r={3 + (i % 3) * 2} fill="#d7b878" />
      ))}
      {/* corals */}
      <g transform="translate(150 1470)">
        {[-40, 0, 40].map((dx, i) => (
          <path key={i} d={`M${dx} 0 Q${dx - 20} -90 ${dx + 5} -${150 + i * 30} M${dx} -60 Q${dx + 40} -90 ${dx + 45} -130`} stroke="#ff6fa3" strokeWidth="26" fill="none" strokeLinecap="round" />
        ))}
      </g>
      <g transform="translate(930 1480)">
        <ellipse cx="0" cy="-60" rx="110" ry="70" fill="#9b6bff" stroke={INK} strokeWidth="8" />
        {Array.from({ length: 6 }).map((_, i) => (
          <path key={i} d={`M${-80 + i * 32} -100 q10 25 0 50`} stroke="#6a3fd6" strokeWidth="7" fill="none" />
        ))}
      </g>
      {weeds.map((x, i) => (
        <path key={i} d={`M${x} 1500 Q${x + Math.sin(f / 18 + i) * 50} 1350 ${x + Math.sin(f / 14 + i) * 30} 1200 Q${x + Math.sin(f / 12 + i) * 60} 1100 ${x + Math.sin(f / 10 + i) * 40} 1020`} stroke="#3fae5a" strokeWidth="22" fill="none" strokeLinecap="round" />
      ))}
      {/* rising bubbles */}
      {Array.from({ length: 18 }).map((_, i) => {
        const y = H - ((f * (2 + (i % 4)) + random(`rb${i}`) * H) % H);
        return <circle key={i} cx={random(`rx${i}`) * W + Math.sin(f / 9 + i) * 10} cy={y} r={4 + (i % 4) * 3} fill="none" stroke="#d8f4ff" strokeWidth="3" opacity="0.6" />;
      })}
      {children}
      {dark > 0 && <rect width={W} height={H} fill="#020b1f" opacity={dark} />}
    </svg>
  );
};

/** WWII-style submarine, viewBox 760x300 facing right */
export const Submarine: React.FC<{ width?: number; seed?: number }> = ({ width = 760, seed = 0 }) => {
  const f = useCurrentFrame() + seed * 3;
  return (
    <svg width={width} height={(width * 300) / 760} viewBox="0 0 760 300" style={{ overflow: "visible" }}>
      <g transform={`translate(0 ${Math.sin(f / 20) * 6})`}>
        <rect x="290" y="40" width="170" height="90" rx="20" fill="#7d8a96" stroke={INK} strokeWidth="9" />
        <path d="M400 40 L400 -40 L440 -40" stroke={INK} strokeWidth="12" fill="none" strokeLinecap="round" />
        <rect x="320" y="65" width="30" height="20" rx="6" fill="#ffe27a" stroke={INK} strokeWidth="5" />
        <ellipse cx="380" cy="180" rx="350" ry="90" fill="#8f9ca8" stroke={INK} strokeWidth="10" />
        <path d="M70 160 Q380 110 700 160" stroke="#c4ced8" strokeWidth="12" fill="none" strokeLinecap="round" />
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={220 + i * 110} cy="185" r="26" fill="#bfe9ff" stroke={INK} strokeWidth="7" />
        ))}
        <text x="380" y="250" textAnchor="middle" fontFamily="Oswald" fontWeight="700" fontSize="40" fill="#3a4450">
          U-SS 47
        </text>
        <g transform={`translate(25 180) scale(1 ${Math.cos(f / 2)})`}>
          <ellipse cx="0" cy="0" rx="18" ry="70" fill="#e6bd55" stroke={INK} strokeWidth="6" />
        </g>
      </g>
    </svg>
  );
};

/** Green sonar screen; noise 0..1 fills it with static */
export const Sonar: React.FC<{ size?: number; noise?: number }> = ({ size = 700, noise = 0 }) => {
  const f = useCurrentFrame();
  const a = (f * 6 * Math.PI) / 180;
  return (
    <svg width={size} height={size} viewBox="-360 -360 720 720">
      <circle r="350" fill="#0d1a12" stroke={INK} strokeWidth="20" />
      <circle r="335" fill="#06240f" stroke="#2f6f3f" strokeWidth="6" />
      {[100, 200, 300].map((r) => (
        <circle key={r} r={r} fill="none" stroke="#2fbf5a" strokeWidth="3" opacity="0.5" />
      ))}
      <line x1="-330" x2="330" stroke="#2fbf5a" strokeWidth="3" opacity="0.5" />
      <line y1="-330" y2="330" stroke="#2fbf5a" strokeWidth="3" opacity="0.5" />
      <path d={`M0 0 L${Math.cos(a) * 330} ${Math.sin(a) * 330} A330 330 0 0 0 ${Math.cos(a - 0.6) * 330} ${Math.sin(a - 0.6) * 330} Z`} fill="#3dff7a" opacity="0.25" />
      <line x2={Math.cos(a) * 330} y2={Math.sin(a) * 330} stroke="#7dff9f" strokeWidth="6" />
      {noise < 0.3 && <circle cx="150" cy="-90" r="14" fill="#7dff9f" opacity={0.5 + 0.5 * Math.sin(f / 4)} />}
      {Array.from({ length: Math.round(noise * 220) }).map((_, i) => {
        const rr = random(`sn${i}-${Math.floor(f / 2)}`) * 320;
        const aa = random(`sa${i}-${Math.floor(f / 2)}`) * Math.PI * 2;
        return <circle key={i} cx={Math.cos(aa) * rr} cy={Math.sin(aa) * rr} r={3 + random(`sr${i}`) * 6} fill="#7dff9f" opacity={0.4 + random(`so${i}-${f}`) * 0.6} />;
      })}
      {noise > 0.5 && (
        <text y="20" textAnchor="middle" fontFamily="Oswald" fontWeight="700" fontSize="80" fill="#ff5a5a" opacity={Math.sin(f / 3) > 0 ? 1 : 0.3}>
          ¿¿??
        </text>
      )}
    </svg>
  );
};

/** Water jet from claw tip */
export const Jet: React.FC<{ x: number; y: number; at: number; len?: number }> = ({ x, y, at, len = 650 }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [at, at + 6], [0, 1], clamp);
  const fade = interpolate(f, [at + 10, at + 24], [1, 0], clamp);
  if (f < at || fade <= 0) return null;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, zIndex: 5200, pointerEvents: "none", opacity: fade }}>
      {Array.from({ length: 7 }).map((_, i) => (
        <line key={i} x1={x} y1={y + (i - 3) * 9} x2={x + len * t * (0.75 + random(`j${i}`) * 0.25)} y2={y + (i - 3) * 22 * t} stroke={i % 2 ? "#e9fbff" : "#9fe6ff"} strokeWidth={14 - Math.abs(i - 3) * 3} strokeLinecap="round" />
      ))}
    </svg>
  );
};

/** Cavitation bubble that grows, collapses, and flashes */
export const CavBubble: React.FC<{ x: number; y: number; at: number; collapse: number; r?: number }> = ({ x, y, at, collapse, r = 170 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const grow = interpolate(f, [at, at + 10], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const col = interpolate(f, [collapse - 6, collapse], [1, 0.05], { ...clamp, easing: Easing.in(Easing.cubic) });
  const rr = r * grow * col;
  const wob = Math.sin(f / 2) * 6;
  const glow = interpolate(f, [collapse, collapse + 3, collapse + 30], [0, 1, 0], clamp);
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, zIndex: 5300, pointerEvents: "none" }}>
      {f < collapse + 1 && (
        <g>
          <ellipse cx={x} cy={y} rx={rr + wob} ry={rr - wob} fill="rgba(200,240,255,0.25)" stroke="#e9fbff" strokeWidth="8" />
          <ellipse cx={x - rr * 0.35} cy={y - rr * 0.35} rx={rr * 0.25} ry={rr * 0.15} fill="white" opacity="0.8" />
        </g>
      )}
      {glow > 0 && (
        <g>
          <circle cx={x} cy={y} r={60 + glow * 140} fill="#fff6b0" opacity={glow * 0.6} />
          <circle cx={x} cy={y} r={20 + glow * 40} fill="white" opacity={glow} />
        </g>
      )}
    </svg>
  );
};

/* =====================================================================
   VIDEO 2 — DANCING PLAGUE
   ===================================================================== */

const DANCE: Pose[] = ["up", "shrug", "fight", "hips", "up", "point"];
/** frenetic dance pose cycle for a Toon */
export const dance = (f: number, seed: number, every = 9) => {
  const k = Math.floor((f + seed * 5) / every);
  const t = ((f + seed * 5) % every) / 6;
  return { pose: DANCE[(k + seed) % DANCE.length], prevPose: DANCE[(k + seed + DANCE.length - 1) % DANCE.length], poseT: Math.min(1, t) };
};

/** bouncing / twisting wrapper for dancers */
export const Bounce: React.FC<{ children: React.ReactNode; seed?: number; amp?: number; speed?: number; tired?: number }> = ({ children, seed = 0, amp = 50, speed = 1, tired = 0 }) => {
  const f = (useCurrentFrame() + seed * 7) * speed;
  const ph = f / 4.5;
  const y = -Math.abs(Math.sin(ph)) * amp * (1 - tired * 0.7);
  const rot = Math.sin(ph / 2) * 9 * (1 - tired * 0.5) + tired * Math.sin(f / 20) * 6;
  const sq = 1 + Math.cos(ph * 2) * 0.04;
  return <div style={{ transform: `translateY(${y}px) rotate(${rot}deg) scale(${2 - sq}, ${sq})`, transformOrigin: "50% 100%" }}>{children}</div>;
};

/** Collapsing (falls to the side, desaturated) */
export const Fall: React.FC<{ children: React.ReactNode; at: number; dir?: 1 | -1 }> = ({ children, at, dir = 1 }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [at, at + 14], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const bounce = f > at + 14 ? Math.sin((f - at - 14) / 2) * 4 * Math.exp(-(f - at - 14) / 6) : 0;
  return <div style={{ transform: `rotate(${dir * (84 * t + bounce)}deg)`, transformOrigin: "50% 100%", filter: t > 0 ? `grayscale(${t * 0.7}) brightness(${1 - t * 0.2})` : undefined }}>{children}</div>;
};

export const Drum: React.FC<{ size?: number }> = ({ size = 260 }) => {
  const f = useCurrentFrame();
  const hit = Math.max(0, Math.sin(f / 2.3));
  return (
    <svg width={size} height={size} viewBox="0 0 260 260" style={{ overflow: "visible" }}>
      <ellipse cx="130" cy="210" rx="110" ry="35" fill="#8a4a24" stroke={INK} strokeWidth="8" />
      <rect x="20" y="80" width="220" height="130" fill="#b5523b" stroke={INK} strokeWidth="8" />
      <path d="M20 90 L75 205 L130 90 L185 205 L240 90" stroke="#f3d27a" strokeWidth="8" fill="none" />
      <ellipse cx="130" cy="80" rx="110" ry="35" fill="#f1e2bd" stroke={INK} strokeWidth="8" />
      <line x1="210" y1={-30 + hit * 40} x2="140" y2={70 - hit * 5} stroke={INK} strokeWidth="12" strokeLinecap="round" />
      <circle cx="140" cy={70 - hit * 5} r="14" fill="#f1e2bd" stroke={INK} strokeWidth="6" />
    </svg>
  );
};

export const Lute: React.FC<{ size?: number }> = ({ size = 300 }) => {
  const f = useCurrentFrame();
  return (
    <svg width={size} height={size} viewBox="0 0 300 300" style={{ overflow: "visible", transform: `rotate(${-35 + Math.sin(f / 4) * 4}deg)` }}>
      <rect x="135" y="0" width="30" height="150" fill="#7a4b26" stroke={INK} strokeWidth="7" />
      <rect x="125" y="-30" width="50" height="40" rx="6" fill="#5b3420" stroke={INK} strokeWidth="7" />
      <ellipse cx="150" cy="210" rx="95" ry="85" fill="#d08a3a" stroke={INK} strokeWidth="8" />
      <circle cx="150" cy="195" r="24" fill="#3a2210" />
      {[-8, 0, 8].map((d) => (
        <line key={d} x1={150 + d} y1="-20" x2={150 + d} y2="260" stroke="#f4efe6" strokeWidth="2.5" />
      ))}
    </svg>
  );
};

/** Wooden stage platform with bunting */
export const Stage: React.FC<{ y?: number; w?: number }> = ({ y = 1500, w = 1000 }) => (
  <svg width={w} height={360} viewBox={`0 0 ${w} 360`} style={{ position: "absolute", left: 540 - w / 2, top: y - 160, zIndex: Math.round(y) - 400 }}>
    <rect x="0" y="120" width={w} height="60" fill="#a0663a" stroke={INK} strokeWidth="9" />
    <rect x="0" y="180" width={w} height="180" fill="#6b4423" stroke={INK} strokeWidth="9" />
    {Array.from({ length: Math.floor(w / 90) }).map((_, i) => (
      <line key={i} x1={i * 90 + 45} y1="180" x2={i * 90 + 45} y2="360" stroke={INK} strokeWidth="5" opacity="0.5" />
    ))}
    {Array.from({ length: 12 }).map((_, i) => (
      <polygon key={i} points={`${i * (w / 12)},0 ${(i + 1) * (w / 12)},0 ${(i + 0.5) * (w / 12)},60`} fill={["#d7263d", "#f3d27a", "#2f4f8f"][i % 3]} stroke={INK} strokeWidth="5" />
    ))}
  </svg>
);

/* =====================================================================
   VIDEO 3 — EIFFEL TOWER CON
   ===================================================================== */

/** Eiffel Tower, viewBox 500x1000, base at y=1000 */
export const Eiffel: React.FC<{ height?: number; rust?: number; sold?: number }> = ({ height = 1000, rust = 0, sold = 0 }) => {
  const f = useCurrentFrame();
  const c = "#7a5a3a";
  const lat = (x1: number, y1: number, x2: number, y2: number, n: number) =>
    Array.from({ length: n }).map((_, i) => {
      const t0 = i / n;
      const t1 = (i + 1) / n;
      return <path key={`${x1}${y1}${i}`} d={`M${x1 + (x2 - x1) * t0} ${y1 + (y2 - y1) * t0} L${500 - x1 - (500 - x1 - (500 - x2)) * t1} ${y1 + (y2 - y1) * t1}`} stroke={c} strokeWidth="4" opacity="0.8" />;
    });
  return (
    <svg width={height / 2} height={height} viewBox="0 0 500 1000" style={{ overflow: "visible" }}>
      {/* legs + arch */}
      <path d="M40 1000 Q120 700 175 560 L325 560 Q380 700 460 1000 L380 1000 Q330 820 250 800 Q170 820 120 1000 Z" fill="#a37a52" stroke={INK} strokeWidth="10" strokeLinejoin="round" />
      <path d="M175 560 L205 300 L295 300 L325 560 Z" fill="#a37a52" stroke={INK} strokeWidth="10" strokeLinejoin="round" />
      <path d="M205 300 L238 60 L262 60 L295 300 Z" fill="#a37a52" stroke={INK} strokeWidth="10" strokeLinejoin="round" />
      {lat(60, 990, 175, 570, 7)}
      {lat(180, 550, 205, 310, 5)}
      {lat(210, 290, 238, 70, 6)}
      {/* platforms */}
      <rect x="140" y="540" width="220" height="34" fill="#8c6440" stroke={INK} strokeWidth="9" />
      <rect x="190" y="290" width="120" height="26" fill="#8c6440" stroke={INK} strokeWidth="8" />
      <rect x="232" y="20" width="36" height="46" fill="#8c6440" stroke={INK} strokeWidth="7" />
      <line x1="250" y1="20" x2="250" y2="-40" stroke={INK} strokeWidth="8" />
      <circle cx="250" cy="-44" r={8 + Math.sin(f / 5) * 2} fill="#ff5a5a" />
      {rust > 0 &&
        Array.from({ length: 22 }).map((_, i) => (
          <circle key={i} cx={150 + random(`ru${i}`) * 200 + (random(`rv${i}`) > 0.5 ? 0 : 0)} cy={120 + random(`rw${i}`) * 850} r={(10 + random(`rr${i}`) * 22) * rust} fill="#c0461a" opacity="0.85" />
        ))}
      {sold > 0 && (
        <g transform={`translate(250 720) rotate(-14) scale(${sold})`}>
          <rect x="-200" y="-60" width="400" height="120" rx="14" fill="white" stroke="#d7263d" strokeWidth="14" />
          <text y="30" textAnchor="middle" fontFamily="Montserrat" fontWeight="800" fontSize="80" fill="#d7263d">
            VENDIDA
          </text>
        </g>
      )}
    </svg>
  );
};

/** Paris skyline background */
export const Paris: React.FC<{ children?: React.ReactNode; night?: boolean; dusk?: boolean }> = ({ children, night = false, dusk = false }) => {
  const f = useCurrentFrame();
  const sky = night ? ["#0b1030", "#3a3f7a"] : dusk ? ["#ff9a6b", "#ffe0b0"] : ["#8fd0f5", "#e6f6ff"];
  const blds = Array.from({ length: 9 }).map((_, i) => ({ x: i * 130 - 40, w: 150, h: 300 + (i % 3) * 70 }));
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="psky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={sky[0]} />
          <stop offset="1" stopColor={sky[1]} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#psky)" />
      {night && Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={random(`ps${i}`) * W} cy={random(`pt${i}`) * 700} r="3" fill="white" opacity={0.5 + 0.5 * Math.sin(f / 8 + i)} />)}
      {!night &&
        [0, 1].map((i) => {
          const cx = ((i * 600 + f * (0.7 + i * 0.3)) % 1500) - 200;
          return (
            <g key={i}>
              <ellipse cx={cx} cy={200 + i * 160} rx="130" ry="48" fill="white" opacity="0.9" />
              <ellipse cx={cx + 80} cy={180 + i * 160} rx="80" ry="50" fill="white" opacity="0.9" />
            </g>
          );
        })}
      {blds.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={1250 - b.h} width={b.w} height={b.h} fill={night ? "#2a2d55" : "#efe3c9"} stroke={INK} strokeWidth="8" />
          <path d={`M${b.x - 8} ${1250 - b.h} L${b.x + 18} ${1250 - b.h - 60} L${b.x + b.w - 18} ${1250 - b.h - 60} L${b.x + b.w + 8} ${1250 - b.h} Z`} fill={night ? "#1a1c3a" : "#6b7a8f"} stroke={INK} strokeWidth="8" strokeLinejoin="round" />
          {Array.from({ length: 3 }).map((__, r) =>
            [0, 1].map((c) => <rect key={`${r}${c}`} x={b.x + 28 + c * 60} y={1250 - b.h + 40 + r * 85} width="34" height="50" fill={night ? (random(`w${i}${r}${c}`) > 0.4 ? "#ffd56b" : "#1a1c3a") : "#8fb3cf"} stroke={INK} strokeWidth="5" />),
          )}
        </g>
      ))}
      <rect x="0" y="1250" width={W} height={H - 1250} fill={night ? "#3a3550" : "#cbb89a"} />
      {Array.from({ length: 9 }).map((_, r) => (
        <line key={r} x1="0" x2={W} y1={1270 + Math.pow(r / 9, 1.5) * 650} y2={1270 + Math.pow(r / 9, 1.5) * 650} stroke="rgba(0,0,0,0.12)" strokeWidth="5" />
      ))}
      {children}
    </svg>
  );
};

/** Spinning newspaper that lands facing camera */
export const Newspaper: React.FC<{ at: number; title: string; head: string; sub?: string; children?: React.ReactNode; w?: number }> = ({ at, title, head, sub, children, w = 860 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const t = interpolate(f, [at, at + 16], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const rot = (1 - t) * 720 - 4;
  return (
    <div style={{ position: "absolute", left: 540 - w / 2, top: 360, width: w, zIndex: 7000, transform: `rotate(${rot}deg) scale(${0.05 + t * 0.95})` }}>
      <div style={{ background: "#f4efe0", border: `10px solid ${INK}`, padding: "20px 34px 30px", boxShadow: "0 22px 0 rgba(0,0,0,0.35)", fontFamily: "serif", color: "#1a1a1a" }}>
        <div style={{ textAlign: "center", fontWeight: 900, fontSize: 70, letterSpacing: 2, borderBottom: "6px double #1a1a1a", paddingBottom: 6 }}>{title}</div>
        <div style={{ textAlign: "center", fontSize: 26, borderBottom: "3px solid #1a1a1a", padding: "4px 0" }}>PARÍS · 1925 · 20 CÉNTIMOS</div>
        <div style={{ textAlign: "center", fontFamily: "Oswald", fontWeight: 700, fontSize: 96, lineHeight: 1.0, margin: "18px 0 10px" }}>{head}</div>
        {sub && <div style={{ textAlign: "center", fontSize: 40, fontStyle: "italic", marginBottom: 14 }}>{sub}</div>}
        <div style={{ display: "flex", gap: 24 }}>
          <div style={{ flex: 1, height: 360, background: "#d8d0bc", border: "5px solid #1a1a1a", position: "relative", overflow: "hidden" }}>{children}</div>
          <div style={{ width: 260 }}>
            {Array.from({ length: 11 }).map((_, i) => (
              <div key={i} style={{ height: 12, background: "#9a9384", margin: "14px 0", width: `${80 + (i % 3) * 8}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/** Official-looking letter with wax seal */
export const Letter: React.FC<{ at: number; x?: number; y?: number; w?: number }> = ({ at, x = 540, y = 760, w = 560 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = spring({ frame: f - at, fps: 30, config: { damping: 11 } });
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, zIndex: 6500, transform: `scale(${s}) rotate(${-6 + Math.sin(f / 15) * 2}deg)` }}>
      <div style={{ background: "#fbf6e8", border: `8px solid ${INK}`, padding: "26px 30px 40px", boxShadow: "0 16px 0 rgba(0,0,0,0.3)", fontFamily: "serif", color: "#2a2a3a" }}>
        <div style={{ textAlign: "center", fontWeight: 900, fontSize: 34, letterSpacing: 2 }}>RÉPUBLIQUE FRANÇAISE</div>
        <div style={{ textAlign: "center", fontSize: 26, fontStyle: "italic", marginBottom: 16 }}>Ministère des Postes et Télégraphes</div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ height: 10, background: "#b9b3a2", margin: "14px 0", width: `${90 - (i % 3) * 12}%` }} />
        ))}
        <div style={{ position: "absolute", right: 30, bottom: -30, width: 110, height: 110, borderRadius: 55, background: "#b3121f", border: `7px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", color: "#f3c0c0", fontFamily: "serif", fontWeight: 900, fontSize: 44 }}>RF</div>
        <div style={{ position: "absolute", left: 30, bottom: 6, fontFamily: "Oswald", fontWeight: 700, fontSize: 34, color: "#d7263d", transform: "rotate(-8deg)", border: "4px solid #d7263d", padding: "0 10px" }}>CONFIDENCIAL</div>
      </div>
    </div>
  );
};

/** Hotel lobby: gold walls, chandelier, red carpet */
export const Lobby: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <rect width={W} height={H} fill="#e9c77a" />
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x={30 + i * 180} y="300" width="140" height="900" rx="10" fill="#f3d995" stroke="#b98d3a" strokeWidth="8" />
      ))}
      {[0, 1].map((i) => (
        <g key={i}>
          <rect x={120 + i * 650} y="380" width="190" height="480" rx="95" fill="#7fb5d6" stroke={INK} strokeWidth="10" />
          <line x1={215 + i * 650} y1="380" x2={215 + i * 650} y2="860" stroke={INK} strokeWidth="6" />
          <path d={`M${110 + i * 650} 380 Q${215 + i * 650} 300 ${320 + i * 650} 380 L${330 + i * 650} 900 L${100 + i * 650} 900 Z`} fill="none" />
          <rect x={95 + i * 650} y="360" width="60" height="560" fill="#a3202c" stroke={INK} strokeWidth="8" />
          <rect x={275 + i * 650} y="360" width="60" height="560" fill="#a3202c" stroke={INK} strokeWidth="8" />
        </g>
      ))}
      <rect x="0" y="1200" width={W} height={H - 1200} fill="#6b2430" />
      <polygon points="380,1200 700,1200 1000,1920 80,1920" fill="#b3202c" stroke={INK} strokeWidth="8" />
      <path d="M380 1200 L80 1920 M700 1200 L1000 1920" stroke="#e6bd55" strokeWidth="10" />
      {/* chandelier */}
      <g transform={`translate(540 140) rotate(${Math.sin(f / 30) * 2})`}>
        <line x1="0" y1="-200" x2="0" y2="40" stroke={INK} strokeWidth="8" />
        <ellipse cx="0" cy="80" rx="170" ry="40" fill="#e6bd55" stroke={INK} strokeWidth="8" />
        {[-140, -70, 0, 70, 140].map((x, i) => (
          <g key={i}>
            <path d={`M${x} 90 l-12 50 l24 0 Z`} fill="#dff3ff" stroke={INK} strokeWidth="5" />
            <circle cx={x} cy="60" r={14 + Math.sin(f / 4 + i) * 2} fill="#fff3a0" opacity="0.95" />
          </g>
        ))}
      </g>
      {children}
    </svg>
  );
};

/** Money bag with $ */
export const MoneyBag: React.FC<{ size?: number; sign?: string }> = ({ size = 260, sign = "₣" }) => {
  const f = useCurrentFrame();
  return (
    <svg width={size} height={size} viewBox="0 0 260 260" style={{ overflow: "visible", transform: `rotate(${Math.sin(f / 8) * 5}deg)` }}>
      <path d="M90 60 Q130 80 170 60 L150 30 Q130 45 110 30 Z" fill="#c9a25e" stroke={INK} strokeWidth="8" strokeLinejoin="round" />
      <path d="M100 70 Q20 140 40 210 Q60 250 130 250 Q200 250 220 210 Q240 140 160 70 Z" fill="#d9b06a" stroke={INK} strokeWidth="9" strokeLinejoin="round" />
      <rect x="92" y="62" width="76" height="16" rx="8" fill="#8a5a2b" stroke={INK} strokeWidth="6" />
      <text x="130" y="200" textAnchor="middle" fontFamily="Montserrat" fontWeight="800" fontSize="96" fill="#3d7a2a" stroke={INK} strokeWidth="4">
        {sign}
      </text>
    </svg>
  );
};

/** Raining banknotes */
export const CashRain: React.FC<{ at: number; n?: number }> = ({ at, n = 26 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, zIndex: 7500, pointerEvents: "none" }}>
      {Array.from({ length: n }).map((_, i) => {
        const t = f - at - random(`cd${i}`) * 20;
        if (t < 0) return null;
        const x = random(`cx${i}`) * W + Math.sin(t / 8 + i) * 60;
        const y = -100 + t * (14 + random(`cv${i}`) * 8);
        const r = Math.sin(t / 6 + i) * 40;
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(1 ${Math.cos(t / 5 + i)})`}>
            <rect x="-70" y="-35" width="140" height="70" rx="6" fill="#9ed77a" stroke={INK} strokeWidth="5" />
            <circle r="20" fill="#6fae4a" stroke={INK} strokeWidth="4" />
          </g>
        );
      })}
    </svg>
  );
};

/** Alcatraz island backdrop */
export const Alcatraz: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="alsky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#5a6a85" />
          <stop offset="1" stopColor="#b8c4d6" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#alsky)" />
      <rect y="1000" width={W} height={H - 1000} fill="#2f4a6a" />
      {Array.from({ length: 10 }).map((_, i) => (
        <path key={i} d={`M${-100 + ((i * 160 + f * 2) % 1300)} ${1060 + (i % 4) * 160} q40 -20 80 0`} stroke="#8fb3cf" strokeWidth="6" fill="none" opacity="0.6" />
      ))}
      <path d="M100 1020 Q250 760 540 740 Q830 760 980 1020 Z" fill="#6b6a5a" stroke={INK} strokeWidth="10" />
      <rect x="300" y="560" width="480" height="230" fill="#d9d4c4" stroke={INK} strokeWidth="10" />
      {Array.from({ length: 4 }).map((_, r) =>
        Array.from({ length: 9 }).map((__, c) => <rect key={`${r}${c}`} x={320 + c * 52} y={580 + r * 52} width="26" height="34" fill="#3a3f4a" />),
      )}
      <rect x="690" y="380" width="60" height="200" fill="#d9d4c4" stroke={INK} strokeWidth="9" />
      <rect x="675" y="350" width="90" height="40" fill="#8a8578" stroke={INK} strokeWidth="8" />
      <polygon points={`720,370 ${720 + Math.cos(f / 12) * 700},${370 + Math.sin(f / 12) * 60 - 30} ${720 + Math.cos(f / 12) * 700},${370 + Math.sin(f / 12) * 60 + 30}`} fill="#fff6b0" opacity="0.25" />
      {children}
    </svg>
  );
};
