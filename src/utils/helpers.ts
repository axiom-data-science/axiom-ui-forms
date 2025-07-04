import { type IValueChangeFn, type IValueType } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import debounce from ***REMOVED***lodash-es/debounce***REMOVED***
import { useEffect, useRef } from ***REMOVED***react***REMOVED***

export const createTextFieldDebounce = (onChange: IValueChangeFn, delay = 200): IValueChangeFn => {
  return debounce((newValue: IValueType | IValueType[] | undefined) => {
    onChange((newValue === ***REMOVED******REMOVED*** || newValue === null) ? undefined : newValue)
  }, delay)
}

export const useRenderCount = (): number => {
  const rendersNo = useRef(0)

  useEffect(() => {
    rendersNo.current++
  })

  return rendersNo.current
}
