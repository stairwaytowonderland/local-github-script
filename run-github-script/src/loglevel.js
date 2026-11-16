/**
 * Log level management for the GitHub Script environment.
 *
 * @module loglevel
 * @category Utility Modules
 */

/**
 * Store references to the native console methods so they can be restored later.
 * @private
 * @constant
 * @type {Object<string, Function>}
 * @memberof module:loglevel
 */
const originalConsole = Object.freeze({
  debug: console.debug,
  info: console.info,
  log: console.log,
  warn: console.warn,
  error: console.error,
})

/**
 * Log levels for controlling console output.
 *
 * @see LogLevelValue
 * @private
 * @readonly
 * @type {LogLevelValue}
 * @memberof module:loglevel
 */
const levels = Object.freeze({
  debug: 0,
  info: 1,
  log: 1,
  warn: 2,
  error: 3,
  silent: 4,
})

/**
 * Auto-initialize the log level
 *
 * @see LogLevel
 * @see LogLevelValue
 *
 * @example
 * level('debug') // Sets the log level to debug
 *
 * @memberof module:loglevel
 * @param {LogLevel} [logLevel='info'] - The desired log level (e.g., 'debug', 'info', 'warn', 'error', 'silent').
 * @returns {void}
 */
export const level = (logLevel = 'info') => {
  const resolvedLevel = logLevel?.toLowerCase()
  const currentLevel = levels[resolvedLevel] ?? levels.info

  Object.keys(originalConsole).forEach(method => {
    if (levels[method] < currentLevel) {
      console[method] = () => {}
    } else {
      console[method] = originalConsole[method]
    }
  })
}

level(process.env.LOG_LEVEL)

/**
 * @typedef {0 | 1 | 2 | 3 | 4} LogLevelValue
 * @global
 */

/**
 * @typedef {'debug' | 'info' | 'log' | 'warn' | 'error' | 'silent'} LogLevel
 * @global
 */
