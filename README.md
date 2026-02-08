# INVIROGENS

A full-stack biotech website for INVIROGENS built with React + Express + TypeScript.

The app includes:
- Marketing pages (Home, About, Products, News, Contact, Order)
- Product and news APIs
- Contact inquiry submission with email relay fallback
- SEO essentials (`robots.txt`, `sitemap.xml`, canonical and social metadata)

## Tech Stack

- Frontend: React 18, Vite, TypeScript, Tailwind CSS, Radix UI, TanStack Query, Wouter
- Backend: Express 5, Node.js, TypeScript
- Validation: Zod
- Mail relay: Nodemailer (SMTP), Web3Forms fallback, FormSubmit fallback
- Data store: In-memory seeded storage (`server/seed.ts`, `server/storage.ts`)

## Project Structure

```txt
client/            # Vite React app
  public/          # Static assets/images
  src/             # Pages, components, hooks
server/            # Express server, routes, mail, seed, storage
shared/            # Shared schemas/types (Zod + TS)
script/            # Build script
```

## Prerequisites

- Node.js 20+
- npm 9+

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
cp .env.example .env
```

3. Start development server:

```bash
npm run dev
```

4. Open the app:

- `http://localhost:5000`

## Environment Variables

Defined in `.env.example`:

- `INQUIRY_TO_EMAIL` - destination email for contact inquiries
- `FORMSUBMIT_EMAIL` - FormSubmit fallback inbox
- `SMTP_HOST` - SMTP host
- `SMTP_PORT` - SMTP port
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password/app password
- `SMTP_FROM` - sender identity

Optional:

- `WEB3FORMS_ACCESS_KEY` - enables Web3Forms relay when SMTP is not configured
- `VITE_WEB3FORMS_ACCESS_KEY` - Web3Forms key used by the frontend contact form
- `PORT` - server port (default `5000`)
- `NODE_ENV` - `development` or `production`

## Available Scripts

- `npm run dev` - run full app in development mode
- `npm run build` - build frontend and bundled backend to `dist/`
- `npm run start` - run production server from `dist/index.cjs`
- `npm run check` - TypeScript type-check

## API Endpoints

- `GET /api/products` - list products
- `GET /api/products/:slug` - product detail
- `GET /api/news` - list news
- `GET /api/news/:slug` - news detail
- `POST /api/contact` - submit contact inquiry

SEO/system routes:

- `GET /robots.txt`
- `GET /sitemap.xml`

## Contact Submission Flow

`POST /api/contact`:

1. Validates payload with Zod (`insertContactSchema`)
2. Persists message to in-memory storage
3. Attempts relay in order:
   - SMTP (if configured)
   - Web3Forms (if `WEB3FORMS_ACCESS_KEY` is set)
   - FormSubmit fallback

## Production Build

```bash
npm run build
npm run start
```

Build output:
- Frontend static assets: `dist/public`
- Backend server bundle: `dist/index.cjs`

## Notes

- Data is currently seeded in memory at startup, so it resets on restart.
- For persistent storage, replace `MemoryStorage` in `server/storage.ts` with a DB-backed implementation.

## Repository

GitHub: https://github.com/70ayush-dev/invirogens
