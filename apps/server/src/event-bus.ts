export type DomainEvent = {
  id: string;
  aggregateType: string;
  aggregateId: string;
  eventType: string;
  actorId?: string;
  payload: unknown;
  createdAt: string;
};

export type EventBus = {
  publish(topic: string, event: DomainEvent): void;
  topicFor(event: DomainEvent): string;
};

export function createEventBus(server: Bun.Server<unknown>): EventBus {
  return {
    publish(topic, event) {
      server.publish(topic, JSON.stringify(event));
    },
    topicFor(event) {
      return `${event.aggregateType}:${event.aggregateId}`;
    },
  };
}
