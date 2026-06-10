# Phase 05 — Login Screen Body UI (Track A)

**Status:** completed · **Track A · parallel-runnable · owns `components/login/**` only (NOT header/footer).**

- Screen: Login — https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/GzbNeVGJHz
- Goal: pixel-perfect presentational body — background key visual (C), main content (B): "ROOT FURTHER" key visual (B.1), welcome text (B.2), Google login button (B.3) with hover/active/disabled+loading states via props.
- Out of scope: header (A) + footer (D) = shared chrome (Track B); auth logic, i18n wiring, real handlers.
- Integration contract: export presentational components consuming props — `GoogleLoginButton({ onClick, loading, disabled, label })`; body uses text via i18n keys/props passed by integration. No invented data — use Figma content.
