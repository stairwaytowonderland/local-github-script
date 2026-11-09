/**
 * Module loader for the GitHub Script environment.
 * Handles dynamic loading and execution of custom modules based on configuration.
 *
 * @module ModuleLoader (Modules)
 */

import * as path from 'node:path'
import {realpathSync} from 'node:fs'
import {pathToFileURL} from 'node:url'
import {initStepSummary} from './step-summary.js'
import {kebabToCamel} from './utils.js'

const __dirname = import.meta.dirname

/**
 * Represents a dynamically loaded module with its configuration and environment.
 */
export default class ModuleLoader {
	/**
	 * Loads custom modules based on the provided configuration.
	 * @param {Object} dependencies - The standard GitHub Script dependencies required by the modules.
	 * @param {Object} config - The configuration object containing module details.
	 */
	static load = async (defaultArgs, config) => {
		try {
			console.log(`Loading custom modules for: ${config.name}\n`)

			for (const m of config.modules) {
				const absoluteModulePath = path.resolve(__dirname, config['module-path'], m.path)
				const module = new ModuleLoader(m, absoluteModulePath)
				await module.loadModule(defaultArgs)
			}
		} catch (error) {
			console.error('Error loading configuration or modules:', error)
		}
	}

	/**
	 * Constructs a new Module instance.
	 *
	 * @param {ModuleConfig} moduleConfig - The configuration object for the module.
	 * @param {string} modulePath - The absolute path to the module file.
	 */
	constructor(moduleConfig, modulePath) {
		/**
		 * The name of the module.
		 * @type {string}
		 */
		this.name = moduleConfig.name

		/**
		 * The ID of the module.
		 * @type {string}
		 */
		this.id = moduleConfig.id

		/**
		 * The input parameters for the module.
		 * @type {Record<string, *>}
		 */
		this.inputs = moduleConfig.inputs

		/**
		 * The environment variables for the module.
		 * @type {Record<string, string>}
		 */
		this.env = moduleConfig.env

		/**
		 * The absolute path to the module file.
		 * @type {string}
		 */
		this.modulePath = path.resolve(realpathSync(modulePath))
	}

	get moduleCamelId() {
		return kebabToCamel(this.id)
	}

	get summaryPath() {
		const moduleFileWithoutExt = path.basename(this.modulePath, path.extname(this.modulePath))

		// Resolve path safely using CommonJS __dirname
		// const summaryPath = path.resolve(__dirname, `./.${moduleFileWithoutExt}-step-summary.md`)
		const summaryPath = path.resolve(path.dirname(this.modulePath), `./.${moduleFileWithoutExt}-step-summary.md`)
		return summaryPath
	}

	get workspacePath() {
		return path.resolve(realpathSync(process.env.GITHUB_WORKSPACE))
	}

	/**
	 * Injects the module configuration into `process.env`, dynamically imports
	 * the module file, runs its default export, and cleans up the environment.
	 *
	 * @param {GitHubToolkit} toolkit - The GitHub Actions toolkit containing utilities.
	 * @returns {Promise<void>}
	 */
	async loadModule(defaultArgs) {
		const workspacePath = this.workspacePath + '/'

		console.debug(
			[
				`\x1b[0;35mModule:\x1b[0m \x1b[1;35m${this.name}\x1b[0m`,
				`\x1b[0;35mID:\x1b[0m \x1b[1;35m${this.id}\x1b[0m`,
				`\x1b[0;35mCamel ID:\x1b[0m \x1b[1;35m${this.moduleCamelId}\x1b[0m`,
				`\x1b[0;35mWorkspace Path:\x1b[0m \x1b[1;35m${this.workspacePath}\x1b[0m`,
				`\x1b[0;35mModule Path:\x1b[0m \x1b[1;35m${this.modulePath.slice(workspacePath.length)}\x1b[0m`,
				`\x1b[0;35mSummary Path:\x1b[0m \x1b[1;35m${this.summaryPath.slice(workspacePath.length)}\x1b[0m`,
			].join('\n'),
		)

		const module = this
		const absoluteModulePath = module.modulePath
		const moduleUrl = pathToFileURL(absoluteModulePath)

		// Dynamically import the module and destructure 'default' as 'run'
		const {default: run} = await import(moduleUrl)

		// Keep track of dynamically modified env keys and their prior values for perfect cleanup
		const activeEnvKeys = []
		const fallbackEnvValues = {}

		// Process Inputs Block: INPUT_<uppercase>
		if (module.inputs && typeof module.inputs === 'object') {
			for (const [key, value] of Object.entries(module.inputs)) {
				const envKey = `INPUT_${key.toUpperCase()}`
				// Save fallback state if it already existed in process.env
				if (Object.prototype.hasOwnProperty.call(process.env, envKey)) {
					fallbackEnvValues[envKey] = process.env[envKey]
				}
				process.env[envKey] = String(value)
				activeEnvKeys.push(envKey)
			}
		}

		// Process Env Overrides Block: Exact key match
		if (module.env && typeof module.env === 'object') {
			for (const [key, value] of Object.entries(module.env)) {
				// Save fallback state to protect global/dotenv configurations from permanent mutation
				if (
					Object.prototype.hasOwnProperty.call(process.env, key) &&
					!Object.prototype.hasOwnProperty.call(fallbackEnvValues, key)
				) {
					fallbackEnvValues[key] = process.env[key]
				}
				process.env[key] = String(value)
				activeEnvKeys.push(key)
			}
		}

		// Helper function to safely restore environment state
		const cleanupEnvironment = () => {
			for (const envKey of activeEnvKeys) {
				if (Object.prototype.hasOwnProperty.call(fallbackEnvValues, envKey)) {
					process.env[envKey] = fallbackEnvValues[envKey]
				} else {
					delete process.env[envKey]
				}
			}
		}

		// Verify it's a function before calling it
		if (typeof run === 'function') {
			initStepSummary.call(this)

			await run
				.apply(module, Object.values(defaultArgs))
				.then(result =>
					console.log(
						`\n\x1b[1;92m"${module.name}" succeeded results ...\x1b[0m\n"${module.id || module.name}":`,
						result,
						`\n`,
					),
				)
				.catch(err =>
					console.error(
						`\n\x1b[1;91m"${module.name}" failed results ...\x1b[0m\n"${module.id || module.name}":`,
						err,
						`\n`,
					),
				)
				.finally(() => {
					cleanupEnvironment(activeEnvKeys)
				})
		} else {
			cleanupEnvironment(activeEnvKeys)
			console.error(`Error: "${module.id || module.name}" does not export a default function.`)
		}
	}
}

/**
 * @typedef {Object} GitHubToolkit
 * @property {Object} github - Pre-authenticated octokit client.
 * @property {Object} context - The workflow run context.
 * @property {Object} core - Actions core task library.
 * @property {Object} exec - Actions exec tool utilities.
 * @property {Object} glob - Actions glob tool utilities.
 * @property {Object} io - Actions core I/O utilities.
 * @property {Function} getOctokit - Returns an authenticated Octokit client.
 */

/**
 * @typedef {Object} ModuleConfig
 * @property {string} name - The user-friendly name of the module.
 * @property {string} id - Unique identifier for the module block.
 * @property {string} path - The relative file path to the target module executable.
 * @property {Record<string, *>} [inputs] - Input options mapping to standard action `INPUT_` parameters.
 * @property {Record<string, string>} [env] - Custom environment overrides injected into `process.env`.
 */
