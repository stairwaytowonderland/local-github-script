/**
 * Initializes the GitHub step summary for a given module file.
 *
 * @module step-summary
 * @category Utilities
 *
 * @async
 * @param {string} moduleFile - The path to the module file.
 * @example
 * const initStepSummary = require('./step-summary.cjs')
 * await initStepSummary('./my-module.js')
 * @returns {Promise<void>} A promise that resolves when the step summary is initialized.
 */

const path = require('node:path')
const fs = require('node:fs')
const {kebabToCamel} = require('./utils.cjs')

module.exports = async moduleFile => {
	const moduleFileWithoutExt = path.basename(moduleFile, path.extname(moduleFile))
	const moduleName = kebabToCamel(moduleFileWithoutExt)
	console.log(`Initializing GitHub step summary for module: ${moduleName}`)

	// Resolve path safely using CommonJS __dirname
	const summaryPath = path.resolve(__dirname, `./.${moduleFileWithoutExt}-step-summary.md`)
	process.env.GITHUB_STEP_SUMMARY = summaryPath

	if (!fs.existsSync(summaryPath)) {
		fs.writeFileSync(summaryPath, '')
	}

	console.log('Step summary initialized successfully.')
}
