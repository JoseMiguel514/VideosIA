import { hudFont } from "../stick/Hud";
import React from "react";
import { AbsoluteFill } from "remotion";
import { Stick } from "../stick/Stick";
import { YOU, DR, MIA, CAPT } from "../stick/cast";
import { Act, actParams } from "./engine";
import { PCup } from "../stick/props";

const ACTS: Act[] = ["idle", "point", "pointUp", "wave", "think", "scratch", "cross", "hips", "shrug", "clap", "cheer", "facepalm", "headHands", "phone", "hold", "reach"];
const CAST = [YOU, MIA, DR, CAPT];

/** Visual check of every arm action (used to verify the arm solver). */
export const PoseSheet: React.FC = () => (
  <AbsoluteFill style={{ background: "#1c2433" }}>
    <svg width={1920} height={1080}>
      {ACTS.map((a, i) => {
        const p = actParams(a, 20);
        const x = 120 + (i % 8) * 240;
        const y = 500 + Math.floor(i / 8) * 520;
        return (
          <g key={a}>
            <Stick
              c={CAST[i % 4]}
              x={x}
              y={y}
              s={0.62}
              f={20}
              pose={p.pose}
              reachR={p.rR ?? (a === "hold" ? undefined : undefined)}
              reachL={p.rL}
              handR={p.hR}
              handL={p.hL}
              handsFront={p.front}
              itemR={a === "hold" ? <PCup /> : undefined}
              still
            />
            <text x={x} y={y + 40} fill="#f6efdf" fontSize={26} fontFamily={hudFont} fontWeight={800} textAnchor="middle">
              {a}
            </text>
          </g>
        );
      })}
    </svg>
  </AbsoluteFill>
);
