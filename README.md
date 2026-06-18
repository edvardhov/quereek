<div align="center">

<img alt="Quereek" src="https://raw.githubusercontent.com/edvardhov/quereek/main/src/assets/quereek-lockup-neutral.svg" width="360">

### Learn GraphQL by using it

A Kanban task manager where **every action shows you the exact GraphQL operation behind it** — the document, the variables, the response, and a plain-English explanation of what just happened.

Built with Apollo Server 5 · Apollo Client 4 · React 19 · shadcn/ui · Vite · Tailwind v4

[![CI](https://github.com/edvardhov/quereek/actions/workflows/ci.yml/badge.svg)](https://github.com/edvardhov/quereek/actions/workflows/ci.yml)
[![CodeQL](https://github.com/edvardhov/quereek/actions/workflows/codeql.yml/badge.svg)](https://github.com/edvardhov/quereek/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)](.nvmrc)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**[▶ Try the live demo](https://edvardhov.github.io/quereek/)** — runs entirely in your browser, no setup.

</div>

---

## Live demo

The hosted app at **[edvardhov.github.io/quereek](https://edvardhov.github.io/quereek/)** runs the GraphQL schema **inside your browser** — the same `typeDefs`, resolvers, and in-memory store the real server uses, executed client-side. No backend, no sign-up, nothing to install.

Want to see real network requests and WebSocket subscriptions instead? Open the **Server** panel in the top bar and connect to a running server:

1. Clone the repo and run `npm run dev` (starts the server on `http://localhost:4000`).
2. In the demo, click **Server → Use local server** (or paste `http://localhost:4000/graphql`).

The endpoint can also be set via the `?api=<url>` query parameter or persisted in local storage. With no server configured, the app falls back to the in-browser demo. Cross-tab subscriptions (two browser tabs reacting to each other) only work against a real server.

---

## What is Quereek?

Quereek turns a familiar app (a Kanban board) into an interactive GraphQL classroom. You drive the board like any task manager, and a live **Learning dock** mirrors each operation so you can see the network layer that powers it. The loop is **Act → Inspect → Understand**:

1. **Act** — create projects, add tasks, move cards, assign people.
2. **Inspect** — the inspector records the exact GraphQL operation, variables, and JSON response for every action.
3. **Understand** — each event ships with a plain-English explanation, a step-by-step operation flow, and a link to a concept reference.

The GitHub repository is [`quereek`](https://github.com/edvardhov/quereek).

## How it teaches

The app has three routes:

| Route       | Purpose                                                                                |
| ----------- | -------------------------------------------------------------------------------------- |
| `/`         | Landing page — what you'll learn and the Act → Inspect → Understand model.             |
| `/learn`    | The playground: a three-panel, resizable workspace (Projects · Board · Learning dock). |
| `/concepts` | Reference for every GraphQL concept, deep-linked from inspector events.                |

### The playground (`/learn`)

A resizable, collapsible three-panel layout (your sizes persist via local storage):

- **Projects** — pick a project to load its board.
- **Board** — the Kanban UI: create/move/assign/delete tasks.
- **Learning dock** — three tabs that explain what the board is doing:
  - **Inspector** — every operation as it fires, with a document / variables / response / **Explained** / **Flow** breakdown.
  - **Data** — a live view (and editor) of the server's raw in-memory store. Patch a row directly or reset to seed data and watch the board react.
  - **Lessons** — short guided lessons that auto-advance when the inspector detects the operation you were asked to run.

A first-run **guided tour** points out each panel.

### The Inspector

The inspector is powered by a custom `ApolloLink` in [`src/inspector/inspectorLink.ts`](src/inspector/inspectorLink.ts) — it records every operation **without changing component code**. Each event exposes:

- The GraphQL operation document
- The variables sent
- The JSON response from the server (or errors)
- **Explained** — a plain-English summary of what happened and which concept you used
- **Flow** — a visual, step-by-step trace from UI → Apollo Client → transport → resolver → store → response → cache → re-render

## What you'll learn

| GraphQL concept  | Where it shows up                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------ |
| Schema / SDL     | [`server/schema.graphql`](server/schema.graphql)                                                 |
| Queries          | `GetProjects`, `GetProjectBoard` in the inspector                                                |
| Mutations        | `CreateTask`, `MoveTask`, `AssignTask`, `DeleteTask`, …                                          |
| Subscriptions    | `TaskChanged` events over WebSocket                                                              |
| Fragments        | [`src/graphql/fragments.ts`](src/graphql/fragments.ts)                                           |
| Normalized cache | Mutation cache updates on the board                                                              |
| Optimistic UI    | Move/assign actions update before the server responds                                            |
| Server internals | The **Data** tab maps domain types (`Task`, `Project`) to the raw store rows resolvers read from |

## Stack

- **Server**: Apollo Server 5, Express 4, in-memory store, `graphql-subscriptions` PubSub + `graphql-ws`
- **Client**: React 19, Apollo Client 4, React Router 7, shadcn/ui (Radix), Tailwind v4, `react-resizable-panels`, `sonner`
- **Tooling**: TypeScript, GraphQL Code Generator, ESLint, Vite 8, Apollo skills in `.agents/skills/`

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

### Scripts

```bash
npm run dev          # run server + client together (concurrently)
npm run dev:server   # server only (tsx watcher, restarts on schema/src changes)
npm run dev:client   # Vite client only
npm run codegen      # generate typed operations into src/__generated__/
npm run build        # type-check + production build
npm run preview      # preview the production build
npm run lint         # eslint
npm run format       # format with prettier
npm run format:check # verify formatting (used in CI)
npm test             # run the vitest suite once
npm run test:watch   # run vitest in watch mode
```

## Project structure

```text
server/
  dev.ts                  Dev runner: spawns the server, restarts on schema/src changes
  schema.graphql          SDL — domain types, raw store types, queries, mutations, subscriptions
  src/
    index.ts              Apollo Server + Express + graphql-ws wiring
    resolvers.ts          Query/Mutation/Subscription resolvers
    store.ts              In-memory users/projects/tasks store + seed data + PubSub

src/
  apollo/                 Apollo Client (HTTP + WS split link + inspector link)
  inspector/              Event store, ApolloLink, explanations, useInspector hook
  graphql/                Queries, mutations, subscriptions, fragments, raw-store ops
  content/                Concept reference data + guided lesson definitions
  hooks/                  useLessons (lesson progress + inspector matching)
  components/
    ui/                   shadcn/ui primitives (shared, DRY)
    board/                Kanban UI + ProjectSidebar
    inspector/            Inspector panel, event view, code block, OperationFlow
    playground/           Resizable PlaygroundPanels, RightDock, Data + Lessons panels
    layout/               AppShell, NavBar
    brand/                BrandMark logo component
    theme/                Theme provider + toggle (light/dark)
    tour/                 First-run guided tour
  pages/                  Landing, Learn, Concepts
  assets/                 Logo SVGs (icon + lockup, light/dark)
  __generated__/          GraphQL Code Generator output
```

Import paths use the `@/` alias (maps to `src/`).

## Suggested learning path

1. Read the landing page — understand **Act → Inspect → Understand**.
2. Open `/learn` and take the guided tour.
3. Open the **Lessons** tab and start _"Read data with a query"_ — select a project and watch `GetProjects` / `GetProjectBoard` fire.
4. Create a task — inspect the `CreateTask` mutation and its input type in the **Flow** tab.
5. Move a task — see optimistic UI (`MoveTask`) update before the server responds.
6. Open the **Data** tab — edit a raw task row and watch the board update via cache/subscription.
7. Open two tabs on the same project — watch `TaskChanged` subscription events.
8. Click concept links in the inspector to read `/concepts`.

## GraphQL API at a glance

The full SDL lives in [`server/schema.graphql`](server/schema.graphql). Highlights:

- **Domain types** — `Project`, `Task`, `User` with nested relations (`Task.assignee`, `Project.tasks`).
- **Raw store types** — `RawProject`, `RawTask`, `StoreSnapshot` expose the in-memory arrays with scalar foreign keys, so you can see exactly where resolvers read data from.
- **Learning mutations** — `updateRawTask`, `updateRawProject`, `updateRawUser`, and `resetStore` patch the store directly (bypassing domain validation) to power the Data tab.
- **Subscription** — `taskChanged(projectId)` streams `TaskChangeEvent`s over WebSocket.

## Apollo skills

Apollo's authoring skills live in `.agents/skills/` (`graphql-schema`, `apollo-server`, `graphql-operations`, `apollo-client`, and more) and back the in-app concept reference.

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, the
local check suite, and the PR workflow, and the [Code of Conduct](CODE_OF_CONDUCT.md)
for community expectations. Security issues should follow [SECURITY.md](SECURITY.md).

## License

Licensed under the [MIT License](LICENSE) — free to use, fork, and learn from. Keep the copyright notice in copies.
