import { type IFormSection, type IFormValues, type IValueType, type IFormField } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import get from ***REMOVED***lodash/get***REMOVED***

/**
 * Returns the JSON path for a given field
 *
 * @param field - The field to get the JSON path for
 * @param index - The index of the field in the array (optional)
 * @returns The JSON path for the given field
 */
export const makeJsonPath = (field: IFormField, index?: number): string => {
  const fieldExtra = `${field.multiple && (field.index !== undefined || index !== undefined) ? `[${index ?? field.index}]` : ***REMOVED******REMOVED***}`
  if (field.destPath !== undefined) {
    return `${field.destPath}${fieldExtra}`
  } else if (field.path === undefined) {
    return `${field.id}${fieldExtra}`
  } else {
    const path = field.path
    const pathLen = path.length
    return field.path.map((f, i) => (f.multiple && (i < (pathLen - 1) || index !== undefined || f.index !== undefined)) ? `${f.id}${`[${index ?? f.index ?? 0}]`}` : f.id).join(***REMOVED***.***REMOVED***)
  }
}

/**
 * Returns the child fields of a given field
 *
 * @param field - The field to get the child fields from
 * @returns The child fields of the given field
 */
export const getChildFields = (field: { id: string, fields?: IFormField[] }): IFormField[] => {
  return field?.fields ?? []
}

/**
 * Recursively gets all fields from a given array of fields
 *
 * @param fields - The array of fields to get the fields from
 * @returns An array of all fields
 */

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

/**
 * Wrapper for lodash `get` function to get the value from a given path in the form values
 *
 * @param path - The path to get the value from
 * @param formValues - The form values to get the value from
 * @returns The value from the given path in the form values or undefined
 */

export function getValueFromPath (path: string, formValues: IFormValues): IValueType | IValueType[] | undefined {
  return get(formValues, path)
}

/**
 * Returns the value of a given field from the form values
 *
 * @param field - The field to get the value from
 * @param formValues - The form values to get the value from
 * @param index - The index of the field in the array (optional). If undefined, the last value will be returned as an array if it is one
 * @returns The value of the given field from the form values or undefined
 */

export function getFieldValue (field: IFormField, formValues: IFormValues, index?: number): IValueType | IValueType[] | undefined {
  const path = makeJsonPath(field, index)
  const val = getValueFromPath(path, formValues) // formValues[field.id]
  return val
}

/**
 * Returns the path of a given field. Used for writing to form values
 *
 * @param field - The field to get the path from
 * @returns The path of the given field or the id of the field if no path is defined
 */
export function getPathFromField (field: IFormField): string {
  // console.log(`${field.path !== undefined ? field.path.join(***REMOVED***.***REMOVED***) : ***REMOVED***nopath***REMOVED***} = ${field.id}`)
  if (field.destPath) {
    return field.destPath
  }
  return field.path !== undefined ? field.path.filter(f => !(f.type === ***REMOVED***object***REMOVED*** && f.skip_path === true)).map(f => f.id).concat(field.id).join(***REMOVED***.***REMOVED***) : field.id
  // return makeJsonPath(field)
}

/**
 * Returns all fields and child from a given form section. A form can be a form section or a wizard step or a page. This will recursively find child fields in pages, wizard steps and object fields
 *
 * @param formSection - The form section to get the fields from
 * @returns An array of fields from the given form section
 */
export function getFieldsFromFormSection (formSection: IFormSection): IFormField[] {
  const pageFields = formSection?.pages?.map(p => getFieldsFromFormSection(p)).flat(1)
  const wizardFields = formSection?.wizard_steps?.map(p => getFieldsFromFormSection(p)).flat(1)
  const fields = getFields((formSection?.fields ?? [])).concat(pageFields ?? []).concat(wizardFields ?? [])
  return fields
}
