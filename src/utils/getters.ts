import { type IFormSection, type IFormValues, type IValueType, type IFormField, type IObjectField, type IForm } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { get, set } from ***REMOVED***lodash-es***REMOVED***

/**
 * Safely gets the `multiple` property from a form field
 */
const getFieldMultiple = (field: IFormField | { multiple?: boolean }): boolean => {
  return (field as { multiple?: boolean }).multiple ?? false
}

const getFieldExtra = (field: IFormField, index?: number): string => {
  const multiple = getFieldMultiple(field)
  return multiple && (field.index !== undefined || index !== undefined)
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
  if ((field.type === ***REMOVED***object***REMOVED*** || field.type === ***REMOVED***objectWrapper***REMOVED***) && field.skip_path === true) {
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
      const fMultiple = getFieldMultiple(f)
      const defaultMultipleIndex = fMultiple && f.index === undefined && i < (pathLen - 1) ? 0 : undefined
      return `${f.id}${`${getFieldExtra(f, i >= pathLen - 1 ? index : defaultMultipleIndex)}`}`
    }).join(***REMOVED***.***REMOVED***)
  }
}

/** `
 * Returns the child fields of a given field, including fields nested in tabs, pages, and wizard_steps
 *
 * @param field - The field to get the child fields from
 * @returns The child fields of the given field
 */
export const getChildFields = (field: { id: string, fields?: IFormField[] }): IFormField[] => {
  const f = field as any
  const directFields: IFormField[] = f.fields ?? []
  const fromSections: IFormField[] = [
    ...(f.tabs ?? []),
    ...(f.pages ?? []),
    ...(f.wizard_steps ?? []),
  ].flatMap((section: IFormSection) => getFieldsFromFormSection(section))
  return [...directFields, ...fromSections]
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
    const targetMultiple = getFieldMultiple(targetField)
    const valueAtRoot = getFieldValue(
      {
        ...targetField,
        path: targetField.path ?? fieldPathFields.slice(0, fieldPathFields.length - backPath - offset + 1)
      },
      formValues,
      targetMultiple ? targetField.index : undefined
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
  if ((field.type === ***REMOVED***object***REMOVED*** || field.type === ***REMOVED***objectWrapper***REMOVED***) && field.skip_path === true) {
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
 * Returns all fields and child from a given form section. A form can be a form section or a wizard step or a page. This will recursively find child fields in pages, wizard steps, tabs and object fields
 *
 * @param formSection - The form section to get the fields from
 * @returns An array of fields from the given form section
 */
export function getFieldsFromFormSection (formSection: IFormSection): IFormField[] {
  const pageFields = formSection?.pages?.map(p => getFieldsFromFormSection(p)).flat(1)
  const wizardFields = formSection?.wizard_steps?.map(p => getFieldsFromFormSection(p)).flat(1)
  const tabFields = formSection?.tabs?.map(t => getFieldsFromFormSection(t)).flat(1)
  const fields = getFields((formSection?.fields ?? [])).concat(pageFields ?? []).concat(wizardFields ?? []).concat(tabFields ?? [])
  return fields
}

/**
 * Extracts form payload, excluding fields marked with excludeFromPayload=true.
 * 
 * Fields artificially added via overrides (not in schema) are auto-marked for exclusion,
 * but can be forced back into payload with excludeFromPayload=false.
 * 
 * Gathers fields from all form sections (top-level fields, pages, wizard_steps, tabs).
 * 
 * @param formValues - The complete form values object
 * @param form - The form containing all fields (top-level, in pages, wizard_steps, or tabs)
 * @returns Clean payload object with excluded fields removed
 */
export function getFormPayload(formValues: IFormValues, form: IForm): IFormValues {
  // Gather all fields from the form (including those nested in pages, wizard_steps, tabs)
  const allFields = getFieldsFromFormSection(form)

  if (allFields.length === 0) {
    return {}
  }

  const payload: IFormValues = {}

  const processField = (field: IFormField, parentPath?: string[]): void => {
    // Skip fields marked for exclusion
    if (field.excludeFromPayload === true) {
      return
    }

    const path = makeJsonPath(field)
    if (!path) {
      return
    }

    const value = getValueFromPath(path, formValues)
    
    // Handle object fields with nested children
    if ((field.type === ***REMOVED***object***REMOVED*** || field.type === ***REMOVED***objectWrapper***REMOVED***) && field.fields) {
      // Check for multiple object first (array of objects with nested structure)
      if (getFieldMultiple(field) && Array.isArray(value)) {
        const arrayPayload = (value as IFormValues[]).map((item) => {
          const itemPayload: IFormValues = {}
          if (field.fields) {
            field.fields.forEach((childField) => {
              if (childField.excludeFromPayload !== true) {
                // For nested objects, recurse to handle them properly
                if ((childField.type === ***REMOVED***object***REMOVED*** || childField.type === ***REMOVED***objectWrapper***REMOVED***) && childField.fields) {
                  const nestedPayload: IFormValues = {}
                  const childItem = item[childField.id]
                  if (typeof childItem === ***REMOVED***object***REMOVED*** && childItem !== null && !Array.isArray(childItem)) {
                    childField.fields.forEach(grandchildField => {
                      if (grandchildField.excludeFromPayload !== true) {
                        const grandchildId = grandchildField.id
                        if ((childItem as IFormValues)[grandchildId] !== undefined) {
                          nestedPayload[grandchildId] = (childItem as IFormValues)[grandchildId]
                        }
                      }
                    })
                  }
                  if (Object.keys(nestedPayload).length > 0) {
                    itemPayload[childField.id] = nestedPayload
                  }
                } else {
                  const childFieldId = childField.id
                  if (item[childFieldId] !== undefined) {
                    itemPayload[childFieldId] = item[childFieldId]
                  }
                }
              }
            })
          }
          return itemPayload
        })
        set(payload, path, arrayPayload)
      } else if (field.skip_path) {
        // For skip_path objects, process children at current level
        field.fields.forEach(childField => {
          processField(childField, parentPath)
        })
      } else if (!getFieldMultiple(field)) {
        // For non-skip_path, non-multiple objects, build nested payload from children
        const nestedPayload: IFormValues = {}
        field.fields.forEach(childField => {
          const childPath = makeJsonPath(childField)
          if (childPath && childField.excludeFromPayload !== true) {
            const childValue = getValueFromPath(childPath, formValues)
            if (childValue !== undefined) {
              set(nestedPayload, childPath, childValue)
            }
          }
        })
        
        if (Object.keys(nestedPayload).length > 0) {
          set(payload, path, nestedPayload)
        }
      }
    } else if (field.type === ***REMOVED***objectList***REMOVED*** && typeof value === ***REMOVED***object***REMOVED*** && value !== null && !Array.isArray(value)) {
      // Handle objectList fields (keyed objects)
      const objectListValue = value as IFormValues
      const objectListPayload: IFormValues = {}
      
      Object.entries(objectListValue).forEach(([key, item]) => {
        if (typeof item === ***REMOVED***object***REMOVED*** && item !== null && !Array.isArray(item)) {
          const itemPayload: IFormValues = {}
          ;(field.fields ?? []).forEach((childField: IFormField) => {
            if (childField.excludeFromPayload !== true) {
              const childFieldId = childField.id
              if ((item as IFormValues)[childFieldId] !== undefined) {
                itemPayload[childFieldId] = (item as IFormValues)[childFieldId]
              }
            }
          })
          if (Object.keys(itemPayload).length > 0) {
            objectListPayload[key] = itemPayload
          }
        }
      })
      
      if (Object.keys(objectListPayload).length > 0) {
        set(payload, path, objectListPayload)
      }
    } else if (value !== undefined) {
      // Simple scalar or non-nested value
      set(payload, path, value)
    }
  }

  allFields.forEach((field) => {
    processField(field)
  })
  return payload
}
