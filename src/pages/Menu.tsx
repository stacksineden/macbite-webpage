import { useMemo, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Seo } from '@/lib/seo';
import { menuSchema, breadcrumbSchema, restaurantSchema } from '@/lib/schema';
import { CATEGORIES, MENU, type CategoryId } from '@/data/menu';
import { PageHeader } from '@/components/ui/PageHeader';
import { CategoryNav } from '@/components/menu/CategoryNav';
import { ItemCard } from '@/components/menu/ItemCard';
import { MenuGrid } from '@/components/menu/MenuGrid';
import { PricingNote } from '@/components/ui/PricingNote';
import { cx } from '@/lib/format';

export default function Menu() {
  const { category } = useParams<{ category?: string }>();
  const [query, setQuery] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const cat = category ? CATEGORIES.find((c) => c.id === category) : undefined;
  const term = query.trim().toLowerCase();

  const results = useMemo(() => {
    let list = MENU;
    if (cat) list = list.filter((i) => i.category === cat.id);
    if (onlyAvailable) list = list.filter((i) => i.available);
    if (term) {
      list = list.filter(
        (i) => i.name.toLowerCase().includes(term) || i.description.toLowerCase().includes(term) || i.unit.toLowerCase().includes(term),
      );
    }
    return list;
  }, [cat, term, onlyAvailable]);

  if (category && !cat) return <Navigate to="/menu" replace />;

  const filtering = Boolean(term) || onlyAvailable || Boolean(cat);

  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Menu', path: '/menu' }];
  if (cat) crumbs.push({ name: cat.name, path: `/menu/${cat.id}` });

  return (
    <>
      <Seo
        title={cat ? `${cat.name} — Menu` : 'Menu'}
        description={
          cat
            ? `${cat.description} Order ${cat.name.toLowerCase()} from MacBite, Cele bus stop, Old Ife Road — delivered across Ibadan or ready for pickup.`
            : 'The full MacBite menu — rice, swallow, proteins, sides and drinks. Build your plate and check out on WhatsApp. Delivery across Ibadan, or pickup at Cele bus stop.'
        }
        path={cat ? `/menu/${cat.id}` : '/menu'}
        jsonLd={[menuSchema(), breadcrumbSchema(crumbs), restaurantSchema()]}
      />

      <PageHeader
        eyebrow={cat ? 'Menu' : 'The full menu'}
        title={cat ? cat.name : 'Build your plate.'}
        lead={cat ? cat.description : 'Pick a base, add as much protein as you want, then tell us where to send it.'}
        crumbs={crumbs}
      />

      <div className="shell">
        <PricingNote className="mb-8 max-w-2xl" />
      </div>

      <CategoryNav activeId={cat?.id} />

      <div className="shell pb-24">
        {/* Search + availability. On a phone the three controls in one row left
            the search box too narrow to show its placeholder, so it gets its
            own full-width row until there is space to share one. */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative min-w-0 sm:max-w-xs sm:flex-1">
            <svg aria-hidden="true" viewBox="0 0 20 20" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
              <circle cx="9" cy="9" r="5.5" /><path d="m13.5 13.5 3 3" />
            </svg>
            <label htmlFor="menu-search" className="sr-only-focusable">Search the menu</label>
            <input
              id="menu-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the menu…"
              className="h-11 w-full rounded-full border border-ink/12 bg-white pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-ink-3/60 focus:border-brand"
            />
          </div>

          <div className="flex items-center justify-between gap-3 sm:ml-auto sm:justify-end">
          <button
            type="button"
            role="switch"
            aria-checked={onlyAvailable}
            onClick={() => setOnlyAvailable((v) => !v)}
            className={cx(
              'flex h-11 items-center gap-2.5 rounded-full border px-4 text-sm font-semibold transition-colors',
              onlyAvailable ? 'border-leaf bg-leaf/10 text-leaf' : 'border-ink/12 bg-white text-ink-2 hover:border-ink/30',
            )}
          >
            <span className={cx('relative h-5 w-9 rounded-full transition-colors', onlyAvailable ? 'bg-leaf' : 'bg-ink/15')}>
              <span className={cx('absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all duration-200', onlyAvailable ? 'left-4.5' : 'left-0.5')} />
            </span>
            Currently available
          </button>

          <p className="shrink-0 text-sm text-ink-3" aria-live="polite">
            {results.length} item{results.length === 1 ? '' : 's'}
          </p>
          </div>
        </div>

        <div className="mt-10">
          {results.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-ink/20 px-6 py-20 text-center">
              <p className="font-display text-2xl font-800 text-ink">Nothing matched.</p>
              <p className="mt-2 text-ink-3">
                Try browsing{' '}
                <button type="button" onClick={() => { setQuery(''); setOnlyAvailable(false); }} className="font-semibold text-brand underline underline-offset-4">
                  the whole menu
                </button>{' '}
                instead.
              </p>
            </div>
          ) : filtering ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((item, i) => <ItemCard key={item.slug} item={item} index={i} />)}
            </div>
          ) : (
            <MenuGrid filter={(id: CategoryId) => CATEGORIES.some((c) => c.id === id)} />
          )}
        </div>
      </div>
    </>
  );
}
