export abstract class ValueObject<T extends Record<string, unknown>> {
  constructor(protected readonly props: T) {}
  equals(other: ValueObject<T>): boolean {
    return JSON.stringify(this.props) === JSON.stringify(other.props)
  }
}
