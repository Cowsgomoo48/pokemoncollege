// Swaps emoji in the page for the soft painted icons in assets/ico (ICO_MAP comes from tools/make_icons_soft.py).
// Works on every text node as it appears, so nothing that writes emoji into the page needs to know about it.
// Skipped: form fields, <select>/<option>, canvas, SVG, and anything inside .no-ico.
const ICO_RX=new RegExp('(?:'+Object.keys(ICO_MAP).sort((a,b)=>b.length-a.length).map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')\\uFE0F?','gu');
const ICO_SKIP=/^(SCRIPT|STYLE|TEXTAREA|INPUT|SELECT|OPTION|CANVAS|NOSCRIPT|TITLE)$/;
function icoSrc(name){return './assets/ico/'+name+'.png'}
function icoHTML(name,cls){return '<img class="ico'+(cls?' '+cls:'')+'" src="'+icoSrc(name)+'" alt="" draggable="false">'}
function icoText(t){ICO_RX.lastIndex=0;return ICO_RX.test(t)}
function icoNode(tn){const p=tn.parentNode;if(!p||p.nodeType!==1||ICO_SKIP.test(p.nodeName)||p.namespaceURI!=='http://www.w3.org/1999/xhtml'||p.closest('.no-ico,svg,[contenteditable="true"]'))return;
 const t=tn.nodeValue;if(!t||!icoText(t))return;const f=document.createDocumentFragment();let last=0;ICO_RX.lastIndex=0;let m;
 while((m=ICO_RX.exec(t))){if(m.index>last)f.appendChild(document.createTextNode(t.slice(last,m.index)));const im=document.createElement('img');im.className='ico';im.alt=m[0];im.draggable=false;im.src=icoSrc(ICO_MAP[m[0].replace(/️/g,'')]);f.appendChild(im);last=m.index+m[0].length}
 if(last<t.length)f.appendChild(document.createTextNode(t.slice(last)));tn.replaceWith(f)}
function icoize(root){if(!root)return;if(root.nodeType===3){icoNode(root);return}if(root.nodeType!==1||ICO_SKIP.test(root.nodeName))return;
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.nodeValue&&icoText(n.nodeValue)?1:3}),list=[];while(w.nextNode())list.push(w.currentNode);list.forEach(icoNode)}
function icoStart(){icoize(document.body);new MutationObserver(ms=>{for(const m of ms){if(m.type==='characterData')icoNode(m.target);else m.addedNodes.forEach(icoize)}}).observe(document.body,{childList:true,subtree:true,characterData:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',icoStart);else icoStart();
