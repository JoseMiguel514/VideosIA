import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { Character } from "../lib/Character";
import { Bedroom, Bubble, Glyph, InfoBg, Lab, NightCity, Room } from "../lib/envs";
import { Cam, City, Dust, FONT, Grade, H, INK, Label, pop, prog, Rain, Rays, Sky, Stars, Title, W } from "../lib/scene";
import { at, D } from "./timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ============ MEDICINA ============ */
export const Medicine: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("medicine");
  const tDays = at("medicine", "days.");
  const tHosp = at("medicine", "Hospitals");
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.1, 0, 0]}>
      <Lab tint="#d8f2ee" />
      {/* doble hélice */}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        {Array.from({ length: 22 }).map((_, i) => {
          const y = 140 + i * 26;
          const ph = f / 10 + i * 0.5;
          const x1 = 1400 + Math.sin(ph) * 110;
          const x2 = 1400 - Math.sin(ph) * 110;
          return (
            <g key={i}>
              <line x1={x1} y1={y} x2={x2} y2={y} stroke="#9ab" strokeWidth={4} />
              <circle cx={x1} cy={y} r={11} fill={Math.cos(ph) > 0 ? "#ff5a7a" : "#c0485f"} stroke={INK} strokeWidth={3} />
              <circle cx={x2} cy={y} r={11} fill={Math.cos(ph) > 0 ? "#3a7ae0" : "#5a9aff"} stroke={INK} strokeWidth={3} />
            </g>
          );
        })}
        {/* tubos de ensayo */}
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${300 + i * 90} 560)`}>
            <rect x={-18} y={0} width={36} height={140} rx={18} fill="rgba(255,255,255,.6)" stroke={INK} strokeWidth={4} />
            <rect x={-14} y={70 - Math.sin(f / 10 + i) * 10} width={28} height={66 + Math.sin(f / 10 + i) * 10} rx={14} fill={["#3ee08a", "#ff5a7a", "#6c8cff", "#ffd36b"][i]} />
          </g>
        ))}
      </svg>
      <Character x={860} y={1000} scale={0.95} expr="focus" mouth="smile" pose="explain" glow={0.4} seed={400} />
      <Label at={at("medicine", "decades")} x={860} y={300} text="decades" size={50} color="#e2453a" />
      <Label at={tDays} x={860} y={380} text="→ days" size={56} color="#1f7a6a" />
      {f > tHosp && <Bubble x={1400} y={760} s={pop(f, tHosp)} size={36}>🏥 new treatments</Bubble>}
      <Grade vignette={0.4} />
    </Cam>
  );
};

/* ============ ENERGÍA: fusión ============ */
export const Energy: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("energy");
  const tSun = at("energy", "Sun,");
  const tDesign = at("energy", "design");
  const on = prog(f, tDesign, tDesign + 40);
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.12, 0, 0]}>
      <InfoBg hue="#3a2a10" />
      {f > tSun && (
        <div style={{ position: "absolute", left: 1500, top: 120, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, #fff6c8, #ffb347 60%, #ff7a1a)", boxShadow: "0 0 120px #ffb347", transform: `scale(${pop(f, tSun)})` }} />
      )}
      {/* reactor toroidal */}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <g transform="translate(860 560)">
          <ellipse rx={420} ry={170} fill="#2a2a3a" stroke={INK} strokeWidth={10} />
          <ellipse rx={260} ry={90} fill="#0e0e18" stroke={INK} strokeWidth={8} />
          <ellipse rx={340} ry={128} fill="none" stroke="#ffb347" strokeWidth={26 * on} opacity={0.4 + 0.6 * on} style={{ filter: "blur(2px)" }} />
          <ellipse rx={340} ry={128} fill="none" stroke="#fff6c8" strokeWidth={8 * on} strokeDasharray="60 40" strokeDashoffset={-f * 20} />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * 6.283;
            return <rect key={i} x={Math.cos(a) * 420 - 16} y={Math.sin(a) * 170 - 40} width={32} height={80} rx={8} fill="#5a6a8a" stroke={INK} strokeWidth={4} />;
          })}
        </g>
      </svg>
      <Character x={1540} y={1040} scale={0.8} expr={on > 0.5 ? "happy" : "focus"} mouth="smile" pose="point" flip seed={410} />
      <Label at={tSun} x={1650} y={460} text="the Sun" size={40} color="#ffd36b" />
      <Label at={at("energy", "Fusion,")} x={860} y={180} text="fusion" size={56} color="#ffb347" />
      <Grade tint="rgba(255,170,60,.15)" vignette={0.6} />
    </Cam>
  );
};

/* ============ ESPACIO: cohetes a Marte ============ */
export const Space: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("space");
  const tLaunch = at("space", "Rockets");
  const tMars = at("space", "Mars");
  const tSched = at("space", "schedule.");
  const up = prog(f, tLaunch + 10, tMars + 20);
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.05, 0, 0]}>
      <Sky stops={["#04051a", "#0e1440 50%", "#2a2a6a"]} />
      <Stars n={180} />
      {f > tMars && (
        <div style={{ position: "absolute", left: 1350, top: 120, width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #ff9a6a, #c9502a 60%, #6a2410)", border: `8px solid ${INK}`, transform: `scale(${pop(f, tMars)})` }}>
          <div style={{ position: "absolute", left: 80, top: 120, width: 60, height: 30, borderRadius: "50%", background: "rgba(0,0,0,.2)" }} />
          <div style={{ position: "absolute", left: 190, top: 200, width: 80, height: 40, borderRadius: "50%", background: "rgba(0,0,0,.2)" }} />
        </div>
      )}
      <div style={{ position: "absolute", left: 0, top: 880, width: W, height: 200, background: "linear-gradient(#2a2a3a,#141420)" }} />
      {/* cohete */}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <g transform={`translate(${560 + up * 700} ${700 - up * 800}) rotate(${up * 40})`}>
          {f > tLaunch && <path d={`M-30 120 Q0 ${240 + Math.sin(f) * 30} 30 120Z`} fill="#ffb347" />}
          <path d="M0 -140 q60 60 50 260 h-100 q-10 -200 50 -260z" fill="#f4f1ea" stroke={INK} strokeWidth={8} />
          <circle cx={0} cy={-30} r={22} fill="#6c8cff" stroke={INK} strokeWidth={6} />
          <path d="M-50 60 l-40 70 l42 -10z M50 60 l40 70 l-42 -10z" fill="#e2453a" stroke={INK} strokeWidth={6} />
        </g>
        {up > 0.95 && <path d="M560 700 q500 -200 1000 -500" stroke="#fff" strokeOpacity={0.3} strokeWidth={4} strokeDasharray="10 12" fill="none" />}
      </svg>
      <Character x={260} y={1000} scale={0.85} expr="happy" mouth="grin" pose="wave" look={[1, -1]} seed={420} />
      <Label at={tLaunch} x={960} y={90} text="cheaper · safer · reusable" size={40} color="#7ff0ff" />
      {f > tSched && (
        <div style={{ position: "absolute", left: 1350, top: 520, transform: `scale(${pop(f, tSched)})`, fontFamily: FONT, background: "#f4f1ea", border: `6px solid ${INK}`, borderRadius: 14, padding: "14px 24px", fontSize: 34, fontWeight: 700, color: INK }}>
          📅 NEXT DEPARTURE: MARS
        </div>
      )}
      <Grade vignette={0.6} />
    </Cam>
  );
};

/* ============ CLIMA ============ */
export const Climate: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("climate");
  const tMach = at("climate", "machines");
  const tFact = at("climate", "Factories");
  const clean = prog(f, tMach, d - 10);
  return (
    <Cam dur={d} from={[1.05, 0, 0]} to={[1, 0, 0]}>
      <Sky stops={[`rgb(${150 - clean * 30},${150 + clean * 60},${150 + clean * 90})`, `rgb(${200 - clean * 20},${190 + clean * 40},${170 + clean * 70})`]} />
      <AbsoluteFill style={{ background: "rgba(120,110,90,.5)", opacity: 1 - clean }} />
      <div style={{ position: "absolute", inset: 0, filter: "blur(4px)" }}>
        <City base={820} color="#7a8a96" seed="cl" h={[160, 420]} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 820, width: W, height: 260, background: "linear-gradient(#7ac07a,#4a8a5a)" }} />
      {/* máquinas captadoras */}
      {Array.from({ length: 5 }).map((_, i) => {
        if (f < (i < 2 ? tMach + i * 6 : tFact + (i - 2) * 6)) return null;
        const x = 160 + i * 340;
        return (
          <svg key={i} width={260} height={300} style={{ position: "absolute", left: x, top: 560, transform: `scale(${pop(f, i < 2 ? tMach + i * 6 : tFact + (i - 2) * 6)})`, transformOrigin: "50% 100%" }}>
            <rect x={20} y={60} width={220} height={200} rx={16} fill="#e9f4f7" stroke={INK} strokeWidth={6} />
            {[0, 1].map((k) => (
              <g key={k} transform={`translate(${80 + k * 100} 140) rotate(${f * 8})`}>
                <circle r={40} fill="#cfe0e6" stroke={INK} strokeWidth={4} />
                {[0, 90, 180, 270].map((a) => (
                  <path key={a} d="M0 0 L8 -36 L-8 -36Z" fill="#7aa6c2" transform={`rotate(${a})`} />
                ))}
              </g>
            ))}
            <text x={130} y={245} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} fill="#1f7a6a">
              CO₂ ↓
            </text>
          </svg>
        );
      })}
      {/* partículas de CO2 siendo absorbidas */}
      {Array.from({ length: 30 }).map((_, i) => {
        const t = (f + i * 13) % 80;
        const sx = random(`cx${i}`) * W;
        const sy = 100 + random(`cy${i}`) * 400;
        const tx = 290 + (i % 5) * 340;
        return f > tMach ? <div key={i} style={{ position: "absolute", left: sx + (tx - sx) * (t / 80), top: sy + (700 - sy) * (t / 80), width: 12, height: 12, borderRadius: "50%", background: "#5a5a5a", opacity: 1 - t / 80 }} /> : null;
      })}
      <Character x={1750} y={1010} scale={0.75} expr="happy" mouth="smile" pose="hips" flip seed={430} />
      <Label at={tFact} x={960} y={90} text="built all over the world" size={40} color={INK} />
      <Grade vignette={0.4} />
    </Cam>
  );
};

/* ============ PRESIÓN ============ */
export const Pressure: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("pressure");
  const tHurt = at("pressure", "hurt.");
  const shake = f > tHurt ? Math.sin(f * 3) * 4 : 0;
  const notif = ["📩 Urgent", "📞 Missed call (14)", "🔔 Meeting in 5 min", "📩 Can you just...", "📞 President's office", "🔔 Deadline!", "📩 RE: RE: RE:", "📞 Unknown"];
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.2, 0, 40]}>
      <Room wall={["#2a2a3a", "#1a1a26"]} floor={["#2a2028", "#140e14"]} />
      <AbsoluteFill style={{ transform: `translateX(${shake}px)` }}>
        {/* montañas de papeles */}
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: 500 + random(`px${i}`) * 900, top: 600 + random(`py${i}`) * 300 - Math.min(f, 200) * 0.5 * random(`pz${i}`), width: 150, height: 100, background: "#f4f1ea", border: `3px solid ${INK}`, transform: `rotate(${random(`pr${i}`) * 60 - 30}deg)` }} />
        ))}
        <Character x={960} y={1050} scale={0.9} expr={f > tHurt ? "sad" : "focus"} mouth="frown" pose={f > tHurt ? "chin" : "hold"} seed={440} />
        {f > tHurt && <div style={{ position: "absolute", left: 860, top: 380, width: 200, height: 200, borderRadius: "50%", border: "8px solid #ff5a5a", opacity: (f % 20) / 20, transform: `scale(${1 + (f % 20) / 20})` }} />}
      </AbsoluteFill>
      {notif.map((n, i) => {
        const t = 8 + i * 12;
        if (f < t) return null;
        return (
          <div key={i} style={{ position: "absolute", left: i % 2 ? 1240 : 260, top: 200 + (i % 4) * 110 + Math.floor(i / 4) * 40, transform: `scale(${pop(f, t)})`, fontFamily: FONT, fontWeight: 600, fontSize: 30, color: "#fff", background: "rgba(40,40,60,.9)", border: "3px solid #8a8aa8", borderRadius: 16, padding: "12px 22px" }}>
            {n}
          </div>
        );
      })}
      <Label at={at("pressure", "sleep")} x={960} y={150} text="sleep: 3h" size={36} color="#ff9a9a" />
      <Grade tint="rgba(255,80,80,.12)" vignette={0.75} />
    </Cam>
  );
};

/* ============ EL ERROR ============ */
export const Mistake: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("mistake");
  const tNum = at("mistake", "number");
  const tScare = at("mistake", "scares");
  const zoom = prog(f, tNum, tNum + 40);
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1, 0, 0]}>
      <AbsoluteFill style={{ background: "#0e2a5a" }} />
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.12) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.12) 2px, transparent 2px)", backgroundSize: "60px 60px" }} />
      <AbsoluteFill style={{ transform: `scale(${1 + zoom * 1.6})`, transformOrigin: "1150px 420px" }}>
        <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
          <g stroke="#cfe6ff" strokeWidth={4} fill="none">
            <rect x={300} y={200} width={700} height={500} />
            <circle cx={650} cy={450} r={180} />
            <path d="M300 450 h700 M650 200 v500 M1000 300 l300 -100 M1000 600 l300 100" />
          </g>
          {["r = 0.4512 m", "t = 12.03 s", "k = 3.8807", "v = 9.0001"].map((s, i) => (
            <text key={i} x={1060} y={300 + i * 70} fontFamily={FONT} fontWeight={600} fontSize={34} fill={i === 3 && f > tNum ? "#ff5a5a" : "#cfe6ff"}>
              {s}
            </text>
          ))}
          {f > tNum && <circle cx={1150} cy={500} r={70 + Math.sin(f / 4) * 6} fill="none" stroke="#ff5a5a" strokeWidth={6} />}
        </svg>
      </AbsoluteFill>
      <Character x={300} y={1080} scale={0.85} expr={f > tScare ? "wide" : "focus"} mouth={f > tScare ? "o" : "flat"} look={[1, -0.5]} seed={450} />
      <Label at={tNum} x={1550} y={900} text="error: 0.0001" size={50} color="#ff5a5a" />
      <Grade vignette={0.7} />
    </Cam>
  );
};

/* ============ LA MENTORA ============ */
export const Mentor: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("mentor");
  const tQ = at("mentor", "happy?");
  return (
    <Cam dur={d} from={[1.1, 0, 0]} to={[1, 0, 0]}>
      <Room wall={["#c9d7c0", "#a9bfa0"]} floor={["#8a6a4a", "#6a4a30"]} window={{ x: 1300, y: 140, w: 440, h: 400, sky: ["#ffcf8a", "#f29e6b"], city: "#c98a6a" }} />
      <Rays x={1520} y={340} opacity={0.08} color="#ffe2a8" />
      <div style={{ position: "absolute", left: 240, top: 160, width: 760, height: 360, background: "#22433a", border: "18px solid #7a5a3a", opacity: 0.7, filter: "blur(2px)" }} />
      <Character x={620} y={1000} scale={0.95} galaxy={false} head="#3b3f55" hoodie="#8e5ad0" hair="bun" expr="happy" mouth="smile" pose="explain" talking={f > tQ - 30 && f < tQ + 20} seed={460} />
      <Character x={1250} y={1000} scale={0.95} expr={f > tQ ? "sad" : "neutral"} mouth="flat" flip seed={461} />
      {f > tQ && <Bubble x={620} y={360} s={pop(f, tQ)} size={50}>Are you happy?</Bubble>}
      <Dust n={30} color="#fff2d0" seed="mt" />
      <Grade tint="rgba(255,200,140,.2)" vignette={0.5} />
    </Cam>
  );
};

/* ============ ENSEÑAR ============ */
export const Teach: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("teach");
  const tFree = at("teach", "Free");
  const tTools = at("teach", "tools.");
  const tTen = at("teach", "ten");
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.08, 0, 0]}>
      <Room wall={["#f2d79a", "#e3b77a"]} floor={["#9a6a48", "#7a4a30"]} />
      <div style={{ position: "absolute", left: 240, top: 110, width: 900, height: 420, background: "#22433a", border: "18px solid #7a5a3a" }}>
        <svg width={900} height={420}>
          <circle cx={200} cy={210} r={100 * prog(f, 10, 40)} fill="none" stroke="#fff" strokeWidth={6} />
          <path d="M360 210 h120" stroke="#ffd36b" strokeWidth={8} opacity={prog(f, 30, 45)} />
          <path d="M470 190 l20 20 l-20 20" stroke="#ffd36b" strokeWidth={8} fill="none" opacity={prog(f, 30, 45)} />
          <text x={560} y={230} fontFamily={FONT} fontWeight={700} fontSize={60} fill="#9ff0c8" opacity={prog(f, 45, 60)}>
            easy!
          </text>
        </svg>
      </div>
      <Character x={1300} y={980} scale={0.9} expr="happy" mouth="smile" pose="point" talking flip seed={470} />
      {/* alumnos */}
      {Array.from({ length: 6 }).map((_, i) => (
        <Character key={i} x={240 + i * 230} y={1180} scale={0.62} galaxy={false} head={["#2b2d3a", "#3b3f55", "#474b63"][i % 3]} hoodie={["#e2453a", "#f2c14e", "#6c8cff", "#3ee08a", "#ff7ab6", "#8e5ad0"][i]} hair={(["none", "bun", "cap", "messy", "none", "bun"] as const)[i]} expr={f > tTen ? "happy" : "focus"} mouth="smile" pose={f > tTen && i % 2 ? "raise" : "down"} seed={471 + i} />
      ))}
      {[
        [tFree, "🎓 FREE CLASSES", 1500, 200],
        [tTools, "🧰 SIMPLE TOOLS", 1500, 300],
        [tTen, "🧒 FOR AGE 10+", 1500, 400],
      ].map(([t, txt, x, y]) =>
        f > (t as number) ? (
          <div key={txt as string} style={{ position: "absolute", left: x as number, top: y as number, transform: `scale(${pop(f, t as number)})`, fontFamily: FONT, fontWeight: 700, fontSize: 38, color: INK, background: "#fff", border: `5px solid ${INK}`, borderRadius: 16, padding: "8px 20px" }}>
            {txt}
          </div>
        ) : null,
      )}
      <Grade tint="rgba(255,200,120,.15)" vignette={0.45} />
    </Cam>
  );
};

/* ============ JUNTOS ============ */
export const Together: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("together");
  const tPeople = at("together", "people.");
  const tAlone = at("together", "alone.");
  return (
    <Cam dur={d} from={[1.1, 0, 20]} to={[1, 0, 0]}>
      <Sky stops={["#8fd8ff", "#c9ecff 55%", "#fff4d6"]} sun={{ x: 1600, y: 200, r: 60, color: "#fff3c2" }} />
      <div style={{ position: "absolute", inset: 0, filter: "blur(4px)" }}>
        <City base={820} color="#b5d0e0" seed="tg" h={[160, 420]} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 820, width: W, height: 260, background: "linear-gradient(#9ee09a,#5fb86a)" }} />
      {Array.from({ length: 9 }).map((_, i) => {
        const x = 140 + i * 205;
        const isMe = i === 4;
        return (
          <React.Fragment key={i}>
            {isMe ? (
              <Character x={x} y={1000} scale={0.8} expr={f > tAlone ? "happy" : "neutral"} mouth="grin" pose="wave" glow={0.5} seed={480} />
            ) : (
              <Character x={x} y={1000} scale={0.72} galaxy={false} head={["#2b2d3a", "#3b3f55", "#474b63"][i % 3]} hoodie={["#e2453a", "#f2c14e", "#6c8cff", "#3ee08a", "#ff7ab6", "#8e5ad0", "#f39c12", "#16a085"][i % 8]} hair={(["none", "bun", "cap", "messy"] as const)[i % 4]} expr="happy" mouth="smile" seed={481 + i} />
            )}
            {f > tPeople + i * 3 && !isMe && (
              <div style={{ position: "absolute", left: x - 22, top: 450, fontSize: 50, transform: `scale(${pop(f, tPeople + i * 3)})` }}>💡</div>
            )}
          </React.Fragment>
        );
      })}
      <Label at={tPeople} x={960} y={110} text="smarter people" size={50} color="#1f5a7a" />
      <Dust n={25} color="#fff" seed="tg" />
      <Grade vignette={0.35} />
    </Cam>
  );
};

/* ============ AÑOS DESPUÉS ============ */
export const Years: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("years");
  const year = Math.floor(interpolate(f, [0, at("years", "methods.")], [1, 7], clamp));
  const tHope = at("years", "hope.");
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.1, 0, 0]}>
      <InfoBg hue="#1e3a5a" />
      <div style={{ position: "absolute", left: 960, top: 140, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 700, fontSize: 120, color: "#fff", textShadow: "0 0 40px rgba(127,240,255,.5)" }}>
        YEAR {year}
      </div>
      {/* mapa de luces que se encienden (escuelas) */}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <ellipse cx={960} cy={640} rx={760} ry={300} fill="#12305a" stroke="#2a5a8a" strokeWidth={4} />
        {Array.from({ length: 90 }).map((_, i) => {
          const a = random(`ma${i}`) * 6.283;
          const r = Math.sqrt(random(`mr${i}`));
          const t = (i / 90) * (d - 40);
          return f > t ? <circle key={i} cx={960 + Math.cos(a) * r * 720} cy={640 + Math.sin(a) * r * 280} r={6} fill="#ffd36b" opacity={0.9} /> : null;
        })}
      </svg>
      <Label at={at("years", "Kids")} x={960} y={300} text="schools using your methods" size={40} color="#7ff0ff" />
      {f > tHope && <Title at={tHope} x={960} y={980} text='"hope"' size={90} color="#ffd36b" rotate={0} />}
      <Grade vignette={0.6} />
    </Cam>
  );
};

/* ============ NOCHE: el símbolo otra vez ============ */
export const Night: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("night");
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.3, 300, 120]}>
      <Bedroom night glyph={0.5 + 0.3 * Math.sin(f / 10)} />
      <Character x={1080} y={960} scale={1.05} expr="focus" mouth="flat" look={[-1, -0.7]} seed={500} />
      <Rain n={60} opacity={0.15} />
      <Grade tint="rgba(60,80,220,.25)" vignette={0.75} />
    </Cam>
  );
};

/* ============ DESCIFRAR ============ */
export const Decode: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("decode");
  const tSee = at("decode", "see");
  const tMsg = at("decode", "message.");
  const lines = prog(f, tSee, tMsg + 20);
  return (
    <AbsoluteFill>
      <Cam dur={d} from={[1.3, 0, 0]} to={[1.7, 0, 0]}>
        <AbsoluteFill style={{ background: "#07061a" }} />
        <Glyph x={960} y={540} r={300} glow={0.8 + 0.2 * Math.sin(f / 5)} reveal={1} />
        {/* rejilla de análisis */}
        <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
          {Array.from({ length: 16 }).map((_, i) => (
            <line key={i} x1={0} y1={i * 70} x2={W * lines} y2={i * 70} stroke="#7ff0ff" strokeOpacity={0.15} strokeWidth={2} />
          ))}
          {Array.from({ length: 14 }).map((_, i) => {
            if (f < tMsg + i * 3) return null;
            const a = (i / 14) * 6.283;
            return (
              <text key={i} x={960 + Math.cos(a) * 420} y={540 + Math.sin(a) * 420} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={30} fill="#7ff0ff" opacity={0.8}>
                {["Δ", "Ψ", "∞", "λ", "Ω", "∑", "ϕ", "∂", "ℵ", "θ", "Ξ", "μ", "π", "ε"][i]}
              </text>
            );
          })}
        </svg>
      </Cam>
      <Label at={tMsg} x={960} y={90} text="it's a message" size={50} color="#7ff0ff" />
      <Grade tint="rgba(60,200,255,.15)" vignette={0.8} />
    </AbsoluteFill>
  );
};

/* ============ EL MENSAJE ============ */
export const Message: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("message");
  const l1 = "YOU ARE NOT THE FIRST.";
  const l2 = "AND YOU ARE NOT THE ONLY ONE.";
  const t1 = at("message", "You");
  const t2 = at("message", "only");
  const n1 = Math.floor(interpolate(f, [t1, t1 + 30], [0, l1.length], clamp));
  const n2 = Math.floor(interpolate(f, [t2 - 12, t2 + 25], [0, l2.length], clamp));
  const glitch = (f > t1 && f < t1 + 6) || (f > t2 && f < t2 + 6);
  return (
    <AbsoluteFill style={{ background: "#020208", alignItems: "center", justifyContent: "center", transform: glitch ? `translateX(${(random(`m${f}`) - 0.5) * 30}px)` : undefined }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.25 }}>
        <Glyph x={960} y={540} r={380} glow={0.4} />
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 80, color: "#7ff0ff", letterSpacing: 6, textShadow: "0 0 30px #7ff0ff" }}>{l1.slice(0, n1)}</div>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 80, color: "#ff5a7a", letterSpacing: 6, marginTop: 30, textShadow: "0 0 30px #ff5a7a" }}>{l2.slice(0, n2)}</div>
      <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,.3) 0 2px, transparent 2px 5px)" }} />
      {f > d - 20 && <AbsoluteFill style={{ background: "#000", opacity: (f - (d - 20)) / 20 }} />}
    </AbsoluteFill>
  );
};

/* ============ CLIFFHANGER: el otro ============ */
export const Cliff: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("cliff");
  const tSaw = at("cliff", "news.");
  const tWatch = at("cliff", "watching");
  const reveal = prog(f, tWatch, tWatch + 40);
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.25, -300, 40]}>
      <NightCity seed="cf" />
      <Rain n={120} opacity={0.3} />
      {/* ventana del protagonista a lo lejos */}
      <div style={{ position: "absolute", left: 300, top: 420, width: 160, height: 120, background: "#ffd59a", border: `8px solid ${INK}`, boxShadow: "0 0 40px #ffd59a" }}>
        <div style={{ position: "absolute", left: 50, top: 20, width: 60, height: 60, borderRadius: "50%", background: "#21165e" }} />
      </div>
      {/* pantalla de noticias en un edificio */}
      {f > tSaw && (
        <div style={{ position: "absolute", left: 760, top: 300, width: 360, height: 220, background: "#1a3a7a", border: "8px solid #2a2a3a", overflow: "hidden", opacity: prog(f, tSaw, tSaw + 10) }}>
          <div style={{ position: "absolute", inset: 0, transform: "scale(.4)", transformOrigin: "50% 100%" }}>
            <Character x={180} y={520} scale={0.7} expr="deadpan" mouth="flat" seed={510} />
          </div>
          <div style={{ position: "absolute", left: 0, bottom: 0, width: "100%", background: "#e2453a", color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 18, padding: "4px 10px" }}>500 IQ · LIVE</div>
        </div>
      )}
      {/* el otro: silueta en una azotea, de espaldas a la luz */}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect x={1300} y={700} width={620} height={400} fill="#05060f" />
      </svg>
      <div style={{ position: "absolute", inset: 0, filter: `brightness(${0.15 + reveal * 0.35})` }}>
        <Character x={1620} y={712} scale={0.9} galaxy={false} head="#0a0a12" hoodie="#14141c" pants="#0a0a12" expr="focus" mouth="flat" look={[-1, 0]} flip seed={520} />
      </div>
      {/* ojos rojos que brillan */}
      {reveal > 0.3 && (
        <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
          <ellipse cx={1620 + 34 * 0.9 * -1 + 0} cy={712 - 508 * 0.9} rx={14} ry={6} fill="#ff2a4a" opacity={reveal} style={{ filter: "drop-shadow(0 0 10px #ff2a4a)" }} />
          <ellipse cx={1620 + 34 * 0.9} cy={712 - 508 * 0.9} rx={14} ry={6} fill="#ff2a4a" opacity={reveal} style={{ filter: "drop-shadow(0 0 10px #ff2a4a)" }} />
        </svg>
      )}
      {/* glifo rojo en la mano / pared */}
      {reveal > 0.6 && (
        <div style={{ position: "absolute", inset: 0, opacity: (reveal - 0.6) * 2.5 }}>
          <Glyph x={1620} y={300} r={70} glow={1} color="#ff2a4a" />
        </div>
      )}
      <Grade tint="rgba(40,60,200,.3)" vignette={0.85} />
    </Cam>
  );
};

/* ============ CIERRE: Parte 2 ============ */
export const Outro2: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("outro");
  const tPart = at("outro", "part");
  const tCom = at("outro", "comments");
  const tSub = at("outro", "subscribe,");
  const tImg = at("outro", "imagine");
  return (
    <Cam dur={d} from={[1, 0, 0]} to={[1.05, 0, 0]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#5b1d8c,#d8367a 55%,#ff8a3d 85%,#ffd36b)" }} />
      <Rays x={560} y={620} color="#ffffff" opacity={0.07} />
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.12) 3px, transparent 3px)", backgroundSize: "28px 28px" }} />
      <div style={{ position: "absolute", left: -300, top: 920, width: 1800, height: 700, borderRadius: "50%", background: "#3a165c", border: `10px solid ${INK}` }} />
      <Character x={560} y={1000} scale={1.05} expr="focus" mouth="smile" pose="chin" glow={0.4} seed={530} />
      {/* silueta del otro, detrás, al otro lado */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.85 * prog(f, 10, 40), filter: "brightness(.25)" }}>
        <Character x={1780} y={900} scale={0.7} galaxy={false} head="#000" hoodie="#000" pants="#000" expr="focus" mouth="flat" flip seed={531} />
      </div>
      <div style={{ position: "absolute", left: 1000, top: 200, width: 820, fontFamily: FONT, fontWeight: 700, fontSize: 84, lineHeight: 1.05, color: "#fff", WebkitTextStroke: `10px ${INK}`, paintOrder: "stroke fill", textShadow: `0 8px 0 ${INK}`, opacity: prog(f, 4, 16) }}>
        Who is the <span style={{ color: "#ff5a7a" }}>other</span> mind?
      </div>
      {f > tPart && (
        <div style={{ position: "absolute", left: 1000, top: 440, transform: `scale(${pop(f, tPart)}) rotate(-3deg)`, transformOrigin: "left center", fontFamily: FONT, fontWeight: 700, fontSize: 70, color: INK, background: "#ffd36b", padding: "6px 30px", borderRadius: 16, border: `6px solid ${INK}`, boxShadow: `0 8px 0 ${INK}` }}>
          PART 2 — COMING SOON
        </div>
      )}
      {f > tCom && (
        <div style={{ position: "absolute", left: 1000, top: 620, transform: `scale(${pop(f, tCom)})`, transformOrigin: "left center", fontFamily: FONT, fontWeight: 700, fontSize: 42, color: INK, background: "#fff", padding: "12px 30px", borderRadius: 40, border: `6px solid ${INK}`, boxShadow: `0 8px 0 ${INK}` }}>
          💬 What happens next?
        </div>
      )}
      {f > tSub && (
        <div style={{ position: "absolute", left: 1000, top: 750, transform: `scale(${pop(f, tSub)})`, transformOrigin: "left center", fontFamily: FONT, fontWeight: 700, fontSize: 52, color: "#fff", background: "#e62117", padding: "14px 44px", borderRadius: 16, border: `6px solid ${INK}`, boxShadow: `0 8px 0 ${INK}` }}>
          SUBSCRIBE 🔔
        </div>
      )}
      <Title at={tImg} x={1420} y={960} text="IMAGINE THIS" size={80} color="#ffd36b" rotate={0} />
      <Dust n={30} color="#fff" seed="ou" />
    </Cam>
  );
};
