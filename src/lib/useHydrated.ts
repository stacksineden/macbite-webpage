import { useEffect, useState } from 'react';

/**
 * The cart lives in localStorage, so its contents differ between the prerendered
 * HTML and the first client render. Anything that reads the cart must wait for
 * this, or React tears the hydration tree.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
