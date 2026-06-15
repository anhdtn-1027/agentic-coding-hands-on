# Clarifications — Login feature tests (unit + e2e)

Screen: Login — https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/GzbNeVGJHz

## Session 2026-06-15
- Q: Which test layers to set up (repo had Vitest node-only, no DOM/e2e)? → A: Unit + component + e2e (add @testing-library/react + jsdom + @playwright/test)
- Q: How should e2e handle authentication (real Google OAuth can't run headless)? → A: Stub next-auth routes with Playwright route interception (fake authed + unauthed states)
