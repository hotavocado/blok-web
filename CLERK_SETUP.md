# Clerk Setup for Blok Web

## Step 1: Create Clerk Account

1. Go to https://clerk.com and sign up
2. Create a new application called "Blok Web"
3. Enable Google OAuth:
   - Go to "Configure" → "SSO Connections"
   - Enable Google
   - Follow the OAuth setup

## Step 2: Get Your API Keys

From your Clerk dashboard, copy these values:

1. **Publishable Key** (starts with `pk_test_...`)
2. **Secret Key** (starts with `sk_test_...`)

## Step 3: Add to .env.local

Add these to your `.env.local` file:

\`\`\`
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
\`\`\`

## Step 4: Configure Convex + Clerk Integration

In your Convex dashboard (https://dashboard.convex.dev):

1. Go to Settings → Environment Variables
2. Add:
   - `CLERK_ISSUER_URL` (from Clerk dashboard → API Keys → "Issuer URL")

## What's Included

✅ Google OAuth (one-click sign in)
✅ Automatic user creation
✅ Protected routes
✅ User profile sync with Convex
✅ Session management

## Next Steps

After adding your keys, restart your dev servers:
\`\`\`bash
npm start
npx convex dev
\`\`\`
