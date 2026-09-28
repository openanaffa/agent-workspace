export abstract class Entity<Id extends string | number> {
  constructor(readonly id: Id) {}
  equals(other: Entity<Id>): boolean { return this.id === other.id }
}
