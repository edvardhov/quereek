import type { TaskStatus } from '@/types'

type StatusStyle = {
  /** Tailwind text/bg utilities driven by the status-* theme tokens. */
  dot: string
  accent: string
  badge: string
}

/**
 * Per-status visual styling, kept in one place so the column header, empty
 * state and task-card accent all stay in sync with the theme tokens.
 */
export const STATUS_STYLES: Record<TaskStatus, StatusStyle> = {
  TODO: {
    dot: 'bg-status-todo',
    accent: 'before:bg-status-todo',
    badge: 'border-status-todo/30 text-status-todo',
  },
  IN_PROGRESS: {
    dot: 'bg-status-progress',
    accent: 'before:bg-status-progress',
    badge: 'border-status-progress/40 text-status-progress',
  },
  DONE: {
    dot: 'bg-status-done',
    accent: 'before:bg-status-done',
    badge: 'border-status-done/40 text-status-done',
  },
}
