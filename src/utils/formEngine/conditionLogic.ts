/**
 * Condition handling utilities - extracted from FieldCreator for testability
 * and to keep condition-related logic isolated and reusable.
 */
import type { ICheckConditionResult, IFormField, IFormValues } from '@/Form/Creator/FormCreatorTypes'
import { cleanAndUpdateFormValuesWithFieldValue } from '@/utils/manipulators'

export interface IDisabledState {
  disabled: boolean
  reason?: 'condition-disable' | 'condition-enable' | 'prop' | 'none'
}

export interface IConditionStateUpdate {
  isExcluded: boolean
  shouldUpdateFormValue: boolean
  newFormValues?: IFormValues
  disabledState: IDisabledState
  reason: string
}

/**
 * Determine if a field should be disabled based on condition result and existing disabled prop.
 * Handles 'disable', 'enable', and unspecified condition results.
 *
 * @param conditionResult - The result from checkCondition()
 * @param disabledProp - The disabled prop passed to FieldCreator
 * @returns { disabled, reason } - Whether field should be disabled and why
 */
export const shouldDisableField = (
  conditionResult: ICheckConditionResult,
  disabledProp: boolean | undefined
): IDisabledState => {
  // If disabled prop is explicitly set in component, respect it
  if (disabledProp === true) {
    return { disabled: true, reason: 'prop' }
  }

  // Apply disable logic from condition
  if (conditionResult.result === 'disable' && conditionResult.pass) {
    return { disabled: true, reason: 'condition-disable' }
  }

  // Apply enable logic from condition (enable when condition fails means disable)
  if (conditionResult.result === 'enable' && !conditionResult.pass) {
    return { disabled: true, reason: 'condition-enable' }
  }

  // Explicitly enable when condition passes and result is 'enable'
  if (conditionResult.result === 'enable' && conditionResult.pass) {
    return { disabled: false, reason: 'condition-enable' }
  }

  return { disabled: false, reason: 'none' }
}

/**
 * Determine if newDefaultValue should be applied from a condition.
 * ONLY applies the newDefaultValue if the current value hasn't been user-modified.
 *
 * @param conditionResult - The result from checkCondition()
 * @param fieldValue - The current value of the field in formValues
 * @param field - The field definition
 * @returns boolean - Whether newDefaultValue should be applied
 */
export const shouldApplyNewDefaultValue = (
  conditionResult: ICheckConditionResult,
  fieldValue: any,
  field: IFormField
): boolean => {
  // Only apply if condition passes and newDefaultValue is defined
  if (!conditionResult.pass || conditionResult.newDefaultValue === undefined) {
    return false
  }

  // Check if current value is at its default (user hasn't changed it)
  // Value is considered "at default" if it's undefined or equals field.defaultValue
  const isValueAtDefault = fieldValue === undefined || fieldValue === field.defaultValue

  return isValueAtDefault
}

/**
 * Apply newDefaultValue to formValues if conditions are met.
 * This is called after determining that the value should be updated.
 *
 * @param conditionResult - The result from checkCondition()
 * @param fieldValue - The current value of the field
 * @param field - The field definition
 * @param form - The form definition
 * @param formValues - Current form values
 * @returns Updated formValues if newDefaultValue was applied, undefined otherwise
 */
export const applyNewDefaultValueToFormValues = (
  conditionResult: ICheckConditionResult,
  fieldValue: any,
  field: IFormField,
  form: any,
  formValues: IFormValues
): IFormValues | undefined => {
  if (!shouldApplyNewDefaultValue(conditionResult, fieldValue, field)) {
    return undefined
  }

  return cleanAndUpdateFormValuesWithFieldValue({
    form,
    field,
    value: conditionResult.newDefaultValue,
    formValues,
  })
}

/**
 * Comprehensive condition state update logic.
 * Evaluates all condition-related state changes in one place for consistency.
 *
 * @param conditionResult - The result from checkCondition()
 * @param field - The field definition
 * @param fieldValue - Current value from formValues
 * @param form - The form definition
 * @param formValues - Current form values
 * @param disabledProp - The disabled prop passed to FieldCreator
 * @returns Object with disabled state and whether formValues should be updated
 */
export const evaluateConditionStateUpdate = (
  conditionResult: ICheckConditionResult,
  field: IFormField,
  fieldValue: any,
  form: any,
  formValues: IFormValues,
  disabledProp?: boolean
): IConditionStateUpdate => {
  // 1. Check if field should be hidden (include/exclude logic)
  const isExcluded =
    (conditionResult.pass && conditionResult.result === 'exclude') ||
    (!conditionResult.pass && conditionResult.result === 'include')

  if (isExcluded) {
    return {
      isExcluded: true,
      shouldUpdateFormValue: false,
      disabledState: { disabled: true, reason: 'prop' },
      reason: 'Field is excluded by condition'
    }
  }

  // 2. Determine disabled state
  const disabledState = shouldDisableField(conditionResult, disabledProp)

  // 3. Check if newDefaultValue should be applied
  const shouldApplyDefault = shouldApplyNewDefaultValue(conditionResult, fieldValue, field)

  let newFormValues: IFormValues | undefined
  if (shouldApplyDefault) {
    newFormValues = applyNewDefaultValueToFormValues(conditionResult, fieldValue, field, form, formValues)
  }

  return {
    isExcluded: false,
    shouldUpdateFormValue: newFormValues !== undefined,
    newFormValues,
    disabledState,
    reason: shouldApplyDefault ? 'Applying newDefaultValue from condition' : 'No condition-based updates needed'
  }
}
