import { type IForm, type IFormField, type IFormFieldType, type IFormValues } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import Ajv, { type ValidateFunction } from ***REMOVED***ajv***REMOVED***
import GenerateSchema from ***REMOVED***generate-schema***REMOVED***
import { type JSONSchema7, type JSONSchema7Type, type JSONSchema7Definition } from ***REMOVED***json-schema***REMOVED***

import metaSchemaDraftV7 from ***REMOVED***ajv/lib/refs/json-schema-draft-07.json***REMOVED***
import metaSchemaDraftV6 from ***REMOVED***ajv/lib/refs/json-schema-draft-06.json***REMOVED***
import metaSchemaV5 from ***REMOVED***ajv/lib/refs/json-schema-2020-12/schema.json***REMOVED***
import metaSchemaV4 from ***REMOVED***ajv/lib/refs/json-schema-2019-09/schema.json***REMOVED***

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
  return GenerateSchema.json(***REMOVED***Schema***REMOVED***, ob) as JSONSchema7
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
    .replace(/_/g, ***REMOVED*** ***REMOVED***)
    .split(***REMOVED*** ***REMOVED***)
    .map((s, i) => {
      return i === 0 ? `${s.charAt(0).toUpperCase()}${s.slice(1)}` : s
    }).join(***REMOVED*** ***REMOVED***)
}

const getFieldType = (schema: JSONSchema7): IFormFieldType => {
  const schemaType = schema.type
  if (schemaType === ***REMOVED***string***REMOVED*** || schemaType === ***REMOVED***number***REMOVED*** || schemaType === ***REMOVED***integer***REMOVED***) {
    if (schema.enum !== undefined || schema.oneOf !== undefined) {
      return ***REMOVED***select***REMOVED***
    } else if (schema.anyOf !== undefined) {
      return ***REMOVED***checkbox***REMOVED***
    } else if (schemaType === ***REMOVED***string***REMOVED*** && (schema.maxLength !== undefined && schema.maxLength <= 100)) {
      return ***REMOVED***text***REMOVED***
    } else if (schemaType === ***REMOVED***number***REMOVED*** || schemaType === ***REMOVED***integer***REMOVED***) {
      return ***REMOVED***number***REMOVED***
    }
    return ***REMOVED***long_text***REMOVED***
  } else if (schemaType === ***REMOVED***boolean***REMOVED***) {
    return ***REMOVED***boolean***REMOVED***
  } else if (schemaType === ***REMOVED***object***REMOVED***) {
    return ***REMOVED***object***REMOVED***
  }

  return ***REMOVED***text***REMOVED***
}

export const getValueFromSchema = (schema: JSONSchema7Type | JSONSchema7Definition | undefined): string | number | boolean | undefined => {
  if (schema === undefined || schema === null) {
    return undefined
  }
  if (typeof schema === ***REMOVED***string***REMOVED*** || typeof schema === ***REMOVED***number***REMOVED*** || typeof schema === ***REMOVED***boolean***REMOVED***) {
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
  if (typeof schema === ***REMOVED***boolean***REMOVED***) {
    return schema ? ***REMOVED***true***REMOVED*** : ***REMOVED***false***REMOVED***
  }
  if (typeof schema === ***REMOVED***string***REMOVED*** || typeof schema === ***REMOVED***number***REMOVED*** || typeof schema === ***REMOVED***boolean***REMOVED***) {
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
  if (schema.type === ***REMOVED***array***REMOVED***) {
    return schemaToFormField(schema.items as JSONSchema7, property, true)
  }
  const type = getFieldType(schema)
  const id = makeFormFieldId([
    schema.$id,
    property,
    schema.title?.toLowerCase().replace(***REMOVED*** ***REMOVED***, ***REMOVED***-***REMOVED***)
  ])
  const label = makeLabel([
    schema.title,
    property
  ])
  const ob: Pick<IFormField, ***REMOVED***id***REMOVED*** | ***REMOVED***label***REMOVED*** | ***REMOVED***multiple***REMOVED***> = {
    id,
    label,
    multiple
  }
  if (type === ***REMOVED***text***REMOVED*** || type === ***REMOVED***number***REMOVED*** || type === ***REMOVED***long_text***REMOVED*** || type === ***REMOVED***boolean***REMOVED***) {
    return {
      ...ob,
      type
    }
  }

  if (type === ***REMOVED***select***REMOVED*** || type === ***REMOVED***checkbox***REMOVED***) {
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
  if (type === ***REMOVED***object***REMOVED***) {
    const properties = schema.properties ?? {}
    const fields: IFormField[] = []
    for (const key in properties) {
      if (properties[key] !== undefined && typeof properties[key] !== ***REMOVED***boolean***REMOVED***) {
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
    type: ***REMOVED***text***REMOVED***,
    multiple
  }
}

export const schemaToFormObject = (schema: JSONSchema7): IForm => {
  const formFields: IFormField[] = []
  for (const key in schema.properties) {
    if (schema.properties[key] !== undefined && typeof schema.properties[key] !== ***REMOVED***boolean***REMOVED***) {
      formFields.push(schemaToFormField(schema.properties[key], key))
    }
  }
  return {
    id: makeFormFieldId([schema.$id, schema.title?.toLowerCase().replace(***REMOVED*** ***REMOVED***, ***REMOVED***-***REMOVED***)]),
    label: schema.title ?? ***REMOVED***Untitled***REMOVED***,
    fields: formFields
  }
}
