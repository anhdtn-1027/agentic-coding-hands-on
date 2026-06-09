# Docs Canonical Mapping (kit-internal reference)

Single source of truth for which skill owns which doc topic. Loaded by `rebuild-spec`, `takumi`, `manage-docs`, and `doc-writer`. Update this file FIRST when changing layered-doc behavior — drift here counts as a breaking change (major version bump for every consumer).

## Layered Model

`docs/` has 5 namespaces: `system/` (curated narratives), `flows/` (AI-drafted cross-feature journeys; user owns post-generation), `features/{slug}/` (4 audience-aware files per feature), `generated/` (raw inventories, free regen), `decisions/` (human-only ADRs). `manage-docs` owns top-level narrative files (`project-roadmap.md`, `code-standards.md`, etc.).

Both machine-generated and human-maintained layers coexist. They MUST NOT contain duplicate authoritative content for the same topic. When two skills both have a claim, the canonical home below wins.

## Canonical Mapping

| Topic | Canonical path | Owner skill | Notes |
|---|---|---|---|
| System overview (narrative) | `docs/system/overview.md` | rebuild-spec | Full content; no stub |
| Architecture diagrams | `docs/system/architecture.md` | rebuild-spec | Mermaid + tech stack |
| Glossary | `docs/system/glossary.md` | rebuild-spec | Term:definition |
| Permissions (curated) | `docs/system/permissions.md` | rebuild-spec | Plain-lang curated view |
| Business rules (curated) | `docs/system/business-rules.md` | rebuild-spec | Plain-lang BR draft |
| Flows (cross-feature) | `docs/flows/{slug}.md` | rebuild-spec | AI draft; user may rename |
| Feature tech-spec | `docs/features/{slug}/technical-spec.md` | rebuild-spec | Per feature |
| Feature business-context | `docs/features/{slug}/business-context.md` | rebuild-spec | Per feature |
| Feature screens | `docs/features/{slug}/screens.md` | rebuild-spec | Per feature |
| Feature edge-cases | `docs/features/{slug}/edge-cases.md` | rebuild-spec | Per feature |
| Route inventory (raw) | `docs/generated/route-list.md` | rebuild-spec | Free regen |
| API map | `docs/generated/api-map.md` | rebuild-spec | Routes + bg-jobs |
| API contracts | `docs/generated/api-contracts.md` | rebuild-spec | REST/GraphQL/gRPC request-response contracts (opt-in `--api-contracts`) |
| Permissions matrix (raw) | `docs/generated/permissions-matrix.md` | rebuild-spec | PERM### codes |
| Entities | `docs/generated/entities.md` | rebuild-spec | Renamed data-model |
| User stories | `docs/generated/user-stories.md` | rebuild-spec | US### codes |
| Feature catalog | `docs/generated/feature-list.md` | rebuild-spec | F### inventory |
| ADRs | `docs/decisions/ADR-*.md` | human only | Never regenerated |
| Roadmap | `docs/project-roadmap.md` | manage-docs | Unchanged |
| Code standards | `docs/code-standards.md` | manage-docs | Unchanged |
| Deployment | `docs/deployment-guide.md` | manage-docs | Unchanged |
| System architecture (manage-docs) | `docs/system-architecture.md` | manage-docs | Coexists with `docs/system/architecture.md` — different scope |

(22 rows)

**Disambiguation:** `docs/system/architecture.md` (rebuild-spec: generated diagrams + tech stack) and `docs/system-architecture.md` (manage-docs: narrative architecture doc) are SEPARATE files with different scopes. They coexist intentionally.

## Output Language — Translation Mirrors (v5.1.0)

`docs/<lang>/` directories are 1:1 prose-translated mirrors of the primary language's docs, owned exclusively by `rebuild-spec --lang`. The English skeleton (headings, code tokens, field labels, table headers, fenced code, frontmatter) is byte-identical across ALL languages.

| Aspect | Value |
|--------|-------|
| Primary docs | `docs/` (if `primary_lang=en`) or `docs/<primary_lang>/` |
| Mirror docs | `docs/<lang>/` (one per secondary language) |
| State | `docs/.rebuild-state.json` (root, language-independent) — `primary_lang` + `translations` map |
| Validator | `validate_translation_skeleton.py` enforces skeleton identity |
| Owner | `rebuild-spec` only — manage-docs/doc-writer/takumi remain English `docs/`-root (not lang-aware) |
| Auto-sync | After any primary pass promotes, mirrors re-translated for changed artifacts (env opt-out: `REBUILD_AUTO_SYNC_TRANSLATIONS=0`) |

Consumers that read `docs/` paths (e.g. `docs/generated/feature-list.md`) are unaffected — the primary's canonical paths are unchanged. Mirror paths (`docs/<lang>/`) are only consumed by the `--lang` translate pass.

## Stub Rule

None — v4.0.0+ promotes full content for all artifacts. The pre-v4 `docs/specs/system-overview.md` redirect stub is removed. `docs/system/overview.md` carries full content.

## Surgical-Edit Rule

When `doc-writer` is invoked via `tkm:takumi` Step 6 (NOT via `rebuild-spec` Wave 9):

| Path | doc-writer surgical-edit? | Notes |
|---|---|---|
| `docs/generated/*` | YES | Raw inventories |
| `docs/system/*` | YES | Curated, but rare |
| `docs/features/*/technical-spec.md` | YES | BR/SM/ALG/INT table edits |
| `docs/features/*/business-context.md` | NO | AI draft; full rebuild only |
| `docs/features/*/screens.md` | YES | Screen Route Table |
| `docs/features/*/edge-cases.md` | YES | Edge case table rows |
| `docs/flows/*` | NO | AI draft; user owns |
| `docs/decisions/*` | NEVER | Human only |

MAY: add/remove/edit rows in inventory tables; update counts; copy adjacent-row schema when inserting.
MUST NOT: rewrite section headings, change document structure, edit schema codes, or touch NO/NEVER paths above.
MUST NOT: create new per-feature dirs. If new F### detected → advise `Run /tkm:rebuild-spec --features F###`.

Wave 9 promotion (full-content writes) bypasses this rule.

## Escalation Heuristic

If a single artifact has **more than 3 changed source files** affecting it in one takumi session, `doc-writer` SKIPS the edit and appends a non-blocking advisory to its output:

```
Run /tkm:rebuild-spec --artifact api-map
```

User decides whether to regenerate. Edits to other artifacts in the same session proceed normally.

## Absent-Layer Advisory

When the doc layer that `doc-writer` would surgically edit is **missing** AND the session changed `≥ 2` feature-surface files, `tkm:takumi` Step 6.a and `tkm:manage-docs update` Phase 2.a emit a 2-line `ℹ` advisory on **stderr only**. Two mutually-exclusive layers:

| Condition | Advisory points to |
|---|---|
| `! -d docs` AND `TRIGGER_HITS ≥ 2` | `/tkm:manage-docs init` |
| `-d docs` AND no `docs/system/`, `docs/features/`, or `docs/generated/` AND `TRIGGER_HITS ≥ 2` | `/tkm:rebuild-spec` |
| `docs/system/`, `docs/features/`, or `docs/generated/` present | *(no advisory — surgical edit proceeds)* |

**Contract:**

- Stderr only (`1>&2`); does NOT mutate the `doc-writer` prompt; does NOT block flow (fires in `--auto` mode too).
- Mutually exclusive by control flow (`if … elif …`) — `docs/` absent suppresses the specs advisory because subdirs cannot exist without the parent.
- `TRIGGER_HITS` counts session-changed files matching the trigger-pattern set **after** stripping test/mock/fixture paths (`tests/`, `__tests__/`, `mocks/`, `fixtures/`, `*.test.*`, `*.spec.*`). Pure-test sessions stay silent.
- Trigger patterns are an inline mirror of `subagent-patterns.md` → `## Documentation` → Trigger Mapping. Update both when adding patterns.

**Version policy:** adding/removing/relaxing this advisory is **patch** (additive console output, no contract change). The surgical-edit contract above and the canonical mapping table remain the breaking-change surface.

## Version Policy

This file is the contract. Any change to the mapping table, stub rule, surgical-edit rule, or escalation heuristic is **breaking** and bumps the major version of every consumer.

PR `2026-05-11` bumps:

| Skill / agent | From | To |
|---|---|---|
| `rebuild-spec` | 2.9.1 | 3.0.0 |
| `takumi` | 2.1.1 | 3.0.0 |
| `manage-docs` | 1.0.0 | 2.0.0 |
| `doc-writer` (agent) | n/a (unversioned) | tagged "v3.0.0+" section |

PR `2026-05-26` bumps:

| Skill / agent | From | To |
|---|---|---|
| `rebuild-spec` | 3.0.0 | 4.0.0 |
| `takumi` | — | pending consumer update |
| `manage-docs` | — | pending consumer update |
| `doc-writer` (agent) | — | pending consumer update |

NOTE: takumi, manage-docs, and doc-writer version bumps deferred to follow-up PRs. Only rebuild-spec is bumped in this revision.

Consumers: link this file from `## References` in each owner's SKILL.md / agent.md. Do NOT duplicate the table — link only.
