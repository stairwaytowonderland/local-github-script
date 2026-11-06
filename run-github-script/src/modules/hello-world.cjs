/**
 * Module to demonstrate a simple "Hello, world!" example in the GitHub Script environment.
 *
 * @module modules/hello-world
 * @category GitHub Script Modules
 * @order -1
 *
 * @async
 * @param {object} GitHubToolkit - The context object containing GitHub script utilities.
 * @param {object} GitHubToolkit.github - The GitHub client.
 * @param {object} GitHubToolkit.context - The GitHub Action context.
 * @param {object} GitHubToolkit.core - The GitHub Actions core module.
 * @param {object} GitHubToolkit.exec - The GitHub Actions exec module.
 * @param {object} GitHubToolkit.glob - The GitHub Actions glob module.
 * @param {object} GitHubToolkit.io - The GitHub Actions io module.
 * @param {function} GitHubToolkit.getOctokit - The function to get an authenticated Octokit instance.
 * @example
 * const message = await require('./hello-world.cjs')({github, context, core, exec, glob, io, getOctokit})
 * console.log(message)
 * @returns {Promise<string>} A greeting message.
 */

const {basename} = require('node:path')

console.debug(`\x1b[36mRunning module \x1b[1m${basename(__filename)}\x1b[0;36m...\x1b[0m`)

module.exports = async ({github, context, core, exec, glob, io, getOctokit}) => {
	const {owner, repo} = context.repo
	core.info(`Repository:\n  Owner: ${owner}\n  Repo: ${repo}`)

	// Example API call
	// const { data: pulls } = await github.rest.pulls.list({
	// 	owner,
	// 	repo,
	// 	state: 'open',
	// })
	// return pulls

	return 'Hello, world!'
}
