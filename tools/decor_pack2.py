# Decor pack 2: 24 small + 28 medium habitat decorations (shapes for make_decor_pixel.py + item data).
import math
from make_items_soft import gear, star4, circ, ell, rr
G, L, F = 'gl', 'ln', 'fl'
def daisy(cx, cy, pr, col, mid):
    return [(G, circ(cx + pr * math.cos(a), cy + pr * math.sin(a), pr * .72), col) for a in [i * 2 * math.pi / 5 - math.pi / 2 for i in range(5)]] + [(G, circ(cx, cy, pr * .58), mid)]
def paw(cx, cy, s, col):
    return [(F, ell(cx, cy + 4 * s, 9 * s, 7 * s), col), (F, circ(cx - 9 * s, cy - 5 * s, 4 * s), col), (F, circ(cx, cy - 9 * s, 4 * s), col), (F, circ(cx + 9 * s, cy - 5 * s, 4 * s), col)]
def tulip(cx, cy, col):
    return (G, 'M%d %d C%d %d %d %d %d %d C%d %d %d %d %d %d C%d %d %d %d %d %d Z' % (cx - 18, cy, cx - 26, cy - 30, cx - 8, cy - 38, cx, cy - 22, cx + 8, cy - 38, cx + 26, cy - 30, cx + 18, cy, cx + 10, cy + 12, cx - 10, cy + 12, cx - 18, cy), col)
def books_row(x0, x1, ybot, hmin, hmax, seed):
    out, x, i = [], x0, 0; cols = ['#c9483e', '#4c70b4', '#5fa84f', '#f4cf55', '#a98ee6', '#e8704a', '#4fa8a0']
    while x < x1 - 10:
        w = 12 + (seed * 7 + i * 5) % 9; h = hmin + (seed * 13 + i * 11) % (hmax - hmin)
        out.append((G, rr(x, ybot - h, w, h, 2), cols[(seed + i * 3) % len(cols)])); x += w + 2; i += 1
    return out
GREEN, DGREEN, WOOD, DWOOD, BRASS, STONE, GLASS = '#68a94f', '#4f8f45', '#c99257', '#93633a', '#c9963c', '#9c9a94', '#cfe8f0'

SMALL = {
 'd_pot_flowers': ('Potted Flowers', 0, 'A small ceramic pot containing colorful flowers.', [
    (L, 'M100 160 L100 116', DGREEN, 8), (L, 'M150 160 L150 100', DGREEN, 8), (L, 'M128 160 L128 132', DGREEN, 8),
    (G, 'M128 160 C108 150 102 138 106 130 C120 136 126 146 128 160 Z', GREEN), *daisy(100, 108, 16, '#f08aaa', '#f6c85a'), *daisy(150, 94, 17, '#8fb2ea', '#f6d86a'), *daisy(128, 128, 14, '#f4cf55', '#e88a3a'),
    (G, 'M86 168 L170 168 L160 226 L96 226 Z', '#c96a3e'), (G, rr(80, 156, 96, 20, 6), '#d9824e')]),
 'd_berry_basket': ('Berry Basket', 1, 'A woven basket filled with assorted berries.', [
    (L, 'M70 142 C70 60 186 60 186 142', '#94683a', 10), (G, circ(70, 138, 13), '#9a4fb0'), (G, circ(90, 128, 16), '#d9483e'), (G, circ(118, 120, 15), '#5a6fc4'),
    (G, circ(150, 124, 15), '#d9483e'), (G, circ(176, 134, 13), '#5a6fc4'), (G, circ(134, 138, 12), '#f08aaa'),
    (G, 'M50 140 L206 140 L190 222 L66 222 Z', '#b98a4e'), (L, 'M60 166 L196 166', '#94683a', 5), (L, 'M64 192 L192 192', '#94683a', 5),
    (L, 'M96 144 L100 220', '#94683a', 4), (L, 'M128 144 L128 220', '#94683a', 4), (L, 'M160 144 L156 220', '#94683a', 4), (G, rr(44, 134, 168, 14, 7), '#c99a5e')]),
 'd_books': ('Stack of Books', 0, 'A small collection of colorful textbooks stacked unevenly.', [
    (G, rr(52, 192, 152, 32, 6), '#c9483e'), (F, rr(186, 197, 12, 22, 3), '#f3e6d0'), (G, rr(70, 160, 132, 32, 6), '#4c70b4'), (F, rr(184, 165, 12, 22, 3), '#f3e6d0'),
    (G, rr(58, 130, 138, 30, 6), '#5fa84f'), (F, rr(178, 135, 12, 20, 3), '#f3e6d0'), (G, rr(86, 102, 106, 28, 6), '#f4cf55'), (F, rr(174, 107, 12, 18, 3), '#f3e6d0'),
    (F, rr(64, 204, 40, 6, 2), BRASS), (F, rr(82, 172, 40, 6, 2), '#f3e6d0'), (F, rr(98, 112, 30, 5, 2), '#c9483e')]),
 'd_desk_lamp': ('Desk Lamp', 1, 'A miniature lamp that produces a warm, gentle glow.', [
    (G, ell(110, 218, 60, 14), BRASS), (L, 'M110 214 L90 146 L146 90', BRASS, 10), (G, circ(90, 146, 9), '#b07a2a'),
    (G, 'M146 70 L210 106 L186 142 L124 106 Z', '#4c8a6e'), (F, circ(184, 132, 10), '#fff0a0')]),
 'd_stool': ('Wooden Stool', 0, 'A simple round stool with four wooden legs.', [
    (L, 'M74 124 L62 224', DWOOD, 14), (L, 'M182 124 L194 224', DWOOD, 14), (L, 'M108 132 L104 220', '#7a5230', 12), (L, 'M148 132 L152 220', '#7a5230', 12), (L, 'M70 182 L186 182', '#7a5230', 8),
    (G, 'M48 108 C48 128 208 128 208 108 L208 120 C208 140 48 140 48 120 Z', '#a5713e'), (G, ell(128, 108, 80, 22), WOOD)]),
 'd_cactus': ('Tiny Cactus', 0, 'A little cactus growing inside a painted clay pot.', [
    (G, rr(72, 100, 30, 50, 15), '#5fa84f'), (G, rr(156, 84, 30, 46, 15), '#5fa84f'), (G, rr(92, 124, 24, 14, 6), '#5fa84f'), (G, rr(142, 110, 24, 14, 6), '#5fa84f'),
    (G, rr(106, 70, 44, 96, 22), '#68b058'), (F, circ(120, 96, 3), '#e8f6d8'), (F, circ(136, 120, 3), '#e8f6d8'), (F, circ(118, 140, 3), '#e8f6d8'), *daisy(128, 68, 9, '#f08aaa', '#f6d86a'),
    (G, 'M84 160 L172 160 L162 226 L94 226 Z', '#5f86c9'), (F, rr(92, 186, 72, 10, 4), '#f3e6d0'), (G, rr(78, 150, 100, 18, 6), '#7a9ad6')]),
 'd_clock': ('Table Clock', 1, 'A small analog clock that displays the current time.', [
    (G, circ(78, 60, 20), BRASS), (G, circ(178, 60, 20), BRASS), (L, 'M90 186 L76 222', DWOOD, 10), (L, 'M166 186 L180 222', DWOOD, 10),
    (G, circ(128, 126, 72), BRASS), (G, circ(128, 126, 56), '#fbf3e6'), (F, rr(124, 76, 8, 12, 2), '#3a2b2b'), (F, rr(124, 164, 8, 12, 2), '#3a2b2b'), (F, rr(78, 122, 12, 8, 2), '#3a2b2b'), (F, rr(166, 122, 12, 8, 2), '#3a2b2b'),
    (L, 'M128 126 L128 90', '#3a2b2b', 7), (L, 'M128 126 L156 140', '#3a2b2b', 6), (F, circ(128, 126, 6), '#c9483e')]),
 'd_succulent': ('Potted Succulent', 0, 'A leafy succulent planted inside a square ceramic pot.', [
    (G, ell(90, 142, 34, 14), '#6fae7c'), (G, ell(166, 142, 34, 14), '#6fae7c'), (G, ell(108, 120, 26, 13), '#7fbc8a'), (G, ell(150, 118, 26, 13), '#7fbc8a'),
    (G, ell(128, 108, 15, 30), '#8fcca0'), (G, ell(128, 140, 22, 14), '#a6d8b0'), (F, circ(70, 140, 4), '#e8909a'), (F, circ(186, 140, 4), '#e8909a'),
    (G, rr(76, 158, 104, 68, 8), '#ece4d6'), (F, rr(76, 180, 104, 10, 2), '#8fb2ea')]),
 'd_lantern2': ('Decorative Lantern', 1, 'A small lantern that illuminates its surroundings at night.', [
    (L, 'M108 48 C108 20 148 20 148 48', '#4a5568', 7), (G, 'M90 72 L166 72 L150 46 L106 46 Z', '#4a5568'),
    (G, rr(94, 72, 68, 106, 10), '#f6d27a'), (G, 'M128 96 C142 114 140 132 128 140 C116 132 114 114 128 96 Z', '#f6a23a'), (F, 'M128 116 C134 124 133 132 128 136 C123 132 122 124 128 116 Z', '#fff4b0'),
    (L, 'M100 74 L100 176', '#4a5568', 6), (L, 'M156 74 L156 176', '#4a5568', 6), (G, rr(86, 176, 84, 22, 6), '#4a5568')]),
 'd_vase': ('Flower Vase', 1, 'A glass vase containing a bouquet of freshly picked flowers.', [
    (L, 'M128 120 L104 70', DGREEN, 6), (L, 'M128 120 L128 54', DGREEN, 6), (L, 'M128 120 L156 72', DGREEN, 6), tulip(104, 70, '#f08aaa'), tulip(156, 74, '#f4cf55'), *daisy(128, 50, 15, '#ffffff', '#f6c85a'),
    (G, 'M100 120 C70 150 74 214 104 224 L152 224 C182 214 186 150 156 120 L156 104 L100 104 Z', '#a8d8e8'), (F, 'M84 170 C88 200 96 218 106 222 L150 222 C160 218 168 200 172 170 Z', '#7fc0dc'), (L, 'M126 130 L128 210', '#5f9a5a', 5)]),
 'd_shells': ('Seashell Collection', 1, 'Several colorful seashells arranged on a little tray.', [
    (G, ell(128, 206, 104, 22), WOOD), (F, ell(128, 202, 90, 15), '#e3c49a'),
    (G, 'M130 198 L104 152 C120 136 160 136 176 152 L150 198 Z', '#f4cf55'), (L, 'M140 196 L124 150', '#d9a43a', 3), (L, 'M140 196 L140 146', '#d9a43a', 3), (L, 'M140 196 L158 150', '#d9a43a', 3),
    (G, 'M64 196 C54 166 84 146 104 166 C114 180 100 198 84 198 Z', '#f3c6b0'), (L, 'M84 182 C78 172 88 166 94 174', '#d99a80', 3),
    (G, 'M176 198 C170 174 196 158 216 172 C212 188 198 198 176 198 Z', '#f08aaa'), (F, circ(200, 180, 4), '#fbe0ea')]),
 'd_puff_plate': ('Poké Puff Plate', 1, 'A plate displaying several colorful Poké Puffs.', [
    (G, ell(128, 208, 110, 24), '#e6edf7'), (F, ell(128, 204, 86, 14), '#f6f9fd'),
    (G, ell(128, 170, 30, 20), '#f3d8a6'), (G, ell(128, 152, 26, 15), '#f6a8c6'), (F, circ(128, 138, 6), '#d9483e'),
    (G, ell(78, 188, 30, 20), '#f3d8a6'), (G, ell(78, 170, 26, 15), '#a8e0c6'), (F, circ(78, 156, 6), '#f4cf55'),
    (G, ell(178, 188, 30, 20), '#f3d8a6'), (G, ell(178, 170, 26, 15), '#c7b4f0'), (F, circ(178, 156, 6), '#8fb2ea')]),
 'd_hourglass': ('Hourglass', 1, 'A decorative glass hourglass filled with golden sand.', [
    (G, 'M92 58 L164 58 C164 100 136 118 132 132 C136 146 164 164 164 206 L92 206 C92 164 120 146 124 132 C120 118 92 100 92 58 Z', GLASS),
    (F, 'M102 84 L154 84 C148 104 134 114 128 124 C122 114 108 104 102 84 Z', '#f4cf55'), (F, 'M100 204 C104 178 120 170 128 162 C136 170 152 178 156 204 Z', '#e8b84a'), (L, 'M128 126 L128 168', '#f4cf55', 3),
    (L, 'M80 58 L80 206', DWOOD, 10), (L, 'M176 58 L176 206', DWOOD, 10), (G, rr(66, 40, 124, 20, 6), DWOOD), (G, rr(66, 204, 124, 20, 6), DWOOD)]),
 'd_terrarium': ('Tiny Terrarium', 2, 'A miniature glass enclosure containing moss and tiny plants.', [
    (G, 'M60 210 C60 120 90 60 128 60 C166 60 196 120 196 210 Z', GLASS), (F, 'M66 208 C80 184 176 184 190 208 Z', '#7a5a3a'), (G, ell(108, 192, 32, 11), '#6aa84f'),
    (G, 'M144 196 C140 170 150 150 160 138 C164 160 158 180 156 196 Z', DGREEN), (G, 'M120 190 C110 170 112 156 120 146 C126 162 126 176 124 190 Z', GREEN),
    (G, rr(166, 176, 8, 18, 3), '#f3e6d0'), (G, 'M158 180 C158 168 182 168 182 180 Z', '#d9483e'), (G, rr(48, 204, 160, 22, 8), DWOOD), (G, circ(128, 56, 9), DWOOD)]),
 'd_notebook': ('Study Notebook', 0, 'An open notebook with handwritten notes and doodles.', [
    (G, 'M22 126 L128 108 L234 126 L234 232 L128 220 L22 232 Z', '#4c70b4'), (G, 'M30 122 L126 106 L126 214 L30 226 Z', '#fbf3e6'), (G, 'M130 106 L226 122 L226 226 L130 214 Z', '#fbf3e6'),
    (L, 'M42 142 L114 130', '#8fb2ea', 3), (L, 'M42 162 L114 150', '#8fb2ea', 3), (L, 'M42 182 L114 170', '#8fb2ea', 3), (L, 'M42 202 L96 193', '#8fb2ea', 3),
    (L, 'M48 140 L90 133', '#5a6a7a', 3), (L, 'M48 160 L104 151', '#5a6a7a', 3), (L, 'M48 180 L80 175', '#5a6a7a', 3),
    (F, 'M172 140 L178 152 L190 154 L181 162 L184 174 L172 168 L160 174 L163 162 L154 154 L166 152 Z', '#f4cf55'), (F, 'M196 186 C196 176 212 176 210 188 C208 196 198 202 196 204 C194 202 184 196 182 188 C180 176 196 176 196 186 Z', '#f08aaa'),
    (L, 'M128 108 L128 218', '#c9b8a0', 3)]),
 'd_candle2': ('Decorative Candle', 0, 'A little candle with a softly flickering flame.', [
    (G, ell(128, 216, 64, 14), BRASS), (G, rr(116, 186, 24, 30, 6), BRASS), (G, ell(128, 186, 34, 9), '#d9a84a'),
    (G, rr(112, 84, 32, 104, 10), '#f08aaa'), (L, 'M114 110 L142 98', '#fbc0d4', 4), (L, 'M114 138 L142 126', '#fbc0d4', 4), (L, 'M114 166 L142 154', '#fbc0d4', 4),
    (L, 'M128 84 L128 72', '#4a3a2a', 5), (G, 'M128 26 C144 46 144 62 128 72 C112 62 112 46 128 26 Z', '#f6a23a'), (F, 'M128 46 C135 54 135 62 128 67 C121 62 121 54 128 46 Z', '#fff0a0')]),
 'd_windmill': ('Miniature Windmill', 2, 'A tiny decorative windmill with slowly rotating blades.', [
    (G, ell(128, 226, 70, 9), '#6aa84f'), (G, 'M100 226 L114 108 L142 108 L156 226 Z', '#ece4d6'), (G, 'M104 112 L128 78 L152 112 Z', '#c9483e'),
    (F, rr(120, 192, 16, 34, 6), DWOOD), (F, circ(128, 150, 8), '#8fb2ea'),
    (G, 'M124 92 L64 40 L54 52 L118 100 Z', WOOD), (G, 'M132 92 L192 40 L202 52 L138 100 Z', WOOD), (G, 'M124 100 L64 152 L54 140 L118 92 Z', WOOD), (G, 'M132 100 L192 152 L202 140 L138 92 Z', WOOD),
    (G, circ(128, 96, 10), '#6e4a2a')]),
 'd_snow_globe': ('Snow Globe', 2, 'A glass globe containing a snowy miniature landscape.', [
    (G, circ(128, 122, 78), GLASS), (F, 'M58 148 C80 134 176 134 198 148 C194 170 180 186 162 194 L94 194 C76 186 62 170 58 148 Z', '#fbfbff'),
    (G, 'M128 74 L154 134 L102 134 Z', '#3f7a4a'), (F, rr(122, 134, 12, 10, 2), '#7a5a3a'), (F, circ(90, 96, 4), '#ffffff'), (F, circ(170, 90, 4), '#ffffff'), (F, circ(150, 64, 3), '#ffffff'), (F, circ(80, 128, 3), '#ffffff'),
    (G, rr(68, 188, 120, 38, 10), DWOOD), (F, rr(68, 202, 120, 8, 2), BRASS)]),
 'd_train': ('Toy Train', 2, 'A small wooden train with colorful connecting carriages.', [
    (G, rr(92, 104, 18, 34, 4), '#3e4a5a'),
    (G, rr(26, 100, 48, 50, 6), '#c9483e'), (F, rr(36, 110, 28, 20, 4), GLASS), (G, rr(26, 138, 96, 50, 8), '#c9483e'), (G, rr(132, 146, 52, 42, 6), '#4c70b4'), (G, rr(192, 146, 48, 42, 6), '#f4cf55'),
    (L, 'M122 176 L132 176', '#3e4a5a', 5), (L, 'M184 176 L192 176', '#3e4a5a', 5),
    (G, circ(48, 198, 14), '#3e4a5a'), (G, circ(98, 198, 14), '#3e4a5a'), (G, circ(146, 198, 12), '#3e4a5a'), (G, circ(170, 198, 12), '#3e4a5a'), (G, circ(204, 198, 12), '#3e4a5a'), (G, circ(228, 198, 12), '#3e4a5a')]),
 'd_globe': ('Miniature Globe', 2, 'A tiny rotating globe mounted on a wooden base.', [
    (G, ell(128, 220, 56, 12), DWOOD), (L, 'M128 194 L128 216', BRASS, 8), (G, circ(128, 120, 62), '#5f86c9'),
    (G, 'M96 88 C112 78 132 90 124 108 C118 124 100 120 94 108 Z', '#6aa84f'), (G, 'M140 120 C156 112 172 126 160 146 C150 160 136 150 138 136 Z', '#6aa84f'), (G, 'M98 142 C108 136 118 150 108 160 C100 160 96 150 98 142 Z', '#6aa84f'),
    (L, 'M68 132 C70 194 186 194 188 132', BRASS, 8)]),
 'd_music_box': ('Music Box', 2, 'A wind-up music box that plays a gentle melody when activated.', [
    (G, 'M50 122 L206 122 L196 58 L60 58 Z', WOOD), (F, 'M64 68 L192 68 L198 114 L58 114 Z', '#b8384a'),
    (L, 'M128 112 L128 92', BRASS, 5), (G, 'M128 70 L134 84 L148 84 L137 93 L141 107 L128 98 L115 107 L119 93 L108 84 L122 84 Z', '#f4cf55'),
    (G, rr(50, 120, 156, 92, 10), '#a5713e'), (F, rr(108, 150, 40, 26, 5), BRASS), (L, 'M206 160 L228 160 L228 178', BRASS, 7), (F, circ(58, 70, 4), BRASS)]),
 'd_ribbons': ('Ribbon Display', 2, 'A decorative stand displaying several colorful ribbons.', [
    (L, 'M80 186 L68 226', DWOOD, 9), (L, 'M176 186 L188 226', DWOOD, 9), (G, rr(48, 36, 160, 156, 10), DWOOD), (F, rr(58, 46, 140, 136, 6), '#d9b886'),
    (G, 'M80 100 L70 150 L82 142 L90 154 L96 100 Z', '#4c70b4'), (G, circ(88, 92, 20), '#5f86c9'), (F, circ(88, 92, 9), '#dfe8f6'),
    (G, 'M162 100 L152 150 L164 142 L172 154 L178 100 Z', '#c9483e'), (G, circ(170, 92, 20), '#d9605a'), (F, circ(170, 92, 9), '#fbe0dc'),
    (G, 'M122 146 L112 186 L124 178 L132 190 L138 146 Z', '#c9963c'), (G, circ(130, 140, 20), '#f4cf55'), (F, circ(130, 140, 9), '#fff4c8')]),
 'd_bonsai': ('Miniature Bonsai', 3, 'A carefully trimmed little tree growing in a shallow pot.', [
    (G, 'M120 194 C110 160 140 140 118 110 L134 106 C158 140 128 160 140 194 Z', '#7a5a3a'), (L, 'M126 140 L88 116', '#7a5a3a', 8), (L, 'M132 124 L170 100', '#7a5a3a', 8),
    (G, ell(86, 108, 42, 22), DGREEN), (G, ell(168, 94, 44, 24), DGREEN), (G, ell(128, 72, 38, 22), DGREEN), (G, ell(96, 100, 22, 10), '#79b856'), (G, ell(160, 86, 22, 10), '#79b856'), (G, ell(122, 64, 18, 9), '#79b856'),
    (G, rr(50, 190, 156, 32, 8), '#4c70b4'), (F, ell(96, 192, 18, 5), '#6aa84f'), (F, ell(166, 192, 14, 5), '#9c9a94')]),
 'd_mug': ('Coffee Mug', 0, 'A ceramic mug with a cute paw-print design.', [
    (L, 'M170 130 C212 130 212 190 170 190', '#ece4d6', 18), (G, rr(70, 96, 100, 124, 14), '#fbf3e6'), (G, ell(120, 102, 46, 10), '#7a4a2a'), *paw(120, 160, 2, '#e8704a')]),
}

def chest_coins():
    return [(F, circ(x, y, 9), '#f4cf55') for x, y in ((70, 116), (96, 106), (126, 100), (156, 104), (186, 114), (60, 214), (196, 216), (84, 222))]
def vending_cans():
    out = []; cols = ['#d9483e', '#4c70b4', '#5fa84f', '#f4cf55', '#e8704a', '#a98ee6']
    for r in range(4):
        for c in range(4): out.append((F, rr(70 + c * 22, 44 + r * 32, 14, 24, 3), cols[(r * 2 + c) % len(cols)]))
        out.append((F, rr(64, 70 + r * 32, 92, 4, 1), '#9fb8c8'))
    return out
MEDIUM = {
 'm_bookshelf': ('Wooden Bookshelf', 1, 'A tall wooden shelf filled with books and small decorations.', [
    (G, rr(46, 16, 164, 216, 8), DWOOD), (F, rr(58, 28, 140, 192, 4), '#6e4a2a'), *books_row(62, 196, 86, 36, 54, 1), (G, rr(54, 86, 148, 10, 3), WOOD),
    *books_row(62, 150, 150, 34, 52, 4), (G, circ(176, 132, 16), '#5f86c9'), (L, 'M176 148 L176 150', BRASS, 6), (G, rr(54, 150, 148, 10, 3), WOOD),
    (G, rr(70, 190, 30, 30, 4), '#c96a3e'), (G, ell(85, 182, 22, 14), GREEN), *books_row(112, 196, 220, 30, 46, 7), (G, rr(54, 218, 148, 12, 3), WOOD)]),
 'm_armchair': ('Cozy Armchair', 1, 'A cushioned armchair that Pokémon can occasionally sit in.', [
    (L, 'M56 214 L54 230', '#6e4a2a', 10), (L, 'M200 214 L202 230', '#6e4a2a', 10), (G, rr(52, 36, 152, 130, 40), '#c9483e'), (G, rr(40, 176, 176, 40, 12), '#a8342e'),
    (G, rr(70, 140, 116, 48, 16), '#d9605a'), (G, rr(28, 110, 50, 102, 22), '#b03a32'), (G, rr(178, 110, 50, 102, 22), '#b03a32'), (F, rr(100, 70, 56, 40, 14), '#f3c7b8')]),
 'm_berry_tree': ('Berry Tree', 1, 'A small tree bearing colorful berries that sway gently in the breeze.', [
    (G, ell(128, 226, 70, 9), '#5f9a45'), (G, 'M116 226 C120 190 118 160 110 130 L146 130 C138 160 136 190 140 226 Z', '#7a5a3a'),
    (G, ell(128, 98, 104, 72), DGREEN), (G, ell(92, 84, 46, 30), GREEN), (G, ell(166, 80, 48, 32), GREEN), (G, ell(128, 52, 40, 22), '#79b856'),
    *[(G, circ(x, y, 10), c) for x, y, c in ((70, 110, '#d9483e'), (104, 128, '#5a6fc4'), (150, 120, '#f08aaa'), (186, 104, '#d9483e'), (128, 90, '#f4cf55'), (90, 66, '#5a6fc4'), (170, 60, '#f08aaa'), (56, 86, '#f4cf55'), (204, 128, '#5a6fc4'))]]),
 'm_fountain': ('Garden Fountain', 2, 'A stone fountain with flowing water.', [
    (G, ell(128, 196, 110, 30), STONE), (G, ell(128, 192, 92, 20), '#79c6ea'), (G, rr(114, 92, 28, 104, 8), '#a9a59c'), (G, 'M70 94 L186 94 C180 118 76 118 70 94 Z', '#b5b1a8'),
    (G, 'M118 94 L120 52 C108 46 108 32 128 28 C148 32 148 46 136 52 L138 94 Z', '#9ad6f0'), (G, 'M86 96 C92 74 108 62 122 58 C112 72 104 84 100 96 Z', '#9ad6f0'), (G, 'M170 96 C164 74 148 62 134 58 C144 72 152 84 156 96 Z', '#9ad6f0'),
    (L, 'M60 186 L60 200', '#d8f2fc', 4), (L, 'M196 186 L196 200', '#d8f2fc', 4), (G, 'M18 196 C22 234 234 234 238 196 C230 218 26 218 18 196 Z', '#8a8882')]),
 'm_picnic': ('Picnic Table', 0, 'A wooden outdoor table with attached benches and a colorful tablecloth.', [
    (G, rr(28, 160, 200, 12, 4), DWOOD), (L, 'M60 140 L40 226', '#6e4a2a', 10), (L, 'M196 140 L216 226', '#6e4a2a', 10), (L, 'M70 140 L94 226', '#6e4a2a', 10), (L, 'M186 140 L162 226', '#6e4a2a', 10),
    (G, 'M24 104 L232 104 L242 142 L14 142 Z', '#d9483e'), *[(F, rr(30 + i * 28, 108 + (i % 2) * 16, 14, 14, 1), '#fbf3e6') for i in range(7)],
    (G, rr(12, 190, 232, 14, 5), WOOD), (G, circ(94, 94, 12), '#d9483e'), (G, rr(146, 80, 44, 26, 6), '#c99a5e')]),
 'm_aquarium': ('Aquarium Tank', 2, 'A glass aquarium containing aquatic plants, bubbles, and decorative rocks.', [
    (G, rr(30, 210, 196, 18, 4), '#6e4a2a'), (G, rr(30, 70, 196, 142, 6), '#a8dcf0'), (F, rr(38, 88, 180, 116, 4), '#5fb0dc'), (F, 'M38 190 C80 180 176 184 218 192 L218 204 L38 204 Z', '#e8d29a'),
    (G, 'M60 204 C50 170 70 150 60 118 C78 150 72 180 76 204 Z', DGREEN), (G, 'M190 204 C200 176 186 154 196 128 C208 156 206 182 204 204 Z', GREEN), (G, ell(150, 198, 22, 10), '#8f98a3'),
    (F, 'M110 130 C120 120 138 122 146 130 C138 138 120 140 110 130 Z', '#f08a3a'), (F, 'M146 130 L158 122 L158 138 Z', '#f08a3a'),
    (F, 'M148 166 C156 160 168 160 174 166 C168 172 156 172 148 166 Z', '#f4cf55'), (F, 'M174 166 L184 160 L184 172 Z', '#f4cf55'),
    (F, circ(88, 110, 4), '#ffffff'), (F, circ(94, 96, 3), '#ffffff'), (F, circ(86, 128, 3), '#ffffff'), (G, rr(24, 60, 208, 14, 4), '#3e4a5a')]),
 'm_arcade': ('Arcade Cabinet', 2, 'A colorful arcade machine with a glowing screen.', [
    (G, 'M60 226 L60 40 C60 30 70 24 80 24 L176 24 C186 24 196 30 196 40 L196 226 Z', '#7a4ab0'), (G, rr(66, 30, 124, 30, 6), '#f4cf55'), (F, rr(84, 40, 88, 10, 3), '#e8704a'),
    (G, rr(76, 70, 104, 74, 6), '#2a2e4a'), (F, rr(88, 82, 14, 14, 2), '#79e0f0'), (F, rr(150, 96, 14, 14, 2), '#f08aaa'), (F, rr(110, 118, 40, 8, 2), '#a8f0a0'), (F, circ(134, 92, 5), '#f4cf55'),
    (G, 'M60 150 L196 150 L212 182 L44 182 Z', '#5a3a90'), (L, 'M96 166 L96 150', '#3e4a5a', 6), (G, circ(96, 146, 9), '#d9483e'), (F, circ(140, 166, 7), '#79e0f0'), (F, circ(164, 166, 7), '#f4cf55'),
    (F, rr(118, 196, 20, 10, 2), '#3e2a5a'), (L, 'M66 70 L66 140', '#f08aaa', 4), (L, 'M190 70 L190 140', '#f08aaa', 4)]),
 'm_flower_bed': ('Flower Garden', 0, 'A rectangular garden bed filled with blooming flowers.', [
    (G, rr(24, 146, 208, 26, 8), '#6e4a2a'), *[sh for i, x in enumerate(range(48, 216, 28)) for sh in daisy(x, 128 - (i % 2) * 14, 13, ['#f08aaa', '#f4cf55', '#8fb2ea', '#ffffff', '#e8704a', '#c7a6f0'][i % 6], '#f6c85a')],
    (G, ell(64, 152, 18, 9), GREEN), (G, ell(128, 154, 18, 9), GREEN), (G, ell(192, 152, 18, 9), GREEN), (G, 'M20 160 L236 160 L228 224 L28 224 Z', DWOOD), (L, 'M30 192 L226 192', '#7a5230', 4)]),
 'm_swing': ('Wooden Swing', 1, 'A little wooden swing suspended from a sturdy frame.', [
    (L, 'M40 226 L72 40', DWOOD, 14), (L, 'M104 226 L72 40', DWOOD, 14), (L, 'M152 226 L184 40', DWOOD, 14), (L, 'M216 226 L184 40', DWOOD, 14), (G, rr(58, 30, 140, 18, 8), '#a5713e'),
    (L, 'M100 48 L100 170', '#d6b27c', 5), (L, 'M156 48 L156 170', '#d6b27c', 5), (G, rr(84, 166, 88, 16, 6), WOOD)]),
 'm_campfire': ('Campfire', 0, 'A small campfire surrounded by stones, with gently flickering flames.', [
    (G, ell(84, 184, 20, 14), STONE), (G, ell(172, 184, 20, 14), STONE), (G, ell(128, 176, 22, 14), '#a9a59c'), (L, 'M80 208 L176 172', '#7a4a2a', 16), (L, 'M80 172 L176 208', '#6e4224', 16),
    (G, 'M100 188 C84 162 90 140 100 124 C104 150 112 168 118 188 Z', '#e8603a'), (G, 'M156 188 C172 162 166 140 156 124 C152 150 144 168 138 188 Z', '#e8603a'),
    (G, 'M128 66 C162 108 172 150 150 188 L106 188 C84 150 96 108 128 66 Z', '#f6a23a'), (G, 'M128 110 C146 136 150 162 140 186 L116 186 C106 162 110 136 128 110 Z', '#f6d26a'),
    (G, ell(62, 206, 22, 16), STONE), (G, ell(100, 216, 24, 15), '#a9a59c'), (G, ell(156, 216, 24, 15), STONE), (G, ell(194, 206, 22, 16), '#a9a59c')]),
 'm_desk': ('Study Desk', 1, 'A wooden desk equipped with books, writing supplies, and a lamp.', [
    (L, 'M36 134 L36 226', DWOOD, 12), (G, rr(150, 132, 78, 94, 6), DWOOD), (F, rr(176, 150, 26, 6, 2), BRASS), (F, rr(176, 190, 26, 6, 2), BRASS), (L, 'M152 178 L226 178', '#7a5230', 3),
    (G, rr(30, 88, 62, 14, 3), '#c9483e'), (G, rr(34, 74, 56, 14, 3), '#4c70b4'), (G, rr(28, 60, 60, 14, 3), '#5fa84f'), (F, rr(104, 106, 42, 10, 2), '#fbf3e6'), (L, 'M110 100 L140 92', '#f4cf55', 4),
    (G, ell(194, 114, 22, 6), '#3e4a5a'), (L, 'M194 112 L180 72 L204 52', '#3e4a5a', 6), (G, 'M198 40 L230 58 L218 78 L190 62 Z', '#5fa84f'), (F, circ(212, 74, 6), '#fff0a0'),
    (G, rr(20, 116, 216, 18, 4), '#a5713e')]),
 'm_greenhouse': ('Miniature Greenhouse', 2, 'A glass greenhouse containing several potted plants.', [
    (G, 'M30 224 L30 110 L128 40 L226 110 L226 224 Z', GLASS), (G, rr(44, 196, 26, 26, 4), '#c96a3e'), (G, ell(57, 186, 20, 14), GREEN), (G, rr(186, 196, 26, 26, 4), '#c96a3e'), (G, ell(199, 184, 22, 16), DGREEN),
    (G, rr(76, 178, 22, 44, 4), '#c96a3e'), (G, ell(87, 166, 16, 22), '#79b856'), *daisy(87, 152, 8, '#f08aaa', '#f6c85a'),
    (F, rr(108, 156, 40, 68, 4), '#b4dbea'), (L, 'M30 110 L226 110', '#ece4d6', 6), (L, 'M78 224 L78 76', '#ece4d6', 6), (L, 'M178 224 L178 76', '#ece4d6', 6), (L, 'M128 40 L128 156', '#ece4d6', 6),
    (L, 'M30 110 L128 40 L226 110', '#ece4d6', 7), (G, rr(24, 220, 208, 10, 3), STONE)]),
 'm_mush_patch': ('Mushroom Patch', 0, 'A cluster of oversized mushrooms growing together in a patch of grass.', [
    (G, ell(128, 220, 116, 16), '#5f9a45'), (G, rr(110, 130, 36, 92, 12), '#f3e6d0'), (G, 'M58 140 C58 66 198 66 198 140 C176 152 80 152 58 140 Z', '#d9483e'),
    (F, circ(98, 104, 12), '#fbefe4'), (F, circ(146, 92, 10), '#fbefe4'), (F, circ(176, 122, 11), '#fbefe4'), (F, circ(122, 128, 8), '#fbefe4'),
    (G, rr(44, 170, 24, 52, 8), '#f3e6d0'), (G, 'M16 180 C16 138 96 138 96 180 C84 186 28 186 16 180 Z', '#e8a04a'), (F, circ(44, 160, 6), '#fff2d8'),
    (G, rr(190, 182, 20, 40, 6), '#f3e6d0'), (G, 'M164 190 C164 160 236 160 236 190 C224 196 176 196 164 190 Z', '#a98ee6'), (F, circ(206, 174, 5), '#f0e8ff'),
    (G, 'M90 224 C94 208 102 202 108 198 C106 210 104 216 106 224 Z', GREEN), (G, 'M160 224 C156 208 148 202 142 198 C144 210 146 216 144 224 Z', GREEN)]),
 'm_waterfall': ('Decorative Waterfall', 3, 'A small artificial waterfall cascading into a rocky pool.', [
    (G, 'M40 200 L50 72 C60 46 100 40 128 48 C160 40 196 46 206 72 L216 200 Z', '#8f8a80'), (G, 'M106 50 L150 50 L156 196 L100 196 Z', '#79c6ea'),
    (L, 'M118 58 L116 188', '#d8f2fc', 4), (L, 'M138 58 L140 188', '#d8f2fc', 4), (G, ell(128, 206, 110, 22), '#5fb0dc'), (F, ell(128, 196, 42, 10), '#ffffff'),
    (G, ell(62, 92, 18, 10), '#6aa84f'), (G, ell(186, 84, 16, 9), '#6aa84f'), (G, ell(38, 210, 30, 18), STONE), (G, ell(218, 210, 30, 18), '#a9a59c')]),
 'm_vending': ('Vending Machine', 2, 'A brightly colored machine displaying drinks and snacks.', [
    (G, rr(48, 18, 160, 210, 8), '#d9483e'), (G, rr(60, 32, 100, 144, 4), GLASS), *vending_cans(), (G, rr(168, 40, 30, 84, 4), '#3e4a5a'),
    *[(F, circ(183, 54 + i * 16, 4), c) for i, c in enumerate(['#f4cf55', '#79e0f0', '#a8f0a0', '#f08aaa'])], (F, rr(176, 132, 14, 22, 3), '#2a2e3a'),
    (F, rr(48, 178, 160, 8, 2), '#fbf3e6'), (G, rr(64, 192, 94, 24, 4), '#3e4a5a')]),
 'm_playhouse': ('Pokémon Playhouse', 2, 'A small wooden house with an entrance sized for Pokémon.', [
    (G, rr(168, 46, 22, 44, 4), '#9c6b4a'), (G, rr(40, 108, 176, 118, 6), WOOD), (L, 'M44 140 L212 140', '#b07e48', 3), (L, 'M44 172 L212 172', '#b07e48', 3), (L, 'M44 204 L212 204', '#b07e48', 3),
    (G, 'M22 122 L128 34 L234 122 Z', '#c9483e'), (L, 'M22 122 L128 34 L234 122', '#a8342e', 6),
    (G, 'M96 226 L96 174 C96 140 160 140 160 174 L160 226 Z', '#5a3c22'), (G, circ(190, 156, 15), GLASS), (L, 'M175 156 L205 156', '#fbf3e6', 3), (F, rr(108, 120, 40, 14, 3), '#f4cf55')]),
 'm_telescope': ('Telescope Stand', 1, 'A large telescope mounted on an adjustable tripod.', [
    (L, 'M128 140 L72 226', '#3e4a5a', 9), (L, 'M128 140 L184 226', '#3e4a5a', 9), (L, 'M128 140 L128 226', '#4a5568', 8),
    (G, 'M40 122 L188 62 L200 90 L52 150 Z', '#4c70b4'), (F, 'M88 104 L96 100 L108 128 L100 132 Z', BRASS), (F, 'M140 82 L148 78 L160 106 L152 110 Z', BRASS),
    (G, 'M184 52 L214 40 L228 92 L198 100 Z', BRASS), (G, 'M28 130 L46 122 L56 146 L38 154 Z', '#3e4a5a'), (G, circ(128, 138, 12), '#5a6a7a')]),
 'm_hammock': ('Hammock', 1, 'A suspended fabric hammock where Pokémon can take naps.', [
    (L, 'M30 226 L30 66', '#7a5a3a', 14), (L, 'M226 226 L226 66', '#7a5a3a', 14), (L, 'M30 84 L64 128', '#d6b27c', 5), (L, 'M226 84 L192 128', '#d6b27c', 5),
    (G, 'M58 122 C80 198 176 198 198 122 C176 150 80 150 58 122 Z', '#4fa8a0'), (L, 'M70 140 C96 186 160 186 186 140', '#f4cf55', 5), (F, ell(84, 142, 18, 9), '#fbf3e6'),
    (G, ell(30, 62, 10, 8), '#6e4a2a'), (G, ell(226, 62, 10, 8), '#6e4a2a')]),
 'm_bench': ('Outdoor Bench', 0, 'A decorative park bench with wooden seating and metal supports.', [
    (L, 'M52 226 L52 116 C52 98 62 90 74 90', '#3e4a5a', 10), (L, 'M204 226 L204 116 C204 98 194 90 182 90', '#3e4a5a', 10),
    (G, rr(40, 88, 176, 16, 5), WOOD), (G, rr(40, 110, 176, 16, 5), WOOD), (G, rr(28, 150, 200, 14, 5), '#b98250'), (G, rr(28, 168, 200, 14, 5), '#b98250'),
    (L, 'M40 184 L40 226', '#3e4a5a', 9), (L, 'M216 184 L216 226', '#3e4a5a', 9), (L, 'M30 150 L60 140', '#3e4a5a', 7), (L, 'M226 150 L196 140', '#3e4a5a', 7)]),
 'm_crystals': ('Crystal Formation', 2, 'A large cluster of glowing crystals emerging from the ground.', [
    (G, ell(128, 214, 116, 20), '#7d7f8f'), (G, 'M60 80 L86 112 L92 212 L50 212 L38 116 Z', '#79c6ea'), (G, 'M196 60 L222 100 L212 212 L172 212 L172 98 Z', '#84d9c6'),
    (G, 'M128 18 L166 80 L156 210 L100 210 L90 80 Z', '#a98ee6'), (G, 'M128 20 L166 80 L156 210 L128 210 Z', '#8a6ed6'),
    (G, 'M100 150 L114 170 L114 214 L88 214 L88 170 Z', '#f08aaa'), (G, 'M160 140 L176 160 L178 214 L150 214 L148 160 Z', '#79c6ea')]),
 'm_turbine': ('Miniature Wind Turbine', 3, 'A compact wind turbine with slowly rotating blades.', [
    (G, ell(128, 226, 64, 8), '#6aa84f'), (G, 'M120 224 L124 70 L132 70 L136 224 Z', '#e6edf7'), (G, rr(100, 214, 56, 12, 3), STONE),
    (G, 'M126 62 L118 6 L132 4 L134 62 Z', '#fbfbff'), (G, 'M124 66 L70 104 L62 94 L120 58 Z', '#fbfbff'), (G, 'M134 66 L188 104 L196 94 L136 58 Z', '#fbfbff'),
    (G, rr(112, 52, 40, 22, 8), '#d6dde8'), (G, circ(128, 62, 10), '#c9d2de')]),
 'm_arch': ('Flower Archway', 2, 'A curved wooden arch covered in blooming flowers and vines.', [
    (G, rr(36, 92, 20, 134, 4), DWOOD), (G, rr(200, 92, 20, 134, 4), DWOOD), (G, 'M36 102 C36 22 220 22 220 102 L200 102 C200 46 56 46 56 102 Z', '#a5713e'),
    (L, 'M46 220 C40 180 56 150 44 110 C40 70 80 40 128 36 C176 40 216 70 212 110 C200 150 216 180 210 220', DGREEN, 5),
    *[sh for x, y, c in ((50, 120, '#f08aaa'), (60, 72, '#ffffff'), (96, 42, '#f4cf55'), (128, 34, '#f08aaa'), (160, 42, '#c7a6f0'), (196, 72, '#ffffff'), (206, 120, '#f4cf55'), (44, 170, '#c7a6f0'), (212, 168, '#f08aaa')) for sh in daisy(x, y, 10, c, '#f6c85a')],
    (G, ell(78, 54, 10, 6), GREEN), (G, ell(178, 54, 10, 6), GREEN), (G, ell(40, 146, 8, 5), GREEN), (G, ell(214, 146, 8, 5), GREEN)]),
 'm_chest': ('Treasure Chest', 2, 'A decorative wooden chest overflowing with colorful treasures.', [
    (G, 'M40 120 L216 120 L206 58 L50 58 Z', DWOOD), (F, 'M54 68 L202 68 L208 112 L48 112 Z', '#6e4a2a'), (G, 'M44 124 C70 92 186 92 212 124 Z', '#f4cf55'), *chest_coins(),
    (F, 'M110 92 L122 80 L134 92 L122 106 Z', '#d9483e'), (F, 'M150 96 L160 86 L170 96 L160 108 Z', '#4c9ad6'), (F, 'M84 100 L92 92 L100 100 L92 110 Z', '#5fc46a'),
    (G, rr(36, 120, 184, 100, 8), '#a5713e'), (F, rr(56, 120, 12, 100, 2), BRASS), (F, rr(188, 120, 12, 100, 2), BRASS), (F, rr(116, 134, 24, 30, 4), BRASS), (F, circ(128, 146, 4), '#3a2b2b')]),
 'm_koi': ('Koi Pond', 2, 'A small ornamental pond containing lily pads and koi.', [
    (G, ell(128, 152, 120, 72), STONE), (G, ell(128, 148, 100, 54), '#4f9ac4'), (L, 'M70 160 C80 152 92 152 100 160', '#a8dcf0', 3), (L, 'M150 124 C160 118 172 118 180 124', '#a8dcf0', 3),
    (G, ell(78, 128, 22, 12), '#5fa84f'), (G, ell(176, 170, 20, 11), '#5fa84f'), *daisy(80, 124, 6, '#f6a8c6', '#f6d86a'),
    (F, 'M108 160 C122 150 144 152 152 160 C144 168 122 170 108 160 Z', '#f08a3a'), (F, 'M152 160 L164 152 L164 168 Z', '#f08a3a'),
    (F, 'M150 134 C140 126 122 126 114 134 C122 142 140 142 150 134 Z', '#fbf3e6'), (F, 'M114 134 L102 126 L102 142 Z', '#fbf3e6'), (F, circ(132, 132, 4), '#e8603a')]),
 'm_clockwork': ('Clockwork Machine', 3, 'A mechanical device with exposed gears, rotating wheels, and moving pistons.', [
    (G, rr(40, 58, 176, 142, 10), '#8a6a3a'), (L, 'M54 70 L54 196', '#9aa4b0', 7), (G, gear(98, 124, 42, 33, 10), BRASS), (F, circ(98, 124, 10), '#5a4628'),
    (G, gear(166, 104, 30, 23, 8, .2), '#d9a84a'), (F, circ(166, 104, 7), '#5a4628'), (G, gear(162, 164, 24, 18, 8), '#b07a2a'), (F, circ(162, 164, 6), '#5a4628'),
    (G, rr(196, 130, 14, 56, 3), '#9aa4b0'), (L, 'M203 130 L203 112', '#c9d2de', 5), (G, circ(206, 74, 16), '#fbf3e6'), (L, 'M206 74 L214 66', '#c9483e', 3), (G, rr(30, 196, 196, 30, 6), '#6e4a2a')]),
 'm_tent': ('Camping Tent', 1, 'A colorful fabric tent with a small entrance and sleeping mat.', [
    (L, 'M128 50 L128 30', '#6e4a2a', 5), (F, 'M128 30 L150 36 L128 42 Z', '#f4cf55'), (G, 'M18 222 L128 50 L238 222 Z', '#e8704a'), (G, 'M128 50 L238 222 L160 222 Z', '#c9583a'),
    (G, 'M98 222 L128 118 L158 222 Z', '#3a2b2b'), (F, 'M108 222 L148 222 L144 206 L112 206 Z', '#5fa84f'), (F, 'M128 118 L98 222 L80 222 Z', '#f4a07a'),
    (L, 'M18 222 L8 230', '#6e4a2a', 4), (L, 'M238 222 L248 230', '#6e4a2a', 4)]),
 'm_piano': ('Grand Piano', 3, 'A polished miniature piano that occasionally plays musical notes.', [
    (L, 'M44 132 L44 222', '#2e2a3a', 12), (L, 'M138 132 L138 222', '#2e2a3a', 12), (L, 'M208 110 L208 222', '#2e2a3a', 12), (L, 'M84 132 L84 214', '#c9963c', 4),
    (L, 'M120 70 L150 26', '#2e2a3a', 4), (G, 'M36 72 L150 22 L222 50 L156 72 Z', '#3e3a4a'), (G, 'M30 120 L150 120 C200 120 232 102 232 72 C232 42 198 32 172 42 C142 54 120 72 30 72 Z', '#2e2a3a'),
    (G, rr(24, 116, 128, 18, 3), '#fbfbff'), *[(F, rr(34 + i * 16, 116, 8, 10, 1), '#2e2a3a') for i in range(7)],
    (F, circ(186, 26, 7), '#f4cf55'), (L, 'M192 26 L192 4', '#f4cf55', 3), (F, circ(212, 14, 6), '#f4cf55'), (L, 'M217 14 L217 -6', '#f4cf55', 3)]),
 'm_ruins': ('Ancient Ruins', 3, 'A collection of weathered stone pillars covered in moss and mysterious markings.', [
    (G, ell(128, 222, 118, 14), '#7a8a5a'), (G, rr(36, 52, 40, 172, 4), '#bdb5a3'), (G, rr(28, 40, 56, 18, 3), '#a9a191'), (G, rr(180, 72, 40, 152, 4), '#bdb5a3'), (G, rr(172, 60, 56, 16, 3), '#a9a191'),
    (G, 'M108 222 L108 110 L118 98 L128 108 L138 94 L148 110 L148 222 Z', '#b3ab99'), (G, rr(80, 196, 70, 26, 4), '#a9a191'),
    (G, ell(48, 120, 14, 22), '#6aa84f'), (G, ell(196, 160, 14, 26), '#6aa84f'), (G, ell(120, 200, 18, 8), '#6aa84f'),
    (F, circ(56, 90, 5), '#7ab8f0'), (F, rr(52, 104, 8, 18, 2), '#7ab8f0'), (F, circ(200, 110, 5), '#7ab8f0'), (F, rr(196, 124, 8, 14, 2), '#7ab8f0'), (F, rr(122, 140, 12, 6, 2), '#7ab8f0')]),
}
