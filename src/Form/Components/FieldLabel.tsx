import config from ***REMOVED***@/config/environment***REMOVED***
import InlineMarkdown from ***REMOVED***@/Form/Components/InlineMarkdown***REMOVED***
import {
  type IValueType,
  type IFormField,
  type IValueChangeFn,
} from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { makeJsonPath } from ***REMOVED***@/utils/getters***REMOVED***
import { Tooltip, utils } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { Cross2Icon, InfoCircledIcon, PlusIcon, ReloadIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import { isEqual } from ***REMOVED***lodash-es***REMOVED***
import React, { useEffect, useState, type ReactElement } from ***REMOVED***react***REMOVED***
import { createPortal } from ***REMOVED***react-dom***REMOVED***

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
      className={disabled ? ***REMOVED***cursor-not-allowed***REMOVED*** : ***REMOVED***cursor-pointer***REMOVED***}
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
        content={`Reset to default value${String(field.defaultValue) !== String({}) ? ` (${String(field.defaultValue ?? ***REMOVED***NA***REMOVED***)})` : ***REMOVED******REMOVED***}`}
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
  const longDescription = field.long_description ?? ***REMOVED******REMOVED***
  useEffect(() => {
    document.body.classList.add(***REMOVED***overflow-hidden***REMOVED***)
    return () => {
      document.body.classList.remove(***REMOVED***overflow-hidden***REMOVED***)
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
  field.description !== ***REMOVED******REMOVED***

  const hasLongDescription =
    field.long_description !== undefined &&
    field.long_description !== null &&
    field.long_description !== ***REMOVED******REMOVED***
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
            contentClassName="max-w-[400px]"
          >
            <InfoCircledIcon
              className={`${hasLongDescription ? ***REMOVED***-my-1 p-1 rounded-2xl shadow-md w-6 h-6 text-blue-600***REMOVED*** : ***REMOVED***w-4 h-4***REMOVED***}`}
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
  if (field.label === undefined || field.label === null || field.label === ***REMOVED******REMOVED***) {
    return <></>
  }
  return (
    <span
      className={utils.makeClassName({
        className,
        defaultClassName: ***REMOVED***font-semibold***REMOVED***,
        extras: [
          disabled ? ***REMOVED***cursor-not-allowed opacity-70***REMOVED*** : ***REMOVED******REMOVED***,
          field.level !== undefined && field.type !== ***REMOVED***object***REMOVED*** && (field as {multiple?: boolean}).multiple !== true
            ? ***REMOVED***font-normal***REMOVED***
            : undefined,
          field.level !== undefined && field.level > 1 ? ***REMOVED***text-sm***REMOVED*** : undefined,
        ],
      })}
    >
      <InlineMarkdown>{field.label}</InlineMarkdown>
      {SHOW_DEBUG && <span className="text-xs text-slate-400">{field.id}</span>}
      {field.required === true ? <span className="text-red-500">*</span> : ***REMOVED******REMOVED***}
      {field.label !== ***REMOVED******REMOVED*** && (
        <FieldRevertToDefault field={field} disabled={disabled} value={value} onChange={onChange} />
      )}
      {SHOW_DEBUG && (
        <span className={SHOW_DEBUG ? ***REMOVED******REMOVED*** : ***REMOVED***hidden***REMOVED***}>
          <br />
          <span className="text-xs text-slate-400">{makeJsonPath(field) ?? ***REMOVED***NA***REMOVED***}</span>
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
  const hasLongDescription =
    field.long_description !== undefined &&
    field.long_description !== null &&
    field.long_description !== ***REMOVED******REMOVED***
  const hasDescription =
    field.description !== undefined && field.description !== null && field.description !== ***REMOVED******REMOVED***
  const longDescriptionButton = hasLongDescription ? (
    <span
      className={`${hasDescription ? ***REMOVED***ml-2***REMOVED*** : ***REMOVED******REMOVED***} text-xs text-blue-500  p-1 rounded-2xl cursor-pointer  hover:text-blue-700 shadow-md -my-2`}
      onClick={() => {
        setShowModal(true)
      }}
    >
      <Tooltip dark={true} content="Click for more information">
        <InfoCircledIcon className="inline w-4 h-4 -mt-1 mr-0" /> {!hasDescription && ***REMOVED***More***REMOVED***}
      </Tooltip>
    </span>
  ) : null
  return (
    <>
      {(hasDescription || hasLongDescription) && (
        <p className="text-xs pb-2">
          <InlineMarkdown>{field.description}</InlineMarkdown>
          {longDescriptionButton}
        </p>
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
  const descriptionPresentation = (field.settings as {descriptionPresentation?: string} | undefined)?.descriptionPresentation ?? ***REMOVED***default***REMOVED***
  return (
    <>
      {field.label !== undefined && field.label !== null && (
        <p className="pb-2">
          <FieldLabelText
            field={field}
            disabled={disabled}
            value={value}
            onChange={onChange}
            className={textClassName}
          />
          {descriptionPresentation === ***REMOVED***tooltip***REMOVED*** ? (
            <>
              {***REMOVED*** ***REMOVED***}
              <FieldDescriptionTooltip field={field} disabled={disabled} />
            </>
          ) : (
            <></>
          )}
        </p>
      )}
      {descriptionPresentation === ***REMOVED***inline***REMOVED*** ||
      descriptionPresentation === ***REMOVED***default***REMOVED*** ? (
        <FieldDescriptionText field={field} disabled={disabled} />
      ) : (
        <></>
      )}
    </>
  )
}

export default FieldLabel
