import { describe, it, expect } from 'vitest'
import { resolveRefs } from './resolveRefs'
import type { JSONSchema6 } from 'json-schema'

describe('resolveRefs', () => {
  it('should return schema as is if no $ref present', () => {
    const schema: JSONSchema6 = { type: 'string' }
    expect(resolveRefs(schema)).toEqual(schema)
  })

  it('should resolve a simple $ref', () => {
    const schema: JSONSchema6 = {
      definitions: {
        foo: { type: 'number' }
      },
      $ref: '#/definitions/foo'
    }
    expect(resolveRefs(schema)).toEqual({ type: 'number', definitions: { foo: { type: 'number' } } })
  })

  it('should throw on invalid $ref', () => {
    const schema: JSONSchema6 = {
      $ref: '#/not/exists'
    }
    expect(() => resolveRefs(schema)).toThrow(/Invalid reference/)
  })

  it('should resolve nested $ref', () => {
    const schema: JSONSchema6 = {
      definitions: {
        foo: { $ref: '#/definitions/bar' },
        bar: { type: 'boolean' }
      },
      properties: {
        baz: { $ref: '#/definitions/foo' }
      }
    }
    const result = resolveRefs(schema)
    console.log(JSON.stringify(result, null, 2))
    expect(result).toEqual({
      properties: {
        baz: { type: 'boolean' }
      },
      definitions: {
        foo: { type: 'boolean' },
        bar: { type: 'boolean' }
      }
    })
  })

  it('should resolve $ref embedded in anyOf without erroring', () => {
    const schema: JSONSchema6 & { '$defs': Record<string, JSONSchema6> } = {
      $defs: {
        OceanModelEnum: {
          enum: [
            'CIOFSOP',
            'CIOFSFRESH',
            'NWGOA',
            'CIOFS',
            'ONTHEFLY',
            'TXLA'
          ],
          title: 'OceanModelEnum',
          type: 'string'
        }
      },
      additionalProperties: false,
      properties: {
        ocean_model: {
          anyOf: [
            {
              $ref: '#/$defs/OceanModelEnum'
            },
            {
              type: 'null'
            }
          ],
          default: 'CIOFSOP',
          description: 'Name of ocean model to use for driving drifter simulation.'
        }
      },
      title: 'OpenOilModelConfig',
      type: 'object'
    }
    expect(() => resolveRefs(schema)).not.toThrow()
  })

  it('should resolve $ref inside properties', () => {
    const schema: JSONSchema6 = {
      definitions: {
        foo: { type: 'string' }
      },
      type: 'object',
      properties: {
        bar: { $ref: '#/definitions/foo' }
      }
    }
    expect(resolveRefs(schema)).toEqual({
      definitions: {
        foo: { type: 'string' }
      },
      type: 'object',
      properties: {
        bar: { type: 'string' }
      }
    })
  })

  it('should resolve $ref in array items', () => {
    const schema: JSONSchema6 = {
      definitions: {
        foo: { type: 'integer' }
      },
      type: 'array',
      items: { $ref: '#/definitions/foo' }
    }
    expect(resolveRefs(schema)).toEqual({
      definitions: {
        foo: { type: 'integer' }
      },
      type: 'array',
      items: { type: 'integer' }
    })
  })

  it('should merge properties from $ref and referencing schema', () => {
    const schema: JSONSchema6 = {
      definitions: {
        foo: { type: 'string', minLength: 2 }
      },
      $ref: '#/definitions/foo',
      maxLength: 5
    }
    expect(resolveRefs(schema)).toEqual({
      type: 'string',
      minLength: 2,
      maxLength: 5,
      definitions: {
        foo: { type: 'string', minLength: 2 }
      }
    })
  })

  it('should resolve a schema with a top level $ref', () => {
    const schema: JSONSchema6 = {
      definitions: {
        foo: { type: 'number', minimum: 0 }
      },
      $ref: '#/definitions/foo'
    }
    expect(resolveRefs(schema)).toEqual({
      type: 'number',
      minimum: 0,
      definitions: {
        foo: { type: 'number', minimum: 0 }
      }
    })
  })

  it('should handle array of schemas', () => {
    const schema: JSONSchema6[] = [
      { type: 'string' },
      { $ref: '#/definitions/foo', definitions: { foo: { type: 'boolean' } } }
    ]
    const result = resolveRefs(schema as any)
    console.log(JSON.stringify(result, null, 2))
    expect(result).toEqual([
      { type: 'string' },
      { type: 'boolean', definitions: { foo: { type: 'boolean' } } }
    ])
  })
})
