# Community Events Board

A small events board. An admin posts local events (music nights, workshops, food fairs) and visitors browse them, save favourite categories, set reminders and design a card for an event.

## Features

**Admin**
- Log in with the seeded admin account.
- Add an event: title, category, city, date and time, price, description and image URL.
- Switch an event between Active and Inactive. Events are never deleted.
- Admin pages are blocked on the Next.js server, and admin APIs are blocked on the Express server.

**Visitors**
- Events page with active, upcoming events, nearest first.
- Category, city and text search filters that work together, with pagination.
- Signup and login with email and password (JWT).
- Pick favourite categories after signing up. My Feed shows upcoming events from those categories.
- "Remind me" on every event card and event page. It updates immediately, is saved, and rolls back with a message if saving fails.
- "Design your card" on the event page: 3 themes, 5 stickers (up to 3, removable), a live animated preview, saved per user and event.

**Everywhere**
- Loading, empty and error states, and prices like `₹1,50,000` with dates like `Sat, 18 Oct, 6:30 PM` (IST).
- Responsive layout for phone, tablet and laptop.

## Tech stack

| Area | Tools |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Redux Toolkit, lucide-react |
| Backend | Node.js, Express 5, Zod, bcrypt, jsonwebtoken, helmet, cors |
| Database | PostgreSQL with Prisma (migrations and seed) |
| Tests | `node --test` for the API, Vitest and Testing Library for the UI |

## Project structure

```
backend/
  prisma/            schema, migrations, seed
  src/
    routes/          URL to controller mapping
    controllers/     request and response handling
    services/        database logic
    validators/      Zod schemas
    middlewares/     auth, admin, validation, errors
  tests/             API tests
frontend/
  src/
    app/             pages (events, feed, preferences, admin, login, signup)
    components/      cards, forms, designer, navbar, shared UI
    store/           Redux auth slice
    lib/             API client, formatting, constants
    hooks/           data fetching hooks
    proxy.ts         server-side protection for /admin pages
PLANNING.md          requirements, approach and status
```

## Run it locally

You need Node 20.12 or newer and a running PostgreSQL server.

**1. Database and backend**

```bash
createdb community_events

cd backend
cp .env.example .env        # then set DATABASE_URL and JWT_SECRET
npm install
npx prisma migrate deploy   # creates the tables
npx prisma generate
npx prisma db seed          # 15 events and the admin account
npm run dev                 # http://localhost:4000
```

**2. Frontend** (second terminal)

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev                 # http://localhost:3000
```

Open http://localhost:3000. To check the API on its own, open http://localhost:4000/api/v1/health. It should return `{"status":"ok","database":"up"}`.

If the backend exits right away, `JWT_SECRET` or `DATABASE_URL` is missing from `backend/.env`.

### Admin login

```
email:    admin@example.com
password: Admin@123
```

## Environment variables

`backend/.env`

| Variable | Purpose | Example |
|---|---|---|
| `PORT` | API port | `4000` |
| `CLIENT_URL` | Frontend origin allowed by CORS | `http://localhost:3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/community_events` |
| `JWT_SECRET` | Secret used to sign tokens (required, the server will not start without it) | a long random string |
| `JWT_EXPIRES_IN` | Token lifetime | `7d` |

`frontend/.env.local`

| Variable | Purpose | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Where the frontend finds the API | `http://localhost:4000` |

## Database

Prisma schema: `backend/prisma/schema.prisma`. One migration per table lives in `backend/prisma/migrations`.

| Table | Purpose |
|---|---|
| `users` | Accounts, bcrypt hash, role `USER` or `ADMIN` |
| `events` | Event details, `is_active` flag |
| `user_favorite_categories` | Favourite categories, one row per user and category |
| `event_reminders` | One row per user and event |
| `event_card_designs` | One design (theme) per user and event |
| `event_card_stickers` | Up to 3 stickers per design, ordered by position |

Useful commands: `npx prisma migrate deploy`, `npx prisma db seed`, `npx prisma studio`.

## API

All routes are under `/api/v1`. Protected routes expect `Authorization: Bearer <token>`.
Errors look like `{ "error": { "message": "...", "details": [{ "field": "...", "message": "..." }] } }`.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/health` | Public | API and database status |
| POST | `/auth/signup` | Public | Create an account, returns user and token |
| POST | `/auth/login` | Public | Log in, returns user and token |
| GET | `/auth/me` | Logged in | Current user |
| GET | `/events` | Public | Active upcoming events. Query: `category`, `city`, `search`, `page`, `limit` |
| GET | `/events/cities` | Public | Cities that have upcoming events |
| GET | `/events/:id` | Public | One active event |
| GET, PUT, DELETE | `/events/:id/reminder` | Logged in | Read, enable or disable a reminder |
| GET, PUT | `/events/:id/card-design` | Logged in | Read or save the card design |
| GET, PUT | `/me/favorite-categories` | Logged in | Read or replace favourite categories |
| GET | `/me/reminders` | Logged in | Ids of events with a reminder |
| GET | `/me/feed` | Logged in | Upcoming events from favourite categories |
| GET | `/admin/events` | Admin | All events, including inactive and past |
| POST | `/admin/events` | Admin | Create an event |
| PATCH | `/admin/events/:id/status` | Admin | Body `{ "isActive": true or false }` |

### Request bodies

```
POST /auth/signup                { "name", "email", "password" }   password: 8 to 72 characters
POST /auth/login                 { "email", "password" }
POST /admin/events               { "title", "category", "city", "startsAt", "price", "description", "imageUrl" }
PATCH /admin/events/:id/status   { "isActive": true | false }
PUT /me/favorite-categories      { "categories": ["MUSIC", "FOOD"] }
PUT /events/:id/card-design      { "theme": "sunset" | "ocean" | "forest", "stickers": ["star", "fire"] }
```

Categories: `MUSIC`, `WORKSHOP`, `FOOD`, `SPORTS`, `KIDS`. Stickers: `star`, `heart`, `fire`, `music`, `party` (maximum 3).

## How the frontend talks to the backend

- Every page calls the Express JSON API through `frontend/src/lib/api.ts`, so a mobile app could use the same endpoints.
- After login the token is kept in the Redux store and in a session cookie. API calls send it as a Bearer header.
- The cookie exists so `src/proxy.ts` can check the user on the server before an `/admin` page is sent. The proxy asks the API who the token belongs to and redirects anyone who is not an admin.

## Tests and checks

```bash
cd backend && npm test && npm run lint
cd frontend && npm test && npm run lint && npm run build
```

The backend tests run against your local database, so run the migrations and the seed first. They clean up the users and events they create. They cover filters with pagination, admin authorization, favourites and feed, reminders, and card designs with the sticker limit. The frontend tests cover the reminder button (optimistic update and rollback) and price and date formatting.

## Short answers

**1. Database structure and why**  
Six PostgreSQL tables: users, events, favourite categories, reminders, card designs and stickers, created with Prisma migrations.  
Foreign keys keep the data consistent, and unique keys stop duplicate favourites, reminders and designs.  
Each user's choices live in their own tables, so many users can customise the same event.  
Events are switched off with `is_active` instead of deleted, so reminders and designs are kept.

**2. Filter query and index**  
`GET /events` builds one query with every filter sent (category, city, search) plus `is_active = true` and `starts_at > now()`.  
It sorts by `starts_at` and paginates with `skip` and `take`, with the page size capped at 50.  
There is an index on `(is_active, starts_at)` for this query, plus indexes on category and city.  
With more data I would add a `pg_trgm` index on title and description, because `ILIKE '%text%'` cannot use a normal index.

**3. Passwords and admin protection**  
Passwords are hashed with bcrypt before saving, and the plain text is never stored.  
Login returns a signed JWT, and an `authenticate` middleware verifies it and loads the user on every request.  
Every `/api/v1/admin` route also passes `requireAdmin`, and the `/admin` pages are checked by `proxy.ts` on the Next.js server.  
Hiding links in the UI is only for convenience, so the real checks happen on the server.

## What is left

- No edit or delete screen for events (not in the brief).
- Reminders are stored, but no notification is sent.
- The token cookie is not `HttpOnly`. A production version would set an `HttpOnly` cookie from the API.
- No rate limiting on login and signup.

## Where AI tools were used

I used an AI coding assistant (Claude Code) during this project. It helped with:

- the backend API: routes, services, validation, and the Prisma schema, migrations and seed
- the frontend pages and components, including the card designer and the reminder rollback
- the API and UI tests, this README and `PLANNING.md`

I reviewed the generated code, ran the tests and the app, and can explain every file.
