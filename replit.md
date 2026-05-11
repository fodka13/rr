# محمد الديزاين — Digital Canvas Hub

Arabic-language portfolio CMS for a design studio — showcasing works, publishing blog posts, managing categories and users, and featuring client testimonials.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `SESSION_SECRET` — session secret

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 + Drizzle ORM (PostgreSQL)
- Frontend: React + Vite + Wouter + TanStack Query + Tailwind v4 + shadcn/ui
- Font: Cairo (Google Fonts) — Arabic-first design
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — single source of truth for all API contracts
- `lib/db/src/schema/` — Drizzle ORM table definitions (users, categories, works, blogs, comments, visitors)
- `lib/api-client-react/src/generated/` — Orval-generated React Query hooks
- `lib/api-zod/src/generated/api.ts` — Orval-generated Zod request/response schemas
- `artifacts/api-server/src/routes/` — Express route handlers per domain
- `artifacts/api-server/src/middlewares/auth.ts` — base64 token auth + role middleware
- `artifacts/portfolio-cms/src/` — React frontend (pages, components, layouts)

## Architecture decisions

- **Contract-first API**: OpenAPI spec in `lib/api-spec/openapi.yaml` drives all codegen — never edit generated files
- **Simple token auth**: base64(userId:timestamp:random) tokens stored in localStorage, SHA256+salt password hashing — no JWT dependency
- **Role hierarchy**: super_admin > admin > editor > moderator > user — role checks via `requireRole()` middleware
- **RTL-first UI**: `dir="rtl"` on page roots, Cairo font everywhere, all copy in Arabic
- **api-zod index exports only from `./generated/api`** — the `./generated/types` TypeScript interfaces would create duplicate export names

## Product

- **Public pages**: Homepage (animated stats, featured logos, project grid, testimonials), Portfolio gallery with category filter, Blog listing and article view
- **Auth**: Register, login, token-based session
- **Comments**: Logged-in users can comment on any work or blog post
- **Admin panel** (roles): Dashboard stats, Works CRUD, Blogs CRUD, Categories CRUD, Comments moderation (feature/delete), Users management (ban/unban)

## User preferences

- App is in Arabic (RTL), keep all user-facing strings in Arabic
- Dark navy + teal theme (primary: `hsl(192 100% 42%)`)

## Gotchas

- After adding new API routes: rebuild the API server (`pnpm --filter @workspace/api-server run build`) then restart the workflow
- After editing `openapi.yaml`: run codegen (`pnpm --filter @workspace/api-spec run codegen`) before editing frontend
- The `lib/api-zod/src/index.ts` must only export from `./generated/api` — not `./generated/types` — to avoid duplicate export errors
- Default super_admin credentials: `admin@example.com` / `admin123` — change this in production

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
