import { type IFormSectionStatus } from ***REMOVED***@/Form/Creator/FormCreator***REMOVED***
import { type IFormValues, type IFormField, type IFormSection, type IFieldCondition, type IValueType, type IFieldConditionOperator, type IFieldConditionResult, type ICheckConditionResult } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { getFieldsFromFormSection, getFieldValue, getValueFromRelativePath } from ***REMOVED***@/utils/getters***REMOVED***

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

const checkFieldCondition = (field: IFormField, condition: IFieldCondition, formValues: IFormValues): ICheckConditionResult => {
  const fieldToEval = condition.field ?? condition.dependsOn
  if (fieldToEval === undefined) {
    console.warn(***REMOVED***Field condition is missing field or dependsOn property***REMOVED***)
    return {
      pass: true,
      result: condition.result ?? ***REMOVED***include***REMOVED***,
      newDefaultValue: condition.newDefaultValue
    }
  }
  if (Array.isArray(fieldToEval)) {
    console.warn(***REMOVED***Field condition dependsOn (or field) should not be an array, use conditionsSet for multiple conditions. dependsOn as array will be deprated***REMOVED***)
  }
  const dependsOn = Array.isArray(fieldToEval) ? fieldToEval : [fieldToEval]
  const val = condition.value
  const pass = dependsOn.every(d => {
    /* const fieldPathIsRelative = d.startsWith(***REMOVED***.***REMOVED***)
    const fieldValue = getValueFromPath(d, formValues) */
    const fieldValue = getValueFromRelativePath(field, d, formValues)
    return runCheck(
      fieldValue,
      condition.operator ?? ***REMOVED***=***REMOVED***,
      val
    )
  })
  return {
    pass,
    result: condition.result ?? ***REMOVED***include***REMOVED***,
    newDefaultValue: condition.newDefaultValue
  }
}

export const checkCondition = (field: IFormField, formValues: IFormValues): ICheckConditionResult => {
  let pass: boolean = true
  let result: IFieldConditionResult | undefined
  let newDefaultValue: IValueType | IValueType[] | undefined
  if (field.conditionsSet !== undefined) {
    const passingConditions = field.conditionsSet.conditions.filter(c => {
      const result = checkFieldCondition(field, c, formValues)
      return result.pass
    })

    pass = field.conditionsSet.logic === ***REMOVED***or***REMOVED***
      ? passingConditions.length > 0
      : passingConditions.length === field.conditionsSet.conditions.length

    result = pass ? (passingConditions[passingConditions.length - 1].result ?? field.conditionsSet.result) : undefined
    newDefaultValue = pass ? passingConditions[passingConditions.length - 1].newDefaultValue ?? field.conditionsSet.newDefaultValue : undefined
  }

  if (field.conditions !== undefined && pass) {
    const f = checkFieldCondition(field, field.conditions, formValues)
    pass = f.pass
    result = field.conditions.result
    newDefaultValue = f.newDefaultValue
  }

  return {
    pass,
    result: result ?? ***REMOVED***include***REMOVED***,
    newDefaultValue
  }
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
