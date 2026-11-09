/**
 * Initializes the GitHub step summary for a given module file.
 *
 * @module step-summary
 * @category Utilities
 */

import path from 'node:path'
import fs from 'node:fs'
import {summary} from '@actions/core'

/**
 * Initializes the GitHub step summary for a given module file.
 *
 * @param {string} moduleFile - The path to the module file.
 * @returns {void} Does not return a value.
 */
// export const initStepSummary = async moduleFile => {
export function initStepSummary() {
	if (!fs.existsSync(this.summaryPath)) {
		fs.writeFileSync(this.summaryPath, '')
	}

	process.env.GITHUB_STEP_SUMMARY = this.summaryPath

	// Reset the global singleton so core.summary.write() picks up the new path
	summary.emptyBuffer()
	summary._filePath = undefined

	console.debug(
		[
			`\x1b[34mStep summary initialized successfully`,
			`with\x1b[0m \x1b[1;34m${path.basename(this.summaryPath)}\x1b[0m`,
		].join(' '),
	)
}
