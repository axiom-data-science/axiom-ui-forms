import InlineMarkdown from ***REMOVED***@/Form/Components/InlineMarkdown***REMOVED***
import { type IFormField } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { Tooltip } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { InfoCircledIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

export const FieldDescriptionTooltip = (field: IFormField): ReactElement => {
  return (
    field.description !== undefined
      ? <Tooltip content={field.description} contentClassName=***REMOVED***max-w-[300px] leading-6***REMOVED*** className=***REMOVED***z-50***REMOVED***><InfoCircledIcon /></Tooltip>
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
