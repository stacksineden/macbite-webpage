/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  MacBite — single source of truth for everything the business owns.
 *  If a value needs to change after launch, it should be changeable HERE and
 *  nowhere else. Anything marked TODO is blocked on MacBite confirming it.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** TODO(MacBite): replace with the real WhatsApp business line, digits only, country code first, no `+`. */
export const WHATSAPP_NUMBER = '2348000000000';

/** TODO(MacBite): the number customers should tap to call. Display form. */
export const PHONE_DISPLAY = '+234 800 000 0000';
export const PHONE_TEL = '+2348000000000';

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
 * Pricing status. Prices in `src/data/menu.ts` are INDICATIVE placeholders —
 * only the two chicken prices came off the real stock sheet. While this is
 * 'draft' the site shows a standing "prices confirmed on WhatsApp" note and the
 * WhatsApp order message asks MacBite to confirm the total.
 * Set to 'confirmed' once real prices are in and the note disappears everywhere.
 */
export const PRICING_STATUS: 'draft' | 'confirmed' = 'draft';

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
