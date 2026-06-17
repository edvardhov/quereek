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
}

export function ProjectSidebar({
  selectedProjectId,
  onSelectProject,
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
      toast.error(err instanceof Error ? err.message : 'Failed to create project')
    }
  }

  const handleDelete = async (projectId: string) => {
    try {
      await deleteProject({ variables: { id: projectId } })
      toast.success('Project deleted')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete project')
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent>
          <LoadingSpinner label="Loading projects..." />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="pt-6 text-sm text-destructive">
          Failed to load projects: {error.message}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col gap-4">
      <CardHeader className="pb-2">
        <CardTitle>Projects</CardTitle>
        <p className="text-sm text-muted-foreground">
          Pick a board — watch the inspector for the GetProjects query.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ul className="flex flex-col gap-2">
          {(data?.projects ?? []).map((project) => (
            <li key={project.id} className="flex gap-1">
              <Button
                type="button"
                variant={project.id === selectedProjectId ? 'default' : 'outline'}
                className={cn('h-auto flex-1 flex-col items-start py-2 text-left')}
                onClick={() => onSelectProject(project.id)}
              >
                <span className="font-medium">{project.name}</span>
                {project.description ? (
                  <span className="text-xs font-normal opacity-80">
                    {project.description}
                  </span>
                ) : null}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Delete ${project.name}`}
                onClick={() => void handleDelete(project.id)}
              >
                <Trash2Icon className="size-4 text-destructive" />
              </Button>
            </li>
          ))}
        </ul>

        <form className="flex flex-col gap-2 border-t pt-4" onSubmit={(e) => void handleCreate(e)}>
          <p className="text-sm font-medium">New project</p>
          <Input name="name" placeholder="Project name" required />
          <Textarea name="description" placeholder="Description (optional)" rows={2} />
          <Button type="submit" disabled={creating}>
            {creating ? 'Creating…' : 'Create project'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
