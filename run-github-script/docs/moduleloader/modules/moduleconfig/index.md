---
title: ModuleConfig
kind: typedef
longname: ModuleLoader (Modules)~ModuleConfig
---

# ModuleConfig

<SourceLink href="/source/modules-js/#L192" label="modules.js:192" />

**Properties**

- `name` (string) — The user-friendly name of the module.
- `id` (string) — Unique identifier for the module block.
- `path` (string) — The relative file path to the target module executable.
- `inputs` (Record.\<string, \*>, optional) — Input options mapping to standard action `INPUT_` parameters.
- `env` (Record.\<string, string>, optional) — Custom environment overrides injected into `process.env`.

**Type**

`Object`
