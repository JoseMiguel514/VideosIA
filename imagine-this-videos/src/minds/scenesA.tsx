import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { Character } from "../lib/Character";
import { Bedroom, InfoBg, Lab, Room } from "../lib/envs";
import { Crowd, Dog, MindWaves, Scanner, Speech, Thought, ThoughtNoise } from "../lib/minds";
import { Cam, City, Dust, FONT, Grade, H, INK, Label, pop, prog, Stars, Title, W } from "../lib/scene";
import { at, D } from "./timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const NOISE = ["did I lock the door?", "so tired...", "coffee first", "where are my keys", "late again", "what's for lunch", "I hope she calls", "ugh, Monday", "don't forget the bread", "is it going to rain?"];

/* ===== HOOK ===== */
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("hook");
  const tVoice = at("hook", "voice...");
  const tMinds = at("hook", "minds.");
  return (
    <Cam dur={d} from={[1.3, -200, 50]} to={[1, 0, 0]}>
      <Bedroom />
      <Character x={1080} y={960} scale={1.05} expr={f < tVoice ? "focus" : "wide"} mouth={f < tVoice ? "flat" : "o"} look={[Math.sin(f / 20), -0.3]} seed={1} />
      {f > tVoice && <MindWaves x={1080} y={430} n={3} />}
      <ThoughtNoise words={NOISE} at={tVoice} density={1.3} seed="hk" />
      <Title at={tMinds} x={W / 2} y={170} text="YOU CAN READ MINDS" size={110} color="#7ff0ff" rotate={0} />
      <Dust n={25} />
      <Grade tint="rgba(255,170,120,.2)" />
    </Cam>
  );
};

/* ===== MAMÁ ===== */
const Kitchen: React.FC = () => (
  <>
    <Room wall={["#f2c79a", "#e3a47a"]} floor={["#8a5a40", "#6a4030"]} window={{ x: 1300, y: 130, w: 480, h: 380, sky: ["#cfeaf7", "#a8d4ea"], city: "#8fb3c9" }} />
    <div style={{ position: "absolute", left: 0, top: 760, width: W, height: 40, background: "#9a6a48", borderTop: `6px solid ${INK}` }} />
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      {[140, 320, 500].map((x) => (
        <rect key={x} x={x} y={150} width={150} height={200} rx={10} fill="#f4e2c8" stroke={INK} strokeWidth={5} />
      ))}
    </svg>
  </>
);
export const Mom: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("mom");
  const tGood = at("mom", "good");
  const tThink = at("mom", "looks");
  const tAns = at("mom", "answer");
  const tFreeze = at("mom", "freezes,");
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.1, 0, 0]}>
      <Kitchen />
      <Character x={640} y={1000} scale={1} galaxy={false} head="#2b2d3a" hoodie="#e2453a" hair="bun" expr={f > tFreeze ? "wide" : "happy"} mouth={f > tFreeze ? "o" : "smile"} pose="hold" seed={10} />
      <Character x={1260} y={1000} scale={1} expr={f > tThink ? "wide" : "focus"} mouth="flat" flip seed={11} />
      <Speech at={tGood} out={tThink + 10} x={640} y={330} text="Good morning!" />
      <Thought at={tThink} x={760} y={300} text="He looks so tired... I hope today is a better day." maxW={520} />
      <Speech at={tAns} x={1260} y={330} text="It will be. Thanks, Mom." size={32} />
      <MindWaves x={640} y={500} n={2} />
      <Grade tint="rgba(255,190,120,.2)" vignette={0.45} />
    </Cam>
  );
};

/* ===== HERMANO: adivina el número ===== */
export const Brother: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("brother");
  const t742 = at("brother", "Seven");
  const tDrop = at("brother", "drops");
  const tAgain = at("brother", "again.");
  const nums = ["19", "3,001", "88", "1,000,000"];
  return (
    <Cam dur={d} from={[1.05, 0, 0]} to={[1.12, 0, 0]}>
      <Kitchen />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect x={380} y={770} width={1100} height={30} rx={8} fill="#7a4a30" stroke={INK} strokeWidth={5} />
        <g transform={`translate(1080 ${f > tDrop ? Math.min(940, 760 + (f - tDrop) * 18) : 740}) rotate(${f > tDrop ? (f - tDrop) * 20 : 0})`}>
          <rect x={-6} y={-40} width={12} height={60} rx={5} fill="#c9cdd2" stroke={INK} strokeWidth={3} />
          <ellipse cx={0} cy={-48} rx={14} ry={18} fill="#c9cdd2" stroke={INK} strokeWidth={3} />
        </g>
      </svg>
      <Character x={1180} y={1000} scale={0.68} galaxy={false} head="#3b3f55" hoodie="#f2c14e" hair="cap" expr={f > tDrop ? "wide" : "deadpan"} mouth={f > tDrop ? "o" : "flat"} flip seed={20} />
      <Character x={640} y={1000} scale={1} expr="smirk" mouth="smile" pose="point" seed={21} />
      <Thought at={at("brother", "rolls")} out={t742 + 25} x={1180} y={560} text="742" size={70} tail="right" />
      <Speech at={t742} out={tAgain} x={640} y={320} text='"742"' size={56} />
      {nums.map((n, i) => {
        const t = tAgain + i * 14;
        return f > t && f < t + 14 ? <Thought key={n} at={t} x={1180} y={560} text={n} size={60} tail="right" /> : null;
      })}
      {f > tAgain && (
        <div style={{ position: "absolute", left: 120, top: 120, fontFamily: FONT, fontWeight: 700, fontSize: 64, color: "#1f7a4a" }}>
          {"✓ ".repeat(Math.min(5, 1 + Math.floor((f - tAgain) / 14)))}
        </div>
      )}
      <Grade tint="rgba(255,190,120,.2)" vignette={0.45} />
    </Cam>
  );
};

/* ===== REGLAS ===== */
export const Rules: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("rules");
  const tNear = at("rules", "nearby,");
  const tLoud = at("rules", "louder");
  const tOff = at("rules", "off.");
  const ring = prog(f, tNear, tNear + 30);
  const people = [
    { x: 600, s: 0.6, t: "nice shoes" },
    { x: 1350, s: 0.6, t: "is that a dog?" },
    { x: 330, s: 0.42, t: "..." },
    { x: 1640, s: 0.42, t: "..." },
  ];
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.06, 0, 0]}>
      <InfoBg hue="#1f3a5a" />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <ellipse cx={960} cy={900} rx={620 * ring} ry={150 * ring} fill="rgba(127,240,255,.08)" stroke="#7ff0ff" strokeWidth={5} strokeDasharray="16 12" />
        <text x={960 + 600 * ring} y={1000} fontFamily={FONT} fontWeight={700} fontSize={40} fill="#7ff0ff" opacity={ring}>
          ~10 m
        </text>
      </svg>
      {people.map((p, i) => (
        <React.Fragment key={i}>
          <Character x={p.x} y={i < 2 ? 900 : 760} scale={p.s} galaxy={false} head="#3b3f55" hoodie={["#e2453a", "#f2c14e", "#6c8cff", "#8e5ad0"][i]} seed={30 + i} opacity={i < 2 ? 1 : 0.5} />
          {i < 2 && <Thought at={tLoud + i * 8} x={p.x} y={480} text={p.t} size={i < 2 ? 34 : 22} />}
        </React.Fragment>
      ))}
      <Character x={960} y={940} scale={0.8} expr="focus" mouth="flat" seed={34} />
      <Label at={tNear} x={960} y={80} text="Range: ~10 meters" size={44} color="#7ff0ff" />
      <Label at={tLoud} x={960} y={150} text="Closer = louder" size={40} />
      {f > tOff && (
        <div style={{ position: "absolute", left: 1500, top: 240, transform: `scale(${pop(f, tOff)})`, width: 260, height: 120, borderRadius: 60, background: "#3ee08a", border: `6px solid ${INK}` }}>
          <div style={{ position: "absolute", right: 10, top: 10, width: 88, height: 88, borderRadius: "50%", background: "#fff", border: `5px solid ${INK}` }} />
          <div style={{ position: "absolute", left: 18, top: 30, fontFamily: FONT, fontWeight: 700, fontSize: 44, color: INK }}>ON</div>
          <div style={{ position: "absolute", left: -10, top: 50, width: 280, height: 8, background: "#e2453a", transform: "rotate(-20deg)" }} />
        </div>
      )}
      <Grade vignette={0.6} />
    </Cam>
  );
};

/* ===== PERRO ===== */
export const DogScene: React.FC = () => {
  const d = D("dog");
  const tFood = at("dog", "food.");
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.1, 0, 0]}>
      <Room wall={["#7aa6c2", "#5a86a2"]} floor={["#c9a27a", "#a9825a"]} />
      <Dog x={1250} y={1000} s={1.3} />
      <Character x={600} y={1000} scale={1} expr="focus" mouth="flat" pose="chin" look={[1, 0.3]} seed={40} />
      <MindWaves x={1150} y={720} color="#ffd36b" n={2} />
      {Array.from({ length: 8 }).map((_, i) => {
        const t = tFood + i * 10;
        return <Thought key={i} at={t} x={1000 + (i % 4) * 150} y={250 + Math.floor(i / 4) * 150} text="FOOD" size={44} color="#ffd36b" tail="none" />;
      })}
      <Grade vignette={0.45} />
    </Cam>
  );
};

/* ===== CIENCIA REAL ===== */
export const Science: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("science");
  const tAI = at("science", "artificial");
  const t16 = at("science", "sixteen");
  const tText = at("science", "text.");
  const txt = "...the general idea of what they were thinking...";
  const n = Math.floor(interpolate(f, [tAI + 15, tText], [0, txt.length], clamp));
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.08, 0, 0]}>
      <Lab />
      <Scanner x={700} y={820} on={prog(f, tAI, tAI + 20)} />
      <div style={{ position: "absolute", left: 1220, top: 470, width: 600, height: 300, background: "#0e2a36", border: "12px solid #3a5a6a", borderRadius: 12, padding: 24, boxSizing: "border-box", fontFamily: FONT, color: "#5ff0c8", fontSize: 32, fontWeight: 600 }}>
        <div style={{ fontSize: 26, opacity: 0.7 }}>AI DECODER</div>
        {f > tAI && <div style={{ marginTop: 16 }}>{txt.slice(0, n)}</div>}
      </div>
      <Label at={at("science", "Texas")} x={960} y={60} text="University of Texas · 2023" size={44} color={INK} />
      <Label at={t16} x={1520} y={400} text="16 h of brain scans / person" size={30} color={INK} />
      <Grade vignette={0.4} />
    </Cam>
  );
};

/* ===== LÍMITES DE LA CIENCIA REAL ===== */
export const Limits: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("limits");
  const items = [
    { t: at("limits", "scanner."), text: "Only inside a scanner" },
    { t: at("limits", "training"), text: "Hours of training per person" },
    { t: at("limits", "didn't"), text: "Fails if you resist" },
  ];
  const tYou = at("limits", "Your");
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.05, 0, 0]}>
      <InfoBg hue="#1e3a4a" />
      {items.map((it, i) =>
        f > it.t ? (
          <div key={i} style={{ position: "absolute", left: 160, top: 220 + i * 160, transform: `scale(${pop(f, it.t)})`, transformOrigin: "left center", display: "flex", alignItems: "center", gap: 26, fontFamily: FONT, fontWeight: 700, fontSize: 50, color: "#fff" }}>
            <div style={{ width: 80, height: 80, borderRadius: 20, background: "#e2453a", border: `5px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54 }}>✕</div>
            {it.text}
          </div>
        ) : null,
      )}
      <Character x={1500} y={1000} scale={0.95} expr={f > tYou ? "smirk" : "focus"} mouth="smile" glow={f > tYou ? 0.5 : 0} seed={50} />
      {f > tYou && <MindWaves x={1500} y={500} n={3} />}
      <Title at={tYou} x={1500} y={200} text="NO LIMITS" size={90} color="#7ff0ff" rotate={0} />
      <Grade vignette={0.6} />
    </Cam>
  );
};

/* ===== 6,200 PENSAMIENTOS AL DÍA ===== */
export const Count: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("count");
  const t6 = at("count", "six");
  const tAll = at("count", "everyone");
  const n = Math.round(interpolate(f, [t6 - 10, t6 + 40], [0, 6200], clamp));
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.1, 0, 0]}>
      <InfoBg hue="#2a2466" />
      {f > tAll && (
        <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
          {Array.from({ length: Math.min(300, (f - tAll) * 6) }).map((_, i) => (
            <circle key={i} cx={random(`c${i}`) * W} cy={random(`d${i}`) * H} r={10 + random(`e${i}`) * 20} fill="none" stroke="#7ff0ff" strokeWidth={3} strokeDasharray="6 5" opacity={0.6} />
          ))}
        </svg>
      )}
      <div style={{ position: "absolute", left: 960, top: 300, transform: "translateX(-50%)", textAlign: "center", fontFamily: FONT, fontWeight: 700, color: "#fff" }}>
        <div style={{ fontSize: 200, color: "#7ff0ff", textShadow: "0 0 40px rgba(127,240,255,.6)" }}>{n.toLocaleString("en-US")}</div>
        <div style={{ fontSize: 56 }}>thoughts per day (estimate)</div>
      </div>
      <Character x={960} y={1120} scale={0.6} expr={f > tAll ? "wide" : "neutral"} mouth="o" seed={60} />
      <Label at={at("count", "study")} x={960} y={110} text="Queen's University · 2020" size={40} color="#ffd36b" />
      <Grade vignette={0.65} />
    </Cam>
  );
};

/* ===== AUTOBÚS ===== */
const BusInterior: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{ background: "#2e3b52" }} />
      <div style={{ position: "absolute", left: 0, top: 110, width: W, height: 430, overflow: "hidden", background: "#9cc6e0" }}>
        <div style={{ position: "absolute", left: -((f * 18) % 900), top: 0, width: W + 900, height: 430, filter: "blur(5px)" }}>
          <City base={430} color="#6f93ad" seed="mb" h={[150, 360]} x0={0} x1={W + 900} windows="#e9f4ff" />
        </div>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ position: "absolute", left: i * 520 - 20, top: 0, width: 40, height: 430, background: "#2e3b52" }} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, top: 540, width: W, height: 540, background: "linear-gradient(#3b4a66,#26314a)" }} />
      <div style={{ position: "absolute", left: 0, top: 70, width: W, height: 20, background: "#c9cfd8" }} />
      <span style={{ display: "none" }}>{d}</span>
    </>
  );
};
export const Bus: React.FC = () => {
  const d = D("bus");
  const lines = [
    [at("bus", "lock"), "Did I lock the door?"],
    [at("bus", "late."), "I'm going to be late."],
    [at("bus", "yesterday?"), "Why did I say that yesterday?"],
    [at("bus", "lunch?"), "What should I eat for lunch?"],
  ] as const;
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.1, 0, 0]}>
      <BusInterior d={d} />
      <Crowd rows={2} perRow={9} y0={700} dy={150} scale0={0.9} seed="bus" bounce={4} />
      <Character x={960} y={1120} scale={0.95} expr="sad" mouth="frown" pose={{ l: { s: 8, e: 4 }, r: { s: 25, e: 150 } }} seed={70} />
      {lines.map(([t, txt], i) => (
        <Thought key={i} at={t} x={[420, 1450, 650, 1300][i]} y={[260, 300, 520, 560][i]} text={txt} size={32} />
      ))}
      <ThoughtNoise words={["...", "ugh", "hmm", "la la la", "so hungry", "text her back"]} at={at("bus", "stops.")} density={2} seed="bn" />
      <Label at={at("bus", "Forty")} x={960} y={150} text="40 minds" size={40} color="#7ff0ff" />
      <Grade vignette={0.55} />
    </Cam>
  );
};

/* ===== CANCIONES PEGADAS ===== */
export const Songs: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("songs");
  const tSeven = at("songs", "seven");
  return (
    <Cam dur={d} from={[1.1, 0, 0]} to={[1, 0, 0]}>
      <BusInterior d={d} />
      <Crowd rows={2} perRow={9} y0={700} dy={150} scale0={0.9} seed="bus" bounce={10} />
      {Array.from({ length: 18 }).map((_, i) => {
        const x = ((i % 9) / 9) * (W + 100) - 50 + (Math.floor(i / 9) % 2) * 60;
        const y = 600 + Math.floor(i / 9) * 150 - ((f * 2 + i * 20) % 120);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, fontSize: 46, color: ["#ffd36b", "#7ff0ff", "#ff9ab6"][i % 3], opacity: 1 - ((f * 2 + i * 20) % 120) / 120 }}>
            {i % 2 ? "♪" : "♫"}
          </div>
        );
      })}
      {f > tSeven && (
        <div style={{ position: "absolute", left: 960, top: 180, transform: `translate(-50%,0) scale(${pop(f, tSeven)})`, fontFamily: FONT, fontWeight: 700, fontSize: 110, color: "#fff", WebkitTextStroke: `10px ${INK}`, paintOrder: "stroke fill" }}>
          7 songs 🎵
        </div>
      )}
      <Label at={at("songs", "terrible.")} x={960} y={340} text="all terrible" size={44} color="#ff9ab6" />
      <Grade vignette={0.55} />
    </Cam>
  );
};

/* ===== SUPERMERCADO ===== */
export const Market: React.FC = () => {
  const d = D("market");
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.08, -40, 0]}>
      <Room wall={["#e9f2f4", "#cfdde2"]} floor={["#cfd6da", "#aab4ba"]} />
      {[0, 1, 2, 3].map((r) => (
        <div key={r} style={{ position: "absolute", left: 60, top: 140 + r * 150, width: 1800, height: 140, borderBottom: "14px solid #8a97a0" }}>
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: i * 50, bottom: 0, width: 42, height: 70 + random(`mk${r}${i}`) * 50, background: ["#e2453a", "#f2c14e", "#3ee08a", "#6c8cff", "#ff7ab6", "#f39c12"][(i * 7 + r) % 6], border: `3px solid ${INK}`, borderRadius: 4, opacity: 0.85 }} />
          ))}
        </div>
      ))}
      <Character x={420} y={1040} scale={0.85} galaxy={false} head="#3b3f55" hoodie="#6c8cff" expr="focus" mouth="flat" pose="hold" seed={80} />
      <Character x={1520} y={1040} scale={0.85} galaxy={false} head="#2b2d3a" hoodie="#3ee08a" hair="bun" expr="happy" mouth="smile" flip seed={81} />
      <Character x={960} y={1080} scale={0.85} expr="smirk" mouth="smile" seed={82} />
      <Thought at={at("market", "cereal")} x={480} y={340} text="I'm a grown adult. I can buy the cereal with the cartoon on it." size={30} maxW={480} />
      <Thought at={at("market", "cashier")} x={1500} y={360} text="🏝️ 12 more days..." size={34} tail="right" />
      <ThoughtNoise words={["did I forget something?", "did I forget something?", "milk? eggs?", "did I forget something?", "what was the third thing...", "did I forget something?"]} at={at("market", "everyone,")} density={2} seed="mkn" opacity={0.9} />
      <Grade vignette={0.4} />
    </Cam>
  );
};

/* ===== PASILLO DE LA ESCUELA ===== */
const Hallway: React.FC = () => (
  <>
    <Room wall={["#9ab0c8", "#7a90a8"]} floor={["#c9b89a", "#a9987a"]} />
    {Array.from({ length: 16 }).map((_, i) => (
      <div key={i} style={{ position: "absolute", left: 40 + i * 118, top: 300, width: 108, height: 560, background: i % 2 ? "#3a6ab0" : "#3462a6", border: `4px solid ${INK}` }}>
        <div style={{ position: "absolute", left: 20, top: 30, width: 68, height: 6, background: INK, opacity: 0.5 }} />
        <div style={{ position: "absolute", left: 20, top: 46, width: 68, height: 6, background: INK, opacity: 0.5 }} />
        <div style={{ position: "absolute", right: 14, top: 260, width: 10, height: 40, background: "#c9cdd2", borderRadius: 4 }} />
      </div>
    ))}
  </>
);
export const HallwayScene: React.FC = () => {
  const d = D("hallway");
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.08, 0, 0]}>
      <Hallway />
      {[300, 700, 1250, 1620].map((x, i) => (
        <Character key={i} x={x} y={1020} scale={0.85} galaxy={false} head={["#2b2d3a", "#3b3f55", "#474b63", "#2b2d3a"][i]} hoodie={["#e2453a", "#ff7ab6", "#f2c14e", "#3ee08a"][i]} hair={(["cap", "bun", "messy", "none"] as const)[i]} expr="focus" mouth="flat" walk={i % 2 ? 0.6 : 0} flip={i > 1} seed={90 + i} />
      ))}
      <Character x={980} y={1060} scale={0.9} expr="deadpan" mouth="flat" seed={95} />
      <Thought at={at("hallway", "hair")} x={300} y={420} text="Does my hair look weird?" size={30} />
      <Thought at={at("hallway", "looking")} x={700} y={300} text="Is everyone looking at me?" size={30} />
      <Thought at={at("hallway", "stain")} x={1400} y={360} text="Did they notice the stain on my shirt?!" size={30} tail="right" />
      <Label at={at("hallway", "themselves.")} x={960} y={70} text="me · me · me" size={44} color="#ffd36b" />
      <Grade vignette={0.45} />
    </Cam>
  );
};

/* ===== EFECTO FOCO ===== */
export const Spotlight: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("spotlight");
  const tName = at("spotlight", "spotlight");
  const tReal = at("spotlight", "reality,");
  const many = prog(f, tReal, tReal + 30);
  return (
    <Cam dur={d} from={[1.05, 0, 0]} to={[1, 0, 0]}>
      <AbsoluteFill style={{ background: "#0e0c1e" }} />
      {[300, 620, 960, 1300, 1620].map((x, i) => {
        const lit = i === 2 || many > i * 0.2;
        return (
          <React.Fragment key={i}>
            {lit && <div style={{ position: "absolute", left: x - 230, top: 0, width: 460, height: 1080, background: "linear-gradient(rgba(255,240,200,.3), rgba(255,240,200,.08))", clipPath: "polygon(42% 0, 58% 0, 100% 100%, 0 100%)" }} />}
            <Character x={x} y={980} scale={0.8} galaxy={i === 2} head="#3b3f55" hoodie={["#e2453a", "#f2c14e", "#22c3b6", "#6c8cff", "#ff7ab6"][i]} expr={lit ? "wide" : "neutral"} mouth="o" seed={100 + i} opacity={lit ? 1 : 0.35} />
          </React.Fragment>
        );
      })}
      <Title at={tName} x={960} y={140} text="THE SPOTLIGHT EFFECT" size={84} color="#ffd36b" rotate={0} />
      <Label at={tReal} x={960} y={250} text="everyone thinks they're the one being watched" size={36} />
      <Grade vignette={0.5} />
    </Cam>
  );
};

/* ===== EXAMEN ===== */
const Classroom: React.FC = () => (
  <>
    <Room wall={["#c9d7c0", "#a9bfa0"]} floor={["#8a6a4a", "#6a4a30"]} />
    <div style={{ position: "absolute", left: 360, top: 100, width: 1200, height: 340, background: "#22433a", border: "18px solid #7a5a3a" }}>
      <div style={{ padding: 30, fontFamily: FONT, fontWeight: 600, fontSize: 50, color: "#f4f1ea" }}>MATH EXAM</div>
    </div>
  </>
);
export const Exam: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("exam");
  const tThink = at("exam", "thinking");
  const tWrite = at("exam", "write");
  const answers = ["1) x = 4", "2) 17", "3) √2", "4) 3/8", "5) 120°"];
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.1, 60, 0]}>
      <Classroom />
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: 220 + i * 560, top: 860, width: 380, height: 30, background: "#7a4a30", border: `5px solid ${INK}` }} />
      ))}
      <Character x={410} y={1010} scale={0.85} galaxy={false} head="#3b3f55" hoodie="#8e5ad0" hair="messy" expr="focus" mouth="flat" pose="hold" seed={110} />
      <Character x={1530} y={1010} scale={0.85} expr="deadpan" mouth="flat" pose="hold" flip seed={111} />
      {answers.map((a, i) => (
        <Thought key={a} at={tThink + i * 14} x={420} y={560 - i * 0} text={a} size={40} out={tThink + i * 14 + 13} />
      ))}
      {f > tWrite && (
        <div style={{ position: "absolute", left: 1450, top: 560, width: 300, padding: 16, background: "#fff", border: `4px solid ${INK}`, fontFamily: FONT, fontWeight: 600, fontSize: 30, color: "#2a4a8a", transform: "rotate(-4deg)" }}>
          {answers.slice(0, Math.min(5, 1 + Math.floor((f - tWrite) / 10))).map((a) => (
            <div key={a}>{a}</div>
          ))}
        </div>
      )}
      <Grade vignette={0.45} />
    </Cam>
  );
};

/* ===== TRAMPA: la nota vacía ===== */
export const Cheat: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("cheat");
  const tEmpty = at("cheat", "empty.");
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.12, 0, 0]}>
      <Classroom />
      <div style={{ position: "absolute", left: 700, top: 470, width: 520, height: 420, background: "#fff", border: `6px solid ${INK}`, transform: "rotate(-3deg)", fontFamily: FONT }}>
        <div style={{ position: "absolute", left: 40, top: 40, fontSize: 40, fontWeight: 600, color: INK }}>MATH EXAM</div>
        <div style={{ position: "absolute", right: 40, top: 110, transform: `scale(${pop(f, 8)}) rotate(-12deg)`, fontSize: 130, fontWeight: 700, color: "#e2453a", border: "10px solid #e2453a", borderRadius: 20, padding: "0 20px" }}>100</div>
      </div>
      <Character x={330} y={1010} scale={0.9} galaxy={false} head="#3b3f55" hoodie="#8e5ad0" hair="bun" expr="happy" mouth="grin" pose="wave" seed={120} />
      <Character x={1550} y={1010} scale={0.9} expr={f > tEmpty ? "sad" : "neutral"} mouth="flat" flip seed={121} />
      <Label at={tEmpty} x={1550} y={330} text="not yours" size={46} color="#e2453a" />
      <Grade vignette={0.5} />
    </Cam>
  );
};

/* ===== DOLOR DE CABEZA ===== */
export const Headache: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("headache");
  const tHead = at("headache", "headphones,");
  const tPill = at("headache", "pillow");
  const pulse = (f % 24) / 24;
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.15, -100, 40]}>
      <Bedroom />
      <Character x={1080} y={960} scale={1.05} expr="sad" mouth="frown" pose={f > tPill ? "raise" : "chin"} seed={130} />
      {f > tHead && (
        <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
          <path d="M970 440 q110 -150 220 0" stroke={INK} strokeWidth={22} fill="none" />
          <rect x={950} y={420} width={44} height={80} rx={18} fill="#e2453a" stroke={INK} strokeWidth={5} />
          <rect x={1166} y={420} width={44} height={80} rx={18} fill="#e2453a" stroke={INK} strokeWidth={5} />
        </svg>
      )}
      <div style={{ position: "absolute", left: 1080 - 150, top: 430 - 150, width: 300, height: 300, borderRadius: "50%", border: "8px solid #ff5a5a", opacity: 1 - pulse, transform: `scale(${1 + pulse * 0.6})` }} />
      <ThoughtNoise words={NOISE.concat(["turn it down", "so loud", "...", "next door's TV", "dinner?", "homework"])} at={0} density={2.4} seed="hd" opacity={0.85} />
      <Label at={at("headache", "sounds.")} x={960} y={70} text="it's not sound" size={44} color="#ff9a9a" />
      <Grade tint="rgba(255,120,80,.15)" vignette={0.7} />
    </Cam>
  );
};

/* ===== NOCHE: silencio ===== */
export const Night: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("night");
  const tSil = at("night", "Silence.");
  const fade = 1 - prog(f, 0, at("night", "fade") + 30);
  return (
    <Cam dur={d} from={[1.1, 0, 0]} to={[1, 0, 0]}>
      <Bedroom night />
      <Stars n={40} h={300} />
      <Character x={1080} y={960} scale={1.05} expr={f > tSil ? "happy" : "focus"} mouth="smile" seed={140} />
      <AbsoluteFill style={{ opacity: fade }}>
        <ThoughtNoise words={NOISE} at={0} density={1} seed="nt" />
      </AbsoluteFill>
      {f > tSil && <Title at={tSil} x={W / 2} y={200} text="silence." size={110} color="#cfc4ff" rotate={0} />}
      <Grade tint="rgba(80,90,255,.2)" vignette={0.7} />
    </Cam>
  );
};

/* ===== ESTADIO ===== */
export const Stadium: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("stadium");
  const tScore = at("stadium", "scores,");
  const tLeave = at("stadium", "leave");
  const boom = f > tScore && f < tLeave + 30;
  const shake = boom ? Math.sin(f * 2.5) * 10 : 0;
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.1, 0, 0]}>
      <AbsoluteFill style={{ transform: `translate(${shake}px, ${shake * 0.5}px)` }}>
        <AbsoluteFill style={{ background: "linear-gradient(#0a0e2a,#1a2450 60%)" }} />
        {[200, 760, 1320, 1760].map((x) => (
          <div key={x} style={{ position: "absolute", left: x - 60, top: 40, width: 120, height: 50, background: "#fff6d8", boxShadow: "0 0 80px 30px rgba(255,246,216,.6)", borderRadius: 8 }} />
        ))}
        <Crowd rows={6} perRow={16} y0={300} dy={110} scale0={0.45} seed="st" bounce={boom ? 30 : 4} />
        {boom &&
          Array.from({ length: 30 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: random(`gx${i}`) * W, top: 200 + random(`gy${i}`) * 600, transform: `translate(-50%,-50%) rotate(${random(`gr${i}`) * 30 - 15}deg)`, fontFamily: FONT, fontWeight: 700, fontStyle: "italic", fontSize: 40 + random(`gs${i}`) * 40, color: "#bff8ff", opacity: 0.8 }}>
              GOAL!!
            </div>
          ))}
        <Character x={960} y={1100} scale={0.95} expr={boom ? "sad" : "focus"} mouth={boom ? "open" : "flat"} pose={boom ? { l: { s: 150, e: 30 }, r: { s: 150, e: 30 } } : "down"} seed={150} />
      </AbsoluteFill>
      <Label at={at("stadium", "Sixty")} x={960} y={110} text="60,000 minds" size={50} color="#ffd36b" />
      <Grade vignette={0.6} />
    </Cam>
  );
};
