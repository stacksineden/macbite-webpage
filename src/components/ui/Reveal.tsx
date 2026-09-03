import { m, useReducedMotion, type Variants } from 'framer-motion';

const build = (dy: number, still: boolean): Variants => ({
  hidden: { opacity: 0, y: still ? 0 : dy },
  show: { opacity: 1, y: 0 },
});

/**
 * Scroll-in reveal. Everything animates once, never on scroll-back, and
 * collapses to a plain fade when the visitor has asked for less m.
 */
export function Reveal({
  children, className, delay = 0, y = 22, as = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: 'div' | 'section' | 'li' | 'article' | 'header';
}) {
  const still = useReducedMotion() ?? false;
  const M = m[as];

  return (
    <M
      data-reveal
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      variants={build(y, still)}
      transition={{ duration: still ? 0.25 : 0.62, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  );
}

/** Parent for staggered lists — pair with <RevealItem>. */
export function RevealGroup({
  children, className, stagger = 0.07, as = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  as?: 'div' | 'ul' | 'section';
}) {
  const M = m[as];
  return (
    <M
      data-reveal
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </M>
  );
}

export function RevealItem({
  children, className, y = 20, as = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
  as?: 'div' | 'li' | 'article';
}) {
  const still = useReducedMotion() ?? false;
  const M = m[as];
  return (
    <M
      data-reveal
      className={className}
      variants={build(y, still)}
      transition={{ duration: still ? 0.25 : 0.58, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  );
}
