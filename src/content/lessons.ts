export type StepMatcher = {
  operationName: string
  predicate?: (variables: Record<string, unknown>) => boolean
}

export type LessonStep = {
  id: string
  instruction: string
  hint?: string
  /** When true, user confirms completion manually (no inspector match required). */
  manual?: boolean
  matcher?: StepMatcher
}

export type Lesson = {
  id: string
  title: string
  summary: string
  conceptId: string
  steps: LessonStep[]
}

export const lessons: Lesson[] = [
  {
    id: 'read-data',
    title: 'Read data with a query',
    summary: 'Learn how GraphQL queries fetch data from the server store.',
    conceptId: 'queries',
    steps: [
      {
        id: 'select-project',
        instruction:
          'Select a project from the sidebar to load its Kanban board.',
        hint: 'This fires the GetProjectBoard query. Watch the Inspector tab.',
        matcher: { operationName: 'GetProjectBoard' },
      },
      {
        id: 'see-response',
        instruction:
          'Open the Inspector tab and click the latest GetProjectBoard event. Read the Explained tab.',
        manual: true,
      },
    ],
  },
  {
    id: 'create-task',
    title: 'Create a task with a mutation',
    summary: 'Add a new task and see the mutation flow from UI to store.',
    conceptId: 'mutations',
    steps: [
      {
        id: 'create',
        instruction: 'Use the "New task" form on the board to create a task.',
        hint: 'Fill in a title and submit. The CreateTask mutation runs.',
        matcher: { operationName: 'CreateTask' },
      },
      {
        id: 'inspect',
        instruction:
          'In the Inspector, open the CreateTask event and check the Flow tab.',
        manual: true,
      },
    ],
  },
  {
    id: 'move-task',
    title: 'Move a task (optimistic UI)',
    summary: 'Move a card between columns and understand optimistic responses.',
    conceptId: 'optimistic-ui',
    steps: [
      {
        id: 'move',
        instruction:
          'Click a move button on a task card to change its status column.',
        hint: 'The card moves instantly before the server responds.',
        matcher: { operationName: 'MoveTask' },
      },
      {
        id: 'flow',
        instruction:
          'Open the MoveTask event in the Inspector. Compare Explained vs Flow tabs.',
        manual: true,
      },
    ],
  },
  {
    id: 'raw-store',
    title: 'Edit the raw store',
    summary: 'See and edit the in-memory data that resolvers read from.',
    conceptId: 'raw-store',
    steps: [
      {
        id: 'open-data',
        instruction: 'Switch to the Data tab in the right panel.',
        manual: true,
      },
      {
        id: 'edit-task',
        instruction:
          'Edit a task title in the Data tab and click Save changes.',
        hint: 'This uses updateRawTask — a direct patch to tasks[] in the store.',
        matcher: { operationName: 'UpdateRawTask' },
      },
      {
        id: 'see-board',
        instruction:
          'Check the board — it should reflect your raw edit via subscription/cache.',
        manual: true,
      },
    ],
  },
  {
    id: 'subscriptions',
    title: 'Watch a subscription',
    summary: 'Understand real-time updates over WebSocket.',
    conceptId: 'subscriptions',
    steps: [
      {
        id: 'subscribe',
        instruction:
          'With a project board open, any task change triggers TaskChanged subscription events.',
        hint: 'Move or create a task while watching the Inspector.',
        matcher: { operationName: 'TaskChanged' },
      },
      {
        id: 'inspect-sub',
        instruction:
          'Open a TaskChanged event. Read how PubSub pushes events over WebSocket.',
        manual: true,
      },
    ],
  },
  {
    id: 'reset-store',
    title: 'Reset the store',
    summary: 'Restore seed data and see how mutations can reset server state.',
    conceptId: 'raw-store',
    steps: [
      {
        id: 'reset',
        instruction: 'In the Data tab, click "Reset to seed data".',
        matcher: { operationName: 'ResetStore' },
      },
    ],
  },
]

export const lessonMap = Object.fromEntries(
  lessons.map((l) => [l.id, l]),
) as Record<string, Lesson>

export function matchStep(
  matcher: StepMatcher,
  operationName: string,
  variables: Record<string, unknown>,
): boolean {
  if (matcher.operationName !== operationName) return false
  if (matcher.predicate && !matcher.predicate(variables)) return false
  return true
}
