# Agent PM

Agent Project Operating System backbone.

The project is intentionally small and local-first:

- Bun 1.4.0 for the control plane
- `bun:sqlite` for persistence
- WebSocket pub/sub for realtime events
- uv + Python for the agent SDK/workers
- Markdown + Git for project knowledge
- mise for the development toolchain
- Docker as an optional packaging/deployment layer

## Workspace

```text
apps/
  server/          Bun control plane
  web/             future UI

packages/
  domain/          domain types and invariants
  db/              SQLite access
  events/          event contracts + bus
  protocol/        HTTP/WS agent protocol contracts
  sdk/             TypeScript client
  ui/               future shared UI primitives
  test-utils/      shared test setup

python/
  sdk/             Python agent client
  agents/          future reference workers

docs/
  adr/
  prd/
  specs/
  rfcs/

migrations/
scripts/
```

## Start

```bash
mise install
mise run db
mise run dev
```

The server listens on `http://127.0.0.1:3000` by default.

Health:

```bash
curl http://127.0.0.1:3000/health
```

## Design rule

The database is the source of truth.

HTTP commands mutate state.
Successful mutations emit domain events.
Events are persisted and published over WebSocket.
UI and agents consume projections of the same state.

Do not add Redis, Postgres, Kafka, a workflow DSL, or an LLM runtime until a concrete requirement forces it.
