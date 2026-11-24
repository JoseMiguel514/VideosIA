# Narration with Kokoro TTS. Display text comes from guion.json; "pron" overrides pronunciation.
import json, re, soundfile as sf, numpy as np
from kokoro_onnx import Kokoro
k = Kokoro('/home/user/tts/kokoro.onnx', '/home/user/tts/voices.bin')
PRON = {"Turritopsis dohrnii": "Turr-ih-top-sis door-nee-eye", "senescent": "seh-ness-ent"}
VOICE, SPEED = 'am_michael', 0.94
escenas = json.load(open('scripts/guion.json'))
out = {}
for e in escenas:
    txt = e['texto']
    for a, b in PRON.items():
        txt = txt.replace(a, b)
    # synthesize sentence by sentence with short silences for deliberate pacing
    parts = [p for p in re.split(r'(?<=[.?!])\s+', txt) if p]
    shown = [p for p in re.split(r'(?<=[.?!])\s+', e['texto']) if p]
    assert len(shown) == len(parts)
    chunks, sents, pos = [], [], 0
    for p, d in zip(parts, shown):
        a, sr = k.create(p, voice=VOICE, speed=SPEED, lang='en-us')
        # trim leading/trailing near-silence so sentence timings are tight
        nz = np.where(np.abs(a) > 0.01)[0]
        a = a[max(nz[0]-800, 0):nz[-1]+1600]
        sents.append({'t': d, 's': round(pos/sr, 3), 'e': round((pos+len(a))/sr, 3)})
        gap = np.zeros(int(sr * 0.38), dtype=a.dtype)
        chunks += [a, gap]; pos += len(a) + len(gap)
    audio = np.concatenate(chunks[:-1])
    sf.write(f"public/voz/{e['id']}.wav", audio, sr)
    out[e['id']] = {'dur': round(len(audio) / sr, 3), 'sents': sents}
    print(e['id'], out[e['id']]['dur'], flush=True)
json.dump(out, open('src/duraciones.json', 'w'), indent=1)
print('total', round(sum(v['dur'] for v in out.values()), 1))
