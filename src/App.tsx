import { Routes, Route } from 'react-router-dom';
import { LazyMotion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import Home from '@/pages/Home';
import Menu from '@/pages/Menu';
import Item from '@/pages/Item';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Delivery from '@/pages/Delivery';
import NotFound from '@/pages/NotFound';

/** Loaded after first paint — see src/lib/motionFeatures.ts. */
const loadMotionFeatures = () => import('@/lib/motionFeatures').then((mod) => mod.default);

/**
 * Every route is statically imported rather than lazy. The prerender renders
 * each page to real HTML, and a Suspense fallback in that HTML would be exactly
 * what a crawler indexes. Route-level code splitting is not worth that trade on
 * a site this size.
 */
export default function App() {
  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="menu/:category" element={<Menu />} />
          <Route path="item/:slug" element={<Item />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="delivery" element={<Delivery />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </LazyMotion>
  );
}
