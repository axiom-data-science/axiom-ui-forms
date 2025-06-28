import InlineMarkdown from '@/Form/Components/InlineMarkdown'
import { type IFormField } from '@/Form/Creator/FormCreatorTypes'
import { Tooltip } from '@axdspub/axiom-ui-utilities'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import React, { type ReactElement } from 'react'

export const FieldDescriptionTooltip = ({ field, disabled }: { field: IFormField, disabled?: boolean }): ReactElement => {
  return (
    field.description !== undefined
      ? <Tooltip tooltipWrapperClassName='!z-50' content={<span className='leading-6'>{field.description}</span>} contentClassName='max-w-[400px]'><InfoCircledIcon /></Tooltip>
      : <></>
  )
}

export const FieldLabelText = ({ field, disabled }: { field: IFormField, disabled?: boolean }): ReactElement => {
  return (
    <strong className={disabled ? 'text-slate-400' : ''}><InlineMarkdown>{field.label}</InlineMarkdown> { field.required === true ? <span className='text-red-500'>*</span> : ''}</strong>
  )
}

export const FieldDescriptionText = ({ field, disabled }: { field: IFormField, disabled?: boolean }): ReactElement => {
  return (
    <>{
      field.description !== undefined
        ? <p className='text-xs pb-2'><InlineMarkdown>{field.description}</InlineMarkdown></p>
        : ''
    }</>
  )
}

const FieldLabel = ({ field, disabled }: { field: IFormField, disabled?: boolean }): ReactElement => {
  return <>
    <p className='pb-2'><FieldLabelText field={field} disabled={disabled} /></p>
    <FieldDescriptionText field={field} disabled={disabled} />

  </>
}

export default FieldLabel
