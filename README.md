# Blink.ai — Am I the Problem?

Blink.ai is a brutally honest AI that tells you if you're the problem.

## Setup

1. **Install** dependencies
   ```bash
   npm install
   ```
2. **Environment**: create `.env.local` with `OPENAI_API_KEY`.
3. **Run dev**
   ```bash
   npm run dev
   ```

## Deploy

Deploy on Vercel:
1. Push this repo to your Git provider.
2. Create a project in Vercel and set `OPENAI_API_KEY` env var.
3. Vercel will use `npm run build` and serve `.next` output.

## Branding

Replace `public/logo.png` and `public/favicon.ico` with your assets.

## Notes

No database is used. Rate limiting is IP-based in-memory, so it resets on server restart.
