/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  MacBite — single source of truth for everything the business owns.
 *  If a value needs to change after launch, it should be changeable HERE and
 *  nowhere else. Anything marked TODO is blocked on MacBite confirming it.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * MacBite's WhatsApp business line. Digits only, country code first, no `+`
 * — wa.me rejects anything else. This one constant drives checkout, the
 * footer's order button, the Contact page and the catering enquiry.
 */
export const WHATSAPP_NUMBER: string = '2348165271392';

/** Ships with the repo so the checkout can warn if the real line was never set. */
export const PLACEHOLDER_WHATSAPP = '2348000000000';

/**
 * The number customers tap to call — the same line as WhatsApp above.
 * `PHONE_TEL` is what goes in `tel:` links and schema.org, so it stays in
 * strict E.164; `PHONE_DISPLAY` is the human-readable form shown on the page.
 */
export const PHONE_DISPLAY = '+234 816 527 1392';
export const PHONE_TEL = '+2348165271392';

export const SITE = {
  name: 'MacBite',
  legalName: 'MacBite Restaurant',
  tagline: 'Real food. Ready when you are.',
  description:
    "Ibadan's everyday fast food kitchen. Rice, swallow, proteins and sides cooked through the day — delivered across Ibadan or packed and waiting at Cele bus stop, Old Ife Road.",
  /** TODO(MacBite): point this at the live domain before launch. Used for canonicals, OG tags and the sitemap. */
  url: 'https://macbite.ng',
  locale: 'en_NG',
  currency: 'NGN',
  currencySymbol: '₦',
} as const;

export const ADDRESS = {
  street: 'Cele Bus Stop, Old Ife Road',
  landmark: 'Opposite Enyo filling station, before Airport Junction',
  area: 'Alakia',
  city: 'Ibadan',
  region: 'Oyo State',
  country: 'NG',
  /** TODO(MacBite): confirm exact coordinates — these are the Cele/Old Ife Road junction. */
  lat: 7.3775,
  lng: 4.0078,
} as const;

/** Kitchen hours. `close` is also the order cutoff unless CUTOFF_MINUTES_BEFORE_CLOSE says otherwise. */
export const HOURS = { open: 8, close: 20 } as const;

/** TODO(MacBite): how long before the 8pm close should the site stop taking orders? */
export const CUTOFF_MINUTES_BEFORE_CLOSE = 30;

export const SOCIAL = {
  /** TODO(MacBite): fill in whichever exist; empty strings are skipped in the UI and in schema.org. */
  instagram: '',
  facebook: '',
  tiktok: '',
  x: '',
} as const;

/**
 * Breakfast is unconfirmed — no breakfast lines exist on the inventory sheet
 * despite an 8am open. Flip to `true` once MacBite confirms the service and the
 * breakfast day-part card, filter and schema hours appear automatically.
 */
export const BREAKFAST_ENABLED = false;

/**
 * Swallow needs soups, and the soup list is not on the inventory sheet. While
 * this is empty the item builder tells the customer soup is chosen on the call
 * rather than showing an empty, broken selector.
 */
export const SOUPS: { id: string; name: string; price: number | null }[] = [
  // TODO(MacBite): e.g. { id: 'egusi', name: 'Egusi', price: 1500 },
];

/**
 * Pricing status. MacBite has now supplied real prices for every item except
 * the two Pastries lines, which carry `price: null` and are quoted on WhatsApp.
 * 'confirmed' removes the standing "prices are indicative" note site-wide.
 * Set back to 'draft' if prices ever go stale again.
 */
export const PRICING_STATUS: 'draft' | 'confirmed' = 'confirmed';

/** TODO(MacBite): minimum order value, and whether it varies by zone (see data/zones.ts). */
export const DEFAULT_MINIMUM_ORDER = 2000;

/** TODO(MacBite): is the takeaway pack charged to the customer? Set to 0 to hide the line. */
export const PACK_FEE = 0;

export const NAV = [
  { label: 'Menu', to: '/menu' },
  { label: 'Delivery', to: '/delivery' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
] as const;
