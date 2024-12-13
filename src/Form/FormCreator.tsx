import FieldCreator from '@/Form/Components/FieldCreator'
import { type IForm } from '@/Form/FormCreatorTypes'
import { copyAndAddPathToFields } from '@/Form/helpers'
import React, { useEffect, useState, type ReactElement } from 'react'

const FormCreator = ({
  form
}: { form: IForm }): ReactElement => {
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
            activeForm.description !== undefined
              ? <p className='pb-4'>{form.description}</p>
              : null
        }
        <div className='flex flex-col gap-4'>
        {
        activeForm.fields.map((field) => {
          return (
            <FieldCreator field={field} key={field.id} />
          )
        })
        }
        </div>
      </div>
      </>
  )
}

export default FormCreator
