// ===================== GEMINI (free online AI, optional) =====================
// With a free Google AI Studio key, study guides come from Gemini: it reads the photos themselves (not the phone's OCR),
// fills in gaps with standard facts, picks matching practice problem types, and writes quiz questions.
// The key is kept on this device only (not in backups). Without a key, no internet, or over the free limits, the on-device AI is used.
const GM_BASE='https://generativelanguage.googleapis.com/v1beta/';
function gmKey(){try{return localStorage.getItem('pc_gemini_key')||''}catch(e){return ''}}
function aiAny(){return aiState.available||!!gmKey()}
async function gmHttp(url,body){
 const C=window.Capacitor,H=C&&C.isNativePlatform&&C.isNativePlatform()&&C.Plugins&&C.Plugins.CapacitorHttp;
 if(H){const r=await H.request({url,method:body?'POST':'GET',headers:{'Content-Type':'application/json'},data:body||undefined});let d=r.data;if(typeof d==='string'){try{d=JSON.parse(d)}catch(e){}}return {status:r.status,data:d}}
 const r=await fetch(url,body?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:{});let d=null;try{d=await r.json()}catch(e){}return {status:r.status,data:d}}
function gmErr(r){const m=r&&r.data&&r.data.error&&r.data.error.message;return (r.status===429?'Gemini’s free limit is used up for now':r.status===400&&/API key/i.test(m||'')?'That Gemini key isn’t valid':r.status===403?'That Gemini key isn’t allowed to use this model':'Gemini error '+r.status)+(m&&r.status!==429?' ('+String(m).slice(0,90)+')':'')}
// the Flash models this key can use, best first (names change over time, so ask Google instead of hard-coding one)
async function gmModels(force){const k=gmKey();if(!k)throw new Error('No Gemini key');let c=null;try{c=JSON.parse(localStorage.getItem('pc_gemini_models')||'null')}catch(e){}
 if(!force&&c&&c.key===k.slice(-6)&&Date.now()-c.at<864e5&&c.list.length)return c.list;
 const r=await gmHttp(GM_BASE+'models?pageSize=200&key='+encodeURIComponent(k));if(r.status!==200)throw new Error(gmErr(r));
 const ver=n=>parseFloat((n.match(/gemini-(\d+(?:\.\d+)?)/)||[0,0])[1]);
 const list=(r.data.models||[]).filter(m=>(m.supportedGenerationMethods||[]).includes('generateContent')).map(m=>m.name.replace(/^models\//,'')).filter(n=>/^gemini-[\d.]+-flash(-lite)?(-latest|-\d{3})?$/.test(n)).sort((a,b)=>ver(b)-ver(a)||(/lite/.test(a)?1:0)-(/lite/.test(b)?1:0));
 if(!list.length)throw new Error('No Gemini Flash model is available for this key');try{localStorage.setItem('pc_gemini_models',JSON.stringify({key:k.slice(-6),at:Date.now(),list}))}catch(e){}return list}
const GM_SAFETY=['HARM_CATEGORY_HARASSMENT','HARM_CATEGORY_HATE_SPEECH','HARM_CATEGORY_SEXUALLY_EXPLICIT','HARM_CATEGORY_DANGEROUS_CONTENT'].map(category=>({category,threshold:'BLOCK_ONLY_HIGH'}));
// one request; on "free limit" for one model, tries the next model; waits and retries briefly on rate limits
function gmSkip(){try{const s=JSON.parse(localStorage.getItem('pc_gemini_skip')||'{}');return s.day===localDay()?s:{day:localDay(),m:[]}}catch(e){return {day:localDay(),m:[]}}}
async function gmGenerate(parts,schema,onWait){const k=gmKey(),sk=gmSkip(),models=(await gmModels()).filter(m=>!sk.m.includes(m));let last='Gemini’s free limit is used up for today';
 for(const model of models.slice(0,3)){for(let attempt=0;attempt<3;attempt++){
  const r=await gmHttp(GM_BASE+'models/'+model+':generateContent?key='+encodeURIComponent(k),{contents:[{role:'user',parts}],safetySettings:GM_SAFETY,generationConfig:{temperature:.3,responseMimeType:'application/json',responseSchema:schema}});
  if(r.status===200){const c=r.data&&r.data.candidates&&r.data.candidates[0],t=c&&c.content&&c.content.parts&&c.content.parts.map(p=>p.text||'').join('');if(!t){last='Gemini returned nothing'+(c&&c.finishReason?' ('+c.finishReason+')':'');break}try{return {json:JSON.parse(t),model}}catch(e){last='Gemini’s answer was cut off';break}}
  last=gmErr(r);if(r.status===429){const d=JSON.stringify(r.data||{}).match(/"retryDelay":"(\d+)/),wait=Math.min(40,d?+d[1]+1:15);if(attempt<2&&!/per day|PerDay|daily/i.test(JSON.stringify(r.data||{}))){onWait&&onWait(wait);await new Promise(ok=>setTimeout(ok,wait*1000));continue}if(/per day|PerDay|daily/i.test(JSON.stringify(r.data||{}))){sk.m.push(model);try{localStorage.setItem('pc_gemini_skip',JSON.stringify(sk))}catch(e){}}break}
  if(r.status===404||r.status===403)break;throw new Error(last)}}
 throw new Error(last)}
const GM_GUIDE_SCHEMA={type:'OBJECT',properties:{
 overview:{type:'STRING'},
 problemTypes:{type:'ARRAY',items:{type:'OBJECT',properties:{name:{type:'STRING'},how:{type:'STRING'}},required:['name','how']}},
 formulas:{type:'ARRAY',items:{type:'OBJECT',properties:{name:{type:'STRING'},formula:{type:'STRING'},use:{type:'STRING'}},required:['name','formula']}},
 concepts:{type:'ARRAY',items:{type:'OBJECT',properties:{name:{type:'STRING'},meaning:{type:'STRING'}},required:['name','meaning']}},
 examples:{type:'ARRAY',items:{type:'STRING'}},
 practice:{type:'ARRAY',items:{type:'STRING'}},
 questions:{type:'ARRAY',items:{type:'OBJECT',properties:{question:{type:'STRING'},answer:{type:'STRING'},wrong:{type:'ARRAY',items:{type:'STRING'}}},required:['question','answer','wrong']}}},
 required:['overview','problemTypes','formulas','concepts','examples','practice','questions']};
function gmPrompt(n,of){return 'You are building a study guide for a college student from '+(n?'photos of their class notes and worksheets':'their class notes')+(of>1?' (part '+n+' of '+of+')':'')+'.\n'
 +'- Work out which course and topics this covers. Handwriting may be messy: ignore crossed-out, cut-off or unreadable bits and never copy gibberish.\n'
 +'- Where the notes are incomplete or unclear but the topic is clear, fill in the standard, correct textbook facts so every item is complete.\n'
 +'- problemTypes: the kinds of problems the student must be able to solve, each with one sentence on how to solve it.\n'
 +'- Write all math as plain text with Unicode symbols (½, ², ³, √, θ, π, Δ, μ, ·, ×, →, subscripts like v₀). Never use LaTeX, backslashes or $ signs.\n'
 +'- formulas: name, the formula in plain text, and when to use it. concepts: key ideas, one sentence each. examples: up to 4 short worked examples written as "problem → answer".\n'
 +'- practice: choose ONLY from these practice-problem ids, the ones that clearly match the material (it is fine to choose none): '+Object.values(PR).map(T=>T.id+' = '+T.name).join('; ')+'.\n'
 +'- questions: 6 to 10 multiple-choice questions that test understanding of the concepts (not copied homework), each with the correct answer and exactly 3 plausible wrong answers.\n'
 +'- overview: 3 to 5 plain sentences on what this set covers and what the student must be able to do.'}
async function gmPhotoPart(id){const src=ppSrc(id);if(!src)return null;const b=await (await fetch(src)).blob();const d=await new Promise((ok,no)=>{const fr=new FileReader();fr.onload=()=>ok(fr.result);fr.onerror=no;fr.readAsDataURL(b)});return {inline_data:{mime_type:'image/jpeg',data:String(d).split(',')[1]}}}
// builds the guide from photos (in batches of 6) or from text; merges the batches
async function gmGuide({photoIds,text},onProg){const batches=[];if(photoIds&&photoIds.length){for(let i=0;i<photoIds.length;i+=6)batches.push(photoIds.slice(i,i+6))}else{const t=String(text||'');for(let i=0;i<t.length&&batches.length<10;i+=60000)batches.push(t.slice(i,i+60000))}
 const all={overview:'',problemTypes:[],formulas:[],concepts:[],examples:[],practice:[],questions:[]};let model='';
 for(let i=0;i<batches.length;i++){onProg&&onProg('Gemini · part '+(i+1)+' of '+batches.length);let parts;
  if(photoIds&&photoIds.length){parts=[{text:gmPrompt(i+1,batches.length)}];for(const id of batches[i]){try{const p=await gmPhotoPart(id);if(p)parts.push(p)}catch(e){}}if(parts.length<2)continue}
  else parts=[{text:gmPrompt(0,batches.length)+'\n\nNotes:\n'+batches[i]}];
  const r=await gmGenerate(parts,GM_GUIDE_SCHEMA,w=>onProg&&onProg('Gemini · waiting '+w+' s for the free limit'));model=r.model;const g=r.json||{};
  if(g.overview&&!all.overview)all.overview=g.overview;['problemTypes','formulas','concepts','examples','practice','questions'].forEach(k=>{if(Array.isArray(g[k]))all[k].push(...g[k])})}
 all.practice=[...new Set(all.practice)].filter(id=>PR[id]);const qs=new Set();all.questions=all.questions.filter(q=>q&&q.question&&q.answer&&Array.isArray(q.wrong)&&q.wrong.length>=1&&!qs.has(q.question)&&qs.add(q.question)).map(q=>({question:q.question,answer:q.answer,wrong:q.wrong.filter(w=>w&&w!==q.answer).slice(0,3)})).slice(0,30);all.model=model;return all}
// ---- Settings ----
function gmBoxHTML(){const k=gmKey();let st='';try{st=localStorage.getItem('pc_gemini_status')||''}catch(e){}
 return '<div class="item gm-box"><span style="font-size:28px">🌐</span><div class="iteminfo"><strong>Gemini online AI · '+(k?'ON':'OFF')+'</strong><small>Optional and free: with a key from Google AI Studio, study guides come from Gemini, which reads your photos directly and fills in gaps. On the free tier Google may use what you send to improve its products, and there are daily limits (the on-device AI takes over when they run out). The key stays on this iPhone.</small>'
  +'<div class="gm-row"><input id="gmKeyIn" type="password" autocomplete="off" placeholder="'+(k?'Key saved ••••'+esc(k.slice(-4)):'Paste your Gemini API key')+'"><button class="btn smallbtn red" onclick="gmSave()">SAVE</button></div>'
  +'<div class="gm-row"><button class="btn smallbtn" onclick="window.open(\'https://aistudio.google.com/apikey\',\'_blank\')">GET A FREE KEY ↗</button>'+(k?'<button class="btn smallbtn" onclick="gmTest()">TEST</button><button class="btn smallbtn" onclick="gmForget()">REMOVE KEY</button>':'')+'</div><small id="gmStatus">'+esc(st)+'</small></div></div>'}
function gmSetStatus(t){try{localStorage.setItem('pc_gemini_status',t)}catch(e){}const el=$('gmStatus');if(el)el.textContent=t}
async function gmTest(){gmSetStatus('Checking…');try{const m=await gmModels(true);gmSetStatus('✓ Connected · using '+m[0]+(m.length>1?' (backup: '+m[1]+')':''))}catch(e){gmSetStatus('⚠ '+e.message)}}
function gmSave(){const v=($('gmKeyIn')||{}).value||'';if(!v.trim()){toast('Paste your key first');return}try{localStorage.setItem('pc_gemini_key',v.trim());localStorage.removeItem('pc_gemini_models')}catch(e){}drawAIStatus();gmTest();toast('Gemini key saved on this iPhone')}
function gmForget(){if(!confirm('Remove the Gemini key from this iPhone?'))return;try{localStorage.removeItem('pc_gemini_key');localStorage.removeItem('pc_gemini_models');localStorage.removeItem('pc_gemini_status')}catch(e){}drawAIStatus()}
