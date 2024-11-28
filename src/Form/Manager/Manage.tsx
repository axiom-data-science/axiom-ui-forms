import { type IFormField, type IForm, type IRadioField, type ISelectField } from '@/Form/FormCreatorTypes'
import { Checkbox, Input, SelectInput, Tabs, TextArea } from '@axdspub/axiom-ui-utilities'
import { useAtom } from 'jotai'
import React, { type ReactElement, useEffect, useState } from 'react'
import set from 'lodash/set'
import formAtom from '@/state/formAtom'
import formMappingAtom from '@/state/formMappingAtom'
import { CopyIcon, PlusIcon } from '@radix-ui/react-icons'

const FormManager = (): ReactElement => {
  const sections = [
    {
      id: 'config',
      label: 'Form config',
      content: <FormSchemaInput />
    },
    {
      id: 'mapping',
      label: 'Form mapping',
      content: <FormMappingInput />
    },
    {
      id: 'output',
      label: 'Output',
      content: <FormOutput />
    }
  ]
  const display: 'stack' | 'tab' = 'stack'
  return (
          <div className='flex flex-col h-full gap-4 p-20'>
               <div className='grid grid-cols-2 gap-8 flex-grow'>

               <Form />

                    <div className='flex flex-col gap-4'>
                      {
                        display === 'stack'
                          ? <div className='flex flex-col gap-8 justify-between'>{sections.map(section => {
                            const { content } = section
                            return <div key={section.id}><p className='text-lg font-bold pb-2'>{section.label}</p><div className='max-h-[300px] overflow-auto'>{content}</div></div>
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
    return ('Label is required')
  }
  if (form.fields === undefined) {
    return ('At least one field is required')
  }
  if (form.fields.length > Object.keys(Object.fromEntries(form.fields.map((field: IFormField) => [field.id, field]))).length) {
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
               { error !== undefined
                 ? <p className='text-red-500 py-4'>
                    {error}
                </p>
                 : ''
               }
               <TextArea
                    id='formManager'
                    testId='formManager'
                    value={JSON.stringify(form, null, 2)}
                    className='h-full mt-0 w-full flex-grow shadow-inner-xl bg-slate-50'
                    onChange={(e) => {
                      setStr(e)
                    }}
               />
          </div>
  )
}

const FieldLabelText = (field: IFormField): ReactElement => {
  const required = field.required ? <span className='text-red-500'>*</span> : null
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
               <Checkbox id={field.id} testId={field.id} label={<strong>{field.label}</strong>} className='font-bold' value={value} onChange={(e) => {
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
                                        {
                                          field.multiple === true
                                            ? <>
                                                <Field field={field} onChange={() => {
                                                  setForm({ ...form })
                                                }} /> <PlusIcon className='w-6 h-6 text-slate-400' onClick={() => {

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
               <div className='flex flex-col gap-4'>
                    {
                         uniqueFields.map(field => {
                           return (
                                   <div key={field.id} className='flex flex-row gap-2'>
                                        <div>
                                             <Input placeholder='Output path' label={<span className='pb-2'>
                                                  <span className='text-xs bg-slate-100  p-1 float-right text-rose-700'>{field.id}</span>
                                                  {field.label}
                                             </span>} id={`map:${field.id}`} testId={`map:${field.id}`} value={mapping.fields?.[field.id]?.xpath} onChange={(e) => {
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
  return (<div className='relative' onClick={() => {
    navigator.clipboard.writeText(JSON.stringify(output, null, 2))
      .then(() => {
        console.log('Copied!')
      })
      .catch(e => {
        console.log('Error!')
      })
  }}>
          <CopyIcon className='absolute top-4 right-4 w-10 h-10 text-slate-400 pointer-events-none' />
          <pre className='p-10 bg-slate-200 hover:bg-slate-300 text-slate-600 select-none cursor-pointer'>
               {JSON.stringify(output, null, 2)}
          </pre>
          </div>
  )
}

export default FormManager
