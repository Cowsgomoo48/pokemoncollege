// Size generated artwork for the app without changing its design or transparency.
// Original generation prompts are in icons_prompts.json.
const fs=require('fs'),path=require('path'),sharp=require('sharp');
(async()=>{const root=path.resolve(__dirname,'..'),config=JSON.parse(fs.readFileSync(path.join(__dirname,'icons_prompts.json')));let count=0;
for(const name of [...Object.keys(config),'elite_skull']){const file=path.join(root,'www/assets/ico',name+'.png');if(!fs.existsSync(file))continue;const m=await sharp(file).metadata();const size=name==='elite_skull'?512:256;if(m.width<=size&&m.height<=size)continue;const bytes=await sharp(file).resize({width:size,height:size,fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).png({compressionLevel:9}).toBuffer();fs.writeFileSync(file,bytes);count++}console.log('Prepared',count,'icons');})().catch(e=>{console.error(e);process.exitCode=1});
