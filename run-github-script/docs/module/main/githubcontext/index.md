---
title: GitHubContext
kind: typedef
longname: module:Main~GitHubContext
description: Represents the GitHub Actions context object.
---

# GitHubContext

<SourceLink href="/source/main-js/#L155" label="main.js:155" />

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

**Type**

`Object`
