import { describe, it, expect, vi } from 'vitest'
import {
  checkCondition,
  calculateSectionStatus
} from './validators'
import { type IFormField } from '@/library'

// Mocks for dependencies and types
const getFieldValue = vi.fn()
const getFieldsFromFormSection = vi.fn()
const getValueFromPath = vi.fn()

vi.mock('@/utils/getters', () => ({
  getFieldValue,
  getFieldsFromFormSection,
  getValueFromPath
}))

describe('checkCondition', () => {
  it('returns true if no conditions are set', () => {
    const field = {}
    const formValues = {}
    expect(checkCondition(field as any, formValues)).toBe(true)
  })

  it('returns true if single condition passes', () => {
    getValueFromPath.mockReturnValue('foo')
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
    expect(checkCondition(field, formValues)).toBe(true)
  })

  it('returns false if single condition fails', () => {
    getValueFromPath.mockReturnValue('baz')
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
    expect(checkCondition(field, formValues)).toBe(false)
  })

  it('returns true for OR logic if any condition passes', () => {
    getValueFromPath.mockImplementation((path: string) => path === 'a' ? 1 : 0)
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
    expect(checkCondition(field, { a: 1, b: 0 })).toBe(true)
    expect(checkCondition(field, { a: 0, b: 2 })).toBe(true)
  })

  it('returns false for AND logic if any condition fails', () => {
    getValueFromPath.mockImplementation((path: string) => path === 'a' ? 1 : 0)
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
    expect(checkCondition(field, formValues)).toBe(false)
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
