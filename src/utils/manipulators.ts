import {
  type IFormSection,
  type IPage,
  type IWizardStep,
  type IFormField,
  type IForm,
  type IValueType,
  type IFormValues,
  type IObjectField,
  type ICheckConditionResult,
} from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { getFieldsFromFormSection, getFieldValue, getPathFromField } from ***REMOVED***@/utils/getters***REMOVED***
import { checkCondition } from ***REMOVED***@/utils/validators***REMOVED***
import { merge, set } from ***REMOVED***lodash-es***REMOVED***

export const cloneObject = (object: any): any => {
  return window.structuredClone(object)
}

export const addFieldPath = (field: IFormField, parentPath?: IFormField[]): IFormField => {
  if (field.type === ***REMOVED***object***REMOVED*** && field.skip_path === true) {
    field.path = parentPath !== undefined ? parentPath.slice() : []
    field.level = parentPath !== undefined ? parentPath.length : 0
  } else {
    const newSegment = field // `${field.id}${field.multiple === true ? ***REMOVED***[]***REMOVED*** : ***REMOVED******REMOVED***}`
    field.path = parentPath !== undefined ? parentPath.slice().concat(newSegment) : [newSegment]
    field.level = parentPath !== undefined ? parentPath.length + 1 : 1
  }
  if ((field.type === ***REMOVED***object***REMOVED*** || field.type === ***REMOVED***section***REMOVED***) && field.fields !== undefined) {
    field.fields = field.fields.map((childField) => {
      return addFieldPath(childField, field.path?.slice())
    })
  }
  // return field
  return (field as { multiple?: boolean }).multiple ? cloneObject(field) : field
  // return cloneObject(field)
}

function addPathsToFormSections(section: IFormSection): IFormSection {
  if (section.pages !== undefined) {
    section.pages = section.pages.map((page) => {
      return addPathsToFormSections(page)
    }) as IPage[]
  }
  if (section.wizard_steps !== undefined) {
    section.wizard_steps = section.wizard_steps.map((wizardStep) => {
      return addPathsToFormSections(wizardStep)
    }) as IWizardStep[]
  }
  if (section.fields !== undefined) {
    section.fields = section.fields.map((field) => {
      return addFieldPath(field)
    })
  }
  return section
}

export function copyAndAddPathToFields(formOrContainer: IFormSection | IForm): IForm {
  const form = addPathsToFormSections(cloneObject(formOrContainer)) as IForm
  return form
}

function removeFieldPath(field: IFormField): IFormField {
  field.path = undefined
  field.level = undefined
  if (field.type === ***REMOVED***object***REMOVED*** && field.fields !== undefined) {
    field.fields = field.fields.map((childField) => {
      return removeFieldPath(childField)
    })
  }

  return field
}

function removePathsFromFormSections(section: IFormSection): IFormSection {
  if (section.pages !== undefined) {
    section.pages = section.pages.map((page) => {
      return removePathsFromFormSections(page)
    }) as IPage[]
  }
  if (section.wizard_steps !== undefined) {
    section.wizard_steps = section.wizard_steps.map((wizardStep) => {
      return removePathsFromFormSections(wizardStep)
    }) as IWizardStep[]
  }
  if (section.fields !== undefined) {
    section.fields = section.fields.map((field) => {
      return removeFieldPath(field)
    })
  }
  return section
}

export function copyAndRemovePathFromFields(formOrContainer: IFormSection | IForm): IForm {
  const form = removePathsFromFormSections(cloneObject(formOrContainer)) as IForm
  return form
}

export function cleanFormValuesLevel(
  formValues: IFormValues,
  fields: IFormField[],
  formValuesPath: string = ***REMOVED******REMOVED***
): IFormValues {
  const formValuesCopy = cloneObject(formValues)
  Object.keys(formValues).forEach((key) => {
    const path = formValuesPath !== ***REMOVED******REMOVED*** ? `${formValuesPath}.${key}` : key
    const field = fields?.find((f) => {
      const ff = getPathFromField(f) === path
      const cc = ff ? checkCondition(f, formValues).pass : false
      return ff && cc
    })
    if (
      field?.type === ***REMOVED***object***REMOVED*** &&
      field?.multiple === true &&
      Array.isArray(formValuesCopy[key])
    ) {
      return formValuesCopy[key].map((value, index) => {
        const checkedOneOfMultiple = checkCondition(field, value as IFormValues)
        if (!checkedOneOfMultiple.pass && checkedOneOfMultiple.result === ***REMOVED***include***REMOVED***) {
          return undefined
        }
        return value
      })
    }
    const checkedCondition: ICheckConditionResult =
      field !== undefined ? checkCondition(field, formValues) : { pass: true, result: ***REMOVED***include***REMOVED*** }
    if (
      field !== undefined &&
      ((!checkedCondition.pass && checkedCondition.result === ***REMOVED***include***REMOVED***) ||
        (checkedCondition.pass && checkedCondition.result === ***REMOVED***exclude***REMOVED***))
    ) {
      formValuesCopy[key] = undefined
      // this ensures that objects that are the result of mapping get checked
      // but fields that are not explicitly defined as objects but may contain objects
      // are not checked (geom, json, etc)
    } else if (
      typeof formValuesCopy[key] === ***REMOVED***object***REMOVED*** &&
      (field?.type === ***REMOVED***object***REMOVED*** || field === undefined)
    ) {
      formValuesCopy[key] = cleanFormValuesLevel(
        (formValuesCopy[key] ?? {}) as IFormValues,
        fields,
        path
      )
      /* } else if (field !== undefined && checkedCondition.pass && checkedCondition.newDefaultValue !== undefined) {
        formValuesCopy[key] = checkedCondition.newDefaultValue */
    } else if (field === undefined) {
      formValuesCopy[key] = undefined
    }
  })
  // const fieldIds = fields.map(f => getPathFromField(f))
  // return Object.fromEntries(Object.entries(formValuesCopy).filter(([key]) => fieldIds.includes(formValuesPath !== ***REMOVED******REMOVED*** ? `${formValuesPath}.${key}` : key)))
  return formValuesCopy
}

export function cleanUnusedDependenciesFromFormValues(
  form: IForm,
  formValues: IFormValues
): IFormValues {
  const fields = getFieldsFromFormSection(form)
  const newFormValues = cleanFormValuesLevel(formValues, fields)
  return newFormValues
}

export function updateFormValuesWithFieldValueInPlace(
  field: IFormField,
  newValue: IValueType | IValueType[],
  formValues: IFormValues
): void {
  const fieldPath = getPathFromField(field)
  if (fieldPath === undefined) {
    merge(formValues, newValue)
  } else {
    set(formValues, fieldPath ?? ***REMOVED******REMOVED***, newValue)
  }
}

export function updateFormValuesWithFieldValue(
  field: IFormField,
  newValue: IValueType | IValueType[],
  formValues: IFormValues
): IFormValues {
  const formValuesCopy = cloneObject(formValues)
  updateFormValuesWithFieldValueInPlace(field, newValue, formValuesCopy)
  return formValuesCopy
}

/**
 * Update form values with a new field value and clean up excluded fields.
 *
 * This function performs a three-step update:
 * 1. Apply the new field value to formValues
 * 2. Clean up any fields that are now excluded by condition changes
 * 3. Re-apply the changed field value (essential for destPath collisions)
 *
 * **Why step 3 matters** — If multiple fields share a `destPath` but have mutually
 * exclusive conditions, cleaning (step 2) may remove the new value. Re-applying
 * it (step 3) ensures the active field***REMOVED***s value persists.
 *
 * Example: Two geometry fields (geom_point, geom_polygon) both use destPath=***REMOVED***geometry***REMOVED***,
 * with conditions on a ***REMOVED***draw_type***REMOVED*** field:
 * - User changes draw_type=***REMOVED***polygon***REMOVED***, geom_point becomes excluded
 * - Clean removes geom_point***REMOVED***s value from path ***REMOVED***geometry***REMOVED***
 * - Re-apply ensures geom_polygon***REMOVED***s value is restored to ***REMOVED***geometry***REMOVED***
 *
 * @param field - The form field being changed
 * @param form - The form containing all fields and their conditions
 * @param value - The new value for the field
 * @param formValues - Current form values
 * @returns Updated and cleaned form values
 */
export function cleanAndUpdateFormValuesWithFieldValue({
  field,
  form,
  value,
  formValues,
}: {
  field: IFormField
  form: IForm
  value: IValueType | IValueType[]
  formValues: IFormValues
}): IFormValues {
  // Step 1: Apply the new field value
  const updatedFormValuesCopyPreClean = updateFormValuesWithFieldValue(field, value, formValues)

  // Step 2: Clean up excluded fields (those whose conditions no longer pass)
  const cleanedFormValues = cleanUnusedDependenciesFromFormValues(
    form,
    updatedFormValuesCopyPreClean
  )

  // Step 3: Re-apply the changed field to handle destPath collisions
  // (critical when multiple fields share a destPath with mutually exclusive conditions)
  const formValuesCopyClean = updateFormValuesWithFieldValue(field, value, cleanedFormValues)

  return formValuesCopyClean
}

export const assignDefaultValuesToFormValues = (
  form: IForm,
  formValues: IFormValues
): IFormValues => {
  const formValuesCopy = cloneObject(formValues)
  const formWithPaths = copyAndAddPathToFields(form)

  // Recursively process fields, but skip fields nested inside objectList
  const processFields = (fields: IFormField[] | undefined): void => {
    if (!fields) return

    fields.forEach((field) => {
      // Skip objectList fields - their children should not get defaults at root level
      if (field.type === ***REMOVED***objectList***REMOVED***) {
        return
      }

      // Apply default if not already set
      if (field.defaultValue !== undefined && getFieldValue(field, formValuesCopy) === undefined) {
        updateFormValuesWithFieldValueInPlace(field, field.defaultValue, formValuesCopy)
      }

      // Recursively process nested object fields (but not objectList)
      if ((field.type === ***REMOVED***object***REMOVED*** || field.type === ***REMOVED***objectWrapper***REMOVED***) && field.fields) {
        processFields(field.fields)
      }
      // Also process fields in tabs, pages, wizard_steps for wrapper/object fields
      if (field.type === ***REMOVED***object***REMOVED*** || field.type === ***REMOVED***objectWrapper***REMOVED***) {
        ;(field as any).tabs?.forEach((tab: any) => {
          processFields(tab.fields)
        })
        ;(field as any).pages?.forEach((page: any) => {
          processFields(page.fields)
        })
        ;(field as any).wizard_steps?.forEach((step: any) => {
          processFields(step.fields)
        })
      }
    })
  }

  processFields(formWithPaths.fields)
  return formValuesCopy
}

const assignIndexToField = (field: IFormField, index: number): IFormField => {
  return {
    ...field,
    path: undefined,
    index,
  }
}

const assignIndexToFields = (
  parentField: IObjectField,
  indexField: IObjectField,
  index: number,
  level?: number
): IFormField[] => {
  return (parentField.fields ?? []).map((f) => {
    if (f.path !== undefined && level !== undefined && f.path[level] !== undefined) {
      const newPath = f.path.slice()
      newPath[level] = assignIndexToField(indexField, index)
      f.path = newPath
    }
    if (f.type === ***REMOVED***object***REMOVED*** && f.fields !== undefined) {
      f.fields = assignIndexToFields(f, indexField, index, level)
      return f.multiple ? cloneObject(f) : f
      // return cloneObject(f)
    }
    return {
      ...f,
    }
  })
}

export const createOneOfMultipleField = (field: IFormField, index: number): IFormField => {
  const path = field.path ? field.path.slice() : undefined
  if (path !== undefined) {
    const last = assignIndexToField(path[path.length - 1], index)
    path[path.length - 1] = last
    if (last.type === ***REMOVED***object***REMOVED*** && last.fields !== undefined) {
      last.fields = assignIndexToFields(
        last,
        last,
        index,
        last.level !== undefined ? last.level - 1 : undefined
      )
    }
  }

  const out = {
    ...field,
    path,
    index,
    required: false,
    label: index > 0 ? null : field.label,
    description: index > 0 ? null : field.description,
    long_description: index > 0 ? null : field.long_description,
    id: `${field.id}-${index}`,
  }

  if (field.type === ***REMOVED***object***REMOVED*** && out.type === ***REMOVED***object***REMOVED***) {
    // Index direct fields
    if (field.fields !== undefined) {
      out.fields = assignIndexToFields(field, field, index)
    }

    // Index fields in tabs, pages, and wizard steps
    if ((field as any).tabs !== undefined) {
      ;(out as any).tabs = (field as any).tabs.map((tab: any) => ({
        ...tab,
        fields: tab.fields
          ? assignIndexToFields({ ...field, fields: tab.fields } as IObjectField, field, index)
          : undefined,
      }))
    }
    if ((field as any).pages !== undefined) {
      ;(out as any).pages = (field as any).pages.map((page: any) => ({
        ...page,
        fields: page.fields
          ? assignIndexToFields({ ...field, fields: page.fields } as IObjectField, field, index)
          : undefined,
      }))
    }
    if ((field as any).wizard_steps !== undefined) {
      ;(out as any).wizard_steps = (field as any).wizard_steps.map((step: any) => ({
        ...step,
        fields: step.fields
          ? assignIndexToFields({ ...field, fields: step.fields } as IObjectField, field, index)
          : undefined,
      }))
    }
  }
  return out
}
