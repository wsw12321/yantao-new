-- Run in the Supabase project that contains wsw_yantao_profiles.
-- Replace the zero UUID with the Supabase Auth user id, then run this after
-- that user has signed in to yantao once.

do $$
declare
  target_user_id uuid := '00000000-0000-0000-0000-000000000000'::uuid;
begin
  if target_user_id = '00000000-0000-0000-0000-000000000000'::uuid then
    raise exception 'Replace target_user_id with a real Supabase Auth user id before running this script.';
  end if;

  update public.wsw_yantao_profiles
  set
    role = 'admin',
    level = greatest(level, 5),
    updated_at = now()
  where user_id = target_user_id;

  if not found then
    raise exception 'No profile found for %. Sign in to yantao first so the profile is created.', target_user_id;
  end if;
end $$;
