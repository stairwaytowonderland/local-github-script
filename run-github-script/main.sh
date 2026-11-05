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

script_dir="$(cd "$(dirname "$0")" && pwd)"

load_env() {
  if [ -r "${script_dir}/.env" ]; then
    printf '%s\n' "Loading environment variables from ${script_dir}/.env"
    set -ax
    # shellcheck disable=SC1091
    . "${script_dir}/.env"
    set +ax
  else
    printf '%s\n' "Warning: .env not found or not readable in ${script_dir}"
    # return 1
  fi
}

load_env || exit 1

if [ -z "${GITHUB_TOKEN-}" ] && command -v gh >/dev/null 2>&1; then
  TOKEN=$(gh auth token)
fi

GITHUB_TOKEN="${TOKEN:-$GITHUB_TOKEN}" npm start --prefix "${script_dir}" run-github-script -- --config "${CONFIG:-config.yaml}"
