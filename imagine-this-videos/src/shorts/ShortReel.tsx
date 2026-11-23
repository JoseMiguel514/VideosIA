import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { createTimeline, Linea, Word, LEAD } from "../lib/engine";
import { FONT, FPS, INK } from "../lib/scene";

/* Formato Short vertical 1080x1920: título arriba, escena 16:9 recortada en el centro,
   subtítulos karaoke abajo. Cada clip reutiliza una escena del video largo con un desfase. */

export type Clip = { id: string; Scene: React.FC; offset: number; cx?: number; cy?: number; zoom?: number };
const TAIL_SHORT = 6;

export const makeShortTimeline = (guion: Linea[], dur: Record<string, number>) => {
  const base = createTimeline(guion, dur);
  const frames = (id: string) => LEAD + Math.ceil(dur[id] * FPS) + TAIL_SHORT;
  const starts: Record<string, number> = {};
  let acc = 0;
  for (const id of base.order) {
    starts[id] = acc;
    acc += frames(id);
  }
  return { ...base, frames, starts, total: acc + 30 };
};

const Captions: React.FC<{ words: Word[] }> = ({ words }) => {
  const f = useCurrentFrame();
  const chunks: Word[][] = [];
  let cur: Word[] = [];
  words.forEach((w) => {
    cur.push(w);
    if (cur.length >= 3 || /[.,:?!]$/.test(w.w)) {
      chunks.push(cur);
      cur = [];
    }
  });
  if (cur.length) chunks.push(cur);
  const chunk = chunks.find((c) => f < c[c.length - 1].end + 2) ?? chunks[chunks.length - 1];
  if (!chunk || f < chunk[0].start - 2) return null;
  const pop = spring({ frame: f - chunk[0].start + 2, fps: FPS, config: { damping: 11, mass: 0.45 } });
  return (
    <div style={{ position: "absolute", top: 1430, left: 50, right: 50, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 56px", transform: `scale(${interpolate(pop, [0, 1], [0.7, 1])})` }}>
      {chunk.map((w, i) => {
        const active = f >= w.start && f < w.end + 2;
        const key = /\d/.test(w.w) || w.key;
        return (
          <span
            key={i}
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: key ? 104 : 90,
              lineHeight: 1.15,
              textTransform: "uppercase",
              color: key ? "#ffd36b" : active ? "#7ff0ff" : "#fff",
              WebkitTextStroke: `16px ${INK}`,
              paintOrder: "stroke fill",
              transform: `scale(${active ? 1.1 : 1}) rotate(${active ? -2 : 0}deg)`,
              display: "inline-block",
              textShadow: `0 10px 0 ${INK}`,
            }}
          >
            {w.w}
          </span>
        );
      })}
    </div>
  );
};

export const ShortReel: React.FC<{
  tl: ReturnType<typeof makeShortTimeline>;
  folder: string;
  clips: Clip[];
  title: React.ReactNode;
  music: string;
}> = ({ tl, folder, clips, title, music }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#160f3a,#2a1a5a 45%,#3a1a4a)" }}>
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.08) 3px, transparent 3px)", backgroundSize: "30px 30px" }} />
      {/* título */}
      <div style={{ position: "absolute", top: 150, left: 60, right: 60, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 92, lineHeight: 1.05, color: "#fff", WebkitTextStroke: `12px ${INK}`, paintOrder: "stroke fill", textShadow: `0 10px 0 ${INK}` }}>{title}</div>
      {/* ventana de la escena */}
      <div style={{ position: "absolute", left: 0, top: 470, width: 1080, height: 900, overflow: "hidden", borderTop: `8px solid ${INK}`, borderBottom: `8px solid ${INK}` }}>
        {clips.map((c) => {
          // zoom mínimo para llenar la ventana (900 px de alto) y encuadre dentro de la escena
          const z = Math.max(900 / 1080, c.zoom ?? 0.84);
          const cx = Math.min(1920 - 540 / z, Math.max(540 / z, c.cx ?? 960));
          const cy = Math.min(1080 - 450 / z, Math.max(450 / z, c.cy ?? 540));
          return (
            <Sequence key={c.id} from={tl.starts[c.id]} durationInFrames={tl.frames(c.id)} layout="none">
              <div style={{ position: "absolute", left: 540 - cx * z, top: 450 - cy * z, width: 1920, height: 1080, transform: `scale(${z})`, transformOrigin: "0 0" }}>
                <Sequence from={-c.offset} layout="none">
                  <AbsoluteFill style={{ width: 1920, height: 1080 }}>
                    <c.Scene />
                  </AbsoluteFill>
                </Sequence>
              </div>
            </Sequence>
          );
        })}
        {/* destello en cada corte */}
        {clips.map((c) => {
          const t = f - tl.starts[c.id];
          return t >= 0 && t < 6 ? <AbsoluteFill key={`fl${c.id}`} style={{ background: "#fff", opacity: (6 - t) / 8 }} /> : null;
        })}
      </div>
      {/* subtítulos + voz */}
      {tl.order.map((id) => (
        <Sequence key={id} from={tl.starts[id]} durationInFrames={tl.frames(id)} layout="none">
          <Captions words={tl.words(id)} />
          <Sequence from={LEAD} layout="none">
            <Audio src={staticFile(`${folder}/voz/${id}.wav`)} />
          </Sequence>
          <Audio src={staticFile("sfx/whoosh.wav")} volume={0.3} />
        </Sequence>
      ))}
      <Audio src={staticFile(music)} volume={0.18} />
      {/* barra de progreso */}
      <div style={{ position: "absolute", top: 0, left: 0, height: 14, width: `${(f / tl.total) * 100}%`, background: "linear-gradient(90deg,#7ff0ff,#ffd36b)" }} />
      {/* marca */}
      <div style={{ position: "absolute", bottom: 210, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 600, fontSize: 34, color: "rgba(255,255,255,.7)", letterSpacing: 6 }}>IMAGINE THIS</div>
    </AbsoluteFill>
  );
};
