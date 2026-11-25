import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import voz from "./voz_camaron.json";
import { INK } from "../Characters";
import { At, Cam, Grade, makeTiming, NarratedVideo, Sfx, shots } from "../kit";
import { Planet } from "../Scenery2";
import { BigCount, Burst, CavBubble, Crab, Fish, Flash, HookTitle, Jet, Reef, Shock, Shrimp, Sonar, Submarine, Tag, Thermo } from "../Scenery3";

const ORDER = ["hook", "pinza", "chorro", "burbuja", "presa", "sonar", "pierde", "outro"];
const TAIL = { outro: 26 };
const T = makeTiming(voz, ORDER, TAIL);
const wf = T.wf;
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

/** shrimp placement + helpers to find the claw tip on screen */
const S = { x: 400, y: 1580, h: 430 };
const k = S.h / 360;
const sw = (S.h * 640) / 360;
const tip = (s = S) => {
  const kk = s.h / 360;
  return { x: s.x - (s.h * 640) / 360 / 2 + 730 * kk, y: s.y - s.h + 215 * kk };
};
const face = { x: S.x - sw / 2 + 420 * k - 540, y: S.y - S.h + 150 * k - 960 };
const clawF = { x: S.x - sw / 2 + 560 * k - 540, y: S.y - S.h + 215 * k - 960 };

/** claw snap curve: opens slowly from `openAt`, slams shut at `snapAt` */
const clawOpen = (f: number, openAt: number, snapAt: number) => {
  if (f < openAt) return 0;
  if (f < snapAt) return interpolate(f, [openAt, Math.min(snapAt, openAt + 14)], [0, 1], clamp);
  return interpolate(f, [snapAt, snapAt + 2], [1, 0], clamp);
};

/** "5 cm" ruler */
const Ruler: React.FC<{ at: number; x: number; y: number; w: number }> = ({ at, x, y, w }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = interpolate(f, [at, at + 10], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 6000 }}>
      <svg width={w} height={120} style={{ overflow: "visible" }}>
        <rect x="0" y="20" width={w * p} height="70" fill="#ffe27a" stroke={INK} strokeWidth="8" rx="6" />
        {Array.from({ length: 11 }).map((_, i) => (i / 10 <= p ? <line key={i} x1={(w * i) / 10} x2={(w * i) / 10} y1="20" y2={i % 5 === 0 ? 70 : 50} stroke={INK} strokeWidth="5" /> : null))}
      </svg>
      <div style={{ position: "absolute", left: w / 2, top: 120, transform: `translateX(-50%) scale(${p})`, fontFamily: "Oswald", fontWeight: 700, fontSize: 90, color: "white", WebkitTextStroke: `12px ${INK}`, paintOrder: "stroke fill" }}>5 cm</div>
    </div>
  );
};

const SHook: React.FC = () => {
  const id = "hook";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fMide = wf(id, "mide");
  const fDisp = wf(id, "dispara");
  const fBurb = wf(id, "burbujas");
  const fSol = wf(id, "Sol.");
  const t = tip();
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 2.0, 1.75, clawF.x + 120, clawF.y],
            [fMide, 1.15, 1.25, 0, 380],
            [fDisp, 1.6, 1.7, clawF.x + 120, clawF.y],
            [fSol, 1.05, 1.1, 120, 60],
          ],
          end,
        )}
        shakeAt={[2, fDisp + 4, fBurb + 6]}
      >
        <Reef />
        <At x={S.x} y={S.y} from="none">
          <Shrimp height={S.h} open={clawOpen(f, fDisp - 10, fDisp + 4) + (f < 2 ? 1 : 0)} expr={f > fSol ? "smug" : "angry"} />
        </At>
        <Ruler at={fMide + 4} x={S.x - sw / 2 + 60} y={S.y + 20} w={sw * 0.8} />
        <Jet x={t.x} y={t.y} at={2} />
        <Jet x={t.x} y={t.y} at={fDisp + 4} />
        <CavBubble x={t.x + 200} y={t.y} at={fDisp + 6} collapse={fBurb + 6} r={120} />
        <Shock x={t.x + 200} y={t.y} at={fBurb + 6} />
        <Burst x={t.x + 200} y={t.y} at={fBurb + 6} until={fSol} r={220} />
        {f >= fSol && (
          <At x={820} y={900} at={fSol} z={6000}>
            <Planet kind="sun" r={210} spin={f / 30} face expr="surprised" />
          </At>
        )}
        <Tag text="≈" x={600} y={780} at={fSol + 6} size={110} color="#ffffff" />
      </Cam>
      <Flash at={1} dur={9} />
      <Flash at={fBurb + 6} color="#fff6b0" dur={8} />
      <HookTitle lines={["ESTE BICHO DE 5 CM", "DISPARA 4700°C"]} hi={1} at={0} until={end - 4} top={150} />
      <Grade tint="rgba(80,170,255,0.12)" vig={0.6} />
      <Sfx at={0} src="snap" vol={0.7} />
      <Sfx at={1} src="boom" vol={0.45} />
      <Sfx at={fDisp + 4} src="snap" vol={0.7} />
      <Sfx at={fBurb + 6} src="boom" vol={0.5} />
      <Sfx at={fSol} src="ding" vol={0.3} />
    </>
  );
};

const SPinza: React.FC = () => {
  const id = "pinza";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fPist = wf(id, "pistola.");
  const fPinza = wf(id, "pinza");
  const fMedio = wf(id, "medio");
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.0, 1.1, 0, 200],
            [fPinza, 1.45, 1.6, clawF.x + 60, clawF.y],
            [fMedio, 1.15, 1.2, 0, 300],
          ],
          end,
        )}
      >
        <Reef />
        <At x={S.x} y={S.y} from="right" at={0}>
          <Shrimp height={S.h} open={f > fPinza ? 0.5 + 0.5 * Math.sin(f / 4) : 0} expr={f > fPinza ? "smug" : "happy"} swim={f < 12} />
        </At>
        <Tag text="CAMARÓN PISTOLA" x={540} y={560} at={fPist - 4} color="#ff8e5e" size={84} />
        {f > fMedio && (
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, zIndex: 5800 }}>
            <path d={`M${S.x - sw / 2 + 60 * k} ${S.y + 60} l0 30 L${S.x - sw / 2 + 410 * k} ${S.y + 90} l0 -30`} stroke="white" strokeWidth="10" fill="none" />
            <path d={`M${S.x - sw / 2 + 410 * k} ${S.y + 90} L${S.x - sw / 2 + 730 * k} ${S.y + 90} l0 -30`} stroke="#ffd23f" strokeWidth="10" fill="none" />
          </svg>
        )}
        <Tag text="= ½ CUERPO" x={720} y={S.y + 200} at={fMedio + 2} color="#ffd23f" size={70} />
      </Cam>
      <Grade tint="rgba(80,170,255,0.12)" />
      <Sfx at={2} src="whoosh" vol={0.35} />
      <Sfx at={fPist - 4} src="pop" vol={0.4} />
      <Sfx at={fMedio + 2} src="pop" vol={0.35} />
    </>
  );
};

const SChorro: React.FC = () => {
  const id = "chorro";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fCierra = wf(id, "cierra");
  const fGolpe = wf(id, "golpe,");
  const fChorro = wf(id, "chorro");
  const fCien = wf(id, "cien");
  const t = tip();
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.7, 1.85, clawF.x + 40, clawF.y],
            [fGolpe + 3, 1.25, 1.3, clawF.x + 180, clawF.y],
            [fCien, 1.0, 1.06, 0, 0],
          ],
          end,
        )}
        shakeAt={[fGolpe + 3]}
      >
        <Reef />
        <At x={S.x} y={S.y} from="none">
          <Shrimp height={S.h} open={clawOpen(f, fCierra - 14, fGolpe + 3)} expr="angry" />
        </At>
        <Jet x={t.x} y={t.y} at={fGolpe + 3} len={800} />
        <Jet x={t.x} y={t.y} at={fChorro} len={800} />
        {/* speed lines */}
        {f > fChorro && (
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, zIndex: 5000 }}>
            {Array.from({ length: 14 }).map((_, i) => {
              const x = ((f * 60 + i * 140) % 1400) - 200;
              return <line key={i} x1={x} x2={x + 220} y1={300 + i * 110} y2={300 + i * 110} stroke="white" strokeWidth="6" opacity="0.5" strokeLinecap="round" />;
            })}
          </svg>
        )}
        <BigCount x={540} y={620} at={fCien - 4} from={0} to={100} dur={18} suffix=" km/h" size={150} color="#9fe6ff" />
      </Cam>
      <Flash at={fGolpe + 3} dur={5} />
      <Grade tint="rgba(80,170,255,0.12)" />
      <Sfx at={fGolpe + 3} src="snap" vol={0.75} />
      <Sfx at={fChorro} src="whoosh" vol={0.45} />
      <Sfx at={fCien} src="ding" vol={0.3} />
    </>
  );
};

const SBurbuja: React.FC = () => {
  const id = "burbuja";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fBurb = wf(id, "burbuja");
  const fRev = wf(id, "revienta.");
  const fInst = wf(id, "instante,");
  const fNum = wf(id, "4700");
  const fDest = wf(id, "destello");
  const bx = 540;
  const by = 900;
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.0, 1.08, 0, -60],
            [fRev + 2, 1.35, 1.5, 0, -60],
            [fNum - 4, 1.0, 1.05, 0, 0],
            [fDest, 1.4, 1.55, 0, -60],
          ],
          end,
        )}
        shakeAt={[fRev + 2, fDest]}
      >
        <Reef dark={interpolate(f, [fInst - 6, fInst + 6], [0, 0.55], clamp)} />
        <CavBubble x={bx} y={by} at={fBurb - 4} collapse={fRev + 2} r={300} />
        <Shock x={bx} y={by} at={fRev + 2} n={4} max={1100} />
        <CavBubble x={bx} y={by} at={fNum - 30} collapse={fDest} r={200} />
        <Burst x={bx} y={by} at={fDest} until={end + 10} r={360} />
        {f > fNum - 4 && <Thermo at={fNum - 4} x={110} y={560} to={4700} max={5600} dur={34} />}
        {f > fNum + 20 && (
          <At x={860} y={760} at={fNum + 20} z={6000}>
            <Planet kind="sun" r={140} spin={f / 30} face expr="worried" />
          </At>
        )}
        <Tag text="SOL ≈ 5500°C" x={860} y={820} at={fNum + 24} color="#ffd23f" size={58} rot={3} />
      </Cam>
      <Flash at={fRev + 2} dur={6} />
      <Flash at={fDest} color="#fff6b0" dur={14} />
      <Grade tint="rgba(80,170,255,0.1)" vig={0.7} />
      <Sfx at={fBurb - 4} src="burbujas" vol={0.4} />
      <Sfx at={fRev + 2} src="boom" vol={0.55} />
      <Sfx at={fNum - 4} src="riser" vol={0.3} />
      <Sfx at={fDest} src="boom" vol={0.45} />
    </>
  );
};

const SPresa: React.FC = () => {
  const id = "presa";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fOnda = wf(id, "onda");
  const fAtur = wf(id, "aturdidos");
  const fCang = wf(id, "cangrejos.");
  const fCaza = wf(id, "caza,");
  const P = { x: 300, y: 1620, h: 380 };
  const pt = tip(P);
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.0, 1.08, 0, 160],
            [fAtur, 1.4, 1.5, 230, -40],
            [fCang, 1.35, 1.45, 230, 520],
            [fCaza, 1.25, 1.3, -120, 360],
          ],
          end,
        )}
        shakeAt={[fOnda]}
      >
        <Reef />
        <At x={P.x} y={P.y} from="none">
          <Shrimp height={P.h} open={clawOpen(f, 0, fOnda)} expr={f > fCaza ? "smug" : "angry"} />
        </At>
        <Shock x={pt.x} y={pt.y} at={fOnda} n={4} max={1000} color="#e9fbff" />
        {[
          [780, 900, "#ffd23f", 0],
          [880, 1180, "#7fd6ff", 1],
          [700, 1250, "#ff8fb0", 2],
        ].map(([x, y, c, i]) => {
          const st = f > fAtur + (i as number) * 3;
          const drift = st ? Math.sin(f / 18 + (i as number)) * 8 : Math.sin(f / 10 + (i as number)) * 30;
          return (
            <At key={i as number} x={(x as number) + drift} y={(y as number) - (st ? interpolate(f, [fAtur, end], [0, 120]) : 0)} from="right" at={(i as number) * 3}>
              <Fish height={190} color={c as string} stunned={st} flip seed={i as number} />
            </At>
          );
        })}
        <At x={830} y={1640} from="none">
          <Crab height={240} stunned={f > fCang} />
        </At>
        <Tag text="¡KO!" x={800} y={700} at={fAtur + 4} color="#ff5a5a" size={110} rot={8} />
      </Cam>
      <Flash at={fOnda} dur={5} />
      <Grade tint="rgba(80,170,255,0.12)" />
      <Sfx at={fOnda} src="snap" vol={0.7} />
      <Sfx at={fOnda + 1} src="boom" vol={0.35} />
      <Sfx at={fAtur + 4} src="pop" vol={0.4} />
    </>
  );
};

const SSonar: React.FC = () => {
  const id = "sonar";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fRuido = wf(id, "ruido,");
  const fSeg = wf(id, "Segunda");
  const fSonar = wf(id, "sonar");
  const colony = [
    [180, 1700, 0],
    [520, 1780, 1],
    [860, 1720, 2],
    [340, 1880, 3],
    [720, 1900, 4],
  ];
  const noise = interpolate(f, [fSonar - 4, fSonar + 30], [0.05, 1], clamp);
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.1, 1.18, 0, 620],
            [fSeg, 1.0, 1.06, 0, -80],
            [fSonar, 1.0, 1.0, 0, 0],
          ],
          end,
        )}
        shakeAt={[fRuido, fRuido + 9, fRuido + 17]}
      >
        <Reef />
        {f < fSonar &&
          colony.map(([x, y, i]) => (
            <At key={i} x={x} y={y} from="none">
              <Shrimp height={200} open={((f + i * 5) % 12) < 8 ? 1 : 0} seed={i} expr="angry" flip={i % 2 === 1} />
            </At>
          ))}
        {f > fRuido &&
          f < fSonar &&
          colony.map(([x, y, i]) => <Shock key={i} x={x + (i % 2 ? -110 : 110)} y={y - 120} at={fRuido + ((i * 7) % 24)} n={2} max={260} color="#e9fbff" />)}
        {f > fSeg && f < fSonar && (
          <At x={interpolate(f, [fSeg, fSonar], [-200, 620])} y={900} from="none" z={4000}>
            <Submarine width={720} />
          </At>
        )}
        <Tag text="II GUERRA MUNDIAL" x={540} y={420} at={fSeg} color="#c9d2da" size={72} until={fSonar - 1} />
        {f >= fSonar && (
          <div style={{ position: "absolute", left: 540 - 380, top: 960 - 380, zIndex: 7000 }}>
            <Sonar size={760} noise={noise} />
          </div>
        )}
        <Tag text="¡CRACK! ¡CRACK!" x={540} y={1300} at={fRuido + 4} color="#ffffff" size={80} rot={-5} until={fSeg - 1} />
      </Cam>
      <Grade tint={f >= fSonar ? "rgba(60,255,120,0.12)" : "rgba(80,170,255,0.12)"} vig={0.72} />
      {[0, 9, 17].map((d) => (
        <Sfx key={d} at={fRuido + d} src="snap" vol={0.5} />
      ))}
      <Sfx at={fSonar - 6} src="sonar" vol={0.5} />
      <Sfx at={fSonar + 14} src="glitch" vol={0.3} />
    </>
  );
};

const SPierde: React.FC = () => {
  const id = "pierde";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fLoco = wf(id, "loco:");
  const fPierde = wf(id, "pierde");
  const fPeq = wf(id, "pequeña");
  const fCrece = wf(id, "crece…");
  const fPist = wf(id, "pistola.");
  const big = f < fPierde + 4 ? 1 : interpolate(f, [fPist + 8, fPist + 30], [0, 0.38], clamp);
  const small = interpolate(f, [fCrece, fCrece + 24], [0.38, 1.05], clamp);
  const t = tip();
  // detached claw flying away
  const off = f > fPierde + 4 ? f - fPierde - 4 : -1;
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.3, 1.4, 0, 200],
            [fLoco, 2.0, 2.1, face.x, face.y],
            [fPierde, 1.2, 1.25, 120, 200],
            [fPeq, 1.6, 1.7, clawF.x - 20, clawF.y + 80],
            [fPist, 1.15, 1.2, 120, 160],
          ],
          end,
        )}
        shakeAt={[fPierde + 4, fPist + 2]}
      >
        <Reef />
        <At x={S.x} y={S.y} from="none">
          <Shrimp height={S.h} big={big} small={small} open={0} expr={f < fPierde + 4 ? "surprised" : f < fCrece ? "worried" : "smug"} />
        </At>
        {off >= 0 && off < 50 && (
          <div style={{ position: "absolute", left: t.x - 250 + off * 14, top: t.y - 120 - off * 10 + off * off * 0.35, transform: `rotate(${off * 14}deg)`, zIndex: 5000, opacity: 1 - off / 50 }}>
            <svg width={340} height={180} viewBox="-20 -80 360 180" style={{ overflow: "visible" }}>
              <ellipse cx="150" cy="0" rx="98" ry="56" fill="#ff8e5e" stroke={INK} strokeWidth="9" />
              <path d="M225 18 Q285 30 318 8 Q290 46 225 44 Z" fill="#ffe0c8" stroke={INK} strokeWidth="8" />
              <path d="M215 -38 Q290 -48 326 2 Q282 -8 222 -2 Z" fill="#ffe0c8" stroke={INK} strokeWidth="8" />
            </svg>
          </div>
        )}
        <Tag text="¡NUEVA PISTOLA!" x={540} y={560} at={fPist} color="#ffd23f" size={86} />
        {f > fCrece && f < fPist && (
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, zIndex: 5600 }}>
            {[0, 1, 2].map((i) => {
              const y = 1300 - ((f - fCrece) * 6 + i * 40) % 120;
              return <path key={i} d={`M${700 + i * 60} ${y} l-24 30 l48 0 Z`} fill="#7dff9f" stroke={INK} strokeWidth="5" />;
            })}
          </svg>
        )}
      </Cam>
      <Flash at={fPist + 2} dur={6} />
      <Grade tint="rgba(80,170,255,0.12)" />
      <Sfx at={fLoco} src="gasp" vol={0.35} />
      <Sfx at={fPierde + 4} src="pop" vol={0.55} />
      <Sfx at={fCrece} src="riser" vol={0.3} />
      <Sfx at={fPist + 2} src="snap" vol={0.7} />
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
      <Cam keys={shots([[0, 1.25, 1.35, 0, 200], [fCom, 1.05, 1.08, 0, 160]], end)}>
        <Reef />
        <At x={S.x} y={S.y} from="none">
          <Shrimp height={S.h} open={0.5 + 0.5 * Math.sin(f / 5)} expr="happy" />
        </At>
        <At x={850} y={1000} from="right" at={6}>
          <Fish height={170} color="#7fd6ff" flip seed={4} />
        </At>
        <At x={200} y={900} from="left" at={10}>
          <Fish height={150} color="#ffd23f" seed={5} />
        </At>
      </Cam>
      <Tag text="¿QUÉ ANIMAL SIGUE?" x={540} y={420} at={4} color="#ffffff" size={86} />
      <Grade tint="rgba(80,170,255,0.12)" />
      <Sfx at={4} src="pop" vol={0.35} />
    </>
  );
};

const SCENES: Record<string, React.FC> = { hook: SHook, pinza: SPinza, chorro: SChorro, burbuja: SBurbuja, presa: SPresa, sonar: SSonar, pierde: SPierde, outro: SOutro };

export const CAMARON_FRAMES = T.total;
export const Camaron: React.FC = () => <NarratedVideo voz={voz} order={ORDER} tail={TAIL} scenes={SCENES} folder="voz_camaron" music="musica_mar.wav" musicVol={0.14} progress="#ffd23f" />;
