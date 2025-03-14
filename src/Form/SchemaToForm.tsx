import { CopyButton } from '@/Form/Manage/CopyableJSONOutput'
import { Tabs, TextArea } from '@axdspub/axiom-ui-utilities'
import { type JSONSchema7 } from 'json-schema'
import React, { useEffect, useState, type ReactElement } from 'react'

import testSchema from '@/Form/testData/pttSchema.json'
import { type IForm, type IFormValues } from '@/Form/Creator/FormCreatorTypes'
import FormCreator from '@/Form/Creator/FormCreator'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import ObjectInput from '@/Form/Components/Inputs/Object'
import { schemaToFormObject, validateAgainstSchema, validateSchema } from '@/Form/schemaToFormHelpers'
import GenerateSchema from 'generate-schema'

const objectToSchema = (ob: unknown): JSONSchema7 => {
  return GenerateSchema.json('Schema', ob) as JSONSchema7
}

const isValidJson = (ob: unknown): boolean => {
  try {
    JSON.stringify(ob)
    return true
  } catch {
    return false
  }
}

const SchemaToForm = (): ReactElement => {
  const [schema, setSchema] = useState<JSONSchema7 | undefined>(undefined)
  const [form, setForm] = useState<IForm | undefined>(undefined)
  const [objectInput, setObjectInput] = useState<unknown>(undefined)
  const [formValues, setFormValues] = useState<IFormValues>({})
  const [error, setError] = useState<string | undefined>(undefined)
  const [str, setStr] = useState<string | undefined>(JSON.stringify(testSchema, null, 2))
  const [formOutputErrors, setFormOutputErrors] = useState<string[] | undefined>(undefined)
  useEffect(() => {
    if (str !== '' && str !== undefined) {
      try {
        const ob = JSON.parse(str)
        validateSchema(ob).then(validationResponse => {
          setError(validationResponse.error)
          if (validationResponse.schema !== undefined) {
            setSchema(validationResponse.schema)
            setForm(schemaToFormObject(validationResponse.schema))
          }
        }).catch(e => {
          console.error(e)
          setError('Invalid JSON')
        })
      } catch (e) {
        console.error(e)
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
                <div className='flex flex-col gap-2'>
                  <p>Paste JSON to convert to schema</p>
                  <TextArea
                    id='jsonInput'
                    testId='jsonInput'
                    value={JSON.stringify(objectInput, null, 2)}
                    onChange={(e) => {
                      setObjectInput(e !== undefined ? JSON.parse(e) : undefined)
                    }}
                    />
                  <div className='relative'>
                            {
                              objectInput !== undefined && isValidJson(objectInput)
                                ? <>
                                <CopyButton string={JSON.stringify(objectToSchema(objectInput) ?? '', null, 2)} className='absolute right-10 top-10 pointer-events-auto' />
                                <TextArea
                                  id='convertedObject'
                                  testId='convertedObject'
                                  value={JSON.stringify(objectToSchema(ObjectInput), null, 2)}
                                  className='h-full mt-0 w-full flex-grow min-h-[600px] shadow-inner-x bg-green-900 text-white'
                                  />

                                </>
                                : 'Waiting on valid object input'
                            }

                          </div>
                </div>

            </div>
        </div>

    </div>
  )
}
export default SchemaToForm
