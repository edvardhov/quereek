import { useMutation } from '@apollo/client/react'
import { ASSIGN_TASK, DELETE_TASK, MOVE_TASK } from '../graphql/mutations'
import { GET_PROJECT_BOARD } from '../graphql/queries'
import { STATUS_LABELS, STATUS_ORDER, type Task, type TaskStatus, type User } from '../types'

interface TaskCardProps {
  task: Task
  projectId: string
  users: User[]
}

export function TaskCard({ task, projectId, users }: TaskCardProps) {
  const [moveTask] = useMutation(MOVE_TASK, {
    optimisticResponse: (variables) => ({
      moveTask: {
        __typename: 'Task',
        ...task,
        status: variables.status,
        project: { __typename: 'Project', id: projectId },
      },
    }),
  })

  const [assignTask] = useMutation(ASSIGN_TASK)
  const [deleteTask] = useMutation<{ deleteTask: { id: string; project: { id: string } } }>(
    DELETE_TASK,
    {
    update(cache, { data }) {
      const deletedId = data?.deleteTask.id
      if (!deletedId) return

      cache.updateQuery<{ project: { tasks: Task[] } | null }>(
        {
          query: GET_PROJECT_BOARD,
          variables: { projectId },
        },
        (existing) => {
          if (!existing?.project) return existing
          return {
            project: {
              ...existing.project,
              tasks: existing.project.tasks.filter((item) => item.id !== deletedId),
            },
          }
        },
      )
    },
  })

  const currentIndex = STATUS_ORDER.indexOf(task.status)

  const moveTo = async (status: TaskStatus) => {
    await moveTask({ variables: { id: task.id, status } })
  }

  const handleAssign = async (userId: string) => {
    const assignee = users.find((user) => user.id === userId) ?? null
    await assignTask({
      variables: { id: task.id, userId: userId || null },
      optimisticResponse: {
        assignTask: {
          __typename: 'Task',
          ...task,
          assignee,
          project: { __typename: 'Project', id: projectId },
        },
      },
    })
  }

  return (
    <article className="task-card">
      <header className="task-card-header">
        <h4>{task.title}</h4>
        <button
          type="button"
          className="task-delete"
          aria-label={`Delete ${task.title}`}
          onClick={() => void deleteTask({ variables: { id: task.id } })}
        >
          ×
        </button>
      </header>

      {task.description ? <p className="task-description">{task.description}</p> : null}

      <div className="task-meta">
        <label className="assignee-label">
          Assignee
          <select
            value={task.assignee?.id ?? ''}
            onChange={(event) => void handleAssign(event.target.value)}
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="task-actions">
        {currentIndex > 0 ? (
          <button
            type="button"
            onClick={() => void moveTo(STATUS_ORDER[currentIndex - 1])}
          >
            ← {STATUS_LABELS[STATUS_ORDER[currentIndex - 1]]}
          </button>
        ) : null}
        {currentIndex < STATUS_ORDER.length - 1 ? (
          <button
            type="button"
            onClick={() => void moveTo(STATUS_ORDER[currentIndex + 1])}
          >
            {STATUS_LABELS[STATUS_ORDER[currentIndex + 1]]} →
          </button>
        ) : null}
      </div>
    </article>
  )
}
