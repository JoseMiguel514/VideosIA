import React from "react";

/*
 * Stick character, built to match the reference frames:
 * oversized solid-black round head, very thin black limbs, flat simple clothing,
 * cream rim outline around the whole silhouette, minimal white eyes/brows/mouth.
 * Origin = point between the feet. Unscaled height ≈ 560px.
 */

export type Expr = "neutral" | "bored" | "happy" | "sad" | "surprised" | "worried" | "angry" | "confused" | "blow";
export type Arm = [number, number]; // [shoulder angle, elbow extra angle] in degrees; 0 = hanging down, + = outward
export type Pose = { l: Arm; r: Arm };

export const POSES = {
  idle: { l: [8, 6], r: [8, 6] },
  point: { l: [8, 6], r: [88, 0] },
  pointL: { l: [88, 0], r: [8, 6] },
  pointUp: { l: [8, 6], r: [128, 0] },
  pointUpL: { l: [128, 0], r: [8, 6] },
  wave: { l: [8, 6], r: [130, 40] },
  clap: { l: [20, -130], r: [20, -130] },
  cross: { l: [-10, -140], r: [-10, -140] },
  hips: { l: [40, -95], r: [40, -95] },
  think: { l: [-10, -140], r: [30, -170] },
  shrug: { l: [50, 80], r: [50, 80] },
  hold: { l: [15, -100], r: [15, -100] },
  holdR: { l: [8, 6], r: [15, -100] },
  hesitant: { l: [8, 6], r: [45, -60] },
} satisfies Record<string, Pose>;

export type Outfit = {
  kind: "hoodie" | "tee" | "coat";
  color: string;
  inner?: string; // shirt under coat
  pants: string;
};
export type Hair = "tuft" | "buns" | "bun" | "cap" | "long" | "none";

export type CharDef = {
  name: string;
  outfit: Outfit;
  hair: Hair;
  capColor?: string;
  glasses?: boolean;
};

export type StickProps = {
  c: CharDef;
  x: number;
  y: number;
  s?: number;
  f: number; // animation clock (pass a frozen value to stop all idle motion)
  expr?: Expr;
  pose?: Pose;
  look?: number; // -1..1 face direction
  lookY?: number; // -1..1
  tilt?: number; // head tilt in degrees
  lean?: number; // body lean in degrees
  age?: number; // 0..1 → gray hair + hunch
  sweat?: boolean;
  tremble?: number; // 0..1
  walk?: number; // walking phase (radians); undefined = standing
  sit?: boolean;
  seed?: number;
  shadow?: boolean;
  rim?: string;
};

const INK = "#0b0a0c";
const EYE = "#f6efdf";
const RIM = "#f0d29a";
const toRad = (d: number) => (d * Math.PI) / 180;

const limb = (sx: number, sy: number, side: number, a: Arm, L1 = 95, L2 = 90) => {
  const a1 = toRad(a[0]);
  const a2 = toRad(a[0] + a[1]);
  const ex = sx + side * L1 * Math.sin(a1);
  const ey = sy + L1 * Math.cos(a1);
  const hx = ex + side * L2 * Math.sin(a2);
  const hy = ey + L2 * Math.cos(a2);
  return { ex, ey, hx, hy };
};

export const RimFilter: React.FC<{ id?: string; color?: string; r?: number }> = ({ id = "rim", color = RIM, r = 5 }) => (
  <filter id={id} x="-25%" y="-25%" width="150%" height="150%">
    <feMorphology in="SourceAlpha" operator="dilate" radius={r} result="d" />
    <feFlood floodColor={color} />
    <feComposite in2="d" operator="in" result="o" />
    <feMerge>
      <feMergeNode in="o" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>
);

const Face: React.FC<{ expr: Expr; blink: number; lx: number; ly: number; glasses?: boolean; f: number }> = ({
  expr,
  blink,
  lx,
  ly,
  glasses,
  f,
}) => {
  const ex = 24;
  const ox = lx * 14;
  const oy = ly * 10;
  const st = { stroke: EYE, strokeWidth: 5, strokeLinecap: "round" as const, fill: "none" };
  const eye = (side: number) => {
    const cx = ox + side * ex;
    const cy = oy - 2;
    let el: React.ReactNode;
    switch (expr) {
      case "happy":
        el = <path d={`M ${cx - 10} ${cy + 4} Q ${cx} ${cy - 10} ${cx + 10} ${cy + 4}`} {...st} />;
        break;
      case "bored":
      case "angry":
        el = <path d={`M ${cx - 12} ${cy - 3} L ${cx + 12} ${cy - 3} Q ${cx + 11} ${cy + 9} ${cx} ${cy + 9} Q ${cx - 11} ${cy + 9} ${cx - 12} ${cy - 3} Z`} fill={EYE} />;
        break;
      case "surprised":
        el = (
          <g>
            <circle cx={cx} cy={cy} r={13} fill={EYE} />
            <circle cx={cx + lx * 3} cy={cy + ly * 3} r={4.5} fill={INK} />
          </g>
        );
        break;
      case "blow":
        el = <path d={`M ${cx - 10} ${cy} L ${cx + 10} ${cy}`} {...st} />;
        break;
      case "confused":
        el = <circle cx={cx} cy={cy} r={side > 0 ? 11 : 8} fill={EYE} />;
        break;
      default:
        el = <circle cx={cx} cy={cy + (expr === "sad" ? 3 : 0)} r={expr === "worried" ? 12 : 10} fill={EYE} />;
    }
    return (
      <g key={side} transform={`translate(${cx} ${cy}) scale(1 ${expr === "happy" || expr === "blow" ? 1 : blink}) translate(${-cx} ${-cy})`}>
        {el}
      </g>
    );
  };
  const brow = (side: number) => {
    const cx = ox + side * ex;
    const cy = oy - 24;
    switch (expr) {
      case "worried":
      case "sad":
        return <path key={side} d={`M ${cx - side * 12} ${cy + 2} Q ${cx} ${cy - 10} ${cx + side * 12} ${cy + 6}`} {...st} />;
      case "surprised":
        return <path key={side} d={`M ${cx - 11} ${cy - 4} Q ${cx} ${cy - 14} ${cx + 11} ${cy - 4}`} {...st} />;
      case "angry":
        return <path key={side} d={`M ${cx - side * 13} ${cy - 2} L ${cx + side * 11} ${cy + 8}`} {...st} />;
      case "confused":
        return side > 0 ? (
          <path key={side} d={`M ${cx - 11} ${cy - 4} Q ${cx} ${cy - 14} ${cx + 11} ${cy - 4}`} {...st} />
        ) : (
          <path key={side} d={`M ${cx - 11} ${cy + 4} L ${cx + 11} ${cy + 4}`} {...st} />
        );
      case "bored":
        return <path key={side} d={`M ${cx - 12} ${cy + 6} Q ${cx} ${cy + 2} ${cx + 12} ${cy + 6}`} {...st} />;
      case "neutral":
        return <path key={side} d={`M ${cx - 10} ${cy + 2} Q ${cx} ${cy - 4} ${cx + 10} ${cy + 2}`} {...st} />;
      default:
        return null;
    }
  };
  const mx = ox;
  const my = oy + 28;
  let mouth: React.ReactNode;
  switch (expr) {
    case "happy":
      mouth = <path d={`M ${mx - 14} ${my - 4} Q ${mx} ${my + 10} ${mx + 14} ${my - 4}`} {...st} />;
      break;
    case "sad":
      mouth = <path d={`M ${mx - 12} ${my + 4} Q ${mx} ${my - 6} ${mx + 12} ${my + 4}`} {...st} />;
      break;
    case "surprised":
      mouth = <ellipse cx={mx} cy={my + 2} rx={7} ry={9} {...st} />;
      break;
    case "blow":
      mouth = <circle cx={mx} cy={my} r={6} {...st} />;
      break;
    case "confused":
      mouth = <path d={`M ${mx - 12} ${my} q 6 -6 12 0 t 12 0`} {...st} />;
      break;
    case "worried":
      mouth = <path d={`M ${mx - 10} ${my} L ${mx + 10} ${my}`} {...st} />;
      break;
    default:
      mouth = <path d={`M ${mx - 12} ${my} L ${mx + 12} ${my}`} {...st} />;
  }
  return (
    <g>
      {[-1, 1].map(eye)}
      {[-1, 1].map(brow)}
      {mouth}
      {glasses && (
        <g stroke={EYE} strokeWidth={3.5} fill="none" opacity={0.9}>
          <circle cx={ox - ex} cy={oy - 2} r={17} />
          <circle cx={ox + ex} cy={oy - 2} r={17} />
          <line x1={ox - ex + 17} y1={oy - 4} x2={ox + ex - 17} y2={oy - 4} />
        </g>
      )}
      {expr === "blow" && (
        <g opacity={0.6 + 0.4 * Math.sin(f / 3)}>
          {[0, 1, 2].map((k) => (
            <path key={k} d={`M ${mx + 12 + k * 14} ${my - 6 + k * 6} q 10 -4 20 0`} stroke={EYE} strokeWidth={3} fill="none" strokeLinecap="round" />
          ))}
        </g>
      )}
    </g>
  );
};

export const Stick: React.FC<StickProps> = ({
  c,
  x,
  y,
  s = 1,
  f,
  expr = "neutral",
  pose = POSES.idle,
  look = 0,
  lookY = 0,
  tilt = 0,
  lean = 0,
  age = 0,
  sweat,
  tremble = 0,
  walk,
  sit,
  seed = 0,
  shadow = true,
  rim = "rim",
}) => {
  const o = c.outfit;
  const breathe = Math.sin(f / 22 + seed) * 2.5;
  const tr = tremble ? Math.sin(f * 2.7 + seed) * 3 * tremble : 0;
  const bob = walk !== undefined ? Math.abs(Math.sin(walk)) * -8 : 0;
  const hipY = (sit ? -150 : -235) + bob;
  const shY = hipY - 165 + breathe * 0.4;
  const hunch = age * 9;
  const headY = shY - 104 + breathe * 0.3 + age * 10;
  const hairCol = `rgb(${11 + age * 160},${10 + age * 160},${12 + age * 165})`;
  // blink every ~3.5 s
  const bt = (f + seed * 37 + 50) % 105;
  const blink = bt < 3 ? 0.12 : 1;

  // legs
  const legs = [-1, 1].map((side) => {
    let fx = side * 24;
    let fy = 0;
    let kx = side * 22;
    let ky = (hipY + 0) / 2;
    if (walk !== undefined) {
      const ph = walk + (side > 0 ? Math.PI : 0);
      fx = side * 20 + Math.sin(ph) * 6;
      fy = -Math.max(0, Math.cos(ph)) * 22;
      ky = hipY / 2 + fy / 2;
      kx = side * 22;
    }
    if (sit) {
      kx = side * 34;
      ky = hipY + 18;
      fx = side * 36;
    }
    return { side, fx, fy, kx, ky };
  });

  // arms (walking swing)
  const swing = walk !== undefined ? Math.sin(walk) * 18 : 0;
  const arms = [
    { side: -1, a: [pose.l[0] + swing, pose.l[1]] as Arm },
    { side: 1, a: [pose.r[0] - swing, pose.r[1]] as Arm },
  ].map(({ side, a }) => ({ side, ...limb(side * 42, shY + 14, side, a) }));

  const sleeveLen = o.kind === "tee" ? 0.42 : 1;
  const torsoBottom = o.kind === "coat" ? hipY + 120 : hipY + 18;

  return (
    <g transform={`translate(${x + tr} ${y}) scale(${s})`}>
      {shadow && <ellipse cx={0} cy={4} rx={70} ry={12} fill="#000" opacity={0.35} />}
      <g filter={`url(#${rim})`} transform={`rotate(${lean + hunch * 0.6} 0 ${hipY})`}>
        {/* legs */}
        {legs.map((l) => (
          <g key={l.side}>
            <path d={`M ${l.side * 16} ${hipY} L ${l.kx} ${l.ky} L ${l.fx} ${l.fy - 6}`} stroke={o.pants} strokeWidth={22} fill="none" strokeLinejoin="round" />
            <path d={`M ${l.kx} ${l.ky} L ${l.fx} ${l.fy - 6}`} stroke={INK} strokeWidth={11} strokeLinecap="round" fill="none" opacity={o.pants === INK ? 1 : 0} />
            <ellipse cx={l.fx + l.side * 10} cy={l.fy - 4} rx={20} ry={9} fill={INK} />
          </g>
        ))}
        {/* long hair behind head */}
        {c.hair === "long" && (
          <path d={`M ${-62} ${headY} Q ${-70} ${headY + 90} ${-50} ${headY + 120} L 50 ${headY + 120} Q 70 ${headY + 90} 62 ${headY} Z`} fill={hairCol} />
        )}
        {/* torso clothing */}
        <g>
          {o.kind === "coat" && <path d={`M -40 ${shY + 4} L 40 ${shY + 4} L 34 ${hipY + 10} L -34 ${hipY + 10} Z`} fill={o.inner ?? "#2f8f9a"} />}
          <path
            d={
              o.kind === "coat"
                ? `M -48 ${shY + 10} Q -46 ${shY - 6} -24 ${shY - 6} L -10 ${shY + 60} L -10 ${torsoBottom} L -54 ${torsoBottom} Z M 48 ${shY + 10} Q 46 ${shY - 6} 24 ${shY - 6} L 10 ${shY + 60} L 10 ${torsoBottom} L 54 ${torsoBottom} Z`
                : `M -48 ${shY + 14} Q -46 ${shY - 8} -22 ${shY - 8} L 22 ${shY - 8} Q 46 ${shY - 8} 48 ${shY + 14} L 42 ${torsoBottom - 10} Q 40 ${torsoBottom} 30 ${torsoBottom} L -30 ${torsoBottom} Q -40 ${torsoBottom} -42 ${torsoBottom - 10} Z`
            }
            fill={o.color}
            stroke={INK}
            strokeWidth={4}
          />
          {o.kind === "hoodie" && (
            <g>
              <path d={`M -34 ${shY - 6} Q 0 ${shY + 34} 34 ${shY - 6}`} stroke={INK} strokeWidth={4} fill="none" opacity={0.55} />
              <line x1={-9} y1={shY + 10} x2={-11} y2={shY + 60} stroke="#fff" strokeWidth={3} opacity={0.8} />
              <line x1={9} y1={shY + 10} x2={11} y2={shY + 60} stroke="#fff" strokeWidth={3} opacity={0.8} />
              <path d={`M -26 ${hipY - 40} L 26 ${hipY - 40} L 21 ${hipY - 6} L -21 ${hipY - 6} Z`} fill="none" stroke={INK} strokeWidth={3} opacity={0.4} />
            </g>
          )}
        </g>
        {/* neck */}
        <rect x={-6} y={headY + 40} width={12} height={shY - headY - 34} fill={INK} />
        {/* arms */}
        {arms.map((a) => {
          const sx = a.side * 42;
          const sy = shY + 14;
          const midx = sx + (a.ex - sx) * sleeveLen;
          const midy = sy + (a.ey - sy) * sleeveLen;
          return (
            <g key={a.side}>
              <path d={`M ${sx} ${sy} L ${a.ex} ${a.ey} L ${a.hx} ${a.hy}`} stroke={INK} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" fill="none" />
              {o.kind === "tee" ? (
                <path d={`M ${sx} ${sy} L ${midx} ${midy}`} stroke={o.color} strokeWidth={26} strokeLinecap="round" fill="none" />
              ) : (
                <path
                  d={`M ${sx} ${sy} L ${a.ex} ${a.ey} L ${sx + (a.hx - sx) * 1 - (a.hx - a.ex) * 0.18} ${a.hy - (a.hy - a.ey) * 0.18}`}
                  stroke={o.color}
                  strokeWidth={24}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              )}
              <circle cx={a.hx} cy={a.hy} r={11} fill={INK} />
            </g>
          );
        })}
        {/* head */}
        <g transform={`rotate(${tilt} 0 ${headY + 40}) translate(${hunch * 2.2} 0) translate(0 ${headY}) scale(1.16) translate(0 ${-headY})`}>
          <circle cx={0} cy={headY} r={64} fill={INK} />
          {c.hair === "tuft" && <path d={`M -14 ${headY - 60} Q -6 ${headY - 92} 14 ${headY - 86} Q 2 ${headY - 76} 10 ${headY - 62} Z`} fill={hairCol} />}
          {c.hair === "buns" && (
            <g fill={hairCol}>
              <circle cx={-44} cy={headY - 50} r={20} />
              <circle cx={44} cy={headY - 50} r={20} />
            </g>
          )}
          {c.hair === "bun" && <circle cx={6} cy={headY - 70} r={22} fill={hairCol} />}
          {c.hair === "long" && <path d={`M -64 ${headY} Q -64 ${headY - 66} 0 ${headY - 66} Q 64 ${headY - 66} 64 ${headY} Q 40 ${headY - 40} 0 ${headY - 44} Q -40 ${headY - 40} -64 ${headY} Z`} fill={hairCol} />}
          {c.hair === "cap" && (
            <g>
              <path d={`M -62 ${headY - 12} Q -60 ${headY - 70} 0 ${headY - 70} Q 60 ${headY - 70} 62 ${headY - 12} Z`} fill={c.capColor ?? "#c98a3a"} stroke={INK} strokeWidth={4} />
              <path d={`M 10 ${headY - 16} Q 60 ${headY - 26} 92 ${headY - 8} L 60 ${headY - 6} Z`} fill={c.capColor ?? "#c98a3a"} stroke={INK} strokeWidth={4} />
            </g>
          )}
          <g transform={`translate(0 ${headY + (c.hair === "cap" ? 8 : 0)})`}>
            <Face expr={expr} blink={blink} lx={look} ly={lookY} glasses={c.glasses} f={f} />
          </g>
        </g>
      </g>
      {sweat && (
        <path
          d={`M ${78 + hunch} ${headY - 40 + ((f * 0.8) % 30)} q -12 18 0 24 q 12 -6 0 -24 Z`}
          fill="#7cc8ff"
          opacity={0.9}
        />
      )}
    </g>
  );
};
