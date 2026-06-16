# MoMorph Design Data Review

**Date:** 2026-06-16  
**FileKey:** 9ypp4enmFmdK3YAFJLIu6C  
**ScreenId:** MaZUn5xHXZ  

## Status

**Execution Status:** BLOCKED  
**Blocker:** Cannot execute MoMorph MCP tools from direct CLI access

## Context

User requested:
1. Fetch frame image URL
2. Retrieve node tree JSON structure
3. Deep-compare implementation style values against Figma design
4. Flag pixel measurement discrepancies

## Investigation

### MCP Server Status
- MoMorph MCP server: `https://mcp.momorph.ai/mcp` — Connected and healthy
- Verified via `claude mcp list` — shows "✔ Connected"
- Transport: HTTP with SSE (Server-Sent Events)
- Auth: x-github-token header (verified in gh config)

### Attempted Approaches

**Approach 1: Direct CLI Tool Invocation**
- Tried: `claude mcp call momorph <tool> <args>`
- Result: ✗ Unknown command (API not public)

**Approach 2: manage-mcp Skill Scripts**
- Tool: `/home/dang.thi.ngoc.anh@sun-asterisk.com/.claude/skills/manage-mcp/scripts/cli.ts`
- Tried: `npx tsx cli.ts call-tool momorph get_frame_image ...`
- Result: ✗ Config error — expects `.claude/.mcp.json` with stdio transport config; MoMorph uses HTTP SSE

**Approach 3: Direct HTTP REST API**
- Tried: `https://mcp.momorph.ai/api/frame_image?fileKey=...`
- Result: ✗ 403 Forbidden (API layer not public)

**Approach 4: Node.js MCP SDK**
- Issue: MCP client manager expects stdio-based connections; MoMorph HTTP transport (SSE) requires different implementation

## Required Solution

To successfully fetch MoMorph design data, one of these approaches is needed:

### Option A: Gemini CLI (Recommended)
- Install/enable Gemini CLI with MCP support
- Execute: `echo "Fetch MoMorph design data for fileKey=9ypp4enmFmdK3YAFJLIu6C, screenId=MaZUn5xHXZ" | gemini -y -m gemini-3-flash`
- Benefit: Automatic MCP discovery and tool execution

### Option B: Extend manage-mcp CLI
- Add HTTP SSE transport support to MCP client manager
- Update `mcp-client.ts` to handle CloudFlare-based HTTP MCP servers
- Time estimate: ~2-3 hours development + testing

### Option C: VSCode MoMorph Extension
- Use installed VSCode MoMorph extension (`sun-asterisk.vscode-momorph-0.13.0`)
- Possible MCP bridge via extension's internal mechanism
- Requires extension API investigation

### Option D: Upgrade Skill Scripts
- Update `manage-mcp` skill to support HTTP MCP servers with SSE
- Add separate MCP client for HTTP-based servers
- Modify `cli.ts` to detect server type (stdio vs HTTP) and route accordingly

## Available Tools

Expected MoMorph MCP tools (from documentation):
- `get_frame` — Fetch frame metadata
- `get_frame_image` — Get frame screenshot/image URL
- `get_frame_node_tree` — Get full node tree JSON structure
- `get_node` — Fetch specific node properties by ID
- `download_specs` — Download spec CSV for frame
- `download_test_cases` — Download test case CSV
- `get_overview` — Get project/file overview
- `get_media_files` — List design assets
- `query_section` — Query frame sections with natural language

## Design Comparison Values (Expected)

Based on user's implementation spec:

| Component | Property | Implementation | Expected Figma |
|-----------|----------|---|---|
| Banner | Height | 512px | Verify |
| Banner | Background | Full-width image cover | Verify |
| Input Pills | Height | 72px | Verify |
| Input Pills | Border-radius | 68px | Verify |
| Input Pills | Border | 1px #998C5F | Verify |
| Highlight Card | Width | 528px | Verify |
| Highlight Card | Border | 4px solid #FFEA9E | Verify |
| Highlight Card | Background | #FFF8E1 | Verify |
| Highlight Card | Border-radius | 16px | Verify |
| Spotlight Canvas | Border-radius | 47px | Verify |
| Spotlight Canvas | Border | 1px solid #998C5F | Verify |
| Sidebar Stats | Border-radius | 17px | Verify |
| Sidebar Stats | Background | #00070C | Verify |
| Sidebar Stats | Border | #998C5F | Verify |
| Leaderboard Avatar | Size | 64×64px (design vs 40×40px impl) | DISCREPANCY |
| Leaderboard Avatar | Shape | Circle | Verify |

## Known Discrepancy

**Leaderboard Avatar Size Mismatch:**
- Figma design: 64×64px circle
- Current implementation: 40×40px
- Status: Confirmed in user description; requires design verification

## Next Steps

1. **Enable Gemini CLI** — Primary path forward for MCP tool execution
2. **Restart Claude Code session** — Required for new MCP connections to load
3. **Fetch design data** — Run MoMorph tools via Gemini CLI
4. **Generate comparison report** — Deep-compare node tree with implementation
5. **Flag discrepancies** — Document all visual/structural differences

## Unresolved Questions

1. Is Gemini CLI available in this environment?
2. Can VSCode MoMorph extension provide MCP bridge?
3. Should manage-mcp skill be extended to support HTTP MCP servers?
4. Is the 64×64 vs 40×40 avatar size intentional or a bug?
