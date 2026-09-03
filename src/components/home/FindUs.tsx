import { useState } from 'react';
import { ADDRESS, PHONE_DISPLAY, PHONE_TEL } from '@/config/site';
import { hoursLabel } from '@/lib/hours';
import { Reveal } from '@/components/ui/Reveal';
import { ButtonLink } from '@/components/ui/Button';

const MAPS_QUERY = encodeURIComponent(`MacBite, ${ADDRESS.street}, ${ADDRESS.area}, ${ADDRESS.city}, Nigeria`);
export const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${MAPS_QUERY}`;
const EMBED_URL = `https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`;

export function FindUs() {
  // The map iframe is only loaded when asked for. It keeps ~900KB and a set of
  // third-party cookies off the first visit for everyone who never opens it.
  const [mapOn, setMapOn] = useState(false);

  return (
    <section aria-labelledby="find-title" className="shell pb-20 sm:pb-28">
      <Reveal className="overflow-hidden rounded-3xl bg-ink text-cream shadow-lift-lg sm:rounded-[2rem]" >
        <div className="grid lg:grid-cols-2" data-on-dark>
          <div className="p-8 sm:p-12">
            <p className="eyebrow text-gold">Find us</p>
            <h2 id="find-title" className="display-md mt-4 text-white">
              Cele bus stop,<br />Old Ife Road.
            </h2>
            <address className="mt-6 space-y-1 text-base not-italic leading-relaxed text-cream/75">
              <p>{ADDRESS.landmark}.</p>
              <p>{ADDRESS.area}, {ADDRESS.city}, {ADDRESS.region}.</p>
            </address>

            <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-cream/15 pt-7">
              <div>
                <dt className="eyebrow text-cream/50">Open</dt>
                <dd className="mt-1.5 font-display text-2xl font-800 text-white">Every day</dd>
                <dd className="font-mono text-sm text-gold">{hoursLabel}</dd>
              </div>
              <div>
                <dt className="eyebrow text-cream/50">Call the kitchen</dt>
                <dd className="mt-1.5">
                  <a href={`tel:${PHONE_TEL}`} className="font-display text-2xl font-800 text-white hover:text-gold">
                    {PHONE_DISPLAY}
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink to={DIRECTIONS_URL} variant="gold" size="md" arrow>Get directions</ButtonLink>
              <ButtonLink to="/menu" variant="onDark" size="md">Order instead</ButtonLink>
            </div>
          </div>

          <div className="relative min-h-[20rem] bg-ink-2/40 lg:min-h-full">
            {mapOn ? (
              <iframe
                title={`Map showing MacBite at ${ADDRESS.street}, ${ADDRESS.city}`}
                src={EMBED_URL}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              <button
                type="button"
                onClick={() => setMapOn(true)}
                className="group absolute inset-0 grid place-items-center overflow-hidden"
              >
                {/* Abstract street grid — no tiles fetched until the customer asks. */}
                <svg aria-hidden="true" viewBox="0 0 400 300" className="absolute inset-0 h-full w-full opacity-25">
                  <defs>
                    <pattern id="streets" width="52" height="52" patternUnits="userSpaceOnUse" patternTransform="rotate(14)">
                      <path d="M0 26h52M26 0v52" stroke="#F7A81B" strokeWidth="1" fill="none" />
                    </pattern>
                  </defs>
                  <rect width="400" height="300" fill="url(#streets)" />
                  <path d="M-20 210 L420 120" stroke="#E32119" strokeWidth="8" fill="none" opacity="0.7" />
                </svg>
                <span className="relative flex flex-col items-center gap-3">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-gold text-ink transition-transform duration-300 group-hover:scale-110">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.6" />
                    </svg>
                  </span>
                  <span className="font-display text-xl font-800 text-white">Load the map</span>
                  <span className="eyebrow text-cream/55">Opens Google Maps here</span>
                </span>
              </button>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
