import React from "react";
import {
  AbsoluteFill,
  Composition,
  Easing,
  interpolate,
  random,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadCinzel } from "@remotion/google-fonts/Cinzel";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";

const { fontFamily: titleFont } = loadCinzel("normal", {
  weights: ["700", "900"],
  subsets: ["latin"],
});
const { fontFamily: bodyFont } = loadMontserrat("normal", {
  weights: ["600", "800"],
  subsets: ["latin"],
});

const FPS = 30;
const GOLD = "#f2c36b";
const CREAM = "#fbf1dc";
const RED = "#e2533a";

// Scene timings (frames)
const S = {
  hook: { from: 0, dur: 120 },
  iliad: { from: 120, dur: 180 },
  timeline: { from: 300, dur: 210 },
  theories: { from: 510, dur: 390 },
  outro: { from: 900, dur: 120 },
};
const TOTAL = S.outro.from + S.outro.dur;

export const MyComposition = () => {
  return (
    <Composition
      id="CaballoDeTroya"
      component={Reel}
      durationInFrames={TOTAL}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};

/* ---------- helpers ---------- */

const useFadeInOut = (dur: number, inF = 12, outF = 12) => {
  const f = useCurrentFrame();
  return interpolate(f, [0, inF, dur - outF, dur], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

const Pop: React.FC<{
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, children, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - delay, fps, config: { damping: 14, mass: 0.7 } });
  return (
    <div
      style={{
        opacity: interpolate(s, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(s, [0, 1], [60, 0])}px) scale(${interpolate(s, [0, 1], [0.92, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Background: React.FC = () => {
  const f = useCurrentFrame();
  const embers = new Array(40).fill(0).map((_, i) => {
    const x = random(`x${i}`) * 1080;
    const speed = 1 + random(`s${i}`) * 2.5;
    const size = 3 + random(`z${i}`) * 7;
    const y = 1920 + 50 - ((f * speed + random(`o${i}`) * 2000) % 2100);
    const sway = Math.sin((f + i * 20) / 25) * 20;
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: x + sway,
          top: y,
          width: size,
          height: size,
          borderRadius: "50%",
          background: i % 3 === 0 ? RED : GOLD,
          opacity: 0.35 + random(`a${i}`) * 0.4,
          boxShadow: `0 0 ${size * 3}px ${GOLD}`,
        }}
      />
    );
  });
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 70%, #5a2a12 0%, #2a1208 45%, #0d0604 100%)",
      }}
    >
      {embers}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.65) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

const Horse: React.FC<{ size?: number; color?: string }> = ({
  size = 700,
  color = "#c98a45",
}) => {
  const dark = "#6b3d17";
  return (
    <svg width={size} height={size} viewBox="0 0 400 400">
      {/* platform & wheels */}
      <rect x="60" y="310" width="280" height="22" rx="4" fill={dark} />
      {[95, 165, 235, 305].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="345" r="22" fill={dark} />
          <circle cx={cx} cy="345" r="8" fill={color} />
        </g>
      ))}
      {/* legs */}
      {[100, 135, 250, 285].map((x) => (
        <rect key={x} x={x} y="215" width="24" height="100" fill={color} stroke={dark} strokeWidth="3" />
      ))}
      {/* body */}
      <rect x="85" y="150" width="230" height="85" rx="18" fill={color} stroke={dark} strokeWidth="4" />
      {[172, 194, 216].map((y) => (
        <line key={y} x1="92" y1={y} x2="308" y2={y} stroke={dark} strokeWidth="3" />
      ))}
      {/* hidden door */}
      <rect x="175" y="165" width="50" height="45" fill="none" stroke={dark} strokeWidth="4" strokeDasharray="6 4" />
      {/* neck */}
      <polygon points="255,160 300,160 330,60 295,55" fill={color} stroke={dark} strokeWidth="4" />
      {/* head */}
      <polygon points="290,40 345,45 385,95 365,110 320,80" fill={color} stroke={dark} strokeWidth="4" />
      <circle cx="335" cy="62" r="5" fill={dark} />
      {/* ear & mane */}
      <polygon points="300,42 308,15 318,44" fill={color} stroke={dark} strokeWidth="3" />
      <path d="M292 60 L280 85 L290 90 L276 115 L287 120 L270 150" fill="none" stroke={dark} strokeWidth="6" strokeLinecap="round" />
      {/* tail */}
      <path d="M88 165 Q55 190 62 250" fill="none" stroke={dark} strokeWidth="10" strokeLinecap="round" />
    </svg>
  );
};

const title: React.CSSProperties = {
  fontFamily: titleFont,
  fontWeight: 900,
  color: CREAM,
  textAlign: "center",
  lineHeight: 1.1,
  textShadow: "0 6px 30px rgba(0,0,0,0.8)",
};
const body: React.CSSProperties = {
  fontFamily: bodyFont,
  fontWeight: 600,
  color: CREAM,
  textAlign: "center",
  lineHeight: 1.3,
  textShadow: "0 4px 20px rgba(0,0,0,0.8)",
};

const Center: React.FC<{ children: React.ReactNode; gap?: number }> = ({
  children,
  gap = 40,
}) => (
  <AbsoluteFill
    style={{
      padding: "160px 90px",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      gap,
    }}
  >
    {children}
  </AbsoluteFill>
);

/* ---------- scenes ---------- */

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const op = useFadeInOut(S.hook.dur, 1, 10);
  const shake = f > 45 && f < 60 ? Math.sin(f * 3) * 8 : 0;
  const stampS = spring({ frame: f - 45, fps: FPS, config: { damping: 10 } });
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Center gap={30}>
        <Pop>
          <div style={{ ...body, fontSize: 52, color: GOLD, letterSpacing: 6, fontWeight: 800 }}>
            DATO QUE NADIE TE CONTÓ
          </div>
        </Pop>
        <Pop delay={6}>
          <div style={{ ...title, fontSize: 112 }}>El Caballo de Troya</div>
        </Pop>
        <div style={{ position: "relative", transform: `translateX(${shake}px)` }}>
          <Pop delay={12}>
            <Horse size={620} />
          </Pop>
        </div>
        <div
          style={{
            ...title,
            fontSize: 96,
            color: RED,
            opacity: stampS,
            transform: `scale(${interpolate(stampS, [0, 1], [2.2, 1])}) rotate(-4deg)`,
            border: `8px solid ${RED}`,
            borderRadius: 16,
            padding: "10px 36px",
          }}
        >
          NO sale en la Ilíada
        </div>
      </Center>
    </AbsoluteFill>
  );
};

const Iliad: React.FC = () => {
  const op = useFadeInOut(S.iliad.dur);
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Center gap={60}>
        <Pop>
          <div style={{ ...title, fontSize: 150 }}>📜</div>
        </Pop>
        <Pop delay={8}>
          <div style={{ ...title, fontSize: 92 }}>
            La <span style={{ color: GOLD }}>Ilíada</span> de Homero termina{" "}
            <span style={{ color: GOLD }}>antes</span> de que caiga Troya
          </div>
        </Pop>
        <Pop delay={50}>
          <div style={{ ...body, fontSize: 56 }}>
            Su último verso es el funeral de Héctor.
            <br />
            Ni rastro del caballo.
          </div>
        </Pop>
        <Pop delay={100}>
          <div style={{ ...body, fontSize: 50, color: GOLD }}>
            En la <b>Odisea</b> solo aparece en unos pocos versos.
          </div>
        </Pop>
      </Center>
    </AbsoluteFill>
  );
};

const TimelineScene: React.FC = () => {
  const f = useCurrentFrame();
  const op = useFadeInOut(S.timeline.dur);
  const lineP = interpolate(f, [20, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const points = [
    { y: 0, year: "~1180 a.C.", label: "Guerra de Troya", delay: 25 },
    { y: 0.42, year: "~750 a.C.", label: "Homero: Ilíada y Odisea", delay: 60 },
    { y: 1, year: "~19 a.C.", label: "Virgilio: la Eneida", delay: 105, hi: true },
  ];
  const H = 620;
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <AbsoluteFill style={{ padding: "180px 90px", alignItems: "center" }}>
        <Pop>
          <div style={{ ...title, fontSize: 84 }}>
            ¿Quién lo contó <span style={{ color: GOLD }}>entero</span>?
          </div>
        </Pop>
        <div style={{ position: "relative", width: 900, height: H, marginTop: 90 }}>
          <div
            style={{
              position: "absolute",
              left: 80,
              top: 0,
              width: 10,
              height: H * lineP,
              background: `linear-gradient(${GOLD}, ${RED})`,
              borderRadius: 5,
            }}
          />
          {points.map((p) => (
            <div
              key={p.year}
              style={{ position: "absolute", left: 0, top: p.y * H - 40, width: 900 }}
            >
              <Pop delay={p.delay} style={{ display: "flex", alignItems: "center", gap: 40 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    marginLeft: 57,
                    borderRadius: "50%",
                    background: p.hi ? RED : GOLD,
                    border: `6px solid ${CREAM}`,
                    flexShrink: 0,
                  }}
                />
                <div style={{ textAlign: "left" }}>
                  <div style={{ ...body, textAlign: "left", fontSize: 60, fontWeight: 800, color: p.hi ? RED : GOLD }}>
                    {p.year}
                  </div>
                  <div style={{ ...body, textAlign: "left", fontSize: 48 }}>{p.label}</div>
                </div>
              </Pop>
            </div>
          ))}
        </div>
        <Pop delay={140} style={{ marginTop: 160 }}>
          <div style={{ ...title, fontSize: 70 }}>
            ¡Más de <span style={{ color: RED }}>1.000 años</span> después!
          </div>
        </Pop>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const theories = [
  {
    n: "1",
    icon: "🪵",
    head: "Un ariete de asedio",
    text: "Cubierto con pieles de caballo mojadas para que no ardiera.",
  },
  {
    n: "2",
    icon: "⛵",
    head: "Un barco",
    text: "Algunos pueblos antiguos llamaban “caballos del mar” a sus naves.",
  },
  {
    n: "3",
    icon: "🏚️",
    head: "Un terremoto",
    text: "Poseidón era el dios de los caballos… y de los terremotos.",
  },
];

const Theories: React.FC = () => {
  const op = useFadeInOut(S.theories.dur);
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <AbsoluteFill style={{ padding: "170px 80px", alignItems: "center", gap: 50 }}>
        <Pop>
          <div style={{ ...title, fontSize: 84 }}>
            Entonces… <span style={{ color: GOLD }}>¿qué era?</span>
          </div>
        </Pop>
        <Pop delay={15}>
          <div style={{ ...body, fontSize: 46, opacity: 0.85 }}>
            Los historiadores tienen 3 teorías:
          </div>
        </Pop>
        {theories.map((t, i) => {
          const d = 50 + i * 100;
          const active = f >= d && f < d + 100;
          return (
            <Pop key={t.n} delay={d} style={{ width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  gap: 36,
                  alignItems: "center",
                  padding: "34px 40px",
                  borderRadius: 32,
                  background: active ? "rgba(242,195,107,0.18)" : "rgba(255,255,255,0.06)",
                  border: `4px solid ${active ? GOLD : "rgba(255,255,255,0.15)"}`,
                  transform: `scale(${active ? 1.03 : 1})`,
                }}
              >
                <div style={{ fontSize: 110 }}>{t.icon}</div>
                <div>
                  <div style={{ ...title, textAlign: "left", fontSize: 64, color: GOLD }}>
                    {t.n}. {t.head}
                  </div>
                  <div style={{ ...body, textAlign: "left", fontSize: 44, marginTop: 10 }}>
                    {t.text}
                  </div>
                </div>
              </div>
            </Pop>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const op = useFadeInOut(S.outro.dur, 12, 1);
  const bounce = Math.sin(f / 6) * 10;
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Center gap={60}>
        <Pop>
          <Horse size={460} />
        </Pop>
        <Pop delay={8}>
          <div style={{ ...title, fontSize: 100 }}>
            ¿Tú cuál crees? <span style={{ color: GOLD }}>1, 2 o 3</span>
          </div>
        </Pop>
        <Pop delay={30}>
          <div style={{ ...body, fontSize: 56, transform: `translateY(${bounce}px)` }}>
            👇 Déjalo en comentarios
          </div>
        </Pop>
        <Pop delay={50}>
          <div
            style={{
              ...body,
              fontSize: 50,
              fontWeight: 800,
              color: "#1a0c05",
              background: GOLD,
              padding: "22px 50px",
              borderRadius: 60,
            }}
          >
            Sígueme para más historia 🏛️
          </div>
        </Pop>
      </Center>
    </AbsoluteFill>
  );
};

const ProgressBar: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: 12,
        width: `${(f / TOTAL) * 100}%`,
        background: GOLD,
      }}
    />
  );
};

export const Reel: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      <Sequence from={S.hook.from} durationInFrames={S.hook.dur}>
        <Hook />
      </Sequence>
      <Sequence from={S.iliad.from} durationInFrames={S.iliad.dur}>
        <Iliad />
      </Sequence>
      <Sequence from={S.timeline.from} durationInFrames={S.timeline.dur}>
        <TimelineScene />
      </Sequence>
      <Sequence from={S.theories.from} durationInFrames={S.theories.dur}>
        <Theories />
      </Sequence>
      <Sequence from={S.outro.from} durationInFrames={S.outro.dur}>
        <Outro />
      </Sequence>
      <ProgressBar />
    </AbsoluteFill>
  );
};
