# Corta una narración completa (ElevenLabs) en escenas usando tiempos por palabra de Whisper.
# Uso: python3 scripts/voz_elevenlabs.py full.wav words.json [guion.json carpeta salida.json]
import json, re, sys, soundfile as sf
audio, sr = sf.read(sys.argv[1])
ww = json.load(open(sys.argv[2]))
GUION = sys.argv[3] if len(sys.argv) > 3 else 'scripts/guion.json'
CARPETA = sys.argv[4] if len(sys.argv) > 4 else 'voz'
SALIDA = sys.argv[5] if len(sys.argv) > 5 else 'src/voz.json'
guion = json.load(open(GUION))
if isinstance(guion, dict): guion = guion['escenas']
# separar abogado / gatos como en el video
esc = []
for e in guion:
    esc.append((e['id'], e['texto'].split()))
words_script = [w for _, ws in esc for w in ws]
assert len(words_script) == len(ww), (len(words_script), len(ww))
out, i = {}, 0
bounds = []
for k, (sid, ws) in enumerate(esc):
    bounds.append((sid, i, i + len(ws)))
    i += len(ws)
for k, (sid, a, b) in enumerate(bounds):
    start = 0.0 if k == 0 else (ww[a - 1]['e'] + ww[a]['s']) / 2
    start = max(start, ww[a]['s'] - 0.25)
    end = len(audio) / sr if k == len(bounds) - 1 else min((ww[b - 1]['e'] + ww[b]['s']) / 2, ww[b - 1]['e'] + 0.35)
    seg = audio[int(start * sr): int(end * sr)]
    sf.write(f'public/{CARPETA}/{sid}.wav', seg, sr)
    out[sid] = {"dur": round(len(seg) / sr, 3),
                "words": [{"w": words_script[j], "s": round(ww[j]['s'] - start, 3), "e": round(ww[j]['e'] - start, 3)} for j in range(a, b)]}
    print(sid, out[sid]['dur'])
json.dump(out, open(SALIDA, 'w'), ensure_ascii=False, indent=1)
