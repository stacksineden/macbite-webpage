import { SITE, ADDRESS, PHONE_TEL, SOCIAL } from '@/config/site';
import { schemaHours } from '@/lib/hours';
import { CATEGORIES, MENU, type MenuItem } from '@/data/menu';
import { absoluteUrl } from '@/lib/seo';

const socials = Object.values(SOCIAL).filter(Boolean);

/** The anchor entity. Every other block references this by @id. */
export const restaurantSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  '@id': `${SITE.url}/#restaurant`,
  name: SITE.name,
  legalName: SITE.legalName,
  description: SITE.description,
  url: SITE.url,
  telephone: PHONE_TEL,
  image: absoluteUrl('/images/og-cover.jpg'),
  logo: absoluteUrl('/brand/macbite-logo-stacked-red.svg'),
  priceRange: '₦₦',
  servesCuisine: ['Nigerian', 'West African', 'Fast Food'],
  currenciesAccepted: 'NGN',
  ...(socials.length ? { sameAs: socials } : {}),
  address: {
    '@type': 'PostalAddress',
    streetAddress: ADDRESS.street,
    addressLocality: ADDRESS.city,
    addressRegion: ADDRESS.region,
    addressCountry: ADDRESS.country,
  },
  geo: { '@type': 'GeoCoordinates', latitude: ADDRESS.lat, longitude: ADDRESS.lng },
  openingHours: schemaHours,
  hasMenu: `${SITE.url}/menu`,
  acceptsReservations: false,
  areaServed: { '@type': 'City', name: 'Ibadan' },
  potentialAction: {
    '@type': 'OrderAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE.url}/menu`, actionPlatform: ['https://schema.org/DesktopWebPlatform', 'https://schema.org/MobileWebPlatform'] },
    deliveryMethod: ['https://schema.org/OnSitePickup', 'http://purl.org/goodrelations/v1#DeliveryModeOwnFleet'],
  },
});

const offer = (item: MenuItem) =>
  item.price == null ? undefined : { '@type': 'Offer', price: item.price, priceCurrency: 'NGN', availability: item.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' };

export const menuSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Menu',
  '@id': `${SITE.url}/menu#menu`,
  name: `${SITE.name} Menu`,
  inLanguage: 'en-NG',
  hasMenuSection: CATEGORIES.map((c) => ({
    '@type': 'MenuSection',
    name: c.name,
    description: c.description,
    hasMenuItem: MENU.filter((i) => i.category === c.id).map((i) => ({
      '@type': 'MenuItem',
      name: i.name,
      description: i.description,
      url: `${SITE.url}/item/${i.slug}`,
      ...(offer(i) ? { offers: offer(i) } : {}),
    })),
  })),
});

export const itemSchema = (item: MenuItem) => ({
  '@context': 'https://schema.org',
  '@type': 'MenuItem',
  name: item.name,
  description: item.description,
  url: `${SITE.url}/item/${item.slug}`,
  ...(offer(item) ? { offers: offer(item) } : {}),
  menuAddOn: item.kind === 'base'
    ? MENU.filter((m) => m.kind === 'protein').slice(0, 6).map((m) => ({ '@type': 'MenuItem', name: m.name }))
    : undefined,
});

export const breadcrumbSchema = (trail: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((t, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: t.name,
    item: `${SITE.url}${t.path}`,
  })),
});

export const faqSchema = (faqs: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE.url}/#website`,
  url: SITE.url,
  name: SITE.name,
  publisher: { '@id': `${SITE.url}/#restaurant` },
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE.url}/menu?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
});
