import json, sys
from faster_whisper import WhisperModel
m = WhisperModel("small", device="cpu", compute_type="int8")
import soundfile as sf
audio, _ = sf.read(sys.argv[1], dtype="float32")
segs, _ = m.transcribe(audio, language="es", word_timestamps=True, initial_prompt="Falaise, Autun, Bartolomé de Chassenée, 1386, 1522.")
words = [{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)} for s in segs for w in s.words]
json.dump(words, open(sys.argv[2], "w"), ensure_ascii=False, indent=0)
print(" ".join(f"{w['w']}@{w['s']}" for w in words))
