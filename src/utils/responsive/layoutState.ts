import { atom } from ***REMOVED***jotai***REMOVED***

type ISize = ***REMOVED***sm***REMOVED*** | ***REMOVED***md***REMOVED*** | ***REMOVED***lg***REMOVED*** | ***REMOVED***xl***REMOVED***

export const getWindowSize = (): ISize => {
  const width = window.innerWidth
  if (width < 768) return ***REMOVED***sm***REMOVED***
  if (width < 1024) return ***REMOVED***md***REMOVED***
  if (width < 1280) return ***REMOVED***lg***REMOVED***
  return ***REMOVED***xl***REMOVED***
}

const layoutAtom = atom<{ size: ISize }>({
  size: getWindowSize()
})

export default layoutAtom
