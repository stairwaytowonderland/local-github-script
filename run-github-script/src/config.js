/**
 * @file Configuration loader for the GitHub Script environment.
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

const __dirname = import.meta.dirname

/**
 * The default yaml configuration file name.
 * @constant {string} defaultConfigFileName - The default configuration file name.
 */
const defaultConfigFileName = 'config.sample.yaml'

// Read and parse YAML synchronously during initial module compilation/load

/**
 * Uses {@link getConfigPath} to determine the configuration file path based on command-line arguments and environment variables.
 * @type {string}
 */
const configPath = getConfigPath()

/**
 * The parsed YAML configuration object (See {@link ModulesYAMLConfig}).
 * @type {ModulesYAMLConfig}
 */
const config = YAML.parse(fs.readFileSync(configPath, 'utf8'))

/**
 * The dotenv configuration options (See {@link DotEnvOptions}).
 * @type {DotEnvOptions}
 */
const dotenvConfig = {override: true, debug: true, encoding: 'utf8'}

if (config?.['env-file']) {
  const envPath = path.resolve(config?.['env-file'])
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
 * Parses command-line arguments to determine the configuration file path.
 * @returns {string} The configuration file path.
 */
function parseArgs() {
  const configIndex = process.argv.indexOf('--config')
  if (configIndex !== -1 && configIndex + 1 < process.argv.length) {
    return process.argv[configIndex + 1]
  }
  return process.env.CONFIG || defaultConfigFileName
}

/**
 * Determines the absolute path to the configuration file.
 * @returns {string} The absolute path to the configuration file.
 */
function getConfigPath() {
  const configFileName = parseArgs()
  let configPath = path.resolve(__dirname, configFileName)
  if (!fs.existsSync(configPath)) {
    console.warn(
      `Configuration file "${configFileName}" not found. Attempting to load default: "${defaultConfigFileName}"`,
    )
    configPath = path.resolve(__dirname, defaultConfigFileName)
  }
  if (!fs.existsSync(configPath)) {
    throw new Error('Configuration file not found.')
  }
  return configPath
}

export default config

/**
 * Options for configuring dotenv behavior.
 * @category Configuration
 * @global
 * @typedef {Object} DotEnvOptions
 * @property {boolean} [override=false] - Whether to override existing environment variables.
 * @property {boolean} [debug=false] - Whether to enable debug mode.
 */

/**
 * Options for the module object.
 * @category Configuration
 * @global
 * @typedef {Object} Module
 * @property {string} name - The name of the module.
 * @property {string} [description] - The description of the module.
 * @property {boolean} [ci=false] - Whether the module should run in CI.
 * @property {string} id - The identifier of the module.
 * @property {string} path - The path to the module file.
 * @property {boolean} [step-summary=false] - Whether to enable step summary for the module.
 * @property {array} [env] - The list of environment variables used by the module.
 * @property {array} [inputs] - The list of input parameters for the module.
 */

/**
 * Options for the main configuration object.
 * @category Configuration
 * @global
 * @typedef {Object} ModulesYAMLConfig
 * @property {string} name - The name of the configuration.
 * @property {string} description - The description of the configuration.
 * @property {string} module-path - The path to the module file.
 * @property {string} [env-file] - The path to the environment file.
 * @property {boolean} [global-octokit=false] - Whether to use a global Octokit instance for all modules.
 * @property {Module[]} modules - The imported module objects.
 */
