import { Trash2Icon, ZapIcon } from 'lucide-react'

import { InspectorEvent } from '@/components/inspector/InspectorEvent'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useInspector } from '@/inspector/useInspector'
import { cn } from '@/lib/utils'

interface InspectorPanelProps {
  /** When embedded (e.g. inside a Sheet) drop the outer chrome + title. */
  embedded?: boolean
}

export function InspectorPanel({ embedded = false }: InspectorPanelProps) {
  const { events, clear } = useInspector()

  return (
    <div
      className={cn(
        'flex h-full min-h-0 flex-col',
        !embedded && 'rounded-2xl border border-border/70 bg-card shadow-sm',
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border/60 p-4">
        {embedded ? (
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
            {events.length} operation{events.length === 1 ? '' : 's'}
          </span>
        ) : (
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/12 text-primary">
              <ZapIcon className="size-4" />
            </span>
            <div>
              <h2 className="font-display text-sm font-semibold leading-tight">
                GraphQL Inspector
              </h2>
              <p className="font-mono text-[0.7rem] text-muted-foreground">
                {events.length} operation{events.length === 1 ? '' : 's'}{' '}
                recorded
              </p>
            </div>
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={clear}
          disabled={events.length === 0}
        >
          <Trash2Icon className="size-4" />
          Clear
        </Button>
      </div>
      <ScrollArea className="flex-1 p-4">
        {events.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/30 px-4 py-10 text-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ZapIcon className="size-5" />
            </span>
            <p className="text-sm font-medium">No operations yet</p>
            <p className="max-w-[16rem] text-xs text-muted-foreground">
              Create a project, move a task, or open a board — every GraphQL
              call will appear here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {events.map((event) => (
              <InspectorEvent key={event.id} event={event} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
