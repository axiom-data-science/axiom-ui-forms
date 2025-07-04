import InlineMarkdown from '@/Form/Components/InlineMarkdown'
import { type IValueType, type IFormField, type IValueChangeFn } from '@/Form/Creator/FormCreatorTypes'
import { Tooltip } from '@axdspub/axiom-ui-utilities'
import { InfoCircledIcon, ReloadIcon } from '@radix-ui/react-icons'
import { isEqual } from 'lodash-es'
import React, { type ReactElement } from 'react'

export const FieldDescriptionTooltip = ({ field, disabled }: { field: IFormField, disabled?: boolean }): ReactElement => {
  return (
    field.description !== undefined
      ? <Tooltip tooltipWrapperClassName='!z-50' content={<span className='leading-6'>{field.description}</span>} contentClassName='max-w-[400px]'><InfoCircledIcon /></Tooltip>
      : <></>
  )
}

export const FieldLabelText = ({ field, disabled, value, onChange }: { field: IFormField, disabled?: boolean, value?: IValueType, onChange?: IValueChangeFn }): ReactElement => {
  const isDifferent = onChange !== undefined && field.defaultValue !== undefined && !isEqual(value, field.defaultValue)
  const tooltipContent = `Reset to default value${String(field.defaultValue) !== String({}) ? ` (${String(field.defaultValue ?? 'NA')})` : ''}`
  return (
    <strong className={disabled ? 'text-slate-400' : ''}><InlineMarkdown>{field.label}</InlineMarkdown> { field.required === true ? <span className='text-red-500'>*</span> : ''}{
      isDifferent && <span data-testid="revert-to-default" className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'} onClick={() => {
        if (disabled !== true) {
          onChange(field.defaultValue)
        }
      }}><Tooltip content={tooltipContent}><ReloadIcon className='inline-block ml-2 cursor-pointer hover:text-slate-500' /></Tooltip></span>
    }</strong>
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

const FieldLabel = ({ field, disabled, value, onChange }: { field: IFormField, disabled?: boolean, value?: IValueType, onChange?: IValueChangeFn }): ReactElement => {
  return <>
    <p className='pb-2'><FieldLabelText field={field} disabled={disabled} value={value} onChange={onChange} /></p>
    <FieldDescriptionText field={field} disabled={disabled} />

  </>
}

export default FieldLabel
