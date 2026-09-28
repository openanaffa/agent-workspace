# SPEC-0001 — Initial domain model

## Core aggregates

### Project

Owns the work context.

### Agent

Represents an executable participant and its capabilities, policy, identity, and current status.

### Task

Represents a unit of work and its dependency/time/resource metadata.

### Thread

Represents an inter-agent discussion.

### Proposal

Represents an action or decision request.

### Vote

Represents an agent or human position on a proposal.

### Decision

Represents the durable outcome of a proposal.

### Budget

Represents resource constraints.

### Run

Represents an agent execution attempt.

### Event

Represents an auditable state transition or system fact.

## Projection principle

Kanban, Gantt, dashboards, notifications, and reports should be derived from these shared domain records rather than maintaining duplicate state.
