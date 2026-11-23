import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { Character } from "../lib/Character";
import { Cam, City, Dust, FONT, Grade, H, INK, Label, Layer, pop, prog, Rays, Sky, Stars, Title, W } from "../lib/scene";
import { at, D } from "./timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ============ 11. AGENTES: llegan los autos negros ============ */
const Car: React.FC<{ x: number; y: number; flip?: boolean }> = ({ x, y, flip }) => (
  <svg width={520} height={220} style={{ position: "absolute", left: x, top: y, transform: flip ? "scaleX(-1)" : undefined, overflow: "visible" }}>
    <path d="M500 140 L1100 60 L1100 230 L500 175Z" fill="#fff2b0" opacity={0.18} />
    <path d="M20 150 q0 -40 50 -50 l70 -50 q20 -14 50 -14 h150 q30 0 50 20 l50 44 q60 6 70 50 v30 h-490z" fill="#0d0d14" stroke="#3a3a50" strokeWidth={4} />
    <path d="M150 60 h120 v42 h-170z M290 60 h80 l44 42 h-124z" fill="#2a3350" />
    <circle cx={130} cy={190} r={36} fill="#08080c" stroke="#3a3a50" strokeWidth={6} />
    <circle cx={400} cy={190} r={36} fill="#08080c" stroke="#3a3a50" strokeWidth={6} />
    <ellipse cx={500} cy={140} rx={14} ry={10} fill="#fff6c8" />
  </svg>
);
export const Agents: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("agents");
  const carIn = prog(f, 5, 45);
  const groups = [
    { t: at("agents", "Governments,"), x: 420, text: "Governments", c: "#6c8cff" },
    { t: at("agents", "tech"), x: 960, text: "Tech giants", c: "#22d3c5" },
    { t: at("agents", "secret"), x: 1500, text: "Secret labs", c: "#ff4fa3" },
  ];
  return (
    <Cam dur={d} from={[1.05, 0, 0]} to={[1.12, 0, 10]}>
      <Sky stops={["#05060f", "#0f1630 60%", "#1c2340"]} />
      <Stars n={60} h={420} />
      <Layer blur={6} dur={d} px={-20}>
        <City base={720} color="#141b33" seed="ag" h={[220, 520]} windows="#9fb4ff" />
      </Layer>
      {/* calle mojada con reflejos */}
      <div style={{ position: "absolute", left: 0, top: 760, width: W, height: 320, background: "linear-gradient(#1a1f33,#0a0c16)" }} />
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: random(`rf${i}`) * W, top: 800 + random(`rg${i}`) * 220, width: 160, height: 4, background: "#9fb4ff", opacity: 0.25, filter: "blur(1px)" }} />
      ))}
      <Car x={interpolate(carIn, [0, 1], [-700, 60])} y={720} />
      <Car x={interpolate(carIn, [0, 1], [W + 200, 1360])} y={740} flip />
      {/* foco sobre el protagonista */}
      <div style={{ position: "absolute", left: 760, top: 0, width: 400, height: 1080, background: "linear-gradient(180deg, rgba(255,240,200,.0), rgba(255,240,200,.22))", clipPath: "polygon(45% 0, 55% 0, 100% 100%, 0 100%)" }} />
      <Character x={960} y={1000} scale={0.9} expr="wide" mouth="o" look={[0, 0]} pose="shrug" seed={70} />
      {groups.map((g, gi) =>
        f > g.t ? (
          <React.Fragment key={g.text}>
            {[-1, 1].map((k) => (
              <Character key={k} x={g.x + k * 90 + (gi === 1 ? (k < 0 ? -230 : 230) : 0)} y={gi === 1 ? 1060 : 990} scale={0.7} galaxy={false} head="#15151c" hoodie="#22232e" pants="#15151c" glasses expr="deadpan" mouth="flat" seed={71 + gi * 2 + k} opacity={prog(f, g.t, g.t + 10)} flip={g.x > 960} />
            ))}
            <Label at={g.t} x={g.x + (gi === 1 ? 0 : 0)} y={gi === 1 ? 160 : 260} text={g.text} size={40} color={g.c} />
          </React.Fragment>
        ) : null,
      )}
      <Grade tint="rgba(90,110,220,.25)" vignette={0.75} />
    </Cam>
  );
};

/* ============ 12. FUTURO: el mundo cambia ============ */
export const Future: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("future");
  const tMed = at("future", "medicines.");
  const tEn = at("future", "energy.");
  const tCity = at("future", "Cities");
  return (
    <Cam dur={d} from={[1.15, 0, 30]} to={[1, 0, 0]}>
      <Sky stops={["#8fd8ff", "#c9ecff 55%", "#fff4d6"]} sun={{ x: 1500, y: 260, r: 70, color: "#fff3c2" }} />
      <Rays x={1500} y={260} opacity={0.08} />
      {/* edificios que se construyen solos */}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        {Array.from({ length: 12 }).map((_, i) => {
          const x = 80 + i * 150;
          const hh = 200 + random(`fb${i}`) * 380;
          const g = prog(f, tCity + i * 4, tCity + i * 4 + 30);
          return (
            <g key={i}>
              <rect x={x} y={820 - hh * g} width={120} height={hh * g} rx={14} fill={["#e9f6ff", "#d4f3ee", "#fff"][i % 3]} stroke="#7aa6c2" strokeWidth={4} />
              {g > 0.9 && <rect x={x + 20} y={840 - hh} width={80} height={hh - 60} rx={6} fill="#bfe6ff" opacity={0.6} />}
              {g < 1 && g > 0 && <rect x={x + 40} y={790 - hh * g} width={40} height={30} fill="#ffd36b" />}
            </g>
          );
        })}
        {/* turbinas */}
        {[0, 1, 2].map((i) => {
          const x = 260 + i * 220;
          const s = prog(f, tEn + i * 5, tEn + i * 5 + 15);
          return (
            <g key={i} opacity={s} transform={`translate(${x} 520)`}>
              <rect x={-6} y={0} width={12} height={300} fill="#fff" stroke="#7aa6c2" strokeWidth={3} />
              <g transform={`rotate(${f * 4 + i * 40})`}>
                {[0, 120, 240].map((a) => (
                  <path key={a} d="M0 0 L8 -110 L-8 -110Z" fill="#fff" stroke="#7aa6c2" strokeWidth={3} transform={`rotate(${a})`} />
                ))}
              </g>
              <circle r={10} fill="#7aa6c2" />
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: 0, top: 820, width: W, height: 260, background: "linear-gradient(#9ee09a,#5fb86a)" }} />
      {/* cápsulas de medicina flotando */}
      {Array.from({ length: 6 }).map((_, i) => {
        if (f < tMed + i * 3) return null;
        const y = 300 + Math.sin(f / 20 + i) * 20 + (i % 3) * 110;
        return (
          <div key={i} style={{ position: "absolute", left: 1220 + (i % 2) * 220 + Math.floor(i / 2) * 70, top: y, transform: `rotate(${30 + i * 20}deg) scale(${pop(f, tMed + i * 3)})`, width: 120, height: 48, borderRadius: 24, overflow: "hidden", border: `5px solid ${INK}`, display: "flex" }}>
            <div style={{ flex: 1, background: "#ff5a7a" }} />
            <div style={{ flex: 1, background: "#fff" }} />
          </div>
        );
      })}
      <Character x={960} y={1010} scale={0.95} expr="happy" mouth="grin" pose="wave" glow={0.5} seed={80} />
      <Label at={tMed} x={1420} y={160} text="New medicines" size={38} color="#d83a5a" />
      <Label at={tEn} x={480} y={420} text="Clean energy" size={38} color="#1f7a6a" />
      <Label at={tCity} x={960} y={90} text="Self-building cities" size={38} color="#3a6a9a" />
      <Dust n={20} color="#ffffff" />
      <Grade tint="rgba(255,240,200,.15)" vignette={0.35} />
    </Cam>
  );
};

/* ============ 13. EL GIRO: aprender a ir despacio ============ */
export const Twist: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("twist");
  const tSlow = at("twist", "slow");
  const tListen = at("twist", "listen.");
  const tExplain = at("twist", "explain");
  const draw = prog(f, tExplain, tExplain + 40);
  return (
    <Cam dur={d} from={[1.08, 30, 0]} to={[1, 0, 0]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#3a2a4a,#5a3a4a 60%,#7a4a40)" }} />
      <div style={{ position: "absolute", left: 1300, top: 140, width: 440, height: 420, background: "radial-gradient(circle at 50% 70%, #ffb86a, #c96a4a 70%)", border: "16px solid #2a1a2a", filter: "blur(1px)" }} />
      <div style={{ position: "absolute", left: 1150, top: 260, width: 120, height: 400, background: "radial-gradient(#ffd59a, transparent 70%)", opacity: 0.4 }} />
      <div style={{ position: "absolute", left: 0, top: 860, width: W, height: 220, background: "linear-gradient(#4a2e30,#2a1a20)" }} />
      {/* pizarra pequeña con dibujo simple */}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect x={720} y={250} width={480} height={330} rx={12} fill="#f4f1ea" stroke={INK} strokeWidth={8} />
        <path d="M780 520 L880 420 L960 470 L1080 330 L1140 360" stroke="#e2453a" strokeWidth={10} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${draw} 1`} />
        <circle cx={780} cy={520} r={12 * draw} fill="#22c3b6" />
        <circle cx={1140} cy={360} r={12 * draw} fill="#22c3b6" />
        <rect x={950} y={580} width={20} height={280} fill="#5a3a2a" />
      </svg>
      <Character x={520} y={990} scale={0.95} expr={f > tListen ? "happy" : "neutral"} mouth="smile" pose={f > tExplain ? "point" : "explain"} talking={f > tExplain} seed={90} />
      <Character x={1450} y={990} scale={0.95} galaxy={false} head="#2b2d3a" hoodie="#f2c14e" hair="bun" expr={f > tExplain + 30 ? "happy" : "focus"} mouth="smile" pose="chin" flip seed={91} />
      <Label at={tSlow} x={330} y={160} text="slow down" size={40} color="#ffd36b" />
      <Label at={tListen} x={960} y={110} text="listen" size={40} color="#ffd36b" />
      <Label at={tExplain} x={1580} y={160} text="explain" size={40} color="#ffd36b" />
      <Dust n={25} color="#ffd59a" />
      <Grade tint="rgba(255,160,100,.22)" vignette={0.55} />
    </Cam>
  );
};

/* ============ 14. FINAL: azotea bajo las estrellas ============ */
export const Ending: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("ending");
  const tExcept = at("ending", "except");
  const tBring = at("ending", "bring");
  const friends = prog(f, tBring - 10, tBring + 20);
  return (
    <Cam dur={d} from={[1.25, 0, 60]} to={[1, 0, 0]}>
      <Sky stops={["#0a0a24", "#1c1a4a 55%", "#3a2a6a"]} />
      <Stars n={200} h={800} />
      {/* vía láctea */}
      <div style={{ position: "absolute", left: -200, top: 80, width: 2400, height: 260, background: "linear-gradient(90deg, transparent, rgba(190,160,255,.18), rgba(255,180,220,.15), transparent)", transform: "rotate(-12deg)", filter: "blur(30px)" }} />
      <Layer blur={4} dur={d} px={-20}>
        <City base={880} color="#16143a" seed="en" h={[150, 420]} windows="#ffcf8a" />
      </Layer>
      <div style={{ position: "absolute", left: 0, top: 900, width: W, height: 180, background: "#0f0d24" }} />
      <div style={{ position: "absolute", left: 0, top: 890, width: W, height: 16, background: "#24204a" }} />
      <Character x={960} y={980} scale={0.95} expr={f > tExcept && f < tBring ? "sad" : "happy"} mouth="smile" look={[0, -1]} glow={0.6} seed={100} />
      {[-1, 1, -2, 2].map((k, i) => (
        <Character
          key={k}
          x={960 + k * 230}
          y={980}
          scale={0.85}
          galaxy={false}
          head="#2b2d3a"
          hoodie={["#f2c14e", "#e2453a", "#6c8cff", "#8e5ad0"][i]}
          hair={(["bun", "none", "cap", "messy"] as const)[i]}
          expr="happy"
          mouth="smile"
          look={[0, -1]}
          pose={i % 2 ? "wave" : "down"}
          seed={101 + i}
          opacity={interpolate(friends, [i * 0.2, i * 0.2 + 0.3], [0, 1], clamp)}
          flip={k > 0}
        />
      ))}
      <Grade tint="rgba(120,100,255,.2)" vignette={0.6} />
    </Cam>
  );
};

/* ============ 15. CIERRE / LLAMADA A LA ACCIÓN ============ */
export const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("outro");
  const tCom = at("outro", "comments.");
  const tImg = at("outro", "imagine");
  const sub = pop(f, tCom + 20);
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.05, 0, 0]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#5b1d8c,#d8367a 55%,#ff8a3d 85%,#ffd36b)" }} />
      <Rays x={560} y={620} color="#ffffff" opacity={0.07} />
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.12) 3px, transparent 3px)", backgroundSize: "28px 28px" }} />
      <div style={{ position: "absolute", left: -300, top: 920, width: 1800, height: 700, borderRadius: "50%", background: "#3a165c", border: `10px solid ${INK}` }} />
      <Character x={560} y={1000} scale={1.05} expr="happy" mouth="grin" pose="wave" glow={0.4} seed={110} />
      <div style={{ position: "absolute", left: 1000, top: 240, width: 820, fontFamily: FONT, fontWeight: 700, fontSize: 92, lineHeight: 1.05, color: "#fff", WebkitTextStroke: `10px ${INK}`, paintOrder: "stroke fill", textShadow: `0 8px 0 ${INK}`, opacity: prog(f, 4, 16), transform: `translateY(${(1 - prog(f, 4, 16)) * 40}px)` }}>
        What would <span style={{ color: "#ffd36b" }}>YOU</span> do with a 500 IQ?
      </div>
      {f > tCom && (
        <div style={{ position: "absolute", left: 1000, top: 620, transform: `scale(${pop(f, tCom)})`, transformOrigin: "left center", fontFamily: FONT, fontWeight: 700, fontSize: 46, color: INK, background: "#fff", padding: "14px 34px", borderRadius: 40, border: `6px solid ${INK}`, boxShadow: `0 8px 0 ${INK}` }}>
          💬 Tell me in the comments
        </div>
      )}
      {f > tCom + 20 && (
        <div style={{ position: "absolute", left: 1000, top: 760, transform: `scale(${sub})`, transformOrigin: "left center", fontFamily: FONT, fontWeight: 700, fontSize: 52, color: "#fff", background: "#e62117", padding: "16px 44px", borderRadius: 16, border: `6px solid ${INK}`, boxShadow: `0 8px 0 ${INK}` }}>
          SUBSCRIBE
        </div>
      )}
      <Title at={tImg} x={1420} y={960} text="IMAGINE THIS" size={80} color="#ffd36b" rotate={0} />
      <Dust n={30} color="#fff" />
    </Cam>
  );
};
