# Phase 06 — Homepage Screen Body UI (Track A)

**Status:** completed · **Track A · parallel-runnable · owns `components/homepage/**` only (NOT header/footer).**

- Screen: Homepage SAA — https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/i87tDx10uM
- Goal: pixel-perfect presentational body sections:
  - Hero (3.5): bg key visual, "ROOT FURTHER", "Coming soon", **countdown display** (DAYS/HOURS/MINUTES boxes — consume `lib/use-countdown.ts` from Track B), event info (B2), CTA buttons ABOUT AWARDS / ABOUT KUDOS (B3).
  - Root Further content block (B4).
  - Awards grid (C2): 6 cards (Top Talent, Top Project, Top Project Leader, Best Manager, Signature 2025 - Creator, MVP), 3/2/1-col responsive, hover lift, `Chi tiết` link. Card = presentational, `href` prop.
  - Sun* Kudos promo block (D1/D2) + Chi tiết button.
  - Widget button (6): floating bottom-right, `onClick` prop.
- Out of scope: header (A1) + footer (7) = shared chrome (Track B); navigation targets (placeholder hrefs passed by integration); auth/i18n wiring.
- Integration contract: components accept `href`/`onClick`/label props; text via props/i18n keys. No invented data — Figma content + spec text.
