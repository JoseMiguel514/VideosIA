import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { Character } from "../lib/Character";
import { Glyph } from "../lib/envs";
import { FONT, INK, Stars } from "../lib/scene";

/* Miniatura de YouTube (1920x1080, se exporta a 1280x720) */
const Thumb: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 30% 55%, #2c2470, #120e36 55%, #05040f)" }}>
    <Stars n={140} />
    {/* símbolo misterioso detrás */}
    <div style={{ position: "absolute", inset: 0, opacity: 0.55 }}>
      <Glyph x={560} y={470} r={360} glow={0.9} />
    </div>
    {/* silueta con ojos rojos en la esquina */}
    <div style={{ position: "absolute", inset: 0, filter: "brightness(.18)" }}>
      <Character x={1770} y={1150} scale={0.95} galaxy={false} head="#000" hoodie="#000" pants="#000" expr="focus" mouth="flat" flip seed={900} />
    </div>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <ellipse cx={1770 - 32} cy={1150 - 508 * 0.95} rx={16} ry={7} fill="#ff2a4a" style={{ filter: "drop-shadow(0 0 12px #ff2a4a)" }} />
      <ellipse cx={1770 + 32} cy={1150 - 508 * 0.95} rx={16} ry={7} fill="#ff2a4a" style={{ filter: "drop-shadow(0 0 12px #ff2a4a)" }} />
    </svg>
    {/* rayos de energía saliendo de la cabeza */}
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return <line key={i} x1={560 + Math.cos(a) * 280} y1={420 + Math.sin(a) * 280} x2={560 + Math.cos(a) * 420} y2={420 + Math.sin(a) * 420} stroke="#ffd36b" strokeWidth={10} strokeLinecap="round" opacity={0.75} />;
      })}
    </svg>
    {/* protagonista en primer plano */}
    <Character x={560} y={1500} scale={2.15} expr="wide" mouth="o" look={[0.5, -0.4]} glow={1} pose="shrug" seed={901} />
    {/* texto */}
    <div style={{ position: "absolute", left: 1060, top: 150, fontFamily: FONT, fontWeight: 700, fontSize: 250, lineHeight: 0.95, color: "#fff", WebkitTextStroke: `24px ${INK}`, paintOrder: "stroke fill", textShadow: `0 16px 0 ${INK}, 0 0 60px rgba(0,0,0,.6)`, transform: "rotate(-4deg)" }}>
      IQ:
      <br />
      <span style={{ color: "#ffd36b", fontSize: 330 }}>500</span>
    </div>
    <div style={{ position: "absolute", left: 1080, top: 760, fontFamily: FONT, fontWeight: 700, fontSize: 64, color: "#fff", background: "#e2453a", padding: "8px 34px", borderRadius: 18, border: `8px solid ${INK}`, boxShadow: `0 10px 0 ${INK}`, transform: "rotate(-4deg)" }}>
      NOT THE ONLY ONE...
    </div>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0,0,0,.55) 100%)" }} />
  </AbsoluteFill>
);

export const ThumbnailComposition = () => <Composition id="Thumbnail500IQ" component={Thumb} durationInFrames={1} fps={30} width={1920} height={1080} />;
