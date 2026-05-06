import {
  type IObjectField,
  type IFormField,
  type IForm,
  type IFormValues,
} from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import {
  cleanAndUpdateFormValuesWithFieldValue,
  createOneOfMultipleField,
} from ***REMOVED***@/utils/manipulators***REMOVED***
import { describe, it, expect } from ***REMOVED***vitest***REMOVED***

describe(***REMOVED***manipulators.ts***REMOVED***, () => {
  describe(***REMOVED***createOneOfMultipleField***REMOVED***, () => {
    it(***REMOVED***should create a new field with the correct path and index***REMOVED***, () => {
      const field: IFormField = {
        id: ***REMOVED***field1***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
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
    it(***REMOVED***should create a new field with the correct path and index for an object field with multiple true***REMOVED***, () => {
      const field: IFormField = {
        id: ***REMOVED***field1***REMOVED***,
        type: ***REMOVED***object***REMOVED***,
        level: 1,
        multiple: true,
        fields: [
          {
            id: ***REMOVED***field2***REMOVED***,
            level: 2,
            type: ***REMOVED***text***REMOVED***,
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

  describe(***REMOVED***cleanAndUpdateFormValuesWithFieldValue***REMOVED***, () => {
    it(***REMOVED***should update form values with field value***REMOVED***, () => {
      const formValues = {
        field1: ***REMOVED***value1***REMOVED***,
        field2: ***REMOVED***value2***REMOVED***,
      }
      const field1: IFormField = {
        id: ***REMOVED***field1***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        multiple: false,
      }
      const field2: IFormField = {
        id: ***REMOVED***field2***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        multiple: false,
      }
      const form: IForm = {
        id: ***REMOVED***testForm***REMOVED***,
        label: ***REMOVED***Test Form***REMOVED***,
        fields: [field1, field2],
      }
      const value = ***REMOVED***newValue***REMOVED***

      const updatedValues = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field: field1,
        value,
        formValues,
      })

      expect(updatedValues.field1).toBe(***REMOVED***newValue***REMOVED***)
      expect(updatedValues.field2).toBe(***REMOVED***value2***REMOVED***)
    })
    it(***REMOVED***should remove value that has been excluded due to condition***REMOVED***, () => {
      const formValues = {
        field1: ***REMOVED***value1***REMOVED***,
        field2: ***REMOVED***value2***REMOVED***,
      }
      const field1: IFormField = {
        id: ***REMOVED***field1***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        multiple: false,
        conditions: {
          dependsOn: ***REMOVED***field2***REMOVED***,
          value: ***REMOVED***value2***REMOVED***,
        },
      }
      const field2: IFormField = {
        id: ***REMOVED***field2***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        multiple: false,
      }
      const form: IForm = {
        id: ***REMOVED***form***REMOVED***,
        label: ***REMOVED***Form***REMOVED***,
        fields: [field1, field2],
      }
      const result = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field: field2,
        value: ***REMOVED***valueNew***REMOVED***,
        formValues,
      })
      expect(result.field1).toBeUndefined()
      expect(result.field2).toBe(***REMOVED***valueNew***REMOVED***)
    })
    it(***REMOVED***should not remove value that has been excluded due to condition if the condition is met***REMOVED***, () => {
      const formValues = {
        field1: ***REMOVED***value1***REMOVED***,
        field2: ***REMOVED***value2***REMOVED***,
      }
      const field1: IFormField = {
        id: ***REMOVED***field1***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        multiple: false,
        conditions: {
          dependsOn: ***REMOVED***field2***REMOVED***,
          value: ***REMOVED***valueNew***REMOVED***, // this condition will be met
        },
      }
      const field2: IFormField = {
        id: ***REMOVED***field2***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        multiple: false,
      }
      const form: IForm = {
        id: ***REMOVED***form***REMOVED***,
        label: ***REMOVED***Form***REMOVED***,
        fields: [field1, field2],
      }
      const result = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field: field2,
        value: ***REMOVED***valueNew***REMOVED***,
        formValues,
      })
      expect(result.field1).toBe(***REMOVED***value1***REMOVED***)
      expect(result.field2).toBe(***REMOVED***valueNew***REMOVED***)
    })
    it(***REMOVED***when two fields have the same destPath and conditions that cause only one to appear at the same time, triggering the condition for one should reset the destPath value to undefined and allow the field that has the condition met to set the value***REMOVED***, () => {
      const formValues = {
        field1: ***REMOVED***value1***REMOVED***,
        field2: ***REMOVED***value2A***REMOVED***,
      }
      const field1: IFormField = {
        id: ***REMOVED***field1***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        destPath: ***REMOVED***data***REMOVED***,
        multiple: false,
        conditions: {
          dependsOn: ***REMOVED***field2***REMOVED***,
          value: ***REMOVED***value2A***REMOVED***,
        },
      }
      const field1B: IFormField = {
        id: ***REMOVED***field1B***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        destPath: ***REMOVED***data***REMOVED***,
        defaultValue: ***REMOVED******REMOVED***,
        conditions: {
          dependsOn: ***REMOVED***field2***REMOVED***,
          value: ***REMOVED***value2B***REMOVED***,
        },
      }
      const field2: IFormField = {
        id: ***REMOVED***field2***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        multiple: false,
      }

      const form: IForm = {
        id: ***REMOVED***form***REMOVED***,
        label: ***REMOVED***Form***REMOVED***,
        fields: [field1, field1B, field2],
      }

      const result = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field: field2,
        value: ***REMOVED***value2B***REMOVED***,
        formValues,
      })
      expect(result?.data).toBeUndefined()

      const result2 = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field: field1B,
        value: ***REMOVED***new data field value***REMOVED***,
        formValues: result,
      })
      expect(result2?.data).toBe(***REMOVED***new data field value***REMOVED***)
    })
  })

  describe(***REMOVED***cleanAndUpdateFormValuesWithFieldValue - edge cases***REMOVED***, () => {
    it(***REMOVED***preserves simple field update***REMOVED***, () => {
      const form: IForm = {
        id: ***REMOVED***testForm***REMOVED***,
        label: ***REMOVED***Test***REMOVED***,
        fields: [
          { id: ***REMOVED***field1***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Field 1***REMOVED*** },
          { id: ***REMOVED***field2***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Field 2***REMOVED*** },
        ],
      }

      const formValues: IFormValues = {
        field1: ***REMOVED***value1***REMOVED***,
        field2: ***REMOVED***value2***REMOVED***,
      }

      const updated = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field: form.fields?.[0] as IFormField,
        value: ***REMOVED***updated value***REMOVED***,
        formValues,
      })

      expect(updated.field1).toBe(***REMOVED***updated value***REMOVED***)
      expect(updated.field2).toBe(***REMOVED***value2***REMOVED***) // unchanged
    })

    it(***REMOVED***handles array-of-objects (multiple flag)***REMOVED***, () => {
      const form: IForm = {
        id: ***REMOVED***testForm***REMOVED***,
        label: ***REMOVED***Test***REMOVED***,
        fields: [
          {
            id: ***REMOVED***items***REMOVED***,
            type: ***REMOVED***object***REMOVED***,
            label: ***REMOVED***Items***REMOVED***,
            multiple: true,
            fields: [{ id: ***REMOVED***label***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Label***REMOVED*** }],
          },
        ],
      }

      const formValues: IFormValues = {
        items: [{ label: ***REMOVED***Item 1***REMOVED*** }, { label: ***REMOVED***Item 2***REMOVED*** }],
      }

      const updated = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field: form.fields?.[0] as IFormField,
        value: [{ label: ***REMOVED***Updated A***REMOVED*** }, { label: ***REMOVED***Updated B***REMOVED*** }],
        formValues,
      })

      expect((updated.items as any)?.[0]?.label).toBe(***REMOVED***Updated A***REMOVED***)
      expect((updated.items as any)?.[1]?.label).toBe(***REMOVED***Updated B***REMOVED***)
    })

    it(***REMOVED***preserves form state when field value is null***REMOVED***, () => {
      const form: IForm = {
        id: ***REMOVED***testForm***REMOVED***,
        label: ***REMOVED***Test***REMOVED***,
        fields: [
          { id: ***REMOVED***field1***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Field 1***REMOVED*** },
          { id: ***REMOVED***field2***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Field 2***REMOVED*** },
        ],
      }

      const formValues: IFormValues = {
        field1: ***REMOVED***value1***REMOVED***,
        field2: ***REMOVED***value2***REMOVED***,
      }

      const updated = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field: form.fields?.[0] as IFormField,
        value: null,
        formValues,
      })

      expect(updated.field1).toBeNull()
      expect(updated.field2).toBe(***REMOVED***value2***REMOVED***) // unchanged
    })

    it(***REMOVED***removes undefined field values from formValues***REMOVED***, () => {
      const form: IForm = {
        id: ***REMOVED***testForm***REMOVED***,
        label: ***REMOVED***Test***REMOVED***,
        fields: [
          { id: ***REMOVED***field1***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Field 1***REMOVED*** },
          { id: ***REMOVED***field2***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Field 2***REMOVED*** },
        ],
      }

      const formValues: IFormValues = {
        field1: ***REMOVED***value1***REMOVED***,
        field2: ***REMOVED***value2***REMOVED***,
      }

      const updated = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field: form.fields?.[0] as IFormField,
        value: undefined,
        formValues,
      })

      expect(updated.field1).toBeUndefined()
      expect(updated.field2).toBe(***REMOVED***value2***REMOVED***)
    })

    it(***REMOVED***handles destPath with multiple conditional fields***REMOVED***, () => {
      // Scenario: two conditional fields both targeting destPath=***REMOVED***location***REMOVED***
      // This validates the triple-write pattern (update → clean → update)
      const form: IForm = {
        id: ***REMOVED***testForm***REMOVED***,
        label: ***REMOVED***Test***REMOVED***,
        fields: [
          { id: ***REMOVED***locationType***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Location Type***REMOVED*** },
          {
            id: ***REMOVED***geoLocation***REMOVED***,
            type: ***REMOVED***text***REMOVED***,
            label: ***REMOVED***Geo Location***REMOVED***,
            destPath: ***REMOVED***location***REMOVED***,
            conditions: { field: ***REMOVED***locationType***REMOVED***, value: ***REMOVED***geo***REMOVED*** },
          },
          {
            id: ***REMOVED***addressLocation***REMOVED***,
            type: ***REMOVED***text***REMOVED***,
            label: ***REMOVED***Address***REMOVED***,
            destPath: ***REMOVED***location***REMOVED***,
            conditions: { field: ***REMOVED***locationType***REMOVED***, value: ***REMOVED***address***REMOVED*** },
          },
        ],
      }

      // Start with geo location active
      const formValues: IFormValues = {
        locationType: ***REMOVED***geo***REMOVED***,
        location: ***REMOVED***geo-value-123***REMOVED***,
      }

      // Set address location (even though address field is excluded by current condition)
      const updated = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field: form.fields?.[2] as IFormField,
        value: ***REMOVED***address-value-456***REMOVED***,
        formValues,
      })

      // The destPath re-write ensures addressLocation***REMOVED***s value maps to ***REMOVED***location***REMOVED*** destPath
      // despite the field being excluded by conditions
      expect(updated.location).toBe(***REMOVED***address-value-456***REMOVED***)
    })

    it(***REMOVED***preserves other fields when using destPath***REMOVED***, () => {
      const form: IForm = {
        id: ***REMOVED***testForm***REMOVED***,
        label: ***REMOVED***Test***REMOVED***,
        fields: [
          { id: ***REMOVED***name***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Name***REMOVED*** },
          {
            id: ***REMOVED***geoField***REMOVED***,
            type: ***REMOVED***text***REMOVED***,
            label: ***REMOVED***Geo***REMOVED***,
            destPath: ***REMOVED***location***REMOVED***,
          },
          { id: ***REMOVED***other***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Other***REMOVED*** },
        ],
      }

      const formValues: IFormValues = {
        name: ***REMOVED***Test Name***REMOVED***,
        location: ***REMOVED***old-location***REMOVED***,
        other: ***REMOVED***other-value***REMOVED***,
      }

      const updated = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field: form.fields?.[1] as IFormField,
        value: ***REMOVED***new-location***REMOVED***,
        formValues,
      })

      expect(updated.name).toBe(***REMOVED***Test Name***REMOVED***)
      expect(updated.location).toBe(***REMOVED***new-location***REMOVED***)
      expect(updated.other).toBe(***REMOVED***other-value***REMOVED***)
    })

    it(***REMOVED***handles complex data types (objects) in field values***REMOVED***, () => {
      const form: IForm = {
        id: ***REMOVED***testForm***REMOVED***,
        label: ***REMOVED***Test***REMOVED***,
        fields: [{ id: ***REMOVED***geoJSON***REMOVED***, type: ***REMOVED***json***REMOVED***, label: ***REMOVED***GeoJSON***REMOVED*** }],
      }

      const complexValue = {
        type: ***REMOVED***Point***REMOVED***,
        coordinates: [-120, 40],
      }

      const formValues: IFormValues = {
        geoJSON: { type: ***REMOVED***Polygon***REMOVED***, coordinates: [] },
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
