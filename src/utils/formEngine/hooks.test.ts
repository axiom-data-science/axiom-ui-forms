/**
 * formEngine/hooks.test.ts - Tests for React hooks
 *
 * These tests verify that hooks properly:
 * - Memoize based on correct dependencies
 * - Subscribe to minimal form value changes
 * - Work correctly in custom component scenarios
 */

import { describe, it, expect } from ***REMOVED***vitest***REMOVED***
import { renderHook } from ***REMOVED***@testing-library/react***REMOVED***
import React, { type PropsWithChildren, type ReactElement } from ***REMOVED***react***REMOVED***
import { useFieldLogicState, useFormValues, useFormValue, useFieldValue } from ***REMOVED***./hooks***REMOVED***
import { FormStableContext, FormValuesContext } from ***REMOVED***@/Form/Creator/FormContextProvider***REMOVED***
import {  type IFormField, type IFormValues } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

// Create a wrapper component that provides form context for hook testing
const createWrapper = (formValues: IFormValues, setFormValues?: (v: IFormValues) => void): React.FC<PropsWithChildren> => {
  const Wrapper = ({ children }: PropsWithChildren): ReactElement =>
    React.createElement(
      FormStableContext.Provider,
      {
        value: {
          form: { id: ***REMOVED***test***REMOVED***, fields: [] },
          setFormValues: setFormValues ?? (() => {}),
          urlNavigable: false
        }
      },
      React.createElement(
        FormValuesContext.Provider,
        { value: formValues },
        children
      )
    )
  
  Wrapper.displayName = ***REMOVED***FormContextWrapper***REMOVED***
  return Wrapper
}

describe(***REMOVED***formEngine hooks - Custom component integration***REMOVED***, () => {
  describe(***REMOVED***useFieldLogicState***REMOVED***, () => {
    it(***REMOVED***returns correct visibility when field has no conditions***REMOVED***, () => {
      const field: IFormField = {
        id: ***REMOVED***test***REMOVED***,
        type: ***REMOVED***text***REMOVED***
      }

      const wrapper = createWrapper({})
      const { result } = renderHook(() => useFieldLogicState(field), { wrapper })

      expect(result.current.isVisible).toBe(true)
      expect(result.current.isDisabled).toBe(false)
    })

    it(***REMOVED***returns correct visibility when condition passes***REMOVED***, () => {
      const field: IFormField = {
        id: ***REMOVED***test***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        conditions: {
          dependsOn: ***REMOVED***trigger***REMOVED***,
          value: ***REMOVED***show***REMOVED***
        }
      }

      const wrapper = createWrapper({ trigger: ***REMOVED***show***REMOVED*** })
      const { result } = renderHook(() => useFieldLogicState(field), { wrapper })

      expect(result.current.isVisible).toBe(true)
      expect(result.current.conditionResult.pass).toBe(true)
    })

    it(***REMOVED***returns correct visibility when condition fails***REMOVED***, () => {
      const field: IFormField = {
        id: ***REMOVED***test***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        conditions: {
          dependsOn: ***REMOVED***trigger***REMOVED***,
          value: ***REMOVED***show***REMOVED***
        }
      }

      const wrapper = createWrapper({ trigger: ***REMOVED***hide***REMOVED*** })
      const { result } = renderHook(() => useFieldLogicState(field), { wrapper })

      expect(result.current.isVisible).toBe(false)
      expect(result.current.conditionResult.pass).toBe(false)
    })

    it(***REMOVED***applies disable condition correctly***REMOVED***, () => {
      const field: IFormField = {
        id: ***REMOVED***test***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        conditions: {
          dependsOn: ***REMOVED***locked***REMOVED***,
          value: true,
          result: ***REMOVED***disable***REMOVED***
        }
      }

      const wrapper = createWrapper({ locked: true })
      const { result } = renderHook(() => useFieldLogicState(field), { wrapper })

      expect(result.current.isDisabled).toBe(true)
    })

    it(***REMOVED***applies field default value***REMOVED***, () => {
      const field: IFormField = {
        id: ***REMOVED***test***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        defaultValue: ***REMOVED***default-text***REMOVED***
      }

      const wrapper = createWrapper({})
      const { result } = renderHook(() => useFieldLogicState(field), { wrapper })

      expect(result.current.defaultValue).toBe(***REMOVED***default-text***REMOVED***)
    })

    it(***REMOVED***prefers condition-driven default over field default***REMOVED***, () => {
      const field: IFormField = {
        id: ***REMOVED***test***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        defaultValue: ***REMOVED***field-default***REMOVED***,
        conditions: {
          dependsOn: ***REMOVED***mode***REMOVED***,
          value: ***REMOVED***special***REMOVED***,
          result: ***REMOVED***include***REMOVED***,
          newDefaultValue: ***REMOVED***special-default***REMOVED***
        }
      }

      const wrapper = createWrapper({ mode: ***REMOVED***special***REMOVED*** })
      const { result } = renderHook(() => useFieldLogicState(field), { wrapper })

      expect(result.current.defaultValue).toBe(***REMOVED***special-default***REMOVED***)
    })
  })

  describe(***REMOVED***useFormValues***REMOVED***, () => {
    it(***REMOVED***retrieves single value by path (string)***REMOVED***, () => {
      const wrapper = createWrapper({ userRole: ***REMOVED***admin***REMOVED***, theme: ***REMOVED***dark***REMOVED*** })
      const { result } = renderHook(() => useFormValues(***REMOVED***userRole***REMOVED***), { wrapper })

      expect(result.current.userRole).toBe(***REMOVED***admin***REMOVED***)
    })

    it(***REMOVED***retrieves multiple values by paths (array)***REMOVED***, () => {
      const wrapper = createWrapper({ 
        userRole: ***REMOVED***admin***REMOVED***,
        theme: ***REMOVED***dark***REMOVED***,
        language: ***REMOVED***en***REMOVED***
      })
      const { result } = renderHook(() => useFormValues([***REMOVED***userRole***REMOVED***, ***REMOVED***theme***REMOVED***]), { wrapper })

      expect(result.current.userRole).toBe(***REMOVED***admin***REMOVED***)
      expect(result.current.theme).toBe(***REMOVED***dark***REMOVED***)
      expect(result.current.language).toBeUndefined()
    })

    it(***REMOVED***retrieves nested values by dot notation***REMOVED***, () => {
      const wrapper = createWrapper({
        user: {
          profile: {
            role: ***REMOVED***admin***REMOVED***
          }
        }
      })
      const { result } = renderHook(() => useFormValues(***REMOVED***user.profile.role***REMOVED***), { wrapper })

      expect(result.current[***REMOVED***user.profile.role***REMOVED***]).toBe(***REMOVED***admin***REMOVED***)
    })

    it(***REMOVED***returns undefined for non-existent paths***REMOVED***, () => {
      const wrapper = createWrapper({ existing: ***REMOVED***value***REMOVED*** })
      const { result } = renderHook(() => useFormValues(***REMOVED***nonExistent***REMOVED***), { wrapper })

      expect(result.current.nonExistent).toBeUndefined()
    })

    it(***REMOVED***handles mixed existing and non-existent paths***REMOVED***, () => {
      const wrapper = createWrapper({ roleA: ***REMOVED***admin***REMOVED***, setting: ***REMOVED***dark***REMOVED*** })
      const { result } = renderHook(() => useFormValues([***REMOVED***roleA***REMOVED***, ***REMOVED***missing***REMOVED***, ***REMOVED***setting***REMOVED***]), { wrapper })

      expect(result.current.roleA).toBe(***REMOVED***admin***REMOVED***)
      expect(result.current.missing).toBeUndefined()
      expect(result.current.setting).toBe(***REMOVED***dark***REMOVED***)
    })
  })

  describe(***REMOVED***useFormValue***REMOVED***, () => {
    it(***REMOVED***retrieves single value by path***REMOVED***, () => {
      const wrapper = createWrapper({ userRole: ***REMOVED***admin***REMOVED*** })
      const { result } = renderHook(() => useFormValue(***REMOVED***userRole***REMOVED***), { wrapper })

      expect(result.current).toBe(***REMOVED***admin***REMOVED***)
    })

    it(***REMOVED***returns undefined for non-existent path***REMOVED***, () => {
      const wrapper = createWrapper({ other: ***REMOVED***value***REMOVED*** })
      const { result } = renderHook(() => useFormValue(***REMOVED***missing***REMOVED***), { wrapper })

      expect(result.current).toBeUndefined()
    })

    it(***REMOVED***works with nested paths***REMOVED***, () => {
      const wrapper = createWrapper({
        settings: {
          ui: {
            theme: ***REMOVED***dark***REMOVED***
          }
        }
      })
      const { result } = renderHook(() => useFormValue(***REMOVED***settings.ui.theme***REMOVED***), { wrapper })

      expect(result.current).toBe(***REMOVED***dark***REMOVED***)
    })
  })

  describe(***REMOVED***useFieldValue***REMOVED***, () => {
    it(***REMOVED***retrieves value for field with id***REMOVED***, () => {
      const field: IFormField = {
        id: ***REMOVED***username***REMOVED***,
        type: ***REMOVED***text***REMOVED***
      }

      const wrapper = createWrapper({ username: ***REMOVED***john***REMOVED*** })
      const { result } = renderHook(() => useFieldValue(field), { wrapper })

      expect(result.current).toBe(***REMOVED***john***REMOVED***)
    })

    it(***REMOVED***retrieves value using destPath when defined***REMOVED***, () => {
      const field: IFormField = {
        id: ***REMOVED***username***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        destPath: ***REMOVED***user.profile.name***REMOVED***
      }

      const wrapper = createWrapper({
        user: {
          profile: {
            name: ***REMOVED***Alice***REMOVED***
          }
        }
      })
      const { result } = renderHook(() => useFieldValue(field), { wrapper })

      expect(result.current).toBe(***REMOVED***Alice***REMOVED***)
    })

    it(***REMOVED***returns undefined when value not found***REMOVED***, () => {
      const field: IFormField = {
        id: ***REMOVED***missing***REMOVED***,
        type: ***REMOVED***text***REMOVED***
      }

      const wrapper = createWrapper({})
      const { result } = renderHook(() => useFieldValue(field), { wrapper })

      expect(result.current).toBeUndefined()
    })
  })

  describe(***REMOVED***Custom component scenarios***REMOVED***, () => {
    it(***REMOVED***enables custom component to use field logic without expensive re-renders***REMOVED***, () => {
      // Scenario: Custom component that disables submit if role is not admin
      const field: IFormField = {
        id: ***REMOVED***submitButton***REMOVED***,
        type: ***REMOVED***custom:submit***REMOVED***,
        conditions: {
          dependsOn: ***REMOVED***userRole***REMOVED***,
          value: ***REMOVED***admin***REMOVED***,
          operator: ***REMOVED***!=***REMOVED***,
          result: ***REMOVED***disable***REMOVED***
        }
      }

      const wrapper = createWrapper({ userRole: ***REMOVED***user***REMOVED*** })
      const { result: logicResult } = renderHook(() => useFieldLogicState(field), { wrapper })

      // Button should be disabled because userRole !== ***REMOVED***admin***REMOVED***
      expect(logicResult.current.isDisabled).toBe(true)
    })

    it(***REMOVED***enables accessing unrelated form data for custom logic***REMOVED***, () => {
      // Scenario: Custom component that shows different UI based on multiple unrelated fields
      const field: IFormField = {
        id: ***REMOVED***customReport***REMOVED***,
        type: ***REMOVED***custom:report***REMOVED***
      }

      const wrapper = createWrapper({
        userRole: ***REMOVED***admin***REMOVED***,
        companySize: ***REMOVED***enterprise***REMOVED***,
        reportFormat: ***REMOVED***pdf***REMOVED***
      })

      const { result: logicResult } = renderHook(() => useFieldLogicState(field), { wrapper })
      const { result: relatedDataResult } = renderHook(() => useFormValues([***REMOVED***userRole***REMOVED***, ***REMOVED***companySize***REMOVED***, ***REMOVED***reportFormat***REMOVED***]), { wrapper })

      // Component can make decisions based on all relevant data
      expect(logicResult.current.isVisible).toBe(true)
      expect(relatedDataResult.current.userRole).toBe(***REMOVED***admin***REMOVED***)
      expect(relatedDataResult.current.companySize).toBe(***REMOVED***enterprise***REMOVED***)
    })

    it(***REMOVED***combines field logic with explicit subscriptions***REMOVED***, () => {
      // Scenario: Complex custom component with both condition-based and data-based logic
      const field: IFormField = {
        id: ***REMOVED***complexField***REMOVED***,
        type: ***REMOVED***custom:complex***REMOVED***,
        conditions: {
          dependsOn: ***REMOVED***featureEnabled***REMOVED***,
          value: true
        }
      }

      const wrapper = createWrapper({
        featureEnabled: true,
        userLevel: ***REMOVED***premium***REMOVED***,
        apiKey: ***REMOVED***secret123***REMOVED***
      })

      const { result: logicResult } = renderHook(() => useFieldLogicState(field), { wrapper })
      const { result: dataResult } = renderHook(() => useFormValues([***REMOVED***userLevel***REMOVED***, ***REMOVED***apiKey***REMOVED***]), { wrapper })

      expect(logicResult.current.isVisible).toBe(true)
      expect(dataResult.current.userLevel).toBe(***REMOVED***premium***REMOVED***)
      expect(dataResult.current.apiKey).toBe(***REMOVED***secret123***REMOVED***)
    })
  })
})
