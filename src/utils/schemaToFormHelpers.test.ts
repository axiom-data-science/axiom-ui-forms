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
  mergeObjects,
} from ***REMOVED***./schemaToFormHelpers***REMOVED***
import type { IFormFieldOverride, IFormOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

describe(***REMOVED***schemaToFormHelpers***REMOVED***, () => {
  describe(***REMOVED***validateSchema***REMOVED***, () => {
    it(***REMOVED***returns schema for valid schema***REMOVED***, () => {
      const schema: JSONSchema6 = {
        type: ***REMOVED***object***REMOVED***,
        properties: {
          name: { type: ***REMOVED***string***REMOVED*** },
        },
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
        age: { type: ***REMOVED***number***REMOVED***, minimum: 0 },
      },
      required: [***REMOVED***age***REMOVED***],
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
        properties: [] as any,
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
          age: { type: ***REMOVED***number***REMOVED*** },
        },
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
          foo: { type: ***REMOVED***string***REMOVED*** },
        },
      }
      const form = overridesAndSchemaToFormObject({
        schema,
        formOverrides: [{ label: ***REMOVED***Overridden***REMOVED***, fields: [{ prop: ***REMOVED***foo***REMOVED*** }] }],
        formFieldOverrides: [[{ prop: ***REMOVED***foo***REMOVED***, label: ***REMOVED***Bar***REMOVED*** }]],
      })
      expect(form.label).toBe(***REMOVED***Overridden***REMOVED***)
      expect(form?.fields?.[0]?.label).toBe(***REMOVED***Bar***REMOVED***)
    })

    it(***REMOVED***preserves defaultValue for override-only fields***REMOVED***, () => {
      // This is the DefaultValue test case: shape_type is not in schema but added via override
      const schema: JSONSchema6 = {
        type: ***REMOVED***object***REMOVED***,
        properties: {
          geojson: { type: ***REMOVED***object***REMOVED***, title: ***REMOVED***Geojson***REMOVED*** },
        },
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
            { label: ***REMOVED***Polygon***REMOVED***, value: ***REMOVED***polygon***REMOVED*** },
          ],
        },
      ]

      // Form override specifies shape_type in fields
      const formOverride: IFormOverride = {
        label: ***REMOVED***GeoJSON Form***REMOVED***,
        fields: [{ prop: ***REMOVED***shape_type***REMOVED*** }],
      }

      const form = overridesAndSchemaToFormObject({
        schema,
        formOverrides: [formOverride],
        formFieldOverrides: [fieldOverrides],
      })

      // shape_type should be in form.fields with all its properties from the override
      const shapeTypeField = form.fields?.find((f) => f.id === ***REMOVED***shape_type***REMOVED***)
      expect(shapeTypeField).toBeDefined()
      expect(shapeTypeField?.type).toBe(***REMOVED***select***REMOVED***)
      expect(shapeTypeField?.defaultValue).toBe(***REMOVED***point***REMOVED***)
      expect(shapeTypeField?.excludeFromPayload).toBe(true) // auto-marked for exclusion (schema has properties)
    })

    it(***REMOVED***does not auto-exclude override-only fields when schema has no properties***REMOVED***, () => {
      const schema: JSONSchema6 = { type: ***REMOVED***object***REMOVED*** } // no properties

      const fieldOverrides: IFormFieldOverride[] = [
        { prop: ***REMOVED***name***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Name***REMOVED*** },
        { prop: ***REMOVED***age***REMOVED***, type: ***REMOVED***number***REMOVED***, label: ***REMOVED***Age***REMOVED*** },
      ]

      const formOverride: IFormOverride = {
        label: ***REMOVED***No-Schema Form***REMOVED***,
        fields: [{ prop: ***REMOVED***name***REMOVED*** }, { prop: ***REMOVED***age***REMOVED*** }],
      }

      const form = overridesAndSchemaToFormObject({
        schema,
        formOverrides: [formOverride],
        formFieldOverrides: [fieldOverrides],
      })

      const nameField = form.fields?.find((f) => f.id === ***REMOVED***name***REMOVED***)
      const ageField = form.fields?.find((f) => f.id === ***REMOVED***age***REMOVED***)
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
              c: { type: ***REMOVED***number***REMOVED*** },
            },
          },
        },
      }
      const paths = getSchemaPaths(schema)
      expect(paths).toContain(***REMOVED***a***REMOVED***)
      expect(paths).toContain(***REMOVED***b***REMOVED***)
      expect(paths).toContain(***REMOVED***b.c***REMOVED***)
    })

    it(***REMOVED***handles arrays***REMOVED***, () => {
      const schema: JSONSchema6 = {
        type: ***REMOVED***array***REMOVED***,
        items: { type: ***REMOVED***string***REMOVED*** },
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
              z: { type: ***REMOVED***boolean***REMOVED*** },
            },
          },
        },
        required: [***REMOVED***x***REMOVED***],
      }
      const desc = getSchemaPathDescriptors(schema)
      expect(desc.find((d) => d.path === ***REMOVED***x***REMOVED***)?.required).toBe(true)
      expect(desc.find((d) => d.path === ***REMOVED***y.z***REMOVED***)?.type).toBe(***REMOVED***boolean***REMOVED***)
    })
  })

  describe(***REMOVED***mergeObjects***REMOVED***, () => {
    it(***REMOVED***merges array of objects***REMOVED***, () => {
      const arr = [{ a: 1 }, { b: 2 }, { a: 3 }]
      const merged = mergeObjects(arr)
      expect(merged).toEqual({ a: 3, b: 2 })
    })
  })

  describe(***REMOVED***array item overrides***REMOVED***, () => {
    const schema: JSONSchema6 = {
      type: ***REMOVED***object***REMOVED***,
      properties: {
        testObject: {
          type: ***REMOVED***array***REMOVED***,
          items: {
            type: ***REMOVED***object***REMOVED***,
            properties: {
              field1: { type: ***REMOVED***string***REMOVED*** },
              field2: { type: ***REMOVED***number***REMOVED*** },
            },
          },
        },
      },
    }

    it(***REMOVED***produces a multiple:true object field from array-of-objects schema***REMOVED***, () => {
      const form = overridesAndSchemaToFormObject({ schema })
      const testObjectField = form.fields?.find((f) => f.id === ***REMOVED***testObject***REMOVED***) as any
      expect(testObjectField).toBeDefined()
      expect(testObjectField.multiple).toBe(true)
      expect(testObjectField.fields?.length).toBe(2)
    })

    it(***REMOVED***applies field overrides to array item properties using bracket notation***REMOVED***, () => {
      const form = overridesAndSchemaToFormObject({
        schema,
        formOverrides: [{ fields: [{ prop: ***REMOVED***testObject***REMOVED*** }] }],
        formFieldOverrides: [
          [
            { prop: ***REMOVED***testObject***REMOVED***, layout: ***REMOVED***grid2***REMOVED*** },
            { prop: ***REMOVED***testObject[].field1***REMOVED***, label: ***REMOVED***Custom Field 1 Label***REMOVED*** },
            { prop: ***REMOVED***testObject[].field2***REMOVED***, label: ***REMOVED***Custom Field 2 Label***REMOVED*** },
          ],
        ],
      })
      const testObjectField = form.fields?.find((f) => f.id === ***REMOVED***testObject***REMOVED***) as any
      expect(testObjectField).toBeDefined()
      expect(testObjectField.multiple).toBe(true)
      expect(testObjectField.fields?.find((f: any) => f.id === ***REMOVED***field1***REMOVED***)?.label).toBe(
        ***REMOVED***Custom Field 1 Label***REMOVED***
      )
      expect(testObjectField.fields?.find((f: any) => f.id === ***REMOVED***field2***REMOVED***)?.label).toBe(
        ***REMOVED***Custom Field 2 Label***REMOVED***
      )
    })

    it(***REMOVED***also works when testObject has both test and testObject fields in form.fields***REMOVED***, () => {
      const schemaWithTest: JSONSchema6 = {
        type: ***REMOVED***object***REMOVED***,
        properties: {
          test: { type: ***REMOVED***array***REMOVED***, items: { type: ***REMOVED***string***REMOVED*** } },
          testObject: {
            type: ***REMOVED***array***REMOVED***,
            items: {
              type: ***REMOVED***object***REMOVED***,
              properties: {
                field1: { type: ***REMOVED***string***REMOVED*** },
                field2: { type: ***REMOVED***number***REMOVED*** },
              },
            },
          },
        },
      }
      const form = overridesAndSchemaToFormObject({
        schema: schemaWithTest,
        formOverrides: [{ fields: [{ prop: ***REMOVED***test***REMOVED*** }, { prop: ***REMOVED***testObject***REMOVED*** }] }],
        formFieldOverrides: [
          [
            { prop: ***REMOVED***testObject***REMOVED***, layout: ***REMOVED***grid2***REMOVED*** },
            { prop: ***REMOVED***testObject[].field1***REMOVED***, label: ***REMOVED***Custom Field 1 Label***REMOVED*** },
            { prop: ***REMOVED***testObject[].field2***REMOVED***, label: ***REMOVED***Custom Field 2 Label***REMOVED*** },
          ],
        ],
      })
      const testObjectField = form.fields?.find((f) => f.id === ***REMOVED***testObject***REMOVED***) as any
      expect(testObjectField).toBeDefined()
      expect(testObjectField.multiple).toBe(true)
      expect(testObjectField.fields?.find((f: any) => f.id === ***REMOVED***field1***REMOVED***)?.label).toBe(
        ***REMOVED***Custom Field 1 Label***REMOVED***
      )
    })

    it(***REMOVED***remaps top-level tabs shorthand to the matching multiple array object field***REMOVED***, () => {
      const schemaWithTabs: JSONSchema6 = {
        type: ***REMOVED***object***REMOVED***,
        properties: {
          records: {
            type: ***REMOVED***array***REMOVED***,
            items: {
              type: ***REMOVED***object***REMOVED***,
              properties: {
                name: { type: ***REMOVED***string***REMOVED*** },
                email: { type: ***REMOVED***string***REMOVED*** },
                city: { type: ***REMOVED***string***REMOVED*** },
              },
            },
          },
        },
      }

      const form = overridesAndSchemaToFormObject({
        schema: schemaWithTabs,
        formOverrides: [
          {
            fields: [{ prop: ***REMOVED***records***REMOVED*** }],
            tabs: [
              {
                id: ***REMOVED***personal***REMOVED***,
                label: ***REMOVED***Personal***REMOVED***,
                fields: [{ prop: ***REMOVED***records[].name***REMOVED*** }, { prop: ***REMOVED***records[].email***REMOVED*** }],
              },
              {
                id: ***REMOVED***location***REMOVED***,
                label: ***REMOVED***Location***REMOVED***,
                fields: [{ prop: ***REMOVED***records[].city***REMOVED*** }],
              },
            ],
          },
        ],
        formFieldOverrides: [
          [
            { prop: ***REMOVED***records[].name***REMOVED***, label: ***REMOVED***Full Name***REMOVED*** },
            { prop: ***REMOVED***records[].email***REMOVED***, label: ***REMOVED***Email Address***REMOVED*** },
            { prop: ***REMOVED***records[].city***REMOVED***, label: ***REMOVED***City Name***REMOVED*** },
          ],
        ],
      })

      const recordsField = form.fields?.find((f) => f.id === ***REMOVED***records***REMOVED***) as any
      expect(recordsField).toBeDefined()
      expect(recordsField.multiple).toBe(true)
      expect(form.tabs).toBeUndefined()
      expect(recordsField.tabs?.length).toBe(2)
      expect(recordsField.tabs?.[0]?.fields?.find((f: any) => f.id === ***REMOVED***name***REMOVED***)?.label).toBe(
        ***REMOVED***Full Name***REMOVED***
      )
      expect(recordsField.tabs?.[0]?.fields?.find((f: any) => f.id === ***REMOVED***email***REMOVED***)?.label).toBe(
        ***REMOVED***Email Address***REMOVED***
      )
      expect(recordsField.tabs?.[1]?.fields?.find((f: any) => f.id === ***REMOVED***city***REMOVED***)?.label).toBe(
        ***REMOVED***City Name***REMOVED***
      )
    })

    it(***REMOVED***resolves section field overrides with bracket notation to schema fields***REMOVED***, () => {
      const schemaWithTabs: JSONSchema6 = {
        type: ***REMOVED***object***REMOVED***,
        properties: {
          records: {
            type: ***REMOVED***array***REMOVED***,
            items: {
              type: ***REMOVED***object***REMOVED***,
              properties: {
                name: { type: ***REMOVED***string***REMOVED*** },
              },
            },
          },
        },
      }

      const form = overridesAndSchemaToFormObject({
        schema: schemaWithTabs,
        formOverrides: [
          {
            fields: [
              {
                prop: ***REMOVED***records***REMOVED***,
                type: ***REMOVED***object***REMOVED***,
                tabs: [{ id: ***REMOVED***tab1***REMOVED***, label: ***REMOVED***Tab 1***REMOVED***, fields: [{ prop: ***REMOVED***records[].name***REMOVED*** }] }],
              },
            ],
          },
        ],
        formFieldOverrides: [[{ prop: ***REMOVED***records[].name***REMOVED***, label: ***REMOVED***Name Label***REMOVED*** }]],
      })

      const recordsField = form.fields?.find((f) => f.id === ***REMOVED***records***REMOVED***) as any
      expect(recordsField.tabs?.[0]?.fields?.[0]?.id).toBe(***REMOVED***name***REMOVED***)
      expect(recordsField.tabs?.[0]?.fields?.[0]?.label).toBe(***REMOVED***Name Label***REMOVED***)
    })

    it(***REMOVED***remaps wrapper-style top-level tabs to the array field and preserves multiple controls***REMOVED***, () => {
      const wrapperSchema: JSONSchema6 = {
        type: ***REMOVED***object***REMOVED***,
        properties: {
          products: {
            type: ***REMOVED***array***REMOVED***,
            items: {
              type: ***REMOVED***object***REMOVED***,
              properties: {
                id: { type: ***REMOVED***string***REMOVED*** },
                name: { type: ***REMOVED***string***REMOVED*** },
                sku: { type: ***REMOVED***string***REMOVED*** },
                price: { type: ***REMOVED***number***REMOVED*** },
              },
            },
          },
        },
      }

      const form = overridesAndSchemaToFormObject({
        schema: wrapperSchema,
        formOverrides: [
          {
            fields: [{ prop: ***REMOVED***products***REMOVED*** }],
            tabs: [
              {
                id: ***REMOVED***basic***REMOVED***,
                label: ***REMOVED***Basic Info***REMOVED***,
                layout: ***REMOVED***grid3***REMOVED***,
                fields: [
                  { prop: ***REMOVED***products[].id***REMOVED*** },
                  { prop: ***REMOVED***products[].name***REMOVED*** },
                  { prop: ***REMOVED***products[].sku***REMOVED*** },
                ],
              },
              {
                id: ***REMOVED***pricing***REMOVED***,
                label: ***REMOVED***Pricing***REMOVED***,
                fields: [{ prop: ***REMOVED***products[].price***REMOVED*** }],
              },
            ],
          },
        ],
        formFieldOverrides: [
          [
            { prop: ***REMOVED***products[].id***REMOVED***, label: ***REMOVED***Product ID***REMOVED*** },
            { prop: ***REMOVED***products[].name***REMOVED***, label: ***REMOVED***Product Name***REMOVED*** },
            { prop: ***REMOVED***products[].sku***REMOVED***, label: ***REMOVED***SKU Code***REMOVED*** },
            { prop: ***REMOVED***products[].price***REMOVED***, label: ***REMOVED***Selling Price***REMOVED*** },
          ],
        ],
      })

      const productsField = form.fields?.find((f) => f.id === ***REMOVED***products***REMOVED***) as any
      expect(productsField).toBeDefined()
      expect(productsField.multiple).toBe(true)
      expect(form.tabs).toBeUndefined()
      expect(productsField.tabs?.length).toBe(2)
      expect(productsField.tabs?.[0]?.fields?.find((f: any) => f.id === ***REMOVED***id***REMOVED***)?.label).toBe(
        ***REMOVED***Product ID***REMOVED***
      )
      expect(productsField.tabs?.[0]?.fields?.find((f: any) => f.id === ***REMOVED***name***REMOVED***)?.label).toBe(
        ***REMOVED***Product Name***REMOVED***
      )
      // layout must be preserved through the override pipeline
      expect(productsField.tabs?.[0]?.layout).toBe(***REMOVED***grid3***REMOVED***)
      expect(productsField.tabs?.[1]?.layout).toBeUndefined()
    })

    it(***REMOVED***preserves layout on tabs when applied directly to an object field***REMOVED***, () => {
      const schema: JSONSchema6 = {
        type: ***REMOVED***object***REMOVED***,
        properties: {
          item: {
            type: ***REMOVED***object***REMOVED***,
            properties: {
              a: { type: ***REMOVED***string***REMOVED*** },
              b: { type: ***REMOVED***string***REMOVED*** },
              c: { type: ***REMOVED***string***REMOVED*** },
            },
          },
        },
      }

      const form = overridesAndSchemaToFormObject({
        schema,
        formOverrides: [
          {
            fields: [
              {
                prop: ***REMOVED***item***REMOVED***,
                tabs: [
                  {
                    id: ***REMOVED***details***REMOVED***,
                    label: ***REMOVED***Details***REMOVED***,
                    layout: ***REMOVED***grid2***REMOVED***,
                    fields: [{ prop: ***REMOVED***item.a***REMOVED*** }, { prop: ***REMOVED***item.b***REMOVED*** }],
                  },
                  {
                    id: ***REMOVED***extra***REMOVED***,
                    label: ***REMOVED***Extra***REMOVED***,
                    fields: [{ prop: ***REMOVED***item.c***REMOVED*** }],
                  },
                ],
              },
            ],
          },
        ],
      })

      const itemField = form.fields?.find((f) => f.id === ***REMOVED***item***REMOVED***) as any
      expect(itemField).toBeDefined()
      expect(itemField.tabs?.length).toBe(2)
      expect(itemField.tabs?.[0]?.layout).toBe(***REMOVED***grid2***REMOVED***)
      expect(itemField.tabs?.[1]?.layout).toBeUndefined()
    })
  })
})
