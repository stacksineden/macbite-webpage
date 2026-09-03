import { useCart, type OrderMode } from '@/lib/cart';
import { useHydrated } from '@/lib/useHydrated';
import { cx } from '@/lib/format';

const OPTIONS: { id: OrderMode; label: string }[] = [
  { id: 'delivery', label: 'Delivery' },
  { id: 'pickup', label: 'Pickup' },
];

/**
 * Sits where the reference puts its decorative switch — but this one sets the
 * order mode for the whole session, so the delivery check, the cart and the
 * WhatsApp message all start from the customer's actual intent.
 */
export function ModeToggle({ tone = 'onDark' }: { tone?: 'onDark' | 'onLight' }) {
  const hydrated = useHydrated();
  const mode = useCart((s) => s.mode);
  const setMode = useCart((s) => s.setMode);
  const active = hydrated ? mode : 'delivery';
  const dark = tone === 'onDark';
  const activeIndex = OPTIONS.findIndex((o) => o.id === active);

  return (
    <div className={cx('flex items-center gap-3', dark ? 'text-white/70' : 'text-ink-3')}>
      <span className="eyebrow hidden sm:inline">I want</span>

      <div
        role="radiogroup"
        aria-label="Order mode"
        className={cx(
          'relative flex rounded-full p-1',
          dark ? 'bg-white/10 ring-1 ring-white/25 backdrop-blur-md' : 'bg-ink/5 ring-1 ring-ink/10',
        )}
      >
        {/* The moving pill is one CSS-transformed element. Both options are
            half-width, so translateX(100%) lands it exactly on the second —
            no layout-animation feature needed in the bundle. */}
        <span
          aria-hidden="true"
          className={cx(
            'absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full transition-transform duration-300 ease-[var(--ease-out-soft)]',
            dark ? 'bg-gold' : 'bg-brand',
          )}
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
        />

        {OPTIONS.map((o) => {
          const on = active === o.id;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setMode(o.id)}
              className={cx(
                'relative z-10 flex-1 basis-1/2 rounded-full px-4 py-1.5 text-center text-sm font-semibold transition-colors sm:px-5',
                on ? (dark ? 'text-ink' : 'text-white') : dark ? 'text-white/70 hover:text-white' : 'text-ink-3 hover:text-ink',
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
