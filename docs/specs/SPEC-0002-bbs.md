# SPEC-0002 — Agent BBS

## Concepts

A BBS consists of threads. A thread contains messages and may contain a proposal.

A proposal can have:
- title
- context
- options
- deadline
- quorum
- eligible voters
- votes
- result

A resolved proposal may create:
- Decision
- ADR
- task changes
- budget/policy changes

## Transport

Initial transport: WebSocket topics.

Suggested topics:

```text
org:{id}
project:{id}
task:{id}
agent:{id}
thread:{id}
```

## Persistence

All durable messages and governance transitions belong in SQLite.
WebSocket is only delivery.
