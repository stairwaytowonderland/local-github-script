---
title: modules/api-metadata
kind: module
longname: module:modules/api-metadata
description: Module to fetch GitHub API metadata. Retrieves information like allowed scopes and rate limits.
group: GitHub Script Modules
---

# modules/api-metadata

<SourceLink href="/source/modules/api-metadata-cjs/#L20" label="api-metadata.cjs:20" />

**Modifiers:** `async`

Module to fetch GitHub API metadata. Retrieves information like allowed scopes and rate limits.

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
