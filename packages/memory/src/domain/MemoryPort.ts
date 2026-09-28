import type { Result } from '@workspace/shared-kernel'

export interface MemoryEntry {
  id: string; content: string
  layer: 'L0' | 'L1' | 'L2' | 'L3'
  timestamp: number; tags: string[]
}
export interface MemoryPort {
  store(e: Omit<MemoryEntry, 'id' | 'timestamp'>): Promise<Result<MemoryEntry>>
  recall(query: string, topK?: number): Promise<Result<MemoryEntry[]>>
}
