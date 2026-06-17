import { useMutation } from '@apollo/client/react'
import { CREATE_TASK } from '../graphql/mutations'
import { GET_PROJECT_BOARD } from '../graphql/queries'
import type { Task, TaskStatus, User } from '../types'

interface NewTaskFormProps {
  projectId: string
  users: User[]
}

export function NewTaskForm({ projectId, users }: NewTaskFormProps) {
  const [createTask, { loading }] = useMutation<{ createTask: Task & { project: { id: string } } }>(
    CREATE_TASK,
    {
    update(cache, { data }) {
      const created = data?.createTask
      if (!created) return

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
              tasks: [...existing.project.tasks, created],
            },
          }
        },
      )
    },
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const title = String(formData.get('title') ?? '').trim()
    const description = String(formData.get('description') ?? '').trim()
    const assigneeId = String(formData.get('assigneeId') ?? '')
    const status = String(formData.get('status') ?? 'TODO') as TaskStatus

    if (!title) return

    await createTask({
      variables: {
        input: {
          title,
          description: description || null,
          projectId,
          assigneeId: assigneeId || null,
          status,
        },
      },
    })

    form.reset()
  }

  return (
    <form className="new-task-form" onSubmit={(event) => void handleSubmit(event)}>
      <h3>Add task</h3>
      <input name="title" placeholder="Task title" required />
      <textarea name="description" placeholder="Details (optional)" rows={2} />
      <div className="new-task-row">
        <select name="status" defaultValue="TODO">
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
        <select name="assigneeId" defaultValue="">
          <option value="">Unassigned</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add task'}
        </button>
      </div>
    </form>
  )
}
