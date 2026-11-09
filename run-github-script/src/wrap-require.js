/**
 * Wraps the Node.js require function to resolve relative module paths
 * and handle module resolution in a Webpack-compatible way.
 *
 * **See:** https://github.com/actions/github-script/blob/main/src/wrap-require.ts
 *
 * @module wrap-require
 * @category Helpers
 */

import * as path from 'node:path'
import {createRequire} from 'node:module'

/**
 * The wrapped require function with enhanced module resolution.
 *
 * @param {string} moduleID - The module identifier to require.
 * @returns {*} The required module.
 */
export const wrapRequire = new Proxy(createRequire(import.meta.url), {
	apply: (target, thisArg, [moduleID]) => {
		if (moduleID.startsWith('.')) {
			moduleID = path.resolve(moduleID)
			return target.apply(thisArg, [moduleID])
		}

		const modulePath = target.resolve.apply(thisArg, [
			moduleID,
			{
				// Webpack does not have an escape hatch for getting the actual
				// module, other than `eval`.
				paths: [process.cwd()],
			},
		])

		return target.apply(thisArg, [modulePath])
	},

	get: (target, prop, receiver) => Reflect.get(target, prop, receiver),
})
