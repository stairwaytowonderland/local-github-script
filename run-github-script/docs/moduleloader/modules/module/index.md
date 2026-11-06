---
title: Module
kind: class
longname: ModuleLoader (Modules)~Module
description: Represents a dynamically loaded module with its configuration and environment.
---

# Module

<SourceLink href="/source/modules-js/#L33" label="modules.js:33" />

Represents a dynamically loaded module with its configuration and environment.

---

## Constructor

<Signature
  code="new Module(
	moduleConfig: ModuleConfig,
	modulePath: string,
): Module"
/>

Constructs a new Module instance.

**Parameters**

- `moduleConfig` ([ModuleConfig](/moduleloader/modules#moduleconfig)) — The configuration object for the module.
- `modulePath` (string) — The absolute path to the module file.

---

## Instance Methods

<MemberHeading id="loadmodule" depth="3" name="loadModule" sig="loadModule(toolkit: GitHubToolkit): Promise.<void>" />

<MemberMeta badges="async" sourceHref="/source/modules-js/#L93" sourceLabel="modules.js:93" />

Injects the module configuration into `process.env`, dynamically imports the module file, runs its default export, and cleans up the environment.

**Parameters**

- `toolkit` ([GitHubToolkit](/moduleloader/modules#githubtoolkit)) — The GitHub Actions toolkit containing utilities.

**Returns**

- `Promise.<void>`

## Static Methods

<MemberHeading
  id="load"
  depth="3"
  name="load"
  sig="load(
	toolkit: GitHubToolkit,
	moduleConfig: ModuleConfig,
	modulesPath: string,
): Promise.<void>"
/>

<MemberMeta badges="static,async" sourceHref="/source/modules-js/#L42" sourceLabel="modules.js:42" />

Dynamically loads, instantiates, and executes a module.

**Parameters**

- `toolkit` ([GitHubToolkit](/moduleloader/modules#githubtoolkit)) — The GitHub Actions toolkit containing utilities.
- `moduleConfig` ([ModuleConfig](/moduleloader/modules#moduleconfig)) — The configuration object for the module.
- `modulesPath` (string) — The relative path directory containing the modules.

**Returns**

- `Promise.<void>`

## Instance Fields

<MemberHeading id="name" depth="3" name="name" sig="name: string" />

<MemberMeta sourceHref="/source/modules-js/#L59" sourceLabel="modules.js:59" />

The name of the module.

<MemberHeading id="id" depth="3" name="id" sig="id: string" />

<MemberMeta sourceHref="/source/modules-js/#L65" sourceLabel="modules.js:65" />

The ID of the module.

<MemberHeading id="inputs" depth="3" name="inputs" sig="inputs: Record.<string, *>" />

<MemberMeta sourceHref="/source/modules-js/#L71" sourceLabel="modules.js:71" />

The input parameters for the module.

<MemberHeading id="env" depth="3" name="env" sig="env: Record.<string, string>" />

<MemberMeta sourceHref="/source/modules-js/#L77" sourceLabel="modules.js:77" />

The environment variables for the module.

<MemberHeading id="modulepath" depth="3" name="modulePath" sig="modulePath: string" />

<MemberMeta sourceHref="/source/modules-js/#L83" sourceLabel="modules.js:83" />

The absolute path to the module file.
