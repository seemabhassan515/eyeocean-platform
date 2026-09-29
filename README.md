This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Local infrastructure (Postgres + Meilisearch)

This project uses Postgres (via Prisma) for the product catalog and Meilisearch
for search. Both run locally in Docker for development.

**Start everything with one command:**

```bash
npm run infra:up
```

This runs `docker compose up -d`, which starts both the `eyeocean-postgres`
and `eyeocean-meilisearch` containers using the settings in
`docker-compose.yml`. Stop them with `npm run infra:down`.

The individual scripts (`npm run postgres:up` / `postgres:down` and
`npm run meilisearch:up` / `meilisearch:down`) still work if you'd rather
start/stop one service at a time — they're kept for anyone already using
them.

**Environment variables:** `docker-compose.yml` reads `POSTGRES_PASSWORD` and
`MEILI_API_KEY` from a `.env` file at the project root (this is a plain
docker-compose/Docker CLI convention — it is separate from Next.js's own
`.env.local`, which the app itself reads for `DATABASE_URL`, `MEILI_HOST`,
and `MEILI_API_KEY` at runtime). Copy `.env.example` to `.env.local` for the
app's own config; for `docker-compose.yml` to start containers, make sure a
root `.env` also defines `POSTGRES_PASSWORD` and `MEILI_API_KEY` (matching
whatever you put in `.env.local`'s `DATABASE_URL` and `MEILI_API_KEY`).

**Migrations and seeding:**

```bash
npx prisma migrate dev   # apply/create database migrations
npx prisma db seed       # seed the database (see prisma/seed.ts)
npm run seed:search      # seed the Meilisearch index (see scripts/seed-meilisearch.ts)
```

Prisma's CLI configuration (schema path, migrations path, seed command) lives
in `prisma.config.ts` at the project root.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
