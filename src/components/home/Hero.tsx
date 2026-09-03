import { Link } from 'react-router-dom';
import { SmartImage } from '@/components/ui/SmartImage';
import { ButtonLink } from '@/components/ui/Button';
import { ModeToggle } from './ModeToggle';
import { CATEGORIES } from '@/data/menu';
import { ADDRESS } from '@/config/site';

/**
 * Every entrance here is CSS rather than JavaScript. The hero is prerendered
 * and holds the LCP element, so animating it from the motion library would
 * bake `opacity: 0` into the shipped HTML and leave the headline invisible
 * until hydration finished. See the hero block in index.css.
 */
const delay = (seconds: number) => ({ animationDelay: `${seconds}s` });

/** Hand-drawn underline beneath the bottom-left link, as in the reference. */
const Squiggle = () => (
  <svg viewBox="0 0 200 12" className="mt-1 h-2.5 w-full text-gold" fill="none" aria-hidden="true">
    <path d="M1 7c14-5 28 3 42-1s28-6 42-1 28 6 42 2 28-5 42 1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col bg-ink" data-on-dark>
      <div className="hero-zoom absolute inset-0 -z-20 overflow-hidden">
        <SmartImage
          name="hero"
          alt="The MacBite dining room in Ibadan, full of guests eating jollof rice and chicken"
          sizes="100vw"
          priority
          className="h-full w-full"
          width={2752}
          height={1536}
        />
      </div>

      {/* Scrims. Two directions, because the type sits left and the furniture sits bottom. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/90 via-ink/50 to-ink/15" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-ink/90 via-ink/35 to-transparent" />

      <div className="shell relative flex flex-1 flex-col pt-[calc(var(--header-h)+1.5rem)] pb-8">
        <div className="hero-fade hidden items-center gap-4 lg:flex" style={delay(0.85)}>
          <span className="h-px flex-1 border-t border-dashed border-white/25" />
          <span className="eyebrow text-white/60">Start your day right in {ADDRESS.city}</span>
          <span className="h-px flex-1 border-t border-dashed border-white/25" />
        </div>

        <div className="flex flex-1 items-center py-6">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
            <div>
              <h1 className="display-xl text-white">
                {/* pb/-mb pair extends the mask past the baseline so descenders
                    ('y' in Ready / you) are not clipped, without changing leading. */}
                <span className="block overflow-hidden pb-[0.18em] -mb-[0.18em]"><span className="hero-line block" style={delay(0.05)}>Real food.</span></span>
                <span className="block overflow-hidden pb-[0.18em] -mb-[0.18em]"><span className="hero-line block" style={delay(0.16)}>Ready when</span></span>
                <span className="block overflow-hidden pb-[0.18em] -mb-[0.18em]"><span className="hero-line block" style={delay(0.27)}>you are.</span></span>
              </h1>

              <p className="hero-fade mt-7 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg" style={delay(0.5)}>
                Breakfast, lunch and dinner from our kitchen at Cele bus stop — delivered
                across Ibadan or packed and waiting for you.
              </p>

              <div className="hero-fade mt-9 flex flex-wrap items-center gap-3 lg:hidden" style={delay(0.62)}>
                <ButtonLink to="/menu" size="lg" arrow>Order now</ButtonLink>
                <ButtonLink to="#delivery-check" variant="onDark" size="lg">Do we reach you?</ButtonLink>
              </div>
            </div>

            {/* Desktop CTA, mid-right — the reference's Menu/Order block. */}
            <div className="hero-fade hidden justify-self-end lg:block" style={delay(0.55)}>
              <ButtonLink
                to="/menu"
                variant="onDark"
                className="h-auto rounded-2xl px-12 py-7 font-display text-2xl font-800 tracking-tight"
                arrow
              >
                Menu / Order
              </ButtonLink>
              <p className="mt-4 text-right text-sm text-white/55">Delivery across Ibadan · Pickup at Cele</p>
            </div>
          </div>
        </div>

        {/* Bottom row: reference's squiggle link left, order-mode switch right. */}
        <div className="hero-fade flex items-end justify-between gap-6 pb-2 lg:pb-12" style={delay(0.8)}>
          <Link to="#delivery-check" className="group hidden w-fit shrink-0 sm:block">
            <span className="block whitespace-nowrap font-display text-lg font-800 text-white transition-colors group-hover:text-gold">
              Feed the whole house.
            </span>
            <Squiggle />
          </Link>
          <div className="ml-auto"><ModeToggle /></div>
        </div>
      </div>

      {/* Floating category pill, overlapping the hero edge. */}
      <nav
        aria-label="Menu categories"
        className="hero-fade absolute bottom-0 left-1/2 z-20 hidden w-fit max-w-[calc(100%-2.5rem)] -translate-x-1/2 translate-y-1/2 lg:block"
        style={delay(0.95)}
      >
        <ul className="flex items-center gap-1 rounded-full bg-gradient-to-r from-brand via-gold to-brand p-1.5 shadow-lift-lg">
          {CATEGORIES.map((c) => (
            <li key={c.id} className="shrink-0">
              <Link
                to={`/menu/${c.id}`}
                // whitespace-nowrap: with six categories the flex row shrank the
                // items and "Main Dishes" broke across two lines inside its pill.
                className="block whitespace-nowrap rounded-full px-5 py-2.5 font-display text-lg font-800 text-white/95 transition-colors hover:bg-white/20 hover:text-white"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
