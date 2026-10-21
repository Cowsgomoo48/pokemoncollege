# Original pixel-art costume pieces for PokemonCollege (drawn from character maps below).
# Each piece has a "seat" row: the row that lines up with the top of the Pokemon's head.
from PIL import Image
import json, os
OUT = os.path.join(os.path.dirname(__file__), '..', 'www', 'assets', 'costume')
PAL = {'.': None, 'k': (24, 20, 36), 'K': (52, 46, 70),
       'p': (112, 64, 168), 'P': (150, 98, 205), 'q': (78, 42, 120), 'o': (240, 150, 40), 'O': (255, 205, 90),
       'b': (40, 44, 58), 'B': (72, 78, 98), 'y': (240, 196, 48), 'Y': (255, 230, 120),
       'r': (206, 52, 64), 'R': (238, 96, 104), 'd': (150, 32, 46), 'w': (248, 248, 252), 'W': (206, 214, 226),
       'g': (70, 160, 80), 'G': (120, 206, 110), 'f': (246, 130, 170), 'F': (255, 190, 214), 'c': (255, 226, 92),
       's': (222, 184, 110), 'S': (246, 216, 150), 't': (170, 128, 70), 'n': (64, 140, 214), 'N': (120, 186, 240)}
HATS = {
 'witch': dict(name='Witch Hat', seat=15, rows=[
  "..........kk........",
  ".........kPk........",
  "........kPPk........",
  "........kPpk........",
  ".......kPPpk........",
  ".......kPppk........",
  "......kPPppqk.......",
  "......kPpppqk.......",
  ".....kPPpppqk.......",
  ".....kooOoooqk......",
  "....kooOOooooqk.....",
  "....kqppppppqqk.....",
  "...kPPpppppppqqk....",
  "..kPPpppppppppqqk...",
  ".kPPppppppppppppqk..",
  "kkkkkkkkkkkkkkkkkkkk",
  ".kkkkkkkkkkkkkkkkkk."]),
 'grad': dict(name='Graduation Cap', seat=9, rows=[
  ".........kk.........",
  "......kkkBBkkk......",
  "...kkkBBBBBBBBkkk...",
  "kkkBBBBBBBBBBBBBBkkk",
  "kBBBBBBBBkyyBBBBBBBk",
  ".kkkBBBBBBkyBBBBkkky",
  "...kkkbbbbbbbbkkk.yY",
  ".....kbbbbbbbbk...yY",
  ".....kbbbbbbbbk...kk",
  ".....kkkkkkkkkk....."]),
 'beanie': dict(name='Winter Beanie', seat=11, rows=[
  "........kkk.........",
  ".......kwWwk........",
  ".......kWwWk........",
  "......kkkkkkk.......",
  ".....kRRrrrrdk......",
  "....kRRrrrrrrdk.....",
  "...kRrrrrrrrrrdk....",
  "...kRrrrrrrrrrdk....",
  "..kRRrrrrrrrrrrdk...",
  "..kwWwWwWwWwWwWwk...",
  "..kWwWwWwWwWwWwWk...",
  "..kkkkkkkkkkkkkkk..."]),
 'flowers': dict(name='Flower Crown', seat=6, rows=[
  "..kk......kk......kk",
  ".kFfk..kk.kckk..kFfk",
  ".kfck.kNnk.kk..kfcfk",
  "kgfFkgknNkgkkkgkFfkg",
  "kGgkkGGkkgGgFfkGgkGk",
  ".kGGgGgGGgGkfckgGGk.",
  "..kkkkkkkkkkkkkkkkk.."[:20],
  ]),
 'sunhat': dict(name='Sun Hat', seat=9, rows=[
  "......kkkkkkkk......",
  ".....kSSSSSSssk.....",
  "....kSSSSSSSsssk....",
  "....kSSSSSSSsssk....",
  "....kNNNNNNNNNnk....",
  "....knnnnnnnnnnk....",
  "..kkSSSSSSSSSSsskk..",
  ".kSSSSSSSSSSSSSssssk",
  "kSSssssssssssssssstk",
  "kkkkkkkkkkkkkkkkkkkk"]),
}
SEASON = {'1': 'beanie', '2': 'beanie', '3': 'flowers', '4': 'flowers', '5': 'grad', '6': 'grad', '7': 'sunhat', '8': 'sunhat',
          '9': 'grad', '10': 'witch', '11': 'beanie', '12': 'beanie'}
meta = {}
for key, h in HATS.items():
    rows = [r.ljust(20, '.')[:20] for r in h['rows']]
    im = Image.new('RGBA', (20, len(rows)), (0, 0, 0, 0))
    for y, r in enumerate(rows):
        for x, ch in enumerate(r):
            c = PAL[ch]
            if c: im.putpixel((x, y), c + (255,))
    im.save(os.path.join(OUT, key + '.png'))
    meta[key] = {'name': h['name'], 'w': im.width, 'h': im.height, 'seat': h['seat'], 'url': './assets/costume/' + key + '.png'}
json.dump({'hats': meta, 'season': SEASON}, open(os.path.join(OUT, 'costumes.json'), 'w'), indent=1)
print(json.dumps(meta))
