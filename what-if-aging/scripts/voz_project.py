# Narration for a video project: python3 scripts/voz_project.py <guion.json> <public out dir> <durations.json>
# Env: SPEED (Kokoro speed, default 1.08) and GAP (seconds of silence between sentences, default 0.24).
import json, re, sys, os, soundfile as sf, numpy as np
from kokoro_onnx import Kokoro
guion, outdir, durs = sys.argv[1:4]
k = Kokoro('/home/user/tts/kokoro.onnx', '/home/user/tts/voices.bin')
PRON = {"Galunggung": "Gah-loong-goong", "A P U": "Ay Pee You", "Gimli": "Gim-lee", "Turritopsis dohrnii": "Turr-ih-top-sis door-nee-eye", "adenosine": "a-den-o-seen", "circadian": "sir-kay-dee-an", "thalamus": "thal-a-mus", "senescent": "seh-ness-ent", "Dement": "Deh-ment"}
VOICE = 'am_michael'
SPEED = float(os.environ.get('SPEED', '1.08'))
GAP = float(os.environ.get('GAP', '0.24'))
os.makedirs(outdir, exist_ok=True)
out = {}
for e in json.load(open(guion)):
    txt = e['texto']
    for a, b in PRON.items():
        txt = txt.replace(a, b)
    parts = [p for p in re.split(r'(?<=[.?!])\s+', txt) if p]
    shown = [p for p in re.split(r'(?<=[.?!])\s+', e['texto']) if p]
    assert len(shown) == len(parts), e['id']
    chunks, sents, pos = [], [], 0
    for p, d in zip(parts, shown):
        a, sr = k.create(p, voice=VOICE, speed=SPEED, lang='en-us')
        nz = np.where(np.abs(a) > 0.01)[0]
        a = a[max(nz[0] - 800, 0):nz[-1] + 1600]
        sents.append({'t': d, 's': round(pos / sr, 3), 'e': round((pos + len(a)) / sr, 3)})
        gap = np.zeros(int(sr * GAP), dtype=a.dtype)
        chunks += [a, gap]; pos += len(a) + len(gap)
    audio = np.concatenate(chunks[:-1])
    sf.write(f"{outdir}/{e['id']}.wav", audio, sr)
    out[e['id']] = {'dur': round(len(audio) / sr, 3), 'sents': sents}
    print(e['id'], out[e['id']]['dur'], flush=True)
json.dump(out, open(durs, 'w'), indent=1)
print('total', round(sum(v['dur'] for v in out.values()), 1))
