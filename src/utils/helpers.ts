import { type IValueChangeFn, type IValueType } from '@/Form/Creator/FormCreatorTypes'
import debounce from 'lodash-es/debounce'
import { useEffect, useRef } from 'react'

export const createTextFieldDebounce = (onChange: IValueChangeFn, delay = 200): IValueChangeFn => {
  return debounce((newValue: IValueType | IValueType[] | undefined) => {
    onChange((newValue === '' || newValue === null) ? undefined : newValue)
  }, delay)
}

export const useRenderCount = (): number => {
  const rendersNo = useRef(0)

  useEffect(() => {
    rendersNo.current++
  })

  return rendersNo.current
}
