/** Dev-only: capture a route at successive scroll offsets. */
import puppeteer from 'puppeteer-core';
import { mkdir } from 'node:fs/promises';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const [, , base, route, outDir, wStr, hStr] = process.argv;
const w = Number(wStr ?? 1440), h = Number(hStr ?? 900);
await mkdir(outDir, { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--hide-scrollbars'] });
const page = await browser.newPage();
await page.setViewport({ width: w, height: h });
await page.goto(base + route, { waitUntil: 'networkidle0', timeout: 45000 });
await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
const docH = await page.evaluate(() => document.documentElement.scrollHeight);
const slug = route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-');
let i = 0;
for (let y = 0; y < docH; y += Math.round(h * 0.92)) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await new Promise((r) => setTimeout(r, 900));
  await page.screenshot({ path: `${outDir}/${slug}-${w}-${String(i).padStart(2, '0')}.png` });
  i++;
}
console.log(`${slug}: ${i} frames, doc ${docH}px`);
await browser.close();
