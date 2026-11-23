import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { Character } from "../lib/Character";
import { Bedroom, Bubble, Lab, Room } from "../lib/envs";
import { Cam, City, Dust, FONT, Grade, H, INK, Label, pop, prog, Rays, Sky, Title, W } from "../lib/scene";
import { at, D } from "./timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ============ ESPEJO ============ */
export const Mirror: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("mirror");
  const tDust = at("mirror", "count");
  const n = Math.round(interpolate(f, [tDust, at("mirror", "Exactly.")], [0, 312], clamp));
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.12, 60, 10]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#bfe0e6,#9cc8d0)" }} />
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.35) 3px, transparent 3px), linear-gradient(90deg, rgba(255,255,255,.35) 3px, transparent 3px)", backgroundSize: "90px 90px" }} />
      <Rays x={1800} y={80} opacity={0.12} color="#fff6d8" />
      {/* espejo */}
      <div style={{ position: "absolute", left: 360, top: 120, width: 640, height: 720, borderRadius: 320, background: "linear-gradient(135deg,#d8eef2,#9ec6d0)", border: `18px solid #e9d7b0`, boxShadow: `0 0 0 6px ${INK}`, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.85 }}>
          <Character x={330} y={980} scale={1.05} expr="focus" mouth="flat" look={[0.2, 0]} flip seed={200} />
        </div>
        <div style={{ position: "absolute", left: 80, top: -40, width: 120, height: 900, background: "rgba(255,255,255,.25)", transform: "rotate(18deg)" }} />
      </div>
      {/* lavabo */}
      <div style={{ position: "absolute", left: 300, top: 840, width: 760, height: 60, background: "#f4f4f4", border: `6px solid ${INK}`, borderRadius: 14 }} />
      <div style={{ position: "absolute", left: 0, top: 900, width: W, height: 180, background: "#7fa8b2" }} />
      <Character x={1450} y={1010} scale={1.05} expr="focus" mouth="flat" look={[-1, 0]} seed={201} />
      <Dust n={70} color="#fff6d8" seed="mi" />
      {f > tDust && (
        <div style={{ position: "absolute", left: 1450, top: 160, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 700, fontSize: 96, color: "#fff", WebkitTextStroke: `10px ${INK}`, paintOrder: "stroke fill" }}>
          {n} <span style={{ fontSize: 40 }}>specks of dust</span>
        </div>
      )}
      <Grade tint="rgba(255,240,200,.2)" vignette={0.45} />
    </Cam>
  );
};

/* ============ RECUERDOS ============ */
const Cake: React.FC<{ f: number }> = ({ f }) => (
  <svg width={260} height={220} viewBox="0 0 260 220">
    <rect x={40} y={110} width={180} height={80} rx={14} fill="#ff9ab6" stroke={INK} strokeWidth={6} />
    <path d="M40 130 q20 20 45 0 q22 20 45 0 q22 20 45 0 q22 20 45 0" fill="none" stroke="#fff" strokeWidth={8} />
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i}>
        <rect x={70 + i * 28} y={70} width={10} height={40} fill="#6c8cff" stroke={INK} strokeWidth={3} />
        <ellipse cx={75 + i * 28} cy={62 + Math.sin(f / 3 + i)} rx={7} ry={11} fill="#ffd36b" />
      </g>
    ))}
  </svg>
);
export const Memory: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("memory");
  const tB = at("memory", "fifth");
  const zoom = prog(f, tB, tB + 25);
  const cards = [
    { icon: "📖", t: at("memory", "page") },
    { icon: "🙂", t: at("memory", "face") },
    { icon: "🎵", t: at("memory", "song") },
    { icon: "🏠", t: at("memory", "clear.") },
    { icon: "🌧️", t: at("memory", "clear.") + 6 },
    { icon: "🚲", t: at("memory", "clear.") + 12 },
  ];
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.08, 0, 0]}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #3a2a7a, #160f3a 60%, #07061a)" }} />
      <Dust n={50} color="#cfc4ff" seed="me" />
      <Character x={960} y={1040} scale={0.95} expr="wide" mouth="o" look={[0, -1]} glow={0.7} seed={210} />
      {cards.map((c, i) => {
        if (f < c.t) return null;
        const a = (i / cards.length) * Math.PI * 2 + f / 90;
        const x = 960 + Math.cos(a) * 560;
        const y = 470 + Math.sin(a) * 260;
        const s = pop(f, c.t) * (1 - zoom * 0.6);
        return (
          <div key={i} style={{ position: "absolute", left: x - 100, top: y - 80, width: 200, height: 160, transform: `scale(${s}) rotate(${Math.sin(a) * 8}deg)`, background: "#f4f1ea", border: `6px solid ${INK}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, boxShadow: "0 10px 0 rgba(0,0,0,.35)" }}>
            {c.icon}
          </div>
        );
      })}
      {zoom > 0 && (
        <div style={{ position: "absolute", left: 960, top: 420, transform: `translate(-50%,-50%) scale(${zoom})`, width: 560, height: 400, background: "#ffe9c8", border: `8px solid ${INK}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 0 rgba(0,0,0,.35)" }}>
          <div style={{ position: "absolute", left: 150, top: 90 }}>
            <Cake f={f} />
          </div>
          <div style={{ position: "absolute", left: 20, top: 16, fontFamily: FONT, fontWeight: 700, fontSize: 30, color: "#e2453a" }}>● REPLAY · age 5</div>
          <div style={{ position: "absolute", left: 0, bottom: 0, height: 10, width: `${prog(f, tB, d) * 100}%`, background: "#e2453a" }} />
        </div>
      )}
      <Label at={4} x={960} y={60} text="perfect memory" size={44} />
      <Grade vignette={0.65} />
    </Cam>
  );
};

/* ============ EL SÍMBOLO (semilla del misterio) ============ */
export const Symbol: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("symbol");
  const tWall = at("symbol", "wall");
  const glow = prog(f, tWall, tWall + 30) * (0.6 + 0.15 * Math.sin(f / 8));
  const tIdea = at("symbol", "idea");
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.35, 300, 120]}>
      <Bedroom glyph={glow} />
      <Character x={1080} y={960} scale={1.05} expr={f > tIdea ? "sad" : "wide"} mouth={f > tIdea ? "flat" : "o"} look={[-1, -0.7]} seed={220} />
      <Label at={tWall + 20} x={560} y={130} text="???" size={60} color="#7ff0ff" />
      <Dust n={20} color="#7ff0ff" seed="sy" />
      <Grade tint="rgba(80,120,255,.2)" vignette={0.65} />
    </Cam>
  );
};

/* ============ ALTURA: si el IQ fuera estatura ============ */
const Elephant: React.FC<{ x: number; y: number; h: number }> = ({ x, y, h }) => (
  <svg width={h * 1.5} height={h} viewBox="0 0 300 200" style={{ position: "absolute", left: x, top: y - h }}>
    <path d="M60 60 q0 -50 70 -50 h90 q50 0 50 60 v70 h-30 v60 h-30 v-60 h-80 v60 h-30 v-60 h-10 q-20 0 -20 -30z" fill="#8a8fa8" stroke={INK} strokeWidth={6} />
    <path d="M60 60 q-40 10 -40 60 q0 40 -10 70 h20 q16 -40 10 -70 q30 -20 30 -40z" fill="#8a8fa8" stroke={INK} strokeWidth={6} />
    <ellipse cx={95} cy={70} rx={40} ry={46} fill="#9aa0b8" stroke={INK} strokeWidth={5} />
    <circle cx={75} cy={55} r={6} fill={INK} />
  </svg>
);
export const Height: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("height");
  const t170 = at("height", "seventy");
  const tYou = at("height", "half");
  const tEle = at("height", "elephant.");
  const grow = prog(f, tYou - 10, tYou + 25);
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.05, 0, 20]}>
      <Sky stops={["#bfe6ff", "#e8f6ff 60%", "#fff2dc"]} />
      <div style={{ position: "absolute", inset: 0, filter: "blur(4px)" }}>
        <City base={860} color="#a9c2d6" seed="ht" h={[200, 520]} windows="#e9f6ff" />
      </div>
      <div style={{ position: "absolute", left: 0, top: 860, width: W, height: 220, background: "linear-gradient(#b5b9c4,#8a8f9c)" }} />
      {/* regla de altura */}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={120} y1={860} x2={120} y2={200} stroke={INK} strokeWidth={6} />
        {[0, 1, 2, 3].map((m) => (
          <g key={m}>
            <line x1={100} y1={860 - m * 180} x2={140} y2={860 - m * 180} stroke={INK} strokeWidth={6} />
            <text x={150} y={870 - m * 180} fontFamily={FONT} fontWeight={700} fontSize={34} fill={INK}>
              {m} m
            </text>
          </g>
        ))}
      </svg>
      {/* gente promedio (1.70 m ≈ 306 px) */}
      {Array.from({ length: 6 }).map((_, i) => (
        <Character key={i} x={360 + i * 140} y={862} scale={0.51} galaxy={false} head={["#3b3f55", "#2b2d3a", "#474b63"][i % 3]} hoodie={["#e2453a", "#f2c14e", "#6c8cff", "#9aa3b5", "#8e5ad0", "#3ee08a"][i]} expr={f > tYou ? "wide" : "neutral"} mouth={f > tYou ? "o" : "smile"} look={[1, -1]} seed={230 + i} />
      ))}
      {/* tú (≈3.5 m ≈ 630 px) */}
      <Character x={1320} y={862} scale={0.51 + 0.54 * grow} expr="deadpan" mouth="flat" look={[-1, 0.4]} seed={240} />
      {f > tEle && <Elephant x={1500} y={862} h={600 * pop(f, tEle)} />}
      <Label at={t170} x={760} y={480} text="1.70 m" size={40} color={INK} />
      <Label at={tYou + 20} x={1320} y={130} text="you: ~3.5 m" size={44} color="#e2453a" />
      <Grade vignette={0.35} />
    </Cam>
  );
};

/* ============ ¿POR QUÉ? escáner cerebral normal ============ */
export const WhyNow: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("whynow");
  const tN = at("whynow", "neurons,");
  const tNormal = at("whynow", "normal.");
  return (
    <Cam dur={d} from={[1.05, 0, 0]} to={[1.12, -40, 0]}>
      <Lab />
      {/* monitor grande con cerebro */}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect x={620} y={400} width={680} height={360} rx={14} fill="#0e2a36" stroke="#3a5a6a" strokeWidth={14} />
        <g transform="translate(960 580)">
          <path d="M-150 20 q-30 -110 70 -130 q40 -50 110 -20 q90 -20 110 60 q60 40 10 110 q-10 60 -90 50 q-40 40 -110 10 q-90 10 -100 -80z" fill="#1f5a6a" stroke="#5ff0c8" strokeWidth={6} />
          <path d="M-90 -40 q30 30 0 60 M-20 -80 q-30 50 10 90 q30 30 0 60 M60 -60 q30 40 0 80 M110 0 q-30 20 -10 60" stroke="#5ff0c8" strokeWidth={5} fill="none" opacity={0.8} />
          {Array.from({ length: 18 }).map((_, i) => (
            <circle key={i} cx={-140 + random(`bn${i}`) * 280} cy={-100 + random(`bm${i}`) * 200} r={4} fill="#fff" opacity={0.3 + 0.7 * Math.abs(Math.sin(f / 6 + i))} />
          ))}
        </g>
        {f > tNormal && (
          <text x={1190} y={450} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#3ee08a">
            ✓ NORMAL
          </text>
        )}
      </svg>
      <Character x={360} y={1000} scale={0.85} galaxy={false} head="#3b3f55" hoodie="#f4f4f4" hair="bun" expr="focus" mouth="flat" pose="hold" seed={250} />
      <Character x={1560} y={1000} scale={0.85} galaxy={false} head="#2b2d3a" hoodie="#f4f4f4" hair="messy" expr={f > tNormal ? "wide" : "focus"} mouth="o" pose="chin" flip seed={251} />
      <Character x={960} y={1060} scale={0.6} expr="neutral" mouth="flat" look={[0, -1]} seed={252} />
      <Label at={tN} x={960} y={85} text="~86 billion neurons" size={46} color={INK} />
      <Grade vignette={0.45} />
    </Cam>
  );
};

/* ============ LIBROS DE TEXTO ============ */
export const Textbooks: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("textbooks");
  const tMis = at("textbooks", "mistakes");
  const tMail = at("textbooks", "email");
  const tFoot = at("textbooks", "footnotes.");
  const fly = prog(f, tMail, tMail + 35);
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.1, 0, 10]}>
      <Room wall={["#6b4a3a", "#4a3026"]} floor={["#3a2418", "#24160e"]} />
      {/* estanterías */}
      {[0, 1, 2, 3].map((r) => (
        <div key={r} style={{ position: "absolute", left: 80, top: 120 + r * 180, width: 1760, height: 170, borderBottom: "18px solid #2a1a10" }}>
          {Array.from({ length: 42 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: i * 42, bottom: 0, width: 34, height: 110 + random(`bk${r}${i}`) * 50, background: ["#c0392b", "#2980b9", "#27ae60", "#f39c12", "#8e44ad", "#16a085"][(i + r) % 6], border: `3px solid ${INK}`, opacity: f > 10 + (i + r * 10) * 0.6 ? 1 : 0.35 }} />
          ))}
        </div>
      ))}
      <AbsoluteFill style={{ background: "rgba(10,5,20,.35)" }} />
      {[0, 1, 2].map((i) => {
        if (f < tMis + i * 6) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 360 + i * 300, top: 600, width: 220, height: 280, background: ["#2980b9", "#27ae60", "#c0392b"][i], border: `6px solid ${INK}`, borderRadius: 10, transform: `scale(${pop(f, tMis + i * 6)}) rotate(${-6 + i * 6}deg)` }}>
            <div style={{ position: "absolute", left: 30, top: 60, width: 160, height: 120, background: "#fff", borderRadius: 6 }} />
            <div style={{ position: "absolute", left: 50, top: 80, width: 110, height: 70, border: "6px solid #e2453a", borderRadius: "50%" }} />
            <div style={{ position: "absolute", left: 40, top: 200, fontFamily: FONT, fontWeight: 700, fontSize: 30, color: "#fff" }}>ERROR</div>
          </div>
        );
      })}
      {f > tMail && (
        <div style={{ position: "absolute", left: 1200 + fly * 600, top: 500 - fly * 420, transform: `rotate(${-20 * fly}deg) scale(${1 - fly * 0.5})`, width: 200, height: 130, background: "#fff", border: `6px solid ${INK}`, borderRadius: 8 }}>
          <svg width={200} height={130} style={{ position: "absolute", left: 0, top: 0 }}>
            <path d="M0 0 L100 70 L200 0" stroke={INK} strokeWidth={6} fill="none" />
          </svg>
        </div>
      )}
      <Character x={1450} y={1040} scale={0.9} expr="smirk" mouth="smile" pose="point" look={[-1, 0.3]} seed={260} />
      <Label at={tFoot} x={1450} y={300} text="with footnotes" size={40} color="#ffd36b" />
      <Grade tint="rgba(255,180,100,.15)" vignette={0.55} />
    </Cam>
  );
};

/* ============ MÚSICA ============ */
export const Music: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("music");
  const tPlay = at("music", "Twenty");
  const tImprove = at("music", "improving");
  const playing = f > tPlay;
  return (
    <Cam dur={d} from={[1.1, 0, 0]} to={[1, 0, 0]}>
      <Room wall={["#2a3a5a", "#1e2a44"]} floor={["#5a3a2a", "#3a2418"]} />
      {/* guitarras en la pared */}
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={140} height={360} style={{ position: "absolute", left: i < 2 ? 60 + i * 170 : 1340 + (i - 2) * 170, top: 140, filter: "blur(1.5px)" }}>
          <rect x={62} y={0} width={16} height={190} fill="#5a3a2a" />
          <ellipse cx={70} cy={240} rx={60} ry={70} fill={["#e2453a", "#f2c14e", "#22c3b6", "#8e5ad0", "#f39c12"][i]} stroke={INK} strokeWidth={5} />
          <ellipse cx={70} cy={300} rx={50} ry={50} fill={["#c0392b", "#d4a33a", "#1a9a90", "#6c3ab0", "#d4820f"][i]} stroke={INK} strokeWidth={5} />
          <circle cx={70} cy={240} r={16} fill={INK} />
        </svg>
      ))}
      {/* piano */}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect x={500} y={700} width={980} height={200} rx={16} fill="#121218" stroke={INK} strokeWidth={6} />
        <rect x={530} y={720} width={920} height={90} fill="#fff" />
        {Array.from({ length: 23 }).map((_, i) => {
          const pressed = playing && Math.floor(f / 4 + i * 7) % 11 === 0;
          return <rect key={i} x={530 + i * 40} y={720} width={40} height={90} fill={pressed ? "#ffd36b" : "#fff"} stroke={INK} strokeWidth={2} />;
        })}
        {Array.from({ length: 22 }).map((_, i) => (i % 7 === 2 || i % 7 === 6 ? null : <rect key={`b${i}`} x={556 + i * 40} y={720} width={24} height={56} fill="#121218" />))}
      </svg>
      <Character x={990} y={720} scale={0.75} expr={f > tImprove ? "smirk" : "focus"} mouth="smile" pose="hold" seed={270} />
      {playing &&
        Array.from({ length: 10 }).map((_, i) => {
          const t = (f - tPlay + i * 9) % 90;
          return (
            <div key={i} style={{ position: "absolute", left: 700 + (i % 5) * 140 + Math.sin(t / 10 + i) * 30, top: 560 - t * 5, fontSize: 60, color: ["#ffd36b", "#22d3c5", "#ff4fa3"][i % 3], opacity: 1 - t / 90, fontFamily: FONT, fontWeight: 700 }}>
              {i % 2 ? "♪" : "♫"}
            </div>
          );
        })}
      <Label at={tPlay} x={1640} y={220} text="20 minutes" size={44} color="#ffd36b" />
      <Label at={tImprove} x={1640} y={300} text="v2.0" size={40} color="#22d3c5" />
      <Grade tint="rgba(120,140,255,.15)" vignette={0.55} />
    </Cam>
  );
};

/* ============ BÁSQUET ============ */
export const Sports: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("sports");
  const tCalc = at("sports", "arc,");
  const tSwish = at("sports", "Swish.");
  const shot = (t0: number) => {
    const k = Math.max(0, Math.min(1, (f - t0) / 30));
    const x = 560 + k * 1000;
    const y = 520 - Math.sin(k * Math.PI) * 360 + k * 0;
    return { k, x, y };
  };
  const shots = [tSwish - 30, tSwish + 30, tSwish + 75].filter((t) => t < d);
  let path = "";
  for (let k = 0; k <= 1.001; k += 0.05) path += `${k === 0 ? "M" : "L"}${560 + k * 1000} ${520 - Math.sin(k * Math.PI) * 360} `;
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.06, -20, 0]}>
      <Sky stops={["#ff9a6a", "#ffb88a 50%", "#ffd9a8"]} sun={{ x: 300, y: 520, r: 70, color: "#fff0c8" }} />
      <div style={{ position: "absolute", inset: 0, filter: "blur(5px)" }}>
        <City base={700} color="#c9765a" seed="sp" h={[150, 400]} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 700, width: W, height: 380, background: "linear-gradient(#d4824f,#a65a32)" }} />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <ellipse cx={960} cy={900} rx={700} ry={90} fill="none" stroke="#fff" strokeOpacity={0.6} strokeWidth={6} />
        {/* aro */}
        <rect x={1620} y={300} width={20} height={600} fill="#3a3a44" />
        <rect x={1560} y={300} width={140} height={110} fill="#fff" stroke={INK} strokeWidth={6} />
        <rect x={1520} y={510} width={70} height={10} fill="#e2453a" />
        <path d="M1520 520 l10 60 h50 l10 -60" stroke="#fff" strokeWidth={4} fill="none" />
        {f > tCalc && <path d={path} stroke="#fff" strokeWidth={5} strokeDasharray="14 12" fill="none" opacity={prog(f, tCalc, tCalc + 15)} />}
        {shots.map((t0, i) => {
          if (f < t0 || f > t0 + 40) return null;
          const s = shot(t0);
          return (
            <g key={i} transform={`translate(${s.x} ${s.y}) rotate(${f * 12})`}>
              <circle r={32} fill="#f08a2a" stroke={INK} strokeWidth={5} />
              <path d="M-32 0 h64 M0 -32 v64" stroke={INK} strokeWidth={4} />
            </g>
          );
        })}
      </svg>
      <Character x={440} y={960} scale={0.95} expr="focus" mouth="flat" pose={f > tSwish - 34 ? "raise" : "hold"} seed={280} />
      <Label at={tCalc} x={1060} y={110} text="arc · spin · air resistance" size={40} color={INK} />
      {shots.map((t0, i) => (f > t0 + 30 && f < t0 + 60 ? <Title key={i} at={t0 + 30} x={1560} y={220} text="SWISH" size={90} color="#ffd36b" /> : null))}
      <Grade tint="rgba(255,170,90,.2)" vignette={0.45} />
    </Cam>
  );
};

/* ============ AJEDREZ ============ */
export const Chess: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("chess");
  const tThink = at("chess", "think");
  const secs = Math.max(0, Math.floor((f - tThink) / 6));
  return (
    <Cam dur={d} from={[1.05, 0, 0]} to={[1.15, 0, 20]}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 30%, #3a3050, #16121f 70%)" }} />
      <div style={{ position: "absolute", left: 760, top: 0, width: 400, height: 700, background: "linear-gradient(rgba(255,240,200,.25), transparent)", clipPath: "polygon(40% 0, 60% 0, 100% 100%, 0 100%)" }} />
      {/* tablero en perspectiva */}
      <div style={{ position: "absolute", left: 560, top: 640, width: 800, height: 800, transform: "perspective(900px) rotateX(62deg)", transformOrigin: "50% 0%" }}>
        {Array.from({ length: 64 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: (i % 8) * 100, top: Math.floor(i / 8) * 100, width: 100, height: 100, background: (i + Math.floor(i / 8)) % 2 ? "#5a3a2a" : "#e9d7b0" }} />
        ))}
      </div>
      {/* monitor del motor */}
      <div style={{ position: "absolute", left: 1350, top: 200, width: 440, height: 300, background: "#0e1a2a", border: "14px solid #3a4a5a", borderRadius: 12, fontFamily: FONT, color: "#5ff0c8", padding: 24, boxSizing: "border-box" }}>
        <div style={{ fontSize: 34, fontWeight: 700 }}>ENGINE</div>
        <div style={{ fontSize: 30, marginTop: 20 }}>{f > tThink ? `thinking... ${secs}s` : "eval: +0.3"}</div>
        {f > tThink && (
          <div style={{ marginTop: 26, width: 60, height: 60, borderRadius: "50%", border: "8px solid #5ff0c8", borderTopColor: "transparent", transform: `rotate(${f * 12}deg)` }} />
        )}
      </div>
      <Character x={420} y={1010} scale={0.95} expr="deadpan" mouth="flat" look={[1, 0.3]} pose="chin" seed={290} />
      <Label at={at("chess", "champions.")} x={960} y={90} text="computers beat world champions for years" size={34} />
      <Grade vignette={0.6} />
    </Cam>
  );
};

/* ============ DORMIR: sueños con ecuaciones ============ */
export const Sleep: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("sleep");
  const tDream = at("sleep", "dreams");
  const tAns = at("sleep", "answers.");
  const eqs = ["E = mc²", "∫ f(x) dx", "eⁱᵖ + 1 = 0", "∇ · B = 0", "a² + b² = c²", "Σ 1/n²"];
  return (
    <Cam dur={d} from={[1.05, 0, 0]} to={[1.15, -120, 40]}>
      <Bedroom night />
      {/* personaje acostado */}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <radialGradient id="sleepHead" cx="38%" cy="32%" r="75%">
            <stop offset="0" stopColor="#4a35a8" />
            <stop offset=".55" stopColor="#21165e" />
            <stop offset="1" stopColor="#0c0830" />
          </radialGradient>
        </defs>
        <circle cx={350} cy={660 + Math.sin(f / 20) * 2} r={62} fill="url(#sleepHead)" stroke={INK} strokeWidth={5} />
        {Array.from({ length: 8 }).map((_, i) => <circle key={i} cx={320 + ((i * 37) % 70)} cy={630 + ((i * 23) % 60)} r={2} fill="#fff" opacity={0.7} />)}
        <path d={f > tAns ? "M318 655 q12 -12 24 0 M362 655 q12 -12 24 0" : "M318 655 q12 10 24 0 M362 655 q12 10 24 0"} stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" />
        <ellipse cx={350} cy={712} rx={95} ry={20} fill="none" stroke="#ffd36b" strokeWidth={5} />
        <path d="M400 700 q60 -60 200 -40 q200 0 360 -10 v90 h-560z" fill="#3d3a78" stroke={INK} strokeWidth={5} />
      </svg>
      {["z", "Z", "z"].map((z, i) => {
        const t = (f + i * 20) % 60;
        return (
          <div key={i} style={{ position: "absolute", left: 340 + t * 1.5, top: 560 - t * 2.5, fontFamily: FONT, fontWeight: 700, fontSize: 40 + i * 10, color: "#cfc4ff", opacity: 1 - t / 60 }}>
            {z}
          </div>
        );
      })}
      {/* burbuja de sueño */}
      {f > tDream && (
        <div style={{ position: "absolute", left: 620, top: 140, width: 640, height: 360, borderRadius: "50%", background: "rgba(40,30,100,.85)", border: "6px solid #cfc4ff", transform: `scale(${pop(f, tDream)})`, overflow: "hidden" }}>
          {eqs.map((e, i) => (
            <div key={e} style={{ position: "absolute", left: 60 + (i % 3) * 180, top: 70 + Math.floor(i / 3) * 120 + Math.sin(f / 15 + i) * 8, fontFamily: FONT, fontWeight: 600, fontSize: 38, color: ["#7ff0ff", "#ffd36b", "#ff9ab6"][i % 3] }}>
              {e}
            </div>
          ))}
        </div>
      )}
      {f > tDream && <div style={{ position: "absolute", left: 560, top: 520, width: 40, height: 40, borderRadius: "50%", background: "rgba(40,30,100,.85)", border: "5px solid #cfc4ff" }} />}
      {f > tAns && <Bubble x={940} y={600} s={pop(f, tAns)} size={48}>💡</Bubble>}
      <Label at={at("sleep", "waste")} x={1450} y={120} text="sleep = cleanup + memory" size={36} color="#cfc4ff" />
      <Grade tint="rgba(80,90,255,.2)" vignette={0.7} />
    </Cam>
  );
};
