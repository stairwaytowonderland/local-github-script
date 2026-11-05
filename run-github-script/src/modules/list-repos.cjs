const {basename} = require('node:path')

console.debug(`\x1b[36mRunning module \x1b[1m${basename(__filename)}\x1b[0;36m...\x1b[0m`)

module.exports = async ({github, context, core, exec, glob, io, getOctokit}) => {
	const {owner, repo} = context.repo
	core.info(`Owner: ${owner}, Repo: ${repo}`)

	const orgName = process.env.ORG || owner

	// 1. Fetch ALL repositories cleanly.
	const archivedRepos = await github.paginate(github.rest.repos.listForOrg, {
		org: orgName,
		per_page: 100,
		type: 'all',
	})

	// 2. Filter and shape your array cleanly in the main block
	const repos = archivedRepos
		.filter(repo => repo.archived && repo.open_issues_count > 0)
		.map(repo => ({
			name: repo.name,
			owner: repo.owner.login,
			org: orgName,
			full_name: repo.full_name,
			html_url: repo.html_url,
			private: repo.private,
			open_issues_count: repo.open_issues_count,
		}))

	core.info(`Successfully fetched ${repos.length} repositories: ${JSON.stringify(repos.map(repo => repo.full_name))}`)
	core.info(`Repositories: ${JSON.stringify(repos)}`)
	// core.info(`Repositories: ${JSON.stringify(repos, null, 2)}`)

	return repos
}
