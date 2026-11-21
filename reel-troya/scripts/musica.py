# Synthesized epic background: string-like pad in D minor + timpani pulse
import numpy as np, soundfile as sf
sr = 44100; T = 60
t = np.arange(int(sr*T))/sr
rng = np.random.default_rng(7)
def saw(f, ph=0):
    out = np.zeros_like(t)
    for h in range(1, 12):
        out += np.sin(2*np.pi*f*h*t + ph*h)/h * (0.85**h)
    return out
def lp(x, a):  # one-pole lowpass
    y = np.zeros_like(x); acc = 0.0
    for i in range(0, len(x), 1):
        pass
    from scipy.signal import lfilter
    return lfilter([1-a], [1, -a], x)
# chord progression (8 s each): Dm, Bb, F, A
prog = [[146.83, 220.0, 293.66, 349.23], [116.54, 233.08, 293.66, 349.23],
        [87.31, 174.61, 261.63, 349.23], [110.0, 220.0, 277.18, 329.63]]
pad = np.zeros_like(t)
seg = 8.0
for i in range(int(T/seg)+1):
    ch = prog[i % 4]
    env = np.clip(np.minimum((t - i*seg)/1.5, (i*seg + seg + 1.5 - t)/1.5), 0, 1)
    if env.max() == 0: continue
    s = sum(saw(f*(1+d), rng.random()*6) for f in ch for d in (-0.003, 0.003))
    pad += s*env
pad = lp(pad, 0.96)
pad *= 0.6 + 0.4*np.sin(2*np.pi*0.25*t)**2
# timpani pulse ~ 90 bpm, accents
drum = np.zeros_like(t)
beat = 60/90
for k, bt in enumerate(np.arange(0, T, beat)):
    if k % 4 == 3 and k % 8 != 7: continue
    n = int(sr*0.9); i0 = int(bt*sr)
    tt = np.arange(n)/sr
    f = 55*(1+0.6*np.exp(-tt*25))
    hit = np.sin(2*np.pi*np.cumsum(f)/sr)*np.exp(-tt*5)
    hit += rng.normal(0, 1, n)*np.exp(-tt*40)*0.15
    amp = 1.0 if k % 4 == 0 else 0.55
    drum[i0:i0+n] += hit[:len(drum)-i0]*amp
mix = pad/np.abs(pad).max()*0.55 + drum/np.abs(drum).max()*0.5
mix = np.tanh(mix*1.2)
mix *= np.clip(t/2, 0, 1)
stereo = np.stack([mix, np.roll(mix, 300)], 1) * 0.8
sf.write('public/musica.wav', stereo, sr)

# whoosh transition
n = int(sr*0.7); tt = np.arange(n)/sr
noise = rng.normal(0, 1, n)
from scipy.signal import butter, sosfilt
w = np.zeros(n)
for j in range(0, n, 512):
    fc = 300 + 3000*np.sin(np.pi*j/n)
    sos = butter(2, [fc*0.7, fc*1.3], 'band', fs=sr, output='sos')
    w[j:j+512] = sosfilt(sos, noise[j:j+512])
w *= np.sin(np.pi*tt/0.7)**2
sf.write('public/sfx/whoosh.wav', w/np.abs(w).max()*0.7, sr)
# impact boom
n = int(sr*1.5); tt = np.arange(n)/sr
f = 40*(1+2*np.exp(-tt*12))
b = np.sin(2*np.pi*np.cumsum(f)/sr)*np.exp(-tt*3) + rng.normal(0,1,n)*np.exp(-tt*20)*0.4
sf.write('public/sfx/boom.wav', np.tanh(b*1.5)*0.8, sr)
print('ok')
