import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";
import { loadFont as loadRajdhani } from "@remotion/google-fonts/Rajdhani";
import { loadFont as loadShareTech } from "@remotion/google-fonts/ShareTechMono";
import { loadFont as loadBungee } from "@remotion/google-fonts/Bungee";
import { loadFont as loadRubik } from "@remotion/google-fonts/Rubik";
import { loadFont as loadPressStart } from "@remotion/google-fonts/PressStart2P";
import { Theme } from "./theme";

const anton = loadAnton("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const montserrat = loadMontserrat("normal", { weights: ["800", "900"], subsets: ["latin"] }).fontFamily;
const playfair = loadPlayfair("normal", { weights: ["900"], subsets: ["latin"] }).fontFamily;
const lora = loadLora("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily;
const rajdhani = loadRajdhani("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily;
const shareTech = loadShareTech("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const bungee = loadBungee("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const rubik = loadRubik("normal", { weights: ["800", "900"], subsets: ["latin"] }).fontFamily;
export const pixelFont = loadPressStart("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;

const Vignette: React.FC<{ color?: string; strength?: number }> = ({ color = "0,0,0", strength = 0.75 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, transparent 55%, rgba(${color},${strength}) 100%)` }} />
);
const Progress: React.FC<{ total: number; bg: string; glow: string; height?: number }> = ({ total, bg, glow, height = 14 }) => {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", top: 0, left: 0, height, width: `${(f / total) * 100}%`, background: bg, boxShadow: `0 0 20px ${glow}` }} />;
};

/* =============== NEÓN (estilo original del canal) =============== */
const NeonBg: React.FC<{ total: number }> = ({ total }) => {
  const f = useCurrentFrame();
  const h = interpolate(f, [0, total], [270, 320]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0614", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% ${38 + Math.sin(f / 40) * 6}%, hsla(${h},90%,35%,0.55) 0%, transparent 55%)` }} />
      <AbsoluteFill style={{ perspective: 600, top: 1100 }}>
        <div
          style={{
            position: "absolute",
            left: -1000,
            right: -1000,
            height: 1600,
            transform: "rotateX(70deg)",
            transformOrigin: "50% 0%",
            backgroundImage: "linear-gradient(#ff2e8855 3px, transparent 3px), linear-gradient(90deg, #ff2e8855 3px, transparent 3px)",
            backgroundSize: "120px 120px",
            backgroundPosition: `0px ${(f * 4) % 120}px`,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
export const neon: Theme = {
  name: "neon",
  num: anton,
  body: montserrat,
  caption: montserrat,
  captionWeight: 900,
  bg: "#0b0614",
  key: "#39ff88",
  accent: "#ff2e88",
  highlight: "#ffd23f",
  alt: "#4dc3ff",
  text: "#ffffff",
  stroke: "#000000",
  panel: "rgba(22,16,42,0.92)",
  flash: "#ffffff",
  radius: 24,
  Background: NeonBg,
  Overlay: ({ total }) => (
    <>
      <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 2px, transparent 2px, transparent 5px)" }} />
      <Vignette />
      <Progress total={total} bg="linear-gradient(90deg, #ff2e88, #39ff88)" glow="#39ff88" />
    </>
  ),
};

/* =============== GALERÍA (Van Gogh): noche azul con remolinos de pincel =============== */
const GalleryBg: React.FC<{ total: number }> = () => {
  const f = useCurrentFrame();
  const swirls = [
    { x: 260, y: 330, r: 220, c: "#f2c14e", s: 0.6 },
    { x: 860, y: 240, r: 160, c: "#9cc7f0", s: -0.8 },
    { x: 620, y: 620, r: 300, c: "#6fa8dc", s: 0.4 },
    { x: 120, y: 900, r: 180, c: "#f6e7c1", s: -0.5 },
    { x: 980, y: 1050, r: 240, c: "#f2c14e", s: 0.7 },
  ];
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #0a1638 0%, #12245a 45%, #0d1a40 75%, #070d22 100%)", overflow: "hidden" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", opacity: 0.38 }}>
        {swirls.map((s, i) =>
          [1, 0.78, 0.56, 0.34].map((k, j) => (
            <circle
              key={`${i}-${j}`}
              cx={s.x}
              cy={s.y}
              r={s.r * k}
              fill="none"
              stroke={s.c}
              strokeWidth={14 - j * 2}
              strokeLinecap="round"
              strokeDasharray={`${40 + j * 10} ${28 + j * 6}`}
              transform={`rotate(${f * s.s * (1 + j * 0.3)} ${s.x} ${s.y})`}
            />
          )),
        )}
        {/* pinceladas horizontales tipo viento */}
        {Array.from({ length: 10 }).map((_, i) => {
          const y = 160 + i * 170;
          const off = ((f * (1 + (i % 3))) % 300) - 150;
          return (
            <path
              key={i}
              d={`M${-200 + off} ${y} q 135 -40 270 0 t 270 0 t 270 0 t 270 0 t 270 0`}
              stroke={i % 2 ? "#9cc7f0" : "#f6e7c1"}
              strokeWidth={6}
              fill="none"
              strokeLinecap="round"
              strokeDasharray="60 40"
              opacity={0.35}
            />
          );
        })}
        {/* estrellas */}
        {Array.from({ length: 22 }).map((_, i) => {
          const tw = 0.5 + 0.5 * Math.sin(f / 6 + i * 1.7);
          return <circle key={i} cx={random(`sx${i}`) * 1080} cy={random(`sy${i}`) * 1150} r={4 + tw * 5} fill="#fff3c4" opacity={0.4 + tw * 0.5} />;
        })}
      </svg>
      {/* textura de lienzo */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 6px), repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0 2px, transparent 2px 7px)",
        }}
      />
    </AbsoluteFill>
  );
};
const GalleryOverlay: React.FC<{ total: number }> = ({ total }) => (
  <>
    <Vignette color="20,10,0" strength={0.8} />
    {/* marco dorado fino alrededor del video */}
    <div style={{ position: "absolute", inset: 22, border: "6px solid #c8962e", borderRadius: 8, boxShadow: "inset 0 0 0 3px #7a5310, 0 0 0 3px #7a5310" }} />
    <Progress total={total} bg="linear-gradient(90deg, #c8962e, #f2c14e)" glow="#f2c14e" height={12} />
  </>
);
export const gallery: Theme = {
  name: "gallery",
  num: playfair,
  body: lora,
  caption: playfair,
  captionWeight: 900,
  bg: "#0d1633",
  key: "#f2c14e",
  accent: "#c8402f",
  highlight: "#f6e7c1",
  alt: "#6fa8dc",
  text: "#fff8e7",
  stroke: "#1a0f05",
  panel: "rgba(16,22,52,0.93)",
  flash: "#fff3d6",
  radius: 10,
  Background: GalleryBg,
  Overlay: GalleryOverlay,
};

/* =============== SONAR (submarino): pantalla de sonar en el fondo del mar =============== */
const SonarBg: React.FC<{ total: number }> = () => {
  const f = useCurrentFrame();
  const cx = 540;
  const cy = 760;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #04283a 0%, #021521 50%, #01080e 100%)", overflow: "hidden" }}>
      {/* anillos del sonar */}
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {[180, 360, 540, 720, 900].map((r) => (
          <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="#3dffb4" strokeOpacity={0.16} strokeWidth={3} />
        ))}
        <line x1={0} y1={cy} x2={1080} y2={cy} stroke="#3dffb4" strokeOpacity={0.12} strokeWidth={2} />
        <line x1={cx} y1={0} x2={cx} y2={1920} stroke="#3dffb4" strokeOpacity={0.12} strokeWidth={2} />
        {/* pulso que se expande */}
        {[0, 1].map((k) => {
          const p = ((f + k * 45) % 90) / 90;
          return <circle key={k} cx={cx} cy={cy} r={p * 950} fill="none" stroke="#3dffb4" strokeOpacity={0.35 * (1 - p)} strokeWidth={6} />;
        })}
        {/* contactos */}
        {Array.from({ length: 6 }).map((_, i) => {
          const a = random(`ca${i}`) * Math.PI * 2;
          const d = 200 + random(`cd${i}`) * 650;
          const sweep = ((f * 4) % 360) * (Math.PI / 180);
          const diff = (sweep - a + Math.PI * 4) % (Math.PI * 2);
          const o = Math.max(0, 1 - diff / 2.5);
          return <circle key={i} cx={cx + Math.cos(a) * d} cy={cy + Math.sin(a) * d} r={10} fill="#3dffb4" opacity={o * 0.8} />;
        })}
      </svg>
      {/* barrido giratorio */}
      <div
        style={{
          position: "absolute",
          left: cx - 1000,
          top: cy - 1000,
          width: 2000,
          height: 2000,
          borderRadius: "50%",
          background: "conic-gradient(from 0deg, rgba(61,255,180,0.28), rgba(61,255,180,0) 50deg, transparent 360deg)",
          transform: `rotate(${f * 4}deg)`,
        }}
      />
      {/* nieve marina */}
      {Array.from({ length: 40 }).map((_, i) => {
        const y = (random(`my${i}`) * 1920 + f * (0.6 + random(`mv${i}`))) % 1920;
        return <div key={i} style={{ position: "absolute", left: random(`mx${i}`) * 1080 + Math.sin(f / 30 + i) * 10, top: y, width: 4, height: 4, borderRadius: 2, background: "#bfeee0", opacity: 0.35 }} />;
      })}
    </AbsoluteFill>
  );
};
const SonarOverlay: React.FC<{ total: number }> = ({ total }) => {
  const f = useCurrentFrame();
  const secs = Math.floor(f / 30);
  const tc = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}:${String(f % 30).padStart(2, "0")}`;
  const corner = (s: React.CSSProperties) => <div style={{ position: "absolute", width: 70, height: 70, borderColor: "#3dffb4", borderStyle: "solid", borderWidth: 0, opacity: 0.8, ...s }} />;
  return (
    <>
      <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 2px, transparent 2px, transparent 4px)" }} />
      <Vignette color="0,6,10" strength={0.85} />
      {corner({ left: 30, top: 40, borderLeftWidth: 6, borderTopWidth: 6 })}
      {corner({ right: 30, top: 40, borderRightWidth: 6, borderTopWidth: 6 })}
      {corner({ left: 30, bottom: 40, borderLeftWidth: 6, borderBottomWidth: 6 })}
      {corner({ right: 30, bottom: 40, borderRightWidth: 6, borderBottomWidth: 6 })}
      <div style={{ position: "absolute", left: 60, top: 70, fontFamily: shareTech, fontSize: 34, color: "#3dffb4", letterSpacing: 2, display: "flex", gap: 18, alignItems: "center" }}>
        <span style={{ width: 18, height: 18, borderRadius: 9, background: "#ff4d3d", opacity: Math.floor(f / 15) % 2 ? 1 : 0.3 }} />
        SONAR ACTIVO · {tc}
      </div>
      <Progress total={total} bg="#3dffb4" glow="#3dffb4" height={10} />
    </>
  );
};
export const sonar: Theme = {
  name: "sonar",
  num: shareTech,
  body: rajdhani,
  caption: rajdhani,
  captionWeight: 700,
  bg: "#020c14",
  key: "#3dffb4",
  accent: "#ff4d3d",
  highlight: "#ffb000",
  alt: "#38c6ff",
  text: "#e6fff6",
  stroke: "#00110c",
  panel: "rgba(2,26,36,0.92)",
  flash: "#3dffb4",
  radius: 6,
  Background: SonarBg,
  Overlay: SonarOverlay,
};

/* =============== STREAM (GTA VI): pantalla de transmisión en vivo =============== */
const StreamBg: React.FC<{ total: number }> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#0e0e10", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${50 + Math.sin(f / 50) * 20}% 30%, rgba(145,70,255,0.45), transparent 55%), radial-gradient(circle at 80% 90%, rgba(46,230,166,0.18), transparent 45%)` }} />
      {/* rejilla de píxeles */}
      <AbsoluteFill
        style={{
          backgroundImage: "linear-gradient(rgba(191,148,255,0.07) 2px, transparent 2px), linear-gradient(90deg, rgba(191,148,255,0.07) 2px, transparent 2px)",
          backgroundSize: "40px 40px",
          backgroundPosition: `0 ${(f * 2) % 40}px`,
        }}
      />
      {/* bloques de píxel que parpadean */}
      {Array.from({ length: 26 }).map((_, i) => {
        const on = Math.sin(f / 7 + i * 2.3) > 0.6;
        return <div key={i} style={{ position: "absolute", left: Math.floor(random(`px${i}`) * 27) * 40, top: Math.floor(random(`py${i}`) * 48) * 40, width: 40, height: 40, background: i % 3 ? "#9146ff" : "#2ee6a6", opacity: on ? 0.25 : 0 }} />;
      })}
    </AbsoluteFill>
  );
};
const CHAT = ["GG", "W", "NO PUEDE SER 😱", "🔥🔥🔥", "LOCURAAA", "a mimir no", "F", "+1 sub", "jajaja", "POG", "épico", "otra!!", "👀", "dato bomba 💥"];
const StreamOverlay: React.FC<{ total: number }> = ({ total }) => {
  const f = useCurrentFrame();
  return (
    <>
      {/* borde de "pantalla de stream" */}
      <div style={{ position: "absolute", inset: 18, border: "5px solid #9146ff", borderRadius: 26, boxShadow: "0 0 30px #9146ff88, inset 0 0 30px #9146ff44" }} />
      <div style={{ position: "absolute", left: 50, top: 60, display: "flex", gap: 14, alignItems: "center" }}>
        <div style={{ fontFamily: pixelFont, fontSize: 24, color: "white", background: "#eb0400", padding: "10px 14px", borderRadius: 6, opacity: Math.floor(f / 20) % 2 ? 1 : 0.8 }}>● EN VIVO</div>
        <div style={{ fontFamily: pixelFont, fontSize: 22, color: "#bf94ff", background: "rgba(0,0,0,0.6)", padding: "10px 14px", borderRadius: 6 }}>DATO BOMBA</div>
      </div>
      {/* chat flotante */}
      {Array.from({ length: 6 }).map((_, i) => {
        const cycle = 150;
        const local = (f + i * 25) % cycle;
        const idx = Math.floor((f + i * 25) / cycle) * 6 + i;
        const msg = CHAT[idx % CHAT.length];
        const user = ["neo", "lu_gamer", "xx_dani", "mar1a", "tito77", "pixel"][i];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 50,
              top: 1700 - local * 1.6,
              opacity: interpolate(local, [0, 10, 110, 150], [0, 0.85, 0.85, 0]),
              fontFamily: rubik,
              fontWeight: 800,
              fontSize: 30,
              color: "white",
              background: "rgba(24,24,27,0.75)",
              padding: "6px 14px",
              borderRadius: 10,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: ["#2ee6a6", "#ffe066", "#ff7ab6", "#7ad7ff", "#bf94ff", "#ff9a3d"][i] }}>{user}:</span> {msg}
          </div>
        );
      })}
      <Progress total={total} bg="linear-gradient(90deg, #9146ff, #2ee6a6)" glow="#9146ff" />
    </>
  );
};
export const stream: Theme = {
  name: "stream",
  num: bungee,
  body: rubik,
  caption: rubik,
  captionWeight: 900,
  bg: "#0e0e10",
  key: "#2ee6a6",
  accent: "#ff3b5c",
  highlight: "#ffe066",
  alt: "#bf94ff",
  text: "#ffffff",
  stroke: "#000000",
  panel: "rgba(24,24,27,0.94)",
  flash: "#9146ff",
  radius: 14,
  Background: StreamBg,
  Overlay: StreamOverlay,
};
