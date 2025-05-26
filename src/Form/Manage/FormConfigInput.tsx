import JSONInputLoader from '@/Form/Components/Inputs/JSONInputLoader'
import { type IForm } from '@/Form/Creator/FormCreatorTypes'
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
      } catch (err: any) {
        setError(`Invalid JSON: ${err?.message}`)
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
                 <JSONInputLoader
                      field={
                        {
                          id: 'formManager',
                          label: null,
                          type: 'json'
                        }
                      }
                      value={JSON.stringify(form)}
                      className='h-full'
                      onChange={(e) => {
                        setStr(JSON.stringify(e, null, 2))
                      }}
                      />
                 </div>
            </div>
  )
}

export default FormConfigInput
