---
title: utils
kind: module
longname: module:utils
description: Utility functions for the GitHub script.
group: Utilities
---

# utils

<SourceLink href="/source/utils-cjs/#L8" label="utils.cjs:8" />

Utility functions for the GitHub script.

---

## Instance Methods

<MemberHeading id="kebabtocamel" depth="3" name="kebabToCamel" sig="kebabToCamel(str: string): string" />

<MemberMeta sourceHref="/source/utils-cjs/#L13" sourceLabel="utils.cjs:13" />

Converts a kebab-case string to camelCase.

**Parameters**

- `str` (string) — The kebab-case string.

**Returns**

- `string` — The camelCase string.

<MemberHeading
  id="dynamicmodules"
  depth="3"
  name="dynamicModules"
  sig="dynamicModules(
	...args: Array.<(string|object)>,
): Promise.<object>"
/>

<MemberMeta badges="async" sourceHref="/source/utils-cjs/#L20" sourceLabel="utils.cjs:20" />

Dynamically imports modules if they are not already provided.

**Parameters**

- `args` (Array.\<(string|object)>) — An array of tuples containing the module name and an optional existing module object.

**Returns**

- `Promise.<object>` — An object containing the ensured modules keyed by their names.
