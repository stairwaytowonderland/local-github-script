/**
 * @file Configuration loader for the GitHub Script environment.
 * Handles parsing of YAML configuration files and environment variables.
 *
 * @module Config
 * @order 2
 */

// Ensure the node built-in core path module is imported
// rather than from an external package (e.g. from npm)
import * as fs from 'node:fs'
import * as path from 'node:path'
import {fileURLToPath} from 'node:url'
import * as YAML from 'yaml'
import * as dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * The default yaml configuration file name.
 * @constant {string} defaultConfigFileName - The default configuration file name.
 */
const defaultConfigFileName = 'config.yaml'

// Read and parse YAML synchronously during initial module compilation/load

/**
 * Determines the configuration file path based on command-line arguments and environment variables.
 * @type {string}
 */
const configPath = getConfigPath()
/**
 * The absolute path to the configuration file.
 * @type {string}
 */
const fileContents = fs.readFileSync(configPath, 'utf8')
/**
 * The parsed configuration object from the YAML file.
 * @type {Config}
 */
const config = YAML.parse(fileContents)
/**
 * The dotenv configuration options.
 * @type {DotEnvOptions}
 */
const dotenvConfig = {override: true, debug: true}

if (config['env-file']) {
	const envPath = path.resolve(config['env-file'])
	if (fs.existsSync(envPath)) {
		console.log(`Loading environment variables from: ${envPath}`)
		dotenv.config({path: envPath, ...dotenvConfig})
	} else {
		console.warn(`Environment file "${envPath}" not found. Falling back to default environment variables.`)
		dotenv.config(dotenvConfig)
	}
} else {
	console.warn(`No environment file specified. Loading default environment variables.`)
	dotenv.config(dotenvConfig)
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
export {__dirname}

/**
 * @typedef {Object} Config
 * @property {string} [env-file] - The path to the environment file.
 */

/**
 * @typedef {Object} DotEnvOptions
 * @property {boolean} [override] - Whether to override existing environment variables.
 * @property {boolean} [debug] - Whether to enable debug mode.
 */
