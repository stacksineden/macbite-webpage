/** Dev-only: exercises the cart's business rules through the real UI. */
import puppeteer from 'puppeteer-core';
import { freezeClock } from './freeze-clock.mjs';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const B=process.argv[2]??'http://localhost:4180';
const browser=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--hide-scrollbars']});

const seed=(lines,mode,zoneId)=>({state:{lines,mode,zoneId},version:1});
const line=(o)=>({proteins:[],sides:[],qty:1,deliverable:true,...o});

const CASES=[
  ['coleslaw + delivery → blocked',
    seed([line({id:'a',slug:'coleslaw',name:'Coleslaw',unit:'Portion',basePrice:700,qty:4,deliverable:false})],'delivery','bodija')],
  ['coleslaw + pickup → allowed',
    seed([line({id:'a',slug:'coleslaw',name:'Coleslaw',unit:'Portion',basePrice:700,qty:4,deliverable:false})],'pickup',null)],
  ['below ₦2,000 minimum + delivery → blocked',
    seed([line({id:'b',slug:'coke',name:'Coke',unit:'PET',basePrice:800})],'delivery','bodija')],
  ['below minimum but pickup → allowed',
    seed([line({id:'b',slug:'coke',name:'Coke',unit:'PET',basePrice:800})],'pickup',null)],
  ['delivery with no area chosen → blocked',
    seed([line({id:'c',slug:'coke',name:'Coke',unit:'PET',basePrice:800,qty:5})],'delivery',null)],
  ['unpriced item → total quoted on WhatsApp',
    seed([line({id:'d',slug:'amala',name:'Amala',unit:'Wrap',basePrice:null,qty:2})],'pickup',null)],
];

for (const [label,state] of CASES) {
  const page=await browser.newPage();
  await page.setViewport({width:1280,height:900});
  await freezeClock(page);
  await page.goto(B+'/',{waitUntil:'domcontentloaded'});
  await page.evaluate((s)=>localStorage.setItem('macbite-cart-v1',JSON.stringify(s)),state);
  await page.goto(B+'/cart',{waitUntil:'networkidle0'});
  await new Promise(r=>setTimeout(r,900));
  const r=await page.evaluate(()=>{
    const cta=[...document.querySelectorAll('a')].find(a=>a.textContent.includes('Checkout on WhatsApp'));
    const aside=document.querySelector('aside');
    const notices=[...aside.querySelectorAll('p')].map(p=>p.textContent.trim())
      .filter(t=>/Add ₦|travel|closes|indicative/.test(t));
    const total=[...aside.querySelectorAll('dd')].pop()?.textContent.trim();
    return {blocked:cta?.getAttribute('aria-disabled')==='true',notices,total};
  });
  console.log(`${r.blocked?'BLOCKED':'allowed'}  ${label}`);
  console.log(`         total=${r.total}${r.notices.length?'  | '+r.notices.filter(n=>!/indicative/.test(n)).join(' ~ '):''}`);
  await page.close();
}
await browser.close();
