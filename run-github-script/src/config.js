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
const logLevel = (process.env.LOG_LEVEL = level((process.env.LOG_LEVEL ?? cliArgs.level)?.toLowerCase() ?? 'info'))

console.debug(`Resolved log level: ${logLevel}`)

console.debug(`Dir name for configuration files: ${__dirname}`)

/**
 * Base directory for configuration files.
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
 * @default 'config.yaml' (relative to project directory)
 */
const configPath = process.env.CONFIG_PATH ?? getConfigPath(undefined, baseDir)

console.debug(`Resolved configuration path: ${configPath}`)

/**
 * Parsed YAML configuration from the configuration file.
 * @private
 * @memberof module:config
 * @type {Object<string, any>}
 */
const yamlConfig = YAML.parse(fs.readFileSync(configPath, 'utf8')) ?? {}

/**
 * Determines whether debug mode is enabled.
 * @private
 * @memberof module:config
 * @type {boolean}
 * @default false
 */
const debug = process.env.DEBUG === 'true' || (cliArgs.debug && process.env.DEBUG !== 'false')

/**
 * Final dotenv configuration object.
 * @private
 * @property {boolean} override - Whether to override existing environment variables.
 * @property {string} encoding - The encoding to use when reading the .env file.
 */
const dotenvConfig = {override: true, debug: debug, encoding: 'utf8'}

/**
 * Path to the environment file.
 * @private
 * @memberof module:config
 * @type {string}
 */
const envPath = path.resolve(yamlConfig?.['env-file'] ?? baseDir + '/.env')

console.debug(`Using dotenv configuration: ${JSON.stringify(dotenvConfig)}`)
if (fs.existsSync(envPath)) {
  console.log(`Loading environment variables from: ${envPath}`)
  dotenvExpand.expand(dotenv.config({path: envPath, ...dotenvConfig}))
} else {
  console.warn(`Environment file "${envPath}" not found. Falling back to default environment variables.`)
  dotenvExpand.expand(dotenv.config(dotenvConfig))
}

/**
 * Configuration options for the GitHub Script environment.
 *
 * Provides normalized options derived from environment variables and command-line arguments.
 *
 * @private
 * @memberof module:config
 * @type {Object<string, any>}
 */
const opts = {
  config: configPath,
  level: logLevel,
  debug,
}

/**
 * Exported configuration object.
 * @memberof module:config
 * @type {Object}
 * @property {Object<string, any>} opts - The normalized configuration options.
 * @property {string} opts.config='config.yaml' - The path to the configuration file.
 * @property {boolean} opts.debug=false - Whether debug mode is enabled.
 * @property {string} opts.level='info' - The log level for the application.
 * @property {Object<string, any>} yaml - The parsed YAML configuration.
 * @property {string} yaml.name - The name of the configuration.
 * @property {string} yaml.description - The description of the configuration.
 * @property {string} yaml."module-path" - The path to the module file.
 * @property {string} [yaml."env-file"] - The path to the environment file.
 * @property {boolean} [yaml."global-octokit"=false] - Whether to use a global Octokit instance for all modules.
 * @property {ModuleConfig[]} yaml.modules - The imported module objects.
 */
export const config = {
  opts: opts,
  yaml: yamlConfig,
}

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
 * @param {string} [baseDir=baseDir] - The base directory to resolve configuration file paths against.
 * @throws {Error} If no configuration file is found.
 * @returns {string} The absolute path to the configuration file.
 */
function getConfigPath(configFile = [cliArgs.config, 'config.yaml'], baseDir = baseDir) {
  console.debug(`Attempting to resolve configuration file from: ${configFile}`)
  console.debug(`Using base directory: ${baseDir}`)

  const [currentFile, ...remainingFiles] = configFile.filter(Boolean)

  if (!currentFile) {
    throw new Error('Configuration file not found.')
  }

  const resolvedPath = path.resolve(baseDir, currentFile)

  console.debug(`Resolved Config Path: ${resolvedPath}`)

  if (fs.existsSync(resolvedPath)) {
    return resolvedPath
  }

  if (remainingFiles.length > 0) {
    console.warn(`Configuration file "${currentFile}" not found. Attempting to load: "${remainingFiles[0]}"`)
  }

  return getConfigPath(remainingFiles, baseDir)
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
