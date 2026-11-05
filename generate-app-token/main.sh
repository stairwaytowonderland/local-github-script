#!/bin/sh

set -eu
set +x

# Ensure the script is not sourced
case "$0" in
-*)
  printf '%s\n' "This script must not be sourced."
  sh
  return 1 2>/dev/null
  ;;
esac

[ "${1:-false}" = "true" ] && persistent_app_login=true || persistent_app_login=false
[ "${2:-true}" = "true" ] && persistent_user_login=true || persistent_user_login=false

script_dir="$(cd "$(dirname "$0")" && pwd)"
src_dir="${script_dir}/src"

load_env() {
  if [ -r "${script_dir}/.env" ]; then
    set -a
    # shellcheck disable=SC1091
    . "${script_dir}/.env"
    set +a
  else
    printf '%s\n' "Warning: .env not found or not readable in ${script_dir}"
    # return 1
  fi
}

load_env || exit 1

unset GITHUB_TOKEN

DEFAULT_GITHUB_SERVER_URL="https://github.com"
GITHUB_SERVER_URL="${GITHUB_SERVER_URL:-$DEFAULT_GITHUB_SERVER_URL}"
github_host="${GITHUB_SERVER_URL#https://}"
github_username="${GITHUB_ACTOR-}"
github_organization="${GITHUB_REPOSITORY_OWNER-}"
app_slug="${APP_SLUG-}"

if ! gh auth status >/dev/null 2>&1; then
  printf "\033[31mGitHub CLI is not authenticated. Please login.\033[0m\n"
  gh auth login -h "${github_host}" -p https -w
fi

printf "\033[32mGenerating GitHub App token...\033[0m\n"

TOKEN="$(
  APP_ID="${APP_ID-}" \
    APP_PRIVATE_KEY_PATH="${APP_PRIVATE_KEY_PATH-}" \
    APP_INSTALLATION_ID="${APP_INSTALLATION_ID-}" \
    sh "${src_dir}/generate-github-app-token.sh" "${src_dir}/generate-github-app-jwt.py" 2>&1
)" || true

if echo "$TOKEN" | grep -q -E '\[?[Ee]rror\]?:?'; then
  printf "\033[31mError generating GitHub App token:\033[0m\n"
  echo "$TOKEN" | awk -F'\t\\[error]\t' '{print "\033[2m"$1"\033[0m \033[31m[error]\033[0m "$2}'
  exit 1
fi

if ! $persistent_user_login; then
  gh auth logout -h "${github_host}" -u "${github_username}"
fi

if $persistent_app_login; then
  printf "\033[32mGitHub App token generated and to be used for persistent login.\033[0m\n"

  echo "$TOKEN" | gh auth login -h "${github_host}" --with-token
else
  printf "\033[32mGitHub App token generated and exported as GITHUB_TOKEN.\033[0m\n"
  export GITHUB_TOKEN="$TOKEN"
fi

gh auth status

echo
printf "\033[32mListing private and archived repositories for the organization...\033[0m\n"

get_repos() {
  gh api \
    --paginate \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2026-03-10" \
    "/orgs/${github_organization}/repos" |
    jq 'map(select(.private == true and .archived == true))' |
    jq -rc '.[] | .full_name'
}

get_repos

unset GITHUB_TOKEN

if ! $persistent_app_login; then
  [ -z "${GITHUB_TOKEN-}" ] || gh auth logout -h "${github_host}" -u "${app_slug}[bot]"
fi
