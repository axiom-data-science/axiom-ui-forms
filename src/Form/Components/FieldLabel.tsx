import { type IFormField } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

export const FieldLabelText = (field: IFormField): ReactElement => {
  return (
    <strong>{field.label} { field.required === true ? <span className=***REMOVED***text-red-500***REMOVED***>*</span> : ***REMOVED******REMOVED***}</strong>
  )
}

export const FieldDescriptionText = (field: IFormField): ReactElement => {
  return (
    <>{
      field.description !== undefined
        ? <p className=***REMOVED***text-xs py-2***REMOVED***>{field.description}</p>
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
