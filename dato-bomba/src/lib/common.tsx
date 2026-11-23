import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "./engine";
import { Big, center, Label, OptionBtn, Pop, Slide } from "./ui";
import { useTheme } from "./theme";
import { Warning } from "./Icons";

/** Cabecera "⚠ ¡OJO!" del giro final */
export const OjoHeader: React.FC = () => {
  const f = useCurrentFrame();
  const { highlight: YELLOW } = useTheme();
  return (
    <>
      <Pop at={0} from={2} style={{ left: 110, top: 220 }}>
        <div style={{ transform: `rotate(${Math.sin(f / 3) * 4}deg)` }}>
          <Warning size={230} />
        </div>
      </Pop>
      <Slide at={4} dx={700} style={{ left: 380, top: 260 }}>
        <Big size={170} color={YELLOW}>¡OJO!</Big>
      </Slide>
    </>
  );
};

/** Cierre con encuesta de dos opciones + "Comenta y sígueme" */
export const Outro: React.FC<{
  title: string;
  a: { text: string; icon: React.ReactNode; at: number };
  b: { text: string; icon: React.ReactNode; at: number };
  cta: number;
}> = ({ title, a, b, cta }) => {
  const f = useCurrentFrame();
  const { highlight: YELLOW, key: GREEN, accent: PINK, bg: BG, text } = useTheme();
  const p1 = interpolate(f, [a.at + 5, a.at + 40], [0, 58], { ...clamp, easing: Easing.out(Easing.cubic) });
  const p2 = interpolate(f, [b.at + 5, b.at + 40], [0, 42], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill>
      <Pop at={0} style={center(220)}>
        <Big size={120} color={YELLOW}>{title}</Big>
      </Pop>
      <Pop at={a.at} style={center(420)}>
        <OptionBtn text={a.text} color={GREEN} pct={p1} icon={a.icon} />
      </Pop>
      <Pop at={b.at} style={center(620)}>
        <OptionBtn text={b.text} color={PINK} pct={p2} icon={b.icon} />
      </Pop>
      <Pop at={cta} style={center(860)}>
        <div style={{ transform: `translateY(${Math.sin(f / 5) * 12}px)`, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Label size={56} style={{ background: text, color: BG, padding: "10px 34px", borderRadius: 40 }}>Comenta y sígueme</Label>
          <svg width={90} height={70} viewBox="0 0 90 70" style={{ marginTop: 10 }}>
            <path d="M10 10 L45 55 L80 10" fill="none" stroke={text} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};

/** Barra vertical con valor arriba y nombre abajo */
export const BarV: React.FC<{ x: number; h: number; grow: number; color: string; value: string; name: string; sub: string; base?: number }> = ({
  x,
  h,
  grow,
  color,
  value,
  name,
  sub,
  base = 1030,
}) => {
  const hh = h * grow;
  const { radius } = useTheme();
  return (
    <>
      <div style={{ position: "absolute", left: x, width: 300, top: base - hh, height: hh, background: `linear-gradient(180deg, ${color}, ${color}66)`, borderRadius: `${radius + 8}px ${radius + 8}px 0 0`, boxShadow: `0 0 40px ${color}88` }} />
      <div style={{ position: "absolute", left: x - 40, width: 380, top: base - hh - 115, display: "flex", justifyContent: "center", opacity: grow > 0.05 ? 1 : 0 }}>
        <Big size={100} color={color}>{value}</Big>
      </div>
      <div style={{ position: "absolute", left: x - 40, width: 380, top: base + 14, textAlign: "center" }}>
        <Label size={46}>{name}</Label>
        <Label size={34} style={{ opacity: 0.7 }}>{sub}</Label>
      </div>
    </>
  );
};
