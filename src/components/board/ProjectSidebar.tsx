import { useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'

import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CREATE_PROJECT, DELETE_PROJECT } from '@/graphql/mutations'
import { GET_PROJECTS } from '@/graphql/queries'
import { cn } from '@/lib/utils'
import type { Project } from '@/types'

interface ProjectSidebarProps {
  selectedProjectId: string | null
  onSelectProject: (projectId: string) => void
  /** When embedded (e.g. inside a resizable panel) drop the outer card chrome. */
  embedded?: boolean
}

export function ProjectSidebar({
  selectedProjectId,
  onSelectProject,
  embedded = false,
}: ProjectSidebarProps) {
  const { data, loading, error } = useQuery<{ projects: Project[] }>(
    GET_PROJECTS,
  )
  const [createProject, { loading: creating }] = useMutation<{
    createProject: Project
  }>(CREATE_PROJECT, {
    update(cache, { data: mutationData }) {
      const created = mutationData?.createProject
      if (!created) return
      const existing = cache.readQuery<{ projects: Project[] }>({
        query: GET_PROJECTS,
      })
      cache.writeQuery({
        query: GET_PROJECTS,
        data: { projects: [...(existing?.projects ?? []), created] },
      })
    },
  })
  const [deleteProject] = useMutation<{ deleteProject: { id: string } }>(
    DELETE_PROJECT,
    {
      update(cache, { data: mutationData }) {
        const deletedId = mutationData?.deleteProject.id
        if (!deletedId) return
        const existing = cache.readQuery<{ projects: Project[] }>({
          query: GET_PROJECTS,
        })
        cache.writeQuery({
          query: GET_PROJECTS,
          data: {
            projects: (existing?.projects ?? []).filter(
              (project) => project.id !== deletedId,
            ),
          },
        })
      },
    },
  )

  useEffect(() => {
    const firstProjectId = data?.projects[0]?.id
    if (!selectedProjectId && firstProjectId) {
      onSelectProject(firstProjectId)
    }
  }, [data?.projects, onSelectProject, selectedProjectId])

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const name = String(formData.get('name') ?? '').trim()
    const description = String(formData.get('description') ?? '').trim()
    if (!name) return

    try {
      const result = await createProject({
        variables: { input: { name, description: description || null } },
      })
      toast.success('Project created')
      const createdId = result.data?.createProject.id
      if (createdId) onSelectProject(createdId)
      form.reset()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to create project',
      )
    }
  }

  const handleDelete = async (projectId: string) => {
    try {
      await deleteProject({ variables: { id: projectId } })
      toast.success('Project deleted')
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to delete project',
      )
    }
  }

  if (loading) {
    if (embedded) {
      return (
        <div className="p-5">
          <LoadingSpinner label="Loading projects..." />
        </div>
      )
    }
    return (
      <Card>
        <CardContent>
          <LoadingSpinner label="Loading projects..." />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    if (embedded) {
      return (
        <div className="p-5 text-sm text-destructive">
          Failed to load projects: {error.message}
        </div>
      )
    }
    return (
      <Card className="border-destructive/50">
        <CardContent className="pt-6 text-sm text-destructive">
          Failed to load projects: {error.message}
        </CardContent>
      </Card>
    )
  }

  const header = (
    <>
      <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.16em] text-primary">
        GetProjects query
      </p>
      {!embedded ? <CardTitle className="text-lg">Projects</CardTitle> : null}
      <p className="text-sm text-muted-foreground">
        Pick a board — watch the inspector light up.
      </p>
    </>
  )

  const body = (
    <>
      <ul className="flex flex-col gap-1.5">
        {(data?.projects ?? []).map((project) => {
          const active = project.id === selectedProjectId
          return (
            <li key={project.id} className="group flex items-stretch gap-1">
              <button
                type="button"
                className={cn(
                  'relative flex-1 overflow-hidden rounded-xl border px-3 py-2.5 text-left transition-all',
                  'before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-r-full before:transition-colors before:content-[""]',
                  active
                    ? 'border-primary/40 bg-primary/10 before:bg-primary'
                    : 'border-transparent bg-muted/40 hover:bg-muted before:bg-transparent',
                )}
                onClick={() => onSelectProject(project.id)}
              >
                <span
                  className={cn(
                    'block truncate pl-1.5 text-sm font-medium',
                    active && 'text-foreground',
                  )}
                >
                  {project.name}
                </span>
                {project.description ? (
                  <span className="mt-0.5 block truncate pl-1.5 text-xs text-muted-foreground">
                    {project.description}
                  </span>
                ) : null}
              </button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 self-center text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                aria-label={`Delete ${project.name}`}
                onClick={() => void handleDelete(project.id)}
              >
                <Trash2Icon className="size-4" />
              </Button>
            </li>
          )
        })}
      </ul>

      <form
        data-tour="new-project"
        className="flex flex-col gap-2 border-t pt-4"
        onSubmit={(e) => void handleCreate(e)}
      >
        <p className="font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">
          New project
        </p>
        <Input name="name" placeholder="Project name" required />
        <Textarea
          name="description"
          placeholder="Description (optional)"
          rows={2}
        />
        <Button type="submit" disabled={creating}>
          {creating ? 'Creating…' : 'Create project'}
        </Button>
      </form>
    </>
  )

  if (embedded) {
    return (
      <div className="flex h-full flex-col gap-4 p-4">
        <div className="flex flex-col gap-1">{header}</div>
        {body}
      </div>
    )
  }

  return (
    <Card className="flex flex-col gap-4">
      <CardHeader className="gap-1 p-5 pb-2">{header}</CardHeader>
      <CardContent className="flex flex-col gap-4 p-5 pt-0">{body}</CardContent>
    </Card>
  )
}
