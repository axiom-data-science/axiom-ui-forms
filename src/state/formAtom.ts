import { type IForm } from '@/Form/Creator/FormCreatorTypes'
import { base64ToJson, getQueryParam, jsonToBase64, updateUrlParam } from '@/helpers'
import { atom } from 'jotai'

const urlArg = 'form'
const base64String = getQueryParam(urlArg)
const baseFormAtom = atom<IForm>((base64String !== null ? base64ToJson<IForm>(base64String) : {}) as any as IForm)
const formAtom = atom(
  (get) => {
    return get(baseFormAtom)
  },
  (get, set, newForm: IForm) => {
    updateUrlParam(urlArg, jsonToBase64<IForm>(newForm))
    set(baseFormAtom, newForm)
  }
)

export default formAtom
