create table if not exists public.wsw_yantao_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  role text not null default 'member' check (role in ('member', 'moderator', 'admin')),
  level integer not null default 1 check (level >= 1 and level <= 99),
  coins integer not null default 0 check (coins >= 0),
  avatar_url text,
  bio text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists wsw_yantao_profiles_role_idx
  on public.wsw_yantao_profiles(role);

alter table public.wsw_yantao_profiles enable row level security;

revoke all on public.wsw_yantao_profiles from anon, authenticated;
grant select on public.wsw_yantao_profiles to anon, authenticated;
grant insert (user_id, username, avatar_url, bio) on public.wsw_yantao_profiles to authenticated;
grant update (username, avatar_url, bio, updated_at) on public.wsw_yantao_profiles to authenticated;
grant all on public.wsw_yantao_profiles to service_role;

drop policy if exists "wsw-yantao public profiles are readable" on public.wsw_yantao_profiles;
create policy "wsw-yantao public profiles are readable"
  on public.wsw_yantao_profiles
  for select
  using (true);

drop policy if exists "wsw-yantao users create own profile" on public.wsw_yantao_profiles;
create policy "wsw-yantao users create own profile"
  on public.wsw_yantao_profiles
  for insert
  with check (
    auth.uid() = user_id
  );

drop policy if exists "wsw-yantao users update own public fields" on public.wsw_yantao_profiles;
create policy "wsw-yantao users update own public fields"
  on public.wsw_yantao_profiles
  for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
  );

-- Ordinary authenticated users only receive column-level UPDATE privileges for
-- username, avatar_url, bio, and updated_at. Admin updates for role, level, and
-- coins are performed through the Next.js API with SUPABASE_SERVICE_ROLE_KEY.
