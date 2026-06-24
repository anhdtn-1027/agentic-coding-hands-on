# Implementation Report — Thể lệ integration

## Task
- Plan: plans/260624-0925-the-le-rules-modal/plan.md
- Status: DONE

## Files Modified / Created

| File | Action | Notes |
|------|--------|-------|
| `app/[locale]/layout.tsx` | Modified | Added KudosBoardProvider + WriteKudosModalHost imports and wrapping |
| `app/[locale]/sun-kudos/page.tsx` | Modified | Removed duplicate KudosBoardProvider + WriteKudosModalHost |
| `app/[locale]/homepage-client.tsx` | Modified | Added useState(rulesOpen), useKudosBoard, TheLeModal mount, new FAB props |
| `components/the-le/the-le-modal.tsx` | Modified | Replaced all VI inline strings with useTranslations("theLe") calls |
| `components/the-le/the-le-data.ts` | Modified | Replaced condition/description/label string fields with i18nKey refs; label (brand name) retained |
| `components/the-le/the-le-hero-tier-row.tsx` | Modified | Added useTranslations("theLe"); reads tier.i18nKey for condition + description |
| `components/the-le/the-le-collectible-badge.tsx` | Modified | Added useTranslations("theLe"); reads badge.i18nKey for alt text + label |
| `messages/vi.json` | Modified | Added "theLe" namespace — 15 top-level keys + 4 heroTiers + 6 badges = 25 keys |
| `messages/en.json` | Modified | Added matching "theLe" namespace — 25 keys, faithful EN translations |
| `app/preview-the-le/` | Deleted | Dev-only preview route removed |
| `e2e/the-le.spec.ts` | Created | 5 new e2e tests: FAB expand, rules dialog open, Viết KUDOS cross-open, Đóng close, Hủy collapse |

## Tests Status
- TypeScript (`npx tsc --noEmit`): PASS — 0 errors
- ESLint (`npm run lint`): PASS — 0 errors in modified files (pre-existing .claude/hooks/*.cjs errors unrelated)
- E2E (`CI=1 npx playwright test the-le sun-kudos write-kudos homepage`): **62/62 PASS** (21.1s)
  - the-le.spec.ts: 5/5 (new)
  - homepage.spec.ts: 30/30 (regression — all pass, provider lift did not break)
  - sun-kudos.spec.ts: 17/17 (regression — all pass)
  - write-kudos.spec.ts: 10/10 (regression — all pass)

## Acceptance Criteria
- [x] Task 1: KudosBoardProvider + WriteKudosModalHost lifted to locale layout; no double-provider on sun-kudos page
- [x] Task 2: HomepageClient wires WidgetButton.onOpenRules/onWriteKudos; TheLeModal mounted with correct callbacks
- [x] Task 3: 25 i18n keys in vi.json (VI verbatim) + 25 matching keys in en.json; all modal/badge/hero-row components use useTranslations("theLe"); structural data (nodeId, slug) stays in the-le-data.ts
- [x] Task 4a: app/preview-the-le/ deleted
- [x] Task 4b: 5-scenario e2e spec (a–e) all green

## Known Asset Gap (expected, not a blocker)
Badge PNGs at `public/the-le/badge-*.png` are not present. The server logs `⨯ The requested resource isn't a valid image for /the-le/badge-*.png received null` for all 6 during the rules-modal e2e test. The `onError` handler in `the-le-collectible-badge.tsx` hides the broken image, so the UI degrades gracefully and the test still passes. Assets will be uploaded separately when Figma export is available.

## Docs impact: minor
No architecture changes; the provider scope change is described in plan clarifications. No docs/ update required.
