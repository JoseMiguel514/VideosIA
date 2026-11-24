# Narración genérica con Kokoro (voz provisional) + tiempos por palabra.
# Uso: python3 scripts/narrar.py <guion.json> <carpeta public/...> <salida.json> [voz] [velocidad]
import json, re, sys, os, soundfile as sf, numpy as np
from kokoro_onnx import Kokoro
guion, carpeta, salida = sys.argv[1:4]
VOICE = sys.argv[4] if len(sys.argv) > 4 else 'em_alex'
SPEED = float(sys.argv[5]) if len(sys.argv) > 5 else 1.18
k = Kokoro('/home/user/tts/kokoro.onnx', '/home/user/tts/voices.bin')
g = json.load(open(guion))
REP = g.get('pronunciacion', {})
os.makedirs(f'public/{carpeta}', exist_ok=True)
out = {}
for e in g['escenas']:
    trozos = [t.strip() for t in re.findall(r'[^.,:;!?¿¡…]+[.,:;!?…]*', e['texto'].replace('...', '…')) if t.strip(' .,¡¿!?…')]
    audios, words, tpos, sr = [], [], 0.0, 24000
    for tr in trozos:
        hablado = tr
        for o, n in REP.items(): hablado = hablado.replace(o, n)
        a, sr = k.create(hablado, voice=VOICE, speed=SPEED, lang='es')
        idx = np.where(np.abs(a) > 0.01)[0]
        a = a[max(0, idx[0] - 600): idx[-1] + 1200] if len(idx) else a
        dur = len(a) / sr
        ws = tr.split()
        weights = [len(re.sub(r'[^\wáéíóúñü]', '', REP.get(w.strip('.,¡!¿?'), w), flags=re.I)) + 2 for w in ws]
        tot = sum(weights); acc = 0
        for w, wt in zip(ws, weights):
            words.append({"w": w, "s": round(tpos + dur * acc / tot, 3), "e": round(tpos + dur * (acc + wt) / tot, 3)})
            acc += wt
        pausa = 0.22 if re.search(r'[.!?…]$', tr) else 0.1
        audios.append(a); audios.append(np.zeros(int(sr * pausa), dtype=a.dtype))
        tpos += dur + pausa
    audio = np.concatenate(audios)
    sf.write(f"public/{carpeta}/{e['id']}.wav", audio, sr)
    out[e['id']] = {"dur": round(len(audio) / sr, 3), "words": words}
print(carpeta, round(sum(v['dur'] for v in out.values()), 1), 's')
json.dump(out, open(salida, 'w'), ensure_ascii=False, indent=1)
