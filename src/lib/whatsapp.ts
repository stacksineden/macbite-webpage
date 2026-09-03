import { WHATSAPP_NUMBER, PRICING_STATUS, SITE } from '@/config/site';
import { zoneById } from '@/data/zones';
import { money } from '@/lib/format';
import { lineTotal, type CartLine, type CartTotals, type OrderMode } from '@/lib/cart';

export interface CustomerDetails {
  name: string;
  phone: string;
  /** Delivery only. */
  address?: string;
  landmark?: string;
  note?: string;
  /** Honeypot — real customers never fill this. */
  company?: string;
}

/** Short human-quotable reference so staff and customer can name the same order. */
export function orderRef(seed = Date.now()): string {
  const alphabet = 'ACDEFGHJKLMNPQRTUVWXY349';
  let n = Math.abs(Math.floor(seed / 1000)) % (24 ** 4);
  let out = '';
  for (let i = 0; i < 4; i++) {
    out = alphabet[n % alphabet.length] + out;
    n = Math.floor(n / alphabet.length);
  }
  return `MB-${out}`;
}

const bullet = '•';

function describeLine(line: CartLine): string {
  const head = `${line.qty} × ${line.name}${line.variantLabel ? ` (${line.variantLabel})` : ''}`;
  const bits: string[] = [];
  if (line.soupName) bits.push(`soup: ${line.soupName}`);
  if (line.proteins.length) bits.push(line.proteins.map((p) => p.name + (p.variantLabel ? ` ${p.variantLabel}` : '')).join(', '));
  if (line.sides.length) bits.push(line.sides.map((s) => s.name).join(', '));
  const detail = bits.length ? `\n     ${bits.join(' · ')}` : '';
  const note = line.note ? `\n     note: ${line.note}` : '';
  const price = lineTotal(line);
  const priceStr = price == null ? '— to confirm' : money(price);
  return `${bullet} ${head}${detail}${note}\n     ${priceStr}`;
}

/**
 * Builds the message the customer sends. This is the whole checkout, so it has
 * to be readable at a glance on a busy kitchen's phone.
 */
export function buildOrderMessage(args: {
  lines: CartLine[];
  totals: CartTotals;
  mode: OrderMode;
  zoneId: string | null;
  customer: CustomerDetails;
  ref: string;
}): string {
  const { lines, totals, mode, zoneId, customer, ref } = args;
  const zone = zoneId ? zoneById(zoneId) : undefined;

  const parts: string[] = [];
  parts.push(`*New order — ${ref}*`);
  parts.push(`_via ${SITE.url.replace(/^https?:\/\//, '')}_`);
  parts.push('');
  parts.push(`*${mode === 'delivery' ? 'DELIVERY' : 'PICKUP'}*${zone ? ` — ${zone.name}` : ''}`);
  parts.push('');

  parts.push('*Order*');
  for (const line of lines) parts.push(describeLine(line));
  parts.push('');

  parts.push('*Totals*');
  parts.push(`Subtotal: ${totals.subtotal == null ? '— to confirm' : money(totals.subtotal)}`);
  if (mode === 'delivery') {
    parts.push(`Delivery${zone ? ` (${zone.name})` : ''}: ${totals.deliveryFee == null ? '— to confirm' : money(totals.deliveryFee)}`);
  }
  if (totals.packFee > 0) parts.push(`Pack: ${money(totals.packFee)}`);
  parts.push(`*Total: ${totals.total == null ? 'to be confirmed' : money(totals.total)}*`);
  parts.push('');

  parts.push('*Customer*');
  parts.push(`Name: ${customer.name}`);
  parts.push(`Phone: ${customer.phone}`);
  if (mode === 'delivery') {
    if (customer.address) parts.push(`Address: ${customer.address}`);
    if (customer.landmark) parts.push(`Landmark: ${customer.landmark}`);
  } else {
    parts.push('Picking up at Cele bus stop, Old Ife Road.');
  }
  if (customer.note) parts.push(`Note: ${customer.note}`);

  if (PRICING_STATUS === 'draft' || totals.hasQuoteItems || totals.total == null) {
    parts.push('');
    parts.push('_Please confirm the final total before the kitchen starts._');
  }

  return parts.join('\n');
}

/** Strips anything that isn't a digit — wa.me rejects `+`, spaces and dashes. */
export const normalizeWaNumber = (n: string): string => n.replace(/\D/g, '');

export function whatsappUrl(message: string, number: string = WHATSAPP_NUMBER): string {
  return `https://wa.me/${normalizeWaNumber(number)}?text=${encodeURIComponent(message)}`;
}

/** A pre-filled enquiry that isn't a full order — used by Contact and Catering. */
export function whatsappEnquiry(topic: string): string {
  return whatsappUrl(`Hello MacBite — ${topic}`);
}

/** Basic Nigerian mobile check: 070/080/081/090/091 + 8, or +234 form. */
export function isValidNgPhone(input: string): boolean {
  const d = input.replace(/\D/g, '');
  if (/^0[789][01]\d{8}$/.test(d)) return true;
  if (/^234[789][01]\d{8}$/.test(d)) return true;
  return false;
}
