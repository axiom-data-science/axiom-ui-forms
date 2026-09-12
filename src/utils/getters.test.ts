import { describe, it, expect } from 'vitest'
import {
  makeJsonPath,
  getChildFields,
  getFields,
  getValueFromPath,
  getFieldValue,
  getPathFromField,
  getFieldsFromFormSection,
  getFormPayload,
} from './getters'
import { type IFormSection, type IFormField } from '@/Form/Creator/FormCreatorTypes'
import { overridesAndSchemaToFormObject, schemaToFormObject } from './schemaToFormHelpers'
import type { JSONSchema6 } from 'json-schema'

describe('getters.ts', () => {
  describe('makeJsonPath', () => {
    it('should return the correct JSON path for a field with destPath', () => {
      const field: IFormField = {
        id: 'field1',
        type: 'text',
        destPath: 'data',
        multiple: true,
        index: 1,
      }
      const result = makeJsonPath(field)
      expect(result).toBe('data[1]')
    })

    it('should return the field id if path and destPath are undefined', () => {
      const field: IFormField = { id: 'field2', type: 'text' }
      const result = makeJsonPath(field)
      expect(result).toBe('field2')
    })

    it('should construct the path correctly for a field with a path array', () => {
      const field: IFormField = {
        id: 'field3',
        type: 'text',
        path: [
          { id: 'parent', multiple: true, type: 'object', fields: [] },
          { id: 'child', type: 'object', fields: [] },
          { id: 'field3', type: 'text' },
        ],
      }
      const result = makeJsonPath(field)
      expect(result).toBe('parent[0].child.field3')
    })
    it('should construct the path correctly for a field with a path array and index', () => {
      const field: IFormField = {
        id: 'fieldWithIndex',
        type: 'text',
        path: [
          { id: 'parent', multiple: true, type: 'text', index: 2 },
          { id: 'child', type: 'text' },
          { id: 'fieldWithIndex', type: 'text' },
        ],
      }
      const result = makeJsonPath(field)
      expect(result).toBe('parent[2].child.fieldWithIndex')
    })
    it('should construct the path correctly for a field with a path array and index in the field', () => {
      const field: IFormField = {
        id: 'fieldWithIndex',
        type: 'text',
        multiple: true,
        index: 2,
        path: [
          { id: 'parent', multiple: true, type: 'object', fields: [] },
          { id: 'child', type: 'object', fields: [] },
          { id: 'fieldWithIndex', type: 'text', multiple: true, index: 2 },
        ],
      }
      const result = makeJsonPath(field)
      expect(result).toBe('parent[0].child.fieldWithIndex[2]')
    })
  })

  describe('getChildFields', () => {
    it('should return child fields if they exist', () => {
      const field: IFormField = {
        id: 'field4',
        type: 'object',
        fields: [
          { id: 'child1', type: 'text' },
          { id: 'child2', type: 'text' },
        ],
      }
      const result = getChildFields(field)
      expect(result).toEqual([
        { id: 'child1', type: 'text' },
        { id: 'child2', type: 'text' },
      ])
    })

    it('should return an empty array if no child fields exist', () => {
      const field = { id: 'field5', type: 'text' }
      const result = getChildFields(field)
      expect(result).toEqual([])
    })
  })

  describe('getFields', () => {
    it('should return all fields recursively', () => {
      const fields: IFormField[] = [
        { id: 'field6', type: 'object', fields: [{ id: 'child3', type: 'text' }] },
        { id: 'field7', type: 'text' },
      ]
      const result = getFields(fields)
      expect(result).toEqual([
        { id: 'field6', type: 'object', fields: [{ id: 'child3', type: 'text' }] },
        { id: 'child3', type: 'text' },
        { id: 'field7', type: 'text' },
      ])
    })

    it('should return an empty array if fields are undefined', () => {
      const result = getFields(undefined)
      expect(result).toEqual([])
    })
  })

  describe('getValueFromPath', () => {
    it('should return the value from the given simple path', () => {
      const formValues = { data: { field8: 'value1' } }
      const result = getValueFromPath('data.field8', formValues)
      expect(result).toBe('value1')
    })

    it('should return undefined if the path does not exist', () => {
      const formValues = { data: { field8: 'value1' } }
      const result = getValueFromPath('data.nonExistentField', formValues)
      expect(result).toBeUndefined()
    })
  })

  describe('getFieldValue', () => {
    it('should return the value of a field from form values', () => {
      const field: IFormField = { id: 'field9', type: 'text', destPath: 'data.field9' }
      const formValues = { data: { field9: 'value1' } }
      const result = getFieldValue(field, formValues)
      expect(result).toBe('value1')
    })

    it('should return undefined if the field value does not exist', () => {
      const field: IFormField = { id: 'field10', type: 'text', destPath: 'data.nonExistentField' }
      const formValues = { data: { field10: 'value1' } }
      const result = getFieldValue(field, formValues)
      expect(result).toBeUndefined()
    })
  })

  describe('getPathFromField', () => {
    it('should return the destPath if it exists', () => {
      const field: IFormField = { id: 'field11', type: 'text', destPath: 'data.field11' }
      const result = getPathFromField(field)
      expect(result).toBe('data.field11')
    })

    it('should construct the path from the path array if destPath is undefined', () => {
      const field: IFormField = {
        id: 'field12',
        type: 'text',
        path: [
          { id: 'parent', type: 'text' },
          { id: 'child', type: 'text' },
          { id: 'field12', type: 'text' },
        ],
      }
      const result = getPathFromField(field)
      expect(result).toBe('parent.child.field12')
    })

    it('should return the field id if both destPath and path are undefined', () => {
      const field: IFormField = { id: 'field13', type: 'text' }
      const result = getPathFromField(field)
      expect(result).toBe('field13')
    })
    it('should ignore an object id in the path that is set to skip_path when constructing id', () => {
      const field: IFormField = {
        id: 'field1',
        type: 'text',
        path: [
          {
            id: 'parent',
            type: 'object',
            skip_path: true,
            fields: [],
          },
          {
            id: 'field1',
            type: 'text',
          },
        ],
      }
      const result = getPathFromField(field)
      expect(result).toBe('field1')
    })
  })

  describe('getFieldsFromFormSection', () => {
    it('should return all fields from a form section recursively', () => {
      const formSection: IFormSection = {
        id: 'section1',
        label: 'Section 1',
        fields: [{ id: 'field14', type: 'text' }],
        pages: [{ id: 'page1', label: 'Page 1', fields: [{ id: 'field15', type: 'text' }] }],
        wizard_steps: [
          { id: 'step1', order: 0, label: 'Step 1', fields: [{ id: 'field16', type: 'text' }] },
        ],
      }
      const result = getFieldsFromFormSection(formSection)
      expect(result).toEqual([
        { id: 'field14', type: 'text' },
        { id: 'field15', type: 'text' },
        { id: 'field16', type: 'text' },
      ])
    })

    it('should return an empty array if the form section has no fields', () => {
      const formSection = { id: 'section2', label: 'Section 2' }
      const result = getFieldsFromFormSection(formSection)
      expect(result).toEqual([])
    })
  })

  describe('getFormPayload', () => {
    it('should exclude fields marked with excludeFromPayload=true', () => {
      const form = {
        id: 'test-form',
        label: 'Test Form',
        fields: [
          { id: 'shape_type', type: 'select', excludeFromPayload: true } as any,
          { id: 'geojson', type: 'text' } as any,
        ],
      } as any
      const formValues = {
        shape_type: 'point',
        geojson: { type: 'Point', coordinates: [0, 0] },
      }
      const result = getFormPayload(formValues, form)
      expect(result).toEqual({ geojson: { type: 'Point', coordinates: [0, 0] } })
      expect(result).not.toHaveProperty('shape_type')
    })

    it('should include fields with excludeFromPayload=false even if marked', () => {
      const form = {
        id: 'test-form',
        label: 'Test Form',
        fields: [
          { id: 'control_field', type: 'select', excludeFromPayload: false } as any,
          { id: 'data_field', type: 'text' } as any,
        ],
      } as any
      const formValues = {
        control_field: 'value1',
        data_field: 'value2',
      }
      const result = getFormPayload(formValues, form)
      expect(result).toEqual({ control_field: 'value1', data_field: 'value2' })
    })

    it('should return empty payload when no fields or all excluded', () => {
      const form = {
        id: 'test-form',
        label: 'Test Form',
        fields: [
          { id: 'excluded1', type: 'text', excludeFromPayload: true } as any,
          { id: 'excluded2', type: 'text', excludeFromPayload: true } as any,
        ],
      } as any
      const formValues = { excluded1: 'val1', excluded2: 'val2' }
      const result = getFormPayload(formValues, form)
      expect(result).toEqual({})
    })

    it('should gather fields from pages when top-level fields are empty', () => {
      const form = {
        id: 'test-form',
        label: 'Test Form',
        pages: [
          {
            id: 'page1',
            label: 'Page 1',
            fields: [
              { id: 'field1', type: 'text' } as any,
              { id: 'field2', type: 'text', excludeFromPayload: true } as any,
            ],
          },
        ],
      } as any
      const formValues = {
        field1: 'value1',
        field2: 'excluded_value',
      }
      const result = getFormPayload(formValues, form)
      expect(result).toEqual({ field1: 'value1' })
      expect(result).not.toHaveProperty('field2')
    })

    it('should emit simple key/value payload for objectList when settings.valueField is set', () => {
      const form = {
        id: 'test-form',
        label: 'Test Form',
        fields: [
          {
            id: 'servers',
            type: 'objectList',
            settings: {
              keyField: 'hostname',
              valueField: 'ip',
            },
            fields: [
              { id: 'hostname', type: 'text' },
              { id: 'ip', type: 'text' },
            ],
          } as any,
        ],
      } as any

      const formValues = {
        servers: {
          alpha: '10.0.0.1',
          beta: {
            hostname: 'beta',
            ip: '10.0.0.2',
            environment: 'prod',
          },
        },
      }

      const result = getFormPayload(formValues, form)
      expect(result).toEqual({
        servers: {
          alpha: '10.0.0.1',
          beta: '10.0.0.2',
        },
      })
    })

    it('should preserve nested object values in objectList valueField mode', () => {
      const form = {
        id: 'test-form',
        label: 'Test Form',
        fields: [
          {
            id: 'nestedList',
            type: 'objectList',
            settings: {
              keyField: 'name',
              valueField: 'value',
            },
            fields: [
              { id: 'name', type: 'text' },
              {
                id: 'value',
                type: 'objectList',
                settings: {
                  keyField: 'subName',
                  excludeKeyFieldFromValue: true,
                },
                fields: [
                  { id: 'subName', type: 'text' },
                  { id: 'subValue', type: 'text' },
                ],
              },
            ],
          } as any,
        ],
      } as any

      const formValues = {
        nestedList: {
          outerA: {
            innerA: {
              subValue: 'x',
            },
          },
        },
      }

      const result = getFormPayload(formValues, form)
      expect(result).toEqual({
        nestedList: {
          outerA: {
            innerA: {
              subValue: 'x',
            },
          },
        },
      })
    })

    it('should emit objectList payload from wrapper layout without keyField when excludeKeyFieldFromValue is true', () => {
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
                settings: {
                  keyField: 'name',
                  excludeKeyFieldFromValue: true,
                },
                fields: [
                  {
                    id: 'wrapper',
                    type: 'objectWrapper',
                    layout: 'grid2',
                    fields: [{ prop: 'name' }, { prop: 'value' }],
                  },
                ],
              } as any,
            ],
          },
        ],
      })

      const formValues = {
        list: {
          alpha: {
            name: 'alpha',
            value: 42,
          },
        },
      }

      const result = getFormPayload(formValues, form)
      expect(result).toEqual({
        list: {
          alpha: {
            value: 42,
          },
        },
      })
    })

    it('should include flattened skip_path child values for multiple object items', () => {
      const form = {
        id: 'test-form',
        label: 'Test Form',
        fields: [
          {
            id: 'variable_converter',
            type: 'object',
            multiple: true,
            fields: [
              {
                id: 'split_operator',
                type: 'object',
                skip_path: true,
                fields: [
                  { id: 'source_variable', type: 'text' },
                  { id: 'converter_type', type: 'text' },
                ],
              },
              {
                id: 'drop_columns',
                type: 'object',
                skip_path: true,
                fields: [
                  { id: 'column_names', type: 'text', multiple: true },
                  { id: 'converter_type', type: 'text' },
                ],
              },
              {
                id: 'output_variables',
                type: 'object',
                multiple: true,
                fields: [
                  { id: 'index', type: 'number' },
                  { id: 'output_variable', type: 'text' },
                ],
              },
            ],
          } as any,
        ],
      } as any

      const formValues = {
        variable_converter: [
          {
            source_variable: 'temp_raw',
            converter_type: 'split',
            column_names: ['unused'],
            output_variables: [
              { index: 0, output_variable: 'u' },
              { index: 1, output_variable: 'v' },
            ],
          },
          {
            converter_type: 'drop',
            column_names: ['a', 'b'],
            output_variables: [{ index: 0, output_variable: 'depth' }],
          },
        ],
      }

      const result = getFormPayload(formValues, form)
      expect(result).toEqual({
        variable_converter: [
          {
            source_variable: 'temp_raw',
            converter_type: 'split',
            column_names: ['unused'],
            output_variables: [
              { index: 0, output_variable: 'u' },
              { index: 1, output_variable: 'v' },
            ],
          },
          {
            converter_type: 'drop',
            column_names: ['a', 'b'],
            output_variables: [{ index: 0, output_variable: 'depth' }],
          },
        ],
      })
    })

    it('should support n-level nested payload extraction with skip_path at arbitrary non-multiple levels', () => {
      const form = {
        id: 'deep-form',
        label: 'Deep Form',
        fields: [
          {
            id: 'variable_converter',
            type: 'object',
            multiple: true,
            fields: [
              {
                id: 'split_operator',
                type: 'object',
                skip_path: true,
                fields: [
                  { id: 'source_variable', type: 'text' },
                  {
                    id: 'details',
                    type: 'object',
                    fields: [
                      {
                        id: 'meta',
                        type: 'object',
                        skip_path: true,
                        fields: [{ id: 'units', type: 'text' }],
                      },
                    ],
                  },
                  {
                    id: 'output_variables',
                    type: 'object',
                    multiple: true,
                    fields: [
                      { id: 'index', type: 'number' },
                      {
                        id: 'shape',
                        type: 'object',
                        skip_path: true,
                        fields: [{ id: 'output_variable', type: 'text' }],
                      },
                    ],
                  },
                ],
              },
            ],
          } as any,
        ],
      } as any

      const formValues = {
        variable_converter: [
          {
            source_variable: 'temp_raw',
            details: {
              units: 'degC',
            },
            output_variables: [
              { index: 0, output_variable: 'temp_surface' },
              { index: 1, output_variable: 'temp_bottom' },
            ],
          },
        ],
      }

      const result = getFormPayload(formValues, form)
      expect(result).toEqual({
        variable_converter: [
          {
            source_variable: 'temp_raw',
            details: {
              units: 'degC',
            },
            output_variables: [
              { index: 0, output_variable: 'temp_surface' },
              { index: 1, output_variable: 'temp_bottom' },
            ],
          },
        ],
      })
    })

    it('should include child values of objectWrapper inside array items (multiple: true)', () => {
      const schema: JSONSchema6 = {
        title: 'Surveys Schema',
        type: 'object',
        properties: {
          surveys: {
            type: 'array',
            title: 'Surveys',
            items: {
              type: 'object',
              properties: {
                survey_date: { type: 'string', title: 'Survey Date' },
                surveyor: { type: 'string', title: 'Surveyor' },
                elevation: { type: 'number', title: 'Elevation' },
              },
            },
          },
        },
      }

      const formOverrides = [
        {
          fields: [
            {
              prop: 'surveys',
              multiple: true,
              fields: [
                {
                  id: 'survey-wrapper',
                  type: 'objectWrapper',
                  fields: [{ prop: 'surveys[].survey_date' }, { prop: 'surveys[].surveyor' }],
                },
                {
                  prop: 'surveys[].elevation',
                },
              ],
            },
          ],
        },
      ]

      const form = overridesAndSchemaToFormObject({
        schema,
        formOverrides: formOverrides as any,
      })

      const formValues = {
        surveys: [
          {
            survey_date: '2026-01-15',
            surveyor: 'Jane Doe',
            elevation: 12.34,
          },
        ],
      }

      const result = getFormPayload(formValues, form)
      expect(result).toEqual({
        surveys: [
          {
            survey_date: '2026-01-15',
            surveyor: 'Jane Doe',
            elevation: 12.34,
          },
        ],
      })
    })

    it('should include active oneOf object branch values in payload', () => {
      const schema: JSONSchema6 = {
        title: 'OneOf Object Payload Test',
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
                  prefix: { type: 'string' },
                },
              },
              {
                title: 'HTTP',
                type: 'object',
                properties: {
                  url: { type: 'string' },
                  method: { type: 'string', enum: ['GET', 'POST'] },
                },
              },
            ],
          },
        },
      }

      const form = schemaToFormObject(schema)
      const formValues = {
        transport: {
          select_transport: 'S3',
          bucket: 'example-bucket',
          prefix: 'incoming/',
        },
      }

      const result = getFormPayload(formValues, form)
      expect(result).toEqual({
        transport: {
          bucket: 'example-bucket',
          prefix: 'incoming/',
        },
      })
    })

    it('should exclude inactive oneOf branch values from payload', () => {
      const schema: JSONSchema6 = {
        title: 'OneOf Object Payload Exclusion Test',
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
                  prefix: { type: 'string' },
                },
              },
              {
                title: 'HTTP',
                type: 'object',
                properties: {
                  url: { type: 'string' },
                  method: { type: 'string', enum: ['GET', 'POST'] },
                },
              },
            ],
          },
        },
      }

      const form = schemaToFormObject(schema)
      const formValues = {
        transport: {
          select_transport: 'HTTP',
          bucket: 'old-bucket',
          prefix: 'old-prefix/',
          url: 'https://example.com/data',
          method: 'GET',
        },
      }

      const result = getFormPayload(formValues, form)
      expect(result).toEqual({
        transport: {
          url: 'https://example.com/data',
          method: 'GET',
        },
      })
    })
  })
})
