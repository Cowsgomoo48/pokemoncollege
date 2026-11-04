# Study Hall + Nursery backgrounds and unlock tickets, drawn to match the Workout Gym art.
import importlib.util,sys,os,random
from PIL import Image, ImageDraw, ImageFilter
random.seed(11)
from PIL import ImageFont
F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',22*2)
spec=importlib.util.spec_from_file_location('fa',os.path.join(os.path.dirname(__file__),'make_facility_art.py'))
src=open(spec.origin).read().split('\ngym_bg(')[0];ns={};exec(src,ns);ticket=ns['ticket'];S=2
def room(wallc,floorc,lines):
    W,H=571*S,482*S;im=Image.new('RGB',(W,H));d=ImageDraw.Draw(im);wall=int(H*.32)
    for y in range(wall):t=y/wall;d.line([(0,y),(W,y)],fill=tuple(int(wallc[i]-18*t) for i in range(3)))
    d.rectangle([0,wall-14*S,W,wall],fill=tuple(max(0,v-70) for v in wallc))
    for y in range(wall,H):t=(y-wall)/(H-wall);d.line([(0,y),(W,y)],fill=tuple(int(floorc[i]-30*t) for i in range(3)))
    py=wall;row=0
    while py<H:
        ph=int((16+row*1.6)*S);d.line([(0,py),(W,py)],fill=lines,width=S);off=(row*53*S)%(140*S)
        for x in range(-off,W,140*S):d.line([(x,py),(x,py+ph)],fill=lines,width=S)
        py+=ph;row+=1
    return im,d,W,H,wall
def glow(im,W,H,pts,col):
    g=Image.new('L',(W,H),0);gd=ImageDraw.Draw(g)
    for x,y,r in pts:gd.ellipse([x-r,y-r,x+r,y+r],fill=80)
    g=g.filter(ImageFilter.GaussianBlur(30*S));return Image.composite(Image.new('RGB',(W,H),col),im,g)
def study_bg(path):
    im,d,W,H,wall=room((214,200,170),(186,138,92),'#8d6239')
    cols=['#c0392b','#2e86c1','#27ae60','#f1c40f','#8e44ad','#e67e22','#16a085']
    for bx in (16*S,W-176*S):  # bookshelves
        d.rectangle([bx,10*S,bx+160*S,wall+40*S],fill='#6b4423',outline='#4a2e16',width=3*S)
        for r in range(4):
            sy=18*S+r*46*S;d.rectangle([bx+6*S,sy+38*S,bx+154*S,sy+42*S],fill='#4a2e16');x=bx+10*S
            while x<bx+148*S:
                w=random.randint(7,13)*S;h=random.randint(26,36)*S;d.rectangle([x,sy+38*S-h,x+w,sy+38*S],fill=random.choice(cols),outline='#2b1a0c',width=S);x+=w+S
    cb=(W//2-110*S,24*S,W//2+110*S,wall-30*S);d.rectangle(cb,fill='#2f5d3a',outline='#8d6239',width=7*S)  # chalkboard
    for k,txt in enumerate(['sin²θ+cos²θ=1','s = rθ','ln a − ln b']):d.text((cb[0]+18*S,cb[1]+14*S+k*34*S),txt,fill='#e8f5e9',font=F)
    for dx in (W*.22,W*.5,W*.78):  # desks
        x=int(dx);y=int(H*.66);d.rounded_rectangle([x-70*S,y+10*S,x+70*S,y+24*S],5*S,fill='#5a3a1c');d.rounded_rectangle([x-76*S,y-6*S,x+76*S,y+12*S],6*S,fill='#a56a35',outline='#6b4423',width=2*S)
        d.rectangle([x-62*S,y+24*S,x-54*S,y+70*S],fill='#5a3a1c');d.rectangle([x+54*S,y+24*S,x+62*S,y+70*S],fill='#5a3a1c')
        d.polygon([(x-30*S,y-6*S),(x-6*S,y-14*S),(x-6*S,y-4*S),(x-30*S,y+2*S)],fill='#f7f1e3');d.polygon([(x+18*S,y-6*S),(x-6*S,y-14*S),(x-6*S,y-4*S),(x+18*S,y+2*S)],fill='#efe6d2')
        d.ellipse([x+30*S,y-26*S,x+46*S,y-6*S],fill='#ffe08a');d.rectangle([x+36*S,y-8*S,x+40*S,y],fill='#555')
    im=glow(im,W,H,[(W*.22,H*.6,80*S),(W*.5,H*.6,80*S),(W*.78,H*.6,80*S),(W/2,0,160*S)],'#fff3c4')
    im.resize((571,482),Image.LANCZOS).save(path,quality=90)
def nursery_bg(path):
    im,d,W,H,wall=room((246,214,226),(226,196,160),'#bf9a72')
    for x in range(0,W,40*S):d.line([(x,0),(x,wall-14*S)],fill=(240,200,215),width=10*S)  # stripes
    for x in (90*S,W-160*S):  # windows
        d.rounded_rectangle([x,26*S,x+90*S,wall-44*S],14*S,fill='#dff3ff',outline='#c98aa3',width=4*S);d.line([(x+45*S,26*S),(x+45*S,wall-44*S)],fill='#c98aa3',width=3*S)
        d.ellipse([x+10*S,40*S,x+40*S,56*S],fill='#ffffff')
    rug=(int(W*.2),int(H*.55),int(W*.8),int(H*.9));d.ellipse([rug[0]+6*S,rug[1]+8*S,rug[2]+6*S,rug[3]+8*S],fill='#c9a27c');d.ellipse(rug,fill='#bfe3d0',outline='#8fc7ab',width=5*S)
    d.ellipse([rug[0]+40*S,rug[1]+20*S,rug[2]-40*S,rug[3]-20*S],outline='#e9f7ef',width=4*S)
    ix,iy=int(W*.84),int(H*.5)  # incubator
    d.rounded_rectangle([ix-46*S,iy+20*S,ix+46*S,iy+60*S],10*S,fill='#9fb7c8',outline='#6e8799',width=3*S);d.ellipse([ix-42*S,iy-40*S,ix+42*S,iy+34*S],fill='#e8f6ff',outline='#8fb2c8',width=4*S)
    d.ellipse([ix-16*S,iy-18*S,ix+16*S,iy+22*S],fill='#fff7e6',outline='#e3c99a',width=2*S);d.ellipse([ix-8*S,iy-6*S,ix-1*S,iy+2*S],fill='#f2a7c3');d.ellipse([ix+4*S,iy+6*S,ix+10*S,iy+12*S],fill='#9ad0f5')
    for k in range(9):  # toys / blocks
        x=random.randint(int(W*.06),int(W*.32));y=random.randint(int(H*.74),int(H*.94));c=random.choice(['#f39c9c','#9cc9f3','#f3e19c','#b5e8a8']);d.rounded_rectangle([x,y,x+18*S,y+18*S],3*S,fill=c,outline='#8a7a6a',width=S)
    im=glow(im,W,H,[(135*S,60*S,110*S),(W-115*S,60*S,110*S),(ix,iy,70*S)],'#fff6ea')
    im.resize((571,482),Image.LANCZOS).save(path,quality=90)
def book(d,cx,cy):
    w='#ffffff';d.polygon([(cx-22*S,cy-12*S),(cx-2*S,cy-8*S),(cx-2*S,cy+14*S),(cx-22*S,cy+10*S)],fill=w);d.polygon([(cx+22*S,cy-12*S),(cx+2*S,cy-8*S),(cx+2*S,cy+14*S),(cx+22*S,cy+10*S)],fill=w)
def egg(d,cx,cy):
    d.ellipse([cx-13*S,cy-17*S,cx+13*S,cy+15*S],fill='#ffffff');d.ellipse([cx-6*S,cy-7*S,cx,cy-1*S],fill='#f5a3c0');d.ellipse([cx+3*S,cy+3*S,cx+9*S,cy+9*S],fill='#f5a3c0')
study_bg('www/assets/fac/study.jpg');nursery_bg('www/assets/fac/nursery.jpg')
ticket('www/assets/items/fac_study.png',(110,160,255),(70,90,210),book)
ticket('www/assets/items/fac_nursery.png',(255,170,200),(230,110,160),egg)
def hourglass(d,cx,cy):
    w='#ffffff';d.polygon([(cx-12*S,cy-16*S),(cx+12*S,cy-16*S),(cx,cy)],fill=w);d.polygon([(cx-12*S,cy+16*S),(cx+12*S,cy+16*S),(cx,cy)],fill=w)
    d.line([(cx-15*S,cy-17*S),(cx+15*S,cy-17*S)],fill=w,width=3*S);d.line([(cx-15*S,cy+17*S),(cx+15*S,cy+17*S)],fill=w,width=3*S)
ticket('www/assets/items/hasten.png',(120,220,200),(40,160,170),hourglass)
ticket('www/assets/items/hasten3.png',(255,215,110),(230,140,40),hourglass)
def landfill_bg(path):
    im,d,W,H,wall=room((150,160,170),(150,140,120),'#7d7462')
    for x in range(0,W,60*S):d.line([(x,0),(x,wall-14*S)],fill=(130,140,150),width=3*S)
    for k in range(7):  # junk heaps
        cx=random.choice([random.randint(0,int(W*.25)),random.randint(int(W*.75),W)]);cy=random.randint(int(H*.5),int(H*.95));r=random.randint(40,80)*S
        d.pieslice([cx-r,cy-r//2,cx+r,cy+r],180,360,fill=random.choice(['#8a7f6a','#7a705c','#958a73']))
        for j in range(6):x=cx+random.randint(-r//2,r//2);y=cy-random.randint(0,r//3);d.rectangle([x,y,x+random.randint(8,18)*S,y+random.randint(6,12)*S],fill=random.choice(['#c0392b','#2e86c1','#f1c40f','#bdc3c7','#27ae60']))
    px=W//2;top=int(H*.12);bot=int(H*.78)  # press
    for sx in (px-130*S,px+110*S):d.rectangle([sx,top,sx+20*S,bot],fill='#4b525b',outline='#2a2f36',width=3*S)
    d.rectangle([px-140*S,top-10*S,px+140*S,top+24*S],fill='#5b6470',outline='#2a2f36',width=3*S)
    d.rectangle([px-14*S,top+24*S,px+14*S,int(H*.42)],fill='#aab2bb',outline='#2a2f36',width=2*S)
    ry=int(H*.42);d.rectangle([px-100*S,ry,px+100*S,ry+34*S],fill='#f2c14e',outline='#2a2f36',width=3*S)
    for x in range(px-100*S,px+100*S,26*S):d.polygon([(x,ry+34*S),(x+13*S,ry+34*S),(x+30*S,ry),(x+17*S,ry)],fill='#2a2f36')
    d.rectangle([px-120*S,bot-30*S,px+120*S,bot],fill='#3b424b',outline='#2a2f36',width=3*S)
    im=glow(im,W,H,[(px,int(H*.3),130*S)],'#fff2c0')
    im.resize((571,482),Image.LANCZOS).save(path,quality=90)
def pressicon(d,cx,cy):
    w='#ffffff';d.rectangle([cx-18*S,cy-17*S,cx+18*S,cy-11*S],fill=w);d.rectangle([cx-3*S,cy-11*S,cx+3*S,cy-3*S],fill=w);d.rectangle([cx-13*S,cy-3*S,cx+13*S,cy+3*S],fill=w);d.rectangle([cx-18*S,cy+11*S,cx+18*S,cy+17*S],fill=w);d.rectangle([cx-10*S,cy+6*S,cx+10*S,cy+11*S],fill=w)
landfill_bg('www/assets/fac/landfill.jpg')
ticket('www/assets/items/fac_landfill.png',(170,180,190),(90,100,115),pressicon)
print('ok')
