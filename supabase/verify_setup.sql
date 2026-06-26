-- Run after schema.sql to verify the business table is locked to service_role.

select
  c.relname as table_name,
  c.relrowsecurity as rls_enabled
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname = 'wsw_yantao_profiles';

select
  grantee,
  privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name = 'wsw_yantao_profiles'
order by grantee, privilege_type;

select
  policyname,
  cmd,
  roles,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
  and tablename = 'wsw_yantao_profiles'
order by policyname;

select
  user_id,
  username,
  role,
  level,
  coins,
  titles,
  created_at,
  updated_at
from public.wsw_yantao_profiles
order by updated_at desc
limit 20;
