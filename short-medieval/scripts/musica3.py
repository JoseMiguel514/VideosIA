# Música y efectos para: camarón pistola (submarina), plaga del baile (danza medieval), Torre Eiffel (jazz de estafa)
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt
sr = 44100; rng = np.random.default_rng(11)
def lp(x, fc): return sosfilt(butter(2, fc, 'low', fs=sr, output='sos'), x)
def hp(x, fc): return sosfilt(butter(2, fc, 'high', fs=sr, output='sos'), x)
def bp(x, a, b): return sosfilt(butter(2, [a, b], 'band', fs=sr, output='sos'), x)
def env(n, a=0.005, r=0.2):
    t = np.arange(n) / sr
    return np.minimum(t / a, 1) * np.exp(-t / r)
def tone(f, n, harm=(1,), amps=None):
    t = np.arange(n) / sr; amps = amps or [1 / (k + 1) for k in range(len(harm))]
    return sum(a * np.sin(2 * np.pi * f * h * t) for h, a in zip(harm, amps))
def track(T):
    N = int(sr * T); mix = np.zeros(N)
    def add(x, t0, g=1.0):
        i = int(t0 * sr)
        if i >= N: return
        e = min(N, i + len(x)); mix[i:e] += x[:e - i] * g
    return mix, add
def kick(n=0.35):
    nk = int(sr * n); tt = np.arange(nk) / sr
    return np.sin(2 * np.pi * np.cumsum(48 + 110 * np.exp(-tt * 30)) / sr) * np.exp(-tt * 9)
def hat(n=0.06, fc=7000):
    nh = int(sr * n); return hp(rng.normal(0, 1, nh), fc) * np.exp(-np.arange(nh) / sr * 70)
def finish(mix, T, name, norm=0.8):
    tt = np.arange(len(mix)) / sr
    mix = np.tanh(mix * 1.3); mix = mix / np.abs(mix).max() * norm
    mix *= np.clip(tt / 0.6, 0, 1) * np.clip((T - tt) / 2, 0, 1)
    sf.write(f'public/{name}.wav', np.stack([mix, np.roll(mix, 350)], 1), sr)
NOTE = lambda m: 440 * 2 ** ((m - 69) / 12)

# ---------- 1) submarina juguetona, 112 bpm, marimba + pizzicato ----------
T = 64; mix, add = track(T); b = 60 / 112
prog = [[57, 60, 64], [53, 57, 60], [55, 59, 62], [52, 55, 59]]  # Am F G Em
mel = [69, 72, 76, 72, 74, 71, 67, 71, 69, 72, 77, 76, 74, 72, 71, 67]
for bar in range(int(T / (4 * b))):
    t0 = bar * 4 * b; ch = prog[bar % 4]
    for k in range(8):  # marimba arpeggio
        n = int(sr * 0.5); f = NOTE(ch[k % 3] + (12 if k >= 4 else 0))
        add(tone(f, n, (1, 4, 10), [1, 0.25, 0.05]) * env(n, 0.002, 0.12) * 0.16, t0 + k * b / 2)
    n = int(sr * b * 0.9)  # pizzicato bass
    for k in (0, 2, 3):
        add(lp(tone(NOTE(ch[0] - 24 + (7 if k == 3 else 0)), n, (1, 2, 3)), 700) * env(n, 0.004, 0.18) * 0.35, t0 + k * b)
    if bar % 2 == 1:  # lead melody (soft flute-ish)
        for k in range(4):
            n = int(sr * b * 0.95); f = NOTE(mel[(bar * 4 + k) % 16])
            vib = np.sin(2 * np.pi * 5 * np.arange(n) / sr) * 0.004
            add(np.sin(2 * np.pi * np.cumsum(f * (1 + vib)) / sr) * np.minimum(np.arange(n) / sr / 0.05, 1) * np.exp(-np.arange(n) / sr * 2) * 0.09, t0 + k * b)
    for k in range(4):
        add(kick(0.25) * 0.35, t0 + k * b) if k % 2 == 0 else add(hat(0.05, 5000) * 0.25, t0 + k * b)
        add(hat(0.03, 8000) * 0.1, t0 + k * b + b / 2)
for k in range(60):  # bubbles
    nb = int(sr * 0.08); tb = np.arange(nb) / sr; fb = 400 + rng.random() * 900
    add(np.sin(2 * np.pi * np.cumsum(fb * (1 + tb * 12)) / sr) * np.exp(-tb * 40) * 0.08, rng.random() * T)
finish(mix, T, 'musica_mar', 0.75)

# ---------- 2) danza medieval inquietante, 138 bpm, tambor + gaita + zanfona ----------
T = 64; mix, add = track(T); b = 60 / 138
tt = np.arange(len(mix)) / sr
drone = (np.sign(np.sin(2 * np.pi * NOTE(38) * tt)) * 0.3 + np.sin(2 * np.pi * NOTE(45) * tt)) * (0.85 + 0.15 * np.sin(2 * np.pi * 0.2 * tt))
mix += lp(drone, 900) * 0.12
tune = [62, 64, 65, 67, 69, 67, 65, 64, 62, 65, 64, 62, 61, 62, 64, 61]  # D dórico/menor con 61 (sensible)
for bar in range(int(T / (4 * b))):
    t0 = bar * 4 * b
    for k, (pos, g) in enumerate([(0, 1), (1.5, 0.6), (2, 0.9), (3, 0.6), (3.5, 0.5)]):  # tabor
        nk = int(sr * 0.25); tk = np.arange(nk) / sr
        d = np.sin(2 * np.pi * np.cumsum(90 + 80 * np.exp(-tk * 40)) / sr) * np.exp(-tk * 14) + bp(rng.normal(0, 1, nk), 600, 3000) * np.exp(-tk * 30) * 0.4
        add(d * 0.45 * g, t0 + pos * b)
    for k in range(4):  # tambourine
        add(bp(rng.normal(0, 1, int(sr * 0.12)), 5000, 11000) * env(int(sr * 0.12), 0.001, 0.04) * 0.15, t0 + k * b + b / 2)
    if bar >= 2:
        for k in range(8):  # reedy pipe (odd harmonics), eighth notes
            n = int(sr * b / 2 * 0.95); f = NOTE(tune[(bar * 8 + k) % 16] + 12)
            x = tone(f, n, (1, 3, 5, 7), [1, 0.5, 0.3, 0.15]) * np.minimum(np.arange(n) / sr / 0.01, 1) * np.exp(-np.arange(n) / sr * 3)
            add(lp(x, 4000) * 0.08, t0 + k * b / 2)
finish(mix, T, 'musica_baile', 0.75)

# ---------- 3) jazz de estafa (sneaky), 116 bpm swing ----------
T = 64; mix, add = track(T); b = 60 / 116; sw = 0.62
walk = [45, 48, 50, 51, 52, 50, 48, 47, 45, 43, 41, 43, 44, 45, 47, 48]
stabs = [[57, 60, 64, 67], [53, 57, 60, 64], [52, 56, 59, 62], [57, 60, 64, 67]]
for bar in range(int(T / (4 * b))):
    t0 = bar * 4 * b
    for k in range(4):  # walking pizz bass
        n = int(sr * b); f = NOTE(walk[(bar * 4 + k) % 16] - 12)
        add(lp(tone(f, n, (1, 2, 3, 4), [1, 0.5, 0.25, 0.1]), 900) * env(n, 0.005, 0.25) * 0.4, t0 + k * b)
        add(hat(0.09, 6000) * 0.13, t0 + k * b + b * sw)  # ride swing
        add(hat(0.12, 4500) * 0.16, t0 + k * b)
        if k in (1, 3):  # brush snare
            add(bp(rng.normal(0, 1, int(sr * 0.2)), 1500, 6000) * env(int(sr * 0.2), 0.01, 0.07) * 0.18, t0 + k * b)
    ch = stabs[bar % 4]  # vibraphone stabs on the "and"
    for pos in ((1 + sw), (3 + sw)) if bar % 2 == 0 else ((2 + sw),):
        n = int(sr * 0.9); tv = np.arange(n) / sr
        v = sum(np.sin(2 * np.pi * NOTE(m + 12) * tv) + 0.2 * np.sin(2 * np.pi * NOTE(m + 12) * 4 * tv) for m in ch)
        add(v * np.exp(-tv * 3) * (1 + 0.3 * np.sin(2 * np.pi * 6 * tv)) * 0.04, t0 + pos * b)
    if bar % 4 == 3:  # sneaky muted-trumpet-ish lick
        for k, m in enumerate([69, 67, 64, 63, 60]):
            n = int(sr * b * 0.45); f = NOTE(m)
            x = bp(tone(f, n, (1, 2, 3, 4, 5), [1, 0.8, 0.6, 0.4, 0.3]), 600, 2500) * np.minimum(np.arange(n) / sr / 0.03, 1) * np.exp(-np.arange(n) / sr * 4)
            add(x * 0.12, t0 + k * b * 0.5)
finish(mix, T, 'musica_estafa', 0.75)

# ---------- SFX ----------
def save(name, x): sf.write(f'public/sfx/{name}.wav', x / np.abs(x).max() * 0.85, sr)
n = int(sr * 0.5); t = np.arange(n) / sr  # snap / chasquido del camarón
save('snap', hp(rng.normal(0, 1, n), 1500) * np.exp(-t * 60) + np.sin(2 * np.pi * np.cumsum(60 + 400 * np.exp(-t * 50)) / sr) * np.exp(-t * 12) * 0.8)
n = int(sr * 2.0); t = np.arange(n) / sr  # sonar ping
save('sonar', np.sin(2 * np.pi * 1450 * t) * np.exp(-t * 2.5) * np.minimum(t / 0.005, 1) + 0.3 * np.roll(np.sin(2 * np.pi * 1450 * t) * np.exp(-t * 3), int(sr * 0.6)))
n = int(sr * 1.0); t = np.arange(n) / sr  # caja registradora
x = hp(rng.normal(0, 1, n), 3000) * np.exp(-t * 40) * 0.5
for d, f in ((0.12, 2093), (0.12, 2637)):
    i = int(sr * d); x[i:] += (np.sin(2 * np.pi * f * t[:n - i]) + 0.4 * np.sin(2 * np.pi * f * 2.7 * t[:n - i])) * np.exp(-t[:n - i] * 4) * 0.5
save('caja', x)
n = int(sr * 1.4); t = np.arange(n) / sr  # risa malvada corta -> "riser" de tensión
save('riser', hp(rng.normal(0, 1, n), 800) * (t / 1.4) ** 2 * 0.6 + np.sin(2 * np.pi * np.cumsum(200 + 600 * (t / 1.4) ** 2) / sr) * (t / 1.4) ** 2 * 0.5)
n = int(sr * 0.6); t = np.arange(n) / sr  # golpe de tambor grave
save('tambor', np.sin(2 * np.pi * np.cumsum(70 + 90 * np.exp(-t * 30)) / sr) * np.exp(-t * 7) + bp(rng.normal(0, 1, n), 200, 1500) * np.exp(-t * 25) * 0.4)
print('ok')
