---
description: Improve or compare a Takumi skill — deliver improvements as update-safe extensions
argument-hint: "<skill-name> [--compare <alt-skill-path>] [--auto|--fast]"
---

Activate the `kaizen` skill.

<target>$ARGUMENTS</target>

Modes:
- `<skill-name>` → improve workflow: Recon → Map → Analyze → Challenge → Benchmark → Deliver (extension files only)
- `--compare <alt-skill-path>` → head-to-head comparison report, no extension written
- `--fast` → static analysis only, skip Challenge + Benchmark
- `--auto` → full workflow, auto-approve gates

Output: extension files under `.claude/skills/<dir>/extensions/` (improve mode) or comparison report in `plans/reports/` (compare mode). Shipped SKILL.md files are never edited.
