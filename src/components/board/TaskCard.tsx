import { useMutation } from '@apollo/client/react'
import { ChevronLeftIcon, ChevronRightIcon, Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'

import { STATUS_STYLES } from '@/components/board/status'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { ASSIGN_TASK, DELETE_TASK, MOVE_TASK } from '@/graphql/mutations'
import { GET_PROJECT_BOARD } from '@/graphql/queries'
import {
  STATUS_LABELS,
  STATUS_ORDER,
  type Task,
  type TaskStatus,
  type User,
} from '@/types'

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
  const [deleteTask] = useMutation<{
    deleteTask: { id: string; project: { id: string } }
  }>(DELETE_TASK, {
    update(cache, { data }) {
      const deletedId = data?.deleteTask.id
      if (!deletedId) return
      cache.updateQuery<{ project: { tasks: Task[] } | null }>(
        { query: GET_PROJECT_BOARD, variables: { projectId } },
        (existing) => {
          if (!existing?.project) return existing
          return {
            project: {
              ...existing.project,
              tasks: existing.project.tasks.filter(
                (item) => item.id !== deletedId,
              ),
            },
          }
        },
      )
    },
  })

  const currentIndex = STATUS_ORDER.indexOf(task.status)

  const moveTo = async (status: TaskStatus) => {
    try {
      await moveTask({ variables: { id: task.id, status } })
      toast.success(`Moved to ${STATUS_LABELS[status]}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Move failed')
    }
  }

  const handleAssign = async (userId: string) => {
    const assignee = users.find((user) => user.id === userId) ?? null
    try {
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
      toast.success('Assignee updated')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Assign failed')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteTask({ variables: { id: task.id } })
      toast.success('Task deleted')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  const styles = STATUS_STYLES[task.status]

  return (
    <Card
      className={cn(
        'relative gap-2 overflow-hidden py-3 transition-all duration-200',
        'before:absolute before:inset-y-0 before:left-0 before:w-1 before:content-[""]',
        'hover:-translate-y-0.5 hover:border-border hover:shadow-md',
        styles.accent,
      )}
    >
      <CardHeader className="flex-row items-start justify-between gap-2 px-4 pb-0 pl-5">
        <CardTitle className="text-sm leading-snug">{task.title}</CardTitle>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
          aria-label={`Delete ${task.title}`}
          onClick={() => void handleDelete()}
        >
          <Trash2Icon className="size-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-4 pl-5 pt-0">
        {task.description ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {task.description}
          </p>
        ) : null}
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">
            Assignee
          </span>
          <Select
            value={task.assignee?.id ?? 'none'}
            onValueChange={(value) =>
              void handleAssign(value === 'none' ? '' : value)
            }
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Unassigned" />
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
        <div className="flex flex-wrap gap-1">
          {currentIndex > 0 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => void moveTo(STATUS_ORDER[currentIndex - 1])}
            >
              <ChevronLeftIcon className="size-3" />
              {STATUS_LABELS[STATUS_ORDER[currentIndex - 1]]}
            </Button>
          ) : null}
          {currentIndex < STATUS_ORDER.length - 1 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => void moveTo(STATUS_ORDER[currentIndex + 1])}
            >
              {STATUS_LABELS[STATUS_ORDER[currentIndex + 1]]}
              <ChevronRightIcon className="size-3" />
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
