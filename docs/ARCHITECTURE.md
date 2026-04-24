# Architecture

## Layers

```text
React PWA → TypeScript adapter → C23 WASM core
Fastify API → Native C23 core → PostgreSQL
AI layer → structured input → C23 core → explanation
```

## Packages

- `packages/core-c` — deterministic C23 calculation engine.
- `packages/core-ts` — TypeScript API and future WASM adapter.
- `packages/verticals` — vertical module metadata.
- `apps/web` — mobile-first PWA.
- `apps/api` — backend shell.

## Rule

One input must produce the same result everywhere: browser WASM, server native, tests.
