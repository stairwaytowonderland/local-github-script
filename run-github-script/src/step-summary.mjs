/**
 * Initializes the GitHub step summary for a given module file.
 *
 * @module step-summary
 * @category Utilities
 */

import path from 'node:path'
import fs from 'node:fs'
import {summary} from '@actions/core'

const __dirname = import.meta.dirname

/**
 * Initializes the GitHub step summary for a given module file.
 *
 * @param {string} moduleFile - The path to the module file.
 * @returns {void} Does not return a value.
 */
// export const initStepSummary = async moduleFile => {
export const initStepSummary = moduleFile => {
	const moduleFileWithoutExt = path.basename(moduleFile, path.extname(moduleFile))
	// console.debug(`\x1b[34mInitializing GitHub step summary for module\x1b[0m \x1b[1;34m${moduleFileWithoutExt}\x1b[0m`)

	// Resolve path safely using CommonJS __dirname
	const summaryPath = path.resolve(__dirname, `./.${moduleFileWithoutExt}-step-summary.md`)

	if (!fs.existsSync(summaryPath)) {
		fs.writeFileSync(summaryPath, '')
	}

	process.env.GITHUB_STEP_SUMMARY = summaryPath

	// Reset the global singleton so core.summary.write() picks up the new path
	summary.emptyBuffer()
	summary._filePath = undefined

	// console.debug(
	// 	`\x1b[34mStep summary initialized successfully with\x1b[0m \x1b[1;34m${path.basename(summaryPath)}\x1b[0m`,
	// )

	console.debug(
		[
			`\x1b[34mStep summary initialized successfully`,
			`with\x1b[0m \x1b[1;34m${path.basename(summaryPath)}\x1b[0m`,
		].join(' '),
	)
}
