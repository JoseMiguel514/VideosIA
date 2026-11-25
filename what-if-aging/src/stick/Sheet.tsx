import React from "react";
import { AbsoluteFill } from "remotion";
import { Expr, POSES, Stick } from "./Stick";
import { CAST, DR, YOU } from "./cast";
import { headFont } from "../kit";
import { PCup, PLaser, PMirror, PPhone, PTablet } from "./props";

const EXPRS: Expr[] = ["neutral", "happy", "sad", "surprised", "angry", "worried", "confused", "bored"];
const label = (x: number, y: number, t: string, size = 30) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={headFont} fontSize={size} fill="#f6efdf">
    {t}
  </text>
);

/* Character reference sheet: cast, hand close-ups holding props, expressions. */
export const Sheet: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(#2a2433, #141018)" }}>
    <svg width={1920} height={1080}>
      <text x={50} y={70} fontFamily={headFont} fontSize={56} fill="#f0d29a">
        CAST — SLIMMER, MORE DETAILED BUILD
      </text>
      {CAST.map((c, i) => (
        <g key={c.name}>
          <Stick c={c} x={130 + i * 215} y={640} s={0.85} f={60} expr="neutral" seed={i} />
          {label(130 + i * 215, 690, c.name.split(" (")[0].toUpperCase())}
        </g>
      ))}

      {/* hand close-ups: full character scaled up, cropped by a rounded frame */}
      <text x={1180} y={70} fontFamily={headFont} fontSize={40} fill="#f0d29a">
        HANDS & GRIP (CLOSE-UP)
      </text>
      {[
        { t: "HOLDING A CUP", el: <Stick c={YOU} x={0} y={0} s={1} f={60} expr="happy" reachR={{ x: 70, y: -420, w: 1 }} itemR={<PCup />} />, fx: 70, fy: -420 },
        { t: "HOLDING A PHONE", el: <Stick c={YOU} x={0} y={0} s={1} f={60} expr="happy" reachR={{ x: 80, y: -440, w: 1 }} itemR={<PPhone />} />, fx: 80, fy: -440 },
        { t: "POINTING", el: <Stick c={YOU} x={0} y={0} s={1} f={60} expr="neutral" pose={POSES.point} handR="point" />, fx: 215, fy: -386 },
        { t: "OPEN HAND / WAVE", el: <Stick c={YOU} x={0} y={0} s={1} f={60} expr="happy" pose={POSES.wave} handR="open" />, fx: 140, fy: -530 },
        { t: "LASER POINTER", el: <Stick c={DR} x={0} y={0} s={1} f={60} expr="neutral" reachR={{ x: 120, y: -430, w: 1 }} itemR={<PLaser bx={160} by={-120} />} />, fx: 150, fy: -455 },
        { t: "HAND MIRROR", el: <Stick c={YOU} x={0} y={0} s={1} f={60} expr="happy" reachL={{ x: -95, y: -470, w: 1 }} itemL={<PMirror rot={-15} />} />, fx: -95, fy: -480 },
      ].map((h, i) => {
        const cx = 1240 + (i % 3) * 225;
        const cy = 210 + Math.floor(i / 3) * 280;
        const z = 2.4;
        return (
          <g key={h.t}>
            <clipPath id={`hc${i}`}>
              <rect x={cx - 100} y={cy - 100} width={200} height={200} rx={24} />
            </clipPath>
            <rect x={cx - 100} y={cy - 100} width={200} height={200} rx={24} fill="#3a3346" />
            <g clipPath={`url(#hc${i})`}>
              <g transform={`translate(${cx - h.fx * z} ${cy - h.fy * z}) scale(${z})`}>{h.el}</g>
            </g>
            <rect x={cx - 100} y={cy - 100} width={200} height={200} rx={24} fill="none" stroke="#f0d29a" strokeWidth={3} />
            {label(cx, cy + 135, h.t, 26)}
          </g>
        );
      })}

      <text x={50} y={770} fontFamily={headFont} fontSize={40} fill="#f0d29a">
        EXPRESSIONS
      </text>
      {EXPRS.map((e, i) => (
        <g key={e}>
          <Stick c={YOU} x={110 + i * 140} y={1040} s={0.42} f={60} expr={e} sweat={e === "worried"} shadow={false} />
          {label(110 + i * 140, 1070, e.toUpperCase(), 22)}
        </g>
      ))}
      <Stick c={DR} x={1330} y={1040} s={0.42} f={60} expr="neutral" reachL={{ x: -30, y: -340, w: 1 }} itemL={<PTablet />} reachR={{ x: 90, y: -600, w: 1 }} handR="point" shadow={false} />
      {label(1330, 1070, "TABLET + POINT", 22)}
      <Stick c={YOU} x={1520} y={1040} s={0.42} f={60} expr="happy" pose={POSES.clap} shadow={false} />
      {label(1520, 1070, "CLAP", 22)}
      <Stick c={YOU} x={1710} y={1040} s={0.42} f={60} expr="worried" reachR={{ x: 8, y: -438, w: 1 }} handsFront handR="fist" sweat shadow={false} />
      {label(1710, 1070, "BITING NAILS", 22)}
    </svg>
  </AbsoluteFill>
);
