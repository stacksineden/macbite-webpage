import { Link } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { useCart } from '@/lib/cart';
import { useHydrated } from '@/lib/useHydrated';
import { cx } from '@/lib/format';

export function CartButton({ dark }: { dark?: boolean }) {
  const hydrated = useHydrated();
  const count = useCart((s) => s.lines.reduce((n, l) => n + l.qty, 0));
  const showing = hydrated ? count : 0;

  return (
    <Link
      to="/cart"
      aria-label={showing ? `Your order — ${showing} item${showing === 1 ? '' : 's'}` : 'Your order — empty'}
      className={cx(
        'relative grid h-10 w-10 place-items-center rounded-full transition-colors',
        dark ? 'bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/20' : 'bg-ink/5 text-ink hover:bg-ink/10',
      )}
    >
      <svg viewBox="0 0 20 20" className="h-[18px] w-[18px]" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 5.5h2l1.6 8.2a1.4 1.4 0 0 0 1.4 1.1h6.2a1.4 1.4 0 0 0 1.4-1.1L17 8H5.6" />
        <circle cx="8.5" cy="17" r="0.9" fill="currentColor" stroke="none" />
        <circle cx="14.5" cy="17" r="0.9" fill="currentColor" stroke="none" />
      </svg>
      <AnimatePresence>
        {showing > 0 && (
          <m.span
            key={showing}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 520, damping: 24 }}
            className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 font-mono text-[0.625rem] font-bold text-white ring-2 ring-cream"
          >
            {showing > 99 ? '99+' : showing}
          </m.span>
        )}
      </AnimatePresence>
    </Link>
  );
}
