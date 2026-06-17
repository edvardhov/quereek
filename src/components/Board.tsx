import { useQuery, useSubscription } from '@apollo/client/react'
import { GET_PROJECT_BOARD } from '../graphql/queries'
import { TASK_CHANGED } from '../graphql/subscriptions'
import {
  STATUS_LABELS,
  STATUS_ORDER,
  type Project,
  type Task,
  type User,
} from '../types'
import { NewTaskForm } from './NewTaskForm'
import { Spinner } from './Spinner'
import { TaskCard } from './TaskCard'

interface BoardProps {
  projectId: string
}

export function Board({ projectId }: BoardProps) {
  const { data, loading, error } = useQuery<{
    project: (Project & { tasks: Task[] }) | null
    users: User[]
  }>(GET_PROJECT_BOARD, {
    variables: { projectId },
  })

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
        {
          query: GET_PROJECT_BOARD,
          variables: { projectId },
        },
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
            if (index >= 0) {
              tasks[index] = event.task
            } else {
              tasks.push(event.task)
            }
          }

          if (event.action === 'DELETED' && event.taskId) {
            const index = tasks.findIndex((task) => task.id === event.taskId)
            if (index >= 0) tasks.splice(index, 1)
          }

          return {
            ...existing,
            project: {
              ...existing.project,
              tasks,
            },
          }
        },
      )
    },
  })

  if (loading)
    return (
      <section className="board board-loading uiv-loading">
        <Spinner label="Loading board..." />
      </section>
    )
  if (error) {
    return (
      <section className="board board-error">
        Failed to load board: {error.message}
      </section>
    )
  }

  const project = data?.project
  const users = data?.users ?? []

  if (!project) {
    return (
      <section className="board board-empty">
        Project not found. Select another project from the sidebar.
      </section>
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
    <section className="board">
      <header className="board-header">
        <div>
          <h2>{project.name}</h2>
          {project.description ? <p>{project.description}</p> : null}
        </div>
        <span className="task-count">{project.tasks.length} tasks</span>
      </header>

      <NewTaskForm projectId={projectId} users={users} />

      <div className="columns">
        {STATUS_ORDER.map((status) => (
          <div key={status} className="column">
            <header className="column-header">
              <h3>{STATUS_LABELS[status]}</h3>
              <span>{tasksByStatus[status].length}</span>
            </header>
            <div className="column-body">
              {tasksByStatus[status].map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  projectId={projectId}
                  users={users}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
