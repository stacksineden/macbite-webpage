import { useLocation } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { useCart, totalsFor } from '@/lib/cart';
import { useHydrated } from '@/lib/useHydrated';
import { money } from '@/lib/format';
import { ButtonLink } from '@/components/ui/Button';

/**
 * Persistent mobile order bar. A cart that scrolls out of reach is the single
 * biggest drop-off on a phone, so once there is anything in it the way to
 * checkout follows the customer down the page.
 */
export function OrderBar() {
  const hydrated = useHydrated();
  const { pathname } = useLocation();
  const lines = useCart((s) => s.lines);
  const mode = useCart((s) => s.mode);
  const zoneId = useCart((s) => s.zoneId);

  const totals = totalsFor(lines, mode, zoneId);
  const onCartRoute = pathname === '/cart' || pathname === '/checkout';
  const show = hydrated && totals.count > 0 && !onCartRoute;

  return (
    <AnimatePresence>
      {show && (
        <m.div
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          exit={{ y: 90 }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          className="fixed inset-x-0 bottom-0 z-40 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
        >
          <div className="flex items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-white shadow-lift-lg">
            <div className="min-w-0 flex-1">
              <p className="eyebrow text-white/55">
                {totals.count} item{totals.count === 1 ? '' : 's'}
              </p>
              <p className="truncate font-display text-xl font-800">
                {totals.subtotal == null ? 'Total on WhatsApp' : money(totals.subtotal)}
              </p>
            </div>
            <ButtonLink to="/cart" variant="gold" size="md" arrow>
              View order
            </ButtonLink>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
