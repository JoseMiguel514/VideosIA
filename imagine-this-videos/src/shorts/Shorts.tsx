import React from "react";
import { Composition } from "remotion";
import { FPS } from "../lib/scene";
import { Clip, makeShortTimeline, ShortReel } from "./ShortReel";
import g500 from "../short500/guion.json";
import d500 from "../short500/duraciones.json";
import gMinds from "../shortminds/guion.json";
import dMinds from "../shortminds/duraciones.json";
import { at as atIQ } from "../iq500/timeline";
import { at as atM } from "../minds/timeline";
import { Hook as IQHook, Impossible, Learning, Scale } from "../iq500/scenes1";
import { MathScene } from "../iq500/scenes2";
import { Music } from "../iq500/scenes4";
import { Cliff, Message, Night as IQNight } from "../iq500/scenes6";
import { Bus, DogScene, Hook as MHook, Mom, Stadium } from "../minds/scenesA";
import { Crush, Friend } from "../minds/scenesB";
import { Battles, Outro as MOutro } from "../minds/scenesC";

const tl500 = makeShortTimeline(g500, d500);
const clips500: Clip[] = [
  { id: "s1", Scene: IQHook, offset: atIQ("hook", "five") - 45, cx: 900 },
  { id: "s2", Scene: Scale, offset: atIQ("scale", "average") - 15, cx: 1000 },
  { id: "s3", Scene: Impossible, offset: 90, cx: 1100, zoom: 0.75 },
  { id: "s4", Scene: Learning, offset: 20, cx: 960, zoom: 0.62 },
  { id: "s5", Scene: Music, offset: atIQ("music", "Twenty") - 15, cx: 990, zoom: 0.75 },
  { id: "s6", Scene: MathScene, offset: atIQ("math", "six...") - 20, cx: 700 },
  { id: "s7", Scene: IQNight, offset: 0, cx: 760, zoom: 0.7 },
  { id: "s8", Scene: Message, offset: atIQ("message", "You") - 5, cx: 960, zoom: 0.75 },
  { id: "s9", Scene: Cliff, offset: atIQ("cliff", "watching") - 10, cx: 1350, zoom: 0.8 },
];
const Short500: React.FC = () => (
  <ShortReel
    tl={tl500}
    folder="short500"
    clips={clips500}
    music="iq500/musica.wav"
    title={
      <>
        WHAT IF YOUR <span style={{ color: "#ffd36b" }}>IQ</span> WAS <span style={{ color: "#ffd36b" }}>500</span>?
      </>
    }
  />
);

const tlM = makeShortTimeline(gMinds, dMinds);
const clipsM: Clip[] = [
  { id: "m1", Scene: MHook, offset: atM("hook", "voice...") - 10, cx: 1060, zoom: 0.75 },
  { id: "m2", Scene: Mom, offset: atM("mom", "looks") - 20, cx: 820, zoom: 0.72 },
  { id: "m3", Scene: DogScene, offset: atM("dog", "food.") - 10, cx: 1050, zoom: 0.72 },
  { id: "m4", Scene: Bus, offset: atM("bus", "lock") - 10, cx: 960, zoom: 0.62 },
  { id: "m5", Scene: Stadium, offset: atM("stadium", "scores,") - 20, cx: 960, zoom: 0.7 },
  { id: "m6", Scene: Friend, offset: atM("friend", "dumb.") - 15, cx: 700, zoom: 0.72 },
  { id: "m7", Scene: Crush, offset: atM("crush", "catch") - 10, cx: 1050 },
  { id: "m8", Scene: Battles, offset: atM("battles", "popular"), cx: 800, zoom: 0.62 },
  { id: "m9", Scene: MOutro, offset: atM("outro", "keep") - 10, cx: 1300 },
];
const ShortMinds: React.FC = () => (
  <ShortReel
    tl={tlM}
    folder="shortminds"
    clips={clipsM}
    music="minds/musica.wav"
    title={
      <>
        WHAT IF YOU COULD <span style={{ color: "#7ff0ff" }}>READ MINDS</span>?
      </>
    }
  />
);

export const ShortsCompositions = () => (
  <>
    <Composition id="Short500IQ" component={Short500} durationInFrames={tl500.total} fps={FPS} width={1080} height={1920} />
    <Composition id="ShortReadMinds" component={ShortMinds} durationInFrames={tlM.total} fps={FPS} width={1080} height={1920} />
  </>
);
