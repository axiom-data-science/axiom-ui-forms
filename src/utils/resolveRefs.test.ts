import { describe, it, expect } from ***REMOVED***vitest***REMOVED***
import { resolveRefs } from ***REMOVED***./resolveRefs***REMOVED***
import type { JSONSchema6 } from ***REMOVED***json-schema***REMOVED***

describe(***REMOVED***resolveRefs***REMOVED***, () => {
  it(***REMOVED***should return schema as is if no $ref present***REMOVED***, () => {
    const schema: JSONSchema6 = { type: ***REMOVED***string***REMOVED*** }
    expect(resolveRefs(schema)).toEqual(schema)
  })

  it(***REMOVED***should resolve a simple $ref***REMOVED***, () => {
    const schema: JSONSchema6 = {
      definitions: {
        foo: { type: ***REMOVED***number***REMOVED*** }
      },
      $ref: ***REMOVED***#/definitions/foo***REMOVED***
    }
    expect(resolveRefs(schema)).toEqual({ type: ***REMOVED***number***REMOVED***, definitions: { foo: { type: ***REMOVED***number***REMOVED*** } } })
  })

  it(***REMOVED***should throw on invalid $ref***REMOVED***, () => {
    const schema: JSONSchema6 = {
      $ref: ***REMOVED***#/not/exists***REMOVED***
    }
    expect(() => resolveRefs(schema)).toThrow(/Invalid reference/)
  })

  it(***REMOVED***should resolve nested $ref***REMOVED***, () => {
    const schema: JSONSchema6 = {
      definitions: {
        foo: { $ref: ***REMOVED***#/definitions/bar***REMOVED*** },
        bar: { type: ***REMOVED***boolean***REMOVED*** }
      },
      properties: {
        baz: { $ref: ***REMOVED***#/definitions/foo***REMOVED*** }
      }
    }
    const result = resolveRefs(schema)
    console.log(JSON.stringify(result, null, 2))
    expect(result).toEqual({
      properties: {
        baz: { type: ***REMOVED***boolean***REMOVED*** }
      },
      definitions: {
        foo: { type: ***REMOVED***boolean***REMOVED*** },
        bar: { type: ***REMOVED***boolean***REMOVED*** }
      }
    })
  })

  it(***REMOVED***should resolve $ref inside properties***REMOVED***, () => {
    const schema: JSONSchema6 = {
      definitions: {
        foo: { type: ***REMOVED***string***REMOVED*** }
      },
      type: ***REMOVED***object***REMOVED***,
      properties: {
        bar: { $ref: ***REMOVED***#/definitions/foo***REMOVED*** }
      }
    }
    expect(resolveRefs(schema)).toEqual({
      definitions: {
        foo: { type: ***REMOVED***string***REMOVED*** }
      },
      type: ***REMOVED***object***REMOVED***,
      properties: {
        bar: { type: ***REMOVED***string***REMOVED*** }
      }
    })
  })

  it(***REMOVED***should resolve $ref in array items***REMOVED***, () => {
    const schema: JSONSchema6 = {
      definitions: {
        foo: { type: ***REMOVED***integer***REMOVED*** }
      },
      type: ***REMOVED***array***REMOVED***,
      items: { $ref: ***REMOVED***#/definitions/foo***REMOVED*** }
    }
    expect(resolveRefs(schema)).toEqual({
      definitions: {
        foo: { type: ***REMOVED***integer***REMOVED*** }
      },
      type: ***REMOVED***array***REMOVED***,
      items: { type: ***REMOVED***integer***REMOVED*** }
    })
  })

  it(***REMOVED***should merge properties from $ref and referencing schema***REMOVED***, () => {
    const schema: JSONSchema6 = {
      definitions: {
        foo: { type: ***REMOVED***string***REMOVED***, minLength: 2 }
      },
      $ref: ***REMOVED***#/definitions/foo***REMOVED***,
      maxLength: 5
    }
    expect(resolveRefs(schema)).toEqual({
      type: ***REMOVED***string***REMOVED***,
      minLength: 2,
      maxLength: 5,
      definitions: {
        foo: { type: ***REMOVED***string***REMOVED***, minLength: 2 }
      }
    })
  })

  it(***REMOVED***should handle array of schemas***REMOVED***, () => {
    const schema: JSONSchema6[] = [
      { type: ***REMOVED***string***REMOVED*** },
      { $ref: ***REMOVED***#/definitions/foo***REMOVED***, definitions: { foo: { type: ***REMOVED***boolean***REMOVED*** } } }
    ]
    const result = resolveRefs(schema as any)
    console.log(JSON.stringify(result, null, 2))
    expect(result).toEqual([
      { type: ***REMOVED***string***REMOVED*** },
      { type: ***REMOVED***boolean***REMOVED***, definitions: { foo: { type: ***REMOVED***boolean***REMOVED*** } } }
    ])
  })
})
