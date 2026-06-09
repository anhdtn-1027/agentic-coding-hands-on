# `propose-improvements` (dynamic workflow)

A **dynamic workflow** for Claude Code: the sibling `propose-improvements.js` is a single
self-contained script the workflow runtime executes, calling `agent()` / `parallel()` /
`phase()` to fan out subagents in a fixed control flow. Unlike a skill (which the model
interprets), the orchestration is code — same steps, same order, every run.

It generates a customer-ready improvement proposal for the current repository — **technical**
track always, **business** track when the repo is Spec-Driven (SDD).

## Layout

```
propose-improvements.js          # orchestrator (runs in the workflow sandbox) — sibling of this dir
propose-improvements/            # everything the orchestrator needs, shipped beside it
├── README.md                    # this file
├── lib/*.mjs                    # deterministic steps as runnable node CLIs
├── references/**                # per-step subagent contracts (what each step must do)
├── templates/**                 # output shapes the subagents must produce
└── __tests__/                   # node --test unit tests for the pure helpers
```

## Design rationale

The workflow sandbox has **no filesystem or module access**, which drives three rules:

1. **The orchestrator is self-contained.** No `import` of sibling files — only the runtime
   globals (`agent`, `parallel`, `phase`, `log`, `args`). All file I/O is delegated to
   subagents or to the `lib/*.mjs` CLIs.
2. **Subagents do the I/O.** `researcher` / `reviewer` / `Explore` agents read the bundled
   `references/**` and `templates/**` contracts by absolute path (resolved once at preflight)
   and write artifacts under the repo's `plans/`.
3. **Deterministic steps are node CLIs.** Pure, testable logic (detection, combine, dedup
   prep, verdict application) lives in `lib/*.mjs`. The orchestrator runs them via
   `node <lib>/<step>.mjs …`; each prints `done:`/`skip:`/`warn:` lines then a `Status:`
   trailer. Their pure cores are exported and unit-tested under `__tests__/`.

The orchestration block is guarded by `typeof agent === 'function'`, so `node --test` can
import the module to test the pure helpers without triggering a real run.

## Pipeline

Phases A–E:

```
scout → discovery → research → improvement → track proposals
      → combine → dedup → validate (one agent per item) → apply → improvement-proposal.md
```

Output: `plans/improvement-proposal/improvement-proposal.md`.

## Invocation

`/propose-improvements [focus] [flags]`

| Flag | Effect |
|------|--------|
| `--technical-only` | technical track only (skips SDD detection) |
| `--business-only` | business track only (requires an SDD repo, else BLOCKED) |
| `--high` | adds source-code security discovery + SAST rollup (composes `tkm:audit-security`) |
| `--spec-folder <path>` | force a specs root instead of auto-detecting SDD |
| `--force` | wipe `plans/improvement-proposal/` and regenerate from scratch |

`--technical-only` + `--business-only` together, and `--debug`, are refused (BLOCKED).

## Idempotency & re-runs

Re-runs are gated at the **orchestrator** level, not just inside subagents. At Preflight the
resolver agent inventories every existing non-empty file under `plans/improvement-proposal/`
(after any `--force` wipe) and returns the list; the orchestrator builds a path set and:

- **Fully complete run** — if `improvement-proposal.md` already exists, the workflow
  short-circuits immediately (no agents spawned beyond Preflight).
- **Partial / interrupted run** — each fan-out item (scout, discovery, research, improvement,
  track proposals, validation) is skipped when its artifact is already on disk, so only the
  missing items spawn an agent. The back-half CLIs (`combine` / `dedup` / `phase-d-prep` /
  `apply-verdicts`) self-short-circuit on their own outputs.
- **`--force`** — wipes the tree first, so the inventory is empty and the full pipeline runs.

Because gating is by file **existence**, a re-run will **not** pick up code changes for an
artifact that already exists — pass `--force` to regenerate after the repo changes.

> Known limitation: on a partial resume that regenerates an upstream item, `combine.mjs` skips
> on existence (not content hash), so `combined-initial.md` can stay stale. Use `--force` for a
> guaranteed-fresh proposal. (Tracked as a follow-up.)

## Testing

```bash
cd claude/workflows/propose-improvements && node --test
```
