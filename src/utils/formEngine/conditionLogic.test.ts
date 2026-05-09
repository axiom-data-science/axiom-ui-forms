import { describe, it, expect } from ***REMOVED***vitest***REMOVED***
import type { ICheckConditionResult, IFormField } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import {
  shouldDisableField,
  shouldApplyNewDefaultValue,
  evaluateConditionStateUpdate,
} from ***REMOVED***./conditionLogic***REMOVED***

describe(***REMOVED***conditionLogic utilities***REMOVED***, () => {
  const mockField: IFormField = {
    id: ***REMOVED***testField***REMOVED***,
    type: ***REMOVED***text***REMOVED***,
    defaultValue: ***REMOVED***default***REMOVED***,
  }

  const mockConditionResult: ICheckConditionResult = {
    pass: false,
    result: ***REMOVED***exclude***REMOVED***,
    newDefaultValue: undefined,
  }

  describe(***REMOVED***shouldDisableField***REMOVED***, () => {
    it(***REMOVED***should respect disabled prop if explicitly set***REMOVED***, () => {
      const result = shouldDisableField(mockConditionResult, true)
      expect(result.disabled).toBe(true)
      expect(result.reason).toBe(***REMOVED***prop***REMOVED***)
    })

    it(***REMOVED***should disable field when condition result is "disable" and passes***REMOVED***, () => {
      const condition: ICheckConditionResult = {
        pass: true,
        result: ***REMOVED***disable***REMOVED***,
        newDefaultValue: undefined,
      }
      const result = shouldDisableField(condition, undefined)
      expect(result.disabled).toBe(true)
      expect(result.reason).toBe(***REMOVED***condition-disable***REMOVED***)
    })

    it(***REMOVED***should disable field when condition result is "enable" and does not pass***REMOVED***, () => {
      const condition: ICheckConditionResult = {
        pass: false,
        result: ***REMOVED***enable***REMOVED***,
        newDefaultValue: undefined,
      }
      const result = shouldDisableField(condition, undefined)
      expect(result.disabled).toBe(true)
      expect(result.reason).toBe(***REMOVED***condition-enable***REMOVED***)
    })

    it(***REMOVED***should enable field explicitly when condition result is "enable" and passes***REMOVED***, () => {
      const condition: ICheckConditionResult = {
        pass: true,
        result: ***REMOVED***enable***REMOVED***,
        newDefaultValue: undefined,
      }
      const result = shouldDisableField(condition, undefined)
      expect(result.disabled).toBe(false)
      expect(result.reason).toBe(***REMOVED***condition-enable***REMOVED***)
    })

    it(***REMOVED***should not disable when no relevant condition***REMOVED***, () => {
      const result = shouldDisableField(mockConditionResult, undefined)
      expect(result.disabled).toBe(false)
      expect(result.reason).toBe(***REMOVED***none***REMOVED***)
    })
  })

  describe(***REMOVED***shouldApplyNewDefaultValue***REMOVED***, () => {
    it(***REMOVED***should not apply if condition does not pass***REMOVED***, () => {
      const condition: ICheckConditionResult = {
        pass: false,
        result: ***REMOVED***exclude***REMOVED***,
        newDefaultValue: ***REMOVED***newDefault***REMOVED***,
      }
      const result = shouldApplyNewDefaultValue(condition, ***REMOVED***currentValue***REMOVED***, mockField)
      expect(result).toBe(false)
    })

    it(***REMOVED***should not apply if newDefaultValue is undefined***REMOVED***, () => {
      const condition: ICheckConditionResult = {
        pass: true,
        result: ***REMOVED***exclude***REMOVED***,
        newDefaultValue: undefined,
      }
      const result = shouldApplyNewDefaultValue(condition, ***REMOVED***currentValue***REMOVED***, mockField)
      expect(result).toBe(false)
    })

    it(***REMOVED***should apply if condition passes and value is undefined***REMOVED***, () => {
      const condition: ICheckConditionResult = {
        pass: true,
        result: ***REMOVED***exclude***REMOVED***,
        newDefaultValue: ***REMOVED***newDefault***REMOVED***,
      }
      const result = shouldApplyNewDefaultValue(condition, undefined, mockField)
      expect(result).toBe(true)
    })

    it(***REMOVED***should apply if condition passes and value equals field defaultValue (not user-modified)***REMOVED***, () => {
      const condition: ICheckConditionResult = {
        pass: true,
        result: ***REMOVED***exclude***REMOVED***,
        newDefaultValue: ***REMOVED***newDefault***REMOVED***,
      }
      const result = shouldApplyNewDefaultValue(condition, ***REMOVED***default***REMOVED***, mockField)
      expect(result).toBe(true)
    })

    it(***REMOVED***should NOT apply if condition passes but value differs from defaultValue (user-modified)***REMOVED***, () => {
      const condition: ICheckConditionResult = {
        pass: true,
        result: ***REMOVED***exclude***REMOVED***,
        newDefaultValue: ***REMOVED***newDefault***REMOVED***,
      }
      const result = shouldApplyNewDefaultValue(condition, ***REMOVED***userChangedValue***REMOVED***, mockField)
      expect(result).toBe(false)
    })
  })

  describe(***REMOVED***evaluateConditionStateUpdate***REMOVED***, () => {
    it(***REMOVED***should mark field as excluded when condition result is "exclude" and passes***REMOVED***, () => {
      const condition: ICheckConditionResult = {
        pass: true,
        result: ***REMOVED***exclude***REMOVED***,
        newDefaultValue: undefined,
      }
      const result = evaluateConditionStateUpdate(
        condition,
        mockField,
        ***REMOVED***value***REMOVED***,
        {},
        {},
        undefined
      )
      expect(result.isExcluded).toBe(true)
    })

    it(***REMOVED***should include field when condition result is "include" and passes***REMOVED***, () => {
      const condition: ICheckConditionResult = {
        pass: true,
        result: ***REMOVED***include***REMOVED***,
        newDefaultValue: undefined,
      }
      const result = evaluateConditionStateUpdate(
        condition,
        mockField,
        ***REMOVED***value***REMOVED***,
        {},
        {},
        undefined
      )
      expect(result.isExcluded).toBe(false)
    })

    it(***REMOVED***should preserve existing value when toggling disabled state***REMOVED***, () => {
      // Simulate: field was enabled with value "userValue", now becomes disabled
      const disableCondition: ICheckConditionResult = {
        pass: true,
        result: ***REMOVED***disable***REMOVED***,
        newDefaultValue: undefined,
      }
      const result = evaluateConditionStateUpdate(
        disableCondition,
        mockField,
        ***REMOVED***userValue***REMOVED***,
        {},
        { testField: ***REMOVED***userValue***REMOVED*** },
        undefined
      )
      expect(result.disabledState.disabled).toBe(true)
      expect(result.shouldUpdateFormValue).toBe(false) // Value should NOT be cleared
    })

    it(***REMOVED***should apply newDefaultValue when value is at default and condition passes***REMOVED***, () => {
      const condition: ICheckConditionResult = {
        pass: true,
        result: ***REMOVED***enable***REMOVED***,
        newDefaultValue: ***REMOVED***newDefault***REMOVED***,
      }
      const mockForm = { id: ***REMOVED***form***REMOVED*** }
      const mockFormValues = { testField: ***REMOVED***default***REMOVED*** }

      const result = evaluateConditionStateUpdate(
        condition,
        mockField,
        ***REMOVED***default***REMOVED***,
        mockForm,
        mockFormValues,
        undefined
      )
      expect(result.shouldUpdateFormValue).toBe(true)
      expect(result.newFormValues).toBeDefined()
    })

    it(***REMOVED***should NOT apply newDefaultValue when user has modified the value***REMOVED***, () => {
      const condition: ICheckConditionResult = {
        pass: true,
        result: ***REMOVED***enable***REMOVED***,
        newDefaultValue: ***REMOVED***newDefault***REMOVED***,
      }
      const result = evaluateConditionStateUpdate(
        condition,
        mockField,
        ***REMOVED***userModifiedValue***REMOVED***,
        {},
        {},
        undefined
      )
      expect(result.shouldUpdateFormValue).toBe(false)
      expect(result.newFormValues).toBeUndefined()
    })
  })
})
