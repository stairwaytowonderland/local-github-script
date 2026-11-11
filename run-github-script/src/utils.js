/**
 * Utility functions for the GitHub script.
 *
 * @module utils
 * @category Utilities
 */

/**
 * Converts a kebab-case string to camelCase.
 *
 * @example
 * const camelCaseString = kebabToCamel('kebab-case-string')
 * console.log(camelCaseString) // 'kebabCaseString'
 *
 * @param {string} str - The kebab-case string.
 * @returns {string} The camelCase string.
 */
export const kebabToCamel = str => str.replace(/-./g, m => m[1].toUpperCase())
