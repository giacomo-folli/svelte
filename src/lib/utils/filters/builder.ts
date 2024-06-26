import type { JoinModifier } from "./modifiers/join"
import type { WhereModifier, WhereFilterValue } from "./modifiers/where"

export type Modifier = WhereModifier | JoinModifier

export type JsonQuery = {
  modifiers: Modifier[]
}

export default class Builder {
  private modifiers: Modifier[] = []

  constructor() {
    this.modifiers = []
  }

  public where(callback: (builder: Builder) => void): Builder
  public where(key: Record<string, WhereFilterValue>): Builder
  public where(key: string, value: WhereFilterValue): Builder
  public where(key: string, operator: string, value: WhereFilterValue | boolean): Builder
  public where(
    first: string | Record<string, WhereFilterValue> | ((builder: Builder) => void),
    second?: WhereFilterValue,
    third?: WhereFilterValue | boolean
  ): Builder {
    return this.applyWhereClause('and', first, second, third)
  }

  public whereNot(callback: (builder: Builder) => void): Builder
  public whereNot(key: Record<string, WhereFilterValue>): Builder
  public whereNot(key: string, value: WhereFilterValue): Builder
  public whereNot(key: string, operator: string, value: WhereFilterValue): Builder
  public whereNot(
    first: string | Record<string, WhereFilterValue> | ((builder: Builder) => void),
    second?: WhereFilterValue,
    third?: WhereFilterValue
  ): Builder {
    return this.applyWhereClause('andNot', first, second, third)
  }

  public orWhere(callback: (builder: Builder) => void): Builder
  public orWhere(key: Record<string, WhereFilterValue>): Builder
  public orWhere(key: string, value: WhereFilterValue): Builder
  public orWhere(key: string, operator: string, value: WhereFilterValue): Builder
  public orWhere(
    first: string | Record<string, WhereFilterValue> | ((builder: Builder) => void),
    second?: WhereFilterValue,
    third?: WhereFilterValue
  ): Builder {
    return this.applyWhereClause('or', first, second, third)
  }

  public orWhereNot(callback: (builder: Builder) => void): Builder
  public orWhereNot(key: Record<string, WhereFilterValue>): Builder
  public orWhereNot(key: string, value: WhereFilterValue): Builder
  public orWhereNot(key: string, operator: string, value: WhereFilterValue): Builder
  public orWhereNot(
    first: string | Record<string, WhereFilterValue> | ((builder: Builder) => void),
    second?: WhereFilterValue,
    third?: WhereFilterValue
  ): Builder {
    return this.applyWhereClause('orNot', first, second, third)
  }

  public whereColumn(key: string, compareColumn: string): Builder
  public whereColumn(key: string, operator: string, compareColumn: string): Builder
  public whereColumn(
    first: string,
    second: string,
    third?: string
  ): Builder {
    return this.applyWhereColumnClause('and', first, second, third)
  }

  public orWhereColumn(key: string, compareColumn: string): Builder
  public orWhereColumn(key: string, operator: string, compareColumn: string): Builder
  public orWhereColumn(
    first: string,
    second: string,
    third?: string
  ): Builder {
    return this.applyWhereColumnClause('or', first, second, third)
  }

  private applyWhereClause(
    logicalOperator: 'and' | 'or' | 'andNot' | 'orNot',
    first: string | Record<string, WhereFilterValue> | ((builder: Builder) => void),
    second?: WhereFilterValue,
    third?: WhereFilterValue | boolean,
  ): Builder {

    if (third !== undefined) {
      if (!!second && typeof first == 'string' && typeof second == 'string') {
        this.modifiers.push({
          method: 'where',
          kind: 'simple',
          key: first,
          operator: second,
          value: third,
          logicalOperator: logicalOperator
        })
      } else if (typeof first == 'object') {
        this.modifiers.push({
          method: 'where',
          kind: 'object',
          values: first,
          logicalOperator
        })
      }
    } else if (typeof first == 'string' && !!second) {
      this.modifiers.push({
        method: 'where',
        kind: 'simple',
        key: first,
        value: second,
        logicalOperator
      })
    } else if (typeof first == 'function') {
      let builder = new Builder()
      first(builder)
      if (!builder.modifiers.every(el => el.method == 'where')) throw new Error('inconsistent json query from where callback')

      this.modifiers.push({
        method: 'where',
        kind: 'grouped',
        logicalOperator,
        children: builder.modifiers.filter((el) => el.method == 'where') as WhereModifier[]
      })
    }
    return this
  }

  private applyWhereColumnClause(
    logicalOperator: 'and' | 'or',
    first: string,
    second: string,
    third?: string,
  ): Builder {

    if (third !== undefined) {
      this.modifiers.push({
        method: 'where',
        kind: 'column',
        key: first,
        operator: second,
        column: third,
        logicalOperator: logicalOperator
      })
    } else {
      this.modifiers.push({
        method: 'where',
        kind: 'column',
        key: first,
        column: second,
        logicalOperator: logicalOperator
      })
    }
    return this
  }

  public join(table: string, onCallback: (onBuilder: OnClauseBuilder) => void) {
    let onBuilder = new OnClauseBuilder()
    onCallback(onBuilder)

    this.applyJoinClause('inner', table, onBuilder.json)
    return this
  }

  public leftJoin(table: string, onCallback: (onBuilder: OnClauseBuilder) => void) {
    let onBuilder = new OnClauseBuilder()
    onCallback(onBuilder)

    this.applyJoinClause('left', table, onBuilder.json)
    return this
  }

  public rightJoin(table: string, onCallback: (onBuilder: OnClauseBuilder) => void) {
    let onBuilder = new OnClauseBuilder()
    onCallback(onBuilder)

    this.applyJoinClause('right', table, onBuilder.json)
    return this
  }

  private applyJoinClause(kind: 'right' | 'left' | 'inner', table: string, on: JoinModifierOnClause[]) {
    this.modifiers.push({
      method: 'join',
      kind: kind,
      on: on,
      table: table
    })
    return this
  }

  public toJson(): JsonQuery {
    return {
      modifiers: this.modifiers
    }
  }
}


import type { JoinModifierOnClause } from "./modifiers/join"

class OnClauseBuilder {
  private onClauses: JoinModifierOnClause[]

  constructor() {
    this.onClauses = []
  }

  get json(): JoinModifierOnClause[] {
    return this.onClauses
  }

  public on(from: string, to: string): void
  public on(from: string, operator: string, to: string): void
  public on(first: string, second: string, third?: string): void {
    if (!third) {
      this.onClauses.push({
        from: first,
        operator: '=',
        to: second
      })
    } else {
      this.onClauses.push({
        from: first,
        operator: second,
        to: third
      })
    }
  }

  public orOn(from: string, to: string): void
  public orOn(from: string, operator: string, to: string): void
  public orOn(first: string, second: string, third?: string): void {
    if (!third) {
      this.onClauses.push({
        from: first,
        operator: '=',
        to: second,
        logicalOperator: 'or'
      })
    } else {
      this.onClauses.push({
        from: first,
        operator: second,
        to: third,
        logicalOperator: 'or'
      })
    }
  }
}