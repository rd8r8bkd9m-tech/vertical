# План разработки Vertical — MVP штукатурка

## Текущий статус (Foundation ✅)

###已完成
- ✅ Репозиторий scaffolded (monorepo pnpm)
- ✅ C23 core (C) — plastering calculation engine
- ✅ TypeScript adapter (@vertical/core-ts)
- ✅ Web shell (React/Vite PWA) — dashboard с калькулятором
- ✅ API shell (Fastify) — /health, /api/v1/plastering/calculate
- ✅ Docs-first архитектура (8 документов)
- ✅ Базовый types & interfaces

### Готово к использованию
```bash
pnpm install
pnpm dev  # запускает web на :3000
pnpm --filter @vertical/api dev  # api на :4000
```

---

## Этап 1: Plastering MVP Completion (Приоритет A)

### 1.1 Complete Core Calculation
**Файлы:** `packages/core-c/src/plastering.c`, `packages/core-ts/src/index.ts`

- [ ] Добавить тесты для C23 core (test_plastering.c)
- [ ] Синхронизировать логику C и TS версий (сейчас расхождения в protectionScore)
- [ ] Добавить расчёт откосов (slopes) — сейчас игнорируется
- [ ] Добавить расчёт сетки (mesh) — сейчас только стоимость
- [ ] Верификация: одинаковый результат для одних входных данных

**Acceptance:**
```bash
cmake --build build/core-c && ctest --test-dir build/core-c --output-on-failure
# Все тесты проходят, C и TS дают идентичные результаты
```

### 1.2 Wizard UI — Measurement Flow
**Файлы:** `apps/web/src/main.tsx`, новые компоненты

- [ ] Выделить калькулятор в отдельный компонент `<PlasteringWizard />`
- [ ] Пошаговый wizard вместо одной формы:
  - Шаг 1: Объект (клиент, адрес, тип помещения)
  - Шаг 2: Замер (площадь, слой, основание)
  - Шаг 3: Материалы (кто покупает, тип смеси)
  - Шаг 4: Допы (грунтовка, маяки, сетка, откосы)
  - Шаг 5: Логистика (этаж, лифт, доставка)
  - Шаг 6: Итог (цена, расход, срок, антидоп)
- [ ] Сохранение черновика в localStorage
- [ ] Валидация полей перед переходом

**Acceptance:**
- Пользователь может пройти 6 шагов
- Данные сохраняются при перезагрузке
- Нельзя перейти дальше без заполнения обязательных полей

### 1.3 Estimate Cards & List
**Файлы:** `apps/web/src/`, `packages/types/`

- [ ] Тип Estimate: `{ id, clientId, objectId, vertical, input, result, createdAt, status }`
- [ ] Список смет с фильтрами (статус, дата, клиент)
- [ ] Карточка сметы: превью суммы, защита %, статус
- [ ] Детальный просмотр сметы с редактированием
- [ ] Статусы: draft, sent, accepted, rejected, archived

**Acceptance:**
- Можно создать ≥3 сметы
- Сметы отображаются в списке
- Можно открыть и отредактировать черновик

### 1.4 Antidop Checklist UI
**Файлы:** `packages/core-c/include/vertical/antidop.h`, `apps/web/src/`

- [ ] Детализированный чеклист антидопа (не просто score %)
- [ ] Визуализация рисков: 🟢🟡🔴
- [ ] Пояснения для каждого пункта
- [ ] Рекомендации по улучшению защиты
- [ ] Экспорт чеклиста в КП (текстом)

**Acceptance:**
- Score разбит на конкретные пункты
- Каждый пункт имеет пояснение
- Видны рекомендации по улучшению

### 1.5 Internal Economy Dashboard
**Файлы:** `apps/web/src/`

- [ ] Переключатель «Клиент / Мастер»
- [ ] Вид мастера: себестоимость, маржа, резерв
- [ ] Вид клиента: только итоговая цена
- [ ] Детализация: работа, материал, логистика, риск
- [ ] Расчёт маржинальности в %

**Acceptance:**
- Переключатель меняет отображение
- Мастер видит маржу 15%+
- Клиент видит только финальную сумму

---

## Этап 2: Documents (Приоритет B)

### 2.1 Commercial Offer PDF
**Файлы:** `packages/documents/`, новый package

- [ ] Создать `@vertical/documents` package
- [ ] Шаблон КП PDF (A4, профессиональный дизайн)
- [ ] Секции: заголовок, объект, расчёт, условия, антидоп, подпись
- [ ] Генерация на сервере (API endpoint `/api/v1/estimates/:id/pdf`)
- [ ] Скачивание из UI

**Acceptance:**
- КП генерируется за <2 сек
- Содержит все разделы из PRODUCT_SPEC
- Выглядит профессионально (шрифты, отступы, лого)

### 2.2 Estimate PDF (Смета)
**Файлы:** `packages/documents/`

- [ ] Детализированная смета (таблица работ и материалов)
- [ ] Разделение: работы / материалы / логистика
- [ ] Итоговая сумма прописью
- [ ] Условия оплаты и сроки

**Acceptance:**
- Смета содержит таблицу с позициями
- Сумма прописью корректна
- Печатаемая версия A4

### 2.3 XLSX Export
**Файлы:** `packages/documents/`

- [ ] Экспорт сметы в XLSX
- [ ] Формулы для пересчёта при изменении quantities
- [ ] Два листа: смета + антидоп чеклист

**Acceptance:**
- XLSX открывается в Excel/Sheets
- Формулы работают
- Данные соответствуют PDF

---

## Этап 3: API + Data Persistence (Приоритет C)

### 3.1 PostgreSQL Schema
**Файлы:** `apps/api/prisma/schema.prisma` (новый)

- [ ] Установить Prisma
- [ ] Таблицы: users, clients, objects, estimates, estimate_versions
- [ ] Миграции
- [ ] Seed данные для тестов

**Schema пример:**
```prisma
model Estimate {
  id        String   @id @default(uuid())
  clientId  String?
  objectName String
  vertical  String   // "plastering"
  input     Json
  result    Json
  status    String   // draft|sent|accepted|rejected|archived
  antidopScore Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 3.2 API Endpoints
**Файлы:** `apps/api/src/routes/`

- [ ] `POST /api/v1/estimates` — создать
- [ ] `GET /api/v1/estimates` — список с фильтрами
- [ ] `GET /api/v1/estimates/:id` — детальная
- [ ] `PATCH /api/v1/estimates/:id` — обновить черновик
- [ ] `DELETE /api/v1/estimates/:id` — удалить
- [ ] `POST /api/v1/estimates/:id/send` — отправить клиенту
- [ ] `GET /api/v1/estimates/:id/pdf` — скачать PDF

**Acceptance:**
- CRUD работает через Postman/curl
- Валидация входных данных
- Обработка ошибок

### 3.3 Offline Sync (PWA)
**Файлы:** `apps/web/src/`

- [ ] Service Worker для offline режима
- [ ] Local-first: сохранение в IndexedDB
- [ ] Синхронизация при появлении сети
- [ ] Конфликт-резолвинг (последняя запись выигрывает)

**Acceptance:**
- Приложение работает без интернета
- Данные синхронизируются автоматически
- Нет потери данных

---

## Этап 4: AI Assistant (Приоритет D)

### 4.1 Genkit Setup
**Файлы:** `packages/ai/`

- [ ] Установить Genkit
- [ ] Настроить flow для парсинга текста
- [ ] Интеграция с LLM provider (OpenAI/Anthropic)

### 4.2 Text/Voice Parsing
**Файлы:** `packages/ai/src/flows/parse-measurement.ts`

- [ ] Парсинг сообщения: «Нужно оштукатурить 120 квадратов, слой 2см, 3 этаж, лифта нет»
- [ ] Извлечение структурированных данных
- [ ] Подстановка в форму wizard

**Acceptance:**
- Текст → JSON с полями input
- Точность извлечения >80%

### 4.3 Missing Fields Detection
**Файлы:** `packages/ai/src/flows/detect-missing.ts`

- [ ] Анализ заполненности полей
- [ ] Подсказки: «Не указан тип основания», «Не решено по откосам»
- [ ] Генерация вопросов клиенту

### 4.4 Client Explanation Generator
**Файлы:** `packages/ai/src/flows/explain-price.ts`

- [ ] Генерация понятного объяснения цены
- [ ] Язык: простой, без жаргона
- [ ] Структура: работа, материал, логистика, почему так

**Acceptance:**
- Объяснение занимает ≤5 предложений
- Понятно не-специалисту

---

## Этап 5: Second Vertical — Electrical (Приоритет E)

### 5.1 Electrical Module Design
**Файлы:** `packages/verticals/src/electrical/`, `packages/core-c/src/electrical.c`

- [ ] Inputs: площадь, точки (розетки/выключатели), кабель, щиток
- [ ] Calculations: длина кабеля, количество точек, работа
- [ ] Antidop: проект есть/нет, штробление, материал стен

### 5.2 Electrical Core (C23)
**Файлы:** `packages/core-c/src/electrical.c`, `include/vertical/electrical.h`

- [ ] Реализация расчётов
- [ ] Тесты
- [ ] TS adapter

### 5.3 Electrical Wizard UI
**Файлы:** `apps/web/src/components/electrical/`

- [ ] Wizard аналогично штукатурке
- [ ] Переключатель вертикалей
- [ ] Общие компоненты (клиент, объект, документы)

---

## Технические долги и улучшения

### Code Quality
- [ ] Настроить ESLint + Prettier
- [ ] Добавить Husky pre-commit hooks
- [ ] CI pipeline (GitHub Actions): lint, typecheck, test, build

### Testing
- [ ] Unit тесты для core-ts (Jest/Vitest)
- [ ] Integration тесты для API (Supertest)
- [ ] E2E тесты для web (Playwright)

### DevEx
- [ ] Docker Compose для локальной разработки (API + DB)
- [ ] .env.example с переменными
- [ ] Makefile или justfile для частых команд

### Performance
- [ ] Lazy loading для тяжёлых компонентов
- [ ] Memoization для расчётов
- [ ] Bundle size optimization

---

## Метрики успеха MVP

| Метрика | Target |
|---------|--------|
| Время создания сметы | <3 мин |
| Protection Score | ≥80% |
| Маржинальность | 15–25% |
| Количество шагов wizard | ≤6 |
| Offline поддержка | ✅ |
| PDF генерация | <2 сек |

---

## Timeline (оценка)

| Этап | Длительность | Приоритет |
|------|--------------|-----------|
| 1. Plastering MVP | 2–3 недели | A |
| 2. Documents | 1–2 недели | B |
| 3. API + Sync | 2 недели | C |
| 4. AI Assistant | 2 недели | D |
| 5. Electrical | 3–4 недели | E |

**Итого MVP готов через 5–7 недель**

---

## Следующие действия (прямо сейчас)

1. **Запустить dev окружение:**
   ```bash
   pnpm install
   pnpm --filter @vertical/web dev
   pnpm --filter @vertical/api dev
   ```

2. **Верифицировать текущий функционал:**
   - Открыть http://localhost:3000
   - Проверить работу калькулятора
   - Проверить API health

3. **Начать Этап 1.1:**
   - Добавить тесты в C23 core
   - Синхронизировать C и TS логику

---

## Риски

| Риск | Вероятность | Митигация |
|------|-------------|-----------|
| Расхождения C/TS | Средняя | Автоматические тесты на идентичность |
| Сложность PDF | Низкая | Использовать готовую библиотеку (pdfkit/react-pdf) |
| Offline sync | Средняя | Начать с простого localStorage, потом IndexedDB |
| AI costs | Высокая | Кэширование, лимиты, fallback на шаблоны |

---

*Документ живое, обновлять по мере прогресса*
