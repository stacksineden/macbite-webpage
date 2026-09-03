/** Dev-only: crawls every prerendered route and reports anything broken. */
import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const B=process.argv[2]??'http://localhost:4180';
const ROUTES=['/','/menu','/menu/main-dishes','/menu/swallow','/menu/proteins','/menu/sides','/menu/drinks',
 '/item/amala','/item/chicken','/item/coke','/item/spicy-rice','/about','/delivery','/contact','/cart','/checkout','/does-not-exist'];
const browser=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--hide-scrollbars']});
const problems=[];
for (const route of ROUTES) {
  const page=await browser.newPage();
  await page.setViewport({width:1280,height:900});
  const msgs=[];
  page.on('console',m=>{const t=m.text();
    if(m.type()==='error'||/hydrat|did not match|Warning:/i.test(t)) msgs.push(t.slice(0,180));});
  page.on('pageerror',e=>msgs.push('PAGEERROR '+e.message.slice(0,180)));
  page.on('requestfailed',r=>msgs.push('REQFAIL '+r.url().slice(0,120)));
  await page.goto(B+route,{waitUntil:'networkidle0',timeout:45000});
  await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';
    window.scrollTo(0,document.body.scrollHeight);});
  await new Promise(r=>setTimeout(r,1600));
  const audit=await page.evaluate(()=>{
    const hiddenReveals=[...document.querySelectorAll('[data-reveal]')]
      .filter(e=>{const r=e.getBoundingClientRect(); const cs=getComputedStyle(e);
        return r.top<innerHeight && r.bottom>0 && parseFloat(cs.opacity)<0.9;}).length;
    const imgs=[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.currentSrc||i.src);
    // Interactive controls with no accessible name. Elements deliberately
    // removed from the accessibility tree don't need one — the menu tile wraps
    // its photo in an aria-hidden, unfocusable link because the title link
    // beside it already carries the item's name.
    const unnamed=[...document.querySelectorAll('button,a')].filter(el=>{
      if (el.getAttribute('aria-hidden')==='true' && el.tabIndex===-1) return false;
      if (el.closest('[aria-hidden="true"]')) return false;
      const name=(el.textContent||'').trim()||el.getAttribute('aria-label')||el.getAttribute('title');
      return !name;}).length;
    const h1=document.querySelectorAll('h1').length;
    return {hiddenReveals,brokenImgs:imgs,unnamed,h1,title:document.title,
      canonical:document.querySelector('link[rel=canonical]')?.href,
      jsonLd:document.querySelectorAll('script[type="application/ld+json"]').length,
      desc:(document.querySelector('meta[name=description]')?.content||'').length};
  });
  const bad=[];
  if(msgs.length) bad.push('console: '+[...new Set(msgs)].join(' | '));
  if(audit.hiddenReveals) bad.push(`${audit.hiddenReveals} reveal(s) still hidden in viewport`);
  if(audit.brokenImgs.length) bad.push('broken images: '+audit.brokenImgs.join(','));
  if(audit.unnamed) bad.push(`${audit.unnamed} control(s) with no accessible name`);
  if(audit.h1!==1) bad.push(`${audit.h1} <h1> elements`);
  if(!audit.desc) bad.push('no meta description');
  problems.push([route,audit,bad]);
  await page.close();
}
for (const [route,a,bad] of problems) {
  const status=bad.length?'FAIL':'ok';
  console.log(`${status.padEnd(5)} ${route.padEnd(22)} h1:${a.h1} ld+json:${a.jsonLd} desc:${a.desc} — ${a.title.slice(0,52)}`);
  for (const b of bad) console.log('        ↳ '+b);
}
console.log('\n'+problems.filter(p=>p[2].length).length+' route(s) with problems of '+problems.length);
await browser.close();
