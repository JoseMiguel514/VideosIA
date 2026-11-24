import { Easing, interpolate } from "remotion";
import { Pose } from "./Stick";

const smooth = Easing.bezier(0.45, 0, 0.25, 1);
export const punch = Easing.bezier(0.16, 1, 0.3, 1);

/** Numeric keyframes: [[frame, value], ...] with smooth easing between keys. */
export const kf = (f: number, keys: [number, number][], ease = smooth): number => {
  if (keys.length === 1) return keys[0][1];
  const ks = [...keys].sort((a, b) => a[0] - b[0]);
  if (f <= ks[0][0]) return ks[0][1];
  for (let i = 0; i < ks.length - 1; i++) {
    const [f0, v0] = ks[i];
    const [f1, v1] = ks[i + 1];
    if (f <= f1) return interpolate(f, [f0, f1], [v0, v1], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }
  return ks[ks.length - 1][1];
};

/** Step keys that blend over `d` frames after each key frame: [[frame, value], ...]. */
export const steps = (f: number, keys: [number, number][], d = 10): number => {
  const ks = [...keys].sort((a, b) => a[0] - b[0]);
  let v = ks[0][1];
  for (let i = 1; i < ks.length; i++) {
    const [k, nv] = ks[i];
    if (f < k) break;
    const t = interpolate(f, [k, k + d], [0, 1], { easing: smooth, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    v = v + (nv - v) * t;
  }
  return v;
};

const lerpPose = (a: Pose, b: Pose, t: number): Pose => ({
  l: [a.l[0] + (b.l[0] - a.l[0]) * t, a.l[1] + (b.l[1] - a.l[1]) * t],
  r: [a.r[0] + (b.r[0] - a.r[0]) * t, a.r[1] + (b.r[1] - a.r[1]) * t],
});

/** Pose timeline: switch poses at given frames, blending smoothly over `d` frames. */
export const poseAt = (f: number, keys: [number, Pose][], d = 12): Pose => {
  const ks = [...keys].sort((a, b) => a[0] - b[0]);
  let p = ks[0][1];
  for (let i = 1; i < ks.length; i++) {
    const [k, np] = ks[i];
    if (f < k) break;
    const t = interpolate(f, [k, k + d], [0, 1], { easing: smooth, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    p = lerpPose(p, np, t);
  }
  return p;
};

/** Discrete value timeline (e.g. expressions). */
export function pick<T>(f: number, keys: [number, T][]): T {
  const ks = [...keys].sort((a, b) => a[0] - b[0]);
  let v = ks[0][1];
  for (const [k, nv] of ks) if (f >= k) v = nv;
  return v;
}

/** Camera shake offset after impact frames. */
export const shake = (f: number, hits: number[], amp = 14, len = 14) => {
  let x = 0;
  let y = 0;
  for (const h of hits) {
    const t = f - h;
    if (t >= 0 && t < len) {
      const k = (1 - t / len) ** 2 * amp;
      x += Math.sin(t * 2.9 + h) * k;
      y += Math.cos(t * 3.7 + h) * k;
    }
  }
  return { x, y };
};
