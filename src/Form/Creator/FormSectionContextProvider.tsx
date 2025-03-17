import React, { createContext, type PropsWithChildren, type ReactElement, useMemo, useState } from ***REMOVED***react***REMOVED***

export interface IFormSectionContextValue {
  activeId?: string
  setActiveId: (v: string | undefined) => void
  path: string
}
export const FormSectionContext = createContext<IFormSectionContextValue>({
  path: ***REMOVED******REMOVED***,
  setActiveId: () => {}
})
export const FormSectionContextProvider = (props: PropsWithChildren & { id?: string, path?: string }): ReactElement => {
  const [activeId, setActiveId] = useState<string | undefined>(props.id)
  useMemo(() => {
    setActiveId(props.id)
  }, [props.id])
  return (
    <FormSectionContext.Provider value={{ activeId, setActiveId, path: props.path ?? ***REMOVED******REMOVED*** }}>
      {props.children}
    </FormSectionContext.Provider>
  )
}

export const useFormSectionContext = (): IFormSectionContextValue => {
  const ctx = React.useContext(FormSectionContext)
  if (!ctx) throw new Error(***REMOVED***useFormSectionContext must be used within FormSectionContextProvider***REMOVED***)
  return ctx
}
