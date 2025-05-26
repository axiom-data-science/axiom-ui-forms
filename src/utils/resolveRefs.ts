import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***

/**
 * Recursively resolves JSON Schema $ref references. Does not support external references.
 * @param schema The schema to resolve.
 * @param root The root schema for references. Defaults to schema itself
 * TO DO: support external references
 * @returns The schema with all $ref references resolved.
 */
export function resolveRefs<T extends JSONSchema6> (schema: T, root: JSONSchema6 = schema): T {
  if (typeof schema !== ***REMOVED***object***REMOVED*** || schema === null) return schema

  if (Array.isArray(schema)) {
    // if top level root is array, don***REMOVED***t pass it
    // but hold on to root if we***REMOVED***re looking at an embedded array (anyOf: [], allOf: [], oneOf: [])
    return schema.map((item) => resolveRefs(item, Array.isArray(root) ? undefined : root)) as unknown as T
  }

  if (schema.$ref) {
    const refPath = schema.$ref.replace(***REMOVED***#/***REMOVED***, ***REMOVED******REMOVED***).split(***REMOVED***/***REMOVED***)
    let refValue: any = root

    for (const key of refPath) {
      refValue = refValue[key]
      if (!refValue) throw new Error(`Invalid reference: ${schema.$ref}`)
    }

    // Merge the original schema with the resolved reference
    const mergedSchema = { ...refValue, ...schema }

    // allow a $ref to be followed multiple steps
    mergedSchema.$ref = refValue.$ref ?? undefined

    // console.log(mergedSchema)

    // Recursively resolve all properties of the merged schema
    console.log(***REMOVED***Merged schema ref:***REMOVED***, mergedSchema.$ref)
    console.log(***REMOVED***Root***REMOVED***, root)
    console.log(***REMOVED***----***REMOVED***)
    return resolveRefs(mergedSchema, root) as T
  }

  // Recursively resolve all properties
  return Object.fromEntries(
    Object.entries(schema).map(([key, value]) => {
      return [key, resolveRefs(value, root)]
    })
  ) as T
}
