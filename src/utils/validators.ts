import { type IFormSectionStatus } from ***REMOVED***@/Form/Creator/FormCreator***REMOVED***
import { type IFormValues, type IFormField, type IFormSection, type IFormValueState } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { getFieldsFromFormSection, getFieldValue, getValueFromPath } from ***REMOVED***@/utils/getters***REMOVED***

export const checkCondition = (field: IFormField, formValues: IFormValues): boolean => {
  if (field.conditions !== undefined) {
    const dependsOn = Array.isArray(field.conditions.dependsOn) ? field.conditions.dependsOn : [field.conditions.dependsOn]

    const val = field.conditions.value
    const check = dependsOn.every(d => {
      const fieldValue = getValueFromPath(d, formValues)
      return val !== undefined
        ? fieldValue === val
        : fieldValue !== null && fieldValue !== undefined && fieldValue !== false && fieldValue !== ***REMOVED******REMOVED***
    })
    return check
  }
  return true
}

const testField = (field: IFormField, formValues: IFormValues): boolean => {
  const val = getFieldValue(field, formValues)
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
