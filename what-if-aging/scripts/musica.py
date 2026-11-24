# Synthesized ambient cinematic score (A minor, slow pad + soft pulse + clock tick) and SFX.
import numpy as np, soundfile as sf
from scipy.signal import lfilter, butter, sosfilt
sr = 44100; T = 250
t = np.arange(int(sr*T))/sr
rng = np.random.default_rng(25)
def tone(f, ph):
    return sum(np.sin(2*np.pi*f*h*t + ph*h)/h*(0.7**h) for h in range(1, 7))
prog = [[110.0, 164.81, 220.0, 261.63], [87.31, 174.61, 220.0, 261.63],
        [130.81, 196.0, 261.63, 329.63], [98.0, 196.0, 246.94, 293.66]]
seg = 10.0
pad = np.zeros_like(t)
for i in range(int(T/seg)+1):
    ch = prog[i % 4]
    env = np.clip(np.minimum((t-i*seg)/3.0, (i*seg+seg+3.0-t)/3.0), 0, 1)
    idx = env > 0
    if not idx.any(): continue
    s = np.zeros_like(t)
    for f in ch:
        for d in (-0.002, 0.002):
            s += tone(f*(1+d), rng.random()*6)
    pad += s*env
pad = lfilter([1-0.985], [1, -0.985], pad)
pad *= 0.75 + 0.25*np.sin(2*np.pi*t/7)**2
# high shimmering arpeggio notes, sparse
shim = np.zeros_like(t)
notes = [440, 523.25, 659.25, 587.33, 493.88]
for k, st in enumerate(np.arange(4, T, 2.5)):
    n = int(sr*2.4); i0 = int(st*sr); tt = np.arange(n)/sr
    f = notes[(k*3) % 5] * (1 if k % 3 else 2)
    note = np.sin(2*np.pi*f*tt)*np.exp(-tt*1.6)*0.5
    shim[i0:i0+n] += note[:len(t)-i0]
# low heartbeat-like pulse, 60 bpm, enters after 40s
pulse = np.zeros_like(t)
for bt in np.arange(40, T, 1.0):
    for off, a in ((0, 1.0), (0.28, 0.6)):
        n = int(sr*0.35); i0 = int((bt+off)*sr); tt = np.arange(n)/sr
        f = 50*(1+0.5*np.exp(-tt*30))
        h = np.sin(2*np.pi*np.cumsum(f)/sr)*np.exp(-tt*12)*a
        pulse[i0:i0+n] += h[:len(t)-i0]
pulse *= np.clip((t-40)/10, 0, 1)
# clock tick (subtle), 1 per second
tick = np.zeros_like(t)
click = rng.normal(0, 1, 300)*np.exp(-np.arange(300)/40)
sos = butter(2, 3000, 'high', fs=sr, output='sos'); click = sosfilt(sos, click)
for bt in np.arange(0.5, T, 1.0):
    i0 = int(bt*sr); tick[i0:i0+300] += click[:len(t)-i0]
mix = (pad/np.abs(pad).max()*0.6 + shim/np.abs(shim).max()*0.18
       + pulse/np.abs(pulse).max()*0.35 + tick/np.abs(tick).max()*0.08)
mix = np.tanh(mix*1.1)
mix *= np.clip(t/3, 0, 1) * np.clip((T-t)/6, 0, 1)
stereo = np.stack([mix, np.roll(mix, 400)], 1)*0.8
sf.write('public/musica.wav', stereo.astype(np.float32), sr)

def save(name, x): sf.write(f'public/sfx/{name}.wav', (x/np.abs(x).max()*0.8).astype(np.float32), sr)
# whoosh
n = int(sr*0.8); tt = np.arange(n)/sr; noise = rng.normal(0, 1, n); w = np.zeros(n)
for j in range(0, n, 512):
    fc = 300+2500*np.sin(np.pi*j/n)
    sos = butter(2, [fc*0.7, fc*1.3], 'band', fs=sr, output='sos'); w[j:j+512] = sosfilt(sos, noise[j:j+512])
save('whoosh', w*np.sin(np.pi*tt/0.8)**2)
# deep boom
n = int(sr*2.5); tt = np.arange(n)/sr; f = 35*(1+2*np.exp(-tt*10))
save('boom', np.tanh((np.sin(2*np.pi*np.cumsum(f)/sr)*np.exp(-tt*2) + rng.normal(0,1,n)*np.exp(-tt*18)*0.3)*1.5))
# candle blow (filtered noise puff)
n = int(sr*0.9); tt = np.arange(n)/sr
sos = butter(2, [200, 1500], 'band', fs=sr, output='sos')
save('blow', sosfilt(sos, rng.normal(0,1,n))*np.sin(np.pi*np.clip(tt/0.9,0,1))**1.5)
# rewind/freeze riser (descending tone)
n = int(sr*1.2); tt = np.arange(n)/sr; f = 900*np.exp(-tt*2.2)
save('freeze', np.sin(2*np.pi*np.cumsum(f)/sr)*np.exp(-tt*1.5) + np.sin(2*np.pi*np.cumsum(f*1.5)/sr)*np.exp(-tt*2)*0.5)
# pop for UI elements
n = int(sr*0.15); tt = np.arange(n)/sr; f = 600+800*np.exp(-tt*40)
save('pop', np.sin(2*np.pi*np.cumsum(f)/sr)*np.exp(-tt*30))
print('ok')
