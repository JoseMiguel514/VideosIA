import React from "react";
import { useCurrentFrame } from "remotion";

export const INK = "#1b1420";

type Expr = "neutral" | "happy" | "surprised" | "angry" | "smug" | "worried";

/* ---------- shared face parts ---------- */
const Eyes: React.FC<{ cx: number; cy: number; gap: number; size: number; expr: Expr; f: number; seed: number; look?: number }> = ({
  cx,
  cy,
  gap,
  size,
  expr,
  f,
  seed,
  look = 0,
}) => {
  const blink = (f + seed * 37) % 97 < 4 ? 0.12 : 1;
  const big = expr === "surprised" ? 1.35 : expr === "worried" ? 1.1 : 1;
  const ry = size * 1.25 * big * blink * (expr === "smug" ? 0.55 : 1);
  const rx = size * big;
  const brow = (side: -1 | 1) => {
    const x = cx + side * gap;
    const y = cy - size * 1.9 * (expr === "surprised" ? 1.25 : 1);
    let tilt = 0;
    if (expr === "angry") tilt = 9;
    if (expr === "worried") tilt = -9;
    if (expr === "smug") tilt = side === 1 ? -6 : 3;
    return (
      <path
        d={`M${x - size * 1.1} ${y + tilt * -side * 0.6 + (side === 1 ? 0 : 0)} Q${x} ${y - size * 0.5 + (expr === "angry" ? size * 0.4 : 0)} ${x + size * 1.1} ${y + tilt * side * 0.6}`}
        stroke={INK}
        strokeWidth={size * 0.42}
        fill="none"
        strokeLinecap="round"
      />
    );
  };
  return (
    <g>
      {[-1, 1].map((s) => (
        <g key={s}>
          <ellipse cx={cx + s * gap + look} cy={cy} rx={rx} ry={ry} fill={INK} />
          {blink > 0.5 && (
            <>
              <circle cx={cx + s * gap + look + rx * 0.35} cy={cy - ry * 0.35} r={rx * 0.38} fill="white" />
              <circle cx={cx + s * gap + look - rx * 0.3} cy={cy + ry * 0.35} r={rx * 0.16} fill="white" />
            </>
          )}
          {brow(s as -1 | 1)}
        </g>
      ))}
    </g>
  );
};

const Mouth: React.FC<{ cx: number; cy: number; w: number; expr: Expr; talking: boolean; f: number }> = ({ cx, cy, w, expr, talking, f }) => {
  const open = talking ? 0.2 + Math.abs(Math.sin(f * 0.6) * Math.sin(f * 0.21 + 1)) * 0.9 : 0;
  if (expr === "surprised" || open > 0.25) {
    const h = expr === "surprised" ? w * 0.75 : w * 0.55 * open + 4;
    return (
      <g>
        <ellipse cx={cx} cy={cy + h * 0.3} rx={w * (expr === "surprised" ? 0.38 : 0.5)} ry={h * 0.6} fill="#5a1a22" stroke={INK} strokeWidth={6} />
        <ellipse cx={cx} cy={cy + h * 0.55} rx={w * 0.22} ry={h * 0.22} fill="#e2607a" />
      </g>
    );
  }
  if (expr === "angry" || expr === "worried")
    return <path d={`M${cx - w / 2} ${cy + 10} Q${cx} ${cy - 10} ${cx + w / 2} ${cy + 10}`} stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />;
  if (expr === "smug")
    return <path d={`M${cx - w / 2} ${cy + 4} Q${cx + w * 0.1} ${cy + 18} ${cx + w / 2} ${cy - 10}`} stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />;
  const curve = expr === "happy" ? 26 : 12;
  return <path d={`M${cx - w / 2} ${cy} Q${cx} ${cy + curve} ${cx + w / 2} ${cy}`} stroke={INK} strokeWidth={7} fill={expr === "happy" ? "#5a1a22" : "none"} strokeLinecap="round" />;
};

/* ---------- humans ---------- */
export type ToonProps = {
  hair?: "bowl" | "spiky" | "hood" | "helmet" | "judge" | "lawyer" | "bald" | "kerchief" | "curly";
  hairColor?: string;
  skin?: string;
  outfit?: string;
  outfit2?: string;
  robe?: boolean;
  beard?: string | null;
  expr?: Expr;
  talking?: boolean;
  pose?: "idle" | "point" | "up" | "gavel" | "hips" | "shrug" | "hold";
  prop?: "spear" | "gavel" | "scroll" | "pitchfork" | "none";
  seed?: number;
  height?: number;
  flip?: boolean;
  look?: number;
};

/** Toon: big round head, thin legs, bold outline. viewBox 400x820 (feet at y=800). */
export const Toon: React.FC<ToonProps> = ({
  hair = "bowl",
  hairColor = "#6b3b1f",
  skin = "#fff3df",
  outfit = "#3f7d5a",
  outfit2 = "#2c5a40",
  robe = false,
  beard = null,
  expr = "neutral",
  talking = false,
  pose = "idle",
  prop = "none",
  seed = 0,
  height = 800,
  flip = false,
  look = 0,
}) => {
  const f = useCurrentFrame() + seed * 13;
  const bob = Math.sin(f / 9) * 5;
  const sway = Math.sin(f / 16) * 2;
  const headY = 250 + bob * 0.5;
  const sw = 9;
  // arm angles: [left, right] rotation degrees from hanging down
  const gavelSwing = pose === "gavel" ? -120 + Math.max(0, Math.sin(f / 5)) * 70 : 0;
  const arms: Record<string, [number, number]> = {
    idle: [12 + Math.sin(f / 10) * 3, -12 - Math.sin(f / 10) * 3],
    point: [12, -95 + Math.sin(f / 6) * 4],
    up: [150 + Math.sin(f / 3) * 12, -150 - Math.sin(f / 3) * 12],
    gavel: [15, gavelSwing],
    hips: [40, -40],
    shrug: [70 + Math.sin(f / 8) * 5, -70 - Math.sin(f / 8) * 5],
    hold: [12, -55],
  };
  const [la, ra] = arms[pose];
  const shL = { x: 145, y: 470 };
  const shR = { x: 255, y: 470 };
  const armLen = 175;
  const hand = (sh: { x: number; y: number }, ang: number) => {
    const r = (ang * Math.PI) / 180;
    return { x: sh.x - Math.sin(r) * armLen, y: sh.y + Math.cos(r) * armLen };
  };
  const hL = hand(shL, la);
  const hR = hand(shR, ra);
  const bodyBottom = robe ? 730 : 640;
  const kneeSwing = Math.sin(f / 9) * 3;

  return (
    <svg
      width={(height * 400) / 820}
      height={height}
      viewBox="0 0 400 820"
      style={{ overflow: "visible", transform: flip ? "scaleX(-1)" : undefined }}
    >
      <ellipse cx="200" cy="805" rx="120" ry="16" fill="rgba(0,0,0,0.28)" />
      {/* legs */}
      {!robe && (
        <g>
          <path d={`M175 620 L${165 + kneeSwing} 790`} stroke={INK} strokeWidth={14} strokeLinecap="round" />
          <path d={`M225 620 L${235 - kneeSwing} 790`} stroke={INK} strokeWidth={14} strokeLinecap="round" />
          <path d={`M175 620 L${165 + kneeSwing} 790`} stroke={outfit2} strokeWidth={6} strokeLinecap="round" />
          <path d={`M225 620 L${235 - kneeSwing} 790`} stroke={outfit2} strokeWidth={6} strokeLinecap="round" />
        </g>
      )}
      <ellipse cx={robe ? 165 : 158 + kneeSwing} cy="795" rx="30" ry="14" fill="#4a2c1a" stroke={INK} strokeWidth={6} />
      <ellipse cx={robe ? 235 : 242 - kneeSwing} cy="795" rx="30" ry="14" fill="#4a2c1a" stroke={INK} strokeWidth={6} />
      {/* spear behind */}
      {prop === "spear" && (
        <g transform={`translate(${hR.x - 200} 0)`}>
          <line x1="200" y1="120" x2="200" y2="800" stroke="#7a4b26" strokeWidth="14" />
          <line x1="200" y1="120" x2="200" y2="800" stroke={INK} strokeWidth="3" strokeDasharray="0" opacity="0.3" />
          <path d="M200 30 L226 130 L200 118 L174 130 Z" fill="#d7dde3" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        </g>
      )}
      {prop === "pitchfork" && (
        <g transform={`translate(${hR.x - 200} 0)`}>
          <line x1="200" y1="180" x2="200" y2="800" stroke="#9a6a3a" strokeWidth="12" />
          <path d="M160 100 L160 170 Q200 200 240 170 L240 100 M200 90 L200 185" stroke={INK} strokeWidth={10} fill="none" strokeLinecap="round" />
        </g>
      )}
      <g transform={`rotate(${sway} 200 800)`}>
        {/* body */}
        <path
          d={`M140 ${440 + bob} Q200 ${415 + bob} 260 ${440 + bob} Q${robe ? 300 : 285} ${bodyBottom - 80} ${robe ? 290 : 272} ${bodyBottom} Q200 ${bodyBottom + 18} ${robe ? 110 : 128} ${bodyBottom} Q${robe ? 100 : 115} ${bodyBottom - 80} 140 ${440 + bob} Z`}
          fill={outfit}
          stroke={INK}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
        {/* center stripe / lacing */}
        <path d={`M200 ${432 + bob} L200 ${bodyBottom + 8}`} stroke={outfit2} strokeWidth={22} />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx="200" cy={470 + bob + i * 38} r="7" fill="#f2d27a" stroke={INK} strokeWidth="3" />
        ))}
        {/* belt */}
        {!robe && <rect x="122" y={575} width="156" height="22" rx="6" fill="#5b3420" stroke={INK} strokeWidth={6} />}
        {!robe && <rect x="186" y={572} width="28" height="28" rx="4" fill="#f2c14e" stroke={INK} strokeWidth={5} />}
        {robe && <path d={`M150 ${445 + bob} L200 ${520 + bob} L250 ${445 + bob}`} fill="#fff" stroke={INK} strokeWidth={6} />}
        {/* arms */}
        {[
          [shL, hL],
          [shR, hR],
        ].map(([s, h], i) => (
          <g key={i}>
            <path d={`M${s.x} ${s.y + bob} Q${(s.x + h.x) / 2 + (i ? 12 : -12)} ${(s.y + h.y) / 2 + bob} ${h.x} ${h.y + bob}`} stroke={INK} strokeWidth={22} fill="none" strokeLinecap="round" />
            <path d={`M${s.x} ${s.y + bob} Q${(s.x + h.x) / 2 + (i ? 12 : -12)} ${(s.y + h.y) / 2 + bob} ${h.x} ${h.y + bob}`} stroke={outfit} strokeWidth={10} fill="none" strokeLinecap="round" />
            <circle cx={h.x} cy={h.y + bob} r="22" fill={skin} stroke={INK} strokeWidth={7} />
          </g>
        ))}
        {/* held props in right hand */}
        {prop === "gavel" && (
          <g transform={`translate(${hR.x} ${hR.y + bob}) rotate(${ra + 180})`}>
            <rect x="-6" y="-95" width="12" height="95" fill="#8a5a2b" stroke={INK} strokeWidth="4" />
            <rect x="-38" y="-130" width="76" height="40" rx="8" fill="#a8693a" stroke={INK} strokeWidth="6" />
          </g>
        )}
        {prop === "scroll" && (
          <g transform={`translate(${hR.x} ${hR.y + bob - 20}) rotate(-10)`}>
            <rect x="-10" y="-70" width="90" height="120" fill="#f5e6c0" stroke={INK} strokeWidth="6" />
            <rect x="-18" y="-82" width="106" height="20" rx="10" fill="#e2c98d" stroke={INK} strokeWidth="5" />
            <rect x="-18" y="40" width="106" height="20" rx="10" fill="#e2c98d" stroke={INK} strokeWidth="5" />
            {[0, 1, 2, 3].map((i) => (
              <line key={i} x1="5" x2={65 - (i % 2) * 15} y1={-45 + i * 22} y2={-45 + i * 22} stroke="#9b7b4a" strokeWidth="5" />
            ))}
          </g>
        )}
        {/* head */}
        <g transform={`translate(0 ${bob * 0.4})`}>
          {hair === "hood" && <path d="M60 260 Q50 90 200 80 Q350 90 340 260 L350 440 L50 440 Z" fill={hairColor} stroke={INK} strokeWidth={sw} />}
          {hair === "lawyer" && <path d="M85 300 Q70 360 110 420 L290 420 Q330 360 315 300 Z" fill="#e8e1d2" stroke={INK} strokeWidth={sw} />}
          {hair === "curly" &&
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
              const a = Math.PI * (1.05 + (i / 8) * 0.9);
              return <circle key={i} cx={200 + Math.cos(a) * 140} cy={headY + 10 + Math.sin(a) * 135} r="42" fill={hairColor} stroke={INK} strokeWidth={sw} />;
            })}
          <ellipse cx="200" cy={headY} rx="150" ry="142" fill={skin} stroke={INK} strokeWidth={sw + 1} />
          {/* cheeks */}
          <ellipse cx={130} cy={headY + 45} rx="24" ry="14" fill="#ff9b9b" opacity="0.55" />
          <ellipse cx={270} cy={headY + 45} rx="24" ry="14" fill="#ff9b9b" opacity="0.55" />
          {beard && (
            <path
              d={`M88 ${headY + 30} Q95 ${headY + 175} 200 ${headY + 185} Q305 ${headY + 175} 312 ${headY + 30} Q290 ${headY + 110} 200 ${headY + 115} Q110 ${headY + 110} 88 ${headY + 30} Z`}
              fill={beard}
              stroke={INK}
              strokeWidth={sw}
            />
          )}
          <Eyes cx={200} cy={headY - 5} gap={52} size={17} expr={expr} f={f} seed={seed} look={look} />
          <Mouth cx={200} cy={headY + 62} w={56} expr={expr} talking={talking} f={f} />
          {/* hair styles */}
          {hair === "bowl" && (
            <path
              d={`M52 ${headY - 5} Q40 ${headY - 175} 200 ${headY - 170} Q360 ${headY - 175} 348 ${headY - 5} Q330 ${headY - 50} 300 ${headY - 55} L100 ${headY - 55} Q70 ${headY - 50} 52 ${headY - 5} Z`}
              fill={hairColor}
              stroke={INK}
              strokeWidth={sw}
              strokeLinejoin="round"
            />
          )}
          {hair === "spiky" && (
            <g>
              {[-2, -1, 0, 1, 2].map((i) => (
                <path
                  key={i}
                  d={`M${200 + i * 52 - 45} ${headY - 95 + Math.abs(i) * 18} Q${200 + i * 60} ${headY - 250 + Math.abs(i) * 30} ${200 + i * 52 + 70} ${headY - 120 + Math.abs(i) * 16} Z`}
                  fill={hairColor}
                  stroke={INK}
                  strokeWidth={sw}
                  strokeLinejoin="round"
                />
              ))}
            </g>
          )}
          {hair === "curly" && <path d={`M80 ${headY - 70} Q200 ${headY - 150} 320 ${headY - 70}`} stroke={hairColor} strokeWidth={50} fill="none" />}
          {hair === "kerchief" && (
            <g>
              <path d={`M48 ${headY - 10} Q50 ${headY - 170} 200 ${headY - 165} Q350 ${headY - 170} 352 ${headY - 10} Q200 ${headY - 90} 48 ${headY - 10} Z`} fill={hairColor} stroke={INK} strokeWidth={sw} />
              {[0, 1, 2, 3].map((i) => (
                <circle key={i} cx={110 + i * 60} cy={headY - 110 + (i % 2) * 20} r="9" fill="white" opacity="0.8" />
              ))}
            </g>
          )}
          {hair === "helmet" && (
            <g>
              <path d={`M30 ${headY - 40} Q200 ${headY - 20} 370 ${headY - 40} L340 ${headY - 70} Q200 ${headY - 60} 60 ${headY - 70} Z`} fill="#b9c2cc" stroke={INK} strokeWidth={sw} />
              <path d={`M70 ${headY - 65} Q70 ${headY - 210} 200 ${headY - 210} Q330 ${headY - 210} 330 ${headY - 65} Z`} fill="#cfd6de" stroke={INK} strokeWidth={sw} />
              <path d={`M110 ${headY - 150} Q140 ${headY - 190} 190 ${headY - 195}`} stroke="white" strokeWidth={10} fill="none" strokeLinecap="round" opacity="0.8" />
            </g>
          )}
          {hair === "judge" && (
            <g>
              <path d={`M60 ${headY - 70} L90 ${headY - 280} Q200 ${headY - 310} 310 ${headY - 280} L340 ${headY - 70} Q200 ${headY - 100} 60 ${headY - 70} Z`} fill="#a3202c" stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
              <path d={`M55 ${headY - 75} Q200 ${headY - 110} 345 ${headY - 75}`} stroke="#f3d27a" strokeWidth={22} fill="none" />
              <path d={`M55 ${headY - 75} Q200 ${headY - 110} 345 ${headY - 75}`} stroke={INK} strokeWidth={5} fill="none" opacity="0.6" />
              <circle cx="200" cy={headY - 300} r="18" fill="#f3d27a" stroke={INK} strokeWidth={6} />
            </g>
          )}
          {hair === "lawyer" && (
            <g>
              <path d={`M70 ${headY - 80} Q200 ${headY - 140} 330 ${headY - 80} L320 ${headY - 190} L80 ${headY - 190} Z`} fill="#22202a" stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
              <path d={`M80 ${headY - 190} Q200 ${headY - 240} 320 ${headY - 190}`} fill="#22202a" stroke={INK} strokeWidth={sw} />
              <circle cx="200" cy={headY - 228} r="16" fill="#c03a3a" stroke={INK} strokeWidth={5} />
            </g>
          )}
          {hair === "hood" && <path d={`M58 ${headY + 10} Q60 ${headY - 175} 200 ${headY - 178} Q340 ${headY - 175} 342 ${headY + 10}`} fill="none" stroke={INK} strokeWidth={sw} />}
        </g>
      </g>
    </svg>
  );
};

/* ---------- animals ---------- */
export type PigProps = {
  dressed?: boolean;
  expr?: Expr;
  height?: number;
  flip?: boolean;
  seed?: number;
  jacket?: number; // 0..1 reveal amounts
  pants?: number;
  gloves?: number;
  chained?: boolean;
  talking?: boolean;
};

/** Upright cartoon pig, viewBox 400x600 (feet at 580). */
export const Pig: React.FC<PigProps> = ({ expr = "neutral", height = 600, flip = false, seed = 0, jacket = 0, pants = 0, gloves = 0, chained = false, talking = false }) => {
  const f = useCurrentFrame() + seed * 11;
  const bob = Math.sin(f / 8) * 5;
  const pink = "#ffb3c1";
  const pinkD = "#f48aa0";
  const tail = Math.sin(f / 4) * 10;
  return (
    <svg width={(height * 400) / 600} height={height} viewBox="0 0 400 600" style={{ overflow: "visible", transform: flip ? "scaleX(-1)" : undefined }}>
      <ellipse cx="200" cy="585" rx="120" ry="14" fill="rgba(0,0,0,0.28)" />
      {/* tail */}
      <path d={`M300 430 q30 ${-20 + tail} 20 -40 q-15 -15 -20 5 q-5 20 15 15`} stroke={INK} strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d={`M300 430 q30 ${-20 + tail} 20 -40 q-15 -15 -20 5 q-5 20 15 15`} stroke={pinkD} strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* legs */}
      {[150, 250].map((x, i) => (
        <g key={x}>
          <rect x={x - 26} y="470" width="52" height="105" rx="20" fill={pants > 0.5 ? "#6b4a2f" : pink} stroke={INK} strokeWidth="9" />
          <rect x={x - 26} y="545" width="52" height="34" rx="10" fill="#5b3b3b" stroke={INK} strokeWidth="8" />
          <line x1={x} y1="552" x2={x} y2="579" stroke={INK} strokeWidth="6" />
          {chained && i === 0 && <ellipse cx={x} cy="540" rx="34" ry="12" fill="none" stroke="#9aa3ad" strokeWidth="9" />}
        </g>
      ))}
      <g transform={`translate(0 ${bob * 0.5})`}>
        {/* body */}
        <ellipse cx="200" cy="420" rx="125" ry="110" fill={pink} stroke={INK} strokeWidth="10" />
        <ellipse cx="200" cy="445" rx="70" ry="60" fill="#ffd0da" />
        {/* pants (bottom of body) */}
        {pants > 0 && (
          <g opacity={Math.min(1, pants * 2)} transform={`translate(0 ${(1 - pants) * -200})`}>
            <path d="M80 440 Q200 470 320 440 Q325 500 280 525 L120 525 Q75 500 80 440 Z" fill="#6b4a2f" stroke={INK} strokeWidth="9" />
            <rect x="85" y="432" width="230" height="22" rx="8" fill="#3d2a1a" stroke={INK} strokeWidth="6" />
          </g>
        )}
        {/* jacket */}
        {jacket > 0 && (
          <g opacity={Math.min(1, jacket * 2)} transform={`translate(0 ${(1 - jacket) * -260})`}>
            <path d="M85 360 Q200 300 315 360 L320 440 Q200 460 80 440 Z" fill="#2f4f8f" stroke={INK} strokeWidth="9" />
            <path d="M200 320 L200 450" stroke="#203868" strokeWidth="10" />
            <path d="M140 330 L200 390 L260 330" fill="#f4ecd8" stroke={INK} strokeWidth="7" strokeLinejoin="round" />
            {[0, 1, 2].map((i) => (
              <circle key={i} cx="215" cy={385 + i * 22} r="7" fill="#f2c14e" stroke={INK} strokeWidth="3" />
            ))}
          </g>
        )}
        {/* arms */}
        {[-1, 1].map((s) => (
          <g key={s}>
            <path d={`M${200 + s * 110} 380 Q${200 + s * 160} ${420 + Math.sin(f / 6 + s) * 8} ${200 + s * 150} 470`} stroke={INK} strokeWidth="44" fill="none" strokeLinecap="round" />
            <path d={`M${200 + s * 110} 380 Q${200 + s * 160} ${420 + Math.sin(f / 6 + s) * 8} ${200 + s * 150} 470`} stroke={jacket > 0.5 ? "#2f4f8f" : pink} strokeWidth="28" fill="none" strokeLinecap="round" />
            <circle cx={200 + s * 150} cy="475" r="22" fill={gloves > 0.5 ? "#f4f0e6" : "#5b3b3b"} stroke={INK} strokeWidth="8" transform={gloves > 0 && gloves <= 0.5 ? `scale(${1 + gloves})` : undefined} />
          </g>
        ))}
        {/* head */}
        <g transform={`translate(0 ${bob * 0.3})`}>
          <path d="M75 160 L60 40 L150 110 Z" fill={pink} stroke={INK} strokeWidth="10" strokeLinejoin="round" />
          <path d="M325 160 L340 40 L250 110 Z" fill={pink} stroke={INK} strokeWidth="10" strokeLinejoin="round" />
          <path d="M82 140 L72 70 L130 112 Z" fill={pinkD} />
          <path d="M318 140 L328 70 L270 112 Z" fill={pinkD} />
          <ellipse cx="200" cy="200" rx="140" ry="125" fill={pink} stroke={INK} strokeWidth="11" />
          <ellipse cx="120" cy="250" rx="22" ry="12" fill="#ff7b98" opacity="0.6" />
          <ellipse cx="280" cy="250" rx="22" ry="12" fill="#ff7b98" opacity="0.6" />
          <Eyes cx={200} cy={155} gap={60} size={15} expr={expr} f={f} seed={seed + 3} />
          {/* snout */}
          <ellipse cx="200" cy="230" rx="55" ry="38" fill={pinkD} stroke={INK} strokeWidth="9" />
          <ellipse cx="182" cy="230" rx="9" ry="15" fill={INK} />
          <ellipse cx="218" cy="230" rx="9" ry="15" fill={INK} />
          <Mouth cx={200} cy={283} w={44} expr={expr} talking={talking} f={f} />
        </g>
      </g>
    </svg>
  );
};

/** Rat, viewBox 300x300, sits at y=290 */
export const Rat: React.FC<{ height?: number; flip?: boolean; seed?: number; expr?: Expr; nibble?: boolean; run?: boolean }> = ({
  height = 220,
  flip = false,
  seed = 0,
  expr = "neutral",
  nibble = false,
  run = false,
}) => {
  const f = useCurrentFrame() + seed * 7;
  const hop = run ? Math.abs(Math.sin(f / 2.5)) * -18 : nibble ? Math.sin(f / 2) * 3 : Math.sin(f / 10) * 2;
  const gray = "#a7a3b5";
  return (
    <svg width={height} height={height} viewBox="0 0 300 300" style={{ overflow: "visible", transform: flip ? "scaleX(-1)" : undefined }}>
      <ellipse cx="150" cy="292" rx="100" ry="10" fill="rgba(0,0,0,0.25)" />
      <g transform={`translate(0 ${hop})`}>
        <path d={`M235 240 Q300 ${250 + Math.sin(f / 5) * 20} 290 170`} stroke={INK} strokeWidth="14" fill="none" strokeLinecap="round" />
        <path d={`M235 240 Q300 ${250 + Math.sin(f / 5) * 20} 290 170`} stroke="#f0a4b4" strokeWidth="6" fill="none" strokeLinecap="round" />
        <ellipse cx="165" cy="225" rx="85" ry="65" fill={gray} stroke={INK} strokeWidth="9" />
        <ellipse cx="160" cy="240" rx="45" ry="35" fill="#d7d3e2" />
        <ellipse cx="120" cy="285" rx="22" ry="10" fill="#f0a4b4" stroke={INK} strokeWidth="6" />
        <ellipse cx="200" cy="285" rx="22" ry="10" fill="#f0a4b4" stroke={INK} strokeWidth="6" />
        <circle cx="80" cy="75" r="40" fill={gray} stroke={INK} strokeWidth="9" />
        <circle cx="80" cy="75" r="22" fill="#f0a4b4" />
        <circle cx="185" cy="70" r="40" fill={gray} stroke={INK} strokeWidth="9" />
        <circle cx="185" cy="70" r="22" fill="#f0a4b4" />
        <ellipse cx="130" cy="140" rx="85" ry="72" fill={gray} stroke={INK} strokeWidth="9" />
        <Eyes cx={130} cy={125} gap={32} size={11} expr={expr} f={f} seed={seed} />
        <circle cx="130" cy="172" r="13" fill="#e2607a" stroke={INK} strokeWidth="5" />
        {nibble && <rect x="115" y={186 + Math.abs(Math.sin(f / 1.5)) * 5} width="30" height="16" rx="3" fill="white" stroke={INK} strokeWidth="4" />}
        {[-1, 1].map((s) => (
          <g key={s} stroke={INK} strokeWidth="4" strokeLinecap="round">
            <line x1={130 + s * 20} y1="170" x2={130 + s * 85} y2="158" />
            <line x1={130 + s * 20} y1="176" x2={130 + s * 85} y2="182" />
          </g>
        ))}
      </g>
    </svg>
  );
};

/** Menacing cat, viewBox 360x420 */
export const Cat: React.FC<{ height?: number; flip?: boolean; seed?: number; color?: string; stripes?: string }> = ({
  height = 420,
  flip = false,
  seed = 0,
  color = "#f39c3d",
  stripes = "#c96a1a",
}) => {
  const f = useCurrentFrame() + seed * 9;
  const crouch = Math.sin(f / 6) * 6;
  return (
    <svg width={(height * 360) / 420} height={height} viewBox="0 0 360 420" style={{ overflow: "visible", transform: flip ? "scaleX(-1)" : undefined }}>
      <ellipse cx="180" cy="410" rx="130" ry="12" fill="rgba(0,0,0,0.3)" />
      <path d={`M290 330 Q370 ${280 + Math.sin(f / 4) * 30} 330 ${170 + Math.sin(f / 5) * 20}`} stroke={INK} strokeWidth="34" fill="none" strokeLinecap="round" />
      <path d={`M290 330 Q370 ${280 + Math.sin(f / 4) * 30} 330 ${170 + Math.sin(f / 5) * 20}`} stroke={color} strokeWidth="18" fill="none" strokeLinecap="round" />
      <g transform={`translate(0 ${crouch})`}>
        <ellipse cx="200" cy="320" rx="120" ry="85" fill={color} stroke={INK} strokeWidth="10" />
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${190 + i * 40} 240 q10 30 0 60`} stroke={stripes} strokeWidth="12" fill="none" strokeLinecap="round" />
        ))}
        <ellipse cx="120" cy="395" rx="34" ry="18" fill={color} stroke={INK} strokeWidth="8" />
        <ellipse cx="240" cy="395" rx="34" ry="18" fill={color} stroke={INK} strokeWidth="8" />
        <path d="M45 120 L60 10 L130 80 Z" fill={color} stroke={INK} strokeWidth="10" strokeLinejoin="round" />
        <path d="M255 120 L240 10 L170 80 Z" fill={color} stroke={INK} strokeWidth="10" strokeLinejoin="round" />
        <ellipse cx="150" cy="170" rx="125" ry="105" fill={color} stroke={INK} strokeWidth="10" />
        <path d="M150 70 l0 35 M120 75 l5 30 M180 75 l-5 30" stroke={stripes} strokeWidth="10" strokeLinecap="round" />
        {/* glowing angry eyes */}
        {[-1, 1].map((s) => (
          <g key={s}>
            <path d={`M${150 + s * 75} 150 Q${150 + s * 45} 125 ${150 + s * 20} 158 Q${150 + s * 45} 185 ${150 + s * 75} 150 Z`} fill="#d8ff4a" stroke={INK} strokeWidth="6" />
            <ellipse cx={150 + s * 45} cy="157" rx="5" ry="15" fill={INK} />
            <line x1={150 + s * 80} y1={118} x2={150 + s * 22} y2={135} stroke={INK} strokeWidth="10" strokeLinecap="round" />
          </g>
        ))}
        <path d="M140 195 L160 195 L150 207 Z" fill="#e2607a" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M110 225 Q130 240 150 222 Q170 240 190 225" stroke={INK} strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M122 230 l6 18 l6 -16 M166 230 l6 18 l6 -16" fill="white" stroke={INK} strokeWidth="4" />
        {[-1, 1].map((s) => (
          <g key={s} stroke={INK} strokeWidth="5" strokeLinecap="round">
            <line x1={150 + s * 40} y1="205" x2={150 + s * 125} y2="190" />
            <line x1={150 + s * 40} y1="215" x2={150 + s * 125} y2="225" />
          </g>
        ))}
      </g>
    </svg>
  );
};

/** Baby in a cradle (no harm shown) viewBox 300x220 */
export const Cradle: React.FC<{ height?: number; cry?: boolean }> = ({ height = 220, cry = false }) => {
  const f = useCurrentFrame();
  const rock = Math.sin(f / 10) * 4;
  return (
    <svg width={(height * 300) / 220} height={height} viewBox="0 0 300 220" style={{ overflow: "visible" }}>
      <g transform={`rotate(${rock} 150 200)`}>
        <path d="M30 200 Q150 240 270 200" stroke={INK} strokeWidth="10" fill="none" />
        <path d="M40 90 L260 90 L240 195 L60 195 Z" fill="#b5793f" stroke={INK} strokeWidth="9" strokeLinejoin="round" />
        <path d="M40 90 Q40 20 110 30 L110 90 Z" fill="#a0652f" stroke={INK} strokeWidth="9" />
        <circle cx="160" cy="80" r="42" fill="#fff3df" stroke={INK} strokeWidth="8" />
        <path d="M120 70 Q160 20 200 70" fill="#f7d7e0" stroke={INK} strokeWidth="7" />
        {cry ? (
          <>
            <path d="M140 85 l10 5 M170 90 l10 -5" stroke={INK} strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="160" cy="104" rx="10" ry="8" fill="#5a1a22" />
            <path d={`M135 92 q-5 ${15 + (f % 10)} 0 25`} stroke="#6cc3ff" strokeWidth="6" fill="none" />
          </>
        ) : (
          <>
            <path d="M140 85 q7 6 14 0 M168 85 q7 6 14 0" stroke={INK} strokeWidth="5" fill="none" />
          </>
        )}
        <rect x="80" y="110" width="160" height="60" rx="20" fill="#9fd0e6" stroke={INK} strokeWidth="7" />
      </g>
    </svg>
  );
};
