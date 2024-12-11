import { type IForm } from '@/Form/FormCreatorTypes'
import { base64ToJson, jsonToBase64 } from '@/helpers'
import { atom } from 'jotai'

const exampleForm = {
  label: 'New form',
  id: 'newForm',
  fields: [
    {
      label: 'Label',
      id: 'label',
      type: 'text',
      required: true
    },
    {
      label: 'Description',
      id: 'description',
      type: 'long_text',
      required: true
    },
    {
      label: 'Is it true?',
      id: 'isit',
      type: 'boolean',
      required: false
    },
    {
      label: 'You must agree',
      id: 'agree',
      type: 'boolean',
      required: true
    },
    {
      label: 'Select one',
      id: 'color',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Red',
          value: 'red'
        },
        {
          label: 'Green',
          value: 'green'
        },
        {
          label: 'Blue',
          value: 'blue'
        }
      ]
    },
    {
      label: 'Pick a size',
      id: 'size',
      type: 'radio',
      required: true,
      layout: 'vertical',
      options: [
        {
          label: 'Small',
          value: 'small'
        },
        {
          label: 'Medium',
          value: 'medium'
        },
        {
          label: 'Large',
          value: 'large'
        }
      ]
    },
    {
      label: 'A few of your favorite things',
      id: 'favorites',
      type: 'text',
      multiple: true
    }
  ]
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
