import config from '@/config/environment'
import InlineMarkdown from '@/Form/Components/InlineMarkdown'
import {
  type IValueType,
  type IFormField,
  type IValueChangeFn,
} from '@/Form/Creator/FormCreatorTypes'
import { makeJsonPath } from '@/utils/getters'
import { Tooltip, utils } from '@axdspub/axiom-ui-utilities'
import { Cross2Icon, InfoCircledIcon, PlusIcon, ReloadIcon } from '@radix-ui/react-icons'
import { isEqual } from 'lodash-es'
import React, { useEffect, useState, type ReactElement } from 'react'
import { createPortal } from 'react-dom'

const SHOW_DEBUG = config.SHOW_DEBUG
export const FieldRevertToDefault = ({
  field,
  disabled,
  value,
  onChange,
}: {
  field: IFormField
  disabled?: boolean
  value?: IValueType
  onChange?: IValueChangeFn
}): ReactElement => {
  const isDifferent =
    onChange !== undefined &&
    !(field as {multiple?: boolean})?.multiple &&
    field.defaultValue !== undefined &&
    !isEqual(value, field.defaultValue)
  return isDifferent ? (
    <span
      data-testid="revert-to-default"
      className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        if (disabled !== true) {
          onChange(field.defaultValue)
        }
      }}
    >
      <Tooltip
        dark={true}
        content={`Reset to default value${String(field.defaultValue) !== String({}) ? ` (${String(field.defaultValue ?? 'NA')})` : ''}`}
      >
        <ReloadIcon className="inline-block ml-2 cursor-pointer hover:text-slate-500" />
      </Tooltip>
    </span>
  ) : (
    <></>
  )
}

const LongDescriptionModal = ({
  field,
  setShowModal,
}: {
  field: IFormField
  setShowModal: (show: boolean) => void
}): ReactElement => {
  const longDescription = field.long_description ?? ''
  useEffect(() => {
    document.body.classList.add('overflow-hidden')
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [])
  return createPortal(
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={() => {
        setShowModal(false)
      }}
    >
      <div
        className="absolute top-10 right-10 left-10 bg-white shadow-xl"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <Cross2Icon
          className="absolute top-2 right-2 cursor-pointer hover:text-slate-500 w-10 h-10 bg-white/50 z-10 p-2"
          onClick={() => setShowModal(false)}
        />
        <div className="p-10 max-h-[80vh] overflow-y-auto">
          <InlineMarkdown>{longDescription}</InlineMarkdown>
        </div>
      </div>
    </div>,
    window.document.body
  )
}

export const FieldDescriptionTooltip = ({
  field,
  disabled,
}: {
  field: IFormField
  disabled?: boolean
}): ReactElement => {

  const hasDescription = 
  field.description !== undefined && 
  field.description !== null && 
  field.description !== ''

  const hasLongDescription =
    field.long_description !== undefined &&
    field.long_description !== null &&
    field.long_description !== ''
  const [showModal, setShowModal] = useState(false)
  return (
    <>
      {(hasDescription) || hasLongDescription ? (
        <span
          onClick={() => {
            if (hasLongDescription) {
              setShowModal(true)
            }
          }}
        >
          <Tooltip
            dark={true}
            tooltipWrapperClassName="!z-50"
            content={
              <span className="leading-6">
                <InlineMarkdown>{field.description}</InlineMarkdown>
                {hasLongDescription && (
                  <span className="italic block text-xs my-1">
                    <PlusIcon className="inline w-3 h-3 -mt-1 mr-0" /> Click for more information
                  </span>
                )}
              </span>
            }
            contentClassName="max-w-100"
          >
            <InfoCircledIcon
              className={`${hasLongDescription ? '-my-1 p-1 rounded-2xl shadow-md w-6 h-6 text-blue-600' : 'w-4 h-4'}`}
            />
          </Tooltip>
        </span>
      ) : (
        <></>
      )}
      {showModal && <LongDescriptionModal field={field} setShowModal={setShowModal} />}
    </>
  )
}

export const FieldLabelText = ({
  field,
  disabled,
  value,
  onChange,
  className,
}: {
  field: IFormField
  disabled?: boolean
  value?: IValueType
  onChange?: IValueChangeFn
  className?: string
}): ReactElement => {
  if (field.label === undefined || field.label === null || field.label === '') {
    return <></>
  }
  const boldLabel = (field.settings as {boldLabel?: boolean} | undefined)?.boldLabel ?? false
  const smallLabel = (field.settings as {smallLabel?: boolean} | undefined)?.smallLabel ?? false
  return (
    <span
      className={utils.makeClassName({
        className,
        defaultClassName: 'font-semibold',
        extras: [
          disabled ? 'cursor-not-allowed opacity-70' : '',
          field.level !== undefined && field.type !== 'object' && (field as {multiple?: boolean}).multiple !== true
            ? 'font-normal'
            : undefined,
          field.level !== undefined && field.level > 1 ? 'text-sm' : undefined,
          boldLabel ? 'font-bold' : undefined,
          smallLabel ? 'text-xs' : undefined,
        ],
      })}
    >
      <InlineMarkdown>{field.label}</InlineMarkdown>
      {SHOW_DEBUG && <span className="text-xs text-slate-400">{field.id}</span>}
      {field.required === true ? <span className="text-red-500">*</span> : ''}
      {field.label !== '' && (
        <FieldRevertToDefault field={field} disabled={disabled} value={value} onChange={onChange} />
      )}
      {SHOW_DEBUG && (
        <span className={SHOW_DEBUG ? '' : 'hidden'}>
          <br />
          <span className="text-xs text-slate-400">{makeJsonPath(field) ?? 'NA'}</span>
        </span>
      )}
    </span>
  )
}

export const FieldDescriptionText = ({
  field,
  disabled,
}: {
  field: IFormField
  disabled?: boolean
}): ReactElement => {
  const [showModal, setShowModal] = useState(false)
  const isBold = (field.settings as {boldDescription?: boolean} | undefined)?.boldDescription ?? false
  const hasLongDescription =
    field.long_description !== undefined &&
    field.long_description !== null &&
    field.long_description !== ''
  const hasDescription =
    field.description !== undefined && field.description !== null && field.description !== ''
  const longDescriptionButton = hasLongDescription ? (
    <span
      className={`${hasDescription ? 'ml-2' : ''} text-xs text-blue-500  p-1 rounded-2xl cursor-pointer  hover:text-blue-700 shadow-md -my-2`}
      onClick={() => {
        setShowModal(true)
      }}
    >
      <Tooltip dark={true} content="Click for more information">
        <InfoCircledIcon className="inline w-4 h-4 -mt-1 mr-0" /> {!hasDescription && 'More'}
      </Tooltip>
    </span>
  ) : null
  return (
    <>
      {(hasDescription || hasLongDescription) && (
        <div className={`text-xs pb-2 ${isBold ? 'font-bold' : ''}`}>
          <InlineMarkdown>{field.description}</InlineMarkdown>
          {longDescriptionButton}
        </div>
      )}
      {showModal && <LongDescriptionModal field={field} setShowModal={setShowModal} />}
    </>
  )
}

export const FieldLabel = ({
  field,
  disabled,
  value,
  onChange,
  className,
  textClassName,
}: {
  field: IFormField
  disabled?: boolean
  value?: IValueType
  onChange?: IValueChangeFn
  className?: string
  textClassName?: string
}): ReactElement => {
  const descriptionPresentation = (field.settings as {descriptionPresentation?: string} | undefined)?.descriptionPresentation ?? 'default'
  return (
    <>
      {field.label !== undefined && field.label !== null && (
        <div className="pb-2">
          <FieldLabelText
            field={field}
            disabled={disabled}
            value={value}
            onChange={onChange}
            className={textClassName}
          />
          {descriptionPresentation === 'tooltip' ? (
            <>
              {' '}
              <FieldDescriptionTooltip field={field} disabled={disabled} />
            </>
          ) : (
            <></>
          )}
        </div>
      )}
      {descriptionPresentation === 'inline' ||
      descriptionPresentation === 'default' ? (
        <FieldDescriptionText field={field} disabled={disabled} />
      ) : (
        <></>
      )}
    </>
  )
}

export default FieldLabel
