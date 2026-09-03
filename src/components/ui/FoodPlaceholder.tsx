import { cx } from '@/lib/format';

/**
 * Stand-in for the item photography, which is still being shot.
 *
 * Rather than a grey box, each item gets a deterministic warm gradient drawn
 * from the brand palette plus the cloche mark, so a menu grid with no photos
 * still reads as designed rather than broken. Swap for <SmartImage> per item
 * as the shoot lands — nothing else needs to change.
 */
// Ordered so a straight 0..4 cycle alternates red / gold / dark and never
// puts two similar tiles side by side.
const SCHEMES = [
  { from: '#E32119', to: '#7E1113', ink: '#FFE9C7' },
  { from: '#F7A81B', to: '#DD9110', ink: '#3B0D0A' },
  { from: '#7E1113', to: '#2B0A08', ink: '#F7C97B' },
  { from: '#F7A81B', to: '#C8180F', ink: '#FFF1D6' },
  { from: '#9E1B1B', to: '#5E0D0E', ink: '#FFD9A0' },
];

import { placeholderTone } from '@/data/menu';

/** Only drives the decorative ring offsets, not the colour. */
const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};

export function FoodPlaceholder({
  seed,
  label,
  className,
  compact,
}: {
  seed: string;
  label: string;
  className?: string;
  compact?: boolean;
}) {
  const h = hash(seed);
  const scheme = SCHEMES[placeholderTone(seed)];
  const angle = 120 + (h % 5) * 22;

  return (
    <div
      className={cx('relative grid place-items-center overflow-hidden', className)}
      style={{ background: `linear-gradient(${angle}deg, ${scheme.from}, ${scheme.to})` }}
      role="img"
      aria-label={`${label} — photograph coming soon`}
    >
      {/* Concentric plate rings, offset per item so no two tiles look alike. */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-[0.16]"
        viewBox="0 0 200 200"
        preserveAspectRatio="xMidYMid slice"
      >
        <g fill="none" stroke={scheme.ink} strokeWidth="1.1">
          <circle cx={100 + (h % 30) - 15} cy={100 + ((h >> 4) % 26) - 13} r="34" />
          <circle cx={100 + (h % 30) - 15} cy={100 + ((h >> 4) % 26) - 13} r="52" />
          <circle cx={100 + (h % 30) - 15} cy={100 + ((h >> 4) % 26) - 13} r="72" />
        </g>
      </svg>

      <div className="relative flex flex-col items-center gap-2 px-4 text-center">
        {/* Cloche mark from the brand kit, redrawn small. */}
        <svg aria-hidden="true" viewBox="0 0 48 34" className={compact ? 'w-7' : 'w-10'} fill={scheme.ink}>
          <circle cx="24" cy="4" r="3" />
          <path d="M24 8C13.5 8 5 15.4 5 24.5c0 .8.7 1.5 1.5 1.5h35c.8 0 1.5-.7 1.5-1.5C43 15.4 34.5 8 24 8Z" />
          <rect x="1" y="28" width="46" height="5" rx="2.5" />
        </svg>
        {!compact && (
          <span
            className="eyebrow opacity-70"
            style={{ color: scheme.ink }}
          >
            Photo coming
          </span>
        )}
      </div>
    </div>
  );
}
