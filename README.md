# Кварта — Coffee Roastery Landing Page

Landing page for a small independent coffee roastery in Minsk, featuring a coffee selection, subscription offering, delivery information, and a lead request form.

Live website: not deployed. There is no Vercel URL yet.

Design: no public Figma link. The chosen frames are [design/desktop_main.png](design/desktop_main.png), [design/desktop_footer.png](design/desktop_footer.png) and [design/mobile.png](design/mobile.png). The Stitch export is in [design/stitch-export](design/stitch-export).

## Tech Stack

Next.js (App Router), React, TypeScript, Tailwind CSS, React Hook Form, Zod, Supabase PostgreSQL, Vercel.

## Design & AI Workflow

I kept the visual direction outside the implementation so the page would follow the selected mockup instead of a generic generated layout.

- Google Stitch: produced the first full-page design. The export is in the repo; the original prompt was not saved.
- Figma: used to review that direction. The screenshots above are the source I compared against.
- Cursor AI: turned the export into Next.js components, then the API, validation, deduplication and tests.

My contribution: reference selection, art direction, design review, architecture decisions, Supabase setup, testing, and catching the mistakes below.

## Architecture

The landing page uses Next.js App Router. The form sends `POST /api/lead`.

Server-side Zod validation rejects malformed input. Leads are stored in Supabase PostgreSQL. A filesystem file would not survive on Vercel, because serverless functions have no reliable persistent disk.

The same normalized phone cannot create a second row within 10 minutes. The check is an advisory lock and a before-insert trigger, so two concurrent requests still produce one row. UTM parameters, Yandex Click ID, referrer and the original landing URL are stored with the lead.

## Running Locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Put `SUPABASE_URL` and `SUPABASE_SECRET_KEY` in `.env.local`. Do not prefix them with `NEXT_PUBLIC_`. Apply [supabase/migrations/001_create_leads.sql](supabase/migrations/001_create_leads.sql), then [002_add_first_touch_attribution.sql](supabase/migrations/002_add_first_touch_attribution.sql) if the first migration was already applied.

## AI Limitations & Manual Corrections

The database trigger was correct, but the first form was not. After a successful submit the button stayed disabled, and pressing it again within 10 minutes showed nothing: the client returned early when the values had not changed. I saw that by sending the same number twice. The API already answered 409. The button stays active now, and the form shows that an order for this number was already accepted. The change is in `src/components/LeadForm.tsx`, commit `ffbc12d`.

A second miss was visual. Error text stayed dark. The Stitch token `text-error` never became a real CSS class, so the message inherited the brown body color. I saw it on an empty submit. The message is now `#d32f2f`, in `src/app/globals.css` and the form.

Keyboard check found a third one. Tab highlighted only «Разовый заказ» and jumped to the coffee select, because both radios shared one name. Both options are now separate tab stops, and the whole plate gets the focus ring. Commit `cd72798`.

## Testing

`npm test` covers phone formats, first-touch attribution and the lead handler. Against the local API and Supabase: a valid Belarus number was stored, an invalid number returned 400 and created no row, two concurrent requests created one row, a repeat within 10 minutes returned 409, and a new row was created only after `created_at` was moved 11 minutes back. That last check did not wait 10 real minutes. The deployed Vercel API was not tested.

Mobile Lighthouse, local `next start`, not Vercel: Performance 87, Accessibility 96, Best Practices 100, SEO 100. Report: [docs/lighthouse-mobile.report.html](docs/lighthouse-mobile.report.html).

## AI Work Log

See [docs/ai-workflow.md](docs/ai-workflow.md).
