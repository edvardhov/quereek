# Trellis

Trellis is a full-stack GraphQL learning app: a Kanban-style project and task manager built with **Apollo Server 5**, **Apollo Client 4**, **React 19**, and **Vite**.

The local workspace folder is `graphql-app`; the GitHub repository is [`trellis`](https://github.com/edvardhov/trellis).

## What you'll learn

| GraphQL concept | Where it shows up |
|---|---|
| Schema / SDL | `server/src/schema.ts` |
| Object types & enums | `User`, `Project`, `Task`, `TaskStatus` |
| Input types | `CreateTaskInput`, `UpdateTaskInput`, `CreateProjectInput` |
| Queries | `projects`, `project`, `tasks`, `users` |
| Mutations | create/update/move/assign/delete operations |
| Field resolvers | `Project.tasks`, `Task.assignee`, `Task.project` |
| Subscriptions | `taskChanged(projectId)` with `graphql-ws` |
| Client queries | `useQuery` in sidebar + board |
| Client mutations | `useMutation` with cache updates + optimistic UI |
| Client subscriptions | `useSubscription` for live board updates |
| Fragments | reusable field selections in `src/graphql/fragments.ts` |

## Stack

- **Server**: Apollo Server 5, Express, in-memory store, PubSub subscriptions
- **Client**: React 19, Apollo Client 4, Vite dev proxy for HTTP + WebSocket
- **Tooling**: TypeScript, GraphQL Code Generator, Apollo skills in `.agents/skills/`

## Prerequisites

- Node.js 20+
- npm

## Getting started

Install dependencies:

```bash
npm install
```

Run the GraphQL server and React client together:

```bash
npm run dev
```

- Client: [http://localhost:5173](http://localhost:5173)
- GraphQL endpoint: [http://localhost:4000/graphql](http://localhost:4000/graphql)
- Apollo Sandbox: open the GraphQL endpoint in your browser while the server is running

Run only the server or client:

```bash
npm run dev:server
npm run dev:client
```

Generate typed GraphQL documents:

```bash
npm run codegen
```

Build for production:

```bash
npm run build
```

## Project structure

```text
server/src/          Apollo Server, schema, resolvers, in-memory store
src/apollo/          Apollo Client setup (HTTP + WebSocket split link)
src/graphql/         Queries, mutations, subscriptions, fragments
src/components/      Kanban UI (sidebar, board, task cards)
src/__generated__/   GraphQL Code Generator output (after npm run codegen)
.agents/skills/      Apollo GraphQL agent skills
```

## Apollo skills used

Read these before working on each layer:

- `graphql-schema` — schema design
- `apollo-server` — server setup and subscriptions
- `graphql-operations` — client operation documents
- `apollo-client` — hooks, cache, and links

## Suggested learning path

1. Explore the schema and query resolvers in Apollo Sandbox.
2. Read the client queries in `src/graphql/queries.ts` and the board UI.
3. Try mutations from the UI and inspect cache updates in Apollo DevTools.
4. Open two browser tabs on the same project to watch subscription updates.
5. Run `npm run codegen` and compare generated types with hand-written ones.

## Git workflow

Track each milestone with a focused branch and PR:

```bash
git switch -c feat/server-schema
git add -A && git commit -m "feat(server): add schema and resolvers"
git push -u origin feat/server-schema
gh pr create --fill
```

Branch map: `feat/server-schema`, `feat/client-queries`, `feat/mutations`, `feat/subscriptions`, `chore/codegen`.
