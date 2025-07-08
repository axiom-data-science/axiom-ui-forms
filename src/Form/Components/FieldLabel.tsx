import InlineMarkdown from '@/Form/Components/InlineMarkdown'
import { type IValueType, type IFormField, type IValueChangeFn } from '@/Form/Creator/FormCreatorTypes'
import { Tooltip, utils } from '@axdspub/axiom-ui-utilities'
import { InfoCircledIcon, ReloadIcon } from '@radix-ui/react-icons'
import { isEqual } from 'lodash-es'
import React, { type ReactElement } from 'react'

export const FieldRevertToDefault = ({ field, disabled, value, onChange }: { field: IFormField, disabled?: boolean, value?: IValueType, onChange?: IValueChangeFn }): ReactElement => {
  const isDifferent = onChange !== undefined && !field.multiple && field.defaultValue !== undefined && !isEqual(value, field.defaultValue)
  return (
    isDifferent
      ? <span data-testid="revert-to-default" className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'} onClick={() => {
        if (disabled !== true) {
          onChange(field.defaultValue)
        }
      }}><Tooltip content={`Reset to default value${String(field.defaultValue) !== String({}) ? ` (${String(field.defaultValue ?? 'NA')})` : ''}`}><ReloadIcon className='inline-block ml-2 cursor-pointer hover:text-slate-500' /></Tooltip></span>
      : <></>
  )
}

export const FieldDescriptionTooltip = ({ field, disabled }: { field: IFormField, disabled?: boolean }): ReactElement => {
  return (
    field.description !== undefined
      ? <Tooltip tooltipWrapperClassName='!z-50' content={<span className='leading-6'>{field.description}</span>} contentClassName='max-w-[400px]'><InfoCircledIcon /></Tooltip>
      : <></>
  )
}

export const FieldLabelText = ({ field, disabled, value, onChange, className }: { field: IFormField, disabled?: boolean, value?: IValueType, onChange?: IValueChangeFn, className?: string }): ReactElement => {
  if (field.label === undefined || field.label === null || field.label === '') {
    return <></>
  }
  return (
    <span className={utils.makeClassName({
      className,
      defaultClassName: 'font-semibold',
      extras: [
        disabled ? 'cursor-not-allowed opacity-70' : '',
        field.level !== undefined && field.type !== 'object' && field.multiple !== true
          ? 'font-normal'
          : undefined,
        field.level !== undefined && field.level > 1
          ? 'text-sm'
          : undefined

      ]
    })}><InlineMarkdown>{field.label}</InlineMarkdown> { field.required === true ? <span className='text-red-500'>*</span> : ''}{
      field.label !== '' && <FieldRevertToDefault field={field} disabled={disabled} value={value} onChange={onChange} />
    }</span>
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

const FieldLabel = ({ field, disabled, value, onChange, className }: { field: IFormField, disabled?: boolean, value?: IValueType, onChange?: IValueChangeFn, className?: string }): ReactElement => {
  return <>{
      field.label !== undefined && field.label !== null && <p className='pb-2'><FieldLabelText field={field} disabled={disabled} value={value} onChange={onChange} />{
        field.settings?.descriptionPresentation === 'tooltip'
          ? <FieldDescriptionTooltip field={field} disabled={disabled} />
          : <></>
      }</p>
    }
    {
      field.settings?.descriptionPresentation === 'inline' || field.settings?.descriptionPresentation === undefined
        ? <FieldDescriptionText field={field} disabled={disabled} />
        : <></>
    }
  </>
}

export default FieldLabel
