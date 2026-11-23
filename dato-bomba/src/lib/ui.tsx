import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame } from "remotion";
import { clamp, FPS, Word } from "./engine";
import { useTheme } from "./theme";

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

/** cifra / título grande */
export const Big: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({ children, size = 150, color, style }) => {
  const t = useTheme();
  const c = color ?? t.key;
  return (
    <div
      style={{
        fontFamily: t.num,
        fontWeight: 900,
        fontSize: size,
        color: c,
        lineHeight: 1,
        whiteSpace: "nowrap",
        textShadow: `0 0 30px ${c}99, 0 8px 0 rgba(0,0,0,0.8)`,
        WebkitTextStroke: `4px ${t.bg}`,
        paintOrder: "stroke fill",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Label: React.FC<{ children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }> = ({ children, color, size = 46, style }) => {
  const t = useTheme();
  return (
    <div style={{ fontFamily: t.body, fontWeight: 800, fontSize: size, color: color ?? t.text, textTransform: "uppercase", whiteSpace: "nowrap", letterSpacing: 1, ...style }}>
      {children}
    </div>
  );
};

export const Stamp: React.FC<{ children: React.ReactNode; color?: string; size?: number; rotate?: number }> = ({ children, color, size = 120, rotate = -8 }) => {
  const t = useTheme();
  const c = color ?? t.accent;
  return (
    <div
      style={{
        fontFamily: t.num,
        fontWeight: 900,
        fontSize: size,
        color: "white",
        background: c,
        padding: "4px 36px",
        borderRadius: t.radius,
        transform: `rotate(${rotate}deg)`,
        boxShadow: `0 0 50px ${c}, 0 12px 0 rgba(0,0,0,0.6)`,
        border: `6px solid ${t.text}`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

/** tarjeta oscura con borde de color */
export const Card: React.FC<{ title: string; sub: string; value: string; note?: string; color: string; width?: number }> = ({ title, sub, value, note, color, width = 880 }) => {
  const t = useTheme();
  return (
    <div style={{ width, padding: "26px 40px", borderRadius: t.radius + 4, background: t.panel, border: `6px solid ${color}`, boxShadow: `0 0 40px ${color}66`, boxSizing: "border-box" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
        <div>
          <Label size={44}>{title}</Label>
          <Label size={30} color={color}>{sub}</Label>
        </div>
        <Big size={80} color={color}>{value}</Big>
      </div>
      {note && <Label size={30} style={{ marginTop: 10, opacity: 0.75, textTransform: "none", whiteSpace: "normal" }}>{note}</Label>}
    </div>
  );
};

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
        {sub && <Label size={32} style={{ opacity: 0.75 }}>{sub}</Label>}
      </div>
    </div>
    <div style={{ marginTop: 16, height: 86, width: Math.max(0, w * grow), background: `linear-gradient(90deg, ${color}55, ${color})`, borderRadius: 12, boxShadow: `0 0 40px ${color}88`, position: "relative" }}>
      <div style={{ position: "absolute", right: 18, top: 10, opacity: grow > 0.5 ? 1 : 0 }}>
        <Big size={66} color="white" style={{ textShadow: "0 4px 0 #000" }}>{value}</Big>
      </div>
    </div>
  </div>
);

/** botón de encuesta para el cierre */
export const OptionBtn: React.FC<{ text: string; color: string; icon: React.ReactNode; pct: number }> = ({ text, color, icon, pct }) => {
  const t = useTheme();
  return (
    <div style={{ width: 880, height: 150, borderRadius: 75, background: t.panel, border: `6px solid ${color}`, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", padding: "0 40px", gap: 26, boxShadow: `0 0 40px ${color}55`, boxSizing: "border-box" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`, background: `${color}44` }} />
      <div style={{ position: "relative" }}>{icon}</div>
      <Label size={54} style={{ position: "relative" }}>{text}</Label>
    </div>
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
  const t = useTheme();
  return <AbsoluteFill style={{ background: t.flash, opacity: interpolate(f, [0, 5], [0.8, 0], clamp) }} />;
};

/** subtítulos palabra por palabra; las cifras y MAYÚSCULAS van con el color clave del tema */
export const Captions: React.FC<{ words: Word[] }> = ({ words: ts }) => {
  const f = useCurrentFrame();
  const t = useTheme();
  const chunks: Word[][] = [];
  let cur: Word[] = [];
  ts.forEach((w) => {
    cur.push(w);
    if (cur.length >= 3 || /[.,:?!]$/.test(w.w)) {
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
      {chunk.map((w, i) => {
        const active = f >= w.start && f < w.end + 2;
        return (
          <span
            key={i}
            style={{
              fontFamily: t.caption,
              fontWeight: t.captionWeight,
              fontSize: w.key ? 104 : 90,
              lineHeight: 1.2,
              textTransform: "uppercase",
              color: w.key ? t.key : active ? t.highlight : t.text,
              WebkitTextStroke: `16px ${t.stroke}`,
              paintOrder: "stroke fill",
              transform: `scale(${active ? 1.12 : 1}) rotate(${active ? -3 : 0}deg)`,
              display: "inline-block",
              textShadow: w.key ? `0 0 30px ${t.key}88, 0 10px 0 ${t.stroke}` : `0 10px 0 ${t.stroke}`,
            }}
          >
            {w.w}
          </span>
        );
      })}
    </div>
  );
};

/** glitch para el giro "¡OJO!" */
export const useGlitch = (moments: number[], len = 9) => {
  const f = useCurrentFrame();
  const t = useTheme();
  const on = moments.some((m) => f >= m && f < m + len);
  return {
    on,
    style: on ? { transform: `translateX(${(random(`g${f}`) - 0.5) * 40}px)`, filter: `hue-rotate(${random(`h${f}`) * 180}deg)` } : {},
    bar: on ? (
      <AbsoluteFill
        style={{
          background: `linear-gradient(0deg, transparent ${random(`a${f}`) * 80}%, ${t.accent}55 ${random(`a${f}`) * 80 + 3}%, transparent ${random(`a${f}`) * 80 + 6}%)`,
          mixBlendMode: "screen",
        }}
      />
    ) : null,
  };
};
