import React from "react";
import { interpolate, interpolateColors, random, useCurrentFrame } from "remotion";
import { at, W } from "./timing";
import { Backdrop, bodyFont, C, Chip, ease, Glow, headFont, Headline, PauseIcon, Person, pop, Vignette } from "./kit";

/* ---------------- shared: birthday cake ---------------- */
export const Cake: React.FC<{ x: number; y: number; s?: number; lit: number; frozenAt?: number; outAt?: number }> = ({
  x,
  y,
  s = 1,
  lit,
  frozenAt,
  outAt,
}) => {
  const f = useCurrentFrame();
  const tf = frozenAt !== undefined ? Math.min(f, frozenAt) : f; // frozen time
  const flick = (i: number) => 1 + 0.12 * Math.sin(tf / 2.3 + i * 2) + 0.06 * Math.sin(tf / 1.1 + i);
  const candles = [-70, 70];
  const frozen = frozenAt !== undefined && f >= frozenAt;
  return (
    <svg width={W} height={1080} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <Glow id="flame" color={C.gold} std={10} />
        <linearGradient id="icing" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ffe9f2" />
          <stop offset="1" stopColor="#f7b6cf" />
        </linearGradient>
      </defs>
      <g transform={`translate(${x},${y}) scale(${s})`}>
        <ellipse cx={0} cy={330} rx={330} ry={34} fill="#000" opacity={0.4} />
        <rect x={-290} y={170} width={580} height={150} rx={20} fill="#6b3b2a" />
        <rect x={-290} y={170} width={580} height={40} rx={18} fill="url(#icing)" />
        <rect x={-210} y={50} width={420} height={140} rx={18} fill="#7d4530" />
        <rect x={-210} y={50} width={420} height={36} rx={16} fill="url(#icing)" />
        {[-150, -60, 30, 120].map((dx, i) => (
          <path key={i} d={`M ${dx} 84 q 15 30 30 0`} fill="#f7b6cf" />
        ))}
        <text x={0} y={290} textAnchor="middle" fontFamily={headFont} fontSize={110} fill={C.gold}>
          25
        </text>
        {candles.map((cx, i) => (
          <g key={i}>
            <rect x={cx - 12} y={-60} width={24} height={112} rx={6} fill={i ? "#62e6ff" : "#ff8fb8"} />
            {[0, 1, 2, 3].map((k) => (
              <rect key={k} x={cx - 12} y={-50 + k * 28} width={24} height={8} fill="#fff" opacity={0.6} transform={`skewY(-20)`} />
            ))}
            <rect x={cx - 2} y={-80} width={4} height={22} fill="#333" />
            {lit > 0 && (
              <g filter="url(#flame)" transform={`translate(${cx}, -82) scale(${lit * (frozen ? 1 : flick(i))})`}>
                <path d="M 0 -60 Q 22 -24 14 -6 Q 6 8 0 8 Q -6 8 -14 -6 Q -22 -24 0 -60 Z" fill={C.gold} />
                <path d="M 0 -34 Q 9 -14 6 -4 Q 3 3 0 3 Q -3 3 -6 -4 Q -9 -14 0 -34 Z" fill="#fff6d8" />
              </g>
            )}
            {outAt !== undefined &&
              f > outAt &&
              new Array(9).fill(0).map((_, k) => {
                const age = ((tf - outAt) * 1.0 - k * 9);
                if (age < 0) return null;
                const yy = -90 - age * 3.2;
                const xx = cx + Math.sin(age / 9 + k) * (10 + age * 0.4);
                const op = Math.max(0, 0.55 - age / 140);
                return <circle key={k} cx={xx} cy={yy} r={10 + age * 0.45} fill={frozen ? C.ice : "#c9cbd6"} opacity={op} />;
              })}
          </g>
        ))}
      </g>
    </svg>
  );
};

const FrostOverlay: React.FC<{ start: number }> = ({ start }) => {
  const f = useCurrentFrame();
  const p = ease(f, start, start + 12);
  if (p <= 0) return null;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "rgba(98,230,255,0.10)", opacity: p, mixBlendMode: "screen" }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: `inset 0 0 ${200 * p}px rgba(98,230,255,0.45)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "white",
          opacity: interpolate(f, [start, start + 3, start + 12], [0, 0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      />
    </>
  );
};

/* 1 ---------------- HOOK 1 ---------------- */
export const Hook1: React.FC = () => {
  const f = useCurrentFrame();
  const blow = at("hook1", "blow") + 14;
  const stop = at("hook1", "stops");
  const lit = 1 - ease(f, blow, blow + 8);
  const zoom = 1 + 0.06 * ease(f, 0, 300) ;
  return (
    <>
      <Backdrop tint="#1c1530" seed="h1" />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})` }}>
        <Cake x={960} y={420} lit={lit} outAt={blow} frozenAt={stop} />
      </div>
      <FrostOverlay start={stop} />
      <PauseIcon start={stop} x={960} y={215} size={130} />
      <Headline text="NOT YOUR LIFE." start={at("hook1", "life")} y={30} size={70} color={C.dim} />
      <Headline text="YOUR AGING." start={at("hook1", "aging")} y={760} size={130} color={C.ice} glow="rgba(98,230,255,0.5)" />
      <Vignette />
    </>
  );
};

/* 2 ---------------- HOOK 2 ---------------- */
export const Hook2: React.FC = () => {
  const f = useCurrentFrame();
  const die = at("hook2", "die");
  const out = 1 - ease(f, die - 6, die + 6);
  const red = ease(f, die - 4, die + 10);
  return (
    <>
      <Backdrop tint={interpolateColors(red, [0, 1], ["#16284a", "#3a0d16"])} seed="h2" />
      <div style={{ position: "absolute", inset: 0, opacity: out }}>
        <Headline text="SOUNDS LIKE A DREAM" start={at("hook2", "dream")} y={130} size={100} color={C.gold} glow="rgba(255,200,97,0.4)" />
        <Chip text="GRAY HAIR" start={at("hook2", "gray") - 4} struck={at("hook2", "gray") + 10} x={460} y={460} size={58} />
        <Chip text="WRINKLES" start={at("hook2", "wrinkles") - 4} struck={at("hook2", "wrinkles") + 10} x={960} y={460} size={58} />
        <Chip text="SLOWING DOWN" start={at("hook2", "slowing") - 4} struck={at("hook2", "slowing") + 10} x={1460} y={460} size={58} />
      </div>
      <Headline text="BUT YOU'D STILL" start={at("hook2", "still")} y={230} size={110} color={C.white} />
      <Headline text="DIE" start={die} y={330} size={300} color={C.red} glow="rgba(255,77,94,0.6)" />
      <Headline text="...just not the way you think" start={at("hook2", "think") - 10} y={660} size={70} color={C.dim} />
      <Vignette />
    </>
  );
};

/* 3 ---------------- SETUP 1: hallmarks ---------------- */
const HALLMARKS = [
  "Genomic instability",
  "Telomere attrition",
  "Epigenetic alterations",
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
export const Setup1: React.FC = () => {
  const f = useCurrentFrame();
  const dozen = at("setup1", "dozen");
  const wear = at("setup1", "wear");
  const first = 1 - ease(f, dozen - 8, dozen);
  return (
    <>
      <Backdrop seed="s1" />
      <div style={{ opacity: first }}>
        <Headline text="AGING ISN'T ONE THING" start={4} y={380} size={150} />
      </div>
      <Headline text="THE 12 HALLMARKS OF AGING" start={at("setup1", "hallmarks") - 6} y={70} size={100} color={C.ice} />
      {HALLMARKS.map((h, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const st = dozen + i * 4;
        const p = pop(f, st);
        const worn = ease(f, wear + i * 2, wear + 20 + i * 2);
        if (f < st) return null;
        return (
          <div
            key={h}
            style={{
              position: "absolute",
              left: 130 + col * 420,
              top: 240 + row * 150,
              width: 390,
              height: 120,
              borderRadius: 18,
              border: `3px solid ${interpolateColors(worn, [0, 1], [C.ice, C.red])}`,
              background: "rgba(5,11,24,0.8)",
              transform: `scale(${p}) rotate(${worn * (random(h) - 0.5) * 6}deg)`,
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "0 22px",
              fontFamily: bodyFont,
              fontWeight: 800,
              fontSize: 30,
              color: C.white,
            }}
          >
            <span style={{ fontFamily: headFont, fontSize: 54, color: interpolateColors(worn, [0, 1], [C.ice, C.red]) }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            {h}
          </div>
        );
      })}
      {f > dozen + 50 && (
        <div style={{ position: "absolute", right: 140, top: 712, fontFamily: bodyFont, fontWeight: 600, fontSize: 24, color: C.dim }}>
          Based on López-Otín et al., Cell (2023)
        </div>
      )}
      <Vignette />
    </>
  );
};

/* 4 ---------------- SETUP 2: DNA / proteins / zombie cells ---------------- */
const Helix: React.FC<{ f: number }> = ({ f }) => {
  const pts = new Array(40).fill(0).map((_, i) => i);
  return (
    <g>
      {pts.map((i) => {
        const y = -170 + i * 9;
        if (i > 18 && i < 23) return null; // the break
        const a = Math.sin(i / 3 + f / 15) * 70;
        return (
          <g key={i}>
            {i % 2 === 0 && <line x1={-a} y1={y} x2={a} y2={y} stroke="#9fb6ff" strokeWidth={4} opacity={0.6} />}
            <circle cx={a} cy={y} r={7} fill={C.ice} />
            <circle cx={-a} cy={y} r={7} fill={C.gold} />
          </g>
        );
      })}
      <text x={60} y={20} fill={C.red} fontFamily={headFont} fontSize={60}>⚡</text>
    </g>
  );
};
const Protein: React.FC<{ f: number }> = ({ f }) => {
  let d = "M 0 0";
  for (let i = 0; i < 60; i++) {
    const a = i * 0.9 + f / 40;
    const r = 40 + 90 * random("p" + i);
    d += ` L ${Math.cos(a) * r} ${Math.sin(a * 1.3) * r}`;
  }
  return <path d={d} fill="none" stroke="#ff9f6b" strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" opacity={0.9} />;
};
const ZombieCell: React.FC<{ f: number }> = ({ f }) => (
  <g transform={`scale(${1 + 0.03 * Math.sin(f / 10)})`}>
    <circle r={140} fill="rgba(125,255,155,0.15)" stroke={C.green} strokeWidth={6} />
    <circle r={55} fill="rgba(125,255,155,0.35)" />
    <circle cx={-20} cy={-10} r={9} fill="#081" />
    <circle cx={20} cy={-10} r={9} fill="#081" />
    <path d="M -22 22 Q 0 10 22 22" stroke="#081" strokeWidth={6} fill="none" />
  </g>
);
export const Setup2: React.FC = () => {
  const f = useCurrentFrame();
  const pause = at("setup2", "pause");
  const fz = f >= pause ? pause : f;
  const iceAmt = ease(f, pause, pause + 10);
  const items = [
    { x: 420, label: "DNA DAMAGE", st: at("setup2", "DNA"), el: <Helix f={fz} /> },
    { x: 960, label: "WORN-OUT PROTEINS", st: at("setup2", "Worn"), el: <Protein f={fz} /> },
    { x: 1500, label: "'ZOMBIE' CELLS", st: at("setup2", "Cells"), el: <ZombieCell f={fz} /> },
  ];
  return (
    <>
      <Backdrop tint="#13213f" seed="s2" />
      <div style={{ position: "absolute", inset: 0, filter: `saturate(${1 - iceAmt * 0.8}) brightness(${1 - iceAmt * 0.25})` }}>
        <svg width={W} height={1080} style={{ position: "absolute", inset: 0 }}>
          {items.map((it) => {
            const p = pop(f, it.st);
            if (f < it.st) return null;
            return (
              <g key={it.label} transform={`translate(${it.x}, 400) scale(${p})`}>
                {it.el}
              </g>
            );
          })}
        </svg>
        {items.map((it) =>
          f >= it.st ? (
            <div
              key={it.label}
              style={{
                position: "absolute",
                left: it.x - 250,
                width: 500,
                top: 610,
                textAlign: "center",
                fontFamily: headFont,
                fontSize: 64,
                color: C.white,
                opacity: ease(f, it.st, it.st + 10),
              }}
            >
              {it.label}
            </div>
          ) : null,
        )}
      </div>
      {f >= pause && <div style={{ position: "absolute", inset: 0, background: "rgba(5,11,24,0.45)" }} />}
      <FrostOverlay start={pause} />
      <PauseIcon start={pause} x={960} y={400} size={280} />
      <Headline text="WHAT HAPPENS NEXT?" start={at("setup2", "next") - 8} y={90} size={110} color={C.ice} glow="rgba(98,230,255,0.5)" />
      <Vignette />
    </>
  );
};

/* 5 ---------------- YEARS: friends age, you don't ---------------- */
export const Years: React.FC = () => {
  const f = useCurrentFrame();
  const p = ease(f, at("years", "first"), at("years", "thirty") + 20, (x) => x);
  const notice = at("years", "notice");
  const xs = [360, 660, 960, 1260, 1560];
  return (
    <>
      <Backdrop seed="yr" />
      <Headline text={`YEAR +${Math.round(p * 10)}`} start={2} y={50} size={120} color={C.gold} />
      <svg width={W} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <Glow id="you" color={C.ice} std={10} />
        </defs>
        {xs.map((x, i) => {
          const you = i === 2;
          const age = you ? 0 : p;
          const hair = interpolateColors(age, [0, 0.4, 1], ["#3a2a1c", "#4d4036", "#a8a8ad"]);
          return (
            <g key={i} filter={you ? "url(#you)" : undefined} opacity={pop(f, i * 4)}>
              <Person x={x} y={390} s={1.25} hair={hair} body={you ? "#1f6f86" : "#2b3f66"} hunch={age * 0.25 * (i % 2 ? 1 : -1)} />
              <text x={x} y={720} textAnchor="middle" fontFamily={headFont} fontSize={72} fill={you ? C.ice : C.white}>
                AGE {you ? 25 : 25 + Math.round(p * 10)}
              </text>
              {you && (
                <text x={x} y={295} textAnchor="middle" fontFamily={headFont} fontSize={56} fill={C.ice}>
                  YOU
                </text>
              )}
              {!you && f > notice + i * 3 && (
                <text
                  x={x + 40}
                  y={300}
                  fontFamily={headFont}
                  fontSize={90}
                  fill={C.gold}
                  transform={`rotate(${10 * Math.sin(f / 6 + i)}, ${x + 40}, 290)`}
                  opacity={pop(f, notice + i * 3)}
                >
                  ?
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <Vignette />
    </>
  );
};

/* 6 ---------------- SAME: body stays 25 ---------------- */
export const Same: React.FC = () => {
  const f = useCurrentFrame();
  const young = at("same", "young");
  const cardsOut = 1 - ease(f, young - 8, young + 4);
  const cards = [
    { x: 420, title: "SKIN", sub: "Heals like new", st: at("same", "skin") },
    { x: 960, title: "JOINTS", sub: "No wear", st: at("same", "joints") },
    { x: 1500, title: "HEART", sub: "Beats like day one", st: at("same", "heart") },
  ];
  const ecg = () => {
    let d = "";
    for (let i = 0; i <= 60; i++) {
      const x = -160 + i * 5.33;
      const ph = (i + f) % 30;
      const y = ph === 10 ? -60 : ph === 11 ? 40 : ph === 12 ? -20 : 0;
      d += `${i ? "L" : "M"} ${x} ${y}`;
    }
    return d;
  };
  const ex = at("same", "exactly");
  return (
    <>
      <Backdrop seed="sm" tint="#0f2a3d" />
      <div style={{ opacity: cardsOut }}>
        {cards.map((c) => {
          const p = pop(f, c.st);
          if (f < c.st) return null;
          return (
            <div
              key={c.title}
              style={{
                position: "absolute",
                left: c.x - 230,
                top: 220,
                width: 460,
                height: 440,
                borderRadius: 28,
                border: `3px solid ${C.ice}`,
                background: "rgba(5,11,24,0.8)",
                transform: `scale(${p})`,
                textAlign: "center",
                boxShadow: `0 0 40px rgba(98,230,255,0.25)`,
              }}
            >
              <div style={{ fontFamily: headFont, fontSize: 100, color: C.ice, marginTop: 30 }}>{c.title}</div>
              <svg width={460} height={140}>
                <g transform="translate(230,70)">
                  {c.title === "HEART" ? (
                    <path d={ecg()} stroke={C.red} strokeWidth={6} fill="none" />
                  ) : c.title === "SKIN" ? (
                    <path d="M -150 0 Q -75 -40 0 0 T 150 0" stroke="#e8c4a0" strokeWidth={16} fill="none" strokeLinecap="round" />
                  ) : (
                    <g>
                      <rect x={-150} y={-12} width={130} height={24} rx={12} fill="#dfe6f5" />
                      <rect x={20} y={-12} width={130} height={24} rx={12} fill="#dfe6f5" transform={`rotate(${-25 * Math.sin(f / 15)}, 20, 0)`} />
                      <circle cx={0} cy={0} r={26} fill={C.ice} />
                    </g>
                  )}
                </g>
              </svg>
              <div style={{ fontFamily: bodyFont, fontWeight: 800, fontSize: 38, color: C.white }}>{c.sub}</div>
              <div style={{ fontFamily: headFont, fontSize: 56, color: C.gold, marginTop: 14 }}>BIO AGE: 25</div>
            </div>
          );
        })}
      </div>
      {f >= young &&
        [
          { x: 560, label: "AGE 25" },
          { x: 1360, label: "AGE 35" },
        ].map((fr, i) => {
          const p = pop(f, young + i * 8);
          return (
            <div key={fr.label} style={{ position: "absolute", left: fr.x - 220, top: 170, width: 440, height: 540, transform: `scale(${p}) rotate(${i ? 3 : -3}deg)`, background: "#f4f1ea", borderRadius: 8, boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
              <svg width={400} height={400} style={{ position: "absolute", left: 20, top: 20, background: "#22385e" }}>
                <Person x={200} y={150} s={1.3} body="#1f6f86" />
              </svg>
              <div style={{ position: "absolute", bottom: 26, width: "100%", textAlign: "center", fontFamily: headFont, fontSize: 72, color: "#222" }}>
                {fr.label}
              </div>
            </div>
          );
        })}
      {f >= ex && (
        <>
          <Headline text="=" start={ex} y={330} size={200} color={C.ice} glow="rgba(98,230,255,0.5)" />
          <div
            style={{
              position: "absolute",
              left: 960,
              top: 120,
              transform: `translate(-50%,0) rotate(-8deg) scale(${pop(f, ex + 6, 8)})`,
              border: `8px solid ${C.red}`,
              color: C.red,
              fontFamily: headFont,
              fontSize: 110,
              padding: "0 40px",
              borderRadius: 16,
              background: "rgba(5,11,24,0.6)",
            }}
          >
            IDENTICAL
          </div>
        </>
      )}
      <Vignette />
    </>
  );
};

/* 7 ---------------- TELOMERES ---------------- */
const Chromosome: React.FC<{ capR: number; capColor: string; glow?: boolean }> = ({ capR, capColor, glow }) => {
  const arm = (rot: number) => (
    <g transform={`rotate(${rot})`}>
      <rect x={-26} y={-150} width={52} height={300} rx={26} fill="#7b8fd6" />
      <circle cx={0} cy={-150} r={capR} fill={capColor} filter={glow ? "url(#capglow)" : undefined} />
      <circle cx={0} cy={150} r={capR} fill={capColor} filter={glow ? "url(#capglow)" : undefined} />
    </g>
  );
  return (
    <g>
      {arm(28)}
      {arm(-28)}
      <circle r={22} fill="#4e5ea8" />
    </g>
  );
};
export const Telomeres: React.FC = () => {
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
      <Backdrop seed="tl" tint="#151c44" />
      <Headline text="TELOMERES" start={at("telomeres", "telomeres") - 6} y={40} size={110} color={C.gold} />
      <svg width={W} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <Glow id="capglow" color={C.ice} std={8} />
        </defs>
        <g transform={`translate(${interpolate(rightIn, [0, 1], [960, 520])}, 430) scale(${pop(f, 0)})`}>
          <Chromosome capR={capR} capColor={f >= stop ? C.red : C.gold} />
        </g>
        {f >= frozen - 6 && (
          <g transform={`translate(1400, 430) scale(${rightIn})`}>
            <Chromosome capR={30} capColor={C.ice} glow />
          </g>
        )}
      </svg>
      <div style={{ position: "absolute", left: interpolate(rightIn, [0, 1], [960, 520]) - 300, width: 600, top: 640, textAlign: "center", fontFamily: headFont, fontSize: 56, color: f >= stop ? C.red : C.white }}>
        {f >= stop ? "DIVISION STOPPED" : f >= div ? `DIVISIONS: ${n}` : "A NORMAL CELL"}
      </div>
      {f >= frozen - 6 && (
        <div style={{ position: "absolute", left: 1100, width: 600, top: 640, textAlign: "center", fontFamily: headFont, fontSize: 56, color: C.ice, opacity: rightIn }}>
          {f >= clock ? "CLOCK FROZEN ∞" : `YOUR CELL · DIVISIONS: ${yours}`}
        </div>
      )}
      {f >= at("telomeres", "caps") && f < frozen && (
        <div style={{ position: "absolute", left: 1090, top: 250, fontFamily: bodyFont, fontWeight: 800, fontSize: 36, color: C.gold, opacity: ease(f, at("telomeres", "caps"), at("telomeres", "caps") + 10) }}>
          ← protective caps
        </div>
      )}
      <Vignette />
    </>
  );
};
