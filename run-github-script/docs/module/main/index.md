---
title: Main
kind: module
longname: module:Main
description: Main entry point for the GitHub Script runner. It sets up the environment, mocks the GitHub context, and loads the necessary modules.
order: 1
---

# Main

<SourceLink href="/source/main-js/#L9" label="main.js:9" />

Main entry point for the GitHub Script runner. It sets up the environment, mocks the GitHub context, and loads the necessary modules.

---

## Instance Methods

<MemberHeading id="mocks" depth="3" name="mocks" sig="mocks(): Mocks" />

<MemberMeta sourceHref="/source/main-js/#L40" sourceLabel="main.js:40" />

Mocks the GitHub context and Octokit instance for local testing.

**Returns**

- [`Mocks`](/module/main#mocks) — The mocked GitHub context and Octokit instance.

<MemberHeading id="loadadvancedmodules" depth="3" name="loadAdvancedModules" sig="loadAdvancedModules(): Promise.<AdvancedModules>" />

<MemberMeta badges="async" sourceHref="/source/main-js/#L115" sourceLabel="main.js:115" />

Dynamically loads advanced GitHub Actions modules if they are not already available.

**Returns**

- `Promise.<`[`AdvancedModules`](/module/main#advancedmodules)`>` — The loaded advanced modules.

## Other

<MemberHeading id="advancedmodules" depth="3" name="AdvancedModules" sig="AdvancedModules: Object" />

<MemberMeta sourceHref="/source/main-js/#L131" sourceLabel="main.js:131" />

**Properties**

- `exec` (Object) — The GitHub Actions exec module.
- `glob` (Object) — The GitHub Actions glob module.
- `io` (Object) — The GitHub Actions io module.

<MemberHeading id="mocks" depth="3" name="Mocks" sig="Mocks: Object" />

<MemberMeta sourceHref="/source/main-js/#L137" sourceLabel="main.js:137" />

**Properties**

- `github` (Octokit) — The mocked Octokit instance.
- `context` (Object) — The mocked GitHub context.

<MemberHeading id="githubcontext" depth="3" name="GitHubContext" sig="GitHubContext: Object" />

<MemberMeta sourceHref="/source/main-js/#L155" sourceLabel="main.js:155" />

Represents the GitHub Actions context object.

**Properties**

- `actor` (string, optional) — The username of the user that triggered the workflow.
- `eventName` (string, optional) — The name of the webhook event that triggered the workflow.
- `ref` (string, optional) — The git ref that triggered the workflow.
- `sha` (string, optional) — The commit SHA that triggered the workflow.
- `workflow` (string, optional) — The name of the workflow.
- `action` (string, optional) — The name of the action currently running.
- `job` (string, optional) — The ID of the current job.
- `runAttempt` (number, optional) — The run attempt number.
- `runId` (number, optional) — The run ID.
- `runNumber` (number, optional) — The run number.
- `issue` ([IssueContext](/module/main#issuecontext), optional) — The issue context, if applicable.
- `repo` ([RepositoryContext](/module/main#repositorycontext), optional) — The repository context.
- `payload` ([EventPayload](/module/main#eventpayload), optional) — The webhook payload.

<MemberHeading id="eventpayload" depth="3" name="EventPayload" sig="EventPayload: Object" />

<MemberMeta sourceHref="/source/main-js/#L160" sourceLabel="main.js:160" />

**Properties**

- `repository` ([RepositoryContext](/module/main#repositorycontext), optional) — The repository context.

<MemberHeading id="issuecontext" depth="3" name="IssueContext" sig="IssueContext: Object" />

<MemberMeta sourceHref="/source/main-js/#L166" sourceLabel="main.js:166" />

**Properties**

- `number` (number, optional) — The issue number.
- `title` (string, optional) — The issue title.
- `body` (string, optional) — The issue body.

<MemberHeading id="repositorycontext" depth="3" name="RepositoryContext" sig="RepositoryContext: Object" />

<MemberMeta sourceHref="/source/main-js/#L171" sourceLabel="main.js:171" />

**Properties**

- `name` (string, optional) — The repository name.
- `owner` (string, optional) — The repository owner.

<MemberHeading id="pullrequestcontext" depth="3" name="PullRequestContext" sig="PullRequestContext: Object" />

<MemberMeta sourceHref="/source/main-js/#L177" sourceLabel="main.js:177" />

**Properties**

- `number` (number, optional) — The pull request number.
- `title` (string, optional) — The pull request title.
- `body` (string, optional) — The pull request body.

<MemberHeading id="sendercontext" depth="3" name="SenderContext" sig="SenderContext: Object" />

<MemberMeta sourceHref="/source/main-js/#L177" sourceLabel="main.js:177" />

**Properties**

- `login` (string, optional) — The username of the sender.

<MemberHeading id="run" depth="3" name="run" sig="run" />

<MemberMeta badges="static" sourceHref="/source/main-js/#L95" sourceLabel="main.js:95" />

Runs the main GitHub Script logic with mocked context and modules. Exits the process with code 0 on success and 1 on failure.
