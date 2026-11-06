---
title: modules/changed-files
kind: module
longname: module:modules/changed-files
description: Module to determine changed files in a GitHub repository. Handles ignore events, shallow clone fallbacks, and glob pattern filtering.
group: GitHub Script Modules
---

# modules/changed-files

<SourceLink href="/source/modules/changed-files-cjs/#L20" label="changed-files.cjs:20" />

**Modifiers:** `async`

Module to determine changed files in a GitHub repository. Handles ignore events, shallow clone fallbacks, and glob pattern filtering.

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

- `Promise.<boolean>` — Indicates whether processing was skipped due to ignore events.
