import { useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { FAQS } from '@/data/faq';
import { Reveal } from '@/components/ui/Reveal';
import { cx } from '@/lib/format';

export function Faq({ items = FAQS }: { items?: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section aria-labelledby="faq-title" className="shell pb-20 sm:pb-28">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <Reveal>
          <p className="eyebrow text-brand">Good to know</p>
          <h2 id="faq-title" className="display-lg mt-4 text-ink">Questions we get asked.</h2>
        </Reveal>

        <Reveal delay={0.06}>
          <ul className="divide-y divide-ink/10 border-y border-ink/10">
            {items.map((f, i) => {
              const isOpen = open === i;
              return (
                <li key={f.q}>
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      className="flex w-full items-center justify-between gap-6 py-5 text-left"
                    >
                      <span className={cx('font-display text-xl font-800 transition-colors sm:text-2xl', isOpen ? 'text-brand' : 'text-ink')}>
                        {f.q}
                      </span>
                      <span className={cx('grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-300', isOpen ? 'rotate-45 bg-brand text-white' : 'bg-ink/5 text-ink')}>
                        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                          <path d="M8 3v10M3 8h10" />
                        </svg>
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <m.div
                        id={`faq-panel-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 pr-12 text-[0.95rem] leading-relaxed text-ink-2">{f.a}</p>
                      </m.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
