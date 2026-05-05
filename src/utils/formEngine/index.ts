/**
 * formEngine/index.ts - Public API for form engine
 *
 * Exports:
 * - Pure logic functions from core (testable without React)
 * - React hooks for custom components (see hooks.ts)
 */

// Core logic - exported for direct use or testing
export {
  evaluateFieldLogicState,
  evaluateFieldVisibility,
  evaluateFieldDisabled,
  evaluateDefaultValue,
  evaluateNestedFieldStates,
  type FieldEvaluationContext,
  type FieldLogicState
} from ***REMOVED***../formEngine***REMOVED***

// React hooks - for use in custom components and React code
export {
  useFieldLogicState,
  useFormValues,
  useFormValue,
  useFieldValue
} from ***REMOVED***./hooks***REMOVED***
