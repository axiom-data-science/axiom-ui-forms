import { type IFormSectionStatus } from ***REMOVED***@/Form/Creator/FormCreator***REMOVED***
import { type IFormValues, type IFormField, type IFormSection, type IFieldCondition, type IValueType, type IFieldConditionOperator } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { getFieldsFromFormSection, getFieldValue, getValueFromPath } from ***REMOVED***@/utils/getters***REMOVED***

const compare = (val: IValueType | IValueType[], operator: IFieldConditionOperator, compareTo: string | number | boolean): boolean => {
  if (val === undefined || val === null) {
    return operator === ***REMOVED***!=***REMOVED***
  }
  if (operator === ***REMOVED***=***REMOVED*** || operator === ***REMOVED***eq***REMOVED***) {
    // eslint-disable-next-line eqeqeq
    return val == compareTo
  }
  if (operator === ***REMOVED***>***REMOVED*** || operator === ***REMOVED***gt***REMOVED***) {
    return +val > +compareTo
  }
  if (operator === ***REMOVED***>=***REMOVED*** || operator === ***REMOVED***gte***REMOVED***) {
    return +val >= +compareTo
  }
  if (operator === ***REMOVED***<***REMOVED*** || operator === ***REMOVED***lt***REMOVED***) {
    return +val < +compareTo
  }
  if (operator === ***REMOVED***<=***REMOVED*** || operator === ***REMOVED***lte***REMOVED***) {
    return +val <= +compareTo
  }
  if (operator === ***REMOVED***!=***REMOVED*** || operator === ***REMOVED***!eq***REMOVED***) {
    // eslint-disable-next-line eqeqeq
    return val != compareTo
  }
  console.warn(`Unknown operator: ${String(operator)}`)
  return false
}

const runCheck = (
  fieldValue: IValueType | IValueType[],
  operator: IFieldConditionOperator | undefined = ***REMOVED***=***REMOVED***,
  val: string | number | boolean | undefined
): boolean => {
  if (val === undefined) {
    // ignore operator if val isn***REMOVED***t set
    return fieldValue !== null && fieldValue !== undefined && fieldValue !== false && fieldValue !== ***REMOVED******REMOVED***
  }
  return val !== undefined
    ? val === false
      ? (fieldValue === null || fieldValue === undefined || fieldValue === false || fieldValue === ***REMOVED******REMOVED***)
      : compare(fieldValue, operator || ***REMOVED***=***REMOVED***, val)
    : (fieldValue !== null && fieldValue !== undefined && fieldValue !== false && fieldValue !== ***REMOVED******REMOVED***)
}

const checkFieldCondition = (condition: IFieldCondition, formValues: IFormValues): boolean => {
  const fieldToEval = condition.field ?? condition.dependsOn
  if (fieldToEval === undefined) {
    console.warn(***REMOVED***Field condition is missing field or dependsOn property***REMOVED***)
    return true
  }
  const dependsOn = Array.isArray(fieldToEval) ? fieldToEval : [fieldToEval]
  const val = condition.value
  const pass = dependsOn.every(d => {
    const fieldValue = getValueFromPath(d, formValues)
    return runCheck(
      fieldValue,
      condition.operator ?? ***REMOVED***=***REMOVED***,
      val
    )
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
