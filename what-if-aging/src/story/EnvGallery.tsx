import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { AtcRoom, Boneyard, BusStop, Cafe, Classroom, ColdSea, Diner64, DoctorOffice, Galley, Highway, MorningPark, Museum, Nursery, Observatory, SimHangar, Supermarket, TeenRoom, Terminal } from "./envs2";

const ENVS: ((f: number) => React.ReactNode)[] = [
  (f) => <Terminal f={f} />,
  (f) => <Galley f={f} alarm />,
  (f) => <AtcRoom f={f} emergency />,
  (f) => <SimHangar f={f} tilt={8} />,
  (f) => <Classroom f={f} />,
  (f) => <Boneyard f={f} />,
  (f) => <Museum f={f} />,
  (f) => <Observatory f={f} />,
  (f) => <Cafe f={f} />,
  (f) => <Highway f={f} drift={1} />,
  (f) => <DoctorOffice f={f} />,
  (f) => <Supermarket f={f} warp={0.5} />,
  (f) => <Diner64 f={f} />,
  (f) => <ColdSea f={f} />,
  (f) => <BusStop f={f} rain />,
  (f) => <Nursery f={f} cry />,
  (f) => <TeenRoom f={f} />,
  (f) => <MorningPark f={f} />,
];
export const ENV_COUNT = ENVS.length;

/** One environment per 100 frames, for visual checks. */
export const EnvGallery: React.FC = () => {
  const f = useCurrentFrame();
  const i = Math.min(ENVS.length - 1, Math.floor(f / 100));
  return <AbsoluteFill style={{ background: "#000" }}>{ENVS[i](f % 100 + 40)}</AbsoluteFill>;
};
