import { useQuery, useSubscription } from '@apollo/client/react'

import { NewTaskForm } from '@/components/board/NewTaskForm'
import { TaskCard } from '@/components/board/TaskCard'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
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

  useSubscription<{ taskChanged: { action: string; taskId: string | null; task: Task | null } }>(
    TASK_CHANGED,
    {
      variables: { projectId },
      onData: ({ client, data: subscriptionData }) => {
        const event = subscriptionData.data?.taskChanged
        if (!event) return

        client.cache.updateQuery<{
          project: (Project & { tasks: Task[] }) | null
          users: User[]
        }>(
          { query: GET_PROJECT_BOARD, variables: { projectId } },
          (existing) => {
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
          },
        )
      },
    },
  )

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

  const tasksByStatus = STATUS_ORDER.reduce<Record<string, Task[]>>((acc, status) => {
    acc[status] = project.tasks.filter((task) => task.status === status)
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex-row items-start justify-between gap-2">
          <div>
            <CardTitle>{project.name}</CardTitle>
            {project.description ? (
              <p className="text-sm text-muted-foreground">{project.description}</p>
            ) : null}
          </div>
          <Badge variant="secondary">{project.tasks.length} tasks</Badge>
        </CardHeader>
      </Card>

      <NewTaskForm projectId={projectId} users={users} />

      <div className="grid gap-4 md:grid-cols-3">
        {STATUS_ORDER.map((status) => (
          <Card key={status} className="flex flex-col">
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">{STATUS_LABELS[status]}</CardTitle>
              <Badge variant="outline">{tasksByStatus[status].length}</Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {tasksByStatus[status].map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  projectId={projectId}
                  users={users}
                />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
