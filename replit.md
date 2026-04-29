# Scholars Essentials

A student marketplace + PG (Paying Guest) accommodation finder for college students. Buy and sell textbooks/essentials, browse local PG accommodations on an interactive Leaflet map, and manage everything from a personal dashboard.

## Stack

- **Monorepo**: pnpm workspaces
- **Frontend**: React 19 + Vite 7 + Tailwind v4 + shadcn/ui + wouter + react-leaflet + Recharts
- **Backend**: Express 5 + Drizzle ORM + PostgreSQL
- **Auth**: Replit Auth (OIDC, browser session cookie)
- **API contract**: OpenAPI → Zod schemas + React Query hooks (orval)

## Artifacts

- `artifacts/api-server` — Express API at `/api/*`
- `artifacts/scholars-essentials` — React web app at `/`
- `artifacts/mockup-sandbox` — design exploration sandbox

## Database schema (lib/db/src/schema)

- `auth.ts` — sessions, users (Replit Auth)
- `profile.ts` — user_profiles (userType student/owner, city, lat, lng)
- `items.ts` — items (sellerId, title, price, condition, imageUrl)
- `accommodations.ts` — accommodations (ownerId, name, address, monthlyRent, lat/lng, amenities jsonb, gender preference)

## API surface (lib/api-spec/openapi.yaml)

- `GET /api/profile`, `PUT /api/profile`
- `GET /api/items`, `POST /api/items`, `GET /api/items/mine`, `GET/PUT/DELETE /api/items/:id`
- `GET /api/accommodations`, `POST /api/accommodations`, `GET /api/accommodations/mine`, `GET/PUT/DELETE /api/accommodations/:id`
- `GET /api/locations` — flat list of PG markers for the map
- `GET /api/dashboard/{summary,recent-activity,condition-breakdown,rent-stats}`
- `GET/POST /api/login`, `GET /api/logout`, `GET /api/auth/user` (Replit Auth template)

## Frontend pages

- `/` Home (hero + dashboard summary + recent activity)
- `/essentials` browse items (search + condition filter)
- `/essentials/:id` item detail
- `/pgs` browse accommodations (search + max rent slider)
- `/pgs/:id` PG detail (with embedded map)
- `/map` full Leaflet map with all PG markers (uses fitBounds)
- `/dashboard` protected — Profile, My Items, My PGs, plus charts (recharts)
- `/login` sign-in CTA

## Seeding

`pnpm dlx tsx artifacts/api-server/scripts/seed.ts` — inserts demo students, owners, items, and PGs.

## Notes

- Leaflet default marker icons require `delete L.Icon.Default.prototype._getIconUrl` plus `mergeOptions` with bundled PNG URLs (set up once in `src/main.tsx`).
- API server reads `PORT` from env; web artifact also binds to `PORT`.
- Auth flow: `/api/login` redirects to OIDC provider, callback creates a session cookie `sid`. Frontend uses `useAuth` from `@workspace/replit-auth-web`.
- GitHub: the user dismissed the GitHub integration once. If they ask again, re-propose the integration (preferred) or accept a personal access token as a secret.
