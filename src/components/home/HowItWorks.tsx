import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';

/**
 * The base-plus-protein model is unfamiliar to anyone who has only used a
 * fixed-menu site. Explaining it once here prevents abandoned carts later.
 */
const STEPS = [
  { n: '01', title: 'Pick your base.', body: 'Rice, beans, yam porridge, or a wrap of amala, eba or semo.' },
  { n: '02', title: 'Add your protein.', body: 'Chicken, beef, goat meat, fish — as much as you want.' },
  { n: '03', title: 'Tell us where.', body: 'Delivery across Ibadan, or pick up at Cele bus stop.' },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="how-title" className="shell py-20 sm:py-28">
      <Reveal>
        <p className="eyebrow text-brand">How ordering works</p>
        <h2 id="how-title" className="display-lg mt-4 max-w-2xl text-ink">
          Build the plate you actually want.
        </h2>
      </Reveal>

      <RevealGroup as="ul" className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-ink/10 sm:grid-cols-3">
        {STEPS.map((s) => (
          <RevealItem as="li" key={s.n} className="group relative bg-cream p-8 transition-colors duration-300 hover:bg-white sm:p-10">
            <span className="font-mono text-sm font-bold text-brand">{s.n}</span>
            <h3 className="mt-6 font-display text-3xl font-800 text-ink">{s.title}</h3>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-3">{s.body}</p>
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-brand to-gold transition-[width] duration-500 ease-[var(--ease-out-soft)] group-hover:w-full"
            />
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
