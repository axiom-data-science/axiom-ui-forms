import React, { createContext, type PropsWithChildren, type ReactElement, useMemo, useState } from 'react'

export interface IActiveIdValue {
  activeId?: string
  setActiveId?: (v: string | undefined) => void
  path: string
}
export const ActiveIDContext = createContext<IActiveIdValue>({ path: '' })
const ActiveIdProvider = (props: PropsWithChildren & { id?: string, path?: string }): ReactElement => {
  const [activeId, setActiveId] = useState<string | undefined>(props.id)
  useMemo(() => {
    setActiveId(props.id)
  }, [props.id])
  return (
    <ActiveIDContext.Provider value={{ activeId, setActiveId, path: props.path ?? '' }}>
      {props.children}
    </ActiveIDContext.Provider>
  )
}
export default ActiveIdProvider
