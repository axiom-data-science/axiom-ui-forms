import InlineMarkdown from ***REMOVED***@/Form/Components/InlineMarkdown***REMOVED***
import { type IValueType, type IFormField, type IValueChangeFn } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { Tooltip, utils } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { InfoCircledIcon, ReloadIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import { isEqual } from ***REMOVED***lodash-es***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

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

export const FieldDescriptionTooltip = ({ field, disabled }: { field: IFormField, disabled?: boolean }): ReactElement => {
  return (
    field.description !== undefined
      ? <Tooltip tooltipWrapperClassName=***REMOVED***!z-50***REMOVED*** content={<span className=***REMOVED***leading-6***REMOVED***>{field.description}</span>} contentClassName=***REMOVED***max-w-[400px]***REMOVED***><InfoCircledIcon /></Tooltip>
      : <></>
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
    })}><InlineMarkdown>{field.label}</InlineMarkdown> { field.required === true ? <span className=***REMOVED***text-red-500***REMOVED***>*</span> : ***REMOVED******REMOVED***}{
      field.label !== ***REMOVED******REMOVED*** && <FieldRevertToDefault field={field} disabled={disabled} value={value} onChange={onChange} />
    }</span>
  )
}

export const FieldDescriptionText = ({ field, disabled }: { field: IFormField, disabled?: boolean }): ReactElement => {
  return (
    <>{
      field.description !== undefined
        ? <p className=***REMOVED***text-xs pb-2***REMOVED***><InlineMarkdown>{field.description}</InlineMarkdown></p>
        : ***REMOVED******REMOVED***
    }</>
  )
}

const FieldLabel = ({ field, disabled, value, onChange, className }: { field: IFormField, disabled?: boolean, value?: IValueType, onChange?: IValueChangeFn, className?: string }): ReactElement => {
  return <>{
      field.label !== undefined && field.label !== null && <p className=***REMOVED***pb-2***REMOVED***><FieldLabelText field={field} disabled={disabled} value={value} onChange={onChange} />{
        field.settings?.descriptionPresentation === ***REMOVED***tooltip***REMOVED***
          ? <FieldDescriptionTooltip field={field} disabled={disabled} />
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
