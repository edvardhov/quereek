export type FlowStepKind =
  | 'ui'
  | 'apollo'
  | 'transport'
  | 'resolver'
  | 'store'
  | 'response'
  | 'cache'
  | 'ui-update'
  | 'websocket'

export type FlowStep = {
  kind: FlowStepKind
  label: string
  detail: string
}

export type Concept = {
  id: string
  title: string
  summary: string
  description: string
  details?: string
  codeExample?: string
  whereUsed: string[]
  flow?: FlowStep[]
}

const QUERY_FLOW: FlowStep[] = [
  { kind: 'ui', label: 'UI component', detail: 'React component calls useQuery()' },
  { kind: 'apollo', label: 'Apollo Client', detail: 'Builds the GraphQL document and variables' },
  { kind: 'transport', label: 'HTTP POST', detail: 'Sends request to /graphql' },
  { kind: 'resolver', label: 'Query resolver', detail: 'Server runs the matching resolver function' },
  { kind: 'store', label: 'In-memory store', detail: 'Reads from arrays in server/src/store.ts' },
  { kind: 'response', label: 'JSON response', detail: 'Server returns only the fields you asked for' },
  { kind: 'cache', label: 'Apollo cache', detail: 'Normalizes entities by __typename + id' },
  { kind: 'ui-update', label: 'UI re-renders', detail: 'Component receives data from the cache' },
]

const MUTATION_FLOW: FlowStep[] = [
  { kind: 'ui', label: 'User action', detail: 'Button click or form submit triggers useMutation()' },
  { kind: 'apollo', label: 'Apollo Client', detail: 'Sends mutation document + variables (may apply optimisticResponse)' },
  { kind: 'transport', label: 'HTTP POST', detail: 'Sends request to /graphql' },
  { kind: 'resolver', label: 'Mutation resolver', detail: 'Server validates input and calls store function' },
  { kind: 'store', label: 'In-memory store', detail: 'Creates, updates, or deletes a row in the arrays' },
  { kind: 'response', label: 'JSON response', detail: 'Returns the changed object' },
  { kind: 'cache', label: 'Apollo cache', detail: 'Merges the returned object into the normalized cache' },
  { kind: 'ui-update', label: 'UI updates', detail: 'Board/sidebar reflects the change without a full refetch' },
]

const SUBSCRIPTION_FLOW: FlowStep[] = [
  { kind: 'ui', label: 'Board mounts', detail: 'useSubscription() opens a WebSocket connection' },
  { kind: 'apollo', label: 'Apollo Client', detail: 'Subscribes via graphql-ws link' },
  { kind: 'websocket', label: 'WebSocket', detail: 'Persistent connection to /graphql' },
  { kind: 'resolver', label: 'Subscription filter', detail: 'Server filters events by projectId' },
  { kind: 'store', label: 'PubSub event', detail: 'Published after a mutation changes a task' },
  { kind: 'response', label: 'Push payload', detail: 'TaskChangeEvent sent to all subscribed clients' },
  { kind: 'cache', label: 'Cache update', detail: 'onData handler patches the board query in cache' },
  { kind: 'ui-update', label: 'Live board update', detail: 'Task cards move without refreshing the page' },
]

export const concepts: Concept[] = [
  {
    id: 'schema',
    title: 'GraphQL Schema (SDL)',
    summary: 'The contract between client and server.',
    description:
      'The schema defines every type, field, and operation your API exposes. Quereek uses Schema Definition Language (SDL) in server/schema.graphql. Clients can only request fields that exist in the schema.',
    details:
      'Think of the schema as an API contract written in GraphQL SDL. It declares what queries, mutations, and subscriptions exist, what types they return, and what arguments they accept. The server validates every incoming operation against this schema before running any resolver. If you ask for a field that does not exist, GraphQL rejects the request at parse/validation time — not at runtime.',
    codeExample: `type Query {
  projects: [Project!]!
  project(id: ID!): Project
}

type Mutation {
  createTask(input: CreateTaskInput!): Task!
}`,
    whereUsed: ['server/schema.graphql', 'Apollo Sandbox at /graphql'],
  },
  {
    id: 'object-types',
    title: 'Object Types',
    summary: 'Structured data shapes like User, Project, Task.',
    description:
      'Object types group related fields. Project has name and tasks; Task has title and status. Resolvers fill in each field when the client asks for it.',
    details:
      'Object types are the building blocks of a GraphQL API. Each type has scalar fields (String, ID) and can reference other types. In Quereek, Task has an assignee field of type User — but the raw store only stores assigneeId. The User object is resolved on demand when the client requests the assignee field.',
    codeExample: `type Task {
  id: ID!
  title: String!
  status: TaskStatus!
  assignee: User      # resolved via Task.assignee resolver
  project: Project!   # resolved via Task.project resolver
}`,
    whereUsed: ['User', 'Project', 'Task types in the schema'],
    flow: QUERY_FLOW,
  },
  {
    id: 'enums',
    title: 'Enums',
    summary: 'Fixed sets of allowed values.',
    description:
      'TaskStatus (TODO, IN_PROGRESS, DONE) restricts status to known values. Enums make APIs safer and self-documenting.',
    details:
      'Enums restrict a field to a known set of values. GraphQL validates enum values at the schema level — sending status: "PENDING" would fail because only TODO, IN_PROGRESS, and DONE are defined. The Kanban board columns map directly to these enum values.',
    codeExample: `enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}`,
    whereUsed: ['moveTask mutation', 'Kanban columns'],
  },
  {
    id: 'inputs',
    title: 'Input Types',
    summary: 'Structured arguments for mutations.',
    description:
      'Instead of many scalar arguments, mutations accept one input object (CreateTaskInput). This keeps operations readable and easy to extend.',
    details:
      'Input types group mutation arguments into a single object. This makes operations easier to read and extend — adding a new optional field to CreateTaskInput does not change the mutation signature. Input types cannot have resolved fields; they are plain data containers.',
    codeExample: `input CreateTaskInput {
  title: String!
  projectId: ID!
  assigneeId: ID
  status: TaskStatus
}

mutation CreateTask($input: CreateTaskInput!) {
  createTask(input: $input) { id title }
}`,
    whereUsed: ['createTask', 'createProject', 'updateTask'],
  },
  {
    id: 'queries',
    title: 'Queries',
    summary: 'Read data without changing server state.',
    description:
      'Queries fetch data. GetProjects loads the sidebar; GetProjectBoard loads tasks for the selected project. Apollo Client caches query results automatically.',
    details:
      'Queries are read-only operations. GraphQL executes all top-level query fields in parallel. GetProjectBoard asks for project, project.tasks, and users in a single round-trip — the server resolves nested fields only when requested. Apollo Client caches the result keyed by query + variables, so switching back to a project you already loaded is instant.',
    codeExample: `query GetProjectBoard($projectId: ID!) {
  project(id: $projectId) {
    name
    tasks { id title status assignee { name } }
  }
  users { id name }
}`,
    whereUsed: ['ProjectSidebar', 'Board'],
    flow: QUERY_FLOW,
  },
  {
    id: 'mutations',
    title: 'Mutations',
    summary: 'Write operations that change data.',
    description:
      'Mutations create, update, or delete records. Each mutation returns the changed object so Apollo Client can update its cache without a refetch.',
    details:
      'Mutations change server state. Unlike REST, GraphQL mutations can return any shape — Quereek returns the full changed Task or Project so Apollo can merge it into the normalized cache. The client can also provide an update function to manually patch the cache (e.g. deleteTask removes the task from the board query).',
    codeExample: `mutation MoveTask($id: ID!, $status: TaskStatus!) {
  moveTask(id: $id, status: $status) {
    id
    status
  }
}`,
    whereUsed: ['Create task', 'Move task', 'Assign task', 'Delete task'],
    flow: MUTATION_FLOW,
  },
  {
    id: 'subscriptions',
    title: 'Subscriptions',
    summary: 'Real-time updates over WebSocket.',
    description:
      'When one client moves a task, taskChanged pushes an event to all subscribed clients. HTTP handles queries/mutations; WebSocket handles live streams.',
    details:
      'Subscriptions maintain a persistent WebSocket connection. When a mutation changes a task, the server publishes a TaskChangeEvent via PubSub. The subscription resolver filters events by projectId so clients only receive updates for the board they are viewing. Apollo Client patches its cache in the onData handler.',
    codeExample: `subscription TaskChanged($projectId: ID!) {
  taskChanged(projectId: $projectId) {
    action
    task { id title status }
  }
}`,
    whereUsed: ['Board live updates', 'graphql-ws on the server'],
    flow: SUBSCRIPTION_FLOW,
  },
  {
    id: 'fragments',
    title: 'Fragments',
    summary: 'Reusable field selections.',
    description:
      'TaskFields and ProjectFields define which task/project fields operations need. Fragments keep documents DRY and colocated with components.',
    details:
      'Fragments let you define a reusable set of fields once and spread them into multiple operations. TaskFields includes id, title, description, status, assignee, and createdAt — every mutation that returns a Task uses the same fragment so the cache always has consistent data.',
    codeExample: `fragment TaskFields on Task {
  id
  title
  status
  assignee { id name }
}

mutation CreateTask($input: CreateTaskInput!) {
  createTask(input: $input) {
    ...TaskFields
  }
}`,
    whereUsed: ['src/graphql/fragments.ts'],
  },
  {
    id: 'field-resolvers',
    title: 'Field Resolvers',
    summary: 'Resolve nested relations on demand.',
    description:
      'Project.tasks and Task.assignee are not stored on the parent object directly — resolvers look up related data when those fields are requested.',
    details:
      'Field resolvers run only when the client requests that field. Project.tasks calls getTasksByProjectId(project.id). Task.assignee looks up the user by assigneeId. This lazy resolution means you never fetch tasks when you only ask for project name — GraphQL only resolves what you select.',
    codeExample: `// server/src/resolvers.ts
Project: {
  tasks: (project) => getTasksByProjectId(project.id),
},
Task: {
  assignee: (task) =>
    task.assigneeId ? getUserById(task.assigneeId) : null,
}`,
    whereUsed: ['server/src/resolvers.ts'],
    flow: [
      { kind: 'resolver', label: 'Parent resolver', detail: 'Query.project returns a Project row from store' },
      { kind: 'resolver', label: 'Field resolver', detail: 'Project.tasks runs getTasksByProjectId(id)' },
      { kind: 'store', label: 'Store lookup', detail: 'Filters tasks[] where projectId matches' },
    ],
  },
  {
    id: 'cache',
    title: 'Normalized Cache',
    summary: 'Apollo stores entities by ID and merges updates.',
    description:
      'Apollo Client normalizes objects by __typename + id. When a mutation returns an updated Task, the cache updates that entity everywhere it appears.',
    details:
      'Apollo Client flattens the response tree into a normalized store keyed by __typename:id. A Task with id "task-1" exists once in the cache regardless of how many queries reference it. When moveTask returns an updated Task, Apollo merges the new fields into the existing cache entry — the board re-renders automatically.',
    codeExample: `// Apollo stores: { Task:task-1: { id, title, status, ... } }
// After moveTask mutation response:
// { Task:task-1: { ..., status: "DONE" } }  ← merged in place`,
    whereUsed: ['createTask cache update', 'deleteTask cache update'],
    flow: [
      { kind: 'response', label: 'Mutation response', detail: 'Server returns updated Task object' },
      { kind: 'cache', label: 'Normalize', detail: 'Apollo extracts Task:task-1 from response' },
      { kind: 'cache', label: 'Merge', detail: 'New fields overwrite existing cache entry' },
      { kind: 'ui-update', label: 'Re-render', detail: 'All components reading that Task update' },
    ],
  },
  {
    id: 'optimistic-ui',
    title: 'Optimistic UI',
    summary: 'Show changes before the server responds.',
    description:
      'moveTask and assignTask use optimisticResponse to update the UI instantly. If the server fails, Apollo rolls back to the previous state.',
    details:
      'Optimistic UI makes the app feel instant. When you move a task, Apollo immediately writes a fake response to the cache (optimisticResponse) so the card moves before the server replies. If the mutation succeeds, the real response replaces the optimistic data. If it fails, Apollo rolls back and shows an error toast.',
    codeExample: `useMutation(MOVE_TASK, {
  optimisticResponse: (variables) => ({
    moveTask: { __typename: 'Task', ...task, status: variables.status },
  }),
})`,
    whereUsed: ['TaskCard move and assign actions'],
    flow: [
      { kind: 'ui', label: 'User clicks move', detail: 'Mutation called with new status' },
      { kind: 'cache', label: 'Optimistic write', detail: 'Apollo writes fake response to cache immediately' },
      { kind: 'ui-update', label: 'Instant UI', detail: 'Card moves to new column before network round-trip' },
      { kind: 'transport', label: 'Server confirms', detail: 'Real mutation completes' },
      { kind: 'cache', label: 'Replace or rollback', detail: 'Real response replaces optimistic data, or rolls back on error' },
    ],
  },
  {
    id: 'raw-store',
    title: 'Raw Store Introspection',
    summary: 'See and edit the in-memory data directly.',
    description:
      'The storeSnapshot query exposes the raw arrays in server/src/store.ts. Raw mutations let you patch rows directly, bypassing domain logic — useful for learning where data actually lives.',
    details:
      'Domain types like Task expose resolved relations (assignee, project). Raw types expose scalar foreign keys (assigneeId, projectId) exactly as stored. The Data panel uses storeSnapshot to show the live arrays and updateRawTask to edit them. This makes the data layer visible instead of hidden behind resolvers.',
    codeExample: `query StoreSnapshot {
  storeSnapshot {
    users { id name email }
    projects { id name }
    tasks { id title status projectId assigneeId }
  }
}`,
    whereUsed: ['Data panel', 'storeSnapshot query', 'updateRawTask mutation'],
    flow: QUERY_FLOW,
  },
]

export const conceptMap = Object.fromEntries(
  concepts.map((concept) => [concept.id, concept]),
) as Record<string, Concept>

export type OperationExplanation = {
  conceptId: string
  title: string
  summary: string
  what: string
  how: string
  dataSource: string
  resolverPath: string[]
  flow: FlowStep[]
  fieldNotes?: Record<string, string>
}

export const operationExplanations: Record<string, OperationExplanation> = {
  GetProjects: {
    conceptId: 'queries',
    title: 'Loaded all projects',
    summary:
      'This query asks the server for every project. Apollo Client runs it when the sidebar mounts and caches the list.',
    what: 'The ProjectSidebar component needs a list of all projects to render the sidebar. This query fetches every project row from the store.',
    how: 'Apollo sends a GET_PROJECTS document over HTTP. The server runs Query.projects which calls getProjects() and returns the projects array. Apollo caches the result under the GetProjects query key.',
    dataSource: 'server/src/store.ts → projects[]',
    resolverPath: ['Query.projects', 'getProjects()'],
    flow: QUERY_FLOW,
    fieldNotes: {
      projects: 'Top-level query field — returns all rows from projects[]',
      '...ProjectFields': 'Fragment spread — id, name, description, createdAt',
    },
  },
  GetProjectBoard: {
    conceptId: 'queries',
    title: 'Loaded the Kanban board',
    summary:
      'This query fetches one project with its tasks and the user list for assignees. Nested fields (tasks, assignee) are resolved on the server.',
    what: 'When you select a project, the Board component loads that project\'s tasks and all users (for the assignee dropdown) in one query.',
    how: 'The query asks for project(id), project.tasks, and users in parallel. Query.project calls getProjectById(). Project.tasks field resolver calls getTasksByProjectId(). Task.assignee resolver looks up users by assigneeId. Query.users calls getUsers().',
    dataSource: 'server/src/store.ts → projects[], tasks[], users[]',
    resolverPath: [
      'Query.project → getProjectById(id)',
      'Project.tasks → getTasksByProjectId(project.id)',
      'Task.assignee → getUserById(task.assigneeId)',
      'Query.users → getUsers()',
    ],
    flow: QUERY_FLOW,
    fieldNotes: {
      project: 'Looks up one project row by ID from projects[]',
      'project.tasks': 'Field resolver filters tasks[] where projectId matches',
      'task.assignee': 'Field resolver looks up users[] by assigneeId',
      users: 'Returns all rows from users[] for the assignee dropdown',
    },
  },
  GetUsers: {
    conceptId: 'queries',
    title: 'Loaded users',
    summary: 'Fetches all users who can be assigned to tasks.',
    what: 'Returns every user in the system — used for assignee selection.',
    how: 'Query.users resolver calls getUsers() which returns the users array unchanged.',
    dataSource: 'server/src/store.ts → users[]',
    resolverPath: ['Query.users', 'getUsers()'],
    flow: QUERY_FLOW,
  },
  CreateProject: {
    conceptId: 'mutations',
    title: 'Created a project',
    summary:
      'A mutation with CreateProjectInput. The response is merged into the cached projects list — no refetch needed.',
    what: 'You submitted the "New project" form. A new project row is appended to the store and returned.',
    how: 'Mutation.createProject receives CreateProjectInput, calls createProject() which pushes a new row to projects[] with a generated ID. The client update function reads the cached GetProjects query and appends the new project.',
    dataSource: 'server/src/store.ts → projects[] (push new row)',
    resolverPath: ['Mutation.createProject', 'createProject(input)'],
    flow: MUTATION_FLOW,
    fieldNotes: {
      input: 'CreateProjectInput — name (required), description (optional)',
      'createProject': 'Returns the new Project object with generated id and createdAt',
    },
  },
  CreateTask: {
    conceptId: 'mutations',
    title: 'Created a task',
    summary:
      'Sends CreateTaskInput to the server. The new task is appended to the board cache and a subscription event is published.',
    what: 'You added a new task to the board. A task row is created in the store with status TODO by default.',
    how: 'Mutation.createTask validates the projectId exists, creates a task row in tasks[], publishes a CREATED event via PubSub for subscribers, and returns the new Task with resolved fields.',
    dataSource: 'server/src/store.ts → tasks[] (push new row)',
    resolverPath: ['Mutation.createTask', 'createTask(input)', 'publishTaskChange(CREATED)'],
    flow: MUTATION_FLOW,
  },
  UpdateTask: {
    conceptId: 'mutations',
    title: 'Updated a task',
    summary: 'Partial updates via UpdateTaskInput. Only changed fields are sent.',
    what: 'One or more task fields were changed (title, description, status, or assignee).',
    how: 'Mutation.updateTask finds the task by id in tasks[], applies only the provided fields from UpdateTaskInput, publishes an UPDATED subscription event, and returns the updated Task.',
    dataSource: 'server/src/store.ts → tasks[] (find by id, patch fields)',
    resolverPath: ['Mutation.updateTask', 'updateTask(id, input)', 'publishTaskChange(UPDATED)'],
    flow: MUTATION_FLOW,
  },
  MoveTask: {
    conceptId: 'optimistic-ui',
    title: 'Moved a task between columns',
    summary:
      'Changes TaskStatus. Uses optimistic UI so the card moves immediately, then confirms with the server response.',
    what: 'You clicked a move button on a task card. The task status changes to TODO, IN_PROGRESS, or DONE.',
    how: 'Apollo applies optimisticResponse immediately (card moves before server reply). The server calls moveTask() which is updateTask(id, { status }). On success, the real response replaces the optimistic cache entry.',
    dataSource: 'server/src/store.ts → tasks[] (find by id, set status)',
    resolverPath: ['Mutation.moveTask', 'moveTask(id, status)', 'updateTask(id, { status })'],
    flow: [
      { kind: 'ui', label: 'Move button clicked', detail: 'TaskCard calls moveTask mutation' },
      { kind: 'cache', label: 'Optimistic write', detail: 'Card moves instantly via optimisticResponse' },
      { kind: 'transport', label: 'HTTP POST', detail: 'Mutation sent to server' },
      { kind: 'resolver', label: 'moveTask resolver', detail: 'Updates status in tasks[]' },
      { kind: 'store', label: 'tasks[] updated', detail: 'Task row status field changed' },
      { kind: 'response', label: 'Updated Task returned', detail: 'Replaces optimistic data in cache' },
      { kind: 'ui-update', label: 'Confirmed', detail: 'Board shows final state from server' },
    ],
    fieldNotes: {
      status: 'TaskStatus enum — TODO | IN_PROGRESS | DONE',
      optimisticResponse: 'Client-side fake response applied before server confirms',
    },
  },
  AssignTask: {
    conceptId: 'optimistic-ui',
    title: 'Assigned a task',
    summary:
      'Links a task to a User via assigneeId. Optimistic response updates the assignee before the server replies.',
    what: 'You selected an assignee from the dropdown on a task card.',
    how: 'Apollo optimistically updates the assignee in cache. Server calls assignTask() which sets assigneeId on the task row. Task.assignee field resolver will look up the User on next query.',
    dataSource: 'server/src/store.ts → tasks[] (find by id, set assigneeId)',
    resolverPath: ['Mutation.assignTask', 'assignTask(id, userId)', 'updateTask(id, { assigneeId })'],
    flow: [
      { kind: 'ui', label: 'Assignee selected', detail: 'Select dropdown triggers assignTask mutation' },
      { kind: 'cache', label: 'Optimistic write', detail: 'Assignee shown immediately' },
      { kind: 'transport', label: 'HTTP POST', detail: 'Mutation sent to server' },
      { kind: 'resolver', label: 'assignTask resolver', detail: 'Sets assigneeId on task row' },
      { kind: 'store', label: 'tasks[] updated', detail: 'assigneeId foreign key changed' },
      { kind: 'response', label: 'Task with assignee returned', detail: 'Server resolves assignee field' },
      { kind: 'ui-update', label: 'Confirmed', detail: 'Dropdown shows final assignee' },
    ],
  },
  DeleteTask: {
    conceptId: 'mutations',
    title: 'Deleted a task',
    summary:
      'Removes the task on the server. The client manually removes it from the board cache in the mutation update function.',
    what: 'You clicked the delete button on a task card. The task is removed from the board and the store.',
    how: 'Server splices the task out of tasks[] and publishes a DELETED subscription event. Client update function manually filters the task out of the GetProjectBoard cache query.',
    dataSource: 'server/src/store.ts → tasks[] (splice by id)',
    resolverPath: ['Mutation.deleteTask', 'deleteTask(id)', 'publishTaskChange(DELETED)'],
    flow: MUTATION_FLOW,
  },
  DeleteProject: {
    conceptId: 'mutations',
    title: 'Deleted a project',
    summary: 'Removes a project and all its tasks from the in-memory store.',
    what: 'You deleted a project from the sidebar. The project and all its tasks are removed.',
    how: 'deleteProject() removes the project from projects[] and cascades by deleting all tasks with matching projectId from tasks[].',
    dataSource: 'server/src/store.ts → projects[] + tasks[] (cascade delete)',
    resolverPath: ['Mutation.deleteProject', 'deleteProject(id)'],
    flow: MUTATION_FLOW,
  },
  TaskChanged: {
    conceptId: 'subscriptions',
    title: 'Received a live task event',
    summary:
      'WebSocket subscription pushed a taskChanged event. Other tabs or users see board updates without refreshing.',
    what: 'A task was created, updated, or deleted (by you or another tab). The server pushed a real-time event over WebSocket.',
    how: 'After any task mutation, publishTaskChange() emits to PubSub. The taskChanged subscription filter checks projectId matches. Board onData handler patches the GetProjectBoard cache query.',
    dataSource: 'PubSub event (triggered by mutations on tasks[])',
    resolverPath: [
      'Subscription.taskChanged',
      'withFilter(projectId match)',
      'Board.onData → cache.updateQuery',
    ],
    flow: SUBSCRIPTION_FLOW,
    fieldNotes: {
      action: 'CREATED | UPDATED | DELETED',
      task: 'Full Task object (null for DELETED)',
      taskId: 'ID of deleted task (for DELETED action)',
    },
  },
  StoreSnapshot: {
    conceptId: 'raw-store',
    title: 'Loaded raw store snapshot',
    summary: 'Fetches the complete in-memory store — users, projects, and tasks arrays as raw rows.',
    what: 'The Data panel requested a snapshot of everything in the server store.',
    how: 'Query.storeSnapshot calls getStoreSnapshot() which returns shallow copies of users[], projects[], and tasks[] arrays. Raw types expose scalar foreign keys instead of resolved relations.',
    dataSource: 'server/src/store.ts → users[], projects[], tasks[]',
    resolverPath: ['Query.storeSnapshot', 'getStoreSnapshot()'],
    flow: QUERY_FLOW,
    fieldNotes: {
      tasks: 'RawTask — includes projectId and assigneeId as scalar IDs, not nested objects',
      projects: 'RawProject — no nested tasks field',
    },
  },
  UpdateRawTask: {
    conceptId: 'raw-store',
    title: 'Patched a raw task row',
    summary: 'Directly edited a task in the store, bypassing domain mutations.',
    what: 'You edited a task field in the Data panel. The raw row in tasks[] was patched directly.',
    how: 'updateRawTask calls patchRawTask() which finds the task by id and applies the patch fields. Publishes an UPDATED subscription event so the board reflects the change.',
    dataSource: 'server/src/store.ts → tasks[] (find by id, patch fields)',
    resolverPath: ['Mutation.updateRawTask', 'patchRawTask(id, patch)', 'publishTaskChange(UPDATED)'],
    flow: MUTATION_FLOW,
  },
  UpdateRawProject: {
    conceptId: 'raw-store',
    title: 'Patched a raw project row',
    summary: 'Directly edited a project name or description in the store.',
    what: 'You edited a project field in the Data panel.',
    how: 'updateRawProject calls patchRawProject() which finds the project by id and applies name/description changes.',
    dataSource: 'server/src/store.ts → projects[] (find by id, patch fields)',
    resolverPath: ['Mutation.updateRawProject', 'patchRawProject(id, patch)'],
    flow: MUTATION_FLOW,
  },
  UpdateRawUser: {
    conceptId: 'raw-store',
    title: 'Patched a raw user row',
    summary: 'Directly edited a user name or email in the store.',
    what: 'You edited a user field in the Data panel.',
    how: 'updateRawUser calls patchRawUser() which finds the user by id and applies name/email changes.',
    dataSource: 'server/src/store.ts → users[] (find by id, patch fields)',
    resolverPath: ['Mutation.updateRawUser', 'patchRawUser(id, patch)'],
    flow: MUTATION_FLOW,
  },
  ResetStore: {
    conceptId: 'raw-store',
    title: 'Reset store to seed data',
    summary: 'Restored the in-memory store to its initial seed state.',
    what: 'You clicked "Reset data" in the Data panel. All arrays were replaced with the original seed data.',
    how: 'resetStore() calls loadSeed() which re-initializes users[], projects[], and tasks[] from the seed() factory and resets the ID counter.',
    dataSource: 'server/src/store.ts → seed() factory reinitializes all arrays',
    resolverPath: ['Mutation.resetStore', 'resetStore()', 'loadSeed()'],
    flow: MUTATION_FLOW,
  },
}

const DEFAULT_FLOW: FlowStep[] = QUERY_FLOW

export function getExplanation(operationName: string): OperationExplanation {
  return (
    operationExplanations[operationName] ?? {
      conceptId: 'schema',
      title: 'GraphQL operation',
      summary: 'An operation was sent to the GraphQL server.',
      what: 'A GraphQL operation was executed against the Quereek server.',
      how: 'Apollo Client sent the operation document to /graphql. The server validated it against the schema and ran the matching resolver.',
      dataSource: 'server/src/store.ts',
      resolverPath: ['See Operation tab for the document'],
      flow: DEFAULT_FLOW,
    }
  )
}

export function getConceptFlow(conceptId: string): FlowStep[] {
  return conceptMap[conceptId]?.flow ?? DEFAULT_FLOW
}
