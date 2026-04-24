# Вертикаль / Vertical

**Вертикаль** — мобильный коммерческий терминал для строительных мастеров, бригад и компаний: заявка, замер, честная цена, защищённая смета, документы, клиентская ссылка и внутренняя экономика.

Первый продуктовый модуль: **механизированная штукатурка**.

## Принцип

- AI помогает заполнить и объяснить, разобрать текст и подсказать риски.
- Финальные деньги считает deterministic C23 core.
- C23 core является судейским расчётным контуром.
- UI, API, документы и AI orchestration написаны на TypeScript.
- Клиентская цена и внутренняя экономика разделены.

## Текущий foundation

```text
apps/web              React/Vite PWA dashboard
apps/api              Fastify API
packages/core-c       C23 calculation core
packages/core-ts      TypeScript adapter/fallback
packages/verticals    Vertical modules, first: plastering
packages/types        shared domain types
packages/ui           shared UI placeholder
packages/ai           AI orchestration placeholder
packages/documents    export/document placeholder
docs/                 product and engineering docs
```

## Продуктовая формула

```text
Заявка → Замер → Быстрая цена → Защищённая смета → КП → Договор → Работы → Акт → Оплата
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

Для проверки и сборки:

```bash
pnpm build
pnpm test
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
=======
## MVP Scope

Входит:

- штукатурный расчёт;
- материалы и мешки;
- работа;
- подъём и логистика;
- антидоп score;
- внутренняя экономика;
- PWA shell;
- docs-first архитектура.

Не входит в MVP:

- все вертикали;
- собственная LLM;
- бухгалтерия;
- Telegram;
- ERP.
>>>>>>> dbd821d (feat: bootstrap Vertical with C23 plastering core)
