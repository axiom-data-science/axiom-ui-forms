import { CopyButton } from '@/Form/Manage/CopyableJSONOutput'
import { Tabs, TextArea } from '@axdspub/axiom-ui-utilities'
import { type JSONSchema6 } from 'json-schema'
import React, { useMemo, useState, type ReactElement } from 'react'

import testSchema from '@/Form/testData/schemas/pttSchemaModified.json'
import { type IForm, type IFormValues } from '@/Form/Creator/FormCreatorTypes'
import FormCreator from '@/Form/Creator/FormCreator'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { getSchemaPaths, schemaToFormObject, validateAgainstSchema, validateSchema } from '@/utils/schemaToFormHelpers'
import toJsonSchema from 'to-json-schema'
import { JSONInput } from '@/Form/Components/Inputs'

const objectToSchema = (ob: unknown): JSONSchema6 => {
  return toJsonSchema(ob) as JSONSchema6
}

const isValidJson = (ob: string): boolean => {
  try {
    JSON.parse(ob)
    return true
  } catch {
    return false
  }
}

const SchemaToForm = (): ReactElement => {
  const [objectInput, setObjectInput] = useState<string | undefined>(undefined)
  const [formValues, setFormValues] = useState<IFormValues>({})
  const [error, setError] = useState<string | undefined>(undefined)
  const [str, setStr] = useState<string | undefined>(JSON.stringify(testSchema, null, 2))

  let form: IForm | undefined
  let schema: JSONSchema6 | undefined

  try {
    const ob = JSON.parse(str === undefined || str === '' ? '{}' : str)
    const validationResponse = validateSchema(ob)

    if (validationResponse.schema !== undefined) {
      schema = validationResponse.schema
      form = schemaToFormObject(validationResponse.schema)
    }
  } catch (e) {
    console.error(e)
    setError('Invalid JSON')
  }

  const formOutputErrors = useMemo(() => {
    return validateAgainstSchema(schema ?? {}, formValues)
  }, [schema, formValues])
  // const formOutputErrors = validateAgainstSchema(schema ?? {}, formValues)
  const schemaObjectIsValid = objectInput !== undefined && isValidJson(objectInput)
  const schemaObjectError = objectInput !== undefined && !schemaObjectIsValid ? 'Invalid JSON' : undefined
  const schemaFromObject = schemaObjectIsValid ? objectToSchema(JSON.parse(objectInput)) : undefined
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
                              <div>{formOutputErrors !== undefined
                                ? <>Errors: <ul className='text-rose-800 text-xs list-disc p-4'>{
                                  formOutputErrors.map((e) => {
                                    return <li key={e}>{e}</li>
                                  })
                                  }</ul></>
                                : 'Form output is valid'}</div>
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
            <div className='h-full flex flex-col gap-10 bg-slate-100 p-8 overflow-auto'>
                <Tabs
                  tabs={[
                    {
                      label: 'Schema',
                      id: 'schema',
                      content: <div className='flex flex-col gap-4'>
                      <div className='flex flex-col gap-2'>

                          <p className={`${error !== undefined ? 'text-rose-800' : 'text-green-800'}`}>
                              {error ?? 'No errors'}
                          </p>

                        <div className='relative'>
                            {/* <CopyButton string={JSON.stringify(schema, null, 2)} className='absolute right-10 top-10 pointer-events-auto' /> */}
                            <JSONInput
                              value={str}
                              onChange={(e) => {
                                setStr(e !== undefined ? String(e) : undefined)
                              } }
                              field={{
                                id: 'schemaInput',
                                label: 'Schema Input',
                                type: 'json'
                              }}
                              />

                        </div>
                      </div>
                      <div className='flex flex-col gap-2'>

                                  <p className='font-bold'>Converted Form</p>
                                  {
                                    form !== undefined
                                      ? <div className='relative'>
                                      <CopyButton string={JSON.stringify(form ?? '', null, 2)}
                                        wrapperClassName='absolute right-5 bottom-5 pointer-events-auto'
                                        />
                                      <pre className='p-5 text-blue-200 text-xs max-h-[400px] shadow-inner-x bg-blue-900 font-mono whitespace-pre-wrap overflow-auto'>
                                        {JSON.stringify(form, null, 2)}
                                      </pre>
                                      </div>

                                      : 'Waiting on valid schema'
                                  }

                      </div>
                      <div className='flex flex-col gap-2'>
                        <JSONInput
                          value={objectInput}
                          onChange={(e) => {
                            setObjectInput(e !== undefined ? String(e) : undefined)
                          } }
                          field={{
                            id: 'objectInput',
                            label: 'Paste JSON to convert to schema',
                            type: 'json'
                          }}
                          className='h-full mt-0 w-full flex-grow max-h-[400px] shadow-inner-x bg-blue-900 text-white'
                          />

                          {
                            schemaObjectError !== undefined
                              ? <p className='text-rose-800'>{schemaObjectError}</p>
                              : ''
                          }
                        <div className='relative'>
                                  {
                                    objectInput !== undefined && isValidJson(objectInput)
                                      ? <>
                                      <CopyButton string={schemaFromObject !== undefined ? JSON.stringify(schemaFromObject, null, 2) : ''} className='absolute right-10 top-10 pointer-events-auto' />
                                      <TextArea
                                        id='convertedObject'
                                        testId='convertedObject'
                                        value={schemaFromObject !== undefined ? JSON.stringify(schemaFromObject, null, 2) : ''}
                                        className='h-full mt-0 w-full flex-grow min-h-[600px] shadow-inner-x bg-green-900 text-white'
                                        />

                                      </>
                                      : 'Waiting on valid object input'
                                  }

                                </div>
                      </div>
                      </div>
                    },
                    {
                      label: 'Form config overrides',
                      id: 'overrides',
                      content: <div className='flex flex-row gap-4'>
                          <div className=''>
                            {
                              schema !== undefined
                                ? getSchemaPaths(schema).map((p) => {
                                  return <p key={p}>{p}</p>
                                })

                                : 'Waiting on valid schema'
                            }
                            </div>
                        </div>
                    }
                  ]}
                  />

            </div>
        </div>

    </div>
  )
}
export default SchemaToForm
