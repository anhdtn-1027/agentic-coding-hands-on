# Pipeline: Waves W0 → W5
Loaded by orchestrator before W0–W5 dispatch. See `pipeline.md` for wave dep graph + incremental preamble.

## Task chain pattern

```
// Wave 0
TaskCreate({ subject: "Scout: discovery scan",
  description: "Scan routing, data models, screens, bg logic, permissions. Detect project language from manifest (package.json → JS/TS; composer.json → PHP; Gemfile → Ruby; pyproject.toml → Python; pom.xml/build.gradle → Java; go.mod → Go; Cargo.toml → Rust). Scan all non-test, non-vendor source dirs relevant to the detected stack (e.g. pages/, views/, components/, features/, modules/ for JS/TS; app/Http/, resources/views/ for Laravel; app/controllers/, app/views/ for Rails; adapt accordingly). Multi-manifest rule: if multiple manifests coexist at root level (e.g. package.json + composer.json), the root-level manifest wins; priority order JS/TS > PHP > Ruby > Python > Java > Go > Rust if tied at same depth. Emit [MULTI_STACK] note in scout-report.md Notes section listing all detected stacks. Output MUST follow templates/scout-report-template.md. File Inventory is the contract for Wave 2 content-completeness and Wave 7 reviewer cross-validation — every source file must appear. After File Inventory: emit `## Background Logic Source Inventory` section. To do this: (1) read references/bl-source-patterns.md; (2) for Mode A stacks apply the folder-convention globs for the detected stack row; (3) for Mode B stacks apply the annotation/decorator grep markers from bl-source-patterns.md § Mode B Grep Markers; (4) emit one entry per file (Mode A) or per decorator hit (Mode B) sorted by category then path; (5) for any category with no matches emit `_(none found)_`; (6) for stacks/libraries not in the table use [SIGNAL_INFERRED] protocol (see bl-source-patterns.md § Signal Inference Fallback); (7) for [MULTI_STACK] projects emit one subsection per detected stack. Output: plans/<active-plan>/artifacts/scout-report.md" })

// Wave 1 — 4 tasks in parallel, each addBlockedBy: [scoutTaskId]
// In incremental mode, system-overview + architecture are NEVER in affected_waves — always use hydrated copy.
const sysOverviewTaskId = resolveWaveTaskId("Wave1: system-overview", () =>
  TaskCreate({ subject: "Wave1: system-overview",
    description: "Session context: read `plans/<active-plan>/artifacts/_session-context.md` FIRST.\nSynthesize SystemOverview. Template: system-overview-template.md. Schema: references/code-formats.md. Draft: plans/<active-plan>/artifacts/system-overview.md",
    addBlockedBy: [scoutTaskId] }))
const architectureTaskId = resolveWaveTaskId("Wave1: architecture", () =>
  TaskCreate({ subject: "Wave1: architecture",
    description: "Session context: read `plans/<active-plan>/artifacts/_session-context.md` FIRST.\nSynthesize Architecture (Mermaid diagrams + tech stack) from scout-report.md. Template: architecture-template.md. Draft: plans/<active-plan>/artifacts/architecture.md",
    addBlockedBy: [scoutTaskId] }))
// --- W1 route-list: pre-gen estimate gate (shard by path prefix when est_loc > max_loc) ---
const rlEstimate = JSON.parse(bash(`.claude/skills/.venv/bin/python3 \
  claude/skills/rebuild-spec/scripts/estimate_artifact_loc.py \
  --artifact route-list \
  --scout-report plans/<active-plan>/artifacts/scout-report.md \
  --max-loc ${docs_maxLoc ?? 800}`).stdout)
console.log(`[INFO] W1 route-list pre-gen estimate: ${rlEstimate.unit_count} routes, est_loc=${rlEstimate.est_loc}, shard=${rlEstimate.shard}`)

if (rlEstimate.shard) {
  // SHARD BRANCH: shell (preamble + per-path-prefix anchors) → fan-out → merge.
  // Reuse same path-prefix slice logic as api-contracts resource namespace (DRY).
  // validate_route_list.py wired into W1 review step.
  var routeListTaskId = TaskCreate({ subject: "Wave1: route-list (shard: shell→fan-out→merge)",
    description: `Session context: read \`plans/<active-plan>/artifacts/_session-context.md\` FIRST.
SHARD MODE for RouteList (${rlEstimate.unit_count} routes, est_loc=${rlEstimate.est_loc} > ${docs_maxLoc ?? 800}).
Read references/artifact-sharding.md for merge recipe + fragment contract.

1. Shell: write route-list.md skeleton (preamble, ## Backend Routes header with table header row, per-path-prefix {POPULATED_BY_FRAGMENTS} anchors, ## Frontend Routes, ## Summary). Write _fragments/route-list/_slice-plan.json.
2. Fan-out: one researcher per path prefix (BATCHES of REBUILD_SHARD_MAX_PARALLEL=5). Each writes table-body rows ONLY (no header row, no preamble) → _fragments/route-list/NN-<prefix>.md.
3. Merge: ls|sort → inject → rm -rf.
Template: route-list-template.md. Draft: plans/<active-plan>/artifacts/route-list.md`,
    addBlockedBy: [scoutTaskId] })
} else {
  var routeListTaskId = resolveWaveTaskId("Wave1: route-list", () =>
    TaskCreate({ subject: "Wave1: route-list",
      description: "Session context: read `plans/<active-plan>/artifacts/_session-context.md` FIRST.\nSynthesize RouteList. Template: route-list-template.md. Draft: plans/<active-plan>/artifacts/route-list.md",
      addBlockedBy: [scoutTaskId] }))
}
// --- W1 data-model: pre-gen estimate gate (shard when >=40 models) ---
// Runs BEFORE creating the research task. Over threshold → chunked path.
// Read references/artifact-sharding.md for merge recipe + fragment contract.
const dmEstimate = JSON.parse(bash(`.claude/skills/.venv/bin/python3 \
  claude/skills/rebuild-spec/scripts/estimate_artifact_loc.py \
  --artifact data-model \
  --scout-report plans/<active-plan>/artifacts/scout-report.md \
  --plan-dir plans/<active-plan> \
  --max-loc ${docs_maxLoc ?? 800}`).stdout)
console.log(`[INFO] W1 data-model pre-gen estimate: ${dmEstimate.unit_count} models, shard=${dmEstimate.shard}`)

if (dmEstimate.shard) {
  // SHARD BRANCH: shell (preamble + MODEL### ranges + per-domain anchors) → fan-out → merge
  // Shell researcher writes skeleton with {POPULATED_BY_FRAGMENTS} per domain.
  // Fan-out researchers write entity blocks per assigned MODEL### range.
  // Merge: ls|sort → inject → rm -rf. Then W1.5 gate runs on merged file (UNCHANGED).
  // See references/artifact-sharding.md § Descriptor Table (data-model row).
  var dataModelTaskId = TaskCreate({ subject: "Wave1: data-model (shard: shell→fan-out→merge)",
    description: `Session context: read \`plans/<active-plan>/artifacts/_session-context.md\` FIRST.
SHARD MODE for DataModel (${dmEstimate.unit_count} models >= 40 threshold).
Read references/artifact-sharding.md for merge recipe + fragment contract.

1. Shell step: write data-model.md skeleton (preamble, ERD, Polymorphic/Discriminator anchors, per-domain {POPULATED_BY_FRAGMENTS} anchors). Assign disjoint MODEL### ranges per domain to _fragments/data-model/_slice-plan.json.
2. Fan-out: one researcher per domain (BATCHES of REBUILD_SHARD_MAX_PARALLEL=5), each writes entity blocks using ONLY their assigned MODEL### range → _fragments/data-model/NN-<domain>.md.
3. Merge: ls|sort → inject per anchor → rm -rf.
Template: data-model-template.md. Draft: plans/<active-plan>/artifacts/data-model.md`,
    addBlockedBy: [scoutTaskId] })
} else {
  var dataModelTaskId = resolveWaveTaskId("Wave1: data-model", () =>
    TaskCreate({ subject: "Wave1: data-model",
      description: "Session context: read `plans/<active-plan>/artifacts/_session-context.md` FIRST.\nSynthesize DataModel. Template: data-model-template.md. Draft: plans/<active-plan>/artifacts/data-model.md",
      addBlockedBy: [scoutTaskId] }))
}

// Extract detected stack from scout report (Wave 0 output, available at this point)
const scoutReportPath = `plans/<active-plan>/artifacts/scout-report.md`
const scoutContent = existsNonEmpty(scoutReportPath) ? readFile(scoutReportPath) : ''
const detectedLangMatch = scoutContent.match(/^## Detected Language\s*\n\s*(\S[^\n]*)/m)
const detectedStack = detectedLangMatch ? detectedLangMatch[1].trim() : 'JS/TS'
const isMultiStack = scoutContent.includes('[MULTI_STACK]')

// Enumerate every root-level manifest present so reviewer/researcher know exactly
// which stacks' signal rows to OR-merge in H-rule tables.
// Bare filenames are intentional — these manifests live at the repo root (CWD).
const manifestMap = {
  'package.json': 'JS/TS',
  'composer.json': 'PHP',
  'Gemfile': 'Ruby',
  'pyproject.toml': 'Python',
  'pom.xml': 'Java',
  'build.gradle': 'Java',
  'go.mod': 'Go',
  'Cargo.toml': 'Rust'
}
const uniqueFoundStacks = [...new Set(
  Object.entries(manifestMap)
    .filter(([file]) => existsNonEmpty(file))
    .map(([, stack]) => stack)
)]
let stackNote = detectedStack
if (isMultiStack) {
  stackNote = uniqueFoundStacks.length > 1
    ? `${detectedStack} [MULTI_STACK — all stacks: ${uniqueFoundStacks.join(', ')}; apply union of signals for all listed stacks in H-rule tables (consult each stack's row in every H-rule table; OR-merge signals before counting)]`
    : `${detectedStack} [MULTI_STACK — scout flagged multi-stack but root manifest scan found ${uniqueFoundStacks.length} stack(s); cannot enumerate union — emit [STACK_LIST_MISSING] advisory in classification justification per composite-screen-detection.md § Stack Probe]`
}

// Wave 0.5 — Emit shared session-context file (read by all W1-W9 subagents)
bash: .claude/skills/.venv/bin/python3 \
  claude/skills/rebuild-spec/scripts/build_session_context.py \
  --plan-dir plans/<active-plan> \
  --scout-report plans/<active-plan>/artifacts/scout-report.md \
  --stack-note "${stackNote}"

// Also extract BL inventory fragment for W7a (avoids loading full scout-report)
bash: .claude/skills/.venv/bin/python3 \
  claude/skills/rebuild-spec/scripts/extract_scout_section.py \
  --scout-report plans/<active-plan>/artifacts/scout-report.md \
  --section "Background Logic Source Inventory" \
  --out plans/<active-plan>/artifacts/_scout-bl-inventory.md

// --- Wave 1.5: DataModel structural gate (before W2 dispatch) ---
// Runs after W1 data-model task completes. Single reviewer, DataModel-scoped.
// W2 dispatches ONLY after W1.5 reports passed: true.
// Incremental: skip W1.5 if data-model.md not re-generated this run.

let w15TaskId = null
const w15_reran = mode === "full" || affected_waves.includes("Wave1: data-model")
if (w15_reran) {
  w15TaskId = TaskCreate({
    subject: "Wave1.5: data-model-review",
    description: `Session context: read \`plans/<active-plan>/artifacts/_session-context.md\` FIRST.

Fast structural review of DataModel ONLY — do NOT review other artifacts (that is Wave 7a's scope).

INPUT: plans/<active-plan>/artifacts/data-model.md

CHECKS (run all, report each separately):

**Check 1 — Entity completeness:**
- Each entity block has: name, description, at least one field with name+type
- Fail: entity with no fields, or entity with fields but no types documented

**Check 2 — DISC-### scope:**
- Each DISC-### entry in a discriminator table should have ≥2 enum values with DISTINCT behavioral outcomes
- DISC-### with only \`true\`/\`false\` values → critical (boolean flags belong in Business Rules)
- DISC-### with only 1 value → critical (not a discriminator, remove or expand)
- Cross-check: each DISC-### code references an actual entity field in the same entity block

**Check 3 — MODEL### uniqueness:**
- No duplicate MODEL### codes across the document
- Fail: MODEL001 appears in two different entity blocks

**Check 4 — DISC-### orphan check:**
- Each DISC-### code in the document is anchored to a specific entity's field
- Fail: DISC003 appears in Polymorphic section but no entity has a field mapped to DISC003

**Check 5 — Relationship completeness:**
- Each relationship entry has: source entity, target entity, cardinality
- Missing cardinality → warning

OUTPUT: plans/<active-plan>/artifacts/data-model-review.md

Use this exact frontmatter:
\`\`\`yaml
---
passed: true   # true = W2 can proceed; false = halt
issues: 0
warnings: 0
---
\`\`\`

Passed Checks: ONE LINE per check (\`✓ <check_name>\`). NO prose.

TOKEN BUDGET: Load data-model.md only — self-contained, no cross-artifact loading needed.`,
    addBlockedBy: [dataModelTaskId]
  })
} else {
  console.log("[INFO] W1.5 skipped — data-model not re-generated (incremental: prior DataModel carries forward)")
  w15TaskId = `SKIPPED:W1.5`
}

// Halt on W1.5 failure before W2 dispatch
if (w15TaskId && !w15TaskId.startsWith("SKIPPED:")) {
  if (!existsNonEmpty("plans/<active-plan>/artifacts/data-model-review.md")) {
    throw new Error("W1.5 HALT — gate output missing: data-model-review.md was not written. Check W1.5 task for errors.")
  }
  const w15Content = readFile("plans/<active-plan>/artifacts/data-model-review.md")
  const w15fm = parseFrontmatter(w15Content)
  if (w15fm.passed === "false" || w15fm.passed === false) {
    throw new Error(
      `W1.5 HALT — DataModel has ${w15fm.issues} critical issue(s). ` +
      `Fix data-model.md, then re-run Wave 1 (--artifact data-model) or restart from W1. ` +
      `Review: plans/<active-plan>/artifacts/data-model-review.md`
    )
  }
  console.log(`[INFO] W1.5 passed (issues: ${w15fm.issues ?? 0}, warnings: ${w15fm.warnings ?? 0})`)
}

const w15Blocker = (w15TaskId && !w15TaskId.startsWith("SKIPPED:")) ? w15TaskId : dataModelTaskId

// Wave 2 — threshold gate: merge W2a+W2b for small projects
bash: screen_count=$(.claude/skills/.venv/bin/python3 \
  claude/skills/rebuild-spec/scripts/count_screen_files.py \
  --scout-report plans/<active-plan>/artifacts/scout-report.md)
const W2_MERGE_THRESHOLD = parseInt(process.env.REBUILD_W2_MERGE_THRESHOLD ?? '30')

if (screen_count < W2_MERGE_THRESHOLD) {
  // Small project: merge W2a+W2b into a single researcher task.
  // Check BOTH individual W2 subjects (planner never emits "combined-screen-bg").
  const needsW2 = mode === "full"
    || affected_waves.includes("Wave2: screen-list + screen-flow")
    || affected_waves.includes("Wave2: behavior-logic")
  const combinedW2TaskId = needsW2
    ? TaskCreate({ subject: "Wave2: combined-screen-bg",
      description: `Session context: read \`plans/<active-plan>/artifacts/_session-context.md\` FIRST (single source for shared session inputs).

Generate ScreenList + ScreenFlow + BehaviorLogic in a SINGLE session.
Templates: screen-list-template.md, screen-flow-template.md, behavior-logic-template.md.
Drafts: plans/<active-plan>/artifacts/.
Context: references/composite-screen-detection.md (H1-H6 rules), references/verification-checklist-core-artifacts.md (Composite Detection Rules + Failure Trap Assertions).
Detected stack: \${stackNote}.

EMIT ORDER: ScreenList FIRST (BL needs its service-call inventory), ScreenFlow second, BehaviorLogic last.
Route-first enumeration: cross-reference RouteList artifact. Apply composite-screen detection unconditionally.
Import chain rule: follow imports one level deep using language-specific mechanism.
CARDINALITY CONTRACT: read behavior-logic-template.md § Cardinality Contract. Read scout-report.md § Background Logic Source Inventory for authoritative file list.
Schema: references/code-formats.md (canonical 10 BL types + Source File/Source Symbol field schema).`,
      addBlockedBy: [routeListTaskId, w15Blocker] })
    : `HYDRATED:Wave2: combined-screen-bg`
  var w2TaskIds = [combinedW2TaskId]
} else {
  // Large project: existing W2a + W2b split path

// --- W2a screen-list + screen-flow: pre-gen estimate gate ---
const slEstimate = JSON.parse(bash(`.claude/skills/.venv/bin/python3 \
  claude/skills/rebuild-spec/scripts/estimate_artifact_loc.py \
  --artifact screen-list \
  --scout-report plans/<active-plan>/artifacts/scout-report.md \
  --plan-dir plans/<active-plan> \
  --max-loc ${docs_maxLoc ?? 800}`).stdout)
const sfEstimate = JSON.parse(bash(`.claude/skills/.venv/bin/python3 \
  claude/skills/rebuild-spec/scripts/estimate_artifact_loc.py \
  --artifact screen-flow \
  --scout-report plans/<active-plan>/artifacts/scout-report.md \
  --plan-dir plans/<active-plan> \
  --max-loc ${docs_maxLoc ?? 800}`).stdout)
console.log(`[INFO] W2a pre-gen: screen-list=${slEstimate.unit_count} SCR shard=${slEstimate.shard}, screen-flow=${sfEstimate.unit_count} SCR shard=${sfEstimate.shard}`)

if (slEstimate.shard || sfEstimate.shard) {
  // SHARD BRANCH for W2a: shared SCR### module/route-group slice plan drives both.
  // validate_screen_list.py + validate_screen_flow.py wired into W2a/W7a review.
  var screenListAndFlowTaskId = TaskCreate({ subject: "Wave2: screen-list + screen-flow (shard: shell→fan-out→merge)",
    description: `Session context: read \`plans/<active-plan>/artifacts/_session-context.md\` FIRST.
SHARD MODE for ScreenList+ScreenFlow (${slEstimate.unit_count} SCR, screen-list shard=${slEstimate.shard}, screen-flow shard=${sfEstimate.shard}).
Read references/artifact-sharding.md for merge recipe.

1. Shell: compute ONE module/route-group slice plan (keyed by SCR###) shared by both. Write screen-list.md + screen-flow.md skeletons with per-module {POPULATED_BY_FRAGMENTS} anchors. Write _fragments/screen-list/_slice-plan.json and _fragments/screen-flow/_slice-plan.json.
2. Fan-out: one researcher per module (BATCHES of 5). Each writes SCR+REG blocks for screen-list AND flow blocks for screen-flow within their module. SCR+child REGs always co-located.
3. Merge screen-list: ls|sort → inject per module → rm -rf. Merge screen-flow same pattern.
Templates: screen-list-template.md, screen-flow-template.md. Context: composite-screen-detection.md. Detected stack: ${stackNote}.`,
    addBlockedBy: [routeListTaskId, w15Blocker] })
} else {
  // Wave 2a — ScreenList runs first (single-task, unchanged)
  var screenListAndFlowTaskId = resolveWaveTaskId("Wave2: screen-list + screen-flow", () =>
    TaskCreate({ subject: "Wave2: screen-list + screen-flow",
      description: `Session context: read \`plans/<active-plan>/artifacts/_session-context.md\` FIRST.
Generate ScreenList + ScreenFlow. Templates: screen-list-template.md, screen-flow-template.md. Drafts: plans/<active-plan>/artifacts/. Context: references/composite-screen-detection.md (H1-H6 rules — read this file before classifying any screen), references/verification-checklist-core-artifacts.md (Composite Detection Rules + Failure Trap Assertions). Detected stack: ${stackNote} — pre-extracted from scout-report.md § ## Detected Language by the orchestrator; use this for per-stack signal selection in H-rule tables, do not re-read scout-report.md for stack detection. Route-first enumeration: Before applying H-rules, cross-reference the RouteList artifact (Wave 1, already complete). Map each distinct URL pattern to its page/component file. Each file serving a distinct URL path = one SCR candidate. Multiple URL patterns mapping to the SAME file = same SCR. Different files → separate SCR candidates. Then apply H1-H6 (full execution order: H6 → H4 → H5 → H2 → H3 → H1 → 2-of-3 gate) within each candidate. Apply composite-screen detection unconditionally to every screen file per references/composite-screen-detection.md. Import chain rule: if scout-report.md exists, use its flat file inventory to identify screen files (do not re-glob); if absent (e.g. --artifact entry point), emit [WARN] scout-report.md not found — skip content-completeness check and mark service coverage N/A. When scout-report exists: (1) resolve path aliases first (read tsconfig.json paths or package.json workspaces — unresolvable → treat as compliant, log [UNRESOLVED_ALIAS]); (2) follow imports one level deep using language-specific mechanism (ES6 import for JS/TS; use/require for PHP; require for Ruby; import for Python; import for Java/Kotlin/Go; use for Rust); (3) extract all service calls, API hooks, and helper functions in those immediate imports; (4) Known Limitation: barrel/re-export files (e.g. index.ts) re-exporting service modules at depth 2 are not followed — flag screens importing ONLY barrel files as [BARREL_IMPORT] advisory. The extracted service-call inventory is consumed by BehaviorLogic (Wave 2b) and confirms RouteList coverage.`,
      addBlockedBy: [routeListTaskId, w15Blocker] }))
}

// --- W2b behavior-logic: pre-gen estimate gate ---
const blEstimate = JSON.parse(bash(`.claude/skills/.venv/bin/python3 \
  claude/skills/rebuild-spec/scripts/estimate_artifact_loc.py \
  --artifact behavior-logic \
  --scout-report plans/<active-plan>/artifacts/scout-report.md \
  --plan-dir plans/<active-plan> \
  --max-loc ${docs_maxLoc ?? 800}`).stdout)
console.log(`[INFO] W2b behavior-logic pre-gen estimate: ${blEstimate.unit_count} BL, shard=${blEstimate.shard}`)

if (blEstimate.shard) {
  // SHARD BRANCH for W2b: shell (preamble + per-category anchors) → fan-out → merge.
  // 1-BL-per-inventory-entry cardinality preserved (fragments are disjoint by source file).
  // validate_behavior_logic.py wired into W2b/W7a review.
  var behaviorLogicTaskId = TaskCreate({ subject: "Wave2: behavior-logic (shard: shell→fan-out→merge)",
    description: `Session context: read \`plans/<active-plan>/artifacts/_session-context.md\` FIRST.
SHARD MODE for BehaviorLogic (${blEstimate.unit_count} BL, est_loc=${blEstimate.est_loc} > ${docs_maxLoc ?? 800}).
Read references/artifact-sharding.md for merge recipe.

1. Shell: write behavior-logic.md skeleton (preamble, Index table, per-category {POPULATED_BY_FRAGMENTS} anchors). Write _fragments/behavior-logic/_slice-plan.json grouping BL inventory entries by category.
2. Fan-out: one researcher per category (BATCHES of 5). Each writes ## BL### blocks for their category, honoring 1-BL-per-inventory-entry (Rule C1). → _fragments/behavior-logic/NN-<category>.md.
3. Merge: ls|sort → inject per category → rm -rf. Coverage check: every scout BL inventory entry → exactly one BL.
Template: behavior-logic-template.md. Schema: references/code-formats.md.`,
    addBlockedBy: [screenListAndFlowTaskId] })
} else {
  var behaviorLogicTaskId = resolveWaveTaskId("Wave2: behavior-logic", () =>
    TaskCreate({ subject: "Wave2: behavior-logic",
      description: `Session context: read \`plans/<active-plan>/artifacts/_session-context.md\` FIRST.
Generate BehaviorLogic. Template: behavior-logic-template.md. Schema: references/code-formats.md (canonical 10 BL types + Source File/Source Symbol field schema). Context: screen-list.md (service-call references extracted by Wave 2a). CARDINALITY CONTRACT (read template § Cardinality Contract before writing any BL item): (1) Read scout-report.md § Background Logic Source Inventory — this is the authoritative file list; (2) For each inventory entry emit exactly 1 BL item (Mode A: 1 file = 1 BL; Mode B: 1 decorator hit = 1 BL; multiple hits in same file = multiple BL items); (2a) Sentinel handling — entries shaped \`- {category}: _(none found)_\` (value field is the sentinel) are scout markers for empty categories; SKIP them, never emit a BL; (3) Set Source File = inventory entry path and Source Symbol = class or method name (single symbol only — see template Rule C2 for forbidden multi-symbol delimiters); (4) Aggregation is a critical violation — do NOT combine multiple source files into one BL item; (5) For per-stack signal context (what counts as each BL type per stack) read references/bl-source-patterns.md. Draft: plans/<active-plan>/artifacts/behavior-logic.md`,
      addBlockedBy: [screenListAndFlowTaskId] }))
}

  var w2TaskIds = [screenListAndFlowTaskId, behaviorLogicTaskId]
} // end W2 threshold gate

// W2.5 (ScreenSpec fan-out) removed from main pipeline (2026-05-25).
// Use /rebuild-spec --screen-specs for standalone ScreenSpec pass after main rebuild.
// See ## Screen-Specs Pass section at end of this file.

// --- W2.9 api-map: pre-gen estimate gate ---
const amEstimate = JSON.parse(bash(`.claude/skills/.venv/bin/python3 \
  claude/skills/rebuild-spec/scripts/estimate_artifact_loc.py \
  --artifact api-map \
  --route-list plans/<active-plan>/artifacts/route-list.md \
  --max-loc ${docs_maxLoc ?? 800}`).stdout)
console.log(`[INFO] W2.9 api-map pre-gen estimate: ${amEstimate.unit_count} endpoints, shard=${amEstimate.shard}`)

if (amEstimate.shard) {
  // SHARD BRANCH: shell (preamble + per-namespace anchors) → fan-out → merge.
  // Same namespace slice key as route-list/api-contracts (DRY). validate_api_map.py wired into W2.9 review.
  var apiMapTaskId = TaskCreate({ subject: "Wave2.9: api-map (shard: shell→fan-out→merge)",
    description: `Session context: read \`plans/<active-plan>/artifacts/_session-context.md\` FIRST.
SHARD MODE for ApiMap (${amEstimate.unit_count} endpoints, est_loc=${amEstimate.est_loc} > ${docs_maxLoc ?? 800}).
Read references/artifact-sharding.md for merge recipe.

1. Shell: write api-map.md skeleton (## Endpoints by Domain header, per-namespace ### headers with {POPULATED_BY_FRAGMENTS} anchors, ## Background Jobs, ## Webhooks). Write _fragments/api-map/_slice-plan.json.
2. Fan-out: one researcher per namespace (BATCHES of 5). Each writes endpoint→handler table rows ONLY → _fragments/api-map/NN-<namespace>.md.
3. Merge: ls|sort → inject per namespace → rm -rf.
Inputs: route-list.md + behavior-logic.md. Output: plans/<active-plan>/artifacts/api-map.md`,
    addBlockedBy: w2TaskIds })
} else {
  var apiMapTaskId = resolveWaveTaskId("Wave2.9: api-map", () =>
    TaskCreate({ subject: "Wave2.9: api-map",
      description: `Session context: read \`plans/<active-plan>/artifacts/_session-context.md\` FIRST.

Synthesize ApiMap from route-list.md + behavior-logic.md.
Output: plans/<active-plan>/artifacts/api-map.md

FORMAT:
## API Map

Group routes by domain/resource (e.g. Auth, Users, Posts). For each route:
- Method + path (from route-list.md)
- BL### codes that handle it (from behavior-logic.md § Source Symbol)
- Auth/permission requirement (PERM### or "public")

Use a table per group:
| Method | Path | Handler BL### | Auth |
|--------|------|---------------|------|

Omit routes with no matching BL entry — mark them [UNMAPPED].
Call TaskUpdate(status=completed) on this task id BEFORE returning.`,
      addBlockedBy: w2TaskIds }))
}

// Wave 3 — blocks on W2b BehaviorLogic only (api-map runs in parallel, does not block W3)
const w3BlockedBy = w2TaskIds

const permissionsTaskId = resolveWaveTaskId("Wave3: permissions", () =>
  TaskCreate({ subject: "Wave3: permissions",
    description: `Session context: read \`plans/<active-plan>/artifacts/_session-context.md\` FIRST.
Generate Permissions.

TRIPLE OUTPUT (order matters — write matrix FIRST, then derive curated from it):
1. permissions-matrix.md → plans/<active-plan>/artifacts/permissions-matrix.md
   RAW PERM### matrix + client-side gates. Template: templates/permissions-matrix-template.md
2. permissions.md → plans/<active-plan>/artifacts/permissions.md
   Plain-language CURATED view (who can do what). No PERM### codes, no matrix tables.
   Derive prose FROM permissions-matrix.md (roles → plain sentences). Template: templates/permissions-template.md
3. business-rules.md (DRAFT) → plans/<active-plan>/artifacts/business-rules.md
   Plain-language summary of behavior-logic BR codes. No PERM### or BL### codes.
   Template: templates/business-rules-template.md`,
    addBlockedBy: w3BlockedBy }))

// --- W4 user-stories: pre-gen estimate gate (shard by actor when est_loc > max_loc) ---
const usEstimate = JSON.parse(bash(`.claude/skills/.venv/bin/python3 \
  claude/skills/rebuild-spec/scripts/estimate_artifact_loc.py \
  --artifact user-stories \
  --plan-dir plans/<active-plan> \
  --max-loc ${docs_maxLoc ?? 800}`).stdout)
console.log(`[INFO] W4 user-stories pre-gen estimate: ${usEstimate.unit_count} US, est_loc=${usEstimate.est_loc}, shard=${usEstimate.shard}`)

if (usEstimate.shard) {
  // SHARD BRANCH: shell (US### range pre-alloc per actor) → fan-out → merge → W4.5 gate UNCHANGED.
  // See references/artifact-sharding.md § US### Range Pre-allocation Algorithm.
  const usRanges = JSON.parse(bash(`.claude/skills/.venv/bin/python3 \
    claude/skills/rebuild-spec/scripts/estimate_artifact_loc.py \
    --artifact user-stories --emit-ranges \
    --permissions-matrix plans/<active-plan>/artifacts/permissions-matrix.md`).stdout)
  console.log(`[INFO] W4 shard: ${usRanges.ranges.length} actor ranges allocated`)

  var userStoriesTaskId = TaskCreate({ subject: "Wave4: user-stories (shard: shell→fan-out→merge)",
    description: `Session context: read \`plans/<active-plan>/artifacts/_session-context.md\` FIRST.
SHARD MODE for UserStories (${usEstimate.unit_count} US, est_loc=${usEstimate.est_loc} > ${docs_maxLoc ?? 800}).
Read references/artifact-sharding.md for merge recipe + US### range pre-allocation.

1. Shell step: write user-stories.md skeleton (preamble, Interaction Inventory, User Story Index, per-actor {POPULATED_BY_FRAGMENTS} anchors, Screen→US Map, Cross-Reference). Write _fragments/user-stories/_slice-plan.json with per-actor US### ranges: ${JSON.stringify(usRanges.ranges)}.
2. Fan-out: one researcher per actor (BATCHES of REBUILD_SHARD_MAX_PARALLEL=5). Each writes US blocks using ONLY their assigned US### range. If range exceeded: STOP and report.
3. Merge: ls|sort → inject per actor anchor → rm -rf.
Load: references/user-stories-ipe-protocol.md. Template: user-stories-template.md.
Draft: plans/<active-plan>/artifacts/user-stories.md`,
    addBlockedBy: [permissionsTaskId] })
} else {
  var userStoriesTaskId = resolveWaveTaskId("Wave4: user-stories", () =>
    TaskCreate({ subject: "Wave4: user-stories",
      description: `Session context: read \`plans/<active-plan>/artifacts/_session-context.md\` FIRST.
Generate UserStories. Template: user-stories-template.md. Draft: plans/<active-plan>/artifacts/user-stories.md.
Load: references/user-stories-ipe-protocol.md — run ALL IPE steps BEFORE writing any US.
Inputs: ScreenList (SCR### + source file paths), permissions-matrix.md (actor split).`,
      addBlockedBy: [permissionsTaskId] }))
}

// --- Wave 4.5: UserStories quality gate (before W5 FeatureList dispatch) ---
// Runs after W4 user-stories task. W5 dispatches ONLY after W4.5 passes.
// Incremental: skip W4.5 if user-stories.md not re-generated this run.

let w45TaskId = null
const w45_reran = mode === "full" || affected_waves.includes("Wave4: user-stories")
if (w45_reran) {
  w45TaskId = TaskCreate({
    subject: "Wave4.5: user-stories-review",
    description: `Session context: read \`plans/<active-plan>/artifacts/_session-context.md\` FIRST.

Fast quality review of UserStories ONLY — do NOT review other artifacts (that is Wave 7a's scope).

INPUT: plans/<active-plan>/artifacts/user-stories.md

CHECKS (run all, report each separately):

**Check 1 — Single intent per story (critical):**
- Each US### goal describes exactly ONE user action
- Fail indicators: goal contains "and" joining two distinct actions, "as well as", list of verbs (create + edit + delete), or covers full CRUD in one story
- Example fail: US003 "As a user, I can create, edit, and delete my profile" → 3 intents, split into 3 stories
- Flag as critical if ≥2 clearly distinct user intents in one story

**Check 2 — Actor clarity (critical):**
- Each US### has a named human actor (user, admin, manager, etc.)
- Fail: actor is "system", "application", "platform", or missing entirely
- "The system sends a notification" → not a user story, belongs in BehaviorLogic
- Flag as critical if actor is non-human or absent

**Check 3 — Outcome present (warning):**
- Each US### has a user-visible outcome ("so that..." or equivalent)
- No outcome = unclear why the feature matters → W5 cannot assess feature value
- Flag as warning if outcome absent

**Check 4 — Overly broad scope (warning):**
- US### covering an entire resource domain ("manage all X", "administer Y system") → too broad for W5 grouping
- Heuristic: goal contains "manage", "administer", "handle" as the ONLY verb without a specific action
- Acceptable: "manage my account settings" (specific resource, clear scope)
- Flag as warning, not critical (W5 can still attempt grouping)

**Check 5 — US### code uniqueness (critical):**
- No duplicate US### codes in the document
- Fail: US005 appears in two separate story blocks

OUTPUT: plans/<active-plan>/artifacts/user-stories-review.md

Use this exact frontmatter:
\`\`\`yaml
---
passed: true   # true = W5 can proceed; false = halt
issues: 0
warnings: 0
---
\`\`\`

Severity: Checks 1, 2, 5 are critical (issues count). Checks 3, 4 are warnings.
Halt threshold: passed=false only when issues > 0.

Passed Checks: ONE LINE per check (\`✓ <check_name>\`). NO prose.

TOKEN BUDGET: Load user-stories.md only. No cross-artifact loading needed.`,
    addBlockedBy: [userStoriesTaskId]
  })
} else {
  console.log("[INFO] W4.5 skipped — user-stories not re-generated (incremental: prior UserStories carries forward)")
  w45TaskId = `SKIPPED:W4.5`
}

// Halt on W4.5 failure before W5 dispatch
if (w45TaskId && !w45TaskId.startsWith("SKIPPED:")) {
  if (!existsNonEmpty("plans/<active-plan>/artifacts/user-stories-review.md")) {
    throw new Error("W4.5 HALT — gate output missing: user-stories-review.md was not written. Check W4.5 task for errors.")
  }
  const w45Content = readFile("plans/<active-plan>/artifacts/user-stories-review.md")
  const w45fm = parseFrontmatter(w45Content)
  if (w45fm.passed === "false" || w45fm.passed === false) {
    throw new Error(
      `W4.5 HALT — UserStories has ${w45fm.issues} critical issue(s). ` +
      `Fix user-stories.md, then re-run Wave 4 (--artifact user-stories) or restart from W4. ` +
      `Review: plans/<active-plan>/artifacts/user-stories-review.md`
    )
  }
  console.log(`[INFO] W4.5 passed (issues: ${w45fm.issues ?? 0}, warnings: ${w45fm.warnings ?? 0})`)
}

const w45Blocker = (w45TaskId && !w45TaskId.startsWith("SKIPPED:")) ? w45TaskId : userStoriesTaskId

// Wave 4.7 — REMOVED (replaced by Wave 6.8 process-flow synthesis in pipeline-w7-w9.md)

// --- W5 feature-list: pre-gen estimate gate (grouping-once + expand-many) ---
const flEstimate = JSON.parse(bash(`.claude/skills/.venv/bin/python3 \
  claude/skills/rebuild-spec/scripts/estimate_artifact_loc.py \
  --artifact feature-list \
  --plan-dir plans/<active-plan> \
  --max-loc ${docs_maxLoc ?? 800}`).stdout)
console.log(`[INFO] W5 feature-list pre-gen estimate: ${flEstimate.unit_count} F###, est_loc=${flEstimate.est_loc}, shard=${flEstimate.shard}`)

if (flEstimate.shard) {
  // SHARD BRANCH: grouping-once (shell) → expand-many (fan-out) → merge → canonical-fcode post-step UNCHANGED.
  // See references/artifact-sharding.md § Feature-list — Grouping-once + Expand-many.
  var featureListTaskId = TaskCreate({ subject: "Wave5: feature-list (shard: grouping-once→expand→merge)",
    description: `Session context: read \`plans/<active-plan>/artifacts/_session-context.md\` FIRST.
SHARD MODE for FeatureList (${flEstimate.unit_count} F###, est_loc=${flEstimate.est_loc} > ${docs_maxLoc ?? 800}).
Read references/artifact-sharding.md § Feature-list — Grouping-once + Expand-many.

UNIQUE SHAPE — feature-list is a global-clustering artifact (F### derived from many source units).

1. SHELL STEP = GROUPING ONCE (global, single agent sees everything):
   - Read ALL prior drafts (US###/SCR###/routes/models/BL###/permissions).
   - Do the GLOBAL clustering in ONE pass → write compact ## Feature Hierarchy table.
   - Write _fragments/feature-list/_slice-plan.json: F### → {member US###, SCR###, routes, models, BL###}.
     F### born here, disjoint by construction. No separate range pre-allocation.
   - Write feature-list.md skeleton: preamble + ## Feature Hierarchy table (shell-owned) + per-F###-batch {POPULATED_BY_FRAGMENTS} anchors under ## Feature Details.

2. FAN-OUT = EXPAND DETAILS per F### batch (BATCHES of REBUILD_SHARD_MAX_PARALLEL=5):
   - Each researcher owns a disjoint batch of already-assigned F###.
   - Write ### F###: Name detail blocks (description, related screens/US/routes/models per feature).
   - Output: _fragments/feature-list/NN-<fbatch>.md. Zero overlap by construction.

3. MERGE: ls|sort → inject per F###-batch anchor → rm -rf.

4. CANONICAL-FCODE POST-STEP (UNCHANGED — runs on merged whole):
   Parse ### F### → derive slugs → GLOBAL slug-collision check → sorted _canonical-fcodes.json → .pending folders.
   Authority: references/canonical-fcode-schema.md.

Template: feature-list-template.md. Draft: plans/<active-plan>/artifacts/feature-list.md`,
    addBlockedBy: [w45Blocker] })
} else {
  var featureListTaskId = resolveWaveTaskId("Wave5: feature-list", () =>
    TaskCreate({ subject: "Wave5: feature-list",
      description: `Session context: read \`plans/<active-plan>/artifacts/_session-context.md\` FIRST.
Generate FeatureList from all prior drafts. Template: feature-list-template.md. Draft: plans/<active-plan>/artifacts/feature-list.md.

After writing feature-list.md, the W5 researcher MUST ALSO emit a canonical fcode/slug JSON and pre-create per-feature folders. Authority: references/canonical-fcode-schema.md.

Steps (run AFTER feature-list.md is finalized):
1. Parse every '### F###: Name' heading under '## Feature Details'.
2. Derive slug per references/canonical-fcode-schema.md § Slug Grammar (CamelCase, alnum-only, ≤36 chars).
3. Collision check: if two features derive the same slug → print '[ERROR] SLUG_COLLISION: F### "<a>" and F### "<b>" both derive slug "<slug>"' to stdout, ABORT (no JSON, no folders). User resolves by renaming a feature, then reruns Wave 5.
4. Write plans/<active-plan>/artifacts/_canonical-fcodes.json per the schema doc (sorted by fcode).
5. For each feature: mkdir -p plans/<active-plan>/artifacts/features/{slug}/ AND touch plans/<active-plan>/artifacts/features/{slug}/.pending (zero-byte marker).

Both outputs (canonical JSON + .pending folders) are consumed by Wave 5.5 existence validator and FS.1 fan-out (slug source).

FLOWS CONTEXT: process-flows are now synthesized at FL.1 (flows pass), not pre-W5.
FS.1 feature-spec researchers may read flows/ if present from a prior run, but flows are NOT a prerequisite for FS.1.`,
      addBlockedBy: [w45Blocker] }))
}
```
