create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  avatar_url text,
  timezone text not null default 'UTC',
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text not null default '',
  category text not null,
  color text not null,
  icon text not null,
  schedule_type text not null check (schedule_type in ('daily', 'weekly')),
  scheduled_days integer[] not null default '{}',
  preferred_time_slot text not null check (preferred_time_slot in ('morning', 'midday', 'evening', 'anytime')),
  goal_label text not null default '',
  cue_note text not null default '',
  reward_note text not null default '',
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  status text not null check (status in ('completed', 'missed', 'skipped')),
  completed_at timestamptz,
  note text not null default '',
  mood integer not null default 3 check (mood between 1 and 5),
  energy integer not null default 3 check (energy between 1 and 5),
  created_at timestamptz not null default now(),
  unique (habit_id, log_date)
);

create table if not exists public.reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reflection_date date not null,
  wins text not null default '',
  blockers text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  unique (user_id, reflection_date)
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    full_name,
    avatar_url,
    timezone,
    onboarding_completed
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    null,
    coalesce(new.raw_user_meta_data ->> 'timezone', 'UTC'),
    false
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.reflections enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_upsert_own" on public.profiles;
drop policy if exists "habits_select_own" on public.habits;
drop policy if exists "habits_modify_own" on public.habits;
drop policy if exists "habit_logs_select_own" on public.habit_logs;
drop policy if exists "habit_logs_modify_own" on public.habit_logs;
drop policy if exists "reflections_select_own" on public.reflections;
drop policy if exists "reflections_modify_own" on public.reflections;

create policy "profiles_select_own"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "profiles_upsert_own"
  on public.profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "habits_select_own"
  on public.habits
  for select
  using (auth.uid() = user_id);

create policy "habits_modify_own"
  on public.habits
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "habit_logs_select_own"
  on public.habit_logs
  for select
  using (auth.uid() = user_id);

create policy "habit_logs_modify_own"
  on public.habit_logs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "reflections_select_own"
  on public.reflections
  for select
  using (auth.uid() = user_id);

create policy "reflections_modify_own"
  on public.reflections
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
