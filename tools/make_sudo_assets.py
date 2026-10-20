"""Joins the user's hand-made Sudowoodo pieces (art-source/) into stackable web assets (www/assets/sudo/).
Only the user's own pixels are cropped, repeated and mirrored; nothing is repainted.
Usage: python3 tools/make_sudo_assets.py
"""
from PIL import Image
import numpy as np, os, json
SRC = os.path.join(os.path.dirname(__file__), '..', 'art-source')
OUT = os.path.join(os.path.dirname(__file__), '..', 'www', 'assets', 'sudo')
os.makedirs(OUT, exist_ok=True)
L = lambda n: Image.open(os.path.join(SRC, n)).convert('RGBA')
A = lambda im: np.array(im).astype(float)
body, feet, head, branch = L('body.png'), L('feet.png'), L('head.png'), L('branch.png')
X0, X1 = 388, 500                      # body column kept (outline included)
def rows(im, y0, y1): return A(im)[y0:y1, X0:X1, :]
def diff(a, b): return float(np.abs(a - b).mean())

# 1. build a seamless repeat by "ping-pong": take the stretch of body between two spot centres and
#    follow it with its own mirror image. The rows meeting at every join are identical, so there is no seam.
#    (Spot centres measured from the user's body piece: rows 163 and 277.)
pb = A(body); M1, M2 = 163, 277
seg = pb[M1:M2+1, X0:X1]
loop = np.concatenate([seg[:-1], seg[::-1][:-1]], axis=0)
PER = loop.shape[0]; print('loop period', PER)

# 2. rotate loop so it continues straight on from the bottom of the head piece
ph = A(head)[:, X0:X1]; head_tail = ph[492:500]
rbest = None
for r in range(PER):
    seg_r = np.take(loop, [(r - 8 + k) % PER for k in range(8)], axis=0)
    c = diff(seg_r, head_tail)
    if rbest is None or c < rbest[0]: rbest = (c, r)
R = rbest[1]; print('rotation', R, 'head join cost', round(rbest[0], 2))
loop = np.roll(loop, -R, axis=0)

# 3. cut the feet piece where it continues from the end of the loop
pf = A(feet)[:, X0:X1]; tail = loop[PER-8:PER]; fbest = None
for y in range(8, 380):
    c = diff(pf[y-8:y], tail)
    if fbest is None or c < fbest[0]: fbest = (c, y)
FY = fbest[1]; print('feet cut at', FY, 'join cost', round(fbest[0], 2))

def save(arr, name, flip=True):
    im = Image.fromarray(arr.astype('uint8'), 'RGBA')
    if flip: im = im.transpose(Image.FLIP_LEFT_RIGHT)   # pieces face right-to-left; the tower sits on the left edge
    im.save(os.path.join(OUT, name), optimize=True)
    return im.size

# head: keep everything from the top of the head piece to the end of its body column, full width of the head
head_arr = A(head)[135:500, 346:500]
# the loop was matched on the body column only; re-cut it at the full 154px width
loop_wide = np.roll(np.concatenate([pb[M1:M2+1, 346:X1][:-1], pb[M1:M2+1, 346:X1][::-1][:-1]], axis=0), -R, axis=0)
sizes = {
  'head': save(head_arr, 'head.png'),
  'loop': save(loop_wide, 'body.png'),
  'feet': save(A(feet)[FY:500, 346:500], 'feet.png'),
}
# branch: split into arm (stretchable straight run) and leaf cluster
b = A(branch)[90:410, 100:500]
bim = Image.fromarray(b.astype('uint8'), 'RGBA').transpose(Image.FLIP_LEFT_RIGHT)
# arm = root cap + a short straight run that the app stretches to any length + the leaf cluster at the tip
bim.crop((0, 126, 120, 186)).save(os.path.join(OUT, 'br_arm.png'), optimize=True)   # stretched by the app to any length
bim.crop((120, 0, 400, bim.height)).save(os.path.join(OUT, 'br_end.png'), optimize=True)  # leaf cluster at the tip
sizes['branch'] = bim.size
json.dump({'loopPeriod': PER, 'sizes': sizes}, open(os.path.join(OUT, 'meta.json'), 'w'))
print(sizes)
