import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame } from "remotion";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { clamp, FPS, Word } from "./engine";

export const { fontFamily: numFont } = loadAnton("normal", { weights: ["400"], subsets: ["latin"] });
export const { fontFamily: bodyFont } = loadMontserrat("normal", { weights: ["800", "900"], subsets: ["latin"] });

/* Paleta de marca Dato Bomba */
export const GREEN = "#39ff88";
export const PINK = "#ff2e88";
export const YELLOW = "#ffd23f";
export const BLUE = "#4dc3ff";
export const BG = "#0b0614";
export const PANEL = "rgba(22,16,42,0.92)";
export const CAPTION_TOP = 1200;

export const center = (top: number): React.CSSProperties => ({ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center" });

export const Pop: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; from?: number; rot?: number }> = ({
  at,
  children,
  style,
  from = 0.2,
  rot = 0,
}) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - at, fps: FPS, config: { damping: 10, mass: 0.6 } });
  return (
    <div
      style={{
        position: "absolute",
        opacity: f < at ? 0 : Math.min(1, s * 3),
        transform: `scale(${interpolate(s, [0, 1], [from, 1])}) rotate(${interpolate(s, [0, 1], [rot, 0])}deg)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Slide: React.FC<{ at: number; dx?: number; dy?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  at,
  dx = 0,
  dy = 0,
  children,
  style,
}) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - at, fps: FPS, config: { damping: 14 } });
  return (
    <div style={{ position: "absolute", opacity: f < at ? 0 : 1, transform: `translate(${(1 - s) * dx}px, ${(1 - s) * dy}px)`, ...style }}>
      {children}
    </div>
  );
};

export const Big: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({
  children,
  size = 150,
  color = GREEN,
  style,
}) => (
  <div
    style={{
      fontFamily: numFont,
      fontSize: size,
      color,
      lineHeight: 1,
      whiteSpace: "nowrap",
      textShadow: `0 0 30px ${color}aa, 0 8px 0 #000`,
      WebkitTextStroke: `4px ${BG}`,
      paintOrder: "stroke fill",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Label: React.FC<{ children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }> = ({
  children,
  color = "white",
  size = 46,
  style,
}) => (
  <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: size, color, textTransform: "uppercase", whiteSpace: "nowrap", letterSpacing: 1, ...style }}>
    {children}
  </div>
);

export const Stamp: React.FC<{ children: React.ReactNode; color?: string; size?: number; rotate?: number }> = ({
  children,
  color = PINK,
  size = 120,
  rotate = -8,
}) => (
  <div
    style={{
      fontFamily: numFont,
      fontSize: size,
      color: "white",
      background: color,
      padding: "4px 36px",
      borderRadius: 24,
      transform: `rotate(${rotate}deg)`,
      boxShadow: `0 0 50px ${color}, 0 12px 0 rgba(0,0,0,0.6)`,
      border: "6px solid white",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

/** tarjeta oscura con borde neón */
export const Card: React.FC<{ title: string; sub: string; value: string; note?: string; color: string; width?: number }> = ({
  title,
  sub,
  value,
  note,
  color,
  width = 880,
}) => (
  <div style={{ width, padding: "26px 40px", borderRadius: 28, background: PANEL, border: `6px solid ${color}`, boxShadow: `0 0 40px ${color}66`, boxSizing: "border-box" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
      <div>
        <Label size={44}>{title}</Label>
        <Label size={30} color={color}>{sub}</Label>
      </div>
      <Big size={86} color={color}>{value}</Big>
    </div>
    {note && <Label size={30} style={{ marginTop: 10, opacity: 0.7, textTransform: "none", fontWeight: 800, whiteSpace: "normal" }}>{note}</Label>}
  </div>
);

/** barra horizontal con ícono, nombre y valor */
export const BarH: React.FC<{ top: number; w: number; grow: number; color: string; name: string; sub: string; value: string; icon?: React.ReactNode }> = ({
  top,
  w,
  grow,
  color,
  name,
  sub,
  value,
  icon,
}) => (
  <div style={{ position: "absolute", top, left: 80, right: 80 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      {icon}
      <div>
        <Label size={50}>{name}</Label>
        <Label size={32} style={{ opacity: 0.75 }}>{sub}</Label>
      </div>
    </div>
    <div style={{ marginTop: 16, height: 86, width: Math.max(0, w * grow), background: `linear-gradient(90deg, ${color}55, ${color})`, borderRadius: 16, boxShadow: `0 0 40px ${color}88`, position: "relative" }}>
      <div style={{ position: "absolute", right: 18, top: 6, opacity: grow > 0.5 ? 1 : 0 }}>
        <Big size={74} color="white" style={{ textShadow: "0 4px 0 #000" }}>{value}</Big>
      </div>
    </div>
  </div>
);

/** botón de encuesta para el cierre */
export const OptionBtn: React.FC<{ text: string; color: string; icon: React.ReactNode; pct: number }> = ({ text, color, icon, pct }) => (
  <div style={{ width: 880, height: 150, borderRadius: 75, background: "rgba(22,16,42,0.95)", border: `6px solid ${color}`, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", padding: "0 40px", gap: 26, boxShadow: `0 0 40px ${color}55`, boxSizing: "border-box" }}>
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`, background: `${color}44` }} />
    <div style={{ position: "relative" }}>{icon}</div>
    <Label size={54} style={{ position: "relative" }}>{text}</Label>
  </div>
);

/* ---------- fondo animado (símbolo flotante configurable) ---------- */
export const Background: React.FC<{ total: number; symbol?: string; symbolColor?: string; hue?: [number, number] }> = ({
  total,
  symbol = "$",
  symbolColor = GREEN,
  hue = [270, 320],
}) => {
  const f = useCurrentFrame();
  const h = interpolate(f, [0, total], hue);
  return (
    <AbsoluteFill style={{ backgroundColor: BG, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% ${38 + Math.sin(f / 40) * 6}%, hsla(${h},90%,35%,0.55) 0%, transparent 55%),
                       radial-gradient(circle at ${20 + Math.cos(f / 55) * 10}% 85%, ${symbolColor}2e 0%, transparent 45%)`,
        }}
      />
      <AbsoluteFill style={{ perspective: 600, top: 1100 }}>
        <div
          style={{
            position: "absolute",
            left: -1000,
            right: -1000,
            height: 1600,
            transform: "rotateX(70deg)",
            transformOrigin: "50% 0%",
            backgroundImage: `linear-gradient(${PINK}55 3px, transparent 3px), linear-gradient(90deg, ${PINK}55 3px, transparent 3px)`,
            backgroundSize: "120px 120px",
            backgroundPosition: `0px ${(f * 4) % 120}px`,
            maskImage: "linear-gradient(to bottom, transparent, black 30%)",
          }}
        />
      </AbsoluteFill>
      {Array.from({ length: 16 }).map((_, i) => {
        const x = random(`x${i}`) * 1080;
        const speed = 1 + random(`s${i}`) * 2.5;
        const y = 2100 - ((random(`y${i}`) * 2200 + f * speed) % 2300);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              fontFamily: numFont,
              fontSize: 60 + random(`z${i}`) * 90,
              color: symbolColor,
              opacity: 0.08 + random(`o${i}`) * 0.08,
              transform: `rotate(${Math.sin(f / 20 + i) * 20}deg)`,
            }}
          >
            {symbol}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const Overlay: React.FC<{ total: number }> = ({ total }) => {
  const f = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 2px, transparent 2px, transparent 5px)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.75) 100%)" }} />
      <div style={{ position: "absolute", top: 0, left: 0, height: 14, width: `${(f / total) * 100}%`, background: `linear-gradient(90deg, ${PINK}, ${GREEN})`, boxShadow: `0 0 20px ${GREEN}` }} />
    </>
  );
};

/** entrada con zoom-punch + sacudidas en los golpes */
export const Cam: React.FC<{ dur: number; hits: number[]; children: React.ReactNode }> = ({ dur, hits, children }) => {
  const f = useCurrentFrame();
  const enter = spring({ frame: f, fps: FPS, config: { damping: 15, mass: 0.7 } });
  const shake = hits.reduce((a, h) => a + (f >= h ? Math.exp(-(f - h) / 5) : 0), 0) * 22;
  const drift = interpolate(f, [0, dur], [1, 1.06]);
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${Math.sin(f * 2.7) * shake}px, ${Math.cos(f * 3.3) * shake}px) scale(${drift * interpolate(enter, [0, 1], [1.3, 1])}) rotate(${interpolate(enter, [0, 1], [-3, 0])}deg)`,
        filter: `blur(${interpolate(enter, [0, 1], [10, 0])}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const Flash: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "white", opacity: interpolate(f, [0, 5], [0.85, 0], clamp) }} />;
};

/** subtítulos palabra por palabra; las cifras y MAYÚSCULAS van en verde */
export const Captions: React.FC<{ words: Word[] }> = ({ words: ts }) => {
  const f = useCurrentFrame();
  const chunks: Word[][] = [];
  let cur: Word[] = [];
  ts.forEach((t) => {
    cur.push(t);
    if (cur.length >= 3 || /[.,:?!]$/.test(t.w)) {
      chunks.push(cur);
      cur = [];
    }
  });
  if (cur.length) chunks.push(cur);
  const chunk = chunks.find((c) => f < c[c.length - 1].end + 2) ?? chunks[chunks.length - 1];
  if (f < chunk[0].start - 2) return null;
  const pop = spring({ frame: f - chunk[0].start + 2, fps: FPS, config: { damping: 11, mass: 0.45 } });
  return (
    <div
      style={{
        position: "absolute",
        top: CAPTION_TOP,
        left: 60,
        right: 60,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 40px",
        transform: `scale(${interpolate(pop, [0, 1], [0.7, 1])}) translateY(${interpolate(pop, [0, 1], [40, 0])}px)`,
      }}
    >
      {chunk.map((t, i) => {
        const active = f >= t.start && f < t.end + 2;
        return (
          <span
            key={i}
            style={{
              fontFamily: bodyFont,
              fontWeight: 900,
              fontSize: t.key ? 104 : 88,
              lineHeight: 1.2,
              textTransform: "uppercase",
              color: t.key ? GREEN : active ? YELLOW : "white",
              WebkitTextStroke: "16px #000",
              paintOrder: "stroke fill",
              transform: `scale(${active ? 1.12 : 1}) rotate(${active ? -3 : 0}deg)`,
              display: "inline-block",
              textShadow: t.key ? `0 0 30px ${GREEN}88, 0 10px 0 #000` : "0 10px 0 #000",
            }}
          >
            {t.w}
          </span>
        );
      })}
    </div>
  );
};

/** escena "¡OJO!" con glitch: úsala en el giro final de cada video */
export const useGlitch = (moments: number[], len = 9) => {
  const f = useCurrentFrame();
  const on = moments.some((m) => f >= m && f < m + len);
  return {
    on,
    style: on ? { transform: `translateX(${(random(`g${f}`) - 0.5) * 40}px)`, filter: `hue-rotate(${random(`h${f}`) * 180}deg)` } : {},
    bar: on ? (
      <AbsoluteFill
        style={{
          background: `linear-gradient(0deg, transparent ${random(`a${f}`) * 80}%, ${PINK}55 ${random(`a${f}`) * 80 + 3}%, transparent ${random(`a${f}`) * 80 + 6}%)`,
          mixBlendMode: "screen",
        }}
      />
    ) : null,
  };
};
