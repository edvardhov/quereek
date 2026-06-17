import { useEffect, useState } from 'react'
import { PanelRightIcon, SparklesIcon } from 'lucide-react'

import { Board } from '@/components/board/Board'
import { ProjectSidebar } from '@/components/board/ProjectSidebar'
import { InspectorPanel } from '@/components/inspector/InspectorPanel'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export function LearnPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(() =>
    localStorage.getItem('quereek:selectedProjectId'),
  )

  useEffect(() => {
    if (selectedProjectId) {
      localStorage.setItem('quereek:selectedProjectId', selectedProjectId)
    }
  }, [selectedProjectId])

  const board = selectedProjectId ? (
    <Board projectId={selectedProjectId} />
  ) : (
    <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed bg-card/50 text-sm text-muted-foreground">
      Select a project to open its Kanban board.
    </div>
  )

  return (
    <div className="mx-auto flex w-full max-w-[110rem] flex-col gap-4 px-3 py-4 sm:px-6 sm:py-6 xl:h-[calc(100dvh-var(--header-h))]">
      <div className="relative shrink-0 overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-4 sm:p-5">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-primary" />
        <div className="flex flex-wrap items-start justify-between gap-3 pl-2">
          <div className="min-w-0">
            <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.18em] text-primary">
              Interactive playground
            </p>
            <h1 className="mt-1 text-xl font-semibold sm:text-2xl">The board</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Create projects, move tasks, assign people. The GraphQL Inspector shows the exact
              operation, variables, response, and the concept you just used.
            </p>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="shrink-0 xl:hidden">
                <PanelRightIcon className="size-4" />
                Inspector
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md">
              <SheetHeader className="border-b px-4 py-3">
                <SheetTitle className="font-display">GraphQL Inspector</SheetTitle>
              </SheetHeader>
              <div className="h-[calc(100dvh-3.75rem)]">
                <InspectorPanel embedded />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[19rem_minmax(0,1fr)_24rem]">
        <div className="min-h-0 xl:overflow-y-auto xl:pr-1">
          <ProjectSidebar
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
          />
        </div>
        <div className="min-w-0 xl:min-h-0 xl:overflow-y-auto xl:pr-1">{board}</div>
        <div className="hidden min-h-0 xl:block">
          <InspectorPanel />
        </div>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-5 right-5 z-40 size-14 rounded-full p-0 shadow-lg shadow-primary/30 xl:hidden"
            aria-label="Open GraphQL Inspector"
          >
            <SparklesIcon className="size-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md">
          <SheetHeader className="border-b px-4 py-3">
            <SheetTitle className="font-display">GraphQL Inspector</SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100dvh-3.75rem)]">
            <InspectorPanel embedded />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
