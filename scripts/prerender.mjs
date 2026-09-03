/**
 * Static prerender.
 *
 * Renders every indexable route to real HTML so crawlers, link previews and
 * slow connections get content without executing JavaScript. /cart and
 * /checkout deliberately ship an empty shell instead — they are noindex, they
 * depend on localStorage, and prerendering them would only create a hydration
 * mismatch.
 */
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

const OUT = 'dist/client';
const template = await readFile(path.join(OUT, 'index.html'), 'utf8');
const { render, routes } = await import(path.resolve('dist/server/entry-server.js'));

/** Head tags the per-route render owns. Strip them so nothing is duplicated. */
const OWNED = [
  /<title>[\s\S]*?<\/title>\s*/i,
  /<meta\s+name="description"[^>]*>\s*/i,
  /<meta\s+name="robots"[^>]*>\s*/i,
  /<link\s+rel="canonical"[^>]*>\s*/i,
  /<meta\s+property="og:title"[^>]*>\s*/i,
  /<meta\s+property="og:description"[^>]*>\s*/i,
  /<meta\s+property="og:url"[^>]*>\s*/i,
  /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>\s*/i,
  /<meta\s+name="twitter:card"[^>]*>\s*/i,
];

const stripped = OWNED.reduce((html, re) => html.replace(re, ''), template);

const shell = template.replace('<!--app-html-->', '');
await writeFile(path.join(OUT, 'shell.html'), shell);
await writeFile(path.join(OUT, '404.html'), shell);

let count = 0;
for (const { path: route } of routes()) {
  const { html, head } = render(route);
  const page = stripped
    .replace('</head>', `  ${head}\n    <meta name="twitter:card" content="summary_large_image" />\n  </head>`)
    .replace('<!--app-html-->', html);

  const dir = route === '/' ? OUT : path.join(OUT, route);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.html'), page);
  count++;
}

// The server bundle is a build artefact, not something to deploy.
await rm('dist/server', { recursive: true, force: true });

console.log(`prerendered ${count} routes → ${OUT}`);
