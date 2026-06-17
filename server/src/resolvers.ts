import { GraphQLError } from 'graphql'
import { withFilter } from 'graphql-subscriptions'
import { pubsub, TASK_CHANGED } from './pubsub.js'
import {
  assignTask,
  createProject,
  createTask,
  deleteProject,
  deleteTask,
  getProjectById,
  getProjects,
  getStoreSnapshot,
  getTasks,
  getTasksByProjectId,
  getUserById,
  getUsers,
  moveTask,
  patchRawProject,
  patchRawTask,
  patchRawUser,
  resetStore,
  updateTask,
  type Task,
  type TaskStatus,
} from './store.js'

function toGraphQLError(error: unknown): never {
  if (error instanceof Error) {
    throw new GraphQLError(error.message, {
      extensions: { code: 'BAD_USER_INPUT' },
    })
  }
  throw new GraphQLError('Unexpected error', {
    extensions: { code: 'INTERNAL_SERVER_ERROR' },
  })
}

async function publishTaskChange(
  action: 'CREATED' | 'UPDATED' | 'DELETED',
  projectId: string,
  task?: Task,
  taskId?: string,
) {
  await pubsub.publish(TASK_CHANGED, {
    taskChanged: {
      action,
      task: task ?? null,
      taskId: taskId ?? task?.id ?? null,
      projectId,
    },
  })
}

export const resolvers = {
  Query: {
    users: () => getUsers(),
    projects: () => getProjects(),
    project: (_: unknown, { id }: { id: string }) => getProjectById(id) ?? null,
    tasks: (
      _: unknown,
      {
        projectId,
        status,
      }: { projectId?: string; status?: TaskStatus },
    ) => getTasks({ projectId, status }),
    storeSnapshot: () => getStoreSnapshot(),
  },

  Mutation: {
    createProject: (_: unknown, { input }: { input: { name: string; description?: string | null } }) => {
      try {
        return createProject(input)
      } catch (error) {
        return toGraphQLError(error)
      }
    },

    createTask: async (
      _: unknown,
      {
        input,
      }: {
        input: {
          title: string
          description?: string | null
          projectId: string
          assigneeId?: string | null
          status?: TaskStatus
        }
      },
    ) => {
      try {
        const task = createTask(input)
        await publishTaskChange('CREATED', task.projectId, task)
        return task
      } catch (error) {
        return toGraphQLError(error)
      }
    },

    updateTask: async (
      _: unknown,
      {
        id,
        input,
      }: {
        id: string
        input: {
          title?: string
          description?: string | null
          status?: TaskStatus
          assigneeId?: string | null
        }
      },
    ) => {
      try {
        const task = updateTask(id, input)
        await publishTaskChange('UPDATED', task.projectId, task)
        return task
      } catch (error) {
        return toGraphQLError(error)
      }
    },

    moveTask: async (_: unknown, { id, status }: { id: string; status: TaskStatus }) => {
      try {
        const task = moveTask(id, status)
        await publishTaskChange('UPDATED', task.projectId, task)
        return task
      } catch (error) {
        return toGraphQLError(error)
      }
    },

    assignTask: async (
      _: unknown,
      { id, userId }: { id: string; userId?: string | null },
    ) => {
      try {
        const task = assignTask(id, userId ?? null)
        await publishTaskChange('UPDATED', task.projectId, task)
        return task
      } catch (error) {
        return toGraphQLError(error)
      }
    },

    deleteTask: async (_: unknown, { id }: { id: string }) => {
      try {
        const task = deleteTask(id)
        await publishTaskChange('DELETED', task.projectId, undefined, task.id)
        return task
      } catch (error) {
        return toGraphQLError(error)
      }
    },

    deleteProject: (_: unknown, { id }: { id: string }) => {
      try {
        return deleteProject(id)
      } catch (error) {
        return toGraphQLError(error)
      }
    },

    updateRawTask: async (
      _: unknown,
      {
        id,
        patch,
      }: {
        id: string
        patch: {
          title?: string
          description?: string | null
          status?: TaskStatus
          projectId?: string
          assigneeId?: string | null
        }
      },
    ) => {
      try {
        const task = patchRawTask(id, patch)
        await publishTaskChange('UPDATED', task.projectId, task)
        return task
      } catch (error) {
        return toGraphQLError(error)
      }
    },

    updateRawProject: (
      _: unknown,
      {
        id,
        patch,
      }: {
        id: string
        patch: { name?: string; description?: string | null }
      },
    ) => {
      try {
        return patchRawProject(id, patch)
      } catch (error) {
        return toGraphQLError(error)
      }
    },

    updateRawUser: (
      _: unknown,
      {
        id,
        patch,
      }: {
        id: string
        patch: { name?: string; email?: string }
      },
    ) => {
      try {
        return patchRawUser(id, patch)
      } catch (error) {
        return toGraphQLError(error)
      }
    },

    resetStore: () => resetStore(),
  },

  Subscription: {
    taskChanged: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([TASK_CHANGED]),
        (
          payload: {
            taskChanged: { projectId: string }
          },
          variables: { projectId: string },
        ) => payload.taskChanged.projectId === variables.projectId,
      ),
    },
  },

  Project: {
    tasks: (project: { id: string }) => getTasksByProjectId(project.id),
  },

  Task: {
    assignee: (task: Task) =>
      task.assigneeId ? (getUserById(task.assigneeId) ?? null) : null,
    project: (task: Task) => {
      const project = getProjectById(task.projectId)
      if (!project) {
        throw new GraphQLError(`Project not found: ${task.projectId}`, {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        })
      }
      return project
    },
  },
}
