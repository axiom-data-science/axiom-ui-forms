
import { IField, IForm, IRadioField, ISelectField } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import { Checkbox, Input, SelectInput, Tabs, TextArea } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { atom, useAtom } from ***REMOVED***jotai***REMOVED***
import React, { ReactElement, useEffect, useState } from ***REMOVED***react***REMOVED***
import exampleForm from ***REMOVED***./exampleForm.json***REMOVED***
import { IFormMapping } from ***REMOVED***@/Form/FormMappingTypes***REMOVED***


export interface IFormMangerProps { }

const formAtom = atom<IForm>({ ...exampleForm } as IForm)
const formMappingAtom = atom<IFormMapping>({ fields: {}, $targetSchema: ***REMOVED******REMOVED*** })

const FormManager = (): ReactElement => {

     return (
          <div className=***REMOVED***flex flex-col h-full gap-4 p-20***REMOVED***>
               <div className=***REMOVED***grid grid-cols-2 gap-4 flex-grow***REMOVED***>

                    <Tabs
                         tabs={[
                              {
                                   id: ***REMOVED***form***REMOVED***,
                                   label: ***REMOVED***Form***REMOVED***,
                                   content: <Form />
                              },
                              {
                                   id: ***REMOVED***output***REMOVED***,
                                   label: ***REMOVED***Output***REMOVED***,
                                   content: <FormOutput />
                              }
                         ]}
                    />


                    <div className=***REMOVED***flex flex-col gap-4***REMOVED***>
                         <Tabs
                              tabs={
                                   [
                                        {
                                             id: ***REMOVED***config***REMOVED***,
                                             label: ***REMOVED***Form config***REMOVED***,
                                             content: <FormSchemaInput />
                                        },
                                        {
                                             id: ***REMOVED***mapping***REMOVED***,
                                             label: ***REMOVED***Form mapping***REMOVED***,
                                             content: <FormMappingInput />
                                        }
                                   ]}
                         />

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
     if (form.fields.length > Object.keys(Object.fromEntries(form.fields.map((field: IField) => [field.id, field]))).length) {
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
               <p className=***REMOVED***text-red-500 py-4***REMOVED***>
                    {
                         error !== undefined
                              ? error
                              : <>&nbsp;</>
                    }
               </p>
               <TextArea
                    id=***REMOVED***formManager***REMOVED***
                    testId=***REMOVED***formManager***REMOVED***
                    value={JSON.stringify(form, null, 2)}
                    className=***REMOVED***h-full w-full flex-grow min-h-[600px] bg-slate-100***REMOVED***
                    onChange={(e) => {
                         setStr(e)
                    }}
               />
          </div>
     )
}

const FieldLabelText = (field: IField): ReactElement => {
     const required = field.required ? <span className=***REMOVED***text-red-500***REMOVED***>*</span> : null
     const label = <strong>{field.label} {required}</strong>
     return label
}

const FieldLabel = (field: IField): ReactElement => {
     return <p><FieldLabelText {...field} /></p>
}


const inputMap: Record<string, React.FC<IField>> = {
     text: (field: IField): ReactElement => {
          const [value, setValue] = useState<string | undefined>(undefined)
          return (
               <Input label={<FieldLabel {...field} />} id={field.id} testId={field.id} value={value} onChange={(e) => {
                    setValue(e)
               }} />
          )
     },
     long_text: (field: IField): ReactElement => {
          const [value, setValue] = useState<string | undefined>(undefined)
          return (
               <TextArea label={<FieldLabel {...field} />} id={field.id} testId={field.id} value={value} onChange={(e) => {
                    setValue(e)
               }} />
          )
     },
     boolean: (field: IField): ReactElement => {
          const [value, setValue] = useState<boolean>(false)
          return (
               <Checkbox id={field.id} testId={field.id} label={<strong>{field.label}</strong>} className=***REMOVED***font-bold***REMOVED*** value={value} onChange={(e) => {
                    setValue(e)
               }} />
          )
     },
     select: (field: IField): ReactElement => {
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
     radio: (field: IField): ReactElement => {
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


const Field = (field: IField): ReactElement => {


     const input = inputMap[field.type]

     return (
          <>
               {
                    input !== undefined
                         ? input(field)
                         : <><FieldLabel {...field} /><p>Field type <em>{field.type}</em> not supported</p></>
               }
          </>
     )

}

const getUniqueFormFields = (form: IForm): IField[] => {
     const fieldMap = Object.fromEntries(form.fields.map(f => [f.id, f]))
     return Object.values(fieldMap)
}

const Form = (): ReactElement => {
     const [form] = useAtom(formAtom)
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
                                        <Field {...field} />
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
                                             <span className=***REMOVED***font-bold***REMOVED***>{field.label}</span>
                                             <span className=***REMOVED***text-xs bg-slate-600 text-white p-2 rounded-md***REMOVED***>{field.id}</span>
                                        </div>
                                        <div>
                                             <Input id={`map:${field.id}`} testId={`map:${field.id}`} value={mapping.fields?.[field.id]?.xpath} onChange={(e) => {
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

const FormOutput = (): ReactElement => {
     const [form] = useAtom(formAtom)
     // const [formMapping] = useAtom(formMappingAtom)
     return (
          <pre>
               {JSON.stringify(form, null, 2)}
          </pre>
     )
}



export default FormManager