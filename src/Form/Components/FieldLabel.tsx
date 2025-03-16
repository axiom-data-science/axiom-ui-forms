import { type IFormField } from '@/Form/Creator/FormCreatorTypes'
import React, { type ReactElement } from 'react'

export const FieldLabelText = (field: IFormField): ReactElement => {
  return (
    <strong>{field.label} { field.required === true ? <span className='text-red-500'>*</span> : ''}</strong>
  )
}

export const FieldDescriptionText = (field: IFormField): ReactElement => {
  return (
    <>{
      field.description !== undefined
        ? <p className='text-xs py-2'>{field.description}</p>
        : ''
    }</>
  )
}

const FieldLabel = (field: IFormField): ReactElement => {
  return <>
    <p><FieldLabelText {...field} /></p>
    <FieldDescriptionText {...field} />

  </>
}

export default FieldLabel
