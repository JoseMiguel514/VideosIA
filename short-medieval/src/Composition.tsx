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
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import vozEs from "./voz.json";
import vozEn from "./voz_en.json";
import { Cat, Cradle, INK, Pig, Rat, Toon } from "./Characters";
import type { Expr, Pose } from "./Characters";
import { Banner, Field, GothicWindow, H, Room, Sign, Village, W, WallTorch } from "./Scenery";

loadOswald("normal", { weights: ["700"] });
loadMontserrat("normal", { weights: ["800"] });

const FPS = 30;
const LEAD = 3;
type Lang = "es" | "en";
type Id = keyof typeof vozEs;
const VOZ = { es: vozEs, en: vozEn as typeof vozEs };
// current language: set by the root component before scenes render (one composition per render)
let LANG: Lang = "es";
const voz = () => VOZ[LANG];
const ORDER: Id[] = ["hook", "falaise", "arresto", "juicio", "ropa", "ratas", "abogado", "gatos", "final", "outro"];
const TAIL: Partial<Record<Id, number>> = { outro: 26 };
const framesFor = (l: Lang, id: Id) => Math.ceil(VOZ[l][id].dur * FPS) + LEAD + 3 + (TAIL[id] ?? 0);
const sceneFrames = (id: Id) => framesFor(LANG, id);
const startsFor = (l: Lang) => {
  const st = {} as Record<Id, number>;
  let a = 0;
  for (const id of ORDER) {
    st[id] = a;
    a += framesFor(l, id);
  }
  return { st, total: a };
};
const TOTALS = { es: startsFor("es").total, en: startsFor("en").total };
/** Spanish cue word -> English cue word (scene timing anchors) */
const CUE_EN: Record<string, string> = {
  cerdo: "pig", juicio: "trial", abogado: "lawyer", sentencia: "sentence", cerda: "sow", ataco: "attacked", bebe: "baby",
  arrestaron: "arrested", carcel: "jail", testigos: "witnesses", culpable: "guilty", chaqueta: "jacket", pantalones: "trousers",
  guantes: "gloves", ratas: "rats", acusadas: "accused", cosechas: "crops", gatos: "cats", nunca: "never", nada: "nowhere",
  cientos: "hundreds", tu: "which",
};
const T = (es: string, en: string) => (LANG === "en" ? en : es);

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");
/** frame (scene-local) when a word is spoken */
const wf = (id: Id, word: string, nth = 0) => {
  if (LANG === "en") {
    word = CUE_EN[norm(word)] ?? word;
    if (id === "abogado" && word === "trial") word = "court";
  }
  const hits = voz()[id].words.filter((w) => norm(w.w) === norm(word));
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
  const cfg = { damping: 11, stiffness: 150 };
  const s = spring({ frame: f - at, fps, config: cfg });
  const v = s - spring({ frame: f - at - 1, fps, config: cfg }); // velocity -> squash & stretch
  const sq = Math.max(-0.25, Math.min(0.25, v * 2.2));
  let tf = "";
  if (from === "pop") tf = `scale(${s * (1 - sq)}, ${s * (1 + sq)})`;
  const hop = -Math.abs(Math.sin((1 - s) * Math.PI * 4)) * 70 * (1 - s);
  if (from === "left") tf = `translateX(${(1 - s) * -900}px) translateY(${hop}px) rotate(${(1 - s) * 12}deg) scale(${1 + sq * 0.5}, ${1 - sq * 0.5})`;
  if (from === "right") tf = `translateX(${(1 - s) * 900}px) translateY(${hop}px) rotate(${(1 - s) * -12}deg) scale(${1 + sq * 0.5}, ${1 - sq * 0.5})`;
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
  const punch = 1;
  // handheld drift
  sx += Math.sin(f / 37) * 7 + Math.sin(f / 17) * 3;
  sy += Math.cos(f / 41) * 6 + Math.sin(f / 23) * 2.5;
  const rot = Math.sin(f / 53) * 0.4;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px) rotate(${rot}deg) scale(${sc * punch * 1.015}) translate(${-cx}px, ${-cy}px)`, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

const Sfx: React.FC<{ at: number; src: string; vol?: number }> = ({ at, src, vol = 0.6 }) => (
  <Sequence from={Math.max(0, at)} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={vol} />
  </Sequence>
);

/** Build camera keys from shots: [start, scaleFrom, scaleTo, focusX, focusY]. Hard cuts between shots. */
type Shot = [number, number, number, number, number];
const shots = (list: Shot[], end: number): Key[] => {
  const keys: Key[] = [];
  list.forEach(([s, a, b, x, y], i) => {
    const e = i + 1 < list.length ? list[i + 1][0] - 1 : end;
    if (e - s > 14) {
      keys.push([s, a * 1.045, x, y]);
      keys.push([s + 9, a + ((b - a) * 9) / (e - s), x, y]);
    } else keys.push([s, a, x, y]);
    keys.push([e - s > 14 ? e : Math.max(s + 1, e), b, x, y]);
  });
  return keys;
};

/* ---------- captions: reference style (white, one word, punctuation kept) ---------- */
const Captions: React.FC<{ id: Id }> = ({ id }) => {
  const f = useCurrentFrame();
  const t = (f - LEAD) / FPS;
  const words = voz()[id].words;
  let cur = -1;
  for (let i = 0; i < words.length; i++) if (t >= words[i].s - 0.02) cur = i;
  if (cur < 0) return null;
  const w = words[cur];
  if (t > w.e + 0.5) return null;
  const local = f - (LEAD + w.s * FPS);
  const sc = interpolate(local, [0, 3], [0.88, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top: 1300, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 9999 }}>
      <div
        style={{
          transform: `scale(${sc})`,
          fontFamily: "Montserrat",
          fontWeight: 800,
          fontSize: 96,
          color: "white",
          WebkitTextStroke: `16px ${INK}`,
          paintOrder: "stroke fill",
          textShadow: "4px 7px 0 rgba(0,0,0,0.55)",
          whiteSpace: "nowrap",
        }}
      >
        {w.w}
      </div>
    </div>
  );
};

/* ---------- look: depth of field + grade ---------- */
const BG: React.FC<{ children: React.ReactNode; blur?: number }> = ({ children, blur = 2.5 }) => <AbsoluteFill style={{ filter: `blur(${blur}px)` }}>{children}</AbsoluteFill>;
const Grade: React.FC<{ tint?: string; vig?: number }> = ({ tint, vig = 0.62 }) => (
  <>
    {tint && <AbsoluteFill style={{ background: tint, mixBlendMode: "multiply", zIndex: 9990 }} />}
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 60% at 50% 45%, rgba(0,0,0,0) 45%, rgba(5,8,15,${vig}) 100%)`, zIndex: 9991 }} />
  </>
);

/** pose switch with blend: before `at` -> a, after -> b (eased over 8 frames) */
const sw8 = (f: number, at: number, a: Pose, b: Pose) => (f < at ? { pose: a } : { pose: b, prevPose: a, poseT: (f - at) / 8 });

/* ---------- shared sets ---------- */
const Court: React.FC = () => (
  <BG>
    <Room wall="#9fd6c8" side="#5f9f90" floorA="#eef7f3" floorB="#3d8e7c" trim="#2f6f62">
      <GothicWindow x={440} y={330} w={200} h={360} />
      <Banner x={235} y={330} color="#2f4f8f" />
      <Banner x={715} y={330} color="#a3202c" />
      <WallTorch x={300} y={760} />
      <WallTorch x={780} y={760} />
    </Room>
  </BG>
);
const Bench: React.FC<{ x?: number; y?: number; w?: number }> = ({ x = 540, y = 1540, w = 800 }) => {
  const h = w * 0.5;
  return (
    <svg width={w} height={h} viewBox="0 0 620 310" style={{ position: "absolute", left: x - w / 2, top: y - h, zIndex: y }}>
      <defs>
        <linearGradient id="wood" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#a0663a" />
          <stop offset="1" stopColor="#5e3519" />
        </linearGradient>
      </defs>
      <rect x="10" y="40" width="600" height="265" fill="url(#wood)" stroke={INK} strokeWidth="10" rx="8" />
      <rect x="0" y="20" width="620" height="44" fill="#b77a48" stroke={INK} strokeWidth="10" rx="8" />
      <rect x="10" y="28" width="600" height="8" fill="#e0a877" opacity="0.6" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={45 + i * 185} y="95" width="160" height="175" fill="rgba(0,0,0,0.15)" stroke={INK} strokeWidth="6" rx="6" />
      ))}
      <circle cx="310" cy="182" r="52" fill="#e6bd55" stroke={INK} strokeWidth="8" />
      <path d="M310 148 l0 68 M286 168 q24 -38 48 0 M291 196 l38 0" stroke="#8f1c24" strokeWidth="9" fill="none" strokeLinecap="round" />
    </svg>
  );
};
const JUDGE = { x: 540, y: 1330, h: 900 };
const judgeHead = JUDGE.y - 0.732 * JUDGE.h - 960; // focus y for judge's face
const Judge: React.FC<{ expr?: Expr; talking?: boolean; pose?: Pose; prevPose?: Pose; poseT?: number }> = ({ expr = "neutral", talking = false, pose = "idle", prevPose, poseT }) => (
  <At x={JUDGE.x} y={JUDGE.y} z={1000} from="none">
    <Toon hair="judge" hairColor="#b3242f" beard="#8f8a86" outfit="#a3202c" outfit2="#f4efe6" robe expr={expr} talking={talking} pose={pose} prevPose={prevPose} poseT={poseT} prop={pose === "gavel" ? "gavel" : "none"} height={JUDGE.h} seed={2} />
  </At>
);
const headY = (feet: number, h: number) => feet - 0.732 * h - 960;
const pigHeadY = (feet: number, h: number) => feet - (380 / 600) * h - 960;

const Bars: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 9, stiffness: 180 } });
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - s) * -1900}px)`, zIndex: 5000 }}>
      <defs>
        <linearGradient id="bar" x1="0" x2="1">
          <stop offset="0" stopColor="#9aa3ad" />
          <stop offset="0.4" stopColor="#5d636e" />
          <stop offset="1" stopColor="#2c3038" />
        </linearGradient>
      </defs>
      <rect x="0" y="560" width={W} height="40" fill="url(#bar)" stroke={INK} strokeWidth="8" />
      <rect x="0" y="1700" width={W} height="40" fill="url(#bar)" stroke={INK} strokeWidth="8" />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={30 + i * 125} y="300" width="36" height="1600" fill="url(#bar)" stroke={INK} strokeWidth="8" />
      ))}
    </svg>
  );
};

/** Back of a head (crowd in foreground, like the reference's over-the-shoulder shots) */
const BackHead: React.FC<{ x: number; y: number; r: number; hair: string; seed?: number }> = ({ x, y, r, hair, seed = 0 }) => {
  const f = useCurrentFrame();
  const b = Math.sin(f / 10 + seed) * 6;
  return (
    <svg width={r * 2.4} height={r * 3} viewBox="0 0 240 300" style={{ position: "absolute", left: x - r * 1.2, top: y - r * 1.2 + b, zIndex: 8000 + seed, overflow: "visible" }}>
      <defs>
        <radialGradient id={`bh${seed}`} cx="35%" cy="30%" r="75%">
          <stop offset="0.5" stopColor="#ffffff" />
          <stop offset="1" stopColor="#b9c2cf" />
        </radialGradient>
      </defs>
      <rect x="70" y="170" width="100" height="160" rx="50" fill="#4a3a5a" stroke={INK} strokeWidth="8" />
      <circle cx="120" cy="110" r="100" fill="url(#bh${seed})" stroke={INK} strokeWidth="8" />
      <path d="M22 100 Q30 0 120 8 Q210 0 218 100 Q170 70 120 72 Q70 70 22 100 Z" fill={hair} stroke={INK} strokeWidth="8" />
    </svg>
  );
};

/* ---------- scenes ---------- */
const SHook: React.FC = () => {
  const id: Id = "hook";
  const f = useCurrentFrame();
  const end = sceneFrames(id);
  const fCerdo = wf(id, "cerdo");
  const fJuicio = wf(id, "juicio");
  const fAbog = wf(id, "abogado");
  const fSent = wf(id, "sentencia");
  const PIG = { x: 330, y: 1850, h: 700 };
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 2.0, 2.25, PIG.x - 540, pigHeadY(PIG.y, PIG.h) + 20],
            [fJuicio, 1.0, 1.1, 0, 60],
            [fSent, 1.9, 2.05, 0, judgeHead + 40],
          ],
          end,
        )}
        shakeAt={[fSent + 3]}
      >
        <Court />
        <Judge expr={f >= fSent ? "angry" : "smug"} {...sw8(f, fSent - 3, "idle", "gavel")} talking={f >= fSent} />
        <Bench />
        <At x={PIG.x} y={PIG.y} from="none">
          <Pig height={PIG.h} expr={f < fJuicio ? "worried" : f >= fSent ? "surprised" : "worried"} />
        </At>
        <At x={850} y={2080} at={fAbog - 3} from="right">
          <Toon hair="lawyer" hairColor="#2a2733" outfit="#2a2733" outfit2="#f4efe6" robe expr="smug" prop="scroll" pose="hold" height={1250} flip seed={5} />
        </At>
      </Cam>
      <Grade tint="rgba(150,220,215,0.18)" />
      <Sfx at={fCerdo} src="oink" vol={0.45} />
      <Sfx at={fAbog - 3} src="whoosh" vol={0.3} />
      <Sfx at={fSent + 2} src="mazo" vol={0.9} />
    </>
  );
};

const SFalaise: React.FC = () => {
  const id: Id = "falaise";
  const f = useCurrentFrame();
  const end = sceneFrames(id);
  const fCerda = wf(id, "cerda");
  const fAtaco = wf(id, "ataco");
  const fBebe = wf(id, "bebe");
  const lunge = interpolate(f, [fCerda, fAtaco - 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const MOM = { x: 880, y: 2000, h: 1250 };
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.0, 1.12, 0, 120],
            [fAtaco, 1.75, 1.9, MOM.x - 540, headY(MOM.y, MOM.h) + 40],
            [fBebe, 1.45, 1.6, -60, 560],
          ],
          end,
        )}
        shakeAt={[fAtaco + 2]}
      >
        <BG blur={2}>
          <Village />
        </BG>
        <Sign text="FALAISE" sub={T("FRANCIA · 1386", "FRANCE · 1386")} y={70} color="#5b3420" glow={false} />
        <At x={640} y={1730} from="none">
          <Cradle height={300} cry={f > fAtaco} />
        </At>
        <At x={180 + lunge * 230} y={1830} at={fCerda - 10} from="left">
          <Pig height={640} expr={f > fAtaco ? "angry" : "smug"} walking={f > fCerda && f < fAtaco - 2} />
        </At>
        {f >= fAtaco && (
          <At x={MOM.x} y={MOM.y} from="none">
            <Toon hair="kerchief" hairColor="#b8323a" outfit="#d98a2b" outfit2="#f4efe6" expr="surprised" {...sw8(f, fAtaco + 1, "idle", "up")} height={MOM.h} seed={8} />
          </At>
        )}
      </Cam>
      <Grade tint="rgba(255,215,170,0.15)" />
      <Sfx at={fCerda - 8} src="oink" vol={0.45} />
      <Sfx at={fAtaco} src="gasp" vol={0.5} />
    </>
  );
};

const SArresto: React.FC = () => {
  const id: Id = "arresto";
  const f = useCurrentFrame();
  const end = sceneFrames(id);
  const fArr = wf(id, "arrestaron");
  const fCarcel = wf(id, "carcel");
  const PIG = { x: 340, y: 1830, h: 700 };
  const G = { x: 800, y: 2020, h: 1350 };
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.7, 1.85, PIG.x - 540, pigHeadY(PIG.y, PIG.h) + 30],
            [fArr, 1.65, 1.8, G.x - 540, headY(G.y, G.h) + 40],
            [fCarcel, 1.05, 1.12, 0, 120],
          ],
          end,
        )}
        shakeAt={[fCarcel + 6]}
      >
        <BG>
          <Room wall="#a4abbd" side="#6a7186" floorA="#b7aa92" floorB="#8a7c66" stone>
            <WallTorch x={540} y={700} />
            <rect x="250" y="420" width="120" height="70" fill="#2d2d3d" stroke={INK} strokeWidth="8" />
            {[0, 1, 2].map((i) => (
              <rect key={i} x={270 + i * 35} y="420" width="10" height="70" fill="#59606a" />
            ))}
          </Room>
        </BG>
        <At x={420} y={1880} from="none">
          <svg width={560} height={150} viewBox="0 0 500 140">
            <path d="M10 140 Q60 20 250 30 Q440 20 490 140 Z" fill="#d9b24f" stroke={INK} strokeWidth="8" />
            {Array.from({ length: 14 }).map((_, i) => (
              <line key={i} x1={40 + i * 32} y1={130} x2={60 + i * 30} y2={50 + (i % 3) * 15} stroke="#a8822a" strokeWidth="5" />
            ))}
          </svg>
        </At>
        <At x={PIG.x} y={PIG.y} from="none">
          <Pig height={PIG.h} expr={f >= fCarcel ? "worried" : f >= fArr ? "surprised" : "neutral"} chained={f >= fArr} />
        </At>
        <At x={G.x} y={G.y} at={fArr} from="none">
          <Toon hair="helmet" outfit="#6d7f95" outfit2="#c9ccd2" expr="angry" prop="spear" pose="point" flip height={G.h} seed={4} talking={f >= fArr && f < fCarcel} />
        </At>
      </Cam>
      <Bars at={fCarcel - 2} />
      <Grade tint="rgba(150,170,220,0.25)" vig={0.7} />
      <Sfx at={fArr + 2} src="mazo" vol={0.45} />
      <Sfx at={fCarcel + 4} src="mazo" vol={0.9} />
    </>
  );
};

const SJuicio: React.FC = () => {
  const id: Id = "juicio";
  const f = useCurrentFrame();
  const end = sceneFrames(id);
  const fTest = wf(id, "testigos");
  const fCulp = wf(id, "culpable");
  const WIT = { x: 270, y: 2030, h: 1320 };
  const PIG = { x: 790, y: 1850, h: 700 };
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.75, 1.9, 0, judgeHead + 40],
            [fTest, 1.6, 1.75, WIT.x - 540, headY(WIT.y, WIT.h) + 40],
            [fCulp, 1.95, 2.1, 0, judgeHead + 40],
            [fCulp + 16, 2.0, 2.15, PIG.x - 540, pigHeadY(PIG.y, PIG.h) + 20],
          ],
          end,
        )}
        shakeAt={[fCulp + 3]}
      >
        <Court />
        <Judge expr={f >= fCulp ? "angry" : "neutral"} talking={f < fTest} {...sw8(f, fCulp - 6, "idle", "gavel")} />
        <Bench />
        <At x={PIG.x} y={PIG.y} from="none">
          <Pig height={PIG.h} expr={f > fCulp ? "surprised" : "worried"} flip />
        </At>
        <At x={WIT.x} y={WIT.y} from="none">
          <Toon hair="hood" hairColor="#7d6248" outfit="#8a5d33" outfit2="#e9dfc9" beard="#5a3d26" expr="angry" {...sw8(f, fCulp, "point", "idle")} height={WIT.h} seed={9} talking={f >= fTest && f < fCulp} />
        </At>
      </Cam>
      <Grade tint="rgba(150,220,215,0.18)" />
      <Sfx at={fTest} src="gasp" vol={0.35} />
      <Sfx at={fCulp + 2} src="mazo" vol={0.9} />
    </>
  );
};

const SRopa: React.FC = () => {
  const id: Id = "ropa";
  const f = useCurrentFrame();
  const end = sceneFrames(id);
  const fCha = wf(id, "chaqueta");
  const fPan = wf(id, "pantalones");
  const fGua = wf(id, "guantes");
  const prog = (at: number) => interpolate(f, [at - 2, at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.5)) });
  const PIG = { x: 540, y: 1360, h: 820 };
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.0, 1.1, 0, 80],
            [fCha, 1.5, 1.75, 0, pigHeadY(PIG.y, PIG.h) + 260],
          ],
          end,
        )}
      >
        <BG blur={2}>
          <Village evening />
        </BG>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, zIndex: 1300 }}>
          <defs>
            <linearGradient id="plat" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#8f5a32" />
              <stop offset="1" stopColor="#4a2a14" />
            </linearGradient>
          </defs>
          <rect x="140" y="1340" width="800" height="60" fill="#b77a48" stroke={INK} strokeWidth="10" />
          <rect x="160" y="1400" width="760" height="320" fill="url(#plat)" stroke={INK} strokeWidth="10" />
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={160} x2={920} y1={1460 + i * 60} y2={1460 + i * 60} stroke="#3a200e" strokeWidth="6" />
          ))}
        </svg>
        <At x={PIG.x} y={PIG.y} z={1400} from="none">
          <Pig height={PIG.h} expr={f > fGua + 4 ? "smug" : f > fCha ? "surprised" : "worried"} jacket={prog(fCha)} pants={prog(fPan)} gloves={prog(fGua)} />
        </At>
        <BackHead x={170} y={1720} r={190} hair="#6b3b1f" seed={1} />
        <BackHead x={520} y={1800} r={210} hair="#d8692a" seed={2} />
        <BackHead x={900} y={1730} r={195} hair="#2a1a10" seed={3} />
      </Cam>
      <Grade tint="rgba(255,190,140,0.2)" />
      <Sfx at={fCha} src="pop" vol={0.55} />
      <Sfx at={fPan} src="pop" vol={0.55} />
      <Sfx at={fGua} src="pop" vol={0.55} />
      <Sfx at={4} src="gasp" vol={0.3} />
    </>
  );
};

const SRatas: React.FC = () => {
  const id: Id = "ratas";
  const f = useCurrentFrame();
  const end = sceneFrames(id);
  const fRatas = wf(id, "ratas");
  const fAcus = wf(id, "acusadas");
  const fCos = wf(id, "cosechas");
  const eaten = interpolate(f, [fRatas, fCos + 20], [0, 0.65], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const FARM = { x: 830, y: 2030, h: 1320 };
  const rats = [
    [260, 1560, 0],
    [520, 1660, 3],
    [800, 1580, 6],
    [380, 1840, 9],
    [660, 1880, 12],
    [130, 1760, 15],
  ];
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.0, 1.1, 0, 60],
            [fRatas, 1.7, 1.85, -60, 600],
            [fAcus, 1.6, 1.75, FARM.x - 540, headY(FARM.y, FARM.h) + 40],
          ],
          end,
        )}
        shakeAt={[fAcus + 2]}
      >
        <BG blur={2}>
          <Field eaten={eaten} />
        </BG>
        <Sign text="AUTUN" sub={T("FRANCIA · 1522", "FRANCE · 1522")} y={70} color="#5b3420" glow={false} />
        {rats.map(([x, y, d], i) => (
          <At key={i} x={x} y={y} at={8 + d}>
            <Rat height={230 + (y - 1500) * 0.3} nibble flip={i % 2 === 1} seed={i} expr={f > fAcus ? "surprised" : "happy"} />
          </At>
        ))}
        {f >= fAcus && (
          <At x={FARM.x} y={FARM.y} from="none">
            <Toon hair="bowl" hairColor="#4a2c18" outfit="#5d7d38" outfit2="#e9dfc9" beard="#3a2414" expr="angry" prop="pitchfork" pose="point" flip talking={f < fCos + 12} height={FARM.h} seed={7} />
          </At>
        )}
      </Cam>
      <Grade tint="rgba(255,210,150,0.15)" />
      <Sfx at={fRatas - 6} src="chillido" vol={0.4} />
      <Sfx at={fRatas + 10} src="chillido" vol={0.3} />
      <Sfx at={fAcus + 1} src="mazo" vol={0.45} />
    </>
  );
};

const LAW = { x: 540, y: 2060, h: 1400 };
const SAbogado: React.FC = () => {
  const id: Id = "abogado";
  const f = useCurrentFrame();
  const end = sceneFrames(id);
  const fAbog = wf(id, "abogado");
  const fJuicio = wf(id, "juicio");
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.45, 1.65, 0, headY(LAW.y, LAW.h) + 60],
            [fJuicio, 1.12, 1.2, 0, 220],
          ],
          end,
        )}
      >
        <Court />
        <Bench />
        <At x={LAW.x} y={LAW.y} from="none">
          <Toon hair="lawyer" hairColor="#2a2733" outfit="#2a2733" outfit2="#f4efe6" robe expr="smug" pose="point" talking={f > LEAD} height={LAW.h} seed={5} />
        </At>
        {[
          [840, 1800],
          [960, 1870],
          [860, 1930],
        ].map(([x, y], i) => (
          <At key={i} x={x} y={y} at={fJuicio - 2 + i * 3}>
            <Rat height={220} flip seed={i} expr="happy" />
          </At>
        ))}
      </Cam>
      <Grade tint="rgba(150,220,215,0.18)" />
      <Sfx at={fAbog} src="whoosh" vol={0.25} />
      <Sfx at={fJuicio} src="chillido" vol={0.3} />
    </>
  );
};

const SGatos: React.FC = () => {
  const id: Id = "gatos";
  const f = useCurrentFrame();
  const end = sceneFrames(id);
  const fGatos = wf(id, "gatos");
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.7, 1.85, -240, 640],
            [fGatos, 1.45, 1.6, 200, 330],
          ],
          end,
        )}
        shakeAt={[fGatos + 2]}
      >
        <BG>
          <Village night />
        </BG>
        {[0, 1, 2].map((i) => (
          <At key={i} x={130 + i * 150 + ((f * 3) % 20)} y={1700 + i * 80} from="none">
            <Rat height={250} expr="surprised" run seed={i} />
          </At>
        ))}
        <At x={760} y={1600} at={fGatos - 4} from="right">
          <Cat height={560} flip />
        </At>
        <At x={950} y={1820} at={fGatos + 1} from="right">
          <Cat height={500} flip color="#4a4a55" stripes="#2a2a33" seed={3} />
        </At>
        <At x={620} y={1900} at={fGatos + 5} from="right">
          <Cat height={440} flip color="#f4f0e6" stripes="#c9c0ae" seed={5} />
        </At>
      </Cam>
      <Grade tint="rgba(90,110,220,0.45)" vig={0.75} />
      <Sfx at={fGatos - 4} src="maullido" vol={0.6} />
      <Sfx at={fGatos + 6} src="chillido" vol={0.4} />
    </>
  );
};

const SFinal: React.FC = () => {
  const id: Id = "final";
  const f = useCurrentFrame();
  const end = sceneFrames(id);
  const fNunca = wf(id, "nunca");
  const fNada = wf(id, "nada");
  const tw = interpolate(f, [fNunca - 10, fNunca + 60], [-200, 1300], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const L2 = { x: 860, y: 2060, h: 1300 };
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.05, 1.15, 0, 150],
            [fNada - 4, 1.7, 1.85, L2.x - 540, headY(L2.y, L2.h) + 50],
          ],
          end,
        )}
      >
        <Court />
        <Judge expr="worried" pose="shrug" />
        <Bench />
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, zIndex: 1600 }}>
          <ellipse cx="420" cy="1700" rx="230" ry="60" fill="none" stroke={INK} strokeWidth="10" strokeDasharray="30 22" opacity="0.5" />
          <g transform={`translate(${tw} 1640) rotate(${tw * 0.8})`}>
            <circle r="70" fill="none" stroke="#a5783f" strokeWidth="10" />
            <circle r="45" fill="none" stroke="#8a5f2c" strokeWidth="8" />
            <path d="M-60 -20 Q0 40 60 -30 M-40 50 Q0 -50 50 40" stroke="#a5783f" strokeWidth="8" fill="none" />
          </g>
        </svg>
        <At x={L2.x} y={L2.y} from="none">
          <Toon hair="lawyer" hairColor="#2a2733" outfit="#2a2733" outfit2="#f4efe6" robe expr="smug" pose="hips" height={L2.h} flip seed={5} />
        </At>
      </Cam>
      <Grade tint="rgba(150,220,215,0.18)" />
      <Sfx at={fNada} src="mazo" vol={0.6} />
    </>
  );
};

const SOutro: React.FC = () => {
  const id: Id = "outro";
  const f = useCurrentFrame();
  const end = sceneFrames(id);
  const fCientos = wf(id, "cientos");
  const fTu = wf(id, "tu");
  const PIG = { x: 260, y: 1840, h: 680 };
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.75, 1.9, 0, judgeHead + 40],
            [fCientos, 1.05, 1.12, 0, 160],
            [fTu, 1.9, 2.1, PIG.x - 540, pigHeadY(PIG.y, PIG.h) + 20],
          ],
          end,
        )}
      >
        <Court />
        <Judge expr="happy" talking={f < fCientos} />
        <Bench />
        <At x={PIG.x} y={PIG.y} from="none">
          <Pig height={PIG.h} expr={f >= fTu ? "smug" : "happy"} jacket={1} pants={1} gloves={1} />
        </At>
        <At x={560} y={1800} from="none">
          <Rat height={280} expr="happy" />
        </At>
        <At x={850} y={1860} from="none">
          <Cat height={440} flip />
        </At>
      </Cam>
      <Grade tint="rgba(150,220,215,0.18)" />
      <Sfx at={fCientos} src="chillido" vol={0.25} />
      <Sfx at={fCientos + 8} src="maullido" vol={0.25} />
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

export const Juicios: React.FC<{ lang: Lang }> = ({ lang }) => {
  LANG = lang;
  const { st: STARTS, total: TOTAL } = startsFor(lang);
  return (
    <AbsoluteFill style={{ background: "#111" }}>
      {ORDER.map((id) => {
        const S = SCENES[id];
        return (
          <Sequence key={id} from={STARTS[id]} durationInFrames={sceneFrames(id)} name={id}>
            <AbsoluteFill>
              <S />
              <Captions id={id} />
            </AbsoluteFill>
            <Sequence from={LEAD} layout="none">
              <Audio src={staticFile(`${lang === "en" ? "voz_en" : "voz"}/${id}.wav`)} volume={1} />
            </Sequence>
          </Sequence>
        );
      })}
      <Audio src={staticFile("musica.wav")} volume={(fr) => interpolate(fr, [0, 20, TOTAL - 40, TOTAL], [0, 0.17, 0.17, 0], { extrapolateRight: "clamp" })} />
    </AbsoluteFill>
  );
};

export const MyComposition: React.FC = () => (
  <>
    <Composition id="JuiciosAnimales" component={Juicios} defaultProps={{ lang: "es" as Lang }} durationInFrames={TOTALS.es} fps={FPS} width={W} height={H} />
    <Composition id="AnimalTrialsEN" component={Juicios} defaultProps={{ lang: "en" as Lang }} durationInFrames={TOTALS.en} fps={FPS} width={W} height={H} />
  </>
);
