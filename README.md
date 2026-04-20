# HabitPulse

HabitPulse is a premium habit tracker built with React, TypeScript, and Supabase-ready services. It focuses on behavioral insights instead of simple streak counting, helping users understand which habits are stable, which are slipping, and what action to take next.

## Problem Statement

Most habit trackers stop at checkmarks. Students and young professionals often know whether they completed a habit, but they do not know why consistency drops, which routines are at risk, or when their habits work best.

HabitPulse solves this by combining:

- Daily habit execution with completion, miss, and skip states
- Context capture through note, mood, and energy inputs
- Behavioral analytics like 7-day consistency, 30-day consistency, streaks, momentum, best completion window, and at-risk detection

Why it matters:

- Better feedback loops create better routines
- Small behavior adjustments are easier than forcing motivation
- Insight-led tracking helps users recover faster when consistency breaks

## Target User

- College students balancing classes, projects, and personal routines
- Young professionals building focus, wellness, and productivity systems
- Anyone who wants more than a basic checklist habit app

## Features

- Authentication with Supabase-ready auth service
- Protected routes for authenticated pages
- Onboarding flow with starter habit packs
- Dashboard with:
  - Today Pulse summary
  - Quick-complete habit queue
  - Coaching cards
  - Consistency chart
  - Activity heatmap
- Habit Studio:
  - Create habits
  - Edit habits
  - Archive habits
  - Delete habits
  - Log daily completion context
- Insights page:
  - Completion trend chart
  - Category performance bar chart
  - Habit leaderboard
  - Rule-based coaching cards
- Journal page for daily reflections
- Settings page for profile editing and backend readiness
- Demo fallback mode when Supabase env vars are not present

## React Concepts Demonstrated

- Functional components
- Props and component composition
- `useState`
- `useEffect`
- Conditional rendering
- Lists and keys
- Lifting state up
- Controlled components
- React Router
- Context API
- `useMemo`
- `useDeferredValue`
- `useRef`
- `React.lazy` and `Suspense`

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Supabase
- Tailwind CSS
- Framer Motion
- Recharts
- date-fns
- Lucide React
- Vitest

## Project Structure

```text
src/
  components/
  constants/
  context/
  hooks/
  layouts/
  lib/
  pages/
  services/
  types/
```

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Add environment variables

Create a `.env` file based on `.env.example`.

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

If these variables are missing, the app still works in demo fallback mode for local exploration.

### 3. Configure Supabase Auth URLs

In your Supabase project:

- Set `Site URL` to your local or deployed frontend URL
- Add `http://localhost:5173` to Redirect URLs for local development
- Add your deployed Vercel or Netlify URL to Redirect URLs before going live

This project supports real Supabase email confirmation flows. If email confirmation is enabled, signup creates the account and sends the user to confirm their email before signing in.

### 4. Run the Supabase schema

Execute the SQL from [supabase/schema.sql](./supabase/schema.sql) in the Supabase SQL editor.

The schema includes:

- Tables for `profiles`, `habits`, `habit_logs`, and `reflections`
- Row Level Security policies
- A trigger that creates a `profiles` row automatically when a new auth user is created

### 5. Start development

```bash
npm run dev
```

### 6. Run tests

```bash
npm test
```

### 7. Production build

```bash
npm run build
```

## Supabase Schema

The project includes:

- `profiles`
- `habits`
- `habit_logs`
- `reflections`
- Row Level Security policies for per-user access

See [supabase/schema.sql](./supabase/schema.sql).

## Demo Mode

If Supabase is not configured, HabitPulse automatically runs with a local demo account:

- Email: `demo@habitpulse.app`
- Password: `habitpulse-demo`

This keeps the project explorable for grading and UI review without blocking on backend secrets, while the real Supabase integration remains in the codebase.

## Real Supabase Notes

- Signup now supports real email-confirmation mode
- If confirmation is required, the app does not treat the user as logged in until a real session exists
- A database trigger creates the `profiles` row automatically for new auth users
- If a signed-in user is missing a profile row, the app recreates it safely on first authenticated access

For a quick setup checklist, see [supabase/SETUP.md](./supabase/SETUP.md).

## Deployment

Recommended deployment:

- Vercel
- Netlify

Make sure to add the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables in the deployment platform.

## Suggested Demo Video Flow

1. Explain the problem and target user.
2. Show signup or login.
3. Walk through onboarding.
4. Create a habit.
5. Edit and archive a habit.
6. Log daily progress with note, mood, and energy.
7. Show the dashboard and insights.
8. Show reflections in the journal.
9. Show settings and explain Supabase integration.
