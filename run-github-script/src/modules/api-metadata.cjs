const {basename} = require('node:path')

console.debug(`\x1b[36mRunning module \x1b[1m${basename(__filename)}\x1b[0;36m...\x1b[0m`)

module.exports = async ({github, context, core, exec, glob, io, getOctokit}) => {
	// Get API metadata (like allowed scopes or GitHub Action IP ranges)
	// (Retrieve general metadata like hypermedia links to various API services)
	const response = await github.request('GET /')
	const {headers} = response
	core.info(`Scopes: ${headers['x-oauth-scopes']}`)
	core.info(`Rate Limit:`)
	core.info(`  Used: ${headers['x-ratelimit-used']}`)
	core.info(`  Remaining: ${headers['x-ratelimit-remaining']}`)
	core.info(`  Total: ${headers['x-ratelimit-limit']}`)
	core.info(`  Reset: ${new Date(headers['x-ratelimit-reset'] * 1000).toLocaleString()})`)

	return response
}
