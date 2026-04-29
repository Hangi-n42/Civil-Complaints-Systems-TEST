# Contributing Guide

This repository uses a feature-branch workflow with Conventional Commits and pull-request based review.

## Branch Strategy

- `main`: protected release branch.
- `feature/<topic>`: isolated work for a single task or PR.
- `fix/<topic>`: hotfixes and small corrections.
- `docs/<topic>`: documentation-only changes.
- Keep branch names short, descriptive, and aligned to the PR title.

## Commit Format

Use Conventional Commits for every commit:

- `feat`: new user-facing capability
- `fix`: bug fix
- `docs`: documentation only
- `chore`: tooling or maintenance
- `refactor`: internal change without behavior change

Examples:

```text
feat(docs): add branch strategy and review guide
docs(wiki): add getting started page
chore(ci): draft SLA workflow skeleton
```

Commit messages should describe one logical change only. If a PR needs follow-up work after review, use a new Conventional Commit in the same branch instead of rewriting history.

## Pull Request Flow

1. Create a feature branch from `main`.
2. Keep commits small and reviewable.
3. Open one PR per logical change.
4. Link the issue or task description in the PR body.
5. Request review from the code owners.
6. Address feedback with follow-up commits.
7. Collect at least 3 review comments before merge, with at least one tagged `[MUST]` or `[SHOULD]`.

## Review Rules

- Use `[MUST]` for blockers, correctness issues, or missing requirements.
- Use `[SHOULD]` for quality, readability, or follow-up recommendations.
- Keep each review comment focused on a single finding.
- Prefer concrete examples over vague advice.
- When reviewing, state the risk, the location, and the expected fix in one comment.

## Definition of Done

- Changes are committed with a Conventional Commit message.
- PR template is completed.
- Review feedback is addressed.
- Relevant docs and tests are updated.
- Branch protection expectations are documented before merge.
