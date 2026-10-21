# Adds extra PMD animations (Eat, Attack, Sleep) to the bundled sprite manifest.
import json, os, shutil, sys, xml.etree.ElementTree as ET
from PIL import Image
SC = sys.argv[1]; WWW = os.path.join(os.path.dirname(__file__), '..', 'www')
mp = os.path.join(WWW, 'assets/pmd/manifest.json'); man = json.load(open(mp)); added = 0
for num, anims in man.items():
    t = ET.parse(os.path.join(SC, num, 'AnimData.xml')).getroot(); by = {a.find('Name').text: a for a in t.iter('Anim')}
    for key in ('Eat', 'Attack', 'Sleep'):
        a = by.get(key); src = os.path.join(SC, num, key + '-Anim.png')
        if a is None or a.find('CopyOf') is not None or not os.path.exists(src): continue
        w, h = int(a.find('FrameWidth').text), int(a.find('FrameHeight').text); d = [int(x.text) for x in a.iter('Duration')]
        im = Image.open(src); dst = os.path.join(WWW, 'assets/pmd', num, key + '-Anim.png'); shutil.copy(src, dst)
        anims[key] = {'url': './assets/pmd/%s/%s-Anim.png' % (num, key), 'w': w, 'h': h, 'd': d, 'frames': len(d), 'rows': im.height // h}; added += 1
json.dump(man, open(mp, 'w'), separators=(',', ':')); print('added', added)
