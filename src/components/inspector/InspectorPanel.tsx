import { Trash2Icon } from 'lucide-react'

import { InspectorEvent } from '@/components/inspector/InspectorEvent'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useInspector } from '@/inspector/useInspector'

export function InspectorPanel() {
  const { events, clear } = useInspector()

  return (
    <div className="flex h-full min-h-0 flex-col rounded-xl border bg-card">
      <div className="flex items-center justify-between gap-2 p-4">
        <div>
          <h2 className="font-semibold">GraphQL Inspector</h2>
          <p className="text-sm text-muted-foreground">
            Every action shows the operation, variables, and response.
          </p>
        </div>
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
      <Separator />
      <ScrollArea className="flex-1 p-4">
        {events.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
            <p>No operations yet.</p>
            <p>Create a project, move a task, or open a board — then watch here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {events.map((event) => (
              <InspectorEvent key={event.id} event={event} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
