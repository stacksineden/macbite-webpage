import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { NAV } from '@/config/site';
import { cx } from '@/lib/format';
import { isOpen, hoursLabel } from '@/lib/hours';
import { useHydrated } from '@/lib/useHydrated';
import { Logo } from './Logo';
import { CartButton } from './CartButton';
import { ButtonLink } from '@/components/ui/Button';

export function Header({ overHero }: { overHero: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  // Open/closed depends on the clock, so it must not differ between the
  // prerendered HTML and the first client render.
  const hydrated = useHydrated();
  const open = hydrated && isOpen();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  // Lock the page behind the mobile sheet.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const dark = overHero && !scrolled;

  return (
    <header
      {...(dark ? { 'data-on-dark': '' } : {})}
      className={cx(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500',
        dark ? 'bg-transparent' : 'bg-cream/85 shadow-[0_1px_0_rgb(23_16_15/0.08)] backdrop-blur-xl',
      )}
      style={{ height: 'var(--header-h)' }}
    >
      <div className="shell flex h-full items-center gap-4">
        {/* Left: live status. On the hero this is the reference's "Come on in" strip. */}
        <div className={cx('hidden min-w-0 flex-1 items-center gap-2 lg:flex', dark ? 'text-white/85' : 'text-ink-3')}>
          <span className="relative flex h-2 w-2 shrink-0">
            {open && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-leaf opacity-70" />}
            <span className={cx('relative inline-flex h-2 w-2 rounded-full', open ? 'bg-leaf' : 'bg-ink-3/50')} />
          </span>
          <span className="eyebrow truncate">
            {!hydrated
              ? `Open every day · ${hoursLabel}`
              : open
                ? `Open now · ${hoursLabel}`
                : `Closed · opens ${hoursLabel.split('–')[0].trim()}`}
          </span>
        </div>

        <Logo tone={dark ? 'onDark' : 'onLight'} variant="horizontal" className="h-8 sm:h-9 lg:mx-auto" />

        <nav className="ml-auto hidden items-center gap-1 lg:flex lg:flex-1 lg:justify-end" aria-label="Main">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                cx(
                  'relative rounded-full px-3.5 py-2 text-sm font-semibold transition-colors',
                  dark ? 'text-white/85 hover:text-white' : 'text-ink-2 hover:text-brand',
                  isActive && (dark ? 'text-white' : 'text-brand'),
                )
              }
            >
              {({ isActive }) => (
                <>
                  {n.label}
                  <span
                    aria-hidden="true"
                    className={cx(
                      'absolute inset-x-3.5 -bottom-0.5 h-0.5 origin-left rounded-full transition-transform duration-300 ease-[var(--ease-out-soft)]',
                      dark ? 'bg-gold' : 'bg-brand',
                      isActive ? 'scale-x-100' : 'scale-x-0',
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-3">
          <CartButton dark={dark} />
          {/* Visibility lives on a wrapper: a `hidden` utility passed into the
              button would compete with its own base `inline-flex`, and which
              one wins depends on Tailwind's utility ordering, not class order. */}
          <span className="hidden sm:block">
            <ButtonLink to="/menu" size="sm" variant={dark ? 'onDark' : 'primary'}>
              Order now
            </ButtonLink>
          </span>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className={cx(
              'grid h-10 w-10 place-items-center rounded-full transition-colors lg:hidden',
              dark ? 'bg-white/10 text-white ring-1 ring-white/25' : 'bg-ink/5 text-ink',
            )}
          >
            <span className="relative block h-4 w-5" aria-hidden="true">
              <m.span
                className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-current"
                animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 0 : -4 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              />
              <m.span
                className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-current"
                animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? 0 : 4 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <m.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-full mx-3 overflow-hidden rounded-3xl border border-ink/10 bg-cream shadow-lift-lg lg:hidden"
          >
            <nav className="flex flex-col p-2" aria-label="Mobile">
              {NAV.map((n) => (
                <Link key={n.to} to={n.to} className="rounded-2xl px-4 py-3.5 font-display text-2xl font-800 text-ink hover:bg-brand/5 hover:text-brand">
                  {n.label}
                </Link>
              ))}
              <ButtonLink to="/menu" size="lg" className="mt-2 w-full" arrow>Order now</ButtonLink>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
