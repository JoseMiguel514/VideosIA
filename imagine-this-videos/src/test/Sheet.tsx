import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { Character } from "../lib/Character";

const Sheet: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(#3a2a6a,#1a1030)" }}>
    <Character x={200} y={1000} scale={0.75} expr="neutral" pose="down" />
    <Character x={500} y={1000} scale={0.75} expr="deadpan" mouth="flat" pose="chin" />
    <Character x={800} y={1000} scale={0.75} expr="wide" mouth="o" pose="shrug" glow={0.6} />
    <Character x={1100} y={1000} scale={0.75} expr="happy" mouth="grin" pose="wave" />
    <Character x={1400} y={1000} scale={0.75} expr="sad" mouth="frown" pose="hold" galaxy={false} head="#2b2d3a" hoodie="#e2453a" />
    <Character x={1700} y={1000} scale={0.75} expr="focus" mouth="flat" pose="explain" galaxy={false} head="#3b3f55" hoodie="#f2c14e" hair="messy" />
  </AbsoluteFill>
);
export const SheetComp = () => <Composition id="Sheet" component={Sheet} durationInFrames={60} fps={30} width={1920} height={1080} />;
