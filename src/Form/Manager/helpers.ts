import { type IForm, type IFormField } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***

export const getUniqueFormFields = (form: IForm): IFormField[] => {
  const fieldMap = Object.fromEntries(form.fields.map(f => [f.id, f]))
  return Object.values(fieldMap)
}
