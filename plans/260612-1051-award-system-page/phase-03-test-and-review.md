# Phase 03 — Quality gate: Test + Review

**Goal:** Verify against test cases; review code before delivery.

## Testing (tester agent)
Map to MoMorph test cases (screen zFYDgyj_pD):
- ID-0/1: authed access shows page; unauthed → /login redirect (proxy.ts)
- ID-2: reachable from main nav
- ID-3..8: layout/GUI — title, 6 nav items, 6 award blocks with correct qty/value, 336px images, Kudos banner
- ID-9/10/11: nav click scrolls + active state (single active); hover highlight
- ID-12: Kudos "Chi tiết" → /sun-kudos
- ID-13/14: invalid section id / failed nav → no JS error, graceful
- `npm run build` clean; `npm run test` (existing unit tests stay green)

## Review (reviewer agent)
- Correctness, file size <200 lines, DRY (reuse confirmed), security, i18n parity across vi/en/ja.

## Success criteria
- 100% relevant test cases pass; reviewer score ≥9.5 or all critical issues fixed.
