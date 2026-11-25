export const FPS = 30;
export const LEAD = 6;
export const TAIL = 10;

export type Sent = { t: string; s: number; e: number };
export type Guion = { id: string; texto: string }[];
export type Durs = Record<string, { dur: number; sents: Sent[] }>;
export type WordT = { w: string; start: number; end: number; sentence: number };

/** Timing model for one narrated video: scene lengths, starts, word timings and word lookup. */
export const makeTiming = (guion: Guion, durs: Durs, endPad = 75) => {
  const ORDER = guion.map((g) => g.id);
  const voiceDur = (id: string) => durs[id]?.dur ?? 4; // fallback while narration is being regenerated
  const voiceEnd = (id: string) => LEAD + Math.ceil(voiceDur(id) * FPS);
  const sceneFrames = (id: string) => voiceEnd(id) + TAIL + (id === ORDER[ORDER.length - 1] ? endPad : 0);
  const STARTS: Record<string, number> = {};
  let acc = 0;
  for (const id of ORDER) {
    STARTS[id] = acc;
    acc += sceneFrames(id);
  }
  const cache: Record<string, WordT[]> = {};
  const wordTimes = (id: string): WordT[] => {
    if (cache[id]) return cache[id];
    const out: WordT[] = [];
    (durs[id]?.sents ?? []).forEach((s, si) => {
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
  /** Local frame where the n-th word containing `needle` starts in scene `id`. */
  const at = (id: string, needle: string, nth = 0): number => {
    const hits = wordTimes(id).filter((x) => x.w.toLowerCase().includes(needle.toLowerCase()));
    const t = hits[nth] ?? hits[0];
    if (!t) throw new Error(`word "${needle}" not found in ${id}`);
    return Math.round(t.start);
  };
  return { ORDER, STARTS, TOTAL: acc, sceneFrames, voiceEnd, wordTimes, at };
};
export type Timing = ReturnType<typeof makeTiming>;
