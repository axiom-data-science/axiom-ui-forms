import { type IFormSectionStatus } from ***REMOVED***@/Form/Creator/FormCreator***REMOVED***
import { type IFormValues, type IFormField, type IFormSection, type IFieldCondition } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { getFieldsFromFormSection, getFieldValue, getValueFromPath } from ***REMOVED***@/utils/getters***REMOVED***

const checkFieldCondition = (condition: IFieldCondition, formValues: IFormValues): boolean => {
  const dependsOn = Array.isArray(condition.dependsOn) ? condition.dependsOn : [condition.dependsOn]
  const val = condition.value
  const pass = dependsOn.every(d => {
    const fieldValue = getValueFromPath(d, formValues)
    return val !== undefined
      ? val === false
        ? (fieldValue === null || fieldValue === undefined || fieldValue === false || fieldValue === ***REMOVED******REMOVED***)
        : fieldValue === val
      : (fieldValue !== null && fieldValue !== undefined && fieldValue !== false && fieldValue !== ***REMOVED******REMOVED***)
  })
  return pass
}

export const checkCondition = (field: IFormField, formValues: IFormValues): boolean => {
  let check = true
  if (field.conditionsSet !== undefined) {
    check = field.conditionsSet.logic === ***REMOVED***or***REMOVED***
      ? field.conditionsSet.conditions.some((c: IFieldCondition) => {
        return checkFieldCondition(c, formValues)
      })
      : field.conditionsSet.conditions.every((c: IFieldCondition) => {
        return checkFieldCondition(c, formValues)
      })
  }

  if (field.conditions !== undefined && check) {
    check = checkFieldCondition(field.conditions, formValues)
  }

  return check
}

const testField = (field: IFormField, formValues: IFormValues): boolean => {
  const val = getFieldValue(field, formValues)
  return val !== undefined && val !== null && val !== ***REMOVED******REMOVED***
}

export const calculateSectionStatus = (sections: IFormSection[], formValues: IFormValues): IFormSectionStatus => {
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
