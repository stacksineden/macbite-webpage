import { useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { m } from 'framer-motion';
import { Seo } from '@/lib/seo';
import { useCart, totalsFor } from '@/lib/cart';
import { useHydrated } from '@/lib/useHydrated';
import { zoneById } from '@/data/zones';
import { buildOrderMessage, whatsappUrl, isValidNgPhone, orderRef, type CustomerDetails } from '@/lib/whatsapp';
import { money, cx } from '@/lib/format';
import { WHATSAPP_NUMBER, ADDRESS } from '@/config/site';
import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/Button';
import { PricingNote } from '@/components/ui/PricingNote';

type Errors = Partial<Record<'name' | 'phone' | 'address', string>>;

export default function Checkout() {
  const hydrated = useHydrated();
  const { lines, mode, zoneId, clear } = useCart();
  const totals = totalsFor(lines, mode, zoneId);
  const zone = zoneId ? zoneById(zoneId) : undefined;

  const [form, setForm] = useState<CustomerDetails>({ name: '', phone: '', address: '', landmark: '', note: '', company: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<string | null>(null);

  const ref = useMemo(() => orderRef(), []);
  const set = (k: keyof CustomerDetails) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((x) => ({ ...x, [k]: undefined }));
  };

  if (hydrated && lines.length === 0 && !sent) return <Navigate to="/cart" replace />;

  function validate(): boolean {
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = 'We need a name for the order.';
    if (!isValidNgPhone(form.phone)) next.phone = 'Enter a Nigerian mobile number, e.g. 0803 123 4567.';
    if (mode === 'delivery' && (form.address ?? '').trim().length < 8) next.address = 'Give the rider a street and house number.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // Honeypot: a bot fills every field it finds, a person never sees this one.
    if (form.company) return;
    if (!validate()) return;

    const message = buildOrderMessage({ lines, totals, mode, zoneId, customer: form, ref });
    const url = whatsappUrl(message);

    // Opened before clearing, so a blocked popup never loses the order.
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) { window.location.href = url; return; }
    setSent(url);
    clear();
  }

  if (sent) {
    return (
      <>
        <Seo title="Order sent" description="Your MacBite order is on its way to the kitchen." path="/checkout" noindex />
        <div className="shell py-20 text-center sm:py-28">
          <m.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-leaf/12">
            <svg viewBox="0 0 24 24" className="h-9 w-9 text-leaf" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m5 12.5 4.5 4.5L19 7" />
            </svg>
          </m.div>
          <h1 className="display-lg mx-auto mt-8 max-w-xl text-ink">We've got it.</h1>
          <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-ink-2">
            Your order opened in WhatsApp — send the message and we'll confirm straight back.
            We'll call if anything's unavailable.
          </p>
          <p className="mt-6 font-mono text-sm text-ink-3">Reference {ref}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink to={sent} variant="gold" size="lg" arrow>Open WhatsApp again</ButtonLink>
            <ButtonLink to="/menu" variant="outline" size="lg">Back to the menu</ButtonLink>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Seo title="Checkout" description="Confirm your details and send your MacBite order to the kitchen on WhatsApp." path="/checkout" noindex />

      <div className="shell py-12 sm:py-16">
        <Link to="/cart" className="eyebrow text-ink-3 hover:text-brand">← Back to your order</Link>
        <h1 className="display-lg mt-5 text-ink">Almost there.</h1>
        <p className="mt-4 max-w-lg text-lg leading-relaxed text-ink-2">
          {mode === 'delivery'
            ? 'Tell us where to send it. Your whole order goes to the kitchen as one WhatsApp message.'
            : "Tell us who's collecting. We'll have it packed and waiting at Cele bus stop."}
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-14">
          <form onSubmit={submit} noValidate className="space-y-7">
            <Field id="name" label="Your name" value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" required />
            <Field
              id="phone" label="Phone number" type="tel" inputMode="tel"
              value={form.phone} onChange={set('phone')} error={errors.phone}
              autoComplete="tel" hint="So the rider can reach you." required
            />

            {mode === 'delivery' ? (
              <>
                <Field
                  id="address" label="Delivery address" value={form.address ?? ''} onChange={set('address')}
                  error={errors.address} autoComplete="street-address"
                  hint={zone ? `Delivering to ${zone.name}. Change the area on the previous page.` : undefined}
                  required
                />
                <Field id="landmark" label="Nearest landmark" value={form.landmark ?? ''} onChange={set('landmark')} hint="Optional — but it gets the rider to you faster." autoComplete="off" />
              </>
            ) : (
              <p className="rounded-2xl bg-ink/5 px-5 py-4 text-[0.95rem] leading-relaxed text-ink-2">
                Collecting from <strong className="font-semibold text-ink">{ADDRESS.street}</strong>, {ADDRESS.landmark.toLowerCase()}, {ADDRESS.area}.
              </p>
            )}

            <div>
              <label htmlFor="note" className="font-display text-lg font-800 text-ink">Note for the kitchen</label>
              <p className="mt-1 text-sm text-ink-3">Optional.</p>
              <textarea
                id="note" rows={3} maxLength={300} value={form.note ?? ''} onChange={set('note')}
                placeholder="Call when you arrive, gate is behind the filling station…"
                className="mt-3 w-full resize-none rounded-2xl border border-ink/12 bg-white px-4 py-3.5 text-[0.95rem] outline-none transition-colors placeholder:text-ink-3/60 focus:border-brand"
              />
            </div>

            {/* Honeypot. Hidden from people and from screen readers alike. */}
            <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
              <label htmlFor="company">Company</label>
              <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" value={form.company ?? ''} onChange={set('company')} />
            </div>

            <div className="pt-2">
              <Button type="submit" size="lg" className="w-full shadow-lift-lg" arrow>
                Send order on WhatsApp
              </Button>
              {WHATSAPP_NUMBER === '2348000000000' && (
                <p className="mt-3 rounded-2xl bg-brand/10 px-4 py-3 text-sm text-brand-700">
                  Setup: add MacBite's real WhatsApp number in <code className="font-mono">src/config/site.ts</code> before launch.
                </p>
              )}
              <p className="mt-3 text-center text-sm text-ink-3">
                No payment on this site. You pay the rider or at the counter.
              </p>
            </div>
          </form>

          <aside className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
            <div className="rounded-3xl bg-white p-6 shadow-lift ring-1 ring-ink/8 sm:p-8">
              <div className="flex items-baseline justify-between">
                <h2 className="font-display text-2xl font-800 text-ink">Your order</h2>
                <span className="font-mono text-xs text-ink-3">{ref}</span>
              </div>
              <ul className="mt-6 space-y-4 border-t border-ink/10 pt-6">
                {lines.map((l) => (
                  <li key={l.id} className="flex justify-between gap-4 text-[0.95rem]">
                    <span className="min-w-0">
                      <span className="font-semibold text-ink">{l.qty} × {l.name}</span>
                      {l.variantLabel && <span className="text-ink-3"> · {l.variantLabel}</span>}
                      {(l.proteins.length > 0 || l.sides.length > 0) && (
                        <span className="block text-sm text-ink-3">
                          {[...l.proteins.map((p) => p.name), ...l.sides.map((s) => s.name)].join(' · ')}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <dl className="mt-6 space-y-2.5 border-t border-ink/10 pt-6 text-[0.95rem]">
                <div className="flex justify-between"><dt className="text-ink-3">Subtotal</dt><dd className="font-semibold">{totals.subtotal == null ? 'On WhatsApp' : money(totals.subtotal)}</dd></div>
                <div className="flex justify-between">
                  <dt className="text-ink-3">{mode === 'delivery' ? `Delivery${zone ? ` — ${zone.name}` : ''}` : 'Pickup'}</dt>
                  <dd className="font-semibold">{mode === 'pickup' ? 'Free' : totals.deliveryFee == null ? 'On WhatsApp' : money(totals.deliveryFee)}</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-ink/10 pt-4">
                  <dt className="font-display text-xl font-800 text-ink">Total</dt>
                  <dd className="font-display text-2xl font-800 text-ink">{totals.total == null ? 'On WhatsApp' : money(totals.total)}</dd>
                </div>
              </dl>
              <PricingNote className="mt-5" />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

function Field({
  id, label, hint, error, required, ...rest
}: {
  id: string; label: string; hint?: string; error?: string; required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="font-display text-lg font-800 text-ink">
        {label}{!required && <span className="ml-2 font-sans text-sm font-500 text-ink-3">Optional</span>}
      </label>
      {hint && !error && <p className="mt-1 text-sm text-ink-3">{hint}</p>}
      <input
        id={id}
        name={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cx(
          'mt-3 h-13 w-full rounded-2xl border bg-white px-4 py-3.5 text-[0.95rem] outline-none transition-colors placeholder:text-ink-3/60',
          error ? 'border-brand' : 'border-ink/12 focus:border-brand',
        )}
        {...rest}
      />
      {error && <p id={`${id}-error`} role="alert" className="mt-2 text-sm font-medium text-brand">{error}</p>}
    </div>
  );
}
