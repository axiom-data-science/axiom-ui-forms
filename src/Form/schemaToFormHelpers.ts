import { type IForm, type IFormField, type IFormFieldType, type IFormValues } from '@/Form/FormCreatorTypes'
import Ajv, { type ValidateFunction } from 'ajv'
import GenerateSchema from 'generate-schema'
import { type JSONSchema7, type JSONSchema7Type, type JSONSchema7Definition } from 'json-schema'

import metaSchemaDraftV7 from 'ajv/lib/refs/json-schema-draft-07.json'
import metaSchemaDraftV6 from 'ajv/lib/refs/json-schema-draft-06.json'
import metaSchemaV5 from 'ajv/lib/refs/json-schema-2020-12/schema.json'
import metaSchemaV4 from 'ajv/lib/refs/json-schema-2019-09/schema.json'

const getValidator = (schema: number): ValidateFunction => {
  const ajv = new Ajv({ strict: false })
  switch (schema) {
    case 4:
      return ajv.compile(metaSchemaV4)
    case 5:
      return ajv.compile(metaSchemaV5)
    case 6:
      return ajv.compile(metaSchemaDraftV6)
    case 7:
      return ajv.compile(metaSchemaDraftV7)
    default:
      return ajv.compile(metaSchemaV5)
  }
}

export const objectToSchema = (ob: unknown): JSONSchema7 => {
  return GenerateSchema.json('Schema', ob) as JSONSchema7
}

export const validateSchema = (schemaOb: unknown, version: number = 6): string | undefined => {
  const ajv = new Ajv({ strict: false })
  const validator = getValidator(version)
  const valid = validator(schemaOb)
  if (!valid) {
    return ajv.errorsText(validator.errors)
  }
  return undefined
}

export const validateAgainstSchema = (schema: JSONSchema7, formValues: IFormValues): string[] | undefined => {
  const ajv = new Ajv({ strict: false, allErrors: true })
  const validator = ajv.compile(schema)
  const valid = validator(formValues)
  if (validator.errors !== null && validator.errors !== undefined && !valid) {
    return validator.errors.map(e => {
      return `${e.instancePath} ${e.message}`
    })
  }
  return undefined
}

const makeFormFieldId = (options: Array<string | number | undefined | null>): string => {
  const validOptions = options.filter((o) => o !== undefined && o !== null)
  if (validOptions.length === 0) {
    return crypto !== undefined ? crypto.randomUUID() : Math.random().toString(36).substring(2)
  }
  return String(validOptions[0])
}

const makeLabel = (options: Array<string | number | undefined | null>): string | undefined => {
  const validOptions = options.filter((o) => o !== undefined && o !== null)
  if (validOptions.length === 0) {
    return undefined
  }
  return String(validOptions[0])
    .replace(/_/g, ' ')
    .split(' ')
    .map((s, i) => {
      return i === 0 ? `${s.charAt(0).toUpperCase()}${s.slice(1)}` : s
    }).join(' ')
}

const getFieldType = (schema: JSONSchema7): IFormFieldType => {
  const schemaType = schema.type
  if (schemaType === 'string' || schemaType === 'number' || schemaType === 'integer') {
    if (schema.enum !== undefined || schema.oneOf !== undefined) {
      return 'select'
    } else if (schema.anyOf !== undefined) {
      return 'checkbox'
    } else if (schemaType === 'string' && (schema.maxLength !== undefined && schema.maxLength <= 100)) {
      return 'text'
    } else if (schemaType === 'number' || schemaType === 'integer') {
      return 'number'
    }
    return 'long_text'
  } else if (schemaType === 'boolean') {
    return 'boolean'
  } else if (schemaType === 'object') {
    return 'object'
  }

  return 'text'
}

export const getValueFromSchema = (schema: JSONSchema7Type | JSONSchema7Definition | undefined): string | number | boolean | undefined => {
  if (schema === undefined || schema === null) {
    return undefined
  }
  if (typeof schema === 'string' || typeof schema === 'number' || typeof schema === 'boolean') {
    return schema
  }
  if (Array.isArray(schema)) {
    if (schema.length > 0) {
      return getValueFromSchema(schema[0])
    }
    return undefined
  }
  if (schema.const !== undefined) {
    return String(schema.const)
  }
  return undefined
}

export const getLabelFromSchema = (schema: JSONSchema7Type | JSONSchema7Definition | undefined): string | undefined => {
  if (schema === undefined || schema === null) {
    return undefined
  }
  if (typeof schema === 'boolean') {
    return schema ? 'true' : 'false'
  }
  if (typeof schema === 'string' || typeof schema === 'number' || typeof schema === 'boolean') {
    return String(schema)
  }
  if (Array.isArray(schema)) {
    if (schema.length > 0) {
      return getLabelFromSchema(schema[0])
    }
    return undefined
  }
  if (schema.title !== undefined && schema.title !== null) {
    return getLabelFromSchema(schema.title)
  }
  return String(getValueFromSchema(schema))
}

const schemaToFormField = (schema: JSONSchema7, property: string, multiple?: boolean): IFormField => {
  if (schema.type === 'array') {
    return schemaToFormField(schema.items as JSONSchema7, property, true)
  }
  const type = getFieldType(schema)
  const id = makeFormFieldId([
    schema.$id,
    property,
    schema.title?.toLowerCase().replace(' ', '-')
  ])
  const label = makeLabel([
    schema.title,
    property
  ])
  const ob: Pick<IFormField, 'id' | 'label' | 'multiple'> = {
    id,
    label,
    multiple
  }
  if (type === 'text' || type === 'number' || type === 'long_text' || type === 'boolean') {
    return {
      ...ob,
      type
    }
  }

  if (type === 'select' || type === 'checkbox') {
    const schemaOptions = schema.enum ?? schema.oneOf ?? schema.anyOf ?? []
    const options = schemaOptions.map(e => {
      const value = getValueFromSchema(e)
      const label = getLabelFromSchema(e)
      return value !== undefined
        ? {
            value: String(value),
            label: label ?? String(value)
          }
        : null
    }).filter(d => d !== null)
    return {
      ...ob,
      type,
      options
    }
  }
  if (type === 'object') {
    const properties = schema.properties ?? {}
    const fields: IFormField[] = []
    for (const key in properties) {
      if (properties[key] !== undefined && typeof properties[key] !== 'boolean') {
        fields.push(schemaToFormField(properties[key], key))
      }
    }
    return {
      ...ob,
      type,
      fields,
      multiple
    }
  }

  return {
    id,
    type: 'text',
    multiple
  }
}

export const schemaToFormObject = (schema: JSONSchema7): IForm => {
  const formFields: IFormField[] = []
  for (const key in schema.properties) {
    if (schema.properties[key] !== undefined && typeof schema.properties[key] !== 'boolean') {
      formFields.push(schemaToFormField(schema.properties[key], key))
    }
  }
  return {
    id: makeFormFieldId([schema.$id, schema.title?.toLowerCase().replace(' ', '-')]),
    label: schema.title ?? 'Untitled',
    fields: formFields
  }
}
