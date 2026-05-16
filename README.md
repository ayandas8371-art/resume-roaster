# 🔥 Roast My Resume

> Upload your resume. Get brutally roasted by AI. Then get the version you should've submitted.

A production-ready SaaS web app that uses AI to roast resumes with savage humor while secretly improving them. Entertainment meets career advancement.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS v3
- **UI**: shadcn/ui patterns, Framer Motion animations
- **Auth**: Clerk (email + Google login)
- **Database**: Supabase Postgres
- **Storage**: Supabase Storage (PDFs)
- **AI**: OpenRouter API (DeepSeek, GPT-4, etc.) + NVIDIA NIM (free fallback)
- **Payments**: RevenueCat + Stripe
- **Analytics**: PostHog
- **Email**: Resend
- **Deployment**: Vercel

## Quick Start

### 1. Install Dependencies

```bash
cd roast-my-resume
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your API keys:

```bash
cp .env.example .env.local
```

Required keys for basic functionality:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` — [clerk.com](https://clerk.com)
- `OPENROUTER_API_KEY` — [openrouter.ai](https://openrouter.ai) (or `NVIDIA_NIM_API_KEY`)
- `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` — [supabase.com](https://supabase.com)

### 3. Set Up Database

Run the SQL schema in your Supabase SQL Editor:
- Open `src/lib/schema.sql`
- Copy and execute in Supabase Dashboard → SQL Editor

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (marketing)/     # Landing page, pricing
│   ├── (dashboard)/     # Protected dashboard pages
│   ├── api/             # API routes
│   ├── sign-in/         # Clerk sign-in
│   └── sign-up/         # Clerk sign-up
├── components/
│   ├── marketing/       # Navbar, hero, footer, etc.
│   ├── upload-zone.tsx  # Drag-and-drop upload
│   ├── roast-card.tsx   # Roast display
│   ├── quota-meter.tsx  # Usage meter
│   └── pricing-card.tsx # Plan cards
├── hooks/               # React hooks
├── lib/                 # Core libraries
│   ├── ai.ts           # OpenRouter/NVIDIA AI integration
│   ├── auth.ts         # Clerk + Supabase auth bridge
│   ├── quota.ts        # Usage management
│   └── supabase.ts     # Database client
├── types/              # TypeScript types
└── utils/              # Formatting, sharing utils
```

## Deployment (Vercel)

1. Push to GitHub
2. Import in Vercel
3. Add all environment variables
4. Deploy

## License

MIT
