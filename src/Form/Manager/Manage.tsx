
import { IField, IForm, IRadioField, ISelectField } from '@/Form/FormCreatorTypes'
import { Checkbox, Input, SelectInput, Tabs, TextArea } from '@axdspub/axiom-ui-utilities'
import { atom, useAtom } from 'jotai'
import React, { ReactElement, useEffect, useState } from 'react'
import exampleForm from './exampleForm.json'
import { IFormMapping } from '@/Form/FormMappingTypes'


export interface IFormMangerProps { }

const formAtom = atom<IForm>({ ...exampleForm } as IForm)
const formMappingAtom = atom<IFormMapping>({ fields: {}, $targetSchema: '' })

const FormManager = (): ReactElement => {

     return (
          <div className='flex flex-col h-full gap-4 p-20'>
               <div className='grid grid-cols-2 gap-4 flex-grow'>

                    <Tabs
                         tabs={[
                              {
                                   id: 'form',
                                   label: 'Form',
                                   content: <Form />
                              },
                              {
                                   id: 'output',
                                   label: 'Output',
                                   content: <FormOutput />
                              }
                         ]}
                    />


                    <div className='flex flex-col gap-4'>
                         <Tabs
                              tabs={
                                   [
                                        {
                                             id: 'config',
                                             label: 'Form config',
                                             content: <FormSchemaInput />
                                        },
                                        {
                                             id: 'mapping',
                                             label: 'Form mapping',
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
          return ('Label is required')

     }
     if (form.fields === undefined) {
          return ('At least one field is required')

     }
     if (form.fields.length > Object.keys(Object.fromEntries(form.fields.map((field: IField) => [field.id, field]))).length) {
          return ('Field IDs must be unique')
     }
     return undefined

}


const FormSchemaInput = (): ReactElement => {
     const [form, setForm] = useAtom(formAtom)
     const [error, setError] = useState<string | undefined>(validateForm(form))
     const [str, setStr] = useState<string | undefined>(undefined)
     useEffect(() => {
          if (str !== '' && str !== undefined) {
               try {
                    const ob = JSON.parse(str)
                    const newError = validateForm(ob)
                    setError(newError)
                    if (newError === undefined) {
                         setForm(ob)
                    }
               } catch {
                    setError('Invalid JSON')
               }
          }

     }, [str])
     return (
          <div className='h-full flex flex-col'>
               <p className='text-red-500 py-4'>
                    {
                         error !== undefined
                              ? error
                              : <>&nbsp;</>
                    }
               </p>
               <TextArea
                    id='formManager'
                    testId='formManager'
                    value={JSON.stringify(form, null, 2)}
                    className='h-full w-full flex-grow min-h-[600px] bg-slate-100'
                    onChange={(e) => {
                         setStr(e)
                    }}
               />
          </div>
     )
}

const FieldLabelText = (field: IField): ReactElement => {
     const required = field.required ? <span className='text-red-500'>*</span> : null
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
               <Checkbox id={field.id} testId={field.id} label={<strong>{field.label}</strong>} className='font-bold' value={value} onChange={(e) => {
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
                    <div className={`${radioField?.layout === 'vertical' ? 'flex flex-col gap-2' : 'flex flex-row gap-4'}`}>
                         {
                              radioField.options.map((option) => {
                                   return <label key={option.value}>
                                        <input
                                             type='radio'
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
               <h2 className='text-2xl pb-4 font-bold'>{form.label}</h2>
               {
                    form.description !== undefined
                         ? <p className='pb-4'>{form.description}</p>
                         : null
               }
               <div className='flex flex-col gap-4'>
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
               <div className='flex flex-col gap-4'>
                    {
                         uniqueFields.map(field => {
                              return (
                                   <div key={field.id} className='flex flex-row gap-2'>
                                        <div>
                                             <span className='font-bold'>{field.label}</span>
                                             <span className='text-xs bg-slate-600 text-white p-2 rounded-md'>{field.id}</span>
                                        </div>
                                        <div>
                                             <Input id={`map:${field.id}`} testId={`map:${field.id}`} value={mapping.fields?.[field.id]?.xpath} onChange={(e) => {
                                                  if (e !== undefined && e !== '') {
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
     const [formMapping] = useAtom(formMappingAtom)
     return (
          <pre>
               {JSON.stringify(form, null, 2)}
          </pre>
     )
}



export default FormManager