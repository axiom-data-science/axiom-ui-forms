import { type IFormValues } from '@/Form/Creator/FormCreatorTypes'
import { base64ToJson, getQueryParam, jsonToBase64, updateUrlParam } from '@/helpers'
import { atom } from 'jotai'

const urlArg = 'values'
const base64String = getQueryParam(urlArg)

const baseFormValuesAtom = atom<IFormValues>(base64String !== null
  ? base64ToJson<IFormValues>(base64String)
  : {}
)
const formValuesAtom = atom(
  (get) => {
    return get(baseFormValuesAtom)
  },
  (get, set, newFormValues: IFormValues) => {
    updateUrlParam(urlArg, jsonToBase64<IFormValues>(newFormValues))
    set(baseFormValuesAtom, newFormValues)
  }
)

export default formValuesAtom
