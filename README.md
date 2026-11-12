# Local GitHub Script Testing

A playground to test GitHub Scripts locally.

[![Deploy JSDoc to GitHub Pages](https://github.com/stairwaytowonderland/local-github-script/actions/workflows/docs.yaml/badge.svg)](https://github.com/stairwaytowonderland/local-github-script/actions/workflows/docs.yaml)

## :pushpin: Overview

This repository contains various utilities for local GitHub Script testing.

## :rocket: Features

- :white_check_mark: Simulated GitHub Script environment for local testing.
- :white_check_mark: Authentication support for GitHub Apps and personal access tokens.
- :white_check_mark: Supports multiple GitHub Script modules defined in separate files.

## :cactus: Project structure

> [!TIP]
>
> For the complete `.github` folder file structure, see its [`index.md`](./.github/index.md).

<details>
<summary><b>Project file structure</b> <i>(Click to expand) ...</i></summary><br>

> :seedling: `tree -a -F -L 3 -I '.git|.vscode|.devcontainer' --gitignore --dirsfirst .`

```none
./
├── .github/
│   ├── workflows/
│   │   └── docs.yaml
│   ├── CODEOWNERS
│   └── dependabot.yml
├── generate-app-token/
│   ├── src/
│   │   ├── generate-github-app-jwt.py*
│   │   └── generate-github-app-token.sh
│   ├── .env.sample
│   ├── main.sh
│   ├── pyproject.toml
│   └── README.md
├── run-github-script/
│   ├── src/
│   │   ├── modules/
│   │   ├── config.js
│   │   ├── config.yaml
│   │   ├── index.js
│   │   ├── main.js
│   │   ├── modules.js
│   │   ├── step-summary.js
│   │   ├── utils.js
│   │   └── wrap-require.js
│   ├── .env.sample
│   ├── .prettierignore
│   ├── jsdoc.json
│   ├── jsdoc.local.json
│   ├── main.sh
│   ├── package-lock.json
│   ├── package.json
│   └── README.md
├── .editorconfig
├── .gitattributes
├── .gitignore
├── .markdownlint.json
├── .pre-commit-config.yaml
└── README.md
```

</details>

## :books: References

### `@actions/github-script`

- [Global Vars/Args](https://github.com/actions/github-script#this-action)

### Actions Toolkit

- [GitHub Interfaces](https://github.com/actions/toolkit/blob/main/packages/github/src/interfaces.ts)
- [GitHub Context](https://github.com/actions/toolkit/blob/main/packages/github/src/context.ts)
- [GitHub Client](https://github.com/actions/toolkit/blob/main/packages/github/src/github.ts)
- [Rest Guide](https://octokit.github.io/rest.js/)
