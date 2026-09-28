export type WsClientMessage =
  | { type: "subscribe"; topics: string[] }
  | { type: "unsubscribe"; topics: string[] };

export type AgentRegistration = {
  agentId: string;
  name: string;
  role?: string;
  capabilities?: string[];
};

export type Heartbeat = {
  agentId: string;
  status: "idle" | "busy" | "blocked";
  metadata?: Record<string, unknown>;
};

export type TaskClaim = {
  agentId: string;
  taskId: string;
};
