import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { ease, pop } from "../kit";
import { GOLD, hudFont, ICE, RED } from "../stick/Hud";

const O = "#0b0a0c";
const box: React.CSSProperties = { position: "absolute", borderRadius: 16, background: "rgba(14,12,12,0.88)", border: "2px solid rgba(255,255,255,0.08)" };
const lbl: React.CSSProperties = { fontFamily: hudFont, fontWeight: 900, fontSize: 24, letterSpacing: 4, color: "#e9e2d4" };

/** Altimeter HUD like the reference ("ALTITUDE 21,250 FT") with a moving tape. */
export const Altimeter: React.FC<{ ft: number; x?: number; y?: number; start?: number }> = ({ ft, x = 1440, y = 50, start = 0 }) => {
  const f = useCurrentFrame();
  if (f < start) return null;
  const o = ease(f, start, start + 12);
  return (
    <div style={{ ...box, left: x, top: y, width: 440, height: 150, opacity: o, display: "flex" }}>
      <svg width={70} height={150}>
        {new Array(20).fill(0).map((_, i) => {
          const yy = ((i * 12 + (ft / 50) * 1) % 240) - 45;
          return <line key={i} x1={i % 5 ? 38 : 26} y1={yy} x2={56} y2={yy} stroke="#e9e2d4" strokeWidth={2} opacity={0.7} />;
        })}
        <path d="M 58 75 L 70 68 L 70 82 Z" fill="#e9e2d4" />
      </svg>
      <div style={{ flex: 1, textAlign: "center", paddingTop: 22 }}>
        <div style={lbl}>ALTITUDE</div>
        <div style={{ fontFamily: hudFont, fontWeight: 900, fontSize: 64, color: ft < 5000 ? RED : "#f6efdf" }}>{Math.max(0, Math.round(ft / 10) * 10).toLocaleString("en-US")} FT</div>
      </div>
    </div>
  );
};

/** Timer HUD (counts up from `t0` frame). */
export const Timer: React.FC<{ label: string; t0: number; x?: number; y?: number; base?: number; color?: string; start?: number }> = ({ label, t0, x = 1440, y = 50, base = 0, color = GOLD, start = 0 }) => {
  const f = useCurrentFrame();
  if (f < start) return null;
  const secs = Math.max(0, base + (f - t0) / 30);
  const mm = Math.floor(secs / 60);
  const ss = Math.floor(secs % 60);
  return (
    <div style={{ ...box, left: x, top: y, width: 440, padding: "14px 0 10px", textAlign: "center", opacity: ease(f, start, start + 10) }}>
      <div style={lbl}>{label}</div>
      <div style={{ fontFamily: hudFont, fontWeight: 900, fontSize: 70, color, textShadow: `0 0 18px ${color}99` }}>
        {mm}:{String(ss).padStart(2, "0")}
      </div>
    </div>
  );
};

/** Checklist card with items that tick in at given frames. */
export const Checklist: React.FC<{ title: string; items: { t: string; at: number }[]; x?: number; y?: number; w?: number; start?: number; end?: number }> = ({ title, items, x = 1240, y = 220, w = 600, start = 0, end }) => {
  const f = useCurrentFrame();
  if (f < start || (end !== undefined && f > end + 10)) return null;
  const o = ease(f, start, start + 10) * (end !== undefined ? 1 - ease(f, end, end + 10) : 1);
  return (
    <div style={{ ...box, left: x, top: y, width: w, padding: "20px 28px", opacity: o, transform: `scale(${0.9 + 0.1 * pop(f, start)})` }}>
      <div style={{ ...lbl, fontSize: 28, color: GOLD, marginBottom: 12 }}>{title}</div>
      {items.map((it) => {
        const on = f >= it.at;
        return (
          <div key={it.t} style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 10, opacity: on ? 1 : 0.35, transform: `translateX(${on ? 0 : 20}px)` }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, border: `4px solid ${on ? ICE : "#5a5a6a"}`, display: "flex", alignItems: "center", justifyContent: "center", color: ICE, fontFamily: hudFont, fontWeight: 900, fontSize: 30, transform: `scale(${on ? pop(f, it.at) : 1})` }}>
              {on ? "✓" : ""}
            </div>
            <div style={{ fontFamily: hudFont, fontWeight: 900, fontSize: 40, color: "#f6efdf" }}>{it.t}</div>
          </div>
        );
      })}
    </div>
  );
};

/** Glide profile: altitude line from left to right with a jet icon travelling along it. */
export const GlideProfile: React.FC<{ p: number; label?: string; x?: number; y?: number; w?: number; h?: number }> = ({ p, label = "GLIDE", x = 200, y = 160, w = 1520, h = 520 }) => {
  const pts = (t: number) => [x + 60 + t * (w - 160), y + 80 + t * (h - 180) + Math.sin(t * 12) * 4] as const;
  const [jx, jy] = pts(p);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <rect x={x} y={y} width={w} height={h} rx={20} fill="rgba(14,12,12,0.82)" />
      <line x1={x + 60} y1={y + h - 60} x2={x + w - 60} y2={y + h - 60} stroke="#7f8db0" strokeWidth={4} />
      <line x1={x + 60} y1={y + 60} x2={x + 60} y2={y + h - 60} stroke="#7f8db0" strokeWidth={4} />
      <path d={`M ${pts(0)[0]} ${pts(0)[1]} L ${pts(1)[0]} ${pts(1)[1]}`} stroke="#5a6a80" strokeWidth={4} strokeDasharray="14 12" />
      <path d={`M ${pts(0)[0]} ${pts(0)[1]} L ${jx} ${jy}`} stroke={ICE} strokeWidth={8} strokeLinecap="round" />
      <g transform={`translate(${jx} ${jy}) rotate(${(Math.atan2(h - 180, w - 160) * 180) / Math.PI})`}>
        <path d="M -40 -6 L 30 -6 Q 46 0 30 6 L -40 6 Z M -10 -6 L -26 -30 L -14 -30 L 6 -6 Z M -10 6 L -26 26 L -14 26 L 6 6 Z" fill="#f6efdf" stroke={O} strokeWidth={3} />
      </g>
      <text x={x + 90} y={y + 50} fontFamily={hudFont} fontWeight={900} fontSize={30} fill={GOLD}>
        {label}
      </text>
      <text x={x + w - 70} y={y + h - 24} textAnchor="end" fontFamily={hudFont} fontWeight={900} fontSize={26} fill="#7f8db0">
        DISTANCE →
      </text>
      <text x={x + 30} y={y + 70} fontFamily={hudFont} fontWeight={900} fontSize={22} fill="#7f8db0" transform={`rotate(-90 ${x + 30} ${y + 70})`} textAnchor="end">
        ALTITUDE
      </text>
    </svg>
  );
};

/** Simple route map: dashed line between two labeled points with a plane icon. */
export const RouteMap: React.FC<{ p: number; from: string; to: string; divert?: string; dp?: number }> = ({ p, from, to, divert, dp = 0 }) => {
  const A = [360, 640];
  const B = [1560, 420];
  const C = [1020, 300];
  const px = A[0] + (B[0] - A[0]) * p;
  const py = A[1] + (B[1] - A[1]) * p;
  const cx = px + (C[0] - px) * dp;
  const cy = py + (C[1] - py) * dp;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <rect x={180} y={140} width={1560} height={640} rx={24} fill="#1c3a2c" stroke="#0b0a0c" strokeWidth={6} />
      {new Array(9).fill(0).map((_, i) => (
        <path key={i} d={`M ${200 + i * 170} 160 q 80 ${200 + (i % 3) * 60} 20 ${600}`} stroke="#2a5040" strokeWidth={3} fill="none" />
      ))}
      <ellipse cx={1200} cy={560} rx={160} ry={90} fill="#2a5a8a" opacity={0.8} />
      <line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke="#f6efdf" strokeWidth={4} strokeDasharray="16 14" />
      {[
        [A, from],
        [B, to],
      ].map(([pt, n], i) => (
        <g key={i}>
          <circle cx={(pt as number[])[0]} cy={(pt as number[])[1]} r={14} fill={GOLD} stroke={O} strokeWidth={4} />
          <text x={(pt as number[])[0]} y={(pt as number[])[1] + 52} textAnchor="middle" fontFamily={hudFont} fontWeight={900} fontSize={34} fill="#f6efdf">
            {n as string}
          </text>
        </g>
      ))}
      {divert && (
        <g opacity={dp > 0 ? 1 : 0.35}>
          <circle cx={C[0]} cy={C[1]} r={14} fill={RED} stroke={O} strokeWidth={4} />
          <text x={C[0]} y={C[1] - 30} textAnchor="middle" fontFamily={hudFont} fontWeight={900} fontSize={34} fill={RED}>
            {divert}
          </text>
          {dp > 0 && <line x1={px} y1={py} x2={cx} y2={cy} stroke={RED} strokeWidth={5} strokeDasharray="10 8" />}
        </g>
      )}
      <g transform={`translate(${dp > 0 ? cx : px} ${dp > 0 ? cy : py}) rotate(${dp > 0 ? -60 : -10})`}>
        <path d="M -28 -5 L 22 -5 Q 34 0 22 5 L -28 5 Z M -8 -5 L -20 -24 L -10 -24 L 4 -5 Z M -8 5 L -20 24 L -10 24 L 4 5 Z" fill="#f6efdf" stroke={O} strokeWidth={3} />
      </g>
    </svg>
  );
};

/** Big animated statistic. */
export const BigStat: React.FC<{ value: number; suffix?: string; prefix?: string; label: string; start: number; dur?: number; color?: string; y?: number; decimals?: number }> = ({ value, suffix = "", prefix = "", label, start, dur = 40, color = GOLD, y = 300, decimals = 0 }) => {
  const f = useCurrentFrame();
  if (f < start) return null;
  const v = value * ease(f, start, start + dur);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", transform: `scale(${pop(f, start)})` }}>
      <div style={{ fontFamily: hudFont, fontWeight: 900, fontSize: 200, color, textShadow: `0 0 40px ${color}88, 0 8px 0 #000`, lineHeight: 1 }}>
        {prefix}
        {v.toFixed(decimals)}
        {suffix}
      </div>
      <div style={{ fontFamily: hudFont, fontWeight: 900, fontSize: 44, color: "#f6efdf", textShadow: "0 4px 0 #000", marginTop: 10 }}>{label}</div>
    </div>
  );
};

/** Hours-awake clock HUD. */
export const AwakeClock: React.FC<{ hours: number; x?: number; y?: number; start?: number; label?: string }> = ({ hours, x = 1440, y = 50, start = 0, label = "HOURS AWAKE" }) => {
  const f = useCurrentFrame();
  if (f < start) return null;
  const col = hours > 60 ? RED : hours > 30 ? GOLD : ICE;
  return (
    <div style={{ ...box, left: x, top: y, width: 440, height: 150, opacity: ease(f, start, start + 10), display: "flex", alignItems: "center" }}>
      <svg width={130} height={130} style={{ marginLeft: 12 }}>
        <circle cx={65} cy={65} r={50} fill="none" stroke="#3a3346" strokeWidth={10} />
        <circle cx={65} cy={65} r={50} fill="none" stroke={col} strokeWidth={10} pathLength={1} strokeDasharray={`${(hours % 24) / 24} 1`} transform="rotate(-90 65 65)" strokeLinecap="round" />
        <line x1={65} y1={65} x2={65 + Math.sin((hours / 12) * Math.PI * 2) * 32} y2={65 - Math.cos((hours / 12) * Math.PI * 2) * 32} stroke="#f6efdf" strokeWidth={6} strokeLinecap="round" />
        <circle cx={65} cy={65} r={6} fill="#f6efdf" />
      </svg>
      <div style={{ flex: 1, textAlign: "center" }}>
        <div style={lbl}>{label}</div>
        <div style={{ fontFamily: hudFont, fontWeight: 900, fontSize: 72, color: col, textShadow: `0 0 18px ${col}88` }}>{Math.floor(hours)}</div>
      </div>
    </div>
  );
};

/** Sleep-pressure balloon (adenosine) that inflates with p 0..1. */
export const PressureBalloon: React.FC<{ p: number; x?: number; y?: number; label?: string }> = ({ p, x = 1450, y = 520, label = "SLEEP PRESSURE" }) => {
  const f = useCurrentFrame();
  const r = 60 + p * 150;
  const wob = Math.sin(f / 4) * p * 4;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d={`M ${x} ${y + r} Q ${x + 20} ${y + r + 80} ${x} ${y + r + 160}`} stroke="#e9e2d4" strokeWidth={4} fill="none" />
      <ellipse cx={x + wob} cy={y} rx={r} ry={r * 1.12} fill={p > 0.75 ? RED : p > 0.4 ? GOLD : ICE} stroke={O} strokeWidth={6} />
      <ellipse cx={x - r * 0.35} cy={y - r * 0.4} rx={r * 0.18} ry={r * 0.3} fill="#fff" opacity={0.4} />
      <text x={x} y={y + 14} textAnchor="middle" fontFamily={hudFont} fontWeight={900} fontSize={30 + p * 16} fill={O}>
        ADENOSINE
      </text>
      <text x={x} y={y + r + 200} textAnchor="middle" fontFamily={hudFont} fontWeight={900} fontSize={30} fill="#f6efdf">
        {label}
      </text>
    </svg>
  );
};

/** Gauge comparing tiredness with blood alcohol. */
export const BacGauge: React.FC<{ v: number; x?: number; y?: number; start?: number }> = ({ v, x = 1500, y = 520, start = 0 }) => {
  const f = useCurrentFrame();
  if (f < start) return null;
  const a = -120 + Math.min(1, v / 0.1) * 240;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: ease(f, start, start + 10) }}>
      <circle cx={x} cy={y} r={190} fill="rgba(14,12,12,0.88)" />
      {new Array(11).fill(0).map((_, i) => {
        const aa = ((-120 + i * 24) * Math.PI) / 180;
        return <line key={i} x1={x + Math.sin(aa) * 140} y1={y - Math.cos(aa) * 140} x2={x + Math.sin(aa) * 165} y2={y - Math.cos(aa) * 165} stroke={i > 4 ? RED : "#e9e2d4"} strokeWidth={6} />;
      })}
      <line x1={x} y1={y} x2={x + Math.sin((a * Math.PI) / 180) * 130} y2={y - Math.cos((a * Math.PI) / 180) * 130} stroke={GOLD} strokeWidth={10} strokeLinecap="round" />
      <circle cx={x} cy={y} r={14} fill={GOLD} />
      <text x={x} y={y + 80} textAnchor="middle" fontFamily={hudFont} fontWeight={900} fontSize={54} fill={v >= 0.05 ? RED : "#f6efdf"}>
        ≈ {v.toFixed(2)}%
      </text>
      <text x={x} y={y + 125} textAnchor="middle" fontFamily={hudFont} fontWeight={900} fontSize={24} fill="#e9e2d4">
        BLOOD ALCOHOL EQUIVALENT
      </text>
    </svg>
  );
};

/** Brain with waste particles; `clean` 0..1 flushes them out; `trash` adds more. */
export const Brain: React.FC<{ x?: number; y?: number; s?: number; clean?: number; trash?: number; highlight?: "thalamus" | "half" | null; label?: string }> = ({ x = 1400, y = 420, s = 1, clean = 0, trash = 0.5, highlight = null, label }) => {
  const f = useCurrentFrame();
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M -200 20 Q -230 -120 -110 -170 Q -40 -230 40 -190 Q 160 -210 210 -100 Q 260 20 170 90 Q 120 160 20 140 Q -60 170 -130 120 Q -210 100 -200 20 Z" fill="#f2a0b0" stroke={O} strokeWidth={8} />
        {highlight === "half" && <path d="M 0 -200 Q 160 -210 210 -100 Q 260 20 170 90 Q 120 160 20 140 L 0 140 Z" fill="#7a8aa8" opacity={0.75} />}
        {[
          "M -150 -60 Q -100 -120 -40 -80",
          "M -160 30 Q -80 -10 -20 40",
          "M 20 -150 Q 60 -80 140 -110",
          "M 40 -40 Q 100 0 180 -30",
          "M -60 90 Q 20 60 100 100",
          "M -110 -140 Q -60 -40 0 -60",
        ].map((d, i) => (
          <path key={i} d={d} stroke="#c96a80" strokeWidth={8} fill="none" strokeLinecap="round" />
        ))}
        {highlight === "thalamus" && <ellipse cx={10} cy={10} rx={46} ry={32} fill={RED} opacity={0.6 + 0.3 * Math.sin(f / 4)} stroke={O} strokeWidth={4} />}
        {new Array(Math.round(30 * trash)).fill(0).map((_, i) => {
          const px = -170 + random("bx" + i) * 340;
          const py = -160 + random("by" + i) * 280;
          const k = clean;
          return <circle key={i} cx={px + k * 400} cy={py + k * 200 + Math.sin(f / 6 + i) * 3} r={6 + random("br" + i) * 6} fill="#8a7a3a" opacity={(1 - k) * 0.9} />;
        })}
        {clean > 0 &&
          new Array(8).fill(0).map((_, i) => (
            <path key={i} d={`M ${-200 + ((f * 6 + i * 60) % 420)} ${-150 + i * 38} q 20 -10 40 0`} stroke="#7fe6ff" strokeWidth={5} fill="none" opacity={0.7 * clean} />
          ))}
      </g>
      {label && (
        <text x={x} y={y + 230 * s} textAnchor="middle" fontFamily={hudFont} fontWeight={900} fontSize={36} fill="#f6efdf">
          {label}
        </text>
      )}
    </svg>
  );
};

/** Calendar showing day N with flipping pages. */
export const DayCalendar: React.FC<{ day: number; x?: number; y?: number; start?: number }> = ({ day, x = 1520, y = 60, start = 0 }) => {
  const f = useCurrentFrame();
  if (f < start) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 300, transform: `scale(${pop(f, start)})` }}>
      <div style={{ background: RED, borderRadius: "16px 16px 0 0", padding: 10, textAlign: "center", fontFamily: hudFont, fontWeight: 900, fontSize: 30, color: "#fff", letterSpacing: 4 }}>DAY</div>
      <div style={{ background: "#f6efdf", borderRadius: "0 0 16px 16px", padding: "6px 0", textAlign: "center", fontFamily: hudFont, fontWeight: 900, fontSize: 110, color: O, border: "5px solid #16120f", borderTop: "none" }}>
        {Math.max(1, Math.floor(day))}
      </div>
    </div>
  );
};

/** Dolphin swimming with half-brain indicator. */
export const Dolphin: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x + Math.sin(f / 30) * 40} ${y + Math.sin(f / 15) * 12}) scale(${s})`}>
      <path d="M -160 0 Q -60 -80 100 -40 Q 170 -20 200 0 Q 170 14 110 16 Q 0 40 -110 20 L -170 50 L -150 6 L -190 -30 Z" fill="#7a9ab8" stroke={O} strokeWidth={6} />
      <path d="M -10 -58 L 20 -110 L 40 -50 Z" fill="#7a9ab8" stroke={O} strokeWidth={6} />
      <circle cx={130} cy={-12} r={6} fill={O} />
      <path d="M 20 10 L -10 46 L 40 20 Z" fill="#6a8aa8" stroke={O} strokeWidth={5} />
    </g>
  );
};

/** Frigate bird gliding. */
export const Frigate: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = useCurrentFrame();
  const w = Math.sin(f / 10) * 10;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M -220 ${-20 + w} Q -110 -60 -20 0 Q 0 -10 20 0 Q 110 -60 220 ${-20 + w} Q 120 -30 30 20 L 0 70 L -30 20 Q -120 -30 -220 ${-20 + w} Z`} fill="#1a1a22" stroke="#f6efdf" strokeWidth={3} />
      <circle cx={0} cy={-6} r={12} fill="#1a1a22" />
      <path d="M 0 -6 L 36 0 L 0 4 Z" fill="#9aa3b0" />
      <circle cx={0} cy={14} r={10} fill="#e8343f" />
    </g>
  );
};

/** Simple oxygen mask dropping from above (screen coords). */
export const OxygenMasks: React.FC<{ start: number; n?: number }> = ({ start, n = 5 }) => {
  const f = useCurrentFrame();
  if (f < start) return null;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {new Array(n).fill(0).map((_, i) => {
        const t = f - start - i * 3;
        if (t < 0) return null;
        const yy = Math.min(320, t * t * 1.2) + Math.sin(t / 4) * (t < 40 ? 8 : 3);
        const x = 260 + i * 350;
        return (
          <g key={i}>
            <line x1={x} y1={0} x2={x} y2={yy} stroke="#e9e2d4" strokeWidth={3} />
            <path d={`M ${x - 30} ${yy} Q ${x} ${yy + 50} ${x + 30} ${yy} Z`} fill="#f2c21b" stroke={O} strokeWidth={4} />
            <rect x={x - 12} y={yy + 20} width={24} height={30} rx={6} fill="#e9e2d4" stroke={O} strokeWidth={3} />
          </g>
        );
      })}
    </svg>
  );
};

/** Floating "VS" comparison of two values. */
export const Versus: React.FC<{ a: string; b: string; la: string; lb: string; start: number; colorA?: string; colorB?: string }> = ({ a, b, la, lb, start, colorA = ICE, colorB = RED }) => {
  const f = useCurrentFrame();
  if (f < start) return null;
  const p = pop(f, start);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 220, display: "flex", justifyContent: "center", gap: 60, alignItems: "center", transform: `scale(${p})` }}>
      {[
        [a, la, colorA],
        [b, lb, colorB],
      ].map(([v, l, c], i) => (
        <React.Fragment key={i}>
          {i === 1 && <div style={{ fontFamily: hudFont, fontWeight: 900, fontSize: 80, color: "#f6efdf" }}>VS</div>}
          <div style={{ ...box, position: "relative", padding: "24px 40px", textAlign: "center", minWidth: 380 }}>
            <div style={{ fontFamily: hudFont, fontWeight: 900, fontSize: 110, color: c as string, lineHeight: 1 }}>{v}</div>
            <div style={{ ...lbl, marginTop: 10 }}>{l}</div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * Math.max(0, Math.min(1, t));
export const prog = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
