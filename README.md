# FormChat

Chat-style forms: build in a dashboard, share a public link or embed a floating widget, collect responses in Postgres.

**Stack:** Next.js 14 (App Router) · React · TypeScript · Tailwind CSS · Next API routes · PostgreSQL / Supabase (`pg`).

## Setup
```bash
npm install
cp .env.example .env.local      # set DATABASE_URL and ADMIN_PASSWORD
npm run dev                     # http://localhost:3000
```
Tables are created automatically on the first request (SQL also in `lib/schema.sql`).

**Supabase:** create a project → Project Settings → Database → copy the connection string (use the pooler URI on serverless hosts) into `DATABASE_URL`.

**Dashboard auth:** `/dashboard` and `/api/forms/*` use HTTP Basic auth with `ADMIN_PASSWORD` (any username). Public routes (`/f/*`, `/embed/*`, `/api/public/*`, `/widget.js`) stay open. Unset it for open local dev.

## Try the full flow
1. Open `/dashboard` → **New form** → add questions → **Publish**.
2. Public link: `/f/<slug>`.
3. Embed on any site:
   ```html
   <script src="https://YOUR-APP/widget.js" data-form="<slug>" async></script>
   ```
   Test locally via `/test.html?form=<slug>`.
4. Submit answers, then **Responses** in the dashboard shows each submission with its timestamp.

## Structure
- `app/api/forms/**` – owner CRUD, publish (PATCH), responses
- `app/api/public/[slug]` – public GET form / POST submission (server-side validation)
- `components/ChatForm.tsx` – chat UI (used by public page, iframe, preview, landing demo)
- `public/widget.js` – floating embed script (iframes `/embed/<slug>`)

## Deploy
Push to GitHub (`git init && git add . && git commit -m "FormChat MVP" && git remote add origin <url> && git push -u origin main`), import the repo in Vercel, set `DATABASE_URL` and `ADMIN_PASSWORD`.

## Known MVP limits
Single shared admin password (no per-user accounts), no rate limiting/CAPTCHA on public submissions.
