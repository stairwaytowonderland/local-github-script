/**
 * @file Main entry point for the GitHub Script runner.
 * It sets up the environment, mocks the GitHub context, and loads the necessary modules.
 *
 * @module Main
 * @order 1
 */

// MUST BE FIRST: Bootstrap environment variables immediately
import config from './config.js'

const {Octokit} = await import('@octokit/rest')
const {getOctokit, context: githubContext} = await import('@actions/github')
const core = await import('@actions/core')
const exec = await import('@actions/exec')
const glob = await import('@actions/glob')
const io = await import('@actions/io')
const {default: load} = await import('./modules.js')

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
 * Mocks the GitHub context and Octokit instance for local testing.
 * @returns {Mocks} The mocked GitHub context and Octokit instance.
 */
const mocks = () => {
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

	// Instantiate Octokit using a local Personal Access Token
	const github = new Octokit({
		auth: process.env.GITHUB_TOKEN, // Ensure this env variable is set locally
	})

	return {
		github,
		context: mockContext,
	}
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
 */
export const run = async () => {
	try {
		const {github, context} = mocks()
		console.debug(`Mock context: ${JSON.stringify(context, null, 2)}`)
		let exec, glob, io
		;({'@actions/exec': exec, '@actions/glob': glob, '@actions/io': io} = await loadAdvancedModules())
		await load({github, context, core, exec, glob, io, getOctokit}, config)
		process.exit(0)
	} catch (err) {
		core.setFailed(err.message)
		process.exit(1)
	}
}

export default run

/**
 * Dynamically loads advanced GitHub Actions modules if they are not already available.
 * @returns {Promise<AdvancedModules>} The loaded advanced modules.
 */
async function loadAdvancedModules() {
	const {dynamicModules} = await import('./utils.cjs')
	return dynamicModules(
		['@actions/exec', typeof exec !== 'undefined' ? exec : undefined],
		['@actions/glob', typeof glob !== 'undefined' ? glob : undefined],
		['@actions/io', typeof io !== 'undefined' ? io : undefined],
	)
}

/**
 * @typedef {Object} AdvancedModules
 * @property {Object} exec - The GitHub Actions exec module.
 * @property {Object} glob - The GitHub Actions glob module.
 * @property {Object} io - The GitHub Actions io module.
 */

/**
 * @typedef {Object} Mocks
 * @property {Octokit} github - The mocked Octokit instance.
 * @property {Object} context - The mocked GitHub context.
 */

/**
 * @typedef {Object} GitHubContext
 * Represents the GitHub Actions context object.
 * @property {string} [actor] - The username of the user that triggered the workflow.
 * @property {string} [eventName] - The name of the webhook event that triggered the workflow.
 * @property {string} [ref] - The git ref that triggered the workflow.
 * @property {string} [sha] - The commit SHA that triggered the workflow.
 * @property {string} [workflow] - The name of the workflow.
 * @property {string} [action] - The name of the action currently running.
 * @property {string} [job] - The ID of the current job.
 * @property {number} [runAttempt] - The run attempt number.
 * @property {number} [runId] - The run ID.
 * @property {number} [runNumber] - The run number.
 * @property {IssueContext} [issue] - The issue context, if applicable.
 * @property {RepositoryContext} [repo] - The repository context.
 * @property {EventPayload} [payload] - The webhook payload.
 */

/**
 * @typedef {Object} EventPayload
 * @property {RepositoryContext} [repository] - The repository context.
 */

/**
 * @typedef {Object} IssueContext
 * @property {number} [number] - The issue number.
 * @property {string} [title] - The issue title.
 * @property {string} [body] - The issue body.
 */
/**
 * @typedef {Object} RepositoryContext
 * @property {string} [name] - The repository name.
 * @property {string} [owner] - The repository owner.
 */
/**
 * @typedef {Object} PullRequestContext
 * @property {number} [number] - The pull request number.
 * @property {string} [title] - The pull request title.
 * @property {string} [body] - The pull request body.
 */
/**
 * @typedef {Object} SenderContext
 * @property {string} [login] - The username of the sender.
 */
