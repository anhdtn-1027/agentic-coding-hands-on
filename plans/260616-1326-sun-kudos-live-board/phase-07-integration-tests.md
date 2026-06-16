# Phase 07 — Integration, Responsive Polish, Tests, Review

**Status:** completed | **Priority:** P1 | **Sections:** all
**Depends on:** Phases 02–06

## Goal
Assemble full page, verify visual match, harden responsiveness, test, review, deliver.

## Work
- Wire all sections into `app/[locale]/sun-kudos/page.tsx` in correct order: Banner → Input →
  Highlight → Spotlight → (All Kudos main + Sidebar right) two-column → footer.
- Responsive pass: main+sidebar two-column on desktop, single column (sidebar below) on mobile;
  carousel/spotlight/feed reflow; header side padding already responsive.
- Visual validation loop vs MoMorph design image (`get_frame_image`) — adjust spacing/colors/typography to match.
- Tests (`tester`): unit tests for interactive parts — `heart-button` toggle, `copy-link-button`
  clipboard+toast, `highlight-carousel` nav/disabled, filter dropdown open. Vitest + RTL.
- Review (`reviewer`): correctness, a11y (alt text, button roles, focus), pixel-fidelity, file size < 200 lines.
- `npm run lint` + `npm run build` clean.

## Delivery
- `project-manager`: sync phase statuses back to plan.
- `doc-writer`: update `docs/system-architecture.md` Components section + changelog.
- Ask user before commit via `git-manager`.

## Success Criteria
- Full page matches design at desktop; graceful responsive on mobile; all tests pass; build+lint clean; reviewer approved.
