import json, sys, soundfile as sf, numpy as np
from kokoro_onnx import Kokoro
k = Kokoro('/home/user/tts/kokoro.onnx', '/home/user/tts/voices.bin')
escenas = json.load(open('scripts/guion.json'))
out = {}
for e in escenas:
    audio, sr = k.create(e['texto'], voice=e.get('voz', 'em_alex'), speed=1.08, lang='es')
    sf.write(f"public/voz/{e['id']}.wav", audio, sr)
    out[e['id']] = round(len(audio) / sr, 3)
    print(e['id'], out[e['id']])
json.dump(out, open('src/duraciones.json', 'w'), indent=2)
