import { type IFormValues } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import { base64ToJson, jsonToBase64 } from ***REMOVED***@/helpers***REMOVED***
import { atom } from ***REMOVED***jotai***REMOVED***

const urlArg = ***REMOVED***values***REMOVED***
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
    window.history.replaceState({}, ***REMOVED******REMOVED***, u.toString())
    set(baseFormValuesAtom, newFormValues)
  }
)

export default formValuesAtom
