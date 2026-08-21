import { CopyButton } from ***REMOVED***@/Form/Manage/CopyableJSONOutput***REMOVED***
import { Tabs, TextArea } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import React, { useMemo, useState, type ReactElement } from ***REMOVED***react***REMOVED***

import testSchema from ***REMOVED***@/Form/testData/schemas/pttSchemaModified.json***REMOVED***
import { type IForm, type IFormValues } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import FormCreator from ***REMOVED***@/Form/Creator/FormCreator***REMOVED***
import { ExclamationTriangleIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import { getSchemaPaths, schemaToFormObject, validateAgainstSchema, validateSchema } from ***REMOVED***@/utils/schemaToFormHelpers***REMOVED***
import toJsonSchema from ***REMOVED***to-json-schema***REMOVED***
import { JSONInput } from ***REMOVED***@/Form/Components/Inputs***REMOVED***

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
    const ob = JSON.parse(str === undefined || str === ***REMOVED******REMOVED*** ? ***REMOVED***{}***REMOVED*** : str)
    const validationResponse = validateSchema(ob)

    if (validationResponse.schema !== undefined) {
      schema = validationResponse.schema
      form = schemaToFormObject(validationResponse.schema)
    }
  } catch (e) {
    console.error(e)
    setError(***REMOVED***Invalid JSON***REMOVED***)
  }

  const formOutputErrors = useMemo(() => {
    return validateAgainstSchema(schema ?? {}, formValues)
  }, [schema, formValues])
  // const formOutputErrors = validateAgainstSchema(schema ?? {}, formValues)
  const schemaObjectIsValid = objectInput !== undefined && isValidJson(objectInput)
  const schemaObjectError = objectInput !== undefined && !schemaObjectIsValid ? ***REMOVED***Invalid JSON***REMOVED*** : undefined
  const schemaFromObject = schemaObjectIsValid ? objectToSchema(JSON.parse(objectInput)) : undefined
  return (
    <div className=***REMOVED***flex flex-col h-full gap-4 p-20***REMOVED***>
        <h1 className=***REMOVED***text-2xl***REMOVED***>Schema to Form</h1>
        <p>
            This page will allow you to convert a JSON schema to a form UI schema
        </p>
       <div className=***REMOVED***grid grid-cols-2 gap-8 grow***REMOVED***>
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
                              <div>{formOutputErrors !== undefined
                                ? <>Errors: <ul className=***REMOVED***text-rose-800 text-xs list-disc p-4***REMOVED***>{
                                  formOutputErrors.map((e) => {
                                    return <li key={e.field ?? e.message}>{e.message}</li>
                                  })
                                  }</ul></>
                                : ***REMOVED***Form output is valid***REMOVED***}</div>
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
            <div className=***REMOVED***h-full flex flex-col gap-10 bg-slate-100 p-8 overflow-auto***REMOVED***>
                <Tabs
                  tabs={[
                    {
                      label: ***REMOVED***Schema***REMOVED***,
                      id: ***REMOVED***schema***REMOVED***,
                      content: <div className=***REMOVED***flex flex-col gap-4***REMOVED***>
                      <div className=***REMOVED***flex flex-col gap-2***REMOVED***>

                          <p className={`${error !== undefined ? ***REMOVED***text-rose-800***REMOVED*** : ***REMOVED***text-green-800***REMOVED***}`}>
                              {error ?? ***REMOVED***No errors***REMOVED***}
                          </p>

                        <div className=***REMOVED***relative***REMOVED***>
                            {/* <CopyButton string={JSON.stringify(schema, null, 2)} className=***REMOVED***absolute right-10 top-10 pointer-events-auto***REMOVED*** /> */}
                            <JSONInput
                              value={str}
                              onChange={(e) => {
                                setStr(e !== undefined ? String(e) : undefined)
                              } }
                              field={{
                                id: ***REMOVED***schemaInput***REMOVED***,
                                label: ***REMOVED***Schema Input***REMOVED***,
                                type: ***REMOVED***json***REMOVED***
                              }}
                              />

                        </div>
                      </div>
                      <div className=***REMOVED***flex flex-col gap-2***REMOVED***>

                                  <p className=***REMOVED***font-bold***REMOVED***>Converted Form</p>
                                  {
                                    form !== undefined
                                      ? <div className=***REMOVED***relative***REMOVED***>
                                      <CopyButton string={JSON.stringify(form ?? ***REMOVED******REMOVED***, null, 2)}
                                        wrapperClassName=***REMOVED***absolute right-5 bottom-5 pointer-events-auto***REMOVED***
                                        />
                                      <pre className=***REMOVED***p-5 text-blue-200 text-xs max-h-100 shadow-inner-x bg-blue-900 font-mono whitespace-pre-wrap overflow-auto***REMOVED***>
                                        {JSON.stringify(form, null, 2)}
                                      </pre>
                                      </div>

                                      : ***REMOVED***Waiting on valid schema***REMOVED***
                                  }

                      </div>
                      <div className=***REMOVED***flex flex-col gap-2***REMOVED***>
                        <JSONInput
                          value={objectInput}
                          onChange={(e) => {
                            setObjectInput(e !== undefined ? String(e) : undefined)
                          } }
                          field={{
                            id: ***REMOVED***objectInput***REMOVED***,
                            label: ***REMOVED***Paste JSON to convert to schema***REMOVED***,
                            type: ***REMOVED***json***REMOVED***
                          }}
                          className=***REMOVED***h-full mt-0 w-full grow max-h-100 shadow-inner-x bg-blue-900 text-white***REMOVED***
                          />

                          {
                            schemaObjectError !== undefined
                              ? <p className=***REMOVED***text-rose-800***REMOVED***>{schemaObjectError}</p>
                              : ***REMOVED******REMOVED***
                          }
                        <div className=***REMOVED***relative***REMOVED***>
                                  {
                                    objectInput !== undefined && isValidJson(objectInput)
                                      ? <>
                                      <CopyButton string={schemaFromObject !== undefined ? JSON.stringify(schemaFromObject, null, 2) : ***REMOVED******REMOVED***} className=***REMOVED***absolute right-10 top-10 pointer-events-auto***REMOVED*** />
                                      <TextArea
                                        id=***REMOVED***convertedObject***REMOVED***
                                        testId=***REMOVED***convertedObject***REMOVED***
                                        value={schemaFromObject !== undefined ? JSON.stringify(schemaFromObject, null, 2) : ***REMOVED******REMOVED***}
                                        className=***REMOVED***h-full mt-0 w-full grow min-h-150 shadow-inner-x bg-green-900 text-white***REMOVED***
                                        />

                                      </>
                                      : ***REMOVED***Waiting on valid object input***REMOVED***
                                  }

                                </div>
                      </div>
                      </div>
                    },
                    {
                      label: ***REMOVED***Form config overrides***REMOVED***,
                      id: ***REMOVED***overrides***REMOVED***,
                      content: <div className=***REMOVED***flex flex-row gap-4***REMOVED***>
                          <div className=***REMOVED******REMOVED***>
                            {
                              schema !== undefined
                                ? getSchemaPaths(schema).map((p) => {
                                  return <p key={p}>{p}</p>
                                })

                                : ***REMOVED***Waiting on valid schema***REMOVED***
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
