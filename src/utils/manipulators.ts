import { type IFormSection, type IPage, type IWizardStep, type IFormField, type IForm, type IValueType, type IFormValues } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { getFieldsFromFormSection, getFieldValue, getPathFromField } from ***REMOVED***@/utils/getters***REMOVED***
import { checkCondition } from ***REMOVED***@/utils/validators***REMOVED***
import set from ***REMOVED***lodash/set***REMOVED***

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
  return field
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
  const form = addPathsToFormSections(structuredClone(formOrContainer)) as IForm
  return form
}

function cleanFormValuesLevel (formValues: IFormValues, fields: IFormField[], formValuesPath: string = ***REMOVED******REMOVED***): IFormValues {
  const formValuesCopy = structuredClone(formValues)
  Object.keys(formValues).forEach(key => {
    const path = formValuesPath !== ***REMOVED******REMOVED*** ? `${formValuesPath}.${key}` : key
    const field = fields?.find(f => getPathFromField(f) === path)
    if (field !== undefined && !checkCondition(field, formValues)) {
      formValuesCopy[key] = undefined
      // this ensures that objects that are the result of mapping get checked
      // but fields that are not explicitly defined as objects but may contain objects
      // are not checked (geom, json, etc)
    } else if (typeof formValuesCopy[key] === ***REMOVED***object***REMOVED*** && (
      field?.type === ***REMOVED***object***REMOVED*** || field === undefined
    )) {
      formValuesCopy[key] = cleanFormValuesLevel(formValuesCopy[key] as IFormValues, fields, path)
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
  set(formValues, fieldPath, newValue)
}

export function updateFormValuesWithFieldValue (field: IFormField, newValue: IValueType | IValueType[], formValues: IFormValues): IFormValues {
  const formValuesCopy = structuredClone(formValues)
  updateFormValuesWithFieldValueInPlace(field, newValue, formValuesCopy)
  return formValuesCopy
}

export const assignDefaultValuesToFormValues = (form: IForm, formValues: IFormValues): IFormValues => {
  const formValuesCopy = structuredClone(formValues)
  const formWithPaths = copyAndAddPathToFields(form)
  getFieldsFromFormSection(formWithPaths).forEach(field => {
    if (field.defaultValue !== undefined && getFieldValue(field, formValuesCopy) === undefined) {
      updateFormValuesWithFieldValueInPlace(field, field.defaultValue, formValuesCopy)
    }
  })
  return formValuesCopy
}
