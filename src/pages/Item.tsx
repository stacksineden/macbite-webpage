import { useMemo, useState } from 'react';
import { useParams, Navigate, useNavigate, Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { Seo } from '@/lib/seo';
import { itemSchema, breadcrumbSchema } from '@/lib/schema';
import { SOUPS, PRICING_STATUS } from '@/config/site';
import { bySlug, PROTEINS, SIDES, CATEGORIES, PROTEIN_MAX, PROTEIN_SELECT_MODE, isBuildable, type MenuItem, type Variant } from '@/data/menu';
import { useCart, lineKey, type LineModifier } from '@/lib/cart';
import { money, sumOrNull, cx } from '@/lib/format';
import { ItemPhoto } from '@/components/menu/ItemPhoto';
import { Button } from '@/components/ui/Button';
import { PricingNote } from '@/components/ui/PricingNote';

export default function Item() {
  const { slug = '' } = useParams();
  const item = bySlug(slug);
  if (!item) return <Navigate to="/menu" replace />;
  return <Builder key={slug} item={item} />;
}

function Builder({ item }: { item: MenuItem }) {
  const navigate = useNavigate();
  const add = useCart((s) => s.add);

  const [variant, setVariant] = useState<Variant | null>(item.variants?.[0] ?? null);
  const [proteins, setProteins] = useState<string[]>([]);
  const [sides, setSides] = useState<string[]>([]);
  const [soup, setSoup] = useState<string>('');
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('');

  const buildable = isBuildable(item);
  const needsSoup = Boolean(item.needsSoup);
  const soupsAvailable = SOUPS.length > 0;

  const chosenProteins: LineModifier[] = useMemo(
    () => proteins.map((s) => PROTEINS.find((p) => p.slug === s)!).filter(Boolean)
      .map((p) => ({ slug: p.slug, name: p.name, variantLabel: p.variants?.[0]?.label, price: p.variants?.[0]?.price ?? p.price })),
    [proteins],
  );
  const chosenSides: LineModifier[] = useMemo(
    () => sides.map((s) => SIDES.find((x) => x.slug === s)!).filter(Boolean).map((s) => ({ slug: s.slug, name: s.name, price: s.price })),
    [sides],
  );

  const basePrice = variant ? variant.price : item.price;
  const soupPrice = needsSoup && soup ? (SOUPS.find((s) => s.id === soup)?.price ?? null) : 0;
  const each = sumOrNull([basePrice, soupPrice, ...chosenProteins.map((p) => p.price), ...chosenSides.map((s) => s.price)]);
  const total = each == null ? null : each * qty;

  function toggleProtein(slug: string) {
    setProteins((cur) => {
      if (PROTEIN_SELECT_MODE === 'single') return cur[0] === slug ? [] : [slug];
      if (cur.includes(slug)) return cur.filter((s) => s !== slug);
      if (cur.length >= PROTEIN_MAX) return cur;
      return [...cur, slug];
    });
  }

  function addToOrder() {
    const line = {
      slug: item.slug,
      name: item.name,
      unit: item.unit,
      variantLabel: variant?.label,
      basePrice: sumOrNull([basePrice, soupPrice]),
      proteins: chosenProteins,
      sides: chosenSides,
      soupName: needsSoup ? (SOUPS.find((s) => s.id === soup)?.name ?? undefined) : undefined,
      note: note.trim() || undefined,
      qty,
      deliverable: item.deliverable && chosenSides.every((s) => SIDES.find((x) => x.slug === s.slug)?.deliverable !== false),
    };
    add({ ...line, id: lineKey(line) });
    navigate('/cart');
  }

  const cat = CATEGORIES.find((c) => c.id === item.category)!;
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: cat.name, path: `/menu/${cat.id}` },
    { name: item.name, path: `/item/${item.slug}` },
  ];

  return (
    <>
      <Seo
        title={item.name}
        description={`${item.description} Order ${item.name} from MacBite, Cele bus stop, Old Ife Road — delivered across Ibadan or ready for pickup.`}
        path={`/item/${item.slug}`}
        jsonLd={[itemSchema(item), breadcrumbSchema(crumbs)]}
      />

      <div className="shell py-10 sm:py-14">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="eyebrow flex flex-wrap items-center gap-2 text-ink-3">
            {crumbs.map((c, i) => (
              <li key={c.path} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true">/</span>}
                {i === crumbs.length - 1
                  ? <span aria-current="page" className="text-ink">{c.name}</span>
                  : <Link to={c.path} className="hover:text-brand">{c.name}</Link>}
              </li>
            ))}
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          {/* Photo column — sticky on desktop so the price never scrolls away. */}
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
            <ItemPhoto
              slug={item.slug}
              name={item.name}
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="aspect-square w-full rounded-3xl shadow-lift-lg"
            />
            {!item.deliverable && (
              <p className="mt-4 rounded-2xl bg-gold/12 px-4 py-3 text-sm text-ink-2">
                This one doesn't travel well in the heat, so it's dine-in and pickup only.
              </p>
            )}
          </div>

          <div className="pb-20 lg:pb-0">
            <h1 className="display-lg text-ink">{item.name}</h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-2">{item.description}</p>
            <p className="mt-5 font-display text-3xl font-800 text-ink">
              {money(basePrice)}
              <span className="ml-2 font-sans text-sm font-500 text-ink-3">per {item.unit.toLowerCase()}</span>
            </p>

            {!item.available && (
              <p className="mt-6 rounded-2xl bg-ink/6 px-4 py-3.5 font-semibold text-ink-2">
                Sold out for today. Back tomorrow morning.
              </p>
            )}

            <div className="mt-10 space-y-10">
              {item.variants && item.variants.length > 1 && (
                <Group title="Size" required>
                  <div className="flex flex-wrap gap-2.5">
                    {item.variants.map((v) => (
                      <Chip key={v.id} on={variant?.id === v.id} onClick={() => setVariant(v)}>
                        {v.label}
                        {v.price != null && <span className="ml-2 opacity-60">{money(v.price)}</span>}
                      </Chip>
                    ))}
                  </div>
                </Group>
              )}

              {needsSoup && (
                <Group title="Soup" required={soupsAvailable}>
                  {soupsAvailable ? (
                    <div className="flex flex-wrap gap-2.5">
                      {SOUPS.map((s) => (
                        <Chip key={s.id} on={soup === s.id} onClick={() => setSoup(s.id)}>
                          {s.name}
                          {s.price != null && <span className="ml-2 opacity-60">{money(s.price)}</span>}
                        </Chip>
                      ))}
                    </div>
                  ) : (
                    // Soups are not on the inventory sheet yet. Rather than an
                    // empty selector, say plainly how it gets decided.
                    <p className="rounded-2xl bg-ink/5 px-4 py-3.5 text-sm leading-relaxed text-ink-2">
                      We'll ask which soup you want when we confirm your order on WhatsApp —
                      egusi, efo riro and the rest of the day's pots.
                    </p>
                  )}
                </Group>
              )}

              {buildable && (
                <Group
                  title="Add protein"
                  hint={PROTEIN_SELECT_MODE === 'multi' ? `Choose up to ${PROTEIN_MAX}` : 'Choose one'}
                >
                  <div className="flex flex-wrap gap-2.5">
                    {PROTEINS.filter((p) => p.available).map((p) => (
                      <Chip
                        key={p.slug}
                        on={proteins.includes(p.slug)}
                        onClick={() => toggleProtein(p.slug)}
                        disabled={!proteins.includes(p.slug) && PROTEIN_SELECT_MODE === 'multi' && proteins.length >= PROTEIN_MAX}
                      >
                        {p.name}
                        <span className="ml-2 opacity-60">{money(p.variants?.[0]?.price ?? p.price)}</span>
                      </Chip>
                    ))}
                  </div>
                </Group>
              )}

              {buildable && (
                <Group title="Add sides" hint="Optional">
                  <div className="flex flex-wrap gap-2.5">
                    {SIDES.filter((s) => s.available).map((s) => (
                      <Chip
                        key={s.slug}
                        on={sides.includes(s.slug)}
                        onClick={() => setSides((cur) => cur.includes(s.slug) ? cur.filter((x) => x !== s.slug) : [...cur, s.slug])}
                      >
                        {s.name}
                        <span className="ml-2 opacity-60">{money(s.price)}</span>
                      </Chip>
                    ))}
                  </div>
                </Group>
              )}

              <Group title="Anything else?" hint="Optional">
                <input
                  type="text"
                  value={note}
                  maxLength={140}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Less pepper, extra stew, pack separately…"
                  className="h-12 w-full rounded-2xl border border-ink/12 bg-white px-4 text-[0.95rem] outline-none transition-colors placeholder:text-ink-3/60 focus:border-brand"
                />
              </Group>

              <Group title="How many?">
                <div className="flex items-center gap-1.5 rounded-full bg-ink/5 p-1.5" style={{ width: 'fit-content' }}>
                  <QtyBtn label="Remove one" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1}>−</QtyBtn>
                  <span aria-live="polite" className="w-10 text-center font-display text-xl font-800 text-ink">{qty}</span>
                  <QtyBtn label="Add one" onClick={() => setQty((q) => Math.min(20, q + 1))} disabled={qty >= 20}>+</QtyBtn>
                </div>
              </Group>
            </div>

            {PRICING_STATUS === 'draft' && <PricingNote className="mt-10" />}

            {/* Running total lives in the button, because the customer is
                assembling a price here rather than reading one. The extra bottom
                padding lets the last field scroll clear of the sticky bar. */}
            <div className="sticky bottom-3 z-20 mt-8 pb-3 lg:static lg:pb-0">
              <Button
                size="lg"
                onClick={addToOrder}
                disabled={!item.available}
                className="w-full justify-between px-7 shadow-lift-lg"
              >
                <span>Add to order</span>
                <m.span key={String(total)} initial={{ opacity: 0.4, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }}>
                  {total == null ? 'Price on request' : money(total)}
                </m.span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Group({ title, hint, required, children }: { title: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-4 flex w-full items-baseline justify-between gap-4">
        <span className="font-display text-2xl font-800 text-ink">{title}</span>
        <span className="eyebrow text-ink-3">{required ? 'Required' : hint}</span>
      </legend>
      {children}
    </fieldset>
  );
}

function Chip({ on, children, onClick, disabled }: { on: boolean; children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={on}
      className={cx(
        'rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-200',
        on
          ? 'border-brand bg-brand text-white shadow-lift'
          : 'border-ink/12 bg-white text-ink-2 hover:-translate-y-0.5 hover:border-ink/35',
        disabled && 'cursor-not-allowed opacity-40 hover:translate-y-0',
      )}
    >
      {children}
    </button>
  );
}

function QtyBtn({ children, label, ...rest }: { children: React.ReactNode; label: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full bg-white text-lg font-bold text-ink shadow-sm transition-colors hover:bg-brand hover:text-white disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-ink"
      {...rest}
    >
      {children}
    </button>
  );
}
