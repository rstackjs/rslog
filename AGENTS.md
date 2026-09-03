# AGENTS.md

## Stack

- Package runtime: Node.js `^20.19.0 || >=22.12.0`
- Development toolchain: Node.js `^22.18.0 || >=24.3.0`
- `pnpm` single-package workspace
- TypeScript pure ESM package
- Build: `rs lib` with tsgo declarations and publint
- Test runner: `rs test`

## Commands (run early)

```bash
# setup
corepack enable && pnpm install

# dev checks
pnpm check
pnpm test

# build / package
pnpm build
npm pack --dry-run
```

## Project structure

```text
src/       # logger source and public exports
tests/     # Rstack test suites and snapshots
preview/   # local manual preview that imports TypeScript source
dist/      # generated package output
```

## Code style

- Use single quotes and existing format conventions.
- Keep TypeScript strict-safe; avoid `any`.
- Naming: camelCase (functions/files), PascalCase (types/classes).
