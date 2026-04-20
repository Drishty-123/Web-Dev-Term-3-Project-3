# Supabase Setup

Use these steps to connect HabitPulse to a real Supabase project.

## 1. Create a Supabase project

- Create a new project in Supabase
- Wait for the database and authentication services to finish provisioning

## 2. Get the frontend keys

From `Project Settings -> API`, copy:

- `Project URL`
- `anon public` key

Add them to a local `.env` file:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 3. Configure Auth URLs

From `Authentication -> URL Configuration`:

- Set `Site URL` to `http://localhost:5173` during local development
- Add `http://localhost:5173` to Redirect URLs
- Add your deployment URL later for production

## 4. Run the SQL schema

Open the SQL Editor and run [schema.sql](./schema.sql).

This creates:

- `profiles`
- `habits`
- `habit_logs`
- `reflections`
- RLS policies
- A trigger that creates a profile row on user signup

## 5. Choose your auth behavior

You can use either:

- Email confirmation on:
  - user signs up
  - user confirms through email
  - user signs in after confirmation
- Email confirmation off:
  - user signs up and enters the app immediately

HabitPulse now supports both flows correctly.

## 6. Start the app

In VS Code terminal:

```powershell
npm.cmd install
npm.cmd run dev
```

## 7. Verify it is using the real backend

When Supabase env vars are present:

- Login page badge shows `Supabase mode`
- Settings page shows `supabase` backend mode
- New users are stored in Supabase Auth
- Profiles, habits, logs, and reflections persist in your real project
