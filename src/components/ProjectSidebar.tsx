import { useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { CREATE_PROJECT, DELETE_PROJECT } from '../graphql/mutations'
import { GET_PROJECTS } from '../graphql/queries'
import type { Project } from '../types'
import { Spinner } from './Spinner'

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
        data: {
          projects: [...(existing?.projects ?? []), created],
        },
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

    const result = await createProject({
      variables: {
        input: {
          name,
          description: description || null,
        },
      },
    })

    const createdId = result.data?.createProject.id
    if (createdId) {
      onSelectProject(createdId)
    }

    form.reset()
  }

  const handleDelete = async (projectId: string) => {
    await deleteProject({ variables: { id: projectId } })
  }

  if (loading)
    return (
      <aside className="sidebar board-loading uiv-loading">
        <Spinner label="Loading projects..." small />
      </aside>
    )
  if (error) {
    return (
      <aside className="sidebar sidebar-error">
        Failed to load projects: {error.message}
      </aside>
    )
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Projects</h2>
        <p className="sidebar-subtitle">Pick a board to manage tasks.</p>
      </div>

      <ul className="project-list">
        {(data?.projects ?? []).map((project) => (
          <li key={project.id}>
            <button
              type="button"
              className={
                project.id === selectedProjectId
                  ? 'project-item active'
                  : 'project-item'
              }
              onClick={() => onSelectProject(project.id)}
            >
              <span className="project-name">{project.name}</span>
              {project.description ? (
                <span className="project-description">{project.description}</span>
              ) : null}
            </button>
            <button
              type="button"
              className="project-delete"
              aria-label={`Delete ${project.name}`}
              onClick={() => void handleDelete(project.id)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <form className="project-form" onSubmit={(event) => void handleCreate(event)}>
        <h3>New project</h3>
        <input name="name" placeholder="Project name" required />
        <textarea
          name="description"
          placeholder="Short description (optional)"
          rows={3}
        />
        <button type="submit" disabled={creating}>
          {creating ? 'Creating...' : 'Create project'}
        </button>
      </form>
    </aside>
  )
}
