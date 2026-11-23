/* Motor de tiempos compartido: convierte guion + duraciones de voz en escenas y tiempos de palabra. */
export const FPS = 30;
export const LEAD = 5; // frames antes de que empiece la voz en cada escena
export const TAIL = 7; // frames después
export const OUTRO_EXTRA = 45;

export type Linea = { id: string; texto: string; pantalla: string };
export type Word = { w: string; start: number; end: number; key: boolean };

export type Timeline = {
  order: string[];
  frames: (id: string) => number;
  starts: Record<string, number>;
  total: number;
  words: (id: string) => Word[];
  /** frame (relativo a la escena) en que se pronuncia la palabra que contiene `needle` */
  at: (id: string, needle: string) => number;
};

export const createTimeline = (guion: Linea[], dur: Record<string, number>): Timeline => {
  const order = guion.map((g) => g.id);
  const last = order[order.length - 1];
  const frames = (id: string) => LEAD + Math.ceil(dur[id] * FPS) + TAIL + (id === last ? OUTRO_EXTRA : 0);
  const starts: Record<string, number> = {};
  let acc = 0;
  for (const id of order) {
    starts[id] = acc;
    acc += frames(id);
  }
  const cache: Record<string, Word[]> = {};
  /* En "pantalla", un token como  $3,790{tres_mil_setecientos_noventa}  se muestra como "$3,790"
     pero pesa en el tiempo como lo que se pronuncia. */
  const words = (id: string): Word[] => {
    if (cache[id]) return cache[id];
    const toks = guion.find((g) => g.id === id)!.pantalla.split(/\s+/).filter(Boolean);
    const parsed = toks.map((t) => {
      const m = t.match(/^(.*?)\{([^}]*)\}(.*)$/);
      const shown = m ? m[1] + m[3] : t;
      const spoken = m ? m[2].replace(/_/g, " ") + m[3] : t;
      const weight =
        spoken.replace(/[^\p{L}\p{N}]/gu, "").length +
        1.5 * spoken.split(" ").length +
        (/[.,:?!]$/.test(t) ? 5 : 0) +
        (/\.\.\.$/.test(t) ? 6 : 0);
      const bare = shown.replace(/[^\p{L}\p{N}$%]/gu, "");
      const key =
        /[\d$%]/.test(shown) ||
        (bare.length > 1 && bare === bare.toUpperCase() && /\p{L}/u.test(bare) && !/^(GTA|VI?|HMS)$/.test(bare));
      return { shown, weight, key };
    });
    const total = parsed.reduce((a, b) => a + b.weight, 0);
    const d = dur[id] * FPS;
    let c = 0;
    cache[id] = parsed.map((p) => {
      const start = LEAD + (c / total) * d;
      c += p.weight;
      return { w: p.shown, start, end: LEAD + (c / total) * d, key: p.key };
    });
    return cache[id];
  };
  const at = (id: string, needle: string) => {
    const t = words(id).find((x) => x.w.toLowerCase().includes(needle.toLowerCase()));
    if (!t) throw new Error(`Palabra "${needle}" no encontrada en la escena ${id}`);
    return Math.round(t.start);
  };
  return { order, frames, starts, total: acc, words, at };
};

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

export type Sfx = { id: string; f: number; s: string; v?: number };
