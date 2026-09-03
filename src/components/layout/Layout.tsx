import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { OrderBar } from './OrderBar';

/** Scrolls to top on navigation, but leaves in-page #anchors alone. */
function ScrollReset() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);
  return null;
}

export function Layout() {
  const { pathname } = useLocation();
  const overHero = pathname === '/';

  return (
    <>
      <a href="#main" className="sr-only-focusable">Skip to content</a>
      <ScrollReset />
      <Header overHero={overHero} />
      <main id="main" className={overHero ? '' : 'pt-[var(--header-h)]'}>
        <Outlet />
      </main>
      <Footer />
      <OrderBar />
    </>
  );
}
