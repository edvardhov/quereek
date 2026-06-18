import { GraphQLError } from 'graphql'
import { beforeEach, describe, expect, it } from 'vitest'
import { resolvers } from './resolvers.js'
import { getTaskById, resetStore, type Task } from './store.js'

beforeEach(() => {
  resetStore()
})

describe('Query resolvers', () => {
  it('projects returns the seeded projects', () => {
    expect(resolvers.Query.projects()).toHaveLength(2)
  })

  it('project returns null for an unknown id', () => {
    expect(resolvers.Query.project(undefined, { id: 'missing' })).toBeNull()
  })

  it('tasks forwards filters to the store', () => {
    const tasks = resolvers.Query.tasks(undefined, { projectId: 'project-2' })
    expect(tasks).toHaveLength(1)
  })
})

describe('Mutation resolvers', () => {
  it('createTask persists and returns the task', async () => {
    const task = await resolvers.Mutation.createTask(undefined, {
      input: { title: 'From resolver', projectId: 'project-1' },
    })
    expect((task as Task).title).toBe('From resolver')
    expect(getTaskById((task as Task).id)).toBeDefined()
  })

  it('createTask maps store errors to BAD_USER_INPUT GraphQLError', async () => {
    await expect(
      resolvers.Mutation.createTask(undefined, {
        input: { title: 'x', projectId: 'missing' },
      }),
    ).rejects.toMatchObject({
      message: expect.stringMatching(/Project not found/),
      extensions: { code: 'BAD_USER_INPUT' },
    })
  })

  it('moveTask updates the status', async () => {
    const task = await resolvers.Mutation.moveTask(undefined, {
      id: 'task-3',
      status: 'DONE',
    })
    expect((task as Task).status).toBe('DONE')
  })

  it('deleteProject cascades and returns the deleted project', () => {
    const deleted = resolvers.Mutation.deleteProject(undefined, {
      id: 'project-1',
    })
    expect(deleted).toMatchObject({ id: 'project-1' })
    expect(
      resolvers.Query.tasks(undefined, { projectId: 'project-1' }),
    ).toHaveLength(0)
  })
})

describe('Type resolvers', () => {
  it('Task.assignee resolves the related user', () => {
    const task = getTaskById('task-1') as Task
    expect(resolvers.Task.assignee(task)).toMatchObject({ id: 'user-1' })
  })

  it('Task.assignee returns null when unassigned', () => {
    const task = { ...(getTaskById('task-1') as Task), assigneeId: null }
    expect(resolvers.Task.assignee(task)).toBeNull()
  })

  it('Project.tasks resolves the related tasks', () => {
    expect(resolvers.Project.tasks({ id: 'project-1' })).toHaveLength(3)
  })

  it('Task.project throws when the project is missing', () => {
    const task = { ...(getTaskById('task-1') as Task), projectId: 'missing' }
    expect(() => resolvers.Task.project(task)).toThrow(GraphQLError)
  })
})
