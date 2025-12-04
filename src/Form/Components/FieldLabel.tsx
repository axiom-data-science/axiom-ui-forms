import config from ***REMOVED***@/config/environment***REMOVED***
import InlineMarkdown from ***REMOVED***@/Form/Components/InlineMarkdown***REMOVED***
import { type IValueType, type IFormField, type IValueChangeFn } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { makeJsonPath } from ***REMOVED***@/utils/getters***REMOVED***
import { Tooltip, utils } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { Cross2Icon, InfoCircledIcon, PlusIcon, ReloadIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import { isEqual } from ***REMOVED***lodash-es***REMOVED***
import React, { useState, type ReactElement } from ***REMOVED***react***REMOVED***
import { createPortal } from ***REMOVED***react-dom***REMOVED***

const SHOW_DEBUG = config.SHOW_DEBUG
export const FieldRevertToDefault = ({ field, disabled, value, onChange }: { field: IFormField, disabled?: boolean, value?: IValueType, onChange?: IValueChangeFn }): ReactElement => {
  const isDifferent = onChange !== undefined && !field.multiple && field.defaultValue !== undefined && !isEqual(value, field.defaultValue)
  return (
    isDifferent
      ? <span data-testid="revert-to-default" className={disabled ? ***REMOVED***cursor-not-allowed***REMOVED*** : ***REMOVED***cursor-pointer***REMOVED***} onClick={() => {
        if (disabled !== true) {
          onChange(field.defaultValue)
        }
      }}><Tooltip content={`Reset to default value${String(field.defaultValue) !== String({}) ? ` (${String(field.defaultValue ?? ***REMOVED***NA***REMOVED***)})` : ***REMOVED******REMOVED***}`}><ReloadIcon className=***REMOVED***inline-block ml-2 cursor-pointer hover:text-slate-500***REMOVED*** /></Tooltip></span>
      : <></>
  )
}

const LongDescriptionModal = ({field, setShowModal}: { field: IFormField, setShowModal: (show: boolean) => void }): ReactElement => {
  const longDescription = field.long_description ?? ***REMOVED******REMOVED***
  return (
    createPortal(
      <div className=***REMOVED***fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center***REMOVED*** onClick={() => { 
        setShowModal(false) 
        }}>
        <div className=***REMOVED***absolute top-10 right-10 left-10 bg-white shadow-xl p-10***REMOVED*** onClick={(e) => { e.stopPropagation() }}>
          <Cross2Icon className=***REMOVED***absolute top-4 right-4 cursor-pointer hover:text-slate-500 w-6 h-6***REMOVED*** onClick={() => setShowModal(false)} />
          <InlineMarkdown>{longDescription}</InlineMarkdown>
        </div>
      </div>,
      window.document.body
    )
  )
}

export const FieldDescriptionTooltip = ({ field, disabled }: { field: IFormField, disabled?: boolean }): ReactElement => {
  const hasLongDescription = field.long_description !== undefined && field.long_description !== null && field.long_description !== ***REMOVED******REMOVED***
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
          tooltipWrapperClassName=***REMOVED***!z-50***REMOVED***
          content={<span className=***REMOVED***leading-6***REMOVED***><InlineMarkdown>{field.description}</InlineMarkdown>{hasLongDescription && <span className=***REMOVED***italic block text-xs my-1***REMOVED***><PlusIcon className=***REMOVED***inline w-3 h-3 -mt-1 mr-0***REMOVED*** /> Click for more information</span>}</span>}
          contentClassName=***REMOVED***max-w-[400px]***REMOVED***

        ><InfoCircledIcon className={`${hasLongDescription ? ***REMOVED***-my-1 p-1 rounded-2xl shadow-md w-6 h-6 text-blue-600***REMOVED*** : ***REMOVED***w-4 h-4***REMOVED***}`} /></Tooltip>
        </span>
      : <></>
      }{
       showModal && <LongDescriptionModal field={field} setShowModal={setShowModal} />
      }</>
  )
}

export const FieldLabelText = ({ field, disabled, value, onChange, className }: { field: IFormField, disabled?: boolean, value?: IValueType, onChange?: IValueChangeFn, className?: string }): ReactElement => {
  if (field.label === undefined || field.label === null || field.label === ***REMOVED******REMOVED***) {
    return <></>
  }
  return (
    <span className={utils.makeClassName({
      className,
      defaultClassName: ***REMOVED***font-semibold***REMOVED***,
      extras: [
        disabled ? ***REMOVED***cursor-not-allowed opacity-70***REMOVED*** : ***REMOVED******REMOVED***,
        field.level !== undefined && field.type !== ***REMOVED***object***REMOVED*** && field.multiple !== true
          ? ***REMOVED***font-normal***REMOVED***
          : undefined,
        field.level !== undefined && field.level > 1
          ? ***REMOVED***text-sm***REMOVED***
          : undefined

      ]
    })}>
      <InlineMarkdown>{field.label}</InlineMarkdown>
      { SHOW_DEBUG && <span className=***REMOVED***text-xs text-slate-400***REMOVED***>{field.id}</span> }
      { field.required === true ? <span className=***REMOVED***text-red-500***REMOVED***>*</span> : ***REMOVED******REMOVED***}
      { field.label !== ***REMOVED******REMOVED*** && <FieldRevertToDefault field={field} disabled={disabled} value={value} onChange={onChange} /> }
      { SHOW_DEBUG && <span className={SHOW_DEBUG ? ***REMOVED******REMOVED*** : ***REMOVED***hidden***REMOVED***}><br /><span className=***REMOVED***text-xs text-slate-400***REMOVED***>{makeJsonPath(field) ?? ***REMOVED***NA***REMOVED***}</span></span>}
    </span>
  )
}

export const FieldDescriptionText = ({ field, disabled }: { field: IFormField, disabled?: boolean }): ReactElement => {
  const [showModal, setShowModal] = useState(false)
  const hasLongDescription = field.long_description !== undefined && field.long_description !== null && field.long_description !== ***REMOVED******REMOVED***
  const hasDescription = field.description !== undefined && field.description !== null && field.description !== ***REMOVED******REMOVED***
  const longDescriptionButton = hasLongDescription
    ? <span className={`${hasDescription ? ***REMOVED***ml-2***REMOVED*** : ***REMOVED******REMOVED***} text-xs text-blue-500  p-1 rounded-2xl cursor-pointer  hover:text-blue-700 shadow-md -my-2`} onClick={() => {
      setShowModal(true)
    }}>
      <Tooltip content=***REMOVED***Click for more information***REMOVED***>
        <InfoCircledIcon className=***REMOVED***inline w-4 h-4 -mt-1 mr-0***REMOVED*** /> {!hasDescription && ***REMOVED***More***REMOVED***}
      </Tooltip>
    </span>
    : null
  return (
    <>{
        (hasDescription || hasLongDescription) && <p className=***REMOVED***text-xs pb-2***REMOVED***><InlineMarkdown>{field.description}</InlineMarkdown>{longDescriptionButton}</p>
    }
    {
       showModal && <LongDescriptionModal field={field} setShowModal={setShowModal} />
      }
    </>
  )
}

const FieldLabel = ({ field, disabled, value, onChange, className }: { field: IFormField, disabled?: boolean, value?: IValueType, onChange?: IValueChangeFn, className?: string }): ReactElement => {
  return <>{
      field.label !== undefined && field.label !== null && <p className=***REMOVED***pb-2***REMOVED***><FieldLabelText field={field} disabled={disabled} value={value} onChange={onChange} />{
        field.settings?.descriptionPresentation === ***REMOVED***tooltip***REMOVED***
          ? <> <FieldDescriptionTooltip field={field} disabled={disabled} /></>
          : <></>
      }</p>
    }
    {
      field.settings?.descriptionPresentation === ***REMOVED***inline***REMOVED*** || field.settings?.descriptionPresentation === undefined
        ? <FieldDescriptionText field={field} disabled={disabled} />
        : <></>
    }
  </>
}

export default FieldLabel
