import React from "react";
import { AbsoluteFill, Audio, Composition, interpolate, Sequence, staticFile } from "remotion";
import { LEAD } from "../lib/engine";
import { ActCard } from "../lib/envs";
import { Fade, FPS } from "../lib/scene";
import guion from "./guion.json";
import { at, tl } from "./timeline";
import { Hook, Impossible, Learning, Morning, Scale } from "./scenes1";
import { Hunger, Lonely, MathScene, School, Slow } from "./scenes2";
import { Agents, Ending, Future, Twist } from "./scenes3";
import { Chess, Height, Memory, Mirror, Music, Sleep, Sports, Symbol, Textbooks, WhyNow } from "./scenes4";
import { Choice, Dating, Family, Friends, Haters, News, Offers, Tests } from "./scenes5";
import { Climate, Cliff, Decode, Energy, Medicine, Mentor, Message, Mistake, Night, Outro2, Pressure, Space, Teach, Together, Years } from "./scenes6";

const SCENES: Record<string, React.FC> = {
  hook: Hook, mirror: Mirror, memory: Memory, symbol: Symbol, scale: Scale, impossible: Impossible, height: Height, whynow: WhyNow,
  morning: Morning, learning: Learning, textbooks: Textbooks, music: Music, sports: Sports, chess: Chess, hunger: Hunger, sleep: Sleep,
  slow: Slow, family: Family, school: School, tests: Tests, friends: Friends, dating: Dating, lonely: Lonely,
  math: MathScene, news: News, haters: Haters, offers: Offers, agents: Agents, choice: Choice,
  future: Future, medicine: Medicine, energy: Energy, space: Space, climate: Climate, pressure: Pressure, mistake: Mistake, mentor: Mentor,
  twist: Twist, teach: Teach, together: Together, years: Years, ending: Ending,
  night: Night, decode: Decode, message: Message, cliff: Cliff, outro: Outro2,
};
const CARDS = guion.filter((g) => "card" in g).map((g) => g.id);

type S = { id: string; f: number; s: string; v?: number };
const SFX: S[] = [
  ...Array.from({ length: 8 }, (_, i) => ({ id: "hook", f: 4 + i * 6, s: "tick", v: 0.5 })),
  { id: "hook", f: at("hook", "different") - 2, s: "pop", v: 0.4 },
  { id: "hook", f: at("hook", "five") - 30, s: "riser", v: 0.25 },
  { id: "hook", f: at("hook", "five"), s: "boom", v: 0.6 },
  { id: "mirror", f: at("mirror", "Exactly."), s: "pop", v: 0.4 },
  { id: "memory", f: at("memory", "fifth"), s: "whoosh", v: 0.4 },
  { id: "symbol", f: at("symbol", "wall"), s: "riser", v: 0.25 },
  { id: "symbol", f: at("symbol", "idea"), s: "glitch", v: 0.2 },
  { id: "scale", f: at("scale", "average"), s: "pop", v: 0.4 },
  { id: "scale", f: at("scale", "gifted"), s: "pop", v: 0.4 },
  { id: "scale", f: at("scale", "Einstein?"), s: "pop", v: 0.4 },
  { id: "impossible", f: 10, s: "riser", v: 0.2 },
  { id: "impossible", f: at("impossible", "human"), s: "boom", v: 0.35 },
  { id: "height", f: at("height", "half") - 10, s: "riser", v: 0.25 },
  { id: "height", f: at("height", "elephant."), s: "boom", v: 0.4 },
  { id: "whynow", f: at("whynow", "normal."), s: "pop", v: 0.4 },
  { id: "morning", f: at("morning", "solved"), s: "pop", v: 0.4 },
  { id: "learning", f: at("learning", "five"), s: "boom", v: 0.4 },
  { id: "textbooks", f: at("textbooks", "email"), s: "whoosh", v: 0.4 },
  { id: "sports", f: at("sports", "Swish."), s: "pop", v: 0.5 },
  { id: "hunger", f: at("hunger", "Yours"), s: "riser", v: 0.3 },
  { id: "hunger", f: at("hunger", "always,"), s: "boom", v: 0.45 },
  { id: "sleep", f: at("sleep", "answers."), s: "pop", v: 0.4 },
  { id: "slow", f: at("slow", "slow"), s: "whoosh", v: 0.4 },
  { id: "family", f: at("family", "redesigning"), s: "riser", v: 0.25 },
  { id: "school", f: at("school", "next"), s: "riser", v: 0.25 },
  { id: "tests", f: at("tests", "right."), s: "boom", v: 0.4 },
  { id: "dating", f: at("dating", "awkward."), s: "glitch", v: 0.2 },
  { id: "math", f: at("math", "six..."), s: "cash", v: 0.45 },
  { id: "math", f: at("math", "weekend."), s: "boom", v: 0.4 },
  { id: "news", f: 6, s: "boom", v: 0.4 },
  { id: "haters", f: at("haters", "fraud."), s: "glitch", v: 0.25 },
  { id: "offers", f: at("offers", "check."), s: "cash", v: 0.4 },
  { id: "agents", f: 5, s: "riser", v: 0.3 },
  { id: "agents", f: 40, s: "boom", v: 0.45 },
  { id: "choice", f: at("choice", "everyone."), s: "boom", v: 0.4 },
  { id: "future", f: at("future", "Cities"), s: "riser", v: 0.25 },
  { id: "energy", f: at("energy", "design"), s: "riser", v: 0.3 },
  { id: "space", f: at("space", "Rockets") + 10, s: "boom", v: 0.45 },
  { id: "pressure", f: at("pressure", "hurt."), s: "glitch", v: 0.25 },
  { id: "mistake", f: at("mistake", "number"), s: "glitch", v: 0.3 },
  { id: "years", f: at("years", "hope."), s: "pop", v: 0.4 },
  { id: "decode", f: at("decode", "message."), s: "riser", v: 0.35 },
  { id: "message", f: at("message", "You"), s: "glitch", v: 0.5 },
  { id: "message", f: at("message", "only"), s: "glitch", v: 0.5 },
  { id: "cliff", f: at("cliff", "watching"), s: "boom", v: 0.6 },
  { id: "outro", f: at("outro", "part"), s: "boom", v: 0.45 },
  { id: "outro", f: at("outro", "subscribe,"), s: "pop", v: 0.5 },
  ...CARDS.map((id) => ({ id, f: 0, s: "whoosh", v: 0.35 })),
];

const Video: React.FC = () => {
  const iMsg = tl.starts["message"];
  const musicVol = (f: number) =>
    interpolate(f, [0, 30, iMsg - 30, iMsg, tl.starts["cliff"] + 20, tl.total - 200, tl.total - 20, tl.total], [0, 0.15, 0.15, 0.02, 0.12, 0.15, 0.28, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  let actN = 1;
  return (
    <AbsoluteFill style={{ background: "#05030c" }}>
      {tl.order.map((id, i) => {
        const dur = tl.frames(id);
        const isCard = CARDS.includes(id);
        const n = isCard ? ++actN : 0;
        const Scene = SCENES[id];
        return (
          <Sequence key={id} from={tl.starts[id]} durationInFrames={dur} name={id}>
            {isCard ? <ActCard n={n} title={guion.find((g) => g.id === id)!.pantalla} dur={dur} /> : <Scene />}
            {!isCard && <Fade dur={dur} inF={i === 0 ? 20 : 10} outF={i === tl.order.length - 1 ? 30 : 10} />}
            {!isCard && (
              <Sequence from={LEAD} layout="none">
                <Audio src={staticFile(`iq500/voz/${id}.wav`)} />
              </Sequence>
            )}
            {i > 0 && !isCard && <Audio src={staticFile("sfx/whoosh.wav")} volume={0.15} />}
          </Sequence>
        );
      })}
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.max(0, tl.starts[s.id] + s.f)} layout="none" name={`sfx-${s.s}`}>
          <Audio src={staticFile(`sfx/${s.s}.wav`)} volume={s.v ?? 0.4} />
        </Sequence>
      ))}
      <Audio src={staticFile("iq500/musica.wav")} volume={musicVol} loop />
    </AbsoluteFill>
  );
};

export const IQ500Composition = () => (
  <Composition id="WhatIf500IQ" component={Video} durationInFrames={tl.total} fps={FPS} width={1920} height={1080} />
);
