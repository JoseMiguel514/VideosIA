import React from "react";
import { AbsoluteFill, Audio, Composition, interpolate, Sequence, staticFile } from "remotion";
import { LEAD } from "../lib/engine";
import { ActCard } from "../lib/envs";
import { Fade, FPS } from "../lib/scene";
import guion from "./guion.json";
import { at, tl } from "./timeline";
import * as A from "./scenesA";
import * as B from "./scenesB";
import * as C from "./scenesC";

const SCENES: Record<string, React.FC> = {
  hook: A.Hook, mom: A.Mom, brother: A.Brother, rules: A.Rules, dog: A.DogScene, science: A.Science, limits: A.Limits, count: A.Count,
  bus: A.Bus, songs: A.Songs, market: A.Market, hallway: A.HallwayScene, spotlight: A.Spotlight, exam: A.Exam, cheat: A.Cheat, headache: A.Headache, night: A.Night, stadium: A.Stadium,
  cocktail: B.Cocktail, training: B.Training, breathing: B.Breathing, dial: B.Dial, texting: B.Texting,
  friend: B.Friend, parents: B.Parents, lies: B.Lies, gentle: B.Gentle, teacher: B.Teacher, grandpa: B.Grandpa, crush: B.Crush, date: B.DateScene,
  games: C.Games, magic: C.Magic, penalty: C.Penalty, lostkid: C.LostKid, detective: C.Detective, evidence: C.Evidence, rumor: C.Rumor, fear: C.Fear,
  rules3: C.Rules3, quiet: C.Quiet, battles: C.Battles, friendfix: C.FriendFix, helper: C.Helper, family: C.Family, secret: C.Secret,
  waves: C.Waves, career: C.Career, lesson: C.Lesson, ending: C.Ending, outro: C.Outro,
};
const CARDS = guion.filter((g) => "card" in g).map((g) => g.id);

type S = { id: string; f: number; s: string; v?: number };
const SFX: S[] = [
  { id: "hook", f: at("hook", "voice...") - 4, s: "riser", v: 0.25 },
  { id: "hook", f: at("hook", "minds."), s: "boom", v: 0.55 },
  { id: "mom", f: at("mom", "freezes,"), s: "pop", v: 0.4 },
  { id: "brother", f: at("brother", "drops"), s: "pop", v: 0.45 },
  { id: "rules", f: at("rules", "off."), s: "glitch", v: 0.25 },
  { id: "dog", f: at("dog", "food."), s: "pop", v: 0.4 },
  { id: "count", f: at("count", "six") + 40, s: "boom", v: 0.4 },
  { id: "bus", f: at("bus", "stops."), s: "glitch", v: 0.25 },
  { id: "spotlight", f: at("spotlight", "spotlight"), s: "boom", v: 0.4 },
  { id: "cheat", f: 8, s: "cash", v: 0.35 },
  { id: "headache", f: 10, s: "glitch", v: 0.2 },
  { id: "stadium", f: at("stadium", "scores,"), s: "boom", v: 0.7 },
  { id: "cocktail", f: at("cocktail", "single"), s: "whoosh", v: 0.4 },
  { id: "dial", f: at("dial", "dial"), s: "riser", v: 0.2 },
  { id: "friend", f: at("friend", "dumb."), s: "glitch", v: 0.2 },
  { id: "crush", f: at("crush", "hi."), s: "pop", v: 0.45 },
  { id: "penalty", f: at("penalty", "dive.") + 8, s: "boom", v: 0.55 },
  { id: "lostkid", f: at("lostkid", "hugging"), s: "pop", v: 0.4 },
  { id: "detective", f: at("detective", "truth"), s: "glitch", v: 0.25 },
  { id: "evidence", f: at("evidence", "proof."), s: "boom", v: 0.4 },
  { id: "fear", f: at("fear", "knocking.") - 20, s: "riser", v: 0.25 },
  { id: "secret", f: at("secret", "proud"), s: "pop", v: 0.4 },
  { id: "lesson", f: at("lesson", "Listening"), s: "boom", v: 0.4 },
  { id: "ending", f: at("ending", "attention."), s: "boom", v: 0.4 },
  { id: "outro", f: at("outro", "subscribe,"), s: "pop", v: 0.5 },
  ...CARDS.map((id) => ({ id, f: 0, s: "whoosh", v: 0.35 })),
];

const Video: React.FC = () => {
  const musicVol = (f: number) =>
    interpolate(f, [0, 30, tl.total - 200, tl.total - 20, tl.total], [0, 0.14, 0.14, 0.28, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#05030c" }}>
      {tl.order.map((id, i) => {
        const dur = tl.frames(id);
        const isCard = CARDS.includes(id);
        const Scene = SCENES[id];
        return (
          <Sequence key={id} from={tl.starts[id]} durationInFrames={dur} name={id}>
            {isCard ? <ActCard n={0} kicker="" title={guion.find((g) => g.id === id)!.pantalla} dur={dur} /> : <Scene />}
            {!isCard && <Fade dur={dur} inF={i === 0 ? 20 : 10} outF={i === tl.order.length - 1 ? 30 : 10} />}
            {!isCard && (
              <Sequence from={LEAD} layout="none">
                <Audio src={staticFile(`minds/voz/${id}.wav`)} />
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
      <Audio src={staticFile("minds/musica.wav")} volume={musicVol} />
    </AbsoluteFill>
  );
};

export const MindsComposition = () => (
  <Composition id="WhatIfReadMinds" component={Video} durationInFrames={tl.total} fps={FPS} width={1920} height={1080} />
);
