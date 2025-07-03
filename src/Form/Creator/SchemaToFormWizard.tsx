import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { type IFormValues, type IForm, type IFieldInputProps, type IValueType, type IFormFieldOverride, type IFormOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { atom, useAtom } from ***REMOVED***jotai***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import React, { useContext, useEffect } from ***REMOVED***react***REMOVED***
import { useState, type ReactElement } from ***REMOVED***react***REMOVED***
import { getSchemaPathDescriptors } from ***REMOVED***@/utils/schemaToFormHelpers***REMOVED***
import JSONInputLoader from ***REMOVED***@/Form/Components/Inputs/JSONInputLoader***REMOVED***
import { CopyButton } from ***REMOVED***@/Form/Manage/CopyableJSONOutput***REMOVED***
import { CheckIcon, CopyIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import FormCreator, { SchemaFormCreator } from ***REMOVED***@/Form/Creator/FormCreator***REMOVED***
import { Table } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { FormContext } from ***REMOVED***@/Form/Creator/FormContextProvider***REMOVED***
import { copyAndRemovePathFromFields } from ***REMOVED***@/utils/manipulators***REMOVED***
import { objectToSchema, ObjectToSchemaButton } from ***REMOVED***@/Form/Creator/ObjectToSchema***REMOVED***

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
          OnCopiedElement={<><CheckIcon className=***REMOVED*** inline***REMOVED*** /> Copied to clipboard</>}
          ToCopyElement={<><CopyIcon className=***REMOVED*** inline***REMOVED*** /> Copy form config</>}

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
          { id: ***REMOVED***path***REMOVED***, label: ***REMOVED***Path***REMOVED***, accessor: (row) => <strong>{row.path}</strong>, cellClassName: ***REMOVED***text-xs p-2***REMOVED*** },
          { id: ***REMOVED***type***REMOVED***, label: ***REMOVED***Type***REMOVED***, cellClassName: ***REMOVED***text-xs p-2***REMOVED*** },
          { id: ***REMOVED***required***REMOVED***, label: ***REMOVED***Required***REMOVED***, accessor: (row) => row.required ? ***REMOVED***true***REMOVED*** : ***REMOVED***false***REMOVED***, cellClassName: ***REMOVED***text-xs p-2***REMOVED*** }
        ]}
      />
  )
}

const inputOverrides = {

  ***REMOVED***custom:form-output***REMOVED***: (): ReactElement => {
    const [formValues] = useAtom(formValuesAtom)
    const formValueState = useState<IFormValues>({})
    return (
      <>{

        formValues.schema_input !== undefined
          ? <div className=***REMOVED***p-5 bg-slate-200***REMOVED***>

              <SchemaFormCreator
                className=***REMOVED***m-5 p-5 max-h-[500px] border-2 border-dashed border-slate-400 overflow-y-scroll bg-white***REMOVED***
                schema={formValues.schema_input as JSONSchema6}
                formValueState={formValueState}
                formFieldOverrides={formValues[***REMOVED***field-overrides***REMOVED***] !== undefined ? JSON.parse(`[${String(formValues[***REMOVED***field-overrides***REMOVED***])}]`) as unknown as IFormFieldOverride[][] : undefined}
                formOverrides={formValues[***REMOVED***form-overrides***REMOVED***] as unknown as IFormOverride[]}
                footer={<FormFooter />}

                />
              </div>
          : <p>Waiting on schema input</p>
      }</>
    )
  },
  ***REMOVED***custom:field-overrides***REMOVED***: ({ field, value, onChange }: IFieldInputProps): ReactElement => {
    const [formValues] = useAtom(formValuesAtom)
    const schemaInput = (formValues.schema_input ?? {}) as JSONSchema6

    return (
            <div className=***REMOVED***flex flex-col flex-grow h-full***REMOVED***>
                <FieldLabel field={field} />
                <div className=***REMOVED***flex flex-row gap-10 flex-grow h-full***REMOVED***>
                  <div className=***REMOVED***w-[350px] overflow-y-auto flex-none h-full bg-slate-200 text-xs***REMOVED***>
                    <SchemaPathList schema={schemaInput} />
                  </div>

                  <div className=***REMOVED***flex-grow***REMOVED***>
                    <JSONInputLoader
                      field={{ ...field, label: null, description: null }}
                      onChange={(e) => {
                        // do some validation here
                        onChange(JSON.stringify(e, null, 2))
                      }}
                      value={value ?? ***REMOVED***[]***REMOVED***}
                    />
                  </div>
                </div>
            </div>
    )
  },
  ***REMOVED***custom:form-overrides***REMOVED***: ({ field, value, onChange }: IFieldInputProps): ReactElement => {
    const [formValues] = useAtom(formValuesAtom)
    const schemaInput = (formValues.schema_input ?? {}) as JSONSchema6
    return (
            <div className=***REMOVED***flex flex-col flex-grow h-full***REMOVED***>
                <FieldLabel field={field} />
                <div className=***REMOVED***flex flex-row gap-10 flex-grow h-full***REMOVED***>
                  <div className=***REMOVED***w-[350px] flex-none overflow-y-auto bg-slate-200 text-xs***REMOVED***>
                    <SchemaPathList schema={schemaInput} />
                  </div>
                  <div className=***REMOVED***flex-grow***REMOVED***>
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
  ***REMOVED***custom:schema_input***REMOVED***: ({ field, value, onChange }: IFieldInputProps): ReactElement => {
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
          id: ***REMOVED***schema-to-form-wizard***REMOVED***,
          label: ***REMOVED***Object to schema wizard***REMOVED***,
          wizard_steps: [
            {
              id: ***REMOVED***schema***REMOVED***,
              label: ***REMOVED***Schema***REMOVED***,
              order: 1,
              fields: [
                {
                  id: ***REMOVED***schema_input***REMOVED***,
                  type: ***REMOVED***custom:schema_input***REMOVED***,
                  label: ***REMOVED***Schema***REMOVED***,
                  description: ***REMOVED***Paste or edit JSON schema here.***REMOVED***,
                  settings: {
                    allowEmpty: true
                  }
                }
              ]
            },
            {
              id: ***REMOVED***field-overrides***REMOVED***,
              label: ***REMOVED***Field Overrides***REMOVED***,
              order: 2,
              fields: [
                {
                  id: ***REMOVED***field-overrides***REMOVED***,
                  type: ***REMOVED***custom:field-overrides***REMOVED***,
                  label: ***REMOVED***Field Overrides***REMOVED***,
                  description: ***REMOVED***Override field properties and types.***REMOVED***,
                  settings: {
                    allowEmpty: true
                  }
                }
              ]
            },
            {
              id: ***REMOVED***form-overrides***REMOVED***,
              label: ***REMOVED***Form Overrides***REMOVED***,
              order: 3,
              fields: [
                {
                  id: ***REMOVED***form-overrides***REMOVED***,
                  type: ***REMOVED***custom:form-overrides***REMOVED***,
                  label: ***REMOVED***Form Overrides***REMOVED***,
                  description: ***REMOVED***Override form layout as well as individual properties and types.***REMOVED***,
                  settings: {
                    allowEmpty: true
                  }
                }
              ]
            },
            {
              id: ***REMOVED***form-output***REMOVED***,
              label: ***REMOVED***Form Output***REMOVED***,
              description: ***REMOVED***Preview of the form based on schema and overrides***REMOVED***,
              order: 3,
              fields: [
                {
                  id: ***REMOVED***form_output***REMOVED***,
                  type: ***REMOVED***custom:form-output***REMOVED***,
                  label: ***REMOVED***Form Preview***REMOVED***,
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
    console.log(***REMOVED***change:schema_input***REMOVED***, formValues.schema_input)
  }, [formValues.schema_input])
  useEffect(() => {
    console.log(***REMOVED***change:object_input***REMOVED***, formValues.object_input)
    try {
      const ob = typeof formValues.object_input === ***REMOVED***object***REMOVED***
        ? formValues.object_input
        : JSON.parse(formValues.object_input !== undefined && formValues.object_input !== null && formValues.object_input !== ***REMOVED******REMOVED*** ? String(formValues.object_input) : ***REMOVED***{}***REMOVED***)
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
            className=***REMOVED***p-20 h-full flex flex-col***REMOVED***
            form={formConfig}
            formValueState={[formValues, setFormValues]}
            inputOverrides={inputOverrides}
        />
      </>
  )
}

export default SchemaToFormWizard
