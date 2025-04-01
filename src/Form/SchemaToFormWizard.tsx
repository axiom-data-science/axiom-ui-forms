import { FormCreator } from '@/Form'
import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFormValues, type IForm, type IFieldInputProps, type IValueType } from '@/Form/Creator/FormCreatorTypes'
import { atom, useAtom } from 'jotai'
import { type JSONSchema6 } from 'json-schema'
import React, { useEffect } from 'react'
import { useState, type ReactElement } from 'react'
import toJsonSchema from 'to-json-schema'
import oikosLayer from '@/Form/testData/oikosLayer.json'
import { getSchemaPaths, schemaToFormObject } from '@/Form/schemaToFormHelpers'
import JSONInputLoader from '@/Form/Components/Inputs/JSONInputLoader'

const objectToSchema = (ob: unknown): JSONSchema6 => {
  return toJsonSchema(ob) as JSONSchema6
}

const formValuesAtom = atom<IFormValues>({
  object_input: JSON.stringify(oikosLayer, null, 2),
  schema_input: objectToSchema(oikosLayer) as IValueType
})

const inputOverrides = {

  'custom:form-output': (): ReactElement => {
    const [formValues] = useAtom(formValuesAtom)
    const formValueState = useState<IFormValues>({})
    return (
      <>{
        formValues.schema_input !== undefined
          ? <div className='p-5 bg-slate-200'>
              <FormCreator className='m-5 p-5 max-h-[500px] border-2 border-dashed border-slate-400 overflow-y-scroll bg-white' form={schemaToFormObject(formValues.schema_input as JSONSchema6)} formValueState={formValueState} />
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
  }
}

const SchemaToFormWizard = (): ReactElement => {
  const formConfig: IForm =
        {
          id: 'schema-to-form-wizard',
          label: 'Schema to Form Wizard',
          wizard_steps: [
            {
              id: 'input',
              label: 'Data input',
              order: 0,
              fields: [
                {
                  id: 'object_input',
                  type: 'json',
                  label: 'JSON input',
                  description: 'Paste JSON or YAML here that you want to convert to a schema. Skip this step if you already have a schema.'
                }
              ]
            },
            {
              id: 'schema',
              label: 'Schema',
              order: 1,
              fields: [
                {
                  id: 'schema_input',
                  type: 'json',
                  label: 'Schema',
                  description: 'Paste or edit JSON schema here.'
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
                  description: 'Override form properties and/or re-arrange schema properties into sections and pages.'
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
                  label: 'Form Preview'
                }
              ]
            }

          ]

        }
  const [formValues, setFormValues] = useAtom(formValuesAtom)
  useEffect(() => {
    try {
      const ob = typeof formValues.object_input === 'string'
        ? JSON.parse(formValues.object_input)
        : formValues.object_input
      const newSchemaInput = objectToSchema(ob)
      setFormValues((prev) => ({ ...prev, schema_input: newSchemaInput as IValueType }))
    } catch (e) {
      console.error(e)
    }
  }, [formValues.object_input])

  return (
        <FormCreator
            className='p-20'
            form={formConfig}
            formValueState={[formValues, setFormValues]}
            inputOverrides={inputOverrides}
        />
  )
}

export default SchemaToFormWizard
