# Contribution Guidelines

We welcome patches to NHS products, as long as you follow these guidelines:

## Git workflow

- Pull requests must contain a succinct, clear summary of what the user need is
  driving this feature change
- Make a feature branch, ideally in the format `feature/summary-of-change` e.g.
  `feature/add-login`
- Follow our [Git styleguide](https://github.com/nhsuk/styleguides/blob/master/git.md)
- Ensure your branch contains logical, atomic commits
- Pull requests are automatically tested and need to pass in order for the PR
  to be eligible to merge
- You *may* rebase your branch after feedback if it's to include relevant
  updates from the master branch. We prefer a rebase here to a merge commit as
  we prefer a clean and straight history on master with discrete merge commits
  for features

## Code

Must:
- be readable with meaningful naming, e.g. no shorthand single character
  variable names
- pass linting with the ruleset from `.eslint.json` (`npm lint`). Lint will
  run on all commits, rebases and as part of CI

## Testing

Write tests.
Run tests (`npm test`)  Test will
run on all commits, rebases and as part of CI.

## Versioning

We use [Semantic Versioning](http://semver.org/), and bump the version
on master only. Please don't submit your own proposed version numbers.