import { useState } from 'react';
import { cx } from '@/lib/format';

/** LQIP thumbnails produced by scripts/optimize-images.mjs. */
const LQIP: Record<string, string> = {
  hero: 'data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAADwAwCdASoYAA0APu1kqk4ppaQiMAgBMB2JYgCdABhoKtJ6ykULMKwAAP7RlMoxIBB+nZovKZT66lHrKhV5+6eiCtEkX7/SLpM1FF09ImBhL7WAsY3xkgkgAAA=',
  room: 'data:image/webp;base64,UklGRooAAABXRUJQVlA4IH4AAAAwBQCdASoYABwAPu1kqE4ppaOiMAgBMB2JZACxHxyEIBbTgEudmDncYb0uuY42KaG+CAD4kETeUcgUsQrW7Gm8CrVTRn1YXKypDResm/HYgsCeR0yItH8XXCYXFk7JAC+hYUE9toJtkyNClmEs4dbDZm27JOk9t8as2/IAAAA=',
  counter: 'data:image/webp;base64,UklGRogAAABXRUJQVlA4IHwAAACwBACdASoYABIAPu1oqU+ppaOiKA1RMB2JZgCdMoABn2uty2gyg1b1/gLBwONQAP1OZRwgxrdxWQDDimwRH9D8MzUVyBPb7m1G12ndtSt5bwU+IkBBDnF7bEE+QLDs62m7bYQhiqBV6DYqzoXq2wIDyinNfFVcMkMS6gAA',
};

const WIDTHS: Record<string, number[]> = {
  hero: [640, 960, 1280, 1920, 2560],
  room: [640],
  counter: [640, 960],
};

const srcset = (name: string, ext: string) =>
  WIDTHS[name].map((w) => `/images/${name}-${w}.${ext} ${w}w`).join(', ');

interface Props {
  name: keyof typeof WIDTHS | string;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}

/**
 * AVIF → WebP → JPEG picture with a blurred base64 placeholder underneath, so
 * the layout never shifts and the hero never flashes an empty box.
 */
export function SmartImage({ name, alt, sizes, className, imgClassName, priority, width, height }: Props) {
  const [loaded, setLoaded] = useState(false);
  const widest = WIDTHS[name]?.at(-1) ?? 1280;

  return (
    <div className={cx('relative overflow-hidden bg-ink-2/10', className)}>
      {LQIP[name] && (
        <img
          src={LQIP[name]}
          alt=""
          aria-hidden="true"
          className={cx(
            'absolute inset-0 h-full w-full scale-110 object-cover blur-xl transition-opacity duration-700',
            loaded ? 'opacity-0' : 'opacity-100',
          )}
        />
      )}
      <picture>
        <source type="image/avif" srcSet={srcset(name, 'avif')} sizes={sizes} />
        <source type="image/webp" srcSet={srcset(name, 'webp')} sizes={sizes} />
        <img
          src={`/images/${name}-${widest}.jpg`}
          srcSet={srcset(name, 'jpg')}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          // React 18 passes through only the lowercase DOM attribute name.
          {...({ fetchpriority: priority ? 'high' : 'auto' } as Record<string, string>)}
          decoding={priority ? 'sync' : 'async'}
          onLoad={() => setLoaded(true)}
          className={cx('relative h-full w-full object-cover', imgClassName)}
        />
      </picture>
    </div>
  );
}
