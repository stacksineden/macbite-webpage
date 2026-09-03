import { Link } from 'react-router-dom';
import { POPULAR } from '@/data/menu';
import { ItemCard } from '@/components/menu/ItemCard';
import { Reveal } from '@/components/ui/Reveal';

export function Popular() {
  return (
    <section aria-labelledby="popular-title" className="bg-cream-2/60 py-20 sm:py-28">
      <div className="shell">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-brand">Popular right now</p>
            <h2 id="popular-title" className="display-lg mt-4 text-ink">What Ibadan is ordering.</h2>
          </div>
          <Link to="/menu" className="font-semibold text-ink underline decoration-brand decoration-2 underline-offset-4 hover:text-brand">
            All items
          </Link>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
          {POPULAR.map((item, i) => (
            <ItemCard key={item.slug} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
