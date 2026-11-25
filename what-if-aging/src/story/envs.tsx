import React from "react";
import { random } from "remotion";
import { Cone, Dust } from "../stick/Env";

const Full: React.FC<{ children: React.ReactNode; blur?: number }> = ({ children, blur = 0 }) => {
  const id = `sb${String(blur).replace(".", "_")}`;
  return (
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
};

/* ============ Plane cabin, looking down the aisle (reference frame style) ============ */
export const PlaneCabin: React.FC<{ f: number; dim?: number; shake?: number; red?: number }> = ({ f, dim = 0, shake = 0, red = 0 }) => {
  const VX = 960;
  const VY = 360;
  const sx = shake ? Math.sin(f * 1.7) * shake : 0;
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translate(${sx}px, ${shake ? Math.cos(f * 2.1) * shake * 0.6 : 0}px)` }}>
      <Full blur={2.5}>
        <rect width={1920} height={1080} fill="#2c2119" />
        {/* curved ceiling & walls */}
        <path d={`M 0 0 L 1920 0 L 1920 420 L ${VX + 170} ${VY - 60} L ${VX - 170} ${VY - 60} L 0 420 Z`} fill="#3b2c20" />
        <path d={`M 0 420 L ${VX - 170} ${VY - 60} L ${VX - 170} ${VY + 160} L 0 1080 Z`} fill="#46362a" />
        <path d={`M 1920 420 L ${VX + 170} ${VY - 60} L ${VX + 170} ${VY + 160} L 1920 1080 Z`} fill="#46362a" />
        <path d={`M 0 1080 L ${VX - 170} ${VY + 160} L ${VX + 170} ${VY + 160} L 1920 1080 Z`} fill="#241a12" />
        <rect x={VX - 170} y={VY - 60} width={340} height={220} fill="#d9c7a8" opacity={0.25} />
        {/* overhead bins + reading lights */}
        {new Array(8).fill(0).map((_, i) => {
          const k = (i / 8) ** 1.6;
          return [-1, 1].map((side) => {
            const x = VX + side * (180 + 700 * k);
            const y = VY - 70 - 300 * k;
            return (
              <g key={`${i}${side}`}>
                <rect x={side > 0 ? x : x - 60 - 160 * k} y={y} width={60 + 160 * k} height={14 + 30 * k} fill="#2a1f16" opacity={0.85} />
                <rect x={x - 10 - 30 * k} y={y + 18 + 30 * k} width={20 + 60 * k} height={4 + 6 * k} fill="#ffe6b0" opacity={0.7} />
                <text x={x + side * (20 + 40 * k)} y={y + 50 + 60 * k} textAnchor="middle" fontFamily="Arial Black" fontSize={10 + 26 * k} fill="#d9c7a8">
                  {23 + 7 - i}
                </text>
              </g>
            );
          });
        })}
        {/* windows with sky */}
        {new Array(7).fill(0).map((_, i) => {
          const k = (i / 7) ** 1.5;
          return [-1, 1].map((side) => (
            <ellipse key={`w${i}${side}`} cx={VX + side * (200 + 760 * k)} cy={VY + 40 + 200 * k} rx={8 + 30 * k} ry={14 + 48 * k} fill={red > 0.5 ? "#3a1a2a" : "#5a8fd0"} opacity={0.85} />
          ));
        })}
        {/* rows of seat backs receding (heads of passengers) */}
        {new Array(9).fill(0).map((_, i) => {
          const k = ((9 - i) / 9) ** 1.7;
          return [-1, 1].map((side) =>
            [0, 1, 2].map((s) => {
              const x = VX + side * (110 + 60 * s + (320 + 140 * s) * k);
              const y = VY + 120 + 520 * k;
              const w = 34 + 120 * k;
              return (
                <g key={`${i}${side}${s}`}>
                  <rect x={x - w / 2} y={y - 40 - 160 * k} width={w} height={40 + 200 * k} rx={10 + 20 * k} fill={s % 2 ? "#2f5752" : "#2a4a46"} />
                  <rect x={x - w * 0.35} y={y - 34 - 150 * k} width={w * 0.7} height={12 + 40 * k} rx={6} fill="#c9a57a" opacity={0.7} />
                  {random(`ph${i}${side}${s}`) > 0.35 && <circle cx={x} cy={y - 56 - 190 * k} r={10 + 34 * k} fill="#0b0a0c" />}
                </g>
              );
            }),
          );
        })}
      </Full>
      <Full>
        {new Array(6).fill(0).map((_, i) => {
          const k = (i / 6) ** 1.5;
          return [-1, 1].map((side) => <Cone key={`c${i}${side}`} id={`pcc${i}${side}`} x={VX + side * (160 + 600 * k)} y={VY - 80 - 260 * k} w={60 + 300 * k} h={260 + 700 * k} color="#ffe2b0" o={0.13} />);
        })}
        <rect x={0} y={900} width={1920} height={180} fill="#1a120c" />
      </Full>
      <Dust f={f} color="#fff0d0" n={30} seed="pcd" />
      {dim > 0 && <div style={{ position: "absolute", inset: 0, background: "#000", opacity: dim }} />}
      {red > 0 && <div style={{ position: "absolute", inset: 0, background: "#8a0f1c", opacity: red * 0.35, mixBlendMode: "multiply" }} />}
    </div>
  );
};

/* ============ Cabin row side view: window + seats (characters sit in front) ============ */
export const CabinRow: React.FC<{ f: number; skyTint?: string; ground?: number; shake?: number }> = ({ f, skyTint = "#6aa6e8", ground = 0, shake = 0 }) => (
  <div style={{ position: "absolute", inset: 0, transform: `translate(${shake ? Math.sin(f * 1.9) * shake : 0}px, 0)` }}>
    <Full blur={2}>
      <rect width={1920} height={1080} fill="#3a2c22" />
      {[240, 980, 1720].map((x, i) => (
        <g key={i}>
          <rect x={x - 130} y={170} width={260} height={330} rx={120} fill="#241a12" />
          <rect x={x - 110} y={190} width={220} height={290} rx={105} fill={skyTint} />
          {/* clouds / ground moving past */}
          <g clipPath="">
            {[0, 1, 2].map((k) => (
              <ellipse key={k} cx={x - 110 + ((f * (3 + k) + k * 90 + i * 40) % 300) - 40} cy={260 + k * 60 + ground * 120} rx={50} ry={16} fill="#fff" opacity={0.75 - ground * 0.4} />
            ))}
            {ground > 0 && <rect x={x - 110} y={480 - ground * 160} width={220} height={ground * 160} fill="#4a6a3a" opacity={0.9} />}
          </g>
          <rect x={x - 110} y={190} width={220} height={60} rx={30} fill="#d9c7a8" opacity={0.2} />
        </g>
      ))}
      <rect x={0} y={0} width={1920} height={120} fill="#2a1f16" />
      {[300, 980, 1660].map((x) => (
        <rect key={x} x={x - 30} y={128} width={60} height={12} rx={6} fill="#ffe6b0" opacity={0.7} />
      ))}
    </Full>
    <Full>
      <rect x={0} y={880} width={1920} height={200} fill="#1a120c" />
    </Full>
  </div>
);

/** Seat (front view) drawn over a seated character's lower body / behind them. */
export const Seat: React.FC<{ x: number; y: number; s?: number; color?: string; front?: boolean }> = ({ x, y, s = 1, color = "#2f5752", front }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {!front && <rect x={-95} y={-470} width={190} height={330} rx={40} fill={color} stroke="#0b0a0c" strokeWidth={5} />}
    {!front && <rect x={-70} y={-462} width={140} height={60} rx={20} fill="#c9a57a" opacity={0.6} />}
    {front && (
      <g>
        <rect x={-110} y={-170} width={220} height={60} rx={20} fill={color} stroke="#0b0a0c" strokeWidth={5} />
        <rect x={-120} y={-210} width={28} height={120} rx={10} fill="#22403c" stroke="#0b0a0c" strokeWidth={4} />
        <rect x={92} y={-210} width={28} height={120} rx={10} fill="#22403c" stroke="#0b0a0c" strokeWidth={4} />
        <rect x={-90} y={-110} width={14} height={110} fill="#1a2a28" />
        <rect x={76} y={-110} width={14} height={110} fill="#1a2a28" />
      </g>
    )}
  </g>
);

/* ============ Cockpit: pilots face camera, windshield behind ============ */
export const Cockpit: React.FC<{ f: number; alarm?: boolean; sky?: string; ground?: number }> = ({ f, alarm, sky = "#5a8fd0", ground = 0 }) => {
  const blink = alarm && Math.floor(f / 8) % 2 === 0;
  return (
    <>
      <Full blur={1.5}>
        <rect width={1920} height={1080} fill="#1c222b" />
        {/* windshield */}
        <path d="M 260 120 L 860 90 L 900 470 L 220 500 Z" fill={sky} />
        <path d="M 1660 120 L 1060 90 L 1020 470 L 1700 500 Z" fill={sky} />
        {[0, 1].map((k) => (
          <ellipse key={k} cx={((f * 4 + k * 600) % 1700) + 120} cy={300 + k * 80 + ground * 140} rx={120} ry={22} fill="#fff" opacity={0.6} />
        ))}
        {ground > 0 && (
          <>
            <path d={`M 220 ${500 - ground * 220} L 900 ${470 - ground * 220} L 900 470 L 220 500 Z`} fill="#3d5a34" />
            <path d={`M 1020 ${470 - ground * 220} L 1700 ${500 - ground * 220} L 1700 500 L 1020 470 Z`} fill="#3d5a34" />
          </>
        )}
        <path d="M 860 90 L 1060 90 L 1020 470 L 900 470 Z" fill="#11161d" />
        {/* overhead panel */}
        <rect x={0} y={0} width={1920} height={90} fill="#141a22" />
        {new Array(40).fill(0).map((_, i) => (
          <rect key={i} x={40 + i * 46} y={30} width={22} height={14} rx={3} fill={random(`sw${i}`) > 0.7 ? "#ffb84d" : "#3a4656"} />
        ))}
        {/* instrument panel */}
        <rect x={0} y={520} width={1920} height={560} fill="#11161d" />
        {[300, 620, 1300, 1620].map((x, i) => (
          <g key={x}>
            <rect x={x - 130} y={560} width={260} height={180} rx={10} fill={i === 1 || i === 2 ? (blink ? "#3a0f14" : "#0b1018") : "#0b1018"} stroke="#2a3442" strokeWidth={6} />
            <path d={`M ${x - 110} ${650} q 55 ${-40 + Math.sin(f / 10 + i) * 6} 110 0 t 110 0`} stroke="#4fe3c1" strokeWidth={4} fill="none" opacity={0.7} />
          </g>
        ))}
        <rect x={860} y={560} width={200} height={300} fill="#1a2230" />
        {[0, 1].map((k) => (
          <rect key={k} x={900 + k * 70} y={600} width={40} height={180} rx={8} fill="#2a3442" />
        ))}
      </Full>
      {alarm && (
        <Full>
          <circle cx={960} cy={545} r={18} fill={blink ? "#ff2d3d" : "#5a1218"} />
          {blink && <circle cx={960} cy={545} r={46} fill="#ff2d3d" opacity={0.25} />}
          <text x={960} y={515} textAnchor="middle" fontFamily="Arial Black" fontSize={22} fill={blink ? "#ff2d3d" : "#7a2a30"}>
            ENG FAIL
          </text>
        </Full>
      )}
      <Full>
        <rect x={0} y={880} width={1920} height={200} fill="#0b0e13" />
      </Full>
    </>
  );
};

/** Airliner silhouette (side view), nose to the right. */
export const Jet: React.FC<{ x: number; y: number; s?: number; rot?: number; lights?: boolean; f?: number; smoke?: boolean; glow?: string }> = ({ x, y, s = 1, rot = 0, lights = true, f = 0, smoke, glow }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {smoke &&
      new Array(8).fill(0).map((_, i) => (
        <circle key={i} cx={-40 - i * 40 - ((f * 3) % 40)} cy={36 + Math.sin(f / 5 + i) * 6} r={12 + i * 5} fill="#9aa3b0" opacity={0.35 - i * 0.04} />
      ))}
    <path d="M -260 -10 Q -250 -40 -200 -40 L 200 -40 Q 270 -40 300 0 Q 270 30 200 30 L -200 30 Q -260 30 -260 -10 Z" fill="#e9edf2" stroke="#0b0a0c" strokeWidth={6} />
    <path d="M -230 -40 L -280 -130 L -230 -130 L -150 -40 Z" fill="#c9d2dc" stroke="#0b0a0c" strokeWidth={6} />
    <path d="M -60 10 L 40 10 L -40 110 L -110 110 Z" fill="#c9d2dc" stroke="#0b0a0c" strokeWidth={6} />
    <rect x={-50} y={36} width={80} height={30} rx={14} fill="#9aa3b0" stroke="#0b0a0c" strokeWidth={5} />
    {glow && <ellipse cx={-50} cy={51} rx={30} ry={18} fill={glow} opacity={0.6 + 0.3 * Math.sin(f / 3)} />}
    {new Array(14).fill(0).map((_, i) => (
      <rect key={i} x={-170 + i * 26} y={-22} width={12} height={14} rx={4} fill={lights ? "#ffd27a" : "#3a4656"} />
    ))}
    <path d="M 255 -20 L 285 -6 L 255 -6 Z" fill="#1c2a3a" />
    <rect x={-210} y={0} width={420} height={8} fill="#2f5aa8" />
  </g>
);

/* ============ Exterior sky view: jet over clouds, ground rises with `ground` 0..1 ============ */
export const SkyView: React.FC<{ f: number; night?: boolean; ground?: number; water?: boolean; ash?: number; children?: React.ReactNode }> = ({ f, night, ground = 0, water, ash = 0, children }) => (
  <>
    <Full blur={3}>
      <defs>
        <linearGradient id={night ? "skyN" : "skyD"} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={night ? "#050b1e" : "#2f6fc0"} />
          <stop offset="1" stopColor={night ? "#1a2350" : "#a9d4ff"} />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill={`url(#${night ? "skyN" : "skyD"})`} />
      {night && new Array(60).fill(0).map((_, i) => <circle key={i} cx={random("st" + i) * 1920} cy={random("sty" + i) * 600} r={1.5} fill="#fff" opacity={0.4 + 0.5 * Math.sin(f / 12 + i)} />)}
      {/* ground / sea rising */}
      <path d={`M 0 ${1080 - ground * 520} Q 480 ${1050 - ground * 560} 960 ${1080 - ground * 520} T 1920 ${1070 - ground * 520} L 1920 1080 L 0 1080 Z`} fill={water ? (night ? "#0a1830" : "#2a5a8a") : night ? "#141c18" : "#4a7a42"} />
      {!water &&
        ground > 0.2 &&
        new Array(14).fill(0).map((_, i) => (
          <rect key={i} x={((i * 160 - f * 4 * (1 + ground)) % 2100 + 2100) % 2100 - 100} y={1080 - ground * 500 + 30} width={100} height={8} fill={night ? "#ffd27a" : "#d9cfa0"} opacity={0.5} />
        ))}
      {/* clouds streaming past */}
      {new Array(9).fill(0).map((_, i) => {
        const x = ((i * 300 - f * (6 + (i % 3) * 3)) % 2400 + 2400) % 2400 - 240;
        return <ellipse key={i} cx={x} cy={200 + (i % 4) * 150 + ground * 200} rx={180 + (i % 3) * 60} ry={40 + (i % 2) * 20} fill={night ? "#2a3460" : "#ffffff"} opacity={night ? 0.5 : 0.75} />;
      })}
    </Full>
    {ash > 0 && (
      <Full blur={6}>
        {new Array(30).fill(0).map((_, i) => (
          <circle key={i} cx={((random("ax" + i) * 2200 - f * 8) % 2200 + 2200) % 2200 - 140} cy={random("ay" + i) * 1080} r={60 + random("ar" + i) * 120} fill="#5a5048" opacity={0.25 * ash} />
        ))}
      </Full>
    )}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {children}
    </svg>
  </>
);

/* ============ Gimli runway + drag-strip with go-karts ============ */
export const Runway: React.FC<{ f: number; jetX?: number; jetY?: number; jetRot?: number; sparks?: boolean; fire?: boolean }> = ({ f, jetX = -400, jetY = 600, jetRot = 0, sparks, fire }) => (
  <>
    <Full blur={2}>
      <defs>
        <linearGradient id="rwsky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#6aa6e8" />
          <stop offset="1" stopColor="#d9ecff" />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#rwsky)" />
      <rect x={0} y={560} width={1920} height={520} fill="#7aa05a" />
      <path d="M 0 700 L 1920 640 L 1920 760 L 0 860 Z" fill="#4a4a4a" />
      {new Array(12).fill(0).map((_, i) => (
        <rect key={i} x={i * 170} y={760 - i * 5.4} width={90} height={8} fill="#f6efdf" transform={`rotate(-1.8 ${i * 170} 760)`} />
      ))}
      {/* drag strip spectators + karts on the right */}
      {new Array(10).fill(0).map((_, i) => (
        <g key={i} transform={`translate(${1300 + i * 55} 600)`}>
          <circle cx={0} cy={-40} r={12} fill="#0b0a0c" />
          <rect x={-8} y={-30} width={16} height={30} rx={6} fill={["#e0452f", "#f2c21b", "#8f5bd8", "#2f8f9a"][i % 4]} />
        </g>
      ))}
      {[0, 1].map((i) => (
        <g key={i} transform={`translate(${1500 + i * 160 + Math.sin(f / 10 + i) * 6} 680)`}>
          <rect x={-40} y={-20} width={80} height={24} rx={8} fill={i ? "#f2c21b" : "#e0452f"} stroke="#0b0a0c" strokeWidth={4} />
          <circle cx={-26} cy={6} r={10} fill="#0b0a0c" />
          <circle cx={26} cy={6} r={10} fill="#0b0a0c" />
        </g>
      ))}
    </Full>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <Jet x={jetX} y={jetY} s={0.9} rot={jetRot} lights={false} f={f} />
      {sparks &&
        new Array(14).fill(0).map((_, i) => (
          <line key={i} x1={jetX + 230} y1={jetY + 40} x2={jetX + 230 - 60 - random("sp" + i + Math.floor(f / 2)) * 120} y2={jetY + 40 - random("spy" + i + Math.floor(f / 2)) * 50} stroke="#ffc23d" strokeWidth={3} />
        ))}
      {fire && new Array(6).fill(0).map((_, i) => <circle key={i} cx={jetX + 250 + Math.sin(f / 3 + i) * 10} cy={jetY + 10 - i * 14} r={16 - i * 2} fill={i % 2 ? "#ff8a3d" : "#ffc23d"} opacity={0.8} />)}
    </svg>
  </>
);

/* ============ Hudson river: jet floating, skyline behind ============ */
export const River: React.FC<{ f: number; floating?: number; children?: React.ReactNode }> = ({ f, floating = 1, children }) => (
  <>
    <Full blur={4}>
      <defs>
        <linearGradient id="hsky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#9fb3c8" />
          <stop offset="1" stopColor="#dfe6ee" />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#hsky)" />
      {new Array(30).fill(0).map((_, i) => {
        const h = 120 + random("hy" + i) * 320;
        return <rect key={i} x={i * 66} y={520 - h} width={60} height={h} fill="#6f7f92" />;
      })}
      <rect x={0} y={520} width={1920} height={560} fill="#4a6278" />
    </Full>
    <Full>
      {new Array(18).fill(0).map((_, i) => (
        <path key={i} d={`M ${((i * 120 + f * 2) % 2000) - 80} ${600 + (i % 6) * 70} q 30 -8 60 0`} stroke="#dfe6ee" strokeWidth={3} fill="none" opacity={0.5} />
      ))}
      <g transform={`translate(0 ${Math.sin(f / 20) * 4 * floating})`}>
        <Jet x={900} y={640} s={1.25} rot={0} lights={false} f={f} />
        <rect x={500} y={665} width={850} height={60} fill="#4a6278" opacity={0.85} />
      </g>
      {/* ferry */}
      <g transform={`translate(${1700 - Math.min(f, 200) * 1.5} 760)`}>
        <rect x={-120} y={-40} width={240} height={50} rx={10} fill="#f2c21b" stroke="#0b0a0c" strokeWidth={5} />
        <rect x={-70} y={-80} width={140} height={44} rx={8} fill="#f6efdf" stroke="#0b0a0c" strokeWidth={5} />
      </g>
      {children}
    </Full>
  </>
);

/* ============ Bedroom at night ============ */
export const Bedroom: React.FC<{ f: number; clock?: string; morning?: number; lamp?: boolean }> = ({ f, clock = "3:14", morning = 0, lamp = true }) => (
  <>
    <Full blur={3}>
      <rect width={1920} height={1080} fill={morning > 0.5 ? "#3a4258" : "#161c30"} />
      <rect x={1180} y={140} width={520} height={420} fill={morning > 0.5 ? "#f2c48a" : "#0b1430"} stroke="#0a0e18" strokeWidth={18} />
      {morning < 0.5 && <circle cx={1580} cy={250} r={50} fill="#e8f0ff" opacity={0.8} />}
      {morning < 0.5 && new Array(25).fill(0).map((_, i) => <circle key={i} cx={1200 + random("bs" + i) * 480} cy={160 + random("bsy" + i) * 220} r={2} fill="#fff" opacity={0.4 + 0.4 * Math.sin(f / 10 + i)} />)}
      <line x1={1440} y1={140} x2={1440} y2={560} stroke="#0a0e18" strokeWidth={12} />
      {/* shelf, poster */}
      <rect x={140} y={200} width={220} height={280} fill="#2a3456" stroke="#0a0e18" strokeWidth={8} />
      <circle cx={250} cy={320} r={60} fill="#7aa7ff" opacity={0.4} />
      <rect x={420} y={420} width={300} height={14} fill="#0a0e18" />
      {[440, 490, 540, 600].map((x, i) => (
        <rect key={x} x={x} y={360 + (i % 2) * 14} width={36} height={60 - (i % 2) * 14} fill={["#a85a4a", "#5a7aa8", "#d9b45a", "#6a9a6a"][i]} />
      ))}
    </Full>
    <Full>
      {lamp && <Cone id="bedlamp" x={1780} y={520} w={420} h={380} color="#ffcf8a" o={0.22} flicker={0.95 + 0.05 * Math.sin(f / 3)} />}
      {/* bed */}
      <rect x={260} y={640} width={1100} height={140} rx={30} fill="#3a4a7a" stroke="#0a0e18" strokeWidth={8} />
      <rect x={260} y={600} width={280} height={90} rx={30} fill="#e9e2d4" stroke="#0a0e18" strokeWidth={6} />
      <rect x={520} y={630} width={840} height={110} rx={30} fill="#5a6aa8" stroke="#0a0e18" strokeWidth={6} />
      <rect x={240} y={480} width={40} height={360} fill="#2a2a3a" />
      {/* nightstand + clock */}
      <rect x={1560} y={640} width={260} height={240} fill="#4a3a2a" stroke="#0a0e18" strokeWidth={6} />
      <rect x={1600} y={570} width={180} height={76} rx={10} fill="#0b0a0c" stroke="#2a2a3a" strokeWidth={5} />
      <text x={1690} y={626} textAnchor="middle" fontFamily="Arial Black" fontSize={46} fill="#ff3d4d">
        {clock}
      </text>
      <rect x={0} y={880} width={1920} height={200} fill="#0c111c" />
    </Full>
    {morning > 0 && <div style={{ position: "absolute", inset: 0, background: "#ffd9a0", opacity: morning * 0.15, mixBlendMode: "screen" }} />}
  </>
);

/* ============ 1964 school gym ============ */
export const Gym: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Full blur={3}>
      <rect width={1920} height={1080} fill="#c99a5a" />
      <rect x={0} y={0} width={1920} height={560} fill="#7a5a3a" />
      {new Array(12).fill(0).map((_, i) => (
        <rect key={i} x={i * 170} y={0} width={8} height={560} fill="#6a4a2a" />
      ))}
      <rect x={760} y={120} width={400} height={20} fill="#f6efdf" />
      <rect x={880} y={140} width={160} height={110} fill="none" stroke="#f6efdf" strokeWidth={8} />
      <ellipse cx={960} cy={280} rx={70} ry={14} fill="none" stroke="#ff6a2a" strokeWidth={8} />
      <path d="M 900 286 L 930 360 L 990 360 L 1020 286" stroke="#f6efdf" strokeWidth={3} fill="none" />
      <text x={300} y={200} fontFamily="Arial Black" fontSize={60} fill="#f2c21b" opacity={0.8}>
        SCIENCE FAIR 1964
      </text>
      {new Array(20).fill(0).map((_, i) => (
        <rect key={i} x={i * 100} y={560} width={96} height={320} fill={i % 2 ? "#d9a866" : "#cfa060"} />
      ))}
      <path d="M 0 720 Q 960 640 1920 720" stroke="#f6efdf" strokeWidth={6} fill="none" opacity={0.6} />
    </Full>
    <Full>
      <Cone id="gym1" x={600} y={0} w={700} h={900} color="#fff1c4" o={0.12} />
      <Cone id="gym2" x={1320} y={0} w={700} h={900} color="#fff1c4" o={0.12} />
      <rect x={0} y={880} width={1920} height={200} fill="#8a6a3a" />
      {/* bouncing ball */}
      <circle cx={1500} cy={880 - Math.abs(Math.sin(f / 9)) * 220} r={28} fill="#ff6a2a" stroke="#0b0a0c" strokeWidth={4} />
    </Full>
  </>
);
