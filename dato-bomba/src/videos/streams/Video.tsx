import React from "react";
import { AbsoluteFill, Composition, Easing, interpolate, spring, useCurrentFrame } from "remotion";
import guion from "./guion.json";
import dur from "./duraciones.json";
import { clamp, createTimeline, fmt, FPS, Sfx } from "../../lib/engine";
import { BarH, Big, Card, center, Label, Pop, Slide, Stamp } from "../../lib/ui";
import { stream as T } from "../../lib/themes";
import { Controller, Crown } from "../../lib/Icons";
import { Eye, Hourglass, LiveScreen } from "../../lib/Icons2";
import { Outro } from "../../lib/common";
import { Reel } from "../../lib/Reel";

const tl = createTimeline(guion, dur);
const { key: GREEN, accent: PINK, highlight: YELLOW, alt: BLUE } = T;
const at = tl.at;

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const tS = at("hook", "STREAMS");
  const viewers = interpolate(f, [0, tS + 10], [0, 7_915_475], { ...clamp, easing: Easing.in(Easing.quad) });
  return (
    <AbsoluteFill>
      <Pop at={0} from={0.5} style={center(280)}>
        <LiveScreen size={720} frame={f} />
      </Pop>
      <div style={{ ...center(820), alignItems: "center", gap: 20 }}>
        <Eye size={110} />
        <Big size={110} color="white">{fmt(viewers)}</Big>
      </div>
      <Pop at={tS - 2} from={3} style={center(200)}>
        <Stamp size={76}>RÉCORD EN VIVO</Stamp>
      </Pop>
    </AbsoluteFill>
  );
};

const Pico: React.FC = () => {
  const f = useCurrentFrame();
  const t8 = at("pico", "8");
  const n = interpolate(f, [t8 - 14, t8 + 24], [0, 7_915_475], { ...clamp, easing: Easing.bezier(0.2, 0.7, 0.2, 1) });
  const g = (d: number) => spring({ frame: f - (at("pico", "vivo") + d), fps: FPS, config: { damping: 14 } });
  const max = 3.31;
  return (
    <AbsoluteFill>
      <Pop at={2} style={center(210)}>
        <Label size={50} color={YELLOW}>Espectadores al mismo tiempo</Label>
      </Pop>
      <div style={{ ...center(300) }}>
        <Big size={140}>{fmt(n)}</Big>
      </div>
      <Pop at={at("pico", "vivo") - 4} style={center(500)}>
        <Label size={40} style={{ opacity: 0.85 }}>Pico por plataforma</Label>
      </Pop>
      <BarH top={570} w={(3.31 / max) * 600} grow={g(0)} color="#a970ff" name="Twitch" sub="" value="3.31M" />
      <BarH top={730} w={(3.22 / max) * 600} grow={g(5)} color={PINK} name="YouTube" sub="" value="3.22M" />
      <BarH top={890} w={(1.5 / max) * 600} grow={g(10)} color={GREEN} name="Kick" sub="" value="1.5M" />
    </AbsoluteFill>
  );
};

const Horas: React.FC = () => {
  const f = useCurrentFrame();
  const t = at("horas", "214");
  const n = interpolate(f, [t - 14, t + 24], [0, 214.63], { ...clamp, easing: Easing.bezier(0.2, 0.7, 0.2, 1) });
  return (
    <AbsoluteFill>
      <Pop at={2} style={center(220)}>
        <Label size={56} color={YELLOW}>Horas vistas en 2 días</Label>
      </Pop>
      <div style={{ ...center(360) }}>
        <Big size={220}>{n.toFixed(1)}M</Big>
      </div>
      <Pop at={t + 24} style={center(680)}>
        <Stamp size={64} color={PINK} rotate={-5}>MILLONES DE HORAS</Stamp>
      </Pop>
      <Pop at={6} style={{ left: 90, top: 880 }} rot={-20}>
        <Controller size={200} glow={20} />
      </Pop>
    </AbsoluteFill>
  );
};

const Anos: React.FC = () => {
  const f = useCurrentFrame();
  const t = at("anos", "24,000");
  const y = interpolate(f, [2, t + 16], [0, 24_484], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill>
      <Pop at={0} style={center(220)}>
        <Hourglass size={230} t={interpolate(f, [0, 80], [0, 1], clamp)} />
      </Pop>
      <div style={{ ...center(580) }}>
        <Big size={170} color={YELLOW}>{fmt(y)}</Big>
      </div>
      <Pop at={t + 16} style={center(800)}>
        <Stamp size={100} rotate={-5}>AÑOS</Stamp>
      </Pop>
    </AbsoluteFill>
  );
};

const Juntos: React.FC = () => {
  const f = useCurrentFrame();
  const tJ = at("juntos", "JUNTOS");
  const games = ["Elden Ring", "Hogwarts Legacy", "Cyberpunk 2077"];
  const gG = interpolate(f, [tJ - 4, tJ + 16], [0, 1], { ...clamp, easing: Easing.bezier(0.5, 0, 0.2, 1.3) });
  return (
    <AbsoluteFill>
      <Slide at={0} dy={-200} style={center(220)}>
        <Label size={52} color={YELLOW}>1ª semana de cada uno</Label>
      </Slide>
      {games.map((g, i) => (
        <Slide key={g} at={at("juntos", g.split(" ")[0]) - 2} dx={i % 2 ? 900 : -900} style={{ left: 100, top: 330 + i * 120 }}>
          <Label size={52} style={{ background: "rgba(22,16,42,0.92)", border: `4px solid ${BLUE}`, padding: "8px 28px", borderRadius: 16 }}>
            {i > 0 ? "+ " : ""}
            {g}
          </Label>
        </Slide>
      ))}
      <Slide at={tJ - 6} dx={-900} style={{ left: 100, top: 720 }}>
        <Label size={44} color={GREEN}>GTA VI · solo 2 días</Label>
      </Slide>
      <div style={{ position: "absolute", left: 100, top: 790, width: 880 * gG, height: 100, background: `linear-gradient(90deg, ${GREEN}55, ${GREEN})`, borderRadius: 18, boxShadow: `0 0 40px ${GREEN}` }} />
      <Pop at={tJ + 16} from={3} style={{ right: 90, top: 640 }} rot={30}>
        <Crown size={150} />
      </Pop>
    </AbsoluteFill>
  );
};

const Illo: React.FC = () => {
  const f = useCurrentFrame();
  const tE = at("illo", "ESPAÑOL");
  const t = at("illo", "562,000");
  const n = interpolate(f, [t - 10, t + 20], [0, 562_000], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill>
      <Pop at={tE - 2} from={3} style={center(220)}>
        <Stamp size={84} color={PINK}>EN ESPAÑOL</Stamp>
      </Pop>
      <Slide at={at("illo", "IlloJuan") - 4} dx={900} style={center(450)}>
        <Card title="IlloJuan" sub="Streamer de España" value="#1" note="Mayor pico de un solo stream de GTA VI" color={GREEN} />
      </Slide>
      <div style={{ ...center(760), alignItems: "center", gap: 20, opacity: f >= t - 10 ? 1 : 0 }}>
        <Eye size={110} />
        <Big size={150} color="white">{fmt(n)}</Big>
      </div>
      <Pop at={t + 20} style={{ left: 770, top: 360 }} rot={-40}>
        <Crown size={150} />
      </Pop>
    </AbsoluteFill>
  );
};

const OutroScene: React.FC = () => (
  <Outro
    title="¿Y TÚ?"
    a={{ text: "Lo juego", icon: <Controller size={110} />, at: at("outro", "juegas") }}
    b={{ text: "Lo veo en stream", icon: <Eye size={90} />, at: at("outro", "verlo") }}
    cta={at("outro", "comentarios")}
  />
);

const sfx: Sfx[] = [
  { id: "hook", f: 0, s: "riser", v: 0.35 },
  { id: "hook", f: at("hook", "STREAMS") - 2, s: "boom", v: 0.9 },
  { id: "pico", f: at("pico", "8") - 14, s: "riser", v: 0.3 },
  { id: "pico", f: at("pico", "8") + 24, s: "boom", v: 0.7 },
  { id: "pico", f: at("pico", "vivo"), s: "pop", v: 0.5 },
  { id: "horas", f: at("horas", "214") + 24, s: "boom", v: 0.8 },
  { id: "anos", f: at("anos", "24,000") + 16, s: "boom", v: 0.8 },
  { id: "juntos", f: at("juntos", "Elden") - 2, s: "pop", v: 0.5 },
  { id: "juntos", f: at("juntos", "Hogwarts") - 2, s: "pop", v: 0.5 },
  { id: "juntos", f: at("juntos", "Cyberpunk") - 2, s: "pop", v: 0.5 },
  { id: "juntos", f: at("juntos", "JUNTOS") + 16, s: "boom", v: 0.8 },
  { id: "illo", f: at("illo", "ESPAÑOL") - 2, s: "boom", v: 0.7 },
  { id: "illo", f: at("illo", "562,000") + 20, s: "cash", v: 0.5 },
  { id: "outro", f: at("outro", "juegas"), s: "pop", v: 0.6 },
  { id: "outro", f: at("outro", "verlo"), s: "pop", v: 0.6 },
];
for (let f = 4; f < tl.frames("anos"); f += 10) sfx.push({ id: "anos", f, s: "tick", v: 0.3 });

const hits = {
  hook: [at("hook", "STREAMS") - 2],
  pico: [at("pico", "8") + 24],
  horas: [at("horas", "214") + 24],
  anos: [at("anos", "24,000") + 16],
  juntos: [at("juntos", "JUNTOS") + 16],
  illo: [at("illo", "ESPAÑOL") - 2],
};

const Video: React.FC = () => (
  <Reel
    tl={tl}
    theme={T}
    folder="streams"
    scenes={{ hook: Hook, pico: Pico, horas: Horas, anos: Anos, juntos: Juntos, illo: Illo, outro: OutroScene }}
    sfx={sfx}
    hits={hits}
  />
);

export const StreamsComposition = () => (
  <Composition id="GTA6Streams" component={Video} durationInFrames={tl.total} fps={FPS} width={1080} height={1920} />
);
