/**
 * Initializes the GitHub step summary for a given module file.
 *
 * @module step-summary
 * @category Helpers
 */

import path from 'node:path'
import fs from 'node:fs'
import {summary} from '@actions/core'

/**
 * Initializes the GitHub step summary for a given module.
 *
 * @param {string} summaryPath - The path to the step summary file.
 * @param {boolean} stepSummaryEnabled - Whether to enable the step summary for the module.
 * @returns {void} Does not return a value.
 */
// export const initStepSummary = async moduleFile => {
export function initStepSummary(summaryPath, stepSummaryEnabled) {
  if (stepSummaryEnabled && !fs.existsSync(summaryPath)) {
    fs.writeFileSync(summaryPath, '')
  }

  process.env.GITHUB_STEP_SUMMARY = summaryPath

  // Reset the global singleton so core.summary.write() picks up the new path
  summary.emptyBuffer()
  summary._filePath = undefined

  console.debug(
    [
      `\x1b[34mStep summary initialized successfully`,
      `with\x1b[0m \x1b[1;34m${path.basename(summaryPath)}\x1b[0m`,
    ].join(' '),
  )
}
