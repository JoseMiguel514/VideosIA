import React from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  Easing,
  interpolate,
  random,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import guion from "../scripts/guion.json";
import duraciones from "./duraciones.json";
import { Bill, Calendar, Clapper, Controller, Crown, GameBox, Stopwatch, Warning } from "./Icons";

const { fontFamily: numFont } = loadAnton("normal", { weights: ["400"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadMontserrat("normal", { weights: ["800", "900"], subsets: ["latin"] });

const FPS = 30;
const LEAD = 5;
const TAIL = 7;
const GREEN = "#39ff88";
const PINK = "#ff2e88";
const YELLOW = "#ffd23f";
const BG = "#0b0614";
const CAPTION_TOP = 1200;

type SceneId = "hook" | "dato" | "gta5" | "avatar" | "segundo" | "preventa" | "ojo" | "outro";
const ORDER: SceneId[] = ["hook", "dato", "gta5", "avatar", "segundo", "preventa", "ojo", "outro"];
const entry = (id: SceneId) => guion.find((g) => g.id === id)!;
const voiceDur = (id: SceneId) => (duraciones as Record<string, number>)[id];
const sceneFrames = (id: SceneId) => LEAD + Math.ceil(voiceDur(id) * FPS) + TAIL + (id === "outro" ? 45 : 0);
const STARTS = {} as Record<SceneId, number>;
let acc = 0;
for (const id of ORDER) {
  STARTS[id] = acc;
  acc += sceneFrames(id);
}
const TOTAL = acc;

/* ---------- timing de palabras ----------
   En "pantalla", un token como  $3,790{tres_mil_setecientos_noventa}  se muestra como "$3,790"
   pero pesa en el tiempo como lo que se pronuncia. Así los subtítulos van sincronizados con la voz. */
type Word = { w: string; start: number; end: number; key: boolean };
const cache: Partial<Record<SceneId, Word[]>> = {};
const wordTimes = (id: SceneId): Word[] => {
  if (cache[id]) return cache[id]!;
  const toks = entry(id).pantalla.split(/\s+/).filter(Boolean);
  const parsed = toks.map((t) => {
    const m = t.match(/^(.*?)\{([^}]*)\}(.*)$/);
    const shown = m ? m[1] + m[3] : t;
    const spoken = m ? m[2].replace(/_/g, " ") + m[3] : t;
    const weight =
      spoken.replace(/[^\p{L}\p{N}]/gu, "").length + 1.5 * spoken.split(" ").length + (/[.,:?!]$/.test(t) ? 5 : 0) + (/\.\.\.$/.test(t) ? 6 : 0);
    const bare = shown.replace(/[^\p{L}\p{N}$]/gu, "");
    const key = /[\d$]/.test(shown) || (bare.length > 1 && bare === bare.toUpperCase() && /\p{L}/u.test(bare) && !/^GTA|^VI?$/.test(bare));
    return { shown, weight, key };
  });
  const total = parsed.reduce((a, b) => a + b.weight, 0);
  const dur = voiceDur(id) * FPS;
  let c = 0;
  const out = parsed.map((p) => {
    const start = LEAD + (c / total) * dur;
    c += p.weight;
    return { w: p.shown, start, end: LEAD + (c / total) * dur, key: p.key };
  });
  cache[id] = out;
  return out;
};
/** frame (relativo a la escena) en que se dice la palabra */
const at = (id: SceneId, needle: string) => {
  const t = wordTimes(id).find((x) => x.w.toLowerCase().includes(needle.toLowerCase()));
  if (!t) throw new Error(`Palabra "${needle}" no encontrada en ${id}`);
  return Math.round(t.start);
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

/* ---------- efectos de sonido sincronizados ---------- */
const SFX: { id: SceneId; f: number; s: string; v?: number }[] = [
  { id: "hook", f: 0, s: "boom", v: 0.8 },
  { id: "hook", f: at("hook", "DÍA") - 2, s: "boom", v: 0.9 },
  { id: "hook", f: at("hook", "película") , s: "glitch", v: 0.4 },
  { id: "dato", f: at("dato", "19"), s: "pop", v: 0.6 },
  { id: "dato", f: at("dato", "$3,790") - 20, s: "riser", v: 0.35 },
  { id: "dato", f: at("dato", "$3,790") + 30, s: "cash", v: 0.7 },
  { id: "dato", f: at("dato", "$3,790") + 30, s: "boom", v: 0.6 },
  { id: "gta5", f: at("gta5", "CINCO"), s: "riser", v: 0.3 },
  { id: "gta5", f: at("gta5", "CINCO") + 22, s: "boom", v: 0.8 },
  { id: "avatar", f: at("avatar", "TODA"), s: "riser", v: 0.3 },
  { id: "avatar", f: at("avatar", "$2,900"), s: "cash", v: 0.6 },
  { id: "segundo", f: at("segundo", "CADA") - 2, s: "boom", v: 0.8 },
  { id: "preventa", f: at("preventa", "32.5"), s: "pop", v: 0.6 },
  { id: "preventa", f: at("preventa", "MILLONES") + 20, s: "cash", v: 0.6 },
  { id: "ojo", f: 0, s: "glitch", v: 0.6 },
  { id: "ojo", f: at("ojo", "Sensor"), s: "pop", v: 0.6 },
  { id: "ojo", f: at("ojo", "menos"), s: "glitch", v: 0.5 },
  { id: "outro", f: at("outro", "jugaste"), s: "pop", v: 0.6 },
  { id: "outro", f: at("outro", "precio"), s: "pop", v: 0.6 },
];
// tic-tac del cronómetro
for (let f = 4; f < sceneFrames("segundo"); f += 10) SFX.push({ id: "segundo", f, s: "tick", v: 0.35 });
/** golpes de cámara (sacudida) por escena */
const HITS: Record<SceneId, number[]> = {
  hook: [0, at("hook", "DÍA")],
  dato: [at("dato", "$3,790") + 30],
  gta5: [at("gta5", "CINCO") + 22],
  avatar: [at("avatar", "$2,900")],
  segundo: [at("segundo", "CADA")],
  preventa: [at("preventa", "MILLONES") + 20],
  ojo: [0, at("ojo", "menos")],
  outro: [],
};

/* ---------- piezas reutilizables ---------- */
const Pop: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; from?: number; rot?: number }> = ({
  at: a,
  children,
  style,
  from = 0.2,
  rot = 0,
}) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - a, fps: FPS, config: { damping: 10, mass: 0.6 } });
  return (
    <div
      style={{
        position: "absolute",
        opacity: f < a ? 0 : Math.min(1, s * 3),
        transform: `scale(${interpolate(s, [0, 1], [from, 1])}) rotate(${interpolate(s, [0, 1], [rot, 0])}deg)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Slide: React.FC<{ at: number; dx?: number; dy?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  at: a,
  dx = 0,
  dy = 0,
  children,
  style,
}) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - a, fps: FPS, config: { damping: 14 } });
  return (
    <div style={{ position: "absolute", opacity: f < a ? 0 : 1, transform: `translate(${(1 - s) * dx}px, ${(1 - s) * dy}px)`, ...style }}>
      {children}
    </div>
  );
};

/** número grande con brillo neón */
const Big: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({
  children,
  size = 150,
  color = GREEN,
  style,
}) => (
  <div
    style={{
      fontFamily: numFont,
      fontSize: size,
      color,
      lineHeight: 1,
      whiteSpace: "nowrap",
      textShadow: `0 0 30px ${color}aa, 0 8px 0 #000`,
      WebkitTextStroke: `4px ${BG}`,
      paintOrder: "stroke fill",
      ...style,
    }}
  >
    {children}
  </div>
);

const Label: React.FC<{ children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }> = ({
  children,
  color = "white",
  size = 46,
  style,
}) => (
  <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: size, color, textTransform: "uppercase", whiteSpace: "nowrap", letterSpacing: 1, ...style }}>
    {children}
  </div>
);

const Stamp: React.FC<{ children: React.ReactNode; color?: string; size?: number; rotate?: number }> = ({
  children,
  color = PINK,
  size = 120,
  rotate = -8,
}) => (
  <div
    style={{
      fontFamily: numFont,
      fontSize: size,
      color: "white",
      background: color,
      padding: "4px 36px",
      borderRadius: 24,
      transform: `rotate(${rotate}deg)`,
      boxShadow: `0 0 50px ${color}, 0 12px 0 rgba(0,0,0,0.6)`,
      border: "6px solid white",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

/** centra horizontalmente un elemento absoluto */
const center = (top: number): React.CSSProperties => ({ top, left: 0, right: 0, display: "flex", justifyContent: "center" });

/* ---------- fondo animado ---------- */
const Background: React.FC = () => {
  const f = useCurrentFrame();
  const hue = interpolate(f, [0, TOTAL], [270, 320]);
  return (
    <AbsoluteFill style={{ backgroundColor: BG, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% ${38 + Math.sin(f / 40) * 6}%, hsla(${hue},90%,35%,0.55) 0%, transparent 55%),
                       radial-gradient(circle at ${20 + Math.cos(f / 55) * 10}% 85%, rgba(57,255,136,0.18) 0%, transparent 45%)`,
        }}
      />
      {/* rejilla en perspectiva */}
      <AbsoluteFill style={{ perspective: 600, top: 1100 }}>
        <div
          style={{
            position: "absolute",
            left: -1000,
            right: -1000,
            height: 1600,
            transform: "rotateX(70deg)",
            transformOrigin: "50% 0%",
            backgroundImage: `linear-gradient(${PINK}55 3px, transparent 3px), linear-gradient(90deg, ${PINK}55 3px, transparent 3px)`,
            backgroundSize: "120px 120px",
            backgroundPosition: `0px ${(f * 4) % 120}px`,
            maskImage: "linear-gradient(to bottom, transparent, black 30%)",
          }}
        />
      </AbsoluteFill>
      {/* signos de dólar flotando */}
      {Array.from({ length: 16 }).map((_, i) => {
        const x = random(`x${i}`) * 1080;
        const speed = 1 + random(`s${i}`) * 2.5;
        const y = 2100 - ((random(`y${i}`) * 2200 + f * speed) % 2300);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              fontFamily: numFont,
              fontSize: 60 + random(`z${i}`) * 90,
              color: GREEN,
              opacity: 0.08 + random(`o${i}`) * 0.08,
              transform: `rotate(${Math.sin(f / 20 + i) * 20}deg)`,
            }}
          >
            $
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Overlay: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      {/* scanlines + viñeta */}
      <AbsoluteFill
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 2px, transparent 2px, transparent 5px)",
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.75) 100%)" }} />
      {/* barra de progreso (retención) */}
      <div style={{ position: "absolute", top: 0, left: 0, height: 14, width: `${(f / TOTAL) * 100}%`, background: `linear-gradient(90deg, ${PINK}, ${GREEN})`, boxShadow: `0 0 20px ${GREEN}` }} />
    </>
  );
};

/* ---------- cámara: entrada con zoom-punch + sacudidas ---------- */
const Cam: React.FC<{ id: SceneId; children: React.ReactNode }> = ({ id, children }) => {
  const f = useCurrentFrame();
  const dur = sceneFrames(id);
  const enter = spring({ frame: f, fps: FPS, config: { damping: 15, mass: 0.7 } });
  const shake = HITS[id].reduce((a, h) => a + (f >= h ? Math.exp(-(f - h) / 5) : 0), 0) * 22;
  const sx = Math.sin(f * 2.7) * shake;
  const sy = Math.cos(f * 3.3) * shake;
  const drift = interpolate(f, [0, dur], [1, 1.06]);
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${sx}px, ${sy}px) scale(${drift * interpolate(enter, [0, 1], [1.3, 1])}) rotate(${interpolate(enter, [0, 1], [-3, 0])}deg)`,
        filter: `blur(${interpolate(enter, [0, 1], [10, 0])}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Flash: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "white", opacity: interpolate(f, [0, 5], [0.85, 0], clamp), pointerEvents: "none" }} />;
};

/* ---------- subtítulos estilo "karaoke" ---------- */
const Captions: React.FC<{ id: SceneId }> = ({ id }) => {
  const f = useCurrentFrame();
  const ts = wordTimes(id);
  const chunks: Word[][] = [];
  let cur: Word[] = [];
  ts.forEach((t) => {
    cur.push(t);
    if (cur.length >= 3 || /[.,:?!]$/.test(t.w)) {
      chunks.push(cur);
      cur = [];
    }
  });
  if (cur.length) chunks.push(cur);
  const chunk = chunks.find((c) => f < c[c.length - 1].end + 2) ?? chunks[chunks.length - 1];
  if (f < chunk[0].start - 2) return null;
  const pop = spring({ frame: f - chunk[0].start + 2, fps: FPS, config: { damping: 11, mass: 0.45 } });
  return (
    <div
      style={{
        position: "absolute",
        top: CAPTION_TOP,
        left: 60,
        right: 60,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 40px",
        transform: `scale(${interpolate(pop, [0, 1], [0.7, 1])}) translateY(${interpolate(pop, [0, 1], [40, 0])}px)`,
      }}
    >
      {chunk.map((t, i) => {
        const active = f >= t.start && f < t.end + 2;
        const color = t.key ? GREEN : active ? YELLOW : "white";
        return (
          <span
            key={i}
            style={{
              fontFamily: bodyFont,
              fontWeight: 900,
              fontSize: t.key ? 104 : 88,
              lineHeight: 1.2,
              textTransform: "uppercase",
              color,
              WebkitTextStroke: "16px #000",
              paintOrder: "stroke fill",
              transform: `scale(${active ? 1.12 : 1}) rotate(${active ? -3 : 0}deg)`,
              display: "inline-block",
              textShadow: t.key ? `0 0 30px ${GREEN}88, 0 10px 0 #000` : "0 10px 0 #000",
            }}
          >
            {t.w}
          </span>
        );
      })}
    </div>
  );
};

/* =================== ESCENAS =================== */

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const tDia = at("hook", "DÍA");
  const tPeli = at("hook", "película");
  const lose = spring({ frame: f - tPeli, fps: FPS, config: { damping: 12 } });
  const vsPulse = 1 + Math.sin(f / 3) * 0.08;
  return (
    <AbsoluteFill>
      <Slide at={0} dx={-700} style={{ left: 70, top: 470 }}>
        <div style={{ transform: `rotate(${lose * -18}deg) translateY(${lose * 60}px)`, filter: `grayscale(${lose}) brightness(${1 - lose * 0.5})` }}>
          <Clapper size={340} open={Math.max(0, Math.sin(f / 4) * 25) * (1 - lose)} />
        </div>
      </Slide>
      <Slide at={3} dx={700} style={{ left: 580, top: 560 }}>
        <div style={{ transform: `scale(${1 + lose * 0.15})` }}>
          <Controller size={430} glow={20 + lose * 40} />
        </div>
      </Slide>
      <Pop at={tPeli + 4} style={{ left: 710, top: 390 }} rot={-40}>
        <Crown size={170} />
      </Pop>
      <Pop at={8} style={center(620)}>
        <div style={{ transform: `scale(${vsPulse})` }}>
          <Big size={150} color={YELLOW}>VS</Big>
        </div>
      </Pop>
      <Pop at={tDia - 2} from={3} style={center(230)}>
        <Stamp size={140}>EN 24 HORAS</Stamp>
      </Pop>
    </AbsoluteFill>
  );
};

const Dato: React.FC = () => {
  const f = useCurrentFrame();
  const t19 = at("dato", "19");
  const tMoney = at("dato", "$3,790");
  const money = interpolate(f, [tMoney - 18, tMoney + 30], [0, 3_790_000_000], { ...clamp, easing: Easing.bezier(0.2, 0.7, 0.2, 1) });
  const done = f >= tMoney + 30;
  return (
    <AbsoluteFill>
      <Pop at={t19} style={{ left: 120, top: 250 }} rot={-25}>
        <div style={{ fontFamily: numFont }}>
          <Calendar day="19" month="NOV 2026" size={270} />
        </div>
      </Pop>
      <Slide at={t19 + 6} dx={600} style={{ left: 430, top: 300 }}>
        <Label size={50} color={YELLOW}>Día de lanzamiento</Label>
        <Label size={44} style={{ marginTop: 10, opacity: 0.85 }}>PS5 · Xbox Series</Label>
      </Slide>
      {f >= tMoney - 18 && (
        <div style={{ ...center(720), position: "absolute" }}>
          <Big size={done ? 150 : 132} style={{ transform: `scale(${done ? 1 + Math.sin(f / 4) * 0.03 : 1})` }}>
            ${fmt(money)}
          </Big>
        </div>
      )}
      <Pop at={tMoney + 30} style={center(910)}>
        <Label size={58} color="white" style={{ background: PINK, padding: "6px 30px", borderRadius: 14 }}>
          Récord histórico del entretenimiento
        </Label>
      </Pop>
      {/* lluvia de billetes */}
      {done &&
        Array.from({ length: 22 }).map((_, i) => {
          const lf = f - (tMoney + 30) - random(`d${i}`) * 25;
          if (lf < 0) return null;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: random(`bx${i}`) * 1000 - 40,
                top: -120 + lf * (14 + random(`bv${i}`) * 10),
                transform: `rotate(${lf * (random(`br${i}`) * 10 - 5)}deg) rotateX(${lf * 12}deg)`,
              }}
            >
              <Bill w={130 + random(`bw${i}`) * 60} />
            </div>
          );
        })}
    </AbsoluteFill>
  );
};

const BarV: React.FC<{ x: number; h: number; grow: number; color: string; value: string; name: string; year: string }> = ({
  x,
  h,
  grow,
  color,
  value,
  name,
  year,
}) => {
  const base = 1030;
  const hh = h * grow;
  return (
    <>
      <div style={{ position: "absolute", left: x, width: 300, top: base - hh, height: hh, background: `linear-gradient(180deg, ${color}, ${color}66)`, borderRadius: "22px 22px 0 0", boxShadow: `0 0 40px ${color}88` }} />
      <div style={{ position: "absolute", left: x, width: 300, top: base - hh - 115, display: "flex", justifyContent: "center", opacity: grow > 0.05 ? 1 : 0 }}>
        <Big size={100} color={color}>{value}</Big>
      </div>
      <div style={{ position: "absolute", left: x, width: 300, top: base + 14, textAlign: "center" }}>
        <Label size={50}>{name}</Label>
        <Label size={36} style={{ opacity: 0.7 }}>{year}</Label>
      </div>
    </>
  );
};

const Gta5: React.FC = () => {
  const f = useCurrentFrame();
  const t5 = at("gta5", "CINCO");
  const g1 = spring({ frame: f - 4, fps: FPS, config: { damping: 14 } });
  const g2 = interpolate(f, [t5, t5 + 22], [0, 1], { ...clamp, easing: Easing.bezier(0.5, 0, 0.2, 1.4) });
  return (
    <AbsoluteFill>
      <Slide at={0} dy={-200} style={center(220)}>
        <Label size={62} color={YELLOW}>Ventas del día 1</Label>
      </Slide>
      <BarV x={150} h={150} grow={g1} color="#4dc3ff" value="$800M" name="GTA V" year="2013" />
      <BarV x={630} h={590} grow={g2} color={GREEN} value="$3,790M" name="GTA VI" year="2026" />
      <Pop at={t5 + 22} from={4} style={{ left: 120, top: 470 }} rot={30}>
        <Stamp size={170} rotate={-10}>×4.7</Stamp>
      </Pop>
    </AbsoluteFill>
  );
};

const BarH: React.FC<{ top: number; w: number; grow: number; color: string; name: string; sub: string; value: string; icon: React.ReactNode }> = ({
  top,
  w,
  grow,
  color,
  name,
  sub,
  value,
  icon,
}) => (
  <div style={{ position: "absolute", top, left: 80, right: 80 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      {icon}
      <div>
        <Label size={54}>{name}</Label>
        <Label size={34} style={{ opacity: 0.75 }}>{sub}</Label>
      </div>
    </div>
    <div style={{ marginTop: 18, height: 90, width: w * grow, background: `linear-gradient(90deg, ${color}55, ${color})`, borderRadius: 16, boxShadow: `0 0 40px ${color}88`, position: "relative" }}>
      <div style={{ position: "absolute", right: 18, top: 6, opacity: grow > 0.5 ? 1 : 0 }}>
        <Big size={78} color="white" style={{ textShadow: "0 4px 0 #000" }}>{value}</Big>
      </div>
    </div>
  </div>
);

const AvatarScene: React.FC = () => {
  const f = useCurrentFrame();
  const tA = at("avatar", "Avatar");
  const tToda = at("avatar", "TODA");
  const tVal = at("avatar", "$2,900");
  const gA = interpolate(f, [tA, tToda + 20], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const gG = interpolate(f, [tVal - 6, tVal + 14], [0, 1], { ...clamp, easing: Easing.bezier(0.5, 0, 0.2, 1.3) });
  return (
    <AbsoluteFill>
      <Slide at={0} dy={-200} style={center(220)}>
        <Label size={60} color={YELLOW}>Película vs videojuego</Label>
      </Slide>
      <BarH top={360} w={(2920 / 3790) * 900} grow={gA} color="#4dc3ff" name="Avatar" sub="Toda su vida en cines" value="$2,920M" icon={<Clapper size={110} />} />
      <BarH top={720} w={900} grow={gG} color={GREEN} name="GTA VI" sub="Solo 24 horas" value="$3,790M" icon={<Controller size={140} glow={15} />} />
      <Pop at={tVal + 14} from={3} style={{ right: 70, top: 640 }} rot={30}>
        <Crown size={130} />
      </Pop>
    </AbsoluteFill>
  );
};

const Segundo: React.FC = () => {
  const f = useCurrentFrame();
  const tCada = at("segundo", "CADA");
  const running = Math.max(0, f - 4) * (43_866 / FPS);
  return (
    <AbsoluteFill>
      <Pop at={0} style={center(240)}>
        <Stopwatch size={400} angle={f * 36} />
      </Pop>
      <div style={{ ...center(740), position: "absolute" }}>
        <Big size={120} color="white">+${fmt(running)}</Big>
      </div>
      <Pop at={tCada - 2} from={3} style={center(900)}>
        <Stamp size={110} color={PINK} rotate={-6}>$43,866 / SEGUNDO</Stamp>
      </Pop>
    </AbsoluteFill>
  );
};

const Preventa: React.FC = () => {
  const f = useCurrentFrame();
  const t = at("preventa", "32.5");
  const tM = at("preventa", "MILLONES");
  const count = interpolate(f, [t, t + 33 * 1.2], [0, 32.5], clamp);
  return (
    <AbsoluteFill>
      <div style={{ ...center(210), position: "absolute" }}>
        <Big size={150}>{count.toFixed(1)}M</Big>
      </div>
      <Slide at={t + 4} dx={-800} style={center(375)}>
        <Label size={48} color={YELLOW}>Copias reservadas antes de salir</Label>
      </Slide>
      <div style={{ position: "absolute", top: 470, left: 124, width: 832, display: "flex", flexWrap: "wrap", gap: 16 }}>
        {Array.from({ length: 40 }).map((_, i) => {
          const a = t + i * 1.2;
          const s = spring({ frame: f - a, fps: FPS, config: { damping: 9, mass: 0.4 } });
          const filled = i < 32 ? 1 : i === 32 ? 0.5 : 0;
          return (
            <div key={i} style={{ transform: `scale(${filled ? s : 1})`, opacity: filled ? 1 : 0.5 }}>
              <GameBox w={90} fill={filled ? (f >= a ? filled : 0) : 0} />
            </div>
          );
        })}
      </div>
      <Pop at={tM + 20} style={{ left: 600, top: 1010 }} rot={20}>
        <Label size={38} style={{ background: "#000a", padding: "6px 18px", borderRadius: 10, border: `3px solid ${GREEN}` }}>
          Cada caja = 1 millón
        </Label>
      </Pop>
    </AbsoluteFill>
  );
};

const Card: React.FC<{ title: string; sub: string; value: string; note: string; color: string }> = ({ title, sub, value, note, color }) => (
  <div style={{ width: 880, padding: "26px 40px", borderRadius: 28, background: "rgba(22,16,42,0.92)", border: `6px solid ${color}`, boxShadow: `0 0 40px ${color}66` }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <Label size={44}>{title}</Label>
        <Label size={30} color={color}>{sub}</Label>
      </div>
      <Big size={86} color={color}>{value}</Big>
    </div>
    <Label size={30} style={{ marginTop: 10, opacity: 0.7, textTransform: "none", fontWeight: 800 }}>{note}</Label>
  </div>
);

const Ojo: React.FC = () => {
  const f = useCurrentFrame();
  const tS = at("ojo", "Sensor");
  const tMenos = at("ojo", "menos");
  const glitching = f < 10 || (f >= tMenos && f < tMenos + 8);
  const gx = glitching ? (random(`g${f}`) - 0.5) * 40 : 0;
  return (
    <AbsoluteFill style={{ transform: `translateX(${gx}px)`, filter: glitching ? `hue-rotate(${random(`h${f}`) * 180}deg)` : undefined }}>
      <Pop at={0} from={2} style={{ left: 110, top: 220 }}>
        <div style={{ transform: `rotate(${Math.sin(f / 3) * 4}deg)` }}>
          <Warning size={230} />
        </div>
      </Pop>
      <Slide at={4} dx={700} style={{ left: 380, top: 260 }}>
        <Big size={170} color={YELLOW}>¡OJO!</Big>
      </Slide>
      <Slide at={at("ojo", "Take-Two") - 4} dx={-1100} style={center(510)}>
        <Card title="Take-Two" sub="Cifra oficial" value="$3,790M" note="Dato de la propia empresa (incluye preventas)" color={GREEN} />
      </Slide>
      <Slide at={tS} dx={1100} style={center(800)}>
        <Card title="Sensor Tower" sub="Estimación externa" value="$2,360M" note="Solo PlayStation y Xbox" color={PINK} />
      </Slide>
      {glitching && (
        <AbsoluteFill style={{ background: `linear-gradient(0deg, transparent ${random(`a${f}`) * 80}%, ${PINK}55 ${random(`a${f}`) * 80 + 3}%, transparent ${random(`a${f}`) * 80 + 6}%)`, mixBlendMode: "screen" }} />
      )}
    </AbsoluteFill>
  );
};

const OptionBtn: React.FC<{ text: string; color: string; icon: React.ReactNode; pct: number }> = ({ text, color, icon, pct }) => (
  <div style={{ width: 880, height: 150, borderRadius: 75, background: "rgba(22,16,42,0.95)", border: `6px solid ${color}`, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", padding: "0 40px", gap: 26, boxShadow: `0 0 40px ${color}55` }}>
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`, background: `${color}44` }} />
    <div style={{ position: "relative" }}>{icon}</div>
    <Label size={56} style={{ position: "relative" }}>{text}</Label>
  </div>
);

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const t1 = at("outro", "jugaste");
  const t2 = at("outro", "precio");
  const tC = at("outro", "comentarios");
  const p1 = interpolate(f, [t1 + 5, t1 + 40], [0, 58], { ...clamp, easing: Easing.out(Easing.cubic) });
  const p2 = interpolate(f, [t2 + 5, t2 + 40], [0, 42], { ...clamp, easing: Easing.out(Easing.cubic) });
  const bob = Math.sin(f / 5) * 12;
  return (
    <AbsoluteFill>
      <Pop at={0} style={center(220)}>
        <Big size={120} color={YELLOW}>¿Y TÚ?</Big>
      </Pop>
      <Pop at={t1} style={center(420)}>
        <OptionBtn text="Ya lo jugué" color={GREEN} pct={p1} icon={<Controller size={110} />} />
      </Pop>
      <Pop at={t2} style={center(620)}>
        <OptionBtn text="Espero rebaja" color={PINK} pct={p2} icon={<Big size={80} color={PINK}>$</Big>} />
      </Pop>
      <Pop at={tC} style={center(860)}>
        <div style={{ transform: `translateY(${bob}px)`, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Label size={56} style={{ background: "white", color: BG, padding: "10px 34px", borderRadius: 40 }}>Comenta y sígueme</Label>
          <svg width={90} height={70} viewBox="0 0 90 70" style={{ marginTop: 10 }}>
            <path d="M10 10 L45 55 L80 10" fill="none" stroke="white" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};

const SCENES: Record<SceneId, React.FC> = {
  hook: Hook,
  dato: Dato,
  gta5: Gta5,
  avatar: AvatarScene,
  segundo: Segundo,
  preventa: Preventa,
  ojo: Ojo,
  outro: Outro,
};

/* =================== VIDEO =================== */
const Reel: React.FC = () => {
  // la música va bajo la voz y sube al final
  const musicVol = (f: number) => interpolate(f, [0, 10, TOTAL - 50, TOTAL - 10, TOTAL], [0, 0.22, 0.22, 0.4, 0], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Background />
      {ORDER.map((id) => {
        const Scene = SCENES[id];
        return (
          <Sequence key={id} from={STARTS[id]} durationInFrames={sceneFrames(id)} name={id}>
            <Cam id={id}>
              <Scene />
            </Cam>
            <Captions id={id} />
            <Flash />
            <Sequence from={LEAD} layout="none">
              <Audio src={staticFile(`voz/${id}.wav`)} volume={1} />
            </Sequence>
            {id !== "hook" && <Audio src={staticFile("sfx/whoosh.wav")} volume={0.45} />}
          </Sequence>
        );
      })}
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.max(0, STARTS[s.id] + s.f)} layout="none" name={`sfx-${s.s}`}>
          <Audio src={staticFile(`sfx/${s.s}.wav`)} volume={s.v ?? 0.6} />
        </Sequence>
      ))}
      <Audio src={staticFile("musica.wav")} volume={musicVol} />
      <Overlay />
    </AbsoluteFill>
  );
};

export const MyComposition = () => (
  <Composition id="GTA6Record" component={Reel} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
