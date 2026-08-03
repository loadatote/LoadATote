# Moving Tote Order App

A Render-deployable Next.js starter for ordering moving totes with:
- Supabase Auth
- Supabase Postgres data storage
- Customer cart and checkout
- Owner dashboard for pricing and stock control
- Order notifications stored in-app, with optional SMTP + SMS hooks

## Stack
- Next.js 14
- React + TypeScript
- Supabase
- Render free web service

## What is included
- Customer login / signup
- Product catalog with tote sizes
- Cart and checkout
- Billing + delivery instructions
- Email/SMS notification preference
- Owner-only admin page
- Pricing toggles and out-of-stock controls
- SQL schema and seed data

## What still needs your live services
The repo is ready for Supabase and Render, but you still need to add your own:
- Supabase project URL and anon key
- Supabase service role key
- Owner email list
- Optional SMTP credentials for real emails
- Optional Twilio credentials for real SMS

## Supabase setup
1. Create a new Supabase project.
2. Open the SQL editor.
3. Run `supabase/schema.sql`.
4. Add the environment variables from `.env.example`.

## Render setup
1. Push this repo to GitHub.
2. In Render, create a **Web Service** from the repo.
3. Build command:
   ```bash
   npm install && npm run build
   ```
4. Start command:
   ```bash
   npm start
   ```
5. Add the same environment variables in Render.

Render's free web services are intended for testing and hobby projects, not production.

## Environment variables
Use `.env.example` as the template.

## Recommended next steps
- Replace placeholder tote images with licensed product photos
- Add Stripe if you want card payments
- Add order status updates for owner and customer notifications
- Tighten RLS policies if you want fully customer-specific order visibility
- Add a real owner role table in Supabase profiles

## Notes
The app currently stores notifications in the database and will send real email or SMS only if SMTP or Twilio env vars are provided.
