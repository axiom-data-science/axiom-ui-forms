import { describe, it, expect } from ***REMOVED***vitest***REMOVED***
import {
  checkCondition,
  calculateSectionStatus
} from ***REMOVED***./validators***REMOVED***

import { copyAndAddPathToFields, createOneOfMultipleField } from ***REMOVED***@/utils/manipulators***REMOVED***
import { type IObjectField, type IForm, type IFormField } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { getValueFromRelativePath } from ***REMOVED***@/utils/getters***REMOVED***

describe(***REMOVED***checkCondition***REMOVED***, () => {
  it(***REMOVED***returns true if no conditions are set***REMOVED***, () => {
    const field = {}
    const formValues = {}
    const result = checkCondition(field as any, formValues)
    expect(result.pass).toBe(true)
  })

  it(***REMOVED***returns true if single condition passes and result as default "include***REMOVED***, () => {
    const field: IFormField = {
      id: ***REMOVED***testField***REMOVED***,
      label: ***REMOVED***Test field***REMOVED***,
      type: ***REMOVED***text***REMOVED***,
      conditions: {
        dependsOn: ***REMOVED***bar***REMOVED***,
        value: ***REMOVED***foo***REMOVED***
      }
    }
    const formValues = { bar: ***REMOVED***foo***REMOVED*** }
    const result = checkCondition(field, formValues)
    expect(result.pass).toBe(true)
    expect(result.result).toBe(***REMOVED***include***REMOVED***)
  })

  it(***REMOVED***returns false if single condition fails***REMOVED***, () => {
    const field: IFormField = {
      id: ***REMOVED***testField***REMOVED***,
      label: ***REMOVED***Test field***REMOVED***,
      type: ***REMOVED***text***REMOVED***,
      conditions: {
        dependsOn: ***REMOVED***bar***REMOVED***,
        value: ***REMOVED***foo***REMOVED***
      }
    }
    const formValues = { bar: ***REMOVED***baz***REMOVED*** }
    const result = checkCondition(field, formValues)
    expect(result.pass).toBe(false)
  })

  it(***REMOVED***returns true for OR logic if any condition passes***REMOVED***, () => {
    const field: IFormField = {
      id: ***REMOVED***testField***REMOVED***,
      label: ***REMOVED***Test field***REMOVED***,
      type: ***REMOVED***text***REMOVED***,
      conditionsSet: {
        logic: ***REMOVED***or***REMOVED***,
        conditions: [
          { dependsOn: ***REMOVED***a***REMOVED***, value: 1 },
          { dependsOn: ***REMOVED***b***REMOVED***, value: 2 }
        ]
      }
    }
    expect(checkCondition(field, { a: 1, b: 0 }).pass).toBe(true)
    expect(checkCondition(field, { a: 0, b: 2 }).pass).toBe(true)
  })

  it(***REMOVED***returns false for AND logic if any condition fails***REMOVED***, () => {
    const field: IFormField = {
      id: ***REMOVED***testField***REMOVED***,
      label: ***REMOVED***Test field***REMOVED***,
      type: ***REMOVED***text***REMOVED***,
      conditionsSet: {
        logic: ***REMOVED***and***REMOVED***,
        conditions: [
          { dependsOn: ***REMOVED***a***REMOVED***, value: 1 },
          { dependsOn: ***REMOVED***b***REMOVED***, value: 2 }
        ]
      }
    }
    const formValues = { a: 1, b: 0 }
    expect(checkCondition(field, formValues).pass).toBe(false)
  })

  it(***REMOVED***returns a result of "exclude" when result set in conditionsSet***REMOVED***, () => {
    const field: IFormField = {
      id: ***REMOVED***testField***REMOVED***,
      label: ***REMOVED***Test field***REMOVED***,
      type: ***REMOVED***text***REMOVED***,
      conditionsSet: {
        logic: ***REMOVED***or***REMOVED***,
        conditions: [
          { dependsOn: ***REMOVED***a***REMOVED***, value: 1 },
          { dependsOn: ***REMOVED***b***REMOVED***, value: 2 }
        ],
        result: ***REMOVED***exclude***REMOVED***
      }
    }
    const result = checkCondition(field, { a: 1, b: 0 })
    expect(result.pass).toBe(true)
    expect(result.result).toBe(***REMOVED***exclude***REMOVED***)
  })
  it(***REMOVED***returns a result of "disable" when result set in conditions***REMOVED***, () => {
    const field: IFormField = {
      id: ***REMOVED***testField***REMOVED***,
      label: ***REMOVED***Test field***REMOVED***,
      type: ***REMOVED***text***REMOVED***,
      conditions: {
        dependsOn: ***REMOVED***bar***REMOVED***,
        value: ***REMOVED***foo***REMOVED***,
        result: ***REMOVED***disable***REMOVED***
      }
    }
    const formValues = { bar: ***REMOVED***foo***REMOVED*** }
    const result = checkCondition(field, formValues)
    expect(result.pass).toBe(true)
    expect(result.result).toBe(***REMOVED***disable***REMOVED***)
  })
})

describe(***REMOVED***get data and checkCondition on relative paths***REMOVED***, () => {
  describe(***REMOVED***get and check condition for a relativly referenced field***REMOVED***, () => {
    const form: IForm = {
      id: ***REMOVED***form***REMOVED***,
      label: ***REMOVED***Form***REMOVED***,
      fields: [
        {
          id: ***REMOVED***objectField***REMOVED***,
          type: ***REMOVED***object***REMOVED***,
          label: ***REMOVED***Object Field***REMOVED***,
          fields: [
            {
              id: ***REMOVED***innerField***REMOVED***,
              type: ***REMOVED***text***REMOVED***,
              label: ***REMOVED***Inner Field***REMOVED***
            },
            {
              id: ***REMOVED***innerField2***REMOVED***,
              type: ***REMOVED***text***REMOVED***,
              label: ***REMOVED***Inner Field 2***REMOVED***,
              constraints: {
                field: ***REMOVED***.innerField***REMOVED***,
                operator: ***REMOVED***=***REMOVED***,
                value: ***REMOVED***test***REMOVED***
              }
            }
          ]
        }
      ]
    }

    const formWithPaths = copyAndAddPathToFields(form)
    const formValues = {
      objectField: {
        innerField: ***REMOVED***test***REMOVED***
      }
    }

    const objectField = formWithPaths.fields?.[0] as IObjectField // innerField2
    const fieldMap = Object.fromEntries(objectField.fields.map(f => [f.id, f]))
    const field: IFormField = fieldMap.innerField2
    it(***REMOVED***getValueFromRelativePath correctly returns a value of "test"***REMOVED***, () => {
      const condition = field?.conditions
      const value = getValueFromRelativePath(field, String(condition?.field), formValues)
      expect(value).toBe(condition?.value)
    })
    it(***REMOVED***checkCondition correctly returns true***REMOVED***, () => {
      const result = checkCondition(field, formValues)
      expect(result.pass).toBe(true)
    })
  })

  describe(***REMOVED***relativly referenced field that is nested in an object and that has `skip_path` set to true***REMOVED***, () => {
    const form: IForm = {
      id: ***REMOVED***form***REMOVED***,
      label: ***REMOVED***Form***REMOVED***,
      fields: [
        {
          id: ***REMOVED***objectField***REMOVED***,
          type: ***REMOVED***object***REMOVED***,
          label: ***REMOVED***Object Field***REMOVED***,
          fields: [
            {
              id: ***REMOVED***outerField***REMOVED***,
              type: ***REMOVED***text***REMOVED***,
              label: ***REMOVED***Outer Field***REMOVED***,
              conditions: {
                field: ***REMOVED***.innerField***REMOVED***,
                operator: ***REMOVED***=***REMOVED***,
                value: ***REMOVED***test***REMOVED***
              }
            },
            {
              id: ***REMOVED***innerObject***REMOVED***,
              type: ***REMOVED***object***REMOVED***,
              label: ***REMOVED***Inner Field***REMOVED***,
              skip_path: true,
              fields: [
                {
                  id: ***REMOVED***innerField***REMOVED***,
                  type: ***REMOVED***text***REMOVED***,
                  label: ***REMOVED***Inner Field***REMOVED***
                }
              ]
            }
          ]
        }
      ]
    }

    const formWithPaths = copyAndAddPathToFields(form)
    const formValues = {
      objectField: {
        innerField: ***REMOVED***test***REMOVED***
      }
    }

    const objectField = formWithPaths.fields?.[0] as IObjectField // innerField2
    const fieldMap = Object.fromEntries(objectField.fields.map(f => [f.id, f]))
    const field: IFormField = fieldMap.outerField
    it(***REMOVED***checkCondition correctly returns true***REMOVED***, () => {
      const result = checkCondition(field, formValues)
      expect(result.pass).toBe(true)
    })
    it(***REMOVED***getValueFromRelativePath correctly returns a value of "test"***REMOVED***, () => {
      const value = getValueFromRelativePath(field, ***REMOVED***.innerField***REMOVED***, formValues)
      expect(value).toBe(***REMOVED***test***REMOVED***)
    })
  })

  describe(***REMOVED***field that references a field higher up in hierarchy that contains multiple nested arrays***REMOVED***, () => {
    const form: IForm = {
      id: ***REMOVED***form***REMOVED***,
      label: ***REMOVED***Form***REMOVED***,
      fields: [
        {
          id: ***REMOVED***topField***REMOVED***,
          type: ***REMOVED***object***REMOVED***,
          label: ***REMOVED***Top Field***REMOVED***,
          multiple: true,
          fields: [
            {
              id: ***REMOVED***middleField***REMOVED***,
              type: ***REMOVED***object***REMOVED***,
              label: ***REMOVED***Middle Field***REMOVED***,
              multiple: true,
              fields: [
                {
                  id: ***REMOVED***disabledField***REMOVED***,
                  type: ***REMOVED***text***REMOVED***,
                  label: ***REMOVED***Disabled Field***REMOVED***,
                  conditions: {
                    field: ***REMOVED***.innerField***REMOVED***,
                    operator: ***REMOVED***=***REMOVED***,
                    value: ***REMOVED***foo***REMOVED***
                  }
                },
                {
                  id: ***REMOVED***innerField***REMOVED***,
                  type: ***REMOVED***text***REMOVED***,
                  label: ***REMOVED***Inner Field***REMOVED***,
                  conditions: {
                    field: ***REMOVED***.nestedField.nestedFieldInner***REMOVED***,
                    operator: ***REMOVED***=***REMOVED***,
                    value: ***REMOVED***test***REMOVED***
                  }
                },
                {
                  id: ***REMOVED***nestedField***REMOVED***,
                  type: ***REMOVED***object***REMOVED***,
                  label: ***REMOVED***Nested Field***REMOVED***,
                  fields: [
                    {
                      id: ***REMOVED***nestedFieldInner***REMOVED***,
                      type: ***REMOVED***text***REMOVED***,
                      conditions: {
                        field: ***REMOVED***..innerField***REMOVED***,
                        operator: ***REMOVED***=***REMOVED***,
                        value: ***REMOVED***value2***REMOVED***
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
    const formWithPaths = copyAndAddPathToFields(form)
    const topField = formWithPaths?.fields?.[0] as IObjectField
    const multiTopField = createOneOfMultipleField(topField, 2) as IObjectField
    const middleField = multiTopField.fields?.find(f => f.id === ***REMOVED***middleField***REMOVED***)
    const multiMiddleField = createOneOfMultipleField(middleField as IFormField, 1) as IObjectField
    const disabledField = multiMiddleField.fields.find(f => f.id === ***REMOVED***disabledField***REMOVED***) as IFormField
    const nestedField = multiMiddleField.fields.find(f => f.id === ***REMOVED***nestedField***REMOVED***) as IObjectField
    const innerField = multiMiddleField.fields.find(f => f.id === ***REMOVED***innerField***REMOVED***) as IFormField
    const nestedFieldInner = nestedField.fields.find(f => f.id === ***REMOVED***nestedFieldInner***REMOVED***) as IFormField

    const formValues = {
      topField: [
        null,
        null,
        {
          middleField: [
            null,
            {
              innerField: ***REMOVED***value2***REMOVED***,
              nestedField: {
                nestedFieldInner: ***REMOVED***test***REMOVED***
              }
            }
          ]
        }
      ]
    }

    it(***REMOVED***looking up tree: checkCondition correctly returns false for disabledField***REMOVED***, () => {
      const result = checkCondition(disabledField, formValues)
      expect(result.pass).toBe(false)
    })

    it(***REMOVED***looking up tree: checkCondition correctly returns true***REMOVED***, () => {
      const result = checkCondition(nestedFieldInner, formValues)
      expect(result.pass).toBe(true)
      expect(result.result).toBe(***REMOVED***include***REMOVED***)
    })
    it(***REMOVED***looking down tree: checkCondition correctly returns true***REMOVED***, () => {
      const result = checkCondition(innerField, formValues)
      expect(result.pass).toBe(true)
      expect(result.result).toBe(***REMOVED***include***REMOVED***)
    })
    it(***REMOVED***looking up tree: getValueFromRelativePath correctly returns a value of "value2"***REMOVED***, () => {
      const condition = nestedFieldInner.conditions
      const value = getValueFromRelativePath(nestedFieldInner, String(condition?.field), formValues)
      expect(value).toBe(condition?.value)
    })
    it(***REMOVED***looking down tree: getValueFromRelativePath correctly returns a value of "test"***REMOVED***, () => {
      const condition = innerField.conditions
      const value = getValueFromRelativePath(innerField, String(condition?.field), formValues)
      console.log(value)
      expect(value).toBe(condition?.value)
    })
  })
})

describe(***REMOVED***calculateSectionStatus***REMOVED***, () => {
  it(***REMOVED***calculates section status correctly***REMOVED***, () => {
    // Mock fields
    const fields: IFormField[] = [
      { id: ***REMOVED***f1***REMOVED***, type: ***REMOVED***text***REMOVED***, required: true },
      { id: ***REMOVED***f2***REMOVED***, type: ***REMOVED***text***REMOVED***, required: false }
    ]

    const sections = [{
      id: ***REMOVED***s1***REMOVED***,
      label: ***REMOVED***Section 1***REMOVED***,
      fields
    }]
    const formValues = { f1: ***REMOVED***foo***REMOVED***, f2: ***REMOVED******REMOVED*** }

    const result = calculateSectionStatus(sections, formValues)
    expect(result).toEqual({
      s1: {
        completed: 1,
        total: 2,
        requiredTotal: 1,
        requiredCompleted: 1,
        valid: true
      }
    })
  })

  it(***REMOVED***marks section as invalid if required not completed***REMOVED***, () => {
    const fields: IFormField[] = [
      { id: ***REMOVED***f1***REMOVED***, type: ***REMOVED***text***REMOVED***, required: true },
      { id: ***REMOVED***f2***REMOVED***, type: ***REMOVED***text***REMOVED***, required: false }
    ]

    const sections = [{
      id: ***REMOVED***s1***REMOVED***,
      label: ***REMOVED***Section 1***REMOVED***,
      fields
    }]
    const formValues = { f1: ***REMOVED******REMOVED***, f2: ***REMOVED***bar***REMOVED*** }

    const result = calculateSectionStatus(sections, formValues)
    expect(result).toEqual({
      s1: {
        completed: 1,
        total: 2,
        requiredTotal: 1,
        requiredCompleted: 0,
        valid: false
      }
    })
  })
})
