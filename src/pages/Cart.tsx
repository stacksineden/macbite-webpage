import { Link } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { Seo } from '@/lib/seo';
import { useCart, totalsFor, lineTotal, type CartLine } from '@/lib/cart';
import { useHydrated } from '@/lib/useHydrated';
import { ZONES, zoneById } from '@/data/zones';
import { money, cx } from '@/lib/format';
import { isAcceptingOrders, hoursLabel } from '@/lib/hours';
import { ButtonLink } from '@/components/ui/Button';
import { ModeToggle } from '@/components/home/ModeToggle';
import { PricingNote } from '@/components/ui/PricingNote';
import { ItemPhoto } from '@/components/menu/ItemPhoto';

export default function Cart() {
  const hydrated = useHydrated();
  const { lines, mode, zoneId, setQty, remove, setZone } = useCart();
  const totals = totalsFor(lines, mode, zoneId);
  const zone = zoneId ? zoneById(zoneId) : undefined;
  const openForOrders = isAcceptingOrders();

  const blocked =
    !openForOrders ||
    (mode === 'delivery' && !zoneId) ||
    (mode === 'delivery' && totals.belowMinimumBy != null) ||
    (mode === 'delivery' && totals.undeliverable.length > 0);

  return (
    <>
      <Seo title="Your order" description="Review your MacBite order before checking out on WhatsApp." path="/cart" noindex />

      <div className="shell py-12 sm:py-16">
        <h1 className="display-lg text-ink">Your order</h1>

        {!hydrated ? (
          <div className="mt-12 h-40 animate-pulse rounded-3xl bg-ink/5" />
        ) : lines.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-ink/20 px-6 py-20 text-center">
            <p className="font-display text-3xl font-800 text-ink">Nothing here yet.</p>
            <p className="mt-3 text-ink-3">Start with a base and build from there.</p>
            <ButtonLink to="/menu" size="lg" className="mt-8" arrow>See the menu</ButtonLink>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-14">
            <ul className="divide-y divide-ink/10 self-start border-y border-ink/10">
              <AnimatePresence initial={false}>
                {lines.map((line) => (
                  <m.li
                    key={line.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <Row line={line} onQty={(q) => setQty(line.id, q)} onRemove={() => remove(line.id)} />
                  </m.li>
                ))}
              </AnimatePresence>
            </ul>

            <aside className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
              <div className="rounded-3xl bg-white p-6 shadow-lift ring-1 ring-ink/8 sm:p-8">
                <h2 className="font-display text-2xl font-800 text-ink">Summary</h2>

                <div className="mt-6"><ModeToggle tone="onLight" /></div>

                {mode === 'delivery' && (
                  <div className="mt-6">
                    <label htmlFor="zone" className="eyebrow text-ink-3">Delivery area</label>
                    <select
                      id="zone"
                      value={zoneId ?? ''}
                      onChange={(e) => setZone(e.target.value || null)}
                      className="mt-2.5 h-12 w-full rounded-2xl border border-ink/12 bg-cream/60 px-4 text-[0.95rem] text-ink outline-none transition-colors focus:border-brand focus:bg-white"
                    >
                      <option value="">Choose your area…</option>
                      {ZONES.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.name}{z.fee != null ? ` — ${money(z.fee)}` : ''}
                        </option>
                      ))}
                    </select>
                    {zone && <p className="mt-2 text-sm text-ink-3">Usually {zone.eta} door to door.</p>}
                  </div>
                )}

                <dl className="mt-7 space-y-3 border-t border-ink/10 pt-6 text-[0.95rem]">
                  <Line label="Subtotal" value={totals.subtotal == null ? 'On WhatsApp' : money(totals.subtotal)} />
                  {mode === 'delivery' && (
                    <Line
                      label={zone ? `Delivery — ${zone.name}` : 'Delivery'}
                      value={!zoneId ? 'Pick an area' : totals.deliveryFee == null ? 'On WhatsApp' : money(totals.deliveryFee)}
                    />
                  )}
                  {totals.packFee > 0 && <Line label="Pack" value={money(totals.packFee)} />}
                  {mode === 'pickup' && <Line label="Pickup at Cele" value="Free" />}
                  <div className="flex items-baseline justify-between border-t border-ink/10 pt-4">
                    <dt className="font-display text-xl font-800 text-ink">Total</dt>
                    <dd className="font-display text-2xl font-800 text-ink">
                      {totals.total == null ? 'On WhatsApp' : money(totals.total)}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 space-y-3">
                  {!openForOrders && (
                    <Notice tone="warn">
                      The kitchen closes at 8pm. Order opens again at {hoursLabel.split('–')[0].trim()}.
                    </Notice>
                  )}
                  {mode === 'delivery' && !zoneId && (
                    <Notice tone="warn">
                      Choose your delivery area above so we can work out the fee.
                    </Notice>
                  )}
                  {mode === 'delivery' && totals.belowMinimumBy != null && (
                    <Notice tone="warn">
                      Add {money(totals.belowMinimumBy)} more to meet the minimum for {zone?.name}.
                    </Notice>
                  )}
                  {mode === 'delivery' && totals.undeliverable.length > 0 && (
                    <Notice tone="warn">
                      {totals.undeliverable.map((l) => l.name).join(', ')} {totals.undeliverable.length === 1 ? "doesn't" : "don't"} travel well —
                      switch to pickup or remove {totals.undeliverable.length === 1 ? 'it' : 'them'} to continue.
                    </Notice>
                  )}
                  <PricingNote />
                </div>

                <ButtonLink
                  to="/checkout"
                  size="lg"
                  className={cx('mt-6 w-full', blocked && 'pointer-events-none opacity-45')}
                  aria-disabled={blocked}
                  arrow
                >
                  Checkout on WhatsApp
                </ButtonLink>
                <Link to="/menu" className="mt-4 block text-center text-sm font-semibold text-ink-3 hover:text-brand">
                  Add something else
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}

function Row({ line, onQty, onRemove }: { line: CartLine; onQty: (q: number) => void; onRemove: () => void }) {
  const detail = [
    line.soupName,
    ...line.proteins.map((p) => p.name + (p.variantLabel ? ` ${p.variantLabel}` : '')),
    ...line.sides.map((s) => s.name),
  ].filter(Boolean);

  return (
    <div className="flex gap-4 py-5 sm:gap-5">
      <ItemPhoto slug={line.slug} name={line.name} compact sizes="96px" className="h-20 w-20 shrink-0 rounded-2xl sm:h-24 sm:w-24" />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-display text-xl font-800 text-ink">
              {line.name}{line.variantLabel && <span className="text-ink-3"> · {line.variantLabel}</span>}
            </h3>
            {detail.length > 0 && <p className="mt-1 text-sm leading-relaxed text-ink-3">{detail.join(' · ')}</p>}
            {line.note && <p className="mt-1 text-sm italic text-ink-3">“{line.note}”</p>}
          </div>
          <p className="shrink-0 font-display text-lg font-800 text-ink">
            {lineTotal(line) == null ? '—' : money(lineTotal(line))}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-1 rounded-full bg-ink/5 p-1">
            <button type="button" aria-label={`Remove one ${line.name}`} onClick={() => onQty(line.qty - 1)} className="grid h-8 w-8 place-items-center rounded-full bg-white font-bold text-ink transition-colors hover:bg-brand hover:text-white">−</button>
            <span className="w-8 text-center text-sm font-bold text-ink">{line.qty}</span>
            <button type="button" aria-label={`Add one ${line.name}`} onClick={() => onQty(line.qty + 1)} className="grid h-8 w-8 place-items-center rounded-full bg-white font-bold text-ink transition-colors hover:bg-brand hover:text-white">+</button>
          </div>
          <button type="button" onClick={onRemove} className="text-sm font-semibold text-ink-3 underline underline-offset-4 hover:text-brand">
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

const Line = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-baseline justify-between gap-4">
    <dt className="text-ink-3">{label}</dt>
    <dd className="font-semibold text-ink">{value}</dd>
  </div>
);

const Notice = ({ children, tone }: { children: React.ReactNode; tone: 'warn' }) => (
  <p className={cx('rounded-2xl px-4 py-3 text-sm leading-relaxed', tone === 'warn' && 'bg-gold/14 text-ink-2')}>
    {children}
  </p>
);
