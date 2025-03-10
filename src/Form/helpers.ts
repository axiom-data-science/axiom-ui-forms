import { type IFormSectionStatus } from ***REMOVED***@/Form/Creator/FormCreator***REMOVED***
import { type IFormFieldSection, type IObjectField, type IForm, type IFormField, type IValueType, type IFormValues, type IFormSection, type IFormValueState } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

export const getChildFields = (field: { id: string, fields?: IFormField[] }): IFormField[] => {
  return field?.fields ?? []
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
  const fieldMap = Object.fromEntries((form?.fields ?? []).map(f => [f.id, f]))
  return Object.values(fieldMap)
}

export const getFields = (fields?: Array<{ id: string, fields?: IFormField[] }>): IFormField[] => {
  if (fields === undefined) {
    return []
  }
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
  form.fields = form?.fields?.map(field => {
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

// THIS DOESN***REMOVED***T HANDLE NESTED YET
export const checkCondition = (field: IFormField, formValues: IFormValues): boolean => {
  if (field.conditions !== undefined) {
    const dependsOn = Array.isArray(field.conditions.dependsOn) ? field.conditions.dependsOn : [field.conditions.dependsOn]

    const val = field.conditions.value
    return dependsOn.every(d => val !== undefined
      ? formValues[d] === val
      : formValues !== null && formValues[d] !== undefined && formValues[d] !== false
    )
  }
  return true
}

export function getFieldsFromFormSection (formSection: IFormSection): IFormField[] {
  const pageFields = formSection?.pages?.map(p => getFieldsFromFormSection(p)).flat(1)
  const wizardFields = formSection?.wizard_steps?.map(p => getFieldsFromFormSection(p)).flat(1)
  const fields = getFields((formSection?.fields ?? [])).concat(pageFields ?? []).concat(wizardFields ?? [])
  return fields
}

export function cleanUnusedDependenciesFromFormValues (form: IForm, formValues: IFormValues): IFormValues {
  const fields = getFieldsFromFormSection(form)
  Object.keys(formValues).forEach(key => {
    const field = fields?.find(f => f.id === key)
    if (field !== undefined && !checkCondition(field, formValues)) {
      formValues[key] = undefined
    }
  })

  const fieldIds = fields.map(f => f.id)
  const newFormValues = Object.fromEntries(Object.entries(formValues).filter(([key]) => fieldIds.includes(key)))
  return newFormValues
}

const testField = (field: IFormField, formValues: IFormValues): boolean => {
  const val = formValues[field.id]
  return val !== undefined && val !== null && val !== ***REMOVED******REMOVED***
}

export const calculateSectionStatus = (sections: IFormSection[], formValueState: IFormValueState): IFormSectionStatus => {
  const [formValues] = formValueState
  return Object.fromEntries(sections.map(s => {
    const fields = getFieldsFromFormSection(s).filter(f => f.type !== ***REMOVED***object***REMOVED***)
    const total = fields.length
    const completed = fields.filter(f => testField(f, formValues)).length
    const required = fields.filter(f => f.required)
    const requiredTotal = required.length
    const requiredCompleted = required.filter(f => testField(f, formValues)).length
    const valid = requiredTotal === requiredCompleted
    return [s.id, { completed, total, requiredTotal, requiredCompleted, valid }]
  }))
}
