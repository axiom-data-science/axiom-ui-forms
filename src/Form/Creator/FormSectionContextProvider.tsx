import React, { createContext, type PropsWithChildren, type ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { useFormUrlNavigation } from '@/Form/Creator/FormUrlNavigation'

export interface IFormSectionContextValue {
  activeId?: string
  setActiveId: (v: string | undefined) => void
  path: string
  getSectionUrl: (id: string) => string
  urlNavigable: boolean
}
export const FormSectionContext = createContext<IFormSectionContextValue>({
  path: '',
  setActiveId: () => {},
  getSectionUrl: () => '',
  urlNavigable: false
})

const FormNavigationDepthContext = createContext<number | undefined>(undefined)

export const FormNavigationDepthProvider = ({
  depth,
  children,
}: PropsWithChildren<{ depth: number | undefined }>): ReactElement => (
  <FormNavigationDepthContext.Provider value={depth}>
    {children}
  </FormNavigationDepthContext.Provider>
)

export const useFormNavigationDepth = (): number | undefined => React.useContext(FormNavigationDepthContext)

export const FormSectionContextProvider = (props: PropsWithChildren & {
  id?: string
  path?: string
  formId?: string
  level?: number
  navigationDepth?: number
  urlNavigable?: boolean
}): ReactElement => {
  const [activeId, setActiveId] = useState<string | undefined>(props.id)
  const { getSectionUrl, setSectionId } = useFormUrlNavigation()
  const setSectionIdRef = useRef(setSectionId)
  setSectionIdRef.current = setSectionId

  useEffect(() => {
    setActiveId(props.id)
  }, [props.id])

  const updateActiveId = useCallback((id: string | undefined): void => {
    setActiveId(id)
    const navigationDepth = props.navigationDepth ?? props.level
    if (props.urlNavigable === true && props.formId !== undefined && navigationDepth !== undefined) {
      setSectionIdRef.current(props.formId, navigationDepth, id)
    }
  }, [props.formId, props.level, props.navigationDepth, props.urlNavigable])

  const navigationDepth = props.navigationDepth ?? props.level
  const getUrlForSection = useCallback((id: string): string =>
    props.formId !== undefined && navigationDepth !== undefined
      ? getSectionUrl(props.formId, navigationDepth, id)
      : '', [getSectionUrl, navigationDepth, props.formId])

  return (
    <FormSectionContext.Provider value={{
      activeId,
      setActiveId: updateActiveId,
      path: props.path ?? '',
      getSectionUrl: getUrlForSection,
      urlNavigable: props.urlNavigable ?? false
    }}>
      {props.children}
    </FormSectionContext.Provider>
  )
}

export const useFormSectionContext = (): IFormSectionContextValue => {
  const ctx = React.useContext(FormSectionContext)
  if (!ctx) throw new Error('useFormSectionContext must be used within FormSectionContextProvider')
  return ctx
}
