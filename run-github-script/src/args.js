/**
 * Parses command-line arguments and returns an object with specified values.
 *
 * Defaults aren't enforced here; only the provided command-line arguments are parsed.
 *
 * @module args
 * @category Helper Modules
 */

import {parseArgs} from 'node:util' // Use require('node:util') if using CommonJS

// Controlled by loglevel.js if loglevel.js is loaded before this file (args.js),
// or any file that loads it (e.g. config.js)
console.debug('Parsing command-line arguments...')

/**
 * Command-line argument options for parsing.
 * @see ParseArgsConfig
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
    'log-level': {
      type: 'string',
    },
  },
}

/**
 * Parse command-line arguments using the specified configuration.
 */
const {values} = parseArgs(argsConfig)

/**
 * Destructured command-line argument value for the configuration file.
 * @memberof module:args
 * @type {string|undefined}
 */
export const configPath = values.config

/**
 * Destructured command-line argument value for the debug flag.
 * @memberof module:args
 * @type {boolean}
 */
export const debugEnabled = values.debug

/**
 * Destructured command-line argument value for the log level.
 * @memberof module:args
 * @type {string|undefined}
 */
export const logLevel = values['log-level']

/**
 * @typedef {Object} ParseArgsConfig
 * @see https://nodejs.org/api/util.html#utilparseargsconfig
 * @see https://nodejs-api-docs-tooling.vercel.app/util/parseArgs
 */
