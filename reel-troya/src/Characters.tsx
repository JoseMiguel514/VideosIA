import React from "react";
import { useCurrentFrame } from "remotion";

export type PersonProps = {
  skin?: string;
  robe?: string;
  hair?: string | null;
  beard?: string | null;
  longBeard?: boolean;
  head?: "helmet" | "crown" | "laurel" | "none";
  crest?: string;
  armor?: boolean;
  prop?: "shield" | "scroll" | "lyre" | "torch" | "none";
  talking?: boolean;
  blind?: boolean;
  shh?: boolean;
  wave?: boolean;
  seed?: number;
  height?: number;
  flip?: boolean;
  expression?: "neutral" | "surprised" | "sly";
};

const OUT = "#2a160b";

/** Chibi-style animated character (blinks, breathes, talks). viewBox 300x520 */
export const Person: React.FC<PersonProps> = ({
  skin = "#e9b58a",
  robe = "#f3ead6",
  hair = "#3b2414",
  beard = null,
  longBeard = false,
  head = "none",
  crest = "#c8322a",
  armor = false,
  prop = "none",
  talking = false,
  blind = false,
  shh = false,
  wave = false,
  seed = 0,
  height = 520,
  flip = false,
  expression = "neutral",
}) => {
  const f = useCurrentFrame() + seed * 17;
  const breathe = Math.sin(f / 12) * 4;
  const blinkPhase = (f + seed * 31) % 110;
  const eyeScale = blinkPhase < 4 ? 0.1 : 1;
  const mouthOpen = talking
    ? 3 + Math.abs(Math.sin(f * 0.55) * Math.sin(f * 0.23 + 1)) * 14
    : expression === "surprised"
      ? 14
      : 3;
  const waveAngle = wave ? Math.sin(f / 4) * 25 : 0;
  const bronze = "#d79b3d";
  const bronzeDark = "#8a5a1c";

  return (
    <svg
      width={(height * 300) / 520}
      height={height}
      viewBox="0 0 300 520"
      style={{ overflow: "visible", transform: flip ? "scaleX(-1)" : undefined }}
    >
      {/* shadow */}
      <ellipse cx="150" cy="510" rx="95" ry="12" fill="rgba(0,0,0,0.35)" />
      {/* spear behind */}
      {prop === "shield" && (
        <g>
          <line x1="250" y1="30" x2="250" y2="505" stroke="#6b4423" strokeWidth="9" strokeLinecap="round" />
          <polygon points="250,-15 264,40 236,40" fill="#cfd4d8" stroke={OUT} strokeWidth="4" />
        </g>
      )}
      <g transform={`translate(0 ${breathe * 0.4})`}>
        {/* legs */}
        <rect x="110" y="440" width="28" height="62" rx="10" fill={skin} stroke={OUT} strokeWidth="4" />
        <rect x="162" y="440" width="28" height="62" rx="10" fill={skin} stroke={OUT} strokeWidth="4" />
        <path d="M104 500 h40 v10 h-40z M156 500 h40 v10 h-40z" fill="#6b4423" stroke={OUT} strokeWidth="3" />
        {/* body / robe */}
        <path
          d={`M95 ${255 - breathe} Q150 ${238 - breathe} 205 ${255 - breathe} L232 462 Q150 478 68 462 Z`}
          fill={robe}
          stroke={OUT}
          strokeWidth="5"
        />
        {armor && (
          <g>
            {/* pteruges skirt */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect key={i} x={82 + i * 23} y="385" width="20" height="70" rx="5" fill={bronzeDark} stroke={OUT} strokeWidth="3" />
            ))}
            {/* cuirass */}
            <path d={`M98 ${258 - breathe} Q150 ${244 - breathe} 202 ${258 - breathe} L212 395 Q150 410 88 395 Z`} fill={bronze} stroke={OUT} strokeWidth="5" />
            <path d="M120 300 Q135 320 150 305 Q165 320 180 300" fill="none" stroke={bronzeDark} strokeWidth="4" />
            <path d="M130 350 Q150 360 170 350" fill="none" stroke={bronzeDark} strokeWidth="4" />
          </g>
        )}
        {!armor && <path d="M95 255 Q150 330 205 255" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="6" />}
        {/* left arm (or arm holding prop) */}
        {prop === "shield" ? null : (
          <g transform={`rotate(${prop === "scroll" || prop === "lyre" ? -35 : 8} 100 270)`}>
            <rect x="82" y="262" width="34" height="120" rx="16" fill={robe} stroke={OUT} strokeWidth="4" />
            <circle cx="99" cy="388" r="17" fill={skin} stroke={OUT} strokeWidth="4" />
          </g>
        )}
        {/* right arm */}
        {shh ? (
          <g>
            <path d="M200 270 Q240 300 205 250" fill="none" stroke={robe} strokeWidth="34" strokeLinecap="round" />
            <path d="M200 270 Q240 300 205 250" fill="none" stroke={OUT} strokeWidth="2" />
          </g>
        ) : (
          <g transform={`rotate(${wave ? -150 + waveAngle : prop === "torch" ? -40 : -8} 200 270)`}>
            <rect x="184" y="262" width="34" height="120" rx="16" fill={robe} stroke={OUT} strokeWidth="4" />
            <circle cx="201" cy="388" r="17" fill={skin} stroke={OUT} strokeWidth="4" />
            {prop === "torch" && (
              <g>
                <rect x="194" y="372" width="14" height="90" fill="#6b4423" transform="rotate(180 201 400)" />
                <Flame x={201} y={330} size={1} seed={seed} />
              </g>
            )}
          </g>
        )}
        {/* neck */}
        <rect x="132" y="222" width="36" height="32" fill={skin} stroke={OUT} strokeWidth="4" />
        {/* head */}
        <g transform={`translate(0 ${-breathe * 0.3})`}>
          {hair && head !== "helmet" && (
            <path d="M70 175 Q60 80 150 78 Q240 80 230 175 Z" fill={hair} stroke={OUT} strokeWidth="4" />
          )}
          <circle cx="150" cy="165" r="76" fill={skin} stroke={OUT} strokeWidth="5" />
          {/* ears */}
          <circle cx="75" cy="172" r="13" fill={skin} stroke={OUT} strokeWidth="4" />
          <circle cx="225" cy="172" r="13" fill={skin} stroke={OUT} strokeWidth="4" />
          {hair && head !== "helmet" && (
            <path d="M78 150 Q95 95 150 92 Q210 95 222 150 Q190 118 150 122 Q110 118 78 150 Z" fill={hair} />
          )}
          {!hair && head === "none" && (
            <g>
              <path d="M76 175 Q72 135 92 120" fill="none" stroke={beard ?? "#ddd"} strokeWidth="14" strokeLinecap="round" />
              <path d="M224 175 Q228 135 208 120" fill="none" stroke={beard ?? "#ddd"} strokeWidth="14" strokeLinecap="round" />
            </g>
          )}
          {/* cheeks */}
          <circle cx="110" cy="190" r="12" fill="#e0806a" opacity="0.45" />
          <circle cx="190" cy="190" r="12" fill="#e0806a" opacity="0.45" />
          {/* eyes */}
          {blind ? (
            <g stroke={OUT} strokeWidth="5" fill="none" strokeLinecap="round">
              <path d="M112 165 Q125 173 138 165" />
              <path d="M162 165 Q175 173 188 165" />
            </g>
          ) : (
            <g>
              {[125, 175].map((cx) => (
                <g key={cx} transform={`translate(${cx} 163) scale(1 ${eyeScale})`}>
                  <ellipse cx="0" cy="0" rx="11" ry={expression === "surprised" ? 15 : 12} fill="white" stroke={OUT} strokeWidth="3" />
                  <circle cx={expression === "sly" ? 4 : 1} cy="1" r="6" fill={OUT} />
                  <circle cx={expression === "sly" ? 6 : 3} cy="-2" r="2" fill="white" />
                </g>
              ))}
            </g>
          )}
          {/* brows */}
          <g stroke={beard ?? hair ?? OUT} strokeWidth="6" strokeLinecap="round">
            {expression === "sly" ? (
              <>
                <line x1="110" y1="140" x2="138" y2="146" />
                <line x1="162" y1="144" x2="190" y2="136" />
              </>
            ) : expression === "surprised" ? (
              <>
                <line x1="110" y1="134" x2="138" y2="130" />
                <line x1="162" y1="130" x2="190" y2="134" />
              </>
            ) : (
              <>
                <line x1="110" y1="141" x2="138" y2="139" />
                <line x1="162" y1="139" x2="190" y2="141" />
              </>
            )}
          </g>
          {/* nose */}
          <path d="M150 170 Q158 188 146 190" fill="none" stroke={OUT} strokeWidth="4" strokeLinecap="round" />
          {/* beard */}
          {beard && (
            <path
              d={
                longBeard
                  ? "M82 185 Q90 250 150 300 Q210 250 218 185 Q200 225 150 225 Q100 225 82 185 Z"
                  : "M84 180 Q95 245 150 248 Q205 245 216 180 Q200 222 150 222 Q100 222 84 180 Z"
              }
              fill={beard}
              stroke={OUT}
              strokeWidth="4"
            />
          )}
          {beard && <path d="M125 205 Q150 195 175 205" fill="none" stroke={beard} strokeWidth="9" strokeLinecap="round" />}
          {/* mouth */}
          {expression === "sly" && !talking ? (
            <path d="M132 212 Q152 222 170 206" fill="none" stroke={OUT} strokeWidth="5" strokeLinecap="round" />
          ) : (
            <ellipse cx="150" cy="214" rx="13" ry={mouthOpen / 2 + 1} fill="#5a1d14" stroke={OUT} strokeWidth="3" />
          )}
          {/* shh finger */}
          {shh && <rect x="144" y="186" width="13" height="44" rx="6" fill={skin} stroke={OUT} strokeWidth="3" />}
          {/* headwear */}
          {head === "helmet" && (
            <g>
              <path
                d="M70 185 Q62 82 150 76 Q238 82 230 185 L210 228 L198 190 Q195 150 150 148 Q105 150 102 190 L90 228 Z"
                fill={bronze}
                stroke={OUT}
                strokeWidth="5"
              />
              <rect x="143" y="146" width="14" height="34" rx="4" fill={bronze} stroke={OUT} strokeWidth="3" />
              <path d="M85 120 Q150 100 215 120" fill="none" stroke={bronzeDark} strokeWidth="5" />
              {/* crest */}
              <path d="M150 80 Q60 40 80 -10 Q150 20 220 -10 Q240 40 150 80 Z" fill={crest} stroke={OUT} strokeWidth="4" transform="translate(0 0)" />
              <path d="M150 78 L150 -2" stroke={OUT} strokeWidth="3" />
              {[100, 125, 175, 200].map((x) => (
                <line key={x} x1={x} y1="5" x2={(x + 150) / 2} y2="60" stroke="rgba(0,0,0,0.25)" strokeWidth="3" />
              ))}
            </g>
          )}
          {head === "crown" && (
            <polygon
              points="88,115 88,70 110,95 130,58 150,92 170,58 190,95 212,70 212,115"
              fill="#f2c843"
              stroke={OUT}
              strokeWidth="4"
            />
          )}
          {head === "laurel" && (
            <g>
              {Array.from({ length: 9 }).map((_, i) => {
                const a = Math.PI * (1.05 + (i / 8) * 0.9);
                const x = 150 + Math.cos(a) * 78;
                const y = 160 + Math.sin(a) * 70;
                return (
                  <ellipse
                    key={i}
                    cx={x}
                    cy={y}
                    rx="16"
                    ry="8"
                    fill="#5f9a3a"
                    stroke={OUT}
                    strokeWidth="2.5"
                    transform={`rotate(${(a * 180) / Math.PI + 90} ${x} ${y})`}
                  />
                );
              })}
            </g>
          )}
        </g>
        {/* front props */}
        {prop === "shield" && (
          <g transform={`rotate(${Math.sin(f / 20) * 2} 85 350)`}>
            <circle cx="85" cy="350" r="88" fill={bronze} stroke={OUT} strokeWidth="6" />
            <circle cx="85" cy="350" r="70" fill="#b8322a" stroke={bronzeDark} strokeWidth="5" />
            <path d="M85 300 L100 340 L140 350 L100 362 L85 400 L70 362 L30 350 L70 340 Z" fill={bronze} />
          </g>
        )}
        {prop === "scroll" && (
          <g transform="rotate(-8 150 330)">
            <rect x="95" y="300" width="120" height="80" fill="#f5e3b5" stroke={OUT} strokeWidth="4" />
            <rect x="85" y="292" width="16" height="96" rx="8" fill="#c99a5a" stroke={OUT} strokeWidth="4" />
            <rect x="209" y="292" width="16" height="96" rx="8" fill="#c99a5a" stroke={OUT} strokeWidth="4" />
            {[318, 334, 350, 366].map((y) => (
              <line key={y} x1="108" y1={y} x2="198" y2={y} stroke="#8a6a3a" strokeWidth="3" />
            ))}
          </g>
        )}
        {prop === "lyre" && (
          <g transform="rotate(-12 120 330)">
            <path d="M80 270 Q60 360 120 380 Q180 360 160 270" fill="none" stroke="#c99a3a" strokeWidth="14" strokeLinecap="round" />
            <line x1="82" y1="285" x2="158" y2="285" stroke="#8a5a1c" strokeWidth="8" />
            {[100, 115, 130, 145].map((x) => (
              <line key={x} x1={x} y1="287" x2={x + (120 - x) * 0.3} y2="370" stroke="#fff3c4" strokeWidth="2.5" />
            ))}
          </g>
        )}
      </g>
    </svg>
  );
};

export const Flame: React.FC<{ x: number; y: number; size?: number; seed?: number }> = ({
  x,
  y,
  size = 1,
  seed = 0,
}) => {
  const f = useCurrentFrame() + seed * 7;
  const s = 1 + Math.sin(f * 0.7) * 0.08 + Math.sin(f * 1.3) * 0.05;
  const sway = Math.sin(f * 0.4) * 5;
  return (
    <g transform={`translate(${x} ${y}) scale(${size * s} ${size * (2 - s)})`}>
      <path d={`M0 40 Q-30 10 ${-5 + sway} -45 Q10 -15 15 -30 Q35 10 0 40 Z`} fill="#ff7a1a" />
      <path d={`M0 38 Q-16 15 ${sway * 0.6} -15 Q8 5 12 -5 Q20 18 0 38 Z`} fill="#ffd34d" />
    </g>
  );
};

export const TrojanHorse: React.FC<{
  width?: number;
  cutaway?: boolean;
  hatchOpen?: number;
  wheelTurn?: number;
}> = ({ width = 800, cutaway = false, hatchOpen = 0, wheelTurn = 0 }) => {
  const f = useCurrentFrame();
  const wood = "#c98a45";
  const dark = "#5a3212";
  return (
    <svg width={width} height={width} viewBox="0 0 400 400" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="woodg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dda25a" />
          <stop offset="1" stopColor="#a8682c" />
        </linearGradient>
      </defs>
      <ellipse cx="200" cy="375" rx="170" ry="14" fill="rgba(0,0,0,0.35)" />
      <rect x="50" y="315" width="300" height="22" rx="4" fill={dark} />
      {[85, 160, 240, 315].map((cx) => (
        <g key={cx} transform={`rotate(${wheelTurn} ${cx} 348)`}>
          <circle cx={cx} cy="348" r="24" fill="#7a4a20" stroke={dark} strokeWidth="5" />
          <line x1={cx - 22} y1="348" x2={cx + 22} y2="348" stroke={dark} strokeWidth="4" />
          <line x1={cx} y1="326" x2={cx} y2="370" stroke={dark} strokeWidth="4" />
          <circle cx={cx} cy="348" r="7" fill={dark} />
        </g>
      ))}
      {[95, 130, 250, 285].map((x) => (
        <rect key={x} x={x} y="215" width="26" height="104" fill="url(#woodg)" stroke={dark} strokeWidth="3" />
      ))}
      <rect x="80" y="140" width="240" height="95" rx="22" fill="url(#woodg)" stroke={dark} strokeWidth="4" />
      {[163, 186, 209].map((y) => (
        <line key={y} x1="86" y1={y} x2="314" y2={y} stroke={dark} strokeWidth="2.5" opacity="0.7" />
      ))}
      {[120, 160, 200, 240, 280].map((x) => (
        <circle key={x} cx={x} cy="150" r="2.5" fill={dark} />
      ))}
      {cutaway && (
        <g>
          <rect x="105" y="155" width="190" height="68" rx="10" fill="#2b170a" stroke={dark} strokeWidth="4" />
          {[135, 185, 235, 270].map((x, i) => (
            <g key={x} transform={`translate(${x} ${200 + Math.sin(f / 8 + i) * 2})`}>
              <path d="M-16 0 Q-18 -32 0 -34 Q18 -32 16 0 Z" fill="#d79b3d" stroke="#2a160b" strokeWidth="2.5" />
              <path d="M0 -34 Q-20 -46 -14 -56 Q0 -48 14 -56 Q20 -46 0 -34" fill="#c8322a" />
              <rect x="-9" y="-20" width="18" height="5" fill="#2a160b" />
              <circle cx={-4 + Math.sin(f / 15 + i) * 2} cy="-17" r="2" fill="white" />
              <circle cx={4 + Math.sin(f / 15 + i) * 2} cy="-17" r="2" fill="white" />
            </g>
          ))}
        </g>
      )}
      {!cutaway && (
        <g>
          <rect x="172" y="158" width="56" height="48" fill={hatchOpen > 0 ? "#1a0d05" : "none"} stroke={dark} strokeWidth="3" strokeDasharray="6 4" />
          {hatchOpen > 0 && (
            <rect x="172" y="206" width="56" height="48" fill={wood} stroke={dark} strokeWidth="3" transform={`rotate(${-hatchOpen * 20} 172 206)`} />
          )}
        </g>
      )}
      <polygon points="252,152 302,152 335,52 296,46" fill="url(#woodg)" stroke={dark} strokeWidth="4" />
      <polygon points="288,30 348,36 390,90 368,108 320,74" fill="url(#woodg)" stroke={dark} strokeWidth="4" />
      <circle cx="336" cy="56" r="6" fill={dark} />
      <circle cx="338" cy="54" r="2" fill="#fff" />
      <polygon points="298,34 306,4 318,36" fill={wood} stroke={dark} strokeWidth="3" />
      <path d="M290 52 L276 80 L288 85 L272 112 L284 117 L266 148" fill="none" stroke={dark} strokeWidth="7" strokeLinecap="round" />
      <path d={`M84 156 Q${50 + Math.sin(f / 10) * 4} 185 58 248`} fill="none" stroke={dark} strokeWidth="11" strokeLinecap="round" />
    </svg>
  );
};
