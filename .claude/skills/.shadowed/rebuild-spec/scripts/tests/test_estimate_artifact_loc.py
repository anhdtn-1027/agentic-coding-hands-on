"""Tests for estimate_artifact_loc.py — pre-gen artifact LOC estimator."""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

import pytest

SCRIPTS = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(SCRIPTS))
from estimate_artifact_loc import (  # noqa: E402
    estimate,
    DESCRIPTORS,
    _count_inventory_by_type,
    _count_bl_inventory,
    _extract_actors,
)


def _write_scout(plan_dir, *, file_inventory="", bl_inventory=""):
    """Write a scout-report.md with the given File Inventory / BL Inventory bodies."""
    scout = plan_dir / "artifacts" / "scout-report.md"
    scout.write_text(
        "# Scout Report\n\n## Detected Language\nTypeScript\n\n"
        f"## File Inventory\n\n{file_inventory}\n\n"
        f"## Background Logic Source Inventory\n\n### TypeScript\n{bl_inventory}\n\n"
        "## Notes\n- none\n"
    )
    return scout


def _inv(entries):
    """Build TAB-separated File Inventory lines from (path, type) tuples."""
    return "\n".join(f"{p}\t{t}" for p, t in entries)


@pytest.fixture
def tmp_plan(tmp_path):
    """Create a minimal plan dir with artifacts subdir."""
    arts = tmp_path / "artifacts"
    arts.mkdir()
    return tmp_path


@pytest.fixture
def small_route_list(tmp_path):
    rl = tmp_path / "route-list.md"
    rl.write_text(
        "| Method | Path | Handler | Middleware |\n"
        "|--------|------|---------|------------|\n"
        "| GET | /api/users | UserController@index | auth |\n"
        "| POST | /api/users | UserController@store | auth |\n"
        "| GET | /api/posts | PostController@index | auth |\n"
    )
    return rl


@pytest.fixture
def large_route_list(tmp_path):
    rl = tmp_path / "route-list.md"
    lines = ["| Method | Path | Handler | Middleware |", "|--------|------|---------|------------|"]
    for i in range(260):
        lines.append(f"| GET | /api/resource{i} | Ctrl{i}@index | auth |")
    rl.write_text("\n".join(lines))
    return rl


class TestApiContracts:
    def test_small_route_list_no_shard(self, small_route_list):
        r = estimate("api-contracts", route_list=small_route_list)
        assert r["shard"] is False
        assert r["unit_count"] == 3
        assert r["est_loc"] == 48  # 3 * 16

    def test_large_route_list_shard(self, large_route_list):
        r = estimate("api-contracts", route_list=large_route_list)
        assert r["shard"] is True
        assert r["unit_count"] == 260
        assert r["est_loc"] == 4160  # 260 * 16
        assert r["slice_key"] == "resource namespace"

    def test_no_route_list_no_shard(self):
        r = estimate("api-contracts")
        assert r["shard"] is False
        assert r["unit_count"] == 0

    def test_header_sep_rows_excluded(self, tmp_path):
        rl = tmp_path / "route-list.md"
        rl.write_text(
            "| Method | Path | Handler |\n"
            "|--------|------|---------|\n"
            "| Method | Path | Handler |\n"  # repeated header
            "|:-------|:-----|:--------|\n"  # separator variant
        )
        r = estimate("api-contracts", route_list=rl)
        assert r["unit_count"] == 0


class TestDataModel:
    def test_fixed_threshold_below(self, tmp_plan):
        dm = tmp_plan / "artifacts" / "data-model.md"
        lines = []
        for i in range(30):
            lines.append(f"### MODEL{i:03d}_Entity{i}")
        dm.write_text("\n".join(lines))
        r = estimate("data-model", plan_dir=tmp_plan)
        assert r["shard"] is False
        assert r["unit_count"] == 30

    def test_fixed_threshold_above(self, tmp_plan):
        dm = tmp_plan / "artifacts" / "data-model.md"
        lines = []
        for i in range(45):
            lines.append(f"### MODEL{i:03d}_Entity{i}")
        dm.write_text("\n".join(lines))
        r = estimate("data-model", plan_dir=tmp_plan)
        assert r["shard"] is True
        assert r["unit_count"] == 45


class TestMaxLocOverride:
    def test_custom_max_loc_changes_boundary(self, large_route_list):
        r_default = estimate("api-contracts", route_list=large_route_list, max_loc=800)
        assert r_default["shard"] is True

        r_high = estimate("api-contracts", route_list=large_route_list, max_loc=5000)
        assert r_high["shard"] is False
        assert r_high["unit_count"] == 260

    def test_data_model_ignores_max_loc(self, tmp_plan):
        """data-model uses fixed threshold (>=40), not est_loc > max_loc."""
        dm = tmp_plan / "artifacts" / "data-model.md"
        lines = [f"### MODEL{i:03d}_E{i}" for i in range(45)]
        dm.write_text("\n".join(lines))
        r = estimate("data-model", plan_dir=tmp_plan, max_loc=99999)
        assert r["shard"] is True  # fixed threshold, max_loc irrelevant


class TestFeatureList:
    def test_lpu_42_boundary_below(self, tmp_plan):
        fl = tmp_plan / "artifacts" / "feature-list.md"
        lines = [f"### F{i:03d}_Feature{i}" for i in range(18)]
        fl.write_text("\n".join(lines))
        r = estimate("feature-list", plan_dir=tmp_plan)
        assert r["unit_count"] == 18
        assert r["est_loc"] == 756  # 18 * 42 = 756 < 800
        assert r["shard"] is False

    def test_lpu_42_boundary_above(self, tmp_plan):
        fl = tmp_plan / "artifacts" / "feature-list.md"
        lines = [f"### F{i:03d}_Feature{i}" for i in range(20)]
        fl.write_text("\n".join(lines))
        r = estimate("feature-list", plan_dir=tmp_plan)
        assert r["unit_count"] == 20
        assert r["est_loc"] == 840  # 20 * 42 = 840 > 800
        assert r["shard"] is True
        assert r["slice_key"] == "expand by F### batch"


class TestRouteList:
    def test_lpu_2_small(self, small_route_list):
        r = estimate("route-list", route_list=small_route_list)
        assert r["unit_count"] == 3
        assert r["est_loc"] == 6
        assert r["shard"] is False

    def test_lpu_2_large(self, tmp_path):
        rl = tmp_path / "route-list.md"
        lines = ["| Method | Path | Handler |", "|--------|------|---------|"]
        for i in range(500):
            lines.append(f"| GET | /api/r{i} | C{i}@i | auth |")
        rl.write_text("\n".join(lines))
        r = estimate("route-list", route_list=rl)
        assert r["shard"] is True
        assert r["unit_count"] == 500


class TestUnknownArtifact:
    def test_unknown_returns_no_shard(self):
        r = estimate("unknown")
        assert r["shard"] is False
        assert r["slice_key"] is None


class TestFirstGen:
    """First-generation dispatch: the artifact's own output file does NOT exist yet, so the
    estimate must come from the scout report (or an already-generated upstream artifact).
    These are the paths that previously returned unit_count=0 → shard:false → monolithic hang.
    """

    def test_behavior_logic_from_scout_bl_inventory_shards(self, tmp_plan):
        bl = "\n".join(f"- service: app/services/svc{i}.ts" for i in range(40))
        _write_scout(tmp_plan, bl_inventory=bl)
        scout = tmp_plan / "artifacts" / "scout-report.md"
        r = estimate("behavior-logic", scout_report=scout, plan_dir=tmp_plan)
        assert r["unit_count"] == 40  # 1 BL per inventory entry
        assert r["est_loc"] == 1000  # 40 * 25
        assert r["shard"] is True

    def test_behavior_logic_small_no_shard(self, tmp_plan):
        bl = "\n".join(f"- mail: app/mail/m{i}.ts" for i in range(5))
        _write_scout(tmp_plan, bl_inventory=bl)
        scout = tmp_plan / "artifacts" / "scout-report.md"
        r = estimate("behavior-logic", scout_report=scout, plan_dir=tmp_plan)
        assert r["unit_count"] == 5
        assert r["shard"] is False

    def test_behavior_logic_skips_none_found_sentinel(self, tmp_plan):
        bl = "- observer: _(none found)_\n- queue-worker: app/jobs/j1.ts"
        _write_scout(tmp_plan, bl_inventory=bl)
        scout = tmp_plan / "artifacts" / "scout-report.md"
        r = estimate("behavior-logic", scout_report=scout, plan_dir=tmp_plan)
        assert r["unit_count"] == 1  # sentinel excluded

    def test_screen_list_from_scout_file_inventory_shards(self, tmp_plan):
        inv = _inv([(f"src/pages/P{i}.tsx", "screen") for i in range(50)]
                   + [("src/routes.ts", "route"), ("src/models/U.ts", "model")])
        _write_scout(tmp_plan, file_inventory=inv)
        scout = tmp_plan / "artifacts" / "scout-report.md"
        r = estimate("screen-list", scout_report=scout, plan_dir=tmp_plan)
        assert r["unit_count"] == 50  # only screen-type counted
        assert r["est_loc"] == 950  # 50 * 19
        assert r["shard"] is True

    def test_screen_flow_shares_screen_signal(self, tmp_plan):
        inv = _inv([(f"src/pages/P{i}.tsx", "screen") for i in range(90)])
        _write_scout(tmp_plan, file_inventory=inv)
        scout = tmp_plan / "artifacts" / "scout-report.md"
        r = estimate("screen-flow", scout_report=scout, plan_dir=tmp_plan)
        assert r["unit_count"] == 90
        assert r["shard"] is True  # 90 * 10 = 900 > 800

    def test_screen_flow_below_threshold(self, tmp_plan):
        inv = _inv([(f"src/pages/P{i}.tsx", "screen") for i in range(10)])
        _write_scout(tmp_plan, file_inventory=inv)
        scout = tmp_plan / "artifacts" / "scout-report.md"
        r = estimate("screen-flow", scout_report=scout, plan_dir=tmp_plan)
        assert r["unit_count"] == 10
        assert r["shard"] is False  # 10 * 10 = 100

    def test_route_list_from_scout_route_files_shards(self, tmp_plan):
        # No route-list.md yet; 40 route files * 12 rows/file = 480 units * lpu 2 = 960 > 800.
        inv = _inv([(f"src/routes/r{i}.ts", "route") for i in range(40)])
        _write_scout(tmp_plan, file_inventory=inv)
        scout = tmp_plan / "artifacts" / "scout-report.md"
        r = estimate("route-list", scout_report=scout, plan_dir=tmp_plan)
        assert r["unit_count"] == 480  # 40 * 12
        assert r["shard"] is True

    def test_route_list_few_files_no_shard(self, tmp_plan):
        inv = _inv([("src/routes/api.ts", "route"), ("src/routes/web.ts", "route")])
        _write_scout(tmp_plan, file_inventory=inv)
        scout = tmp_plan / "artifacts" / "scout-report.md"
        r = estimate("route-list", scout_report=scout, plan_dir=tmp_plan)
        assert r["unit_count"] == 24  # 2 * 12
        assert r["shard"] is False

    def test_data_model_from_scout_typed_inventory(self, tmp_plan):
        inv = _inv([(f"src/models/M{i}.ts", "model") for i in range(45)])
        _write_scout(tmp_plan, file_inventory=inv)
        scout = tmp_plan / "artifacts" / "scout-report.md"
        r = estimate("data-model", scout_report=scout, plan_dir=tmp_plan)
        assert r["unit_count"] == 45
        assert r["shard"] is True  # >= 40 fixed threshold

    def test_user_stories_from_screen_list_when_us_and_fl_absent(self, tmp_plan):
        # W4 reality: user-stories.md + feature-list.md don't exist; screen-list.md does.
        sl = tmp_plan / "artifacts" / "screen-list.md"
        sl.write_text("\n".join(f"## SCR{i:03d}_Screen{i}" for i in range(30)))
        r = estimate("user-stories", plan_dir=tmp_plan)
        assert r["unit_count"] == 45  # ceil(30 * 1.5)
        assert r["est_loc"] == 1485  # 45 * 33
        assert r["shard"] is True

    def test_user_stories_prefers_own_file_on_rerun(self, tmp_plan):
        us = tmp_plan / "artifacts" / "user-stories.md"
        us.write_text("\n".join(f"## US{i:03d}" for i in range(10)))
        sl = tmp_plan / "artifacts" / "screen-list.md"
        sl.write_text("\n".join(f"## SCR{i:03d}_S{i}" for i in range(30)))
        r = estimate("user-stories", plan_dir=tmp_plan)
        assert r["unit_count"] == 10  # own file wins over screen-list fallback


class TestNoSignalDefaultsSingle:
    """No usable signal anywhere → unit_count 0 → no shard (single task), never a false shard."""

    def test_feature_list_no_files(self, tmp_plan):
        r = estimate("feature-list", plan_dir=tmp_plan)
        assert r["unit_count"] == 0
        assert r["shard"] is False

    def test_behavior_logic_empty_scout(self, tmp_plan):
        _write_scout(tmp_plan, bl_inventory="- observer: _(none found)_")
        scout = tmp_plan / "artifacts" / "scout-report.md"
        r = estimate("behavior-logic", scout_report=scout, plan_dir=tmp_plan)
        assert r["unit_count"] == 0
        assert r["shard"] is False


class TestModelHeadingNoOvercount:
    def test_generic_h3_headings_not_counted(self, tmp_plan):
        dm = tmp_plan / "artifacts" / "data-model.md"
        lines = [f"### MODEL{i:03d}_E{i}" for i in range(38)]
        lines += ["### Notes", "### Overview", "### Relationships"]  # generic, must NOT count
        dm.write_text("\n".join(lines))
        r = estimate("data-model", plan_dir=tmp_plan)
        assert r["unit_count"] == 38  # generic headings excluded
        assert r["shard"] is False  # 38 < 40 fixed threshold


class TestHelpers:
    def test_count_inventory_by_type(self, tmp_plan):
        inv = _inv([("a.tsx", "screen"), ("b.ts", "route"), ("c.tsx", "screen")])
        scout = _write_scout(tmp_plan, file_inventory=inv)
        assert _count_inventory_by_type(scout, "screen") == 2
        assert _count_inventory_by_type(scout, "route") == 1
        assert _count_inventory_by_type(scout, "model") == 0

    def test_count_inventory_stops_at_next_section(self, tmp_plan):
        # A `route`-looking token in a later section must not be counted.
        inv = _inv([("a.tsx", "screen")])
        scout = _write_scout(tmp_plan, file_inventory=inv, bl_inventory="- x: y.ts route")
        assert _count_inventory_by_type(scout, "route") == 0

    def test_count_bl_inventory_skips_sentinel(self, tmp_plan):
        bl = "- a: x.ts\n- b: _(none found)_\n- c: z.ts"
        scout = _write_scout(tmp_plan, bl_inventory=bl)
        assert _count_bl_inventory(scout) == 2

    def test_extract_actors_from_permission_rules(self, tmp_plan):
        pm = tmp_plan / "artifacts" / "permissions-matrix.md"
        pm.write_text(
            "# Permissions Matrix\n\n"
            "## PERM001: View Reports\n\n### Permission Rules\n\n"
            "| Role | Allow | Conditions |\n|------|-------|------------|\n"
            "| Admin | ✓ | - |\n| Editor | ✗ | - |\n\n"
            "## PERM002: Edit Users\n\n### Permission Rules\n\n"
            "| Role | Allow | Conditions |\n|------|-------|------------|\n"
            "| Admin | ✓ | - |\n| Viewer | ✗ | - |\n"
        )
        actors = _extract_actors(pm)
        assert actors == ["Admin", "Editor", "Viewer"]  # distinct roles, sorted; no PERM codes

    def test_extract_actors_empty_when_missing(self, tmp_path):
        assert _extract_actors(tmp_path / "nope.md") == []


class TestCli:
    def test_cli_exit_0(self, small_route_list):
        result = subprocess.run(
            [
                sys.executable,
                str(SCRIPTS / "estimate_artifact_loc.py"),
                "--artifact", "api-contracts",
                "--route-list", str(small_route_list),
            ],
            capture_output=True, text=True,
        )
        assert result.returncode == 0
        data = json.loads(result.stdout)
        assert data["shard"] is False

    def test_cli_max_loc_override(self, small_route_list):
        result = subprocess.run(
            [
                sys.executable,
                str(SCRIPTS / "estimate_artifact_loc.py"),
                "--artifact", "api-contracts",
                "--route-list", str(small_route_list),
                "--max-loc", "1",
            ],
            capture_output=True, text=True,
        )
        assert result.returncode == 0
        data = json.loads(result.stdout)
        assert data["shard"] is True
