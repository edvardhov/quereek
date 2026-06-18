# Contributing to Quereek

Thanks for your interest in improving Quereek. This document explains how to set
up the project, the quality bar for changes, and how to propose them.

## Code of Conduct

This project is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By
participating, you are expected to uphold it. Report unacceptable behavior via
the contact listed there.

## Prerequisites

- [Node.js](https://nodejs.org/) 20+ (the repo ships an `.nvmrc`; run `nvm use`)
- npm (bundled with Node)

## Getting started

```bash
git clone https://github.com/edvardhov/quereek.git
cd quereek
npm install
npm run dev
```

- App: http://localhost:5173
- GraphQL endpoint: http://localhost:4000/graphql

## Development workflow

1. Create a branch off `main`: `git checkout -b feat/short-description`.
2. Make your change. Keep the diff focused — one logical change per PR.
3. If you touch the schema (`server/schema.graphql`), regenerate typed
   operations: `npm run codegen` and commit the result in `src/__generated__/`.
4. Run the full local check suite before pushing (see below).
5. Open a pull request and fill out the template.

## Local checks

All of these run in CI and must pass before a PR can merge:

```bash
npm run format:check   # Prettier formatting
npm run lint           # ESLint
npm test               # Vitest unit tests
npm run build          # type-check + production build
```

Auto-fix formatting with `npm run format`.

## Tests

- Unit tests live next to the code as `*.test.ts` (see `server/src/*.test.ts`).
- Add or update tests for any behavior change to the server store or resolvers.
- Run `npm run test:watch` while developing.

## Commit messages

Use clear, imperative messages. [Conventional Commits](https://www.conventionalcommits.org/)
prefixes (`feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`) are
encouraged but not enforced.

## Reporting bugs and requesting features

Use the [issue templates](https://github.com/edvardhov/quereek/issues/new/choose).
For security issues, follow [SECURITY.md](SECURITY.md) instead of opening a
public issue.

## License

By contributing, you agree that your contributions will be licensed under the
[MIT License](LICENSE).
