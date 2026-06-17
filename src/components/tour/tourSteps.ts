export type TourPlacement = 'top' | 'bottom' | 'left' | 'right' | 'center'

export type TourStep = {
  id: string
  target?: string
  title: string
  body: string
  placement: TourPlacement
  /** Spotlight padding around the target in px. Defaults to 8. */
  padding?: number
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Quereek',
    body: 'This is an interactive GraphQL playground. You act on a real Kanban board, then inspect every operation the app sends — query, mutation, or subscription — and learn the concept behind it.',
    placement: 'center',
  },
  {
    id: 'projects',
    target: 'projects',
    title: 'Start with a project',
    body: 'Each project is a Kanban board. Pick one from the list — that fires GetProjects and GetProjectBoard queries. Watch the GraphQL Inspector on the right when you switch boards.',
    placement: 'right',
  },
  {
    id: 'new-project',
    target: 'new-project',
    title: 'Create your own board',
    body: 'Add a project with a name and optional description. Submitting runs a CreateProject mutation. The new board appears in the list and opens automatically.',
    placement: 'right',
  },
  {
    id: 'board',
    target: 'board',
    title: 'Work the board',
    body: 'Add tasks, assign people, and move cards across TODO, In progress, and Done. Every action is a GraphQL mutation — move, assign, create, delete.',
    placement: 'left',
  },
  {
    id: 'inspector',
    target: 'inspector',
    title: 'Learning dock',
    body: 'Three tabs: Inspector records every GraphQL operation with deep explanations and flow diagrams. Data shows the raw store in server/src/store.ts — edit it live. Lessons guides you step-by-step.',
    placement: 'left',
  },
  {
    id: 'data-tab',
    target: 'data-tab',
    title: 'See the raw data',
    body: 'The Data tab loads storeSnapshot — the exact arrays resolvers read from. Edit a task title or status and save. The board updates because the store changed.',
    placement: 'left',
  },
  {
    id: 'lessons-tab',
    target: 'lessons-tab',
    title: 'Guided lessons',
    body: 'Pick a lesson and follow the steps. When you perform the right action on the board, the lesson auto-advances. Manual steps let you confirm when you have read the inspector.',
    placement: 'left',
  },
  {
    id: 'concepts',
    target: 'concepts-link',
    title: 'Go deeper on Concepts',
    body: 'When you want theory, open Concepts from the nav. Inspector events link there too — each operation points to the relevant concept reference.',
    placement: 'bottom',
    padding: 2,
  },
  {
    id: 'finish',
    title: "You're ready",
    body: 'Make a move on the board, open the Inspector Explained tab, peek at the Data source, and try a guided lesson. That loop is the whole learning experience.',
    placement: 'center',
  },
]
