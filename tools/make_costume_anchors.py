# For each bundled sheet, find where a hat sits in every frame (rows Down/Right/Up/Left):
# x = head marker from SpriteCollab's *-Offsets.png (green pixel), y = top of the sprite around that x, span = head width.
import json, os, sys
from PIL import Image
WWW = os.path.join(os.path.dirname(__file__), '..', 'www')
SC = sys.argv[1] if len(sys.argv) > 1 else '/home/claude/pmdcollab/spritecollab/sprite'
man = json.load(open(os.path.join(WWW, 'assets/pmd/manifest.json')))
missing = []
ONLY = set(sys.argv[2].split(',')) if len(sys.argv) > 2 else None
for num, anims in man.items():
    if ONLY and num not in ONLY: continue
    for key, a in anims.items():
        sheet = Image.open(os.path.join(WWW, a['url'][2:])).convert('RGBA'); sp = sheet.load()
        off_path = os.path.join(SC, num, key + '-Offsets.png'); off = None
        if not os.path.exists(off_path): off_path = os.path.join(SC, num, key + '-Offsets.png')
        if os.path.exists(off_path):
            o = Image.open(off_path).convert('RGBA')
            if o.size == sheet.size: off = o.load()
        if off is None: missing.append(num + ' ' + key)
        w, h, cs = a['w'], a['h'], []
        nrows = sheet.height // h
        for row in [r for r in (0, 2, 4, 6) if r < nrows] or [0]:
            fr = []
            for f in range(a['frames']):
                x0, y0 = f * w, row * h
                opaque = [(x, y) for y in range(h) for x in range(w) if sp[x0 + x, y0 + y][3] > 40]
                if not opaque: fr.append([w // 2, h // 2, 10]); continue
                hx = None
                if off:
                    g = [(x, y) for y in range(h) for x in range(w) if off[x0 + x, y0 + y][3] and off[x0 + x, y0 + y][:3] == (0, 255, 0)]
                    if g: hx = g[0][0]
                if hx is None:
                    xs = [x for x, y in opaque]; hx = (min(xs) + max(xs)) // 2
                # first row with a solid run of pixels around the head, so thin ears/antennae don't lift the hat
                rows_ = {}
                for x, y in opaque:
                    if abs(x - hx) <= 5: rows_[y] = rows_.get(y, 0) + 1
                solid = [y for y, n in rows_.items() if n >= 6]
                top = min(solid) if solid else (min(rows_) if rows_ else min(y for x, y in opaque))
                band = [x for x, y in opaque if top + 2 <= y <= top + 5]
                span = (max(band) - min(band) + 1) if band else 10
                fr.append([hx, top, span])
            cs.append(fr)
        a['cs'] = cs
json.dump(man, open(os.path.join(WWW, 'assets/pmd/manifest.json'), 'w'), separators=(',', ':'))
print('species', len(man), 'without offsets:', missing)
