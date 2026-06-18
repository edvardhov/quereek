import { beforeEach, describe, expect, it } from 'vitest'
import {
  assignTask,
  createProject,
  createTask,
  deleteProject,
  deleteTask,
  getProjectById,
  getProjects,
  getStoreSnapshot,
  getTaskById,
  getTasks,
  getTasksByProjectId,
  getUsers,
  moveTask,
  patchRawTask,
  resetStore,
  updateTask,
} from './store.js'

beforeEach(() => {
  resetStore()
})

describe('seed data', () => {
  it('loads the expected seed snapshot', () => {
    const snapshot = getStoreSnapshot()
    expect(snapshot.users).toHaveLength(3)
    expect(snapshot.projects).toHaveLength(2)
    expect(snapshot.tasks).toHaveLength(4)
  })

  it('resetStore restores seed data after mutation', () => {
    deleteTask('task-1')
    expect(getTasks()).toHaveLength(3)
    resetStore()
    expect(getTasks()).toHaveLength(4)
  })
})

describe('queries', () => {
  it('filters tasks by projectId', () => {
    expect(getTasks({ projectId: 'project-1' })).toHaveLength(3)
    expect(getTasks({ projectId: 'project-2' })).toHaveLength(1)
  })

  it('filters tasks by status', () => {
    expect(getTasks({ status: 'TODO' })).toHaveLength(2)
    expect(getTasks({ status: 'DONE' })).toHaveLength(1)
  })

  it('filters tasks by projectId and status together', () => {
    expect(getTasks({ projectId: 'project-1', status: 'TODO' })).toHaveLength(1)
  })

  it('getTasksByProjectId returns only that project tasks', () => {
    const tasks = getTasksByProjectId('project-2')
    expect(tasks).toHaveLength(1)
    expect(tasks[0].projectId).toBe('project-2')
  })
})

describe('createProject', () => {
  it('creates a project with a generated id and null default description', () => {
    const project = createProject({ name: 'New Project' })
    expect(project.id).toMatch(/^project-/)
    expect(project.description).toBeNull()
    expect(getProjects()).toHaveLength(3)
    expect(getProjectById(project.id)).toEqual(project)
  })
})

describe('createTask', () => {
  it('creates a task with default TODO status', () => {
    const task = createTask({ title: 'A task', projectId: 'project-1' })
    expect(task.status).toBe('TODO')
    expect(task.assigneeId).toBeNull()
    expect(getTaskById(task.id)).toEqual(task)
  })

  it('throws when the project does not exist', () => {
    expect(() => createTask({ title: 'Orphan', projectId: 'missing' })).toThrow(
      /Project not found/,
    )
  })

  it('throws when the assignee does not exist', () => {
    expect(() =>
      createTask({
        title: 'Bad assignee',
        projectId: 'project-1',
        assigneeId: 'nope',
      }),
    ).toThrow(/User not found/)
  })
})

describe('updateTask / moveTask / assignTask', () => {
  it('updates provided fields only', () => {
    const updated = updateTask('task-3', { title: 'Renamed' })
    expect(updated.title).toBe('Renamed')
    expect(updated.status).toBe('TODO')
  })

  it('moveTask changes status', () => {
    const moved = moveTask('task-3', 'IN_PROGRESS')
    expect(moved.status).toBe('IN_PROGRESS')
  })

  it('assignTask can clear the assignee with null', () => {
    const cleared = assignTask('task-1', null)
    expect(cleared.assigneeId).toBeNull()
  })

  it('assignTask throws for an unknown user', () => {
    expect(() => assignTask('task-1', 'ghost')).toThrow(/User not found/)
  })

  it('updateTask throws for an unknown task', () => {
    expect(() => updateTask('missing', { title: 'x' })).toThrow(
      /Task not found/,
    )
  })
})

describe('deleteTask / deleteProject', () => {
  it('deletes a single task', () => {
    deleteTask('task-1')
    expect(getTaskById('task-1')).toBeUndefined()
    expect(getTasks()).toHaveLength(3)
  })

  it('deleteProject cascades to its tasks', () => {
    deleteProject('project-1')
    expect(getProjectById('project-1')).toBeUndefined()
    expect(getTasksByProjectId('project-1')).toHaveLength(0)
    expect(getTasks()).toHaveLength(1)
  })

  it('deleteProject throws for an unknown project', () => {
    expect(() => deleteProject('missing')).toThrow(/Project not found/)
  })
})

describe('patchRawTask', () => {
  it('can reassign a task to another project', () => {
    const patched = patchRawTask('task-1', { projectId: 'project-2' })
    expect(patched.projectId).toBe('project-2')
    expect(getTasksByProjectId('project-2')).toHaveLength(2)
  })

  it('throws when patching to a non-existent project', () => {
    expect(() => patchRawTask('task-1', { projectId: 'missing' })).toThrow(
      /Project not found/,
    )
  })
})

describe('users', () => {
  it('returns seeded users', () => {
    expect(getUsers().map((u) => u.id)).toEqual(['user-1', 'user-2', 'user-3'])
  })
})
