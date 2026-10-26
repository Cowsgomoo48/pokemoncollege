# Art for Facilities: the Workout Gym background (fixed) and the two new item icons.
from PIL import Image, ImageDraw, ImageFilter
import math, random
random.seed(7)
S=2
def gym_bg(path):
    W,H=571*S,482*S;im=Image.new('RGB',(W,H),'#c9d6e3');d=ImageDraw.Draw(im)
    wall=int(H*.30)
    # wall: soft panels
    for y in range(wall):
        t=y/wall;c=(int(196-20*t),int(210-18*t),int(226-16*t));d.line([(0,y),(W,y)],fill=c)
    for x in range(0,W,96*S):d.rectangle([x+6*S,14*S,x+90*S,wall-26*S],outline='#b3c3d4',width=2*S)
    # windows with light
    for x in (70*S,250*S,430*S):
        d.rounded_rectangle([x,22*S,x+70*S,wall-40*S],8*S,fill='#e9f6ff',outline='#8aa2bb',width=3*S)
        d.line([(x+35*S,22*S),(x+35*S,wall-40*S)],fill='#8aa2bb',width=3*S)
    # baseboard
    d.rectangle([0,wall-14*S,W,wall],fill='#7d8fa3')
    # floor: wooden planks
    for y in range(wall,H):
        t=(y-wall)/(H-wall);c=(int(214-30*t),int(170-28*t),int(118-24*t));d.line([(0,y),(W,y)],fill=c)
    py=wall;row=0
    while py<H:
        ph=int((16+row*1.6)*S);d.line([(0,py),(W,py)],fill='#a8784c',width=S)
        off=(row*53*S)%(140*S)
        for x in range(-off,W,140*S):d.line([(x,py),(x,py+ph)],fill='#a8784c',width=S)
        py+=ph;row+=1
    # training mat
    mx0,my0,mx1,my1=int(W*.24),int(H*.52),int(W*.76),int(H*.86)
    d.rounded_rectangle([mx0+5*S,my0+7*S,mx1+5*S,my1+7*S],14*S,fill='#9a6c43')
    d.rounded_rectangle([mx0,my0,mx1,my1],14*S,fill='#3f7fc6',outline='#2b5d99',width=4*S)
    d.rounded_rectangle([mx0+14*S,my0+12*S,mx1-14*S,my1-12*S],10*S,outline='#8fc0f0',width=3*S)
    cx,cy=(mx0+mx1)//2,(my0+my1)//2;d.ellipse([cx-40*S,cy-28*S,cx+40*S,cy+28*S],outline='#8fc0f0',width=3*S);d.line([(cx,my0+12*S),(cx,my1-12*S)],fill='#8fc0f0',width=3*S)
    # dumbbell rack on the wall line (left) and a punching bag post (right) as fixed scenery
    rx=24*S;ry=wall-6*S
    d.rectangle([rx,ry-40*S,rx+120*S,ry],fill='#55606e');d.rectangle([rx+6*S,ry-34*S,rx+114*S,ry-30*S],fill='#3a434e');d.rectangle([rx+6*S,ry-16*S,rx+114*S,ry-12*S],fill='#3a434e')
    for i in range(4):
        bx=rx+14*S+i*26*S
        for yy in (ry-38*S,ry-20*S):
            d.rectangle([bx,yy,bx+6*S,yy+8*S],fill='#d65a4a');d.rectangle([bx+6*S,yy+3*S,bx+14*S,yy+5*S],fill='#c9ced6');d.rectangle([bx+14*S,yy,bx+20*S,yy+8*S],fill='#d65a4a')
    # banner
    bx=W//2-70*S;d.rectangle([bx,8*S,bx+140*S,30*S],fill='#d94b3f');d.polygon([(bx,30*S),(bx+12*S,30*S),(bx,40*S)],fill='#a8352c');d.polygon([(bx+140*S,30*S),(bx+128*S,30*S),(bx+140*S,40*S)],fill='#a8352c')
    dumbbell(d,W//2,19*S)
    # ceiling lamps glow
    glow=Image.new('L',(W,H),0);g=ImageDraw.Draw(glow)
    for x in (W*.2,W*.5,W*.8):g.ellipse([x-90*S,-60*S,x+90*S,90*S],fill=70)
    glow=glow.filter(ImageFilter.GaussianBlur(30*S));im=Image.composite(Image.new('RGB',(W,H),'#fffbe8'),im,glow)
    im=im.resize((571,482),Image.LANCZOS);im.save(path,quality=90)
def ticket(path,c0,c1,icon):
    W,H=160*S,87*S;im=Image.new('RGBA',(W,H),(0,0,0,0));d=ImageDraw.Draw(im)
    body=Image.new('RGBA',(W,H),(0,0,0,0));bd=ImageDraw.Draw(body)
    for x in range(W):
        t=x/W;c=tuple(int(c0[i]+(c1[i]-c0[i])*t) for i in range(3))+(255,);bd.line([(x,0),(x,H)],fill=c)
    mask=Image.new('L',(W,H),0);md=ImageDraw.Draw(mask);md.rounded_rectangle([2*S,2*S,W-2*S,H-2*S],10*S,fill=255)
    for cx in (2*S,W-2*S):md.ellipse([cx-11*S,H//2-11*S,cx+11*S,H//2+11*S],fill=0)
    im.paste(body,(0,0),mask)
    # dashed tear line + shine
    for y in range(8*S,H-8*S,10*S):d.line([(W-40*S,y),(W-40*S,y+5*S)],fill=(255,255,255,170),width=2*S)
    sh=Image.new('RGBA',(W,H),(0,0,0,0));sd=ImageDraw.Draw(sh);sd.rounded_rectangle([6*S,5*S,W-6*S,H//2-4*S],8*S,fill=(255,255,255,45));im=Image.alpha_composite(im,Image.composite(sh,Image.new('RGBA',(W,H),(0,0,0,0)),mask))
    d=ImageDraw.Draw(im)
    # pill with icon
    px0,py0,px1,py1=26*S,24*S,96*S,63*S;d.rounded_rectangle([px0,py0,px1,py1],12*S,fill=tuple(max(0,v-40) for v in c1)+(255,),outline=(255,255,255,200),width=2*S)
    cx,cy=(px0+px1)//2,(py0+py1)//2;icon(d,cx,cy)
    d.text((W-30*S,H//2-6*S),'✦',fill=(255,255,255,200))
    outline=Image.new('RGBA',(W,H),(0,0,0,0));od=ImageDraw.Draw(outline)
    im=im.resize((160,87),Image.LANCZOS);im.save(path)
def dumbbell(d,cx,cy):
    w='#ffffff';d.rectangle([cx-22*S,cy-3*S,cx+22*S,cy+3*S],fill=w)
    for sx in (-1,1):
        d.rounded_rectangle([cx+sx*16*S-5*S,cy-12*S,cx+sx*16*S+5*S,cy+12*S],3*S,fill=w);d.rounded_rectangle([cx+sx*25*S-3*S,cy-8*S,cx+sx*25*S+3*S,cy+8*S],2*S,fill=w)
def levelup(d,cx,cy):
    w='#ffffff';d.polygon([(cx-8*S,cy-15*S),(cx-20*S,cy-1*S),(cx-13*S,cy-1*S),(cx-13*S,cy+14*S),(cx-3*S,cy+14*S),(cx-3*S,cy-1*S),(cx+4*S,cy-1*S)],fill=w)
    d.rectangle([cx+9*S,cy-2*S,cx+23*S,cy+2*S],fill=w);d.rectangle([cx+14*S,cy-7*S,cx+18*S,cy+7*S],fill=w)
gym_bg('www/assets/fac/gym.jpg')
ticket('www/assets/items/fac_gym.png',(255,150,60),(230,70,50),dumbbell)
ticket('www/assets/items/facticket.png',(70,200,140),(30,140,120),levelup)
print('ok')
