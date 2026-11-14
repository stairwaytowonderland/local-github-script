/**
 * @file Barrel file for the GitHub Action.
 *
 * This file simply imports and runs the main logic of the action.
 *
 * @example
 * ```bash
 * # From a shell with Node.js installed
 * $ node index.js [--config <config-file>]
 * ```
 */

import {run} from './main.js'

/* istanbul ignore next */
run()
