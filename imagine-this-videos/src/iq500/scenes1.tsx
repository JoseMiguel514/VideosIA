import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Character } from "../lib/Character";
import { Cam, City, Dust, FONT, Grade, H, INK, Label, pop, prog, Rays, Sky, Stars, Title, W } from "../lib/scene";
import { at, D } from "./timeline";

/* ============ 1. HOOK: despertar con IQ 500 ============ */
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("hook");
  const tDiff = at("hook", "different");
  const tMind = at("hook", "mind...");
  const t500 = at("hook", "five");
  const ring = f < 50 ? Math.sin(f * 2.2) * 6 : 0;
  const glow = interpolate(f, [tMind, tMind + 30, t500, t500 + 20], [0, 0.5, 0.5, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Cam dur={d} from={[1.35, -260, 60]} to={[1, 0, 0]}>
      {/* pared */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#3b2a55,#2a1d3d 70%,#1e1530)" }} />
      {/* ventana con amanecer desenfocado */}
      <div style={{ position: "absolute", left: 1180, top: 150, width: 560, height: 520, overflow: "hidden", borderRadius: 8, border: `14px solid #1c132c` }}>
        <div style={{ position: "absolute", inset: 0, filter: "blur(5px)" }}>
          <Sky stops={["#f6b26b", "#f08a7a 40%", "#9a6fb0 80%"]} sun={{ x: 280, y: 360, r: 46, color: "#ffe1a1" }} />
          <div style={{ position: "absolute", left: -1180, top: -150 }}>
            <City base={670} color="#5a4070" seed="hk" h={[60, 200]} windows="#ffd59a" x0={1100} x1={1800} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 266, top: 0, width: 14, height: "100%", background: "#1c132c" }} />
        <div style={{ position: "absolute", top: 250, left: 0, width: "100%", height: 14, background: "#1c132c" }} />
      </div>
      <Rays x={1450} y={420} opacity={0.06} />
      {/* luz de ventana en el piso */}
      <div style={{ position: "absolute", left: 900, top: 820, width: 900, height: 260, background: "linear-gradient(90deg, transparent, rgba(255,200,140,.18))", transform: "skewX(-30deg)" }} />
      {/* piso */}
      <div style={{ position: "absolute", left: 0, top: 880, width: W, height: 200, background: "linear-gradient(#24182f,#140d1e)" }} />
      {/* cama */}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect x={180} y={640} width={60} height={290} rx={10} fill="#3a2a4f" stroke={INK} strokeWidth={5} />
        <rect x={200} y={740} width={760} height={150} rx={18} fill="#4b3a6a" stroke={INK} strokeWidth={5} />
        <path d="M230 740 q120 -70 300 -30 q180 20 430 -10 v60 h-730z" fill="#7a6aa8" stroke={INK} strokeWidth={5} />
        <rect x={250} y={690} width={180} height={60} rx={26} fill="#e9e3f5" stroke={INK} strokeWidth={5} />
        {/* mesita + reloj */}
        <rect x={20} y={760} width={140} height={130} rx={8} fill="#2d2240" stroke={INK} strokeWidth={5} />
        <g transform={`translate(${90 + ring} 720) rotate(${ring})`}>
          <rect x={-60} y={-36} width={120} height={72} rx={14} fill="#16101f" stroke={INK} strokeWidth={5} />
          <text x={0} y={14} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={38} fill={f < 50 && Math.floor(f / 6) % 2 ? "#ff5a5a" : "#ff8a8a"}>
            7:00
          </text>
        </g>
        {f < 50 && (
          <g stroke="#ff8a8a" strokeWidth={4} strokeLinecap="round" opacity={Math.floor(f / 4) % 2 ? 1 : 0.4}>
            <path d="M18 668 l-14 -14 M160 668 l14 -14 M90 650 v-20" />
          </g>
        )}
      </svg>
      <Character x={1080} y={960} scale={1.05} expr={f < tDiff ? "focus" : "wide"} mouth={f < tDiff ? "flat" : "o"} look={f < tDiff ? [0, 0] : [-0.3, -0.6]} glow={glow} pose={f > t500 ? "shrug" : "down"} />
      <Dust n={30} />
      <Title at={t500} x={560} y={330} text="IQ: 500" size={170} color="#ffd36b" />
      <Label at={tMind} x={1080} y={250} text="something changed" size={34} out={t500 - 4} />
      <Grade tint="rgba(255,170,120,.25)" />
    </Cam>
  );
};

/* ============ 2. ESCALA: la campana de IQ ============ */
const iqX = (iq: number) => 260 + (iq - 55) * 11.5; // 55→260, 175→1640
const curveY = (iq: number) => 860 - 560 * Math.exp(-((iq - 100) ** 2) / (2 * 15 * 15));
const bellPath = () => {
  let d = "";
  for (let q = 40; q <= 190; q += 1) d += `${q === 40 ? "M" : "L"}${iqX(q)} ${curveY(q)} `;
  return d;
};
export const Scale: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("scale");
  const draw = prog(f, 5, 60);
  const tAvg = at("scale", "average");
  const tGift = at("scale", "gifted");
  const tEin = at("scale", "Einstein?");
  const marker = (iq: number, t: number, text: string, color: string) => {
    const s = pop(f, t);
    if (f < t) return null;
    return (
      <g opacity={Math.min(1, s * 2)}>
        <line x1={iqX(iq)} y1={860} x2={iqX(iq)} y2={curveY(iq) - 10} stroke={color} strokeWidth={4} strokeDasharray="10 8" />
        <circle cx={iqX(iq)} cy={curveY(iq)} r={12 * s} fill={color} stroke={INK} strokeWidth={4} />
        <text x={iqX(iq)} y={905} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={44} fill={color}>
          {iq}
        </text>
        <text x={iqX(iq)} y={curveY(iq) - 40} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill="#fff" letterSpacing={3}>
          {text}
        </text>
      </g>
    );
  };
  return (
    <Cam dur={d} from={[1.05, 0, 20]} to={[1.12, -40, 10]}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #2a2466, #120f30 60%, #07061a)" }} />
      <Stars n={90} />
      {/* rejilla */}
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.04) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.04) 2px, transparent 2px)", backgroundSize: "80px 80px" }} />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <linearGradient id="bellFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#22d3c5" stopOpacity=".45" />
            <stop offset="1" stopColor="#22d3c5" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1={200} y1={860} x2={1720} y2={860} stroke="#fff" strokeOpacity={0.6} strokeWidth={4} />
        <path d={bellPath() + ` L${iqX(190)} 860 L${iqX(40)} 860 Z`} fill="url(#bellFill)" opacity={draw} />
        <path d={bellPath()} fill="none" stroke="#22d3c5" strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={`${draw} 1`} />
        {marker(100, tAvg, "AVERAGE", "#ffd36b")}
        {marker(130, tGift, "GIFTED", "#ff8a3d")}
        {marker(160, tEin, "EINSTEIN (ESTIMATED)", "#ff4fa3")}
      </svg>
      <Label at={4} x={W / 2} y={70} text="The IQ scale" size={48} />
      {/* personajes sobre la curva */}
      <Character x={iqX(100) - 120} y={858} scale={0.42} expr="neutral" pose="point" look={[1, -0.3]} seed={1} opacity={prog(f, tAvg - 6, tAvg + 6)} />
      {f > tEin && <Character x={iqX(160) + 190} y={858} scale={0.42} galaxy={false} head="#3b3f55" hoodie="#9aa3b5" hair="messy" expr="smirk" mouth="smile" seed={2} opacity={prog(f, tEin, tEin + 10)} />}
      <Dust n={20} color="#bffcf2" />
      <Grade vignette={0.7} />
    </Cam>
  );
};

/* ============ 3. IMPOSIBLE: 500 está fuera de la escala ============ */
export const Impossible: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("impossible");
  // mundo largo: de IQ 60 a 520, 10 px por punto
  const X = (iq: number) => 300 + (iq - 60) * 10;
  const pan = interpolate(f, [10, d - 60], [0, X(500) - 1300], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => t * t * (3 - 2 * t) });
  const tNo = at("impossible", "human");
  let curve = "";
  for (let q = 40; q <= 540; q += 2) curve += `${q === 40 ? "M" : "L"}${X(q)} ${820 - 420 * Math.exp(-((q - 100) ** 2) / 450)} `;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #1d1a4f, #0c0a24 60%, #05040f)" }} />
      <Stars n={140} />
      <AbsoluteFill style={{ transform: `translateX(${-pan}px)` }}>
        <svg width={6000} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <line x1={100} y1={820} x2={X(540)} y2={820} stroke="#fff" strokeOpacity={0.6} strokeWidth={4} />
          <path d={curve} fill="none" stroke="#22d3c5" strokeWidth={7} />
          {[100, 150, 200, 250, 300, 350, 400, 450, 500].map((q) => (
            <g key={q}>
              <line x1={X(q)} y1={810} x2={X(q)} y2={835} stroke="#fff" strokeWidth={4} />
              <text x={X(q)} y={880} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={q === 500 ? 64 : 40} fill={q === 500 ? "#ffd36b" : "#fff"} opacity={q === 500 ? 1 : 0.7}>
                {q}
              </text>
            </g>
          ))}
          {/* "aquí ya no hay nadie" */}
          <text x={X(250)} y={760} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={34} fill="#fff" opacity={0.5}>
            nobody here...
          </text>
          <text x={X(380)} y={760} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={34} fill="#fff" opacity={0.4}>
            still nobody...
          </text>
        </svg>
        {/* multitud en el promedio */}
        {Array.from({ length: 7 }).map((_, i) => (
          <Character key={i} x={X(85) + i * 48} y={818} scale={0.26} galaxy={false} head={["#3b3f55", "#2b2d3a", "#474b63"][i % 3]} hoodie={["#e2453a", "#f2c14e", "#6c8cff", "#9aa3b5"][i % 4]} expr="neutral" seed={i + 5} />
        ))}
        <Character x={X(500)} y={818} scale={0.5} expr={f > tNo ? "sad" : "neutral"} mouth={f > tNo ? "flat" : "o"} pose="shrug" glow={0.7} seed={3} look={[-1, 0]} />
      </AbsoluteFill>
      <Label at={at("impossible", "scale")} x={W / 2} y={90} text="~27 standard deviations above average" size={40} color="#ffd36b" />
      <Grade vignette={0.75} />
    </AbsoluteFill>
  );
};

/* ============ 4. MAÑANA: todo son patrones ============ */
export const Morning: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("morning");
  const tPat = at("morning", "patterns.");
  const tSteam = at("morning", "steam");
  const tTraffic = at("morning", "traffic");
  const tSolved = at("morning", "solved");
  const steam = prog(f, tSteam, tSteam + 40);
  return (
    <Cam dur={d} from={[1.02, 0, 0]} to={[1.12, -60, -10]}>
      {/* cocina: pared cálida */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#f2c79a,#e3a47a 60%,#c98762)" }} />
      {/* ventana con tráfico */}
      <div style={{ position: "absolute", left: 160, top: 140, width: 760, height: 460, overflow: "hidden", border: "16px solid #7a4a3a", borderRadius: 10, background: "#bfe3f2" }}>
        <div style={{ position: "absolute", inset: 0, filter: "blur(3px)" }}>
          <Sky stops={["#cfeaf7", "#a8d4ea"]} />
          <div style={{ position: "absolute", left: -200, top: -480 }}>
            <City base={900} color="#8fb3c9" seed="mw" h={[120, 300]} x0={150} x1={1000} />
          </div>
          <div style={{ position: "absolute", left: 0, top: 360, width: 760, height: 100, background: "#6d7f8c" }} />
          {Array.from({ length: 6 }).map((_, i) => {
            const x = ((f * (4 + (i % 3)) + i * 180) % 1000) - 150;
            return <div key={i} style={{ position: "absolute", left: i % 2 ? 760 - x : x, top: 372 + (i % 2) * 40, width: 110, height: 34, borderRadius: 10, background: ["#e2453a", "#f2c14e", "#4a6cd4", "#22c3b6"][i % 4] }} />;
          })}
        </div>
        {/* líneas de patrón sobre el tráfico */}
        {f > tTraffic && (
          <svg width={760} height={460} style={{ position: "absolute", left: 0, top: 0 }}>
            <path d="M0 390 C 200 330, 400 450, 760 390" stroke="#22d3c5" strokeWidth={4} fill="none" strokeDasharray="12 10" pathLength={1} opacity={prog(f, tTraffic, tTraffic + 20)} />
            <path d="M0 430 C 260 470, 500 370, 760 430" stroke="#ff4fa3" strokeWidth={4} fill="none" strokeDasharray="12 10" opacity={prog(f, tTraffic + 8, tTraffic + 28)} />
          </svg>
        )}
      </div>
      {/* encimera */}
      <div style={{ position: "absolute", left: 0, top: 760, width: W, height: 320, background: "linear-gradient(#6b3f2c,#4a2a1e)" }} />
      <div style={{ position: "absolute", left: 0, top: 740, width: W, height: 30, background: "#8a5a40" }} />
      {/* taza con vapor */}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d="M1310 640 h130 v80 q0 40 -40 40 h-50 q-40 0 -40 -40z" fill="#f4f1ea" stroke={INK} strokeWidth={6} />
        <path d="M1440 660 q40 0 40 30 q0 30 -40 30" fill="none" stroke={INK} strokeWidth={10} />
        <ellipse cx={1375} cy={642} rx={62} ry={12} fill="#5a3320" />
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M${1345 + i * 30} 620 q-20 -40 0 -80 q20 -40 0 -80`}
            stroke={f > tPat ? "#22d3c5" : "#ffffff"}
            strokeOpacity={0.7}
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
            transform={`translate(0 ${-((f * 1.5 + i * 20) % 30)})`}
          />
        ))}
        {/* geometría que aparece en el vapor */}
        {f > tSteam && (
          <g opacity={steam} stroke="#22d3c5" strokeWidth={3} fill="none">
            <circle cx={1375} cy={440} r={60 * steam} />
            <polygon points="1375,370 1435,475 1315,475" />
            <path d="M1300 440 h150 M1375 370 v140" strokeDasharray="6 6" />
          </g>
        )}
      </svg>
      <Character x={1640} y={1000} scale={1.0} expr="focus" mouth="flat" look={[-1, -0.4]} pose="hold" glow={f > tPat ? 0.35 : 0} />
      <Label at={tSteam} x={1375} y={260} text="fluid dynamics" size={32} color="#1a1030" />
      <Label at={tTraffic} x={540} y={90} text="traffic flow" size={32} color="#1a1030" />
      {[[1375, 330], [540, 160]].map(([x, y], i) =>
        f > tSolved + i * 5 ? (
          <div key={i} style={{ position: "absolute", left: x + 120, top: y - 20, transform: `scale(${pop(f, tSolved + i * 5)})`, fontFamily: FONT, fontWeight: 700, fontSize: 64, color: "#3ee08a", textShadow: `0 0 20px #3ee08a` }}>
            ✓
          </div>
        ) : null,
      )}
      <Dust n={25} color="#fff6e0" />
      <Grade tint="rgba(255,190,120,.2)" vignette={0.5} />
    </Cam>
  );
};

/* ============ 5. APRENDER: libro + idiomas en el autobús ============ */
export const Learning: React.FC = () => {
  const f = useCurrentFrame();
  const d = D("learning");
  const tBus = at("learning", "Spanish") - 8;
  const pages = Math.round(interpolate(f, [8, tBus - 10], [1, 300], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const tFive = at("learning", "five");
  if (f < tBus) {
    const flip = (f * 0.6) % 1;
    return (
      <Cam dur={tBus} from={[1.1, 0, 0]} to={[1.25, 0, 20]}>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #f7d9a8, #d99a62 70%, #a86a42)" }} />
        <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
          {/* mesa */}
          <rect x={0} y={760} width={W} height={320} fill="#7a4a30" />
          {/* libro abierto */}
          <path d="M560 700 L960 740 L960 420 L560 380 Z" fill="#fff9ec" stroke={INK} strokeWidth={6} />
          <path d="M1360 700 L960 740 L960 420 L1360 380 Z" fill="#fff9ec" stroke={INK} strokeWidth={6} />
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={i} x1={600} y1={440 + i * 32} x2={920} y2={472 + i * 32} stroke="#b9ad98" strokeWidth={6} strokeLinecap="round" />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`r${i}`} x1={1000} y1={472 + i * 32} x2={1320} y2={440 + i * 32} stroke="#b9ad98" strokeWidth={6} strokeLinecap="round" />
          ))}
          {/* página volteándose */}
          <g transform={`translate(960 0) scale(${Math.cos(flip * Math.PI)} 1) translate(-960 0)`}>
            <path d="M1360 700 L960 740 L960 420 L1360 380 Z" fill={flip < 0.5 ? "#fffdf6" : "#f2ead8"} stroke={INK} strokeWidth={5} />
          </g>
          {/* tostada humeante */}
          <ellipse cx={1600} cy={780} rx={170} ry={38} fill="#f4f1ea" stroke={INK} strokeWidth={5} />
          <rect x={1520} y={690} width={160} height={90} rx={26} fill="#e0a45a" stroke={INK} strokeWidth={5} />
          <rect x={1540} y={706} width={120} height={60} rx={18} fill="#f2c77e" />
          {[0, 1].map((i) => (
            <path key={i} d={`M${1570 + i * 50} 670 q-16 -30 0 -60 q16 -30 0 -60`} stroke="#fff" strokeOpacity={0.6} strokeWidth={6} fill="none" strokeLinecap="round" />
          ))}
        </svg>
        <div style={{ position: "absolute", left: 960, top: 230, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 700, fontSize: 90, color: "#fff", WebkitTextStroke: `10px ${INK}`, paintOrder: "stroke fill" }}>
          page {pages}/300
        </div>
        <Label at={at("learning", "toast")} x={1600} y={520} text="still warm" size={30} />
        <Grade tint="rgba(255,170,90,.2)" vignette={0.55} />
      </Cam>
    );
  }
  const g = f - tBus;
  const words = ["HOLA", "BONJOUR", "CIAO", "HALLO", "OLÁ"];
  return (
    <Cam dur={d - tBus} from={[1, 0, 0]} to={[1.08, 0, 0]}>
      {/* interior de autobús */}
      <AbsoluteFill style={{ background: "#2e3b52" }} />
      <div style={{ position: "absolute", left: 0, top: 130, width: W, height: 470, overflow: "hidden", background: "#9cc6e0" }}>
        <div style={{ position: "absolute", inset: 0, filter: "blur(6px)", transform: `translateX(${-((g * 22) % 900)}px)`, width: W + 900 }}>
          <City base={470} color="#6f93ad" seed="bus" h={[150, 380]} x0={0} x1={W + 900} windows="#e9f4ff" />
        </div>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ position: "absolute", left: i * 520 - 20, top: 0, width: 40, height: 470, background: "#2e3b52" }} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, top: 600, width: W, height: 480, background: "linear-gradient(#3b4a66,#26314a)" }} />
      <div style={{ position: "absolute", left: 1380, top: 100, width: 22, height: 900, background: "#c9cfd8", borderRadius: 10 }} />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 60 + i * 340, top: 640, width: 260, height: 200, borderRadius: 26, background: "#d0563f", border: `6px solid ${INK}` }} />
      ))}
      <Character x={1250} y={1010} scale={1} expr="focus" mouth="flat" look={[-0.4, 0]} pose={{ l: { s: 8, e: 4 }, r: { s: 150, e: 8 } }} talking={g > 6 && g < tFive - tBus + 40} />
      {words.map((w, i) => {
        const t = at("learning", "Spanish") + i * Math.max(6, (tFive - at("learning", "Spanish")) / 5);
        const s = pop(f, t);
        if (f < t) return null;
        const pos = [
          [820, 220],
          [560, 330],
          [940, 400],
          [620, 520],
          [1000, 600],
        ][i];
        return (
          <div key={w} style={{ position: "absolute", left: pos[0], top: pos[1], transform: `translate(-50%,-50%) scale(${s})`, fontFamily: FONT, fontWeight: 700, fontSize: 56, color: INK, background: "#fff", padding: "12px 30px", borderRadius: 40, border: `6px solid ${INK}`, boxShadow: "0 8px 0 rgba(0,0,0,.3)" }}>
            {w}
          </div>
        );
      })}
      <Title at={tFive} x={W / 2} y={880} text="5 LANGUAGES" size={100} color="#ffd36b" />
      <Grade vignette={0.5} />
    </Cam>
  );
};
