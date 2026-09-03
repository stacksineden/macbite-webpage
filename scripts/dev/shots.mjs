/**
 * Dev-only visual QA. Renders routes at a few widths using the system Chrome.
 * Not part of the build; nothing in src imports it.
 *   node scripts/shots.mjs <baseUrl> <outDir> [--full]
 */
import puppeteer from 'puppeteer-core';
import { mkdir } from 'node:fs/promises';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const base = process.argv[2] ?? 'http://localhost:5173';
const outDir = process.argv[3] ?? 'shots';
const full = process.argv.includes('--full');

const TARGETS = (process.env.ROUTES ?? '/').split(',');
const SIZES = (process.env.SIZES ?? 'desktop:1440x900').split(',').map((s) => {
  const [name, dim] = s.split(':');
  const [w, h] = dim.split('x').map(Number);
  return { name, w, h };
});

await mkdir(outDir, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--hide-scrollbars', '--force-device-scale-factor=1', '--font-render-hinting=none'],
});

for (const size of SIZES) {
  const page = await browser.newPage();
  await page.setViewport({ width: size.w, height: size.h, deviceScaleFactor: 1 });
  for (const route of TARGETS) {
    await page.goto(base + route, { waitUntil: 'networkidle0', timeout: 45000 });
    // Let entrance animations settle, then force any scroll-reveal that is
    // still below the fold so a full-page capture shows real content.
    await page.evaluate(async () => {
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 900));
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 500));
      window.dispatchEvent(new Event('scroll'));
    });
    await new Promise((r) => setTimeout(r, 1400));
    const slug = route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-');
    await page.screenshot({
      path: `${outDir}/${slug}.${size.name}.png`,
      fullPage: full,
      captureBeyondViewport: full,
    });
    console.log(`${slug}.${size.name}.png`);
  }
  await page.close();
}
await browser.close();
