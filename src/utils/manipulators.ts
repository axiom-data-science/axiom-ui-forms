import { type IFormSection, type IPage, type IWizardStep, type IFormField, type IForm, type IValueType, type IFormValues, type IObjectField, type ICheckConditionResult } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
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
    field.fields = field.fields.map(childField => {
      return addFieldPath(childField, field.path?.slice())
    })
  }
  // return field
  return field.multiple ? cloneObject(field) : field
  // return cloneObject(field)
}

function addPathsToFormSections (section: IFormSection): IFormSection {
  if (section.pages !== undefined) {
    section.pages = section.pages.map(page => {
      return addPathsToFormSections(page)
    }) as IPage[]
  }
  if (section.wizard_steps !== undefined) {
    section.wizard_steps = section.wizard_steps.map(wizardStep => {
      return addPathsToFormSections(wizardStep)
    }) as IWizardStep[]
  }
  if (section.fields !== undefined) {
    section.fields = section.fields.map(field => {
      return addFieldPath(field)
    })
  }
  return section
}

export function copyAndAddPathToFields (formOrContainer: IFormSection | IForm): IForm {
  const form = addPathsToFormSections(cloneObject(formOrContainer)) as IForm
  return form
}

function removeFieldPath (field: IFormField): IFormField {
  field.path = undefined
  field.level = undefined
  if (field.type === ***REMOVED***object***REMOVED*** && field.fields !== undefined) {
    field.fields = field.fields.map(childField => {
      return removeFieldPath(childField)
    })
  }

  return field
}

function removePathsFromFormSections (section: IFormSection): IFormSection {
  if (section.pages !== undefined) {
    section.pages = section.pages.map(page => {
      return removePathsFromFormSections(page)
    }) as IPage[]
  }
  if (section.wizard_steps !== undefined) {
    section.wizard_steps = section.wizard_steps.map(wizardStep => {
      return removePathsFromFormSections(wizardStep)
    }) as IWizardStep[]
  }
  if (section.fields !== undefined) {
    section.fields = section.fields.map(field => {
      return removeFieldPath(field)
    })
  }
  return section
}

export function copyAndRemovePathFromFields (formOrContainer: IFormSection | IForm): IForm {
  const form = removePathsFromFormSections(cloneObject(formOrContainer)) as IForm
  return form
}

export function cleanFormValuesLevel (formValues: IFormValues, fields: IFormField[], formValuesPath: string = ***REMOVED******REMOVED***): IFormValues {
  const formValuesCopy = cloneObject(formValues)
  Object.keys(formValues).forEach(key => {
    const path = formValuesPath !== ***REMOVED******REMOVED*** ? `${formValuesPath}.${key}` : key
    const field = fields?.find(f => getPathFromField(f) === path)
    if (field?.type === ***REMOVED***object***REMOVED*** && field?.multiple === true && Array.isArray(formValuesCopy[key])) {
      return formValuesCopy[key].map((value, index) => {
        const checkedOneOfMultiple = checkCondition(field, value as IFormValues)
        if (!checkedOneOfMultiple.pass && checkedOneOfMultiple.result === ***REMOVED***include***REMOVED***) {
          return undefined
        }
        return value
      })
    }
    const checkedCondition: ICheckConditionResult = field !== undefined
      ? checkCondition(field, formValues)
      : { pass: true, result: ***REMOVED***include***REMOVED*** }
    if (field !== undefined && (
      (
        !checkedCondition.pass && checkedCondition.result === ***REMOVED***include***REMOVED***
      ) || (
        checkedCondition.pass && checkedCondition.result === ***REMOVED***exclude***REMOVED***
      )
    )) {
      formValuesCopy[key] = undefined
      // this ensures that objects that are the result of mapping get checked
      // but fields that are not explicitly defined as objects but may contain objects
      // are not checked (geom, json, etc)
    } else if (typeof formValuesCopy[key] === ***REMOVED***object***REMOVED*** && (
      field?.type === ***REMOVED***object***REMOVED*** || field === undefined
    )) {
      formValuesCopy[key] = cleanFormValuesLevel((formValuesCopy[key] ?? {}) as IFormValues, fields, path)
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

export function cleanUnusedDependenciesFromFormValues (form: IForm, formValues: IFormValues): IFormValues {
  const fields = getFieldsFromFormSection(form)
  const newFormValues = cleanFormValuesLevel(formValues, fields)
  return newFormValues
}

export function updateFormValuesWithFieldValueInPlace (field: IFormField, newValue: IValueType | IValueType[], formValues: IFormValues): void {
  const fieldPath = getPathFromField(field)
  if (fieldPath === undefined) {
    merge(formValues, newValue)
  } else {
    set(formValues, fieldPath ?? ***REMOVED******REMOVED***, newValue)
  }
}

export function updateFormValuesWithFieldValue (field: IFormField, newValue: IValueType | IValueType[], formValues: IFormValues): IFormValues {
  const formValuesCopy = cloneObject(formValues)
  updateFormValuesWithFieldValueInPlace(field, newValue, formValuesCopy)
  return formValuesCopy
}

export function cleanAndUpdateFormValuesWithFieldValue ({
  field,
  form,
  value,
  formValues
}: {
  field: IFormField
  form: IForm
  value: IValueType | IValueType[]
  formValues: IFormValues
}): IFormValues {
  const updatedFormValuesCopyPreClean = updateFormValuesWithFieldValue(
    field,
    value,
    formValues
  )
  const cleanedFormValues = cleanUnusedDependenciesFromFormValues(form, updatedFormValuesCopyPreClean)
  // re-assigning the form values lets it be cleaned above, and re-assigned below if the value is uses the same path as a removed value
  // initial use case: multiple geometry fields with each shape type as pre-set draw type and a second field that determines the draw type
  const formValuesCopyClean = updateFormValuesWithFieldValue(
    field,
    value,
    cleanedFormValues
  )

  const path = getPathFromField(field)

  const fieldsWithPassingConditionsThatThisFieldAffects = getFieldsFromFormSection(form).filter(f => {
    if (f.conditions !== undefined || f.conditionsSet !== undefined) {
      const dependsOnFields = f.conditions !== undefined
        ? [f.conditions.field ?? f.conditions.dependsOn]
        : f.conditionsSet !== undefined
          ? f.conditionsSet.conditions.map(c => c.field ?? c.dependsOn)
          : []
      const conditionResult = checkCondition(f, { ...{ [getPathFromField(field) ?? ***REMOVED******REMOVED***]: value } })
      return conditionResult.pass && conditionResult.newDefaultValue !== undefined
    }
    return false
  })

  return formValuesCopyClean
}

export const assignDefaultValuesToFormValues = (form: IForm, formValues: IFormValues): IFormValues => {
  const formValuesCopy = cloneObject(formValues)
  const formWithPaths = copyAndAddPathToFields(form)
  getFieldsFromFormSection(formWithPaths).forEach(field => {
    if (field.defaultValue !== undefined && getFieldValue(field, formValuesCopy) === undefined) {
      updateFormValuesWithFieldValueInPlace(field, field.defaultValue, formValuesCopy)
    }
  })
  return formValuesCopy
}

const assignIndexToField = (field: IFormField, index: number): IFormField => {
  return {
    ...field,
    path: undefined,
    index
  }
}

const assignIndexToFields = (parentField: IObjectField, indexField: IObjectField, index: number, level?: number): IFormField[] => {
  return parentField.fields.map(f => {
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
      ...f
    }
  })
}

export const createOneOfMultipleField = (field: IFormField, index: number): IFormField => {
  const path = field.path ? field.path.slice() : undefined
  if (path !== undefined) {
    const last = assignIndexToField(path[path.length - 1], index)
    path[path.length - 1] = last
    if (last.type === ***REMOVED***object***REMOVED*** && last.fields !== undefined) {
      last.fields = assignIndexToFields(last, last, index, last.level !== undefined ? (last.level - 1) : undefined)
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
    id: `${field.id}-${index}`
  }

  if (field.type === ***REMOVED***object***REMOVED*** && field.fields !== undefined && out.type === ***REMOVED***object***REMOVED***) {
    out.fields = assignIndexToFields(field, field, index)
  }
  return out
}
