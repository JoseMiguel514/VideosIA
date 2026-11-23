# Verifica que cada at("escena","palabra") exista en el guion. Uso: python3 scripts/check_at.py <carpeta>
import json, re, sys, glob
v = sys.argv[1]
g = {e['id']: e['pantalla'] for e in json.load(open(f'src/{v}/guion.json'))}
bad = 0
for p in glob.glob(f'src/{v}/*.tsx'):
    for sid, w in re.findall(r'at\("([^"]+)",\s*"([^"]+)"\)', open(p).read()):
        toks = [re.sub(r'\{[^}]*\}', '', t).lower() for t in g.get(sid, '').split()]
        if sid not in g or not any(w.lower() in t for t in toks):
            print('FALTA', p, sid, w); bad += 1
print('errores:', bad)
