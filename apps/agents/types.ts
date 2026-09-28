// ── Shared types across ACP · A2A · MCP layers ──────────────────────────────

export interface AgentCard {
  name: string
  description: string
  url: string
  version: string
  capabilities: {
    streaming: boolean
    pushNotifications: boolean
  }
  skills: AgentSkill[]
}

export interface AgentSkill {
  id: string
  name: string
  description: string
  inputModes: string[]
  outputModes: string[]
}

// A2A task lifecycle states
export type TaskState =
  | "submitted"
  | "working"
  | "input-required"
  | "completed"
  | "failed"
  | "canceled"

export interface A2ATask {
  id: string
  contextId: string
  status: { state: TaskState; timestamp: string }
  history: A2AMessage[]
  artifacts?: A2AArtifact[]
}

export interface A2AMessage {
  messageId: string
  role: "user" | "agent"
  kind: "message"
  parts: A2APart[]
  contextId: string
  taskId?: string
}

export type A2APart =
  | { kind: "text"; text: string }
  | { kind: "data"; data: Record<string, unknown>; mimeType?: string }

export interface A2AArtifact {
  artifactId: string
  name?: string
  parts: A2APart[]
}

// ACP (Agent Client Protocol) JSON-RPC shapes
export interface ACPRequest {
  jsonrpc: "2.0"
  id: number | string
  method: string
  params?: unknown
}

export interface ACPResponse {
  jsonrpc: "2.0"
  id: number | string
  result?: unknown
  error?: { code: number; message: string; data?: unknown }
}

// Hermes-style skill document (self-improvement loop)
export interface SkillDocument {
  name: string
  description: string
  tags: string[]
  steps: string[]
  createdAt: string
  usageCount: number
  successRate: number
}

// MCP tool call
export interface MCPToolCall {
  name: string
  arguments: Record<string, unknown>
}

export interface MCPToolResult {
  content: Array<{ type: "text"; text: string }>
  isError?: boolean
}
