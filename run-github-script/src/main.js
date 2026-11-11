/**
 * @file Main entry point for the GitHub Script runner.
 * It sets up the environment, mocks the GitHub context, instantiates Octokit, and loads the necessary modules.
 */

/**
 * Bootstrap environment variables immediately.
 *
 * ! This must be done before importing any other modules to ensure environment variables are available.
 */
import config from './config.js'

/**
 * Import GitHub `@actions/` modules.
 */
import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {getOctokit, context as githubContext} from '@actions/github'
import * as glob from '@actions/glob'
import * as io from '@actions/io'

/**
 * Import the wrapped require function for module resolution.
 */
import {wrapRequire} from './wrap-require.js'

/**
 * Import the custom module loader.
 */
import modules from './modules.js'

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
 * Mocks the GitHub context for local testing.
 * @returns {GitHubContext} The mocked GitHub context.
 */
function mockContext() {
	const actor = process.env.GITHUB_ACTOR || 'localhost'

	// Mock the context payload
	const mockContext = {
		...githubContext,
		actor: actor,
		eventName: githubContext.eventName || 'push',
		ref: githubContext.ref || 'refs/heads/main',
		sha: githubContext.sha || 'HEAD',
		workflow: githubContext.workflow || 'mock-workflow',
		action: githubContext.action || 'mock-action',
		job: githubContext.job || 'mock-job',
		runAttempt: githubContext.runAttempt || 1,
		runId: githubContext.runId || 1,
		runNumber: githubContext.runNumber || 1,
		issue: githubContext.issue?.number ? {...githubContext.issue} : {}, // { owner, repo, number: 1 },
		repo: {...githubContext.repo},
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

	return mockContext
}

// load({ ...mocks(), core }, config)
// 	.then(() => {
// 		process.exit(0)
// 	})
// 	.catch((err) => {
// 		core.setFailed(err.message)
// 		process.exit(1)
// 	})

/**
 * Runs the main GitHub Script logic with mocked context and modules.
 * Exits the process with code 0 on success and 1 on failure.
 * @async
 * @returns {Promise<void>} Resolves when the script completes successfully.
 */
export async function run() {
	try {
		/**
		 * Retrieve the mocked context for local testing.
		 */
		const context = mockContext()

		/**
		 * Instantiate Octokit using a local Personal Access Token
		 *
		 * Ensure the GITHUB_TOKEN environment variable is set for local testing.
		 */
		const github = getOctokit(process.env.GITHUB_TOKEN)

		console.debug(`Mock context: ${JSON.stringify(context, null, 2)}\n`)
		await modules.load({github, context, core, exec, glob, io, getOctokit, require: wrapRequire}, config)
		process.exit(0)
	} catch (err) {
		core.setFailed(err.message)
		process.exit(1)
	}
}

/**
 * * The default export is the run function.
 */
export default run

/**
 * Represents the structure of the mocked context returned by the `mockContext` function.
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
 * Represents the GitHub Actions context object.
 *
 * Also see: {@link https://github.com/actions/toolkit/blob/main/packages/github/src/context.ts}
 * @category GitHub Context
 * @global
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
 * @category GitHub Context
 * @typedef {Object} IssueContext
 * @property {number} number - The issue number.
 * @property {string} title - The issue title.
 * @property {string} body - The issue body.
 */

/**
 * Represents the context of a repository within the GitHub Actions workflow.
 * @category GitHub Context
 * @typedef {Object} RepositoryContext
 * @property {string} owner - The repository owner.
 * @property {Object} repo - The repository full name.
 */

/**
 * Represents the payload of a GitHub webhook event.
 *
 * Also see: {@link https://github.com/actions/toolkit/blob/main/packages/github/src/interfaces.ts}
 * @category GitHub Context
 * @typedef {Object} WebhookPayload
 * @property {PayloadRepository} repository - The repository associated with the webhook event.
 */

/**
 * Represents the context of a repository within the GitHub Actions workflow.
 * @category GitHub Context
 * @typedef {Object} PayloadRepository
 * @property {string} [full_name] - The full name of the repository (e.g., "owner/repo").
 * @property {string} name - The name of the repository.
 * @property {PayloadRepositoryOwner} owner - The owner of the repository.
 * @property {string} [html_url] - The HTML URL of the repository.
 */

/**
 * Represents the owner of a repository within the GitHub Actions workflow.
 * @category GitHub Context
 * @typedef {Object} PayloadRepositoryOwner
 * @property {string} login - The username of the repository owner.
 * @property {string} [name] - The name of the repository owner.
 */
