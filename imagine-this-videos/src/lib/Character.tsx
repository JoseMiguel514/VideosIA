import React from "react";
import { useCurrentFrame } from "remotion";

/* Personaje animado de "Imagine This" (diseño original: cabeza-galaxia, anillo planetario, sudadera turquesa).
   Origen = punto entre los pies. Altura total ≈ 580 px con scale=1. */

export type Expr = "neutral" | "deadpan" | "wide" | "happy" | "sad" | "smirk" | "focus";
export type Mouth = "smile" | "flat" | "open" | "o" | "frown" | "grin";
export type Arm = { s: number; e: number }; // ángulos en grados: hombro y codo (0 = recto hacia abajo, positivo = hacia afuera/adelante)

export const POSES: Record<string, { l: Arm; r: Arm }> = {
  down: { l: { s: 8, e: 4 }, r: { s: 8, e: 4 } },
  chin: { l: { s: 8, e: 4 }, r: { s: 30, e: 145 } },
  raise: { l: { s: 8, e: 4 }, r: { s: 160, e: 10 } },
  wave: { l: { s: 8, e: 4 }, r: { s: 130, e: 40 } },
  shrug: { l: { s: 55, e: -95 }, r: { s: 55, e: -95 } },
  hold: { l: { s: 25, e: 85 }, r: { s: 25, e: 85 } },
  point: { l: { s: 8, e: 4 }, r: { s: 85, e: 5 } },
  explain: { l: { s: 30, e: 70 }, r: { s: 70, e: 40 } },
  hips: { l: { s: 40, e: -110 }, r: { s: 40, e: -110 } },
};

const INK = "#1a1030";

const Eye: React.FC<{ x: number; y: number; expr: Expr; look: [number, number]; blink: number; side: 1 | -1; head: string }> = ({ x, y, expr, look, blink, side, head }) => {
  const rx = expr === "wide" ? 22 : 19;
  const ry = (expr === "wide" ? 29 : 24) * blink;
  const lid = expr === "deadpan" ? 0.05 : expr === "focus" ? 0.35 : null;
  const cid = `lid${Math.round(x)}${expr}`;
  if (expr === "happy") return <path d={`M${x - 15} ${y + 4} q15 -18 30 0`} stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" />;
  const pr = expr === "wide" ? 7 : 9;
  const lidY = lid !== null ? y - ry * (lid === 0.05 ? -0.05 : 0.3) : y - ry - 4;
  return (
    <g>
      <defs>
        <clipPath id={cid}>
          <rect x={x - rx - 4} y={lidY} width={rx * 2 + 8} height={ry * 2 + 8} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${cid})`}>
        <ellipse cx={x} cy={y} rx={rx} ry={Math.max(ry, 1.5)} fill="#fff" />
        {blink > 0.4 && <circle cx={x + look[0] * 7} cy={y + look[1] * 8} r={pr} fill={INK} />}
        {blink > 0.4 && <circle cx={x + look[0] * 7 + 3} cy={y + look[1] * 8 - 3} r={2.5} fill="#fff" />}
      </g>
      {lid !== null && blink > 0.4 && <line x1={x - rx - 2} y1={lidY} x2={x + rx + 2} y2={lidY} stroke="#fff" strokeWidth={5} strokeLinecap="round" />}
      {expr === "sad" && <path d={`M${x - 16} ${y - 22 - side * 0} l32 ${side * 8}`} stroke="#fff" strokeWidth={5} strokeLinecap="round" />}
    </g>
  );
};

const limb = (sx: number, sy: number, a: Arm, side: 1 | -1, L1: number, L2: number) => {
  const r1 = ((a.s * side) * Math.PI) / 180;
  const ex = sx + Math.sin(r1) * L1;
  const ey = sy + Math.cos(r1) * L1;
  const r2 = (((a.s + a.e) * side) * Math.PI) / 180;
  const hx = ex + Math.sin(r2) * L2;
  const hy = ey + Math.cos(r2) * L2;
  return { ex, ey, hx, hy };
};

export const Character: React.FC<{
  x: number;
  y: number;
  scale?: number;
  expr?: Expr;
  mouth?: Mouth;
  look?: [number, number];
  pose?: keyof typeof POSES | { l: Arm; r: Arm };
  talking?: boolean;
  walk?: number; // velocidad de caminata (0 = quieto)
  flip?: boolean;
  galaxy?: boolean; // protagonista (cabeza-galaxia + anillo)
  head?: string; // color de cabeza para NPC
  hoodie?: string;
  pants?: string;
  hair?: "none" | "messy" | "bun" | "cap";
  glow?: number; // brillo de la cabeza (0..1)
  glasses?: boolean; // gafas oscuras (agentes)
  seed?: number;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({
  x,
  y,
  scale = 1,
  expr = "neutral",
  mouth = "smile",
  look = [0, 0],
  pose = "down",
  talking = false,
  walk = 0,
  flip = false,
  galaxy = true,
  head = "#2b2d3a",
  hoodie = "#22c3b6",
  pants = "#232a3d",
  hair = "none",
  glow = 0,
  glasses = false,
  seed = 0,
  opacity = 1,
  style,
}) => {
  const f = useCurrentFrame() + seed * 37;
  const p = typeof pose === "string" ? POSES[pose] : pose;
  // parpadeo cada ~3.3 s
  const bp = f % 100;
  const blink = bp < 3 ? [1, 0.3, 0.1][bp] : bp < 6 ? [0.1, 0.4, 1][bp - 3] : 1;
  const breathe = Math.sin(f / 22) * 3;
  const step = walk ? Math.sin((f * walk) / 4) : 0;
  const bob = walk ? Math.abs(Math.cos((f * walk) / 4)) * -8 : breathe;
  const hoodDark = shade(hoodie, -0.25);
  const headFill = galaxy ? "url(#galHead)" : head;
  const lidColor = galaxy ? "#24195e" : head;
  // brazos
  const shY = -372 + bob;
  const la = limb(-56, shY, p.l, -1, 92, 88);
  const ra = limb(56, shY, p.r, 1, 92, 88);
  const legA = step * 22;
  const mouthOpen = talking ? (Math.sin(f / 2.2) > 0 ? 1 : 0.35) : 0;
  const mY = -458 + bob;
  const ringA = (f / 40) % (Math.PI * 2);
  const moonX = Math.cos(ringA) * 118;
  const moonY = Math.sin(ringA) * 26;
  const moonFront = Math.sin(ringA) > 0;

  const Moon = () => (
    <g transform={`translate(${moonX} ${-404 + bob + moonY}) rotate(-8)`}>
      <circle r={11} fill="#f3ead2" stroke={INK} strokeWidth={3} />
      <circle cx={-3} cy={-2} r={3} fill="#cbbca4" />
    </g>
  );

  return (
    <svg
      width={600}
      height={760}
      viewBox="-300 -700 600 760"
      style={{
        position: "absolute",
        left: x - 300 * scale,
        top: y - 700 * scale,
        width: 600 * scale,
        height: 760 * scale,
        overflow: "visible",
        transform: flip ? "scaleX(-1)" : undefined,
        opacity,
        ...style,
      }}
    >
      <defs>
        <radialGradient id="galHead" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#4a35a8" />
          <stop offset=".55" stopColor="#21165e" />
          <stop offset="1" stopColor="#0c0830" />
        </radialGradient>
        <radialGradient id="nebP" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ff4fa3" stopOpacity=".65" />
          <stop offset="1" stopColor="#ff4fa3" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="nebT" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#22d3c5" stopOpacity=".55" />
          <stop offset="1" stopColor="#22d3c5" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="headGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffd36b" stopOpacity=".8" />
          <stop offset="1" stopColor="#ffd36b" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`hclip${seed}`}>
          <circle cx={0} cy={-500 + bob} r={96} />
        </clipPath>
      </defs>

      {/* sombra en el piso */}
      <ellipse cx={0} cy={6} rx={70} ry={12} fill="#000" opacity={0.25} />

      {/* piernas */}
      {[-1, 1].map((sd) => {
        const a = ((sd * legA) * Math.PI) / 180;
        const hx = sd * 24;
        const hy = -195 + bob;
        const fx = hx + Math.sin(a) * 195;
        const fy = hy + Math.cos(a) * 195;
        return (
          <g key={sd}>
            <line x1={hx} y1={hy} x2={fx} y2={fy} stroke={INK} strokeWidth={34} strokeLinecap="round" />
            <line x1={hx} y1={hy} x2={fx} y2={fy} stroke={pants} strokeWidth={26} strokeLinecap="round" />
            <ellipse cx={fx + 10} cy={fy + 2} rx={24} ry={12} fill="#f2f2f2" stroke={INK} strokeWidth={4} />
          </g>
        );
      })}

      {/* brazo trasero (izquierdo) */}
      <path d={`M-56 ${shY} L${la.ex} ${la.ey} L${la.hx} ${la.hy}`} stroke={INK} strokeWidth={32} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M-56 ${shY} L${la.ex} ${la.ey} L${la.hx} ${la.hy}`} stroke={hoodDark} strokeWidth={24} fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* anillo: mitad trasera */}
      {galaxy && (
        <ellipse cx={0} cy={-404 + bob} rx={118} ry={26} fill="none" stroke="#c99a35" strokeWidth={7} transform={`rotate(-8 0 ${-404 + bob})`} />
      )}
      {galaxy && !moonFront && <Moon />}

      {/* torso: sudadera */}
      <path
        d={`M-62 ${-392 + bob} q-20 10 -22 60 l-8 130 q0 14 14 14 h156 q14 0 14 -14 l-8 -130 q-2 -50 -22 -60 q-62 -22 -124 0z`}
        fill={hoodie}
        stroke={INK}
        strokeWidth={6}
      />
      <path d={`M-40 ${-392 + bob} q40 30 80 0`} fill={hoodDark} stroke={INK} strokeWidth={4} />
      <path d={`M-16 ${-372 + bob} l-4 46 M16 ${-372 + bob} l4 46`} stroke="#fff" strokeWidth={4} strokeLinecap="round" />
      <rect x={-48} y={-262 + bob} width={96} height={40} rx={10} fill={hoodDark} opacity={0.7} />
      {galaxy && (
        <g transform={`translate(0 ${-300 + bob}) rotate(-6)`}>
          <rect x={-20} y={-20} width={40} height={40} rx={10} fill="#ff8a3d" stroke={INK} strokeWidth={3} />
          <text x={0} y={13} fontSize={34} fontWeight={700} textAnchor="middle" fill="#fff" fontFamily="Fredoka">
            ?
          </text>
        </g>
      )}

      {/* cuello delgado */}
      <rect x={-9} y={-418 + bob} width={18} height={34} rx={6} fill={galaxy ? "#140d40" : head} stroke={INK} strokeWidth={3} />

      {/* brillo de "cerebro activo" */}
      {glow > 0 && <circle cx={0} cy={-500 + bob} r={170} fill="url(#headGlow)" opacity={glow} />}

      {/* cabeza */}
      <circle cx={0} cy={-500 + bob} r={96} fill={headFill} stroke={INK} strokeWidth={6} />
      {galaxy && (
        <g clipPath={`url(#hclip${seed})`}>
          <ellipse cx={-36} cy={-540 + bob} rx={74} ry={44} fill="url(#nebP)" />
          <ellipse cx={40} cy={-458 + bob} rx={78} ry={46} fill="url(#nebT)" />
          {Array.from({ length: 16 }).map((_, i) => {
            const a = i * 2.39;
            const d = 12 + ((i * 29) % 78);
            const tw = 0.5 + 0.5 * Math.sin(f / 8 + i);
            return <circle key={i} cx={Math.cos(a) * d} cy={-500 + bob + Math.sin(a) * d} r={1 + (i % 3)} fill="#fff" opacity={0.3 + tw * 0.6} />;
          })}
        </g>
      )}
      {/* pelo / accesorio NPC */}
      {hair === "messy" && <path d={`M-86 ${-536 + bob} q10 -56 50 -42 q10 -24 40 -12 q30 -16 44 18 q16 6 6 36 q-20 -24 -50 -20 q-30 -14 -50 4 q-20 -4 -40 16z`} fill="#e9e6ef" stroke={INK} strokeWidth={4} />}
      {hair === "bun" && <circle cx={0} cy={-604 + bob} r={28} fill={shade(head, -0.3)} stroke={INK} strokeWidth={4} />}
      {hair === "cap" && <path d={`M-92 ${-512 + bob} q4 -86 92 -88 q86 2 92 88 z M76 ${-517 + bob} h50 q6 6 -4 12 h-50z`} fill="#e2453a" stroke={INK} strokeWidth={4} />}

      {/* ojos */}
      <Eye x={-34} y={-508 + bob} expr={expr} look={look} blink={blink} side={-1} head={lidColor} />
      <Eye x={34} y={-508 + bob} expr={expr} look={look} blink={blink} side={1} head={lidColor} />
      {glasses && <path d={`M-62 ${-524 + bob} h124 v14 q0 30 -28 30 q-24 0 -30 -24 h-8 q-6 24 -30 24 q-28 0 -28 -30z`} fill="#0b0b10" stroke="#5a5a70" strokeWidth={3} />}
      {expr === "smirk" && <path d={`M18 ${-544 + bob} q18 -12 36 -2`} stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" />}
      {/* boca */}
      {mouthOpen > 0 ? (
        <ellipse cx={4} cy={mY} rx={12} ry={4 + 8 * mouthOpen} fill="#fff" />
      ) : mouth === "smile" ? (
        <path d={`M-14 ${mY - 2} q16 14 32 -2`} stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" />
      ) : mouth === "grin" ? (
        <path d={`M-20 ${mY - 6} q22 26 44 0 z`} fill="#fff" />
      ) : mouth === "open" ? (
        <ellipse cx={4} cy={mY} rx={12} ry={14} fill="#fff" />
      ) : mouth === "o" ? (
        <circle cx={4} cy={mY} r={7} fill="#fff" />
      ) : mouth === "frown" ? (
        <path d={`M-12 ${mY + 4} q16 -12 32 2`} stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" />
      ) : (
        <line x1={-10} y1={mY} x2={18} y2={mY} stroke="#fff" strokeWidth={5} strokeLinecap="round" />
      )}

      {/* anillo: mitad delantera */}
      {galaxy && (
        <path
          d={`M-118 ${-404 + bob} A118 26 0 0 0 118 ${-404 + bob}`}
          fill="none"
          stroke="#ffd36b"
          strokeWidth={7}
          strokeLinecap="round"
          transform={`rotate(-8 0 ${-404 + bob})`}
        />
      )}
      {galaxy && moonFront && <Moon />}

      {/* brazo delantero (derecho) */}
      <path d={`M56 ${shY} L${ra.ex} ${ra.ey} L${ra.hx} ${ra.hy}`} stroke={INK} strokeWidth={32} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M56 ${shY} L${ra.ex} ${ra.ey} L${ra.hx} ${ra.hy}`} stroke={hoodie} strokeWidth={24} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={la.hx} cy={la.hy} r={15} fill="#f2f2f2" stroke={INK} strokeWidth={4} />
      <circle cx={ra.hx} cy={ra.hy} r={15} fill="#f2f2f2" stroke={INK} strokeWidth={4} />
    </svg>
  );
};

/** aclara (+) u oscurece (-) un color hex */
export function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt));
  return `#${ch.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}
