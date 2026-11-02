// Build guided steps only from this question's bundled, verified solution. Never regenerate its numbers.
function guidedChoices(correct,alternatives){
 const wrong=[...new Set(alternatives.filter(x=>x!==correct&&!saMatch(x,correct)))].slice(0,3);
 return wrong.length>=2?shuffle([{t:correct,ok:true},...wrong.map(t=>({t,ok:false}))]):null;
}
function guidedPlan(q){
 if(q.cmd||!q.steps?.length)return null;
 const formulas=['F = m × a','a = F ÷ m','m = F ÷ a','V = I × R','I = V ÷ R','R = V ÷ I','d = m ÷ V','m = d × V','W = m × g','P = W ÷ t','KE = ½mv²','PE = mgh','W = Fd cos θ','v = u + at','s = ut + ½at²','M = n ÷ V','M₁V₁ = M₂V₂'];
 // A symbolic equation must contain no ordinary prose. Numerical setups must contain an operation.
 const symbolic=q.steps.flatMap(s=>String(s[1]||'').split(/;|,| and /)).map(x=>x.trim()).find(x=>x.includes('=')&&!/\d/.test(x)&&/^[A-Za-zΑ-ω₀-₉²³½Δθμωπ√×÷+−\-*/^=().\s]+$/u.test(x)&&!/[A-Za-z]{5}/.test(x));
 const setups=q.steps.flatMap(s=>String(s[1]||'').split('=').slice(0,-1)).map(x=>x.trim()).filter(x=>/\d/.test(x)&&/[×÷+*/−\-]/.test(x)&&/^[\d\s.()+−\-×÷*/^²³½π√]+$/u.test(x));
 const setup=setups.at(-1);if(!symbolic||!setup)return null;
 const alternatives=[setup.replace('×','+'),setup.replace('÷','×'),setup.replace('+','−'),setup.replace('−','+'),setup.replace('*','+'),setup.replace('/','*'),'('+setup+') × 2','('+setup+') ÷ 2'];
 const symbols=x=>[...new Set((x.toLowerCase().match(/[a-zα-ω]/gu)||[]))].sort().join('');
 const method=guidedChoices(symbolic,formulas.filter(f=>symbols(f)!==symbols(symbolic))),substitution=guidedChoices(setup,alternatives);
 return method&&substitution?[{label:'1 · Choose the equation',choices:method,hint:q.steps[0][0]}, {label:'2 · Substitute the numbers',choices:substitution,hint:'Match each value in the problem to its place in the equation: '+symbolic}]:null;
}
function guidedMount(card,q,opts={}){
 const answers=card.querySelector('.guided-final'),plan=guidedPlan(q);if(!answers)return {engaged:false,complete:false};
 const state={engaged:false,complete:false},panel=document.createElement('div');panel.className='guided-panel';answers.before(panel);
 let step=0,done=false;
 const finish=()=>{if(done)return;done=true;state.complete=true;state.engaged=true;answers.hidden=false;panel.innerHTML='<b>Setup complete</b><p>Now work out your answer.'+(opts.onGuided?' Finish the question for +2 Tickets.':'')+'</p>';if(opts.onGuided)opts.onGuided()};
 const draw=()=>{const s=plan[step];panel.innerHTML='<b>'+esc(s.label)+'</b><p class="small muted">Choose a setup before calculating.</p>'+s.choices.map((c,i)=>'<button type="button" class="btn guided-choice" data-i="'+i+'">'+mathHTML(c.t)+'</button>').join('')+'<button type="button" class="btn smallbtn guided-hint">Help me start</button><p class="guided-feedback" role="status"></p>';
 panel.querySelector('.guided-hint').onclick=()=>{state.engaged=true;panel.querySelector('.guided-feedback').innerHTML=mathHTML(s.hint)};
 panel.querySelectorAll('.guided-choice').forEach(b=>b.onclick=()=>{if(!panel.isConnected||done)return;state.engaged=true;const choice=s.choices[+b.dataset.i];if(!choice.ok){b.disabled=true;panel.querySelector('.guided-feedback').textContent='Try matching the operation and quantities. Use Help me start if needed.';return}step++;if(step===plan.length)finish();else draw()});
 };
 if(plan){answers.hidden=true;draw()}else{
  let hi=0;panel.innerHTML='<button type="button" class="btn smallbtn guided-start">Help me start</button><div class="guided-feedback" role="status"></div>';
  panel.querySelector('button').onclick=()=>{state.engaged=true;const hint=q.steps?.[hi]?.[0]||'Write down what is given and what you need to find. Use the hint button for the next step.';panel.querySelector('.guided-feedback').innerHTML=mathHTML(hint);if(hi<(q.steps?.length||0)-1)hi++;panel.querySelector('button').textContent='Help with the next step'};
 }
 return state;
}
// Rates apply to the acting party member, using the same max HP as combat.
function dgAnswerPolicy(r){
 const member=r?.battle&&r.party?.[r.battle.turn];if(!member)return {typedChance:.2,diyChance:0,mcOnly:false};
 const max=combatant(partyMon(member)).hp,ratio=member.hp/Math.max(1,max);
 return ratio<=.25?{typedChance:0,diyChance:0,mcOnly:true}:ratio<=.5?{typedChance:.15,diyChance:.03,mcOnly:false}:{typedChance:.4,diyChance:.12,mcOnly:false};
}
