export type TourPlacement = 'top' | 'bottom' | 'left' | 'right' | 'center'

export type TourStep = {
  id: string
  target?: string
  title: string
  body: string
  placement: TourPlacement
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
    title: 'GraphQL Inspector',
    body: 'Every operation lands here: the exact document, variables, response, and a plain-English explanation of the concept you just used. This is how you learn what GraphQL is doing under the hood.',
    placement: 'left',
  },
  {
    id: 'concepts',
    target: 'concepts-link',
    title: 'Go deeper on Concepts',
    body: 'When you want theory, open Concepts from the nav. Inspector events link there too — each operation points to the relevant concept reference.',
    placement: 'bottom',
  },
  {
    id: 'finish',
    title: "You're ready",
    body: 'Make a move on the board — create a task, move a card, assign someone — and watch the inspector light up. That loop is the whole learning experience.',
    placement: 'center',
  },
]
