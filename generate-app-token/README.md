# Generate App Token

## Overview

This guide explains how to generate a GitHub App token using a private key, the GitHub App ID, and the installation ID.
The process involves creating a JWT, exchanging it for an installation token, and optionally using the GitHub CLI for authentication.

## Prerequisites

- GitHub CLI installed and authenticated with your user.
- Python 3 installed.
- The private key for your GitHub App.
- The GitHub App ID and installation ID.
- jq installed (for processing JSON output from GitHub API).

## Python Dependencies

- `PyJWT`: Python library for creating and verifying JSON Web Tokens (JWT).
- `cryptography`: Python library providing cryptographic recipes and primitives.

Install the Python dependencies using pip:

```bash
pip install PyJWT cryptography
```

## Usage

> [!IMPORTANT]
>
> You need to have the GitHub CLI installed and authenticated with your user before generating the GitHub App token.
>
> Use `gh auth login -h github.com -p https -w` to authenticate with GitHub before generating the token.

```bash
# Initial user authorization required before generating a GitHub App token
gh auth login -h github.com -p https -w

# Get the JWT and generate the GitHub App token
TOKEN=$(
  APP_ID=<app_id> \
    APP_PRIVATE_KEY_PATH=<path-to-private-key.pem> \
    APP_INSTALLATION_ID=<installation_id> \
    src/generate-github-app-token.sh src/generate-github-app-jwt.py 2>&1 \
)

# Optional logout of user account
# gh auth logout -h github.com -u <username>

# Login with the generated GitHub App token ...
# Use --with-token if your exported variable name is not GITHUB_TOKEN.
#
# Option 1: Use the default GITHUB_TOKEN environment variable (unsetting results in logout).
# export GITHUB_TOKEN="$TOKEN" && gh auth login -h github.com
#
# Option 2: Persist the login using --with-token (logout requires manually using gh auth logout)
# echo $TOKEN | gh auth login --with-token

gh auth login -h github.com

# Verify the authentication status
gh auth status

# Test: List private and archived repositories
gh api \
  --paginate \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
  /orgs/{org}/repos \
  | jq 'map(select(.private == true and .archived == true))' \
  | jq -rc '.[] | .full_name'
```

> [!NOTE]
>
> After authentication, to display the token for use in subsequent commands, you can run:
>
> ```bash
> gh auth token
> ```

## Alternative

An alternative method uses the GitHub CLI extension `gh-token` to generate a GitHub App token directly,
without needing to manually create a JWT first.

> [!WARNING]
>
> This is a third-party extension and may not be officially supported by GitHub.

```bash
# Alternative method to generate a GitHub App token using the gh extension
gh extension install Link-/gh-token
gh token generate \
  --key APP_PRIVATE_KEY_PATH \
  --app-id APP_ID \
  --installation-id APP_INSTALLATION_ID
```
