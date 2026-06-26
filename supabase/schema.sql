create table if not exists public.wsw_yantao_profiles (
  user_id uuid primary key,
  username text not null,
  role text not null default 'member' check (role in ('member', 'moderator', 'admin')),
  level integer not null default 1 check (level >= 1 and level <= 99),
  coins integer not null default 0 check (coins >= 0),
  avatar_url text,
  bio text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.wsw_yantao_profiles
  drop constraint if exists wsw_yantao_profiles_user_id_fkey;

create index if not exists wsw_yantao_profiles_role_idx
  on public.wsw_yantao_profiles(role);

alter table public.wsw_yantao_profiles enable row level security;

revoke all on public.wsw_yantao_profiles from anon, authenticated;
grant all on public.wsw_yantao_profiles to service_role;

drop policy if exists "wsw-yantao public profiles are readable" on public.wsw_yantao_profiles;
drop policy if exists "wsw-yantao users create own profile" on public.wsw_yantao_profiles;
drop policy if exists "wsw-yantao users update own public fields" on public.wsw_yantao_profiles;

-- The Auth users and business tables live in the same physical Supabase
-- project today. This table intentionally avoids a foreign key to auth.users
-- and avoids auth.uid() policies so it can be moved to a separate Business
-- project later without changing application code.
--
-- All reads and writes go through the Next.js server. The server verifies the
-- Supabase Auth session with the anon key, then accesses business tables with
-- the service role key.
