import React from "react";
import { interpolate, random } from "remotion";
import { Spec, W, Who } from "./engine";
import { Bedroom, Gym, SkyView } from "./envs";
import { Aquarium, CarInterior, Corridor, Lab, NightWindow, Office, Screen, Street } from "../stick/Env";
import { AwakeClock, BacGauge, BigStat, Brain, Checklist, DayCalendar, Dolphin, Frigate, PressureBalloon, Versus, prog } from "./widgets";
import { DR, MIA, RANDY, SAM, YOU, ZOE } from "../stick/cast";
import { Mouse } from "../Scenes2";
import { GOLD, ICE, RED } from "../stick/Hud";
import { hudFont } from "../stick/Hud";


const hrs = (from: number, to: number, a: W = 0, b: W = 400) => (f: number, A: (w: W) => number) => (
  <AwakeClock hours={interpolate(f, [A(a), A(b)], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
);
export const both = (...fs: ((f: number, A: (w: W) => number) => React.ReactNode)[]) => (f: number, A: (w: W) => number) => <>{fs.map((g, i) => <React.Fragment key={i}>{g(f, A)}</React.Fragment>)}</>;
const bed = (clock: string, morning = 0) => (f: number) => <Bedroom f={f} clock={clock} morning={morning} />;
const inBed = (o: Partial<Who> = {}): Who => ({ c: YOU, x: 700, y: 860, s: 0.95, sit: true, look: 0.5, ...o });
const desk = (x: number) => (
  <g>
    <rect x={x - 260} y={700} width={520} height={34} rx={6} fill="#5a4a3a" stroke="#0b0a0c" strokeWidth={5} />
    <rect x={x - 240} y={734} width={20} height={160} fill="#3a2c22" />
    <rect x={x + 220} y={734} width={20} height={160} fill="#3a2c22" />
    <rect x={x + 20} y={560} width={200} height={130} rx={8} fill="#16181d" stroke="#0b0a0c" strokeWidth={5} />
    <rect x={x + 32} y={572} width={176} height={106} fill="#2a5a8a" opacity={0.8} />
    <rect x={x + 110} y={690} width={20} height={12} fill="#16181d" />
  </g>
);
const screenText = (lines: string[], color = ICE) => (
  <div style={{ padding: 40, display: "flex", flexDirection: "column", gap: 18, justifyContent: "center", height: "100%" }}>
    {lines.map((l) => (
      <div key={l} style={{ fontFamily: hudFont, fontWeight: 900, fontSize: 48, color }}>
        {l}
      </div>
    ))}
  </div>
);

export const SLEEP: Record<string, Spec> = {
  s01: {
    env: (f, A) => <Bedroom f={f} clock={f < A("next") ? "11:58" : f < A("next#2") ? "3:14" : "4:47"} />,
    who: [inBed({ expr: [[0, "neutral"], ["nothing", "confused"], ["never", "surprised"]], act: [[0, "idle"], ["nothing", "scratch"], ["morning", "rub"], ["never", "headHands"]] })],
    ov: [{ t: "punch", w: "never", text: "YOU WILL NEVER SLEEP AGAIN", color: ICE, y: 260 }],
    sfx: [["morning", "ticktock", 0.3]],
    start: "in",
  },
  s02: {
    env: (f) => <Street f={f} tint="#4a2f4a" />,
    who: [{ c: YOU, x: [[0, -100], ["superpower", 760]], expr: [[0, "happy"], ["opinion", "confused"]], act: [[0, "idle"], ["superpower", "cheer"], ["opinion", "shrug"]] }],
    ov: [
      { t: "pill", w: "Eight", text: "+8 HOURS / DAY", x: 1300, y: 260, color: GOLD, size: 56 },
      { t: "pill", w: "work", text: "WORK", x: 1100, y: 380, color: ICE },
      { t: "pill", w: "play", text: "PLAY", x: 1300, y: 380, color: ICE },
      { t: "pill", w: "live", text: "LIVE", x: 1500, y: 380, color: ICE },
      { t: "punch", w: "hour", text: "HOUR BY HOUR", color: GOLD, y: 860 },
    ],
  },
  s02b: {
    env: (f) => <NightWindow f={f} />,
    who: [{ c: YOU, x: 620, y: 920, s: 1.05, sit: true, act: [[0, "think"]], expr: [[0, "neutral"], ["mattered", "surprised"]] }],
    ui: (f, A) => <BigStat value={25} label="YEARS ASLEEP · IF YOU LIVE TO ~80" start={A("twenty-five")} y={200} color={ICE} />,
    ov: [{ t: "pill", w: "third", text: "≈ 1/3 OF YOUR LIFE", x: 1350, y: 620, color: GOLD }],
  },
  s03: {
    env: bed("11:00"),
    who: [{ c: YOU, x: 1000, expr: [[0, "neutral"], ["tired", "bored"]], act: [[0, "idle"], ["tired", "yawn"], ["fine", "idle"]] }],
    ui: (f, A) => (
      <>
        <AwakeClock hours={16} start={0} />
        <PressureBalloon p={prog(f, A("pressure"), A("balloon") + 30) * 0.3} x={400} y={460} />
      </>
    ),
    ov: [{ t: "pill", w: "normal", text: "A NORMAL DAY", x: 960, y: 160, color: ICE }],
    chapter: ["01", "THE FIRST NIGHT"],
  },
  s04: {
    env: (f) => <Lab f={f} />,
    who: [{ c: DR, x: 380, act: [[0, "talk"], ["adenosine", "pointUp"], ["Coffee", "idle"]], talk: [[0, "awake"]], expr: [[0, "neutral"]] }, { c: YOU, x: 1600, item: [["Coffee", "cup"]], act: [[0, "idle"], ["Coffee", "hold"]], expr: [[0, "neutral"], ["while", "confused"]] }],
    ui: (f, A) => <PressureBalloon p={0.3 + prog(f, A("builds"), A("awake") + 20) * 0.3 - (f >= A("blocking") ? 0.15 * prog(f, A("blocking"), A("blocking") + 20) : 0)} x={960} y={420} />,
    ov: [{ t: "tag", w: "blocking", text: "CAFFEINE BLOCKS THE SIGNAL", x: 960, y: 820, color: "#c48612" }],
  },
  s04b: {
    env: (f) => <NightWindow f={f} />,
    who: [{ c: YOU, x: 620, y: 920, s: 1.05, sit: true, act: [[0, "idle"], ["wind", "yawn"]], expr: [[0, "neutral"], ["wind", "bored"]] }],
    ui: (f, A) => <BigStat value={24} prefix="~" suffix="H" label="YOUR INTERNAL CLOCK" start={A("clock")} y={160} color={ICE} />,
    ov: [{ t: "pill", w: "melatonin", text: "MELATONIN ↑ WHEN IT'S DARK", x: 1300, y: 620, color: GOLD }],
  },
  s05: {
    env: (f) => <Office f={f} />,
    who: [{ c: YOU, x: 500, y: 900, act: [[0, "idle"], ["tasks", "rub"]], expr: [[0, "bored"], ["badly", "confused"]], behind: desk(560) }],
    ui: (f, A) => (
      <>
        <AwakeClock hours={17} />
        <BacGauge v={interpolate(f, [A("after"), A("percent")], [0, 0.05], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} start={A("study")} />
      </>
    ),
    ov: [{ t: "pill", w: "Australia", text: "WILLIAMSON & FEYER, 2000", x: 1500, y: 260, color: ICE, size: 34 }],
    chapter: ["02", "AWAKE BUT 'DRUNK'"],
  },
  s06: {
    env: (f) => <CarInterior f={f} />,
    who: [{ c: YOU, x: 935, y: 1000, s: 1.05, sit: true, act: [[0, "grip"], ["drink", "shrug"]], expr: [[0, "bored"], ["drink", "confused"], ["drunk", "worried"]] }],
    ov: [
      { t: "pill", w: "legal", text: "≈ LEGAL DRIVING LIMIT (MANY COUNTRIES)", x: 960, y: 160, color: GOLD, size: 40 },
      { t: "punch", w: "drunk", text: "ALREADY A LITTLE 'DRUNK'", color: RED, y: 300 },
    ],
  },
  s06b: {
    env: (f) => <Street f={f} tint="#1a1a3a" />,
    props: (f) => (
      <g transform={`translate(${960 + Math.sin(f / 14) * 140} 820)`}>
        <rect x={-150} y={-60} width={300} height={70} rx={24} fill="#2f5aa8" stroke="#0b0a0c" strokeWidth={6} />
        <rect x={-90} y={-110} width={170} height={60} rx={18} fill="#2f5aa8" stroke="#0b0a0c" strokeWidth={6} />
        <circle cx={-90} cy={14} r={30} fill="#111" />
        <circle cx={90} cy={14} r={30} fill="#111" />
      </g>
    ),
    ov: [
      { t: "pill", w: "slower", text: "SLOWER REACTIONS", x: 600, y: 200, color: RED },
      { t: "pill", w: "drift", text: "DRIFTING LANES", x: 960, y: 280, color: RED },
      { t: "pill", w: "brake", text: "NO BRAKING", x: 1320, y: 200, color: RED },
    ],
    sfx: [["drift", "whoosh", 0.35]],
  },
  s07: {
    env: bed("6:30", 1),
    who: [{ c: YOU, x: 1000, expr: [[0, "bored"], ["second", "happy"], ["lying", "surprised"]], act: [[0, "rub"], ["second", "cheer"], ["lying", "idle"]] }],
    ui: hrs(24, 24),
    ov: [
      { t: "pill", w: "circadian", text: "CIRCADIAN RHYTHM", x: 600, y: 200, color: ICE },
      { t: "punch", w: "lying", text: "IT'S LYING TO YOU", color: RED, y: 300 },
    ],
  },
  s08: {
    env: (f) => <Office f={f} />,
    who: [{ c: YOU, x: 500, act: [[0, "rub"], ["read", "scratch"], ["emotions", "headHands"]], expr: [[0, "bored"], ["shorter", "angry"], ["read", "confused"], ["emotions", "worried"]], behind: desk(560) }],
    ui: hrs(26, 27),
    ov: [
      { t: "pill", w: "reaction", text: "REACTIONS ↓", x: 1400, y: 300, color: RED },
      { t: "pill", w: "mood", text: "MOOD ↓", x: 1400, y: 400, color: RED },
      { t: "pill", w: "emotions", text: "EMOTIONS ↑↑", x: 1400, y: 500, color: GOLD },
    ],
  },
  s09: {
    env: (f) => <Lab f={f} />,
    who: [{ c: DR, x: 380, act: [[0, "talk"], ["rinse", "pointUp"], ["mice", "idle"]], talk: [[0, "disease"]], expr: [[0, "neutral"]] }],
    props: (f) => (
      <g transform="translate(1500 760) scale(0.45)">
        <Mouse />
      </g>
    ),
    ui: (f, A) => <Brain x={1150} y={420} s={1.1} clean={prog(f, A("flush"), A("flush") + 60)} trash={0.8} label="WHILE YOU SLEEP" />,
    ov: [
      { t: "pill", w: "mice", text: "STUDIES IN MICE", x: 1500, y: 640, color: ICE, world: true },
      { t: "tag", w: "Alzheimer's", text: "INCLUDING A PROTEIN LINKED TO ALZHEIMER'S", x: 960, y: 860, color: "#7a4aa8" },
    ],
  },
  s10: {
    env: (f) => <Lab f={f} />,
    ui: (f, A) => <Brain x={960} y={440} s={1.3} clean={0} trash={0.5 + prog(f, A("trash"), A("trash") + 60) * 0.5} label="TONIGHT: NO CLEANING" />,
    ov: [{ t: "punch", w: "piling", text: "THE TRASH PILES UP", color: GOLD, y: 860 }],
    start: "in",
  },
  s10b: {
    env: (f) => <NightWindow f={f} />,
    props: (f, A) =>
      f >= A("sugary") ? (
        <g>
          {["#e0452f", "#f2c21b", "#8f5bd8", "#ff6f8f"].map((c, i) => (
            <rect key={i} x={1000 + i * 40} y={700 - (i % 2) * 20} width={30} height={50} rx={6} fill={c} stroke="#0b0a0c" strokeWidth={4} />
          ))}
        </g>
      ) : null,
    who: [{ c: YOU, x: 620, y: 920, s: 1.05, sit: true, act: [[0, "idle"], ["hungrier", "reach"]], expr: [[0, "bored"], ["hungrier", "happy"]] }],
    ui: hrs(28, 29),
    ov: [
      { t: "pill", w: "appetite", text: "APPETITE HORMONES SHIFT", x: 1300, y: 260, color: GOLD },
      { t: "pill", w: "sugary", text: "SUGAR · SALT · FAT", x: 1300, y: 360, color: RED },
    ],
  },
  s11: {
    env: (f) => <Office f={f} />,
    who: [{ c: YOU, x: 500, act: [[0, "idle"], ["lose", "facepalm"], ["didn't", "idle"]], expr: [[0, "bored"], ["lose", "neutral"], ["took", "surprised"]], behind: desk(560) }],
    ui: hrs(36, 36),
    props: (f, A) => (f >= A("lose") && f < A("lose") + 40 ? <rect x={0} y={0} width={1920} height={1080} fill="#000" opacity={0.85} /> : null),
    ov: [
      { t: "punch", w: "microsleep", text: "MICROSLEEP", color: ICE, y: 300 },
      { t: "pill", w: "weird", text: "NOW IT GETS WEIRD", x: 960, y: 160, color: GOLD },
    ],
    chapter: ["03", "THE BRAIN STARTS STEALING"],
    sfx: [["lose", "freeze", 0.35]],
  },
  s12: {
    env: (f) => <CarInterior f={f} />,
    who: [{ c: YOU, x: 935, y: 1000, s: 1.05, sit: true, act: [[0, "grip"]], expr: [[0, "bored"], ["remember", "neutral"], ["highway", "worried"]] }],
    props: (f, A) => {
      const b = f >= A("Your") && f < A("Your") + 30;
      return b ? <rect x={0} y={0} width={1920} height={1080} fill="#000" opacity={0.8} /> : null;
    },
    ui: (f, A) => <BigStat value={100} prefix="~" suffix=" M" label="TRAVELLED IN A FEW SECONDS AT HIGHWAY SPEED" start={A("football")} y={180} color={RED} />,
    ov: [{ t: "pill", w: "fraction", text: "FRACTION OF A SECOND → SEVERAL SECONDS", x: 960, y: 820, color: ICE, size: 38 }],
  },
  s12b: {
    env: (f) => <Office f={f} />,
    who: [{ c: DR, x: 420, act: [[0, "talk"], ["limits", "pointUp"]], talk: [[0, "immune"]], expr: [[0, "neutral"]] }],
    ui: (f, A) => <Checklist title="STRICT REST LIMITS" items={[{ t: "PILOTS", at: A("pilots") }, { t: "TRUCK DRIVERS", at: A("truck") }, { t: "MANY OTHER WORKERS", at: A("other") }]} x={1180} y={200} w={620} start={A("pilots")} />,
  },
  s13: {
    env: (f) => <Street f={f} tint="#1a1a3a" />,
    who: [{ c: YOU, x: 960, expr: [[0, "angry"], ["stealing", "surprised"], ["control", "worried"]], act: [[0, "cross"], ["stealing", "headHands"]] }],
    ov: [
      { t: "punch", w: "twist", text: "THE CRUEL TWIST", color: RED, y: 240 },
      { t: "pill", w: "pieces", text: "SLEEP, STOLEN IN TINY PIECES", x: 960, y: 820, color: ICE },
    ],
  },
  s14: {
    env: (f) => <Lab f={f} />,
    who: [{ c: DR, x: 380, item: [[0, "tube"]], act: [[0, "hold"]], talk: [[0, "worse"]], expr: [[0, "neutral"], ["worse", "sad"]] }],
    ui: (f, A) => (
      <>
        <DayCalendar day={2} start={0} />
        <Versus a="4 H" la="SLEEP PER NIGHT · 6 NIGHTS" b="WORSE" lb="SUGAR PROCESSING" start={A("study")} colorA={ICE} colorB={RED} />
      </>
    ),
    ov: [{ t: "pill", w: "classic", text: "SPIEGEL ET AL., 1999", x: 1300, y: 760, color: ICE, size: 34 }],
    chapter: ["04", "THE BODY PAYS"],
  },
  s15: {
    env: (f) => <Office f={f} />,
    who: [{ c: YOU, x: 600, expr: [[0, "bored"], ["cold", "worried"]], act: [[0, "idle"], ["cold", "cover"]] }],
    ui: (f, A) => <BigStat value={4} prefix="~" suffix="×" label="MORE LIKELY TO CATCH A COLD (<6 H SLEEP)" start={A("four")} y={200} color={RED} />,
    ov: [{ t: "pill", w: "study", text: "PRATHER ET AL., 2015", x: 1350, y: 760, color: ICE, size: 34 }],
    sfx: [["cold", "gasp", 0.3]],
  },
  s16: {
    env: (f) => <Office f={f} />,
    props: (f, A) => (
      <g>
        <rect x={980} y={180} width={760} height={420} rx={14} fill="#f6efdf" stroke="#0b0a0c" strokeWidth={8} />
        {["TODAY I LEARNED:", "• telomeres", "• microsleeps", "• adenosine"].map((t, i) => (
          <text key={t} x={1020} y={260 + i * 80} fontFamily={hudFont} fontWeight={900} fontSize={48} fill="#2a2a3a" opacity={1 - prog(f, A("slipping") + i * 8, A("slipping") + 40 + i * 8)}>
            {t}
          </text>
        ))}
      </g>
    ),
    who: [{ c: YOU, x: 520, act: [[0, "idle"], ["learned", "point"], ["Skip", "scratch"]], expr: [[0, "neutral"], ["slipping", "confused"]] }],
    ov: [{ t: "tag", w: "saves", text: "NOBODY SAVED IT", x: 1360, y: 660, color: RED, world: true }],
  },
  s16b: {
    env: (f) => <Office f={f} />,
    who: [{ c: YOU, x: 500, item: [[0, "cup"]], act: [[0, "hold"], ["crash", "facepalm"]], expr: [[0, "happy"], ["crash", "sad"]], behind: desk(560) }],
    ui: (f, A) => <PressureBalloon p={0.75 - (f > A("helps") && f < A("crash") ? 0.25 : 0) + (f >= A("pressure") ? 0.2 : 0)} x={1450} y={420} />,
    ov: [{ t: "punch", w: "crash", text: "THE CRASH HITS HARDER", color: RED, y: 860 }],
  },
  s17: {
    env: (f) => <NightWindow f={f} />,
    props: (f, A) =>
      f >= A("Shadows") ? (
        <g opacity={0.6}>
          {new Array(5).fill(0).map((_, i) => (
            <ellipse key={i} cx={200 + i * 380 + Math.sin(f / 9 + i) * 40} cy={300 + Math.cos(f / 11 + i) * 30} rx={60} ry={140} fill="#000" opacity={0.5} />
          ))}
          {f >= A("Patterns") &&
            new Array(12).fill(0).map((_, i) => (
              <path key={i} d={`M ${100 + random("pt" + i) * 1700} ${100 + ((f * 2 + i * 50) % 600)} q 20 -20 40 0 t 40 0`} stroke="#7a4aa8" strokeWidth={5} fill="none" />
            ))}
        </g>
      ) : null,
    who: [{ c: YOU, x: 620, y: 920, s: 1.05, sit: true, act: [[0, "rub"], ["Voices", "headHands"]], expr: [[0, "bored"], ["see", "surprised"], ["Voices", "worried"]], look: -0.6 }],
    ui: (f, A) => <DayCalendar day={3} start={0} />,
    ov: [{ t: "punch", w: "aren't", text: "THINGS THAT AREN'T THERE", color: GOLD, y: 300 }],
    chapter: ["05", "THE MIND BREAKS"],
    sfx: [["Shadows", "riser", 0.35]],
  },
  s18: {
    env: (f) => <Street f={f} tint="#1a1a3a" />,
    who: [{ c: YOU, x: 700, act: [[0, "idle"], ["math", "scratch"], ["paranoid", "cross"]], expr: [[0, "bored"], ["math", "confused"], ["paranoid", "worried"]], look: 0.6 }, { c: SAM, x: 1500, s: 0.8, expr: [[0, "bored"]], look: -0.6 }],
    ov: [
      { t: "pill", w: "speech", text: "SLURRED SPEECH", x: 1300, y: 200, color: RED },
      { t: "pill", w: "math", text: "2 + 2 = ?", x: 1300, y: 300, color: GOLD },
      { t: "pill", w: "paranoid", text: "PARANOIA", x: 1300, y: 400, color: RED },
    ],
    close: [["watching", 0, 80]],
  },
  s18b: {
    env: (f) => <NightWindow f={f} />,
    who: [{ c: YOU, x: 620, y: 920, s: 1.05, sit: true, act: [[0, "cross"], ["hands", "headHands"], ["eyelids", "rub"]], expr: [[0, "worried"], ["eyelids", "bored"]] }],
    ov: [
      { t: "pill", w: "cold", text: "COLD → HOT", x: 1350, y: 240, color: ICE },
      { t: "pill", w: "tremble", text: "TREMBLING HANDS", x: 1350, y: 340, color: GOLD },
      { t: "punch", w: "negotiation", text: "EVERY BLINK IS A NEGOTIATION", color: ICE, y: 860, size: 80 },
    ],
  },
  s19: {
    env: (f) => <Gym f={f} />,
    who: [{ c: RANDY, x: [[0, -100], ["seventeen", 820]], expr: [[0, "happy"]], act: [[0, "idle"], ["science", "wave"]] }],
    ui: (f, A) => <BigStat value={1964} label="RANDY GARDNER · AGE 17" start={A("nineteen")} y={160} color={GOLD} dur={20} />,
    chapter: ["06", "THE RECORD"],
  },
  s20: {
    env: (f) => <Gym f={f} />,
    who: [
      { c: RANDY, x: 760, expr: [[0, "bored"]], act: [[0, "rub"], ["basketball", "cheer"], ["pinball", "point"]] },
      { c: MIA, x: 1200, s: 0.9, expr: [[0, "happy"]], act: [[0, "clap"]], talk: [["Friends", "moving"]] },
      { c: SAM, x: 1450, s: 0.85, expr: [[0, "happy"]], act: [[0, "idle"], ["basketball", "wave"]] },
    ],
    ui: (f, A) => <BigStat value={264} label="HOURS AWAKE · 11 DAYS" start={A("two")} y={140} color={ICE} />,
  },
  s21: {
    env: (f) => <Gym f={f} />,
    who: [{ c: RANDY, x: 900, expr: [[0, "bored"], ["slept", "happy"], ["decades", "sad"]], act: [[0, "rub"], ["slept", "idle"], ["wondered", "think"]], age: 0 }],
    ov: [
      { t: "pill", w: "memory", text: "MEMORY · FOCUS · MOOD", x: 1400, y: 260, color: RED },
      { t: "pill", w: "fourteen", text: "SLEPT ~14 HOURS", x: 1400, y: 360, color: ICE },
      { t: "pill", w: "insomnia", text: "LATER: INSOMNIA", x: 1400, y: 460, color: GOLD },
    ],
  },
  s22: {
    env: (f) => <Office f={f} />,
    who: [{ c: DR, x: 420, act: [[0, "talk"], ["please", "pointUp"]], talk: [[0, "one"]], expr: [[0, "neutral"], ["please", "worried"]] }],
    ov: [
      { t: "tag", w: "stopped", text: "RECORD NO LONGER ACCEPTED", x: 1250, y: 300 },
      { t: "punch", w: "please", text: "PLEASE, DON'T DO THIS ONE", color: RED, y: 860 },
    ],
  },
  s22b: {
    env: (f) => <Office f={f} />,
    who: [{ c: DR, x: 420, item: [[0, "clipboard"]], act: [[0, "hold"]], talk: [[0, "themselves"]], expr: [[0, "neutral"], ["microsleeps", "confused"]] }],
    ov: [
      { t: "pill", w: "longer", text: "OTHER CLAIMS: LONGER", x: 1250, y: 260, color: GOLD },
      { t: "pill", w: "monitored", text: "RARELY MONITORED", x: 1250, y: 360, color: RED },
      { t: "pill", w: "microsleeps", text: "HIDDEN MICROSLEEPS?", x: 1250, y: 460, color: ICE },
    ],
  },
  s23: {
    env: (f) => <Lab f={f} />,
    who: [{ c: DR, x: 380, act: [[0, "talk"], ["rats", "point"]], talk: [[0, "weeks"]], expr: [[0, "neutral"], ["died", "sad"]] }],
    props: (f) => (
      <g>
        <rect x={1100} y={600} width={500} height={180} rx={10} fill="rgba(200,230,255,0.18)" stroke="#9fb6c8" strokeWidth={6} />
        {[0, 1].map((i) => (
          <g key={i} transform={`translate(${1250 + i * 200 + Math.sin(f / 10 + i) * 20} 730) scale(0.35)`}>
            <Mouse />
          </g>
        ))}
      </g>
    ),
    ov: [
      { t: "pill", w: "nineteen", text: "1980s EXPERIMENTS", x: 1350, y: 200, color: ICE },
      { t: "punch", w: "died", text: "DEAD WITHIN WEEKS", color: RED, y: 320 },
    ],
  },
  s24: {
    env: (f) => <Lab f={f} />,
    who: [{ c: DR, x: 380, item: [[0, "clipboard"]], act: [[0, "hold"], ["debate", "shrug"]], talk: [[0, "optional"]], expr: [[0, "sad"], ["debate", "confused"], ["clear", "neutral"]] }],
    ov: [
      { t: "pill", w: "ate", text: "ATE MORE, LOST WEIGHT", x: 1300, y: 260, color: GOLD },
      { t: "pill", w: "warm", text: "COULDN'T STAY WARM", x: 1300, y: 360, color: ICE },
      { t: "punch", w: "optional", text: "SLEEP IS NOT OPTIONAL", color: RED, y: 860 },
    ],
  },
  s24b: {
    env: (f) => <Corridor signs={["NEUROLOGY", "SLEEP LAB", "RESEARCH"]} travel={0.6} cool f={f} />,
    who: [{ c: DR, x: [[0, 800], ["humans", 960]], expr: [[0, "neutral"], ["chilling", "worried"]], act: [[0, "talk"]], talk: [[0, "else"]] }],
    ov: [{ t: "punch", w: "chilling", text: "CHILLING", color: ICE, y: 300 }],
  },
  s25: {
    env: (f) => <Corridor signs={["NEUROLOGY", "GENETICS"]} travel={1.2} cool f={f} />,
    who: [{ c: DR, x: 960, item: [[0, "clipboard"]], act: [[0, "hold"]], expr: [[0, "worried"]] }],
    ov: [{ t: "punch", w: "fatal", text: "FATAL FAMILIAL INSOMNIA", color: RED, y: 280 }],
    chapter: ["07", "A REAL-LIFE 'WHAT IF'"],
    sfx: [["fatal", "sting", 0.35]],
  },
  s26: {
    env: (f) => <Lab f={f} />,
    who: [{ c: DR, x: 380, act: [[0, "talk"], ["thalamus", "point"]], talk: [[0, "properly"]], expr: [[0, "neutral"], ["lose", "sad"]] }],
    ui: (f, A) => <Brain x={1250} y={420} s={1.1} trash={0} highlight={f >= A("thalamus") ? "thalamus" : null} label="THE THALAMUS" />,
    ov: [{ t: "pill", w: "rare", text: "EXTREMELY RARE · GENETIC", x: 1250, y: 160, color: GOLD }],
  },
  s27: {
    env: (f) => <Corridor signs={["NEUROLOGY"]} travel={1.6} cool f={f} />,
    who: [{ c: DR, x: 960, expr: [[0, "sad"]], act: [[0, "talk"]], talk: [[0, "two"]] }],
    ov: [
      { t: "pill", w: "insomnia", text: "INSOMNIA", x: 420, y: 260, color: ICE },
      { t: "pill", w: "Racing", text: "RACING HEART", x: 420, y: 360, color: RED },
      { t: "pill", w: "Sweating", text: "SWEATING", x: 420, y: 460, color: GOLD },
      { t: "pill", w: "movement", text: "MOVEMENT · THINKING", x: 1500, y: 260, color: GOLD },
      { t: "tag", w: "cure", text: "NO CURE YET", x: 1500, y: 360 },
    ],
  },
  s28: {
    env: (f) => <Lab f={f} />,
    ui: (f, A) => <Brain x={960} y={420} s={1.3} trash={1} label="A BRAIN THAT CANNOT SLEEP..." />,
    ov: [{ t: "punch", w: "survive", text: "...CANNOT SURVIVE", color: RED, y: 860 }],
    start: "in",
  },
  s28b: {
    env: (f) => <Aquarium f={f} />,
    props: () => <Dolphin x={900} y={480} s={1.3} />,
    ui: (f, A) => (f >= A("half") ? <Brain x={1550} y={240} s={0.5} trash={0} highlight="half" label="HALF ASLEEP" /> : null),
    ov: [{ t: "pill", w: "Dolphins", text: "DOLPHINS: ONE HALF AT A TIME", x: 760, y: 160, color: ICE }],
  },
  s28c: {
    env: (f) => <SkyView f={f} water ground={0.3} />,
    props: (f) => <Frigate x={900 + Math.sin(f / 40) * 120} y={420} s={1.2} />,
    ov: [
      { t: "pill", w: "frigate", text: "FRIGATE BIRDS: NAPS IN FLIGHT", x: 960, y: 160, color: ICE },
      { t: "punch", w: "squeeze", text: "SKIP IT? NEVER. SQUEEZE IT IN.", color: GOLD, y: 860, size: 80 },
    ],
  },
  s29: {
    env: (f) => <NightWindow f={f} />,
    who: [{ c: YOU, x: 620, y: 920, s: 1.05, sit: true, act: [[0, "headHands"], ["seven", "idle"]], expr: [[0, "worried"], ["seven", "bored"]], lookY: 0.3 }],
    ui: (f, A) => <DayCalendar day={f >= A("seven") ? 7 : 5} start={0} />,
    ov: [{ t: "pill", w: "barely", text: "TECHNICALLY AWAKE. BARELY THERE.", x: 1300, y: 640, color: ICE }],
    chapter: ["08", "DAY SEVEN"],
  },
  s30: {
    env: bed("3:33"),
    who: [inBed({ x: [[0, 1300], ["win", 700]], sit: false, y: 900, s: 1, act: [[0, "rub"]], expr: [[0, "bored"], ["win", "neutral"]] })],
    props: (f, A) => (f >= A("take") ? <rect x={0} y={0} width={1920} height={1080} fill="#000" opacity={0.6 * prog(f, A("take"), A("take") + 40)} /> : null),
    ov: [{ t: "punch", w: "win", text: "YOUR BRAIN WOULD WIN", color: ICE, y: 300 }],
    sfx: [["take", "freeze", 0.3]],
  },
  s31: {
    env: (f) => <Street f={f} tint="#3a2a5a" />,
    who: [{ c: YOU, x: 760, act: [[0, "idle"], ["Hold", "cover"], ["breathe", "idle"]], expr: [[0, "neutral"], ["Hold", "worried"], ["breathe", "happy"]] }],
    ov: [
      { t: "tag", w: "habit", text: "NOT A HABIT", x: 1350, y: 260 },
      { t: "pill", w: "need", text: "A NEED, LIKE BREATHING", x: 1350, y: 360, color: ICE },
    ],
    chapter: ["09", "THE REAL ANSWER"],
  },
  s32: {
    env: (f) => <Office f={f} />,
    who: [{ c: DR, x: 420, act: [[0, "talk"], ["seven", "pointUp"]], talk: [[0, "less"]], expr: [[0, "neutral"]] }],
    ui: (f, A) => <BigStat value={7} suffix="+ H" label="WHAT MOST ADULTS NEED" start={A("seven")} y={200} color={ICE} />,
  },
  s33: {
    env: bed("1:47"),
    who: [inBed({ item: [[0, "phone"]], act: [[0, "phone"]], expr: [[0, "bored"], ["debt", "worried"]] })],
    ov: [
      { t: "pill", w: "all-nighter", text: "EVERY ALL-NIGHTER", x: 1300, y: 260, color: GOLD },
      { t: "pill", w: "scroll", text: "EVERY LATE SCROLL", x: 1300, y: 360, color: GOLD },
      { t: "punch", w: "debt", text: "YOUR BRAIN COLLECTS THE DEBT", color: RED, y: 300 },
    ],
  },
  s33b: {
    env: bed("7:00", 1),
    who: [{ c: YOU, x: 1000, expr: [[0, "happy"]], act: [[0, "idle"], ["daylight", "cheer"]] }],
    ui: (f, A) => <Checklist title="SIMPLE SLEEP BASICS" items={[{ t: "SAME BED & WAKE TIME", at: A("similar") }, { t: "DARK, COOL ROOM", at: A("dark") }, { t: "MORNING DAYLIGHT", at: A("daylight") }]} x={1180} y={180} w={660} start={A("basics")} />,
  },
  s34: {
    env: bed("10:30"),
    who: [inBed({ item: [[0, "phone"], ["down", null]], act: [[0, "phone"], ["down", "idle"], ["future", "yawn"]], expr: [[0, "neutral"], ["future", "happy"]] })],
    ov: [{ t: "punch", w: "challenge", text: "TONIGHT'S CHALLENGE", color: GOLD, y: 260 }],
    sfx: [["down", "click", 0.3]],
  },
  s34b: {
    env: (f) => <NightWindow f={f} />,
    who: [{ c: YOU, x: 620, y: 920, s: 1.05, sit: true, act: [[0, "think"]], expr: [[0, "neutral"], ["blurrier", "sad"]] }],
    ov: [{ t: "punch", w: "owed", text: "SLEEP ISN'T WASTED TIME", color: ICE, y: 300 }],
  },
  s35: {
    env: bed("10:59"),
    who: [inBed({ expr: [[0, "happy"]], act: [[0, "talk"], ["Subscribe", "wave"], ["Sleep", "yawn"]] }), { c: ZOE, x: 1500, s: 0.85, expr: [[0, "happy"]], act: [[0, "idle"], ["Subscribe", "clap"]] }],
    ov: [
      { t: "pill", w: "comments", text: "💬 Your longest time awake?", x: 960, y: 200, color: GOLD, size: 50 },
      { t: "punch", w: "Sleep", text: "SLEEP WELL.", color: ICE, y: 300 },
    ],
    sfx: [["Subscribe", "popper", 0.35]],
  },
};
void Screen;
void screenText;
void ZOE;
void Versus;
