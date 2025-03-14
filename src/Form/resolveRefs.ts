import { type JSONSchema7 } from ***REMOVED***json-schema***REMOVED***

export function resolveRefs<T extends JSONSchema7> (schema: T, root: JSONSchema7 = schema): T {
  if (typeof schema !== ***REMOVED***object***REMOVED*** || schema === null) return schema

  if (schema.$ref) {
    const refPath = schema.$ref.replace(***REMOVED***#/***REMOVED***, ***REMOVED******REMOVED***).split(***REMOVED***/***REMOVED***)
    let refValue: any = root

    for (const key of refPath) {
      refValue = refValue[key]
      if (!refValue) throw new Error(`Invalid reference: ${schema.$ref}`)
    }
    return resolveRefs(refValue, root) as T // Recursively resolve
  }

  if (Array.isArray(schema)) {
    return schema.map((item) => resolveRefs(item, root)) as unknown as T
  }

  return Object.fromEntries(
    Object.entries(schema).map(([key, value]) => [key, resolveRefs(value, root)])
  ) as T
}
