# Вертикаль

**Вертикаль** — мобильный коммерческий терминал для строительных мастеров, бригад и компаний: заявка, замер, честная цена, защищённая смета, документы и внутренняя экономика.

Главная формула продукта:

```text
Заявка → Замер → Быстрая цена → Точная смета → КП → Договор → Работы → Акт → Оплата
```

Первый продуктовый модуль: **механизированная штукатурка**.

## Принцип

- AI помогает разобрать текст, подсказать риски и сформировать понятное объяснение клиенту.
- Финальные деньги считает deterministic engine.
- C23 core является судейским расчётным контуром.
- UI, API, документы и AI orchestration написаны на TypeScript.
- Клиентская цена и внутренняя экономика разделены.

## Текущий foundation

```text
apps/web              React/Vite PWA dashboard
apps/api              Fastify API
packages/core-c       C23 calculation core
packages/core-ts      TypeScript adapter/fallback
packages/verticals    vertical modules, first: plastering
packages/types        shared domain types
packages/ui           shared UI placeholder
packages/ai           AI orchestration placeholder
packages/documents    export/document placeholder
docs/                 product and engineering docs
```

## Быстрый старт

```bash
pnpm install
pnpm dev
```

Web:

```bash
pnpm --filter @vertical/web dev
```

API:

```bash
pnpm --filter @vertical/api dev
```

C23 core:

```bash
cmake -S packages/core-c -B build/core-c -DCMAKE_BUILD_TYPE=Release
cmake --build build/core-c
ctest --test-dir build/core-c --output-on-failure
```

## Проверка

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Первый пользовательский сценарий

```text
Штукатур приехал на объект → ввёл площадь стен, средний слой, этаж, лифт, материал → получил цену, расход мешков, работу, логистику, маржу и защиту сметы.
```

## Слоган

```text
Замерил. Посчитал. Объяснил. Закрыл.
```

## Уникальность

```text
Смета без споров: антидоп-проверка, условия выполнения, клиентская цена, внутренняя маржа и документы из одного сценария.
```
