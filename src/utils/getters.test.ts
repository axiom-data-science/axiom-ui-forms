import { describe, it, expect } from 'vitest'
import {
  makeJsonPath,
  getChildFields,
  getFields,
  getValueFromPath,
  getFieldValue,
  getPathFromField,
  getFieldsFromFormSection,
  getFormPayload
} from './getters'
import { type IFormSection, type IFormField } from '@/Form/Creator/FormCreatorTypes'

describe('getters.ts', () => {
  describe('makeJsonPath', () => {
    it('should return the correct JSON path for a field with destPath', () => {
      const field: IFormField = { id: 'field1', type: 'text', destPath: 'data', multiple: true, index: 1 }
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
        path: [{ id: 'parent', multiple: true, type: 'object', fields: [] }, { id: 'child', type: 'object', fields: [] }, { id: 'field3', type: 'text' }]
      }
      const result = makeJsonPath(field)
      expect(result).toBe('parent[0].child.field3')
    })
    it('should construct the path correctly for a field with a path array and index', () => {
      const field: IFormField = {
        id: 'fieldWithIndex',
        type: 'text',
        path: [{ id: 'parent', multiple: true, type: 'text', index: 2 }, { id: 'child', type: 'text' }, { id: 'fieldWithIndex', type: 'text' }]
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
        path: [{ id: 'parent', multiple: true, type: 'object', fields: [] }, { id: 'child', type: 'object', fields: [] }, { id: 'fieldWithIndex', type: 'text', multiple: true, index: 2 }]
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
        fields: [{ id: 'child1', type: 'text' }, { id: 'child2', type: 'text' }]
      }
      const result = getChildFields(field)
      expect(result).toEqual([{ id: 'child1', type: 'text' }, { id: 'child2', type: 'text' }])
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
        { id: 'field7', type: 'text' }
      ]
      const result = getFields(fields)
      expect(result).toEqual([
        { id: 'field6', type: 'object', fields: [{ id: 'child3', type: 'text' }] },
        { id: 'child3', type: 'text' },
        { id: 'field7', type: 'text' }
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
        path: [{ id: 'parent', type: 'text' }, { id: 'child', type: 'text' }, { id: 'field12', type: 'text' }]
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
            fields: []
          },
          {
            id: 'field1',
            type: 'text'
          }
        ]
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
        wizard_steps: [{ id: 'step1', order: 0, label: 'Step 1', fields: [{ id: 'field16', type: 'text' }] }]
      }
      const result = getFieldsFromFormSection(formSection)
      expect(result).toEqual([
        { id: 'field14', type: 'text' },
        { id: 'field15', type: 'text' },
        { id: 'field16', type: 'text' }
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
          { id: 'geojson', type: 'text' } as any
        ]
      } as any
      const formValues = {
        shape_type: 'point',
        geojson: { type: 'Point', coordinates: [0, 0] }
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
          { id: 'data_field', type: 'text' } as any
        ]
      } as any
      const formValues = {
        control_field: 'value1',
        data_field: 'value2'
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
          { id: 'excluded2', type: 'text', excludeFromPayload: true } as any
        ]
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
              { id: 'field2', type: 'text', excludeFromPayload: true } as any
            ]
          }
        ]
      } as any
      const formValues = {
        field1: 'value1',
        field2: 'excluded_value'
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
  })
})
