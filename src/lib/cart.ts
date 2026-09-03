import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PACK_FEE } from '@/config/site';
import { zoneById, minimumFor } from '@/data/zones';
import { sumOrNull } from '@/lib/format';

export interface LineModifier {
  slug: string;
  name: string;
  variantLabel?: string;
  price: number | null;
}

export interface CartLine {
  /** Stable identity for a base + exact option set, so repeats merge instead of stacking. */
  id: string;
  slug: string;
  name: string;
  unit: string;
  variantLabel?: string;
  basePrice: number | null;
  proteins: LineModifier[];
  sides: LineModifier[];
  soupName?: string;
  note?: string;
  qty: number;
  /** False for items MacBite has said do not travel. Blocks delivery, not pickup. */
  deliverable: boolean;
}

export type OrderMode = 'delivery' | 'pickup';

interface CartState {
  lines: CartLine[];
  mode: OrderMode;
  zoneId: string | null;
  add: (line: Omit<CartLine, 'id'> & { id?: string }) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  setMode: (mode: OrderMode) => void;
  setZone: (zoneId: string | null) => void;
}

/** Deterministic id from the option set — two identical builds collapse into one line. */
export function lineKey(l: Pick<CartLine, 'slug' | 'variantLabel' | 'proteins' | 'sides' | 'soupName' | 'note'>): string {
  return [
    l.slug,
    l.variantLabel ?? '',
    l.proteins.map((p) => `${p.slug}:${p.variantLabel ?? ''}`).sort().join('+'),
    l.sides.map((s) => s.slug).sort().join('+'),
    l.soupName ?? '',
    (l.note ?? '').trim().toLowerCase(),
  ].join('|');
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      mode: 'delivery',
      zoneId: null,

      add: (incoming) =>
        set((state) => {
          const id = incoming.id ?? lineKey(incoming);
          const existing = state.lines.find((l) => l.id === id);
          if (existing) {
            return { lines: state.lines.map((l) => (l.id === id ? { ...l, qty: Math.min(l.qty + incoming.qty, 99) } : l)) };
          }
          return { lines: [...state.lines, { ...incoming, id }] };
        }),

      remove: (id) => set((s) => ({ lines: s.lines.filter((l) => l.id !== id) })),

      setQty: (id, qty) =>
        set((s) => ({
          lines: qty <= 0 ? s.lines.filter((l) => l.id !== id) : s.lines.map((l) => (l.id === id ? { ...l, qty: Math.min(qty, 99) } : l)),
        })),

      clear: () => set({ lines: [] }),
      setMode: (mode) => set({ mode }),
      setZone: (zoneId) => set({ zoneId }),
    }),
    {
      name: 'macbite-cart-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ lines: s.lines, mode: s.mode, zoneId: s.zoneId }),
      version: 1,
    },
  ),
);

// ── Pure selectors, safe to call during SSR ────────────────────────────────

export const linePrice = (l: CartLine): number | null =>
  sumOrNull([l.basePrice, ...l.proteins.map((p) => p.price), ...l.sides.map((s) => s.price)]);

export const lineTotal = (l: CartLine): number | null => {
  const each = linePrice(l);
  return each == null ? null : each * l.qty;
};

export interface CartTotals {
  count: number;
  subtotal: number | null;
  deliveryFee: number | null;
  packFee: number;
  total: number | null;
  /** True when at least one thing in the cart has no confirmed price. */
  hasQuoteItems: boolean;
  minimum: number | null;
  belowMinimumBy: number | null;
  /** Items in the cart that MacBite does not send out for delivery. */
  undeliverable: CartLine[];
}

export function totalsFor(lines: CartLine[], mode: OrderMode, zoneId: string | null): CartTotals {
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = sumOrNull(lines.map(lineTotal));
  const zone = mode === 'delivery' && zoneId ? zoneById(zoneId) : undefined;
  const deliveryFee = mode === 'pickup' ? 0 : zone ? zone.fee : null;
  const packFee = PACK_FEE * (mode === 'pickup' ? 0 : 1);

  const total =
    subtotal == null || deliveryFee == null ? null : subtotal + deliveryFee + packFee;

  const minimum = mode === 'delivery' && zone ? minimumFor(zone) : null;
  const belowMinimumBy =
    minimum != null && subtotal != null && subtotal < minimum ? minimum - subtotal : null;

  return {
    count,
    subtotal,
    deliveryFee,
    packFee,
    total,
    hasQuoteItems: lines.some((l) => linePrice(l) == null),
    minimum,
    belowMinimumBy,
    undeliverable: mode === 'delivery' ? lines.filter((l) => !l.deliverable) : [],
  };
}
