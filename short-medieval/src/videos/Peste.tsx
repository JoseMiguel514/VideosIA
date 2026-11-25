import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import voz from "./voz_peste.json";
import { INK, Rat, Toon } from "../Characters";
import type { ToonProps } from "../Characters";
import { At, BG, Cam, Grade, headY, makeTiming, NarratedVideo, Sfx, shots, sw8 } from "../kit";
import { Banner, GothicWindow, Room, Sign, Village, WallTorch } from "../Scenery";

const ORDER = ["hook", "peste", "medicos", "lorme", "pico", "grabado", "verdad", "outro"];
const TAIL = { outro: 26 };
const T = makeTiming(voz, ORDER, TAIL);
const wf = T.wf;

const DOC: ToonProps = { hair: "plague", outfit: "#1f1b22", outfit2: "#2e2830", robe: true, seed: 4 };
const D = { x: 540, y: 2060, h: 1420 };

/** drifting fog */
const Fog: React.FC<{ color?: string; o?: number }> = ({ color = "#c9d2c0", o = 0.35 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ zIndex: 7000, pointerEvents: "none" }}>
      <svg width={1080} height={1920}>
        {Array.from({ length: 8 }).map((_, i) => {
          const x = ((i * 300 + f * (0.8 + (i % 3) * 0.5)) % 1700) - 300;
          return <ellipse key={i} cx={x} cy={1350 + (i % 4) * 150} rx={340} ry={90} fill={color} opacity={o * (0.5 + 0.5 * Math.sin(f / 30 + i))} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

const RedCrosses: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const doors = [-60 + 330 * 0.18, 250 + 280 * 0.18, 520 + 300 * 0.18, 800 + 340 * 0.18];
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, zIndex: 1200 }}>
      {doors.map((x, i) => {
        const p = interpolate(f, [at + i * 5, at + i * 5 + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <g key={i} opacity={p}>
            <path d={`M${x - 35} ${1050} L${x + 35} ${1120} M${x + 35} ${1050} L${x - 35} ${1120}`} stroke="#b3121f" strokeWidth={14 * p} strokeLinecap="round" />
          </g>
        );
      })}
    </svg>
  );
};

const SHook: React.FC = () => {
  const id = "hook";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fProb = wf(id, "problema:");
  const fMed = wf(id, "medieval.");
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.9, 2.1, 0, headY(D.y, D.h) + 60],
            [fProb, 1.15, 1.25, 0, 200],
            [fMed, 1.6, 1.75, 0, headY(D.y, D.h) + 80],
          ],
          end,
        )}
        shakeAt={[fMed + 2]}
      >
        <BG blur={2.5}>
          <Village night />
        </BG>
        <At x={D.x} y={D.y} from="none">
          <Toon {...DOC} {...sw8(f, fMed, "idle", "shrug")} height={D.h} />
        </At>
        <Fog />
      </Cam>
      <Grade tint="rgba(90,110,200,0.4)" vig={0.75} />
      <Sfx at={fMed} src="mazo" vol={0.5} />
    </>
  );
};

const SPeste: React.FC = () => {
  const id = "peste";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fPeste = wf(id, "peste");
  const fMato = wf(id, "mató");
  const fTercio = wf(id, "tercio");
  const rats = [
    [200, 1700],
    [420, 1820],
    [700, 1760],
    [900, 1860],
  ];
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.0, 1.1, 0, 60],
            [fPeste, 1.5, 1.65, 0, 560],
            [fMato, 1.05, 1.12, 0, 160],
          ],
          end,
        )}
      >
        <BG blur={2}>
          <Village evening />
        </BG>
        <Sign text="EUROPA" sub="AÑO 1347" y={70} color="#5b3420" glow={false} />
        <RedCrosses at={fMato} />
        {f < fMato &&
          rats.map(([x, y], i) => (
            <At key={i} x={x} y={y} at={fPeste - 10 + i * 4}>
              <Rat height={240} run seed={i} expr="smug" flip={i % 2 === 0} />
            </At>
          ))}
        {f >= fMato &&
          [270, 540, 810].map((x, i) => {
            const gone = i === 2 && f > fTercio ? interpolate(f, [fTercio, fTercio + 15], [1, 0.15], { extrapolateRight: "clamp" }) : 1;
            return (
              <At key={i} x={x} y={1960} from="none">
                <div style={{ opacity: gone, filter: gone < 1 ? "grayscale(1)" : undefined }}>
                  <Toon hair={(["hood", "kerchief", "bowl"] as const)[i]} hairColor={["#7d6248", "#b8323a", "#4a2c18"][i]} outfit={["#8a5d33", "#d98a2b", "#5d7d38"][i]} outfit2="#e9dfc9" expr="worried" height={1000} seed={40 + i} />
                </div>
              </At>
            );
          })}
      </Cam>
      <Grade tint="rgba(200,150,120,0.3)" vig={0.72} />
      <Sfx at={fPeste - 6} src="chillido" vol={0.35} />
      <Sfx at={fMato} src="gasp" vol={0.35} />
    </>
  );
};

const Bed: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <svg width={620} height={360} viewBox="0 0 620 360" style={{ position: "absolute", left: x - 310, top: y - 360, zIndex: y }}>
    <rect x="10" y="150" width="600" height="160" rx="16" fill="#7a4b26" stroke={INK} strokeWidth="9" />
    <rect x="20" y="120" width="580" height="80" rx="30" fill="#e9dfc9" stroke={INK} strokeWidth="8" />
    <ellipse cx="110" cy="115" rx="80" ry="40" fill="#f4efe6" stroke={INK} strokeWidth="7" />
    <circle cx="110" cy="80" r="62" fill="#f4f6f8" stroke={INK} strokeWidth="9" />
    <path d="M85 75 q8 6 16 0 M120 75 q8 6 16 0" stroke={INK} strokeWidth="6" fill="none" />
    <path d="M95 105 q15 -8 30 0" stroke={INK} strokeWidth="6" fill="none" />
    <rect x="160" y="110" width="430" height="90" rx="30" fill="#8a9fb5" stroke={INK} strokeWidth="8" />
    <rect x="10" y="300" width="30" height="60" fill="#5b3420" />
    <rect x="580" y="300" width="30" height="60" fill="#5b3420" />
  </svg>
);

const SMedicos: React.FC = () => {
  const id = "medicos";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fRopa = wf(id, "ropa");
  const fSin = wf(id, "Sin");
  const M = { x: 760, y: 2040, h: 1350 };
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.05, 1.12, 0, 200],
            [fRopa, 1.6, 1.75, M.x - 540, headY(M.y, M.h) + 60],
            [fSin, 1.3, 1.4, 120, 260],
          ],
          end,
        )}
      >
        <BG>
          <Room wall="#a4abbd" side="#6a7186" floorA="#b7aa92" floorB="#8a7c66" stone>
            <WallTorch x={540} y={700} />
          </Room>
        </BG>
        <Bed x={330} y={1760} />
        <At x={M.x} y={M.y} from="right" at={2}>
          <Toon hair="bald" beard="#8f8a86" outfit="#5b3a6a" outfit2="#e9dfc9" robe expr={f > fSin ? "smug" : "neutral"} prop="scroll" {...sw8(f, fSin, "hold", "shrug")} talking={f > fRopa && f < fSin} height={M.h} flip seed={8} />
        </At>
      </Cam>
      <Grade tint="rgba(220,170,120,0.25)" vig={0.7} />
    </>
  );
};

const SLorme: React.FC = () => {
  const id = "lorme";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fTraje = wf(id, "traje");
  const fSiglo = wf(id, "siglo");
  const fCharles = wf(id, "Charles");
  const L = { x: 540, y: 2050, h: 1400 };
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.4, 1.55, 0, headY(D.y, D.h) + 140],
            [fSiglo, 1.0, 1.08, 0, 80],
            [fCharles, 1.55, 1.7, 0, headY(L.y, L.h) + 60],
          ],
          end,
        )}
      >
        <BG>
          <Room wall="#3d4f8f" side="#28366a" floorA="#e9dcc0" floorB="#8a6a3a" trim="#2a1f4a">
            <GothicWindow x={440} y={330} w={200} h={360} glass={["#f3d27a", "#ffffff", "#f3d27a", "#ffffff"]} />
            <Banner x={235} y={330} color="#2f4f8f" />
            <Banner x={715} y={330} color="#2f4f8f" />
          </Room>
        </BG>
        <Sign text="FRANCIA" sub="SIGLO XVII" y={70} color="#2a1f4a" glow={false} />
        {f < fCharles ? (
          <At x={D.x} y={D.y} at={fTraje - 4}>
            <Toon {...DOC} pose="hips" height={D.h} />
          </At>
        ) : (
          <At x={L.x} y={L.y} from="none">
            <Toon hair="curly" hairColor="#e8e4dc" outfit="#2f4f8f" outfit2="#f4efe6" expr="smug" pose="point" talking height={L.h} seed={14} />
          </At>
        )}
      </Cam>
      <Grade tint="rgba(200,200,255,0.18)" />
      <Sfx at={fTraje - 4} src="whoosh" vol={0.35} />
      <Sfx at={fCharles} src="pop" vol={0.35} />
    </>
  );
};

const SPico: React.FC = () => {
  const id = "pico";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fRell = wf(id, "rellenaban");
  const fAire = wf(id, "aire");
  const tipX = 540 + (355 - 200) * (D.h / 820);
  const tipY = D.y - (805 - 205 - 255) * (D.h / 820);
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.7, 1.85, 60, headY(D.y, D.h) + 120],
            [fRell, 1.4, 1.5, 120, headY(D.y, D.h) + 180],
            [fAire, 1.05, 1.12, 0, 120],
          ],
          end,
        )}
      >
        <BG>
          <Room wall="#a4abbd" side="#6a7186" floorA="#b7aa92" floorB="#8a7c66" stone>
            <WallTorch x={300} y={700} />
          </Room>
        </BG>
        <At x={D.x} y={D.y} from="none">
          <Toon {...DOC} pose="idle" height={D.h} />
        </At>
        {/* herbs flying into the beak */}
        {f > fRell && (
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, zIndex: 4000 }}>
            {Array.from({ length: 10 }).map((_, i) => {
              const t = ((f - fRell + i * 5) % 40) / 40;
              const sx = 1150;
              const sy = 900 + i * 60;
              const x = sx + (tipX - sx) * t;
              const y = sy + (tipY - sy) * t - Math.sin(t * Math.PI) * 120;
              const c = ["#5fbf4a", "#a5d65a", "#e86aa8", "#f3d27a"][i % 4];
              return <ellipse key={i} cx={x} cy={y} rx={22 * (1 - t * 0.6)} ry={11 * (1 - t * 0.6)} fill={c} stroke={INK} strokeWidth="4" transform={`rotate(${f * 8 + i * 40} ${x} ${y})`} />;
            })}
          </svg>
        )}
        {f > fAire && <Fog color="#7fbf5a" o={0.55} />}
      </Cam>
      <Grade tint={f > fAire ? "rgba(150,220,120,0.3)" : "rgba(220,170,120,0.2)"} />
      <Sfx at={fRell} src="pop" vol={0.35} />
      <Sfx at={fAire} src="whoosh" vol={0.35} />
    </>
  );
};

const SGrabado: React.FC = () => {
  const id = "grabado";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fGrab = wf(id, "grabado");
  const fDoc = wf(id, "Doctor");
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.0, 1.08, 0, 0],
            [fDoc, 1.35, 1.5, 0, -140],
          ],
          end,
        )}
      >
        <AbsoluteFill style={{ background: "#3a2a1f" }} />
        {/* parchment engraving */}
        <div style={{ position: "absolute", left: 90, top: 170, width: 900, height: 1500, background: "radial-gradient(ellipse at 50% 40%, #f3e4c0 0%, #e0c792 70%, #c7a466 100%)", border: `14px solid #5b3420`, boxShadow: "0 20px 0 rgba(0,0,0,0.4)", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 40, left: 0, right: 0, textAlign: "center", fontFamily: "serif", fontStyle: "italic", fontWeight: 700, fontSize: 64, color: "#3a2210" }}>Der Doctor Schnabel von Rom</div>
          <div style={{ position: "absolute", left: "50%", top: 200, transform: "translateX(-50%)", filter: "grayscale(1) sepia(0.9) contrast(1.6) brightness(1.05)", mixBlendMode: "multiply" }}>
            <Toon {...DOC} pose={f > fGrab ? "hold" : "idle"} prop="scroll" height={1150} />
          </div>
          <svg width={900} height={1500} style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", opacity: 0.35 }}>
            {Array.from({ length: 70 }).map((_, i) => (
              <line key={i} x1={-200 + i * 22} y1={1500} x2={300 + i * 22} y2={0} stroke="#5b3420" strokeWidth="2" />
            ))}
          </svg>
          <div style={{ position: "absolute", bottom: 40, left: 0, right: 0, textAlign: "center", fontFamily: "serif", fontWeight: 700, fontSize: 90, color: "#3a2210" }}>1656</div>
        </div>
        {/* dust specks */}
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 30 }).map((_, i) => (
            <circle key={i} cx={random(`dx${i}`) * 1080 + Math.sin(f / 20 + i) * 20} cy={(random(`dy${i}`) * 1920 - f * 0.6 + 1920) % 1920} r={2 + (i % 3)} fill="#f3e4c0" opacity="0.5" />
          ))}
        </svg>
      </Cam>
      <Grade tint="rgba(255,210,150,0.2)" vig={0.7} />
      <Sfx at={fGrab} src="whoosh" vol={0.3} />
    </>
  );
};

const SVerdad: React.FC = () => {
  const id = "verdad";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fPulgas = wf(id, "pulgas");
  const fPerf = wf(id, "perfume...");
  const R = { x: 540, y: 1800 };
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.1, 1.2, 0, 300],
            [fPulgas, 1.9, 2.1, 0, 560],
            [fPerf, 1.5, 1.65, 0, headY(D.y, D.h) + 140],
          ],
          end,
        )}
      >
        <BG>
          <Room wall="#a4abbd" side="#6a7186" floorA="#b7aa92" floorB="#8a7c66" stone />
        </BG>
        {f < fPerf ? (
          <>
            <At x={R.x} y={R.y} from="pop" at={2}>
              <Rat height={520} expr="smug" nibble seed={3} />
            </At>
            <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, zIndex: 3000 }}>
              {Array.from({ length: 9 }).map((_, i) => {
                const ph = ((f + i * 7) % 20) / 20;
                const x = 400 + random(`fx${i}`) * 300 + ph * 30 * (i % 2 ? 1 : -1);
                const y = 1450 + random(`fy${i}`) * 220 - Math.sin(ph * Math.PI) * 90;
                return <ellipse key={i} cx={x} cy={y} rx="9" ry="7" fill={INK} />;
              })}
            </svg>
          </>
        ) : (
          <At x={D.x} y={D.y} from="none">
            <Toon {...DOC} pose="shrug" height={D.h} />
          </At>
        )}
      </Cam>
      <Grade tint="rgba(220,170,120,0.22)" />
      <Sfx at={fPulgas} src="chillido" vol={0.3} />
    </>
  );
};

const SOutro: React.FC = () => {
  const id = "outro";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fMed = wf(id, "medieval?");
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.5, 1.65, 0, headY(D.y, D.h) + 120],
            [fMed + 10, 1.05, 1.1, 0, 120],
          ],
          end,
        )}
      >
        <BG blur={2.5}>
          <Village night />
        </BG>
        <At x={D.x} y={D.y} from="none">
          <Toon {...DOC} {...sw8(f, fMed, "idle", "point")} height={D.h} />
        </At>
        <Fog />
      </Cam>
      <Grade tint="rgba(90,110,200,0.4)" vig={0.75} />
    </>
  );
};

const SCENES: Record<string, React.FC> = { hook: SHook, peste: SPeste, medicos: SMedicos, lorme: SLorme, pico: SPico, grabado: SGrabado, verdad: SVerdad, outro: SOutro };

export const PESTE_FRAMES = T.total;
export const Peste: React.FC = () => <NarratedVideo voz={voz} order={ORDER} tail={TAIL} scenes={SCENES} folder="voz_peste" music="musica.wav" musicVol={0.16} />;
