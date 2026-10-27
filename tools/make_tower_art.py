# Battle Tower environment backgrounds (one per environment). Classic top-down battle view like Mystery Dungeon:
# foes stand on the far side (top), your team on the near side (bottom), with a soft lit patch of ground in the middle.
from PIL import Image, ImageDraw, ImageFilter
import math, random
W,H,S=480,640,2
def base(top,mid,ground,horizon=.46):
    im=Image.new('RGB',(W*S,H*S));d=ImageDraw.Draw(im);hz=int(H*S*horizon)
    for y in range(H*S):
        if y<hz:t=y/hz;c=tuple(int(top[i]+(mid[i]-top[i])*t) for i in range(3))
        else:t=(y-hz)/(H*S-hz);c=tuple(int(ground[0][i]+(ground[1][i]-ground[0][i])*t) for i in range(3))
        d.line([(0,y),(W*S,y)],fill=c)
    return im,d,hz
def patch(im,col):
    g=Image.new('L',im.size,0);gd=ImageDraw.Draw(g);cx,cy=W*S/2,H*S*.86
    gd.ellipse([cx-W*S*.32,cy-H*S*.34,cx+W*S*.32,cy+H*S*.34],fill=120)
    g=g.filter(ImageFilter.GaussianBlur(18*S));return Image.composite(Image.new('RGB',im.size,col),im,g)
def glow(im,pts,color,r,alpha):
    g=Image.new('L',im.size,0);gd=ImageDraw.Draw(g)
    for x,y in pts:gd.ellipse([x-r,y-r,x+r,y+r],fill=alpha)
    g=g.filter(ImageFilter.GaussianBlur(r*.6));return Image.composite(Image.new('RGB',im.size,color),im,g)
def save(im,name):im.resize((W,H),Image.LANCZOS).save('www/assets/tower/'+name+'.jpg',quality=88)
random.seed(3)
# Electric Workshop
im,d,hz=base((28,36,58),(60,74,104),((88,96,112),(54,60,74)))
for x in range(0,W*S,90*S):d.rectangle([x+8*S,30*S,x+70*S,hz-20*S],outline=(90,108,140),width=3*S)
for x in range(-H*S,W*S,60*S):d.polygon([(x,hz-14*S),(x+30*S,hz-14*S),(x+50*S,hz),(x+20*S,hz)],fill=(236,196,40))
d.rectangle([0,hz-14*S,W*S,hz-12*S],fill=(30,30,30))
for y in range(hz,H*S,34*S):d.line([(0,y),(W*S,y)],fill=(72,80,96),width=2*S)
for x in range(0,W*S,60*S):d.line([(x,hz),(x-(x-W*S/2)*.6,H*S)],fill=(72,80,96),width=2*S)
pts=[(random.randint(0,W*S),random.randint(20*S,hz-40*S)) for _ in range(6)]
for x,y in pts:d.line([(x,y),(x+10*S,y+16*S),(x+2*S,y+18*S),(x+14*S,y+36*S)],fill=(255,240,120),width=4*S)
im=glow(im,pts,(255,230,90),26*S,110);im=patch(im,(96,106,124));save(im,'electric')
# Grass Jungle
im,d,hz=base((120,190,120),(170,220,140),((96,170,80),(54,120,52)))
for i in range(14):
    x=random.randint(0,W*S);d.ellipse([x-80*S,hz-160*S-random.randint(0,60)*S,x+80*S,hz+20*S],fill=random.choice([(48,120,60),(60,140,70),(40,104,54)]))
for i in range(30):
    x=random.randint(0,W*S);d.line([(x,0),(x+random.randint(-20,20)*S,random.randint(40,160)*S)],fill=(40,110,50),width=3*S)
for i in range(400):
    x=random.randint(0,W*S);y=random.randint(hz,H*S);d.line([(x,y),(x+random.randint(-4,4)*S,y-8*S)],fill=(70,150,60),width=S)
im=patch(im,(110,178,90));save(im,'grass')
# Misty World
im,d,hz=base((250,214,236),(232,206,246),((236,214,240),(206,180,226)))
for i in range(5):
    y=hz-10*S-i*24*S;d.ellipse([-100*S+i*60*S,y,W*S*.6+i*60*S,y+80*S],fill=(244,226,248))
im=im.filter(ImageFilter.GaussianBlur(6*S));d=ImageDraw.Draw(im)
pts=[(random.randint(0,W*S),random.randint(0,H*S)) for _ in range(40)]
for x,y in pts:
    r=random.randint(2,5)*S;d.polygon([(x,y-r*2),(x+r//2,y-r//2),(x+r*2,y),(x+r//2,y+r//2),(x,y+r*2),(x-r//2,y+r//2),(x-r*2,y),(x-r//2,y-r//2)],fill=(255,255,255))
im=patch(im,(250,230,250));save(im,'misty')
# Psychic Mindscape
im,d,hz=base((60,20,90),(140,50,150),((120,50,140),(70,24,96)),.5)
cx,cy=W*S/2,hz*.7
for r in range(40*S,500*S,36*S):d.ellipse([cx-r,cy-r*.45,cx+r,cy+r*.45],outline=(220,120,230),width=2*S)
for i in range(12):
    x,y=random.randint(0,W*S),random.randint(0,hz);s=random.randint(10,26)*S;a=random.random()*6.28
    d.polygon([(x+s*math.cos(a+k*2.094),y+s*math.sin(a+k*2.094)) for k in range(3)],outline=(255,200,255),width=3*S)
im=glow(im,[(cx,cy)],(255,150,255),70*S,140);im=patch(im,(160,70,170));save(im,'psychic')
# Concrete Jungle
im,d,hz=base((150,170,190),(200,206,212),((120,122,128),(84,86,92)))
x=0
while x<W*S:
    w=random.randint(40,90)*S;h=random.randint(80,200)*S;c=random.choice([(110,118,130),(96,104,116),(124,130,140)]);d.rectangle([x,hz-h,x+w,hz],fill=c)
    for wy in range(hz-h+10*S,hz-10*S,18*S):
        for wx in range(x+8*S,x+w-10*S,16*S):d.rectangle([wx,wy,wx+8*S,wy+10*S],fill=(176,196,214) if random.random()<.7 else (240,220,140))
    x+=w+random.randint(0,10)*S
for i in range(25):
    x,y=random.randint(0,W*S),random.randint(hz,H*S);pts=[(x,y)]
    for k in range(4):x+=random.randint(-20,20)*S;y+=random.randint(-8,8)*S;pts.append((x,y))
    d.line(pts,fill=(60,62,66),width=2*S)
    if random.random()<.5:d.ellipse([x-6*S,y-10*S,x+6*S,y],fill=(80,150,70))
im=patch(im,(140,142,148));save(im,'concrete')
# Vicious Wilds
im,d,hz=base((120,54,40),(230,140,70),((150,100,60),(96,60,36)))
for i in range(9):
    x=random.randint(0,W*S);h=random.randint(60,150)*S;w=random.randint(30,70)*S;d.polygon([(x-w,hz),(x-w*.2,hz-h),(x+w*.3,hz-h*.7),(x+w,hz)],fill=random.choice([(80,46,34),(96,56,40),(70,40,30)]))
for i in range(6):
    x,y=random.randint(40,W*S-40),random.randint(hz+20*S,H*S-20*S)
    for k in range(3):d.line([(x+k*10*S,y),(x+k*10*S+26*S,y+40*S)],fill=(70,40,26),width=3*S)
d.ellipse([W*S*.78,30*S,W*S*.78+60*S,90*S],fill=(255,220,150))
im=patch(im,(176,124,78));save(im,'wilds')

# Holy Sanctum: bright hall, light shafts, gold trim
im,d,hz=base((236,226,196),(252,246,226),((236,226,200),(206,192,160)))
for x in range(30*S,W*S,110*S):
    d.rectangle([x,40*S,x+34*S,hz],fill=(244,238,220));d.rectangle([x-6*S,30*S,x+40*S,44*S],fill=(214,184,110));d.rectangle([x-6*S,hz-10*S,x+40*S,hz],fill=(214,184,110))
g=Image.new('L',im.size,0);gd=ImageDraw.Draw(g)
for k in range(4):cx=random.randint(60,W-60)*S;gd.polygon([(cx-20*S,0),(cx+20*S,0),(cx+90*S,H*S),(cx-30*S,H*S)],fill=70)
g=g.filter(ImageFilter.GaussianBlur(14*S));im=Image.composite(Image.new('RGB',im.size,(255,250,220)),im,g);d=ImageDraw.Draw(im)
for y in range(hz,H*S,30*S):d.line([(0,y),(W*S,y)],fill=(220,206,170),width=S)
im=patch(im,(255,244,214));save(im,'holy')
# Sludge Hell: toxic purple cave, green bubbling floor
im,d,hz=base((40,18,52),(80,30,90),((70,110,40),(40,70,24)))
for i in range(10):
    x=random.randint(0,W*S);d.polygon([(x-40*S,0),(x+40*S,0),(x,random.randint(60,160)*S)],fill=(60,24,70))
for i in range(60):
    x,y=random.randint(0,W*S),random.randint(hz,H*S);r=random.randint(4,14)*S;d.ellipse([x-r,y-r,x+r,y+r],outline=(150,220,80),width=2*S,fill=(96,150,50))
im=glow(im,[(random.randint(0,W*S),random.randint(hz,H*S)) for _ in range(8)],(170,255,90),30*S,90);im=patch(im,(110,160,60));save(im,'sludge')
# Dragon Cavern: dark rock, glowing red-violet crystals
im,d,hz=base((24,16,30),(56,34,60),((70,52,60),(40,28,36)))
pts=[]
for i in range(14):
    x=random.randint(0,W*S);y=hz-random.randint(0,120)*S;h=random.randint(30,80)*S;w=random.randint(10,22)*S;c=random.choice([(200,60,90),(150,70,200),(230,110,80)])
    d.polygon([(x,y-h),(x+w,y),(x,y+8*S),(x-w,y)],fill=c);pts.append((x,y-h//2))
im=glow(im,pts,(255,90,120),24*S,90);d=ImageDraw.Draw(im)
for i in range(30):x,y=random.randint(0,W*S),random.randint(hz,H*S);d.line([(x,y),(x+random.randint(-30,30)*S,y+random.randint(4,14)*S)],fill=(30,20,26),width=2*S)
im=patch(im,(96,74,84));save(im,'dragon')
# Legend's Temple: ancient stone, columns, golden glow
im,d,hz=base((60,70,110),(150,140,170),((150,140,120),(100,92,80)))
for x in range(20*S,W*S,96*S):
    d.rectangle([x,60*S,x+30*S,hz],fill=(190,180,160));d.rectangle([x-8*S,50*S,x+38*S,64*S],fill=(160,150,130));
    for k in range(3):d.line([(x+8*S+k*7*S,64*S),(x+8*S+k*7*S,hz)],fill=(170,160,140),width=2*S)
d.polygon([(0,50*S),(W*S/2,6*S),(W*S,50*S)],fill=(170,160,140))
im=glow(im,[(W*S/2,hz-40*S)],(255,214,120),90*S,120);d=ImageDraw.Draw(im)
for y in range(hz,H*S,26*S):d.line([(0,y),(W*S,y)],fill=(120,112,96),width=2*S)
for x in range(0,W*S,52*S):d.line([(x,hz),(x-(x-W*S/2)*.5,H*S)],fill=(120,112,96),width=2*S)
im=patch(im,(200,186,150));save(im,'legend')
# Trepidation Habitat: stormy sea, wet rocky shore
im,d,hz=base((40,56,80),(70,96,120),((60,90,110),(34,56,72)))
for y in range(int(hz*.55),hz,10*S):
    for x in range(-40*S,W*S,60*S):d.arc([x+((y//S)%60)*S,y-8*S,x+50*S+((y//S)%60)*S,y+8*S],200,340,fill=(140,180,210),width=2*S)
for i in range(5):x=random.randint(0,W*S);d.line([(x,0),(x+20*S,40*S),(x+5*S,46*S),(x+30*S,100*S)],fill=(220,230,255),width=2*S)
for i in range(30):
    x,y=random.randint(0,W*S),random.randint(hz,H*S);r=random.randint(10,30)*S;d.ellipse([x-r,y-r//2,x+r,y+r//2],fill=random.choice([(50,70,84),(44,62,76),(58,80,96)]))
im=patch(im,(80,120,140));save(im,'trepid')
# Sleepless Hollow: night woods, big moon, mist
im,d,hz=base((10,10,30),(40,30,70),((40,40,60),(20,20,36)))
d.ellipse([W*S*.62,40*S,W*S*.62+90*S,130*S],fill=(240,236,200))
im=glow(im,[(W*S*.62+45*S,85*S)],(255,250,210),70*S,90);d=ImageDraw.Draw(im)
for i in range(16):
    x=random.randint(0,W*S);h=random.randint(120,260)*S;d.rectangle([x-6*S,hz-h,x+6*S,hz],fill=(16,14,26))
    for k in range(4):yy=hz-h+k*28*S;d.line([(x,yy),(x+random.choice([-1,1])*random.randint(20,40)*S,yy-16*S)],fill=(16,14,26),width=4*S)
for i in range(40):x,y=random.randint(0,W*S),random.randint(0,int(hz*.6));d.point((x,y),fill=(230,230,255))
mist=Image.new('L',im.size,0);md=ImageDraw.Draw(mist)
for i in range(8):y=hz+random.randint(-20,80)*S;x0=random.randint(-100,W)*S;md.ellipse([x0,y,x0+random.randint(160,320)*S,y+40*S],fill=90)
mist=mist.filter(ImageFilter.GaussianBlur(16*S));im=Image.composite(Image.new('RGB',im.size,(150,150,190)),im,mist)
im=patch(im,(70,70,100));save(im,'sleepless')

# Dank Depths: murky cave, drips, bats
im,d,hz=base((14,16,20),(30,36,40),((40,46,44),(22,26,26)))
for i in range(12):x=random.randint(0,W*S);d.polygon([(x-30*S,0),(x+30*S,0),(x,random.randint(50,140)*S)],fill=(24,28,32))
for i in range(10):
    x,y=random.randint(20,W-20)*S,random.randint(30,int(hz/S)-40)*S;w=14*S
    d.polygon([(x-w,y),(x-w//2,y-6*S),(x,y+2*S),(x+w//2,y-6*S),(x+w,y),(x+w//2,y+4*S),(x,y+8*S),(x-w//2,y+4*S)],fill=(8,8,12))
for i in range(40):x,y=random.randint(0,W*S),random.randint(hz,H*S);r=random.randint(8,26)*S;d.ellipse([x-r,y-r//3,x+r,y+r//3],fill=(30,40,36))
im=patch(im,(56,64,60));save(im,'dank')
# Crystal Mines: mine tunnel, beams, blue crystals
im,d,hz=base((40,34,30),(70,58,48),((96,80,64),(60,48,40)))
for x in range(0,W*S,120*S):d.rectangle([x+10*S,30*S,x+26*S,hz],fill=(110,80,50));d.rectangle([x,30*S,x+130*S,44*S],fill=(110,80,50))
pts=[]
for i in range(16):
    x=random.randint(0,W*S);y=random.choice([random.randint(60,int(hz/S))*S,random.randint(int(hz/S),H)*S]);h=random.randint(16,40)*S;w=random.randint(6,14)*S
    d.polygon([(x,y-h),(x+w,y),(x,y+6*S),(x-w,y)],fill=random.choice([(110,200,240),(150,230,250),(180,140,240)]));pts.append((x,y-h//2))
im=glow(im,pts,(140,220,255),20*S,80);d=ImageDraw.Draw(im)
d.line([(W*S*.3,H*S),(W*S*.45,hz)],fill=(80,70,60),width=6*S);d.line([(W*S*.7,H*S),(W*S*.55,hz)],fill=(80,70,60),width=6*S)
im=patch(im,(130,110,90));save(im,'crystal')
# Snowscape: pale sky, snowy hills, falling snow
im,d,hz=base((170,200,228),(220,232,244),((236,242,250),(206,218,232)))
for i in range(6):x=random.randint(-50,W)*S;d.ellipse([x,hz-random.randint(40,90)*S,x+random.randint(160,260)*S,hz+60*S],fill=(240,246,252))
for i in range(5):x=random.randint(0,W*S);h=random.randint(50,90)*S;d.polygon([(x,hz-h),(x-24*S,hz),(x+24*S,hz)],fill=(70,110,100));d.polygon([(x,hz-h),(x-10*S,hz-h+20*S),(x+10*S,hz-h+20*S)],fill=(250,252,255))
for i in range(160):x,y=random.randint(0,W*S),random.randint(0,H*S);r=random.randint(1,3)*S;d.ellipse([x-r,y-r,x+r,y+r],fill=(255,255,255))
im=patch(im,(250,252,255));save(im,'snow')
# Dice Arena: casino stage, checkered floor, big dice
im,d,hz=base((60,10,30),(120,20,50),((30,90,50),(16,60,32)))
for i in range(12):x=random.randint(0,W*S);d.ellipse([x-4*S,20*S,x+4*S,28*S],fill=(255,220,120))
for k,(cx,cy,sz) in enumerate([(W*.2,hz/S-50,60),(W*.78,hz/S-40,50)]):
    cx,cy,sz=cx*S,cy*S,sz*S;d.rounded_rectangle([cx-sz/2,cy-sz/2,cx+sz/2,cy+sz/2],radius=10*S,fill=(250,250,250),outline=(180,180,180),width=2*S)
    for dx,dy in ([(-1,-1),(1,1),(0,0)] if k==0 else [(-1,-1),(1,-1),(-1,1),(1,1)]):d.ellipse([cx+dx*sz/4-5*S,cy+dy*sz/4-5*S,cx+dx*sz/4+5*S,cy+dy*sz/4+5*S],fill=(200,30,50))
for y in range(hz,H*S,36*S):
    for x in range(0,W*S,36*S):
        if ((x//(36*S))+(y-hz)//(36*S))%2==0:d.rectangle([x,y,x+36*S,y+36*S],fill=(24,76,42))
im=patch(im,(60,130,80));save(im,'dice')
# Spook Zone: purple graveyard, wisps
im,d,hz=base((30,10,50),(70,30,100),((50,40,70),(30,22,44)))
for i in range(9):
    x=random.randint(10,W-10)*S;y=hz+random.randint(-10,10)*S;w=random.randint(18,28)*S;h=random.randint(30,50)*S
    d.rounded_rectangle([x-w//2,y-h,x+w//2,y],radius=10*S,fill=(90,86,110));d.line([(x,y-h+10*S),(x,y-h+26*S)],fill=(60,56,80),width=2*S);d.line([(x-6*S,y-h+16*S),(x+6*S,y-h+16*S)],fill=(60,56,80),width=2*S)
pts=[(random.randint(0,W*S),random.randint(30*S,H*S)) for _ in range(10)]
im=glow(im,pts,(160,255,220),16*S,140);im=patch(im,(90,70,120));save(im,'spook')
# King's Battlefield: royal red carpet, banners, gold
im,d,hz=base((60,30,20),(120,70,40),((150,120,80),(100,76,50)))
for x in range(30*S,W*S,110*S):
    d.rectangle([x,20*S,x+40*S,hz-30*S],fill=(150,24,40));d.polygon([(x,hz-30*S),(x+20*S,hz-14*S),(x+40*S,hz-30*S)],fill=(150,24,40));d.ellipse([x+12*S,60*S,x+28*S,76*S],fill=(240,200,80))
d.polygon([(W*S*.42,hz),(W*S*.58,hz),(W*S*.8,H*S),(W*S*.2,H*S)],fill=(170,30,46))
d.line([(W*S*.42,hz),(W*S*.2,H*S)],fill=(240,200,80),width=3*S);d.line([(W*S*.58,hz),(W*S*.8,H*S)],fill=(240,200,80),width=3*S)
im=glow(im,[(W*S/2,40*S)],(255,220,120),60*S,110);im=patch(im,(200,160,100));save(im,'king')
# Pokémon Center: clean lobby, red-white walls, glowing healing machine
im,d,hz=base((240,236,236),(250,248,248),((236,226,220),(210,198,192)))
d.rectangle([0,hz-60*S,W*S,hz-48*S],fill=(220,60,70))
cx=W*S/2;d.rounded_rectangle([cx-70*S,hz-110*S,cx+70*S,hz-20*S],radius=12*S,fill=(250,250,250),outline=(210,90,100),width=3*S)
for k in range(3):d.ellipse([cx-50*S+k*36*S,hz-80*S,cx-30*S+k*36*S,hz-60*S],fill=(255,120,140))
im=glow(im,[(cx,hz-70*S)],(255,170,190),50*S,90);d=ImageDraw.Draw(im)
for y in range(hz,H*S,40*S):
    for x in range(0,W*S,40*S):d.rectangle([x,y,x+40*S,y+40*S],outline=(220,210,204),width=S)
im=patch(im,(250,240,236));save(im,'center')
# Lifeblock Gym: gym hall, green walls, stacked blocks, mats
im,d,hz=base((40,70,60),(70,110,90),((120,140,110),(90,108,84)))
for i in range(5):
    bx=random.randint(0,W-60)*S
    for r_ in range(random.randint(2,4)):
        for c_ in range(3-r_%2):d.rectangle([bx+c_*22*S+(r_%2)*11*S,hz-(r_+1)*20*S,bx+c_*22*S+(r_%2)*11*S+20*S,hz-r_*20*S-2*S],fill=random.choice([(90,200,120),(70,170,100),(110,220,140)]),outline=(40,90,60),width=S)
for x in range(0,W*S,80*S):d.rectangle([x+4*S,hz+20*S,x+74*S,H*S],fill=(70,130,90))
im=patch(im,(140,200,150));save(im,'lifeblock')
print('ok')
