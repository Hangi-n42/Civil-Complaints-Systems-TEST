# Review Guide

## Goal

Review PRs with actionable feedback that can be applied quickly.

## Tagging Rules

- `[MUST]` means the PR should not merge until the item is fixed.
- `[SHOULD]` means the PR can merge, but the recommendation should be considered.

## Review Minimum

- Leave at least 3 review comments for each PR when possible.
- Include at least one `[MUST]` finding if you identify a blocker.
- Use the remaining comments for `[SHOULD]` improvements, clarity notes, or small follow-ups.

## Example Review Comments

- `[MUST]` The branch protection rule is described in docs, but the repository settings are still not enforced. Please apply the corresponding rule in GitHub settings or rulesets before merging.
- `[MUST]` The workflow draft should fail fast when the expected input is missing so CI does not silently pass with empty output.
- `[SHOULD]` The wiki pages would be easier to scan if each page ended with a short related-links section.

## Review Checklist

- Check correctness first.
- Check whether the change meets the task.
- Check whether the commit message follows Conventional Commits.
- Check whether documentation and links remain consistent.
- Check whether the PR has enough review evidence to support merge.
