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

## Session 2026-06-10 (Homepage SAA verify-vs-design + fix gaps)

- Q: Homepage public or auth-gated? → A: Public — proxy.ts now allows "/" + "/en" + "/ja" without auth (TC ID-0, High); authenticated view still adds personalized controls (TC ID-1)
- Q: Award card titles/descriptions source (prior impl invented "Ngôi sao của năm" etc.)? → A: Use Figma design content — Top Talent / Top Project / Top Project Leader / Best Manager / Signature 2025 - Creator / MVP (specs C2.1–C2.6 + asset filenames)
- Q: Awards section heading (prior impl showed "Sun* Annual Awards 2025")? → A: Figma node 2167:9073 = "Hệ thống giải thưởng"; caption node 2167:9070 = "Sun* annual awards 2025"
- Q: Kudos block content (prior impl swapped label/title + invented copy)? → A: Figma nodes — label "Phong trào ghi nhận", title "Sun* Kudos", detail = real SAA-2025 campaign text, button "Chi tiết"
- Q: Event info conflict — specs say "18h30 / Nhà hát nghệ thuật quân đội"; design image shows "26/12/2025 / Âu Cơ Art Center / Livestream"? → A: Design image is authoritative (current Figma render); use 26/12/2025 / Âu Cơ Art Center / Tường thuật trực tiếp qua sóng Livestream
- Q: Footer 4th link (prior impl duplicated "Về SAA")? → A: Spec 7.5 = "Tiêu chuẩn chung" (placeholder href "#")
- Q: Award card click target? → A: /awards-information#{slug} per category (TC ID-47..52)
- Note: NEXT_PUBLIC_EVENT_DATETIME=2025-12-31 is in the past (today 2026-06-10) → live countdown shows 00 00 00 + "Coming soon" hidden (correct per TC ID-41/42). Set a future datetime for a live countdown — config only, no code change.
- Note (out of scope this session): login page references /login/saa-bg.jpg (404) — login-screen asset, not homepage
