import React, { createContext, type PropsWithChildren, type ReactElement, useMemo, useState } from ***REMOVED***react***REMOVED***

export interface IActiveIdValue {
  activeId?: string
  setActiveId?: (v: string | undefined) => void
  path: string
}
export const ActiveIDContext = createContext<IActiveIdValue>({ path: ***REMOVED******REMOVED*** })
const ActiveIdProvider = (props: PropsWithChildren & { id?: string, path?: string }): ReactElement => {
  const [activeId, setActiveId] = useState<string | undefined>(props.id)
  useMemo(() => {
    setActiveId(props.id)
  }, [props.id])
  return (
    <ActiveIDContext.Provider value={{ activeId, setActiveId, path: props.path ?? ***REMOVED******REMOVED*** }}>
      {props.children}
    </ActiveIDContext.Provider>
  )
}
export default ActiveIdProvider
