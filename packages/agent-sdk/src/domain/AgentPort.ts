import type { Result } from '@workspace/shared-kernel'

export interface AgentRun    { task: string; model?: string; maxTokens?: number }
export interface AgentResult { output: string; tokensUsed: number }
export interface AgentPort   { run(req: AgentRun): Promise<Result<AgentResult>> }
