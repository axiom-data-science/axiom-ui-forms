import InlineMarkdown from ***REMOVED***@/Form/Components/InlineMarkdown***REMOVED***
import { type IFormField } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { Tooltip } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { InfoCircledIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

export const FieldDescriptionTooltip = (field: IFormField): ReactElement => {
  return (
    field.description !== undefined
      ? <Tooltip tooltipWrapperClassName=***REMOVED***!z-50***REMOVED*** content={<span className=***REMOVED***leading-6***REMOVED***>{field.description}</span>} contentClassName=***REMOVED***max-w-[400px]***REMOVED***><InfoCircledIcon /></Tooltip>
      : <></>
  )
}

export const FieldLabelText = (field: IFormField): ReactElement => {
  return (
    <strong><InlineMarkdown>{field.label}</InlineMarkdown> { field.required === true ? <span className=***REMOVED***text-red-500***REMOVED***>*</span> : ***REMOVED******REMOVED***}</strong>
  )
}

export const FieldDescriptionText = (field: IFormField): ReactElement => {
  return (
    <>{
      field.description !== undefined
        ? <p className=***REMOVED***text-xs py-2***REMOVED***><InlineMarkdown>{field.description}</InlineMarkdown></p>
        : ***REMOVED******REMOVED***
    }</>
  )
}

const FieldLabel = (field: IFormField): ReactElement => {
  return <>
    <p><FieldLabelText {...field} /></p>
    <FieldDescriptionText {...field} />

  </>
}

export default FieldLabel
