/**
 * Parses command-line arguments and returns an object with specified values or defaults.
 * @module args
 * @type {UserArgs} An object containing the parsed command-line arguments, specifically the configuration file path.
 */
export default (() => {
  console.debug('Parsing command-line arguments...')

  const opts = {
    configIndex: process.argv.indexOf('--config'),
  }

  return {
    config:
      opts.configIndex !== -1 && opts.configIndex + 1 < process.argv.length
        ? process.argv[opts.configIndex + 1]
        : undefined,
  }
})()

/**
 * Options for the user-provided command-line arguments.
 * @typedef {Object} UserArgs
 * @property {string} [config] - The path to the default configuration file.
 */
