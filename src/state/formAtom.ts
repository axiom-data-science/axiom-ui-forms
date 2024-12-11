import { type IForm } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import { base64ToJson, jsonToBase64 } from ***REMOVED***@/helpers***REMOVED***
import { atom } from ***REMOVED***jotai***REMOVED***

const exampleForm = {
  label: ***REMOVED***New form***REMOVED***,
  id: ***REMOVED***newForm***REMOVED***,
  fields: [
    {
      label: ***REMOVED***Label***REMOVED***,
      id: ***REMOVED***label***REMOVED***,
      type: ***REMOVED***text***REMOVED***,
      required: true
    },
    {
      label: ***REMOVED***Description***REMOVED***,
      id: ***REMOVED***description***REMOVED***,
      type: ***REMOVED***long_text***REMOVED***,
      required: true
    },
    {
      label: ***REMOVED***Is it true?***REMOVED***,
      id: ***REMOVED***isit***REMOVED***,
      type: ***REMOVED***boolean***REMOVED***,
      required: false
    },
    {
      label: ***REMOVED***You must agree***REMOVED***,
      id: ***REMOVED***agree***REMOVED***,
      type: ***REMOVED***boolean***REMOVED***,
      required: true
    },
    {
      label: ***REMOVED***Select one***REMOVED***,
      id: ***REMOVED***color***REMOVED***,
      type: ***REMOVED***select***REMOVED***,
      required: true,
      options: [
        {
          label: ***REMOVED***Red***REMOVED***,
          value: ***REMOVED***red***REMOVED***
        },
        {
          label: ***REMOVED***Green***REMOVED***,
          value: ***REMOVED***green***REMOVED***
        },
        {
          label: ***REMOVED***Blue***REMOVED***,
          value: ***REMOVED***blue***REMOVED***
        }
      ]
    },
    {
      label: ***REMOVED***Pick a size***REMOVED***,
      id: ***REMOVED***size***REMOVED***,
      type: ***REMOVED***radio***REMOVED***,
      required: true,
      layout: ***REMOVED***vertical***REMOVED***,
      options: [
        {
          label: ***REMOVED***Small***REMOVED***,
          value: ***REMOVED***small***REMOVED***
        },
        {
          label: ***REMOVED***Medium***REMOVED***,
          value: ***REMOVED***medium***REMOVED***
        },
        {
          label: ***REMOVED***Large***REMOVED***,
          value: ***REMOVED***large***REMOVED***
        }
      ]
    },
    {
      label: ***REMOVED***A few of your favorite things***REMOVED***,
      id: ***REMOVED***favorites***REMOVED***,
      type: ***REMOVED***text***REMOVED***,
      multiple: true
    }
  ]
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
