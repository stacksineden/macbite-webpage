# MacBite — ordering site

Ibadan's everyday fast food kitchen. Static-rendered React ordering site with
WhatsApp checkout.

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # → dist/client, fully prerendered
npm run preview      # serve the build
```

---

## Before this goes live

Everything below is a real blocker. Each one is a single edit in a single file.

| # | What's needed | Where |
|---|---|---|
| ~~1~~ | ~~MacBite's WhatsApp number~~ — **done**: `+234 816 527 1392` | `src/config/site.ts` → `WHATSAPP_NUMBER` |
| ~~2~~ | ~~Phone number for the call links~~ — **done**: same line as WhatsApp | `src/config/site.ts` → `PHONE_DISPLAY`, `PHONE_TEL` |
| 1 | **The live domain** — canonicals, OG tags and sitemap all read it | `src/config/site.ts` → `SITE.url`, plus `public/robots.txt` |
| ~~4~~ | ~~Real prices~~ — **done** for 37 of 39. The two **Pastries** lines are still unpriced and show "Price on request" | `src/data/menu.ts` → `macbite-bread`, `doughnuts` |
| 5 | **Delivery zones and fees** | `src/data/zones.ts` |
| 6 | **Minimum order value** | `src/config/site.ts` → `DEFAULT_MINIMUM_ORDER` (or per-zone `minimum`) |
| 7 | **The soup list** — swallow can't be sold without it | `src/config/site.ts` → `SOUPS` |
| 8 | **Is breakfast a real service?** | `src/config/site.ts` → `BREAKFAST_ENABLED` |
| 9 | **Protein pairing rules + single vs multi-select** | `src/data/menu.ts` → `PROTEIN_SELECT_MODE`, `PROTEIN_MAX` |
| 10 | **Which items must not go out for delivery** | `src/data/menu.ts` → `deliverable: false` (coleslaw is set this way already) |
| 11 | **Is the takeaway pack charged?** | `src/config/site.ts` → `PACK_FEE` (0 hides the line) |
| 12 | **Order cutoff before the 8pm close** | `src/config/site.ts` → `CUTOFF_MINUTES_BEFORE_CLOSE` |
| 13 | **Social links** | `src/config/site.ts` → `SOCIAL` (empty strings are skipped everywhere) |
| 14 | **Item photography** — 36 of 39 items have a photo | drop `<slug>.png` in `assets/source/menu`, run `npm run images` — see *Photography* |
| 15 | **Pastries** — the category exists with bread and doughnuts; the counter photo also shows pizza, meat pie and buns | add rows to `src/data/menu.ts` |

Every one of these is marked `TODO(MacBite)` in the source, so
`grep -rn "TODO(MacBite)" src` gives the same list.

### Prices

Prices are MacBite's own and `PRICING_STATUS` is `'confirmed'`, so the standing
"prices are indicative" note is off site-wide.

**MacBite Bread and Doughnuts are the exception** — they were never priced, so
they carry `price: null`, read *"Price on request"*, and the WhatsApp message
asks the kitchen to confirm the total whenever one is in the basket. Give them
a number in `src/data/menu.ts` and they behave like everything else.

**Items on MacBite's price list that are NOT on the site.** These were left out
deliberately — the brief was to correct existing items, not add new ones:

| Item | Price given |
|---|---|
| Pounded yam (per wrap) | ₦700 |
| Can dudu mixed fruit | ₦1,000 |
| Viju chocolate | ₦1,500 — *photography for this is already in `_alternates/`* |
| Nutri choco | ₦1,200 |
| Ice tea 1L | ₦2,000 — **conflict**: previously asked to remove Ice Tea from the menu |

A price may also be `null`. The item then reads *"Price on request"*, the cart
total becomes *"On WhatsApp"*, and checkout still works — an unpriced item
never blocks an order.

### Photography

**Live now:** 36 of 39 items. Still on the placeholder: `doughnuts`,
`fayrous` and `exotic`.

Three display names were corrected against the supplied photography:

| Was | Now | Why |
|---|---|---|
| Dudu Osun Drink | **Dudu Yoghurt** | The photo is a Dudu-brand yoghurt can. "Dudu Osun" is a black soap — the catalog line was a transcription slip. Slug is now `dudu-yoghurt`. |
| Yogurt | **Viju Yoghurt** | Names the brand, and separates it from Dudu Yoghurt. |
| Active | **Chivita Active** | Same brand family as Chivita; the pack says so. |

`Ice Tea` was removed from the menu entirely.

Adding an item photo is one drop and one command:

```bash
cp your-photo.png assets/source/menu/spicy-rice.png   # filename = the item slug
npm run images
```

That generates responsive AVIF/WebP/JPEG at 400/800/1200 plus an inline blurred
placeholder, and rewrites the generated `src/data/photos.ts`. Every surface
that shows the item — menu tile, item page, cart row — picks the photo up
automatically. **No component needs editing.**

Items with no photo keep `FoodPlaceholder`: a branded gradient with the cloche
mark, cycled by menu position so no two neighbouring tiles match. Because the
choice is per item, the menu can fill in gradually without looking half-built.

Slugs are the `slug` values in `src/data/menu.ts` — `spicy-rice`, `fried-rice`,
`amala`, `chicken`, `plantain-dodo`, `coke`, and so on. A file whose name isn't
a valid slug is skipped with a warning.

`assets/source/menu/_alternates/` holds second shots of items that already have
a photo, plus two images of a **Viju chocolate milk drink that has no matching
product on the menu**. See the README in that folder.

---

## How it's built

**Vite 8 · React 18 · TypeScript · Tailwind v4 · React Router 7 · Zustand · Framer Motion**

### Rendering

It's a single-page app that is **prerendered to static HTML at build time** —
all 48 routes, including every menu item. `npm run build` runs the client
build, an SSR build, the sitemap, then `scripts/prerender.mjs`, which renders
each route with `StaticRouter` and writes real HTML with per-route `<title>`,
meta description, canonical and JSON-LD.

That matters because a plain Vite SPA serves crawlers an empty `<div>`. Here
every page is indexable without executing JavaScript.

`/cart` and `/checkout` deliberately ship an empty shell instead: they are
`noindex`, they read `localStorage`, and prerendering them would only create a
hydration mismatch.

### Why the hero animates in CSS

The hero holds the LCP element. Driving its entrance from the animation
library would bake `opacity: 0` into the prerendered HTML, so the headline
could not paint until the JavaScript had downloaded and hydrated — and would
never paint at all if that failed. It's CSS instead, so it paints with the
stylesheet. See the hero block in `src/index.css`.

Below-fold sections still use scroll reveals; `index.html` carries a
`<noscript>` rule that forces them visible when scripts are off.

### Performance

| | gzip |
|---|---|
| JS on the critical path | ~95 KB |
| Animation features (loaded after first paint) | ~18 KB |
| CSS | ~10 KB |
| Hero photo (AVIF, 640px) | 24 KB |

The 6.7 MB source hero is served as responsive AVIF/WebP/JPEG — 24 KB at phone
width, 187 KB at 2560px — with a blurred inline placeholder so there's no
layout shift. The Google Map iframe only loads when the visitor asks for it,
which keeps ~900 KB and a set of third-party cookies off every first visit.

### SEO

- Prerendered HTML, one `<h1>` per page, unique title and description
- `Restaurant`, `Menu`, `MenuItem`, `BreadcrumbList`, `FAQPage` and `WebSite` JSON-LD
- `sitemap.xml` generated from the app's own route list, so a new menu item can't be missed
- FAQ copy written against real local searches ("does macbite deliver", "macbite opening hours")
- Every delivery area is an internal link in the footer

### Security

- CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` and
  `Permissions-Policy` in `public/_headers` (Netlify) and `vercel.json` (Vercel)
- No third-party scripts, no analytics, no cookies
- The app never injects HTML; the only `<script>` written from data is JSON-LD,
  and it is escaped in `src/lib/seo.tsx`
- **No payment details are handled anywhere.** Checkout hands off to WhatsApp;
  the customer pays the rider or at the counter
- Checkout has a honeypot field and validates the phone number client-side
- `npm audit` is clean

---

## Deploying

Build output is `dist/client`, fully static.

**Netlify** — build `npm run build`, publish `dist/client`. `_headers` and
`_redirects` are picked up automatically.

**Vercel** — `vercel.json` is already configured.

**Any other static host** — serve `dist/client`, and route unknown paths to
`shell.html` (not `index.html`, which is the prerendered homepage).

Set `SITE_URL` at build time to override the sitemap origin.

---

## Layout

```
src/
  config/site.ts        every business value, all the TODOs
  data/menu.ts          39 products, mapped 1:1 from MacBite-Menu-Catalog.xlsx
                        (+ Pastries, which the catalog was missing)
  data/zones.ts         delivery areas and fees
  data/faq.ts           FAQ copy, doubles as FAQPage schema
  lib/cart.ts           cart store, totals, business rules
  lib/whatsapp.ts       the checkout message
  lib/seo.tsx           head management, SSR and client
  lib/schema.ts         JSON-LD
  components/           layout · home · menu · ui
  pages/                one file per route
scripts/
  optimize-images.mjs   responsive AVIF/WebP/JPEG  (npm run images)
  prerender.mjs         static render of every route
  sitemap.mjs           sitemap from the route list
  dev/                  local QA only — screenshots, order-flow and rules tests
assets/source/          original photography and the logo kit README
public/brand/           official logo lockups
```

`src/data/menu.ts` keeps each item's `ref` — its line number on MacBite's Daily
Inventory sheet — so the site and the stock sheet reconcile without a
translation step.

### Local QA

Needs Google Chrome installed; these are dev-only and not part of the build.

```bash
node scripts/dev/verify.mjs http://localhost:4180      # every route: hydration, a11y, meta
node scripts/dev/order-flow.mjs                        # builds an order, checks the WhatsApp message
node scripts/dev/rules.mjs                             # minimums, pickup-only items, cutoff
node scripts/dev/mobile-audit.mjs                      # overflow + tap targets at 320/360/390/430
node scripts/dev/serve.mjs 4180                        # serve dist/client the way a host would
```
