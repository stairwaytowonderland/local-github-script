/**
 * Configuration loader for the GitHub Script environment.
 * Handles parsing of YAML configuration files and environment variables.
 *
 * @module config
 */

// Ensure the node built-in core path module is imported
// rather than from an external package (e.g. from npm)
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as YAML from 'yaml'
import * as dotenv from 'dotenv'
import * as dotenvExpand from 'dotenv-expand'
import * as cliArgs from './args.js'
import {level} from './loglevel.js'

const __dirname = import.meta.dirname

/**
 * Determines the log level for the application.
 * @private
 * @memberof module:config
 * @type {string}
 * @default 'info'
 */
const logLevel = level((process.env.LOG_LEVEL ?? cliArgs.logLevel ?? 'info')?.toLowerCase())

/**
 * Base directory for the project.
 * @private
 * @memberof module:config
 * @type {string}
 * @default '..'
 */
const baseDir = path.resolve(__dirname, '..')

console.debug(`Base directory for configuration files: ${baseDir}`)

/**
 * Determines the path to the configuration file.
 *
 * Using `getConfigPath()` (with no arguments) will resolve to a path relative to current (src) directory.
 *
 * @private
 * @memberof module:config
 * @type {string}
 * @default 'config.yaml'
 */
const configPath = process.env.CONFIG_PATH ?? getConfigPath(undefined, baseDir)

console.debug(`Resolved configuration path: ${configPath}`)

/**
 * Parsed YAML configuration from the configuration file.
 * @see YamlConfig
 * @memberof module:config
 * @type {YamlConfig}
 */
export const yaml = YAML.parse(fs.readFileSync(configPath, 'utf8')) ?? {}

/**
 * Determines whether debug mode is enabled.
 * @private
 * @memberof module:config
 * @type {boolean}
 * @default false
 */
const debug = process.env.DEBUG === 'true' || (cliArgs.debugEnabled && process.env.DEBUG !== 'false')

/**
 * Final dotenv configuration object.
 * @private
 * @memberof module:config
 * @type {Object<string, any>}
 * @property {boolean} override=true - Whether to override existing environment variables.
 * @property {boolean} debug=false - Whether debug mode is enabled.
 * @property {string} encoding='utf8' - The encoding to use when reading the .env file.
 */
const dotenvConfig = {override: true, debug: debug, encoding: 'utf8'}

/**
 * Path to the environment file.
 * @private
 * @memberof module:config
 * @type {string}
 * @default '.env'
 */
const envPath = path.resolve(yaml?.['env-file'] ?? baseDir + '/.env')

console.debug(`Using dotenv configuration: ${JSON.stringify(dotenvConfig)}`)
let env
if (fs.existsSync(envPath)) {
  console.log(`Loading environment variables from: ${envPath}`)
  env = dotenvExpand.expand(dotenv.config({path: envPath, ...dotenvConfig}))
} else {
  console.warn(`Environment file "${envPath}" not found. Falling back to default environment variables.`)
  env = dotenvExpand.expand(dotenv.config(dotenvConfig))
}

/**
 * Configuration options for the GitHub Script environment.
 *
 * Provides normalized options derived from environment variables and command-line arguments.
 *
 * @memberof module:config
 * @property {Object<string, any>} env - The path to the environment file.
 * @property {string|undefined} [env.path] - The path to the environment file.
 * @property {string[]|undefined} [env.keys] - The keys of the environment variables loaded from the file.
 * @property {string} config='config.yaml' - The path to the configuration file.
 * @property {string} level='info' - The log level for the application.
 * @property {boolean} debug=false - Whether debug mode is enabled.
 */
export const opts = {
  env: {
    path: Object.keys(env.parsed).length > 0 ? envPath : undefined,
    keys: Object.keys(env.parsed) ?? undefined,
  },
  config: configPath,
  level: logLevel,
  debug,
}

console.debug(`Using configuration options: ${JSON.stringify(opts, null, 2)}`)

/**
 * Determines the absolute path to the configuration file.
 *
 * @example
 * const configPath = getConfigPath()
 * console.log(configPath)
 *
 * @private
 * @memberof module:config
 * @param {string[]} [configFile=[cliArgs.config, 'config.yaml']] - An array of configuration file paths to attempt to load in order of priority.
 * @param {string} [loadBase=baseDir] - The base directory to resolve configuration file paths against.
 * @throws {Error} If no configuration file is found.
 * @returns {string} The absolute path to the configuration file.
 */
function getConfigPath(configFile = [cliArgs.config, 'config.yaml'], loadBase = baseDir) {
  console.debug(`Attempting to resolve configuration file from: ${configFile}`)
  console.debug(`Using base directory: ${loadBase}`)

  const [currentFile, ...remainingFiles] = configFile.filter(Boolean)

  if (!currentFile) {
    throw new Error('Configuration file not found.')
  }

  const resolvedPath = path.resolve(loadBase, currentFile)

  console.debug(`Resolved Config Path: ${resolvedPath}`)

  if (fs.existsSync(resolvedPath)) {
    return resolvedPath
  }

  if (remainingFiles.length > 0) {
    console.warn(`Configuration file "${currentFile}" not found. Attempting to load: "${remainingFiles[0]}"`)
  }

  return getConfigPath(remainingFiles, loadBase)
}

/**
 * Options for the module object.
 * @global
 * @interface ModuleConfig
 * @property {string} name - The name of the module.
 * @property {string} [description] - The description of the module.
 * @property {boolean} [ci=false] - Whether the module should run in CI.
 * @property {string} id - The identifier of the module.
 * @property {string} path - The path to the module file.
 * @property {boolean} [summary=false] - Whether to enable step summary for the module.
 * @property {Object<string, string>} [env] - The list of environment variables used by the module.
 * @property {Object<string, *>} [inputs] - The list of input parameters for the module.
 */

/**
 * Options for the main configuration object.
 * @global
 * @typedef {Object<string, any>} YamlConfig
 * @property {string} name - The name of the configuration.
 * @property {string} description - The description of the configuration.
 * @property {string} "module-path" - The path to the module file.
 * @property {string} ["env-file"] - The path to the environment file.
 * @property {boolean} ["global-octokit"=false] - Whether to use a global Octokit instance for all modules.
 * @property {Module[]} modules - The imported module objects.
 */
