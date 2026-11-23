import React from "react";
import { AbsoluteFill, Composition, Easing, interpolate, spring, useCurrentFrame } from "remotion";
import guion from "./guion.json";
import dur from "./duraciones.json";
import { clamp, createTimeline, FPS, Sfx } from "../../lib/engine";
import { Big, Card, center, Label, Pop, Slide, Stamp, useGlitch } from "../../lib/ui";
import { gallery as T } from "../../lib/themes";
import { Bill, Calendar, Crown } from "../../lib/Icons";
import { Gavel, Hourglass, Lock, Painting } from "../../lib/Icons2";
import { BarV, OjoHeader, Outro } from "../../lib/common";
import { Reel } from "../../lib/Reel";

const tl = createTimeline(guion, dur);
const { key: GREEN, accent: PINK, highlight: YELLOW, alt: BLUE, num: numFont } = T;
const at = tl.at;

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const tM = at("hook", "MILLONES");
  const bang = spring({ frame: f - (tM - 8), fps: FPS, config: { damping: 8 } });
  return (
    <AbsoluteFill>
      {/* foco de luz */}
      <div style={{ position: "absolute", left: 140, top: 160, width: 800, height: 900, background: "radial-gradient(ellipse at 50% 30%, rgba(255,240,200,0.35), transparent 65%)" }} />
      <Pop at={0} from={0.6} style={center(190)}>
        <Painting size={760} sway={Math.sin(f / 10) * 2} />
      </Pop>
      <Pop at={10} style={center(830)}>
        <div style={{ background: "#f6e7c1", color: "#2a1a08", fontFamily: T.body, fontWeight: 700, fontSize: 30, padding: "8px 26px", borderRadius: 4, boxShadow: "0 6px 0 rgba(0,0,0,0.4)" }}>
          <i>Châtaigniers en fleurs</i> · Van Gogh, 1890
        </div>
      </Pop>
      <Pop at={tM - 8} from={3} style={center(950)}>
        <Big size={150}>$190.4M</Big>
      </Pop>
      <Pop at={tM - 8} style={{ left: 820, top: 920 }} rot={-60}>
        <Gavel size={220} angle={interpolate(bang, [0, 1], [-50, 0])} />
      </Pop>
      <Pop at={tM + 4} from={3} style={{ left: 90, top: 250 }} rot={-30}>
        <Stamp size={100} rotate={-12}>VENDIDO</Stamp>
      </Pop>
    </AbsoluteFill>
  );
};

const Pintor: React.FC = () => {
  const f = useCurrentFrame();
  const tY = at("pintor", "1890");
  const tM = at("pintor", "MESES");
  const line = interpolate(f, [tM - 4, tM + 20], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill>
      <Slide at={0} dy={-200} style={center(220)}>
        <Label size={62} color={YELLOW}>Vincent van Gogh</Label>
      </Slide>
      <Pop at={tY} style={{ left: 110, top: 380 }} rot={-20}>
        <div style={{ fontFamily: numFont }}>
          <Calendar day="24" month="MAYO 1890" size={300} color={PINK} />
        </div>
      </Pop>
      <Pop at={tM} style={{ left: 670, top: 380 }} rot={20}>
        <div style={{ filter: "grayscale(1)", fontFamily: numFont }}>
          <Calendar day="29" month="JULIO 1890" size={300} />
        </div>
      </Pop>
      <div style={{ position: "absolute", left: 260, top: 830, width: 560 * line, height: 12, background: PINK, borderRadius: 6, boxShadow: `0 0 20px ${PINK}` }} />
      <Pop at={tY + 6} style={{ left: 90, top: 870 }}>
        <Label size={40}>Pinta el cuadro</Label>
      </Pop>
      <Pop at={tM + 14} style={{ left: 690, top: 870 }}>
        <Label size={40} color={PINK}>Muere</Label>
      </Pop>
      <Pop at={tM + 8} style={center(940)}>
        <Stamp size={90} color={PINK} rotate={-4}>2 MESES</Stamp>
      </Pop>
    </AbsoluteFill>
  );
};

const Pobre: React.FC = () => {
  const f = useCurrentFrame();
  const tNo = at("pobre", "VENDÍA");
  const tTheo = at("pobre", "dinero");
  const move = interpolate(f, [tTheo - 10, tTheo + 25], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill>
      <Pop at={4} style={center(230)}>
        <Label size={56} color={YELLOW}>Ventas en vida</Label>
      </Pop>
      <Pop at={tNo} from={3} style={center(320)}>
        <Big size={180} color={PINK}>CASI $0</Big>
      </Pop>
      <Slide at={tTheo - 14} dx={-600} style={{ left: 80, top: 640 }}>
        <Card title="Theo" sub="su hermano" value="" color={GREEN} width={360} />
      </Slide>
      <Slide at={tTheo - 14} dx={600} style={{ left: 640, top: 640 }}>
        <Card title="Vincent" sub="el pintor" value="" color={BLUE} width={360} />
      </Slide>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: 300 + move * 330 + i * 20, top: 820 - Math.sin(move * Math.PI) * 120 + i * 18, opacity: move > 0 && move < 1 ? 1 : move >= 1 ? 0.9 : 0, transform: `rotate(${move * 30 - i * 8}deg)` }}>
          <Bill w={150} />
        </div>
      ))}
    </AbsoluteFill>
  );
};

const Record: React.FC = () => {
  const f = useCurrentFrame();
  const tP = at("record", "60%");
  const g1 = spring({ frame: f - 4, fps: FPS, config: { damping: 14 } });
  const g2 = interpolate(f, [tP - 20, tP], [0, 1], { ...clamp, easing: Easing.bezier(0.5, 0, 0.2, 1.4) });
  return (
    <AbsoluteFill>
      <Slide at={0} dy={-200} style={center(220)}>
        <Label size={58} color={YELLOW}>Récord de Van Gogh</Label>
      </Slide>
      <BarV x={150} h={360} grow={g1} color={BLUE} value="$117.2M" name="Antes" sub="2022" />
      <BarV x={630} h={585} grow={g2} color={GREEN} value="$190.4M" name="Ahora" sub="2026" />
      <Pop at={tP} from={4} style={{ left: 110, top: 420 }} rot={30}>
        <Stamp size={150} rotate={-10}>+62%</Stamp>
      </Pop>
    </AbsoluteFill>
  );
};

const Oculto: React.FC = () => {
  const f = useCurrentFrame();
  const t50 = at("oculto", "50");
  const years = interpolate(f, [t50 - 10, t50 + 20], [0, 50], clamp);
  const flip = interpolate(f, [0, 30], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Pop at={0} style={{ left: 120, top: 290 }}>
        <Hourglass size={250} t={flip} />
      </Pop>
      <div style={{ position: "absolute", left: 440, top: 330 }}>
        <Big size={220} color={YELLOW}>{Math.round(years)}</Big>
        <Label size={64} style={{ marginTop: 10 }}>años oculto</Label>
      </div>
      <Pop at={at("oculto", "público")} style={{ left: 800, top: 690 }} rot={20}>
        <Lock size={130} />
      </Pop>
      <Pop at={at("oculto", "argentina")} style={center(880)}>
        <Label size={42} style={{ background: "#000a", padding: "8px 24px", borderRadius: 12, border: `3px solid ${BLUE}` }}>
          Colección privada · Argentina
        </Label>
      </Pop>
    </AbsoluteFill>
  );
};

const Ojo: React.FC = () => {
  const tR = at("ojo", "herederos");
  const tA = at("ojo", "acuerdo");
  const g = useGlitch([0, at("ojo", "ANTES") - 4]);
  return (
    <AbsoluteFill style={g.style}>
      <OjoHeader />
      <Slide at={tR - 4} dx={-1100} style={center(510)}>
        <Card title="Reclamo" sub="Herederos de S. Fischer" value="!" note="Editor judío, dueño del cuadro en la época nazi" color={PINK} />
      </Slide>
      <Slide at={tA} dx={1100} style={center(800)}>
        <Card title="Acuerdo" sub="Fischer + vendedores" value="1 DÍA" note="Se firmó un día antes de la subasta" color={GREEN} />
      </Slide>
      {g.bar}
    </AbsoluteFill>
  );
};

const OutroScene: React.FC = () => (
  <Outro
    title="¿Y TÚ?"
    a={{ text: "Sí, lo vale", icon: <Crown size={100} />, at: at("outro", "pagarías") }}
    b={{ text: "Ni loco", icon: <Big size={80} color={PINK}>$</Big>, at: at("outro", "cuadro") }}
    cta={at("outro", "comentarios")}
  />
);

const sfx: Sfx[] = [
  { id: "hook", f: 0, s: "whoosh", v: 0.5 },
  { id: "hook", f: at("hook", "MILLONES") - 8, s: "boom", v: 0.9 },
  { id: "hook", f: at("hook", "MILLONES") - 8, s: "cash", v: 0.6 },
  { id: "pintor", f: at("pintor", "1890"), s: "pop", v: 0.6 },
  { id: "pintor", f: at("pintor", "MESES"), s: "boom", v: 0.7 },
  { id: "pobre", f: at("pobre", "VENDÍA"), s: "glitch", v: 0.4 },
  { id: "pobre", f: at("pobre", "Theo") - 10, s: "cash", v: 0.5 },
  { id: "record", f: at("record", "60%") - 20, s: "riser", v: 0.3 },
  { id: "record", f: at("record", "60%"), s: "boom", v: 0.8 },
  { id: "oculto", f: at("oculto", "50") - 10, s: "riser", v: 0.3 },
  { id: "oculto", f: at("oculto", "público"), s: "pop", v: 0.6 },
  { id: "ojo", f: 0, s: "glitch", v: 0.6 },
  { id: "ojo", f: at("ojo", "acuerdo"), s: "pop", v: 0.6 },
  { id: "ojo", f: at("ojo", "ANTES") - 4, s: "boom", v: 0.7 },
  { id: "outro", f: at("outro", "pagarías"), s: "pop", v: 0.6 },
  { id: "outro", f: at("outro", "cuadro"), s: "pop", v: 0.6 },
];
const hits = {
  hook: [at("hook", "MILLONES") - 8],
  pintor: [at("pintor", "MESES")],
  record: [at("record", "60%")],
  ojo: [0, at("ojo", "ANTES") - 4],
};

const Video: React.FC = () => (
  <Reel
    tl={tl}
    theme={T}
    folder="vangogh"
    scenes={{ hook: Hook, pintor: Pintor, pobre: Pobre, record: Record, oculto: Oculto, ojo: Ojo, outro: OutroScene }}
    sfx={sfx}
    hits={hits}
  />
);

export const VanGoghComposition = () => (
  <Composition id="VanGogh" component={Video} durationInFrames={tl.total} fps={FPS} width={1080} height={1920} />
);
