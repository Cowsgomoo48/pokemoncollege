# Bundles a Rare Costume from user-supplied PMD folders (no drawing: sheets are copied as-is).
# usage: add_rare_costume.py <costume_id> <dex4> <variant normal|shiny> <folder>
import json, os, shutil, sys, xml.etree.ElementTree as ET
from PIL import Image
cid, num, var, src = sys.argv[1:5]
WWW = os.path.join(os.path.dirname(__file__), '..', 'www'); base = os.path.join('assets/costume/rare', cid, num, var)
os.makedirs(os.path.join(WWW, base), exist_ok=True)
mp = os.path.join(WWW, 'assets/costume/rare/manifest.json'); man = json.load(open(mp)) if os.path.exists(mp) else {}
t = ET.parse(os.path.join(src, 'AnimData.xml')).getroot(); by = {a.find('Name').text: a for a in t.iter('Anim')}; out = {}
for key in ('Walk', 'Idle', 'Eat', 'Attack', 'Sleep'):
    a = by.get(key)
    if a is not None and a.find('CopyOf') is not None: a = by.get(a.find('CopyOf').text)
    if a is None: continue
    f = os.path.join(src, a.find('Name').text + '-Anim.png')
    if not os.path.exists(f): continue
    w, h = int(a.find('FrameWidth').text), int(a.find('FrameHeight').text); d = [int(x.text) for x in a.iter('Duration')]
    shutil.copy(f, os.path.join(WWW, base, key + '-Anim.png'))
    out[key] = {'url': './' + base + '/' + key + '-Anim.png', 'w': w, 'h': h, 'd': d, 'frames': len(d), 'rows': Image.open(f).height // h}
for c in ('CREDITS.txt', 'credits.txt'):
    if os.path.exists(os.path.join(src, c)): shutil.copy(os.path.join(src, c), os.path.join(WWW, base, c))
# portrait for the Box: the first front-facing idle frame, cropped and padded square
a = out['Idle']; im = Image.open(os.path.join(WWW, base, 'Idle-Anim.png')).convert('RGBA').crop((0, 0, a['w'], a['h']))
bb = im.getbbox(); im = im.crop(bb); s = max(im.size) + 4; sq = Image.new('RGBA', (s, s)); sq.paste(im, ((s - im.width) // 2, (s - im.height) // 2)); sq.save(os.path.join(WWW, base, 'portrait.png'))
man[cid + '|' + num + '|' + var] = out; json.dump(man, open(mp, 'w'), separators=(',', ':')); print(cid, num, var, list(out))
