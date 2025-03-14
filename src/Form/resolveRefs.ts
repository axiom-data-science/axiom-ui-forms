import { type JSONSchema7 } from 'json-schema'

export function resolveRefs<T extends JSONSchema7> (schema: T, root: JSONSchema7 = schema): T {
  if (typeof schema !== 'object' || schema === null) return schema

  if (schema.$ref) {
    const refPath = schema.$ref.replace('#/', '').split('/')
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
