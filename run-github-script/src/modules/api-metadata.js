/**
 * Module to fetch GitHub API metadata.
 * Retrieves information like allowed scopes and rate limits.
 *
 * @module modules/api-metadata
 * @category GitHub Script Modules
 *
 * @async
 * @param {object} github - The GitHub client.
 * @param {object} context - The GitHub Action context.
 * @param {object} core - The GitHub Actions core module.
 * @param {object} exec - The GitHub Actions exec module.
 * @param {object} glob - The GitHub Actions glob module.
 * @param {object} io - The GitHub Actions io module.
 * @param {function} getOctokit - The function to get an authenticated Octokit instance.
 * @param {function} require - The CommonJS require wrapper for importing modules.
 * @returns {Promise<object>} The response from the GitHub API.
 */

console.debug(`\x1b[36mRunning module \x1b[1m${import.meta.filename.split('/').pop()}\x1b[0;36m...\x1b[0m`)

export default async (github, context, core, exec, glob, io, getOctokit, require) => {
  // Get API metadata (like allowed scopes or GitHub Action IP ranges)
  // (Retrieve general metadata like hypermedia links to various API services)
  const response = await github.request('GET /')
  const {headers} = response
  core.info(`Scopes: ${headers['x-oauth-scopes']}`)
  core.info(`Rate Limit:`)
  core.info(`  Used: ${headers['x-ratelimit-used']}`)
  core.info(`  Remaining: ${headers['x-ratelimit-remaining']}`)
  core.info(`  Total: ${headers['x-ratelimit-limit']}`)
  core.info(`  Reset: ${new Date(headers['x-ratelimit-reset'] * 1000).toLocaleString()})`)

  return response
}
