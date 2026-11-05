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
