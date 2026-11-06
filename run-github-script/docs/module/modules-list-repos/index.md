---
title: modules/list-repos
kind: module
longname: module:modules/list-repos
description: Module to list repositories in a GitHub organization. Filters for archived repositories with open issues.
group: GitHub Script Modules
---

# modules/list-repos

<SourceLink href="/source/modules/list-repos-cjs/#L20" label="list-repos.cjs:20" />

**Modifiers:** `async`

Module to list repositories in a GitHub organization. Filters for archived repositories with open issues.

**Parameters**

- `GitHubToolkit` (object) — The context object containing GitHub script utilities.
  - `GitHubToolkit.github` (object) — The GitHub client.
  - `GitHubToolkit.context` (object) — The GitHub Action context.
  - `GitHubToolkit.core` (object) — The GitHub Actions core module.
  - `GitHubToolkit.exec` (object) — The GitHub Actions exec module.
  - `GitHubToolkit.glob` (object) — The GitHub Actions glob module.
  - `GitHubToolkit.io` (object) — The GitHub Actions io module.
  - `GitHubToolkit.getOctokit` (function) — The function to get an authenticated Octokit instance.

**Returns**

- `Promise.<Array>` — The list of filtered repositories.
