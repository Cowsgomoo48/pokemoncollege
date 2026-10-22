# Pixel-art habitat decor in the style of the shop background: cel shading (shadow / base / light),
# outlines in a dark tone of each object's own colour (not black), warm muted palette.
# Shapes are drawn on a 256 canvas, rendered without anti-aliasing at a small size, then outlined.
# usage: python3 make_decor_pixel.py   (writes the 12 decor PNGs in www/assets/items)
import json, os, subprocess, sys, tempfile, colorsys
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from make_items_soft import gear, star4, circ, ell, rr, OUT

G, L, F = 'gl', 'ln', 'fl'
def daisy(cx, cy, pr, col, mid):
    import math
    return [(G, circ(cx + pr * math.cos(a), cy + pr * math.sin(a), pr * .72), col) for a in [i * 2 * math.pi / 5 - math.pi / 2 for i in range(5)]] + [(G, circ(cx, cy, pr * .58), mid)]
DECOR = {
 'grass': [(G, 'M58 224 C52 186 40 160 26 136 C56 158 74 190 82 224 Z', '#4f8f45'), (G, 'M150 224 C166 176 192 150 226 130 C204 170 186 198 178 224 Z', '#4f8f45'),
           (G, 'M92 224 C88 160 94 108 108 62 C118 118 118 172 120 224 Z', '#79b856'), (G, 'M116 224 C122 150 142 100 172 60 C162 120 150 170 148 224 Z', '#68a94f'),
           (G, 'M70 224 C84 190 104 170 128 158 C114 186 106 204 104 224 Z', '#8cc864'), (G, ell(128, 226, 92, 10), '#7a5a3a')],
 'rock': [(G, ell(92, 188, 64, 42), '#9c9a94'), (G, ell(172, 198, 54, 34), '#b5a996'), (G, ell(132, 136, 48, 36), '#8f98a3'),
          (G, 'M84 160 C96 150 116 150 124 160 C112 166 96 166 84 160 Z', '#78a456'), (L, 'M150 120 L160 132', '#6f7782', 6)],
 'flower': [(L, 'M78 226 C78 186 74 158 70 132', '#4f8a45', 10), (L, 'M132 226 C132 176 134 136 136 102', '#4f8a45', 10), (L, 'M184 226 C184 188 188 160 192 138', '#4f8a45', 10),
            (G, 'M132 196 C104 182 96 166 100 154 C120 160 130 176 132 196 Z', '#68a94f'), (G, 'M184 204 C206 188 218 178 226 172 C220 194 202 204 184 204 Z', '#68a94f'),
            (G, 'M78 206 C58 196 50 184 52 176 C68 180 76 192 78 206 Z', '#68a94f'),
            *daisy(70, 116, 24, '#f08aaa', '#f6c85a'), *daisy(136, 84, 26, '#f4cf55', '#e88a3a'), *daisy(192, 124, 22, '#8fb2ea', '#f6d86a')],
 'path': [(G, ell(128, 170, 104, 56), '#bdb2a0'), (G, ell(122, 160, 82, 38), '#cfc5b3'), (G, 'M56 184 C66 164 100 164 106 180 C98 196 70 202 56 184 Z', '#7ea85a'),
          (L, 'M150 142 L164 158 L158 174', '#968b7a', 6), (F, circ(190, 176, 6), '#a69b89')],
 'candle': [(G, ell(128, 214, 74, 16), '#c99a4a'), (G, rr(94, 98, 68, 116, 14), '#f3e2c4'),
            (G, 'M94 112 C94 94 162 94 162 112 L162 130 C154 140 148 122 144 134 C138 152 128 122 122 136 C116 148 106 126 102 134 C98 140 94 128 94 122 Z', '#fbf1dc'),
            (L, 'M128 98 L128 82', '#4a3a2a', 6), (G, 'M128 26 C148 50 148 70 128 84 C108 70 108 50 128 26 Z', '#f6a23a'), (F, 'M128 50 C137 60 137 72 128 78 C119 72 119 60 128 50 Z', '#fff0a0')],
 'lantern': [(L, 'M104 62 C104 28 152 28 152 62', '#6e4a2a', 8),
             (G, 'M88 76 C58 102 58 170 88 196 L168 196 C198 170 198 102 168 76 Z', '#e8704a'), (G, 'M100 92 C84 116 84 158 100 182 L156 182 C172 158 172 116 156 92 Z', '#f6b46a'),
             (L, 'M128 80 L128 192', '#c9502e', 6), (L, 'M106 82 C92 114 92 160 106 190', '#c9502e', 6), (L, 'M150 82 C164 114 164 160 150 190', '#c9502e', 6),
             (G, rr(94, 58, 68, 20, 7), '#c9963c'), (G, rr(94, 192, 68, 20, 7), '#c9963c'), (L, 'M128 212 L128 238', '#d9503a', 8)],
 'mushroom': [(G, 'M178 196 C176 212 176 222 178 226 L204 226 C206 222 206 212 204 196 Z', '#efe0c8'), (G, 'M156 200 C156 168 226 168 226 200 C214 206 168 206 156 200 Z', '#d9763a'),
              (G, 'M104 150 C100 190 96 214 100 224 L156 224 C160 214 156 190 152 150 Z', '#f3e6d0'),
              (G, 'M30 156 C30 80 226 80 226 156 C200 168 56 168 30 156 Z', '#dc4a44'),
              (F, circ(88, 114, 14), '#fbefe4'), (F, circ(140, 98, 11), '#fbefe4'), (F, circ(182, 128, 13), '#fbefe4'), (F, circ(120, 140, 9), '#fbefe4'), (F, circ(60, 142, 8), '#fbefe4')],
 'sign': [(G, rr(118, 112, 20, 112, 6), '#93633a'), (G, 'M52 70 L182 70 L214 102 L182 134 L52 134 C44 134 40 128 40 122 L40 82 C40 76 44 70 52 70 Z', '#c99257'),
          (L, 'M56 90 L172 90', '#a8743f', 5), (L, 'M56 114 L150 114', '#a8743f', 5), (F, circ(62, 102, 6), '#5a3c22'), (F, circ(176, 102, 6), '#5a3c22'),
          (G, 'M98 228 C102 210 112 204 118 200 C116 212 114 220 116 228 Z', '#68a94f'), (G, 'M158 228 C154 210 144 204 138 200 C140 212 142 220 140 228 Z', '#68a94f')],
 'crystal': [(G, ell(128, 212, 100, 20), '#7d7f8f'), (G, 'M70 100 L94 130 L100 212 L64 212 L50 132 Z', '#a98ee6'), (G, 'M188 90 L210 124 L198 212 L160 212 L164 120 Z', '#84d9c6'),
             (G, 'M128 28 L160 80 L152 210 L104 210 L96 80 Z', '#79c6ea'), (G, 'M128 30 L160 80 L152 210 L128 210 Z', '#5aa6d6')],
 'bowl': [(G, ell(128, 200, 74, 12), '#a8443e'), (G, ell(128, 118, 106, 16), '#e98a7e'), (G, 'M48 120 C56 80 200 80 208 120 Z', '#b9834a'),
          (F, circ(90, 104, 9), '#8f5e32'), (F, circ(128, 92, 9), '#8f5e32'), (F, circ(162, 106, 9), '#8f5e32'), (F, circ(112, 112, 8), '#8f5e32'), (F, circ(146, 96, 7), '#d4a46a'),
          (G, 'M24 118 L232 118 C226 172 196 200 128 200 C60 200 30 172 24 118 Z', '#d6554e'), (G, rr(24, 118, 208, 12, 6), '#e8746a'),
          (F, ell(128, 168, 16, 13), '#fbe9dc'), (F, circ(108, 148, 7), '#fbe9dc'), (F, circ(128, 142, 7), '#fbe9dc'), (F, circ(148, 148, 7), '#fbe9dc')],
 'dummy': [(G, rr(78, 226, 100, 20, 8), '#6e4a2a'), (G, rr(118, 150, 20, 82, 6), '#93633a'), (G, rr(38, 116, 180, 18, 9), '#a5713e'),
           (G, 'M40 116 L22 108 L30 125 L20 142 L40 134 Z', '#e2c06a'), (G, 'M216 116 L234 108 L226 125 L236 142 L216 134 Z', '#e2c06a'),
           (G, 'M88 96 C80 120 80 190 96 206 L160 206 C176 190 176 120 168 96 Z', '#d6b27c'), (G, circ(128, 62, 34), '#dcbb86'),
           (L, 'M92 112 L164 112', '#8a5c34', 8), (L, 'M88 190 L168 190', '#8a5c34', 8), (L, 'M106 96 L150 96', '#8a5c34', 8),
           (G, circ(128, 150, 27), '#d9483e'), (F, circ(128, 150, 18), '#f6eee2'), (F, circ(128, 150, 9), '#d9483e'), (L, 'M114 54 L118 58 M138 54 L142 58', '#8a5c34', 5)],
 'bed': [(G, ell(128, 146, 116, 66), '#5f86c9'), (G, ell(128, 132, 80, 32), '#f3e6d0'), (G, ell(100, 126, 32, 16), '#fbf3e6'),
         (G, 'M12 146 C16 216 240 216 244 146 C234 192 22 192 12 146 Z', '#4c70b4'),
         (F, circ(64, 182, 5), '#dfe8f6'), (F, circ(104, 192, 5), '#dfe8f6'), (F, circ(152, 192, 5), '#dfe8f6'), (F, circ(192, 182, 5), '#dfe8f6')],
}
RES = {'bowl': 72, 'dummy': 72, 'bed': 76}   # canvas 256 -> this many pixels; small decor uses 46
from decor_pack2 import SMALL as _S2, MEDIUM as _M2
for _k, (_n, _t, _d, _sh) in _S2.items(): DECOR[_k] = _sh
for _k, (_n, _t, _d, _sh) in _M2.items(): DECOR[_k] = _sh; RES[_k] = 80

PAGE = r"""<!doctype html><html><body style="margin:0;background:transparent"><div id="root"></div><script>
const hx=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255);
function hsl([r,g,b]){const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let h=0,s=0;if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h*=60}return [h,s,l]}
const css=(h,s,l)=>'hsl('+h.toFixed(0)+','+(Math.max(0,Math.min(1,s))*100).toFixed(0)+'%,'+(Math.max(0,Math.min(1,l))*100).toFixed(0)+'%)';
function tones(c){const [h,s,l]=hsl(hx(c));return {light:css(h-6,s*.95,l+(1-l)*.38),base:css(h,s,l),dark:css(h+8,Math.min(1,s*1.08),l*.74)}}
const NS='http://www.w3.org/2000/svg';let uid=0;
function el(tag,attrs,parent){const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e}
function build(name,shapes,px,idmap){const svg=el('svg',{id:name+(idmap?'_id':''),width:px,height:px,viewBox:'0 0 256 256','shape-rendering':'crispEdges'});document.getElementById('root').appendChild(svg);const defs=el('defs',{},svg);const o=256/px;
 shapes.forEach((s,i)=>{const [kind,d,col]=s,t=tones(col),id='s'+(uid++);const flat='rgb('+(i+1)+',0,0)';
  if(kind==='ln'){el('path',{d,fill:'none',stroke:idmap?flat:t.base,'stroke-width':s[3],'stroke-linecap':'round','stroke-linejoin':'round'},svg);return}
  if(idmap||kind==='fl'){el('path',{d,fill:idmap?flat:t.base},svg);return}
  const cp=el('clipPath',{id:id+'c'},defs);el('path',{d},cp);const g=el('g',{'clip-path':'url(#'+id+'c)'},svg);
  el('path',{d,fill:t.dark},g);const c2=el('clipPath',{id:id+'d'},defs);el('path',{d,transform:'translate('+(-1.6*o)+','+(-1.6*o)+')'},c2);
  const g2=el('g',{'clip-path':'url(#'+id+'d)'},g);el('path',{d,fill:t.light},g2);el('path',{d,fill:t.base,transform:'translate('+(1.1*o)+','+(1.1*o)+')'},g2)})}
for(const [name,[shapes,px]] of Object.entries(DATA)){build(name,shapes,px,false);build(name,shapes,px,true)}
</script></body></html>"""

def hsl_dark(rgb, k, hue_to=20, mix=.3):
    h, l, s = colorsys.rgb_to_hls(*[c / 255 for c in rgb[:3]])
    if max(rgb[:3]) - min(rgb[:3]) < 24 or s < .14: r, g, b = colorsys.hls_to_rgb(.08, max(0, l * k), .14); return (round(r * 255), round(g * 255), round(b * 255), 255)
    hh = h * 360; dh = (hue_to - hh + 540) % 360 - 180; hh = hh + (dh * mix if abs(dh) < 90 else 0)
    r, g, b = colorsys.hls_to_rgb((hh % 360) / 360, max(0, l * k), min(1, s * 1.1 + .08))
    return (round(r * 255), round(g * 255), round(b * 255), 255)

def main():
    tmp = tempfile.mkdtemp(); html = os.path.join(tmp, 'd.html')
    data = {k: [[list(s) for s in v], RES.get(k, 46)] for k, v in DECOR.items()}
    open(html, 'w').write(PAGE.replace('Object.entries(DATA)', 'Object.entries(' + json.dumps(data) + ')'))
    js = os.path.join(tmp, 'shot.js')
    open(js, 'w').write("""const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => { const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
 const p = await b.newPage({ deviceScaleFactor: 1 }); await p.goto('file://%s'); await p.waitForTimeout(300);
 for (const n of %s) for (const sfx of ['', '_id']) await p.locator('#' + n + sfx).screenshot({ path: '%s/' + n + sfx + '.png', omitBackground: true });
 await b.close() })();""" % (html, json.dumps(list(DECOR)), tmp))
    subprocess.run(['node', js], check=True)
    for n in DECOR:
        im = Image.open(os.path.join(tmp, n + '.png')).convert('RGBA'); idm = Image.open(os.path.join(tmp, n + '_id.png')).convert('RGBA')
        flat = {i + 1 for i, sh in enumerate(DECOR[n]) if sh[0] == F}
        W, H = im.size; a = im.load(); ids = idm.load(); out = im.copy(); o = out.load()
        ida = lambda x, y: ids[x, y][0] if 0 <= x < W and 0 <= y < H and ids[x, y][3] > 128 else 0
        for y in range(H):
            for x in range(W):
                if a[x, y][3] < 128: o[x, y] = (0, 0, 0, 0); continue
                me = ida(x, y); nb = [ida(x + dx, y + dy) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))]
                if 0 in nb: o[x, y] = hsl_dark(a[x, y], .42)              # silhouette outline
                elif me not in flat and any(v < me and v not in flat for v in nb): o[x, y] = hsl_dark(a[x, y], .62, mix=.15)   # edge of a part in front
                else: o[x, y] = a[x, y][:3] + (255,)
        bb = out.getbbox(); out = out.crop((bb[0] - 1, bb[1] - 1, bb[2] + 1, bb[3] + 1))
        out.save(os.path.join(OUT, n + '.png'), optimize=True); print(n, out.size)
if __name__ == '__main__': main()
