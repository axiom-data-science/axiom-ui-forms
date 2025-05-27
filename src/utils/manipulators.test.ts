import { type IObjectField, type IFormField, type IForm } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { cleanAndUpdateFormValuesWithFieldValue, createOneOfMultipleField } from ***REMOVED***@/utils/manipulators***REMOVED***
import { describe, it, expect } from ***REMOVED***vitest***REMOVED***

describe(***REMOVED***manipulators.ts***REMOVED***, () => {
  describe(***REMOVED***createOneOfMultipleField***REMOVED***, () => {
    it(***REMOVED***should create a new field with the correct path and index***REMOVED***, () => {
      const field: IFormField = {
        id: ***REMOVED***field1***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
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
    it(***REMOVED***should create a new field with the correct path and index for an object field with multiple true, and the children of the object fields should have the correct index set in the path***REMOVED***, () => {
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

  describe(***REMOVED***cleanAndUpdateFormValuesWithFieldValue***REMOVED***, () => {
    it(***REMOVED***should update form values with field value***REMOVED***, () => {
      const formValues = {
        field1: ***REMOVED***value1***REMOVED***,
        field2: ***REMOVED***value2***REMOVED***
      }
      const field1: IFormField = {
        id: ***REMOVED***field1***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        multiple: false
      }
      const field2: IFormField = {
        id: ***REMOVED***field2***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        multiple: false
      }
      const form: IForm = {
        id: ***REMOVED***testForm***REMOVED***,
        label: ***REMOVED***Test Form***REMOVED***,
        fields: [
          field1,
          field2
        ]
      }
      const value = ***REMOVED***newValue***REMOVED***

      const updatedValues = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field: field1,
        value,
        formValues
      })

      console.log(updatedValues)

      expect(updatedValues.field1).toBe(***REMOVED***newValue***REMOVED***)
      expect(updatedValues.field2).toBe(***REMOVED***value2***REMOVED***)
    })
    it(***REMOVED***should remove value that has been excluded due to condition***REMOVED***, () => {
      const formValues = {
        field1: ***REMOVED***value1***REMOVED***,
        field2: ***REMOVED***value2***REMOVED***
      }
      const field1: IFormField = {
        id: ***REMOVED***field1***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        multiple: false,
        conditions: {
          dependsOn: ***REMOVED***field2***REMOVED***,
          value: ***REMOVED***value2***REMOVED***
        }
      }
      const field2: IFormField = {
        id: ***REMOVED***field2***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        multiple: false
      }
      const form: IForm = {
        id: ***REMOVED***form***REMOVED***,
        label: ***REMOVED***Form***REMOVED***,
        fields: [
          field1,
          field2
        ]
      }
      const result = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field: field2,
        value: ***REMOVED***valueNew***REMOVED***,
        formValues
      })
      expect(result.field1).toBeUndefined()
      expect(result.field2).toBe(***REMOVED***valueNew***REMOVED***)
    })
    it(***REMOVED***should not remove value that has been excluded due to condition if the condition is met***REMOVED***, () => {
      const formValues = {
        field1: ***REMOVED***value1***REMOVED***,
        field2: ***REMOVED***value2***REMOVED***
      }
      const field1: IFormField = {
        id: ***REMOVED***field1***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        multiple: false,
        conditions: {
          dependsOn: ***REMOVED***field2***REMOVED***,
          value: ***REMOVED***valueNew***REMOVED*** // this condition will be met
        }
      }
      const field2: IFormField = {
        id: ***REMOVED***field2***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        multiple: false
      }
      const form: IForm = {
        id: ***REMOVED***form***REMOVED***,
        label: ***REMOVED***Form***REMOVED***,
        fields: [
          field1,
          field2
        ]
      }
      const result = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field: field2,
        value: ***REMOVED***valueNew***REMOVED***,
        formValues
      })
      expect(result.field1).toBe(***REMOVED***value1***REMOVED***)
      expect(result.field2).toBe(***REMOVED***valueNew***REMOVED***)
    })
    it(***REMOVED***when two fields have the same destPath and conditions that cause only one to appear at the same time, triggering the condition for one should reset the destPath value to undefined and allow the field that has the condition met to set the value***REMOVED***, () => {
      const formValues = {
        field1: ***REMOVED***value1***REMOVED***,
        field2: ***REMOVED***value2A***REMOVED***
      }
      const field1: IFormField = {
        id: ***REMOVED***field1***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        destPath: ***REMOVED***data***REMOVED***,
        multiple: false,
        conditions: {
          dependsOn: ***REMOVED***field2***REMOVED***,
          value: ***REMOVED***value2A***REMOVED***
        }
      }
      const field1B: IFormField = {
        id: ***REMOVED***field1B***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        destPath: ***REMOVED***data***REMOVED***,
        defaultValue: ***REMOVED******REMOVED***,
        conditions: {
          dependsOn: ***REMOVED***field2***REMOVED***,
          value: ***REMOVED***value2B***REMOVED***
        }

      }
      const field2: IFormField = {
        id: ***REMOVED***field2***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        multiple: false
      }

      const form: IForm = {
        id: ***REMOVED***form***REMOVED***,
        label: ***REMOVED***Form***REMOVED***,
        fields: [
          field1,
          field1B,
          field2
        ]
      }

      const result = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field: field2,
        value: ***REMOVED***value2B***REMOVED***,
        formValues
      })
      expect(result?.data).toBeUndefined()

      const result2 = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field: field1B,
        value: ***REMOVED***new data field value***REMOVED***,
        formValues: result
      })
      console.log(result2)
      expect(result2?.data).toBe(***REMOVED***new data field value***REMOVED***)
    })
  })
})
