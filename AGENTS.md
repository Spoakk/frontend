# AGENTS.md

## Must-follow constraints

- Package manager is **npm**. Do not use pnpm or yarn.
- Supported locales are `en` and `tr` only. Language detection uses `localStorage` key `spoak_lang`.
- All user-facing strings must use `useTranslation()` from `react-i18next`. Never hardcode UI text.
- When adding a new string, add it to **both** `src/locales/en.json` and `src/locales/tr.json`. Missing keys fall back to `en` silently — missing `tr` keys will not error but will break the Turkish UI.
- `NEXT_PUBLIC_REOWN_PROJECT_ID` must be set or the app throws at startup (wagmi.ts throws on missing value).
- The CSP in `next.config.ts` is strict. External image sources are limited to `crafatar.com` and `mc-heads.net`. External API connections are limited to `sentry.io`, `api.modrinth.com`, and `relay.walletconnect.com`. Adding new external resources requires updating the CSP header in `next.config.ts`.
- `console.log` is stripped in production builds (only `error` and `warn` survive). Do not rely on `console.log` for production debugging.

## Validation before finishing

```bash
npm run build   # must pass with no errors
npm run lint    # must pass
```

TypeScript is strict — fix all type errors before finishing.

## Repo-specific conventions

- All tool pages live at `src/app/tools/<toolname>/page.tsx` and must be `"use client"` components.
- Registering a new tool requires two changes:
  1. Add a `ToolDef` entry to `TOOLS` array in `src/lib/tools.tsx` with a matching `key`.
  2. Add i18n keys under `features.tools.<key>` (title + description) and `nav.<key>` in both locale files.
- The `key` in `TOOLS` is the i18n lookup key — it must exactly match the locale key or the tool grid and sidebar will show blank labels.
- API calls go through `src/lib/api.ts`. The `getCached` helper has a 5-minute TTL and 100-entry cap. Endpoints that must not be cached (e.g., mcping) must call `get()` directly, not `getCached()`.
- The seedmap tile endpoint returns raw `Int16Array` binary (biome IDs), not JSON or an image. Do not treat it as a standard image URL.
- `src/lib/config.ts` is the single source for env vars — read from there, not directly from `process.env`.

## Important locations

- `src/lib/tools.tsx` — tool registry (TOOLS array + QUICK_LINK_KEYS)
- `src/locales/en.json` / `tr.json` — all UI strings
- `src/lib/api.ts` — all backend API calls
- `next.config.ts` — CSP headers, Sentry config, console stripping

## Change safety rules

- Do not modify the CSP policy without verifying all existing external resources still work.
- Do not change the `spoak_lang` localStorage key — it is the persisted language preference.
- The `QUICK_LINK_KEYS` tuple in `tools.tsx` is used for the hero section quick links. Removing a key from `TOOLS` without removing it from `QUICK_LINK_KEYS` will cause a runtime lookup failure.
- Sentry sourcemaps are disabled (`sourcemaps: { disable: true }`). Do not enable without confirming with the team.

## Known gotchas

- `i18n.ts` guards initialization with `if (!i18n.isInitialized)` — do not call `i18n.init()` elsewhere or it will conflict.
- `wagmi.ts` throws at module load time if `NEXT_PUBLIC_REOWN_PROJECT_ID` is empty. This will break the entire app, not just the sponsors/crypto page.
- Tool pages that use canvas (seedmap) must handle `ResizeObserver` for canvas sizing — do not set canvas dimensions via CSS alone or the bitmap will be distorted.
- The `Web3Provider` wraps only the sponsors page, not the root layout. Do not move it to the root layout — it would load WalletConnect on every page.
