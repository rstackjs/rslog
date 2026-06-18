# AGENTS.md

## Stack

- Node.js `^20.19.0 || >=22.12.0`
- `pnpm` single-package workspace
- TypeScript pure ESM package
- Build: `rslib` with tsgo declarations and publint
- Test runner: `rstest`

## Commands (run early)

```bash
# setup
corepack enable && pnpm install

# dev checks
pnpm lint
pnpm test

# build / package
pnpm build
npm pack --dry-run
```

## Project structure

```text
src/       # logger source and public exports
tests/     # rstest tests and snapshots
preview/   # local manual preview that imports dist
dist/      # generated package output
```

## Code style

- Use single quotes and existing format conventions.
- Keep TypeScript strict-safe; avoid `any`.
- Naming: camelCase (functions/files), PascalCase (types/classes).
