import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { City, FONT, H, INK, Sky, Stars, W } from "./scene";

/* ===== Símbolo misterioso (glifo original) ===== */
export const Glyph: React.FC<{ x: number; y: number; r: number; glow: number; reveal?: number; color?: string }> = ({ x, y, r, glow, reveal = 1, color = "#7ff0ff" }) => {
  const f = useCurrentFrame();
  const parts = [
    `M${-r} 0 A${r} ${r} 0 1 1 ${r} 0 A${r} ${r} 0 1 1 ${-r} 0`,
    `M0 ${-r * 0.7} L${r * 0.6} ${r * 0.35} L${-r * 0.6} ${r * 0.35}Z`,
    `M${-r * 0.35} ${-r * 0.1} h${r * 0.7} M0 ${-r * 0.45} v${r * 0.9}`,
    `M${-r * 0.85} ${-r * 0.5} l${r * 0.25} ${r * 0.1} M${r * 0.85} ${-r * 0.5} l${-r * 0.25} ${r * 0.1} M${-r * 0.85} ${r * 0.5} l${r * 0.25} ${-r * 0.1} M${r * 0.85} ${r * 0.5} l${-r * 0.25} ${-r * 0.1}`,
    `M${-r * 0.2} ${r * 0.6} a${r * 0.2} ${r * 0.2} 0 1 0 ${r * 0.4} 0`,
  ];
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <radialGradient id="glyphGlow">
          <stop offset="0" stopColor={color} stopOpacity=".5" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r * 2.2} fill="url(#glyphGlow)" opacity={glow} />
      <g transform={`translate(${x} ${y}) rotate(${f * 0.1})`} fill="none" stroke={color} strokeWidth={r * 0.05} strokeLinecap="round" opacity={0.35 + glow * 0.65}>
        {parts.map((d, i) => (
          <path key={i} d={d} pathLength={1} strokeDasharray={`${Math.max(0, Math.min(1, reveal * parts.length - i))} 1`} />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <circle key={i} cx={Math.cos((i / 12) * 6.283) * r * 1.15} cy={Math.sin((i / 12) * 6.283) * r * 1.15} r={r * 0.03} fill={color} stroke="none" opacity={reveal} />
        ))}
      </g>
    </svg>
  );
};

/* ===== Dormitorio (día o noche) con el glifo en la pared ===== */
export const Bedroom: React.FC<{ night?: boolean; glyph?: number; glyphReveal?: number; noWindow?: boolean }> = ({ night = false, glyph = 0, glyphReveal = 1, noWindow }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: night ? "linear-gradient(180deg,#141233,#0e0c26 70%,#0a081c)" : "linear-gradient(180deg,#3b2a55,#2a1d3d 70%,#1e1530)" }} />
    {!noWindow && (
      <div style={{ position: "absolute", left: 1180, top: 150, width: 560, height: 520, overflow: "hidden", borderRadius: 8, border: "14px solid #1c132c" }}>
        <div style={{ position: "absolute", inset: 0, filter: "blur(4px)" }}>
          {night ? <Sky stops={["#05061a", "#141a40"]} sun={{ x: 380, y: 120, r: 30, color: "#f3ead2" }} /> : <Sky stops={["#f6b26b", "#f08a7a 40%", "#9a6fb0 80%"]} sun={{ x: 280, y: 360, r: 46, color: "#ffe1a1" }} />}
          {night && <Stars n={40} h={300} />}
          <div style={{ position: "absolute", left: -1180, top: -150 }}>
            <City base={670} color={night ? "#141a36" : "#5a4070"} seed="hk" h={[60, 200]} windows={night ? "#ffcf8a" : "#ffd59a"} x0={1100} x1={1800} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 266, top: 0, width: 14, height: "100%", background: "#1c132c" }} />
        <div style={{ position: "absolute", top: 250, left: 0, width: "100%", height: 14, background: "#1c132c" }} />
      </div>
    )}
    {glyph > 0 && <Glyph x={560} y={380} r={150} glow={glyph} reveal={glyphReveal} />}
    <div style={{ position: "absolute", left: 0, top: 880, width: W, height: 200, background: night ? "linear-gradient(#141230,#0a0918)" : "linear-gradient(#24182f,#140d1e)" }} />
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      <rect x={180} y={640} width={60} height={290} rx={10} fill={night ? "#221d44" : "#3a2a4f"} stroke={INK} strokeWidth={5} />
      <rect x={200} y={740} width={760} height={150} rx={18} fill={night ? "#2a2552" : "#4b3a6a"} stroke={INK} strokeWidth={5} />
      <path d="M230 740 q120 -70 300 -30 q180 20 430 -10 v60 h-730z" fill={night ? "#3d3a78" : "#7a6aa8"} stroke={INK} strokeWidth={5} />
      <rect x={250} y={690} width={180} height={60} rx={26} fill={night ? "#a9a3cf" : "#e9e3f5"} stroke={INK} strokeWidth={5} />
      <rect x={20} y={760} width={140} height={130} rx={8} fill={night ? "#1b1636" : "#2d2240"} stroke={INK} strokeWidth={5} />
    </svg>
  </AbsoluteFill>
);

/* ===== Interior genérico: pared, zócalo, piso y ventana opcional ===== */
export const Room: React.FC<{ wall: [string, string]; floor: [string, string]; window?: { x: number; y: number; w: number; h: number; sky: string[]; city?: string; lights?: string } }> = ({ wall, floor, window: win }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: `linear-gradient(180deg,${wall[0]},${wall[1]})` }} />
    {win && (
      <div style={{ position: "absolute", left: win.x, top: win.y, width: win.w, height: win.h, overflow: "hidden", border: "14px solid rgba(0,0,0,.45)", borderRadius: 8 }}>
        <div style={{ position: "absolute", inset: 0, filter: "blur(4px)" }}>
          <Sky stops={win.sky} />
          {win.city && (
            <div style={{ position: "absolute", left: -win.x, top: -win.y }}>
              <City base={win.y + win.h} color={win.city} seed={`rw${win.x}`} h={[80, win.h * 0.7]} windows={win.lights} x0={win.x - 50} x1={win.x + win.w + 50} />
            </div>
          )}
        </div>
      </div>
    )}
    <div style={{ position: "absolute", left: 0, top: 860, width: W, height: 220, background: `linear-gradient(${floor[0]},${floor[1]})` }} />
    <div style={{ position: "absolute", left: 0, top: 850, width: W, height: 14, background: "rgba(0,0,0,.25)" }} />
  </AbsoluteFill>
);

/* ===== Fondo de infografía (rejilla oscura) ===== */
export const InfoBg: React.FC<{ hue?: string; grid?: number }> = ({ hue = "#2a2466", grid = 80 }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${hue}, #0d0b26 60%, #05040f)` }} />
    <Stars n={70} />
    <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.04) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.04) 2px, transparent 2px)", backgroundSize: `${grid}px ${grid}px` }} />
  </AbsoluteFill>
);

/* ===== Laboratorio ===== */
export const Lab: React.FC<{ tint?: string }> = ({ tint = "#cfe9f2" }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${tint}, #9cc3d3)` }} />
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: 150 + i * 600, top: 120, width: 420, height: 260, background: "#0e2a36", border: "12px solid #3a5a6a", borderRadius: 10, overflow: "hidden" }}>
          <svg width={420} height={260}>
            <path d={`M0 ${130} ${Array.from({ length: 21 }).map((_, k) => `L${k * 21} ${130 + Math.sin(k * 0.9 + f / 6 + i) * (30 + 20 * (k % 3))}`).join(" ")}`} stroke="#5ff0c8" strokeWidth={4} fill="none" />
          </svg>
        </div>
      ))}
      <div style={{ position: "absolute", left: 0, top: 700, width: W, height: 40, background: "#e9f4f7", borderTop: `6px solid ${INK}` }} />
      <div style={{ position: "absolute", left: 0, top: 740, width: W, height: 340, background: "linear-gradient(#7d9eac,#4d6c7a)" }} />
    </AbsoluteFill>
  );
};

/* ===== Ciudad nocturna ===== */
export const NightCity: React.FC<{ seed?: string }> = ({ seed = "nc" }) => (
  <AbsoluteFill>
    <Sky stops={["#05060f", "#11173a 60%", "#232a52"]} />
    <Stars n={80} h={500} />
    <div style={{ position: "absolute", inset: 0, filter: "blur(5px)" }}>
      <City base={760} color="#161d3a" seed={seed} h={[220, 560]} windows="#ffcf8a" />
    </div>
    <City base={860} color="#0d1128" seed={`${seed}2`} h={[120, 330]} windows="#ffd59a" />
    <div style={{ position: "absolute", left: 0, top: 860, width: W, height: 220, background: "linear-gradient(#141a33,#07091a)" }} />
  </AbsoluteFill>
);

/* ===== Tarjeta de "acto" (título de sección) ===== */
export const ActCard: React.FC<{ n: number; title: string; dur: number }> = ({ n, title, dur }) => {
  const f = useCurrentFrame();
  const k = Math.min(1, f / 15);
  const o = Math.min(1, (dur - f) / 12);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #1c1640, #07061a 70%)", alignItems: "center", justifyContent: "center", opacity: Math.max(0, o) }}>
      <Stars n={60} />
      <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 36, letterSpacing: 14, color: "#ffd36b", opacity: k, transform: `translateY(${(1 - k) * 20}px)` }}>CHAPTER {n}</div>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 110, color: "#fff", marginTop: 10, letterSpacing: 4, opacity: k, transform: `scale(${0.9 + 0.1 * k})`, textShadow: "0 0 40px rgba(127,240,255,.4)" }}>{title}</div>
      <div style={{ width: 400 * k, height: 4, background: "#22d3c5", marginTop: 24, borderRadius: 2 }} />
    </AbsoluteFill>
  );
};

/* ===== Burbuja de diálogo simple ===== */
export const Bubble: React.FC<{ x: number; y: number; children: React.ReactNode; s?: number; dark?: boolean; size?: number }> = ({ x, y, children, s = 1, dark, size = 40 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `translate(-50%,-50%) scale(${s})`,
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: size,
      color: dark ? "#fff" : INK,
      background: dark ? "rgba(20,16,50,.85)" : "#fff",
      padding: "12px 28px",
      borderRadius: 30,
      border: `5px solid ${INK}`,
      boxShadow: "0 8px 0 rgba(0,0,0,.3)",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

export const rnd = random;
