# Run GitHub Script

## Overview

This basic template demonstrates how to run a GitHub script (locally) using a personal access token for authentication.

## Prerequisites

- Node.js and npm installed.
- A personal access token with the necessary permissions for your GitHub repository.

### Optional dependencies

- `gh` (GitHub CLI) installed and authenticated with your user. This is optional but recommended for easier token management.

## NPM Dependencies

- `@actions/github`: Official GitHub Actions toolkit for interacting with the GitHub API.
- `@actions/core`: Official GitHub Actions toolkit for core functionalities like setting outputs and handling errors.
- `@octokit/rest`: Official GitHub REST API client for JavaScript.

## Setup

1. Clone the repository containing the GitHub script.
2. Navigate to the repository directory.
3. Install the necessary dependencies using npm:

```bash
# Navigate to the run-github-script in the local-github-testing directory (or wherever you cloned the repository)
cd local-github-testing/run-github-script

# Install the necessary npm dependencies
npm install
```

## Usage

> [!NOTE]
>
> The `GITHUB_TOKEN` environment variable is used for authentication. If you have a personal access token, or do not
> wish to use the GitHub CLI (`gh`), you can set it directly in the environment variable before running the script.

### Using `main.sh` _(recommended)_

> [!IMPORTANT]
>
> The `main.sh` script checks for `gh` (GitHub CLI) and uses it to retrieve the personal access token if `GITHUB_TOKEN`
> is not set.

The `main.sh` script is a wrapper that handles loading environment variables and running the GitHub script. You can run
it as follows:

```bash
GITHUB_REPOSITORY=your_github_username/your_repo_name sh ./main.sh
```

### Using `npm`

To run the script directly using npm, you can use the following command:

```bash
GITHUB_TOKEN=$(gh auth token) GITHUB_REPOSITORY=your_github_username/your_repo_name npm start
```
