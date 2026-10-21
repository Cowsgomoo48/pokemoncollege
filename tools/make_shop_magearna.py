# Splits the user's Magearna art into body + two arm layers (same canvas, so they stack exactly),
# and saves the counter background. usage: make_shop_magearna.py <magearna.png> <shop_bg.png>
import os, sys
from PIL import Image
WWW = os.path.join(os.path.dirname(__file__), '..', 'www', 'assets', 'shop')
mag = Image.open(sys.argv[1]).convert('RGBA'); W, H = mag.size
BAND = (585, 730)                      # rows the arms live in
CUT_L, CUT_R = 304, 786                # rods end here, just outside the gold shoulder rings
body = mag.copy(); armL = Image.new('RGBA', mag.size); armR = Image.new('RGBA', mag.size)
armL.paste(mag.crop((0, BAND[0], CUT_L, BAND[1])), (0, BAND[0]))
armR.paste(mag.crop((CUT_R, BAND[0], W, BAND[1])), (CUT_R, BAND[0]))
clear = Image.new('RGBA', (1, 1))
body.paste(clear.resize((CUT_L, BAND[1] - BAND[0])), (0, BAND[0]))
body.paste(clear.resize((W - CUT_R, BAND[1] - BAND[0])), (CUT_R, BAND[0]))
S = 0.6; size = (round(W * S), round(H * S))
for name, im in (('mag_body', body), ('mag_armL', armL), ('mag_armR', armR)):
    im.resize(size, Image.LANCZOS).save(os.path.join(WWW, name + '.png'), optimize=True)
Image.open(sys.argv[2]).convert('RGB').save(os.path.join(WWW, 'shop_bg.jpg'), quality=86, optimize=True)
print('canvas', W, H, '-> pivots L', (321 / W, 656 / H), 'R', (769 / W, 656 / H))
