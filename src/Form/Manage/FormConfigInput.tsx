import { type IForm, type IFormField } from '@/Form/FormCreatorTypes'
import { TextArea } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement, useState, useEffect } from 'react'

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

const FormConfigInput = ({ formState }: { formState: [IForm, (form: IForm) => void] }): ReactElement => {
  const [form, setForm] = formState
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
                      className='h-full mt-0 w-full flex-grow min-h-[600px] shadow-inner-xl bg-slate-100'
                      onChange={(e) => {
                        setStr(e)
                      }}
                 />
            </div>
  )
}

export default FormConfigInput
