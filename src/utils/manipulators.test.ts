import {
  type IObjectField,
  type IFormField,
  type IForm,
  type IFormValues,
} from '@/Form/Creator/FormCreatorTypes'
import {
  cleanAndUpdateFormValuesWithFieldValue,
  createOneOfMultipleField,
} from '@/utils/manipulators'
import { describe, it, expect } from 'vitest'

describe('manipulators.ts', () => {
  describe('createOneOfMultipleField', () => {
    it('should create a new field with the correct path and index', () => {
      const field: IFormField = {
        id: 'field1',
        type: 'text',
        multiple: true,
      }

      const fieldWithPath = {
        ...field,
        path: [{ ...field }],
      }

      const secondField = createOneOfMultipleField(fieldWithPath, 1)
      expect(secondField.path?.[0].index).toBe(1)
      expect(secondField?.index).toBe(1)
    })
    it('should create a new field with the correct path and index for an object field with multiple true', () => {
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
            multiple: true,
          },
        ],
      }

      const fieldWithPath = {
        ...field,
        path: [{ ...field }],
        fields: field.fields?.map((f) => ({ ...f, path: [{ ...field }] })),
      }
      const secondField = createOneOfMultipleField(fieldWithPath, 1) as IObjectField
      expect(secondField.path?.[0].index).toBe(1)
      expect(secondField?.index).toBe(1)
    })
  })

  describe('cleanAndUpdateFormValuesWithFieldValue', () => {
    it('should update form values with field value', () => {
      const formValues = {
        field1: 'value1',
        field2: 'value2',
      }
      const field1: IFormField = {
        id: 'field1',
        type: 'text',
        multiple: false,
      }
      const field2: IFormField = {
        id: 'field2',
        type: 'text',
        multiple: false,
      }
      const form: IForm = {
        id: 'testForm',
        label: 'Test Form',
        fields: [field1, field2],
      }
      const value = 'newValue'

      const updatedValues = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field: field1,
        value,
        formValues,
      })

      expect(updatedValues.field1).toBe('newValue')
      expect(updatedValues.field2).toBe('value2')
    })
    it('should remove value that has been excluded due to condition', () => {
      const formValues = {
        field1: 'value1',
        field2: 'value2',
      }
      const field1: IFormField = {
        id: 'field1',
        type: 'text',
        multiple: false,
        conditions: {
          dependsOn: 'field2',
          value: 'value2',
        },
      }
      const field2: IFormField = {
        id: 'field2',
        type: 'text',
        multiple: false,
      }
      const form: IForm = {
        id: 'form',
        label: 'Form',
        fields: [field1, field2],
      }
      const result = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field: field2,
        value: 'valueNew',
        formValues,
      })
      expect(result.field1).toBeUndefined()
      expect(result.field2).toBe('valueNew')
    })
    it('should not remove value that has been excluded due to condition if the condition is met', () => {
      const formValues = {
        field1: 'value1',
        field2: 'value2',
      }
      const field1: IFormField = {
        id: 'field1',
        type: 'text',
        multiple: false,
        conditions: {
          dependsOn: 'field2',
          value: 'valueNew', // this condition will be met
        },
      }
      const field2: IFormField = {
        id: 'field2',
        type: 'text',
        multiple: false,
      }
      const form: IForm = {
        id: 'form',
        label: 'Form',
        fields: [field1, field2],
      }
      const result = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field: field2,
        value: 'valueNew',
        formValues,
      })
      expect(result.field1).toBe('value1')
      expect(result.field2).toBe('valueNew')
    })
    it('when two fields have the same destPath and conditions that cause only one to appear at the same time, triggering the condition for one should reset the destPath value to undefined and allow the field that has the condition met to set the value', () => {
      const formValues = {
        field1: 'value1',
        field2: 'value2A',
      }
      const field1: IFormField = {
        id: 'field1',
        type: 'text',
        destPath: 'data',
        multiple: false,
        conditions: {
          dependsOn: 'field2',
          value: 'value2A',
        },
      }
      const field1B: IFormField = {
        id: 'field1B',
        type: 'text',
        destPath: 'data',
        defaultValue: '',
        conditions: {
          dependsOn: 'field2',
          value: 'value2B',
        },
      }
      const field2: IFormField = {
        id: 'field2',
        type: 'text',
        multiple: false,
      }

      const form: IForm = {
        id: 'form',
        label: 'Form',
        fields: [field1, field1B, field2],
      }

      const result = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field: field2,
        value: 'value2B',
        formValues,
      })
      expect(result?.data).toBeUndefined()

      const result2 = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field: field1B,
        value: 'new data field value',
        formValues: result,
      })
      expect(result2?.data).toBe('new data field value')
    })
  })

  describe('cleanAndUpdateFormValuesWithFieldValue - edge cases', () => {
    it('preserves simple field update', () => {
      const form: IForm = {
        id: 'testForm',
        label: 'Test',
        fields: [
          { id: 'field1', type: 'text', label: 'Field 1' },
          { id: 'field2', type: 'text', label: 'Field 2' },
        ],
      }

      const formValues: IFormValues = {
        field1: 'value1',
        field2: 'value2',
      }

      const updated = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field: form.fields?.[0] as IFormField,
        value: 'updated value',
        formValues,
      })

      expect(updated.field1).toBe('updated value')
      expect(updated.field2).toBe('value2') // unchanged
    })

    it('handles array-of-objects (multiple flag)', () => {
      const form: IForm = {
        id: 'testForm',
        label: 'Test',
        fields: [
          {
            id: 'items',
            type: 'object',
            label: 'Items',
            multiple: true,
            fields: [{ id: 'label', type: 'text', label: 'Label' }],
          },
        ],
      }

      const formValues: IFormValues = {
        items: [{ label: 'Item 1' }, { label: 'Item 2' }],
      }

      const updated = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field: form.fields?.[0] as IFormField,
        value: [{ label: 'Updated A' }, { label: 'Updated B' }],
        formValues,
      })

      expect((updated.items as any)?.[0]?.label).toBe('Updated A')
      expect((updated.items as any)?.[1]?.label).toBe('Updated B')
    })

    it('preserves form state when field value is null', () => {
      const form: IForm = {
        id: 'testForm',
        label: 'Test',
        fields: [
          { id: 'field1', type: 'text', label: 'Field 1' },
          { id: 'field2', type: 'text', label: 'Field 2' },
        ],
      }

      const formValues: IFormValues = {
        field1: 'value1',
        field2: 'value2',
      }

      const updated = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field: form.fields?.[0] as IFormField,
        value: null,
        formValues,
      })

      expect(updated.field1).toBeNull()
      expect(updated.field2).toBe('value2') // unchanged
    })

    it('removes undefined field values from formValues', () => {
      const form: IForm = {
        id: 'testForm',
        label: 'Test',
        fields: [
          { id: 'field1', type: 'text', label: 'Field 1' },
          { id: 'field2', type: 'text', label: 'Field 2' },
        ],
      }

      const formValues: IFormValues = {
        field1: 'value1',
        field2: 'value2',
      }

      const updated = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field: form.fields?.[0] as IFormField,
        value: undefined,
        formValues,
      })

      expect(updated.field1).toBeUndefined()
      expect(updated.field2).toBe('value2')
    })

    it('handles destPath with multiple conditional fields', () => {
      // Scenario: two conditional fields both targeting destPath='location'
      // This validates the triple-write pattern (update → clean → update)
      const form: IForm = {
        id: 'testForm',
        label: 'Test',
        fields: [
          { id: 'locationType', type: 'text', label: 'Location Type' },
          {
            id: 'geoLocation',
            type: 'text',
            label: 'Geo Location',
            destPath: 'location',
            conditions: { field: 'locationType', value: 'geo' },
          },
          {
            id: 'addressLocation',
            type: 'text',
            label: 'Address',
            destPath: 'location',
            conditions: { field: 'locationType', value: 'address' },
          },
        ],
      }

      // Start with geo location active
      const formValues: IFormValues = {
        locationType: 'geo',
        location: 'geo-value-123',
      }

      // Set address location (even though address field is excluded by current condition)
      const updated = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field: form.fields?.[2] as IFormField,
        value: 'address-value-456',
        formValues,
      })

      // The destPath re-write ensures addressLocation's value maps to 'location' destPath
      // despite the field being excluded by conditions
      expect(updated.location).toBe('address-value-456')
    })

    it('preserves other fields when using destPath', () => {
      const form: IForm = {
        id: 'testForm',
        label: 'Test',
        fields: [
          { id: 'name', type: 'text', label: 'Name' },
          {
            id: 'geoField',
            type: 'text',
            label: 'Geo',
            destPath: 'location',
          },
          { id: 'other', type: 'text', label: 'Other' },
        ],
      }

      const formValues: IFormValues = {
        name: 'Test Name',
        location: 'old-location',
        other: 'other-value',
      }

      const updated = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field: form.fields?.[1] as IFormField,
        value: 'new-location',
        formValues,
      })

      expect(updated.name).toBe('Test Name')
      expect(updated.location).toBe('new-location')
      expect(updated.other).toBe('other-value')
    })

    it('handles complex data types (objects) in field values', () => {
      const form: IForm = {
        id: 'testForm',
        label: 'Test',
        fields: [{ id: 'geoJSON', type: 'json', label: 'GeoJSON' }],
      }

      const complexValue = {
        type: 'Point',
        coordinates: [-120, 40],
      }

      const formValues: IFormValues = {
        geoJSON: { type: 'Polygon', coordinates: [] },
      }

      const updated = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field: form.fields?.[0] as IFormField,
        value: complexValue,
        formValues,
      })

      expect(updated.geoJSON).toEqual(complexValue)
    })
  })
})
