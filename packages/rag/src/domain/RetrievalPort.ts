import type { Result } from '@workspace/shared-kernel'

export type RagSource = 'mempalace' | 'openviking' | 'obsidian' | 'graft' | 'opensrc'
export interface RagQuery { query: string; topK?: number; sources?: RagSource[] }
export interface RagChunk { source: string; content: string; score: number }

/** Hexagonal PORT — every RAG adapter implements this */
export interface RetrievalPort {
  retrieve(query: RagQuery): Promise<Result<RagChunk[]>>
}
