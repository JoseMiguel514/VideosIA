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
/** IK hand target; optional ex/ey = preferred elbow (allows foreshortened arms, e.g. hand at chin with elbow down). */
export type Reach = { x: number; y: number; w: number; ex?: number; ey?: number };
export type HandMode = "ball" | "relaxed" | "grip" | "open" | "point" | "fist";

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
  talk?: number; // 0..1 speaking gestures + mouth flap
  pops?: number[]; // frames that trigger a squash-and-stretch reaction
  still?: boolean; // disable secondary motion (frozen moments)
  /** IK hand targets in the character's local unscaled space (origin between feet, y up negative). w = blend weight 0..1 */
  reachR?: Reach;
  reachL?: Reach;
  /** Objects held in the hands (drawn in hand-local coordinates). */
  itemR?: React.ReactNode;
  itemL?: React.ReactNode;
  /** Extra vertical offset (e.g. crouch / jump), local units. */
  dy?: number;
  /** Draw hands (and held items) in front of the head, e.g. hand on chin / over mouth. */
  handsFront?: boolean;
  /** Hand shapes; default: grip when holding an item, otherwise relaxed. */
  handR?: HandMode;
  handL?: HandMode;
};

const INK = "#0b0a0c";
const EYE = "#f6efdf";
const RIM = "#f0d29a";
const toRad = (d: number) => (d * Math.PI) / 180;

/** Two-bone IK: arm angles (in this file's convention) that place the hand at (tx, ty). */
export const ik = (sx: number, sy: number, side: number, tx: number, ty: number, L1 = 95, L2 = 90): Arm => {
  const dx = tx - sx;
  const dyy = ty - sy;
  const d = Math.min(L1 + L2 - 2, Math.max(8, Math.hypot(dx, dyy)));
  const at = Math.atan2(side * dx, dyy);
  const alpha = Math.acos(Math.max(-1, Math.min(1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d))));
  const a1 = at + alpha;
  const ex = sx + side * L1 * Math.sin(a1);
  const ey = sy + L1 * Math.cos(a1);
  const a2 = Math.atan2(side * (tx - ex), ty - ey);
  return [(a1 * 180) / Math.PI, ((a2 - a1) * 180) / Math.PI];
};
const limb = (sx: number, sy: number, side: number, a: Arm, L1 = 95, L2 = 90) => {
  const a1 = toRad(a[0]);
  const a2 = toRad(a[0] + a[1]);
  const ex = sx + side * L1 * Math.sin(a1);
  const ey = sy + L1 * Math.cos(a1);
  const hx = ex + side * L2 * Math.sin(a2);
  const hy = ey + L2 * Math.cos(a2);
  return { ex, ey, hx, hy };
};

/** Place a two-bone arm from shoulder (sx,sy) to hand target; of the two elbow solutions, keep the one `score` prefers. */
export const armSolve = (sx: number, sy: number, tx: number, ty: number, score: (c: { ex: number; ey: number }) => number, L1 = 95, L2 = 90) => {
  const dx = tx - sx;
  const dyy = ty - sy;
  const dist = Math.hypot(dx, dyy) || 1;
  const d = Math.min(L1 + L2 - 1, Math.max(12, dist));
  const ux = dx / dist;
  const uy = dyy / dist;
  const hx = sx + ux * d;
  const hy = sy + uy * d;
  const along = (L1 * L1 - L2 * L2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, L1 * L1 - along * along));
  const mx = sx + ux * along;
  const my = sy + uy * along;
  const c1 = { ex: mx - uy * h, ey: my + ux * h };
  const c2 = { ex: mx + uy * h, ey: my - ux * h };
  const c = score(c1) >= score(c2) ? c1 : c2;
  return { ex: c.ex, ey: c.ey, hx, hy };
};

/** Natural elbow preference: below and outside the shoulder. */
export const natScore = (sx: number, side: number) => (c: { ex: number; ey: number }) => c.ey + 0.45 * side * (c.ex - sx);

/** Arm with a chosen elbow point; segments may be shorter than full length (pointing toward the camera). */
const prefSolve = (sx: number, sy: number, tx: number, ty: number, pex: number, pey: number, L1 = 95, L2 = 90) => {
  let ex = pex;
  let ey = pey;
  const d1 = Math.hypot(ex - sx, ey - sy);
  if (d1 > L1) {
    ex = sx + ((ex - sx) * L1) / d1;
    ey = sy + ((ey - sy) * L1) / d1;
  }
  let hx = tx;
  let hy = ty;
  const d2 = Math.hypot(hx - ex, hy - ey);
  if (d2 > L2 + 6) {
    hx = ex + ((hx - ex) * (L2 + 6)) / d2;
    hy = ey + ((hy - ey) * (L2 + 6)) / d2;
  }
  return { ex, ey, hx, hy };
};

/** Arm polyline with a rounded elbow (no hard kink), optionally stopping short of the hand. */
const armPath = (sx: number, sy: number, ex: number, ey: number, hx: number, hy: number, end = 1) => {
  const l1 = Math.hypot(ex - sx, ey - sy) || 1;
  const l2 = Math.hypot(hx - ex, hy - ey) || 1;
  const r = Math.min(16, l1 * 0.35, l2 * 0.35);
  const p1x = ex - ((ex - sx) / l1) * r;
  const p1y = ey - ((ey - sy) / l1) * r;
  const p2x = ex + ((hx - ex) / l2) * r;
  const p2y = ey + ((hy - ey) / l2) * r;
  const tx = ex + (hx - ex) * end;
  const ty = ey + (hy - ey) * end;
  return `M ${sx} ${sy} L ${p1x} ${p1y} Q ${ex} ${ey} ${p2x} ${p2y} L ${tx} ${ty}`;
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

const Face: React.FC<{ expr: Expr; blink: number; lx: number; ly: number; glasses?: boolean; f: number; talk?: number }> = ({
  expr,
  blink,
  lx,
  ly,
  glasses,
  f,
  talk = 0,
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
  if (talk > 0 && (expr === "neutral" || expr === "happy" || expr === "bored")) {
    const open = Math.max(0, Math.sin(f / 2.6) * Math.sin(f / 7.3)) * 10 * talk;
    if (open > 1.5) mouth = <ellipse cx={mx} cy={my + 2} rx={11} ry={open / 2 + 1} fill={EYE} />;
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


/** Darken / lighten a #rrggbb colour. */
const shade = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => Math.max(0, Math.min(255, Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k)));
  return `rgb(${ch((n >> 16) & 255)},${ch((n >> 8) & 255)},${ch(n & 255)})`;
};

type PFn = (ol: boolean, fill?: string, stroke?: string, sw?: number) => Record<string, unknown>;
/**
 * Hand with simple readable fingers, drawn in a frame where +y points along the forearm.
 * `side` puts the thumb on the inner side. `item` is drawn between palm and fingers (so fingers wrap it).
 */
const Hand: React.FC<{ mode: HandMode; side: number; ol: boolean; P: PFn; item?: React.ReactNode; rc: string }> = ({ mode, side, ol, P, item, rc }) => {
  const sep = !ol ? { stroke: rc, strokeWidth: 1.6, fill: "none", opacity: 0.85 } : null;
  const t = -side; // thumb side
  if (mode === "grip" || mode === "fist" || mode === "point") {
    return (
      <g>
        <ellipse cx={0} cy={6} rx={10} ry={11} {...P(ol, INK)} />
        {!ol && item}
        {/* curled fingers wrapping */}
        {[-7, -2.4, 2.4, 7].map((fx, i) => (
          <circle key={i} cx={fx} cy={14 + (i === 0 || i === 3 ? -1 : 0)} r={3.8} {...P(ol, INK)} />
        ))}
        {sep && [-4.7, 0, 4.7].map((fx, i) => <line key={i} x1={fx} y1={11} x2={fx} y2={17} {...sep} />)}
        {mode === "point" && <path d={`M ${t * -2} 12 L ${t * -2} 34`} {...P(ol, "none", INK, 5.5)} />}
        <ellipse cx={t * 10} cy={4} rx={4} ry={8} transform={`rotate(${t * 25} ${t * 10} 4)`} {...P(ol, INK)} />
        {sep && <path d={`M ${t * 7} -2 q ${t * 4} 6 ${t * 1} 12`} {...sep} />}
      </g>
    );
  }
  if (mode === "open") {
    return (
      <g>
        <ellipse cx={0} cy={6} rx={10} ry={9} {...P(ol, INK)} />
        {[-14, -5, 5, 14].map((a, i) => {
          const r = (a * Math.PI) / 180;
          const L = i === 1 || i === 2 ? 17 : 14;
          return <path key={i} d={`M ${-6 + i * 4} 12 L ${-6 + i * 4 + Math.sin(r) * L} ${12 + Math.cos(r) * L}`} {...P(ol, "none", INK, 4.6)} />;
        })}
        <path d={`M ${t * 8} 6 L ${t * 19} 12`} {...P(ol, "none", INK, 5)} />
        {!ol && item}
      </g>
    );
  }
  if (mode === "ball") {
    return (
      <g>
        <circle cx={0} cy={6} r={11.5} {...P(ol, INK)} />
        {!ol && item}
      </g>
    );
  }
  // relaxed
  return (
    <g>
      <ellipse cx={0} cy={7} rx={8.5} ry={11} {...P(ol, INK)} />
      {[-4.2, 0, 4.2].map((fx, i) => (
        <path key={i} d={`M ${fx} 12 Q ${fx * 1.05} ${i === 1 ? 21 : 19.5} ${fx * 0.7 + t * 1.5} ${i === 1 ? 23 : 21.5}`} {...P(ol, "none", INK, 4.4)} />
      ))}
      {sep && [-2.1, 2.1].map((fx, i) => <line key={i} x1={fx} y1={15} x2={fx * 0.9} y2={21} {...sep} />)}
      <ellipse cx={t * 8} cy={5} rx={3.4} ry={6.5} transform={`rotate(${t * 14} ${t * 8} 5)`} {...P(ol, INK)} />
      {!ol && item}
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
  talk = 0,
  pops = [],
  still,
  reachR,
  reachL,
  itemR,
  itemL,
  dy = 0,
  handsFront,
  handR,
  handL,
}) => {
  const o = c.outfit;
  const sm = still ? 0 : 1; // secondary motion amount
  const breathe = Math.sin(f / 22 + seed) * 2.5;
  // reaction squash & stretch (damped)
  let sq = 0;
  for (const p of pops) {
    const t = f - p;
    if (t >= 0 && t < 24) sq += Math.sin(t * 0.55) * Math.exp(-t / 7) * 0.09;
  }
  const sway = sm * (Math.sin(f / 37 + seed) * 1.6 + Math.sin(f / 13 + seed * 2) * 0.5);
  const talkBeat = talk * (0.5 + 0.5 * Math.sin(f / 6.5 + seed)) * (0.6 + 0.4 * Math.sin(f / 17));
  const nod = sm * (Math.sin(f / 41 + seed) * 2.5) + talk * Math.sin(f / 5.5) * 3;
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

  // arms (walking swing). Hands are positioned first (pose FK blended toward IK targets),
  // then the elbow is solved so it always bends naturally (down / outward), never backwards.
  const swing = walk !== undefined ? Math.sin(walk) * 18 : 0;
  const SWa = 40;
  const arms = [
    { side: -1, a: [pose.l[0] + swing + sm * Math.sin(f / 29 + seed) * 3, pose.l[1] + sm * Math.sin(f / 23 + seed) * 4] as Arm },
    { side: 1, a: [pose.r[0] - swing + sm * Math.sin(f / 31 + seed + 1) * 3 + talkBeat * 22, pose.r[1] + sm * Math.sin(f / 21 + seed) * 4 - talkBeat * 30] as Arm },
  ].map(({ side, a }) => {
    const tgt = side > 0 ? reachR : reachL;
    const solveAt = (sx: number, sy: number) => {
      const fk = limb(sx, sy, side, a);
      let hx = fk.hx;
      let hy = fk.hy;
      let px = fk.ex;
      let py = fk.ey;
      if (tgt && tgt.w > 0) {
        const w = tgt.w * tgt.w * (3 - 2 * tgt.w);
        const tx = tgt.x;
        const ty = tgt.y - dy;
        if (tgt.ex !== undefined && tgt.ey !== undefined) {
          const pr = prefSolve(sx, sy, tx, ty, tgt.ex, tgt.ey - dy);
          return { ex: px + (pr.ex - px) * w, ey: py + (pr.ey - py) * w, hx: hx + (pr.hx - hx) * w, hy: hy + (pr.hy - hy) * w };
        }
        const nat = armSolve(sx, sy, tx, ty, natScore(sx, side));
        hx += (nat.hx - hx) * w;
        hy += (nat.hy - hy) * w;
        px += (nat.ex - px) * w;
        py += (nat.ey - py) * w;
      }
      return armSolve(sx, sy, hx, hy, (c) => -Math.hypot(c.ex - px, c.ey - py));
    };
    // shoulder rises and tucks in slightly as the arm lifts overhead (clavicle), so raised arms stay attached
    const first = solveAt(side * SWa, shY + 14);
    const upAng = (Math.atan2(side * (first.ex - side * SWa), first.ey - (shY + 14)) * 180) / Math.PI;
    const raise = Math.max(0, Math.min(1, (Math.abs(upAng) - 70) / 80));
    const sx = side * (SWa - 4 * raise);
    const sy = shY + 14 - 10 * raise;
    return { side, sx, sy, raise, ...solveAt(sx, sy) };
  });

  const sleeveLen = o.kind === "tee" ? 0.42 : 1;
  const torsoBottom = o.kind === "coat" ? hipY + 120 : hipY + 18;

  // Outline is drawn as an enlarged cream copy of the silhouette underneath (deterministic, no SVG filter).
  const RC = rim === "rimIce" ? "#7fe6ff" : RIM;
  const P = (ol: boolean, fill?: string, stroke?: string, sw = 0) =>
    ol ? { fill: fill && fill !== "none" ? RC : "none", stroke: RC, strokeWidth: sw + 10 } : { fill: fill ?? "none", stroke, strokeWidth: sw };
  const headT = `rotate(${tilt + nod} 0 ${headY + 40}) translate(${hunch * 2.2} 0) translate(0 ${headY}) scale(1.16) translate(0 ${-headY})`;
  const SW = 40; // shoulder half-width
  const dark = shade(o.color, -0.28);
  const pantsDark = o.pants === INK ? INK : shade(o.pants, -0.3);
  const handFor = (side: number, item: React.ReactNode): HandMode => (side > 0 ? handR : handL) ?? (item ? "grip" : "ball");
  const drawHand = (a: (typeof arms)[number], ol: boolean, front = false) => {
    const item = a.side > 0 ? itemR : itemL;
    const ang = (Math.atan2(-(a.hx - a.ex), a.hy - a.ey) * 180) / Math.PI;
    const mode = handFor(a.side, item);
    return (
      <g transform={`translate(${a.hx} ${a.hy - 4})`}>
        {/* the held item keeps its own orientation; only the hand rotates with the forearm */}
        <g transform={`rotate(${ang})`}>
          <Hand mode={mode} side={a.side} ol={ol} P={P as PFn} rc={RC} item={undefined} />
        </g>
        {!ol && item && <g transform="translate(0 4)">{item}</g>}
        {!ol && item && mode === "grip" && (
          <g transform={`rotate(${ang})`}>
            {[-7, -2.4, 2.4, 7].map((fx, i) => (
              <circle key={i} cx={fx} cy={14 + (i === 0 || i === 3 ? -1 : 0)} r={3.8} fill={INK} stroke={front ? RC : "none"} strokeWidth={front ? 1.4 : 0} />
            ))}
            {[-4.7, 0, 4.7].map((fx, i) => (
              <line key={i} x1={fx} y1={11} x2={fx} y2={17} stroke={RC} strokeWidth={1.6} opacity={0.85} />
            ))}
          </g>
        )}
      </g>
    );
  };
  const geo = (ol: boolean) => (
    <g strokeLinecap="round" strokeLinejoin="round">
      {/* legs: slim trousers, hem, crease and two-tone shoes */}
      {legs.map((l) => (
        <g key={l.side}>
          <path d={`M ${l.side * 14} ${hipY} L ${l.kx * 0.9} ${l.ky} L ${l.fx * 0.95} ${l.fy - 10}`} {...P(ol, "none", o.pants, 20)} />
          {!ol && o.pants !== INK && <path d={`M ${l.side * 14} ${hipY + 10} L ${l.kx * 0.9} ${l.ky} L ${l.fx * 0.95} ${l.fy - 14}`} stroke={pantsDark} strokeWidth={2} fill="none" opacity={0.6} />}
          {!ol && o.pants !== INK && <path d={`M ${l.fx * 0.95 - 8} ${l.fy - 18} L ${l.fx * 0.95 + 8} ${l.fy - 18}`} stroke={pantsDark} strokeWidth={3} />}
          {!ol && o.pants === INK && <path d={`M ${l.kx * 0.9} ${l.ky} L ${l.fx * 0.95} ${l.fy - 10}`} stroke={INK} strokeWidth={10.5} fill="none" />}
          <path d={`M ${l.fx * 0.95 - l.side * 6} ${l.fy - 12} Q ${l.fx * 0.95 + l.side * 24} ${l.fy - 16} ${l.fx * 0.95 + l.side * 26} ${l.fy - 2} L ${l.fx * 0.95 - l.side * 8} ${l.fy - 1} Z`} {...P(ol, INK)} />
          {!ol && <path d={`M ${l.fx * 0.95 - l.side * 8} ${l.fy - 2} L ${l.fx * 0.95 + l.side * 25} ${l.fy - 3}`} stroke="#e9e2d4" strokeWidth={3} />}
        </g>
      ))}
      {c.hair === "long" && <path d={`M ${-62} ${headY} Q ${-70} ${headY + 90} ${-46} ${headY + 120} L 46 ${headY + 120} Q 70 ${headY + 90} 62 ${headY} Z`} {...P(ol, hairCol)} />}
      {/* hood behind the neck */}
      {o.kind === "hoodie" && <path d={`M -30 ${shY - 2} Q -34 ${shY - 30} 0 ${shY - 32} Q 34 ${shY - 30} 30 ${shY - 2} Z`} {...P(ol, dark, INK, 3)} />}
      {o.kind === "coat" && <path d={`M -32 ${shY + 4} L 32 ${shY + 4} L 28 ${hipY + 10} L -28 ${hipY + 10} Z`} {...P(ol, o.inner ?? "#2f8f9a")} />}
      <path
        d={
          o.kind === "coat"
            ? `M -${SW + 4} ${shY + 10} Q -${SW + 2} ${shY - 6} -20 ${shY - 6} L -8 ${shY + 60} L -8 ${torsoBottom} L -${SW + 8} ${torsoBottom} Z M ${SW + 4} ${shY + 10} Q ${SW + 2} ${shY - 6} 20 ${shY - 6} L 8 ${shY + 60} L 8 ${torsoBottom} L ${SW + 8} ${torsoBottom} Z`
            : `M -${SW + 4} ${shY + 14} Q -${SW + 2} ${shY - 8} -18 ${shY - 8} L 18 ${shY - 8} Q ${SW + 2} ${shY - 8} ${SW + 4} ${shY + 14} L ${SW - 2} ${hipY - 40} Q ${SW} ${torsoBottom - 4} ${SW - 6} ${torsoBottom} L -${SW - 6} ${torsoBottom} Q -${SW} ${torsoBottom - 4} -${SW - 2} ${hipY - 40} Z`
        }
        {...P(ol, o.color, INK, 3.5)}
      />
      {!ol && (
        <g>
          {/* soft side shading for volume */}
          <path d={`M ${SW - 8} ${shY + 6} L ${SW + 2} ${shY + 16} L ${SW - 4} ${torsoBottom - 6} L ${SW - 14} ${torsoBottom - 6} Z`} fill="#000" opacity={0.13} />
          {o.kind === "hoodie" && (
            <g>
              <path d={`M -16 ${shY - 6} Q 0 ${shY + 26} 16 ${shY - 6}`} stroke={INK} strokeWidth={3} fill="none" opacity={0.6} />
              <path d={`M -7 ${shY + 8} L -8 ${shY + 52}`} stroke="#fff" strokeWidth={2.5} opacity={0.85} />
              <path d={`M 7 ${shY + 8} L 8 ${shY + 52}`} stroke="#fff" strokeWidth={2.5} opacity={0.85} />
              <circle cx={-8} cy={shY + 54} r={2.6} fill="#fff" />
              <circle cx={8} cy={shY + 54} r={2.6} fill="#fff" />
              <path d={`M -22 ${hipY - 40} L 22 ${hipY - 40} L 18 ${hipY - 8} L -18 ${hipY - 8} Z`} fill={dark} opacity={0.45} stroke={INK} strokeWidth={2.5} />
              <path d={`M -${SW - 5} ${torsoBottom - 8} L ${SW - 5} ${torsoBottom - 8}`} stroke={dark} strokeWidth={6} />
            </g>
          )}
          {o.kind === "tee" && (
            <g>
              <path d={`M -15 ${shY - 7} Q 0 ${shY + 10} 15 ${shY - 7}`} stroke={dark} strokeWidth={4} fill="none" />
              <path d={`M -${SW - 6} ${torsoBottom - 6} L ${SW - 6} ${torsoBottom - 6}`} stroke={dark} strokeWidth={3} opacity={0.6} />
            </g>
          )}
          {o.kind === "coat" && (
            <g>
              <path d={`M -20 ${shY - 6} L -8 ${shY + 30} L -20 ${shY + 18} Z`} fill={shade(o.color, -0.12)} stroke={INK} strokeWidth={2} />
              <path d={`M 20 ${shY - 6} L 8 ${shY + 30} L 20 ${shY + 18} Z`} fill={shade(o.color, -0.12)} stroke={INK} strokeWidth={2} />
              <rect x={14} y={shY + 50} width={18} height={18} rx={2} fill="none" stroke={shade(o.color, -0.3)} strokeWidth={2} />
              <path d={`M 19 ${shY + 44} L 19 ${shY + 62}`} stroke="#3a6fd8" strokeWidth={3} />
              <rect x={-36} y={hipY + 40} width={22} height={20} rx={2} fill="none" stroke={shade(o.color, -0.3)} strokeWidth={2} />
              {[0, 1, 2].map((i) => (
                <circle key={i} cx={0} cy={shY + 26 + i * 34} r={2.6} fill={shade(o.inner ?? "#2f8f9a", -0.4)} />
              ))}
            </g>
          )}
          {/* belt */}
          {o.kind !== "coat" && <rect x={-SW + 6} y={torsoBottom - 1} width={(SW - 6) * 2} height={6} fill={pantsDark === INK ? "#2a2420" : pantsDark} />}
        </g>
      )}
      <rect x={-5.5} y={headY + 40} width={11} height={shY - headY - 34} {...P(ol, INK)} />
      {arms.map((a) => {
        const { sx, sy } = a;
        const midx = sx + (a.ex - sx) * sleeveLen;
        const midy = sy + (a.ey - sy) * sleeveLen;
        const sleeveCol = o.kind === "coat" ? o.color : o.color;
        const cuffCol = o.kind === "coat" ? shade(o.color, -0.15) : dark;
        // elbow bend amount (0 straight .. 1 folded) for the sleeve crease
        const v1x = a.ex - sx;
        const v1y = a.ey - sy;
        const v2x = a.hx - a.ex;
        const v2y = a.hy - a.ey;
        const bend = 1 - (v1x * v2x + v1y * v2y) / ((Math.hypot(v1x, v1y) || 1) * (Math.hypot(v2x, v2y) || 1));
        return (
          <g key={a.side}>
            <path d={armPath(sx, sy, a.ex, a.ey, a.hx, a.hy)} {...P(ol, "none", INK, 10.5)} />
            {o.kind === "tee" ? (
              <>
                <path d={`M ${sx} ${sy} L ${midx} ${midy}`} {...P(ol, "none", sleeveCol, 24)} />
                <circle cx={sx} cy={sy - 2} r={13} {...P(ol, sleeveCol)} />
                {!ol && <path d={`M ${sx + (midx - sx) * 0.82} ${sy + (midy - sy) * 0.82} L ${midx} ${midy}`} stroke={dark} strokeWidth={24} strokeLinecap="butt" />}
              </>
            ) : (
              <>
                <path d={armPath(sx, sy, a.ex, a.ey, a.hx, a.hy, 0.8)} {...P(ol, "none", sleeveCol, 22)} />
                <circle cx={sx} cy={sy - 2} r={13} {...P(ol, sleeveCol)} />
                {!ol && <path d={`M ${a.ex + v2x * 0.7} ${a.ey + v2y * 0.7} L ${a.ex + v2x * 0.8} ${a.ey + v2y * 0.8}`} stroke={cuffCol} strokeWidth={22} />}
                {!ol && <path d={`M ${sx + 4 * a.side} ${sy + 6} L ${a.ex} ${a.ey}`} stroke="#000" strokeWidth={6} opacity={0.1} />}
                {!ol && bend > 0.35 && (
                  <path
                    d={`M ${a.ex - v1x * 0.12} ${a.ey - v1y * 0.12} Q ${a.ex} ${a.ey} ${a.ex + v2x * 0.12} ${a.ey + v2y * 0.12}`}
                    stroke={cuffCol}
                    strokeWidth={3}
                    fill="none"
                    opacity={Math.min(0.8, (bend - 0.35) * 2)}
                  />
                )}
              </>
            )}
            {!handsFront && drawHand(a, ol)}
          </g>
        );
      })}
      <g transform={headT}>
        <circle cx={0} cy={headY} r={64} {...P(ol, INK)} />
        {c.hair === "tuft" && <path d={`M -14 ${headY - 60} Q -6 ${headY - 92} 14 ${headY - 86} Q 2 ${headY - 76} 10 ${headY - 62} Z`} {...P(ol, hairCol)} />}
        {c.hair === "buns" && (
          <g>
            <circle cx={-44} cy={headY - 50} r={20} {...P(ol, hairCol)} />
            <circle cx={44} cy={headY - 50} r={20} {...P(ol, hairCol)} />
          </g>
        )}
        {c.hair === "bun" && <circle cx={6} cy={headY - 70} r={22} {...P(ol, hairCol)} />}
        {c.hair === "long" && <path d={`M -64 ${headY} Q -64 ${headY - 66} 0 ${headY - 66} Q 64 ${headY - 66} 64 ${headY} Q 40 ${headY - 40} 0 ${headY - 44} Q -40 ${headY - 40} -64 ${headY} Z`} {...P(ol, hairCol)} />}
        {c.hair === "cap" && (
          <g>
            <path d={`M -62 ${headY - 12} Q -60 ${headY - 70} 0 ${headY - 70} Q 60 ${headY - 70} 62 ${headY - 12} Z`} {...P(ol, c.capColor ?? "#c98a3a", INK, 4)} />
            <path d={`M 10 ${headY - 16} Q 60 ${headY - 26} 92 ${headY - 8} L 60 ${headY - 6} Z`} {...P(ol, c.capColor ?? "#c98a3a", INK, 4)} />
            {!ol && <circle cx={0} cy={headY - 70} r={5} fill={shade(c.capColor ?? "#c98a3a", -0.3)} />}
          </g>
        )}
        {!ol && (
          <g transform={`translate(0 ${headY + (c.hair === "cap" ? 8 : 0)})`}>
            <Face expr={expr} blink={blink} lx={look} ly={lookY} glasses={c.glasses} f={f} talk={talk} />
          </g>
        )}
      </g>
      {handsFront && arms.map((a) => <g key={`hf${a.side}`}>{drawHand(a, ol, true)}</g>)}
    </g>
  );

  return (
    <g transform={`translate(${x + tr} ${y}) scale(${s * (1 - sq * 0.6)} ${s * (1 + sq)})`}>
      {shadow && <ellipse cx={0} cy={4} rx={70} ry={12} fill="#000" opacity={0.35} />}
      <g transform={`translate(0 ${dy}) rotate(${lean + hunch * 0.6 + sway} 0 ${hipY})`}>
        {geo(true)}
        {geo(false)}
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
