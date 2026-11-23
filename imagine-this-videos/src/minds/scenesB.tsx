import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Character } from "../lib/Character";
import { InfoBg, Room } from "../lib/envs";
import { Crowd, Phone, Speech, Thought, ThoughtNoise } from "../lib/minds";
import { Cam, City, Dust, FONT, Grade, H, INK, Label, pop, prog, Rays, Sky, Title, W } from "../lib/scene";
import { at, D } from "./timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ===== EFECTO CÓCTEL ===== */
export const Cocktail: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("cocktail");
  const tOne = at("cocktail", "single");
  const focus = prog(f, tOne, tOne + 20);
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.1, 0, 0]}>
      <Room wall={["#4a2a5a", "#2a1a3a"]} floor={["#2a1a22", "#140a10"]} />
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 100 + i * 190, top: 90 + Math.sin(i) * 20, width: 24, height: 24, borderRadius: "50%", background: ["#ffd59a", "#ff9ab6", "#7ff0ff"][i % 3], boxShadow: "0 0 30px currentColor", color: ["#ffd59a", "#ff9ab6", "#7ff0ff"][i % 3] }} />
      ))}
      <AbsoluteFill style={{ filter: `blur(${focus * 5}px)`, opacity: 1 - focus * 0.5 }}>
        <Crowd rows={2} perRow={8} y0={620} dy={170} scale0={1} seed="ck" />
        <ThoughtNoise words={["blah blah", "haha!", "...and then she said", "great party", "who's that?", "more snacks"]} at={0} density={1.5} seed="ckn" />
      </AbsoluteFill>
      <Character x={1300} y={1000} scale={0.9} galaxy={false} head="#3b3f55" hoodie="#ffd36b" hair="bun" expr="happy" mouth="smile" talking seed={200} />
      <Character x={760} y={1000} scale={0.9} expr="focus" mouth="flat" look={[1, 0]} seed={201} />
      {focus > 0.5 && <div style={{ position: "absolute", left: 1300 - 160, top: 380, width: 320, height: 660, borderRadius: 160, border: "5px solid #7ff0ff", boxShadow: "0 0 40px #7ff0ff" }} />}
      <Title at={at("cocktail", "cocktail")} x={W / 2} y={150} text="THE COCKTAIL PARTY EFFECT" size={74} color="#7ff0ff" rotate={0} />
      <Grade vignette={0.55} />
    </Cam>
  );
};

/* ===== ENTRENAMIENTO EN EL PARQUE ===== */
const Park: React.FC<{ d: number }> = () => (
  <>
    <Sky stops={["#9fd8ff", "#d8f0ff 60%", "#fff4d6"]} sun={{ x: 1650, y: 180, r: 60, color: "#fff3c2" }} />
    <div style={{ position: "absolute", inset: 0, filter: "blur(4px)" }}>
      <City base={700} color="#b5d0e0" seed="pk" h={[160, 360]} />
    </div>
    <div style={{ position: "absolute", left: 0, top: 700, width: W, height: 380, background: "linear-gradient(#8fd88a,#5fb86a)" }} />
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      {[140, 520, 1500, 1800].map((x, i) => (
        <g key={x}>
          <rect x={x - 14} y={560} width={28} height={160} fill="#6a4a30" />
          <circle cx={x} cy={520} r={90 + (i % 2) * 20} fill="#4a9a4a" stroke={INK} strokeWidth={5} />
        </g>
      ))}
    </svg>
  </>
);
export const Training: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("training");
  const targets = [
    { t: at("training", "pigeons."), x: 420, text: "one more piece..." },
    { t: at("training", "jogging."), x: 960, text: "two more kilometers" },
    { t: at("training", "kite."), x: 1480, text: "HIGHER!" },
  ];
  const cur = [...targets].reverse().find((t) => f > t.t);
  const tImp = at("training", "impossible.");
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.06, 0, 0]}>
      <Park d={d} />
      <Character x={420} y={980} scale={0.75} galaxy={false} head="#3b3f55" hoodie="#8e5ad0" hair="bun" expr="happy" mouth="smile" pose="hold" seed={210} />
      <Character x={960 + Math.sin(f / 30) * 80} y={960} scale={0.75} galaxy={false} head="#2b2d3a" hoodie="#e2453a" hair="cap" expr="focus" mouth="flat" walk={1.2} flip={Math.cos(f / 30) < 0} seed={211} />
      <Character x={1480} y={980} scale={0.6} galaxy={false} head="#474b63" hoodie="#f2c14e" expr="happy" mouth="grin" pose="raise" seed={212} />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={1530} y1={640} x2={1700 + Math.sin(f / 20) * 30} y2={260} stroke="#fff" strokeWidth={2} />
        <path d={`M${1700 + Math.sin(f / 20) * 30} 200 l50 60 l-50 60 l-50 -60z`} fill="#ff5a7a" stroke={INK} strokeWidth={4} />
        {Array.from({ length: 5 }).map((_, i) => (
          <ellipse key={i} cx={300 + i * 40} cy={990 + (i % 2) * 6} rx={16} ry={11} fill="#9aa0a8" stroke={INK} strokeWidth={3} />
        ))}
      </svg>
      {cur && <Thought at={cur.t} x={cur.x} y={430} text={cur.text} size={34} />}
      {cur && <div style={{ position: "absolute", left: cur.x - 150, top: 420, width: 300, height: 600, borderRadius: 150, border: "4px dashed #7ff0ff" }} />}
      <Character x={240} y={1080} scale={0.7} expr={f > tImp ? "sad" : "focus"} mouth="flat" look={[1, -0.2]} seed={213} />
      <Grade vignette={0.35} />
    </Cam>
  );
};

/* ===== RESPIRACIÓN ===== */
export const Breathing: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("breathing");
  const tSlow = at("breathing", "breathing,");
  const tIn = at("breathing", "In");
  const br = f > tSlow ? 0.5 + 0.5 * Math.sin((f - tSlow) / 22) : 0;
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.05, 0, 0]}>
      <InfoBg hue={f > tSlow ? "#1e4a5a" : "#5a1e2a"} />
      <div style={{ position: "absolute", left: 960 - 260, top: 400 - 260, width: 520, height: 520, borderRadius: "50%", border: "6px solid #7ff0ff", transform: `scale(${0.6 + br * 0.5})`, opacity: f > tSlow ? 0.8 : 0, boxShadow: "0 0 60px rgba(127,240,255,.4)" }} />
      <AbsoluteFill style={{ opacity: 1 - prog(f, tSlow, tSlow + 40) }}>
        <ThoughtNoise words={["LOUD", "TOO MUCH", "STOP", "panic", "everyone", "noise"]} at={0} density={2.5} seed="br" opacity={1} />
      </AbsoluteFill>
      <Character x={960} y={1000} scale={0.95} expr={f > tSlow ? "happy" : "wide"} mouth={f > tSlow ? "smile" : "open"} seed={220} />
      {f > tIn && (
        <div style={{ position: "absolute", left: 960, top: 120, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 700, fontSize: 70, color: "#bff8ff" }}>{br > 0.5 ? "in..." : "out..."}</div>
      )}
      <Label at={at("breathing", "Calm")} x={960} y={220} text="calm mind · quiet world" size={40} color="#7ff0ff" />
      <Grade vignette={0.6} />
    </Cam>
  );
};

/* ===== EL DIAL ===== */
export const Dial: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("dial");
  const tDial = at("dial", "dial");
  const vol = interpolate(f, [tDial, at("dial", "months,")], [1, 0.15], clamp);
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.05, 0, 0]}>
      <Park d={d} />
      <AbsoluteFill style={{ filter: `blur(${(1 - vol) * 4}px)` }}>
        <Crowd rows={1} perRow={9} y0={800} dy={0} scale0={0.9} seed="dl" />
        <AbsoluteFill style={{ opacity: vol }}>
          <ThoughtNoise words={["chatter", "blah", "la la", "hmm", "ugh", "okay"]} at={0} density={1.5} seed="dln" />
        </AbsoluteFill>
      </AbsoluteFill>
      {/* perilla */}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <g transform="translate(1500 380)">
          <circle r={170} fill="#1a1a2a" stroke={INK} strokeWidth={8} />
          {Array.from({ length: 11 }).map((_, i) => {
            const a = (-135 + i * 27) * (Math.PI / 180);
            return <line key={i} x1={Math.sin(a) * 140} y1={-Math.cos(a) * 140} x2={Math.sin(a) * 160} y2={-Math.cos(a) * 160} stroke={i / 10 <= vol ? "#7ff0ff" : "#3a3a5a"} strokeWidth={8} strokeLinecap="round" />;
          })}
          <g transform={`rotate(${-135 + vol * 270})`}>
            <circle r={110} fill="#2a2a40" stroke="#7ff0ff" strokeWidth={4} />
            <line x1={0} y1={0} x2={0} y2={-90} stroke="#ffd36b" strokeWidth={12} strokeLinecap="round" />
          </g>
        </g>
        <text x={1500} y={620} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#fff">
          MIND VOLUME
        </text>
      </svg>
      <Character x={600} y={1060} scale={0.9} expr={vol < 0.5 ? "happy" : "focus"} mouth="smile" seed={230} />
      <Label at={at("dial", "months,")} x={600} y={300} text="2 months later" size={40} color={INK} />
      <Grade vignette={0.4} />
    </Cam>
  );
};

/* ===== EL TELÉFONO ===== */
export const Texting: React.FC = () => {
  const d = D("texting");
  const t0 = at("texting", "phone.");
  return (
    <Cam dur={d} from={[1.05, 0, 0]} to={[1, 0, 0]}>
      <Room wall={["#3a3a6a", "#24244a"]} floor={["#2a2440", "#141024"]} />
      <Phone
        x={1100}
        y={140}
        msgs={[
          { t: t0, text: "hey, you up?" },
          { t: t0 + 25, me: true, text: "yep 😊" },
          { t: t0 + 50, text: "wanna get pizza tomorrow?" },
          { t: t0 + 75, me: true, text: "YES" },
        ]}
      />
      <Character x={600} y={1000} scale={1} expr="happy" mouth="smile" pose="hold" look={[1, 0.2]} seed={240} />
      <Label at={at("texting", "thoughts")} x={600} y={300} text="no thoughts, just words" size={40} color="#bff8ff" />
      <Grade vignette={0.55} />
    </Cam>
  );
};

/* ===== EL AMIGO ===== */
export const Friend: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("friend");
  const tWow = at("friend", "amazing,");
  const tDumb = at("friend", "dumb.");
  const tWhy = at("friend", "why");
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.1, 0, 0]}>
      <Room wall={["#5a6a8a", "#3a4a6a"]} floor={["#3a2a30", "#221418"]} window={{ x: 800, y: 130, w: 420, h: 340, sky: ["#ffb88a", "#f08a7a"], city: "#a06a7a" }} />
      <div style={{ position: "absolute", left: 820, top: 560, width: 300, height: 220, background: "#f4f1ea", border: `6px solid ${INK}`, borderRadius: 10, fontFamily: FONT, fontSize: 30, fontWeight: 700, color: INK, padding: 20, boxSizing: "border-box" }}>
        MY IDEA 💡
        <div style={{ fontSize: 22, fontWeight: 500, marginTop: 10 }}>an app that...</div>
      </div>
      <Character x={460} y={1000} scale={1} galaxy={false} head="#2b2d3a" hoodie="#6c8cff" hair="cap" expr="happy" mouth="grin" pose="explain" seed={250} />
      <Character x={1450} y={1000} scale={1} expr={f > tDumb ? "sad" : "happy"} mouth={f > tDumb ? "flat" : "smile"} flip seed={251} />
      <Speech at={tWow} x={460} y={320} text="Wow, that's amazing!" />
      <Thought at={tDumb} x={620} y={230} text="that's kind of dumb..." size={32} />
      <Thought at={tWhy} x={420} y={140} text="why does everything always work out for you?" size={30} maxW={480} color="#ff9ab6" />
      <Grade vignette={0.5} />
    </Cam>
  );
};

/* ===== LOS PADRES ===== */
export const Parents: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("parents");
  const tNum = at("parents", "numbers.");
  const items = [
    { t: at("parents", "Rent."), text: "Rent 🏠" },
    { t: at("parents", "Bills."), text: "Bills 🧾" },
    { t: at("parents", "car"), text: "Car repair 🔧" },
  ];
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.08, 0, 0]}>
      <Room wall={["#e9b07a", "#c98a5a"]} floor={["#7a4a30", "#5a3420"]} />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={960} y1={0} x2={960} y2={150} stroke={INK} strokeWidth={6} />
        <path d="M880 150 h160 l-30 60 h-100z" fill="#ffd36b" stroke={INK} strokeWidth={5} />
        <rect x={360} y={760} width={1200} height={36} rx={10} fill="#8a5a3a" stroke={INK} strokeWidth={6} />
      </svg>
      <Character x={520} y={1000} scale={0.95} galaxy={false} head="#2b2d3a" hoodie="#e2453a" hair="bun" expr="happy" mouth="grin" seed={260} />
      <Character x={1400} y={1000} scale={0.95} galaxy={false} head="#3b3f55" hoodie="#16a085" hair="messy" expr="happy" mouth="grin" flip seed={261} />
      <Character x={960} y={1060} scale={0.75} expr={f > tNum ? "sad" : "happy"} mouth={f > tNum ? "flat" : "smile"} seed={262} />
      <Speech at={4} out={tNum} x={960} y={330} text="HAHAHA" size={40} />
      {items.map((it, i) => (
        <Thought key={i} at={it.t} x={i === 1 ? 1400 : 520} y={i === 2 ? 250 : 400} text={it.text} size={34} color="#ffd36b" />
      ))}
      <Label at={at("parents", "months,")} x={960} y={110} text="worried for months" size={40} color={INK} />
      <Grade tint="rgba(255,190,120,.2)" vignette={0.5} />
    </Cam>
  );
};

/* ===== MENTIRAS PIADOSAS ===== */
export const Lies: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("lies");
  const tStudy = at("lies", "diary");
  const items = [
    { t: at("lies", "gift."), text: '"I love the gift!"' },
    { t: at("lies", "fine."), text: '"I\'m fine."' },
    { t: at("lies", "wake"), text: '"No, you didn\'t wake me up."' },
  ];
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.06, 0, 0]}>
      <InfoBg hue="#3a2a5a" />
      {f > tStudy && (
        <div style={{ position: "absolute", left: 960, top: 140, transform: `translateX(-50%) scale(${pop(f, tStudy)})`, textAlign: "center", fontFamily: FONT, fontWeight: 700, color: "#fff" }}>
          <div style={{ fontSize: 150, color: "#ffd36b" }}>1–2</div>
          <div style={{ fontSize: 48 }}>little lies per day (average)</div>
        </div>
      )}
      {items.map((it, i) =>
        f > it.t ? (
          <div key={i} style={{ position: "absolute", left: [380, 960, 1540][i], top: 620, transform: `translate(-50%,0) scale(${pop(f, it.t)})`, fontFamily: FONT, fontWeight: 700, fontSize: 36, color: INK, background: "#fff", border: `5px solid ${INK}`, borderRadius: 20, padding: "14px 24px", whiteSpace: "nowrap" }}>
            {it.text} <span style={{ color: "#e2453a" }}>🤥</span>
          </div>
        ) : null,
      )}
      <Character x={960} y={1120} scale={0.55} expr="smirk" mouth="smile" seed={270} />
      <Label at={tStudy} x={960} y={60} text="diary study · 1996" size={36} color="#cfc4ff" />
      <Grade vignette={0.6} />
    </Cam>
  );
};

/* ===== AMABLES ===== */
export const Gentle: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("gentle");
  const tFeel = at("gentle", "feelings.");
  return (
    <Cam dur={d} from={[1.05, 0, 0]} to={[1, 0, 0]}>
      <Sky stops={["#ffcf8a", "#f29e6b 60%", "#d77a8a"]} sun={{ x: 960, y: 640, r: 90, color: "#fff0c8" }} />
      <Rays x={960} y={640} opacity={0.1} color="#fff6d8" />
      <div style={{ position: "absolute", left: 0, top: 820, width: W, height: 260, background: "linear-gradient(#a86a5a,#6a3a3a)" }} />
      <Character x={720} y={1000} scale={0.9} galaxy={false} head="#2b2d3a" hoodie="#ff7ab6" hair="bun" expr="happy" mouth="smile" pose="explain" seed={280} />
      <Character x={1200} y={1000} scale={0.9} galaxy={false} head="#3b3f55" hoodie="#6c8cff" expr="happy" mouth="grin" flip seed={281} />
      <Character x={250} y={1060} scale={0.75} expr={f > tFeel ? "happy" : "sad"} mouth="smile" look={[1, 0]} seed={282} />
      {f > tFeel &&
        Array.from({ length: 8 }).map((_, i) => {
          const t = (f - tFeel + i * 15) % 90;
          return (
            <div key={i} style={{ position: "absolute", left: 800 + i * 50 + Math.sin(t / 10) * 20, top: 500 - t * 4, fontSize: 40, opacity: 1 - t / 90 }}>
              💗
            </div>
          );
        })}
      <Title at={at("gentle", "gentle.")} x={W / 2} y={170} text="they keep the world gentle" size={64} color="#fff" rotate={0} />
      <Grade tint="rgba(255,180,140,.2)" vignette={0.45} />
    </Cam>
  );
};

/* ===== LA PROFESORA ESTRICTA ===== */
export const Teacher: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("teacher");
  const tHope = at("teacher", "hope");
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.1, 0, 20]}>
      <Room wall={["#c9d7c0", "#a9bfa0"]} floor={["#8a6a4a", "#6a4a30"]} />
      <div style={{ position: "absolute", left: 200, top: 100, width: 900, height: 360, background: "#22433a", border: "18px solid #7a5a3a" }} />
      <Character x={760} y={1000} scale={1} galaxy={false} head="#3b3f55" hoodie="#5a5a6a" hair="bun" expr="deadpan" mouth="frown" pose="hips" seed={290} />
      <Character x={1500} y={1040} scale={0.85} expr={f > tHope ? "happy" : "neutral"} mouth="smile" flip seed={291} />
      <Thought at={tHope} x={900} y={280} text="I hope they know how much I want them to succeed." size={34} maxW={540} color="#ffd36b" />
      <Grade tint="rgba(255,220,160,.15)" vignette={0.5} />
    </Cam>
  );
};

/* ===== EL ABUELO ===== */
export const Grandpa: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("grandpa");
  const tMusic = at("grandpa", "music");
  const tSmile = at("grandpa", "smiling.");
  const mem = prog(f, tMusic, tMusic + 30);
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.08, 0, 0]}>
      <Room wall={["#b08a6a", "#8a6a4a"]} floor={["#6a4a30", "#4a3020"]} window={{ x: 1300, y: 140, w: 420, h: 360, sky: ["#ffd9a8", "#f2b98a"] }} />
      <AbsoluteFill style={{ filter: "sepia(.35)" }}>
        {/* recuerdo sepia */}
        {mem > 0 && (
          <div style={{ position: "absolute", left: 420, top: 120, width: 720, height: 400, borderRadius: 200, overflow: "hidden", border: "6px dashed #ffd36b", opacity: mem, background: "linear-gradient(#ffe2b0,#f2c08a 60%,#7ab0c8 60%,#5a90a8)" }}>
            <div style={{ position: "absolute", left: 200, top: 0, width: 0, height: 0 }} />
            <div style={{ position: "absolute", inset: 0, transform: "scale(.45)", transformOrigin: "50% 100%" }}>
              <Character x={600} y={880} scale={0.9} galaxy={false} head="#3b3f55" hoodie="#e2453a" hair="none" expr="happy" mouth="grin" pose="wave" seed={300} />
              <Character x={900} y={880} scale={0.9} galaxy={false} head="#2b2d3a" hoodie="#ffd36b" hair="bun" expr="happy" mouth="grin" pose="raise" flip seed={301} />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ position: "absolute", left: 100 + i * 120, top: 40 + ((f + i * 20) % 80), fontSize: 40, color: "#7a4a20", opacity: 0.8 }}>
                ♪
              </div>
            ))}
          </div>
        )}
        <Character x={720} y={1000} scale={0.95} galaxy={false} head="#474b63" hoodie="#8a7a6a" hair="messy" expr={f > tSmile ? "happy" : "focus"} mouth="smile" seed={302} />
      </AbsoluteFill>
      <Character x={1350} y={1020} scale={0.85} expr="sad" mouth="smile" flip seed={303} />
      <Label at={at("grandpa", "fifty")} x={780} y={40} text="50 years ago" size={36} color="#ffd36b" />
      <Grade tint="rgba(255,190,120,.25)" vignette={0.55} />
    </Cam>
  );
};

/* ===== EL CRUSH ===== */
export const Crush: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("crush");
  const tCatch = at("crush", "catch");
  const tWalk = at("crush", "walk");
  const tHi = at("crush", "hi.");
  const walkX = interpolate(f, [tWalk, tHi], [500, 1050], clamp);
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.06, 0, 0]}>
      <Sky stops={["#bfe6ff", "#e8f6ff"]} />
      <div style={{ position: "absolute", inset: 0, filter: "blur(4px)" }}>
        <City base={720} color="#c9a0a0" seed="cr" h={[160, 380]} windows="#fff" />
      </div>
      <div style={{ position: "absolute", left: 0, top: 720, width: W, height: 360, background: "linear-gradient(#c9b89a,#a9987a)" }} />
      <Character x={1400} y={1000} scale={0.95} galaxy={false} head="#2b2d3a" hoodie="#ff7ab6" hair="bun" expr={f > tHi ? "happy" : "neutral"} mouth="smile" flip seed={310} />
      <Character x={walkX} y={1000} scale={0.95} expr={f > tCatch ? "wide" : "focus"} mouth={f > tHi ? "smile" : "flat"} walk={f > tWalk && f < tHi ? 1 : 0} pose={f > tHi ? "wave" : "down"} seed={311} />
      <Thought at={tCatch} x={1480} y={330} text="they're so funny... I wish they'd notice me." size={32} maxW={480} color="#ff9ab6" tail="right" />
      <Speech at={tHi} x={walkX} y={330} text="Hi!" size={44} />
      <Label at={at("crush", "needed.")} x={960} y={90} text="no powers needed" size={44} color={INK} />
      <Grade vignette={0.35} />
    </Cam>
  );
};

/* ===== LA CITA ===== */
export const DateScene: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("date");
  const tElev = at("date", "eleven");
  const tHope = at("date", "hope");
  const tToo = at("date", "too.");
  const mins = Math.min(11, Math.floor(interpolate(f, [at("date", "promise"), tElev], [0, 11], clamp)));
  return (
    <Cam dur={d} from={[1.05, 0, 0]} to={[1, 0, 0]}>
      <Room wall={["#3a2040", "#24122a"]} floor={["#2a1420", "#160a12"]} window={{ x: 700, y: 120, w: 520, h: 380, sky: ["#0a0a24", "#2a1a4a"], city: "#1a1236", lights: "#ffcf8a" }} />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect x={620} y={760} width={680} height={30} rx={8} fill="#f4f1ea" stroke={INK} strokeWidth={5} />
        <circle cx={947} cy={690} r={60} fill="#ffd36b" opacity={0.15} />
        <rect x={940} y={700} width={14} height={60} fill="#f4f1ea" stroke={INK} strokeWidth={3} />
        <ellipse cx={947} cy={690} rx={8} ry={14} fill="#ffd36b" />
      </svg>
      <Character x={600} y={1000} scale={0.95} galaxy={false} head="#2b2d3a" hoodie="#ff7ab6" hair="bun" expr="happy" mouth="smile" seed={320} />
      <Character x={1320} y={1000} scale={0.95} expr={f > tToo ? "happy" : "focus"} mouth="smile" flip seed={321} />
      <div style={{ position: "absolute", left: 1600, top: 140, fontFamily: FONT, fontWeight: 700, fontSize: 64, color: "#fff" }}>⏱ {mins}:00</div>
      <Thought at={tHope} x={600} y={300} text="I really hope this goes well." size={32} color="#ff9ab6" />
      <Thought at={tToo} x={1320} y={300} text="I really hope this goes well." size={32} tail="right" />
      <Dust n={20} color="#ffd59a" seed="dt" />
      <Grade tint="rgba(255,120,180,.15)" vignette={0.65} />
    </Cam>
  );
};
