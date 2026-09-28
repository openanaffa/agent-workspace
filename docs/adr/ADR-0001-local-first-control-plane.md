# ADR-0001 — Local-first control plane

- Status: accepted
- Date: 2026-09-11

## Context

The project must be usable by a single developer on a low-resource machine while remaining extensible for larger deployments.

## Decision

Use Bun + SQLite + WebSocket as the initial control plane.

SQLite is the source of truth. WebSocket is a realtime transport, not a second data store.

External systems such as Postgres, Redis, NATS, Kafka, and object storage may be introduced later through explicit architectural decisions.

## Consequences

Positive:
- minimal local dependencies
- fast startup
- simple development environment
- easy backup and inspection
- realtime without a mandatory message broker

Negative:
- horizontal scaling is intentionally limited at first
- migration and event replay capabilities must be designed before multi-node operation
