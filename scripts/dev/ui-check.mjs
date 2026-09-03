/** Dev-only: seeds a cart, then captures the order screens at both widths. */
import puppeteer from 'puppeteer-core';
import { mkdir } from 'node:fs/promises';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const B=process.argv[2]??'http://localhost:4180';
const OUT=process.argv[3]??'shots';
await mkdir(OUT,{recursive:true});
const browser=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--hide-scrollbars']});
const errs=[];
const SEED={state:{lines:[
 {id:'amala|||chicken:Large+goat-meat:|plantain-dodo||',slug:'amala',name:'Amala',unit:'Wrap',basePrice:500,
  proteins:[{slug:'chicken',name:'Chicken',variantLabel:'Large',price:3500},{slug:'goat-meat',name:'Goat Meat',price:1500}],
  sides:[{slug:'plantain-dodo',name:'Plantain (Dodo)',price:700}],note:'Less pepper please',qty:2,deliverable:true},
 {id:'coke',slug:'coke',name:'Coke',unit:'PET',basePrice:800,proteins:[],sides:[],qty:3,deliverable:true}
],mode:'delivery',zoneId:'bodija'},version:1};

for (const [name,w,h] of [['mobile',390,844],['desktop',1440,900]]) {
  const page=await browser.newPage();
  page.on('pageerror',e=>errs.push(`${name} PAGEERROR ${e.message}`));
  page.on('console',m=>{if(m.type()==='error')errs.push(`${name} ${m.text().slice(0,140)}`);});
  await page.setViewport({width:w,height:h});
  await page.goto(B+'/',{waitUntil:'networkidle0'});
  await page.evaluate((s)=>localStorage.setItem('macbite-cart-v1',JSON.stringify(s)),SEED);
  for (const route of ['/cart','/checkout']) {
    await page.goto(B+route,{waitUntil:'networkidle0'});
    await new Promise(r=>setTimeout(r,1200));
    await page.screenshot({path:`${OUT}/${route.slice(1)}.${name}.png`,fullPage:true,captureBeyondViewport:true});
  }
  // Homepage with a live cart, to catch the sticky order bar.
  await page.goto(B+'/',{waitUntil:'networkidle0'});
  await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,1200);});
  await new Promise(r=>setTimeout(r,1200));
  await page.screenshot({path:`${OUT}/orderbar.${name}.png`});
  if (name==='mobile') {
    await page.evaluate(()=>window.scrollTo(0,0));
    await new Promise(r=>setTimeout(r,600));
    await page.click('button[aria-label="Open menu"]');
    await new Promise(r=>setTimeout(r,900));
    await page.screenshot({path:`${OUT}/navsheet.mobile.png`});
  }
  await page.close();
}
console.log(errs.length?'ERRORS:\n'+[...new Set(errs)].join('\n'):'no console errors');
await browser.close();
