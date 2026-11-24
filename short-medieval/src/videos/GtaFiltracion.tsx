import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame } from "remotion";
import voz from "./voz_gta-filtracion.json";
import { INK, Toon } from "../Characters";
import type { ToonProps } from "../Characters";
import { At, BackHead, BG, Bench, Cam, Court, Grade, headY, Judge, judgeHead, makeTiming, NarratedVideo, Sfx, shots, sw8 } from "../kit";
import { Room, Sign } from "../Scenery";
import { CodeScreen, CorkBoard, Counter, GameShop, HotelRoom, Polaroid } from "../Scenery2";
import { Clip } from "./Clip";

const ORDER = ["hook", "leak", "hacker", "hotel", "firestick", "juicio", "record", "salida", "outro"];
const TAIL = { outro: 26 };
const T = makeTiming(voz, ORDER, TAIL);
const wf = T.wf;

const HACK: ToonProps = { hair: "hood", hairColor: "#2b2d36", outfit: "#2b2d36", outfit2: "#4a4d5a", seed: 9 };
const H1 = { x: 540, y: 2060, h: 1380 };

/** mini sunset screen used for "leaked clips" */
const MiniClip: React.FC<{ seed: number }> = ({ seed }) => (
  <svg width="100%" height="100%" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id={`mc${seed}`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#2b1055" />
        <stop offset="0.6" stopColor="#ff3c7d" />
        <stop offset="1" stopColor="#ffb347" />
      </linearGradient>
    </defs>
    <rect width="160" height="100" fill={`url(#mc${seed})`} />
    <circle cx={60 + (seed % 3) * 20} cy="70" r="22" fill="#fff36b" opacity="0.9" />
    {Array.from({ length: 6 }).map((_, i) => (
      <rect key={i} x={i * 28} y={70 - random(`h${seed}${i}`) * 40} width="22" height="60" fill="#2a1240" />
    ))}
    <polygon points="70,38 70,62 92,50" fill="white" opacity="0.9" />
  </svg>
);

const TVWall: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#0b0d14" }}>
      <div style={{ position: "absolute", left: 40, top: 260, width: 1000, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
        {Array.from({ length: 15 }).map((_, i) => {
          const s = spring({ frame: f - at - i * 2, fps: 30, config: { damping: 10 } });
          const glitch = Math.floor(f / 3 + i) % 11 === 0;
          return (
            <div key={i} style={{ height: 230, border: `8px solid ${INK}`, borderRadius: 10, background: "#111", overflow: "hidden", transform: `scale(${s}) translateX(${glitch ? 8 : 0}px)`, boxShadow: "0 0 30px rgba(255,80,150,0.35)", filter: glitch ? "hue-rotate(90deg)" : undefined }}>
              <MiniClip seed={i} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const SHook: React.FC = () => {
  const id = "hook";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fFilt = wf(id, "filtraciones");
  const fAdol = wf(id, "adolescente.");
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.0, 1.08, 0, 60],
            [fFilt, 2.0, 2.2, 110, -80],
            [fAdol - 4, 1.7, 1.85, 0, headY(H1.y, H1.h) + 60],
          ],
          end,
        )}
        shakeAt={[fFilt + 2]}
      >
        <BG blur={1.5}>
          <HotelRoom screen={<CodeScreen />} />
        </BG>
        <At x={H1.x} y={H1.y} from="none">
          <Toon {...HACK} expr={f > fAdol ? "smug" : "neutral"} pose="fight" height={H1.h} />
        </At>
      </Cam>
      <Grade tint="rgba(90,140,255,0.35)" vig={0.75} />
      <Clip name="hook-filtracion" from={0} to={fFilt} />
      <Sfx at={4} src="teclas" vol={0.5} />
      <Sfx at={fFilt} src="glitch" vol={0.4} />
    </>
  );
};

const SLeak: React.FC = () => {
  const id = "leak";
  const end = T.frames(id);
  const fApar = wf(id, "Aparecen");
  return (
    <>
      <Cam keys={shots([[0, 1.0, 1.15, 0, 0]], end)}>
        <TVWall at={2} />
        <Sign text="SEPTIEMBRE" sub="2022" y={40} color="#7a1e24" />
      </Cam>
      <Grade vig={0.7} />
      <Sfx at={fApar} src="glitch" vol={0.45} />
      <Sfx at={fApar + 10} src="glitch" vol={0.3} />
    </>
  );
};

const SHacker: React.FC = () => {
  const id = "hacker";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fGrupo = wf(id, "grupo");
  return (
    <>
      <Cam keys={shots([[0, 1.25, 1.4, 0, -40], [fGrupo, 1.05, 1.12, 0, 120]], end)}>
        <CorkBoard />
        <Polaroid x={540} y={480} w={560} rot={-3} label="17 AÑOS · REINO UNIDO" bg="#a6b0d8">
          <div style={{ position: "absolute", left: "50%", top: 20, transform: "translateX(-50%)" }}>
            <Toon {...HACK} expr="smug" height={680} />
          </div>
        </Polaroid>
        {f > fGrupo && (
          <At x={540} y={1650} at={fGrupo} z={3000}>
            <div style={{ fontFamily: "Oswald", fontWeight: 700, fontSize: 130, color: "#c8102e", background: "#f7f4ec", border: `8px solid ${INK}`, padding: "0 40px", transform: "rotate(-6deg)", boxShadow: "0 12px 0 rgba(0,0,0,0.35)" }}>LAPSUS$</div>
          </At>
        )}
      </Cam>
      <Grade tint="rgba(255,220,180,0.15)" />
      <Sfx at={4} src="pop" vol={0.4} />
      <Sfx at={fGrupo} src="mazo" vol={0.35} />
    </>
  );
};

const SHotel: React.FC = () => {
  const id = "hotel";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fPol = wf(id, "policía");
  const fSin = wf(id, "sin");
  const P = { x: 830, y: 2060, h: 1380 };
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.05, 1.12, 0, 160],
            [fPol, 1.6, 1.75, P.x - 540, headY(P.y, P.h) + 60],
            [fSin, 1.6, 1.75, -60, headY(H1.y, H1.h) + 60],
          ],
          end,
        )}
      >
        <BG>
          <HotelRoom screen={<rect width="600" height="360" fill="#101320" />} />
        </BG>
        <At x={480} y={H1.y} from="none">
          <Toon {...HACK} expr={f > fSin ? "worried" : "neutral"} {...sw8(f, fSin, "idle", "shrug")} height={H1.h} />
        </At>
        <At x={P.x} y={P.y} from="right" at={fPol - 6}>
          <Toon hair="buzz" hairColor="#1f2a44" outfit="#1f2a44" outfit2="#c9d2e0" expr="angry" pose="hips" flip height={P.h} seed={33} />
        </At>
      </Cam>
      <Grade tint="rgba(255,220,180,0.18)" />
      <Sfx at={fPol - 6} src="whoosh" vol={0.3} />
    </>
  );
};

const Gadget: React.FC<{ kind: "tv" | "phone" | "stick"; x: number; y: number; at: number }> = ({ kind, x, y, at }) => (
  <At x={x} y={y} at={at} z={6000}>
    <svg width={kind === "tv" ? 420 : 260} height={kind === "tv" ? 300 : 300} viewBox={kind === "tv" ? "0 0 420 300" : "0 0 260 300"}>
      {kind === "tv" && (
        <>
          <rect x="10" y="10" width="400" height="240" rx="14" fill="#15151a" stroke={INK} strokeWidth="10" />
          <rect x="28" y="28" width="364" height="204" fill="#0a2a1a" />
          <text x="210" y="145" textAnchor="middle" fontFamily="monospace" fontSize="40" fill="#3dff7a">{">_ ACCESS"}</text>
          <rect x="180" y="250" width="60" height="40" fill="#3a3a44" stroke={INK} strokeWidth="6" />
        </>
      )}
      {kind === "phone" && (
        <>
          <rect x="70" y="20" width="130" height="260" rx="22" fill="#22242c" stroke={INK} strokeWidth="10" />
          <rect x="84" y="46" width="102" height="200" rx="6" fill="#4de1ff" />
          <circle cx="135" cy="262" r="8" fill="#555" />
        </>
      )}
      {kind === "stick" && (
        <>
          <rect x="40" y="120" width="180" height="56" rx="14" fill="#1b1b20" stroke={INK} strokeWidth="9" />
          <rect x="200" y="132" width="44" height="32" rx="4" fill="#9aa3ad" stroke={INK} strokeWidth="6" />
          <circle cx="80" cy="148" r="8" fill="#4de1ff" />
        </>
      )}
    </svg>
  </At>
);

const SFirestick: React.FC = () => {
  const id = "firestick";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fTele = wf(id, "tele");
  const fMovil = wf(id, "móvil...");
  const fFire = wf(id, "Fire");
  return (
    <>
      <Cam keys={shots([[0, 1.6, 1.75, 0, headY(H1.y, H1.h) + 80], [fTele - 2, 1.05, 1.1, 0, 120]], end)} shakeAt={[fFire + 2]}>
        <BG>
          <HotelRoom screen={<CodeScreen />} />
        </BG>
        <At x={H1.x} y={H1.y} from="none">
          <Toon {...HACK} expr={f > fFire ? "smug" : "happy"} pose="fight" height={H1.h} />
        </At>
        <Gadget kind="tv" x={260} y={1000} at={fTele} />
        <Gadget kind="phone" x={840} y={1050} at={fMovil} />
        <Gadget kind="stick" x={540} y={760} at={fFire} />
      </Cam>
      <Grade tint="rgba(90,140,255,0.28)" />
      <Sfx at={fTele} src="pop" vol={0.45} />
      <Sfx at={fMovil} src="pop" vol={0.45} />
      <Sfx at={fFire} src="ding" vol={0.45} />
      <Sfx at={fFire + 6} src="teclas" vol={0.4} />
    </>
  );
};

const SJuicio: React.FC = () => {
  const id = "juicio";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fTrib = wf(id, "tribunal");
  const fHosp = wf(id, "hospital");
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.05, 1.12, 0, 80],
            [fTrib, 1.8, 1.95, 0, judgeHead + 40],
            [fHosp, 1.15, 1.25, 0, 200],
          ],
          end,
        )}
        shakeAt={[fTrib + 6]}
      >
        {f < fHosp ? (
          <>
            <Court />
            <Judge expr="angry" {...sw8(f, fTrib, "idle", "gavel")} talking={f > fTrib} />
            <Bench />
          </>
        ) : (
          <>
            <BG>
              <Room wall="#9fd6c8" side="#5f9f90" floorA="#eef7f3" floorB="#3d8e7c" trim="#2f6f62" />
            </BG>
            <Sign text="SEGURIDAD" y={60} />
            <At x={H1.x} y={H1.y} from="none">
              <Toon {...HACK} outfit="#e9eef2" outfit2="#c9d2da" expr="worried" pose="idle" height={H1.h} />
            </At>
          </>
        )}
      </Cam>
      <Grade tint="rgba(150,220,215,0.18)" />
      <Sfx at={fTrib + 4} src="mazo" vol={0.8} />
    </>
  );
};

const SRecord: React.FC = () => {
  const id = "record";
  const end = T.frames(id);
  const fRec = wf(id, "récords:");
  const fDia = wf(id, "día.");
  return (
    <>
      <Cam keys={shots([[0, 1.25, 1.4, 0, -100], [fRec, 1.0, 1.08, 0, 40]], end)}>
        <BG blur={1.5}>
          <Room wall="#2a2340" side="#1b1630" floorA="#3a3350" floorB="#2a2440" trim="#151024" />
        </BG>
        {/* big TV */}
        <div style={{ position: "absolute", left: 90, top: 380, width: 900, height: 560, background: "#111", border: `14px solid ${INK}`, borderRadius: 18, overflow: "hidden", boxShadow: "0 0 80px rgba(255,80,150,0.5)" }}>
          <MiniClip seed={7} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 150, background: "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.85))" }} />
          <div style={{ position: "absolute", left: 30, bottom: 70, fontFamily: "Oswald", fontWeight: 700, fontSize: 56, color: "white" }}>TRÁILER 1</div>
          <div style={{ position: "absolute", left: 30, bottom: 18, fontFamily: "Oswald", fontWeight: 700, fontSize: 48, color: "#ffcf4a" }}>
            <Counter from={0} to={93000000} at={fRec} dur={Math.max(10, fDia - fRec)} /> vistas
          </div>
          <div style={{ position: "absolute", right: 30, top: 24, fontFamily: "Oswald", fontWeight: 700, fontSize: 50, color: "white", background: "#c8102e", padding: "0 18px", borderRadius: 8 }}>24 H</div>
        </div>
        <BackHead x={200} y={1650} r={210} hair="#2a1a10" seed={1} />
        <BackHead x={560} y={1720} r={230} hair="#d8692a" seed={2} />
        <BackHead x={920} y={1660} r={210} hair="#6b3b1f" seed={3} />
      </Cam>
      <Grade tint="rgba(200,120,255,0.18)" />
      <Sfx at={fRec} src="ding" vol={0.4} />
    </>
  );
};

const Confetti: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, zIndex: 8500 }}>
      {Array.from({ length: 60 }).map((_, i) => {
        const t = f - at;
        const x = random(`cx${i}`) * 1080 + Math.sin(t / 8 + i) * 30;
        const y = -50 + t * (8 + random(`cv${i}`) * 8);
        return <rect key={i} x={x} y={y} width="18" height="30" fill={["#ff4f9a", "#ffcf4a", "#4de1ff", "#8ef0b4"][i % 4]} stroke={INK} strokeWidth="3" transform={`rotate(${t * 6 + i * 30} ${x} ${y})`} />;
      })}
    </svg>
  );
};

const SSalida: React.FC = () => {
  const id = "salida";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fTiendas = wf(id, "tiendas.");
  const fNov = wf(id, "noviembre");
  return (
    <>
      <Cam keys={shots([[0, 1.0, 1.1, 0, 40], [fTiendas, 1.25, 1.35, 0, 260]], end)}>
        <BG blur={1.5}>
          <GameShop />
        </BG>
        {f > fNov - 4 && (
          <div style={{ position: "absolute", top: 120, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 3000 }}>
            <div style={{ background: "#f7f4ec", border: `10px solid ${INK}`, borderRadius: 16, width: 360, textAlign: "center", boxShadow: "0 14px 0 rgba(0,0,0,0.4)", overflow: "hidden", transform: `scale(${spring({ frame: f - fNov + 4, fps: 30, config: { damping: 10 } })})` }}>
              <div style={{ background: "#c8102e", color: "white", fontFamily: "Oswald", fontWeight: 700, fontSize: 64 }}>NOV</div>
              <div style={{ fontFamily: "Oswald", fontWeight: 700, fontSize: 170, lineHeight: 1.05, color: INK }}>19</div>
              <div style={{ fontFamily: "Oswald", fontWeight: 700, fontSize: 52, color: INK, paddingBottom: 10 }}>2026</div>
            </div>
          </div>
        )}
        <At x={540} y={2050} from="none">
          <Toon hair="spiky" hairColor="#d8692a" outfit="#d9a82a" expr={f > fTiendas ? "happy" : "surprised"} pose={f > fTiendas ? "up" : "idle"} height={1250} seed={2} />
        </At>
      </Cam>
      <Confetti at={fTiendas} />
      <Grade tint="rgba(255,150,200,0.15)" />
      <Clip name="salida" from={0} to={fNov - 4} />
      <Sfx at={fNov - 4} src="pop" vol={0.45} />
      <Sfx at={fTiendas} src="ding" vol={0.5} />
    </>
  );
};

const SOutro: React.FC = () => {
  const id = "outro";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const P = { x: 540, y: 2060, h: 1380 };
  const glow = ["#ff3c7d", "#4de1ff", "#ffb347"][Math.floor(f / 12) % 3];
  return (
    <>
      <Cam keys={shots([[0, 1.55, 1.7, 0, headY(P.y, P.h) + 60]], end)}>
        <BG blur={2}>
          <Room wall="#2a2340" side="#1b1630" floorA="#3a3350" floorB="#2a2440" trim="#151024" />
        </BG>
        <At x={P.x} y={P.y} from="none">
          <Toon hair="spiky" hairColor="#d8692a" outfit="#d9a82a" expr="happy" pose="hold" talking height={P.h} seed={2} />
        </At>
      </Cam>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 110%, ${glow}55, rgba(0,0,0,0) 60%)`, mixBlendMode: "screen", zIndex: 9000, opacity: interpolate(f, [0, 10], [0, 1], { extrapolateRight: "clamp" }) }} />
      <Grade tint="rgba(200,120,255,0.18)" />
    </>
  );
};

const SCENES: Record<string, React.FC> = { hook: SHook, leak: SLeak, hacker: SHacker, hotel: SHotel, firestick: SFirestick, juicio: SJuicio, record: SRecord, salida: SSalida, outro: SOutro };

export const GTA_FILTRACION_FRAMES = T.total;
export const GtaFiltracion: React.FC = () => <NarratedVideo voz={voz} order={ORDER} tail={TAIL} scenes={SCENES} folder="voz_gta-filtracion" music="musica_gta.wav" musicVol={0.14} />;
