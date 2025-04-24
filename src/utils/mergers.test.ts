import { describe, it, expect } from 'vitest'
import { applyOverridesToSchemaField, buildFieldMapFromForm, groupOverrideFieldsByProp, mergeFields, mergeFormSections } from './mergers'
import { type IFormField, type IForm, type IFormFieldOverride, type IObjectField } from '@/Form/Creator/FormCreatorTypes'

const mockForm: IForm = {
  id: 'testForm',
  label: 'Test Form'
}

const mockTextField: IFormField = {
  id: 'textField',
  type: 'text',
  label: 'Text field'
}
const mockNumberField: IFormField = {
  id: 'numberField',
  type: 'number',
  label: 'Number field'
}

const mockObjectField: IFormField = {
  id: 'objectField',
  type: 'object',
  label: 'Object field',
  fields: [
    {
      id: 'nestedField1',
      type: 'text',
      label: 'Nested field 1'
    },
    {
      id: 'nestedField2',
      type: 'number',
      label: 'Nested field 2'
    }
  ]
}

describe('mergers.ts', () => {
  describe('groupOverrideFieldsByProp', () => {
    it('should group overrides by prop', () => {
      const overrides: IFormFieldOverride[][] = [
        [
          { prop: 'field1', label: 'Updated Field 1' },
          { prop: 'field2', label: 'Updated Field 2' }
        ],
        [
          { prop: 'field1', type: 'number' }
        ]
      ]
      const grouped = groupOverrideFieldsByProp(overrides)
      expect(grouped).toEqual({
        field1: [
          { prop: 'field1', label: 'Updated Field 1' },
          { prop: 'field1', type: 'number' }
        ],
        field2: [
          { prop: 'field2', label: 'Updated Field 2' }
        ]
      })
    })
  })
  describe('buildFieldMapFromForm', () => {
    it('should return an empty map for an empty form', () => {
      const result = buildFieldMapFromForm({ ...mockForm })
      expect(result).toEqual({})
    })

    it('should handle forms with multiple nested object', () => {
      const result = buildFieldMapFromForm({
        ...mockForm,
        fields: [
          { ...mockTextField },
          { ...mockNumberField },
          { ...mockObjectField }
        ]
      })

      expect(result?.['objectField.nestedField2']?.id).toEqual('nestedField2')
      expect(result?.['objectField.nestedField1']?.id).toEqual('nestedField1')
      expect(result?.textField?.id).toEqual('textField')
      expect(result?.numberField?.id).toEqual('numberField')
    })
    it('should correctly ignore parent object ids that are marked to skip', () => {
      const result = buildFieldMapFromForm({
        ...mockForm,
        fields: [
          {
            id: 'objectField',
            type: 'object',
            label: 'Object field',
            skip_path: true,
            fields: [
              mockTextField,
              mockNumberField
            ]
          }
        ]
      })

      expect(result?.textField?.id).toEqual('textField')
      expect(result?.numberField?.id).toEqual('numberField')
    })
    it('should ignore page or wizard path ids when constructing paths', () => {
      const result = buildFieldMapFromForm({
        ...mockForm,
        pages: [
          {
            id: 'page1',
            label: 'Page 1',
            fields: [
              mockTextField,
              mockNumberField
            ]
          }
        ]
      })

      expect(result?.textField?.id).toEqual('textField')
      expect(result?.numberField?.id).toEqual('numberField')
    })
  })

  describe('mergeFields', () => {
    it('should apply multiple overrides to a single field', () => {
      const fieldOverrides = groupOverrideFieldsByProp([
        [{ label: 'Updated text field', prop: 'textField' }],
        [{ label: 'Updated Field 1', prop: 'objectField.nestedField1' }],
        [{ type: 'number', prop: 'objectField.nestedField1' }]
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
      expect(resultMap?.textField?.label).toEqual('Updated text field')

      const objectFieldResult = resultMap?.objectField as IObjectField ?? undefined
      expect(objectFieldResult).not.toBe(undefined)
      const objectFieldFieldsMap = Object.fromEntries(objectFieldResult.fields?.map(field => [field.id, field]))
      expect(objectFieldFieldsMap?.nestedField1).not.toBe(undefined)
      expect(objectFieldFieldsMap?.nestedField1?.label).toEqual('Updated Field 1')
      expect(objectFieldFieldsMap?.nestedField1?.type).toEqual('number')
    })

    it('should handle missing overrides gracefully', () => {
      const form: IForm = {
        ...mockForm,
        fields: [
          {
            id: 'section1',
            type: 'object',
            fields: [
              { id: 'field1', label: 'Field 1', type: 'text' },
              { id: 'field2', label: 'Field 2', type: 'text' }
            ]

          }
        ]

      }

      const fieldOverrides: Record<string, IFormFieldOverride[]> = groupOverrideFieldsByProp([
        [{ label: 'Updated Field 1', prop: 'section1.field1' }]
      ])

      const result = mergeFields({
        form,
        fieldOverrides
      })

      const resultMap = Object.fromEntries(result.map(field => [field.id, field]))
      const section1 = resultMap?.section1 as IObjectField ?? undefined

      console.log(section1)
      expect(section1).not.toBe(undefined)
      expect(section1?.fields?.find(f => f.id === 'field1')?.label).toEqual('Updated Field 1')
      expect(section1?.fields?.find(f => f.id === 'field2')?.label).toEqual('Field 2')
    })
    it('should handle empty form.fields correctly', () => {
      const form: IForm = {
        ...mockForm,
        fields: undefined

      }

      const fieldOverrides: Record<string, IFormFieldOverride[]> = groupOverrideFieldsByProp([
        [{ label: 'Updated Field 1', prop: 'section1.field1' }]
      ])

      const result = mergeFields({
        form,
        fieldOverrides
      })

      expect(result).toEqual([])
    })
  })
  describe('applyOverridesToSchemaField', () => {
    it('should apply overrides to a schema field', () => {
      const schemaField: IFormField = {
        id: 'field1',
        type: 'text',
        label: 'Field 1'
      }
      const candidateOverrides: IFormFieldOverride[] = [
        { prop: 'field1', label: 'Updated Field 1' },
        { prop: 'field1', type: 'number' }
      ]
      const result = applyOverridesToSchemaField({
        schemaField,
        candidateOverrides,
        destPath: 'field1'
      })

      expect(result).not.toBe(undefined)
      expect(result?.label).toEqual('Updated Field 1')
      expect(result?.type).toEqual('number')
    })
    it('should return undefined when schema field and overrides are both undefined', () => {
      const result = applyOverridesToSchemaField({
        schemaField: undefined,
        candidateOverrides: undefined,
        destPath: 'field1'
      })

      expect(result).toBe(undefined)
    })
    it('should return the original schema field when no overrides are provided', () => {
      const schemaField: IFormField = {
        id: 'field1',
        type: 'text',
        label: 'Field 1'
      }
      const result = applyOverridesToSchemaField({
        schemaField,
        candidateOverrides: [],
        destPath: 'field1'
      })

      expect({...result, destPath: undefined}).toEqual(schemaField)
    })
    it('should return the original schema field when no matching overrides are found', () => {
      const schemaField: IFormField = {
        id: 'field1',
        type: 'text',
        label: 'Field 1'
      }
      const candidateOverrides: IFormFieldOverride[] = [
        { prop: 'field2', label: 'Updated Field 2' }
      ]
      const result = applyOverridesToSchemaField({
        schemaField,
        candidateOverrides,
        destPath: 'field1'
      })

      expect({ ...result, destPath: undefined }).toEqual(schemaField)
    })
    it('should return undefined when no schema field and no matching overrides are found', () => {
      const result = applyOverridesToSchemaField({
        schemaField: undefined,
        candidateOverrides: [],
        destPath: 'field1'
      })

      expect(result).toBe(undefined)
    })
    it('should return a valid field if no schemaField but merged overrides can create a valid field', () => {
      const candidateOverrides: IFormFieldOverride[] = [
        { prop: 'field1', label: 'Updated Field 1' },
        { prop: 'field1', type: 'number', id: 'field1' }
      ]
      const result = applyOverridesToSchemaField({
        schemaField: undefined,
        candidateOverrides,
        destPath: 'field1'
      })

      expect(result).not.toBe(undefined)
      expect(result?.label).toEqual('Updated Field 1')
      expect(result?.type).toEqual('number')
    })
  })
  describe('mergeFormSections', () => {
    it('should merge form sections correctly', () => {
      const form: IForm = {
        ...mockForm,
        fields: [
          { id: 'field1', type: 'text', label: 'Field 1' },
          {
            id: 'object1',
            type: 'object',
            label: 'Ob 1',
            fields: [
              { id: 'field1', type: 'text', label: 'Field 1' },
              { id: 'field2', type: 'number', label: 'Field 2' }
            ]
          },
          {
            id: 'object2',
            label: 'Ob 2',
            type: 'object',
            fields: [
              { id: 'field3', type: 'text', label: 'Field 3' }
            ]
          }
        ]
      }

      const fieldOverrides: Record<string, IFormFieldOverride[]> = groupOverrideFieldsByProp([
        [
          { label: 'Updated Object Field 1', prop: 'object1.field1' },
          { label: 'Updated Object Field 2', prop: 'object1.field2' }
        ],
        [
          // { label: 'Updated field 1', prop: 'field1' },
          { label: 'Updated Object Field 3', prop: 'object2.field3' }
        ]

      ])

      const mergedFormSection = mergeFormSections({
        formSection: form,
        formOverrides: [
          {
            pages: [
              {
                id: 'page1',
                label: 'Page 1',
                fields: [
                  { prop: 'object1.field1' },
                  { prop: 'object1.field2', type: 'number' }
                ]
              },
              {
                id: 'page2',
                label: 'Page 2',
                fields: [
                  { prop: 'field1' },
                  { prop: 'object1.field2' }
                ]
              }

            ]
          }
        ],
        fieldOverrides
      })

      // console.log(mergedFormSection)

      // expect(mergedForm.length).toEqual(3)
    })
  })
})
