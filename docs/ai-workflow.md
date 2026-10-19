# Журнал работы с ИИ

Промпты ниже взяты из чата за 19 октября 2026. Служебные сообщения вроде «Briefly inform the user» не включены. Промпта, которым генерировался макет в Stitch, в этом чате нет.

## Design

Макет уже был готов до кода. Экспорт: [design/stitch-export](../design/stitch-export). Сверка: [design/desktop_main.png](../design/desktop_main.png), [design/desktop_footer.png](../design/desktop_footer.png), [design/mobile.png](../design/mobile.png). Коммит с файлами: `308c9df`.

Первый запрос в чате, 14:48, только задавал структуру папок:

```text
kvarta-coffee/
├── public/images/
├── src/app/api/lead/, page.tsx, layout.tsx, globals.css
├── src/components/, lib/, types/
├── design/stitch-export/, desktop.png, mobile.png
├── docs/ai-workflow.md
├── AGENTS.md
└── README.md

do this
```

## Implementation

15:30. Результат: `388b9d5`.

```text
We are building a landing page for "Кварта", a small coffee roastery in Minsk.

The visual design is already finalized in Figma, and I have an export from Google Stitch.

Project files:
- design/stitch-export — exported source code
- design/desktop_main.png design/desktop_footer.png — desktop reference
- design/mobile.png — mobile reference

Your task:
1. Inspect the existing Stitch export.
2. Identify its framework, assets, styles, fonts and dependencies.
3. Adapt the design into the existing Next.js App Router project.
4. Use TypeScript and Tailwind CSS.
5. Extract meaningful reusable components as per design for example:
   Header, Hero, CoffeeProducts, Subscription, RoastingProcess if present,
   About, Delivery, LeadForm, Footer.
6. Preserve the original visual appearance as closely as possible.
7. Use next/image for suitable local assets.
8. Avoid unnecessary client-side JavaScript.

Do not redesign the website. Do not invent new sections.
Do not change product prices or client facts.
Do not implement backend functionality yet.
```

15:52, адаптив и связь кнопок с формой. Коммит `f4671b9`.

```text
Improve the responsiveness and interactions of the Kvarta landing page while preserving the approved Figma design.

1. Support mobile screens from 320px wide.
2. Ensure there is no horizontal scrolling.
3. Make navigation usable on mobile.
4. Ensure all text is readable and buttons are touch-friendly.
5. Connect product CTAs to the lead form.
6. When a product CTA is clicked, preselect "one_time" and the corresponding product.
7. When the subscription CTA is clicked, preselect "subscription".
8. Smoothly scroll to the lead form.
9. Respect prefers-reduced-motion.
10. Use semantic HTML and accessible form controls.
Do not implement the backend yet.
```

После этого кнопки героя на десктопе были около 16px высотой: у десктопной версии пропал `py-space-sm` из экспорта Stitch. Заметила сама: «кнопки на херо очень узкие не такие как в макете фигма». Отступ возвращён в том же `f4671b9`, файл `src/components/Hero.tsx`.

## Backend

16:08. SQL и серверный клиент, без формы. Коммит `a05a750`.

```text
Implement the database layer for the Kvarta coffee landing page using Supabase PostgreSQL.

1. Generate a SQL migration that creates the leads table with all required fields.
2. Implement atomic duplicate prevention for the same normalized phone number within 10 minutes, including concurrent requests.
3. Create a server-only Supabase client using @supabase/supabase-js.
4. Use SUPABASE_URL and SUPABASE_SECRET_KEY.
5. Create .env.example containing placeholders only.
6. Add appropriate database indexes.
7. Ensure lead data is not publicly readable or writable through Supabase's public API.

Do not implement the frontend form yet.
Do not include real credentials in any committed files.
```

Сделан триггер `leads_before_insert`: `pg_advisory_xact_lock` и отказ с кодом `23505`. Файл: [supabase/migrations/001_create_leads.sql](../supabase/migrations/001_create_leads.sql).

16:38, форма и API. Коммит `ffbc12d`.

```text
Implement the complete lead submission flow for the Kvarta landing page.

Use:
- React Hook Form
- Zod
- POST /api/lead in a Next.js Route Handler
- The Supabase database function implemented previously

Frontend requirements:
1. Required name, phone and interest fields.
2. Optional comment and selected product.
3. Support Belarusian phone numbers in formats such as:
   +375291234567
   375291234567
   80291234567
   +375 (29) 123-45-67
4. Normalize valid numbers to +375XXXXXXXXX.
5. Reject invalid country codes, lengths and unsupported prefixes.
6. Display clear validation messages in Russian.
7. Disable the submit button while the request is pending.
8. Show success feedback without resetting the entire page.
9. Handle duplicate responses gracefully.
10. If the request fails, preserve entered values and display a helpful retry message.
11. Prevent accidental repeat submission from the UI.

Backend requirements:
1. Validate all fields again using Zod.
2. Never trust client-side validation alone.
3. Use the existing atomic deduplication database function.
4. Return structured JSON responses.
5. Return appropriate HTTP status codes.
6. Add reasonable field-length limits.
7. Do not log sensitive phone numbers or secrets.
8. Add a simple honeypot for spam protection.

Do not change the approved form design.
```

Ошибка была в пункте про повтор. После успеха кнопка оставалась неактивной, а второе нажатие в течение 10 минут ничего не показывало. Запросы: «почему если пишет что заявка отправлена а кнопка в моде дизэйбл все равно» и «когда я еще раз жму на кнопку в течеие 10 минут не выскакивает никакое ui предупреждение». Сервер уже отвечал 409. Сообщение «Заказ с этим номером уже принят…» добавлено в `src/components/LeadForm.tsx`.

17:07, атрибуция первого визита. Коммит `cb5ada5`, колонки в [002_add_first_touch_attribution.sql](../supabase/migrations/002_add_first_touch_attribution.sql).

```text
если это еще не заплементировано то сделай
Implement first-touch marketing attribution for the lead form.

Capture on the initial page visit:
- utm_source
- utm_medium
- utm_campaign
- utm_content
- utm_term
- yclid
- referrer
- landing_page (original landing URL)

Requirements:
1. Read attribution from the initial page URL.
2. Persist the initial attribution for the current tab session using sessionStorage.
3. Do not overwrite the original attribution during internal navigation.
4. Include attribution in the lead submission payload.
5. Validate and limit the lengths of attribution values on the server.
6. Store the fields in PostgreSQL.
7. Treat attribution as untrusted client-provided data.
8. Do not include sensitive form data in analytics URLs.

Add tests confirming that:
- UTM parameters are captured correctly.
- Attribution survives navigation before submission.
- A lead is created with the expected campaign values.
- Missing attribution does not block a valid submission.

Do not modify the visual design.
```

## QA

17:18.

```text
Act as a senior QA engineer and review the Kvarta landing page.

1. Valid Belarusian phone number is accepted.
2. Invalid phone number is rejected.
3. Phone numbers in different supported formats are normalized.
4. Two concurrent submissions with the same phone create only one database record.
5. Repeated submission within 10 minutes does not create a new record.
6. A submission after 10 minutes can create a new record.
7. Server errors are displayed clearly to the user.
8. Form data remains intact after failed submissions.
9. UTM parameters and landing page information are stored.
10. Subscription and product buttons preselect the correct interest.
11. Mobile layout works at 320px, 375px and 390px.
12. Keyboard navigation and form labels are accessible.

Run npm run lint, npx tsc --noEmit, npm run build.
Fix identified defects and rerun the failed checks.
```

Две ошибки нашлись раньше этого промпта, на пустой отправке. «поля инпута и телефона и текст под ними черные» и «а текст ошибки все равно черные»: рамки стали красными, текст нет, потому что класс `text-error` из токена Stitch не попал в CSS. Цвет задан явно, `#d32f2f`.

Клавиатура: «в тип заказа выделяется только первый чекбокс с Разовый заказ, подписка не выделяется». У двух radio было одно имя. Оба пункта теперь отдельные остановки Tab. Коммит `cd72798`.

Кейс «через 10 минут» проверялся сдвигом `created_at` на 11 минут по часам базы. Две одновременные заявки дали одну строку и ответы 201 и 409.

Lighthouse для мобильной ширины снят с локального `next start`, не с Vercel: 87 / 96 / 100 / 100. Отчёт: [lighthouse-mobile.report.html](lighthouse-mobile.report.html).
