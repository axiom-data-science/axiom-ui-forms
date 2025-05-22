import { type IObjectField, type IFormField } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { createOneOfMultipleField } from ***REMOVED***@/utils/manipulators***REMOVED***
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
})
