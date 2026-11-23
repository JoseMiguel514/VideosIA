# Narración en inglés con Kokoro TTS. Uso: python3 scripts/voz.py <video> [voz]
import json, sys, os, soundfile as sf
from kokoro_onnx import Kokoro
v = sys.argv[1]; voice = sys.argv[2] if len(sys.argv) > 2 else 'am_michael'
k = Kokoro('/home/user/tts/kokoro.onnx', '/home/user/tts/voices.bin')
escenas = json.load(open(f'src/{v}/guion.json'))
os.makedirs(f'public/{v}/voz', exist_ok=True)
out = {}
for e in escenas:
    audio, sr = k.create(e['texto'], voice=voice, speed=1.0, lang='en-us')
    sf.write(f"public/{v}/voz/{e['id']}.wav", audio, sr)
    out[e['id']] = round(len(audio) / sr, 3)
json.dump(out, open(f'src/{v}/duraciones.json', 'w'), indent=2)
print(v, out, 'total', round(sum(out.values()), 1))
