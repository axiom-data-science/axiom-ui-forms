import Field from '@/Form/Manager/Field/Field'
import { getUniqueFormFields } from '@/Form/Manager/helpers'
import formAtom from '@/state/formAtom'
import { useAtom } from 'jotai'
import React, { useEffect, type ReactElement } from 'react'
import { base64ToJson, jsonToBase64 } from '@/helpers'
import { type IForm } from '@/Form/FormCreatorTypes'

const Form = (): ReactElement => {
  const [form, setForm] = useAtom(formAtom)
  const uniqueFields = getUniqueFormFields(form)
  useEffect(() => {
    const base64String = jsonToBase64<IForm>(form)
    const decodedForm = base64ToJson<IForm>(base64String)

    console.log(base64String.length)
    console.log(decodedForm)
  }, [form])
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
                                            <Field field={field} onChange={() => {
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

export default Form
