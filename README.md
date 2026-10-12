# Community Events Board

## Setup (Phase 1)

Requires Node >= 20.12 and PostgreSQL.

```bash
createdb community_events

# backend (http://localhost:4000)
cd backend
cp .env.example .env   # adjust DATABASE_URL
npm install
npx prisma generate
npm run dev

# frontend (http://localhost:3000)
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Health check: `GET http://localhost:4000/api/v1/health` -> `{"status":"ok","database":"up"}`
