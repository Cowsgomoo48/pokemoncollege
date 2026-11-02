const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync('www/index.html','utf8'),manifest=JSON.parse(fs.readFileSync('www/assets/costume/rare/manifest.json','utf8'));
const registry=html.match(/const RARE_COSTUMES=(\{[\s\S]*?\});/)[1];
const helper=fs.readFileSync('tools/dungeon.js','utf8').split('\n').find(l=>l.startsWith('function dgLoadSpriteAnims('));
let mon={species:'Pawniard',costume:'masked',shiny:false};
const ctx={runOf:()=>({party:[mon]}),partyMon:m=>m,loadAnims:sp=>({base:sp}),loadRareAnims:r=>r};vm.createContext(ctx);
vm.runInContext('const RARE_COSTUMES='+registry+';function rareCostume(p){const r=RARE_COSTUMES[p.species];return r&&r.id===p.costume?r:null}'+helper,ctx);
const el={dataset:{sp:'Pawniard'},closest:()=>({dataset:{i:'0'}})};
assert.equal(ctx.dgLoadSpriteAnims(el).variant,'normal');mon.shiny=true;assert.equal(ctx.dgLoadSpriteAnims(el).variant,'shiny');
mon.species=el.dataset.sp='Bisharp';assert.equal(ctx.dgLoadSpriteAnims(el).num,'0625');assert.equal(ctx.dgLoadSpriteAnims(el).id,'masked');
el.closest=()=>null;assert.equal(ctx.dgLoadSpriteAnims(el).base,'Bisharp');
for(const num of ['0624','0625'])for(const variant of ['normal','shiny']){const animations=manifest[`masked|${num}|${variant}`];for(const key of ['Walk','Idle','Eat','Attack','Sleep']){const a=animations[key];assert.equal(a.d.length,a.frames);assert(fs.existsSync('www/'+a.url.slice(2)));}assert(fs.existsSync(`www/assets/costume/rare/masked/${num}/${variant}/portrait.png`));}
for(const file of ['dungeon.js','movefx.js'])assert(html.includes(fs.readFileSync('tools/'+file,'utf8')));
for(const s of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(s[1]);
console.log('PASS: normal/shiny costume routing, evolution continuity, enemy fallback, assets, bundled modules and script syntax');
