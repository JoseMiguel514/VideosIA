import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Character } from "../lib/Character";
import { Cam, City, Dust, FONT, Grade, H, INK, Label, Layer, pop, prog, Rain, Sky, Stars, Title, W } from "../lib/scene";
import { at, D } from "./timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ============ 6. HAMBRE: el cerebro consume energía ============ */
export const Hunger: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("hunger");
  const t2 = at("hunger", "two");
  const t20 = at("hunger", "twenty");
  const tYours = at("hunger", "Yours");
  const tHungry = at("hunger", "always,");
  if (f < tHungry - 6) {
    const w2 = prog(f, t2, t2 + 20);
    const w20 = prog(f, t20, t20 + 25);
    const over = prog(f, tYours, tYours + 40);
    return (
      <Cam dur={tHungry} from={[1, 0, 0]} to={[1.06, 0, 0]}>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #263a5c, #121c33 60%, #070b18)" }} />
        <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.035) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.035) 2px, transparent 2px)", backgroundSize: "60px 60px" }} />
        {/* silueta del cuerpo con el cerebro iluminado */}
        <Character x={520} y={980} scale={1.15} expr="neutral" mouth="flat" glow={0.25 + over * 0.75} look={[0, -1]} />
        <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
          {/* barras */}
          <text x={1000} y={330} fontFamily={FONT} fontWeight={700} fontSize={40} fill="#fff" letterSpacing={3}>
            BODY WEIGHT
          </text>
          <rect x={1000} y={350} width={760} height={70} rx={35} fill="rgba(255,255,255,.1)" />
          <rect x={1000} y={350} width={Math.max(70, 760 * 0.02 * w2 * 1)} height={70} rx={35} fill="#22d3c5" opacity={w2} />
          <text x={1090} y={400} fontFamily={FONT} fontWeight={700} fontSize={44} fill="#22d3c5" opacity={w2}>
            ≈ 2%
          </text>
          <text x={1000} y={540} fontFamily={FONT} fontWeight={700} fontSize={40} fill="#fff" letterSpacing={3}>
            ENERGY USED
          </text>
          <rect x={1000} y={560} width={760} height={70} rx={35} fill="rgba(255,255,255,.1)" />
          <rect x={1000} y={560} width={760 * (0.2 * w20 + 0.8 * over)} height={70} rx={35} fill={over > 0.3 ? "#ff5a5a" : "#ffd36b"} />
          <text x={1000 + 760 * (0.2 * w20 + 0.8 * over) + 20} y={610} fontFamily={FONT} fontWeight={700} fontSize={44} fill={over > 0.3 ? "#ff5a5a" : "#ffd36b"} opacity={w20}>
            {over > 0.3 ? "???" : "≈ 20%"}
          </text>
        </svg>
        <Label at={4} x={1380} y={180} text="your brain" size={50} />
        <Label at={t2} x={540} y={250} text="brain" size={34} to={[520, 420]} color="#ffd36b" />
        <Grade vignette={0.65} />
      </Cam>
    );
  }
  const g = f - tHungry;
  const plates = Math.min(9, Math.floor(g / 6));
  return (
    <Cam dur={d - tHungry} from={[1.1, 0, 10]} to={[1, 0, 0]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#ffcf8a,#f29e6b 70%,#d77a55)" }} />
      <div style={{ position: "absolute", left: 0, top: 760, width: W, height: 320, background: "#7a4a30" }} />
      <div style={{ position: "absolute", left: 0, top: 740, width: W, height: 30, background: "#9a6a48" }} />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        {Array.from({ length: plates }).map((_, i) => (
          <g key={i} transform={`translate(${1250 + (i % 2) * 6} ${730 - i * 34})`}>
            <ellipse cx={0} cy={0} rx={150} ry={26} fill="#f4f1ea" stroke={INK} strokeWidth={5} />
            <ellipse cx={0} cy={-6} rx={90} ry={12} fill="#e3ddd0" />
          </g>
        ))}
        {/* comida */}
        <g transform="translate(700 700)">
          <ellipse cx={0} cy={30} rx={170} ry={30} fill="#f4f1ea" stroke={INK} strokeWidth={5} />
          <path d="M-120 20 q20 -110 120 -110 q100 0 120 110z" fill="#e8a14a" stroke={INK} strokeWidth={5} />
          <path d="M-110 0 h220" stroke="#5aa64a" strokeWidth={16} />
          <path d="M-112 -14 h224" stroke="#b5472f" strokeWidth={12} />
        </g>
      </svg>
      <Character x={960} y={1000} scale={1} expr="happy" mouth="open" pose="hold" talking />
      <Title at={tHungry} x={W / 2} y={170} text="ALWAYS HUNGRY" size={110} color="#fff" />
      <Grade tint="rgba(255,160,80,.2)" vignette={0.45} />
    </Cam>
  );
};

/* ============ 7. CÁMARA LENTA: conversación ============ */
export const Slow: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("slow");
  const tSlow = at("slow", "slow");
  const sentence = "So... I was thinking... maybe we could...";
  const typed = Math.floor(interpolate(f, [20, d - 10], [0, sentence.length], clamp));
  const predict = "...go see a movie later?";
  const tKnow = at("slow", "know");
  const desat = prog(f, tSlow - 10, tSlow + 10);
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.1, -40, 0]}>
      <AbsoluteFill style={{ filter: `saturate(${1 - desat * 0.7})` }}>
        <Sky stops={["#7c6bb0", "#d98aa0 55%", "#f2b98a"]} sun={{ x: 1500, y: 620, r: 60, color: "#ffd9a0" }} />
        <Layer blur={6} px={-30} dur={d}>
          <City base={780} color="#6a5a8a" seed="sl1" h={[200, 520]} windows="#ffe0b0" />
        </Layer>
        <Layer blur={2} px={-60} dur={d}>
          <City base={820} color="#4a3d66" seed="sl2" h={[100, 280]} />
        </Layer>
        <div style={{ position: "absolute", left: 0, top: 820, width: W, height: 260, background: "linear-gradient(#5b4a6e,#2e2440)" }} />
        {/* gente en cámara lenta */}
        {Array.from({ length: 5 }).map((_, i) => {
          const x = 120 + i * 340 + f * 0.25 * (i % 2 ? 1 : -1);
          return <Character key={i} x={x} y={860} scale={0.45} galaxy={false} head="#3a2f52" hoodie={["#8a7ab0", "#b07a9a", "#7a8ab0"][i % 3]} walk={0.12} flip={i % 2 === 0} seed={i + 20} expr="neutral" opacity={0.7} style={{ filter: "blur(2px)" }} />;
        })}
      </AbsoluteFill>
      {/* amiga hablando */}
      <Character x={640} y={1010} scale={1} galaxy={false} head="#2b2d3a" hoodie="#f2c14e" hair="bun" expr="neutral" pose="explain" talking={f % 40 < 26} seed={30} />
      <Character x={1260} y={1010} scale={1} expr="deadpan" mouth="flat" look={[-1, 0]} flip seed={31} />
      {/* burbujas */}
      <div style={{ position: "absolute", left: 230, top: 240, width: 700, padding: "22px 30px", background: "#fff", borderRadius: 30, border: `6px solid ${INK}`, fontFamily: FONT, fontWeight: 600, fontSize: 40, color: INK, minHeight: 60 }}>
        {sentence.slice(0, typed)}
        <span style={{ opacity: Math.floor(f / 10) % 2 }}>|</span>
      </div>
      {f > tKnow && (
        <div style={{ position: "absolute", left: 1150, top: 150, padding: "18px 28px", background: "rgba(34,211,197,.18)", borderRadius: 30, border: "4px dashed #22d3c5", fontFamily: FONT, fontWeight: 600, fontSize: 36, color: "#bffcf2", transform: `scale(${pop(f, tKnow)})` }}>
          {predict}
        </div>
      )}
      <Label at={tSlow - 4} x={W / 2} y={70} text="⏱  slow motion" size={46} />
      <Grade vignette={0.55} />
    </Cam>
  );
};

/* ============ 8. ESCUELA ============ */
export const School: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("school");
  const tAns = at("school", "answer");
  const tNext = at("school", "next");
  const lines = ["x² + 5x + 6 = 0", "x = −2 or x = −3"];
  const extra = Math.floor(interpolate(f, [tNext, tNext + 50], [0, 10], clamp));
  return (
    <Cam dur={d} from={[1.12, 40, 0]} to={[1, 0, 0]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#c9d7c0,#a9bfa0)" }} />
      {/* ventanas */}
      {[0, 1].map((i) => (
        <div key={i} style={{ position: "absolute", left: 1500 + i * 210, top: 140, width: 170, height: 380, background: "linear-gradient(#e8f6ff,#bfe0f2)", border: "12px solid #6b5a46", filter: "blur(1px)" }} />
      ))}
      {/* pizarra */}
      <div style={{ position: "absolute", left: 240, top: 120, width: 1160, height: 520, background: "#22433a", border: "20px solid #7a5a3a", borderRadius: 8 }}>
        <div style={{ padding: "30px 40px", fontFamily: FONT, fontWeight: 600, color: "#f4f1ea", fontSize: 54, lineHeight: 1.3 }}>
          <div>{lines[0]}</div>
          {f > tAns && <div style={{ color: "#ffd36b" }}>{lines[1]}</div>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 28px", fontSize: 36, marginTop: 10, color: "#9ff0c8" }}>
            {Array.from({ length: extra }).map((_, i) => (
              <span key={i}>Q{i + 2} ✓</span>
            ))}
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 860, width: W, height: 220, background: "#8a6a4a" }} />
      <Character x={330} y={980} scale={0.9} galaxy={false} head="#3b3f55" hoodie="#8e5ad0" hair="bun" expr={f > tNext ? "wide" : "neutral"} mouth={f > tNext ? "o" : "smile"} pose="point" seed={40} />
      <Character x={1250} y={1060} scale={1} expr={f > tAns ? "smirk" : "neutral"} mouth="smile" pose={f > tAns - 10 ? "raise" : "down"} flip seed={41} />
      {/* compañeros de espaldas (primer plano desenfocado) */}
      <AbsoluteFill style={{ filter: "blur(5px)" }}>
        {[480, 820, 1600].map((x, i) => (
          <div key={i} style={{ position: "absolute", left: x - 90, top: 880, width: 180, height: 180, borderRadius: "50%", background: ["#2b2d3a", "#3b3f55", "#2b2d3a"][i] }} />
        ))}
        <div style={{ position: "absolute", left: 0, top: 980, width: W, height: 120, background: "#6b4a30" }} />
      </AbsoluteFill>
      <Grade tint="rgba(255,240,200,.15)" vignette={0.5} />
    </Cam>
  );
};

/* ============ 9. SOLEDAD ============ */
export const Lonely: React.FC = () => {
  const d = D("lonely");
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.15, 80, 20]}>
      <Sky stops={["#1c2a4a", "#334a72 60%", "#4c5f88"]} />
      <Stars n={50} h={500} />
      <Layer blur={7} px={20} dur={d}>
        <City base={760} color="#25314f" seed="lo" h={[180, 460]} windows="#ffd59a" />
        {/* grupo riendo a lo lejos, luz cálida */}
        <div style={{ position: "absolute", left: 1180, top: 560, width: 560, height: 360, borderRadius: "50%", background: "radial-gradient(#ffc27a88, transparent 70%)" }} />
        {[0, 1, 2, 3].map((i) => (
          <Character key={i} x={1280 + i * 110} y={880} scale={0.42} galaxy={false} head="#2b2d3a" hoodie={["#f2c14e", "#e2453a", "#6c8cff", "#8e5ad0"][i]} expr="happy" mouth="grin" pose={i % 2 ? "wave" : "down"} seed={50 + i} flip={i > 1} />
        ))}
      </Layer>
      <div style={{ position: "absolute", left: 0, top: 880, width: W, height: 200, background: "linear-gradient(#2a3550,#141a2c)" }} />
      {/* farola */}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect x={392} y={320} width={16} height={600} fill="#1b2236" />
        <path d="M400 320 q0 -40 60 -40 h20" stroke="#1b2236" strokeWidth={16} fill="none" />
        <path d="M470 290 h40 l14 24 h-68z" fill="#1b2236" />
        <path d="M456 314 L300 900 H720 L540 314 Z" fill="#ffe0a0" opacity={0.12} />
      </svg>
      <Character x={480} y={960} scale={0.95} expr="sad" mouth="flat" look={[1, 0.2]} seed={55} />
      <Rain n={90} opacity={0.25} />
      <Grade tint="rgba(80,110,200,.25)" vignette={0.7} />
    </Cam>
  );
};

/* ============ 10. PROBLEMAS DEL MILENIO ============ */
const PROBLEMS = ["Riemann Hypothesis", "P vs NP", "Navier–Stokes", "Yang–Mills", "Hodge Conjecture", "Birch & Swinnerton-Dyer", "Poincaré Conjecture"];
export const MathScene: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("math");
  const tSeven = at("math", "seven");
  const tOne = at("math", "Only");
  const tSix = at("math", "six...");
  const tWeekend = at("math", "weekend.");
  const solved = Math.floor(interpolate(f, [tSix, tSix + 36], [0, 6], clamp));
  const money = solved * 1_000_000;
  return (
    <Cam dur={d} from={[1.05, 0, 0]} to={[1.12, 0, -10]}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 35%, #3a2a1e, #1e140e 60%, #0c0806)" }} />
      <Dust n={35} color="#ffd59a" />
      <Label at={4} x={W / 2} y={60} text="Millennium Prize Problems · 2000" size={44} color="#ffd36b" />
      {PROBLEMS.map((p, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const x = row === 0 ? 170 + col * 400 : 370 + col * 400;
        const y = 170 + row * 270;
        const s = pop(f, tSeven + i * 4);
        const isP = i === 6;
        const done = isP ? f > tOne : i < solved;
        if (f < tSeven + i * 4) return null;
        return (
          <div key={p} style={{ position: "absolute", left: x, top: y, width: 360, height: 220, transform: `scale(${s})`, background: done ? (isP ? "#2f4a3a" : "#3a5a2a") : "#f4ead2", borderRadius: 18, border: `6px solid ${INK}`, boxShadow: "0 10px 0 rgba(0,0,0,.35)", padding: 20, boxSizing: "border-box", fontFamily: FONT }}>
            <div style={{ fontWeight: 700, fontSize: 32, color: done ? "#e8ffe8" : INK, lineHeight: 1.1 }}>{p}</div>
            <div style={{ fontWeight: 600, fontSize: 36, color: done ? "#9ff0c8" : "#b5472f", marginTop: 14 }}>$1,000,000</div>
            {done && (
              <div style={{ position: "absolute", right: 16, bottom: 10, fontWeight: 700, fontSize: isP ? 26 : 56, color: "#9ff0c8" }}>{isP ? "SOLVED · 2003" : "✓"}</div>
            )}
          </div>
        );
      })}
      <Character x={1640} y={1080} scale={0.85} expr={f > tSix ? "smirk" : "focus"} mouth="smile" pose={f > tSix ? "point" : "chin"} flip glow={f > tSix ? 0.8 : 0.2} seed={60} />
      {f > tSix && (
        <div style={{ position: "absolute", left: 140, top: 760, fontFamily: FONT, fontWeight: 700, fontSize: 110, color: "#9ff0c8", WebkitTextStroke: `10px ${INK}`, paintOrder: "stroke fill" }}>
          +${money.toLocaleString("en-US")}
        </div>
      )}
      <Title at={tWeekend} x={700} y={980} text="IN ONE WEEKEND" size={70} color="#ffd36b" />
      <Grade tint="rgba(255,180,90,.18)" vignette={0.6} />
    </Cam>
  );
};
