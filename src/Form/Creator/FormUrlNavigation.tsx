import React, { createContext, type PropsWithChildren, type ReactElement, useCallback, useContext, useSyncExternalStore } from 'react'

const FORM_NAVIGATION_PARAM_PREFIX = '__axiom_form_nav_'
const NATIVE_LOCATION_EVENT = 'axiom-form-url-navigation'

export interface IFormUrlNavigationAdapter {
  location: string
  navigate: (url: string, options?: { replace?: boolean }) => void
}

interface IFormUrlNavigationContextValue {
  location: string
  navigate: (url: string, options?: { replace?: boolean }) => void
}

const FormUrlNavigationContext = createContext<IFormUrlNavigationContextValue | undefined>(undefined)

export const FormUrlNavigationProvider = ({
  adapter,
  children,
}: PropsWithChildren<{ adapter: IFormUrlNavigationAdapter }>): ReactElement => (
  <FormUrlNavigationContext.Provider value={adapter}>
    {children}
  </FormUrlNavigationContext.Provider>
)

const getNativeLocation = (): string => {
  if (typeof window === 'undefined') return ''
  return `${window.location.pathname}${window.location.search}${window.location.hash}`
}

const subscribeToNativeLocation = (listener: () => void): (() => void) => {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener('popstate', listener)
  window.addEventListener(NATIVE_LOCATION_EVENT, listener)
  return () => {
    window.removeEventListener('popstate', listener)
    window.removeEventListener(NATIVE_LOCATION_EVENT, listener)
  }
}

const navigateNative = (url: string, options?: { replace?: boolean }): void => {
  if (typeof window === 'undefined') return
  window.history[options?.replace === true ? 'replaceState' : 'pushState'](
    window.history.state,
    '',
    url
  )
  window.dispatchEvent(new Event(NATIVE_LOCATION_EVENT))
}

const getFormNavigationParam = (formId: string): string =>
  `${FORM_NAVIGATION_PARAM_PREFIX}${formId}`

const parseLocation = (location: string): URL => {
  const baseUrl = typeof window !== 'undefined' ? window.location.href : 'http://localhost/'
  return new URL(location, baseUrl)
}

export const useFormUrlNavigation = (): {
  getSectionId: (formId: string, level: number) => string | undefined
  getSectionUrl: (formId: string, level: number, id: string | undefined) => string
  setSectionId: (formId: string, level: number, id: string | undefined) => void
} => {
  const adapter = useContext(FormUrlNavigationContext)
  const nativeLocation = useSyncExternalStore(
    subscribeToNativeLocation,
    getNativeLocation,
    () => ''
  )
  const location = adapter?.location ?? nativeLocation
  const navigate = adapter?.navigate ?? navigateNative

  const getSectionIds = useCallback((formId: string): string[] => {
    const url = parseLocation(location)
    const serializedIds = url.searchParams.get(getFormNavigationParam(formId))
    if (serializedIds === null) return []

    try {
      const parsed: unknown = JSON.parse(serializedIds)
      return Array.isArray(parsed) && parsed.every(id => typeof id === 'string')
        ? parsed
        : []
    } catch {
      return []
    }
  }, [location])

  const getSectionId = useCallback((formId: string, level: number): string | undefined =>
    getSectionIds(formId)[level], [getSectionIds])

  const getSectionUrl = useCallback((formId: string, level: number, id: string | undefined): string => {
    const url = parseLocation(location)
    const paramName = getFormNavigationParam(formId)
    const sectionIds = getSectionIds(formId).slice(0, level)
    if (id !== undefined) sectionIds.push(id)
    if (sectionIds.length === 0) {
      url.searchParams.delete(paramName)
    } else {
      url.searchParams.set(paramName, JSON.stringify(sectionIds))
    }
    return `${url.pathname}${url.search}${url.hash}`
  }, [getSectionIds, location])

  const setSectionId = useCallback((formId: string, level: number, id: string | undefined): void => {
    navigate(getSectionUrl(formId, level, id))
  }, [getSectionUrl, navigate])

  return { getSectionId, getSectionUrl, setSectionId }
}
