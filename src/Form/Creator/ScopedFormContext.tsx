import React, { createContext, useContext } from ***REMOVED***react***REMOVED***
import { type ICompositeValueType } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

export interface IScopedFormContextValue {
  scopedValue: ICompositeValueType
  scopedOnChange: (value: ICompositeValueType) => void
}

export const ScopedFormContext = createContext<IScopedFormContextValue | undefined>(undefined)

export const useScopedFormContext = (): IScopedFormContextValue | undefined => {
  return useContext(ScopedFormContext)
}

export const ScopedFormContextProvider: React.FC<{
  value: IScopedFormContextValue
  children: React.ReactNode
}> = ({ value, children }) => {
  return (
    <ScopedFormContext.Provider value={value}>
      {children}
    </ScopedFormContext.Provider>
  )
}
