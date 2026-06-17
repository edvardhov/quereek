import { GripVerticalIcon } from 'lucide-react'
import { Group, Panel, Separator } from 'react-resizable-panels'

import { cn } from '@/lib/utils'

function ResizablePanelGroup({
  className,
  ...props
}: React.ComponentProps<typeof Group>) {
  return <Group className={cn('h-full w-full', className)} {...props} />
}

const ResizablePanel = Panel

function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof Separator> & {
  withHandle?: boolean
}) {
  return (
    <Separator
      className={cn(
        'group relative mx-0.5 flex w-1 items-center justify-center rounded-full bg-border/60 transition-colors',
        'after:absolute after:inset-y-0 after:left-1/2 after:w-3 after:-translate-x-1/2',
        'hover:bg-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'data-[orientation=vertical]:mx-0 data-[orientation=vertical]:my-0.5 data-[orientation=vertical]:h-1 data-[orientation=vertical]:w-full',
        'data-[orientation=vertical]:after:left-0 data-[orientation=vertical]:after:top-1/2 data-[orientation=vertical]:after:h-3 data-[orientation=vertical]:after:w-full data-[orientation=vertical]:after:-translate-x-0 data-[orientation=vertical]:after:-translate-y-1/2',
        className,
      )}
      {...props}
    >
      {withHandle ? (
        <div className="z-10 flex h-7 w-3.5 items-center justify-center rounded-sm border border-border/70 bg-card text-muted-foreground shadow-sm transition-colors group-hover:border-primary/50 group-hover:text-primary">
          <GripVerticalIcon className="size-3" />
        </div>
      ) : null}
    </Separator>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
