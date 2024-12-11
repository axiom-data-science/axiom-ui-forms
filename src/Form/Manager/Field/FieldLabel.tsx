import { type IFormField } from '@/Form/FormCreatorTypes'
import React, { type ReactElement } from 'react'

export const FieldLabelText = (field: IFormField): ReactElement => {
  const required = field.required ? <span className='text-red-500'>*</span> : null
  const label = <strong>{field.label} {required}</strong>
  return label
}

const FieldLabel = (field: IFormField): ReactElement => {
  return <p className='pb-2'><FieldLabelText {...field} /></p>
}

export default FieldLabel
