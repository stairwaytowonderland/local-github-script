const {basename} = require('node:path')

console.debug(`\x1b[36mRunning module \x1b[1m${basename(__filename)}\x1b[0;36m...\x1b[0m`)

module.exports = async ({github, context, core, exec, glob, io, getOctokit}) => {
	// Get metadata about the user who owns the token
	// (Retrieve profile details for the currently authenticated user)
	const response = await github.rest.users.getAuthenticated()
	const {data: userMetadata} = response
	core.info(`User:`) // e.g., "The Octocat"
	core.info(`  Login: ${userMetadata.login}`) // e.g., "octocat"
	core.info(`  Public Repos: ${userMetadata.public_repos}`)

	return response
}
