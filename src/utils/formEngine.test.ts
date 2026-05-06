/**
 * formEngine.test.ts - Test suite for form logic engine
 *
 * These tests verify that the form logic layer correctly:
 * - Evaluates conditions for nested and non-nested fields
 * - Handle both absolute and relative path conditions
 * - Apply defaults correctly
 * - Work consistently regardless of nesting depth
 */

import { describe, it, expect } from ***REMOVED***vitest***REMOVED***
import {
  evaluateFieldLogicState,
  evaluateFieldVisibility,
  evaluateFieldDisabled,
  evaluateDefaultValue,
  evaluateNestedFieldStates,
  seedNestedDefaults,
  type FieldEvaluationContext,
} from ***REMOVED***./formEngine***REMOVED***
import { copyAndAddPathToFields } from ***REMOVED***@/utils/manipulators***REMOVED***
import {
  type IForm,
  type IObjectField,
  type IFormField,
  type IFormValues,
} from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

describe(***REMOVED***formEngine - Field Logic Evaluation***REMOVED***, () => {
  describe(***REMOVED***evaluateFieldVisibility***REMOVED***, () => {
    it(***REMOVED***hides field when result=exclude and condition passes***REMOVED***, () => {
      const result = evaluateFieldVisibility({
        pass: true,
        result: ***REMOVED***exclude***REMOVED***,
      })
      expect(result).toBe(false)
    })

    it(***REMOVED***hides field when result=include and condition fails***REMOVED***, () => {
      const result = evaluateFieldVisibility({
        pass: false,
        result: ***REMOVED***include***REMOVED***,
      })
      expect(result).toBe(false)
    })

    it(***REMOVED***shows field when result=exclude and condition fails***REMOVED***, () => {
      const result = evaluateFieldVisibility({
        pass: false,
        result: ***REMOVED***exclude***REMOVED***,
      })
      expect(result).toBe(true)
    })

    it(***REMOVED***shows field when result=include and condition passes***REMOVED***, () => {
      const result = evaluateFieldVisibility({
        pass: true,
        result: ***REMOVED***include***REMOVED***,
      })
      expect(result).toBe(true)
    })
  })

  describe(***REMOVED***evaluateFieldDisabled***REMOVED***, () => {
    it(***REMOVED***disables field when result=disable and condition passes***REMOVED***, () => {
      const result = evaluateFieldDisabled({
        pass: true,
        result: ***REMOVED***disable***REMOVED***,
      })
      expect(result).toBe(true)
    })

    it(***REMOVED***disables field when result=enable and condition fails***REMOVED***, () => {
      const result = evaluateFieldDisabled({
        pass: false,
        result: ***REMOVED***enable***REMOVED***,
      })
      expect(result).toBe(true)
    })

    it(***REMOVED***enables field when result=disable and condition fails***REMOVED***, () => {
      const result = evaluateFieldDisabled({
        pass: false,
        result: ***REMOVED***disable***REMOVED***,
      })
      expect(result).toBe(false)
    })

    it(***REMOVED***enables field when result=enable and condition passes***REMOVED***, () => {
      const result = evaluateFieldDisabled({
        pass: true,
        result: ***REMOVED***enable***REMOVED***,
      })
      expect(result).toBe(false)
    })
  })

  describe(***REMOVED***evaluateDefaultValue***REMOVED***, () => {
    it(***REMOVED***prefers condition-driven default over field default***REMOVED***, () => {
      const field: IFormField = {
        id: ***REMOVED***test***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        defaultValue: ***REMOVED***field-default***REMOVED***,
      }
      const conditionResult = {
        pass: true,
        result: ***REMOVED***include***REMOVED*** as const,
        newDefaultValue: ***REMOVED***condition-default***REMOVED***,
      }

      const result = evaluateDefaultValue(field, conditionResult)
      expect(result).toBe(***REMOVED***condition-default***REMOVED***)
    })

    it(***REMOVED***uses field default when condition has no default***REMOVED***, () => {
      const field: IFormField = {
        id: ***REMOVED***test***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        defaultValue: ***REMOVED***field-default***REMOVED***,
      }
      const conditionResult = {
        pass: true,
        result: ***REMOVED***include***REMOVED*** as const,
      }

      const result = evaluateDefaultValue(field, conditionResult)
      expect(result).toBe(***REMOVED***field-default***REMOVED***)
    })

    it(***REMOVED***returns undefined when no defaults exist***REMOVED***, () => {
      const field: IFormField = {
        id: ***REMOVED***test***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
      }
      const conditionResult = {
        pass: true,
        result: ***REMOVED***include***REMOVED*** as const,
      }

      const result = evaluateDefaultValue(field, conditionResult)
      expect(result).toBe(undefined)
    })
  })

  describe(***REMOVED***evaluateFieldLogicState***REMOVED***, () => {
    it(***REMOVED***correctly evaluates simple field with no conditions***REMOVED***, () => {
      const field: IFormField = {
        id: ***REMOVED***test***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
      }
      const context: FieldEvaluationContext = {
        rootFormValues: {},
      }

      const state = evaluateFieldLogicState(field, context)

      expect(state.isVisible).toBe(true)
      expect(state.isDisabled).toBe(false)
      expect(state.defaultValue).toBeUndefined()
    })

    it(***REMOVED***correctly evaluates field with exclude condition met***REMOVED***, () => {
      const field: IFormField = {
        id: ***REMOVED***conditionalField***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        conditions: {
          dependsOn: ***REMOVED***trigger***REMOVED***,
          value: ***REMOVED***show***REMOVED***,
          // result defaults to ***REMOVED***include***REMOVED*** when not specified
        },
      }
      const context: FieldEvaluationContext = {
        rootFormValues: {
          trigger: ***REMOVED***hide***REMOVED***, // Condition not met
        },
      }

      const state = evaluateFieldLogicState(field, context)

      // result=***REMOVED***include***REMOVED*** (default), pass=false → field is hidden
      expect(state.isVisible).toBe(false)
      expect(state.conditionResult.pass).toBe(false)
    })

    it(***REMOVED***correctly evaluates field with disable condition***REMOVED***, () => {
      const field: IFormField = {
        id: ***REMOVED***conditionalField***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        conditions: {
          dependsOn: ***REMOVED***trigger***REMOVED***,
          value: ***REMOVED***enable***REMOVED***,
          result: ***REMOVED***disable***REMOVED***,
        },
      }
      const context: FieldEvaluationContext = {
        rootFormValues: {
          trigger: ***REMOVED***enable***REMOVED***, // Condition met, so field is disabled
        },
      }

      const state = evaluateFieldLogicState(field, context)

      expect(state.isVisible).toBe(true)
      expect(state.isDisabled).toBe(true)
    })

    it(***REMOVED***applies condition-driven default value***REMOVED***, () => {
      const field: IFormField = {
        id: ***REMOVED***conditionalField***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        defaultValue: ***REMOVED***static-default***REMOVED***,
      }
      const context: FieldEvaluationContext = {
        rootFormValues: {
          trigger: ***REMOVED***enable***REMOVED***,
        },
      }

      // Manually construct a condition that would have newDefaultValue
      // (In reality this comes from checkCondition)
      const state = evaluateFieldLogicState(field, context)

      expect(state.defaultValue).toBe(***REMOVED***static-default***REMOVED***)
    })
  })

  describe(***REMOVED***Phase 1 Bug Tests - Nested field conditions***REMOVED***, () => {
    describe(***REMOVED***BUG FIX: Nested fields in non-multiple objects should check conditions***REMOVED***, () => {
      // This test verifies that evaluateFieldLogicState works correctly
      // for nested fields, even though Object.tsx doesn***REMOVED***t currently use it

      const form: IForm = {
        id: ***REMOVED***form***REMOVED***,
        label: ***REMOVED***Form***REMOVED***,
        fields: [
          {
            id: ***REMOVED***objectField***REMOVED***,
            type: ***REMOVED***object***REMOVED***,
            label: ***REMOVED***Object Field***REMOVED***,
            multiple: false,
            fields: [
              {
                id: ***REMOVED***showHideField***REMOVED***,
                type: ***REMOVED***text***REMOVED***,
                label: ***REMOVED***Show/Hide Field***REMOVED***,
              },
              {
                id: ***REMOVED***conditionalField***REMOVED***,
                type: ***REMOVED***text***REMOVED***,
                label: ***REMOVED***Conditional Field***REMOVED***,
                conditions: {
                  dependsOn: ***REMOVED***objectField.showHideField***REMOVED***,
                  value: ***REMOVED***show***REMOVED***,
                },
              },
            ],
          },
        ],
      }

      const formWithPaths = copyAndAddPathToFields(form)
      const objectField = formWithPaths.fields?.[0] as IObjectField
      const conditionalField = objectField.fields?.find(
        (f) => f.id === ***REMOVED***conditionalField***REMOVED***
      ) as IFormField

      it(***REMOVED***should evaluate condition as true when root context provided***REMOVED***, () => {
        const formValues = {
          objectField: {
            showHideField: ***REMOVED***show***REMOVED***,
          },
        }

        const context: FieldEvaluationContext = {
          rootFormValues: formValues,
        }

        const state = evaluateFieldLogicState(conditionalField, context)

        expect(state.isVisible).toBe(true)
        expect(state.conditionResult.pass).toBe(true)
      })

      it(***REMOVED***should evaluate condition as false when condition not met***REMOVED***, () => {
        const formValues = {
          objectField: {
            showHideField: ***REMOVED***hide***REMOVED***,
          },
        }

        const context: FieldEvaluationContext = {
          rootFormValues: formValues,
        }

        const state = evaluateFieldLogicState(conditionalField, context)

        // result defaults to ***REMOVED***include***REMOVED***, pass=false → field is hidden
        expect(state.isVisible).toBe(false)
        expect(state.conditionResult.pass).toBe(false)
      })
    })

    describe(***REMOVED***BUG FIX: Relative path conditions in nested non-multiple objects***REMOVED***, () => {
      const form: IForm = {
        id: ***REMOVED***form***REMOVED***,
        label: ***REMOVED***Form***REMOVED***,
        fields: [
          {
            id: ***REMOVED***objectField***REMOVED***,
            type: ***REMOVED***object***REMOVED***,
            label: ***REMOVED***Object Field***REMOVED***,
            multiple: false,
            fields: [
              {
                id: ***REMOVED***field1***REMOVED***,
                type: ***REMOVED***text***REMOVED***,
                label: ***REMOVED***Field 1***REMOVED***,
              },
              {
                id: ***REMOVED***field2***REMOVED***,
                type: ***REMOVED***text***REMOVED***,
                label: ***REMOVED***Field 2***REMOVED***,
                conditions: {
                  dependsOn: ***REMOVED***.field1***REMOVED***,
                  value: ***REMOVED***test***REMOVED***,
                },
              },
            ],
          },
        ],
      }

      const formWithPaths = copyAndAddPathToFields(form)
      const objectField = formWithPaths.fields?.[0] as IObjectField
      const field2 = objectField.fields?.find((f) => f.id === ***REMOVED***field2***REMOVED***) as IFormField

      it(***REMOVED***should resolve relative path to sibling with root context***REMOVED***, () => {
        const formValues = {
          objectField: {
            field1: ***REMOVED***test***REMOVED***,
            field2: ***REMOVED******REMOVED***,
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

    describe(***REMOVED***BUG FIX: Cross-field conditions from nested to root***REMOVED***, () => {
      const form: IForm = {
        id: ***REMOVED***form***REMOVED***,
        label: ***REMOVED***Form***REMOVED***,
        fields: [
          {
            id: ***REMOVED***globalFlag***REMOVED***,
            type: ***REMOVED***text***REMOVED***,
            label: ***REMOVED***Global Flag***REMOVED***,
          },
          {
            id: ***REMOVED***objectField***REMOVED***,
            type: ***REMOVED***object***REMOVED***,
            label: ***REMOVED***Object Field***REMOVED***,
            multiple: false,
            fields: [
              {
                id: ***REMOVED***nestedField***REMOVED***,
                type: ***REMOVED***text***REMOVED***,
                label: ***REMOVED***Nested Field***REMOVED***,
                conditions: {
                  dependsOn: ***REMOVED***globalFlag***REMOVED***,
                  value: ***REMOVED***enabled***REMOVED***,
                },
              },
            ],
          },
        ],
      }

      const formWithPaths = copyAndAddPathToFields(form)
      const objectField = formWithPaths.fields?.[1] as IObjectField
      const nestedField = objectField.fields?.find((f) => f.id === ***REMOVED***nestedField***REMOVED***) as IFormField

      it(***REMOVED***should check condition against root-level field with root context***REMOVED***, () => {
        const formValues = {
          globalFlag: ***REMOVED***enabled***REMOVED***,
          objectField: {
            nestedField: ***REMOVED***some value***REMOVED***,
          },
        }

        const context: FieldEvaluationContext = {
          rootFormValues: formValues,
        }

        const state = evaluateFieldLogicState(nestedField, context)

        expect(state.isVisible).toBe(true)
        expect(state.conditionResult.pass).toBe(true)
      })

      it(***REMOVED***should hide field when root condition not met***REMOVED***, () => {
        const formValues = {
          globalFlag: ***REMOVED***disabled***REMOVED***,
          objectField: {
            nestedField: ***REMOVED***some value***REMOVED***,
          },
        }

        const context: FieldEvaluationContext = {
          rootFormValues: formValues,
        }

        const state = evaluateFieldLogicState(nestedField, context)

        // result defaults to ***REMOVED***include***REMOVED***, pass=false → field is hidden
        expect(state.isVisible).toBe(false)
        expect(state.conditionResult.pass).toBe(false)
      })
    })

    describe(***REMOVED***BUG FIX: Deeply nested conditions***REMOVED***, () => {
      const form: IForm = {
        id: ***REMOVED***form***REMOVED***,
        label: ***REMOVED***Form***REMOVED***,
        fields: [
          {
            id: ***REMOVED***level1***REMOVED***,
            type: ***REMOVED***object***REMOVED***,
            label: ***REMOVED***Level 1***REMOVED***,
            multiple: false,
            fields: [
              {
                id: ***REMOVED***level2***REMOVED***,
                type: ***REMOVED***object***REMOVED***,
                label: ***REMOVED***Level 2***REMOVED***,
                multiple: false,
                fields: [
                  {
                    id: ***REMOVED***triggerField***REMOVED***,
                    type: ***REMOVED***text***REMOVED***,
                    label: ***REMOVED***Trigger Field***REMOVED***,
                  },
                  {
                    id: ***REMOVED***dependentField***REMOVED***,
                    type: ***REMOVED***text***REMOVED***,
                    label: ***REMOVED***Dependent Field***REMOVED***,
                    conditions: {
                      dependsOn: ***REMOVED***.triggerField***REMOVED***,
                      value: ***REMOVED***trigger***REMOVED***,
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
      const dependentField = level2.fields?.find((f) => f.id === ***REMOVED***dependentField***REMOVED***) as IFormField

      it(***REMOVED***should resolve deep relative path with root context***REMOVED***, () => {
        const formValues = {
          level1: {
            level2: {
              triggerField: ***REMOVED***trigger***REMOVED***,
              dependentField: ***REMOVED******REMOVED***,
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

  describe(***REMOVED***evaluateNestedFieldStates***REMOVED***, () => {
    it(***REMOVED***evaluates all nested fields at once***REMOVED***, () => {
      const parentField: IFormField = {
        id: ***REMOVED***objectField***REMOVED***,
        type: ***REMOVED***object***REMOVED***,
        multiple: false,
      }

      const childFields: IFormField[] = [
        { id: ***REMOVED***field1***REMOVED***, type: ***REMOVED***text***REMOVED*** },
        {
          id: ***REMOVED***field2***REMOVED***,
          type: ***REMOVED***text***REMOVED***,
          conditions: {
            dependsOn: ***REMOVED***trigger***REMOVED***,
            value: ***REMOVED***show***REMOVED***,
          },
        },
      ]

      const context: FieldEvaluationContext = {
        rootFormValues: {
          trigger: ***REMOVED***show***REMOVED***,
        },
      }

      const states = evaluateNestedFieldStates(parentField, childFields, context)

      expect(states.field1.isVisible).toBe(true)
      expect(states.field1.isDisabled).toBe(false)
      expect(states.field2.isVisible).toBe(true)
      expect(states.field2.conditionResult.pass).toBe(true)
    })
  })

  describe(***REMOVED***Phase 2: Nested defaults - seedNestedDefaults***REMOVED***, () => {
    it(***REMOVED***applies defaults to top-level fields***REMOVED***, () => {
      const fields: IFormField[] = [
        {
          id: ***REMOVED***field1***REMOVED***,
          type: ***REMOVED***text***REMOVED***,
          label: ***REMOVED***Field 1***REMOVED***,
          defaultValue: ***REMOVED***default-value***REMOVED***,
        },
      ]

      const formValues: IFormValues = {}
      const context: FieldEvaluationContext = {
        rootFormValues: {},
      }

      seedNestedDefaults(fields, formValues, context)

      expect(formValues.field1).toBe(***REMOVED***default-value***REMOVED***)
    })

    it(***REMOVED***applies defaults to nested object fields***REMOVED***, () => {
      const fields: IFormField[] = [
        {
          id: ***REMOVED***address***REMOVED***,
          type: ***REMOVED***object***REMOVED***,
          label: ***REMOVED***Address***REMOVED***,
          fields: [
            {
              id: ***REMOVED***street***REMOVED***,
              type: ***REMOVED***text***REMOVED***,
              label: ***REMOVED***Street***REMOVED***,
              defaultValue: ***REMOVED***123 Main St***REMOVED***,
            },
            {
              id: ***REMOVED***city***REMOVED***,
              type: ***REMOVED***text***REMOVED***,
              label: ***REMOVED***City***REMOVED***,
              defaultValue: ***REMOVED***Springfield***REMOVED***,
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
      expect(formValues.address.street).toBe(***REMOVED***123 Main St***REMOVED***)
      expect(formValues.address.city).toBe(***REMOVED***Springfield***REMOVED***)
    })

    it(***REMOVED***applies defaults to array elements (multiple=true)***REMOVED***, () => {
      const fields: IFormField[] = [
        {
          id: ***REMOVED***addresses***REMOVED***,
          type: ***REMOVED***object***REMOVED***,
          label: ***REMOVED***Addresses***REMOVED***,
          multiple: true,
          fields: [
            {
              id: ***REMOVED***street***REMOVED***,
              type: ***REMOVED***text***REMOVED***,
              label: ***REMOVED***Street***REMOVED***,
              defaultValue: ***REMOVED***Main St***REMOVED***,
            },
            {
              id: ***REMOVED***city***REMOVED***,
              type: ***REMOVED***text***REMOVED***,
              label: ***REMOVED***City***REMOVED***,
              defaultValue: ***REMOVED***NY***REMOVED***,
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

      expect(formValues.addresses[0].street).toBe(***REMOVED***Main St***REMOVED***)
      expect(formValues.addresses[0].city).toBe(***REMOVED***NY***REMOVED***)
      expect(formValues.addresses[1].street).toBe(***REMOVED***Main St***REMOVED***)
      expect(formValues.addresses[2].street).toBe(***REMOVED***Main St***REMOVED***)
    })

    it(***REMOVED***does not override existing values with defaults***REMOVED***, () => {
      const fields: IFormField[] = [
        {
          id: ***REMOVED***name***REMOVED***,
          type: ***REMOVED***text***REMOVED***,
          label: ***REMOVED***Name***REMOVED***,
          defaultValue: ***REMOVED***Default Name***REMOVED***,
        },
      ]

      const formValues = {
        name: ***REMOVED***Existing Name***REMOVED***,
      }
      const context: FieldEvaluationContext = {
        rootFormValues: {},
      }

      seedNestedDefaults(fields, formValues, context)

      expect(formValues.name).toBe(***REMOVED***Existing Name***REMOVED***)
    })

    it(***REMOVED***handles mixed nested and non-nested fields***REMOVED***, () => {
      const fields: IFormField[] = [
        {
          id: ***REMOVED***name***REMOVED***,
          type: ***REMOVED***text***REMOVED***,
          label: ***REMOVED***Name***REMOVED***,
          defaultValue: ***REMOVED***John***REMOVED***,
        },
        {
          id: ***REMOVED***person***REMOVED***,
          type: ***REMOVED***object***REMOVED***,
          label: ***REMOVED***Person***REMOVED***,
          fields: [
            {
              id: ***REMOVED***age***REMOVED***,
              type: ***REMOVED***number***REMOVED***,
              label: ***REMOVED***Age***REMOVED***,
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

      expect(formValues.name).toBe(***REMOVED***John***REMOVED***)
      expect(formValues.person.age).toBe(30)
    })

    it(***REMOVED***applies defaults to multiple levels of nesting***REMOVED***, () => {
      const fields: IFormField[] = [
        {
          id: ***REMOVED***company***REMOVED***,
          type: ***REMOVED***object***REMOVED***,
          label: ***REMOVED***Company***REMOVED***,
          fields: [
            {
              id: ***REMOVED***address***REMOVED***,
              type: ***REMOVED***object***REMOVED***,
              label: ***REMOVED***Address***REMOVED***,
              fields: [
                {
                  id: ***REMOVED***street***REMOVED***,
                  type: ***REMOVED***text***REMOVED***,
                  label: ***REMOVED***Street***REMOVED***,
                  defaultValue: ***REMOVED***123 Tech Blvd***REMOVED***,
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

      expect(formValues.company.address.street).toBe(***REMOVED***123 Tech Blvd***REMOVED***)
    })

    it(***REMOVED***handles null and undefined values for objects***REMOVED***, () => {
      const fields: IFormField[] = [
        {
          id: ***REMOVED***address***REMOVED***,
          type: ***REMOVED***object***REMOVED***,
          label: ***REMOVED***Address***REMOVED***,
          fields: [
            {
              id: ***REMOVED***city***REMOVED***,
              type: ***REMOVED***text***REMOVED***,
              label: ***REMOVED***City***REMOVED***,
              defaultValue: ***REMOVED***Boston***REMOVED***,
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
      expect(formValues.address.city).toBe(***REMOVED***Boston***REMOVED***)
    })

    it(***REMOVED***seeds defaults into a brand-new empty element (simulates add-new-item flow in MultipleFieldCreator)***REMOVED***, () => {
      // This mirrors the getNewDefaultElement() function in MultipleFieldCreator:
      // When the user clicks Add, a {} is created and seedNestedDefaults runs on it
      const objFields: IFormField[] = [
        { id: ***REMOVED***name***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Name***REMOVED***, defaultValue: ***REMOVED***New Item***REMOVED*** },
        { id: ***REMOVED***count***REMOVED***, type: ***REMOVED***number***REMOVED***, label: ***REMOVED***Count***REMOVED***, defaultValue: 0 },
        { id: ***REMOVED***active***REMOVED***, type: ***REMOVED***boolean***REMOVED***, label: ***REMOVED***Active***REMOVED***, defaultValue: true },
      ]

      const newElement: IFormValues = {}
      const context: FieldEvaluationContext = { rootFormValues: {} }

      seedNestedDefaults(objFields, newElement, context)

      expect(newElement.name).toBe(***REMOVED***New Item***REMOVED***)
      expect(newElement.count).toBe(0)
      expect(newElement.active).toBe(true)
    })

    it(***REMOVED***seeds defaults for a new element without overwriting an existing one in the same array***REMOVED***, () => {
      // existing[0] has user data; null at [1] simulates a newly added slot
      const fields: IFormField[] = [
        {
          id: ***REMOVED***items***REMOVED***,
          type: ***REMOVED***object***REMOVED***,
          label: ***REMOVED***Items***REMOVED***,
          multiple: true,
          fields: [{ id: ***REMOVED***label***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Label***REMOVED***, defaultValue: ***REMOVED***Default Label***REMOVED*** }],
        },
      ]

      const formValues: any = {
        items: [{ label: ***REMOVED***User Value***REMOVED*** }, null],
      }
      const context: FieldEvaluationContext = { rootFormValues: {} }

      seedNestedDefaults(fields, formValues, context)

      // existing element is untouched
      expect(formValues.items[0].label).toBe(***REMOVED***User Value***REMOVED***)
      // new null slot gets the default
      expect(formValues.items[1].label).toBe(***REMOVED***Default Label***REMOVED***)
    })
  })
})
