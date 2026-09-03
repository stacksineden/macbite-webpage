import { PRICING_STATUS } from '@/config/site';
import { cx } from '@/lib/format';

/**
 * Standing honesty note while prices are unconfirmed. Disappears everywhere the
 * moment PRICING_STATUS flips to 'confirmed' in src/config/site.ts.
 */
export function PricingNote({ className, tone = 'light' }: { className?: string; tone?: 'light' | 'dark' }) {
  if (PRICING_STATUS === 'confirmed') return null;
  return (
    <p
      className={cx(
        'flex items-start gap-2.5 rounded-2xl px-4 py-3 text-sm leading-relaxed',
        tone === 'dark' ? 'bg-white/10 text-cream/85' : 'bg-gold/12 text-ink-2',
        className,
      )}
    >
      <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" fill="currentColor" aria-hidden="true">
        <path d="M10 1.8a8.2 8.2 0 1 0 0 16.4 8.2 8.2 0 0 0 0-16.4Zm0 3.6a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Zm1.3 9.1H8.7v-1.2h.8V10h-.8V8.8h2.1v4.5h.5v1.2Z" />
      </svg>
      <span>Prices shown are indicative. We confirm the final total with you on WhatsApp before the kitchen starts.</span>
    </p>
  );
}
