import { type IValueChangeFn, type IValueType } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import debounce from ***REMOVED***lodash-es/debounce***REMOVED***
import { useCallback, useEffect, useRef } from ***REMOVED***react***REMOVED***

export const createTextFieldDebounce = (onChange: IValueChangeFn, delay = 200): IValueChangeFn => {
  return debounce((newValue: IValueType | IValueType[] | undefined) => {
    onChange(newValue === ***REMOVED******REMOVED*** || newValue === null ? undefined : newValue)
  }, delay)
}

/**
 * Hook that manages debounced onChange with proper cleanup on unmount
 * Prevents onChange from firing after component unmounts during the delay period
 */
export const useDebounceCallback = (
  callback: IValueChangeFn,
  delay: number = 200
): IValueChangeFn => {
  const debouncedRef = useRef<ReturnType<typeof debounce> | null>(null)

  // Create debounced callback once and store in ref
  useEffect(() => {
    debouncedRef.current = debounce((newValue: IValueType | IValueType[] | undefined) => {
      callback(newValue === ***REMOVED******REMOVED*** || newValue === null ? undefined : newValue)
    }, delay)

    // Cleanup: cancel pending debounce calls on unmount
    return () => {
      debouncedRef.current?.cancel()
    }
  }, [callback, delay])

  // Return the debounced function
  return useCallback((newValue: IValueType | IValueType[] | undefined) => {
    debouncedRef.current?.(newValue)
  }, [])
}

export const useRenderCount = (): number => {
  const rendersNo = useRef(0)

  useEffect(() => {
    rendersNo.current++
  })

  return rendersNo.current
}
