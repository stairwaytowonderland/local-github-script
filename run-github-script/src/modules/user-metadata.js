/**
 * Module to fetch metadata about the authenticated GitHub user.
 *
 * @module modules/user-metadata
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
  // Get metadata about the user who owns the token
  // (Retrieve profile details for the currently authenticated user)
  const response = await github.rest.users.getAuthenticated()
  const {data: userMetadata} = response
  core.info(`User:`) // e.g., "The Octocat"
  core.info(`  Login: ${userMetadata.login}`) // e.g., "octocat"
  core.info(`  Public Repos: ${userMetadata.public_repos}`)

  return response
}
