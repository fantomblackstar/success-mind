# Success Mind MVP

A marketing funnel and admin analytics dashboard for **Success Mind** — an AI mentor for founders.

**What it does:** landing page → quiz → email capture → paywall → early access, with UTM tracking and a `/dashboard` view of funnel performance and user attribution.

## Live deployment

| App | URL |
|-----|-----|
| Funnel | [https://success-mind.vercel.app/](https://success-mind.vercel.app/) |
| Analytics | [https://success-mind.vercel.app/dashboard/login](https://success-mind.vercel.app/dashboard/login) |

## Run locally

**Prerequisites:** Node.js 20+, pnpm, MongoDB (Atlas or local).

1. **Clone and install**
   ```bash
   git clone <repo-url>
   cd success-mind-mvp
   pnpm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```
   Set these in `.env.local`:

   | Variable | Description |
   |----------|-------------|
   | `MONGODB_URI` | MongoDB connection string |
   | `DASHBOARD_USER` | Admin dashboard username |
   | `DASHBOARD_PASSWORD` | Admin dashboard password |
   | `SESSION_SECRET` | Secret for signing session JWTs |

3. **Start the app**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

4. **Seed demo data** (optional, for dashboard charts)
   ```bash
   pnpm seed
   ```
   Creates sample users, funnel events, and attribution data. Requires `MONGODB_URI` in `.env` (the seed script reads `.env`, not `.env.local` — copy the same values or symlink).

5. **Sign in to the dashboard**
   - URL: [http://localhost:3000/dashboard/login](http://localhost:3000/dashboard/login)
   - Credentials: `DASHBOARD_USER` / `DASHBOARD_PASSWORD` from `.env.local`

## Funnel flow

| Step | Route | Notes |
|------|-------|-------|
| Landing | `/` | Marketing page |
| Quiz | `/quiz?step=1..2` | Two questions |
| Email | `/email` | Name + email |
| Paywall | `/paywall` | New users |
| Early access | `/early-access` | Returning users |
| Login | `/login` | Email-only sign-in |

## Architecture

This repo runs as a **single Next.js process** — one `pnpm dev` / one Vercel deployment handles UI, API routes, and server logic. There is no separate Express or Nest server.

**Why Next.js-only?**

- **One deploy, one runtime** — funnel and dashboard share auth, env, and DB connection; no CORS or service wiring for an MVP.
- **Colocated API** — `app/api/*` route handlers call shared `server/` modules directly (no HTTP hop between services).
- **Fast iteration** — fewer moving parts; ideal for validating funnel conversion before splitting into microservices.

**How code is organized**

```
src/          Frontend (Feature-Sliced Design)
  screens/    Full pages (landing, quiz, dashboard, …)
  widgets/    Reusable layout blocks (header, funnel shell)
  features/   User actions (login form, dashboard auth)
  shared/     UI kit, lib, config, API client

server/       Backend logic (imported by API routes, not a standalone server)
  database/   Mongoose models + connection
  modules/    Services (funnel, users, analytics)

app/          Next.js App Router — pages + API routes
```

**Other decisions (brief)**

| Choice | Why |
|--------|-----|
| FSD in `src/` | Clear boundaries between screens, widgets, and shared UI as the app grows |
| `server/` modules | Business logic stays testable and separate from thin route handlers |
| Append-only `funnel_events` | Simple analytics without a dedicated event pipeline |
| Email-only identity | No passwords in MVP; enough to test returning-user flows |
| JWT in httpOnly cookies | User session 30 days; admin session 1 day |
