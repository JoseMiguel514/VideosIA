import React from "react";
import { Composition } from "remotion";
import { makeTiming, FPS, Guion, Durs } from "./timing";
import { StoryVideo } from "./engine";
import { PLANE } from "./plane";
import { SLEEP } from "./sleep";
import planeG from "../../videos/plane/guion.json";
import planeD from "../../videos/plane/duraciones.json";
import sleepG from "../../videos/sleep/guion.json";
import sleepD from "../../videos/sleep/duraciones.json";

export const planeTm = makeTiming(planeG as Guion, planeD as Durs);
export const sleepTm = makeTiming(sleepG as Guion, sleepD as Durs);

const PlaneVideo: React.FC = () => <StoryVideo tm={planeTm} specs={PLANE} voiceDir="plane/voz" endTitle="WHAT IF YOUR ENGINES STOPPED?" />;
const SleepVideo: React.FC = () => <StoryVideo tm={sleepTm} specs={SLEEP} voiceDir="sleep/voz" endTitle="WHAT IF YOU NEVER SLEPT AGAIN?" />;

export const StoryCompositions: React.FC = () => (
  <>
    <Composition id="PlaneVideo" component={PlaneVideo} durationInFrames={planeTm.TOTAL} fps={FPS} width={1920} height={1080} />
    <Composition id="SleepVideo" component={SleepVideo} durationInFrames={sleepTm.TOTAL} fps={FPS} width={1920} height={1080} />
  </>
);
