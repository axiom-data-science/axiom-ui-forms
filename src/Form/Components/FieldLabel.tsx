import InlineMarkdown from '@/Form/Components/InlineMarkdown'
import { type IValueType, type IFormField, type IValueChangeFn } from '@/Form/Creator/FormCreatorTypes'
import { makeJsonPath } from '@/utils/getters'
import { Tooltip, utils } from '@axdspub/axiom-ui-utilities'
import { Cross2Icon, InfoCircledIcon, PlusIcon, ReloadIcon } from '@radix-ui/react-icons'
import { isEqual } from 'lodash-es'
import React, { useState, type ReactElement } from 'react'
import { createPortal } from 'react-dom'

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

const LongDescriptionModal = ({field, setShowModal}: { field: IFormField, setShowModal: (show: boolean) => void }): ReactElement => {
  const longDescription = field.long_description ?? ''
  return (
    createPortal(
      <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center' onClick={() => { 
        setShowModal(false) 
        }}>
        <div className='absolute top-10 right-10 left-10 bg-white shadow-xl p-10' onClick={(e) => { e.stopPropagation() }}>
          <Cross2Icon className='absolute top-4 right-4 cursor-pointer hover:text-slate-500 w-6 h-6' onClick={() => setShowModal(false)} />
          <InlineMarkdown>{longDescription}</InlineMarkdown>
        </div>
      </div>,
      window.document.body
    )
  )
}

export const FieldDescriptionTooltip = ({ field, disabled }: { field: IFormField, disabled?: boolean }): ReactElement => {
  const hasLongDescription = field.long_description !== undefined && field.long_description !== null && field.long_description !== ''
  const [showModal, setShowModal] = useState(false)
  return (
    <>{
    field.description !== undefined || hasLongDescription
      ? <span onClick={() => {
        if (hasLongDescription) {
          setShowModal(true)
        }
      }}>
        <Tooltip
          tooltipWrapperClassName='!z-50'
          content={<span className='leading-6'><InlineMarkdown>{field.description}</InlineMarkdown>{hasLongDescription && <span className='italic block text-xs my-1'><PlusIcon className='inline w-3 h-3 -mt-1 mr-0' /> Click for more information</span>}</span>}
          contentClassName='max-w-[400px]'

        ><InfoCircledIcon className={`${hasLongDescription ? '-my-1 p-1 rounded-2xl shadow-md w-6 h-6 text-blue-600' : 'w-4 h-4'}`} /></Tooltip>
        </span>
      : <></>
      }{
       showModal && <LongDescriptionModal field={field} setShowModal={setShowModal} />
      }</>
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
  const [showModal, setShowModal] = useState(false)
  const hasLongDescription = field.long_description !== undefined && field.long_description !== null && field.long_description !== ''
  const hasDescription = field.description !== undefined && field.description !== null && field.description !== ''
  const longDescriptionButton = hasLongDescription
    ? <span className={`${hasDescription ? 'ml-2' : ''} text-xs text-blue-500  p-1 rounded-2xl cursor-pointer  hover:text-blue-700 shadow-md -my-2`} onClick={() => {
      setShowModal(true)
    }}>
      <Tooltip content='Click for more information'>
        <InfoCircledIcon className='inline w-4 h-4 -mt-1 mr-0' /> {!hasDescription && 'More'}
      </Tooltip>
    </span>
    : null
  return (
    <>{
        (hasDescription || hasLongDescription) && <p className='text-xs pb-2'><InlineMarkdown>{field.description}</InlineMarkdown>{longDescriptionButton}</p>
    }
    {
       showModal && <LongDescriptionModal field={field} setShowModal={setShowModal} />
      }
    </>
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
