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
      expect(errors?.[0]).toContain('must be >= 0')
    })
    it('returns errors for missing required field', () => {
      const errors = validateAgainstSchema(schema, {})
      expect(errors).toBeDefined()
      expect(errors?.[0]).toContain('required')
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
      expect(errors?.[0]).toContain('properties must be object')
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
                type: 'object',
                skip_path: true,
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
    })
  })
})
