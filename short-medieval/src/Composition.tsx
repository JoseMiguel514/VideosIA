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
import voz from "./voz.json";
import { Cat, Cradle, INK, Pig, Rat, Toon } from "./Characters";
import { Badge, Banner, Field, GothicWindow, H, Room, Stamp, Village, Vignette, W, WallTorch } from "./Scenery";

loadCinzel("normal", { weights: ["700", "900"] });
loadMontserrat("normal", { weights: ["900"] });

const FPS = 30;
const LEAD = 5;
type Id = keyof typeof voz;
const ORDER: Id[] = ["hook", "falaise", "arresto", "juicio", "ropa", "ratas", "abogado", "gatos", "final", "outro"];
const TAIL: Partial<Record<Id, number>> = { outro: 40, gatos: 4, hook: 6 };
const sceneFrames = (id: Id) => Math.ceil(voz[id].dur * FPS) + LEAD + 8 + (TAIL[id] ?? 0);
const STARTS: Record<string, number> = {};
let acc = 0;
for (const id of ORDER) {
  STARTS[id] = acc;
  acc += sceneFrames(id);
}
export const TOTAL = acc;

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");
/** frame (scene-local) when a word is spoken */
const wf = (id: Id, word: string, nth = 0) => {
  const hits = voz[id].words.filter((w) => norm(w.w) === norm(word));
  const w = hits[nth] ?? hits[0];
  if (!w) throw new Error(`word ${word} not in ${id}`);
  return LEAD + Math.round(w.s * FPS);
};

/* ---------- helpers ---------- */
const At: React.FC<{ x: number; y: number; children: React.ReactNode; at?: number; z?: number; from?: "pop" | "left" | "right" | "drop" | "none"; exitAt?: number }> = ({
  x,
  y,
  children,
  at = 0,
  z,
  from = "pop",
  exitAt,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 11, stiffness: 150 } });
  let tf = "";
  if (from === "pop") tf = `scale(${s})`;
  if (from === "left") tf = `translateX(${(1 - s) * -900}px)`;
  if (from === "right") tf = `translateX(${(1 - s) * 900}px)`;
  if (from === "drop") tf = `translateY(${(1 - s) * -1400}px)`;
  let op = 1;
  if (exitAt !== undefined) {
    const e = interpolate(f, [exitAt, exitAt + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    tf += ` scale(${1 - e})`;
    op = 1 - e;
  }
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -100%)", zIndex: z ?? Math.round(y), opacity: op }}>
      <div style={{ transform: tf, transformOrigin: "50% 100%" }}>{children}</div>
    </div>
  );
};

type Key = [number, number, number, number]; // frame, scale, x, y (focus point offset)
const Cam: React.FC<{ keys: Key[]; children: React.ReactNode; shakeAt?: number[] }> = ({ keys, children, shakeAt = [] }) => {
  const f = useCurrentFrame();
  const fr = keys.map((k) => k[0]);
  const opt = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: Easing.inOut(Easing.cubic) };
  const sc = keys.length > 1 ? interpolate(f, fr, keys.map((k) => k[1]), opt) : keys[0][1];
  const x = keys.length > 1 ? interpolate(f, fr, keys.map((k) => k[2]), opt) : keys[0][2];
  const y = keys.length > 1 ? interpolate(f, fr, keys.map((k) => k[3]), opt) : keys[0][3];
  const mx = ((sc - 1) * W) / (2 * sc);
  const my = ((sc - 1) * H) / (2 * sc);
  const cx = Math.max(-mx, Math.min(mx, x));
  const cy = Math.max(-my, Math.min(my, y));
  let sx = 0;
  let sy = 0;
  for (const s of shakeAt) {
    const d = f - s;
    if (d >= 0 && d < 12) {
      const a = (1 - d / 12) * 22;
      sx += Math.sin(d * 2.7) * a;
      sy += Math.cos(d * 3.3) * a;
    }
  }
  // intro punch
  const punch = interpolate(f, [0, 7], [1.12, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px) scale(${sc * punch}) translate(${-cx}px, ${-cy}px)`, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

const Sfx: React.FC<{ at: number; src: string; vol?: number }> = ({ at, src, vol = 0.6 }) => (
  <Sequence from={Math.max(0, at)} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={vol} />
  </Sequence>
);

/* ---------- captions ---------- */
const KEY = new Set(
  ["cerdo", "juicio", "sentencia", "1386", "cerda", "bebe", "arrestaron", "carcel", "culpable", "persona", "chaqueta", "pantalones", "guantes", "ratas", "1522", "cosechas", "abogado", "gatos", "vida", "nunca", "nada", "cientos", "animal", "juez", "testigos"].map(norm),
);
const Captions: React.FC<{ id: Id }> = ({ id }) => {
  const f = useCurrentFrame();
  const t = (f - LEAD) / FPS;
  const words = voz[id].words;
  let cur = -1;
  for (let i = 0; i < words.length; i++) if (t >= words[i].s - 0.02) cur = i;
  if (cur < 0) return null;
  const w = words[cur];
  if (t > w.e + 0.6) return null;
  const local = f - (LEAD + w.s * FPS);
  const sc = interpolate(local, [0, 3, 6], [0.6, 1.12, 1], { extrapolateRight: "clamp" });
  const txt = w.w.replace(/[.,:;…]/g, "");
  const key = KEY.has(norm(w.w));
  return (
    <div style={{ position: "absolute", top: 1270, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 9999 }}>
      <div
        style={{
          transform: `scale(${sc}) rotate(${key ? -3 : 0}deg)`,
          fontFamily: "Montserrat",
          fontWeight: 900,
          fontSize: key ? 132 : 112,
          color: key ? "#ffd93d" : "white",
          WebkitTextStroke: `18px ${INK}`,
          paintOrder: "stroke fill",
          textShadow: "0 10px 0 rgba(0,0,0,0.45)",
          letterSpacing: 1,
          textTransform: key ? "uppercase" : "none",
          whiteSpace: "nowrap",
        }}
      >
        {txt}
      </div>
    </div>
  );
};

/* ---------- shared sets ---------- */
const Court: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <Room wall="#8fd0bf" side="#5aa08e" floorA="#eaf6f1" floorB="#3e8f7b" trim="#7a4b2b">
    <GothicWindow x={440} y={330} w={200} h={360} />
    <Banner x={235} y={330} color="#2f4f8f" />
    <Banner x={715} y={330} color="#a3202c" />
    <WallTorch x={300} y={760} />
    <WallTorch x={780} y={760} />
    {children}
  </Room>
);
const Bench: React.FC<{ x?: number; y?: number }> = ({ x = 540, y = 1250 }) => (
  <svg width={620} height={330} viewBox="0 0 620 330" style={{ position: "absolute", left: x - 310, top: y - 330, zIndex: y }}>
    <rect x="10" y="40" width="600" height="285" fill="#8a5530" stroke={INK} strokeWidth="10" rx="8" />
    <rect x="0" y="20" width="620" height="44" fill="#a8693a" stroke={INK} strokeWidth="10" rx="8" />
    {[0, 1, 2].map((i) => (
      <rect key={i} x={45 + i * 185} y="95" width="160" height="190" fill="#7a4726" stroke={INK} strokeWidth="7" rx="6" />
    ))}
    <circle cx="310" cy="190" r="55" fill="#f3d27a" stroke={INK} strokeWidth="8" />
    <path d="M310 155 l0 70 M285 175 q25 -40 50 0 M290 205 l40 0" stroke="#a3202c" strokeWidth="9" fill="none" strokeLinecap="round" />
  </svg>
);
const Judge: React.FC<{ y?: number; expr?: "neutral" | "angry" | "surprised" | "smug" | "worried" | "happy"; talking?: boolean; pose?: "gavel" | "idle" | "shrug" | "point" }> = ({
  y = 1080,
  expr = "neutral",
  talking = false,
  pose = "gavel",
}) => (
  <At x={540} y={y} z={1000}>
    <Toon hair="judge" beard="#d9d4cc" outfit="#a3202c" outfit2="#7a1520" robe expr={expr} talking={talking} pose={pose} prop={pose === "gavel" ? "gavel" : "none"} height={620} seed={2} />
  </At>
);

const Bars: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 9, stiffness: 180 } });
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - s) * -1900}px)`, zIndex: 5000 }}>
      <rect x="0" y="560" width={W} height="40" fill="#4a4f58" stroke={INK} strokeWidth="8" />
      <rect x="0" y="1700" width={W} height="40" fill="#4a4f58" stroke={INK} strokeWidth="8" />
      {Array.from({ length: 9 }).map((_, i) => (
        <g key={i}>
          <rect x={30 + i * 125} y="300" width="34" height="1600" fill="#5d636e" stroke={INK} strokeWidth="8" />
          <rect x={38 + i * 125} y="300" width="8" height="1600" fill="#9aa3ad" />
        </g>
      ))}
    </svg>
  );
};

const Label: React.FC<{ text: string; x: number; y: number; at: number; color?: string; rot?: number }> = ({ text, x, y, at, color = "#ffd93d", rot = -6 }) => (
  <At x={x} y={y} at={at} z={6000}>
    <div
      style={{
        fontFamily: "Montserrat",
        fontWeight: 900,
        fontSize: 58,
        background: color,
        color: INK,
        border: `7px solid ${INK}`,
        borderRadius: 16,
        padding: "6px 22px",
        transform: `rotate(${rot}deg)`,
        boxShadow: "0 8px 0 rgba(0,0,0,0.35)",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  </At>
);

const Exclaim: React.FC<{ x: number; y: number; at: number; ch?: string }> = ({ x, y, at, ch = "!" }) => {
  const f = useCurrentFrame();
  return (
    <At x={x} y={y} at={at} z={7000}>
      <div style={{ fontFamily: "Montserrat", fontWeight: 900, fontSize: 200, color: "#ff4d4d", WebkitTextStroke: `14px ${INK}`, paintOrder: "stroke fill", transform: `rotate(${Math.sin(f / 3) * 8}deg)` }}>{ch}</div>
    </At>
  );
};

/* ---------- scenes ---------- */
const SHook: React.FC = () => {
  const id: Id = "hook";
  const fCerdo = wf(id, "cerdo");
  const fJuicio = wf(id, "juicio");
  const fJuez = wf(id, "juez");
  const fAbog = wf(id, "abogado");
  const fSent = wf(id, "sentencia");
  return (
    <>
      <Cam
        keys={[
          [0, 1.9, -250, 440],
          [fJuicio - 4, 1.7, -250, 400],
          [fJuicio + 10, 1.05, 0, 0],
          [fSent - 2, 1.08, 0, 40],
          [fSent + 8, 1.3, 0, -150],
        ]}
        shakeAt={[fSent + 2]}
      >
        <Court />
        <Judge expr={useCurrentFrame() > fSent ? "angry" : "neutral"} talking={false} pose={useCurrentFrame() > fSent - 6 ? "gavel" : "idle"} />
        <Bench />
        <At x={300} y={1720} at={0} from="none">
          <Pig height={560} expr={useCurrentFrame() > fSent ? "surprised" : "worried"} />
        </At>
        <At x={800} y={1760} at={fAbog - 2} from="right">
          <Toon hair="lawyer" outfit="#2a2733" outfit2="#15131c" robe expr="smug" prop="scroll" pose="hold" height={700} flip seed={5} />
        </At>
        <At x={540} y={720} at={fJuez}>
          <div />
        </At>
      </Cam>
      <Stamp text="¿CULPABLE?" at={fSent + 2} top={430} />
      <Sfx at={fCerdo} src="oink" vol={0.5} />
      <Sfx at={fJuicio} src="whoosh" vol={0.4} />
      <Sfx at={fAbog - 2} src="pop" vol={0.5} />
      <Sfx at={fSent + 1} src="mazo" vol={0.9} />
    </>
  );
};

const SFalaise: React.FC = () => {
  const id: Id = "falaise";
  const f = useCurrentFrame();
  const fCerda = wf(id, "cerda");
  const fAtaco = wf(id, "ataco");
  const fBebe = wf(id, "bebe");
  const lunge = interpolate(f, [fAtaco - 2, fAtaco + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) });
  return (
    <>
      <Cam
        keys={[
          [0, 1.0, 0, 0],
          [fCerda, 1.1, -60, 120],
          [fAtaco + 6, 1.35, 60, 280],
          [fBebe + 30, 1.3, 60, 260],
        ]}
        shakeAt={[fAtaco + 3]}
      >
        <Village />
        <At x={810} y={1660} at={6}>
          <Cradle height={260} cry={f > fAtaco} />
        </At>
        <At x={700} y={1500} at={fBebe} from="right">
          <Toon hair="kerchief" hairColor="#c0392b" outfit="#e9a23b" outfit2="#b3741a" expr="surprised" pose="up" height={560} seed={8} />
        </At>
        <At x={250 + lunge * 230} y={1740} at={fCerda - 4} from="left">
          <Pig height={480} expr={f > fAtaco ? "angry" : "smug"} />
        </At>
        {f > fAtaco && <Exclaim x={930} y={1200} at={fAtaco} />}
      </Cam>
      <Badge year="1386" place="FALAISE, FRANCIA" />
      <Sfx at={fCerda - 4} src="oink" vol={0.5} />
      <Sfx at={fAtaco} src="gasp" vol={0.5} />
    </>
  );
};

const SArresto: React.FC = () => {
  const id: Id = "arresto";
  const f = useCurrentFrame();
  const fArr = wf(id, "arrestaron");
  const fCarcel = wf(id, "carcel");
  return (
    <>
      <Cam
        keys={[
          [0, 1.05, 0, 100],
          [fArr, 1.1, 0, 140],
          [fCarcel, 1.2, -80, 200],
          [fCarcel + 40, 1.28, -80, 220],
        ]}
        shakeAt={[fCarcel + 6]}
      >
        <Room wall="#9aa0b0" side="#6d7386" floorA="#b8a98f" floorB="#8f8069" stone>
          <WallTorch x={540} y={700} />
          <rect x="250" y="420" width="120" height="70" fill="#2d2d3d" stroke={INK} strokeWidth="8" />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={270 + i * 35} y="420" width="10" height="70" fill="#59606a" />
          ))}
        </Room>
        {/* hay */}
        <At x={420} y={1800} at={0}>
          <svg width={500} height={140} viewBox="0 0 500 140">
            <path d="M10 140 Q60 20 250 30 Q440 20 490 140 Z" fill="#e8c35a" stroke={INK} strokeWidth="8" />
            {Array.from({ length: 14 }).map((_, i) => (
              <line key={i} x1={40 + i * 32} y1={130} x2={60 + i * 30} y2={50 + (i % 3) * 15} stroke="#b8902e" strokeWidth="5" />
            ))}
          </svg>
        </At>
        <At x={400} y={1760} at={2}>
          <Pig height={500} expr={f > fArr ? "worried" : "neutral"} chained={f > fArr} />
        </At>
        <At x={710} y={1780} at={fArr - 4} from="right">
          <Toon hair="helmet" outfit="#7d8fa3" outfit2="#4d5d70" expr="angry" prop="spear" pose="point" flip height={760} seed={4} talking={f > fArr && f < fCarcel} />
        </At>
      </Cam>
      <Bars at={fCarcel - 2} />
      <Stamp text="ARRESTADA" at={fArr + 2} top={300} color="#1f6fd1" rotate={8} size={100} />
      <Sfx at={fArr - 4} src="whoosh" vol={0.4} />
      <Sfx at={fArr + 2} src="mazo" vol={0.5} />
      <Sfx at={fCarcel + 4} src="mazo" vol={0.9} />
    </>
  );
};

const SJuicio: React.FC = () => {
  const id: Id = "juicio";
  const f = useCurrentFrame();
  const fJuicio = wf(id, "juicio");
  const fTest = wf(id, "testigos");
  const fCulp = wf(id, "culpable");
  return (
    <>
      <Cam
        keys={[
          [0, 1.25, 0, -200],
          [fTest - 4, 1.05, 0, 0],
          [fCulp - 2, 1.05, 0, 50],
          [fCulp + 8, 1.25, -120, 300],
        ]}
        shakeAt={[fCulp + 3]}
      >
        <Court />
        <Judge expr={f > fCulp - 3 ? "angry" : "neutral"} talking={f < fTest} pose={f > fCulp - 8 ? "gavel" : "idle"} />
        <Bench />
        <At x={250} y={1760} at={fTest} from="left">
          <Toon hair="hood" hairColor="#8d6e4f" outfit="#9c6b3c" outfit2="#6e4824" expr="angry" pose="point" height={640} seed={9} talking={f < fCulp} />
        </At>
        <At x={130} y={1840} at={fTest + 6} from="left">
          <Toon hair="kerchief" hairColor="#c0392b" outfit="#e9a23b" outfit2="#b3741a" expr="angry" pose="point" height={600} seed={11} />
        </At>
        <At x={760} y={1780} at={fJuicio - 6}>
          <Pig height={520} expr={f > fCulp ? "surprised" : "worried"} flip />
        </At>
        {f > fTest && f < fCulp && <Label text="TESTIGOS" x={260} y={1000} at={fTest + 2} />}
        {/* sweat drops */}
        {f > fTest &&
          [0, 1].map((i) => {
            const d = (f + i * 15) % 30;
            return <div key={i} style={{ position: "absolute", left: 640 + i * 230, top: 1300 + d * 4, width: 26, height: 36, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#7fd3ff", border: `5px solid ${INK}`, opacity: 1 - d / 30, zIndex: 5000 }} />;
          })}
      </Cam>
      <Stamp text="CULPABLE" at={fCulp + 2} top={430} />
      <Sfx at={fTest} src="gasp" vol={0.4} />
      <Sfx at={fCulp + 1} src="mazo" vol={0.9} />
    </>
  );
};

const Crowd: React.FC<{ n?: number }> = ({ n = 7 }) => {
  const hairs = ["bowl", "hood", "kerchief", "spiky", "curly", "bald", "hood"] as const;
  const cols = ["#3f7d5a", "#9c6b3c", "#e9a23b", "#7a4b8f", "#2f4f8f", "#b5523b", "#6b8f3f"];
  return (
    <>
      {Array.from({ length: n }).map((_, i) => (
        <At key={i} x={60 + i * 160} y={2050 + (i % 2) * 40} at={0} z={8000 + i}>
          <Toon hair={hairs[i % hairs.length]} hairColor={["#6b3b1f", "#8d6e4f", "#c0392b", "#f0a030", "#2a1a10", "#6b3b1f", "#8d6e4f"][i]} outfit={cols[i]} outfit2={cols[(i + 2) % 7]} expr={i % 2 ? "surprised" : "happy"} pose={i % 3 === 0 ? "up" : "idle"} height={560} seed={i * 3} />
        </At>
      ))}
    </>
  );
};

const SRopa: React.FC = () => {
  const id: Id = "ropa";
  const f = useCurrentFrame();
  const fPersona = wf(id, "persona");
  const fCha = wf(id, "chaqueta");
  const fPan = wf(id, "pantalones");
  const fGua = wf(id, "guantes");
  const prog = (at: number) => interpolate(f, [at - 2, at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.5)) });
  return (
    <>
      <Cam
        keys={[
          [0, 1.0, 0, 0],
          [fCha - 4, 1.2, 0, 120],
          [fGua + 20, 1.35, 0, 160],
        ]}
      >
        <Village evening />
        {/* wooden platform */}
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, zIndex: 1300 }}>
          <rect x="170" y="1330" width="740" height="60" fill="#a8693a" stroke={INK} strokeWidth="10" />
          <rect x="190" y="1390" width="700" height="260" fill="#7a4726" stroke={INK} strokeWidth="10" />
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={190} x2={890} y1={1440 + i * 55} y2={1440 + i * 55} stroke="#5b3420" strokeWidth="6" />
          ))}
          <rect x="210" y="1100" width="660" height="110" rx="10" fill="#f4e4c1" stroke={INK} strokeWidth="8" opacity="0" />
        </svg>
        <At x={540} y={1345} at={0} z={1400}>
          <Pig height={560} expr={f > fGua + 4 ? "smug" : f > fPersona ? "surprised" : "worried"} jacket={prog(fCha)} pants={prog(fPan)} gloves={prog(fGua)} />
        </At>
        <Crowd />
      </Cam>
      <Label text="CHAQUETA" x={540} y={560} at={fCha} rot={-5} />
      <Label text="PANTALONES" x={540} y={680} at={fPan} color="#ff9ad5" rot={4} />
      <Label text="GUANTES" x={540} y={800} at={fGua} color="#8ef0b4" rot={-3} />
      <Sfx at={fCha} src="pop" vol={0.6} />
      <Sfx at={fPan} src="pop" vol={0.6} />
      <Sfx at={fGua} src="pop" vol={0.6} />
      <Sfx at={fPersona - 4} src="gasp" vol={0.35} />
    </>
  );
};

const SRatas: React.FC = () => {
  const id: Id = "ratas";
  const f = useCurrentFrame();
  const fRatas = wf(id, "ratas");
  const fAcus = wf(id, "acusadas");
  const fCos = wf(id, "cosechas");
  const eaten = interpolate(f, [fRatas, fCos + 20], [0, 0.65], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rats = [
    [230, 1500, 0],
    [520, 1620, 3],
    [820, 1540, 6],
    [380, 1800, 9],
    [700, 1850, 12],
    [140, 1720, 15],
    [950, 1760, 18],
  ];
  return (
    <>
      <Cam
        keys={[
          [0, 1.0, 0, 0],
          [fRatas + 10, 1.12, 0, 220],
          [fAcus + 10, 1.15, 0, 180],
        ]}
        shakeAt={[fAcus]}
      >
        <Field eaten={eaten} />
        {rats.map(([x, y, d], i) => (
          <At key={i} x={x} y={y} at={fRatas - 6 + d}>
            <Rat height={200 + (y - 1500) * 0.25} nibble flip={i % 2 === 1} seed={i} expr={f > fAcus ? "surprised" : "happy"} />
          </At>
        ))}
        <At x={800} y={1400} at={fAcus - 4} from="right">
          <Toon hair="bowl" hairColor="#2a1a10" outfit="#6b8f3f" outfit2="#46612a" beard="#2a1a10" expr="angry" prop="pitchfork" pose="point" flip talking={f > fAcus && f < fCos + 10} height={620} seed={7} />
        </At>
      </Cam>
      {f > 40 && <Badge year="1522" place="AUTUN, FRANCIA" delay={40} />}
      <Stamp text="ACUSADAS" at={fAcus + 2} top={480} rotate={-8} size={110} />
      <Sfx at={fRatas - 4} src="chillido" vol={0.45} />
      <Sfx at={fRatas + 6} src="chillido" vol={0.35} />
      <Sfx at={fAcus + 1} src="mazo" vol={0.6} />
    </>
  );
};

const SAbogado: React.FC = () => {
  const id: Id = "abogado";
  const f = useCurrentFrame();
  const fAbog = wf(id, "abogado");
  const fJuicio = wf(id, "juicio");
  return (
    <>
      <Cam
        keys={[
          [0, 1.25, 0, 320],
          [fJuicio, 1.1, 0, 200],
          [fJuicio + 30, 1.15, 0, 220],
        ]}
      >
        <Court />
        <Judge expr="smug" pose="idle" />
        <Bench />
        <At x={480} y={1800} at={0} from="left">
          <Toon hair="lawyer" outfit="#2a2733" outfit2="#15131c" robe expr="smug" pose="point" talking={f > LEAD} height={820} seed={5} />
        </At>
        {[
          [760, 1700],
          [880, 1780],
          [780, 1860],
        ].map(([x, y], i) => (
          <At key={i} x={x} y={y} at={fAbog + 4 + i * 4}>
            <Rat height={180} flip seed={i} expr="happy" />
          </At>
        ))}
      </Cam>
      {/* lower-third name tag */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 260, display: "flex", justifyContent: "center", zIndex: 9000 }}>
        <div
          style={{
            transform: `translateX(${(1 - spring({ frame: f - fAbog, fps: FPS, config: { damping: 13 } })) * -1100}px)`,
            background: "#2a2733",
            border: `8px solid #f3d27a`,
            borderRadius: 18,
            padding: "14px 34px",
            color: "#f3d27a",
            fontFamily: "Cinzel",
            textAlign: "center",
            boxShadow: "0 12px 0 rgba(0,0,0,0.35)",
          }}
        >
          <div style={{ fontSize: 34, fontWeight: 700, color: "white", letterSpacing: 4 }}>EL ABOGADO DE LAS RATAS</div>
          <div style={{ fontSize: 62, fontWeight: 900 }}>Bartolomé de Chassenée</div>
        </div>
      </div>
      <Sfx at={fAbog} src="whoosh" vol={0.4} />
      <Sfx at={fAbog + 4} src="chillido" vol={0.3} />
    </>
  );
};

const SGatos: React.FC = () => {
  const id: Id = "gatos";
  const f = useCurrentFrame();
  const fGatos = wf(id, "gatos");
  const fVida = wf(id, "vida");
  const red = 0.18 + 0.12 * Math.sin(f / 3);
  return (
    <>
      <Cam keys={[[0, 1.15, 0, 260], [fVida + 20, 1.3, 0, 300]]} shakeAt={[fGatos]}>
        <Village evening />
        {[0, 1, 2].map((i) => (
          <At key={i} x={150 + i * 120 + ((f * 3) % 20)} y={1700 + i * 70} at={0}>
            <Rat height={200} expr="surprised" run seed={i} />
          </At>
        ))}
        <At x={780} y={1640} at={fGatos - 4} from="right">
          <Cat height={420} flip />
        </At>
        <At x={930} y={1840} at={fGatos + 2} from="right">
          <Cat height={380} flip color="#4a4a55" stripes="#2a2a33" seed={3} />
        </At>
        <At x={620} y={1880} at={fGatos + 6} from="right">
          <Cat height={340} flip color="#f4f0e6" stripes="#c9c0ae" seed={5} />
        </At>
        <Exclaim x={300} y={1450} at={fGatos + 4} ch="!!" />
      </Cam>
      <AbsoluteFill style={{ background: `rgba(180,0,30,${f > fGatos ? red : 0})`, mixBlendMode: "multiply", zIndex: 8000 }} />
      <Sfx at={fGatos - 4} src="maullido" vol={0.6} />
      <Sfx at={fGatos + 6} src="chillido" vol={0.4} />
    </>
  );
};

const SFinal: React.FC = () => {
  const id: Id = "final";
  const f = useCurrentFrame();
  const fNunca = wf(id, "nunca");
  const fNada = wf(id, "nada");
  const tw = interpolate(f, [fNunca, fNunca + 70], [-200, 1300], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <Cam keys={[[0, 1.05, 0, 100], [fNada, 1.12, 0, 140], [fNada + 30, 1.2, 0, 160]]}>
        <Court />
        <Judge expr="worried" pose="shrug" />
        <Bench />
        {/* empty defendants spot */}
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, zIndex: 1500 }}>
          <ellipse cx="540" cy="1650" rx="230" ry="60" fill="none" stroke={INK} strokeWidth="10" strokeDasharray="30 22" opacity="0.6" />
          <g transform={`translate(${tw} 1560) rotate(${tw * 0.8})`}>
            <circle r="70" fill="none" stroke="#a5783f" strokeWidth="10" />
            <circle r="45" fill="none" stroke="#8a5f2c" strokeWidth="8" />
            <path d="M-60 -20 Q0 40 60 -30 M-40 50 Q0 -50 50 40" stroke="#a5783f" strokeWidth="8" fill="none" />
          </g>
        </svg>
        <At x={540} y={1720} at={fNunca}>
          <div style={{ fontFamily: "Montserrat", fontWeight: 900, fontSize: 220, color: "white", WebkitTextStroke: `16px ${INK}`, paintOrder: "stroke fill", transform: `rotate(${Math.sin(f / 6) * 10}deg)` }}>?</div>
        </At>
        <At x={880} y={1820} at={0}>
          <Toon hair="lawyer" outfit="#2a2733" outfit2="#15131c" robe expr="smug" pose="hips" height={680} flip seed={5} />
        </At>
      </Cam>
      <Stamp text="CASO CERRADO" at={fNada} top={420} color="#1a9e5c" size={104} rotate={-8} />
      <Sfx at={fNada} src="mazo" vol={0.8} />
    </>
  );
};

const SOutro: React.FC = () => {
  const id: Id = "outro";
  const f = useCurrentFrame();
  const fCientos = wf(id, "cientos");
  const fTu = wf(id, "tu");
  const lineup: [React.ReactNode, number][] = [
    [<Pig key="p" height={420} expr="happy" jacket={1} pants={1} gloves={1} />, 0],
    [<Rat key="r" height={240} expr="happy" />, 6],
    [<Cat key="c" height={330} />, 12],
  ];
  return (
    <>
      <Cam keys={[[0, 1.05, 0, 60], [fTu, 1.0, 0, 0], [fTu + 60, 1.08, 0, 40]]}>
        <Court />
        <Judge expr="happy" pose="gavel" talking />
        <Bench />
        {lineup.map(([el, d], i) => (
          <At key={i} x={220 + i * 320} y={1780 - (i === 1 ? 40 : 0)} at={fCientos - 4 + d}>
            {el}
          </At>
        ))}
      </Cam>
      {f > fTu - 2 && (
        <div style={{ position: "absolute", top: 230, left: 50, right: 50, textAlign: "center", zIndex: 9000, transform: `scale(${spring({ frame: f - fTu + 2, fps: FPS, config: { damping: 10 } })})` }}>
          <div style={{ display: "inline-block", background: "#ffd93d", border: `10px solid ${INK}`, borderRadius: 30, padding: "24px 36px", boxShadow: "0 14px 0 rgba(0,0,0,0.35)", fontFamily: "Montserrat", fontWeight: 900, fontSize: 76, color: INK, lineHeight: 1.1 }}>
            ¿A QUÉ ANIMAL
            <br />
            LLEVARÍAS A JUICIO?
          </div>
          <div style={{ marginTop: 30, fontFamily: "Montserrat", fontWeight: 900, fontSize: 56, color: "white", WebkitTextStroke: `12px ${INK}`, paintOrder: "stroke fill", transform: `translateY(${Math.sin(f / 5) * 8}px)` }}>COMENTA ABAJO ↓</div>
        </div>
      )}
      <Sfx at={fCientos - 4} src="pop" vol={0.5} />
      <Sfx at={fCientos + 2} src="chillido" vol={0.3} />
      <Sfx at={fCientos + 8} src="maullido" vol={0.3} />
      <Sfx at={fTu} src="whoosh" vol={0.4} />
    </>
  );
};

const SCENES: Record<Id, React.FC> = {
  hook: SHook,
  falaise: SFalaise,
  arresto: SArresto,
  juicio: SJuicio,
  ropa: SRopa,
  ratas: SRatas,
  abogado: SAbogado,
  gatos: SGatos,
  final: SFinal,
  outro: SOutro,
};

/* progress bar like shorts retention bar */
const Progress: React.FC = () => {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", left: 0, top: 0, height: 12, width: `${(f / TOTAL) * 100}%`, background: "#ffd93d", zIndex: 99999, boxShadow: "0 2px 0 rgba(0,0,0,0.4)" }} />;
};

export const Juicios: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#111" }}>
      {ORDER.map((id) => {
        const S = SCENES[id];
        return (
          <Sequence key={id} from={STARTS[id]} durationInFrames={sceneFrames(id)} name={id}>
            <AbsoluteFill>
              <S />
              <Vignette />
              <Captions id={id} />
            </AbsoluteFill>
            <Sequence from={LEAD} layout="none">
              <Audio src={staticFile(`voz/${id}.wav`)} volume={1} />
            </Sequence>
            {id !== "hook" && <Audio src={staticFile("sfx/whoosh.wav")} volume={0.3} />}
          </Sequence>
        );
      })}
      {/* flash on scene cuts */}
      {ORDER.slice(1).map((id) => {
        const d = f - STARTS[id];
        if (d < 0 || d > 5) return null;
        return <AbsoluteFill key={id} style={{ background: "white", opacity: (1 - d / 5) * 0.6, zIndex: 99998 }} />;
      })}
      <Progress />
      <Audio src={staticFile("musica.wav")} volume={(fr) => interpolate(fr, [0, 20, TOTAL - 40, TOTAL], [0, 0.2, 0.2, 0], { extrapolateRight: "clamp" })} />
    </AbsoluteFill>
  );
};

export const MyComposition: React.FC = () => (
  <Composition id="JuiciosAnimales" component={Juicios} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
);
