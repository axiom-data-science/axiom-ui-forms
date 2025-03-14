import { type IForm, type IFormField, type IFormFieldType, type IFormValues } from '@/Form/Creator/FormCreatorTypes'
import Ajv, { type ValidateFunction } from 'ajv'

import { type JSONSchema7, type JSONSchema7Type, type JSONSchema7Definition } from 'json-schema'

import metaSchemaDraftV7 from 'ajv/lib/refs/json-schema-draft-07.json'
import metaSchemaDraftV6 from 'ajv/lib/refs/json-schema-draft-06.json'
import metaSchemaV5 from 'ajv/lib/refs/json-schema-2020-12/schema.json'
import metaSchemaV4 from 'ajv/lib/refs/json-schema-2019-09/schema.json'

import { resolveRefs } from '@/Form/resolveRefs'
import { omit } from 'lodash'

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

export const validateSchema = async (schemaOb: unknown, version: number = 6): Promise<{ schema?: JSONSchema7, error?: string }> => {
  const ajv = new Ajv({ strict: false })
  const validator = getValidator(version)
  const valid = validator(schemaOb)
  if (!valid) {
    return { error: ajv.errorsText(validator.errors) }
  }
  // const v = ajv.compile<JSONSchema7>(schemaOb as JSONSchema7)
  /* registerSchema(schemaOb as SchemaObject, 'https://axds.co/test')
  const bundledSchema = await bundle('https://axds.co/test')
  return { schema: bundledSchema as JSONSchema7 } */

  const resolved = resolveRefs(schemaOb as JSONSchema7)
  return { schema: resolved }
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
    } else if (schema.format === 'date-time') {
      return 'datetime'
    } else if (schema.format === 'date') {
      return 'date'
    } else if (schema.format === 'time') {
      return 'time'
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

const schemaToFormField = (schema: JSONSchema7, property: string, schemaField: JSONSchema7, multiple?: boolean): IFormField => {
  if (schemaField === undefined) {
    return {
      id: makeFormFieldId([schema.$id, property]),
      label: property,
      type: 'text',
      multiple
    }
  }
  if (typeof schemaField === 'boolean') {
    return {
      id: makeFormFieldId([schema.$id, property]),
      label: property,
      type: 'boolean',
      multiple
    }
  }
  if (schemaField.type === 'array' && schemaField.items !== undefined) {
    return schemaToFormField(schemaField, property, schemaField.items as JSONSchema7, true)
  }
  if (schemaField.anyOf !== undefined && schemaField.anyOf.length === 2 && schemaField.anyOf.filter(d => typeof d !== 'boolean' && d.type === 'null').length === 1) {
    const notNull = schemaField.anyOf.filter(d => typeof d !== 'boolean' && d.type !== 'null')[0]
    return schemaToFormField(schemaField, property, { ...omit(schemaField, 'anyOf'), ...(typeof notNull !== 'boolean' ? notNull : {}) }, multiple)
  }
  const type = getFieldType(schemaField)
  const id = makeFormFieldId([
    schemaField.$id,
    property,
    schemaField.title?.toLowerCase().replace(' ', '-')
  ])
  const label = makeLabel([
    schemaField.title,
    property
  ])
  const schemaRequired = schema.required ?? []
  const ob: Pick<IFormField, 'id' | 'label' | 'description' | 'multiple' | 'required'> = {
    id,
    label,
    description: schemaField.description,
    multiple,
    required: schemaRequired.includes(property) ?? false
  }
  if (type === 'text' || type === 'number' || type === 'long_text' || type === 'boolean' || type === 'datetime' || type === 'date' || type === 'time') {
    return {
      ...ob,
      type
    }
  }

  if (type === 'select' || type === 'checkbox') {
    const schemaOptions = schemaField.enum ?? schemaField.oneOf ?? schemaField.anyOf ?? []
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
    const properties = schemaField.properties ?? {}
    const fields: IFormField[] = []
    for (const key in properties) {
      if (properties[key] !== undefined && typeof properties[key] !== 'boolean') {
        fields.push(schemaToFormField(schemaField, key, properties[key]))
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
      formFields.push(schemaToFormField(schema, key, schema.properties[key]))
    }
  }
  return {
    id: makeFormFieldId([schema.$id, schema.title?.toLowerCase().replace(' ', '-')]),
    label: schema.title ?? 'Untitled',
    fields: formFields
  }
}
