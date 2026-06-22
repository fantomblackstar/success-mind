# Success Mind MVP

Marketing funnel + analytics dashboard for **Success Mind** — an AI co-founder assistant for CEOs and founders.

## Live links

| Service | URL |
|---------|-----|
| Funnel | `https://success-mind-ai.vercel.app/` |
| Dashboard | `https://success-mind-ai.vercel.app/dashboard` |

## Quick start

```bash
pnpm install
cp .env.example .env.local
# Fill in MONGODB_URI, DASHBOARD_USER, DASHBOARD_PASSWORD, SESSION_SECRET
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Seed demo data

```bash
pnpm seed
```

Populates sample users and funnel events for the dashboard.

## Environment variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `DASHBOARD_USER` | Admin dashboard username |
| `DASHBOARD_PASSWORD` | Admin dashboard password |
| `SESSION_SECRET` | Secret for signing session JWTs |

## MongoDB Atlas setup

1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a **M0 free cluster**
3. Database Access → Add user (username + password)
4. Network Access → Add IP `0.0.0.0/0` (MVP) or your Vercel IPs
5. Connect → Drivers → copy connection string
6. Replace `<password>` and set database name, e.g. `success-mind`
7. Paste into `MONGODB_URI` in `.env.local` and Vercel

## Funnel flow

1. **Landing** `/` — marketing page, hero + bottom CTAs
2. **Quiz** `/quiz?step=1..3` — 3 multiple-choice questions (nuqs)
3. **Email** `/email` — name + email (zod + react-hook-form)
4. **Paywall** `/paywall` — new users, two pricing tiers
5. **Early access** `/early-access` — returning users (July 1, 2026 message)
6. **Success** `/success` — after mock purchase

**Header Login** `/login` — returning users sign in with email only.

## Test scenarios

### New user

```
http://localhost:3000/?utm_source=google
→ Get Early Access → quiz (3 steps) → email + name → paywall → Buy Pro → success
```

### Returning user (email step)

```
http://localhost:3000/?utm_source=facebook
→ quiz → same email as before → /early-access
```

Check dashboard: **first touch** = google, **last touch** = facebook.

### Returning user (header login)

```
/login → enter existing email → /early-access
```

## Dashboard

- URL: `/dashboard/login`
- Credentials: set via `DASHBOARD_USER` / `DASHBOARD_PASSWORD` in env
- Metrics: overview, step conversions, by-source, first/last touch attribution

## Architecture

- **Next.js 16** App Router, single deployment
- **FSD frontend**: `screens/`, `widgets/`, `features/`, `entities/`, `shared/`
- **Server modules**: root `server/` (Mongoose, Nest-inspired services)
- **API**: thin `app/api/*` route handlers
- **UI**: shadcn/ui + Aceternity-style effects on landing
- **File naming**: kebab-case for all source files

## Key trade-offs

1. Email-only user identity (no password) — fast MVP, sufficient for funnel test
2. Event-sourcing lite — append-only `funnel_events` for analytics
3. Single app, two URLs (funnel + dashboard) — fastest deploy path
4. Aceternity effects on landing only — keeps funnel/dashboard lean
5. Fictional testimonials — mock marketing data for demo

## Deploy (Vercel)

1. Push to GitHub (public repo)
2. Import project as `success-mind-ai`
3. Set all env vars from `.env.example`
4. Deploy
