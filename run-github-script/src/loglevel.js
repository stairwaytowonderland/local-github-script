/**
 * Log level management for the GitHub Script environment.
 *
 * @module loglevel
 * @category Utility Modules
 */

/**
 * Store references to the native console methods so they can be restored later.
 * @private
 * @readonly
 * @memberof module:loglevel
 * @property {Function} debug=console.debug - The original console.debug method.
 * @property {Function} info=console.info - The original console.info method.
 * @property {Function} log=console.log - The original console.log method.
 * @property {Function} warn=console.warn - The original console.warn method.
 * @property {Function} error=console.error - The original console.error method.
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
 * @private
 * @readonly
 * @memberof module:loglevel
 * @property {number} debug=0 - Debug level (0).
 * @property {number} info=1 - Info level (1).
 * @property {number} log=1 - Log level (1).
 * @property {number} warn=2 - Warn level (2).
 * @property {number} error=3 - Error level (3).
 * @property {number} silent=4 - Silent level (4).
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
 * @example
 * level('debug') // Sets the log level to debug
 *
 * @memberof module:loglevel
 * @param {LogLevel} [logLevel='info'] - The desired log level (e.g., 'debug', 'info', 'warn', 'error', 'silent').
 * @returns {string|undefined} - The current log level as a string.
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

  return currentLevel
}

level(process.env.LOG_LEVEL)

/**
 * @typedef {'debug' | 'info' | 'log' | 'warn' | 'error' | 'silent'} LogLevel
 * @global
 */
