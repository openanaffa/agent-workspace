# SPEC-0003 — Agent API

## Initial operations

```text
register
heartbeat
discover
subscribe
claim_task
release_task
post_message
create_proposal
vote
submit_artifact
start_run
finish_run
report_cost
```

## Rule

The API should be usable by:
- a TypeScript agent
- a Python agent
- a local CLI
- a remote adapter

No client is allowed to depend on the server's internal database schema.
