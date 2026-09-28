# Agent Workspace Context

## What this is
Experimental multi-agent system testing ACP + A2A + MCP together.
Runtime: **Bun 1.4** (TypeScript) + **uv** (Python tools).
## Stack
- Orchestrator: Hermes Agent → spawns Claude Code / Opencode / Codex / crush
- TS: Bun workspaces · Vercel AI SDK · eve
- Python: uv workspace
- Tool mgmt: mise

## Architecture — Hexagonal DDD
Each package: domain/ (pure) → application/ (use cases) → infrastructure/ (adapters).
RULE: domain imports nothing from application or infrastructure.
RULE: application imports domain only. infrastructure imports both.
RULE: No logic in infrastructure — delegate to application use cases.

## RAG retrieval priority
1. MemPalace L0/L1   (~170 tokens, always loaded)
2. OpenViking         (tiered: skills + resources)
3. ObsidianMCP        (on-demand note pull)
4. graft/             (codebase map, read-only, never modify)
5. opensrc            (dep source, on-demand grep)
All payloads → Headroom → compressed → model.

## Git / parallel agents
- Orchestrator uses RTK grit for branch isolation per subagent
- `rtk grit branch --agent claude-code` before spawning
- No subagent commits directly to main
- RTK icm persists cross-session memory

## Key commands
hermes                       # start orchestrator
rtk wrap hermes              # token-optimized proxy
headroom wrap                # compression layer
bun run graft                # regenerate codebase map
bun run index-rag            # re-index vault + opensrc

## Agents
| Agent | Port | Protocol | Role |
|-------|------|----------|------|
| Orchestrator | 4000 | A2A server | Routes tasks, persists memory, self-improves |
| Coder Agent | 4001 | A2A server | Code generation, review, Python execution |
| Researcher Agent | 4002 | A2A server | Research, summarization, skill creation |
| ACP Bridge | stdio | ACP server | IDE bridge → Orchestrator |
| MCP Tool Server | stdio | MCP server | fs, uv-python, calculate, skill store |

## Protocol layers
- **ACP** (stdio nd-JSON) — IDE ↔ ACP bridge — JSON-RPC 2.0
- **A2A** (HTTP JSON-RPC) — Orchestrator ↔ Specialists — Agent Cards at `/.well-known/agent-card.json`
- **MCP** (stdio) — Agents ↔ Tools — `bun mcp-servers/tools.ts`

## Self-improvement loop
After each novel task, Researcher Agent writes `skills/<slug>.json`.
These are Hermes-style skill documents with steps + success tracking.

## Key files
- `agents/orchestrator.ts` — Hermes-style brain
- `agents/coder-agent.ts` — A2A specialist (port 4001)
- `agents/researcher-agent.ts` — A2A specialist (port 4002)
- `agents/acp-bridge.ts` — ACP stdio bridge for IDEs
- `mcp-servers/tools.ts` — MCP tool server (Bun)
- `scripts/demo.ts` — Full end-to-end test
- `skills/` — Auto-generated skill documents
- `memory/orchestrator.md` — Session memory

## Quick start
```bash
bun install
# Terminal 1
bun run coder
# Terminal 2
bun run researcher
# Terminal 3
bun run orchestrator
# Terminal 4 — run full demo
bun run demo
```

## IDE integration (ACP)
**Zed** `~/.config/zed/settings.json`:
```json
{ "bindings": { "cmd-alt-o": ["agent::NewExternalAgentThread", { "agent": { "custom": { "name": "agent-lab", "command": { "command": "bun", "args": ["agents/acp-bridge.ts"] } } } }] } }
```

**JetBrains** `acp.json`:
```json
{ "agent-lab": { "command": "bun", "args": ["agents/acp-bridge.ts"] } }
```

## Notes
- A2A task polling: 250ms interval, 5s timeout (use SSE streaming in production)
- MCP run_python: executes via `uv run` — no venv needed, isolated per call
- Memory: append-only markdown — matches Hermes `memory.md` pattern
- Skills: JSON files in `skills/` — loaded by orchestrator on warm paths
