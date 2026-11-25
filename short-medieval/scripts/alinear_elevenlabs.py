# Corta una narración completa (ElevenLabs) en escenas y sincroniza los subtítulos con el guion.
# A diferencia de voz_elevenlabs.py, tolera que Whisper escriba distinto algunas palabras
# (números, nombres propios): alinea con difflib e interpola las que no coinciden.
# Uso: python3 scripts/alinear_elevenlabs.py audio.wav guiones/x.json carpeta_public src/videos/voz_x.json
import json, re, sys, difflib, unicodedata
import soundfile as sf
from scipy.signal import resample_poly
from faster_whisper import WhisperModel

wav, guion, carpeta, salida = sys.argv[1:5]
audio, sr = sf.read(wav, dtype="float32")
g = json.load(open(guion))
esc = [(e["id"], e["texto"].replace("...", "…").split()) for e in g["escenas"]]
words = [w for _, ws in esc for w in ws]

def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    return re.sub(r"[^a-z0-9]", "", "".join(c for c in s if unicodedata.category(c) != "Mn"))

m = WhisperModel("small", device="cpu", compute_type="int8")
segs, _ = m.transcribe(resample_poly(audio, 16000, sr).astype("float32"), language="es", word_timestamps=True)
ww = [{"w": w.word.strip(), "s": w.start, "e": w.end} for s in segs for w in s.words]

a = [norm(w) for w in words]
b = [norm(w["w"]) for w in ww]
times = [None] * len(words)
for blk in difflib.SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks():
    for k in range(blk.size):
        times[blk.a + k] = (ww[blk.b + k]["s"], ww[blk.b + k]["e"])
# interpolate unmatched runs between known neighbours
i = 0
n = len(words)
dur = len(audio) / sr
while i < n:
    if times[i] is not None:
        i += 1
        continue
    j = i
    while j < n and times[j] is None:
        j += 1
    t0 = times[i - 1][1] if i > 0 else 0.0
    t1 = times[j][0] if j < n else dur
    step = (t1 - t0) / (j - i)
    for k in range(i, j):
        times[k] = (t0 + step * (k - i), t0 + step * (k - i + 1))
    i = j
matched = sum(bl.size for bl in difflib.SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks())
print("palabras interpoladas:", n - matched, "de", n)

out, idx = {}, 0
bounds = []
for sid, ws in esc:
    bounds.append((sid, idx, idx + len(ws)))
    idx += len(ws)
for k, (sid, s0, s1) in enumerate(bounds):
    start = 0.0 if k == 0 else max((times[s0 - 1][1] + times[s0][0]) / 2, times[s0][0] - 0.25)
    end = dur if k == len(bounds) - 1 else min((times[s1 - 1][1] + times[s1][0]) / 2, times[s1 - 1][1] + 0.3)
    seg = audio[int(start * sr): int(end * sr)]
    sf.write(f"public/{carpeta}/{sid}.wav", seg, sr)
    out[sid] = {"dur": round(len(seg) / sr, 3), "words": [{"w": words[j], "s": round(times[j][0] - start, 3), "e": round(times[j][1] - start, 3)} for j in range(s0, s1)]}
    print(sid, out[sid]["dur"])
json.dump(out, open(salida, "w"), ensure_ascii=False, indent=1)
