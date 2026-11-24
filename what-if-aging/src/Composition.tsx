import React from "react";
import { AbsoluteFill, Audio, Composition, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { at, FPS, H, LEAD, ORDER, SceneId, sceneFrames, STARTS, TOTAL, voiceDur, W, wordTimes } from "./timing";
import { bodyFont, C } from "./kit";
import { Hook1, Hook2, Same, Setup1, Setup2, Telomeres, Years } from "./Scenes1";
import { JellyScene, Lab, Lifespan, MathScene, Outro1, Outro2, Risk, Root, Twist, Year200 } from "./Scenes2";

const voiceEnd = (id: SceneId) => LEAD + Math.ceil(voiceDur(id) * FPS);

const SCENES: Record<SceneId, React.FC> = {
  hook1: Hook1,
  hook2: Hook2,
  setup1: Setup1,
  setup2: Setup2,
  years: Years,
  same: Same,
  telomeres: Telomeres,
  jelly: JellyScene,
  math: MathScene,
  lifespan: Lifespan,
  year200: Year200,
  risk: Risk,
  twist: Twist,
  root: Root,
  lab: Lab,
  outro1: Outro1,
  outro2: () => <Outro2 voiceEnd={voiceEnd("outro2")} />,
};

/* Subtitles: chunks of up to 6 words, never crossing a sentence; active word highlighted. */
const Captions: React.FC<{ id: SceneId }> = ({ id }) => {
  const f = useCurrentFrame();
  const ts = wordTimes(id);
  const chunks: (typeof ts)[] = [];
  let cur: typeof ts = [];
  ts.forEach((t, i) => {
    cur.push(t);
    const next = ts[i + 1];
    if (cur.length >= 6 || !next || next.sentence !== t.sentence || (/[,:]$/.test(t.w) && cur.length >= 3)) {
      chunks.push(cur);
      cur = [];
    }
  });
  const chunk = chunks.find((c) => f < c[c.length - 1].end + 6);
  if (!chunk || f < chunk[0].start - 4) return null;
  return (
    <div style={{ position: "absolute", bottom: 70, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          background: "rgba(0,0,0,0.55)",
          padding: "10px 30px",
          borderRadius: 14,
          fontFamily: bodyFont,
          fontWeight: 800,
          fontSize: 54,
          color: C.white,
          display: "flex",
          gap: 20,
        }}
      >
        {chunk.map((t, i) => {
          const active = f >= t.start - 1 && f < t.end + 1;
          return (
            <span key={i} style={{ color: active ? C.ice : C.white, transform: `scale(${active ? 1.04 : 1})`, display: "inline-block" }}>
              {t.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const SceneShell: React.FC<{ id: SceneId }> = ({ id }) => {
  const f = useCurrentFrame();
  const dur = sceneFrames(id);
  const Scene = SCENES[id];
  const op = interpolate(f, [0, 10, dur - 8, dur], [0, 1, 1, id === "outro2" ? 1 : 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scene />
      <Captions id={id} />
    </AbsoluteFill>
  );
};

const Sfx: React.FC<{ from: number; src: string; volume?: number }> = ({ from, src, volume = 0.5 }) => (
  <Sequence from={Math.max(0, from)} durationInFrames={90} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
  </Sequence>
);

export const Video: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.bg0 }}>
      {ORDER.map((id) => (
        <Sequence key={id} from={STARTS[id]} durationInFrames={sceneFrames(id)}>
          <SceneShell id={id} />
          <Sequence from={LEAD} layout="none">
            <Audio src={staticFile(`voz/${id}.wav`)} volume={1} />
          </Sequence>
        </Sequence>
      ))}
      <Audio
        src={staticFile("musica.mp3")}
        volume={(f) => interpolate(f, [0, 30, TOTAL - 60, TOTAL], [0, 0.16, 0.16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {/* transitions & accents */}
      {ORDER.slice(1).map((id) =>
        id === "twist" ? null : <Sfx key={id} from={STARTS[id] - 8} src="whoosh" volume={0.25} />,
      )}
      <Sfx from={STARTS.hook1 + at("hook1", "blow") + 10} src="blow" volume={0.5} />
      <Sfx from={STARTS.hook1 + at("hook1", "stops")} src="freeze" volume={0.35} />
      <Sfx from={STARTS.setup2 + at("setup2", "pause")} src="freeze" volume={0.35} />
      <Sfx from={STARTS.hook2 + at("hook2", "die") - 2} src="boom" volume={0.45} />
      <Sfx from={STARTS.twist} src="boom" volume={0.55} />
      <Sfx from={STARTS.twist + at("twist", "age") - 4} src="boom" volume={0.4} />
      <Sfx from={STARTS.lab + at("lab", "yet") - 4} src="freeze" volume={0.3} />
      <Sfx from={STARTS.outro2 + at("outro2", "subscribe") + 12} src="pop" volume={0.5} />
    </AbsoluteFill>
  );
};

export const MyComposition: React.FC = () => (
  <Composition id="WhatIfAging" component={Video} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
);
