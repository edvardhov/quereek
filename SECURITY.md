# Security Policy

## Supported versions

Quereek is an educational project under active development. Security fixes are
applied to the latest `main` branch only.

| Version | Supported          |
| ------- | ------------------ |
| `main`  | :white_check_mark: |

## Reporting a vulnerability

Please do **not** open a public issue for security vulnerabilities.

Instead, report it privately using GitHub's
[private vulnerability reporting](https://github.com/edvardhov/quereek/security/advisories/new).
If that is unavailable, contact the maintainer
[@edvardhov](https://github.com/edvardhov) directly.

When reporting, please include:

- A description of the vulnerability and its impact
- Steps to reproduce (proof of concept if possible)
- Affected files, routes, or operations
- Any suggested remediation

## What to expect

- Acknowledgement of your report within a few days.
- An assessment and, if confirmed, a fix on `main`.
- Credit in the release notes if you would like to be acknowledged.

## Scope

Quereek runs an in-memory GraphQL server intended for local learning. It is not
hardened for production deployment (no authentication, authorization, or
persistence). Reports about missing production-grade controls are welcome but
will be triaged as enhancements rather than vulnerabilities.
