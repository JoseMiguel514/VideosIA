import React from "react";
import { AbsoluteFill, Audio, Composition, interpolate, Sequence, staticFile } from "remotion";
import { LEAD } from "../lib/engine";
import { Fade, FPS } from "../lib/scene";
import { at, tl } from "./timeline";
import { Hook, Impossible, Learning, Morning, Scale } from "./scenes1";
import { Hunger, Lonely, MathScene, School, Slow } from "./scenes2";
import { Agents, Ending, Future, Outro, Twist } from "./scenes3";

const SCENES: Record<string, React.FC> = {
  hook: Hook, scale: Scale, impossible: Impossible, morning: Morning, learning: Learning,
  hunger: Hunger, slow: Slow, school: School, lonely: Lonely, math: MathScene,
  agents: Agents, future: Future, twist: Twist, ending: Ending, outro: Outro,
};

type S = { id: string; f: number; s: string; v?: number };
const SFX: S[] = [
  ...Array.from({ length: 8 }, (_, i) => ({ id: "hook", f: 4 + i * 6, s: "tick", v: 0.5 })),
  { id: "hook", f: at("hook", "different") - 2, s: "pop", v: 0.4 },
  { id: "hook", f: at("hook", "five") - 30, s: "riser", v: 0.25 },
  { id: "hook", f: at("hook", "five"), s: "boom", v: 0.6 },
  { id: "scale", f: at("scale", "average"), s: "pop", v: 0.4 },
  { id: "scale", f: at("scale", "gifted"), s: "pop", v: 0.4 },
  { id: "scale", f: at("scale", "Einstein?"), s: "pop", v: 0.4 },
  { id: "impossible", f: 10, s: "riser", v: 0.2 },
  { id: "impossible", f: at("impossible", "human"), s: "boom", v: 0.35 },
  { id: "morning", f: at("morning", "solved"), s: "pop", v: 0.4 },
  { id: "learning", f: at("learning", "five"), s: "boom", v: 0.4 },
  { id: "hunger", f: at("hunger", "Yours"), s: "riser", v: 0.3 },
  { id: "hunger", f: at("hunger", "always,"), s: "boom", v: 0.45 },
  { id: "slow", f: at("slow", "slow"), s: "whoosh", v: 0.4 },
  { id: "school", f: at("school", "next"), s: "riser", v: 0.25 },
  { id: "math", f: at("math", "six..."), s: "cash", v: 0.45 },
  { id: "math", f: at("math", "weekend."), s: "boom", v: 0.4 },
  { id: "agents", f: 5, s: "riser", v: 0.3 },
  { id: "agents", f: 40, s: "boom", v: 0.45 },
  { id: "future", f: at("future", "Cities"), s: "riser", v: 0.25 },
  { id: "outro", f: at("outro", "comments.") + 20, s: "pop", v: 0.5 },
];

const Video: React.FC = () => {
  const musicVol = (f: number) =>
    interpolate(f, [0, 30, tl.total - 120, tl.total - 20, tl.total], [0, 0.16, 0.16, 0.3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#05030c" }}>
      {tl.order.map((id, i) => {
        const Scene = SCENES[id];
        const dur = tl.frames(id);
        return (
          <Sequence key={id} from={tl.starts[id]} durationInFrames={dur} name={id}>
            <Scene />
            <Fade dur={dur} inF={i === 0 ? 20 : 10} outF={i === tl.order.length - 1 ? 30 : 10} />
            <Sequence from={LEAD} layout="none">
              <Audio src={staticFile(`iq500/voz/${id}.wav`)} />
            </Sequence>
            {i > 0 && <Audio src={staticFile("sfx/whoosh.wav")} volume={0.18} />}
          </Sequence>
        );
      })}
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.max(0, tl.starts[s.id] + s.f)} layout="none" name={`sfx-${s.s}`}>
          <Audio src={staticFile(`sfx/${s.s}.wav`)} volume={s.v ?? 0.4} />
        </Sequence>
      ))}
      <Audio src={staticFile("iq500/musica.wav")} volume={musicVol} />
    </AbsoluteFill>
  );
};

export const IQ500Composition = () => (
  <Composition id="WhatIf500IQ" component={Video} durationInFrames={tl.total} fps={FPS} width={1920} height={1080} />
);
