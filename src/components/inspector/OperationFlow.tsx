import { cn } from '@/lib/utils'
import type { FlowStep, FlowStepKind } from '@/content/concepts'

const STEP_ICONS: Record<FlowStepKind, string> = {
  ui: '1',
  apollo: '2',
  transport: '3',
  resolver: '4',
  store: '5',
  response: '6',
  cache: '7',
  'ui-update': '8',
  websocket: 'W',
}

interface OperationFlowProps {
  steps: FlowStep[]
  resolverPath?: string[]
  dataSource?: string
  compact?: boolean
}

export function OperationFlow({
  steps,
  resolverPath,
  dataSource,
  compact = false,
}: OperationFlowProps) {
  return (
    <div className={cn('flex flex-col gap-3', compact && 'gap-2')}>
      {dataSource ? (
        <div className="rounded-md border border-primary/20 bg-primary/5 px-3 py-2">
          <p className="font-mono text-[0.65rem] uppercase tracking-wider text-primary">
            Data source
          </p>
          <p className="mt-0.5 font-mono text-xs text-foreground">
            {dataSource}
          </p>
        </div>
      ) : null}

      <ol className="relative flex flex-col gap-0">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1
          return (
            <li
              key={`${step.kind}-${index}`}
              className="relative flex gap-3 pb-4 last:pb-0"
            >
              {!isLast ? (
                <span
                  aria-hidden
                  className="absolute left-[0.85rem] top-7 h-[calc(100%-0.5rem)] w-px bg-border"
                />
              ) : null}
              <span
                className={cn(
                  'relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-mono text-[0.65rem] font-semibold text-primary',
                  compact && 'size-6 text-[0.6rem]',
                )}
              >
                {STEP_ICONS[step.kind]}
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p
                  className={cn(
                    'text-sm font-medium leading-tight',
                    compact && 'text-xs',
                  )}
                >
                  {step.label}
                </p>
                <p
                  className={cn(
                    'mt-0.5 text-xs leading-relaxed text-muted-foreground',
                    compact && 'text-[0.7rem]',
                  )}
                >
                  {step.detail}
                </p>
              </div>
            </li>
          )
        })}
      </ol>

      {resolverPath && resolverPath.length > 0 ? (
        <div className="rounded-md border bg-muted/30 px-3 py-2">
          <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
            Resolver path
          </p>
          <ol className="mt-1.5 flex flex-col gap-1">
            {resolverPath.map((step, index) => (
              <li
                key={index}
                className="flex items-start gap-2 font-mono text-[0.7rem] text-foreground"
              >
                <span className="mt-px shrink-0 text-muted-foreground">
                  {index + 1}.
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  )
}
