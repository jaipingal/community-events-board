# Backend

Express API for the Community Events Board.

```bash
npm install
cp .env.example .env
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
npm run dev
```

Runs on http://localhost:4000. Requires Node 20.12 or newer.

Environment variables are listed in `.env.example`. `JWT_SECRET` must be set or the server will not start.

Health check: `GET /api/v1/health`
