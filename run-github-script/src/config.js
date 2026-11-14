/**
 * @file Configuration loader for the GitHub Script environment.
 * Handles parsing of YAML configuration files and environment variables.
 *
 * @namespace config
 */

// Ensure the node built-in core path module is imported
// rather than from an external package (e.g. from npm)
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as YAML from 'yaml'
import * as dotenv from 'dotenv'
import * as dotenvExpand from 'dotenv-expand'
import args from './args.js'

const __dirname = import.meta.dirname

/**
 * Loads environment variables from the specified environment file or defaults.
 * @memberof config
 * @param {string} configPath - The path to the YAML configuration file.
 * @returns {ModulesConfig} The parsed configuration object from the YAML file.
 */
export default (configPath => {
  const dotenvConfig = {override: true, debug: true, encoding: 'utf8'}

  const config = YAML.parse(fs.readFileSync(configPath, 'utf8'))

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

  return config
})(getConfigPath() || process.env.CONFIG_PATH)

/**
 * Determines the absolute path to the configuration file.
 *
 * @example
 * const configPath = getConfigPath()
 * console.log(configPath)
 *
 * @memberof config
 * @param {string[]} [configFile] - An array of configuration file paths to attempt to load in order of priority.
 * @throws {Error} If no configuration file is found.
 * @returns {string} The absolute path to the configuration file.
 */
function getConfigPath(configFile = [args.config, 'config.yaml', 'config.sample.yaml']) {
  const [currentFile, ...remainingFiles] = configFile.filter(Boolean)

  if (!currentFile) {
    throw new Error('Configuration file not found.')
  }

  const configPath = path.resolve(__dirname, currentFile)

  if (fs.existsSync(configPath)) {
    return configPath
  }

  if (remainingFiles.length > 0) {
    console.warn(`Configuration file "${currentFile}" not found. Attempting to load: "${remainingFiles[0]}"`)
  }

  return getConfigPath(remainingFiles)
}

/**
 * Options for the module object.
 * @typedef {Object} Module
 * @property {string} name - The name of the module.
 * @property {string} [description] - The description of the module.
 * @property {boolean} [ci=false] - Whether the module should run in CI.
 * @property {string} id - The identifier of the module.
 * @property {string} path - The path to the module file.
 * @property {boolean} [summary=false] - Whether to enable step summary for the module.
 * @property {Record<string, string>} [env] - The list of environment variables used by the module.
 * @property {Record<string, *>} [inputs] - The list of input parameters for the module.
 */

/**
 * Options for the main configuration object.
 * @typedef {Object} ModulesConfig
 * @property {string} name - The name of the configuration.
 * @property {string} description - The description of the configuration.
 * @property {string} module-path - The path to the module file.
 * @property {string} [env-file] - The path to the environment file.
 * @property {boolean} [global-octokit=false] - Whether to use a global Octokit instance for all modules.
 * @property {Module[]} modules - The imported module objects.
 */
