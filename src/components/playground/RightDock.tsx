import { BookOpenIcon, DatabaseIcon, ZapIcon } from 'lucide-react'

import { DataSourcePanel } from '@/components/playground/DataSourcePanel'
import { LessonsPanel } from '@/components/playground/LessonsPanel'
import { InspectorPanel } from '@/components/inspector/InspectorPanel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

type RightDockTab = 'inspector' | 'data' | 'lessons'

interface RightDockProps {
  embedded?: boolean
  defaultTab?: RightDockTab
}

export function RightDock({ embedded = false, defaultTab = 'inspector' }: RightDockProps) {
  return (
    <Tabs defaultValue={defaultTab} className="flex h-full min-h-0 flex-col">
      <TabsList
        className={cn(
          'mx-3 mt-2 grid w-auto shrink-0 grid-cols-3',
          embedded && 'mx-0 mt-0 rounded-none border-b bg-transparent px-2 pt-2',
        )}
      >
        <TabsTrigger value="inspector" className="gap-1.5 text-xs" data-tour="inspector-tab">
          <ZapIcon className="size-3.5" />
          Inspector
        </TabsTrigger>
        <TabsTrigger value="data" className="gap-1.5 text-xs" data-tour="data-tab">
          <DatabaseIcon className="size-3.5" />
          Data
        </TabsTrigger>
        <TabsTrigger value="lessons" className="gap-1.5 text-xs" data-tour="lessons-tab">
          <BookOpenIcon className="size-3.5" />
          Lessons
        </TabsTrigger>
      </TabsList>

      <TabsContent value="inspector" className="mt-0 min-h-0 flex-1 overflow-hidden">
        <InspectorPanel embedded />
      </TabsContent>
      <TabsContent value="data" className="mt-0 min-h-0 flex-1 overflow-hidden">
        <DataSourcePanel />
      </TabsContent>
      <TabsContent value="lessons" className="mt-0 min-h-0 flex-1 overflow-hidden">
        <LessonsPanel />
      </TabsContent>
    </Tabs>
  )
}
