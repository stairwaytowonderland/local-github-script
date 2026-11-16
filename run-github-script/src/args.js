/**
 * Parses command-line arguments and returns an object with specified values or defaults.
 *
 * @module args
 * @implements {UserArgs}
 * @category Helper Modules
 */

import {parseArgs} from 'node:util' // Use require('node:util') if using CommonJS

console.debug('Parsing command-line arguments...')

/**
 * Parsed command-line argument values.
 */
const {values} = parseArgs({
  // Strict mode is true by default, throwing an error for unknown flags
  strict: true,
  options: {
    config: {
      type: 'string', // Expects a value after --config
    },
    debug: {
      type: 'boolean', // Behaves as a standalone flag
    },
  },
})

/**
 * Individual command-line argument values.
 * @type {string|undefined}
 * @memberof module:args
 */
export const config = values.config

/**
 * Individual command-line argument values.
 * @type {boolean|undefined}
 * @memberof module:args
 */
export const debug = values.debug

/**
 * User-provided command-line arguments.
 * @typedef {Object} UserArgs
 * @extends {ConfigOpts}
 */
