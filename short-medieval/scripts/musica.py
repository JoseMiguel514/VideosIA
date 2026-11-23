# Música medieval sintetizada: laúd (Karplus-Strong) en Re dórico + bordón + pandero. Y efectos.
import numpy as np, soundfile as sf
from scipy.signal import lfilter, butter, sosfilt
sr = 44100; T = 64
rng = np.random.default_rng(3)
N = int(sr*T); mix = np.zeros(N)
def pluck(f, dur, amp=1.0, bright=0.5):
    n = int(sr*dur); p = int(sr/f)
    buf = rng.uniform(-1, 1, p); buf = lfilter([bright, 1-bright], [1], buf)
    out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = 0.5*(buf[i % p] + buf[(i+1) % p])*0.996
    return out*amp*np.exp(-np.arange(n)/sr*1.5)
def add(sig, t0):
    i0 = int(t0*sr); e = min(N, i0+len(sig)); mix[i0:e] += sig[:e-i0]
D = 293.66
sc = {'D':D, 'E':D*9/8, 'F':D*6/5, 'G':D*4/3, 'A':D*3/2, 'B':D*5/3, 'C':D*16/9, 'd':D*2, 'e':D*9/4, 'f':D*12/5}
bpm = 112; b = 60/bpm
mel = "D.F.G.A. A.G.F.E. D.E.F.G. A...A... d.C.A.G. F.G.A.F. E.F.E.D. D...D... ".replace(' ', '')
mel2 = "A.A.d.e. f.e.d.C. A.C.d.A. G...G... F.G.A.d. C.A.G.F. E.D.E.F. D...D... ".replace(' ', '')
cache = {}
t = 2*b; k = 0
song = mel + mel + mel2 + mel
while t < T-2:
    ch = song[(k) % len(song)]
    if ch != '.':
        if ch not in cache: cache[ch] = pluck(sc[ch], 1.2, 0.55)
        add(cache[ch], t)
    t += b/2; k += 1
# acompañamiento: bordón en Re-La pulsado
for i, tt in enumerate(np.arange(0, T-1, b)):
    f = D/2 if i % 2 == 0 else D*3/4
    add(pluck(f, 0.9, 0.35, 0.8), tt)
# pandero/tambor
for i, tt in enumerate(np.arange(0, T-1, b)):
    n = int(sr*0.4); x = np.arange(n)/sr
    if i % 4 in (0, 2):
        fr = 80*(1+0.5*np.exp(-x*30)); hit = np.sin(2*np.pi*np.cumsum(fr)/sr)*np.exp(-x*9)*0.8
    else:
        hit = sosfilt(butter(2, 5000, 'high', fs=sr, output='sos'), rng.normal(0, 1, n))*np.exp(-x*25)*0.25
    add(hit, tt)
    if i % 4 == 3: add(sosfilt(butter(2, 6000, 'high', fs=sr, output='sos'), rng.normal(0,1,n))*np.exp(-x*30)*0.15, tt+b/2)
# drone suave
tt = np.arange(N)/sr
mix += (np.sin(2*np.pi*D/4*tt) + 0.4*np.sin(2*np.pi*D*3/8*tt))*0.12
mix = np.tanh(mix/np.abs(mix).max()*1.6)*0.8
mix *= np.clip(tt/1.5, 0, 1)*np.clip((T-tt)/2, 0, 1)
sf.write('public/musica.wav', np.stack([mix, np.roll(mix, 220)], 1)*0.85, sr)

def save(name, x): sf.write(f'public/sfx/{name}.wav', x/np.abs(x).max()*0.8, sr)
# whoosh
n = int(sr*0.6); x = np.arange(n)/sr; noise = rng.normal(0, 1, n); w = np.zeros(n)
for j in range(0, n, 512):
    fc = 400 + 3500*np.sin(np.pi*j/n)
    w[j:j+512] = sosfilt(butter(2, [fc*0.7, fc*1.3], 'band', fs=sr, output='sos'), noise[j:j+512])
save('whoosh', w*np.sin(np.pi*x/0.6)**2)
# pop
n = int(sr*0.15); x = np.arange(n)/sr
save('pop', np.sin(2*np.pi*np.cumsum(300+900*np.exp(-x*40))/sr)*np.exp(-x*30))
# mazazo (gavel)
n = int(sr*0.8); x = np.arange(n)/sr
g = np.sin(2*np.pi*np.cumsum(180*(1+np.exp(-x*50)))/sr)*np.exp(-x*12) + sosfilt(butter(2, [800, 3000], 'band', fs=sr, output='sos'), rng.normal(0,1,n))*np.exp(-x*40)*1.5
save('mazo', np.tanh(g*2))
# chillido de rata
n = int(sr*0.35); x = np.arange(n)/sr
f = 2600 + 900*np.sin(2*np.pi*14*x)
save('chillido', np.sin(2*np.pi*np.cumsum(f)/sr)*np.sin(np.pi*x/0.35)**0.5*(0.6+0.4*np.sin(2*np.pi*30*x)))
# maullido
n = int(sr*0.9); x = np.arange(n)/sr
f0 = 500 + 350*np.sin(np.pi*x/0.9)
src = sum(np.sin(2*np.pi*h*np.cumsum(f0)/sr)/h for h in range(1, 12))
m = sosfilt(butter(2, [700, 2200], 'band', fs=sr, output='sos'), src)*np.sin(np.pi*x/0.9)
save('maullido', m)
# gruñido cerdo
n = int(sr*0.5); x = np.arange(n)/sr
f0 = 110 + 30*np.sin(2*np.pi*3*x)
src = sum(np.sin(2*np.pi*h*np.cumsum(f0)/sr)/h for h in range(1, 25)) * (0.5+0.5*np.sign(np.sin(2*np.pi*22*x)))
save('oink', sosfilt(butter(2, [300, 1500], 'band', fs=sr, output='sos'), src)*np.sin(np.pi*x/0.5))
# murmullo/sorpresa del público
n = int(sr*1.5); x = np.arange(n)/sr
crowd = sosfilt(butter(2, [250, 1100], 'band', fs=sr, output='sos'), rng.normal(0,1,n))*(1+0.5*np.sin(2*np.pi*4*x))
save('gasp', crowd*np.minimum(x/0.1, 1)*np.exp(-x*1.8))
print('ok')
