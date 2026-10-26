// ===================== MOODLE (assignments → tasks) =====================
// Moodle's "Export calendar" link is a private calendar feed (.ics). Each time the app opens, it reads the feed and adds
// any new due dates as tasks. Every Moodle event is remembered, so nothing is added twice and a task you deleted or
// finished never comes back. If a teacher moves a due date, the task's date follows it. The link stays on this iPhone only.
function mdUrl(){try{return localStorage.getItem('pc_moodle_url')||''}catch(e){return ''}}
function mdState(){return db.moodle||(db.moodle={seen:{},last:0,status:''})}
async function mdFetch(url){const C=window.Capacitor,H=C&&C.isNativePlatform&&C.isNativePlatform()&&C.Plugins&&C.Plugins.CapacitorHttp;
 if(H){const r=await H.request({url,method:'GET',responseType:'text'});if(r.status!==200)throw new Error('Moodle answered '+r.status);return typeof r.data==='string'?r.data:String(r.data||'')}
 const r=await fetch(url);if(!r.ok)throw new Error('Moodle answered '+r.status);return r.text()}
// a small .ics reader: unfolds long lines, reads each event's UID, title, course and start time
function mdParse(ics){const lines=String(ics).replace(/\r\n/g,'\n').replace(/\n[ \t]/g,'').split('\n'),out=[];let ev=null;
 const un=v=>v.replace(/\\n/gi,'\n').replace(/\\([,;\\])/g,'$1').trim();
 for(const line of lines){if(line==='BEGIN:VEVENT'){ev={};continue}if(line==='END:VEVENT'){if(ev&&ev.uid&&ev.start)out.push(ev);ev=null;continue}if(!ev)continue;
  const i=line.indexOf(':');if(i<0)continue;const head=line.slice(0,i),val=line.slice(i+1),key=head.split(';')[0].toUpperCase();
  if(key==='UID')ev.uid=val.trim();else if(key==='SUMMARY')ev.title=un(val);else if(key==='CATEGORIES')ev.course=un(val);else if(key==='DESCRIPTION')ev.desc=un(val);
  else if(key==='DTSTART'){const m=val.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?/);if(m){const [,y,mo,d,h,mi,s,z]=m;ev.allDay=!h;ev.start=z?new Date(Date.UTC(+y,mo-1,+d,+h,+mi,+s)):new Date(+y,mo-1,+d,+(h||23),+(mi||59),+(s||0))}}}
 return out}
// Moodle titles look like "Essay 2 is due" or "Quiz 3 closes"; "opens" events and grading reminders aren't assignments
function mdTitle(t){return String(t||'').replace(/\s+(is due|closes|is due to be graded|deadline|due)\s*$/i,'').trim()}
function mdIsTask(ev){return !/\bopens\s*$|\bis due to be graded\s*$|\bstarts\s*$/i.test(ev.title||'')}
async function mdSync(manual){const url=mdUrl();if(!url)return;const S=mdState();if(!manual&&Date.now()-(S.last||0)<10*60e3)return;
 let evs;try{evs=mdParse(await mdFetch(url))}catch(e){S.status='⚠ Couldn’t reach Moodle: '+String(e&&e.message||e).slice(0,80);save();mdDraw();if(manual)toast(S.status);return}
 const now=Date.now(),added=[],moved=[];
 for(const ev of evs){if(!mdIsTask(ev))continue;const due=ymd(ev.start),time=ev.allDay?'':String(ev.start.getHours()).padStart(2,'0')+':'+String(ev.start.getMinutes()).padStart(2,'0'),seen=S.seen[ev.uid];
  if(seen){const t=db.tasks.find(x=>x.id===seen.task);if(t&&!t.done&&(t.due!==due||(time&&t.dueTime!==time))&&seen.due!==due+' '+time){t.due=due;if(time)t.dueTime=time;moved.push(t.title)}S.seen[ev.uid]={task:seen.task,due:due+' '+time};continue}
  if(ev.start.getTime()<now-864e5){S.seen[ev.uid]={task:null,due:due+' '+time};continue}
  const title=mdTitle(ev.title)||'Moodle assignment',dupe=db.tasks.find(x=>x.title.toLowerCase()===title.toLowerCase()&&x.due===due);
  if(dupe){S.seen[ev.uid]={task:dupe.id,due:due+' '+time};continue}
  const id=uid();db.tasks.push({title,description:'📥 From Moodle'+(ev.course?' · '+ev.course:''),due,dueTime:time||undefined,priority:false,assignment:true,id,createdAt:stamp(),rewardSetAt:stamp(),rewardCap:taskCogs(daysFrom(due,Date.now())),cap5:true,done:false,moodle:true});
  S.seen[ev.uid]={task:id,due:due+' '+time};added.push(title)}
 S.last=now;S.status='✓ Checked '+new Date(now).toLocaleString([], {month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})+' · '+evs.filter(mdIsTask).length+' Moodle due dates';
 save();if(added.length||moved.length){render();gmNotice('📥 '+(added.length?added.length+' new assignment'+(added.length>1?'s':'')+' from Moodle'+(added.length<=3?': '+added.join(', '):''):'')+(added.length&&moved.length?' · ':'')+(moved.length?moved.length+' due date'+(moved.length>1?'s':'')+' changed':''))}
 else if(manual)toast('Moodle checked: nothing new');mdDraw()}
function mdBoxHTML(){const u=mdUrl(),S=mdState();return '<div class="item gm-box"><span style="font-size:28px">📥</span><div class="iteminfo"><strong>Moodle assignments · '+(u?'ON':'OFF')+'</strong><small>Paste your Moodle calendar link (Moodle → Calendar → Export calendar → All courses → Get calendar URL). Each time the app opens, new due dates become tasks marked “📥 From Moodle”. Deleted or finished ones never come back. The link works like a password, so it stays on this iPhone and isn’t in backups.</small>'
 +'<div class="gm-row"><input id="mdUrlIn" type="password" autocomplete="off" placeholder="'+(u?'Link saved ••••'+esc(u.slice(-4)):'Paste the calendar URL')+'"><button class="btn smallbtn red" onclick="mdSave()">SAVE</button></div>'
 +(u?'<div class="gm-row"><button class="btn smallbtn" onclick="mdSync(true)">CHECK NOW</button><button class="btn smallbtn" onclick="mdForget()">REMOVE LINK</button></div>':'')+'<small id="mdStatus" class="gm-use">'+esc(S.status||'')+'</small></div></div>'}
function mdDraw(){const el=$('moodleBox');if(el)el.innerHTML=mdBoxHTML()}
function mdSave(){const v=String(($('mdUrlIn')||{}).value||'').trim();if(!/^https?:\/\/\S+/.test(v)){toast('Paste the full calendar link (it starts with https://)');return}try{localStorage.setItem('pc_moodle_url',v)}catch(e){}mdDraw();toast('Moodle link saved on this iPhone');mdSync(true)}
function mdForget(){if(!confirm('Remove the Moodle link? Tasks it already added stay.'))return;try{localStorage.removeItem('pc_moodle_url')}catch(e){}mdState().status='';save();mdDraw()}
