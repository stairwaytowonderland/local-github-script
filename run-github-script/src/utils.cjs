const kebabToCamel = str => str.replace(/-./g, m => m[1].toUpperCase())

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
