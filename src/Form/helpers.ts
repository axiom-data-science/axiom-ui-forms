import { type IFormFieldSection, type IObjectField, type IForm, type IFormField, type IValueType, type IFormValues } from '@/Form/FormCreatorTypes'

export const getChildFields = (field: IFormField): IFormField[] => {
  return field.type === 'object' || field.type === 'section' ? field.fields ?? [] : []
}

export const addFieldPath = (field: IFormField, parentPath?: string[]): IFormField => {
  if (field.type === 'object' && field.skip_path === true) {
    field.path = parentPath !== undefined ? parentPath.slice() : []
    field.level = parentPath !== undefined ? parentPath.length : 0
  } else {
    const newSegment = field.id // `${field.id}${field.multiple === true ? '[]' : ''}`
    field.path = parentPath !== undefined ? parentPath.concat(newSegment) : [newSegment]
    field.level = parentPath !== undefined ? parentPath.length + 1 : 1
  }
  if ((field.type === 'object' || field.type === 'section') && field.fields !== undefined) {
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
  // console.log(`${field.path !== undefined ? field.path.join('.') : 'nopath'} = ${field.id}`)
  return field.path !== undefined ? field.path.join('.') : field.id
}

// THIS DOESN'T HANDLE NESTED YET
export const checkCondition = (field: IFormField, formValues: IFormValues): boolean => {
  if (field.conditions !== undefined) {
    const dependsOn = Array.isArray(field.conditions.dependsOn) ? field.conditions.dependsOn : [field.conditions.dependsOn]

    const val = field.conditions.value
    return dependsOn.every(d => val !== undefined
      ? formValues[d] === val
      : formValues !== null && formValues[d] !== undefined
    )
  }
  return true
}

export function cleanUnusedDependenciesFromFormValues (form: IForm, formValues: IFormValues): IFormValues {
  Object.keys(formValues).forEach(key => {
    const field = form.fields.find(f => f.id === key)
    if (field !== undefined && !checkCondition(field, formValues)) {
      formValues[key] = undefined
    }
  })

  const fields = getFields(form.fields)
  const fieldIds = fields.map(f => f.id)
  const newFormValues = Object.fromEntries(Object.entries(formValues).filter(([key]) => fieldIds.includes(key)))
  return newFormValues
}
