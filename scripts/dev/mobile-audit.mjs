/** Dev-only: hunts for overflow and cramped controls at phone widths. */
import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const B=process.argv[2]??'http://localhost:5173';
const WIDTHS=[320,360,390,430,768,1280,1440];
const ROUTES=['/','/menu','/menu/main-dishes','/menu/drinks','/item/amala','/item/chicken','/cart','/checkout','/delivery','/about','/contact'];
const browser=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--hide-scrollbars']});
let bad=0;
for (const w of WIDTHS) {
  const page=await browser.newPage();
  await page.setViewport({width:w,height:844,isMobile:true,hasTouch:true,deviceScaleFactor:2});
  for (const route of ROUTES) {
    await page.goto(B+route,{waitUntil:'networkidle0',timeout:45000});
    await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,document.body.scrollHeight);});
    await new Promise(r=>setTimeout(r,900));
    const issues=await page.evaluate(()=>{
      const out=[];
      // Under mobile emulation the layout viewport is a few px wider than
      // clientWidth; take the larger so fixed elements aren't false-flagged.
      const vw=Math.max(document.documentElement.clientWidth, window.innerWidth);
      // scrollWidth over-reports by a few px under Chrome's mobile emulation,
      // so test whether the page can actually be scrolled sideways.
      const before=window.scrollX; window.scrollTo(9999,window.scrollY);
      const moved=Math.round(window.scrollX); window.scrollTo(before,window.scrollY);
      if (moved>0) out.push(`page scrolls horizontally by ${moved}px`);
      // Anything painting outside the viewport.
      for (const el of document.querySelectorAll('body *')) {
        const r=el.getBoundingClientRect();
        if (r.width===0||r.height===0) continue;
        const cs=getComputedStyle(el);
        if (cs.position==='fixed') continue;
        if (r.right>vw+1 || r.left<-1) {
          // ignore deliberate horizontal scrollers and their children
          let p=el, scroller=false;
          while(p&&p!==document.body){ const ox=getComputedStyle(p).overflowX; if(/auto|scroll|hidden|clip/.test(ox)){scroller=true;break;} p=p.parentElement; }
          if (!scroller) out.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0,34)} → right ${Math.round(r.right)} > ${vw}`);
        }
      }
      // Content escaping its own card.
      for (const card of document.querySelectorAll('article')) {
        const cr=card.getBoundingClientRect();
        for (const kid of card.querySelectorAll('a,button,p,h3')) {
          const k=kid.getBoundingClientRect();
          if (k.right>cr.right+1) out.push(`card content escapes: ${kid.textContent.trim().slice(0,22)}`);
        }
      }
      // Wrapped nav pills. A pill markedly taller than its siblings has broken
      // its label across lines, which also splits its rounded background.
      for (const nav of document.querySelectorAll('nav')) {
        const links=[...nav.querySelectorAll('a')].filter(a=>a.getBoundingClientRect().height>0);
        if (links.length<3) continue;
        const hs=links.map(a=>a.getBoundingClientRect().height).sort((x,y)=>x-y);
        const median=hs[Math.floor(hs.length/2)];
        const wrapped=links.filter(a=>a.getBoundingClientRect().height>median*1.4)
          .map(a=>a.textContent.trim().slice(0,18));
        if (wrapped.length) out.push(`nav label wraps inside its pill: ${wrapped.join(', ')}`);
      }

      // Tap targets. Only button-like controls count — an inline text link
      // inside a paragraph is not expected to be 36px tall.
      const small=[...document.querySelectorAll('a,button,input,select')].filter(el=>{
        const r=el.getBoundingClientRect();
        if (!r.width||!r.height) return false;
        const cs=getComputedStyle(el);
        if (cs.position==='fixed'&&r.top<0) return false;         // skip-link
        const painted = cs.backgroundColor!=='rgba(0, 0, 0, 0)' || cs.borderTopWidth!=='0px';
        const iconOnly = !el.textContent.trim();
        if (!painted && !iconOnly) return false;
        if (r.height>=36&&r.width>=36) return false;
        // getBoundingClientRect ignores ::before/::after hit areas, so probe
        // outwards to find how far the element actually catches a tap.
        const cx0=r.left+r.width/2, cy0=r.top+r.height/2;
        const reaches=(x,y)=>{const hit=document.elementFromPoint(x,y);return hit&&(hit===el||el.contains(hit)||hit.closest?.('a,button')===el);};
        let up=0, down=0;
        while(up<14&&reaches(cx0,r.top-up-1)) up++;
        while(down<14&&reaches(cx0,r.bottom+down+1)) down++;
        return (r.height+up+down)<36||r.width<36;
      }).map(el=>`${(el.textContent||el.getAttribute('aria-label')||el.tagName).trim().slice(0,18)} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`);
      if (small.length) out.push(`small tap targets: ${[...new Set(small)].slice(0,5).join(' | ')}`);
      return [...new Set(out)].slice(0,6);
    });
    if (issues.length) { bad++; console.log(`${w}px ${route}`); issues.forEach(i=>console.log('   ↳ '+i)); }
  }
  await page.close();
}
console.log(bad? `\n${bad} route/width combos with issues` : '\nno mobile issues found');
await browser.close();
