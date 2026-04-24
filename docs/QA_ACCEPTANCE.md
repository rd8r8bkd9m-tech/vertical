# QA Acceptance

## Gate

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
cmake -S packages/core-c -B build/core-c -DCMAKE_BUILD_TYPE=Release
cmake --build build/core-c
ctest --test-dir build/core-c --output-on-failure
```

## MVP manual acceptance

- User can open PWA shell.
- User can input plastering measurement.
- Core returns material kg, bag count, labor cost, total price and protection score.
- Internal economy is separated from client price.
