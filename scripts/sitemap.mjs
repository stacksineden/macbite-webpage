/** Sitemap built from the app's own route list, so a new menu item is never missed. */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const ORIGIN = (process.env.SITE_URL ?? 'https://macbite.ng').replace(/\/$/, '');
const { routes } = await import(path.resolve('dist/server/entry-server.js'));

const today = new Date().toISOString().slice(0, 10);
const priority = (p) => (p === '/' ? '1.0' : p === '/menu' ? '0.9' : p.startsWith('/item/') ? '0.6' : '0.7');

const urls = routes()
  .filter((r) => r.indexable)
  .map(({ path: p }) => `  <url>
    <loc>${ORIGIN}${p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.startsWith('/item/') ? 'monthly' : 'weekly'}</changefreq>
    <priority>${priority(p)}</priority>
  </url>`)
  .join('\n');

await writeFile(
  'dist/client/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

console.log(`sitemap.xml — ${routes().filter((r) => r.indexable).length} urls`);
