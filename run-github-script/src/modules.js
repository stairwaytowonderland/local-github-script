import * as path from 'node:path'

// Import pre-parsed configuration structures directly
import {__dirname} from './config.js'

export default async ({github, context, core, exec, glob, io, getOctokit}, config) => {
	try {
		console.log(`\nLoading custom modules for: ${config.name}`)

		for (const module of config.modules) {
			const absoluteModulePath = path.resolve(__dirname, config['module-path'], module.path)

			console.log(`\nLoading "${module.name}" from: ${absoluteModulePath}`)
			const moduleUrl = `file://${absoluteModulePath}`

			// This matches your existing format precisely:
			// Dynamically import the module and destructure 'default' as 'run'
			const {default: run} = await import(moduleUrl)

			// Keep track of dynamically modified env keys and their prior values for perfect cleanup
			const activeEnvKeys = []
			const fallbackEnvValues = {}

			// Process Inputs Block: INPUT_<uppercase>
			if (module.inputs && typeof module.inputs === 'object') {
				for (const [key, value] of Object.entries(module.inputs)) {
					const envKey = `INPUT_${key.toUpperCase()}`

					// Save fallback state if it already existed in process.env
					if (Object.prototype.hasOwnProperty.call(process.env, envKey)) {
						fallbackEnvValues[envKey] = process.env[envKey]
					}

					process.env[envKey] = String(value)
					activeEnvKeys.push(envKey)
				}
			}

			// Process Env Overrides Block: Exact key match
			if (module.env && typeof module.env === 'object') {
				for (const [key, value] of Object.entries(module.env)) {
					// Save fallback state to protect global/dotenv configurations from permanent mutation
					if (
						Object.prototype.hasOwnProperty.call(process.env, key) &&
						!Object.prototype.hasOwnProperty.call(fallbackEnvValues, key)
					) {
						fallbackEnvValues[key] = process.env[key]
					}

					process.env[key] = String(value)
					activeEnvKeys.push(key)
				}
			}

			// Helper function to safely restore environment state
			const cleanupEnvironment = () => {
				for (const envKey of activeEnvKeys) {
					if (Object.prototype.hasOwnProperty.call(fallbackEnvValues, envKey)) {
						process.env[envKey] = fallbackEnvValues[envKey]
					} else {
						delete process.env[envKey]
					}
				}
			}

			// Verify it's a function before calling it
			if (typeof run === 'function') {
				await run({github, context, core, exec, glob, io, getOctokit})
					.then(result =>
						console.log(
							`\n\x1b[1;92m"${module.name}" succeeded results ...\x1b[0m\n"${module.id || module.name}":`,
							result,
							`\n`,
						),
					)
					.catch(err =>
						console.error(
							`\n\x1b[1;91m"${module.name}" failed results ...\x1b[0m\n"${module.id || module.name}":`,
							err,
							`\n`,
						),
					)
					.finally(() => {
						cleanupEnvironment(activeEnvKeys)
					})
			} else {
				cleanupEnvironment(activeEnvKeys)
				console.error(`Error: "${module.id || module.name}" does not export a default function.`)
			}
		}
	} catch (error) {
		console.error('Error loading configuration or modules:', error)
	}
}
