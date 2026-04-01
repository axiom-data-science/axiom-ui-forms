import { type IFormSection, type IFormValues, type IValueType, type IFormField, type IObjectField } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { get } from ***REMOVED***lodash-es***REMOVED***

const getFieldExtra = (field: IFormField, index?: number): string => {
  return field.multiple && (field.index !== undefined || index !== undefined)
    ? `[${index ?? field.index}]`
    : ***REMOVED******REMOVED***
}

/**
 * Returns the JSON path for a given field
 *
 * @param field - The field to get the JSON path for
 * @param index - The index of the field in the array (optional)
 * @returns The JSON path for the given field
 */
export const makeJsonPath = (field: IFormField, index?: number): string | undefined => {
  if (field.type === ***REMOVED***object***REMOVED*** && field.skip_path === true) {
    return undefined
  }
  if (field.destPath !== undefined) {
    return `${field.destPath}${getFieldExtra(field, index)}`
  } else if (field.path === undefined) {
    return `${field.id}${getFieldExtra(field, index)}`
  } else {
    const path = field.path
    const pathLen = path.length
    return field.path.map((f, i) => {
      const defaultMultipleIndex = f.multiple && f.index === undefined && i < (pathLen - 1) ? 0 : undefined
      return `${f.id}${`${getFieldExtra(f, i >= pathLen - 1 ? index : defaultMultipleIndex)}`}`
    }).join(***REMOVED***.***REMOVED***)
  }
}

/** `
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

function getObjectFieldValue (field: IObjectField, formValues: IFormValues, index?: number): IValueType | IValueType[] | undefined {
  const vals = (field.fields ?? []).map(f => {
    const p = makeJsonPath(f, index)
    const val = getFieldValue(f, formValues, index)
    return p !== undefined
      ? { key: p, val }
      : typeof val === ***REMOVED***object***REMOVED*** && val !== null
        ? Object.entries(val).map(([k, v]) => ({ key: k, val: v }))
        : undefined
  }).flat(Infinity).filter(d => d !== undefined) as Array<{ key: string, val: IValueType | IValueType[] | undefined }>
  return Object.fromEntries(vals.map(v => [v.key, v.val]))
}

export function getValueFromRelativePath (field: IFormField, path: string, formValues: IFormValues): IValueType | IValueType[] | undefined {
  const backPath = path.match(/^\.+/)?.[0]?.length ?? 0
  const fieldPathFields = field.path ?? []
  const offset = field.type === ***REMOVED***object***REMOVED*** && field.skip_path ? 0 : 1
  if (backPath > 0 && (fieldPathFields.length - offset) >= backPath) {
    const targetField = fieldPathFields[fieldPathFields.length - backPath - offset]
    const valueAtRoot = getFieldValue(
      {
        ...targetField,
        path: targetField.path ?? fieldPathFields.slice(0, fieldPathFields.length - backPath - offset + 1)
      },
      formValues,
      targetField.multiple ? targetField.index : undefined
    )

    if (valueAtRoot === undefined || valueAtRoot === null) {
      return undefined
    }
    const pathToEval = path.replace(/^\.+/, ***REMOVED******REMOVED***)
    if (pathToEval === ***REMOVED******REMOVED***) {
      return valueAtRoot
    }
    return get(valueAtRoot, pathToEval)
  } else {
    // absolute path, get the field value from the field
    return getValueFromPath(path, formValues)
  }
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
  if (field.type === ***REMOVED***object***REMOVED*** && field.fields !== undefined && path === undefined) {
    return getObjectFieldValue(field, formValues, index)
  } else if (path === undefined) {
    return undefined
  }
  const val = getValueFromPath(path, formValues) // formValues[field.id]
  return val
}

/**
 * Returns the path of a given field. Used for writing to form values
 *
 * @param field - The field to get the path from
 * @returns The path of the given field or the id of the field if no path is defined
 */
export function getPathFromField (field: IFormField): string | undefined {
  // console.log(`${field.path !== undefined ? field.path.join(***REMOVED***.***REMOVED***) : ***REMOVED***nopath***REMOVED***} = ${field.id}`)
  if (field.type === ***REMOVED***object***REMOVED*** && field.skip_path === true) {
    return undefined
  }
  if (field.destPath) {
    return field.destPath
  }
  return field.path !== undefined
    ? field.path.filter(f => !(f.type === ***REMOVED***object***REMOVED*** && f.skip_path === true)).map(f => f.id).join(***REMOVED***.***REMOVED***)
    : field.id
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
