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
 * Dynamically imports modules if they are not already provided.
 *
 * @example
 * const modules = await dynamicModules(['fs'], ['path'])
 * console.log(modules.fs, modules.path)
 *
 * @example
 * const customModules = dynamicModules(
 *		['@actions/exec', typeof exec !== 'undefined' ? exec : undefined],
 *		['@actions/glob', typeof glob !== 'undefined' ? glob : undefined],
 *		['@actions/io', typeof io !== 'undefined' ? io : undefined],
 *	)
 *
 * @param {Array<string|object>} args - An array of tuples containing the module name and an optional existing module object.
 * @returns {Promise<object>} An object containing the ensured modules keyed by their names.
 */
export const dynamicModules = async (...args) => {
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
