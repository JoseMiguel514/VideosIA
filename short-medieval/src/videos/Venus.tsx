import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from "remotion";
import voz from "./voz_venus.json";
import { INK, Toon } from "../Characters";
import type { ToonProps } from "../Characters";
import { At, BG, Cam, Grade, headY, makeTiming, NarratedVideo, Sfx, shots, sw8 } from "../kit";
import { Planet, Stars, Underwater, VenusSurface } from "../Scenery2";

const ORDER = ["hook", "venus", "giro", "reves", "calor", "presion", "nubes", "outro"];
const TAIL = { outro: 26 };
const T = makeTiming(voz, ORDER, TAIL);
const wf = T.wf;

const ASTRO: ToonProps = { hair: "astro", outfit: "#e9eef2", outfit2: "#c9d2da", seed: 7 };
const A = { x: 540, y: 2060, h: 1300 };

/** floating wrapper (zero gravity) */
const Float: React.FC<{ children: React.ReactNode; amp?: number }> = ({ children, amp = 22 }) => {
  const f = useCurrentFrame();
  return <div style={{ transform: `translateY(${Math.sin(f / 18) * amp}px) rotate(${Math.sin(f / 27) * 4}deg)` }}>{children}</div>;
};

/** HTML label card that pops */
const Tag: React.FC<{ text: string; x: number; y: number; at: number; color?: string; size?: number }> = ({ text, x, y, at, color = "#ffcf4a", size = 70 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = spring({ frame: f - at, fps: 30, config: { damping: 10 } });
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, zIndex: 6000, fontFamily: "Oswald", fontWeight: 700, fontSize: size, color: INK, background: color, border: `8px solid ${INK}`, borderRadius: 16, padding: "4px 26px", boxShadow: "0 10px 0 rgba(0,0,0,0.35)", whiteSpace: "nowrap" }}>
      {text}
    </div>
  );
};

/** curved rotation arrow around a center */
const SpinArrow: React.FC<{ cx: number; cy: number; r: number; dir: 1 | -1; color?: string }> = ({ cx, cy, r, dir, color = "#4de1ff" }) => {
  const f = useCurrentFrame();
  const a0 = ((f * 3 * dir) % 360) * (Math.PI / 180);
  const a1 = a0 + dir * 1.6;
  const p = (a: number) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.35];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  const [xh, yh] = p(a1 + dir * 0.15);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, zIndex: 3000, overflow: "visible" }}>
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.35} fill="none" stroke={color} strokeWidth="5" strokeDasharray="14 14" opacity="0.6" />
      <path d={`M${x0} ${y0} A${r} ${r * 0.35} 0 0 ${dir === 1 ? 1 : 0} ${x1} ${y1}`} stroke={INK} strokeWidth="22" fill="none" strokeLinecap="round" />
      <path d={`M${x0} ${y0} A${r} ${r * 0.35} 0 0 ${dir === 1 ? 1 : 0} ${x1} ${y1}`} stroke={color} strokeWidth="12" fill="none" strokeLinecap="round" />
      <circle cx={xh} cy={yh} r="20" fill={color} stroke={INK} strokeWidth="6" />
    </svg>
  );
};

const Thermo: React.FC<{ at: number; x: number; y: number }> = ({ at, x, y }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 40], [0.05, 0.95], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const deg = Math.round(p * 484);
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 6000 }}>
      <svg width={200} height={760} viewBox="0 0 200 760">
        <rect x="70" y="20" width="60" height="620" rx="30" fill="#f4f6f8" stroke={INK} strokeWidth="10" />
        <rect x="84" y={40 + 590 * (1 - p)} width="32" height={590 * p} rx="16" fill="#e8322a" />
        <circle cx="100" cy="680" r="70" fill="#e8322a" stroke={INK} strokeWidth="10" />
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1="130" x2="160" y1={80 + i * 130} y2={80 + i * 130} stroke={INK} strokeWidth="6" />
        ))}
      </svg>
      <div style={{ position: "absolute", left: -40, top: -90, width: 280, textAlign: "center", fontFamily: "Oswald", fontWeight: 700, fontSize: 80, color: "white", WebkitTextStroke: `10px ${INK}`, paintOrder: "stroke fill" }}>{Math.min(deg, 460)}°C</div>
    </div>
  );
};

const SHook: React.FC = () => {
  const id = "hook";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fPlan = wf(id, "planeta");
  const fLado = wf(id, "lado.");
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.6, 1.75, 0, headY(A.y, A.h) + 60],
            [fPlan + 4, 1.0, 1.08, 0, -60],
            [fLado, 1.3, 1.45, 0, -300],
          ],
          end,
        )}
      >
        <Stars />
        {f > fPlan && (
          <At x={540} y={1040} at={fPlan + 2} z={500}>
            <Planet kind="venus" r={300} spin={f / 30} face expr={f > fLado ? "smug" : "happy"} />
          </At>
        )}
        <At x={f > fPlan ? 300 : A.x} y={A.y} from="none">
          <Float>
            <Toon {...ASTRO} expr="happy" pose={f > fPlan ? "point" : "idle"} talking height={f > fPlan ? 900 : A.h} />
          </Float>
        </At>
      </Cam>
      <Grade tint="rgba(140,120,255,0.15)" />
      <Sfx at={fPlan + 2} src="whoosh" vol={0.4} />
    </>
  );
};

const SVenus: React.FC = () => {
  const id = "venus";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fVen = wf(id, "Venus.");
  const fVuelta = wf(id, "vuelta");
  const ang = interpolate(f, [fVuelta - 10, end], [Math.PI * 0.6, Math.PI * 2.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const C = { x: 540, y: 960 };
  const vx = C.x + Math.cos(ang) * 400;
  const vy = C.y + Math.sin(ang) * 520;
  return (
    <>
      <Cam keys={shots([[0, 1.3, 1.4, 0, 0], [fVuelta - 6, 1.0, 1.05, 0, 0]], end)}>
        <Stars />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <ellipse cx={C.x} cy={C.y} rx="400" ry="520" fill="none" stroke="#ffcf4a" strokeWidth="5" strokeDasharray="18 16" opacity="0.6" />
        </svg>
        <At x={C.x} y={C.y + 230} from="none" z={200}>
          <Planet kind="sun" r={180} face expr="happy" />
        </At>
        <At x={vx} y={vy + 170} from={f < fVen + 4 ? "pop" : "none"} at={fVen - 2} z={400}>
          <Planet kind="venus" r={130} spin={f / 20} face expr="happy" talking={false} />
        </At>
      </Cam>
      <Tag text={`${Math.round(interpolate(ang, [Math.PI * 0.6, Math.PI * 2.6], [0, 225]))} DÍAS`} x={540} y={1650} at={fVuelta} size={90} />
      <Grade tint="rgba(255,200,120,0.12)" />
      <Sfx at={fVen - 2} src="pop" vol={0.4} />
    </>
  );
};

const SGiro: React.FC = () => {
  const id = "giro";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fGirar = wf(id, "girar");
  const fDia = wf(id, "día");
  return (
    <>
      <Cam keys={shots([[0, 1.0, 1.1, 0, 0], [fDia, 1.15, 1.25, 0, 60]], end)}>
        <Stars drift={0.15} />
        <At x={540} y={1360} from="none" z={300}>
          <Planet kind="venus" r={360} spin={f / 60} face expr={f > fDia ? "surprised" : "neutral"} />
        </At>
        {f > fGirar - 6 && <SpinArrow cx={540} cy={960} r={470} dir={1} />}
      </Cam>
      <Tag text="1 GIRO = 243 DÍAS" x={540} y={330} at={2} color="#4de1ff" />
      <Tag text="DÍA 243  >  AÑO 225" x={540} y={1650} at={fDia} size={84} />
      <Grade tint="rgba(255,200,120,0.12)" />
      <Sfx at={fDia} src="ding" vol={0.45} />
    </>
  );
};

const SReves: React.FC = () => {
  const id = "reves";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fAlli = wf(id, "allí,");
  const fOeste = wf(id, "oeste.");
  const rise = interpolate(f, [fAlli, end], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <Cam keys={shots([[0, 1.0, 1.06, 0, 0], [fAlli, 1.05, 1.12, 0, 120]], end)}>
        {f < fAlli ? (
          <>
            <Stars drift={0.15} />
            <At x={300} y={1000} from="none" z={300}>
              <Planet kind="earth" r={170} spin={f / 10} />
            </At>
            <SpinArrow cx={300} cy={760} r={240} dir={1} color="#8ef0b4" />
            <At x={680} y={1600} from="none" z={300}>
              <Planet kind="venus" r={230} spin={-f / 15} face expr="smug" />
            </At>
            <SpinArrow cx={680} cy={1300} r={300} dir={-1} color="#ff7a7a" />
          </>
        ) : (
          <>
            <BG blur={1.5}>
              <VenusSurface />
            </BG>
            <At x={180} y={1150 - rise * 380} from="none" z={50}>
              <Planet kind="sun" r={130} />
            </At>
            <At x={720} y={A.y} from="none">
              <Toon {...ASTRO} expr="surprised" pose="point" flip height={A.h} />
            </At>
          </>
        )}
      </Cam>
      {f >= fAlli && <Tag text="OESTE" x={220} y={300} at={fOeste - 4} color="#ff7a7a" />}
      <Grade tint={f < fAlli ? "rgba(140,120,255,0.15)" : "rgba(255,170,90,0.2)"} />
      <Sfx at={fAlli} src="whoosh" vol={0.35} />
    </>
  );
};

const SCalor: React.FC = () => {
  const id = "calor";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fSup = wf(id, "superficie");
  const fMerc = wf(id, "Mercurio,");
  return (
    <>
      <Cam keys={shots([[0, 1.5, 1.65, 0, headY(A.y, A.h) + 80], [fSup, 1.05, 1.1, 0, 100], [fMerc, 1.0, 1.06, 0, 0]], end)}>
        {f < fMerc ? (
          <>
            <BG blur={1.5}>
              <VenusSurface />
            </BG>
            <At x={360} y={A.y} from="none">
              <Toon {...ASTRO} expr={f > fSup ? "worried" : "happy"} {...sw8(f, fSup, "hold", "up")} height={A.h} />
            </At>
            {f > fSup && <Thermo at={fSup} x={760} y={700} />}
          </>
        ) : (
          <>
            <Stars drift={0.15} />
            <At x={180} y={1250} from="none" z={200}>
              <Planet kind="sun" r={190} />
            </At>
            <At x={500} y={1110} from="pop" at={fMerc} z={300}>
              <Planet kind="mercury" r={70} face expr="smug" />
            </At>
            <At x={820} y={1220} from="pop" at={fMerc + 6} z={300}>
              <Planet kind="venus" r={140} face expr="worried" />
            </At>
          </>
        )}
      </Cam>
      {f >= fMerc && <Tag text="MERCURIO: ~430°C" x={500} y={600} at={fMerc + 4} color="#d8d2cc" size={60} />}
      {f >= fMerc && <Tag text="VENUS: ~460°C" x={760} y={1580} at={fMerc + 12} color="#ff7a3a" size={60} />}
      <Grade tint={f < fMerc ? "rgba(255,150,80,0.22)" : "rgba(140,120,255,0.15)"} />
      <Sfx at={fSup} src="burbujas" vol={0.3} />
    </>
  );
};

const SPresion: React.FC = () => {
  const id = "presion";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fNov = wf(id, "noventa");
  const fMar = wf(id, "mar.");
  const depth = interpolate(f, [fNov, fMar + 10], [0.05, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <Cam keys={shots([[0, 1.0, 1.08, 0, 0]], end)}>
        <Underwater depth={depth} />
        <At x={440} y={1450 + depth * 200} from="none">
          <Float amp={30}>
            <Toon {...ASTRO} expr={f > fNov ? "worried" : "neutral"} pose="up" height={1000} />
          </Float>
        </At>
      </Cam>
      <Tag text="x90" x={440} y={380} at={fNov} size={160} color="#4de1ff" />
      <Grade tint="rgba(60,120,220,0.2)" />
      <Sfx at={fNov} src="burbujas" vol={0.4} />
    </>
  );
};

const SNubes: React.FC = () => {
  const id = "nubes";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fAcido = wf(id, "ácido");
  return (
    <>
      <Cam keys={shots([[0, 1.05, 1.12, 0, -120], [fAcido, 1.4, 1.55, 0, headY(A.y, A.h) + 100]], end)} shakeAt={[fAcido + 2]}>
        <BG blur={1.5}>
          <VenusSurface acid={f > fAcido - 4} />
        </BG>
        <At x={A.x} y={A.y} from="none">
          <Toon {...ASTRO} expr={f > fAcido ? "surprised" : "neutral"} {...sw8(f, fAcido, "idle", "up")} height={A.h} />
        </At>
      </Cam>
      {f > fAcido && <Tag text="H₂SO₄" x={540} y={360} at={fAcido + 2} color="#d8ff4a" size={110} />}
      <Grade tint={f > fAcido ? "rgba(200,255,90,0.22)" : "rgba(255,170,90,0.2)"} />
      <Sfx at={fAcido} src="burbujas" vol={0.45} />
    </>
  );
};

const SOutro: React.FC = () => {
  const id = "outro";
  const f = useCurrentFrame();
  const end = T.frames(id);
  return (
    <>
      <Cam keys={shots([[0, 1.0, 1.08, 0, 0]], end)}>
        <Stars />
        <At x={760} y={900} from="none" z={300}>
          <Planet kind="venus" r={240} spin={f / 30} face expr="smug" />
        </At>
        <At x={330} y={2000} from="none">
          <Float>
            <Toon {...ASTRO} expr="happy" pose="point" talking={f < end - 30} height={1150} />
          </Float>
        </At>
      </Cam>
      <AbsoluteFill style={{ pointerEvents: "none" }} />
      <Grade tint="rgba(140,120,255,0.15)" />
    </>
  );
};

const SCENES: Record<string, React.FC> = { hook: SHook, venus: SVenus, giro: SGiro, reves: SReves, calor: SCalor, presion: SPresion, nubes: SNubes, outro: SOutro };

export const VENUS_FRAMES = T.total;
export const Venus: React.FC = () => <NarratedVideo voz={voz} order={ORDER} tail={TAIL} scenes={SCENES} folder="voz_venus" music="musica_espacio.wav" musicVol={0.2} />;
