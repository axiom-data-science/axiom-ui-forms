import { describe, it, expect } from 'vitest'
import {
  checkCondition,
  calculateSectionStatus
} from './validators'

import { copyAndAddPathToFields, createOneOfMultipleField } from '@/utils/manipulators'
import { type IObjectField, type IForm, type IFormField } from '@/Form/Creator/FormCreatorTypes'
import { getValueFromRelativePath } from '@/utils/getters'

describe('checkCondition', () => {
  it('returns true if no conditions are set', () => {
    const field = {}
    const formValues = {}
    const result = checkCondition(field as any, formValues)
    expect(result.pass).toBe(true)
  })

  it('returns true if single condition passes and result as default "include', () => {
    const field: IFormField = {
      id: 'testField',
      label: 'Test field',
      type: 'text',
      conditions: {
        dependsOn: 'bar',
        value: 'foo'
      }
    }
    const formValues = { bar: 'foo' }
    const result = checkCondition(field, formValues)
    expect(result.pass).toBe(true)
    expect(result.result).toBe('include')
  })

  it('returns false if single condition fails', () => {
    const field: IFormField = {
      id: 'testField',
      label: 'Test field',
      type: 'text',
      conditions: {
        dependsOn: 'bar',
        value: 'foo'
      }
    }
    const formValues = { bar: 'baz' }
    const result = checkCondition(field, formValues)
    expect(result.pass).toBe(false)
  })

  it('returns true for OR logic if any condition passes', () => {
    const field: IFormField = {
      id: 'testField',
      label: 'Test field',
      type: 'text',
      conditionsSet: {
        logic: 'or',
        conditions: [
          { dependsOn: 'a', value: 1 },
          { dependsOn: 'b', value: 2 }
        ]
      }
    }
    expect(checkCondition(field, { a: 1, b: 0 }).pass).toBe(true)
    expect(checkCondition(field, { a: 0, b: 2 }).pass).toBe(true)
  })

  it('returns false for AND logic if any condition fails', () => {
    const field: IFormField = {
      id: 'testField',
      label: 'Test field',
      type: 'text',
      conditionsSet: {
        logic: 'and',
        conditions: [
          { dependsOn: 'a', value: 1 },
          { dependsOn: 'b', value: 2 }
        ]
      }
    }
    const formValues = { a: 1, b: 0 }
    expect(checkCondition(field, formValues).pass).toBe(false)
  })

  it('returns a result of "exclude" when result set in conditionsSet', () => {
    const field: IFormField = {
      id: 'testField',
      label: 'Test field',
      type: 'text',
      conditionsSet: {
        logic: 'or',
        conditions: [
          { dependsOn: 'a', value: 1 },
          { dependsOn: 'b', value: 2 }
        ],
        result: 'exclude'
      }
    }
    const result = checkCondition(field, { a: 1, b: 0 })
    expect(result.pass).toBe(true)
    expect(result.result).toBe('exclude')
  })
  it('returns a result of "disable" when result set in conditions', () => {
    const field: IFormField = {
      id: 'testField',
      label: 'Test field',
      type: 'text',
      conditions: {
        dependsOn: 'bar',
        value: 'foo',
        result: 'disable'
      }
    }
    const formValues = { bar: 'foo' }
    const result = checkCondition(field, formValues)
    expect(result.pass).toBe(true)
    expect(result.result).toBe('disable')
  })
})

describe('get data and checkCondition on relative paths', () => {
  describe('get and check condition for a relativly referenced field', () => {
    const form: IForm = {
      id: 'form',
      label: 'Form',
      fields: [
        {
          id: 'objectField',
          type: 'object',
          label: 'Object Field',
          fields: [
            {
              id: 'innerField',
              type: 'text',
              label: 'Inner Field'
            },
            {
              id: 'innerField2',
              type: 'text',
              label: 'Inner Field 2',
              constraints: {
                field: '.innerField',
                operator: '=',
                value: 'test'
              }
            }
          ]
        }
      ]
    }

    const formWithPaths = copyAndAddPathToFields(form)
    const formValues = {
      objectField: {
        innerField: 'test'
      }
    }

    const objectField = formWithPaths.fields?.[0] as IObjectField // innerField2
    const fieldMap = Object.fromEntries((objectField?.fields ?? []).map(f => [f.id, f]))
    const field: IFormField = fieldMap.innerField2
    it('getValueFromRelativePath correctly returns a value of "test"', () => {
      const condition = field?.conditions
      const value = getValueFromRelativePath(field, String(condition?.field), formValues)
      expect(value).toBe(condition?.value)
    })
    it('checkCondition correctly returns true', () => {
      const result = checkCondition(field, formValues)
      expect(result.pass).toBe(true)
    })
  })

  describe('relativly referenced field that is nested in an object and that has `skip_path` set to true', () => {
    const form: IForm = {
      id: 'form',
      label: 'Form',
      fields: [
        {
          id: 'objectField',
          type: 'object',
          label: 'Object Field',
          fields: [
            {
              id: 'outerField',
              type: 'text',
              label: 'Outer Field',
              conditions: {
                field: '.innerField',
                operator: '=',
                value: 'test'
              }
            },
            {
              id: 'innerObject',
              type: 'object',
              label: 'Inner Field',
              skip_path: true,
              fields: [
                {
                  id: 'innerField',
                  type: 'text',
                  label: 'Inner Field'
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
        innerField: 'test'
      }
    }

    const objectField = formWithPaths.fields?.[0] as IObjectField // innerField2
    const fieldMap = Object.fromEntries((objectField?.fields ?? []).map(f => [f.id, f]))
    const field: IFormField = fieldMap.outerField
    it('checkCondition correctly returns true', () => {
      const result = checkCondition(field, formValues)
      expect(result.pass).toBe(true)
    })
    it('getValueFromRelativePath correctly returns a value of "test"', () => {
      const value = getValueFromRelativePath(field, '.innerField', formValues)
      expect(value).toBe('test')
    })
  })

  describe('field that references a field higher up in hierarchy that contains multiple nested arrays', () => {
    const form: IForm = {
      id: 'form',
      label: 'Form',
      fields: [
        {
          id: 'topField',
          type: 'object',
          label: 'Top Field',
          multiple: true,
          fields: [
            {
              id: 'middleField',
              type: 'object',
              label: 'Middle Field',
              multiple: true,
              fields: [
                {
                  id: 'disabledField',
                  type: 'text',
                  label: 'Disabled Field',
                  conditions: {
                    field: '.innerField',
                    operator: '=',
                    value: 'foo'
                  }
                },
                {
                  id: 'innerField',
                  type: 'text',
                  label: 'Inner Field',
                  conditions: {
                    field: '.nestedField.nestedFieldInner',
                    operator: '=',
                    value: 'test'
                  }
                },
                {
                  id: 'nestedField',
                  type: 'object',
                  label: 'Nested Field',
                  fields: [
                    {
                      id: 'nestedFieldInner',
                      type: 'text',
                      conditions: {
                        field: '..innerField',
                        operator: '=',
                        value: 'value2'
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
    const middleField = multiTopField.fields?.find(f => f.id === 'middleField')
    const multiMiddleField = createOneOfMultipleField(middleField as IFormField, 1) as IObjectField
    const disabledField = multiMiddleField.fields?.find(f => f.id === 'disabledField') as IFormField
    const nestedField = multiMiddleField.fields?.find(f => f.id === 'nestedField') as IObjectField
    const innerField = multiMiddleField.fields?.find(f => f.id === 'innerField') as IFormField
    const nestedFieldInner = nestedField.fields?.find(f => f.id === 'nestedFieldInner') as IFormField

    const formValues = {
      topField: [
        null,
        null,
        {
          middleField: [
            null,
            {
              innerField: 'value2',
              nestedField: {
                nestedFieldInner: 'test'
              }
            }
          ]
        }
      ]
    }

    it('looking up tree: checkCondition correctly returns false for disabledField', () => {
      const result = checkCondition(disabledField, formValues)
      expect(result.pass).toBe(false)
    })

    it('looking up tree: checkCondition correctly returns true', () => {
      const result = checkCondition(nestedFieldInner, formValues)
      expect(result.pass).toBe(true)
      expect(result.result).toBe('include')
    })
    it('looking down tree: checkCondition correctly returns true', () => {
      const result = checkCondition(innerField, formValues)
      expect(result.pass).toBe(true)
      expect(result.result).toBe('include')
    })
    it('looking up tree: getValueFromRelativePath correctly returns a value of "value2"', () => {
      const condition = nestedFieldInner.conditions
      const value = getValueFromRelativePath(nestedFieldInner, String(condition?.field), formValues)
      expect(value).toBe(condition?.value)
    })
    it('looking down tree: getValueFromRelativePath correctly returns a value of "test"', () => {
      const condition = innerField.conditions
      const value = getValueFromRelativePath(innerField, String(condition?.field), formValues)
      console.log(value)
      expect(value).toBe(condition?.value)
    })
  })
})

describe('calculateSectionStatus', () => {
  it('calculates section status correctly', () => {
    // Mock fields
    const fields: IFormField[] = [
      { id: 'f1', type: 'text', required: true },
      { id: 'f2', type: 'text', required: false }
    ]

    const sections = [{
      id: 's1',
      label: 'Section 1',
      fields
    }]
    const formValues = { f1: 'foo', f2: '' }

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

  it('marks section as invalid if required not completed', () => {
    const fields: IFormField[] = [
      { id: 'f1', type: 'text', required: true },
      { id: 'f2', type: 'text', required: false }
    ]

    const sections = [{
      id: 's1',
      label: 'Section 1',
      fields
    }]
    const formValues = { f1: '', f2: 'bar' }

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
