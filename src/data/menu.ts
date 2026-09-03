/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  MENU DATA — derived 1:1 from MacBite-Menu-Catalog.xlsx.
 *
 *  `ref` is the line number on MacBite's Daily Inventory sheet. Keeping it here
 *  means the site and the stock sheet reconcile without a translation step.
 *
 *  ⚠️  PRICES ARE INDICATIVE PLACEHOLDERS. Only Chicken (Large 3500 / Small 2000)
 *      came off the real stock sheet. Replace every other number before launch
 *      and set PRICING_STATUS = 'confirmed' in src/config/site.ts.
 *      Setting a price to `null` is fully supported — the item then reads
 *      "Price on request" and is quoted on WhatsApp instead of blocking checkout.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type CategoryId = 'main-dishes' | 'swallow' | 'proteins' | 'sides' | 'pastries' | 'drinks';
export type ItemKind = 'base' | 'protein' | 'side' | 'pastry' | 'drink';
export type DayPart = 'breakfast' | 'lunch' | 'dinner' | 'all';

export interface Variant {
  id: string;
  label: string;
  price: number | null;
}

export interface MenuItem {
  slug: string;
  name: string;
  category: CategoryId;
  kind: ItemKind;
  /** Customer-facing portion word. TODO(MacBite): confirm these are MacBite's own words. */
  unit: string;
  description: string;
  price: number | null;
  variants?: Variant[];
  dayPart: DayPart;
  /** Staff availability flag — the `Currently available` filter reads this. */
  available: boolean;
  /** Some items do not travel. TODO(MacBite): confirm the full list. */
  deliverable: boolean;
  popular?: boolean;
  /** Photo priority from the catalog; 1–2 are in the shoot, 3+ show a branded placeholder. */
  photo: number;
  /** Inventory sheet line number. */
  ref?: number;
  /** Bases only: does this item take a soup choice? */
  needsSoup?: boolean;
}

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  /** Shown on the category chip in the menu nav. */
  short: string;
}

export const CATEGORIES: Category[] = [
  { id: 'main-dishes', name: 'Main Dishes', short: 'Mains', description: 'Rice, beans and yam porridge, by the plate.' },
  { id: 'swallow', name: 'Swallow', short: 'Swallow', description: 'Amala, eba and semo, with your choice of soup.' },
  { id: 'proteins', name: 'Proteins', short: 'Proteins', description: 'Chicken, beef, goat meat, fish and more — add to any plate.' },
  { id: 'sides', name: 'Sides', short: 'Sides', description: 'Plantain, moin moin and coleslaw.' },
  { id: 'pastries', name: 'Pastries', short: 'Pastries', description: 'Bread and doughnuts from the counter.' },
  { id: 'drinks', name: 'Drinks', short: 'Drinks', description: 'Soft drinks, malt, juice and water.' },
];

export const MENU: MenuItem[] = [
  // ── A. MAIN DISHES ────────────────────────────────────────────────────────
  { slug: 'spicy-rice', name: 'Spicy Rice', category: 'main-dishes', kind: 'base', unit: 'Plate', price: 1500,
    description: 'House spicy rice, served by the plate.', dayPart: 'all', available: true, deliverable: true, popular: true, photo: 1, ref: 1 },
  { slug: 'fried-rice', name: 'Fried Rice', category: 'main-dishes', kind: 'base', unit: 'Plate', price: 1800,
    description: 'Fried rice with mixed vegetables.', dayPart: 'all', available: true, deliverable: true, popular: true, photo: 1, ref: 2 },
  { slug: 'rice-and-beans', name: 'Rice and Beans', category: 'main-dishes', kind: 'base', unit: 'Plate', price: 1500,
    description: 'Rice and beans cooked together.', dayPart: 'all', available: true, deliverable: true, popular: true, photo: 2, ref: 3 },
  { slug: 'beans-ewa', name: 'Beans (Ewa)', category: 'main-dishes', kind: 'base', unit: 'Plate', price: 1200,
    description: 'Stewed beans, soft and well seasoned.', dayPart: 'all', available: true, deliverable: true, photo: 2, ref: 4 },
  { slug: 'yam-porridge', name: 'Yam Porridge', category: 'main-dishes', kind: 'base', unit: 'Plate', price: 1500,
    description: 'Yam cooked down in pepper and palm oil.', dayPart: 'all', available: true, deliverable: true, popular: true, photo: 2, ref: 5 },

  // ── B. SWALLOW ────────────────────────────────────────────────────────────
  { slug: 'amala', name: 'Amala', category: 'swallow', kind: 'base', unit: 'Wrap', price: 500,
    description: 'Yam flour swallow, served with your choice of soup.', dayPart: 'all', available: true, deliverable: true, popular: true, photo: 1, ref: 17, needsSoup: true },
  { slug: 'eba', name: 'Eba', category: 'swallow', kind: 'base', unit: 'Wrap', price: 500,
    description: 'Garri swallow, served with your choice of soup.', dayPart: 'all', available: true, deliverable: true, photo: 3, ref: 18, needsSoup: true },
  { slug: 'semo', name: 'Semo', category: 'swallow', kind: 'base', unit: 'Wrap', price: 600,
    description: 'Semolina swallow, served with your choice of soup.', dayPart: 'all', available: true, deliverable: true, photo: 3, ref: 19, needsSoup: true },

  // ── C. PROTEINS ───────────────────────────────────────────────────────────
  // Chicken is the one line carrying real stock-sheet prices.
  { slug: 'chicken', name: 'Chicken', category: 'proteins', kind: 'protein', unit: 'Portion', price: 3500,
    description: 'Grilled chicken portion.', dayPart: 'all', available: true, deliverable: true, popular: true, photo: 1, ref: 9,
    variants: [ { id: 'large', label: 'Large', price: 3500 }, { id: 'small', label: 'Small', price: 2000 } ] },
  { slug: 'beef', name: 'Beef', category: 'proteins', kind: 'protein', unit: 'Piece', price: 1000,
    description: 'Tender beef, cooked in the day’s stew.', dayPart: 'all', available: true, deliverable: true, photo: 2, ref: 6 },
  { slug: 'goat-meat', name: 'Goat Meat', category: 'proteins', kind: 'protein', unit: 'Piece', price: 1500,
    description: 'Goat meat, peppered and slow-cooked.', dayPart: 'all', available: true, deliverable: true, popular: true, photo: 2, ref: 16 },
  { slug: 'turkey', name: 'Turkey', category: 'proteins', kind: 'protein', unit: 'Piece', price: 2500,
    description: 'Turkey portion, grilled.', dayPart: 'all', available: true, deliverable: true, photo: 2, ref: 11 },
  { slug: 'assorted', name: 'Assorted Meat', category: 'proteins', kind: 'protein', unit: 'Piece', price: 1200,
    description: 'A mix of beef, shaki and offal, cooked together.', dayPart: 'all', available: true, deliverable: true, photo: 3, ref: 15 },
  { slug: 'ponmo', name: 'Ponmo', category: 'proteins', kind: 'protein', unit: 'Piece', price: 500,
    description: 'Cow skin, soft and peppery.', dayPart: 'all', available: true, deliverable: true, photo: 3, ref: 8 },
  { slug: 'bokoto', name: 'Bokoto', category: 'proteins', kind: 'protein', unit: 'Piece', price: 1000,
    description: 'Cow foot, slow-cooked until it falls apart.', dayPart: 'all', available: true, deliverable: true, photo: 3, ref: 14 },
  { slug: 'titus', name: 'Titus Fish', category: 'proteins', kind: 'protein', unit: 'Piece', price: 2000,
    description: 'Titus fish, fried.', dayPart: 'all', available: true, deliverable: true, photo: 2, ref: 13 },
  { slug: 'panla', name: 'Panla Fish', category: 'proteins', kind: 'protein', unit: 'Piece', price: 1200,
    description: 'Dried panla fish in stew.', dayPart: 'all', available: true, deliverable: true, photo: 3, ref: 12 },
  { slug: 'boiled-egg', name: 'Boiled Egg', category: 'proteins', kind: 'protein', unit: 'Piece', price: 400,
    description: 'One boiled egg.', dayPart: 'all', available: true, deliverable: true, photo: 4, ref: 7 },

  // ── D. SIDES ──────────────────────────────────────────────────────────────
  { slug: 'plantain-dodo', name: 'Plantain (Dodo)', category: 'sides', kind: 'side', unit: 'Portion', price: 700,
    description: 'Fried ripe plantain.', dayPart: 'all', available: true, deliverable: true, popular: true, photo: 1, ref: 21 },
  { slug: 'moin-moin', name: 'Moin Moin', category: 'sides', kind: 'side', unit: 'Piece', price: 700,
    description: 'Steamed bean pudding.', dayPart: 'all', available: true, deliverable: true, photo: 2, ref: 20 },
  // TODO(MacBite): confirm before enabling for delivery — coleslaw travels poorly in heat.
  { slug: 'coleslaw', name: 'Coleslaw', category: 'sides', kind: 'side', unit: 'Portion', price: 700,
    description: 'Fresh coleslaw. Dine-in and pickup only.', dayPart: 'all', available: true, deliverable: false, photo: 3, ref: 22 },

  // ── E. PASTRIES ───────────────────────────────────────────────────────────
  // TODO(MacBite): confirm names, portion words and prices for this counter —
  // it is not on the inventory sheet. The catalog photo also shows pizza, meat
  // pie and buns, which can be added here the same way.
  { slug: 'macbite-bread', name: 'MacBite Bread', category: 'pastries', kind: 'pastry', unit: 'Loaf', price: 1200,
    description: "MacBite's own soft loaf, from the counter.", dayPart: 'all', available: true, deliverable: true, photo: 1 },
  { slug: 'doughnuts', name: 'Doughnuts', category: 'pastries', kind: 'pastry', unit: 'Piece', price: 500,
    description: 'Soft sugared doughnuts.', dayPart: 'all', available: true, deliverable: true, photo: 1 },

  // ── F–I. DRINKS, WATER, JUICE ─────────────────────────────────────────────
  { slug: 'coke', name: 'Coke', category: 'drinks', kind: 'drink', unit: 'PET', price: 800, description: 'Chilled.', dayPart: 'all', available: true, deliverable: true, photo: 4, ref: 23 },
  { slug: 'fanta', name: 'Fanta', category: 'drinks', kind: 'drink', unit: 'PET', price: 800, description: 'Chilled.', dayPart: 'all', available: true, deliverable: true, photo: 4, ref: 24 },
  { slug: 'sprite', name: 'Sprite', category: 'drinks', kind: 'drink', unit: 'PET', price: 800, description: 'Chilled.', dayPart: 'all', available: true, deliverable: true, photo: 4, ref: 25 },
  { slug: 'pepsi', name: 'Pepsi', category: 'drinks', kind: 'drink', unit: 'PET', price: 800, description: 'Chilled.', dayPart: 'all', available: true, deliverable: true, photo: 4, ref: 26 },
  { slug: 'schweppes', name: 'Schweppes', category: 'drinks', kind: 'drink', unit: 'Bottle', price: 900, description: 'Chilled.', dayPart: 'all', available: true, deliverable: true, photo: 4, ref: 27,
    variants: [ { id: 'pet', label: 'PET', price: 900 }, { id: 'can', label: 'Can', price: 1000 } ] },
  { slug: 'pulpy', name: 'Pulpy', category: 'drinks', kind: 'drink', unit: 'Bottle', price: 900, description: 'Chilled.', dayPart: 'all', available: true, deliverable: true, photo: 4, ref: 28,
    variants: [ { id: 'small', label: 'Small', price: 900 }, { id: 'big', label: 'Big', price: 1400 } ] },
  { slug: 'maltina', name: 'Maltina', category: 'drinks', kind: 'drink', unit: 'Bottle', price: 900, description: 'Chilled malt drink.', dayPart: 'all', available: true, deliverable: true, photo: 4, ref: 30,
    variants: [ { id: 'small', label: 'Small', price: 900 }, { id: 'big', label: 'Big', price: 1400 }, { id: 'can', label: 'Can', price: 1000 } ] },
  { slug: 'sossa', name: 'Sossa', category: 'drinks', kind: 'drink', unit: 'Bottle', price: 700, description: 'Chilled.', dayPart: 'all', available: true, deliverable: true, photo: 4, ref: 32,
    variants: [ { id: 'small', label: 'Small', price: 700 }, { id: 'big', label: 'Big', price: 1100 } ] },
  { slug: 'fayrous', name: 'Fayrous', category: 'drinks', kind: 'drink', unit: 'Can', price: 1200, description: 'Chilled.', dayPart: 'all', available: true, deliverable: true, photo: 4, ref: 35 },
  // TODO(MacBite): confirm the correct brand name and the flavour options for this line.
  // Catalog line 37 read "Dudu Osun Drink" and was flagged for confirmation.
  // The photo supplied for it is a Dudu-brand yoghurt can — "Dudu Osun" is a
  // black soap, so that was a transcription slip. Renamed to match the tin.
  // TODO(MacBite): confirm, and confirm the flavour options.
  { slug: 'dudu-yoghurt', name: 'Dudu Yoghurt', category: 'drinks', kind: 'drink', unit: 'Can', price: 1000, description: 'Chilled yoghurt drink.', dayPart: 'all', available: true, deliverable: true, photo: 4, ref: 37,
    variants: [ { id: 'can', label: 'Can', price: 1000 }, { id: 'plastic', label: 'Plastic', price: 900 } ] },
  { slug: 'yogurt', name: 'Viju Yoghurt', category: 'drinks', kind: 'drink', unit: 'Bottle', price: 1200, description: 'Viju baked yoghurt, chilled.', dayPart: 'all', available: true, deliverable: true, photo: 4, ref: 38 },
  { slug: 'bottled-water', name: 'Bottled Water', category: 'drinks', kind: 'drink', unit: 'Bottle', price: 300, description: 'Chilled bottled water.', dayPart: 'all', available: true, deliverable: true, photo: 4, ref: 41,
    variants: [ { id: 'eva', label: 'Eva', price: 300 }, { id: 'cway', label: 'Cway', price: 300 }, { id: 'mrv', label: 'Mr V', price: 300 } ] },
  { slug: 'chivita', name: 'Chivita', category: 'drinks', kind: 'drink', unit: '1L', price: 2500, description: 'Fruit juice, 1 litre.', dayPart: 'all', available: true, deliverable: true, photo: 4, ref: 44 },
  { slug: 'active', name: 'Chivita Active', category: 'drinks', kind: 'drink', unit: '1L', price: 2200, description: 'Citrus mix fruit juice, 1 litre.', dayPart: 'all', available: true, deliverable: true, photo: 4, ref: 45 },
  { slug: 'exotic', name: 'Exotic', category: 'drinks', kind: 'drink', unit: 'Bottle', price: 1500, description: 'Fruit juice.', dayPart: 'all', available: true, deliverable: true, photo: 4, ref: 46,
    variants: [ { id: '500ml', label: '500ml', price: 1500 }, { id: '1l', label: '1L', price: 2600 } ] },
  { slug: 'hollandia', name: 'Hollandia', category: 'drinks', kind: 'drink', unit: 'Bottle', price: 1500, description: 'Yoghurt drink.', dayPart: 'all', available: true, deliverable: true, photo: 4, ref: 48,
    variants: [ { id: '500ml', label: '500ml', price: 1500 }, { id: '1l', label: '1L', price: 2800 } ] },
];

// ── Derived lookups ─────────────────────────────────────────────────────────

export const BY_SLUG: Record<string, MenuItem> = Object.fromEntries(MENU.map((i) => [i.slug, i]));

export const bySlug = (slug: string): MenuItem | undefined => BY_SLUG[slug];

export const inCategory = (id: CategoryId): MenuItem[] => MENU.filter((i) => i.category === id);

/** Items a base can be built with. TODO(MacBite): pairing rules — not every protein suits every base. */
export const PROTEINS = MENU.filter((i) => i.kind === 'protein');
export const SIDES = MENU.filter((i) => i.kind === 'side');
export const BASES = MENU.filter((i) => i.kind === 'base');

/** TODO(MacBite): can a customer take more than one protein on a plate, and is there a cap? */
export const PROTEIN_SELECT_MODE: 'single' | 'multi' = 'multi';
export const PROTEIN_MAX = 4;

export const POPULAR = MENU.filter((i) => i.popular).slice(0, 6);

/** A base carries modifiers; a drink does not. Drives whether we route to the builder. */
export const isBuildable = (item: MenuItem): boolean => item.kind === 'base';

/**
 * Which placeholder treatment an item gets while photography is outstanding.
 * Cycled by position in MENU rather than hashed from the slug, so neighbouring
 * tiles in a grid never land on the same colour.
 */
const TONE_INDEX: Record<string, number> = Object.fromEntries(MENU.map((i, n) => [i.slug, n % 5]));
export const placeholderTone = (slug: string): number => TONE_INDEX[slug] ?? 0;

export const startingPrice = (item: MenuItem): number | null => {
  if (item.variants?.length) {
    const prices = item.variants.map((v) => v.price).filter((p): p is number => p != null);
    return prices.length ? Math.min(...prices) : null;
  }
  return item.price;
};
