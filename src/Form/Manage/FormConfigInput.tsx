import { type IForm } from '@/Form/Creator/FormCreatorTypes'
import { CopyButton } from '@/Form/Manage/CopyableJSONOutput'
import { TextArea } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement, useState, useEffect } from 'react'

const validateForm = (form: IForm): string | undefined => {
  if (form.label === undefined) {
    return ('Label is required')
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
                 <div className='h-full relative'>
                <CopyButton string={JSON.stringify(form, null, 2)} className='absolute right-10 top-10 pointer-events-auto' />
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
            </div>
  )
}

export default FormConfigInput
