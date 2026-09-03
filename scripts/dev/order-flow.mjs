import puppeteer from 'puppeteer-core';
import { freezeClock } from './freeze-clock.mjs';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const B=process.argv[2]??'http://localhost:4180';
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--hide-scrollbars']});
const p=await b.newPage();
await p.setViewport({width:1440,height:900});
await freezeClock(p);
const errs=[]; p.on('pageerror',e=>errs.push('PAGEERROR '+e.message));
p.on('console',m=>{if(m.type()==='error')errs.push('CONSOLE '+m.text().slice(0,160));});

const click=async(sel)=>{await p.waitForSelector(sel,{visible:true,timeout:8000});await p.click(sel);await new Promise(r=>setTimeout(r,450));};
const clickText=async(tag,text)=>{
  const h=await p.evaluateHandle((tag,text)=>[...document.querySelectorAll(tag)].find(e=>e.textContent.trim().startsWith(text)),tag,text);
  const el=h.asElement(); if(!el) throw new Error('not found: '+tag+' '+text);
  await el.click(); await new Promise(r=>setTimeout(r,450));
};

// 1. Build an item on the Amala page.
await p.goto(B+'/item/amala',{waitUntil:'networkidle0'});
await clickText('button','Chicken');
await clickText('button','Goat Meat');
await clickText('button','Plantain (Dodo)');
const btnText=await p.$eval('button.w-full.justify-between',e=>e.textContent);
await p.evaluate(()=>{const i=document.querySelector('#\\32 ')||null;});
// bump qty to 2
await clickText('button','+');
const btnText2=await p.$eval('button.w-full.justify-between',e=>e.textContent);
await clickText('button','Add to order');
await p.waitForFunction(()=>location.pathname==='/cart',{timeout:8000});

// 2. Cart: pick a delivery zone.
await p.select('#zone','bodija');
await new Promise(r=>setTimeout(r,500));
const cartSummary=await p.evaluate(()=>document.querySelector('aside')?.innerText.replace(/\n+/g,' | '));

// 3. Checkout.
await clickText('a','Checkout on WhatsApp');
await p.waitForFunction(()=>location.pathname==='/checkout',{timeout:8000});
await p.type('#name','Tunde Adebayo');
await p.type('#phone','08031234567');
await p.type('#address','12 Awolowo Avenue, Old Bodija');
await p.type('#landmark','Behind the Total station');

// Capture the WhatsApp handoff instead of navigating away.
await p.evaluate(()=>{window.__opened=null;window.open=(u)=>{window.__opened=u;return {focus(){}};};});
await clickText('button','Send order on WhatsApp');
const opened=await p.evaluate(()=>window.__opened);
const confirmText=await p.evaluate(()=>document.querySelector('main')?.innerText.replace(/\n+/g,' | ').slice(0,240));

console.log('--- button before qty:',btnText);
console.log('--- button after qty :',btnText2);
console.log('--- cart summary:',cartSummary);
console.log('--- confirmation:',confirmText);
console.log('--- wa url host:',opened?opened.split('?')[0]:'NONE');
console.log('--- DECODED MESSAGE ---');
console.log(opened?decodeURIComponent(opened.split('text=')[1]):'NONE');
console.log('--- errors:',errs.length?errs.join('\n'):'none');
await b.close();
