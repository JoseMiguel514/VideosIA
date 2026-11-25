# Genera la narración por escena y tiempos estimados por palabra (para subtítulos)
import json, re, sys, soundfile as sf, numpy as np
from kokoro_onnx import Kokoro
k = Kokoro('/home/user/tts/kokoro.onnx', '/home/user/tts/voices.bin')
LANG = sys.argv[1] if len(sys.argv) > 1 else 'es'
CFG = {
    'es': dict(guion='scripts/guion.json', out='voz', json='src/voz.json', voice='am_michael', lang='es', speed=1.1,
               rep={'1386': 'mil trescientos ochenta y seis', '1522': 'mil quinientos veintidós', 'Chassenée': 'Chasané', 'Autun': 'Otán', 'Falaise': 'Faléz'}),
    'en': dict(guion='scripts/guion_en.json', out='voz_en', json='src/voz_en.json', voice='am_michael', lang='en-us', speed=1.08,
               rep={'1386': 'thirteen eighty-six', '1522': 'fifteen twenty-two', 'Chassenée': 'Shass-nay', 'Autun': 'Oh-tan', 'Falaise': 'Fa-lez'}),
}[LANG]
escenas = json.load(open(CFG['guion']))
REEMPLAZOS = CFG['rep']
VOICE, SPEED = CFG['voice'], CFG['speed']
out = {}
for e in escenas:
    # trocear en frases cortas por puntuación para tiempos de palabra fiables
    trozos = [t.strip() for t in re.findall(r'[^.,:;!?¿¡…]+[.,:;!?…]*', e['texto'].replace('...', '…')) if t.strip(' .,¡¿!?…')]
    audios, words, tpos, sr = [], [], 0.0, 24000
    for tr in trozos:
        hablado = tr
        for o, n in REEMPLAZOS.items(): hablado = hablado.replace(o, n)
        a, sr = k.create(hablado, voice=VOICE, speed=SPEED, lang=CFG['lang'])
        # recortar silencio
        idx = np.where(np.abs(a) > 0.01)[0]
        a = a[max(0, idx[0]-600): idx[-1]+1200] if len(idx) else a
        dur = len(a)/sr
        ws = tr.split()
        weights = [len(re.sub(r'[^\wáéíóúñü]', '', REEMPLAZOS.get(w.strip('.,'), w), flags=re.I)) + 2 for w in ws]
        tot = sum(weights); acc = 0
        for w, wt in zip(ws, weights):
            words.append({"w": w, "s": round(tpos + dur*acc/tot, 3), "e": round(tpos + dur*(acc+wt)/tot, 3)})
            acc += wt
        pausa = 0.32 if re.search(r'[.!?…]$', tr) else 0.14
        audios.append(a); audios.append(np.zeros(int(sr*pausa), dtype=a.dtype))
        tpos += dur + pausa
    audio = np.concatenate(audios)
    sf.write(f"public/{CFG['out']}/{e['id']}.wav", audio, sr)
    out[e['id']] = {"dur": round(len(audio)/sr, 3), "words": words}
    print(e['id'], out[e['id']]['dur'])
json.dump(out, open(CFG['json'], 'w'), ensure_ascii=False, indent=1)
