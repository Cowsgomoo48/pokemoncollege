// Shared illustrated-emoji renderer. Keep emoji tokens in data/save files; replace only presentation.
// Editable text, code, math, SVG and canvas are deliberately not rewritten.
const ICO_RX=new RegExp('(?:'+Object.keys(ICO_MAP).sort((a,b)=>b.length-a.length).map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')[\\uFE0E\\uFE0F]?','gu');
const ICO_SKIP=/^(SCRIPT|STYLE|TEXTAREA|INPUT|CANVAS|NOSCRIPT|TITLE|CODE|PRE)$/;
const ICO_LABELS={dc_ap:'Action Points',dc_void:'Void',dc_discard:'Discard pile',gi:'Martial arts',mg_speed:'Timer',test_tube:'Potion',empty_battery:'Drained',wing:'Fly',skull:'Skull',infinity:'Unlimited',bolt_nut:'Component',trap:'Trap',mail:'Mail',slipper:'Slipper',button:'Button'};
function icoLabel(name){return ICO_LABELS[name]||name.replace(/_/g,' ').replace(/^./,c=>c.toUpperCase())}
function icoSrc(name){return './assets/ico/'+name+'.png'}
function icoHTML(name,cls){return '<img class="ico'+(cls?' '+cls:'')+'" src="'+icoSrc(name)+'" alt="" draggable="false">'}
function icoText(t){ICO_RX.lastIndex=0;return ICO_RX.test(t)}
function icoPlain(t){return String(t??'').replace(ICO_RX,m=>icoLabel(ICO_MAP[m.replace(/[\uFE0E\uFE0F]/g,'')]))}
function icoNode(tn){const p=tn.parentNode;if(!p||p.nodeType!==1||ICO_SKIP.test(p.nodeName)||p.namespaceURI!=='http://www.w3.org/1999/xhtml'||p.closest('.no-ico,svg,code,pre,math,[contenteditable="true"]'))return;
 const t=tn.nodeValue;if(!t||!icoText(t))return;
 // Native option popups do not support images on iOS. Preserve the value, use a readable label.
 if(p.closest('select,option,optgroup')){tn.nodeValue=t.replace(ICO_RX,'').trim()||icoPlain(t);return}
 const f=document.createDocumentFragment();let last=0;ICO_RX.lastIndex=0;let m;
 while((m=ICO_RX.exec(t))){if(m.index>last)f.appendChild(document.createTextNode(t.slice(last,m.index)));const name=ICO_MAP[m[0].replace(/[\uFE0E\uFE0F]/g,'')],im=document.createElement('img');im.className='ico';im.alt=icoLabel(name);im.draggable=false;im.src=icoSrc(name);f.appendChild(im);last=m.index+m[0].length}
 if(last<t.length)f.appendChild(document.createTextNode(t.slice(last)));tn.replaceWith(f)}
function icoize(root){if(!root)return;if(root.nodeType===3){icoNode(root);return}if(root.nodeType!==1||ICO_SKIP.test(root.nodeName)||root.closest('.no-ico,svg,code,pre,math,[contenteditable="true"]'))return;
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.nodeValue&&icoText(n.nodeValue)?1:3}),list=[];while(w.nextNode())list.push(w.currentNode);list.forEach(icoNode)}
function icoStart(){icoize(document.body);new MutationObserver(ms=>{for(const m of ms){if(m.type==='characterData')icoNode(m.target);else m.addedNodes.forEach(icoize)}}).observe(document.body,{childList:true,subtree:true,characterData:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',icoStart);else icoStart();
