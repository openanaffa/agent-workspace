import { randomUUID } from "node:crypto";
import type { Database } from "bun:sqlite";
import { loadConfig } from "./config";
import { migrate, openDatabase } from "./db";
import { createEventBus, type DomainEvent } from "./event-bus";

const config = loadConfig();
const db = openDatabase(config.databasePath);
migrate(db);

type CreateProject = {
  name?: string;
  description?: string;
};

let server: Bun.Server<unknown>;

function now(): string {
  return new Date().toISOString();
}

function emit(
  database: Database,
  eventBus: ReturnType<typeof createEventBus>,
  input: Omit<DomainEvent, "id" | "createdAt">,
): DomainEvent {
  const event: DomainEvent = {
    ...input,
    id: randomUUID(),
    createdAt: now(),
  };

  database
    .query(`
      INSERT INTO events (
        id, aggregate_type, aggregate_id, event_type, actor_id, payload_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      event.id,
      event.aggregateType,
      event.aggregateId,
      event.eventType,
      event.actorId ?? null,
      JSON.stringify(event.payload),
      event.createdAt,
    );

  eventBus.publish(eventBus.topicFor(event), event);
  return event;
}

server = Bun.serve({
  hostname: config.host,
  port: config.port,

  async fetch(request, serverInstance) {
    const url = new URL(request.url);

    if (url.pathname === "/ws") {
      const upgraded = serverInstance.upgrade(request);
      return upgraded ? undefined : new Response("WebSocket upgrade failed", { status: 400 });
    }

    if (request.method === "GET" && url.pathname === "/health") {
      return Response.json({ ok: true });
    }

    if (request.method === "GET" && url.pathname === "/api/projects") {
      const projects = db.query(`
        SELECT id, name, description, status, created_at, updated_at
        FROM projects
        ORDER BY created_at DESC
      `).all();
      return Response.json(projects);
    }

    if (request.method === "POST" && url.pathname === "/api/projects") {
      const body = (await request.json()) as CreateProject;

      if (!body.name?.trim()) {
        return Response.json({ error: "name is required" }, { status: 400 });
      }

      const timestamp = now();
      const id = randomUUID();

      db.query(`
        INSERT INTO projects (id, name, description, status, created_at, updated_at)
        VALUES (?, ?, ?, 'active', ?, ?)
      `).run(
        id,
        body.name.trim(),
        body.description ?? "",
        timestamp,
        timestamp,
      );

      const eventBus = createEventBus(server);
      const event = emit(db, eventBus, {
        aggregateType: "project",
        aggregateId: id,
        eventType: "project.created",
        payload: {
          id,
          name: body.name.trim(),
          description: body.description ?? "",
        },
      });

      return Response.json({ id, event }, { status: 201 });
    }

    return new Response("Not Found", { status: 404 });
  },

  websocket: {
    open(ws) {
      ws.subscribe("global");
      ws.send(JSON.stringify({
        type: "connected",
        timestamp: now(),
      }));
    },

    message(ws, rawMessage) {
      try {
        const message = JSON.parse(String(rawMessage)) as {
          type?: string;
          topics?: string[];
        };

        if (message.type === "subscribe") {
          for (const topic of message.topics ?? []) {
            ws.subscribe(topic);
          }
          ws.send(JSON.stringify({
            type: "subscribed",
            topics: message.topics ?? [],
          }));
        }

        if (message.type === "unsubscribe") {
          for (const topic of message.topics ?? []) {
            ws.unsubscribe(topic);
          }
        }
      } catch {
        ws.send(JSON.stringify({ type: "error", error: "invalid_json" }));
      }
    },

    close(ws) {
      ws.unsubscribe("global");
    },
  },
});

console.log(`Agent PM listening on http://${config.host}:${config.port}`);

process.on("SIGINT", () => {
  server.stop();
  db.close();
  process.exit(0);
});
