# Redraws every item / decor sprite as soft, glossy painted art (gradient fill, coloured outline,
# white highlight, scattered light spots, pastel rainbow sheen), rendered to PNG with headless Chromium.
# usage: python3 make_items_soft.py   (writes www/assets/items/*.png)
import json, math, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, '..', 'www', 'assets', 'items')

def gear(cx, cy, R, r, n, phase=0):
    pts = []
    for i in range(n):
        a = phase + i * 2 * math.pi / n; w = math.pi / n
        for da, rad in ((-w * .95, r), (-w * .45, R), (w * .45, R), (w * .95, r)):
            pts.append((cx + rad * math.cos(a + da), cy + rad * math.sin(a + da)))
    return 'M' + ' L'.join('%.1f %.1f' % p for p in pts) + ' Z'
def star4(cx, cy, s):
    return 'M%.1f %.1f Q%.1f %.1f %.1f %.1f Q%.1f %.1f %.1f %.1f Q%.1f %.1f %.1f %.1f Q%.1f %.1f %.1f %.1f Z' % (
        cx, cy - s, cx, cy, cx + s, cy, cx, cy, cx, cy + s, cx, cy, cx - s, cy, cx, cy, cx, cy - s)
def star5(cx, cy, R, r):
    pts = [(cx + (R if i % 2 == 0 else r) * math.sin(i * math.pi / 5), cy - (R if i % 2 == 0 else r) * math.cos(i * math.pi / 5)) for i in range(10)]
    return 'M' + ' L'.join('%.1f %.1f' % p for p in pts) + ' Z'
def circ(cx, cy, r): return 'M%.1f %.1f a%.1f %.1f 0 1 0 %.1f 0 a%.1f %.1f 0 1 0 %.1f 0 Z' % (cx - r, cy, r, r, 2 * r, r, r, -2 * r)
def ell(cx, cy, rx, ry): return 'M%.1f %.1f a%.1f %.1f 0 1 0 %.1f 0 a%.1f %.1f 0 1 0 %.1f 0 Z' % (cx - rx, cy, rx, ry, 2 * rx, rx, ry, -2 * rx)
def rr(x, y, w, h, r): return 'M%.1f %.1f h%.1f a%.1f %.1f 0 0 1 %.1f %.1f v%.1f a%.1f %.1f 0 0 1 %.1f %.1f h%.1f a%.1f %.1f 0 0 1 %.1f %.1f v%.1f a%.1f %.1f 0 0 1 %.1f %.1f Z' % (
    x + r, y, w - 2 * r, r, r, r, r, h - 2 * r, r, r, -r, r, -(w - 2 * r), r, r, -r, -r, -(h - 2 * r), r, r, r, -r)
def daisy(cx, cy, pr, col, mid):
    out = [('gl', circ(cx + pr * 1.05 * math.cos(a), cy + pr * 1.05 * math.sin(a), pr * .78), col) for a in [i * 2 * math.pi / 5 - math.pi / 2 for i in range(5)]]
    return out + [('gl', circ(cx, cy, pr * .62), mid)]

G, L, F, W = 'gl', 'ln', 'fl', 'glow'   # glossy shape, line, flat detail, soft glow
APPLE = 'M128 78 C100 60 52 66 46 116 C40 168 78 222 112 218 C120 217 124 212 128 212 C132 212 136 217 144 218 C178 222 216 168 210 116 C204 66 156 60 128 78 Z'
TICKET = 'M40 80 L216 80 Q220 80 220 84 L220 110 C206 112 206 144 220 146 L220 172 Q220 176 216 176 L40 176 Q36 176 36 172 L36 146 C50 144 50 112 36 110 L36 84 Q36 80 40 80 Z'
def gift(lid, body, rib, extra=()):
    return [(G, rr(54, 118, 148, 102, 12), body), (G, rr(42, 92, 172, 36, 12), lid), *extra,
            (G, rr(116, 92, 24, 128, 4), rib), (G, 'M128 94 C100 56 70 66 86 94 Z', rib), (G, 'M128 94 C156 56 186 66 170 94 Z', rib), (G, circ(128, 94, 11), rib)]
ITEMS = {
 'apple': [(L, 'M128 82 C128 62 134 48 142 40', '#7a4a2a', 10), (G, 'M136 70 C152 44 186 40 198 50 C186 72 162 80 136 70 Z', '#6cc06a'), (G, APPLE, '#e8424f')],
 'goldapple': [(L, 'M128 82 C128 62 134 48 142 40', '#7a4a2a', 10), (G, 'M136 70 C152 44 186 40 198 50 C186 72 162 80 136 70 Z', '#6cc06a'), (G, APPLE, '#f5c234'),
               (F, star4(54, 70, 18), '#fff3b0'), (F, star4(214, 92, 13), '#fff3b0'), (F, star4(206, 206, 10), '#fff3b0')],
 'cookie': [(G, gear(128, 134, 98, 80, 9), '#d9a05a'), (G, circ(128, 134, 30), '#fff0d2'), (F, circ(128, 134, 10), '#d9a05a'),
            (F, ell(88, 104, 10, 8), '#6b3d1f'), (F, ell(170, 112, 9, 8), '#6b3d1f'), (F, ell(82, 164, 9, 7), '#6b3d1f'), (F, ell(160, 178, 10, 8), '#6b3d1f'), (F, ell(124, 84, 7, 6), '#6b3d1f'), (F, ell(186, 152, 7, 6), '#6b3d1f')],
 'honey': [(L, 'M176 34 L150 108', '#a8723f', 11), (G, circ(178, 30, 10), '#a8723f'),
           (G, 'M70 104 C40 120 36 200 80 220 C110 232 146 232 176 220 C220 200 216 120 186 104 Z', '#f2a93b'), (G, rr(60, 86, 136, 30, 15), '#e38a34'),
           (G, 'M74 110 C90 113 106 113 122 110 C124 132 112 142 108 128 C104 140 92 138 96 122 C88 128 78 126 74 110 Z', '#ffd25a'),
           (F, rr(98, 150, 60, 46, 13), '#fff1d0'), (F, 'M128 160 L139 166 L139 178 L128 184 L117 178 L117 166 Z', '#f2a93b')],
 'riceball': [(G, 'M128 50 C150 50 220 160 222 190 C224 214 206 222 128 222 C50 222 32 214 34 190 C36 160 106 50 128 50 Z', '#f7f5f0'),
              (G, 'M86 158 C112 154 144 154 170 158 L178 220 C150 223 106 223 78 220 Z', '#2f4a3a'), (F, ell(102, 110, 5, 3), '#e9e2d4'), (F, ell(150, 122, 5, 3), '#e9e2d4')],
 'cake': [(G, ell(128, 214, 106, 18), '#e6edf7'), (G, 'M50 128 L206 128 L206 200 C206 214 50 214 50 200 Z', '#fbe3c0'), (F, rr(50, 166, 156, 10, 3), '#ff9fbd'),
          (G, 'M46 126 C46 102 210 102 210 126 L210 140 C200 150 192 140 186 148 C178 160 168 142 160 150 C150 158 142 142 132 152 C122 160 112 142 102 150 C94 158 86 142 76 150 C68 156 56 144 46 146 Z', '#ff9fbd'),
          (G, rr(121, 54, 14, 52, 6), '#8ec5ff'), (L, 'M128 54 L128 44', '#5a4632', 4), (G, 'M128 16 C142 32 142 42 128 46 C114 42 114 32 128 16 Z', '#ffb63a'), (W, '', '#ffe28a', (128, 34, 34)),
          (G, circ(82, 110, 14), '#e8424f'), (F, 'M74 98 L82 104 L90 98 L86 94 L82 98 L78 94 Z', '#5fb85c'), (G, circ(174, 110, 14), '#e8424f'), (F, 'M166 98 L174 104 L182 98 L178 94 L174 98 L170 94 Z', '#5fb85c')],
 'ball': [(G, circ(128, 132, 92), '#4a8fe8'), (G, 'M40 116 C80 98 176 98 216 116 L219 146 C176 128 80 128 37 146 Z', '#ffd34d')],
 'yarn': [(L, 'M196 196 C228 204 238 232 214 244', '#e06aa0', 8), (G, circ(128, 134, 88), '#f283b6'),
          (L, 'M62 104 C102 76 170 86 204 126', '#d4588f', 6), (L, 'M48 146 C100 118 172 126 214 168', '#d4588f', 6), (L, 'M78 198 C110 168 170 168 192 206', '#d4588f', 6), (L, 'M104 52 C78 108 88 170 120 220', '#d4588f', 6)],
 'plush': [(G, gear(128, 72, 34, 27, 8, .2), '#f0b54e'), (G, ell(52, 168, 22, 17), '#ffd29a'), (G, ell(204, 168, 22, 17), '#ffd29a'), (G, ell(92, 222, 26, 15), '#ffd29a'), (G, ell(164, 222, 26, 15), '#ffd29a'),
           (G, ell(128, 152, 86, 76), '#ffe1b8'), (F, circ(104, 142, 8), '#3a2b2b'), (F, circ(152, 142, 8), '#3a2b2b'), (F, ell(90, 164, 11, 6), '#ffa4b4'), (F, ell(166, 164, 11, 6), '#ffa4b4'),
           (L, 'M118 162 Q128 172 138 162', '#3a2b2b', 4)],
 'grass': [(G, 'M70 222 C60 170 50 140 40 110 C66 140 84 180 92 222 Z', '#5fb85c'), (G, 'M146 222 C160 172 186 140 216 120 C196 160 178 190 172 222 Z', '#5fb85c'),
           (G, 'M96 222 C92 160 96 110 110 70 C118 120 118 170 120 222 Z', '#7ccc6a'), (G, 'M118 222 C122 150 140 100 168 64 C160 120 148 170 146 222 Z', '#6cc06a'),
           (G, 'M80 222 C92 190 110 170 130 160 C118 186 110 202 108 222 Z', '#8fd876')],
 'rock': [(G, ell(96, 190, 62, 40), '#a9adb9'), (G, ell(172, 196, 52, 34), '#c2b8ac'), (G, ell(134, 140, 46, 34), '#9aa6b8')],
 'flower': [(L, 'M80 222 C80 182 76 152 72 124', '#4f9a52', 8), (L, 'M128 222 C128 172 130 132 132 96', '#4f9a52', 8), (L, 'M178 222 C178 182 184 152 188 130', '#4f9a52', 8),
            (G, 'M128 192 C100 178 92 162 96 152 C116 158 126 172 128 192 Z', '#6cc06a'), (G, 'M178 198 C200 182 212 174 220 168 C214 188 196 198 178 198 Z', '#6cc06a'),
            *daisy(72, 112, 17, '#ff9ec4', '#ffd54f'), *daisy(132, 84, 19, '#ffd54f', '#ff9a3c'), *daisy(188, 120, 16, '#9cc0ff', '#ffe066')],
 'path': [(G, ell(128, 168, 102, 54), '#cbc3b5'), (G, 'M58 180 C68 160 100 160 104 176 C96 192 70 198 58 180 Z', '#8fc46a'), (L, 'M150 140 L166 158 L160 176', '#a39a8c', 4)],
 'candle': [(W, '', '#ffe28a', (128, 58, 52)), (G, rr(92, 96, 72, 122, 16), '#fff0d4'),
            (G, 'M92 110 C92 92 164 92 164 110 L164 128 C156 138 150 120 146 132 C140 150 130 120 124 134 C118 146 108 124 104 132 C98 140 92 128 92 120 Z', '#fffaf0'),
            (L, 'M128 96 L128 82', '#4a3a2a', 4), (G, 'M128 28 C146 50 146 70 128 82 C110 70 110 50 128 28 Z', '#ffb63a'), (F, 'M128 50 C136 60 136 70 128 76 C120 70 120 60 128 50 Z', '#fff1a0')],
 'lantern': [(W, '', '#ffc27a', (128, 134, 84)), (L, 'M104 60 C104 28 152 28 152 60', '#8a5a2c', 7),
             (G, 'M88 74 C60 100 60 170 88 196 L168 196 C196 170 196 100 168 74 Z', '#ff7a4d'),
             (L, 'M128 78 L128 192', '#e0552e', 4), (L, 'M106 80 C92 112 92 160 106 190', '#e0552e', 4), (L, 'M150 80 C164 112 164 160 150 190', '#e0552e', 4),
             (G, rr(94, 56, 68, 20, 7), '#e0aa45'), (G, rr(94, 192, 68, 20, 7), '#e0aa45'), (L, 'M128 212 L128 238', '#ff5a3a', 6)],
 'mushroom': [(G, 'M104 150 C100 190 96 214 100 222 L156 222 C160 214 156 190 152 150 Z', '#fbeedd'),
              (G, 'M30 156 C30 80 226 80 226 156 C200 168 56 168 30 156 Z', '#ef4b4b'),
              (F, circ(88, 114, 14), '#fff6f0'), (F, circ(140, 98, 11), '#fff6f0'), (F, circ(182, 128, 13), '#fff6f0'), (F, circ(120, 140, 9), '#fff6f0'), (F, circ(60, 142, 8), '#fff6f0')],
 'sign': [(G, rr(118, 112, 20, 112, 7), '#a8723f'), (G, 'M52 70 L182 70 L214 102 L182 134 L52 134 C44 134 40 128 40 122 L40 82 C40 76 44 70 52 70 Z', '#d6a062'),
          (L, 'M58 90 L170 90', '#b97f45', 3), (L, 'M58 114 L150 114', '#b97f45', 3), (F, circ(62, 102, 5), '#6b4a2a'), (F, circ(176, 102, 5), '#6b4a2a'),
          (G, 'M100 226 C104 210 112 204 118 200 C116 212 114 218 116 226 Z', '#6cc06a'), (G, 'M156 226 C152 210 144 204 138 200 C140 212 142 218 140 226 Z', '#6cc06a')],
 'crystal': [(W, '', '#b8f0ff', (128, 130, 100)), (G, ell(128, 212, 98, 18), '#8b8fa3'),
             (G, 'M70 100 L94 130 L100 212 L64 212 L50 132 Z', '#c3a6ff'), (G, 'M188 90 L210 124 L198 212 L160 212 L164 120 Z', '#9ff0de'),
             (G, 'M128 28 L160 80 L152 210 L104 210 L96 80 Z', '#8fe0ff'), (L, 'M128 30 L128 208', '#eafcff', 3), (F, star4(56, 70, 13), '#ffffff'), (F, star4(204, 56, 10), '#ffffff')],
 'bowl': [(G, ell(128, 198, 72, 11), '#c94754'), (G, ell(128, 118, 106, 15), '#ff8b95'), (G, 'M50 120 C58 82 198 82 206 120 Z', '#c58a4e'),
          (F, circ(92, 104, 8), '#a56a35'), (F, circ(128, 94, 8), '#a56a35'), (F, circ(160, 106, 8), '#a56a35'), (F, circ(112, 112, 7), '#a56a35'),
          (G, 'M24 118 L232 118 C226 172 196 198 128 198 C60 198 30 172 24 118 Z', '#e85d6a'),
          (F, ell(128, 166, 16, 13), '#fff1f2'), (F, circ(108, 146, 7), '#fff1f2'), (F, circ(128, 140, 7), '#fff1f2'), (F, circ(148, 146, 7), '#fff1f2')],
 'dummy': [(G, rr(80, 228, 96, 18, 8), '#8a5a2c'), (G, rr(118, 150, 20, 84, 6), '#a8723f'), (G, rr(40, 116, 176, 18, 9), '#b07a44'),
           (G, 'M40 116 L24 108 L30 125 L22 142 L40 134 Z', '#f2d27a'), (G, 'M216 116 L232 108 L226 125 L234 142 L216 134 Z', '#f2d27a'),
           (G, 'M88 96 C80 120 80 190 96 206 L160 206 C176 190 176 120 168 96 Z', '#e2c08a'), (G, circ(128, 64, 34), '#e8c995'),
           (L, 'M92 112 L164 112', '#9c6b3b', 6), (L, 'M88 190 L168 190', '#9c6b3b', 6), (L, 'M106 96 L150 96', '#9c6b3b', 6),
           (G, circ(128, 150, 26), '#ef4b4b'), (F, circ(128, 150, 17), '#ffffff'), (F, circ(128, 150, 8), '#ef4b4b')],
 'bed': [(G, ell(128, 146, 114, 64), '#6f9be8'), (G, ell(128, 132, 78, 30), '#fff3e0'), (G, ell(100, 128, 30, 16), '#ffffff'), (G, 'M14 146 C18 214 238 214 242 146 C232 190 24 190 14 146 Z', '#5a86d6'),
         (F, star5(60, 176, 7, 3), '#ffffff'), (F, star5(128, 186, 8, 3.4), '#ffffff'), (F, star5(196, 176, 7, 3), '#ffffff')],
 'ticket': [(G, TICKET, '#ffd34d'), (L, 'M170 88 L170 168', '#e2a92e', 4, '8 7'), (F, rr(56, 106, 96, 44, 12), '#6cc58a'), (F, star5(104, 128, 15, 6.5), '#ffffff')],
 'shinyticket': [(G, TICKET, '#ffb8e6'), (L, 'M170 88 L170 168', '#e88ccc', 4, '8 7'), (F, rr(56, 106, 96, 44, 12), '#b7a3ff'), (F, star5(104, 128, 15, 6.5), '#ffe066'),
                 (F, star4(196, 112, 10), '#ffffff'), (F, star4(32, 70, 12), '#fff4b0'), (F, star4(226, 186, 10), '#fff4b0')],
 'box_poke': gift('#ef4b4b', '#f7f3ee', '#ffd34d'),
 'box_greater': gift('#4a7fe0', '#f7f3ee', '#ef4b4b', [(F, rr(62, 98, 22, 24, 6), '#ef4b4b'), (F, rr(172, 98, 22, 24, 6), '#ef4b4b')]),
 'box_ultra': gift('#3b3c4a', '#eceff4', '#ffd34d', [(F, rr(58, 100, 50, 10, 5), '#ffd34d'), (F, rr(148, 100, 50, 10, 5), '#ffd34d')]),
}
BIG = {'bowl', 'dummy', 'bed'}
DECOR = {'grass','rock','flower','path','candle','lantern','mushroom','sign','crystal','bowl','dummy','bed'}  # drawn as pixel art by make_decor_pixel.py

PAGE = r"""<!doctype html><html><body style="margin:0;background:transparent"><div id="root"></div><script>
let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
const hx=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255);
function hsl([r,g,b]){const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let h=0,s=0;if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h*=60}return [h,s,l]}
const css=(h,s,l)=>'hsl('+h.toFixed(0)+','+(Math.max(0,Math.min(1,s))*100).toFixed(0)+'%,'+(Math.max(0,Math.min(1,l))*100).toFixed(0)+'%)';
function tones(c){let [h,s,l]=hsl(hx(c));const grey=s<.15;return {light:css(h,s,l+(1-l)*.55),base:css(h,s,l),dark:css(h,s*1.05,l*.82),line:grey?css(222,.2,Math.min(.6,l*.66)):css(h,Math.min(1,s*1.05+.05),Math.min(.5,l*.68))}}
const NS='http://www.w3.org/2000/svg';let uid=0;
function el(tag,attrs,parent){const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e}
function build(name,shapes){const svg=el('svg',{id:name,width:512,height:512,viewBox:'-8 -8 272 272'});document.getElementById('root').appendChild(svg);const defs=el('defs',{},svg);
 el('filter',{id:'b2',x:'-50%',y:'-50%',width:'200%',height:'200%'},defs).appendChild(el('feGaussianBlur',{stdDeviation:2}));
 el('filter',{id:'b5',x:'-50%',y:'-50%',width:'200%',height:'200%'},defs).appendChild(el('feGaussianBlur',{stdDeviation:5}));
 const ir=el('linearGradient',{id:'ir',x1:0,y1:0,x2:1,y2:0},defs);[['#c9b6ff',0],['#9fe8ff',.3],['#fff2a6',.55],['#ffc2e2',.8],['#b9a8ff',1]].forEach(([c,o])=>el('stop',{offset:o,'stop-color':c},ir));
 const fade=el('linearGradient',{id:'fd',x1:0,y1:0,x2:0,y2:1},defs);[[0,0],[.55,0],[1,.75]].forEach(([o,a])=>el('stop',{offset:o,'stop-color':'#fff','stop-opacity':a},fade));
 for(const s of shapes){const [kind,d,col]=s,t=tones(col),id='s'+(uid++);
  if(kind==='glow'){const [cx,cy,r]=s[3],g=el('radialGradient',{id:id+'g'},defs);el('stop',{offset:0,'stop-color':col,'stop-opacity':.75},g);el('stop',{offset:1,'stop-color':col,'stop-opacity':0},g);el('circle',{cx,cy,r,fill:'url(#'+id+'g)'},svg);continue}
  if(kind==='ln'){el('path',{d,fill:'none',stroke:t.base,'stroke-width':s[3],'stroke-linecap':'round','stroke-linejoin':'round','stroke-dasharray':s[4]||'none'},svg);continue}
  const gr=el('radialGradient',{id:id+'f',cx:.36,cy:.3,r:.85,fx:.32,fy:.24},defs);[[0,t.light],[.5,t.base],[1,t.dark]].forEach(([o,c])=>el('stop',{offset:o,'stop-color':c},gr));
  const g=el('g',{},svg),p=el('path',{d,fill:'url(#'+id+'f)',id},g);
  if(kind==='gl'){const bb=p.getBBox(),cp=el('clipPath',{id:id+'c'},defs);el('use',{href:'#'+id},cp);const fx=el('g',{'clip-path':'url(#'+id+'c)'},g);
   const ig=el('g',{opacity:.55,filter:'url(#b5)'},fx);el('path',{d,fill:'url(#ir)'},ig);
   const mk=el('mask',{id:id+'m',maskContentUnits:'userSpaceOnUse'},defs);el('rect',{x:bb.x,y:bb.y,width:bb.width,height:bb.height,fill:'url(#fd)'},mk);ig.setAttribute('mask','url(#'+id+'m)');
   el('ellipse',{cx:bb.x+bb.width*.6,cy:bb.y+bb.height*.95,rx:bb.width*.5,ry:bb.height*.18,fill:t.dark,opacity:.25,filter:'url(#b5)'},fx);
   const n=Math.max(3,Math.min(12,Math.round(bb.width*bb.height/1400)));for(let i=0;i<n;i++){const r=1.5+rnd()*Math.min(bb.width,bb.height)*.07,pal=['#ffffff','#ffffff','#fff6c8','#d8f4ff','#ffe0f0','#e6dcff'];
    el('circle',{cx:bb.x+bb.width*(.12+rnd()*.76),cy:bb.y+bb.height*(.15+rnd()*.75),r,fill:pal[Math.floor(rnd()*pal.length)],opacity:(.28+rnd()*.4).toFixed(2),filter:rnd()<.4?'url(#b2)':''},fx)}
   if(bb.width>14&&bb.height>14){el('ellipse',{cx:bb.x+bb.width*.3,cy:bb.y+bb.height*.24,rx:Math.max(3,bb.width*.13),ry:Math.max(2,bb.height*.07),fill:'#fff',opacity:.85,filter:'url(#b2)',transform:'rotate(-28 '+(bb.x+bb.width*.3)+' '+(bb.y+bb.height*.24)+')'},fx);
    el('circle',{cx:bb.x+bb.width*.47,cy:bb.y+bb.height*.17,r:Math.max(1.5,Math.min(bb.width,bb.height)*.035),fill:'#fff',opacity:.9},fx)}}
  el('path',{d,fill:'none',stroke:t.line,'stroke-width':kind==='gl'?3.8:2.8,'stroke-linejoin':'round',opacity:.92},g)}}
for(const [name,shapes] of Object.entries(ITEMS))build(name,shapes);
</script></body></html>"""

def main():
    import tempfile
    from PIL import Image
    data = {k: [list(s) for s in v] for k, v in ITEMS.items()}
    tmp = tempfile.mkdtemp(); html = os.path.join(tmp, 'items.html')
    open(html, 'w').write(PAGE.replace('Object.entries(ITEMS)', 'Object.entries(' + json.dumps(data) + ')'))
    js = os.path.join(tmp, 'shot.js')
    open(js, 'w').write("""const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => { const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
 const p = await b.newPage(); await p.goto('file://%s'); await p.waitForTimeout(300); const names = %s;
 for (const n of names) await p.locator('#' + n).screenshot({ path: '%s/' + n + '.png', omitBackground: true });
 await b.close() })();""" % (html, json.dumps(list(ITEMS)), tmp))
    subprocess.run(['node', js], check=True)
    for n in ITEMS:
        if n in DECOR: continue
        im = Image.open(os.path.join(tmp, n + '.png')).convert('RGBA'); bb = im.getchannel('A').point(lambda a: 255 if a > 8 else 0).getbbox()
        im = im.crop((max(0, bb[0] - 4), max(0, bb[1] - 4), min(im.width, bb[2] + 4), min(im.height, bb[3] + 4)))
        mx = 220 if n in BIG else 160; k = mx / max(im.size); im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
        im.save(os.path.join(OUT, n + '.png'), optimize=True); print(n, im.size)
if __name__ == '__main__': main()
