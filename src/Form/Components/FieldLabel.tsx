import { type IFormField } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

export const FieldLabelText = (field: IFormField): ReactElement => {
  return (
    <strong>{field.label} { field.required === true ? <span className=***REMOVED***text-red-500***REMOVED***>*</span> : ***REMOVED******REMOVED***}</strong>
  )
}

const FieldLabel = (field: IFormField): ReactElement => {
  return <p className=***REMOVED***pb-2***REMOVED***><FieldLabelText {...field} /></p>
}

export default FieldLabel
