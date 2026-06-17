import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CREATE_TASK } from '@/graphql/mutations'
import { GET_PROJECT_BOARD } from '@/graphql/queries'
import type { Task, TaskStatus, User } from '@/types'

interface NewTaskFormProps {
  projectId: string
  users: User[]
}

export function NewTaskForm({ projectId, users }: NewTaskFormProps) {
  const [status, setStatus] = useState<TaskStatus>('TODO')
  const [assigneeId, setAssigneeId] = useState<string>('none')

  const [createTask, { loading }] = useMutation<{
    createTask: Task & { project: { id: string } }
  }>(CREATE_TASK, {
    update(cache, { data }) {
      const created = data?.createTask
      if (!created) return
      cache.updateQuery<{ project: { tasks: Task[] } | null }>(
        { query: GET_PROJECT_BOARD, variables: { projectId } },
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
    if (!title) return

    try {
      await createTask({
        variables: {
          input: {
            title,
            description: description || null,
            projectId,
            assigneeId: assigneeId === 'none' ? null : assigneeId,
            status,
          },
        },
      })
      toast.success('Task created')
      form.reset()
      setStatus('TODO')
      setAssigneeId('none')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create task')
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Add task</CardTitle>
        <p className="text-xs text-muted-foreground">
          Triggers a CreateTask mutation — check the inspector.
        </p>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-2" onSubmit={(e) => void handleSubmit(e)}>
          <Input name="title" placeholder="Task title" required />
          <Textarea name="description" placeholder="Details (optional)" rows={2} />
          <div className="grid grid-cols-2 gap-2">
            <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODO">To Do</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="DONE">Done</SelectItem>
              </SelectContent>
            </Select>
            <Select value={assigneeId} onValueChange={setAssigneeId}>
              <SelectTrigger>
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Unassigned</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Adding…' : 'Add task'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
