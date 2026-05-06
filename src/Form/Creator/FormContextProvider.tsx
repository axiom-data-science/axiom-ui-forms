"use client";
import { type IFieldInputProps, type IForm, type IFormValues, type IValueChangeFn } from '@/Form/Creator/FormCreatorTypes'
import { type JSONSchema6 } from 'json-schema'
import React, { createContext, type ReactElement, type PropsWithChildren, useContext } from 'react'

// Stable context — never changes after form mount (form definition, callbacks, config)
export interface IFormStableContextValue {
  form: IForm
  setFormValues: (v: IFormValues) => void
  onChange?: IValueChangeFn
  inputOverrides?: Record<string, React.FC<IFieldInputProps>>
  urlNavigable?: boolean
  schema?: JSONSchema6
}

// Combined interface for backward-compat and external consumers
export interface IFormContextValue extends IFormStableContextValue {
  formValues: IFormValues
}

// Stable context — subscribe here for form definition / callbacks (no re-render on keystroke)
export const FormStableContext = createContext<IFormStableContextValue>({
  form: { id: '', label: '' },
  setFormValues: () => {}
})

// Values context — re-renders on every formValues change
export const FormValuesContext = createContext<IFormValues>({})

// Legacy alias kept for provider usage in FormCreator
export const FormContext = FormStableContext

export const FormContextProvider = ({ children, formValues, ...stableProps }: IFormContextValue & PropsWithChildren): ReactElement => {
  return (
    <FormStableContext.Provider value={stableProps}>
      <FormValuesContext.Provider value={formValues}>
        {children}
      </FormValuesContext.Provider>
    </FormStableContext.Provider>
  )
}

/** Returns stable context values (form definition, callbacks). Does NOT re-render on keystroke. */
export const useFormContext = (): IFormStableContextValue => {
  const ctx = useContext(FormStableContext)
  if (!ctx) throw new Error('useFormContext must be used within FormContextProvider')
  return ctx
}

/** Returns current formValues. Re-renders on every formValues change. */
export const useFormValues = (): IFormValues => useContext(FormValuesContext)
