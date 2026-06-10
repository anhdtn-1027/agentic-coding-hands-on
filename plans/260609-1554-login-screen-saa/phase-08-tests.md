# Phase 08 — Tests & Visual Validation (Track B)

**Priority:** P1 · **Status:** completed · BlockedBy: 07

## Goal
Temper the work: unit + behavior tests, visual validation vs Figma, build/lint clean.

## Steps
1. Spawn `tester` subagent. Cover:
   - `use-countdown`: pad, tick, zero-state, invalid `EVENT_DATETIME` fallback (TC ID-39..43,56,57,60).
   - auth role mapping (ADMIN_EMAILS → admin/user), guard redirects (TC Login f62b0c97/45278c06).
   - i18n: vi default, switch vi/en/ja renders keys (TC ID-24..26,58 extended ja).
   - account menu role-based options (TC ID-36..38).
2. Visual validation (Playwright MCP vs `get_frame_image`) for all 3 screens — login, homepage, language dropdown open.
3. `npm run build` + `npm run lint` clean. Fix failures (spawn `debugger` if needed) → re-run until 100% pass.

## Success
All tests pass, build+lint clean, screens pixel-faithful, no console errors.
