import {
  type IFormSection,
  type IFormValues,
  type IValueType,
  type IFormField,
  type IObjectField,
  type IForm,
} from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
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

const isPathContainerToSkip = (field: IFormField): boolean => {
  return field.type === ***REMOVED***objectWrapper***REMOVED*** || ((field.type === ***REMOVED***object***REMOVED*** || field.type === ***REMOVED***section***REMOVED***) && field.skip_path === true)
}

/**
 * Returns the JSON path for a given field
 *
 * @param field - The field to get the JSON path for
 * @param index - The index of the field in the array (optional)
 * @returns The JSON path for the given field
 */
export const makeJsonPath = (field: IFormField, index?: number): string | undefined => {
  if (isPathContainerToSkip(field)) {
    return undefined
  }
  if (field.destPath !== undefined) {
    return `${field.destPath}${getFieldExtra(field, index)}`
  } else if (field.path === undefined) {
    return `${field.id}${getFieldExtra(field, index)}`
  } else {
    const path = field.path.filter((pathField) => !isPathContainerToSkip(pathField))
    const pathLen = path.length
    return path
      .map((f, i) => {
        const fMultiple = getFieldMultiple(f)
        const defaultMultipleIndex =
          fMultiple && f.index === undefined && i < pathLen - 1 ? 0 : undefined
        return `${f.id}${`${getFieldExtra(f, i >= pathLen - 1 ? index : defaultMultipleIndex)}`}`
      })
      .join(***REMOVED***.***REMOVED***)
  }
}

/** `
 * Returns the child fields of a given field, including fields nested in tabs, pages, and wizard_steps
 *
 * @param field - The field to get the child fields from
 * @returns The child fields of the given field
 */
export const getChildFields = (field: { id: string; fields?: IFormField[] }): IFormField[] => {
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

export const getFields = (fields?: Array<{ id: string; fields?: IFormField[] }>): IFormField[] => {
  if (fields === undefined) {
    return []
  }
  const all = fields
    .map((field) => {
      let fields = [field]
      const children = getChildFields(field)
      children.forEach((c) => {
        fields = fields.concat(getFields([c]))
      })
      return fields
    })
    .flat(Infinity) as IFormField[]
  return all
}

/**
 * Wrapper for lodash `get` function to get the value from a given path in the form values
 *
 * @param path - The path to get the value from
 * @param formValues - The form values to get the value from
 * @returns The value from the given path in the form values or undefined
 */

export function getValueFromPath(
  path: string,
  formValues: IFormValues
): IValueType | IValueType[] | undefined {
  return get(formValues, path)
}

function getObjectFieldValue(
  field: IObjectField,
  formValues: IFormValues,
  index?: number
): IValueType | IValueType[] | undefined {
  const vals = (field.fields ?? [])
    .map((f) => {
      const p = makeJsonPath(f, index)
      const val = getFieldValue(f, formValues, index)
      return p !== undefined
        ? { key: p, val }
        : typeof val === ***REMOVED***object***REMOVED*** && val !== null
          ? Object.entries(val).map(([k, v]) => ({ key: k, val: v }))
          : undefined
    })
    .flat(Infinity)
    .filter((d) => d !== undefined) as Array<{
    key: string
    val: IValueType | IValueType[] | undefined
  }>
  return Object.fromEntries(vals.map((v) => [v.key, v.val]))
}

export function getValueFromRelativePath(
  field: IFormField,
  path: string,
  formValues: IFormValues
): IValueType | IValueType[] | undefined {
  const backPath = path.match(/^\.+/)?.[0]?.length ?? 0
  const fieldPathFields = field.path ?? []
  const offset = field.type === ***REMOVED***object***REMOVED*** && field.skip_path ? 0 : 1
  if (backPath > 0 && fieldPathFields.length - offset >= backPath) {
    const targetField = fieldPathFields[fieldPathFields.length - backPath - offset]
    const targetMultiple = getFieldMultiple(targetField)
    const valueAtRoot = getFieldValue(
      {
        ...targetField,
        path:
          targetField.path ??
          fieldPathFields.slice(0, fieldPathFields.length - backPath - offset + 1),
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

export function getFieldValue(
  field: IFormField,
  formValues: IFormValues,
  index?: number
): IValueType | IValueType[] | undefined {
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
export function getPathFromField(field: IFormField): string | undefined {
  // console.log(`${field.path !== undefined ? field.path.join(***REMOVED***.***REMOVED***) : ***REMOVED***nopath***REMOVED***} = ${field.id}`)
  if (isPathContainerToSkip(field)) {
    return undefined
  }
  if (field.destPath) {
    return field.destPath
  }
  return field.path !== undefined
    ? field.path.filter((f) => !isPathContainerToSkip(f)).map((f) => f.id).join(***REMOVED***.***REMOVED***)
    : field.id
  // return makeJsonPath(field)
}

/**
 * Returns all fields and child from a given form section. A form can be a form section or a wizard step or a page. This will recursively find child fields in pages, wizard steps, tabs and object fields
 *
 * @param formSection - The form section to get the fields from
 * @returns An array of fields from the given form section
 */
export function getFieldsFromFormSection(formSection: IFormSection | IForm): IFormField[] {
  const pageFields = formSection?.pages?.map((p) => getFieldsFromFormSection(p)).flat(1)
  const wizardFields = formSection?.wizard_steps?.map((p) => getFieldsFromFormSection(p)).flat(1)
  const tabFields = formSection?.tabs?.map((t) => getFieldsFromFormSection(t)).flat(1)
  const fields = getFields(formSection?.fields ?? [])
    .concat(pageFields ?? [])
    .concat(wizardFields ?? [])
    .concat(tabFields ?? [])
  return fields
}

const buildPayloadFromScopedFields = (
  fields: IFormField[] | undefined,
  scopedValues: IFormValues
): IFormValues => {
  const scopedPayload: IFormValues = {}
  if (!fields) {
    return scopedPayload
  }

  fields.forEach((field) => {
    if (field.excludeFromPayload === true) {
      return
    }

    const isObjectField = field.type === ***REMOVED***object***REMOVED*** || field.type === ***REMOVED***objectWrapper***REMOVED***
    if (!isObjectField) {
      const value = scopedValues[field.id]
      if (value !== undefined) {
        scopedPayload[field.id] = value
      }
      return
    }

    const childFields = getChildFields(field)
    const isSkipPathContainer =
      field.type === ***REMOVED***objectWrapper***REMOVED*** || (field.type === ***REMOVED***object***REMOVED*** && field.skip_path === true)

    if (isSkipPathContainer) {
      // skip_path containers flatten descendants into the current scope.
      // multiple+skip_path is unsupported in this form model; skip extraction if encountered.
      if (getFieldMultiple(field)) {
        return
      }

      const flattenedPayload = buildPayloadFromScopedFields(childFields, scopedValues)
      Object.assign(scopedPayload, flattenedPayload)
      return
    }

    const fieldValue = scopedValues[field.id]
    if (getFieldMultiple(field)) {
      if (!Array.isArray(fieldValue)) {
        return
      }

      const arrayPayload = fieldValue
        .map((item) => {
          if (typeof item !== ***REMOVED***object***REMOVED*** || item === null || Array.isArray(item)) {
            return undefined
          }

          const itemPayload = buildPayloadFromScopedFields(childFields, item as IFormValues)
          return Object.keys(itemPayload).length > 0 ? itemPayload : undefined
        })
        .filter((v) => v !== undefined) as IFormValues[]

      if (arrayPayload.length > 0) {
        scopedPayload[field.id] = arrayPayload
      }
      return
    }

    if (typeof fieldValue !== ***REMOVED***object***REMOVED*** || fieldValue === null || Array.isArray(fieldValue)) {
      return
    }

    const nestedPayload = buildPayloadFromScopedFields(childFields, fieldValue as IFormValues)
    if (Object.keys(nestedPayload).length > 0) {
      scopedPayload[field.id] = nestedPayload
    }
  })

  return scopedPayload
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

  if (!allFields || allFields.length === 0) {
    return {}
  }

  const payload: IFormValues = {}

  allFields.forEach((field) => {
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
        const arrayPayload = (value as IFormValues[])
          .map((item) => {
            if (typeof item !== ***REMOVED***object***REMOVED*** || item === null || Array.isArray(item)) {
              return undefined
            }
            const itemPayload = buildPayloadFromScopedFields(field.fields, item)
            return Object.keys(itemPayload).length > 0 ? itemPayload : undefined
          })
          .filter((v) => v !== undefined) as IFormValues[]
        set(payload, path, arrayPayload)
      } else if (field.skip_path) {
        // For skip_path objects, process children at current level (no-op in this function)
        // Children are processed independently at root level
      } else if (!getFieldMultiple(field)) {
        // Children are included in allFields and processed independently below.
        // No action needed here — setting nestedPayload with absolute child paths
        // would cause double-nesting (e.g. sample_file.sample_file.headers).
      }
    } else if (
      field.type === ***REMOVED***objectList***REMOVED*** &&
      typeof value === ***REMOVED***object***REMOVED*** &&
      value !== null &&
      !Array.isArray(value)
    ) {
      // Handle objectList fields (keyed objects)
      const objectListValue = value as IFormValues
      const objectListPayload: IFormValues = {}
      const keyField = (field as any).settings?.keyField
      const valueField = (field as any).settings?.valueField as string | undefined

      Object.entries(objectListValue).forEach(([key, item]) => {
        // Optional simple mapping mode: emit key -> selected scalar value.
        if (valueField !== undefined) {
          if (typeof item === ***REMOVED***object***REMOVED*** && item !== null && !Array.isArray(item)) {
            const mappedValue = (item as IFormValues)[valueField]
            if (mappedValue !== undefined) {
              objectListPayload[key] = mappedValue
            }
          } else if (item !== undefined) {
            objectListPayload[key] = item as IValueType
          }
          return
        }

        if (typeof item === ***REMOVED***object***REMOVED*** && item !== null && !Array.isArray(item)) {
          const itemPayload: IFormValues = {}
          ;(field.fields ?? []).forEach((childField: IFormField) => {
            // For objectWrapper and skip_path fields, the data is stored flat in the item.
            // These containers are structural and can be excludeFromPayload=true while their
            // children still need to be emitted.
            const isObjectWrapper = (childField as any).type === ***REMOVED***objectWrapper***REMOVED***
            const isSkipPath = (childField as any).skip_path === true
            const isObject = (childField as any).type === ***REMOVED***object***REMOVED***

            if (isObjectWrapper || (isObject && isSkipPath)) {
              // Get all grandchild fields (from fields, tabs, pages, wizard_steps)
              const childFields = getChildFields(childField)
              // Extract fields flat from the item, excluding keyField
              childFields.forEach((grandchildField) => {
                if (grandchildField.excludeFromPayload !== true) {
                  // Skip the keyField value by default
                  if (keyField && grandchildField.id === keyField) {
                    return
                  }
                  const grandchildId = grandchildField.id
                  if ((item as IFormValues)[grandchildId] !== undefined) {
                    itemPayload[grandchildId] = (item as IFormValues)[grandchildId]
                  }
                }
              })
              return
            }

            if (childField.excludeFromPayload !== true) {
              // For non-skip_path nested objects, extract normally
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
  })

  return payload
}
