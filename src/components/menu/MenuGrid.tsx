import { CATEGORIES, MENU, type CategoryId } from '@/data/menu';
import { ItemCard } from './ItemCard';

export function MenuGrid({ filter }: { filter: (slugCategory: CategoryId) => boolean }) {
  const sections = CATEGORIES.filter((c) => filter(c.id));

  return (
    <>
      {sections.map((cat) => {
        const items = MENU.filter((i) => i.category === cat.id);
        if (!items.length) return null;
        return (
          <section key={cat.id} id={cat.id} aria-labelledby={`${cat.id}-title`} className="scroll-mt-32 pt-14 first:pt-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-ink/10 pb-5">
              <h2 id={`${cat.id}-title`} className="display-md text-ink">{cat.name}</h2>
              <p className="text-sm text-ink-3">{cat.description}</p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item, i) => <ItemCard key={item.slug} item={item} index={i} />)}
            </div>
          </section>
        );
      })}
    </>
  );
}
