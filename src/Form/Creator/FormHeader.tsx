import type { IForm } from '@/library'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import React, { type ReactElement } from 'react'

const FormHeader = ({
  form, note, error

}: {
  form: IForm
  note?: string
  error?: string
}): ReactElement => {
  return (
    <>
      <h2 className='text-2xl pb-4 font-bold'>{form.label}</h2>
      {note !== undefined
        ? <p className='pb-4'>{note}</p>
        : null}
      {error !== undefined
        ? <p className='pb-4 text-rose-800'><ExclamationTriangleIcon className='inline mr-2' /> {error}</p>
        : null}
      {form.description !== undefined
        ? <p className='pb-4'>{form.description}</p>
        : null}
    </>
  )
}

export default FormHeader
