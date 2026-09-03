import { Link } from 'react-router-dom';
import { SITE, ADDRESS, PHONE_DISPLAY, PHONE_TEL, SOCIAL } from '@/config/site';
import { hoursLabel } from '@/lib/hours';
import { CATEGORIES } from '@/data/menu';
import { ZONES } from '@/data/zones';
import { whatsappEnquiry } from '@/lib/whatsapp';
import { Logo } from './Logo';
import { ButtonLink } from '@/components/ui/Button';

const socials = Object.entries(SOCIAL).filter(([, v]) => v);

export function Footer() {
  return (
    <footer className="grain relative mt-24 overflow-hidden bg-deep text-cream" data-on-dark>
      {/* Gold hairline echoing the logo keyline. */}
      <div className="h-1 w-full bg-gradient-to-r from-brand via-gold to-brand" />

      <div className="shell py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr_1.1fr]">
          <div>
            <Logo tone="onDark" variant="stacked" className="h-16" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/70">
              Ibadan's everyday kitchen. Breakfast through dinner, ordered ahead or delivered.
            </p>
            <ButtonLink to={whatsappEnquiry('I would like to place an order.')} variant="gold" size="md" className="mt-6" arrow>
              Order on WhatsApp
            </ButtonLink>
          </div>

          <nav aria-label="Menu categories">
            <h2 className="eyebrow text-gold">The menu</h2>
            <ul className="mt-5 space-y-2.5 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link to={`/menu/${c.id}`} className="text-cream/75 transition-colors hover:text-gold">
                    {c.name}
                  </Link>
                </li>
              ))}
              <li><Link to="/menu" className="font-semibold text-cream transition-colors hover:text-gold">Full menu →</Link></li>
            </ul>
          </nav>

          <nav aria-label="More">
            <h2 className="eyebrow text-gold">MacBite</h2>
            <ul className="mt-5 space-y-2.5 text-sm">
              <li><Link to="/about" className="text-cream/75 transition-colors hover:text-gold">About us</Link></li>
              <li><Link to="/delivery" className="text-cream/75 transition-colors hover:text-gold">Delivery areas</Link></li>
              <li><Link to="/contact" className="text-cream/75 transition-colors hover:text-gold">Contact &amp; directions</Link></li>
              <li><Link to="/about#catering" className="text-cream/75 transition-colors hover:text-gold">Catering &amp; events</Link></li>
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow text-gold">Find us</h2>
            <address className="mt-5 space-y-1 text-sm not-italic leading-relaxed text-cream/75">
              <p className="font-semibold text-cream">{ADDRESS.street}</p>
              <p>{ADDRESS.landmark}</p>
              <p>{ADDRESS.area}, {ADDRESS.city}, {ADDRESS.region}</p>
            </address>
            <p className="mt-4 text-sm text-cream/75">
              Open every day<br />
              <span className="font-mono text-cream">{hoursLabel}</span>
            </p>
            <a href={`tel:${PHONE_TEL}`} className="mt-4 inline-block font-display text-xl font-800 text-gold hover:underline">
              {PHONE_DISPLAY}
            </a>
            {socials.length > 0 && (
              <ul className="mt-5 flex gap-3">
                {socials.map(([k, v]) => (
                  <li key={k}>
                    <a href={v} rel="noopener noreferrer me" target="_blank" className="eyebrow text-cream/60 hover:text-gold">
                      {k}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Area list. Real internal signal for "food delivery <area> Ibadan" searches. */}
        <div className="mt-14 border-t border-cream/12 pt-8">
          <h2 className="eyebrow text-cream/45">We deliver across Ibadan</h2>
          <p className="mt-3 text-sm leading-relaxed text-cream/55">
            {ZONES.map((z, i) => (
              <span key={z.id}>
                <Link to="/delivery" className="hover:text-gold">{z.name}</Link>
                {i < ZONES.length - 1 && <span aria-hidden="true"> · </span>}
              </span>
            ))}
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-cream/12 pt-8 text-xs text-cream/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.legalName}. {ADDRESS.city}, Nigeria.</p>
          <p className="font-mono">Prices in naira. Kitchen closes {hoursLabel.split('–')[1].trim()}.</p>
        </div>
      </div>
    </footer>
  );
}
