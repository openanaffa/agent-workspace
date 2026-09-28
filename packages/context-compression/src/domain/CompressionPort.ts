import type { Result } from '@workspace/shared-kernel'

export interface CompressionInput  { content: string; hint?: string }
export interface CompressionOutput { compressed: string; ratio: number }
export interface CompressionPort {
  compress(input: CompressionInput): Promise<Result<CompressionOutput>>
}
