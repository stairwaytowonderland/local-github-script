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
 * Base directory for configuration files.
 * @private
 * @memberof module:config
 * @type {string}
 * @default '..'
 */
const baseDir = path.resolve(__dirname, '..')

/**
 * Determines the path to the configuration file.
 *
 * Using `getConfigPath()` (with no arguments) will resolve to a path relative to current (src) directory.
 *
 * @private
 * @memberof module:config
 * @type {string}
 * @default 'src/config.yaml' (relative to project directory)
 */
const configPath = process.env.CONFIG_PATH ?? getConfigPath(undefined, baseDir)

/**
 * Determines the log level for the application.
 * @private
 * @memberof module:config
 * @type {string}
 * @default 'info'
 */
const loglevel = level((process.env.LOG_LEVEL ?? cliArgs.level)?.toLowerCase()) ?? 'info'

/**
 * Determines whether debug mode is enabled.
 * @private
 * @memberof module:config
 * @type {boolean}
 * @default false
 */
const debug = process.env.DEBUG === 'true' || (cliArgs.debug && process.env.DEBUG !== 'false')

/**
 * Parsed YAML configuration from the configuration file.
 * @private
 * @memberof module:config
 * @type {YamlConfig}
 */
const yamlConfig = YAML.parse(fs.readFileSync(configPath, 'utf8')) ?? {}

// ! Set the LOG_LEVEL environment variable to the resolved log level.
// This is done to avoid importing args.js multiple times and to ensure the log level is consistently set.
process.env.LOG_LEVEL = loglevel

/**
 * Final dotenv configuration object.
 * @private
 * @property {boolean} override - Whether to override existing environment variables.
 * @property {string} encoding - The encoding to use when reading the .env file.
 */
const dotenvConfig = {override: true, debug: debug, encoding: 'utf8'}

console.debug(`Using dotenv configuration: ${JSON.stringify(dotenvConfig)}`)

if (yamlConfig?.['env-file']) {
  const envPath = path.resolve(yamlConfig['env-file'])
  if (fs.existsSync(envPath)) {
    console.log(`Loading environment variables from: ${envPath}`)
    dotenvExpand.expand(dotenv.config({path: envPath, ...dotenvConfig}))
  } else {
    console.warn(`Environment file "${envPath}" not found. Falling back to default environment variables.`)
    dotenvExpand.expand(dotenv.config(dotenvConfig))
  }
} else {
  console.warn(`No environment file specified. Loading default environment variables.`)
  dotenvExpand.expand(dotenv.config(dotenvConfig))
}

/**
 * Exported configuration object.
 * @namespace {Object} config
 * @memberof module:config
 * @property {Object<string, any>} opts - The normalized configuration options.
 * @property {string} opts.config - The path to the configuration file.
 * @property {boolean} opts.debug - Whether debug mode is enabled.
 * @property {string} opts.level - The log level for the application.
 * @property {Object<string, any>} yaml - The parsed YAML configuration.
 * @property {string} yaml.name - The name of the configuration.
 * @property {string} yaml.description - The description of the configuration.
 * @property {string} yaml."module-path" - The path to the module file.
 * @property {string} [yaml."env-file"] - The path to the environment file.
 * @property {boolean} [yaml."global-octokit"=false] - Whether to use a global Octokit instance for all modules.
 * @property {ModuleConfig[]} yaml.modules - The imported module objects.
 */
export default {
  /**
   * Configuration options for the GitHub Script environment.
   *
   * Provides normalized options derived from environment variables and command-line arguments.
   *
   * @memberof config
   * @type {ConfigOpts}
   */
  opts: {
    /**
     * Determines the path to the configuration file.
     *
     * Using `getConfigPath()` (with no arguments) will resolve to a path relative to current (src) directory.
     *
     * @type {string}
     * @default 'src/config.yaml' (relative to project directory)
     */
    config: configPath,

    /**
     * Determines the log level for the application.
     * @type {string}
     * @default 'info'
     */
    level: loglevel,

    /**
     * Determines whether debug mode is enabled.
     * @type {boolean}
     * @default false
     */
    debug,
  },

  /**
   * Parsed YAML configuration from the configuration file.
   * @memberof config
   * @type {YamlConfig}
   */
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
 * @param {string[]} [configFile=[cliArgs.config, 'src/config.yaml']] - An array of configuration file paths to attempt to load in order of priority.
 * @param {string} [baseDir=path.resolve(__dirname)] - The base directory to resolve configuration file paths against.
 * @throws {Error} If no configuration file is found.
 * @returns {string} The absolute path to the configuration file.
 */
function getConfigPath(configFile = [cliArgs.config, 'src/config.yaml'], baseDir = path.resolve(__dirname)) {
  console.debug(`Attempting to resolve configuration file from: ${configFile}`)
  console.debug(`Base Directory: ${baseDir}`)

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
