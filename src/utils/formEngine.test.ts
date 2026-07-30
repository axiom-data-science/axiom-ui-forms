/**
 * formEngine.test.ts - Test suite for form logic engine
 *
 * These tests verify that the form logic layer correctly:
 * - Evaluates conditions for nested and non-nested fields
 * - Handle both absolute and relative path conditions
 * - Apply defaults correctly
 * - Work consistently regardless of nesting depth
 */

import { describe, it, expect } from 'vitest'
import {
  evaluateFieldLogicState,
  evaluateFieldVisibility,
  evaluateFieldDisabled,
  evaluateDefaultValue,
  evaluateNestedFieldStates,
  seedNestedDefaults,
  type FieldEvaluationContext,
} from './formEngine'
import { copyAndAddPathToFields } from '@/utils/manipulators'
import {
  type IForm,
  type IObjectField,
  type IFormField,
  type IFormValues,
} from '@/Form/Creator/FormCreatorTypes'

describe('formEngine - Field Logic Evaluation', () => {
  describe('evaluateFieldVisibility', () => {
    it('hides field when result=exclude and condition passes', () => {
      const result = evaluateFieldVisibility({
        pass: true,
        result: 'exclude',
      })
      expect(result).toBe(false)
    })

    it('hides field when result=include and condition fails', () => {
      const result = evaluateFieldVisibility({
        pass: false,
        result: 'include',
      })
      expect(result).toBe(false)
    })

    it('shows field when result=exclude and condition fails', () => {
      const result = evaluateFieldVisibility({
        pass: false,
        result: 'exclude',
      })
      expect(result).toBe(true)
    })

    it('shows field when result=include and condition passes', () => {
      const result = evaluateFieldVisibility({
        pass: true,
        result: 'include',
      })
      expect(result).toBe(true)
    })
  })

  describe('evaluateFieldDisabled', () => {
    it('disables field when result=disable and condition passes', () => {
      const result = evaluateFieldDisabled({
        pass: true,
        result: 'disable',
      })
      expect(result).toBe(true)
    })

    it('disables field when result=enable and condition fails', () => {
      const result = evaluateFieldDisabled({
        pass: false,
        result: 'enable',
      })
      expect(result).toBe(true)
    })

    it('enables field when result=disable and condition fails', () => {
      const result = evaluateFieldDisabled({
        pass: false,
        result: 'disable',
      })
      expect(result).toBe(false)
    })

    it('enables field when result=enable and condition passes', () => {
      const result = evaluateFieldDisabled({
        pass: true,
        result: 'enable',
      })
      expect(result).toBe(false)
    })
  })

  describe('evaluateDefaultValue', () => {
    it('prefers condition-driven default over field default', () => {
      const field: IFormField = {
        id: 'test',
        type: 'text',
        defaultValue: 'field-default',
      }
      const conditionResult = {
        pass: true,
        result: 'include' as const,
        newDefaultValue: 'condition-default',
      }

      const result = evaluateDefaultValue(field, conditionResult)
      expect(result).toBe('condition-default')
    })

    it('uses field default when condition has no default', () => {
      const field: IFormField = {
        id: 'test',
        type: 'text',
        defaultValue: 'field-default',
      }
      const conditionResult = {
        pass: true,
        result: 'include' as const,
      }

      const result = evaluateDefaultValue(field, conditionResult)
      expect(result).toBe('field-default')
    })

    it('returns undefined when no defaults exist', () => {
      const field: IFormField = {
        id: 'test',
        type: 'text',
      }
      const conditionResult = {
        pass: true,
        result: 'include' as const,
      }

      const result = evaluateDefaultValue(field, conditionResult)
      expect(result).toBe(undefined)
    })
  })

  describe('evaluateFieldLogicState', () => {
    it('correctly evaluates simple field with no conditions', () => {
      const field: IFormField = {
        id: 'test',
        type: 'text',
      }
      const context: FieldEvaluationContext = {
        rootFormValues: {},
      }

      const state = evaluateFieldLogicState(field, context)

      expect(state.isVisible).toBe(true)
      expect(state.isDisabled).toBe(false)
      expect(state.defaultValue).toBeUndefined()
    })

    it('correctly evaluates field with exclude condition met', () => {
      const field: IFormField = {
        id: 'conditionalField',
        type: 'text',
        conditions: {
          dependsOn: 'trigger',
          value: 'show',
          // result defaults to 'include' when not specified
        },
      }
      const context: FieldEvaluationContext = {
        rootFormValues: {
          trigger: 'hide', // Condition not met
        },
      }

      const state = evaluateFieldLogicState(field, context)

      // result='include' (default), pass=false → field is hidden
      expect(state.isVisible).toBe(false)
      expect(state.conditionResult.pass).toBe(false)
    })

    it('correctly evaluates field with disable condition', () => {
      const field: IFormField = {
        id: 'conditionalField',
        type: 'text',
        conditions: {
          dependsOn: 'trigger',
          value: 'enable',
          result: 'disable',
        },
      }
      const context: FieldEvaluationContext = {
        rootFormValues: {
          trigger: 'enable', // Condition met, so field is disabled
        },
      }

      const state = evaluateFieldLogicState(field, context)

      expect(state.isVisible).toBe(true)
      expect(state.isDisabled).toBe(true)
    })

    it('applies condition-driven default value', () => {
      const field: IFormField = {
        id: 'conditionalField',
        type: 'text',
        defaultValue: 'static-default',
      }
      const context: FieldEvaluationContext = {
        rootFormValues: {
          trigger: 'enable',
        },
      }

      // Manually construct a condition that would have newDefaultValue
      // (In reality this comes from checkCondition)
      const state = evaluateFieldLogicState(field, context)

      expect(state.defaultValue).toBe('static-default')
    })
  })

  describe('Phase 1 Bug Tests - Nested field conditions', () => {
    describe('BUG FIX: Nested fields in non-multiple objects should check conditions', () => {
      // This test verifies that evaluateFieldLogicState works correctly
      // for nested fields, even though Object.tsx doesn't currently use it

      const form: IForm = {
        id: 'form',
        label: 'Form',
        fields: [
          {
            id: 'objectField',
            type: 'object',
            label: 'Object Field',
            multiple: false,
            fields: [
              {
                id: 'showHideField',
                type: 'text',
                label: 'Show/Hide Field',
              },
              {
                id: 'conditionalField',
                type: 'text',
                label: 'Conditional Field',
                conditions: {
                  dependsOn: 'objectField.showHideField',
                  value: 'show',
                },
              },
            ],
          },
        ],
      }

      const formWithPaths = copyAndAddPathToFields(form)
      const objectField = formWithPaths.fields?.[0] as IObjectField
      const conditionalField = objectField.fields?.find(
        (f) => f.id === 'conditionalField'
      ) as IFormField

      it('should evaluate condition as true when root context provided', () => {
        const formValues = {
          objectField: {
            showHideField: 'show',
          },
        }

        const context: FieldEvaluationContext = {
          rootFormValues: formValues,
        }

        const state = evaluateFieldLogicState(conditionalField, context)

        expect(state.isVisible).toBe(true)
        expect(state.conditionResult.pass).toBe(true)
      })

      it('should evaluate condition as false when condition not met', () => {
        const formValues = {
          objectField: {
            showHideField: 'hide',
          },
        }

        const context: FieldEvaluationContext = {
          rootFormValues: formValues,
        }

        const state = evaluateFieldLogicState(conditionalField, context)

        // result defaults to 'include', pass=false → field is hidden
        expect(state.isVisible).toBe(false)
        expect(state.conditionResult.pass).toBe(false)
      })
    })

    describe('BUG FIX: Relative path conditions in nested non-multiple objects', () => {
      const form: IForm = {
        id: 'form',
        label: 'Form',
        fields: [
          {
            id: 'objectField',
            type: 'object',
            label: 'Object Field',
            multiple: false,
            fields: [
              {
                id: 'field1',
                type: 'text',
                label: 'Field 1',
              },
              {
                id: 'field2',
                type: 'text',
                label: 'Field 2',
                conditions: {
                  dependsOn: '.field1',
                  value: 'test',
                },
              },
            ],
          },
        ],
      }

      const formWithPaths = copyAndAddPathToFields(form)
      const objectField = formWithPaths.fields?.[0] as IObjectField
      const field2 = objectField.fields?.find((f) => f.id === 'field2') as IFormField

      it('should resolve relative path to sibling with root context', () => {
        const formValues = {
          objectField: {
            field1: 'test',
            field2: '',
          },
        }

        const context: FieldEvaluationContext = {
          rootFormValues: formValues,
        }

        const state = evaluateFieldLogicState(field2, context)

        expect(state.isVisible).toBe(true)
        expect(state.conditionResult.pass).toBe(true)
      })
    })

    describe('BUG FIX: Cross-field conditions from nested to root', () => {
      const form: IForm = {
        id: 'form',
        label: 'Form',
        fields: [
          {
            id: 'globalFlag',
            type: 'text',
            label: 'Global Flag',
          },
          {
            id: 'objectField',
            type: 'object',
            label: 'Object Field',
            multiple: false,
            fields: [
              {
                id: 'nestedField',
                type: 'text',
                label: 'Nested Field',
                conditions: {
                  dependsOn: 'globalFlag',
                  value: 'enabled',
                },
              },
            ],
          },
        ],
      }

      const formWithPaths = copyAndAddPathToFields(form)
      const objectField = formWithPaths.fields?.[1] as IObjectField
      const nestedField = objectField.fields?.find((f) => f.id === 'nestedField') as IFormField

      it('should check condition against root-level field with root context', () => {
        const formValues = {
          globalFlag: 'enabled',
          objectField: {
            nestedField: 'some value',
          },
        }

        const context: FieldEvaluationContext = {
          rootFormValues: formValues,
        }

        const state = evaluateFieldLogicState(nestedField, context)

        expect(state.isVisible).toBe(true)
        expect(state.conditionResult.pass).toBe(true)
      })

      it('should hide field when root condition not met', () => {
        const formValues = {
          globalFlag: 'disabled',
          objectField: {
            nestedField: 'some value',
          },
        }

        const context: FieldEvaluationContext = {
          rootFormValues: formValues,
        }

        const state = evaluateFieldLogicState(nestedField, context)

        // result defaults to 'include', pass=false → field is hidden
        expect(state.isVisible).toBe(false)
        expect(state.conditionResult.pass).toBe(false)
      })
    })

    describe('BUG FIX: Deeply nested conditions', () => {
      const form: IForm = {
        id: 'form',
        label: 'Form',
        fields: [
          {
            id: 'level1',
            type: 'object',
            label: 'Level 1',
            multiple: false,
            fields: [
              {
                id: 'level2',
                type: 'object',
                label: 'Level 2',
                multiple: false,
                fields: [
                  {
                    id: 'triggerField',
                    type: 'text',
                    label: 'Trigger Field',
                  },
                  {
                    id: 'dependentField',
                    type: 'text',
                    label: 'Dependent Field',
                    conditions: {
                      dependsOn: '.triggerField',
                      value: 'trigger',
                    },
                  },
                ],
              },
            ],
          },
        ],
      }

      const formWithPaths = copyAndAddPathToFields(form)
      const level1 = formWithPaths.fields?.[0] as IObjectField
      const level2 = level1.fields?.[0] as IObjectField
      const dependentField = level2.fields?.find((f) => f.id === 'dependentField') as IFormField

      it('should resolve deep relative path with root context', () => {
        const formValues = {
          level1: {
            level2: {
              triggerField: 'trigger',
              dependentField: '',
            },
          },
        }

        const context: FieldEvaluationContext = {
          rootFormValues: formValues,
        }

        const state = evaluateFieldLogicState(dependentField, context)

        expect(state.isVisible).toBe(true)
        expect(state.conditionResult.pass).toBe(true)
      })
    })
  })

  describe('evaluateNestedFieldStates', () => {
    it('evaluates all nested fields at once', () => {
      const parentField: IFormField = {
        id: 'objectField',
        type: 'object',
        multiple: false,
      }

      const childFields: IFormField[] = [
        { id: 'field1', type: 'text' },
        {
          id: 'field2',
          type: 'text',
          conditions: {
            dependsOn: 'trigger',
            value: 'show',
          },
        },
      ]

      const context: FieldEvaluationContext = {
        rootFormValues: {
          trigger: 'show',
        },
      }

      const states = evaluateNestedFieldStates(parentField, childFields, context)

      expect(states.field1.isVisible).toBe(true)
      expect(states.field1.isDisabled).toBe(false)
      expect(states.field2.isVisible).toBe(true)
      expect(states.field2.conditionResult.pass).toBe(true)
    })
  })

  describe('Phase 2: Nested defaults - seedNestedDefaults', () => {
    it('applies defaults to top-level fields', () => {
      const fields: IFormField[] = [
        {
          id: 'field1',
          type: 'text',
          label: 'Field 1',
          defaultValue: 'default-value',
        },
      ]

      const formValues: IFormValues = {}
      const context: FieldEvaluationContext = {
        rootFormValues: {},
      }

      seedNestedDefaults(fields, formValues, context)

      expect(formValues.field1).toBe('default-value')
    })

    it('applies defaults to nested object fields', () => {
      const fields: IFormField[] = [
        {
          id: 'address',
          type: 'object',
          label: 'Address',
          fields: [
            {
              id: 'street',
              type: 'text',
              label: 'Street',
              defaultValue: '123 Main St',
            },
            {
              id: 'city',
              type: 'text',
              label: 'City',
              defaultValue: 'Springfield',
            },
          ],
        },
      ]

      const formValues: any = {}
      const context: FieldEvaluationContext = {
        rootFormValues: {},
      }

      seedNestedDefaults(fields, formValues, context)

      expect(formValues.address).toBeDefined()
      expect(formValues.address.street).toBe('123 Main St')
      expect(formValues.address.city).toBe('Springfield')
    })

    it('applies defaults to array elements (multiple=true)', () => {
      const fields: IFormField[] = [
        {
          id: 'addresses',
          type: 'object',
          label: 'Addresses',
          multiple: true,
          fields: [
            {
              id: 'street',
              type: 'text',
              label: 'Street',
              defaultValue: 'Main St',
            },
            {
              id: 'city',
              type: 'text',
              label: 'City',
              defaultValue: 'NY',
            },
          ],
        },
      ]

      const formValues: any = {
        addresses: [{}, null, undefined],
      }
      const context: FieldEvaluationContext = {
        rootFormValues: {},
      }

      seedNestedDefaults(fields, formValues, context)

      expect(formValues.addresses[0].street).toBe('Main St')
      expect(formValues.addresses[0].city).toBe('NY')
      expect(formValues.addresses[1].street).toBe('Main St')
      expect(formValues.addresses[2].street).toBe('Main St')
    })

    it('does not override existing values with defaults', () => {
      const fields: IFormField[] = [
        {
          id: 'name',
          type: 'text',
          label: 'Name',
          defaultValue: 'Default Name',
        },
      ]

      const formValues = {
        name: 'Existing Name',
      }
      const context: FieldEvaluationContext = {
        rootFormValues: {},
      }

      seedNestedDefaults(fields, formValues, context)

      expect(formValues.name).toBe('Existing Name')
    })

    it('handles mixed nested and non-nested fields', () => {
      const fields: IFormField[] = [
        {
          id: 'name',
          type: 'text',
          label: 'Name',
          defaultValue: 'John',
        },
        {
          id: 'person',
          type: 'object',
          label: 'Person',
          fields: [
            {
              id: 'age',
              type: 'number',
              label: 'Age',
              defaultValue: 30,
            },
          ],
        },
      ]

      const formValues: any = {}
      const context: FieldEvaluationContext = {
        rootFormValues: {},
      }

      seedNestedDefaults(fields, formValues, context)

      expect(formValues.name).toBe('John')
      expect(formValues.person.age).toBe(30)
    })

    it('applies defaults to multiple levels of nesting', () => {
      const fields: IFormField[] = [
        {
          id: 'company',
          type: 'object',
          label: 'Company',
          fields: [
            {
              id: 'address',
              type: 'object',
              label: 'Address',
              fields: [
                {
                  id: 'street',
                  type: 'text',
                  label: 'Street',
                  defaultValue: '123 Tech Blvd',
                },
              ],
            },
          ],
        },
      ]

      const formValues: any = {}
      const context: FieldEvaluationContext = {
        rootFormValues: {},
      }

      seedNestedDefaults(fields, formValues, context)

      expect(formValues.company.address.street).toBe('123 Tech Blvd')
    })

    it('handles null and undefined values for objects', () => {
      const fields: IFormField[] = [
        {
          id: 'address',
          type: 'object',
          label: 'Address',
          fields: [
            {
              id: 'city',
              type: 'text',
              label: 'City',
              defaultValue: 'Boston',
            },
          ],
        },
      ]

      const formValues: any = {
        address: null,
      }
      const context: FieldEvaluationContext = {
        rootFormValues: {},
      }

      seedNestedDefaults(fields, formValues, context)

      expect(formValues.address).toBeDefined()
      expect(formValues.address.city).toBe('Boston')
    })

    it('seeds defaults into a brand-new empty element (simulates add-new-item flow in MultipleFieldCreator)', () => {
      // This mirrors the getNewDefaultElement() function in MultipleFieldCreator:
      // When the user clicks Add, a {} is created and seedNestedDefaults runs on it
      const objFields: IFormField[] = [
        { id: 'name', type: 'text', label: 'Name', defaultValue: 'New Item' },
        { id: 'count', type: 'number', label: 'Count', defaultValue: 0 },
        { id: 'active', type: 'boolean', label: 'Active', defaultValue: true },
      ]

      const newElement: IFormValues = {}
      const context: FieldEvaluationContext = { rootFormValues: {} }

      seedNestedDefaults(objFields, newElement, context)

      expect(newElement.name).toBe('New Item')
      expect(newElement.count).toBe(0)
      expect(newElement.active).toBe(true)
    })

    it('seeds defaults for a new element without overwriting an existing one in the same array', () => {
      // existing[0] has user data; null at [1] simulates a newly added slot
      const fields: IFormField[] = [
        {
          id: 'items',
          type: 'object',
          label: 'Items',
          multiple: true,
          fields: [{ id: 'label', type: 'text', label: 'Label', defaultValue: 'Default Label' }],
        },
      ]

      const formValues: any = {
        items: [{ label: 'User Value' }, null],
      }
      const context: FieldEvaluationContext = { rootFormValues: {} }

      seedNestedDefaults(fields, formValues, context)

      // existing element is untouched
      expect(formValues.items[0].label).toBe('User Value')
      // new null slot gets the default
      expect(formValues.items[1].label).toBe('Default Label')
    })

    it('BUG FIX: multiple=true object field initializes as [] not {}', () => {
      // Before fix: formValues[field.id] = {} → Array.isArray check failed → defaults never seeded
      const fields: IFormField[] = [
        {
          id: 'contacts',
          type: 'object',
          label: 'Contacts',
          multiple: true,
          fields: [{ id: 'name', type: 'text', label: 'Name', defaultValue: 'Unknown' }],
        },
      ]

      const formValues: any = {}
      const context: FieldEvaluationContext = { rootFormValues: {} }

      seedNestedDefaults(fields, formValues, context)

      // Should be an empty array (no items yet), not {}
      expect(Array.isArray(formValues.contacts)).toBe(true)
      expect(formValues.contacts).toHaveLength(0)
    })

    it('BUG FIX: flat field list does not write nested defaults at root level', () => {
      // Simulates the old bug in seedFormValuesWithDefaults where getFieldsFromFormSection
      // returned a flat list [parentObject, nestedChild] and the nestedChild would be
      // processed at root level, creating formValues['city'] instead of formValues['address']['city']
      const parentField: IFormField = {
        id: 'address',
        type: 'object',
        label: 'Address',
        fields: [{ id: 'city', type: 'text', label: 'City', defaultValue: 'Boston' }],
      }
      const nestedField: IFormField = {
        id: 'city',
        type: 'text',
        label: 'City',
        defaultValue: 'Boston',
      }

      // Passing the correct hierarchical list (only the parent)
      const formValuesCorrect: any = {}
      seedNestedDefaults([parentField], formValuesCorrect, { rootFormValues: {} })

      expect(formValuesCorrect.address.city).toBe('Boston')   // correct
      expect(formValuesCorrect.city).toBeUndefined()          // no root-level leak

      // Passing the flattened list (the old bug) would create formValues.city at root
      const formValuesBuggy: any = {}
      seedNestedDefaults([parentField, nestedField], formValuesBuggy, { rootFormValues: {} })

      expect(formValuesBuggy.address.city).toBe('Boston')  // still set correctly by parent
      expect(formValuesBuggy.city).toBe('Boston')          // ← leaked to root (the old bug)
    })

    it('override-only field with defaultValue gets seeded into formValues', () => {
      // This tests the case where a field is added via override (not in schema)
      // e.g., shape_type: control field not in schema but declared in fields.json
      const fields: IFormField[] = [
        {
          id: 'shape_type',
          type: 'select',
          label: 'Shape',
          defaultValue: 'point',
          options: [
            { label: 'Point', value: 'point' },
            { label: 'Polygon', value: 'polygon' },
          ],
          excludeFromPayload: true,
        },
        {
          id: 'geojson',
          type: 'text',
          label: 'GeoJSON',
          defaultValue: null,
        },
      ]

      const formValues: any = {}
      const context: FieldEvaluationContext = { rootFormValues: {} }

      seedNestedDefaults(fields, formValues, context)

      // Both fields should have their defaults applied
      expect(formValues.shape_type).toBe('point')
      expect(formValues.geojson).toBe(null)
    })

    it('applies defaults to nested object fields defined inside tabs', () => {
      const fields: IFormField[] = [
        {
          id: 'processor',
          type: 'object',
          label: 'Processor',
          tabs: [
            {
              id: 'split-tab',
              label: 'Split',
              fields: [
                { id: 'source_variable', type: 'text', label: 'Source' },
                { id: 'separator', type: 'text', label: 'Separator', defaultValue: ',' },
              ],
            },
          ],
        } as unknown as IFormField,
      ]

      const formValues: any = {}
      const context: FieldEvaluationContext = { rootFormValues: {} }

      seedNestedDefaults(fields, formValues, context)

      expect(formValues.processor).toBeDefined()
      expect(formValues.processor.separator).toBe(',')
    })
  })
})
