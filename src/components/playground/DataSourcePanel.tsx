import { useEffect, useState, type ReactNode } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { DatabaseIcon, RotateCcwIcon } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  RESET_STORE,
  STORE_SNAPSHOT,
  UPDATE_RAW_PROJECT,
  UPDATE_RAW_TASK,
  UPDATE_RAW_USER,
} from '@/graphql/store'
import { GET_PROJECTS } from '@/graphql/queries'
import { GET_PROJECT_BOARD } from '@/graphql/queries'
import { subscribeInspector } from '@/inspector/store'
import { STATUS_LABELS, STATUS_ORDER, type TaskStatus } from '@/types'
import { cn } from '@/lib/utils'

interface RawTask {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  projectId: string
  assigneeId: string | null
  createdAt: string
}

interface RawProject {
  id: string
  name: string
  description: string | null
  createdAt: string
}

interface RawUser {
  id: string
  name: string
  email: string
}

interface StoreSnapshotData {
  storeSnapshot: {
    users: RawUser[]
    projects: RawProject[]
    tasks: RawTask[]
  }
}

export function DataSourcePanel() {
  const { data, loading, error, refetch } = useQuery<StoreSnapshotData>(
    STORE_SNAPSHOT,
    { pollInterval: 5000 },
  )

  useEffect(() => {
    return subscribeInspector(() => {
      void refetch()
    })
  }, [refetch])

  const [resetStore, { loading: resetting }] = useMutation<{ resetStore: StoreSnapshotData['storeSnapshot'] }>(
    RESET_STORE,
    {
      refetchQueries: [{ query: GET_PROJECTS }, { query: STORE_SNAPSHOT }],
      onCompleted: () => toast.success('Store reset to seed data'),
      onError: (err) => toast.error(err.message),
    },
  )

  const handleReset = async () => {
    await resetStore()
  }

  if (loading && !data) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-sm text-muted-foreground">
        Loading store snapshot…
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-sm text-destructive">
        Failed to load store: {error.message}
      </div>
    )
  }

  const snapshot = data?.storeSnapshot

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 space-y-2 border-b border-border/60 p-4">
        <div className="flex items-start gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
            <DatabaseIcon className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-sm font-semibold leading-tight">Data source</h2>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              Live view of{' '}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.65rem]">
                server/src/store.ts
              </code>
              . Edit rows here and watch queries reflect the change.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          disabled={resetting}
          onClick={() => void handleReset()}
        >
          <RotateCcwIcon className="size-3.5" />
          Reset to seed data
        </Button>
      </div>

      <Tabs defaultValue="tasks" className="flex min-h-0 flex-1 flex-col">
        <TabsList className="mx-4 mt-3 grid w-auto shrink-0 grid-cols-3">
          <TabsTrigger value="users" className="text-xs">
            Users ({snapshot?.users.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="projects" className="text-xs">
            Projects ({snapshot?.projects.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="tasks" className="text-xs">
            Tasks ({snapshot?.tasks.length ?? 0})
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="min-h-0 flex-1">
          <TabsContent value="users" className="mt-0 p-4 pt-3">
            <EntityList>
              {(snapshot?.users ?? []).map((user) => (
                <UserRow key={user.id} user={user} onSaved={() => void refetch()} />
              ))}
            </EntityList>
          </TabsContent>
          <TabsContent value="projects" className="mt-0 p-4 pt-3">
            <EntityList>
              {(snapshot?.projects ?? []).map((project) => (
                <ProjectRow key={project.id} project={project} onSaved={() => void refetch()} />
              ))}
            </EntityList>
          </TabsContent>
          <TabsContent value="tasks" className="mt-0 p-4 pt-3">
            <EntityList>
              {(snapshot?.tasks ?? []).map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  users={snapshot?.users ?? []}
                  onSaved={() => void refetch()}
                />
              ))}
            </EntityList>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}

function EntityList({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>
}

function RawRowShell({
  id,
  children,
  onSave,
  saving,
}: {
  id: string
  children: ReactNode
  onSave: () => void
  saving: boolean
}) {
  return (
    <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
      <p className="mb-2 font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
        {id}
      </p>
      <div className="flex flex-col gap-2">{children}</div>
      <Button
        type="button"
        size="sm"
        variant="secondary"
        className="mt-2 h-7 w-full text-xs"
        disabled={saving}
        onClick={onSave}
      >
        {saving ? 'Saving…' : 'Save changes'}
      </Button>
    </div>
  )
}

function UserRow({ user, onSaved }: { user: RawUser; onSaved: () => void }) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [updateRawUser, { loading }] = useMutation(UPDATE_RAW_USER, {
    refetchQueries: [{ query: STORE_SNAPSHOT }, { query: GET_PROJECT_BOARD }],
    onCompleted: () => {
      toast.success('User updated')
      onSaved()
    },
    onError: (err) => toast.error(err.message),
  })

  const save = () => {
    void updateRawUser({ variables: { id: user.id, patch: { name, email } } })
  }

  return (
    <RawRowShell id={user.id} onSave={save} saving={loading}>
      <Field label="name">
        <Input value={name} onChange={(e) => setName(e.target.value)} className="h-8 text-xs" />
      </Field>
      <Field label="email">
        <Input value={email} onChange={(e) => setEmail(e.target.value)} className="h-8 text-xs" />
      </Field>
    </RawRowShell>
  )
}

function ProjectRow({ project, onSaved }: { project: RawProject; onSaved: () => void }) {
  const [name, setName] = useState(project.name)
  const [description, setDescription] = useState(project.description ?? '')
  const [updateRawProject, { loading }] = useMutation(UPDATE_RAW_PROJECT, {
    refetchQueries: [{ query: STORE_SNAPSHOT }, { query: GET_PROJECTS }, { query: GET_PROJECT_BOARD }],
    onCompleted: () => {
      toast.success('Project updated')
      onSaved()
    },
    onError: (err) => toast.error(err.message),
  })

  const save = () => {
    void updateRawProject({
      variables: { id: project.id, patch: { name, description: description || null } },
    })
  }

  return (
    <RawRowShell id={project.id} onSave={save} saving={loading}>
      <Field label="name">
        <Input value={name} onChange={(e) => setName(e.target.value)} className="h-8 text-xs" />
      </Field>
      <Field label="description">
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="h-8 text-xs"
        />
      </Field>
    </RawRowShell>
  )
}

function TaskRow({
  task,
  users,
  onSaved,
}: {
  task: RawTask
  users: RawUser[]
  onSaved: () => void
}) {
  const [title, setTitle] = useState(task.title)
  const [status, setStatus] = useState<TaskStatus>(task.status)
  const [assigneeId, setAssigneeId] = useState(task.assigneeId ?? 'none')
  const [updateRawTask, { loading }] = useMutation(UPDATE_RAW_TASK, {
    refetchQueries: [{ query: STORE_SNAPSHOT }, { query: GET_PROJECT_BOARD }],
    onCompleted: () => {
      toast.success('Task updated')
      onSaved()
    },
    onError: (err) => toast.error(err.message),
  })

  const save = () => {
    void updateRawTask({
      variables: {
        id: task.id,
        patch: {
          title,
          status,
          assigneeId: assigneeId === 'none' ? null : assigneeId,
        },
      },
    })
  }

  return (
    <RawRowShell id={task.id} onSave={save} saving={loading}>
      <Field label="title">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-8 text-xs" />
      </Field>
      <Field label="status">
        <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_ORDER.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="assigneeId">
        <Select value={assigneeId} onValueChange={setAssigneeId}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Unassigned" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">null (unassigned)</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name} ({user.id})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="projectId">
        <span className={cn('font-mono text-xs text-muted-foreground')}>{task.projectId}</span>
      </Field>
    </RawRowShell>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  )
}
