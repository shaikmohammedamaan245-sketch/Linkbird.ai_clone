# Linkbird.ai Replica

## Environment

Create a `.env.local` with:

```
DATABASE_URL=postgres://user:pass@localhost:5432/db
BETTER_AUTH_SECRET=your-random-string
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

The app will run with safe fallbacks if these are missing (demo-only).

# Kandid Assignment – Linkbird.ai (Leads & Campaigns) – Next.js 15 Starter

This repo is a **production-ready starter** that already wires up:
- Next.js 15 (App Router, React 19)
- Tailwind CSS
- Drizzle ORM (PostgreSQL)
- Better Auth (email/password + Google OAuth)
- TanStack Query (infinite leads table)
- Zustand (sidebar, filters, selection)
- Basic shadcn-like UI primitives (you can swap/augment with `shadcn/ui`)

> ⚠️ _To meet the **exact** visual style of the demo, run the shadcn CLI and add the components you need (Table, Sheet, Sidebar, Button, Badge, Progress, Input, Breadcrumb, Card). This starter ships minimal equivalents so you can run demo end‑to‑end immediately._

## 1) Quick Start

```bash
# 1. clone
pnpm install
# or npm i / yarn / bun

# 2. env
cp .env.example .env.local
# fill DATABASE_URL (Neon/Supabase/local Postgres),
# GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BETTER_AUTH_SECRET

# 3. db
pnpm db:generate
pnpm db:migrate

# 4. dev
pnpm dev
```

### Deploy (Vercel)
- Add the same env vars in Vercel Project Settings.
- Set Postgres (Vercel Postgres/Neon/Supabase).
- `pnpm build` → `pnpm start` (Vercel handles automatically).

## 2) shadcn/ui (Recommended)
```bash
pnpm dlx shadcn@latest init
# then add components you want, e.g.:
pnpm dlx shadcn@latest add button input table sheet badge breadcrumb card progress sidebar
```

Update imports in `src/components` to use shadcn variants (already grouped to make this painless).

## 3) Tech Notes

- **Auth** via `better-auth` with credentials + Google. Protected routes are placed in `(app)` group and guarded by `middleware.ts`.
- **DB**: Drizzle with schema in `src/db/schema.ts`. Indices on foreign keys and dates for performance.
- **Leads**: Infinite scroll (`useInfiniteQuery`) requesting `/api/leads?cursor=...&q=...&status=...`.
- **Campaigns**: Sortable table, status filters, progress, response rate.
- **State**: Zustand for sidebar collapse, filters, and selection.
- **Accessibility**: Keyboard support for side sheet (ESC), focus traps simplified.

## 4) Database

Tables:
- `campaigns` – id (pk), name, status, createdAt
- `leads` – id (pk), name, email, company, campaignId (fk), status, lastContactAt, interactionCount

Run migrations with Drizzle Kit.

## 5) API

- `GET /api/leads` – paginated (cursor), searchable
- `PATCH /api/leads/:id` – optimistic status update
- `GET /api/campaigns` – list with aggregate stats
- `PATCH /api/campaigns/:id` – pause/resume/edit
- `DELETE /api/campaigns/:id` – delete

## 6) TODO / Nice-to-haves
- Dark mode via `next-themes` (toggle scaffolded)
- E2E tests with Playwright
- Unit tests for stores and utils
- Replace minimal UI with shadcn components for visual parity

Made for the **Kandid** internship assignment.
