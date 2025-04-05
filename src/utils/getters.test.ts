import { describe, it, expect } from 'vitest'
import {
  makeJsonPath,
  getChildFields,
  getFields,
  getValueFromPath,
  getFieldValue,
  getPathFromField,
  getFieldsFromFormSection
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
        path: [{ id: 'parent', multiple: true, type: 'text' }, { id: 'child', type: 'text' }]
      }
      const result = makeJsonPath(field)
      expect(result).toBe('parent[0].child')
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
        path: [{ id: 'parent', type: 'text' }, { id: 'child', type: 'text' }]
      }
      const result = getPathFromField(field)
      expect(result).toBe('parent.child')
    })

    it('should return the field id if both destPath and path are undefined', () => {
      const field: IFormField = { id: 'field13', type: 'text' }
      const result = getPathFromField(field)
      expect(result).toBe('field13')
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
})
