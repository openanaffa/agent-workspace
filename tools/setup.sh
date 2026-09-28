#!/usr/bin/env bash
set -euo pipefail

echo "→ mise tools..."    && mise install
echo "→ bun deps..."      && bun install
echo "→ uv workspace..."  && uv sync --all-packages
echo "→ global tools..."  && bun add -g graft headroom opensrc
echo "→ RTK..."           && curl -fsSL https://rtk.ai/install.sh | sh
echo "→ Hermes..."        && curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
echo "→ MCP symlink..."   && ln -sf "$(pwd)/tools/hermes-mcps.yaml" ~/.hermes/mcps.yaml
echo "→ Codebase map..."  && bun run graft
echo "→ RAG index..."     && bun run index-rag
echo ""
echo "✓ Done. Run:  rtk wrap hermes"
