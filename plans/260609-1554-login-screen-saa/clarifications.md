# Clarifications — SAA 2025 Login + Homepage + Language Dropdown

## Session 2026-06-09

- Q: How should Google login be implemented? → A: Auth.js (NextAuth v5) + Google provider, JWT session (no database); credentials via env
- Q: What scope this session? → A: Login + Homepage SAA + Language dropdown (Dropdown-ngôn ngữ)
- Q: Post-login redirect target ("Homepage SAA" / main app page)? → A: Redirect to / and replace the default Next.js starter landing with the Homepage
- Q: Language switcher behavior? → A: Full i18n with next-intl, default VN, working language dropdown
- Q: Languages — design says VN/EN only; user requested VN/EN/JP? → A: Add JP now (VN/EN/JP), deviating from design; invent JP flag/option + author JP translations not in Figma
- Q: Homepage build depth (46 specs, many out-of-scope links)? → A: Full UI + real-time countdown + i18n; out-of-scope links (Awards Information, Sun* Kudos, About SAA, Profile, Admin, Notifications) become placeholder routes / no-op menus
- Q: How is admin role determined (Auth.js + Google + JWT, no DB)? → A: Env email allowlist (ADMIN_EMAILS); session marks role=admin when Google email matches
- Q: Countdown event datetime source? → A: ISO-8601 value from env var (EVENT_DATETIME); graceful fallback on missing/invalid value (per Homepage TC ID-56/57/60)
- Q: MoMorph screens in scope and their screen IDs? → A: Login=GzbNeVGJHz, Homepage SAA=i87tDx10uM, Dropdown-ngôn ngữ=hUyaaugye2 (fileKey=9ypp4enmFmdK3YAFJLIu6C)
- Q: Header/Footer/LanguageSwitcher shared across Login + Homepage? → A: Yes — build as shared variant components (login=minimal, homepage=full), owned by orchestrator/integration track to avoid parallel-agent collision
