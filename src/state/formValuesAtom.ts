import { type IFormValues } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import { base64ToJson, getQueryParam, jsonToBase64, updateUrlParam } from ***REMOVED***@/helpers***REMOVED***
import { atom } from ***REMOVED***jotai***REMOVED***

const urlArg = ***REMOVED***values***REMOVED***
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
