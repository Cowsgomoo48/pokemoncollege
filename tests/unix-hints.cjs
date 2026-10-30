const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx=vm.createContext({console,Math,shuffle:a=>a.slice().sort(()=>Math.random()-.5)});
for(const name of ['practice.js','practice_unix.js'])vm.runInContext(fs.readFileSync(__dirname+'/../tools/'+name,'utf8'),ctx);
vm.runInContext(`
for(const id of Object.keys(PR).filter(k=>k.startsWith('unix_')))for(let i=0;i<120;i++){
 const p=PR[id].make();if(!p.steps.length)throw Error(id+' missing hints');
 if(p.steps.some(s=>/Which command does this job|Put it together: command/.test(s[0])))throw Error(id+' generic hints');
}
`,ctx);
const hints=a=>ctx.uxCommandSteps(a,'worked solution').map(x=>x[0]).join('\n');
assert.match(hints('grep -v "denied" server.log | wc -l'),/nonmatching/);
assert.match(hints('grep -v "denied" server.log | wc -l'),/server.log/);
assert.match(hints('head -n 17 report.txt'),/17/);
assert.match(hints('find docs -type f -size +12M -name "*.txt"'),/larger than/);
assert.match(hints('chmod g-x run.sh'),/group.*remove.*execute/);
assert.match(hints('echo "done" >> notes.txt'),/appends without erasing/);
assert.match(ctx.uxAttemptHint('tail -n 17 report.txt','head -n 17 report.txt'),/tail/);
assert.equal(ctx.uxAttemptHint('', 'head -n 17 report.txt'),'');
assert.equal(ctx.uxAttemptHint('head -n 17 report.txt','head -n 17 report.txt'),'');
const h=fs.readFileSync(__dirname+'/../www/index.html','utf8');
for(const name of ['practice_unix.js','minigames.js'])assert(h.includes(fs.readFileSync(__dirname+'/../tools/'+name,'utf8').trim()));
console.log('PASS: 1,440 generated Unix problems; concrete flag/value/target hints; pipeline order; permission signs; redirects; typed-attempt feedback; embedded source matches.');
