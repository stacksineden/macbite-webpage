import { SITE } from '@/config/site';

const NGN = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
});

/** Money for display. `null` means MacBite hasn't given us a price yet. */
export function money(value: number | null | undefined): string {
  if (value == null) return 'Price on request';
  return NGN.format(value);
}

/** Bare amount, for use inside a sentence that already says naira. */
export function amount(value: number): string {
  return SITE.currencySymbol + value.toLocaleString('en-NG');
}

/** Sums a list where a single `null` makes the whole total unknown. */
export function sumOrNull(values: (number | null)[]): number | null {
  if (values.some((v) => v == null)) return null;
  return values.reduce<number>((a, b) => a + (b as number), 0);
}

export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ');
