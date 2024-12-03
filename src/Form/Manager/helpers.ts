import { type IForm, type IFormField } from '@/Form/FormCreatorTypes'

export const getUniqueFormFields = (form: IForm): IFormField[] => {
  const fieldMap = Object.fromEntries(form.fields.map(f => [f.id, f]))
  return Object.values(fieldMap)
}
