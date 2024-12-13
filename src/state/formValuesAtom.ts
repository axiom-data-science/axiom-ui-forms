import { type IFormValues } from '@/Form/FormCreatorTypes'
import { base64ToJson, jsonToBase64 } from '@/helpers'
import { atom } from 'jotai'

const urlArg = 'values'
const url = new URL(window.location.href)
const base64String = url.searchParams.get(urlArg)

const baseFormValuesAtom = atom<IFormValues>(base64String !== null
  ? base64ToJson<IFormValues>(base64String)
  : {}
)
const formValuesAtom = atom(
  (get) => {
    return get(baseFormValuesAtom)
  },
  (get, set, newFormValues: IFormValues) => {
    const u = new URL(window.location.href)
    u.searchParams.set(urlArg, jsonToBase64<IFormValues>(newFormValues))
    window.history.replaceState({}, '', u.toString())
    set(baseFormValuesAtom, newFormValues)
  }
)

export default formValuesAtom
