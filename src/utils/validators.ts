import { type IFormSectionStatus } from '@/Form/Creator/FormCreator'
import { type IFormValues, type IFormField, type IFormSection, type IFieldCondition, type IValueType, type IFieldConditionOperator, type IFieldConditionResult, type ICheckConditionResult, type IForm } from '@/Form/Creator/FormCreatorTypes'
import { getFieldsFromFormSection, getFieldValue, getValueFromRelativePath } from '@/utils/getters'

const compare = (val: IValueType | IValueType[], operator: IFieldConditionOperator, compareTo: string | number | boolean): boolean => {
  if (val === undefined || val === null) {
    return operator === '!='
  }
  if (operator === '=' || operator === 'eq') {
    // eslint-disable-next-line eqeqeq
    return val == compareTo
  }
  if (operator === '>' || operator === 'gt') {
    return +val > +compareTo
  }
  if (operator === '>=' || operator === 'gte') {
    return +val >= +compareTo
  }
  if (operator === '<' || operator === 'lt') {
    return +val < +compareTo
  }
  if (operator === '<=' || operator === 'lte') {
    return +val <= +compareTo
  }
  if (operator === '!=' || operator === '!eq') {
    // eslint-disable-next-line eqeqeq
    return val != compareTo
  }
  console.warn(`Unknown operator: ${String(operator)}`)
  return false
}

const runCheck = (
  fieldValue: IValueType | IValueType[],
  operator: IFieldConditionOperator | undefined = '=',
  val: string | number | boolean | undefined
): boolean => {
  if (val === undefined) {
    // ignore operator if val isn't set
    return fieldValue !== null && fieldValue !== undefined && fieldValue !== false && fieldValue !== ''
  }
  return val !== undefined
    ? val === false
      ? (fieldValue === null || fieldValue === undefined || fieldValue === false || fieldValue === '')
      : compare(fieldValue, operator || '=', val)
    : (fieldValue !== null && fieldValue !== undefined && fieldValue !== false && fieldValue !== '')
}

const checkFieldCondition = (field: IFormField, condition: IFieldCondition, formValues: IFormValues): ICheckConditionResult => {
  const fieldToEval = condition.field ?? condition.dependsOn
  if (fieldToEval === undefined) {
    console.warn('Field condition is missing field or dependsOn property')
    return {
      pass: true,
      result: condition.result ?? 'include',
      newDefaultValue: condition.newDefaultValue
    }
  }
  if (Array.isArray(fieldToEval)) {
    console.warn('Field condition dependsOn (or field) should not be an array, use conditionsSet for multiple conditions. dependsOn as array will be deprated')
  }
  const dependsOn = Array.isArray(fieldToEval) ? fieldToEval : [fieldToEval]
  const val = condition.value
  const pass = dependsOn.every(d => {
    /* const fieldPathIsRelative = d.startsWith('.')
    const fieldValue = getValueFromPath(d, formValues) */
    const fieldValue = getValueFromRelativePath(field, d, formValues)
    return runCheck(
      fieldValue,
      condition.operator ?? '=',
      val
    )
  })
  return {
    pass,
    result: condition.result ?? 'include',
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

    pass = field.conditionsSet.logic === 'or'
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
    result: result ?? 'include',
    newDefaultValue
  }
}

const testField = (field: IFormField, formValues: IFormValues): boolean => {
  const val = getFieldValue(field, formValues)
  return val !== undefined && val !== null && val !== ''
}

export const calculateSectionStatus = (sections: IFormSection[] | IForm[], formValues: IFormValues): IFormSectionStatus => {
  return Object.fromEntries(sections.map(s => {
    const fields = getFieldsFromFormSection(s).filter(f => f.type !== 'object')
    const total = fields.length
    const completed = fields.filter(f => testField(f, formValues)).length
    const required = fields.filter(f => f.required)
    const requiredTotal = required.length
    const requiredCompleted = required.filter(f => testField(f, formValues)).length
    const valid = requiredTotal === requiredCompleted
    return [s.id, { completed, total, requiredTotal, requiredCompleted, valid }]
  }))
}
