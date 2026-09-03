import { Link } from 'react-router-dom';
import { cx } from '@/lib/format';

/**
 * Official lockups from the brand kit. The horizontal on-light variant is
 * derived from the supplied horizontal file by recolouring the tagline group
 * from white to deep red — the same single change that separates the stacked
 * on-dark and on-light files in the kit. The white-tagline version must never sit
 * on a light background, so `tone` picks the correct file rather than filtering.
 */
export function Logo({
  tone = 'onLight', className, variant = 'stacked', linkTo = '/',
}: {
  tone?: 'onLight' | 'onDark';
  className?: string;
  variant?: 'stacked' | 'horizontal' | 'mark';
  linkTo?: string | null;
}) {
  const src =
    variant === 'mark'
      ? tone === 'onDark' ? '/brand/macbite-mark-white.svg' : '/brand/macbite-mark.svg'
      : variant === 'horizontal'
        ? tone === 'onDark' ? '/brand/macbite-logo-horizontal.svg' : '/brand/macbite-logo-horizontal-onlight.svg'
        : tone === 'onDark' ? '/brand/macbite-logo-stacked.svg' : '/brand/macbite-logo-stacked-onlight.svg';

  // The size class belongs to the box, not the image — applying it to both
  // made `h-full` on the image fight the explicit height it was also given.
  const img = (
    <img
      src={src}
      alt="MacBite"
      className="h-full w-auto select-none"
      width={variant === 'mark' ? 64 : 200}
      height={64}
      draggable={false}
    />
  );

  if (!linkTo) return <span className={cx('block', className)}>{img}</span>;
  return (
    <Link
      to={linkTo}
      aria-label="MacBite — home"
      // The ::before expands the tap target past the lockup's 32px height
      // without taking up any extra room in the header.
      className={cx(
        "relative block shrink-0 before:absolute before:inset-x-0 before:-inset-y-2.5 before:content-['']",
        className,
      )}
    >
      {img}
    </Link>
  );
}
