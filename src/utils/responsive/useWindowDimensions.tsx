import { useState, useEffect } from 'react'

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

    window.addEventListener('resize', handleResize)
    return () => { window.removeEventListener('resize', handleResize) }
  }, [])

  return windowDimensions
}
