# Quereek

Quereek is a **GraphQL learning app**: a Kanban task manager where every action shows you the exact GraphQL operation behind it. Built with **Apollo Server 5**, **Apollo Client 4**, **React 19**, **shadcn/ui**, and **Vite**.

The local workspace folder is `graphql-app`; the GitHub repository is [`quereek`](https://github.com/edvardhov/quereek).

## How this teaches you

1. **Landing (`/`)** — what you'll learn and how the app works (Act → Inspect → Understand).
2. **Learn (`/learn`)** — interactive Kanban board + **Live GraphQL Inspector** panel.
3. **Concepts (`/concepts`)** — reference for every GraphQL concept, linked from inspector events.

When you create a project, move a task, or assign someone, the inspector shows:
- The GraphQL operation document
- Variables sent
- JSON response from the server
- Plain-English explanation of what happened and which concept you used

The inspector is powered by a custom `ApolloLink` in [`src/inspector/inspectorLink.ts`](src/inspector/inspectorLink.ts) — it records every operation without changing component code.

## What you'll learn

| GraphQL concept | Where it shows up |
|---|---|
| Schema / SDL | `server/schema.graphql` |
| Queries | GetProjects, GetProjectBoard in the inspector |
| Mutations | CreateTask, MoveTask, AssignTask, etc. |
| Subscriptions | TaskChanged events in the inspector |
| Fragments | `src/graphql/fragments.ts` |
| Normalized cache | Mutation cache updates on the board |
| Optimistic UI | Move/assign actions on task cards |

## Stack

- **Server**: Apollo Server 5, Express, in-memory store, PubSub + graphql-ws
- **Client**: React 19, Apollo Client 4, shadcn/ui, React Router, Tailwind v4
- **Tooling**: TypeScript, GraphQL Code Generator, Apollo skills in `.agents/skills/`

## Prerequisites

- Node.js 20+
- npm

## Getting started

```bash
npm install
npm run dev
```

- App: [http://localhost:5173](http://localhost:5173) — start at `/`, then go to `/learn`
- GraphQL endpoint: [http://localhost:4000/graphql](http://localhost:4000/graphql)

```bash
npm run dev:server   # server only
npm run dev:client   # client only
npm run codegen      # generate typed operations
npm run build        # production build
```

## Project structure

```text
server/                  Apollo Server, schema, resolvers, store
src/apollo/              Apollo Client (HTTP + WS + inspector link)
src/inspector/           Event store, ApolloLink, explanations
src/graphql/             Queries, mutations, subscriptions, fragments
src/components/ui/       shadcn/ui primitives (shared, DRY)
src/components/board/    Kanban UI
src/components/inspector/ Inspector panel components
src/components/layout/   AppShell, NavBar
src/pages/               Landing, Learn, Concepts
src/content/             Concept reference data
src/__generated__/       GraphQL Code Generator output
```

Import paths use the `@/` alias (maps to `src/`).

## Suggested learning path

1. Read the landing page — understand Act → Inspect → Understand.
2. Open `/learn`, select a project — watch `GetProjects` and `GetProjectBoard` in the inspector.
3. Create a task — inspect the `CreateTask` mutation and its input type.
4. Move a task — see optimistic UI (`MoveTask`) update before the server responds.
5. Open two tabs on the same project — watch `TaskChanged` subscription events.
6. Click concept links in the inspector to read `/concepts`.

## Apollo skills

- `graphql-schema`, `apollo-server`, `graphql-operations`, `apollo-client` in `.agents/skills/`

## Git workflow

```bash
git switch -c feat/learning-ui
git add -A && git commit -m "feat: add learning UI with GraphQL inspector"
git push -u origin feat/learning-ui
gh pr create --fill
```
