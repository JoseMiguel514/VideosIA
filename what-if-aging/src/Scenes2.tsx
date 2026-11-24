import React from "react";
import { interpolate, interpolateColors, random, useCurrentFrame } from "remotion";
import { at, W } from "./timing";
import { Backdrop, bodyFont, C, Chip, ease, Glow, headFont, Headline, pop, Vignette } from "./kit";
import { Cake } from "./Scenes1";

/* 8 ---------------- JELLYFISH ---------------- */
export const Jelly: React.FC<{ f: number; polyp: number }> = ({ f, polyp }) => {
  const pulse = 1 + 0.06 * Math.sin(f / 7);
  const bell = 1 - polyp;
  return (
    <g>
      {/* adult medusa */}
      <g opacity={bell} transform={`scale(${(0.4 + 0.6 * bell) * pulse}, ${(0.4 + 0.6 * bell) / pulse})`}>
        {new Array(9).fill(0).map((_, i) => {
          const x0 = -90 + i * 22.5;
          let d = `M ${x0} 10`;
          for (let k = 1; k <= 12; k++) d += ` L ${x0 + Math.sin(f / 9 + k / 2 + i) * (6 + k * 1.6)} ${10 + k * 22}`;
          return <path key={i} d={d} stroke="#ff9ec7" strokeWidth={4} fill="none" opacity={0.75} />;
        })}
        <path d="M -120 10 Q -120 -120 0 -120 Q 120 -120 120 10 Q 100 0 80 12 Q 60 0 40 12 Q 20 0 0 12 Q -20 0 -40 12 Q -60 0 -80 12 Q -100 0 -120 10 Z" fill="rgba(255,120,170,0.35)" stroke="#ffb3d4" strokeWidth={5} />
        <ellipse cx={0} cy={-40} rx={45} ry={30} fill="#ff4f8f" opacity={0.7} />
      </g>
      {/* polyp stage */}
      <g opacity={polyp} transform={`translate(0, 120) scale(${0.5 + 0.5 * polyp})`}>
        <rect x={-80} y={70} width={160} height={14} rx={7} fill="#6b5a4a" />
        <path d="M -10 70 Q -14 0 0 -40 Q 14 0 10 70 Z" fill="#ffb3d4" />
        {[-1, -0.5, 0, 0.5, 1].map((k) => (
          <path key={k} d={`M 0 -40 Q ${k * 40} -80 ${k * 55 + Math.sin(f / 8 + k) * 6} -100`} stroke="#ff9ec7" strokeWidth={5} fill="none" />
        ))}
      </g>
    </g>
  );
};
export const JellyScene: React.FC = () => {
  const f = useCurrentFrame();
  const juv = at("jelly", "juvenile");
  const again = at("jelly", "Again");
  const eaten = at("jelly", "eaten");
  const sick = at("jelly", "sick");
  const imm = at("jelly", "immortal");
  // morph adult -> polyp -> adult -> polyp -> adult
  const polyp = interpolate(f, [juv - 10, juv + 15, again, again + 15, again + 30, again + 45], [0, 1, 0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fishX = interpolate(f, [eaten - 15, eaten + 35], [2300, -500], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sickAmt = ease(f, sick, sick + 15);
  const ring = ease(f, juv - 10, juv + 10) * (1 - ease(f, again + 50, again + 60));
  const bite = f > eaten + 10 ? 0.55 : 1;
  return (
    <>
      <Backdrop seed="jl" tint="#06324a" />
      <Headline text="TURRITOPSIS DOHRNII" start={at("jelly", "jellyfish")} y={40} size={90} color="#ffb3d4" glow="rgba(255,120,170,0.4)" />
      <Headline text="the 'immortal' jellyfish" start={at("jelly", "jellyfish") + 10} y={140} size={56} color={C.dim} />
      <svg width={W} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <Glow id="jg" color="#ff6fae" std={14} />
        </defs>
        {ring > 0 && (
          <g opacity={ring}>
            <circle cx={960} cy={470} r={300} fill="none" stroke={C.ice} strokeWidth={5} strokeDasharray="22 16" transform={`rotate(${f * 1.5}, 960, 470)`} />
            <text x={1300} y={480} fontFamily={headFont} fontSize={60} fill={C.ice}>ADULT</text>
            <text x={490} y={480} textAnchor="end" fontFamily={headFont} fontSize={60} fill={C.gold}>JUVENILE</text>
            <text x={960} y={140 + 70} textAnchor="middle" fontFamily={headFont} fontSize={70} fill={C.white}>↻</text>
          </g>
        )}
        <g
          transform={`translate(960, ${460 + 10 * Math.sin(f / 20)})`}
          filter="url(#jg)"
          style={{ filter: `url(#jg) saturate(${1 - sickAmt}) ` }}
          opacity={bite}
        >
          <Jelly f={f} polyp={polyp} />
        </g>
        {f > eaten - 15 && f < eaten + 40 && (
          <g transform={`translate(${fishX}, 470)`}>
            <path d="M -260 0 Q -120 -130 120 -40 L 260 -110 L 220 0 L 260 110 L 120 40 Q -120 130 -260 0 Z" fill="#0a1626" stroke="#22405e" strokeWidth={4} />
            <path d="M -230 10 L -180 30 L -150 8 L -120 32 L -90 8" stroke="#dfe6f5" strokeWidth={6} fill="none" />
            <circle cx={-170} cy={-30} r={10} fill={C.gold} />
          </g>
        )}
      </svg>
      {f >= sick && <div style={{ position: "absolute", inset: 0, background: "rgba(255,77,94,0.18)", opacity: sickAmt * (1 - ease(f, imm - 10, imm)) }} />}
      <Chip text="STILL GETS EATEN" start={eaten + 12} x={500} y={780} color={C.red} />
      <Chip text="STILL GETS SICK" start={sick} x={1420} y={780} color={C.red} />
      <Headline text="NOT AGING ≠ IMMORTAL" start={imm - 8} y={180} size={130} color={C.white} glow="rgba(255,77,94,0.5)" />
      <Vignette />
    </>
  );
};

/* 9 ---------------- MATH: risk curve ---------------- */
export const MathScene: React.FC = () => {
  const f = useCurrentFrame();
  const long = at("math", "long");
  const never = at("math", "never");
  const kills = at("math", "kills");
  const X0 = 170,
    X1 = 1050,
    Y0 = 720,
    Y1 = 200;
  const ax = (age: number) => X0 + ((age - 20) / 80) * (X1 - X0);
  const ay = (v: number) => Y0 - v * (Y0 - Y1); // v 0..1 on log scale
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
  return (
    <>
      <Backdrop seed="mt" />
      <svg width={W} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={X0} y1={Y0} x2={X1 + 30} y2={Y0} stroke={C.dim} strokeWidth={4} />
        <line x1={X0} y1={Y0} x2={X0} y2={Y1 - 40} stroke={C.dim} strokeWidth={4} />
        {[20, 40, 60, 80, 100].map((a) => (
          <text key={a} x={ax(a)} y={Y0 + 50} textAnchor="middle" fontFamily={headFont} fontSize={40} fill={C.dim}>
            {a}
          </text>
        ))}
        <text x={(X0 + X1) / 2} y={Y0 + 100} textAnchor="middle" fontFamily={headFont} fontSize={44} fill={C.white}>AGE</text>
        <text x={X0 - 30} y={(Y0 + Y1) / 2} textAnchor="middle" fontFamily={headFont} fontSize={40} fill={C.white} transform={`rotate(-90, ${X0 - 30}, ${(Y0 + Y1) / 2})`}>
          YEARLY RISK OF DYING
        </text>
        <path d={normal} stroke={C.red} strokeWidth={9} fill="none" pathLength={1} strokeDasharray={`${drawN} 1`} strokeLinecap="round" />
        {drawN > 0.95 && <text x={ax(84)} y={ay(0.92)} fontFamily={headFont} fontSize={46} fill={C.red} textAnchor="end">NORMAL AGING</text>}
        <line x1={ax(25)} y1={ay(0.13)} x2={ax(25) + (X1 - ax(25)) * drawF} y2={ay(0.13)} stroke={C.ice} strokeWidth={9} strokeLinecap="round" />
        {drawF > 0.9 && <text x={X1} y={ay(0.13) - 24} fontFamily={headFont} fontSize={46} fill={C.ice} textAnchor="end">FROZEN AT 25</text>}
      </svg>
      <div style={{ position: "absolute", left: 1170, top: 160, width: 680, textAlign: "center", fontFamily: headFont, fontSize: 64, color: C.gold, opacity: ease(f, kills, kills + 10) }}>
        WHAT KILLS 25-YEAR-OLDS?
      </div>
      <Chip text="Disease" start={kills + 15} struck={at("math", "disease")} x={1510} y={290} color={C.dim} />
      {causes.map((c, i) => (
        <Chip key={c.t} text={c.t} start={at("math", c.w)} x={1510} y={400 + i * 105} color={C.red} width={420} />
      ))}
      <div style={{ position: "absolute", left: X0, top: Y0 + 125, fontFamily: bodyFont, fontWeight: 600, fontSize: 22, color: C.dim, opacity: drawN }}>
        Illustrative shape, log scale
      </div>
      <Vignette />
    </>
  );
};

/* 10 ---------------- LIFESPAN bar ---------------- */
export const Lifespan: React.FC = () => {
  const f = useCurrentFrame();
  const sev = at("lifespan", "several");
  const th = at("lifespan", "thousand");
  const avg = at("lifespan", "average", 1);
  const years = interpolate(f, [0, 20, sev, sev + 45, th - 5, th + 30], [0, 80, 80, 500, 500, 1000], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const L = 160,
    R = 1760;
  const xOf = (y: number) => L + (y / 1000) * (R - L);
  const flick = f > avg ? 0.75 + 0.25 * Math.sin(f / 2) : 1;
  return (
    <>
      <Backdrop seed="ls" tint="#1a1d3f" />
      <div style={{ position: "absolute", top: 110, width: "100%", textAlign: "center", fontFamily: headFont, fontSize: 220, color: C.ice, textShadow: "0 0 40px rgba(98,230,255,0.5)" }}>
        {years >= 999 ? "~1,000" : Math.round(years)} <span style={{ fontSize: 100, color: C.white }}>YEARS?</span>
      </div>
      <svg width={W} height={1080} style={{ position: "absolute", inset: 0 }}>
        <rect x={L} y={500} width={R - L} height={60} rx={30} fill="rgba(255,255,255,0.08)" stroke={C.dim} strokeWidth={3} />
        <rect x={L} y={500} width={xOf(years) - L} height={60} rx={30} fill={C.ice} opacity={flick} />
        <rect x={L} y={500} width={xOf(80) - L} height={60} rx={30} fill={C.gold} />
        <line x1={xOf(80)} y1={470} x2={xOf(80)} y2={600} stroke={C.gold} strokeWidth={4} />
        <text x={xOf(80) + 10} y={640} fontFamily={headFont} fontSize={44} fill={C.gold}>A TYPICAL LIFE TODAY</text>
        {[0, 250, 500, 750, 1000].map((y) => (
          <text key={y} x={xOf(y)} y={460} textAnchor="middle" fontFamily={headFont} fontSize={38} fill={C.dim}>
            {y}
          </text>
        ))}
      </svg>
      <Headline text="AN AVERAGE." start={avg} y={690} size={100} color={C.white} />
      <Headline text="NOT A PROMISE." start={at("lifespan", "promise") - 4} y={790} size={100} color={C.red} glow="rgba(255,77,94,0.4)" />
      <div style={{ position: "absolute", right: 160, top: 655, fontFamily: bodyFont, fontWeight: 600, fontSize: 24, color: C.dim, opacity: ease(f, sev, sev + 20) * (1 - ease(f, avg - 5, avg)) }}>
        Rough estimate, not a measured figure
      </div>
      <Vignette />
    </>
  );
};

/* 11 ---------------- YEAR 200: skyline through eras ---------------- */
export const Year200: React.FC = () => {
  const f = useCurrentFrame();
  const hund = at("year200", "hundredth");
  const bye = at("year200", "goodbye");
  const car = at("year200", "careers");
  const age = interpolate(f, [0, hund + 20], [25, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eraF = (age - 25) / 25; // eras of 25 years
  const era = Math.floor(eraF);
  const mix = eraF - era;
  const city = (e: number, op: number) =>
    new Array(22).fill(0).map((_, i) => {
      const h = 120 + random(`b${e}-${i}`) * (200 + e * 45);
      const w = 70 + random(`w${e}-${i}`) * 30;
      const x = i * 90 - 20;
      const shape = e % 3;
      return (
        <g key={`${e}-${i}`} opacity={op}>
          {shape === 2 ? (
            <path d={`M ${x} 760 L ${x + w / 2} ${760 - h} L ${x + w} 760 Z`} fill="#16264a" />
          ) : (
            <rect x={x} y={760 - h} width={w} height={h} rx={shape === 1 ? w / 2 : 4} fill="#16264a" />
          )}
          {new Array(Math.floor(h / 50)).fill(0).map((__, k) =>
            random(`l${e}${i}${k}`) > 0.5 ? <rect key={k} x={x + w / 2 - 8} y={760 - h + 20 + k * 50} width={16} height={18} fill={C.gold} opacity={0.6} /> : null,
          )}
        </g>
      );
    });
  const sky = interpolateColors(eraF % 3, [0, 1, 2, 3], ["#1b2d5a", "#3b1f4f", "#0f3a46", "#1b2d5a"]);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${sky}, #050b18)` }} />
      <svg width={W} height={1080} style={{ position: "absolute", inset: 0 }}>
        {city(era, 1 - mix)}
        {city(era + 1, mix)}
        <rect x={0} y={760} width={W} height={320} fill="#050b18" />
        {f >= bye &&
          new Array(16).fill(0).map((_, i) => {
            const p = pop(f, bye + i * 3);
            const x = 120 + i * 112;
            return (
              <g key={i} transform={`translate(${x}, 790) scale(${p})`}>
                <path d="M -32 70 L -32 0 Q -32 -36 0 -36 Q 32 -36 32 0 L 32 70 Z" fill="#3a4766" />
                <rect x={-4} y={-18} width={8} height={40} fill="#7f8db0" />
                <rect x={-16} y={-6} width={32} height={8} fill="#7f8db0" />
              </g>
            );
          })}
      </svg>
      <div style={{ position: "absolute", top: 60, width: "100%", textAlign: "center", fontFamily: headFont, fontSize: 170, color: C.gold, textShadow: "0 0 40px rgba(255,200,97,0.4)" }}>
        AGE {Math.round(age)}
      </div>
      <div style={{ position: "absolute", top: 240, width: "100%", textAlign: "center", fontFamily: headFont, fontSize: 60, color: C.ice }}>
        STILL LOOKS 25
      </div>
      {["CAREER #1", "CAREER #2", "CAREER #3"].map((c, i) => (
        <Chip key={c} text={c} start={car + i * 6} struck={car + 18 + i * 6} x={560 + i * 400} y={420} color={C.dim} />
      ))}
      <Vignette />
    </>
  );
};

/* 12 ---------------- RISK ---------------- */
const Car: React.FC = () => (
  <g>
    <path d="M -150 20 L -130 -30 Q -110 -70 -50 -70 L 50 -70 Q 100 -70 120 -30 L 150 20 Z" fill={C.ice} />
    <rect x={-170} y={10} width={340} height={50} rx={20} fill={C.ice} />
    <rect x={-90} y={-58} width={70} height={40} rx={8} fill="#0c1d3a" />
    <rect x={0} y={-58} width={80} height={40} rx={8} fill="#0c1d3a" />
    <circle cx={-95} cy={65} r={34} fill="#111" stroke="#ccc" strokeWidth={8} />
    <circle cx={95} cy={65} r={34} fill="#111" stroke="#ccc" strokeWidth={8} />
  </g>
);
const Ski: React.FC = () => (
  <g>
    <path d="M -180 90 L -40 -110 L 40 0 L 90 -50 L 180 90 Z" fill="#2b3f66" />
    <path d="M -40 -110 L -70 -68 L -40 -80 L -15 -74 Z" fill="#fff" />
    <line x1={-150} y1={60} x2={120} y2={-20} stroke={C.gold} strokeWidth={12} strokeLinecap="round" />
    <line x1={-130} y1={90} x2={140} y2={10} stroke={C.gold} strokeWidth={12} strokeLinecap="round" />
  </g>
);
const Warn: React.FC = () => (
  <g>
    <path d="M 0 -110 L 130 100 L -130 100 Z" fill="none" stroke={C.red} strokeWidth={14} strokeLinejoin="round" />
    <text x={0} y={80} textAnchor="middle" fontFamily={headFont} fontSize={170} fill={C.red}>!</text>
  </g>
);
export const Moto: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <circle cx={-120} cy={50} r={60} fill="none" stroke="#ddd" strokeWidth={14} />
    <circle cx={120} cy={50} r={60} fill="none" stroke="#ddd" strokeWidth={14} />
    <path d="M -120 50 L -40 -30 L 60 -30 L 120 50" stroke={C.red} strokeWidth={18} fill="none" strokeLinejoin="round" />
    <path d="M -60 -40 L 40 -40 L 60 -70 L -40 -70 Z" fill={C.red} />
    <line x1={70} y1={-30} x2={100} y2={-90} stroke="#ddd" strokeWidth={12} />
    <line x1={90} y1={-90} x2={130} y2={-95} stroke="#ddd" strokeWidth={12} />
    {[0, 1, 2].map((k) => (
      <line key={k} x1={-220 - k * 30} y1={-20 + k * 30} x2={-190 - k * 30 - ((f * 6) % 40)} y2={-20 + k * 30} stroke={C.dim} strokeWidth={6} />
    ))}
  </g>
);
export const Risk: React.FC = () => {
  const f = useCurrentFrame();
  const moto = at("risk", "motorcycle");
  const items = [
    { x: 420, el: <Car />, st: at("risk", "car"), label: "EVERY CAR RIDE" },
    { x: 960, el: <Ski />, st: at("risk", "ski"), label: "EVERY SKI TRIP" },
    { x: 1500, el: <Warn />, st: at("risk", "risk", 0), label: "EVERY RISK" },
  ];
  const rowOut = 1 - ease(f, moto - 10, moto);
  const cent = at("risk", "centuries");
  return (
    <>
      <Backdrop seed="rk" tint="#2a1630" />
      <Headline text="SOMETHING SHIFTS" start={2} y={70} size={100} color={C.white} />
      <div style={{ position: "absolute", inset: 0, opacity: rowOut }}>
        <svg width={W} height={1080} style={{ position: "absolute", inset: 0 }}>
          {items.map((it) =>
            f >= it.st ? (
              <g key={it.label} transform={`translate(${it.x}, 430) scale(${pop(f, it.st)})`}>
                {it.el}
              </g>
            ) : null,
          )}
        </svg>
        {items.map((it) =>
          f >= it.st ? (
            <div key={it.label} style={{ position: "absolute", left: it.x - 250, width: 500, top: 590, textAlign: "center", fontFamily: headFont, fontSize: 60, color: C.white, opacity: ease(f, it.st, it.st + 10) }}>
              {it.label}
            </div>
          ) : null,
        )}
        {f >= cent && (
          <div style={{ position: "absolute", left: 960, top: 700, transform: `translate(-50%,0) scale(${pop(f, cent)})`, background: C.red, color: "white", fontFamily: headFont, fontSize: 80, padding: "6px 50px", borderRadius: 14, whiteSpace: "nowrap" }}>
            CENTURIES ON THE LINE
          </div>
        )}
      </div>
      {f >= moto - 4 && (
        <>
          <svg width={W} height={1080} style={{ position: "absolute", inset: 0 }}>
            <g transform={`translate(${interpolate(pop(f, moto - 4), [0, 1], [2200, 900])}, 500) scale(1.6)`}>
              <Moto f={f} />
            </g>
          </svg>
          <div style={{ position: "absolute", left: 1350, top: 250, fontFamily: headFont, fontSize: 380, color: C.gold, transform: `rotate(${8 * Math.sin(f / 8)}deg) scale(${pop(f, moto + 10)})` }}>?</div>
        </>
      )}
      <Vignette />
    </>
  );
};

/* 13 ---------------- TWIST ---------------- */
export const Twist: React.FC = () => {
  const f = useCurrentFrame();
  const flash = interpolate(f, [0, 4, 20], [0.7, 0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const age = at("twist", "age");
  return (
    <>
      <Backdrop seed="tw" tint="#2e0d1a" />
      <div style={{ position: "absolute", inset: 0, background: C.red, opacity: flash }} />
      <Headline text="THE TWIST" start={at("twist", "twist") - 6} y={50} size={130} color={C.red} glow="rgba(255,77,94,0.5)" />
      <Chip text="Heart disease" start={at("twist", "heart")} x={480} y={290} color={C.red} />
      <Chip text="Many cancers" start={at("twist", "cancers")} x={960} y={290} color={C.red} />
      <Chip text="Alzheimer's" start={at("twist", "Alzheimer")} x={1440} y={290} color={C.red} />
      <Headline text="#1 RISK FACTOR" start={at("twist", "greatest")} y={390} size={90} color={C.white} />
      <Chip text="SMOKING" start={at("twist", "smoking") - 4} struck={at("twist", "smoking") + 12} x={520} y={600} color={C.dim} size={64} />
      <Chip text="DIET" start={at("twist", "diet") - 4} struck={at("twist", "diet") + 10} x={960} y={600} color={C.dim} size={64} />
      {f >= age - 4 && (
        <div
          style={{
            position: "absolute",
            left: 1440,
            top: 600,
            transform: `translate(-50%,-50%) scale(${pop(f, age - 4, 8) * (1 + 0.04 * Math.sin(f / 5))})`,
            fontFamily: headFont,
            fontSize: 220,
            color: C.gold,
            textShadow: "0 0 50px rgba(255,200,97,0.7)",
          }}
        >
          AGE
        </div>
      )}
      <Vignette />
    </>
  );
};

/* 14 ---------------- ROOT: aging as the root ---------------- */
export const Root: React.FC = () => {
  const f = useCurrentFrame();
  const root = at("root", "root");
  const many = at("root", "many");
  const grow = ease(f, 0, 50);
  const rootGlow = ease(f, root - 5, root + 15);
  const leaves = [
    { t: "Heart disease", x: 420, y: 320 },
    { t: "Many cancers", x: 760, y: 215 },
    { t: "Alzheimer's", x: 1160, y: 215 },
    { t: "Stroke", x: 1500, y: 320 },
  ];
  return (
    <>
      <Backdrop seed="rt" tint="#10283a" />
      <Headline text="NOT JUST CHASING YOUTH" start={at("root", "youth") - 8} y={40} size={80} color={C.dim} />
      <svg width={W} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <Glow id="rg" color={C.gold} std={12} />
        </defs>
        {leaves.map((l, i) => (
          <path key={i} d={`M 960 560 Q 960 ${l.y + 140} ${l.x} ${l.y + 40}`} stroke="#6b4a2e" strokeWidth={18} fill="none" pathLength={1} strokeDasharray={`${grow} 1`} strokeLinecap="round" />
        ))}
        <rect x={935} y={500} width={50} height={210} fill="#6b4a2e" />
        <g filter={rootGlow > 0 ? "url(#rg)" : undefined}>
          {[-260, -150, -50, 50, 150, 260].map((dx, i) => (
            <path key={i} d={`M 960 700 Q ${960 + dx * 0.4} 760 ${960 + dx} ${790 + (i % 2) * 20}`} stroke={interpolateColors(rootGlow, [0, 1], ["#6b4a2e", C.gold])} strokeWidth={12} fill="none" strokeLinecap="round" />
          ))}
        </g>
      </svg>
      {rootGlow > 0 && (
        <div style={{ position: "absolute", left: 960, top: 805, transform: `translate(-50%,0) scale(${pop(f, root)})`, fontFamily: headFont, fontSize: 90, color: C.gold, textShadow: "0 0 30px rgba(255,200,97,0.8)" }}>
          AGING
        </div>
      )}
      {leaves.map((l, i) => (
        <Chip key={l.t} text={l.t} start={many + i * 5} x={l.x} y={l.y} color={C.red} size={40} />
      ))}
      <Vignette />
    </>
  );
};

/* 15 ---------------- LAB: senolytics ---------------- */
export const Mouse: React.FC = () => (
  <g>
    <ellipse cx={0} cy={0} rx={130} ry={75} fill="#c9cbd6" />
    <circle cx={110} cy={-30} r={50} fill="#c9cbd6" />
    <circle cx={100} cy={-85} r={30} fill="#e7b3c2" stroke="#c9cbd6" strokeWidth={10} />
    <circle cx={135} cy={-35} r={7} fill="#111" />
    <circle cx={160} cy={-22} r={8} fill="#e7859e" />
    <path d="M -125 10 Q -220 30 -240 -40" stroke="#e7b3c2" strokeWidth={10} fill="none" strokeLinecap="round" />
  </g>
);
export const Lab: React.FC = () => {
  const f = useCurrentFrame();
  const clear = at("lab", "clear");
  const mice = at("lab", "mice");
  const hum = at("lab", "humans");
  const yet = at("lab", "yet");
  const cells = new Array(26).fill(0).map((_, i) => {
    const a = random("ca" + i) * Math.PI * 2;
    const r = Math.sqrt(random("cr" + i)) * 230;
    return {
      x: 620 + Math.cos(a) * r + Math.sin(f / 30 + i) * 8,
      y: 450 + Math.sin(a) * r + Math.cos(f / 25 + i) * 8,
      zombie: i % 5 === 0,
      i,
    };
  });
  return (
    <>
      <Backdrop seed="lb" tint="#0f2a2a" />
      <Headline text="ANIMAL STUDIES" start={at("lab", "animal") - 6} y={50} size={90} color={C.green} />
      <svg width={W} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id="scope">
            <circle cx={620} cy={450} r={280} />
          </clipPath>
          <Glow id="zg" color={C.green} std={8} />
        </defs>
        <circle cx={620} cy={450} r={290} fill="#081a1c" stroke="#9fb6c8" strokeWidth={14} />
        <g clipPath="url(#scope)">
          {cells.map((c) => {
            const k = c.zombie ? 1 - ease(f, clear + 8 + c.i, clear + 22 + c.i) : 1;
            if (k <= 0) return null;
            return (
              <g key={c.i} transform={`translate(${c.x},${c.y}) scale(${k})`} filter={c.zombie ? "url(#zg)" : undefined}>
                <circle r={30} fill={c.zombie ? "rgba(125,255,155,0.35)" : "rgba(255,170,190,0.3)"} stroke={c.zombie ? C.green : "#ffb3c6"} strokeWidth={3} />
                <circle r={11} fill={c.zombie ? C.green : "#d4708c"} />
              </g>
            );
          })}
        </g>
        {f >= mice - 10 && (
          <g transform={`translate(1380, 380) scale(${pop(f, mice - 10)})`}>
            <Mouse />
          </g>
        )}
      </svg>
      <Chip text="'Zombie' cells cleared" start={clear} x={620} y={790} color={C.green} size={38} />
      <Chip text="Old mice: healthier ✓" start={mice} x={1380} y={540} color={C.green} size={40} />
      <Chip text="Humans: still early" start={hum} x={1380} y={660} color={C.gold} size={40} />
      {f >= yet - 6 && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(5,11,24,0.7)", opacity: ease(f, yet - 6, yet + 4) }} />
      )}
      <Headline text="NOT YET." start={yet - 4} y={380} size={220} color={C.ice} glow="rgba(98,230,255,0.6)" />
      <Vignette />
    </>
  );
};

/* 16 ---------------- OUTRO 1: hourglass ---------------- */
export const Outro1: React.FC = () => {
  const f = useCurrentFrame();
  const tom = at("outro1", "tomorrow");
  const sand = ease(f, 0, 330, (x) => x);
  const danger = ease(f, tom, tom + 10);
  const sc = interpolateColors(danger, [0, 1], [C.gold, C.red]);
  return (
    <>
      <Backdrop seed="o1" tint="#20183a" />
      <Headline text="25 FOREVER?" start={at("outro1", "forever") - 6} y={50} size={120} color={C.ice} glow="rgba(98,230,255,0.4)" />
      <svg width={W} height={1080} style={{ position: "absolute", inset: 0 }}>
        <g transform="translate(960, 520)">
          <rect x={-200} y={-310} width={400} height={30} rx={10} fill="#8a6a45" />
          <rect x={-200} y={280} width={400} height={30} rx={10} fill="#8a6a45" />
          <clipPath id="top">
            <path d="M -160 -280 L 160 -280 Q 160 -120 14 0 L -14 0 Q -160 -120 -160 -280 Z" />
          </clipPath>
          <clipPath id="bot">
            <path d="M -14 0 L 14 0 Q 160 120 160 280 L -160 280 Q -160 120 -14 0 Z" />
          </clipPath>
          <rect clipPath="url(#top)" x={-170} y={-280 + 280 * sand * 0.9} width={340} height={300} fill={sc} />
          <path clipPath="url(#bot)" d={`M -170 280 L -170 ${280 - 200 * sand} Q 0 ${200 - 330 * sand} 170 ${280 - 200 * sand} L 170 280 Z`} fill={sc} />
          <rect x={-3} y={-10} width={6} height={280 - 120 * sand} fill={sc} opacity={0.9} />
          <path d="M -160 -280 L 160 -280 Q 160 -120 14 0 Q 160 120 160 280 L -160 280 Q -160 120 -14 0 Q -160 -120 -160 -280 Z" fill="rgba(200,230,255,0.08)" stroke="#cfe6ff" strokeWidth={6} />
        </g>
      </svg>
      {f >= tom && (
        <div style={{ position: "absolute", right: 200, top: 440, fontFamily: headFont, fontSize: 90, color: C.red, opacity: danger }}>
          ...OR<br />TOMORROW
        </div>
      )}
      {f >= at("outro1", "time") && (
        <div style={{ position: "absolute", left: 200, top: 440, fontFamily: headFont, fontSize: 90, color: C.gold, opacity: ease(f, at("outro1", "time"), at("outro1", "time") + 10) }}>
          ALL THAT<br />TIME
        </div>
      )}
      <Vignette />
    </>
  );
};

/* 17 ---------------- OUTRO 2: CTA ---------------- */
export const Outro2: React.FC<{ voiceEnd: number }> = ({ voiceEnd }) => {
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
      <Backdrop seed="o2" tint="#1c1530" />
      <div style={{ position: "absolute", inset: 0, transform: "translateX(-190px) scale(0.62)", transformOrigin: "0px 560px" }}>
        <Cake x={960} y={420} lit={ease(f, 5, 20)} />
      </div>
      <Headline text="WOULD YOU TAKE THE DEAL?" start={at("outro2", "deal") - 8} y={60} size={110} color={C.gold} glow="rgba(255,200,97,0.4)" />
      {f >= com && (
        <div style={{ position: "absolute", left: 830, top: 260, width: 960, minHeight: 150, padding: "28px 36px", borderRadius: 28, background: "#f2f6ff", color: "#111", fontFamily: bodyFont, fontWeight: 800, fontSize: 44, transform: `scale(${pop(f, com)})`, transformOrigin: "left center" }}>
          <div style={{ fontSize: 26, color: "#666", marginBottom: 8 }}>💬 Your comment</div>
          {typed}
          <span style={{ opacity: Math.floor(f / 10) % 2 ? 1 : 0 }}>|</span>
        </div>
      )}
      {f >= sub - 6 && (
        <div
          style={{
            position: "absolute",
            left: 1310,
            top: 560,
            transform: `translate(-50%,0) scale(${pop(f, sub - 6) * (f > sub + 12 && f < sub + 18 ? 0.92 : 1)})`,
            background: clicked ? "#3a3f4f" : "#e62117",
            color: "white",
            fontFamily: bodyFont,
            fontWeight: 900,
            fontSize: 56,
            padding: "22px 60px",
            borderRadius: 60,
          }}
        >
          {clicked ? "✓ SUBSCRIBED" : "SUBSCRIBE"}
        </div>
      )}
      {f >= sub && (
        <svg width={W} height={1080} style={{ position: "absolute", inset: 0 }}>
          <g transform={`translate(${interpolate(ease(f, sub, sub + 14), [0, 1], [1700, 1400])}, ${interpolate(ease(f, sub, sub + 14), [0, 1], [900, 620])})`}>
            <path d="M 0 0 L 0 60 L 16 46 L 28 72 L 40 66 L 28 40 L 50 40 Z" fill="white" stroke="#111" strokeWidth={4} />
          </g>
        </svg>
      )}
      {f >= next && (
        <div style={{ position: "absolute", left: 1310, top: 720, transform: `translate(-50%,0) scale(${pop(f, next)})`, border: `3px solid ${C.ice}`, borderRadius: 20, background: "rgba(5,11,24,0.85)", padding: "16px 40px", fontFamily: headFont, fontSize: 60, color: C.ice, whiteSpace: "nowrap" }}>
          NEXT: WHAT IF YOU NEVER SLEPT AGAIN?
        </div>
      )}
      <div style={{ position: "absolute", inset: 0, background: "black", opacity: endFade }} />
      {endFade > 0 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: headFont, fontSize: 140, color: C.ice, opacity: ease(f, voiceEnd + 30, voiceEnd + 50), textShadow: "0 0 40px rgba(98,230,255,0.5)" }}>
          WHAT IF YOU NEVER AGED?
        </div>
      )}
      <Vignette />
    </>
  );
};
