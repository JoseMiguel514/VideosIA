import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { INK } from "./Characters";

export const W = 1080;
export const H = 1920;
const VP = { x: 540, y: 650 };
const BACK = { l: 170, r: 910, top: 250, floor: 1150 };

const px = (xBack: number, y: number) => xBack + ((xBack - VP.x) * (y - BACK.floor)) / (BACK.floor - VP.y);

/** Perspective checker floor */
export const Floor: React.FC<{ a: string; b: string; cols?: number; rows?: number; y0?: number }> = ({ a, b, cols = 8, rows = 9, y0 = BACK.floor }) => {
  const xs = Array.from({ length: cols + 9 }, (_, i) => BACK.l + ((BACK.r - BACK.l) / cols) * (i - 4));
  const ys = Array.from({ length: rows + 1 }, (_, i) => y0 + 1100 * Math.pow(i / rows, 1.7));
  const tiles: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < xs.length - 1; c++) {
      const y1 = ys[r];
      const y2 = ys[r + 1];
      const pts = `${px(xs[c], y1)},${y1} ${px(xs[c + 1], y1)},${y1} ${px(xs[c + 1], y2)},${y2} ${px(xs[c], y2)},${y2}`;
      tiles.push(<polygon key={`${r}-${c}`} points={pts} fill={(r + c) % 2 ? a : b} />);
    }
  return <g>{tiles}</g>;
};

/** A cartoon room in perspective (back wall + side walls + checker floor) */
export const Room: React.FC<{
  wall: string;
  side: string;
  floorA: string;
  floorB: string;
  trim?: string;
  stone?: boolean;
  children?: React.ReactNode;
}> = ({ wall, side, floorA, floorB, trim = "#5b3420", stone = false, children }) => {
  const leftWall = `0,0 ${BACK.l},${BACK.top} ${BACK.l},${BACK.floor} 0,${BACK.floor + 520}`;
  const rightWall = `${W},0 ${BACK.r},${BACK.top} ${BACK.r},${BACK.floor} ${W},${BACK.floor + 520}`;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <rect width={W} height={H} fill={wall} />
      <polygon points={`0,0 ${W},0 ${BACK.r},${BACK.top} ${BACK.l},${BACK.top}`} fill={side} opacity="0.7" />
      <rect x={BACK.l} y={BACK.top} width={BACK.r - BACK.l} height={BACK.floor - BACK.top} fill={wall} />
      <polygon points={leftWall} fill={side} />
      <polygon points={rightWall} fill={side} />
      {stone &&
        Array.from({ length: 14 }).map((_, r) =>
          Array.from({ length: 9 }).map((__, c) => (
            <rect
              key={`${r}-${c}`}
              x={BACK.l + c * 85 + (r % 2) * 42 - 42}
              y={BACK.top + r * 64}
              width="85"
              height="64"
              fill={random(`st${r}${c}`) > 0.6 ? "rgba(0,0,0,0.07)" : "none"}
              stroke="rgba(0,0,0,0.18)"
              strokeWidth="4"
            />
          )),
        )}
      {/* wainscot */}
      {!stone && (
        <g>
          <rect x={BACK.l} y={BACK.floor - 230} width={BACK.r - BACK.l} height="230" fill={trim} />
          <polygon points={`0,${BACK.floor - 230 + 230 * 0.0 - 270} ${BACK.l},${BACK.floor - 230} ${BACK.l},${BACK.floor} 0,${BACK.floor + 520}`} fill={trim} opacity="0.85" />
          <polygon points={`${W},${BACK.floor - 500} ${BACK.r},${BACK.floor - 230} ${BACK.r},${BACK.floor} ${W},${BACK.floor + 520}`} fill={trim} opacity="0.85" />
          <line x1={BACK.l} x2={BACK.r} y1={BACK.floor - 230} y2={BACK.floor - 230} stroke="#f2d9a0" strokeWidth="10" opacity="0.6" />
          <line x1={0} x2={BACK.l} y1={BACK.floor - 500} y2={BACK.floor - 230} stroke="#f2d9a0" strokeWidth="10" opacity="0.6" />
          <line x1={W} x2={BACK.r} y1={BACK.floor - 500} y2={BACK.floor - 230} stroke="#f2d9a0" strokeWidth="10" opacity="0.6" />
        </g>
      )}
      <Floor a={floorA} b={floorB} />
      <line x1={BACK.l} x2={BACK.r} y1={BACK.floor} y2={BACK.floor} stroke="rgba(0,0,0,0.35)" strokeWidth="8" />
      <line x1={BACK.l} y1={BACK.top} x2={BACK.l} y2={BACK.floor} stroke="rgba(0,0,0,0.25)" strokeWidth="6" />
      <line x1={BACK.r} y1={BACK.top} x2={BACK.r} y2={BACK.floor} stroke="rgba(0,0,0,0.25)" strokeWidth="6" />
      <defs>
        <radialGradient id="roomlight" cx="50%" cy="42%" r="65%">
          <stop offset="0" stopColor="white" stopOpacity="0.22" />
          <stop offset="0.45" stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="#0a1a22" stopOpacity="0.5" />
        </radialGradient>
        <linearGradient id="walltop" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#0a1a22" stopOpacity="0.45" />
          <stop offset="0.45" stopColor="#0a1a22" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width={W} height={BACK.floor} fill="url(#walltop)" />
      {children}
      <rect width={W} height={H} fill="url(#roomlight)" />
    </svg>
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)", pointerEvents: "none" }} />
);

/** Gothic window with light beams */
export const GothicWindow: React.FC<{ x: number; y: number; w?: number; h?: number; glass?: string[] }> = ({ x, y, w = 200, h = 380, glass = ["#5bc0eb", "#fde74c", "#c3423f", "#9bc53d"] }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <path d={`M${x} ${y + h} L${x} ${y + w / 2} Q${x} ${y} ${x + w / 2} ${y - w * 0.25} Q${x + w} ${y} ${x + w} ${y + w / 2} L${x + w} ${y + h} Z`} fill="#3a2b45" stroke={INK} strokeWidth="12" />
      {[0, 1].map((c) =>
        [0, 1, 2].map((r) => (
          <rect key={`${c}${r}`} x={x + 18 + c * ((w - 36) / 2)} y={y + w / 2 + r * ((h - w / 2 - 18) / 3)} width={(w - 36) / 2 - 8} height={(h - w / 2 - 18) / 3 - 8} fill={glass[(c + r) % glass.length]} opacity={0.75 + 0.2 * Math.sin(f / 20 + c + r)} />
        )),
      )}
      <circle cx={x + w / 2} cy={y + w * 0.22} r={w * 0.2} fill={glass[1]} stroke={INK} strokeWidth="8" />
      <polygon points={`${x},${y + h} ${x + w},${y + h} ${x + w + 220},${y + h + 900} ${x - 120},${y + h + 900}`} fill="#fff6c8" opacity={0.08 + 0.03 * Math.sin(f / 15)} />
    </g>
  );
};

export const Banner: React.FC<{ x: number; y: number; color: string; w?: number; h?: number }> = ({ x, y, color, w = 130, h = 330 }) => {
  const f = useCurrentFrame();
  const s = Math.sin(f / 18 + x) * 6;
  return (
    <g>
      <rect x={x - 15} y={y - 14} width={w + 30} height="16" rx="8" fill="#6b4423" stroke={INK} strokeWidth="6" />
      <path d={`M${x} ${y} L${x + w} ${y} L${x + w + s} ${y + h} L${x + w / 2 + s} ${y + h - 55} L${x + s} ${y + h} Z`} fill={color} stroke={INK} strokeWidth="8" strokeLinejoin="round" />
      <path d={`M${x + w / 2} ${y + 80} l0 120 M${x + w / 2 - 35} ${y + 130} q35 -60 70 0 M${x + w / 2 - 25} ${y + 175} l50 0`} stroke="#f3d27a" strokeWidth="12" fill="none" strokeLinecap="round" />
    </g>
  );
};

/** Torch on wall */
export const WallTorch: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const f = useCurrentFrame();
  const fl = 1 + Math.sin(f / 2.3) * 0.08 + Math.sin(f / 3.7) * 0.06;
  return (
    <g>
      <circle cx={x} cy={y - 40} r={150 * fl} fill="#ffcf6b" opacity="0.13" />
      <rect x={x - 10} y={y} width="20" height="80" fill="#6b4423" stroke={INK} strokeWidth="5" />
      <rect x={x - 22} y={y - 6} width="44" height="18" rx="4" fill="#59606a" stroke={INK} strokeWidth="5" />
      <g transform={`translate(${x} ${y - 5}) scale(${fl})`}>
        <path d="M-26 0 Q-30 -50 0 -90 Q30 -50 26 0 Z" fill="#ff8a2b" stroke={INK} strokeWidth="5" />
        <path d="M-12 0 Q-14 -30 0 -55 Q14 -30 12 0 Z" fill="#ffe36b" />
      </g>
    </g>
  );
};

/** Outdoor village street */
export const Village: React.FC<{ evening?: boolean; night?: boolean; children?: React.ReactNode }> = ({ evening = false, night = false, children }) => {
  const f = useCurrentFrame();
  const sky = night ? ["#0b1030", "#2a3570"] : evening ? ["#ff9a6b", "#ffd59e"] : ["#7cc6f2", "#d4f0ff"];
  const houses = [
    { x: -60, w: 330, h: 520, c: "#f4e4c1", r: "#b5523b" },
    { x: 250, w: 280, h: 430, c: "#efd9a8", r: "#7a4b8f" },
    { x: 520, w: 300, h: 560, c: "#f6ead0", r: "#3f7d5a" },
    { x: 800, w: 340, h: 470, c: "#ead2a0", r: "#b5523b" },
  ];
  const baseY = 1180;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={sky[0]} />
          <stop offset="1" stopColor={sky[1]} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#sky)" />
      {[0, 1, 2].map((i) => {
        const cx = ((i * 420 + f * (0.6 + i * 0.2)) % 1500) - 200;
        return (
          <g key={i} opacity="0.9">
            <ellipse cx={cx} cy={180 + i * 130} rx="120" ry="45" fill="white" />
            <ellipse cx={cx + 70} cy={160 + i * 130} rx="80" ry="50" fill="white" />
          </g>
        );
      })}
      {/* church tower in distance */}
      <rect x="470" y="330" width="120" height="400" fill="#c9b79a" stroke={INK} strokeWidth="8" />
      <polygon points="455,335 530,170 605,335" fill="#6a5a7a" stroke={INK} strokeWidth="8" />
      <line x1="530" y1="170" x2="530" y2="110" stroke={INK} strokeWidth="8" />
      <line x1="505" y1="135" x2="555" y2="135" stroke={INK} strokeWidth="8" />
      {houses.map((h, i) => (
        <g key={i}>
          <rect x={h.x} y={baseY - h.h} width={h.w} height={h.h} fill={h.c} stroke={INK} strokeWidth="10" />
          {/* timber frame */}
          <g stroke="#5b3420" strokeWidth="14">
            <line x1={h.x} x2={h.x + h.w} y1={baseY - h.h * 0.5} y2={baseY - h.h * 0.5} />
            <line x1={h.x + h.w * 0.33} x2={h.x + h.w * 0.33} y1={baseY - h.h} y2={baseY} />
            <line x1={h.x + h.w * 0.66} x2={h.x + h.w * 0.66} y1={baseY - h.h} y2={baseY} />
            <line x1={h.x} x2={h.x + h.w * 0.33} y1={baseY - h.h} y2={baseY - h.h * 0.5} />
            <line x1={h.x + h.w} x2={h.x + h.w * 0.66} y1={baseY - h.h} y2={baseY - h.h * 0.5} />
          </g>
          <polygon points={`${h.x - 30},${baseY - h.h} ${h.x + h.w / 2},${baseY - h.h - 200} ${h.x + h.w + 30},${baseY - h.h}`} fill={h.r} stroke={INK} strokeWidth="10" strokeLinejoin="round" />
          <rect x={h.x + h.w * 0.4} y={baseY - h.h * 0.42} width={h.w * 0.2} height={h.h * 0.17} fill={evening || night ? "#ffd56b" : "#3b4a66"} stroke={INK} strokeWidth="8" />
          <path d={`M${h.x + h.w * 0.08} ${baseY} L${h.x + h.w * 0.08} ${baseY - 150} Q${h.x + h.w * 0.18} ${baseY - 200} ${h.x + h.w * 0.28} ${baseY - 150} L${h.x + h.w * 0.28} ${baseY} Z`} fill="#7a4b26" stroke={INK} strokeWidth="8" />
        </g>
      ))}
      {/* cobblestone ground */}
      <rect x="0" y={baseY} width={W} height={H - baseY} fill="#b9a68a" />
      {Array.from({ length: 10 }).map((_, r) =>
        Array.from({ length: 12 }).map((__, c) => {
          const y = baseY + 20 + Math.pow(r / 10, 1.5) * 760;
          const s = 0.5 + r * 0.12;
          return <ellipse key={`${r}-${c}`} cx={(c * 100 + (r % 2) * 50) - 20} cy={y} rx={40 * s} ry={14 * s} fill="#a3906f" stroke="rgba(0,0,0,0.2)" strokeWidth="4" />;
        }),
      )}
      {night && <circle cx="820" cy="260" r="80" fill="#fdf3c8" opacity="0.95" />}
      <defs>
        <radialGradient id="vlight" cx="50%" cy="40%" r="70%">
          <stop offset="0" stopColor="#fff3d0" stopOpacity="0.2" />
          <stop offset="0.5" stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="#1a0f08" stopOpacity="0.45" />
        </radialGradient>
      </defs>
      {children}
      <rect width={W} height={H} fill="url(#vlight)" />
    </svg>
  );
};

/** In-world hanging sign, like the "OPERATING" sign in the reference */
export const Sign: React.FC<{ text: string; sub?: string; x?: number; y?: number; w?: number; color?: string; glow?: boolean }> = ({ text, sub, x = 540, y = 40, w = 560, color = "#7a1e24", glow = true }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, zIndex: 50 }}>
      <div style={{ position: "absolute", left: 60, top: -200, width: 10, height: 200, background: INK }} />
      <div style={{ position: "absolute", right: 60, top: -200, width: 10, height: 200, background: INK }} />
      <div
        style={{
          border: `12px solid #3c4250`,
          outline: `6px solid ${INK}`,
          borderRadius: 10,
          background: `linear-gradient(${color}, ${color}cc)`,
          padding: "14px 10px 16px",
          textAlign: "center",
          boxShadow: glow ? `0 0 ${50 + Math.sin(f / 9) * 10}px rgba(255,90,90,0.35), 0 18px 0 rgba(0,0,0,0.35)` : "0 18px 0 rgba(0,0,0,0.35)",
        }}
      >
        <div style={{ fontFamily: "Oswald", fontWeight: 700, fontSize: 86, lineHeight: 1, color: "#f0b9b0", letterSpacing: 2, textShadow: "0 0 18px rgba(255,140,120,0.6)" }}>{text}</div>
        {sub && <div style={{ fontFamily: "Oswald", fontWeight: 700, fontSize: 40, color: "#f3d9c8", letterSpacing: 4, opacity: 0.9 }}>{sub}</div>}
      </div>
    </div>
  );
};

/** Golden barley field with windmill */
export const Field: React.FC<{ eaten?: number; children?: React.ReactNode }> = ({ eaten = 0, children }) => {
  const f = useCurrentFrame();
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="sky2" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ffb36b" />
          <stop offset="0.6" stopColor="#ffe2a8" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#sky2)" />
      <circle cx="800" cy="420" r="120" fill="#fff4c4" opacity="0.9" />
      <path d="M0 900 Q270 760 540 860 Q810 960 1080 820 L1080 1100 L0 1100 Z" fill="#9bbf6a" stroke={INK} strokeWidth="8" />
      {/* windmill */}
      <g transform="translate(230 640)">
        <polygon points="-60,260 60,260 40,0 -40,0" fill="#efe1c3" stroke={INK} strokeWidth="8" />
        <polygon points="-55,5 0,-60 55,5" fill="#b5523b" stroke={INK} strokeWidth="8" />
        <g transform={`rotate(${f * 2})`}>
          {[0, 90, 180, 270].map((a) => (
            <g key={a} transform={`rotate(${a})`}>
              <rect x="-10" y="-210" width="20" height="210" fill="#6b4423" stroke={INK} strokeWidth="5" />
              <rect x="10" y="-200" width="55" height="150" fill="#f4ecd8" stroke={INK} strokeWidth="6" />
            </g>
          ))}
        </g>
        <circle r="18" fill="#59606a" stroke={INK} strokeWidth="6" />
      </g>
      <rect x="0" y="1000" width={W} height={H - 1000} fill="#e8b84a" />
      {Array.from({ length: 8 }).map((_, r) =>
        Array.from({ length: 16 }).map((__, c) => {
          const y = 1020 + Math.pow(r / 8, 1.4) * 900;
          const s = 0.55 + r * 0.14;
          const x = c * 75 + (r % 2) * 37 - 20;
          const gone = random(`b${r}${c}`) < eaten;
          const sw = Math.sin(f / 12 + c * 0.6 + r) * 8 * s;
          if (gone) return <path key={`${r}-${c}`} d={`M${x} ${y} l-6 -${20 * s} M${x + 8} ${y} l4 -${15 * s}`} stroke="#9a7a2a" strokeWidth={5} />;
          return (
            <g key={`${r}-${c}`}>
              <path d={`M${x} ${y} Q${x + sw / 2} ${y - 70 * s} ${x + sw} ${y - 120 * s}`} stroke="#c9902e" strokeWidth={5 * s} fill="none" />
              <ellipse cx={x + sw} cy={y - 140 * s} rx={10 * s} ry={30 * s} fill="#f6d36b" stroke={INK} strokeWidth={3} transform={`rotate(${sw} ${x + sw} ${y - 140 * s})`} />
            </g>
          );
        }),
      )}
      <rect width={W} height={H} fill="url(#vlight2)" />
      <defs>
        <radialGradient id="vlight2" cx="60%" cy="25%" r="80%">
          <stop offset="0" stopColor="#fff3d0" stopOpacity="0.25" />
          <stop offset="0.5" stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="#2a1505" stopOpacity="0.5" />
        </radialGradient>
      </defs>
      {children}
    </svg>
  );
};

/** Location badge (parchment ribbon) */
export const Badge: React.FC<{ year: string; place: string; delay?: number }> = ({ year, place, delay = 4 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - delay, fps, config: { damping: 12, stiffness: 140 } });
  return (
    <div
      style={{
        position: "absolute",
        top: 170,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        transform: `translateY(${(1 - s) * -260}px) rotate(${(1 - s) * -8 - 2}deg)`,
      }}
    >
      <div
        style={{
          background: "linear-gradient(#f7e7bd, #e8cf91)",
          border: `8px solid ${INK}`,
          borderRadius: 18,
          padding: "16px 44px 18px",
          boxShadow: "0 14px 0 rgba(0,0,0,0.3)",
          textAlign: "center",
          fontFamily: "Cinzel",
          color: "#4a2410",
        }}
      >
        <div style={{ fontSize: 92, fontWeight: 900, lineHeight: 1 }}>{year}</div>
        <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: 3 }}>{place}</div>
      </div>
    </div>
  );
};

/** Rubber stamp slam */
export const Stamp: React.FC<{ text: string; at: number; color?: string; top?: number; rotate?: number; size?: number }> = ({ text, at, color = "#d7263d", top = 520, rotate = -12, size = 130 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const t = f - at;
  const sc = interpolate(t, [0, 6, 9], [3, 0.92, 1], { extrapolateRight: "clamp" });
  const op = interpolate(t, [0, 4], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: op }}>
      <div
        style={{
          transform: `scale(${sc}) rotate(${rotate}deg)`,
          border: `14px solid ${color}`,
          color,
          borderRadius: 24,
          padding: "10px 40px",
          fontFamily: "Montserrat",
          fontWeight: 900,
          fontSize: size,
          letterSpacing: 6,
          background: "rgba(255,255,255,0.85)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        }}
      >
        {text}
      </div>
    </div>
  );
};
