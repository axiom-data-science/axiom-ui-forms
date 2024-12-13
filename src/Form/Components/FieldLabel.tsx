import { type IFormField } from '@/Form/FormCreatorTypes'
import React, { type ReactElement } from 'react'

export const FieldLabelText = (field: IFormField): ReactElement => {
  return (
    <strong>{field.label} { field.required === true ? <span className='text-red-500'>*</span> : ''}</strong>
  )
}

const FieldLabel = (field: IFormField): ReactElement => {
  return <p className='pb-2'><FieldLabelText {...field} /></p>
}

export default FieldLabel
