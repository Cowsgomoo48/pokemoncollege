// ===================== EQUATION LAB: equation-choice practice problems + the "Help me start" walkthrough =====================
// The hard part of word problems is usually choosing the equation, not the algebra.
// Each problem: 1) Inventory: mark what's given and what's asked. 2) Pick the equation. 3) Solve (Full Solve only).
// Numbers are random every time and the answer is worked out in code.
const EQ_G=[
 {id:'kin',subj:'Physics',name:'Kinematics',icon:'🏎️',sym:['v₀','v','a','t','Δx'],pr:['kinematics']},
 {id:'force',subj:'Physics',name:'Forces',icon:'💪',sym:['F','m','a','F_g','f','μ','N','k','x'],pr:['newton2','weight','friction','spring','tension','incline']},
 {id:'energy',subj:'Physics',name:'Work, Energy & Power',icon:'⚡',sym:['W','F','d','θ','KE','PE','m','v','h','P','t','k','x'],pr:['work','energy','energy_cons','power','energy_units']},
 {id:'proj',subj:'Physics',name:'Projectiles',icon:'🎯',sym:['Δy','t','vₓ','Δx'],pr:['projectile']},
 {id:'circ',subj:'Physics',name:'Circular Motion',icon:'🎡',sym:['v','r','T','a_c','F_c','m'],pr:['circular']},
 {id:'elec',subj:'Physics',name:'Circuits',icon:'🔌',sym:['V','I','R','P'],pr:['ohm']},
 {id:'arc',subj:'Precalculus',name:'Arcs & Angular Speed',icon:'⭕',sym:['s','r','θ','v','ω'],pr:['arc_length']},
 {id:'wave',subj:'Precalculus',name:'Sinusoidal Models',icon:'🌊',sym:['max','min','A','D','T','B'],pr:['ferris','sinusoid']},
 {id:'unit',subj:'Precalculus',name:'Unit Circle Identities',icon:'📐',sym:['sin θ','cos θ','tan θ','quadrant'],pr:['unit_circle','trig_ident']},
 {id:'growth',subj:'Algebra',name:'Growth & Interest',icon:'📈',sym:['A','P','r','t'],pr:['exp_eq','logs']}];
const EQ={
 k1:{g:'kin',f:'v = v₀ + at',n:'Velocity–time',when:'Δx (distance) is not given and not asked.'},
 k2:{g:'kin',f:'Δx = v₀t + ½at²',n:'Displacement–time',when:'the final velocity v is not given and not asked.'},
 k3:{g:'kin',f:'v² = v₀² + 2aΔx',n:'Velocity–displacement',when:'time t is not given and not asked.'},
 k4:{g:'kin',f:'Δx = ½(v₀ + v)t',n:'Average velocity',when:'acceleration a is not given and not asked.'},
 f1:{g:'force',f:'F = ma',n:'Newton’s 2nd law',when:'a net force and an acceleration are involved.'},
 f2:{g:'force',f:'F_g = mg',n:'Weight',when:'you need the force of gravity on a mass (or the mass from a weight).'},
 f3:{g:'force',f:'f = μN',n:'Friction',when:'a coefficient of friction μ shows up. On level ground N = mg.'},
 f4:{g:'force',f:'F = kx',n:'Hooke’s law',when:'a spring is stretched or compressed and you need a force or k.'},
 e1:{g:'energy',f:'W = Fd cos θ',n:'Work',when:'a force moves something through a distance. θ is the angle between the force and the motion.'},
 e2:{g:'energy',f:'KE = ½mv²',n:'Kinetic energy',when:'the energy of something moving (mass and speed).'},
 e3:{g:'energy',f:'PE = mgh',n:'Gravitational PE',when:'height above a reference level matters.'},
 e4:{g:'energy',f:'P = W/t',n:'Power',when:'work or energy per unit of time (watts = J/s).'},
 e5:{g:'energy',f:'mgh = ½mv²',n:'Energy conservation',when:'something drops or slides down a height with no friction: height ↔ speed (mass cancels).'},
 e6:{g:'energy',f:'PEₛ = ½kx²',n:'Spring PE',when:'energy stored in a stretched or compressed spring.'},
 p1:{g:'proj',f:'Δy = ½gt²',n:'Vertical drop',when:'it starts with no vertical speed (dropped, rolls off, launched horizontally): height ↔ fall time.'},
 p2:{g:'proj',f:'Δx = vₓt',n:'Horizontal motion',when:'horizontal distance: horizontal speed stays constant in the air.'},
 c1:{g:'circ',f:'a_c = v²/r',n:'Centripetal acceleration',when:'moving in a circle and you need the acceleration.'},
 c2:{g:'circ',f:'F_c = mv²/r',n:'Centripetal force',when:'moving in a circle and you need the force (mass given).'},
 c3:{g:'circ',f:'v = 2πr/T',n:'Speed from period',when:'you know the time for one full turn (the period T).'},
 o1:{g:'elec',f:'V = IR',n:'Ohm’s law',when:'voltage, current and resistance.'},
 o2:{g:'elec',f:'P = IV',n:'Electric power',when:'power from current and voltage.'},
 m1:{g:'arc',f:'s = rθ',n:'Arc length',when:'distance along a circle’s edge. θ must be in radians.'},
 m2:{g:'arc',f:'v = rω',n:'Linear speed',when:'turning an angular speed ω (radians per time) into an edge speed.'},
 m3:{g:'wave',f:'A = (max − min)/2',n:'Amplitude',when:'half the distance from the lowest to the highest point.'},
 m4:{g:'wave',f:'D = (max + min)/2',n:'Midline',when:'the middle height between the max and the min.'},
 m5:{g:'wave',f:'B = 2π/T',n:'B from the period',when:'you know the period T of a sine or cosine model.'},
 m6:{g:'unit',f:'sin²θ + cos²θ = 1',n:'Pythagorean identity',when:'you know sin θ or cos θ and need the other. The quadrant picks the sign.'},
 m7:{g:'unit',f:'tan θ = sin θ / cos θ',n:'Tangent ratio',when:'you need tan θ and know (or can find) sin θ and cos θ.'},
 g1:{g:'growth',f:'A = P(1 + r)ᵗ',n:'Compound growth',when:'growth by a percent once per period (yearly, monthly…).'},
 g2:{g:'growth',f:'A = Peʳᵗ',n:'Continuous growth',when:'the word “continuously” appears.'}};
const eqN=x=>prSig(x,3),eqR=prR,eqPk=prPick,G=9.8;
// templates: eq, make() → {q, giv:{sym:value}, unk, a (number or string), u (unit), re (rearranged), wr (likely wrong answers), note, alt (other right equations)}
const EQT=[
 ['k1',()=>{const v0=eqR(3,15),a=eqR(2,6),t=eqR(3,9);return{q:'A car moving at '+v0+' m/s speeds up at '+a+' m/s² for '+t+' s. How fast is it going at the end?',giv:{'v₀':v0+' m/s',a:a+' m/s²',t:t+' s'},unk:'v',a:v0+a*t,u:'m/s',re:'v = v₀ + at',wr:[a*t,v0+.5*a*t,v0*a*t]}}],
 ['k1',()=>{const v0=eqR(2,8),a=eqR(2,5),t=eqR(3,8),v=v0+a*t;return{q:'A cyclist speeds up from '+v0+' m/s to '+v+' m/s in '+t+' s. What is the acceleration?',giv:{'v₀':v0+' m/s',v:v+' m/s',t:t+' s'},unk:'a',a:(v-v0)/t,u:'m/s²',re:'a = (v − v₀)/t',wr:[v/t,(v+v0)/t,(v-v0)*t]}}],
 ['k1',()=>{const a=eqR(2,6),v=a*eqR(3,8);return{q:'A sprinter starts from rest and accelerates at '+a+' m/s² until reaching '+v+' m/s. How long does that take?',giv:{'v₀':'0 m/s (from rest)',a:a+' m/s²',v:v+' m/s'},unk:'t',a:v/a,u:'s',re:'t = (v − v₀)/a',wr:[v*a,2*v/a,Math.sqrt(2*v/a)],note:'“Starts from rest” means v₀ = 0.'}}],
 ['k2',()=>{const a=eqR(2,6),t=eqR(3,8);return{q:'A ball starts from rest and rolls down a ramp, speeding up at '+a+' m/s². How far does it roll in '+t+' s?',giv:{'v₀':'0 m/s (from rest)',a:a+' m/s²',t:t+' s'},unk:'Δx',a:.5*a*t*t,u:'m',re:'Δx = ½at²  (v₀ = 0)',wr:[a*t*t,a*t,.5*a*t],note:'“Starts from rest” means v₀ = 0.'}}],
 ['k2',()=>{const v0=eqR(5,20),a=eqR(1,4),t=eqR(3,8);return{q:'A truck moving at '+v0+' m/s accelerates at '+a+' m/s² for '+t+' s. How far does it travel during that time?',giv:{'v₀':v0+' m/s',a:a+' m/s²',t:t+' s'},unk:'Δx',a:v0*t+.5*a*t*t,u:'m',re:'Δx = v₀t + ½at²',wr:[v0*t,v0*t+a*t*t,.5*a*t*t]}}],
 ['k3',()=>{const v0=eqR(12,30),a=eqR(3,8);return{q:'A car traveling at '+v0+' m/s brakes, slowing at '+a+' m/s², until it stops. How far does it travel while braking?',giv:{'v₀':v0+' m/s',v:'0 m/s (stops)',a:'−'+a+' m/s²'},unk:'Δx',a:v0*v0/(2*a),u:'m',re:'Δx = (v² − v₀²)/(2a)',wr:[v0*v0/a,v0/(2*a),v0*v0*2*a],note:'“Until it stops” means v = 0. Slowing down makes a negative.'}}],
 ['k3',()=>{const h=eqR(5,45);return{q:'A rock is dropped from rest and falls '+h+' m. How fast is it moving just before it lands? (Ignore air resistance.)',giv:{'v₀':'0 m/s (dropped)',a:'9.8 m/s² (gravity)','Δx':h+' m'},unk:'v',a:Math.sqrt(2*G*h),u:'m/s',re:'v = √(v₀² + 2aΔx)',wr:[2*G*h,Math.sqrt(G*h),G*h],note:'“Dropped” means v₀ = 0, and a falling object’s acceleration is g = 9.8 m/s².',alt:['e5']}}],
 ['k3',()=>{const v=eqR(40,80),a=eqR(2,5);return{q:'A plane must reach '+v+' m/s to take off. Starting from rest, it accelerates at '+a+' m/s². How long must the runway be?',giv:{'v₀':'0 m/s (from rest)',v:v+' m/s',a:a+' m/s²'},unk:'Δx',a:v*v/(2*a),u:'m',re:'Δx = v²/(2a)  (v₀ = 0)',wr:[v*v/a,v/(2*a),v/a],note:'“Starting from rest” means v₀ = 0.'}}],
 ['k4',()=>{const v0=eqR(15,30),v=eqR(2,12),t=eqR(3,9);return{q:'A car slows steadily from '+v0+' m/s to '+v+' m/s over '+t+' s. How far does it travel in that time?',giv:{'v₀':v0+' m/s',v:v+' m/s',t:t+' s'},unk:'Δx',a:.5*(v0+v)*t,u:'m',re:'Δx = ½(v₀ + v)t',wr:[.5*(v0-v)*t,v0*t,(v0+v)*t]}}],
 ['k4',()=>{const v0=eqR(10,20),v=eqR(2,8),t=eqR(3,8),d=.5*(v0+v)*t;return{q:'A skier slows evenly from '+v0+' m/s to '+v+' m/s while covering '+eqN(d)+' m. How long does that take?',giv:{'v₀':v0+' m/s',v:v+' m/s','Δx':eqN(d)+' m'},unk:'t',a:t,u:'s',re:'t = 2Δx/(v₀ + v)',wr:[d/(v0+v),2*d/(v0-v),d/v0]}}],
 ['f1',()=>{const m=eqR(2,25),F=m*eqR(2,6);return{q:'A '+m+' kg cart is pushed with a net force of '+F+' N. What is its acceleration?',giv:{m:m+' kg',F:F+' N'},unk:'a',a:F/m,u:'m/s²',re:'a = F/m',wr:[F*m,m/F,F/(m*G)]}}],
 ['f1',()=>{const m=eqR(3,40),a=eqR(2,7);return{q:'What net force is needed to accelerate a '+m+' kg box at '+a+' m/s²?',giv:{m:m+' kg',a:a+' m/s²'},unk:'F',a:m*a,u:'N',re:'F = ma',wr:[m/a,m*G,m*a*G]}}],
 ['f2',()=>{const m=eqR(2,80);return{q:'What is the weight of a '+m+' kg backpack on Earth?',giv:{m:m+' kg'},unk:'F_g',a:m*G,u:'N',re:'F_g = mg',wr:[m,m/G,.5*m*G],note:'g = 9.8 m/s² is always known, so it isn’t on the list.'}}],
 ['f3',()=>{const m=eqR(5,40),mu=eqPk([.2,.25,.3,.4,.5]);return{q:'A '+m+' kg crate slides across a level floor. The coefficient of kinetic friction is '+mu+'. What is the friction force on it?',giv:{m:m+' kg','μ':String(mu)},unk:'f',a:mu*m*G,u:'N',re:'f = μN, with N = mg on level ground',wr:[mu*m,m*G,m*G/mu],note:'On a level floor the normal force is N = mg, so you get N from the mass.'}}],
 ['f3',()=>{const N=eqR(20,200),mu=eqPk([.15,.2,.3,.35,.45]);return{q:'A block is pressed against a wall with a normal force of '+N+' N. The coefficient of static friction is '+mu+'. What is the maximum friction force?',giv:{N:N+' N','μ':String(mu)},unk:'f',a:mu*N,u:'N',re:'f = μN',wr:[N/mu,mu*N*G,N]}}],
 ['f4',()=>{const k=eqR(50,400),x=eqPk([.05,.1,.15,.2,.25]);return{q:'A spring with spring constant '+k+' N/m is stretched '+x+' m. How hard does it pull back?',giv:{k:k+' N/m',x:x+' m'},unk:'F',a:k*x,u:'N',re:'F = kx',wr:[.5*k*x*x,k/x,k*x*x]}}],
 ['f4',()=>{const x=eqPk([.04,.05,.08,.1,.2]),k=eqR(100,600),F=k*x;return{q:'It takes '+eqN(F)+' N to stretch a spring '+x+' m. What is its spring constant?',giv:{F:eqN(F)+' N',x:x+' m'},unk:'k',a:k,u:'N/m',re:'k = F/x',wr:[F*x,2*F/(x*x),x/F]}}],
 ['e1',()=>{const F=eqR(20,120),d=eqR(3,20),th=eqPk([20,30,37,45,53,60]),c=Math.cos(th*Math.PI/180);return{q:'A rope pulls a sled '+d+' m with a '+F+' N force. The rope is angled '+th+'° above the ground. How much work does the rope do?',giv:{F:F+' N',d:d+' m','θ':th+'°'},unk:'W',a:F*d*c,u:'J',re:'W = Fd cos θ',wr:[F*d,F*d*Math.sin(th*Math.PI/180),F/d]}}],
 ['e1',()=>{const F=eqR(10,90),d=eqR(2,25);return{q:'You push a cart straight forward with a '+F+' N force for '+d+' m. How much work do you do?',giv:{F:F+' N',d:d+' m','θ':'0° (force along the motion)'},unk:'W',a:F*d,u:'J',re:'W = Fd cos 0° = Fd',wr:[F/d,.5*F*d,F*d*G],note:'Pushing straight along the motion means θ = 0°.'}}],
 ['e2',()=>{const m=eqR(2,80),v=eqR(2,15);return{q:'A '+m+' kg scooter rider moves at '+v+' m/s. What is the kinetic energy?',giv:{m:m+' kg',v:v+' m/s'},unk:'KE',a:.5*m*v*v,u:'J',re:'KE = ½mv²',wr:[m*v*v,.5*m*v,m*G*v]}}],
 ['e2',()=>{const m=eqPk([.5,1,2,4,5]),v=eqR(3,12),K=.5*m*v*v;return{q:'A '+m+' kg ball has '+eqN(K)+' J of kinetic energy. How fast is it moving?',giv:{m:m+' kg',KE:eqN(K)+' J'},unk:'v',a:v,u:'m/s',re:'v = √(2KE/m)',wr:[2*K/m,Math.sqrt(K/m),K/m]}}],
 ['e3',()=>{const m=eqR(2,30),h=eqPk([1.2,1.5,2,2.5,3,4]);return{q:'A '+m+' kg box is lifted onto a shelf '+h+' m high. How much gravitational potential energy does it gain?',giv:{m:m+' kg',h:h+' m'},unk:'PE',a:m*G*h,u:'J',re:'PE = mgh',wr:[m*h,.5*m*G*h,m*G]}}],
 ['e4',()=>{const W=eqR(6,60)*100,t=eqR(5,40);return{q:'A motor does '+W+' J of work in '+t+' s. What is its power output?',giv:{W:W+' J',t:t+' s'},unk:'P',a:W/t,u:'W',re:'P = W/t',wr:[W*t,t/W,W/(t*G)]}}],
 ['e4',()=>{const P=eqPk([40,60,75,100]),t=eqR(30,600);return{q:'A '+P+' W light bulb runs for '+t+' s. How much energy does it use?',giv:{P:P+' W',t:t+' s'},unk:'W',a:P*t,u:'J',re:'W = Pt',wr:[P/t,t/P,P*t/60]}}],
 ['e5',()=>{const h=eqR(10,60);return{q:'A roller coaster starts from rest at the top of a '+h+' m drop. Ignoring friction, how fast is it going at the bottom?',giv:{h:h+' m','v₀':'0 (from rest)'},unk:'v',a:Math.sqrt(2*G*h),u:'m/s',re:'v = √(2gh)',wr:[2*G*h,Math.sqrt(G*h),G*h],note:'A track isn’t free fall, so kinematics doesn’t fit, but energy still works: all the PE becomes KE.'}}],
 ['e5',()=>{const v=eqR(4,14);return{q:'A skateboarder at the bottom of a frictionless ramp is moving at '+v+' m/s. How high up the ramp can they roll?',giv:{v:v+' m/s'},unk:'h',a:v*v/(2*G),u:'m',re:'h = v²/(2g)',wr:[v*v/G,v/(2*G),v*v*2*G]}}],
 ['e6',()=>{const k=eqR(100,800),x=eqPk([.05,.1,.15,.2,.3]);return{q:'A spring (k = '+k+' N/m) is compressed '+x+' m. How much energy does it store?',giv:{k:k+' N/m',x:x+' m'},unk:'PE',a:.5*k*x*x,u:'J',re:'PEₛ = ½kx²',wr:[k*x,k*x*x,.5*k*x]}}],
 ['p1',()=>{const h=eqPk([.8,1,1.2,1.5,2,5,10,20]);return{q:'A ball rolls off a table '+h+' m high. How long does it take to hit the floor?',giv:{'Δy':h+' m'},unk:'t',a:Math.sqrt(2*h/G),u:'s',re:'t = √(2Δy/g)',wr:[2*h/G,Math.sqrt(h/G),h/G],note:'Rolling off level means no starting vertical speed, so the drop is Δy = ½gt².'}}],
 ['p1',()=>{const t=eqPk([.5,1,1.5,2,2.5,3]);return{q:'A stone is thrown horizontally off a cliff and hits the water '+t+' s later. How tall is the cliff?',giv:{t:t+' s'},unk:'Δy',a:.5*G*t*t,u:'m',re:'Δy = ½gt²',wr:[G*t*t,G*t,.5*G*t]}}],
 ['p2',()=>{const vx=eqR(5,25),t=eqPk([1,1.5,2,2.5,3,4]);return{q:'A ball leaves a cliff horizontally at '+vx+' m/s and is in the air for '+t+' s. How far from the base of the cliff does it land?',giv:{'vₓ':vx+' m/s',t:t+' s'},unk:'Δx',a:vx*t,u:'m',re:'Δx = vₓt',wr:[vx*t+.5*G*t*t,.5*vx*t,vx/t],note:'Gravity only pulls down, so the horizontal speed never changes.'}}],
 ['c1',()=>{const r=eqR(20,120),v=eqR(8,30);return{q:'A car drives around a curve of radius '+r+' m at '+v+' m/s. What is its centripetal acceleration?',giv:{r:r+' m',v:v+' m/s'},unk:'a_c',a:v*v/r,u:'m/s²',re:'a_c = v²/r',wr:[v/r,v*v*r,r/(v*v)]}}],
 ['c2',()=>{const m=eqPk([.2,.5,1,2]),r=eqPk([.5,.8,1,1.5]),v=eqR(2,9);return{q:'A '+m+' kg ball on a string swings in a horizontal circle of radius '+r+' m at '+v+' m/s. What centripetal force does the string supply?',giv:{m:m+' kg',r:r+' m',v:v+' m/s'},unk:'F_c',a:m*v*v/r,u:'N',re:'F_c = mv²/r',wr:[v*v/r,m*v/r,m*v*v*r]}}],
 ['c3',()=>{const r=eqR(2,8),T=eqR(4,15);return{q:'A merry-go-round makes one full turn every '+T+' s. A rider sits '+r+' m from the center. How fast is the rider moving?',giv:{r:r+' m',T:T+' s'},unk:'v',a:2*Math.PI*r/T,u:'m/s',re:'v = 2πr/T',wr:[r/T,Math.PI*r/T,2*Math.PI*T/r]}}],
 ['o1',()=>{const R=eqR(5,100),I=eqPk([.1,.2,.25,.5,1,1.5,2]);return{q:'A '+R+' Ω resistor carries a current of '+I+' A. What is the voltage across it?',giv:{R:R+' Ω',I:I+' A'},unk:'V',a:I*R,u:'V',re:'V = IR',wr:[R/I,I/R,I*I*R]}}],
 ['o1',()=>{const V=eqPk([1.5,3,6,9,12,24]),R=eqR(2,60);return{q:'A '+V+' V battery is connected across a '+R+' Ω resistor. What current flows?',giv:{V:V+' V',R:R+' Ω'},unk:'I',a:V/R,u:'A',re:'I = V/R',wr:[V*R,R/V,V*V/R]}}],
 ['o2',()=>{const V=eqPk([12,120,240]),I=eqPk([.5,1,2,5,8,10]);return{q:'A device plugged into a '+V+' V outlet draws '+I+' A. How much power does it use?',giv:{V:V+' V',I:I+' A'},unk:'P',a:I*V,u:'W',re:'P = IV',wr:[V/I,I/V,I*I*V]}}],
 ['m1',()=>{const r=eqR(5,40),th=eqPk([.5,1,1.5,2,2.5,3]);return{q:'A wheel of radius '+r+' cm turns through '+th+' radians. How far does a point on the rim travel?',giv:{r:r+' cm','θ':th+' rad'},unk:'s',a:r*th,u:'cm',re:'s = rθ',wr:[r/th,th/r,Math.PI*r*th]}}],
 ['m1',()=>{const r=eqR(20,90),d=eqPk([30,45,60,90,120]);return{q:'A pendulum '+r+' cm long swings through an angle of '+d+'°. How long is the arc its tip traces?',giv:{r:r+' cm','θ':d+'° (convert to radians)'},unk:'s',a:r*d*Math.PI/180,u:'cm',re:'s = rθ with θ = '+d+'° × π/180',wr:[r*d,r*d/180,r/(d*Math.PI/180)],note:'s = rθ only works with θ in radians, so convert the degrees first.'}}],
 ['m2',()=>{const r=eqPk([.3,.5,.8,1.2,2]),w=eqR(2,12);return{q:'A wheel of radius '+r+' m spins at '+w+' rad/s. How fast is a point on the rim moving?',giv:{r:r+' m','ω':w+' rad/s'},unk:'v',a:r*w,u:'m/s',re:'v = rω',wr:[w/r,r/w,2*Math.PI*r*w]}}],
 ['m3',()=>{const lo=eqR(1,5),hi=lo+2*eqR(10,40);return{q:'On a Ferris wheel, a seat’s lowest point is '+lo+' m above the ground and its highest is '+hi+' m. In h(t) = A sin(Bt) + D, what is the amplitude A?',giv:{max:hi+' m',min:lo+' m'},unk:'A',a:(hi-lo)/2,u:'m',re:'A = (max − min)/2',wr:[hi-lo,(hi+lo)/2,hi/2]}}],
 ['m4',()=>{const lo=eqR(1,5),hi=lo+2*eqR(10,40);return{q:'A Ferris wheel seat ranges from '+lo+' m to '+hi+' m above the ground. In h(t) = A sin(Bt) + D, what is the midline D?',giv:{max:hi+' m',min:lo+' m'},unk:'D',a:(hi+lo)/2,u:'m',re:'D = (max + min)/2',wr:[(hi-lo)/2,hi-lo,hi+lo]}}],
 ['m5',()=>{const T=eqPk([2,4,5,6,8,10,12,20]);return{q:'A Ferris wheel makes one full turn every '+T+' minutes. In h(t) = A sin(Bt) + D (t in minutes), what is B?',giv:{T:T+' min'},unk:'B',a:2*Math.PI/T,u:'rad/min',re:'B = 2π/T',wr:[T/(2*Math.PI),2*Math.PI*T,Math.PI/T]}}],
 ['m6',()=>{const [a,b,c]=eqPk([[3,4,5],[5,12,13],[8,15,17],[7,24,25]]),q=eqPk([2,3,4]);const cosNeg=q===2||q===3;return{q:'sin θ = '+(q===2?'':'−')+a+'/'+c+' and θ is in Quadrant '+['I','II','III','IV'][q-1]+'. What is cos θ?',giv:{'sin θ':(q===2?'':'−')+a+'/'+c,quadrant:['I','II','III','IV'][q-1]},unk:'cos θ',a:(cosNeg?'−':'')+b+'/'+c,u:'',re:'cos θ = ±√(1 − sin²θ), sign from the quadrant',wr:[(cosNeg?'':'−')+b+'/'+c,(cosNeg?'−':'')+a+'/'+b,(cosNeg?'−':'')+c+'/'+b],note:'cos is negative in Quadrants II and III.'}}],
 ['m7',()=>{const [a,b,c]=eqPk([[3,4,5],[5,12,13],[8,15,17]]),q=eqPk([1,2,3,4]),sn=q<=2?'':'−',cs=q===1||q===4?'':'−',tn=sn===cs?'':'−';return{q:'In Quadrant '+['I','II','III','IV'][q-1]+', sin θ = '+sn+a+'/'+c+' and cos θ = '+cs+b+'/'+c+'. What is tan θ?',giv:{'sin θ':sn+a+'/'+c,'cos θ':cs+b+'/'+c,quadrant:['I','II','III','IV'][q-1]},unk:'tan θ',a:tn+a+'/'+b,u:'',re:'tan θ = sin θ / cos θ',wr:[tn+b+'/'+a,(tn?'':'−')+a+'/'+b,tn+a+'/'+c]}}],
 ['g1',()=>{const P=eqR(5,50)*100,r=eqPk([2,3,4,5,6,8]),t=eqR(3,15);return{q:'You invest $'+P+' at '+r+'% interest compounded yearly. How much is it worth after '+t+' years?',giv:{P:'$'+P,r:r+'% = '+r/100,t:t+' yr'},unk:'A',a:P*Math.pow(1+r/100,t),u:'$',re:'A = P(1 + r)ᵗ',wr:[P*(1+r/100*t),P*Math.exp(r/100*t),P*(1+r/100)*t],note:'r goes in as a decimal: '+r+'% = '+r/100+'.'}}],
 ['g2',()=>{const P=eqR(2,40)*100,r=eqPk([1.5,2,3,4,5]),t=eqR(5,20);return{q:'A town of '+P+' people grows continuously at '+r+'% per year. What is its population after '+t+' years?',giv:{P:String(P),r:r+'% = '+r/100,t:t+' yr'},unk:'A',a:P*Math.exp(r/100*t),u:'people',re:'A = Peʳᵗ',wr:[P*Math.pow(1+r/100,t),P*(1+r/100*t),P*Math.exp(r/100)*t],note:'“Continuously” means e.'}}]];
function eqStat(id){const s=db.eqstats||(db.eqstats={});return s[id]||(s[id]={r:0,w:0,mix:{}})}
const eqWeak=id=>{const s=(db.eqstats||{})[id];return !!s&&s.w>0&&s.w>=s.r*.5};
// Practice types that get equation-choice problems (about 2 in 3 of their generated problems).
const EQPR={kinematics:['k1','k2','k3','k4'],newton2:['f1','f2'],weight:['f2'],friction:['f3'],spring:['f4','e6'],work:['e1'],energy:['e2','e3','e5'],energy_cons:['e5'],power:['e4'],projectile:['p1','p2'],circular:['c1','c2','c3'],ohm:['o1','o2'],arc_length:['m1','m2'],sinusoid:['m3','m4','m5'],ferris:['m3','m4','m5'],unit_circle:['m6','m7'],trig_ident:['m6','m7'],exp_eq:['g1','g2']};
// Weak equations come up more often.
function eqPrMake(id){const okE=EQPR[id];if(!okE)return null;const pool=EQT.map((t,i)=>i).filter(i=>okE.includes(EQT[i][0]));if(!pool.length)return null;
 const wt=i=>{const s=(db.eqstats||{})[EQT[i][0]];return Math.max(.5,1+(s?Math.min(6,s.w*2-s.r*.5):1.5))},fac=[.5,2,1.5,.75,3,1/3,10,.1];
 for(let k=0;k<12;k++){let r=Math.random()*pool.reduce((a,i)=>a+wt(i),0),ti=pool[pool.length-1];for(const i of pool){r-=wt(i);if(r<=0){ti=i;break}}
  let p=null;try{p=EQT[ti][1]()}catch(e){}if(!p||(typeof p.a==='number'&&!isFinite(p.a)))continue;
  const eq=EQT[ti][0],g=EQ[eq].g,u=p.u?' '+p.u:'',num=typeof p.a==='number',ans=num?eqN(p.a)+u:String(p.a),alt=p.alt||[];
  const cands=(p.wr||[]).map(w=>typeof w==='number'?(isFinite(w)&&w>0?eqN(w)+u:null):w).filter(Boolean);
  const subj=EQ_G.find(x=>x.id===g).subj,same=shuffle(Object.keys(EQ).filter(x=>x!==eq&&EQ[x].g===g&&!alt.includes(x))),other=shuffle(Object.keys(EQ).filter(x=>EQ[x].g!==g&&EQ_G.find(y=>y.id===EQ[x].g).subj===subj&&!alt.includes(x)));
  const opts=[eq,...same.slice(0,3)];while(opts.length<4&&other.length)opts.push(other.shift());
  const steps=[[('List what you know and what you want. '+(p.note||'')).trim(),Object.entries(p.giv).map(([a,b])=>a+' = '+b).join(';  ')+';  '+p.unk+' = ?'],['Pick the equation. Use '+EQ[eq].f+' when '+EQ[eq].when,EQ[eq].f],['Rearrange for '+p.unk+', then plug in the numbers with their units.',p.re]];
  const out=prMC(p.q,ans,cands,j=>num?eqN(p.a*fac[j%fac.length]*(1+Math.floor(j/fac.length)*.07))+u:'',EQ[eq].f+' → '+p.re+' → '+p.unk+' = '+ans,steps);
  if(out.w.length<3)continue;out.eqp={eq,giv:p.giv,unk:p.unk,note:p.note||'',re:p.re,opts:shuffle(opts)};return out}return null}
// "Help me start" for equation problems: 1) mark what's given and asked, 2) pick the equation, 3) solve with the answers.
function eqGuide(card,q,opts,answers){const E=q.eqp,EQX=k=>(E.eqs&&E.eqs[k])||EQ[k],g=EQ_G.find(x=>EQ[E.eq]&&x.id===EQ[E.eq].g)||{id:'user',sym:[]},syms=E.sym||g.sym,state={engaged:false,complete:false},panel=document.createElement('div');panel.className='guided-panel eq-guide';answers.before(panel);
 let step=0,marks={},hint='',done=false;
 const giv=()=>'<div class="eq-giv">'+Object.entries(E.giv).map(([k,v])=>'<span><b>'+esc(k)+'</b> = '+esc(v)+'</span>').join('')+'<span class="eq-unk"><b>'+esc(E.unk)+'</b> = ?</span></div>';
 const dots=()=>'<div class="eq-steps">'+['What do you know?','Pick the equation','Solve it'].map((x,i)=>'<span class="'+(i<step?'done':i===step?'on':'')+'">'+(i+1)+'. '+x+'</span>').join('')+'</div>';
 const want=()=>{const w={};Object.keys(E.giv).forEach(k=>{if(syms.includes(k))w[k]='gv'});w[E.unk]='uk';return w};
 const finish=()=>{if(done)return;done=true;state.complete=true;state.engaged=true;answers.hidden=false;
  panel.innerHTML=dots()+giv()+'<p class="eq-use">Using <b>'+esc(EQX(E.eq).f)+'</b></p><button type="button" class="btn smallbtn eq-re">💡 Show it rearranged</button><p class="eq-re-out small"></p>'+(opts.onGuided?'<p class="small">Finish the question for +2 Tickets.</p>':'');
  panel.querySelector('.eq-re').onclick=e=>{panel.querySelector('.eq-re-out').innerHTML='<b>'+esc(E.re)+'</b>';e.target.remove()};if(opts.onGuided)opts.onGuided()};
 const draw=fb=>{if(!panel.isConnected||done)return;let b;
  if(fb)b=fb+'<div class="actions"><button type="button" class="btn blue eq-nx">'+(step===0?'NEXT STEP ▶':'SOLVE IT ▶')+'</button></div>';
  else if(step===0)b='<p class="small muted">Tap each quantity: once = <b class="eq-gv">given</b>, twice = <b class="eq-uk">asked for</b>, again = clear. Skip anything the problem doesn’t use. g = 9.8 m/s² is always known.</p><div class="eq-chips">'+syms.map((x,i)=>'<button type="button" class="eq-chip '+(marks[x]||'')+'" data-i="'+i+'">'+esc(x)+'</button>').join('')+'</div><div class="actions"><button type="button" class="btn eq-h">💡 HINT</button><button type="button" class="btn blue eq-chk">CHECK</button></div>';
  else b=giv()+'<p class="small muted">Which equation fits?</p><div class="eq-opts">'+E.opts.map(k=>'<button type="button" class="eq-opt" data-k="'+esc(k)+'"><b>'+esc(EQX(k).f)+'</b><small>'+esc(EQX(k).n)+'</small></button>').join('')+'</div><div class="actions"><button type="button" class="btn eq-h">💡 HINT</button></div>';
  panel.innerHTML=dots()+(hint&&!fb?'<div class="eq-hint">💡 '+hint+'</div>':'')+b;
  panel.querySelectorAll('.eq-chip').forEach(c=>c.onclick=()=>{const x=syms[+c.dataset.i];marks[x]=marks[x]==='gv'?'uk':marks[x]==='uk'?'':'gv';draw()});
  const h=panel.querySelector('.eq-h');if(h)h.onclick=()=>{hint=step===0?'Look for every number with a unit, plus phrases that hide a number (“from rest”, “dropped”, “stops”). Then find what the question asks for.'+(E.note?' '+esc(E.note):''):'You know <b>'+Object.keys(E.giv).map(esc).join(', ')+'</b> and want <b>'+esc(E.unk)+'</b>. Pick the equation that has all of those and nothing else you don’t know.';draw()};
  const ck=panel.querySelector('.eq-chk');if(ck)ck.onclick=()=>{const w=want(),ok=syms.every(x=>(marks[x]||'')===(w[x]||''));draw('<div class="eq-fb '+(ok?'ok':'bad')+'">'+(ok?'✅ <b>Right.</b>':'❌ <b>Not quite. Here’s the full list:</b>')+giv()+(E.note?'<p class="small">'+esc(E.note)+'</p>':'')+'</div>')};
  panel.querySelectorAll('.eq-opt').forEach(o=>o.onclick=()=>{const k=o.dataset.k,ok=k===E.eq||(E.alt||[]).includes(k),st=eqStat(E.eq);if(ok)st.r++;else{st.w++;st.mix[k]=(st.mix[k]||0)+1}save();
   const missing=syms.filter(x=>!(x in E.giv)&&x!==E.unk),n=ok?0:st.mix[k];
   draw('<div class="eq-fb '+(ok?'ok':'bad')+'">'+(ok?'✅ <b>'+esc(EQX(k).f)+'</b> fits. Use it when '+esc(EQX(k).when):'❌ You picked <b>'+esc(EQX(k).f)+'</b>. Use that one when '+esc(EQX(k).when)+'<br>✅ This problem needs <b>'+esc(EQX(E.eq).f)+'</b>. Use it when '+esc(EQX(E.eq).when)+(g.id==='kin'&&missing.length?'<br><small>Here, '+missing.map(esc).join(' and ')+' isn’t given or asked.</small>':'')+(n>1?'<br><small>You’ve mixed these two up '+n+' times.</small>':''))+'</div>')});
  const nx=panel.querySelector('.eq-nx');if(nx)nx.onclick=()=>{hint='';step++;if(step>1)finish();else draw()}};
 panel.innerHTML='<button type="button" class="btn smallbtn guided-start">Help me start</button>';panel.querySelector('button').onclick=()=>{state.engaged=true;answers.hidden=true;draw()};
 return state}
// ---------- Your equations: Gemini reads a study set's photos (or notes), pulls out the equations and writes problem
// templates for them. The app rolls fresh numbers and works out every answer itself, so templates are checked in code.
function eqCalc(src,V){const s=String(src).replace(/\s+/g,'').replace(/[×·]/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/\*\*/g,'^');let i=0;
 const D=Math.PI/180,F={sqrt:Math.sqrt,abs:Math.abs,ln:Math.log,log:Math.log10,exp:Math.exp,sin:Math.sin,cos:Math.cos,tan:Math.tan,asin:Math.asin,acos:Math.acos,atan:Math.atan,sind:x=>Math.sin(x*D),cosd:x=>Math.cos(x*D),tand:x=>Math.tan(x*D),asind:x=>Math.asin(x)/D,acosd:x=>Math.acos(x)/D,atand:x=>Math.atan(x)/D},C={pi:Math.PI,e:Math.E,g:9.8};
 const eat=c=>s[i]===c?(i++,true):false;
 const expr=()=>{let v=term();for(;;){if(eat('+'))v+=term();else if(eat('-'))v-=term();else return v}};
 const term=()=>{let v=unary();for(;;){if(eat('*'))v*=unary();else if(eat('/'))v/=unary();else return v}};
 const unary=()=>eat('-')?-unary():eat('+')?unary():pow();
 const pow=()=>{const b=atom();return eat('^')?Math.pow(b,unary()):b};
 const atom=()=>{if(eat('(')){const v=expr();if(!eat(')'))throw Error('missing )');return v}
  const m=/^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/i.exec(s.slice(i));if(m){i+=m[0].length;return +m[0]}
  const id=/^[A-Za-z_]\w*/.exec(s.slice(i));if(id){i+=id[0].length;const n=id[0];if(F[n]&&s[i]==='('){i++;const a=expr();if(!eat(')'))throw Error('missing )');return F[n](a)}if(V&&Object.prototype.hasOwnProperty.call(V,n))return +V[n];if(n in C)return C[n];throw Error('unknown '+n)}
  throw Error('bad expression')};
 const v=expr();if(i!==s.length)throw Error('bad expression');return v}
const EQU_SCHEMA={type:'OBJECT',properties:{
 formulas:{type:'ARRAY',items:{type:'OBJECT',properties:{name:{type:'STRING'},formula:{type:'STRING'},when:{type:'STRING'},group:{type:'STRING'},symbols:{type:'ARRAY',items:{type:'OBJECT',properties:{sym:{type:'STRING'},meaning:{type:'STRING'}},required:['sym']}}},required:['name','formula','when','group','symbols']}},
 problems:{type:'ARRAY',items:{type:'OBJECT',properties:{formula:{type:'INTEGER'},also:{type:'ARRAY',items:{type:'INTEGER'}},text:{type:'STRING'},
  vars:{type:'ARRAY',items:{type:'OBJECT',properties:{key:{type:'STRING'},sym:{type:'STRING'},unit:{type:'STRING'},min:{type:'NUMBER'},max:{type:'NUMBER'},decimals:{type:'INTEGER'},example:{type:'NUMBER'}},required:['key','sym','min','max','example']}},
  hidden:{type:'ARRAY',items:{type:'OBJECT',properties:{sym:{type:'STRING'},value:{type:'STRING'},phrase:{type:'STRING'}},required:['sym','value']}},
  unknownSym:{type:'STRING'},unknownUnit:{type:'STRING'},solve:{type:'STRING'},mistakes:{type:'ARRAY',items:{type:'STRING'}},rearranged:{type:'STRING'},steps:{type:'ARRAY',items:{type:'STRING'}},exampleAnswer:{type:'NUMBER'}},
  required:['formula','text','vars','unknownSym','solve','rearranged','exampleAnswer']}}},required:['formulas','problems']};
const EQU_PROMPT='These are a college student’s homework sheets, worksheets or class notes (math or physics). The student struggles to know WHICH equation to use and how to apply it.\n'
 +'1) formulas: list every equation the student needs for this material (at most 14). name; formula in plain text; when = the situation it is used for (finishes the sentence "Use it when …", lower case); group = a short topic label shared by related formulas (e.g. Kinematics); symbols = each variable symbol exactly as written in the formula.\n'
 +'2) problems: word-problem TEMPLATES for those formulas, 3 to 5 per formula (at most 40). Make them like the homework but not copies. Vary the real-world setting AND which quantity is unknown, so the student cannot just pattern-match. Include some problems whose wording hides a value (from rest, dropped, comes to a stop) and some that need a different formula from the same group than the obvious one.\n'
 +'- formula: index into formulas of the equation to use; also: indexes of other formulas that would solve it equally directly (usually empty).\n'
 +'- text: the problem, with {key} placeholders where numbers go (write the unit after the placeholder). Every var must appear in the text.\n'
 +'- vars: key (short ASCII name like v0, a, t, theta), sym (its symbol in the formula), unit, min, max, decimals (0 to 2), example (one sensible value).\n'
 +'- hidden: values the wording implies without a number: sym, value with unit (e.g. "0 m/s"), phrase (e.g. "from rest").\n'
 +'- unknownSym, unknownUnit. solve: an expression for the answer using only the var keys, numbers, + - * / ^ ( ), sqrt, abs, ln, log, exp, sin cos tan (radians), sind cosd tand asind acosd atand (degrees), pi. Always write * for multiplication. Use 9.8 for g.\n'
 +'- mistakes: 3 expressions (same rules) for answers students commonly get by mistake (wrong formula, forgot to square, wrong rearrangement).\n'
 +'- rearranged: the formula solved for the unknown, plain text. steps: 2 or 3 short hints that walk through the solving; you may use {key} placeholders. exampleAnswer: the answer when every var equals its example.\n'
 +'- Only problems with a single numeric answer. Skip graphs, proofs and conceptual questions. Pick ranges that give sensible answers (no negative times, no square roots of negatives).\n'
 +'- Write all math as plain text with Unicode symbols (½, ², √, θ, π, Δ, subscripts like v₀). Never use LaTeX, backslashes or $ signs.';
function eqUserRoll(q){const v={};q.vars.forEach(x=>{const m=10**x.d;v[x.k]=Math.round((x.lo+Math.random()*(x.hi-x.lo))*m)/m});let a;try{a=eqCalc(q.solve,v)}catch(e){return null}return isFinite(a)?{v,a}:null}
function eqUserCheck(p,F){const fi=p.formula;if(!Number.isInteger(fi)||!F[fi])return null;
 const vars=(p.vars||[]).map(v=>({k:String(v.key||''),sym:String(v.sym||v.key||'').trim(),u:String(v.unit||'').trim(),lo:+v.min,hi:+v.max,d:Math.max(0,Math.min(3,v.decimals|0)),ex:+v.example}));
 if(!vars.length||vars.some(v=>!/^[A-Za-z]\w{0,11}$/.test(v.k)||!isFinite(v.lo)||!isFinite(v.hi)||!isFinite(v.ex)))return null;vars.forEach(v=>{if(v.lo>v.hi)[v.lo,v.hi]=[v.hi,v.lo]});
 const text=String(p.text||''),keys=vars.map(v=>v.k),ph=[...text.matchAll(/\{(\w+)\}/g)].map(m=>m[1]);if(!keys.every(k=>ph.includes(k))||ph.some(k=>!keys.includes(k)))return null;
 const ex={};vars.forEach(v=>ex[v.k]=v.ex);let a;try{a=eqCalc(p.solve,ex)}catch(e){return null}const want=+p.exampleAnswer;if(!isFinite(a)||!isFinite(want)||Math.abs(a-want)>Math.max(1e-6,Math.abs(want)*.02))return null;
 const q={fi,also:[...new Set((p.also||[]).filter(i=>Number.isInteger(i)&&F[i]&&i!==fi))],text,vars,hid:(p.hidden||[]).map(h=>({sym:String(h.sym||'').trim(),v:String(h.value||''),ph:String(h.phrase||'')})).filter(h=>h.sym&&h.v).slice(0,4),
  us:String(p.unknownSym||'?').trim(),uu:String(p.unknownUnit||'').trim(),solve:String(p.solve),mis:(p.mistakes||[]).map(String).slice(0,4),re:String(p.rearranged||F[fi].f),steps:(p.steps||[]).map(String).filter(Boolean).slice(0,3)};
 let good=0;for(let k=0;k<10;k++)if(eqUserRoll(q))good++;return good>=7?q:null}
function eqUserClean(j){const F=((j&&j.formulas)||[]).slice(0,14).map(f=>({name:String(f.name||'').slice(0,60),f:String(f.formula||'').trim().slice(0,90),when:String(f.when||'').replace(/^use it when\s*/i,'').trim().slice(0,200),group:String(f.group||'').slice(0,40),sym:[...new Set((f.symbols||[]).map(x=>String((x&&x.sym)||'').trim()).filter(Boolean))].slice(0,8)}));
 const P=[];((j&&j.problems)||[]).forEach(p=>{try{const q=eqUserCheck(p,F);if(q)P.push(q)}catch(e){}});return {formulas:F,problems:P.slice(0,40)}}
async function eqUserBuild(sid,o={}){const s=(db.summaries||[]).find(x=>x.id===sid);if(!s||s.eqBusy)return;if(!gmKey()){if(!o.auto)toast('Finding equations needs a Gemini key (Settings)');return}
 const photoIds=s.bound?ppPics().filter(p=>p.folder===s.bound).map(p=>p.id).slice(0,12):[],text=String(s.body||'').slice(0,30000);
 if(!photoIds.length&&!text.trim()){if(!o.auto)toast('Add photos or notes to this set first');return}
 s.eqBusy=1;delete s.eqErr;eqUserRedraw(sid);
 try{const parts=[{text:EQU_PROMPT+(photoIds.length?'':'\n\nNOTES:\n'+text)}];for(const id of photoIds){const pp=await gmPhotoPart(id);if(pp)parts.push(pp)}
  const r=await gmGenerate(parts,EQU_SCHEMA),b=eqUserClean(r.json),t=(db.summaries||[]).find(x=>x.id===sid);if(!t)return;
  if(!b.problems.length)throw new Error(b.formulas.length?'Gemini’s practice problems didn’t check out. Try again':'No equations found in this set');
  t.eqbank=Object.assign(b,{at:stamp(),by:r.model});toast('📐 '+b.formulas.length+' equations, '+b.problems.length+' practice problems ready for “'+t.title+'”')}
 catch(e){const t=(db.summaries||[]).find(x=>x.id===sid);if(t)t.eqErr=String(e&&e.message||e).slice(0,120);if(!o.auto)toast('📐 '+String(e&&e.message||e).slice(0,90))}
 finally{const t=(db.summaries||[]).find(x=>x.id===sid);if(t)delete t.eqBusy;save();eqUserRedraw(sid)}}
function eqUserMake(sid){const s=(db.summaries||[]).find(x=>x.id===sid),B=s&&s.eqbank;if(!B||!(B.problems||[]).length)return null;const P=B.problems,F=B.formulas,key=i=>'u:'+sid+':'+i,fac=[.5,2,1.5,.75,3,1/3,10,.1];
 const wt=p=>{const st=(db.eqstats||{})[key(p.fi)];return Math.max(.5,1+(st?Math.min(6,st.w*2-st.r*.5):1.5))};
 for(let n=0;n<12;n++){let r=Math.random()*P.reduce((a,p)=>a+wt(p),0),q=P[P.length-1];for(const p of P){r-=wt(p);if(r<=0){q=p;break}}
  const R=eqUserRoll(q);if(!R)continue;const vs={};q.vars.forEach(x=>vs[x.k]=String(+R.v[x.k].toFixed(x.d)));
  const u=q.uu?' '+q.uu:'',ans=eqN(R.a)+u,fill=t=>String(t).replace(/\{(\w+)\}/g,(m,k)=>k==='answer'?ans:(k in vs?vs[k]:m));
  const giv={};q.vars.forEach(x=>giv[x.sym]=vs[x.k]+(x.u?' '+x.u:''));q.hid.forEach(h=>{if(!(h.sym in giv))giv[h.sym]=h.v+(h.ph?' ('+h.ph+')':'')});
  const cands=q.mis.map(m=>{try{const w=eqCalc(m,R.v);return isFinite(w)?eqN(w)+u:null}catch(e){return null}}).filter(Boolean);
  const f=F[q.fi],idx=F.map((x,i)=>i).filter(i=>i!==q.fi&&!q.also.includes(i)),same=shuffle(idx.filter(i=>F[i].group===f.group)),other=shuffle(idx.filter(i=>F[i].group!==f.group));
  const opts=[q.fi,...same.slice(0,3)];while(opts.length<4&&other.length)opts.push(other.shift());
  const eqs={};opts.concat(q.also).forEach(i=>eqs[key(i)]={f:F[i].f,n:F[i].name,when:F[i].when});
  const need=[...Object.keys(giv),q.us],pool=[...new Set(F.filter(x=>x.group===f.group).flatMap(x=>x.sym))],extra=pool.filter(x=>!need.includes(x)).slice(0,Math.max(0,8-need.length));
  const sym=pool.filter(x=>need.includes(x)||extra.includes(x)).concat(need.filter(x=>!pool.includes(x)));
  const note=q.hid.filter(h=>h.ph).map(h=>'“'+h.ph+'” means '+h.sym+' = '+h.v+'.').join(' ');
  const steps=[[('List what you know and what you want. '+note).trim(),Object.entries(giv).map(([a,b])=>a+' = '+b).join(';  ')+';  '+q.us+' = ?'],['Pick the equation. Use '+f.f+' when '+f.when,f.f],['Rearrange for '+q.us+', then plug in the numbers with their units.',q.re],...q.steps.map(t=>[fill(t),''])];
  const out=prMC(fill(q.text),ans,cands,j=>eqN(R.a*fac[j%8]*(1+Math.floor(j/8)*.07))+u,f.f+' → '+q.re+' → '+q.us+' = '+ans,steps);if(out.w.length<3)continue;
  out.eqp={eq:key(q.fi),alt:q.also.map(key),giv,unk:q.us,note,re:q.re,opts:shuffle(opts.map(key)),eqs,sym};return out}return null}
function eqUserSrc(s){return s.bound&&ppPics().some(p=>p.folder===s.bound)?'photos':'notes'}
function eqUserHTML(s){const B=s.eqbank,has=!!(B&&(B.problems||[]).length),src=eqUserSrc(s);
 return '<details class="pr-pick" id="eqUserBox"'+(has||s.eqBusy||s.eqErr?' open':'')+'><summary>📐 Your equations'+(has?' · '+B.formulas.length:'')+'</summary>'
 +(s.eqBusy?'<p class="small">🌐 Gemini is reading your '+src+'…</p>':has?'<p class="small muted">Practice problems come from these with fresh numbers every time, mixed together, with a different unknown and setting each time. “Help me start” walks you through choosing the equation.</p>'+B.formulas.map((f,i)=>{const n=B.problems.filter(p=>p.fi===i).length,st=(db.eqstats||{})['u:'+s.id+':'+i];return '<div class="eq-card"><b class="eq-f">'+esc(f.f)+'</b><small>'+esc(f.name)+' · '+n+' problem type'+(n===1?'':'s')+(st?' · '+st.r+' right, '+st.w+' wrong':'')+'</small><p>Use it when '+esc(f.when)+'</p></div>'}).join(''):'<p class="small muted">Gemini reads this set’s '+src+', pulls out the equations you need, and writes practice problems for them. This also runs on its own after Gemini builds a study guide from photos.</p>')
 +(s.eqErr?'<p class="small" style="color:#b33">⚠ '+esc(s.eqErr)+'</p>':'')
 +(s.eqBusy?'':typeof gmKey==='function'&&gmKey()?'<button type="button" class="btn smallbtn" onclick="eqUserBuild(\''+s.id+'\')">'+(has?'↻ REDO FROM MY '+src.toUpperCase():'📐 FIND MY EQUATIONS')+'</button>'+(has?' <button type="button" class="btn smallbtn" onclick="eqUserTry(\''+s.id+'\')">TRY ONE</button><div id="eqUserSample"></div>':''):'<p class="small muted">Needs a Gemini key (Settings).</p>')+'</details>'}
function eqUserRedraw(sid){const el=$('eqUserBox'),s=(db.summaries||[]).find(x=>x.id===sid);if(el&&s)el.outerHTML=eqUserHTML(s)}
function eqUserTry(sid){const p=eqUserMake(sid),el=$('eqUserSample');if(!el)return;el.innerHTML=p?'<div class="eq-card"><p>'+mathHTML(p.q)+'</p><details><summary class="small">Show the answer</summary><p class="small">'+mathHTML(p.ex)+'</p></details></div>':'<p class="small muted">Couldn’t make one right now.</p>'}
// ===================== END EQUATION LAB =====================
