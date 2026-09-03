import { Link } from 'react-router-dom';
import { cx } from '@/lib/format';

/**
 * NOTE: BASE sets `inline-flex`. Do not pass a display utility (`hidden`,
 * `block`, …) through `className` to hide or re-flow a button — Tailwind
 * emits display utilities in a fixed order, so which one wins is not decided
 * by the order you write them in. Put the display class on a wrapper element.
 */
type Variant = 'primary' | 'gold' | 'ghost' | 'outline' | 'onDark' | 'quiet';
type Size = 'sm' | 'md' | 'lg';

const BASE =
  'group relative inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap rounded-full ' +
  'transition-[transform,background-color,color,box-shadow,border-color] duration-200 ease-[var(--ease-out-soft)] ' +
  'active:translate-y-px disabled:pointer-events-none disabled:opacity-45';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand text-white shadow-lift hover:bg-brand-600 hover:shadow-lift-lg',
  gold: 'bg-gold text-ink shadow-lift hover:bg-gold-600',
  ghost: 'bg-ink/5 text-ink hover:bg-ink/10',
  outline: 'border border-ink/15 bg-transparent text-ink hover:border-ink/40 hover:bg-ink/5',
  onDark: 'border border-white/35 bg-white/10 text-white backdrop-blur-md hover:border-white/70 hover:bg-white/20',
  quiet: 'text-ink underline decoration-brand decoration-2 underline-offset-4 hover:text-brand',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-[0.95rem]',
  lg: 'h-14 px-7 text-base sm:h-[3.75rem] sm:px-9 sm:text-lg',
};

interface Common {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  /** Renders the ↗ mark used across the site for outbound / forward actions. */
  arrow?: boolean;
}

const Arrow = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    className="h-4 w-4 shrink-0 transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
  >
    <path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function Button({
  variant = 'primary', size = 'md', className, children, arrow, ...rest
}: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cx(BASE, VARIANTS[variant], SIZES[size], className)} {...rest}>
      {children}
      {arrow && <Arrow />}
    </button>
  );
}

export function ButtonLink({
  to, variant = 'primary', size = 'md', className, children, arrow, ...rest
}: Common & { to: string } & Omit<React.ComponentProps<typeof Link>, 'to' | 'className' | 'children'>) {
  const cls = cx(BASE, VARIANTS[variant], SIZES[size], className);
  const external = /^https?:|^tel:|^mailto:/.test(to);

  if (external) {
    return (
      <a href={to} className={cls} rel="noopener noreferrer" target={to.startsWith('http') ? '_blank' : undefined}>
        {children}
        {arrow && <Arrow />}
      </a>
    );
  }
  return (
    <Link to={to} className={cls} {...rest}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}

export { Arrow };
