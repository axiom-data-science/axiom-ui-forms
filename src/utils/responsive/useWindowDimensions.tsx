import { useState, useEffect } from ***REMOVED***react***REMOVED***

export interface ISize { width: number, height: number }

export const getWindowDimensions = (): ISize => {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height
  }
}

export const useWindowDimensions = (): ISize => {
  const [windowDimensions, setWindowDimensions] = useState<ISize>(getWindowDimensions())

  useEffect(() => {
    function handleResize (): void {
      setWindowDimensions(getWindowDimensions())
    }

    window.addEventListener(***REMOVED***resize***REMOVED***, handleResize)
    return () => { window.removeEventListener(***REMOVED***resize***REMOVED***, handleResize) }
  }, [])

  return windowDimensions
}
