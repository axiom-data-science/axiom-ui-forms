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

    it(***REMOVED***renders oneOf object branches as a selector with conditional branch wrappers***REMOVED***, () => {
      const schema: JSONSchema6 = {
        title: ***REMOVED***Config Form***REMOVED***,
        type: ***REMOVED***object***REMOVED***,
        properties: {
          mode_config: {
            type: ***REMOVED***object***REMOVED***,
            title: ***REMOVED***Mode Config***REMOVED***,
            oneOf: [
              {
                title: ***REMOVED***Split***REMOVED***,
                type: ***REMOVED***object***REMOVED***,
                properties: {
                  source_variable: { type: ***REMOVED***string***REMOVED*** },
                },
              },
              {
                title: ***REMOVED***Profile***REMOVED***,
                type: ***REMOVED***object***REMOVED***,
                properties: {
                  depth: { type: ***REMOVED***number***REMOVED*** },
                },
              },
            ],
          },
        },
      }

      const form = schemaToFormObject(schema)
      const modeField = form.fields?.find((f) => f.id === ***REMOVED***mode_config***REMOVED***) as any
      expect(modeField).toBeDefined()
      expect(modeField.type).toBe(***REMOVED***object***REMOVED***)

      const selector = modeField.fields?.find((f: any) => f.id === ***REMOVED***select_mode_config***REMOVED***)
      expect(selector).toBeDefined()
      expect(selector.type).toBe(***REMOVED***select***REMOVED***)
      expect(selector.options?.map((o: any) => o.label)).toEqual([***REMOVED***Split***REMOVED***, ***REMOVED***Profile***REMOVED***])
      expect(selector.defaultValue).toBe(***REMOVED***Split***REMOVED***)
      expect(selector.excludeFromPayload).toBe(true)
      expect(selector.settings?.allowNull).toBe(false)

      const splitBranch = modeField.fields?.find((f: any) => f.id === ***REMOVED***Split***REMOVED***)
      const profileBranch = modeField.fields?.find((f: any) => f.id === ***REMOVED***Profile***REMOVED***)
      expect(splitBranch?.type).toBe(***REMOVED***objectWrapper***REMOVED***)
      expect(profileBranch?.type).toBe(***REMOVED***objectWrapper***REMOVED***)
      expect(splitBranch?.skip_path).toBe(true)
      expect(profileBranch?.skip_path).toBe(true)
      expect(splitBranch?.conditions).toEqual({
        dependsOn: ***REMOVED***mode_config.select_mode_config***REMOVED***,
        value: ***REMOVED***Split***REMOVED***,
      })
      expect(profileBranch?.conditions).toEqual({
        dependsOn: ***REMOVED***mode_config.select_mode_config***REMOVED***,
        value: ***REMOVED***Profile***REMOVED***,
      })

      const splitSourceField = splitBranch?.fields?.find((f: any) => f.id === ***REMOVED***source_variable***REMOVED***)
      const profileDepthField = profileBranch?.fields?.find((f: any) => f.id === ***REMOVED***depth***REMOVED***)
      expect(splitSourceField?.conditions).toEqual({
        dependsOn: ***REMOVED***mode_config.select_mode_config***REMOVED***,
        value: ***REMOVED***Split***REMOVED***,
      })
      expect(profileDepthField?.conditions).toEqual({
        dependsOn: ***REMOVED***mode_config.select_mode_config***REMOVED***,
        value: ***REMOVED***Profile***REMOVED***,
      })
    })

    it(***REMOVED***preserves all oneOf branch wrappers when parent field is included via single prop override***REMOVED***, () => {
      const schema: JSONSchema6 = {
        title: ***REMOVED***OneOf Override Branch Preservation***REMOVED***,
        type: ***REMOVED***object***REMOVED***,
        properties: {
          transport: {
            type: ***REMOVED***object***REMOVED***,
            title: ***REMOVED***Transport***REMOVED***,
            oneOf: [
              {
                title: ***REMOVED***S3***REMOVED***,
                type: ***REMOVED***object***REMOVED***,
                properties: {
                  bucket: { type: ***REMOVED***string***REMOVED*** },
                },
              },
              {
                title: ***REMOVED***HTTP***REMOVED***,
                type: ***REMOVED***object***REMOVED***,
                properties: {
                  url: { type: ***REMOVED***string***REMOVED*** },
                },
              },
            ],
          },
        },
      }

      const form = overridesAndSchemaToFormObject({
        schema,
        formOverrides: [
          {
            fields: [{ prop: ***REMOVED***transport***REMOVED*** }],
          },
        ],
      })

      const transport = form.fields?.find((f) => f.id === ***REMOVED***transport***REMOVED***) as any
      const selector = transport?.fields?.find((f: any) => f.id === ***REMOVED***select_transport***REMOVED***)
      const s3 = transport?.fields?.find((f: any) => f.id === ***REMOVED***S3***REMOVED***)
      const http = transport?.fields?.find((f: any) => f.id === ***REMOVED***HTTP***REMOVED***)

      expect(selector).toBeDefined()
      expect(s3).toBeDefined()
      expect(http).toBeDefined()
      expect(s3?.type).toBe(***REMOVED***objectWrapper***REMOVED***)
      expect(http?.type).toBe(***REMOVED***objectWrapper***REMOVED***)
    })

    it(***REMOVED***renders anyOf object branches as tabs***REMOVED***, () => {
      const schema: JSONSchema6 = {
        title: ***REMOVED***AnyOf Tabs Demo***REMOVED***,
        type: ***REMOVED***object***REMOVED***,
        properties: {
          processor: {
            title: ***REMOVED***Processor***REMOVED***,
            type: ***REMOVED***object***REMOVED***,
            anyOf: [
              {
                title: ***REMOVED***Split Processor***REMOVED***,
                type: ***REMOVED***object***REMOVED***,
                properties: {
                  source_variable: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Source Variable***REMOVED*** },
                  separator: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Separator***REMOVED*** },
                },
              },
              {
                title: ***REMOVED***Drop Processor***REMOVED***,
                type: ***REMOVED***object***REMOVED***,
                properties: {
                  column_names: {
                    type: ***REMOVED***array***REMOVED***,
                    items: { type: ***REMOVED***string***REMOVED*** },
                    title: ***REMOVED***Column Names***REMOVED***,
                  },
                },
              },
            ],
          },
        },
      }

      const form = schemaToFormObject(schema)
      const processorField = form.fields?.find((f) => f.id === ***REMOVED***processor***REMOVED***) as any
      expect(processorField).toBeDefined()
      expect(processorField.type).toBe(***REMOVED***object***REMOVED***)
      expect(processorField.tabs).toBeDefined()
      expect(processorField.tabs).toHaveLength(2)
      expect(processorField.tabs?.map((t: any) => t.label)).toEqual([
        ***REMOVED***Split Processor***REMOVED***,
        ***REMOVED***Drop Processor***REMOVED***,
      ])

      const splitTabFields = processorField.tabs?.[0]?.fields ?? []
      const dropTabFields = processorField.tabs?.[1]?.fields ?? []
      expect(splitTabFields.some((f: any) => f.id === ***REMOVED***source_variable***REMOVED***)).toBe(true)
      expect(splitTabFields.some((f: any) => f.id === ***REMOVED***separator***REMOVED***)).toBe(true)
      expect(dropTabFields.some((f: any) => f.id === ***REMOVED***column_names***REMOVED***)).toBe(true)
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

    it(***REMOVED***preserves schema-generated tabs for anyOf object when override only references the parent prop***REMOVED***, () => {
      const schema: JSONSchema6 = {
        type: ***REMOVED***object***REMOVED***,
        properties: {
          processor: {
            type: ***REMOVED***object***REMOVED***,
            title: ***REMOVED***Processor***REMOVED***,
            anyOf: [
              {
                title: ***REMOVED***Split Processor***REMOVED***,
                type: ***REMOVED***object***REMOVED***,
                properties: {
                  source_variable: { type: ***REMOVED***string***REMOVED*** },
                  separator: { type: ***REMOVED***string***REMOVED*** },
                },
              },
              {
                title: ***REMOVED***Drop Processor***REMOVED***,
                type: ***REMOVED***object***REMOVED***,
                properties: {
                  column_names: {
                    type: ***REMOVED***array***REMOVED***,
                    items: { type: ***REMOVED***string***REMOVED*** },
                  },
                },
              },
            ],
          },
        },
      }

      const form = overridesAndSchemaToFormObject({
        schema,
        formOverrides: [
          {
            fields: [{ prop: ***REMOVED***processor***REMOVED*** }],
          },
        ],
      })

      const processorField = form.fields?.find((f) => f.id === ***REMOVED***processor***REMOVED***) as any
      expect(processorField).toBeDefined()
      expect(processorField.type).toBe(***REMOVED***object***REMOVED***)
      expect(processorField.tabs).toBeDefined()
      expect(processorField.tabs).toHaveLength(2)
      expect(processorField.tabs?.map((t: any) => t.label)).toEqual([
        ***REMOVED***Split Processor***REMOVED***,
        ***REMOVED***Drop Processor***REMOVED***,
      ])
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

    it(***REMOVED***inherits title and description for objectList children from additionalProperties schema***REMOVED***, () => {
      const schema: JSONSchema6 = {
        type: ***REMOVED***object***REMOVED***,
        properties: {
          list: {
            type: ***REMOVED***object***REMOVED***,
            additionalProperties: {
              type: ***REMOVED***object***REMOVED***,
              properties: {
                name: {
                  type: ***REMOVED***string***REMOVED***,
                  title: ***REMOVED***Name***REMOVED***,
                  description: ***REMOVED***Name of the item***REMOVED***,
                },
                value: {
                  type: ***REMOVED***number***REMOVED***,
                  title: ***REMOVED***Value***REMOVED***,
                  description: ***REMOVED***Value of the item***REMOVED***,
                },
              },
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
                prop: ***REMOVED***list***REMOVED***,
                type: ***REMOVED***objectList***REMOVED***,
                settings: { keyField: ***REMOVED***name***REMOVED*** },
              },
            ],
          },
        ],
      })

      const listField = form.fields?.find((f) => f.id === ***REMOVED***list***REMOVED***) as any
      expect(listField).toBeDefined()
      expect(listField.type).toBe(***REMOVED***objectList***REMOVED***)
      expect(listField.fields?.find((f: any) => f.id === ***REMOVED***name***REMOVED***)?.label).toBe(***REMOVED***Name***REMOVED***)
      expect(listField.fields?.find((f: any) => f.id === ***REMOVED***name***REMOVED***)?.description).toBe(
        ***REMOVED***Name of the item***REMOVED***
      )
      expect(listField.fields?.find((f: any) => f.id === ***REMOVED***value***REMOVED***)?.label).toBe(***REMOVED***Value***REMOVED***)
      expect(listField.fields?.find((f: any) => f.id === ***REMOVED***value***REMOVED***)?.description).toBe(
        ***REMOVED***Value of the item***REMOVED***
      )
    })

    it(***REMOVED***supports nested objectList display overrides with prop-based children***REMOVED***, () => {
      const schema: JSONSchema6 = {
        type: ***REMOVED***object***REMOVED***,
        properties: {
          list: {
            type: ***REMOVED***object***REMOVED***,
            additionalProperties: {
              type: ***REMOVED***object***REMOVED***,
              properties: {
                name: {
                  type: ***REMOVED***string***REMOVED***,
                  title: ***REMOVED***Name***REMOVED***,
                },
                value: {
                  type: ***REMOVED***number***REMOVED***,
                  title: ***REMOVED***Value***REMOVED***,
                },
              },
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
                prop: ***REMOVED***list***REMOVED***,
                type: ***REMOVED***objectList***REMOVED***,
                settings: {
                  keyField: ***REMOVED***name***REMOVED***,
                },
                fields: [
                  {
                    id: ***REMOVED***wrapper***REMOVED***,
                    type: ***REMOVED***objectWrapper***REMOVED***,
                    layout: ***REMOVED***grid2***REMOVED***,
                    fields: [
                      { prop: ***REMOVED***name***REMOVED***, label: ***REMOVED***Display Name***REMOVED*** },
                      { prop: ***REMOVED***value***REMOVED***, label: ***REMOVED***Display Value***REMOVED*** },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      })

      const listField = form.fields?.find((f) => f.id === ***REMOVED***list***REMOVED***) as any
      expect(listField).toBeDefined()
      expect(listField.type).toBe(***REMOVED***objectList***REMOVED***)

      const wrapper = listField.fields?.find((f: any) => f.id === ***REMOVED***wrapper***REMOVED***)
      expect(wrapper).toBeDefined()
      expect(wrapper.type).toBe(***REMOVED***objectWrapper***REMOVED***)

      const nestedName = wrapper.fields?.find((f: any) => f.id === ***REMOVED***name***REMOVED***)
      const nestedValue = wrapper.fields?.find((f: any) => f.id === ***REMOVED***value***REMOVED***)
      expect(nestedName?.label).toBe(***REMOVED***Display Name***REMOVED***)
      expect(nestedValue?.label).toBe(***REMOVED***Display Value***REMOVED***)
    })

    it(***REMOVED***does not duplicate objectList schema children when using id-only wrapper layout***REMOVED***, () => {
      const schema: JSONSchema6 = {
        type: ***REMOVED***object***REMOVED***,
        properties: {
          list: {
            type: ***REMOVED***object***REMOVED***,
            additionalProperties: {
              type: ***REMOVED***object***REMOVED***,
              properties: {
                name: {
                  type: ***REMOVED***string***REMOVED***,
                  title: ***REMOVED***Name***REMOVED***,
                  description: ***REMOVED***Name of the item***REMOVED***,
                },
                value: {
                  type: ***REMOVED***number***REMOVED***,
                  title: ***REMOVED***Value***REMOVED***,
                  description: ***REMOVED***Value of the item***REMOVED***,
                },
              },
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
                prop: ***REMOVED***list***REMOVED***,
                type: ***REMOVED***objectList***REMOVED***,
                settings: { keyField: ***REMOVED***name***REMOVED*** },
                fields: [
                  {
                    id: ***REMOVED***wrapper***REMOVED***,
                    type: ***REMOVED***objectWrapper***REMOVED***,
                    layout: ***REMOVED***grid2***REMOVED***,
                    fields: [{ prop: ***REMOVED***name***REMOVED*** }, { prop: ***REMOVED***value***REMOVED*** }],
                  },
                ],
              },
            ],
          },
        ],
      })

      const listField = form.fields?.find((f) => f.id === ***REMOVED***list***REMOVED***) as any
      expect(listField).toBeDefined()
      expect(listField.type).toBe(***REMOVED***objectList***REMOVED***)

      const childIds = (listField.fields ?? []).map((f: any) => f.id)
      expect(childIds).toEqual([***REMOVED***wrapper***REMOVED***])

      const wrapper = listField.fields?.[0]
      expect(wrapper?.type).toBe(***REMOVED***objectWrapper***REMOVED***)
      expect(wrapper?.fields?.map((f: any) => f.id)).toEqual([***REMOVED***name***REMOVED***, ***REMOVED***value***REMOVED***])
      const nestedName = wrapper?.fields?.find((f: any) => f.id === ***REMOVED***name***REMOVED***)
      const nestedValue = wrapper?.fields?.find((f: any) => f.id === ***REMOVED***value***REMOVED***)
      expect(nestedName).toBeDefined()
      expect(nestedValue).toBeDefined()
      expect(nestedName?.label).toBe(***REMOVED***Name***REMOVED***)
      expect(nestedName?.description).toBe(***REMOVED***Name of the item***REMOVED***)
      expect(nestedValue?.label).toBe(***REMOVED***Value***REMOVED***)
      expect(nestedValue?.description).toBe(***REMOVED***Value of the item***REMOVED***)
      expect(nestedName?.excludeFromPayload === true).toBe(false)
      expect(nestedValue?.excludeFromPayload === true).toBe(false)
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

    it(***REMOVED***includes additionalProperties object child paths***REMOVED***, () => {
      const schema: JSONSchema6 = {
        type: ***REMOVED***object***REMOVED***,
        properties: {
          list: {
            type: ***REMOVED***object***REMOVED***,
            additionalProperties: {
              type: ***REMOVED***object***REMOVED***,
              properties: {
                name: { type: ***REMOVED***string***REMOVED*** },
                value: { type: ***REMOVED***number***REMOVED*** },
              },
            },
          },
        },
      }

      const paths = getSchemaPaths(schema)
      expect(paths).toContain(***REMOVED***list***REMOVED***)
      expect(paths).toContain(***REMOVED***list.name***REMOVED***)
      expect(paths).toContain(***REMOVED***list.value***REMOVED***)
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

    it(***REMOVED***applies bracket-notation child labels defined directly in form override fields***REMOVED***, () => {
      const form = overridesAndSchemaToFormObject({
        schema,
        formOverrides: [
          {
            fields: [
              {
                prop: ***REMOVED***testObject***REMOVED***,
                fields: [
                  { prop: ***REMOVED***testObject[].field1***REMOVED*** },
                  { prop: ***REMOVED***testObject[].field2***REMOVED***, label: ***REMOVED***Custom Field 2 Label (from form override)***REMOVED*** },
                ],
              } as any,
            ],
          },
        ],
      })

      const testObjectField = form.fields?.find((f) => f.id === ***REMOVED***testObject***REMOVED***) as any
      expect(testObjectField).toBeDefined()
      expect(testObjectField.fields?.find((f: any) => f.id === ***REMOVED***field2***REMOVED***)?.label).toBe(
        ***REMOVED***Custom Field 2 Label (from form override)***REMOVED***
      )
    })

    it(***REMOVED***does not duplicate child fields when bracket and normalized keys both exist***REMOVED***, () => {
      const form = overridesAndSchemaToFormObject({
        schema,
        formOverrides: [
          {
            fields: [
              {
                prop: ***REMOVED***testObject***REMOVED***,
                fields: [
                  { prop: ***REMOVED***testObject[].field1***REMOVED*** },
                  { prop: ***REMOVED***testObject.field1***REMOVED***, label: ***REMOVED***Field 1 normalized override***REMOVED*** },
                  { prop: ***REMOVED***testObject[].field2***REMOVED*** },
                ],
              } as any,
            ],
          },
        ],
        formFieldOverrides: [[{ prop: ***REMOVED***testObject[].field1***REMOVED***, label: ***REMOVED***Field 1 bracket override***REMOVED*** }]],
      })

      const testObjectField = form.fields?.find((f) => f.id === ***REMOVED***testObject***REMOVED***) as any
      expect(testObjectField).toBeDefined()

      const field1Entries = (testObjectField.fields ?? []).filter((f: any) => f.id === ***REMOVED***field1***REMOVED***)
      const field2Entries = (testObjectField.fields ?? []).filter((f: any) => f.id === ***REMOVED***field2***REMOVED***)

      expect(field1Entries).toHaveLength(1)
      expect(field2Entries).toHaveLength(1)
      expect(testObjectField.fields).toHaveLength(2)
      expect(field1Entries[0]?.label).toBeDefined()
    })

    it(***REMOVED***keeps nested id-only objectWrapper children and renders inner override fields***REMOVED***, () => {
      const form = overridesAndSchemaToFormObject({
        schema,
        formOverrides: [
          {
            fields: [
              { prop: ***REMOVED***testObject***REMOVED*** },
              {
                id: ***REMOVED***wrapper1***REMOVED***,
                type: ***REMOVED***objectWrapper***REMOVED***,
                fields: [
                  {
                    id: ***REMOVED***wrapper2***REMOVED***,
                    type: ***REMOVED***objectWrapper***REMOVED***,
                    fields: [
                      {
                        prop: ***REMOVED***testEnum***REMOVED***,
                        label: ***REMOVED***Custom Label for Enum***REMOVED***,
                      },
                    ],
                  },
                ],
              } as any,
            ],
          },
        ],
      })

      const wrapper1 = form.fields?.find((f) => f.id === ***REMOVED***wrapper1***REMOVED***) as any
      expect(wrapper1).toBeDefined()
      expect(wrapper1.type).toBe(***REMOVED***objectWrapper***REMOVED***)
      expect(wrapper1.skip_path).toBe(true)

      const wrapper2 = wrapper1.fields?.find((f: any) => f.id === ***REMOVED***wrapper2***REMOVED***)
      expect(wrapper2).toBeDefined()
      expect(wrapper2.type).toBe(***REMOVED***objectWrapper***REMOVED***)
      expect(wrapper2.skip_path).toBe(true)

      const nestedField = wrapper2.fields?.find((f: any) => f.id === ***REMOVED***testEnum***REMOVED***)
      expect(nestedField).toBeDefined()
      expect(nestedField.label).toBe(***REMOVED***Custom Label for Enum***REMOVED***)
    })

    it(***REMOVED***supports arbitrary-depth id-only objectWrapper nesting***REMOVED***, () => {
      const depth = 5
      const leafField = {
        prop: ***REMOVED***testEnum***REMOVED***,
        label: ***REMOVED***Deep Enum Label***REMOVED***,
      }

      const nestedWrapper = Array.from({ length: depth }).reduceRight<any>((child, _, index) => {
        return {
          id: `wrapper${index + 1}`,
          type: ***REMOVED***objectWrapper***REMOVED***,
          fields: [child],
        }
      }, leafField)

      const form = overridesAndSchemaToFormObject({
        schema,
        formOverrides: [
          {
            fields: [nestedWrapper],
          },
        ],
      })

      let current: any = form.fields?.find((f) => f.id === ***REMOVED***wrapper1***REMOVED***)
      expect(current).toBeDefined()

      for (let level = 1; level <= depth; level++) {
        expect(current).toBeDefined()
        expect(current.type).toBe(***REMOVED***objectWrapper***REMOVED***)
        expect(current.skip_path).toBe(true)

        if (level < depth) {
          current = current.fields?.find((f: any) => f.id === `wrapper${level + 1}`)
        }
      }

      const deepField = current?.fields?.find((f: any) => f.id === ***REMOVED***testEnum***REMOVED***)
      expect(deepField).toBeDefined()
      expect(deepField.label).toBe(***REMOVED***Deep Enum Label***REMOVED***)
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

    it(***REMOVED***supports pages and wizard_steps on objectList containers with prop-based child fields***REMOVED***, () => {
      const schema: JSONSchema6 = {
        type: ***REMOVED***object***REMOVED***,
        properties: {
          list: {
            type: ***REMOVED***object***REMOVED***,
            additionalProperties: {
              type: ***REMOVED***object***REMOVED***,
              properties: {
                name: { type: ***REMOVED***string***REMOVED*** },
                value: { type: ***REMOVED***number***REMOVED*** },
              },
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
                prop: ***REMOVED***list***REMOVED***,
                type: ***REMOVED***objectList***REMOVED***,
                settings: { keyField: ***REMOVED***name***REMOVED*** },
                pages: [
                  {
                    id: ***REMOVED***details***REMOVED***,
                    label: ***REMOVED***Details***REMOVED***,
                    fields: [{ prop: ***REMOVED***list.name***REMOVED***, label: ***REMOVED***Name Label***REMOVED*** }],
                  },
                ],
                wizard_steps: [
                  {
                    id: ***REMOVED***measure***REMOVED***,
                    label: ***REMOVED***Measure***REMOVED***,
                    fields: [{ prop: ***REMOVED***list.value***REMOVED***, label: ***REMOVED***Value Label***REMOVED*** }],
                  },
                ],
              },
            ],
          },
        ],
      })

      const listField = form.fields?.find((f) => f.id === ***REMOVED***list***REMOVED***) as any
      expect(listField).toBeDefined()
      expect(listField.type).toBe(***REMOVED***objectList***REMOVED***)

      expect(listField.pages?.length).toBe(1)
      expect(listField.pages?.[0]?.fields?.[0]?.id).toBe(***REMOVED***name***REMOVED***)
      expect(listField.pages?.[0]?.fields?.[0]?.label).toBe(***REMOVED***Name Label***REMOVED***)

      expect(listField.wizard_steps?.length).toBe(1)
      expect(listField.wizard_steps?.[0]?.fields?.[0]?.id).toBe(***REMOVED***value***REMOVED***)
      expect(listField.wizard_steps?.[0]?.fields?.[0]?.label).toBe(***REMOVED***Value Label***REMOVED***)
    })
  })
})
