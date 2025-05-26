import { describe, it, expect } from ***REMOVED***vitest***REMOVED***
import {
  makeJsonPath,
  getChildFields,
  getFields,
  getValueFromPath,
  getFieldValue,
  getPathFromField,
  getFieldsFromFormSection
} from ***REMOVED***./getters***REMOVED***
import { type IFormSection, type IFormField } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

describe(***REMOVED***getters.ts***REMOVED***, () => {
  describe(***REMOVED***makeJsonPath***REMOVED***, () => {
    it(***REMOVED***should return the correct JSON path for a field with destPath***REMOVED***, () => {
      const field: IFormField = { id: ***REMOVED***field1***REMOVED***, type: ***REMOVED***text***REMOVED***, destPath: ***REMOVED***data***REMOVED***, multiple: true, index: 1 }
      const result = makeJsonPath(field)
      expect(result).toBe(***REMOVED***data[1]***REMOVED***)
    })

    it(***REMOVED***should return the field id if path and destPath are undefined***REMOVED***, () => {
      const field: IFormField = { id: ***REMOVED***field2***REMOVED***, type: ***REMOVED***text***REMOVED*** }
      const result = makeJsonPath(field)
      expect(result).toBe(***REMOVED***field2***REMOVED***)
    })

    it(***REMOVED***should construct the path correctly for a field with a path array***REMOVED***, () => {
      const field: IFormField = {
        id: ***REMOVED***field3***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        path: [{ id: ***REMOVED***parent***REMOVED***, multiple: true, type: ***REMOVED***text***REMOVED*** }, { id: ***REMOVED***child***REMOVED***, type: ***REMOVED***text***REMOVED*** }, { id: ***REMOVED***field3***REMOVED***, type: ***REMOVED***text***REMOVED*** }]
      }
      const result = makeJsonPath(field)
      expect(result).toBe(***REMOVED***parent[0].child.field3***REMOVED***)
    })
    it(***REMOVED***should construct the path correctly for a field with a path array and index***REMOVED***, () => {
      const field: IFormField = {
        id: ***REMOVED***fieldWithIndex***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        path: [{ id: ***REMOVED***parent***REMOVED***, multiple: true, type: ***REMOVED***text***REMOVED***, index: 2 }, { id: ***REMOVED***child***REMOVED***, type: ***REMOVED***text***REMOVED*** }, { id: ***REMOVED***fieldWithIndex***REMOVED***, type: ***REMOVED***text***REMOVED*** }]
      }
      const result = makeJsonPath(field)
      expect(result).toBe(***REMOVED***parent[2].child.fieldWithIndex***REMOVED***)
    })
    it(***REMOVED***should construct the path correctly for a field with a path array and index in the field***REMOVED***, () => {
      const field: IFormField = {
        id: ***REMOVED***fieldWithIndex***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        multiple: true,
        index: 2,
        path: [{ id: ***REMOVED***parent***REMOVED***, multiple: true, type: ***REMOVED***text***REMOVED*** }, { id: ***REMOVED***child***REMOVED***, type: ***REMOVED***text***REMOVED*** }, { id: ***REMOVED***fieldWithIndex***REMOVED***, type: ***REMOVED***text***REMOVED***, multiple: true, index: 2 }]
      }
      const result = makeJsonPath(field)
      expect(result).toBe(***REMOVED***parent[0].child.fieldWithIndex[2]***REMOVED***)
    })
  })

  describe(***REMOVED***getChildFields***REMOVED***, () => {
    it(***REMOVED***should return child fields if they exist***REMOVED***, () => {
      const field: IFormField = {
        id: ***REMOVED***field4***REMOVED***,
        type: ***REMOVED***object***REMOVED***,
        fields: [{ id: ***REMOVED***child1***REMOVED***, type: ***REMOVED***text***REMOVED*** }, { id: ***REMOVED***child2***REMOVED***, type: ***REMOVED***text***REMOVED*** }]
      }
      const result = getChildFields(field)
      expect(result).toEqual([{ id: ***REMOVED***child1***REMOVED***, type: ***REMOVED***text***REMOVED*** }, { id: ***REMOVED***child2***REMOVED***, type: ***REMOVED***text***REMOVED*** }])
    })

    it(***REMOVED***should return an empty array if no child fields exist***REMOVED***, () => {
      const field = { id: ***REMOVED***field5***REMOVED***, type: ***REMOVED***text***REMOVED*** }
      const result = getChildFields(field)
      expect(result).toEqual([])
    })
  })

  describe(***REMOVED***getFields***REMOVED***, () => {
    it(***REMOVED***should return all fields recursively***REMOVED***, () => {
      const fields: IFormField[] = [
        { id: ***REMOVED***field6***REMOVED***, type: ***REMOVED***object***REMOVED***, fields: [{ id: ***REMOVED***child3***REMOVED***, type: ***REMOVED***text***REMOVED*** }] },
        { id: ***REMOVED***field7***REMOVED***, type: ***REMOVED***text***REMOVED*** }
      ]
      const result = getFields(fields)
      expect(result).toEqual([
        { id: ***REMOVED***field6***REMOVED***, type: ***REMOVED***object***REMOVED***, fields: [{ id: ***REMOVED***child3***REMOVED***, type: ***REMOVED***text***REMOVED*** }] },
        { id: ***REMOVED***child3***REMOVED***, type: ***REMOVED***text***REMOVED*** },
        { id: ***REMOVED***field7***REMOVED***, type: ***REMOVED***text***REMOVED*** }
      ])
    })

    it(***REMOVED***should return an empty array if fields are undefined***REMOVED***, () => {
      const result = getFields(undefined)
      expect(result).toEqual([])
    })
  })

  describe(***REMOVED***getValueFromPath***REMOVED***, () => {
    it(***REMOVED***should return the value from the given simple path***REMOVED***, () => {
      const formValues = { data: { field8: ***REMOVED***value1***REMOVED*** } }
      const result = getValueFromPath(***REMOVED***data.field8***REMOVED***, formValues)
      expect(result).toBe(***REMOVED***value1***REMOVED***)
    })

    it(***REMOVED***should return undefined if the path does not exist***REMOVED***, () => {
      const formValues = { data: { field8: ***REMOVED***value1***REMOVED*** } }
      const result = getValueFromPath(***REMOVED***data.nonExistentField***REMOVED***, formValues)
      expect(result).toBeUndefined()
    })
  })

  describe(***REMOVED***getFieldValue***REMOVED***, () => {
    it(***REMOVED***should return the value of a field from form values***REMOVED***, () => {
      const field: IFormField = { id: ***REMOVED***field9***REMOVED***, type: ***REMOVED***text***REMOVED***, destPath: ***REMOVED***data.field9***REMOVED*** }
      const formValues = { data: { field9: ***REMOVED***value1***REMOVED*** } }
      const result = getFieldValue(field, formValues)
      expect(result).toBe(***REMOVED***value1***REMOVED***)
    })

    it(***REMOVED***should return undefined if the field value does not exist***REMOVED***, () => {
      const field: IFormField = { id: ***REMOVED***field10***REMOVED***, type: ***REMOVED***text***REMOVED***, destPath: ***REMOVED***data.nonExistentField***REMOVED*** }
      const formValues = { data: { field10: ***REMOVED***value1***REMOVED*** } }
      const result = getFieldValue(field, formValues)
      expect(result).toBeUndefined()
    })
  })

  describe(***REMOVED***getPathFromField***REMOVED***, () => {
    it(***REMOVED***should return the destPath if it exists***REMOVED***, () => {
      const field: IFormField = { id: ***REMOVED***field11***REMOVED***, type: ***REMOVED***text***REMOVED***, destPath: ***REMOVED***data.field11***REMOVED*** }
      const result = getPathFromField(field)
      expect(result).toBe(***REMOVED***data.field11***REMOVED***)
    })

    it(***REMOVED***should construct the path from the path array if destPath is undefined***REMOVED***, () => {
      const field: IFormField = {
        id: ***REMOVED***field12***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        path: [{ id: ***REMOVED***parent***REMOVED***, type: ***REMOVED***text***REMOVED*** }, { id: ***REMOVED***child***REMOVED***, type: ***REMOVED***text***REMOVED*** }, { id: ***REMOVED***field12***REMOVED***, type: ***REMOVED***text***REMOVED*** }]
      }
      const result = getPathFromField(field)
      expect(result).toBe(***REMOVED***parent.child.field12***REMOVED***)
    })

    it(***REMOVED***should return the field id if both destPath and path are undefined***REMOVED***, () => {
      const field: IFormField = { id: ***REMOVED***field13***REMOVED***, type: ***REMOVED***text***REMOVED*** }
      const result = getPathFromField(field)
      expect(result).toBe(***REMOVED***field13***REMOVED***)
    })
    it(***REMOVED***should ignore an object id in the path that is set to skip_path when constructing id***REMOVED***, () => {
      const field: IFormField = {
        id: ***REMOVED***field1***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        path: [
          {
            id: ***REMOVED***parent***REMOVED***,
            type: ***REMOVED***object***REMOVED***,
            skip_path: true,
            fields: []
          },
          {
            id: ***REMOVED***field1***REMOVED***,
            type: ***REMOVED***text***REMOVED***
          }
        ]
      }
      const result = getPathFromField(field)
      expect(result).toBe(***REMOVED***field1***REMOVED***)
    })
  })

  describe(***REMOVED***getFieldsFromFormSection***REMOVED***, () => {
    it(***REMOVED***should return all fields from a form section recursively***REMOVED***, () => {
      const formSection: IFormSection = {
        id: ***REMOVED***section1***REMOVED***,
        label: ***REMOVED***Section 1***REMOVED***,
        fields: [{ id: ***REMOVED***field14***REMOVED***, type: ***REMOVED***text***REMOVED*** }],
        pages: [{ id: ***REMOVED***page1***REMOVED***, label: ***REMOVED***Page 1***REMOVED***, fields: [{ id: ***REMOVED***field15***REMOVED***, type: ***REMOVED***text***REMOVED*** }] }],
        wizard_steps: [{ id: ***REMOVED***step1***REMOVED***, order: 0, label: ***REMOVED***Step 1***REMOVED***, fields: [{ id: ***REMOVED***field16***REMOVED***, type: ***REMOVED***text***REMOVED*** }] }]
      }
      const result = getFieldsFromFormSection(formSection)
      expect(result).toEqual([
        { id: ***REMOVED***field14***REMOVED***, type: ***REMOVED***text***REMOVED*** },
        { id: ***REMOVED***field15***REMOVED***, type: ***REMOVED***text***REMOVED*** },
        { id: ***REMOVED***field16***REMOVED***, type: ***REMOVED***text***REMOVED*** }
      ])
    })

    it(***REMOVED***should return an empty array if the form section has no fields***REMOVED***, () => {
      const formSection = { id: ***REMOVED***section2***REMOVED***, label: ***REMOVED***Section 2***REMOVED*** }
      const result = getFieldsFromFormSection(formSection)
      expect(result).toEqual([])
    })
  })
})
