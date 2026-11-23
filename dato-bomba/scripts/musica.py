# Beat trap original sintetizado (variantes por tempo/tono).
import numpy as np, soundfile as sf
from scipy.signal import lfilter
sr = 44100
import sys
# Uso: python3 scripts/musica.py <salida.wav> <bpm> <semitonos> <semilla>
OUT, bpm, semis, seed = sys.argv[1], float(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4])
TR = 2 ** (semis / 12)
rng = np.random.default_rng(seed)
def env(n, a, d):
    t = np.arange(n) / sr
    return np.minimum(t / max(a, 1e-4), 1) * np.exp(-t / d)
def lp(x, a): return lfilter([1 - a], [1, -a], x)
def hp(x, a): return x - lp(x, a)
def norm(x, p=0.9): return x / (np.abs(x).max() + 1e-9) * p

# ---------- música ----------
T = 64
beat = 60 / bpm; step = beat / 4
N = int(T * sr); mus = np.zeros(N)
def add(sig, t0, g=1.0):
    i = int(t0 * sr)
    if i >= N: return
    j = min(N, i + len(sig)); mus[i:j] += sig[: j - i] * g
def kick():
    n = int(0.45 * sr); t = np.arange(n) / sr
    f = 45 + 110 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / sr) * np.exp(-t * 7)
def snare():
    n = int(0.25 * sr); t = np.arange(n) / sr
    return (hp(rng.standard_normal(n), 0.7) * 0.8 + np.sin(2 * np.pi * 190 * t) * 0.5) * np.exp(-t * 18)
def hat(o=False):
    n = int((0.18 if o else 0.05) * sr)
    return hp(rng.standard_normal(n), 0.15) * env(n, 0.001, 0.06 if o else 0.012)
def b808(freq, dur):
    n = int(dur * sr); t = np.arange(n) / sr
    s = np.sin(2 * np.pi * freq * t); s = np.tanh(s * 2.2)
    return s * env(n, 0.005, dur * 0.7)
def pluck(freq, dur=0.3):
    n = int(dur * sr); t = np.arange(n) / sr
    s = sum(np.sign(np.sin(2 * np.pi * freq * h * t)) / h for h in (1, 2))
    return lp(s, 0.6) * env(n, 0.002, 0.12)
# progresión: Cm - Ab - Eb - Bb (2 compases cada una)
roots = [r * TR for r in [65.41, 51.91, 77.78, 58.27]]
mel = [[f * TR for f in ch] for ch in [[523.25, 622.25, 783.99, 622.25], [415.3, 523.25, 622.25, 523.25],
       [622.25, 783.99, 932.33, 783.99], [466.16, 587.33, 698.46, 587.33]]]
bars = int(T / (beat * 4))
for b in range(bars):
    t0 = b * beat * 4; ch = (b // 2) % 4; intro = b < 1
    for s in range(16):
        ts = t0 + s * step
        if not intro and s in (0, 7, 10): add(kick(), ts, 0.9)
        if not intro and s in (4, 12): add(snare(), ts, 0.55)
        if s % 2 == 0 or (b % 2 == 1 and s >= 12): add(hat(), ts, 0.25)
        if s == 14 and b % 4 == 3: add(hat(True), ts, 0.25)
        if s % 2 == 0: add(pluck(mel[ch][(s // 2) % 4]), ts, 0.16)
    if not intro:
        add(b808(roots[ch], beat * 2.5), t0, 0.5)
        add(b808(roots[ch], beat * 1.2), t0 + beat * 2.75, 0.45)
mus = np.tanh(mus * 1.3)
fade = np.ones(N); fade[-sr * 2:] = np.linspace(1, 0, sr * 2)
sf.write(OUT, norm(mus * fade, 0.8), sr)

