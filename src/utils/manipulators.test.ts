import { type IObjectField, type IFormField, type IForm } from '@/Form/Creator/FormCreatorTypes'
import { cleanAndUpdateFormValuesWithFieldValue, createOneOfMultipleField } from '@/utils/manipulators'
import { describe, it, expect } from 'vitest'

describe('manipulators.ts', () => {
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

  describe('cleanAndUpdateFormValuesWithFieldValue', () => {
    it('should update form values with field value', () => {
      const formValues = {
        field1: 'value1',
        field2: 'value2'
      }
      const field: IFormField = {
        id: 'field1',
        type: 'text',
        multiple: false
      }
      const value = 'newValue'

      const updatedValues = cleanAndUpdateFormValuesWithFieldValue({
        form: { id: 'testForm', label: 'Test Form' },
        field,
        value,
        formValues
      })

      expect(updatedValues.field1).toBe('newValue')
      expect(updatedValues.field2).toBe('value2')
    })
    it('should remove value that has been excluded due to condition', () => {
      const formValues = {
        field1: 'value1',
        field2: 'value2'
      }
      const field1: IFormField = {
        id: 'field1',
        type: 'text',
        multiple: false,
        conditions: {
          dependsOn: 'field2',
          value: 'value2'
        }
      }
      const field2: IFormField = {
        id: 'field2',
        type: 'text',
        multiple: false
      }
      const form: IForm = {
        id: 'form',
        label: 'Form',
        fields: [
          field1,
          field2
        ]
      }
      const result = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field: field2,
        value: 'valueNew',
        formValues
      })
      expect(result.field1).toBeUndefined()
      expect(result.field2).toBe('valueNew')
    })
    it('should not remove value that has been excluded due to condition if the condition is met', () => {
      const formValues = {
        field1: 'value1',
        field2: 'value2'
      }
      const field1: IFormField = {
        id: 'field1',
        type: 'text',
        multiple: false,
        conditions: {
          dependsOn: 'field2',
          value: 'valueNew' // this condition will be met
        }
      }
      const field2: IFormField = {
        id: 'field2',
        type: 'text',
        multiple: false
      }
      const form: IForm = {
        id: 'form',
        label: 'Form',
        fields: [
          field1,
          field2
        ]
      }
      const result = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field: field2,
        value: 'valueNew',
        formValues
      })
      expect(result.field1).toBe('value1')
      expect(result.field2).toBe('valueNew')
    })
    it('when two fields have the same destPath and conditions that cause only one to appear at the same time, triggering the condition for one should reset the destPath value to undefined and allow the field that has the condition met to set the value', () => {
      const formValues = {
        field1: 'value1',
        field2: 'value2A'
      }
      const field1: IFormField = {
        id: 'field1',
        type: 'text',
        destPath: 'data',
        multiple: false,
        conditions: {
          dependsOn: 'field2',
          value: 'value2A'
        }
      }
      const field1B: IFormField = {
        id: 'field1B',
        type: 'text',
        destPath: 'data',
        defaultValue: '',
        conditions: {
          dependsOn: 'field2',
          value: 'value2B'
        }

      }
      const field2: IFormField = {
        id: 'field2',
        type: 'text',
        multiple: false
      }

      const form: IForm = {
        id: 'form',
        label: 'Form',
        fields: [
          field1,
          field1B,
          field2
        ]
      }

      const result = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field: field2,
        value: 'value2B',
        formValues
      })
      expect(result?.data).toBeUndefined()

      const result2 = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field: field1B,
        value: 'new data field value',
        formValues: result
      })
      console.log(result2)
      expect(result2?.data).toBe('new data field value')
    })
  })
})
