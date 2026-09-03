import { Link } from 'react-router-dom';
import { BREAKFAST_ENABLED } from '@/config/site';
import { currentDayPart, type DayPartKey } from '@/lib/hours';
import { cx } from '@/lib/format';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { useHydrated } from '@/lib/useHydrated';

interface Card { id: DayPartKey; title: string; line: string; to: string }

const ALL: Card[] = [
  // Breakfast stays behind BREAKFAST_ENABLED — no breakfast lines exist on the
  // inventory sheet yet, so shipping the card would advertise a service that
  // may not run. Flip the flag in config/site.ts and it appears.
  { id: 'breakfast', title: 'Breakfast', line: 'Start the day properly.', to: '/menu' },
  { id: 'lunch', title: 'Lunch', line: 'Rice, swallow, and everything that goes with it.', to: '/menu/main-dishes' },
  { id: 'dinner', title: 'Dinner', line: "Same kitchen, later. We're on until 8pm.", to: '/menu' },
];

export function DayParts() {
  const hydrated = useHydrated();
  const cards = ALL.filter((c) => c.id !== 'breakfast' || BREAKFAST_ENABLED);
  const now = currentDayPart();

  return (
    <section aria-labelledby="dayparts-title" className="shell pb-20 sm:pb-28">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-brand">Order by time of day</p>
          <h2 id="dayparts-title" className="display-lg mt-4 text-ink">Cooking right now.</h2>
        </div>
        <Link to="/menu" className="font-semibold text-ink underline decoration-brand decoration-2 underline-offset-4 hover:text-brand">
          See the full menu
        </Link>
      </Reveal>

      <RevealGroup as="ul" className={cx('mt-12 grid gap-5', cards.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2')}>
        {cards.map((c) => {
          const active = hydrated && now === c.id;
          return (
            <RevealItem as="li" key={c.id}>
              <Link
                to={c.to}
                className={cx(
                  'group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-8 transition-all duration-400 ease-[var(--ease-out-soft)] hover:-translate-y-1 sm:p-9',
                  active
                    ? 'bg-gradient-to-br from-brand to-deep text-cream shadow-lift-lg'
                    : 'bg-white text-ink shadow-lift ring-1 ring-ink/8 hover:shadow-lift-lg',
                )}
                {...(active ? { 'data-on-dark': '' } : {})}
              >
                {/* Rendered on every card, invisible when inactive, so the
                    cards keep matching heights instead of leaving a void. */}
                <span
                  className={cx(
                    'eyebrow inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1',
                    active ? 'bg-gold text-ink' : 'invisible',
                  )}
                  aria-hidden={!active}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-ink" />
                  Serving now
                </span>
                <div className="mt-8">
                  <h3 className={cx('font-display text-4xl font-900', active ? 'text-white' : 'text-ink')}>{c.title}</h3>
                  <p className={cx('mt-2.5 text-[0.95rem] leading-relaxed', active ? 'text-cream/80' : 'text-ink-3')}>{c.line}</p>
                </div>
                <span className={cx('mt-8 inline-flex items-center gap-2 text-sm font-semibold', active ? 'text-gold' : 'text-brand')}>
                  Order
                  <svg viewBox="0 0 16 16" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
                  </svg>
                </span>
              </Link>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </section>
  );
}
