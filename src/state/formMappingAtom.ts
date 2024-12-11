import { type IFormMapping } from '@/Form/FormMappingTypes'
import { base64ToJson, jsonToBase64 } from '@/helpers'
import { atom } from 'jotai'

const urlArg = 'mapping'
const url = new URL(window.location.href)
const base64String = url.searchParams.get(urlArg)

const baseFormMappingAtom = atom<IFormMapping>(base64String !== null ? base64ToJson<IFormMapping>(base64String) : { fields: {}, $targetSchema: '' })
const formMappingAtom = atom(
  (get) => {
    return get(baseFormMappingAtom)
  },
  (get, set, newFormMapping: IFormMapping) => {
    const u = new URL(window.location.href)
    u.searchParams.set(urlArg, jsonToBase64<IFormMapping>(newFormMapping))
    window.history.replaceState({}, '', u.toString())
    set(baseFormMappingAtom, newFormMapping)
  }
)

export default formMappingAtom
