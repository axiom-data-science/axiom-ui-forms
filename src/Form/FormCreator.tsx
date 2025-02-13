import FieldCreator from '@/Form/Components/FieldCreator'
import { type IFormValues, type IForm, type IValueChangeFn } from '@/Form/FormCreatorTypes'
import { copyAndAddPathToFields } from '@/Form/helpers'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import React, { useEffect, useState, type ReactElement } from 'react'

const FormCreator = ({
  form,
  formValueState,
  note,
  error,
  onChange
}: {
  form: IForm
  formValueState: [IFormValues, (v: IFormValues) => void]
  note?: string
  error?: string
  onChange?: IValueChangeFn

}): ReactElement => {
  const [activeForm, setActiveForm] = useState<IForm | null>(null)
  useEffect(() => {
    const newForm = copyAndAddPathToFields<IForm>(form)
    setActiveForm(newForm)
  }, [form])
  if (activeForm === null) {
    return <p>Processing</p>
  }
  return (
      <>
      <div>
        <h2 className='text-2xl pb-4 font-bold'>{form.label}</h2>
        {
            note !== undefined
              ? <p className='pb-4'>{note}</p>
              : null
        }
        {
            error !== undefined
              ? <p className='pb-4 text-rose-800'><ExclamationTriangleIcon className='inline mr-2' /> {error}</p>
              : null
        }
        {
            activeForm.description !== undefined
              ? <p className='pb-4'>{form.description}</p>
              : null
        }
        <div className='flex flex-col gap-2'>
        {
        activeForm.fields.map((field) => {
          return (
            <FieldCreator onChange={onChange} field={field} key={field.id} formValueState={formValueState} />
          )
        })
        }
        </div>
      </div>
      </>
  )
}

export default FormCreator
