import { useEffect, useState } from 'react'
import { PanelRightIcon } from 'lucide-react'

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

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border bg-accent/30 p-4">
        <h1 className="text-xl font-semibold">Interactive board</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Do things on the board — create projects, move tasks, assign people. The GraphQL
          Inspector on the right shows the exact operation, variables, response, and what concept
          you just used.
        </p>
      </div>

      <div className="flex items-center justify-end lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <PanelRightIcon className="size-4" />
              Open inspector
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>GraphQL Inspector</SheetTitle>
            </SheetHeader>
            <div className="mt-4 h-[calc(100vh-6rem)]">
              <InspectorPanel />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid min-h-[70vh] gap-4 lg:grid-cols-[minmax(240px,280px)_1fr_minmax(300px,380px)]">
        <ProjectSidebar
          selectedProjectId={selectedProjectId}
          onSelectProject={setSelectedProjectId}
        />
        <div className="min-w-0">
          {selectedProjectId ? (
            <Board projectId={selectedProjectId} />
          ) : (
            <div className="flex h-48 items-center justify-center rounded-xl border bg-card text-sm text-muted-foreground">
              Select a project to open its Kanban board.
            </div>
          )}
        </div>
        <div className="hidden min-h-0 lg:block">
          <InspectorPanel />
        </div>
      </div>
    </div>
  )
}
