---
name: tkm:generate-slide
description: "Generate polished presentation slides from content or outline. Two modes: --html for modern scroll-snap HTML slides with 12 style presets (deliverable-quality, opens in browser), or --sun/--pptx for Sun* brand-compliant PowerPoint decks (branded .pptx via pptxgenjs, 17 layouts, optional --image mode for AI-generated illustrations). Use when user says 'tạo slide', 'làm presentation', 'gen deck', 'create slides', 'プレゼン作って', or provides an outline/markdown and wants it turned into a deck. NOT for quick dev-internal explanations (use tkm:preview-output --slides for those)."
category: content
keywords: [slides, presentation, pptx, html, sun-asterisk, deck, generate, image-rich]
argument-hint: "<content|outline|plan.md|*.pptx> [--html|--sun|--pptx] [--image] [--from-pptx] [--auto]"
metadata:
  author: takumi-agent-kit
  version: "1.1.0"
---

# Generate Slide

Convert content, outlines, or markdown into polished presentation slides.

**Two output modes:**
- `--html` *(default)* — Self-contained HTML file, scroll-snap navigation, 12 style presets, opens directly in browser. Best for internal demos, stakeholder walkthroughs, developer-facing content.
- `--sun` / `--pptx` — Sun\* brand-compliant `.pptx` deck via pptxgenjs. 17 layout patterns (12 text-only + 5 image-rich), Sun Red palette, Noto Sans JP. Best for client deliverables, internal company decks.

**Sub-flags:**
- `--image` — *(PPTX mode only)* Generate image-rich slides with AI prompt placeholders for Gemini (Nano Banana) or ChatGPT (GPT Image). Each placeholder embeds the suggested prompt for copy-paste.
- `--from-pptx <file.pptx>` — Import existing PowerPoint, extract content, then re-style in either mode.

## Usage

```
/tkm:generate-slide "AI governance framework for 20 stakeholders" --sun
/tkm:generate-slide outline.md --html
/tkm:generate-slide outline.md --sun --image
/tkm:generate-slide --from-pptx old-deck.pptx --sun
/tkm:generate-slide "Takumi Kit overview for onboarding" --auto
```

## Intent Detection

| Input Pattern | Mode |
|---------------|------|
| `--sun` or `--pptx` | Sun* PPTX mode |
| Mentions Sun*, STVC, BrSE, client, khách hàng | Auto-select `--sun` |
| `--html` | HTML mode |
| Default / no flag | HTML mode |
| `--image`, "với hình ảnh minh hoạ", "image-rich", "add illustrations", "thêm hình ảnh" | Switch PPTX to image-rich mode |
| `--from-pptx <file>` | PPT import → then HTML or PPTX |
| `--auto` | Skip approval gates |

---

## Phase 0 — Mode Detection

1. Read the argument and detect mode (HTML or PPTX) from flags or context clues above.
2. If `--from-pptx` given: run **PPT Import** first (see section below), then continue to Phase 1 with the extracted content.
3. If no flag and audience context is ambiguous, default to `--html`.
4. If PPTX mode AND user mentions illustrations / `--image` → enable **Image-Rich Mode** (see section below).

---

## HTML Mode Workflow (`--html`)

### Phase 1 — Content Discovery

Read the user's content (markdown, outline, raw notes, or natural-language description). Map to slide roles:

| Content shape | Slide role |
|---------------|-----------|
| Document title | Title slide |
| Top-level `##` headings | Section divider |
| `###` sub-sections or numbered items | Body slides |
| Final "Q&A" / "Contact" / "Next steps" | Closing slide |

**Density rule:** If a section has >80 words or >5 bullets, plan to split it into 2 slides. Ask one clarifying question if intent is unclear, otherwise infer.

**One-shot discovery question (if content is sparse):**
> "Quick questions before I start: (1) Who's the audience? (2) What's the main message? (3) Any content I should avoid?"

### Phase 2 — Style Selection

Generate **3 single-slide HTML previews** — one from each theme group (dark / light / specialty). Use `viewport-base.css` + the chosen preset's color palette. Open the previews or describe them clearly, let user pick.

Skip this step if `--auto` flag is set — pick the most contextually appropriate preset automatically.

Load `references/style-presets.md` to select three preview candidates. Consider audience:
- Dev-focused / internal tech → Terminal Green (#10) or Neon Cyber (#9)
- Client-facing professional → Electric Studio (#2) or Swiss Modern (#11)
- Creative / product launch → Bold Signal (#1) or Creative Voltage (#3)
- Formal / editorial → Vintage Editorial (#8) or Paper & Ink (#12)

### Phase 3 — Generate HTML

Generate a **single self-contained HTML file** using:
- `references/html-template.md` — `SlidePresentation` class, base structure
- `references/viewport-base.css` — paste inline in `<style>` block
- `references/style-presets.md` — chosen preset's CSS variables
- `references/animation-patterns.md` — `.reveal` animations + optional effects

**Hard rules:**
- All sizing via `clamp()` — no fixed px for typography or spacing
- Negative CSS functions: `calc(-1 * clamp(...))` — never `-clamp(...)`
- Fonts: Fontshare or Google Fonts URLs only — **never** Inter, Roboto, Arial, system fonts
- Images: `max-height: min(50vh, 400px)` — never fill full slide
- `prefers-reduced-motion: reduce` — set `animation-duration: 0.01ms !important`
- Nav dots: always `innerHTML = ''` before building (prevents duplicate dots on re-open)
- Content density: title slides = 1 heading + 1 subtitle; content slides = max 4–6 bullets; grids = max 6 cards

### Phase 4 — Deliver HTML

Open the file in the user's browser or copy it to CWD. Brief the user on:
- File path and how to navigate (arrow keys / swipe)
- Slide count and structure
- Any placeholder content to fill in

**Optional (ask once):**
- Export to PDF? → run `scripts/export-to-pdf.sh`
- Inline edit mode? → enable `contenteditable` hotzone for live editing

---

## Sun* PPTX Mode Workflow (`--sun` / `--pptx`)

### Visual Quality — the bar to aim for

A deck that follows brand colors but looks cramped, text-heavy, or amateurish misses the point. The goal is **beautiful and visually engaging**, not just brand-compliant.

The guidance below is what to aim for. It's not a checklist of rigid rules — every deck has its quirks and exceptions, and your judgment matters more than mechanical compliance.

#### Aim for slides that fill the space gracefully

The most common failure mode is the opposite of cramming: **slides that look empty**. Cards take up most of the slide but their content sits at 11-13pt, leaving 40-50% of the card blank. The slide looks under-confident.

The fix: **match font size to the available space, not to an abstract minimum.** A typical body slide can comfortably hold around **80-120 words** when typography is right-sized. Around 120 words is the upper end; below 60 words you should probably scale fonts up.

When a source section feels too dense even at maximum readable sizes, **splitting into 2 slides is the right move**. Common split patterns:
- **Overview + Details** — high-level frame, then deeper dive
- **Concept + Examples** — define on one, illustrate on the next
- **Problem + Solution** — pain points, then response
- **Metrics + Lessons** — numbers, then narrative takeaways

#### Aim for readable, content-aware typography

The biggest mistake is **using one font size regardless of card size**. A 4-bullet list inside a 6"-wide × 4"-tall card needs much larger text than the same list inside a 3"-wide × 2.5"-tall card. **Scale typography to the container.**

**Reference scale** (use the upper end when roomy; lower end when dense):

| Element | Smaller / dense | Standard | Larger / roomy |
|---------|-----------------|----------|----------------|
| Slide title | 22pt bold | 22pt bold | 22pt bold (keep fixed) |
| Card / section header | 14pt bold | 16-18pt bold | 20-22pt bold |
| Body text inside a card | 12pt | 14-16pt | 18-20pt |
| Bullet items (short, ≤6 words each) | 13pt | 16-18pt | 20-22pt |
| Captions / labels | 9-10pt | 10-11pt | 12pt |
| Big numbers / stats | 32-36pt bold | 40-48pt bold | 56-72pt bold |

**Heuristic**: estimate how many lines the card body needs (with the chosen font size + width), and compare to available height. If text fills less than ~60% of available height, **scale the font up** until it fills 70-85%. Leave 15-30% breathing room — but not 50% empty space below the text.

**Concrete examples**:
- **2-column comparison cards** (each ~6" × 4-5") with 4-6 short bullets: use **body 16-18pt**, not 11-13pt.
- **4-card 2×2 grid** (each ~6" × 2.5") with short bullets: use **body 14-16pt**, header 18pt.
- **Dense table** with 6+ rows: use body 11-12pt (rows are short).
- **Hero callout** filling most of the slide: use body 24-32pt.
- **Process flow** with 5 narrow boxes (~2.5" each): use body 10-11pt (boxes are narrow).

Going below 11pt for body text is rarely right. Either scale up the card or split the slide. The exception is dense tables or footnotes.

**Practical workflow**: when in doubt, start 1-2 sizes larger than instinct. After visual QA, scale down only if something overflows. Easier to step down than recognize under-filling.

#### Resize containers, not just fonts

Sometimes scaling fonts to 20pt still leaves a card half-empty because content is genuinely brief. **Shrink the card** instead of leaving blank space. A 5-bullet card with short bullets is fine at 3.5" tall.

Two complementary strategies:
1. **Grow the type** until text fills the container (when text is short, container is over-sized)
2. **Shrink the container** to match content (when content has a natural limit)

For comparison slides with side-by-side cards, often best to do **both**: scale fonts to 18-20pt *and* shrink card height from 5.0" to 3.5-4.0". Use leftover vertical space for a key message strip below, or leave an intentional bottom margin.

#### Aim for visual richness

Every body slide should ideally have at least one visual element. Options include:
- **Numbered circles, big-number callouts, percentages**
- **Icons or emoji** (see next section — encouraged!)
- **Cards / panels** with colored backgrounds
- **Comparison columns** side-by-side
- **Process flows** with arrows
- **Metrics tables** with colored headers
- **Pain/Solution split** layouts

Vary layouts across consecutive slides. Three "numbered points" slides in a row feels monotone.

#### Use icons and emoji to add personality

Icons and emoji make slides feel modern and human. **Sprinkle them in thoughtfully**:
- **Category reinforcement**: ✓ for success, ⚠ for warnings, ★ for tiers, → for flow
- **Section header glyphs**: 📊 DATA, 🎯 GOALS, 🚀 LAUNCH, 💡 KEY MESSAGE, 🔧 TOOLS, 📨 CONTACT
- **Replacing plain numbered circles** with topical glyphs
- **Adding visual anchor** to text-heavy slides

```javascript
// Inline emoji
slide.addText("🚀 Launch the product", { fontSize: 16, ... });
// Large visual anchor
slide.addText("💡", { x: 1, y: 2, w: 1, h: 1, fontSize: 60, valign: "middle", margin: 0 });
// Symbol characters
slide.addText("→", { fontSize: 24, color: SUN_RED, bold: true, ... });
```

**Don't go overboard** — 1-3 icons per slide is plenty.

#### Color discipline

**Sun Red `#FF2200` is one accent per slide** — not a flood fill. Each body slide should have one or two prominent red elements (callout bar, key message highlight, header underline). Rest stays neutral.

Multi-category content can use sub-colors — Sun Dark Red, Gold, Yellow — but treat as exceptions, not defaults.

---

### Standard Deck Structure

Every Sun* deck has the same structural skeleton:

```
1. Cover slide                  (red background, title + presenter)
2. Table of Contents (TOC)      ← ALWAYS include, right after the cover
3. Section divider — Part 01    (red background, "PART 01" label)
4. ...body slides for Part 01...
5. Section divider — Part 02
6. ...body slides for Part 02...
7. (more sections)
8. Closing / Q&A slide          (red background, contact info)
```

#### Table of Contents slide — mandatory

The TOC slide goes **right after the cover slide** and lists every Part / section with its starting page number. Skip TOC only if the deck has fewer than 5 slides total.

Standard TOC layout: white background, title "Mục lục" / "目次" / "Contents" (match the deck's language), then a vertical list — each with a big red part number, the section title, and a small page-number reference on the right.

Use the bundled helper `makeTOC(sections, tocPageNum, tocTitle)` from `assets/helpers.js`:

```javascript
helpers.makeTOC([
  { num: "01", title: "Bối cảnh & Vấn đề", page: 3 },
  { num: "02", title: "Vai trò mới của bạn", page: 9 },
  { num: "03", title: "Case study", page: 17 },
], 2, "Mục lục");
```

#### Page numbering convention — count EVERY slide

- Cover = page 1 (white text on red bg, bottom-left)
- TOC = page 2 (full footer with page number)
- Section dividers = numbered (page number on red bg)
- Body slides = numbered (page number in bottom-left)
- Closing = numbered (page number on red bg)

**Do NOT skip any slide in the count.** Even though section dividers and cover have red backgrounds, they still get a page number — this matches how readers navigate.

#### Two-pass page numbering algorithm

The TOC must point to section divider slides. **Don't guess — use two passes:**

**Pass 1 (planning):** Build a flat list of every slide before writing pptxgenjs code. For each entry, note type (cover / toc / divider / body / closing) and section. Walk the list and record the 1-indexed position of each section's divider.

**Pass 2 (generation):** Now build the deck. Increment `pageNum` for EVERY slide. Pass `pageNum` to every helper. TOC receives the pre-computed positions from Pass 1.

```javascript
// Pass 1: lay out slide order
const slideOrder = [
  { type: "cover" },
  { type: "toc" },
  { type: "divider", section: "01", title: "First Section" },
  { type: "body", section: "01" },
  { type: "body", section: "01" },
  { type: "divider", section: "02", title: "Second Section" },
  { type: "body", section: "02" },
  { type: "closing" },
];

// Compute 1-indexed page of each divider
const sectionPages = {};
slideOrder.forEach((s, i) => {
  if (s.type === "divider") sectionPages[s.section] = i + 1;
});

// Pass 2: generate
let pageNum = 0;
pageNum++; helpers.makeCover(title, subtitle, presenter, pageNum);
pageNum++; helpers.makeTOC([
  { num: "01", title: "First Section",  page: sectionPages["01"] },
  { num: "02", title: "Second Section", page: sectionPages["02"] },
], pageNum, "Contents");
pageNum++; helpers.makeSectionDivider("01", "First Section", "subtitle", pageNum);
// ...etc
```

**Why two passes**: It's tempting to guess "section 02 starts around page 9", but content density shifts things by 1-2 slides and your TOC silently points wrong.

---

### Image-Rich Mode (`--image` option)

By default, the skill produces text-only slides. When the user wants illustrations — passes `--image`, says "với hình ảnh minh hoạ", "image-rich", "add illustrations", "make it lively with visuals" — switch to **image-rich mode**.

In this mode:
1. **Treat empty space as opportunity for illustration**, not a problem to solve by upsizing fonts.
2. **Important slides get illustrations** — covers, section dividers (optional), key moments, conclusion. Filler/detail slides don't need them.
3. **Place image placeholders** with the right aspect ratio for AI image generators, and **embed the suggested prompt inside each placeholder** so the user can copy-paste into Gemini (Nano Banana) or ChatGPT (GPT Image).

#### Supported aspect ratios

For maximum cross-tool compatibility:

| Ratio | Pixel example | Best for |
|-------|---------------|----------|
| **3:2** (landscape, 1536×1024) | wide illustration banner | Hero image at top, full-width visual |
| **2:3** (portrait, 1024×1536) | tall figure | Side-by-side with text column |
| **1:1** (square, 1024×1024) | balanced icon-like image | Card grid illustrations, icons |

#### Placeholder design

Use the bundled `addImagePlaceholder(slide, x, y, w, h, prompt)` helper from `assets/helpers.js`. Each placeholder is:
- Light grey fill (`F7F7F7`) with dashed red border
- Aspect ratio matching 3:2 / 2:3 / 1:1
- Centered AI prompt the user copies
- Label "🖼  AI PROMPT — COPY & PASTE" above
- Adaptive font size (auto-shrinks for dense prompts in small boxes)

```javascript
helpers.addImagePlaceholder(slide, 0.5, 1.3, 6.0, 4.0,
  "Aspect ratio: 3:2. Style: clean professional illustration, flat design. Subject: a team of diverse engineers collaborating around a holographic AI interface. Mood: optimistic, modern. Color palette: white background (#FFFFFF) with bold red accent (#FF2200) on the central display.");
```

#### Prompt template

Every placeholder's prompt should include five parts:

```
Aspect ratio: <ratio>.
Style: <visual style — flat illustration / 3D render / photography / line art>.
Subject: <what's in the image — be specific>.
Mood: <feeling — professional / playful / urgent / optimistic>.
Color palette: <explicit hex codes>.
```

#### CRITICAL — Brand-appropriate imagery rules

##### Rule 0 — Always spell out colors with hex codes

The image generator has zero context about Sun* brand. "Sun Red accent" is useless.
- ❌ "Color palette: white background with Sun Red accent."
- ✅ "Color palette: clean white background (#FFFFFF) with a single bold red accent (#FF2200)."

##### Rule 1 — Avoid morbid, violent, or horror-coded metaphors

Image generators interpret metaphors **literally** and lean dramatic. A prompt like "graveyard of failed projects" produces an actual graveyard with tombstones, fog, skulls — horror content. Sun* is a professional B2B brand.

**Never use these subjects, even metaphorically:**
- Graveyards, tombstones, RIP, coffins, skeletons, skulls
- Burning buildings, ruins on fire, explosions, wreckage
- Corpses, blood, wounds, decay, rotting matter
- Weapons, violence, threatening figures, dark hooded characters
- Apocalyptic landscapes, post-disaster scenes
- "Death of X" imagery of any kind

**Use business-appropriate metaphors instead:**

| You want to convey... | Good visual metaphor | Bad metaphor (avoid) |
|----------------------|---------------------|---------------------|
| Failed past projects | A cluttered abandoned workshop with dusty equipment | Graveyard of broken monitors |
| Compounding tech debt | A tangled mess of cables growing thicker | Decaying corpse of a system |
| Risk / instability | A precariously stacked tower of blocks tilting | Building on fire collapsing |
| Knowledge loss | An empty office chair, scattered papers, dim lights | Tombstone "RIP knowledge" |
| Stagnation | A wilted potted plant on a desk, faded but not dead | Dying / dead organisms |
| Maze / no way out | A complex maze with dead ends, top-down view | Person trapped, suffering |
| Old / outdated | Dusty filing cabinets, vintage computer, aged paper | Ancient ruins, decay |

##### Rule 2 — Keep any text in the image few, large, and centrally placed

When the image is placed in the slide and scaled to its final size (3-4 inches wide), can the text still be read at the back of a room? If yes, fine. If not, too much text or too small.

**The "thumb test":** imagine final image at slide-placeholder size. Each piece of text needs enough area to remain readable. A single short label taking 15-25% of image height is fine. Six tiny axis labels at 3-5% each will be noise.

**Good (works after slide-scaling):**
- ✅ "One bold short label 'PARITY' centered, ~20% of image height"
- ✅ "A single large title word at the top, ~25% of visible area"
- ✅ "Two clearly separated labels — 'OLD' on left, 'NEW' on right — each large"

**Bad (illegible after scaling):**
- ❌ "Axis labels M1, M3, M5, M7 along the bottom" (6 tiny labels)
- ❌ "Code snippets visible on the terminal screen" (small body text)
- ❌ "List of feature names rendered inside folder shapes" (multiple small labels)

**Rule of thumb**: **0-2 text elements per image, each large enough to read.** If you want 3+ text elements, drop some or build with pptxgenjs shapes + text in the slide.

##### Rule 3 — Style register: "professional editorial illustration"

Default style language:
- ✅ "Clean editorial illustration"
- ✅ "Flat design with subtle depth"
- ✅ "Minimalist business illustration"
- ✅ "Refined isometric illustration"
- ✅ "Watercolor editorial illustration"

Avoid these — they push toward inappropriate dramatic output:
- ❌ "Cinematic" (movie-poster drama)
- ❌ "Dark fantasy", "gothic", "noir", "dystopian"
- ❌ "Hyperrealistic" (uncanny / unsettling)
- ❌ "Concept art" (video-game cover style)
- ❌ "Dramatic lighting" (harsh contrast / horror)

For serious tone, use **muted palette and composition**, not dramatic style words.

#### Palette heuristics by slide content

Don't default every prompt to "Sun Red on white". Vary by emotional register.

**Brand color codes — use in prompts:**

| Brand color | Hex code | Emotional register |
|-------------|----------|-------------------|
| Sun Red | `#FF2200` | Energy, decisiveness, key CTA. Main accent on hero / important slides. |
| Sun Dark Red | `#AD0C00` | Caution, problems, warnings. Use on pain / failure / risk slides. |
| Sun Gold | `#B69256` | Warmth, growth, mastery, achievement. Positive outcomes, case studies. |
| Sun Yellow | `#FDBA05` | Highlight, attention, bright energy. Use sparingly. |
| Text dark | `#1A1A1A` | Body text, neutral foreground. |
| Text grey | `#666666` | Secondary, supporting elements. |
| Light grey | `#F7F7F7` | Card / panel background. |
| White | `#FFFFFF` | Primary background. |

**Palette heuristics by content:**

| Slide content | Suggested palette |
|---------------|-------------------|
| Cover / hero / strong message | White `#FFFFFF` + bold red `#FF2200` on focal element |
| Problem / warning / pain | Muted greys + dark red `#AD0C00`; somber mood |
| Solution / positive outcome | White + Sun Gold `#B69256`; optimistic |
| Process / system diagram | Neutral light greys + single red `#FF2200` for critical step |
| Case study / achievement | Warm white + Sun Gold `#B69256`, red `#FF2200` for key metric |
| Data / chart / metrics | Mostly grey + red `#FF2200` for highlighted point only |
| Section divider hero | Bold Sun Red `#FF2200` dominant with white text |
| Transformation | Two-tone: muted past `#666666`, vibrant future `#FF2200` or `#B69256` |

#### Image placement strategy

| Slide type | Image strategy |
|-----------|----------------|
| Cover | Optional large background image |
| TOC | No image — keep clean |
| Section divider | Optional 1 hero illustration |
| Body slide (normal) | 0-1 images, contextual |
| Body slide (important) | 1-2 images, hero + supporting |
| Body slide (numerical/table) | No image — let data speak |
| Closing | Optional thematic image |

For each body slide, ask: would an illustration genuinely help the audience understand or remember this, or would it just be decoration? If decoration, skip.

#### Image-rich layouts

See `references/layouts.md` sections 13-17 for code snippets:

| Layout | When to use |
|--------|-------------|
| **#13 Hero image + headline + paragraph** | Section openers, "what is X" slides |
| **#14 Side image + bullets** | Concept slides where image illustrates bullets |
| **#15 Image grid (2×2 or 1×3)** | Multiple examples / personas / variants |
| **#16 Big centerpiece + annotations** | Diagrams, system overviews |
| **#17 Image background + overlay text** | Quotes, mission statements, dramatic moments |

---

### Workflow

#### Phase 0 — Check Dependencies

```bash
echo "Node.js:     $(command -v node >/dev/null 2>&1 && node --version || echo 'MISSING')"
echo "pptxgenjs:   $(npm list -g --depth=0 2>/dev/null | grep -q pptxgenjs && echo 'installed' || echo 'MISSING')"
echo "LibreOffice: $(command -v soffice >/dev/null 2>&1 && echo 'installed' || echo 'MISSING (QA disabled)')"
echo "Poppler:     $(command -v pdftoppm >/dev/null 2>&1 && echo 'installed' || echo 'MISSING (QA disabled)')"
```

**If `pptxgenjs` is missing** — stop: "`pptxgenjs` is not installed. Run `tkm init --install-skills` to install, then retry."

**If `LibreOffice` or `Poppler` is missing** — continue without QA, use conservative defaults, warn user.

**If `Node.js` is missing** — stop: "Node.js not found. Install from https://nodejs.org and retry."

#### Phase 1 — Read Content

Map markdown sections → slide roles:

| Markdown shape | Slide role |
|---------------|------------|
| Document title | Cover slide |
| (auto-generated next) | **Table of Contents** (always include unless deck has <5 slides) |
| Top-level `##` headings | Section divider |
| `###` subsections or numbered items | Body slides |
| Final "Q&A" or "Contact" | Closing slide |

**Detect image-rich mode.** If the user's message contains `--image`, "với hình ảnh", "image-rich", "add illustrations", "thêm hình ảnh minh hoạ", or similar — switch to **image-rich mode**.

**Plan the TOC.** Before writing code, list sections (Part 01, Part 02…) and compute starting page numbers via the two-pass algorithm.

**Judge density per section.** If dense, plan to split across 2 body slides upfront.

**Respect placeholder content.** If markdown has `[X]`, `[link]`, `[tên project]`, preserve as-is.

**If image-rich, plan image placement.** Mark which slides get placeholders (1-2 per important slide; 0 for numerical/table slides). Content-driven, not a quota.

#### Phase 2 — Pick Layouts

Load `references/layouts.md`. For each body slide, pick the layout matching content shape — **vary across slides**, no two consecutive identical.

**Text-only mapping:**
- 3–5 enumerated points → Numbered points (#1)
- 2 things compared → Comparison columns 2 (#2)
- 3 parallel items → Comparison columns 3 (#3)
- 4 grid items → Card grid 2×2 (#4)
- Steps/process → Process flow (#5)
- Before/after metrics → Metrics table (#6)
- Problem/solution → Pain/Solution split (#7)
- Single big message → Hero callout (#8)
- Project metadata → Field grid (#9)
- 2 framed questions → Question cards (#10)
- Definition + key message → Definition slide (#11)
- Levels/tiers → Tier ladder (#12)

**Image-rich mapping (with `--image`):**
- Section opener → Hero image + text (#13)
- Concept with supporting visual → Side image + bullets (#14)
- Multiple examples shown visually → Image grid (#15)
- System / process diagram → Big centerpiece + annotations (#16)
- Quote / mission / dramatic moment → Image background + overlay text (#17)

#### Phase 3 — Generate PPTX

Create `generate.js` in a `.sun-slide-build/` directory inside CWD. Either:

**Option A (recommended):** Inline brand constants. See `references/examples.md` example #1.

**Option B:** `require()` the `assets/helpers.js` file. Cleaner for large decks.

Copy `assets/logo_sun.png` into the build dir.

**Critical pptxgenjs rules (from `assets/helpers.js`):**
- Hex colors: `"FF2200"` — **never** `"#FF2200"` (pptxgenjs corrupts files with `#`)
- Reused option objects: use factory functions `const makeShadow = () => ({...})` — pptxgenjs mutates in-place
- Unicode bullets: `bullet: { code: "25AA" }` — never `"• Item"` (creates double bullets)
- `breakLine: true` on every text run except the last in an array
- `margin: 0` on text boxes aligned with shapes
- CJK / Vietnamese text: `fontFace: "Noto Sans JP"`
- Footer y-coordinate: `7.05` — don't place content below `y = 7.0`
- Slide dimensions: `LAYOUT_WIDE` = 13.333" × 7.5" (16:9)
- Sun Red: `"FF2200"` — one accent element per body slide

Run:
```bash
cd .sun-slide-build && node generate.js
```

#### Phase 4 — Visual QA

If LibreOffice + Poppler available:
```bash
soffice --headless --convert-to pdf output.pptx
pdftoppm -jpeg -r 100 output.pdf slide
```

View each `slide-*.jpg` and check:
- **Text overflow** — any text cut off at container edges?
- **Under-filled cards** — 30%+ empty space below text? Scale font up 4-6pt and re-render.
- **Cramping** — slide feels busy? Consider splitting.
- **Tiny fonts** — body text 11-13pt inside a roomy card? Scale up.
- **Overlap** — cards / tables overlapping?
- **Footer collision** — content reaching below y=6.95?
- **Color overuse** — more than 2 prominent Sun Red elements? Neutralize extras.
- **Visual monotony** — 3 same-layout slides in a row? Redesign one.
- **Image placeholders** (image-rich mode): readable AI prompt? Aspect ratio close to 3:2/2:3/1:1? Dashed red border visible?

The first render almost always has 1-2 issues. Most common: under-filling. Fix by scaling up; re-render; deliver. One fix-and-verify cycle is usually enough.

If QA tools absent: use conservative defaults (50–60 words/slide, 12–13pt body, generous padding) and warn user.

#### Phase 5 — Deliver PPTX

```bash
cp output.pptx ../<MeaningfulName>.pptx
```

Brief user on:
- Total slide count
- Structure (cover, TOC, parts, body, closing)
- Any `[placeholder]` content to fill in
- **If image-rich**: how many image placeholders and where (e.g., "8 placeholders — 1 on cover, 1 per section divider, 2 on key concept slides"). Remind: each placeholder contains a prompt to copy into Gemini (Nano Banana) or ChatGPT (GPT Image), then paste the resulting image over the placeholder.

---

## PPT Import (`--from-pptx`)

Run the extractor script:
```bash
python3 <skill-path>/scripts/extract-pptx.py input.pptx extracted-content.md
```

If `python-pptx` missing:
```bash
~/.claude/skills/.venv/bin/pip install python-pptx
# or: pip install python-pptx
```

Review extracted content with user, confirm section mapping, then proceed to the chosen output mode (HTML or PPTX).

---

## Common Pitfalls Summary

| Issue | Fix |
|-------|-----|
| pptxgenjs color bug | `"FF2200"` not `"#FF2200"` |
| Negative CSS function | `calc(-1 * clamp(...))` not `-clamp(...)` |
| Double nav dots on re-open | `navDotsContainer.innerHTML = ''` before building |
| Generic AI fonts | Always Fontshare or Google Fonts — never Inter/Roboto/Arial |
| CJK/Vietnamese PPTX font | `fontFace: "Noto Sans JP"` |
| pptxgenjs object mutation | Factory fn `const makeOpts = () => ({...})` |
| Under-filled cards | Scale font 4-6pt up, or shrink container — don't leave 50% empty space |
| One font size everywhere | Scale to container — 18-20pt in large cards, 11-13pt in dense tables |
| Cramming "to honor source" | Split into 2 slides — Overview+Details, Concept+Examples, Problem+Solution |
| TOC pointing to wrong page | Use two-pass algorithm — plan slide order first, then generate |
| Red logo on red background | Use white text "Sun*" instead — never red on red |
| Footer position | y=7.05 max — don't place content below y=7.0 |
| Image prompt without hex codes | Always spell colors: "(#FF2200)" not "Sun Red" |
| Morbid imagery (graveyards, fire) | Use business metaphors (abandoned workshop, tilting tower) |
| Too many text elements in AI image | 0-2 text elements per image, each large enough to read |
| Dramatic style words in prompts | Use "editorial illustration", not "cinematic"/"dark fantasy" |

---

## Reference Files

Load on demand — only what the current phase needs:

| File | When to load |
|------|-------------|
| `references/style-presets.md` | HTML Phase 2 (style selection) |
| `references/viewport-base.css` | HTML Phase 3 (paste inline) |
| `references/html-template.md` | HTML Phase 3 (SlidePresentation class) |
| `references/animation-patterns.md` | HTML Phase 3 (animation CSS/JS) |
| `references/layouts.md` | PPTX Phase 2 (layout selection — 12 text + 5 image-rich) |
| `references/examples.md` | PPTX Phase 3 (code examples) |
| `assets/helpers.js` | PPTX Phase 3 (brand constants + helper fns — addFooter, addTitle, makeCover, makeSectionDivider, makeClosing, makeTOC, addImagePlaceholder, addKeyMessage) |
| `assets/sun-brand.md` | PPTX Phase 3 (when in doubt about colors/fonts) |
| `assets/sun_template.pptx` | PPTX reference template (6-slide official Sun* deck — inspect for layout decisions) |
| `assets/logo_sun.png` | PPTX Phase 3 (copy into build dir for body slide footers) |
| `scripts/extract-pptx.py` | PPT import mode only |
| `scripts/export-to-pdf.sh` | HTML PDF export (user-requested) |
