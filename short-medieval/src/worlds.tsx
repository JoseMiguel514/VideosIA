/**
 * Entornos detallados en capas para CamPro (parallax real con <Depth>):
 * ReefPro, MossWorld, Garden, Space, Moon, Lab, IceCave, Aquarium + overlays (Microscope, Caustics, Snow).
 * Cada fondo se dibuja con margen para que el parallax nunca enseñe bordes.
 */
import React, { useId } from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { INK } from "./Characters";
import { Depth } from "./kit2";
import { H, W } from "./Scenery";

const M = 420; // margin around every background layer
const VB = `${-M} ${-M} ${W + 2 * M} ${H + 2 * M}`;
const Full: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W + 2 * M} height={H + 2 * M} viewBox={VB} style={{ position: "absolute", left: -M, top: -M, overflow: "visible" }}>
    {children}
  </svg>
);

/* ------------------------------------------------------------------ shared bits */
const Particles: React.FC<{ n?: number; color?: string; speed?: number; size?: number; up?: boolean; seed?: string }> = ({ n = 40, color = "#e9fbff", speed = 0.6, size = 5, up = false, seed = "p" }) => {
  const f = useCurrentFrame();
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const x = -M + random(`${seed}x${i}`) * (W + 2 * M) + Math.sin(f / (30 + i) + i) * 30;
        const span = H + 2 * M;
        const y0 = random(`${seed}y${i}`) * span;
        const y = -M + ((((up ? -1 : 1) * f * speed * (0.5 + random(`${seed}v${i}`)) + y0) % span) + span) % span;
        const r = size * (0.4 + random(`${seed}r${i}`));
        return <circle key={i} cx={x} cy={y} r={r} fill={color} opacity={0.35 + random(`${seed}o${i}`) * 0.5} />;
      })}
    </>
  );
};

/** animated caustic light net */
const Caustics: React.FC<{ y0: number; y1: number; color?: string; o?: number }> = ({ y0, y1, color = "#ffffff", o = 0.16 }) => {
  const f = useCurrentFrame();
  return (
    <g opacity={o}>
      {Array.from({ length: 9 }).map((_, r) =>
        Array.from({ length: 9 }).map((__, c) => {
          const x = -M + c * 230 + Math.sin(f / 21 + r * 1.3 + c) * 40;
          const y = y0 + (r / 8) * (y1 - y0) + Math.cos(f / 17 + c * 0.9) * 16;
          const s = 0.6 + (r / 8) * 0.9;
          return <ellipse key={`${r}-${c}`} cx={x} cy={y} rx={95 * s + Math.sin(f / 9 + r + c) * 18} ry={26 * s} fill="none" stroke={color} strokeWidth={6 * s} transform={`rotate(${Math.sin(f / 30 + c) * 12} ${x} ${y})`} />;
        }),
      )}
    </g>
  );
};

const FishSchool: React.FC<{ y: number; dir?: 1 | -1; color?: string; n?: number; speed?: number; scale?: number }> = ({ y, dir = 1, color = "#0f4f7a", n = 14, speed = 2.2, scale = 1 }) => {
  const f = useCurrentFrame();
  const span = W + 2 * M + 600;
  const cx = (((dir * f * speed) % span) + span) % span - M - 300;
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const x = cx + (random(`fs${i}`) - 0.5) * 360 * scale;
        const yy = y + (random(`fsy${i}`) - 0.5) * 160 * scale + Math.sin(f / 6 + i) * 8;
        const s = (14 + random(`fss${i}`) * 10) * scale;
        return (
          <g key={i} transform={`translate(${x} ${yy}) scale(${dir} 1)`}>
            <ellipse cx="0" cy="0" rx={s * 1.6} ry={s * 0.7} fill={color} />
            <path d={`M${-s * 1.5} 0 l${-s} ${-s * 0.7} l0 ${s * 1.4} Z`} fill={color} transform={`rotate(${Math.sin(f / 3 + i) * 15} ${-s * 1.5} 0)`} />
          </g>
        );
      })}
    </g>
  );
};

/* ------------------------------------------------------------------ CORAL REEF */
const Anemone: React.FC<{ x: number; y: number; s?: number; c1?: string; c2?: string; seed?: number }> = ({ x, y, s = 1, c1 = "#ff6fa3", c2 = "#ffc2d6", seed = 0 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {Array.from({ length: 13 }).map((_, i) => {
        const a = -Math.PI * 0.95 + (i / 12) * Math.PI * 0.9;
        const sw = Math.sin(f / 14 + i * 0.5 + seed) * 18;
        const ex = Math.cos(a) * 110 + sw;
        const ey = Math.sin(a) * 130;
        return (
          <g key={i}>
            <path d={`M0 0 Q${ex * 0.4 - sw * 0.5} ${ey * 0.6} ${ex} ${ey}`} stroke={INK} strokeWidth="24" fill="none" strokeLinecap="round" />
            <path d={`M0 0 Q${ex * 0.4 - sw * 0.5} ${ey * 0.6} ${ex} ${ey}`} stroke={c1} strokeWidth="14" fill="none" strokeLinecap="round" />
            <circle cx={ex} cy={ey} r="9" fill={c2} />
          </g>
        );
      })}
      <ellipse cx="0" cy="10" rx="70" ry="30" fill="#b5476e" stroke={INK} strokeWidth="8" />
    </g>
  );
};
const BrainCoral: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = "#f2b84b" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-150 0 Q-150 -150 0 -155 Q150 -150 150 0 Z" fill={c} stroke={INK} strokeWidth="9" />
    {Array.from({ length: 6 }).map((_, i) => (
      <path key={i} d={`M${-120 + i * 8} ${-20 - i * 20} Q${-60} ${-60 - i * 18} 0 ${-30 - i * 20} T${120 - i * 8} ${-20 - i * 20}`} stroke="#c98a2a" strokeWidth="8" fill="none" />
    ))}
    <path d="M-110 -100 Q-60 -140 0 -140" stroke="#fff1c2" strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.7" />
  </g>
);
const FanCoral: React.FC<{ x: number; y: number; s?: number; c?: string; seed?: number }> = ({ x, y, s = 1, c = "#9b6bff", seed = 0 }) => {
  const f = useCurrentFrame();
  const sw = Math.sin(f / 25 + seed) * 4;
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${sw})`}>
      <path d="M0 0 Q-160 -120 -120 -300 Q0 -380 120 -300 Q160 -120 0 0 Z" fill={c} stroke={INK} strokeWidth="9" opacity="0.95" />
      {Array.from({ length: 9 }).map((_, i) => {
        const a = -Math.PI / 2 + (i - 4) * 0.22;
        return <path key={i} d={`M0 -10 Q${Math.cos(a) * 80} ${Math.sin(a) * 150} ${Math.cos(a) * 140} ${Math.sin(a) * 300}`} stroke="#5b2fb8" strokeWidth="6" fill="none" />;
      })}
      {Array.from({ length: 18 }).map((_, i) => (
        <circle key={i} cx={(random(`fc${seed}${i}`) - 0.5) * 220} cy={-60 - random(`fcy${seed}${i}`) * 250} r="5" fill="#d9c8ff" />
      ))}
    </g>
  );
};
const BranchCoral: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = "#ff7a4d" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinecap="round" fill="none">
    {[
      "M0 0 Q-10 -90 -50 -160 M-20 -80 Q-80 -110 -100 -170 M0 0 Q20 -120 60 -200 M30 -110 Q80 -120 110 -170",
      "M0 0 Q5 -60 -10 -110",
    ].map((d, i) => (
      <g key={i}>
        <path d={d} stroke={INK} strokeWidth="38" />
        <path d={d} stroke={c} strokeWidth="24" />
      </g>
    ))}
  </g>
);
const Rock: React.FC<{ x: number; y: number; w: number; h: number; c?: string; seed?: number; hole?: boolean }> = ({ x, y, w, h, c = "#6c7a8f", seed = 0, hole = false }) => {
  const pts = Array.from({ length: 10 }).map((_, i) => {
    const a = Math.PI + (i / 9) * Math.PI;
    const r = 0.85 + random(`rk${seed}${i}`) * 0.2;
    return `${x + Math.cos(a) * w * 0.5 * r},${y + Math.sin(a) * h * r}`;
  });
  return (
    <g>
      <polygon points={`${x - w / 2},${y} ${pts.join(" ")} ${x + w / 2},${y}`} fill={c} stroke={INK} strokeWidth="9" strokeLinejoin="round" />
      <path d={`M${x - w * 0.3} ${y - h * 0.75} Q${x} ${y - h * 0.95} ${x + w * 0.25} ${y - h * 0.8}`} stroke="white" strokeWidth="10" fill="none" opacity="0.25" strokeLinecap="round" />
      {Array.from({ length: 6 }).map((_, i) => (
        <circle key={i} cx={x + (random(`rkd${seed}${i}`) - 0.5) * w * 0.7} cy={y - random(`rkdy${seed}${i}`) * h * 0.7} r={6 + random(`rkr${seed}${i}`) * 10} fill="rgba(0,0,0,0.15)" />
      ))}
      {hole && (
        <g>
          <ellipse cx={x + w * 0.05} cy={y - h * 0.32} rx={w * 0.22} ry={h * 0.26} fill="#141a26" stroke={INK} strokeWidth="9" />
          <ellipse cx={x + w * 0.05} cy={y - h * 0.38} rx={w * 0.16} ry={h * 0.14} fill="#000" opacity="0.6" />
        </g>
      )}
    </g>
  );
};

export const ReefPro: React.FC<{ children?: React.ReactNode; dark?: number; burrow?: boolean; noFg?: boolean }> = ({ children, dark = 0, burrow = false, noFg = false }) => {
  const f = useCurrentFrame();
  const id = useId().replace(/:/g, "");
  return (
    <>
      <Depth d={0.12}>
        <Full>
          <defs>
            <linearGradient id={`rw${id}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#6fd6f2" />
              <stop offset="0.45" stopColor="#1a86c2" />
              <stop offset="1" stopColor="#0a3a66" />
            </linearGradient>
          </defs>
          <rect x={-M} y={-M} width={W + 2 * M} height={H + 2 * M} fill={`url(#rw${id})`} />
          {/* surface shimmer */}
          {Array.from({ length: 12 }).map((_, i) => (
            <ellipse key={i} cx={-M + i * 160 + Math.sin(f / 15 + i) * 30} cy={-300 + Math.sin(f / 10 + i) * 8} rx="90" ry="12" fill="white" opacity="0.25" />
          ))}
          {/* god rays */}
          {Array.from({ length: 8 }).map((_, i) => {
            const x = -200 + i * 190 + Math.sin(f / 40 + i) * 40;
            return <polygon key={i} points={`${x},-400 ${x + 70 + (i % 3) * 20},-400 ${x - 120 + Math.sin(f / 28 + i) * 60},1500 ${x - 260},1500`} fill="#e9fbff" opacity={0.06 + 0.03 * Math.sin(f / 18 + i * 2)} />;
          })}
          <FishSchool y={500} dir={1} color="#0d5a8c" n={18} speed={1.4} />
          <FishSchool y={260} dir={-1} color="#126aa1" n={10} speed={1.0} scale={0.7} />
          <path d={`M${-M} 1180 Q60 1040 260 1140 Q470 1030 640 1150 Q830 1060 1000 1150 Q1200 1080 ${W + M} 1150 L${W + M} ${H + M} L${-M} ${H + M} Z`} fill="#0d4d7e" opacity="0.8" />
        </Full>
      </Depth>
      <Depth d={0.45}>
        <Full>
          <path d={`M${-M} 1300 Q100 1160 300 1270 Q520 1150 720 1270 Q900 1180 ${W + M} 1260 L${W + M} ${H + M} L${-M} ${H + M} Z`} fill="#13628f" />
          <g opacity="0.7">
            <FanCoral x={-80} y={1300} s={0.7} c="#5a8fd6" seed={2} />
            <BranchCoral x={860} y={1290} s={0.8} c="#3f9fb8" />
            <BrainCoral x={420} y={1290} s={0.6} c="#4b9cc0" />
          </g>
        </Full>
      </Depth>
      <Depth d={0.8}>
        <Full>
          {/* sand with ripples */}
          <path d={`M${-M} 1430 Q270 1390 540 1425 Q810 1460 ${W + M} 1420 L${W + M} ${H + M} L${-M} ${H + M} Z`} fill="#f1d9a0" stroke={INK} strokeWidth="9" />
          {Array.from({ length: 9 }).map((_, i) => (
            <path key={i} d={`M${-M} ${1500 + i * 60} Q${100} ${1480 + i * 60} ${300} ${1500 + i * 60} T${700} ${1500 + i * 60} T${1100} ${1500 + i * 60} T${1500} ${1500 + i * 60}`} stroke="#d9bc80" strokeWidth={4 + i * 0.6} fill="none" opacity="0.8" />
          ))}
          <Caustics y0={1440} y1={2200} />
          {Array.from({ length: 14 }).map((_, i) => (
            <ellipse key={i} cx={-200 + random(`sh${i}`) * 1500} cy={1480 + random(`shy${i}`) * 700} rx={10 + random(`shr${i}`) * 12} ry={7} fill={["#fff1e0", "#ffb3a0", "#e9d0b0"][i % 3]} stroke={INK} strokeWidth="3" />
          ))}
          <Rock x={burrow ? 120 : -60} y={1470} w={burrow ? 520 : 420} h={burrow ? 330 : 280} seed={1} hole={burrow} />
          <Rock x={1080} y={1460} w={460} h={300} seed={2} c="#5d6b80" />
          <BrainCoral x={950} y={1440} s={0.75} />
          <FanCoral x={-140} y={1420} s={0.9} seed={5} />
          <Anemone x={300} y={1470} s={0.65} seed={1} />
          <Anemone x={1180} y={1500} s={0.8} c1="#ffb03a" c2="#fff1a0" seed={3} />
          <BranchCoral x={760} y={1460} s={0.7} />
        </Full>
      </Depth>
      {children}
      {!noFg && (
        <Depth d={1.4} blur={5} z={8800}>
          <Full>
            {[-260, 1350].map((x, i) => (
              <g key={i}>
                {Array.from({ length: 4 }).map((_, k) => {
                  const sw = Math.sin(f / 16 + k + i) * 40;
                  return <path key={k} d={`M${x + k * 40} ${H + M} Q${x + k * 40 + sw} 1500 ${x + k * 50 + sw * 1.6} ${900 + k * 90}`} stroke="#2f8f4a" strokeWidth={46 - k * 6} fill="none" strokeLinecap="round" opacity="0.9" />;
                })}
              </g>
            ))}
            <Particles n={26} size={9} speed={0.5} seed="fg" />
          </Full>
        </Depth>
      )}
      <AbsoluteFill style={{ pointerEvents: "none", zIndex: 8900 }}>
        <svg width={W} height={H}>
          <Particles n={30} size={4} speed={0.35} up seed="snow" />
        </svg>
      </AbsoluteFill>
      {dark > 0 && <AbsoluteFill style={{ background: "#020b1f", opacity: dark, zIndex: 8950 }} />}
    </>
  );
};

/* ------------------------------------------------------------------ AQUARIUM (living room) */
export const Aquarium: React.FC<{ children?: React.ReactNode; crack?: number; cx?: number; cy?: number }> = ({ children, crack = 0, cx = 760, cy = 1150 }) => {
  const f = useCurrentFrame();
  return (
    <>
      <Depth d={0.3}>
        <Full>
          <rect x={-M} y={-M} width={W + 2 * M} height={H + 2 * M} fill="#f3e2c7" />
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x={-M + i * 170} y={-M} width="85" height={H + 2 * M} fill="#ead3b0" />
          ))}
          <rect x="650" y="160" width="320" height="380" fill="#9fd6f5" stroke={INK} strokeWidth="12" />
          <line x1="810" y1="160" x2="810" y2="540" stroke={INK} strokeWidth="9" />
          <rect x="120" y="230" width="220" height="160" rx="8" fill="#d9a85c" stroke={INK} strokeWidth="9" />
          <circle cx="230" cy="310" r="40" fill="#5d7d38" />
          <rect x={-M} y="1640" width={W + 2 * M} height={H} fill="#9c6b44" />
        </Full>
      </Depth>
      <Depth d={0.85}>
        <Full>
          {/* cabinet */}
          <rect x="40" y="1500" width="1000" height="420" fill="#5b3a26" stroke={INK} strokeWidth="12" />
          <rect x="90" y="1560" width="420" height="300" rx="10" fill="#6e4a32" stroke={INK} strokeWidth="8" />
          <rect x="570" y="1560" width="420" height="300" rx="10" fill="#6e4a32" stroke={INK} strokeWidth="8" />
          {/* tank */}
          <rect x="60" y="620" width="960" height="880" fill="#2a98c9" stroke={INK} strokeWidth="16" />
          <rect x="60" y="620" width="960" height="70" fill="#7fd6f2" opacity="0.7" />
          <path d={`M60 700 Q300 ${690 + Math.sin(f / 9) * 8} 540 700 T1020 700`} stroke="white" strokeWidth="6" fill="none" opacity="0.6" />
          <rect x="76" y="1380" width="928" height="110" fill="#f1d9a0" />
          {Array.from({ length: 16 }).map((_, i) => (
            <circle key={i} cx={100 + i * 58} cy={1400 + (i % 3) * 25} r={10 + (i % 4) * 4} fill={["#c9b08a", "#e8d4b4", "#a98d6a"][i % 3]} stroke={INK} strokeWidth="3" />
          ))}
          <BranchCoral x={900} y={1420} s={0.6} c="#ff6fa3" />
          <Anemone x={200} y={1420} s={0.5} seed={4} />
          {Array.from({ length: 12 }).map((_, i) => {
            const y = 1450 - ((f * (2 + (i % 3)) + i * 97) % 760);
            return <circle key={i} cx={950 + Math.sin(f / 6 + i) * 10} cy={y} r={5 + (i % 3) * 3} fill="none" stroke="white" strokeWidth="3" opacity="0.6" />;
          })}
          {/* glass reflections */}
          <path d="M120 660 L260 660 L120 1000 Z" fill="white" opacity="0.15" />
          <path d="M880 1440 L980 1440 L980 1240 Z" fill="white" opacity="0.1" />
        </Full>
      </Depth>
      {children}
      {crack > 0 && (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, zIndex: 7000, overflow: "visible" }}>
          {Array.from({ length: 14 }).map((_, i) => {
            const a = (i / 14) * Math.PI * 2 + random(`ck${i}`) * 0.3;
            const L = (160 + random(`cl${i}`) * 260) * Math.min(1, crack);
            const mx = cx + Math.cos(a + 0.2) * L * 0.5;
            const my = cy + Math.sin(a + 0.2) * L * 0.5;
            return <path key={i} d={`M${cx} ${cy} L${mx} ${my} L${cx + Math.cos(a) * L} ${cy + Math.sin(a) * L}`} stroke="white" strokeWidth="6" fill="none" strokeLinejoin="bevel" />;
          })}
          {[50, 110, 190].map((r, i) => (
            <circle key={i} cx={cx} cy={cy} r={r * Math.min(1, crack)} fill="none" stroke="white" strokeWidth="4" strokeDasharray="30 18" opacity="0.9" />
          ))}
        </svg>
      )}
    </>
  );
};

/* ------------------------------------------------------------------ LAB */
export const Lab: React.FC<{ children?: React.ReactNode; screen?: React.ReactNode }> = ({ children, screen }) => {
  const f = useCurrentFrame();
  return (
    <>
      <Depth d={0.35}>
        <Full>
          <rect x={-M} y={-M} width={W + 2 * M} height={H + 2 * M} fill="#dfeef2" />
          {Array.from({ length: 14 }).map((_, r) =>
            Array.from({ length: 12 }).map((__, c) => <rect key={`${r}${c}`} x={-M + c * 160} y={-M + r * 120} width="156" height="116" fill="none" stroke="#c4dbe1" strokeWidth="4" />),
          )}
          {/* shelves */}
          {[300, 620].map((y, k) => (
            <g key={k}>
              <rect x={-200} y={y} width={560} height={22} fill="#8a6a4a" stroke={INK} strokeWidth="7" />
              {Array.from({ length: 5 }).map((_, i) => {
                const c = ["#7fd6c4", "#ff8fb3", "#ffd23f", "#9bb7ff", "#a5e36b"][(i + k) % 5];
                return (
                  <g key={i} transform={`translate(${-150 + i * 105} ${y})`}>
                    <path d="M-25 0 L-25 -60 Q-25 -80 -10 -90 L-10 -120 L10 -120 L10 -90 Q25 -80 25 -60 L25 0 Z" fill="#f4fbff" stroke={INK} strokeWidth="6" />
                    <rect x="-22" y="-45" width="44" height="42" fill={c} opacity="0.85" />
                    <circle cx={((f + i * 7) % 30) - 10} cy={-30 - ((f * 2 + i * 13) % 40)} r="4" fill="white" opacity="0.8" />
                  </g>
                );
              })}
            </g>
          ))}
          {/* monitor */}
          <rect x="560" y="210" width="440" height="330" rx="18" fill="#2a3240" stroke={INK} strokeWidth="12" />
          <rect x="590" y="240" width="380" height="270" rx="8" fill="#0d1a2a" />
          <rect x="760" y="540" width="40" height="70" fill="#5a6270" stroke={INK} strokeWidth="8" />
          <rect x={-M} y="1360" width={W + 2 * M} height={H} fill="#c9d7de" />
        </Full>
        {screen && <div style={{ position: "absolute", left: 590, top: 240, width: 380, height: 270, overflow: "hidden" }}>{screen}</div>}
      </Depth>
      <Depth d={0.9}>
        <Full>
          <rect x={-M} y="1420" width={W + 2 * M} height="60" fill="#f4f6f8" stroke={INK} strokeWidth="10" />
          <rect x={-M} y="1480" width={W + 2 * M} height={H} fill="#8fa3b0" />
        </Full>
      </Depth>
      {children}
    </>
  );
};

/* ------------------------------------------------------------------ MOSS MICRO-WORLD */
const MossStalk: React.FC<{ x: number; y: number; h: number; c?: string; seed?: number }> = ({ x, y, h, c = "#4caf50", seed = 0 }) => {
  const f = useCurrentFrame();
  const sw = Math.sin(f / 30 + seed) * 10;
  return (
    <g>
      <path d={`M${x} ${y} Q${x + sw} ${y - h / 2} ${x + sw * 1.5} ${y - h}`} stroke={INK} strokeWidth="26" fill="none" strokeLinecap="round" />
      <path d={`M${x} ${y} Q${x + sw} ${y - h / 2} ${x + sw * 1.5} ${y - h}`} stroke="#6b8f3a" strokeWidth="14" fill="none" strokeLinecap="round" />
      {Array.from({ length: Math.floor(h / 40) }).map((_, i) => {
        const yy = y - 30 - i * 40;
        const xx = x + sw * ((y - yy) / h) * 1.2;
        const side = i % 2 ? 1 : -1;
        return <path key={i} d={`M${xx} ${yy} q${side * 50} -10 ${side * 80} -45 q${-side * 40} 5 ${-side * 80} 45 Z`} fill={c} stroke={INK} strokeWidth="6" strokeLinejoin="round" transform={`rotate(${Math.sin(f / 20 + i + seed) * 6} ${xx} ${yy})`} />;
      })}
    </g>
  );
};
const Droplet: React.FC<{ x: number; y: number; r: number; dry?: number }> = ({ x, y, r, dry = 0 }) => {
  const rr = r * (1 - dry);
  if (rr < 2) return null;
  return (
    <g>
      <circle cx={x} cy={y - rr} r={rr} fill="#bfe9ff" opacity="0.55" stroke={INK} strokeWidth="6" />
      <ellipse cx={x - rr * 0.35} cy={y - rr * 1.4} rx={rr * 0.3} ry={rr * 0.16} fill="white" />
      <path d={`M${x - rr * 0.6} ${y - rr * 0.5} Q${x} ${y - rr * 0.1} ${x + rr * 0.6} ${y - rr * 0.5}`} stroke="white" strokeWidth="4" fill="none" opacity="0.6" />
    </g>
  );
};

export const MossWorld: React.FC<{ children?: React.ReactNode; dry?: number }> = ({ children, dry = 0 }) => {
  const id = useId().replace(/:/g, "");
  const c1 = dry > 0.5 ? "#a8a04a" : "#5fbf4a";
  return (
    <>
      <Depth d={0.15}>
        <Full>
          <defs>
            <radialGradient id={`mw${id}`} cx="50%" cy="30%" r="80%">
              <stop offset="0" stopColor={dry > 0.5 ? "#fff0b0" : "#d8f7c0"} />
              <stop offset="1" stopColor={dry > 0.5 ? "#c9a24a" : "#3f8f4a"} />
            </radialGradient>
          </defs>
          <rect x={-M} y={-M} width={W + 2 * M} height={H + 2 * M} fill={`url(#mw${id})`} />
          {Array.from({ length: 22 }).map((_, i) => (
            <circle key={i} cx={-M + random(`bk${i}`) * (W + 2 * M)} cy={-M + random(`bky${i}`) * 1500} r={40 + random(`bkr${i}`) * 90} fill={dry > 0.5 ? "#fff6c8" : "#eaffd8"} opacity={0.18 + random(`bko${i}`) * 0.2} />
          ))}
        </Full>
      </Depth>
      <Depth d={0.45} blur={4}>
        <Full>
          {[-250, 0, 250, 520, 820, 1100, 1300].map((x, i) => (
            <MossStalk key={i} x={x} y={1500} h={900 + (i % 3) * 200} c={dry > 0.5 ? "#9a9040" : "#3f9f4a"} seed={i} />
          ))}
        </Full>
      </Depth>
      <Depth d={0.85}>
        <Full>
          <path d={`M${-M} 1460 Q200 1400 540 1440 Q880 1480 ${W + M} 1430 L${W + M} ${H + M} L${-M} ${H + M} Z`} fill={dry > 0.5 ? "#7a6a3a" : "#3d6b2f"} stroke={INK} strokeWidth="10" />
          {Array.from({ length: 30 }).map((_, i) => (
            <path key={i} d={`M${-300 + i * 60} ${1450 + (i % 4) * 30} q15 -50 0 -90 q-15 40 0 90`} fill={c1} stroke={INK} strokeWidth="5" />
          ))}
          {[-120, 1180].map((x, i) => (
            <MossStalk key={i} x={x} y={1470} h={1100} c={c1} seed={i + 7} />
          ))}
          <Droplet x={140} y={1450} r={90} dry={dry} />
          <Droplet x={930} y={1460} r={120} dry={dry} />
          <Droplet x={1120} y={1450} r={50} dry={dry} />
        </Full>
      </Depth>
      {children}
      <Depth d={1.45} blur={7} z={8800}>
        <Full>
          {[-300, 1380].map((x, i) => (
            <MossStalk key={i} x={x} y={H + 200} h={1500} c={c1} seed={i + 11} />
          ))}
          <Particles n={22} color="#fffbe0" size={10} speed={0.3} up seed="spore" />
        </Full>
      </Depth>
    </>
  );
};

/** microscope lens overlay (screen space) */
export const Microscope: React.FC<{ label?: string; o?: number }> = ({ label = "0,5 mm", o = 1 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", zIndex: 9100, opacity: o }}>
    <svg width={W} height={H}>
      <defs>
        <mask id="mlens">
          <rect width={W} height={H} fill="white" />
          <circle cx={540} cy={900} r={500} fill="black" />
        </mask>
      </defs>
      <rect width={W} height={H} fill="#0b0f0b" mask="url(#mlens)" />
      <circle cx={540} cy={900} r={500} fill="none" stroke="#2a2f2a" strokeWidth="30" />
      <circle cx={540} cy={900} r={520} fill="none" stroke={INK} strokeWidth="12" />
      <line x1={540} y1={430} x2={540} y2={480} stroke="white" strokeWidth="4" opacity="0.6" />
      <line x1={540} y1={1320} x2={540} y2={1370} stroke="white" strokeWidth="4" opacity="0.6" />
      <line x1={70} y1={900} x2={120} y2={900} stroke="white" strokeWidth="4" opacity="0.6" />
      <line x1={960} y1={900} x2={1010} y2={900} stroke="white" strokeWidth="4" opacity="0.6" />
      <rect x={640} y={1290} width={220} height={14} fill="white" />
      <text x={750} y={1270} textAnchor="middle" fontFamily="Oswald" fontWeight="700" fontSize="44" fill="white">
        {label}
      </text>
    </svg>
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ GARDEN */
export const Garden: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return (
    <>
      <Depth d={0.2}>
        <Full>
          <rect x={-M} y={-M} width={W + 2 * M} height={H + 2 * M} fill="#8fd0f5" />
          <circle cx="880" cy="200" r="110" fill="#fff3a0" />
          {[0, 1].map((i) => (
            <g key={i} transform={`translate(${((i * 700 + f * 0.8) % 1700) - 400} ${150 + i * 180})`}>
              <ellipse rx="140" ry="50" fill="white" />
              <ellipse cx="80" cy="-25" rx="90" ry="55" fill="white" />
            </g>
          ))}
          <rect x="560" y="520" width="420" height="520" fill="#f6ead0" stroke={INK} strokeWidth="10" />
          <polygon points="530,525 770,330 1010,525" fill="#b5523b" stroke={INK} strokeWidth="10" strokeLinejoin="round" />
          <rect x="620" y="620" width="120" height="120" fill="#9fd6f5" stroke={INK} strokeWidth="8" />
          <rect x="800" y="840" width="110" height="200" fill="#7a4b26" stroke={INK} strokeWidth="8" />
          <rect x={-M} y="1040" width={W + 2 * M} height={H} fill="#7cc24a" />
        </Full>
      </Depth>
      <Depth d={0.7}>
        <Full>
          {Array.from({ length: 40 }).map((_, i) => (
            <path key={i} d={`M${-300 + i * 45} 1200 q${Math.sin(f / 12 + i) * 8} -60 ${Math.sin(f / 12 + i) * 14} -90`} stroke="#4f9a2f" strokeWidth="9" fill="none" strokeLinecap="round" />
          ))}
          {[100, 300, 900].map((x, i) => (
            <g key={i} transform={`translate(${x} 1180)`}>
              <line x1="0" y1="0" x2="0" y2="-120" stroke="#3f7d2a" strokeWidth="8" />
              {Array.from({ length: 6 }).map((_, k) => (
                <ellipse key={k} cx={Math.cos((k / 6) * Math.PI * 2) * 26} cy={-120 + Math.sin((k / 6) * Math.PI * 2) * 26} rx="20" ry="12" fill={["#ff8fb3", "#ffd23f", "#9bb7ff"][i]} stroke={INK} strokeWidth="4" transform={`rotate(${(k / 6) * 360} ${Math.cos((k / 6) * Math.PI * 2) * 26} ${-120 + Math.sin((k / 6) * Math.PI * 2) * 26})`} />
              ))}
              <circle cy="-120" r="16" fill="#ffb03a" stroke={INK} strokeWidth="4" />
            </g>
          ))}
        </Full>
      </Depth>
      <Depth d={0.95}>
        <Full>
          <path d="M120 1600 Q160 1300 540 1280 Q920 1300 960 1600 Z" fill="#8a8f96" stroke={INK} strokeWidth="12" />
          <path d="M160 1450 Q300 1310 540 1300 Q780 1310 900 1420 Q760 1380 540 1390 Q320 1390 160 1450 Z" fill="#4caf50" stroke={INK} strokeWidth="8" />
          {Array.from({ length: 26 }).map((_, i) => (
            <path key={i} d={`M${200 + i * 26} ${1360 - Math.sin((i / 25) * Math.PI) * 60} q6 -30 0 -50 q-6 20 0 50`} fill="#6fcf4a" stroke={INK} strokeWidth="3" />
          ))}
          <rect x={-M} y="1600" width={W + 2 * M} height={H} fill="#6b4a2a" />
        </Full>
      </Depth>
      {children}
    </>
  );
};

/* ------------------------------------------------------------------ SPACE */
export const Earth: React.FC<{ r: number; spin?: number }> = ({ r, spin = 0 }) => {
  const id = useId().replace(/:/g, "");
  return (
    <svg width={r * 2.4} height={r * 2.4} viewBox={`${-r * 1.2} ${-r * 1.2} ${r * 2.4} ${r * 2.4}`} style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`ea${id}`}>
          <stop offset="0.82" stopColor="#7fd6ff" stopOpacity="0.6" />
          <stop offset="1" stopColor="#7fd6ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`es${id}`} cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#4fb3ff" />
          <stop offset="1" stopColor="#0d3f8f" />
        </radialGradient>
        <clipPath id={`ec${id}`}>
          <circle r={r} />
        </clipPath>
      </defs>
      <circle r={r * 1.15} fill={`url(#ea${id})`} />
      <circle r={r} fill={`url(#es${id})`} stroke={INK} strokeWidth="10" />
      <g clipPath={`url(#ec${id})`}>
        {[0, 1].map((k) => (
          <g key={k} transform={`translate(${((spin * r * 0.5) % (r * 4)) - r * 2 + k * r * 2} 0)`}>
            <path d={`M${-r * 0.6} ${-r * 0.5} q${r * 0.3} ${-r * 0.3} ${r * 0.6} 0 q${r * 0.2} ${r * 0.4} ${-r * 0.1} ${r * 0.6} q${-r * 0.4} ${r * 0.1} ${-r * 0.5} ${-r * 0.6} Z`} fill="#5fbf4a" stroke={INK} strokeWidth="6" />
            <path d={`M${r * 0.3} ${r * 0.1} q${r * 0.4} ${-r * 0.1} ${r * 0.5} ${r * 0.3} q${-r * 0.1} ${r * 0.4} ${-r * 0.4} ${r * 0.3} Z`} fill="#8fcf5a" stroke={INK} strokeWidth="6" />
            <ellipse cx={-r * 0.2} cy={r * 0.4} rx={r * 0.4} ry={r * 0.08} fill="white" opacity="0.7" />
            <ellipse cx={r * 0.5} cy={-r * 0.4} rx={r * 0.3} ry={r * 0.07} fill="white" opacity="0.7" />
          </g>
        ))}
        <circle cx={r * 0.35} cy={r * 0.35} r={r * 1.1} fill="black" opacity="0.25" />
      </g>
    </svg>
  );
};

export const Space: React.FC<{ children?: React.ReactNode; earth?: boolean; earthX?: number; earthY?: number; earthR?: number }> = ({ children, earth = true, earthX = 540, earthY = 1750, earthR = 700 }) => {
  const f = useCurrentFrame();
  return (
    <>
      <Depth d={0.05}>
        <Full>
          <rect x={-M} y={-M} width={W + 2 * M} height={H + 2 * M} fill="#05081a" />
          <ellipse cx="300" cy="400" rx="700" ry="260" fill="#3a1f6a" opacity="0.35" transform="rotate(-25 300 400)" />
          <ellipse cx="800" cy="900" rx="600" ry="200" fill="#1f3a7a" opacity="0.35" transform="rotate(20 800 900)" />
          {Array.from({ length: 160 }).map((_, i) => (
            <circle key={i} cx={-M + random(`st${i}`) * (W + 2 * M)} cy={-M + random(`sty${i}`) * (H + 2 * M)} r={1 + random(`str${i}`) * 3} fill="white" opacity={0.4 + 0.6 * Math.abs(Math.sin(f / 15 + i))} />
          ))}
        </Full>
      </Depth>
      <Depth d={0.25}>
        <Full>
          {Array.from({ length: 40 }).map((_, i) => (
            <circle key={i} cx={-M + random(`sn${i}`) * (W + 2 * M)} cy={-M + random(`sny${i}`) * (H + 2 * M)} r={3 + random(`snr${i}`) * 3} fill="#e9f0ff" />
          ))}
        </Full>
      </Depth>
      {earth && (
        <Depth d={0.4}>
          <div style={{ position: "absolute", left: earthX - earthR * 1.2, top: earthY - earthR * 1.2 }}>
            <Earth r={earthR} spin={f / 200} />
          </div>
        </Depth>
      )}
      {children}
    </>
  );
};

/** FOTON-like capsule with open lid + sample tray */
export const Capsule: React.FC<{ open?: number; size?: number }> = ({ open = 0, size = 600 }) => {
  const f = useCurrentFrame();
  return (
    <svg width={size} height={size} viewBox="-300 -300 600 600" style={{ overflow: "visible" }}>
      {[-1, 1].map((s) => (
        <g key={s} transform={`translate(${s * 230} 0)`}>
          <rect x={s > 0 ? 0 : -260} y="-60" width="260" height="120" fill="#2a4a9a" stroke={INK} strokeWidth="9" />
          {Array.from({ length: 4 }).map((_, i) => (
            <line key={i} x1={s > 0 ? 65 * i : -65 * i} y1="-60" x2={s > 0 ? 65 * i : -65 * i} y2="60" stroke="#7fa8ff" strokeWidth="5" />
          ))}
        </g>
      ))}
      <circle r="190" fill="#c9ced6" stroke={INK} strokeWidth="12" />
      <circle r="190" fill="none" stroke="white" strokeWidth="8" strokeDasharray="40 30" opacity="0.4" transform={`rotate(${f})`} />
      <ellipse cx="0" cy="20" rx="120" ry="60" fill="#1a2030" stroke={INK} strokeWidth="8" />
      <g transform={`rotate(${-open * 110} -130 -20)`}>
        <path d="M-130 -20 Q0 -120 130 -20 Z" fill="#aab4c0" stroke={INK} strokeWidth="9" />
      </g>
      <circle cx="-60" cy="-120" r="14" fill="#ff5a5a" opacity={0.5 + 0.5 * Math.sin(f / 4)} />
    </svg>
  );
};

/* ------------------------------------------------------------------ MOON */
export const Moon: React.FC<{ children?: React.ReactNode; dust?: number }> = ({ children, dust = 0 }) => {
  const f = useCurrentFrame();
  return (
    <>
      <Space earth earthX={820} earthY={360} earthR={150} />
      <Depth d={0.6}>
        <Full>
          <path d={`M${-M} 1180 Q200 1100 420 1150 Q700 1080 900 1140 Q1100 1100 ${W + M} 1150 L${W + M} ${H + M} L${-M} ${H + M} Z`} fill="#8a8f9a" stroke={INK} strokeWidth="10" />
        </Full>
      </Depth>
      <Depth d={0.9}>
        <Full>
          <path d={`M${-M} 1350 Q300 1300 540 1330 Q800 1360 ${W + M} 1320 L${W + M} ${H + M} L${-M} ${H + M} Z`} fill="#b9bec8" stroke={INK} strokeWidth="10" />
          {[
            [100, 1500, 160],
            [700, 1440, 110],
            [950, 1700, 200],
            [350, 1800, 140],
          ].map(([x, y, r], i) => (
            <g key={i}>
              <ellipse cx={x} cy={y} rx={r} ry={r * 0.3} fill="#9aa0ab" stroke={INK} strokeWidth="7" />
              <ellipse cx={x + r * 0.05} cy={y + r * 0.05} rx={r * 0.8} ry={r * 0.22} fill="#7d8390" />
            </g>
          ))}
          {Array.from({ length: 30 }).map((_, i) => (
            <circle key={i} cx={-300 + random(`mr${i}`) * 1700} cy={1360 + random(`mry${i}`) * 700} r={4 + random(`mrr${i}`) * 10} fill="#8a8f9a" />
          ))}
        </Full>
      </Depth>
      {children}
      {dust > 0 && (
        <AbsoluteFill style={{ zIndex: 8700, pointerEvents: "none" }}>
          <svg width={W} height={H}>
            {Array.from({ length: 24 }).map((_, i) => (
              <circle key={i} cx={540 + Math.cos(i) * 300 * dust + Math.sin(f / 10 + i) * 30} cy={1350 - dust * 200 * random(`dd${i}`)} r={60 + random(`dr${i}`) * 90} fill="#c9ccd4" opacity={0.5 * (1 - dust * 0.5)} />
            ))}
          </svg>
        </AbsoluteFill>
      )}
    </>
  );
};

/** small lunar lander (Beresheet-like), `wreck` bends it */
export const Lander: React.FC<{ size?: number; wreck?: number; flame?: boolean }> = ({ size = 360, wreck = 0, flame = false }) => {
  const f = useCurrentFrame();
  return (
    <svg width={size} height={size} viewBox="-200 -200 400 400" style={{ overflow: "visible" }}>
      {flame && <path d={`M-30 90 L0 ${170 + Math.sin(f * 2) * 20} L30 90 Z`} fill="#ffb03a" stroke={INK} strokeWidth="6" />}
      <g transform={`rotate(${wreck * 35})`}>
        {[-1, 1].map((s) => (
          <path key={s} d={`M${s * 60} 40 L${s * (130 - wreck * 40)} ${130 - wreck * 50} L${s * (160 - wreck * 40)} ${130 - wreck * 50}`} stroke={INK} strokeWidth="12" fill="none" strokeLinecap="round" />
        ))}
        <polygon points="-90,-70 90,-70 110,60 -110,60" fill="#c9ced6" stroke={INK} strokeWidth="10" strokeLinejoin="round" />
        <rect x="-80" y="-40" width="160" height="70" fill="#e6bd55" stroke={INK} strokeWidth="7" />
        <circle cx="0" cy="-110" r="40" fill="#8a929e" stroke={INK} strokeWidth="9" />
        <text y="10" textAnchor="middle" fontFamily="Oswald" fontWeight="700" fontSize="34" fill="#2a2f3a">
          BERESHEET
        </text>
      </g>
      {wreck > 0 &&
        [0, 1, 2].map((i) => {
          const y = -100 - ((f * 2 + i * 60) % 200);
          return <circle key={i} cx={Math.sin(f / 9 + i) * 30 + i * 20 - 20} cy={y} r={30 + ((f + i * 60) % 200) * 0.2} fill="#6a6f7a" opacity={0.5} />;
        })}
    </svg>
  );
};

/* ------------------------------------------------------------------ ICE CAVE */
export const IceCave: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const id = useId().replace(/:/g, "");
  return (
    <>
      <Depth d={0.2}>
        <Full>
          <defs>
            <linearGradient id={`ic${id}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#dff6ff" />
              <stop offset="1" stopColor="#5fa8d9" />
            </linearGradient>
          </defs>
          <rect x={-M} y={-M} width={W + 2 * M} height={H + 2 * M} fill={`url(#ic${id})`} />
          {Array.from({ length: 12 }).map((_, i) => (
            <polygon key={i} points={`${-M + i * 160},${-M} ${-M + i * 160 + 140},${-M} ${-M + i * 160 + 70},${200 + (i % 3) * 140}`} fill="#bfe9ff" stroke={INK} strokeWidth="7" />
          ))}
        </Full>
      </Depth>
      <Depth d={0.85}>
        <Full>
          <path d={`M${-M} 1450 Q300 1400 540 1430 Q800 1460 ${W + M} 1420 L${W + M} ${H + M} L${-M} ${H + M} Z`} fill="#eaf8ff" stroke={INK} strokeWidth="10" />
          {Array.from({ length: 10 }).map((_, i) => (
            <path key={i} d={`M${-200 + i * 160} ${1500 + (i % 3) * 80} l60 -20 l50 30`} stroke="#9fd0ee" strokeWidth="6" fill="none" />
          ))}
        </Full>
      </Depth>
      {children}
      <AbsoluteFill style={{ pointerEvents: "none", zIndex: 8900 }}>
        <svg width={W} height={H}>
          <Particles n={50} color="white" size={6} speed={1.2} seed="ice" />
        </svg>
      </AbsoluteFill>
    </>
  );
};

/** ice block (wrap children) melting with `melt` 0..1 */
export const IceBlock: React.FC<{ w: number; h: number; melt?: number; children?: React.ReactNode }> = ({ w, h, melt = 0, children }) => {
  const f = useCurrentFrame();
  const hh = h * (1 - melt * 0.92);
  return (
    <div style={{ position: "relative", width: w, height: h }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>{children}</div>
      {melt < 1 && (
        <svg width={w} height={h} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <rect x={8} y={h - hh} width={w - 16} height={hh - 8} rx="30" fill="#bfe9ff" opacity={0.6} stroke={INK} strokeWidth="10" />
          <path d={`M${w * 0.15} ${h - hh + 30} L${w * 0.35} ${h - hh + 30} L${w * 0.15} ${h - hh + hh * 0.5} Z`} fill="white" opacity="0.6" />
          <path d={`M${w * 0.6} ${h - hh + 60} l40 30 l-20 40 l30 30`} stroke="white" strokeWidth="6" fill="none" opacity="0.8" />
          {melt > 0 &&
            [0, 1, 2, 3].map((i) => {
              const y = h - 10 + ((f * 3 + i * 25) % 60);
              return <path key={i} d={`M${w * (0.2 + i * 0.2)} ${y} q8 14 0 22 q-8 -8 0 -22`} fill="#7fd6ff" stroke={INK} strokeWidth="3" />;
            })}
        </svg>
      )}
      {melt > 0 && <div style={{ position: "absolute", left: -60, right: -60, bottom: -30, height: 40, borderRadius: "50%", background: "#9fe0ff", opacity: 0.7 * melt, border: `6px solid ${INK}` }} />}
    </div>
  );
};
