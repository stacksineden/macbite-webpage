import { SmartImage } from '@/components/ui/SmartImage';
import { Reveal } from '@/components/ui/Reveal';
import { ButtonLink } from '@/components/ui/Button';

/**
 * The only place the amenities appear on the homepage. The games centre and the
 * big screen are reasons to visit, not a second identity — they never enter the
 * ordering flow.
 */
export function TheRoom() {
  return (
    <section aria-labelledby="room-title" className="shell py-20 sm:py-28">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className="order-2 lg:order-1">
          <p className="eyebrow text-brand">The room</p>
          <h2 id="room-title" className="display-lg mt-4 text-ink">
            There's more than takeaway.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-2">
            Sit-down dining, a games centre upstairs, and the match on the big screen.
            Come early on weekends — it fills up.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {['Dine-in seating', 'Games centre', 'Big-screen sport', 'Family tables'].map((t) => (
              <li key={t} className="rounded-full bg-ink/5 px-4 py-2 text-sm font-medium text-ink-2">{t}</li>
            ))}
          </ul>
          <ButtonLink to="/about" variant="outline" size="md" className="mt-9" arrow>
            More about MacBite
          </ButtonLink>
        </Reveal>

        <Reveal className="order-1 lg:order-2" delay={0.08}>
          <SmartImage
            name="room"
            alt="Inside MacBite — dining tables, the counter and the wall-mounted screen"
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="aspect-[4/5] rounded-3xl shadow-lift-lg sm:aspect-[4/3] lg:aspect-[4/5]"
          />
        </Reveal>
      </div>
    </section>
  );
}
