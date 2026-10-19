# Кварта

Лендинг микрообжарочной в Минске. Next.js, форма заявки и база Supabase.

## Локальный запуск

```bash
npm install
```

Скопируйте `.env.example` в `.env.local` и подставьте значения из Supabase. Файл `.env.local` не коммитится.

В SQL Editor выполните целиком, по порядку:

1. `supabase/migrations/001_create_leads.sql`
2. `supabase/migrations/002_add_first_touch_attribution.sql`

Вторая миграция нужна, если первая уже была выполнена раньше. Повторно вставлять `001` в существующую базу не нужно.

```bash
npm run dev
```

Сайт откроется на http://localhost:3000. Проверка соединения с базой: `npm run db:check`.

## Переменные окружения

Их читает только сервер. Не добавляйте префикс `NEXT_PUBLIC_`: иначе значения попадут в браузер.

| Переменная | Где используется | Секрет |
|---|---|---|
| `SUPABASE_URL` | серверный клиент Supabase | нет, но не публикуйте в клиентском коде |
| `SUPABASE_SECRET_KEY` | запись заявок, обходит RLS | да |
| `SITE_URL` | абсолютные ссылки Open Graph, если домен известен заранее | нет |

`SITE_URL` необязательна. На Vercel без неё берётся `VERCEL_PROJECT_PRODUCTION_URL`, затем `VERCEL_URL`. Пример: `https://kvarta.example`.

Ключ должен быть secret key проекта Supabase, не publishable и не anon.

## Деплой на Vercel

Локальная команда `npm run build` проверяет сборку. Она не публикует сайт и не вызывает рабочий адрес Vercel.

Оставшиеся шаги вручную:

1. Залейте репозиторий на GitHub, GitLab или Bitbucket, если его там ещё нет. Не добавляйте `.env.local`.
2. На [vercel.com/new](https://vercel.com/new) импортируйте этот репозиторий. Framework Preset: Next.js. Root Directory: корень проекта. Команды оставьте по умолчанию: install `npm install`, build `npm run build`.
3. В настройках проекта откройте Settings → Environment Variables и добавьте для Production и Preview:
   - `SUPABASE_URL`
   - `SUPABASE_SECRET_KEY`
   - `SITE_URL`, если уже есть постоянный домен
4. Убедитесь, что ни одна из этих переменных не называется `NEXT_PUBLIC_...`.
5. Нажмите Deploy.
6. После успешного деплоя откройте выданный адрес и отправьте тестовую заявку. В Supabase, в таблице `leads`, должна появиться строка. Повтор того же номера в течение 10 минут должен показать сообщение, что заказ уже принят.
7. Если подключаете свой домен, укажите его в `SITE_URL` и сделайте redeploy, чтобы ссылки Open Graph собрались с этим адресом.

Пока шаги 1–7 не выполнены, продакшен-деплой и проверка живого API на Vercel не считаются пройденными.

## Что уже устроено в коде

- `POST /api/lead` выполняется в Node.js serverless-функции, не в Edge.
- Клиент Supabase помечен `server-only` и вызывается только из этого обработчика.
- Картинки лежат в `public/images` и отдаются через `next/image`.
- Шрифты Inter и Playfair Display подключаются через `next/font` и забираются во время сборки.
- Open Graph использует заголовок, описание и `public/images/hero.jpg` (512×286).
