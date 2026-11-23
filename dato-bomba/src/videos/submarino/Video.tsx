import React from "react";
import { AbsoluteFill, Composition, Easing, interpolate, spring, useCurrentFrame } from "remotion";
import guion from "./guion.json";
import dur from "./duraciones.json";
import { clamp, createTimeline, fmt, FPS, Sfx } from "../../lib/engine";
import { BarH, Big, Card, center, Label, Pop, Slide, Stamp, useGlitch } from "../../lib/ui";
import { sonar as T } from "../../lib/themes";
import { Calendar } from "../../lib/Icons";
import { Bubbles, Can, Hourglass, Lock, Submarine, Sun, Wrench } from "../../lib/Icons2";
import { OjoHeader, Outro } from "../../lib/common";
import { Reel } from "../../lib/Reel";

const tl = createTimeline(guion, dur);
const { key: GREEN, accent: PINK, highlight: YELLOW, alt: BLUE, num: numFont } = T;
const at = tl.at;

/** franja de "agua" para las escenas submarinas */
const Water: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 160, height: 980, background: "linear-gradient(180deg, rgba(77,195,255,0.25), rgba(10,40,90,0.15) 60%, transparent)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, height: 30, backgroundImage: "radial-gradient(circle at 30px -10px, transparent 26px, rgba(159,220,255,0.6) 28px, transparent 30px)", backgroundSize: "60px 30px", backgroundPosition: `${f * 3}px 0` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 160, height: 980, overflow: "hidden" }}>
        <Bubbles frame={f} h={980} />
      </div>
    </>
  );
};

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const tD = at("hook", "DÍAS");
  const tSol = at("hook", "sol");
  const cross = interpolate(f, [tSol, tSol + 10], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Water />
      <div style={{ position: "absolute", top: 560, left: interpolate(f, [0, 140], [-700, 220]), transform: `rotate(${Math.sin(f / 12) * 2}deg)` }}>
        <Submarine size={720} color={GREEN} />
      </div>
      <Pop at={at("hook", "140")} style={{ left: 80, top: 260 }}>
        <Label size={52} style={{ background: "#000a", padding: "6px 22px", borderRadius: 12, border: `3px solid ${BLUE}` }}>~140 tripulantes</Label>
      </Pop>
      <Pop at={tD - 2} from={3} style={center(860)}>
        <Stamp size={140}>217 DÍAS</Stamp>
      </Pop>
      <Pop at={tSol - 4} style={{ left: 790, top: 220 }}>
        <Sun size={200} crossed={cross} />
      </Pop>
    </AbsoluteFill>
  );
};

const Dato: React.FC = () => {
  const f = useCurrentFrame();
  const t12 = at("dato", "12");
  const t15 = at("dato", "15");
  const days = interpolate(f, [t12 + 4, t15 + 10], [0, 217], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill>
      <Slide at={0} dx={-900} style={center(230)}>
        <Submarine size={520} color={GREEN} />
      </Slide>
      <Pop at={at("dato", "Vengeance") - 2} style={center(450)}>
        <Label size={64} color={BLUE}>HMS Vengeance</Label>
      </Pop>
      <Pop at={t12} style={{ left: 110, top: 580, fontFamily: numFont }} rot={-20}>
        <Calendar day="12" month="ABRIL" size={240} color="#0b6e57" />
      </Pop>
      <Pop at={t15} style={{ left: 730, top: 580, fontFamily: numFont }} rot={20}>
        <Calendar day="15" month="NOV" size={240} color="#0b6e57" />
      </Pop>
      <div style={{ ...center(700) }}>
        <Big size={120} color={YELLOW}>{Math.round(days)}</Big>
      </div>
      <div style={{ ...center(830) }}>
        <Label size={40} style={{ opacity: days > 1 ? 1 : 0 }}>días</Label>
      </div>
    </AbsoluteFill>
  );
};

const Record: React.FC = () => {
  const f = useCurrentFrame();
  const tR = at("record", "RÉCORD");
  const g1 = interpolate(f, [at("record", "205") - 6, at("record", "205") + 16], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const g2 = interpolate(f, [tR - 6, tR + 14], [0, 1], { ...clamp, easing: Easing.bezier(0.5, 0, 0.2, 1.3) });
  return (
    <AbsoluteFill>
      <Slide at={0} dy={-200} style={center(220)}>
        <Label size={58} color={YELLOW}>Patrulla más larga</Label>
      </Slide>
      <BarH top={360} w={(205 / 217) * 900} grow={g1} color={BLUE} name="HMS Vanguard" sub="Abril 2026" value="205 días" />
      <BarH top={720} w={900} grow={g2} color={GREEN} name="HMS Vengeance" sub="Noviembre 2026" value="217 días" />
      <Pop at={tR + 14} from={3} style={{ right: 80, top: 600 }} rot={20}>
        <Stamp size={90} rotate={8}>RÉCORD</Stamp>
      </Pop>
    </AbsoluteFill>
  );
};

const Diseno: React.FC = () => {
  const f = useCurrentFrame();
  const tD = at("diseno", "DOBLE");
  const g1 = spring({ frame: f - at("diseno", "3"), fps: FPS, config: { damping: 14 } });
  const g2 = interpolate(f, [tD - 16, tD + 4], [0, 1], { ...clamp, easing: Easing.bezier(0.5, 0, 0.2, 1.3) });
  return (
    <AbsoluteFill>
      <Slide at={0} dy={-200} style={center(220)}>
        <Label size={58} color={YELLOW}>Diseño vs realidad</Label>
      </Slide>
      <BarH top={360} w={(110 / 217) * 900} grow={g1} color={BLUE} name="Diseñado para" sub="Misiones típicas" value="3–4 meses" />
      <BarH top={720} w={900} grow={g2} color={PINK} name="Esta misión" sub="12 abr → 15 nov" value="7 meses" />
      <Pop at={tD + 4} from={4} style={{ left: 330, top: 940 }} rot={-30}>
        <Stamp size={110} rotate={-6}>×2</Stamp>
      </Pop>
    </AbsoluteFill>
  );
};

const Comida: React.FC = () => {
  const f = useCurrentFrame();
  const tS = at("comida", "SECRETA");
  const tC = at("comida", "guardado");
  return (
    <AbsoluteFill>
      <Pop at={4} style={center(230)}>
        <Label size={56} color={YELLOW}>Sin reabastecimiento</Label>
      </Pop>
      <Pop at={tS - 2} from={3} style={{ left: 120, top: 360 }}>
        <Lock size={200} />
      </Pop>
      <Slide at={tS} dx={700} style={{ left: 360, top: 400 }}>
        <Label size={60} color={PINK}>Ubicación</Label>
        <Label size={90} color={PINK} style={{ fontFamily: numFont, fontWeight: 400 }}>SECRETA</Label>
      </Slide>
      <div style={{ position: "absolute", left: 150, top: 640, width: 780, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
        {Array.from({ length: 24 }).map((_, i) => {
          const s = spring({ frame: f - (tC + i * 1.5), fps: FPS, config: { damping: 9, mass: 0.4 } });
          return (
            <div key={i} style={{ transform: `translateY(${(1 - s) * -300}px)`, opacity: f >= tC + i * 1.5 ? 1 : 0 }}>
              <Can w={82} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Horas: React.FC = () => {
  const f = useCurrentFrame();
  const t = at("horas", "5,200");
  const hrs = interpolate(f, [4, t + 12], [0, 5208], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill>
      <Pop at={0} style={center(230)}>
        <Hourglass size={240} t={interpolate(f, [0, 90], [0, 1], clamp)} />
      </Pop>
      <div style={{ ...center(620) }}>
        <Big size={190}>{fmt(hrs)}</Big>
      </div>
      <Pop at={t + 12} style={center(820)}>
        <Stamp size={90} color={PINK} rotate={-5}>HORAS BAJO EL MAR</Stamp>
      </Pop>
    </AbsoluteFill>
  );
};

const Ojo: React.FC = () => {
  const tR = at("ojo", "relevarlo");
  const tF = at("ojo", "FALLA");
  const g = useGlitch([0, tF - 2]);
  return (
    <AbsoluteFill style={g.style}>
      <OjoHeader />
      <Slide at={at("ojo", "noticia") - 6} dx={-1100} style={center(510)}>
        <Card title="Flota al límite" sub="Mantenimientos atrasados" value="!" note="La Marina no confirma la duración: es una estimación de prensa" color={YELLOW} />
      </Slide>
      <Slide at={tR - 4} dx={1100} style={center(800)}>
        <Card title="El relevo falló" sub="HMS Vanguard" value="" note="Tuvo que volver a puerto por un defecto" color={PINK} />
      </Slide>
      <Pop at={tF - 2} from={3} style={{ left: 780, top: 760 }} rot={-90}>
        <Wrench size={170} />
      </Pop>
      {g.bar}
    </AbsoluteFill>
  );
};

const OutroScene: React.FC = () => (
  <Outro
    title="¿Y TÚ?"
    a={{ text: "Sí, aguanto", icon: <Submarine size={130} />, at: at("outro", "aguantarías") }}
    b={{ text: "Ni loco", icon: <Sun size={90} crossed={1} />, at: at("outro", "abajo") }}
    cta={at("outro", "comentarios")}
  />
);

const sfx: Sfx[] = [
  { id: "hook", f: 0, s: "riser", v: 0.3 },
  { id: "hook", f: at("hook", "DÍAS") - 2, s: "boom", v: 0.9 },
  { id: "hook", f: at("hook", "sol"), s: "glitch", v: 0.35 },
  { id: "dato", f: at("dato", "12"), s: "pop", v: 0.6 },
  { id: "dato", f: at("dato", "15"), s: "pop", v: 0.6 },
  { id: "record", f: at("record", "RÉCORD") + 14, s: "boom", v: 0.8 },
  { id: "diseno", f: at("diseno", "DOBLE") - 16, s: "riser", v: 0.3 },
  { id: "diseno", f: at("diseno", "DOBLE") + 4, s: "boom", v: 0.8 },
  { id: "comida", f: at("comida", "SECRETA") - 2, s: "glitch", v: 0.4 },
  { id: "comida", f: at("comida", "guardado"), s: "pop", v: 0.5 },
  { id: "horas", f: at("horas", "5,200") + 12, s: "boom", v: 0.8 },
  { id: "ojo", f: 0, s: "glitch", v: 0.6 },
  { id: "ojo", f: at("ojo", "relevarlo") - 4, s: "pop", v: 0.6 },
  { id: "ojo", f: at("ojo", "FALLA") - 2, s: "glitch", v: 0.5 },
  { id: "outro", f: at("outro", "aguantarías"), s: "pop", v: 0.6 },
  { id: "outro", f: at("outro", "abajo"), s: "pop", v: 0.6 },
];
for (let f = 4; f < tl.frames("horas"); f += 10) sfx.push({ id: "horas", f, s: "tick", v: 0.3 });

const hits = {
  hook: [at("hook", "DÍAS") - 2],
  record: [at("record", "RÉCORD") + 14],
  diseno: [at("diseno", "DOBLE") + 4],
  horas: [at("horas", "5,200") + 12],
  ojo: [0, at("ojo", "FALLA") - 2],
};

const Video: React.FC = () => (
  <Reel
    tl={tl}
    theme={T}
    folder="submarino"
    scenes={{ hook: Hook, dato: Dato, record: Record, diseno: Diseno, comida: Comida, horas: Horas, ojo: Ojo, outro: OutroScene }}
    sfx={sfx}
    hits={hits}
  />
);

export const SubmarinoComposition = () => (
  <Composition id="Submarino" component={Video} durationInFrames={tl.total} fps={FPS} width={1080} height={1920} />
);
