import { type IForm } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import { testFields } from ***REMOVED***@/Form/testData/fields***REMOVED***
import { base64ToJson, jsonToBase64 } from ***REMOVED***@/helpers***REMOVED***
import { atom } from ***REMOVED***jotai***REMOVED***

const exampleForm = {
  label: ***REMOVED***New form***REMOVED***,
  id: ***REMOVED***newForm***REMOVED***,
  fields: testFields
}

const urlArg = ***REMOVED***form***REMOVED***
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
    window.history.replaceState({}, ***REMOVED******REMOVED***, u.toString())
    set(baseFormAtom, newForm)
  }
)

export default formAtom
