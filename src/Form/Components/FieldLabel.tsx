import InlineMarkdown from '@/Form/Components/InlineMarkdown'
import { type IValueType, type IFormField, type IValueChangeFn } from '@/Form/Creator/FormCreatorTypes'
import { makeJsonPath } from '@/utils/getters'
import { Tooltip, utils } from '@axdspub/axiom-ui-utilities'
import { InfoCircledIcon, PlusIcon, ReloadIcon } from '@radix-ui/react-icons'
import { isEqual } from 'lodash-es'
import React, { type ReactElement } from 'react'

const SHOW_DEBUG = import.meta?.env?.VITE_SHOW_DEBUG === 'true'
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
  const hasLongDescription = field.long_description !== undefined && field.long_description !== null && field.long_description !== ''
  const longDescription = field.long_description ?? ''
  return (
    field.description !== undefined
      ? <span onClick={() => {
        if (hasLongDescription) {
          window.open(longDescription, '_blank')
        }
      }}>
        <Tooltip
          tooltipWrapperClassName='!z-50'
          content={<span className='leading-6'><InlineMarkdown>{field.description}</InlineMarkdown>{hasLongDescription && <span className='text-xs text-slate-400'><PlusIcon className='inline w-4 h-4 mt-0' /> Click for more information</span>}</span>}
          contentClassName='max-w-[400px]'

        ><InfoCircledIcon /></Tooltip>
        </span>
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
    })}>
      <InlineMarkdown>{field.label}</InlineMarkdown>
      { SHOW_DEBUG && <span className='text-xs text-slate-400'>{field.id}</span> }
      { field.required === true ? <span className='text-red-500'>*</span> : ''}
      { field.label !== '' && <FieldRevertToDefault field={field} disabled={disabled} value={value} onChange={onChange} /> }
      { SHOW_DEBUG && <span className={SHOW_DEBUG ? '' : 'hidden'}><br /><span className='text-xs text-slate-400'>{makeJsonPath(field) ?? 'NA'}</span></span>}
    </span>
  )
}

export const FieldDescriptionText = ({ field, disabled }: { field: IFormField, disabled?: boolean }): ReactElement => {
  const hasLongDescription = field.long_description !== undefined && field.long_description !== null && field.long_description !== ''
  const longDescription = field.long_description ?? ''
  const longDescriptionButton = hasLongDescription
    ? <span className='ml-2 text-xs text-white bg-slate-400 p-1 px-2 rounded-md cursor-pointer hover:bg-slate-500' onClick={() => {
      window.open(longDescription, '_blank')
    }}><PlusIcon className='inline w-3 h-3 -mt-1 mr-0' /> More</span>
    : null
  return (
    <>{
      field.description !== undefined
        ? <p className='text-xs pb-2'><InlineMarkdown>{field.description}</InlineMarkdown>{longDescriptionButton}</p>
        : longDescriptionButton
    }</>
  )
}

const FieldLabel = ({ field, disabled, value, onChange, className }: { field: IFormField, disabled?: boolean, value?: IValueType, onChange?: IValueChangeFn, className?: string }): ReactElement => {
  return <>{
      field.label !== undefined && field.label !== null && <p className='pb-2'><FieldLabelText field={field} disabled={disabled} value={value} onChange={onChange} />{
        field.settings?.descriptionPresentation === 'tooltip'
          ? <> <FieldDescriptionTooltip field={field} disabled={disabled} /></>
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
