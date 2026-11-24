import React from "react";
import { AbsoluteFill } from "remotion";
import { Expr, POSES, RimFilter, Stick } from "./Stick";
import { CAST, YOU } from "./cast";
import { headFont } from "../kit";

const EXPRS: Expr[] = ["neutral", "happy", "sad", "surprised", "angry", "worried", "confused", "bored"];

/* Character reference sheet: full cast + protagonist expression and pose range. */
export const Sheet: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(#2a2433, #141018)" }}>
    <svg width={1920} height={1080}>
      <defs>
        <RimFilter />
      </defs>
      <text x={60} y={80} fontFamily={headFont} fontSize={64} fill="#f0d29a">CAST — CHARACTER REFERENCE SHEET</text>
      {CAST.map((c, i) => (
        <g key={c.name}>
          <Stick c={c} x={170 + i * 260} y={600} s={0.82} f={0} expr="neutral" seed={i} />
          <text x={170 + i * 260} y={660} textAnchor="middle" fontFamily={headFont} fontSize={34} fill="#f6efdf">{c.name}</text>
        </g>
      ))}
      <text x={1400} y={150} fontFamily={headFont} fontSize={40} fill="#f0d29a">POSES</text>
      {(["point", "clap", "cross", "shrug"] as const).map((p, i) => (
        <Stick key={p} c={YOU} x={1460 + (i % 2) * 260} y={i < 2 ? 560 : 1040} s={0.55} f={0} pose={POSES[p]} expr="neutral" />
      ))}
      <text x={60} y={740} fontFamily={headFont} fontSize={40} fill="#f0d29a">EXPRESSIONS</text>
      {EXPRS.map((e, i) => (
        <g key={e}>
          <Stick c={YOU} x={120 + i * 150} y={1040} s={0.42} f={0} expr={e} sweat={e === "worried"} shadow={false} />
          <text x={120 + i * 150} y={1068} textAnchor="middle" fontFamily={headFont} fontSize={24} fill="#f6efdf">{e.toUpperCase()}</text>
        </g>
      ))}
    </svg>
  </AbsoluteFill>
);
