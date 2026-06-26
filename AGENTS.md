# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js App Router project for the YT-Physics site. Application routes and API handlers live in `src/app`, shared React components in `src/components`, and Supabase/auth helpers in `src/lib`. Static assets belong in `public`, with existing images under `public/images`. Database setup SQL is in `supabase`, and longer setup notes are in `docs`.

Use the `@/*` TypeScript path alias for imports from `src`, for example `@/lib/auth` or `@/components/Navbar`.

## Build, Test, and Development Commands

- `pnpm install`: install dependencies using the pinned `pnpm@10.34.4` package manager.
- `pnpm dev`: start the local Next.js development server.
- `pnpm build`: create a production build and run Next.js compile-time checks.
- `pnpm start`: serve the production build after `pnpm build`.
- `pnpm lint`: run ESLint with the Next.js core-web-vitals and TypeScript rules.

For local configuration, copy `.env.example` to `.env.local`. The homepage can run without Supabase variables, but login, profile, and admin flows require the documented Supabase settings.

## Coding Style & Naming Conventions

Write TypeScript and React using strict mode assumptions from `tsconfig.json`. Prefer server components by default in `src/app`; add `"use client"` only for components that need browser state, effects, or event handlers. Use PascalCase for component files, such as `ProfileForm.tsx`, and camelCase for functions and variables. Keep route handlers named `route.ts` and pages named `page.tsx`.

Styling uses Tailwind CSS v4 plus global utilities in `src/app/globals.css`. Keep class names readable and reuse existing utilities such as `glass-panel` and `focus-ring` when appropriate.

## Testing Guidelines

No test runner or test files are currently configured. Before submitting changes, run `pnpm lint` and, for behavioral changes, `pnpm build`. If tests are added later, colocate focused tests near the feature or add a clear test directory, and document the new command in `package.json`.

## Commit & Pull Request Guidelines

The current history uses short summary commits, including Chinese messages such as `新研讨官网`. Keep commits concise and descriptive, preferably scoped to one change.

Pull requests should include a brief description, any required environment or Supabase migration steps, verification commands run, and screenshots for visible UI changes. Do not commit `.env.local` or service role keys; use the example env files for documentation.
