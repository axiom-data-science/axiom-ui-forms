import { type IFieldInputProps, type IForm, type IFormValues } from '@/Form/Creator/FormCreatorTypes'
import { type JSONSchema6 } from 'json-schema'
import React, { createContext, type ReactElement, type PropsWithChildren, useContext } from 'react'

export interface IFormContextValue {
  form: IForm
  formValues: IFormValues
  setFormValues: (v: IFormValues) => void
  inputOverrides?: Record<string, React.FC<IFieldInputProps>>
  urlNavigable?: boolean
  schema?: JSONSchema6
}

export const FormContext = createContext<IFormContextValue>({
  form: { id: '', label: '' },
  formValues: {},
  setFormValues: (v) => {}
})

export const FormContextProvider = ({ children, ...props }: IFormContextValue & PropsWithChildren): ReactElement => {
  return (
    <FormContext.Provider value={{ ...props }}>
      {children}
    </FormContext.Provider>
  )
}

export const useFormContext = (): IFormContextValue => {
  const ctx = useContext(FormContext)
  if (!ctx) throw new Error('useFormSectionContext must be used within FormSectionContextProvider')
  return ctx
}
