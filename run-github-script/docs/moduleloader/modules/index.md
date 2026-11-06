---
title: ModuleLoader
kind: module
longname: ModuleLoader (Modules)
description: Module loader for the GitHub Script environment. Handles dynamic loading and execution of custom modules based on configuration.
---

# ModuleLoader&#x20;

<SourceLink href="/source/modules-js/#L8" label="modules.js:8" />

Module loader for the GitHub Script environment. Handles dynamic loading and execution of custom modules based on configuration.

---

## Other

<MemberHeading id="load" depth="3" name="load" sig="load" />

<MemberMeta badges="static" sourceHref="/source/modules-js/#L18" sourceLabel="modules.js:18" />

Loads custom modules based on the provided configuration.

**Parameters**

- `dependencies` (Object) — The standard GitHub Script dependencies required by the modules.
- `config` (Object) — The configuration object containing module details.

<MemberHeading id="module" depth="3" name="Module" sig="Module" />

<MemberMeta sourceHref="/source/modules-js/#L33" sourceLabel="modules.js:33" />

Represents a dynamically loaded module with its configuration and environment.

**Parameters**

- `moduleConfig` ([ModuleConfig](/moduleloader/modules#moduleconfig)) — The configuration object for the module.
- `modulePath` (string) — The absolute path to the module file.

<MemberHeading id="githubtoolkit" depth="3" name="GitHubToolkit" sig="GitHubToolkit: Object" />

<MemberMeta sourceHref="/source/modules-js/#L183" sourceLabel="modules.js:183" />

**Properties**

- `github` (Object) — Pre-authenticated octokit client.
- `context` (Object) — The workflow run context.
- `core` (Object) — Actions core task library.
- `exec` (Object) — Actions exec tool utilities.
- `glob` (Object) — Actions glob tool utilities.
- `io` (Object) — Actions core I/O utilities.
- `getOctokit` (function) — Returns an authenticated Octokit client.

<MemberHeading id="moduleconfig" depth="3" name="ModuleConfig" sig="ModuleConfig: Object" />

<MemberMeta sourceHref="/source/modules-js/#L192" sourceLabel="modules.js:192" />

**Properties**

- `name` (string) — The user-friendly name of the module.
- `id` (string) — Unique identifier for the module block.
- `path` (string) — The relative file path to the target module executable.
- `inputs` (Record.\<string, \*>, optional) — Input options mapping to standard action `INPUT_` parameters.
- `env` (Record.\<string, string>, optional) — Custom environment overrides injected into `process.env`.
