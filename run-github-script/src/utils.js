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

/**
 * Reorders the keys of an object based on a specified key order.
 *
 * @example
 * const obj = { b: 2, a: 1, c: 3 }
 * const keyOrder = ['a', 'b']
 * const ordered = reorderKeys(obj, keyOrder)
 * console.log(ordered) // { a: 1, b: 2, c: 3 }
 *
 * @param {Object} obj - The object to reorder.
 * @param {string[]} keyOrder - The desired key order.
 * @returns {Object} The object with reordered keys.
 */
export const reorderKeys = (obj, keyOrder) => {
  const ordered = {}
  keyOrder.forEach(key => {
    if (key in obj) {
      ordered[key] = obj[key]
    }
  })
  Object.keys(obj).forEach(key => {
    if (!(key in ordered)) {
      ordered[key] = obj[key]
    }
  })
  return ordered
}
