import { Seo } from '@/lib/seo';
import { CATEGORIES } from '@/data/menu';
import { ButtonLink } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" description="That page doesn't exist. Browse the MacBite menu instead." path="/404" noindex />
      <div className="shell py-24 text-center sm:py-32">
        <p className="eyebrow text-brand">404</p>
        <h1 className="display-lg mx-auto mt-5 max-w-2xl text-ink">That page isn't on the menu.</h1>
        <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-ink-2">
          The link may be old, or we may have moved it. Everything we cook is one tap away.
        </p>
        <ButtonLink to="/menu" size="lg" className="mt-10" arrow>See the menu</ButtonLink>
        <ul className="mt-12 flex flex-wrap justify-center gap-2.5">
          {CATEGORIES.map((c) => (
            <li key={c.id}>
              <Link to={`/menu/${c.id}`} className="rounded-full bg-ink/5 px-4 py-2 text-sm font-semibold text-ink-2 transition-colors hover:bg-brand hover:text-white">
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
