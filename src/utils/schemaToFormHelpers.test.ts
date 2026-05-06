import { describe, it, expect } from ***REMOVED***vitest***REMOVED***
import type { JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import {
  validateSchema,
  validateAgainstSchema,
  getValueFromSchema,
  getLabelFromSchema,
  schemaToFormObject,
  overridesAndSchemaToFormObject,
  getSchemaPaths,
  getSchemaPathDescriptors,
  mergeObjects
} from ***REMOVED***./schemaToFormHelpers***REMOVED***
import type { IFormFieldOverride, IFormOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

describe(***REMOVED***schemaToFormHelpers***REMOVED***, () => {
  describe(***REMOVED***validateSchema***REMOVED***, () => {
    it(***REMOVED***returns schema for valid schema***REMOVED***, () => {
      const schema: JSONSchema6 = {
        type: ***REMOVED***object***REMOVED***,
        properties: {
          name: { type: ***REMOVED***string***REMOVED*** }
        }
      }
      const result = validateSchema(schema)
      expect(result.schema).toBeDefined()
      expect(result.error).toBeUndefined()
    })

    it(***REMOVED***returns error for invalid schema***REMOVED***, () => {
      const schema = { type: ***REMOVED***invalid-type***REMOVED*** }
      const result = validateSchema(schema)
      expect(result.error).toBeDefined()
    })
  })

  describe(***REMOVED***validateAgainstSchema***REMOVED***, () => {
    const schema: JSONSchema6 = {
      type: ***REMOVED***object***REMOVED***,
      properties: {
        age: { type: ***REMOVED***number***REMOVED***, minimum: 0 }
      },
      required: [***REMOVED***age***REMOVED***]
    }

    it(***REMOVED***returns undefined for valid data***REMOVED***, () => {
      const errors = validateAgainstSchema(schema, { age: 10 })
      expect(errors).toBeUndefined()
    })

    it(***REMOVED***returns errors for invalid data***REMOVED***, () => {
      const errors = validateAgainstSchema(schema, { age: -5 })
      expect(errors).toBeDefined()
      expect(errors?.[0]).toContain(***REMOVED***must be >= 0***REMOVED***)
    })
    it(***REMOVED***returns errors for missing required field***REMOVED***, () => {
      const errors = validateAgainstSchema(schema, {})
      expect(errors).toBeDefined()
      expect(errors?.[0]).toContain(***REMOVED***required***REMOVED***)
    })
    it(***REMOVED***returns errors for invalid schema***REMOVED***, () => {
      // Invalid: "properties" must be an object, not an array
      const invalidSchema: JSONSchema6 = {
        type: ***REMOVED***object***REMOVED***,
        properties: [] as any
      }
      const errors = validateAgainstSchema(invalidSchema, { age: 10 })
      console.log(errors)
      expect(errors).toBeDefined()
      expect(errors?.[0]).toContain(***REMOVED***properties must be object***REMOVED***)
    })
  })

  describe(***REMOVED***getValueFromSchema***REMOVED***, () => {
    it(***REMOVED***returns value for string***REMOVED***, () => {
      expect(getValueFromSchema(***REMOVED***foo***REMOVED***)).toBe(***REMOVED***foo***REMOVED***)
    })
    it(***REMOVED***returns value for number***REMOVED***, () => {
      expect(getValueFromSchema(42)).toBe(42)
    })
    it(***REMOVED***returns value for boolean***REMOVED***, () => {
      expect(getValueFromSchema(true)).toBe(true)
    })
    it(***REMOVED***returns first value from array***REMOVED***, () => {
      expect(getValueFromSchema([***REMOVED***bar***REMOVED***, ***REMOVED***baz***REMOVED***])).toBe(***REMOVED***bar***REMOVED***)
    })
    it(***REMOVED***returns const value***REMOVED***, () => {
      expect(getValueFromSchema({ const: ***REMOVED***baz***REMOVED*** })).toBe(***REMOVED***baz***REMOVED***)
    })
    it(***REMOVED***returns undefined for undefined***REMOVED***, () => {
      expect(getValueFromSchema(undefined)).toBeUndefined()
    })
    it(***REMOVED***returns value from object with title***REMOVED***, () => {
      expect(getValueFromSchema({ title: ***REMOVED***Test***REMOVED*** })).toBe(***REMOVED***Test***REMOVED***)
    })
    it(***REMOVED***returns undefined when no value is provided***REMOVED***, () => {
      expect(getValueFromSchema({ id: ***REMOVED***test***REMOVED*** })).toBeUndefined()
    })
  })

  describe(***REMOVED***getLabelFromSchema***REMOVED***, () => {
    it(***REMOVED***returns string for string***REMOVED***, () => {
      expect(getLabelFromSchema(***REMOVED***foo***REMOVED***)).toBe(***REMOVED***foo***REMOVED***)
    })
    it(***REMOVED***returns string for number***REMOVED***, () => {
      expect(getLabelFromSchema(123)).toBe(***REMOVED***123***REMOVED***)
    })
    it(***REMOVED***returns "true" for boolean true***REMOVED***, () => {
      expect(getLabelFromSchema(true)).toBe(***REMOVED***true***REMOVED***)
    })
    it(***REMOVED***returns label from title***REMOVED***, () => {
      expect(getLabelFromSchema({ title: ***REMOVED***My Title***REMOVED*** })).toBe(***REMOVED***My Title***REMOVED***)
    })
    it(***REMOVED***returns value from const***REMOVED***, () => {
      expect(getLabelFromSchema({ const: ***REMOVED***abc***REMOVED*** })).toBe(***REMOVED***abc***REMOVED***)
    })
    it(***REMOVED***returns id when no title or const***REMOVED***, () => {
      console.log(getLabelFromSchema({ $id: ***REMOVED***test-id***REMOVED*** }))
      expect(getLabelFromSchema({ $id: ***REMOVED***test-id***REMOVED*** })).toBe(***REMOVED***Test id***REMOVED***)
    })
    it(***REMOVED***returns undefined for undefined***REMOVED***, () => {
      expect(getLabelFromSchema(undefined)).toBeUndefined()
    })
  })

  describe(***REMOVED***schemaToFormObject***REMOVED***, () => {
    it(***REMOVED***creates form object from schema***REMOVED***, () => {
      const schema: JSONSchema6 = {
        title: ***REMOVED***Test Form***REMOVED***,
        type: ***REMOVED***object***REMOVED***,
        properties: {
          firstName: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***First Name***REMOVED*** },
          age: { type: ***REMOVED***number***REMOVED*** }
        }
      }
      const form = schemaToFormObject(schema)
      expect(form.label).toBe(***REMOVED***Test Form***REMOVED***)
      expect(form?.fields?.length).toBe(2)
      expect(form?.fields?.[0].label).toBe(***REMOVED***First Name***REMOVED***)
    })
  })

  describe(***REMOVED***overridesAndSchemaToFormObject***REMOVED***, () => {
    it(***REMOVED***applies overrides to form***REMOVED***, () => {
      const schema: JSONSchema6 = {
        title: ***REMOVED***Base***REMOVED***,
        type: ***REMOVED***object***REMOVED***,
        properties: {
          foo: { type: ***REMOVED***string***REMOVED*** }
        }
      }
      const form = overridesAndSchemaToFormObject({
        schema,
        formOverrides: [{ label: ***REMOVED***Overridden***REMOVED***, fields: [{ prop: ***REMOVED***foo***REMOVED*** }] }],
        formFieldOverrides: [[{ prop: ***REMOVED***foo***REMOVED***, label: ***REMOVED***Bar***REMOVED*** }]]
      })
      expect(form.label).toBe(***REMOVED***Overridden***REMOVED***)
      expect(form?.fields?.[0]?.label).toBe(***REMOVED***Bar***REMOVED***)
    })

    it(***REMOVED***preserves defaultValue for override-only fields***REMOVED***, () => {
      // This is the DefaultValue test case: shape_type is not in schema but added via override
      const schema: JSONSchema6 = {
        type: ***REMOVED***object***REMOVED***,
        properties: {
          geojson: { type: ***REMOVED***object***REMOVED***, title: ***REMOVED***Geojson***REMOVED*** }
        }
      }

      // Field override adds shape_type with defaultValue: "point"
      const fieldOverrides: IFormFieldOverride[] = [
        {
          prop: ***REMOVED***shape_type***REMOVED***,
          type: ***REMOVED***select***REMOVED***,
          label: ***REMOVED***Shape***REMOVED***,
          defaultValue: ***REMOVED***point***REMOVED***,
          options: [
            { label: ***REMOVED***Point***REMOVED***, value: ***REMOVED***point***REMOVED*** },
            { label: ***REMOVED***Polygon***REMOVED***, value: ***REMOVED***polygon***REMOVED*** }
          ]
        }
      ]

      // Form override specifies shape_type in fields
      const formOverride: IFormOverride = {
        label: ***REMOVED***GeoJSON Form***REMOVED***,
        fields: [{ prop: ***REMOVED***shape_type***REMOVED*** }]
      }

      const form = overridesAndSchemaToFormObject({
        schema,
        formOverrides: [formOverride],
        formFieldOverrides: [fieldOverrides]
      })

      // shape_type should be in form.fields with all its properties from the override
      const shapeTypeField = form.fields?.find(f => f.id === ***REMOVED***shape_type***REMOVED***)
      expect(shapeTypeField).toBeDefined()
      expect(shapeTypeField?.type).toBe(***REMOVED***select***REMOVED***)
      expect(shapeTypeField?.defaultValue).toBe(***REMOVED***point***REMOVED***)
      expect(shapeTypeField?.excludeFromPayload).toBe(true) // auto-marked for exclusion (schema has properties)
    })

    it(***REMOVED***does not auto-exclude override-only fields when schema has no properties***REMOVED***, () => {
      const schema: JSONSchema6 = { type: ***REMOVED***object***REMOVED*** } // no properties

      const fieldOverrides: IFormFieldOverride[] = [
        { prop: ***REMOVED***name***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Name***REMOVED*** },
        { prop: ***REMOVED***age***REMOVED***, type: ***REMOVED***number***REMOVED***, label: ***REMOVED***Age***REMOVED*** }
      ]

      const formOverride: IFormOverride = {
        label: ***REMOVED***No-Schema Form***REMOVED***,
        fields: [{ prop: ***REMOVED***name***REMOVED*** }, { prop: ***REMOVED***age***REMOVED*** }]
      }

      const form = overridesAndSchemaToFormObject({
        schema,
        formOverrides: [formOverride],
        formFieldOverrides: [fieldOverrides]
      })

      const nameField = form.fields?.find(f => f.id === ***REMOVED***name***REMOVED***)
      const ageField = form.fields?.find(f => f.id === ***REMOVED***age***REMOVED***)
      expect(nameField?.excludeFromPayload).not.toBe(true)
      expect(ageField?.excludeFromPayload).not.toBe(true)
    })
  })

  describe(***REMOVED***getSchemaPaths***REMOVED***, () => {
    it(***REMOVED***returns paths for nested schema***REMOVED***, () => {
      const schema: JSONSchema6 = {
        type: ***REMOVED***object***REMOVED***,
        properties: {
          a: { type: ***REMOVED***string***REMOVED*** },
          b: {
            type: ***REMOVED***object***REMOVED***,
            properties: {
              c: { type: ***REMOVED***number***REMOVED*** }
            }
          }
        }
      }
      const paths = getSchemaPaths(schema)
      expect(paths).toContain(***REMOVED***a***REMOVED***)
      expect(paths).toContain(***REMOVED***b***REMOVED***)
      expect(paths).toContain(***REMOVED***b.c***REMOVED***)
    })

    it(***REMOVED***handles arrays***REMOVED***, () => {
      const schema: JSONSchema6 = {
        type: ***REMOVED***array***REMOVED***,
        items: { type: ***REMOVED***string***REMOVED*** }
      }
      const paths = getSchemaPaths(schema)
      expect(paths).toContain(***REMOVED***[]***REMOVED***)
    })
  })

  describe(***REMOVED***getSchemaPathDescriptors***REMOVED***, () => {
    it(***REMOVED***returns descriptors for nested schema***REMOVED***, () => {
      const schema: JSONSchema6 = {
        type: ***REMOVED***object***REMOVED***,
        properties: {
          x: { type: ***REMOVED***string***REMOVED*** },
          y: {
            type: ***REMOVED***object***REMOVED***,
            properties: {
              z: { type: ***REMOVED***boolean***REMOVED*** }
            }
          }
        },
        required: [***REMOVED***x***REMOVED***]
      }
      const desc = getSchemaPathDescriptors(schema)
      expect(desc.find(d => d.path === ***REMOVED***x***REMOVED***)?.required).toBe(true)
      expect(desc.find(d => d.path === ***REMOVED***y.z***REMOVED***)?.type).toBe(***REMOVED***boolean***REMOVED***)
    })
  })

  describe(***REMOVED***mergeObjects***REMOVED***, () => {
    it(***REMOVED***merges array of objects***REMOVED***, () => {
      const arr = [{ a: 1 }, { b: 2 }, { a: 3 }]
      const merged = mergeObjects(arr)
      expect(merged).toEqual({ a: 3, b: 2 })
    })
  })
})
