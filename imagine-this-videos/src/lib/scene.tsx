import React from "react";
import { AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Fredoka";

export const { fontFamily: FONT } = loadFont("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });
export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const INK = "#1a1030";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.45, 0, 0.25, 1);

/** cámara: interpola zoom y desplazamiento a lo largo de la escena */
export const Cam: React.FC<{ dur: number; from?: [number, number, number]; to?: [number, number, number]; children: React.ReactNode }> = ({
  dur,
  from = [1, 0, 0],
  to = [1.08, 0, 0],
  children,
}) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [0, dur], [0, 1], { ...clamp, easing: ease });
  const z = from[0] + (to[0] - from[0]) * k;
  const x = from[1] + (to[1] - from[1]) * k;
  const y = from[2] + (to[2] - from[2]) * k;
  return <AbsoluteFill style={{ transform: `scale(${z}) translate(${x}px, ${y}px)`, transformOrigin: "50% 55%" }}>{children}</AbsoluteFill>;
};

/** capa con profundidad: desenfoque + parallax horizontal según el avance de la escena */
export const Layer: React.FC<{ blur?: number; px?: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ blur = 0, px = 0, dur = 300, children, style }) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, dur], [0, px], clamp);
  return <AbsoluteFill style={{ filter: blur ? `blur(${blur}px)` : undefined, transform: `translateX(${x}px)`, ...style }}>{children}</AbsoluteFill>;
};

/** fundido a negro al entrar y salir */
export const Fade: React.FC<{ dur: number; inF?: number; outF?: number }> = ({ dur, inF = 10, outF = 10 }) => {
  const f = useCurrentFrame();
  const o = Math.max(interpolate(f, [0, inF], [1, 0], clamp), interpolate(f, [dur - outF, dur], [0, 1], clamp));
  return <AbsoluteFill style={{ background: "#05030c", opacity: o, pointerEvents: "none" }} />;
};

/** viñeta + grano suave */
export const Grade: React.FC<{ tint?: string; vignette?: number }> = ({ tint, vignette = 0.6 }) => (
  <>
    {tint && <AbsoluteFill style={{ background: tint, mixBlendMode: "soft-light" }} />}
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(5,3,12,${vignette}) 100%)` }} />
  </>
);

/** etiqueta tipo "EYES": aparece con un pequeño rebote, opcionalmente con línea hacia un punto */
export const Label: React.FC<{ at: number; x: number; y: number; text: string; size?: number; color?: string; to?: [number, number]; out?: number }> = ({
  at,
  x,
  y,
  text,
  size = 44,
  color = "#fff",
  to,
  out,
}) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - at, fps: FPS, config: { damping: 12, mass: 0.5 } });
  const o = out !== undefined ? interpolate(f, [out, out + 8], [1, 0], clamp) : 1;
  if (f < at) return null;
  return (
    <>
      {to && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: o }} width={W} height={H}>
          <line x1={x} y1={y + size * 0.5} x2={x + (to[0] - x) * s} y2={y + size * 0.5 + (to[1] - y - size * 0.5) * s} stroke={color} strokeWidth={3} strokeDasharray="8 8" />
          <circle cx={to[0]} cy={to[1]} r={7 * s} fill={color} />
        </svg>
      )}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: `translate(-50%, 0) scale(${0.6 + 0.4 * s})`,
          opacity: Math.min(1, s * 2) * o,
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: size,
          letterSpacing: size * 0.08,
          color,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          textShadow: "0 4px 18px rgba(0,0,0,.6)",
        }}
      >
        {text}
      </div>
    </>
  );
};

/** título grande con contorno */
export const Title: React.FC<{ at: number; x: number; y: number; text: string; size?: number; color?: string; out?: number; rotate?: number }> = ({
  at,
  x,
  y,
  text,
  size = 140,
  color = "#fff",
  out,
  rotate = -3,
}) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - at, fps: FPS, config: { damping: 10, mass: 0.6 } });
  const o = out !== undefined ? interpolate(f, [out, out + 8], [1, 0], clamp) : 1;
  if (f < at) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${interpolate(s, [0, 1], [1.6, 1])}) rotate(${rotate}deg)`,
        opacity: Math.min(1, s * 2) * o,
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: size,
        color,
        whiteSpace: "nowrap",
        WebkitTextStroke: `${size / 10}px ${INK}`,
        paintOrder: "stroke fill",
        textShadow: `0 ${size / 14}px 0 ${INK}, 0 0 40px rgba(0,0,0,.5)`,
      }}
    >
      {text}
    </div>
  );
};

/** polvo flotante iluminado */
export const Dust: React.FC<{ n?: number; color?: string; seed?: string }> = ({ n = 40, color = "#fff3d6", seed = "d" }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: n }).map((_, i) => {
        const x = random(`${seed}x${i}`) * W + Math.sin(f / 40 + i) * 20;
        const y = (random(`${seed}y${i}`) * H - f * (0.2 + random(`${seed}v${i}`) * 0.5) + H) % H;
        const r = 1.5 + random(`${seed}r${i}`) * 3;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: r * 2, height: r * 2, borderRadius: "50%", background: color, opacity: 0.25 + 0.35 * Math.sin(f / 15 + i) ** 2, boxShadow: `0 0 ${r * 4}px ${color}` }} />;
      })}
    </AbsoluteFill>
  );
};

export const Rain: React.FC<{ n?: number; opacity?: number; slow?: number }> = ({ n = 140, opacity = 0.35, slow = 1 }) => {
  const f = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      {Array.from({ length: n }).map((_, i) => {
        const x = random(`rx${i}`) * (W + 300);
        const y = ((random(`ry${i}`) * H + f * 38 * slow) % (H + 100)) - 50;
        return <line key={i} x1={x - y * 0.15} y1={y} x2={x - y * 0.15 - 6} y2={y + 34} stroke="#cfe6ff" strokeWidth={2} opacity={opacity} />;
      })}
    </svg>
  );
};

export const Stars: React.FC<{ n?: number; h?: number }> = ({ n = 120, h = H }) => {
  const f = useCurrentFrame();
  return (
    <svg width={W} height={h} style={{ position: "absolute", left: 0, top: 0 }}>
      {Array.from({ length: n }).map((_, i) => (
        <circle key={i} cx={random(`sx${i}`) * W} cy={random(`sy${i}`) * h} r={0.8 + random(`sr${i}`) * 2} fill="#fff" opacity={0.3 + 0.6 * Math.abs(Math.sin(f / 30 + i))} />
      ))}
    </svg>
  );
};

/** cielo con degradado + sol/luna con halo */
export const Sky: React.FC<{ stops: string[]; sun?: { x: number; y: number; r: number; color: string } }> = ({ stops, sun }) => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${stops.join(",")})` }}>
    {sun && (
      <>
        <div style={{ position: "absolute", left: sun.x - sun.r * 5, top: sun.y - sun.r * 5, width: sun.r * 10, height: sun.r * 10, borderRadius: "50%", background: `radial-gradient(circle, ${sun.color}88, transparent 60%)` }} />
        <div style={{ position: "absolute", left: sun.x - sun.r, top: sun.y - sun.r, width: sun.r * 2, height: sun.r * 2, borderRadius: "50%", background: sun.color, boxShadow: `0 0 80px ${sun.color}` }} />
      </>
    )}
  </AbsoluteFill>
);

/** silueta de ciudad procedural */
export const City: React.FC<{ base: number; color: string; seed: string; h?: [number, number]; windows?: string; x0?: number; x1?: number }> = ({
  base,
  color,
  seed,
  h = [120, 380],
  windows,
  x0 = -200,
  x1 = W + 200,
}) => {
  const items: React.ReactNode[] = [];
  let x = x0;
  let i = 0;
  while (x < x1) {
    const w = 60 + random(`${seed}w${i}`) * 110;
    const hh = h[0] + random(`${seed}h${i}`) * (h[1] - h[0]);
    items.push(<rect key={`b${i}`} x={x} y={base - hh} width={w} height={hh + 400} fill={color} />);
    if (random(`${seed}t${i}`) > 0.75) items.push(<rect key={`t${i}`} x={x + w / 2 - 3} y={base - hh - 50} width={6} height={50} fill={color} />);
    if (windows)
      for (let r = 0; r < hh / 36; r++)
        for (let c = 0; c < w / 26 - 1; c++)
          if (random(`${seed}${i}-${r}-${c}`) > 0.72) items.push(<rect key={`w${i}-${r}-${c}`} x={x + 10 + c * 24} y={base - hh + 16 + r * 36} width={10} height={16} fill={windows} opacity={0.85} />);
    x += w + 4 + random(`${seed}g${i}`) * 18;
    i++;
  }
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {items}
    </svg>
  );
};

/** rayos de luz */
export const Rays: React.FC<{ x: number; y: number; color?: string; opacity?: number }> = ({ x, y, color = "#ffe2a8", opacity = 0.12 }) => {
  const f = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      <g transform={`rotate(${f * 0.05} ${x} ${y})`}>
        {Array.from({ length: 14 }).map((_, i) => {
          const a = (i / 14) * Math.PI * 2;
          const b = a + 0.09;
          return <path key={i} d={`M${x} ${y} L${x + Math.cos(a) * 2400} ${y + Math.sin(a) * 2400} L${x + Math.cos(b) * 2400} ${y + Math.sin(b) * 2400}Z`} fill={color} opacity={opacity} />;
        })}
      </g>
    </svg>
  );
};

/** helper: valor animado 0→1 entre dos frames */
export const prog = (f: number, a: number, b: number, e = ease) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: e });
export const pop = (f: number, at: number) => spring({ frame: f - at, fps: FPS, config: { damping: 11, mass: 0.5 } });
