import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from "remotion";
import voz from "./voz_mantis.json";
import { INK, Toon } from "../Characters";
import { At, makeTiming, Sfx } from "../kit";
import { CamPro, NarratedVideo2, Pow, Reaction, SlowMo, react } from "../kit2";
import type { Move } from "../kit2";
import { BigCount, CavBubble, Crab, Fish, Flash, HookTitle, Shock, Shrimp, Tag } from "../Scenery3";
import { Bullet, Mantis, mantisClub, mantisEyes, Snail } from "../creatures";
import { Aquarium, Lab, ReefPro } from "../worlds";

const ORDER = ["hook", "conoce", "golpe", "doble", "caparazon", "ojos", "giro", "ciencia", "outro"];
const TAIL = { outro: 30 };
const T = makeTiming(voz, ORDER, TAIL);
const wf = T.wf;
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const M = { x: 450, y: 1620, h: 500 };
const EYE = mantisEyes(M.x, M.y, M.h);
const CLUB = mantisClub(M.x, M.y, M.h, 1);
const CLUB0 = mantisClub(M.x, M.y, M.h, 0);
const fo = (p: { x: number; y: number }, dx = 0, dy = 0) => ({ x: p.x - 540 + dx, y: p.y - 960 + dy });
const whip = (t: number, s: number, y: number, dir = 1): Move[] => [
  { t, s, x: 420 * dir, y, ease: "whip", dur: 6 },
  { t: t + 6, s, x: -420 * dir, y, ease: "cut" },
  { t: t + 7, s, x: 0, y, ease: "whip", dur: 8 },
];

const Grade2: React.FC<{ tint?: string }> = ({ tint = "rgba(80,170,255,0.10)" }) => (
  <>
    <AbsoluteFill style={{ background: tint, mixBlendMode: "multiply", zIndex: 9000, pointerEvents: "none" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 62% at 50% 45%, rgba(0,0,0,0) 50%, rgba(3,10,25,0.55) 100%)", zIndex: 9001, pointerEvents: "none" }} />
  </>
);

/* ------------------------------------------------------------------ HOOK */
const SHook: React.FC = () => {
  const id = "hook";
  const f = useCurrentFrame();
  const fPun = wf(id, "puñetazos");
  const fBala = wf(id, "bala…");
  const fRomper = wf(id, "romper");
  const fCristal = wf(id, "cristal");
  const hit1 = fPun + 3;
  const hit2 = fCristal + 2;
  const inTank = f >= fRomper;
  const A = { x: 470, y: 1450, h: 400 };
  const crackP = mantisClub(A.x, A.y, A.h, 1);
  const crack = { x: crackP.x + 60, y: crackP.y };
  const crabFly = f > hit1 ? f - hit1 : 0;
  return (
    <>
      <CamPro
        moves={[
          { t: 0, s: 3.1, x: fo(EYE).x, y: fo(EYE).y },
          { t: 4, s: 1.5, x: 40, y: 260, ease: "snap" },
          { t: fPun - 6, s: 2.0, ...fo(CLUB, -40), ease: "smooth", dur: 9 },
          { t: hit1 + 2, s: 1.35, x: 120, y: 240, ease: "snap" },
          { t: fRomper, s: 1.1, x: 0, y: 120, ease: "cut", drift: 0.05 },
          { ...react(hit2, crack.x - 540 - 60, crack.y - 960, 2.3, -4) },
        ]}
        shake={[hit1, hit2]}
        impact={[hit1, hit2]}
        free
      >
        {!inTank ? (
          <ReefPro>
            <At x={M.x} y={M.y} from="none">
              <Mantis height={M.h} strikes={[hit1]} expr={f < 4 ? "angry" : f > hit1 + 8 ? "smug" : "angry"} lookX={0.9} />
            </At>
            <div style={{ position: "absolute", left: CLUB.x + 40 + crabFly * 38, top: CLUB.y - 150 - crabFly * 22 + crabFly * crabFly * 0.6, transform: `rotate(${crabFly * 25}deg)`, zIndex: 1700 }}>
              <Crab height={230} stunned={f > hit1} />
            </div>
          </ReefPro>
        ) : (
          <Aquarium crack={interpolate(f, [hit2, hit2 + 6], [0, 1], clamp)} cx={crack.x} cy={crack.y}>
            <At x={A.x} y={A.y} from="none">
              <Mantis height={A.h} strikes={[hit2]} expr={f > hit2 + 6 ? "smug" : "angry"} lookX={1} />
            </At>
          </Aquarium>
        )}
      </CamPro>
      {f > fBala - 8 && f < fRomper && (
        <div style={{ position: "absolute", left: interpolate(f, [fBala - 8, fBala + 6], [-500, 1300], clamp), top: 1040, zIndex: 9300 }}>
          <Bullet w={380} />
        </div>
      )}
      <Tag text="= ACELERACIÓN DE UNA BALA" x={540} y={1120} at={fBala + 2} color="#ffd23f" size={62} until={fRomper - 1} />
      <Pow at={hit1} text="¡PUM!" x={700} y={760} />
      <Pow at={hit2} text="¡CRACK!" x={560} y={700} color="#7fd6ff" rot={6} />
      <Reaction at={hit2 + 10} mark="!!" y={560} dur={22} />
      <Flash at={hit1} dur={4} />
      <HookTitle lines={["SU PUÑETAZO", "ES UNA BALA"]} hi={1} until={fRomper - 2} top={150} />
      <Grade2 tint={inTank ? "rgba(255,230,190,0.08)" : undefined} />
      <Sfx at={0} src="zoom" vol={0.4} />
      <Sfx at={hit1} src="golpe" vol={0.8} />
      <Sfx at={fBala - 6} src="whoosh" vol={0.5} />
      <Sfx at={hit2} src="golpe" vol={0.7} />
      <Sfx at={hit2 + 1} src="cristal" vol={0.65} />
    </>
  );
};

/* ------------------------------------------------------------------ CONOCE */
const SConoce: React.FC = () => {
  const id = "conoce";
  const f = useCurrentFrame();
  const fMantis = wf(id, "mantis,");
  const fPrimo = wf(id, "primo");
  const fPinzas = wf(id, "pinzas,");
  const fMazas = wf(id, "mazas");
  const fCuerpo = wf(id, "cuerpo.");
  const x = interpolate(f, [0, 34], [-420, M.x], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const P = { x: 870, y: 1700, h: 230 };
  const ringR = spring({ frame: f - fMazas, fps: 30, config: { damping: 9 } }) * 110;
  return (
    <>
      <CamPro
        moves={[
          { t: 0, s: 1.25, x: -60, y: 260, drift: 0.02 },
          { ...react(fMantis - 2, fo(EYE).x - 40, fo(EYE).y + 80, 2.2, -3) },
          { t: fPrimo, s: 1.15, x: 60, y: 280, ease: "smooth", dur: 12 },
          { t: fPinzas, s: 2.1, x: P.x - 540 + 60, y: P.y - 960 - 120, ease: "snap" },
          { t: fMazas - 2, s: 2.2, ...fo(CLUB0, 0, -20), ease: "snap" },
          { t: fCuerpo + 4, s: 1.3, x: 0, y: 260, ease: "smooth", dur: 14 },
        ]}
        shake={[fCuerpo + 6]}
      >
        <ReefPro burrow>
          <At x={x} y={M.y} from="none">
            <Mantis height={M.h} swim={f < 34} expr={f > fMantis && f < fPrimo + 10 ? "happy" : f > fPinzas && f < fMazas ? "smug" : "neutral"} lookX={f > fPrimo ? 1 : 0.5} strikes={[fCuerpo + 6]} />
          </At>
          <At x={P.x} y={P.y} at={fPrimo} from="right">
            <Shrimp height={P.h} flip open={f > fPinzas ? 0.5 + 0.5 * Math.sin(f / 3) : 0} expr="happy" />
          </At>
          {f >= fMazas && (
            <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, zIndex: 5000 }}>
              <circle cx={CLUB0.x} cy={CLUB0.y} r={ringR} fill="none" stroke="#ffd23f" strokeWidth="12" strokeDasharray="26 14" transform={`rotate(${f * 3} ${CLUB0.x} ${CLUB0.y})`} />
            </svg>
          )}
        </ReefPro>
      </CamPro>
      <Tag text="CAMARÓN MANTIS" x={540} y={470} at={fMantis} color="#7be07a" size={92} until={fPrimo + 18} />
      <Tag text="PRIMO DEL PISTOLA" x={540} y={470} at={fPrimo + 20} color="#ff8e5e" size={76} until={fMazas - 3} />
      <Tag text="¿PINZAS? NO" x={540} y={1150} at={fPinzas + 2} color="#ffffff" size={80} until={fMazas - 3} />
      <Tag text="MAZAS ×2" x={540} y={470} at={fMazas + 2} color="#ff5a8a" size={100} />
      <Pow at={fCuerpo + 6} text="¡ZAS!" x={760} y={900} size={120} />
      <Grade2 />
      <Sfx at={2} src="burbujas" vol={0.35} />
      <Sfx at={fMantis - 2} src="zoom" vol={0.35} />
      <Sfx at={fPrimo} src="pop" vol={0.4} />
      <Sfx at={fMazas - 2} src="zoom" vol={0.35} />
      <Sfx at={fCuerpo + 6} src="snap" vol={0.6} />
    </>
  );
};

/* ------------------------------------------------------------------ GOLPE */
const SGolpe: React.FC = () => {
  const id = "golpe";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fDisp = wf(id, "dispara");
  const fOch = wf(id, "ochenta");
  const fMil = wf(id, "milésimas");
  const hit = fDisp + 3;
  const slow = f >= fMil - 4;
  const replayT = hit - 10 + (f - (fMil - 4)) * 0.22;
  const mt = slow ? replayT : f;
  const snailCrack = interpolate(mt, [hit, hit + 14], [0, 1], clamp);
  const ms = interpolate(replayT, [hit - 2, hit], [0, 3], clamp);
  return (
    <>
      <CamPro
        moves={[
          { t: 0, s: 1.6, ...fo(CLUB, -120, -60), drift: 0.04 },
          { t: hit, s: 2.1, ...fo(CLUB, 40), ease: "snap" },
          { t: fOch - 2, s: 1.2, x: 60, y: 220, ease: "smooth", dur: 12 },
          { t: fMil - 4, s: 2.4, ...fo(CLUB, -30), ease: "smooth", dur: 30, r: -3, drift: 0.05 },
        ]}
        shake={[hit]}
        impact={[hit]}
      >
        <ReefPro>
          <At x={M.x} y={M.y} from="none">
            <Mantis height={M.h} time={mt} strikes={[hit]} expr="angry" lookX={1} />
          </At>
          <div style={{ position: "absolute", left: CLUB.x + 10, top: CLUB.y - 120, zIndex: 1700 }}>
            <Snail size={240} crack={snailCrack} t={mt} />
          </div>
        </ReefPro>
      </CamPro>
      <Pow at={hit} text="¡PUM!" x={760} y={700} />
      {!slow && <BigCount x={540} y={560} at={fOch - 2} from={0} to={80} dur={16} suffix=" km/h" size={150} color="#ffd23f" />}
      <SlowMo from={fMil - 4} to={end + 2} label="CÁMARA LENTA" />
      {slow && (
        <div style={{ position: "absolute", right: 60, top: 300, zIndex: 9250, fontFamily: "Oswald", fontWeight: 700, fontSize: 96, color: "white", WebkitTextStroke: `12px ${INK}`, paintOrder: "stroke fill" }}>
          {ms.toFixed(3).replace(".", ",")} ms
        </div>
      )}
      <Flash at={hit} dur={4} />
      <Grade2 />
      <Sfx at={hit} src="golpe" vol={0.8} />
      <Sfx at={fOch - 2} src="ding" vol={0.3} />
      <Sfx at={fMil - 4} src="riser" vol={0.35} />
    </>
  );
};

/* ------------------------------------------------------------------ DOBLE */
const SDoble: React.FC = () => {
  const id = "doble";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fAgua = wf(id, "agua");
  const fBurb = wf(id, "burbujas");
  const fRev = wf(id, "revientan…");
  const fPresa = wf(id, "presa");
  const fSeg = wf(id, "segundo");
  const hitT = fBurb - 6;
  const mt = hitT + (f - hitT) * 0.3;
  const tip = { x: CLUB.x + 70, y: CLUB.y };
  const C = { x: CLUB.x + 190, y: CLUB.y + 110 };
  const jolt1 = f > hitT ? Math.exp(-(f - hitT) / 6) * Math.sin((f - hitT) * 1.5) * 25 : 0;
  const fly = f > fRev ? f - fRev : 0;
  return (
    <>
      <CamPro
        moves={[
          { t: 0, s: 1.35, x: 80, y: 240, drift: 0.03 },
          { t: fAgua, s: 1.9, ...fo(tip, 20), ease: "smooth", dur: 14 },
          { ...react(fRev, tip.x - 540 + 40, tip.y - 960, 2.4, 3) },
          { t: fPresa, s: 1.5, x: C.x - 540, y: C.y - 960 - 120, ease: "smooth", dur: 10 },
        ]}
        shake={[fRev, fSeg + 2]}
        impact={[fRev]}
      >
        <ReefPro>
          <At x={M.x} y={M.y} from="none">
            <Mantis height={M.h} time={mt} strikes={[hitT]} expr="angry" lookX={1} />
          </At>
          <div style={{ position: "absolute", left: C.x - 130 + jolt1 + fly * 30, top: C.y - 200 - fly * 14 + fly * fly * 0.5, transform: `rotate(${fly * 20}deg)`, zIndex: 1700 }}>
            <Crab height={240} stunned={f > fRev} />
          </div>
        </ReefPro>
        <CavBubble x={tip.x + 40} y={tip.y} at={fBurb - 2} collapse={fRev} r={150} />
        <Shock x={tip.x + 40} y={tip.y} at={fRev} n={4} max={900} />
      </CamPro>
      <SlowMo from={0} to={end} label="CÁMARA LENTA" />
      <Tag text="GOLPE 1" x={300} y={520} at={hitT} color="#ffffff" size={70} />
      <Tag text="GOLPE 2: BURBUJA" x={600} y={640} at={fRev + 2} color="#ffd23f" size={70} rot={4} />
      <Pow at={fSeg} text="¡×2!" x={560} y={1050} color="#ff5a8a" />
      <Flash at={fRev} color="#fff6b0" dur={10} />
      <Grade2 />
      <Sfx at={hitT} src="golpe" vol={0.6} />
      <Sfx at={fBurb - 2} src="burbujas" vol={0.5} />
      <Sfx at={fRev} src="boom" vol={0.55} />
      <Sfx at={fSeg} src="golpe" vol={0.5} />
    </>
  );
};

/* ------------------------------------------------------------------ CAPARAZÓN */
const SCaparazon: React.FC = () => {
  const id = "caparazon";
  const f = useCurrentFrame();
  const fCang = wf(id, "cangrejos");
  const fCarac = wf(id, "caracoles,");
  const fOtros = wf(id, "otros");
  const fImp = wf(id, "imposibles");
  const h1 = fCang + 2;
  const h2 = fCarac + 2;
  const other = f >= fOtros + 6;
  const crabFly = f > h1 ? f - h1 : 0;
  const bite = Math.max(0, Math.sin((f - fOtros) / 3)) * 60;
  return (
    <>
      <CamPro
        moves={[
          { t: 0, s: 1.3, x: 60, y: 240, drift: 0.03 },
          { t: h1, s: 1.7, ...fo(CLUB, 60, -40), ease: "snap" },
          { t: h2, s: 1.9, ...fo(CLUB, 60, -20), ease: "snap", r: 3 },
          ...whip(fOtros, 1.3, 200),
          { ...react(fImp, -40, -60, 1.9, -3) },
        ]}
        shake={[h1, h2]}
        impact={[h2]}
        free
      >
        {!other ? (
          <ReefPro>
            <At x={M.x} y={M.y} from="none">
              <Mantis height={M.h} strikes={[h1, h2]} expr={f > h2 + 6 ? "smug" : "angry"} lookX={1} />
            </At>
            {f < h2 && (
              <div style={{ position: "absolute", left: CLUB.x - 20 + crabFly * 40, top: CLUB.y - 190 - crabFly * 30 + crabFly * crabFly * 0.8, transform: `rotate(${crabFly * 30}deg)`, zIndex: 1700, opacity: f > h1 + 20 ? 0 : 1 }}>
                <Crab height={220} stunned={f > h1} />
              </div>
            )}
            {f >= h1 + 8 && (
              <div style={{ position: "absolute", left: CLUB.x + 10, top: CLUB.y - 120, zIndex: 1700 }}>
                <Snail size={240} crack={interpolate(f, [h2, h2 + 14], [0, 1], clamp)} t={f} />
              </div>
            )}
          </ReefPro>
        ) : (
          <ReefPro>
            <div style={{ position: "absolute", left: 380, top: 1330, zIndex: 1600 }}>
              <Snail size={330} />
            </div>
            <div style={{ position: "absolute", left: 640 + bite, top: 1180, zIndex: 1700 }}>
              <Fish height={240} color="#ffd23f" flip seed={2} />
            </div>
          </ReefPro>
        )}
      </CamPro>
      {other && <Reaction at={fImp + 2} mark="?" color="#ffffff" y={600} />}
      <Tag text="IMPOSIBLE" x={540} y={460} at={fImp + 4} color="#ff5a5a" size={96} />
      <Pow at={h1} text="¡CRAC!" x={760} y={720} size={120} />
      <Pow at={h2} text="¡CRASH!" x={700} y={760} color="#ff8e5e" />
      <Grade2 />
      <Sfx at={h1} src="golpe" vol={0.7} />
      <Sfx at={h2} src="golpe" vol={0.8} />
      <Sfx at={h2 + 1} src="cristal" vol={0.3} />
      <Sfx at={fOtros} src="whoosh" vol={0.5} />
      <Sfx at={fImp + 2} src="boing" vol={0.45} />
    </>
  );
};

/* ------------------------------------------------------------------ OJOS */
const RAINBOW = ["#8a2be2", "#4b3cff", "#2f7bff", "#14b8ff", "#00d4b0", "#2fd05a", "#a5e36b", "#ffe94a", "#ffb12a", "#ff6a2a", "#ff2a4a", "#ff4fd8"];
const Receptors: React.FC<{ at: number; colors: string[]; x: number; y: number; w?: number }> = ({ at, colors, x, y, w = 70 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x - (colors.length * (w + 10)) / 2, top: y, display: "flex", gap: 10, zIndex: 6000 }}>
      {colors.map((c, i) => {
        const s = spring({ frame: f - at - i * 2, fps: 30, config: { damping: 9 } });
        return <div key={i} style={{ width: w, height: 220 * s, marginTop: 220 * (1 - s), background: c, border: `7px solid ${INK}`, borderRadius: 14, boxShadow: `0 0 20px ${c}` }} />;
      })}
    </div>
  );
};

const SOjos: React.FC = () => {
  const id = "ojos";
  const f = useCurrentFrame();
  const fOjos = wf(id, "ojos");
  const fDoce = wf(id, "doce");
  const fTu = wf(id, "Tú");
  const fTres = wf(id, "tres.");
  const human = f >= fTu + 6;
  return (
    <>
      <CamPro
        moves={[
          { t: 0, s: 1.3, x: 0, y: 220 },
          { ...react(fOjos - 2, fo(EYE).x, fo(EYE).y + 20, 3.0, 2) },
          { t: fDoce - 2, s: 1.15, x: 0, y: 120, ease: "smooth", dur: 10 },
          ...whip(fTu, 1.2, 60),
          { ...react(fTres, 0, -360, 1.9, -2) },
        ]}
        free
      >
        {!human ? (
          <ReefPro>
            <At x={M.x} y={M.y} from="none">
              <Mantis height={M.h} eyeSplit={f > fOjos && f < fDoce} expr={f > fDoce ? "smug" : "awe"} glowEyes={f > fDoce ? 0.8 : 0} />
            </At>
          </ReefPro>
        ) : (
          <ReefPro noFg>
            <At x={540} y={2080} from="none">
              <Toon hair="curly" hairColor="#3a2418" outfit="#2f4f8f" outfit2="#f4efe6" expr={f > fTres ? "worried" : "neutral"} pose={f > fTres ? "shrug" : "idle"} height={1400} seed={4} />
            </At>
          </ReefPro>
        )}
      </CamPro>
      {!human && f >= fDoce && <Receptors at={fDoce} colors={RAINBOW} x={540} y={420} w={64} />}
      {!human && <BigCount x={540} y={760} at={fDoce + 4} from={0} to={12} dur={14} size={170} color="#ffd23f" />}
      {human && <Receptors at={fTu + 8} colors={["#2f7bff", "#2fd05a", "#ff2a4a"]} x={540} y={380} w={130} />}
      {human && <BigCount x={540} y={720} at={fTres} from={0} to={3} dur={8} size={170} color="#ffffff" />}
      <Grade2 />
      <Sfx at={fOjos - 2} src="zoom" vol={0.4} />
      <Sfx at={fDoce} src="riser" vol={0.3} />
      <Sfx at={fTu} src="whoosh" vol={0.5} />
      <Sfx at={fTres} src="boing" vol={0.4} />
    </>
  );
};

/* ------------------------------------------------------------------ GIRO */
const Swatch: React.FC<{ c: string; x: number; y: number; at: number; label?: string }> = ({ c, x, y, at, label }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - at, fps: 30, config: { damping: 10 } });
  return (
    <div style={{ position: "absolute", left: x - 110, top: y - 110, width: 220, height: 220, background: c, border: `10px solid ${INK}`, borderRadius: 24, transform: `scale(${s}) rotate(${Math.sin(f / 9 + x) * 3}deg)`, zIndex: 6000, boxShadow: "0 14px 0 rgba(0,0,0,0.3)" }}>
      {label && <div style={{ position: "absolute", bottom: -84, left: -40, right: -40, textAlign: "center", fontFamily: "Oswald", fontWeight: 700, fontSize: 54, color: "white", WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill" }}>{label}</div>}
    </div>
  );
};

const SGiro: React.FC = () => {
  const id = "giro";
  const f = useCurrentFrame();
  const fLoco = wf(id, "loco:");
  const fPeor = wf(id, "peor");
  const fCien = wf(id, "científicos");
  const fComp = wf(id, "compara…");
  const fRec = wf(id, "reconoce");
  const fEsc = wf(id, "escáner.");
  const inLab = f >= fCien - 2 && f < fRec;
  const scan = f >= fRec;
  const beam = interpolate(f, [fRec + 2, fRec + 26], [0, 1], clamp);
  return (
    <>
      <CamPro
        moves={[
          { t: 0, s: 1.4, x: 0, y: 220 },
          { ...react(fLoco, fo(EYE).x, fo(EYE).y + 60, 2.6, -4) },
          { t: fPeor - 4, s: 1.15, x: 60, y: 60, ease: "smooth", dur: 10 },
          { t: fCien - 2, s: 1.2, x: 0, y: 100, ease: "cut" },
          { t: fComp, s: 1.55, x: 140, y: -200, ease: "smooth", dur: 14 },
          { t: fRec, s: 1.25, x: 0, y: 160, ease: "cut", drift: 0.04 },
          { ...react(fEsc, fo(EYE).x + 60, fo(EYE).y + 40, 2.2, 3) },
        ]}
        shake={[fLoco]}
      >
        {inLab ? (
          <Lab
            screen={
              <div style={{ position: "absolute", inset: 0, background: "#0d1a2a" }}>
                <div style={{ position: "absolute", left: 20, top: 60, transform: "scale(0.42)", transformOrigin: "0 0" }}>
                  <Mantis height={420} expr="neutral" eyeSplit />
                </div>
              </div>
            }
          >
            <At x={360} y={2000} from="left" at={fCien - 2}>
              <Toon hair="curly" hairColor="#e8e4dc" outfit="#f4f6f8" outfit2="#5b8bd9" beard="#e8e4dc" expr={f > fComp ? "surprised" : "smug"} pose={f > fComp ? "shrug" : "point"} talking height={1250} seed={11} />
            </At>
          </Lab>
        ) : (
          <ReefPro>
            <At x={M.x} y={M.y} from="none">
              <Mantis height={M.h} expr={scan ? "smug" : f > fPeor ? "worried" : "surprised"} eyeSplit={!scan && f > fPeor} glowEyes={scan ? 1 : 0} lookX={1} />
            </At>
            {scan && (
              <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, zIndex: 4000 }}>
                <polygon points={`${EYE.x},${EYE.y} 1100,${300 + beam * 1200} 1100,${380 + beam * 1200}`} fill="#ff3b6b" opacity={0.35} />
                <line x1={EYE.x} y1={EYE.y} x2={1100} y2={340 + beam * 1200} stroke="#ff6b8a" strokeWidth="8" />
              </svg>
            )}
          </ReefPro>
        )}
      </CamPro>
      {!inLab && !scan && f > fPeor && (
        <>
          <Swatch c="#3fae5a" x={300} y={560} at={fPeor} />
          <Swatch c="#46b85e" x={780} y={560} at={fPeor + 4} />
          <Tag text="¿IGUALES?" x={540} y={800} at={fPeor + 8} color="#ffffff" size={80} />
        </>
      )}
      {scan &&
        [
          ["ROJO", "#ff2a4a", 300, 520],
          ["AZUL", "#2f7bff", 780, 560],
          ["VERDE", "#2fd05a", 420, 860],
          ["AMARILLO", "#ffe94a", 800, 900],
        ].map(([l, c, x, y], i) => <Tag key={i} text={l as string} x={x as number} y={y as number} at={fRec + 6 + i * 4} color={c as string} size={60} rot={(i % 2 ? 4 : -4)} />)}
      <Reaction at={fLoco} mark="?!" y={560} />
      <Grade2 tint={inLab ? "rgba(255,255,255,0.0)" : undefined} />
      <Sfx at={fLoco} src="zoom" vol={0.45} />
      <Sfx at={fPeor} src="pop" vol={0.35} />
      <Sfx at={fCien - 2} src="whoosh" vol={0.4} />
      {[0, 4, 8, 12].map((d) => (
        <Sfx key={d} at={fRec + 6 + d} src="ding" vol={0.22} />
      ))}
    </>
  );
};

/* ------------------------------------------------------------------ CIENCIA */
const Helicoid: React.FC<{ x: number; y: number; r: number; at: number }> = ({ x, y, r, at }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - at, fps: 30, config: { damping: 11 } });
  return (
    <svg width={r * 2 + 40} height={r * 2 + 40} viewBox={`${-r - 20} ${-r - 20} ${r * 2 + 40} ${r * 2 + 40}`} style={{ position: "absolute", left: x - r - 20, top: y - r - 20, transform: `scale(${s})`, zIndex: 5000 }}>
      <defs>
        <clipPath id="helc">
          <circle r={r} />
        </clipPath>
      </defs>
      <circle r={r} fill="#ffd0de" />
      <g clipPath="url(#helc)">
        {Array.from({ length: 8 }).map((_, k) => (
          <g key={k} transform={`translate(0 ${-r + k * (r / 4)}) rotate(${k * 22 + f * 0.6})`}>
            {Array.from({ length: 14 }).map((__, i) => (
              <line key={i} x1={-r * 1.5} x2={r * 1.5} y1={-r + i * (r / 7)} y2={-r + i * (r / 7)} stroke={k % 2 ? "#ef3f6f" : "#a31545"} strokeWidth="6" opacity="0.55" />
            ))}
          </g>
        ))}
      </g>
      <circle r={r} fill="none" stroke={INK} strokeWidth="16" />
      <circle r={r + 14} fill="none" stroke="#8a929e" strokeWidth="14" />
      <line x1={r * 0.7} y1={r * 0.7} x2={r * 1.3} y2={r * 1.3} stroke={INK} strokeWidth="40" strokeLinecap="round" />
    </svg>
  );
};
const Gear: React.FC<{ kind: "casco" | "chaleco"; x: number; y: number; at: number }> = ({ kind, x, y, at }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - at, fps: 30, config: { damping: 8 } });
  return (
    <div style={{ position: "absolute", left: x - 150, top: y - 150, transform: `scale(${s}) rotate(${Math.sin(f / 12 + x) * 4}deg)`, zIndex: 6000 }}>
      <svg width={300} height={300} viewBox="0 0 300 300" style={{ overflow: "visible" }}>
        {kind === "casco" ? (
          <g>
            <path d="M40 190 Q40 50 150 45 Q260 50 262 180 L270 205 L190 205 L180 175 L60 190 Z" fill="#5d6b4a" stroke={INK} strokeWidth="10" strokeLinejoin="round" />
            <path d="M80 90 Q130 60 190 70" stroke="#a5b585" strokeWidth="12" fill="none" strokeLinecap="round" />
            <path d="M60 150 Q150 130 250 160" stroke="#ef3f6f" strokeWidth="9" strokeDasharray="16 10" fill="none" />
          </g>
        ) : (
          <g>
            <path d="M80 40 L120 40 Q150 80 180 40 L220 40 L250 90 L235 270 L65 270 L50 90 Z" fill="#3f4a5a" stroke={INK} strokeWidth="10" strokeLinejoin="round" />
            {[110, 160, 210].map((yy) => (
              <rect key={yy} x="80" y={yy} width="140" height="34" rx="8" fill="#56657a" stroke={INK} strokeWidth="6" />
            ))}
            <path d="M90 130 L210 130" stroke="#ef3f6f" strokeWidth="8" strokeDasharray="16 10" />
          </g>
        )}
      </svg>
    </div>
  );
};

const SCiencia: React.FC = () => {
  const id = "ciencia";
  const f = useCurrentFrame();
  const fMaza = wf(id, "maza");
  const fEst = wf(id, "estudian");
  const fCascos = wf(id, "cascos");
  const fChal = wf(id, "chalecos");
  const fDuros = wf(id, "duros.");
  return (
    <>
      <CamPro
        moves={[
          { t: 0, s: 1.15, x: 0, y: 80, drift: 0.03 },
          { t: fMaza, s: 1.6, x: 0, y: -160, ease: "snap" },
          { t: fEst, s: 1.1, x: 0, y: 60, ease: "smooth", dur: 12 },
          { t: fDuros, s: 1.3, x: 0, y: -60, ease: "snap" },
        ]}
        shake={[fDuros]}
      >
        <Lab>
          <At x={800} y={1960} from="none">
            <Toon hair="curly" hairColor="#e8e4dc" outfit="#f4f6f8" outfit2="#5b8bd9" beard="#e8e4dc" expr={f > fCascos ? "happy" : "neutral"} pose={f > fEst ? "point" : "hold"} talking height={980} flip seed={11} />
          </At>
        </Lab>
      </CamPro>
      <Helicoid x={420} y={720} r={250} at={fMaza} />
      <Tag text="ESTRUCTURA EN ESPIRAL" x={420} y={1040} at={fMaza + 8} color="#ff8fb3" size={58} />
      <Gear kind="casco" x={300} y={1240} at={fCascos} />
      <Gear kind="chaleco" x={720} y={1240} at={fChal} />
      <Pow at={fDuros} text="¡IRROMPIBLE!" x={540} y={460} size={100} color="#7be07a" />
      <Grade2 tint="rgba(255,255,255,0)" />
      <Sfx at={fMaza} src="zoom" vol={0.35} />
      <Sfx at={fCascos} src="pop" vol={0.4} />
      <Sfx at={fChal} src="pop" vol={0.4} />
      <Sfx at={fDuros} src="mazo" vol={0.45} />
    </>
  );
};

/* ------------------------------------------------------------------ OUTRO: VERSUS */
const SOutro: React.FC = () => {
  const id = "outro";
  const f = useCurrentFrame();
  const fPist = wf(id, "pistola,");
  const fMan = wf(id, "mantis?");
  const fCom = wf(id, "comentarios.");
  const vs = spring({ frame: f - fMan - 8, fps: 30, config: { damping: 7, stiffness: 200 } });
  return (
    <>
      <CamPro
        moves={[
          { t: 0, s: 1.05, x: 0, y: 0 },
          { t: fPist - 2, s: 1.5, x: -200, y: -260, ease: "snap", r: -3 },
          { t: fMan - 2, s: 1.5, x: 200, y: 300, ease: "snap", r: 3 },
          { t: fMan + 8, s: 1.0, x: 0, y: 0, ease: "snap" },
          { t: fCom, s: 1.08, x: 0, y: 0, ease: "smooth" },
        ]}
        shake={[fMan + 8]}
      >
        <AbsoluteFill style={{ background: "#d7263d" }} />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <polygon points="0,1100 1080,820 1080,1920 0,1920" fill="#1e88e5" />
          {Array.from({ length: 30 }).map((_, i) => (
            <line key={i} x1={540} y1={960} x2={540 + Math.cos(i / 4.77) * 1400} y2={960 + Math.sin(i / 4.77) * 1400} stroke="white" strokeWidth="18" opacity="0.08" />
          ))}
          <polyline points="0,1100 1080,820" stroke={INK} strokeWidth="26" />
          <polyline points="0,1100 1080,820" stroke="#ffd23f" strokeWidth="10" />
        </svg>
        <At x={380} y={840} from="left" at={2}>
          <Shrimp height={380} open={0.5 + 0.5 * Math.sin(f / 4)} expr="angry" />
        </At>
        <At x={640} y={1640} from="right" at={6}>
          <Mantis height={500} flip expr="angry" strikes={[fMan + 4, fCom]} lookX={1} />
        </At>
      </CamPro>
      <div style={{ position: "absolute", left: 540, top: 960, transform: `translate(-50%, -50%) scale(${vs}) rotate(-8deg)`, zIndex: 9300, fontFamily: "Montserrat", fontWeight: 800, fontSize: 260, color: "#ffd23f", WebkitTextStroke: `24px ${INK}`, paintOrder: "stroke fill", textShadow: "10px 14px 0 rgba(0,0,0,0.4)" }}>VS</div>
      <Tag text="PISTOLA" x={300} y={260} at={fPist} color="#ffffff" size={80} />
      <Tag text="MANTIS" x={780} y={1640} at={fMan} color="#ffffff" size={80} rot={3} />
      <Tag text="¿QUIÉN GANA?" x={540} y={1800} at={fCom - 4} color="#ffd23f" size={70} />
      <Sfx at={fPist - 2} src="zoom" vol={0.35} />
      <Sfx at={fMan - 2} src="zoom" vol={0.35} />
      <Sfx at={fMan + 8} src="boom" vol={0.55} />
    </>
  );
};

const SCENES: Record<string, React.FC> = { hook: SHook, conoce: SConoce, golpe: SGolpe, doble: SDoble, caparazon: SCaparazon, ojos: SOjos, giro: SGiro, ciencia: SCiencia, outro: SOutro };
const HI = ["bala…", "acuario.", "mantis,", "mazas", "ochenta", "milésimas", "burbujas", "segundo", "doce", "tres.", "peor", "escáner.", "cascos", "chalecos", "mantis?", "pistola,"];

export const MANTIS_FRAMES = T.total;
export const MantisVideo: React.FC = () => <NarratedVideo2 voz={voz} order={ORDER} tail={TAIL} scenes={SCENES} folder="voz_mantis" music="musica_mar.wav" musicVol={0.13} hi={HI} transition="bubbles" />;
