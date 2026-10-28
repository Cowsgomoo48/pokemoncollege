// ===================== PRACTICE PROBLEMS · Unix command line =====================
// Command-line problems for study sets about Unix/Linux: navigating, viewing files, permissions, find, grep, pipes,
// regex, wildcards and the everyday commands. File names, folders, users and numbers are random every time.
// Commands are shown in `backticks` (drawn as code, never as maths). Typed answers are checked exactly (capitals and
// options matter), but quotes around plain words, extra spaces and the order of find's options don't.
const UX={files:['notes.txt','report.txt','log.txt','data.csv','todo.md','server.log','grades.txt','names.txt','errors.log','list.txt'],dirs:['docs','logs','src','projects','backup','scripts','reports','music'],
 users:['bob','alice','sam','kim','maria','dev'],groups:['staff','students','admin','dev'],words:['error','warning','TODO','failed','admin','login','report','denied','timeout'],scripts:['foo.sh','run.sh','build.sh','backup.sh','start.sh','clean.sh']};
const uxC=s=>'`'+s+'`';
function prCmd(id,name,kw,make){prDef(id,'Unix / command line',name,kw,make);PR[id].cmd=true}
// one command question: answer, three wrong commands, a short explanation, other accepted forms
function uxQ(q,a,wrong,why,alts){const p=prMC(q,uxC(a),wrong.map(uxC),k=>uxC(a+' '+'?'.repeat(k+1)),why,[['Which command does this job? Then which option, and what comes last (the file or folder)?',why],['Put it together: command, options, then the target.','Answer: '+uxC(a)]]);p.alts=alts||[];return p}
// typed commands: same text after tidying spaces and quotes (iPhone smart quotes and dashes too)
function uxNorm(s){return String(s==null?'':s).replace(/`/g,'').replace(/[“”„]/g,'"').replace(/[‘’']/g,'"').replace(/[—–]/g,'--').trim().replace(/\s+/g,' ').replace(/ ?\| ?/g,' | ').replace(/"([^"\s|*?^$\[\]\\{}()]+)"/g,'$1')}
function cmdMatch(user,answers){const u=uxNorm(user);return !!u&&answers.some(a=>uxNorm(a)===u)}
const uxPerms=(p,r)=>p.length<2?[p]:p.flatMap((x,i)=>uxPerms(p.slice(0,i).concat(p.slice(i+1))).map(t=>[x,...t]));
const uxOct=s=>[0,3,6].map(i=>(s[i]==='r'?4:0)+(s[i+1]==='w'?2:0)+(s[i+2]==='x'?1:0)).join('');
const uxStr=d=>String(d).split('').map(n=>{n=+n;return (n&4?'r':'-')+(n&2?'w':'-')+(n&1?'x':'-')}).join('');

prCmd('unix_nav','Navigating and listing (cd, ls, pwd, cat)',/\bcd\s+(path|\.\.|~|\w)|\bls\s+-[la]|\bpwd\b|hidden files?|relative (path|from)|absolute (path|vs)/i,()=>{
 const d=prPick(UX.dirs),f=prPick(UX.files),h='.'+prPick(['secret','config','hidden','env','profile']);
 const T=prPick([
  ['List everything in the current folder, including hidden files.','ls -a',['ls -l','ls','ls -h'],'`ls -a` shows all entries, including names that start with a dot.'],
  ['List the current folder with details (permissions, owner, size, date).','ls -l',['ls -a','ls -d','cat -l'],'`ls -l` is the long listing: permissions, owner, group, size and date.'],
  ['Move into the folder '+d+', which is inside the folder you’re in now.','cd '+d,['ls '+d,'cd /'+d,'pwd '+d],'`cd PATH` changes folder. Without a leading `/` the path is relative to where you are.',['cd ./'+d,'cd '+d+'/']],
  ['Go up to the parent folder.','cd ..',['cd .','cd ~','cd /'],'`..` means the parent folder and `.` the current one.',['cd ../']],
  ['Print the full path of the folder you’re in.','pwd',['cd','ls -l','whoami'],'`pwd` prints the working directory.'],
  ['Go to your home folder.','cd ~',['cd /','cd ..','cd .'],'`~` is your home folder (plain `cd` goes there too).',['cd','cd ~/']],
  ['Show the contents of the hidden file '+h+' inside the folder '+d+'.','cat '+d+'/'+h,['cat '+d+'/'+h.slice(1),'ls -a '+d,'cat '+h],'Hidden files start with a dot. Give the path to it: folder/.name.',['cat ./'+d+'/'+h]],
  ['Print the whole file '+f+'.','cat '+f,['less -a '+f,'ls '+f,'wc '+f],'`cat` prints a whole file.']]);
 return uxQ(T[0],T[1],T[2],T[3],T[4])});

prCmd('unix_view','Viewing and counting (wc, head, tail, less, fold)',/\bwc\s+-[lcw]|\bfold\b|\bhead\b|\btail\b|\bless\s+\w|count (the )?(lines|characters)/i,()=>{
 const f=prPick(UX.files),n=prR(3,20),w=prPick([20,30,40,60,80]);
 const T=prPick([
  ['Count the lines in '+f+'.','wc -l '+f,['wc -c '+f,'wc -w '+f,'grep -c '+f],'`wc -l` counts lines, `-c` counts characters (bytes), `-w` counts words.'],
  ['Count the characters in '+f+'.','wc -c '+f,['wc -l '+f,'wc -w '+f,'fold -c '+f],'`wc -c` counts characters (bytes), `-l` lines.',['wc -m '+f]],
  ['Show the first '+n+' lines of '+f+'.','head -n '+n+' '+f,['tail -n '+n+' '+f,'head -c '+n+' '+f,'less -n '+n+' '+f],'`head` shows the start of a file and `tail` the end. `-n` sets how many lines.',['head -'+n+' '+f]],
  ['Show the last '+n+' lines of '+f+'.','tail -n '+n+' '+f,['head -n '+n+' '+f,'tail -c '+n+' '+f,'tail -l '+n+' '+f],'`tail` shows the end of a file. `-n` sets how many lines.',['tail -'+n+' '+f]],
  ['Wrap the lines of '+f+' so none is longer than '+w+' characters.','fold -w '+w+' '+f,['fold -c '+w+' '+f,'wc -w '+w+' '+f,'fold '+w+' '+f],'`fold -w n` wraps lines at n characters.'],
  ['Page through '+f+' one screen at a time.','less '+f,['cat '+f,'head '+f,'wc '+f],'`less` shows a file a page at a time (q quits).',['more '+f]]]);
 return uxQ(T[0],T[1],T[2],T[3],T[4])});

prCmd('unix_chmod','Permissions with chmod (u/g/o, +/−, r/w/x) and running scripts',/chmod\s+[ugoa]*[+-][rwx]|\bchmod\b|executable|\.\/\w+\.sh|\bsudo\b/i,()=>{
 const f=prPick(UX.files.concat(UX.scripts)),s=prPick(UX.scripts),d=prPick(UX.dirs);
 if(Math.random()<.25){const T=prPick([
   ['Run the script '+s+', which is in the folder you’re in now.','./'+s,[s,'run '+s,'cd '+s],'To run a file in the current folder, start with `./`.'],
   ['Run the script '+s+' in the folder '+d+' (inside the folder you’re in now).','./'+d+'/'+s,['./'+s,'cd '+d+'/'+s,d+'./'+s],'Give the path to it: `./REL/PATH/file` (or the full `/ABS/PATH/file`).',[d+'/'+s]],
   ['Run apt update with administrator privileges.','sudo apt update',['apt update sudo','su apt update','chmod +x apt update'],'Put `sudo` in front of a command to run it as an administrator.']]);return uxQ(T[0],T[1],T[2],T[3],T[4])}
 const who=prPick(['u','g','o','a']),perm=prPick(['r','w','x']),op=Math.random()<.75?'+':'-';
 const W={u:'you (the owner)',g:'its group',o:'everyone else (others)',a:'everyone'},P={r:'readable',w:'writable',x:'executable'};
 const a='chmod '+who+op+perm+' '+f,swapW=prPick(['u','g','o','a'].filter(x=>x!==who)),swapP=prPick(['r','w','x'].filter(x=>x!==perm));
 return uxQ('Make '+f+' '+(op==='+'?'':'no longer ')+P[perm]+' by '+W[who]+'.',a,['chmod '+swapW+op+perm+' '+f,'chmod '+who+op+swapP+' '+f,'chmod '+who+(op==='+'?'-':'+')+perm+' '+f],
  '`u` = owner, `g` = group, `o` = others, `a` = everyone. `+` adds a permission and `-` takes it away. `r` read, `w` write, `x` execute.',who==='a'?['chmod '+op+perm+' '+f]:[])});

prCmd('unix_octal','Octal permissions (chmod 755, reading -rwxr-xr-x)',/chmod\s+[0-7]{3}|octal|rwx|-rw|ls -l output|permissions? (string|number)/i,()=>{
 const f=prPick(UX.files),D=[7,6,5,4,0],o=[prPick([7,6]),prPick(D),prPick(D)].join(''),str=uxStr(o),k=Math.random();
 const flip=o.split('').map(n=>{n=+n;return (n&4?1:0)+(n&2?2:0)+(n&1?4:0)}).join(''),rev=o.split('').reverse().join('');
 const desc=s=>['owner','group','others'].map((w,i)=>w+' '+s.slice(i*3,i*3+3)).join(', ');
 if(k<.4)return uxQ('Give '+f+' these permissions: '+desc(str)+'. Which command does it with numbers?','chmod '+o+' '+f,['chmod '+(rev===o?flip:rev)+' '+f,'chmod '+flip+' '+f,'chmod '+str+' '+f].filter((x,i,a)=>x!=='chmod '+o+' '+f&&a.indexOf(x)===i).concat(['chmod +'+o+' '+f]).slice(0,3),
  'r = 4, w = 2, x = 1. Add them for each group: owner, group, others.');
 if(k<.75){const p=prMC(uxC('ls -l')+' shows '+uxC('-'+str)+' for '+f+'. What’s that in octal?',o,[rev,flip,String(+o[0]+1).slice(-1)+o.slice(1)],j=>prNear(+o,j,x=>String(x).padStart(3,'0')),'r = 4, w = 2, x = 1. Each group of three letters adds up to one digit: owner, group, others.',[['Split '+uxC(str)+' into three groups of three (skip the first character, it’s the file type).',str.slice(0,3)+' | '+str.slice(3,6)+' | '+str.slice(6)],['Add r = 4, w = 2, x = 1 in each group.','Answer: '+o]]);p.alts=[];return p}
 const p=prMC('After '+uxC('chmod '+o+' '+f)+', what does '+uxC('ls -l')+' show for its permissions?','-'+str,['-'+uxStr(rev===o?flip:rev),'-'+uxStr(flip),'-'+str.split('').reverse().join('')],j=>'-'+uxStr(String((+o+j+1)%800).padStart(3,'0')),'Each digit is owner, group, others; 4 = r, 2 = w, 1 = x.',[['Turn each digit into three letters: 4 → r, 2 → w, 1 → x (add up the ones that fit).',o.split('').map(n=>n+' → '+uxStr(n)).join(', ')],['Put them together after the file-type dash.','Answer: -'+str]]);p.alts=[];return p});

prCmd('unix_find','Finding files with find (-type, -name, -user, -size, -ctime, -perm)',/\bfind\s+(\.|~|\/|start)|-type [fd]|-ctime|-mtime|-perm\b|-size [+-]?\d|-name ["']?\*/i,()=>{
 const start=prPick(['.','~','docs','/var/log','/home/'+prPick(UX.users)]),u=prPick(UX.users),g=prPick(UX.groups),n=prR(2,30),days=prR(2,14),unit=prPick([['c','bytes'],['k','kilobytes'],['M','megabytes']]),pm=prPick(['640','644','755','600','777','000']);
 const pat=prPick([['"*.txt"','ending in .txt'],['"report*"','starting with “report”'],['"*.sh"','ending in .sh'],['"*log*"','containing “log”'],['"a*"','starting with “a”']]);
 const type=Math.random()<.75?['-type f','regular files']:['-type d','folders'];
 const pool=shuffle([['-name '+pat[0],'named '+pat[1]],['-user '+u,'owned by '+u],['-group '+g,'belonging to the group '+g],
  ...[['+','larger than'],['-','smaller than'],['','exactly']].filter(()=>Math.random()<.34).slice(0,1).map(([s,w])=>['-size '+s+n+unit[0],w+' '+n+' '+unit[1]]),
  ...[['+','more than'],['-','less than']].filter(()=>Math.random()<.5).slice(0,1).map(([s,w])=>['-ctime '+s+days,'changed '+w+' '+days+' days ago']),['-perm '+pm,'with permissions exactly '+pm]]).slice(0,prR(1,2));
 const opts=[type,...pool],a='find '+start+' '+opts.map(o=>o[0]).join(' '),q='Find all '+type[1]+' under '+({'.':'the current folder (.)','~':'your home folder (~)'}[start]||start)+' '+pool.map(o=>o[1]).join(' and ')+'.';
 const mut=o=>o.replace(/-size \+/,'-size -').replace(/-ctime \+/,'-ctime -').replace(/-type f/,'-type d').replace(/-user /,'-group ').replace(/-name /,'-regex ');
 const wrong=['find '+start+' '+opts.map(o=>mut(o[0])).join(' '),'find '+opts.map(o=>o[0]).join(' ')+' '+start,'grep -r '+start+' '+opts.map(o=>o[0]).join(' '),'find '+start+' '+opts.slice(1).map(o=>o[0]).join(' ')].filter(x=>x!==a);
 const alts=uxPerms(opts.map(o=>o[0])).map(p=>'find '+start+' '+p.join(' ')).concat(uxPerms(opts.map(o=>o[0])).map(p=>'find '+start+' '+p.join(' ').replace('-user ','-owner ')));
 return uxQ(q,a,wrong.slice(0,3),'`find START` then one option per condition. `-type f` is files and `-type d` folders. `-size +N` means larger and `-N` smaller (c = bytes, k = KB, M = MB). `-ctime +n` means more than n days ago and `-n` less. Options can go in any order.',alts)});

prCmd('unix_grep','Searching inside files with grep (-v, -c, -i, -n, -l, -r, -F, ^ $)',/\bgrep\b/i,()=>{
 const w=prPick(UX.words),f=prPick(UX.files),d=prPick(UX.dirs);
 const T=prPick([
  ['Show the lines of '+f+' that contain “'+w+'”.','grep "'+w+'" '+f,['grep -v "'+w+'" '+f,'grep -c "'+w+'" '+f,'find "'+w+'" '+f],'`grep "REGEX" file` keeps the matching lines.'],
  ['Show the lines of '+f+' that do NOT contain “'+w+'”.','grep -v "'+w+'" '+f,['grep "'+w+'" '+f,'grep -c "'+w+'" '+f,'grep -n "'+w+'" '+f],'`-v` flips grep: it keeps the lines that don’t match.'],
  ['Count how many lines of '+f+' contain “'+w+'”.','grep -c "'+w+'" '+f,['wc -l '+f,'grep -n "'+w+'" '+f,'grep -v "'+w+'" '+f],'`-c` prints the number of matching lines instead of the lines.',['grep "'+w+'" '+f+' | wc -l']],
  ['Show the lines of '+f+' that contain “'+w+'”, ignoring capital letters.','grep -i "'+w+'" '+f,['grep -c "'+w+'" '+f,'grep -I "'+w+'" '+f,'grep -v "'+w+'" '+f],'`-i` ignores case.'],
  ['Show the lines of '+f+' containing “'+w+'”, with their line numbers.','grep -n "'+w+'" '+f,['grep -c "'+w+'" '+f,'grep -l "'+w+'" '+f,'wc -l "'+w+'" '+f],'`-n` puts the line number in front of each match.'],
  ['List the files in the folder '+d+' that contain “'+w+'” (names only).','grep -l "'+w+'" '+d+'/*',['grep -c "'+w+'" '+d+'/*','grep -n "'+w+'" '+d+'/*','ls -l "'+w+'" '+d+'/*'],'`-l` lists the names of the files that have a match.',['grep -rl "'+w+'" '+d,'grep -lr "'+w+'" '+d,'grep -r -l "'+w+'" '+d,'grep -l -r "'+w+'" '+d]],
  ['Search every file in the folder '+d+' (and its subfolders) for “'+w+'”.','grep -r "'+w+'" '+d,['grep -v "'+w+'" '+d,'grep -l "'+w+'" '+d,'find -r "'+w+'" '+d],'`-r` searches folders recursively.',['grep -R "'+w+'" '+d]],
  ['Show the lines of '+f+' that start with “'+w+'”.','grep "^'+w+'" '+f,['grep "'+w+'$" '+f,'grep "'+w+'" '+f,'grep -v "^'+w+'" '+f],'`^` anchors the pattern to the start of the line.'],
  ['Show the lines of '+f+' that end with “'+w+'”.','grep "'+w+'$" '+f,['grep "^'+w+'" '+f,'grep "$'+w+'" '+f,'grep "'+w+'" '+f],'`$` anchors the pattern to the end of the line.'],
  ['Show the lines of '+f+' that contain a digit.','grep "[0-9]" '+f,['grep "0-9" '+f,'grep "[a-z]" '+f,'grep -c "[0-9]" '+f],'`[0-9]` matches any one digit.'],
  ['Find the literal text “['+w+']” (with the brackets) in '+f+'.','grep -F "['+w+']" '+f,['grep "['+w+']" '+f,'grep -v "['+w+']" '+f,'grep -c "['+w+']" '+f],'Brackets mean “any one of” in a regex. `-F` searches for the text exactly as written.'],
  ['Show the lines containing “'+w+'” in '+f+', with the file name in front of each.','grep -H "'+w+'" '+f,['grep -l "'+w+'" '+f,'grep -n "'+w+'" '+f,'grep -h "'+w+'" '+f],'`-H` prints the file name with each match.']]);
 return uxQ(T[0],T[1],T[2],T[3],T[4])});

prCmd('unix_pipe','Pipes: grep, sort, uniq and wc together',/\|\s*(sort|uniq|wc)|\bsort\b|\buniq\b|pipes?\b/i,()=>{
 const w=prPick(UX.words),f=prPick(UX.files);
 if(Math.random()<.2){const p=prMC('Why does '+uxC('sort')+' usually come before '+uxC('uniq')+' in a pipe?','uniq only removes duplicates that are next to each other',['uniq only works on numbers','sort removes the duplicates by itself','uniq has to read a file, not a pipe'],j=>'uniq needs option -'+'abcdefgh'[j],'`uniq` only catches repeated lines sitting next to each other, so `sort` puts the copies together first.',[['What does uniq look at when it decides a line is a duplicate?','Only the line right before it.'],['So what has to happen to the copies first?','Sort them so they sit together.']]);p.alts=[];return p}
 const T=prPick([
  ['How many lines of '+f+' contain “'+w+'”? Use a pipe.','grep "'+w+'" '+f+' | wc -l',['grep "'+w+'" | wc -l '+f,'wc -l '+f+' | grep "'+w+'"','grep -v "'+w+'" '+f+' | wc -l'],'Pipes run left to right: grep keeps the matching lines, then `wc -l` counts them.',['grep -c "'+w+'" '+f]],
  ['Count the lines of '+f+' that don’t contain “'+w+'”.','grep -v "'+w+'" '+f+' | wc -l',['grep "'+w+'" '+f+' | wc -l','grep -v "'+w+'" '+f+' | wc -c','wc -l '+f+' | grep -v "'+w+'"'],'`grep -v` keeps the non-matching lines, then `wc -l` counts them.',['grep -vc "'+w+'" '+f,'grep -cv "'+w+'" '+f,'grep -c -v "'+w+'" '+f,'grep -v -c "'+w+'" '+f]],
  ['Show the lines of '+f+' sorted, with duplicate lines removed.','sort '+f+' | uniq',['uniq '+f+' | sort','sort '+f+' | uniq -u','uniq '+f],'Sort first so copies sit together, then `uniq` drops the repeats.',['sort -u '+f]],
  ['How many different lines does '+f+' have?','sort '+f+' | uniq | wc -l',['uniq '+f+' | wc -l','sort '+f+' | wc -l','sort '+f+' | uniq -u | wc -l'],'Sort, remove repeats with `uniq`, then count with `wc -l`.',['sort -u '+f+' | wc -l']],
  ['Show only the lines that appear exactly once in '+f+'.','sort '+f+' | uniq -u',['uniq -u '+f,'sort -u '+f,'sort '+f+' | uniq'],'`uniq -u` keeps lines with no copies, but only if the input is sorted first.'],
  ['How many lines containing “'+w+'” appear only once in '+f+'?','grep "'+w+'" '+f+' | sort | uniq -u | wc -l',['grep "'+w+'" '+f+' | uniq -u | wc -l','grep "'+w+'" '+f+' | sort | uniq | wc -l','sort '+f+' | uniq -u | grep "'+w+'"'],'Filter with grep, sort so copies sit together, keep the single ones with `uniq -u`, then count.']]);
 return uxQ(T[0],T[1],T[2],T[3],T[4])});

prCmd('unix_regex','Reading regex patterns (. .* ^ $ [0-9])',/regex|\.\*|"\^|\$"|\[0-9\]/i,()=>{
 const pool=['cat','cart','coat','scat','act','car','cab','bat','boat','bet','abc','a1c','at','cut','cot','chat','tact','ace','a7c','art'];
 const P=prPick([['^c','starts with c'],['t$','ends with t'],['^c.t$','is c, one character, then t'],['a.c','has a, any one character, then c'],['^b.*t$','starts with b and ends with t'],['[0-9]','has a digit'],['^a','starts with a'],['^ca','starts with ca']]),re=new RegExp(P[0]);
 const yes=shuffle(pool.filter(x=>re.test(x))),no=shuffle(pool.filter(x=>!re.test(x)));if(!yes.length||no.length<3)throw 0;
 const p=prMC('Which word is matched by '+uxC('grep "'+P[0]+'"')+'?',yes[0],no.slice(0,3),j=>no[(j+3)%no.length],'The pattern '+uxC('"'+P[0]+'"')+' means the line '+P[1]+'. `.` is exactly one character, `.*` is any number, `^` is the start and `$` the end.',[['Read the pattern piece by piece: ^ = start, $ = end, . = any one character, .* = anything.','This pattern: the line '+P[1]+'.'],['Check each choice against that.','Answer: '+yes[0]]]);p.alts=[];return p});

prCmd('unix_glob','Wildcards (* and ?) in file names',/wildcard|\*\s*(as a|matches)|"\*"|\*\.\w+|\?\s*(matches|wildcard)/i,()=>{
 const names=['report.txt','report1.txt','report.csv','notes.txt','reports.md','rep.txt','data1.csv','data22.csv','cat.sh','bat.sh','chat.sh','a.txt','ab.txt','log.old'];
 const G=prPick(['*.txt','report*','*.csv','?at.sh','data?.csv','*.sh','a?.txt','rep*.txt']),re=new RegExp('^'+G.replace(/\./g,'\\.').replace(/\*/g,'.*').replace(/\?/g,'.')+'$');
 const yes=shuffle(names.filter(x=>re.test(x))),no=shuffle(names.filter(x=>!re.test(x)));if(!yes.length||no.length<3)throw 0;
 const p=prMC('Which file does '+uxC('ls '+G)+' list?',yes[0],no.slice(0,3),j=>no[(j+3)%no.length],'`*` matches any run of characters (even none) and `?` matches exactly one.',[['Line the pattern up with each name: * can stretch, ? is exactly one character, and everything else must match exactly.','Pattern: '+uxC(G)],['Which name fits all of it?','Answer: '+yes[0]]]);p.alts=[];return p});

prCmd('unix_exec','Acting on what find finds (-exec … {} \\;)',/-exec\b|\{\}\s*\\;/i,()=>{
 const d=prPick(UX.dirs),pat=prPick(['"*.sh"','"*.txt"','"*.log"']),act=prPick([['chmod +r {}','make every one readable'],['chmod +x {}','make every one executable'],['cat {}','print every one'],['rm {}','delete every one']]);
 const a='find '+d+' -name '+pat+' -exec '+act[0]+' \\;';
 return uxQ('Find the files named '+pat.replace(/"/g,'')+' under '+d+' and '+act[1]+'.',a,['find '+d+' -name '+pat+' -exec '+act[0],'find '+d+' -name '+pat+' | '+act[0].replace(' {}',''),'find '+d+' -name '+pat+' -exec '+act[0].replace(' {}','')+' \\;'],'`-exec CMD {} \\;` runs CMD on each file found; `{}` stands for the file and `\\;` ends the command.',['find '+d+' -name '+pat+' -exec '+act[0]+' ";"'])});

prCmd('unix_basics','Everyday commands (cp, mv, rm, mkdir, touch, >, >>, chown, man, echo, whoami)',/\bcp\b|\bmv\b|\brm\b|\bmkdir\b|\btouch\b|\bchown\b|>>|\bman\s+\w|\bwhoami\b|\becho\b|redirect/i,()=>{
 const f=prPick(UX.files),g=prPick(UX.files.filter(x=>x!==f)),d=prPick(UX.dirs),u=prPick(UX.users),c=prPick(['grep','find','chmod','ls','sort']);
 const T=prPick([
  ['Copy '+f+' into the folder '+d+'.','cp '+f+' '+d,['mv '+f+' '+d,'cp '+d+' '+f,'cat '+f+' '+d],'`cp SOURCE DEST` copies; `mv` moves (or renames).',['cp '+f+' '+d+'/','cp '+f+' ./'+d]],
  ['Rename '+f+' to '+g+'.','mv '+f+' '+g,['cp '+f+' '+g,'mv '+g+' '+f,'rename '+f],'`mv OLD NEW` renames a file.'],
  ['Delete the file '+f+'.','rm '+f,['rmdir '+f,'del '+f,'mv '+f],'`rm` removes files (`rmdir` removes empty folders).'],
  ['Make a new folder called '+d+'.','mkdir '+d,['touch '+d,'cd '+d,'mkfile '+d],'`mkdir` makes a folder; `touch` makes an empty file.'],
  ['Make a new, empty file called '+f+'.','touch '+f,['mkdir '+f,'cat '+f,'echo '+f],'`touch` makes an empty file (or updates its date).',['> '+f]],
  ['Save the output of '+uxC('ls -l')+' into '+f+', replacing what’s there.','ls -l > '+f,['ls -l >> '+f,'ls -l | '+f,'ls -l < '+f],'`>` overwrites a file and `>>` adds to the end.'],
  ['Add the line “done” to the end of '+f+' without erasing it.','echo "done" >> '+f,['echo "done" > '+f,'echo "done" | '+f,'cat "done" >> '+f],'`>>` appends; `>` would erase the file first.'],
  ['Make '+u+' the owner of '+f+'.','chown '+u+' '+f,['chmod '+u+' '+f,'chown '+f+' '+u,'sudo '+u+' '+f],'`chown USER file` changes who owns a file (`chmod` changes permissions).'],
  ['Open the manual page for '+c+'.','man '+c,[c+' -h','help '+c,'less '+c],'`man COMMAND` shows the manual (`COMMAND --help` gives a short summary).'],
  ['Print your username.','whoami',['pwd','echo','id -g'],'`whoami` prints the user you’re logged in as.']]);
 return uxQ(T[0],T[1],T[2],T[3],T[4])});
