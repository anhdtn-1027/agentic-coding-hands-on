# Phase 04 — Shared Chrome + Countdown (Track B)

**Priority:** P0 · **Status:** completed · BlockedBy: 02,03 · Blocks: 07

## Goal
Build shared chrome consumed by both screens, pixel-perfect from Figma, i18n + auth aware.
Defines the **stable import interface** Track A depends on.

## Components (`components/shared/`)
- `site-header.tsx` — `variant: 'login' | 'home'`. login = logo + language. home = logo + nav links (About SAA 2025 / Awards Information / Sun* Kudos, selected/hover/normal) + notification bell (+badge) + language + account menu. Sticky. (Login spec A, Homepage A1).
- `site-footer.tsx` — `variant: 'login' | 'home'`. login = copyright only. home = logo + nav links + copyright (Login D, Homepage 7).
- `language-switcher.tsx` — button: flag + code + chevron; opens `language-dropdown`.
- `language-dropdown.tsx` — from **Dropdown-ngôn ngữ** (`hUyaaugye2`): VN/EN selected+option styling; **add JA** item. Click → setLocale + close; outside-click + Esc close (TC ID-30..35).
- `account-menu.tsx` — Profile / Sign out / (Admin Dashboard if role=admin). (Homepage A1.8, TC ID-36..38).
- `notification-button.tsx` — bell 40x40 + red badge when unread (mock unread flag). (A1.6, TC ID-27..29).
- `language-options.ts` — `[{code:'vi',label:'VN',flag},{en,'EN'},{ja,'JP'}]`.

## Countdown
- `lib/use-countdown.ts` — parse `EVENT_DATETIME` (ISO-8601), compute DAYS/HOURS/MINUTES, 2-digit pad, per-minute tick, zero-state, invalid→fallback (TC ID-39..43,56,57,60). Display component lives in Homepage body (phase 06) consuming this hook.

## Related files
- create: the components above under `components/shared/`, `lib/use-countdown.ts`
- Provide stub exports EARLY so Track A compiles against the interface.

## Success
Header/footer match Figma for both variants; language dropdown switches vi/en/ja; account menu role-aware; countdown ticks + edge cases.
