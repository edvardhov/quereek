export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export interface User {
  id: string
  name: string
  email: string
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  createdAt: string
  assignee: User | null
}

export interface Project {
  id: string
  name: string
  description: string | null
  createdAt: string
  tasks?: Task[]
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
}

export const STATUS_ORDER: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE']
