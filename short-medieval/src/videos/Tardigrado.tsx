import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame } from "remotion";
import voz from "./voz_tardigrado.json";
import { INK } from "../Characters";
import { At, makeTiming, Sfx } from "../kit";
import { CamPro, NarratedVideo2, Pow, Reaction, react } from "../kit2";
import type { Move } from "../kit2";
import { BigCount, Flash, HookTitle, Tag, Thermo } from "../Scenery3";
import { Tardigrade, tardiFace } from "../creatures";
import { Capsule, Garden, IceBlock, IceCave, Lab, Lander, Microscope, Moon, MossWorld, ReefPro, Space } from "../worlds";

const ORDER = ["hook", "conoce", "bolita", "extremos", "espacio", "hielo", "luna", "outro"];
const TAIL = { outro: 30 };
const T = makeTiming(voz, ORDER, TAIL);
const wf = T.wf;
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const D = { x: 540, y: 1560, h: 520 };
const FACE = tardiFace(D.x, D.y, D.h);
const fo = (p: { x: number; y: number }, dx = 0, dy = 0) => ({ x: p.x - 540 + dx, y: p.y - 960 + dy });
const whip = (t: number, s: number, y: number, dir = 1): Move[] => [
  { t, s, x: 420 * dir, y, ease: "whip", dur: 6 },
  { t: t + 6, s, x: -420 * dir, y, ease: "cut" },
  { t: t + 7, s, x: 0, y, ease: "whip", dur: 8 },
];

const Float: React.FC<{ children: React.ReactNode; amp?: number; seed?: number }> = ({ children, amp = 26, seed = 0 }) => {
  const f = useCurrentFrame() + seed * 20;
  return <div style={{ transform: `translateY(${Math.sin(f / 20) * amp}px) rotate(${Math.sin(f / 31) * 5}deg)` }}>{children}</div>;
};

const Grade2: React.FC<{ tint?: string; vig?: number }> = ({ tint, vig = 0.5 }) => (
  <>
    {tint && <AbsoluteFill style={{ background: tint, mixBlendMode: "multiply", zIndex: 9000, pointerEvents: "none" }} />}
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 62% at 50% 45%, rgba(0,0,0,0) 50%, rgba(3,10,25,${vig}) 100%)`, zIndex: 9001, pointerEvents: "none" }} />
  </>
);

/* ------------------------------------------------------------------ icons */
const Icon: React.FC<{ kind: "fuego" | "hielo" | "radiacion" | "yunque"; size?: number }> = ({ kind, size = 200 }) => {
  const f = useCurrentFrame();
  return (
    <svg width={size} height={size} viewBox="-100 -100 200 200" style={{ overflow: "visible" }}>
      {kind === "fuego" && (
        <g>
          <path d={`M0 90 Q-80 60 -60 -10 Q-40 20 -30 -20 Q-20 -80 ${10 + Math.sin(f / 3) * 8} -95 Q20 -40 50 -40 Q80 20 60 60 Q40 95 0 90 Z`} fill="#ff6a2a" stroke={INK} strokeWidth="9" strokeLinejoin="round" />
          <path d="M0 80 Q-35 60 -25 20 Q-10 35 0 0 Q20 30 30 30 Q40 70 0 80 Z" fill="#ffd23f" />
        </g>
      )}
      {kind === "hielo" && (
        <g>
          <rect x="-70" y="-70" width="140" height="140" rx="22" fill="#bfe9ff" stroke={INK} strokeWidth="9" />
          <path d="M-45 -45 L-10 -45 L-45 -10 Z" fill="white" />
          <path d="M20 10 l20 20 l-10 25" stroke="white" strokeWidth="6" fill="none" />
        </g>
      )}
      {kind === "radiacion" && (
        <g transform={`rotate(${f * 4})`}>
          <circle r="90" fill="#ffd23f" stroke={INK} strokeWidth="9" />
          {[0, 120, 240].map((a) => (
            <path key={a} d="M0 0 L-30 -60 A68 68 0 0 1 30 -60 Z" fill={INK} transform={`rotate(${a}) translate(0 -6)`} />
          ))}
          <circle r="16" fill={INK} stroke="#ffd23f" strokeWidth="6" />
        </g>
      )}
      {kind === "yunque" && (
        <g>
          <path d="M-90 -40 L60 -40 Q95 -40 95 -15 L40 -10 L30 20 L50 60 L-50 60 L-30 20 L-40 -10 L-90 -15 Z" fill="#5a6270" stroke={INK} strokeWidth="9" strokeLinejoin="round" />
          <path d="M-70 -30 L40 -30" stroke="#aab4c0" strokeWidth="8" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
};

/* ------------------------------------------------------------------ HOOK */
const SHook: React.FC = () => {
  const id = "hook";
  const f = useCurrentFrame();
  const fEsp = wf(id, "espacio…");
  const fNada = wf(id, "nada");
  const fMat = wf(id, "matarlo.");
  const P = { x: 540, y: 1250, h: 520 };
  const face = tardiFace(P.x, P.y, P.h);
  const hazards: ["fuego" | "hielo" | "radiacion" | "yunque", number, number][] = [
    ["fuego", -1, 0],
    ["hielo", 1, 4],
    ["radiacion", -1, 8],
    ["yunque", 1, 12],
  ];
  return (
    <>
      <CamPro
        moves={[
          { t: 0, s: 2.7, ...fo(face, 0, 10) },
          { t: 4, s: 1.25, x: 0, y: 120, ease: "snap" },
          { t: fEsp, s: 1.05, x: 0, y: 200, ease: "smooth", dur: 16 },
          { t: fNada - 2, s: 1.3, x: 0, y: 160, ease: "snap" },
          { ...react(fMat, face.x - 540, face.y - 960 + 30, 2.2, -3) },
        ]}
        shake={[fNada + 8, fNada + 12, fNada + 16, fNada + 20]}
      >
        <Space earthY={2050} earthR={760}>
          <At x={P.x} y={P.y} from="none">
            <Float>
              <Tardigrade height={P.h} helmet wave={f < fNada} expr={f > fMat ? "smug" : f > fNada ? "neutral" : "happy"} lookX={0.4} />
            </Float>
          </At>
        </Space>
      </CamPro>
      {hazards.map(([k, dir, d]) => {
        const t0 = fNada - 4 + d;
        const t = f - t0;
        if (t < 0 || t > 40) return null;
        const hitT = 10;
        const x = t < hitT ? 540 + dir * interpolate(t, [0, hitT], [800, 260]) : 540 + dir * (260 + (t - hitT) * 40);
        const y = t < hitT ? 900 : 900 - (t - hitT) * 30 + (t - hitT) * (t - hitT) * 1.2;
        return (
          <div key={k} style={{ position: "absolute", left: x - 100, top: y - 100, zIndex: 9200, transform: `rotate(${t * 15 * dir}deg)` }}>
            <Icon kind={k} size={200} />
          </div>
        );
      })}
      <Tag text="CASI INDESTRUCTIBLE" x={540} y={1120} at={fMat + 4} color="#ffd23f" size={74} />
      <HookTitle lines={["SOBREVIVIÓ", "AL ESPACIO"]} hi={1} until={fNada - 2} color="#7fd6ff" top={150} />
      <Grade2 />
      <Sfx at={0} src="zoom" vol={0.4} />
      {[8, 12, 16, 20].map((d) => (
        <Sfx key={d} at={fNada + d - 4 + 6} src="boing" vol={0.35} />
      ))}
      <Sfx at={fMat} src="zoom" vol={0.4} />
    </>
  );
};

/* ------------------------------------------------------------------ CONOCE */
const SConoce: React.FC = () => {
  const id = "conoce";
  const f = useCurrentFrame();
  const fTar = wf(id, "tardígrado,");
  const fOso = wf(id, "oso");
  const fMil = wf(id, "milímetro,");
  const fOcho = wf(id, "ocho");
  const fMusgo = wf(id, "musgo.");
  const fJard = wf(id, "jardín.");
  const garden = f >= fMusgo;
  const x = interpolate(f, [0, fOcho + 20], [260, 540], clamp);
  const face = tardiFace(x, D.y, D.h);
  const legs = [175, 275, 375, 465].map((vx) => ({ x: x - (D.h * 640) / 380 / 2 + vx * (D.h / 380), y: D.y - 20 }));
  return (
    <>
      <CamPro
        moves={
          garden
            ? [
                { t: fMusgo, s: 3.2, x: 0, y: 380 },
                { t: fMusgo + 1, s: 1.0, x: 0, y: 0, ease: "smooth", dur: 26 },
                { t: fJard, s: 1.25, x: 0, y: 340, ease: "snap" },
              ]
            : [
                { t: 0, s: 1.2, x: -60, y: 200, drift: 0.02 },
                { ...react(fTar - 2, face.x - 540, face.y - 960 + 40, 2.1, -3) },
                { t: fMil, s: 1.05, x: 0, y: 160, ease: "smooth", dur: 12 },
                { t: fOcho, s: 1.5, x: 0, y: 420, ease: "snap" },
              ]
        }
      >
        {!garden ? (
          <MossWorld>
            <At x={x} y={D.y} from="none">
              <Tardigrade height={D.h} walk={f < fOcho + 20 || f > fOcho + 40} expr={f > fTar && f < fMil ? "happy" : "neutral"} lookX={0.6} />
            </At>
          </MossWorld>
        ) : (
          <Garden />
        )}
      </CamPro>
      {!garden && f > fMil - 4 && <Microscope label="0,5 mm" o={interpolate(f, [fMil - 4, fMil + 4], [0, 1], clamp)} />}
      {!garden &&
        f >= fOcho &&
        legs.map((l, i) => (
          <Tag key={i} text={`${i * 2 + 1}·${i * 2 + 2}`} x={540 + (l.x - 540) * 1.5} y={960 + (l.y - 960 - 420) * 1.5 + 130} at={fOcho + i * 3} color="#ffd23f" size={54} />
        ))}
      <Tag text="TARDÍGRADO" x={540} y={460} at={fTar} color="#f6c9a8" size={96} until={fOso - 2} />
      <Tag text="«OSO DE AGUA»" x={540} y={460} at={fOso} color="#7fd6ff" size={90} until={fMil - 6} />
      <Tag text="MENOS DE 1 mm" x={540} y={360} at={fMil} color="#ffffff" size={76} until={fOcho - 2} />
      <Tag text="8 PATAS" x={540} y={360} at={fOcho + 2} color="#ffd23f" size={96} until={fMusgo - 1} />
      <Tag text="¿EN TU JARDÍN?" x={540} y={520} at={fJard} color="#7be07a" size={92} />
      <Reaction at={fJard + 2} mark="!" y={360} dur={20} />
      <Grade2 />
      <Sfx at={fTar - 2} src="zoom" vol={0.4} />
      <Sfx at={fMil - 4} src="whoosh" vol={0.35} />
      {[0, 3, 6, 9].map((d) => (
        <Sfx key={d} at={fOcho + d} src="pop" vol={0.3} />
      ))}
      <Sfx at={fMusgo} src="riser" vol={0.35} />
      <Sfx at={fJard} src="boing" vol={0.35} />
    </>
  );
};

/* ------------------------------------------------------------------ BOLITA */
const SBolita: React.FC = () => {
  const id = "bolita";
  const f = useCurrentFrame();
  const fFeas = wf(id, "feas,");
  const fExp = wf(id, "expulsa");
  const fEnc = wf(id, "encoge");
  const fBol = wf(id, "bolita…");
  const fPausa = wf(id, "pausa.");
  const dry = interpolate(f, [fFeas - 6, fExp + 10], [0, 1], clamp);
  const tun = interpolate(f, [fEnc, fBol + 6], [0, 1], clamp);
  const body = { x: D.x, y: D.y - D.h * 0.45 };
  const ps = spring({ frame: f - fPausa, fps: 30, config: { damping: 9 } });
  return (
    <>
      <CamPro
        moves={[
          { t: 0, s: 1.25, x: 0, y: 260, drift: 0.02 },
          { ...react(fFeas, FACE.x - 540, FACE.y - 960 + 40, 2.0, 3) },
          { t: fExp, s: 1.3, x: 0, y: 300, ease: "smooth", dur: 10 },
          { ...react(fBol, 0, 380, 2.1, -3) },
          { t: fPausa, s: 1.45, x: 0, y: 200, ease: "snap" },
        ]}
        shake={[fBol + 4]}
      >
        <MossWorld dry={dry}>
          <At x={D.x} y={D.y} from="none">
            <Tardigrade height={D.h} tun={tun} hot={dry * (1 - tun)} expr={tun > 0.6 ? "sleep" : f > fFeas ? "worried" : "happy"} />
          </At>
          {f > fExp &&
            f < fEnc + 20 &&
            Array.from({ length: 18 }).map((_, i) => {
              const t = (f - fExp - (i % 6) * 3) / 26;
              if (t < 0 || t > 1) return null;
              const a = random(`wa${i}`) * Math.PI * 2;
              const d = t * (300 + random(`wd${i}`) * 260);
              return (
                <svg key={i} width={60} height={70} viewBox="-30 -40 60 70" style={{ position: "absolute", left: body.x + Math.cos(a) * d - 30, top: body.y + Math.sin(a) * d * 0.7 - d * 0.3 + t * t * 300 - 35, zIndex: 3000, opacity: 1 - t }}>
                  <path d="M0 -34 Q22 0 16 14 Q0 30 -16 14 Q-22 0 0 -34 Z" fill="#7fd6ff" stroke={INK} strokeWidth="5" />
                  <ellipse cx="-5" cy="6" rx="5" ry="8" fill="white" opacity="0.8" />
                </svg>
              );
            })}
        </MossWorld>
      </CamPro>
      {f > fFeas - 6 && (
        <AbsoluteFill style={{ zIndex: 8990, pointerEvents: "none", background: `radial-gradient(circle at 85% 8%, rgba(255,240,150,${dry * 0.85}) 0%, rgba(255,180,60,${dry * 0.35}) 30%, rgba(0,0,0,0) 60%)` }} />
      )}
      <Tag text="−97% AGUA" x={540} y={470} at={fExp + 6} color="#7fd6ff" size={90} until={fBol - 2} />
      <Pow at={fBol + 4} text="¡BOLITA!" x={540} y={540} color="#f6c9a8" size={120} />
      {f >= fPausa && (
        <div style={{ position: "absolute", left: 540, top: 600, transform: `translate(-50%, -50%) scale(${ps})`, zIndex: 9300, display: "flex", gap: 40 }}>
          {[0, 1].map((i) => (
            <div key={i} style={{ width: 80, height: 240, background: "white", border: `14px solid ${INK}`, borderRadius: 18, boxShadow: "0 12px 0 rgba(0,0,0,0.35)" }} />
          ))}
        </div>
      )}
      {f >= fPausa &&
        [0, 1, 2].map((i) => {
          const t = ((f - fPausa + i * 12) % 40) / 40;
          return (
            <div key={i} style={{ position: "absolute", left: 700 + t * 120, top: 1000 - t * 200, zIndex: 9300, opacity: 1 - t, fontFamily: "Montserrat", fontWeight: 800, fontSize: 70 + i * 10, color: "white", WebkitTextStroke: `10px ${INK}`, paintOrder: "stroke fill" }}>
              Z
            </div>
          );
        })}
      <Grade2 />
      <Sfx at={fFeas} src="zoom" vol={0.35} />
      <Sfx at={fExp + 2} src="burbujas" vol={0.4} />
      <Sfx at={fBol + 4} src="boing" vol={0.45} />
      <Sfx at={fPausa} src="pop" vol={0.4} />
    </>
  );
};

/* ------------------------------------------------------------------ EXTREMOS */
const Flames: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, zIndex: 1400 }}>
      {Array.from({ length: 9 }).map((_, i) => {
        const x = -40 + i * 140;
        const h = 260 + Math.sin(f / 3 + i * 2) * 60 + (i % 2) * 80;
        return (
          <g key={i}>
            <path d={`M${x - 80} 1920 Q${x - 90} ${1920 - h * 0.6} ${x + Math.sin(f / 4 + i) * 20} ${1920 - h * 1.6} Q${x + 90} ${1920 - h * 0.6} ${x + 80} 1920 Z`} fill="#ff6a2a" stroke={INK} strokeWidth="8" />
            <path d={`M${x - 40} 1920 Q${x - 40} ${1920 - h * 0.4} ${x + Math.sin(f / 3 + i) * 12} ${1920 - h} Q${x + 40} ${1920 - h * 0.4} ${x + 40} 1920 Z`} fill="#ffd23f" />
          </g>
        );
      })}
    </svg>
  );
};
const Gauge: React.FC<{ at: number; x: number; y: number }> = ({ at, x, y }) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [at, at + 24], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const a = -130 + v * 260 + (v > 0.95 ? Math.sin(f * 1.8) * 4 : 0);
  return (
    <div style={{ position: "absolute", left: x - 170, top: y - 170, zIndex: 6000 }}>
      <svg width={340} height={340} viewBox="-170 -170 340 340">
        <circle r="150" fill="#f4f6f8" stroke={INK} strokeWidth="14" />
        {Array.from({ length: 11 }).map((_, i) => {
          const aa = ((-130 + i * 26 - 90) * Math.PI) / 180;
          return <line key={i} x1={Math.cos(aa) * 110} y1={Math.sin(aa) * 110} x2={Math.cos(aa) * 135} y2={Math.sin(aa) * 135} stroke={i > 7 ? "#d7263d" : INK} strokeWidth="8" />;
        })}
        <path d="M0 0 L0 -120" stroke="#d7263d" strokeWidth="12" strokeLinecap="round" transform={`rotate(${a})`} />
        <circle r="20" fill={INK} />
      </svg>
    </div>
  );
};

const SExtremos: React.FC = () => {
  const id = "extremos";
  const f = useCurrentFrame();
  const fTemp = wf(id, "temperaturas");
  const fCero = wf(id, "cero");
  const fCalor = wf(id, "calor");
  const fCien = wf(id, "cien");
  const fPres = wf(id, "presiones");
  const fSeis = wf(id, "seis");
  const fFondo = wf(id, "fondo");
  const st = f < fCalor - 1 ? 0 : f < fPres - 1 ? 1 : 2;
  const B = { x: 540, y: 1560, h: 420 };
  const squeeze = st === 2 ? interpolate(f, [fSeis, fSeis + 14], [1, 0.82], clamp) : 1;
  return (
    <>
      <CamPro
        moves={[
          { t: 0, s: 1.2, x: 0, y: 260 },
          { t: fCero, s: 1.55, x: 0, y: 380, ease: "snap" },
          ...whip(fCalor - 7, 1.2, 260),
          { t: fCien, s: 1.5, x: 0, y: 380, ease: "snap", r: 2 },
          ...whip(fPres - 7, 1.2, 260, -1),
          { t: fFondo, s: 1.6, x: 0, y: 380, ease: "snap", r: -2 },
        ]}
        shake={st === 2 ? [fSeis + 2] : []}
        free
      >
        {st === 0 && (
          <IceCave>
            <At x={B.x} y={B.y} from="none">
              <Tardigrade height={B.h} tun={1} cold={1} expr="sleep" />
            </At>
          </IceCave>
        )}
        {st === 1 && (
          <MossWorld dry={1}>
            <At x={B.x} y={B.y} from="none">
              <Tardigrade height={B.h} tun={1} hot={1} expr="sleep" />
            </At>
            <Flames />
          </MossWorld>
        )}
        {st === 2 && (
          <ReefPro dark={0.6} noFg>
            <At x={B.x} y={B.y} from="none">
              <div style={{ transform: `scale(${2 - squeeze}, ${squeeze})`, transformOrigin: "50% 100%" }}>
                <Tardigrade height={B.h} tun={1} expr="sleep" />
              </div>
            </At>
          </ReefPro>
        )}
      </CamPro>
      {st === 0 && <Thermo at={fTemp} x={760} y={430} to={-273} max={150} dur={26} scale={0.8} />}
      {st === 0 && <Tag text="CERO ABSOLUTO" x={360} y={480} at={fCero} color="#bfe9ff" size={62} />}
      {st === 1 && <Thermo at={fCalor} x={760} y={430} to={100} max={110} dur={20} scale={0.8} />}
      {st === 1 && <Tag text="+100 °C" x={340} y={480} at={fCien} color="#ff8e5e" size={90} />}
      {st === 2 && <Gauge at={fPres} x={760} y={520} />}
      {st === 2 && <Tag text="×6 FONDO DEL OCÉANO" x={540} y={300} at={fSeis} color="#7fd6ff" size={66} />}
      {st === 0 && <Sfx at={fTemp} src="hielo" vol={0.5} />}
      <Sfx at={fCalor - 7} src="whoosh" vol={0.5} />
      <Sfx at={fPres - 7} src="whoosh" vol={0.5} />
      <Sfx at={fSeis + 2} src="golpe" vol={0.45} />
      <Grade2 tint={st === 0 ? "rgba(160,210,255,0.25)" : st === 1 ? "rgba(255,150,90,0.25)" : undefined} vig={0.6} />
    </>
  );
};

/* ------------------------------------------------------------------ ESPACIO */
const Petri: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "relative", width: 900, height: 420 }}>
    <svg width={900} height={420} style={{ position: "absolute", inset: 0 }}>
      <ellipse cx="450" cy="250" rx="430" ry="150" fill="#d8f4ff" opacity="0.7" stroke={INK} strokeWidth="12" />
      <ellipse cx="450" cy="230" rx="400" ry="125" fill="#c6efc0" opacity="0.6" />
      <path d="M120 180 Q300 120 560 130" stroke="white" strokeWidth="14" fill="none" opacity="0.7" strokeLinecap="round" />
    </svg>
    <div style={{ position: "absolute", inset: 0 }}>{children}</div>
  </div>
);

const SEspacio: React.FC = () => {
  const id = "espacio";
  const f = useCurrentFrame();
  const fMand = wf(id, "mandaron");
  const fNing = wf(id, "ninguna");
  const fProt = wf(id, "protección.");
  const fVol = wf(id, "volvieron");
  const fVivos = wf(id, "vivos…");
  const fCrias = wf(id, "crías.");
  const lab = f >= fVol - 2;
  const open = interpolate(f, [fNing - 2, fNing + 10], [0, 1], clamp);
  const wake = interpolate(f, [fVivos - 4, fVivos + 12], [1, 0], clamp);
  return (
    <>
      <CamPro
        moves={
          lab
            ? [
                { t: fVol - 2, s: 1.3, x: 0, y: 280 },
                { ...react(fVivos + 4, 0, 200, 1.9, -3) },
                { t: fCrias - 2, s: 1.2, x: 0, y: 300, ease: "smooth", dur: 10 },
              ]
            : [
                { t: 0, s: 1.0, x: 0, y: -60, drift: 0.02 },
                { t: fMand, s: 1.25, x: 0, y: -40, ease: "smooth", dur: 20 },
                { t: fNing, s: 1.8, x: 0, y: -60, ease: "snap" },
              ]
        }
        shake={lab ? [] : [fProt]}
      >
        {!lab ? (
          <Space earthY={2100} earthR={900}>
            <div style={{ position: "absolute", left: 540 - 300, top: 900 - 300 + Math.sin(f / 20) * 14, transform: `rotate(${Math.sin(f / 40) * 6}deg)` }}>
              <Capsule open={open} size={600} />
            </div>
            {open > 0.3 &&
              [-50, 0, 50].map((dx, i) => (
                <div key={i} style={{ position: "absolute", left: 540 + dx - 45, top: 860 + (i % 2) * 8, zIndex: 1200 }}>
                  <Tardigrade height={60} tun={1} expr="sleep" seed={i} />
                </div>
              ))}
            {f > fProt - 4 && (
              <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, zIndex: 1300 }}>
                {Array.from({ length: 7 }).map((_, i) => {
                  const x0 = 100 + i * 140;
                  const p = ((f - fProt + i * 4) % 20) / 20;
                  return <polyline key={i} points={`${x0},0 ${x0 + 30},150 ${x0 - 20},300 ${x0 + 40 + (540 - x0) * 0.3},${400 + p * 400}`} fill="none" stroke="#c77dff" strokeWidth="10" opacity={0.8 - p * 0.5} />;
                })}
              </svg>
            )}
          </Space>
        ) : (
          <Lab>
            <div style={{ position: "absolute", left: 90, top: 1240 }}>
              <Petri>
                <div style={{ position: "absolute", left: 240, top: 0 }}>
                  <Tardigrade height={260} tun={wake} expr={wake < 0.4 ? "awe" : "sleep"} />
                </div>
                {f > fCrias &&
                  [0, 1, 2].map((i) => {
                    const s = spring({ frame: f - fCrias - i * 4, fps: 30, config: { damping: 8 } });
                    return (
                      <div key={i} style={{ position: "absolute", left: 80 + i * 260, top: 170, transform: `scale(${s})` }}>
                        <Tardigrade height={130} baby expr="happy" seed={i + 3} walk />
                      </div>
                    );
                  })}
              </Petri>
            </div>
          </Lab>
        )}
      </CamPro>
      <Tag text="AÑO 2007" x={540} y={330} at={2} color="#ffffff" size={80} until={fNing - 2} />
      <Tag text="SIN PROTECCIÓN" x={540} y={330} at={fNing} color="#ff5a5a" size={84} until={fVol - 4} />
      <Reaction at={fVivos + 4} mark="!" y={480} />
      <Tag text="¡VIVOS!" x={540} y={420} at={fVivos + 10} color="#7be07a" size={100} until={fCrias - 2} />
      <Pow at={fCrias + 2} text="¡Y CON CRÍAS!" x={540} y={460} size={96} color="#ffb3c8" />
      <Grade2 />
      <Sfx at={fMand} src="riser" vol={0.3} />
      <Sfx at={fNing} src="whoosh" vol={0.35} />
      <Sfx at={fProt} src="glitch" vol={0.3} />
      <Sfx at={fVivos + 4} src="zoom" vol={0.4} />
      {[0, 4, 8].map((d) => (
        <Sfx key={d} at={fCrias + d} src="pop" vol={0.35} />
      ))}
    </>
  );
};

/* ------------------------------------------------------------------ HIELO */
const SHielo: React.FC = () => {
  const id = "hielo";
  const f = useCurrentFrame();
  const fRev = wf(id, "revivir");
  const fTreinta = wf(id, "treinta");
  const fCong = wf(id, "congelados.");
  const melt = interpolate(f, [fRev, fRev + 30], [0, 1], clamp);
  const wake = interpolate(f, [fRev + 24, fRev + 40], [1, 0], clamp);
  return (
    <>
      <CamPro
        moves={[
          { t: 0, s: 1.4, x: 0, y: 330, drift: 0.03 },
          { t: fRev + 26, s: 1.7, x: 60, y: 380, ease: "smooth", dur: 14 },
          { ...react(fCong, 80, 260, 2.0, 3) },
        ]}
      >
        <IceCave>
          <div style={{ position: "absolute", left: 540 - 380, top: 1560 - 560 }}>
            <IceBlock w={760} h={560} melt={melt}>
              <div style={{ marginBottom: 20 }}>
                <Tardigrade height={430} tun={wake} cold={1 - melt} expr={wake < 0.3 ? (f > fCong ? "awe" : "happy") : "sleep"} wave={wake < 0.2} />
              </div>
            </IceBlock>
          </div>
        </IceCave>
      </CamPro>
      <Tag text="AÑO 2016" x={540} y={330} at={2} color="#ffffff" size={80} until={fTreinta - 4} />
      <BigCount x={540} y={520} at={fTreinta - 4} from={0} to={30} dur={20} suffix=" AÑOS" size={140} color="#bfe9ff" />
      <Reaction at={fCong} mark="!" y={760} dur={22} />
      <Grade2 tint="rgba(170,215,255,0.2)" />
      <Sfx at={2} src="hielo" vol={0.45} />
      <Sfx at={fRev} src="burbujas" vol={0.3} />
      <Sfx at={fTreinta - 4} src="riser" vol={0.3} />
      <Sfx at={fCong} src="zoom" vol={0.35} />
    </>
  );
};

/* ------------------------------------------------------------------ LUNA */
const SLuna: React.FC = () => {
  const id = "luna";
  const f = useCurrentFrame();
  const fLoco = wf(id, "loco:");
  const fNave = wf(id, "nave");
  const fEst = wf(id, "estrelló");
  const fMiles = wf(id, "miles");
  const crash = fEst + 4;
  const intro = f < fNave - 2;
  const lx = interpolate(f, [fNave - 2, crash], [-200, 560], clamp);
  const ly = interpolate(f, [fNave - 2, crash], [200, 1300], clamp);
  return (
    <>
      <CamPro
        moves={
          intro
            ? [
                { t: 0, s: 1.3, x: 0, y: 260 },
                { ...react(fLoco, FACE.x - 540, FACE.y - 960 + 40, 2.3, -4) },
              ]
            : [
                { t: fNave - 2, s: 1.0, x: 0, y: 0, ease: "cut" },
                { t: crash, s: 1.4, x: 20, y: 300, ease: "snap", r: 4 },
                { t: fMiles, s: 1.1, x: 0, y: 380, ease: "smooth", dur: 16 },
              ]
        }
        shake={[crash]}
        impact={[crash]}
      >
        {intro ? (
          <Garden>
            <At x={D.x} y={1700} from="none">
              <Tardigrade height={D.h} expr={f > fLoco ? "surprised" : "neutral"} />
            </At>
          </Garden>
        ) : (
          <Moon dust={interpolate(f, [crash, crash + 30], [0, 1], clamp)}>
            <div style={{ position: "absolute", left: lx - 250, top: ly - 250, zIndex: 1500 }}>
              <Lander size={500} flame={f < crash} wreck={f < crash ? 0 : 1} />
            </div>
            {f > fMiles &&
              Array.from({ length: 16 }).map((_, i) => {
                const s = spring({ frame: f - fMiles - i, fps: 30, config: { damping: 9 } });
                return (
                  <div key={i} style={{ position: "absolute", left: 60 + random(`tx${i}`) * 900, top: 1420 + random(`ty${i}`) * 420, transform: `scale(${s})`, zIndex: 1400 + i }}>
                    <Tardigrade height={70 + random(`ts${i}`) * 40} tun={1} expr="sleep" seed={i} />
                  </div>
                );
              })}
          </Moon>
        )}
      </CamPro>
      <Reaction at={fLoco} mark="!?" y={520} dur={18} />
      <Tag text="AÑO 2019" x={540} y={330} at={fNave} color="#ffffff" size={80} until={crash - 1} />
      <Pow at={crash} text="¡CRASH!" x={560} y={700} color="#ff8e5e" />
      <Tag text="MILES DE TARDÍGRADOS" x={540} y={420} at={fMiles + 4} color="#f6c9a8" size={70} />
      <Flash at={crash} dur={6} />
      <Grade2 vig={0.6} />
      <Sfx at={fLoco} src="zoom" vol={0.4} />
      <Sfx at={fNave - 2} src="riser" vol={0.35} />
      <Sfx at={crash} src="choque" vol={0.75} />
      <Sfx at={fMiles + 2} src="pop" vol={0.3} />
    </>
  );
};

/* ------------------------------------------------------------------ OUTRO */
const SOutro: React.FC = () => {
  const id = "outro";
  const f = useCurrentFrame();
  const fVivos = wf(id, "vivos");
  const fCom = wf(id, "comentarios.");
  const P = { x: 540, y: 1600, h: 480 };
  const face = tardiFace(P.x, P.y, P.h);
  return (
    <>
      <CamPro
        moves={[
          { t: 0, s: 1.1, x: 0, y: 200, drift: 0.02 },
          { ...react(fVivos, face.x - 540, face.y - 960 + 40, 2.0, 3) },
          { t: fCom - 4, s: 1.15, x: 0, y: 200, ease: "smooth", dur: 14 },
        ]}
      >
        <Moon>
          <At x={P.x} y={P.y} from="none">
            <Tardigrade height={P.h} helmet wave expr={f > fVivos ? "awe" : "happy"} lookX={-0.3} />
          </At>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: 80 + i * 170, top: 1720 + (i % 2) * 60, zIndex: 1300 }}>
              <Tardigrade height={80} tun={1} expr="sleep" seed={i} />
            </div>
          ))}
        </Moon>
      </CamPro>
      <Tag text="¿SIGUEN VIVOS?" x={540} y={420} at={4} color="#ffd23f" size={96} />
      <Grade2 vig={0.6} />
      <Sfx at={4} src="pop" vol={0.35} />
      <Sfx at={fVivos} src="zoom" vol={0.35} />
    </>
  );
};

const SCENES: Record<string, React.FC> = { hook: SHook, conoce: SConoce, bolita: SBolita, extremos: SExtremos, espacio: SEspacio, hielo: SHielo, luna: SLuna, outro: SOutro };
const HI = ["espacio…", "matarlo.", "tardígrado,", "milímetro,", "ocho", "jardín.", "bolita…", "pausa.", "absoluto,", "cien", "seis", "2007,", "vivos…", "crías.", "treinta", "Luna…", "miles", "vivos"];

export const TARDIGRADO_FRAMES = T.total;
export const TardigradoVideo: React.FC = () => <NarratedVideo2 voz={voz} order={ORDER} tail={TAIL} scenes={SCENES} folder="voz_tardigrado" music="musica_micro.wav" musicVol={0.14} hi={HI} hiColor="#7fd6ff" transition="iris" transColor="#7be07a" progress="#7fd6ff" />;
