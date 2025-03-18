import { type IFieldInputProps, type IForm, type IFormValues } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import React, { createContext, type ReactElement, type PropsWithChildren } from ***REMOVED***react***REMOVED***

export interface IFormContextValue {
  form: IForm
  formValues: IFormValues
  setFormValues: (v: IFormValues) => void
  inputOverrides?: Record<string, React.FC<IFieldInputProps>>
  urlNavigable?: boolean
  schema?: JSONSchema6
}

export const FormContext = createContext<IFormContextValue>({
  form: { id: ***REMOVED******REMOVED***, label: ***REMOVED******REMOVED*** },
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
  const ctx = React.useContext(FormContext)
  if (!ctx) throw new Error(***REMOVED***useFormSectionContext must be used within FormSectionContextProvider***REMOVED***)
  return ctx
}
