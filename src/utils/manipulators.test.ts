import { type IObjectField, type IFormField } from '@/Form/Creator/FormCreatorTypes'
import { createOneOfMultipleField } from '@/utils/manipulators'
import { describe, it, expect } from 'vitest'

describe('getters.ts', () => {
  describe('createOneOfMultipleField', () => {
    it('should create a new field with the correct path and index', () => {
      const field: IFormField = {
        id: 'field1',
        type: 'text',
        multiple: true
      }

      const fieldWithPath = {
        ...field,
        path: [{ ...field }]
      }

      const secondField = createOneOfMultipleField(fieldWithPath, 1)
      console.log(secondField)
      expect(secondField.path?.[0].index).toBe(1)
      expect(secondField?.index).toBe(1)
    })
    it('should create a new field with the correct path and index for an object field with multiple true, and the children of the object fields should have the correct index set in the path', () => {
      const field: IFormField = {
        id: 'field1',
        type: 'object',
        level: 1,
        multiple: true,
        fields: [
          {
            id: 'field2',
            level: 2,
            type: 'text',
            multiple: true
          }
        ]

      }

      const fieldWithPath = {
        ...field,
        path: [{ ...field }],
        fields: field.fields?.map(f => ({ ...f, path: [{ ...field }] }))
      }
      const secondField = createOneOfMultipleField(fieldWithPath, 1) as IObjectField
      expect(secondField.path?.[0].index).toBe(1)
      expect(secondField?.index).toBe(1)
      expect(secondField.fields?.[0].path?.[0].index).toBe(1)
    })
  })
})
