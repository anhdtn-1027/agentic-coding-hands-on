# Phase 01 — Foundation & Dependencies (Track B)

**Priority:** P0 · **Status:** completed · Blocks: 02,03,04

## Goal
Install deps, scaffold env + folder structure, extract design tokens, prep Next-16 docs.

## Steps
1. Read Next 16 docs (Read tool): `node_modules/next/dist/docs/` — App Router, middleware, fonts, metadata, Image/Link, i18n. Note deprecations.
2. Add deps: `next-auth@beta` (Auth.js v5), `next-intl`. Verify React 19 / Next 16 compat.
3. `.env.example` + `.env.local`: `AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `AUTH_URL`, `ADMIN_EMAILS`, `EVENT_DATETIME`. Never commit `.env.local`.
4. Design tokens → `app/globals.css` `@theme`: extract palette (dark bg, SAA yellow accent), fonts, radii from Figma (query_section/list_frame_styles on the 3 screens). Keep authoritative.
5. Folder structure: `components/{shared,login,homepage}/`, `lib/`, `messages/`, `i18n/`, `auth.ts`.

## Related files
- create: `.env.example`, `.env.local`, `lib/` , `components/{shared,login,homepage}/` (dirs)
- modify: `package.json`, `app/globals.css`, `next.config.ts`

## Success
Deps installed, `npm run build` clean baseline, tokens in globals.css, env documented.

## Security
`.env.local` gitignored (verify). No secrets committed. `AUTH_SECRET` generated.
