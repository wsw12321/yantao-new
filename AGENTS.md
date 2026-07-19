# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js App Router project for the YT-Physics site. Application routes and API handlers live in `src/app`, shared React components in `src/components`, and Supabase/auth helpers in `src/lib`. Static assets belong in `public`, with existing images under `public/images`. Versioned database changes live in `supabase/migrations`, local Supabase settings are in `supabase/config.toml`, and longer setup notes are in `docs`. Local development orchestration lives in `scripts/local-supabase.mjs`.

Use the `@/*` TypeScript path alias for imports from `src`, for example `@/lib/auth` or `@/components/Navbar`.

## Build, Test, and Development Commands

- `pnpm install`: install dependencies using the pinned `pnpm@10.34.4` package manager.
- `pnpm dev`: start Next.js with `.env.local`, preserving the remote Supabase and real authentication flow.
- `pnpm dev:local`: start the complete local Supabase stack and Next.js, automatically signing in the local administrator.
- `pnpm dev:local:member`: use the same local stack but automatically sign in the regular member account.
- `pnpm db:start`: start local Supabase, apply pending migrations, and provision both test accounts.
- `pnpm db:stop`: stop local Supabase while preserving its data.
- `pnpm db:reset`: erase local data, reapply migrations, and recreate both test accounts.
- `pnpm build`: create a production build and run Next.js compile-time checks.
- `pnpm start`: serve the production build after `pnpm build`.
- `pnpm lint`: run ESLint with the Next.js core-web-vitals and TypeScript rules.

For remote development, copy `.env.example` to `.env.local`. The homepage can run without Supabase variables, but login, profile, and admin flows require the documented settings. The `dev:local` commands do not rewrite `.env.local`; they inject loopback Supabase credentials into the Next.js process. They require Docker, a free port 3000, and a working `docker version` in the current shell. Local database state persists until `pnpm db:reset`.

## Coding Style & Naming Conventions

Write TypeScript and React using strict mode assumptions from `tsconfig.json`. Prefer server components by default in `src/app`; add `"use client"` only for components that need browser state, effects, or event handlers. Use PascalCase for component files, such as `ProfileForm.tsx`, and camelCase for functions and variables. Keep route handlers named `route.ts` and pages named `page.tsx`.

Styling uses Tailwind CSS v4 plus global utilities in `src/app/globals.css`. Keep class names readable and reuse existing utilities such as `glass-panel` and `focus-ring` when appropriate.

Keep development auto-login server-only and fail closed. It must remain gated by `NODE_ENV=development`, an explicit enable flag, and loopback URLs for both Auth and Business Supabase; never expose its password or a service-role key through `NEXT_PUBLIC_*` variables.

## Testing Guidelines

No test runner or test files are currently configured. Before submitting changes, run `pnpm lint` and, for behavioral changes, `pnpm build`. For Supabase schema or authentication changes, also run `pnpm db:reset` followed by the relevant `dev:local` smoke test when Docker is available; report the missing Docker verification explicitly when it is not. If tests are added later, colocate focused tests near the feature or add a clear test directory, and document the new command in `package.json`.

## Commit & Pull Request Guidelines

The current history uses short summary commits, including Chinese messages such as `新研讨官网`. Keep commits concise and descriptive, preferably scoped to one change.

Pull requests should include a brief description, any required environment or Supabase migration steps, verification commands run, and screenshots for visible UI changes. Do not commit `.env.local` or service role keys; use the example env files for documentation.
