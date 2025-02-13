import { type IFormFieldSection, type IObjectField, type IForm, type IFormField, type IValueType, type IFormValues } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***

export const getChildFields = (field: IFormField): IFormField[] => {
  return field.type === ***REMOVED***object***REMOVED*** || field.type === ***REMOVED***section***REMOVED*** ? field.fields ?? [] : []
}

export const addFieldPath = (field: IFormField, parentPath?: string[]): IFormField => {
  if (field.type === ***REMOVED***object***REMOVED*** && field.skip_path === true) {
    field.path = parentPath !== undefined ? parentPath.slice() : []
    field.level = parentPath !== undefined ? parentPath.length : 0
  } else {
    const newSegment = field.id // `${field.id}${field.multiple === true ? ***REMOVED***[]***REMOVED*** : ***REMOVED******REMOVED***}`
    field.path = parentPath !== undefined ? parentPath.concat(newSegment) : [newSegment]
    field.level = parentPath !== undefined ? parentPath.length + 1 : 1
  }
  if ((field.type === ***REMOVED***object***REMOVED*** || field.type === ***REMOVED***section***REMOVED***) && field.fields !== undefined) {
    field.fields = field.fields.map(childField => {
      return addFieldPath(childField, field.path)
    })
  }
  return field
}

export const getUniqueFormFields = (form: IForm): IFormField[] => {
  const fieldMap = Object.fromEntries(form.fields.map(f => [f.id, f]))
  return Object.values(fieldMap)
}

export const getFields = (fields: IFormField[]): IFormField[] => {
  const all = fields.map(field => {
    let fields = [field]
    const children = getChildFields(field)
    children.forEach(c => {
      fields = fields.concat(getFields([c]))
    })
    return fields
  }).flat(Infinity) as IFormField[]
  return all
}

export function copyAndAddPathToFields<T extends IForm | IFormFieldSection | IObjectField> (formOrContainer: T): T {
  const form = JSON.parse(JSON.stringify(formOrContainer)) as T
  // const fields = getFields(form.fields)
  form.fields = form.fields.map(field => {
    return addFieldPath(field)
  })
  return form
}

export function getFieldValue (field: IFormField, formValues: IFormValues): IValueType | IValueType[] | undefined {
  return formValues[getPathFromField(field)]
}

export function getPathFromField (field: IFormField): string {
  // console.log(`${field.path !== undefined ? field.path.join(***REMOVED***.***REMOVED***) : ***REMOVED***nopath***REMOVED***} = ${field.id}`)
  return field.path !== undefined ? field.path.join(***REMOVED***.***REMOVED***) : field.id
}
