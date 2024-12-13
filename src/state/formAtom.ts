import { type IForm } from '@/Form/FormCreatorTypes'
import { testFields } from '@/Form/testData/fields'
import { base64ToJson, jsonToBase64 } from '@/helpers'
import { atom } from 'jotai'

const exampleForm = {
  label: 'New form',
  id: 'newForm',
  fields: testFields
}

const urlArg = 'form'
const url = new URL(window.location.href)
const base64String = url.searchParams.get(urlArg)

const baseFormAtom = atom<IForm>(base64String !== null ? base64ToJson<IForm>(base64String) : exampleForm as any as IForm)
const formAtom = atom(
  (get) => {
    return get(baseFormAtom)
  },
  (get, set, newForm: IForm) => {
    const u = new URL(window.location.href)
    u.searchParams.set(urlArg, jsonToBase64<IForm>(newForm))
    window.history.replaceState({}, '', u.toString())
    set(baseFormAtom, newForm)
  }
)

export default formAtom
