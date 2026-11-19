# CraftShield ODOP — Next.js frontend

The original Vite React interface has been migrated into the Next.js App Router while retaining the existing Verification Studio, Artisan Portal, ODOP Explorer and How It Works views.

## Run locally

1. Start the existing Python FastAPI backend from the `ODOP_Project` root:

   ```bash
   uvicorn server:app --reload --port 8000
   ```

2. In another terminal, open this folder and install/run Next.js:

   ```bash
   cd craftshield-next
   npm install
   cp .env.example .env.local
   npm run dev
   ```

3. Open http://localhost:3000

The frontend calls the existing FastAPI API at `http://localhost:8000/api`. Change `NEXT_PUBLIC_API_BASE_URL` in `.env.local` if the backend runs elsewhere.

## Main App Router files

- `app/layout.tsx` — root layout and global styles
- `app/page.tsx` — home route (`/`)
- `app/CraftShieldApp.jsx` — interactive application shell
- `app/components/` — migrated React UI components
- `app/api.js` — browser-side API client for FastAPI

## Scope

This is the Next.js frontend migration. The existing Python verification engine, registry, QR/passport and PDF certificate modules remain in the parent project and are not rewritten as part of this frontend migration.
