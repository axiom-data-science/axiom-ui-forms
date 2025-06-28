import { describe, it, expect } from 'vitest'
import {
  checkCondition,
  calculateSectionStatus
} from './validators'
import { type IFormField } from '@/library'

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
    expect(result.result).toBe('disabled')
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
