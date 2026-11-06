---
title: step-summary
kind: module
longname: module:step-summary
description: Initializes the GitHub step summary for a given module file.
group: Utilities
---

# step-summary

<SourceLink href="/source/step-summary-cjs/#L15" label="step-summary.cjs:15" />

**Modifiers:** `async`

Initializes the GitHub step summary for a given module file.

**Parameters**

- `moduleFile` (string) — The path to the module file.

**Returns**

- `Promise.<void>` — A promise that resolves when the step summary is initialized.

**Example**

```js
const initStepSummary = require('./step-summary.cjs')
await initStepSummary('./my-module.js')
```
