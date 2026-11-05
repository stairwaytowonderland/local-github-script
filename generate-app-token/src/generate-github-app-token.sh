#!/bin/sh

# Alternative method to generate a GitHub App token using the gh extension
# gh extension install Link-/gh-token
# gh token generate \
#   --key APP_PRIVATE_KEY_PATH \
#   --app-id APP_ID \
#   --installation-id APP_INSTALLATION_ID

# Usage:
# ./generate-github-app-token.sh <path-to-jwt-generator-script> [installation-id]

# Example:
# Initial authorization required before generating a GitHub App token
# gh auth login -h github.com -p https -w

# Generate a GitHub App token using the provided JWT generator script
# export TOKEN=$(\
#   APP_ID=<app_id> \
#   APP_PRIVATE_KEY_PATH=<path-to-private-key.pem> \
#   APP_INSTALLATION_ID=<installation_id> \
#   ./generate-github-app-token.sh ./generate-github-app-jwt.py 2>&1 \
# )

# Optional user logout
# gh auth logout -h github.com -u <username>

# App login option 1: Login automatically and temporarily by setting GITHUB_TOKEN
# export GITHUB_TOKEN="$TOKEN"
# gh auth login -h github.com

# App login option 2: Persist the login session by not setting GITHUB_TOKEN
# echo "$TOKEN" | gh auth login -h github.com --with-token

# Verify
# gh auth status

# Test
# gh api \
#   --paginate \
#   -H "Accept: application/vnd.github+json" \
#   -H "X-GitHub-Api-Version: 2026-03-10" \
#   /orgs/{org}/repos \
#   | jq 'map(select(.private == true and .archived == true))' \
#   | jq -rc '.[] | .full_name'

# If using the GitHub App token for a temporary login, you may want to unset GITHUB_TOKEN to log out of the session
# unset GITHUB_TOKEN

set -eu

# 1. Export your specific variables
APP_ID="${APP_ID-}"
APP_PRIVATE_KEY_PATH="${APP_PRIVATE_KEY_PATH-}"
APP_INSTALLATION_ID="${2:-${APP_INSTALLATION_ID-}}"
JWT_UTIL="${1-}"

format_error_message() {
  printf '%s\t[%s]\t%s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$1" "$2"
}

exit_with_error() {
  format_error_message "error" "$1" >&2
  exit 1
}

if [ -z "$JWT_UTIL" ]; then
  exit_with_error "Please provide a valid JWT generator script as the first argument."
fi

if [ ! -x "$JWT_UTIL" ]; then
  exit_with_error "The provided JWT generator script is not executable."
fi

if [ -z "$APP_ID" ] || [ -z "$APP_PRIVATE_KEY_PATH" ]; then
  exit_with_error "APP_ID and APP_PRIVATE_KEY_PATH must be set"
fi

if [ -z "$APP_INSTALLATION_ID" ]; then
  exit_with_error "APP_INSTALLATION_ID must be set"
fi

# 2. Run the script and save the output directly into a shell variable
JWT=$(python3 "$JWT_UTIL")

# 3. Use it immediately with the GitHub CLI to get an installation access token
gh api --method POST \
  -H "Authorization: Bearer $JWT" \
  -H "Accept: application/vnd.github+json" \
  /app/installations/"$APP_INSTALLATION_ID"/access_tokens \
  --jq '.token'
