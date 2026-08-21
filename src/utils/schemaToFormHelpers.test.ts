import { describe, it, expect } from 'vitest'
import type { JSONSchema6 } from 'json-schema'
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
} from './schemaToFormHelpers'
import type { IFormFieldOverride, IFormOverride } from '@/Form/Creator/FormCreatorTypes'

describe('schemaToFormHelpers', () => {
  describe('validateSchema', () => {
    it('returns schema for valid schema', () => {
      const schema: JSONSchema6 = {
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
      }
      const result = validateSchema(schema)
      expect(result.schema).toBeDefined()
      expect(result.error).toBeUndefined()
    })

    it('returns error for invalid schema', () => {
      const schema = { type: 'invalid-type' }
      const result = validateSchema(schema)
      expect(result.error).toBeDefined()
    })
  })

  describe('validateAgainstSchema', () => {
    const schema: JSONSchema6 = {
      type: 'object',
      properties: {
        age: { type: 'number', minimum: 0 },
      },
      required: ['age'],
    }

    it('returns undefined for valid data', () => {
      const errors = validateAgainstSchema(schema, { age: 10 })
      expect(errors).toBeUndefined()
    })

    it('returns errors for invalid data', () => {
      const errors = validateAgainstSchema(schema, { age: -5 })
      expect(errors).toBeDefined()
      expect(errors?.[0]?.message).toContain('must be >= 0')
      expect(errors?.[0]?.field).toBe('age')
    })
    it('returns errors for missing required field', () => {
      const errors = validateAgainstSchema(schema, {})
      expect(errors).toBeDefined()
      expect(errors?.[0]?.message).toContain('required')
      expect(errors?.[0]?.field).toBe('age')
    })
    it('returns errors for invalid schema', () => {
      // Invalid: "properties" must be an object, not an array
      const invalidSchema: JSONSchema6 = {
        type: 'object',
        properties: [] as any,
      }
      const errors = validateAgainstSchema(invalidSchema, { age: 10 })
      console.log(errors)
      expect(errors).toBeDefined()
      expect(errors?.[0]?.message).toContain('properties must be object')
      expect(errors?.[0]?.field).toBe('$schema')
    })
  })

  describe('getValueFromSchema', () => {
    it('returns value for string', () => {
      expect(getValueFromSchema('foo')).toBe('foo')
    })
    it('returns value for number', () => {
      expect(getValueFromSchema(42)).toBe(42)
    })
    it('returns value for boolean', () => {
      expect(getValueFromSchema(true)).toBe(true)
    })
    it('returns first value from array', () => {
      expect(getValueFromSchema(['bar', 'baz'])).toBe('bar')
    })
    it('returns const value', () => {
      expect(getValueFromSchema({ const: 'baz' })).toBe('baz')
    })
    it('returns undefined for undefined', () => {
      expect(getValueFromSchema(undefined)).toBeUndefined()
    })
    it('returns value from object with title', () => {
      expect(getValueFromSchema({ title: 'Test' })).toBe('Test')
    })
    it('returns undefined when no value is provided', () => {
      expect(getValueFromSchema({ id: 'test' })).toBeUndefined()
    })
  })

  describe('getLabelFromSchema', () => {
    it('returns string for string', () => {
      expect(getLabelFromSchema('foo')).toBe('foo')
    })
    it('returns string for number', () => {
      expect(getLabelFromSchema(123)).toBe('123')
    })
    it('returns "true" for boolean true', () => {
      expect(getLabelFromSchema(true)).toBe('true')
    })
    it('returns label from title', () => {
      expect(getLabelFromSchema({ title: 'My Title' })).toBe('My Title')
    })
    it('returns value from const', () => {
      expect(getLabelFromSchema({ const: 'abc' })).toBe('abc')
    })
    it('returns id when no title or const', () => {
      console.log(getLabelFromSchema({ $id: 'test-id' }))
      expect(getLabelFromSchema({ $id: 'test-id' })).toBe('Test id')
    })
    it('returns undefined for undefined', () => {
      expect(getLabelFromSchema(undefined)).toBeUndefined()
    })
  })

  describe('schemaToFormObject', () => {
    it('creates form object from schema', () => {
      const schema: JSONSchema6 = {
        title: 'Test Form',
        type: 'object',
        properties: {
          firstName: { type: 'string', title: 'First Name' },
          age: { type: 'number' },
        },
      }
      const form = schemaToFormObject(schema)
      expect(form.label).toBe('Test Form')
      expect(form?.fields?.length).toBe(2)
      expect(form?.fields?.[0].label).toBe('First Name')
    })

    it('renders oneOf object branches as a selector with conditional branch wrappers', () => {
      const schema: JSONSchema6 = {
        title: 'Config Form',
        type: 'object',
        properties: {
          mode_config: {
            type: 'object',
            title: 'Mode Config',
            oneOf: [
              {
                title: 'Split',
                type: 'object',
                properties: {
                  source_variable: { type: 'string' },
                },
              },
              {
                title: 'Profile',
                type: 'object',
                properties: {
                  depth: { type: 'number' },
                },
              },
            ],
          },
        },
      }

      const form = schemaToFormObject(schema)
      const modeField = form.fields?.find((f) => f.id === 'mode_config') as any
      expect(modeField).toBeDefined()
      expect(modeField.type).toBe('object')

      const selector = modeField.fields?.find((f: any) => f.id === 'select_mode_config')
      expect(selector).toBeDefined()
      expect(selector.type).toBe('select')
      expect(selector.options?.map((o: any) => o.label)).toEqual(['Split', 'Profile'])
      expect(selector.defaultValue).toBe('Split')
      expect(selector.excludeFromPayload).toBe(true)
      expect(selector.settings?.allowNull).toBe(false)

      const splitBranch = modeField.fields?.find((f: any) => f.id === 'Split')
      const profileBranch = modeField.fields?.find((f: any) => f.id === 'Profile')
      expect(splitBranch?.type).toBe('objectWrapper')
      expect(profileBranch?.type).toBe('objectWrapper')
      expect(splitBranch?.skip_path).toBe(true)
      expect(profileBranch?.skip_path).toBe(true)
      expect(splitBranch?.conditions).toEqual({
        dependsOn: 'mode_config.select_mode_config',
        value: 'Split',
      })
      expect(profileBranch?.conditions).toEqual({
        dependsOn: 'mode_config.select_mode_config',
        value: 'Profile',
      })

      const splitSourceField = splitBranch?.fields?.find((f: any) => f.id === 'source_variable')
      const profileDepthField = profileBranch?.fields?.find((f: any) => f.id === 'depth')
      expect(splitSourceField?.conditions).toEqual({
        dependsOn: 'mode_config.select_mode_config',
        value: 'Split',
      })
      expect(profileDepthField?.conditions).toEqual({
        dependsOn: 'mode_config.select_mode_config',
        value: 'Profile',
      })
    })

    it('preserves all oneOf branch wrappers when parent field is included via single prop override', () => {
      const schema: JSONSchema6 = {
        title: 'OneOf Override Branch Preservation',
        type: 'object',
        properties: {
          transport: {
            type: 'object',
            title: 'Transport',
            oneOf: [
              {
                title: 'S3',
                type: 'object',
                properties: {
                  bucket: { type: 'string' },
                },
              },
              {
                title: 'HTTP',
                type: 'object',
                properties: {
                  url: { type: 'string' },
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
            fields: [{ prop: 'transport' }],
          },
        ],
      })

      const transport = form.fields?.find((f) => f.id === 'transport') as any
      const selector = transport?.fields?.find((f: any) => f.id === 'select_transport')
      const s3 = transport?.fields?.find((f: any) => f.id === 'S3')
      const http = transport?.fields?.find((f: any) => f.id === 'HTTP')

      expect(selector).toBeDefined()
      expect(s3).toBeDefined()
      expect(http).toBeDefined()
      expect(s3?.type).toBe('objectWrapper')
      expect(http?.type).toBe('objectWrapper')
    })

    it('renders anyOf object branches as tabs', () => {
      const schema: JSONSchema6 = {
        title: 'AnyOf Tabs Demo',
        type: 'object',
        properties: {
          processor: {
            title: 'Processor',
            type: 'object',
            anyOf: [
              {
                title: 'Split Processor',
                type: 'object',
                properties: {
                  source_variable: { type: 'string', title: 'Source Variable' },
                  separator: { type: 'string', title: 'Separator' },
                },
              },
              {
                title: 'Drop Processor',
                type: 'object',
                properties: {
                  column_names: {
                    type: 'array',
                    items: { type: 'string' },
                    title: 'Column Names',
                  },
                },
              },
            ],
          },
        },
      }

      const form = schemaToFormObject(schema)
      const processorField = form.fields?.find((f) => f.id === 'processor') as any
      expect(processorField).toBeDefined()
      expect(processorField.type).toBe('object')
      expect(processorField.tabs).toBeDefined()
      expect(processorField.tabs).toHaveLength(2)
      expect(processorField.tabs?.map((t: any) => t.label)).toEqual([
        'Split Processor',
        'Drop Processor',
      ])

      const splitTabFields = processorField.tabs?.[0]?.fields ?? []
      const dropTabFields = processorField.tabs?.[1]?.fields ?? []
      expect(splitTabFields.some((f: any) => f.id === 'source_variable')).toBe(true)
      expect(splitTabFields.some((f: any) => f.id === 'separator')).toBe(true)
      expect(dropTabFields.some((f: any) => f.id === 'column_names')).toBe(true)
    })
  })

  describe('overridesAndSchemaToFormObject', () => {
    it('applies overrides to form', () => {
      const schema: JSONSchema6 = {
        title: 'Base',
        type: 'object',
        properties: {
          foo: { type: 'string' },
        },
      }
      const form = overridesAndSchemaToFormObject({
        schema,
        formOverrides: [{ label: 'Overridden', fields: [{ prop: 'foo' }] }],
        formFieldOverrides: [[{ prop: 'foo', label: 'Bar' }]],
      })
      expect(form.label).toBe('Overridden')
      expect(form?.fields?.[0]?.label).toBe('Bar')
    })

    it('preserves schema-generated tabs for anyOf object when override only references the parent prop', () => {
      const schema: JSONSchema6 = {
        type: 'object',
        properties: {
          processor: {
            type: 'object',
            title: 'Processor',
            anyOf: [
              {
                title: 'Split Processor',
                type: 'object',
                properties: {
                  source_variable: { type: 'string' },
                  separator: { type: 'string' },
                },
              },
              {
                title: 'Drop Processor',
                type: 'object',
                properties: {
                  column_names: {
                    type: 'array',
                    items: { type: 'string' },
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
            fields: [{ prop: 'processor' }],
          },
        ],
      })

      const processorField = form.fields?.find((f) => f.id === 'processor') as any
      expect(processorField).toBeDefined()
      expect(processorField.type).toBe('object')
      expect(processorField.tabs).toBeDefined()
      expect(processorField.tabs).toHaveLength(2)
      expect(processorField.tabs?.map((t: any) => t.label)).toEqual([
        'Split Processor',
        'Drop Processor',
      ])
    })

    it('preserves defaultValue for override-only fields', () => {
      // This is the DefaultValue test case: shape_type is not in schema but added via override
      const schema: JSONSchema6 = {
        type: 'object',
        properties: {
          geojson: { type: 'object', title: 'Geojson' },
        },
      }

      // Field override adds shape_type with defaultValue: "point"
      const fieldOverrides: IFormFieldOverride[] = [
        {
          prop: 'shape_type',
          type: 'select',
          label: 'Shape',
          defaultValue: 'point',
          options: [
            { label: 'Point', value: 'point' },
            { label: 'Polygon', value: 'polygon' },
          ],
        },
      ]

      // Form override specifies shape_type in fields
      const formOverride: IFormOverride = {
        label: 'GeoJSON Form',
        fields: [{ prop: 'shape_type' }],
      }

      const form = overridesAndSchemaToFormObject({
        schema,
        formOverrides: [formOverride],
        formFieldOverrides: [fieldOverrides],
      })

      // shape_type should be in form.fields with all its properties from the override
      const shapeTypeField = form.fields?.find((f) => f.id === 'shape_type')
      expect(shapeTypeField).toBeDefined()
      expect(shapeTypeField?.type).toBe('select')
      expect(shapeTypeField?.defaultValue).toBe('point')
      expect(shapeTypeField?.excludeFromPayload).toBe(true) // auto-marked for exclusion (schema has properties)
    })

    it('resolves relative nested tab props against array scope and preserves schema labels', () => {
      const schema: JSONSchema6 = {
        type: 'object',
        properties: {
          sensors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                elevations: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      'sensor-elevation-survey-date': {
                        type: 'string',
                        title: 'Sensor Elevation Survey Date',
                      },
                    },
                  },
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
            id: 'collab-like-relative-nested',
            fields: [
              {
                prop: 'sensors',
                type: 'object',
                multiple: true,
                tabs: [
                  {
                    id: 'sensor-elevations-tab',
                    fields: [
                      {
                        prop: 'elevations',
                        type: 'object',
                        multiple: true,
                        fields: [
                          {
                            id: 'sensor-elevation-wrapper',
                            type: 'objectWrapper',
                            fields: [{ prop: 'sensor-elevation-survey-date' }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      })

      const sensorsField = form.fields?.find((f) => f.id === 'sensors') as any
      expect(sensorsField).toBeDefined()

      const elevationsField = sensorsField.tabs?.[0]?.fields?.find(
        (f: any) => f.id === 'elevations'
      )
      expect(elevationsField).toBeDefined()

      const wrapper = elevationsField.fields?.find((f: any) => f.id === 'sensor-elevation-wrapper')
      expect(wrapper).toBeDefined()

      const surveyDateField = wrapper.fields?.find(
        (f: any) => f.id === 'sensor-elevation-survey-date'
      )
      expect(surveyDateField).toBeDefined()
      expect(surveyDateField.label).toBe('Sensor Elevation Survey Date')
    })

    it('does not auto-exclude override-only fields when schema has no properties', () => {
      const schema: JSONSchema6 = { type: 'object' } // no properties

      const fieldOverrides: IFormFieldOverride[] = [
        { prop: 'name', type: 'text', label: 'Name' },
        { prop: 'age', type: 'number', label: 'Age' },
      ]

      const formOverride: IFormOverride = {
        label: 'No-Schema Form',
        fields: [{ prop: 'name' }, { prop: 'age' }],
      }

      const form = overridesAndSchemaToFormObject({
        schema,
        formOverrides: [formOverride],
        formFieldOverrides: [fieldOverrides],
      })

      const nameField = form.fields?.find((f) => f.id === 'name')
      const ageField = form.fields?.find((f) => f.id === 'age')
      expect(nameField?.excludeFromPayload).not.toBe(true)
      expect(ageField?.excludeFromPayload).not.toBe(true)
    })

    it('inherits title and description for objectList children from additionalProperties schema', () => {
      const schema: JSONSchema6 = {
        type: 'object',
        properties: {
          list: {
            type: 'object',
            additionalProperties: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  title: 'Name',
                  description: 'Name of the item',
                },
                value: {
                  type: 'number',
                  title: 'Value',
                  description: 'Value of the item',
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
                prop: 'list',
                type: 'objectList',
                settings: { keyField: 'name' },
              },
            ],
          },
        ],
      })

      const listField = form.fields?.find((f) => f.id === 'list') as any
      expect(listField).toBeDefined()
      expect(listField.type).toBe('objectList')
      expect(listField.fields?.find((f: any) => f.id === 'name')?.label).toBe('Name')
      expect(listField.fields?.find((f: any) => f.id === 'name')?.description).toBe(
        'Name of the item'
      )
      expect(listField.fields?.find((f: any) => f.id === 'value')?.label).toBe('Value')
      expect(listField.fields?.find((f: any) => f.id === 'value')?.description).toBe(
        'Value of the item'
      )
    })

    it('supports nested objectList display overrides with prop-based children', () => {
      const schema: JSONSchema6 = {
        type: 'object',
        properties: {
          list: {
            type: 'object',
            additionalProperties: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  title: 'Name',
                },
                value: {
                  type: 'number',
                  title: 'Value',
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
                prop: 'list',
                type: 'objectList',
                settings: {
                  keyField: 'name',
                },
                fields: [
                  {
                    id: 'wrapper',
                    type: 'objectWrapper',
                    layout: 'grid2',
                    fields: [
                      { prop: 'name', label: 'Display Name' },
                      { prop: 'value', label: 'Display Value' },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      })

      const listField = form.fields?.find((f) => f.id === 'list') as any
      expect(listField).toBeDefined()
      expect(listField.type).toBe('objectList')

      const wrapper = listField.fields?.find((f: any) => f.id === 'wrapper')
      expect(wrapper).toBeDefined()
      expect(wrapper.type).toBe('objectWrapper')

      const nestedName = wrapper.fields?.find((f: any) => f.id === 'name')
      const nestedValue = wrapper.fields?.find((f: any) => f.id === 'value')
      expect(nestedName?.label).toBe('Display Name')
      expect(nestedValue?.label).toBe('Display Value')
    })

    it('does not duplicate objectList schema children when using id-only wrapper layout', () => {
      const schema: JSONSchema6 = {
        type: 'object',
        properties: {
          list: {
            type: 'object',
            additionalProperties: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  title: 'Name',
                  description: 'Name of the item',
                },
                value: {
                  type: 'number',
                  title: 'Value',
                  description: 'Value of the item',
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
                prop: 'list',
                type: 'objectList',
                settings: { keyField: 'name' },
                fields: [
                  {
                    id: 'wrapper',
                    type: 'objectWrapper',
                    layout: 'grid2',
                    fields: [{ prop: 'name' }, { prop: 'value' }],
                  },
                ],
              },
            ],
          },
        ],
      })

      const listField = form.fields?.find((f) => f.id === 'list') as any
      expect(listField).toBeDefined()
      expect(listField.type).toBe('objectList')

      const childIds = (listField.fields ?? []).map((f: any) => f.id)
      expect(childIds).toEqual(['wrapper'])

      const wrapper = listField.fields?.[0]
      expect(wrapper?.type).toBe('objectWrapper')
      expect(wrapper?.fields?.map((f: any) => f.id)).toEqual(['name', 'value'])
      const nestedName = wrapper?.fields?.find((f: any) => f.id === 'name')
      const nestedValue = wrapper?.fields?.find((f: any) => f.id === 'value')
      expect(nestedName).toBeDefined()
      expect(nestedValue).toBeDefined()
      expect(nestedName?.label).toBe('Name')
      expect(nestedName?.description).toBe('Name of the item')
      expect(nestedValue?.label).toBe('Value')
      expect(nestedValue?.description).toBe('Value of the item')
      expect(nestedName?.excludeFromPayload === true).toBe(false)
      expect(nestedValue?.excludeFromPayload === true).toBe(false)
    })
  })

  describe('getSchemaPaths', () => {
    it('returns paths for nested schema', () => {
      const schema: JSONSchema6 = {
        type: 'object',
        properties: {
          a: { type: 'string' },
          b: {
            type: 'object',
            properties: {
              c: { type: 'number' },
            },
          },
        },
      }
      const paths = getSchemaPaths(schema)
      expect(paths).toContain('a')
      expect(paths).toContain('b')
      expect(paths).toContain('b.c')
    })

    it('handles arrays', () => {
      const schema: JSONSchema6 = {
        type: 'array',
        items: { type: 'string' },
      }
      const paths = getSchemaPaths(schema)
      expect(paths).toContain('[]')
    })

    it('includes additionalProperties object child paths', () => {
      const schema: JSONSchema6 = {
        type: 'object',
        properties: {
          list: {
            type: 'object',
            additionalProperties: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                value: { type: 'number' },
              },
            },
          },
        },
      }

      const paths = getSchemaPaths(schema)
      expect(paths).toContain('list')
      expect(paths).toContain('list.name')
      expect(paths).toContain('list.value')
    })
  })

  describe('getSchemaPathDescriptors', () => {
    it('returns descriptors for nested schema', () => {
      const schema: JSONSchema6 = {
        type: 'object',
        properties: {
          x: { type: 'string' },
          y: {
            type: 'object',
            properties: {
              z: { type: 'boolean' },
            },
          },
        },
        required: ['x'],
      }
      const desc = getSchemaPathDescriptors(schema)
      expect(desc.find((d) => d.path === 'x')?.required).toBe(true)
      expect(desc.find((d) => d.path === 'y.z')?.type).toBe('boolean')
    })
  })

  describe('mergeObjects', () => {
    it('merges array of objects', () => {
      const arr = [{ a: 1 }, { b: 2 }, { a: 3 }]
      const merged = mergeObjects(arr)
      expect(merged).toEqual({ a: 3, b: 2 })
    })
  })

  describe('array item overrides', () => {
    const schema: JSONSchema6 = {
      type: 'object',
      properties: {
        testObject: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field1: { type: 'string' },
              field2: { type: 'number' },
            },
          },
        },
      },
    }

    it('produces a multiple:true object field from array-of-objects schema', () => {
      const form = overridesAndSchemaToFormObject({ schema })
      const testObjectField = form.fields?.find((f) => f.id === 'testObject') as any
      expect(testObjectField).toBeDefined()
      expect(testObjectField.multiple).toBe(true)
      expect(testObjectField.fields?.length).toBe(2)
    })

    it('applies field overrides to array item properties using bracket notation', () => {
      const form = overridesAndSchemaToFormObject({
        schema,
        formOverrides: [{ fields: [{ prop: 'testObject' }] }],
        formFieldOverrides: [
          [
            { prop: 'testObject', layout: 'grid2' },
            { prop: 'testObject[].field1', label: 'Custom Field 1 Label' },
            { prop: 'testObject[].field2', label: 'Custom Field 2 Label' },
          ],
        ],
      })
      const testObjectField = form.fields?.find((f) => f.id === 'testObject') as any
      expect(testObjectField).toBeDefined()
      expect(testObjectField.multiple).toBe(true)
      expect(testObjectField.fields?.find((f: any) => f.id === 'field1')?.label).toBe(
        'Custom Field 1 Label'
      )
      expect(testObjectField.fields?.find((f: any) => f.id === 'field2')?.label).toBe(
        'Custom Field 2 Label'
      )
    })

    it('also works when testObject has both test and testObject fields in form.fields', () => {
      const schemaWithTest: JSONSchema6 = {
        type: 'object',
        properties: {
          test: { type: 'array', items: { type: 'string' } },
          testObject: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field1: { type: 'string' },
                field2: { type: 'number' },
              },
            },
          },
        },
      }
      const form = overridesAndSchemaToFormObject({
        schema: schemaWithTest,
        formOverrides: [{ fields: [{ prop: 'test' }, { prop: 'testObject' }] }],
        formFieldOverrides: [
          [
            { prop: 'testObject', layout: 'grid2' },
            { prop: 'testObject[].field1', label: 'Custom Field 1 Label' },
            { prop: 'testObject[].field2', label: 'Custom Field 2 Label' },
          ],
        ],
      })
      const testObjectField = form.fields?.find((f) => f.id === 'testObject') as any
      expect(testObjectField).toBeDefined()
      expect(testObjectField.multiple).toBe(true)
      expect(testObjectField.fields?.find((f: any) => f.id === 'field1')?.label).toBe(
        'Custom Field 1 Label'
      )
    })

    it('applies bracket-notation child labels defined directly in form override fields', () => {
      const form = overridesAndSchemaToFormObject({
        schema,
        formOverrides: [
          {
            fields: [
              {
                prop: 'testObject',
                fields: [
                  { prop: 'testObject[].field1' },
                  {
                    prop: 'testObject[].field2',
                    label: 'Custom Field 2 Label (from form override)',
                  },
                ],
              } as any,
            ],
          },
        ],
      })

      const testObjectField = form.fields?.find((f) => f.id === 'testObject') as any
      expect(testObjectField).toBeDefined()
      expect(testObjectField.fields?.find((f: any) => f.id === 'field2')?.label).toBe(
        'Custom Field 2 Label (from form override)'
      )
    })

    it('does not duplicate child fields when bracket and normalized keys both exist', () => {
      const form = overridesAndSchemaToFormObject({
        schema,
        formOverrides: [
          {
            fields: [
              {
                prop: 'testObject',
                fields: [
                  { prop: 'testObject[].field1' },
                  { prop: 'testObject.field1', label: 'Field 1 normalized override' },
                  { prop: 'testObject[].field2' },
                ],
              } as any,
            ],
          },
        ],
        formFieldOverrides: [[{ prop: 'testObject[].field1', label: 'Field 1 bracket override' }]],
      })

      const testObjectField = form.fields?.find((f) => f.id === 'testObject') as any
      expect(testObjectField).toBeDefined()

      const field1Entries = (testObjectField.fields ?? []).filter((f: any) => f.id === 'field1')
      const field2Entries = (testObjectField.fields ?? []).filter((f: any) => f.id === 'field2')

      expect(field1Entries).toHaveLength(1)
      expect(field2Entries).toHaveLength(1)
      expect(testObjectField.fields).toHaveLength(2)
      expect(field1Entries[0]?.label).toBeDefined()
    })

    it('keeps nested id-only objectWrapper children and renders inner override fields', () => {
      const form = overridesAndSchemaToFormObject({
        schema,
        formOverrides: [
          {
            fields: [
              { prop: 'testObject' },
              {
                id: 'wrapper1',
                type: 'objectWrapper',
                fields: [
                  {
                    id: 'wrapper2',
                    type: 'objectWrapper',
                    fields: [
                      {
                        prop: 'testEnum',
                        label: 'Custom Label for Enum',
                      },
                    ],
                  },
                ],
              } as any,
            ],
          },
        ],
      })

      const wrapper1 = form.fields?.find((f) => f.id === 'wrapper1') as any
      expect(wrapper1).toBeDefined()
      expect(wrapper1.type).toBe('objectWrapper')
      expect(wrapper1.skip_path).toBe(true)

      const wrapper2 = wrapper1.fields?.find((f: any) => f.id === 'wrapper2')
      expect(wrapper2).toBeDefined()
      expect(wrapper2.type).toBe('objectWrapper')
      expect(wrapper2.skip_path).toBe(true)

      const nestedField = wrapper2.fields?.find((f: any) => f.id === 'testEnum')
      expect(nestedField).toBeDefined()
      expect(nestedField.label).toBe('Custom Label for Enum')
    })

    it('supports arbitrary-depth id-only objectWrapper nesting', () => {
      const depth = 5
      const leafField = {
        prop: 'testEnum',
        label: 'Deep Enum Label',
      }

      const nestedWrapper = Array.from({ length: depth }).reduceRight<any>((child, _, index) => {
        return {
          id: `wrapper${index + 1}`,
          type: 'objectWrapper',
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

      let current: any = form.fields?.find((f) => f.id === 'wrapper1')
      expect(current).toBeDefined()

      for (let level = 1; level <= depth; level++) {
        expect(current).toBeDefined()
        expect(current.type).toBe('objectWrapper')
        expect(current.skip_path).toBe(true)

        if (level < depth) {
          current = current.fields?.find((f: any) => f.id === `wrapper${level + 1}`)
        }
      }

      const deepField = current?.fields?.find((f: any) => f.id === 'testEnum')
      expect(deepField).toBeDefined()
      expect(deepField.label).toBe('Deep Enum Label')
    })

    it('remaps top-level tabs shorthand to the matching multiple array object field', () => {
      const schemaWithTabs: JSONSchema6 = {
        type: 'object',
        properties: {
          records: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                email: { type: 'string' },
                city: { type: 'string' },
              },
            },
          },
        },
      }

      const form = overridesAndSchemaToFormObject({
        schema: schemaWithTabs,
        formOverrides: [
          {
            fields: [{ prop: 'records' }],
            tabs: [
              {
                id: 'personal',
                label: 'Personal',
                fields: [{ prop: 'records[].name' }, { prop: 'records[].email' }],
              },
              {
                id: 'location',
                label: 'Location',
                fields: [{ prop: 'records[].city' }],
              },
            ],
          },
        ],
        formFieldOverrides: [
          [
            { prop: 'records[].name', label: 'Full Name' },
            { prop: 'records[].email', label: 'Email Address' },
            { prop: 'records[].city', label: 'City Name' },
          ],
        ],
      })

      const recordsField = form.fields?.find((f) => f.id === 'records') as any
      expect(recordsField).toBeDefined()
      expect(recordsField.multiple).toBe(true)
      expect(form.tabs).toBeUndefined()
      expect(recordsField.tabs?.length).toBe(2)
      expect(recordsField.tabs?.[0]?.fields?.find((f: any) => f.id === 'name')?.label).toBe(
        'Full Name'
      )
      expect(recordsField.tabs?.[0]?.fields?.find((f: any) => f.id === 'email')?.label).toBe(
        'Email Address'
      )
      expect(recordsField.tabs?.[1]?.fields?.find((f: any) => f.id === 'city')?.label).toBe(
        'City Name'
      )
    })

    it('resolves section field overrides with bracket notation to schema fields', () => {
      const schemaWithTabs: JSONSchema6 = {
        type: 'object',
        properties: {
          records: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
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
                prop: 'records',
                type: 'object',
                tabs: [{ id: 'tab1', label: 'Tab 1', fields: [{ prop: 'records[].name' }] }],
              },
            ],
          },
        ],
        formFieldOverrides: [[{ prop: 'records[].name', label: 'Name Label' }]],
      })

      const recordsField = form.fields?.find((f) => f.id === 'records') as any
      expect(recordsField.tabs?.[0]?.fields?.[0]?.id).toBe('name')
      expect(recordsField.tabs?.[0]?.fields?.[0]?.label).toBe('Name Label')
    })

    it('remaps wrapper-style top-level tabs to the array field and preserves multiple controls', () => {
      const wrapperSchema: JSONSchema6 = {
        type: 'object',
        properties: {
          products: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                sku: { type: 'string' },
                price: { type: 'number' },
              },
            },
          },
        },
      }

      const form = overridesAndSchemaToFormObject({
        schema: wrapperSchema,
        formOverrides: [
          {
            fields: [{ prop: 'products' }],
            tabs: [
              {
                id: 'basic',
                label: 'Basic Info',
                layout: 'grid3',
                fields: [
                  { prop: 'products[].id' },
                  { prop: 'products[].name' },
                  { prop: 'products[].sku' },
                ],
              },
              {
                id: 'pricing',
                label: 'Pricing',
                fields: [{ prop: 'products[].price' }],
              },
            ],
          },
        ],
        formFieldOverrides: [
          [
            { prop: 'products[].id', label: 'Product ID' },
            { prop: 'products[].name', label: 'Product Name' },
            { prop: 'products[].sku', label: 'SKU Code' },
            { prop: 'products[].price', label: 'Selling Price' },
          ],
        ],
      })

      const productsField = form.fields?.find((f) => f.id === 'products') as any
      expect(productsField).toBeDefined()
      expect(productsField.multiple).toBe(true)
      expect(form.tabs).toBeUndefined()
      expect(productsField.tabs?.length).toBe(2)
      expect(productsField.tabs?.[0]?.fields?.find((f: any) => f.id === 'id')?.label).toBe(
        'Product ID'
      )
      expect(productsField.tabs?.[0]?.fields?.find((f: any) => f.id === 'name')?.label).toBe(
        'Product Name'
      )
      // layout must be preserved through the override pipeline
      expect(productsField.tabs?.[0]?.layout).toBe('grid3')
      expect(productsField.tabs?.[1]?.layout).toBeUndefined()
    })

    it('preserves layout on tabs when applied directly to an object field', () => {
      const schema: JSONSchema6 = {
        type: 'object',
        properties: {
          item: {
            type: 'object',
            properties: {
              a: { type: 'string' },
              b: { type: 'string' },
              c: { type: 'string' },
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
                prop: 'item',
                tabs: [
                  {
                    id: 'details',
                    label: 'Details',
                    layout: 'grid2',
                    fields: [{ prop: 'item.a' }, { prop: 'item.b' }],
                  },
                  {
                    id: 'extra',
                    label: 'Extra',
                    fields: [{ prop: 'item.c' }],
                  },
                ],
              },
            ],
          },
        ],
      })

      const itemField = form.fields?.find((f) => f.id === 'item') as any
      expect(itemField).toBeDefined()
      expect(itemField.tabs?.length).toBe(2)
      expect(itemField.tabs?.[0]?.layout).toBe('grid2')
      expect(itemField.tabs?.[1]?.layout).toBeUndefined()
    })

    it('supports pages and wizard_steps on objectList containers with prop-based child fields', () => {
      const schema: JSONSchema6 = {
        type: 'object',
        properties: {
          list: {
            type: 'object',
            additionalProperties: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                value: { type: 'number' },
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
                prop: 'list',
                type: 'objectList',
                settings: { keyField: 'name' },
                pages: [
                  {
                    id: 'details',
                    label: 'Details',
                    fields: [{ prop: 'list.name', label: 'Name Label' }],
                  },
                ],
                wizard_steps: [
                  {
                    id: 'measure',
                    label: 'Measure',
                    fields: [{ prop: 'list.value', label: 'Value Label' }],
                  },
                ],
              },
            ],
          },
        ],
      })

      const listField = form.fields?.find((f) => f.id === 'list') as any
      expect(listField).toBeDefined()
      expect(listField.type).toBe('objectList')

      expect(listField.pages?.length).toBe(1)
      expect(listField.pages?.[0]?.fields?.[0]?.id).toBe('name')
      expect(listField.pages?.[0]?.fields?.[0]?.label).toBe('Name Label')

      expect(listField.wizard_steps?.length).toBe(1)
      expect(listField.wizard_steps?.[0]?.fields?.[0]?.id).toBe('value')
      expect(listField.wizard_steps?.[0]?.fields?.[0]?.label).toBe('Value Label')
    })
  })
})
