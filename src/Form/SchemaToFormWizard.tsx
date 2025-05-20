import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFormValues, type IForm, type IFieldInputProps, type IValueType } from '@/Form/Creator/FormCreatorTypes'
import { atom, useAtom } from 'jotai'
import { type JSONSchema6 } from 'json-schema'
import React, { useEffect } from 'react'
import { useState, type ReactElement } from 'react'
import toJsonSchema from 'to-json-schema'
import { getSchemaPaths, schemaToFormObject } from '@/utils/schemaToFormHelpers'
import JSONInputLoader from '@/Form/Components/Inputs/JSONInputLoader'
import { CopyButton } from '@/Form/Manage/CopyableJSONOutput'
import { CheckIcon, CopyIcon, Cross2Icon } from '@radix-ui/react-icons'
import FormCreator from '@/Form/Creator/FormCreator'
import { Button } from '@axdspub/axiom-ui-utilities'
import { set } from 'lodash'

const objectToSchema = (ob: unknown): JSONSchema6 => {
  return toJsonSchema(ob) as JSONSchema6
}

const formValuesAtom = atom<IFormValues>({
  // object_input: oikosLayer,
  // schema_input: objectToSchema(oikosLayer) as IValueType
})

const inputOverrides = {

  'custom:form-output': (): ReactElement => {
    const [formValues] = useAtom(formValuesAtom)
    const formValueState = useState<IFormValues>({})
    const form = schemaToFormObject(formValues.schema_input as JSONSchema6)
    return (
      <>{
        formValues.schema_input !== undefined
          ? <div className='p-5 bg-slate-200'>

              <FormCreator className='m-5 p-5 max-h-[500px] border-2 border-dashed border-slate-400 overflow-y-scroll bg-white' form={form} formValueState={formValueState} />
              <CopyButton
                string={JSON.stringify(form, null, 2)}
                OnCopiedElement={<><CheckIcon className=' inline' /> Copied to clipboard</>}
                ToCopyElement={<><CopyIcon className=' inline' /> Copy form config</>}

              />
              </div>
          : <p>Waiting on schema input</p>
      }</>
    )
  },
  'custom:form-overrides': ({ field, value, onChange }: IFieldInputProps): ReactElement => {
    const [formValues] = useAtom(formValuesAtom)
    const schemaInput = (formValues.schema_input ?? {}) as JSONSchema6
    const schemaPaths = getSchemaPaths(schemaInput)
    const [val, setVal] = useState<string | undefined>(typeof value === 'string' ? value : undefined)
    return (
            <div>
                <FieldLabel {...field} />
                <div className='flex flex-row gap-10'>
                  <div className='w-[300px] h-[600px] flex-none overflow-y-scroll bg-slate-200 p-4 whitespace-pre text-xs'>
                    {
                      schemaPaths.map(path => {
                        return <p key={path}>{path}</p>
                      })
                    }
                  </div>
                  <div className='flex-grow'>
                    <JSONInputLoader
                      field={{ ...field, label: null, description: null }}
                      onChange={(e) => {
                        setVal(e as string | undefined)
                        onChange(e)
                      }}
                      value={val}
                    />
                  </div>
                </div>
            </div>
    )
  },
  'custom:schema_input': ({ field, value, onChange }: IFieldInputProps): ReactElement => {
    /// const [formValues] = useAtom(formValuesAtom)
    return (
            <JSONInputLoader
                field={field}
                value={value}
                onChange={(v) => {
                  onChange(v)
                }}
                />
    )
  }
}

const ObjectToSchemaWizard = ({ setShow }: { setShow: (t: boolean) => void }): ReactElement => {
  const [schema, setSchema] = useState<JSONSchema6 | undefined>(undefined)
  const [,setFormValues] = useAtom(formValuesAtom)
  return (
    <div className='flex flex-row'>
        <div className='w-[50%] h-full  p-5'>
        <JSONInputLoader
            field={{
              id: 'object_input',
              type: 'json',
              settings: { allowEmpty: true },
              description: 'Paste JSON or YAML here that you want to convert to a schema.'
            }}
            value={undefined}
            onChange={(v) => {
              setSchema(objectToSchema(v))
            }}
            />
        </div>
        <div className='flex-grow p-5 relative'>
          <div className='bg-slate-200 h-full p-4 overflow-auto max-h-[600px]'>
            {
              <pre className='whitespace-pre text-xs'>
                {schema !== undefined
                  ? JSON.stringify(schema, null, 2)
                  : 'Waiting on object input'}
              </pre>
            }
          </div>
                      {
              schema !== undefined
                ? <>
                  <span className='absolute top-10 right-10'>
                    <CopyButton
                      string={JSON.stringify(schema, null, 2)}
                      OnCopiedElement={<>Copied <CheckIcon className=' inline w-16 h-8' /></>}
                      ToCopyElement={<>Copy <CopyIcon className=' inline w-16 h-8' /></>}
                    />
                  </span>
                  <span className='absolute top-20 right-10 cursor-pointer' onClick={() => {
                    setFormValues((prev) => {
                      const newValues = { ...prev }
                      set(newValues, 'schema_input', schema)
                      return newValues
                    })
                    setShow(false)
                  }}>
                    Copy into form and close modal
                  </span>
                  </>
                : <></>
            }
        </div>
      </div>
  )
}

const SchemaToFormWizard = (): ReactElement => {
  const [showObjectToSchema, setShowObjectToSchema] = useState(false)
  const formConfig: IForm =
        {
          id: 'schema-to-form-wizard',
          label: 'Object to schema wizard',
          wizard_steps: [
            {
              id: 'schema',
              label: 'Schema',
              order: 1,
              fields: [
                {
                  id: 'test',
                  type: 'text',
                  label: 'Test'
                },
                {
                  id: 'schema_input',
                  type: 'custom:schema_input',
                  label: 'Schema',
                  description: 'Paste or edit JSON schema here.',
                  settings: {
                    allowEmpty: true
                  }
                }
              ]
            },
            {
              id: 'form-overrides',
              label: 'Form Overrides',
              order: 2,
              fields: [
                {
                  id: 'form-overrides',
                  type: 'custom:form-overrides',
                  label: 'Form Overrides',
                  description: 'Override form properties and/or re-arrange schema properties into sections and pages.',
                  settings: {
                    allowEmpty: true
                  }
                }
              ]
            },
            {
              id: 'form-output',
              label: 'Form Output',
              description: 'Preview of the form based on schema and overrides',
              order: 3,
              fields: [
                {
                  id: 'form_output',
                  type: 'custom:form-output',
                  label: 'Form Preview',
                  settings: {
                    allowEmpty: true
                  }
                }
              ]
            }

          ]

        }
  const [formValues, setFormValues] = useAtom(formValuesAtom)
  useEffect(() => {
    console.log('change:schema_input', formValues.schema_input)
  }, [formValues.schema_input])
  useEffect(() => {
    console.log('change:object_input', formValues.object_input)
    try {
      const ob = typeof formValues.object_input === 'object'
        ? formValues.object_input
        : JSON.parse(formValues.object_input !== undefined && formValues.object_input !== null && formValues.object_input !== '' ? String(formValues.object_input) : '{}')
      const newSchemaInput = objectToSchema(ob)
      setFormValues((prev) => ({ ...prev, schema_input: newSchemaInput as IValueType }))
    } catch (e) {
      console.error(e)
    }
  }, [formValues.object_input])

  return (
      <>
        <Button
          type='create'
          className='inline-block absolute top-4 right-4'
          onClick={() => {
            setShowObjectToSchema(!showObjectToSchema)
          }}
          >Create schema from object</Button>
          {
            showObjectToSchema
              ? <div className='fixed top-0 left-0 w-full h-full bg-white bg-opacity-80 z-50 pointer-events-none'>
                  <div className='absolute top-10 left-10 right-10 bottom-10 bg-white border-2 border-slate-400 rounded-lg shadow-lg pointer-events-auto'>
                  <Cross2Icon className='absolute top-4 right-4 cursor-pointer' onClick={() => { setShowObjectToSchema(false) }} />
                  <h2 className='p-4 text-xl '>Create schema from object</h2>
                  <ObjectToSchemaWizard setShow={setShowObjectToSchema} />
                  </div>
                </div>
              : <></>
          }
        <FormCreator
            className='p-20'
            form={formConfig}
            formValueState={[formValues, setFormValues]}
            inputOverrides={inputOverrides}
        />
      </>
  )
}

export default SchemaToFormWizard
