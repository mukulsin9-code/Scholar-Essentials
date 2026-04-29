# Scholars Essentials

A student-focused marketplace and PG (paying guest accommodation) finder for college towns. Buy and sell second-hand textbooks, lab coats, calculators, hostel essentials, and find verified PG accommodations near your campus — all in one place.

**Live website:** https://02feba4d-e263-4331-9315-bf8d5031b777-00-37tiada8kgj4j.picard.replit.dev

---

## What it does

Scholars Essentials is built for students who want to save money on essentials and find safe, affordable housing without endless WhatsApp groups and broker fees.

- **Marketplace** — list, browse, and buy second-hand textbooks, electronics, hostel gear, and stationery from other students on your campus.
- **PG Finder** — discover verified paying-guest accommodations on an interactive map, filter by rent, gender, food, and distance from college.
- **Student profiles** — sign in with your Replit account, manage your listings, message sellers, and save favourites.
- **Insights dashboard** — visualise price trends, popular categories, and PG availability with interactive charts.

## Tech stack

This is a pnpm monorepo with three deployable artifacts.

**Frontend** (`artifacts/scholars-essentials`)
- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- wouter (routing)
- react-leaflet (maps)
- Recharts (data visualisation)
- TanStack Query (server state)

**Backend** (`artifacts/api-server`)
- Node.js + Express 5
- Drizzle ORM + PostgreSQL
- Replit Auth (OpenID Connect)
- Zod for request/response validation

**Shared libraries** (`lib/`)
- `api-spec` — OpenAPI contract; React Query hooks and Zod schemas are generated from it
- Other shared utilities

**Tooling**
- pnpm workspaces
- TypeScript project references
- Orval for OpenAPI codegen

## Project structure

```
scholars-essentials/
├── artifacts/
│   ├── scholars-essentials/   # React + Vite web app
│   ├── api-server/            # Express + Drizzle API
│   └── mockup-sandbox/        # Component preview sandbox
├── lib/
│   └── api-spec/              # OpenAPI spec + generated client
├── scripts/                   # Shared utility scripts
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

## Running locally

Requires Node.js 20+, pnpm 9+, and a PostgreSQL database.

```bash
pnpm install

# generate API client from the OpenAPI spec
pnpm --filter @workspace/api-spec run codegen

# run database migrations
pnpm --filter @workspace/api-server run db:push

# start each service in its own terminal
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/scholars-essentials run dev
```

Set `DATABASE_URL` and `SESSION_SECRET` in your environment before starting the API server.

## License

This project is for educational and personal use.
