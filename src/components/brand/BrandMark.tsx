import { cn } from '@/lib/utils'

type BrandMarkProps = {
  className?: string
  iconSize?: number
  showWordmark?: boolean
  wordmarkClassName?: string
}

/**
 * Quereek logo: orange braces icon + "quereek." wordmark.
 * The icon is self-contained (orange circle, dark braces) and reads on both
 * themes; the wordmark uses the current foreground color so it adapts.
 */
export function BrandMark({
  className,
  iconSize = 32,
  showWordmark = true,
  wordmarkClassName,
}: BrandMarkProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 96 96"
        role="img"
        aria-label="Quereek"
        className="shrink-0"
      >
        <circle cx="48" cy="48" r="44" fill="#F08C2E" />
        <path
          d="M41 28 C 33 28 33 43 26 48 C 33 53 33 68 41 68"
          fill="none"
          stroke="#0a0a0a"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M55 28 C 63 28 63 43 70 48 C 63 53 63 68 55 68"
          fill="none"
          stroke="#0a0a0a"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showWordmark ? (
        <span
          className={cn(
            'font-brand text-xl font-semibold leading-none tracking-[-0.03em]',
            wordmarkClassName,
          )}
        >
          quereek<span className="text-primary">.</span>
        </span>
      ) : null}
    </span>
  )
}
