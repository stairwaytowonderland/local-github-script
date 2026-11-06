---
title: modules/user-metadata
kind: module
longname: module:modules/user-metadata
description: Module to fetch metadata about the authenticated GitHub user.
group: GitHub Script Modules
---

# modules/user-metadata

<SourceLink href="/source/modules/user-metadata-cjs/#L19" label="user-metadata.cjs:19" />

**Modifiers:** `async`

Module to fetch metadata about the authenticated GitHub user.

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

- `Promise.<object>` — The response from the GitHub API.
