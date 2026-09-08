/**
 * Dev-only: exercises the real WhatsApp handoff.
 *
 * Runs HEADED by default and never stubs window.open or the anchor. Headless
 * Chrome does not apply the popup blocker the way a real browser does, and
 * stubbing the navigation is what hid two separate bugs here already.
 *   node scripts/dev/checkout-send.mjs [baseUrl] [--headless]
 */
import puppeteer from 'puppeteer-core';
import { rm } from 'node:fs/promises';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const B = process.argv.find((a) => a.startsWith('http')) ?? 'http://localhost:4180';
const HEADLESS = process.argv.includes('--headless');

const SEED = { state: { lines: [{
  id: 'a', slug: 'spicy-rice', name: 'Spicy Rice', unit: 'Plate', basePrice: 1500,
  proteins: [{ slug: 'chicken', name: 'Chicken', variantLabel: 'Large', price: 3500 }],
  sides: [{ slug: 'plantain-dodo', name: 'Plantain (Dodo)', price: 700 }],
  qty: 1, deliverable: true }], mode: 'delivery', zoneId: 'alakia' }, version: 1 };

const fails = [];

for (const [label, w, h, mobile] of [['desktop', 1200, 820, false], ['mobile', 390, 780, true]]) {
  const profile = `/tmp/macbite-qa-${label}-${Date.now()}`;
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: HEADLESS ? 'new' : false,
    args: ['--hide-scrollbars', `--user-data-dir=${profile}`, `--window-size=${w},${h}`, '--no-first-run', '--no-default-browser-check'],
  });
  const problems = [];
  try {
    // Reuse the window's existing tab. Opening a second one and holding the
    // handle across a target=_blank click detaches the frame in headed Chrome.
    const [p] = await browser.pages();
    await p.setViewport({ width: w, height: h, isMobile: mobile, hasTouch: mobile });
    const pageErrors = [];
    p.on('pageerror', (e) => pageErrors.push(e.message.slice(0, 120)));

    await p.goto(`${B}/`, { waitUntil: 'domcontentloaded' });
    await p.evaluate((s) => localStorage.setItem('macbite-cart-v1', JSON.stringify(s)), SEED);
    await p.goto(`${B}/checkout`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 900));

    const clickSend = () => p.evaluate(() =>
      [...document.querySelectorAll('a')].find((x) => x.textContent.includes('Send order on WhatsApp')).click());

    // The anchor must carry a live href even before anything is typed.
    const href = await p.evaluate(() =>
      [...document.querySelectorAll('a')].find((x) => x.textContent.includes('Send order on WhatsApp'))?.getAttribute('href'));
    if (!href?.startsWith('https://wa.me/')) problems.push(`send control has no wa.me href (${href})`);

    // A. Invalid form must open nothing and must move focus to the bad field.
    let opened = 0;
    const count = (t) => { if (t.type() === 'page') opened++; };
    browser.on('targetcreated', count);
    await clickSend();
    await new Promise((r) => setTimeout(r, 1200));
    browser.off('targetcreated', count);
    if (opened) problems.push(`invalid form opened ${opened} tab(s)`);
    // What matters to the customer is that the error is on screen. (Focus is
    // also moved, but activeElement is unreliable when the automated window is
    // not foregrounded, so it is reported rather than asserted.)
    const invalidState = await p.evaluate(() => {
      const first = document.querySelector('[role=alert]');
      const r = first?.getBoundingClientRect();
      return {
        alerts: document.querySelectorAll('[role=alert]').length,
        firstVisible: !!r && r.top >= 0 && r.bottom <= innerHeight,
        firstTop: r ? Math.round(r.top) : null,
        focused: document.activeElement?.id || '(none)',
      };
    });
    if (!invalidState.alerts) problems.push('invalid form showed no error messages');
    if (!invalidState.firstVisible) problems.push(`first error off-screen (top: ${invalidState.firstTop})`);

    // B. Valid form must open WhatsApp and land on the confirmation.
    await p.type('#name', 'Tunde Adebayo');
    await p.type('#phone', '08031234567');
    await p.type('#address', '8 The green estate Road');
    await clickSend();
    await new Promise((r) => setTimeout(r, 3000));

    const all = await browser.pages();
    const waTab = all.map((x) => x.url()).find((u) => /wa\.me|api\.whatsapp\.com/.test(u));
    if (!waTab) problems.push('no WhatsApp tab opened');

    // Re-acquire the checkout tab by URL — the original handle may be stale.
    const checkout = all.find((x) => x.url().includes('/checkout')) ?? p;
    const state = await checkout.evaluate(() => ({
      path: location.pathname,
      h1: document.querySelector('h1')?.textContent?.trim(),
      cart: (JSON.parse(localStorage.getItem('macbite-cart-v1') || '{}').state?.lines || []).length,
      reopen: [...document.querySelectorAll('a')].find((a) => a.textContent.includes('Open WhatsApp again'))?.getAttribute('href'),
    }));
    if (state.path !== '/checkout') problems.push(`left checkout for ${state.path}`);
    if (state.h1 !== "We've got it.") problems.push(`no confirmation screen (h1: ${state.h1})`);
    if (state.cart !== 0) problems.push('cart not cleared');
    if (!state.reopen?.startsWith('https://wa.me/')) problems.push('no working re-open link');
    if (pageErrors.length) problems.push('page errors: ' + pageErrors.join(' | '));

    console.log(`${problems.length ? 'FAIL' : 'ok  '}  ${label}`);
    console.log(`        WhatsApp tab: ${waTab ? waTab.slice(0, 48) + '…' : 'none'}`);
    console.log(`        stayed on ${state.path} · ${state.h1} · cart ${state.cart}`);
    console.log(`        invalid form: ${invalidState.alerts} error(s), first at y=${invalidState.firstTop}, focus → ${invalidState.focused}`);
  } catch (err) {
    problems.push('threw: ' + String(err).slice(0, 120));
    console.log(`FAIL  ${label}`);
  }
  problems.forEach((x) => console.log('        ↳ ' + x));
  if (problems.length) fails.push(label);
  await browser.close().catch(() => {});
  await rm(profile, { recursive: true, force: true }).catch(() => {});
}

console.log(fails.length ? `\n${fails.length} failing` : '\nWhatsApp handoff works at both sizes');
process.exit(fails.length ? 1 : 0);
