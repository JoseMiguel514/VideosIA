import React from "react";
import { random } from "remotion";

/* Cinematic, detailed, living environments (1920x1080). Characters stay flat on top.
 * Every environment has: a blurred far layer, a mid layer with props, animated details,
 * practical light cones and a dark floor band for subtitles. */

const Full: React.FC<{ children: React.ReactNode; blur?: number; style?: React.CSSProperties }> = ({ children, blur = 0, style }) => (
  <div style={{ position: "absolute", inset: 0, filter: blur ? `blur(${blur}px)` : undefined, ...style }}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {children}
    </svg>
  </div>
);

export const Cone: React.FC<{ x: number; y: number; w: number; h: number; color?: string; o?: number; id: string; flicker?: number }> = ({
  x,
  y,
  w,
  h,
  color = "#ffd9a0",
  o = 0.22,
  id,
  flicker = 1,
}) => (
  <g opacity={flicker}>
    <defs>
      <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor={color} stopOpacity={o} />
        <stop offset="1" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
    <path d={`M ${x - w * 0.12} ${y} L ${x + w * 0.12} ${y} L ${x + w / 2} ${y + h} L ${x - w / 2} ${y + h} Z`} fill={`url(#${id})`} />
    <rect x={x - w * 0.14} y={y - 6} width={w * 0.28} height={8} rx={4} fill={color} opacity={0.85} />
  </g>
);

const Bokeh: React.FC<{ n: number; seed: string; color: string; y0?: number; y1?: number; f: number }> = ({ n, seed, color, y0 = 80, y1 = 500, f }) => (
  <g>
    {new Array(n).fill(0).map((_, i) => (
      <circle
        key={i}
        cx={(random(seed + i) * 1920 + f * (random(seed + "v" + i) - 0.5) * 0.6 + 1920) % 1920}
        cy={y0 + random(seed + "y" + i) * (y1 - y0)}
        r={10 + random(seed + "r" + i) * 26}
        fill={color}
        opacity={0.1 + 0.12 * Math.sin(f / 20 + i)}
      />
    ))}
  </g>
);

/** Floating dust motes in light. */
export const Dust: React.FC<{ f: number; color?: string; n?: number; seed?: string }> = ({ f, color = "#fff2d0", n = 40, seed = "d" }) => (
  <Full>
    {new Array(n).fill(0).map((_, i) => {
      const x = (random(seed + "x" + i) * 1920 + Math.sin(f / 50 + i) * 30 + f * 0.15) % 1920;
      const y = (random(seed + "y" + i) * 880 - f * (0.1 + random(seed + "s" + i) * 0.3) + 8800) % 880;
      return <circle key={i} cx={x} cy={y} r={1.2 + random(seed + "r" + i) * 2.2} fill={color} opacity={0.25 + 0.35 * Math.abs(Math.sin(f / 30 + i))} />;
    })}
  </Full>
);

/* ===================== PARTY ROOM ===================== */
const Balloon: React.FC<{ x: number; y: number; c: string; f: number; i: number }> = ({ x, y, c, f, i }) => {
  const dx = Math.sin(f / 40 + i) * 12;
  const dy = Math.sin(f / 33 + i * 2) * 10;
  return (
    <g transform={`translate(${x + dx} ${y + dy}) rotate(${Math.sin(f / 45 + i) * 6})`}>
      <path d={`M 0 60 Q ${10 + Math.sin(f / 15 + i) * 8} 140 0 220`} stroke="#ddd" strokeWidth={2} fill="none" opacity={0.6} />
      <ellipse cx={0} cy={0} rx={46} ry={56} fill={c} />
      <ellipse cx={-14} cy={-20} rx={10} ry={16} fill="#fff" opacity={0.35} />
      <path d="M -6 54 L 6 54 L 0 64 Z" fill={c} />
    </g>
  );
};
export const PartyRoom: React.FC<{ f: number; confetti?: number }> = ({ f, confetti = -1 }) => (
  <>
    <Full blur={4}>
      <defs>
        <linearGradient id="prw" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#402d23" />
          <stop offset="1" stopColor="#24180f" />
        </linearGradient>
        <pattern id="wall" width="80" height="80" patternUnits="userSpaceOnUse">
          <rect width="80" height="80" fill="none" />
          <path d="M 40 10 l 6 10 l -6 10 l -6 -10 Z" fill="#4a362a" />
        </pattern>
      </defs>
      <rect width={1920} height={1080} fill="url(#prw)" />
      <rect width={1920} height={880} fill="url(#wall)" opacity={0.5} />
      {/* window with living night city */}
      <rect x={1240} y={150} width={520} height={420} rx={10} fill="#0b1630" />
      {new Array(14).fill(0).map((_, i) => (
        <rect key={i} x={1250 + i * 37} y={560 - 80 - random("wb" + i) * 260} width={32} height={400} fill="#15254d" />
      ))}
      {new Array(50).fill(0).map((_, i) => (
        <rect key={i} x={1255 + random("wl" + i) * 490} y={250 + random("wly" + i) * 290} width={6} height={8} fill="#ffcf7a" opacity={random("wlo" + i + Math.floor(f / 40)) > 0.25 ? 0.8 : 0.1} />
      ))}
      {/* passing plane light */}
      <circle cx={1250 + ((f * 2) % 520)} cy={200} r={4} fill={Math.floor(f / 8) % 2 ? "#ff4d4d" : "#fff"} />
      <rect x={1240} y={150} width={520} height={420} rx={10} fill="none" stroke="#1a120c" strokeWidth={20} />
      <line x1={1500} y1={150} x2={1500} y2={570} stroke="#1a120c" strokeWidth={12} />
      {/* curtains */}
      <path d={`M 1200 130 Q ${1230 + Math.sin(f / 40) * 6} 400 1210 620 L 1270 620 Q 1260 380 1280 130 Z`} fill="#7a2f3a" />
      <path d={`M 1800 130 Q ${1770 + Math.sin(f / 37) * 6} 400 1790 620 L 1730 620 Q 1740 380 1720 130 Z`} fill="#7a2f3a" />
      {/* frames + shelf + plant + speaker */}
      <rect x={160} y={200} width={200} height={150} fill="#6a4a35" stroke="#1a120c" strokeWidth={10} />
      <circle cx={260} cy={275} r={40} fill="#e0a050" opacity={0.6} />
      <rect x={400} y={230} width={140} height={190} fill="#4a5a50" stroke="#1a120c" strokeWidth={10} />
      <rect x={120} y={520} width={520} height={18} fill="#1a120c" />
      {[150, 200, 250, 300, 340].map((x, i) => (
        <rect key={i} x={x} y={460 + (i % 2) * 10} width={36} height={60 - (i % 2) * 10} fill={["#a85a4a", "#5a7aa8", "#d9b45a", "#6a9a6a", "#8a5aa8"][i]} />
      ))}
      <g transform="translate(560 520)">
        <rect x={-30} y={-60} width={60} height={60} rx={8} fill="#8a5a3a" />
        {new Array(7).fill(0).map((_, i) => (
          <path key={i} d={`M 0 -60 Q ${-60 + i * 20} ${-140} ${-70 + i * 23 + Math.sin(f / 30 + i) * 6} ${-170 + Math.abs(i - 3) * 20}`} stroke="#4f8a4a" strokeWidth={10} fill="none" />
        ))}
      </g>
      {/* string lights */}
      <path d="M 0 90 Q 480 190 960 100 Q 1440 190 1920 90" stroke="#1a120c" strokeWidth={4} fill="none" />
      {new Array(30).fill(0).map((_, i) => {
        const t = i / 29;
        const xx = t * 1920;
        const yy = t < 0.5 ? 90 + 4 * (t / 0.5) * (1 - t / 0.5) * 60 + (t / 0.5) * 10 : 100 + 4 * ((t - 0.5) / 0.5) * (1 - (t - 0.5) / 0.5) * 60 - ((t - 0.5) / 0.5) * 10;
        return <circle key={i} cx={xx} cy={yy + 16} r={10} fill={["#ffd27a", "#ff9db8", "#9fe6ff"][i % 3]} opacity={0.55 + 0.45 * Math.sin(f / 5 + i * 1.7)} />;
      })}
    </Full>
    <Full>
      <Cone id="pc1" x={520} y={0} w={760} h={900} o={0.16} flicker={0.9 + 0.1 * Math.sin(f / 3)} />
      <Cone id="pc2" x={1400} y={0} w={760} h={900} o={0.12} />
      {[
        [250, 210, "#ff6f8f"],
        [340, 260, "#ffd166"],
        [1640, 230, "#6fd3ff"],
        [1740, 290, "#b18cff"],
        [1050, 170, "#7dff9b"],
      ].map(([x, y, c], i) => (
        <Balloon key={i} x={x as number} y={y as number} c={c as string} f={f} i={i} />
      ))}
      <rect x={0} y={880} width={1920} height={200} fill="#1a110b" />
      <ellipse cx={960} cy={930} rx={700} ry={40} fill="#5a2a2a" opacity={0.6} />
    </Full>
    {confetti >= 0 && f >= confetti && (
      <Full>
        {new Array(90).fill(0).map((_, i) => {
          const t = f - confetti;
          const x0 = 960 + (random("cx" + i) - 0.5) * 300;
          const vx = (random("cvx" + i) - 0.5) * 34;
          const vy = -18 - random("cvy" + i) * 22;
          const x = x0 + vx * t * 0.9 + Math.sin(t / 5 + i) * 10;
          const y = 520 + vy * t + 0.55 * t * t;
          if (y > 1100) return null;
          return (
            <rect key={i} x={x} y={y} width={12} height={20} fill={["#ff6f8f", "#ffd166", "#6fd3ff", "#7dff9b", "#b18cff"][i % 5]} transform={`rotate(${t * 12 + i * 40} ${x + 6} ${y + 10})`} />
          );
        })}
      </Full>
    )}
  </>
);

/* ===================== BATHROOM ===================== */
export const Bathroom: React.FC<{ f: number; red?: number }> = ({ f, red = 0 }) => (
  <>
    <Full blur={4}>
      <rect width={1920} height={1080} fill="#1d2c35" />
      {new Array(12).fill(0).map((_, i) =>
        new Array(8).fill(0).map((__, j) => <rect key={`${i}-${j}`} x={i * 165} y={j * 140} width={160} height={135} fill="#23363f" stroke="#162229" strokeWidth={5} />),
      )}
      <rect x={1180} y={140} width={520} height={620} rx={260} fill="#2f4651" stroke="#c9b48a" strokeWidth={14} />
      <ellipse cx={1440} cy={360} rx={160} ry={220} fill="#ffffff" opacity={0.05} />
      {/* shelf with bottles, towel, faucet */}
      <rect x={120} y={430} width={400} height={16} fill="#c9b48a" />
      {[150, 210, 270, 360, 430].map((x, i) => (
        <rect key={i} x={x} y={430 - 50 - (i % 3) * 18} width={36} height={50 + (i % 3) * 18} rx={8} fill={["#8fd3c8", "#f2a0b0", "#f2e2a0", "#a0b8f2", "#c8f2a0"][i]} />
      ))}
      <rect x={160} y={520} width={140} height={260} rx={10} fill="#e9d9b8" />
      <rect x={160} y={600} width={140} height={14} fill="#c99a6a" />
      {/* steam */}
      {new Array(10).fill(0).map((_, i) => (
        <circle key={i} cx={1440 + Math.sin(f / 20 + i) * 120} cy={800 - ((f * 1.2 + i * 70) % 700)} r={60 + i * 6} fill="#fff" opacity={0.035} />
      ))}
      <Bokeh n={8} seed="bt" color="#bfe9ff" f={f} />
    </Full>
    <Full>
      <Cone id="bc1" x={960} y={0} w={900} h={1000} color="#d9f2ff" o={0.15} flicker={red > 0.5 ? 0.6 + 0.4 * (Math.floor(f / 3) % 4 === 0 ? 0 : 1) : 1} />
      <rect x={0} y={880} width={1920} height={200} fill="#121c22" />
      {new Array(10).fill(0).map((_, i) => (
        <rect key={i} x={i * 200} y={880} width={196} height={200} fill="#162229" stroke="#0e171c" strokeWidth={4} />
      ))}
    </Full>
    <div style={{ position: "absolute", inset: 0, background: "#7a0f1c", opacity: red * 0.55, mixBlendMode: "multiply" }} />
  </>
);

/* ===================== LAB ===================== */
export const Lab: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Full blur={5}>
      <rect width={1920} height={1080} fill="#10262b" />
      {new Array(10).fill(0).map((_, i) => (
        <rect key={i} x={i * 200} y={0} width={4} height={880} fill="#14323a" />
      ))}
      {[0, 1].map((side) =>
        [0, 1, 2].map((row) => (
          <g key={`${side}-${row}`}>
            <rect x={side ? 1720 : 20} y={240 + row * 180} width={200} height={14} fill="#0a1719" />
            {[0, 1, 2].map((k) => {
              const bx = (side ? 1740 : 40) + k * 60;
              const by = 240 + row * 180;
              const col = ["#4fe3c1", "#ffb84d", "#7aa7ff"][(k + row) % 3];
              return (
                <g key={k}>
                  <path d={`M ${bx} ${by} l 10 -60 l 20 0 l 10 60 Z`} fill={col} opacity={0.6} />
                  {[0, 1, 2].map((b) => (
                    <circle key={b} cx={bx + 20 + Math.sin(f / 9 + b + k) * 6} cy={by - ((f * 1.3 + b * 20 + k * 9) % 60)} r={3} fill="#fff" opacity={0.6} />
                  ))}
                </g>
              );
            })}
          </g>
        )),
      )}
      {/* server rack with blinking LEDs */}
      <rect x={260} y={300} width={140} height={560} fill="#0b191c" />
      {new Array(14).fill(0).map((_, i) =>
        [0, 1, 2].map((k) => (
          <circle key={`${i}${k}`} cx={290 + k * 18} cy={330 + i * 38} r={4} fill={["#4fe3c1", "#ffb84d", "#ff5d6c"][k]} opacity={random(`led${i}${k}${Math.floor(f / 6)}`) > 0.45 ? 1 : 0.15} />
        )),
      )}
      {/* rotating DNA hologram */}
      <g transform="translate(1620 160)">
        {new Array(16).fill(0).map((_, i) => {
          const a = Math.sin(i / 2.2 + f / 12) * 40;
          return (
            <g key={i}>
              <circle cx={a} cy={i * 14} r={4} fill="#6ff0e0" />
              <circle cx={-a} cy={i * 14} r={4} fill="#ffb84d" />
            </g>
          );
        })}
      </g>
      <Bokeh n={10} seed="lb" color="#6ff0e0" f={f} y0={60} y1={300} />
    </Full>
    <Full>
      <Cone id="lc1" x={300} y={0} w={500} h={950} color="#bffcff" o={0.12} />
      <Cone id="lc2" x={1620} y={0} w={500} h={950} color="#bffcff" o={0.12} />
      <rect x={0} y={880} width={1920} height={200} fill="#0a1719" />
      <rect x={0} y={872} width={1920} height={8} fill="#2a4b50" />
      {/* floor reflection of screen */}
      <ellipse cx={1250} cy={900} rx={520} ry={22} fill="#4fe3ff" opacity={0.08 + 0.03 * Math.sin(f / 10)} />
    </Full>
    <Dust f={f} color="#c8fff6" n={30} seed="ld" />
  </>
);

/** Wall-mounted screen with scanline + glare. */
export const Screen: React.FC<{ x: number; y: number; w?: number; h?: number; children?: React.ReactNode; glow?: string; f?: number }> = ({
  x,
  y,
  w = 1000,
  h = 560,
  children,
  glow = "#4fe3ff",
  f = 0,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 18,
      background: "linear-gradient(#0b1626, #081019)",
      border: "14px solid #111418",
      boxShadow: `0 0 90px ${glow}44, 0 30px 60px rgba(0,0,0,0.6)`,
      overflow: "hidden",
    }}
  >
    {children}
    <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 5px)", pointerEvents: "none" }} />
    <div style={{ position: "absolute", left: -200, top: (f * 3) % (h + 400) - 200, width: w + 400, height: 120, background: "linear-gradient(transparent, rgba(160,240,255,0.05), transparent)", pointerEvents: "none" }} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(125deg, rgba(255,255,255,0.07) 0%, transparent 35%)", pointerEvents: "none" }} />
  </div>
);

/* ===================== DUSK STREET ===================== */
export const Street: React.FC<{ f: number; tint?: string }> = ({ f, tint = "#3a2a4a" }) => (
  <>
    <Full blur={5}>
      <defs>
        <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={tint} />
          <stop offset="1" stopColor="#e0905a" />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#sky)" />
      <circle cx={1400} cy={520} r={120} fill="#ffcf8a" opacity={0.5} />
      {[0, 1, 2].map((i) => (
        <ellipse key={i} cx={((i * 700 + f * 0.6) % 2400) - 240} cy={140 + i * 50} rx={220} ry={40} fill="#fff" opacity={0.08} />
      ))}
      {new Array(18).fill(0).map((_, i) => {
        const h = 250 + random("sb" + i) * 380;
        return <rect key={i} x={i * 110 - 20} y={760 - h} width={100} height={h} fill="#2a2036" />;
      })}
      {new Array(70).fill(0).map((_, i) => (
        <rect key={i} x={random("sw" + i) * 1920} y={300 + random("swy" + i) * 420} width={10} height={14} fill="#ffcf7a" opacity={random("swo" + i + Math.floor(f / 50)) > 0.3 ? 0.6 : 0.1} />
      ))}
      {/* birds */}
      {new Array(5).fill(0).map((_, i) => {
        const bx = ((f * 2.2 + i * 90) % 2200) - 140;
        const by = 200 + i * 18 + Math.sin(f / 10 + i) * 8;
        const w = Math.sin(f / 3 + i) * 8;
        return <path key={i} d={`M ${bx - 14} ${by - w} Q ${bx - 6} ${by - 4} ${bx} ${by} Q ${bx + 6} ${by - 4} ${bx + 14} ${by - w}`} stroke="#1a1424" strokeWidth={3} fill="none" />;
      })}
      {/* background pedestrians */}
      {[0, 1, 2].map((i) => {
        const px = ((f * (1 + i * 0.4) + i * 700) % 2100) - 90;
        return (
          <g key={i} transform={`translate(${px} 760) scale(0.32)`} opacity={0.55}>
            <circle cx={0} cy={-500} r={60} fill="#120e18" />
            <rect x={-30} y={-440} width={60} height={220} rx={20} fill="#120e18" />
            <line x1={-10} y1={-220} x2={-10 + Math.sin(f / 4 + i) * 30} y2={0} stroke="#120e18" strokeWidth={14} />
            <line x1={10} y1={-220} x2={10 - Math.sin(f / 4 + i) * 30} y2={0} stroke="#120e18" strokeWidth={14} />
          </g>
        );
      })}
      <Bokeh n={10} seed="st" color="#ffd9a0" f={f} y0={250} y1={700} />
    </Full>
    <Full blur={1.5}>
      {/* trees swaying */}
      {[110, 1820].map((x, i) => (
        <g key={x} transform={`translate(${x} 780) rotate(${Math.sin(f / 30 + i) * 1.5})`}>
          <rect x={-12} y={-320} width={24} height={320} fill="#2a1d18" />
          <circle cx={0} cy={-360} r={120} fill="#3d3a4a" />
          <circle cx={-70} cy={-300} r={80} fill="#3d3a4a" />
          <circle cx={70} cy={-300} r={80} fill="#3d3a4a" />
        </g>
      ))}
      {[500, 1360].map((x) => (
        <g key={x}>
          <rect x={x} y={250} width={12} height={540} fill="#15101c" />
          <path d={`M ${x + 6} 250 q 40 -30 70 0`} stroke="#15101c" strokeWidth={10} fill="none" />
          <circle cx={x + 76} cy={258} r={16} fill="#ffe2a8" />
        </g>
      ))}
    </Full>
    <Full>
      <Cone id="sl1" x={576} y={260} w={360} h={640} color="#ffe2a8" o={0.2} />
      <Cone id="sl2" x={1436} y={260} w={360} h={640} color="#ffe2a8" o={0.2} />
      <rect x={0} y={760} width={1920} height={120} fill="#2b2430" />
      {/* passing cars with headlights */}
      {[0, 1].map((i) => {
        const cx = i ? 2100 - ((f * 9 + 600) % 2600) : ((f * 7) % 2600) - 300;
        return (
          <g key={i} transform={`translate(${cx} 840)`}>
            <rect x={-110} y={-50} width={220} height={50} rx={18} fill="#1a1622" />
            <rect x={-70} y={-82} width={130} height={40} rx={14} fill="#1a1622" />
            <ellipse cx={i ? -110 : 110} cy={-26} rx={14} ry={8} fill="#fff6d0" />
            <path d={i ? "M -110 -26 L -420 -70 L -420 20 Z" : "M 110 -26 L 420 -70 L 420 20 Z"} fill="#fff6d0" opacity={0.08} />
            <ellipse cx={i ? 110 : -110} cy={-26} rx={8} ry={6} fill="#ff3b3b" />
          </g>
        );
      })}
      <rect x={0} y={880} width={1920} height={200} fill="#1c1720" />
      {new Array(12).fill(0).map((_, i) => (
        <rect key={i} x={i * 170} y={874} width={120} height={6} fill="#3a3040" />
      ))}
    </Full>
    <Dust f={f} color="#ffe6c0" n={25} seed="sd" />
  </>
);

/* ===================== DOCTOR'S OFFICE ===================== */
export const Office: React.FC<{ f: number }> = ({ f }) => {
  const ang = (f / 30) * 6; // second hand
  return (
    <>
      <Full blur={4}>
        <rect width={1920} height={1080} fill="#2a3a48" />
        <rect x={0} y={600} width={1920} height={280} fill="#25333f" />
        <rect x={80} y={120} width={420} height={460} fill="#9cc4e4" opacity={0.35} />
        {new Array(14).fill(0).map((_, i) => (
          <rect key={i} x={80} y={130 + i * 32} width={420} height={14 + Math.sin(f / 60) * 2} fill="#1d2a35" opacity={0.7} />
        ))}
        {/* bookshelf */}
        <rect x={1560} y={180} width={260} height={420} fill="#203040" stroke="#121a22" strokeWidth={8} />
        {[0, 1, 2, 3].map((r) => (
          <g key={r}>
            <rect x={1560} y={270 + r * 100} width={260} height={8} fill="#121a22" />
            {new Array(7).fill(0).map((_, k) => (
              <rect key={k} x={1572 + k * 34} y={270 + r * 100 - 70 + (k % 3) * 6} width={28} height={70 - (k % 3) * 6} fill={["#a85a4a", "#5a7aa8", "#d9b45a", "#6a9a6a"][(k + r) % 4]} />
            ))}
          </g>
        ))}
        {/* diplomas */}
        {[560, 700].map((x) => (
          <rect key={x} x={x} y={520} width={110} height={80} fill="#efe8da" stroke="#5a4a3a" strokeWidth={6} />
        ))}
        {/* plant */}
        <g transform="translate(1460 860)">
          <rect x={-40} y={-80} width={80} height={80} rx={10} fill="#c97a4a" />
          {new Array(8).fill(0).map((_, i) => (
            <ellipse key={i} cx={Math.cos(i) * 50} cy={-140 - Math.sin(i * 2) * 40} rx={22} ry={60} fill="#4f8a4a" transform={`rotate(${i * 45 + Math.sin(f / 35 + i) * 5} ${Math.cos(i) * 50} ${-140 - Math.sin(i * 2) * 40})`} />
          ))}
        </g>
        <Bokeh n={6} seed="of" color="#d8ecff" f={f} />
      </Full>
      <Full blur={1}>
        {/* wall clock (sharp-ish, ticking) */}
        <g transform="translate(1100 150)">
          <circle r={60} fill="#efe8da" stroke="#1d2a35" strokeWidth={8} />
          <line x1={0} y1={0} x2={0} y2={-38} stroke="#1d2a35" strokeWidth={6} transform={`rotate(${f / 10})`} />
          <line x1={0} y1={0} x2={0} y2={-50} stroke="#e8343f" strokeWidth={3} transform={`rotate(${Math.floor(ang)})`} />
        </g>
      </Full>
      <Full>
        <Cone id="oc1" x={960} y={0} w={1100} h={1000} color="#eaf6ff" o={0.12} />
        <rect x={0} y={880} width={1920} height={200} fill="#1a242e" />
      </Full>
      <Dust f={f} color="#eaf6ff" n={20} seed="od" />
    </>
  );
};

/* ===================== AQUARIUM ===================== */
export const Aquarium: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Full blur={3}>
      <defs>
        <linearGradient id="aq" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#0a5d80" />
          <stop offset="1" stopColor="#031726" />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#aq)" />
      {new Array(14).fill(0).map((_, i) => (
        <path key={i} d={`M ${i * 150 + Math.sin(f / 30 + i) * 40} 0 L ${i * 150 + 80 + Math.sin(f / 25 + i) * 60} 900`} stroke="#7fe0ff" strokeWidth={30} opacity={0.05} />
      ))}
      {/* fish school */}
      {new Array(24).fill(0).map((_, i) => {
        const x = ((f * (2 + (i % 3)) + random("fx" + i) * 2400) % 2400) - 240;
        const y = 180 + random("fy" + i) * 500 + Math.sin(f / 15 + i) * 12;
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${0.6 + random("fs" + i) * 0.6})`} opacity={0.5}>
            <path d="M 0 0 Q 20 -14 40 0 Q 20 14 0 0 Z M 0 0 L -14 -10 L -14 10 Z" fill="#9fe8ff" />
          </g>
        );
      })}
      {/* seaweed */}
      {new Array(12).fill(0).map((_, i) => {
        const x = 40 + i * 170;
        let d = `M ${x} 880`;
        for (let k = 1; k <= 8; k++) d += ` Q ${x + Math.sin(f / 18 + k + i) * 22} ${880 - k * 30 + 15} ${x + Math.sin(f / 20 + k * 0.7 + i) * 18} ${880 - k * 30}`;
        return <path key={i} d={d} stroke="#1f7a5a" strokeWidth={12} fill="none" strokeLinecap="round" />;
      })}
      {new Array(30).fill(0).map((_, i) => (
        <circle key={i} cx={random("bub" + i) * 1920 + Math.sin(f / 10 + i) * 6} cy={(random("bby" + i) * 1080 - f * (1 + random("bv" + i)) + 2000) % 1080} r={3 + random("bbr" + i) * 6} fill="#bff3ff" opacity={0.35} />
      ))}
    </Full>
    <Full>
      <rect x={0} y={860} width={1920} height={220} fill="#020d16" />
      <rect x={0} y={852} width={1920} height={10} fill="#1d5f7d" />
      {new Array(6).fill(0).map((_, i) => (
        <ellipse key={i} cx={(i * 380 + Math.sin(f / 20 + i) * 60) % 1920} cy={960} rx={160} ry={14} fill="#5fd0ff" opacity={0.06} />
      ))}
    </Full>
  </>
);

/* ===================== PERSPECTIVE CORRIDOR ===================== */
export const Corridor: React.FC<{ signs: string[]; travel: number; cool?: boolean; signColor?: string; f?: number }> = ({
  signs,
  travel,
  cool,
  signColor = "#d9cdb5",
  f = 0,
}) => {
  const VX = 960;
  const VY = 430;
  const wall = cool ? "#1b2b3a" : "#3a2c22";
  const wall2 = cool ? "#142230" : "#2c2119";
  return (
    <>
      <Full blur={2}>
        <rect width={1920} height={1080} fill={wall2} />
        <path d={`M 0 0 L ${VX - 170} ${VY - 140} L ${VX - 170} ${VY + 160} L 0 1080 Z`} fill={wall} />
        <path d={`M 1920 0 L ${VX + 170} ${VY - 140} L ${VX + 170} ${VY + 160} L 1920 1080 Z`} fill={wall} />
        <path d={`M 0 0 L ${VX - 170} ${VY - 140} L ${VX + 170} ${VY - 140} L 1920 0 Z`} fill={cool ? "#0f1a24" : "#22180f"} />
        <path d={`M 0 1080 L ${VX - 170} ${VY + 160} L ${VX + 170} ${VY + 160} L 1920 1080 Z`} fill={cool ? "#0c141c" : "#1a120b"} />
        {/* floor center stripe receding */}
        {new Array(10).fill(0).map((_, i) => {
          const z = ((i + travel * 3) % 10) / 10;
          const k = z ** 2.2;
          const y = VY + 160 + (1080 - VY - 160) * k;
          const w = 12 + 120 * k;
          return <rect key={i} x={VX - w / 2} y={y} width={w} height={6 + 30 * k} fill={cool ? "#2a4a66" : "#5a4028"} opacity={0.6} />;
        })}
        {/* side doors receding */}
        {new Array(6).fill(0).map((_, i) => {
          const z = ((i + travel * 1.5) % 6) / 6;
          const k = z ** 2;
          return [-1, 1].map((side) => {
            const x = VX + side * (170 + 790 * k);
            const top = VY - 140 + (-(VY - 140) + 120) * k * 0.9;
            const h = 260 + 700 * k;
            return <rect key={`${i}${side}`} x={side > 0 ? x - 30 - 140 * k : x + 30} y={top + 40} width={20 + 140 * k} height={h * 0.7} fill={cool ? "#24384c" : "#4a3626"} opacity={0.8} />;
          });
        })}
        <rect x={VX - 170} y={VY - 140} width={340} height={300} fill={cool ? "#9fd2ff" : "#ffd9a0"} opacity={0.25} />
        {new Array(8).fill(0).map((_, i) => {
          const z = ((i + travel * 2) % 8) / 8;
          const k = Math.pow(z, 2.2);
          const cy = VY - 140 + (0 - (VY - 140)) * k;
          const w = 80 + 700 * k;
          const flick = cool && i === 3 ? (Math.floor(f / 4) % 7 === 0 ? 0.3 : 1) : 1;
          return [-1, 1].map((side) => (
            <Cone key={`${i}-${side}`} id={`cc${i}${side}`} x={VX + side * (170 + (960 - 170) * k) * 0.55} y={cy} w={w} h={200 + 900 * k} color={cool ? "#cfe9ff" : "#ffdcae"} o={0.18} flicker={flick} />
          ));
        })}
      </Full>
      <Full>
        {signs.map((s, i) => {
          const r = i + 1.2 - travel;
          if (r < 0.32) return null;
          const sc = Math.min(1.6, 0.8 / r);
          const side = i % 2 ? 1 : -1;
          const x = VX + side * (230 / r + 20);
          const y = VY - 40 - 90 / r;
          return (
            <g key={s} transform={`translate(${x} ${y}) scale(${sc})`} opacity={Math.min(1, (r - 0.32) * 4)}>
              <rect x={-110} y={-48} width={220} height={96} rx={10} fill={signColor} />
              <rect x={-110} y={-48} width={220} height={96} rx={10} fill="none" stroke="#fff" strokeWidth={3} opacity={0.4} />
              <text x={0} y={22} textAnchor="middle" fontFamily="Arial Black, sans-serif" fontWeight={900} fontSize={s.length > 5 ? 34 : 60} fill="#2a2018">
                {s}
              </text>
            </g>
          );
        })}
      </Full>
      <Dust f={f} color={cool ? "#dff2ff" : "#fff0d0"} n={35} seed="cd" />
    </>
  );
};

/* ===================== CEMETERY + FUTURE SKYLINE ===================== */
export const Cemetery: React.FC<{ f: number; era: number; mix: number }> = ({ f, era, mix }) => {
  const city = (e: number, op: number) =>
    new Array(20).fill(0).map((_, i) => {
      const h = 140 + random(`ce${e}-${i}`) * (220 + e * 50);
      const w = 70 + random(`cw${e}-${i}`) * 40;
      const x = i * 100 - 10;
      const shape = e % 3;
      return (
        <g key={`${e}-${i}`} opacity={op}>
          {shape === 2 ? <path d={`M ${x} 700 L ${x + w / 2} ${700 - h} L ${x + w} 700 Z`} fill="#2a2346" /> : <rect x={x} y={700 - h} width={w} height={h} rx={shape ? w / 2 : 4} fill="#2a2346" />}
          {shape !== 2 && <circle cx={x + w / 2} cy={700 - h - 10} r={5} fill="#ff4d6d" opacity={Math.floor(f / 15 + i) % 2 ? 1 : 0.2} />}
        </g>
      );
    });
  return (
    <>
      <Full blur={6}>
        <defs>
          <linearGradient id="cem" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#2a2350" />
            <stop offset="0.7" stopColor="#c46a5a" />
          </linearGradient>
        </defs>
        <rect width={1920} height={1080} fill="url(#cem)" />
        {[0, 1, 2, 3].map((i) => (
          <ellipse key={i} cx={((i * 600 + f * 0.8) % 2400) - 240} cy={120 + i * 40} rx={260} ry={36} fill="#fff" opacity={0.07} />
        ))}
        {city(era, 1 - mix)}
        {city(era + 1, mix)}
        {/* flying vehicles / drones in the future */}
        {era >= 2 &&
          new Array(6).fill(0).map((_, i) => (
            <g key={i} transform={`translate(${((f * (3 + i) + i * 400) % 2200) - 140} ${250 + i * 45})`}>
              <rect x={-20} y={-6} width={40} height={12} rx={6} fill="#14102a" />
              <circle cx={20} cy={0} r={3} fill="#7fe6ff" />
            </g>
          ))}
        <Bokeh n={8} seed="cm" color="#ffd0a0" f={f} y0={300} y1={650} />
      </Full>
      <Full blur={1.5}>
        <rect x={0} y={700} width={1920} height={380} fill="#1d1a2a" />
        {/* bare trees */}
        {[150, 1780].map((x, i) => (
          <g key={x} transform={`translate(${x} 760) rotate(${Math.sin(f / 40 + i) * 1})`} stroke="#120f1c" strokeWidth={14} fill="none" strokeLinecap="round">
            <path d="M 0 0 L 0 -320" />
            <path d="M 0 -200 L -90 -300" />
            <path d="M 0 -250 L 80 -360" />
            <path d="M -50 -255 L -60 -330" />
          </g>
        ))}
        {new Array(9).fill(0).map((_, i) => (
          <g key={i} transform={`translate(${120 + i * 215} 760)`}>
            <path d="M -40 90 L -40 0 Q -40 -46 0 -46 Q 40 -46 40 0 L 40 90 Z" fill="#3b3852" />
            <path d="M -8 -20 L 8 -20 M 0 -30 L 0 0" stroke="#5a5672" strokeWidth={5} />
          </g>
        ))}
      </Full>
      <Full>
        {/* fireflies */}
        {new Array(20).fill(0).map((_, i) => (
          <circle key={i} cx={random("ffx" + i) * 1920 + Math.sin(f / 25 + i) * 40} cy={620 + random("ffy" + i) * 220 + Math.cos(f / 30 + i) * 20} r={4} fill="#ffe680" opacity={0.3 + 0.7 * Math.abs(Math.sin(f / 12 + i * 3))} />
        ))}
        <rect x={0} y={880} width={1920} height={200} fill="#14121e" />
        <rect x={0} y={860} width={1920} height={40} fill="#1a1a14" opacity={0.6} />
      </Full>
    </>
  );
};

/* ===================== CAR INTERIOR ===================== */
export const CarInterior: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Full blur={4}>
      <rect width={1920} height={1080} fill="#233140" />
      <rect x={560} y={0} width={380} height={1080} fill="#2d3e50" />
      <rect x={980} y={0} width={380} height={1080} fill="#2d3e50" />
      {[640, 1060].map((x0) =>
        new Array(5).fill(0).map((_, i) => new Array(8).fill(0).map((__, j) => <circle key={`${x0}${i}${j}`} cx={x0 + i * 50} cy={180 + j * 75} r={9} fill="#46586b" />)),
      )}
      {/* window: passing lights + rain streaks */}
      <rect x={1440} y={160} width={420} height={300} rx={40} fill="#0d1622" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={1440 + ((f * 22 + i * 200) % 620) - 100} cy={250 + i * 30} r={26} fill={i === 1 ? "#ff9a5a" : "#ffcf7a"} opacity={0.6} />
      ))}
      {new Array(18).fill(0).map((_, i) => (
        <line key={i} x1={1460 + random("rx" + i) * 380} y1={((f * 14 + random("ry" + i) * 300) % 300) + 160} x2={1450 + random("rx" + i) * 380} y2={((f * 14 + random("ry" + i) * 300) % 300) + 190} stroke="#9fc8ff" strokeWidth={2} opacity={0.5} />
      ))}
      <ellipse cx={260} cy={700} rx={260} ry={200} fill="#c47a3a" opacity={0.2 + 0.1 * Math.sin(f / 8)} />
    </Full>
    <Full>
      <rect x={0} y={900} width={1920} height={180} fill="#111a24" />
    </Full>
  </>
);

/* ===================== GARAGE ===================== */
export const Garage: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Full blur={5}>
      <rect width={1920} height={1080} fill="#1b1d24" />
      {new Array(10).fill(0).map((_, i) => (
        <rect key={i} x={0} y={120 + i * 60} width={1920} height={6} fill="#262934" />
      ))}
      {/* pegboard with tools */}
      <rect x={120} y={200} width={420} height={300} fill="#3a3326" />
      {new Array(6).fill(0).map((_, i) => (
        <rect key={i} x={150 + i * 64} y={230} width={14} height={120 + (i % 3) * 30} rx={4} fill="#8a8f9a" />
      ))}
      <circle cx={420} cy={420} r={40} fill="none" stroke="#8a8f9a" strokeWidth={10} />
      <rect x={1500} y={260} width={300} height={200} fill="#2b2f3a" />
      <Bokeh n={6} seed="gr" color="#ffb36b" f={f} />
    </Full>
    <Full>
      {/* swinging hanging bulb */}
      <g transform={`rotate(${Math.sin(f / 25) * 4} 960 0)`}>
        <line x1={960} y1={0} x2={960} y2={140} stroke="#111" strokeWidth={4} />
        <circle cx={960} cy={150} r={16} fill="#fff1c4" />
        <Cone id="gc1" x={960} y={150} w={1100} h={850} color="#ffd29a" o={0.22} />
      </g>
      <rect x={0} y={880} width={1920} height={200} fill="#121318" />
      <ellipse cx={1150} cy={900} rx={300} ry={20} fill="#000" opacity={0.4} />
    </Full>
    <Dust f={f} color="#ffe6c0" n={30} seed="gd" />
  </>
);

/* ===================== PARK ===================== */
export const Park: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Full blur={6}>
      <defs>
        <linearGradient id="pk" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f2a65a" />
          <stop offset="1" stopColor="#6d4a7a" />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#pk)" />
      <circle cx={1500} cy={420} r={140} fill="#ffe0a0" opacity={0.7} />
      {new Array(9).fill(0).map((_, i) => (
        <ellipse key={i} cx={i * 240} cy={680} rx={200} ry={120} fill="#4a3a5a" />
      ))}
      <Bokeh n={12} seed="pk" color="#fff0c0" f={f} y0={200} y1={600} />
    </Full>
    <Full>
      {/* sun rays */}
      {new Array(6).fill(0).map((_, i) => (
        <path key={i} d={`M 1500 420 L ${-200 + i * 260} 1080 L ${-120 + i * 260} 1080 Z`} fill="#ffe6a8" opacity={0.035 + 0.015 * Math.sin(f / 20 + i)} />
      ))}
      <rect x={0} y={700} width={1920} height={380} fill="#3a2f45" />
      {/* grass tufts swaying */}
      {new Array(40).fill(0).map((_, i) => {
        const x = i * 50 + 10;
        return <path key={i} d={`M ${x} 880 Q ${x + 4} 850 ${x + 10 + Math.sin(f / 15 + i) * 6} 830`} stroke="#4a5a3a" strokeWidth={5} fill="none" />;
      })}
      <rect x={0} y={880} width={1920} height={200} fill="#241c2c" />
      {/* falling leaves */}
      {new Array(16).fill(0).map((_, i) => {
        const t = (f * (1 + random("lv" + i)) + random("lt" + i) * 900) % 900;
        const x = random("lx" + i) * 1920 + Math.sin(t / 20 + i) * 50;
        return <ellipse key={i} cx={x} cy={t} rx={9} ry={5} fill={["#e0a040", "#c96a3a", "#7a9a4a"][i % 3]} transform={`rotate(${t * 3} ${x} ${t})`} />;
      })}
    </Full>
  </>
);

/* ===================== NIGHT WINDOW ===================== */
export const NightWindow: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Full blur={4}>
      <rect width={1920} height={1080} fill="#141c2e" />
      <rect x={1100} y={110} width={680} height={560} fill="#0a1224" />
      <circle cx={1600} cy={240} r={60} fill="#e8f0ff" opacity={0.7} />
      {[0, 1].map((i) => (
        <ellipse key={i} cx={1100 + ((f * 0.8 + i * 400) % 900)} cy={220 + i * 60} rx={140} ry={26} fill="#2a3450" opacity={0.8} />
      ))}
      {new Array(40).fill(0).map((_, i) => (
        <circle key={i} cx={1110 + random("ns" + i) * 660} cy={120 + random("nsy" + i) * 300} r={2} fill="#fff" opacity={0.4 + 0.4 * Math.sin(f / 10 + i)} />
      ))}
      {new Array(12).fill(0).map((_, i) => (
        <rect key={i} x={1110 + i * 56} y={670 - 60 - random("nb" + i) * 200} width={50} height={300} fill="#111a30" />
      ))}
      {new Array(30).fill(0).map((_, i) => (
        <rect key={i} x={1115 + random("nw" + i) * 650} y={480 + random("nwy" + i) * 180} width={6} height={8} fill="#ffcf7a" opacity={random("nwo" + i + Math.floor(f / 45)) > 0.3 ? 0.7 : 0.05} />
      ))}
      {/* rain on glass */}
      {new Array(24).fill(0).map((_, i) => (
        <line key={i} x1={1110 + random("rr" + i) * 660} y1={((f * 10 + random("rry" + i) * 560) % 560) + 110} x2={1108 + random("rr" + i) * 660} y2={((f * 10 + random("rry" + i) * 560) % 560) + 140} stroke="#9fc8ff" strokeWidth={2} opacity={0.35} />
      ))}
      <rect x={1100} y={110} width={680} height={560} fill="none" stroke="#0a0e18" strokeWidth={20} />
      <line x1={1440} y1={110} x2={1440} y2={670} stroke="#0a0e18" strokeWidth={14} />
      {/* bookshelf left */}
      <rect x={40} y={200} width={160} height={600} fill="#1c2438" />
      {[0, 1, 2, 3].map((r) => (
        <rect key={r} x={40} y={320 + r * 130} width={160} height={8} fill="#0e1424" />
      ))}
      <ellipse cx={330} cy={520} rx={380} ry={300} fill="#ffb35c" opacity={0.18 + 0.03 * Math.sin(f / 4)} />
    </Full>
    <Full>
      <Cone id="nw1" x={330} y={260} w={500} h={640} color="#ffcf8a" o={0.25} flicker={0.92 + 0.08 * Math.sin(f / 3.3)} />
      <path d="M 280 250 L 380 250 L 360 200 L 300 200 Z" fill="#c9893d" />
      <line x1={330} y1={0} x2={330} y2={200} stroke="#0a0e18" strokeWidth={4} />
      <rect x={0} y={880} width={1920} height={200} fill="#0c111c" />
      {/* steaming mug */}
      {new Array(3).fill(0).map((_, i) => (
        <path key={i} d={`M ${1080 + i * 14} ${715 - ((f * 0.8 + i * 15) % 50)} q 10 -15 0 -30`} stroke="#ffffff" strokeWidth={3} fill="none" opacity={0.25} />
      ))}
    </Full>
  </>
);
