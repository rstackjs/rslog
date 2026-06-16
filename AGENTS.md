# AGENTS.md

This file gives coding agents concise guidance for working in this repository.

## Repository Overview

`rslog` is a small pure ESM logger package for Node.js. Source code lives in
`src/`, tests live in `tests/`, and Rslib emits the publishable package into
`dist/`.

## Commands

- Install dependencies: `corepack pnpm install --frozen-lockfile`
- Lint and format check: `corepack pnpm run lint`
- Auto-fix lint and formatting: `corepack pnpm run lint:write`
- Build the package: `corepack pnpm run build`
- Run tests: `corepack pnpm run test`
- Check package contents: `npm pack --dry-run`

## Package Contract

- Keep the package pure ESM: `type: "module"` with exports pointing to
  `dist/index.js` and `dist/index.d.ts`.
- Keep runtime support aligned with `package.json#engines.node`.
- Public API should be exported from `src/index.ts`; avoid adding deep import
  contracts unless they are intentionally documented.
- Rslib owns build output. Do not edit `dist/` by hand.

## Maintenance Notes

- Keep GitHub Actions third-party actions pinned to commit hashes.
- Run Knip locally when changing dependencies, but do not add Knip as a project
  dependency unless the repository starts using it in scripts.
- Preserve log output behavior and snapshots unless a change intentionally
  updates user-visible formatting.
