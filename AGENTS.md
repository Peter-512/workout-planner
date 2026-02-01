# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains the SvelteKit application: routes in `src/routes`, shared UI and utilities in `src/lib`, and service worker logic in `src/service-worker.ts`.
- `static/` holds static assets served as-is (icons, images, manifest files).
- `supabase/` stores local database configuration and migrations (`supabase/migrations`).
- Root config files include `svelte.config.js`, `vite.config.ts`, `tsconfig.json`, `eslint.config.js`, and `compose.yaml`.

## Build, Test, and Development Commands
Use `pnpm` (workspace is configured via `pnpm-workspace.yaml`). Key scripts from `package.json`:
- `pnpm dev`: start Supabase locally, then run Vite dev server.
- `pnpm dev:mobile`: same as dev, but binds to `0.0.0.0` for device testing.
- `pnpm build`: production build via Vite.
- `pnpm preview`: preview the production build locally.
- `pnpm check` / `pnpm check:watch`: run Svelte + TypeScript diagnostics.
- `pnpm lint`: Prettier check plus ESLint.
- `pnpm format`: auto-format with Prettier.
- `pnpm db:migration:new`, `pnpm db:migration:auto`, `pnpm db:types`, `pnpm db:reset`, `pnpm db:stop`: Supabase schema workflow.

## Coding Style & Naming Conventions
- Formatting is enforced by Prettier; linting by ESLint. Run `pnpm format` before committing.
- TypeScript is enabled; prefer explicit types for exported functions and shared utilities.
- Keep Svelte components and modules in `src/lib` and use clear, descriptive names (e.g., `WorkoutCard.svelte`, `useWorkoutStore.ts`).
- Route files follow SvelteKit conventions under `src/routes`.

## Testing Guidelines
- There is no dedicated test runner configured yet.
- Use `pnpm check` and `pnpm lint` as the primary quality gates.
- If you add tests, colocate them with the feature (e.g., `src/lib/.../*.test.ts`) and document the runner in this file.

## Commit & Pull Request Guidelines
- Recent commits use a Conventional Commits style (e.g., `feat: ...`, `fix: ...`). Follow this pattern when possible.
- Keep commit messages imperative and specific.
- PRs should include a clear description, linked issues (if any), and screenshots or short clips for UI changes.
- For database changes, include a Supabase migration and update generated types (`pnpm db:types`).

## Security & Configuration Tips
- Do not commit secrets. Use environment variables and Supabase config files as appropriate.
- When changing database schema, update migrations in `supabase/migrations` and verify local reset with `pnpm db:reset`.
