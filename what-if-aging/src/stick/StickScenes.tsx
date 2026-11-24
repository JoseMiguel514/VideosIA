import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { at, sceneFrames, SceneId } from "../timing";
import { ease, Glow, PauseIcon, pop } from "../kit";
import { Cake, Chromosome, Helix, Protein, ZombieCell } from "../Scenes1";
import { Jelly, Moto, Mouse } from "../Scenes2";
import { POSES, Stick } from "./Stick";
import { DR, MIA, SAM, YOU, ZOE } from "./cast";
import { Aquarium, Bathroom, CarInterior, Cemetery, Corridor, Garage, Lab, NightWindow, Office, PartyRoom, Park, Screen, Street } from "./Env";
import { Cam, CREAM, Frost, GOLD, Hud, hudFont, ICE, Layer, Pill, RED, Tag, Trophy, Vig } from "./Hud";

const D = (id: SceneId) => sceneFrames(id);
const T: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({ children, size = 40, color = "#f6efdf", style }) => (
  <div style={{ fontFamily: hudFont, fontWeight: 900, fontSize: size, color, ...style }}>{children}</div>
);

/* 1 — Party: candles out, everything freezes */
export const S_Hook1: React.FC = () => {
  const f = useCurrentFrame();
  const blow = at("hook1", "blow");
  const out = blow + 14;
  const stop = at("hook1", "stops");
  const ff = Math.min(f, stop); // frozen clock
  const lit = 1 - ease(f, out, out + 8);
  const clapA = Math.sin(ff / 3) * 25;
  const clap = { l: [20, -130 + clapA] as [number, number], r: [20, -130 + clapA] as [number, number] };
  const youExpr = f >= blow && f < out + 10 ? "blow" : f >= stop ? "surprised" : "happy";
  return (
    <>
      <Cam dur={D("hook1")} z={[1.0, 1.12]} oy={420}>
        <PartyRoom f={ff} />
        <Layer>
          <Stick c={SAM} x={1700} y={860} s={0.78} f={ff} expr="happy" pose={POSES.holdR} look={-0.6} seed={3} />
          <Stick c={MIA} x={430} y={890} s={0.9} f={ff} expr="happy" pose={clap} look={0.6} seed={1} />
          <Stick c={ZOE} x={1460} y={890} s={0.9} f={ff} expr="happy" pose={clap} look={-0.6} seed={2} />
          <Stick c={YOU} x={960} y={850} s={1.0} f={ff} expr={youExpr} pose={POSES.hold} lean={f >= blow && f < out + 10 ? 6 : 0} look={0} lookY={f >= blow && f < stop ? 0.5 : 0} />
          <rect x={560} y={720} width={800} height={40} rx={8} fill="#5a3a26" stroke="#1a110b" strokeWidth={6} />
          <rect x={590} y={760} width={740} height={320} fill="#3d281a" />
        </Layer>
        <Cake x={960} y={505} s={0.62} lit={lit} outAt={out} frozenAt={stop} />
      </Cam>
      <Frost start={stop} />
      <Hud label="BIOLOGICAL AGE" value={f >= stop ? "25 · PAUSED" : "25"} color={f >= stop ? ICE : GOLD} start={6} x={1420} w={460} />
      <PauseIcon start={stop} x={960} y={200} size={120} />
      <Pill text="NOT YOUR LIFE." start={at("hook1", "life")} end={at("hook1", "aging") - 4} x={960} y={110} />
      <Pill text="YOUR AGING." start={at("hook1", "aging")} x={960} y={110} color={ICE} />
      <Tag text="FOREVER" start={at("hook1", "Forever")} x={960} y={300} color="#1f8fb3" />
      <Vig />
    </>
  );
};

/* 2 — Mirror check, then the dark turn */
export const S_Hook2: React.FC = () => {
  const f = useCurrentFrame();
  const die = at("hook2", "die");
  const red = ease(f, die - 4, die + 10);
  const items = [
    { t: "GRAY HAIR", w: "gray", y: 300 },
    { t: "WRINKLES", w: "wrinkles", y: 400 },
    { t: "SLOWING DOWN", w: "slowing", y: 500 },
  ];
  const expr = f >= die ? "worried" : f >= at("hook2", "strange") ? "confused" : "happy";
  return (
    <>
      <Cam dur={D("hook2")} z={[1.0, 1.15]} ox={760} oy={460}>
        <Bathroom f={f} red={red} />
        <Layer>
          <Stick c={YOU} x={760} y={920} s={1.12} f={f} expr={expr} pose={f >= die ? POSES.cross : POSES.holdR} look={f >= die ? 0 : 0.7} sweat={f >= die} tremble={f >= die ? 0.6 : 0} />
          {/* hand mirror */}
          {f < die && (
            <g transform={`translate(${760 + 20}, ${920 - 300 * 1.12})`}>
              <rect x={-6} y={0} width={12} height={70} fill="#c9b48a" />
              <ellipse cx={0} cy={-30} rx={40} ry={50} fill="#9fd3e6" stroke="#c9b48a" strokeWidth={8} />
            </g>
          )}
        </Layer>
      </Cam>
      {items.map((it) => (
        <Pill key={it.t} text={`✕  ${it.t}`} start={at("hook2", it.w) - 4} end={die - 8} x={1440} y={it.y} />
      ))}
      <Tag text="SOUNDS LIKE A DREAM" start={at("hook2", "dream")} end={die - 8} x={1440} y={640} color="#d9951a" />
      {f >= die && (
        <div style={{ position: "absolute", left: 1150, top: 260, width: 640, textAlign: "center", transform: `scale(${pop(f, die, 9)})` }}>
          <T size={64}>BUT YOU'D STILL</T>
          <T size={220} color={RED} style={{ lineHeight: 1, textShadow: "0 0 40px rgba(232,52,63,0.7)" }}>
            DIE
          </T>
        </div>
      )}
      <Pill text="...just not the way you think" start={at("hook2", "think") - 10} x={1470} y={700} size={36} />
      <Vig />
    </>
  );
};

/* 3 — Dr. Reyes at the lab screen: 12 hallmarks */
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
  const wear = at("setup1", "wear");
  return (
    <>
      <Cam dur={D("setup1")} z={[1.04, 1.0]}>
        <Lab f={f} />
        <Screen x={760} y={90} w={1060} h={640}>
          {f < dozen - 4 ? (
            <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center" }}>
              <T size={84} color={ICE}>AGING ≠ ONE THING</T>
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
                        transform: `scale(${f >= st ? pop(f, st) : 0})`,
                        border: `3px solid ${worn > 0.5 ? RED : ICE}`,
                        borderRadius: 10,
                        padding: "10px 12px",
                        fontFamily: hudFont,
                        fontWeight: 800,
                        fontSize: 24,
                        color: "#e9f6ff",
                        background: "rgba(127,230,255,0.06)",
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
          <Stick c={DR} x={400} y={900} s={1.05} f={f} expr="neutral" pose={f >= dozen ? POSES.pointUp : POSES.idle} look={0.5} tilt={f < dozen ? Math.sin(f / 6) * 6 : 0} />
        </Layer>
      </Cam>
      <Vig />
    </>
  );
};

/* 4 — Damage on screen, then the pause button */
export const S_Setup2: React.FC = () => {
  const f = useCurrentFrame();
  const pause = at("setup2", "pause");
  const fz = Math.min(f, pause);
  const items = [
    { label: "DNA DAMAGE", st: at("setup2", "DNA"), el: <Helix f={fz} /> },
    { label: "WORN-OUT PROTEINS", st: at("setup2", "Worn"), el: <Protein f={fz} /> },
    { label: "'ZOMBIE' CELLS", st: at("setup2", "Cells"), el: <ZombieCell f={fz} /> },
  ];
  const drPose = f >= pause - 6 ? POSES.point : f >= items[0].st ? POSES.pointUp : POSES.idle;
  return (
    <>
      <Cam dur={D("setup2")} z={[1.0, 1.05]}>
        <Lab f={fz} />
        <Screen x={760} y={90} w={1060} h={640} glow={f >= pause ? "#7fe6ff" : "#4fe3ff"}>
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
          <Stick c={DR} x={400} y={900} s={1.05} f={fz} expr={f >= pause ? "bored" : "neutral"} pose={drPose} look={0.5} />
          {f >= pause - 6 && <rect x={400 + 88 * 1.05 + 70} y={900 - 400 * 1.05 - 14} width={46} height={26} rx={6} fill="#2a2f38" stroke={ICE} strokeWidth={3} />}
        </Layer>
      </Cam>
      <Frost start={pause} />
      <Hud label="ALL DAMAGE" value={f >= pause ? "PAUSED" : "ACTIVE"} color={f >= pause ? ICE : RED} start={items[0].st} x={1500} y={760} w={380} />
      <Pill text="WHAT HAPPENS NEXT?" start={at("setup2", "next") - 8} x={540} y={140} color={ICE} size={50} />
      <Vig />
    </>
  );
};

/* 5 — Friends age, you don't */
export const S_Years: React.FC = () => {
  const f = useCurrentFrame();
  const p = ease(f, at("years", "first"), at("years", "thirty") + 20, (x) => x);
  const notice = at("years", "notice");
  const friends = [
    { c: MIA, x: 330, seed: 1 },
    { c: ZOE, x: 690, seed: 2 },
    { c: SAM, x: 1590, seed: 3 },
  ];
  return (
    <>
      <Cam dur={D("years")} z={[1.0, 1.06]}>
        <Street f={f} tint={p > 0.5 ? "#2a2a4a" : "#4a2f4a"} />
        <Layer>
          {friends.map((fr) => (
            <Stick
              key={fr.c.name}
              c={fr.c}
              x={fr.x}
              y={900}
              s={0.95}
              f={f}
              age={p * 0.85}
              expr={f >= notice + fr.seed * 3 ? "confused" : "neutral"}
              look={fr.x < 960 ? 0.6 : -0.6}
              seed={fr.seed}
            />
          ))}
          <Stick c={YOU} x={1130} y={900} s={0.95} f={f} expr="happy" pose={POSES.wave} look={-0.2} />
          {friends.map((fr) =>
            f >= notice + fr.seed * 3 ? (
              <text
                key={fr.c.name}
                x={fr.x + 70}
                y={300}
                fontFamily={hudFont}
                fontWeight={900}
                fontSize={90}
                fill={GOLD}
                transform={`rotate(${10 * Math.sin(f / 6 + fr.seed)} ${fr.x + 70} 270)`}
              >
                ?
              </text>
            ) : null,
          )}
        </Layer>
      </Cam>
      {friends.map((fr) => (
        <Pill key={fr.c.name} text={`${25 + Math.round(p * 10)}`} start={8} x={fr.x} y={600} size={40} />
      ))}
      <Pill text="25" start={8} x={1130} y={600} size={40} color={ICE} />
      <Hud label="YEARS PASSED" value={`+${Math.round(p * 10)}`} start={2} />
      <Vig />
    </>
  );
};

/* 6 — Check-up: everything still 25 */
export const S_Same: React.FC = () => {
  const f = useCurrentFrame();
  const young = at("same", "young");
  const ex = at("same", "exactly");
  const rows = [
    { t: "SKIN", w: "skin" },
    { t: "JOINTS", w: "joints" },
    { t: "HEART", w: "heart" },
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
  return (
    <>
      <Cam dur={D("same")} z={[1.0, 1.07]} ox={900}>
        <Office f={f} />
        {/* wall monitor */}
        <div style={{ position: "absolute", left: 1520, top: 150, width: 330, height: 200, borderRadius: 12, background: "#08120f", border: "10px solid #111" }}>
          <svg width={310} height={180}>
            <path d={ecg} transform="translate(5 95)" stroke="#5dff8f" strokeWidth={4} fill="none" />
          </svg>
        </div>
        {/* photo frames on the wall */}
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
                transform: `scale(${pop(f, young + i * 8)}) rotate(${i ? 3 : -3}deg)`,
                boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
              }}
            >
              <svg width={210} height={210} style={{ position: "absolute", left: 15, top: 15, background: "#3b5a7a" }}>
                <defs>
                  <filter id={`rimP${i}`} x="-25%" y="-25%" width="150%" height="150%">
                    <feMorphology in="SourceAlpha" operator="dilate" radius={5} result="d" />
                    <feFlood floodColor={CREAM} />
                    <feComposite in2="d" operator="in" result="o" />
                    <feMerge>
                      <feMergeNode in="o" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <Stick c={YOU} x={105} y={370} s={0.52} f={0} expr="happy" rim={`rimP${i}`} shadow={false} />
              </svg>
              <T size={40} color="#222" style={{ position: "absolute", bottom: 14, width: "100%", textAlign: "center" }}>
                {lbl}
              </T>
            </div>
          ))}
        <Layer>
          {/* exam table */}
          <rect x={250} y={740} width={420} height={40} rx={10} fill="#d9e2ea" stroke="#0b0a0c" strokeWidth={5} />
          <rect x={290} y={780} width={30} height={110} fill="#8794a2" />
          <rect x={600} y={780} width={30} height={110} fill="#8794a2" />
          <Stick c={YOU} x={460} y={890} s={0.95} f={f} sit expr={f >= ex ? "happy" : "neutral"} look={0.5} />
          <Stick
            c={DR}
            x={1280}
            y={900}
            s={1.0}
            f={f}
            expr={f >= ex ? "surprised" : "neutral"}
            pose={f >= young ? POSES.pointUpL : POSES.hold}
            look={f >= young ? -0.5 : -0.7}
            lookY={f >= young ? -0.5 : 0}
          />
          {f < young && <rect x={1280 - 40} y={900 - 300} width={80} height={100} rx={6} fill="#e9e2d4" stroke="#0b0a0c" strokeWidth={4} />}
        </Layer>
      </Cam>
      <div style={{ position: "absolute", left: 1460, top: 410 }}>
        {rows.map((r, i) =>
          f >= at("same", r.w) ? (
            <div key={r.t} style={{ display: "flex", justifyContent: "space-between", width: 380, padding: "10px 22px", marginBottom: 10, borderRadius: 14, background: "rgba(14,12,12,0.88)", transform: `scale(${pop(f, at("same", r.w))})` }}>
              <T size={40}>{r.t}</T>
              <T size={40} color={ICE}>
                AGE 25 ✓
              </T>
            </div>
          ) : null,
        )}
      </div>
      {f >= ex && (
        <div style={{ position: "absolute", left: 830, top: 330, transform: `translate(-50%,-50%) rotate(-8deg) scale(${pop(f, ex + 4, 8)})`, border: `8px solid ${RED}`, borderRadius: 14, padding: "0 30px", fontFamily: hudFont, fontWeight: 900, fontSize: 90, color: RED, background: "rgba(14,12,12,0.6)" }}>
          IDENTICAL
        </div>
      )}
      <Vig />
    </>
  );
};

/* 7 — Telomeres on the lab monitor */
export const S_Telomeres: React.FC = () => {
  const f = useCurrentFrame();
  const div = at("telomeres", "divide");
  const stop = at("telomeres", "Eventually") + 25;
  const frozen = at("telomeres", "frozen");
  const clock = at("telomeres", "clock");
  const nMax = Math.max(1, Math.floor((stop - div) / 12));
  const n = Math.max(0, Math.floor((Math.min(f, stop) - div) / 12));
  const yours = Math.max(0, Math.floor((f - div) / 12));
  const capR = 30 * (1 - 0.85 * Math.min(1, n / nMax));
  const rightIn = pop(f, frozen - 6);
  return (
    <>
      <Cam dur={D("telomeres")} z={[1.0, 1.08]} oy={380}>
        <Lab f={f} />
        <Screen x={460} y={70} w={1000} h={620}>
          <svg width={972} height={592}>
            <defs>
              <Glow id="capglow" color="#7fe6ff" std={8} />
            </defs>
            <text x={486} y={60} textAnchor="middle" fontFamily={hudFont} fontWeight={900} fontSize={44} fill={GOLD}>
              {f >= at("telomeres", "telomeres") - 6 ? "TELOMERES = PROTECTIVE CAPS" : "INSIDE YOUR CELLS"}
            </text>
            <g transform={`translate(${interpolate(rightIn, [0, 1], [486, 250])}, 300) scale(0.8)`}>
              <Chromosome capR={capR} capColor={f >= stop ? RED : GOLD} />
            </g>
            <text x={interpolate(rightIn, [0, 1], [486, 250])} y={520} textAnchor="middle" fontFamily={hudFont} fontWeight={900} fontSize={34} fill={f >= stop ? RED : "#e9f6ff"}>
              {f >= stop ? "DIVISION STOPPED" : f >= div ? `NORMAL CELL · DIVISIONS: ${n}` : "NORMAL CELL"}
            </text>
            {f >= frozen - 6 && (
              <g opacity={rightIn}>
                <g transform={`translate(722, 300) scale(${0.8 * rightIn})`}>
                  <Chromosome capR={30} capColor={ICE} glow />
                </g>
                <text x={722} y={520} textAnchor="middle" fontFamily={hudFont} fontWeight={900} fontSize={34} fill={ICE}>
                  {f >= clock ? "YOUR CELL · CLOCK FROZEN ∞" : `YOUR CELL · DIVISIONS: ${yours}`}
                </text>
              </g>
            )}
          </svg>
        </Screen>
        <Layer>
          <Stick c={DR} x={250} y={1000} s={1.15} f={f} expr="neutral" pose={POSES.pointUp} look={0.6} />
          <Stick c={YOU} x={1680} y={1000} s={1.15} f={f} expr={f >= frozen ? "surprised" : "neutral"} look={-0.6} lookY={-0.4} pose={f >= frozen ? POSES.idle : POSES.think} />
        </Layer>
      </Cam>
      <Vig />
    </>
  );
};

/* 8 — Aquarium: the "immortal" jellyfish */
export const S_Jelly: React.FC = () => {
  const f = useCurrentFrame();
  const juv = at("jelly", "juvenile");
  const again = at("jelly", "Again");
  const eaten = at("jelly", "eaten");
  const sick = at("jelly", "sick");
  const imm = at("jelly", "immortal");
  const polyp = interpolate(f, [juv - 10, juv + 15, again, again + 15, again + 30, again + 45], [0, 1, 0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fishX = interpolate(f, [eaten - 15, eaten + 35], [1500, -500], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sickAmt = ease(f, sick, sick + 15);
  return (
    <>
      <Cam dur={D("jelly")} z={[1.0, 1.06]}>
        <Aquarium f={f} />
        {/* tank */}
        <div style={{ position: "absolute", left: 460, top: 90, width: 1000, height: 700, borderRadius: 30, background: "linear-gradient(#0d6f96aa, #06304a)", border: "16px solid #0b1a24", overflow: "hidden", boxShadow: "0 0 80px rgba(80,200,255,0.35)" }}>
          <svg width={968} height={668}>
            <defs>
              <Glow id="jg" color="#ff6fae" std={14} />
            </defs>
            <g transform={`translate(484, ${330 + 12 * Math.sin(f / 20)})`} filter="url(#jg)" opacity={f > eaten + 10 ? 0.5 : 1} style={{ filter: `url(#jg) saturate(${1 - sickAmt})` }}>
              <Jelly f={f} polyp={polyp} />
            </g>
            {f > eaten - 15 && f < eaten + 40 && (
              <g transform={`translate(${fishX}, 340) scale(0.9)`}>
                <path d="M -260 0 Q -120 -130 120 -40 L 260 -110 L 220 0 L 260 110 L 120 40 Q -120 130 -260 0 Z" fill="#0a1626" stroke="#22405e" strokeWidth={4} />
                <path d="M -230 10 L -180 30 L -150 8 L -120 32 L -90 8" stroke="#dfe6f5" strokeWidth={6} fill="none" />
                <circle cx={-170} cy={-30} r={10} fill={GOLD} />
              </g>
            )}
          </svg>
          {sickAmt > 0 && <div style={{ position: "absolute", inset: 0, background: "rgba(232,52,63,0.2)", opacity: sickAmt * (1 - ease(f, imm - 10, imm)) }} />}
        </div>
        <Layer>
          <Stick c={YOU} x={260} y={950} s={1.05} f={f} expr={f >= eaten && f < sick + 20 ? "surprised" : f >= imm ? "sad" : "happy"} look={0.7} lookY={-0.3} pose={f >= juv && f < eaten ? POSES.pointUp : POSES.idle} />
          <Stick c={DR} x={1660} y={950} s={1.05} f={f} expr={f >= imm ? "bored" : "neutral"} look={-0.7} pose={POSES.hips} />
        </Layer>
      </Cam>
      <Pill text="TURRITOPSIS DOHRNII" start={at("jelly", "jellyfish")} x={960} y={60} color="#ff9ec7" size={40} />
      <Hud label="LIFE CYCLE" value={polyp > 0.5 ? "JUVENILE" : "ADULT"} start={juv - 10} color="#ff9ec7" y={130} />
      <Tag text="STILL GETS EATEN" start={eaten + 12} x={560} y={860} />
      <Tag text="STILL GETS SICK" start={sick} x={1360} y={860} />
      {f >= imm - 8 && (
        <div style={{ position: "absolute", left: 960, top: 450, transform: `translate(-50%,-50%) scale(${pop(f, imm - 8)})` }}>
          <T size={96} style={{ textShadow: "0 0 30px rgba(232,52,63,0.8), 0 6px 0 #000", whiteSpace: "nowrap" }}>
            NOT AGING ≠ IMMORTAL
          </T>
        </div>
      )}
      <Vig />
    </>
  );
};

/* 9 — Risk chart on the office TV */
export const S_Math: React.FC = () => {
  const f = useCurrentFrame();
  const long = at("math", "long");
  const never = at("math", "never");
  const kills = at("math", "kills");
  const X0 = 90,
    X1 = 520,
    Y0 = 470,
    Y1 = 110;
  const ax = (a: number) => X0 + ((a - 20) / 80) * (X1 - X0);
  const ay = (v: number) => Y0 - v * (Y0 - Y1);
  let normal = "";
  for (let a = 20; a <= 100; a += 2) {
    const v = a < 30 ? 0.12 + (a - 20) * 0.002 : 0.14 + (a - 30) * 0.0123;
    normal += `${a === 20 ? "M" : "L"} ${ax(a)} ${ay(v)}`;
  }
  const drawN = ease(f, long, long + 60);
  const drawF = ease(f, never + 10, never + 50);
  const causes = [
    { t: "Accidents", w: "Accidents" },
    { t: "Car crashes", w: "Car" },
    { t: "Overdoses", w: "Overdoses" },
    { t: "Violence", w: "Violence" },
  ];
  const acc = at("math", "Accidents");
  return (
    <>
      <Cam dur={D("math")} z={[1.0, 1.05]}>
        <Office f={f} />
        <Screen x={460} y={80} w={1000} h={600} glow="#ffb36b">
          <svg width={972} height={572}>
            <line x1={X0} y1={Y0} x2={X1 + 20} y2={Y0} stroke="#7f93a8" strokeWidth={4} />
            <line x1={X0} y1={Y0} x2={X0} y2={Y1 - 30} stroke="#7f93a8" strokeWidth={4} />
            {[20, 40, 60, 80, 100].map((a) => (
              <text key={a} x={ax(a)} y={Y0 + 36} textAnchor="middle" fontFamily={hudFont} fontWeight={800} fontSize={24} fill="#7f93a8">
                {a}
              </text>
            ))}
            <text x={(X0 + X1) / 2} y={Y0 + 72} textAnchor="middle" fontFamily={hudFont} fontWeight={900} fontSize={26} fill="#e9f6ff">AGE</text>
            <text x={X0 - 30} y={(Y0 + Y1) / 2} textAnchor="middle" fontFamily={hudFont} fontWeight={900} fontSize={22} fill="#e9f6ff" transform={`rotate(-90 ${X0 - 30} ${(Y0 + Y1) / 2})`}>
              YEARLY RISK OF DYING (LOG)
            </text>
            <path d={normal} stroke={RED} strokeWidth={7} fill="none" pathLength={1} strokeDasharray={`${drawN} 1`} strokeLinecap="round" />
            {drawN > 0.95 && <text x={ax(80)} y={ay(0.95)} textAnchor="end" fontFamily={hudFont} fontWeight={900} fontSize={26} fill={RED}>NORMAL AGING</text>}
            <line x1={ax(25)} y1={ay(0.13)} x2={ax(25) + (X1 - ax(25)) * drawF} y2={ay(0.13)} stroke={ICE} strokeWidth={7} strokeLinecap="round" />
            {drawF > 0.9 && <text x={X1} y={ay(0.13) - 16} textAnchor="end" fontFamily={hudFont} fontWeight={900} fontSize={26} fill={ICE}>FROZEN AT 25</text>}
            <text x={X0} y={555} fontFamily={hudFont} fontWeight={800} fontSize={16} fill="#6b7d90">Illustrative shape, not real data</text>
            {f >= kills && (
              <text x={760} y={80} textAnchor="middle" fontFamily={hudFont} fontWeight={900} fontSize={32} fill={GOLD} opacity={ease(f, kills, kills + 10)}>
                WHAT KILLS 25-YEAR-OLDS?
              </text>
            )}
          </svg>
        </Screen>
        <Layer>
          <Stick c={DR} x={260} y={920} s={1.05} f={f} expr="neutral" pose={POSES.pointUp} look={0.6} />
          <Stick c={YOU} x={1670} y={920} s={1.05} f={f} expr={f >= acc ? "worried" : "neutral"} sweat={f >= acc} tremble={f >= acc ? 0.4 : 0} look={-0.6} lookY={-0.3} pose={f >= acc ? POSES.cross : POSES.idle} />
        </Layer>
      </Cam>
      <Pill text="Disease" start={kills + 15} struck={at("math", "disease")} x={1210} y={260} size={34} color="#7f93a8" />
      {causes.map((c, i) => (
        <Pill key={c.t} text={c.t} start={at("math", c.w)} x={1210} y={350 + i * 80} size={34} color={RED} />
      ))}
      <Vig />
    </>
  );
};

/* 10 — Walking down the corridor of years */
export const S_Lifespan: React.FC = () => {
  const f = useCurrentFrame();
  const sev = at("lifespan", "several");
  const th = at("lifespan", "thousand");
  const avg = at("lifespan", "average", 1);
  const years = interpolate(f, [0, 20, sev, sev + 45, th - 5, th + 30], [0, 80, 80, 500, 500, 1000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const travel = interpolate(f, [0, avg], [0, 3.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const walking = f < avg;
  return (
    <>
      <Corridor signs={["80", "250", "500", "750", "1000"]} travel={travel} />
      <Layer>
        <Stick c={YOU} x={960} y={960} s={1.0} f={f} walk={walking ? f / 4 : undefined} expr={f >= avg ? "worried" : "happy"} sweat={f >= avg} />
      </Layer>
      <Hud label="LIFESPAN?" value={years >= 999 ? "~1,000 YRS" : `${Math.round(years)} YRS`} start={2} w={440} x={1440} />
      <Pill text="A typical life today" start={6} end={sev} x={300} y={110} size={34} color={GOLD} />
      <Pill text="Rough estimate, not a measured figure" start={sev} end={avg - 4} x={420} y={110} size={30} />
      <Pill text="AN AVERAGE." start={avg} x={560} y={480} size={56} />
      <Tag text="NOT A PROMISE" start={at("lifespan", "promise") - 4} x={1360} y={480} size={56} />
      <Vig />
    </>
  );
};

/* 11 — Cemetery at dusk, centuries later */
export const S_Year200: React.FC = () => {
  const f = useCurrentFrame();
  const hund = at("year200", "hundredth");
  const bye = at("year200", "goodbye");
  const car = at("year200", "careers");
  const age = interpolate(f, [0, hund + 20], [25, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eraF = (age - 25) / 25;
  return (
    <>
      <Cam dur={D("year200")} z={[1.12, 1.0]} oy={600}>
        <Cemetery f={f} era={Math.floor(eraF)} mix={eraF - Math.floor(eraF)} />
        <Layer>
          <Stick c={YOU} x={960} y={930} s={1.05} f={f} expr={f >= bye ? "sad" : "neutral"} pose={POSES.hold} lookY={f >= bye ? 0.6 : 0} tilt={f >= bye ? 6 : 0} />
          {/* flowers */}
          <g transform={`translate(${960 - 4}, ${930 - 250})`}>
            <line x1={0} y1={0} x2={0} y2={-60} stroke="#3a7a3a" strokeWidth={5} />
            {[-14, 0, 14].map((dx) => (
              <circle key={dx} cx={dx} cy={-66 - Math.abs(dx) * 0.3} r={10} fill="#ff6f9a" />
            ))}
          </g>
        </Layer>
      </Cam>
      <Hud label="YOUR AGE" value={`${Math.round(age)}`} start={2} />
      <Pill text="LOOKS: 25" start={10} x={1690} y={240} size={34} color={ICE} />
      {["CAREER #1", "CAREER #2", "CAREER #3"].map((c, i) => (
        <Pill key={c} text={c} start={car + i * 6} struck={car + 18 + i * 6} x={560 + i * 400} y={160} size={40} />
      ))}
      <Vig />
    </>
  );
};

/* 12 — Car seat nerves, then the motorcycle */
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
    return (
      <>
        <Cam dur={D("risk")} z={[1.05, 1.1]}>
          <Garage f={f} />
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <g transform={`translate(${interpolate(p, [0, 1], [1400, 1150])}, 720) scale(1.7)`}>
              <Moto f={0} />
            </g>
          </svg>
          <Layer>
            <Stick c={YOU} x={560} y={920} s={1.05} f={f} expr="worried" sweat pose={POSES.hesitant} look={0.7} tremble={0.5} lean={-4} />
          </Layer>
        </Cam>
        <Tag text="DO NOT TOUCH?" start={moto + 4} x={1150} y={420} />
        <div style={{ position: "absolute", left: 760, top: 140, fontFamily: hudFont, fontWeight: 900, fontSize: 200, color: GOLD, transform: `rotate(${8 * Math.sin(f / 8)}deg) scale(${pop(f, moto + 10)})` }}>?</div>
        <Hud label="AT STAKE" value="CENTURIES" start={0} color={RED} w={440} x={1440} />
        <Vig />
      </>
    );
  }
  return (
    <>
      <Cam dur={D("risk")} z={[1.0, 1.1]} oy={420}>
        <CarInterior f={f} />
        <Layer>
          {/* seat */}
          <rect x={790} y={260} width={290} height={760} rx={50} fill="#1b2430" stroke="#0b0a0c" strokeWidth={6} />
          <Stick c={YOU} x={935} y={1000} s={1.05} f={f} sit expr={f >= at("risk", "car") ? "worried" : "neutral"} sweat={f >= at("risk", "car")} pose={POSES.cross} tremble={f >= cent ? 0.8 : 0.3} />
          {/* seatbelt */}
          <path d={`M ${935 - 55} ${1000 - 420} L ${935 + 40} ${1000 - 160}`} stroke="#c9a640" strokeWidth={26} />
          <path d={`M ${935 + 55} ${1000 - 420} L ${935 - 40} ${1000 - 160}`} stroke="#c9a640" strokeWidth={26} />
          <rect x={935 - 20} y={1000 - 185} width={40} height={30} rx={4} fill="#c9ced6" />
        </Layer>
      </Cam>
      {tags.map((t, i) => (
        <Tag key={t.t} text={t.t} start={at("risk", t.w)} x={1340} y={330 + i * 80} />
      ))}
      <Hud label="AT STAKE" value={f >= cent ? "CENTURIES" : "A LIFETIME"} color={f >= cent ? RED : GOLD} start={4} w={440} x={1440} />
      <Pill text="SOMETHING SHIFTS" start={2} end={at("risk", "car") - 4} x={480} y={160} />
      <Vig />
    </>
  );
};

/* 13 — Hospital corridor: the twist */
export const S_Twist: React.FC = () => {
  const f = useCurrentFrame();
  const flash = interpolate(f, [0, 4, 20], [0.6, 0.4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const age = at("twist", "age");
  const travel = interpolate(f, [0, at("twist", "greatest")], [0, 2.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const big = f >= at("twist", "greatest");
  return (
    <>
      <Corridor signs={["CARDIOLOGY", "ONCOLOGY", "NEUROLOGY"]} travel={travel} cool signColor="#d6e6f2" />
      <div style={{ position: "absolute", inset: 0, background: RED, opacity: flash }} />
      <Layer>
        <Stick c={DR} x={960} y={980} s={1.0} f={f} walk={!big ? f / 4 : undefined} expr={big ? "neutral" : "bored"} pose={big ? POSES.hips : POSES.idle} />
      </Layer>
      <Pill text="THE TWIST" start={at("twist", "twist") - 6} end={at("twist", "heart") - 4} x={960} y={110} color={RED} size={54} />
      <Pill text="Heart disease" start={at("twist", "heart")} x={330} y={110} size={34} color={RED} />
      <Pill text="Many cancers" start={at("twist", "cancers")} x={960} y={110} size={34} color={RED} />
      <Pill text="Alzheimer's" start={at("twist", "Alzheimer")} x={1580} y={110} size={34} color={RED} />
      {big && <div style={{ position: "absolute", inset: 0, background: "rgba(5,8,14,0.45)", opacity: ease(f, at("twist", "greatest"), at("twist", "greatest") + 10) }} />}
      <Hud label="#1 RISK FACTOR" value={f >= age ? "AGE" : "???"} start={at("twist", "greatest")} x={760} y={200} w={400} />
      <Pill text="SMOKING" start={at("twist", "smoking") - 4} struck={at("twist", "smoking") + 12} x={420} y={470} size={52} />
      <Pill text="DIET" start={at("twist", "diet") - 4} struck={at("twist", "diet") + 10} x={1500} y={470} size={52} />
      <Trophy label="AGE ITSELF" start={age - 4} x={960} y={560} />
      <Vig />
    </>
  );
};

/* 14 — The tree: aging at the root */
export const S_Root: React.FC = () => {
  const f = useCurrentFrame();
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
  return (
    <>
      <Cam dur={D("root")} z={[1.0, 1.06]} oy={500}>
        <Park f={f} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <Glow id="rg" color={GOLD} std={12} />
          </defs>
          {[[600, 220, 160], [960, 150, 200], [1320, 220, 160]].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y + 60} r={r} fill="#3d5a3a" opacity={0.85 * grow} />
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
          <Stick c={YOU} x={300} y={950} s={0.95} f={f} expr={f >= root ? "surprised" : "neutral"} look={0.6} lookY={-0.5} />
          <Stick c={DR} x={1620} y={950} s={0.95} f={f} expr="neutral" pose={POSES.pointL} look={-0.6} />
        </Layer>
      </Cam>
      <Pill text="NOT JUST CHASING YOUTH" start={at("root", "youth") - 8} end={root - 6} x={960} y={70} size={40} />
      {rootGlow > 0 && <Tag text="AGING" start={root} x={960} y={690} color="#c48612" size={52} />}
      {leaves.map((l, i) => (
        <Pill key={l.t} text={l.t} start={many + i * 5} x={l.x} y={l.y} size={32} color={RED} />
      ))}
      <Vig />
    </>
  );
};

/* 15 — Senolytics in mice; humans: not yet */
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
  return (
    <>
      <Cam dur={D("lab")} z={[1.0, f >= yet ? 1.25 : 1.05]} ox={500} oy={500}>
        <Lab f={f} />
        <Screen x={980} y={90} w={560} h={580}>
          <svg width={532} height={552}>
            <defs>
              <Glow id="zg" color="#7dff9b" std={8} />
            </defs>
            <text x={266} y={46} textAnchor="middle" fontFamily={hudFont} fontWeight={900} fontSize={30} fill="#7dff9b">MICROSCOPE</text>
            {cells.map((c) => {
              const k = c.zombie ? 1 - ease(f, clear + 8 + c.i, clear + 22 + c.i) : 1;
              if (k <= 0) return null;
              return (
                <g key={c.i} transform={`translate(${c.x} ${c.y}) scale(${k})`} filter={c.zombie ? "url(#zg)" : undefined}>
                  <circle r={26} fill={c.zombie ? "rgba(125,255,155,0.35)" : "rgba(255,170,190,0.3)"} stroke={c.zombie ? "#7dff9b" : "#ffb3c6"} strokeWidth={3} />
                  <circle r={9} fill={c.zombie ? "#7dff9b" : "#d4708c"} />
                </g>
              );
            })}
          </svg>
        </Screen>
        <Layer>
          {/* bench + mouse cage */}
          <rect x={1000} y={760} width={700} height={30} fill="#d9e2ea" stroke="#0b0a0c" strokeWidth={5} />
          <rect x={1380} y={640} width={260} height={120} rx={8} fill="rgba(200,230,255,0.18)" stroke="#9fb6c8" strokeWidth={5} />
          <g transform="translate(1500 720) scale(0.4)">
            <Mouse />
          </g>
          <Stick
            c={DR}
            x={560}
            y={920}
            s={1.1}
            f={f}
            expr={f >= yet ? "bored" : f >= hum ? "neutral" : f >= mice ? "happy" : "neutral"}
            pose={f >= hum ? POSES.idle : POSES.point}
            look={f >= yet ? 0 : 0.6}
          />
        </Layer>
      </Cam>
      <Pill text="ANIMAL STUDIES" start={at("lab", "animal") - 6} x={1260} y={60} color="#7dff9b" size={40} />
      <Pill text="'Zombie' cells cleared" start={clear} end={yet - 6} x={1260} y={720} size={30} color="#7dff9b" />
      <Hud label="OLD MICE" value="HEALTHIER" start={mice} color="#7dff9b" x={1550} y={540} w={340} />
      <Hud label="HUMANS" value="STILL EARLY" start={hum} color={GOLD} x={1550} y={700} w={340} />
      {f >= yet - 6 && <div style={{ position: "absolute", inset: 0, background: "rgba(5,11,24,0.35)", opacity: ease(f, yet - 6, yet + 4) }} />}
      {f >= yet - 4 && (
        <div style={{ position: "absolute", left: 1200, top: 330, transform: `translate(-50%,-50%) scale(${pop(f, yet - 4, 10)})` }}>
          <T size={170} color={ICE} style={{ textShadow: "0 0 40px rgba(127,230,255,0.7), 0 8px 0 #000", whiteSpace: "nowrap" }}>
            NOT YET.
          </T>
        </div>
      )}
      <Vig />
    </>
  );
};

/* 16 — Alone by the window with an hourglass */
export const S_Outro1: React.FC = () => {
  const f = useCurrentFrame();
  const tom = at("outro1", "tomorrow");
  const sand = ease(f, 0, 300, (x) => x);
  const danger = ease(f, tom, tom + 10);
  const sc = danger > 0.5 ? RED : GOLD;
  return (
    <>
      <Cam dur={D("outro1")} z={[1.0, 1.12]} ox={700} oy={560}>
        <NightWindow f={f} />
        <Layer>
          <Stick c={YOU} x={620} y={920} s={1.05} f={f} sit expr={f >= tom ? "worried" : "sad"} sweat={f >= tom} look={0.4} lookY={0.4} pose={POSES.hold} tilt={-5} />
          <rect x={420} y={760} width={760} height={30} rx={6} fill="#5a3a26" stroke="#0b0a0c" strokeWidth={5} />
          <rect x={450} y={790} width={20} height={200} fill="#3d281a" />
          <rect x={1130} y={790} width={20} height={200} fill="#3d281a" />
          {/* hourglass */}
          <g transform="translate(960 640) scale(0.42)">
            <rect x={-200} y={-310} width={400} height={30} rx={10} fill="#8a6a45" />
            <rect x={-200} y={280} width={400} height={30} rx={10} fill="#8a6a45" />
            <clipPath id="htop">
              <path d="M -160 -280 L 160 -280 Q 160 -120 14 0 L -14 0 Q -160 -120 -160 -280 Z" />
            </clipPath>
            <clipPath id="hbot">
              <path d="M -14 0 L 14 0 Q 160 120 160 280 L -160 280 Q -160 120 -14 0 Z" />
            </clipPath>
            <rect clipPath="url(#htop)" x={-170} y={-280 + 280 * sand * 0.9} width={340} height={300} fill={sc} />
            <path clipPath="url(#hbot)" d={`M -170 280 L -170 ${280 - 200 * sand} Q 0 ${200 - 330 * sand} 170 ${280 - 200 * sand} L 170 280 Z`} fill={sc} />
            <rect x={-3} y={-10} width={6} height={280 - 120 * sand} fill={sc} />
            <path d="M -160 -280 L 160 -280 Q 160 -120 14 0 Q 160 120 160 280 L -160 280 Q -160 120 -14 0 Q -160 -120 -160 -280 Z" fill="rgba(200,230,255,0.08)" stroke="#cfe6ff" strokeWidth={8} />
          </g>
        </Layer>
      </Cam>
      <Hud label="TIME LEFT" value={f >= tom ? "MAYBE 1 DAY" : "CENTURIES"} color={f >= tom ? RED : GOLD} start={at("outro1", "time") - 6} w={460} x={1420} />
      <Pill text="25 FOREVER?" start={at("outro1", "forever") - 6} x={960} y={90} color={ICE} size={50} />
      <Vig />
    </>
  );
};

/* 17 — Back at the party: the question + CTA */
export const S_Outro2: React.FC<{ voiceEnd: number }> = ({ voiceEnd }) => {
  const f = useCurrentFrame();
  const com = at("outro2", "comments");
  const sub = at("outro2", "subscribe");
  const next = at("outro2", "Next");
  const msg = "The first thing I'd do with 1,000 years is...";
  const typed = msg.slice(0, Math.max(0, Math.floor((f - com - 5) / 1.3)));
  const clicked = f > sub + 15;
  const endFade = ease(f, voiceEnd + 10, voiceEnd + 40);
  return (
    <>
      <Cam dur={D("outro2")} z={[1.08, 1.0]} oy={500}>
        <PartyRoom f={f} />
        <Layer>
          <Stick c={MIA} x={250} y={880} s={0.85} f={f} expr="happy" look={0.5} seed={1} />
          <Stick c={SAM} x={1690} y={870} s={0.8} f={f} expr="happy" look={-0.5} seed={3} />
          <Stick c={ZOE} x={1450} y={890} s={0.88} f={f} expr="happy" look={-0.5} seed={2} pose={POSES.wave} />
          <Stick c={YOU} x={560} y={900} s={1.0} f={f} expr={f >= at("outro2", "deal") ? "happy" : "neutral"} pose={f >= sub ? POSES.point : POSES.hips} look={0.3} />
        </Layer>
        <div style={{ position: "absolute", inset: 0, transform: "translate(130px, 90px) scale(0.5)", transformOrigin: "960px 540px" }}>
          <Cake x={960} y={420} lit={ease(f, 5, 20)} />
        </div>
      </Cam>
      <Pill text="WOULD YOU TAKE THE DEAL?" start={at("outro2", "deal") - 8} x={960} y={80} color={GOLD} size={52} />
      {f >= com && (
        <div style={{ position: "absolute", left: 820, top: 170, width: 900, padding: "22px 32px", borderRadius: 24, background: "#f6efdf", color: "#16120f", fontFamily: hudFont, fontWeight: 900, fontSize: 40, transform: `scale(${pop(f, com)})`, transformOrigin: "left center", border: "5px solid #16120f" }}>
          <div style={{ fontSize: 24, color: "#6b5e4a", marginBottom: 4 }}>💬 Your comment</div>
          {typed}
          <span style={{ opacity: Math.floor(f / 10) % 2 ? 1 : 0 }}>|</span>
        </div>
      )}
      {f >= sub - 6 && (
        <div style={{ position: "absolute", left: 1270, top: 450, transform: `translate(-50%,0) scale(${pop(f, sub - 6) * (f > sub + 12 && f < sub + 18 ? 0.92 : 1)})`, background: clicked ? "#3a3f4f" : "#e62117", color: "white", fontFamily: hudFont, fontWeight: 900, fontSize: 54, padding: "16px 56px", borderRadius: 60, border: "5px solid #16120f" }}>
          {clicked ? "✓ SUBSCRIBED" : "SUBSCRIBE"}
        </div>
      )}
      {f >= next && <Hud label="NEXT VIDEO" value="NEVER SLEEP AGAIN?" start={next} x={1060} y={620} w={760} color={ICE} />}
      <div style={{ position: "absolute", inset: 0, background: "black", opacity: endFade }} />
      {endFade > 0 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: ease(f, voiceEnd + 30, voiceEnd + 50) }}>
          <T size={110} color={GOLD} style={{ textShadow: "0 0 40px rgba(255,194,61,0.5)" }}>
            WHAT IF YOU NEVER AGED?
          </T>
        </div>
      )}
      <Vig />
    </>
  );
};
