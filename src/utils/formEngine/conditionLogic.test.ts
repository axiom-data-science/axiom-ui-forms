import { describe, it, expect } from 'vitest'
import type { ICheckConditionResult, IFormField } from '@/Form/Creator/FormCreatorTypes'
import {
  shouldDisableField,
  shouldApplyNewDefaultValue,
  evaluateConditionStateUpdate,
} from './conditionLogic'

describe('conditionLogic utilities', () => {
  const mockField: IFormField = {
    id: 'testField',
    type: 'text',
    defaultValue: 'default',
  }

  const mockConditionResult: ICheckConditionResult = {
    pass: false,
    result: 'exclude',
    newDefaultValue: undefined,
  }

  describe('shouldDisableField', () => {
    it('should respect disabled prop if explicitly set', () => {
      const result = shouldDisableField(mockConditionResult, true)
      expect(result.disabled).toBe(true)
      expect(result.reason).toBe('prop')
    })

    it('should disable field when condition result is "disable" and passes', () => {
      const condition: ICheckConditionResult = {
        pass: true,
        result: 'disable',
        newDefaultValue: undefined,
      }
      const result = shouldDisableField(condition, undefined)
      expect(result.disabled).toBe(true)
      expect(result.reason).toBe('condition-disable')
    })

    it('should disable field when condition result is "enable" and does not pass', () => {
      const condition: ICheckConditionResult = {
        pass: false,
        result: 'enable',
        newDefaultValue: undefined,
      }
      const result = shouldDisableField(condition, undefined)
      expect(result.disabled).toBe(true)
      expect(result.reason).toBe('condition-enable')
    })

    it('should enable field explicitly when condition result is "enable" and passes', () => {
      const condition: ICheckConditionResult = {
        pass: true,
        result: 'enable',
        newDefaultValue: undefined,
      }
      const result = shouldDisableField(condition, undefined)
      expect(result.disabled).toBe(false)
      expect(result.reason).toBe('condition-enable')
    })

    it('should not disable when no relevant condition', () => {
      const result = shouldDisableField(mockConditionResult, undefined)
      expect(result.disabled).toBe(false)
      expect(result.reason).toBe('none')
    })
  })

  describe('shouldApplyNewDefaultValue', () => {
    it('should not apply if condition does not pass', () => {
      const condition: ICheckConditionResult = {
        pass: false,
        result: 'exclude',
        newDefaultValue: 'newDefault',
      }
      const result = shouldApplyNewDefaultValue(condition, 'currentValue', mockField)
      expect(result).toBe(false)
    })

    it('should not apply if newDefaultValue is undefined', () => {
      const condition: ICheckConditionResult = {
        pass: true,
        result: 'exclude',
        newDefaultValue: undefined,
      }
      const result = shouldApplyNewDefaultValue(condition, 'currentValue', mockField)
      expect(result).toBe(false)
    })

    it('should apply if condition passes and value is undefined', () => {
      const condition: ICheckConditionResult = {
        pass: true,
        result: 'exclude',
        newDefaultValue: 'newDefault',
      }
      const result = shouldApplyNewDefaultValue(condition, undefined, mockField)
      expect(result).toBe(true)
    })

    it('should apply if condition passes and value equals field defaultValue (not user-modified)', () => {
      const condition: ICheckConditionResult = {
        pass: true,
        result: 'exclude',
        newDefaultValue: 'newDefault',
      }
      const result = shouldApplyNewDefaultValue(condition, 'default', mockField)
      expect(result).toBe(true)
    })

    it('should NOT apply if condition passes but value differs from defaultValue (user-modified)', () => {
      const condition: ICheckConditionResult = {
        pass: true,
        result: 'exclude',
        newDefaultValue: 'newDefault',
      }
      const result = shouldApplyNewDefaultValue(condition, 'userChangedValue', mockField)
      expect(result).toBe(false)
    })
  })

  describe('evaluateConditionStateUpdate', () => {
    it('should mark field as excluded when condition result is "exclude" and passes', () => {
      const condition: ICheckConditionResult = {
        pass: true,
        result: 'exclude',
        newDefaultValue: undefined,
      }
      const result = evaluateConditionStateUpdate(
        condition,
        mockField,
        'value',
        {},
        {},
        undefined
      )
      expect(result.isExcluded).toBe(true)
    })

    it('should include field when condition result is "include" and passes', () => {
      const condition: ICheckConditionResult = {
        pass: true,
        result: 'include',
        newDefaultValue: undefined,
      }
      const result = evaluateConditionStateUpdate(
        condition,
        mockField,
        'value',
        {},
        {},
        undefined
      )
      expect(result.isExcluded).toBe(false)
    })

    it('should preserve existing value when toggling disabled state', () => {
      // Simulate: field was enabled with value "userValue", now becomes disabled
      const disableCondition: ICheckConditionResult = {
        pass: true,
        result: 'disable',
        newDefaultValue: undefined,
      }
      const result = evaluateConditionStateUpdate(
        disableCondition,
        mockField,
        'userValue',
        {},
        { testField: 'userValue' },
        undefined
      )
      expect(result.disabledState.disabled).toBe(true)
      expect(result.shouldUpdateFormValue).toBe(false) // Value should NOT be cleared
    })

    it('should apply newDefaultValue when value is at default and condition passes', () => {
      const condition: ICheckConditionResult = {
        pass: true,
        result: 'enable',
        newDefaultValue: 'newDefault',
      }
      const mockForm = { id: 'form' }
      const mockFormValues = { testField: 'default' }

      const result = evaluateConditionStateUpdate(
        condition,
        mockField,
        'default',
        mockForm,
        mockFormValues,
        undefined
      )
      expect(result.shouldUpdateFormValue).toBe(true)
      expect(result.newFormValues).toBeDefined()
    })

    it('should NOT apply newDefaultValue when user has modified the value', () => {
      const condition: ICheckConditionResult = {
        pass: true,
        result: 'enable',
        newDefaultValue: 'newDefault',
      }
      const result = evaluateConditionStateUpdate(
        condition,
        mockField,
        'userModifiedValue',
        {},
        {},
        undefined
      )
      expect(result.shouldUpdateFormValue).toBe(false)
      expect(result.newFormValues).toBeUndefined()
    })
  })
})
