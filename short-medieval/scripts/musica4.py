# Música "micro-mundo" (tardígrado) + efectos: golpe, cristal, boing, hielo, zoom, aterrizaje
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt
sr = 44100; rng = np.random.default_rng(23)
def lp(x, fc): return sosfilt(butter(2, fc, 'low', fs=sr, output='sos'), x)
def hp(x, fc): return sosfilt(butter(2, fc, 'high', fs=sr, output='sos'), x)
def bp(x, a, b): return sosfilt(butter(2, [a, b], 'band', fs=sr, output='sos'), x)
NOTE = lambda m: 440 * 2 ** ((m - 69) / 12)
def env(n, a=0.005, r=0.2):
    t = np.arange(n) / sr; return np.minimum(t / a, 1) * np.exp(-t / r)

# ---- música curiosa: pizzicato + glockenspiel + pad suave, 104 bpm, Dm - Bb - F - C ----
T = 64; N = int(sr * T); mix = np.zeros(N); b = 60 / 104
def add(x, t0, g=1.0):
    i = int(t0 * sr)
    if i >= N: return
    e = min(N, i + len(x)); mix[i:e] += x[:e - i] * g
prog = [[50, 53, 57], [46, 50, 53], [53, 57, 60], [48, 52, 55]]
glock = [74, 77, 81, 79, 77, 74, 72, 74, 77, 81, 84, 81, 79, 77, 76, 72]
tt = np.arange(N) / sr
for bar in range(int(T / (4 * b))):
    t0 = bar * 4 * b; ch = prog[bar % 4]; n = int(sr * 4 * b)
    t = np.arange(n) / sr
    pad = sum(np.sin(2 * np.pi * NOTE(m) * t * d) for m in ch for d in (0.998, 1.002)) * np.minimum(t / 0.6, 1) * np.minimum((4 * b - t) / 0.4, 1)
    add(lp(pad, 1200) * 0.035, t0)
    for k in range(8):  # pizzicato bass/arp
        nn = int(sr * 0.35); m = ch[[0, 2, 1, 2][k % 4]] - (12 if k % 4 == 0 else 0)
        x = sum(np.sin(2 * np.pi * NOTE(m) * h * np.arange(nn) / sr) / h for h in (1, 2, 3))
        add(x * env(nn, 0.002, 0.09) * 0.16, t0 + k * b / 2)
    if bar >= 1:
        for k in range(4):  # glockenspiel melody
            nn = int(sr * 1.0); f = NOTE(glock[(bar * 4 + k) % 16])
            x = np.sin(2 * np.pi * f * np.arange(nn) / sr) + 0.35 * np.sin(2 * np.pi * f * 2.76 * np.arange(nn) / sr)
            add(x * env(nn, 0.001, 0.35) * 0.07, t0 + k * b)
    for k in range(4):  # soft percussion
        nk = int(sr * 0.25); tk = np.arange(nk) / sr
        if k % 2 == 0: add(np.sin(2 * np.pi * np.cumsum(55 + 90 * np.exp(-tk * 35)) / sr) * np.exp(-tk * 10) * 0.35, t0 + k * b)
        else: add(bp(rng.normal(0, 1, nk), 1200, 5000) * np.exp(-tk * 25) * 0.12, t0 + k * b)
        add(hp(rng.normal(0, 1, int(sr * 0.03)), 8000) * 0.05, t0 + k * b + b / 2)
mix = np.tanh(mix * 1.4); mix = mix / np.abs(mix).max() * 0.75
mix *= np.clip(tt / 0.6, 0, 1) * np.clip((T - tt) / 2, 0, 1)
sf.write('public/musica_micro.wav', np.stack([mix, np.roll(mix, 300)], 1), sr)

def save(name, x): sf.write(f'public/sfx/{name}.wav', x / np.abs(x).max() * 0.85, sr)
n = int(sr * 0.7); t = np.arange(n) / sr   # golpe seco y pesado
save('golpe', np.sin(2 * np.pi * np.cumsum(45 + 160 * np.exp(-t * 25)) / sr) * np.exp(-t * 6) + hp(rng.normal(0, 1, n), 2000) * np.exp(-t * 45) * 0.9 + bp(rng.normal(0, 1, n), 300, 1200) * np.exp(-t * 14) * 0.5)
n = int(sr * 1.4); t = np.arange(n) / sr; x = np.zeros(n)   # cristal que se agrieta
for k in range(30):
    i = int((rng.random() ** 2) * (n - 3000)); f = 2500 + rng.random() * 5000; m = np.arange(3000) / sr
    x[i:i + 3000] += np.sin(2 * np.pi * f * m) * np.exp(-m * (40 + rng.random() * 60)) * (0.3 + rng.random())
x += hp(rng.normal(0, 1, n), 3000) * np.exp(-t * 8) * 0.4
save('cristal', x)
n = int(sr * 0.6); t = np.arange(n) / sr   # boing (reacción)
save('boing', np.sin(2 * np.pi * np.cumsum(220 + 180 * np.sin(2 * np.pi * 9 * t) * np.exp(-t * 3)) / sr) * np.exp(-t * 4))
n = int(sr * 1.2); t = np.arange(n) / sr; x = np.zeros(n)   # hielo crujiendo
for k in range(50):
    i = int(rng.random() * (n - 800)); x[i:i + 800] += hp(rng.normal(0, 1, 800), 4000) * np.exp(-np.arange(800) / sr * 200) * rng.random()
save('hielo', x + np.sin(2 * np.pi * 3200 * t) * np.exp(-t * 6) * 0.15)
n = int(sr * 0.45); t = np.arange(n) / sr   # zoom (crash zoom)
save('zoom', bp(rng.normal(0, 1, n), 600, 6000) * (t / 0.45) ** 1.5 * np.minimum((0.45 - t) / 0.03, 1) + np.sin(2 * np.pi * np.cumsum(300 + 1500 * (t / 0.45) ** 2) / sr) * (t / 0.45) * 0.25)
n = int(sr * 1.5); t = np.arange(n) / sr   # choque / aterrizaje forzoso
save('choque', np.sin(2 * np.pi * np.cumsum(35 + 80 * np.exp(-t * 8)) / sr) * np.exp(-t * 3) + lp(rng.normal(0, 1, n), 1500) * np.exp(-t * 4) * 0.9)
print('ok')
