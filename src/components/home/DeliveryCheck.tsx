import { useMemo, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { ZONES, BAND_LABEL, minimumFor, type Zone } from '@/data/zones';
import { useCart } from '@/lib/cart';
import { money, cx } from '@/lib/format';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';

const BANDS: Zone['band'][] = [1, 2, 3];

export function DeliveryCheck() {
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState<Zone | null>(null);
  const setZone = useCart((s) => s.setZone);
  const setMode = useCart((s) => s.setMode);

  const term = query.trim().toLowerCase();
  const matches = useMemo(
    () =>
      term
        ? ZONES.filter(
            (z) => z.name.toLowerCase().includes(term) || z.aliases?.some((a) => a.toLowerCase().includes(term)),
          )
        : ZONES,
    [term],
  );

  const noMatch = term.length > 1 && matches.length === 0;

  function choose(zone: Zone) {
    setPicked(zone);
    setZone(zone.id);
    setMode('delivery');
  }

  return (
    <section
      id="delivery-check"
      aria-labelledby="delivery-check-title"
      className="shell relative z-10 mt-16 pb-20 sm:mt-20 sm:pb-24 lg:mt-24"
    >
      <Reveal className="grain overflow-hidden rounded-3xl bg-white shadow-lift-lg ring-1 ring-ink/8 sm:rounded-[2rem]">
        <div className="grid gap-0 lg:grid-cols-[1fr_1.35fr]">
          {/* Left: the ask. */}
          <div className="flex flex-col bg-gradient-to-br from-deep to-brand-700 p-8 text-cream sm:p-10" data-on-dark>
            <p className="eyebrow text-gold">Before you start</p>
            <h2 id="delivery-check-title" className="display-md mt-3 text-white">
              Do we reach you?
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/75">
              Pick your area and we'll show you the delivery fee and the minimum order before
              you put anything in the basket.
            </p>
            <span className="grow" aria-hidden="true" />
            <p className="mt-auto border-t border-cream/15 pt-5 text-sm text-cream/60">
              Not on the list? You can still order ahead and collect at Cele bus stop.
            </p>
          </div>

          {/* Right: the answer. */}
          <div className="p-6 sm:p-8 lg:p-10">
            <label htmlFor="zone-search" className="eyebrow text-ink-3">
              Your area in Ibadan
            </label>
            <div className="relative mt-3">
              <svg
                aria-hidden="true" viewBox="0 0 20 20"
                className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-3"
                fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"
              >
                <circle cx="9" cy="9" r="5.5" /><path d="m13.5 13.5 3 3" />
              </svg>
              <input
                id="zone-search"
                type="search"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPicked(null); }}
                placeholder="Bodija, Challenge, Iwo Road…"
                autoComplete="off"
                spellCheck={false}
                className="h-13 w-full rounded-2xl border border-ink/12 bg-cream/60 py-3.5 pl-11 pr-4 text-base text-ink outline-none transition-colors placeholder:text-ink-3/60 focus:border-brand focus:bg-white"
              />
            </div>

            <AnimatePresence mode="wait">
              {picked ? (
                <m.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-6 rounded-2xl border border-leaf/25 bg-leaf/6 p-5 sm:p-6"
                >
                  <p className="flex items-center gap-2 font-display text-2xl font-800 text-ink">
                    <svg viewBox="0 0 20 20" className="h-5 w-5 text-leaf" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m4 10.5 4 4 8-9" />
                    </svg>
                    Yes — we deliver to {picked.name}.
                  </p>
                  <dl className="mt-5 grid grid-cols-3 gap-4 border-t border-ink/10 pt-5">
                    <div>
                      <dt className="eyebrow text-ink-3">Fee</dt>
                      <dd className="mt-1 font-display text-xl font-800 text-ink">
                        {picked.fee == null ? 'On WhatsApp' : money(picked.fee)}
                      </dd>
                    </div>
                    <div>
                      <dt className="eyebrow text-ink-3">Typical</dt>
                      <dd className="mt-1 font-display text-xl font-800 text-ink">{picked.eta}</dd>
                    </div>
                    <div>
                      <dt className="eyebrow text-ink-3">Minimum</dt>
                      <dd className="mt-1 font-display text-xl font-800 text-ink">{money(minimumFor(picked))}</dd>
                    </div>
                  </dl>
                  <ButtonLink to="/menu" size="lg" className="mt-6 w-full sm:w-auto" arrow>
                    Start your order
                  </ButtonLink>
                </m.div>
              ) : noMatch ? (
                <m.div
                  key="nomatch"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 rounded-2xl border border-gold/40 bg-gold/10 p-5 sm:p-6"
                >
                  <p className="font-display text-xl font-800 text-ink">
                    We don't deliver there yet.
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">
                    You can still order ahead and pick up at Cele bus stop, Old Ife Road — your
                    food will be packed and waiting.
                  </p>
                  <ButtonLink
                    to="/menu"
                    variant="gold"
                    size="md"
                    className="mt-5"
                    onClick={() => setMode('pickup')}
                    arrow
                  >
                    Order for pickup
                  </ButtonLink>
                </m.div>
              ) : (
                <m.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-6">
                  <p className="text-sm text-ink-3">Choose your area to see the fee and minimum order.</p>
                  <div className="mt-4 max-h-64 space-y-4 overflow-y-auto pr-1">
                    {BANDS.map((band) => {
                      const inBand = matches.filter((z) => z.band === band);
                      if (!inBand.length) return null;
                      return (
                        <div key={band}>
                          <p className="eyebrow text-ink-3/70">{BAND_LABEL[band]}</p>
                          <ul className="mt-2.5 flex flex-wrap gap-2">
                            {inBand.map((z) => (
                              <li key={z.id}>
                                <button
                                  type="button"
                                  onClick={() => choose(z)}
                                  className={cx(
                                    'rounded-full border border-ink/12 bg-cream px-3.5 py-2 text-sm font-medium text-ink-2',
                                    'transition-all duration-200 hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-white',
                                  )}
                                >
                                  {z.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
