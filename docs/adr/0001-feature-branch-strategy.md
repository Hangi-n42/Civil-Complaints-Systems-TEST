# 0001 Feature Branch Strategy

- Status: Accepted
- Date: 2026-04-30
- Decision makers: Team, repository maintainer
- Related issue / PR: Collaboration setup PR

## Context

We need a repeatable workflow that supports parallel work, reviewability, and safe merges.

## Decision

- Use `main` as the protected integration branch.
- Use feature branches for all changes.
- Require Conventional Commits for each commit.
- Merge only after review and status checks.

## Consequences

- Work is easier to review and bisect.
- PR history becomes the primary collaboration record.
- Small tasks may still require branch/PR overhead.
