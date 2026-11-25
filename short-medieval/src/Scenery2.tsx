import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { INK } from "./Characters";
import { Floor, H, Room, W } from "./Scenery";

/* ---------------- GTA / Leonida ---------------- */
export const Palm: React.FC<{ x: number; y: number; s?: number; seed?: number; dark?: boolean }> = ({ x, y, s = 1, seed = 0, dark = false }) => {
  const f = useCurrentFrame();
  const sw = Math.sin(f / 25 + seed) * 4;
  const trunk = dark ? "#2a1640" : "#9a6a3a";
  const leaf = dark ? "#1e0f33" : "#3f9a4f";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M0 0 Q${-30 + sw} -250 ${20 + sw * 2} -520`} stroke={INK} strokeWidth="34" fill="none" strokeLinecap="round" />
      <path d={`M0 0 Q${-30 + sw} -250 ${20 + sw * 2} -520`} stroke={trunk} strokeWidth="22" fill="none" strokeLinecap="round" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const a = -170 + i * 50 + Math.sin(f / 18 + i + seed) * 6;
        return (
          <path
            key={i}
            transform={`translate(${20 + sw * 2} -520) rotate(${a})`}
            d="M0 0 Q90 -40 200 20 Q110 -5 0 0 Z"
            fill={leaf}
            stroke={INK}
            strokeWidth="7"
            strokeLinejoin="round"
          />
        );
      })}
    </g>
  );
};

export const ViceCity: React.FC<{ children?: React.ReactNode; night?: boolean }> = ({ children, night = false }) => {
  const f = useCurrentFrame();
  const sky = night ? ["#0b0624", "#3a0f5a", "#8a1f6a"] : ["#2b1055", "#ff3c7d", "#ffb347"];
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="vsky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={sky[0]} />
          <stop offset="0.45" stopColor={sky[1]} />
          <stop offset="0.62" stopColor={sky[2]} />
        </linearGradient>
        <linearGradient id="vsun" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff36b" />
          <stop offset="1" stopColor="#ff4f8b" />
        </linearGradient>
        <linearGradient id="vsea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ff7aa8" />
          <stop offset="0.3" stopColor="#5a2a8a" />
          <stop offset="1" stopColor="#1a0b3a" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#vsky)" />
      {night &&
        Array.from({ length: 60 }).map((_, i) => (
          <circle key={i} cx={random(`s${i}`) * W} cy={random(`t${i}`) * 700} r={2 + random(`r${i}`) * 2} fill="white" opacity={0.4 + 0.5 * Math.abs(Math.sin(f / 20 + i))} />
        ))}
      {/* striped sun */}
      <g>
        <circle cx="540" cy="900" r="260" fill="url(#vsun)" opacity={night ? 0.35 : 1} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x="260" y={930 + i * 38 + ((f * 0.6) % 38)} width="560" height={6 + i * 3} fill={sky[1]} />
        ))}
      </g>
      {/* skyline */}
      {Array.from({ length: 16 }).map((_, i) => {
        const bw = 60 + random(`bw${i}`) * 60;
        const bh = 180 + random(`bh${i}`) * 380;
        const x = i * 72 - 40;
        return (
          <g key={i}>
            <rect x={x} y={1130 - bh} width={bw} height={bh} fill="#2a1240" stroke={INK} strokeWidth="5" />
            {Array.from({ length: Math.floor(bh / 45) }).map((__, r) => (
              <rect key={r} x={x + 12} y={1130 - bh + 20 + r * 45} width={bw - 24} height="10" fill={random(`w${i}${r}`) > 0.5 ? "#ff5fb0" : "#4de1ff"} opacity={0.35 + 0.45 * (random(`o${i}${r}`) > 0.5 ? 1 : 0.2)} />
            ))}
          </g>
        );
      })}
      {/* sea */}
      <rect x="0" y="1130" width={W} height="300" fill="url(#vsea)" />
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={i} x={(i * 137 + f * (1 + (i % 3))) % 1200 - 100} y={1150 + i * 26} width={80 + (i % 4) * 30} height="5" rx="3" fill="#ffd0e6" opacity="0.5" />
      ))}
      {/* promenade floor */}
      <rect x="0" y="1420" width={W} height={H - 1420} fill="#e8b48a" />
      <g opacity="0.9">
        <Floor a="#f2c49c" b="#d99a72" y0={1420} rows={6} />
      </g>
      <Palm x={110} y={1500} s={1.35} seed={1} dark={night} />
      <Palm x={980} y={1460} s={1.2} seed={3} dark={night} />
      <Palm x={820} y={1200} s={0.6} seed={5} dark />
      <Palm x={260} y={1190} s={0.55} seed={7} dark />
      <defs>
        <radialGradient id="vglow" cx="50%" cy="45%" r="70%">
          <stop offset="0" stopColor="#ffd0a0" stopOpacity="0.18" />
          <stop offset="0.5" stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="#120420" stopOpacity="0.5" />
        </radialGradient>
      </defs>
      {children}
      <rect width={W} height={H} fill="url(#vglow)" />
    </svg>
  );
};

export const Keys: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="ksky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#4fb3e8" />
          <stop offset="1" stopColor="#bfe9f7" />
        </linearGradient>
        <linearGradient id="ksea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#3fd0c9" />
          <stop offset="1" stopColor="#0f7fa0" />
        </linearGradient>
        <linearGradient id="plank" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#b98a5a" />
          <stop offset="1" stopColor="#6e4a2a" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#ksky)" />
      <circle cx="850" cy="300" r="90" fill="#fff7c8" />
      {[0, 1].map((i) => {
        const cx = ((i * 600 + f * 0.8) % 1500) - 200;
        return <ellipse key={i} cx={cx} cy={220 + i * 160} rx="140" ry="45" fill="white" opacity="0.9" />;
      })}
      <rect x="0" y="900" width={W} height="700" fill="url(#ksea)" />
      {/* islets */}
      <ellipse cx="220" cy="905" rx="200" ry="30" fill="#e9d79a" stroke={INK} strokeWidth="6" />
      <Palm x={200} y={900} s={0.45} seed={2} />
      <Palm x={280} y={900} s={0.38} seed={4} />
      <ellipse cx="900" cy="915" rx="140" ry="22" fill="#e9d79a" stroke={INK} strokeWidth="6" />
      <Palm x={900} y={910} s={0.35} seed={6} />
      {Array.from({ length: 14 }).map((_, i) => (
        <rect key={i} x={(i * 97 + f * (0.8 + (i % 3) * 0.4)) % 1200 - 100} y={940 + i * 45} width={60 + (i % 4) * 25} height="6" rx="3" fill="white" opacity="0.45" />
      ))}
      {/* boat */}
      <g transform={`translate(${700 + Math.sin(f / 30) * 20} ${1060 + Math.sin(f / 9) * 6}) rotate(${Math.sin(f / 11) * 2})`}>
        <path d="M-160 0 L160 0 L120 60 L-130 60 Z" fill="#f4f4f0" stroke={INK} strokeWidth="8" strokeLinejoin="round" />
        <rect x="-70" y="-60" width="120" height="60" fill="#e8eef4" stroke={INK} strokeWidth="7" />
        <rect x="-55" y="-48" width="40" height="26" fill="#5fb4e0" />
        <rect x="-5" y="-48" width="40" height="26" fill="#5fb4e0" />
        <path d="M-160 20 L160 20" stroke="#d7263d" strokeWidth="8" />
      </g>
      {/* seagulls */}
      {[0, 1, 2].map((i) => {
        const x = ((i * 300 + f * 2.5) % 1300) - 100;
        const w = Math.sin(f / 4 + i) * 10;
        return <path key={i} d={`M${x - 30} ${500 + i * 60 + w} q15 -15 30 0 q15 -15 30 0`} stroke={INK} strokeWidth="6" fill="none" />;
      })}
      {/* pier */}
      <rect x="0" y="1500" width={W} height={H - 1500} fill="url(#plank)" />
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={i} x1="0" x2={W} y1={1540 + i * 70} y2={1540 + i * 70} stroke="#4a2e18" strokeWidth="7" />
      ))}
      {[80, 1000].map((x) => (
        <rect key={x} x={x - 25} y="1380" width="50" height="160" fill="#7a5230" stroke={INK} strokeWidth="7" />
      ))}
      {children}
    </svg>
  );
};

/** Police booking wall with height lines */
export const MugshotWall: React.FC<{ children?: React.ReactNode; tint?: string }> = ({ children, tint = "#9aa6b5" }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="mlight" cx="50%" cy="35%" r="70%">
        <stop offset="0" stopColor="white" stopOpacity="0.35" />
        <stop offset="0.5" stopColor="white" stopOpacity="0" />
        <stop offset="1" stopColor="#05070c" stopOpacity="0.55" />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill={tint} />
    {Array.from({ length: 14 }).map((_, i) => {
      const y = 1500 - i * 100;
      return (
        <g key={i}>
          <line x1="0" x2={W} y1={y} y2={y} stroke="#20242c" strokeWidth={i % 2 ? 4 : 9} opacity="0.75" />
          {i % 2 === 0 && (
            <text x="40" y={y - 14} fontFamily="Oswald" fontWeight="700" fontSize="44" fill="#20242c" opacity="0.8">
              {`${4 + i / 2}'0"`}
            </text>
          )}
        </g>
      );
    })}
    <rect x="0" y="1500" width={W} height={H - 1500} fill="#3a3f4a" />
    <Floor a="#4a505c" b="#353a45" y0={1500} rows={6} />
    {children}
    <rect width={W} height={H} fill="url(#mlight)" />
  </svg>
);

/** Booking placard held at chest */
export const Placard: React.FC<{ name: string; num: string; x: number; y: number; w?: number }> = ({ name, num, x, y, w = 460 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y + Math.sin(f / 11) * 4, width: w, zIndex: 3000, transform: `rotate(${Math.sin(f / 17) * 1.5}deg)` }}>
      <div style={{ background: "#14161c", border: `8px solid ${INK}`, borderRadius: 10, padding: "14px 10px", textAlign: "center", boxShadow: "0 14px 0 rgba(0,0,0,0.35)" }}>
        <div style={{ fontFamily: "Oswald", fontWeight: 700, fontSize: 40, color: "#cfd6e0", letterSpacing: 3 }}>LEONIDA PD</div>
        <div style={{ fontFamily: "Oswald", fontWeight: 700, fontSize: 64, color: "white", lineHeight: 1.05 }}>{name}</div>
        <div style={{ fontFamily: "Oswald", fontWeight: 700, fontSize: 44, color: "#ffcf4a", letterSpacing: 4 }}>{num}</div>
      </div>
    </div>
  );
};

/** Detective cork board with pinned photos + red strings */
export const CorkBoard: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id="clight" cx="50%" cy="40%" r="70%">
          <stop offset="0" stopColor="#fff1c8" stopOpacity="0.3" />
          <stop offset="0.5" stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="#120a04" stopOpacity="0.6" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="#3c2f2a" />
      <rect x="40" y="200" width="1000" height="1500" rx="16" fill="#b8854f" stroke="#5a3a22" strokeWidth="30" />
      {Array.from({ length: 220 }).map((_, i) => (
        <circle key={i} cx={60 + random(`cx${i}`) * 960} cy={220 + random(`cy${i}`) * 1460} r={2 + random(`cr${i}`) * 3} fill="#8f5f33" opacity="0.6" />
      ))}
      {/* sticky notes */}
      {[
        [180, 1500, "#ffe066", -6],
        [820, 330, "#8ef0b4", 5],
        [860, 1450, "#ff9ad5", -3],
      ].map(([x, y, c, r], i) => (
        <rect key={i} x={x as number} y={y as number} width="150" height="150" fill={c as string} stroke={INK} strokeWidth="5" transform={`rotate(${r} ${x} ${y})`} opacity="0.95" />
      ))}
      {children}
      <rect width={W} height={H} fill="url(#clight)" opacity={0.95 + 0.05 * Math.sin(f / 10)} />
    </svg>
  );
};

/** red string between two points, drawn progressively */
export const RedString: React.FC<{ x1: number; y1: number; x2: number; y2: number; p: number }> = ({ x1, y1, x2, y2, p }) => {
  if (p <= 0) return null;
  const xe = x1 + (x2 - x1) * p;
  const ye = y1 + (y2 - y1) * p;
  const sag = 40 * p;
  return <path d={`M${x1} ${y1} Q${(x1 + xe) / 2} ${(y1 + ye) / 2 + sag} ${xe} ${ye}`} stroke="#c8102e" strokeWidth="7" fill="none" style={{ position: "absolute" }} />;
};

/** Polaroid frame (HTML) to host a mini character */
export const Polaroid: React.FC<{ x: number; y: number; w?: number; rot?: number; label: string; children: React.ReactNode; bg?: string }> = ({ x, y, w = 380, rot = 0, label, children, bg = "#8fc9d8" }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, transform: `rotate(${rot}deg)`, zIndex: 2000 }}>
    <div style={{ background: "#f7f4ec", border: `7px solid ${INK}`, padding: "20px 20px 10px", boxShadow: "0 16px 0 rgba(0,0,0,0.3)" }}>
      <div style={{ height: w * 0.95, background: bg, border: `5px solid ${INK}`, overflow: "hidden", position: "relative" }}>{children}</div>
      <div style={{ fontFamily: "Oswald", fontWeight: 700, fontSize: 46, textAlign: "center", color: INK, paddingTop: 6 }}>{label}</div>
    </div>
    <div style={{ position: "absolute", left: w / 2 - 22, top: -18, width: 44, height: 44, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #ff7b7b, #b3121f)", border: `5px solid ${INK}` }} />
  </div>
);

/** Hotel room with a TV whose screen content is passed as children (svg coords 0..600 x 0..360) */
export const HotelRoom: React.FC<{ screen?: React.ReactNode; children?: React.ReactNode }> = ({ screen, children }) => {
  const f = useCurrentFrame();
  return (
    <Room wall="#c9b8a0" side="#9c8a72" floorA="#7d5a4a" floorB="#6b4a3c" trim="#5b4032">
      {/* window with night city */}
      <rect x="640" y="330" width="230" height="330" fill="#14183a" stroke={INK} strokeWidth="10" />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={655 + (i % 4) * 55} y={480 + Math.floor(i / 4) * 55} width="30" height={60 + (i % 3) * 30} fill="#2a2f60" />
      ))}
      {Array.from({ length: 14 }).map((_, i) => (
        <rect key={`w${i}`} x={660 + (i % 4) * 55} y={500 + Math.floor(i / 4) * 45} width="8" height="8" fill="#ffd56b" opacity={0.5 + 0.5 * Math.sin(f / 13 + i)} />
      ))}
      <line x1="755" x2="755" y1="330" y2="660" stroke={INK} strokeWidth="8" />
      {/* bed */}
      <rect x="180" y="880" width="330" height="200" rx="16" fill="#f1ede4" stroke={INK} strokeWidth="9" />
      <rect x="180" y="840" width="330" height="70" rx="20" fill="#7a2f3a" stroke={INK} strokeWidth="9" />
      <rect x="200" y="900" width="120" height="60" rx="18" fill="white" stroke={INK} strokeWidth="6" />
      {/* TV */}
      <rect x="560" y="1000" width="160" height="120" fill="#4a3428" stroke={INK} strokeWidth="8" />
      <g transform="translate(445 690)">
        <rect x="-10" y="-10" width="420" height="270" rx="12" fill="#15151a" stroke={INK} strokeWidth="10" />
        <svg x="5" y="5" width="390" height="240" viewBox="0 0 600 360">
          <rect width="600" height="360" fill="#05070a" />
          {screen}
        </svg>
        <circle cx="200" cy="-60" r="0" />
      </g>
      {children}
    </Room>
  );
};

/** scrolling green code for screens (svg 600x360) */
export const CodeScreen: React.FC<{ color?: string }> = ({ color = "#3dff7a" }) => {
  const f = useCurrentFrame();
  return (
    <g fontFamily="monospace" fontSize="26" fill={color}>
      {Array.from({ length: 14 }).map((_, i) => {
        const k = Math.floor(f / 3) + i;
        const len = 6 + Math.floor(random(`c${k}`) * 30);
        return (
          <text key={i} x="16" y={30 + i * 26} opacity={0.5 + 0.5 * random(`o${k}`)}>
            {Array.from({ length: len }, (_, j) => "01{}<>/#$=ABCDEFxk"[Math.floor(random(`ch${k}-${j}`) * 18)]).join("")}
          </text>
        );
      })}
    </g>
  );
};

/** Shop shelf with game boxes */
export const GameShop: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <Room wall="#2a2340" side="#1b1630" floorA="#3a3350" floorB="#2a2440" trim="#151024">
    {[0, 1, 2].map((r) => (
      <g key={r}>
        <rect x="190" y={420 + r * 220} width="700" height="20" fill="#b8b2c8" stroke={INK} strokeWidth="6" />
        {Array.from({ length: 6 }).map((_, i) => (
          <g key={i} transform={`translate(${215 + i * 112} ${280 + r * 220})`}>
            <rect width="92" height="140" rx="6" fill="url(#box)" stroke={INK} strokeWidth="6" />
            <text x="46" y="92" textAnchor="middle" fontFamily="Oswald" fontWeight="700" fontSize="58" fill="white" stroke={INK} strokeWidth="3" paintOrder="stroke">
              VI
            </text>
          </g>
        ))}
      </g>
    ))}
    <defs>
      <linearGradient id="box" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#ff4f9a" />
        <stop offset="1" stopColor="#ff9a3c" />
      </linearGradient>
    </defs>
    {children}
  </Room>
);

/* ---------------- space ---------------- */
export const Stars: React.FC<{ n?: number; drift?: number }> = ({ n = 140, drift = 0.3 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 60% 30%, #1d1645 0%, #0a0820 55%, #03030a 100%)" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {Array.from({ length: n }).map((_, i) => {
          const z = 0.3 + random(`z${i}`) * 0.7;
          const x = (random(`x${i}`) * (W + 200) - f * drift * z + 4000) % (W + 200) - 100;
          return <circle key={i} cx={x} cy={random(`y${i}`) * H} r={1.2 + z * 3} fill="white" opacity={0.3 + 0.7 * Math.abs(Math.sin(f / (12 + i % 9) + i))} />;
        })}
        <ellipse cx="300" cy="500" rx="420" ry="160" fill="#6b3fa0" opacity="0.12" transform="rotate(-25 300 500)" />
        <ellipse cx="800" cy="1400" rx="380" ry="140" fill="#2f7fbf" opacity="0.1" transform="rotate(20 800 1400)" />
      </svg>
    </AbsoluteFill>
  );
};

/** Planet with bands, outline and terminator shading. kind: venus | earth | mercury | sun */
export const Planet: React.FC<{ kind: "venus" | "earth" | "mercury" | "sun"; r: number; spin?: number; face?: boolean; expr?: "neutral" | "worried" | "happy" | "smug" | "surprised" | "angry"; talking?: boolean }> = ({
  kind,
  r,
  spin = 0,
  face = false,
  expr = "neutral",
  talking = false,
}) => {
  const f = useCurrentFrame();
  const id = `pl${kind}${r}`;
  const cols = {
    venus: ["#ffe2a0", "#f0b45a", "#c97a2a"],
    earth: ["#7fd0ff", "#2f86d8", "#1a4f9a"],
    mercury: ["#d8d2cc", "#a39a92", "#6e6660"],
    sun: ["#fff6b0", "#ffc93c", "#ff8a1f"],
  }[kind];
  const size = r * 2.6;
  return (
    <svg width={size} height={size} viewBox={`${-r * 1.3} ${-r * 1.3} ${size} ${size}`} style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`${id}g`} cx="38%" cy="35%" r="70%">
          <stop offset="0" stopColor={cols[0]} />
          <stop offset="0.6" stopColor={cols[1]} />
          <stop offset="1" stopColor={cols[2]} />
        </radialGradient>
        <clipPath id={`${id}c`}>
          <circle r={r} />
        </clipPath>
      </defs>
      {kind === "sun" && (
        <>
          <radialGradient id={`${id}glow`}>
            <stop offset="0.6" stopColor="#ffd36b" stopOpacity="0.6" />
            <stop offset="1" stopColor="#ffb53c" stopOpacity="0" />
          </radialGradient>
          <circle r={r * (1.5 + 0.06 * Math.sin(f / 6))} fill={`url(#${id}glow)`} />
        </>
      )}
      <circle r={r} fill={`url(#${id}g)`} stroke={INK} strokeWidth={Math.max(6, r * 0.045)} />
      <g clipPath={`url(#${id}c)`}>
        {kind === "venus" &&
          [-0.6, -0.3, 0, 0.3, 0.6].map((k, i) => (
            <path key={i} d={`M${-r * 1.5 + ((spin * r) % (r * 0.8))} ${k * r} q${r * 0.4} ${-r * 0.12} ${r * 0.8} 0 t${r * 0.8} 0 t${r * 0.8} 0 t${r * 0.8} 0`} stroke="#fff0c8" strokeWidth={r * 0.07} fill="none" opacity="0.55" />
          ))}
        {kind === "earth" &&
          [
            [-0.3, -0.2, 0.35, 0.25],
            [0.35, 0.25, 0.3, 0.35],
            [-0.1, 0.55, 0.25, 0.15],
          ].map(([x, y, a, b], i) => <ellipse key={i} cx={((x + spin * 0.2 + 1.5) % 3 - 1.5) * r} cy={y * r} rx={a * r} ry={b * r} fill="#5cbf5a" stroke={INK} strokeWidth={r * 0.03} />)}
        {kind === "mercury" &&
          [
            [-0.3, -0.3, 0.18],
            [0.35, 0.1, 0.14],
            [-0.05, 0.45, 0.1],
          ].map(([x, y, a], i) => <circle key={i} cx={x * r} cy={y * r} r={a * r} fill="#8a817a" stroke={INK} strokeWidth={r * 0.025} />)}
        {kind !== "sun" && <circle cx={r * 0.45} cy={r * 0.35} r={r * 1.05} fill="#0a0820" opacity="0.28" />}
      </g>
      {face && (
        <g transform={`scale(${r / 150})`}>
          <ellipse cx={-45} cy={-10} rx={13} ry={expr === "surprised" ? 22 : 17} fill={INK} />
          <ellipse cx={45} cy={-10} rx={13} ry={expr === "surprised" ? 22 : 17} fill={INK} />
          {expr === "worried" ? (
            <path d="M-70 -55 Q-45 -70 -25 -48 M70 -55 Q45 -70 25 -48" stroke={INK} strokeWidth="9" fill="none" strokeLinecap="round" />
          ) : (
            <path d="M-70 -50 Q-45 -62 -22 -52 M70 -50 Q45 -62 22 -52" stroke={INK} strokeWidth="9" fill="none" strokeLinecap="round" />
          )}
          {talking || expr === "surprised" ? (
            <ellipse cx="8" cy="45" rx="22" ry={8 + Math.abs(Math.sin(f * 0.6)) * (talking ? 14 : 10)} fill="#3a1620" stroke={INK} strokeWidth="6" />
          ) : (
            <path d={expr === "happy" ? "M-25 38 Q5 70 35 36" : "M-20 45 Q5 58 30 40"} stroke={INK} strokeWidth="8" fill="none" strokeLinecap="round" />
          )}
        </g>
      )}
    </svg>
  );
};

/** Venus surface: orange haze, volcanoes, rocks, heat shimmer */
export const VenusSurface: React.FC<{ children?: React.ReactNode; acid?: boolean }> = ({ children, acid = false }) => {
  const f = useCurrentFrame();
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="vsk" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#6b3a12" />
          <stop offset="0.5" stopColor="#d9822b" />
          <stop offset="0.75" stopColor="#f2b35c" />
        </linearGradient>
        <linearGradient id="vgr" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#8a4a1c" />
          <stop offset="1" stopColor="#3a1c0a" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#vsk)" />
      {/* thick clouds */}
      {Array.from({ length: 7 }).map((_, i) => {
        const x = ((i * 260 - f * (1 + (i % 3) * 0.6)) % 1600 + 1600) % 1600 - 300;
        return <ellipse key={i} cx={x} cy={150 + (i % 4) * 110} rx={260} ry={70} fill={acid ? "#e8e26a" : "#f6c98a"} opacity={acid ? 0.7 : 0.5} stroke={acid ? INK : "none"} strokeWidth={acid ? 6 : 0} />;
      })}
      {acid &&
        Array.from({ length: 30 }).map((_, i) => {
          const x = random(`ax${i}`) * W;
          const y = ((random(`ay${i}`) * 900 + f * 14) % 900) + 400;
          return <path key={i} d={`M${x} ${y} q-8 18 0 26 q8 -8 0 -26`} fill="#d8ff4a" stroke={INK} strokeWidth="3" opacity="0.85" />;
        })}
      {/* volcanoes */}
      {[
        [220, 1150, 260, 420],
        [760, 1150, 330, 520],
      ].map(([x, y, w, h], i) => (
        <g key={i}>
          <path d={`M${x - w} ${y} L${x - 50} ${y - h} L${x + 50} ${y - h} L${x + w} ${y} Z`} fill="#6e3814" stroke={INK} strokeWidth="9" strokeLinejoin="round" />
          <path d={`M${x - 50} ${y - h} Q${x} ${y - h + 30} ${x + 50} ${y - h}`} fill="#ff6a1a" stroke={INK} strokeWidth="6" />
          <path d={`M${x - 10} ${y - h + 10} Q${x - 30} ${y - h + 140} ${x - 60} ${y - h + 260}`} stroke="#ff8a2a" strokeWidth="18" fill="none" strokeLinecap="round" opacity="0.9" />
          {[0, 1, 2].map((k) => {
            const t = ((f + k * 25 + i * 13) % 75) / 75;
            return <circle key={k} cx={x + Math.sin(k * 2 + i) * 40 * t} cy={y - h - 30 - t * 260} r={30 + t * 70} fill="#5a3a2a" opacity={0.55 * (1 - t)} />;
          })}
        </g>
      ))}
      <rect x="0" y="1150" width={W} height={H - 1150} fill="url(#vgr)" />
      {Array.from({ length: 26 }).map((_, i) => {
        const y = 1180 + Math.pow(random(`ry${i}`), 1.3) * 720;
        const s = 0.5 + (y - 1150) / 700;
        return <ellipse key={i} cx={random(`rx${i}`) * W} cy={y} rx={34 * s} ry={14 * s} fill="#5a2c10" stroke={INK} strokeWidth="4" />;
      })}
      {/* heat shimmer lines */}
      {Array.from({ length: 6 }).map((_, i) => (
        <path key={i} d={`M${100 + i * 170} ${1300 + Math.sin(f / 5 + i) * 10} q20 -30 0 -60 q-20 -30 0 -60`} stroke="#ffd08a" strokeWidth="5" fill="none" opacity={0.25 + 0.2 * Math.sin(f / 4 + i)} />
      ))}
      {children}
      <rect width={W} height={H} fill="#ff7a1a" opacity={0.08 + 0.04 * Math.sin(f / 7)} />
    </svg>
  );
};

/** Underwater depth comparison */
export const Underwater: React.FC<{ depth: number; children?: React.ReactNode }> = ({ depth, children }) => {
  const f = useCurrentFrame();
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="uw" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#2a8fc9" />
          <stop offset="0.5" stopColor="#0d3f73" />
          <stop offset="1" stopColor="#020b1f" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#uw)" />
      {Array.from({ length: 6 }).map((_, i) => (
        <polygon key={i} points={`${100 + i * 180},0 ${160 + i * 180},0 ${60 + i * 180 + Math.sin(f / 20 + i) * 40},1200 ${0 + i * 180},1200`} fill="white" opacity={0.04} />
      ))}
      {Array.from({ length: 20 }).map((_, i) => {
        const y = H - ((f * (2 + (i % 4)) + random(`by${i}`) * H) % H);
        return <circle key={i} cx={random(`bx${i}`) * W + Math.sin(f / 9 + i) * 10} cy={y} r={4 + (i % 4) * 3} fill="none" stroke="#bfe9ff" strokeWidth="3" opacity="0.6" />;
      })}
      {/* depth gauge */}
      <g transform="translate(900 200)">
        <rect x="0" y="0" width="40" height="1400" rx="20" fill="#0a1a33" stroke="#bfe9ff" strokeWidth="5" />
        <rect x="6" y="6" width="28" height={1388 * depth} rx="14" fill="#4de1ff" />
        {[0, 0.25, 0.5, 0.75, 1].map((k) => (
          <text key={k} x="-20" y={14 + k * 1380} textAnchor="end" fontFamily="Oswald" fontWeight="700" fontSize="40" fill="#bfe9ff">
            {`${Math.round(k * 1000)} m`}
          </text>
        ))}
      </g>
      {children}
    </svg>
  );
};

/** generic glowing screen sign (in-world TV / counter) */
export const Counter: React.FC<{ from: number; to: number; at: number; dur: number; suffix?: string }> = ({ from, to, at, dur, suffix = "" }) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [at, at + dur], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <>{Math.round(v).toLocaleString("es-ES") + suffix}</>;
};
