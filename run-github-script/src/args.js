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
 * Command-line argument options for parsing.
 * @see ParseArgsConfig
 * @type {ParseArgsConfig}
 * @memberof module:args
 */
export const argsConfig = {
  // Strict mode is true by default, throwing an error for unknown flags
  strict: true,
  options: {
    config: {
      type: 'string',
    },
    debug: {
      type: 'boolean',
    },
    level: {
      type: 'string',
    },
  },
}

/**
 * Parsed command-line argument values.
 * @see UserArgs
 * @type {UserArgs}
 * @memberof module:args
 */
export const cliArgs = parseArgs(argsConfig).values

/**
 * User-provided command-line arguments.
 * @typedef {Object} UserArgs
 * @extends {ConfigOpts}
 */

/**
 * @typedef {Object} ParseArgsConfig
 * @see https://nodejs.org/api/util.html#utilparseargsconfig
 * @see https://nodejs-api-docs-tooling.vercel.app/util/parseArgs
 */
