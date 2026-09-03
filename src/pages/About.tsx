import { Seo } from '@/lib/seo';
import { restaurantSchema, breadcrumbSchema } from '@/lib/schema';
import { ADDRESS, PHONE_DISPLAY, PHONE_TEL } from '@/config/site';
import { SmartImage } from '@/components/ui/SmartImage';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { whatsappEnquiry } from '@/lib/whatsapp';

export default function About() {
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }];

  return (
    <>
      <Seo
        title="About"
        description={`MacBite is a fast food kitchen at ${ADDRESS.street}, ${ADDRESS.area}, Ibadan — rice, swallow, proteins and sides cooked through the day, eaten in or delivered. Dining room, games centre and sport on the big screen.`}
        path="/about"
        jsonLd={[restaurantSchema(), breadcrumbSchema(crumbs)]}
      />

      <PageHeader
        eyebrow="About MacBite"
        title="An everyday kitchen, cooking all day."
        lead="No reinvention, no ceremony. Food you'd actually eat twice a week, made properly and priced for it."
        crumbs={crumbs}
      />

      <div className="shell pb-24">
        <Reveal className="mt-6">
          <SmartImage
            name="counter"
            alt="The MacBite service counter in Ibadan, with the pastry cabinet and the branded overhead sign"
            sizes="(min-width: 1024px) 80vw, 100vw"
            className="aspect-[16/10] rounded-3xl shadow-lift-lg sm:aspect-[21/9]"
          />
        </Reveal>

        <div className="mt-20 grid gap-14 lg:grid-cols-3 lg:gap-10">
          <Reveal>
            <h2 className="display-md text-ink">What we do</h2>
            <p className="mt-5 leading-relaxed text-ink-2">
              A fast food kitchen at Cele bus stop serving Ibadan. Rice, swallow, proteins
              and sides, cooked through the day, eaten in or delivered.
            </p>
            <p className="mt-4 leading-relaxed text-ink-2">
              The kitchen counts a base and a protein separately, so we let you order the
              same way — pick your plate, then build it out exactly as much as you want.
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <h2 className="display-md text-ink">The room</h2>
            <p className="mt-5 leading-relaxed text-ink-2">
              Sit-down dining downstairs, a games centre upstairs, and the match on the big
              screen when there's one on. It's a room people stay in rather than pass
              through — which is why weekends fill up early.
            </p>
          </Reveal>

          <Reveal delay={0.12} className="scroll-mt-32" >
            <div id="catering">
              <h2 className="display-md text-ink">Catering</h2>
              <p className="mt-5 leading-relaxed text-ink-2">
                We cater outdoor events and parties from the same kitchen. Catering is
                quoted per event rather than ordered online — tell us the date, the
                headcount and where you are, and we'll come back with a number.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink to={whatsappEnquiry('I would like a catering quote.')} variant="gold" size="md" arrow>
                  Ask for a quote
                </ButtonLink>
                <ButtonLink to={`tel:${PHONE_TEL}`} variant="outline" size="md">{PHONE_DISPLAY}</ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>

        {/*
          TODO(MacBite): the founding story — when they opened, who runs it, where
          the name came from — has to come from MacBite. Nothing invented here.
        */}
      </div>
    </>
  );
}
