/**
 * Utility functions for the GitHub script.
 *
 * @module utils
 * @category Utilities
 */

/**
 * Converts a kebab-case string to camelCase.
 * @param {string} str - The kebab-case string.
 * @returns {string} The camelCase string.
 */
const kebabToCamel = str => str.replace(/-./g, m => m[1].toUpperCase())

/**
 * Dynamically imports modules if they are not already provided.
 * @param {Array<string|object>} args - An array of tuples containing the module name and an optional existing module object.
 * @returns {Promise<object>} An object containing the ensured modules keyed by their names.
 */
const dynamicModules = async (...args) => {
	const results = {}
	for (const [moduleName, moduleVar = undefined] of [...args]) {
		const ensureModule = async (moduleName, moduleVar) => {
			if (typeof moduleVar === 'undefined' || !moduleVar || Object.keys(moduleVar).length === 0) {
				console.debug(`Importing module: ${moduleName}`)
				const mod = await import(moduleName)
				return {...mod}
			}
			return moduleVar
		}
		const ensuredModule = await ensureModule(moduleName, moduleVar)
		// moduleVar = ensuredModule
		results[moduleName] = ensuredModule
	}
	return results
}

module.exports = {
	kebabToCamel,
	dynamicModules,
}
