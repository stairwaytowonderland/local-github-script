/**
 * Module to demonstrate a simple "Hello, world!" example in the GitHub Script environment.
 *
 * **CommonJS vs. ES Modules:** github-script wraps inline scripts in a CommonJS context,
 * meaning top-level import syntax is not supported. If your external file uses ES Modules
 * (`export default` or `.mjs`), load it with dynamic `await import('./path/to/script.mjs')`
 * rather than `require()`
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
 * const {default: run} = await import('./hello-world.cjs')
 * const result = await run(github, context, core, exec, glob, io, getOctokit)
 * console.log(result)
 * @returns {Promise<string>} A greeting message.
 */

console.debug(`\x1b[36mRunning module \x1b[1m${import.meta.filename.split('/').pop()}\x1b[0;36m...\x1b[0m`)

export default async (github, context, core, exec, glob, io, getOctokit, require) => {
	const {owner, repo} = context.repo
	core.info(`Repository:\n  Owner: ${owner}\n  Repo: ${repo}`)

	const workspace = process.env.GITHUB_WORKSPACE
	core.info(`Workspace: ${workspace}`)

	const count = await require('./src/modules/_require-test.cjs')({github, context, core})
	core.info(`Total issues: ${count}`)

	const summary = `\
**Repository**: ${owner}/${repo}\n
**Workspace**: ${workspace}\n
**Total issues**: ${count}`

	core.summary.addRaw(summary)
	await core.summary.write({overwrite: true})

	// Example API call
	// const { data: pulls } = await github.rest.pulls.list({
	// 	owner,
	// 	repo,
	// 	state: 'open',
	// })
	// return pulls

	return 'Hello, world!'
}
