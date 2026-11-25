# Emotional / foley sound effects synthesized from scratch (no external samples).
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt
sr = 44100
rng = np.random.default_rng(11)
T = lambda d: np.arange(int(sr * d)) / sr
def save(name, x, g=0.85):
    x = x / (np.abs(x).max() + 1e-9) * g
    sf.write(f'public/sfx/{name}.wav', x.astype(np.float32), sr)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=sr, output='sos'), x)
def tone(freqs, t):  # freq contour -> sine
    return np.sin(2 * np.pi * np.cumsum(freqs) / sr)

# surprise: quick rising "whoop" + bright sting
t = T(0.55); f = 300 * np.exp(t * 4.2)
s = tone(f, t) * np.exp(-t * 3) * np.minimum(1, t * 40)
s += 0.5 * tone(f * 1.5, t) * np.exp(-t * 4)
save('surprise', s)
# gasp: breathy filtered noise inhale
t = T(0.45); n = bp(rng.normal(0, 1, len(t)), 900, 3500)
save('gasp', n * np.sin(np.pi * t / 0.45) ** 0.7 * (0.6 + 0.4 * t / 0.45), 0.6)
# gulp (nervous): short low "bloop" falling then rising
t = T(0.28); f = 220 - 140 * np.sin(np.pi * t / 0.28)
save('gulp', tone(f, t) * np.sin(np.pi * t / 0.28) ** 2, 0.7)
# regret: sad trombone "wah wah wah waaah"
notes = [(392, 0.32), (370, 0.32), (349, 0.32), (330, 0.9)]
out = []
for i, (fr, d) in enumerate(notes):
    t = T(d)
    vib = 1 + (0.02 * np.sin(2 * np.pi * 6 * t) if i == 3 else 0)
    ff = fr * vib * (1 - (0.06 * t / d if i == 3 else 0))
    w = sum(tone(ff * h, t) / h for h in range(1, 8))
    env = np.minimum(1, t * 30) * np.exp(-t * (1.2 if i == 3 else 3))
    w = sosfilt(butter(2, 1800, 'low', fs=sr, output='sos'), w) * env
    out.append(w)
save('regret', np.concatenate(out), 0.6)
# idea: bright 3-note chime
out = np.zeros(int(sr * 1.0))
for i, fr in enumerate([1046, 1318, 1568]):
    t = T(1.0 - i * 0.08); x = (np.sin(2 * np.pi * fr * t) + 0.3 * np.sin(2 * np.pi * fr * 2 * t)) * np.exp(-t * 4)
    out[int(i * 0.08 * sr):int(i * 0.08 * sr) + len(x)] += x
save('idea', out, 0.55)
# think: soft "hmm" wobble (low filtered tone with vibrato)
t = T(0.9); f = 180 + 8 * np.sin(2 * np.pi * 5 * t)
w = sum(tone(f * h, t) / h ** 1.5 for h in range(1, 6))
w = sosfilt(butter(2, 900, 'low', fs=sr, output='sos'), w) * np.sin(np.pi * t / 0.9) ** 1.5
save('think', w, 0.45)
# tick-tock (thinking clock)
out = np.zeros(int(sr * 1.2))
for i in range(4):
    k = bp(rng.normal(0, 1, 600), 2500 if i % 2 else 1700, 6000) * np.exp(-np.arange(600) / 60)
    out[int(i * 0.3 * sr):int(i * 0.3 * sr) + 600] += k
save('ticktock', out, 0.5)
# footstep (single soft thud + scuff)
t = T(0.18); th = tone(90 * np.exp(-t * 8), t) * np.exp(-t * 30)
sc = bp(rng.normal(0, 1, len(t)), 400, 2000) * np.exp(-t * 25) * 0.4
save('step', th + sc, 0.5)
# click (button / remote)
t = T(0.06); save('click', bp(rng.normal(0, 1, len(t)), 2000, 8000) * np.exp(-t * 120) + 0.5 * np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 80), 0.6)
# knock on glass (two taps, resonant)
out = np.zeros(int(sr * 0.5))
for i in range(2):
    t = T(0.25); x = (np.sin(2 * np.pi * 1450 * t) + 0.6 * np.sin(2 * np.pi * 2900 * t)) * np.exp(-t * 28) + bp(rng.normal(0, 1, len(t)), 1000, 5000) * np.exp(-t * 90)
    out[int(i * 0.16 * sr):int(i * 0.16 * sr) + len(t)] += x
save('knock', out, 0.6)
# glass shatter
t = T(1.1); n = rng.normal(0, 1, len(t))
sh = bp(n, 3000, 12000) * np.exp(-t * 5)
for k in range(25):
    st = rng.random() * 0.8; d = int(sr * 0.08); i0 = int(st * sr)
    tt = np.arange(d) / sr; fr = 2500 + rng.random() * 5000
    sh[i0:i0 + d] += np.sin(2 * np.pi * fr * tt) * np.exp(-tt * 60) * (1 - st)
save('shatter', sh, 0.6)
# heartbeat (nervous, 3 beats)
out = np.zeros(int(sr * 2.4))
for i in range(3):
    for off, a in ((0, 1), (0.22, 0.7)):
        t = T(0.2); x = tone(55 * (1 + 0.6 * np.exp(-t * 30)), t) * np.exp(-t * 18) * a
        i0 = int((i * 0.75 + off) * sr); out[i0:i0 + len(x)] += x
save('heartbeat', out, 0.8)
# high-five slap
t = T(0.25); save('slap', bp(rng.normal(0, 1, len(t)), 800, 6000) * np.exp(-t * 35) + tone(160 * np.exp(-t * 10), t) * np.exp(-t * 25) * 0.4, 0.7)
# riser (tension build before a reveal)
t = T(1.4); f = 200 * np.exp(t * 1.6)
r = (tone(f, t) * 0.4 + bp(rng.normal(0, 1, len(t)), 2000, 8000) * 0.3) * (t / 1.4) ** 2
save('riser', r, 0.5)
# sting (dramatic chord hit)
t = T(1.6); ch = sum(sum(np.sin(2 * np.pi * fr * h * t) / h for h in range(1, 5)) for fr in (110, 130.8, 164.8, 220))
save('sting', sosfilt(butter(2, 2500, 'low', fs=sr, output='sos'), ch) * np.exp(-t * 2.2) * np.minimum(1, t * 200), 0.7)
# sparkle (positive twinkle)
out = np.zeros(int(sr * 0.9))
for i in range(7):
    t = T(0.4); fr = 1800 + i * 260 + rng.random() * 200
    x = np.sin(2 * np.pi * fr * t) * np.exp(-t * 12)
    i0 = int(i * 0.06 * sr); out[i0:i0 + len(t)] += x
save('sparkle', out, 0.45)
# party popper
t = T(0.6); save('popper', bp(rng.normal(0, 1, len(t)), 300, 7000) * np.exp(-t * 18) + tone(120 * np.exp(-t * 6), t) * np.exp(-t * 20), 0.75)
print('ok')
