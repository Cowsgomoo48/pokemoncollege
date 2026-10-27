# Battle Tower perk cards: true pixel art (drawn at 1x on a 96x136 grid, scaled 3x with nearest-neighbour, no smoothing).
# Card look: element frame (Fire red / Water blue / Grass green), stars, an interior painted like a Poké Ball by rarity,
# a pixel icon, a name banner and a text box. The name and text are left blank here: the app writes them on top in a
# pixel font, so they stay sharp and easy to change.
#   python3 tools/make_tower_cards.py   ->  www/assets/cards/<id>.png  (+ sheet preview with --sheet)
import json, math, os, random, sys
from PIL import Image, ImageDraw

W, H, S = 96, 136, 3
OUT = 'www/assets/cards'
CARDS = json.load(open(os.path.join(os.path.dirname(__file__), 'tower_cards.json')))

def hx(c, a=255):
    c = c.lstrip('#'); return (int(c[0:2], 16), int(c[2:4], 16), int(c[4:6], 16), a)
def mix(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3)) + (255,)
def lit(c, k):  # k>0 lighter, k<0 darker
    return mix(c, (255, 255, 255) if k > 0 else (0, 0, 0), abs(k))

INK = hx('2a1610'); CREAM = hx('fbeec4'); CREAM2 = hx('efd99c'); WHITE = hx('ffffff')
GOLD = hx('ffd23a'); GOLD2 = hx('d8961a'); GRAY = hx('5a5e66'); GRAY2 = hx('3a3d44')
EL = {
    'fire':  dict(dark=hx('6e0e0e'), main=hx('c42420'), mid=hx('de4a2c'), light=hx('f6a24c'), pale=hx('ffd9a8')),
    'water': dict(dark=hx('0e2a66'), main=hx('1f56b8'), mid=hx('3f80e2'), light=hx('8fcaf6'), pale=hx('d4ecff')),
    'grass': dict(dark=hx('124a1a'), main=hx('2a8a2e'), mid=hx('4bb244'), light=hx('a8e27a'), pale=hx('dcf5c4')),
}

class Px:
    """A tiny pixel canvas: everything is drawn at 1x on whole pixels."""
    def __init__(s, w, h, k=1.0):
        # k scales the coordinates given to the drawing helpers (icons are designed on a 48 grid, drawn bigger)
        s.w, s.h, s.k = w, h, k; s.im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); s.p = s.im.load()
    def dot(s, x, y, c):  # a single icon-grid pixel (scaled)
        s.rect(x, y, x, y, c)
    def put(s, x, y, c):
        if 0 <= x < s.w and 0 <= y < s.h: s.p[int(x), int(y)] = c
    def get(s, x, y):
        return s.p[int(x), int(y)] if 0 <= x < s.w and 0 <= y < s.h else (0, 0, 0, 0)
    def rect(s, x0, y0, x1, y1, c):
        k = s.k; x0, y0 = round(x0 * k), round(y0 * k); x1, y1 = round((x1 + 1) * k) - 1, round((y1 + 1) * k) - 1
        for y in range(int(y0), int(y1) + 1):
            for x in range(int(x0), int(x1) + 1): s.put(x, y, c)
    def ell(s, cx, cy, rx, ry, c, fill=True):
        k = s.k; cx, cy, rx, ry = cx * k, cy * k, rx * k, ry * k
        for y in range(int(cy - ry) - 1, int(cy + ry) + 2):
            for x in range(int(cx - rx) - 1, int(cx + rx) + 2):
                d = ((x + .5 - cx) / max(rx, .5)) ** 2 + ((y + .5 - cy) / max(ry, .5)) ** 2
                if (d <= 1) if fill else (.62 <= d <= 1): s.put(x, y, c)
    def line(s, x0, y0, x1, y1, c, w=1):
        k = s.k; x0, y0, x1, y1 = x0 * k, y0 * k, x1 * k, y1 * k; w = max(1, round(w * k))
        n = int(max(abs(x1 - x0), abs(y1 - y0))) + 1
        for i in range(n + 1):
            t = i / max(n, 1); x = round(x0 + (x1 - x0) * t); y = round(y0 + (y1 - y0) * t)
            for dx in range(w):
                for dy in range(w): s.put(x + dx - w // 2, y + dy - w // 2, c)
    def poly(s, pts, c):
        pts = [(x * s.k, y * s.k) for x, y in pts]
        ys = [p[1] for p in pts]
        for y in range(int(min(ys)), int(max(ys)) + 1):
            xs = []; yy = y + .5
            for i in range(len(pts)):
                (x0, y0), (x1, y1) = pts[i], pts[(i + 1) % len(pts)]
                if (y0 <= yy < y1) or (y1 <= yy < y0): xs.append(x0 + (yy - y0) * (x1 - x0) / (y1 - y0))
            xs.sort()
            for a, b in zip(xs[::2], xs[1::2]):
                for x in range(int(round(a)), int(round(b))): s.put(x, y, c)
    def ring(s, cx, cy, r, c, t=1):
        k = s.k; cx, cy, r, t = cx * k, cy * k, r * k, max(1, round(t * k))
        for y in range(int(cy - r) - 1, int(cy + r) + 2):
            for x in range(int(cx - r) - 1, int(cx + r) + 2):
                d = math.hypot(x + .5 - cx, y + .5 - cy)
                if r - t <= d <= r: s.put(x, y, c)
    def paste(s, o, ox, oy):
        for y in range(o.h):
            for x in range(o.w):
                c = o.p[x, y]
                if c[3]: s.put(ox + x, oy + y, c)
    def sprite(s, rows, ox, oy, pal):
        for y, row in enumerate(rows):
            for x, ch in enumerate(row):
                if ch in pal: s.put(ox + x, oy + y, pal[ch])

def opaque(px, x, y): return px.get(x, y)[3] > 0

def shade(px, keep=()):
    """Pixel-art shading: lit from the top-left. Edge pixels facing up/left get lighter, facing down/right get darker."""
    src = px.im.copy().load(); out = []
    for y in range(px.h):
        for x in range(px.w):
            c = src[x, y]
            if not c[3] or c in keep: continue
            up = src[x, y - 1][3] if y > 0 else 0; lf = src[x - 1, y][3] if x > 0 else 0
            dn = src[x, y + 1][3] if y < px.h - 1 else 0; rt = src[x + 1, y][3] if x < px.w - 1 else 0
            if not dn or not rt: out.append((x, y, lit(c, -.28)))
            elif not up or not lf: out.append((x, y, lit(c, .32)))
    for x, y, c in out: px.put(x, y, c)

def outline(px, c=INK, glow=WHITE):
    for col, src_ok in ((c, lambda q: q[3] > 0), (glow, lambda q: q[3] > 0)):
        src = px.im.copy().load(); add = []
        for y in range(px.h):
            for x in range(px.w):
                if src[x, y][3]: continue
                if any(0 <= x + dx < px.w and 0 <= y + dy < px.h and src[x + dx, y + dy][3] for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                    add.append((x, y))
        for x, y in add: px.put(x, y, col)
        if glow is None: break

# ---------------------------------------------------------------- icons (48x48, drawn flat, then shaded + outlined)
def C(h): return hx(h)
ICONS = {}
def icon(name):
    def deco(f): ICONS[name] = f; return f
    return deco

def ball(p, top, bottom=C('f4f4f4'), band=C('2a2a30')):
    p.ell(24, 24, 17, 17, bottom);
    k = p.k
    for y in range(round(6 * k), round(24 * k)):
        for x in range(round(4 * k), round(45 * k)):
            if p.get(x, y)[3]: p.put(x, y, top)
    p.rect(7, 23, 41, 25, band); p.ell(24, 24, 6, 6, band); p.ell(24, 24, 4, 4, C('f4f4f4')); p.ell(24, 24, 2, 2, C('d9d9d9'))

@icon('netball')
def _(p):
    ball(p, C('2fb4d8'))
    net = C('34373e')
    for x in (13, 20, 28, 35): p.rect(x, 8 if x in (20, 28) else 11, x, 22, net)
    for y in (12, 17): p.rect(8 if y == 17 else 11, y, 40 if y == 17 else 37, y, net)
    for x, y in ((13, 12), (20, 12), (28, 12), (35, 12), (13, 17), (20, 17), (28, 17), (35, 17)): p.rect(x - 1, y - 1, x + 1, y + 1, C('9aa0aa'))
@icon('quickball')
def _(p):
    ball(p, C('2c68d8'))
    p.line(24, 7, 24, 14, C('ffd23a'), 2); p.line(12, 12, 20, 19, C('ffd23a'), 2); p.line(36, 12, 28, 19, C('ffd23a'), 2)
    p.line(11, 30, 19, 36, C('ffd23a'), 2); p.line(37, 30, 29, 36, C('ffd23a'), 2)
@icon('charcoal')
def _(p):
    p.poly([(8, 30), (13, 18), (22, 13), (33, 15), (40, 24), (38, 35), (27, 40), (14, 38)], C('3a3a40'))
    for a, b, c, d in ((15, 24, 22, 29), (22, 29, 30, 25), (24, 18, 27, 24), (30, 31, 34, 35)): p.line(a, b, c, d, C('ff8a2a'), 1)
    p.poly([(20, 14), (24, 3), (27, 10), (30, 5), (31, 15)], C('ff6a1e')); p.poly([(23, 14), (25, 8), (28, 14)], C('ffd23a'))
@icon('mysticwater')
def _(p):
    p.poly([(24, 4), (35, 22), (37, 30), (33, 39), (24, 43), (15, 39), (11, 30), (13, 22)], C('3d8fe8'))
    p.ell(24, 31, 12, 12, C('3d8fe8')); p.ell(19, 27, 3, 5, C('bfe6ff')); p.rect(18, 21, 19, 22, WHITE)
@icon('miracleseed')
def _(p):
    p.ell(24, 33, 11, 9, C('b07a3a')); p.line(18, 33, 30, 33, C('8a5a28'))
    p.line(24, 25, 24, 14, C('3a9a2e'), 2); p.ell(17, 13, 7, 4, C('5cc44a')); p.ell(31, 11, 7, 4, C('5cc44a'))
@icon('muscleband')
def _(p):
    p.ell(24, 24, 18, 12, C('f0a020')); p.ell(24, 24, 11, 6, (0, 0, 0, 0))
    for x in (10, 18, 30, 38): p.rect(x, 16 if x in (18, 30) else 19, x + 1, (32 if x in (18, 30) else 29), C('d27a10'))
@icon('wiseglasses')
def _(p):
    for cx in (14, 34): p.ell(cx, 25, 9, 8, C('2a2a30')); p.ell(cx, 25, 7, 6, C('9fd8ff')); p.rect(cx - 4, 21, cx - 3, 22, WHITE)
    p.rect(22, 22, 26, 23, C('2a2a30')); p.line(5, 22, 2, 17, C('2a2a30'), 2); p.line(43, 22, 46, 17, C('2a2a30'), 2)
@icon('seedsurge')
def _(p):
    p.poly([(12, 28), (36, 28), (33, 44), (15, 44)], C('c46a2c')); p.rect(10, 26, 38, 30, C('d97e36'))
    p.ell(24, 27, 11, 2, C('5a3418'))
    p.line(24, 26, 24, 14, C('3a9a2e'), 2); p.ell(15, 17, 7, 3, C('5cc44a')); p.ell(33, 15, 7, 3, C('5cc44a'))
    p.ell(27, 10, 6, 6, C('3d6fe8')); p.ell(27, 6, 6, 3, C('a8642a'))
@icon('hotmeal')
def _(p):
    p.poly([(6, 24), (42, 24), (36, 38), (12, 38)], C('e8e2d4')); p.rect(6, 22, 42, 25, C('d64a2a'))
    p.ell(24, 23, 17, 3, C('f0a040')); p.rect(16, 38, 32, 40, C('c8c0b0'))
    for x in (16, 24, 32):
        for k in range(4): p.dot(x + (k % 2), 17 - k * 3, C('ffffff')); p.dot(x + (k % 2), 16 - k * 3, C('ffffff'))
@icon('revivalherb')
def _(p):
    p.line(24, 44, 24, 18, C('3a8a2e'), 2)
    for y, s in ((22, -1), (28, 1), (34, -1), (16, 1)): p.ell(24 + s * 8, y, 8, 3, C('6ad04a'))
    for x, y in ((10, 8), (38, 10), (36, 30)): p.rect(x, y - 2, x, y + 2, C('fff6a0')); p.rect(x - 2, y, x + 2, y, C('fff6a0'))
@icon('sturdyshell')
def _(p):
    p.poly([(24, 4), (40, 10), (38, 28), (24, 44), (10, 28), (8, 10)], C('4a8ad8')); p.poly([(24, 9), (35, 13), (34, 27), (24, 38), (14, 27), (13, 13)], C('8ac0f0'))
    p.line(24, 10, 24, 37, C('4a8ad8'), 2); p.line(14, 20, 34, 20, C('4a8ad8'), 2)
@icon('leftovers')
def _(p):
    p.ell(24, 11, 9, 6, C('e23a3a')); p.ell(24, 37, 9, 6, C('e23a3a')); p.rect(19, 12, 29, 36, C('fff1c8'))
    p.rect(22, 18, 23, 21, C('5a3418')); p.rect(25, 26, 26, 29, C('5a3418')); p.line(24, 5, 26, 1, C('6a4020'), 2); p.ell(29, 3, 4, 2, C('5cc44a'))
@icon('brightpowder')
def _(p):
    p.ell(24, 31, 13, 12, C('f2e6c8')); p.rect(19, 15, 29, 20, C('f2e6c8')); p.rect(17, 19, 31, 21, C('c46aa8'))
    for x, y in ((8, 8), (40, 6), (42, 26), (6, 28), (24, 4)): p.rect(x, y - 2, x, y + 2, C('fff6a0')); p.rect(x - 2, y, x + 2, y, C('fff6a0'))
    p.ell(24, 31, 5, 5, C('ffd2f0'))
@icon('minersdream')
def _(p):
    p.line(14, 40, 32, 14, C('a8642a'), 4); p.poly([(6, 18), (22, 6), (38, 6), (44, 16), (36, 12), (22, 13)], C('c8ccd4'))
    p.ell(27, 11, 4, 4, C('d8961a')); p.ell(27, 11, 2, 2, C('3ce05a')); p.rect(12, 38, 16, 42, C('d8961a'))
@icon('payday')
def _(p):
    for i, y in enumerate((36, 30, 24, 18)): p.ell(24 - (i % 2) * 3, y, 13, 5, C('ffcc2a')); p.ell(24 - (i % 2) * 3, y - 1, 9, 3, C('ffe27a'))
    p.ell(30, 12, 9, 9, C('ffcc2a')); p.ell(30, 12, 6, 6, C('ffe27a')); p.rect(29, 8, 31, 16, C('d8961a'))
@icon('staminasnack')
def _(p):
    p.poly([(6, 28), (34, 8), (42, 18), (14, 38)], C('7a4a2a')); p.poly([(10, 30), (28, 17), (35, 26), (17, 38)], C('e84a3a'))
    p.poly([(23, 22), (19, 29), (23, 28), (21, 34), (28, 25), (24, 26), (27, 21)], C('ffd23a'))
@icon('cramnotes')
def _(p):
    p.rect(9, 6, 35, 42, C('f6f0dc')); p.rect(9, 6, 12, 42, C('d84a3a'))
    for y in range(12, 40, 5): p.rect(15, y, 32, y, C('8ab0d8'))
    p.line(30, 40, 42, 14, C('ffcc2a'), 3); p.line(43, 12, 44, 9, C('f0a0a0'), 2); p.dot(29, 42, C('2a2a30'))
@icon('luckyegg')
def _(p):
    p.ell(24, 26, 13, 16, C('fbf6ea')); p.ell(24, 26, 13, 4, C('f05a5a')); p.ell(18, 17, 2, 2, C('8ac0ff')); p.ell(30, 35, 2, 2, C('8ac0ff'))
@icon('supplydrop')
def _(p):
    p.rect(8, 18, 40, 42, C('b07a3a')); p.rect(8, 18, 40, 22, C('c88a46')); p.rect(22, 18, 26, 42, C('8a5a28'))
    p.line(8, 18, 2, 4, C('8a8a8a')); p.line(40, 18, 46, 4, C('8a8a8a')); p.poly([(2, 4), (24, -2), (46, 4), (24, 8)], C('e84a3a'))
@icon('xattack')
def _(p):
    p.rect(17, 4, 31, 9, C('8a8a92')); p.rect(19, 9, 29, 14, C('d8d8e0'))
    p.poly([(12, 14), (36, 14), (40, 22), (40, 44), (8, 44), (8, 22)], C('e83a3a'))
    p.line(16, 24, 32, 38, C('ffffff'), 3); p.line(32, 24, 16, 38, C('ffffff'), 3)
@icon('quickclaw')
def _(p):
    for k in range(3):
        x = 10 + k * 11; p.poly([(x, 42), (x + 8, 42), (x + 12, 20), (x + 8, 6), (x + 6, 20)], C('e8e2d4'))
    p.rect(8, 38, 42, 44, C('a8642a'))
@icon('rockyhelmet')
def _(p):
    p.ell(24, 28, 17, 15, C('8a8a92')); p.rect(6, 28, 42, 44, (0, 0, 0, 0)); p.rect(5, 28, 43, 32, C('6a6a72'))
    for x, y in ((10, 18), (18, 12), (28, 12), (36, 18), (24, 9)): p.poly([(x - 3, y + 3), (x, y - 5), (x + 3, y + 3)], C('c8c0b0'))
@icon('expertbelt')
def _(p):
    p.rect(2, 20, 46, 28, C('2a2a30')); p.rect(16, 16, 32, 32, C('ffcc2a')); p.rect(20, 20, 28, 28, C('2a2a30')); p.rect(22, 22, 26, 26, C('ffcc2a'))
    p.line(14, 30, 8, 44, C('2a2a30'), 3); p.line(34, 30, 40, 44, C('2a2a30'), 3)
@icon('firststrike')
def _(p):
    p.poly([(36, 4), (44, 4), (44, 12), (18, 34), (14, 30)], C('d8dce4')); p.line(38, 8, 18, 30, WHITE)
    p.line(10, 26, 22, 38, C('d8961a'), 3); p.line(14, 34, 6, 42, C('7a4a2a'), 3)
@icon('tlc')
def _(p):
    p.ell(16, 18, 10, 10, C('f05a8a')); p.ell(32, 18, 10, 10, C('f05a8a')); p.poly([(6, 21), (42, 21), (24, 42)], C('f05a8a'))
    p.poly([(10, 30), (34, 10), (39, 15), (15, 35)], C('f6ecd6'))
    for x, y in ((20, 24), (24, 21), (28, 18), (22, 27)): p.dot(x, y, C('c8b8a0'))
@icon('guardup')
def _(p):
    p.poly([(24, 3), (42, 9), (40, 28), (24, 45), (8, 28), (6, 9)], C('3a7ae0')); p.poly([(24, 8), (37, 12), (35, 27), (24, 39), (13, 27), (11, 12)], C('5a9af0'))
    p.rect(21, 14, 27, 34, C('ffffff')); p.rect(14, 21, 34, 27, C('ffffff'))
@icon('eviolite')
def _(p):
    p.poly([(24, 3), (38, 16), (32, 42), (16, 42), (10, 16)], C('a070e0'))
    p.poly([(24, 3), (31, 16), (24, 42), (17, 16)], C('d8a8ff')); p.line(10, 16, 38, 16, C('8050c0'))
    p.poly([(17, 16), (24, 42), (16, 42), (10, 16)], C('70d0e8'))
@icon('protectivepads')
def _(p):
    p.ell(24, 24, 15, 18, C('e84a3a')); p.ell(24, 24, 9, 12, C('ff7a5a'))
    for y in (12, 34): p.rect(4, y, 44, y + 3, C('2a2a30'))
@icon('assaultvest')
def _(p):
    p.poly([(10, 6), (18, 6), (24, 14), (30, 6), (38, 6), (42, 18), (40, 44), (8, 44), (6, 18)], C('4a6a3a'))
    p.poly([(18, 6), (24, 14), (30, 6), (28, 18), (20, 18)], (0, 0, 0, 0)); p.rect(23, 18, 25, 44, C('2a3a22'))
    for y in (26, 34): p.rect(12, y, 20, y + 4, C('3a5a2a')); p.rect(28, y, 36, y + 4, C('3a5a2a'))
@icon('doubledip')
def _(p):
    for x in (8, 26):
        p.rect(x, 10, x + 14, 42, C('3ac05a')); p.rect(x + 4, 6, x + 10, 10, C('8a8a92')); p.rect(x + 2, 26, x + 12, 42, C('2a8a3a'))
    p.poly([(12, 20), (16, 14), (16, 18), (20, 18), (16, 24), (16, 20)], C('ffffff')); p.poly([(30, 20), (34, 14), (34, 18), (38, 18), (34, 24), (34, 20)], C('ffffff'))
@icon('amuletcoin')
def _(p):
    for i in range(10): a = math.pi * (i / 9); p.rect(24 + math.cos(a) * 16, 22 - math.sin(a) * 18, 24 + math.cos(a) * 16 + 1, 22 - math.sin(a) * 18 + 1, C('d8961a'))
    p.ell(24, 30, 12, 12, C('ffcc2a')); p.ell(24, 30, 8, 8, C('ffe27a')); p.rect(23, 25, 25, 35, C('d8961a'))
@icon('haggler')
def _(p):
    p.poly([(4, 24), (16, 10), (44, 10), (44, 38), (16, 38)], C('f4d36a')); p.ell(15, 24, 3, 3, C('2a1610'))
    p.rect(22, 18, 38, 20, C('c84a3a')); p.rect(22, 26, 34, 28, C('c84a3a')); p.line(4, 24, 0, 30, C('8a5a28'))
@icon('fury')
def _(p):
    p.poly([(10, 44), (6, 26), (14, 30), (12, 12), (22, 22), (24, 2), (30, 20), (36, 10), (36, 28), (42, 22), (38, 44)], C('ff5a1e'))
    p.poly([(16, 44), (14, 32), (22, 36), (24, 22), (28, 34), (34, 30), (32, 44)], C('ffd23a'))
    p.line(17, 30, 21, 33, C('2a1610'), 2); p.line(31, 30, 27, 33, C('2a1610'), 2)
@icon('lifeorb')
def _(p):
    p.ell(24, 26, 17, 17, C('8a3ad8')); p.ell(24, 26, 11, 11, C('b06af0')); p.ell(24, 26, 5, 5, C('3a0a5a')); p.ell(18, 18, 3, 3, C('e8c8ff'))
@icon('scopelens')
def _(p):
    p.ell(20, 20, 15, 15, C('2a2a30')); p.ell(20, 20, 12, 12, C('ffa8a8')); p.line(32, 32, 44, 44, C('2a2a30'), 5)
    p.rect(19, 9, 21, 31, C('d82a2a')); p.rect(9, 19, 31, 21, C('d82a2a')); p.ell(15, 14, 3, 2, C('ffffff'))
@icon('focussash')
def _(p):
    p.poly([(4, 10), (12, 4), (44, 36), (36, 44)], C('ff8a1e')); p.poly([(8, 8), (11, 6), (42, 37), (39, 40)], C('ffb05a'))
    p.poly([(30, 38), (26, 46), (34, 42)], C('ff8a1e')); p.poly([(38, 30), (46, 26), (42, 34)], C('ff8a1e'))
@icon('shellbell')
def _(p):
    p.poly([(24, 4), (38, 30), (40, 38), (8, 38), (10, 30)], C('f2a8c8'))
    for x in (16, 24, 32): p.line(24, 6, x, 36, C('d878a8'))
    p.rect(6, 37, 42, 40, C('e888b8')); p.ell(24, 43, 4, 3, C('ffd23a'))
@icon('frenzy')
def _(p):
    pts = []
    for i in range(16): r = 21 if i % 2 == 0 else 11; a = i / 16 * 2 * math.pi; pts.append((24 + math.cos(a) * r, 24 + math.sin(a) * r))
    p.poly(pts, C('ff6a1e')); p.rect(12, 18, 36, 30, C('ffd23a')); p.rect(14, 20, 34, 28, C('ffe9a0'))
    p.rect(22, 18, 23, 30, C('d8961a')); p.ell(29, 24, 3, 3, C('d8961a'))
@icon('thief')
def _(p):
    p.ell(24, 30, 16, 14, C('a8783a')); p.rect(18, 10, 30, 18, C('a8783a')); p.rect(16, 16, 32, 19, C('6a4020'))
    p.ell(24, 31, 6, 6, C('ffcc2a')); p.rect(23, 27, 25, 35, C('d8961a'))
@icon('choiceband')
def _(p):
    p.rect(4, 16, 44, 26, C('2f5fd8')); p.rect(4, 16, 44, 18, C('5a8af0')); p.rect(4, 24, 44, 26, C('1f3fa0'))
    p.rect(19, 15, 29, 27, C('f4f4f4')); p.ell(24, 21, 3, 3, C('2f5fd8'))
    p.poly([(34, 26), (38, 26), (44, 44), (39, 42)], C('2f5fd8')); p.poly([(30, 26), (34, 26), (32, 46), (28, 44)], C('1f3fa0'))
@icon('secondwind')
def _(p):
    p.poly([(34, 4), (40, 8), (30, 30), (16, 42), (12, 40), (20, 26)], C('f4f4f4'))
    p.line(36, 7, 15, 40, C('b8c8d8'), 1)
    for (y, x0, x1) in ((14, 2, 18), (24, 6, 22), (34, 24, 44)):
        p.rect(x0, y, x1, y + 1, C('8fd0ff')); p.ring(x1 + 1, y - 3, 4, C('8fd0ff'), 1.5)
@icon('goldenticket')
def _(p):
    p.poly([(4, 14), (44, 14), (44, 20), (41, 24), (44, 28), (44, 36), (4, 36), (4, 28), (7, 24), (4, 20)], C('ffcc2a'))
    p.rect(9, 18, 39, 32, C('ffe27a')); p.rect(29, 15, 29, 35, C('d8961a'))
    p.poly([(17, 20), (19, 24), (23, 24), (20, 27), (21, 31), (17, 28), (13, 31), (14, 27), (11, 24), (15, 24)], C('ff9a1e'))
@icon('cardshark')
def _(p):
    for k, a in enumerate((-36, -12, 12, 36)):
        cx, cy = 24 + a * .42, 30; ang = math.radians(a)
        rot = lambda x, y: (cx + x * math.cos(ang) - y * math.sin(ang), cy + x * math.sin(ang) + y * math.cos(ang))
        p.poly([rot(x, y) for x, y in ((-9, -17), (9, -17), (9, 15), (-9, 15))], C('34373e'))
        p.poly([rot(x, y) for x, y in ((-8, -16), (8, -16), (8, 14), (-8, 14))], C('fbf4e2'))
        mx, my = rot(0, -4); suit = C('d82a2a') if k % 2 else C('34373e')
        p.ell(mx, my, 3, 3, suit)
@icon('ultraburst')
def _(p):
    pts = []
    for i in range(20): r = 22 if i % 2 == 0 else 9; a = i / 20 * 2 * math.pi - math.pi / 2; pts.append((24 + math.cos(a) * r, 24 + math.sin(a) * r))
    p.poly(pts, C('ffe25a')); p.ell(24, 24, 8, 8, C('ffffff'))
    for i, c in enumerate(('ff5a5a', 'ffb03a', '5ad05a', '3ab0ff', 'b06af0')): p.dot(24 - 2 + i, 24, C(c)); p.dot(24 - 2 + i, 25, C(c))
@icon('sacredash')
def _(p):
    p.poly([(14, 22), (34, 22), (38, 34), (32, 44), (16, 44), (10, 34)], C('c8b098')); p.rect(12, 20, 36, 23, C('a89070')); p.rect(18, 16, 30, 20, C('c8b098'))
    for k, c in enumerate(('ff5a5a', 'ffb03a', 'ffe25a', '5ad05a', '3ab0ff')):
        p.line(24, 15, 10 + k * 7, 2, C(c), 2)
    p.rect(16, 30, 32, 33, C('ffcc2a'))

EMB = {  # element symbols, 9x9
    'fire': ['....#....', '...##....', '...###...', '..####.#.', '.#######.', '.###.###.', '.##...##.', '..##.##..', '...###...'],
    'water': ['....#....', '....#....', '...###...', '...###...', '..#####..', '.###.###.', '.##.####.', '..#####..', '...###...'],
    'grass': ['......###', '....#####', '...######', '..####.##', '.####.##.', '.###.###.', '..#.###..', '.#.##....', '#........'],
}
STAR = ['....#....', '...###...', '#########', '.#######.', '..#####..', '..##.##..', '.##...##.']

def interior(px, rar, x0, y0, w, h, el):
    E = EL[el]; mid = y0 + h // 2
    tops = {1: C('e0352c'), 2: C('2c63d4'), 3: C('2a2a32'), 4: C('2c63d4'), 5: C('7a3ec0')}
    top = tops[rar]
    for y in range(y0, y0 + h):
        for x in range(x0, x0 + w):
            if rar == 4:
                c = top if y < mid else lit(top, -.12)
            elif y < mid - 2:
                c = top
            else:  # dithered gradient into white
                t = (y - (mid - 2)) / max(1, (y0 + h - (mid - 2)))
                steps = [lit(top, .25), lit(top, .55), C('f2ece0'), WHITE]
                k = min(3, int(t * 4.2)); c2 = steps[min(3, k + 1)]
                frac = t * 4.2 - k
                c = c2 if ((x + y) % 2 == 0 and frac > .5) or frac > .85 else steps[k]
            px.put(x, y, c)
    if rar == 1:
        px.rect(x0, mid - 3, x0 + w - 1, mid - 2, lit(top, -.35))
    if rar == 2:  # Great Ball: red patches on each side, a little above the middle
        for sx in (x0, x0 + w - 9):
            px.rect(sx, mid - 14, sx + 8, mid - 7, C('e0352c')); px.rect(sx + (1 if sx == x0 else 0), mid - 13, sx + 7, mid - 13, lit(C('e0352c'), .3))
    if rar == 3:  # Ultra Ball: two yellow stripes painted down to about halfway
        for sx in (x0 + w // 4 - 3, x0 + 3 * w // 4 - 3):
            for y in range(y0, mid + 2):
                px.rect(sx, y, sx + 5, y, C('ffd23a') if y < mid - 1 else C('d8961a'))
            px.rect(sx + 1, y0, sx + 1, mid - 2, C('fff09a'))
    if rar == 4:  # Quick Ball: yellow zigzags down from the top, mirrored up from the bottom
        for sx in (x0 + 10, x0 + w // 2 - 2, x0 + w - 14):
            for y in range(y0, mid - 1):
                x = sx + (3 - abs(((y - y0) % 8) - 4)); px.rect(x, y, x + 2, y, C('ffd23a'))
            for y in range(mid + 1, y0 + h):
                x = sx + (abs(((y0 + h - y) % 8) - 4) - 1); px.rect(x, y, x + 2, y, C('ffd23a'))
        px.rect(x0, mid - 1, x0 + w - 1, mid, C('1a3a8a'))
    if rar == 5:  # Master Ball: two pink-red ovals set diagonally on each side
        for cx, s in ((x0 + 12, 1), (x0 + w - 13, -1)):
            for t in range(-6, 7):
                px.ell(cx + t * .35 * s, mid - 14 + t * .55, 4.5, 4.5, C('e8467a'))
            px.ell(cx - 1 * s, mid - 17, 1.5, 1.5, C('ffb0c8'))
    # soft lit spot behind the icon (dithered) and a few sparkles in the element's light colour
    cx, cy = x0 + w // 2, y0 + h // 2
    for y in range(y0, y0 + h):
        for x in range(x0, x0 + w):
            d = math.hypot((x - cx) / 1.15, y - cy)
            if d < 20 and (x + y) % 2 == 0: px.put(x, y, lit(px.get(x, y), .35))
            elif d < 25 and (x + y) % 4 == 0: px.put(x, y, lit(px.get(x, y), .2))
    rnd = random.Random(rar * 7 + len(el))
    for _ in range(6):
        sx, sy = rnd.randint(x0 + 3, x0 + w - 4), rnd.randint(y0 + 3, y0 + h - 4)
        if abs(sx - cx) < 22 and abs(sy - cy) < 20: continue
        px.put(sx, sy, CREAM); px.put(sx - 1, sy, CREAM); px.put(sx + 1, sy, CREAM); px.put(sx, sy - 1, CREAM); px.put(sx, sy + 1, CREAM)

def rounded(px, x0, y0, x1, y1, r, c):
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            dx = max(x0 + r - x, 0, x - (x1 - r)); dy = max(y0 + r - y, 0, y - (y1 - r))
            if dx * dx + dy * dy <= r * r + r: px.put(x, y, c)

def pokeball_mark(px, cx, cy, r, E):
    px.ell(cx, cy, r, r, CREAM); px.ell(cx, cy, r - 1, r - 1, E['mid'])
    px.rect(cx - r, cy, cx + r - 1, cy, CREAM); px.ell(cx, cy, 2, 2, CREAM); px.put(cx - 1, cy - 1, E['mid'])

def card(cd):
    el, rar = cd['el'], cd['rar']; E = EL[el]; px = Px(W, H); rnd = random.Random(cd['id'])
    # outer border with a grainy texture, cream line, inner panel
    rounded(px, 0, 0, W - 1, H - 1, 6, E['main'])
    for y in range(H):
        for x in range(W):
            if px.get(x, y)[3] and rnd.random() < .16: px.put(x, y, E['mid'] if rnd.random() < .5 else lit(E['main'], -.15))
    rounded(px, 3, 3, W - 4, H - 4, 5, CREAM); rounded(px, 4, 4, W - 5, H - 5, 4, E['dark'])
    for y in range(5, H - 5):
        for x in range(5, W - 5):
            if px.get(x, y) == E['dark'] and (x // 2 + y // 2) % 2 == 0: px.put(x, y, lit(E['dark'], .12))
    # header: element emblem, star bar
    px.ell(15, 15, 10, 10, CREAM); px.ell(15, 15, 8.5, 8.5, E['main']); px.ell(15, 15, 6.5, 6.5, E['pale'])
    px.sprite(EMB[el], 11, 11, {'#': E['main']})
    px.poly([(25, 6), (90, 6), (90, 18), (84, 22), (27, 22), (25, 20)], CREAM)
    for y in range(7, 22):
        for x in range(26, 90):
            if px.get(x, y) == CREAM and (x + y) % 6 == 0: px.put(x, y, CREAM2)
    for i in range(5):
        px.sprite(STAR, 29 + i * 11, 10, {'#': GOLD if i < rar else GRAY})
        if i < rar: px.put(29 + i * 11 + 4, 11, hx('fff6c0')); px.put(29 + i * 11 + 3, 12, hx('fff6c0'))
    for x in range(85, 89, 2): px.rect(x, 9, x, 18, E['mid'])
    # interior (Poké Ball pattern by rarity) with a cream frame
    ix0, iy0, iw, ih = 7, 25, 82, 65
    px.rect(ix0 - 1, iy0 - 1, ix0 + iw, iy0 + ih, CREAM); interior(px, rar, ix0, iy0, iw, ih, el)
    # icon
    ic = Px(64, 64, 64 / 48); ICONS[cd['id']](ic); shade(ic); outline(ic); px.paste(ic, ix0 + iw // 2 - 32, iy0 + ih // 2 - 32)
    # name banner with Poké Ball marks at both ends
    px.rect(5, 93, W - 6, 105, CREAM); px.rect(5, 94, W - 6, 104, E['main'])
    for x in range(5, W - 5):
        if (x // 2) % 2 == 0: px.put(x, 93, CREAM2)
    px.rect(18, 95, W - 19, 103, lit(E['main'], -.12))
    pokeball_mark(px, 11, 99, 5, E); pokeball_mark(px, W - 12, 99, 5, E)
    # text box
    px.rect(7, 107, W - 8, 127, E['dark']); px.rect(8, 108, W - 9, 126, CREAM)
    for y in range(108, 127):
        for x in range(8, W - 8):
            if (x < 13 or x > W - 14) and (x + y) % 2 == 0: px.put(x, y, CREAM2)
    # bottom: lines and a little Poké Ball
    for y in (130, 132): px.rect(12, y, 40, y, E['light']); px.rect(W - 41, y, W - 13, y, E['light'])
    pokeball_mark(px, W // 2, 131, 4, E)
    return px.im.resize((W * S, H * S), Image.NEAREST)

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True); ims = []
    for cd in CARDS:
        im = card(cd); im.save(os.path.join(OUT, cd['id'] + '.png'), optimize=True); ims.append(im)
    if '--sheet' in sys.argv:
        cols = 9; rows = (len(ims) + cols - 1) // cols; sh = Image.new('RGBA', (cols * W * S, rows * H * S), (40, 40, 48, 255))
        for i, im in enumerate(ims): sh.paste(im, ((i % cols) * W * S, (i // cols) * H * S), im)
        sh.save(sys.argv[sys.argv.index('--sheet') + 1])
    print(len(ims), 'cards')
