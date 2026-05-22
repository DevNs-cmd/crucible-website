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

## Supabase Setup

Copy `.env.example` to `.env.local` and fill in the Supabase publishable key plus the server-only service role key:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://rwbdlpkohczykgklmqyc.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-server-only-service-role-key
```

Create or repair the database by running every SQL file in `supabase/migrations/` in timestamp order in the Supabase SQL editor, or with the Supabase CLI after linking the project:

```bash
npx supabase link --project-ref rwbdlpkohczykgklmqyc
npx supabase db push
```

The repair migration also notifies PostgREST to reload its schema cache, which clears errors such as missing `applications.founder` after the column is added.

Optional demo data lives in `supabase/seed.sql`.

For Google sign-in, enable Google under Supabase Authentication Providers. Use this client ID:

```text
720883835873-plu15rvki36vg7ed17m9pf9naqv2tci2.apps.googleusercontent.com
```

Google OAuth also requires the matching client secret in Supabase. Add `https://rwbdlpkohczykgklmqyc.supabase.co/auth/v1/callback` as an authorized redirect URI in Google Cloud, and add `/admin` redirect URLs for local and production app domains in Supabase.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
