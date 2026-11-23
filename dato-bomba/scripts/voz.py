# Narración con Kokoro TTS. Uso: python3 scripts/voz.py <video>   (ej. vangogh)
import json, sys, os, soundfile as sf
from kokoro_onnx import Kokoro
v = sys.argv[1]
k = Kokoro('/home/user/tts/kokoro.onnx', '/home/user/tts/voices.bin')
escenas = json.load(open(f'src/videos/{v}/guion.json'))
os.makedirs(f'public/{v}/voz', exist_ok=True)
out = {}
for e in escenas:
    audio, sr = k.create(e['texto'], voice=e.get('voz', 'em_alex'), speed=1.15, lang='es')
    sf.write(f"public/{v}/voz/{e['id']}.wav", audio, sr)
    out[e['id']] = round(len(audio) / sr, 3)
json.dump(out, open(f'src/videos/{v}/duraciones.json', 'w'), indent=2)
print(v, out)
