# Login Screen Body UI — Implementation Report

## 1. Files Created

| File | Lines | Purpose |
|------|-------|---------|
| `components/login/background-key-visual.tsx` | 53 | Section C — bg photo + dark gradient overlay |
| `components/login/welcome-text.tsx` | 50 | Section B.2 — two-line welcome text |
| `components/login/google-login-button.tsx` | 125 | Section B.3 — Google login button with all interactive states |
| `components/login/login-hero.tsx` | 105 | Section B composition — B.1 + B.2 + B.3 |
| `components/login/index.ts` | 16 | Barrel export for main thread integration |
| `app/preview-login/page.tsx` | 60 | TEMP isolated preview route (`// TEMP preview — removed at integration`) |

## 2. Component Tree

```
PreviewLoginPage (app/preview-login/page.tsx)          ← TEMP only
└── BackgroundKeyVisual                                  ← Section C
│   ├── <img> saa-bg.jpg (object-cover full-bleed)
│   └── <div> dark gradient overlay
├── [placeholder header stub]                            ← not in scope
├── LoginHero                                            ← Section B
│   ├── <Image> root-further-logo.png 451×200            ← B.1
│   ├── WelcomeText                                      ← B.2
│   │   └── <p> line1 + <br/> + line2
│   └── GoogleLoginButton                                ← B.3
│       ├── <span> label text
│       └── <span> <Image> google-icon.svg OR spinner
└── [placeholder footer stub]                            ← not in scope
```

## 3. Component Props / Interfaces

### `BackgroundKeyVisualProps`
```ts
{
  imageSrc?: string;    // default: "/login/saa-bg.jpg"
  className?: string;   // default: ""
}
```

### `WelcomeTextProps`
```ts
{
  line1?: string;  // default: "Bắt đầu hành trình của bạn cùng SAA 2025."
  line2?: string;  // default: "Đăng nhập để khám phá!"
}
```

### `GoogleLoginButtonProps`
```ts
{
  onClick?: () => void;   // default: undefined (no-op)
  loading?: boolean;      // default: false — shows spinner, disables
  disabled?: boolean;     // default: false — disables without spinner
  label?: string;         // default: "LOGIN With Google" (Figma text)
  iconSrc?: string;       // default: "/login/google-icon.svg"
}
```

### `LoginHeroProps`
```ts
{
  welcomeText?: WelcomeTextProps;        // forwarded to WelcomeText
  loginButton?: GoogleLoginButtonProps;  // forwarded to GoogleLoginButton
  rootFurtherLogoSrc?: string;           // default: "/login/root-further-logo.png"
}
```

## 4. onClick / loading / disabled Exposure

`GoogleLoginButton` exposes all three at the button level:
- `onClick` → passed directly to `<button onClick>` (suppressed when `isDisabled`)
- `loading` → renders spinner in icon slot, sets `aria-busy`, adds to `isDisabled`
- `disabled` → sets `<button disabled>`, `aria-disabled`, adds to `isDisabled`

Integration usage:
```tsx
<LoginHero
  loginButton={{
    onClick: () => signIn("google"),
    loading: isPending,
    disabled: false,
    label: t("login.google_button"),
  }}
  welcomeText={{
    line1: t("login.welcome_line1"),
    line2: t("login.welcome_line2"),
  }}
/>
```

## 5. Assets — Paths and Download Instructions

| Asset | Expected path | MoMorph node ID | Source key in media_files.json |
|-------|--------------|-----------------|-------------------------------|
| SAA background photo | `public/login/saa-bg.jpg` | `662:14389` (image 1) | Not in media_files.json — fetch via `get_figma_image` on node `662:14389` |
| ROOT FURTHER logo | `public/login/root-further-logo.png` | `2939:9548` | `"2939:9548"` |
| Google icon | `public/login/google-icon.svg` | `I662:14426;186:1766` | `"I662:14426;186:1766"` |

**Action required (integration track):** Run asset_downloader or curl to download these three files into `public/login/` before building. The signed S3 URLs in `plans/260609-1554-login-screen-saa/data/media_files.json` expire in 10 minutes — re-fetch from MoMorph MCP if stale.

For the background image (node `662:14389`) which has no URL in media_files.json, call:
```
mcp__momorph__get_figma_image(fileKey="9ypp4enmFmdK3YAFJLIu6C", nodeIds=["662:14389"], format="jpg")
```

## 6. Deviations / Assumptions

1. **Background image not in media_files.json**: Node `662:14388`/`662:14389` (the bg photo) had no pre-uploaded S3 URL in `get_media_files` response. Used `<img>` with `/login/saa-bg.jpg` placeholder path and documented the `get_figma_image` fallback call needed. Integration track must download this separately.

2. **`<img>` instead of `<Image>` for background**: Used plain `<img>` in `BackgroundKeyVisual` to avoid Next.js Image domain restrictions for a local asset path, with `// eslint-disable-next-line @next/next/no-img-element`. At integration, this can be switched to `<Image fill>` if desired.

3. **Figma label had trailing space**: Node `I662:14426;186:1568` text was `"LOGIN With Google "` (trailing space). Trimmed to `"LOGIN With Google"` in default prop — purely cosmetic, i18n replaces at runtime.

4. **Responsive layout deferred**: The Figma design is 1440px wide (desktop). The components use fixed Figma pixel values (`w-[305px]`, `w-[1152px]`, etc.) for pixel-perfect desktop match. Responsive breakpoint adaptation (mobile/tablet stacking) is Phase 4 polish — the preview route hardcodes 1440×1024 for diff validation.

5. **Asset download blocked**: Bash and Playwright permissions were denied in this session. Asset files were NOT downloaded to `public/login/`. The integration track must run the download step before the preview route renders correctly.

6. **Type check not run**: `npx tsc --noEmit` was blocked by Bash permission denial. Manual review of all files shows no type errors — all props are typed, all imports resolve, JSX is valid.

---

**Status:** DONE_WITH_CONCERNS

**Summary:** All five body components created under `components/login/**` with correct Figma values, clean props interfaces, and a TEMP preview route at `/preview-login`. Barrel export ready for main thread integration.

**Concerns/Blockers:**
1. Asset files not downloaded to `public/login/` (Bash + Playwright denied) — visual validation and preview route rendering blocked until integration track runs the download. Root FURTHER logo URL from media_files.json and Google icon URL both available in `plans/260609-1554-login-screen-saa/data/media_files.json`. Background photo requires `get_figma_image` call on node `662:14389`.
2. TypeScript compile not verified (Bash denied) — manual review shows no errors but formal tsc pass not confirmed.
