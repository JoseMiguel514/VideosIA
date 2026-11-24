import React from "react";
import { random } from "remotion";

/* Cinematic environments: detailed but uncluttered, soft depth blur, practical light cones.
 * Characters stay flat on top of these. All drawn in a 1920x1080 space. */

const Full: React.FC<{ children: React.ReactNode; blur?: number; style?: React.CSSProperties }> = ({ children, blur = 0, style }) => (
  <div style={{ position: "absolute", inset: 0, filter: blur ? `blur(${blur}px)` : undefined, ...style }}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {children}
    </svg>
  </div>
);

/** Volumetric light cone from a ceiling fixture. */
export const Cone: React.FC<{ x: number; y: number; w: number; h: number; color?: string; o?: number; id: string }> = ({
  x,
  y,
  w,
  h,
  color = "#ffd9a0",
  o = 0.22,
  id,
}) => (
  <g>
    <defs>
      <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor={color} stopOpacity={o} />
        <stop offset="1" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
    <path d={`M ${x - w * 0.12} ${y} L ${x + w * 0.12} ${y} L ${x + w / 2} ${y + h} L ${x - w / 2} ${y + h} Z`} fill={`url(#${id})`} />
    <rect x={x - w * 0.14} y={y - 6} width={w * 0.28} height={8} rx={4} fill={color} opacity={0.8} />
  </g>
);

const Bokeh: React.FC<{ n: number; seed: string; color: string; y0?: number; y1?: number; f: number }> = ({ n, seed, color, y0 = 80, y1 = 500, f }) => (
  <g>
    {new Array(n).fill(0).map((_, i) => (
      <circle
        key={i}
        cx={random(seed + i) * 1920}
        cy={y0 + random(seed + "y" + i) * (y1 - y0)}
        r={10 + random(seed + "r" + i) * 26}
        fill={color}
        opacity={0.12 + 0.12 * Math.sin(f / 20 + i)}
      />
    ))}
  </g>
);

/* ---- Night apartment party room (warm practical light) ---- */
export const PartyRoom: React.FC<{ f: number; frost?: number }> = ({ f }) => (
  <>
    <Full blur={4}>
      <defs>
        <linearGradient id="prw" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#3b2a22" />
          <stop offset="1" stopColor="#24180f" />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#prw)" />
      {/* window with city night */}
      <rect x={1240} y={150} width={520} height={420} rx={10} fill="#0e1a33" stroke="#1a120c" strokeWidth={18} />
      {new Array(14).fill(0).map((_, i) => (
        <rect key={i} x={1260 + i * 36} y={560 - 80 - random("wb" + i) * 260} width={30} height={400} fill="#14244a" />
      ))}
      {new Array(40).fill(0).map((_, i) => (
        <rect key={i} x={1265 + random("wl" + i) * 480} y={260 + random("wly" + i) * 280} width={6} height={8} fill="#ffcf7a" opacity={0.7} />
      ))}
      <line x1={1500} y1={150} x2={1500} y2={570} stroke="#1a120c" strokeWidth={12} />
      {/* framed pictures + shelf */}
      <rect x={160} y={200} width={200} height={150} fill="#5a4030" stroke="#1a120c" strokeWidth={10} />
      <rect x={400} y={230} width={140} height={190} fill="#4a5a50" stroke="#1a120c" strokeWidth={10} />
      <rect x={120} y={520} width={520} height={18} fill="#1a120c" />
      {/* string lights */}
      <path d="M 0 90 Q 480 190 960 100 Q 1440 190 1920 90" stroke="#1a120c" strokeWidth={4} fill="none" />
      {new Array(24).fill(0).map((_, i) => {
        const t = i / 23;
        const xx = t * 1920;
        const yy = 90 + Math.sin(t * Math.PI * 2) * -45 + 50 * Math.sin(t * Math.PI * 2) ** 2;
        return <circle key={i} cx={xx} cy={yy + 18} r={9} fill={i % 3 ? "#ffd27a" : "#ff9db8"} opacity={0.7 + 0.3 * Math.sin(f / 6 + i)} />;
      })}
    </Full>
    <Full>
      <Cone id="pc1" x={520} y={0} w={700} h={900} o={0.16} />
      <Cone id="pc2" x={1400} y={0} w={700} h={900} o={0.12} />
      <rect x={0} y={880} width={1920} height={200} fill="#1a110b" />
    </Full>
  </>
);

/* ---- Bathroom / bedroom mirror wall (cool) ---- */
export const Bathroom: React.FC<{ f: number; red?: number }> = ({ f, red = 0 }) => (
  <>
    <Full blur={4}>
      <rect width={1920} height={1080} fill="#1d2c35" />
      {new Array(12).fill(0).map((_, i) =>
        new Array(8).fill(0).map((__, j) => (
          <rect key={`${i}-${j}`} x={i * 165} y={j * 140} width={160} height={135} fill="#23363f" stroke="#162229" strokeWidth={5} />
        )),
      )}
      <rect x={1180} y={140} width={520} height={620} rx={260} fill="#2f4651" stroke="#c9b48a" strokeWidth={14} />
      <ellipse cx={1440} cy={360} rx={160} ry={220} fill="#ffffff" opacity={0.05} />
      <Bokeh n={8} seed="bt" color="#bfe9ff" f={f} />
    </Full>
    <Full>
      <Cone id="bc1" x={960} y={0} w={900} h={1000} color="#d9f2ff" o={0.15} />
      <rect x={0} y={880} width={1920} height={200} fill="#121c22" />
    </Full>
    <div style={{ position: "absolute", inset: 0, background: "#7a0f1c", opacity: red * 0.55, mixBlendMode: "multiply" }} />
  </>
);

/* ---- Lab with a big wall screen (cool teal) ---- */
export const Lab: React.FC<{ f: number; screen?: boolean }> = ({ f }) => (
  <>
    <Full blur={5}>
      <rect width={1920} height={1080} fill="#10262b" />
      {/* shelves with flasks */}
      {[0, 1].map((side) =>
        [0, 1, 2].map((row) => (
          <g key={`${side}-${row}`}>
            <rect x={side ? 1720 : 20} y={240 + row * 180} width={200} height={14} fill="#0a1719" />
            {[0, 1, 2].map((k) => (
              <path
                key={k}
                d={`M ${(side ? 1740 : 40) + k * 60} ${240 + row * 180} l 10 -60 l 20 0 l 10 60 Z`}
                fill={["#4fe3c1", "#ffb84d", "#7aa7ff"][(k + row) % 3]}
                opacity={0.55}
              />
            ))}
          </g>
        )),
      )}
      <Bokeh n={10} seed="lb" color="#6ff0e0" f={f} y0={60} y1={300} />
    </Full>
    <Full>
      <Cone id="lc1" x={300} y={0} w={500} h={950} color="#bffcff" o={0.12} />
      <Cone id="lc2" x={1620} y={0} w={500} h={950} color="#bffcff" o={0.12} />
      <rect x={0} y={880} width={1920} height={200} fill="#0a1719" />
      <rect x={0} y={872} width={1920} height={8} fill="#2a4b50" />
    </Full>
  </>
);

/** Wall-mounted screen frame; children render inside a 1000x560 viewport. */
export const Screen: React.FC<{ x: number; y: number; w?: number; h?: number; children?: React.ReactNode; glow?: string }> = ({
  x,
  y,
  w = 1000,
  h = 560,
  children,
  glow = "#4fe3ff",
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
      boxShadow: `0 0 80px ${glow}33, 0 30px 60px rgba(0,0,0,0.6)`,
      overflow: "hidden",
    }}
  >
    {children}
  </div>
);

/* ---- Dusk street / park ---- */
export const Street: React.FC<{ f: number; tint?: string }> = ({ f, tint = "#3a2a4a" }) => (
  <>
    <Full blur={5}>
      <defs>
        <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={tint} />
          <stop offset="1" stopColor="#d9895a" />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#sky)" />
      {new Array(18).fill(0).map((_, i) => {
        const h = 250 + random("sb" + i) * 380;
        return <rect key={i} x={i * 110 - 20} y={760 - h} width={100} height={h} fill="#2a2036" />;
      })}
      {new Array(60).fill(0).map((_, i) => (
        <rect key={i} x={random("sw" + i) * 1920} y={300 + random("swy" + i) * 420} width={10} height={14} fill="#ffcf7a" opacity={0.55} />
      ))}
      {[220, 1700].map((x) => (
        <g key={x}>
          <rect x={x} y={300} width={12} height={480} fill="#15101c" />
          <circle cx={x + 6} cy={300} r={22} fill="#ffe2a8" />
        </g>
      ))}
      <Bokeh n={10} seed="st" color="#ffd9a0" f={f} y0={250} y1={700} />
    </Full>
    <Full>
      <rect x={0} y={760} width={1920} height={320} fill="#2b2430" />
      <rect x={0} y={880} width={1920} height={200} fill="#1c1720" />
    </Full>
  </>
);

/* ---- Doctor's office (clean, cool-white) ---- */
export const Office: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Full blur={4}>
      <rect width={1920} height={1080} fill="#2a3a48" />
      <rect x={80} y={120} width={420} height={460} fill="#9cc4e4" opacity={0.35} />
      {new Array(14).fill(0).map((_, i) => (
        <rect key={i} x={80} y={130 + i * 32} width={420} height={14} fill="#1d2a35" opacity={0.7} />
      ))}
      <rect x={1560} y={180} width={260} height={360} fill="#203040" stroke="#121a22" strokeWidth={8} />
      <Bokeh n={6} seed="of" color="#d8ecff" f={f} />
    </Full>
    <Full>
      <Cone id="oc1" x={960} y={0} w={1100} h={1000} color="#eaf6ff" o={0.12} />
      <rect x={0} y={880} width={1920} height={200} fill="#1a242e" />
    </Full>
  </>
);

/* ---- Aquarium tunnel (cool blue, caustics) ---- */
export const Aquarium: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Full blur={3}>
      <defs>
        <linearGradient id="aq" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#0a4d6e" />
          <stop offset="1" stopColor="#031726" />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#aq)" />
      {new Array(14).fill(0).map((_, i) => (
        <path
          key={i}
          d={`M ${i * 150 + Math.sin(f / 30 + i) * 40} 0 L ${i * 150 + 80 + Math.sin(f / 25 + i) * 60} 900`}
          stroke="#7fe0ff"
          strokeWidth={30}
          opacity={0.05}
        />
      ))}
      {new Array(30).fill(0).map((_, i) => (
        <circle key={i} cx={random("bub" + i) * 1920} cy={(random("bby" + i) * 1080 - f * (1 + random("bv" + i)) + 2000) % 1080} r={3 + random("bbr" + i) * 6} fill="#bff3ff" opacity={0.35} />
      ))}
    </Full>
    <Full>
      <rect x={0} y={860} width={1920} height={220} fill="#020d16" />
      <rect x={0} y={852} width={1920} height={10} fill="#1d5f7d" />
    </Full>
  </>
);

/* ---- Perspective corridor (airplane-aisle style) with numbered wall signs ---- */
export const Corridor: React.FC<{ signs: string[]; travel: number; cool?: boolean; signColor?: string }> = ({
  signs,
  travel,
  cool,
  signColor = "#d9cdb5",
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
        <rect x={VX - 170} y={VY - 140} width={340} height={300} fill={cool ? "#9fd2ff" : "#ffd9a0"} opacity={0.25} />
        {/* repeating ceiling light cones receding */}
        {new Array(8).fill(0).map((_, i) => {
          const z = ((i + travel * 2) % 8) / 8; // 0 far .. 1 near
          const k = Math.pow(z, 2.2);
          const cy = VY - 140 + (0 - (VY - 140)) * k;
          const w = 80 + 700 * k;
          return [-1, 1].map((side) => (
            <Cone
              key={`${i}-${side}`}
              id={`cc${i}${side}`}
              x={VX + side * (170 + (960 - 170) * k) * 0.55}
              y={cy}
              w={w}
              h={200 + 900 * k}
              color={cool ? "#cfe9ff" : "#ffdcae"}
              o={0.18}
            />
          ));
        })}
      </Full>
      {/* wall signs */}
      <Full>
        {signs.map((s, i) => {
          // sign i sits at distance i+1; camera has advanced `travel` units
          const r = i + 1.2 - travel;
          if (r < 0.32) return null;
          const sc = Math.min(1.6, 0.8 / r);
          const side = i % 2 ? 1 : -1;
          const x = VX + side * (230 / r + 20);
          const y = VY - 40 - 90 / r;
          return (
            <g key={s} transform={`translate(${x} ${y}) scale(${sc})`} opacity={Math.min(1, (r - 0.32) * 4)}>
              <rect x={-110} y={-48} width={220} height={96} rx={10} fill={signColor} />
              <text x={0} y={22} textAnchor="middle" fontFamily="Arial Black, sans-serif" fontWeight={900} fontSize={s.length > 5 ? 34 : 60} fill="#2a2018">
                {s}
              </text>
            </g>
          );
        })}
      </Full>
    </>
  );
};

/* ---- Cemetery at dusk with a future skyline (changes era by era) ---- */
export const Cemetery: React.FC<{ f: number; era: number; mix: number }> = ({ f, era, mix }) => {
  const city = (e: number, op: number) =>
    new Array(20).fill(0).map((_, i) => {
      const h = 140 + random(`ce${e}-${i}`) * (220 + e * 50);
      const w = 70 + random(`cw${e}-${i}`) * 40;
      const x = i * 100 - 10;
      const shape = e % 3;
      return shape === 2 ? (
        <path key={`${e}-${i}`} d={`M ${x} 700 L ${x + w / 2} ${700 - h} L ${x + w} 700 Z`} fill="#2a2346" opacity={op} />
      ) : (
        <rect key={`${e}-${i}`} x={x} y={700 - h} width={w} height={h} rx={shape ? w / 2 : 4} fill="#2a2346" opacity={op} />
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
        {city(era, 1 - mix)}
        {city(era + 1, mix)}
        <Bokeh n={8} seed="cm" color="#ffd0a0" f={f} y0={300} y1={650} />
      </Full>
      <Full blur={1.5}>
        <rect x={0} y={700} width={1920} height={380} fill="#1d1a2a" />
        {new Array(9).fill(0).map((_, i) => (
          <g key={i} transform={`translate(${120 + i * 215} 760)`}>
            <path d="M -40 90 L -40 0 Q -40 -46 0 -46 Q 40 -46 40 0 L 40 90 Z" fill="#3b3852" />
          </g>
        ))}
      </Full>
      <Full>
        <rect x={0} y={880} width={1920} height={200} fill="#14121e" />
      </Full>
    </>
  );
};

/* ---- Car interior (reference frame style: blue-gray, seat, dot panels) ---- */
export const CarInterior: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Full blur={4}>
      <rect width={1920} height={1080} fill="#233140" />
      <rect x={560} y={0} width={380} height={1080} fill="#2d3e50" />
      <rect x={980} y={0} width={380} height={1080} fill="#2d3e50" />
      {[640, 1060].map((x0) =>
        new Array(5).fill(0).map((_, i) =>
          new Array(8).fill(0).map((__, j) => <circle key={`${x0}${i}${j}`} cx={x0 + i * 50} cy={180 + j * 75} r={9} fill="#46586b" />),
        ),
      )}
      {/* passing street lights through window */}
      <rect x={1440} y={160} width={420} height={300} rx={40} fill="#0d1622" />
      <circle cx={1440 + ((f * 18) % 600)} cy={260} r={30} fill="#ffcf7a" opacity={0.6} />
      <ellipse cx={260} cy={700} rx={260} ry={200} fill="#c47a3a" opacity={0.2} />
    </Full>
    <Full>
      <rect x={0} y={900} width={1920} height={180} fill="#111a24" />
    </Full>
  </>
);

/* ---- Garage at night ---- */
export const Garage: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Full blur={5}>
      <rect width={1920} height={1080} fill="#1b1d24" />
      {new Array(10).fill(0).map((_, i) => (
        <rect key={i} x={0} y={120 + i * 60} width={1920} height={6} fill="#262934" />
      ))}
      <rect x={1500} y={260} width={300} height={200} fill="#2b2f3a" />
      <Bokeh n={6} seed="gr" color="#ffb36b" f={f} />
    </Full>
    <Full>
      <Cone id="gc1" x={960} y={0} w={1000} h={1000} color="#ffd29a" o={0.2} />
      <rect x={0} y={880} width={1920} height={200} fill="#121318" />
    </Full>
  </>
);

/* ---- Park with a big tree (golden hour) ---- */
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
      {new Array(9).fill(0).map((_, i) => (
        <ellipse key={i} cx={i * 240} cy={680} rx={200} ry={120} fill="#4a3a5a" />
      ))}
      <Bokeh n={12} seed="pk" color="#fff0c0" f={f} y0={200} y1={600} />
    </Full>
    <Full>
      <rect x={0} y={700} width={1920} height={380} fill="#3a2f45" />
      <rect x={0} y={880} width={1920} height={200} fill="#241c2c" />
    </Full>
  </>
);

/* ---- Night apartment by the window (cool blue + warm lamp) ---- */
export const NightWindow: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Full blur={4}>
      <rect width={1920} height={1080} fill="#141c2e" />
      <rect x={1100} y={110} width={680} height={560} fill="#0a1224" stroke="#0a0e18" strokeWidth={20} />
      <circle cx={1600} cy={240} r={60} fill="#e8f0ff" opacity={0.7} />
      {new Array(40).fill(0).map((_, i) => (
        <circle key={i} cx={1110 + random("ns" + i) * 660} cy={120 + random("nsy" + i) * 300} r={2} fill="#fff" opacity={0.4 + 0.4 * Math.sin(f / 10 + i)} />
      ))}
      {new Array(12).fill(0).map((_, i) => (
        <rect key={i} x={1110 + i * 56} y={670 - 60 - random("nb" + i) * 200} width={50} height={300} fill="#111a30" />
      ))}
      <line x1={1440} y1={110} x2={1440} y2={670} stroke="#0a0e18" strokeWidth={14} />
      <ellipse cx={330} cy={520} rx={380} ry={300} fill="#ffb35c" opacity={0.18} />
    </Full>
    <Full>
      <Cone id="nw1" x={330} y={260} w={500} h={640} color="#ffcf8a" o={0.25} />
      <path d="M 280 250 L 380 250 L 360 200 L 300 200 Z" fill="#c9893d" />
      <rect x={0} y={880} width={1920} height={200} fill="#0c111c" />
    </Full>
  </>
);

/* ---- Hospital corridor (cool blue) — reuses Corridor ---- */
