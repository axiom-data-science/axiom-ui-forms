/**
 * formEngine.ts - Pure form logic layer (no React dependencies)
 *
 * This module contains business logic for form evaluation:
 * - Condition checking (both absolute and relative paths)
 * - Field visibility/disabled state determination
 * - Default value application
 * - Multi-level nesting support
 *
 * All functions are pure and testable without React.
 */

import {
  type IFormField,
  type IFormValues,
  type IValueType,
  type ICheckConditionResult,
} from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { checkCondition } from ***REMOVED***@/utils/validators***REMOVED***
import { getChildFields } from ***REMOVED***@/utils/getters***REMOVED***

/**
 * Context information for evaluating nested fields
 * Used to track the path through nested objects for relative path resolution
 */
export interface FieldEvaluationContext {
  /** The root form values (always passed, never changes) */
  rootFormValues: IFormValues

  /** The immediate parent object value (for nested relative path resolution) */
  parentValue?: IFormValues

  /** Path from root to current field (for breadcrumb tracking) */
  fieldPath?: IFormField[]
}

/**
 * Result of evaluating a field***REMOVED***s logic state
 */
export interface FieldLogicState {
  /** Should the field be rendered? */
  isVisible: boolean

  /** Should the field be disabled for input? */
  isDisabled: boolean

  /** Default value to use if field has no current value */
  defaultValue?: IValueType | IValueType[]

  /** Raw condition result for reference */
  conditionResult: ICheckConditionResult
}

/**
 * Evaluate the complete logic state for a field
 *
 * This is the primary entry point for determining if a field should be visible,
 * disabled, or have defaults applied.
 *
 * Handles:
 * - Absolute path conditions (reference root-level fields)
 * - Relative path conditions (reference siblings or parents)
 * - Both nested and non-nested contexts
 * - Condition-driven default values (newDefaultValue)
 *
 * @param field - The field to evaluate
 * @param context - The evaluation context (root values, parent values, field path)
 * @returns The computed field logic state
 */
export function evaluateFieldLogicState(
  field: IFormField,
  context: FieldEvaluationContext
): FieldLogicState {
  // Always evaluate conditions against ROOT form values
  // This ensures:
  // - Absolute paths work (reference root-level fields)
  // - Relative paths work (navigate from field path to siblings/parents)
  // - Both nested and non-nested contexts work the same way
  const conditionResult = checkCondition(field, context.rootFormValues)

  // Determine visibility
  const isVisible = evaluateFieldVisibility(conditionResult)

  // Determine disabled state
  const isDisabled = evaluateFieldDisabled(conditionResult)

  // Determine applicable default value
  const defaultValue = evaluateDefaultValue(field, conditionResult)

  return {
    isVisible,
    isDisabled,
    defaultValue,
    conditionResult,
  }
}

/**
 * Determine if a field should be visible based on condition result
 *
 * @param conditionResult - The result from checkCondition
 * @returns true if field should be visible
 */
export function evaluateFieldVisibility(conditionResult: ICheckConditionResult): boolean {
  // Visibility logic:
  // - ***REMOVED***exclude***REMOVED*** + pass=true     → hidden (don***REMOVED***t render)
  // - ***REMOVED***include***REMOVED*** + pass=false    → hidden (don***REMOVED***t render)
  // - All other combinations    → visible (render)

  if (conditionResult.result === ***REMOVED***exclude***REMOVED*** && conditionResult.pass) {
    return false
  }

  if (conditionResult.result === ***REMOVED***include***REMOVED*** && !conditionResult.pass) {
    return false
  }

  return true
}

/**
 * Determine if a field should be disabled based on condition result
 *
 * @param conditionResult - The result from checkCondition
 * @returns true if field should be disabled
 */
export function evaluateFieldDisabled(conditionResult: ICheckConditionResult): boolean {
  // Disabled logic:
  // - ***REMOVED***disable***REMOVED*** + pass=true    → disabled
  // - ***REMOVED***enable***REMOVED*** + pass=false    → disabled
  // - All other combinations   → enabled

  if (conditionResult.result === ***REMOVED***disable***REMOVED*** && conditionResult.pass) {
    return true
  }

  if (conditionResult.result === ***REMOVED***enable***REMOVED*** && !conditionResult.pass) {
    return true
  }

  return false
}

/**
 * Determine the default value for a field
 *
 * Priority:
 * 1. Condition-driven default (newDefaultValue from passing condition)
 * 2. Field***REMOVED***s static defaultValue
 * 3. undefined (no default)
 *
 * @param field - The field to get default for
 * @param conditionResult - The result from checkCondition (may have newDefaultValue)
 * @returns The applicable default value or undefined
 */
export function evaluateDefaultValue(
  field: IFormField,
  conditionResult: ICheckConditionResult
): IValueType | IValueType[] | undefined {
  // Condition-driven defaults take priority
  if (conditionResult.newDefaultValue !== undefined) {
    return conditionResult.newDefaultValue
  }

  // Field***REMOVED***s static default
  if (field.defaultValue !== undefined) {
    return field.defaultValue
  }

  return undefined
}

/**
 * For nested object rendering, determine which children to render and their logic state
 *
 * This function is used by ObjectInput to evaluate all nested children at once,
 * providing consistent context and preventing multiple re-evaluations.
 *
 * @param parentField - The object field containing children
 * @param childFields - The nested child fields to evaluate
 * @param context - The evaluation context (must include rootFormValues)
 * @returns Map of field.id -> FieldLogicState
 */
export function evaluateNestedFieldStates(
  parentField: IFormField,
  childFields: IFormField[],
  context: FieldEvaluationContext
): Record<string, FieldLogicState> {
  const states: Record<string, FieldLogicState> = {}

  for (const childField of childFields) {
    states[childField.id] = evaluateFieldLogicState(childField, context)
  }

  return states
}

/**
 * Seed form values with defaults, handling nested objects and arrays
 *
 * This function recursively applies defaults to:
 * - Simple fields with defaultValue
 * - Object fields and their nested children
 * - Array fields (multiple=true) and their element defaults
 * - Condition-driven defaults (newDefaultValue)
 *
 * @param fields - The fields to process (top-level fields or nested children)
 * @param formValues - The form values object to update (mutated in place)
 * @param context - Evaluation context for condition checking
 * @param parentPath - Path prefix for nested fields (used for ***REMOVED***destPath***REMOVED*** mapping)
 */
export function seedNestedDefaults(
  fields: IFormField[] | undefined,
  formValues: IFormValues,
  context: FieldEvaluationContext,
  parentPath: string = ***REMOVED******REMOVED***
): void {
  if (!fields) return

  for (const field of fields) {
    if (field.type === ***REMOVED***objectList***REMOVED***) {
      // objectList fields should not have child field defaults applied at form level
      // Initialize as empty object; defaults will be applied when items are added to the list
      if (!formValues[field.id]) {
        formValues[field.id] = {}
      }
      // Skip processing nested fields - they will get defaults when added via getNewDefaultElement
      continue
    } else if (field.type === ***REMOVED***object***REMOVED*** && ((field.fields ?? (field as any).tabs) || (field as any).pages || (field as any).wizard_steps)) {
      const childFields = getChildFields(field)

      // skip_path objects are UI-only containers (like objectWrapper) — don***REMOVED***t nest under field.id
      if ((field as any).skip_path === true) {
        seedNestedDefaults(childFields, formValues, context, ***REMOVED******REMOVED***)
        continue
      }

      // For multiple=true object fields the container is an array; for single objects it***REMOVED***s {}
      if (!formValues[field.id]) {
        formValues[field.id] = field.multiple ? [] : {}
      }

      if (field.multiple) {
        // Array of objects
        const arrayValue = formValues[field.id]
        if (Array.isArray(arrayValue)) {
          for (let i = 0; i < arrayValue.length; i++) {
            if (arrayValue[i] === null || arrayValue[i] === undefined) {
              arrayValue[i] = {}
            }
            // Recursively seed defaults for each array element
            seedNestedDefaults(childFields, arrayValue[i] as IFormValues, context, ***REMOVED******REMOVED***)
          }
        }
      } else {
        // Single object
        const objectValue = formValues[field.id]
        if (
          typeof objectValue === ***REMOVED***object***REMOVED*** &&
          objectValue !== null &&
          !Array.isArray(objectValue)
        ) {
          // Recursively seed defaults for nested fields
          seedNestedDefaults(childFields, objectValue as IFormValues, context, ***REMOVED******REMOVED***)
        }
      }
    } else {
      // objectWrapper fields are UI-only containers that organize fields with tabs/pages
      // They don***REMOVED***t store values themselves, but their child fields should get defaults applied
      if (field.type === ***REMOVED***objectWrapper***REMOVED***) {
        // Get all child fields (including those in tabs, pages, wizard_steps)
        const childFields = getChildFields(field)
        // Recursively apply defaults to the child fields
        seedNestedDefaults(childFields, formValues, context, ***REMOVED******REMOVED***)
        continue
      }

      // For non-object fields, check and apply defaults
      // Use the raw field.id for direct access (not destPath)
      const currentValue = formValues[field.id]

      // Only apply default if value is undefined/null
      if (currentValue === undefined || currentValue === null) {
        // Evaluate default using condition logic
        const conditionResult = checkCondition(field, context.rootFormValues)
        const defaultValue = evaluateDefaultValue(field, conditionResult)

        if (defaultValue !== undefined) {
          if (field.multiple) {
            // Array field
            formValues[field.id] = Array.isArray(defaultValue) ? defaultValue : [defaultValue]
          } else {
            // Single value field
            formValues[field.id] = defaultValue
          }
        }
      }
    }
  }
}
