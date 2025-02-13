import { CopyButton } from ***REMOVED***@/Form/Manage/CopyableJSONOutput***REMOVED***
import { Tabs, TextArea } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { type JSONSchema6Type, type JSONSchema6, type JSONSchema6Definition } from ***REMOVED***json-schema***REMOVED***
import React, { useEffect, useState, type ReactElement } from ***REMOVED***react***REMOVED***
import metaSchemaDraftV7 from ***REMOVED***ajv/lib/refs/json-schema-draft-07.json***REMOVED***
import metaSchemaDraftV6 from ***REMOVED***ajv/lib/refs/json-schema-draft-06.json***REMOVED***
import metaSchemaV5 from ***REMOVED***ajv/lib/refs/json-schema-2020-12/schema.json***REMOVED***
import metaSchemaV4 from ***REMOVED***ajv/lib/refs/json-schema-2019-09/schema.json***REMOVED***
import testSchema from ***REMOVED***@/Form/testData/testSchema.json***REMOVED***
import Ajv, { type ValidateFunction } from ***REMOVED***ajv***REMOVED***
import GenerateSchema from ***REMOVED***generate-schema***REMOVED***
import { type IFormFieldType, type IForm, type IFormField, type IFormValues } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import FormCreator from ***REMOVED***@/Form/FormCreator***REMOVED***
import { ExclamationTriangleIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***

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

export const objectToSchema = (ob: unknown): JSONSchema6 => {
  return GenerateSchema.json(***REMOVED***Schema***REMOVED***, ob) as JSONSchema6
}

const validateSchema = (schemaOb: unknown, version: number = 6): string | undefined => {
  const ajv = new Ajv({ strict: false })
  const validator = getValidator(version)
  const valid = validator(schemaOb)
  if (!valid) {
    return ajv.errorsText(validator.errors)
  }
  return undefined
}

const validateAgainstSchema = (schema: JSONSchema6, formValues: IFormValues): string[] | undefined => {
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

const makeId = (options: Array<string | number | undefined | null>): string => {
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
    }
    return ***REMOVED***long_text***REMOVED***
  } else if (schemaType === ***REMOVED***boolean***REMOVED***) {
    return ***REMOVED***boolean***REMOVED***
  } else if (schemaType === ***REMOVED***object***REMOVED***) {
    return ***REMOVED***object***REMOVED***
  } else if (schemaType === ***REMOVED***any***REMOVED***) {
    return ***REMOVED***json***REMOVED***
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

const schemaToFormField = (schema: JSONSchema6, property: string, multiple?: boolean): IFormField => {
  if (schema.type === ***REMOVED***array***REMOVED***) {
    return schemaToFormField(schema.items as JSONSchema6, property, true)
  }
  const type = getFieldType(schema)
  const id = makeId([
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

export const schemaToFormObject = (schema: JSONSchema6): IForm => {
  const formFields: IFormField[] = []
  for (const key in schema.properties) {
    if (schema.properties[key] !== undefined && typeof schema.properties[key] !== ***REMOVED***boolean***REMOVED***) {
      formFields.push(schemaToFormField(schema.properties[key], key))
    }
  }
  return {
    id: makeId([schema.$id, schema.title?.toLowerCase().replace(***REMOVED*** ***REMOVED***, ***REMOVED***-***REMOVED***)]),
    label: schema.title ?? ***REMOVED***Untitled***REMOVED***,
    fields: formFields
  }
}

const SchemaToForm = (): ReactElement => {
  const [schema, setSchema] = useState<JSONSchema6 | undefined>(undefined)
  const [form, setForm] = useState<IForm | undefined>(undefined)
  const [formValues, setFormValues] = useState<IFormValues>({})
  const [error, setError] = useState<string | undefined>(validateSchema(schema))
  const [str, setStr] = useState<string | undefined>(JSON.stringify(testSchema, null, 2))
  const [formOutputErrors, setFormOutputErrors] = useState<string[] | undefined>(undefined)
  useEffect(() => {
    if (str !== ***REMOVED******REMOVED*** && str !== undefined) {
      try {
        const ob = JSON.parse(str)
        const validationResponse = validateSchema(ob)
        setError(validationResponse)
        if (validationResponse === undefined) {
          setSchema(ob as JSONSchema6)
          setForm(schemaToFormObject(ob as JSONSchema6))
        }
      } catch {
        setError(***REMOVED***Invalid JSON***REMOVED***)
      }
    } else {
      setSchema(undefined)
      setForm(undefined)
    }
  }, [str])
  useEffect(() => {
    setFormOutputErrors(validateAgainstSchema(schema ?? {}, formValues))
  }, [formValues])
  return (
    <div className=***REMOVED***flex flex-col h-full gap-4 p-20***REMOVED***>
        <h1 className=***REMOVED***text-2xl***REMOVED***>Schema to Form</h1>
        <p>
            This page will allow you to convert a JSON schema to a form UI schema
        </p>
       <div className=***REMOVED***grid grid-cols-2 gap-8 flex-grow***REMOVED***>
            <div className=***REMOVED***h-full bg-slate-100 p-8***REMOVED***>
                {
                  form === undefined
                    ? <p>Waiting on valid schema</p>
                    : <Tabs
                        tabs={[
                          {
                            id: ***REMOVED***form***REMOVED***,
                            label: ***REMOVED***Form***REMOVED***,
                            content: <FormCreator form={form} formValueState={ [formValues, setFormValues]} />
                          },
                          {
                            id: ***REMOVED***output***REMOVED***,
                            label: <>Form output {formOutputErrors !== undefined ? <ExclamationTriangleIcon className=***REMOVED***inline ml-2***REMOVED*** /> : ***REMOVED******REMOVED***}</>,
                            content: <div>{
                              schema !== undefined
                                ? <>
                              <p>{formOutputErrors !== undefined
                                ? <>Errors: <ul className=***REMOVED***text-rose-800 text-xs list-disc p-4***REMOVED***>{
                                  formOutputErrors.map((e) => {
                                    return <li key={e}>{e}</li>
                                  })
                                  }</ul></>
                                : ***REMOVED***Form output is valid***REMOVED***}</p>
                              <div className=***REMOVED***p-10 relative bg-yellow-200***REMOVED***>
                              <CopyButton string={JSON.stringify(form ?? ***REMOVED******REMOVED***, null, 2)} className=***REMOVED***absolute right-10 top-10 pointer-events-auto***REMOVED*** />
                              <pre>{JSON.stringify(formValues ?? ***REMOVED******REMOVED***, null, 2)}</pre>
                              </div>
                              </>
                                : ***REMOVED***No schema***REMOVED***
                              }
                              </div>
                          }
                        ]}
                        />
                }
            </div>
            <div className=***REMOVED***h-full bg-slate-100 p-8 overflow-auto***REMOVED***>
                <div className=***REMOVED***flex flex-col gap-2***REMOVED***>
                  <p>Schema</p>

                    <p className={`${error !== undefined ? ***REMOVED***text-rose-800***REMOVED*** : ***REMOVED***text-green-800***REMOVED***}`}>
                        {error ?? ***REMOVED***No errors***REMOVED***}
                    </p>

                  <div className=***REMOVED***relative***REMOVED***>
                      <CopyButton string={JSON.stringify(schema, null, 2)} className=***REMOVED***absolute right-10 top-10 pointer-events-auto***REMOVED*** />
                      <TextArea
                          id=***REMOVED***schemaInput***REMOVED***
                          testId=***REMOVED***schemaInput***REMOVED***
                          value={JSON.stringify(schema, null, 2)}
                          className={`h-full mt-0 w-full flex-grow min-h-[600px] shadow-inner-x ${error !== undefined ? ***REMOVED***bg-rose-100***REMOVED*** : ***REMOVED***bg-green-100***REMOVED***}`}
                          onChange={(e) => {
                            setStr(e)
                          }}
                      />
                  </div>
                </div>
                <div className=***REMOVED***flex flex-col gap-2***REMOVED***>

                          <p>UI Config</p>
                          <div className=***REMOVED***relative***REMOVED***>
                            {
                              form !== undefined
                                ? <>
                                <CopyButton string={JSON.stringify(form ?? ***REMOVED******REMOVED***, null, 2)} className=***REMOVED***absolute right-10 top-10 pointer-events-auto***REMOVED*** />
                                <TextArea
                                  id=***REMOVED***formInput***REMOVED***
                                  testId=***REMOVED***formInput***REMOVED***
                                  value={JSON.stringify(form, null, 2)}
                                  className=***REMOVED***h-full mt-0 w-full flex-grow min-h-[600px] shadow-inner-x bg-blue-900 text-white***REMOVED***
                                  onChange={(e) => {
                                    setForm(e !== undefined ? JSON.parse(e) : undefined)
                                  }}
                                  />

                                </>
                                : ***REMOVED***Waiting on valid schema***REMOVED***
                            }

                          </div>

                </div>

            </div>
        </div>

    </div>
  )
}
export default SchemaToForm
