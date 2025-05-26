import { describe, it, expect } from ***REMOVED***vitest***REMOVED***
import { applyOverridesToSchemaField, buildFieldMapFromForm, groupOverrideFieldsByProp, mergeFields, mergeFormSections } from ***REMOVED***./mergers***REMOVED***
import { type IFormField, type IForm, type IFormFieldOverride, type IObjectField } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

const mockForm: IForm = {
  id: ***REMOVED***testForm***REMOVED***,
  label: ***REMOVED***Test Form***REMOVED***
}

const mockTextField: IFormField = {
  id: ***REMOVED***textField***REMOVED***,
  type: ***REMOVED***text***REMOVED***,
  label: ***REMOVED***Text field***REMOVED***
}
const mockNumberField: IFormField = {
  id: ***REMOVED***numberField***REMOVED***,
  type: ***REMOVED***number***REMOVED***,
  label: ***REMOVED***Number field***REMOVED***
}

const mockObjectField: IFormField = {
  id: ***REMOVED***objectField***REMOVED***,
  type: ***REMOVED***object***REMOVED***,
  label: ***REMOVED***Object field***REMOVED***,
  fields: [
    {
      id: ***REMOVED***nestedField1***REMOVED***,
      type: ***REMOVED***text***REMOVED***,
      label: ***REMOVED***Nested field 1***REMOVED***
    },
    {
      id: ***REMOVED***nestedField2***REMOVED***,
      type: ***REMOVED***number***REMOVED***,
      label: ***REMOVED***Nested field 2***REMOVED***
    }
  ]
}

describe(***REMOVED***mergers.ts***REMOVED***, () => {
  describe(***REMOVED***groupOverrideFieldsByProp***REMOVED***, () => {
    it(***REMOVED***should group overrides by prop***REMOVED***, () => {
      const overrides: IFormFieldOverride[][] = [
        [
          { prop: ***REMOVED***field1***REMOVED***, label: ***REMOVED***Updated Field 1***REMOVED*** },
          { prop: ***REMOVED***field2***REMOVED***, label: ***REMOVED***Updated Field 2***REMOVED*** }
        ],
        [
          { prop: ***REMOVED***field1***REMOVED***, type: ***REMOVED***number***REMOVED*** }
        ]
      ]
      const grouped = groupOverrideFieldsByProp(overrides)
      expect(grouped).toEqual({
        field1: [
          { prop: ***REMOVED***field1***REMOVED***, label: ***REMOVED***Updated Field 1***REMOVED*** },
          { prop: ***REMOVED***field1***REMOVED***, type: ***REMOVED***number***REMOVED*** }
        ],
        field2: [
          { prop: ***REMOVED***field2***REMOVED***, label: ***REMOVED***Updated Field 2***REMOVED*** }
        ]
      })
    })
  })
  describe(***REMOVED***buildFieldMapFromForm***REMOVED***, () => {
    it(***REMOVED***should return an empty map for an empty form***REMOVED***, () => {
      const result = buildFieldMapFromForm({ ...mockForm })
      expect(result).toEqual({})
    })

    it(***REMOVED***should handle forms with multiple nested object***REMOVED***, () => {
      const result = buildFieldMapFromForm({
        ...mockForm,
        fields: [
          { ...mockTextField },
          { ...mockNumberField },
          { ...mockObjectField }
        ]
      })

      expect(result?.[***REMOVED***objectField.nestedField2***REMOVED***]?.id).toEqual(***REMOVED***nestedField2***REMOVED***)
      expect(result?.[***REMOVED***objectField.nestedField1***REMOVED***]?.id).toEqual(***REMOVED***nestedField1***REMOVED***)
      expect(result?.textField?.id).toEqual(***REMOVED***textField***REMOVED***)
      expect(result?.numberField?.id).toEqual(***REMOVED***numberField***REMOVED***)
    })
    it(***REMOVED***should correctly ignore parent object ids that are marked to skip***REMOVED***, () => {
      const result = buildFieldMapFromForm({
        ...mockForm,
        fields: [
          {
            id: ***REMOVED***objectField***REMOVED***,
            type: ***REMOVED***object***REMOVED***,
            label: ***REMOVED***Object field***REMOVED***,
            skip_path: true,
            fields: [
              { ...mockTextField },
              { ...mockNumberField }
            ]
          }
        ]
      })

      console.log(result?.textField)

      expect(result?.textField?.id).toEqual(***REMOVED***textField***REMOVED***)
      expect(result?.numberField?.id).toEqual(***REMOVED***numberField***REMOVED***)
    })
    it(***REMOVED***should ignore page or wizard path ids when constructing paths***REMOVED***, () => {
      const result = buildFieldMapFromForm({
        ...mockForm,
        pages: [
          {
            id: ***REMOVED***page1***REMOVED***,
            label: ***REMOVED***Page 1***REMOVED***,
            fields: [
              { ...mockTextField },
              { ...mockNumberField }
            ]
          }
        ]
      })

      expect(result?.textField?.id).toEqual(***REMOVED***textField***REMOVED***)
      expect(result?.numberField?.id).toEqual(***REMOVED***numberField***REMOVED***)
    })
  })

  describe(***REMOVED***mergeFields***REMOVED***, () => {
    it(***REMOVED***should apply multiple overrides to a single field***REMOVED***, () => {
      const fieldOverrides = groupOverrideFieldsByProp([
        [{ label: ***REMOVED***Updated text field***REMOVED***, prop: ***REMOVED***textField***REMOVED*** }],
        [{ label: ***REMOVED***Updated Field 1***REMOVED***, prop: ***REMOVED***objectField.nestedField1***REMOVED*** }],
        [{ type: ***REMOVED***number***REMOVED***, prop: ***REMOVED***objectField.nestedField1***REMOVED*** }]
      ])

      const result = mergeFields({
        form: {
          ...mockForm,
          fields: [
            { ...mockTextField },
            { ...mockNumberField },
            { ...mockObjectField }
          ]
        },
        fieldOverrides
      })
      const resultMap = Object.fromEntries(result.map(field => [field.id, field]))
      expect(resultMap?.textField?.label).toEqual(***REMOVED***Updated text field***REMOVED***)

      const objectFieldResult = resultMap?.objectField as IObjectField ?? undefined
      expect(objectFieldResult).not.toBe(undefined)
      const objectFieldFieldsMap = Object.fromEntries(objectFieldResult.fields?.map(field => [field.id, field]))
      expect(objectFieldFieldsMap?.nestedField1).not.toBe(undefined)
      expect(objectFieldFieldsMap?.nestedField1?.label).toEqual(***REMOVED***Updated Field 1***REMOVED***)
      expect(objectFieldFieldsMap?.nestedField1?.type).toEqual(***REMOVED***number***REMOVED***)
    })

    it(***REMOVED***should handle missing overrides gracefully***REMOVED***, () => {
      const form: IForm = {
        ...mockForm,
        fields: [
          {
            id: ***REMOVED***section1***REMOVED***,
            type: ***REMOVED***object***REMOVED***,
            fields: [
              { id: ***REMOVED***field1***REMOVED***, label: ***REMOVED***Field 1***REMOVED***, type: ***REMOVED***text***REMOVED*** },
              { id: ***REMOVED***field2***REMOVED***, label: ***REMOVED***Field 2***REMOVED***, type: ***REMOVED***text***REMOVED*** }
            ]

          }
        ]

      }

      const fieldOverrides: Record<string, IFormFieldOverride[]> = groupOverrideFieldsByProp([
        [{ label: ***REMOVED***Updated Field 1***REMOVED***, prop: ***REMOVED***section1.field1***REMOVED*** }]
      ])

      const result = mergeFields({
        form,
        fieldOverrides
      })

      const resultMap = Object.fromEntries(result.map(field => [field.id, field]))
      const section1 = resultMap?.section1 as IObjectField ?? undefined

      console.log(section1)
      expect(section1).not.toBe(undefined)
      expect(section1?.fields?.find(f => f.id === ***REMOVED***field1***REMOVED***)?.label).toEqual(***REMOVED***Updated Field 1***REMOVED***)
      expect(section1?.fields?.find(f => f.id === ***REMOVED***field2***REMOVED***)?.label).toEqual(***REMOVED***Field 2***REMOVED***)
    })
    it(***REMOVED***should handle empty form.fields correctly***REMOVED***, () => {
      const form: IForm = {
        ...mockForm,
        fields: undefined

      }

      const fieldOverrides: Record<string, IFormFieldOverride[]> = groupOverrideFieldsByProp([
        [{ label: ***REMOVED***Updated Field 1***REMOVED***, prop: ***REMOVED***section1.field1***REMOVED*** }]
      ])

      const result = mergeFields({
        form,
        fieldOverrides
      })

      expect(result).toEqual([])
    })
  })
  describe(***REMOVED***applyOverridesToSchemaField***REMOVED***, () => {
    it(***REMOVED***should apply overrides to a schema field***REMOVED***, () => {
      const schemaField: IFormField = {
        id: ***REMOVED***field1***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        label: ***REMOVED***Field 1***REMOVED***
      }
      const candidateOverrides: IFormFieldOverride[] = [
        { prop: ***REMOVED***field1***REMOVED***, label: ***REMOVED***Updated Field 1***REMOVED*** },
        { prop: ***REMOVED***field1***REMOVED***, type: ***REMOVED***number***REMOVED*** }
      ]
      const result = applyOverridesToSchemaField({
        schemaField,
        candidateOverrides,
        destPath: ***REMOVED***field1***REMOVED***
      })

      expect(result).not.toBe(undefined)
      expect(result?.label).toEqual(***REMOVED***Updated Field 1***REMOVED***)
      expect(result?.type).toEqual(***REMOVED***number***REMOVED***)
    })
    it(***REMOVED***should return undefined when schema field and overrides are both undefined***REMOVED***, () => {
      const result = applyOverridesToSchemaField({
        schemaField: undefined,
        candidateOverrides: undefined,
        destPath: ***REMOVED***field1***REMOVED***
      })

      expect(result).toBe(undefined)
    })
    it(***REMOVED***should return the original schema field when no overrides are provided***REMOVED***, () => {
      const schemaField: IFormField = {
        id: ***REMOVED***field1***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        label: ***REMOVED***Field 1***REMOVED***
      }
      const result = applyOverridesToSchemaField({
        schemaField,
        candidateOverrides: [],
        destPath: ***REMOVED***field1***REMOVED***
      })

      expect({ ...result, destPath: undefined }).toEqual(schemaField)
    })
    it(***REMOVED***should return the original schema field when no matching overrides are found***REMOVED***, () => {
      const schemaField: IFormField = {
        id: ***REMOVED***field1***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        label: ***REMOVED***Field 1***REMOVED***
      }
      const candidateOverrides: IFormFieldOverride[] = [
        { prop: ***REMOVED***field2***REMOVED***, label: ***REMOVED***Updated Field 2***REMOVED*** }
      ]
      const result = applyOverridesToSchemaField({
        schemaField,
        candidateOverrides,
        destPath: ***REMOVED***field1***REMOVED***
      })

      expect({ ...result, destPath: undefined }).toEqual(schemaField)
    })
    it(***REMOVED***should return undefined when no schema field and no matching overrides are found***REMOVED***, () => {
      const result = applyOverridesToSchemaField({
        schemaField: undefined,
        candidateOverrides: [],
        destPath: ***REMOVED***field1***REMOVED***
      })

      expect(result).toBe(undefined)
    })
    it(***REMOVED***should return a valid field if no schemaField but merged overrides can create a valid field***REMOVED***, () => {
      const candidateOverrides: IFormFieldOverride[] = [
        { prop: ***REMOVED***field1***REMOVED***, label: ***REMOVED***Updated Field 1***REMOVED*** },
        { prop: ***REMOVED***field1***REMOVED***, type: ***REMOVED***number***REMOVED***, id: ***REMOVED***field1***REMOVED*** }
      ]
      const result = applyOverridesToSchemaField({
        schemaField: undefined,
        candidateOverrides,
        destPath: ***REMOVED***field1***REMOVED***
      })

      expect(result).not.toBe(undefined)
      expect(result?.label).toEqual(***REMOVED***Updated Field 1***REMOVED***)
      expect(result?.type).toEqual(***REMOVED***number***REMOVED***)
    })
  })
  describe(***REMOVED***mergeFormSections***REMOVED***, () => {
    it(***REMOVED***should merge form sections correctly***REMOVED***, () => {
      const form: IForm = {
        ...mockForm,
        fields: [
          { id: ***REMOVED***field1***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Field 1***REMOVED*** },
          {
            id: ***REMOVED***object1***REMOVED***,
            type: ***REMOVED***object***REMOVED***,
            label: ***REMOVED***Ob 1***REMOVED***,
            fields: [
              { id: ***REMOVED***field1***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Field 1***REMOVED*** },
              { id: ***REMOVED***field2***REMOVED***, type: ***REMOVED***number***REMOVED***, label: ***REMOVED***Field 2***REMOVED*** }
            ]
          },
          {
            id: ***REMOVED***object2***REMOVED***,
            label: ***REMOVED***Ob 2***REMOVED***,
            type: ***REMOVED***object***REMOVED***,
            fields: [
              { id: ***REMOVED***field3***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Field 3***REMOVED*** }
            ]
          }
        ]
      }

      const fieldOverrides: Record<string, IFormFieldOverride[]> = groupOverrideFieldsByProp([
        [
          { label: ***REMOVED***Updated Object Field 1***REMOVED***, prop: ***REMOVED***object1.field1***REMOVED*** },
          { label: ***REMOVED***Updated Object Field 2***REMOVED***, prop: ***REMOVED***object1.field2***REMOVED*** }
        ],
        [
          // { label: ***REMOVED***Updated field 1***REMOVED***, prop: ***REMOVED***field1***REMOVED*** },
          { label: ***REMOVED***Updated Object Field 3***REMOVED***, prop: ***REMOVED***object2.field3***REMOVED*** }
        ]

      ])

      const mergedFormSection = mergeFormSections({
        formSection: form,
        formOverrides: [
          {
            pages: [
              {
                id: ***REMOVED***page1***REMOVED***,
                label: ***REMOVED***Page 1***REMOVED***,
                fields: [
                  { prop: ***REMOVED***object1.field1***REMOVED*** },
                  { prop: ***REMOVED***object1.field2***REMOVED***, type: ***REMOVED***number***REMOVED*** }
                ]
              },
              {
                id: ***REMOVED***page2***REMOVED***,
                label: ***REMOVED***Page 2***REMOVED***,
                fields: [
                  { prop: ***REMOVED***field1***REMOVED*** },
                  { prop: ***REMOVED***object1.field2***REMOVED*** }
                ]
              }

            ]
          }
        ],
        fieldOverrides
      })

      console.log(mergedFormSection)

      expect(mergedFormSection?.pages?.length).toEqual(2)
    })
  })
})
