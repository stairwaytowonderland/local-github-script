/**
 * Log level management for the console output.
 *
 * @example
 * import {level} from './loglevel.js'
 * level('debug') // Sets the log level to debug
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
 * Enum representing log levels.
 *
 * See [LogLevel](/module/loglevel/loglevel) for details.
 *
 * @readonly
 * @enum {LogLevel}
 * @class
 */
class LogLevel {
  /**
   * Debug level (0).
   * @readonly
   * @type {LogLevel}
   */
  static debug = new LogLevel('debug', 0)
  /**
   * Info level (1).
   * @readonly
   * @type {LogLevel}
   */
  static info = new LogLevel('info', 1)
  /**
   * Log level (1).
   * @readonly
   * @type {LogLevel}
   */
  static log = new LogLevel('log', 1)
  /**
   * Warn level (2).
   * @readonly
   * @type {LogLevel}
   */
  static warn = new LogLevel('warn', 2)
  /**
   * Error level (3).
   * @readonly
   * @type {LogLevel}
   */
  static error = new LogLevel('error', 3)
  /**
   * Silent level (4).
   * @readonly
   * @type {LogLevel}
   */
  static silent = new LogLevel('silent', 4)

  /**
   * Creates an instance of LogLevel.
   *
   * @param {LogLevels} name - The name of the log level.
   * @param {0|1|2|3|4} value - The numeric value of the log level.
   */
  constructor(name, value) {
    this.name = name
    this.value = value

    // Freeze the instance to prevent modification of its properties.
    Object.freeze(this)
  }

  static get [Symbol.toStringTag]() {
    return 'LogLevel'
  }

  valueOf() {
    return this.value
  }

  toString() {
    return this.name
  }
}

// Freeze the LogLevel class to prevent modification of its static properties.
Object.freeze(LogLevel)

/**
 * @memberof module:loglevel
 */
export {LogLevel}

/**
 * Sets the log level for the console output.
 *
 * @example
 * level('debug') // Sets the log level to debug
 *
 * @memberof module:loglevel
 * @param {LogLevels|LogLevel} [logLevel='info'] - The desired log level (e.g., 'debug', 'info', 'warn', 'error', 'silent').
 * @param {string} [fileName] - The name of the file setting the log level.
 * @returns {LogLevels} - The current log level as a string.
 * @default 'info'
 */
export const level = (logLevel = 'info', fileName = undefined) => {
  if (fileName === 'loglevel.js') {
    console.error(`Auto-initializing log level to: ${logLevel}`)
  } else {
    console.error(`Manually setting log level to: ${logLevel}`)
  }

  const resolvedLevel = String(logLevel)?.toLowerCase()
  const currentLevel = LogLevel[resolvedLevel] ?? LogLevel.info

  Object.keys(originalConsole).forEach(method => {
    if (LogLevel[method].value < currentLevel.value) {
      console[method] = () => {}
    } else {
      console[method] = originalConsole[method]
    }
  })

  return currentLevel.name
}

// level(process.env.LOG_LEVEL, import.meta.filename.split('/').pop())

/**
 * Valid log levels: `'debug'`, `'info'`, `'log'`, `'warn'`, `'error'`, or `'silent'`.
 * @typedef {string} LogLevels
 * @global
 */
