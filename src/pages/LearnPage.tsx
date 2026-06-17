import { useEffect, useState } from 'react'
import { ChevronDownIcon, CompassIcon, PanelRightIcon, SparklesIcon } from 'lucide-react'

import { Board } from '@/components/board/Board'
import { ProjectSidebar } from '@/components/board/ProjectSidebar'
import { RightDock } from '@/components/playground/RightDock'
import { PlaygroundPanels } from '@/components/playground/PlaygroundPanels'
import { LearnTour } from '@/components/tour/LearnTour'
import { startTour } from '@/components/tour/store'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
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
  const isWide = useMediaQuery('(min-width: 1280px)')
  const [aboutOpen, setAboutOpen] = useState(
    () => localStorage.getItem('quereek:learnAboutOpen') === '1',
  )

  useEffect(() => {
    if (selectedProjectId) {
      localStorage.setItem('quereek:selectedProjectId', selectedProjectId)
    }
  }, [selectedProjectId])

  useEffect(() => {
    localStorage.setItem('quereek:learnAboutOpen', aboutOpen ? '1' : '0')
  }, [aboutOpen])

  const board = selectedProjectId ? (
    <Board projectId={selectedProjectId} />
  ) : (
    <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed bg-card/50 text-sm text-muted-foreground">
      Select a project to open its Kanban board.
    </div>
  )

  return (
    <div className="mx-auto flex w-full max-w-[110rem] flex-col gap-4 px-3 py-4 sm:px-6 sm:py-6 xl:h-[calc(100dvh-var(--header-h))]">
      <LearnTour />
      <div
        data-tour="hero"
        className="shrink-0 overflow-hidden rounded-xl border border-border/70 bg-card/70"
      >
        <div className="flex items-center justify-between gap-3 px-3 py-2 sm:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
              <SparklesIcon className="size-4" />
            </span>
            <div className="flex min-w-0 items-baseline gap-2">
              <h1 className="shrink-0 text-sm font-semibold sm:text-base">The board</h1>
              <span className="hidden truncate text-xs text-muted-foreground sm:inline">
                Interactive GraphQL playground
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAboutOpen((open) => !open)}
              aria-expanded={aboutOpen}
              aria-label={aboutOpen ? 'Hide details' : 'Show details'}
              title={aboutOpen ? 'Hide details' : 'Show details'}
              className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <ChevronDownIcon
                className={cn('size-4 transition-transform', aboutOpen && 'rotate-180')}
              />
            </button>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => startTour()}>
              <CompassIcon className="size-4" />
              <span className="hidden sm:inline">Take the tour</span>
              <span className="sm:hidden">Tour</span>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="xl:hidden">
                  <PanelRightIcon className="size-4" />
                  Learning dock
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md">
                <SheetHeader className="border-b px-4 py-3">
                  <SheetTitle className="font-display">Learning dock</SheetTitle>
                </SheetHeader>
                <div className="h-[calc(100dvh-3.75rem)]">
                  <RightDock embedded />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        {aboutOpen ? (
          <div className="border-t border-border/60 px-3 py-2.5 sm:px-4">
            <p className="max-w-3xl text-sm text-muted-foreground">
              Create projects, move tasks, assign people — then inspect every GraphQL operation
              with step-by-step explanations, see the raw data in{' '}
              <strong className="font-medium text-foreground">server/src/store.ts</strong>, edit it
              directly, and follow guided lessons. Nothing is hidden.
            </p>
          </div>
        ) : null}
      </div>

      {isWide ? (
        <div className="min-h-0 flex-1">
          <PlaygroundPanels
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
            board={board}
          />
        </div>
      ) : (
        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <div data-tour="projects" className="min-h-0">
            <ProjectSidebar
              selectedProjectId={selectedProjectId}
              onSelectProject={setSelectedProjectId}
            />
          </div>
          <div data-tour="board" className="min-w-0">
            {board}
          </div>
        </div>
      )}

      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-5 right-5 z-40 size-14 rounded-full p-0 shadow-lg shadow-primary/30 xl:hidden"
            aria-label="Open learning dock"
          >
            <SparklesIcon className="size-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md">
          <SheetHeader className="border-b px-4 py-3">
            <SheetTitle className="font-display">Learning dock</SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100dvh-3.75rem)]">
            <RightDock embedded />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
