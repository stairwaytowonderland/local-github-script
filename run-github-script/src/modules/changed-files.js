/**
 * Module to determine changed files in a GitHub repository.
 * Handles ignore events, shallow clone fallbacks, and glob pattern filtering.
 *
 * @module modules/changed-files
 * @category GitHub Script Modules
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
 * @returns {Promise<boolean>} Indicates whether processing was skipped due to ignore events.
 */

console.debug(`\x1b[36mRunning module \x1b[1m${import.meta.filename.split('/').pop()}\x1b[0;36m...\x1b[0m`)

export default async (github, context, core, exec, glob, io, getOctokit, require) => {
	// Require the minimatch package for glob pattern matching
	const {minimatch} = await import('minimatch')

	// Reusable input tokenizer to safely split environment variables by commas, spaces, or lines
	const parseInput = name =>
		(core.getInput(name) || '')
			.split(/[\r\n\s]+|,(?![^{]*})/) // Splits on spaces/newlines, or commas NOT inside {}
			.map(p => p.trim())
			.filter(Boolean)

	// * 1. Evaluate Ignore Events Condition
	const ignoreEvents = parseInput('ignore-events')
	const eventIsIgnored = ignoreEvents.includes(context.eventName)

	if (eventIsIgnored) {
		core.info(`Event '${context.eventName}' matches ignore configuration. Skipping processing.`)
		core.setOutput('changed-files', '')
		core.setOutput('changed-files-filtered', '')
		return false
	}

	// * 2. Determine Changed Files Safely with Shallow Clone Fallbacks
	let diffOutput = ''
	const isTag = process.env.GITHUB_REF && process.env.GITHUB_REF.startsWith('refs/tags/')
	const refBefore = context.payload.before
	const nullSha = '0000000000000000000000000000000000000000'

	// Determine strategy arguments upfront
	let gitDiffArgs = ['diff', '--name-only', refBefore, context.payload.after]
	if (isTag) {
		core.info('Tag push event identified. Parsing target commit structural changes.')
		gitDiffArgs = ['diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD']
	} else if (!refBefore || refBefore === nullSha) {
		core.info('New branch tree push identified. Dynamically evaluating fork boundary points.')

		let branchName = process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME || ''
		if (!branchName) {
			try {
				const branchResult = await exec.getExecOutput('git', ['branch', '--show-current'])
				branchName = branchResult.stdout.trim()
			} catch (branchErr) {
				core.info(`Failed to auto-detect current git branch: ${branchErr.message}`)
			}
		}

		core.info(`Determined branch name: ${branchName}`)

		try {
			const mergeBaseResult = await exec.getExecOutput('git', ['merge-base', `origin/${branchName}`, 'HEAD'])
			const baseCommit = mergeBaseResult.stdout.trim()
			gitDiffArgs = ['diff', '--name-only', baseCommit, 'HEAD']
		} catch {
			gitDiffArgs = null // Force fallback to git show if merge-base fails
		}
	}

	// Execute diff strategy, with a unified fallback to git show for shallow clones
	try {
		if (!gitDiffArgs) throw new Error('Forcing fallback execution strategy.')
		const diffResult = await exec.getExecOutput('git', gitDiffArgs)
		diffOutput = diffResult.stdout
	} catch (err) {
		core.info(
			`Primary Git tracking strategy failed or history is shallow. Falling back to git show. Details: ${err.message}`,
		)
		try {
			const fallbackResult = await exec.getExecOutput('git', ['show', '--name-only', '--pretty=', 'HEAD'])
			diffOutput = fallbackResult.stdout
		} catch (fallbackErr) {
			core.info(`Fallback git show strategy failed completely: ${fallbackErr.message}`)
		}
	}

	const changedFilesList = diffOutput
		.split('\n')
		.map(f => f.trim())
		.filter(Boolean)

	core.info(`Detected Changed Files: ${changedFilesList.join(', ')}`)

	// * 3. Process Glob Path Matches
	// A bulletproof tokenizer that handles GitHub Actions env/input line variations cleanly
	const parsePathsInput = name => {
		const rawInput = core.getInput(name) || ''
		// Split purely by newlines, carriage returns, or commas outside braces
		return (
			rawInput
				.split(/[\r\n]+|,(?![^{]*})/)
				.map(p => p.trim())
				// Filter out empty lines, comments, and handle space-separated squashing from runner envs
				.flatMap(p => (p.includes(' ') && !p.startsWith('!') ? p.split(/\s+/) : p))
				.map(p => p.trim())
				.filter(Boolean)
		)
	}

	const inputPaths = parsePathsInput('specified-paths')
	core.info(`Specified Path Patterns: ${inputPaths.join(', ')}`)

	const onlySpecifiedPaths = core.getBooleanInput('only-specified-paths')
	core.info(`Only Specified Paths Enforcement: ${onlySpecifiedPaths}`)

	let filteredFilesList = []

	if (inputPaths.length > 0 && changedFilesList.length > 0) {
		// Separate patterns cleanly into explicit inclusion and exclusion groups
		const exclusions = inputPaths.filter(p => p.startsWith('!'))
		const inclusions = inputPaths.filter(p => !p.startsWith('!'))

		filteredFilesList = changedFilesList.filter(file => {
			// 1. Must match at least one inclusion pattern (or default to true if none specified)
			const matchesInclusion =
				inclusions.length === 0 || inclusions.some(pattern => minimatch(file, pattern, {dot: true}))

			// 2. Must NOT match any exclusion patterns
			// Slide the index by 1 to strip the '!' cleanly regardless of environmental spaces
			const matchesExclusion = exclusions.some(pattern => {
				const cleanPattern = pattern.startsWith('!') ? pattern.slice(1).trim() : pattern
				return minimatch(file, cleanPattern, {dot: true})
			})

			const result = matchesInclusion && !matchesExclusion

			return result
		})

		// if onlySpecifiedPaths is true, the filteredFilesList must match only the changedFilesList
		if (onlySpecifiedPaths) {
			core.debug(`Only specified paths enforcement is enabled.`)
			const unmatchedFiles = changedFilesList.filter(file => !filteredFilesList.includes(file))
			if (unmatchedFiles.length > 0) {
				core.info(`Files not matching specified paths: ${unmatchedFiles.join(', ')}`)
				filteredFilesList = []
			}
		}

		core.info(`Files Matching Path Patterns: ${filteredFilesList.join(', ')}`)
	} else {
		core.info('No explicit path patterns provided or changed file list is empty.')
	}

	// * 4. Validate Commit Author Authority
	let authorIsAllowed = true
	const ignoreAuthors = parseInput('ignore-authors')

	if (ignoreAuthors.length > 0) {
		try {
			const authorResult = await exec.getExecOutput('git', ['log', '-1', '--pretty=format:%an'])
			const commitAuthor = authorResult.stdout.trim()
			core.info(`Commit authored by: '${commitAuthor}'`)
			if (ignoreAuthors.includes(commitAuthor)) {
				core.info(`Commit author '${commitAuthor}' matches ignore criteria.`)
				authorIsAllowed = false
			}
		} catch (error) {
			core.info(`Unable to extract git user metadata references: ${error.message}`)
		}
	}

	// * 5. Establish Ultimate Trigger Condition Output
	const result = authorIsAllowed && filteredFilesList.length > 0

	const showSummary = core.getBooleanInput('show-summary') && process.env.GITHUB_STEP_SUMMARY.length > 0

	try {
		if (showSummary) {
			core.summary.addRaw(`<table>
<tr><th>Specified Path Patterns</th><td>${inputPaths.join(', ')}</td></tr>
<tr><th>Changed Files</th><td>${changedFilesList.join(', ')}</td></tr>
<tr><th>Filtered Files</th><td>${filteredFilesList.join(', ')}</td></tr>
<tr><th>Only Specified Paths</th><td>${onlySpecifiedPaths}</td></tr>
<tr><th>Ignore Authors</th><td>${ignoreAuthors.join(', ')}</td></tr>
<tr><th>Author Is Allowed</th><td>${authorIsAllowed}</td></tr>
<tr><th>Ignore Events</th><td>${ignoreEvents.join(', ')}</td></tr>
<tr><th>Event Is Allowed</th><td>${!eventIsIgnored}</td></tr>
<tr><th>Result</th><td>${result}</td></tr>
</table>`)

			await core.summary.write({overwrite: true})
		}
	} catch (error) {
		core.info(`Failed to generate summary: ${error.message}`)
	}

	core.setOutput('changed-files', changedFilesList.join(' '))
	core.setOutput('changed-files-filtered', result ? filteredFilesList.join(' ') : '')

	return result
}
