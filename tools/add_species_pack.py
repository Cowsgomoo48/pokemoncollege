# Adds a species from a SpriteCollab-style folder (AnimData.xml + *-Anim.png) to the bundled sprite manifest.
# usage: add_species_pack.py <folder> <dex4>
import json, os, shutil, sys, xml.etree.ElementTree as ET
from PIL import Image
src, num = sys.argv[1], sys.argv[2]
WWW = os.path.join(os.path.dirname(__file__), '..', 'www'); mp = os.path.join(WWW, 'assets/pmd/manifest.json'); man = json.load(open(mp))
t = ET.parse(os.path.join(src, 'AnimData.xml')).getroot(); by = {a.find('Name').text: a for a in t.iter('Anim')}
os.makedirs(os.path.join(WWW, 'assets/pmd', num), exist_ok=True); out = {}
for key in ('Walk', 'Idle', 'Eat', 'Attack', 'Sleep'):
    a = by.get(key)
    if a is not None and a.find('CopyOf') is not None: a = by.get(a.find('CopyOf').text); 
    if a is None: continue
    name = a.find('Name').text; f = os.path.join(src, name + '-Anim.png')
    if not os.path.exists(f): continue
    w, h = int(a.find('FrameWidth').text), int(a.find('FrameHeight').text); d = [int(x.text) for x in a.iter('Duration')]
    shutil.copy(f, os.path.join(WWW, 'assets/pmd', num, key + '-Anim.png'))
    out[key] = {'url': './assets/pmd/%s/%s-Anim.png' % (num, key), 'w': w, 'h': h, 'd': d, 'frames': len(d), 'rows': Image.open(f).height // h}
man[num] = out; json.dump(man, open(mp, 'w'), separators=(',', ':')); print(num, list(out))
