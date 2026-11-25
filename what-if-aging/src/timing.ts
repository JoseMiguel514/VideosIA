import guion from "../scripts/guion.json";
import duraciones from "./duraciones.json";

export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const LEAD = 8; // frames before the voice starts in each scene
export const TAIL = 12; // frames after the voice ends

export type SceneId =
  | "hook1" | "hook2" | "setup1" | "setup2" | "years" | "same" | "telomeres" | "jelly"
  | "math" | "lifespan" | "year200" | "risk" | "twist" | "root" | "lab" | "outro1" | "outro2";

export const ORDER: SceneId[] = guion.map((g) => g.id as SceneId);

type Sent = { t: string; s: number; e: number };
const D = duraciones as Record<string, { dur: number; sents: Sent[] }>;

export const voiceDur = (id: SceneId) => D[id].dur;
export const sceneFrames = (id: SceneId) =>
  LEAD + Math.ceil(voiceDur(id) * FPS) + TAIL + (id === "outro2" ? 75 : 0);

export const STARTS = {} as Record<SceneId, number>;
let acc = 0;
for (const id of ORDER) {
  STARTS[id] = acc;
  acc += sceneFrames(id);
}
export const TOTAL = acc;

export type WordT = { w: string; start: number; end: number; sentence: number };

// Words are distributed inside each sentence's measured span, weighted by length.
const cache = {} as Record<SceneId, WordT[]>;
export const wordTimes = (id: SceneId): WordT[] => {
  if (cache[id]) return cache[id];
  const out: WordT[] = [];
  D[id].sents.forEach((s, si) => {
    const ws = s.t.split(/\s+/).filter(Boolean);
    const weights = ws.map((w) => w.replace(/[^\p{L}\p{N}]/gu, "").length + 2 + (/[,:]$/.test(w) ? 4 : 0));
    const total = weights.reduce((a, b) => a + b, 0);
    let c = 0;
    ws.forEach((w, i) => {
      const start = LEAD + (s.s + (c / total) * (s.e - s.s)) * FPS;
      c += weights[i];
      out.push({ w, start, end: LEAD + (s.s + (c / total) * (s.e - s.s)) * FPS, sentence: si });
    });
  });
  cache[id] = out;
  return out;
};

/** Local frame (within the scene) at which the n-th word containing `needle` starts. */
export const at = (id: SceneId, needle: string, nth = 0): number => {
  const hits = wordTimes(id).filter((x) => x.w.toLowerCase().includes(needle.toLowerCase()));
  const t = hits[nth] ?? hits[0];
  if (!t) throw new Error(`word "${needle}" not found in ${id}`);
  return Math.round(t.start);
};
