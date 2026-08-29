# ADR-001: Use `dev`, `releases`, and `main` for distinct branch roles

- **Date:** 2026-08-29
- **Status:** Accepted

## Context

The project needs a lightweight, explicit branch workflow before implementation and future releases begin.

## Options considered

- Use one branch for all development and stable versions.
- Use `main` as the primary development branch.
- Use separate branches for active development, release work, and stable backups.

## Decision

- `dev` is the active development branch and the default branch.
- `releases` is used when preparing and publishing a new release.
- `main` is used only to back up versions that are known to be stable.

## Consequences

- Ongoing work belongs on `dev`.
- A release is intentionally handled through `releases` rather than directly from `dev`.
- `main` is not the primary integration branch; it advances only after a release is established as stable.
