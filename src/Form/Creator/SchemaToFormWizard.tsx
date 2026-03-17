import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFormValues, type IForm, type IFieldInputProps, type IValueType, type IFormFieldOverride, type IFormOverride } from '@/Form/Creator/FormCreatorTypes'
import { atom, useAtom } from 'jotai'
import { type JSONSchema6 } from 'json-schema'
import React, { useContext, useEffect } from 'react'
import { useState, type ReactElement } from 'react'
import { getSchemaPathDescriptors } from '@/utils/schemaToFormHelpers'
import JSONInputLoader from '@/Form/Components/Inputs/JSONInputLoader'
import { CopyButton } from '@/Form/Manage/CopyableJSONOutput'
import { CheckIcon, CopyIcon } from '@radix-ui/react-icons'
import FormCreator, { SchemaFormCreator } from '@/Form/Creator/FormCreator'
import { Table } from '@axdspub/axiom-ui-utilities'
import { FormContext } from '@/Form/Creator/FormContextProvider'
import { copyAndRemovePathFromFields } from '@/utils/manipulators'
import { objectToSchema, ObjectToSchemaButton } from '@/Form/Creator/ObjectToSchema'

const formValuesAtom = atom<IFormValues>({
  // object_input: oikosLayer,
  // schema_input: objectToSchema(oikosLayer) as IValueType
})

const FormFooter = (): ReactElement => {
  const { form } = useContext(FormContext)
  return (
    <>
      <CopyButton
        string={JSON.stringify(form !== undefined
          ? copyAndRemovePathFromFields(form)
          : {}, null, 2)}
        OnCopiedElement={<><CheckIcon className=' inline' /> Copied to clipboard</>}
        ToCopyElement={<><CopyIcon className=' inline' /> Copy form config</>}

      />
    </>

  )
}

const SchemaPathList = ({ schema }: { schema: JSONSchema6 }): ReactElement => {
  const schemaPathDescriptors = getSchemaPathDescriptors(schema)
  return (
    <Table
      data={schemaPathDescriptors}
      columns={[
        { id: 'path', label: 'Path', accessor: (row) => <strong>{row.path}</strong>, cellClassName: 'text-xs p-2' },
        { id: 'type', label: 'Type', cellClassName: 'text-xs p-2' },
        { id: 'required', label: 'Required', accessor: (row) => row.required ? 'true' : 'false', cellClassName: 'text-xs p-2' }
      ]}
    />
  )
}

const inputOverrides = {

  'custom:form-output': (): ReactElement => {
    const [formValues] = useAtom(formValuesAtom)
    const formValueState = useState<IFormValues>({})
    return (
      <>{

        formValues.schema_input !== undefined
          ? <div className='p-5 bg-slate-200'>

            <SchemaFormCreator
              className='m-5 p-5 max-h-[500px] border-2 border-dashed border-slate-400 overflow-y-scroll bg-white'
              schema={formValues.schema_input as JSONSchema6}
              formValueState={formValueState}
              formFieldOverrides={formValues['field-overrides'] !== undefined ? JSON.parse(`[${String(formValues['field-overrides'])}]`) as unknown as IFormFieldOverride[][] : undefined}
              formOverrides={formValues['form-overrides'] as unknown as IFormOverride[]}
              Footer={<FormFooter />}

            />
          </div>
          : <p>Waiting on schema input</p>
      }</>
    )
  },
  'custom:field-overrides': ({ field, value, onChange }: IFieldInputProps): ReactElement => {
    const [formValues] = useAtom(formValuesAtom)
    const schemaInput = (formValues.schema_input ?? {}) as JSONSchema6

    return (
      <div className='flex flex-col flex-grow h-full'>
        <FieldLabel field={field} />
        <div className='flex flex-row gap-10 flex-grow h-full'>
          <div className='w-[350px] overflow-y-auto flex-none h-full bg-slate-200 text-xs'>
            <SchemaPathList schema={schemaInput} />
          </div>

          <div className='flex-grow'>
            <JSONInputLoader
              field={{ ...field, label: null, description: null }}
              onChange={(e) => {
                // do some validation here
                onChange(JSON.stringify(e, null, 2))
              }}
              value={value ?? '[]'}
            />
          </div>
        </div>
      </div>
    )
  },
  'custom:form-overrides': ({ field, value, onChange }: IFieldInputProps): ReactElement => {
    const [formValues] = useAtom(formValuesAtom)
    const schemaInput = (formValues.schema_input ?? {}) as JSONSchema6
    return (
      <div className='flex flex-col flex-grow h-full'>
        <FieldLabel field={field} />
        <div className='flex flex-row gap-10 flex-grow h-full'>
          <div className='w-[350px] flex-none overflow-y-auto bg-slate-200 text-xs'>
            <SchemaPathList schema={schemaInput} />
          </div>
          <div className='flex-grow'>
            <JSONInputLoader
              field={{ ...field, label: null, description: null }}
              onChange={(e) => {
                onChange(e)
              }}
              value={value}
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

const SchemaToFormWizard = (): ReactElement => {
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
        id: 'field-overrides',
        label: 'Field Overrides',
        order: 2,
        fields: [
          {
            id: 'field-overrides',
            type: 'custom:field-overrides',
            label: 'Field Overrides',
            description: 'Override field properties and types.',
            settings: {
              allowEmpty: true
            }
          }
        ]
      },
      {
        id: 'form-overrides',
        label: 'Form Overrides',
        order: 3,
        fields: [
          {
            id: 'form-overrides',
            type: 'custom:form-overrides',
            label: 'Form Overrides',
            description: 'Override form layout as well as individual properties and types.',
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
  }, [formValues.schema_input])
  useEffect(() => {
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
      <ObjectToSchemaButton onUpdate={(newSchema) => {
        setFormValues((prev) => ({ ...prev, schema_input: newSchema as IValueType }))
      }} />
      <FormCreator
        className='p-20 h-full flex flex-col'
        form={formConfig}
        formValueState={[formValues, setFormValues]}
        inputOverrides={inputOverrides}
      />
    </>
  )
}

export default SchemaToFormWizard
