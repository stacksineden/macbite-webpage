import { NavLink } from 'react-router-dom';
import { CATEGORIES } from '@/data/menu';
import { cx } from '@/lib/format';

export function CategoryNav({ activeId }: { activeId?: string }) {
  // `inline-block` + `whitespace-nowrap`: as a plain inline element a long
  // label like "Main Dishes" wrapped and the pill background broke across the
  // two lines instead of enclosing them.
  const base =
    'inline-block shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200';

  // Full-bleed sticky bar, but the chips line up with the page gutter rather
  // than running off the edge.
  return (
    <nav
      aria-label="Menu categories"
      className="sticky top-[var(--header-h)] z-30 border-y border-ink/8 bg-cream/95 py-3 backdrop-blur-lg"
    >
      <ul className="shell no-bar flex gap-2 overflow-x-auto">
        <li>
          <NavLink
            to="/menu"
            end
            className={({ isActive }) => cx(base, isActive && !activeId ? 'bg-ink text-white' : 'bg-ink/5 text-ink-2 hover:bg-ink/10')}
          >
            Everything
          </NavLink>
        </li>
        {CATEGORIES.map((c) => (
          <li key={c.id}>
            <NavLink
              to={`/menu/${c.id}`}
              className={({ isActive }) => cx(base, isActive ? 'bg-ink text-white' : 'bg-ink/5 text-ink-2 hover:bg-ink/10')}
            >
              {c.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
