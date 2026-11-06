---
title: modules/hello-world
kind: module
longname: module:modules/hello-world
description: Module to demonstrate a simple &quot;Hello, world!&quot; example in the GitHub Script environment.
group: GitHub Script Modules
order: -1
---

# modules/hello-world

<SourceLink href="/source/modules/hello-world-cjs/#L23" label="hello-world.cjs:23" />

**Modifiers:** `async`

Module to demonstrate a simple "Hello, world!" example in the GitHub Script environment.

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

- `Promise.<string>` — A greeting message.

**Example**

```js
const message = await require('./hello-world.cjs')({github, context, core, exec, glob, io, getOctokit})
console.log(message)
```
