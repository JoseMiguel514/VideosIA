import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { at, sceneFrames, SceneId } from "../timing";
import { ease, Glow, PauseIcon, pop } from "../kit";
import { Cake, Chromosome, Helix, Protein, ZombieCell } from "../Scenes1";
import { Jelly, Moto, Mouse } from "../Scenes2";
import { POSES, Stick } from "./Stick";
import { DR, MIA, SAM, YOU, ZOE } from "./cast";
import { Aquarium, Bathroom, CarInterior, Cemetery, Corridor, Garage, Lab, NightWindow, Office, PartyRoom, Park, Screen, Street } from "./Env";
import { Arrow, Burst, CamK, Chapter, Frost, GOLD, Hud, hudFont, ICE, Layer, Pill, Punch, RED, SpeedLines, Tag, Trophy, Vig } from "./Hud";
import { kf, pick, poseAt, steps } from "./anim";
import { Bubble, Emote, PClipboard, PCup, PFlowers, PLaser, PMirror, PPhone, PPopper, PRemote, PTablet, PTube, Spot } from "./props";

const D = (id: SceneId) => sceneFrames(id);
const T: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({ children, size = 40, color = "#f6efdf", style }) => (
  <div style={{ fontFamily: hudFont, fontWeight: 900, fontSize: size, color, ...style }}>{children}</div>
);

/* ---------- helpers ---------- */
type K4 = [number, number, number, number];
/** IK reach timeline: keys [frame, localX, localY, weight]. */
const R = (f: number, keys: K4[]) => ({
  x: kf(f, keys.map((k) => [k[0], k[1]] as [number, number])),
  y: kf(f, keys.map((k) => [k[0], k[2]] as [number, number])),
  w: kf(f, keys.map((k) => [k[0], k[3]] as [number, number])),
});
/** World point → character-local point. */
const L = (cx: number, cy: number, s: number, wx: number, wy: number): [number, number] => [(wx - cx) / s, (wy - cy) / s];
/** Head centre in world coordinates. */
const HW = (x: number, y: number, s: number, sit = false): [number, number] => [x, y + (sit ? -419 : -504) * s];
/** Walk-in helper: x position and walking phase while entering. */
const enter = (f: number, from: number, to: number, t0: number, t1: number) => {
  const x = kf(f, [
    [t0, from],
    [t1, to],
  ]);
  return { x, walk: f > t0 && f < t1 ? f / 3.5 : undefined };
};
/** Wiggle used for nervous/scratching hands. */
const wig = (f: number, a = 12, sp = 2.2) => Math.sin(f / sp) * a;

/* local anchor points (standing) */
const HEAD_TOP: [number, number] = [85, -560];
const CHIN: [number, number] = [18, -440];
const MOUTH: [number, number] = [8, -460];

/* =========================================================================
 * 1 — Party: candles out, everything freezes
 * ========================================================================= */
export const S_Hook1: React.FC = () => {
  const f = useCurrentFrame();
  const blow = at("hook1", "blow");
  const out = blow + 14;
  const stop = at("hook1", "stops");
  const life = at("hook1", "life");
  const aging = at("hook1", "aging");
  const forever = at("hook1", "Forever");
  const ff = Math.min(f, stop);
  const frozen = f >= stop;
  const lit = 1 - ease(f, out, out + 8);
  const clapA = Math.sin(ff / 3) * 25;
  const clap = { l: [20, -130 + clapA] as [number, number], r: [20, -130 + clapA] as [number, number] };
  const youExpr = pick(f, [
    [0, "happy"],
    [blow, "blow"],
    [out + 10, "happy"],
    [stop, "surprised"],
  ] as [number, "happy" | "blow" | "surprised"][]);
  const lean = steps(f, [
    [0, 0],
    [blow - 4, 10],
    [out + 8, 0],
  ]);
  const samR = R(ff, [
    [0, 60, -330, 1],
    [20, 80, -560, 1],
    [50, 80, -560, 1],
    [70, 60, -330, 1],
  ]);
  const [yx, yy] = HW(960, 850, 1);
  return (
    <>
      <CamK
        keys={[
          [0, 1.0, 960, 540],
          [blow - 6, 1.35, 960, 450],
          [stop - 2, 1.35, 960, 450],
          [stop + 6, 2.2, yx, yy + 40, "p"],
          [aging, 2.2, yx, yy + 40],
          [forever, 1.15, 960, 500, "p"],
          [D("hook1"), 1.2, 960, 500],
        ]}
        hits={[stop]}
        drift={frozen ? 0 : 1}
      >
        <PartyRoom f={ff} />
        <Layer>
          <Stick c={SAM} x={1700} y={860} s={0.78} f={ff} expr="happy" look={-0.6} seed={3} still={frozen} reachR={samR} itemR={<PCup />} />
          <Stick c={MIA} x={430} y={890} s={0.9} f={ff} expr="happy" pose={clap} look={0.6} seed={1} still={frozen} />
          <Stick c={ZOE} x={1460} y={890} s={0.9} f={ff} expr="happy" pose={clap} look={-0.6} seed={2} still={frozen} />
          <Stick c={YOU} x={960} y={850} s={1.0} f={ff} expr={youExpr} pose={POSES.hold} lean={lean} lookY={f >= blow && f < stop ? 0.5 : 0} still={frozen} pops={[stop]} />
          <rect x={560} y={720} width={800} height={40} rx={8} fill="#5a3a26" stroke="#1a110b" strokeWidth={6} />
          <rect x={590} y={760} width={740} height={320} fill="#3d281a" />
          <g transform="translate(640 690)">
            <rect x={-40} y={-50} width={80} height={60} fill="#6fd3ff" stroke="#1a110b" strokeWidth={4} />
            <rect x={-6} y={-50} width={12} height={60} fill="#ff6f8f" />
          </g>
          <g transform="translate(1290 690)">
            <rect x={-34} y={-40} width={68} height={50} fill="#b18cff" stroke="#1a110b" strokeWidth={4} />
            <rect x={-34} y={-22} width={68} height={10} fill="#ffd166" />
          </g>
          <Emote kind="spark" x={1700} y={330} start={20} end={60} s={0.8} />
          <Emote kind="shock" x={yx} y={yy} start={stop} end={stop + 20} s={1.2} />
        </Layer>
        <Cake x={960} y={505} s={0.62} lit={lit} outAt={out} frozenAt={stop} />
        <Spot keys={[[aging, yx, yy, 150]]} start={aging - 4} end={forever - 4} />
      </CamK>
      <Frost start={stop} />
      <SpeedLines start={stop} color={ICE} />
      <Hud label="BIOLOGICAL AGE" value={frozen ? "25 · PAUSED" : "25"} color={frozen ? ICE : GOLD} start={6} x={1420} w={460} />
      <PauseIcon start={stop} x={960} y={130} size={110} />
      <Pill text="NOT YOUR LIFE." start={life} end={aging - 4} x={960} y={860} />
      <Punch text="YOUR AGING." start={aging} end={forever - 6} y={860} size={100} color={ICE} />
      <Punch text="FOREVER" start={forever} y={250} size={150} color={ICE} sub="∞" />
      <Vig />
    </>
  );
};

/* =========================================================================
 * 2 — Mirror check, then the dark turn
 * ========================================================================= */
export const S_Hook2: React.FC = () => {
  const f = useCurrentFrame();
  const gray = at("hook2", "gray");
  const wr = at("hook2", "wrinkles");
  const slow = at("hook2", "slowing");
  const dream = at("hook2", "dream");
  const strange = at("hook2", "strange");
  const die = at("hook2", "die");
  const think = at("hook2", "think");
  const X = 760;
  const Y = 920;
  const S = 1.12;
  const red = ease(f, die - 4, die + 10);
  const dropped = f >= die - 2;
  const expr = pick(f, [
    [0, "happy"],
    [strange, "confused"],
    [die, "surprised"],
    [die + 25, "worried"],
  ] as [number, "happy" | "confused" | "surprised" | "worried"][]);
  const reachL = R(f, [
    [0, -95, -470, 1],
    [die - 4, -95, -470, 1],
    [die + 2, -60, -300, 0],
  ]);
  const reachR = R(f, [
    [0, 40, -280, 0],
    [gray - 6, 40, -280, 0],
    [gray + 2, HEAD_TOP[0], HEAD_TOP[1], 1],
    [gray + 18, HEAD_TOP[0] + wig(gray + 18, 6), HEAD_TOP[1], 1],
    [wr, 70, -500, 1],
    [wr + 16, 64, -490, 1],
    [slow - 2, 64, -490, 0],
  ]);
  const pose = poseAt(f, [
    [0, POSES.idle],
    [slow, POSES.hips],
    [strange, POSES.hesitant],
    [die + 6, POSES.cross],
  ]);
  const jump = f > slow && f < slow + 24 ? -Math.sin(((f - slow) / 24) * Math.PI) * 50 : 0;
  const fallT = Math.max(0, f - die + 2);
  const mY = Y - 470 * S + fallT * fallT * 1.4;
  const shattered = mY > 900;
  const [hx, hy] = HW(X, Y, S);
  return (
    <>
      <CamK
        keys={[
          [0, 1.05, 860, 560],
          [gray - 4, 1.7, hx, hy + 20, "p"],
          [slow, 1.7, hx, hy + 20],
          [slow + 10, 1.15, 860, 520],
          [strange, 1.3, 800, 480],
          [die - 2, 1.3, 800, 480],
          [die + 4, 2.3, hx, hy + 30, "p"],
          [think - 10, 2.3, hx, hy + 30],
          [think + 20, 1.3, 860, 520],
        ]}
        hits={[die, die + 14]}
        tilt={[
          [die - 1, 0],
          [die + 8, -4],
          [think, 0],
        ]}
      >
        <Bathroom f={f} red={red} />
        <Layer>
          <Stick
            c={YOU}
            x={X}
            y={Y}
            s={S}
            f={f}
            expr={expr}
            pose={pose}
            look={f >= die ? 0 : -0.5}
            sweat={f >= die}
            tremble={f >= die ? 0.7 : 0}
            pops={[gray, wr, die]}
            reachL={reachL}
            reachR={reachR}
            itemL={dropped ? undefined : <PMirror rot={-15} />}
            dy={jump}
            handsFront
          />
          {dropped && !shattered && (
            <g transform={`translate(${X - 95 * S} ${mY}) rotate(${fallT * 14})`}>
              <PMirror rot={0} />
            </g>
          )}
          {shattered &&
            new Array(10).fill(0).map((_, i) => {
              const t = f - (die - 2 + 27);
              const ang = (i / 10) * Math.PI;
              const px = X - 95 * S + Math.cos(ang) * t * (3 + (i % 3));
              const py = 905 - Math.sin(ang) * t * 4 + t * t * 0.35;
              return py < 960 ? <path key={i} d="M 0 -8 L 7 4 L -6 6 Z" transform={`translate(${px} ${Math.min(py, 950)}) rotate(${t * 20 + i * 30})`} fill="#bfe6f5" /> : null;
            })}
          <Emote kind="spark" x={hx + 120} y={hy - 120} start={dream} end={strange - 4} />
          <Emote kind="?" x={hx + 110} y={hy - 120} start={strange} end={die - 4} />
          <Emote kind="!" x={hx + 110} y={hy - 140} start={die} end={think - 10} />
        </Layer>
        <Spot keys={[[die, hx, hy, 170]]} start={die} end={think - 6} dark={0.6} />
      </CamK>
      {[
        { t: "GRAY HAIR", st: gray, y: 300 },
        { t: "WRINKLES", st: wr, y: 400 },
        { t: "SLOWING DOWN", st: slow, y: 500 },
      ].map((it) => (
        <Pill key={it.t} text={`✕  ${it.t}`} start={it.st - 4} end={die - 8} x={1440} y={it.y} />
      ))}
      <Tag text="SOUNDS LIKE A DREAM" start={dream} end={die - 8} x={1440} y={640} color="#d9951a" />
      {f >= die && f < think + 30 && (
        <div style={{ position: "absolute", left: 1200, top: 230, width: 640, textAlign: "center", transform: `scale(${pop(f, die, 8)})` }}>
          <T size={64}>BUT YOU'D STILL</T>
          <T size={240} color={RED} style={{ lineHeight: 1, textShadow: "0 0 50px rgba(232,52,63,0.8), 6px 0 0 rgba(0,255,255,0.25), -6px 0 0 rgba(255,0,0,0.35)" }}>
            DIE
          </T>
        </div>
      )}
      <SpeedLines start={die} color={RED} />
      <Pill text="...just not the way you think" start={think - 10} x={1470} y={760} size={36} />
      <Vig />
    </>
  );
};

/* =========================================================================
 * 3 — Dr. Reyes walks in with a tablet: 12 hallmarks
 * ========================================================================= */
const HALL = [
  "Genomic instability",
  "Telomere attrition",
  "Epigenetic changes",
  "Loss of proteostasis",
  "Disabled autophagy",
  "Nutrient-sensing failure",
  "Mitochondrial dysfunction",
  "Cellular senescence",
  "Stem cell exhaustion",
  "Altered cell signaling",
  "Chronic inflammation",
  "Gut microbe imbalance",
];
export const S_Setup1: React.FC = () => {
  const f = useCurrentFrame();
  const dozen = at("setup1", "dozen");
  const hall = at("setup1", "hallmarks");
  const wear = at("setup1", "wear");
  const dr = enter(f, -200, 400, 0, 40);
  const reachL = { x: -30, y: -330, w: 1 };
  const reachR = R(f, [
    [0, 50, -280, 0],
    [44, 50, -280, 0],
    [52, -20, -360, 1],
    [dozen - 10, -20, -360, 1],
    [dozen - 2, 210, -560, 1],
    [wear - 4, 210, -560, 1],
    [wear + 6, 40, -280, 0],
  ]);
  const tap = f > 52 && f < dozen - 10 ? Math.abs(Math.sin(f / 4)) * 14 : 0;
  const [hx, hy] = HW(dr.x, 900, 1.05);
  return (
    <>
      <CamK
        keys={[
          [0, 1.0, 960, 540],
          [44, 1.0, 960, 540],
          [56, 1.9, hx + 40, hy + 140, "p"],
          [dozen - 6, 1.9, hx + 40, hy + 140],
          [dozen + 4, 1.0, 960, 540],
          [hall, 1.45, 1290, 420, "p"],
          [wear - 6, 1.45, 1290, 420],
          [wear + 20, 1.12, 1100, 480],
          [D("setup1"), 1.08, 1000, 500],
        ]}
      >
        <Lab f={f} />
        <Screen x={760} y={90} w={1060} h={640} f={f}>
          {f < dozen - 4 ? (
            <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center" }}>
              <T size={84} color={ICE} style={{ transform: `scale(${pop(f, 10)})` }}>
                AGING ≠ ONE THING
              </T>
            </div>
          ) : (
            <div style={{ padding: 26 }}>
              <T size={40} color={ICE} style={{ textAlign: "center", marginBottom: 14 }}>
                THE 12 HALLMARKS OF AGING
              </T>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {HALL.map((h, i) => {
                  const st = dozen + i * 4;
                  const worn = ease(f, wear + i * 2, wear + 18 + i * 2);
                  return (
                    <div
                      key={h}
                      style={{
                        opacity: f >= st ? 1 : 0,
                        transform: `scale(${f >= st ? pop(f, st) : 0}) rotate(${worn * (random(h) - 0.5) * 6}deg)`,
                        border: `3px solid ${worn > 0.5 ? RED : ICE}`,
                        borderRadius: 10,
                        padding: "10px 12px",
                        fontFamily: hudFont,
                        fontWeight: 800,
                        fontSize: 24,
                        color: "#e9f6ff",
                        background: worn > 0.5 ? "rgba(232,52,63,0.12)" : "rgba(127,230,255,0.06)",
                      }}
                    >
                      <span style={{ color: worn > 0.5 ? RED : GOLD, marginRight: 8 }}>{String(i + 1).padStart(2, "0")}</span>
                      {h}
                    </div>
                  );
                })}
              </div>
              <T size={18} color="#7f93a8" style={{ textAlign: "right", marginTop: 10 }}>
                Based on López-Otín et al., Cell (2023)
              </T>
            </div>
          )}
        </Screen>
        <Layer>
          <Stick
            c={DR}
            x={dr.x}
            y={900}
            s={1.05}
            f={f}
            walk={dr.walk}
            expr={f >= wear ? "bored" : "neutral"}
            look={f > 44 && f < dozen ? 0 : 0.5}
            lookY={f > 50 && f < dozen - 8 ? 0.6 : 0}
            reachL={reachL}
            reachR={{ ...reachR, y: reachR.y + tap }}
            itemL={<PTablet glow={f >= dozen ? "#ff8f6b" : "#4fe3ff"} />}
            talk={f > 40 && f < dozen ? 0.4 : 0}
            pops={[dozen]}
          />
          <Emote kind="dots" x={hx + 30} y={hy - 130} start={56} end={dozen - 10} s={0.9} />
          <Emote kind="sweat" x={hx + 100} y={hy - 100} start={wear + 4} />
        </Layer>
        <Spot
          keys={[
            [hall, 1290, 420, 560],
            [wear, 1290, 420, 560],
          ]}
          start={hall}
          end={wear + 10}
          dark={0.55}
        />
      </CamK>
      <Chapter n="01" title="WHAT AGING REALLY IS" />
      <Vig />
    </>
  );
};

/* =========================================================================
 * 4 — Remote in hand: pointing at the damage, then pressing pause
 * ========================================================================= */
export const S_Setup2: React.FC = () => {
  const f = useCurrentFrame();
  const pause = at("setup2", "pause");
  const next = at("setup2", "next");
  const fz = Math.min(f, pause);
  const items = [
    { label: "DNA DAMAGE", st: at("setup2", "DNA"), el: <Helix f={fz} /> },
    { label: "WORN-OUT PROTEINS", st: at("setup2", "Worn"), el: <Protein f={fz} /> },
    { label: "'ZOMBIE' CELLS", st: at("setup2", "Cells"), el: <ZombieCell f={fz} /> },
  ];
  const X = 400;
  const Y = 900;
  const S = 1.05;
  const itemWorld = (i: number): [number, number] => [774 + 180 + i * 340, 104 + 260];
  const tgt = (i: number) => {
    const [wx, wy] = itemWorld(i);
    const [lx, ly] = L(X, Y, S, wx, wy);
    const d = Math.hypot(lx, ly + 400);
    return [lx * (180 / d), -400 + (ly + 400) * (180 / d)] as [number, number];
  };
  const reachR = R(fz, [
    [0, 40, -280, 0],
    [items[0].st - 8, 40, -280, 0],
    [items[0].st, ...tgt(0), 1],
    [items[1].st, ...tgt(1), 1],
    [items[2].st, ...tgt(2), 1],
    [pause - 8, 170, -420, 1],
  ]);
  const press = f >= pause ? ease(f, pause, pause + 14) : 0;
  const [hx, hy] = HW(X, Y, S);
  return (
    <>
      <CamK
        keys={[
          [0, 1.05, 1000, 500],
          [items[0].st, 1.5, itemWorld(0)[0], 380, "p"],
          [items[1].st, 1.5, itemWorld(1)[0], 380, "p"],
          [items[2].st, 1.5, itemWorld(2)[0], 380, "p"],
          [pause - 10, 1.9, hx + 120, hy + 60, "p"],
          [pause + 2, 1.9, hx + 120, hy + 60],
          [pause + 10, 1.2, 1100, 440, "p"],
          [next - 10, 1.25, 1100, 440],
          [next, 2.0, hx, hy + 30, "p"],
          [D("setup2"), 2.05, hx, hy + 30],
        ]}
        hits={[pause]}
        drift={f >= pause ? 0 : 1}
      >
        <Lab f={fz} />
        <Screen x={760} y={90} w={1060} h={640} glow={f >= pause ? "#7fe6ff" : "#4fe3ff"} f={fz}>
          <svg width={1032} height={612} style={{ filter: f >= pause ? "saturate(0.2) brightness(0.8)" : undefined }}>
            {items.map((it, i) =>
              f >= it.st ? (
                <g key={it.label}>
                  <g transform={`translate(${180 + i * 340}, 260) scale(${pop(f, it.st) * 0.85})`}>{it.el}</g>
                  <text x={180 + i * 340} y={500} textAnchor="middle" fontFamily={hudFont} fontWeight={900} fontSize={32} fill="#e9f6ff">
                    {it.label}
                  </text>
                </g>
              ) : null,
            )}
          </svg>
          {f >= pause && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(5,11,24,0.5)" }}>
              <svg width={1032} height={612}>
                <g transform={`translate(516 280) scale(${pop(f, pause, 10)})`}>
                  <circle r={110} fill="rgba(127,230,255,0.1)" stroke={ICE} strokeWidth={8} />
                  <rect x={-42} y={-55} width={28} height={110} rx={8} fill={ICE} />
                  <rect x={14} y={-55} width={28} height={110} rx={8} fill={ICE} />
                </g>
              </svg>
            </div>
          )}
        </Screen>
        <Layer>
          <Stick
            c={DR}
            x={X}
            y={Y}
            s={S}
            f={fz}
            expr={f >= next ? "confused" : f >= pause ? "bored" : "neutral"}
            look={0.6}
            still={f >= pause && f < next}
            talk={f < pause - 10 ? 0.4 : 0}
            reachR={reachR}
            itemR={<PRemote press={press} />}
            pops={[pause, next]}
          />
          <Emote kind="think" x={hx + 130} y={hy - 150} start={next - 4} />
        </Layer>
      </CamK>
      <Frost start={pause} />
      <SpeedLines start={pause} color={ICE} />
      <Hud label="ALL DAMAGE" value={f >= pause ? "PAUSED" : "ACTIVE"} color={f >= pause ? ICE : RED} start={items[0].st} x={1500} y={760} w={380} />
      <Punch text="WHAT HAPPENS NEXT?" start={next - 8} y={880} size={84} color={ICE} />
      <Vig />
    </>
  );
};

/* =========================================================================
 * 5 — Friends age, you don't — they notice and react
 * ========================================================================= */
export const S_Years: React.FC = () => {
  const f = useCurrentFrame();
  const first = at("years", "first");
  const p = ease(f, first, at("years", "thirty") + 20, (x) => x);
  const notice = at("years", "notice");
  const Y = 900;
  const S = 0.95;
  const xs = { MIA: 330, ZOE: 690, YOU: 1130, SAM: 1590 };
  const miaR = R(f, [
    [0, 60, -300, 1],
    [30, 30, -455, 1],
    [50, 60, -300, 1],
    [notice, 60, -300, 1],
  ]);
  const samL = { x: -40, y: -360, w: 1 };
  const [zX, zY] = L(xs.ZOE, Y, S, xs.YOU - 40, Y - 330 * S);
  const zoeR = R(f, [
    [0, 50, -280, 0],
    [notice + 6, 50, -280, 0],
    [notice + 14, Math.min(zX, 180), zY, 1],
  ]);
  const samR = R(f, [
    [0, 50, -280, 0],
    [notice + 9, 50, -280, 0],
    [notice + 16, HEAD_TOP[0], HEAD_TOP[1], 1],
  ]);
  const tint = p > 0.5 ? "#2a2a4a" : "#4a2f4a";
  const [yhx, yhy] = HW(xs.YOU, Y, S);
  return (
    <>
      <CamK
        keys={[
          [0, 1.25, 1130, 560],
          [first, 1.0, 960, 540],
          [notice - 6, 1.0, 960, 540],
          [notice + 6, 1.35, 900, 470, "p"],
          [notice + 40, 1.35, 900, 470],
          [notice + 52, 2.0, yhx, yhy + 40, "p"],
          [D("years"), 2.05, yhx, yhy + 40],
        ]}
      >
        <Street f={f} tint={tint} />
        <Layer>
          <Stick c={MIA} x={xs.MIA} y={Y} s={S} f={f} age={p * 0.85} seed={1} expr={f >= notice + 3 ? "surprised" : p > 0.4 ? "bored" : "happy"} look={0.7} reachR={miaR} itemR={<PCup />} pops={[notice + 3]} />
          <Stick c={ZOE} x={xs.ZOE} y={Y} s={S} f={f} age={p * 0.85} seed={2} expr={f >= notice + 6 ? "confused" : "happy"} look={0.7} reachR={zoeR} talk={f < notice ? 0.4 : 0} pops={[notice + 6]} />
          <Stick c={YOU} x={xs.YOU} y={Y} s={S} f={f} expr="happy" pose={poseAt(f, [[0, POSES.wave], [notice + 30, POSES.shrug]])} look={-0.4} talk={f < notice ? 0.3 : 0} />
          <Stick
            c={SAM}
            x={xs.SAM}
            y={Y}
            s={S}
            f={f}
            age={p * 0.85}
            seed={3}
            expr={f >= notice + 9 ? "confused" : "bored"}
            look={f >= notice + 9 ? -0.7 : 0}
            lookY={f < notice + 9 ? 0.6 : 0}
            reachL={samL}
            reachR={samR}
            itemL={<PPhone />}
            pops={[notice + 9]}
          />
          <Emote kind="!" x={xs.MIA + 40} y={HW(xs.MIA, Y, S)[1] - 130} start={notice + 3} s={0.8} />
          <Emote kind="?" x={xs.ZOE + 40} y={HW(xs.ZOE, Y, S)[1] - 130} start={notice + 6} s={0.8} />
          <Emote kind="?" x={xs.SAM - 40} y={HW(xs.SAM, Y, S)[1] - 130} start={notice + 9} s={0.8} />
          <Emote kind="spark" x={yhx + 90} y={yhy - 110} start={notice + 52} s={0.8} />
        </Layer>
      </CamK>
      {(["MIA", "ZOE", "SAM"] as const).map((k) => (
        <Pill key={k} text={`${25 + Math.round(p * 10)}`} start={8} end={notice + 44} x={xs[k]} y={600} size={40} />
      ))}
      <Pill text="25" start={8} end={notice + 44} x={xs.YOU} y={600} size={40} color={ICE} />
      <Hud label="YEARS PASSED" value={`+${Math.round(p * 10)}`} start={2} />
      <Chapter n="02" title="THE FIRST DECADE" />
      <Vig />
    </>
  );
};

/* =========================================================================
 * 6 — Check-up: the doctor examines you, then the photos
 * ========================================================================= */
export const S_Same: React.FC = () => {
  const f = useCurrentFrame();
  const skin = at("same", "skin");
  const joints = at("same", "joints");
  const heart = at("same", "heart");
  const young = at("same", "young");
  const ex = at("same", "exactly");
  const rows = [
    { t: "SKIN", st: skin },
    { t: "JOINTS", st: joints },
    { t: "HEART", st: heart },
  ];
  const ecg = (() => {
    let d = "";
    for (let i = 0; i <= 50; i++) {
      const ph = (i + f) % 25;
      const y = ph === 8 ? -50 : ph === 9 ? 35 : ph === 10 ? -15 : 0;
      d += `${i ? "L" : "M"} ${i * 6} ${y}`;
    }
    return d;
  })();
  const YX = 460;
  const YY = 890;
  const YS = 0.95;
  const DX = kf(f, [
    [0, 1280],
    [skin - 20, 760],
    [young - 8, 760],
    [young + 20, 1250],
  ]);
  const drWalk = (f > skin - 50 && f < skin - 20) || (f > young - 8 && f < young + 20) ? f / 3.5 : undefined;
  const DS = 1.0;
  const DY = 900;
  const target = (wx: number, wy: number) => L(DX, DY, DS, wx, wy);
  const drL = R(f, [
    [0, -40, -280, 0],
    [skin - 8, -40, -280, 0],
    [skin, ...target(YX + 45, YY - 280), 1],
    [joints - 6, ...target(YX + 45, YY - 280), 1],
    [joints, ...target(YX + 30, YY - 150), 1],
    [heart - 6, ...target(YX + 30, YY - 150), 1],
    [heart, ...target(YX + 12, YY - 330), 1],
    [young - 10, ...target(YX + 12, YY - 330), 1],
    [young, -40, -280, 0],
  ]);
  const drR = { x: 40, y: -330, w: 1 };
  const photoPoint = R(f, [
    [0, 40, -330, 1],
    [young + 20, 40, -330, 1],
    [young + 30, -200, -560, 1],
  ]);
  const [dhx, dhy] = HW(DX, DY, DS);
  const [yhx, yhy] = HW(YX, YY, YS, true);
  return (
    <>
      <CamK
        keys={[
          [0, 1.1, 800, 560],
          [skin, 1.5, 620, 520, "p"],
          [heart, 1.5, 620, 520],
          [heart + 8, 1.6, 1500, 300, "p"],
          [young - 10, 1.6, 1500, 300],
          [young + 6, 1.15, 860, 380],
          [ex, 1.15, 860, 380],
          [ex + 8, 2.1, dhx, dhy + 40, "p"],
          [ex + 40, 2.1, dhx, dhy + 40],
          [ex + 52, 2.1, yhx, yhy + 40, "p"],
          [D("same"), 2.1, yhx, yhy + 40],
        ]}
        hits={[ex + 4]}
      >
        <Office f={f} />
        <div style={{ position: "absolute", left: 1520, top: 150, width: 330, height: 200, borderRadius: 12, background: "#08120f", border: "10px solid #111" }}>
          <svg width={310} height={180}>
            <path d={ecg} transform="translate(5 95)" stroke="#5dff8f" strokeWidth={4} fill="none" />
            <text x={300} y={30} textAnchor="end" fontFamily={hudFont} fontWeight={900} fontSize={30} fill="#5dff8f">
              {62 + Math.round(Math.sin(f / 20) * 2)} BPM
            </text>
          </svg>
        </div>
        {f >= young &&
          ["AGE 25", "AGE 35"].map((lbl, i) => (
            <div
              key={lbl}
              style={{
                position: "absolute",
                left: 560 + i * 300,
                top: 70,
                width: 240,
                height: 290,
                background: "#efe8da",
                borderRadius: 6,
                transform: `scale(${pop(f, young + i * 8)}) rotate(${(i ? 3 : -3) + Math.sin(f / 30 + i) * 0.6}deg)`,
                boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
              }}
            >
              <svg width={210} height={210} style={{ position: "absolute", left: 15, top: 15, background: "#3b5a7a" }}>
                <Stick c={YOU} x={105} y={370} s={0.52} f={0} expr="happy" shadow={false} still />
              </svg>
              <T size={40} color="#222" style={{ position: "absolute", bottom: 14, width: "100%", textAlign: "center" }}>
                {lbl}
              </T>
            </div>
          ))}
        <Layer>
          <rect x={250} y={740} width={420} height={40} rx={10} fill="#d9e2ea" stroke="#0b0a0c" strokeWidth={5} />
          <rect x={290} y={780} width={30} height={110} fill="#8794a2" />
          <rect x={600} y={780} width={30} height={110} fill="#8794a2" />
          <Stick
            c={YOU}
            x={YX}
            y={YY}
            s={YS}
            f={f}
            sit
            expr={f >= ex ? "happy" : f >= skin ? "neutral" : "bored"}
            look={kf(f, [
              [0, 0.5],
              [young, -0.1],
            ])}
            lookY={f >= young ? -0.4 : 0}
            pose={f >= ex + 40 ? POSES.shrug : POSES.idle}
            pops={[ex + 40]}
          />
          <Stick
            c={DR}
            x={DX}
            y={DY}
            s={DS}
            f={f}
            walk={drWalk}
            expr={f >= ex ? "surprised" : "neutral"}
            look={f >= young + 20 ? -0.5 : -0.7}
            lookY={f >= young + 20 ? -0.5 : 0}
            reachL={f < young ? drL : { x: -40, y: -280, w: 0 }}
            reachR={f < young + 20 ? drR : photoPoint}
            itemR={f < young + 20 ? <PClipboard /> : undefined}
            pops={[ex]}
          />
          {f >= young + 20 && (
            <g transform={`translate(${DX + 60} ${DY - 80}) rotate(8)`}>
              <PClipboard />
            </g>
          )}
          <Emote kind="!" x={dhx + 100} y={dhy - 130} start={ex} />
          <Emote kind="spark" x={yhx + 90} y={yhy - 110} start={ex + 44} />
        </Layer>
      </CamK>
      <div style={{ position: "absolute", left: 1460, top: 410 }}>
        {rows.map((r) =>
          f >= r.st ? (
            <div key={r.t} style={{ display: "flex", justifyContent: "space-between", width: 380, padding: "10px 22px", marginBottom: 10, borderRadius: 14, background: "rgba(14,12,12,0.88)", transform: `scale(${pop(f, r.st)})` }}>
              <T size={40}>{r.t}</T>
              <T size={40} color={ICE}>
                AGE 25 ✓
              </T>
            </div>
          ) : null,
        )}
      </div>
      {f >= ex && f < ex + 40 && (
        <div style={{ position: "absolute", left: 960, top: 820, transform: `translate(-50%,-50%) rotate(-8deg) scale(${pop(f, ex + 4, 8)})`, border: `10px solid ${RED}`, borderRadius: 14, padding: "0 30px", fontFamily: hudFont, fontWeight: 900, fontSize: 110, color: RED, background: "rgba(14,12,12,0.6)" }}>
          IDENTICAL
        </div>
      )}
      <Vig />
    </>
  );
};

/* =========================================================================
 * 7 — Telomeres: laser pointer on the monitor, You thinking
 * ========================================================================= */
export const S_Telomeres: React.FC = () => {
  const f = useCurrentFrame();
  const div = at("telomeres", "divide");
  const caps = at("telomeres", "caps");
  const stop = at("telomeres", "Eventually") + 25;
  const frozen = at("telomeres", "frozen");
  const clock = at("telomeres", "clock");
  const nMax = Math.max(1, Math.floor((stop - div) / 12));
  const n = Math.max(0, Math.floor((Math.min(f, stop) - div) / 12));
  const yours = Math.max(0, Math.floor((f - div) / 12));
  const capR = 30 * (1 - 0.85 * Math.min(1, n / nMax));
  const rightIn = pop(f, frozen - 6);
  const lx = interpolate(rightIn, [0, 1], [486, 250]);
  const SX = 474;
  const SY = 84;
  const capW: [number, number] = [SX + lx + 0.8 * 150 * Math.sin((28 * Math.PI) / 180), SY + 300 - 0.8 * 150 * Math.cos((28 * Math.PI) / 180)];
  const yourW: [number, number] = [SX + 722 + 56, SY + 300 - 106];
  const DX = 250;
  const DY = 1000;
  const DS = 1.15;
  const hand: [number, number] = [120, -430];
  const handW: [number, number] = [DX + hand[0] * DS, DY + hand[1] * DS];
  const beamTo: [number, number] = f >= frozen ? yourW : capW;
  const beam: [number, number] = [(beamTo[0] - handW[0]) / DS, (beamTo[1] - handW[1]) / DS];
  const YX = 1680;
  const YY = 1000;
  const YS = 1.15;
  const youR = R(f, [
    [0, CHIN[0], CHIN[1], 1],
    [frozen - 4, CHIN[0], CHIN[1], 1],
    [frozen + 4, 40, -280, 0],
  ]);
  const [yhx, yhy] = HW(YX, YY, YS);
  const [dhx, dhy] = HW(DX, DY, DS);
  return (
    <>
      <CamK
        keys={[
          [0, 1.0, 960, 540],
          [24, 2.0, yhx - 60, yhy + 80, "p"],
          [caps - 10, 2.0, yhx - 60, yhy + 80],
          [caps + 4, 1.7, SX + 486 + 60, SY + 180, "p"],
          [stop - 20, 1.6, SX + 486, SY + 300],
          [stop, 1.8, SX + 486, SY + 300, "p"],
          [stop + 30, 1.8, SX + 486, SY + 300],
          [stop + 40, 2.1, dhx + 30, dhy + 60, "p"],
          [frozen - 8, 2.1, dhx + 30, dhy + 60],
          [frozen, 2.2, yhx - 40, yhy + 60, "p"],
          [clock - 6, 2.2, yhx - 40, yhy + 60],
          [clock + 6, 1.6, SX + 722, SY + 300, "p"],
          [D("telomeres"), 1.65, SX + 722, SY + 300],
        ]}
        hits={[stop, frozen]}
      >
        <Lab f={f} />
        <Screen x={460} y={70} w={1000} h={620} f={f}>
          <svg width={972} height={592}>
            <defs>
              <Glow id="capglow" color="#7fe6ff" std={8} />
            </defs>
            <text x={486} y={60} textAnchor="middle" fontFamily={hudFont} fontWeight={900} fontSize={44} fill={GOLD}>
              {f >= at("telomeres", "telomeres") - 6 ? "TELOMERES = PROTECTIVE CAPS" : "INSIDE YOUR CELLS"}
            </text>
            <g transform={`translate(${lx}, 300) scale(0.8) rotate(${Math.sin(f / 30) * 3})`}>
              <Chromosome capR={capR} capColor={f >= stop ? RED : GOLD} />
            </g>
            <text x={lx} y={520} textAnchor="middle" fontFamily={hudFont} fontWeight={900} fontSize={34} fill={f >= stop ? RED : "#e9f6ff"}>
              {f >= stop ? "DIVISION STOPPED" : f >= div ? `NORMAL CELL · DIVISIONS: ${n}` : "NORMAL CELL"}
            </text>
            {f >= frozen - 6 && (
              <g opacity={rightIn}>
                <g transform={`translate(722, 300) scale(${0.8 * rightIn}) rotate(${Math.sin(f / 25) * 3})`}>
                  <Chromosome capR={30 + Math.sin(f / 6) * 2} capColor={ICE} glow />
                </g>
                <text x={722} y={520} textAnchor="middle" fontFamily={hudFont} fontWeight={900} fontSize={34} fill={ICE}>
                  {f >= clock ? "YOUR CELL · CLOCK FROZEN ∞" : `YOUR CELL · DIVISIONS: ${yours}`}
                </text>
              </g>
            )}
          </svg>
        </Screen>
        <Layer>
          <Stick c={DR} x={DX} y={DY} s={DS} f={f} expr={f >= stop && f < frozen ? "sad" : "neutral"} look={0.6} talk={0.4} reachR={{ x: hand[0], y: hand[1], w: 1 }} itemR={<PLaser bx={beam[0]} by={beam[1]} on={f >= caps - 4} />} />
          <Stick
            c={YOU}
            x={YX}
            y={YY}
            s={YS}
            f={f}
            expr={pick(f, [
              [0, "neutral"],
              [stop, "worried"],
              [frozen, "surprised"],
              [clock, "happy"],
            ] as [number, "neutral" | "worried" | "surprised" | "happy"][])}
            look={-0.6}
            lookY={-0.4}
            reachR={youR}
            handsFront
            sweat={f >= stop && f < frozen}
            pops={[stop, frozen, clock]}
          />
          <Emote kind="think" x={yhx - 160} y={yhy - 170} start={24} end={caps - 8} />
          <Emote kind="sweat" x={yhx - 100} y={yhy - 120} start={stop} end={frozen - 4} />
          <Emote kind="!" x={yhx - 100} y={yhy - 150} start={frozen} end={clock - 4} />
          <Emote kind="idea" x={yhx - 110} y={yhy - 160} start={clock} />
        </Layer>
        <Spot keys={[[caps, capW[0], capW[1], 90]]} start={caps} end={stop - 20} dark={0.55} />
      </CamK>
      <Chapter n="03" title="THE SCIENCE INSIDE" />
      <Vig />
    </>
  );
};

/* =========================================================================
 * 8 — Aquarium: You taps the glass, jumps back when the fish strikes
 * ========================================================================= */
export const S_Jelly: React.FC = () => {
  const f = useCurrentFrame();
  const jel = at("jelly", "jellyfish");
  const juv = at("jelly", "juvenile");
  const again = at("jelly", "Again");
  const catchW = at("jelly", "catch");
  const eaten = at("jelly", "eaten");
  const sick = at("jelly", "sick");
  const imm = at("jelly", "immortal");
  const polyp = interpolate(f, [juv - 10, juv + 15, again, again + 15, again + 30, again + 45], [0, 1, 0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fishX = interpolate(f, [eaten - 15, eaten + 35], [1500, -500], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sickAmt = ease(f, sick, sick + 15);
  const YS = 1.05;
  const YY = 950;
  const YX = kf(f, [
    [0, 200],
    [jel - 30, 200],
    [jel - 6, 400],
    [eaten, 400],
    [eaten + 12, 250],
  ]);
  const walking = f > jel - 30 && f < jel - 6 ? f / 3.5 : undefined;
  const glass = L(YX, YY, YS, 470, 560);
  const youR = R(f, [
    [0, 40, -280, 0],
    [jel - 6, 40, -280, 0],
    [jel, glass[0], glass[1], 1],
    [jel + 4, glass[0] - 15, glass[1], 1],
    [jel + 8, glass[0], glass[1], 1],
    [jel + 12, glass[0] - 15, glass[1], 1],
    [juv - 8, glass[0], glass[1] - 100, 1],
    [eaten - 4, glass[0], glass[1] - 100, 1],
    [eaten + 4, 40, -280, 0],
    [sick, MOUTH[0] + 10, MOUTH[1] + 10, 1],
    [imm - 4, MOUTH[0] + 10, MOUTH[1] + 10, 1],
    [imm + 4, 40, -280, 0],
  ]);
  const youL = R(f, [
    [0, -40, -280, 0],
    [sick, -40, -280, 0],
    [sick + 6, -MOUTH[0] - 6, MOUTH[1] + 14, 1],
    [imm - 4, -MOUTH[0] - 6, MOUTH[1] + 14, 1],
    [imm + 4, -40, -280, 0],
  ]);
  const jump = f > eaten && f < eaten + 16 ? -Math.sin(((f - eaten) / 16) * Math.PI) * 70 : 0;
  const drR = R(f, [
    [0, 40, -330, 1],
    [imm - 6, 40, -330, 1],
    [imm, 70 + wig(f, 18, 2), -560, 1],
  ]);
  const [yhx, yhy] = HW(YX, YY, YS);
  const [dhx, dhy] = HW(1660, 950, 1.05);
  return (
    <>
      <CamK
        keys={[
          [0, 1.0, 960, 500],
          [jel, 1.6, 860, 460, "p"],
          [catchW - 10, 1.5, 960, 420],
          [catchW, 1.0, 960, 500],
          [eaten + 2, 2.1, yhx + 40, yhy + 40, "p"],
          [sick + 20, 2.1, yhx + 40, yhy + 40],
          [imm - 10, 1.1, 960, 500],
          [imm, 2.0, dhx - 30, dhy + 60, "p"],
          [D("jelly"), 2.0, dhx - 30, dhy + 60],
        ]}
        hits={[eaten + 6]}
      >
        <Aquarium f={f} />
        <div style={{ position: "absolute", left: 460, top: 90, width: 1000, height: 700, borderRadius: 30, background: "linear-gradient(#0d6f96aa, #06304a)", border: "16px solid #0b1a24", overflow: "hidden", boxShadow: "0 0 80px rgba(80,200,255,0.35)" }}>
          <svg width={968} height={668}>
            <defs>
              <Glow id="jg" color="#ff6fae" std={14} />
            </defs>
            {new Array(8).fill(0).map((_, i) => (
              <path key={i} d={`M ${i * 130 + Math.sin(f / 30 + i) * 30} 0 L ${i * 130 + 60 + Math.sin(f / 25 + i) * 40} 668`} stroke="#bff3ff" strokeWidth={22} opacity={0.05} />
            ))}
            {f >= jel && f < jel + 30 && [0, 8].map((d) => <circle key={d} cx={10} cy={470} r={Math.max(0, f - jel - d) * 5} fill="none" stroke="#dff8ff" strokeWidth={3} opacity={Math.max(0, 1 - (f - jel - d) / 22)} />)}
            <g transform={`translate(${484 + (f >= jel && f < jel + 40 ? -Math.sin((f - jel) / 6) * 20 : 0)}, ${330 + 12 * Math.sin(f / 20)})`} opacity={f > eaten + 10 ? 0.5 : 1} style={{ filter: `url(#jg) saturate(${1 - sickAmt})` }}>
              <Jelly f={f} polyp={polyp} />
            </g>
            {f > eaten - 15 && f < eaten + 40 && (
              <g transform={`translate(${fishX}, 340) scale(0.9)`}>
                <path d="M -260 0 Q -120 -130 120 -40 L 260 -110 L 220 0 L 260 110 L 120 40 Q -120 130 -260 0 Z" fill="#0a1626" stroke="#22405e" strokeWidth={4} />
                <path d="M -230 10 L -180 30 L -150 8 L -120 32 L -90 8" stroke="#dfe6f5" strokeWidth={6} fill="none" />
                <circle cx={-170} cy={-30} r={10} fill={GOLD} />
              </g>
            )}
            <rect x={0} y={600} width={968} height={68} fill="#c9b48a" opacity={0.35} />
          </svg>
          {sickAmt > 0 && <div style={{ position: "absolute", inset: 0, background: "rgba(232,52,63,0.2)", opacity: sickAmt * (1 - ease(f, imm - 10, imm)) }} />}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,255,255,0.12), transparent 30%)" }} />
        </div>
        <Layer>
          <Stick
            c={YOU}
            x={YX}
            y={YY}
            s={YS}
            f={f}
            walk={walking}
            expr={pick(f, [
              [0, "happy"],
              [eaten, "surprised"],
              [sick, "sad"],
            ] as [number, "happy" | "surprised" | "sad"][])}
            look={0.7}
            lookY={-0.2}
            reachR={youR}
            reachL={youL}
            handsFront
            dy={jump}
            lean={f > eaten && f < eaten + 20 ? -8 : 0}
            pops={[jel, eaten, sick]}
          />
          <Stick c={DR} x={1660} y={950} s={1.05} f={f} expr={f >= imm ? "bored" : "neutral"} look={-0.7} reachL={{ x: -30, y: -340, w: 1 }} itemL={<PTablet />} reachR={drR} talk={f < catchW ? 0.4 : 0} />
          <Emote kind="heart" x={yhx + 100} y={yhy - 120} start={juv} end={catchW - 6} s={0.7} />
          <Emote kind="!" x={yhx + 100} y={yhy - 140} start={eaten} end={sick - 4} />
          <Emote kind="sweat" x={yhx + 100} y={yhy - 110} start={sick} end={imm - 4} />
        </Layer>
      </CamK>
      <Pill text="TURRITOPSIS DOHRNII" start={jel} x={960} y={60} color="#ff9ec7" size={40} />
      <Hud label="LIFE CYCLE" value={polyp > 0.5 ? "JUVENILE" : "ADULT"} start={juv - 10} color="#ff9ec7" y={130} />
      <Tag text="STILL GETS EATEN" start={eaten + 12} end={imm - 10} x={560} y={860} />
      <Tag text="STILL GETS SICK" start={sick} end={imm - 10} x={1360} y={860} />
      <Punch text="NOT AGING ≠ IMMORTAL" start={imm - 8} y={870} size={90} color="#f6efdf" />
      <Vig />
    </>
  );
};

/* =========================================================================
 * 9 — Risk chart: laser follows the curve, You bites nails
 * ========================================================================= */
export const S_Math: React.FC = () => {
  const f = useCurrentFrame();
  const long = at("math", "long");
  const never = at("math", "never");
  const kills = at("math", "kills");
  const acc = at("math", "Accidents");
  const viol = at("math", "Violence");
  const X0 = 90,
    X1 = 520,
    Y0 = 470,
    Y1 = 110;
  const ax = (a: number) => X0 + ((a - 20) / 80) * (X1 - X0);
  const ay = (v: number) => Y0 - v * (Y0 - Y1);
  const vOf = (a: number) => (a < 30 ? 0.12 + (a - 20) * 0.002 : 0.14 + (a - 30) * 0.0123);
  let normal = "";
  for (let a = 20; a <= 100; a += 2) normal += `${a === 20 ? "M" : "L"} ${ax(a)} ${ay(vOf(a))}`;
  const drawN = ease(f, long, long + 60);
  const drawF = ease(f, never + 10, never + 50);
  const causes = [
    { t: "Accidents", w: "Accidents" },
    { t: "Car crashes", w: "Car" },
    { t: "Overdoses", w: "Overdoses" },
    { t: "Violence", w: "Violence" },
  ];
  const SX = 474;
  const SY = 94;
  const tipAge = 20 + 80 * drawN;
  const laserTo: [number, number] =
    f < never + 10 ? [SX + ax(tipAge), SY + ay(vOf(tipAge))] : f < kills ? [SX + ax(25) + (X1 - ax(25)) * drawF, SY + ay(0.13)] : [1210, 350 + Math.max(0, Math.min(3, Math.floor((f - acc) / 25))) * 80];
  const DX = 260;
  const DY = 920;
  const DS = 1.05;
  const hand: [number, number] = [120, -440];
  const handW: [number, number] = [DX + hand[0] * DS, DY + hand[1] * DS];
  const beam: [number, number] = [(laserTo[0] - handW[0]) / DS, (laserTo[1] - handW[1]) / DS];
  const YX = 1670;
  const YY = 920;
  const YS = 1.05;
  const nails = R(f, [
    [0, 40, -280, 0],
    [acc - 4, 40, -280, 0],
    [acc + 4, MOUTH[0] - 4 + wig(f, 4, 1.5), MOUTH[1] + 22, 1],
  ]);
  const [yhx, yhy] = HW(YX, YY, YS);
  return (
    <>
      <CamK
        keys={[
          [0, 1.0, 960, 540],
          [long, 1.45, SX + 300, SY + 290, "p"],
          [never + 60, 1.45, SX + 300, SY + 290],
          [kills, 1.0, 960, 540],
          [acc, 2.1, yhx - 20, yhy + 50, "p"],
          [viol - 10, 2.1, yhx - 20, yhy + 50],
          [viol, 1.35, 1400, 440, "p"],
          [D("math"), 1.4, 1400, 440],
        ]}
        hits={[acc]}
      >
        <Office f={f} />
        <Screen x={460} y={80} w={1000} h={600} glow="#ffb36b" f={f}>
          <svg width={972} height={572}>
            {[0.2, 0.4, 0.6, 0.8].map((v) => (
              <line key={v} x1={X0} y1={ay(v)} x2={X1} y2={ay(v)} stroke="#1c2a3a" strokeWidth={2} />
            ))}
            <line x1={X0} y1={Y0} x2={X1 + 20} y2={Y0} stroke="#7f93a8" strokeWidth={4} />
            <line x1={X0} y1={Y0} x2={X0} y2={Y1 - 30} stroke="#7f93a8" strokeWidth={4} />
            {[20, 40, 60, 80, 100].map((a) => (
              <text key={a} x={ax(a)} y={Y0 + 36} textAnchor="middle" fontFamily={hudFont} fontWeight={800} fontSize={24} fill="#7f93a8">
                {a}
              </text>
            ))}
            <text x={(X0 + X1) / 2} y={Y0 + 72} textAnchor="middle" fontFamily={hudFont} fontWeight={900} fontSize={26} fill="#e9f6ff">
              AGE
            </text>
            <text x={X0 - 30} y={(Y0 + Y1) / 2} textAnchor="middle" fontFamily={hudFont} fontWeight={900} fontSize={22} fill="#e9f6ff" transform={`rotate(-90 ${X0 - 30} ${(Y0 + Y1) / 2})`}>
              YEARLY RISK OF DYING (LOG)
            </text>
            <path d={normal} stroke={RED} strokeWidth={7} fill="none" pathLength={1} strokeDasharray={`${drawN} 1`} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 6px #e8343f)" }} />
            {drawN > 0.95 && (
              <text x={ax(80)} y={ay(0.95)} textAnchor="end" fontFamily={hudFont} fontWeight={900} fontSize={26} fill={RED}>
                NORMAL AGING
              </text>
            )}
            <line x1={ax(25)} y1={ay(0.13)} x2={ax(25) + (X1 - ax(25)) * drawF} y2={ay(0.13)} stroke={ICE} strokeWidth={7} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 6px #7fe6ff)" }} />
            {drawF > 0.9 && (
              <text x={X1} y={ay(0.13) - 16} textAnchor="end" fontFamily={hudFont} fontWeight={900} fontSize={26} fill={ICE}>
                FROZEN AT 25
              </text>
            )}
            <text x={X0} y={555} fontFamily={hudFont} fontWeight={800} fontSize={16} fill="#6b7d90">
              Illustrative shape, not real data
            </text>
            {f >= kills && (
              <text x={760} y={80} textAnchor="middle" fontFamily={hudFont} fontWeight={900} fontSize={32} fill={GOLD} opacity={ease(f, kills, kills + 10)}>
                WHAT KILLS 25-YEAR-OLDS?
              </text>
            )}
          </svg>
        </Screen>
        <Layer>
          <Stick c={DR} x={DX} y={DY} s={DS} f={f} expr="neutral" look={0.6} talk={0.4} reachR={{ x: hand[0], y: hand[1], w: 1 }} itemR={<PLaser bx={beam[0]} by={beam[1]} on={f >= long - 4} />} />
          <Stick c={YOU} x={YX} y={YY} s={YS} f={f} expr={f >= acc ? "worried" : "neutral"} sweat={f >= acc} tremble={f >= acc ? 0.4 : 0} look={-0.6} lookY={-0.3} reachR={nails} reachL={f >= acc ? { x: -10, y: -330, w: 1 } : undefined} handsFront pops={[acc]} />
          <Emote kind="sweat" x={yhx - 100} y={yhy - 120} start={acc} />
        </Layer>
        <Pill text="Disease" start={kills + 15} struck={at("math", "disease")} x={1210} y={260} size={34} color="#7f93a8" />
        {causes.map((c, i) => (
          <Pill key={c.t} text={c.t} start={at("math", c.w)} x={1210} y={350 + i * 80} size={34} color={RED} />
        ))}
        <Spot keys={[[kills, 1210, 420, 230]]} start={kills + 10} end={acc - 2} dark={0.55} />
      </CamK>
      <Chapter n="04" title="HOW YOU'D ACTUALLY DIE" />
      <Vig />
    </>
  );
};

/* =========================================================================
 * 10 — Walking down the corridor of years
 * ========================================================================= */
export const S_Lifespan: React.FC = () => {
  const f = useCurrentFrame();
  const sev = at("lifespan", "several");
  const th = at("lifespan", "thousand");
  const avg = at("lifespan", "average", 1);
  const prom = at("lifespan", "promise");
  const years = interpolate(f, [0, 20, sev, sev + 45, th - 5, th + 30], [0, 80, 80, 500, 500, 1000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const travel = kf(f, [
    [0, 0],
    [avg, 3.4],
  ]);
  const walking = f < avg;
  const scratch = R(f, [
    [0, 40, -280, 0],
    [avg - 2, 40, -280, 0],
    [avg + 6, HEAD_TOP[0] + wig(f, 6), HEAD_TOP[1] + wig(f + 3, 4), 1],
    [prom - 6, HEAD_TOP[0], HEAD_TOP[1], 1],
    [prom + 2, 40, -280, 0],
  ]);
  const [hx, hy] = HW(960, 960, 1);
  return (
    <>
      <CamK
        keys={[
          [0, 1.0, 960, 540],
          [th, 1.0, 960, 540],
          [th + 10, 1.25, 960, 500, "p"],
          [avg - 4, 1.25, 960, 500],
          [avg + 6, 2.2, hx, hy + 50, "p"],
          [D("lifespan"), 2.25, hx, hy + 50],
        ]}
        hits={[prom]}
      >
        <Corridor signs={["80", "250", "500", "750", "1000"]} travel={travel} f={f} />
        <Layer>
          <Stick
            c={YOU}
            x={960}
            y={960}
            s={1.0}
            f={f}
            walk={walking ? f / 4 : undefined}
            expr={pick(f, [
              [0, "happy"],
              [th, "surprised"],
              [avg, "confused"],
              [prom, "worried"],
            ] as [number, "happy" | "surprised" | "confused" | "worried"][])}
            look={walking ? Math.sin(f / 22) * 0.7 : 0}
            sweat={f >= prom}
            reachR={scratch}
            pose={f >= prom ? POSES.shrug : POSES.idle}
            pops={[th, avg, prom]}
          />
          <Emote kind="!" x={hx + 110} y={hy - 140} start={th} end={avg - 4} />
          <Emote kind="?" x={hx + 110} y={hy - 140} start={avg} end={prom - 4} />
          <Emote kind="sweat" x={hx + 110} y={hy - 110} start={prom} />
        </Layer>
      </CamK>
      <Hud label="LIFESPAN?" value={years >= 999 ? "~1,000 YRS" : `${Math.round(years)} YRS`} start={2} w={440} x={1440} />
      <Burst start={th + 28} x={1660} y={110} />
      <Pill text="A typical life today" start={6} end={sev} x={300} y={110} size={34} color={GOLD} />
      <Pill text="Rough estimate, not a measured figure" start={sev} end={avg - 4} x={420} y={110} size={30} />
      <Punch text="AN AVERAGE." start={avg} x={480} y={860} size={84} />
      <Punch text="NOT A PROMISE" start={prom - 4} x={1420} y={860} size={84} color={RED} />
      <Vig />
    </>
  );
};

/* =========================================================================
 * 11 — Cemetery: You walks in with flowers and lays them on a grave
 * ========================================================================= */
export const S_Year200: React.FC = () => {
  const f = useCurrentFrame();
  const hund = at("year200", "hundredth");
  const bye = at("year200", "goodbye");
  const once = at("year200", "once");
  const car = at("year200", "careers");
  const age = interpolate(f, [0, hund + 20], [25, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eraF = (age - 25) / 25;
  const you = enter(f, 1500, 1010, 0, 60);
  const S = 1.05;
  const Y = 930;
  const crouch = kf(f, [
    [bye - 4, 0],
    [bye + 10, 150],
    [bye + 34, 150],
    [bye + 48, 0],
  ]);
  const laid = f >= bye + 24;
  const reachR = R(f, [
    [0, 60, -330, 1],
    [bye, 60, -330, 1],
    [bye + 14, -10, -120, 1],
    [bye + 26, -10, -120, 1],
    [bye + 36, 40, -280, 0],
  ]);
  const [hx, hy] = HW(you.x, Y, S);
  return (
    <>
      <CamK
        keys={[
          [0, 1.25, 960, 600],
          [hund + 20, 1.0, 960, 540],
          [bye, 1.0, 960, 540],
          [bye + 20, 1.7, 990, 700],
          [once, 1.7, 990, 700],
          [once + 8, 2.2, hx, hy + 60, "p"],
          [car, 2.2, hx, hy + 60],
          [car + 20, 1.1, 960, 500],
        ]}
      >
        <Cemetery f={f} era={Math.floor(eraF)} mix={eraF - Math.floor(eraF)} />
        <Layer>
          {laid && (
            <g transform="translate(980 838) rotate(-70)">
              <PFlowers />
            </g>
          )}
          <Stick
            c={YOU}
            x={you.x}
            y={Y}
            s={S}
            f={f}
            walk={you.walk}
            expr={f >= bye ? "sad" : "neutral"}
            lookY={f >= bye ? 0.6 : 0}
            tilt={kf(f, [
              [bye, 0],
              [bye + 20, 8],
            ])}
            reachR={reachR}
            itemR={laid ? undefined : <PFlowers />}
            dy={crouch}
          />
          <Emote kind="dots" x={hx + 20} y={hy - 140} start={once + 10} end={car - 4} s={0.8} />
        </Layer>
      </CamK>
      <Hud label="YOUR AGE" value={`${Math.round(age)}`} start={2} />
      <Pill text="LOOKS: 25" start={10} x={1690} y={240} size={34} color={ICE} />
      {["CAREER #1", "CAREER #2", "CAREER #3"].map((c, i) => (
        <Pill key={c} text={c} start={car + i * 6} struck={car + 18 + i * 6} x={560 + i * 400} y={160} size={40} />
      ))}
      <Vig />
    </>
  );
};

/* =========================================================================
 * 12 — Car seat nerves, then reaching for the motorcycle... and pulling back
 * ========================================================================= */
export const S_Risk: React.FC = () => {
  const f = useCurrentFrame();
  const moto = at("risk", "motorcycle");
  const cent = at("risk", "centuries");
  const tags = [
    { t: "EVERY CAR RIDE", w: "car" },
    { t: "EVERY SKI TRIP", w: "ski" },
    { t: "EVERY RISK", w: "risk" },
  ];
  if (f >= moto - 4) {
    const p = pop(f, moto - 4);
    const X = 560;
    const Y = 920;
    const S = 1.05;
    const reachR = R(f, [
      [moto - 4, 40, -280, 0],
      [moto + 6, 40, -280, 0],
      [moto + 30, 175, -330, 1],
      [moto + 40, 178, -330, 1],
      [moto + 46, 30, -440, 1],
      [moto + 80, 30, -440, 1],
    ]);
    const [hx, hy] = HW(X, Y, S);
    return (
      <>
        <CamK
          keys={[
            [moto - 4, 1.0, 960, 540],
            [moto + 10, 1.15, 860, 520, "p"],
            [moto + 40, 1.3, 760, 480],
            [moto + 46, 2.2, hx, hy + 50, "p"],
            [moto + 120, 2.25, hx, hy + 50],
          ]}
          hits={[moto + 6, moto + 46]}
        >
          <Garage f={f} />
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <g transform={`translate(${interpolate(p, [0, 1], [1400, 1150])}, 720) scale(1.7)`}>
              <Moto f={0} />
            </g>
            <ellipse cx={1150} cy={830} rx={60} ry={10} fill="#ffcf7a" opacity={0.3 + 0.2 * Math.sin(f / 3)} />
          </svg>
          <Layer>
            <Stick c={YOU} x={X} y={Y} s={S} f={f} expr={f >= moto + 46 ? "surprised" : "worried"} sweat pose={POSES.idle} look={f >= moto + 46 ? 0 : 0.7} tremble={0.5} lean={f >= moto + 46 ? -6 : 3} reachR={reachR} pops={[moto + 46]} />
            <Emote kind="!" x={hx + 110} y={hy - 140} start={moto + 46} />
          </Layer>
        </CamK>
        <Tag text="DO NOT TOUCH?" start={moto + 4} x={1150} y={420} />
        <Hud label="AT STAKE" value="CENTURIES" start={0} color={RED} w={440} x={1440} />
        <Vig />
      </>
    );
  }
  const X = 935;
  const Y = 1000;
  const S = 1.05;
  const gripR = { x: 30 + wig(f, 3, 1.3), y: -360, w: 1 };
  const gripL = { x: -40 + wig(f + 7, 3, 1.3), y: -300, w: 1 };
  const [hx, hy] = HW(X, Y, S, true);
  return (
    <>
      <CamK
        keys={[
          [0, 1.0, 960, 540],
          [at("risk", "car"), 1.2, 1000, 520, "p"],
          [cent, 1.2, 1000, 520],
          [cent + 6, 2.3, hx, hy + 60, "p"],
          [moto - 4, 2.35, hx, hy + 60],
        ]}
        hits={[cent]}
      >
        <CarInterior f={f} />
        <Layer>
          <rect x={790} y={260} width={290} height={760} rx={50} fill="#1b2430" stroke="#0b0a0c" strokeWidth={6} />
          <rect x={835} y={180} width={200} height={110} rx={30} fill="#1b2430" stroke="#0b0a0c" strokeWidth={6} />
          <Stick c={YOU} x={X} y={Y} s={S} f={f} sit expr={f >= at("risk", "car") ? "worried" : "neutral"} sweat={f >= at("risk", "car")} tremble={f >= cent ? 0.8 : 0.3} look={Math.sin(f / 9) * 0.6} reachR={gripR} reachL={gripL} pops={[cent]} />
          <path d={`M ${X - 55} ${Y - 420} L ${X + 40} ${Y - 160}`} stroke="#c9a640" strokeWidth={26} />
          <path d={`M ${X + 55} ${Y - 420} L ${X - 40} ${Y - 160}`} stroke="#c9a640" strokeWidth={26} />
          <rect x={X - 20} y={Y - 185} width={40} height={30} rx={4} fill="#c9ced6" />
          <Emote kind="sweat" x={hx + 110} y={hy - 120} start={at("risk", "car")} />
          <Emote kind="shock" x={hx} y={hy} start={cent} end={cent + 20} s={1.3} />
        </Layer>
      </CamK>
      {tags.map((t, i) => (
        <Tag key={t.t} text={t.t} start={at("risk", t.w)} x={1340} y={330 + i * 80} />
      ))}
      <Hud label="AT STAKE" value={f >= cent ? "CENTURIES" : "A LIFETIME"} color={f >= cent ? RED : GOLD} start={4} w={440} x={1440} />
      <SpeedLines start={cent} color={RED} />
      <Pill text="SOMETHING SHIFTS" start={2} end={at("risk", "car") - 4} x={480} y={160} />
      <Vig />
    </>
  );
};

/* =========================================================================
 * 13 — Hospital corridor: the doctor reads her clipboard... the twist
 * ========================================================================= */
export const S_Twist: React.FC = () => {
  const f = useCurrentFrame();
  const flash = interpolate(f, [0, 4, 20], [0.6, 0.4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const age = at("twist", "age");
  const great = at("twist", "greatest");
  const smoke = at("twist", "smoking");
  const diet = at("twist", "diet");
  const travel = kf(f, [
    [0, 0],
    [great, 2.6],
  ]);
  const big = f >= great;
  const X = 960;
  const Y = 980;
  const S = 1.0;
  const readL = R(f, [
    [0, -30, -380, 1],
    [age - 4, -30, -380, 1],
    [age + 4, -40, -280, 0],
  ]);
  const shakeHead = (f > smoke && f < smoke + 20) || (f > diet && f < diet + 20) ? Math.sin(f / 2) * 9 : 0;
  const finger = R(f, [
    [0, 40, -280, 0],
    [age - 4, 40, -280, 0],
    [age + 2, 90, -600, 1],
  ]);
  const [hx, hy] = HW(X, Y, S);
  return (
    <>
      <CamK
        keys={[
          [0, 1.4, 960, 500],
          [20, 1.0, 960, 540, "p"],
          [great - 6, 1.0, 960, 540],
          [great + 4, 2.1, hx, hy + 70, "p"],
          [age - 6, 2.1, hx, hy + 70],
          [age + 2, 1.4, 960, 560, "p"],
          [D("twist"), 1.45, 960, 560],
        ]}
        hits={[0, age]}
        tilt={[
          [0, -3],
          [30, 0],
        ]}
      >
        <Corridor signs={["CARDIOLOGY", "ONCOLOGY", "NEUROLOGY"]} travel={travel} cool signColor="#d6e6f2" f={f} />
        <Layer>
          <Stick
            c={DR}
            x={X}
            y={Y}
            s={S}
            f={f}
            walk={!big ? f / 4 : undefined}
            expr={pick(f, [
              [0, "bored"],
              [great, "neutral"],
              [smoke, "angry"],
              [age, "happy"],
            ] as [number, "bored" | "neutral" | "angry" | "happy"][])}
            lookY={f < age ? 0.5 : 0}
            tilt={shakeHead}
            reachL={readL}
            reachR={finger}
            itemL={f < age + 4 ? <PClipboard flip={ease(f, great, great + 12)} /> : undefined}
            pops={[great, age]}
          />
          <Emote kind="think" x={hx + 120} y={hy - 150} start={great + 4} end={smoke - 4} />
          <Emote kind="idea" x={hx + 120} y={hy - 160} start={age} />
        </Layer>
      </CamK>
      <div style={{ position: "absolute", inset: 0, background: RED, opacity: flash }} />
      <Punch text="THE TWIST" start={at("twist", "twist") - 6} end={at("twist", "heart") - 4} y={300} size={140} color={RED} />
      <Pill text="Heart disease" start={at("twist", "heart")} x={330} y={110} size={34} color={RED} />
      <Pill text="Many cancers" start={at("twist", "cancers")} x={960} y={110} size={34} color={RED} />
      <Pill text="Alzheimer's" start={at("twist", "Alzheimer")} x={1580} y={110} size={34} color={RED} />
      {f >= age && <div style={{ position: "absolute", inset: 0, background: "rgba(5,8,14,0.5)", opacity: ease(f, age, age + 10) }} />}
      <Hud label="#1 RISK FACTOR" value={f >= age ? "AGE" : "???"} start={great} x={1440} y={200} w={400} />
      <Pill text="SMOKING" start={smoke - 4} struck={smoke + 12} x={420} y={470} size={52} />
      <Pill text="DIET" start={diet - 4} struck={diet + 10} x={1500} y={470} size={52} />
      <Trophy label="AGE ITSELF" start={age - 4} x={960} y={540} />
      <Burst start={age - 2} x={960} y={520} n={36} spread={380} />
      <SpeedLines start={age - 2} color={GOLD} />
      <Chapter n="05" title="THE TWIST" />
      <Vig />
    </>
  );
};

/* =========================================================================
 * 14 — The tree: the doctor kneels and touches the glowing root
 * ========================================================================= */
export const S_Root: React.FC = () => {
  const f = useCurrentFrame();
  const youth = at("root", "youth");
  const root = at("root", "root");
  const many = at("root", "many");
  const grow = ease(f, 0, 40);
  const rootGlow = ease(f, root - 5, root + 15);
  const leaves = [
    { t: "Heart disease", x: 520, y: 260 },
    { t: "Many cancers", x: 800, y: 170 },
    { t: "Alzheimer's", x: 1120, y: 170 },
    { t: "Stroke", x: 1400, y: 260 },
  ];
  const DX = kf(f, [
    [0, 1620],
    [root - 30, 1620],
    [root - 6, 1240],
  ]);
  const drWalk = f > root - 30 && f < root - 6 ? f / 3.5 : undefined;
  const DS = 0.95;
  const DY = 950;
  const kneel = kf(f, [
    [root - 6, 0],
    [root + 6, 120],
    [many + 4, 120],
    [many + 16, 0],
  ]);
  const rootTgt = L(DX, DY, DS, 1180, 870);
  const touch = R(f, [
    [0, -40, -280, 0],
    [root - 2, -40, -280, 0],
    [root + 6, rootTgt[0], rootTgt[1], 1],
    [many, rootTgt[0], rootTgt[1], 1],
    [many + 8, -200, -560, 1],
  ]);
  const [yhx, yhy] = HW(300, 950, 0.95);
  return (
    <>
      <CamK
        keys={[
          [0, 1.3, 960, 300],
          [youth, 2.0, yhx + 40, yhy + 60, "p"],
          [root - 10, 2.0, yhx + 40, yhy + 60],
          [root + 4, 1.6, 1060, 760, "p"],
          [many - 4, 1.6, 1060, 760],
          [many + 10, 1.0, 960, 520],
          [D("root"), 1.05, 960, 500],
        ]}
      >
        <Park f={f} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <Glow id="rg" color={GOLD} std={12} />
          </defs>
          {[
            [600, 220, 160],
            [960, 150, 200],
            [1320, 220, 160],
          ].map(([x, y, r], i) => (
            <circle key={i} cx={x + Math.sin(f / 35 + i) * 6} cy={y + 60} r={r} fill="#3d5a3a" opacity={0.85 * grow} />
          ))}
          {leaves.map((l, i) => (
            <path key={i} d={`M 960 620 Q 960 ${l.y + 150} ${l.x} ${l.y + 40}`} stroke="#3a2618" strokeWidth={22} fill="none" pathLength={1} strokeDasharray={`${grow} 1`} strokeLinecap="round" />
          ))}
          <path d="M 920 820 L 940 560 L 980 560 L 1000 820 Z" fill="#3a2618" />
          <g filter={rootGlow > 0 ? "url(#rg)" : undefined}>
            {[-260, -150, -50, 50, 150, 260].map((dx, i) => (
              <path key={i} d={`M 960 810 Q ${960 + dx * 0.4} 850 ${960 + dx} ${870 + (i % 2) * 14}`} stroke={rootGlow > 0.3 ? GOLD : "#3a2618"} strokeWidth={14} fill="none" strokeLinecap="round" />
            ))}
          </g>
        </svg>
        <Layer>
          <Stick c={YOU} x={300} y={950} s={0.95} f={f} expr={f >= many ? "surprised" : f >= root ? "happy" : "neutral"} look={0.6} lookY={f >= many ? -0.6 : 0.3} pops={[root, many]} pose={f >= many ? POSES.pointUp : POSES.idle} />
          <Stick c={DR} x={DX} y={DY} s={DS} f={f} walk={drWalk} expr="neutral" look={-0.6} lookY={f >= root && f < many ? 0.6 : 0} talk={0.4} reachL={touch} dy={kneel} />
          <Emote kind="idea" x={yhx + 100} y={yhy - 140} start={root} end={many - 4} s={0.85} />
          <Emote kind="!" x={yhx + 100} y={yhy - 140} start={many} s={0.85} />
        </Layer>
        {rootGlow > 0 && <Tag text="AGING" start={root} x={960} y={700} color="#c48612" size={52} />}
        <Spot keys={[[root, 960, 820, 220]]} start={root} end={many - 2} dark={0.6} />
      </CamK>
      <Pill text="NOT JUST CHASING YOUTH" start={youth - 8} end={root - 6} x={960} y={70} size={40} />
      {leaves.map((l, i) => (
        <Pill key={l.t} text={l.t} start={many + i * 5} x={l.x} y={l.y} size={32} color={RED} />
      ))}
      <Burst start={root} x={960} y={760} />
      <Vig />
    </>
  );
};

/* =========================================================================
 * 15 — Senolytics: test tube in hand; finger wag on "not yet"
 * ========================================================================= */
export const S_Lab: React.FC = () => {
  const f = useCurrentFrame();
  const clear = at("lab", "clear");
  const mice = at("lab", "mice");
  const hum = at("lab", "humans");
  const yet = at("lab", "yet");
  const cells = new Array(22).fill(0).map((_, i) => {
    const a = random("ca" + i) * Math.PI * 2;
    const r = Math.sqrt(random("cr" + i)) * 210;
    return { x: 270 + Math.cos(a) * r + Math.sin(f / 30 + i) * 6, y: 290 + Math.sin(a) * r + Math.cos(f / 25 + i) * 6, zombie: i % 4 === 0, i };
  });
  const X = 560;
  const Y = 920;
  const S = 1.1;
  const tubeR = R(f, [
    [0, 80, -420, 1],
    [clear, 80 + wig(f, 10, 1.4), -470, 1],
    [clear + 20, 80, -420, 1],
    [hum - 4, 80, -420, 1],
    [hum + 4, CHIN[0], CHIN[1], 1],
    [yet - 6, CHIN[0], CHIN[1], 1],
    [yet, 70 + wig(f, 20, 2), -600, 1],
  ]);
  const [hx, hy] = HW(X, Y, S);
  return (
    <>
      <CamK
        keys={[
          [0, 1.0, 960, 540],
          [clear, 1.55, 1260, 380, "p"],
          [mice - 6, 1.55, 1260, 380],
          [mice + 4, 1.4, 1450, 640, "p"],
          [hum, 2.1, hx, hy + 60, "p"],
          [yet - 6, 2.1, hx, hy + 60],
          [yet + 4, 2.4, hx + 20, hy + 20, "p"],
          [D("lab"), 2.45, hx + 20, hy + 20],
        ]}
        hits={[yet]}
      >
        <Lab f={f} />
        <Screen x={980} y={90} w={560} h={580} f={f}>
          <svg width={532} height={552}>
            <defs>
              <Glow id="zg" color="#7dff9b" std={8} />
            </defs>
            <text x={266} y={46} textAnchor="middle" fontFamily={hudFont} fontWeight={900} fontSize={30} fill="#7dff9b">
              MICROSCOPE
            </text>
            {cells.map((c) => {
              const k = c.zombie ? 1 - ease(f, clear + 8 + c.i, clear + 22 + c.i) : 1;
              if (k <= 0) return null;
              return (
                <g key={c.i} transform={`translate(${c.x} ${c.y}) scale(${k * (c.zombie && f > clear ? 1 + 0.2 * Math.sin(f) : 1)})`} filter={c.zombie ? "url(#zg)" : undefined}>
                  <circle r={26} fill={c.zombie ? "rgba(125,255,155,0.35)" : "rgba(255,170,190,0.3)"} stroke={c.zombie ? "#7dff9b" : "#ffb3c6"} strokeWidth={3} />
                  <circle r={9} fill={c.zombie ? "#7dff9b" : "#d4708c"} />
                </g>
              );
            })}
          </svg>
        </Screen>
        <Layer>
          <rect x={1000} y={760} width={700} height={30} fill="#d9e2ea" stroke="#0b0a0c" strokeWidth={5} />
          <rect x={1380} y={640} width={260} height={120} rx={8} fill="rgba(200,230,255,0.18)" stroke="#9fb6c8" strokeWidth={5} />
          <g transform={`translate(${1500 + Math.sin(f / 9) * 20} 720) scale(0.4)`}>
            <Mouse />
          </g>
          <Stick
            c={DR}
            x={X}
            y={Y}
            s={S}
            f={f}
            expr={pick(f, [
              [0, "neutral"],
              [mice, "happy"],
              [hum, "neutral"],
              [yet, "bored"],
            ] as [number, "neutral" | "happy" | "bored"][])}
            look={f >= hum ? 0 : 0.6}
            talk={f < hum ? 0.4 : 0}
            reachR={tubeR}
            reachL={f < hum ? { x: -30, y: -300, w: 0 } : { x: -10, y: -330, w: 1 }}
            itemR={f < hum ? <PTube /> : undefined}
            handsFront
            pops={[mice, yet]}
          />
          <Emote kind="heart" x={1500} y={600} start={mice} end={hum - 4} s={0.6} />
          <Emote kind="think" x={hx + 140} y={hy - 160} start={hum + 4} end={yet - 6} />
          <Emote kind="anger" x={hx + 90} y={hy - 90} start={yet} s={0.7} />
        </Layer>
      </CamK>
      <Pill text="ANIMAL STUDIES" start={at("lab", "animal") - 6} end={hum - 8} x={360} y={70} color="#7dff9b" size={40} />
      <Pill text="'Zombie' cells cleared" start={clear} end={hum - 6} x={360} y={150} size={30} color="#7dff9b" />
      <Hud label="OLD MICE" value="HEALTHIER" start={mice} color="#7dff9b" x={1550} y={540} w={340} />
      <Hud label="HUMANS" value="STILL EARLY" start={hum} color={GOLD} x={1550} y={700} w={340} />
      <Punch text="NOT YET." start={yet - 4} x={1360} y={380} size={170} color={ICE} />
      <Vig />
    </>
  );
};

/* =========================================================================
 * 16 — By the window: You flips the hourglass
 * ========================================================================= */
export const S_Outro1: React.FC = () => {
  const f = useCurrentFrame();
  const q = at("outro1", "question");
  const time = at("outro1", "time");
  const tom = at("outro1", "tomorrow");
  const flip = ease(f, time - 4, time + 14);
  const sand = f < time + 14 ? ease(f, 0, time, (x) => x) * 0.85 : ease(f, time + 14, time + 200, (x) => x);
  const danger = ease(f, tom, tom + 10);
  const sc = danger > 0.5 ? RED : GOLD;
  const X = 620;
  const Y = 920;
  const S = 1.05;
  const hg = L(X, Y, S, 960, 600);
  const reachR = R(f, [
    [0, CHIN[0], CHIN[1] + 30, 1],
    [q + 10, CHIN[0], CHIN[1] + 30, 1],
    [time - 10, hg[0], hg[1], 1],
    [time + 16, hg[0], hg[1], 1],
    [time + 26, 40, -260, 0],
  ]);
  const [hx, hy] = HW(X, Y, S, true);
  return (
    <>
      <CamK
        keys={[
          [0, 1.0, 960, 540],
          [q, 2.0, hx + 40, hy + 60, "p"],
          [time - 14, 2.0, hx + 40, hy + 60],
          [time - 4, 1.6, 900, 560, "p"],
          [tom - 4, 1.6, 900, 560],
          [tom + 4, 2.3, hx + 20, hy + 50, "p"],
          [D("outro1"), 2.35, hx + 20, hy + 50],
        ]}
        hits={[tom]}
      >
        <NightWindow f={f} />
        <Layer>
          <Stick c={YOU} x={X} y={Y} s={S} f={f} sit expr={f >= tom ? "worried" : "sad"} sweat={f >= tom} look={0.4} lookY={0.4} reachR={reachR} reachL={{ x: -20, y: -330, w: 0.6 }} handsFront tilt={-5} pops={[time, tom]} />
          <rect x={420} y={760} width={760} height={30} rx={6} fill="#5a3a26" stroke="#0b0a0c" strokeWidth={5} />
          <rect x={450} y={790} width={20} height={200} fill="#3d281a" />
          <rect x={1130} y={790} width={20} height={200} fill="#3d281a" />
          <rect x={1060} y={715} width={44} height={46} rx={6} fill="#e9e2d4" stroke="#0b0a0c" strokeWidth={4} />
          <g transform={`translate(960 640) rotate(${flip * 180}) scale(0.42)`}>
            <rect x={-200} y={-310} width={400} height={30} rx={10} fill="#8a6a45" />
            <rect x={-200} y={280} width={400} height={30} rx={10} fill="#8a6a45" />
            <clipPath id="htop">
              <path d="M -160 -280 L 160 -280 Q 160 -120 14 0 L -14 0 Q -160 -120 -160 -280 Z" />
            </clipPath>
            <clipPath id="hbot">
              <path d="M -14 0 L 14 0 Q 160 120 160 280 L -160 280 Q -160 120 -14 0 Z" />
            </clipPath>
            <g transform={flip >= 1 ? "rotate(180)" : undefined}>
              <rect clipPath="url(#htop)" x={-170} y={-280 + 280 * sand * 0.9} width={340} height={300} fill={sc} />
              <path clipPath="url(#hbot)" d={`M -170 280 L -170 ${280 - 200 * sand} Q 0 ${200 - 330 * sand} 170 ${280 - 200 * sand} L 170 280 Z`} fill={sc} />
              {flip === 0 || flip >= 1 ? <rect x={-3} y={-10} width={6} height={280 - 120 * sand} fill={sc} /> : null}
            </g>
            <path d="M -160 -280 L 160 -280 Q 160 -120 14 0 Q 160 120 160 280 L -160 280 Q -160 120 -14 0 Q -160 -120 -160 -280 Z" fill="rgba(200,230,255,0.08)" stroke="#cfe6ff" strokeWidth={8} />
          </g>
          <Emote kind="think" x={hx + 130} y={hy - 150} start={q + 6} end={time - 12} />
          <Emote kind="sweat" x={hx + 110} y={hy - 120} start={tom} />
        </Layer>
      </CamK>
      <Hud label="TIME LEFT" value={f >= tom ? "MAYBE 1 DAY" : "CENTURIES"} color={f >= tom ? RED : GOLD} start={time - 6} w={460} x={1420} />
      <Pill text="25 FOREVER?" start={at("outro1", "forever") - 6} x={960} y={90} color={ICE} size={50} />
      <Chapter n="06" title="THE REAL QUESTION" />
      <Vig />
    </>
  );
};

/* =========================================================================
 * 17 — Party again: high-five, phone in hand, popper on subscribe
 * ========================================================================= */
export const S_Outro2: React.FC<{ voiceEnd: number }> = ({ voiceEnd }) => {
  const f = useCurrentFrame();
  const deal = at("outro2", "deal");
  const com = at("outro2", "comments");
  const sub = at("outro2", "subscribe");
  const next = at("outro2", "Next");
  const msg = "The first thing I'd do with 1,000 years is...";
  const typed = msg.slice(0, Math.max(0, Math.floor((f - com - 5) / 1.3)));
  const clicked = f > sub + 15;
  const endFade = ease(f, voiceEnd + 10, voiceEnd + 40);
  const YX = 560;
  const Y = 900;
  const MX = 250;
  const MY = 880;
  const hf: [number, number] = [405, 460];
  const fiveT = deal + 10;
  const youL = R(f, [
    [0, -40, -280, 0],
    [deal - 6, -40, -280, 0],
    [fiveT, ...L(YX, Y, 1.0, hf[0], hf[1]), 1],
    [fiveT + 10, ...L(YX, Y, 1.0, hf[0], hf[1]), 1],
    [fiveT + 20, -40, -280, 0],
  ]);
  const miaR = R(f, [
    [0, 40, -280, 0],
    [deal - 6, 40, -280, 0],
    [fiveT, ...L(MX, MY, 0.85, hf[0], hf[1]), 1],
    [fiveT + 10, ...L(MX, MY, 0.85, hf[0], hf[1]), 1],
    [fiveT + 20, 40, -280, 0],
  ]);
  const youR = R(f, [
    [0, 40, -280, 0],
    [com - 4, 40, -280, 0],
    [com + 4, CHIN[0], CHIN[1], 1],
    [sub - 10, CHIN[0], CHIN[1], 1],
    [sub - 2, 150, -470, 1],
    [next + 6, 150, -470, 1],
    [next + 14, 130, -620, 1],
  ]);
  const samR = R(f, [
    [0, 40, -280, 0],
    [sub, 40, -280, 0],
    [sub + 10, 110, -560, 1],
  ]);
  const [yhx, yhy] = HW(YX, Y, 1.0);
  return (
    <>
      <CamK
        keys={[
          [0, 1.6, 560, 380],
          [deal + 2, 1.5, 420, 480, "p"],
          [fiveT + 20, 1.5, 420, 480],
          [com - 4, 1.0, 960, 540],
          [com + 4, 1.9, yhx + 60, yhy + 60, "p"],
          [sub - 10, 1.9, yhx + 60, yhy + 60],
          [sub - 2, 1.15, 1100, 520, "p"],
          [next, 1.15, 1100, 520],
          [next + 10, 1.0, 960, 540],
        ]}
        hits={[fiveT, sub + 14]}
      >
        <PartyRoom f={f} confetti={sub + 14} />
        <Layer>
          <Stick c={MIA} x={MX} y={MY} s={0.85} f={f} expr="happy" look={0.5} seed={1} reachR={miaR} pops={[fiveT]} />
          <Stick c={SAM} x={1690} y={870} s={0.8} f={f} expr="happy" look={-0.5} seed={3} reachR={samR} itemR={<PPopper />} pops={[sub + 14]} />
          <Stick c={ZOE} x={1450} y={890} s={0.88} f={f} expr="happy" look={-0.5} seed={2} pose={poseAt(f, [[0, POSES.idle], [sub + 14, POSES.clap]])} />
          <Stick
            c={YOU}
            x={YX}
            y={Y}
            s={1.0}
            f={f}
            expr={pick(f, [
              [0, "neutral"],
              [deal, "happy"],
              [com, "neutral"],
              [sub, "happy"],
            ] as [number, "neutral" | "happy"][])}
            look={f >= com && f < sub ? 0.3 : -0.2}
            talk={0.35}
            reachL={youL}
            reachR={youR}
            itemR={f >= sub - 6 && f < next + 6 ? <PPhone lit={!clicked} /> : undefined}
            handsFront
            pops={[fiveT, sub + 14]}
          />
          {f >= fiveT && f < fiveT + 14 && <Emote kind="shock" x={hf[0]} y={hf[1]} start={fiveT} end={fiveT + 6} s={0.6} />}
          <Emote kind="think" x={yhx + 130} y={yhy - 150} start={com + 6} end={sub - 8} />
          <Emote kind="heart" x={MX + 40} y={MY - 560} start={fiveT + 4} end={com} s={0.6} />
        </Layer>
        <div style={{ position: "absolute", inset: 0, transform: "translate(130px, 90px) scale(0.5)", transformOrigin: "960px 540px" }}>
          <Cake x={960} y={420} lit={ease(f, 5, 20)} />
        </div>
        <Bubble text="Deal!" x={MX + 40} y={MY - 580} start={fiveT + 2} end={com - 6} />
      </CamK>
      <Punch text="WOULD YOU TAKE THE DEAL?" start={deal - 8} end={com - 4} y={180} size={84} color={GOLD} />
      {f >= com && (
        <div style={{ position: "absolute", left: 820, top: 170, width: 900, padding: "22px 32px", borderRadius: 24, background: "#f6efdf", color: "#16120f", fontFamily: hudFont, fontWeight: 900, fontSize: 40, transform: `scale(${pop(f, com)})`, transformOrigin: "left center", border: "5px solid #16120f" }}>
          <div style={{ fontSize: 24, color: "#6b5e4a", marginBottom: 4 }}>💬 Your comment</div>
          {typed}
          <span style={{ opacity: Math.floor(f / 10) % 2 ? 1 : 0 }}>|</span>
        </div>
      )}
      {f >= sub - 6 && (
        <div style={{ position: "absolute", left: 1270, top: 450, transform: `translate(-50%,0) scale(${pop(f, sub - 6) * (f > sub + 12 && f < sub + 18 ? 0.9 : 1)})`, background: clicked ? "#3a3f4f" : "#e62117", color: "white", fontFamily: hudFont, fontWeight: 900, fontSize: 54, padding: "16px 56px", borderRadius: 60, border: "5px solid #16120f" }}>
          {clicked ? "✓ SUBSCRIBED" : "SUBSCRIBE"}
        </div>
      )}
      {f >= sub && f < sub + 40 && (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <g transform={`translate(${interpolate(ease(f, sub, sub + 14), [0, 1], [1700, 1300])}, ${interpolate(ease(f, sub, sub + 14), [0, 1], [900, 500])})`}>
            <path d="M 0 0 L 0 60 L 16 46 L 28 72 L 40 66 L 28 40 L 50 40 Z" fill="white" stroke="#111" strokeWidth={4} />
          </g>
        </svg>
      )}
      <Burst start={sub + 14} x={1270} y={490} color="#ff6f8f" />
      <Arrow start={com + 20} end={sub - 8} x={790} y={230} dir={0} />
      {f >= next && <Hud label="NEXT VIDEO" value="NEVER SLEEP AGAIN?" start={next} x={1060} y={620} w={760} color={ICE} />}
      <div style={{ position: "absolute", inset: 0, background: "black", opacity: endFade }} />
      {endFade > 0 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: ease(f, voiceEnd + 30, voiceEnd + 50), transform: `scale(${1 + 0.05 * ease(f, voiceEnd + 30, voiceEnd + 120)})` }}>
          <T size={110} color={GOLD} style={{ textShadow: "0 0 40px rgba(255,194,61,0.5)" }}>
            WHAT IF YOU NEVER AGED?
          </T>
        </div>
      )}
      <Vig />
    </>
  );
};

/* =========================================================================
 * Sound cues for the stickman cut: [scene, local frame, sfx, volume]
 * ========================================================================= */
export const stickSfx = (): [SceneId, number, string, number][] => {
  const c: [SceneId, number, string, number][] = [];
  const add = (id: SceneId, fr: number, s: string, v = 0.4) => c.push([id, fr, s, v]);
  const walkSteps = (id: SceneId, a: number, b: number, every = 12) => {
    for (let fr = a; fr < b; fr += every) add(id, fr, "step", 0.22);
  };
  add("hook1", 20, "sparkle", 0.25);
  add("hook1", at("hook1", "stops") + 2, "surprise", 0.35);
  add("hook1", at("hook1", "Forever"), "sting", 0.3);
  add("hook2", at("hook2", "gray"), "pop", 0.3);
  add("hook2", at("hook2", "wrinkles"), "pop", 0.3);
  add("hook2", at("hook2", "dream"), "sparkle", 0.3);
  add("hook2", at("hook2", "strange"), "think", 0.35);
  add("hook2", at("hook2", "die") - 2, "gasp", 0.45);
  add("hook2", at("hook2", "die") + 25, "shatter", 0.35);
  walkSteps("setup1", 4, 40);
  add("setup1", 56, "click", 0.35);
  add("setup1", 64, "click", 0.35);
  add("setup1", at("setup1", "dozen"), "idea", 0.3);
  add("setup1", at("setup1", "wear"), "regret", 0.25);
  add("setup2", at("setup2", "pause"), "click", 0.5);
  add("setup2", at("setup2", "next") - 4, "think", 0.4);
  add("years", at("years", "notice") + 3, "surprise", 0.3);
  add("years", at("years", "notice") + 9, "think", 0.3);
  add("years", at("years", "notice") + 52, "sparkle", 0.3);
  walkSteps("same", at("same", "skin") - 50, at("same", "skin") - 20);
  add("same", at("same", "heart"), "heartbeat", 0.4);
  add("same", at("same", "exactly"), "surprise", 0.35);
  add("same", at("same", "exactly") + 44, "sparkle", 0.3);
  add("telomeres", 24, "think", 0.35);
  add("telomeres", at("telomeres", "Eventually") + 25, "regret", 0.3);
  add("telomeres", at("telomeres", "frozen"), "surprise", 0.35);
  add("telomeres", at("telomeres", "clock"), "idea", 0.35);
  walkSteps("jelly", at("jelly", "jellyfish") - 30, at("jelly", "jellyfish") - 6);
  add("jelly", at("jelly", "jellyfish"), "knock", 0.5);
  add("jelly", at("jelly", "eaten"), "gasp", 0.45);
  add("jelly", at("jelly", "sick"), "gulp", 0.4);
  add("math", at("math", "Accidents"), "gulp", 0.45);
  add("math", at("math", "Overdoses"), "heartbeat", 0.4);
  walkSteps("lifespan", 0, at("lifespan", "average", 1), 16);
  add("lifespan", at("lifespan", "thousand"), "surprise", 0.3);
  add("lifespan", at("lifespan", "average", 1), "think", 0.35);
  add("lifespan", at("lifespan", "promise"), "gulp", 0.45);
  walkSteps("year200", 0, 60);
  add("year200", at("year200", "careers") + 20, "regret", 0.25);
  add("risk", at("risk", "car"), "heartbeat", 0.45);
  add("risk", at("risk", "centuries"), "gasp", 0.4);
  add("risk", at("risk", "motorcycle") + 44, "gulp", 0.5);
  walkSteps("twist", 0, at("twist", "greatest"), 16);
  add("twist", at("twist", "greatest"), "riser", 0.35);
  add("twist", at("twist", "smoking") + 10, "pop", 0.25);
  add("twist", at("twist", "diet") + 8, "pop", 0.25);
  add("twist", at("twist", "age"), "idea", 0.35);
  walkSteps("root", at("root", "root") - 30, at("root", "root") - 6);
  add("root", at("root", "root"), "sparkle", 0.35);
  add("root", at("root", "many"), "surprise", 0.3);
  add("lab", at("lab", "clear"), "sparkle", 0.3);
  add("lab", at("lab", "humans") + 4, "think", 0.35);
  add("outro1", at("outro1", "question") + 6, "think", 0.3);
  add("outro1", at("outro1", "time") - 2, "click", 0.4);
  add("outro1", at("outro1", "time"), "ticktock", 0.35);
  add("outro1", at("outro1", "tomorrow"), "heartbeat", 0.45);
  add("outro2", at("outro2", "deal") + 10, "slap", 0.5);
  add("outro2", at("outro2", "comments") + 6, "think", 0.3);
  add("outro2", at("outro2", "subscribe") + 14, "popper", 0.5);
  add("outro2", at("outro2", "subscribe") + 16, "sparkle", 0.3);
  return c;
};
