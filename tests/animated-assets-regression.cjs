const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.join(__dirname,'..','www');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'assets/pmd/manifest.json'),'utf8'));
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
let sheets=0;
for(const [dex,variants] of Object.entries(manifest))for(const [animation,v] of Object.entries(variants)){
 assert(['Walk','Idle'].includes(animation)); assert(v.w>0&&v.h>0&&v.frames>0&&v.rows>=4);
 assert(v.d.length===v.frames); assert(fs.existsSync(path.join(root,v.url.replace(/^\.\//,''))));sheets++;
}
assert(manifest['0801']?.Walk||manifest['0801']?.Idle,'Magearna companion missing');
assert(fs.existsSync(path.join(root,'assets/safari/grass-reveal.gif')));
assert(html.includes('safari-foreground')&&html.includes('safariRevealUntil'));
assert(!html.includes("const PMD_BASE='https://"));
assert(sheets>=200,`Only ${sheets} sprites`);
console.log(`PASS: ${Object.keys(manifest).length} species, ${sheets} animated sheets, bundled Safari foreground GIF and reveal-timing guards`);
