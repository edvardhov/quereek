export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export interface User {
  id: string
  name: string
  email: string
}

export interface Project {
  id: string
  name: string
  description: string | null
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  projectId: string
  assigneeId: string | null
  createdAt: string
}

export interface StoreSnapshot {
  users: User[]
  projects: Project[]
  tasks: Task[]
}

let nextId = 100

function createId(prefix: string): string {
  nextId += 1
  return `${prefix}-${nextId}`
}

function seed(): StoreSnapshot {
  nextId = 100
  return {
    users: [
      { id: 'user-1', name: 'Alex Chen', email: 'alex@quereek.dev' },
      { id: 'user-2', name: 'Jordan Lee', email: 'jordan@quereek.dev' },
      { id: 'user-3', name: 'Sam Rivera', email: 'sam@quereek.dev' },
    ],
    projects: [
      {
        id: 'project-1',
        name: 'Quereek Launch',
        description: 'Ship the first version of the GraphQL learning app.',
        createdAt: '2026-06-01T09:00:00.000Z',
      },
      {
        id: 'project-2',
        name: 'API Workshop',
        description: 'Internal training materials for GraphQL fundamentals.',
        createdAt: '2026-06-10T14:30:00.000Z',
      },
    ],
    tasks: [
      {
        id: 'task-1',
        title: 'Define GraphQL schema',
        description: 'Model users, projects, and tasks with relations.',
        status: 'DONE',
        projectId: 'project-1',
        assigneeId: 'user-1',
        createdAt: '2026-06-02T10:00:00.000Z',
      },
      {
        id: 'task-2',
        title: 'Implement query resolvers',
        description: 'Wire up projects, tasks, and users queries.',
        status: 'IN_PROGRESS',
        projectId: 'project-1',
        assigneeId: 'user-2',
        createdAt: '2026-06-03T11:15:00.000Z',
      },
      {
        id: 'task-3',
        title: 'Build Kanban UI',
        description: 'Three-column board with Apollo Client hooks.',
        status: 'TODO',
        projectId: 'project-1',
        assigneeId: 'user-3',
        createdAt: '2026-06-04T08:45:00.000Z',
      },
      {
        id: 'task-4',
        title: 'Draft workshop outline',
        description: 'Cover schema design, operations, and caching.',
        status: 'TODO',
        projectId: 'project-2',
        assigneeId: 'user-1',
        createdAt: '2026-06-11T09:20:00.000Z',
      },
    ],
  }
}

let users: User[] = []
let projects: Project[] = []
let tasks: Task[] = []

function loadSeed() {
  const snapshot = seed()
  users = snapshot.users
  projects = snapshot.projects
  tasks = snapshot.tasks
}

loadSeed()

export function getStoreSnapshot(): StoreSnapshot {
  return { users, projects, tasks }
}

export function resetStore(): StoreSnapshot {
  loadSeed()
  return getStoreSnapshot()
}

export function getUsers(): User[] {
  return users
}

export function getUserById(id: string): User | undefined {
  return users.find((user) => user.id === id)
}

export function getProjects(): Project[] {
  return projects
}

export function getProjectById(id: string): Project | undefined {
  return projects.find((project) => project.id === id)
}

export function getTasks(filters?: {
  projectId?: string
  status?: TaskStatus
}): Task[] {
  return tasks.filter((task) => {
    if (filters?.projectId && task.projectId !== filters.projectId) {
      return false
    }
    if (filters?.status && task.status !== filters.status) {
      return false
    }
    return true
  })
}

export function getTaskById(id: string): Task | undefined {
  return tasks.find((task) => task.id === id)
}

export function getTasksByProjectId(projectId: string): Task[] {
  return tasks.filter((task) => task.projectId === projectId)
}

export function createProject(input: {
  name: string
  description?: string | null
}): Project {
  const project: Project = {
    id: createId('project'),
    name: input.name,
    description: input.description ?? null,
    createdAt: new Date().toISOString(),
  }
  projects.push(project)
  return project
}

export function createTask(input: {
  title: string
  description?: string | null
  projectId: string
  assigneeId?: string | null
  status?: TaskStatus
}): Task {
  const project = getProjectById(input.projectId)
  if (!project) {
    throw new Error(`Project not found: ${input.projectId}`)
  }

  if (input.assigneeId && !getUserById(input.assigneeId)) {
    throw new Error(`User not found: ${input.assigneeId}`)
  }

  const task: Task = {
    id: createId('task'),
    title: input.title,
    description: input.description ?? null,
    status: input.status ?? 'TODO',
    projectId: input.projectId,
    assigneeId: input.assigneeId ?? null,
    createdAt: new Date().toISOString(),
  }
  tasks.push(task)
  return task
}

export function updateTask(
  id: string,
  input: {
    title?: string
    description?: string | null
    status?: TaskStatus
    assigneeId?: string | null
  },
): Task {
  const task = getTaskById(id)
  if (!task) {
    throw new Error(`Task not found: ${id}`)
  }

  if (input.assigneeId && !getUserById(input.assigneeId)) {
    throw new Error(`User not found: ${input.assigneeId}`)
  }

  if (input.title !== undefined) task.title = input.title
  if (input.description !== undefined) task.description = input.description
  if (input.status !== undefined) task.status = input.status
  if (input.assigneeId !== undefined) task.assigneeId = input.assigneeId

  return task
}

export function moveTask(id: string, status: TaskStatus): Task {
  return updateTask(id, { status })
}

export function assignTask(id: string, userId: string | null): Task {
  if (userId && !getUserById(userId)) {
    throw new Error(`User not found: ${userId}`)
  }
  return updateTask(id, { assigneeId: userId })
}

export function deleteTask(id: string): Task {
  const index = tasks.findIndex((task) => task.id === id)
  if (index === -1) {
    throw new Error(`Task not found: ${id}`)
  }
  const [deleted] = tasks.splice(index, 1)
  return deleted
}

export function deleteProject(id: string): Project {
  const index = projects.findIndex((project) => project.id === id)
  if (index === -1) {
    throw new Error(`Project not found: ${id}`)
  }

  for (let i = tasks.length - 1; i >= 0; i -= 1) {
    if (tasks[i].projectId === id) {
      tasks.splice(i, 1)
    }
  }

  const [deleted] = projects.splice(index, 1)
  return deleted
}

export function patchRawTask(
  id: string,
  patch: {
    title?: string
    description?: string | null
    status?: TaskStatus
    projectId?: string
    assigneeId?: string | null
  },
): Task {
  const task = getTaskById(id)
  if (!task) {
    throw new Error(`Task not found: ${id}`)
  }

  if (patch.projectId !== undefined && !getProjectById(patch.projectId)) {
    throw new Error(`Project not found: ${patch.projectId}`)
  }

  if (patch.assigneeId && !getUserById(patch.assigneeId)) {
    throw new Error(`User not found: ${patch.assigneeId}`)
  }

  if (patch.title !== undefined) task.title = patch.title
  if (patch.description !== undefined) task.description = patch.description
  if (patch.status !== undefined) task.status = patch.status
  if (patch.projectId !== undefined) task.projectId = patch.projectId
  if (patch.assigneeId !== undefined) task.assigneeId = patch.assigneeId

  return task
}

export function patchRawProject(
  id: string,
  patch: {
    name?: string
    description?: string | null
  },
): Project {
  const project = getProjectById(id)
  if (!project) {
    throw new Error(`Project not found: ${id}`)
  }

  if (patch.name !== undefined) project.name = patch.name
  if (patch.description !== undefined) project.description = patch.description

  return project
}

export function patchRawUser(
  id: string,
  patch: {
    name?: string
    email?: string
  },
): User {
  const user = getUserById(id)
  if (!user) {
    throw new Error(`User not found: ${id}`)
  }

  if (patch.name !== undefined) user.name = patch.name
  if (patch.email !== undefined) user.email = patch.email

  return user
}
