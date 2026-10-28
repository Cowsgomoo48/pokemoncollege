// ===================== PRACTICE PROBLEMS =====================
// Problems made in code: the numbers are random every time and the answer is worked out by the app, so the answer key is always right.
// Each type has keywords so it can be matched to what a study set covers (AI-listed problem types, formulas, or the notes themselves).
const PR={};
function prDef(id,subject,name,kw,make){PR[id]={id,subject,name,kw,make}}
const prR=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const prNZ=(a,b)=>{let v=0;while(!v)v=prR(a,b);return v};
const prPick=a=>a[Math.floor(Math.random()*a.length)];
const prGcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){const t=a%b;a=b;b=t}return a||1};
function prFrac(n,d){if(!d)return 'undefined';if(d<0){n=-n;d=-d}const g=prGcd(n,d);n/=g;d/=g;return d===1?String(n):n+'/'+d}
function prNum(x,dp=2){if(!isFinite(x))return 'undefined';const v=+(+x).toFixed(dp);return String(Object.is(v,-0)?0:v)}
function prSig(x,n=3){if(!isFinite(x)||x===0)return String(x);const a=Math.abs(x);if(a>=1e-3&&a<1e5)return String(+x.toPrecision(n));const e=Math.floor(Math.log10(a)),m=+(x/10**e).toPrecision(n);return m+' × 10'+prSup(e)}
const PR_SUP={'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','-':'⁻'},PR_SUB={'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉'};
const prSup=n=>String(n).split('').map(c=>PR_SUP[c]||c).join('');
const prSub=s=>String(s).replace(/\d/g,c=>PR_SUB[c]);
function prMono(c,p,v='x'){if(p===0)return String(c);const k=c===1?'':c===-1?'-':String(c);return k+v+(p===1?'':prSup(p))}
function prPoly(t,v='x'){let s='';for(const [c,p] of t){if(!c)continue;const m=prMono(Math.abs(c),p,v);s+=s?(c<0?' - ':' + ')+m:(c<0?'-':'')+m}return s||'0'}
const prLin=(a,b,v='x')=>prPoly([[a,1],[b,0]],v);
const prPt=(x,y)=>'('+x+', '+y+')';
const prOk=s=>s!==''&&s!=null&&!/NaN|undefined|Infinity/.test(String(s));
// one multiple-choice problem: the answer, likely mistakes first, then nearby values until there are three wrong answers.
// steps = [[hint, worked line], ...]: the hints walk you through it one step at a time (without giving the answer away);
// the worked lines are the full solution shown after answering.
function prMC(q,a,cands,perturb,ex,steps){a=String(a);const w=[],seen=new Set([a]);
 const add=c=>{const s=String(c);if(prOk(s)&&!seen.has(s)&&w.length<3){seen.add(s);w.push(s)}};
 (cands||[]).forEach(add);for(let k=0;w.length<3&&k<80;k++)add(perturb(k));return {q,a,w,ex,steps:steps||[]}}
const prSimp=(f,ans)=>f===ans?f+' (already in simplest form)':f+' = '+ans,prCos=d=>prNum(Math.cos(prDeg(d)),3),prSin=d=>prNum(Math.sin(prDeg(d)),3);
const prNear=(v,k,f=x=>String(x))=>f(v+(k%2?1:-1)*(1+Math.floor(k/2)));
// ---------------- Arithmetic ----------------
prDef('frac_add','Arithmetic','Adding & subtracting fractions',/(add|subtract|sum|common denominator)[^.\n]{0,40}fraction|fraction[^.\n]{0,40}(add|subtract|sum|differen)/i,()=>{
 const b=prR(2,9),d=prPick([2,3,4,5,6,8,9,10,12].filter(x=>x!==b)),a=prR(1,b-1),c=prR(1,d-1),op=prPick(['+','-']),s=op==='+'?1:-1,n=a*d+s*c*b,den=b*d,ans=prFrac(n,den);
 return prMC(a+'/'+b+' '+op+' '+c+'/'+d+' = ? (simplest form)',ans,[prFrac(a+s*c,b+d),prFrac(a*d-s*c*b,den),prFrac(a+s*c,b*d)],k=>prFrac(n+(k%2?1:-1)*(1+(k>>1)),den),'Common denominator '+den+': '+(a*d)+'/'+den+' '+op+' '+(c*b)+'/'+den+' = '+n+'/'+den+' = '+ans,[
 ['You can only '+(s>0?'add':'subtract')+' fractions with the same bottom number. Find a common denominator for '+b+' and '+d+' (multiplying them always works).','Common denominator: '+b+' × '+d+' = '+den],
 ['Rewrite both fractions over '+den+': multiply the top and bottom of '+a+'/'+b+' by '+d+', and of '+c+'/'+d+' by '+b+'.',a+'/'+b+' = '+(a*d)+'/'+den+' and '+c+'/'+d+' = '+(c*b)+'/'+den],
 [(s>0?'Add':'Subtract')+' the tops and keep the bottom. Then simplify by dividing top and bottom by any common factor.',(a*d)+' '+op+' '+(c*b)+' = '+n+', so '+prSimp(n+'/'+den,ans)]])});
prDef('frac_mul','Arithmetic','Multiplying & dividing fractions',/(multipl|divid|product|quotient|reciprocal)[^.\n]{0,40}fraction|fraction[^.\n]{0,40}(multipl|divi)/i,()=>{
 const a=prR(1,9),b=prR(2,9),c=prR(1,9),d=prR(2,9),div=Math.random()<.5,ans=div?prFrac(a*d,b*c):prFrac(a*c,b*d);
 return prMC(a+'/'+b+(div?' ÷ ':' × ')+c+'/'+d+' = ? (simplest form)',ans,[div?prFrac(a*c,b*d):prFrac(a*d,b*c),div?prFrac(b*c,a*d):prFrac(a+c,b+d),prFrac(a+c,b+d),prFrac(a*c,b+d)],k=>prFrac((div?a*d:a*c)+(k%2?1:-1)*(1+(k>>1)),div?b*c:b*d),div?'Flip the second fraction and multiply: '+a+'/'+b+' × '+d+'/'+c+' = '+ans:'Multiply straight across: '+(a*c)+'/'+(b*d)+' = '+ans,(div?[['Dividing by a fraction = multiplying by its reciprocal. Flip the second fraction ('+c+'/'+d+' becomes '+d+'/'+c+') and change ÷ to ×.',a+'/'+b+' ÷ '+c+'/'+d+' = '+a+'/'+b+' × '+d+'/'+c]]:[]).concat([
 ['Multiply straight across: top × top, bottom × bottom.',div?(a+' × '+d)+' = '+(a*d)+' and '+(b+' × '+c)+' = '+(b*c):(a+' × '+c)+' = '+(a*c)+' and '+(b+' × '+d)+' = '+(b*d)],
 ['Simplify: divide the top and bottom by their greatest common factor.',prSimp(div?(a*d)+'/'+(b*c):(a*c)+'/'+(b*d),ans)]]))});
prDef('pct_of','Arithmetic','Percent of a number',/percent of|% of|finding (a |the )?percent|percentages?/i,()=>{
 const p=prPick([5,10,12,15,20,25,30,35,40,45,60,75,80,120,150]),n=prR(2,40)*10,ans=prNum(n*p/100);
 return prMC('What is '+p+'% of '+n+'?',ans,[prNum(n*p/10),prNum(n*(100-p)/100),prNum(n+p),prNum(n/p)],k=>prNum(n*p/100+(k%2?1:-1)*(1+(k>>1))*(p%10?.5:1)),p+'% of '+n+' = '+(p/100)+' × '+n+' = '+ans,[
 ['Turn the percent into a decimal by dividing by 100 (move the decimal point two places left).',p+'% = '+(p/100)],
 ['“Of” means multiply. Multiply that decimal by '+n+'.',(p/100)+' × '+n+' = '+ans]])});
prDef('pct_change','Arithmetic','Percent increase & decrease',/percent(age)? (increase|decrease|change)|% (increase|decrease|change)/i,()=>{
 const p=prPick([10,20,25,30,40,50,60,75]),o=prR(2,20)*20,up=Math.random()<.5,nw=o*(up?100+p:100-p)/100,diff=Math.abs(nw-o),ans=p+'% '+(up?'increase':'decrease');
 return prMC('A value goes from '+o+' to '+nw+'. What is the percent change?',ans,[p+'% '+(up?'decrease':'increase'),prNum(diff/nw*100,1)+'% '+(up?'increase':'decrease'),diff+'% '+(up?'increase':'decrease')],k=>(p+(k+1)*5)+'% '+(up?'increase':'decrease'),'Change ÷ original = '+diff+' ÷ '+o+' = '+(p/100)+' → '+ans,[
 ['Percent change = (new − original) ÷ original × 100.','(new − original) ÷ original × 100'],
 ['Find the change first: '+nw+' − '+o+'. A positive change is an increase, a negative one is a decrease.','Change = '+(nw-o)],
 ['Divide by the ORIGINAL value ('+o+'), not the new one, then multiply by 100.',(nw-o)+' ÷ '+o+' = '+prNum((nw-o)/o,2)+' → '+ans]])});
prDef('order_ops','Arithmetic','Order of operations',/order of operations|pemdas|gemdas|bedmas|bodmas/i,()=>{
 const t=prR(0,3),a=prR(2,12),b=prR(2,9),c=prR(2,9);let q,ans,c1;
 if(t===0){q=a+' + '+b+' × '+c;ans=a+b*c;c1=[(a+b)*c,a+b+c,a*b+c]}
 else if(t===1){const d=prR(1,9);q='('+a+' + '+b+') × '+c+' - '+d;ans=(a+b)*c-d;c1=[a+b*c-d,(a+b)*(c-d),a+b*c]}
 else if(t===2){const d=prPick([2,3,4,5]),cc=d*prR(1,6);q=a+' × '+b+' - '+cc+' ÷ '+d;ans=a*b-cc/d;c1=[(a*b-cc)/d,a*b-cc,a*(b-cc/d)]}
 else{q=a+' - '+b+' + '+c;ans=a-b+c;c1=[a-(b+c),a+b+c,a-b-c]}
 return prMC(q+' = ?',ans,c1.filter(Number.isInteger),k=>prNear(ans,k),'Multiply and divide before adding and subtracting, left to right: '+q+' = '+ans,[['Order of operations (PEMDAS): Parentheses, Exponents, then × and ÷ left to right, then + and − left to right.','PEMDAS']].concat(
 t===0?[['There are no parentheses, so do the multiplication first: '+b+' × '+c+'.',b+' × '+c+' = '+(b*c)],['Now add.',a+' + '+(b*c)+' = '+ans]]:
 t===1?[['Parentheses first: '+a+' + '+b+'.','('+a+' + '+b+') = '+(a+b)],['Next multiply by '+c+', and subtract last.',(a+b)+' × '+c+' = '+((a+b)*c)+', then '+((a+b)*c)+' − '+q.split(' - ')[1]+' = '+ans]]:
 t===2?[['Do the × and ÷ before the subtraction.',q.split(' - ')[0]+' = '+(a*b)+' and '+q.split(' - ')[1]+' = '+(ans<a*b?a*b-ans:0)],['Now subtract.',(a*b)+' − '+(a*b-ans)+' = '+ans]]:
 [['Only + and −, so go left to right: start with '+a+' − '+b+'.',a+' − '+b+' = '+(a-b)],['Then add '+c+'.',(a-b)+' + '+c+' = '+ans]]))});
prDef('proportion','Arithmetic','Solving proportions',/proportion|cross[- ]multipl|ratios?\b/i,()=>{
 const a=prR(1,9),b=prR(2,9),k=prR(2,6),x=a*k,d=b*k;
 return prMC('Solve for x: '+a+'/'+b+' = x/'+d,'x = '+x,['x = '+prFrac(b*d,a),'x = '+(a+d-b),'x = '+prFrac(d,a),'x = '+(d-b+a+1)],j=>'x = '+(x+(j%2?1:-1)*(1+(j>>1))),'Cross-multiply: '+b+'x = '+a+' × '+d+' = '+(a*d)+', so x = '+x,[
 ['Cross-multiply: the top of each fraction times the bottom of the other.',b+' · x = '+a+' · '+d],
 ['Multiply out the side with numbers.',b+'x = '+(a*d)],
 ['Divide both sides by '+b+' to get x by itself.','x = '+(a*d)+' ÷ '+b+' = '+x]])});
prDef('sci_note','Arithmetic','Scientific notation',/scientific notation|standard form/i,()=>{
 const m=prR(11,99)/10,e=prPick([-6,-5,-4,-3,-2,-1,1,2,3,4,5,6,7]),v=m*10**e,txt=e>0?Math.round(v).toLocaleString('en-US'):v.toFixed(-e+1).replace(/0+$/,''),ans=m+' × 10'+prSup(e);
 return prMC('Write '+txt+' in scientific notation.',ans,[m+' × 10'+prSup(-e),m+' × 10'+prSup(e+1),m+' × 10'+prSup(e-1),(m*10)+' × 10'+prSup(e-1)],k=>m+' × 10'+prSup(e+(k%2?2:-2)*(1+(k>>1))),'Move the decimal so one digit is before it: '+ans,[
 ['Scientific notation looks like a × 10ⁿ, where a is at least 1 and less than 10.','a × 10ⁿ, 1 ≤ a < 10'],
 ['Move the decimal point until exactly one nonzero digit is in front of it.','a = '+m],
 ['Count how many places you moved it. A big number (moved left) gets a positive power; a small number (moved right) gets a negative power.','Moved '+Math.abs(e)+' place'+(Math.abs(e)>1?'s':'')+' '+(e>0?'left':'right')+' → 10'+prSup(e)+', so '+ans]])});
// ---------------- Algebra ----------------
prDef('lin_one','Algebra','One-step equations',/one[- ]step equation/i,()=>{
 const x=prR(-12,12),a=prR(2,9),t=prR(0,3);let q,c1,ex;
 if(t===0){const b=x+a;q='x + '+a+' = '+b;c1=[b+a,a-b,b];ex='Subtract '+a+' from both sides.'}
 else if(t===1){const b=x-a;q='x - '+a+' = '+b;c1=[b-a,a-b,b];ex='Add '+a+' to both sides.'}
 else if(t===2){const b=a*x;q=a+'x = '+b;c1=[b-a,b+a,b*a];ex='Divide both sides by '+a+'.'}
 else{const b=x;q='x/'+a+' = '+b;c1=[prFrac(b,a),b-a,b+a];ex='Multiply both sides by '+a+'.';return prMC('Solve: '+q,'x = '+(a*b),c1.map(v=>'x = '+v),k=>'x = '+(a*b+(k%2?1:-1)*(1+(k>>1))),ex+' x = '+(a*b),[['x is being divided by '+a+'. Undo division with multiplication: multiply both sides by '+a+'.','x = '+b+' × '+a],['Multiply.','x = '+(a*b)]])}
 const st=t===0?[['Get x by itself: undo the “+ '+a+'” by subtracting '+a+' from both sides.','x = '+(x+a)+' − '+a],['Subtract.','x = '+x]]:t===1?[['Undo the “− '+a+'” by adding '+a+' to both sides.','x = '+(x-a)+' + '+a],['Add.','x = '+x]]:[['x is being multiplied by '+a+'. Undo it by dividing both sides by '+a+'.','x = '+(a*x)+' ÷ '+a],['Divide.','x = '+x]];
 return prMC('Solve: '+q,'x = '+x,c1.map(v=>'x = '+v),k=>'x = '+(x+(k%2?1:-1)*(1+(k>>1))),ex+' x = '+x,st)});
prDef('lin_two','Algebra','Two-step equations',/two[- ]step equation|linear equations?|solv(e|ing) (for x|equations)/i,()=>{
 const x=prR(-9,9),a=prNZ(-9,9)||2,b=prNZ(-15,15),c=a*x+b;
 return prMC('Solve: '+prLin(a,b)+' = '+c,'x = '+x,['x = '+prFrac(c+b,a),'x = '+prFrac(c,a)+'','x = '+prFrac(c-b,-a),'x = '+((c-b)*a)],k=>'x = '+(x+(k%2?1:-1)*(1+(k>>1))),(b<0?'Add '+(-b):'Subtract '+b)+' on both sides: '+a+'x = '+(c-b)+'. Divide by '+a+': x = '+x,[
 ['Undo things in reverse order: get rid of the constant first by '+(b<0?'adding '+(-b):'subtracting '+b)+' on both sides.',prMono(a,1)+' = '+c+(b<0?' + '+(-b):' − '+b)+' = '+(c-b)],
 ['Now x is multiplied by '+a+'. Divide both sides by '+a+'.','x = '+(c-b)+' ÷ '+(a<0?'('+a+')':a)+' = '+x]])});
prDef('lin_multi','Algebra','Multi-step equations (distributing, variables on both sides)',/distribut|multi[- ]step|variables? on both sides/i,()=>{
 let a,c,b,x,d;do{a=prR(2,7);c=prNZ(-6,6);b=prNZ(-8,8);x=prR(-8,8)}while(a===c);d=a*(x+b)-c*x;
 return prMC('Solve: '+a+'(x '+(b<0?'- '+(-b):'+ '+b)+') = '+prLin(c,d),'x = '+x,['x = '+prFrac(d-b,a-c),'x = '+prFrac(d-a*b,a+c),'x = '+prFrac(d+a*b,a-c)],k=>'x = '+(x+(k%2?1:-1)*(1+(k>>1))),'Distribute: '+prLin(a,a*b)+' = '+prLin(c,d)+'. Collect x: '+(a-c)+'x = '+(d-a*b)+', so x = '+x,[
 ['Start by distributing: multiply '+a+' by each term inside the parentheses.',prLin(a,a*b)+' = '+prLin(c,d)],
 ['Get all the x terms on one side and the plain numbers on the other: move '+prMono(c,1)+' to the left and '+(a*b)+' to the right (change their signs when they cross).',prMono(a,1)+' − ('+prMono(c,1)+') = '+d+' − ('+(a*b)+')  →  '+prMono(a-c,1)+' = '+(d-a*b)],
 ['Divide both sides by the number in front of x ('+(a-c)+').','x = '+(d-a*b)+' ÷ '+(a-c)+' = '+x]])});
prDef('lin_ineq','Algebra','Linear inequalities',/inequalit/i,()=>{
 const syms=['<','>','≤','≥'],flip={'<':'>','>':'<','≤':'≥','≥':'≤'},s=prPick(syms),a=prNZ(-7,7),b=prNZ(-12,12),x=prR(-8,8),c=a*x+b,fs=a<0?flip[s]:s,ans='x '+fs+' '+x;
 return prMC('Solve: '+prLin(a,b)+' '+s+' '+c,ans,['x '+(a<0?s:flip[s])+' '+x,'x '+fs+' '+(-x),'x '+fs+' '+prFrac(c+b,a)],k=>'x '+fs+' '+(x+(k%2?1:-1)*(1+(k>>1))),'Solve like an equation: x = '+x+'.'+(a<0?' Dividing by a negative ('+a+') flips the sign.':'')+' Answer: '+ans,[
 ['Solve it like an equation. First '+(b<0?'add '+(-b):'subtract '+b)+' on both sides.',prMono(a,1)+' '+s+' '+(c-b)],
 ['Divide both sides by '+a+'.'+(a<0?' Careful: dividing (or multiplying) by a NEGATIVE number flips the inequality sign!':' It’s positive, so the sign stays the same.'),'x '+fs+' '+(c-b)+' ÷ '+(a<0?'('+a+')':a)+'  →  '+ans]])});
prDef('slope','Algebra','Slope from two points',/slope (of (a|the) line|between|from|formula)|rise over run|find(ing)? (the )?slope|slope[- ]intercept|two points/i,()=>{
 let x1,x2,y1,y2;do{x1=prR(-8,8);x2=prR(-8,8);y1=prR(-8,8);y2=prR(-8,8)}while(x1===x2||y1===y2);const dy=y2-y1,dx=x2-x1,ans=prFrac(dy,dx);
 return prMC('Find the slope of the line through '+prPt(x1,y1)+' and '+prPt(x2,y2)+'.',ans,[prFrac(dx,dy),prFrac(-dy,dx),prFrac(y2+y1,x2+x1)],k=>prFrac(dy+(k%2?1:-1)*(1+(k>>1)),dx),'m = (y₂ - y₁)/(x₂ - x₁) = '+dy+'/'+dx+' = '+ans,[
 ['Slope is rise over run: m = (y₂ − y₁)/(x₂ − x₁).','m = (y₂ − y₁)/(x₂ − x₁)'],
 ['Rise: subtract the y-values ('+y2+' minus '+y1+'). Watch the negatives.','Rise = '+y2+' − ('+y1+') = '+dy],
 ['Run: subtract the x-values in the SAME order, then divide rise by run and simplify.','Run = '+x2+' − ('+x1+') = '+dx+', so m = '+dy+'/'+dx+' = '+ans]])});
prDef('line_eq','Algebra','Equation of a line (y = mx + b)',/slope[- ]intercept|y ?= ?mx|point[- ]slope|equation of (a|the) line/i,()=>{
 const m=prNZ(-5,5),b=prNZ(-9,9);let x1=prR(-4,4),x2;do x2=prR(-4,4);while(x2===x1);const y1=m*x1+b,y2=m*x2+b,ans='y = '+prLin(m,b);
 return prMC('Write the equation of the line through '+prPt(x1,y1)+' and '+prPt(x2,y2)+'.',ans,['y = '+prLin(m,-b),'y = '+prLin(-m,b),'y = '+prLin(b,m),'y = '+prLin(m,y1)],k=>'y = '+prLin(m,b+(k%2?1:-1)*(1+(k>>1))),'Slope m = '+m+'. Plug in '+prPt(x1,y1)+': '+y1+' = '+m+'('+x1+') + b, so b = '+b+'. '+ans,[
 ['Find the slope first: m = (y₂ − y₁)/(x₂ − x₁).','m = ('+y2+' − ('+y1+'))/('+x2+' − ('+x1+')) = '+(y2-y1)+'/'+(x2-x1)+' = '+m],
 ['Put the slope and one of the points into y = mx + b.',y1+' = '+m+'('+x1+') + b'],
 ['Solve for b, then write the line as y = mx + b.',y1+' = '+(m*x1)+' + b, so b = '+b+'  →  '+ans]])});
prDef('sys2','Algebra','Systems of equations (two variables)',/systems? of (linear )?equations|elimination method|substitution method|solv(e|ing) (the )?system/i,()=>{
 let a1,b1,a2,b2;do{a1=prNZ(-5,5);b1=prNZ(-5,5);a2=prNZ(-5,5);b2=prNZ(-5,5)}while(a1*b2-a2*b1===0);const x=prR(-6,6),y=prR(-6,6),c1=a1*x+b1*y,c2=a2*x+b2*y,ans=prPt(x,y);
 const eq=(a,b,c)=>prPoly([[a,1]])+(b<0?' - ':' + ')+prMono(Math.abs(b),1,'y')+' = '+c;
 return prMC('Solve the system: '+eq(a1,b1,c1)+'  and  '+eq(a2,b2,c2),ans,[prPt(y,x),prPt(-x,y),prPt(x,-y),prPt(x+1,y-1)],k=>prPt(x+(k%2?1:-1)*(1+(k>>1)),y),'Eliminate one variable, solve for the other, then substitute back: x = '+x+', y = '+y+'.',[
 ['Use elimination: make the x terms match so they cancel. Multiply the first equation by '+a2+' and the second by '+a1+'.',eq(a1*a2,b1*a2,c1*a2)+'  and  '+eq(a1*a2,b2*a1,c2*a1)],
 ['Subtract one equation from the other: the x terms cancel, leaving only y. Solve for y.',(b1*a2-b2*a1)+'y = '+(c1*a2-c2*a1)+', so y = '+y],
 ['Put that y back into the first equation and solve for x. Check both equations.',a1+'x + '+b1+'('+y+') = '+c1+'  →  '+a1+'x = '+(c1-b1*y)+', so x = '+x+'  →  '+ans]])});
prDef('quad_factor','Algebra','Factoring quadratics',/factor(ing|ise|ize)?[^.\n]{0,30}(quadratic|trinomial|polynomial|x²|x\^2)|(quadratic|trinomial)s?[^.\n]{0,30}factor/i,()=>{
 let p,q;do{p=prNZ(-9,9);q=prNZ(-9,9)}while(p===-q);const f=(u,v)=>'(x '+(u<0?'- '+(-u):'+ '+u)+')(x '+(v<0?'- '+(-v):'+ '+v)+')',ans=f(p,q);
 return prMC('Factor: '+prPoly([[1,2],[p+q,1],[p*q,0]]),ans,[f(-p,-q),f(-p,q),f(p,-q),f(p*q,1)],k=>f(p+(k%2?1:-1)*(1+(k>>1)),q),'Find two numbers that multiply to '+(p*q)+' and add to '+(p+q)+': '+p+' and '+q+'. '+ans,[
 ['For x² + bx + c, look for two numbers that MULTIPLY to c ('+(p*q)+') and ADD to b ('+(p+q)+').','× = '+(p*q)+', + = '+(p+q)],
 ['List the factor pairs of '+(p*q)+(p*q<0?' (one positive, one negative, since the product is negative)':'')+' and find the pair that adds to '+(p+q)+'.',p+' × '+q+' = '+(p*q)+' and '+p+' + '+q+' = '+(p+q)],
 ['Write it as (x + first number)(x + second number).',ans]])});
prDef('quad_solve','Algebra','Solving quadratic equations',/quadratic (formula|equation)|discriminant|roots? of|zeros of|solv(e|ing) quadratic/i,()=>{
 const a=prPick([1,1,2,3]),r1=prR(-7,7),r2=prR(-7,7),B=-a*(r1+r2),C=a*r1*r2,eqn=prPoly([[a,2],[B,1],[C,0]])+' = 0';
 if(Math.random()<.3){const D=B*B-4*a*C;return prMC('What is the discriminant of '+eqn+'?',String(D),[String(B*B+4*a*C),String(B-4*a*C),String(-B*B-4*a*C),String(B*B-4*C)],k=>prNear(D,k),'b² - 4ac = ('+B+')² - 4('+a+')('+C+') = '+D,[
 ['The discriminant is b² − 4ac. Read a, b and c from ax² + bx + c = 0.','a = '+a+', b = '+B+', c = '+C],
 ['Square b, then subtract 4 × a × c.','('+B+')² − 4('+a+')('+C+') = '+(B*B)+' − '+(4*a*C)+' = '+D]])}
 const ro=(u,v)=>u===v?'x = '+u:'x = '+Math.min(u,v)+' or x = '+Math.max(u,v),ans=ro(r1,r2);
 return prMC('Solve: '+eqn,ans,[ro(-r1,-r2),ro(r1,-r2),ro(-r1,r2),ro(r1*a,r2*a),ro(r1+1,r2)],k=>ro(r1+(k%2?1:-1)*(1+(k>>1)),r2),'It factors as '+(a>1?a:'')+'(x '+(r1<0?'+ '+(-r1):'- '+r1)+')(x '+(r2<0?'+ '+(-r2):'- '+r2)+') = 0, so '+ans,[
 ['Try factoring.'+(a>1?' First divide every term by '+a+'.':'')+' (The quadratic formula x = (−b ± √(b² − 4ac)) / 2a also works.)',a>1?prPoly([[1,2],[B/a,1],[C/a,0]])+' = 0':eqn],
 ['Find two numbers that multiply to '+(r1*r2)+' and add to '+(-(r1+r2))+'.',(-r1)+' × '+(-r2)+' = '+(r1*r2)+' and '+(-r1)+' + '+(-r2)+' = '+(-(r1+r2))],
 ['Write the factors and set each one equal to 0.','(x '+(r1<0?'+ '+(-r1):'- '+r1)+')(x '+(r2<0?'+ '+(-r2):'- '+r2)+') = 0  →  '+ans]])});
prDef('exp_rules','Algebra','Exponent rules',/exponents? (rule|law|propert)|laws of (exponents|indices)|simplif[^.\n]{0,30}exponent|product of powers|power of a power|quotient of powers/i,()=>{
 const t=prR(0,2),a=prR(2,8),b=prR(2,6),c1=prR(1,6),c2=prR(1,6);let q,ans,cs,ex;
 if(t===0){q='('+prMono(c1,a)+')('+prMono(c2,b)+')';ans=prMono(c1*c2,a+b);cs=[prMono(c1*c2,a*b),prMono(c1+c2,a+b),prMono(c1*c2,Math.abs(a-b)||1)];ex='Multiply the numbers, add the exponents: '+ans;var st=[['Multiply the numbers in front (coefficients) normally.',c1+' × '+c2+' = '+(c1*c2)],['Same base multiplied → ADD the exponents.','x'+prSup(a)+' · x'+prSup(b)+' = x'+prSup(a+b)+'  →  '+ans]]}
 else if(t===1){q='('+prMono(c1,a)+')'+prSup(b);ans=prMono(c1**b,a*b);cs=[prMono(c1**b,a+b),prMono(c1*b,a*b),prMono(c1,a*b)];ex='Raise the number to the power and multiply the exponents: '+ans;var st=[['Everything inside the parentheses gets the outside power. Start with the number: '+c1+prSup(b)+'.',c1+prSup(b)+' = '+(c1**b)],['Power of a power → MULTIPLY the exponents.','(x'+prSup(a)+')'+prSup(b)+' = x'+prSup(a*b)+'  →  '+ans]]}
 else{const k=prR(1,4),n=c1*k;q=prMono(n,a+b)+' ÷ '+prMono(k,b);ans=prMono(c1,a);cs=[prMono(c1,a+2*b),prMono(c1,(a+b)/b===Math.floor((a+b)/b)?(a+b)/b:a+1),prMono(n-k,a)];ex='Divide the numbers, subtract the exponents: '+ans;var st=[['Divide the numbers in front.',n+' ÷ '+k+' = '+c1],['Same base divided → SUBTRACT the exponents (top minus bottom).',(a+b)+' − '+b+' = '+a+'  →  '+ans]]}
 return prMC('Simplify: '+q,ans,cs,k=>prMono(c1,(t===2?a:t===1?a*b:a+b)+(k%2?1:-1)*(1+(k>>1))),ex,st)});
prDef('func_eval','Algebra','Evaluating functions',/evaluat(e|ing) (a |the )?functions?|function notation|f\(\s*-?\d+\s*\)/i,()=>{
 const a=prNZ(-4,4),b=prR(-6,6),c=prR(-9,9),x=prNZ(-4,4),f=a*x*x+b*x+c;
 return prMC('If f(x) = '+prPoly([[a,2],[b,1],[c,0]])+', find f('+x+').',String(f),[String(a*2*x+b*x+c),String(-a*x*x+b*x+c),String(a*x*x+b+c),String(a*x*x-b*x+c)],k=>prNear(f,k),'Replace x with '+x+': '+a+'('+x+')² + '+b+'('+x+') + '+c+' = '+f,[
 ['Replace every x with ('+x+'). Keep the parentheses so negative signs don’t get lost.','f('+x+') = '+a+'('+x+')² + '+b+'('+x+') + '+c],
 ['Do the exponent first: ('+x+')² = '+(x*x)+'. Then multiply.',a+' × '+(x*x)+' = '+(a*x*x)+' and '+b+' × '+x+' = '+(b*x)],
 ['Add everything up.',(a*x*x)+' + '+(b*x)+' + '+c+' = '+f]])});
prDef('logs','Algebra','Evaluating logarithms',/logarithm|\blog\s*[_₂₃₅(]|\blog\b|\bln\b/i,()=>{
 const b=prPick([2,3,4,5,10]),n=prR(-2,4),val=n>=0?String(b**n):'1/'+(b**-n),base=b===10?'log':'log'+prSub(b),ans=String(n);
 return prMC('Evaluate: '+base+'('+val+')',ans,[String(n+1),String(-n),n>=0?String(b**n/b):String(n-1),String(b*n)],k=>prNear(n,k),b+' raised to '+n+' is '+val+', so the log is '+n+'.',[
 ['A log asks “what power do I raise the base to?”. Rewrite '+base+'('+val+') = ? as '+b+'^? = '+val+'.',b+'^? = '+val],
 [n<0?'A fraction 1/'+(b**-n)+' means a negative exponent: 1/'+b+'ⁿ = '+b+'⁻ⁿ. Write '+(b**-n)+' as a power of '+b+' first.':n===0?'Any number to the power 0 is 1.':'Write '+val+' as a power of '+b+' (multiply '+b+' by itself until you reach '+val+').',b+prSup(n)+' = '+val],
 ['That exponent is the answer.',base+'('+val+') = '+n]])});
prDef('exp_eq','Algebra','Exponential equations (use logs)',/exponential equations?|solv\w*[^.\n]{0,30}exponent|logs? (of )?both sides|e\^|eˣ|exponential (growth|decay)/i,()=>{
 const t=prR(0,2);
 if(t===0){const b=prPick([2,3,4,5]),m=prR(2,b===2?6:4),k=prR(1,m-1),N=b**m,ans='x = '+(m-k);
  return prMC('Solve: '+b+'^{x + '+k+'} = '+N,ans,['x = '+m,'x = '+(m+k),'x = '+prFrac(N,b)],j=>'x = '+(m-k+(j%2?1:-1)*(1+(j>>1))),N+' = '+b+prSup(m)+', so x + '+k+' = '+m+' and '+ans,[
   ['Write both sides with the same base: '+N+' is a power of '+b+'.',N+' = '+b+prSup(m)],
   ['Same base on both sides → the exponents must be equal.','x + '+k+' = '+m],
   ['Solve for x.',ans]])}
 if(t===1){const c=prPick([2,3,4,5]),k=prPick([2,3,4,5]),N=c*prPick([5,7,10,12,20,50]),x=Math.log(N/c)/k,ans='x ≈ '+prNum(x,3);
  return prMC('Solve: '+c+'e^{'+k+'x} = '+N,ans,['x ≈ '+prNum(Math.log(N)/k,3),'x ≈ '+prNum(Math.log(N/c)*k,3),'x ≈ '+prNum(N/c/k,3)],j=>'x ≈ '+prNum(x+(j%2?.1:-.1)*(1+(j>>1)),3),'Divide by '+c+': e^{'+k+'x} = '+prNum(N/c,3)+'. Take ln: '+k+'x = ln '+prNum(N/c,3)+', so '+ans,[
   ['Get the exponential part by itself first: divide both sides by '+c+'.','e^{'+k+'x} = '+N+' ÷ '+c+' = '+prNum(N/c,3)],
   ['The x is stuck in the exponent. Take the natural log (ln) of both sides: ln undoes e, so the exponent comes down.',k+'x = ln('+prNum(N/c,3)+') ≈ '+prNum(Math.log(N/c),4)],
   ['Divide by '+k+'.','x ≈ '+prNum(Math.log(N/c),4)+' ÷ '+k+' ≈ '+prNum(x,3)]])}
 const b=prPick([2,3,5,7]),N=prPick([10,20,30,50,100,200].filter(v=>Math.log(v)/Math.log(b)%1>.05)),x=Math.log(N)/Math.log(b),ans='x ≈ '+prNum(x,3);
 return prMC('Solve: '+b+'ˣ = '+N,ans,['x ≈ '+prNum(N/b,3),'x ≈ '+prNum(Math.log10(N),3),'x ≈ '+prNum(Math.log(b)/Math.log(N),3)],j=>'x ≈ '+prNum(x+(j%2?.15:-.15)*(1+(j>>1)),3),'Take log of both sides: x log '+b+' = log '+N+', so x = log '+N+' ÷ log '+b+' ≈ '+prNum(x,3),[
  ['The variable is in the exponent, so use a log to undo it: take the log of both sides.','log('+b+'ˣ) = log('+N+')'],
  ['A log lets you bring the exponent down in front: log('+b+'ˣ) = x · log '+b+'. Then divide by log '+b+'.','x = log '+N+' ÷ log '+b],
  ['Use the calculator (log button) for each and divide.',prNum(Math.log10(N),4)+' ÷ '+prNum(Math.log10(b),4)+' ≈ '+prNum(x,3)]])});
prDef('dist_mid','Geometry','Distance & midpoint',/distance formula|midpoint|distance between (two )?points/i,()=>{
 const x1=prR(-6,6),y1=prR(-6,6);if(Math.random()<.5){const [p,q,h]=prPick([[3,4,5],[5,12,13],[6,8,10],[8,15,17],[9,12,15]]),sw=Math.random()<.5,dx=(sw?q:p)*(Math.random()<.5?-1:1),dy=(sw?p:q)*(Math.random()<.5?-1:1);
  return prMC('Find the distance between '+prPt(x1,y1)+' and '+prPt(x1+dx,y1+dy)+'.',String(h),[String(p+q),String(Math.abs(dx+dy)||h+2),String(h*h)],k=>prNear(h,k),'d = √(('+dx+')² + ('+dy+')²) = √'+(h*h)+' = '+h,[
 ['Distance formula: d = √((x₂ − x₁)² + (y₂ − y₁)²). It’s the Pythagorean theorem on a graph.','d = √(Δx² + Δy²)'],
 ['Find how far apart the x’s are and the y’s are, then square both.','Δx = '+dx+', Δy = '+dy+'  →  '+(dx*dx)+' and '+(dy*dy)],
 ['Add the squares and take the square root.','√('+(dx*dx)+' + '+(dy*dy)+') = √'+(h*h)+' = '+h]])}
 const x2=prR(-6,6),y2=prR(-6,6),M=(u,v)=>'('+prFrac(u,2)+', '+prFrac(v,2)+')',ans=M(x1+x2,y1+y2);
 return prMC('Find the midpoint of '+prPt(x1,y1)+' and '+prPt(x2,y2)+'.',ans,[M(x2-x1,y2-y1),'('+(x1+x2)+', '+(y1+y2)+')',M(x1+y1,x2+y2)],k=>M(x1+x2+(k%2?2:-2)*(1+(k>>1)),y1+y2),'Average the x’s and the y’s: '+ans,[
 ['The midpoint is the average of the x’s and the average of the y’s.','M = ((x₁ + x₂)/2, (y₁ + y₂)/2)'],
 ['Add the two x’s and divide by 2. Do the same with the y’s.','('+x1+' + '+x2+')/2 = '+prFrac(x1+x2,2)+',  ('+y1+' + '+y2+')/2 = '+prFrac(y1+y2,2)],
 ['Write it as a point (x, y).',ans]])});
prDef('pythag','Geometry','Pythagorean theorem',/pythag|hypotenuse|right triangles?/i,()=>{
 const [p,q,h]=prPick([[3,4,5],[5,12,13],[8,15,17],[7,24,25],[20,21,29]]),k=prR(1,3),a=p*k,b=q*k,c=h*k;
 if(Math.random()<.5)return prMC('A right triangle has legs '+a+' and '+b+'. How long is the hypotenuse?',String(c),[String(a+b),String(c*c),String(Math.abs(b-a))],j=>prNear(c,j),'c = √('+a+'² + '+b+'²) = √'+(c*c)+' = '+c,[
 ['Use a² + b² = c², where c is the hypotenuse (the side across from the right angle).',a+'² + '+b+'² = c²'],
 ['Square both legs and add.',(a*a)+' + '+(b*b)+' = '+(c*c)],
 ['Take the square root.','c = √'+(c*c)+' = '+c]]);
 return prMC('A right triangle has hypotenuse '+c+' and one leg '+a+'. How long is the other leg?',String(b),[String(c-a),prNum(Math.sqrt(c*c+a*a),2),String(c+a)],j=>prNear(b,j),'b = √('+c+'² - '+a+'²) = √'+(b*b)+' = '+b,[
 ['Use a² + b² = c². This time you know the hypotenuse c, so solve for the missing leg: b² = c² − a².','b² = '+c+'² − '+a+'²'],
 ['Square both and subtract.',(c*c)+' − '+(a*a)+' = '+(b*b)],
 ['Take the square root.','b = √'+(b*b)+' = '+b]])});
prDef('area','Geometry','Area & perimeter',/area of (a |the )?(circle|triangle|rectangle|square|trapezoid|shape)|perimeter|circumference/i,()=>{
 const t=prR(0,4),w=prR(2,15),h=prR(2,15),r=prR(2,12);
 if(t===0)return prMC('A rectangle is '+w+' by '+h+'. What is its area?',String(w*h),[String(2*(w+h)),String(w+h),String(w*h/2)],k=>prNear(w*h,k),'Area = length × width = '+(w*h),[['Area of a rectangle = length × width.',w+' × '+h+' = '+(w*h)]]);
 if(t===1)return prMC('A rectangle is '+w+' by '+h+'. What is its perimeter?',String(2*(w+h)),[String(w*h),String(w+h),String(4*w)],k=>prNear(2*(w+h),k),'Perimeter = 2(l + w) = '+(2*(w+h)),[['Perimeter is the distance all the way around: add all four sides, which is 2(length + width).','2('+w+' + '+h+') = 2 × '+(w+h)+' = '+(2*(w+h))]]);
 if(t===2){const b=2*prR(1,8);return prMC('A triangle has base '+b+' and height '+h+'. What is its area?',String(b*h/2),[String(b*h),String(b+h),String(2*b*h)],k=>prNear(b*h/2,k),'Area = ½ × base × height = '+(b*h/2),[['A triangle is half of a rectangle: Area = ½ × base × height.','½ × '+b+' × '+h+' = '+(b*h/2)]])}
 if(t===3)return prMC('A circle has radius '+r+'. What is its area?',(r*r)+'π',[(2*r)+'π',(2*r*r)+'π',(r)+'π'],k=>(r*r+(k%2?1:-1)*(1+(k>>1)))+'π','A = πr² = π('+r+')² = '+(r*r)+'π',[['Area of a circle = πr². Square the radius and keep π in the answer.','π × '+r+'² = '+(r*r)+'π']]);
 return prMC('A circle has radius '+r+'. What is its circumference?',(2*r)+'π',[(r*r)+'π',r+'π',(4*r)+'π'],k=>(2*r+(k%2?1:-1)*(1+(k>>1)))+'π','C = 2πr = '+(2*r)+'π',[['Circumference (distance around) = 2πr. Keep π in the answer.','2 × π × '+r+' = '+(2*r)+'π']])});
// ---------------- Calculus ----------------
prDef('deriv_poly','Calculus','Derivatives (power rule)',/derivative|differentiat|power rule|d\/dx|f['′]\s*\(x\)/i,()=>{
 const n=prR(3,6),m=prR(2,n-1),a=prNZ(-6,6),b=prNZ(-6,6),c=prR(-9,9),d=prNZ(-9,9),f=prPoly([[a,n],[b,m],[c,1],[d,0]]),ans=prPoly([[n*a,n-1],[m*b,m-1],[c,0]]);
 return prMC('f(x) = '+f+'. Find f′(x).',ans,[prPoly([[n*a,n],[m*b,m],[c,0]]),prPoly([[a,n-1],[b,m-1],[c,0]]),prPoly([[n*a,n-1],[m*b,m-1],[c,0],[d,0]].reduce((t,[k,p])=>{const e=t.find(z=>z[1]===p);if(e)e[0]+=k;else t.push([k,p]);return t},[])),prPoly([[n*a,n-1],[m*b,m-1],[c,1]])],k=>prPoly([[n*a,n-1],[m*b+(k%2?1:-1)*(1+(k>>1)),m-1],[c,0]]),'Bring each exponent down and lower it by one; constants disappear: '+ans,[
 ['Use the power rule on each term separately: d/dx(axⁿ) = a·n·xⁿ⁻¹. Bring the exponent down, multiply, then subtract 1 from the exponent.','d/dx(axⁿ) = a·n·xⁿ⁻¹'],
 ['Start with the first term, '+prMono(a,n)+': multiply '+a+' by '+n+' and lower the power to '+(n-1)+'. Do the same for the rest.',[[a,n],[b,m],[c,1]].filter(z=>z[0]).map(([k,e])=>prMono(k,e)+' → '+prMono(k*e,e-1)).join(',  ')],
 ['A plain number has derivative 0, so the '+d+' disappears. Put the terms together.','f′(x) = '+ans]])});
prDef('deriv_chain','Calculus','Chain rule',/chain rule|composite functions?/i,()=>{
 const a=prR(2,6),b=prNZ(-7,7),n=prR(2,5),inner='('+prLin(a,b)+')',P=e=>e===1?'':prSup(e),K=k=>k===1?'':String(k),ans=K(n*a)+inner+P(n-1);
 return prMC('f(x) = '+inner+prSup(n)+'. Find f′(x).',ans,[K(n)+inner+P(n-1),K(n*a)+inner+P(n),K(a)+inner+P(n-1),K(n*a)+'x'+P(n-1)],k=>K(n*a+(k%2?1:-1)*(1+(k>>1)))+inner+P(n-1),'Outside: '+n+inner+P(n-1)+'. Times the inside’s derivative, '+a+': '+ans,[
 ['Chain rule: (derivative of the outside) × (derivative of the inside). The outside is ( )'+prSup(n)+' and the inside is '+prLin(a,b)+'.','f′(x) = '+n+'·(inside)'+prSup(n-1)+' · (inside)′'],
 ['Outside first: bring down the '+n+' and lower the power by 1. Leave the inside alone.',n+inner+P(n-1)],
 ['Now multiply by the derivative of the inside: d/dx('+prLin(a,b)+') = '+a+'.',n+' × '+a+' = '+(n*a)+'  →  '+ans]])});
prDef('deriv_point','Calculus','Derivative at a point / tangent slope',/tangent line|instantaneous rate|derivative at|slope of the (curve|tangent)/i,()=>{
 const a=prNZ(-4,4),b=prR(-6,6),c=prR(-9,9),x=prNZ(-3,3),v=2*a*x+b;
 return prMC('f(x) = '+prPoly([[a,2],[b,1],[c,0]])+'. Find f′('+x+').',String(v),[String(a*x*x+b*x+c),String(a*x+b),String(2*a+b)],k=>prNear(v,k),'f′(x) = '+prPoly([[2*a,1],[b,0]])+', so f′('+x+') = '+v,[
 ['First find the derivative with the power rule.','f′(x) = '+prPoly([[2*a,1],[b,0]])],
 ['Plug x = '+x+' into the DERIVATIVE (not into f itself). That number is the slope of the tangent line.','f′('+x+') = '+(2*a)+'('+x+') + '+b+' = '+v]])});
prDef('integ_def','Calculus','Definite integrals',/integral|integrat|antiderivative|area under (the )?curve/i,()=>{
 const p=prR(-3,4)||1,q=prR(-6,6),r=prR(-5,5),a=prR(-2,2),b=a+prR(1,3),F6=x=>2*p*x**3+3*q*x*x+6*r*x,f=x=>p*x*x+q*x+r,ans=prFrac(F6(b)-F6(a),6);
 return prMC('Evaluate ∫ from '+a+' to '+b+' of ('+prPoly([[p,2],[q,1],[r,0]])+') dx',ans,[String(f(b)-f(a)),prFrac(F6(a)-F6(b),6),prFrac(F6(b),6),prFrac(3*(F6(b)-F6(a)),6)],k=>prFrac(F6(b)-F6(a)+6*(k%2?1:-1)*(1+(k>>1)),6),'Antiderivative F(x) = ('+prFrac(p,3)+')x³ + ('+prFrac(q,2)+')x² + ('+r+')x. Then F('+b+') - F('+a+') = '+ans,[
 ['Find the antiderivative: raise each power by 1 and divide by the new power (the reverse of the power rule).','F(x) = ('+prFrac(p,3)+')x³ + ('+prFrac(q,2)+')x² + ('+r+')x'],
 ['Plug in the top limit ('+b+') and the bottom limit ('+a+').','F('+b+') = '+prFrac(F6(b),6)+',  F('+a+') = '+prFrac(F6(a),6)],
 ['Subtract: F(top) − F(bottom).',prFrac(F6(b),6)+' − ('+prFrac(F6(a),6)+') = '+ans]])});
prDef('limits','Calculus','Limits (removable discontinuities)',/\blim\b|\blimits? (of|as|at)\b|evaluat\w* (the )?limits?|x ?(→|->) ?-?\d|removable discontinuit/i,()=>{
 const r=prNZ(-6,6);let s;do s=prNZ(-6,6);while(s===r);const num=prPoly([[1,2],[-(r+s),1],[r*s,0]]),den=prLin(1,-r),ans=String(r-s);
 return prMC('Find the limit as x → '+r+' of ('+num+') / ('+den+')',ans,['0','Does not exist',String(r+s),String(s-r)],k=>prNear(r-s,k),'Factor: (x '+(r<0?'+ '+(-r):'- '+r)+')(x '+(s<0?'+ '+(-s):'- '+s)+') / (x '+(r<0?'+ '+(-r):'- '+r)+') = '+prLin(1,-s)+'. Plug in '+r+': '+ans,[
 ['Try plugging in x = '+r+' first. You get 0/0, which means the expression can be simplified.','At x = '+r+': top = 0 and bottom = 0, so you get 0/0'],
 ['Factor the top: find two numbers that multiply to '+(r*s)+' and add to '+(-(r+s))+'.',num+' = (x '+(r<0?'+ '+(-r):'- '+r)+')(x '+(s<0?'+ '+(-s):'- '+s)+')'],
 ['Cancel the factor that matches the bottom, then plug in x = '+r+'.',prLin(1,-s)+' at x = '+r+'  →  '+r+' − ('+s+') = '+ans]])});
// ---------------- Statistics ----------------
prDef('center','Statistics','Mean, median, mode & range',/\bmean\b|\bmedian\b|\bmodes? (of|is|=)|(mean|median)[^.\n]{0,20}\bmode\b|\baverage\b|measures? of (center|central tendency|spread)|\brange\b of (the|a) data/i,()=>{
 const n=prPick([5,6,7]),d=Array.from({length:n-1},()=>prR(1,20));d.push(d[prR(0,n-2)]);const s=[...d].sort((x,y)=>x-y),cnt={};s.forEach(v=>cnt[v]=(cnt[v]||0)+1);
 const top=Math.max(...Object.values(cnt)),modes=Object.keys(cnt).filter(k=>cnt[k]===top).map(Number);
 const mean=prNum(s.reduce((x,y)=>x+y,0)/n),med=n%2?String(s[(n-1)/2]):prNum((s[n/2-1]+s[n/2])/2),rng=String(s[n-1]-s[0]),mode=modes.length===1?String(modes[0]):null;
 const opts=[['mean',mean],['median',med],['range',rng]].concat(mode?[['mode',mode]]:[]),[nm,ans]=prPick(opts),others=opts.filter(o=>o[1]!==ans).map(o=>o[1]);
 return prMC('Find the '+nm+' of: '+d.join(', '),ans,others.concat([String(s[Math.floor(n/2)]+1)]),k=>prNear(+ans,k,v=>prNum(v)),'Sorted: '+s.join(', ')+'. Mean '+mean+', median '+med+(mode?', mode '+mode:'')+', range '+rng+'.',[
 ['Put the numbers in order from smallest to largest first.','Sorted: '+s.join(', ')],
 nm==='mean'?['Mean = add them all up, then divide by how many there are ('+n+').','Sum = '+s.reduce((x,y)=>x+y,0)+', and '+s.reduce((x,y)=>x+y,0)+' ÷ '+n+' = '+mean]:
 nm==='median'?['Median = the middle number.'+(n%2?' With '+n+' numbers, it’s number '+((n+1)/2)+' in the sorted list.':' With an even count ('+n+'), average the two middle numbers.'),'Median = '+med]:
 nm==='mode'?['Mode = the number that appears most often.','Mode = '+mode]:
 ['Range = largest minus smallest.',s[n-1]+' − '+s[0]+' = '+rng]])});
prDef('prob','Statistics','Basic probability',/probabilit|chance of|likelihood/i,()=>{
 const r=prR(2,8),b=prR(2,8),g=prR(1,6),t=r+b+g;
 if(Math.random()<.5)return prMC('A bag has '+r+' red, '+b+' blue and '+g+' green marbles. What is the probability of drawing a red one?',prFrac(r,t),[prFrac(r,t-r),prFrac(b+g,t),prFrac(1,t),prFrac(r,b+g+1)],k=>prFrac(r+(k%2?1:-1)*(1+(k>>1)),t),'Red ÷ total = '+r+'/'+t+' = '+prFrac(r,t),[
 ['Probability = (number of ways to get what you want) ÷ (total number of possibilities).','P = favorable ÷ total'],
 ['Count: '+r+' red marbles, and '+r+' + '+b+' + '+g+' marbles in total.',r+'/'+t],
 ['Simplify the fraction if you can.',prSimp(r+'/'+t,prFrac(r,t))]]);
 return prMC('A bag has '+r+' red, '+b+' blue and '+g+' green marbles. Two are drawn without putting the first back. What is the probability both are red?',prFrac(r*(r-1),t*(t-1)),[prFrac(r*r,t*t),prFrac(2*r,t),prFrac(r*(r-1),t*t),prFrac(r-1,t-1)],k=>prFrac(r*(r-1)+(k%2?1:-1)*(1+(k>>1)),t*(t-1)),r+'/'+t+' × '+(r-1)+'/'+(t-1)+' = '+prFrac(r*(r-1),t*(t-1)),[
 ['“Both” means this AND that: multiply the probability of the first draw by the probability of the second.','P(red, then red) = P(1st red) × P(2nd red)'],
 ['First draw: '+r+' red out of '+t+'. After taking a red out, there is one fewer red AND one fewer marble overall.',r+'/'+t+' × '+(r-1)+'/'+(t-1)],
 ['Multiply the tops and the bottoms, then simplify.',prSimp((r*(r-1))+'/'+(t*(t-1)),prFrac(r*(r-1),t*(t-1)))]])});
prDef('zscore','Statistics','Z-scores',/z[- ]scores?|standard scores?|standardi[sz]/i,()=>{
 const mu=prR(10,90),sd=prR(2,15),z=prR(-5,5)/2,x=mu+z*sd,ans=prNum(z);
 return prMC('Mean = '+mu+', standard deviation = '+sd+'. What is the z-score of '+x+'?',ans,[prNum(-z),prNum((x-mu)*sd),prNum(sd/(x-mu||1)),prNum(z+1)],k=>prNum(z+(k%2?.5:-.5)*(1+(k>>1))),'z = (x - μ)/σ = ('+x+' - '+mu+')/'+sd+' = '+ans,[
 ['A z-score counts how many standard deviations a value is from the mean: z = (x − μ)/σ.','z = (x − μ)/σ'],
 ['Subtract the mean from the value.',x+' − '+mu+' = '+(x-mu)],
 ['Divide by the standard deviation ('+sd+').',(x-mu)+' ÷ '+sd+' = '+ans]])});
// ---------------- Chemistry ----------------
const PR_AT={H:1.008,C:12.011,N:14.007,O:15.999,Na:22.99,Mg:24.305,Al:26.982,P:30.974,S:32.06,Cl:35.45,K:39.098,Ca:40.078,Fe:55.845};
const PR_ATZ={H:1,C:6,N:7,O:8,Na:11,Mg:12,Al:13,P:15,S:16,Cl:17,K:19,Ca:20,Fe:26};
const PR_CMP=[['H2O',{H:2,O:1}],['CO2',{C:1,O:2}],['NaCl',{Na:1,Cl:1}],['C6H12O6',{C:6,H:12,O:6}],['NH3',{N:1,H:3}],['CH4',{C:1,H:4}],['H2SO4',{H:2,S:1,O:4}],['CaCO3',{Ca:1,C:1,O:3}],['NaOH',{Na:1,O:1,H:1}],['KCl',{K:1,Cl:1}],['MgO',{Mg:1,O:1}],['HCl',{H:1,Cl:1}],['O2',{O:2}],['Fe2O3',{Fe:2,O:3}],['Al2O3',{Al:2,O:3}],['NaHCO3',{Na:1,H:1,C:1,O:3}],['KNO3',{K:1,N:1,O:3}],['MgCl2',{Mg:1,Cl:2}],['C2H6O',{C:2,H:6,O:1}],['H3PO4',{H:3,P:1,O:4}]];
const prMM=c=>Object.entries(c).reduce((s,[e,n])=>s+PR_AT[e]*n,0);
prDef('molar_mass','Chemistry','Molar mass',/molar mass|molecular (weight|mass)|formula (mass|weight)|g\/mol/i,()=>{
 const [f,c]=prPick(PR_CMP),M=prMM(c),ans=prNum(M)+' g/mol';
 return prMC('What is the molar mass of '+prSub(f)+'?',ans,[prNum(Object.keys(c).reduce((s,e)=>s+PR_AT[e],0))+' g/mol',prNum(Object.entries(c).reduce((s,[e,n])=>s+PR_ATZ[e]*n,0))+' g/mol',prNum(M+15.999)+' g/mol',prNum(M*2)+' g/mol'],k=>prNum(M+(k%2?1:-1)*(1+(k>>1))*1.008)+' g/mol','Add up each atom’s mass × how many there are: '+Object.entries(c).map(([e,n])=>n+'×'+PR_AT[e]).join(' + ')+' = '+ans,[
 ['Molar mass = add up (atomic mass × number of atoms) for every element in the formula. The little numbers tell you how many atoms.','M = Σ (count × atomic mass)'],
 ['Count the atoms in '+prSub(f)+'.',Object.entries(c).map(([e,n])=>e+': '+n).join(',  ')],
 ['Multiply each count by its atomic mass from the periodic table, then add.',Object.entries(c).map(([e,n])=>n+' × '+PR_AT[e]).join(' + ')+' = '+ans]])});
prDef('grams_moles','Chemistry','Grams ↔ moles',/\bmoles?\b|\bmol\b|grams? to moles|moles? to grams|stoichiometr|avogadro/i,()=>{
 const [f,c]=prPick(PR_CMP),M=prMM(c);
 if(Math.random()<.5){const g=prR(5,200),n=g/M;return prMC('How many moles are in '+g+' g of '+prSub(f)+'? (molar mass '+prNum(M)+' g/mol)',prSig(n)+' mol',[prSig(g*M)+' mol',prSig(M/g)+' mol',prSig(n*10)+' mol'],k=>prSig(n*(1+(k%2?.15:-.15)*(1+(k>>1))))+' mol','moles = grams ÷ molar mass = '+g+' ÷ '+prNum(M)+' = '+prSig(n)+' mol',[
 ['Grams → moles: DIVIDE by the molar mass. The units show it: g ÷ (g/mol) = mol.','mol = g ÷ (g/mol)'],
 ['Divide '+g+' by '+prNum(M)+'.',g+' ÷ '+prNum(M)+' = '+prSig(n)+' mol']])}
 const n=prR(1,40)/4,g=n*M;return prMC('What is the mass of '+n+' mol of '+prSub(f)+'? (molar mass '+prNum(M)+' g/mol)',prSig(g)+' g',[prSig(n/M)+' g',prSig(M/n)+' g',prSig(g/10)+' g'],k=>prSig(g*(1+(k%2?.15:-.15)*(1+(k>>1))))+' g','grams = moles × molar mass = '+n+' × '+prNum(M)+' = '+prSig(g)+' g',[
 ['Moles → grams: MULTIPLY by the molar mass. The units show it: mol × (g/mol) = g.','g = mol × (g/mol)'],
 ['Multiply '+n+' by '+prNum(M)+'.',n+' × '+prNum(M)+' = '+prSig(g)+' g']])});
prDef('molarity','Chemistry','Molarity',/molarity|mol\/l|moles? per liter|concentration of (a |the )?solution/i,()=>{
 const n=prR(1,30)/10,V=prPick([100,125,200,250,400,500,750,1000,1500]),M=n/(V/1000),ans=prSig(M)+' M';
 return prMC(n+' mol of solute is dissolved to make '+V+' mL of solution. What is the molarity?',ans,[prSig(n/V)+' M',prSig(n*V/1000)+' M',prSig(V/1000/n)+' M'],k=>prSig(M*(1+(k%2?.2:-.2)*(1+(k>>1))))+' M','M = mol ÷ liters = '+n+' ÷ '+(V/1000)+' = '+ans,[
 ['Molarity = moles of solute ÷ LITERS of solution.','M = mol ÷ L'],
 ['Change mL to L by dividing by 1000.',V+' mL = '+(V/1000)+' L'],
 ['Divide the moles by the liters.',n+' ÷ '+(V/1000)+' = '+ans]])});
prDef('dilution','Chemistry','Dilutions (M₁V₁ = M₂V₂)',/dilut|m1v1|m₁v₁|c1v1|c₁v₁/i,()=>{
 const M1=prPick([0.5,1,1.5,2,2.5,3,4,6,12]),V1=prPick([10,20,25,50,100,150]),k=prPick([2,4,5,8,10]),V2=V1*k,M2=M1*V1/V2;
 if(Math.random()<.5)return prMC(V1+' mL of '+M1+' M solution is diluted to '+V2+' mL. What is the new concentration?',prSig(M2)+' M',[prSig(M1*V2/V1)+' M',prSig(M1-M2)+' M',prSig(V1/(M1*V2))+' M'],j=>prSig(M2*(1+(j%2?.2:-.2)*(1+(j>>1))))+' M','M₂ = M₁V₁ ÷ V₂ = '+M1+' × '+V1+' ÷ '+V2+' = '+prSig(M2)+' M',[
 ['Use M₁V₁ = M₂V₂: adding water doesn’t change the moles of solute.','M₁V₁ = M₂V₂'],
 ['Fill in what you know: M₁ = '+M1+', V₁ = '+V1+', V₂ = '+V2+'. Solve for M₂.','M₂ = M₁V₁ ÷ V₂'],
 ['Multiply, then divide.',M1+' × '+V1+' = '+(M1*V1)+', ÷ '+V2+' = '+prSig(M2)+' M']]);
 return prMC('How many mL of '+M1+' M stock are needed to make '+V2+' mL of '+prSig(M2)+' M solution?',prSig(V1)+' mL',[prSig(M1*V2/M2)+' mL',prSig(V2-V1)+' mL',prSig(M2*M1*V2)+' mL'],j=>prSig(V1*(1+(j%2?.2:-.2)*(1+(j>>1))))+' mL','V₁ = M₂V₂ ÷ M₁ = '+prSig(M2)+' × '+V2+' ÷ '+M1+' = '+V1+' mL',[
 ['Use M₁V₁ = M₂V₂. The stock is M₁; you want V₁.','V₁ = M₂V₂ ÷ M₁'],
 ['Multiply what you want to make: M₂ × V₂.',prSig(M2)+' × '+V2+' = '+prSig(M2*V2)],
 ['Divide by the stock concentration M₁.',prSig(M2*V2)+' ÷ '+M1+' = '+V1+' mL']])});
prDef('gas','Chemistry','Ideal gas law (PV = nRT)',/ideal gas|pv ?= ?nrt|gas laws?\b/i,()=>{
 const R=0.0821,n=prR(1,20)/4,Tc=prPick([0,10,20,25,27,37,50,100]),T=Tc+273,V=prPick([2,5,10,11.2,22.4,25]);
 if(Math.random()<.5){const P=n*R*T/V;return prMC(n+' mol of gas is in a '+V+' L container at '+Tc+' °C. What is the pressure? (R = 0.0821 L·atm/(mol·K))',prSig(P)+' atm',[prSig(n*R*(Tc||1)/V)+' atm',prSig(V/(n*R*T))+' atm',prSig(n*R*T*V)+' atm'],j=>prSig(P*(1+(j%2?.15:-.15)*(1+(j>>1))))+' atm','Convert to kelvin: '+T+' K. P = nRT/V = '+n+' × 0.0821 × '+T+' ÷ '+V+' = '+prSig(P)+' atm',[
 ['Use PV = nRT and solve for pressure: P = nRT ÷ V.','P = nRT/V'],
 ['Temperature must be in kelvin: add 273.',Tc+' °C + 273 = '+T+' K'],
 ['Multiply n × R × T, then divide by V.',n+' × 0.0821 × '+T+' = '+prSig(n*R*T)+', ÷ '+V+' = '+prSig(P)+' atm']])}
 const P=prPick([0.5,1,1.5,2,2.5,3]),nn=P*V/(R*T);return prMC('A '+V+' L container holds gas at '+P+' atm and '+Tc+' °C. How many moles are there? (R = 0.0821)',prSig(nn)+' mol',[prSig(P*V/(R*(Tc||1)))+' mol',prSig(R*T/(P*V))+' mol',prSig(P*V*R*T)+' mol'],j=>prSig(nn*(1+(j%2?.15:-.15)*(1+(j>>1))))+' mol','n = PV/RT = '+P+' × '+V+' ÷ (0.0821 × '+T+') = '+prSig(nn)+' mol',[
 ['Use PV = nRT and solve for moles: n = PV ÷ RT.','n = PV/(RT)'],
 ['Temperature must be in kelvin: add 273.',Tc+' °C + 273 = '+T+' K'],
 ['Work out the top (P × V) and the bottom (R × T), then divide.',P+' × '+V+' = '+prSig(P*V)+';  0.0821 × '+T+' = '+prSig(R*T)+';  '+prSig(P*V)+' ÷ '+prSig(R*T)+' = '+prSig(nn)+' mol']])});
prDef('density','Chemistry','Density',/density|mass ?\/ ?volume|d ?= ?m ?\/ ?v/i,()=>{
 const d=prPick([0.5,0.79,1,1.2,2.7,7.9,8.96,11.3,13.6,19.3]),V=prR(2,50),m=+(d*V).toFixed(2);
 const t=prR(0,2);if(t===0)return prMC('An object has mass '+m+' g and volume '+V+' cm³. What is its density?',prSig(d)+' g/cm³',[prSig(V/m)+' g/cm³',prSig(m*V)+' g/cm³',prSig(m-V)+' g/cm³'],j=>prSig(d*(1+(j%2?.15:-.15)*(1+(j>>1))))+' g/cm³','d = m ÷ V = '+m+' ÷ '+V+' = '+prSig(d)+' g/cm³',[['Density = mass ÷ volume.','d = m/V'],['Divide the mass by the volume.',m+' ÷ '+V+' = '+prSig(d)+' g/cm³']]);
 if(t===1)return prMC('A substance has density '+d+' g/cm³. What is the mass of '+V+' cm³?',prSig(m)+' g',[prSig(d/V)+' g',prSig(V/d)+' g',prSig(d+V)+' g'],j=>prSig(m*(1+(j%2?.15:-.15)*(1+(j>>1))))+' g','m = d × V = '+d+' × '+V+' = '+prSig(m)+' g',[['d = m/V, so mass = density × volume.','m = d × V'],['Multiply.',d+' × '+V+' = '+prSig(m)+' g']]);
 return prMC('A substance has density '+d+' g/cm³. What volume does '+m+' g take up?',prSig(V)+' cm³',[prSig(m*d)+' cm³',prSig(d/m)+' cm³',prSig(m-d)+' cm³'],j=>prSig(V*(1+(j%2?.15:-.15)*(1+(j>>1))))+' cm³','V = m ÷ d = '+m+' ÷ '+d+' = '+prSig(V)+' cm³',[['d = m/V, so volume = mass ÷ density.','V = m/d'],['Divide.',m+' ÷ '+d+' = '+prSig(V)+' cm³']])});
prDef('ph','Chemistry','pH and pOH',/\bph\b|\bpoh\b|hydrogen ion|hydronium|\[h\+\]|\[h3o\+\]/i,()=>{
 const t=prR(0,2),n=prR(1,13);
 if(t===0)return prMC('[H⁺] = 1 × 10'+prSup(-n)+' M. What is the pH?',String(n),[String(-n),String(14-n),String(n+1)],k=>prNear(n,k),'pH = -log[H⁺] = '+n,[['pH = −log[H⁺].','pH = −log(1 × 10'+prSup(-n)+')'],['log(10 to a power) is just that power, so log(10'+prSup(-n)+') = −'+n+'. The two minus signs cancel.','pH = '+n]]);
 if(t===1){const p=prR(10,130)/10;return prMC('A solution has pH '+p+'. What is its pOH?',prNum(14-p,1),[prNum(p,1),prNum(14+p,1),prNum(p-7,1)],k=>prNum(14-p+(k%2?1:-1)*(1+(k>>1)),1),'pH + pOH = 14, so pOH = '+prNum(14-p,1),[['pH and pOH always add up to 14 (at 25 °C).','pH + pOH = 14'],['Subtract the pH from 14.','14 − '+p+' = '+prNum(14-p,1)]])}
 const c=prR(2,9),ph=-Math.log10(c*10**-n);return prMC('[H⁺] = '+c+' × 10'+prSup(-n)+' M. What is the pH?',prNum(ph),[prNum(n+Math.log10(c)),String(n),prNum(14-ph)],k=>prNum(ph+(k%2?.5:-.5)*(1+(k>>1))),'pH = -log('+c+' × 10'+prSup(-n)+') = '+prNum(ph),[
 ['pH = −log[H⁺]. Use the log button on the calculator, or split it with log(a × b) = log a + log b.','pH = −(log '+c+' + log 10'+prSup(-n)+')'],
 ['log 10'+prSup(-n)+' = −'+n+', and log '+c+' ≈ '+prNum(Math.log10(c),3)+'.','−('+prNum(Math.log10(c),3)+' − '+n+') = '+prNum(ph)]])});
// ---------------- Physics ----------------
prDef('kinematics','Physics','Kinematics (constant acceleration)',/kinematic|constant acceleration|v ?= ?v[0₀o]|displacement|free fall|\bsuvat\b/i,()=>{
 const v0=prR(0,20),a=prNZ(-5,6),t=prR(1,10);
 if(Math.random()<.5){const v=v0+a*t;return prMC('A car starts at '+v0+' m/s and accelerates at '+a+' m/s² for '+t+' s. What is its final velocity?',v+' m/s',[(v0*a*t)+' m/s',(a*t)+' m/s',(v0+a+t)+' m/s'],k=>(v+(k%2?1:-1)*(1+(k>>1)))+' m/s','v = v₀ + at = '+v0+' + ('+a+')('+t+') = '+v+' m/s',[
 ['List what you know (v₀, a, t) and what you want (v). The equation with exactly those is v = v₀ + at.','v = v₀ + at'],
 ['Multiply the acceleration by the time: that’s how much the speed changes.','('+a+')('+t+') = '+(a*t)+' m/s'],
 ['Add it to the starting speed.',v0+' + ('+(a*t)+') = '+v+' m/s']])}
 const a2=Math.abs(a),d=v0*t+a2*t*t/2;return prMC('An object starts at '+v0+' m/s and speeds up at '+a2+' m/s² for '+t+' s. How far does it travel?',prNum(d,1)+' m',[prNum(v0*t+a2*t*t,1)+' m',prNum(v0*t,1)+' m',prNum((v0+a2*t)*t,1)+' m'],k=>prNum(d+(k%2?2:-2)*(1+(k>>1)),1)+' m','d = v₀t + ½at² = '+(v0*t)+' + '+prNum(a2*t*t/2,1)+' = '+prNum(d,1)+' m',[
 ['You know v₀, a and t and want the distance: use d = v₀t + ½at².','d = v₀t + ½at²'],
 ['Work out each part separately: v₀t, then ½at² (square the time first).',v0+' × '+t+' = '+(v0*t)+';  ½ × '+a2+' × '+t+'² = '+prNum(a2*t*t/2,1)],
 ['Add the two parts.',(v0*t)+' + '+prNum(a2*t*t/2,1)+' = '+prNum(d,1)+' m']])});
prDef('newton2','Physics','Newton’s second law (F = ma)',/newton'?’?s second|f ?= ?ma|net force/i,()=>{
 const m=prR(1,50),a=prR(1,12),F=m*a,t=prR(0,2);
 if(t===0)return prMC('What net force accelerates a '+m+' kg mass at '+a+' m/s²?',F+' N',[(m+a)+' N',prNum(m/a)+' N',prNum(a/m)+' N'],k=>(F+(k%2?1:-1)*(1+(k>>1)))+' N','F = ma = '+m+' × '+a+' = '+F+' N',[['Newton’s second law: F = ma.','F = m × a'],['Multiply mass by acceleration.',m+' × '+a+' = '+F+' N']]);
 if(t===1)return prMC('A '+F+' N net force acts on a '+m+' kg mass. What is its acceleration?',a+' m/s²',[(F*m)+' m/s²',prNum(m/F)+' m/s²',(F-m)+' m/s²'],k=>(a+(k%2?1:-1)*(1+(k>>1)))+' m/s²','a = F ÷ m = '+F+' ÷ '+m+' = '+a+' m/s²',[['Start from F = ma and solve for a: a = F ÷ m.','a = F/m'],['Divide the force by the mass.',F+' ÷ '+m+' = '+a+' m/s²']]);
 return prMC('A '+F+' N net force gives an object '+a+' m/s² of acceleration. What is its mass?',m+' kg',[(F*a)+' kg',prNum(a/F)+' kg',(F-a)+' kg'],k=>(m+(k%2?1:-1)*(1+(k>>1)))+' kg','m = F ÷ a = '+F+' ÷ '+a+' = '+m+' kg',[['Start from F = ma and solve for m: m = F ÷ a.','m = F/a'],['Divide the force by the acceleration.',F+' ÷ '+a+' = '+m+' kg']])});
prDef('energy','Physics','Kinetic & potential energy',/kinetic energy|potential energy|\bke\b|\bgpe\b|mgh|½ ?mv|1\/2 ?mv/i,()=>{
 const m=prR(1,40),v=prR(1,20),h=prR(1,50);
 if(Math.random()<.5){const K=m*v*v/2;return prMC('What is the kinetic energy of a '+m+' kg object moving at '+v+' m/s?',prNum(K,1)+' J',[prNum(m*v*v,1)+' J',prNum(m*v/2,1)+' J',prNum(m*v,1)+' J'],k=>prNum(K+(k%2?5:-5)*(1+(k>>1)),1)+' J','KE = ½mv² = ½ × '+m+' × '+v+'² = '+prNum(K,1)+' J',[['Kinetic energy: KE = ½mv².','KE = ½mv²'],['Square the speed FIRST.',v+'² = '+(v*v)],['Multiply by the mass, then take half.','½ × '+m+' × '+(v*v)+' = '+prNum(K,1)+' J']])}
 const U=m*9.8*h;return prMC('What is the gravitational potential energy of a '+m+' kg object '+h+' m up? (g = 9.8 m/s²)',prNum(U,1)+' J',[prNum(m*h,1)+' J',prNum(m*9.8,1)+' J',prNum(m*9.8*h/2,1)+' J'],k=>prNum(U+(k%2?10:-10)*(1+(k>>1)),1)+' J','PE = mgh = '+m+' × 9.8 × '+h+' = '+prNum(U,1)+' J',[['Gravitational potential energy: PE = mgh.','PE = mgh'],['Multiply mass × 9.8 × height.',m+' × 9.8 × '+h+' = '+prNum(U,1)+' J']])});
prDef('ohm','Physics','Ohm’s law (V = IR)',/ohm'?’?s law|v ?= ?ir|resistance[^.\n]{0,30}(current|voltage)|voltage[^.\n]{0,30}current/i,()=>{
 const I=prR(1,20)/2,Rr=prR(2,60),V=I*Rr,t=prR(0,2);
 if(t===0)return prMC('A current of '+I+' A flows through a '+Rr+' Ω resistor. What is the voltage?',prNum(V)+' V',[prNum(I/Rr,3)+' V',prNum(Rr/I)+' V',prNum(I+Rr)+' V'],k=>prNum(V+(k%2?1:-1)*(1+(k>>1)))+' V','V = IR = '+I+' × '+Rr+' = '+prNum(V)+' V',[['Ohm’s law: V = IR.','V = I × R'],['Multiply current by resistance.',I+' × '+Rr+' = '+prNum(V)+' V']]);
 if(t===1)return prMC('A '+prNum(V)+' V battery drives current through a '+Rr+' Ω resistor. What is the current?',prNum(I)+' A',[prNum(V*Rr)+' A',prNum(Rr/V,3)+' A',prNum(V-Rr)+' A'],k=>prNum(I+(k%2?.5:-.5)*(1+(k>>1)))+' A','I = V ÷ R = '+prNum(V)+' ÷ '+Rr+' = '+prNum(I)+' A',[['From V = IR, current is I = V ÷ R.','I = V/R'],['Divide the voltage by the resistance.',prNum(V)+' ÷ '+Rr+' = '+prNum(I)+' A']]);
 return prMC(prNum(V)+' V pushes '+I+' A through a resistor. What is its resistance?',Rr+' Ω',[prNum(V*I)+' Ω',prNum(I/V,3)+' Ω',prNum(V-I)+' Ω'],k=>(Rr+(k%2?1:-1)*(1+(k>>1)))+' Ω','R = V ÷ I = '+prNum(V)+' ÷ '+I+' = '+Rr+' Ω',[['From V = IR, resistance is R = V ÷ I.','R = V/I'],['Divide the voltage by the current.',prNum(V)+' ÷ '+I+' = '+Rr+' Ω']])});
// ---------------- Physics (more) ----------------
const prDeg=d=>d*Math.PI/180;
prDef('projectile','Physics','Projectile motion',/projectile|trajectory|launch(ed)? at|range of (a|the) projectile|max(imum)? height/i,()=>{
 const g=9.8,v=prPick([10,12,15,18,20,24,25,30]),th=prPick([30,45,60]),vy=v*Math.sin(prDeg(th)),t=prR(0,2);
 if(t===0){const R=v*v*Math.sin(prDeg(2*th))/g;return prMC('A ball is launched at '+v+' m/s, '+th+'° above level ground. How far does it land? (g = 9.8 m/s²)',prNum(R,1)+' m',[prNum(v*v/g,1)+' m',prNum(v*v*Math.sin(prDeg(th))/g,1)+' m',prNum(2*v*v*Math.sin(prDeg(2*th))/g,1)+' m'],k=>prNum(R+(k%2?2:-2)*(1+(k>>1)),1)+' m','Range = v₀² sin(2θ)/g = '+v+'² × sin('+(2*th)+'°) ÷ 9.8 = '+prNum(R,1)+' m',[
 ['Landing at the same height it started, the range is R = v₀² sin(2θ) ÷ g.','R = v₀² sin(2θ)/g'],
 ['Double the angle and take its sine.','2 × '+th+'° = '+(2*th)+'°, sin '+(2*th)+'° = '+prSin(2*th)],
 ['Square the speed, multiply by that sine, divide by 9.8.',v+'² × '+prSin(2*th)+' ÷ 9.8 = '+prNum(R,1)+' m']])}
 if(t===1){const H=vy*vy/(2*g);return prMC('A ball is launched at '+v+' m/s, '+th+'° above the ground. What is its maximum height? (g = 9.8 m/s²)',prNum(H,1)+' m',[prNum(v*v/(2*g),1)+' m',prNum(vy*vy/g,1)+' m',prNum(vy/g,1)+' m'],k=>prNum(H+(k%2?1:-1)*(1+(k>>1)),1)+' m','v₀y = v₀ sin θ = '+prNum(vy,2)+' m/s. y_max = v₀y²/(2g) = '+prNum(H,1)+' m',[
 ['Only the vertical part of the launch speed matters for height. Find it: v₀y = v₀ sin θ.',v+' × sin '+th+'° = '+prNum(vy,2)+' m/s'],
 ['At the top the vertical speed is 0. From v² = v₀y² − 2gh, the height is h = v₀y² ÷ (2g).','h = v₀y²/(2g)'],
 ['Square v₀y and divide by 2 × 9.8.',prNum(vy,2)+'² ÷ 19.6 = '+prNum(H,1)+' m']])}
 const T=2*vy/g;return prMC('A ball is launched at '+v+' m/s, '+th+'° above level ground. How long is it in the air? (g = 9.8 m/s²)',prNum(T,2)+' s',[prNum(vy/g,2)+' s',prNum(2*v/g,2)+' s',prNum(2*v*Math.cos(prDeg(th))/g,2)+' s'],k=>prNum(T+(k%2?.3:-.3)*(1+(k>>1)),2)+' s','Time up = v₀ sin θ / g = '+prNum(vy/g,2)+' s; up and down doubles it: '+prNum(T,2)+' s',[
 ['Time in the air depends only on the vertical motion. Find the vertical speed: v₀y = v₀ sin θ.',v+' × sin '+th+'° = '+prNum(vy,2)+' m/s'],
 ['Gravity takes away 9.8 m/s of vertical speed every second, so the time to reach the top is v₀y ÷ g.',prNum(vy,2)+' ÷ 9.8 = '+prNum(vy/g,2)+' s'],
 ['Going up and coming down take the same time: double it.','2 × '+prNum(vy/g,2)+' = '+prNum(T,2)+' s']])});
prDef('circular','Physics','Uniform circular motion',/circular motion|centripetal|angular velocity|period of (the )?(orbit|motion)|v\s*=\s*r\s*[wω]/i,()=>{
 const R=prPick([0.5,1,2,3,4,5,8,10]),v=prPick([2,3,4,5,6,8,10]),t=prR(0,2);
 if(t===0)return prMC('An object moves in a circle of radius '+R+' m at '+v+' m/s. What is its centripetal acceleration?',prNum(v*v/R)+' m/s²',[prNum(v/R)+' m/s²',prNum(v*R)+' m/s²',prNum(v*v*R)+' m/s²'],k=>prNum(v*v/R+(k%2?1:-1)*(1+(k>>1)))+' m/s²','a = v²/R = '+v+'² ÷ '+R+' = '+prNum(v*v/R)+' m/s²',[['Centripetal acceleration (toward the center): a = v² ÷ r.','a = v²/r'],['Square the speed, then divide by the radius.',v+'² = '+(v*v)+', ÷ '+R+' = '+prNum(v*v/R)+' m/s²']]);
 if(t===1){const T=2*Math.PI*R/v;return prMC('An object moves in a circle of radius '+R+' m at '+v+' m/s. What is its period?',prNum(T)+' s',[prNum(2*Math.PI*v/R)+' s',prNum(R/v)+' s',prNum(Math.PI*R/v)+' s'],k=>prNum(T+(k%2?.5:-.5)*(1+(k>>1)))+' s','T = 2πR/v = 2π × '+R+' ÷ '+v+' = '+prNum(T)+' s',[['The period is the time for one lap: distance around (2πr) ÷ speed.','T = 2πr/v'],['Find the circumference, then divide by the speed.','2π × '+R+' = '+prNum(2*Math.PI*R)+' m, ÷ '+v+' = '+prNum(T)+' s']])}
 const w=v/R;return prMC('An object moves in a circle of radius '+R+' m at '+v+' m/s. What is its angular velocity ω?',prNum(w)+' rad/s',[prNum(v*R)+' rad/s',prNum(R/v)+' rad/s',prNum(2*Math.PI*w)+' rad/s'],k=>prNum(w+(k%2?.5:-.5)*(1+(k>>1)))+' rad/s','v = Rω, so ω = v/R = '+prNum(w)+' rad/s',[['Speed and angular velocity are linked by v = rω, so ω = v ÷ r.','ω = v/r'],['Divide the speed by the radius.',v+' ÷ '+R+' = '+prNum(w)+' rad/s']])});
prDef('work','Physics','Work (W = Fd cos θ)',/\bwork\b[^.\n]{0,40}(force|joule|distance)|w\s*=\s*f\s*[·.*]?\s*d|fd\s*cos|work[- ]energy/i,()=>{
 const F=prR(2,40)*5,d=prR(2,20),th=prPick([0,30,45,60,90,120,180]),W=F*d*Math.cos(prDeg(th));
 return prMC('A '+F+' N force pulls an object '+d+' m. The force is at '+th+'° to the motion. How much work does it do?',prNum(W,1)+' J',[prNum(F*d,1)+' J',prNum(F*d*Math.sin(prDeg(th)),1)+' J',prNum(F/d,1)+' J',prNum(-W,1)+' J'],k=>prNum(W+(k%2?10:-10)*(1+(k>>1)),1)+' J','W = Fd cos θ = '+F+' × '+d+' × cos '+th+'° = '+prNum(W,1)+' J',[
 ['Work = F × d × cos θ, where θ is the angle between the force and the direction of motion.','W = Fd cos θ'],
 ['Find cos '+th+'°.'+(th===90?' A force at 90° does NO work.':th>90?' It’s negative: the force pushes against the motion.':th===0?' The force points right along the motion.':''),'cos '+th+'° = '+prCos(th)],
 ['Multiply F × d × cos θ.',F+' × '+d+' × '+prCos(th)+' = '+prNum(W,1)+' J']])});
prDef('spring','Physics','Springs (F = -kx, ½kx²)',/spring|hooke|\bkx\b|½\s*kx|1\/2\s*kx/i,()=>{
 const k=prPick([2,3.3,5,10,20,50,100,150,200]),x=prPick([0.05,0.1,0.2,0.25,0.3,0.5,0.78,1]);
 if(Math.random()<.5){const U=k*x*x/2;return prMC('A spring with k = '+k+' N/m is stretched '+x+' m. How much energy does it store?',prSig(U)+' J',[prSig(k*x)+' J',prSig(k*x*x)+' J',prSig(k*x/2)+' J'],j=>prSig(U*(1+(j%2?.2:-.2)*(1+(j>>1))))+' J','U = ½kx² = ½ × '+k+' × '+x+'² = '+prSig(U)+' J',[['Energy stored in a spring: U = ½kx².','U = ½kx²'],['Square the stretch first.',x+'² = '+prSig(x*x)],['Multiply by k and take half.','½ × '+k+' × '+prSig(x*x)+' = '+prSig(U)+' J']])}
 return prMC('A spring with k = '+k+' N/m is stretched '+x+' m. How strong is its pull back?',prSig(k*x)+' N',[prSig(k*x*x/2)+' N',prSig(k/x)+' N',prSig(k*x*x)+' N'],j=>prSig(k*x*(1+(j%2?.2:-.2)*(1+(j>>1))))+' N','|F| = kx = '+k+' × '+x+' = '+prSig(k*x)+' N (the minus sign means it pulls back)',[['Hooke’s law: F = −kx. The minus sign only says the pull is back toward the rest position.','|F| = kx'],['Multiply k by the stretch.',k+' × '+x+' = '+prSig(k*x)+' N']])});
prDef('power','Physics','Power (P = W/t)',/\bpower\b[^.\n]{0,30}(work|watt|rate)|rate of doing work|p\s*=\s*w\s*\/\s*t|\bwatts?\b/i,()=>{
 const W=prR(1,40)*50,t=prPick([2,4,5,8,10,20,25]),P=W/t;
 return prMC(W+' J of work is done in '+t+' s. What is the average power?',prNum(P,1)+' W',[prNum(W*t,1)+' W',prNum(t/W,3)+' W',prNum(W-t,1)+' W'],k=>prNum(P+(k%2?5:-5)*(1+(k>>1)),1)+' W','P = W/t = '+W+' ÷ '+t+' = '+prNum(P,1)+' W',[['Power = work ÷ time (a watt is a joule per second).','P = W/t'],['Divide the work by the time.',W+' ÷ '+t+' = '+prNum(P,1)+' W']])});
prDef('friction','Physics','Friction (f = μN)',/friction|coefficient of (static|kinetic)|μ[sk]?\b|\bmu\b/i,()=>{
 const m=prR(2,40),mu=prPick([0.1,0.15,0.2,0.25,0.3,0.4,0.5,0.6]),N=m*9.8,f=mu*N;
 if(Math.random()<.5)return prMC('A '+m+' kg box slides across a level floor. μk = '+mu+'. What is the kinetic friction force? (g = 9.8 m/s²)',prNum(f,1)+' N',[prNum(mu*m,1)+' N',prNum(N,1)+' N',prNum(N/mu,1)+' N'],k=>prNum(f+(k%2?2:-2)*(1+(k>>1)),1)+' N','N = mg = '+prNum(N,1)+' N; f = μN = '+mu+' × '+prNum(N,1)+' = '+prNum(f,1)+' N',[
 ['Kinetic friction: f = μk × N. On a level floor, the normal force N equals the weight mg.','f = μk·N, N = mg'],
 ['Find the normal force.',m+' × 9.8 = '+prNum(N,1)+' N'],
 ['Multiply by μk.',mu+' × '+prNum(N,1)+' = '+prNum(f,1)+' N']]);
 const a=mu*9.8;return prMC('A box slides on a level floor with μk = '+mu+' and nothing else pushing it. How fast does it slow down? (g = 9.8 m/s²)',prNum(a,2)+' m/s²',[prNum(mu,2)+' m/s²',prNum(9.8/mu,2)+' m/s²',prNum(9.8-a,2)+' m/s²'],k=>prNum(a+(k%2?.5:-.5)*(1+(k>>1)),2)+' m/s²','f = μmg = ma, so a = μg = '+mu+' × 9.8 = '+prNum(a,2)+' m/s²',[
 ['Friction is the only horizontal force, so it’s the net force: f = ma.','f = ma'],
 ['Friction is f = μmg. Set μmg = ma: the mass cancels on both sides!','a = μg'],
 ['Multiply μ by 9.8.',mu+' × 9.8 = '+prNum(a,2)+' m/s²']])});
prDef('weight','Physics','Weight (W = mg)',/\bweight\b|w\s*=\s*mg|f_?g\s*=\s*mg|normal force/i,()=>{
 const m=prR(1,120);if(Math.random()<.5)return prMC('What is the weight of a '+m+' kg object on Earth? (g = 9.8 m/s²)',prNum(m*9.8,1)+' N',[m+' N',prNum(m/9.8,2)+' N',prNum(m*9.8*2,1)+' N'],k=>prNum(m*9.8+(k%2?5:-5)*(1+(k>>1)),1)+' N','W = mg = '+m+' × 9.8 = '+prNum(m*9.8,1)+' N',[['Weight is the force of gravity: W = mg.','W = mg'],['Multiply the mass by 9.8.',m+' × 9.8 = '+prNum(m*9.8,1)+' N']]);
 const W=+(m*9.8).toFixed(1);return prMC('An object weighs '+W+' N on Earth. What is its mass? (g = 9.8 m/s²)',m+' kg',[prNum(W*9.8,0)+' kg',W+' kg',prNum(m/9.8,2)+' kg'],k=>(m+(k%2?1:-1)*(1+(k>>1)))+' kg','m = W/g = '+W+' ÷ 9.8 = '+m+' kg',[['W = mg, so mass = weight ÷ g.','m = W/g'],['Divide by 9.8.',W+' ÷ 9.8 = '+m+' kg']])});
prDef('energy_cons','Physics','Conservation of energy (drops & slopes)',/conservation of (mechanical )?energy|mechanical energy|e_?mech|√\s*\(?2gh|sqrt\(?2gh|k_?i\s*\+\s*u_?i|k_?f\s*\+\s*[uv]_?f/i,()=>{
 const h=prPick([5,10,15,20,25,30,45,80]),g=prPick([9.8,10]);
 if(Math.random()<.5){const v=Math.sqrt(2*g*h);return prMC('A rock is dropped from '+h+' m (no air resistance). How fast is it going when it hits the ground? (g = '+g+' m/s²)',prNum(v,1)+' m/s',[prNum(g*h,1)+' m/s',prNum(Math.sqrt(g*h),1)+' m/s',prNum(2*g*h,1)+' m/s'],k=>prNum(v+(k%2?1:-1)*(1+(k>>1)),1)+' m/s','mgh = ½mv², so v = √(2gh) = √(2 × '+g+' × '+h+') = '+prNum(v,1)+' m/s',[
 ['Energy is conserved: potential energy at the top becomes kinetic energy at the bottom: mgh = ½mv².','mgh = ½mv²'],
 ['The mass cancels. Solve for v.','v = √(2gh)'],
 ['Plug in and take the square root.','√(2 × '+g+' × '+h+') = √'+prNum(2*g*h,1)+' = '+prNum(v,1)+' m/s']])}
 const hb=prPick([2,5,8,10,12,15].filter(x=>x<h)),v=Math.sqrt(2*g*(h-hb));return prMC('A cart starts at rest '+h+' m up a frictionless track. How fast is it at a point '+hb+' m high? (g = '+g+' m/s²)',prNum(v,1)+' m/s',[prNum(Math.sqrt(2*g*h),1)+' m/s',prNum(Math.sqrt(2*g*hb),1)+' m/s',prNum(g*(h-hb),1)+' m/s'],k=>prNum(v+(k%2?1:-1)*(1+(k>>1)),1)+' m/s','v = √(2g(h_i - h)) = √(2 × '+g+' × '+(h-hb)+') = '+prNum(v,1)+' m/s',[
 ['The height it loses turns into kinetic energy: mg(h₁ − h₂) = ½mv². No friction, so nothing is lost.','mgΔh = ½mv²'],
 ['Find how far it dropped.',h+' − '+hb+' = '+(h-hb)+' m'],
 ['The mass cancels: v = √(2gΔh).','√(2 × '+g+' × '+(h-hb)+') = '+prNum(v,1)+' m/s']])});
prDef('vectors','Physics','Vectors (magnitude, components, dot product)',/vectors?\b|dot product|unit vector|components?\b[^.\n]{0,20}(x|y)|î|ĵ|\bi-?hat|magnitude/i,()=>{
 const t=prR(0,2);
 if(t===0){const [a,b,c]=prPick([[3,4,5],[5,12,13],[6,8,10],[8,15,17]]),sx=Math.random()<.5?-1:1;return prMC('What is the magnitude of A = '+(sx*a)+'î + '+b+'ĵ?',String(c),[String(a+b),String(c*c),String(Math.abs(sx*a+b))],k=>prNear(c,k),'|A| = √(Ax² + Ay²) = √('+(a*a)+' + '+(b*b)+') = '+c,[['Magnitude (length) = √(x² + y²): the Pythagorean theorem.','|A| = √(Ax² + Ay²)'],['Square each component and add.',(sx*a)+'² + '+b+'² = '+(a*a+b*b)],['Take the square root.','√'+(a*a+b*b)+' = '+c]])}
 if(t===1){const A=prR(2,20),th=prPick([30,45,60]),ax=A*Math.cos(prDeg(th));return prMC('A vector of length '+A+' points '+th+'° above the x-axis. What is its x-component?',prNum(ax,2),[prNum(A*Math.sin(prDeg(th)),2),String(A),prNum(A*Math.tan(prDeg(th)),2)],k=>prNum(ax+(k%2?1:-1)*(1+(k>>1)),2),'Ax = A cos θ = '+A+' cos '+th+'° = '+prNum(ax,2),[['The x-component sits next to the angle: Ax = A cos θ (y uses sin).','Ax = A cos θ'],['Find cos '+th+'° and multiply by the length.',A+' × '+prCos(th)+' = '+prNum(ax,2)]])}
 const ax=prR(-5,5),ay=prR(-5,5),bx=prR(-5,5),by=prR(-5,5),d=ax*bx+ay*by;return prMC('A = '+ax+'î + '+ay+'ĵ and B = '+bx+'î + '+by+'ĵ. What is A · B?',String(d),[String(ax*by+ay*bx),String(ax*bx-ay*by),String((ax+bx)*(ay+by))],k=>prNear(d,k),'A · B = AxBx + AyBy = '+(ax*bx)+' + '+(ay*by)+' = '+d,[['Dot product: multiply the matching components, then add: AxBx + AyBy.','A · B = AxBx + AyBy'],['Multiply x by x and y by y.','('+ax+')('+bx+') = '+(ax*bx)+',  ('+ay+')('+by+') = '+(ay*by)],['Add them.',(ax*bx)+' + ('+(ay*by)+') = '+d]])});
prDef('rel_motion','Physics','Relative motion (boat & river)',/relative (motion|velocity)|v_?bg|v_?bw|v_?wg|boat[^.\n]{0,40}(river|water|current)/i,()=>{
 const [a,b,c]=prPick([[3,4,5],[5,12,13],[6,8,10],[8,6,10],[4,3,5]]);return prMC('A boat moves '+b+' m/s north relative to the water. The river flows '+a+' m/s east. How fast is the boat moving relative to the ground?',c+' m/s',[(a+b)+' m/s',Math.abs(b-a)+' m/s',(c*c)+' m/s'],k=>(c+(k%2?1:-1)*(1+(k>>1)))+' m/s','The two velocities are at right angles: v = √('+b+'² + '+a+'²) = '+c+' m/s',[['Velocities add like vectors. North and east are at right angles, so they form a right triangle.','v = √(north² + east²)'],['Square each and add.',b+'² + '+a+'² = '+(a*a+b*b)],['Take the square root.','√'+(a*a+b*b)+' = '+c+' m/s']])});
// ---------------- Physics (mechanics) ----------------
const PR_G=9.8,prPct=(v,k,s=.15)=>v*(1+(k%2?s:-s)*(1+(k>>1)));
prDef('incline','Physics','Inclined planes',/inclin|ramp|slope of \d+°|sin ?θ.{0,10}mg|mg ?sin/i,()=>{
 const th=prPick([15,20,25,30,35,40,45,53]),m=prR(2,30),a=PR_G*Math.sin(prDeg(th));
 if(Math.random()<.5)return prMC('A block slides down a frictionless ramp tilted '+th+'°. What is its acceleration? (g = 9.8 m/s²)',prNum(a,2)+' m/s²',[prNum(PR_G*Math.cos(prDeg(th)),2)+' m/s²','9.8 m/s²',prNum(PR_G*Math.tan(prDeg(th)),2)+' m/s²'],k=>prNum(prPct(a,k),2)+' m/s²','Along the ramp only mg sin θ acts: a = g sin '+th+'° = '+prNum(a,2)+' m/s²',[
 ['Split gravity into two parts: along the ramp (mg sin θ) and into the ramp (mg cos θ).','mg sin θ and mg cos θ'],
 ['With no friction, only mg sin θ speeds it up: ma = mg sin θ. The mass cancels!','a = g sin θ'],
 ['Multiply 9.8 by sin '+th+'°.','9.8 × '+prSin(th)+' = '+prNum(a,2)+' m/s²']]);
 const n=m*PR_G*Math.cos(prDeg(th));return prMC('A '+m+' kg block rests on a ramp tilted '+th+'°. What is the normal force? (g = 9.8 m/s²)',prNum(n,1)+' N',[prNum(m*PR_G*Math.sin(prDeg(th)),1)+' N',prNum(m*PR_G,1)+' N',prNum(m*Math.cos(prDeg(th)),1)+' N'],k=>prNum(prPct(n,k),1)+' N','n balances the part of gravity into the ramp: n = mg cos θ = '+prNum(n,1)+' N',[
 ['The normal force balances the part of gravity pushing INTO the ramp: n = mg cos θ.','n = mg cos θ'],
 ['Find the weight mg first.',m+' × 9.8 = '+prNum(m*PR_G,1)+' N'],
 ['Multiply by cos '+th+'°.',prNum(m*PR_G,1)+' × '+prCos(th)+' = '+prNum(n,1)+' N']])});
prDef('dot','Physics','Dot product',/dot product|a ?· ?b|ab ?cos|scalar product/i,()=>{
 const a=[prR(-6,6),prR(-6,6)],b=[prR(-6,6),prR(-6,6)];
 if(Math.random()<.6){const d=a[0]*b[0]+a[1]*b[1];return prMC('A = '+a[0]+'î + '+a[1]+'ĵ and B = '+b[0]+'î + '+b[1]+'ĵ. What is A · B?',String(d),[String(a[0]*b[1]+a[1]*b[0]),String(a[0]+b[0]+a[1]+b[1]),String(-d)],k=>prNear(d,k),'A · B = AxBx + AyBy = ('+a[0]+')('+b[0]+') + ('+a[1]+')('+b[1]+') = '+d,[['Dot product with components: multiply x by x and y by y, then add.','A · B = AxBx + AyBy'],['Multiply the matching parts.','('+a[0]+')('+b[0]+') = '+(a[0]*b[0])+',  ('+a[1]+')('+b[1]+') = '+(a[1]*b[1])],['Add them.',(a[0]*b[0])+' + ('+(a[1]*b[1])+') = '+d]])}
 const A=prR(2,10),B=prR(2,10),th=prPick([0,30,45,60,90,120,180]),d=A*B*Math.cos(prDeg(th));return prMC('|A| = '+A+', |B| = '+B+', and the angle between them is '+th+'°. What is A · B?',prNum(d,2),[prNum(A*B*Math.sin(prDeg(th)),2),String(A*B),prNum(A+B,2)],k=>prNum(d+(k%2?2:-2)*(1+(k>>1)),2),'A · B = AB cos θ = '+A+' × '+B+' × cos '+th+'° = '+prNum(d,2),[['With lengths and an angle, use A · B = |A||B| cos θ.','A · B = AB cos θ'],['Find cos '+th+'°.','cos '+th+'° = '+prCos(th)],['Multiply.',A+' × '+B+' × '+prCos(th)+' = '+prNum(d,2)]])});
prDef('tension','Physics','Tension (hanging masses, two ropes)',/tension|2 ?t ?sin|rope|cable/i,()=>{
 const m=prR(2,40),th=prPick([20,30,37,45,53,60,70]),T=m*PR_G/(2*Math.sin(prDeg(th)));
 if(Math.random()<.4)return prMC('A '+m+' kg mass hangs at rest from a single rope. What is the tension? (g = 9.8 m/s²)',prNum(m*PR_G,1)+' N',[prNum(m*PR_G/2,1)+' N',m+' N',prNum(2*m*PR_G,1)+' N'],k=>prNum(prPct(m*PR_G,k),1)+' N','At rest, T = mg = '+prNum(m*PR_G,1)+' N',[['At rest, the forces balance: the rope’s pull up equals the weight down.','T = mg'],['Multiply the mass by 9.8.',m+' × 9.8 = '+prNum(m*PR_G,1)+' N']]);
 return prMC('A '+m+' kg sign hangs from two ropes, each at '+th+'° above horizontal. What is the tension in each rope? (g = 9.8 m/s²)',prNum(T,1)+' N',[prNum(m*PR_G/2,1)+' N',prNum(m*PR_G/(2*Math.cos(prDeg(th))),1)+' N',prNum(m*PR_G/Math.sin(prDeg(th)),1)+' N'],k=>prNum(prPct(T,k),1)+' N','The vertical parts hold it up: 2T sin θ = mg, so T = mg/(2 sin θ) = '+prNum(T,1)+' N',[
 ['Draw the forces. Each rope pulls up and out at '+th+'°. Only the vertical part of each pull (T sin θ) holds the sign up.','vertical part = T sin θ'],
 ['Two ropes together hold the weight: 2T sin θ = mg. Solve for T.','T = mg ÷ (2 sin θ)'],
 ['Find mg and sin '+th+'°, then divide.','mg = '+prNum(m*PR_G,1)+' N, sin '+th+'° = '+prSin(th)+';  '+prNum(m*PR_G,1)+' ÷ (2 × '+prSin(th)+') = '+prNum(T,1)+' N']])});
prDef('energy_units','Physics','Energy units (J, kWh, Calories)',/kilowatt|kwh|calori|btu|foot.?pound|energy units/i,()=>{
 const t=prR(0,1);if(t===0){const k=prR(1,20)/2,J=k*3.6e6;return prMC('How many joules are in '+k+' kWh? (1 kWh = 3.6 × 10⁶ J)',prSig(J),[prSig(k*3600),prSig(k*3.6e3*1e6),prSig(k/3.6e6)],j=>prSig(prPct(J,j,.2)),k+' × 3.6 × 10⁶ J = '+prSig(J)+' J',[['Multiply by the conversion factor: each kWh is 3.6 × 10⁶ J.','J = kWh × 3.6 × 10⁶'],['Multiply.',k+' × 3.6 × 10⁶ = '+prSig(J)+' J']])}
 const c=prR(1,30)*10,J=c*4184;return prMC('How many joules are in '+c+' food Calories? (1 Cal = 4184 J)',prSig(J)+' J',[prSig(c*4.184)+' J',prSig(c/4184)+' J',prSig(c*1000)+' J'],j=>prSig(prPct(J,j,.2))+' J',c+' × 4184 = '+prSig(J)+' J',[['Each food Calorie is 4184 J. Multiply by that.','J = Cal × 4184'],['Multiply.',c+' × 4184 = '+prSig(J)+' J']])});
// ---------------- using them ----------------
// a fresh problem of a type (retries if a random draw ever comes out unusable)
function prInstance(id){const T=PR[id];if(!T)return null;for(let k=0;k<12;k++){try{const p=T.make();if(p&&prOk(p.a)&&p.w.length===3&&!p.w.includes(p.a))return p}catch(e){}}return null}
// which practice types a piece of text points to
function prDetect(text){const t=String(text||'');return Object.values(PR).filter(T=>T.kw.test(t)).map(T=>T.id)}
// the practice types a study set uses (chosen in the summary editor, or found automatically)
// (until you pick in the summary editor, they're found automatically from the set's title, notes and source text)
function prOf(s){if(!s)return [];const l=Array.isArray(s.practice)?s.practice:prDetect((s.title||'')+'\n'+(s.body||'')+'\n'+String(s.source||'').slice(0,30000));return l.filter(id=>PR[id])}
// show a sample problem from the types ticked in the summary editor
function prTry(){const ids=[...document.querySelectorAll('.pr-pick input[name=pr]:checked')].map(x=>x.value),el=$('prSample');if(!el)return;if(!ids.length){el.innerHTML='<p class="small muted">Tick a problem type first.</p>';return}const id=prPick(ids),p=prInstance(id);if(!p)return;el.innerHTML='<div class="notice"><small>'+esc(PR[id].name)+'</small><br><b>'+esc(p.q)+'</b><br>Answer: '+esc(p.a)+(p.steps&&p.steps.length?'<ol class="small muted pr-steps">'+p.steps.map(x=>'<li>'+esc(x[1])+'</li>').join('')+'</ol>':'<br><span class="small muted">'+esc(p.ex)+'</span>')+'</div>'}
function prSubjects(){const out={};Object.values(PR).forEach(T=>(out[T.subject]=out[T.subject]||[]).push(T));return out}
