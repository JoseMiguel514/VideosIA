# Música sintetizada adicional: synthwave (GTA / Vice City) y ambiente espacial (Venus)
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, lfilter
sr = 44100; rng = np.random.default_rng(5)
def env(n, a=0.005, r=0.2):
    t = np.arange(n) / sr
    return np.minimum(t / a, 1) * np.exp(-t / r)
def saw(f, n):
    t = np.arange(n) / sr
    return sum(np.sin(2 * np.pi * f * h * t) / h for h in range(1, 14))
def lp(x, fc): return sosfilt(butter(2, fc, 'low', fs=sr, output='sos'), x)
def hp(x, fc): return sosfilt(butter(2, fc, 'high', fs=sr, output='sos'), x)

# ---- synthwave 100 bpm, Am - F - C - G ----
T = 64; N = int(sr * T); mix = np.zeros(N); b = 60 / 100
def add(x, t0, g=1.0):
    i = int(t0 * sr); e = min(N, i + len(x)); mix[i:e] += x[:e - i] * g
chords = [[220, 261.6, 329.6], [174.6, 220, 261.6], [261.6, 329.6, 392], [196, 246.9, 293.7]]
bass = [55, 43.65, 65.4, 49]
for bar in range(int(T / (4 * b))):
    t0 = bar * 4 * b; ch = chords[bar % 4]
    n = int(sr * 4 * b)
    pad = sum(saw(f * d, n) for f in ch for d in (0.997, 1.003)) * np.minimum(np.arange(n) / sr / 0.3, 1)
    add(lp(pad, 1800) * 0.05, t0)
    for k in range(8):  # eighth-note bass
        nn = int(sr * b / 2)
        add(lp(saw(bass[bar % 4] * (2 if k % 2 else 1), nn), 600) * env(nn, 0.003, 0.15) * 0.18, t0 + k * b / 2)
    for k in range(4):  # drums
        nk = int(sr * 0.4); tt = np.arange(nk) / sr
        if k in (0, 2):
            kick = np.sin(2 * np.pi * np.cumsum(50 + 120 * np.exp(-tt * 30)) / sr) * np.exp(-tt * 8)
            add(kick * 0.9, t0 + k * b)
        else:
            sn = hp(rng.normal(0, 1, nk), 1500) * np.exp(-tt * 14) * 0.35 + np.sin(2 * np.pi * 190 * tt) * np.exp(-tt * 20) * 0.3
            add(lfilter([1], [1, -0.3], sn), t0 + k * b)  # gated-ish snare
        for h in range(2):
            nh = int(sr * 0.08); th = np.arange(nh) / sr
            add(hp(rng.normal(0, 1, nh), 7000) * np.exp(-th * 60) * 0.12, t0 + k * b + h * b / 2)
    # arpeggio lead
    for k in range(16):
        f = ch[k % 3] * 2 * (2 if k % 8 > 5 else 1)
        nn = int(sr * b / 4)
        add(lp(saw(f, nn), 3500) * env(nn, 0.002, 0.08) * 0.05, t0 + k * b / 4)
mix = np.tanh(mix * 1.5) * 0.8
tt = np.arange(N) / sr
mix *= np.clip(tt / 1.0, 0, 1) * np.clip((T - tt) / 2, 0, 1)
sf.write('public/musica_gta.wav', np.stack([mix, np.roll(mix, 300)], 1), sr)

# ---- space ambient ----
T = 64; N = int(sr * T); tt = np.arange(N) / sr; amb = np.zeros(N)
for f, ph in [(110, 0), (164.8, 1), (220, 2), (277.2, 3), (329.6, 4)]:
    lfo = 0.5 + 0.5 * np.sin(2 * np.pi * (0.03 + ph * 0.011) * tt + ph)
    amb += (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * f * 2.003 * tt)) * lfo
amb += lp(rng.normal(0, 1, N), 400) * 0.6 * (0.5 + 0.5 * np.sin(2 * np.pi * 0.05 * tt))
for k in range(0, T, 2):  # twinkles
    for j in range(2):
        nn = int(sr * 1.5); f = rng.choice([880, 987.8, 1318.5, 1480, 1760])
        x = np.sin(2 * np.pi * f * np.arange(nn) / sr) * env(nn, 0.01, 0.5) * 0.25
        i = int((k + rng.random() * 2) * sr); e = min(N, i + nn); amb[i:e] += x[:e - i]
# slow pulse
for k in np.arange(0, T, 60 / 70 * 2):
    nn = int(sr * 0.8); x = np.arange(nn) / sr
    i = int(k * sr); e = min(N, i + nn); amb[i:e] += (np.sin(2 * np.pi * np.cumsum(45 + 40 * np.exp(-x * 20)) / sr) * np.exp(-x * 5) * 0.5)[:e - i]
amb = amb / np.abs(amb).max() * 0.8
amb *= np.clip(tt / 2, 0, 1) * np.clip((T - tt) / 2, 0, 1)
sf.write('public/musica_espacio.wav', np.stack([amb, np.roll(amb, 500)], 1), sr)

def save(name, x): sf.write(f'public/sfx/{name}.wav', x / np.abs(x).max() * 0.8, sr)
# sirena policía
n = int(sr * 1.6); t = np.arange(n) / sr
f = 700 + 400 * (np.sin(2 * np.pi * 1.5 * t) > 0)
save('sirena', np.sin(2 * np.pi * np.cumsum(f) / sr) * np.minimum(t / 0.1, 1) * np.minimum((1.6 - t) / 0.2, 1))
# tecleo
n = int(sr * 1.2); x = np.zeros(n)
for k in range(14):
    i = int(rng.random() * (n - 2000)); x[i:i + 800] += hp(rng.normal(0, 1, 800), 2500) * np.exp(-np.arange(800) / sr * 120)
save('teclas', x)
# glitch / alerta
n = int(sr * 0.5); t = np.arange(n) / sr
save('glitch', np.sign(np.sin(2 * np.pi * (300 + 900 * (np.floor(t * 30) % 3)) * t)) * 0.4 * np.exp(-t * 4))
# ding / notificación
n = int(sr * 0.8); t = np.arange(n) / sr
save('ding', (np.sin(2 * np.pi * 1318 * t) + 0.5 * np.sin(2 * np.pi * 1976 * t)) * np.exp(-t * 5))
# whoosh espacial (reusa whoosh) + burbujeo ácido
n = int(sr * 1.2); x = np.zeros(n)
for k in range(25):
    i = int(rng.random() * (n - 4000)); fb = 300 + rng.random() * 900; tb = np.arange(3000) / sr
    x[i:i + 3000] += np.sin(2 * np.pi * np.cumsum(fb * (1 + tb * 8)) / sr) * np.exp(-tb * 30)
save('burbujas', x)
print('ok')
