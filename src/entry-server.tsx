import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import { CATEGORIES, MENU } from './data/menu';
import { HeadSinkProvider, fullTitle, safeJsonLd, absoluteUrl, type HeadData, type HeadSink } from './lib/seo';
import './index.css';

export interface RenderResult {
  html: string;
  head: string;
}

/** Renders one route to HTML plus the <head> tags that belong to it. */
export function render(url: string): RenderResult {
  const sink: HeadSink = { current: null };

  const html = renderToString(
    <StrictMode>
      <HeadSinkProvider sink={sink}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HeadSinkProvider>
    </StrictMode>,
  );

  return { html, head: headTags(sink.current) };
}

function headTags(data: HeadData | null): string {
  if (!data) return '';
  const title = fullTitle(data.title);
  const canonical = absoluteUrl(data.path);
  const image = absoluteUrl(data.image ?? '/images/og-cover.jpg');
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const tags = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(data.description)}" />`,
    `<meta name="robots" content="${data.noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large'}" />`,
    `<link rel="canonical" href="${esc(canonical)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(data.description)}" />`,
    `<meta property="og:url" content="${esc(canonical)}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(data.description)}" />`,
    `<meta name="twitter:image" content="${esc(image)}" />`,
  ];

  for (const block of data.jsonLd ?? []) {
    tags.push(`<script type="application/ld+json" data-seo="prerender">${safeJsonLd(block)}</script>`);
  }

  return tags.join('\n    ');
}

/** Every route worth prerendering, plus whether it belongs in the sitemap. */
export function routes(): { path: string; indexable: boolean }[] {
  const list: { path: string; indexable: boolean }[] = [
    { path: '/', indexable: true },
    { path: '/menu', indexable: true },
    { path: '/about', indexable: true },
    { path: '/contact', indexable: true },
    { path: '/delivery', indexable: true },
  ];
  for (const c of CATEGORIES) list.push({ path: `/menu/${c.id}`, indexable: true });
  for (const i of MENU) list.push({ path: `/item/${i.slug}`, indexable: true });
  return list;
}
