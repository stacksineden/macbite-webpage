import { Seo } from '@/lib/seo';
import { breadcrumbSchema, restaurantSchema } from '@/lib/schema';
import { ZONES, BAND_LABEL, minimumFor, type Zone } from '@/data/zones';
import { money } from '@/lib/format';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { PricingNote } from '@/components/ui/PricingNote';

const BANDS: Zone['band'][] = [1, 2, 3];

export default function Delivery() {
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Delivery', path: '/delivery' }];

  return (
    <>
      <Seo
        title="Delivery areas &amp; fees"
        description="Where MacBite delivers across Ibadan and what it costs — Alakia, Iwo Road, Bodija, Ring Road, Challenge, Dugbe, UI and more. Or order ahead and pick up at Cele bus stop."
        path="/delivery"
        jsonLd={[breadcrumbSchema(crumbs), restaurantSchema()]}
      />

      <PageHeader
        eyebrow="Delivery"
        title="We ride across Ibadan."
        lead="Fees are set by area, not by guesswork. Find yours below — and if you're outside the list, order ahead and collect at Cele bus stop instead."
        crumbs={crumbs}
      />

      <div className="shell pb-24">
        <PricingNote className="max-w-2xl" />

        <div className="mt-12 space-y-14">
          {BANDS.map((band) => {
            const zones = ZONES.filter((z) => z.band === band);
            if (!zones.length) return null;
            return (
              <Reveal key={band} as="section">
                <h2 className="display-md text-ink">{BAND_LABEL[band]}</h2>
                <div className="mt-7 overflow-hidden rounded-3xl ring-1 ring-ink/10">
                  <table className="w-full border-collapse text-left">
                    <caption className="sr-only-focusable">Delivery fees for {BAND_LABEL[band].toLowerCase()}</caption>
                    <thead className="bg-ink/4">
                      <tr>
                        <th scope="col" className="eyebrow px-5 py-4 text-ink-3 sm:px-6">Area</th>
                        <th scope="col" className="eyebrow px-5 py-4 text-right text-ink-3 sm:px-6">Fee</th>
                        <th scope="col" className="eyebrow hidden px-5 py-4 text-right text-ink-3 sm:table-cell sm:px-6">Typical time</th>
                        <th scope="col" className="eyebrow hidden px-5 py-4 text-right text-ink-3 sm:table-cell sm:px-6">Minimum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/8 bg-white">
                      {zones.map((z) => (
                        <tr key={z.id} className="transition-colors hover:bg-cream/70">
                          <th scope="row" className="px-5 py-4 font-display text-lg font-800 text-ink sm:px-6">
                            {z.name}
                            <span className="block font-sans text-sm font-400 text-ink-3 sm:hidden">{z.eta} · min {money(minimumFor(z))}</span>
                          </th>
                          <td className="px-5 py-4 text-right font-semibold text-ink sm:px-6">
                            {z.fee == null ? 'On WhatsApp' : money(z.fee)}
                          </td>
                          <td className="hidden px-5 py-4 text-right text-ink-3 sm:table-cell sm:px-6">{z.eta}</td>
                          <td className="hidden px-5 py-4 text-right text-ink-3 sm:table-cell sm:px-6">{money(minimumFor(z))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-16 rounded-3xl bg-ink p-8 text-cream sm:p-12" >
          <div data-on-dark className="flex flex-wrap items-center justify-between gap-8">
            <div className="max-w-md">
              <h2 className="display-md text-white">Not on the list?</h2>
              <p className="mt-4 leading-relaxed text-cream/75">
                We don't deliver everywhere yet. Order ahead for pickup and your food will be
                packed and waiting at Cele bus stop — no fee, no minimum.
              </p>
            </div>
            <ButtonLink to="/menu" variant="gold" size="lg" arrow>Order for pickup</ButtonLink>
          </div>
        </Reveal>
      </div>
    </>
  );
}
