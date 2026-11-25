import React from "react";
import { interpolate, spring, useCurrentFrame } from "remotion";
import voz from "./voz_eiffel.json";
import { INK, Toon } from "../Characters";
import type { ToonProps } from "../Characters";
import { At, Bars, Cam, Grade, headY, makeTiming, NarratedVideo, Sfx, shots, sw8 } from "../kit";
import { Sign } from "../Scenery";
import { Alcatraz, CashRain, Eiffel, HookTitle, Letter, Lobby, MoneyBag, Newspaper, Paris, Tag } from "../Scenery3";

const ORDER = ["hook", "periodico", "plan", "oferta", "soborno", "huida", "otra", "final", "outro"];
const TAIL = { outro: 26 };
const T = makeTiming(voz, ORDER, TAIL);
const wf = T.wf;
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const LUSTIG: ToonProps = { hair: "fedora", hairColor: "#34343f", outfit: "#2a2a35", outfit2: "#f4efe6", mustache: "#2a1a12", seed: 6 };
const POISSON: ToonProps = { hair: "bald", mustache: "#6b4a2a", outfit: "#7a5a3a", outfit2: "#e9dfc9", seed: 9 };
const DEALERS: ToonProps[] = [
  { hair: "beret", hairColor: "#2f4f8f", outfit: "#5d7d38", outfit2: "#e9dfc9", seed: 21 },
  { hair: "buzz", hairColor: "#6b3a1e", outfit: "#8a5d33", outfit2: "#e9dfc9", stubble: true, seed: 22 },
  { hair: "curly", hairColor: "#c9c4bc", outfit: "#a3202c", outfit2: "#f4efe6", seed: 23 },
  { hair: "beret", hairColor: "#a3202c", outfit: "#3f4a5a", outfit2: "#f4efe6", beard: "#5b3420", seed: 24 },
];
const L = { x: 540, y: 2060, h: 1400 };

/** Lustig with optional props layered */
const Lustig: React.FC<Partial<ToonProps> & { x?: number; y?: number; h?: number; at?: number; from?: "pop" | "left" | "right" | "drop" | "none" }> = ({ x = L.x, y = L.y, h = L.h, at = 0, from = "none", ...p }) => (
  <At x={x} y={y} at={at} from={from}>
    <Toon {...LUSTIG} expr="smug" talking {...p} height={h} />
  </At>
);

const SHook: React.FC = () => {
  const id = "hook";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fTorre = wf(id, "Torre");
  const fSalio = wf(id, "salió");
  const fIntento = wf(id, "intentó");
  const sold = f > fTorre + 6 ? spring({ frame: f - fTorre - 6, fps: 30, config: { damping: 9 } }) : 0;
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.85, 2.0, 0, headY(L.y, L.h) + 60],
            [fTorre, 1.0, 1.08, 0, -60],
            [fIntento, 1.7, 1.85, 0, headY(L.y, L.h) + 70],
          ],
          end,
        )}
        shakeAt={[fTorre + 6]}
      >
        <Paris />
        <At x={540} y={1320} from="none" z={500}>
          <Eiffel height={1150} sold={sold} />
        </At>
        {(f < fTorre || f >= fIntento) && <Lustig {...(f >= fIntento ? sw8(f, fIntento, "idle", "point") : { pose: "hips" as const })} expr="smug" />}
        {f >= fTorre && f < fIntento && (
          <At x={260} y={1900} from="left" at={fTorre}>
            <Toon {...LUSTIG} pose="up" expr="happy" height={900} />
          </At>
        )}
        {f >= fSalio && f < fIntento && (
          <At x={820} y={1900} from="right" at={fSalio}>
            <MoneyBag size={300} />
          </At>
        )}
      </Cam>
      <Tag text="¡OTRA VEZ!" x={540} y={1180} at={fIntento + 6} color="#ffd23f" size={110} rot={-4} />
      <HookTitle lines={["ESTE HOMBRE VENDIÓ", "LA TORRE EIFFEL"]} hi={1} at={0} until={fIntento - 2} color="#ffd23f" top={150} />
      <Grade tint="rgba(255,220,160,0.15)" />
      <Sfx at={0} src="caja" vol={0.5} />
      <Sfx at={fTorre + 6} src="mazo" vol={0.55} />
      <Sfx at={fSalio} src="caja" vol={0.45} />
      <Sfx at={fIntento + 6} src="pop" vol={0.4} />
    </>
  );
};

const SPeriodico: React.FC = () => {
  const id = "periodico";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fLustig = wf(id, "Lustig");
  const fPer = wf(id, "periódico");
  const fOx = wf(id, "oxidada,");
  const fFort = wf(id, "fortuna.");
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.0, 1.06, 0, -100],
            [fLustig, 1.5, 1.6, 0, headY(L.y, L.h) + 120],
            [fPer, 1.0, 1.05, 0, 0],
          ],
          end,
        )}
      >
        <Paris dusk />
        <At x={540} y={1320} from="none" z={500}>
          <Eiffel height={1000} rust={interpolate(f, [fOx, fOx + 15], [0, 1], clamp)} />
        </At>
        <Sign text="PARÍS" sub="AÑO 1925" y={70} color="#2a1f4a" glow={false} />
        <Lustig at={fLustig - 4} from="pop" pose="hold" expr="neutral" talking={false} />
        <Newspaper at={fPer} title="LE PETIT PARISIEN" head="LA TORRE SE OXIDA" sub="Mantenerla cuesta una fortuna">
          <div style={{ position: "absolute", left: "50%", bottom: -10, transform: "translateX(-50%)", filter: "grayscale(1) contrast(1.3)" }}>
            <Eiffel height={360} rust={f > fOx ? 1 : 0} />
          </div>
        </Newspaper>
        <Tag text="₣ ₣ ₣ ₣" x={540} y={1500} at={fFort} color="#9ed77a" size={110} rot={5} />
      </Cam>
      <Grade tint="rgba(255,190,140,0.18)" />
      <Sfx at={fPer} src="whoosh" vol={0.45} />
      <Sfx at={fFort} src="caja" vol={0.45} />
    </>
  );
};

const SPlan: React.FC = () => {
  const id = "plan";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fFunc = wf(id, "funcionario");
  const fReune = wf(id, "reúne");
  const fCinco = wf(id, "cinco");
  const fHotel = wf(id, "hotel");
  const inLobby = f >= fReune;
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.6, 1.7, 0, headY(L.y, L.h) + 140],
            [fFunc, 1.0, 1.06, 0, 80],
            [fReune, 1.0, 1.06, 0, 200],
            [fHotel, 1.15, 1.2, 0, 120],
          ],
          end,
        )}
      >
        {inLobby ? <Lobby /> : <Paris />}
        {!inLobby && <Lustig pose="hold" prop="scroll" expr="smug" talking />}
        {!inLobby && <Letter at={fFunc} x={540} y={560} />}
        {inLobby && (
          <>
            <At x={540} y={1650} from="none" z={1650}>
              <Toon {...LUSTIG} pose="hips" expr="smug" talking height={950} />
            </At>
            {DEALERS.concat([POISSON]).map((d, i) => {
              const xs = [150, 930, 280, 800, 540];
              const ys = [1800, 1800, 1950, 1950, 2080];
              return (
                <At key={i} x={xs[i]} y={ys[i]} at={fCinco - 6 + i * 4} z={ys[i]}>
                  <Toon {...d} expr="surprised" pose="idle" height={760} flip={xs[i] > 540} />
                </At>
              );
            })}
          </>
        )}
        {inLobby && <Tag text="HÔTEL DE CRILLON" x={540} y={470} at={fHotel} color="#e6bd55" size={70} />}
      </Cam>
      {!inLobby && <Tag text="FUNCIONARIO (FALSO)" x={540} y={1300} at={fFunc + 8} color="#ff5a5a" size={80} rot={-4} />}
      <Grade tint="rgba(255,220,160,0.15)" />
      <Sfx at={fFunc} src="whoosh" vol={0.4} />
      <Sfx at={fCinco - 6} src="pop" vol={0.35} />
    </>
  );
};

const SOferta: React.FC = () => {
  const id = "oferta";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fDesm = wf(id, "desmontar");
  const fChat = wf(id, "chatarra");
  const fPostor = wf(id, "postor.");
  const apart = interpolate(f, [fDesm, fDesm + 20], [0, 1], clamp);
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.5, 1.6, -160, headY(1950, 1200) + 120],
            [fDesm, 1.05, 1.1, 0, -40],
            [fPostor, 1.2, 1.3, 0, 500],
          ],
          end,
        )}
      >
        <Lobby />
        {/* tower on an easel, falling apart into pieces */}
        <div style={{ position: "absolute", left: 640, top: 420, zIndex: 900 }}>
          <div style={{ width: 360, height: 640, background: "#f4efe0", border: `10px solid ${INK}`, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 30, bottom: 0, transform: `translateY(${apart * 120}px) rotate(${apart * 12}deg)`, transformOrigin: "50% 100%" }}>
              <Eiffel height={600} rust={1} />
            </div>
          </div>
        </div>
        <At x={340} y={1950} from="none" z={1950}>
          <Toon {...LUSTIG} expr="smug" talking pose={f > fDesm ? "point" : "hold"} height={1200} />
        </At>
        {f > fPostor - 10 &&
          DEALERS.map((d, i) => (
            <At key={i} x={150 + i * 260} y={2150} from="drop" at={fPostor - 10 + i * 3} z={2150}>
              <Toon {...d} expr="happy" pose="up" height={700} />
            </At>
          ))}
      </Cam>
      <Tag text="7.300 TONELADAS DE HIERRO" x={540} y={1180} at={fChat} color="#c0461a" size={66} rot={-3} />
      <Grade tint="rgba(255,220,160,0.15)" />
      <Sfx at={fDesm} src="tambor" vol={0.4} />
      <Sfx at={fChat} src="caja" vol={0.45} />
      <Sfx at={fPostor} src="gasp" vol={0.3} />
    </>
  );
};

const Thought: React.FC<{ at: number; text: string; x: number; y: number }> = ({ at, text, x, y }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = spring({ frame: f - at, fps: 30, config: { damping: 11 } });
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, zIndex: 7000 }}>
      <div style={{ background: "white", border: `9px solid ${INK}`, borderRadius: 120, padding: "34px 50px", fontFamily: "Montserrat", fontWeight: 800, fontSize: 58, color: INK, textAlign: "center", lineHeight: 1.1, boxShadow: "0 12px 0 rgba(0,0,0,0.3)", width: 760 }}>{text}</div>
      {[0, 1].map((i) => (
        <div key={i} style={{ position: "absolute", left: 220 - i * 50, top: 230 + i * 70, width: 60 - i * 20, height: 60 - i * 20, borderRadius: 40, background: "white", border: `7px solid ${INK}` }} />
      ))}
    </div>
  );
};

const SSoborno: React.FC = () => {
  const id = "soborno";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fAndre = wf(id, "André");
  const fSob = wf(id, "soborno.");
  const fPenso = wf(id, "pensó:");
  const fVerdad = wf(id, "verdad.");
  const P = { x: 540, y: 2060, h: 1400 };
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.0, 1.06, 0, 200],
            [fAndre, 1.7, 1.85, 0, headY(P.y, P.h) + 80],
            [fSob - 6, 1.05, 1.1, 0, 300],
            [fPenso, 1.45, 1.55, 0, headY(P.y, P.h) + 20],
          ],
          end,
        )}
      >
        <Lobby />
        {f < fAndre &&
          DEALERS.concat([POISSON]).map((d, i) => (
            <At key={i} x={[150, 930, 280, 800, 540][i]} y={[1800, 1800, 1950, 1950, 2080][i]} from="none">
              <Toon {...d} expr={i === 4 ? "worried" : "neutral"} height={760} flip={i % 2 === 1} />
            </At>
          ))}
        {f >= fAndre && f < fSob - 6 && (
          <At x={P.x} y={P.y} from="none">
            <Toon {...POISSON} expr="worried" pose="hold" height={P.h} />
          </At>
        )}
        {f >= fSob - 6 && f < fPenso && (
          <>
            <At x={280} y={1950} from="none">
              <Toon {...LUSTIG} expr="smug" talking pose="point" height={1150} />
            </At>
            <At x={820} y={1950} from="none">
              <Toon {...POISSON} expr="surprised" pose="hold" height={1150} flip />
            </At>
            <At x={560} y={interpolate(f, [fSob, fSob + 20], [1500, 1200], clamp)} at={fSob} z={3000}>
              <MoneyBag size={240} />
            </At>
          </>
        )}
        {f >= fPenso && (
          <At x={P.x} y={P.y} from="none">
            <Toon {...POISSON} expr={f > fVerdad - 6 ? "happy" : "neutral"} pose={f > fVerdad - 6 ? "up" : "hold"} height={P.h} />
          </At>
        )}
      </Cam>
      {f >= fAndre && f < fSob - 6 && <Tag text="ANDRÉ POISSON · LA VÍCTIMA" x={540} y={500} at={fAndre} color="#ffcf4a" size={64} />}
      <Thought at={fPenso + 2} text="«Si es corrupto… ¡tiene que ser real!»" x={540} y={470} />
      <Grade tint="rgba(255,220,160,0.15)" />
      <Sfx at={fAndre} src="pop" vol={0.35} />
      <Sfx at={fSob} src="caja" vol={0.45} />
      <Sfx at={fPenso + 2} src="ding" vol={0.3} />
    </>
  );
};

const SHuida: React.FC = () => {
  const id = "huida";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fHuyo = wf(id, "huyó");
  const fPoisson = wf(id, "Poisson,");
  const fNunca = wf(id, "nunca");
  const run = interpolate(f, [fHuyo, fPoisson], [-150, 1250], clamp);
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.1, 1.15, 0, 260],
            [fPoisson, 1.7, 1.85, 0, headY(L.y, L.h) + 80],
          ],
          end,
        )}
      >
        <Paris />
        <At x={540} y={1320} from="none" z={500}>
          <Eiffel height={1000} />
        </At>
        {f < fPoisson && (
          <At x={run} y={1850} from="none">
            <div style={{ position: "relative" }}>
              <Toon {...LUSTIG} expr="happy" walking pose="hold" height={900} />
              <div style={{ position: "absolute", left: 260, top: 330 }}>
                <MoneyBag size={220} />
              </div>
            </div>
          </At>
        )}
        {f < fPoisson && <CashRain at={fHuyo + 4} n={18} />}
        {f >= fPoisson && (
          <At x={L.x} y={L.y} from="none">
            <Toon {...POISSON} expr="worried" pose="shrug" height={L.h} />
          </At>
        )}
      </Cam>
      {f >= fPoisson && (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, zIndex: 9000, pointerEvents: "none" }}>
          {[-1, 1].map((s) => (
            <ellipse key={s} cx={540 + s * 190} cy={1030} rx="70" ry="34" fill="#ff6b81" opacity={interpolate(f, [fPoisson, fPoisson + 10], [0, 0.6], clamp)} />
          ))}
        </svg>
      )}
      <Tag text="¿DENUNCIAR? MEJOR NO…" x={540} y={470} at={fNunca} color="#ffffff" size={70} />
      <Grade tint="rgba(255,220,160,0.15)" />
      <Sfx at={fHuyo} src="whoosh" vol={0.45} />
      <Sfx at={fHuyo + 4} src="caja" vol={0.4} />
      <Sfx at={fPoisson} src="gasp" vol={0.3} />
    </>
  );
};

const SOtra: React.FC = () => {
  const id = "otra";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fVolvio = wf(id, "volvió");
  const fVez = wf(id, "vez.");
  const fPol = wf(id, "policía…");
  const fEsc = wf(id, "escapó.");
  const P = { x: 790, y: 1950, h: 1150 };
  const flee = interpolate(f, [fEsc + 4, fEsc + 18], [0, -1200], clamp);
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.0, 1.06, 0, 0],
            [fVez - 4, 1.6, 1.75, 0, headY(L.y, L.h) + 80],
            [fPol, 1.05, 1.1, 0, 300],
          ],
          end,
        )}
        shakeAt={[fPol]}
      >
        <Paris night={f >= fPol} />
        <At x={540} y={1320} from="none" z={500}>
          <Eiffel height={1000} sold={f >= fVolvio && f < fPol ? spring({ frame: f - fVolvio, fps: 30, config: { damping: 9 } }) : 0} />
        </At>
        {f < fPol ? (
          <Lustig at={fVolvio - 4} from="left" pose={f > fVez - 4 ? "up" : "hips"} expr="smug" />
        ) : (
          <>
            <At x={280 + flee} y={1950} from="none">
              <Toon {...LUSTIG} expr={f > fEsc ? "happy" : "surprised"} walking={f > fEsc} pose={f > fEsc ? "salute" : "shrug"} talking={false} height={1150} />
            </At>
            <At x={P.x} y={P.y} at={fPol} from="right">
              <Toon hair="kepi" hairColor="#1f2a5a" outfit="#1f2a5a" outfit2="#e6bd55" mustache="#3a2a22" expr="angry" pose="point" talking height={P.h} flip seed={33} />
            </At>
          </>
        )}
      </Cam>
      {f >= fPol && (
        <div style={{ position: "absolute", inset: 0, zIndex: 9500, pointerEvents: "none", background: Math.floor(f / 5) % 2 ? "rgba(255,40,40,0.18)" : "rgba(40,90,255,0.18)" }} />
      )}
      <Tag text="¡ESCAPÓ!" x={540} y={600} at={fEsc + 6} color="#ffd23f" size={110} rot={-6} />
      <Grade tint="rgba(255,220,160,0.12)" />
      <Sfx at={fVolvio} src="whoosh" vol={0.4} />
      <Sfx at={fPol} src="sirena" vol={0.4} />
      <Sfx at={fEsc + 4} src="whoosh" vol={0.5} />
    </>
  );
};

const SFinal: React.FC = () => {
  const id = "final";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fCap = wf(id, "Capone.");
  const fAlc = wf(id, "Alcatraz.");
  const inAlc = f >= fAlc - 6;
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.1, 1.15, 0, 260],
            [fCap - 4, 1.6, 1.7, 220, headY(1950, 1200) + 80],
            [fAlc - 6, 1.0, 1.06, 0, 0],
          ],
          end,
        )}
        shakeAt={[fAlc + 10]}
      >
        {inAlc ? <Alcatraz /> : <Paris night />}
        {!inAlc && (
          <>
            <At x={280} y={1950} from="none">
              <Toon {...LUSTIG} expr="smug" talking pose="hold" height={1100} />
            </At>
            <At x={780} y={1950} at={fCap - 6} from="right">
              <Toon hair="fedora" hairColor="#e9e2cf" outfit="#4a4a55" outfit2="#f4efe6" stubble expr={f > fCap + 10 ? "angry" : "neutral"} pose="hips" height={1200} flip seed={12} />
            </At>
          </>
        )}
        {inAlc && (
          <At x={540} y={1950} from="none">
            <Toon {...LUSTIG} expr="worried" pose="idle" talking={false} height={1150} />
          </At>
        )}
        {inAlc && <Bars at={fAlc + 4} />}
      </Cam>
      {!inAlc && <Tag text="AL CAPONE" x={780} y={600} at={fCap} color="#e6bd55" size={86} rot={4} />}
      {inAlc && <Tag text="ALCATRAZ" x={540} y={330} at={fAlc} color="#c9d2da" size={96} />}
      <Grade tint="rgba(120,140,200,0.2)" vig={0.72} />
      <Sfx at={fCap} src="pop" vol={0.35} />
      <Sfx at={fAlc + 10} src="mazo" vol={0.55} />
    </>
  );
};

const SOutro: React.FC = () => {
  const id = "outro";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fCom = wf(id, "comentarios.");
  return (
    <>
      <Cam keys={shots([[0, 1.45, 1.55, 0, headY(L.y, L.h) + 140], [fCom, 1.0, 1.05, 0, 0]], end)}>
        <Paris dusk />
        <At x={540} y={1320} from="none" z={500}>
          <Eiffel height={1000} sold={1} />
        </At>
        <Lustig {...sw8(f, 8, "hips", "point")} expr="smug" />
      </Cam>
      <Tag text="¿HABRÍAS CAÍDO?" x={540} y={420} at={4} color="#ffd23f" size={90} />
      <Grade tint="rgba(255,190,140,0.18)" />
      <Sfx at={4} src="pop" vol={0.35} />
    </>
  );
};

const SCENES: Record<string, React.FC> = { hook: SHook, periodico: SPeriodico, plan: SPlan, oferta: SOferta, soborno: SSoborno, huida: SHuida, otra: SOtra, final: SFinal, outro: SOutro };

export const EIFFEL_FRAMES = T.total;
export const EiffelVideo: React.FC = () => <NarratedVideo voz={voz} order={ORDER} tail={TAIL} scenes={SCENES} folder="voz_eiffel" music="musica_estafa.wav" musicVol={0.13} progress="#ffd23f" />;
