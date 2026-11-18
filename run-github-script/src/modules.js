/**
 * Exports the [Module](./modules/module) class for dynamically loading and managing custom modules in the GitHub Script environment.
 *
 * @module modules
 */

import {getOctokit} from '@actions/github'
import * as path from 'node:path'
import {realpathSync} from 'node:fs'
import {pathToFileURL} from 'node:url'
import {initStepSummary} from './step-summary.js'
import {kebabToCamel} from './utils.js'

/**
 * Module loader for the GitHub Script environment.
 *
 * Handles dynamic loading and execution of custom modules based on configuration.
 *
 * For full compatibility, implement each property defined in the {@link ModuleConfig} interface (the module configuration object in the `YAML` file).
 *
 * See [Module](/module/modules/module) for more details.
 *
 * @implements {ModuleConfig}
 */
export class Module {
  /**
   * The ID of the module.
   * @type {string}
   */
  id
  /**
   * The name of the module.
   * @type {string}
   */
  name
  /**
   * The description of the module.
   * @type {string}
   */
  description
  /**
   * Whether the module should run in CI.
   * @type {boolean}
   */
  ci
  /**
   * The input parameters for the module.
   * @type {Object<string, *>}
   */
  inputs
  /**
   * The environment variables for the module.
   * @type {Object<string, string>}
   */
  env
  /**
   * The absolute path to the module file.
   * @type {string}
   */
  path
  /**
   * Whether to enable step summary for the module.
   * @type {boolean}
   */
  summary

  /**
   * Constructs a new Module instance.
   *
   * @param {ModuleConfig} moduleConfig - The configuration object for the module.
   * @param {string} modulePath - The absolute path to the module file.
   */
  constructor(moduleConfig, modulePath) {
    /**
     * The ID of the module.
     * @type {string}
     */
    this.id = moduleConfig.id

    /**
     * The name of the module.
     * @type {string}
     */
    this.name = moduleConfig.name

    /**
     * The description of the module.
     * @type {string}
     */
    this.description = moduleConfig?.description

    /**
     * Whether the module should run in CI.
     * @type {boolean}
     */
    this.ci = moduleConfig?.ci == true

    /**
     * The input parameters for the module.
     * @type {Object<string, *>}
     */
    this.inputs = moduleConfig?.inputs

    /**
     * The environment variables for the module.
     * @type {Object<string, string>}
     */
    this.env = moduleConfig?.env

    /**
     * The absolute path to the module file.
     * @type {string}
     */
    this.path = path.resolve(realpathSync(modulePath))

    /**
     * Whether to enable step summary for the module.
     * @type {boolean}
     */
    this.summary = moduleConfig?.summary == true
  }

  /**
   * The camel-cased ID of the module.
   * @readonly
   * @type {string}
   */
  get moduleCamelId() {
    return kebabToCamel(this.id)
  }

  /**
   * The path to the step summary file for the module.
   * @readonly
   * @type {string}
   */
  get summaryPath() {
    const moduleFileWithoutExt = path.basename(this.path, path.extname(this.path))

    // Resolve path safely using CommonJS __dirname
    // const summaryPath = path.resolve(__dirname, `./.${moduleFileWithoutExt}-step-summary.md`)
    const summaryPath = path.resolve(path.dirname(this.path), `./.${moduleFileWithoutExt}-step-summary.md`)
    return summaryPath
  }

  /**
   * The absolute path to the workspace directory.
   * @readonly
   * @type {string}
   */
  get workspacePath() {
    return path.resolve(realpathSync(process.env.GITHUB_WORKSPACE))
  }

  /**
   * An authenticated [Octokit]{@link Octokit} client.
   * @readonly
   * @type {Octokit|undefined}
   */
  get github() {
    console.debug(`\x1b[0;33mModule initializing GitHub client with token\x1b[0m`)
    return process.env.GITHUB_TOKEN ? getOctokit(process.env.GITHUB_TOKEN) : undefined
  }

  /**
   * Injects the module configuration into `process.env`, dynamically imports
   * the module file, runs its default export, and cleans up the environment.
   *
   * @example
   * const module = new Module(moduleConfig, modulePath)
   * await module.load(toolkit)
   *
   * @async
   * @param {GitHubToolkit} toolkit - The GitHub Actions toolkit.
   * @returns {Promise<void>}
   */
  async load(toolkit) {
    const workspacePath = this.workspacePath + '/'

    console.debug(
      [
        `\x1b[0;35mModule:\x1b[0m \x1b[1;35m${this.name}\x1b[0m`,
        `\x1b[0;35mID:\x1b[0m \x1b[1;35m${this.id}\x1b[0m`,
        `\x1b[0;35mCamel ID:\x1b[0m \x1b[1;35m${this.moduleCamelId}\x1b[0m`,
        `\x1b[0;35mWorkspace Path:\x1b[0m \x1b[1;35m${this.workspacePath}\x1b[0m`,
        `\x1b[0;35mModule Path:\x1b[0m \x1b[1;35m${this.path.slice(workspacePath.length)}\x1b[0m`,
        `\x1b[0;35mSummary Path:\x1b[0m \x1b[1;35m${this.summaryPath.slice(workspacePath.length)}\x1b[0m`,
      ].join('\n'),
    )

    const module = this
    const absoluteModulePath = module.path
    const moduleUrl = pathToFileURL(absoluteModulePath)

    // Dynamically import the module and retrieve its default export as 'run'
    const run = (await import(moduleUrl)).default

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
      initStepSummary.call(this, this.summaryPath, this.summary)

      /**
       * Calls the module's default export function with the appropriate toolkit arguments.
       * //
       * The toolkit object is reordered before being passed as arguments (using `.apply()`) to the module's default export
       * //to ensure consistent key order. See {@link reorderKeys} for the key reordering logic.
       * //
       * See the [official documentation]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply}
       * //for more information about using {@link Function.prototype.apply}.
       */
      await run
        /*.apply(
          module,
          Object.values(
            reorderKeys(toolkit?.github ? toolkit : {github: this.github, ...toolkit}, [
              'github',
              // 'context',
              // 'core',
              // 'exec',
              // 'glob',
              // 'io',
              // 'getOctokit',
              // 'require',
            ]),
          ),
        )*/
        .call(
          module,
          toolkit?.github ?? this.github,
          toolkit.context,
          toolkit.core,
          toolkit.exec,
          toolkit.glob,
          toolkit.io,
          toolkit.getOctokit,
          toolkit.require,
        )
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
 * @typedef {Object} Octokit
 * @see https://github.com/octokit/core.js/blob/main/src/index.ts
 */

/**
 * Represents the GitHub Actions toolkit passed to modules.
 *
 * Also see: {@link https://github.com/actions/github-script#this-action}
 *
 * @typedef {Object} GitHubToolkit
 * @property {Octokit|undefined} [github] - Pre-authenticated [octokit/rest.js]{@link https://github.io} client.
 * @property {GitHubContext} context - The workflow run [context]{@link https://github.com}.
 * @property {Object} core - Actions [core]{@link https://github.com} task library.
 * @property {Object} exec - Actions [exec]{@link https://github.com} tool utilities.
 * @property {Object} glob - Actions [glob]{@link https://github.com} tool utilities.
 * @property {Object} io - Actions [io]{@link https://github.com} core I/O utilities.
 * @property {Function} getOctokit - A factory function to create additional authenticated [Octokit]{@link https://github.com} clients with different tokens (see [Creating additional clients]{@link https://github.com}).
 * @property {Function} require - The CommonJS require wrapper for importing modules.
 */
