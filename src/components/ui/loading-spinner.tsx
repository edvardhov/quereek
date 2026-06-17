import { Loader2Icon } from 'lucide-react'

import { cn } from '@/lib/utils'

type LoadingSpinnerProps = {
  label?: string
  className?: string
}

export function LoadingSpinner({ label, className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground',
        className,
      )}
    >
      <Loader2Icon className="size-6 animate-spin" />
      {label ? <p className="text-sm">{label}</p> : null}
    </div>
  )
}
