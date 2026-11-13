/**
 * @file Main entry point for the GitHub Script runner.
 * It sets up the environment, mocks the GitHub context, instantiates Octokit, and loads the necessary modules.
 *
 * @module main
 */

/**
 * Node.js path module for handling and transforming file paths.
 */
import * as path from 'node:path'

/**
 * Import GitHub `@actions/` modules.
 */
import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {getOctokit, context as githubContext} from '@actions/github'
import * as glob from '@actions/glob'
import * as io from '@actions/io'

/**
 * Bootstrap environment variables immediately.
 *
 * ! This must be done before importing any other custom modules to ensure environment variables are available.
 */
import config from './config.js'

/**
 * Import the wrapped require function for module resolution.
 */
import {wrapRequire} from './wrap-require.js'

/**
 * Import the custom module loader.
 */
import modules from './modules.js'

const __dirname = import.meta.dirname

let owner, repo

if (process.env.GITHUB_REPOSITORY) {
  ;[owner, repo] = process.env.GITHUB_REPOSITORY.split('/')
} else if (process.env.REPO_OWNER && process.env.REPO_NAME) {
  owner = process.env.REPO_OWNER
  repo = process.env.REPO_NAME
}

if (!owner || !repo) {
  core.setFailed(
    `Either \x1b[1m'GITHUB_REPOSITORY'\x1b[0m \x1b[2m(owner/repo)\x1b[0m or \x1b[1m'REPO_OWNER'\x1b[0m + \x1b[1m'REPO_NAME'\x1b[0m variables must be set.`,
  )
  process.exit(1)
}

/**
 * Represents the mocked GitHub [context]{@link GitHubContext} for local testing.
 * @type {GitHubContext}
 */
let context

if (process.env.CI) {
  context = githubContext
} else {
  const mockContext = {
    actor: githubContext.actor || 'localhost',
    eventName: 'push',
    ref: 'refs/heads/main',
    sha: githubContext.sha || 'HEAD',
    workflow: 'mock-workflow',
    action: 'mock-action',
    job: 'mock-job',
    runAttempt: 1,
    runId: 1,
    runNumber: 1,
    issue: githubContext.issue?.number ? {...githubContext.issue} : {}, // { owner, repo, number: 1 }
    repo: githubContext.repo ? {...githubContext.repo} : {owner, repo}, // { owner, repo } (also derived from GITHUB_REPOSITORY if available, which is why referencing githubContext.repo is safe)
    payload: {
      repository: {
        owner: {
          login: owner,
          name: owner,
        },
        name: repo,
        full_name: `${owner}/${repo}`,
        html_url: `https://github.com/${owner}/${repo}`,
      },
    },
  }

  context = {...githubContext, ...mockContext}
}

/**
 * Runs the main GitHub Script logic with mocked context and modules.
 * Exits the process with code 0 on success and 1 on failure.
 * @async
 * @returns {Promise<void>} Resolves when the script completes successfully.
 * @example
 * ```js
 * import {run} from './main.js'
 * run()
 * ```
 */
export async function run() {
  try {
    if (process.env.CI) {
      console.debug(`GitHub Context: ${JSON.stringify(context, null, 2)}\n`)
    }
    await loadModules(config)
    process.exit(0)
  } catch (err) {
    core.setFailed(err.message)
    process.exit(1)
  }
}

/**
 * Loads custom modules based on the provided configuration.
 * @async
 * @param {ModulesYAMLConfig} config - The configuration object containing module details.
 * @returns {Promise<void>} Resolves when all modules are loaded successfully.
 * @throws {Error} Throws an error if module loading fails.
 * @example
 * ```js
 * await loadModules(config)
 * ```
 */
async function loadModules(config) {
  try {
    const isCI = Boolean(process.env.CI)
    const initOctokit = isCI || Boolean(config?.['global-octokit'])
    const token = process.env.GITHUB_TOKEN

    if (initOctokit && !token) {
      throw new Error('GITHUB_TOKEN environment variable is required to initialize Octokit.')
    }

    if (initOctokit) {
      console.debug(`Initializing Octokit (CI: ${isCI}, Actor: @${context.actor})`)
    } else {
      console.debug('Global Octokit: not enabled')
    }

    /**
     * 'github' needs to be the first key when present, so the .apply() works (see ModuleLoader::load()).
     */
    const toolkit = {
      ...(initOctokit ? {github: getOctokit(token)} : {}),
      context,
      core,
      exec,
      glob,
      io,
      getOctokit,
      require: wrapRequire,
    }

    console.log(`Loading custom modules for: ${config.name}\n`)

    for (const m of config.modules) {
      console.debug(`Loading module: ${m.name}`)
      console.debug(`Module path: ${m.path}`)

      const absoluteModulePath = path.resolve(__dirname, config['module-path'], m.path)
      const module = new modules(m, absoluteModulePath)
      await module.load(toolkit)
    }
  } catch (error) {
    console.error('Error loading configuration or modules:', error)
    throw error
  }
}

/**
 * Represents the GitHub Actions context object.
 *
 * Also see: {@link https://github.com/actions/toolkit/blob/main/packages/github/src/context.ts}
 * @global
 * @category GitHub Context
 * @typedef {Object} GitHubContext
 * @property {WebhookPayload} payload - The webhook payload.
 * @property {string} eventName - The name of the webhook event that triggered the workflow.
 * @property {string} sha - The commit SHA that triggered the workflow.
 * @property {string} ref - The git ref that triggered the workflow.
 * @property {string} workflow - The name of the workflow.
 * @property {string} action - The name of the action currently running.
 * @property {string} actor - The username of the user that triggered the workflow.
 * @property {string} job - The ID of the current job.
 * @property {number} runAttempt - The run attempt number.
 * @property {number} runId - The run ID.
 * @property {number} runNumber - The run number.
 * @property {IssueContext} issue - The issue context, if applicable.
 * @property {RepositoryContext} repo - The repository context.
 */

/**
 * Represents the context of an issue within the GitHub Actions workflow.
 * @global
 * @category GitHub Context
 * @typedef {Object} IssueContext
 * @property {number} number - The issue number.
 * @property {string} title - The issue title.
 * @property {string} body - The issue body.
 */

/**
 * Represents the context of a repository within the GitHub Actions workflow.
 * @global
 * @category GitHub Context
 * @typedef {Object} RepositoryContext
 * @property {string} owner - The repository owner.
 * @property {Object} repo - The repository full name.
 */

/**
 * Represents the payload of a GitHub webhook event.
 *
 * Also see: {@link https://github.com/actions/toolkit/blob/main/packages/github/src/interfaces.ts}
 * @global
 * @category GitHub Context
 * @typedef {Object} WebhookPayload
 * @property {PayloadRepository} repository - The repository associated with the webhook event.
 */

/**
 * Represents the context of a repository within the GitHub Actions workflow.
 * @global
 * @category GitHub Context
 * @typedef {Object} PayloadRepository
 * @property {string} [full_name] - The full name of the repository (e.g., "owner/repo").
 * @property {string} name - The name of the repository.
 * @property {PayloadRepositoryOwner} owner - The owner of the repository.
 * @property {string} [html_url] - The HTML URL of the repository.
 */

/**
 * Represents the owner of a repository within the GitHub Actions workflow.
 * @global
 * @category GitHub Context
 * @typedef {Object} PayloadRepositoryOwner
 * @property {string} login - The username of the repository owner.
 * @property {string} [name] - The name of the repository owner.
 */
