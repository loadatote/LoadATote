# Load A Tote Moving Solutions

A starter web app for moving tote orders using:
- Next.js
- Supabase
- Render

## Features
- branded banner at the top
- dim branded background on every page
- tote catalog with product images
- cart and checkout
- bill of sale page for each order
- owner dashboard with order status updates
- owner button only appears when an owner is signed in
- owner redirect to the owner page after login

## Setup
1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Copy your Supabase URL and keys into Render.
4. Add your owner email in both `OWNER_EMAILS` and `NEXT_PUBLIC_OWNER_EMAILS`.
5. Push this repo to GitHub.
6. Create a Render Web Service from the repo.
7. Build command: `npm install && npm run build`
8. Start command: `npm start`

## Files to update later
- Replace the sample tote illustrations if you want real photos.
- Add Stripe if you want card payments.
- Add email or SMS delivery hooks if you want live notifications.
