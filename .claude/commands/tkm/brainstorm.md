---
description: Role-aware brainstorming with trade-off analysis and brutal honesty (default CTO; --role / --bod for other lenses)
argument-hint: "[problem or decision] [--role ceo|cto|cfo|coo|cmo|cpo] [--bod[=r1,r2,...]] [--level low|medium|high|max]"
---

Activate the `brainstorm` skill via `brainstormer` subagent.

<topic>$ARGUMENTS</topic>

**Advisor lens** — parse the arguments:
- No flag → **CTO** lens (default; technical/architectural — unchanged historical behaviour).
- `--role ceo|cto|cfo|coo|cmo|cpo` → single executive perspective.
- `--bod` → convene a C-level board (one pass, multiple perspectives); `--bod=ceo,cfo,coo` for a subset.
- If both `--role` and `--bod` are given, `--bod` wins.
- Load the skill's `roles.md` whenever `--role`/`--bod` is present for the lens definitions and board synthesis format.

**Single-lens output** — produce 3-5 distinct approaches, each with:
- Core idea (1-2 sentences)
- Trade-offs (pros, cons, edge cases)
- Fit for the commission (codebase for CTO; strategy/budget/ops/market/product/content for other lenses)
- Estimated effort and risk

End with a recommended option and clear reasoning, weighed on the chosen advisor's success metrics.

**Board output (`--bod`)** — each advisor examines independently, then synthesise using the board format in `roles.md` (agreements, conflicts-and-resolutions table, board verdict).

Push back on weak ideas — do not people-please.
