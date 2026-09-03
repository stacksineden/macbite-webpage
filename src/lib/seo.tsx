import { createContext, useContext, useEffect, useRef } from 'react';
import { SITE } from '@/config/site';

export interface HeadData {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
  jsonLd?: unknown[];
}

/** Server-side sink. During SSR each <Seo> writes here; the shell reads it after render. */
export type HeadSink = { current: HeadData | null };
const SinkContext = createContext<HeadSink | null>(null);

export function HeadSinkProvider({ sink, children }: { sink: HeadSink; children: React.ReactNode }) {
  return <SinkContext.Provider value={sink}>{children}</SinkContext.Provider>;
}

const abs = (p: string) => (p.startsWith('http') ? p : SITE.url.replace(/\/$/, '') + p);

export function fullTitle(title: string): string {
  return title === SITE.name ? `${SITE.name} — ${SITE.tagline}` : `${title} | ${SITE.name} Ibadan`;
}

/** Renders nothing. Applies head data on the client, records it on the server. */
export function Seo(props: HeadData) {
  const sink = useContext(SinkContext);
  // On the server this runs during render, which is exactly when we need it.
  if (sink) sink.current = props;

  const jsonLdRef = useRef<HTMLScriptElement[]>([]);

  useEffect(() => {
    const title = fullTitle(props.title);
    const canonical = abs(props.path);
    const image = abs(props.image ?? '/images/og-cover.jpg');

    document.title = title;
    setMeta('name', 'description', props.description);
    setMeta('name', 'robots', props.noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large');
    setLink('canonical', canonical);

    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', props.description);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', SITE.name);
    setMeta('property', 'og:locale', SITE.locale);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', props.description);
    setMeta('name', 'twitter:image', image);

    for (const node of jsonLdRef.current) node.remove();
    jsonLdRef.current = (props.jsonLd ?? []).map((block) => {
      const el = document.createElement('script');
      el.type = 'application/ld+json';
      el.dataset.seo = 'route';
      el.textContent = safeJsonLd(block);
      document.head.appendChild(el);
      return el;
    });
    // Clear any JSON-LD the prerender baked in for a different route.
    for (const el of Array.from(document.head.querySelectorAll('script[data-seo="prerender"]'))) el.remove();
  }, [props.title, props.description, props.path, props.image, props.noindex, props.jsonLd]);

  return null;
}

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

/**
 * JSON-LD goes into a <script> as text. `<` and `&` must be escaped or a value
 * containing `</script>` would break out of the tag — the one real XSS vector
 * in a site that otherwise never injects HTML.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c').replace(/&/g, '\\u0026');
}

export { abs as absoluteUrl };
