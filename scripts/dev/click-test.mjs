/** Dev-only: clicks every primary CTA and asserts something actually happened. */
import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const B=process.argv[2]??'http://localhost:5173';
const browser=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--hide-scrollbars']});
const results=[]; const errs=[];

async function fresh(route, seedCart=false){
  const p=await browser.newPage(); await p.setViewport({width:1440,height:900});
  p.on('pageerror',e=>errs.push('PAGEERROR '+e.message.slice(0,140)));
  p.on('console',m=>{if(m.type()==='error')errs.push('CONSOLE '+m.text().slice(0,140));});
  await p.goto(B+'/',{waitUntil:'networkidle0'});
  if(seedCart) await p.evaluate(()=>localStorage.setItem('macbite-cart-v1',JSON.stringify({state:{lines:[
    {id:'x',slug:'spicy-rice',name:'Spicy Rice',unit:'Plate',basePrice:1500,proteins:[],sides:[],qty:2,deliverable:true}],
    mode:'delivery',zoneId:'bodija'},version:1})));
  if(route!=='/') await p.goto(B+route,{waitUntil:'networkidle0'});
  await new Promise(r=>setTimeout(r,1200));
  await p.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';});
  return p;
}
const byText=(p,tag,text)=>p.evaluateHandle((tag,text)=>
  [...document.querySelectorAll(tag)].find(e=>e.textContent.trim().replace(/\s+/g,' ').includes(text)),tag,text);

async function check(label, route, tag, text, expect, seedCart=false, prep=null){
  const p=await fresh(route,seedCart);
  try{
    if (prep) { await prep(p); await new Promise(r=>setTimeout(r,700)); }
    const h=await byText(p,tag,text); const el=h.asElement();
    if(!el){ results.push([label,'NOT FOUND','']); await p.close(); return; }
    const href=await p.evaluate(e=>e.getAttribute('href')||'',el);
    if(href.startsWith('http')||href.startsWith('tel:')){
      results.push([label, expect(href)?'ok':'WRONG TARGET', href.slice(0,58)]);
    } else {
      await el.click(); await new Promise(r=>setTimeout(r,900));
      const now=await p.evaluate(()=>location.pathname);
      results.push([label, expect(now)?'ok':'NO EFFECT', now]);
    }
  }catch(e){ results.push([label,'THREW',String(e).slice(0,60)]); }
  await p.close();
}

const isWa=(h)=>h.startsWith('https://wa.me/2348165271392');

// A control with no pointer cursor reads as dead even when it takes clicks —
// Tailwind v4's Preflight drops the cursor:pointer that v3 gave buttons.
async function cursorSweep(){
  const routes=['/','/menu','/item/spicy-rice','/cart','/checkout','/contact'];
  const bad=[];
  for (const r of routes){
    const p=await fresh(r,true);
    const n=await p.evaluate(()=>[...document.querySelectorAll('button,[role=radio],[role=switch],summary')]
      .filter(e=>e.getBoundingClientRect().width>0&&!e.disabled&&getComputedStyle(e).cursor!=='pointer')
      .map(e=>(e.textContent||e.tagName).trim().slice(0,18)));
    if(n.length) bad.push(`${r}: ${[...new Set(n)].slice(0,4).join(', ')}`);
    await p.close();
  }
  results.push(['cursor affordance on buttons', bad.length?'FAIL':'ok', bad.join(' | ')]);
}
await check('hero Menu/Order','/','a','Menu / Order',(x)=>x==='/menu');
await check('hero pill: Pastries','/','a','Pastries',(x)=>x==='/menu/pastries');
await check('header Order now','/','a','Order now',(x)=>x==='/menu');
await check('footer Order on WhatsApp','/','a','Order on WhatsApp',isWa);
// The result panel (and its CTA) only renders once an area is chosen.
await check('delivery check → Start order','/','a','Start your order',(x)=>x==='/menu',false,
  async(p)=>{const h=await p.evaluateHandle(()=>[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Bodija'));await h.asElement().click();});
await check('menu tile Build it','/menu','a','Build it',(x)=>x.startsWith('/item/'));
await check('menu tile Add (drink)','/menu/drinks','button','Add',(x)=>x==='/menu/drinks');
await check('item Add to order','/item/spicy-rice','button','Add to order',(x)=>x==='/cart');
await check('cart Checkout on WhatsApp','/cart','a','Checkout on WhatsApp',(x)=>x==='/checkout',true);
await check('contact Message us','/contact','a','Message us',isWa);
await check('contact Call','/contact','a','+234 816 527 1392',(h)=>h==='tel:+2348165271392');
await check('contact Get directions','/contact','a','Get directions',(h)=>h.includes('google.com/maps'));
await check('about catering quote','/about','a','Ask for a quote',isWa);
await check('404 See the menu','/nope','a','See the menu',(x)=>x==='/menu');

await cursorSweep();

const w=Math.max(...results.map(r=>r[0].length));
for(const [l,s,d] of results) console.log(`${s==='ok'?'ok  ':'FAIL'}  ${l.padEnd(w)}  ${d}`);
console.log('\n'+results.filter(r=>r[1]!=='ok').length+' failing of '+results.length);
if(errs.length) console.log('console errors:\n  '+[...new Set(errs)].join('\n  '));
await browser.close();
