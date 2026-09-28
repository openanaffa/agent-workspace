import type { CompressionPort, CompressionInput, CompressionOutput } from '../domain/CompressionPort'
import type { Result } from '@workspace/shared-kernel'
import { ok, err } from '@workspace/shared-kernel'

export class HeadroomAdapter implements CompressionPort {
  async compress(input: CompressionInput): Promise<Result<CompressionOutput>> {
    try {
      const proc = Bun.spawn(['headroom', 'compress', '--stdin'], {
        stdin: 'pipe', stdout: 'pipe', stderr: 'pipe',
      })
      proc.stdin.write(input.content)
      proc.stdin.end()
      const compressed = await new Response(proc.stdout).text()
      return ok({ compressed, ratio: compressed.length / input.content.length })
    } catch (e) {
      return err(e instanceof Error ? e : new Error(String(e)))
    }
  }
}
