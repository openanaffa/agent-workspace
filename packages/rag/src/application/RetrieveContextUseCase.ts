import type { RetrievalPort, RagQuery, RagChunk, RagSource } from '../domain/RetrievalPort'
import { ok, err } from '@workspace/shared-kernel'

const PRIORITY: RagSource[] = ['mempalace', 'openviking', 'obsidian', 'graft', 'opensrc']

export class RetrieveContextUseCase {
  constructor(private readonly adapters: Map<RagSource, RetrievalPort>) {}

  async execute(query: RagQuery) {
    const sources = query.sources ?? PRIORITY
    const chunks: RagChunk[] = []
    for (const source of sources) {
      const adapter = this.adapters.get(source)
      if (!adapter) continue
      const result = await adapter.retrieve(query)
      if (result._tag === 'Ok') chunks.push(...result.value)
    }
    return chunks.length > 0
      ? ok(chunks.sort((a, b) => b.score - a.score).slice(0, query.topK ?? 10))
      : err(new Error('No results from any RAG source'))
  }
}
