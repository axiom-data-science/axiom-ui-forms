import { type IForm } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import testForm from ***REMOVED***@/Form/testData/testForm***REMOVED***
import { base64ToJson, getQueryParam, jsonToBase64, updateUrlParam } from ***REMOVED***@/helpers***REMOVED***
import { atom } from ***REMOVED***jotai***REMOVED***

const exampleForm = structuredClone(testForm)

const urlArg = ***REMOVED***form***REMOVED***
const base64String = getQueryParam(urlArg)
const baseFormAtom = atom<IForm>(base64String !== null ? base64ToJson<IForm>(base64String) : exampleForm as any as IForm)
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
