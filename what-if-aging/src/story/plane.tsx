import React from "react";
import { interpolate } from "remotion";
import { Spec, W, Who } from "./engine";
import { CabinRow, Cockpit, Jet, PlaneCabin, River, Runway, Seat, SkyView } from "./envs";
import { Office } from "../stick/Env";
import { AtcRoom, Boneyard, Classroom, Galley, Museum, Observatory, SimHangar, Terminal } from "./envs2";
import { hudFont } from "../stick/Hud";
import { Altimeter, BigStat, Checklist, GlideProfile, OxygenMasks, RouteMap, Timer, Versus, prog } from "./widgets";
import { CAPT, DR, FA, FO, MIA, SAM, YOU, ZOE } from "../stick/cast";
import { CharDef } from "../stick/Stick";
import { GOLD, ICE, RED } from "../stick/Hud";

/* ---------- reusable staging ---------- */
const seated = (c: CharDef, x: number, o: Partial<Who> = {}): Who => ({
  c,
  x,
  y: 990,
  s: 1.08,
  sit: true,
  behind: <Seat x={x} y={990} s={1.08} />,
  front: <Seat x={x} y={990} s={1.08} front />,
  ...o,
});
const rowPair = (you: Partial<Who> = {}, mia: Partial<Who> = {}): Who[] => [seated(MIA, 640, { look: 0.4, ...mia }), seated(YOU, 1060, { look: -0.3, ...you })];
const aislePair = (you: Partial<Who> = {}, mia: Partial<Who> = {}): Who[] => [
  seated(MIA, 560, { s: 1.0, y: 1000, behind: <Seat x={560} y={1000} s={1.0} color="#2a4a46" />, front: <Seat x={560} y={1000} s={1.0} front />, ...mia }),
  seated(YOU, 800, { s: 1.0, y: 1000, behind: <Seat x={800} y={1000} s={1.0} color="#2a4a46" />, front: <Seat x={800} y={1000} s={1.0} front />, ...you }),
];
const pilots = (capt: Partial<Who> = {}, fo: Partial<Who> = {}): Who[] => [
  { c: CAPT, x: 520, y: 1010, s: 1.05, sit: true, look: 0.3, ...capt },
  { c: FO, x: 1400, y: 1010, s: 1.05, sit: true, look: -0.3, ...fo },
];
const T = (label: string, base: number, t0: W = 0) => (f: number, A: (w: W) => number) => <Timer label={label} base={base} t0={A(t0)} start={0} x={60} y={50} />;
const alt = (from: number, to: number, a: W = 0, b: W = 300) => (f: number, A: (w: W) => number) => (
  <Altimeter ft={interpolate(f, [A(a), A(b)], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
);
const both = (...fs: ((f: number, A: (w: W) => number) => React.ReactNode)[]) => (f: number, A: (w: W) => number) => <>{fs.map((g, i) => <React.Fragment key={i}>{g(f, A)}</React.Fragment>)}</>;
const cabin = (o: { dim?: [W, number]; red?: W; shake?: number } = {}) => (f: number, A: (w: W) => number) => (
  <PlaneCabin f={f} dim={o.dim ? interpolate(f, [A(o.dim[0]), A(o.dim[0]) + 10], [0, o.dim[1]], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0} red={o.red !== undefined && f >= A(o.red) ? 1 : 0} shake={o.shake} />
);
const row = (o: { ground?: number; shake?: number; sky?: string } = {}) => (f: number) => <CabinRow f={f} ground={o.ground} shake={o.shake} skyTint={o.sky} />;
const sky = (o: { night?: boolean; ground?: number; water?: boolean; ash?: number } = {}) => (f: number) => <SkyView f={f} {...o} />;

const chalkT = (x: number, y: number, t: string, size = 64, color = "#f6efdf") => (
  <text x={x} y={y} fontFamily={hudFont} fontWeight={900} fontSize={size} fill={color} opacity={0.88}>
    {t}
  </text>
);
const miniPerson = (x: number, y: number, s: number, col: string, k: number, f: number) => (
  <g key={k} transform={`translate(${x} ${y + Math.sin(f / 9 + k) * 1.5}) scale(${s})`}>
    <rect x={-9} y={-34} width={18} height={30} rx={6} fill={col} stroke="#0b0a0c" strokeWidth={3} />
    <circle cx={0} cy={-46} r={13} fill="#0b0a0c" />
  </g>
);

/* ---------- the scenes ---------- */
export const PLANE: Record<string, Spec> = {
  p01: {
    env: (f, A) => <PlaneCabin f={f} dim={f >= A("stops") ? 0.18 + 0.1 * Math.sin(f / 2) : 0} />,
    who: aislePair({ expr: [[0, "happy"], ["stops", "surprised"]], act: [[0, "talk"], ["Drinks", "idle"], ["stops", "grip"]] }, { item: [[0, "cup"]], expr: [[0, "happy"], ["Both", "surprised"]] }),
    ui: both(alt(35000, 35000)),
    ov: [
      { t: "pill", w: "twenty-three", text: "23B", x: 800, y: 470, size: 54 },
      { t: "punch", w: "Both", text: "BOTH ENGINES.", color: RED, y: 300 },
      { t: "punch", w: "Gone", text: "GONE.", color: RED, y: 420 },
    ],
    sfx: [["stops", "freeze", 0.4], ["Gone", "heartbeat", 0.4]],
    start: "in",
  },
  p02: {
    env: cabin({ dim: [0, 0.25] }),
    who: aislePair({ expr: [[0, "worried"], ["realizing", "surprised"]], act: [[0, "grip"], ["cabin", "nails"]], look: -0.6 }, { expr: [[0, "worried"], ["realizing", "surprised"]], act: [[0, "cover"]] }),
    ui: both(alt(35000, 34400), T("ENGINES OFF", 2)),
    ov: [{ t: "punch", w: "next", text: "WHAT HAPPENS NEXT?", color: ICE, y: 300 }],
    sfx: [[0, "heartbeat", 0.35]],
  },
  p03: {
    env: sky({}),
    props: (f, A) => {
      const movie = f < A("real");
      const fallY = movie ? interpolate(f, [0, A("real")], [300, 900], { extrapolateRight: "clamp" }) : 0;
      return movie ? <Jet x={960} y={fallY} s={0.8} rot={70} f={f} lights={false} /> : <Jet x={interpolate(f, [A("real"), A("Let's")], [400, 1400], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} y={interpolate(f, [A("real"), A("Let's")], [360, 520], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} s={0.8} rot={4} f={f} />;
    },
    ov: [
      { t: "tag", w: "movie", text: "THE MOVIE VERSION", x: 960, y: 200, end: "real" },
      { t: "pill", w: "real", text: "THE REAL VERSION: IT GLIDES", x: 960, y: 200, color: ICE, size: 50 },
      { t: "punch", w: "hopeful", text: "MORE HOPEFUL", color: GOLD, y: 860 },
    ],
    sfx: [["movie", "whoosh", 0.4], ["real", "sparkle", 0.3]],
    start: "still",
  },
  p04: {
    env: (f) => <Cockpit f={f} alarm />,
    who: pilots({ expr: [[0, "surprised"], ["simple", "neutral"]], act: [[0, "idle"], ["Aviate", "pointUp"], ["Fly", "grip"]] }, { expr: [[0, "surprised"], ["simple", "neutral"]], act: [[0, "idle"], ["Navigate", "think"], ["Fly", "grip"]] }),
    ui: both(T("TIME SINCE FLAMEOUT", 0)),
    ov: [{ t: "pill", w: "Zero", text: "0 SECONDS", x: 960, y: 140, color: RED }],
    props: () => null,
    sfx: [[0, "sting", 0.3]],
  },
  p05: {
    env: sky({}),
    props: (f) => <Jet x={960} y={460 + f * 0.25} s={0.95} rot={6} f={f} lights={false} />,
    ui: both(alt(34800, 33500), T("TIME SINCE FLAMEOUT", 5)),
    ov: [
      { t: "pill", w: "trading", text: "HEIGHT → SPEED", x: 960, y: 170, color: GOLD, size: 54 },
      { t: "punch", w: "fuel", text: "ALTITUDE IS YOUR FUEL", color: GOLD, y: 860 },
    ],
    start: "in",
  },
  p06: {
    env: sky({}),
    props: (f) => (
      <g>
        <Jet x={960} y={500} s={1.1} rot={3} f={f} lights={false} />
        {new Array(7).fill(0).map((_, i) => (
          <path key={i} d={`M ${((f * 12 + i * 160) % 1400) + 100} ${380 + i * 26} q 60 -14 120 0`} stroke="#ffffff" strokeWidth={5} fill="none" opacity={0.7} />
        ))}
      </g>
    ),
    ov: [
      { t: "pill", w: "glider", text: "A GIANT GLIDER", x: 960, y: 170, color: ICE, size: 56 },
      { t: "tag", w: "lifting", text: "WINGS STILL LIFT", x: 960, y: 790, color: "#1f8fb3" },
    ],
    zoom: [["wings", 930, 560, 1.6, 80]],
  },
  p06b: {
    env: (f) => <Classroom f={f} />,
    who: [{ c: YOU, x: 420, expr: [[0, "happy"]], act: [[0, "hold"], ["flies", "reach"], ["heavier", "idle"]], look: 0.5 }],
    props: (f, A) => {
      const t = prog(f, A("flies"), A("flies") + 70);
      const x = 600 + t * 1100;
      const y = 470 - Math.sin(t * Math.PI) * 120 + t * 160;
      return f >= A("paper") ? (
        <g transform={`translate(${f < A("flies") ? 520 : x} ${f < A("flies") ? 480 : y}) rotate(${-8 + t * 20})`}>
          <path d="M -50 0 L 50 -6 L -40 20 Z M -50 0 L 50 -6 L -30 -12 Z" fill="#f6efdf" stroke="#0b0a0c" strokeWidth={3} />
        </g>
      ) : null;
    },
    ov: [{ t: "pill", w: "engine", text: "NO ENGINE. STILL FLIES.", x: 1300, y: 180, color: ICE }],
    sfx: [["flies", "whoosh", 0.4]],
  },
  p07: {
    env: sky({ ground: 0.15 }),
    ui: (f, A) => <GlideProfile p={prog(f, 10, A("search") + 10)} label="FROM CRUISING ALTITUDE" />,
    ov: [
      { t: "pill", w: "hundred", text: "OFTEN 100+ KM", x: 960, y: 760, color: GOLD, size: 54 },
      { t: "punch", w: "search", text: "A RUNWAY SEARCH.", color: ICE, y: 880 },
    ],
    start: "still",
  },
  p08: {
    env: sky({}),
    props: (f, A) => {
      const d = prog(f, A("backup"), A("backup") + 20);
      return (
        <g>
          <Jet x={960} y={480} s={1.2} rot={3} f={f} lights={Math.floor(f / 6) % 3 !== 0} />
          <g transform={`translate(1100 ${520 + d * 70})`} opacity={d > 0 ? 1 : 0}>
            <line x1={0} y1={-70} x2={0} y2={0} stroke="#0b0a0c" strokeWidth={6} />
            <g transform={`rotate(${f * 25})`}>
              <path d="M 0 0 L 40 -8 L 40 8 Z M 0 0 L -40 -8 L -40 8 Z" fill="#c9d2dc" stroke="#0b0a0c" strokeWidth={3} />
            </g>
            <circle r={8} fill="#2a3442" />
          </g>
        </g>
      );
    },
    ui: both(T("TIME SINCE FLAMEOUT", 10)),
    ov: [{ t: "tag", w: "turbine", text: "RAM AIR TURBINE", x: 1100, y: 760, color: "#1f8fb3", world: true }],
    zoom: [["pinwheel", 1100, 600, 2.0, 70]],
    sfx: [["backup", "click", 0.35]],
  },
  p09: {
    env: sky({}),
    props: (f, A) => (
      <g>
        <Jet x={960} y={480} s={1.2} rot={3} f={f} lights={f >= A("electricity")} />
        {f >= A("start") && <circle cx={960 - 300} cy={470} r={18 + Math.sin(f / 3) * 4} fill="#ffb84d" opacity={0.8} />}
      </g>
    ),
    ov: [
      { t: "tag", w: "tail", text: "A P U · AUXILIARY POWER UNIT", x: 640, y: 380, color: "#c48612", world: true },
      { t: "pill", w: "electricity", text: "POWER ✓  AIR ✓", x: 960, y: 760, color: ICE },
    ],
    zoom: [["tail", 680, 470, 2.0, 80]],
  },
  p10: {
    env: (f) => <Cockpit f={f} alarm />,
    who: pilots({ item: [[0, "clipboard"]], expr: [[0, "neutral"]], talk: [[0, "Find"]] }, { act: [[0, "idle"], ["Restart", "reach"], ["Find", "pointL"]], expr: [[0, "neutral"]] }),
    ui: (f, A) => (
      <>
        <Timer label="TIME SINCE FLAMEOUT" base={30} t0={0} x={60} y={50} />
        <Checklist title="ENGINE FAILURE CHECKLIST" items={[{ t: "RESTART ENGINES", at: A("Restart") }, { t: "CHECK THE FUEL", at: A("Check") }, { t: "FIND A RUNWAY", at: A("Find") }]} x={1240} y={60} w={600} start={A("checklists")} />
      </>
    ),
    sfx: [["Restart", "click", 0.35], ["Check", "click", 0.35], ["Find", "click", 0.35]],
  },
  p11: {
    env: row({ shake: 1 }),
    who: rowPair({ expr: [[0, "worried"]], act: [[0, "nails"]], look: -0.5 }, { expr: [[0, "neutral"], ["freeze", "surprised"]], act: [[0, "grip"]] }),
    close: [["heart", 1, 90]],
    sfx: [["heart", "heartbeat", 0.5]],
    autoClose: false,
  },
  p12: {
    env: cabin({}),
    who: [...aislePair({ expr: [[0, "worried"], ["calm", "neutral"]], look: 0.3 }, { expr: [[0, "worried"], ["calm", "neutral"]] }), { c: FA, x: 1300, y: 940, s: 1.0, item: [[0, "phone"]], act: [[0, "phone"]], talk: [["Please", "fastened"]], expr: [[0, "neutral"]], look: -0.4 }],
    ui: both(T("TIME SINCE FLAMEOUT", 60)),
    ov: [
      { t: "bubble", w: "Please", who: 2, text: "Please remain seated.", end: "sounds" },
      { t: "pill", w: "trained", text: "TRAINED CALM", x: 960, y: 160, color: ICE },
    ],
    close: [["calm", 2, 80]],
  },
  p13: {
    env: cabin({}),
    who: aislePair({ expr: [[0, "neutral"], ["twist", "surprised"]], lookY: -0.6, act: [[0, "idle"], ["masks", "pointUp"], ["twist", "scratch"]] }, { expr: [[0, "neutral"]] }),
    ov: [
      { t: "pill", w: "pressure", text: "MASKS = LOST CABIN PRESSURE", x: 960, y: 160, color: GOLD },
      { t: "pill", w: "engines", text: "NOT LOST ENGINES", x: 960, y: 240, color: ICE },
    ],
  },
  p14: {
    env: cabin({}),
    who: aislePair({ expr: [[0, "worried"], ["seconds", "surprised"]], act: [[0, "idle"], ["first", "cover"], ["anyone", "reach"]], look: -0.6 }, { expr: [[0, "worried"]], act: [[0, "headHands"]] }),
    ui: (f, A) => <OxygenMasks start={A("drop")} />,
    ov: [
      { t: "punch", w: "first", text: "YOURS FIRST", color: GOLD, y: 300 },
      { t: "pill", w: "seconds", text: "SECONDS OF CLEAR THINKING", x: 960, y: 820, color: RED },
    ],
    sfx: [["drop", "whoosh", 0.4]],
  },
  p15: {
    env: row({}),
    who: rowPair({ expr: [[0, "neutral"], ["enough", "happy"]] }, { expr: [[0, "neutral"]] }),
    ui: (f, A) => <BigStat value={15} prefix="12–" suffix=" MIN" label="OF OXYGEN PER GENERATOR (TYPICAL)" start={A("twelve")} y={200} color={GOLD} />,
    ov: [{ t: "tag", w: "dive", text: "PILOTS DIVE TO BREATHABLE AIR", x: 960, y: 760, color: "#1f8fb3" }],
  },
  p15b: {
    env: (f) => <Terminal f={f} />,
    who: [{ c: FO, x: 520, act: [[0, "talk"], ["fuel", "point"]], expr: [[0, "neutral"]], talk: [[0, "outside"]] }],
    ov: [
      { t: "punch", w: "rare", text: "EXTREMELY RARE", color: ICE, y: 220 },
      { t: "pill", w: "fuel", text: "RUNNING OUT OF FUEL", x: 1300, y: 420, color: RED },
      { t: "pill", w: "birds", text: "A FLOCK OF BIRDS", x: 1300, y: 520, color: RED },
      { t: "pill", w: "ash", text: "VOLCANIC ASH", x: 1300, y: 620, color: RED },
    ],
  },
  p16: {
    env: row({ ground: 0.45, shake: 1.5 }),
    who: rowPair({ expr: [[0, "worried"], ["important", "surprised"]], look: -0.8, act: [[0, "grip"]] }, { expr: [[0, "worried"]], act: [[0, "grip"]] }),
    ui: both(T("TIME SINCE FLAMEOUT", 180), alt(24000, 21250)),
    ov: [{ t: "punch", w: "nineteen", text: "1983", color: GOLD, y: 300 }],
    sfx: [["nineteen", "riser", 0.35]],
  },
  p17: {
    env: (f, A) => <Cockpit f={f} alarm={f >= A("alarms")} />,
    who: pilots({ expr: [[0, "happy"], ["alarms", "surprised"], ["other", "worried"]], act: [[0, "idle"], ["alarms", "grip"]] }, { expr: [[0, "neutral"], ["alarms", "surprised"]], act: [[0, "idle"], ["One", "pointL"]] }),
    ui: both(alt(41000, 41000)),
    ov: [
      { t: "hud", w: 0, label: "AIR CANADA 143", value: "JULY 1983", x: 60, y: 50, wd: 440 },
      { t: "tag", w: "One", text: "ENGINE 1: OFF", x: 960, y: 160 },
      { t: "tag", w: "other", text: "ENGINE 2: OFF", x: 960, y: 240 },
    ],
    sfx: [["alarms", "sting", 0.35]],
  },
  p18: {
    env: (f, A) => <Classroom f={f} chalk={<g opacity={prog(f, A("mix-up"), A("mix-up") + 12)}>{chalkT(640, 260, "KG", 120)}{chalkT(900, 260, "≠", 120, RED)}{chalkT(1080, 260, "LB", 120)}{chalkT(640, 420, "22,300 KG NEEDED", 56, GOLD)}</g>} />,
    who: [{ c: SAM, x: 360, expr: [[0, "neutral"], ["mix-up", "confused"]], act: [[0, "idle"], ["mix-up", "scratch"]], look: 0.6 }],
    ui: (f, A) => <Versus a="100%" la="FUEL IT NEEDED" b="<50%" lb="FUEL IT CARRIED" start={A("less")} />,
    ov: [
      { t: "pill", w: "metric", text: "KILOGRAMS", x: 900, y: 760, color: ICE },
      { t: "pill", w: "imperial", text: "POUNDS", x: 1260, y: 760, color: GOLD },
      { t: "punch", w: "fuel#1", text: "OUT OF FUEL", color: RED, y: 220, end: "less" },
    ],
  },
  p19: {
    env: (f) => <Cockpit f={f} alarm />,
    who: pilots({ expr: [[0, "worried"], ["hobby", "happy"]], act: [[0, "grip"], ["hobby", "hips"]] }, { expr: [[0, "worried"]], act: [[0, "grip"]] }),
    ov: [{ t: "pill", w: "glider", text: "EXPERIENCED GLIDER PILOT", x: 520, y: 330, color: GOLD, size: 40, world: true }],
    close: [["hobby", 0, 90]],
    sfx: [["glider", "idea", 0.35]],
  },
  p20: {
    env: sky({ ground: 0.3 }),
    ui: (f, A) => <RouteMap p={0.5} from="MONTREAL" to="EDMONTON" divert="GIMLI" dp={prog(f, A("base"), A("base") + 60)} />,
    ov: [
      { t: "tag", w: "racetrack", text: "NOW A RACETRACK", x: 1020, y: 380, color: RED },
      { t: "pill", w: "go-karts", text: "PEOPLE ON THE TRACK", x: 960, y: 860, color: GOLD },
    ],
    sfx: [["racetrack", "gasp", 0.35]],
  },
  p21: {
    env: sky({ ground: 0.55 }),
    props: (f, A) => {
      const slip = prog(f, A("sideways"), A("sideways") + 25);
      return <Jet x={960} y={460 + f * 0.3} s={1.0} rot={6 + slip * 22} f={f} lights={false} />;
    },
    ui: both(alt(9000, 3000)),
    ov: [
      { t: "pill", w: "high", text: "TOO HIGH · TOO FAST", x: 960, y: 170, color: RED },
      { t: "tag", w: "slip", text: "FORWARD SLIP", x: 960, y: 800, color: "#1f8fb3" },
    ],
    zoom: [["sideways", 960, 520, 1.5, 80]],
    sfx: [["sideways", "whoosh", 0.4]],
  },
  p22: {
    env: (f, A) => {
      const t = prog(f, 0, A("scraped") + 30);
      return <Runway f={f} jetX={interpolate(t, [0, 1], [-300, 980])} jetY={interpolate(t, [0, 0.5, 1], [480, 690, 705])} jetRot={interpolate(t, [0, 0.5, 0.6, 1], [4, 2, 8, 8])} sparks={f >= A("collapsed") && f < A("scraped") + 40} fire={f >= A("fire")} />;
    },
    ov: [
      { t: "tag", w: "collapsed", text: "NOSE GEAR COLLAPSES", x: 960, y: 220 },
      { t: "pill", w: "fire", text: "PUT OUT BY RACERS", x: 960, y: 300, color: GOLD },
    ],
    hits: ["hit", "collapsed"],
    sfx: [["hit", "boom", 0.45], ["collapsed", "shatter", 0.3]],
    start: "still",
  },
  p23: {
    env: (f) => <Runway f={f} jetX={980} jetY={705} jetRot={8} />,
    who: [
      { c: YOU, x: 360, expr: [[0, "happy"]], act: [[0, "cheer"]], s: 0.8, y: 950 },
      { c: MIA, x: 560, expr: [[0, "happy"]], act: [[0, "clap"]], s: 0.8, y: 950 },
    ],
    ov: [
      { t: "punch", w: "died", text: "NO ONE DIED", color: GOLD, y: 230, end: "Glider" },
      { t: "punch", w: "Glider", text: "THE GIMLI GLIDER", color: ICE, y: 230 },
    ],
    sfx: [["died", "sparkle", 0.35]],
  },
  p23b: {
    env: (f) => <Office f={f} />,
    who: [{ c: DR, x: 480, item: [[0, "clipboard"]], expr: [[0, "neutral"], ["chain", "sad"]], talk: [[0, "time"]] }],
    ov: [
      { t: "pill", w: "fuel", text: "HOW WAS THE FUEL CALCULATED?", x: 1240, y: 300, color: GOLD },
      { t: "pill", w: "chain", text: "A CHAIN OF SMALL ERRORS", x: 1240, y: 420, color: RED },
    ],
  },
  p24: {
    env: sky({ night: true, water: true, ground: 0.3 }),
    props: (f) => <Jet x={960} y={440} s={0.9} rot={3} f={f} />,
    ov: [{ t: "punch", w: "night", text: "OVER THE OCEAN. AT NIGHT.", color: ICE, y: 260 }],
    start: "in",
  },
  p25: {
    env: sky({ night: true, ash: 0.6 }),
    props: (f) => <Jet x={960} y={460} s={1.1} rot={2} f={f} glow="#7fe6ff" />,
    ov: [
      { t: "hud", w: 0, label: "BRITISH AIRWAYS 9", value: "JUNE 1982", x: 60, y: 50, wd: 440 },
      { t: "pill", w: "smoke", text: "STRANGE SMOKE IN THE CABIN", x: 960, y: 800, color: GOLD },
      { t: "tag", w: "blue", text: "ENGINES GLOWING BLUE", x: 960, y: 880, color: "#1f8fb3" },
    ],
    zoom: [["glowing", 920, 520, 1.8, 80]],
  },
  p26: {
    env: sky({ night: true, ash: 1 }),
    props: (f) => <Jet x={960} y={470 + f * 0.15} s={1.1} rot={4} f={f} lights={false} smoke />,
    ui: both(alt(37000, 36000)),
    ov: [
      { t: "tag", w: "one", text: "ALL FOUR ENGINES: OFF", x: 960, y: 200 },
      { t: "punch", w: "ash", text: "VOLCANIC ASH", color: GOLD, y: 860 },
    ],
    sfx: [["shut", "freeze", 0.4]],
  },
  p27: {
    env: (f) => <Cockpit f={f} alarm sky="#0b1230" />,
    who: pilots({ item: [[0, "phone"]], act: [[0, "phone"]], talk: [["told", "distress"]], expr: [[0, "neutral"]] }, { expr: [[0, "worried"]], act: [[0, "grip"]] }),
    ov: [{ t: "bubble", w: "told", who: 0, text: "All four engines have stopped.", end: "distress" }],
    close: [["calmest", 0, 100]],
  },
  p28: {
    env: (f) => <Cockpit f={f} alarm sky="#0b1230" ground={0.2} />,
    who: pilots({ expr: [[0, "worried"]], act: [[0, "reach"], ["Nothing", "facepalm"]] }, { expr: [[0, "worried"], ["Nothing", "sad"]], act: [[0, "grip"]] }),
    ui: both(alt(30000, 20000)),
    ov: [
      { t: "pill", w: "again", text: "RESTART: FAILED ✕", x: 960, y: 160, color: RED },
      { t: "tag", w: "mountains", text: "MOUNTAINS BELOW", x: 960, y: 240 },
    ],
    sfx: [["again", "click", 0.3], ["again#2", "click", 0.3], ["Nothing", "regret", 0.25]],
  },
  p29: {
    env: (f, A) => <SkyView f={f} night ash={1 - prog(f, A("clean"), A("clean") + 40)} />,
    props: (f, A) => <Jet x={960} y={470} s={1.1} rot={3} f={f} lights={f >= A("life")} glow={f >= A("coughed") ? "#ffb84d" : undefined} />,
    ui: (f, A) => <BigStat value={f >= A("all") ? 4 : f >= A("another") ? 2 : f >= A("coughed") ? 1 : 0} label="ENGINES RUNNING" start={A("coughed")} dur={1} y={160} color={GOLD} />,
    sfx: [["coughed", "idea", 0.4], ["another", "pop", 0.3], ["all", "sparkle", 0.4]],
  },
  p30: {
    env: sky({ night: true, ground: 0.3 }),
    props: (f) => <Jet x={960} y={460} s={1.0} rot={-2} f={f} />,
    ui: (f, A) => <Altimeter ft={interpolate(f, [0, A("before")], [37000, 12500], { extrapolateRight: "clamp" })} />,
    ov: [
      { t: "pill", w: "Jakarta", text: "LANDED SAFELY IN JAKARTA", x: 960, y: 760, color: ICE },
      { t: "punch", w: "Everyone", text: "EVERYONE SURVIVED", color: GOLD, y: 300 },
    ],
  },
  p31: {
    env: sky({ ground: 0.55 }),
    props: (f, A) => (
      <g>
        <Jet x={interpolate(f, [0, A("flock")], [500, 900], { extrapolateRight: "clamp" })} y={480} s={0.9} rot={-8} f={f} smoke={f >= A("geese")} />
        {f >= A("flies") - 20 &&
          new Array(14).fill(0).map((_, i) => {
            const bx = 1500 - (f - A("flies") + 20) * 9 + (i % 5) * 40;
            const by = 420 + Math.floor(i / 5) * 34 + Math.sin(f / 3 + i) * 6;
            return <path key={i} d={`M ${bx - 16} ${by} q 8 -10 16 0 q 8 -10 16 0`} stroke="#1a1a22" strokeWidth={5} fill="none" />;
          })}
      </g>
    ),
    ov: [
      { t: "hud", w: 0, label: "US AIRWAYS 1549", value: "JAN 2009", x: 60, y: 50, wd: 440 },
      { t: "tag", w: "geese", text: "BIRD STRIKE", x: 960, y: 220 },
    ],
    hits: ["geese"],
    sfx: [["geese", "boom", 0.45]],
  },
  p32: {
    env: (f) => <Cockpit f={f} alarm ground={0.7} />,
    who: pilots({ expr: [[0, "surprised"], ["three", "worried"]], act: [[0, "grip"]] }, { expr: [[0, "surprised"], ["crowded", "worried"]], act: [[0, "idle"], ["engines", "headHands"]] }),
    ui: both(alt(3000, 2200)),
    ov: [
      { t: "pill", w: "crowded", text: "OVER NEW YORK CITY", x: 960, y: 160, color: GOLD },
      { t: "punch", w: "minutes", text: "ONLY MINUTES", color: RED, y: 300 },
    ],
  },
  p33: {
    env: (f) => <Cockpit f={f} alarm ground={0.8} sky="#8fb3d8" />,
    who: pilots({ expr: [[0, "neutral"], ["chose", "angry"]], act: [[0, "think"], ["chose", "pointL"]] }, { item: [[0, "clipboard"]], expr: [[0, "worried"]], act: [[0, "idle"]] }),
    ov: [
      { t: "pill", w: "airports", text: "AIRPORTS: TOO FAR ✕", x: 960, y: 160, color: RED },
      { t: "punch", w: "Hudson", text: "THE HUDSON RIVER", color: ICE, y: 300 },
    ],
    close: [["chose", 0, 80]],
  },
  p34: {
    env: (f) => (
      <River f={f}>
        {new Array(9).fill(0).map((_, i) => (
          <g key={i} transform={`translate(${760 + i * 26} ${600})`}>
            <circle cx={0} cy={-38} r={9} fill="#0b0a0c" />
            <rect x={-6} y={-30} width={12} height={28} rx={5} fill={["#f2c21b", "#8f5bd8", "#e0452f", "#2f8f9a"][i % 4]} />
          </g>
        ))}
      </River>
    ),
    ui: (f, A) => <BigStat value={155} label="PEOPLE ON BOARD · ALL SURVIVED" start={A("All")} y={140} color={GOLD} />,
    ov: [{ t: "pill", w: "wings", text: "PASSENGERS ON THE WINGS", x: 960, y: 860, color: ICE }],
    zoom: [["wings", 860, 610, 2.0, 70]],
    sfx: [["All", "sparkle", 0.4]],
  },
  p35: {
    env: cabin({}),
    who: [...aislePair({ expr: [[0, "worried"], ["Listen", "neutral"]], look: 0.4 }, { expr: [[0, "worried"]] }), { c: FA, x: 1320, y: 940, act: [[0, "talk"], ["plan", "point"]], talk: [[0, "Not"]], expr: [[0, "neutral"]], look: -0.5 }],
    ov: [
      { t: "punch", w: "Listen", text: "1. LISTEN TO THE CREW", color: GOLD, y: 240 },
      { t: "pill", w: "plan", text: "THEY KNOW THE PLAN", x: 1320, y: 330, color: ICE, world: true },
    ],
    chapter: ["!", "WHAT YOU SHOULD DO"],
  },
  p35b: {
    env: (f) => <Cockpit f={f} ground={0.6} />,
    who: pilots({ act: [[0, "think"], ["runway", "pointUp"]], expr: [[0, "neutral"]] }, { act: [[0, "idle"], ["highway", "pointUpL"]], expr: [[0, "neutral"]] }),
    ui: (f, A) => <Checklist title="WHERE TO LAND" items={[{ t: "RUNWAY", at: A("runway") }, { t: "HIGHWAY", at: A("highway") }, { t: "FIELD", at: A("field") }, { t: "BEACH", at: A("beach") }, { t: "CALM WATER", at: A("water") }]} x={1260} y={60} w={560} start={A("scanning")} />,
    sfx: [["runway", "click", 0.3], ["highway", "click", 0.3], ["field", "click", 0.3], ["beach", "click", 0.3], ["water", "click", 0.3]],
  },
  p36: {
    env: row({ ground: 0.6, shake: 1 }),
    who: rowPair({ expr: [[0, "worried"]], act: [[0, "grip"], ["brace", "brace"]] }, { expr: [[0, "worried"]], act: [[0, "grip"], ["brace", "brace"]] }),
    ui: (f, A) => <Checklist title="2. BRACE POSITION" items={[{ t: "FEET FLAT ON THE FLOOR", at: A("Feet") }, { t: "LEAN FORWARD", at: A("Lean") }, { t: "HEAD DOWN", at: A("Head") }]} x={1220} y={60} w={640} start={A("brace")} />,
    sfx: [["brace", "whoosh", 0.35]],
  },
  p37: {
    env: cabin({ dim: [0, 0.45] }),
    who: aislePair({ expr: [[0, "neutral"]], act: [[0, "idle"], ["count", "pointL"], ["darkness", "reach"]] }, { expr: [[0, "neutral"]] }),
    ui: (f, A) => {
      const n = f >= A("count") ? Math.min(5, 1 + Math.floor((f - A("count")) / 25)) : 0;
      return n ? <BigStat value={n} label="ROWS TO THE EXIT" start={A("count")} dur={1} y={180} color={ICE} /> : null;
    },
    ov: [{ t: "punch", w: "Third", text: "3. COUNT THE ROWS", color: GOLD, y: 860 }],
    sfx: [["count", "pop", 0.3]],
  },
  p38: {
    env: row({ ground: 0.3, sky: "#3a6a9a" }),
    who: rowPair({ expr: [[0, "neutral"], ["trap", "worried"]], act: [[0, "hold"], ["inflate", "cross"], ["leave", "point"]] }, { expr: [[0, "neutral"]] }),
    props: (f, A) => (
      <g transform="translate(1060 640)">
        <path d="M -60 -40 Q 0 -90 60 -40 L 70 60 Q 0 80 -70 60 Z" fill="#f2a01b" stroke="#0b0a0c" strokeWidth={5} opacity={f >= A("vest") ? 1 : 0} />
      </g>
    ),
    ov: [
      { t: "pill", w: "vest", text: "PUT YOUR LIFE VEST ON", x: 960, y: 160, color: ICE },
      { t: "tag", w: "inflate", text: "DON'T INFLATE IT INSIDE", x: 960, y: 240 },
      { t: "pill", w: "leave", text: "INFLATE IT AT THE DOOR", x: 960, y: 320, color: GOLD },
    ],
  },
  p39: {
    env: cabin({ dim: [0, 0.35] }),
    who: [{ c: YOU, x: [[0, 1300], ["Your", 1300], ["Every", 960]], y: 960, expr: [[0, "worried"], ["Every", "neutral"]], act: [[0, "idle"], ["leave", "shrug"]], look: -0.3 }],
    ov: [
      { t: "pill", w: "bag", text: "BAG", x: 600, y: 200, struck: "laptop", color: GOLD },
      { t: "pill", w: "laptop", text: "LAPTOP", x: 960, y: 200, struck: "phone", color: GOLD },
      { t: "pill", w: "phone", text: "PHONE", x: 1320, y: 200, struck: "Every", color: GOLD },
      { t: "punch", w: "leave", text: "LEAVE EVERYTHING", color: RED, y: 860 },
    ],
  },
  p39b: {
    env: (f) => <SimHangar f={f} dark={0.3} />,
    ui: (f, A) => (
      <>
        <Timer label="EVACUATION TEST" t0={A("ninety")} base={0} x={740} y={60} color={RED} start={A("ninety")} />
        <BigStat value={90} label="SECONDS · HALF OF THE EXITS" start={A("ninety")} y={300} color={GOLD} />
      </>
    ),
    who: [{ c: FA, x: 300, act: [[0, "talk"], ["half", "pointUp"]], talk: [[0, "exits"]], expr: [[0, "neutral"]] }],
    sfx: [["ninety", "ticktock", 0.35]],
  },
  p39c: {
    env: cabin({ dim: [0, 0.5] }),
    who: aislePair({ expr: [[0, "worried"], ["work", "happy"]], act: [[0, "idle"], ["counting", "pointL"], ["leaving", "shrug"]] }, { expr: [[0, "worried"]] }),
    ov: [{ t: "punch", w: "Ninety", text: "90 SECONDS", color: RED, y: 260 }],
  },
  p40: {
    env: (f) => <Classroom f={f} />,
    who: [{ c: DR, x: 420, item: [[0, "tablet"]], act: [[0, "hold"]], expr: [[0, "neutral"], ["ninety-five", "happy"]], talk: [[0, "board"]] }],
    ui: (f, A) => <BigStat value={95} prefix=">" suffix="%" label="SURVIVED · US AIRLINE ACCIDENTS 1983–2000" start={A("ninety-five")} y={180} color={GOLD} />,
    ov: [{ t: "pill", w: "study", text: "NTSB SAFETY STUDY", x: 1300, y: 760, color: ICE }],
    sfx: [["ninety-five", "sparkle", 0.35]],
  },
  p41: {
    env: (f) => <Office f={f} />,
    who: [{ c: DR, x: 420, act: [[0, "talk"], ["Planes", "pointUp"]], expr: [[0, "neutral"], ["Planes", "happy"]], talk: [[0, "like"]] }],
    ov: [
      { t: "pill", w: "rare", text: "RARE", x: 1000, y: 260, color: ICE },
      { t: "pill", w: "dangerous", text: "DANGEROUS", x: 1300, y: 260, color: RED },
      { t: "pill", w: "death", text: "NOT A DEATH SENTENCE", x: 1150, y: 380, color: GOLD },
      { t: "punch", w: "Planes", text: "PLANES GLIDE. CREWS TRAIN.", color: ICE, y: 640, end: "live" },
      { t: "punch", w: "live", text: "PEOPLE LIVE.", color: GOLD, y: 640 },
    ],
  },
  p42: {
    env: (f) => <Terminal f={f} dusk />,
    who: rowPair({ expr: [[0, "happy"]], act: [[0, "idle"]], look: -0.6 }, { expr: [[0, "happy"]], item: [[0, "cup"]] }),
    ov: [{ t: "punch", w: "planned", text: "A VERY WELL PLANNED SYSTEM", color: ICE, y: 260 }],
    sfx: [["planned", "sparkle", 0.3]],
  },
  p43: {
    env: cabin({}),
    who: [...aislePair({ expr: [[0, "happy"], ["aisle", "surprised"], ["subscribe", "happy"]], act: [[0, "talk"], ["calm", "think"], ["subscribe", "wave"]], item: [["subscribe", "phone"]] }, { expr: [[0, "happy"]], act: [[0, "idle"], ["aisle", "clap"]] }), { c: ZOE, x: 1300, y: 990, s: 1.0, sit: true, behind: <Seat x={1300} y={990} s={1.0} />, front: <Seat x={1300} y={990} s={1.0} front />, expr: [[0, "happy"]] }],
    ov: [
      { t: "pill", w: "comments", text: "💬 Calm, or first in the aisle?", x: 960, y: 200, color: GOLD, size: 50 },
      { t: "hud", w: "next", label: "NEXT VIDEO", value: "NEVER SLEEP AGAIN?", color: ICE, x: 1080, y: 560, wd: 760 },
    ],
    sfx: [["subscribe", "popper", 0.4]],
  },
  p07b: {
    env: (f, A) => (
      <Classroom
        f={f}
        chalk={
          <g>
            {f >= A("glide") && chalkT(620, 220, "GLIDE RATIO", 56)}
            {f >= A("fifteen") && chalkT(1170, 220, "≈ 15 : 1", 72, GOLD)}
            <path d="M 650 280 L 1540 540" stroke="#f6efdf" strokeWidth={7} fill="none" strokeDasharray="930" strokeDashoffset={930 * (1 - prog(f, A("Drop"), A("forward") + 15))} />
            {f >= A("kilometer") && (
              <g>
                <path d="M 640 290 L 640 380" stroke={ICE} strokeWidth={6} />
                {chalkT(560, 350, "1", 48, ICE)}
              </g>
            )}
            {f >= A("forward") && (
              <g>
                <path d="M 650 570 L 1540 570" stroke={GOLD} strokeWidth={6} />
                {chalkT(1000, 560, "15 KM", 48, GOLD)}
              </g>
            )}
          </g>
        }
      />
    ),
    who: [
      { c: DR, x: 400, expr: [[0, "neutral"], ["map", "happy"]], act: [[0, "talk"], ["glide", "point"], ["Drop", "pointUp"], ["forward", "point"]], talk: [[0, "one."]] },
      { c: YOU, x: 1730, expr: [[0, "confused"], ["map", "surprised"]], act: [[0, "cross"], ["Drop", "think"], ["map", "cheer"]], look: -0.5 },
    ],
    ov: [{ t: "punch", w: "map", text: "10 KM UP ≈ 150 KM OF MAP", color: GOLD, y: 860, size: 84 }],
    sfx: [["glide", "click", 0.3], ["forward", "whoosh", 0.3]],
    start: "still",
  },
  p10b: {
    env: (f, A) => <AtcRoom f={f} emergency={f >= A("emergency")} />,
    who: [{ c: SAM, x: 560, y: 960, s: 1.05, expr: [[0, "neutral"], ["emergency", "surprised"], ["Other", "worried"], ["option", "happy"]], act: [[0, "idle"], ["radar", "point"], ["Other", "talk"], ["runway", "pointUp"]], talk: [["Other", "option."]] }],
    ov: [
      { t: "pill", w: "code", text: "SQUAWK 7700", x: 960, y: 190, color: RED, size: 58 },
      { t: "tag", w: "moved", text: "OTHER TRAFFIC: MOVED AWAY", x: 1340, y: 300, color: ICE },
      { t: "pill", w: "runway", text: "EVERY RUNWAY = AN OPTION", x: 1340, y: 380, color: GOLD },
    ],
    zoom: [["radar", 960, 560, 1.7, 60]],
    sfx: [["emergency", "sting", 0.3], ["moved", "whoosh", 0.3]],
  },
  p10c: {
    env: (f, A) => <SimHangar f={f} tilt={f >= A("tilt") ? 7 * Math.sin((f - A("tilt")) / 9) : 0} />,
    who: [{ c: FO, x: 400, expr: [[0, "happy"], ["fail", "neutral"], ["automatic", "happy"]], act: [[0, "talk"], ["simulators", "point"], ["fail", "cross"], ["automatic", "pointUp"]], talk: [[0, "roar."]] }],
    ov: [
      { t: "pill", w: "simulators", text: "FULL-MOTION SIMULATOR", x: 1240, y: 200, color: ICE },
      { t: "tag", w: "purpose", text: "ENGINE FAILURE: ON PURPOSE", x: 1240, y: 300, color: RED },
      { t: "punch", w: "automatic", text: "UNTIL IT'S AUTOMATIC", color: GOLD, y: 860 },
    ],
    hits: ["shake"],
    sfx: [["tilt", "whoosh", 0.3], ["roar", "boom", 0.25]],
  },
  p12b: {
    env: (f) => <Galley f={f} alarm />,
    who: [
      { c: FA, x: 420, expr: [[0, "neutral"]], act: [[0, "hold"], ["door", "pointL"]], item: [[0, "clipboard"], ["door", null]] },
      { c: FA, x: [[0, 1560], ["moving", 980]], expr: [[0, "neutral"], ["shout", "angry"]], act: [[0, "idle"], ["Carts", "grip"], ["Loose", "reach"], ["door", "point"], ["shout", "cheer"]] },
    ],
    ov: [
      { t: "pill", w: "locked", text: "CARTS: LOCKED", x: 960, y: 180, color: ICE },
      { t: "pill", w: "stowed", text: "LOOSE ITEMS: STOWED", x: 960, y: 270, color: ICE },
      { t: "pill", w: "door", text: "EACH ONE HAS A DOOR", x: 960, y: 360, color: GOLD },
      { t: "bubble", w: "shout", who: 1, text: "COME THIS WAY!" },
    ],
    sfx: [["locked", "click", 0.4], ["stowed", "knock", 0.35]],
  },
  p23c: {
    env: (f) => <Boneyard f={f} />,
    who: [{ c: YOU, x: [[0, -120], ["service", 620]], expr: [[0, "happy"], ["retired", "sad"], ["desert", "happy"]], act: [[0, "idle"], ["passengers", "point"], ["retired", "hips"], ["desert", "wave"]] }],
    ov: [
      { t: "tag", w: "Gimli", text: "THE GIMLI GLIDER", x: 960, y: 170, color: GOLD },
      { t: "pill", w: "twenty-five", text: "+25 YEARS OF SERVICE", x: 1320, y: 300, color: ICE },
      { t: "pill", w: "retired", text: "RETIRED: 2008", x: 1320, y: 400, color: GOLD },
    ],
    zoom: [["parked", 1290, 690, 1.5, 60]],
  },
  p29b: {
    env: (f) => <Observatory f={f} />,
    who: [{ c: DR, x: 640, item: [[0, "tablet"], ["track", null]], expr: [[0, "neutral"], ["around", "happy"]], act: [[0, "hold"], ["track", "point"], ["around", "cheer"]] }],
    ov: [
      { t: "pill", w: "network", text: "VOLCANIC ASH ADVISORY CENTERS", x: 700, y: 170, color: ICE, size: 44 },
      { t: "punch", w: "around", text: "AROUND IT, NOT THROUGH IT", color: GOLD, y: 860, size: 84 },
    ],
    zoom: [["warn", 1410, 200, 1.8, 60]],
    sfx: [["warn", "sting", 0.25]],
  },
  p33b: {
    env: (f) => <Cockpit f={f} alarm ground={0.85} sky="#8fb3d8" />,
    who: pilots({ expr: [[0, "worried"], ["Hudson", "neutral"]], act: [[0, "talk"], ["Brace", "grip"]], talk: [["radio", "Hudson."], ["Brace", "impact."]] }, { expr: [[0, "worried"], ["Brace", "surprised"]], act: [[0, "grip"]] }),
    ov: [
      { t: "bubble", w: "We're", who: 0, text: "We're gonna be in the Hudson.", end: "Then" },
      { t: "punch", w: "Brace", text: "BRACE FOR IMPACT", color: RED, y: 260 },
      { t: "flash", w: "Brace" },
    ],
    ui: both(alt(1200, 600)),
    sfx: [["radio", "click", 0.4], ["three", "heartbeat", 0.35]],
  },
  p34b: {
    env: (f, A) => (
      <River f={f}>
        {[0, 1, 2, 3, 4, 5].map((k) => miniPerson(760 + k * 46, 662, 1.2, ["#e0452f", "#f2c21b", "#4a8ad8", "#8f5bd8", "#2f8f9a", "#f08a24"][k], k, f))}
        <g transform={`translate(${1250 - prog(f, A("rescue"), A("rafts")) * 120} ${760 + Math.sin(f / 14) * 5})`}>
          <ellipse cx={0} cy={0} rx={130} ry={30} fill="#f08a24" stroke="#0b0a0c" strokeWidth={5} />
          {[0, 1, 2, 3].map((k) => miniPerson(-80 + k * 54, -6, 1.1, "#e9edf2", k + 10, f))}
        </g>
        <g transform={`translate(${2200 - prog(f, A("Ferry"), A("minutes")) * 780} 740)`}>
          <rect x={-150} y={-50} width={300} height={60} rx={12} fill="#e9edf2" stroke="#0b0a0c" strokeWidth={5} />
          <rect x={-90} y={-100} width={180} height={54} rx={8} fill="#2f5aa8" stroke="#0b0a0c" strokeWidth={5} />
          <path d={`M 150 0 q 30 ${-6 + Math.sin(f / 3) * 4} 60 0`} stroke="#fff" strokeWidth={5} fill="none" />
        </g>
      </River>
    ),
    ov: [
      { t: "hud", w: 0, label: "WATER", value: "NEAR FREEZING", color: ICE, x: 60, y: 50, wd: 460 },
      { t: "pill", w: "minutes", text: "RESCUED WITHIN MINUTES", x: 960, y: 200, color: GOLD },
      { t: "punch", w: "everyone", text: "EVERYONE MADE IT HOME", color: GOLD, y: 330 },
    ],
    zoom: [["wings", 860, 640, 1.6, 60]],
    sfx: [["Ferry", "whoosh", 0.3], ["everyone", "sparkle", 0.35]],
    start: "in",
  },
  p34c: {
    env: (f) => <Museum f={f} label="FLIGHT 1549" />,
    who: [
      { c: MIA, x: [[0, -260], ["sits", 260]], expr: [[0, "happy"]], act: [[0, "idle"], ["Charlotte", "think"]] },
      { c: YOU, x: [[0, -100], ["sits", 470]], expr: [[0, "neutral"], ["sits", "happy"]], act: [[0, "idle"], ["museum", "point"], ["city", "pointUp"]] },
    ],
    ov: [
      { t: "pill", w: "Charlotte", text: "CHARLOTTE, NORTH CAROLINA", x: 1300, y: 190, color: ICE },
      { t: "tag", w: "city", text: "ITS DESTINATION THAT DAY", x: 1300, y: 290, color: GOLD },
    ],
    zoom: [["never", 860, 600, 1.4, 50]],
  },
  p37b: {
    env: cabin({}),
    who: aislePair({ expr: [[0, "neutral"], ["different", "surprised"], ["opens", "happy"]], act: [[0, "idle"], ["read", "hold"], ["exits", "pointL"]], item: [["read", "clipboard"], ["exits", null]] }, { expr: [[0, "neutral"]], act: [[0, "idle"], ["exits", "pointUp"]] }),
    ov: [
      { t: "pill", w: "safety", text: "SAFETY CARD", x: 960, y: 190, color: GOLD },
      { t: "tag", w: "different", text: "EVERY AIRCRAFT IS DIFFERENT", x: 960, y: 290, color: ICE },
      { t: "pill", w: "exits", text: "YOUR EXITS + HOW YOUR DOOR OPENS", x: 960, y: 390, color: GOLD, size: 44 },
    ],
  },
  p41b: {
    env: (f) => <Terminal f={f} />,
    who: [
      { c: YOU, x: 700, expr: [[0, "happy"]], act: [[0, "talk"], ["lessons", "point"]], talk: [[0, "travel."]] },
      { c: MIA, x: 980, expr: [[0, "neutral"], ["crew", "happy"]], item: [[0, "phone"], ["investigated", null]], act: [[0, "phone"], ["investigated", "think"], ["crew", "clap"]] },
    ],
    ui: (f, A) => <Checklist title="EVERY LESSON GOES INTO" items={[{ t: "THE NEXT AIRPLANE", at: A("airplane") }, { t: "THE NEXT CHECKLIST", at: A("checklist") }, { t: "THE NEXT CREW", at: A("crew") }]} start={A("lessons")} x={1240} y={430} />,
    ov: [{ t: "pill", w: "safest", text: "ONE OF THE SAFEST WAYS TO TRAVEL", x: 700, y: 190, color: GOLD, size: 46 }],
    sfx: [["investigated", "click", 0.3]],
  },
};
