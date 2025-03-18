import { type IForm, type IFormField, type IFormFieldType, type IFormValues } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import Ajv, { type ValidateFunction } from ***REMOVED***ajv***REMOVED***

import { type JSONSchema6Type, type JSONSchema6Definition, type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***

import metaSchemaDraftV7 from ***REMOVED***ajv/lib/refs/json-schema-draft-07.json***REMOVED***
import metaSchemaDraftV6 from ***REMOVED***ajv/lib/refs/json-schema-draft-06.json***REMOVED***
import metaSchemaV5 from ***REMOVED***ajv/lib/refs/json-schema-2020-12/schema.json***REMOVED***
import metaSchemaV4 from ***REMOVED***ajv/lib/refs/json-schema-2019-09/schema.json***REMOVED***

import { resolveRefs } from ***REMOVED***@/Form/resolveRefs***REMOVED***
import { omit } from ***REMOVED***lodash***REMOVED***

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

export const validateSchema = (schemaOb: unknown, version: number = 6): { schema?: JSONSchema6, error?: string, unrefed?: JSONSchema6 } => {
  const ajv = new Ajv({ strict: false })
  const validator = getValidator(version)
  const valid = validator(schemaOb)
  if (!valid) {
    return { error: ajv.errorsText(validator.errors) }
  }
  // const v = ajv.compile<JSONSchema6>(schemaOb as JSONSchema6)
  /* registerSchema(schemaOb as SchemaObject, ***REMOVED***https://axds.co/test***REMOVED***)
  const bundledSchema = await bundle(***REMOVED***https://axds.co/test***REMOVED***)
  return { schema: bundledSchema as JSONSchema6 } */

  const resolved = resolveRefs(structuredClone(schemaOb) as JSONSchema6)
  return { schema: resolved, unrefed: schemaOb as JSONSchema6 }
}

export const validateAgainstSchema = (schema: JSONSchema6, formValues: IFormValues): string[] | undefined => {
  const validSchema = validateSchema(schema)
  if (validSchema.error !== undefined) {
    return [validSchema.error]
  }
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

const makeRandom = (): string => {
  return crypto !== undefined ? crypto.randomUUID() : Math.random().toString(36).substring(2)
}

const makeFormFieldId = (options: Array<string | number | undefined | null>): string => {
  const validOptions = options.filter((o) => o !== undefined && o !== null)
  if (validOptions.length === 0) {
    return makeRandom()
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

const getFieldType = (schema: JSONSchema6): IFormFieldType => {
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
    } else if (schema.format === ***REMOVED***date-time***REMOVED***) {
      return ***REMOVED***datetime***REMOVED***
    } else if (schema.format === ***REMOVED***date***REMOVED***) {
      return ***REMOVED***date***REMOVED***
    } else if (schema.format === ***REMOVED***time***REMOVED***) {
      return ***REMOVED***time***REMOVED***
    }
    return ***REMOVED***long_text***REMOVED***
  } else if (schemaType === ***REMOVED***boolean***REMOVED***) {
    return ***REMOVED***boolean***REMOVED***
  } else if (schemaType === ***REMOVED***object***REMOVED***) {
    return ***REMOVED***object***REMOVED***
  }
  if (!schemaType && (schema.anyOf !== undefined || schema.enum !== undefined)) {
    return ***REMOVED***object***REMOVED***
  }

  return ***REMOVED***text***REMOVED***
}

export const getValueFromSchema = (schema: JSONSchema6Type | JSONSchema6Definition | undefined): string | number | boolean | undefined => {
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

export const getLabelFromSchema = (schema: JSONSchema6Type | JSONSchema6Definition | undefined): string | undefined => {
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

const schemaToFormField = (schema: JSONSchema6, property: string, schemaField: JSONSchema6, multiple?: boolean): IFormField => {
  if (schemaField === undefined) {
    return {
      id: makeFormFieldId([schema.$id, property]),
      label: property,
      type: ***REMOVED***text***REMOVED***,
      multiple
    }
  }
  if (typeof schemaField === ***REMOVED***boolean***REMOVED***) {
    return {
      id: makeFormFieldId([schema.$id, property]),
      label: property,
      type: ***REMOVED***boolean***REMOVED***,
      multiple
    }
  }
  if (schemaField.type === ***REMOVED***array***REMOVED*** && schemaField.items !== undefined) {
    return schemaToFormField(schemaField, property, schemaField.items as JSONSchema6, true)
  }
  if (schemaField.anyOf !== undefined && schemaField.anyOf.length === 2 && schemaField.anyOf.filter(d => typeof d !== ***REMOVED***boolean***REMOVED*** && d.type === ***REMOVED***null***REMOVED***).length === 1) {
    const notNull = schemaField.anyOf.filter(d => typeof d !== ***REMOVED***boolean***REMOVED*** && d.type !== ***REMOVED***null***REMOVED***)[0]
    return schemaToFormField(schemaField, property, { ...omit(schemaField, ***REMOVED***anyOf***REMOVED***), ...(typeof notNull !== ***REMOVED***boolean***REMOVED*** ? notNull : {}) }, multiple)
  }
  const type = getFieldType(schemaField)
  const id = makeFormFieldId([
    schemaField.$id,
    property,
    schemaField.title?.toLowerCase().replace(***REMOVED*** ***REMOVED***, ***REMOVED***-***REMOVED***)
  ])
  const label = makeLabel([
    schemaField.title,
    property
  ])
  const schemaRequired = schema.required ?? []
  const ob: Pick<IFormField, ***REMOVED***id***REMOVED*** | ***REMOVED***label***REMOVED*** | ***REMOVED***description***REMOVED*** | ***REMOVED***multiple***REMOVED*** | ***REMOVED***required***REMOVED***> = {
    id,
    label,
    description: schemaField.description,
    multiple,
    required: schemaRequired.includes(property) ?? false
  }
  if (type === ***REMOVED***text***REMOVED*** || type === ***REMOVED***number***REMOVED*** || type === ***REMOVED***long_text***REMOVED*** || type === ***REMOVED***boolean***REMOVED*** || type === ***REMOVED***datetime***REMOVED*** || type === ***REMOVED***date***REMOVED*** || type === ***REMOVED***time***REMOVED***) {
    return {
      ...ob,
      type
    }
  }

  if (type === ***REMOVED***select***REMOVED*** || type === ***REMOVED***checkbox***REMOVED***) {
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
  if (type === ***REMOVED***object***REMOVED***) {
    // const anyOfAsProps = schemaField.anyOf !== undefined && schemaField.anyOf.filter(d => typeof d !== ***REMOVED***boolean***REMOVED*** && d.type !== ***REMOVED***null***REMOVED***).length > 0
    const properties = schemaField.properties ?? {}
    const fields: IFormField[] = []
    for (const key in properties) {
      if (properties[key] !== undefined && typeof properties[key] !== ***REMOVED***boolean***REMOVED***) {
        fields.push(schemaToFormField(schemaField, key, properties[key]))
      }
    }

    const ofArr = (schemaField.anyOf ?? []).concat(schemaField.allOf ?? [])

    ofArr.forEach((anyOf) => {
      const anyOfId = schemaField.$id
      if (typeof anyOf !== ***REMOVED***boolean***REMOVED*** && anyOf.type !== ***REMOVED***null***REMOVED***) {
        const field = schemaToFormField(
          schemaField,
          anyOfId ?? makeRandom(),
          typeof anyOf === ***REMOVED***boolean***REMOVED***
            ? anyOf
            : {
                title: anyOf.title ?? ***REMOVED******REMOVED***,
                ...anyOf
              },
          true
        )
        if (anyOfId === undefined && field.type === ***REMOVED***object***REMOVED***) {
          field.skip_path = true
        }
        fields.push(field)
      }
    })

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

export const schemaToFormObject = (schema: JSONSchema6): IForm => {
  const formFields: IFormField[] = []
  for (const key in schema.properties) {
    if (schema.properties[key] !== undefined && typeof schema.properties[key] !== ***REMOVED***boolean***REMOVED***) {
      formFields.push(schemaToFormField(schema, key, schema.properties[key]))
    }
  }
  return {
    id: makeFormFieldId([schema.$id, schema.title?.toLowerCase().replace(***REMOVED*** ***REMOVED***, ***REMOVED***-***REMOVED***)]),
    label: schema.title ?? ***REMOVED***Untitled***REMOVED***,
    fields: formFields
  }
}
