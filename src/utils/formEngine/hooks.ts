/**
 * formEngine/hooks.ts - React hooks for form logic integration
 *
 * These hooks provide custom components with:
 * - Memoized field logic states (conditions, visibility, disabled)
 * - Smart subscriptions to avoid unnecessary re-renders
 * - Explicit form value subscriptions for custom logic
 *
 * Design principles:
 * 1. Minimal re-renders - only when relevant data changes
 * 2. Explicit dependencies - custom components declare what they need
 * 3. Composable - hooks can be mixed and matched
 * 4. No magic - behavior is predictable and debuggable
 */

import { useMemo } from ***REMOVED***react***REMOVED***
import { useFormValues as useFormValuesContext } from ***REMOVED***@/Form/Creator/FormContextProvider***REMOVED***
import { type IFormField, type IValueType } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { evaluateFieldLogicState, type FieldEvaluationContext, type FieldLogicState } from ***REMOVED***../formEngine***REMOVED***
import { getValueFromPath } from ***REMOVED***@/utils/getters***REMOVED***

/**
 * Hook: Get the computed logic state for a field
 *
 * Returns memoized field logic including:
 * - isVisible: Should field be rendered?
 * - isDisabled: Should input be disabled?
 * - defaultValue: What default to apply?
 * - conditionResult: Raw condition evaluation result
 *
 * **Memoization:** Only recomputes when:
 * - Field definition changes
 * - Form values referenced by field conditions change
 *
 * **Performance:** Efficient for custom components because it only tracks
 * dependencies declared in the field***REMOVED***s conditions, not all form changes.
 *
 * @example
 * ```typescript
 * const MyCustomField = ({ field, onChange, value }) => {
 *   const logicState = useFieldLogicState(field)  // Only recomputes if field logic changes
 *
 *   if (!logicState.isVisible) return null
 *
 *   return (
 *     <input
 *       disabled={logicState.isDisabled}
 *       value={value}
 *       onChange={(e) => onChange(e.target.value)}
 *     />
 *   )
 * }
 * ```
 *
 * @param field - The field to evaluate logic for
 * @returns Memoized FieldLogicState with visibility, disabled, and default value
 */
export function useFieldLogicState(field: IFormField): FieldLogicState {
  const formValues = useFormValuesContext()

  return useMemo(() => {
    const context: FieldEvaluationContext = {
      rootFormValues: formValues,
      fieldPath: field.path
    }
    return evaluateFieldLogicState(field, context)
  }, [field, formValues])
}

/**
 * Hook: Get specific form values by path
 *
 * Returns memoized form values at specified paths. Only recomputes when
 * values at those specific paths change, not on any form change.
 *
 * **Memoization:** Only recomputes when:
 * - Path list changes
 * - Values at those paths change
 *
 * **Performance:** Efficient because it extracts only needed values,
 * reducing subscriptions compared to getting full formValues.
 *
 * @example
 * ```typescript
 * const MyCustomField = ({ field, onChange, value }) => {
 *   // Only recompute if these specific paths change
 *   const relatedData = useFormValues([***REMOVED***userRole***REMOVED***, ***REMOVED***globalSetting***REMOVED***, ***REMOVED***objectField.nested***REMOVED***])
 *   const isAllowed = relatedData.userRole === ***REMOVED***admin***REMOVED***
 *
 *   return (
 *     <div>
 *       {isAllowed ? <input /> : <span>Not allowed</span>}
 *     </div>
 *   )
 * }
 * ```
 *
 * @param fieldPaths - Single path string or array of paths to extract
 *                     Paths use dot notation: ***REMOVED***fieldName***REMOVED***, ***REMOVED***object.nested.value***REMOVED***
 * @returns Object with values at requested paths: { fieldName: value, ***REMOVED***object.nested.value***REMOVED***: value }
 */
export function useFormValues(
  fieldPaths: string | string[]
): Record<string, IValueType | IValueType[] | undefined> {
  const formValues = useFormValuesContext()

  // Normalize to array
  const pathsArray = Array.isArray(fieldPaths) ? fieldPaths : [fieldPaths]

  return useMemo(() => {
    const result: Record<string, IValueType | IValueType[] | undefined> = {}
    for (const path of pathsArray) {
      result[path] = getValueFromPath(path, formValues)
    }
    return result
  }, [pathsArray.join(***REMOVED***,***REMOVED***), formValues])  // Join paths for stable dependency
}

/**
 * Hook: Get a single form value by path
 *
 * Convenience hook for getting a single form value. Equivalent to
 * calling useFormValues() with a single path.
 *
 * **Memoization:** Only recomputes when the value at that path changes.
 *
 * @example
 * ```typescript
 * const MyCustomField = ({ field, onChange, value }) => {
 *   const userRole = useFormValue(***REMOVED***userRole***REMOVED***)
 *
 *   return (
 *     <div>
 *       Role: {userRole}
 *       <input value={value} onChange={(e) => onChange(e.target.value)} />
 *     </div>
 *   )
 * }
 * ```
 *
 * @param fieldPath - Path to extract from form values (dot notation)
 * @returns Value at the path, or undefined if not found
 */
export function useFormValue(fieldPath: string): IValueType | IValueType[] | undefined {
  const values = useFormValues([fieldPath])
  return values[fieldPath]
}

/**
 * Hook: Get the current value for a specific field
 *
 * Returns the current value from form values for the given field,
 * using the field***REMOVED***s path definition for lookup.
 *
 * **Use case:** When you already have a field and just want its current value.
 *
 * @example
 * ```typescript
 * const MyCustomField = ({ field, onChange, value }) => {
 *   const currentValue = useFieldValue(field)  // Get value from context
 *   const logicState = useFieldLogicState(field)
 *
 *   // Can compare: did value change from default?
 *   const isDefault = currentValue === field.defaultValue
 * }
 * ```
 *
 * @param field - The field to get value for
 * @returns The current value for this field from form values
 */
export function useFieldValue(field: IFormField): IValueType | IValueType[] | undefined {
  const formValues = useFormValuesContext()

  return useMemo(() => {
    const path = field.destPath ?? field.id
    return getValueFromPath(path, formValues)
  }, [field.destPath, field.id, formValues])
}
