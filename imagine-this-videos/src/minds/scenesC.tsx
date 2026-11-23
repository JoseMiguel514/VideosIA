import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { Character } from "../lib/Character";
import { InfoBg, NightCity, Room } from "../lib/envs";
import { Crowd, MindWaves, Speech, Thought, ThoughtNoise } from "../lib/minds";
import { Cam, Dust, FONT, Grade, H, INK, Label, pop, prog, Rays, Sky, Stars, Title, W } from "../lib/scene";
import { at, D } from "./timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ===== JUEGOS DE CARTAS ===== */
export const Games: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("games");
  const tNobody = at("games", "nobody");
  const leave = prog(f, tNobody, tNobody + 40);
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.08, 0, 0]}>
      <Room wall={["#2a4a3a", "#1a3a2a"]} floor={["#3a2a20", "#24160e"]} />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <ellipse cx={960} cy={800} rx={620} ry={90} fill="#1f7a4a" stroke={INK} strokeWidth={8} />
        {Array.from({ length: 5 }).map((_, i) => (
          <g key={i} transform={`translate(${780 + i * 70} 760) rotate(${-20 + i * 10})`}>
            <rect x={-34} y={-50} width={68} height={100} rx={8} fill="#fff" stroke={INK} strokeWidth={4} />
            <text x={0} y={12} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill={i % 2 ? "#e2453a" : INK}>
              {["A", "K", "Q", "J", "10"][i]}
            </text>
          </g>
        ))}
      </svg>
      <Character x={960} y={1060} scale={0.85} expr={f > tNobody ? "sad" : "smirk"} mouth="smile" seed={400} />
      {[0, 1].map((i) => (
        <Character key={i} x={(i ? 1500 : 420) + (i ? 1 : -1) * leave * 700} y={1020} scale={0.85} galaxy={false} head="#3b3f55" hoodie={i ? "#f2c14e" : "#6c8cff"} hair={i ? "bun" : "cap"} expr={f > tNobody ? "focus" : "sad"} mouth="frown" walk={leave > 0 && leave < 1 ? 1 : 0} flip={i === 0 ? leave > 0 : leave === 0} seed={401 + i} />
      ))}
      <Label at={at("games", "Not")} x={960} y={110} text="wins: 47 · losses: 0" size={44} color="#ffd36b" />
      <Grade vignette={0.55} />
    </Cam>
  );
};

/* ===== MAGO CALLEJERO ===== */
export const Magic: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("magic");
  const tCard = at("magic", "Pick");
  const tCrowd = at("magic", "crowd");
  const tStop = at("magic", "stealing,");
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.08, 0, 0]}>
      <NightCity seed="mg" />
      <div style={{ position: "absolute", left: 760, top: 0, width: 400, height: 1080, background: "linear-gradient(rgba(255,240,200,.25), rgba(255,240,200,.05))", clipPath: "polygon(40% 0, 60% 0, 100% 100%, 0 100%)" }} />
      {f > tCrowd && <Crowd rows={2} perRow={10} y0={760} dy={110} scale0={0.7} seed="mgc" bounce={f > tCrowd + 20 && f < tStop ? 14 : 0} />}
      <Character x={960} y={1000} scale={0.9} expr={f > tStop ? "sad" : "smirk"} mouth="smile" pose="raise" seed={410} />
      {f > tCard &&
        Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * Math.PI * 2 + f / 20;
          return (
            <div key={i} style={{ position: "absolute", left: 960 + Math.cos(a) * 220 - 30, top: 300 + Math.sin(a) * 70 - 42, width: 60, height: 84, background: "#fff", border: `4px solid ${INK}`, borderRadius: 8, fontFamily: FONT, fontWeight: 700, fontSize: 30, color: i % 2 ? "#e2453a" : INK, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {["♠", "♥", "♣", "♦", "★", "?"][i]}
            </div>
          );
        })}
      <Speech at={tCard} out={tCrowd + 20} x={1350} y={420} text="Pick a card, any card!" size={32} />
      {f > at("magic", "earn") && f < tStop + 20 && <div style={{ position: "absolute", left: 1500, top: 200, fontFamily: FONT, fontWeight: 700, fontSize: 80, color: "#3ee08a", WebkitTextStroke: `8px ${INK}`, paintOrder: "stroke fill" }}>$$$</div>}
      <Grade tint="rgba(90,110,220,.2)" vignette={0.65} />
    </Cam>
  );
};

/* ===== PENAL ===== */
export const Penalty: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("penalty");
  const tPlan = at("penalty", "plan");
  const tDive = at("penalty", "dive.");
  const tLift = at("penalty", "lifts");
  const ball = prog(f, tDive - 6, tDive + 10);
  const dive = prog(f, tDive - 4, tDive + 8);
  return (
    <Cam dur={d} from={[1.05, 0, 0]} to={[1, 0, 0]}>
      <Sky stops={["#7ac0ff", "#cfeaff"]} />
      <Crowd rows={2} perRow={14} y0={180} dy={90} scale0={0.5} seed="pn" bounce={f > tLift ? 18 : 3} />
      <div style={{ position: "absolute", left: 0, top: 420, width: W, height: 660, background: "linear-gradient(#5fc06a,#3a9a4a)" }} />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect x={460} y={360} width={1000} height={420} fill="none" stroke="#fff" strokeWidth={16} />
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1={460 + i * 90} y1={360} x2={460 + i * 90} y2={780} stroke="#fff" strokeOpacity={0.3} strokeWidth={3} />
        ))}
        <g transform={`translate(${960 - ball * 380} ${980 - ball * 240}) scale(${1 - ball * 0.4})`}>
          <circle r={40} fill="#fff" stroke={INK} strokeWidth={5} />
          <path d="M-14 -10 l14 -10 l14 10 l-6 16 h-16z" fill={INK} />
        </g>
      </svg>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${-dive * 160}px, ${-dive * 60}px) rotate(${-dive * 60}deg)`, transformOrigin: "960px 780px" }}>
        <Character x={960} y={780} scale={0.8} expr={f > tLift ? "happy" : "focus"} mouth={f > tLift ? "grin" : "flat"} pose={dive > 0.5 ? { l: { s: 170, e: 0 }, r: { s: 170, e: 0 } } : "hips"} hoodie="#ffd36b" seed={420} />
      </div>
      <Thought at={tPlan} out={tDive} x={1400} y={560} text="bottom left corner" size={36} color="#ff9ab6" tail="right" />
      {f > tDive + 8 && <Title at={tDive + 8} x={W / 2} y={220} text="SAVED!" size={120} color="#ffd36b" rotate={-4} />}
      <Label at={at("penalty", "guilty")} x={960} y={1000} text="...guilty for a week" size={40} color={INK} />
      <Grade vignette={0.35} />
    </Cam>
  );
};

/* ===== EL NIÑO PERDIDO ===== */
export const LostKid: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("lostkid");
  const tMom = at("lostkid", "Mom,");
  const tFind = at("lostkid", "find");
  const tHug = at("lostkid", "hugging");
  const pan = prog(f, at("lostkid", "follow"), tFind + 10);
  return (
    <AbsoluteFill>
      <Cam dur={d} from={[1, 0, 0]} to={[1.05, 0, 0]}>
        <AbsoluteFill style={{ transform: `translateX(${-pan * 900}px)` }}>
          <AbsoluteFill style={{ background: "linear-gradient(#f4f1ea,#d9d2c4)", width: W + 1000 }} />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: 60 + i * 470, top: 140, width: 420, height: 520, background: ["#ffd9e0", "#d9ecff", "#e0ffd9", "#fff0c8", "#e8d9ff", "#ffe2c8"][i], border: `6px solid ${INK}`, borderRadius: 10 }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: 70, background: ["#e2453a", "#6c8cff", "#3ee08a", "#f2c14e", "#8e5ad0", "#f39c12"][i], borderBottom: `6px solid ${INK}`, fontFamily: FONT, fontWeight: 700, fontSize: 34, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {["SHOES", "TOYS", "BOOKS", "SNACKS", "MUSIC", "COATS"][i]}
              </div>
            </div>
          ))}
          <div style={{ position: "absolute", left: 0, top: 780, width: W + 1000, height: 300, background: "#bfb6a6" }} />
          <div style={{ filter: "blur(2px)" }}>
            <Crowd rows={1} perRow={14} y0={830} dy={0} scale0={1.2} seed="ml" />
          </div>
          {/* niño escondido tras los abrigos */}
          <Character x={2520} y={760} scale={0.45} galaxy={false} head="#474b63" hoodie="#f2c14e" expr={f > tHug ? "happy" : "sad"} mouth={f > tHug ? "grin" : "frown"} seed={430} />
          <svg width={600} height={300} style={{ position: "absolute", left: 2340, top: 470 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <path key={i} d={`M${40 + i * 60} 10 q-30 80 0 220 h60 q20 -140 -10 -220z`} fill={["#6a4a30", "#3a4a6a", "#7a2a2a"][i % 3]} stroke={INK} strokeWidth={4} opacity={f > tHug ? 0.3 : 0.95} />
            ))}
          </svg>
          {f > tHug && <Character x={2700} y={780} scale={0.75} galaxy={false} head="#2b2d3a" hoodie="#16a085" hair="bun" expr="happy" mouth="open" pose="hold" flip seed={431} />}
          <Character x={760 + pan * 1500} y={1000} scale={0.85} expr={f > tHug ? "happy" : "focus"} mouth="flat" walk={pan > 0 && pan < 1 ? 1 : 0} seed={432} />
        </AbsoluteFill>
      </Cam>
      <Thought at={tMom} out={tHug} x={1500 - pan * 200} y={330} text="Mom, where are you? I'm scared." size={34} color="#ffd36b" tail="right" />
      <MindWaves x={1700 - pan * 300} y={600} color="#ffd36b" />
      <Grade vignette={0.4} />
    </AbsoluteFill>
  );
};

/* ===== EL DETECTIVE ===== */
const Interrogation: React.FC = () => (
  <>
    <AbsoluteFill style={{ background: "linear-gradient(#3a4250,#22262e)" }} />
    <div style={{ position: "absolute", left: 1250, top: 160, width: 560, height: 360, background: "linear-gradient(135deg,#2a3a4a,#141c24)", border: "14px solid #1a1a22" }} />
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      <line x1={960} y1={0} x2={960} y2={180} stroke="#111" strokeWidth={6} />
      <path d="M880 180 h160 l-30 50 h-100z" fill="#c9cdd2" stroke={INK} strokeWidth={5} />
      <path d="M900 230 L620 800 H1300 L1020 230Z" fill="#fff6c8" opacity={0.15} />
      <rect x={560} y={780} width={800} height={30} fill="#5a5a66" stroke={INK} strokeWidth={5} />
    </svg>
  </>
);
export const Detective: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("detective");
  const tSwear = at("detective", "innocent.");
  const tTruth = at("detective", "truth");
  return (
    <Cam dur={d} from={[1.08, 0, 0]} to={[1, 0, 0]}>
      <Interrogation />
      <Character x={1250} y={1000} scale={0.95} galaxy={false} head="#2b2d3a" hoodie="#7a7a8a" expr={f > tTruth ? "focus" : "sad"} mouth="frown" flip seed={440} />
      <Character x={420} y={1010} scale={0.9} galaxy={false} head="#3b3f55" hoodie="#3a3a4a" hair="messy" expr="deadpan" mouth="flat" pose="hips" seed={441} />
      <Character x={760} y={1060} scale={0.8} expr="focus" mouth="flat" look={[1, 0]} seed={442} />
      <Speech at={tSwear - 20} x={1250} y={330} text="I didn't do it!" size={36} />
      <Thought at={tTruth} x={1450} y={180} text="...they'll never find the bag." size={32} color="#ff5a7a" tail="right" />
      <Grade tint="rgba(80,100,160,.2)" vignette={0.7} />
    </Cam>
  );
};

/* ===== LA PRUEBA ===== */
export const Evidence: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("evidence");
  const tNot = at("evidence", "evidence.");
  const tProof = at("evidence", "proof.");
  const tilt = Math.sin(f / 20) * 6;
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.06, 0, 0]}>
      <InfoBg hue="#3a2a1a" />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <g transform="translate(960 560)">
          <rect x={-12} y={-260} width={24} height={460} fill="#c8962e" stroke={INK} strokeWidth={5} />
          <rect x={-120} y={190} width={240} height={30} rx={8} fill="#c8962e" stroke={INK} strokeWidth={5} />
          <g transform={`rotate(${tilt})`}>
            <rect x={-320} y={-270} width={640} height={16} rx={8} fill="#e0b050" stroke={INK} strokeWidth={4} />
            <line x1={-300} y1={-262} x2={-300} y2={-140} stroke={INK} strokeWidth={4} />
            <line x1={300} y1={-262} x2={300} y2={-140} stroke={INK} strokeWidth={4} />
            <path d="M-390 -140 h180 q-20 60 -90 60 q-70 0 -90 -60z" fill="#e0b050" stroke={INK} strokeWidth={4} />
            <path d="M210 -140 h180 q-20 60 -90 60 q-70 0 -90 -60z" fill="#e0b050" stroke={INK} strokeWidth={4} />
          </g>
        </g>
      </svg>
      {f > tNot && (
        <div style={{ position: "absolute", left: 300, top: 320, transform: `scale(${pop(f, tNot)}) rotate(${tilt}deg)`, fontFamily: FONT, fontWeight: 600, fontStyle: "italic", fontSize: 34, color: "#bff8ff", border: "4px dashed #7ff0ff", borderRadius: 30, padding: "10px 20px" }}>
          a thought 💭
        </div>
      )}
      {f > tNot + 20 && (
        <div style={{ position: "absolute", left: 1290, top: 320, transform: `scale(${pop(f, tNot + 20)}) rotate(${tilt}deg)`, fontFamily: FONT, fontWeight: 700, fontSize: 34, color: INK, background: "#fff", border: `4px solid ${INK}`, borderRadius: 10, padding: "10px 20px" }}>
          📁 facts anyone can check
        </div>
      )}
      <Title at={tProof} x={W / 2} y={140} text="JUSTICE NEEDS PROOF" size={80} color="#ffd36b" rotate={0} />
      <Grade vignette={0.65} />
    </Cam>
  );
};

/* ===== RUMORES ===== */
export const Rumor: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("rumor");
  const tR = at("rumor", "Rumors");
  const tCare = at("rumor", "carefully");
  const whispers = ["they know EVERYTHING", "don't think around them", "it's creepy", "I heard they read minds", "is it true??", "stay away"];
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.1, 0, 0]}>
      <Room wall={["#9ab0c8", "#7a90a8"]} floor={["#c9b89a", "#a9987a"]} />
      {Array.from({ length: 16 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 40 + i * 118, top: 300, width: 108, height: 560, background: i % 2 ? "#3a6ab0" : "#3462a6", border: `4px solid ${INK}` }} />
      ))}
      {[260, 520, 1400, 1660].map((x, i) => (
        <Character key={i} x={x} y={1020} scale={0.8} galaxy={false} head={["#2b2d3a", "#3b3f55", "#474b63", "#2b2d3a"][i]} hoodie={["#e2453a", "#ff7ab6", "#f2c14e", "#3ee08a"][i]} hair={(["cap", "bun", "messy", "none"] as const)[i]} expr="focus" mouth="frown" look={[i < 2 ? 1 : -1, 0]} flip={i > 1} seed={450 + i} />
      ))}
      <Character x={960} y={1060} scale={0.9} expr="sad" mouth="flat" seed={455} />
      {whispers.map((w, i) =>
        f > tR + i * 8 ? (
          <div key={i} style={{ position: "absolute", left: 200 + (i % 3) * 560, top: 180 + Math.floor(i / 3) * 110, transform: `scale(${pop(f, tR + i * 8)})`, fontFamily: FONT, fontWeight: 600, fontSize: 30, color: INK, background: "#fff", border: `4px solid ${INK}`, borderRadius: 22, padding: "8px 18px" }}>
            🤫 {w}
          </div>
        ) : null,
      )}
      {f > tCare && [260, 520, 1400, 1660].map((x, i) => <div key={i} style={{ position: "absolute", left: x - 26, top: 440, fontSize: 52, transform: `scale(${pop(f, tCare + i * 4)})` }}>🔒</div>)}
      <Grade vignette={0.5} />
    </Cam>
  );
};

/* ===== MIEDO / PRIVACIDAD ===== */
export const Fear: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("fear");
  const tLast = at("fear", "last");
  const tKnock = at("fear", "knocking.");
  const door = prog(f, tKnock - 20, tKnock + 10);
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.15, 0, 0]}>
      <InfoBg hue="#2a1a3a" />
      {/* cabeza gigante con una puerta */}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <circle cx={960} cy={520} r={330} fill="#2b2d3a" stroke={INK} strokeWidth={10} />
        <g transform="translate(960 560)">
          <rect x={-90} y={-150} width={180} height={280} rx={10} fill="#ffd36b" opacity={door} />
          <g transform={`translate(-90 -150) scale(${1 - door * 0.85} 1)`}>
            <rect x={0} y={0} width={180} height={280} rx={10} fill="#8a5a3a" stroke={INK} strokeWidth={6} />
            <circle cx={150} cy={150} r={10} fill="#ffd36b" />
          </g>
        </g>
        <ellipse cx={850} cy={420} rx={26} ry={34} fill="#fff" />
        <ellipse cx={1070} cy={420} rx={26} ry={34} fill="#fff" />
        <circle cx={850} cy={426} r={11} fill={INK} />
        <circle cx={1070} cy={426} r={11} fill={INK} />
      </svg>
      <Label at={tLast} x={960} y={150} text="the last private place" size={50} color="#ff9ab6" />
      <Character x={1560} y={1060} scale={0.75} expr="sad" mouth="flat" look={[-1, -0.3]} seed={460} />
      <Grade vignette={0.7} />
    </Cam>
  );
};

/* ===== TRES REGLAS ===== */
export const Rules3: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("rules3");
  const rules = [
    { t: at("rules3", "win."), text: "1. Never use it to win." },
    { t: at("rules3", "secret."), text: "2. Never repeat a secret." },
    { t: at("rules3", "help"), text: "3. Only listen to help." },
  ];
  return (
    <Cam dur={d} from={[1.05, 0, 0]} to={[1, 0, 0]}>
      <Room wall={["#3a3a6a", "#24244a"]} floor={["#2a2440", "#141024"]} />
      <div style={{ position: "absolute", left: 480, top: 120, width: 960, height: 760, background: "#fdf8e8", border: `8px solid ${INK}`, borderRadius: 10, transform: "rotate(-2deg)", backgroundImage: "repeating-linear-gradient(transparent 0 58px, #9ac 58px 61px)" }}>
        <div style={{ position: "absolute", left: 70, top: 0, width: 4, height: "100%", background: "#e2453a", opacity: 0.6 }} />
        <div style={{ position: "absolute", left: 110, top: 40, fontFamily: FONT, fontWeight: 700, fontSize: 56, color: INK }}>MY RULES</div>
        {rules.map((r, i) => {
          const n = Math.floor(interpolate(f, [r.t, r.t + 25], [0, r.text.length], clamp));
          return (
            <div key={i} style={{ position: "absolute", left: 110, top: 180 + i * 150, fontFamily: FONT, fontWeight: 600, fontSize: 52, color: "#2a3a8a" }}>
              {r.text.slice(0, n)}
            </div>
          );
        })}
      </div>
      <Character x={1660} y={1060} scale={0.8} expr="focus" mouth="flat" pose="hold" flip seed={470} />
      <Grade vignette={0.55} />
    </Cam>
  );
};

/* ===== EL CHICO CALLADO ===== */
export const Quiet: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("quiet");
  const tNob = at("quiet", "nobody");
  const tSit = at("quiet", "sit");
  const x = interpolate(f, [tSit - 10, tSit + 30], [1700, 1150], clamp);
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.08, 0, 0]}>
      <Room wall={["#e9dcc4", "#c9b8a0"]} floor={["#a99a84", "#8a7a64"]} window={{ x: 1200, y: 120, w: 520, h: 360, sky: ["#bfe6ff", "#e8f6ff"] }} />
      <div style={{ filter: "blur(4px)" }}>
        <Crowd rows={1} perRow={7} y0={640} dy={0} scale0={0.8} seed="cf" />
      </div>
      <div style={{ position: "absolute", left: 640, top: 800, width: 780, height: 30, background: "#8a5a3a", border: `5px solid ${INK}` }} />
      <Character x={900} y={1000} scale={0.9} galaxy={false} head="#474b63" hoodie="#7a8a9a" expr={f > tSit + 30 ? "neutral" : "sad"} mouth={f > tSit + 30 ? "smile" : "flat"} seed={480} />
      <Character x={x} y={1000} scale={0.9} expr="happy" mouth="smile" walk={f > tSit - 10 && f < tSit + 30 ? 1 : 0} flip seed={481} />
      <Thought at={tNob} out={tSit + 30} x={900} y={320} text="nobody would even notice if I wasn't here." size={32} maxW={460} color="#9aa0c8" />
      <Speech at={tSit + 30} x={x} y={330} text="Mind if I sit here?" size={34} />
      <Grade tint="rgba(255,230,180,.12)" vignette={0.45} />
    </Cam>
  );
};

/* ===== BATALLAS SILENCIOSAS ===== */
export const Battles: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("battles");
  const people = [
    { t: at("battles", "bully"), x: 330, h: "#e2453a", text: "scared to go home", hair: "cap" as const },
    { t: at("battles", "popular"), x: 800, h: "#ff7ab6", text: "I feel like a fraud", hair: "bun" as const },
    { t: at("battles", "teacher"), x: 1270, h: "#5a5a6a", text: "can't sleep again", hair: "messy" as const },
  ];
  const tConf = at("battles", "confident");
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.05, 0, 0]}>
      <InfoBg hue="#1e2a4a" />
      {people.map((p, i) => (
        <React.Fragment key={i}>
          <Character x={p.x} y={1000} scale={0.85} galaxy={false} head="#3b3f55" hoodie={p.h} hair={p.hair} expr={f > p.t ? "sad" : "happy"} mouth={f > p.t ? "flat" : "grin"} seed={490 + i} />
          {f > p.t && (
            <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
              <g transform={`translate(${p.x} 380)`} opacity={pop(f, p.t)}>
                <ellipse cx={-40} cy={0} rx={70} ry={45} fill="#3a3a4a" />
                <ellipse cx={30} cy={-10} rx={80} ry={55} fill="#45455a" />
                <ellipse cx={0} cy={20} rx={90} ry={40} fill="#3a3a4a" />
                {[0, 1, 2].map((k) => (
                  <line key={k} x1={-40 + k * 40} y1={50 + ((f * 6 + k * 20) % 60)} x2={-46 + k * 40} y2={70 + ((f * 6 + k * 20) % 60)} stroke="#7ab0ff" strokeWidth={4} />
                ))}
              </g>
            </svg>
          )}
          <Thought at={p.t + 10} x={p.x} y={300} text={p.text} size={28} color="#9aa0c8" tail="none" />
        </React.Fragment>
      ))}
      <Character x={1700} y={1040} scale={0.8} expr="sad" mouth="flat" look={[-1, 0]} seed={495} />
      <Label at={tConf} x={960} y={90} text="nobody is as confident as they look" size={42} color="#ffd36b" />
      <Grade vignette={0.6} />
    </Cam>
  );
};

/* ===== RECONCILIACIÓN CON EL AMIGO ===== */
export const FriendFix: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("friendfix");
  const tAsk = at("friendfix", "ask");
  const tTells = at("friendfix", "tells");
  const tQuiet = at("friendfix", "quieter.");
  return (
    <Cam dur={d} from={[1.05, 0, 0]} to={[1, 0, 0]}>
      <Sky stops={["#f2a07a", "#d8707a 50%", "#6a4a8a"]} sun={{ x: 960, y: 700, r: 80, color: "#ffe0b0" }} />
      <div style={{ position: "absolute", left: 0, top: 780, width: W, height: 300, background: "linear-gradient(#5a8a5a,#2a4a3a)" }} />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect x={620} y={860} width={680} height={24} rx={8} fill="#8a5a3a" stroke={INK} strokeWidth={5} />
        <rect x={660} y={884} width={20} height={100} fill="#6a4028" />
        <rect x={1240} y={884} width={20} height={100} fill="#6a4028" />
      </svg>
      <Character x={760} y={1000} scale={0.9} expr="neutral" mouth="smile" pose="explain" talking={f > tAsk && f < tTells} seed={500} />
      <Character x={1180} y={1000} scale={0.9} galaxy={false} head="#2b2d3a" hoodie="#6c8cff" hair="cap" expr={f > tQuiet ? "happy" : "sad"} mouth={f > tQuiet ? "smile" : "flat"} talking={f > tTells && f < tQuiet} flip seed={501} />
      <Speech at={tAsk} out={tTells} x={760} y={340} text="How are you really doing?" size={32} />
      <Thought at={at("friendfix", "jealous")} x={1180} y={300} text={<span style={{ fontSize: Math.max(14, 32 - (f - tQuiet) * 0.4) }}>why always you...</span>} size={32} color="#ff9ab6" tail="right" />
      <Grade tint="rgba(255,170,140,.2)" vignette={0.5} />
    </Cam>
  );
};

/* ===== EL QUE AYUDA ===== */
export const Helper: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("helper");
  const quotes = ["You did great today.", "It's okay to ask for help.", "I'm proud of you.", "That wasn't your fault."];
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.06, 0, 0]}>
      <Sky stops={["#bfe6ff", "#fff4d6"]} />
      <div style={{ position: "absolute", left: 0, top: 820, width: W, height: 260, background: "linear-gradient(#9ee09a,#5fb86a)" }} />
      {[300, 760, 1240, 1680].map((x, i) => (
        <Character key={i} x={x} y={1000} scale={0.72} galaxy={false} head={["#2b2d3a", "#3b3f55", "#474b63", "#2b2d3a"][i]} hoodie={["#e2453a", "#f2c14e", "#8e5ad0", "#16a085"][i]} hair={(["bun", "cap", "none", "messy"] as const)[i]} expr={f > 20 + i * 30 ? "happy" : "sad"} mouth="smile" seed={510 + i} />
      ))}
      <Character x={[300, 760, 1240, 1680][Math.min(3, Math.floor(f / 30))] - 170} y={1020} scale={0.75} expr="happy" mouth="smile" pose="explain" seed={515} />
      {quotes.map((q, i) => (
        <Speech key={i} at={10 + i * 30} out={10 + i * 30 + 28} x={[300, 760, 1240, 1680][i] + 150} y={420} text={q} size={30} />
      ))}
      <Label at={at("helper", "need")} x={960} y={110} text="the right words at the right time" size={42} color={INK} />
      <Grade vignette={0.35} />
    </Cam>
  );
};

/* ===== LA FAMILIA ===== */
export const Family: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("family");
  const tKnew = at("family", "knew");
  return (
    <Cam dur={d} from={[1.05, 0, 0]} to={[1, 0, 0]}>
      <Room wall={["#e9b07a", "#c98a5a"]} floor={["#7a4a30", "#5a3420"]} window={{ x: 1400, y: 140, w: 380, h: 340, sky: ["#2a2a5a", "#5a4a8a"], city: "#2a2450", lights: "#ffd59a" }} />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect x={280} y={680} width={700} height={140} rx={30} fill="#7a3a3a" stroke={INK} strokeWidth={6} />
        <rect x={260} y={620} width={740} height={80} rx={30} fill="#8a4a4a" stroke={INK} strokeWidth={6} />
      </svg>
      <Character x={480} y={1000} scale={0.9} galaxy={false} head="#2b2d3a" hoodie="#e2453a" hair="bun" expr={f > tKnew ? "happy" : "focus"} mouth={f > tKnew ? "grin" : "flat"} seed={520} />
      <Character x={800} y={1000} scale={0.62} galaxy={false} head="#3b3f55" hoodie="#f2c14e" hair="cap" expr="wide" mouth="o" seed={521} />
      <Character x={1300} y={1000} scale={0.9} expr="sad" mouth="smile" pose="explain" talking={f < tKnew} flip seed={522} />
      <Speech at={tKnew} x={480} y={330} text="I knew it." size={44} />
      <Thought at={at("family", "first")} x={760} y={200} text="good morning... he looks so tired" size={26} color="#cfc4ff" tail="none" />
      <Grade tint="rgba(255,190,120,.2)" vignette={0.5} />
    </Cam>
  );
};

/* ===== EL SECRETO COMPARTIDO ===== */
export const Secret: React.FC = () => {
  const d = D("secret");
  const tQ = at("secret", "what");
  const tProud = at("secret", "proud");
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.15, 0, 20]}>
      <Room wall={["#c98a5a", "#a96a3a"]} floor={["#5a3420", "#3a2010"]} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(255,220,150,.35), transparent 60%)" }} />
      <Character x={720} y={1000} scale={1} galaxy={false} head="#2b2d3a" hoodie="#e2453a" hair="bun" expr="happy" mouth="smile" seed={530} />
      <Character x={1200} y={1000} scale={1} expr="happy" mouth="grin" flip seed={531} />
      <Speech at={tQ} out={tProud} x={720} y={320} text="What am I thinking right now?" size={32} />
      <Thought at={tProud} x={720} y={300} text="I'm proud of you." size={50} color="#ffd36b" />
      <Dust n={30} color="#ffe2a8" seed="sc" />
      <Grade tint="rgba(255,190,120,.25)" vignette={0.5} />
    </Cam>
  );
};

/* ===== EL OCÉANO DE PENSAMIENTOS ===== */
export const Waves: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("waves");
  return (
    <Cam dur={d} from={[1.1, 0, 40]} to={[1, 0, 0]}>
      <Sky stops={["#3a2a6a", "#d8607a 55%", "#ffb86a"]} sun={{ x: 960, y: 560, r: 100, color: "#ffe0a0" }} />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect x={0} y={600} width={W} height={480} fill="#2a3a6a" />
        {Array.from({ length: 9 }).map((_, r) =>
          Array.from({ length: 26 }).map((_, i) => {
            const x = (i * 80 + f * (1 + r * 0.3)) % (W + 80) - 40;
            const y = 620 + r * 50 + Math.sin(f / 15 + i + r) * 8;
            return <circle key={`${r}-${i}`} cx={x} cy={y} r={4 + r * 1.2} fill="none" stroke={["#7ff0ff", "#ffd36b", "#ff9ab6"][(i + r) % 3]} strokeWidth={2} opacity={0.5} strokeDasharray="4 3" />;
          }),
        )}
        <path d="M0 900 q480 -60 960 0 t960 0 V1080 H0z" fill="#e8c99a" />
      </svg>
      <Character x={960} y={980} scale={0.85} expr="happy" mouth="smile" look={[0, -0.3]} seed={540} />
      <Label at={at("waves", "ocean.")} x={960} y={110} text="an ocean of thoughts" size={46} color="#fff" />
      <Grade tint="rgba(255,150,120,.2)" vignette={0.5} />
    </Cam>
  );
};

/* ===== CARRERA: CONSEJERO ===== */
export const Career: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("career");
  const tSay = at("career", "understand");
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.08, 0, 0]}>
      <Room wall={["#cfe0d4", "#a9c2b0"]} floor={["#8a7a64", "#6a5a44"]} window={{ x: 760, y: 130, w: 400, h: 340, sky: ["#bfe6ff", "#e8f6ff"] }} />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect x={1580} y={620} width={140} height={200} rx={20} fill="#6a8a5a" stroke={INK} strokeWidth={5} />
        <path d="M1650 620 q-60 -100 0 -200 q60 100 0 200z" fill="#4a9a4a" stroke={INK} strokeWidth={5} />
        <rect x={300} y={720} width={300} height={160} rx={30} fill="#5a6a9a" stroke={INK} strokeWidth={5} />
        <rect x={1220} y={720} width={300} height={160} rx={30} fill="#9a5a6a" stroke={INK} strokeWidth={5} />
      </svg>
      <Character x={450} y={1000} scale={0.9} expr="happy" mouth="smile" pose="hold" seed={550} />
      <Character x={1370} y={1000} scale={0.9} galaxy={false} head="#3b3f55" hoodie="#ff7ab6" hair="bun" expr={f > tSay ? "happy" : "sad"} mouth="smile" talking={f > tSay - 20 && f < tSay + 40} flip seed={551} />
      <Speech at={tSay} x={1370} y={330} text="You understand me better than anyone." size={32} />
      <Label at={at("career", "counselor.")} x={960} y={60} text="counselor" size={46} color={INK} />
      <Grade tint="rgba(255,240,200,.15)" vignette={0.4} />
    </Cam>
  );
};

/* ===== LA LECCIÓN ===== */
export const Lesson: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("lesson");
  const tListen = at("lesson", "Listening");
  const tNotice = at("lesson", "notice");
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.1, 0, 0]}>
      <InfoBg hue="#2a3a6a" />
      <Character x={960} y={1000} scale={0.9} expr="happy" mouth="smile" glow={0.4} seed={560} />
      {f > tNotice &&
        Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return <div key={i} style={{ position: "absolute", left: 960 + Math.cos(a) * 600 - 30, top: 560 + Math.sin(a) * 300 - 30, fontSize: 50, transform: `scale(${pop(f, tNotice + i * 3)})` }}>🙂</div>;
        })}
      <Title at={tListen} x={W / 2} y={160} text="LISTENING DID." size={100} color="#7ff0ff" rotate={0} />
      <Grade vignette={0.6} />
    </Cam>
  );
};

/* ===== FINAL ===== */
export const Ending: React.FC = () => {
  const d = D("ending");
  const tAtt = at("ending", "attention.");
  return (
    <Cam dur={d} from={[1.2, 0, 60]} to={[1, 0, 0]}>
      <Sky stops={["#0a0a24", "#2a1a4a 55%", "#d8607a"]} />
      <Stars n={150} h={700} />
      <div style={{ position: "absolute", left: 0, top: 880, width: W, height: 200, background: "#140e24" }} />
      {[480, 720, 1200, 1440].map((x, i) => (
        <Character key={i} x={x} y={980} scale={0.8} galaxy={false} head="#2b2d3a" hoodie={["#f2c14e", "#e2453a", "#6c8cff", "#3ee08a"][i]} hair={(["bun", "cap", "none", "messy"] as const)[i]} expr="happy" mouth="smile" look={[i < 2 ? 1 : -1, -0.3]} flip={i > 1} seed={570 + i} />
      ))}
      <Character x={960} y={980} scale={0.85} expr="happy" mouth="grin" look={[0, -0.6]} glow={0.5} seed={575} />
      <Title at={tAtt} x={W / 2} y={200} text="PAY ATTENTION" size={100} color="#ffd36b" rotate={0} />
      <Label at={at("ending", "anyone")} x={960} y={330} text="anyone can learn it" size={44} />
      <Grade tint="rgba(150,100,255,.2)" vignette={0.6} />
    </Cam>
  );
};

/* ===== CIERRE ===== */
export const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("outro");
  const tKeep = at("outro", "keep");
  const tOff = at("outro", "off");
  const tSub = at("outro", "subscribe,");
  const tImg = at("outro", "imagine");
  const on = f < tOff + 10;
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.05, 0, 0]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#5b1d8c,#d8367a 55%,#ff8a3d 85%,#ffd36b)" }} />
      <Rays x={560} y={620} color="#ffffff" opacity={0.07} />
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.12) 3px, transparent 3px)", backgroundSize: "28px 28px" }} />
      <div style={{ position: "absolute", left: -300, top: 920, width: 1800, height: 700, borderRadius: "50%", background: "#3a165c", border: `10px solid ${INK}` }} />
      <Character x={560} y={1000} scale={1.05} expr="focus" mouth="smile" pose="chin" glow={on ? 0.5 : 0} seed={580} />
      {on && <MindWaves x={560} y={460} n={3} />}
      <div style={{ position: "absolute", left: 1000, top: 200, width: 840, fontFamily: FONT, fontWeight: 700, fontSize: 84, lineHeight: 1.05, color: "#fff", WebkitTextStroke: `10px ${INK}`, paintOrder: "stroke fill", textShadow: `0 8px 0 ${INK}`, opacity: prog(f, 4, 16) }}>
        Would you <span style={{ color: "#7ff0ff" }}>keep it</span>... or turn it <span style={{ color: "#ff5a7a" }}>off</span>?
      </div>
      {f > tKeep && (
        <div style={{ position: "absolute", left: 1000, top: 520, transform: `scale(${pop(f, tKeep)})`, transformOrigin: "left center", width: 260, height: 120, borderRadius: 60, background: on ? "#3ee08a" : "#8a8a9a", border: `6px solid ${INK}` }}>
          <div style={{ position: "absolute", left: on ? 146 : 10, top: 10, width: 88, height: 88, borderRadius: "50%", background: "#fff", border: `5px solid ${INK}` }} />
        </div>
      )}
      {f > tSub && (
        <div style={{ position: "absolute", left: 1000, top: 720, transform: `scale(${pop(f, tSub)})`, transformOrigin: "left center", fontFamily: FONT, fontWeight: 700, fontSize: 52, color: "#fff", background: "#e62117", padding: "14px 44px", borderRadius: 16, border: `6px solid ${INK}`, boxShadow: `0 8px 0 ${INK}` }}>
          SUBSCRIBE 🔔
        </div>
      )}
      <Title at={tImg} x={1420} y={960} text="IMAGINE THIS" size={80} color="#ffd36b" rotate={0} />
      <Dust n={30} color="#fff" seed="ou2" />
    </Cam>
  );
};

export const _unused = { ThoughtNoise, random, H };
