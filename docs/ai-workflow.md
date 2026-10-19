# AI workflow

Application code lives under `src`. Project config stays at the repo root.

## Where things go

| Path | Use |
| --- | --- |
| `src/app/page.tsx` | Home page |
| `src/app/layout.tsx` | Root layout |
| `src/app/globals.css` | Global styles |
| `src/app/api/lead/` | Lead route handler (`route.ts` when the endpoint is defined) |
| `src/components/` | Shared UI |
| `src/lib/` | Shared helpers |
| `src/types/` | Shared types |
| `public/images/` | Static images, served from `/images/...` |
| `design/desktop.png` | Desktop visual reference |
| `design/mobile.png` | Mobile visual reference |
| `design/stitch-export/` | Exported design source |
| `AGENTS.md` | Next.js version notes for agents |

Import application code with the `@/` alias, which maps to `src/`. Example: `@/components/Header`.

`public/` stays at the repo root. Do not move it under `src`.

## Before changing framework code

This repo uses a Next.js version that may differ from older training data. Read the matching guide in `node_modules/next/dist/docs/` before adding routes, layouts, or route handlers. `src/app` is ignored if an `app` directory also exists at the repo root, so keep routing only under `src/app`.

## Building UI

Match `design/desktop.png` and `design/mobile.png` when those references are present. Put exported design files in `design/stitch-export/` and shipped image assets in `public/images/`.
