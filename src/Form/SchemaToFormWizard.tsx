import { FormCreator } from ***REMOVED***@/Form***REMOVED***
import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { type IFormValues, type IForm, type IFieldInputProps, type IValueType } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { atom, useAtom } from ***REMOVED***jotai***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import React, { useEffect } from ***REMOVED***react***REMOVED***
import { useState, type ReactElement } from ***REMOVED***react***REMOVED***
import toJsonSchema from ***REMOVED***to-json-schema***REMOVED***
import oikosLayer from ***REMOVED***@/Form/testData/oikosLayer.json***REMOVED***
import { getSchemaPaths, schemaToFormObject } from ***REMOVED***@/Form/schemaToFormHelpers***REMOVED***
import JSONInputLoader from ***REMOVED***@/Form/Components/Inputs/JSONInputLoader***REMOVED***

const objectToSchema = (ob: unknown): JSONSchema6 => {
  return toJsonSchema(ob) as JSONSchema6
}

const formValuesAtom = atom<IFormValues>({
  object_input: JSON.stringify(oikosLayer, null, 2),
  schema_input: objectToSchema(oikosLayer) as IValueType
})

const inputOverrides = {

  ***REMOVED***custom:form-output***REMOVED***: (): ReactElement => {
    const [formValues] = useAtom(formValuesAtom)
    const formValueState = useState<IFormValues>({})
    return (
      <>{
        formValues.schema_input !== undefined
          ? <div className=***REMOVED***p-5 bg-slate-200***REMOVED***>
              <FormCreator className=***REMOVED***m-5 p-5 max-h-[500px] border-2 border-dashed border-slate-400 overflow-y-scroll bg-white***REMOVED*** form={schemaToFormObject(formValues.schema_input as JSONSchema6)} formValueState={formValueState} />
              </div>
          : <p>Waiting on schema input</p>
      }</>
    )
  },
  ***REMOVED***custom:form-overrides***REMOVED***: ({ field, value, onChange }: IFieldInputProps): ReactElement => {
    const [formValues] = useAtom(formValuesAtom)
    const schemaInput = (formValues.schema_input ?? {}) as JSONSchema6
    const schemaPaths = getSchemaPaths(schemaInput)
    const [val, setVal] = useState<string | undefined>(typeof value === ***REMOVED***string***REMOVED*** ? value : undefined)
    return (
            <div>
                <FieldLabel {...field} />
                <div className=***REMOVED***flex flex-row gap-10***REMOVED***>
                  <div className=***REMOVED***w-[300px] h-[600px] flex-none overflow-y-scroll bg-slate-200 p-4 whitespace-pre text-xs***REMOVED***>
                    {
                      schemaPaths.map(path => {
                        return <p key={path}>{path}</p>
                      })
                    }
                  </div>
                  <div className=***REMOVED***flex-grow***REMOVED***>
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
          id: ***REMOVED***schema-to-form-wizard***REMOVED***,
          label: ***REMOVED***Schema to Form Wizard***REMOVED***,
          wizard_steps: [
            {
              id: ***REMOVED***input***REMOVED***,
              label: ***REMOVED***Data input***REMOVED***,
              order: 0,
              fields: [
                {
                  id: ***REMOVED***object_input***REMOVED***,
                  type: ***REMOVED***json***REMOVED***,
                  label: ***REMOVED***JSON input***REMOVED***,
                  description: ***REMOVED***Paste JSON or YAML here that you want to convert to a schema. Skip this step if you already have a schema.***REMOVED***
                }
              ]
            },
            {
              id: ***REMOVED***schema***REMOVED***,
              label: ***REMOVED***Schema***REMOVED***,
              order: 1,
              fields: [
                {
                  id: ***REMOVED***schema_input***REMOVED***,
                  type: ***REMOVED***json***REMOVED***,
                  label: ***REMOVED***Schema***REMOVED***,
                  description: ***REMOVED***Paste or edit JSON schema here.***REMOVED***
                }
              ]
            },
            {
              id: ***REMOVED***form-overrides***REMOVED***,
              label: ***REMOVED***Form Overrides***REMOVED***,
              order: 2,
              fields: [
                {
                  id: ***REMOVED***form-overrides***REMOVED***,
                  type: ***REMOVED***custom:form-overrides***REMOVED***,
                  label: ***REMOVED***Form Overrides***REMOVED***,
                  description: ***REMOVED***Override form properties and/or re-arrange schema properties into sections and pages.***REMOVED***
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
                  label: ***REMOVED***Form Preview***REMOVED***
                }
              ]
            }

          ]

        }
  const [formValues, setFormValues] = useAtom(formValuesAtom)
  useEffect(() => {
    try {
      const ob = typeof formValues.object_input === ***REMOVED***string***REMOVED***
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
            className=***REMOVED***p-20***REMOVED***
            form={formConfig}
            formValueState={[formValues, setFormValues]}
            inputOverrides={inputOverrides}
        />
  )
}

export default SchemaToFormWizard
