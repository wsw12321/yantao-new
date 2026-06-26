# Supabase Single-Project Setup

This app uses one physical Supabase project for both Supabase Auth users and yantao business data.

The code still keeps two logical clients:

- Auth client: uses the project URL + anon key only for Supabase Auth session verification and cookie refresh.
- Business client: uses the same project URL + service role key only on the Next.js server for `wsw_yantao_profiles`.

This intentional split keeps migration simple: if business data later moves to a separate Supabase project, set `BUSINESS_SUPABASE_URL` to the new project URL and keep the same app code shape.

## Supabase Dashboard

Create or choose the single Supabase project used by both `water5-auth` and `wsw-yantao-next`.

Copy:

- Project URL -> `VITE_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_AUTH_SUPABASE_URL`, and optionally `BUSINESS_SUPABASE_URL`
- Project API anon public key -> `VITE_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_AUTH_SUPABASE_ANON_KEY`
- Project API service role secret -> `BUSINESS_SUPABASE_SERVICE_ROLE_KEY`

Do not expose the service role key in browser code or any `NEXT_PUBLIC_*` variable.

## Auth Settings

In the same Supabase project:

- Site URL: `https://auth.water555.com`
- Additional Redirect URLs:
  - `https://auth.water555.com/api/auth/callback`
  - `https://auth.water555.com/success`
  - `https://yantao.water555.com/**`
  - `http://localhost:3000/**`
  - `http://localhost:4321/**`

## SQL

Run these SQL files in this Supabase project's SQL Editor:

1. `supabase/schema.sql`
2. `supabase/verify_setup.sql`

Expected verification:

- `rls_enabled` is `true`.
- `service_role` has table privileges.
- `anon` and `authenticated` have no table privileges on `wsw_yantao_profiles`.
- `pg_policies` returns no active policies for `wsw_yantao_profiles`.

The table intentionally has no foreign key to `auth.users` and no `auth.uid()` policies even though both live in the same project.

## First Admin

1. Run both apps with real env vars.
2. Sign up or sign in through `auth.water555.com`.
3. Open `https://yantao.water555.com/dashboard` once so the profile row is created.
4. Copy the Supabase Auth user UUID from `wsw_yantao_profiles.user_id`.
5. Edit and run `supabase/bootstrap_admin.sql`.

After this, the user can open `/admin/users`.

## App Environment

`water5-auth`:

```env
VITE_PUBLIC_SUPABASE_URL=<single project url>
VITE_PUBLIC_SUPABASE_ANON_KEY=<single project anon key>
VITE_PUBLIC_AUTH_URL=https://auth.water555.com
VITE_PUBLIC_SITE_URL=https://yantao.water555.com
VITE_AUTH_COOKIE_DOMAIN=.water555.com
VITE_ALLOWED_REDIRECT_ORIGINS=http://localhost:3000,http://localhost:4321
```

`wsw-yantao-next`:

```env
NEXT_PUBLIC_AUTH_SUPABASE_URL=<single project url>
NEXT_PUBLIC_AUTH_SUPABASE_ANON_KEY=<single project anon key>
BUSINESS_SUPABASE_URL=
BUSINESS_SUPABASE_SERVICE_ROLE_KEY=<single project service role key>
NEXT_PUBLIC_AUTH_URL=https://auth.water555.com
NEXT_PUBLIC_SITE_URL=https://yantao.water555.com
NEXT_PUBLIC_COOKIE_DOMAIN=.water555.com
```

`BUSINESS_SUPABASE_URL` can be left blank in single-project mode; the code reuses `NEXT_PUBLIC_AUTH_SUPABASE_URL`. Set it explicitly only when business data moves to another Supabase project.

## Smoke Test

1. Visit `https://yantao.water555.com/dashboard` while signed out. It should redirect to the auth site.
2. Sign in. It should return to yantao and create one profile row.
3. Edit username/bio. The row should update in `wsw_yantao_profiles`.
4. Open `/api/me`; it should return the Supabase Auth user id and profile.
5. Sign out. Both `auth.water555.com` and `yantao.water555.com` should show a signed-out state.
