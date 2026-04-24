# AGENTS.md

Правила для AI-агентов, работающих над проектом `vertical`.

## Главный контур

Работать внутри:

- `apps/web`
- `apps/api`
- `packages/core-c`
- `packages/core-ts`
- `packages/verticals`
- `packages/types`
- `packages/ui`
- `packages/ai`
- `packages/documents`
- `docs`

## Нельзя

- Не превращать MVP в ERP.
- Не добавлять новые вертикали, пока штукатурка не доведена до удобного MVP.
- Не давать AI считать финальные суммы.
- Не хранить деньги в float/double.
- Не смешивать клиентскую цену и внутреннюю экономику.

## Правило ядра

C23 core — судья расчёта. TypeScript/UI/AI могут подготавливать данные, но финальный расчёт делает core.

## Acceptance

Перед PR:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
cmake -S packages/core-c -B build/core-c -DCMAKE_BUILD_TYPE=Release
cmake --build build/core-c
ctest --test-dir build/core-c --output-on-failure
```
