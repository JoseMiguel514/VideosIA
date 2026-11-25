import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from "remotion";
import voz from "./voz_gta-perfiles.json";
import { INK, Toon } from "../Characters";
import type { ToonProps } from "../Characters";
import { At, BG, Bars, Cam, Grade, headY, makeTiming, NarratedVideo, Sfx, shots, sw8 } from "../kit";
import { Room } from "../Scenery";
import { CorkBoard, Keys, MugshotWall, Placard, Polaroid, ViceCity } from "../Scenery2";
import { Clip } from "./Clip";

const ORDER = ["hook", "lucia1", "lucia2", "lucia3", "jason1", "jason2", "jason3", "juntos", "outro"];
const TAIL = { outro: 26 };
const T = makeTiming(voz, ORDER, TAIL);
const wf = T.wf;

const LUCIA: ToonProps = { hair: "ponytail", hairColor: "#2a1a14", outfit: "#25222b", outfit2: "#3a3640", lashes: true, seed: 3 };
const LUCIA_PRESA: ToonProps = { ...LUCIA, outfit: "#ef7d22", outfit2: "#f6a35a" };
const JASON: ToonProps = { hair: "buzz", hairColor: "#5a3a24", stubble: true, outfit: "#3b5b85", outfit2: "#f2f2ee", seed: 6 };

/** flash of a police camera */
const Flash: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at, at + 2, at + 10], [0, 0.9, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ background: "white", opacity: o, zIndex: 9800 }} />;
};
/** red/blue police lights */
const Siren: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame();
  if (f < from) return null;
  const red = Math.floor(f / 5) % 2 === 0;
  return (
    <AbsoluteFill
      style={{
        zIndex: 9700,
        mixBlendMode: "screen",
        background: red ? "radial-gradient(ellipse at 0% 30%, rgba(255,30,60,0.55), rgba(0,0,0,0) 60%)" : "radial-gradient(ellipse at 100% 30%, rgba(40,90,255,0.6), rgba(0,0,0,0) 60%)",
      }}
    />
  );
};
/** GTA-style wanted stars (generic five-point stars) */
const Wanted: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  return (
    <div style={{ position: "absolute", top: 160, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 18, zIndex: 9600 }}>
      {[0, 1, 2, 3, 4].map((i) => {
        const s = spring({ frame: f - at - i * 4, fps: 30, config: { damping: 9 } });
        const blink = Math.floor((f - at) / 8) % 2 === 0 || f - at < 30;
        return (
          <svg key={i} width={120} height={120} viewBox="-60 -60 120 120" style={{ transform: `scale(${s})`, opacity: blink ? 1 : 0.4 }}>
            <polygon points="0,-52 14,-16 52,-16 21,8 32,46 0,23 -32,46 -21,8 -52,-16 -14,-16" fill="#f7f7f7" stroke={INK} strokeWidth="8" strokeLinejoin="round" />
          </svg>
        );
      })}
    </div>
  );
};
/** Mini character inside a polaroid */
const Mini: React.FC<{ p: ToonProps; expr?: ToonProps["expr"] }> = ({ p, expr = "smug" }) => (
  <div style={{ position: "absolute", left: "50%", top: 18, transform: "translateX(-50%)" }}>
    <Toon {...p} expr={expr} height={620} />
  </div>
);

const PL = { x: 270, y: 1990, h: 1180 };
const JA = { x: 820, y: 2010, h: 1220 };

const SHook: React.FC = () => {
  const id = "hook";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fPero = wf(id, "Pero");
  const fLu = wf(id, "Lucía");
  const fJa = wf(id, "Jason");
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.0, 1.1, 0, 120],
            [fLu, 1.65, 1.8, PL.x - 540, headY(PL.y, PL.h) + 40],
            [fJa, 1.65, 1.8, JA.x - 540, headY(JA.y, JA.h) + 40],
          ],
          end,
        )}
      >
        <BG blur={2}>
          <ViceCity />
        </BG>
        <At x={PL.x} y={PL.y} from="left" at={2}>
          <Toon {...LUCIA} expr={f > fLu ? "smug" : "neutral"} pose="hips" height={PL.h} talking={false} />
        </At>
        <At x={JA.x} y={JA.y} from="right" at={6}>
          <Toon {...JASON} expr={f > fJa ? "smug" : "neutral"} pose="idle" height={JA.h} flip />
        </At>
      </Cam>
      <Grade tint="rgba(255,170,200,0.18)" />
      <Clip name="hook" from={0} to={fPero} />
      <Sfx at={fPero} src="whoosh" vol={0.3} />
    </>
  );
};

const SLucia1: React.FC = () => {
  const id = "lucia1";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fPadre = wf(id, "padre");
  const DAD = { x: 270, y: 2000, h: 1320 };
  const KID = { x: 800, y: 1960, h: 900 };
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.25, 1.4, 0, -60],
            [fPadre, 1.2, 1.32, 0, 300],
          ],
          end,
        )}
      >
        {f < fPadre ? (
          <>
            <CorkBoard />
            <Polaroid x={540} y={520} w={520} rot={-3} label="LUCÍA CAMINOS" bg="#f0a6b8">
              <Mini p={LUCIA} />
            </Polaroid>
            <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center", fontFamily: "Oswald", fontWeight: 700, fontSize: 96, color: "#f7f4ec", textShadow: "0 8px 0 rgba(0,0,0,0.5)" }}>FICHA #1</div>
          </>
        ) : (
          <>
            <BG>
              <Room wall="#d9b48a" side="#a9835c" floorA="#8a6a4a" floorB="#6e5238" trim="#5b4032" />
            </BG>
            <At x={DAD.x} y={DAD.y} from="none">
              <Toon hair="bowl" hairColor="#2a1a14" beard="#2a1a14" outfit="#7a2f3a" outfit2="#f2e6d6" expr="happy" pose="point" talking height={DAD.h} seed={12} />
            </At>
            <At x={KID.x} y={KID.y} from="none">
              <Toon {...LUCIA} outfit="#e85a7a" outfit2="#ffd0dc" expr="angry" pose="fight" height={KID.h} />
            </At>
          </>
        )}
      </Cam>
      <Grade tint={f < fPadre ? "rgba(255,220,180,0.15)" : "rgba(255,200,140,0.35)"} vig={0.7} />
      <Sfx at={4} src="pop" vol={0.4} />
      <Sfx at={fPadre + 8} src="mazo" vol={0.3} />
    </>
  );
};

const SLucia2: React.FC = () => {
  const id = "lucia2";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fFam = wf(id, "familia,");
  const fPen = wf(id, "Penitenciaría");
  const L = { x: 540, y: 2050, h: 1350 };
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.5, 1.7, 0, headY(L.y, L.h) + 120],
            [fFam, 1.15, 1.25, 0, 200],
            [fPen, 1.45, 1.6, 0, headY(L.y, L.h) + 160],
          ],
          end,
        )}
        shakeAt={[fFam + 4]}
      >
        {f < fPen ? (
          <>
            <BG blur={3}>
              <ViceCity night />
            </BG>
            <At x={L.x} y={L.y} from="none">
              <Toon {...LUCIA} expr="angry" pose="fight" height={L.h} />
            </At>
          </>
        ) : (
          <>
            <MugshotWall />
            <At x={L.x} y={L.y} from="none">
              <Toon {...LUCIA_PRESA} expr="angry" pose="hold" height={L.h} />
            </At>
            <Placard name="LUCÍA CAMINOS" num="#03 51 92" x={L.x} y={1170} />
          </>
        )}
      </Cam>
      {f < fPen && <Siren from={fFam} />}
      <Flash at={fPen} />
      <Grade tint={f < fPen ? "rgba(120,80,200,0.25)" : "rgba(180,200,230,0.2)"} />
      <Sfx at={fFam} src="sirena" vol={0.35} />
      <Sfx at={fPen} src="pop" vol={0.6} />
    </>
  );
};

const SLucia3: React.FC = () => {
  const id = "lucia3";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fSuerte = wf(id, "suerte.");
  const fInt = wf(id, "inteligentes.");
  const L = { x: 540, y: 2050, h: 1350 };
  const lift = interpolate(f, [fSuerte - 6, fSuerte + 10], [0, -1900], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.25, 1.35, 0, 200],
            [fSuerte + 12, 1.5, 1.7, 0, headY(L.y, L.h) + 60],
          ],
          end,
        )}
      >
        <BG>
          <Room wall="#a4abbd" side="#6a7186" floorA="#b7aa92" floorB="#8a7c66" stone />
        </BG>
        <At x={L.x} y={L.y} from="none">
          <Toon {...(f < fSuerte ? LUCIA_PRESA : LUCIA)} expr={f < fSuerte ? "worried" : f > fInt ? "smug" : "happy"} {...sw8(f, fSuerte, "idle", "hips")} height={L.h} />
        </At>
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${lift}px)`, zIndex: 5000 }}>
          <Bars at={0} />
        </div>
      </Cam>
      <Grade tint="rgba(160,180,230,0.25)" />
      <Sfx at={fSuerte - 6} src="whoosh" vol={0.4} />
    </>
  );
};

const SJason1: React.FC = () => {
  const id = "jason1";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fEst = wf(id, "estafadores,");
  const fEj = wf(id, "ejército");
  const J = { x: 540, y: 2040, h: 1330 };
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.25, 1.4, 0, -60],
            [fEst, 1.1, 1.2, 0, 220],
            [fEj, 1.55, 1.7, 0, headY(J.y, J.h) + 80],
          ],
          end,
        )}
      >
        {f < fEst && (
          <>
            <CorkBoard />
            <Polaroid x={540} y={520} w={520} rot={3} label="JASON DUVAL" bg="#a6d0f0">
              <Mini p={JASON} />
            </Polaroid>
            <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center", fontFamily: "Oswald", fontWeight: 700, fontSize: 96, color: "#f7f4ec", textShadow: "0 8px 0 rgba(0,0,0,0.5)" }}>FICHA #2</div>
          </>
        )}
        {f >= fEst && f < fEj && (
          <>
            <BG blur={3}>
              <ViceCity night />
            </BG>
            <At x={200} y={1950} from="none">
              <Toon hair="spiky" hairColor="#3a2a1a" outfit="#6b3f8a" outfit2="#2a1a33" expr="smug" pose="hips" height={1100} seed={21} />
            </At>
            <At x={880} y={1960} from="none">
              <Toon hair="bald" outfit="#c44d2b" outfit2="#f2e6d6" beard="#4a2c18" expr="smug" pose="point" talking flip height={1150} seed={22} />
            </At>
            <At x={540} y={1990} from="none">
              <Toon {...JASON} outfit="#6b6f78" outfit2="#c9ccd2" expr="worried" pose="idle" height={900} />
            </At>
          </>
        )}
        {f >= fEj && (
          <>
            <BG>
              <Room wall="#8a9a6a" side="#5f6e45" floorA="#7a7a5a" floorB="#5d5d42" trim="#3f4a2a" />
            </BG>
            <At x={J.x} y={J.y} from="none">
              <Toon {...JASON} hair="helmet" outfit="#55623a" outfit2="#3d4628" expr="neutral" pose="salute" height={J.h} />
            </At>
          </>
        )}
      </Cam>
      <Grade tint={f >= fEst && f < fEj ? "rgba(255,190,140,0.35)" : "rgba(220,220,200,0.15)"} />
      <Sfx at={4} src="pop" vol={0.4} />
      <Sfx at={fEj} src="mazo" vol={0.35} />
    </>
  );
};

const SJason2: React.FC = () => {
  const id = "jason2";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fCayos = wf(id, "Cayos");
  const fTraf = wf(id, "traficantes");
  const J = { x: 330, y: 2000, h: 1300 };
  const B = { x: 790, y: 2000, h: 1300 };
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.0, 1.08, 0, 0],
            [fCayos, 1.2, 1.3, -60, 250],
            [fTraf, 1.6, 1.75, B.x - 540, headY(B.y, B.h) + 40],
          ],
          end,
        )}
      >
        <BG blur={2}>
          <Keys />
        </BG>
        <At x={J.x} y={J.y} from="left" at={fCayos - 6}>
          <Toon {...JASON} expr={f > fTraf ? "smug" : "neutral"} pose="hips" walking={f > fCayos - 6 && f < fCayos + 6} height={J.h} />
        </At>
        <At x={B.x} y={B.y} from="right" at={fTraf - 8}>
          <Toon hair="bald" outfit="#e85a7a" outfit2="#ffe08a" beard="#8a8580" expr="smug" pose="hold" talking flip height={B.h} seed={30} />
        </At>
      </Cam>
      <Grade tint="rgba(255,230,190,0.12)" />
      <Clip name="jason2" from={0} to={fCayos} />
      <Sfx at={fCayos - 6} src="whoosh" vol={0.3} />
    </>
  );
};

const SJason3: React.FC = () => {
  const id = "jason3";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fComp = wf(id, "complica");
  const J = { x: 540, y: 2040, h: 1350 };
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.3, 1.45, 0, headY(J.y, J.h) + 160],
            [fComp, 1.6, 1.75, 0, headY(J.y, J.h) + 60],
          ],
          end,
        )}
        shakeAt={[fComp + 2]}
      >
        <BG blur={2}>
          <ViceCity />
        </BG>
        <At x={J.x} y={J.y} from="none">
          <Toon {...JASON} expr={f > fComp ? "surprised" : "happy"} {...sw8(f, fComp, "hips", "up")} height={J.h} />
        </At>
      </Cam>
      <Siren from={fComp} />
      <Grade tint="rgba(255,170,200,0.18)" />
      <Sfx at={fComp} src="sirena" vol={0.45} />
    </>
  );
};

const SJuntos: React.FC = () => {
  const id = "juntos";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fCruz = wf(id, "cruzan,");
  const fBusc = wf(id, "buscada");
  const walk = interpolate(f, [0, fCruz + 4], [0, 1], { extrapolateRight: "clamp" });
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.05, 1.12, 0, 160],
            [fBusc, 1.2, 1.3, 0, 260],
          ],
          end,
        )}
      >
        <BG blur={2}>
          <ViceCity night />
        </BG>
        <At x={-150 + walk * 450} y={2000} from="none">
          <Toon {...LUCIA} expr="smug" pose={walk < 1 ? "idle" : "hips"} walking={walk < 1} height={1250} />
        </At>
        <At x={1230 - walk * 450} y={2020} from="none">
          <Toon {...JASON} expr="smug" pose={walk < 1 ? "idle" : "hold"} walking={walk < 1} height={1290} flip />
        </At>
      </Cam>
      <Siren from={fBusc} />
      <Wanted at={fBusc} />
      <Grade tint="rgba(150,90,220,0.25)" />
      <Clip name="juntos" from={0} to={fBusc - 2} />
      <Sfx at={fBusc} src="sirena" vol={0.4} />
      <Sfx at={fBusc + 4} src="ding" vol={0.4} />
    </>
  );
};

const SOutro: React.FC = () => {
  const id = "outro";
  const end = T.frames(id);
  const fLu = wf(id, "Lucía,");
  const fJa = wf(id, "Jason?");
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.0, 1.06, 0, 0],
            [fLu, 1.45, 1.55, -250, -350],
            [fJa, 1.45, 1.55, 250, -350],
            [fJa + 22, 1.0, 1.08, 0, 0],
          ],
          end,
        )}
      >
        <CorkBoard />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, zIndex: 2500 }}>
          <path d="M290 560 Q540 700 790 560" stroke="#c8102e" strokeWidth="8" fill="none" />
        </svg>
        <Polaroid x={290} y={420} w={420} rot={-5} label="LUCÍA" bg="#f0a6b8">
          <Mini p={LUCIA} expr="happy" />
        </Polaroid>
        <Polaroid x={790} y={420} w={420} rot={4} label="JASON" bg="#a6d0f0">
          <Mini p={JASON} expr="happy" />
        </Polaroid>
        <div style={{ position: "absolute", top: 1050, left: 0, right: 0, textAlign: "center", fontFamily: "Oswald", fontWeight: 700, fontSize: 150, color: "#f7f4ec", textShadow: "0 10px 0 rgba(0,0,0,0.5)", zIndex: 2600 }}>¿?</div>
      </Cam>
      <Grade tint="rgba(255,220,180,0.15)" />
      <Sfx at={fLu} src="pop" vol={0.4} />
      <Sfx at={fJa} src="pop" vol={0.4} />
    </>
  );
};

const SCENES: Record<string, React.FC> = {
  hook: SHook,
  lucia1: SLucia1,
  lucia2: SLucia2,
  lucia3: SLucia3,
  jason1: SJason1,
  jason2: SJason2,
  jason3: SJason3,
  juntos: SJuntos,
  outro: SOutro,
};

export const GTA_PERFILES_FRAMES = T.total;
export const GtaPerfiles: React.FC = () => <NarratedVideo voz={voz} order={ORDER} tail={TAIL} scenes={SCENES} folder="voz_gta-perfiles" music="musica_gta.wav" musicVol={0.14} />;
