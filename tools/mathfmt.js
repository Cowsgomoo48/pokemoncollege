// ===================== MATH DISPLAY & CALCULATOR =====================
// AI text sometimes contains LaTeX (\frac{1}{2}, W_{\text{net}}, v^2). Some of it arrives broken: "\t" and "\f" got turned into
// tab / form-feed characters on the way, which showed up as boxes. mathHTML repairs that and draws real superscripts,
// subscripts, fractions and roots; mathPlain makes a clean Unicode version for plain-text places (summaries, toasts).
const MATH_SYM={alpha:'α',beta:'β',gamma:'γ',delta:'δ',epsilon:'ε',varepsilon:'ε',theta:'θ',vartheta:'θ',lambda:'λ',mu:'μ',nu:'ν',pi:'π',rho:'ρ',sigma:'σ',tau:'τ',phi:'φ',varphi:'φ',omega:'ω',chi:'χ',psi:'ψ',eta:'η',kappa:'κ',zeta:'ζ',xi:'ξ',
 Delta:'Δ',Gamma:'Γ',Theta:'Θ',Lambda:'Λ',Pi:'Π',Sigma:'Σ',Phi:'Φ',Omega:'Ω',Psi:'Ψ',
 cdot:'·',times:'×',div:'÷',pm:'±',mp:'∓',leq:'≤',le:'≤',geq:'≥',ge:'≥',neq:'≠',ne:'≠',approx:'≈',sim:'∼',equiv:'≡',propto:'∝',to:'→',rightarrow:'→',Rightarrow:'⇒',leftarrow:'←',infty:'∞',partial:'∂',nabla:'∇',
 sum:'Σ',prod:'Π',int:'∫',oint:'∮',degree:'°',circ:'°',angle:'∠',perp:'⊥',parallel:'∥',cdots:'⋯',ldots:'…',dots:'…',quad:' ',qquad:'  ',
 sin:'sin',cos:'cos',tan:'tan',sec:'sec',csc:'csc',cot:'cot',arcsin:'arcsin',arccos:'arccos',arctan:'arctan',ln:'ln',log:'log',exp:'exp',lim:'lim',max:'max',min:'min',hbar:'ħ',ell:'ℓ'};
function mathFix(s){return String(s==null?'':s).replace(/\t(?=ext|imes|heta|au\b|o\b|an\b)/g,'\\t').replace(/\f(?=rac)/g,'\\f').replace(/\x08(?=eta|ar)/g,'\\b').replace(/\r(?=ho|ight|ceil)/g,'\\r').replace(/\v(?=ec)/g,'\\v')
 .replace(/\\\(|\\\)|\\\[|\\\]/g,'').replace(/\$\$?/g,'').replace(/\\left|\\right|\\displaystyle|\\,|\\;|\\!/g,m=>m==='\\,'||m==='\\;'?' ':'')}
const mEsc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
// tiny LaTeX-ish renderer: returns HTML
function mathHTML(src){const s=mathFix(src);let i=0;
 const group=()=>{if(s[i]==='{'){i++;const h=seq('}');if(s[i]==='}')i++;return h}if(s[i]==='\\')return cmd();const c=s[i++]||'';return mEsc(c)};
 const word=()=>{let w='';while(i<s.length&&/[A-Za-z0-9.]/.test(s[i])&&w.length<12)w+=s[i++];return w};
 const cmd=()=>{i++;let n='';while(i<s.length&&/[A-Za-z]/.test(s[i]))n+=s[i++];if(!n){const c=s[i++]||'';return mEsc(c)}
  if(n==='frac'||n==='dfrac'||n==='tfrac'){const a=group(),b=group();return '<span class="mfrac"><span>'+a+'</span><span>'+b+'</span></span>'}
  if(n==='sqrt'){let deg='';if(s[i]==='['){const j=s.indexOf(']',i);deg=s.slice(i+1,j);i=j+1}return (deg?'<sup class="mroot">'+mEsc(deg)+'</sup>':'')+'√<span class="msqrt">'+group()+'</span>'}
  if(/^(text|mathrm|mathbf|mathit|operatorname|textbf|textit|mbox)$/.test(n))return group();
  if(n==='vec'||n==='overrightarrow')return '<span class="mvec">'+group()+'</span>';
  if(n==='hat')return group()+'̂';if(n==='bar'||n==='overline')return '<span class="mbar">'+group()+'</span>';if(n==='dot')return group()+'̇';
  if(MATH_SYM[n]!=null)return mEsc(MATH_SYM[n]);return mEsc(n)};
 const script=tag=>{i++;let h;if(s[i]==='{')h=group();else if(s[i]==='\\')h=cmd();else if(/[A-Za-z]/.test(s[i])&&tag==='sub'){h=mEsc(word())}else if(/[0-9]/.test(s[i])){let d='';while(i<s.length&&/[0-9.]/.test(s[i]))d+=s[i++];h=d}else if(s[i]==='-'||s[i]==='−'){i++;h='−'+(/[0-9]/.test(s[i]||'')?(()=>{let d='';while(i<s.length&&/[0-9.]/.test(s[i]))d+=s[i++];return d})():mEsc(s[i++]||''))}else h=mEsc(s[i++]||'');return '<'+tag+'>'+h+'</'+tag+'>'};
 const seq=end=>{let h='';while(i<s.length&&s[i]!==end){const c=s[i];if(c==='\\')h+=cmd();else if(c==='^')h+=script('sup');else if(c==='_'&&/[A-Za-z0-9{\\]/.test(s[i+1]||'')&&i>0&&/[A-Za-z0-9)}\]]/.test(s[i-1]))h+=script('sub');else if(c==='{'){i++;h+=seq('}');if(s[i]==='}')i++}else{h+=mEsc(c);i++}}return h};
 try{return seq(null)}catch(e){return mEsc(s)}}
// same idea, Unicode only (for textareas and plain text)
const M_SUP={'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','-':'⁻','+':'⁺','n':'ⁿ','i':'ⁱ','x':'ˣ','(':'⁽',')':'⁾'},M_SUB={'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉','a':'ₐ','e':'ₑ','o':'ₒ','x':'ₓ','i':'ᵢ','r':'ᵣ','u':'ᵤ','v':'ᵥ','k':'ₖ','s':'ₛ','t':'ₜ','n':'ₙ','m':'ₘ','p':'ₚ','f':'f','g':'g','y':'y','c':'c','d':'d'};
const M_VULGAR={'1/2':'½','1/3':'⅓','2/3':'⅔','1/4':'¼','3/4':'¾','1/5':'⅕','1/6':'⅙','1/8':'⅛'};
function mathPlain(src){const div=document.createElement('div');div.innerHTML=mathHTML(src);
 div.querySelectorAll('sup').forEach(x=>{const t=x.textContent;x.replaceWith([...t].every(c=>M_SUP[c])?[...t].map(c=>M_SUP[c]).join(''):'^('+t+')')});
 div.querySelectorAll('sub').forEach(x=>{const t=x.textContent;x.replaceWith([...t].every(c=>M_SUB[c]&&!/[fgycd]/.test(c))?[...t].map(c=>M_SUB[c]).join(''):'_'+t)});
 div.querySelectorAll('.mfrac').forEach(f=>{const [a,b]=[...f.children].map(x=>x.textContent.trim());const w=x=>/[\s+\-−=·×/]/.test(x)?'('+x+')':x;f.replaceWith(M_VULGAR[a+'/'+b]||(w(a)+'/'+w(b)))});
 div.querySelectorAll('.msqrt').forEach(x=>{const t=x.textContent;x.replaceWith(t.length>1?'('+t+')':t)});
 return div.textContent}
// does this question involve numbers / equations? (then offer the calculator)
function mathy(...parts){const t=parts.join(' ');return /\d\s*[-+*/×÷^=]|[=√π²³θ]|\\frac|\^|\d+\.\d|\d\s*(m|s|kg|N|J|W|mol|g|L|°|m\/s)\b/.test(t)&&/\d/.test(t)}
// ---------- scientific calculator ----------
let calcDeg=true;
function calcHTML(){return '<details class="calc"><summary>🧮 Calculator</summary><div class="calc-in"><div class="calc-scr"><input class="calc-exp" inputmode="none" readonly><div class="calc-res"></div></div><div class="calc-keys">'
 +[['sin','cos','tan','DEG','C'],['asin','acos','atan','(',')'],['√','x²','^','ln','log'],['7','8','9','÷','⌫'],['4','5','6','×','π'],['1','2','3','−','e'],['0','.','±','+','=']].map(r=>r.map(k=>'<button type="button" class="ck'+(/^[0-9.]$/.test(k)?' n':k==='='?' eq':'')+'" data-k="'+k+'">'+k+'</button>').join('')).join('')+'</div></div></details>'}
function calcInit(root){const box=root&&root.querySelector('.calc');if(!box)return;const ex=box.querySelector('.calc-exp'),res=box.querySelector('.calc-res');let s='';
 const show=()=>{ex.value=s;const v=s?calcEval(s):null;res.textContent=v==null?'':'= '+calcFmt(v)};
 box.querySelectorAll('.ck').forEach(b=>{if(b.dataset.k==='DEG')b.textContent=calcDeg?'DEG':'RAD';b.onclick=e=>{e.preventDefault();const k=b.dataset.k;
  if(k==='C')s='';else if(k==='⌫')s=s.replace(/(asin\(|acos\(|atan\(|sin\(|cos\(|tan\(|ln\(|log\(|√\(|.)$/,'');else if(k==='DEG'){calcDeg=!calcDeg;b.textContent=calcDeg?'DEG':'RAD'}
  else if(k==='='){const v=calcEval(s);if(v!=null)s=calcFmt(v).replace(/×10\^/,'e')}else if(k==='x²')s+='^2';else if(k==='±')s=s?'-('+s+')':'-';else if(/^(a?sin|a?cos|a?tan|ln|log|√)$/.test(k))s+=k+'(';else s+=k;show()}})}
function calcFmt(v){if(!isFinite(v))return 'Error';if(v!==0&&(Math.abs(v)>=1e10||Math.abs(v)<1e-6)){const e=Math.floor(Math.log10(Math.abs(v)));return +(v/10**e).toPrecision(6)+'×10^'+e}return String(+v.toPrecision(10))}
// a small, safe expression parser (no eval): + − × ÷ ^, parentheses, functions, π, e, implicit multiplication
function calcEval(src){const t=[];const str=src.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/π/g,'π');let i=0;
 while(i<str.length){const c=str[i];if(/\s/.test(c)){i++;continue}if(/[0-9.]/.test(c)){let n='';while(i<str.length&&/[0-9.]/.test(str[i]))n+=str[i++];if(str[i]==='e'&&/[0-9-]/.test(str[i+1]||'')){n+=str[i++];if(str[i]==='-')n+=str[i++];while(i<str.length&&/[0-9]/.test(str[i]))n+=str[i++]}t.push({n:+n});continue}
  const f=str.slice(i).match(/^(asin|acos|atan|sin|cos|tan|ln|log|√)/);if(f){t.push({f:f[1]});i+=f[1].length;continue}
  if(c==='π'){t.push({n:Math.PI});i++;continue}if(c==='e'){t.push({n:Math.E});i++;continue}if('+-*/^()'.includes(c)){t.push({o:c});i++;continue}return null}
 // implicit multiplication: 2π, 3(4), )(, 2sin(
 const tk=[];t.forEach((x,k)=>{const p=tk[tk.length-1];if(p&&(p.n!=null||p.o===')')&&(x.n!=null||x.f||x.o==='('))tk.push({o:'*'});tk.push(x)});let p=0;
 const rad=a=>calcDeg?a*Math.PI/180:a,deg=a=>calcDeg?a*180/Math.PI:a,F={sin:a=>Math.sin(rad(a)),cos:a=>Math.cos(rad(a)),tan:a=>Math.tan(rad(a)),asin:a=>deg(Math.asin(a)),acos:a=>deg(Math.acos(a)),atan:a=>deg(Math.atan(a)),ln:Math.log,log:Math.log10,'√':Math.sqrt};
 const prim=()=>{const x=tk[p++];if(!x)throw 0;if(x.n!=null)return x.n;if(x.o==='-')return -pow();if(x.o==='+')return pow();if(x.o==='('){const v=add();if(tk[p]&&tk[p].o===')')p++;return v}if(x.f){let v;if(tk[p]&&tk[p].o==='('){p++;v=add();if(tk[p]&&tk[p].o===')')p++}else v=pow();return F[x.f](v)}throw 0};
 const pow=()=>{const b=prim();if(tk[p]&&tk[p].o==='^'){p++;return Math.pow(b,pow())}return b};
 const mul=()=>{let v=pow();while(tk[p]&&(tk[p].o==='*'||tk[p].o==='/')){const o=tk[p++].o,r=pow();v=o==='*'?v*r:v/r}return v};
 const add=()=>{let v=mul();while(tk[p]&&(tk[p].o==='+'||tk[p].o==='-')){const o=tk[p++].o,r=mul();v=o==='+'?v+r:v-r}return v};
 try{if(!tk.length)return null;const v=add();return p>=tk.length-0||tk.slice(p).every(x=>x.o===')')?v:null}catch(e){return null}}
