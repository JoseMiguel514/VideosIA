import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from "remotion";
import voz from "./voz_baile.json";
import { INK, Toon } from "../Characters";
import type { Expr, ToonProps } from "../Characters";
import { At, BG, Cam, Grade, headY, makeTiming, NarratedVideo, Sfx, shots, sw8 } from "../kit";
import { Banner, GothicWindow, Room, Sign, Stamp, Village, WallTorch } from "../Scenery";
import { CorkBoard, Polaroid } from "../Scenery2";
import { BigCount, Bounce, dance, Drum, Fall, HookTitle, Lute, Stage, Tag } from "../Scenery3";

const ORDER = ["hook", "troffea", "contagio", "idea", "escenario", "caidos", "causa", "outro"];
const TAIL = { outro: 26 };
const T = makeTiming(voz, ORDER, TAIL);
const wf = T.wf;
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const TROFFEA: ToonProps = { hair: "kerchief", hairColor: "#c0392b", outfit: "#5d7d38", outfit2: "#e9dfc9", lashes: true, robe: true, seed: 3 };
const LOOKS: ToonProps[] = [
  { hair: "bowl", hairColor: "#4a2c18", outfit: "#8a5d33", outfit2: "#e9dfc9" },
  { hair: "long", hairColor: "#e0b04a", outfit: "#a3202c", outfit2: "#f4efe6", lashes: true, robe: true },
  { hair: "hood", hairColor: "#7d6248", outfit: "#5d7d38", outfit2: "#e9dfc9" },
  { hair: "ponytail", hairColor: "#6b3a1e", outfit: "#2f4f8f", outfit2: "#f4efe6", lashes: true },
  { hair: "bald", beard: "#8f8a86", outfit: "#d98a2b", outfit2: "#e9dfc9" },
  { hair: "curly", hairColor: "#2a1a12", outfit: "#7a4b8f", outfit2: "#f4efe6" },
  { hair: "spiky", hairColor: "#c96a1a", outfit: "#3f7d5a", outfit2: "#e9dfc9" },
  { hair: "kerchief", hairColor: "#2f4f8f", outfit: "#b5523b", outfit2: "#f4efe6", lashes: true, robe: true },
];
const D = { x: 540, y: 2060, h: 1400 };

/** One frantic dancer */
const Dancer: React.FC<{ x: number; y: number; h: number; i: number; expr?: Expr; at?: number; tired?: number; look?: ToonProps; amp?: number }> = ({ x, y, h, i, expr = "worried", at = 0, tired = 0, look, amp }) => {
  const f = useCurrentFrame();
  return (
    <At x={x} y={y} at={at} from={at > 0 ? "pop" : "none"}>
      <Bounce seed={i} amp={amp ?? h * 0.05} tired={tired}>
        <Toon {...(look ?? LOOKS[i % LOOKS.length])} {...dance(f, i)} expr={expr} talking={false} height={h} seed={i + 20} />
      </Bounce>
    </At>
  );
};

/** grid of dancers that appear progressively: count = how many are visible */
const Crowd: React.FC<{ count: number; rows?: number[]; h0?: number; tired?: number }> = ({ count, rows = [1250, 1420, 1600, 1800], h0 = 420, tired = 0 }) => {
  const items: React.ReactNode[] = [];
  let n = 0;
  rows.forEach((y, r) => {
    const h = h0 * (0.75 + r * 0.22);
    const per = Math.max(3, 7 - r);
    for (let c = 0; c < per; c++) {
      if (n >= count) return;
      const x = ((c + (r % 2 ? 0.5 : 0.25)) / per) * 1080 + Math.sin(n * 7.3) * 30;
      items.push(<Dancer key={n} x={x} y={y + Math.cos(n * 3.1) * 25} h={h} i={n} tired={tired} />);
      n++;
    }
  });
  return <>{items}</>;
};

/** sky flashing day/night to show days passing */
const DaysSky: React.FC<{ from: number; per: number }> = ({ from, per }) => {
  const f = useCurrentFrame();
  const k = Math.max(0, Math.floor((f - from) / per));
  const night = f > from && k % 2 === 1;
  return (
    <BG blur={2}>
      <Village night={night} evening={!night && f > from && k % 4 === 2} />
    </BG>
  );
};

const SHook: React.FC = () => {
  const id = "hook";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fCientos = wf(id, "cientos");
  const fParar = wf(id, "parar.");
  const fNadie = wf(id, "nadie");
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.9, 2.05, 0, headY(D.y, D.h) + 40],
            [fCientos, 1.0, 1.08, 0, 220],
            [fParar, 1.35, 1.45, 0, 380],
            [fNadie, 1.7, 1.85, 0, headY(D.y, D.h) + 60],
          ],
          end,
        )}
        shakeAt={[fCientos, fNadie]}
      >
        <BG blur={2}>
          <Village night />
        </BG>
        {f >= fCientos && f < fNadie && <Crowd count={18} />}
        {(f < fCientos || f >= fNadie) && (
          <At x={D.x} y={D.y} from="none">
            <Bounce seed={1} amp={60}>
              <Toon {...TROFFEA} {...dance(f, 1, 7)} expr="worried" height={D.h} />
            </Bounce>
          </At>
        )}
        <Tag text="¿POR QUÉ?" x={540} y={1250} at={fNadie + 6} color="#ff5a5a" size={110} rot={4} />
      </Cam>
      <HookTitle lines={["EPIDEMIA REAL · 1518", "NO PODÍAN PARAR"]} hi={1} at={0} until={fNadie - 2} color="#ff5a5a" top={150} />
      <Grade tint="rgba(90,110,200,0.4)" vig={0.78} />
      <Sfx at={0} src="tambor" vol={0.6} />
      <Sfx at={fCientos} src="tambor" vol={0.6} />
      <Sfx at={fNadie} src="riser" vol={0.3} />
    </>
  );
};

const STroffea: React.FC = () => {
  const id = "troffea";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fEstr = wf(id, "Estrasburgo,");
  const fFrau = wf(id, "Frau");
  const fSalio = wf(id, "Salió");
  const fDias = wf(id, "días,");
  const fMusica = wf(id, "música");
  const per = 9;
  const day = Math.min(6, 1 + Math.floor(Math.max(0, f - fDias) / (per * 2)));
  const dancing = f >= fSalio;
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.0, 1.08, 0, 0],
            [fFrau, 1.6, 1.75, 0, headY(D.y, D.h) + 80],
            [fSalio, 1.1, 1.18, 0, 260],
            [fMusica, 1.3, 1.4, 0, 120],
          ],
          end,
        )}
      >
        <DaysSky from={fDias} per={per} />
        <Sign text="ESTRASBURGO" sub="JULIO DE 1518" y={fEstr > f ? 70 : 70} color="#5b3420" glow={false} w={640} />
        <At x={D.x} y={D.y} from={f < fFrau ? "none" : "none"}>
          {dancing ? (
            <Bounce seed={2} amp={70}>
              <Toon {...TROFFEA} {...dance(f, 2, 8)} expr={f > fDias + 30 ? "worried" : "happy"} height={D.h} />
            </Bounce>
          ) : (
            <Toon {...TROFFEA} pose="hips" expr="neutral" talking={false} height={D.h} />
          )}
        </At>
        <Tag text="FRAU TROFFEA" x={540} y={560} at={fFrau} color="#ffcf4a" size={84} until={fSalio - 1} />
        {f >= fDias && <Tag text={`DÍA ${day}`} x={820} y={560} at={fDias} color="#ffffff" size={96} rot={4} />}
        {f >= fMusica && (
          <div style={{ position: "absolute", left: 140, top: 480, zIndex: 6000, transform: `scale(${spring({ frame: f - fMusica, fps: 30, config: { damping: 10 } })})` }}>
            <svg width={260} height={260} viewBox="0 0 260 260">
              <circle cx="130" cy="130" r="115" fill="white" stroke={INK} strokeWidth="10" />
              <path d="M110 180 a28 22 0 1 1 0 -2 L110 60 L180 45 L180 160 a28 22 0 1 1 0 -2" fill={INK} stroke={INK} strokeWidth="10" />
              <line x1="50" y1="50" x2="210" y2="210" stroke="#d7263d" strokeWidth="22" strokeLinecap="round" />
            </svg>
          </div>
        )}
      </Cam>
      <Grade tint="rgba(220,170,120,0.2)" />
      <Sfx at={fFrau} src="pop" vol={0.35} />
      <Sfx at={fSalio} src="tambor" vol={0.5} />
      <Sfx at={fMusica} src="pop" vol={0.35} />
    </>
  );
};

const SContagio: React.FC = () => {
  const id = "contagio";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fSem = wf(id, "semana,");
  const fTreinta = wf(id, "treinta.");
  const fMes = wf(id, "mes,");
  const fCuat = wf(id, "cuatrocientas");
  const count = f < fMes ? Math.round(interpolate(f, [fSem, fTreinta + 6], [1, 9], clamp)) : Math.round(interpolate(f, [fMes, fCuat + 10], [9, 22], clamp));
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.25, 1.35, 0, 420],
            [fMes, 1.0, 1.06, 0, 200],
          ],
          end,
        )}
        shakeAt={[fCuat + 2]}
      >
        <BG blur={2}>
          <Village evening />
        </BG>
        <Crowd count={count} />
        {f < fMes && <BigCount x={540} y={520} at={fSem} from={1} to={34} dur={fTreinta - fSem + 6} prefix="+" size={180} />}
        {f >= fMes && <BigCount x={540} y={760} at={fCuat - 4} from={34} to={400} dur={24} size={220} color="#ffd23f" />}
        <Tag text="1 SEMANA" x={540} y={330} at={fSem} color="#ffffff" size={64} until={fMes - 1} />
        <Tag text="1 MES" x={540} y={330} at={fMes} color="#ff5a5a" size={70} />
      </Cam>
      <Grade tint="rgba(220,140,120,0.25)" />
      <Sfx at={fSem} src="pop" vol={0.35} />
      <Sfx at={fMes} src="tambor" vol={0.6} />
      <Sfx at={fCuat} src="riser" vol={0.3} />
    </>
  );
};

const Bulb: React.FC<{ at: number; x: number; y: number }> = ({ at, x, y }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = spring({ frame: f - at, fps: 30, config: { damping: 8 } });
  return (
    <div style={{ position: "absolute", left: x - 110, top: y - 140, zIndex: 6000, transform: `scale(${s})` }}>
      <svg width={220} height={280} viewBox="0 0 220 280" style={{ overflow: "visible" }}>
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return <line key={i} x1={110 + Math.cos(a) * 120} y1={110 + Math.sin(a) * 120} x2={110 + Math.cos(a) * (150 + Math.sin(f / 3) * 10)} y2={110 + Math.sin(a) * (150 + Math.sin(f / 3) * 10)} stroke="#ffd23f" strokeWidth="12" strokeLinecap="round" />;
        })}
        <circle cx="110" cy="110" r="95" fill="#fff3a0" stroke={INK} strokeWidth="10" />
        <rect x="75" y="195" width="70" height="60" rx="10" fill="#aab4c0" stroke={INK} strokeWidth="9" />
      </svg>
    </div>
  );
};

const CouncilRoom: React.FC = () => (
  <BG>
    <Room wall="#3d4f8f" side="#28366a" floorA="#e9dcc0" floorB="#8a6a3a" trim="#2a1f4a">
      <GothicWindow x={440} y={330} w={200} h={360} />
      <Banner x={235} y={330} color="#a3202c" />
      <Banner x={715} y={330} color="#a3202c" />
      <WallTorch x={300} y={760} />
      <WallTorch x={780} y={760} />
    </Room>
  </BG>
);

const SIdea: React.FC = () => {
  const id = "idea";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fAut = wf(id, "autoridades");
  const fIdea = wf(id, "idea");
  const fBailar = wf(id, "bailar…");
  const fMas = wf(id, "más.");
  const M = { x: 540, y: 2040, h: 1350 };
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.0, 1.08, 0, 160],
            [fIdea, 1.5, 1.65, 0, headY(M.y, M.h) + 40],
            [fMas, 1.85, 2.0, 0, headY(M.y, M.h) + 60],
          ],
          end,
        )}
        shakeAt={[fMas]}
      >
        <CouncilRoom />
        {f < fIdea ? (
          <>
            <At x={260} y={1750} at={fAut - 6} from="left">
              <Toon hair="judge" hairColor="#b3242f" beard="#8f8a86" outfit="#a3202c" outfit2="#f4efe6" robe expr="worried" pose="hold" prop="scroll" height={1000} seed={2} />
            </At>
            <At x={820} y={1750} at={fAut - 2} from="right">
              <Toon hair="lawyer" hairColor="#2a2a35" outfit="#2a2a35" outfit2="#f4efe6" robe expr="worried" pose="shrug" height={1000} seed={5} flip />
            </At>
          </>
        ) : (
          <At x={M.x} y={M.y} from="none">
            <Toon hair="judge" hairColor="#b3242f" beard="#8f8a86" outfit="#a3202c" outfit2="#f4efe6" robe expr={f > fBailar ? "smug" : "happy"} talking {...sw8(f, fMas, "up", "point")} height={M.h} seed={2} />
          </At>
        )}
        <Bulb at={fIdea + 2} x={820} y={420} />
      </Cam>
      <Stamp text="¡QUE BAILEN MÁS!" at={fMas + 2} top={1180} size={86} />
      <Grade tint="rgba(200,200,255,0.15)" />
      <Sfx at={fIdea + 2} src="ding" vol={0.4} />
      <Sfx at={fMas + 2} src="mazo" vol={0.5} />
    </>
  );
};

const SEscenario: React.FC = () => {
  const id = "escenario";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fMus = wf(id, "músicos,");
  const fSal = wf(id, "salones,");
  const fEsc = wf(id, "escenario.");
  const fPeor = wf(id, "empeoró.");
  const drop = spring({ frame: f - fEsc, fps: 30, config: { damping: 10 } });
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.45, 1.55, -220, 380],
            [fSal, 1.0, 1.06, 0, 160],
            [fPeor, 1.15, 1.25, 0, 260],
          ],
          end,
        )}
        shakeAt={[fEsc + 4, fPeor]}
      >
        <BG blur={2}>
          <Village evening={f < fPeor} night={f >= fPeor} />
        </BG>
        {f >= fEsc && (
          <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - drop) * -1400}px)` }}>
            <Stage y={1400} w={1040} />
          </div>
        )}
        {/* musicians */}
        <At x={190} y={f >= fEsc ? 1290 : 1650} at={fMus - 4} z={1500}>
          <Toon hair="bowl" hairColor="#4a2c18" outfit="#a3202c" outfit2="#f3d27a" expr="happy" pose="hold" height={f >= fEsc ? 560 : 900} seed={31} />
        </At>
        <div style={{ position: "absolute", left: f >= fEsc ? 175 : 165, top: f >= fEsc ? 1100 : 1350, zIndex: 1600, transform: `scale(${f >= fEsc ? 0.6 : 1})`, opacity: f > fMus - 4 ? 1 : 0 }}>
          <Lute size={300} />
        </div>
        <At x={890} y={f >= fEsc ? 1290 : 1650} at={fMus} z={1500}>
          <Toon hair="hood" hairColor="#5d7d38" outfit="#2f4f8f" outfit2="#f4efe6" expr="happy" pose="gavel" height={f >= fEsc ? 560 : 900} seed={32} flip />
        </At>
        <div style={{ position: "absolute", left: f >= fEsc ? 650 : 560, top: f >= fEsc ? 1130 : 1420, zIndex: 1700, transform: `scale(${f >= fEsc ? 0.65 : 1})`, opacity: f > fMus ? 1 : 0 }}>
          <Drum size={260} />
        </div>
        {f >= fSal && <Crowd count={f >= fPeor ? 20 : 10} rows={[1550, 1720, 1880]} h0={460} />}
        <Tag text="+ MÚSICA = PEOR" x={540} y={520} at={fPeor} color="#ff5a5a" size={84} />
      </Cam>
      <Grade tint={f >= fPeor ? "rgba(255,90,90,0.25)" : "rgba(220,170,120,0.2)"} vig={0.7} />
      <Sfx at={fMus} src="pop" vol={0.35} />
      <Sfx at={fEsc + 4} src="tambor" vol={0.7} />
      <Sfx at={fPeor} src="gasp" vol={0.4} />
    </>
  );
};

const SCaidos: React.FC = () => {
  const id = "caidos";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fCayo = wf(id, "cayó");
  const fLev = wf(id, "levantarse.");
  const fall = [fCayo, fCayo + 5, fCayo + 10];
  const pos = [
    [260, 1700, 0],
    [540, 1800, 1],
    [820, 1700, 2],
  ];
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.05, 1.12, 0, 380],
            [fCayo + 2, 1.2, 1.3, 0, 480],
            [fLev, 1.4, 1.55, 0, 520],
          ],
          end,
        )}
        shakeAt={[fCayo + 14]}
      >
        <BG blur={2}>
          <Village night />
        </BG>
        {pos.map(([x, y, i]) => (
          <At key={i} x={x} y={y} from="none">
            <Fall at={fall[i]} dir={i % 2 ? -1 : 1}>
              <Bounce seed={i} amp={f < fall[i] ? 40 : 0} tired={f < fall[i] ? 0.8 : 1}>
                <Toon {...LOOKS[i + 1]} {...(f < fall[i] ? dance(f, i, 14) : { pose: "idle" as const })} expr="worried" height={760} seed={i + 40} />
              </Bounce>
            </Fall>
          </At>
        ))}
      </Cam>
      <AbsoluteFill style={{ background: "black", opacity: interpolate(f, [fLev, end], [0, 0.45], clamp), zIndex: 9600 }} />
      <Grade tint="rgba(70,80,160,0.5)" vig={0.85} />
      <Sfx at={fCayo + 14} src="tambor" vol={0.5} />
    </>
  );
};

const MiniToon: React.FC<{ look: ToonProps; expr?: Expr; pose?: ToonProps["pose"] }> = ({ look, expr = "worried", pose = "idle" }) => (
  <div style={{ position: "absolute", left: "50%", bottom: -170, transform: "translateX(-50%)" }}>
    <Toon {...look} expr={expr} pose={pose} height={520} />
  </div>
);

const SCausa: React.FC = () => {
  const id = "causa";
  const f = useCurrentFrame();
  const end = T.frames(id);
  const fMist = wf(id, "misterio.");
  const fTeo = wf(id, "teoría");
  const fHist = wf(id, "histeria");
  const fHambre = wf(id, "hambre");
  return (
    <>
      <Cam
        keys={shots(
          [
            [0, 1.0, 1.06, 0, 0],
            [fTeo, 1.0, 1.04, 0, 0],
            [fHist, 1.45, 1.55, 0, 380],
          ],
          end,
        )}
      >
        <CorkBoard />
        <Polaroid x={300} y={330} w={380} rot={-5} label="¿HONGO TÓXICO?" bg="#c9b2d8">
          <svg width={380} height={360} viewBox="0 0 380 360">
            <path d="M190 330 L190 180" stroke="#f4efe6" strokeWidth="60" />
            <path d="M60 190 Q190 40 320 190 Z" fill="#7a4b26" stroke={INK} strokeWidth="9" />
            {[0, 1, 2].map((i) => (
              <circle key={i} cx={120 + i * 70} cy={150 - (i % 2) * 20} r="14" fill="#f4efe6" />
            ))}
          </svg>
        </Polaroid>
        <Polaroid x={790} y={380} w={360} rot={6} label="¿MALDICIÓN?" bg="#d8b2b2">
          <MiniToon look={{ hair: "plague", outfit: "#1f1b22", outfit2: "#2e2830", robe: true }} />
        </Polaroid>
        {f >= fTeo - 4 && (
          <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - spring({ frame: f - fTeo + 4, fps: 30, config: { damping: 11 } })) * 900}px)` }}>
            <Polaroid x={540} y={980} w={500} rot={-2} label="HISTERIA COLECTIVA" bg="#b2d8c4">
              <div style={{ position: "absolute", left: 60, bottom: -110 }}>
                <Toon {...LOOKS[1]} {...dance(f, 1)} expr="worried" height={380} />
              </div>
              <div style={{ position: "absolute", left: 230, bottom: -120 }}>
                <Toon {...LOOKS[4]} {...dance(f, 4)} expr="worried" height={400} />
              </div>
            </Polaroid>
          </div>
        )}
        <Tag text="HAMBRE" x={260} y={1640} at={fHambre} color="#ffe066" size={70} rot={-6} />
        <Tag text="MIEDO" x={820} y={1640} at={fHambre + 12} color="#ff9ad5" size={70} rot={5} />
        <Tag text="???" x={540} y={850} at={fMist - 6} color="#ffffff" size={100} until={fTeo - 5} />
      </Cam>
      <Stamp text="TEORÍA Nº 1" at={fHist + 10} top={1500} size={90} color="#1f8a4c" rotate={-8} />
      <Grade vig={0.6} />
      <Sfx at={fMist - 6} src="pop" vol={0.3} />
      <Sfx at={fTeo - 4} src="whoosh" vol={0.4} />
      <Sfx at={fHist + 10} src="mazo" vol={0.45} />
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
      <Cam keys={shots([[0, 1.5, 1.6, 0, headY(D.y, D.h) + 140], [fCom, 1.05, 1.1, 0, 200]], end)}>
        <BG blur={2}>
          <Village night />
        </BG>
        {f >= fCom && <Crowd count={12} />}
        <At x={D.x} y={D.y} from="none">
          <Bounce seed={2} amp={50}>
            <Toon {...TROFFEA} {...(f < fCom ? sw8(f, 0, "idle", "point") : dance(f, 2))} expr="smug" height={D.h} />
          </Bounce>
        </At>
      </Cam>
      <Tag text="¿CUÁNTO AGUANTARÍAS?" x={540} y={420} at={4} color="#ffd23f" size={78} />
      <Grade tint="rgba(90,110,200,0.35)" vig={0.75} />
      <Sfx at={4} src="pop" vol={0.35} />
    </>
  );
};

const SCENES: Record<string, React.FC> = { hook: SHook, troffea: STroffea, contagio: SContagio, idea: SIdea, escenario: SEscenario, caidos: SCaidos, causa: SCausa, outro: SOutro };

export const BAILE_FRAMES = T.total;
export const Baile: React.FC = () => <NarratedVideo voz={voz} order={ORDER} tail={TAIL} scenes={SCENES} folder="voz_baile" music="musica_baile.wav" musicVol={0.13} progress="#ff5a5a" />;
