# Clarifications — E2E for Homepage SAA / Award System / Countdown Prelaunch

## Session 2026-06-23
- Q: 3 of 6 listed features (Login, Đa ngôn ngữ, Like Kudos) already have e2e specs — what to do? → A: New 3 only — write specs for Homepage SAA, Award System, Countdown Prelaunch; leave existing specs untouched
- Q: How to scope new specs vs MoMorph test cases? → A: Map to MoMorph TC IDs (tag each e2e test with its TC ID, matching the existing convention)
- Q: How to test time-dependent countdown states (NEXT_PUBLIC_EVENT_DATETIME baked at server start)? → A: Test default + structural at e2e level; exact value/zero/invalid cases stay in unit tests (use-countdown already unit-tested)
- Q: Award System TC route is /he-thong-giai but implemented route is /awards-information? → A: Tests target the implemented route /awards-information; TC path is design-intent only
- Q: Homepage TCs reference no-op placeholders (notification panel, widget quick-action menu, admin dashboard)? → A: Test actual implemented behavior; placeholder/no-op TCs are asserted at presence level or marked covered-elsewhere, never faked
- Q: Award nav + homepage award-grid columns are responsive (nav hidden below lg)? → A: Run desktop viewport for nav/grid tests; assert responsive column counts only where deterministic
