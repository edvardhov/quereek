import { useQuery, useSubscription } from '@apollo/client/react'

import { NewTaskForm } from '@/components/board/NewTaskForm'
import { STATUS_STYLES } from '@/components/board/status'
import { TaskCard } from '@/components/board/TaskCard'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { cn } from '@/lib/utils'
import { GET_PROJECT_BOARD } from '@/graphql/queries'
import { TASK_CHANGED } from '@/graphql/subscriptions'
import {
  STATUS_LABELS,
  STATUS_ORDER,
  type Project,
  type Task,
  type User,
} from '@/types'

interface BoardProps {
  projectId: string
}

export function Board({ projectId }: BoardProps) {
  const { data, loading, error } = useQuery<{
    project: (Project & { tasks: Task[] }) | null
    users: User[]
  }>(GET_PROJECT_BOARD, { variables: { projectId } })

  useSubscription<{
    taskChanged: { action: string; taskId: string | null; task: Task | null }
  }>(TASK_CHANGED, {
    variables: { projectId },
    onData: ({ client, data: subscriptionData }) => {
      const event = subscriptionData.data?.taskChanged
      if (!event) return

      client.cache.updateQuery<{
        project: (Project & { tasks: Task[] }) | null
        users: User[]
      }>({ query: GET_PROJECT_BOARD, variables: { projectId } }, (existing) => {
        if (!existing?.project) return existing
        const tasks = [...existing.project.tasks]

        if (event.action === 'CREATED' && event.task) {
          if (!tasks.some((task) => task.id === event.task!.id)) {
            tasks.push(event.task)
          }
        }
        if (event.action === 'UPDATED' && event.task) {
          const index = tasks.findIndex((task) => task.id === event.task!.id)
          if (index >= 0) tasks[index] = event.task
          else tasks.push(event.task)
        }
        if (event.action === 'DELETED' && event.taskId) {
          const index = tasks.findIndex((task) => task.id === event.taskId)
          if (index >= 0) tasks.splice(index, 1)
        }

        return {
          ...existing,
          project: { ...existing.project, tasks },
        }
      })
    },
  })

  if (loading) {
    return (
      <Card>
        <CardContent>
          <LoadingSpinner label="Loading board…" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="pt-6 text-sm text-destructive">
          Failed to load board: {error.message}
        </CardContent>
      </Card>
    )
  }

  const project = data?.project
  const users = data?.users ?? []

  if (!project) {
    return (
      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">
          Project not found. Select another project from the sidebar.
        </CardContent>
      </Card>
    )
  }

  const tasksByStatus = STATUS_ORDER.reduce<Record<string, Task[]>>(
    (acc, status) => {
      acc[status] = project.tasks.filter((task) => task.status === status)
      return acc
    },
    {},
  )

  return (
    <div className="flex flex-col gap-4">
      <Card className="overflow-hidden">
        <CardHeader className="flex-row items-start justify-between gap-3 p-5">
          <div className="min-w-0">
            <CardTitle className="text-lg">{project.name}</CardTitle>
            {project.description ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {project.description}
              </p>
            ) : null}
          </div>
          <Badge variant="secondary" className="shrink-0 font-mono">
            {project.tasks.length} task{project.tasks.length === 1 ? '' : 's'}
          </Badge>
        </CardHeader>
      </Card>

      <NewTaskForm projectId={projectId} users={users} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {STATUS_ORDER.map((status) => {
          const styles = STATUS_STYLES[status]
          const tasks = tasksByStatus[status]
          return (
            <div
              key={status}
              className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-muted/30 p-3"
            >
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className={cn('size-2.5 rounded-full', styles.dot)} />
                  <h3 className="text-sm font-semibold">
                    {STATUS_LABELS[status]}
                  </h3>
                </div>
                <Badge
                  variant="outline"
                  className={cn('font-mono', styles.badge)}
                >
                  {tasks.length}
                </Badge>
              </div>
              <div className="flex flex-col gap-2.5">
                {tasks.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border/70 px-3 py-6 text-center text-xs text-muted-foreground">
                    Nothing here yet
                  </div>
                ) : (
                  tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      projectId={projectId}
                      users={users}
                    />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
