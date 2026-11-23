# Música ambiental original: pad + piano arpegiado + beat suave. Uso: python3 scripts/musica_ambient.py salida.wav segundos
import sys, numpy as np, soundfile as sf
from scipy.signal import lfilter
OUT, T = sys.argv[1], float(sys.argv[2]); TR = 2 ** (int(sys.argv[3]) / 12) if len(sys.argv) > 3 else 1.0; sr = 44100; N = int(T * sr); t = np.arange(N) / sr
rng = np.random.default_rng(12)
mix = np.zeros(N)
def lp(x, a): return lfilter([1 - a], [1, -a], x)
def add(sig, t0, g=1.0):
    i = int(t0 * sr)
    if i >= N: return
    j = min(N, i + len(sig)); mix[i:j] += sig[: j - i] * g
bpm = 84; beat = 60 / bpm; bar = beat * 4
# progresión Am - F - C - G (2 compases cada uno)
prog = [[f * TR for f in ch] for ch in [[220.0, 261.63, 329.63], [174.61, 220.0, 261.63], [261.63, 329.63, 392.0], [196.0, 246.94, 293.66]]]
# pad
pad = np.zeros(N)
for b in range(int(T / bar) + 1):
    ch = prog[(b // 2) % 4]; t0 = b * bar
    n = int(bar * 1.3 * sr); tt = np.arange(n) / sr
    env = np.minimum(tt / 0.8, 1) * np.minimum(1, (bar * 1.3 - tt) / 0.6)
    s = sum(np.sin(2 * np.pi * f / 2 * tt * (1 + d)) for f in ch for d in (-0.002, 0.002))
    i = int(t0 * sr); j = min(N, i + n); pad[i:j] += (s * env)[: j - i]
mix += lp(pad, 0.85) * 0.18
# piano arpegiado
def piano(f, d=1.6):
    n = int(d * sr); tt = np.arange(n) / sr
    s = sum(np.sin(2 * np.pi * f * h * tt) * (0.6 ** h) for h in range(1, 6))
    return s * np.exp(-tt * 2.6) * np.minimum(tt / 0.005, 1)
for b in range(int(T / bar) + 1):
    ch = prog[(b // 2) % 4]
    notes = [ch[0] * 2, ch[1] * 2, ch[2] * 2, ch[1] * 2, ch[0] * 4, ch[2] * 2, ch[1] * 2, ch[2] * 2]
    for k, f in enumerate(notes):
        add(piano(f), b * bar + k * beat / 2, 0.07 + 0.02 * (k == 0))
# beat suave (entra a los 8 s)
def kick():
    n = int(0.35 * sr); tt = np.arange(n) / sr
    return np.sin(2 * np.pi * np.cumsum(50 + 70 * np.exp(-tt * 25)) / sr) * np.exp(-tt * 9)
def hat():
    n = int(0.04 * sr); return (rng.standard_normal(n) - lp(rng.standard_normal(n), 0.2)) * np.exp(-np.arange(n) / sr * 120)
def snap():
    n = int(0.15 * sr); tt = np.arange(n) / sr; return rng.standard_normal(n) * np.exp(-tt * 30) * 0.6
for b in range(int(T / bar) + 1):
    t0 = b * bar
    if t0 < 8: continue
    for s in range(8):
        ts = t0 + s * beat / 2
        if s in (0, 5): add(kick(), ts, 0.35)
        if s in (2, 6): add(lp(snap(), 0.5), ts, 0.18)
        add(hat(), ts, 0.05)
mix = np.tanh(mix * 1.4)
fade = np.ones(N); fade[: sr * 3] = np.linspace(0, 1, sr * 3); fade[-sr * 4 :] = np.linspace(1, 0, sr * 4)
sf.write(OUT, mix * fade / (np.abs(mix).max() + 1e-9) * 0.8, sr)
print('ok')
