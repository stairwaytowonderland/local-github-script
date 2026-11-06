---
title: Config
kind: module
longname: module:Config
description: Configuration loader for the GitHub Script environment. Handles parsing of YAML configuration files and environment variables.
order: 2
---

# Config

<SourceLink href="/source/config-js/#L9" label="config.js:9" />

Configuration loader for the GitHub Script environment. Handles parsing of YAML configuration files and environment variables.

---

## Instance Methods

<MemberHeading id="parseargs" depth="3" name="parseArgs" sig="parseArgs(): string" />

<MemberMeta sourceHref="/source/config-js/#L67" sourceLabel="config.js:67" />

Parses command-line arguments to determine the configuration file path.

**Returns**

- `string` — The configuration file path.

<MemberHeading id="getconfigpath" depth="3" name="getConfigPath" sig="getConfigPath(): string" />

<MemberMeta sourceHref="/source/config-js/#L79" sourceLabel="config.js:79" />

Determines the absolute path to the configuration file.

**Returns**

- `string` — The absolute path to the configuration file.

## Other

<MemberHeading id="config" depth="3" name="Config" sig="Config: Object" />

<MemberMeta sourceHref="/source/config-js/#L102" sourceLabel="config.js:102" />

**Properties**

- `env-file` (string, optional) — The path to the environment file.

<MemberHeading id="dotenvoptions" depth="3" name="DotEnvOptions" sig="DotEnvOptions: Object" />

<MemberMeta sourceHref="/source/config-js/#L102" sourceLabel="config.js:102" />

**Properties**

- `override` (boolean, optional) — Whether to override existing environment variables.
- `debug` (boolean, optional) — Whether to enable debug mode.

<MemberHeading id="defaultconfigfilename" depth="3" name="defaultConfigFileName" sig="defaultConfigFileName: string" />

<MemberMeta sourceHref="/source/config-js/#L24" sourceLabel="config.js:24" />

The default yaml configuration file name.

<MemberHeading id="configpath" depth="3" name="configPath" sig="configPath: string" />

<MemberMeta sourceHref="/source/config-js/#L32" sourceLabel="config.js:32" />

Determines the configuration file path based on command-line arguments and environment variables.

<MemberHeading id="filecontents" depth="3" name="fileContents" sig="fileContents: string" />

<MemberMeta sourceHref="/source/config-js/#L37" sourceLabel="config.js:37" />

The absolute path to the configuration file.

<MemberHeading id="config" depth="3" name="config" sig="config: Config" />

<MemberMeta sourceHref="/source/config-js/#L42" sourceLabel="config.js:42" />

The parsed configuration object from the YAML file.

<MemberHeading id="dotenvconfig" depth="3" name="dotenvConfig" sig="dotenvConfig: DotEnvOptions" />

<MemberMeta sourceHref="/source/config-js/#L47" sourceLabel="config.js:47" />

The dotenv configuration options.
