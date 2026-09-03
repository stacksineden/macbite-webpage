import { Link } from 'react-router-dom';
import { Reveal } from './Reveal';

export function PageHeader({
  eyebrow, title, lead, crumbs,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  crumbs?: { name: string; path: string }[];
}) {
  return (
    <div className="shell pb-10 pt-12 sm:pt-16">
      {crumbs && crumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="eyebrow flex flex-wrap items-center gap-2 text-ink-3">
            {crumbs.map((c, i) => (
              <li key={c.path} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true">/</span>}
                {i === crumbs.length - 1 ? (
                  <span aria-current="page" className="text-ink">{c.name}</span>
                ) : (
                  <Link to={c.path} className="hover:text-brand">{c.name}</Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <Reveal>
        <p className="eyebrow text-brand">{eyebrow}</p>
        <h1 className="display-lg mt-4 max-w-3xl text-ink">{title}</h1>
        {lead && <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-2">{lead}</p>}
      </Reveal>
    </div>
  );
}
