import { type IFormMapping } from ***REMOVED***@/Form/FormMappingTypes***REMOVED***
import { base64ToJson, getQueryParam, jsonToBase64, updateUrlParam } from ***REMOVED***@/helpers***REMOVED***
import { atom } from ***REMOVED***jotai***REMOVED***

const urlArg = ***REMOVED***mapping***REMOVED***
const base64String = getQueryParam(urlArg)
const baseFormMappingAtom = atom<IFormMapping>(base64String !== null ? base64ToJson<IFormMapping>(base64String) : { fields: {}, $targetSchema: ***REMOVED******REMOVED*** })
const formMappingAtom = atom(
  (get) => {
    return get(baseFormMappingAtom)
  },
  (get, set, newFormMapping: IFormMapping) => {
    /* const u = new URL(window.location.href)
    u.searchParams.set(urlArg, jsonToBase64<IFormMapping>(newFormMapping))
    window.history.replaceState({}, ***REMOVED******REMOVED***, u.toString()) */
    updateUrlParam(urlArg, jsonToBase64<IFormMapping>(newFormMapping))
    set(baseFormMappingAtom, newFormMapping)
  }
)

export default formMappingAtom
