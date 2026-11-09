# Local GitHub Testing

## :pushpin: Overview

This repository contains various utilities for local GitHub testing.

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
│   │   ├── step-summary.cjs
│   │   └── utils.cjs
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

**Global Vars/Args:** <https://github.com/marketplace/actions/github-script#this-action>
