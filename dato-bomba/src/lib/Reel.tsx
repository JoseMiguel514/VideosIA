import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile } from "remotion";
import { clamp, LEAD, Sfx, Timeline } from "./engine";
import { Background, BG, Captions, Cam, Flash, Overlay } from "./ui";

/** Plantilla común de todos los Shorts de Dato Bomba */
export const Reel: React.FC<{
  tl: Timeline;
  folder: string; // carpeta en public/ con voz/ y musica.wav
  scenes: Record<string, React.FC>;
  sfx: Sfx[];
  hits: Record<string, number[]>;
  symbol?: string;
  symbolColor?: string;
  hue?: [number, number];
}> = ({ tl, folder, scenes, sfx, hits, symbol, symbolColor, hue }) => {
  const musicVol = (f: number) => interpolate(f, [0, 10, tl.total - 50, tl.total - 10, tl.total], [0, 0.22, 0.22, 0.4, 0], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Background total={tl.total} symbol={symbol} symbolColor={symbolColor} hue={hue} />
      {tl.order.map((id, i) => {
        const Scene = scenes[id];
        return (
          <Sequence key={id} from={tl.starts[id]} durationInFrames={tl.frames(id)} name={id}>
            <Cam dur={tl.frames(id)} hits={hits[id] ?? []}>
              <Scene />
            </Cam>
            <Captions words={tl.words(id)} />
            <Flash />
            <Sequence from={LEAD} layout="none">
              <Audio src={staticFile(`${folder}/voz/${id}.wav`)} />
            </Sequence>
            {i > 0 && <Audio src={staticFile("sfx/whoosh.wav")} volume={0.45} />}
          </Sequence>
        );
      })}
      {sfx.map((s, i) => (
        <Sequence key={i} from={Math.max(0, tl.starts[s.id] + s.f)} layout="none" name={`sfx-${s.s}`}>
          <Audio src={staticFile(`sfx/${s.s}.wav`)} volume={s.v ?? 0.6} />
        </Sequence>
      ))}
      <Audio src={staticFile(`${folder}/musica.wav`)} volume={musicVol} />
      <Overlay total={tl.total} />
    </AbsoluteFill>
  );
};
