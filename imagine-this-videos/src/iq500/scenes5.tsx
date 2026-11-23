import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { Character } from "../lib/Character";
import { Bubble, InfoBg, NightCity, Room } from "../lib/envs";
import { Cam, Dust, FONT, Grade, H, INK, Label, pop, prog, Rays, Title, W } from "../lib/scene";
import { at, D } from "./timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ============ FAMILIA: cena, tarea y el router ============ */
export const Family: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("family");
  const tHw = at("family", "homework.");
  const tDone = at("family", "finish");
  const tWifi = at("family", "wifi...");
  const tRouter = at("family", "redesigning");
  const ant = prog(f, tRouter, tRouter + 30);
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.08, 0, 0]}>
      <Room wall={["#e9b07a", "#c98a5a"]} floor={["#7a4a30", "#5a3420"]} window={{ x: 1400, y: 140, w: 380, h: 340, sky: ["#2a2a5a", "#5a4a8a"], city: "#2a2450", lights: "#ffd59a" }} />
      {/* lámpara colgante */}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={900} y1={0} x2={900} y2={160} stroke={INK} strokeWidth={6} />
        <path d="M820 160 h160 l-30 60 h-100z" fill="#ffd36b" stroke={INK} strokeWidth={5} />
        <path d="M850 220 L560 760 H1240 L950 220Z" fill="#fff1c8" opacity={0.18} />
        {/* mesa */}
        <rect x={420} y={760} width={980} height={40} rx={10} fill="#8a5a3a" stroke={INK} strokeWidth={6} />
        <rect x={460} y={800} width={30} height={160} fill="#6a4028" /> <rect x={1330} y={800} width={30} height={160} fill="#6a4028" />
        {/* router que crece antenas */}
        <g transform="translate(900 760)">
          <rect x={-80} y={-50} width={160} height={50} rx={10} fill="#2a2a34" stroke={INK} strokeWidth={5} />
          {f > tWifi &&
            Array.from({ length: 2 + Math.floor(ant * 6) }).map((_, i) => (
              <line key={i} x1={-60 + i * 17} y1={-50} x2={-90 + i * 26} y2={-110 - (i % 3) * 30} stroke={INK} strokeWidth={6} strokeLinecap="round" />
            ))}
          {Array.from({ length: 4 }).map((_, i) => (
            <circle key={i} cx={-50 + i * 30} cy={-25} r={6} fill={f % 20 < 10 + i * 2 ? "#3ee08a" : "#1a5a3a"} />
          ))}
          {ant > 0.5 &&
            [1, 2, 3].map((k) => <path key={k} d={`M${-40 * k} ${-140 - k * 20} q${40 * k} ${-30 * k} ${80 * k} 0`} stroke="#22d3c5" strokeWidth={6} fill="none" opacity={((f / 10 + k) % 3) / 3} />)}
        </g>
      </svg>
      <Character x={560} y={980} scale={0.95} galaxy={false} head="#2b2d3a" hoodie="#e2453a" hair="bun" expr={f > tRouter ? "wide" : "happy"} mouth={f > tRouter ? "o" : "smile"} pose="hips" seed={310} />
      <Character x={1260} y={1000} scale={0.62} galaxy={false} head="#3b3f55" hoodie="#f2c14e" hair="cap" expr={f > tDone ? "wide" : "happy"} mouth={f > tDone ? "o" : "grin"} pose="hold" flip seed={311} />
      <Character x={920} y={1040} scale={0.8} expr="deadpan" mouth="flat" pose={f > tRouter ? "point" : "down"} seed={312} />
      {f > tHw && f < tWifi && <Bubble x={1260} y={520} s={pop(f, tHw)} size={34}>📚 homework?</Bubble>}
      {f > tDone && f < tWifi && <Bubble x={960} y={430} s={pop(f, tDone)} size={34}>✓ done</Bubble>}
      <Label at={tRouter} x={900} y={300} text="router v2" size={40} color={INK} />
      <Grade tint="rgba(255,190,120,.2)" vignette={0.5} />
    </Cam>
  );
};

/* ============ EXÁMENES ============ */
export const Tests: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("tests");
  const tAlone = at("tests", "alone,");
  const tHard = at("tests", "harder");
  const tRight = at("tests", "right.");
  const stack = Math.floor(interpolate(f, [tHard, tRight], [1, 12], clamp));
  return (
    <Cam dur={d} from={[1.1, 0, 0]} to={[1, 0, 0]}>
      <Room wall={["#d9dde0", "#b9c0c6"]} floor={["#8a8f96", "#6a6f76"]} />
      {/* reloj */}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <circle cx={1600} cy={220} r={90} fill="#fff" stroke={INK} strokeWidth={8} />
        <line x1={1600} y1={220} x2={1600 + Math.sin(f / 4) * 70} y2={220 - Math.cos(f / 4) * 70} stroke="#e2453a" strokeWidth={6} strokeLinecap="round" />
        <rect x={600} y={760} width={720} height={30} fill="#8a5a3a" stroke={INK} strokeWidth={5} />
        <rect x={640} y={790} width={24} height={160} fill="#6a4028" /> <rect x={1260} y={790} width={24} height={160} fill="#6a4028" />
      </svg>
      {Array.from({ length: stack }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 1080 + (i % 2) * 6, top: 740 - i * 14, width: 200, height: 20, background: "#fff", border: `3px solid ${INK}` }} />
      ))}
      {f > tRight && (
        <div style={{ position: "absolute", left: 1180, top: 560 - stack * 14, transform: `translate(-50%,0) scale(${pop(f, tRight)}) rotate(-12deg)`, fontFamily: FONT, fontWeight: 700, fontSize: 120, color: "#e2453a", border: "10px solid #e2453a", borderRadius: 20, padding: "0 30px", background: "rgba(255,255,255,.8)" }}>
          A+
        </div>
      )}
      <Character x={860} y={980} scale={0.9} expr="deadpan" mouth="flat" pose="hold" seed={320} />
      {f < tAlone &&
        [0, 1, 2].map((i) => <Character key={i} x={300 + i * 200} y={1080} scale={0.6} galaxy={false} head="#3b3f55" hoodie={["#6c8cff", "#f2c14e", "#3ee08a"][i]} expr="focus" mouth="frown" seed={321 + i} style={{ filter: "blur(3px)" }} />)}
      <Label at={at("tests", "seconds.")} x={1600} y={340} text="0:04" size={44} color="#e2453a" />
      <Label at={at("tests", "cheating,")} x={960} y={110} text="suspected of cheating" size={40} color={INK} />
      <Grade vignette={0.5} />
    </Cam>
  );
};

/* ============ AMIGOS: la pantalla de carga ============ */
export const Friends: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("friends");
  const tLoad = at("friends", "loading");
  const tLaugh = at("friends", "laugh");
  const tUnc = at("friends", "uncomfortable");
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.1, 40, 0]}>
      <Room wall={["#5a3a6a", "#3a2448"]} floor={["#3a2a30", "#221418"]} window={{ x: 160, y: 140, w: 520, h: 360, sky: ["#f08a7a", "#9a6fb0"], city: "#5a4070", lights: "#ffd59a" }} />
      {/* luces de café */}
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 760 + i * 120, top: 120 + Math.sin(i) * 20, width: 26, height: 26, borderRadius: "50%", background: "#ffd59a", boxShadow: "0 0 30px #ffd59a" }} />
      ))}
      <div style={{ position: "absolute", left: 500, top: 800, width: 940, height: 30, background: "#7a4a30", border: `5px solid ${INK}` }} />
      <Character x={640} y={1000} scale={0.9} galaxy={false} head="#2b2d3a" hoodie="#6c8cff" hair="cap" expr={f > tUnc ? "focus" : "happy"} mouth={f > tUnc ? "frown" : "grin"} pose="explain" talking={f < tLaugh} seed={330} />
      <Character x={1320} y={1000} scale={0.9} galaxy={false} head="#3b3f55" hoodie="#3ee08a" hair="bun" expr={f > tUnc ? "focus" : "happy"} mouth={f > tUnc ? "flat" : "smile"} flip seed={331} />
      <Character x={980} y={1060} scale={0.85} expr={f > tLaugh && f < tUnc ? "happy" : "deadpan"} mouth={f > tLaugh && f < tUnc ? "grin" : "flat"} seed={332} />
      {/* spinner de carga sobre los amigos */}
      {f > tLoad &&
        [640, 1320].map((x, i) => (
          <div key={i} style={{ position: "absolute", left: x - 34, top: 300, width: 68, height: 68, borderRadius: "50%", border: "10px solid rgba(255,255,255,.9)", borderTopColor: "transparent", transform: `rotate(${f * 10 + i * 90}deg)` }} />
        ))}
      {f > tLaugh && f < tUnc && <Bubble x={980} y={340} s={pop(f, tLaugh)} size={44}>HAHA</Bubble>}
      {f > tLaugh + 20 && f < tUnc && <Bubble x={640} y={470} s={pop(f, tLaugh + 20)} size={30}>...wait, I didn't finish</Bubble>}
      <Label at={tLoad} x={980} y={110} text="loading..." size={44} />
      <Grade tint="rgba(255,170,140,.15)" vignette={0.55} />
    </Cam>
  );
};

/* ============ CITAS ============ */
export const Dating: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("dating");
  const tKnow = at("dating", "know");
  const tAwk = at("dating", "awkward.");
  const prob = Math.round(interpolate(f, [tKnow, tKnow + 40], [0, 97.3], clamp) * 10) / 10;
  return (
    <Cam dur={d} from={[1.1, 0, 0]} to={[1, 0, 0]}>
      <Room wall={["#3a2040", "#24122a"]} floor={["#2a1420", "#160a12"]} window={{ x: 700, y: 120, w: 520, h: 380, sky: ["#0a0a24", "#2a1a4a"], city: "#1a1236", lights: "#ffcf8a" }} />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect x={620} y={760} width={680} height={30} rx={8} fill="#f4f1ea" stroke={INK} strokeWidth={5} />
        <rect x={940} y={700} width={14} height={60} fill="#f4f1ea" stroke={INK} strokeWidth={3} />
        <ellipse cx={947} cy={690} rx={8} ry={14} fill="#ffd36b" />
        <circle cx={947} cy={690} r={60} fill="#ffd36b" opacity={0.15} />
      </svg>
      <Character x={600} y={1000} scale={0.95} galaxy={false} head="#2b2d3a" hoodie="#ff7ab6" hair="bun" expr="happy" mouth="smile" talking={f < tAwk} seed={340} />
      <Character x={1320} y={1000} scale={0.95} expr={f > tAwk ? "sad" : "focus"} mouth={f > tAwk ? "flat" : "smile"} flip seed={341} />
      {f > tKnow && (
        <div style={{ position: "absolute", left: 1420, top: 240, fontFamily: FONT, color: "#7ff0ff", fontSize: 26, fontWeight: 600, lineHeight: 1.5, background: "rgba(10,20,40,.7)", border: "3px solid #7ff0ff", borderRadius: 14, padding: "16px 22px" }}>
          next line: "I love that movie!"
          <br />
          probability: {prob}%
          <br />
          best answer: loading ▮▮▮▯
        </div>
      )}
      {f > tAwk && <Title at={tAwk} x={960} y={230} text="awkward..." size={90} color="#ff9ab6" rotate={0} />}
      <Dust n={20} color="#ffd59a" seed="da" />
      <Grade tint="rgba(255,120,180,.15)" vignette={0.65} />
    </Cam>
  );
};

/* ============ NOTICIAS ============ */
export const News: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("news");
  const tCamp = at("news", "camp");
  const tScreen = at("news", "screen");
  return (
    <Cam dur={d} from={[1.15, 0, 0]} to={[1, 0, 0]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#0c1a3a,#102a5a)" }} />
      {/* pared de pantallas */}
      {Array.from({ length: 12 }).map((_, i) => {
        const x = 120 + (i % 4) * 430;
        const y = 90 + Math.floor(i / 4) * 300;
        const on = f > (i === 5 ? 0 : tScreen + i * 2);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: 400, height: 270, background: on ? "#1a3a7a" : "#0a1020", border: "8px solid #2a2a3a", borderRadius: 8, overflow: "hidden" }}>
            {on && (
              <>
                <Character x={200} y={500} scale={0.62} expr="deadpan" mouth="flat" seed={350 + i} />
                <div style={{ position: "absolute", left: 0, bottom: 0, width: "100%", background: "#e2453a", color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 18, padding: "6px 10px" }}>BREAKING · 500 IQ</div>
              </>
            )}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, top: 960, width: W, height: 70, background: "#e2453a", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: W - f * 8, top: 10, whiteSpace: "nowrap", fontFamily: FONT, fontWeight: 700, fontSize: 40, color: "#fff" }}>
          THE KID WHO SOLVED THE IMPOSSIBLE · 6 MILLENNIUM PROBLEMS IN ONE WEEKEND · EXPERTS STUNNED · THE KID WHO SOLVED THE IMPOSSIBLE ·
        </div>
      </div>
      {/* flashes de cámaras */}
      {f > tCamp && Array.from({ length: 6 }).map((_, i) => (Math.floor(f / 3 + i * 7) % 13 === 0 ? <AbsoluteFill key={i} style={{ background: `radial-gradient(circle at ${random(`fl${i}`) * 100}% ${random(`fm${i}`) * 100}%, rgba(255,255,255,.7), transparent 30%)` }} /> : null))}
      <Grade vignette={0.5} />
    </Cam>
  );
};

/* ============ CRÍTICOS EN INTERNET ============ */
export const Haters: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("haters");
  const comments = ["fraud 🤡", "it's fake", "he's dangerous", "lol no way", "who even is this", "this is staged", "kinda scary tbh", "prove it", "overrated", "I could do that"];
  const tFraud = at("haters", "fraud.");
  const tRead = at("haters", "read");
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.12, 0, 0]}>
      <InfoBg hue="#3a1a2a" />
      <Character x={960} y={1060} scale={0.95} expr={f > tRead ? "sad" : "focus"} mouth="flat" look={[0, -0.6]} seed={360} />
      {comments.map((c, i) => {
        const t = tFraud + i * 7;
        if (f < t) return null;
        const x = 160 + random(`hx${i}`) * 1300;
        const y = 120 + random(`hy${i}`) * 520;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y + Math.sin(f / 20 + i) * 6, transform: `scale(${pop(f, t)})`, fontFamily: FONT, fontWeight: 600, fontSize: 30, color: "#fff", background: "rgba(30,20,40,.9)", border: "3px solid #ff5a7a", borderRadius: 14, padding: "10px 18px", whiteSpace: "nowrap" }}>
            <span style={{ color: "#ff9ab6" }}>@user{Math.floor(random(`hu${i}`) * 9000 + 1000)}</span> {c}
          </div>
        );
      })}
      <Label at={tRead} x={960} y={60} text="every. single. comment." size={40} color="#ff9ab6" />
      <Grade vignette={0.65} />
    </Cam>
  );
};

/* ============ OFERTAS ============ */
export const Offers: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("offers");
  const items = [
    { t: at("offers", "Universities."), text: "🎓 Universities", c: "#6c8cff" },
    { t: at("offers", "Companies."), text: "🏢 Companies", c: "#22d3c5" },
    { t: at("offers", "countries."), text: "🌍 Countries", c: "#3ee08a" },
    { t: at("offers", "island."), text: "🏝️ Private island", c: "#ffd36b" },
    { t: at("offers", "check."), text: "✍️ Blank check", c: "#ff8a3d" },
  ];
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.06, 0, 0]}>
      <Room wall={["#2a4a6a", "#1a3050"]} floor={["#3a2a20", "#24160e"]} />
      <Rays x={960} y={300} opacity={0.06} />
      {/* lluvia de sobres */}
      {Array.from({ length: 24 }).map((_, i) => {
        const y = ((f * (5 + (i % 4)) + random(`ey${i}`) * 900) % 1100) - 120;
        return (
          <div key={i} style={{ position: "absolute", left: random(`ex${i}`) * W, top: y, width: 90, height: 60, background: "#f4f1ea", border: `4px solid ${INK}`, borderRadius: 6, transform: `rotate(${f * (i % 2 ? 2 : -2) + i * 20}deg)` }}>
            <svg width={90} height={60} style={{ position: "absolute", left: -4, top: -4 }}>
              <path d="M4 4 L49 34 L94 4" stroke={INK} strokeWidth={4} fill="none" />
            </svg>
          </div>
        );
      })}
      <Character x={960} y={1000} scale={0.95} expr="wide" mouth="o" pose="shrug" seed={370} />
      {items.map((it, i) =>
        f > it.t ? (
          <div key={i} style={{ position: "absolute", left: i % 2 ? 1300 : 180, top: 180 + i * 130, transform: `scale(${pop(f, it.t)})`, transformOrigin: i % 2 ? "right center" : "left center", fontFamily: FONT, fontWeight: 700, fontSize: 46, color: INK, background: it.c, border: `6px solid ${INK}`, borderRadius: 20, padding: "12px 28px", boxShadow: "0 8px 0 rgba(0,0,0,.35)" }}>
            {it.text}
          </div>
        ) : null,
      )}
      <Grade vignette={0.55} />
    </Cam>
  );
};

/* ============ LA DECISIÓN ============ */
export const Choice: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("choice");
  const tCtrl = at("choice", "controls");
  const tDec = at("choice", "decision.");
  const tAll = at("choice", "everyone.");
  const globe = prog(f, tAll - 10, tAll + 20);
  return (
    <Cam dur={d} from={[1.15, 0, 20]} to={[1, 0, 0]}>
      <NightCity seed="ch" />
      {/* hilos de títere que se cortan */}
      {f > tCtrl && f < tDec + 20 && (
        <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
          {[860, 960, 1060].map((x, i) => (
            <line key={i} x1={x} y1={0} x2={x} y2={f > tDec ? 220 : 480} stroke="#ff5a5a" strokeWidth={3} strokeDasharray="10 6" opacity={0.8} />
          ))}
        </svg>
      )}
      <Character x={960} y={1000} scale={0.95} expr={f > tDec ? "focus" : "sad"} mouth="flat" pose={f > tAll ? "raise" : "down"} glow={f > tDec ? 0.6 : 0} seed={380} />
      {globe > 0 && (
        <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
          <g transform={`translate(1450 360) scale(${globe})`}>
            <circle r={150} fill="#2f8fff" stroke={INK} strokeWidth={8} />
            <path d="M-120 -40 q40 -60 100 -30 q20 40 -30 60 q-40 30 -70 -30z M30 -110 q60 0 90 40 q-20 40 -60 20 q-30 -20 -30 -60z M40 30 q60 -10 80 30 q-10 60 -60 70 q-40 -40 -20 -100z" fill="#3ccf5a" />
            {Array.from({ length: 10 }).map((_, i) => {
              const a = (i / 10) * 6.283 + f / 40;
              return <circle key={i} cx={Math.cos(a) * 200} cy={Math.sin(a) * 60} r={10} fill="#ffd36b" />;
            })}
          </g>
        </svg>
      )}
      <Label at={tCtrl} x={960} y={100} text="who controls your mind controls the future" size={36} color="#ff9a9a" out={tDec + 10} />
      <Title at={tAll} x={1450} y={620} text="FOR EVERYONE" size={80} color="#ffd36b" rotate={0} />
      <Grade tint="rgba(80,100,220,.2)" vignette={0.65} />
    </Cam>
  );
};
