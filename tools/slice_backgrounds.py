# Cuts the background tiles out of the reference sheets the user supplied (no drawing, only cropping).
import json, os, sys
from PIL import Image
U = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), '..', 'www', 'assets', 'bg')
bgs = []
def save(im, key, name, tier):
    im = im.convert('RGB')
    if im.width > 640: im = im.resize((640, round(im.height * 640 / im.width)), Image.LANCZOS)
    im.save(os.path.join(OUT, key + '.jpg'), quality=84)
    bgs.append({'id': 'bg_' + key, 'name': name, 'tier': tier, 'url': './assets/bg/' + key + '.jpg'})
a = Image.open(os.path.join(U, '1a504a4f-image.webp'))
cx = [(5, 579), (590, 1164), (1176, 1750), (1760, 2335), (2347, 2919), (2931, 3505), (3516, 4089)]
ry = [(5, 490), (500, 986), (997, 1482), (1492, 1978), (1989, 2472)]
names = [['Grass Grid', 1], ['Stone Bricks', 1], ['Desert Sand', 1], ['Savanna', 1], ['Purple Rock', 1], ['Red Clay', 1], ['Frost Waves', 1],
 ['Muddy Ground', 1], ['Sunny Beach', 1], ['Deep Sea', 1], ['Shallows', 2], ['Open Sky', 2], ['Orange Ball Mat', 2], ['Slate Tiles', 1],
 ['Pink Gingham', 1], ['Meadow Frame', 1], ['Outer Space', 2], None, ['Retro Route', 2], ['Orange Bird', 3], ['Purple Pals', 3],
 ['Electric Pals', 3], ['Cosmic Burst', 2], ['Blue Bolt', 2], ['Night Cliffs', 2], ['Forest Friends', 3], ['Contest Stage', 2], ['Electric Family', 3],
 ['Retro House', 2], ['Crimson Shadows', 3], ['Grinning Frog', 3], ['Night Squad', 3]]
i = 0
for r, (y0, y1) in enumerate(ry):
    for c, (x0, x1) in enumerate(cx):
        if r == 4 and c > 3: break
        n = names[i]; i += 1
        if n: save(a.crop((x0 + 2, y0 + 2, x1 - 1, y1 - 1)), 'a%02d' % i, n[0], n[1])
save(Image.open(os.path.join(U, 'cdad7440-image.webp')), 'waves', 'Ball Waves', 2)
b = Image.open(os.path.join(U, '4289fe75-image.webp'))
bn = [['Gray Fade', 1], ['Blue Fade', 1], ['Red Fade', 1], ['Yellow Pals', 3], ['Gift Grid', 2], ['Fox Pattern', 3], ['Checker Plate', 1], ['Sunny Pals', 3], ['Bamboo', 1],
      ['Pink Bubbles', 2], ['Laurel', 2], ['Forest Clearing', 2], ['Ball Pattern', 2], ['Arena', 3], ['Carbon', 1]]
for k, n in enumerate(bn):
    r, c = divmod(k, 3)
    x0, y0 = c * 158 + 2, 16 + round(r * 118.2) + 2
    box = (x0, y0, x0 + 153, y0 + 100 - (12 if k == 14 else 0))
    save(b.crop(box), 'b%02d' % (k + 1), n[0], n[1])
json.dump(bgs, open(os.path.join(OUT, 'backgrounds.json'), 'w'), indent=0)
print(len(bgs), 'backgrounds')
