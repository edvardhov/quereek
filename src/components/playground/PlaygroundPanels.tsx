import { useRef, useState, type ReactNode, type RefObject } from 'react'
import type { PanelImperativeHandle, PanelSize } from 'react-resizable-panels'
import { useDefaultLayout } from 'react-resizable-panels'
import {
  Maximize2Icon,
  Minimize2Icon,
  MinusIcon,
  PlusIcon,
} from 'lucide-react'

import { RightDock } from '@/components/playground/RightDock'
import { ProjectSidebar } from '@/components/board/ProjectSidebar'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { cn } from '@/lib/utils'

type PanelKey = 'projects' | 'board' | 'inspector'

const PANEL_KEYS: PanelKey[] = ['projects', 'board', 'inspector']

// A panel sitting at (or near) its collapsedSize rail width is treated as collapsed.
const COLLAPSE_PX_THRESHOLD = 80

interface PlaygroundPanelsProps {
  selectedProjectId: string | null
  onSelectProject: (projectId: string) => void
  board: ReactNode
}

export function PlaygroundPanels({
  selectedProjectId,
  onSelectProject,
  board,
}: PlaygroundPanelsProps) {
  const projectsRef = useRef<PanelImperativeHandle>(null)
  const boardRef = useRef<PanelImperativeHandle>(null)
  const inspectorRef = useRef<PanelImperativeHandle>(null)

  const refs: Record<PanelKey, RefObject<PanelImperativeHandle | null>> = {
    projects: projectsRef,
    board: boardRef,
    inspector: inspectorRef,
  }

  const [collapsed, setCollapsed] = useState<Record<PanelKey, boolean>>({
    projects: false,
    board: false,
    inspector: false,
  })

  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: 'quereek:playground-layout',
    panelIds: PANEL_KEYS,
  })

  const handleResize = (key: PanelKey) => (size: PanelSize) =>
    setCollapsed((prev) => {
      const next = size.inPixels <= COLLAPSE_PX_THRESHOLD
      return prev[key] === next ? prev : { ...prev, [key]: next }
    })

  const otherKeys = (key: PanelKey) => PANEL_KEYS.filter((k) => k !== key)

  const isMaximized = (key: PanelKey) =>
    !collapsed[key] && otherKeys(key).every((k) => collapsed[k])

  const toggleMaximize = (key: PanelKey) => {
    if (isMaximized(key)) {
      PANEL_KEYS.forEach((k) => refs[k].current?.expand())
    } else {
      refs[key].current?.expand()
      otherKeys(key).forEach((k) => refs[k].current?.collapse())
    }
  }

  const minimize = (key: PanelKey) => refs[key].current?.collapse()
  const expand = (key: PanelKey) => refs[key].current?.expand()

  return (
    <ResizablePanelGroup
      orientation="horizontal"
      defaultLayout={defaultLayout}
      onLayoutChanged={onLayoutChanged}
    >
      <ResizablePanel
        panelRef={projectsRef}
        id="projects"
        defaultSize="22%"
        minSize="15rem"
        collapsible
        collapsedSize="3rem"
        onResize={handleResize('projects')}
        className="min-h-0"
      >
        <PanelShell
          title="Projects"
          dataTour="projects"
          collapsed={collapsed.projects}
          maximized={isMaximized('projects')}
          onExpand={() => expand('projects')}
          onMinimize={() => minimize('projects')}
          onToggleMaximize={() => toggleMaximize('projects')}
        >
          <ProjectSidebar
            embedded
            selectedProjectId={selectedProjectId}
            onSelectProject={onSelectProject}
          />
        </PanelShell>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel
        panelRef={boardRef}
        id="board"
        defaultSize="48%"
        minSize="22rem"
        collapsible
        collapsedSize="3rem"
        onResize={handleResize('board')}
        className="min-h-0"
      >
        <PanelShell
          title="Board"
          dataTour="board"
          collapsed={collapsed.board}
          maximized={isMaximized('board')}
          onExpand={() => expand('board')}
          onMinimize={() => minimize('board')}
          onToggleMaximize={() => toggleMaximize('board')}
        >
          <div className="p-3">{board}</div>
        </PanelShell>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel
        panelRef={inspectorRef}
        id="inspector"
        defaultSize="30%"
        minSize="18rem"
        collapsible
        collapsedSize="3rem"
        onResize={handleResize('inspector')}
        className="min-h-0"
      >
        <PanelShell
          title="Learning dock"
          dataTour="inspector"
          collapsed={collapsed.inspector}
          maximized={isMaximized('inspector')}
          onExpand={() => expand('inspector')}
          onMinimize={() => minimize('inspector')}
          onToggleMaximize={() => toggleMaximize('inspector')}
          noPadding
        >
          <RightDock embedded />
        </PanelShell>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

interface PanelShellProps {
  title: string
  dataTour?: string
  collapsed: boolean
  maximized: boolean
  onExpand: () => void
  onMinimize: () => void
  onToggleMaximize: () => void
  noPadding?: boolean
  children: ReactNode
}

function PanelShell({
  title,
  dataTour,
  collapsed,
  maximized,
  onExpand,
  onMinimize,
  onToggleMaximize,
  noPadding,
  children,
}: PanelShellProps) {
  if (collapsed) {
    return (
      <button
        type="button"
        data-tour={dataTour}
        onClick={onExpand}
        title={`Expand ${title}`}
        aria-label={`Expand ${title}`}
        className="group flex h-full w-full flex-col items-center gap-3 overflow-hidden rounded-2xl border border-border/70 bg-card/40 py-3 transition-colors hover:border-primary/50 hover:bg-card/70"
      >
        <span className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
          <PlusIcon className="size-4" />
        </span>
        <span className="whitespace-nowrap font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground [writing-mode:vertical-rl]">
          {title}
        </span>
      </button>
    )
  }

  return (
    <div
      data-tour={dataTour}
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/40"
    >
      <div className="flex h-9 shrink-0 items-center justify-between gap-2 border-b border-border/60 bg-muted/30 pl-3 pr-1.5">
        <span className="truncate font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
          {title}
        </span>
        <div className="flex items-center gap-0.5">
          <PanelIconButton
            label={`Minimize ${title}`}
            onClick={onMinimize}
            disabled={maximized}
          >
            <MinusIcon className="size-3.5" />
          </PanelIconButton>
          <PanelIconButton
            label={maximized ? `Restore ${title}` : `Maximize ${title}`}
            onClick={onToggleMaximize}
          >
            {maximized ? (
              <Minimize2Icon className="size-3.5" />
            ) : (
              <Maximize2Icon className="size-3.5" />
            )}
          </PanelIconButton>
        </div>
      </div>
      <div className={cn('min-h-0 flex-1 overflow-auto', !noPadding && 'overflow-x-hidden')}>
        {children}
      </div>
    </div>
  )
}

interface PanelIconButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
  children: ReactNode
}

function PanelIconButton({ label, onClick, disabled, children }: PanelIconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  )
}
