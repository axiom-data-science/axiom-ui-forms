import { CopyButton } from '@/Form/Manage/CopyableJSONOutput'
import { Tabs, TextArea } from '@axdspub/axiom-ui-utilities'
import { type JSONSchema7Type, type JSONSchema7, type JSONSchema7Definition } from 'json-schema'
import React, { useEffect, useState, type ReactElement } from 'react'
import metaSchemaDraftV7 from 'ajv/lib/refs/json-schema-draft-07.json'
import metaSchemaDraftV6 from 'ajv/lib/refs/json-schema-draft-06.json'
import metaSchemaV5 from 'ajv/lib/refs/json-schema-2020-12/schema.json'
import metaSchemaV4 from 'ajv/lib/refs/json-schema-2019-09/schema.json'
import testSchema from '@/Form/testData/testSchema.json'
import Ajv, { type ValidateFunction } from 'ajv'
import GenerateSchema from 'generate-schema'
import { type IFormFieldType, type IForm, type IFormField, type IFormValues } from '@/Form/FormCreatorTypes'
import FormCreator from '@/Form/FormCreator'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

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

const validateSchema = (schemaOb: unknown, version: number = 6): string | undefined => {
  const ajv = new Ajv({ strict: false })
  const validator = getValidator(version)
  const valid = validator(schemaOb)
  if (!valid) {
    return ajv.errorsText(validator.errors)
  }
  return undefined
}

const validateAgainstSchema = (schema: JSONSchema7, formValues: IFormValues): string[] | undefined => {
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
  const id = makeId([
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
    id: makeId([schema.$id, schema.title?.toLowerCase().replace(' ', '-')]),
    label: schema.title ?? 'Untitled',
    fields: formFields
  }
}

const SchemaToForm = (): ReactElement => {
  const [schema, setSchema] = useState<JSONSchema7 | undefined>(undefined)
  const [form, setForm] = useState<IForm | undefined>(undefined)
  const [formValues, setFormValues] = useState<IFormValues>({})
  const [error, setError] = useState<string | undefined>(validateSchema(schema))
  const [str, setStr] = useState<string | undefined>(JSON.stringify(testSchema, null, 2))
  const [formOutputErrors, setFormOutputErrors] = useState<string[] | undefined>(undefined)
  useEffect(() => {
    if (str !== '' && str !== undefined) {
      try {
        const ob = JSON.parse(str)
        const validationResponse = validateSchema(ob)
        setError(validationResponse)
        if (validationResponse === undefined) {
          setSchema(ob as JSONSchema7)
          setForm(schemaToFormObject(ob as JSONSchema7))
        }
      } catch {
        setError('Invalid JSON')
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
    <div className='flex flex-col h-full gap-4 p-20'>
        <h1 className='text-2xl'>Schema to Form</h1>
        <p>
            This page will allow you to convert a JSON schema to a form UI schema
        </p>
       <div className='grid grid-cols-2 gap-8 flex-grow'>
            <div className='h-full bg-slate-100 p-8'>
                {
                  form === undefined
                    ? <p>Waiting on valid schema</p>
                    : <Tabs
                        tabs={[
                          {
                            id: 'form',
                            label: 'Form',
                            content: <FormCreator form={form} formValueState={ [formValues, setFormValues]} />
                          },
                          {
                            id: 'output',
                            label: <>Form output {formOutputErrors !== undefined ? <ExclamationTriangleIcon className='inline ml-2' /> : ''}</>,
                            content: <div>{
                              schema !== undefined
                                ? <>
                              <p>{formOutputErrors !== undefined
                                ? <>Errors: <ul className='text-rose-800 text-xs list-disc p-4'>{
                                  formOutputErrors.map((e) => {
                                    return <li key={e}>{e}</li>
                                  })
                                  }</ul></>
                                : 'Form output is valid'}</p>
                              <div className='p-10 relative bg-yellow-200'>
                              <CopyButton string={JSON.stringify(form ?? '', null, 2)} className='absolute right-10 top-10 pointer-events-auto' />
                              <pre>{JSON.stringify(formValues ?? '', null, 2)}</pre>
                              </div>
                              </>
                                : 'No schema'
                              }
                              </div>
                          }
                        ]}
                        />
                }
            </div>
            <div className='h-full bg-slate-100 p-8 overflow-auto'>
                <div className='flex flex-col gap-2'>
                  <p>Schema</p>

                    <p className={`${error !== undefined ? 'text-rose-800' : 'text-green-800'}`}>
                        {error ?? 'No errors'}
                    </p>

                  <div className='relative'>
                      <CopyButton string={JSON.stringify(schema, null, 2)} className='absolute right-10 top-10 pointer-events-auto' />
                      <TextArea
                          id='schemaInput'
                          testId='schemaInput'
                          value={JSON.stringify(schema, null, 2)}
                          className={`h-full mt-0 w-full flex-grow min-h-[600px] shadow-inner-x ${error !== undefined ? 'bg-rose-100' : 'bg-green-100'}`}
                          onChange={(e) => {
                            setStr(e)
                          }}
                      />
                  </div>
                </div>
                <div className='flex flex-col gap-2'>

                          <p>UI Config</p>
                          <div className='relative'>
                            {
                              form !== undefined
                                ? <>
                                <CopyButton string={JSON.stringify(form ?? '', null, 2)} className='absolute right-10 top-10 pointer-events-auto' />
                                <TextArea
                                  id='formInput'
                                  testId='formInput'
                                  value={JSON.stringify(form, null, 2)}
                                  className='h-full mt-0 w-full flex-grow min-h-[600px] shadow-inner-x bg-blue-900 text-white'
                                  onChange={(e) => {
                                    setForm(e !== undefined ? JSON.parse(e) : undefined)
                                  }}
                                  />

                                </>
                                : 'Waiting on valid schema'
                            }

                          </div>

                </div>

            </div>
        </div>

    </div>
  )
}
export default SchemaToForm
