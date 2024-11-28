import { type IFormField, type IForm, type IRadioField, type ISelectField } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import { Checkbox, Input, SelectInput, Tabs, TextArea } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { useAtom } from ***REMOVED***jotai***REMOVED***
import React, { type ReactElement, useEffect, useState } from ***REMOVED***react***REMOVED***
import set from ***REMOVED***lodash/set***REMOVED***
import formAtom from ***REMOVED***@/state/formAtom***REMOVED***
import formMappingAtom from ***REMOVED***@/state/formMappingAtom***REMOVED***
import { CopyIcon, PlusIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***

const FormManager = (): ReactElement => {
  const sections = [
    {
      id: ***REMOVED***config***REMOVED***,
      label: ***REMOVED***Form config***REMOVED***,
      content: <FormSchemaInput />
    },
    {
      id: ***REMOVED***mapping***REMOVED***,
      label: ***REMOVED***Form mapping***REMOVED***,
      content: <FormMappingInput />
    },
    {
      id: ***REMOVED***output***REMOVED***,
      label: ***REMOVED***Output***REMOVED***,
      content: <FormOutput />
    }
  ]
  const display: ***REMOVED***stack***REMOVED*** | ***REMOVED***tab***REMOVED*** = ***REMOVED***stack***REMOVED***
  return (
          <div className=***REMOVED***flex flex-col h-full gap-4 p-20***REMOVED***>
               <div className=***REMOVED***grid grid-cols-2 gap-8 flex-grow***REMOVED***>

               <Form />

                    <div className=***REMOVED***flex flex-col gap-4***REMOVED***>
                      {
                        display === ***REMOVED***stack***REMOVED***
                          ? <div className=***REMOVED***flex flex-col gap-8 justify-between***REMOVED***>{sections.map(section => {
                            const { content } = section
                            return <div key={section.id}><p className=***REMOVED***text-lg font-bold pb-2***REMOVED***>{section.label}</p><div className=***REMOVED***max-h-[300px] overflow-auto***REMOVED***>{content}</div></div>
                          })}</div>
                          : <Tabs
                              tabs={sections}
                         />
                      }

                    </div>
               </div>
          </div>
  )
}

const validateForm = (form: IForm): string | undefined => {
  if (form.label === undefined) {
    return (***REMOVED***Label is required***REMOVED***)
  }
  if (form.fields === undefined) {
    return (***REMOVED***At least one field is required***REMOVED***)
  }
  if (form.fields.length > Object.keys(Object.fromEntries(form.fields.map((field: IFormField) => [field.id, field]))).length) {
    return (***REMOVED***Field IDs must be unique***REMOVED***)
  }
  return undefined
}

const FormSchemaInput = (): ReactElement => {
  const [form, setForm] = useAtom(formAtom)
  const [error, setError] = useState<string | undefined>(validateForm(form))
  const [str, setStr] = useState<string | undefined>(undefined)
  useEffect(() => {
    if (str !== ***REMOVED******REMOVED*** && str !== undefined) {
      try {
        const ob = JSON.parse(str)
        const newError = validateForm(ob)
        setError(newError)
        if (newError === undefined) {
          setForm(ob)
        }
      } catch {
        setError(***REMOVED***Invalid JSON***REMOVED***)
      }
    }
  }, [str])
  return (
          <div className=***REMOVED***h-full flex flex-col***REMOVED***>
               { error !== undefined
                 ? <p className=***REMOVED***text-red-500 py-4***REMOVED***>
                    {error}
                </p>
                 : ***REMOVED******REMOVED***
               }
               <TextArea
                    id=***REMOVED***formManager***REMOVED***
                    testId=***REMOVED***formManager***REMOVED***
                    value={JSON.stringify(form, null, 2)}
                    className=***REMOVED***h-full mt-0 w-full flex-grow shadow-inner-xl bg-slate-50***REMOVED***
                    onChange={(e) => {
                      setStr(e)
                    }}
               />
          </div>
  )
}

const FieldLabelText = (field: IFormField): ReactElement => {
  const required = field.required ? <span className=***REMOVED***text-red-500***REMOVED***>*</span> : null
  const label = <strong>{field.label} {required}</strong>
  return label
}

const FieldLabel = (field: IFormField): ReactElement => {
  return <p><FieldLabelText {...field} /></p>
}

const inputMap: Record<string, React.FC<{ field: IFormField, onChange: () => void }>> = {
  text: ({ field, onChange }): ReactElement => {
    return (
               <Input label={<FieldLabel {...field} />} id={field.id} testId={field.id} value={field.value !== undefined ? String(field.value) : undefined} onChange={(e) => {
                 field.value = e
                 if (onChange !== undefined) {
                   onChange()
                 }
               }} />
    )
  },
  long_text: ({ field, onChange }): ReactElement => {
    return (
               <TextArea label={<FieldLabel {...field} />} id={field.id} testId={field.id} value={field.value !== undefined ? String(field.value) : undefined} onChange={(e) => {
                 onChange()
               }} />
    )
  },
  boolean: ({ field, onChange }): ReactElement => {
    const [value, setValue] = useState<boolean>(false)
    return (
               <Checkbox id={field.id} testId={field.id} label={<strong>{field.label}</strong>} className=***REMOVED***font-bold***REMOVED*** value={value} onChange={(e) => {
                 setValue(e)
               }} />
    )
  },
  select: ({ field, onChange }): ReactElement => {
    const [value, setValue] = useState<string | undefined>(undefined)
    const selectField = field as ISelectField
    return (
               <SelectInput
                    label={<FieldLabel {...selectField} />}
                    id={selectField.id}
                    testId={selectField.id}
                    value={value}
                    onChange={(e) => {
                      setValue(e?.value)
                    }}
                    options={selectField.options}
               />
    )
  },
  radio: ({ field, onChange }): ReactElement => {
    const [value, setValue] = useState<string | undefined>(undefined)
    const radioField = field as IRadioField
    return (
               <>
                    <FieldLabel {...radioField} />
                    <div className={`${radioField?.layout === ***REMOVED***vertical***REMOVED*** ? ***REMOVED***flex flex-col gap-2***REMOVED*** : ***REMOVED***flex flex-row gap-4***REMOVED***}`}>
                         {
                              radioField.options.map((option) => {
                                return <label key={option.value}>
                                        <input
                                             type=***REMOVED***radio***REMOVED***
                                             name={radioField.id}
                                             value={option.value}
                                             onChange={(e) => {
                                               setValue(e.target.value)
                                             }}
                                             checked={value === option.value}
                                        /> {option.label}</label>
                              })
                         }
                    </div>
               </>
    )
  }
}

const Field = ({ field, onChange }: { field: IFormField, onChange: () => void }): ReactElement => {
  const input = inputMap[field.type]

  return (
          <>
               {
                    input !== undefined
                      ? input({ field, onChange })
                      : <><FieldLabel {...field} /><p>Field type <em>{field.type}</em> not supported</p></>
               }
          </>
  )
}

const getUniqueFormFields = (form: IForm): IFormField[] => {
  const fieldMap = Object.fromEntries(form.fields.map(f => [f.id, f]))
  return Object.values(fieldMap)
}

const Form = (): ReactElement => {
  const [form, setForm] = useAtom(formAtom)
  const uniqueFields = getUniqueFormFields(form)
  return (
          <div>
               <h2 className=***REMOVED***text-2xl pb-4 font-bold***REMOVED***>{form.label}</h2>
               {
                    form.description !== undefined
                      ? <p className=***REMOVED***pb-4***REMOVED***>{form.description}</p>
                      : null
               }
               <div className=***REMOVED***flex flex-col gap-4***REMOVED***>
                    {
                         uniqueFields.map((field, index) => {
                           return (
                                   <div key={index}>
                                        {
                                          field.multiple === true
                                            ? <>
                                                <Field field={field} onChange={() => {
                                                  setForm({ ...form })
                                                }} /> <PlusIcon className=***REMOVED***w-6 h-6 text-slate-400***REMOVED*** onClick={() => {

                                                }} />
                                            </>
                                            : <Field field={field} onChange={() => {
                                              setForm({ ...form })
                                            }} />
                                      }
                                   </div>
                           )
                         })
                    }
               </div>

          </div>
  )
}

const FormMappingInput = (): ReactElement => {
  const [form] = useAtom(formAtom)
  const [mapping, setMappings] = useAtom(formMappingAtom)
  const uniqueFields = getUniqueFormFields(form)
  return (
          <>
               <div className=***REMOVED***flex flex-col gap-4***REMOVED***>
                    {
                         uniqueFields.map(field => {
                           return (
                                   <div key={field.id} className=***REMOVED***flex flex-row gap-2***REMOVED***>
                                        <div>
                                             <Input placeholder=***REMOVED***Output path***REMOVED*** label={<span className=***REMOVED***pb-2***REMOVED***>
                                                  <span className=***REMOVED***text-xs bg-slate-100  p-1 float-right text-rose-700***REMOVED***>{field.id}</span>
                                                  {field.label}
                                             </span>} id={`map:${field.id}`} testId={`map:${field.id}`} value={mapping.fields?.[field.id]?.xpath} onChange={(e) => {
                                               if (e !== undefined && e !== ***REMOVED******REMOVED***) {
                                                 setMappings({
                                                   ...mapping,
                                                   fields: {
                                                     ...mapping.fields,
                                                     [field.id]: {
                                                       ...mapping.fields[field.id],
                                                       xpath: e

                                                     }
                                                   }

                                                 })
                                               }
                                             }}
                                             />
                                        </div>

                                   </div>
                           )
                         })
                    }
               </div>
          </>
  )
}

interface IOutputRecord {
  [key: string]: IOutputRecord | string | undefined | number
}

const FormOutput = (): ReactElement => {
  const [form] = useAtom(formAtom)
  const [formMapping] = useAtom(formMappingAtom)
  const [output, setOutput] = useState<IOutputRecord | undefined>(undefined)

  useEffect(() => {
    let newOutput: IOutputRecord = {}
    form.fields.forEach(field => {
      const path = formMapping.fields[field.id]?.xpath ?? field.id
      newOutput = set(newOutput, path, field.value ?? null)
    })

    setOutput(newOutput)
  }, [form, formMapping])
  return (<div className=***REMOVED***relative***REMOVED*** onClick={() => {
    navigator.clipboard.writeText(JSON.stringify(output, null, 2))
      .then(() => {
        console.log(***REMOVED***Copied!***REMOVED***)
      })
      .catch(e => {
        console.log(***REMOVED***Error!***REMOVED***)
      })
  }}>
          <CopyIcon className=***REMOVED***absolute top-4 right-4 w-10 h-10 text-slate-400 pointer-events-none***REMOVED*** />
          <pre className=***REMOVED***p-10 bg-slate-200 hover:bg-slate-300 text-slate-600 select-none cursor-pointer***REMOVED***>
               {JSON.stringify(output, null, 2)}
          </pre>
          </div>
  )
}

export default FormManager
