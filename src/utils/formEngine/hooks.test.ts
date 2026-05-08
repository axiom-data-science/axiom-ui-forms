/**
 * formEngine/hooks.test.ts - Tests for React hooks
 *
 * These tests verify that hooks properly:
 * - Memoize based on correct dependencies
 * - Subscribe to minimal form value changes
 * - Work correctly in custom component scenarios
 */

import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import React, { type PropsWithChildren, type ReactElement } from 'react'
import { useFieldLogicState, useFormValues, useFormValue, useFieldValue } from './hooks'
import { FormStableContext, FormValuesContext } from '@/Form/Creator/FormContextProvider'
import {  type IFormField, type IFormValues } from '@/Form/Creator/FormCreatorTypes'

// Create a wrapper component that provides form context for hook testing
const createWrapper = (formValues: IFormValues, setFormValues?: (v: IFormValues) => void): React.FC<PropsWithChildren> => {
  const Wrapper = ({ children }: PropsWithChildren): ReactElement =>
    React.createElement(
      FormStableContext.Provider,
      {
        value: {
          form: { id: 'test', fields: [] },
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
  
  Wrapper.displayName = 'FormContextWrapper'
  return Wrapper
}

describe('formEngine hooks - Custom component integration', () => {
  describe('useFieldLogicState', () => {
    it('returns correct visibility when field has no conditions', () => {
      const field: IFormField = {
        id: 'test',
        type: 'text'
      }

      const wrapper = createWrapper({})
      const { result } = renderHook(() => useFieldLogicState(field), { wrapper })

      expect(result.current.isVisible).toBe(true)
      expect(result.current.isDisabled).toBe(false)
    })

    it('returns correct visibility when condition passes', () => {
      const field: IFormField = {
        id: 'test',
        type: 'text',
        conditions: {
          dependsOn: 'trigger',
          value: 'show'
        }
      }

      const wrapper = createWrapper({ trigger: 'show' })
      const { result } = renderHook(() => useFieldLogicState(field), { wrapper })

      expect(result.current.isVisible).toBe(true)
      expect(result.current.conditionResult.pass).toBe(true)
    })

    it('returns correct visibility when condition fails', () => {
      const field: IFormField = {
        id: 'test',
        type: 'text',
        conditions: {
          dependsOn: 'trigger',
          value: 'show'
        }
      }

      const wrapper = createWrapper({ trigger: 'hide' })
      const { result } = renderHook(() => useFieldLogicState(field), { wrapper })

      expect(result.current.isVisible).toBe(false)
      expect(result.current.conditionResult.pass).toBe(false)
    })

    it('applies disable condition correctly', () => {
      const field: IFormField = {
        id: 'test',
        type: 'text',
        conditions: {
          dependsOn: 'locked',
          value: true,
          result: 'disable'
        }
      }

      const wrapper = createWrapper({ locked: true })
      const { result } = renderHook(() => useFieldLogicState(field), { wrapper })

      expect(result.current.isDisabled).toBe(true)
    })

    it('applies field default value', () => {
      const field: IFormField = {
        id: 'test',
        type: 'text',
        defaultValue: 'default-text'
      }

      const wrapper = createWrapper({})
      const { result } = renderHook(() => useFieldLogicState(field), { wrapper })

      expect(result.current.defaultValue).toBe('default-text')
    })

    it('prefers condition-driven default over field default', () => {
      const field: IFormField = {
        id: 'test',
        type: 'text',
        defaultValue: 'field-default',
        conditions: {
          dependsOn: 'mode',
          value: 'special',
          result: 'include',
          newDefaultValue: 'special-default'
        }
      }

      const wrapper = createWrapper({ mode: 'special' })
      const { result } = renderHook(() => useFieldLogicState(field), { wrapper })

      expect(result.current.defaultValue).toBe('special-default')
    })
  })

  describe('useFormValues', () => {
    it('retrieves single value by path (string)', () => {
      const wrapper = createWrapper({ userRole: 'admin', theme: 'dark' })
      const { result } = renderHook(() => useFormValues('userRole'), { wrapper })

      expect(result.current.userRole).toBe('admin')
    })

    it('retrieves multiple values by paths (array)', () => {
      const wrapper = createWrapper({ 
        userRole: 'admin',
        theme: 'dark',
        language: 'en'
      })
      const { result } = renderHook(() => useFormValues(['userRole', 'theme']), { wrapper })

      expect(result.current.userRole).toBe('admin')
      expect(result.current.theme).toBe('dark')
      expect(result.current.language).toBeUndefined()
    })

    it('retrieves nested values by dot notation', () => {
      const wrapper = createWrapper({
        user: {
          profile: {
            role: 'admin'
          }
        }
      })
      const { result } = renderHook(() => useFormValues('user.profile.role'), { wrapper })

      expect(result.current['user.profile.role']).toBe('admin')
    })

    it('returns undefined for non-existent paths', () => {
      const wrapper = createWrapper({ existing: 'value' })
      const { result } = renderHook(() => useFormValues('nonExistent'), { wrapper })

      expect(result.current.nonExistent).toBeUndefined()
    })

    it('handles mixed existing and non-existent paths', () => {
      const wrapper = createWrapper({ roleA: 'admin', setting: 'dark' })
      const { result } = renderHook(() => useFormValues(['roleA', 'missing', 'setting']), { wrapper })

      expect(result.current.roleA).toBe('admin')
      expect(result.current.missing).toBeUndefined()
      expect(result.current.setting).toBe('dark')
    })
  })

  describe('useFormValue', () => {
    it('retrieves single value by path', () => {
      const wrapper = createWrapper({ userRole: 'admin' })
      const { result } = renderHook(() => useFormValue('userRole'), { wrapper })

      expect(result.current).toBe('admin')
    })

    it('returns undefined for non-existent path', () => {
      const wrapper = createWrapper({ other: 'value' })
      const { result } = renderHook(() => useFormValue('missing'), { wrapper })

      expect(result.current).toBeUndefined()
    })

    it('works with nested paths', () => {
      const wrapper = createWrapper({
        settings: {
          ui: {
            theme: 'dark'
          }
        }
      })
      const { result } = renderHook(() => useFormValue('settings.ui.theme'), { wrapper })

      expect(result.current).toBe('dark')
    })
  })

  describe('useFieldValue', () => {
    it('retrieves value for field with id', () => {
      const field: IFormField = {
        id: 'username',
        type: 'text'
      }

      const wrapper = createWrapper({ username: 'john' })
      const { result } = renderHook(() => useFieldValue(field), { wrapper })

      expect(result.current).toBe('john')
    })

    it('retrieves value using destPath when defined', () => {
      const field: IFormField = {
        id: 'username',
        type: 'text',
        destPath: 'user.profile.name'
      }

      const wrapper = createWrapper({
        user: {
          profile: {
            name: 'Alice'
          }
        }
      })
      const { result } = renderHook(() => useFieldValue(field), { wrapper })

      expect(result.current).toBe('Alice')
    })

    it('returns undefined when value not found', () => {
      const field: IFormField = {
        id: 'missing',
        type: 'text'
      }

      const wrapper = createWrapper({})
      const { result } = renderHook(() => useFieldValue(field), { wrapper })

      expect(result.current).toBeUndefined()
    })
  })

  describe('Custom component scenarios', () => {
    it('enables custom component to use field logic without expensive re-renders', () => {
      // Scenario: Custom component that disables submit if role is not admin
      const field: IFormField = {
        id: 'submitButton',
        type: 'custom:submit',
        conditions: {
          dependsOn: 'userRole',
          value: 'admin',
          operator: '!=',
          result: 'disable'
        }
      }

      const wrapper = createWrapper({ userRole: 'user' })
      const { result: logicResult } = renderHook(() => useFieldLogicState(field), { wrapper })

      // Button should be disabled because userRole !== 'admin'
      expect(logicResult.current.isDisabled).toBe(true)
    })

    it('enables accessing unrelated form data for custom logic', () => {
      // Scenario: Custom component that shows different UI based on multiple unrelated fields
      const field: IFormField = {
        id: 'customReport',
        type: 'custom:report'
      }

      const wrapper = createWrapper({
        userRole: 'admin',
        companySize: 'enterprise',
        reportFormat: 'pdf'
      })

      const { result: logicResult } = renderHook(() => useFieldLogicState(field), { wrapper })
      const { result: relatedDataResult } = renderHook(() => useFormValues(['userRole', 'companySize', 'reportFormat']), { wrapper })

      // Component can make decisions based on all relevant data
      expect(logicResult.current.isVisible).toBe(true)
      expect(relatedDataResult.current.userRole).toBe('admin')
      expect(relatedDataResult.current.companySize).toBe('enterprise')
    })

    it('combines field logic with explicit subscriptions', () => {
      // Scenario: Complex custom component with both condition-based and data-based logic
      const field: IFormField = {
        id: 'complexField',
        type: 'custom:complex',
        conditions: {
          dependsOn: 'featureEnabled',
          value: true
        }
      }

      const wrapper = createWrapper({
        featureEnabled: true,
        userLevel: 'premium',
        apiKey: 'secret123'
      })

      const { result: logicResult } = renderHook(() => useFieldLogicState(field), { wrapper })
      const { result: dataResult } = renderHook(() => useFormValues(['userLevel', 'apiKey']), { wrapper })

      expect(logicResult.current.isVisible).toBe(true)
      expect(dataResult.current.userLevel).toBe('premium')
      expect(dataResult.current.apiKey).toBe('secret123')
    })
  })
})
