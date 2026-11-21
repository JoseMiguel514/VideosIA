import React from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  Easing,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadCinzel } from "@remotion/google-fonts/Cinzel";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import guion from "../scripts/guion.json";
import duraciones from "./duraciones.json";
import { Person, TrojanHorse, Flame } from "./Characters";
import { Columns, Embers, GROUND, Ground, Pyre, Sea, Sky, Vignette, Walls } from "./Scenery";

const { fontFamily: titleFont } = loadCinzel("normal", { weights: ["900"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadMontserrat("normal", { weights: ["800", "900"], subsets: ["latin"] });

const FPS = 30;
const LEAD = 8;
const TAIL = 14;
const GOLD = "#ffcc4d";
const RED = "#e2453a";

type SceneId = "hook" | "asedio" | "homero" | "virgilio" | "ulises" | "noche" | "teorias" | "outro";
const textOf = (id: SceneId) => guion.find((g) => g.id === id)!.texto;
const voiceDur = (id: SceneId) => (duraciones as Record<string, number>)[id];

const ORDER: SceneId[] = ["hook", "asedio", "homero", "virgilio", "ulises", "noche", "teorias", "outro"];
const sceneFrames = (id: SceneId) => LEAD + Math.ceil(voiceDur(id) * FPS) + TAIL + (id === "outro" ? 30 : 0);
const STARTS: Record<string, number> = {};
let acc = 0;
for (const id of ORDER) {
  STARTS[id] = acc;
  acc += sceneFrames(id);
}
const TOTAL = acc;

/* ---------- word timing (proportional to characters) ---------- */
const words = (text: string) => text.split(/\s+/).filter(Boolean);
const wordTimes = (id: SceneId) => {
  const ws = words(textOf(id));
  const weights = ws.map((w) => w.replace(/[^\p{L}\p{N}]/gu, "").length + 1.5 + (/[.,:?!]$/.test(w) ? 5 : 0));
  const total = weights.reduce((a, b) => a + b, 0);
  const dur = voiceDur(id) * FPS;
  let c = 0;
  return ws.map((w, i) => {
    const start = LEAD + (c / total) * dur;
    c += weights[i];
    return { w, start, end: LEAD + (c / total) * dur };
  });
};
const timeOfWord = (id: SceneId, needle: string) => {
  const t = wordTimes(id).find((x) => x.w.toLowerCase().includes(needle.toLowerCase()));
  return t ? t.start : 0;
};

const Captions: React.FC<{ id: SceneId; top?: number }> = ({ id, top = 300 }) => {
  const f = useCurrentFrame();
  const ts = wordTimes(id);
  // chunk into groups of max 3 words
  const chunks: (typeof ts)[] = [];
  let cur: typeof ts = [];
  ts.forEach((t) => {
    cur.push(t);
    if (cur.length >= 3 || /[.,:?!]$/.test(t.w)) {
      chunks.push(cur);
      cur = [];
    }
  });
  if (cur.length) chunks.push(cur);
  const chunk = chunks.find((c) => f < c[c.length - 1].end + 2) ?? chunks[chunks.length - 1];
  if (f < chunk[0].start - 3) return null;
  const chunkPop = spring({ frame: f - chunk[0].start + 3, fps: FPS, config: { damping: 12, mass: 0.5 } });
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 70,
        right: 70,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 40px",
        transform: `scale(${interpolate(chunkPop, [0, 1], [0.8, 1])})`,
      }}
    >
      {chunk.map((t, i) => {
        const active = f >= t.start && f < t.end + 2;
        return (
          <span
            key={i}
            style={{
              fontFamily: bodyFont,
              fontWeight: 900,
              fontSize: 92,
              lineHeight: 1.15,
              textTransform: "uppercase",
              color: active ? GOLD : "white",
              WebkitTextStroke: "14px #120800",
              paintOrder: "stroke fill",
              transform: `scale(${active ? 1.1 : 1}) rotate(${active ? -2 : 0}deg)`,
              display: "inline-block",
              textShadow: "0 8px 0 rgba(0,0,0,0.5)",
            }}
          >
            {t.w}
          </span>
        );
      })}
    </div>
  );
};

/* ---------- helpers ---------- */
const Cam: React.FC<{ children: React.ReactNode; dur: number; zoom?: [number, number]; origin?: string }> = ({
  children,
  dur,
  zoom = [1, 1.1],
  origin = "50% 70%",
}) => {
  const f = useCurrentFrame();
  const enter = spring({ frame: f, fps: FPS, config: { damping: 16 } });
  const z = interpolate(f, [0, dur], zoom);
  const s = z * interpolate(enter, [0, 1], [1.25, 1]);
  const blur = interpolate(enter, [0, 1], [12, 0]);
  return (
    <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: origin, filter: `blur(${blur}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

const PopIn: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; from?: number }> = ({
  at,
  children,
  style,
  from = 0.3,
}) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - at, fps: FPS, config: { damping: 11, mass: 0.6 } });
  return (
    <div style={{ position: "absolute", opacity: Math.min(1, s * 2), transform: `scale(${interpolate(s, [0, 1], [from, 1])})`, ...style }}>
      {children}
    </div>
  );
};

const Enter: React.FC<{ at?: number; dx?: number; dy?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  at = 0,
  dx = 0,
  dy = 0,
  children,
  style,
}) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - at, fps: FPS, config: { damping: 14 } });
  return (
    <div style={{ position: "absolute", transform: `translate(${(1 - s) * dx}px, ${(1 - s) * dy}px)`, opacity: s > 0.01 ? 1 : 0, ...style }}>
      {children}
    </div>
  );
};

/** places a character with its feet on the ground line */
const Stand: React.FC<{ x: number; h: number; children: React.ReactNode; y?: number }> = ({ x, h, children, y = GROUND + 20 }) => (
  <div style={{ position: "absolute", left: x - (h * 300) / 520 / 2, top: y - h }}>{children}</div>
);

const Badge: React.FC<{ children: React.ReactNode; color?: string; size?: number; rotate?: number }> = ({
  children,
  color = RED,
  size = 90,
  rotate = -5,
}) => (
  <div
    style={{
      fontFamily: titleFont,
      fontWeight: 900,
      fontSize: size,
      color,
      border: `10px solid ${color}`,
      borderRadius: 20,
      padding: "6px 34px",
      background: "rgba(20,8,0,0.75)",
      transform: `rotate(${rotate}deg)`,
      whiteSpace: "nowrap",
      textAlign: "center",
    }}
  >
    {children}
  </div>
);

/* ---------- scenes ---------- */

const Hook: React.FC = () => {
  const dur = sceneFrames("hook");
  const stamp = timeOfWord("hook", "Ilíada");
  const f = useCurrentFrame();
  const shake = f > stamp && f < stamp + 12 ? Math.sin(f * 4) * 14 : 0;
  return (
    <AbsoluteFill style={{ transform: `translate(${shake}px, ${shake * 0.5}px)` }}>
      <Cam dur={dur} zoom={[1, 1.12]}>
        <Sky mode="dusk" />
        <Walls y={1080} />
        <Ground />
        <div style={{ position: "absolute", left: 90, top: 760 }}>
          <TrojanHorse width={900} />
        </div>
        <Stand x={110} h={330}>
          <Person robe="#4f7fb8" hair="#2a1a10" expression="surprised" seed={1} flip />
        </Stand>
        <Stand x={980} h={300}>
          <Person robe="#8a4fb8" hair="#5a3a20" beard="#5a3a20" expression="surprised" seed={2} />
        </Stand>
      </Cam>
      <Embers count={18} />
      <PopIn at={stamp} from={2.5} style={{ left: 0, right: 0, top: 640, display: "flex", justifyContent: "center" }}>
        <Badge>NO sale en la Ilíada</Badge>
      </PopIn>
      <Sequence from={Math.round(stamp)} layout="none">
        <Audio src={staticFile("sfx/boom.wav")} volume={0.7} />
      </Sequence>
    </AbsoluteFill>
  );
};

const Asedio: React.FC = () => {
  const dur = sceneFrames("asedio");
  const f = useCurrentFrame();
  const years = Math.round(interpolate(f, [15, 70], [1, 10], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const march = (i: number) => Math.abs(Math.sin(f / 5 + i)) * -14;
  return (
    <AbsoluteFill>
      <Cam dur={dur} zoom={[1.05, 1.15]}>
        <Sky mode="day" />
        <Sea />
        <div style={{ position: "absolute", left: 420, top: 0, width: 1080, height: 1920, transform: "scale(0.75)", transformOrigin: "100% 1640px" }}>
          <Walls y={950} />
        </div>
        <Ground color="#e0c48a" color2="#a08050" />
        {[150, 400, 650, 900].map((x, i) => (
          <div key={x} style={{ position: "absolute", left: 0, top: march(i) }}>
            <Stand x={x} h={i % 2 ? 460 : 500}>
              <Person armor head="helmet" prop="shield" robe="#a8322a" beard={i % 2 ? "#3b2414" : null} seed={i} talking={false} />
            </Stand>
          </div>
        ))}
      </Cam>
      <PopIn at={15} style={{ left: 0, right: 0, top: 660, display: "flex", justifyContent: "center" }}>
        <Badge color={GOLD} size={130} rotate={0}>
          {years} {years === 1 ? "AÑO" : "AÑOS"}
        </Badge>
      </PopIn>
    </AbsoluteFill>
  );
};

const Homero: React.FC = () => {
  const dur = sceneFrames("homero");
  const noHorse = timeOfWord("homero", "caballo");
  return (
    <AbsoluteFill>
      <Cam dur={dur} zoom={[1, 1.1]}>
        <Sky mode="night" />
        <Ground color="#3a2a20" color2="#1a100a" />
        <Pyre x={780} y={GROUND} scale={1.1} />
        {[650, 900].map((x, i) => (
          <Stand key={x} x={x} h={260}>
            <Person robe="#2a2a3a" hair="#111" seed={i + 5} />
          </Stand>
        ))}
        <Stand x={330} h={720}>
          <Person robe="#f3ead6" hair={null} beard="#eeeeee" longBeard blind prop="lyre" talking seed={3} />
        </Stand>
      </Cam>
      <Embers count={30} />
      <PopIn at={timeOfWord("homero", "Homero")} style={{ left: 80, top: 650 }}>
        <Badge color={GOLD} size={64} rotate={-3}>HOMERO · s. VIII a.C.</Badge>
      </PopIn>
      <PopIn at={noHorse} from={2} style={{ right: 80, top: 820 }}>
        <div style={{ position: "relative", width: 260, height: 260 }}>
          <TrojanHorse width={260} />
          <svg width="260" height="260" style={{ position: "absolute", left: 0, top: 0 }}>
            <line x1="20" y1="20" x2="240" y2="240" stroke={RED} strokeWidth="26" strokeLinecap="round" />
            <line x1="240" y1="20" x2="20" y2="240" stroke={RED} strokeWidth="26" strokeLinecap="round" />
          </svg>
        </div>
      </PopIn>
    </AbsoluteFill>
  );
};

const Virgilio: React.FC = () => {
  const dur = sceneFrames("virgilio");
  const f = useCurrentFrame();
  const t0 = timeOfWord("virgilio", "Más");
  const year = Math.round(
    interpolate(f, [t0 - 20, t0 + 20], [1180, 19], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    }),
  );
  return (
    <AbsoluteFill>
      <Cam dur={dur} zoom={[1, 1.08]}>
        <Columns />
        <Ground color="#9a8a70" color2="#4a3a2a" />
        <Stand x={540} h={640}>
          <Person robe="#f6f1e6" hair="#4a2e18" head="laurel" prop="scroll" talking seed={4} />
        </Stand>
        <div style={{ position: "absolute", left: 830, top: 1420 }}>
          <svg width="160" height="220" viewBox="0 0 160 220" style={{ overflow: "visible" }}>
            <rect x="60" y="80" width="40" height="140" fill="#c9a77a" />
            <path d="M40 80 Q80 50 120 80 Z" fill="#c99a3a" />
            <Flame x={80} y={40} size={0.9} />
          </svg>
        </div>
      </Cam>
      <PopIn at={timeOfWord("virgilio", "Virgilio")} style={{ left: 80, top: 650 }}>
        <Badge color={GOLD} size={64} rotate={-3}>VIRGILIO · ROMA</Badge>
      </PopIn>
      <PopIn at={t0 - 20} style={{ left: 0, right: 0, top: 800, display: "flex", justifyContent: "center" }}>
        <Badge color={year === 19 ? RED : GOLD} size={110} rotate={2}>
          {year} a.C.
        </Badge>
      </PopIn>
    </AbsoluteFill>
  );
};

const Ulises: React.FC = () => {
  const dur = sceneFrames("ulises");
  const inside = timeOfWord("ulises", "soldados");
  const f = useCurrentFrame();
  const cut = f >= inside;
  return (
    <AbsoluteFill>
      <Cam dur={dur} zoom={[1, 1.12]} origin="60% 60%">
        <Sky mode="dusk" />
        <Ground color="#c79a5e" color2="#7a5530" />
        <Enter at={timeOfWord("ulises", "caballo")} dx={900} style={{ left: 190, top: 760 }}>
          <TrojanHorse width={840} cutaway={cut} wheelTurn={f * 4} />
        </Enter>
        <Stand x={270} h={720}>
          <Person armor head="helmet" crest="#1d5fa8" robe="#1d5fa8" beard="#5a2e14" expression="sly" shh={f > 15 && f < inside} talking={f >= inside} seed={6} />
        </Stand>
      </Cam>
      <PopIn at={timeOfWord("ulises", "Ulises")} style={{ left: 80, top: 650 }}>
        <Badge color={GOLD} size={68} rotate={-3}>ULISES</Badge>
      </PopIn>
    </AbsoluteFill>
  );
};

const Noche: React.FC = () => {
  const dur = sceneFrames("noche");
  const f = useCurrentFrame();
  const night = timeOfWord("noche", "noche");
  const gate = timeOfWord("noche", "abrieron");
  const hatch = interpolate(f, [night, night + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rope = interpolate(f, [night + 10, night + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gateOpen = interpolate(f, [gate, gate + 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glow = interpolate(f, [gate, dur], [0, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Cam dur={dur} zoom={[1, 1.15]}>
        <Sky mode="night" />
        <Walls y={1000} night gateOpen={gateOpen} />
        <Ground color="#3a3a50" color2="#1a1a28" />
        <div style={{ position: "absolute", left: 150, top: 820 }}>
          <TrojanHorse width={800} hatchOpen={hatch} />
        </div>
        {/* rope + soldier sliding down */}
        <div style={{ position: "absolute", left: 545, top: 1230, width: 8, height: 400 * rope, background: "#c9a77a" }} />
        {rope > 0 && (
          <div style={{ position: "absolute", left: 470, top: 1100 + rope * 230 }}>
            <Person armor head="helmet" robe="#a8322a" seed={9} height={300} />
          </div>
        )}
        {gateOpen > 0 && (
          <Enter at={gate + 5} dx={-300} style={{ left: 760, top: GROUND + 20 - 330 }}>
            <Person armor head="helmet" prop="torch" robe="#a8322a" seed={10} height={330} />
          </Enter>
        )}
      </Cam>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 80%, rgba(255,90,20,${glow}), transparent 70%)` }} />
      {glow > 0.1 && <Embers count={40} />}
      <PopIn at={timeOfWord("noche", "trofeo")} style={{ left: 0, right: 0, top: 680, display: "flex", justifyContent: "center" }}>
        <Badge color={GOLD} size={64} rotate={-2}>🏆 ¡UN REGALO!</Badge>
      </PopIn>
    </AbsoluteFill>
  );
};

const TheoryIcon: React.FC<{ kind: "ram" | "ship" | "quake" }> = ({ kind }) => {
  const f = useCurrentFrame();
  if (kind === "ram")
    return (
      <svg width="200" height="200" viewBox="0 0 200 200">
        <rect x="30" y="80" width="140" height="70" fill="#8a5a2a" stroke="#2a160b" strokeWidth="6" />
        <polygon points="20,85 100,30 180,85" fill="#c98a45" stroke="#2a160b" strokeWidth="6" />
        <rect x={10 + Math.sin(f / 4) * 10} y="105" width="180" height="20" rx="10" fill="#5a3212" />
        <circle cx="60" cy="160" r="18" fill="#3b2414" />
        <circle cx="140" cy="160" r="18" fill="#3b2414" />
      </svg>
    );
  if (kind === "ship")
    return (
      <svg width="200" height="200" viewBox="0 0 200 200">
        <path d="M20 130 L180 130 L155 170 L45 170 Z" fill="#5a3212" stroke="#2a160b" strokeWidth="6" />
        <path d="M180 130 Q200 100 185 85 L175 95" fill="#c98a45" stroke="#2a160b" strokeWidth="5" />
        <line x1="100" y1="130" x2="100" y2="25" stroke="#3b2414" strokeWidth="8" />
        <path d="M105 30 Q160 75 105 120 Z" fill="#f3ead6" stroke="#2a160b" strokeWidth="5" />
        <path d="M10 180 q20 -10 40 0 t40 0 t40 0 t40 0 t40 0" stroke="#5ab0d8" strokeWidth="6" fill="none" />
      </svg>
    );
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: `translateX(${Math.sin(f * 2) * 5}px)` }}>
      <rect x="40" y="60" width="120" height="110" fill="#c9a77a" stroke="#2a160b" strokeWidth="6" />
      {[50, 80, 110, 140].map((x) => (
        <rect key={x} x={x - 5} y="40" width="18" height="22" fill="#c9a77a" stroke="#2a160b" strokeWidth="4" />
      ))}
      <path d="M100 60 L85 95 L110 115 L90 170" fill="none" stroke="#2a160b" strokeWidth="7" />
      <path d="M10 180 L60 170 L80 185 L120 172 L150 186 L190 175" stroke="#7a4a20" strokeWidth="8" fill="none" />
    </svg>
  );
};

const Teorias: React.FC = () => {
  const dur = sceneFrames("teorias");
  const f = useCurrentFrame();
  const items = [
    { kind: "ram" as const, label: "Máquina de asedio", at: timeOfWord("teorias", "máquina") },
    { kind: "ship" as const, label: "Un barco", at: timeOfWord("teorias", "barco") },
    { kind: "quake" as const, label: "Un terremoto", at: timeOfWord("teorias", "terremoto") },
  ];
  const quake = items[2].at;
  const shake = f > quake && f < quake + 25 ? Math.sin(f * 3.3) * 12 : 0;
  return (
    <AbsoluteFill style={{ transform: `translate(${shake}px, ${-shake * 0.6}px)` }}>
      <Cam dur={dur} zoom={[1, 1.05]}>
        <Sky mode="dusk" />
        <Walls y={1150} scale={0.9} />
        <Ground />
        <Stand x={540} h={560}>
          <Person robe="#556b2f" hair="#3b2414" expression={f > quake ? "surprised" : "neutral"} talking={f < quake} seed={11} />
        </Stand>
      </Cam>
      <AbsoluteFill style={{ background: "rgba(10,4,0,0.35)" }} />
      {items.map((it, i) => (
        <PopIn key={it.kind} at={it.at} from={0.2} style={{ left: 60 + i * 330, top: 700 }}>
          <div
            style={{
              width: 300,
              padding: "24px 10px",
              borderRadius: 30,
              background: "rgba(25,12,4,0.85)",
              border: `6px solid ${GOLD}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              transform: `rotate(${(i - 1) * 3}deg)`,
            }}
          >
            <div style={{ fontFamily: titleFont, fontWeight: 900, fontSize: 70, color: GOLD }}>{i + 1}</div>
            <TheoryIcon kind={it.kind} />
            <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 40, color: "white", textAlign: "center", lineHeight: 1.1 }}>{it.label}</div>
          </div>
        </PopIn>
      ))}
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const dur = sceneFrames("outro");
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Cam dur={dur} zoom={[1, 1.06]}>
        <Sky mode="dusk" />
        <Walls y={1150} scale={0.9} />
        <Ground />
        <div style={{ position: "absolute", left: 240, top: 900 }}>
          <TrojanHorse width={700} />
        </div>
        <Stand x={210} h={560}>
          <Person armor head="helmet" crest="#1d5fa8" robe="#1d5fa8" beard="#5a2e14" wave talking seed={6} />
        </Stand>
        <Stand x={870} h={520}>
          <Person armor head="helmet" prop="shield" robe="#a8322a" expression="sly" seed={2} />
        </Stand>
      </Cam>
      <Embers count={15} />
      <PopIn at={40} style={{ left: 0, right: 0, top: 640, display: "flex", justifyContent: "center" }}>
        <Badge color={GOLD} size={110} rotate={-3}>¿1, 2 o 3?</Badge>
      </PopIn>
      <PopIn at={60} style={{ left: 0, right: 0, top: 1700, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 900,
            fontSize: 50,
            background: GOLD,
            color: "#1a0c05",
            padding: "20px 46px",
            borderRadius: 60,
            transform: `scale(${1 + Math.sin(f / 5) * 0.04})`,
          }}
        >
          Sígueme para más historia 🏛️
        </div>
      </PopIn>
    </AbsoluteFill>
  );
};

const SCENES: Record<SceneId, React.FC> = {
  hook: Hook,
  asedio: Asedio,
  homero: Homero,
  virgilio: Virgilio,
  ulises: Ulises,
  noche: Noche,
  teorias: Teorias,
  outro: Outro,
};

const ProgressBar: React.FC = () => {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", top: 0, left: 0, height: 12, width: `${(f / TOTAL) * 100}%`, background: GOLD }} />;
};

export const Reel: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "black" }}>
      {ORDER.map((id) => {
        const Scene = SCENES[id];
        return (
          <Sequence key={id} from={STARTS[id]} durationInFrames={sceneFrames(id)} name={id}>
            <Scene />
            <Vignette />
            <Captions id={id} />
            <Sequence from={LEAD} layout="none">
              <Audio src={staticFile(`voz/${id}.wav`)} volume={1} />
            </Sequence>
            {id !== "hook" && <Audio src={staticFile("sfx/whoosh.wav")} volume={0.35} />}
          </Sequence>
        );
      })}
      <Audio
        src={staticFile("musica.wav")}
        volume={(f) => interpolate(f, [0, 15, durationInFrames - 40, durationInFrames], [0, 0.22, 0.22, 0], { extrapolateRight: "clamp" })}
      />
      <ProgressBar />
    </AbsoluteFill>
  );
};

export const MyComposition = () => (
  <Composition id="CaballoDeTroya" component={Reel} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
