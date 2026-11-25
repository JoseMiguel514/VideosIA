import { hudFont } from "../stick/Hud";
import React from "react";
import { random } from "remotion";
import { Cone, Dust } from "../stick/Env";
import { Jet } from "./envs";

/*
 * Extra environments for the long-form videos. Each one is built in depth layers
 * (soft far background, mid layer, crisp foreground) and has ambient life:
 * people passing, screens flickering, steam, traffic, birds, weather.
 * Characters stand with their feet at y≈900 (s=1).
 */

const Full: React.FC<{ children: React.ReactNode; blur?: number; id: string }> = ({ children, blur = 0, id }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {blur ? (
        <>
          <defs>
            <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
              <feGaussianBlur stdDeviation={blur} />
            </filter>
          </defs>
          <g filter={`url(#${id})`}>{children}</g>
        </>
      ) : (
        children
      )}
    </svg>
  </div>
);

const wrap = (v: number, w: number) => ((v % w) + w) % w;
const COLORS = ["#e0452f", "#f2c21b", "#8f5bd8", "#2f8f9a", "#4a8ad8", "#f08a24", "#6a9a6a", "#d85a8a"];

/** Small background person walking across (depth filler). dir: 1 = to the right. */
export const Walker: React.FC<{ f: number; seed: number; y: number; s?: number; speed?: number; dir?: number; span?: [number, number]; color?: string }> = ({
  f,
  seed,
  y,
  s = 0.5,
  speed = 1.6,
  dir = 1,
  span = [-120, 2040],
  color,
}) => {
  const w = span[1] - span[0];
  const x = span[0] + wrap(random(`wk${seed}`) * w + dir * f * speed, w);
  const ph = f / 4 + seed;
  const col = color ?? COLORS[seed % COLORS.length];
  const leg = Math.sin(ph) * 14;
  return (
    <g transform={`translate(${x} ${y + Math.abs(Math.sin(ph)) * -3 * s}) scale(${s * dir} ${s})`}>
      <ellipse cx={0} cy={4} rx={36} ry={7} fill="#000" opacity={0.25} />
      <path d={`M -8 -120 L ${-8 - leg} 0 M 8 -120 L ${8 + leg} 0`} stroke="#1a1a22" strokeWidth={14} strokeLinecap="round" />
      <rect x={-26} y={-250} width={52} height={140} rx={18} fill={col} stroke="#0b0a0c" strokeWidth={5} />
      <path d={`M -26 -235 L ${-34 + leg * 0.6} -130 M 26 -235 L ${34 - leg * 0.6} -130`} stroke="#0b0a0c" strokeWidth={10} strokeLinecap="round" />
      <circle cx={0} cy={-300} r={46} fill="#0b0a0c" />
    </g>
  );
};

/** Seated/standing background silhouette that idles (breathing, small head motion). */
const Idler: React.FC<{ f: number; x: number; y: number; s?: number; seed: number; sit?: boolean; color?: string }> = ({ f, x, y, s = 0.5, seed, sit, color }) => {
  const col = color ?? COLORS[seed % COLORS.length];
  const b = Math.sin(f / 20 + seed) * 2;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {!sit && <path d="M -10 -120 L -12 0 M 10 -120 L 12 0" stroke="#1a1a22" strokeWidth={14} strokeLinecap="round" />}
      <rect x={-28} y={(sit ? -170 : -250) + b} width={56} height={sit ? 120 : 140} rx={18} fill={col} stroke="#0b0a0c" strokeWidth={5} />
      <circle cx={Math.sin(f / 37 + seed) * 4} cy={(sit ? -218 : -300) + b} r={46} fill="#0b0a0c" />
    </g>
  );
};

/** Ceiling light panel with soft cone. */
const Ceiling: React.FC<{ xs: number[]; y?: number; color?: string; id: string; o?: number }> = ({ xs, y = 0, color = "#fff4d8", id, o = 0.1 }) => (
  <>
    {xs.map((x, i) => (
      <g key={i}>
        <rect x={x - 90} y={y} width={180} height={14} rx={6} fill={color} opacity={0.9} />
        <Cone id={`${id}${i}`} x={x} y={y + 10} w={420} h={860} color={color} o={o} />
      </g>
    ))}
  </>
);

/* =================================================================== *
 *  PLANE VIDEO
 * =================================================================== */

/** Airport gate: big windows onto the apron, jets taxiing, departure board, travellers. */
export const Terminal: React.FC<{ f: number; dusk?: boolean }> = ({ f, dusk }) => (
  <>
    <Full id="tm0" blur={3}>
      <defs>
        <linearGradient id="tmsky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={dusk ? "#3a2a5a" : "#5d9ee0"} />
          <stop offset="1" stopColor={dusk ? "#f29a5a" : "#cfe6ff"} />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#tmsky)" />
      {/* apron, taxi lines, distant terminal */}
      <rect x={0} y={520} width={1920} height={200} fill={dusk ? "#3a3440" : "#7a7f86"} />
      <path d="M 0 610 L 1920 590" stroke="#f2c21b" strokeWidth={5} opacity={0.8} />
      {new Array(10).fill(0).map((_, i) => (
        <rect key={i} x={i * 210} y={470 - (i % 3) * 20} width={180} height={60 + (i % 3) * 20} fill={dusk ? "#2a2436" : "#9aa6b4"} />
      ))}
      <rect x={1500} y={300} width={40} height={220} fill={dusk ? "#2a2436" : "#8a96a4"} />
      <rect x={1460} y={270} width={120} height={50} rx={10} fill={dusk ? "#2a2436" : "#8a96a4"} />
    </Full>
    <Full id="tm1" blur={1.2}>
      {/* taxiing jet + one taking off in the distance */}
      <Jet x={wrap(300 + f * 1.4, 2600) - 400} y={560} s={0.55} f={f} lights={!!dusk} />
      <g transform={`translate(${wrap(f * 5, 3000) - 500} ${380 - wrap(f * 5, 3000) * 0.08}) rotate(-6)`}>
        <Jet x={0} y={0} s={0.22} f={f} lights={!!dusk} />
      </g>
      {/* baggage tug */}
      <g transform={`translate(${1700 - wrap(f * 2.2, 2200)} 640)`}>
        <rect x={-40} y={-26} width={80} height={30} rx={6} fill="#f2c21b" stroke="#0b0a0c" strokeWidth={4} />
        {[0, 1, 2].map((k) => (
          <rect key={k} x={50 + k * 70} y={-22} width={60} height={26} rx={4} fill="#5a6a7a" stroke="#0b0a0c" strokeWidth={4} />
        ))}
      </g>
    </Full>
    <Full id="tm2">
      {/* window mullions + frame */}
      <rect x={0} y={0} width={1920} height={90} fill="#2a3140" />
      {new Array(7).fill(0).map((_, i) => (
        <rect key={i} x={i * 320 - 10} y={90} width={22} height={620} fill="#2a3140" />
      ))}
      <rect x={0} y={700} width={1920} height={30} fill="#2a3140" />
      {/* reflections */}
      {new Array(6).fill(0).map((_, i) => (
        <path key={i} d={`M ${i * 320 + 60} 100 L ${i * 320 + 120} 100 L ${i * 320 + 40} 690 L ${i * 320 - 20} 690 Z`} fill="#fff" opacity={0.06} />
      ))}
      {/* departure board */}
      <g transform="translate(1290 130)">
        <rect x={0} y={0} width={560} height={250} rx={12} fill="#0f141c" stroke="#0b0a0c" strokeWidth={6} />
        <text x={24} y={44} fontFamily={hudFont} fontWeight={900} fontSize={30} fill="#ffc23d">
          DEPARTURES
        </text>
        {[
          ["AC 143", "WINNIPEG", "ON TIME"],
          ["BA 9", "AUCKLAND", "BOARDING"],
          ["US 1549", "CHARLOTTE", "ON TIME"],
          ["XY 23", "SEATTLE", Math.floor(f / 45) % 2 ? "GATE 23" : "DELAYED"],
        ].map((r, i) => (
          <g key={i}>
            <text x={24} y={90 + i * 44} fontFamily="Courier New" fontWeight="bold" fontSize={28} fill="#e9edf2">
              {r[0]}
            </text>
            <text x={180} y={90 + i * 44} fontFamily="Courier New" fontWeight="bold" fontSize={28} fill="#e9edf2">
              {r[1]}
            </text>
            <text x={400} y={90 + i * 44} fontFamily="Courier New" fontWeight="bold" fontSize={26} fill={r[2] === "DELAYED" ? "#ff5a5a" : "#7dff9b"}>
              {r[2]}
            </text>
          </g>
        ))}
      </g>
      {/* gate sign */}
      <rect x={120} y={120} width={220} height={110} rx={12} fill="#ffc23d" stroke="#0b0a0c" strokeWidth={6} />
      <text x={230} y={198} textAnchor="middle" fontFamily={hudFont} fontWeight={900} fontSize={64} fill="#0b0a0c">
        23
      </text>
      {/* carpet + rows of seats */}
      <rect x={0} y={730} width={1920} height={350} fill="#2c3a52" />
      {new Array(30).fill(0).map((_, i) => (
        <rect key={i} x={(i % 10) * 200 + (Math.floor(i / 10) % 2) * 100} y={760 + Math.floor(i / 10) * 100} width={60} height={6} fill="#3a4a66" />
      ))}
      {new Array(4).fill(0).map((_, i) => (
        <g key={i} transform={`translate(${80 + i * 120} 820)`}>
          <rect x={-50} y={-90} width={100} height={70} rx={14} fill="#4a5a72" stroke="#0b0a0c" strokeWidth={4} />
          <rect x={-55} y={-30} width={110} height={24} rx={8} fill="#56677f" stroke="#0b0a0c" strokeWidth={4} />
          <rect x={-6} y={-6} width={12} height={40} fill="#1a2230" />
        </g>
      ))}
      <Idler f={f} x={200} y={790} s={0.45} seed={3} sit />
      <Idler f={f} x={440} y={790} s={0.45} seed={6} sit />
      {/* travellers with suitcases */}
      {[0, 1, 2, 3].map((k) => (
        <g key={k}>
          <Walker f={f} seed={k + 10} y={760 + (k % 2) * 30} s={0.42 + (k % 2) * 0.06} speed={1.2 + k * 0.3} dir={k % 2 ? -1 : 1} />
        </g>
      ))}
      <rect x={0} y={880} width={1920} height={200} fill="#1c2638" />
    </Full>
    <Dust f={f} color="#fff6e0" n={20} seed="tmd" />
  </>
);

/** Aircraft galley: carts, lockers, ovens, blinking call lights, curtain. */
export const Galley: React.FC<{ f: number; alarm?: boolean }> = ({ f, alarm }) => {
  const blink = Math.floor(f / 10) % 2 === 0;
  return (
    <>
      <Full id="gl0" blur={2}>
        <rect width={1920} height={1080} fill="#3c4250" />
        <rect x={0} y={0} width={1920} height={130} fill="#2a2f3a" />
        {/* upper stowage */}
        {new Array(8).fill(0).map((_, i) => (
          <g key={i}>
            <rect x={120 + i * 210} y={150} width={190} height={150} rx={8} fill="#d8dce4" stroke="#8a929e" strokeWidth={5} />
            <rect x={200 + i * 210} y={210} width={30} height={10} rx={4} fill="#8a929e" />
          </g>
        ))}
        {/* ovens / coffee makers */}
        {new Array(4).fill(0).map((_, i) => (
          <g key={i}>
            <rect x={160 + i * 260} y={330} width={220} height={150} rx={8} fill="#b9c0cc" stroke="#6a727e" strokeWidth={5} />
            <rect x={180 + i * 260} y={350} width={130} height={110} rx={6} fill="#2a2f3a" />
            <circle cx={350 + i * 260} cy={380} r={10} fill={i === 1 && blink ? "#ff5a5a" : "#5a626e"} />
            <circle cx={350 + i * 260} cy={420} r={10} fill="#5a626e" />
          </g>
        ))}
        {/* curtain to cabin */}
        <path d={`M 1300 140 L 1900 140 L 1900 880 L 1300 880 Q ${1320 + Math.sin(f / 18) * 10} 500 1300 140 Z`} fill="#2f5aa8" opacity={0.95} />
        {new Array(8).fill(0).map((_, i) => (
          <path key={i} d={`M ${1340 + i * 70} 140 Q ${1350 + i * 70 + Math.sin(f / 18 + i) * 8} 500 ${1340 + i * 70} 880`} stroke="#244a8a" strokeWidth={8} fill="none" />
        ))}
      </Full>
      <Full id="gl1">
        <Ceiling xs={[360, 960]} y={130} id="glc" o={0.09} />
        {/* counter */}
        <rect x={0} y={500} width={1260} height={30} fill="#9aa2ae" />
        {/* trolley carts */}
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${180 + i * 250} 540)`}>
            <rect x={0} y={0} width={210} height={330} rx={10} fill="#c9ced8" stroke="#0b0a0c" strokeWidth={5} />
            <rect x={14} y={20} width={182} height={60} rx={6} fill="#aab2be" />
            <rect x={70} y={140} width={70} height={14} rx={6} fill="#e8343f" />
            <circle cx={30} cy={340} r={12} fill="#0b0a0c" />
            <circle cx={180} cy={340} r={12} fill="#0b0a0c" />
          </g>
        ))}
        {/* call lights */}
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={1500 + i * 60} cy={110} r={14} fill={alarm && blink ? "#ff5a5a" : i === 0 ? "#4aa8ff" : "#2a2f3a"} />
        ))}
        <rect x={0} y={880} width={1920} height={200} fill="#22262e" />
        {new Array(12).fill(0).map((_, i) => (
          <rect key={i} x={i * 170} y={900} width={150} height={6} fill="#2e333d" />
        ))}
      </Full>
      {alarm && <div style={{ position: "absolute", inset: 0, background: "#ff2d3d", opacity: blink ? 0.06 : 0 }} />}
    </>
  );
};

/** Air traffic control room: radar scopes with sweeping beams, controllers, tower windows. */
export const AtcRoom: React.FC<{ f: number; emergency?: boolean }> = ({ f, emergency }) => {
  const sweep = (f * 3) % 360;
  const blink = Math.floor(f / 8) % 2 === 0;
  return (
    <>
      <Full id="atc0" blur={3}>
        <rect width={1920} height={1080} fill="#0c1420" />
        {/* tower windows with night city */}
        <rect x={0} y={60} width={1920} height={380} fill="#16253a" />
        {new Array(70).fill(0).map((_, i) => (
          <rect key={i} x={random("ax" + i) * 1920} y={300 + random("ay" + i) * 120} width={6} height={6} fill="#ffd27a" opacity={0.3 + 0.5 * random("ao" + i)} />
        ))}
        <path d="M 0 420 L 1920 400 L 1920 440 L 0 440 Z" fill="#2a3a52" />
        {new Array(12).fill(0).map((_, i) => (
          <circle key={i} cx={i * 170 + 40} cy={410 - i * 1.3} r={4} fill={i % 3 ? "#4aa8ff" : "#ffd27a"} opacity={0.8} />
        ))}
        {new Array(8).fill(0).map((_, i) => (
          <rect key={i} x={i * 270} y={60} width={16} height={380} fill="#0a121c" />
        ))}
        {/* blinking light of a plane on approach */}
        <circle cx={wrap(f * 2, 2200) - 140} cy={200 + Math.sin(f / 40) * 20} r={5} fill={blink ? "#ff4a4a" : "#ffffff"} />
      </Full>
      <Full id="atc1">
        {/* consoles */}
        <rect x={0} y={560} width={1920} height={520} fill="#141d2a" />
        {[260, 960, 1660].map((cx, i) => {
          const pl = new Array(6).fill(0).map((_, k) => {
            const a = random(`bl${i}${k}`) * Math.PI * 2;
            const r = 40 + random(`br${i}${k}`) * 110;
            return [cx + Math.cos(a + f / 900) * r, 560 + Math.sin(a + f / 900) * r * 0.9] as const;
          });
          const em = emergency && i === 1;
          return (
            <g key={i}>
              <rect x={cx - 220} y={400} width={440} height={330} rx={18} fill="#0a1018" stroke="#2a3a52" strokeWidth={8} />
              <circle cx={cx} cy={560} r={150} fill="#06221a" stroke="#1a5a40" strokeWidth={4} />
              {[50, 100, 150].map((r) => (
                <circle key={r} cx={cx} cy={560} r={r} fill="none" stroke="#1a5a40" strokeWidth={2} />
              ))}
              <path d={`M ${cx} 560 L ${cx + Math.cos((sweep * Math.PI) / 180) * 150} ${560 + Math.sin((sweep * Math.PI) / 180) * 150}`} stroke="#4fffa0" strokeWidth={4} opacity={0.85} />
              <path
                d={`M ${cx} 560 L ${cx + Math.cos(((sweep - 30) * Math.PI) / 180) * 150} ${560 + Math.sin(((sweep - 30) * Math.PI) / 180) * 150} A 150 150 0 0 1 ${cx + Math.cos((sweep * Math.PI) / 180) * 150} ${560 + Math.sin((sweep * Math.PI) / 180) * 150} Z`}
                fill="#4fffa0"
                opacity={0.12}
              />
              {pl.map(([px, py], k) => (
                <g key={k}>
                  <circle cx={px} cy={py} r={5} fill={em && k === 0 ? (blink ? "#ff4a4a" : "#ffd27a") : "#7dffb9"} />
                  <text x={px + 8} y={py - 6} fontFamily="Courier New" fontSize={14} fill={em && k === 0 ? "#ff6a6a" : "#7dffb9"}>
                    {em && k === 0 ? "7700" : `${200 + k * 13}`}
                  </text>
                </g>
              ))}
            </g>
          );
        })}
        {/* desk edge + keyboards */}
        <rect x={0} y={730} width={1920} height={40} fill="#2a3a52" />
        {[260, 960, 1660].map((cx) => (
          <rect key={cx} x={cx - 120} y={740} width={240} height={18} rx={4} fill="#0a1018" />
        ))}
        {/* coffee steam */}
        {[0, 1, 2].map((k) => (
          <path key={k} d={`M ${560 + k * 8} ${720 - ((f * 0.8 + k * 20) % 60)} q 8 -10 0 -20`} stroke="#c9d2dc" strokeWidth={3} fill="none" opacity={0.4} />
        ))}
        <rect x={540} y={720} width={40} height={30} rx={6} fill="#e9e2d4" />
        <Idler f={f} x={1660} y={900} s={0.5} seed={2} color="#3a5a8a" />
        <rect x={0} y={880} width={1920} height={200} fill="#0a0f16" />
      </Full>
      {emergency && <div style={{ position: "absolute", inset: 0, background: "#ff2d3d", opacity: blink ? 0.05 : 0 }} />}
    </>
  );
};

/** Hangar with a full-motion flight simulator on hydraulic legs. tilt in degrees. */
export const SimHangar: React.FC<{ f: number; tilt?: number; dark?: number }> = ({ f, tilt = 0, dark = 0 }) => (
  <>
    <Full id="sh0" blur={2.5}>
      <rect width={1920} height={1080} fill="#2a2e36" />
      {/* hangar roof trusses */}
      {new Array(10).fill(0).map((_, i) => (
        <path key={i} d={`M ${i * 220 - 40} 0 L ${i * 220 + 70} 180 L ${i * 220 + 180} 0`} stroke="#3e444e" strokeWidth={10} fill="none" />
      ))}
      <rect x={0} y={180} width={1920} height={14} fill="#3e444e" />
      {/* back wall panels + sign */}
      {new Array(12).fill(0).map((_, i) => (
        <rect key={i} x={i * 165} y={200} width={160} height={560} fill={i % 2 ? "#343a44" : "#30353f"} />
      ))}
      <text x={200} y={300} fontFamily={hudFont} fontWeight={900} fontSize={54} fill="#ffc23d" opacity={0.75}>
        FLIGHT TRAINING CENTER
      </text>
    </Full>
    <Full id="sh1">
      <Ceiling xs={[360, 960, 1560]} y={190} id="shc" o={0.08} />
      {/* simulator: legs + cabin */}
      <g transform={`translate(1240 640)`}>
        {[-150, 0, 150].map((lx, i) => (
          <g key={i}>
            <line x1={lx * 1.6} y1={240} x2={lx} y2={20} stroke="#8a929e" strokeWidth={26} />
            <line x1={lx * 1.6} y1={240} x2={lx * 1.25} y2={130} stroke="#c9ced8" strokeWidth={14} />
          </g>
        ))}
        <rect x={-340} y={230} width={680} height={30} rx={8} fill="#4a525e" />
        <g transform={`rotate(${tilt} 0 0) translate(0 ${Math.sin(f / 7) * Math.abs(tilt) * 0.4})`}>
          <path d="M -260 20 L -230 -260 Q 0 -330 230 -260 L 260 20 Z" fill="#e9edf2" stroke="#0b0a0c" strokeWidth={8} />
          <rect x={-200} y={-140} width={400} height={60} rx={12} fill="#2f5aa8" />
          <path d="M -230 -40 L 230 -40" stroke="#c9d2dc" strokeWidth={6} />
          <rect x={-60} y={-10} width={120} height={30} rx={6} fill="#4a525e" />
          <text x={0} y={-98} textAnchor="middle" fontFamily={hudFont} fontWeight={900} fontSize={34} fill="#fff">
            SIM 2
          </text>
        </g>
        {/* walkway bridge */}
        <path d="M -620 60 L -300 -30 L -300 -10 L -620 80 Z" fill="#6a727e" stroke="#0b0a0c" strokeWidth={4} />
      </g>
      {/* hazard stripes on floor */}
      <rect x={0} y={860} width={1920} height={220} fill="#3a3e46" />
      {new Array(24).fill(0).map((_, i) => (
        <path key={i} d={`M ${860 + i * 40} 860 l 20 0 l -24 30 l -20 0 Z`} fill={i % 2 ? "#f2c21b" : "#0b0a0c"} />
      ))}
      {/* technician walking */}
      <Walker f={f} seed={5} y={860} s={0.38} speed={0.9} span={[0, 900]} color="#f08a24" />
      <rect x={0} y={890} width={1920} height={190} fill="#2e3238" />
    </Full>
    {dark > 0 && <div style={{ position: "absolute", inset: 0, background: "#000", opacity: dark }} />}
  </>
);

/** Classroom with a chalkboard; `chalk` draws content on the board. */
export const Classroom: React.FC<{ f: number; chalk?: React.ReactNode }> = ({ f, chalk }) => (
  <>
    <Full id="cr0" blur={2}>
      <rect width={1920} height={1080} fill="#c9b08a" />
      <rect x={0} y={0} width={1920} height={80} fill="#b39a74" />
      {/* windows with trees swaying */}
      {[0, 1].map((i) => (
        <g key={i}>
          <rect x={60 + i * 240} y={140} width={200} height={300} fill="#9fd0ff" stroke="#6a5a3a" strokeWidth={12} />
          <circle cx={160 + i * 240 + Math.sin(f / 30 + i) * 6} cy={330} r={70} fill="#5a9a4a" />
          <line x1={60 + i * 240} y1={290} x2={260 + i * 240} y2={290} stroke="#6a5a3a" strokeWidth={8} />
        </g>
      ))}
      {/* posters */}
      <rect x={1650} y={150} width={200} height={260} fill="#2f5aa8" />
      <path d="M 1700 330 L 1750 220 L 1800 330 Z" fill="#ffc23d" />
      <circle cx={1750} cy={180} r={6} fill="#fff" />
      {/* clock */}
      <circle cx={1530} cy={150} r={44} fill="#f6efdf" stroke="#3a2c22" strokeWidth={6} />
      <line x1={1530} y1={150} x2={1530 + Math.cos(f / 60) * 30} y2={150 + Math.sin(f / 60) * 30} stroke="#3a2c22" strokeWidth={4} />
    </Full>
    <Full id="cr1">
      {/* chalkboard */}
      <rect x={560} y={120} width={1040} height={500} rx={10} fill="#5a3a22" />
      <rect x={580} y={140} width={1000} height={460} fill="#233a30" />
      <rect x={580} y={140} width={1000} height={460} fill="#fff" opacity={0.03} />
      <rect x={580} y={600} width={1000} height={18} fill="#7a5a3a" />
      <rect x={660} y={590} width={60} height={12} rx={4} fill="#f6efdf" />
      <rect x={760} y={590} width={44} height={14} rx={3} fill="#e0452f" />
      <g>{chalk}</g>
      {/* desks */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${260 + i * 700} 830)`}>
          <rect x={-150} y={-40} width={300} height={24} rx={4} fill="#a87a4a" stroke="#0b0a0c" strokeWidth={4} />
          <rect x={-140} y={-16} width={14} height={110} fill="#5a4a3a" />
          <rect x={126} y={-16} width={14} height={110} fill="#5a4a3a" />
        </g>
      ))}
      <rect x={0} y={880} width={1920} height={200} fill="#8a6a4a" />
      {new Array(20).fill(0).map((_, i) => (
        <rect key={i} x={i * 100} y={880} width={4} height={200} fill="#7a5a3a" />
      ))}
    </Full>
    <Dust f={f} color="#fff6e0" n={25} seed="crd" />
  </>
);

/** Desert aircraft boneyard: rows of parked jets in heat haze, tumbleweed. */
export const Boneyard: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Full id="by0" blur={3}>
      <defs>
        <linearGradient id="bysky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#5aa0e0" />
          <stop offset="1" stopColor="#ffe2b0" />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#bysky)" />
      <circle cx={1600} cy={170} r={80} fill="#fff6d0" />
      <circle cx={1600} cy={170} r={140} fill="#fff6d0" opacity={0.25} />
      {/* mountains */}
      <path d="M 0 560 L 200 430 L 380 520 L 620 400 L 880 540 L 1100 440 L 1380 530 L 1640 420 L 1920 520 L 1920 620 L 0 620 Z" fill="#b98a6a" />
      <rect x={0} y={600} width={1920} height={480} fill="#e2b886" />
      {/* far rows of parked jets */}
      {new Array(9).fill(0).map((_, i) => (
        <g key={i} transform={`translate(${i * 230 + 60} 610) scale(0.22)`}>
          <Jet x={0} y={0} f={f} lights={false} />
        </g>
      ))}
    </Full>
    <Full id="by1" blur={1}>
      {new Array(5).fill(0).map((_, i) => (
        <g key={i} transform={`translate(${i * 420 + 120} 700) scale(0.42)`}>
          <Jet x={0} y={0} f={f} lights={false} />
          <rect x={250} y={-30} width={60} height={50} fill="#d9d2c0" stroke="#0b0a0c" strokeWidth={6} />
        </g>
      ))}
      {/* heat shimmer */}
      {new Array(6).fill(0).map((_, i) => (
        <path key={i} d={`M 0 ${740 + i * 10} q 160 ${Math.sin(f / 6 + i) * 6} 320 0 t 320 0 t 320 0 t 320 0 t 320 0 t 320 0`} stroke="#fff3d6" strokeWidth={2} fill="none" opacity={0.25} />
      ))}
    </Full>
    <Full id="by2">
      <rect x={0} y={860} width={1920} height={220} fill="#d8a874" />
      {new Array(30).fill(0).map((_, i) => (
        <circle key={i} cx={random("bp" + i) * 1920} cy={880 + random("bpy" + i) * 190} r={2 + random("bpr" + i) * 4} fill="#a87a4a" />
      ))}
      {/* cactus */}
      <g transform="translate(1780 880)">
        <rect x={-16} y={-200} width={32} height={200} rx={16} fill="#4a8a4a" stroke="#0b0a0c" strokeWidth={5} />
        <path d="M -16 -110 L -50 -110 L -50 -160" stroke="#4a8a4a" strokeWidth={26} fill="none" strokeLinecap="round" />
        <path d="M 16 -80 L 50 -80 L 50 -140" stroke="#4a8a4a" strokeWidth={26} fill="none" strokeLinecap="round" />
      </g>
      {/* tumbleweed */}
      <g transform={`translate(${wrap(f * 4, 2200) - 140} ${900 - Math.abs(Math.sin(f / 7)) * 40}) rotate(${f * 6})`}>
        <circle r={34} fill="none" stroke="#9a7a4a" strokeWidth={5} />
        <path d="M -30 0 L 30 0 M 0 -30 L 0 30 M -20 -20 L 20 20 M 20 -20 L -20 20" stroke="#9a7a4a" strokeWidth={4} />
      </g>
    </Full>
  </>
);

/** Aviation museum hall: displayed airliner, banners, visitors. */
export const Museum: React.FC<{ f: number; label?: string }> = ({ f, label = "FLIGHT 1549" }) => (
  <>
    <Full id="mu0" blur={2.5}>
      <rect width={1920} height={1080} fill="#d9dde4" />
      {/* glass roof */}
      {new Array(12).fill(0).map((_, i) => (
        <path key={i} d={`M ${i * 170} 0 L ${i * 170 + 80} 260`} stroke="#b0b8c4" strokeWidth={8} />
      ))}
      <rect x={0} y={0} width={1920} height={260} fill="#bcd8f2" opacity={0.5} />
      <rect x={0} y={260} width={1920} height={20} fill="#b0b8c4" />
      {/* hanging small plane */}
      <g transform={`translate(${300 + Math.sin(f / 50) * 6} 180) rotate(${Math.sin(f / 60) * 2})`}>
        <line x1={0} y1={-180} x2={0} y2={-20} stroke="#7a828e" strokeWidth={2} />
        <path d="M -60 0 L 60 0 L 70 -8 L -50 -10 Z M -10 -6 L -30 -40 L 0 -40 L 20 -6 Z" fill="#e0452f" stroke="#0b0a0c" strokeWidth={3} />
      </g>
      {/* banners */}
      {["#2f5aa8", "#e0452f", "#ffc23d"].map((c, i) => (
        <g key={i} transform={`translate(${1200 + i * 220} 290)`}>
          <rect x={0} y={0} width={120} height={260} fill={c} />
          <path d="M 0 260 L 60 230 L 120 260 Z" fill="#d9dde4" />
        </g>
      ))}
    </Full>
    <Full id="mu1">
      <Ceiling xs={[560, 1160]} y={270} color="#ffffff" id="muc" o={0.08} />
      {/* displayed jet on stands */}
      <g transform="translate(860 600) scale(1.35)">
        <Jet x={0} y={0} f={f} lights={false} />
      </g>
      {[640, 1080].map((x) => (
        <rect key={x} x={x} y={660} width={16} height={180} fill="#7a828e" />
      ))}
      {/* rope barrier */}
      {[320, 620, 920, 1220, 1520].map((x) => (
        <rect key={x} x={x - 6} y={760} width={12} height={110} fill="#c9a24a" />
      ))}
      <path d="M 320 780 Q 470 820 620 780 Q 770 820 920 780 Q 1070 820 1220 780 Q 1370 820 1520 780" stroke="#a8242e" strokeWidth={8} fill="none" />
      {/* plaque */}
      <g transform="translate(1600 640)">
        <rect x={0} y={0} width={240} height={120} rx={8} fill="#2a2f3a" stroke="#0b0a0c" strokeWidth={4} />
        <text x={120} y={52} textAnchor="middle" fontFamily={hudFont} fontWeight={900} fontSize={26} fill="#ffc23d">
          {label}
        </text>
        <text x={120} y={90} textAnchor="middle" fontFamily={hudFont} fontWeight={800} fontSize={20} fill="#e9edf2">
          ON DISPLAY
        </text>
      </g>
      <Walker f={f} seed={21} y={860} s={0.4} speed={1} dir={-1} />
      <Walker f={f} seed={24} y={880} s={0.44} speed={0.8} />
      <rect x={0} y={880} width={1920} height={200} fill="#b8bec8" />
      {new Array(10).fill(0).map((_, i) => (
        <rect key={i} x={i * 200} y={880} width={4} height={200} fill="#a8aeb8" />
      ))}
    </Full>
  </>
);

/** Volcano observatory: screens with ash maps, a volcano smoking through the window. */
export const Observatory: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Full id="ob0" blur={3}>
      <rect width={1920} height={1080} fill="#1a1e28" />
      <rect x={100} y={80} width={1100} height={440} fill="#6a8ab0" />
      <path d="M 260 520 L 560 220 L 640 230 L 920 520 Z" fill="#4a3a3a" />
      <path d="M 560 222 L 600 180 L 640 232 Z" fill="#ff7a3d" opacity={0.8} />
      {new Array(8).fill(0).map((_, i) => (
        <circle key={i} cx={600 + i * 40 + Math.sin(f / 20 + i) * 10} cy={170 - i * 22 - ((f * 0.6) % 20)} r={30 + i * 10} fill="#7a7068" opacity={0.5 - i * 0.04} />
      ))}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={100 + i * 370} y={80} width={14} height={440} fill="#0f1218" />
      ))}
    </Full>
    <Full id="ob1">
      {/* monitor wall */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${1260 + (i % 2) * 320} ${100 + Math.floor(i / 2) * 230})`}>
          <rect x={0} y={0} width={300} height={200} rx={8} fill="#0a0e14" stroke="#2a3442" strokeWidth={6} />
          <rect x={12} y={12} width={276} height={176} fill={i % 2 ? "#0f2a3a" : "#13283a"} />
          {i === 0 && (
            <g>
              <ellipse cx={150 + Math.sin(f / 40) * 20} cy={100} rx={90 + (f % 120) * 0.2} ry={40} fill="#e8343f" opacity={0.35} />
              <text x={20} y={40} fontFamily="Courier New" fontWeight="bold" fontSize={20} fill="#ffc23d">
                ASH ADVISORY
              </text>
            </g>
          )}
          {i === 1 && <path d={`M 20 150 ${new Array(12).fill(0).map((_, k) => `L ${20 + k * 22} ${100 + Math.sin(f / 6 + k) * 30 * random("sg" + k)}`).join(" ")}`} stroke="#4fffa0" strokeWidth={3} fill="none" />}
          {i === 2 && new Array(5).fill(0).map((_, k) => <rect key={k} x={30 + k * 50} y={160 - (30 + 80 * Math.abs(Math.sin(f / 30 + k)))} width={30} height={30 + 80 * Math.abs(Math.sin(f / 30 + k))} fill="#4aa8ff" />)}
          {i === 3 && (
            <g>
              <circle cx={150} cy={100} r={70} fill="none" stroke="#4aa8ff" strokeWidth={3} />
              <path d={`M 150 100 L ${150 + Math.cos(f / 20) * 70} ${100 + Math.sin(f / 20) * 70}`} stroke="#4aa8ff" strokeWidth={3} />
            </g>
          )}
        </g>
      ))}
      <rect x={0} y={560} width={1920} height={60} fill="#2a3040" />
      <rect x={0} y={620} width={1920} height={460} fill="#232836" />
      <Idler f={f} x={1500} y={900} s={0.5} seed={4} color="#f2f2f2" />
      <rect x={0} y={880} width={1920} height={200} fill="#14181f" />
    </Full>
  </>
);

/* =================================================================== *
 *  SLEEP VIDEO
 * =================================================================== */

/** Coffee shop: espresso machine with steam, menu board, customers, rain-free street outside. */
export const Cafe: React.FC<{ f: number; night?: boolean }> = ({ f, night }) => (
  <>
    <Full id="cf0" blur={3}>
      <rect width={1920} height={1080} fill={night ? "#2a1e1a" : "#6a4a32"} />
      {/* window to street */}
      <rect x={1180} y={120} width={660} height={480} fill={night ? "#16203a" : "#a8d0f0"} stroke="#3a2618" strokeWidth={16} />
      {new Array(6).fill(0).map((_, i) => (
        <rect key={i} x={1200 + i * 110} y={360 - (i % 3) * 60} width={90} height={240 + (i % 3) * 60} fill={night ? "#222c48" : "#c9b89a"} />
      ))}
      <Walker f={f} seed={31} y={600} s={0.32} speed={1.4} span={[1180, 1840]} />
      <Walker f={f} seed={34} y={600} s={0.3} speed={1.1} dir={-1} span={[1180, 1840]} />
      <rect x={1180} y={120} width={660} height={60} fill="#e0452f" opacity={0.9} />
      {new Array(6).fill(0).map((_, i) => (
        <path key={i} d={`M ${1180 + i * 110} 180 q 55 30 110 0`} fill={i % 2 ? "#f6efdf" : "#e0452f"} />
      ))}
    </Full>
    <Full id="cf1">
      {/* menu board */}
      <rect x={120} y={90} width={720} height={330} rx={10} fill="#1e1e1e" stroke="#5a3a22" strokeWidth={10} />
      {["ESPRESSO 2.50", "LATTE 3.80", "COLD BREW 4.20", "DECAF 2.50"].map((t, i) => (
        <text key={t} x={160} y={160 + i * 64} fontFamily="Courier New" fontWeight="bold" fontSize={38} fill={i === 3 ? "#ffc23d" : "#f6efdf"}>
          {t}
        </text>
      ))}
      {/* pendant lamps */}
      {[300, 760, 1220].map((x, i) => (
        <g key={i}>
          <line x1={x} y1={0} x2={x} y2={90 + Math.sin(f / 40 + i) * 3} stroke="#1a1a1a" strokeWidth={3} />
          <path d={`M ${x - 40} ${120 + Math.sin(f / 40 + i) * 3} L ${x - 20} ${90 + Math.sin(f / 40 + i) * 3} L ${x + 20} ${90 + Math.sin(f / 40 + i) * 3} L ${x + 40} ${120 + Math.sin(f / 40 + i) * 3} Z`} fill="#c98a3a" />
          <Cone id={`cfl${i}`} x={x} y={120} w={360} h={700} color="#ffd08a" o={0.12} />
        </g>
      ))}
      {/* counter + espresso machine */}
      <rect x={0} y={560} width={1100} height={60} fill="#8a5a3a" />
      <rect x={0} y={620} width={1100} height={260} fill="#5a3a26" />
      {new Array(10).fill(0).map((_, i) => (
        <rect key={i} x={i * 110 + 10} y={640} width={90} height={220} rx={4} fill="#4a2e1e" />
      ))}
      <g transform="translate(520 420)">
        <rect x={0} y={0} width={300} height={140} rx={14} fill="#c9ced8" stroke="#0b0a0c" strokeWidth={6} />
        <rect x={20} y={20} width={260} height={40} rx={6} fill="#8a929e" />
        {[60, 150, 240].map((x) => (
          <rect key={x} x={x - 16} y={100} width={32} height={30} fill="#3a3e46" />
        ))}
        {new Array(6).fill(0).map((_, k) => (
          <circle key={k} cx={150 + Math.sin(f / 5 + k) * 14} cy={-10 - ((f * 1.6 + k * 18) % 110)} r={10 + k * 3} fill="#fff" opacity={0.25 - k * 0.03} />
        ))}
      </g>
      {/* pastry case */}
      <rect x={80} y={470} width={320} height={90} rx={8} fill="#cfe6ff" opacity={0.35} stroke="#0b0a0c" strokeWidth={4} />
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse key={i} cx={120 + i * 60} cy={540} rx={24} ry={12} fill="#d9a050" />
      ))}
      {/* customer at a table */}
      <Idler f={f} x={1500} y={860} s={0.5} seed={7} sit />
      <rect x={1380} y={720} width={260} height={18} rx={6} fill="#5a3a26" />
      <rect x={1500} y={738} width={14} height={140} fill="#3a2618" />
      <rect x={1440} y={696} width={30} height={24} rx={4} fill="#f6efdf" />
      <rect x={0} y={880} width={1920} height={200} fill="#3a2618" />
      {new Array(12).fill(0).map((_, i) => (
        <rect key={i} x={i * 160 + (i % 2) * 40} y={880} width={6} height={200} fill="#2e1e12" />
      ))}
    </Full>
    <Dust f={f} color="#ffe6c0" n={25} seed="cfd" />
  </>
);

/** Night highway seen from the driver's seat: road lines rushing, streetlights sweeping, dashboard. */
export const Highway: React.FC<{ f: number; drift?: number; speed?: number }> = ({ f, drift = 0, speed = 1 }) => {
  const sway = Math.sin(f / 40) * 30 * drift;
  return (
    <>
      <Full id="hw0" blur={2}>
        <rect width={1920} height={1080} fill="#070b18" />
        {new Array(50).fill(0).map((_, i) => (
          <circle key={i} cx={random("hs" + i) * 1920} cy={random("hsy" + i) * 380} r={1.6} fill="#fff" opacity={0.3 + 0.4 * random("hso" + i)} />
        ))}
        {/* hills + far city glow */}
        <path d="M 0 470 Q 400 400 800 460 T 1600 440 T 1920 460 L 1920 520 L 0 520 Z" fill="#0e1428" />
        <rect x={0} y={500} width={1920} height={30} fill="#ffb86a" opacity={0.08} />
        {/* road in perspective */}
        <path d={`M ${960 + sway} 500 L ${-400 + sway * 3} 1080 L ${2320 + sway * 3} 1080 Z`} fill="#1a1e28" />
        {new Array(8).fill(0).map((_, i) => {
          const t = wrap(i / 8 + (f * 0.02 * speed), 1);
          const k = t * t;
          const y = 500 + k * 580;
          return <rect key={i} x={960 + sway * (1 + 2 * k) - 4 - k * 14} y={y} width={8 + k * 28} height={10 + k * 90} fill="#f2e6a0" opacity={0.85} />;
        })}
        {/* streetlights sweeping past */}
        {new Array(4).fill(0).map((_, i) => {
          const t = wrap(i / 4 + f * 0.012 * speed, 1);
          const k = t * t;
          return [-1, 1].map((side) => (
            <g key={`${i}${side}`}>
              <line x1={960 + side * (60 + k * 1400)} y1={480 - k * 60} x2={960 + side * (60 + k * 1400)} y2={500 + k * 580} stroke="#2a2e3a" strokeWidth={2 + k * 18} />
              <circle cx={960 + side * (40 + k * 1300)} cy={470 - k * 80} r={3 + k * 26} fill="#ffd27a" />
              <circle cx={960 + side * (40 + k * 1300)} cy={470 - k * 80} r={10 + k * 90} fill="#ffd27a" opacity={0.12} />
            </g>
          ));
        })}
        {/* tail lights ahead */}
        <g transform={`translate(${960 + sway * 0.6 + Math.sin(f / 50) * 40} 560)`}>
          <rect x={-40} y={-20} width={80} height={36} rx={8} fill="#0e1018" />
          <circle cx={-28} cy={-4} r={7} fill="#ff3d3d" />
          <circle cx={28} cy={-4} r={7} fill="#ff3d3d" />
          <circle cx={-28} cy={-4} r={20} fill="#ff3d3d" opacity={0.2} />
          <circle cx={28} cy={-4} r={20} fill="#ff3d3d" opacity={0.2} />
        </g>
      </Full>
      <Full id="hw1">
        {/* windshield frame + dashboard */}
        <path d="M 0 0 L 1920 0 L 1920 120 Q 960 60 0 120 Z" fill="#05070c" />
        <path d="M 0 0 L 160 0 L 300 760 L 0 820 Z" fill="#05070c" />
        <path d="M 1920 0 L 1760 0 L 1620 760 L 1920 820 Z" fill="#05070c" />
        <path d="M 0 780 Q 960 700 1920 780 L 1920 1080 L 0 1080 Z" fill="#0f121a" />
        <rect x={0} y={860} width={1920} height={220} fill="#0a0c12" />
        {/* gauges glow */}
        {[760, 1160].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy={830} r={70} fill="#0a0e18" stroke="#2a3a52" strokeWidth={6} />
            <path d={`M ${x} 830 L ${x + Math.cos(-2.4 + i * 0.6 + Math.sin(f / 30) * 0.05) * 56} ${830 + Math.sin(-2.4 + i * 0.6) * 56}`} stroke="#ff6a3d" strokeWidth={5} />
            <circle cx={x} cy={830} r={70} fill="#4aa8ff" opacity={0.05} />
          </g>
        ))}
        {/* rear-view mirror */}
        <rect x={860} y={110} width={200} height={60} rx={16} fill="#1a1e28" stroke="#05070c" strokeWidth={6} />
      </Full>
    </>
  );
};

/** Doctor's office: exam bed, heart monitor, X-ray lightbox, plant. */
export const DoctorOffice: React.FC<{ f: number }> = ({ f }) => {
  const beat = (f % 30) / 30;
  return (
    <>
      <Full id="do0" blur={2.5}>
        <rect width={1920} height={1080} fill="#cfe6e2" />
        <rect x={0} y={560} width={1920} height={30} fill="#9ac8c0" />
        {/* lightbox with x-ray */}
        <rect x={140} y={120} width={420} height={300} rx={10} fill="#e9f6ff" stroke="#5a7a80" strokeWidth={8} />
        <ellipse cx={350} cy={270} rx={110} ry={120} fill="#7aa0b0" opacity={0.5} />
        {new Array(6).fill(0).map((_, i) => (
          <path key={i} d={`M 270 ${200 + i * 26} Q 350 ${180 + i * 26} 430 ${200 + i * 26}`} stroke="#f6fbff" strokeWidth={6} fill="none" />
        ))}
        {/* window with blinds */}
        <rect x={1300} y={110} width={460} height={340} fill="#bfe0ff" stroke="#5a7a80" strokeWidth={8} />
        {new Array(12).fill(0).map((_, i) => (
          <rect key={i} x={1300} y={120 + i * 28} width={460} height={10} fill="#e9f2f6" opacity={0.9} />
        ))}
        {/* certificates */}
        {[0, 1].map((i) => (
          <rect key={i} x={720 + i * 180} y={150} width={140} height={110} fill="#f6efdf" stroke="#a88a4a" strokeWidth={6} />
        ))}
      </Full>
      <Full id="do1">
        <Ceiling xs={[560, 1360]} y={0} color="#ffffff" id="doc" o={0.07} />
        {/* heart monitor */}
        <g transform="translate(1420 520)">
          <rect x={0} y={0} width={320} height={210} rx={12} fill="#1a2028" stroke="#0b0a0c" strokeWidth={6} />
          <rect x={14} y={14} width={292} height={150} fill="#061210" />
          <path
            d={`M 14 100 ${new Array(15)
              .fill(0)
              .map((_, k) => {
                const x = 14 + k * 20;
                const ph = wrap(k / 15 - beat, 1);
                const y = ph < 0.06 ? 40 : ph < 0.1 ? 130 : 100;
                return `L ${x} ${y}`;
              })
              .join(" ")}`}
            stroke="#4fffa0"
            strokeWidth={4}
            fill="none"
          />
          <text x={230} y={196} fontFamily="Courier New" fontWeight="bold" fontSize={28} fill="#4fffa0">
            72
          </text>
          <line x1={160} y1={210} x2={160} y2={360} stroke="#7a828e" strokeWidth={10} />
        </g>
        {/* exam bed */}
        <rect x={180} y={680} width={560} height={60} rx={14} fill="#5aa8a0" stroke="#0b0a0c" strokeWidth={5} />
        <rect x={180} y={670} width={560} height={20} fill="#f6fbff" />
        <rect x={220} y={740} width={20} height={140} fill="#7a828e" />
        <rect x={680} y={740} width={20} height={140} fill="#7a828e" />
        {/* plant */}
        <g transform="translate(1180 880)">
          <rect x={-40} y={-80} width={80} height={80} rx={8} fill="#c98a5a" stroke="#0b0a0c" strokeWidth={4} />
          {new Array(6).fill(0).map((_, i) => (
            <ellipse key={i} cx={Math.cos(i) * 40} cy={-140 - Math.sin(i * 2) * 30} rx={20} ry={50} fill="#4a9a5a" transform={`rotate(${-50 + i * 20 + Math.sin(f / 30 + i) * 3} 0 -80)`} />
          ))}
        </g>
        <rect x={0} y={880} width={1920} height={200} fill="#9ab8b4" />
        {new Array(10).fill(0).map((_, i) => (
          <rect key={i} x={i * 200} y={880} width={4} height={200} fill="#8aa8a4" />
        ))}
      </Full>
    </>
  );
};

/** Late-night supermarket: long aisles, buzzing flickering lights; `warp` bends the scene (hallucination). */
export const Supermarket: React.FC<{ f: number; warp?: number }> = ({ f, warp = 0 }) => {
  const flick = random(`flk${Math.floor(f / 3)}`) > 0.85 ? 0.6 : 1;
  return (
    <div style={{ position: "absolute", inset: 0, transform: warp ? `rotate(${Math.sin(f / 30) * 2.5 * warp}deg) skewX(${Math.sin(f / 23) * 3 * warp}deg)` : undefined, filter: warp ? `saturate(${1 + warp * 0.8}) hue-rotate(${Math.sin(f / 40) * 20 * warp}deg)` : undefined }}>
      <Full id="sm0" blur={2.5}>
        <rect width={1920} height={1080} fill="#e6ebe2" />
        {/* aisles in perspective */}
        {[-1, 1].map((side) => (
          <g key={side}>
            <path d={`M ${960 + side * 120} 300 L ${960 + side * 960} 60 L ${960 + side * 960} 1000 L ${960 + side * 120} 640 Z`} fill="#c9d0c4" />
            {new Array(6).fill(0).map((_, r) =>
              new Array(10).fill(0).map((__, k) => {
                const t = k / 10;
                const x0 = 960 + side * (120 + t * 840);
                const yTop = 300 - t * 240;
                const yBot = 640 + t * 360;
                const y = yTop + ((yBot - yTop) * (r + 0.5)) / 6;
                return <rect key={`${r}${k}`} x={side > 0 ? x0 : x0 - 30 - t * 60} y={y - 12 - t * 14} width={30 + t * 60} height={18 + t * 30} fill={COLORS[(r * 3 + k) % COLORS.length]} opacity={0.85} />;
              }),
            )}
          </g>
        ))}
        <path d="M 840 640 L 1080 640 L 1920 1080 L 0 1080 Z" fill="#d6dccf" />
        <rect x={880} y={300} width={160} height={340} fill="#f2f6ee" />
      </Full>
      <Full id="sm1">
        {/* fluorescent tubes */}
        {new Array(5).fill(0).map((_, i) => {
          const k = (i / 5) ** 1.4;
          return <rect key={i} x={960 - 60 - k * 300} y={250 - k * 220} width={120 + k * 600} height={6 + k * 14} rx={4} fill="#ffffff" opacity={i === 2 ? flick : 1} />;
        })}
        <rect x={0} y={0} width={1920} height={1080} fill="#eaffea" opacity={0.05 * flick} />
        {/* cart */}
        <g transform="translate(1500 880)">
          <path d="M -120 -160 L 100 -160 L 80 -40 L -100 -40 Z" fill="none" stroke="#8a929e" strokeWidth={8} />
          {new Array(5).fill(0).map((_, i) => (
            <line key={i} x1={-110 + i * 45} y1={-160} x2={-95 + i * 40} y2={-40} stroke="#8a929e" strokeWidth={4} />
          ))}
          <line x1={100} y1={-160} x2={140} y2={-200} stroke="#8a929e" strokeWidth={8} />
          <circle cx={-80} cy={-10} r={14} fill="#0b0a0c" />
          <circle cx={60} cy={-10} r={14} fill="#0b0a0c" />
        </g>
        <Walker f={f} seed={41} y={700} s={0.28} speed={0.5} span={[880, 1040]} />
        <rect x={0} y={880} width={1920} height={200} fill="#c9d0c4" />
        {new Array(12).fill(0).map((_, i) => (
          <rect key={i} x={i * 170} y={880} width={4} height={200} fill="#b8bfb2" />
        ))}
      </Full>
    </div>
  );
};

/** 1964 diner / arcade: pinball machines with flashing lights, jukebox, neon sign. */
export const Diner64: React.FC<{ f: number }> = ({ f }) => {
  const blink = Math.floor(f / 6) % 2 === 0;
  return (
    <>
      <Full id="dn0" blur={2.5}>
        <rect width={1920} height={1080} fill="#3a2a3a" />
        {/* checkered wall band */}
        {new Array(40).fill(0).map((_, i) => (
          <rect key={i} x={i * 48} y={520 + (i % 2) * 24} width={48} height={24} fill={i % 2 ? "#f6efdf" : "#1a1a1a"} />
        ))}
        {new Array(40).fill(0).map((_, i) => (
          <rect key={`b${i}`} x={i * 48} y={520 + ((i + 1) % 2) * 24} width={48} height={24} fill={(i + 1) % 2 ? "#f6efdf" : "#1a1a1a"} />
        ))}
        {/* neon sign */}
        <text x={300} y={260} fontFamily={hudFont} fontWeight={900} fontSize={110} fill="none" stroke={blink ? "#ff5ab0" : "#a83a74"} strokeWidth={6}>
          DINER
        </text>
        <text x={300} y={260} fontFamily={hudFont} fontWeight={900} fontSize={110} fill="#ff5ab0" opacity={blink ? 0.25 : 0.08}>
          DINER
        </text>
        <text x={1200} y={200} fontFamily={hudFont} fontWeight={900} fontSize={60} fill="#7fe6ff" opacity={0.8}>
          OPEN 24 HRS
        </text>
      </Full>
      <Full id="dn1">
        {/* pinball machines */}
        {[0, 1].map((i) => (
          <g key={i} transform={`translate(${1180 + i * 330} 880)`}>
            <path d="M -110 -330 L 110 -330 L 110 -130 L -110 -130 Z" fill="#2a1a4a" stroke="#0b0a0c" strokeWidth={6} />
            {new Array(10).fill(0).map((_, k) => (
              <circle key={k} cx={-80 + (k % 5) * 40} cy={-290 + Math.floor(k / 5) * 60} r={10} fill={(Math.floor(f / 4) + k + i) % 3 === 0 ? "#ffc23d" : "#5a3a8a"} />
            ))}
            <path d="M -130 -130 L 130 -130 L 150 -90 L -150 -90 Z" fill="#4a2a7a" stroke="#0b0a0c" strokeWidth={5} />
            <rect x={-100} y={-90} width={20} height={90} fill="#1a1a1a" />
            <rect x={80} y={-90} width={20} height={90} fill="#1a1a1a" />
          </g>
        ))}
        {/* jukebox */}
        <g transform="translate(220 880)">
          <path d="M -100 0 L -100 -260 Q 0 -360 100 -260 L 100 0 Z" fill="#c9a24a" stroke="#0b0a0c" strokeWidth={6} />
          <path d="M -70 -240 Q 0 -310 70 -240 L 70 -150 L -70 -150 Z" fill={`hsl(${(f * 4) % 360} 80% 60%)`} opacity={0.8} />
          {new Array(5).fill(0).map((_, k) => (
            <rect key={k} x={-70 + k * 30} y={-120} width={20} height={80} fill="#7a1a2a" />
          ))}
          {/* music notes */}
          {[0, 1, 2].map((k) => (
            <text key={k} x={80 + k * 30} y={-280 - ((f * 1.2 + k * 30) % 120)} fontSize={40} fill="#f6efdf" opacity={0.7}>
              ♪
            </text>
          ))}
        </g>
        {/* counter stools */}
        {[520, 680, 840].map((x) => (
          <g key={x}>
            <rect x={x - 8} y={780} width={16} height={100} fill="#c9ced8" />
            <ellipse cx={x} cy={780} rx={44} ry={14} fill="#e0452f" stroke="#0b0a0c" strokeWidth={4} />
          </g>
        ))}
        <rect x={0} y={880} width={1920} height={200} fill="#1a1a1a" />
        {new Array(24).fill(0).map((_, i) => (
          <rect key={i} x={i * 80} y={880 + (i % 2) * 40} width={80} height={40} fill="#f6efdf" opacity={0.85} />
        ))}
      </Full>
    </>
  );
};

/** Cold sea with ice floes and rocks; seals and waves. `children` drawn on the water. */
export const ColdSea: React.FC<{ f: number; children?: React.ReactNode }> = ({ f, children }) => (
  <>
    <Full id="cs0" blur={3}>
      <defs>
        <linearGradient id="cssky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#7aa6d0" />
          <stop offset="1" stopColor="#e2f0fa" />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#cssky)" />
      <path d="M 0 480 L 260 380 L 420 450 L 700 340 L 980 470 L 1920 470 L 1920 520 L 0 520 Z" fill="#c9d8e6" />
      <rect x={0} y={500} width={1920} height={580} fill="#2a5a80" />
    </Full>
    <Full id="cs1">
      {new Array(22).fill(0).map((_, i) => (
        <path key={i} d={`M ${wrap(i * 140 + f * 1.4, 2100) - 100} ${560 + (i % 7) * 70} q 30 -10 60 0`} stroke="#cfe6ff" strokeWidth={3} fill="none" opacity={0.6} />
      ))}
      {/* ice floes bobbing */}
      {[200, 1400].map((x, i) => (
        <g key={x} transform={`translate(${x} ${720 + Math.sin(f / 25 + i) * 6})`}>
          <path d="M -180 0 L -150 -40 L 120 -50 L 190 0 Z" fill="#f2f8ff" stroke="#9ab8d0" strokeWidth={5} />
          <path d="M -180 0 L 190 0 L 160 30 L -150 26 Z" fill="#9ab8d0" opacity={0.6} />
        </g>
      ))}
      {/* gulls */}
      {[0, 1, 2].map((k) => {
        const x = wrap(k * 500 + f * (1.5 + k * 0.4), 2200) - 140;
        const w = Math.sin(f / 4 + k) * 10;
        return <path key={k} d={`M ${x - 24} ${200 + k * 50 + w} Q ${x - 12} ${190 + k * 50} ${x} ${200 + k * 50} Q ${x + 12} ${190 + k * 50} ${x + 24} ${200 + k * 50 + w}`} stroke="#1a2230" strokeWidth={4} fill="none" />;
      })}
      {children}
    </Full>
  </>
);

/** Night bus stop: shelter, passing cars with headlight sweeps, rain optional. */
export const BusStop: React.FC<{ f: number; rain?: boolean }> = ({ f, rain }) => (
  <>
    <Full id="bs0" blur={3}>
      <rect width={1920} height={1080} fill="#121a2e" />
      {new Array(14).fill(0).map((_, i) => {
        const h = 260 + random("bsh" + i) * 300;
        return (
          <g key={i}>
            <rect x={i * 140} y={620 - h} width={130} height={h} fill="#1a2440" />
            {new Array(Math.floor(h / 50)).fill(0).map((_, k) => (
              <rect key={k} x={i * 140 + 20 + (k % 3) * 34} y={640 - h + k * 46} width={18} height={22} fill="#ffd27a" opacity={random(`bw${i}${k}`) > 0.55 ? 0.7 : 0.08} />
            ))}
          </g>
        );
      })}
      <rect x={0} y={620} width={1920} height={460} fill="#1a1e28" />
    </Full>
    <Full id="bs1">
      {/* road + passing car */}
      <rect x={0} y={740} width={1920} height={140} fill="#22262e" />
      {new Array(10).fill(0).map((_, i) => (
        <rect key={i} x={i * 200} y={806} width={110} height={8} fill="#c9c09a" opacity={0.6} />
      ))}
      <g transform={`translate(${wrap(f * 14, 3600) - 800} 790)`}>
        <path d="M -150 0 L -130 -50 L -60 -80 L 70 -80 L 130 -40 L 160 -30 L 160 10 L -150 10 Z" fill="#3a5a8a" stroke="#0b0a0c" strokeWidth={5} />
        <circle cx={-90} cy={14} r={22} fill="#0b0a0c" />
        <circle cx={100} cy={14} r={22} fill="#0b0a0c" />
        <path d="M 160 -24 L 700 -80 L 700 60 Z" fill="#fff6c0" opacity={0.12} />
      </g>
      {/* shelter */}
      <rect x={1200} y={460} width={560} height={20} fill="#3a4a5a" />
      <rect x={1210} y={480} width={10} height={400} fill="#3a4a5a" />
      <rect x={1740} y={480} width={10} height={400} fill="#3a4a5a" />
      <rect x={1230} y={490} width={500} height={300} fill="#7fb0d0" opacity={0.15} />
      <rect x={1480} y={520} width={220} height={260} fill="#ffc23d" opacity={0.85} />
      <text x={1590} y={660} textAnchor="middle" fontFamily={hudFont} fontWeight={900} fontSize={40} fill="#0b0a0c">
        SLEEP
      </text>
      <text x={1590} y={710} textAnchor="middle" fontFamily={hudFont} fontWeight={900} fontSize={40} fill="#0b0a0c">
        MORE
      </text>
      <rect x={1250} y={760} width={220} height={20} rx={6} fill="#5a6a7a" />
      {/* street lamp */}
      <rect x={300} y={300} width={14} height={580} fill="#2a2e3a" />
      <rect x={280} y={290} width={70} height={22} rx={8} fill="#2a2e3a" />
      <Cone id="bsl" x={330} y={310} w={500} h={600} color="#ffd27a" o={0.18} flicker={0.95 + 0.05 * Math.sin(f / 3)} />
      {rain &&
        new Array(60).fill(0).map((_, i) => {
          const x = random("rx" + i) * 1920;
          const y = wrap(random("ry" + i) * 1080 + f * 22, 1080);
          return <line key={i} x1={x} y1={y} x2={x - 6} y2={y + 26} stroke="#9ab8d8" strokeWidth={2} opacity={0.5} />;
        })}
      <rect x={0} y={880} width={1920} height={200} fill="#2a2e38" />
    </Full>
  </>
);

/** Nursery at night: crib, rotating mobile, moon nightlight, soft stars. */
export const Nursery: React.FC<{ f: number; cry?: boolean }> = ({ f, cry }) => (
  <>
    <Full id="ns0" blur={3}>
      <rect width={1920} height={1080} fill="#2a2450" />
      {new Array(30).fill(0).map((_, i) => (
        <path key={i} d={`M ${random("nx" + i) * 1920} ${random("ny" + i) * 600} l 6 14 l 14 2 l -10 10 l 3 14 l -13 -7 l -13 7 l 3 -14 l -10 -10 l 14 -2 Z`} fill="#ffe6a0" opacity={0.25 + 0.2 * Math.sin(f / 15 + i)} />
      ))}
      <rect x={1240} y={140} width={440} height={360} fill="#141a3a" stroke="#1a1630" strokeWidth={16} />
      <circle cx={1500} cy={260} r={60} fill="#fff6d0" opacity={0.9} />
      <circle cx={1525} cy={245} r={52} fill="#141a3a" />
    </Full>
    <Full id="ns1">
      {/* crib */}
      <g transform="translate(520 880)">
        <rect x={-300} y={-330} width={600} height={30} rx={8} fill="#f6efdf" stroke="#0b0a0c" strokeWidth={5} />
        {new Array(13).fill(0).map((_, i) => (
          <rect key={i} x={-290 + i * 46} y={-300} width={14} height={240} fill="#f6efdf" stroke="#0b0a0c" strokeWidth={3} />
        ))}
        <rect x={-300} y={-70} width={600} height={30} rx={8} fill="#f6efdf" stroke="#0b0a0c" strokeWidth={5} />
        <rect x={-290} y={-40} width={20} height={40} fill="#f6efdf" />
        <rect x={270} y={-40} width={20} height={40} fill="#f6efdf" />
        {/* baby bundle */}
        <ellipse cx={0} cy={-110} rx={110} ry={40} fill="#9ad0f0" stroke="#0b0a0c" strokeWidth={4} />
        <circle cx={-90} cy={-130 + (cry ? Math.sin(f / 2) * 3 : 0)} r={36} fill="#0b0a0c" />
        {cry && [0, 1, 2].map((k) => <path key={k} d={`M ${-140 - k * 18} ${-170 - k * 10} q -10 -10 -20 0`} stroke="#ffc23d" strokeWidth={4} fill="none" opacity={Math.sin(f / 3 + k) > 0 ? 1 : 0.2} />)}
      </g>
      {/* mobile */}
      <g transform="translate(520 300)">
        <line x1={0} y1={-300} x2={0} y2={0} stroke="#c9ced8" strokeWidth={4} />
        {new Array(4).fill(0).map((_, i) => {
          const a = f / 40 + (i * Math.PI) / 2;
          const x = Math.cos(a) * 120;
          const z = Math.sin(a);
          return (
            <g key={i} opacity={0.7 + 0.3 * z}>
              <line x1={0} y1={0} x2={x} y2={30} stroke="#c9ced8" strokeWidth={2} />
              <circle cx={x} cy={50 + z * 6} r={18 + z * 4} fill={["#ffc23d", "#e0452f", "#7fe6ff", "#8f5bd8"][i]} />
            </g>
          );
        })}
      </g>
      {/* nightlight cone */}
      <Cone id="nsl" x={1700} y={640} w={500} h={300} color="#ffcf8a" o={0.2} />
      <rect x={1650} y={640} width={100} height={70} rx={20} fill="#ffcf8a" />
      <rect x={0} y={880} width={1920} height={200} fill="#1e1a3a" />
      {/* toys on floor */}
      <rect x={1100} y={840} width={60} height={60} rx={6} fill="#e0452f" stroke="#0b0a0c" strokeWidth={4} />
      <text x={1130} y={884} textAnchor="middle" fontFamily={hudFont} fontWeight={900} fontSize={36} fill="#fff">
        A
      </text>
      <circle cx={1240} cy={870} r={30} fill="#7fe6ff" stroke="#0b0a0c" strokeWidth={4} />
    </Full>
  </>
);

/** Teen bedroom at night lit by a phone/laptop glow, posters, LED strip. */
export const TeenRoom: React.FC<{ f: number; glow?: number }> = ({ f, glow = 1 }) => (
  <>
    <Full id="tr0" blur={3}>
      <rect width={1920} height={1080} fill="#14122a" />
      <rect x={0} y={60} width={1920} height={10} fill={`hsl(${(f * 2) % 360} 90% 60%)`} opacity={0.6} />
      <rect x={0} y={70} width={1920} height={60} fill={`hsl(${(f * 2) % 360} 90% 60%)`} opacity={0.06} />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${180 + i * 260} 200) rotate(${-4 + i * 4})`}>
          <rect x={0} y={0} width={200} height={260} fill={["#e0452f", "#2f5aa8", "#f2c21b"][i]} />
          <circle cx={100} cy={110} r={50} fill="#0b0a0c" opacity={0.6} />
        </g>
      ))}
      <rect x={1300} y={160} width={420} height={320} fill="#0a1028" stroke="#0a0a18" strokeWidth={14} />
      <circle cx={1600} cy={240} r={36} fill="#e8f0ff" opacity={0.7} />
    </Full>
    <Full id="tr1">
      {/* bed with rumpled blanket */}
      <rect x={200} y={660} width={1100} height={120} rx={30} fill="#3a2a5a" stroke="#0a0a18" strokeWidth={7} />
      <path d={`M 500 640 Q 700 ${600 + Math.sin(f / 30) * 6} 900 640 T 1300 650 L 1300 760 L 500 760 Z`} fill="#5a3a8a" stroke="#0a0a18" strokeWidth={6} />
      <rect x={220} y={610} width={260} height={90} rx={30} fill="#e9e2d4" stroke="#0a0a18" strokeWidth={6} />
      {/* desk with laptop */}
      <rect x={1440} y={680} width={420} height={24} fill="#4a3a5a" />
      <rect x={1460} y={704} width={16} height={180} fill="#2a2236" />
      <rect x={1820} y={704} width={16} height={180} fill="#2a2236" />
      <path d="M 1540 676 L 1760 676 L 1740 560 L 1560 560 Z" fill="#1a1e28" stroke="#0b0a0c" strokeWidth={4} />
      <path d="M 1570 570 L 1730 570 L 1745 666 L 1555 666 Z" fill="#6ab0ff" opacity={0.6 + 0.2 * Math.sin(f / 9)} />
      <Cone id="trl" x={1650} y={600} w={700} h={480} color="#7ab8ff" o={0.12 * glow} />
      {/* energy drink cans */}
      {[0, 1, 2].map((k) => (
        <rect key={k} x={1480 + k * 30} y={640 - (k === 1 ? 0 : 0)} width={22} height={40} rx={4} fill={k === 2 ? "#4aff9a" : "#e0452f"} transform={k === 2 ? `rotate(80 ${1480 + k * 30} 660)` : undefined} />
      ))}
      <rect x={0} y={880} width={1920} height={200} fill="#0e0c1e" />
      {/* clothes pile */}
      <ellipse cx={1200} cy={890} rx={110} ry={30} fill="#4a8ad8" />
      <ellipse cx={1240} cy={870} rx={70} ry={22} fill="#e0452f" />
    </Full>
  </>
);

/** Sunny morning park: joggers, dog, birds, trees, path. */
export const MorningPark: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Full id="mp0" blur={3}>
      <defs>
        <linearGradient id="mpsky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#7ab8f0" />
          <stop offset="1" stopColor="#fff0c8" />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#mpsky)" />
      <circle cx={300} cy={230} r={90} fill="#fff4c0" />
      <circle cx={300} cy={230} r={170} fill="#fff4c0" opacity={0.3} />
      {[0, 1, 2].map((k) => (
        <ellipse key={k} cx={wrap(k * 700 + f * 0.6, 2400) - 200} cy={160 + k * 60} rx={150} ry={36} fill="#fff" opacity={0.8} />
      ))}
      <path d="M 0 560 Q 480 480 960 540 T 1920 520 L 1920 1080 L 0 1080 Z" fill="#8ac06a" />
      {new Array(10).fill(0).map((_, i) => (
        <g key={i} transform={`translate(${i * 210 + 40} 560)`}>
          <rect x={-8} y={-60} width={16} height={70} fill="#6a4a2a" />
          <circle cx={Math.sin(f / 40 + i) * 3} cy={-100} r={60} fill={i % 2 ? "#5aa04a" : "#4a903a"} />
        </g>
      ))}
    </Full>
    <Full id="mp1">
      {/* path */}
      <path d="M 0 760 Q 960 700 1920 760 L 1920 860 Q 960 800 0 860 Z" fill="#e2c89a" />
      {/* joggers */}
      <Walker f={f} seed={51} y={790} s={0.42} speed={4.2} color="#e0452f" />
      <Walker f={f} seed={57} y={800} s={0.4} speed={3.4} dir={-1} color="#4a8ad8" />
      {/* dog */}
      <g transform={`translate(${wrap(f * 4.4 + 300, 2200) - 140} ${790 - Math.abs(Math.sin(f / 3)) * 8})`}>
        <ellipse cx={0} cy={-30} rx={40} ry={18} fill="#c98a3a" stroke="#0b0a0c" strokeWidth={4} />
        <circle cx={40} cy={-46} r={16} fill="#c98a3a" stroke="#0b0a0c" strokeWidth={4} />
        <path d={`M -30 -16 L ${-36 + Math.sin(f / 2) * 8} 0 M 26 -16 L ${30 - Math.sin(f / 2) * 8} 0`} stroke="#0b0a0c" strokeWidth={6} strokeLinecap="round" />
        <path d={`M -40 -34 q -14 ${-10 + Math.sin(f / 2) * 8} -24 -16`} stroke="#c98a3a" strokeWidth={6} fill="none" strokeLinecap="round" />
      </g>
      {/* birds */}
      {[0, 1, 2, 3].map((k) => {
        const x = wrap(k * 480 + f * (2 + k * 0.5), 2200) - 140;
        const w = Math.sin(f / 3.5 + k) * 10;
        return <path key={k} d={`M ${x - 18} ${300 + k * 40 + w} Q ${x - 9} ${292 + k * 40} ${x} ${300 + k * 40} Q ${x + 9} ${292 + k * 40} ${x + 18} ${300 + k * 40 + w}`} stroke="#1a2230" strokeWidth={4} fill="none" />;
      })}
      {/* bench */}
      <g transform="translate(1600 880)">
        <rect x={-150} y={-110} width={300} height={20} rx={6} fill="#a8723a" stroke="#0b0a0c" strokeWidth={4} />
        <rect x={-150} y={-70} width={300} height={22} rx={6} fill="#a8723a" stroke="#0b0a0c" strokeWidth={4} />
        <rect x={-130} y={-48} width={12} height={48} fill="#2a2a2a" />
        <rect x={118} y={-48} width={12} height={48} fill="#2a2a2a" />
      </g>
      <rect x={0} y={880} width={1920} height={200} fill="#6aa04a" />
      {new Array(60).fill(0).map((_, i) => (
        <path key={i} d={`M ${random("gx" + i) * 1920} ${900 + random("gy" + i) * 170} l 4 -14 l 4 14`} stroke="#4a8a3a" strokeWidth={3} fill="none" />
      ))}
    </Full>
    <Dust f={f} color="#fffbe0" n={20} seed="mpd" />
  </>
);
