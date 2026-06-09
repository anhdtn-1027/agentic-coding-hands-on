#!/usr/bin/env python3
"""Wave 9 pre-promote — copy artifacts to docs/, archive, GC, sha256 manifest.

v4.0.0+: promotes to layered docs/ paths per docs-canonical-mapping.md:
  docs/system/   ← overview, permissions, business-rules
  docs/generated/ ← route-list, entities (data-model), screen-list, screen-flow,
                     behavior-logic, user-stories, feature-list
  docs/flows/    ← all flows/*.md
  docs/features/ ← 4 files per feature
  docs/screens/  ← screen specs

Scope selection (v5.0.0):
  --scope all      → everything (default; backward-compat for pre-split callers)
  --scope core     → system/ + generated/ MINUS glossary; NO features/flows
  --scope features → docs/features/* only
  --scope flows    → docs/flows/* only
  --scope glossary → docs/system/glossary.md only
  --scope api-contracts → docs/generated/api-contracts.md only

Exit codes: 0 = success, 2 = arg/IO error.
Stdlib only.
"""
from __future__ import annotations

import argparse
import datetime as _dt
import hashlib
import json
import os
import re
import shutil
import sys
import tempfile

# Core artifacts promoted by the default pass (excludes glossary, which is scope-keyed).
CORE_ARTIFACTS = [
    "architecture.md",
    "route-list.md",
    "data-model.md",
    "screen-list.md",
    "screen-flow.md",
    "behavior-logic.md",
    "api-map.md",
    "permissions.md",
    "permissions-matrix.md",
    "user-stories.md",
    "feature-list.md",
    "business-rules.md",
]

# [RT-H2] glossary.md is scope-keyed: only --scope glossary (or all) promotes it.
GLOSSARY_ARTIFACT = "glossary.md"

# v4 canonical layered paths per docs-canonical-mapping.md.
LAYERED_PATH_MAP: dict[str, str] = {
    "system-overview.md": "system/overview.md",
    "architecture.md": "system/architecture.md",
    "permissions.md": "system/permissions.md",
    "glossary.md": "system/glossary.md",
    "business-rules.md": "system/business-rules.md",
    "route-list.md": "generated/route-list.md",
    "api-map.md": "generated/api-map.md",
    "api-contracts.md": "generated/api-contracts.md",
    "permissions-matrix.md": "generated/permissions-matrix.md",
    "data-model.md": "generated/entities.md",
    "screen-list.md": "generated/screen-list.md",
    "screen-flow.md": "generated/screen-flow.md",
    "behavior-logic.md": "generated/behavior-logic.md",
    "user-stories.md": "generated/user-stories.md",
    "feature-list.md": "generated/feature-list.md",
}

# Per-pass archive directories (RT-FM9): each pass writes ONLY to its own archive dir.
# core uses ".review-archive" (existing default).
PASS_ARCHIVE_DIRS: dict[str, str] = {
    "core": ".review-archive",
    "all": ".review-archive",
    "features": ".feature-specs-archive",
    "flows": ".flows-archive",
    "glossary": ".glossary-archive",
}

# Per-pass review report filenames (RT-FM9, RT-C3).
PASS_REVIEW_CANDIDATES: dict[str, list[str]] = {
    "core": ["core-review-report.md", "review-report.md"],
    "all": ["core-review-report.md", "review-report.md"],
    "features": [],  # feature-review-batch-*.md discovered dynamically
    "flows": ["flow-review-report.md"],
    "glossary": ["glossary-review-report.md"],
}


def _resolve_guarded(path: str, base: str) -> str:
    resolved = os.path.realpath(os.path.abspath(path))
    base_resolved = os.path.realpath(os.path.abspath(base))
    if os.path.commonpath([resolved, base_resolved]) != base_resolved:
        raise ValueError(f"Path traversal detected: {path!r} escapes {base!r}")
    return resolved


def _atomic_copy(src: str, dst: str) -> None:
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    with open(src, "rb") as f:
        data = f.read()
    dir_ = os.path.dirname(dst) or "."
    fd, tmp = tempfile.mkstemp(dir=dir_, prefix=".pd_tmp_")
    try:
        with os.fdopen(fd, "wb") as f:
            f.write(data)
        os.rename(tmp, dst)
    except Exception:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise


def _atomic_write_text(dst: str, content: str) -> None:
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    dir_ = os.path.dirname(dst) or "."
    fd, tmp = tempfile.mkstemp(dir=dir_, prefix=".pd_tmp_")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            f.write(content)
        os.rename(tmp, dst)
    except Exception:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise


def _sha256_file(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def _utc_archive_tag() -> str:
    now = _dt.datetime.now(_dt.timezone.utc)
    return now.strftime("%Y-%m-%dT%H-%M-%SZ")


def _layered_dst(fname: str, docs_root: str) -> str | None:
    """Return v4 layered destination path for a core artifact filename, or None if unmapped."""
    rel = LAYERED_PATH_MAP.get(fname)
    if rel is None:
        return None
    return os.path.join(docs_root, rel)


def promote(args: argparse.Namespace) -> None:
    cwd = os.getcwd()
    scope: str = getattr(args, "scope", "all") or "all"

    try:
        plan_dir = _resolve_guarded(args.plan_dir, cwd)
        docs_root = _resolve_guarded(args.docs_root, cwd)
    except ValueError as e:
        print(f"error: {e}", file=sys.stderr)
        sys.exit(2)

    artifacts_dir = os.path.join(plan_dir, "artifacts")
    promoted_files: list[str] = []  # absolute dst paths

    # ── Step 1: Promote core artifacts ───────────────────────────────────────
    # Core artifacts are promoted when scope is 'all' or 'core'.
    if scope in ("all", "core"):
        if args.mode == "full":
            filenames_to_promote = list(CORE_ARTIFACTS)
            fcode_dirs: list[str] = []
            features_src = os.path.join(artifacts_dir, "features")
            if os.path.isdir(features_src):
                fcode_dirs = [
                    d for d in os.listdir(features_src)
                    if os.path.isdir(os.path.join(features_src, d))
                ]
        else:
            # Directory markers (e.g. "flows/") are not files — flows are promoted via --affected-flows.
            filenames_to_promote = [
                f.strip() for f in (args.affected_artifacts or "").split(",")
                if f.strip() and not f.strip().endswith("/")
            ]
            raw_fcodes = [c.strip() for c in (args.affected_fcodes or "").split(",") if c.strip()]
            fcode_dirs = [fc for fc in raw_fcodes if re.fullmatch(r"F\d{3}(?:_\w+)?", fc)]
            dropped = [fc for fc in raw_fcodes if fc not in set(fcode_dirs)]
            if dropped:
                print(f"[WARN] {len(dropped)} fcode(s) failed validation: {dropped}", file=sys.stderr)

        # Promote each core artifact (never includes glossary via this loop — [RT-H2])
        for fname in filenames_to_promote:
            if fname == GLOSSARY_ARTIFACT:
                # glossary is scope-keyed; skip it here even if passed via --affected-artifacts
                continue
            src = os.path.join(artifacts_dir, fname)
            if not os.path.isfile(src):
                print(f"warning: source not found, skipping: {src}", file=sys.stderr)
                continue
            # v4 layered path only
            dst_layered = _layered_dst(fname, docs_root)
            if dst_layered:
                try:
                    _atomic_copy(src, dst_layered)
                    promoted_files.append(dst_layered)
                except OSError as e:
                    print(f"error: cannot copy {src} -> {dst_layered}: {e}", file=sys.stderr)
                    sys.exit(2)
            else:
                print(f"warning: no layered path mapping for {fname}, skipping", file=sys.stderr)

        # ── Step 1.6: system-overview.md → docs/system/overview.md ──────────────
        # v4: canonical path is docs/system/overview.md only.
        sov_src = os.path.join(artifacts_dir, "system-overview.md")
        if os.path.isfile(sov_src):
            sov_dst = os.path.join(docs_root, "system", "overview.md")
            try:
                _atomic_copy(sov_src, sov_dst)
                promoted_files.append(sov_dst)
            except OSError as e:
                print(f"error: cannot copy system-overview.md -> {sov_dst}: {e}", file=sys.stderr)
                sys.exit(2)

        # [RT-C4] When scope=core and leftover docs/features/ dirs exist (v4 layout), write .stale marker.
        if scope == "core":
            features_dst = os.path.join(docs_root, "features")
            if os.path.isdir(features_dst) and any(
                os.path.isdir(os.path.join(features_dst, d))
                for d in os.listdir(features_dst)
            ):
                stale_path = os.path.join(features_dst, ".stale")
                try:
                    _atomic_write_text(
                        stale_path,
                        "source changed — run `/tkm:rebuild-spec --feature-specs` to refresh\n",
                    )
                except OSError as e:
                    print(f"warning: cannot write .stale marker: {e}", file=sys.stderr)

    # ── Step 1.5: Feature specs ───────────────────────────────────────────────
    # Feature specs are promoted when scope is 'all' or 'features'.
    if scope in ("all", "features"):
        # Determine which fcode_dirs to promote
        if scope == "features":
            # In features-only scope, build fcode_dirs from --affected-fcodes or full scan
            if args.mode == "full":
                _feat_src = os.path.join(artifacts_dir, "features")
                fcode_dirs = []
                if os.path.isdir(_feat_src):
                    fcode_dirs = [
                        d for d in os.listdir(_feat_src)
                        if os.path.isdir(os.path.join(_feat_src, d))
                    ]
            else:
                raw_fcodes = [c.strip() for c in (args.affected_fcodes or "").split(",") if c.strip()]
                fcode_dirs = [fc for fc in raw_fcodes if re.fullmatch(r"F\d{3}(?:_\w+)?", fc)]
                dropped = [fc for fc in raw_fcodes if fc not in set(fcode_dirs)]
                if dropped:
                    print(f"[WARN] {len(dropped)} fcode(s) failed validation: {dropped}", file=sys.stderr)

        for fcode in fcode_dirs:
            src_fdir = os.path.join(artifacts_dir, "features", fcode)
            if not os.path.isdir(src_fdir):
                features_src_dir = os.path.join(artifacts_dir, "features")
                if os.path.isdir(features_src_dir):
                    matches = [d for d in os.listdir(features_src_dir) if d.startswith(fcode + "_") and os.path.isdir(os.path.join(features_src_dir, d))]
                    if len(matches) == 1:
                        fcode = matches[0]
                        src_fdir = os.path.join(artifacts_dir, "features", fcode)
                if not os.path.isdir(src_fdir):
                    print(f"warning: feature dir not found, skipping: {src_fdir}", file=sys.stderr)
                    continue
            if not os.path.isdir(src_fdir):
                continue
            dst_fdir = os.path.join(docs_root, "features", fcode)
            for dirpath, _, filenames in os.walk(src_fdir):
                for file_name in filenames:
                    src_file = os.path.join(dirpath, file_name)
                    rel = os.path.relpath(src_file, src_fdir)
                    dst_file = os.path.join(dst_fdir, rel)
                    try:
                        _atomic_copy(src_file, dst_file)
                        promoted_files.append(dst_file)
                    except OSError as e:
                        print(f"error: cannot copy {src_file} -> {dst_file}: {e}", file=sys.stderr)
                        sys.exit(2)

    # ── Step 1.7: flows/ → docs/flows/ ───────────────────────────────────────
    # Flows are promoted when scope is 'all' or 'flows'.
    if scope in ("all", "flows"):
        flows_src = os.path.join(artifacts_dir, "flows")
        if os.path.isdir(flows_src):
            if args.mode == "full":
                flow_files = [
                    f for f in os.listdir(flows_src)
                    if os.path.isfile(os.path.join(flows_src, f)) and not f.startswith(".")
                ]
            else:
                raw_flows = [f.strip() for f in (args.affected_flows or "").split(",") if f.strip()]
                flow_files = [f for f in raw_flows if os.path.isfile(os.path.join(flows_src, f))]

            flows_dst_root = os.path.join(docs_root, "flows")
            for flow_fname in flow_files:
                flow_src_file = os.path.join(flows_src, flow_fname)
                flow_dst_file = os.path.join(flows_dst_root, flow_fname)
                try:
                    _atomic_copy(flow_src_file, flow_dst_file)
                    promoted_files.append(flow_dst_file)
                except OSError as e:
                    print(f"error: cannot copy {flow_src_file} -> {flow_dst_file}: {e}", file=sys.stderr)
                    sys.exit(2)

    # ── Step 1.7g: glossary.md → docs/system/glossary.md ────────────────────
    # [RT-H2] Glossary is only promoted when scope is 'all' or 'glossary'.
    if scope in ("all", "glossary"):
        glossary_src = os.path.join(artifacts_dir, GLOSSARY_ARTIFACT)
        if os.path.isfile(glossary_src):
            glossary_dst = _layered_dst(GLOSSARY_ARTIFACT, docs_root)
            if glossary_dst:
                try:
                    _atomic_copy(glossary_src, glossary_dst)
                    promoted_files.append(glossary_dst)
                except OSError as e:
                    print(f"error: cannot copy glossary.md -> {glossary_dst}: {e}", file=sys.stderr)
                    sys.exit(2)

    # ── Step 1.7a: api-contracts.md → docs/generated/api-contracts.md ─────────
    # Promoted when scope is 'all' or 'api-contracts'.
    if scope in ("all", "api-contracts"):
        ac_src = os.path.join(artifacts_dir, "api-contracts.md")
        if os.path.isfile(ac_src):
            ac_dst = _layered_dst("api-contracts.md", docs_root)
            if ac_dst:
                try:
                    _atomic_copy(ac_src, ac_dst)
                    promoted_files.append(ac_dst)
                except OSError as e:
                    print(f"error: cannot copy api-contracts.md -> {ac_dst}: {e}", file=sys.stderr)
                    sys.exit(2)

    # ── Step 1.8: Screen specs ────────────────────────────────────────────────
    # Screen specs are promoted when scope is 'all' (screen-specs has its own pass; not a scope here).
    if scope == "all":
        screens_src = os.path.join(artifacts_dir, "screens")
        if os.path.isdir(screens_src):
            if args.mode == "full":
                scr_dirs = sorted([
                    d for d in os.listdir(screens_src)
                    if os.path.isdir(os.path.join(screens_src, d))
                    and re.fullmatch(r"SCR\d{3,4}[a-z]?(?:_\w+)?", d)
                ])
            else:
                raw = [c.strip() for c in (args.affected_screens or "").split(",") if c.strip()]
                scr_dirs = []
                for code in raw:
                    if not re.fullmatch(r"SCR\d{3,4}[a-z]?", code):
                        print(f"[WARN] invalid SCR code skipped: {code}", file=sys.stderr)
                        continue
                    matches = [
                        d for d in os.listdir(screens_src)
                        if (d == code or d.startswith(code + "_"))
                        and re.fullmatch(r"SCR\d{3,4}[a-z]?(?:_\w+)?", d)
                        and os.path.isdir(os.path.join(screens_src, d))
                    ]
                    if len(matches) == 1:
                        scr_dirs.append(matches[0])
                    elif len(matches) > 1:
                        print(f"[ERROR] ambiguous SCR dir for {code}: {matches} — rename directories to resolve conflict", file=sys.stderr)
                        sys.exit(2)

            screens_dst_root = os.path.join(docs_root, "screens")
            for sdir in scr_dirs:
                spec_src = os.path.join(screens_src, sdir, "spec.md")
                if not os.path.isfile(spec_src):
                    print(f"[WARN] screen spec missing, skipping: {spec_src}", file=sys.stderr)
                    continue
                spec_dst = os.path.join(screens_dst_root, sdir, "spec.md")
                try:
                    _atomic_copy(spec_src, spec_dst)
                    promoted_files.append(spec_dst)
                except OSError as e:
                    print(f"error: cannot copy {spec_src} -> {spec_dst}: {e}", file=sys.stderr)
                    sys.exit(2)

    # ── Step 2: Archive review reports (per-pass, RT-FM9) ────────────────────
    archive_tag = _utc_archive_tag()
    archive_dir_name = PASS_ARCHIVE_DIRS.get(scope, ".review-archive")
    archive_dir = os.path.join(docs_root, archive_dir_name, archive_tag)
    os.makedirs(archive_dir, exist_ok=True)

    review_candidates = list(PASS_REVIEW_CANDIDATES.get(scope, []))
    # For features and all scopes: also discover feature-review-batch-*.md dynamically
    if scope in ("all", "features") and os.path.isdir(artifacts_dir):
        for name in os.listdir(artifacts_dir):
            if name.startswith("feature-review-batch-") and name.endswith(".md"):
                review_candidates.append(name)
    # For all scope: also discover screen-review-batch-*.md dynamically
    if scope == "all" and os.path.isdir(artifacts_dir):
        for name in os.listdir(artifacts_dir):
            if name.startswith("screen-review-batch-") and name.endswith(".md"):
                review_candidates.append(name)

    for rname in review_candidates:
        rsrc = os.path.join(artifacts_dir, rname)
        if not os.path.isfile(rsrc):
            continue
        rdst = os.path.join(archive_dir, rname)
        try:
            _atomic_copy(rsrc, rdst)
        except OSError as e:
            print(f"warning: cannot archive {rname}: {e}", file=sys.stderr)

    # ── Step 3: Archive GC (keep only 5 newest, per-pass archive) ────────────
    pass_archive_root = os.path.join(docs_root, archive_dir_name)
    if os.path.isdir(pass_archive_root):
        subdirs = sorted([
            d for d in os.listdir(pass_archive_root)
            if os.path.isdir(os.path.join(pass_archive_root, d))
        ])
        excess = len(subdirs) - 5
        for old in subdirs[:excess]:
            try:
                shutil.rmtree(os.path.join(pass_archive_root, old))
            except OSError as e:
                print(f"warning: cannot remove old archive {old}: {e}", file=sys.stderr)

    # ── Step 4: Compute sha256 manifest ──────────────────────────────────────
    manifest_lines: list[str] = []
    for dst_abs in promoted_files:
        if not os.path.isfile(dst_abs):
            continue
        digest = _sha256_file(dst_abs)
        relpath = os.path.relpath(dst_abs, cwd)
        manifest_lines.append(f"{digest}  {relpath}")

    manifest_path = os.path.join(artifacts_dir, "_promoted-sha256.txt")
    try:
        _atomic_write_text(manifest_path, "\n".join(manifest_lines) + "\n" if manifest_lines else "")
    except OSError as e:
        print(f"error: cannot write sha256 manifest: {e}", file=sys.stderr)
        sys.exit(2)

    print(f"promoted {len(promoted_files)} file(s); manifest: {manifest_path}")


def main() -> None:
    p = argparse.ArgumentParser(
        description="Wave 9 pre-promote: copy artifacts to layered docs/ paths, archive, GC, manifest."
    )
    p.add_argument("--plan-dir", required=True, help="Path to active plan directory")
    p.add_argument("--docs-root", default="docs", help="Docs root directory (default: docs)")
    p.add_argument("--docs-specs", default=None,
                   help="Deprecated — no longer used; state files now live at docs_root root")
    p.add_argument("--mode", required=True, choices=["full", "incremental"],
                   help="Promotion mode: full or incremental")
    p.add_argument("--scope", default="all",
                   choices=["all", "core", "features", "flows", "glossary", "api-contracts"],
                   help=(
                       "Promotion scope (v5.0.0): "
                       "'all' (default, backward-compat) promotes everything; "
                       "'core' promotes system/+generated/ excluding glossary; "
                       "'features' promotes docs/features/* only; "
                       "'flows' promotes docs/flows/* only; "
                       "'glossary' promotes docs/system/glossary.md only."
                   ))
    p.add_argument("--affected-artifacts", default=None,
                   help="Comma-separated filenames to promote (incremental mode)")
    p.add_argument("--affected-fcodes", default=None,
                   help="Comma-separated F### codes to promote (incremental mode)")
    p.add_argument("--affected-screens", default=None,
                   help="Comma-separated SCR codes to promote (incremental mode)")
    p.add_argument("--affected-flows", default=None,
                   help="Comma-separated flow filenames to promote (incremental mode)")
    p.add_argument("--screen-spec-shas-json", default=None,
                   help="Path to JSON file containing per-screen sha snapshot (written to .rebuild-state.json)")
    args = p.parse_args()
    promote(args)


if __name__ == "__main__":
    main()
