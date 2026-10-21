# Original pixel art for PokemonCollege items, decor, toys, snacks and boxes (drawn from the character maps below).
from PIL import Image
import os
OUT = os.path.join(os.path.dirname(__file__), '..', 'www', 'assets', 'items')
P = {'.': None, 'k': (30, 26, 40), 'w': (250, 250, 252), 'W': (210, 216, 228), 'L': (160, 168, 186),
 'r': (214, 54, 62), 'R': (246, 108, 112), 'd': (140, 30, 40), 'g': (66, 150, 74), 'G': (122, 204, 104), 'h': (36, 100, 52),
 'y': (240, 196, 48), 'Y': (255, 232, 132), 'o': (232, 132, 40), 'O': (255, 186, 92), 'b': (126, 84, 46), 'B': (172, 120, 70), 'n': (88, 56, 30),
 's': (130, 130, 140), 'S': (176, 176, 188), 'x': (90, 90, 102), 'p': (214, 120, 190), 'P': (246, 176, 222), 'u': (70, 110, 210), 'U': (130, 170, 246),
 'c': (90, 210, 220), 'C': (170, 246, 250), 'v': (140, 90, 200), 'V': (190, 150, 240), 'e': (238, 218, 180), 'E': (250, 238, 210), 'f': (255, 250, 200)}
ART = {
'apple': ["......kk........", ".....kgk........", "..kkkkgkkkk.....", ".krRRrkrrrrk....", "krRwRrrrrrrrk...", "krRRrrrrrrrrk...", "krrrrrrrrrrdk...", "krrrrrrrrrrdk...", ".krrrrrrrrddk...", ".krrrrrrrddk....", "..kdrrrdddk.....", "...kkkkkkk......"],
'cookie': ["....kkkkkk......", "..kkBBBBBBkk....", ".kBBBnBBBBBBk...", ".kBBBBBBBnBBk...", "kBBnBBkkBBBBBk..", "kBBBBkyykBBnBk..", "kBBBBkyykBBBBk..", "kBnBBBkkBBBBBk..", ".kBBBBBBBBnBk...", ".kBBBnBBBBBBk...", "..kkBBBBBBkk....", "....kkkkkk......"],
'honey': ["....kkkkkk......", "...kWWWWWWk.....", "....kkkkkk......", "...kyyyyyyk.....", "..kyYyyyyyyk....", ".kyYYyyyyyyyk...", ".kyYyykkkyyyk...", ".kyyyykwkyyyk...", ".kyyyykkkyyok...", ".kyyyyyyyyook...", "..kooooooook....", "...kkkkkkkk....."],
'riceball': [".......kk.......", "......kwwk......", ".....kwwwwk.....", "....kwwwwwwk....", "...kwwwwwwWWk...", "..kwwwwwwwwWWk..", "..kwwwkkkkwwWk..", ".kwwwkhhhhkwWWk.", ".kwwwkhhhhkwwWk.", ".kwWWkhhhhkWWWk.", "..kkkkkkkkkkkk.."],
'cake': [".......k........", "......kyk.......", "......kok.......", "......kwk.......", "..kkkkkkkkkkk...", ".kPPPPPPPPPPPk..", ".kwRwwRwwRwwwk..", ".kEEEEEEEEEEEk..", ".kPPPPPPPPPPPk..", ".kEEEEEEEEEEEk..", ".kkkkkkkkkkkkk..", "kWWWWWWWWWWWWWk.", ".kkkkkkkkkkkkk.."],
'goldapple': ["......kk........", ".....kgk........", "..kkkkgkkkk.....", ".kyYYykyyyyk....", "kyYfYyyyyyyyk...", "kyYYyyyyyyyy k..".replace(' ', 'y'), "kyyyyyyyyyyyok..", "kyyyyyyyyyyyok..", ".kyyyyyyyyook...", ".kyyyyyyyook....", "..koyyyoook.....", "...kkkkkkk......"],
'ball': ["....kkkkkk......", "..kkuuuuuukk....", ".kuUUuuuuuuuk...", ".kuUuuuuuuuuk...", "kyyyyyyyyyyyyk..", "kyYYyyyyyyyyyk..", "kuuuuuuuuuuuuk..", "kuuuuuuuuuuuuk..", ".kuuuuuuuuuuk...", ".kuuuuuuuuuuk...", "..kkuuuuuukk....", "....kkkkkk......"],
'yarn': ["....kkkkkk......", "..kkpPpppPkk....", ".kpPppPpPppPk...", ".kppPppPppPpk...", "kpPppPppPppPpk..", "kppPppPppPppPk..", "kpPppPppPppPpk..", "kppPppPppPppPk..", ".kpPppPppPppk...", ".kppPppPppPk.k..", "..kkpPppPkk..kk.", "....kkkkk.....kk"],
'plush': ["..kk......kk....", ".kBBk....kBBk...", ".kBnBkkkkBnBk...", "..kBBBBBBBBk....", ".kBBkkBBkkBBk...", ".kBBkwBBkwBBk...", ".kBBBBBBBBBBk...", ".kBBBBkkBBBBk...", "..kBBBBBBBBk....", ".kBBkBBBBkBBk...", ".kBBkBBBBkBBk...", "..kkkkkkkkkk...."],
'grass': ["....k...k.......", "...kGk.kGk..k...", "...kGk.kGk.kGk..", "..kGgkkGgk.kGk..", "..kGgkGGgkkGgk..", ".kGgkGGgkkGGgk..", ".kGgkGgkkGGgkk..", "kGgkGgkGGgkGgk..", "kkkkkkkkkkkkkk.."],
'rock': ["................", "....kkkk........", "...kSSSSkk......", "..kSSssssskkkk..", ".kSSsssssksSSk..", ".kSsssssxksssxk.", "kSsssssxxkssxxk.", "kkkkkkkkkkkkkkk."],
'flower': ["..kk......kk....", ".kPPk....kyyk...", "kPyPk...kyoyk...", ".kPPk..kk.kyk...", "..kgk.kRRk.kgk..", "..kgkkRyRk.kgk..", "..kgk.kRRkkgk...", ".kGgkk.kgkkGgk..", "kGgGgkkgkGgGgk..", "kkkkkkkkkkkkkk.."],
'path': ["................", "...kkkkkkkk.....", ".kkSSSSSSSSkk...", "kSSSSsSSSSSSSk..", "kSsSSSSSSSsSSk..", "kSSSSSSSsSSSxk..", ".kxSSSSSSSSxk...", "..kkkkkkkkkk...."],
'candle': [".....k..........", "....kyk.........", "....kfk.........", "...kyfok........", "....kok.........", "....kkk.........", "...kEEEk........", "...kEwEk........", "...kEwEk........", "...kEEEk........", "...kEEEk........", "..kWWWWWk.......", "..kkkkkkk......."],
'lantern': ["...kkkkk........", "....kxk.........", "...kkkkkk.......", "..kryyyyrk......", ".kryYfYyyrk.....", ".kryfffyyrk.....", ".kryYfYyyrk.....", ".kryyyyyyrk.....", "..kryyyyrk......", "...kkkkkk.......", "....kyk.........", ".....k.........."],
'mushroom': ["....kkkkkk......", "..kkrrwrrrkk....", ".krrwwrrrwwrk...", "krrrrrrrwwrrrk..", "krwwrrrrrrrwrk..", "kkkkkkkkkkkkkk..", "....kEEEEk......", "....kEwEEk......", "....kEEEEk......", "...kkkkkkkk....."],
'crystal': [".......k........", "......kCk.......", "......kCck......", ".....kCccck.....", "..k..kCccck.....", ".kCk.kCcccvk....", ".kCck.kCcvk.k...", "kCccvkkCcvkkCk..", "kCcvkkCcccvkcvk.", "kkkkkkkkkkkkkkk."],
'sign': ["..kkkkkkkkkk....", ".kBBBBBBBBBBk...", ".kBnnBnnnBnBk...", ".kBBBBBBBBBBk...", ".kBnnnBnnBBBk...", ".kBBBBBBBBBBk...", "..kkkkbbkkkk....", "......kbk.......", "......kbk.......", ".....kkbkk......", "....kgggggk....."],
'bowl': ["........................", "........................", "........................", "......kkkkkkkkkkk.......", "....kkBBnBBBnBBBBkk.....", "...kBnBBBBnBBBBnBBBk....", "..kkkkkkkkkkkkkkkkkkkk..", "..kUUUUUUUUUUUUUUUUUUk..", "...kUuuuuuuuuuuuuuuuk...", "....kuuuuwwuuuuwwuuk....", ".....kuuuuuuuuuuuuk.....", "......kkkkkkkkkkkk......"],
'dummy': ["..........kkkk..........", ".........kEEEEk.........", "........kEEEEEEk........", "........kErrrrEk........", "........kErwwrEk........", "........kErrrrEk........", ".........kEEEEk.........", "....kkkkkkbbbbkkkkkk....", "...kBBBBBBBBBBBBBBBBk...", "....kkkkkkbbbbkkkkkk....", ".........kEEEEk.........", "........kEEbbEEk........", "........kEEEEEEk........", "........kEEbbEEk........", "........kEEEEEEk........", ".........kkbbkk.........", "..........kbbk..........", "..........kbbk..........", "........kkbbbbkk........", ".......kgggggggggk......"],
'bed': ["........................", "........................", "........................", "........................", "...kkkkkkkkkkkkkkkkkk...", "..kPPPPPPPPPPPPPPPPPPk..", ".kPPpppppppppppppppPPPk.", ".kPpwwwwwwwwwwwwwwwpPPk.", ".kPpwWWWWWWWWWWWWWwpPPk.", ".kPpwwwwwwwwwwwwwwwpPPk.", ".kPppppppppppppppppPPPk.", "..kpppppppppppppppppPk..", "...kkkkkkkkkkkkkkkkkk..."],
'box_poke': ["...kkkkkkkkkk...", "..kRRRRRRRRRRk..", ".krRRRRyyRRRRrk.", ".kkkkkkyykkkkkk.", ".kwwwwwyywwwwwk.", ".kwwwwwyywwwwWk.", ".kwwwwwyywwwwWk.", ".kwwwwwyywwwwWk.", ".kWWWWWyyWWWWWk.", ".kkkkkkkkkkkkkk."],
'box_greater': ["...kkkkkkkkkk...", "..kUUUUUUUUUUk..", ".kuUUrRUUrRUUuk.", ".kkkkkkyykkkkkk.", ".kuuuuuyyuuuuuk.", ".kuuuuuyyuuuuuk.", ".kuuuuuyyuuuuuk.", ".kuuuuuyyuuuuuk.", ".kxxxxxyyxxxxxk.", ".kkkkkkkkkkkkkk."],
'box_ultra': ["...kkkkkkkkkk...", "..kxxxxxxxxxxk..", ".kxYYxxyyxxYYxk.", ".kkkkkkyykkkkkk.", ".kxxxxxyyxxxxxk.", ".kxyyxxyyxxyyxk.", ".kxxxxxyyxxxxxk.", ".kxxxxxyyxxxxxk.", ".kkkkkkyykkkkkk.", ".kkkkkkkkkkkkkk."],
'ticket': ["................", ".kkkkkkkkkkkkk..", "kyyyyyyykYYYYYk.", "kyGGGGyykYwwYYk.", "kyGGGGyykYYYYYk.", "kyyyyyyykYwwYYk.", "kyyyyyyykYYYYYk.", ".kkkkkkkkkkkkk.."],
'shinyticket': ["......k.........", ".kkkkkYkkkkkkk..", "kccccYfYcCCCCk..", "kcwwccYccCwwCk..", "kccccccckCCCCk..", "kcwwccccckCwwCk.", "kccccccccCCCCk..", ".kkkkkkkkkkkkk.."],
}
for name, rows in ART.items():
    w = max(len(r) for r in rows)
    im = Image.new('RGBA', (w, len(rows)), (0, 0, 0, 0))
    for y, r in enumerate(rows):
        for x, ch in enumerate(r):
            c = P.get(ch)
            if c: im.putpixel((x, y), c + (255,))
    im.save(os.path.join(OUT, name + '.png'))
print(len(ART), 'sprites')
