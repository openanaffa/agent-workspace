import type { MemoryPort } from '../domain/MemoryPort'

export class RecallUseCase {
  constructor(
    private readonly mempalace: MemoryPort,
    private readonly icm: MemoryPort,
  ) {}

  async execute(query: string, topK = 5) {
    const [fast, persistent] = await Promise.all([
      this.mempalace.recall(query, topK),
      this.icm.recall(query, topK),
    ])
    return [
      ...(fast._tag === 'Ok' ? fast.value : []),
      ...(persistent._tag === 'Ok' ? persistent.value : []),
    ].sort((a, b) => b.timestamp - a.timestamp).slice(0, topK)
  }
}
