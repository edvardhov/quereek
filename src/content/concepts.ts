export type Concept = {
  id: string
  title: string
  summary: string
  description: string
  whereUsed: string[]
}

export const concepts: Concept[] = [
  {
    id: 'schema',
    title: 'GraphQL Schema (SDL)',
    summary: 'The contract between client and server.',
    description:
      'The schema defines every type, field, and operation your API exposes. Quereek uses Schema Definition Language (SDL) in server/schema.graphql. Clients can only request fields that exist in the schema.',
    whereUsed: ['server/schema.graphql', 'Apollo Sandbox at /graphql'],
  },
  {
    id: 'object-types',
    title: 'Object Types',
    summary: 'Structured data shapes like User, Project, Task.',
    description:
      'Object types group related fields. Project has name and tasks; Task has title and status. Resolvers fill in each field when the client asks for it.',
    whereUsed: ['User', 'Project', 'Task types in the schema'],
  },
  {
    id: 'enums',
    title: 'Enums',
    summary: 'Fixed sets of allowed values.',
    description:
      'TaskStatus (TODO, IN_PROGRESS, DONE) restricts status to known values. Enums make APIs safer and self-documenting.',
    whereUsed: ['moveTask mutation', 'Kanban columns'],
  },
  {
    id: 'inputs',
    title: 'Input Types',
    summary: 'Structured arguments for mutations.',
    description:
      'Instead of many scalar arguments, mutations accept one input object (CreateTaskInput). This keeps operations readable and easy to extend.',
    whereUsed: ['createTask', 'createProject', 'updateTask'],
  },
  {
    id: 'queries',
    title: 'Queries',
    summary: 'Read data without changing server state.',
    description:
      'Queries fetch data. GetProjects loads the sidebar; GetProjectBoard loads tasks for the selected project. Apollo Client caches query results automatically.',
    whereUsed: ['ProjectSidebar', 'Board'],
  },
  {
    id: 'mutations',
    title: 'Mutations',
    summary: 'Write operations that change data.',
    description:
      'Mutations create, update, or delete records. Each mutation returns the changed object so Apollo Client can update its cache without a refetch.',
    whereUsed: ['Create task', 'Move task', 'Assign task', 'Delete task'],
  },
  {
    id: 'subscriptions',
    title: 'Subscriptions',
    summary: 'Real-time updates over WebSocket.',
    description:
      'When one client moves a task, taskChanged pushes an event to all subscribed clients. HTTP handles queries/mutations; WebSocket handles live streams.',
    whereUsed: ['Board live updates', 'graphql-ws on the server'],
  },
  {
    id: 'fragments',
    title: 'Fragments',
    summary: 'Reusable field selections.',
    description:
      'TaskFields and ProjectFields define which task/project fields operations need. Fragments keep documents DRY and colocated with components.',
    whereUsed: ['src/graphql/fragments.ts'],
  },
  {
    id: 'field-resolvers',
    title: 'Field Resolvers',
    summary: 'Resolve nested relations on demand.',
    description:
      'Project.tasks and Task.assignee are not stored on the parent object directly — resolvers look up related data when those fields are requested.',
    whereUsed: ['server/src/resolvers.ts'],
  },
  {
    id: 'cache',
    title: 'Normalized Cache',
    summary: 'Apollo stores entities by ID and merges updates.',
    description:
      'Apollo Client normalizes objects by __typename + id. When a mutation returns an updated Task, the cache updates that entity everywhere it appears.',
    whereUsed: ['createTask cache update', 'deleteTask cache update'],
  },
  {
    id: 'optimistic-ui',
    title: 'Optimistic UI',
    summary: 'Show changes before the server responds.',
    description:
      'moveTask and assignTask use optimisticResponse to update the UI instantly. If the server fails, Apollo rolls back to the previous state.',
    whereUsed: ['TaskCard move and assign actions'],
  },
]

export const conceptMap = Object.fromEntries(
  concepts.map((concept) => [concept.id, concept]),
) as Record<string, Concept>

export type OperationExplanation = {
  conceptId: string
  title: string
  summary: string
}

export const operationExplanations: Record<string, OperationExplanation> = {
  GetProjects: {
    conceptId: 'queries',
    title: 'Loaded all projects',
    summary:
      'This query asks the server for every project. Apollo Client runs it when the sidebar mounts and caches the list.',
  },
  GetProjectBoard: {
    conceptId: 'queries',
    title: 'Loaded the Kanban board',
    summary:
      'This query fetches one project with its tasks and the user list for assignees. Nested fields (tasks, assignee) are resolved on the server.',
  },
  GetUsers: {
    conceptId: 'queries',
    title: 'Loaded users',
    summary: 'Fetches all users who can be assigned to tasks.',
  },
  CreateProject: {
    conceptId: 'mutations',
    title: 'Created a project',
    summary:
      'A mutation with CreateProjectInput. The response is merged into the cached projects list — no refetch needed.',
  },
  CreateTask: {
    conceptId: 'mutations',
    title: 'Created a task',
    summary:
      'Sends CreateTaskInput to the server. The new task is appended to the board cache and a subscription event is published.',
  },
  UpdateTask: {
    conceptId: 'mutations',
    title: 'Updated a task',
    summary: 'Partial updates via UpdateTaskInput. Only changed fields are sent.',
  },
  MoveTask: {
    conceptId: 'optimistic-ui',
    title: 'Moved a task between columns',
    summary:
      'Changes TaskStatus. Uses optimistic UI so the card moves immediately, then confirms with the server response.',
  },
  AssignTask: {
    conceptId: 'optimistic-ui',
    title: 'Assigned a task',
    summary:
      'Links a task to a User via assigneeId. Optimistic response updates the assignee before the server replies.',
  },
  DeleteTask: {
    conceptId: 'mutations',
    title: 'Deleted a task',
    summary:
      'Removes the task on the server. The client manually removes it from the board cache in the mutation update function.',
  },
  DeleteProject: {
    conceptId: 'mutations',
    title: 'Deleted a project',
    summary: 'Removes a project and all its tasks from the in-memory store.',
  },
  TaskChanged: {
    conceptId: 'subscriptions',
    title: 'Received a live task event',
    summary:
      'WebSocket subscription pushed a taskChanged event. Other tabs or users see board updates without refreshing.',
  },
}

export function getExplanation(operationName: string): OperationExplanation {
  return (
    operationExplanations[operationName] ?? {
      conceptId: 'schema',
      title: 'GraphQL operation',
      summary: 'An operation was sent to the GraphQL server.',
    }
  )
}
