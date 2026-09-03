import { useState } from 'react';
import { PHOTOS } from '@/data/photos';
import { FoodPlaceholder } from '@/components/ui/FoodPlaceholder';
import { cx } from '@/lib/format';

/**
 * One item's picture. Uses the real photograph when the shoot has delivered
 * one, and the branded placeholder when it hasn't — decided per item, so the
 * menu can fill in gradually without a half-finished look.
 *
 * The photo set is generated: drop `<slug>.png` into assets/source/menu and
 * run `npm run images`. Nothing here needs editing.
 */
export function ItemPhoto({
  slug, name, sizes, className, compact, priority,
}: {
  slug: string;
  name: string;
  sizes: string;
  className?: string;
  compact?: boolean;
  priority?: boolean;
}) {
  const photo = PHOTOS[slug];
  const [loaded, setLoaded] = useState(false);

  if (!photo) {
    return <FoodPlaceholder seed={slug} label={name} className={className} compact={compact} />;
  }

  const srcset = (ext: string) =>
    photo.widths.map((w) => `/images/menu/${slug}-${w}.${ext} ${w}w`).join(', ');
  const widest = photo.widths.at(-1);

  return (
    <div className={cx('relative overflow-hidden bg-cream-2', className)}>
      <img
        src={photo.lqip}
        alt=""
        aria-hidden="true"
        className={cx(
          'absolute inset-0 h-full w-full scale-110 object-cover blur-lg transition-opacity duration-500',
          loaded ? 'opacity-0' : 'opacity-100',
        )}
      />
      <picture>
        <source type="image/avif" srcSet={srcset('avif')} sizes={sizes} />
        <source type="image/webp" srcSet={srcset('webp')} sizes={sizes} />
        <img
          src={`/images/menu/${slug}-${widest}.jpg`}
          srcSet={srcset('jpg')}
          sizes={sizes}
          alt={name}
          width={1200}
          height={1200}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          {...({ fetchpriority: priority ? 'high' : 'auto' } as Record<string, string>)}
          onLoad={() => setLoaded(true)}
          className="relative h-full w-full object-cover"
        />
      </picture>
    </div>
  );
}
