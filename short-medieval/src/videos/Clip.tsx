import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import clips from "./clips.json";

/** Real gameplay clip slot: renders public/clips/<name>.mp4 only if listed in clips.json (provided by the user). */
export const Clip: React.FC<{ name: string; from: number; to: number; startAt?: number }> = ({ name, from, to, startAt = 0 }) => {
  const f = useCurrentFrame();
  if (!(clips as string[]).includes(name) || f < from || f >= to) return null;
  const z = interpolate(f, [from, to], [1.08, 1.0]);
  return (
    <AbsoluteFill style={{ zIndex: 9500, background: "black" }}>
      <AbsoluteFill style={{ transform: `scale(${z})` }}>
        <OffthreadVideo src={staticFile(`clips/${name}.mp4`)} startFrom={startAt} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 60% at 50% 45%, rgba(0,0,0,0) 50%, rgba(5,8,15,0.6) 100%)" }} />
    </AbsoluteFill>
  );
};
