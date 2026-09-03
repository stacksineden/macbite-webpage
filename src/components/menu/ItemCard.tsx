import { Link } from 'react-router-dom';
import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { type MenuItem, isBuildable, startingPrice } from '@/data/menu';
import { ItemPhoto } from './ItemPhoto';
import { useCart, lineKey } from '@/lib/cart';
import { money, cx } from '@/lib/format';

/**
 * One product tile. A base routes to the builder (it has options to choose);
 * a drink, side or protein adds straight to the order, because making someone
 * open a page to add a Coke is how you lose the order.
 */
export function ItemCard({ item, index = 0 }: { item: MenuItem; index?: number }) {
  const add = useCart((s) => s.add);
  const [justAdded, setJustAdded] = useState(false);
  const buildable = isBuildable(item);
  const from = startingPrice(item);
  const href = `/item/${item.slug}`;

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    const base = {
      slug: item.slug,
      name: item.name,
      unit: item.unit,
      variantLabel: item.variants?.[0]?.label,
      basePrice: item.variants?.[0]?.price ?? item.price,
      proteins: [],
      sides: [],
      qty: 1,
      deliverable: item.deliverable,
    };
    add({ ...base, id: lineKey(base) });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  }

  return (
    <m.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.5, delay: Math.min(index, 7) * 0.045, ease: [0.22, 1, 0.36, 1] }}
      className={cx(
        'group relative flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-ink/8 transition-all duration-400 ease-[var(--ease-out-soft)]',
        item.available ? 'hover:-translate-y-1 hover:shadow-lift-lg' : 'opacity-70',
      )}
    >
      <Link to={href} className="relative block aspect-[4/3] overflow-hidden" tabIndex={-1} aria-hidden="true">
        <ItemPhoto
          slug={item.slug}
          name={item.name}
          sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 28vw, 45vw"
          className="h-full w-full transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-105"
        />
        {!item.available && (
          <span className="absolute inset-0 grid place-items-center bg-ink/70 font-display text-lg font-800 text-cream">
            Sold out for today
          </span>
        )}
        {item.available && !item.deliverable && (
          <span className="eyebrow absolute left-3 top-3 rounded-full bg-cream/95 px-2.5 py-1.5 text-ink-2">
            Pickup only
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="font-display text-xl font-800 leading-tight text-ink sm:text-2xl">
          <Link to={href} className="after:absolute after:inset-0 after:content-[''] hover:text-brand">
            {item.name}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-3">{item.description}</p>

        <div className="relative z-10 mt-4 flex flex-col gap-2.5 sm:mt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          {/* Unit sits on its own line rather than after a slash: in a
              two-up card on a phone "/ plate" wrapped and left the slash
              dangling at the end of the price. */}
          <p className="font-display text-lg font-800 leading-tight text-ink sm:text-xl">
            {buildable && from != null && <span className="mr-1 text-sm font-600 text-ink-3">from</span>}
            {money(from)}
            <span className="mt-0.5 block font-sans text-xs font-500 text-ink-3">
              per {item.unit.toLowerCase()}
            </span>
          </p>

          {item.available && (
            buildable ? (
              <Link
                to={href}
                className="w-full shrink-0 rounded-full bg-ink px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-brand sm:w-auto"
              >
                Build it
              </Link>
            ) : (
              <button
                type="button"
                onClick={quickAdd}
                aria-label={`Add ${item.name} to your order`}
                className={cx(
                  'relative w-full shrink-0 overflow-hidden rounded-full px-4 py-2 text-center text-sm font-semibold transition-colors sm:w-auto',
                  justAdded ? 'bg-leaf text-white' : 'bg-ink text-white hover:bg-brand',
                )}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <m.span
                    key={justAdded ? 'added' : 'add'}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -12, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="block"
                  >
                    {justAdded ? 'Added ✓' : 'Add'}
                  </m.span>
                </AnimatePresence>
              </button>
            )
          )}
        </div>
      </div>
    </m.article>
  );
}
