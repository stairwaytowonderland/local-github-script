// load as CommonJS module using `require('./_require-test.cjs')`
module.exports = async ({github, context, core}) => {
  core.info(`Running script for repo: ${context.repo.repo}`)

  const {data: issues} = await github.rest.issues.listForRepo({
    owner: context.repo.owner,
    repo: context.repo.repo,
  })

  return issues.length
}
