# Run GitHub Script

[![Deploy JSDoc to GitHub Pages](https://github.com/stairwaytowonderland/local-github-script/actions/workflows/docs.yaml/badge.svg)](https://github.com/stairwaytowonderland/local-github-script/actions/workflows/docs.yaml)

A playground to test GitHub scripts (`@actions/github-script`) locally.

## Overview

This basic template demonstrates how to run a GitHub Script *(locally)* using a personal access token for authentication.

## Features

- :white_check_mark: Run GitHub Scripts locally using a personal access token.
- :white_check_mark: Easy setup with npm dependencies.
- :white_check_mark: Optional integration with GitHub CLI for token management.
- :white_check_mark: Wrapper script (`main.sh`) for simplified execution.
- :white_check_mark: Supports environment variable configuration for authentication and repository settings.
- :white_check_mark: Input parameter injection for modules.
- :white_check_mark: Step summary generation for module execution.
- :white_check_mark: Supports dynamic import and execution of custom modules.
- :white_check_mark: Uses a `yaml` configuration file for defining script inputs and settings.

## Prerequisites

- Node.js and npm installed.
- A personal access token with the necessary permissions for your GitHub repository.

### Optional dependencies

- `gh` (GitHub CLI) installed and authenticated with your user. This is optional but recommended for easier token management.

## NPM Dependencies

### Core Dependencies

- `@actions/core`: Official GitHub Actions toolkit for core functionalities like setting outputs and handling errors.
- `@actions/exec`: Official GitHub Actions toolkit for executing commands in a shell.
- `@actions/github`: Official GitHub Actions toolkit for interacting with the GitHub API.
- `@actions/glob`: Official GitHub Actions toolkit for matching file paths using glob patterns.
- `@actions/io`: Official GitHub Actions toolkit for filesystem operations like copying, moving, and removing files.
- `@octokit/rest`: Official GitHub REST API client for JavaScript.
- `dotenv`: Module to load environment variables from a `.env` file into `process.env`.
- `dotenv-expand`: Module to expand environment variables defined in a `.env` file.
- `minimatch`: Module for matching file paths against glob patterns.
- `yaml`: Module for parsing and stringifying YAML files.

### Development Dependencies

- `@github/prettier-config`: Prettier configuration provided by GitHub for consistent code style.
- `clean-jsdoc-theme`: JSDoc theme for generating clean and readable documentation.
- `concurrently`: Module for running multiple commands concurrently in the terminal.
- `jsdoc`: Tool for generating documentation from JavaScript source code comments.

## Setup

1. Clone the repository containing the GitHub script.
2. Navigate to the repository directory.
3. Install the necessary dependencies using npm:

```bash
# Navigate to the run-github-script in the local-github-script directory (or wherever you cloned the repository)
cd local-github-script/run-github-script

# Install the necessary npm dependencies
npm install
```

## Usage

> [!NOTE]
>
> The `GITHUB_TOKEN` environment variable is used for authentication. If you have a personal access token, or do not
> wish to use the GitHub CLI (`gh`), you can set it directly in the environment variable before running the script.

### Using `main.sh` *(recommended)*

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

## Usage Notes

### CommonJS vs. ES Modules

> [!NOTE]
>
> github-script wraps inline scripts in a CommonJS context,
> meaning top-level import syntax is not supported.

If your external file uses ES Modules
(`export default` or `.mjs`), load it with dynamic `await import('./path/to/script.mjs')`
rather than `require()`.

## References

### `@actions/github-script`

**Global Vars/Args:** [Official Documentation](https://github.com/marketplace/actions/github-script#this-action)
