import InlineMarkdown from '@/Form/Components/InlineMarkdown'
import { type IFormField } from '@/Form/Creator/FormCreatorTypes'
import { Tooltip } from '@axdspub/axiom-ui-utilities'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import React, { type ReactElement } from 'react'

export const FieldDescriptionTooltip = (field: IFormField): ReactElement => {
  return (
    field.description !== undefined
      ? <Tooltip tooltipWrapperClassName='!z-50' content={<span className='leading-6'>{field.description}</span>} contentClassName='max-w-[400px]'><InfoCircledIcon /></Tooltip>
      : <></>
  )
}

export const FieldLabelText = (field: IFormField): ReactElement => {
  return (
    <strong><InlineMarkdown>{field.label}</InlineMarkdown> { field.required === true ? <span className='text-red-500'>*</span> : ''}</strong>
  )
}

export const FieldDescriptionText = (field: IFormField): ReactElement => {
  return (
    <>{
      field.description !== undefined
        ? <p className='text-xs pb-2'><InlineMarkdown>{field.description}</InlineMarkdown></p>
        : ''
    }</>
  )
}

const FieldLabel = (field: IFormField): ReactElement => {
  return <>
    <p className='pb-2'><FieldLabelText {...field} /></p>
    <FieldDescriptionText {...field} />

  </>
}

export default FieldLabel
