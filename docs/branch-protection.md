# Branch Protection Rules Draft

Target branch: `main`

Recommended rules:

- Require pull request reviews before merging.
- Require at least 1 approving review.
- Dismiss stale reviews when new commits are pushed.
- Require status checks to pass before merging.
- Require branches to be up to date before merging.
- Restrict direct pushes to `main`.
- Require linear history if squash/rebase merges are the standard.

Required collaboration flow:

- Work on `feature/<topic>`, `fix/<topic>`, or `docs/<topic>` branches only.
- Use Conventional Commits for every commit pushed to the feature branch.
- Open a PR only after the branch is ready for review.
- Collect at least 3 review comments and address all `[MUST]` items before merge.

Suggested status checks:

- CI / test workflow
- DORA metrics workflow
- Documentation lint if enabled later

Suggested merge settings:

- Allow squash merge if you want one Conventional Commit style summary on `main`.
- Dismiss stale approvals when the branch changes.
- Require at least one code owner review if CODEOWNERS is enabled.

Note: This file documents the policy. Apply the same policy in repository settings or rulesets if you have admin access.
