# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Live in-browser demo: the GraphQL schema, resolvers, and store run client-side
  with no backend, deployed to GitHub Pages.
- Configurable GraphQL endpoint (`?api=` query param or local storage) with a
  **Server** panel to connect to a running server or use the in-browser demo.

## [0.1.0] - 2026-06-18

### Added

- Vitest test suite covering the server store and resolvers.
- Prettier formatting with `.editorconfig` and `format` / `format:check` scripts.
- Community health files: `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`.
- GitHub issue templates, pull request template, `CODEOWNERS`, and `FUNDING`.
- Dependabot configuration for npm and GitHub Actions updates.
- CodeQL security scanning workflow.
- CI now runs formatting, lint, tests, and build across Node 20 and 22.

[unreleased]: https://github.com/edvardhov/quereek/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/edvardhov/quereek/releases/tag/v0.1.0
